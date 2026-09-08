import random
import string
import logging
import uuid
import hashlib
from datetime import datetime, timezone, timedelta
from typing import Dict, Any, Optional, List
from fastapi import WebSocket, HTTPException, status
from app.database.mongodb import gd_rooms_collection

logger = logging.getLogger(__name__)

MIN_GD_PARTICIPANTS = 2
DEFAULT_GD_DURATION_SECONDS = 300  # Exactly 5 minutes = 300 seconds


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
        duration_minutes: int = 5,
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
            "team": None,
            "total_speaking_seconds": 0.0,
            "turn_count": 0,
            "last_turn_at": None,
        }

        room_data = {
            "room_id": room_id,
            "topic": topic,
            "status": "waiting",
            "host_user_id": host_id,
            "max_participants": max_participants,
            "min_participants": MIN_GD_PARTICIPANTS,
            "created_at": now_iso,
            "started_at": None,
            "ended_at": None,
            "duration_seconds": DEFAULT_GD_DURATION_SECONDS,
            "discussion_ends_at": None,
            "participants": [host_participant],
            "teams": {"Team A": [], "Team B": []},
            "current_speaker_id": None,
            "current_speaker_name": None,
            "next_speaker_id": host_id,
            "turn_priority_queue": [host_id],
            "audio_segments": [],
            "evaluation_summary": None,
            "winning_team": None,
        }

        self.active_rooms[room_id] = room_data
        self.active_connections[room_id] = {}

        # Optionally persist to MongoDB
        try:
            doc = room_data.copy()
            # Omit non-serializable raw audio bytes if present
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

        # Check if 5-minute server timer expired
        await self._check_timer_expiration(room)
        return room

    async def _check_timer_expiration(self, room: dict):
        if room["status"] == "active" and room.get("discussion_ends_at"):
            now_dt = datetime.now(timezone.utc)
            ends_dt = datetime.fromisoformat(room["discussion_ends_at"])
            if now_dt >= ends_dt:
                # Timer expired! Release speaker lock & auto transition to ending/evaluating
                if room.get("current_speaker_id"):
                    for p in room.get("participants", []):
                        p["is_speaking"] = False
                    room["current_speaker_id"] = None
                    room["current_speaker_name"] = None
                
                room["status"] = "ended"
                room["ended_at"] = now_dt.isoformat()
                self.active_rooms[room["room_id"]] = room
                await self.broadcast_room_state(room["room_id"])

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

        if room["status"] == "active":
            # Check if user is already a member rejoining
            participants = room.get("participants", [])
            existing = next((p for p in participants if p["user_id"] == user_id), None)
            if existing:
                existing["is_connected"] = True
                existing["display_name"] = self._get_display_name(user)
                self.active_rooms[room_id] = room
                await self.broadcast_room_state(room_id)
                return room
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Cannot join room after discussion has started",
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
                "team": None,
                "total_speaking_seconds": 0.0,
                "turn_count": 0,
                "last_turn_at": None,
            }
            participants.append(new_participant)

        room["participants"] = participants
        # Update priority queue
        queue = room.get("turn_priority_queue", [])
        if user_id not in queue:
            queue.append(user_id)
        room["turn_priority_queue"] = queue

        self.active_rooms[room_id] = room
        await self.broadcast_room_state(room_id)
        return room

    async def leave_room(self, room_id: str, user_id: str) -> dict:
        room = await self.get_room(room_id)
        participants = room.get("participants", [])

        # If user is currently speaking, release active speaking lock first
        if room.get("current_speaker_id") == user_id:
            room["current_speaker_id"] = None
            room["current_speaker_name"] = None

        # Remove user from participants
        room["participants"] = [p for p in participants if p["user_id"] != user_id]
        if "turn_priority_queue" in room:
            room["turn_priority_queue"] = [uid for uid in room["turn_priority_queue"] if uid != user_id]

        # Reassign next speaker if available
        self._update_next_speaker(room)

        # If host left and there are remaining participants, reassign host
        if user_id == room["host_user_id"] and room["participants"]:
            new_host = room["participants"][0]
            new_host["is_host"] = True
            room["host_user_id"] = new_host["user_id"]

        self.active_rooms[room_id] = room
        await self.broadcast_room_state(room_id)
        return room

    def _update_next_speaker(self, room: dict):
        """Recalculates turn priority queue and sets next_speaker_id based on fair rotation rules"""
        participants = room.get("participants", [])
        if not participants:
            room["next_speaker_id"] = None
            return

        # Fair rotation sort key:
        # 1. Turn count ascending
        # 2. Total speaking seconds ascending
        # 3. Last turn timestamp ascending (None/oldest first)
        def sort_key(p):
            t_count = p.get("turn_count", 0)
            s_sec = p.get("total_speaking_seconds", 0.0)
            l_turn = p.get("last_turn_at") or ""
            return (t_count, s_sec, l_turn)

        sorted_participants = sorted(participants, key=sort_key)
        room["turn_priority_queue"] = [p["user_id"] for p in sorted_participants]
        room["next_speaker_id"] = room["turn_priority_queue"][0] if room["turn_priority_queue"] else None

    async def start_discussion(self, room_id: str, user_id: str) -> dict:
        room = await self.get_room(room_id)
        if room["host_user_id"] != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only the room host can start the discussion",
            )

        if room["status"] == "active":
            return room

        if room["status"] == "ended":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Cannot start a discussion that has already ended",
            )

        # Enforce Minimum Participants Requirement
        participants = room.get("participants", [])
        if len(participants) < MIN_GD_PARTICIPANTS:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Minimum {MIN_GD_PARTICIPANTS} participants required to start the discussion (current: {len(participants)}/6)",
            )

        # Automatic Team Split (Team A vs Team B)
        team_a_members = []
        team_b_members = []
        for idx, p in enumerate(participants):
            if idx % 2 == 0:
                p["team"] = "Team A"
                team_a_members.append(p["display_name"])
            else:
                p["team"] = "Team B"
                team_b_members.append(p["display_name"])

        room["teams"] = {
            "Team A": team_a_members,
            "Team B": team_b_members,
        }

        # Server-authoritative 5-minute timer
        now_dt = datetime.now(timezone.utc)
        ends_dt = now_dt + timedelta(seconds=DEFAULT_GD_DURATION_SECONDS)

        room["status"] = "active"
        room["duration_seconds"] = DEFAULT_GD_DURATION_SECONDS
        room["started_at"] = now_dt.isoformat()
        room["discussion_ends_at"] = ends_dt.isoformat()

        # Initialize priority queue
        self._update_next_speaker(room)

        self.active_rooms[room_id] = room

        # Update in MongoDB
        try:
            await gd_rooms_collection.update_one(
                {"room_id": room_id},
                {
                    "$set": {
                        "status": "active",
                        "started_at": room["started_at"],
                        "discussion_ends_at": room["discussion_ends_at"],
                        "teams": room["teams"],
                        "participants": room["participants"],
                    }
                },
            )
        except Exception as e:
            logger.warning(f"Failed to update room start in MongoDB: {e}")

        await self.broadcast_room_state(room_id)
        return room

    async def start_speaking_turn(self, room_id: str, user_id: str) -> dict:
        room = await self.get_room(room_id)
        if room["status"] != "active":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Discussion is not active",
            )

        # Check single active speaker lock
        current_speaker_id = room.get("current_speaker_id")
        if current_speaker_id and current_speaker_id != user_id:
            speaker_p = next((p for p in room["participants"] if p["user_id"] == current_speaker_id), None)
            speaker_name = speaker_p["display_name"] if speaker_p else "Another participant"
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"{speaker_name} is currently speaking. Only one participant can speak at a time.",
            )

        # Grant speaking turn lock to user
        participant = next((p for p in room["participants"] if p["user_id"] == user_id), None)
        if not participant:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You are not a participant in this room",
            )

        participant["is_speaking"] = True
        room["current_speaker_id"] = user_id
        room["current_speaker_name"] = participant["display_name"]

        self.active_rooms[room_id] = room
        await self.broadcast_room_state(room_id)
        return room

    async def stop_speaking_turn(
        self,
        room_id: str,
        user_id: str,
        audio_bytes: bytes,
        mime_type: str,
        duration_seconds: float,
        turn_id: Optional[str] = None,
    ) -> dict:
        room = await self.get_room(room_id)
        participant = next((p for p in room.get("participants", []) if p["user_id"] == user_id), None)
        if not participant:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You are not a participant in this room",
            )

        # Update participant statistics
        safe_duration = max(1.0, float(duration_seconds or 1.0))
        participant["is_speaking"] = False
        participant["total_speaking_seconds"] += safe_duration
        participant["turn_count"] += 1
        now_iso = datetime.now(timezone.utc).isoformat()
        participant["last_turn_at"] = now_iso

        # Store audio segment metadata + raw audio bytes
        segment_id = turn_id or str(uuid.uuid4())
        audio_hash = hashlib.sha256(audio_bytes).hexdigest() if audio_bytes else ""
        segment_record = {
            "turn_id": segment_id,
            "user_id": user_id,
            "display_name": participant["display_name"],
            "team": participant.get("team") or "Team A",
            "duration": safe_duration,
            "mime_type": mime_type or "audio/webm",
            "byte_size": len(audio_bytes) if audio_bytes else 0,
            "sha256": audio_hash,
            "created_at": now_iso,
            "audio_bytes": audio_bytes,  # Preserved in memory for AI evaluation
        }
        if "audio_segments" not in room:
            room["audio_segments"] = []
        room["audio_segments"].append(segment_record)

        # Release active speaker lock
        room["current_speaker_id"] = None
        room["current_speaker_name"] = None

        # Re-calculate fair rotation priority queue
        self._update_next_speaker(room)

        self.active_rooms[room_id] = room
        await self.broadcast_room_state(room_id)
        return room

    async def end_discussion(self, room_id: str, user_id: str, auto_timer: bool = False) -> dict:
        room = await self.get_room(room_id)
        if not auto_timer and room["host_user_id"] != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only the room host can conclude the discussion",
            )

        # Safely release active speaker lock if someone is speaking
        for p in room.get("participants", []):
            p["is_speaking"] = False
        room["current_speaker_id"] = None
        room["current_speaker_name"] = None

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
            # If active speaker disconnected, release speaker lock automatically
            if room.get("current_speaker_id") == user_id:
                room["current_speaker_id"] = None
                room["current_speaker_name"] = None

            for p in room.get("participants", []):
                if p["user_id"] == user_id:
                    p["is_connected"] = False
                    p["is_speaking"] = False

            self._update_next_speaker(room)
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

