from fastapi import APIRouter, HTTPException, Depends, status
from typing import List, Optional, Dict, Any
from app.middlewares.auth_middleware import get_current_user, get_optional_current_user
from app.services.problems_service import (
    get_all_problems,
    get_problem_by_id,
    get_user_submissions,
)
from app.database.mongodb import user_problems_collection, coding_submissions_collection

router = APIRouter(prefix="/problems", tags=["Problems"])


@router.get("")
async def list_problems(current_user: Optional[dict] = Depends(get_optional_current_user)):
    """
    Get all problems with user solved status (sanitized: hidden tests omitted).
    """
    user_id = current_user.get("id") if current_user else None
    problems = await get_all_problems(user_id=user_id)
    return {"problems": problems, "total": len(problems)}


@router.get("/stats")
async def get_user_problem_stats(current_user: dict = Depends(get_current_user)):
    """
    Get real problem solving stats for authenticated user.
    """
    user_id = current_user["id"]
    all_problems = await get_all_problems()
    total_problems = len(all_problems)
    solved_docs = await user_problems_collection.find({"user_id": user_id, "status": "Solved"}, {"_id": 0}).to_list(1000)
    attempted_docs = await user_problems_collection.find({"user_id": user_id, "status": "Attempted"}, {"_id": 0}).to_list(1000)
    total_submissions = await coding_submissions_collection.count_documents({"user_id": user_id})

    return {
        "solved_count": len(solved_docs),
        "total_problems": total_problems,
        "attempted_count": len(attempted_docs),
        "total_submissions": total_submissions,
        "solved_problem_ids": [d["problem_id"] for d in solved_docs],
    }


@router.get("/{problem_id}")
async def get_problem(problem_id: str, current_user: Optional[dict] = Depends(get_optional_current_user)):
    """
    Get sanitized problem details.
    """
    user_id = current_user.get("id") if current_user else None
    problem = await get_problem_by_id(problem_id, user_id=user_id)
    if not problem:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Problem '{problem_id}' not found.",
        )
    return problem


@router.get("/{problem_id}/submissions")
async def get_problem_submissions(problem_id: str, current_user: dict = Depends(get_current_user)):
    """
    Get real user submissions for a specific problem.
    """
    user_id = current_user["id"]
    submissions = await get_user_submissions(user_id=user_id, problem_id=problem_id)
    return {"submissions": submissions, "total": len(submissions)}
