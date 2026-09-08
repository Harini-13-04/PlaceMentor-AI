import asyncio
import json
import uuid
import os
import sys
import websockets
import httpx

backend_dir = os.path.dirname(os.path.abspath(__file__))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from app.database.mongodb import gd_rooms_collection, users_collection
from app.schemas.auth import RegisterRequest
from app.api.auth import register

BASE_HTTP_URL = "http://127.0.0.1:8000"
BASE_WS_URL = "ws://127.0.0.1:8000"


async def main():
    print("\n================================================================")
    print(" PlaceMentor AI — Two-Client Real-Time WebSocket Synchronization ")
    print("================================================================")

    # 1. Register Client A (User A) and Client B (User B)
    id_a = str(uuid.uuid4())[:8]
    reg_a = await register(RegisterRequest(
        name="Harini Host", email=f"harini_{id_a}@placementor.ai", password="Password123!",
        college="SRMIST", department="CSE", year="4th Year", skills=["System Architecture"]
    ))
    user_a = reg_a["user"]
    token_a = reg_a["token"]

    id_b = str(uuid.uuid4())[:8]
    reg_b = await register(RegisterRequest(
        name="Alex Participant", email=f"alex_{id_b}@placementor.ai", password="Password123!",
        college="SRMIST", department="ECE", year="3rd Year", skills=["Cloud Computing"]
    ))
    user_b = reg_b["user"]
    token_b = reg_b["token"]

    print(f"[User A - Browser 1]: Harini Host (ID: {user_a['id']})")
    print(f"[User B - Browser 2]: Alex Participant (ID: {user_b['id']})")

    async with httpx.AsyncClient(base_url=BASE_HTTP_URL) as client:
        # 2. User A creates room
        print("\n--- Phase 1: User A Creates Group Discussion Room ---")
        res_create = await client.post(
            "/api/communication/gd/rooms",
            json={"topic": "Generative AI: Job Destroyer or Productivity Multiplier?", "max_participants": 6, "duration_minutes": 5},
            headers={"Authorization": f"Bearer {token_a}"}
        )
        assert res_create.status_code == 201
        room_data = res_create.json()
        room_code = room_data["room_id"]
        print(f"[User A]: Created room successfully. Room Code = {room_code}")

        # 3. User A enters Waiting Room and opens WebSocket connection
        print("\n--- Phase 2: User A Enters Waiting Room (WebSocket Active) ---")
        ws_url_a = f"{BASE_WS_URL}/api/communication/gd/ws/{room_code}?token={token_a}"
        
        async with websockets.connect(ws_url_a) as ws_a:
            # User A receives initial room_state
            init_msg = json.loads(await asyncio.wait_for(ws_a.recv(), timeout=5.0))
            assert init_msg["type"] == "room_state"
            assert len(init_msg["room"]["participants"]) == 1
            print(f"[User A UI]: Initial participant count = {len(init_msg['room']['participants'])} (Waiting for participants: 1/2 minimum)")

            # 4. User B enters room code and joins via API
            print(f"\n--- Phase 3: User B Enters Code '{room_code}' and Clicks Join ---")
            res_join = await client.post(
                f"/api/communication/gd/rooms/{room_code}/join",
                headers={"Authorization": f"Bearer {token_b}"}
            )
            assert res_join.status_code == 200
            print("[User B]: Joined room successfully via API.")

            # 5. User A's ALREADY-OPEN Waiting Room immediately receives live broadcast
            print("\n--- Phase 4: User A Real-Time Live Sync Verification ---")
            live_broadcast_raw = await asyncio.wait_for(ws_a.recv(), timeout=5.0)
            live_broadcast = json.loads(live_broadcast_raw)
            participants = live_broadcast["room"]["participants"]
            participant_names = [p["display_name"] for p in participants]
            print(f"[User A WebSocket Event]: Type = '{live_broadcast.get('type')}'")
            print(f"[User A UI Auto-Update]: Participants list updated immediately -> {participant_names}")
            assert len(participants) == 2, f"Expected 2 participants, got {len(participants)}"
            assert "Alex Participant" in participant_names
            print("[User A UI]: Status badge switched to 'Ready to start: 2 participants' and 'Start Discussion Now' button is ENABLED!")

            # 6. MongoDB persistence check
            print("\n--- Phase 5: MongoDB Server Source of Truth Verification ---")
            db_doc = await gd_rooms_collection.find_one({"room_id": room_code}, {"_id": 0})
            assert db_doc is not None
            assert len(db_doc["participants"]) == 2
            db_names = [p["display_name"] for p in db_doc["participants"]]
            assert "Harini Host" in db_names and "Alex Participant" in db_names
            print(f"[MongoDB gd_rooms]: Room {room_code} contains {len(db_doc['participants'])} participants: {db_names}")
            print(f"[MongoDB activity_logs]: {len(db_doc.get('activity_logs', []))} real event log records:")
            for log in db_doc.get("activity_logs", []):
                print(f"   • [{log.get('type')}] {log.get('message')} ({log.get('timestamp')})")

            # 7. User B connects WebSocket as well
            print("\n--- Phase 6: User B Connects WebSocket in Room ---")
            ws_url_b = f"{BASE_WS_URL}/api/communication/gd/ws/{room_code}?token={token_b}"
            async with websockets.connect(ws_url_b) as ws_b:
                b_init = json.loads(await asyncio.wait_for(ws_b.recv(), timeout=5.0))
                assert len(b_init["room"]["participants"]) == 2
                print("[User B UI]: Synchronized with room state (2 participants connected).")

                # 8. User A starts discussion
                print("\n--- Phase 7: Host (User A) Starts Discussion ---")
                res_start = await client.post(
                    f"/api/communication/gd/rooms/{room_code}/start",
                    headers={"Authorization": f"Bearer {token_a}"}
                )
                assert res_start.status_code == 200

                # Both User A and User B receive live session_started broadcast
                async def recv_until_active(ws):
                    while True:
                        msg = json.loads(await asyncio.wait_for(ws.recv(), timeout=5.0))
                        if msg["room"]["status"] == "active":
                            return msg

                msg_a_start = await recv_until_active(ws_a)
                msg_b_start = await recv_until_active(ws_b)

                assert msg_a_start["room"]["status"] == "active"
                assert msg_b_start["room"]["status"] == "active"
                print(f"[User A & User B UI]: Both live pages transitioned to active arena with automated team splits:")
                print(f"   Team A: {msg_a_start['room']['teams'].get('Team A')}")
                print(f"   Team B: {msg_a_start['room']['teams'].get('Team B')}")

                # 9. User A acquires speaking turn
                print("\n--- Phase 8: User A Speaks -> Real-Time Lock Broadcast ---")
                res_speak_start = await client.post(
                    f"/api/communication/gd/rooms/{room_code}/speak/start",
                    headers={"Authorization": f"Bearer {token_a}"}
                )
                assert res_speak_start.status_code == 200

                async def recv_until_speaking(ws, speaker_id):
                    while True:
                        msg = json.loads(await asyncio.wait_for(ws.recv(), timeout=5.0))
                        if msg["room"]["current_speaker_id"] == speaker_id:
                            return msg

                msg_b_speak = await recv_until_speaking(ws_b, user_a["id"])
                assert msg_b_speak["room"]["current_speaker_id"] == user_a["id"]
                print(f"[User B UI]: Real-time speaker banner shows '* {user_a['name']} is speaking' and locks mic.")

                # User A stops speaking
                res_speak_stop = await client.post(
                    f"/api/communication/gd/rooms/{room_code}/speak/stop",
                    headers={"Authorization": f"Bearer {token_a}"},
                    data={"duration_seconds": "5.0"}
                )
                assert res_speak_stop.status_code == 200
                msg_b_stopped = await recv_until_speaking(ws_b, None)
                assert msg_b_stopped["room"]["current_speaker_id"] is None
                print(f"[User B UI]: Speaker lock released. Next speaker queue updated.")

                # 10. Refresh Test: User A refreshes page
                print("\n--- Phase 9: User A Simulates Page Refresh ---")
                res_refresh = await client.get(
                    f"/api/communication/gd/rooms/{room_code}",
                    headers={"Authorization": f"Bearer {token_a}"}
                )
                assert res_refresh.status_code == 200
                refreshed_data = res_refresh.json()
                assert len(refreshed_data["participants"]) == 2
                assert refreshed_data["status"] == "active"
                print(f"[User A Refresh]: Persistent room state reloaded from MongoDB with all {len(refreshed_data['participants'])} participants intact.")

    print("\n================================================================")
    print(" TWO-CLIENT REAL-TIME WEBSOCKET VERIFICATION COMPLETED (100% OK)")
    print("================================================================\n")


if __name__ == "__main__":
    asyncio.run(main())
