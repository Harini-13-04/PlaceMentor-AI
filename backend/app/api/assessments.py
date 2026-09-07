from fastapi import APIRouter, HTTPException, Depends, status, Query
from typing import Optional, Dict, Any, List
from pydantic import BaseModel
from app.middlewares.auth_middleware import get_current_user, get_optional_current_user
from app.services.assessment_service import (
    allocate_assessment_questions,
    submit_assessment_attempt,
    get_topic_study_guide,
    get_user_assessment_history,
)

router = APIRouter(prefix="/assessments", tags=["Assessments"])


class AssessmentSubmitRequest(BaseModel):
    assessment_type: str  # "aptitude" or "quiz"
    category: str
    topic: str
    difficulty: str = "Mixed"
    answers: Dict[str, int]  # {question_id: selected_index}
    time_spent_seconds: int = 0


@router.get("/questions")
async def get_questions(
    assessment_type: str = Query("aptitude"),
    category: Optional[str] = Query(None),
    topic: Optional[str] = Query(None),
    difficulty: Optional[str] = Query("Mixed"),
    count: int = Query(5, ge=1, le=50),
    current_user: Optional[dict] = Depends(get_optional_current_user),
):
    """
    Allocate questions for a practice session or mock exam.
    Uses user history to minimize question repetition.
    """
    user_id = current_user.get("id") if current_user else "default-user"
    questions = await allocate_assessment_questions(
        user_id=user_id,
        assessment_type=assessment_type,
        category=category,
        topic=topic,
        difficulty=difficulty,
        count=count,
    )
    return {"questions": questions, "total": len(questions)}


@router.get("/guide/{topic}")
async def get_study_guide(topic: str):
    """
    Retrieve formula sheets, concept breakdowns, and examples for a topic.
    """
    guide = get_topic_study_guide(topic)
    if not guide:
        # Fallback basic guide
        return {
            "concept": f"Essential placement preparation principles and problem-solving strategies for {topic}.",
            "formulas": [],
            "examples": [],
        }
    return guide


@router.post("/submit")
async def submit_attempt(
    request: AssessmentSubmitRequest,
    current_user: dict = Depends(get_current_user),
):
    """
    Submit completed assessment, persist attempt in MongoDB, and return diagnostic breakdown.
    """
    user_id = current_user["id"]
    result = await submit_assessment_attempt(
        user_id=user_id,
        assessment_type=request.assessment_type,
        category=request.category,
        topic=request.topic,
        difficulty=request.difficulty,
        answers=request.answers,
        time_spent_seconds=request.time_spent_seconds,
    )
    return result


@router.get("/history")
async def get_history(
    assessment_type: Optional[str] = Query(None),
    current_user: dict = Depends(get_current_user),
):
    """
    Retrieve authenticated user's real assessment history.
    """
    user_id = current_user["id"]
    history = await get_user_assessment_history(user_id=user_id, assessment_type=assessment_type)
    return {"attempts": history, "total": len(history)}
