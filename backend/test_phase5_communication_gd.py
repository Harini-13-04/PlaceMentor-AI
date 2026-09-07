import asyncio
import uuid
import os
import sys
from fastapi import HTTPException
from pydantic import ValidationError

backend_dir = os.path.dirname(os.path.abspath(__file__))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from app.schemas.auth import RegisterRequest
from app.schemas.communication import GDRoomCreateRequest, GDRoomResponse
from app.api.auth import register
from app.api.communication import (
    create_gd_room,
    join_gd_room,
    leave_gd_room,
    start_gd_discussion,
    end_gd_discussion,
    get_gd_room_status,
)
from app.services.gd_room_service import gd_room_manager


async def run_phase5_communication_gd_tests():
    print("\n==================================================")
    print(" PlaceMentor AI - Phase 5 Real-Time GD Suite      ")
    print("==================================================")

    # 1. Register User A (Host) and User B (Participant)
    uid_a = str(uuid.uuid4())[:8]
    email_a = f"gd_host_{uid_a}@placementor.ai"
    reg_req_a = RegisterRequest(
        name="Host User Alpha",
        email=email_a,
        password="Password123!",
        college="SRMIST",
        department="CSE",
        year="4th Year",
        skills=["Python", "FastAPI"],
    )
    res_a = await register(reg_req_a)
    user_a = res_a["user"]
    print(f"[OK] Registered User A (Host): {user_a['id']}")

    uid_b = str(uuid.uuid4())[:8]
    email_b = f"gd_participant_{uid_b}@placementor.ai"
    reg_req_b = RegisterRequest(
        name="Participant User Beta",
        email=email_b,
        password="Password123!",
        college="SRMIST",
        department="ECE",
        year="3rd Year",
        skills=["Communication", "React"],
    )
    res_b = await register(reg_req_b)
    user_b = res_b["user"]
    print(f"[OK] Registered User B (Participant): {user_b['id']}")

    # 2. Test Room Creation by Host User A
    print("\n--- [1] POST /api/communication/gd/rooms (Create Room) ---")
    create_req = GDRoomCreateRequest(
        topic="Generative AI: Job Destroyer or Productivity Multiplier?",
        max_participants=2,  # Limit to 2 to easily test full-room rejection
        duration_minutes=15,
    )
    room_a = await create_gd_room(request=create_req, current_user=user_a)
    assert isinstance(room_a, GDRoomResponse)
    assert room_a.status == "waiting"
    assert room_a.host_user_id == user_a["id"]
    assert room_a.is_host is True
    assert len(room_a.participants) == 1
    assert room_a.participants[0].user_id == user_a["id"]
    room_id = room_a.room_id
    print(f"[OK] Room created successfully with Code: {room_id}")

    # 3. Test Room Retrieval
    print("\n--- [2] GET /api/communication/gd/rooms/{room_id} ---")
    retrieved_room = await get_gd_room_status(room_id=room_id, current_user=user_a)
    assert retrieved_room.room_id == room_id
    assert retrieved_room.topic == create_req.topic
    print("[OK] Room status retrieved successfully.")

    # 4. Test User B Joining Room
    print("\n--- [3] POST /api/communication/gd/rooms/{room_id}/join (User B Joins) ---")
    room_b = await join_gd_room(room_id=room_id, current_user=user_b)
    assert len(room_b.participants) == 2
    assert any(p.user_id == user_b["id"] for p in room_b.participants)
    print("[OK] User B successfully joined room.")

    # 5. Test Maximum Participant Limit Enforcement
    print("\n--- [4] Max Participant Limit Rejection ---")
    uid_c = str(uuid.uuid4())[:8]
    user_c = {"id": f"user_c_{uid_c}", "name": "User Gamma", "email": f"gamma_{uid_c}@placementor.ai"}
    try:
        await join_gd_room(room_id=room_id, current_user=user_c)
        assert False, "Validation failure! Full room allowed third participant!"
    except HTTPException as e:
        assert e.status_code == 400
        assert "full" in e.detail.lower()
        print("[OK] Full room rejected third participant with HTTP 400 Bad Request.")

    # 6. Test Non-Host Cannot Start Room
    print("\n--- [5] Non-Host Start Discussion Rejection ---")
    try:
        await start_gd_discussion(room_id=room_id, current_user=user_b)
        assert False, "Security failure! Non-host allowed to start discussion!"
    except HTTPException as e:
        assert e.status_code == 403
        assert "host" in e.detail.lower()
        print("[OK] Non-host start attempt rejected with HTTP 403 Forbidden.")

    # 7. Test Host Starts Discussion
    print("\n--- [6] Host Starts Discussion ---")
    started_room = await start_gd_discussion(room_id=room_id, current_user=user_a)
    assert started_room.status == "active"
    assert started_room.started_at is not None
    print("[OK] Host started discussion successfully. Room status is 'active'.")

    # 8. Test Local Speaking State Update
    print("\n--- [7] Speaking State Sync Check ---")
    await gd_room_manager.set_speaking_state(room_id=room_id, user_id=user_a["id"], is_speaking=True)
    room_speaking = await gd_room_manager.get_room(room_id)
    host_p = next(p for p in room_speaking["participants"] if p["user_id"] == user_a["id"])
    assert host_p["is_speaking"] is True
    print("[OK] Local speaking state synchronized in room manager.")

    # 9. Test User B Leaves Room
    print("\n--- [8] User B Leaves Room ---")
    leave_res = await leave_gd_room(room_id=room_id, current_user=user_b)
    assert "left" in leave_res["message"].lower()
    room_after_leave = await gd_room_manager.get_room(room_id)
    assert not any(p["user_id"] == user_b["id"] for p in room_after_leave["participants"])
    print("[OK] User B left room cleanly.")

    # 10. Test Host Ends Discussion
    print("\n--- [9] Host Concludes Discussion ---")
    ended_room = await end_gd_discussion(room_id=room_id, current_user=user_a)
    assert ended_room.status == "ended"
    assert ended_room.ended_at is not None
    print("[OK] Host concluded discussion successfully. Room status is 'ended'.")

    print("\n==================================================")
    print(" ALL REAL-TIME GD TESTS PASSED SUCCESSFULLY!     ")
    print("==================================================\n")


if __name__ == "__main__":
    asyncio.run(run_phase5_communication_gd_tests())
