from fastapi import APIRouter, HTTPException, Depends, status, Query
from typing import Optional, Dict, Any
from pydantic import BaseModel
from app.middlewares.auth_middleware import get_current_user, get_optional_current_user
from app.services.brain_zone_engine import (
    WORLDS,
    generate_brain_challenge,
    get_user_brain_progress,
    record_brain_game_completion,
)

router = APIRouter(prefix="/brainzone", tags=["Brain Zone"])


class BrainGameCompleteRequest(BaseModel):
    game_id: str
    world_id: str
    level: int = 1
    seed: int
    score: int = 0
    accuracy: float = 100.0
    time_spent_seconds: int = 0
    passed: bool = True


@router.get("/worlds")
async def get_worlds(current_user: Optional[dict] = Depends(get_optional_current_user)):
    """
    Get all 5 Brain Zone worlds with player unlock status.
    """
    user_id = current_user.get("id") if current_user else "default-user"
    prog = await get_user_brain_progress(user_id)
    unlocked_set = set(prog.get("unlocked_worlds", ["mind-forest"]))

    worlds_with_status = []
    for w in WORLDS:
        w_copy = dict(w)
        w_copy["is_unlocked"] = w["id"] in unlocked_set or w["unlock_level"] <= prog.get("player_level", 1)
        worlds_with_status.append(w_copy)

    return {
        "worlds": worlds_with_status,
        "player_level": prog.get("player_level", 1),
        "xp": prog.get("xp", 0),
    }


@router.get("/generate")
async def generate_challenge(
    game_type: str = Query("sudoku"),
    level: int = Query(1, ge=1),
    difficulty: str = Query("Easy"),
    seed: Optional[int] = Query(None),
):
    """
    Generate an endless procedural challenge using seed and difficulty parameters.
    """
    challenge = generate_brain_challenge(
        game_type=game_type,
        level=level,
        seed=seed,
        difficulty=difficulty,
    )
    return challenge


@router.get("/progress")
async def get_progress(current_user: dict = Depends(get_current_user)):
    """
    Retrieve real Brain Zone player progression, XP, and achievements from MongoDB.
    """
    user_id = current_user["id"]
    progress = await get_user_brain_progress(user_id)
    return progress


@router.post("/complete")
async def complete_game(
    req: BrainGameCompleteRequest,
    current_user: dict = Depends(get_current_user),
):
    """
    Record completed level, award real XP, and update progression in MongoDB.
    """
    user_id = current_user["id"]
    result = await record_brain_game_completion(
        user_id=user_id,
        game_id=req.game_id,
        world_id=req.world_id,
        level=req.level,
        seed=req.seed,
        score=req.score,
        accuracy=req.accuracy,
        time_spent_seconds=req.time_spent_seconds,
        passed=req.passed,
    )
    return result
