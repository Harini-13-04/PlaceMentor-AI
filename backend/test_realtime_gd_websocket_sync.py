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
from app.core.security import create_access_token
from app.schemas.auth import RegisterRequest
from app.api.auth import register

BASE_HTTP_URL = "http://127.0.0.1:8000"
BASE_WS_URL = "ws://127.0.0.1:8000"


async def run_realtime_gd_websocket_test():
    print("\n========================================================")
    print(" PlaceMentor AI - Real-Time GD Multi-User Sync & WS Test ")
    print("========================================================")

    # 1. Register User A (Host), User B (Participant), User C (Different Room User)
    uid_a = str(uuid.uuid4())[:8]
    res_a = await register(RegisterRequest(
        name="Host Alice", email=f"alice_{uid_a}@placementor.ai", password="Password123!",
        college="SRMIST", department="CSE", year="4th Year", skills=["System Design"]
    ))
    user_a = res_a["user"]
    token_a = res_a["token"]

    uid_b = str(uuid.uuid4())[:8]
    res_b = await register(RegisterRequest(
        name="Peer Bob", email=f"bob_{uid_b}@placementor.ai", password="Password123!",
        college="SRMIST", department="ECE", year="4th Year", skills=["Networking"]
    ))
    user_b = res_b["user"]
    token_b = res_b["token"]

    uid_c = str(uuid.uuid4())[:8]
    res_c = await register(RegisterRequest(
        name="Other Charlie", email=f"charlie_{uid_c}@placementor.ai", password="Password123!",
        college="SRMIST", department="IT", year="3rd Year", skills=["Algorithms"]
    ))
    user_c = res_c["user"]
    token_c = res_c["token"]

    print(f"[OK] Users registered: Alice ({user_a['id']}), Bob ({user_b['id']}), Charlie ({user_c['id']})")

    async with httpx.AsyncClient(base_url=BASE_HTTP_URL) as client:
        # 2. Alice creates a GD Room
        print("\n--- [Step 1] Alice Creates GD Room ---")
        headers_a = {"Authorization": f"Bearer {token_a}"}
        create_res = await client.post(
            "/api/communication/gd/rooms",
            json={"topic": "Microservices vs Monolithic Architecture", "max_participants": 6, "duration_minutes": 5},
            headers=headers_a,
        )
        assert create_res.status_code == 201, f"Failed to create room: {create_res.text}"
        room_data = create_res.json()
        room_id = room_data["room_id"]
        print(f"[OK] Alice created room with code: {room_id}")

        # 3. Alice opens WebSocket connection to the room
        print("\n--- [Step 2] Alice Connects to Room WebSocket ---")
        ws_url_a = f"{BASE_WS_URL}/api/communication/gd/ws/{room_id}?token={token_a}"
        async with websockets.connect(ws_url_a) as ws_a:
            # Alice receives initial room_state
            init_msg_raw = await asyncio.wait_for(ws_a.recv(), timeout=5.0)
            init_msg = json.loads(init_msg_raw)
            assert init_msg["type"] in ["room_state", "room_updated"]
            assert len(init_msg["room"]["participants"]) == 1
            assert init_msg["room"]["participants"][0]["user_id"] == user_a["id"]
            print(f"[OK] Alice received initial WebSocket room_state with 1 participant.")

            # 4. Bob joins the room via HTTP API
            print("\n--- [Step 3] Bob Joins Room via HTTP API ---")
            headers_b = {"Authorization": f"Bearer {token_b}"}
            join_res = await client.post(f"/api/communication/gd/rooms/{room_id}/join", headers=headers_b)
            assert join_res.status_code == 200, f"Bob failed to join: {join_res.text}"
            joined_data = join_res.json()
            assert len(joined_data["participants"]) == 2
            print(f"[OK] Bob HTTP join call succeeded.")

            # 5. Alice must IMMEDIATELY receive real-time event without refreshing!
            print("\n--- [Step 4] Verify Alice Receives Real-Time Join Broadcast ---")
            broadcast_msg_raw = await asyncio.wait_for(ws_a.recv(), timeout=5.0)
            broadcast_msg = json.loads(broadcast_msg_raw)
            print(f"[OK] Alice WebSocket received broadcast event type: '{broadcast_msg.get('type')}'")
            participants_in_broadcast = broadcast_msg["room"]["participants"]
            participant_ids = [p["user_id"] for p in participants_in_broadcast]
            assert user_a["id"] in participant_ids, "Alice missing from participant list!"
            assert user_b["id"] in participant_ids, "Bob missing from Alice's real-time broadcast!"
            print(f"[OK] Alice's open page received Bob's join event in real time! Participants: {[p['display_name'] for p in participants_in_broadcast]}")

            # 6. Verify MongoDB persistence: MongoDB has BOTH Alice and Bob
            print("\n--- [Step 5] Verify Single Persistent Server State in MongoDB ---")
            db_doc = await gd_rooms_collection.find_one({"room_id": room_id}, {"_id": 0})
            assert db_doc is not None, "Room not found in MongoDB!"
            db_participant_ids = [p["user_id"] for p in db_doc["participants"]]
            assert user_a["id"] in db_participant_ids, "Alice not in MongoDB participants!"
            assert user_b["id"] in db_participant_ids, "Bob not in MongoDB participants!"
            assert len(db_doc["participants"]) == 2, f"Expected 2 participants in MongoDB, got {len(db_doc['participants'])}"
            assert any("joined the room" in log["message"] for log in db_doc.get("activity_logs", [])), "Join log missing from MongoDB!"
            print(f"[OK] MongoDB persisted room state accurately with both participants and activity logs.")

            # 7. Bob connects to WebSocket
            ws_url_b = f"{BASE_WS_URL}/api/communication/gd/ws/{room_id}?token={token_b}"
            async with websockets.connect(ws_url_b) as ws_b:
                bob_init_msg = json.loads(await asyncio.wait_for(ws_b.recv(), timeout=5.0))
                assert len(bob_init_msg["room"]["participants"]) == 2
                print("[OK] Bob connected to WebSocket and received synchronized room state.")

                # 8. Test Multi-User Isolation: Charlie creates Room 2
                print("\n--- [Step 6] Multi-User Room Isolation Check ---")
                headers_c = {"Authorization": f"Bearer {token_c}"}
                create_c = await client.post(
                    "/api/communication/gd/rooms",
                    json={"topic": "Quantum Computing Impact", "max_participants": 6, "duration_minutes": 5},
                    headers=headers_c,
                )
                room_c_id = create_c.json()["room_id"]
                ws_url_c = f"{BASE_WS_URL}/api/communication/gd/ws/{room_c_id}?token={token_c}"

                async with websockets.connect(ws_url_c) as ws_c:
                    c_msg = json.loads(await asyncio.wait_for(ws_c.recv(), timeout=5.0))
                    assert c_msg["room"]["room_id"] == room_c_id
                    assert c_msg["room"]["topic"] == "Quantum Computing Impact"

                    # Ensure Alice and Bob did NOT receive Charlie's room event
                    has_leaked = False
                    try:
                        leak_raw = await asyncio.wait_for(ws_a.recv(), timeout=1.0)
                        leak_data = json.loads(leak_raw)
                        if leak_data.get("room", {}).get("room_id") == room_c_id:
                            has_leaked = True
                    except asyncio.TimeoutError:
                        has_leaked = False

                    assert not has_leaked, "Cross-room event leakage detected!"
                    print("[OK] Verified zero cross-room event leakage (Multi-User Isolation confirmed).")

                # 9. Alice starts discussion -> Both Alice and Bob receive session_started broadcast
                print("\n--- [Step 7] Host Starts Discussion & Real-Time Sync ---")
                start_res = await client.post(f"/api/communication/gd/rooms/{room_id}/start", headers=headers_a)
                assert start_res.status_code == 200

                # Consume WebSocket messages on both sockets
                alice_start_msg = json.loads(await asyncio.wait_for(ws_a.recv(), timeout=5.0))
                bob_start_msg = json.loads(await asyncio.wait_for(ws_b.recv(), timeout=5.0))

                assert alice_start_msg["room"]["status"] == "active"
                assert bob_start_msg["room"]["status"] == "active"
                assert alice_start_msg["room"]["teams"]["Team A"] != []
                assert bob_start_msg["room"]["teams"]["Team B"] != []
                print(f"[OK] Both Alice and Bob synchronized to 'active' state with automated team splits.")

                # 10. Refresh Simulation: Alice fetches fresh room status from backend
                print("\n--- [Step 8] Page Refresh / Session Persistence Check ---")
                refresh_res = await client.get(f"/api/communication/gd/rooms/{room_id}", headers=headers_a)
                assert refresh_res.status_code == 200
                refresh_data = refresh_res.json()
                assert refresh_data["status"] == "active"
                assert len(refresh_data["participants"]) == 2
                assert refresh_data["current_speaker_id"] is None
                print("[OK] Refresh simulation confirmed: Bob remains present and room state is persistent.")

    print("\n========================================================")
    print(" ALL REAL-TIME GD MULTI-USER WEBSOCKET TESTS PASSED!    ")
    print("========================================================\n")


if __name__ == "__main__":
    asyncio.run(run_realtime_gd_websocket_test())
