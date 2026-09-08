import asyncio
import uuid
import os
import sys
from fastapi import HTTPException

backend_dir = os.path.dirname(os.path.abspath(__file__))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from app.schemas.auth import RegisterRequest
from app.schemas.communication import GDRoomCreateRequest, GDRoomResponse, GDEvaluationResponse
from app.api.auth import register
from app.api.communication import (
    create_gd_room,
    join_gd_room,
    leave_gd_room,
    start_gd_discussion,
    start_gd_speaking_turn,
    stop_gd_speaking_turn,
    end_gd_discussion,
    get_gd_room_status,
    evaluate_gd_participant,
)
from app.services.gd_room_service import gd_room_manager


async def run_phase7_multiuser_gd_tests():
    print("\n==================================================")
    print(" PlaceMentor AI - Phase 7 Real Multi-User GD Suite ")
    print("==================================================")

    # 1. Register 3 users: Host (User A), Friend 1 (User B), Friend 2 (User C)
    uid_a = str(uuid.uuid4())[:8]
    user_a = (await register(RegisterRequest(
        name="Host Alpha", email=f"host_{uid_a}@placementor.ai", password="Password123!",
        college="SRMIST", department="CSE", year="4th Year", skills=["Python"]
    )))["user"]

    uid_b = str(uuid.uuid4())[:8]
    user_b = (await register(RegisterRequest(
        name="Friend Beta", email=f"beta_{uid_b}@placementor.ai", password="Password123!",
        college="SRMIST", department="ECE", year="3rd Year", skills=["React"]
    )))["user"]

    uid_c = str(uuid.uuid4())[:8]
    user_c = (await register(RegisterRequest(
        name="Friend Gamma", email=f"gamma_{uid_c}@placementor.ai", password="Password123!",
        college="SRMIST", department="IT", year="4th Year", skills=["Communication"]
    )))["user"]

    print(f"[OK] Registered Host ({user_a['id']}), Friend 1 ({user_b['id']}), Friend 2 ({user_c['id']})")

    # 2. Host creates room
    print("\n--- [1] Room Creation & Initial Lobby State ---")
    create_req = GDRoomCreateRequest(
        topic="Generative AI: Job Destroyer or Productivity Multiplier?",
        max_participants=6,
        duration_minutes=5,
    )
    room_1 = await create_gd_room(request=create_req, current_user=user_a)
    assert isinstance(room_1, GDRoomResponse)
    assert room_1.status == "waiting"
    assert room_1.duration_seconds == 300
    assert len(room_1.room_id) == 7  # GD-XXXX format
    room_id = room_1.room_id
    print(f"[OK] Room created with 6-char shareable code: {room_id}")

    # 3. Minimum participant enforcement: Host cannot start with 1 participant
    print("\n--- [2] Minimum Participant Enforcement (1/2 minimum) ---")
    try:
        await start_gd_discussion(room_id=room_id, current_user=user_a)
        assert False, "Validation failure! Allowed discussion start with only 1 participant!"
    except HTTPException as e:
        assert e.status_code == 400
        assert "minimum" in e.detail.lower() or "2 participants" in e.detail.lower()
        print("[OK] Host start rejected when participant count < 2 (1/2 minimum).")

    # 4. Friend 1 and Friend 2 join using room code
    print("\n--- [3] Friends Join Room & Broadcast State ---")
    room_after_b = await join_gd_room(room_id=room_id, current_user=user_b)
    assert len(room_after_b.participants) == 2

    room_after_c = await join_gd_room(room_id=room_id, current_user=user_c)
    assert len(room_after_c.participants) == 3
    print(f"[OK] Friend 1 & Friend 2 joined. Participant count is 3/6.")

    # 5. Only host can start discussion (Friend 1 start attempt fails)
    print("\n--- [4] Non-Host Start Rejection ---")
    try:
        await start_gd_discussion(room_id=room_id, current_user=user_b)
        assert False, "Security failure! Non-host allowed to start discussion!"
    except HTTPException as e:
        assert e.status_code == 403
        print("[OK] Non-host start attempt rejected with 403 Forbidden.")

    # 6. Host starts discussion -> Automatic Team Split & 5-minute timer
    print("\n--- [5] Host Starts Discussion -> Automatic Team Split & 5-min Server Timer ---")
    started_room = await start_gd_discussion(room_id=room_id, current_user=user_a)
    assert started_room.status == "active"
    assert started_room.started_at is not None
    assert started_room.discussion_ends_at is not None
    assert len(started_room.teams.get("Team A", [])) > 0
    assert len(started_room.teams.get("Team B", [])) > 0

    print(f"[OK] Discussion started. Team A: {started_room.teams['Team A']}, Team B: {started_room.teams['Team B']}")

    # 7. Single Active Speaker Lock & Speak Turn System
    print("\n--- [6] Single Active Speaker Lock Enforcement ---")
    # User A starts speaking
    turn_a = await start_gd_speaking_turn(room_id=room_id, current_user=user_a)
    assert turn_a.current_speaker_id == user_a["id"]
    print(f"[OK] User A acquired speaking turn lock.")

    # User B attempts to speak while User A is speaking -> Rejected
    try:
        await start_gd_speaking_turn(room_id=room_id, current_user=user_b)
        assert False, "Lock failure! Second speaker allowed while User A was speaking!"
    except HTTPException as e:
        assert e.status_code == 400
        assert "currently speaking" in e.detail.lower()
        print("[OK] Concurrent speaking rejected by server lock (HTTP 400 Bad Request).")

    # 8. User A stops speaking & uploads audio segment -> Priority queue advances
    print("\n--- [7] User A Stops Speaking & Uploads Audio Segment ---")
    dummy_audio_a = b"HEADER_RIFF_WAV_SPEECH_AUDIO_USER_A_DEMO_BYTES_12345"
    await gd_room_manager.stop_speaking_turn(
        room_id=room_id,
        user_id=user_a["id"],
        audio_bytes=dummy_audio_a,
        mime_type="audio/wav",
        duration_seconds=12.5,
        turn_id="turn_a_001",
    )
    stopped_a = await gd_room_manager.get_room(room_id)
    assert stopped_a["current_speaker_id"] is None
    print("[OK] User A released lock and uploaded audio segment.")

    # 9. Next eligible participant (User B) starts turn
    print("\n--- [8] Fair Rotation -> Next Participant (User B) Gets Turn ---")
    turn_b = await start_gd_speaking_turn(room_id=room_id, current_user=user_b)
    assert turn_b.current_speaker_id == user_b["id"]

    dummy_audio_b = b"HEADER_RIFF_WAV_SPEECH_AUDIO_USER_B_DEMO_BYTES_67890"
    await gd_room_manager.stop_speaking_turn(
        room_id=room_id,
        user_id=user_b["id"],
        audio_bytes=dummy_audio_b,
        mime_type="audio/wav",
        duration_seconds=15.0,
        turn_id="turn_b_001",
    )
    print("[OK] User B completed turn and released lock.")

    # 10. Disconnect active speaker -> Auto releases lock
    print("\n--- [9] Disconnect Active Speaker Lock Release ---")
    await start_gd_speaking_turn(room_id=room_id, current_user=user_c)
    # Simulate WebSocket disconnect for user C
    await gd_room_manager.disconnect_ws(room_id=room_id, user_id=user_c["id"])
    check_room = await gd_room_manager.get_room(room_id)
    assert check_room["current_speaker_id"] is None
    print("[OK] Speaker lock automatically released upon WS disconnect.")

    # 11. Room Rejoin / Refresh Check
    print("\n--- [10] Room Rejoin / Refresh State Restoration ---")
    restored = await get_gd_room_status(room_id=room_id, current_user=user_a)
    assert restored.room_id == room_id
    assert restored.status == "active"
    assert len(restored.participants) == 3
    print("[OK] Active room restored cleanly on refresh.")

    # 12. Host Concludes Discussion & AI Evaluation
    print("\n--- [11] Conclude GD Session & Team/Individual AI Report ---")
    ended = await end_gd_discussion(room_id=room_id, current_user=user_a)
    assert ended.status == "ended"

    eval_res = await evaluate_gd_participant(room_id=room_id, current_user=user_a)
    assert isinstance(eval_res, GDEvaluationResponse)
    assert eval_res.winning_team in ["Team A", "Team B", "Tie"]
    assert "Team A" in eval_res.team_evaluations
    assert "Team B" in eval_res.team_evaluations
    assert len(eval_res.participant_evaluations) == 3

    print(f"[OK] Full GD Evaluation completed!")
    print(f"     Winning Team: {eval_res.winning_team}")
    print(f"     Winning Rationale: {eval_res.winning_rationale}")
    print(f"     Team A Score: {eval_res.team_evaluations['Team A'].team_score}%")
    print(f"     Team B Score: {eval_res.team_evaluations['Team B'].team_score}%")

    print("\n==================================================")
    print(" ALL REAL MULTI-USER GD TESTS PASSED SUCCESSFULLY! ")
    print("==================================================\n")


if __name__ == "__main__":
    asyncio.run(run_phase7_multiuser_gd_tests())
