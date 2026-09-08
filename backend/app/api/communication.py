import uuid
import logging
import hashlib
from datetime import datetime, timezone
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form, Query, WebSocket, WebSocketDisconnect
from app.middlewares.auth_middleware import get_current_user
from app.database.mongodb import communication_sessions_collection, users_collection, gd_evaluations_collection
from app.core.security import decode_access_token
from app.schemas.communication import (
    SpeechAnalysisResponse,
    CommunicationSessionItem,
    CommunicationHistoryResponse,
    OutreachGenerateRequest,
    OutreachGenerateResponse,
    GDRoomCreateRequest,
    GDRoomJoinRequest,
    GDRoomResponse,
    GDEvaluationResponse,
)
from app.services.communication_service import analyze_speech_audio, generate_outreach_message, evaluate_gd_session
from app.services.gd_room_service import gd_room_manager

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/communication", tags=["Communication"])

MAX_AUDIO_SIZE_BYTES = 15 * 1024 * 1024  # 15 MB limit


@router.post("/analyze-speech", response_model=SpeechAnalysisResponse, status_code=status.HTTP_200_OK)
async def analyze_speech_recording(
    file: UploadFile = File(...),
    prompt_title: Optional[str] = Form(None),
    prompt_category: Optional[str] = Form(None),
    target_duration: Optional[int] = Form(90),
    actual_duration: Optional[int] = Form(0),
    is_silent: Optional[bool] = Form(False),
    attempt_id: Optional[str] = Form(None),
    current_user: dict = Depends(get_current_user),
):
    """
    Authenticated endpoint to analyze recorded spoken audio using AI.
    Saves completed valid session to MongoDB upon success.
    Identity is obtained strictly from the current authenticated JWT user.
    """
    user_id = current_user.get("id")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required",
        )

    if not file or not file.filename:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No audio file uploaded",
        )

    audio_bytes = await file.read()
    if not audio_bytes or len(audio_bytes) == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Uploaded audio file is empty",
        )

    if len(audio_bytes) > MAX_AUDIO_SIZE_BYTES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Audio file size exceeds the 15MB limit",
        )

    raw_mime = (file.content_type or "audio/webm").split(";")[0].strip().lower()
    if "octet-stream" in raw_mime or not raw_mime:
        if file.filename and (file.filename.endswith(".mp4") or file.filename.endswith(".m4a")):
            mime_type = "audio/mp4"
        elif file.filename and file.filename.endswith(".wav"):
            mime_type = "audio/wav"
        elif file.filename and file.filename.endswith(".ogg"):
            mime_type = "audio/ogg"
        else:
            mime_type = "audio/webm"
    else:
        mime_type = raw_mime

    received_sha256 = hashlib.sha256(audio_bytes).hexdigest()
    logger.info(
        f"Received audio speech upload: filename={file.filename}, attempt_id={attempt_id or 'N/A'}, "
        f"size={len(audio_bytes)} bytes, mime_type={mime_type}, sha256={received_sha256}"
    )

    analysis_res = await analyze_speech_audio(
        audio_bytes=audio_bytes,
        mime_type=mime_type,
        prompt_title=prompt_title or "",
        prompt_category=prompt_category or "",
        target_duration=target_duration or 90,
        actual_duration=actual_duration or 0,
        is_silent=bool(is_silent),
        attempt_id=attempt_id,
    )

    # Persist completed analysis session to MongoDB
    now_iso = datetime.now(timezone.utc).isoformat()
    session_obj = CommunicationSessionItem(
        id=str(uuid.uuid4()),
        user_id=user_id,
        type="speaking_practice",
        prompt_title=prompt_title or "Speaking Practice",
        prompt_category=prompt_category or "General",
        transcript=analysis_res.transcript,
        duration_seconds=actual_duration or 0,
        fluency=analysis_res.fluency,
        pace=analysis_res.pace,
        clarity=analysis_res.clarity,
        filler_words=analysis_res.filler_words,
        overall_score=analysis_res.overall_score,
        strengths=analysis_res.strengths,
        suggestions=analysis_res.suggestions,
        star_feedback=analysis_res.star_feedback,
        created_at=now_iso,
    )

    try:
        doc = session_obj.model_dump()
        await communication_sessions_collection.insert_one(doc)
        analysis_res.id = session_obj.id
        analysis_res.created_at = session_obj.created_at
    except Exception as e:
        logger.warning(f"Failed to persist communication session to MongoDB: {e}")

    return analysis_res


@router.get("/history", response_model=CommunicationHistoryResponse)
async def get_communication_history(
    limit: int = Query(20, ge=1, le=100),
    skip: int = Query(0, ge=0),
    current_user: dict = Depends(get_current_user),
):
    """
    Retrieve authenticated user's past communication sessions ordered newest first.
    Strictly enforced user ownership via JWT.
    """
    user_id = current_user.get("id")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required",
        )

    try:
        query = {"user_id": user_id}
        total = await communication_sessions_collection.count_documents(query)
        cursor = communication_sessions_collection.find(query, {"_id": 0}).sort("created_at", -1).skip(skip).limit(limit)
        items = await cursor.to_list(limit)

        sessions = [CommunicationSessionItem(**item) for item in items]
        return CommunicationHistoryResponse(
            sessions=sessions,
            total=total,
            limit=limit,
            skip=skip,
        )
    except Exception as e:
        logger.error(f"Error fetching communication history: {e}")
        return CommunicationHistoryResponse(sessions=[], total=0, limit=limit, skip=skip)


@router.get("/history/{session_id}", response_model=CommunicationSessionItem)
async def get_communication_session_detail(
    session_id: str,
    current_user: dict = Depends(get_current_user),
):
    """
    Retrieve specific communication session details. Enforces user ownership.
    """
    user_id = current_user.get("id")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required",
        )

    session = await communication_sessions_collection.find_one(
        {"id": session_id, "user_id": user_id},
        {"_id": 0}
    )
    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Communication session not found",
        )

    return CommunicationSessionItem(**session)


@router.post("/generate-outreach", response_model=OutreachGenerateResponse, status_code=status.HTTP_200_OK)
async def generate_outreach_message_endpoint(
    request: OutreachGenerateRequest,
    current_user: dict = Depends(get_current_user),
):
    """
    Authenticated endpoint to generate polished outreach messages (Recruiter Cold Email, LinkedIn, Follow-up, Networking).
    Identity comes strictly from the authenticated JWT token.
    """
    user_id = current_user.get("id")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required",
        )

    res_dict = await generate_outreach_message(
        message_type=request.message_type,
        recipient_name=request.recipient_name or "",
        company_name=request.company_name or "",
        role=request.role or "",
        job_context=request.job_context or "",
        user_context=request.user_context or "",
        tone=request.tone or "professional",
    )

    return OutreachGenerateResponse(**res_dict)


# =========================================================================
# REAL-TIME GROUP DISCUSSION (GD) ENDPOINTS & WEBSOCKET
# =========================================================================

@router.post("/gd/rooms", response_model=GDRoomResponse, status_code=status.HTTP_201_CREATED)
async def create_gd_room(
    request: GDRoomCreateRequest,
    current_user: dict = Depends(get_current_user),
):
    """
    Create a new Group Discussion room.
    Identity is strictly obtained from the authenticated JWT.
    """
    room_dict = await gd_room_manager.create_room(
        topic=request.topic,
        host_user=current_user,
        max_participants=request.max_participants or 6,
        duration_minutes=request.duration_minutes or 15,
    )
    room_dict["is_host"] = True
    return GDRoomResponse(**room_dict)


@router.post("/gd/rooms/{room_id}/join", response_model=GDRoomResponse, status_code=status.HTTP_200_OK)
async def join_gd_room(
    room_id: str,
    current_user: dict = Depends(get_current_user),
):
    """
    Join an existing Group Discussion room.
    Identity comes from authenticated JWT.
    """
    room_dict = await gd_room_manager.join_room(room_id=room_id, user=current_user)
    user_id = current_user.get("id")
    room_dict["is_host"] = (room_dict["host_user_id"] == user_id)
    return GDRoomResponse(**room_dict)


@router.post("/gd/rooms/{room_id}/leave", status_code=status.HTTP_200_OK)
async def leave_gd_room(
    room_id: str,
    current_user: dict = Depends(get_current_user),
):
    """
    Leave a Group Discussion room.
    """
    user_id = current_user.get("id")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required",
        )
    await gd_room_manager.leave_room(room_id=room_id, user_id=user_id)
    return {"message": f"Successfully left room {room_id}"}


@router.post("/gd/rooms/{room_id}/start", response_model=GDRoomResponse, status_code=status.HTTP_200_OK)
async def start_gd_discussion(
    room_id: str,
    current_user: dict = Depends(get_current_user),
):
    """
    Start active Group Discussion. Strictly restricted to host identity from JWT.
    """
    user_id = current_user.get("id")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required",
        )
    room_dict = await gd_room_manager.start_discussion(room_id=room_id, user_id=user_id)
    room_dict["is_host"] = True
    return GDRoomResponse(**room_dict)


@router.post("/gd/rooms/{room_id}/end", response_model=GDRoomResponse, status_code=status.HTTP_200_OK)
async def end_gd_discussion(
    room_id: str,
    current_user: dict = Depends(get_current_user),
):
    """
    Conclude active Group Discussion. Strictly restricted to host identity from JWT.
    """
    user_id = current_user.get("id")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required",
        )
    room_dict = await gd_room_manager.end_discussion(room_id=room_id, user_id=user_id)
    room_dict["is_host"] = (room_dict["host_user_id"] == user_id)
    return GDRoomResponse(**room_dict)


@router.get("/gd/rooms/{room_id}", response_model=GDRoomResponse, status_code=status.HTTP_200_OK)
async def get_gd_room_status(
    room_id: str,
    current_user: dict = Depends(get_current_user),
):
    """
    Get current state of Group Discussion room.
    """
    room_dict = await gd_room_manager.get_room(room_id=room_id)
    user_id = current_user.get("id")
    room_dict["is_host"] = (room_dict["host_user_id"] == user_id)
    return GDRoomResponse(**room_dict)


@router.post("/gd/rooms/{room_id}/speak/start", response_model=GDRoomResponse, status_code=status.HTTP_200_OK)
async def start_gd_speaking_turn(
    room_id: str,
    current_user: dict = Depends(get_current_user),
):
    """
    Acquire server single active speaker lock for current user.
    """
    user_id = current_user.get("id")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required",
        )
    room_dict = await gd_room_manager.start_speaking_turn(room_id=room_id, user_id=user_id)
    room_dict["is_host"] = (room_dict["host_user_id"] == user_id)
    return GDRoomResponse(**room_dict)


@router.post("/gd/rooms/{room_id}/speak/stop", response_model=GDRoomResponse, status_code=status.HTTP_200_OK)
async def stop_gd_speaking_turn(
    room_id: str,
    file: UploadFile = File(None),
    turn_id: Optional[str] = Form(None),
    duration_seconds: Optional[float] = Form(1.0),
    current_user: dict = Depends(get_current_user),
):
    """
    Release speaking turn, save recorded audio segment, and advance fair rotation priority queue.
    """
    user_id = current_user.get("id")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required",
        )

    audio_bytes = b""
    mime_type = "audio/webm"
    if file:
        audio_bytes = await file.read()
        mime_type = file.content_type or "audio/webm"

    room_dict = await gd_room_manager.stop_speaking_turn(
        room_id=room_id,
        user_id=user_id,
        audio_bytes=audio_bytes,
        mime_type=mime_type,
        duration_seconds=duration_seconds or 1.0,
        turn_id=turn_id,
    )
    room_dict["is_host"] = (room_dict["host_user_id"] == user_id)
    return GDRoomResponse(**room_dict)



@router.websocket("/gd/ws/{room_id}")
async def gd_websocket_endpoint(
    websocket: WebSocket,
    room_id: str,
    token: Optional[str] = Query(None),
):
    """
    WebSocket endpoint for real-time room state, participant synchronization, and local speaking indicators.
    Authenticated via JWT query parameter `token`.
    """
    norm_room_id = room_id.strip().upper() if room_id else ""

    # Authenticate token
    user = None
    if token:
        payload = decode_access_token(token)
        if payload and "sub" in payload:
            user_id_sub = payload["sub"]
            try:
                db_user = await users_collection.find_one(
                    {"$or": [{"id": user_id_sub}, {"email": user_id_sub}]},
                    {"_id": 0}
                )
                if db_user:
                    user = db_user
                else:
                    user = {"id": user_id_sub, "full_name": payload.get("name", "User"), "name": payload.get("name", "User")}
            except Exception:
                user = {"id": user_id_sub, "full_name": payload.get("name", "User"), "name": payload.get("name", "User")}

    if not user:
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION, reason="Authentication required")
        return

    user_id = user["id"]

    try:
        await gd_room_manager.connect_ws(room_id=norm_room_id, user_id=user_id, websocket=websocket)
        
        while True:
            data = await websocket.receive_json()
            msg_type = data.get("type")

            if msg_type == "ping":
                await websocket.send_json({"type": "pong"})
            elif msg_type == "speaking":
                is_speaking = bool(data.get("is_speaking", False))
                await gd_room_manager.set_speaking_state(norm_room_id, user_id, is_speaking)
            elif msg_type == "leave":
                await gd_room_manager.leave_room(norm_room_id, user_id)
                break
    except WebSocketDisconnect:
        await gd_room_manager.disconnect_ws(norm_room_id, user_id)
    except Exception as e:
        logger.error(f"WebSocket error in room {norm_room_id}: {e}")
        await gd_room_manager.disconnect_ws(norm_room_id, user_id)


@router.post("/gd/rooms/{room_id}/evaluate", response_model=GDEvaluationResponse, status_code=status.HTTP_200_OK)
async def evaluate_gd_participant(
    room_id: str,
    current_user: dict = Depends(get_current_user),
):
    """
    Evaluates participant Group Discussion performance based on evidence.
    Returns cached result if evaluation already exists to prevent duplicate AI calls.
    Identity comes strictly from authenticated JWT.
    """
    user_id = current_user.get("id")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required",
        )

    # 1. Check if evaluation already exists for (room_id, user_id)
    try:
        cached_eval = await gd_evaluations_collection.find_one(
            {"room_id": room_id, "user_id": user_id},
            {"_id": 0}
        )
        if cached_eval:
            return GDEvaluationResponse(**cached_eval)
    except Exception as e:
        logger.warning(f"Failed to query MongoDB for cached GD evaluation: {e}")

    # 2. Retrieve room details
    room_dict = await gd_room_manager.get_room(room_id=room_id)

    # Room must be ended before evaluation
    if room_dict.get("status") != "ended":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Group Discussion session must be ended before generating evaluation.",
        )

    # 3. Generate evaluation
    eval_res = await evaluate_gd_session(room_data=room_dict, user=current_user)

    now_iso = datetime.now(timezone.utc).isoformat()
    eval_obj = GDEvaluationResponse(
        id=str(uuid.uuid4()),
        room_id=room_id,
        user_id=user_id,
        topic=room_dict.get("topic", "Group Discussion"),
        overall_score=eval_res.get("overall_score"),
        dimensions=eval_res.get("dimensions", {}),
        strengths=eval_res.get("strengths", []),
        suggestions=eval_res.get("suggestions", []),
        data_limitations=eval_res.get("data_limitations", []),
        winning_team=eval_res.get("winning_team"),
        winning_rationale=eval_res.get("winning_rationale"),
        team_evaluations=eval_res.get("team_evaluations", {}),
        participant_evaluations=eval_res.get("participant_evaluations", []),
        created_at=now_iso,
    )


    # 4. Save to MongoDB
    try:
        doc = eval_obj.model_dump()
        await gd_evaluations_collection.insert_one(doc)
    except Exception as e:
        logger.warning(f"Failed to persist GD evaluation to MongoDB: {e}")

    return eval_obj


@router.get("/gd/rooms/{room_id}/evaluation", response_model=GDEvaluationResponse, status_code=status.HTTP_200_OK)
async def get_gd_participant_evaluation(
    room_id: str,
    current_user: dict = Depends(get_current_user),
):
    """
    Retrieve current user's saved GD evaluation for room_id.
    Strictly isolated per user identity from JWT.
    """
    user_id = current_user.get("id")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required",
        )

    try:
        cached_eval = await gd_evaluations_collection.find_one(
            {"room_id": room_id, "user_id": user_id},
            {"_id": 0}
        )
        if cached_eval:
            return GDEvaluationResponse(**cached_eval)
    except Exception as e:
        logger.error(f"Error retrieving GD evaluation: {e}")

    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="No evaluation found for this room and user.",
    )


