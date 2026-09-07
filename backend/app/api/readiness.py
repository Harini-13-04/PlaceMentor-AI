from fastapi import APIRouter, HTTPException, Depends, status
from typing import Dict, Any, List
from app.middlewares.auth_middleware import get_current_user
from app.services.readiness_service import (
    calculate_placement_readiness,
    match_company_readiness,
    generate_personalized_roadmap,
)

router = APIRouter(prefix="/readiness", tags=["Placement Readiness"])


@router.get("")
async def get_readiness(current_user: dict = Depends(get_current_user)):
    """
    Get calculated placement readiness score and skill competency breakdown.
    """
    user_id = current_user["id"]
    return await calculate_placement_readiness(user_id)


@router.get("/company-matches")
async def get_company_matches(current_user: dict = Depends(get_current_user)):
    """
    Get evidence-based matching against Tier-1 Product, Service, and Startup benchmarks.
    """
    user_id = current_user["id"]
    matches = await match_company_readiness(user_id)
    return {"matches": matches, "total": len(matches)}


@router.get("/roadmap")
async def get_roadmap(current_user: dict = Depends(get_current_user)):
    """
    Get personalized adaptive placement roadmap tailored to learner profile and progress.
    """
    user_id = current_user["id"]
    return await generate_personalized_roadmap(user_id)
