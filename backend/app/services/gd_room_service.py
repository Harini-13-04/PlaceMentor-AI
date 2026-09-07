import random
import string
import logging
from datetime import datetime, timezone
from typing import Dict, Any, Optional
from fastapi import WebSocket, HTTPException, status
from app.database.mongodb import gd_rooms_collection

logger = logging.getLogger(__name__)


def generate_room_code() -> str:
    """Generate a clean 6-character room code like GD-7A2B"""
    chars = "".join(random.choices(string.ascii_uppercase + string.digits, k=4))
    return f"GD-{chars}"


class GDRoomManager:
    def __init__(self):
        # Memory state: room_id -> room_dict
        self.active_rooms: Dict[str, Dict[str, Any]] = {}
        # WebSocket connections: room_id -> {user_id: WebSocket}
        self.active_connections: Dict[str, Dict[str, WebSocket]] = {}

    def _get_display_name(self, user: dict) -> str:
        name = user.get("name") or user.get("full_name") or user.get("email", "User")
        return name

    async def create_room(
        self,
        topic: str,
        host_user: dict,
        max_participants: int = 6,
        duration_minutes: int = 15,
    ) -> dict:
        host_id = host_user.get("id")
        if not host_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Authentication required",
            )

        # Generate unique room_id
        room_id = generate_room_code()
        while room_id in self.active_rooms:
            room_id = generate_room_code()

        now_iso = datetime.now(timezone.utc).isoformat()
        host_participant = {
            "user_id": host_id,
            "display_name": self._get_display_name(host_user),
            "is_host": True,
            "is_connected": True,
            "joined_at": now_iso,
            "is_speaking": False,
        }

        room_data = {
            "room_id": room_id,
            "topic": topic,
            "status": "waiting",
            "host_user_id": host_id,
            "max_participants": max_participants,
            "created_at": now_iso,
            "started_at": None,
            "ended_at": None,
            "duration_seconds": duration_minutes * 60,
            "participants": [host_participant],
        }

        self.active_rooms[room_id] = room_data
        self.active_connections[room_id] = {}

        # Optionally persist to MongoDB
        try:
            doc = room_data.copy()
            await gd_rooms_collection.insert_one(doc)
        except Exception as e:
            logger.warning(f"Failed to persist initial room to MongoDB: {e}")

        return room_data

    async def get_room(self, room_id: str) -> dict:
        room = self.active_rooms.get(room_id)
        if not room:
            # Fallback check MongoDB
            doc = await gd_rooms_collection.find_one({"room_id": room_id}, {"_id": 0})
            if doc:
                self.active_rooms[room_id] = doc
                if room_id not in self.active_connections:
                    self.active_connections[room_id] = {}
                return doc
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Group Discussion room '{room_id}' not found",
            )
        return room

    async def join_room(self, room_id: str, user: dict) -> dict:
        room = await self.get_room(room_id)
        user_id = user.get("id")
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Authentication required",
            )

        if room["status"] == "ended":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="This Group Discussion session has already concluded",
            )

        participants = room.get("participants", [])
        existing = next((p for p in participants if p["user_id"] == user_id), None)

        if existing:
            existing["is_connected"] = True
            existing["display_name"] = self._get_display_name(user)
        else:
            if len(participants) >= room.get("max_participants", 6):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Room {room_id} is full (Maximum {room.get('max_participants', 6)} participants)",
                )

            new_participant = {
                "user_id": user_id,
                "display_name": self._get_display_name(user),
                "is_host": (user_id == room["host_user_id"]),
                "is_connected": True,
                "joined_at": datetime.now(timezone.utc).isoformat(),
                "is_speaking": False,
            }
            participants.append(new_participant)

        room["participants"] = participants
        self.active_rooms[room_id] = room
        await self.broadcast_room_state(room_id)
        return room

    async def leave_room(self, room_id: str, user_id: str) -> dict:
        room = await self.get_room(room_id)
        participants = room.get("participants", [])
        
        # Remove or disconnect user
        room["participants"] = [p for p in participants if p["user_id"] != user_id]

        # If host left and there are remaining participants, reassign host
        if user_id == room["host_user_id"] and room["participants"]:
            new_host = room["participants"][0]
            new_host["is_host"] = True
            room["host_user_id"] = new_host["user_id"]

        self.active_rooms[room_id] = room
        await self.broadcast_room_state(room_id)
        return room

    async def start_discussion(self, room_id: str, user_id: str) -> dict:
        room = await self.get_room(room_id)
        if room["host_user_id"] != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only the room host can start the discussion",
            )

        if room["status"] == "active":
            return room

        room["status"] = "active"
        room["started_at"] = datetime.now(timezone.utc).isoformat()
        self.active_rooms[room_id] = room

        # Update in MongoDB
        try:
            await gd_rooms_collection.update_one(
                {"room_id": room_id},
                {"$set": {"status": "active", "started_at": room["started_at"]}}
            )
        except Exception as e:
            logger.warning(f"Failed to update room start in MongoDB: {e}")

        await self.broadcast_room_state(room_id)
        return room

    async def end_discussion(self, room_id: str, user_id: str, auto_timer: bool = False) -> dict:
        room = await self.get_room(room_id)
        if not auto_timer and room["host_user_id"] != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only the room host can conclude the discussion",
            )

        room["status"] = "ended"
        room["ended_at"] = datetime.now(timezone.utc).isoformat()
        self.active_rooms[room_id] = room

        # Update in MongoDB
        try:
            await gd_rooms_collection.update_one(
                {"room_id": room_id},
                {"$set": {"status": "ended", "ended_at": room["ended_at"]}}
            )
        except Exception as e:
            logger.warning(f"Failed to update room end in MongoDB: {e}")

        await self.broadcast_room_state(room_id)
        return room

    async def connect_ws(self, room_id: str, user_id: str, websocket: WebSocket):
        await websocket.accept()
        if room_id not in self.active_connections:
            self.active_connections[room_id] = {}
        self.active_connections[room_id][user_id] = websocket

        # Mark user as connected in room
        room = self.active_rooms.get(room_id)
        if room:
            for p in room.get("participants", []):
                if p["user_id"] == user_id:
                    p["is_connected"] = True
            await self.broadcast_room_state(room_id)

    async def disconnect_ws(self, room_id: str, user_id: str):
        if room_id in self.active_connections:
            self.active_connections[room_id].pop(user_id, None)

        room = self.active_rooms.get(room_id)
        if room:
            for p in room.get("participants", []):
                if p["user_id"] == user_id:
                    p["is_connected"] = False
                    p["is_speaking"] = False
            await self.broadcast_room_state(room_id)

    async def set_speaking_state(self, room_id: str, user_id: str, is_speaking: bool):
        room = self.active_rooms.get(room_id)
        if room:
            for p in room.get("participants", []):
                if p["user_id"] == user_id:
                    p["is_speaking"] = is_speaking
            await self.broadcast_room_state(room_id)

    async def broadcast_room_state(self, room_id: str):
        room = self.active_rooms.get(room_id)
        if not room:
            return

        connections = self.active_connections.get(room_id, {})
        payload = {
            "type": "room_state",
            "room": room,
        }

        disconnected_users = []
        for uid, ws in list(connections.items()):
            try:
                await ws.send_json(payload)
            except Exception as e:
                logger.debug(f"Failed to send WS message to user {uid}: {e}")
                disconnected_users.append(uid)

        for uid in disconnected_users:
            connections.pop(uid, None)


# Global singleton instance
gd_room_manager = GDRoomManager()
