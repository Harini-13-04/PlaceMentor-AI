import asyncio
import uuid
from io import BytesIO
from fastapi import HTTPException
from app.schemas.auth import RegisterRequest
from app.api.auth import register
from app.api.communication import (
    analyze_speech_recording,
    get_communication_history,
    get_communication_session_detail,
)
from app.database.mongodb import communication_sessions_collection
from fastapi import UploadFile


async def run_phase3_communication_persistence_tests():
    print("\n==================================================")
    print(" PlaceMentor AI - Phase 3 Persistence & History  ")
    print("==================================================")

    # 1. Register User A
    uid_a = str(uuid.uuid4())[:8]
    email_a = f"perm_user_a_{uid_a}@placementor.ai"
    reg_req_a = RegisterRequest(
        name="Candidate Persistence Alpha",
        email=email_a,
        password="Password123!",
        college="SRMIST",
        department="CSE",
        year="4th Year",
        skills=["Communication", "FastAPI"],
    )
    res_a = await register(reg_req_a)
    user_a = res_a["user"]
    print(f"[OK] Registered User A: {user_a['id']}")

    # 2. Register User B (for tenant isolation test)
    uid_b = str(uuid.uuid4())[:8]
    email_b = f"perm_user_b_{uid_b}@placementor.ai"
    reg_req_b = RegisterRequest(
        name="Candidate Persistence Beta",
        email=email_b,
        password="Password123!",
        college="IIT",
        department="ECE",
        year="3rd Year",
        skills=["Python"],
    )
    res_b = await register(reg_req_b)
    user_b = res_b["user"]
    print(f"[OK] Registered User B: {user_b['id']}")

    # 3. Test Unauthenticated History Request (HTTP 401)
    print("\n--- [1] GET /api/communication/history (Unauthenticated) ---")
    try:
        await get_communication_history(limit=20, skip=0, current_user={})
        assert False, "Security failure! Unauthenticated history access allowed!"
    except HTTPException as e:
        assert e.status_code == 401
        print("[OK] Unauthenticated history access rejected with HTTP 401 Unauthorized")

    # 4. Directly Insert Test Session for User A into MongoDB
    print("\n--- [2] Inserting Session into MongoDB for User A ---")
    session_id_a = str(uuid.uuid4())
    test_session_a = {
        "id": session_id_a,
        "user_id": user_a["id"],
        "type": "speaking_practice",
        "prompt_title": "Tell Me About Yourself (Elevator Pitch)",
        "prompt_category": "Self Introduction",
        "transcript": "Hello, I am candidate Alpha specializing in FastAPI and full stack development.",
        "duration_seconds": 45,
        "fluency": 90,
        "pace": 135,
        "clarity": 92,
        "filler_words": ["um (1x)"],
        "overall_score": 91,
        "strengths": ["Structured narrative flow"],
        "suggestions": ["Add metrics"],
        "star_feedback": None,
        "created_at": "2026-09-07T00:00:00.000000+00:00",
    }
    await communication_sessions_collection.insert_one(test_session_a)
    print(f"[OK] Inserted session {session_id_a} for User A")

    # Insert a second newer session for User A
    session_id_a2 = str(uuid.uuid4())
    test_session_a2 = {
        "id": session_id_a2,
        "user_id": user_a["id"],
        "type": "speaking_practice",
        "prompt_title": "STAR Story: Conflict",
        "prompt_category": "Behavioral STAR",
        "transcript": "In my previous project, we faced a major disagreement...",
        "duration_seconds": 60,
        "fluency": 85,
        "pace": 140,
        "clarity": 88,
        "filler_words": [],
        "overall_score": 87,
        "strengths": ["Clear STAR framing"],
        "suggestions": ["Quantify result"],
        "star_feedback": {"situation": "Team disagreement", "task": "Resolve tech stack", "action": "Benchmark data", "result": "Consensus reached"},
        "created_at": "2026-09-07T00:10:00.000000+00:00",
    }
    await communication_sessions_collection.insert_one(test_session_a2)

    # 5. Fetch History for User A (Newest First)
    print("\n--- [3] GET /api/communication/history for User A ---")
    hist_a = await get_communication_history(limit=20, skip=0, current_user=user_a)
    assert hist_a.total >= 2
    assert len(hist_a.sessions) >= 2
    assert hist_a.sessions[0].id == session_id_a2  # Newest first
    assert hist_a.sessions[0].user_id == user_a["id"]
    print(f"[OK] History returned {len(hist_a.sessions)} sessions for User A (Newest first)")

    # 6. Tenant Isolation Check: User B fetches History (Must NOT see User A's sessions)
    print("\n--- [4] Security Check: Tenant Isolation for User B ---")
    hist_b = await get_communication_history(limit=20, skip=0, current_user=user_b)
    assert hist_b.total == 0
    assert len(hist_b.sessions) == 0
    print("[OK] Tenant isolation passed: User B receives 0 sessions")

    # 7. Session Detail Ownership Check
    print("\n--- [5] Session Detail Ownership Check ---")
    detail_a = await get_communication_session_detail(session_id=session_id_a, current_user=user_a)
    assert detail_a.id == session_id_a
    assert detail_a.user_id == user_a["id"]
    print("[OK] User A successfully accessed own session detail")

    try:
        await get_communication_session_detail(session_id=session_id_a, current_user=user_b)
        assert False, "Security failure! User B was able to access User A's session detail!"
    except HTTPException as e:
        assert e.status_code == 404
        print("[OK] Security check passed: User B access rejected with HTTP 404")

    # 8. Pagination Limit Test
    print("\n--- [6] Pagination Test (Limit=1) ---")
    hist_paged = await get_communication_history(limit=1, skip=0, current_user=user_a)
    assert len(hist_paged.sessions) == 1
    assert hist_paged.limit == 1
    print("[OK] Pagination limit=1 enforced correctly")

    print("\n==================================================")
    print(" All Phase 3 Persistence & History Tests Passed! ")
    print("==================================================\n")


if __name__ == "__main__":
    asyncio.run(run_phase3_communication_persistence_tests())
