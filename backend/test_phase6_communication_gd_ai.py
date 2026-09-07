import asyncio
import uuid
import os
import sys
from unittest.mock import patch, AsyncMock
from fastapi import HTTPException

backend_dir = os.path.dirname(os.path.abspath(__file__))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from app.schemas.auth import RegisterRequest
from app.schemas.communication import GDRoomCreateRequest, GDEvaluationResponse
from app.api.auth import register
from app.api.communication import (
    create_gd_room,
    join_gd_room,
    start_gd_discussion,
    end_gd_discussion,
    evaluate_gd_participant,
    get_gd_participant_evaluation,
)


async def run_phase6_communication_gd_ai_tests():
    print("\n==================================================")
    print(" PlaceMentor AI - Phase 6 GD AI Evaluation Suite  ")
    print("==================================================")

    # 1. Register User A (Participant 1) and User B (Participant 2)
    uid_a = str(uuid.uuid4())[:8]
    email_a = f"gd_eval_user_a_{uid_a}@placementor.ai"
    reg_req_a = RegisterRequest(
        name="Candidate Alpha",
        email=email_a,
        password="Password123!",
        college="SRMIST",
        department="CSE",
        year="4th Year",
        skills=["Communication", "Python"],
    )
    res_a = await register(reg_req_a)
    user_a = res_a["user"]

    uid_b = str(uuid.uuid4())[:8]
    email_b = f"gd_eval_user_b_{uid_b}@placementor.ai"
    reg_req_b = RegisterRequest(
        name="Candidate Beta",
        email=email_b,
        password="Password123!",
        college="SRMIST",
        department="ECE",
        year="3rd Year",
        skills=["React", "Communication"],
    )
    res_b = await register(reg_req_b)
    user_b = res_b["user"]
    print(f"[OK] Registered User A ({user_a['id']}) & User B ({user_b['id']})")

    # 2. Create room by User A and Join by User B
    create_req = GDRoomCreateRequest(
        topic="AI Ethics in Software Engineering",
        max_participants=4,
        duration_minutes=15,
    )
    room = await create_gd_room(request=create_req, current_user=user_a)
    room_id = room.room_id
    await join_gd_room(room_id=room_id, current_user=user_b)
    print(f"[OK] Created and Joined Room Code: {room_id}")

    # 3. Test Active Room Evaluation Rejection (Room not ended yet)
    print("\n--- [1] Active Room Evaluation Rejection ---")
    await start_gd_discussion(room_id=room_id, current_user=user_a)
    try:
        await evaluate_gd_participant(room_id=room_id, current_user=user_a)
        assert False, "Validation failure! Active room was allowed to evaluate!"
    except HTTPException as e:
        assert e.status_code == 400
        assert "ended" in e.detail.lower()
        print("[OK] Active room evaluation rejected with HTTP 400 Bad Request.")

    # 4. Host Concludes Discussion
    await end_gd_discussion(room_id=room_id, current_user=user_a)
    print("[OK] Room concluded successfully.")

    # 5. Evaluate Ended Room for User A (Mocked Gemini API)
    print("\n--- [2] POST /api/communication/gd/rooms/{room_id}/evaluate (User A) ---")
    mock_ai_eval = {
        "overall_score": 84,
        "dimensions": {
            "participation": {
                "score": 88,
                "reason": "Active participation in a 2-user session over 15 minutes."
            },
            "clarity": {
                "score": None,
                "reason": "Detailed clarity analysis requires speech transcription. Speech audio was not recorded in this session."
            },
            "relevance": {
                "score": None,
                "reason": "Detailed topic relevance analysis requires speech transcription. Discussion transcript was unavailable."
            },
            "turn_taking": {
                "score": 82,
                "reason": "Balanced turn-taking etiquette in group discussion."
            },
            "confidence": {
                "score": 82,
                "reason": "Maintained active connection throughout discussion."
            }
        },
        "strengths": ["Consistent presence throughout discussion."],
        "suggestions": ["Practice taking concise turns."],
        "data_limitations": ["Detailed content-level relevance and clarity analysis requires speech transcription. This session was evaluated using participation and available communication signals."]
    }

    with patch("app.api.communication.evaluate_gd_session", new=AsyncMock(return_value=mock_ai_eval)):
        eval_a = await evaluate_gd_participant(room_id=room_id, current_user=user_a)
        assert isinstance(eval_a, GDEvaluationResponse)
        assert eval_a.user_id == user_a["id"]
        assert eval_a.overall_score == 84
        assert eval_a.dimensions["clarity"].score is None
        assert "speech transcription" in eval_a.dimensions["clarity"].reason.lower()
        assert eval_a.dimensions["relevance"].score is None
        assert len(eval_a.data_limitations) > 0
        print("[OK] User A evaluation generated successfully with valid score dimensions and explicit data limitations.")

    # 6. Test Repeated Evaluation Returns Cached Result (Zero extra Gemini calls)
    print("\n--- [3] Duplicate Evaluation Rate Protection (Cached Result) ---")
    with patch("app.api.communication.evaluate_gd_session", side_effect=RuntimeError("Should not call Gemini again")):
        cached_eval = await evaluate_gd_participant(room_id=room_id, current_user=user_a)
        assert cached_eval.id == eval_a.id
        assert cached_eval.overall_score == 84
        print("[OK] Duplicate evaluation returned cached MongoDB evaluation without calling AI again.")

    # 7. Test Non-Participant Evaluation Rejection
    print("\n--- [4] Non-Participant Evaluation Rejection ---")
    uid_c = str(uuid.uuid4())[:8]
    user_c = {"id": f"non_participant_{uid_c}", "name": "User C", "email": f"c_{uid_c}@placementor.ai"}
    try:
        await evaluate_gd_participant(room_id=room_id, current_user=user_c)
        assert False, "Security failure! Non-participant allowed to evaluate!"
    except HTTPException as e:
        assert e.status_code == 403
        assert "participant" in e.detail.lower()
        print("[OK] Non-participant evaluation attempt rejected with HTTP 403 Forbidden.")

    # 8. Test Private Evaluation Tenant Isolation (GET evaluation)
    print("\n--- [5] Private Evaluation Isolation Check ---")
    get_eval_a = await get_gd_participant_evaluation(room_id=room_id, current_user=user_a)
    assert get_eval_a.user_id == user_a["id"]
    print("[OK] User A successfully retrieved own evaluation.")

    try:
        await get_gd_participant_evaluation(room_id=room_id, current_user=user_b)
        assert False, "Security failure! User B accessed User A's evaluation!"
    except HTTPException as e:
        assert e.status_code == 404
        print("[OK] User B cannot access User A's evaluation (404 Not Found).")

    print("\n==================================================")
    print(" ALL GD AI EVALUATION TESTS PASSED SUCCESSFULLY! ")
    print("==================================================\n")


if __name__ == "__main__":
    asyncio.run(run_phase6_communication_gd_ai_tests())
