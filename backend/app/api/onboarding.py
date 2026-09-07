from fastapi import APIRouter, HTTPException, Depends, status
from app.middlewares.auth_middleware import get_current_user
from app.models.learner import OnboardingRequest
from app.services.onboarding_service import get_learner_profile, save_learner_profile

router = APIRouter(prefix="/onboarding", tags=["Onboarding"])


@router.get("")
@router.get("/")
@router.get("/status")
async def get_onboarding_status(current_user: dict = Depends(get_current_user)):
    """
    Check if the user has completed onboarding and return the profile if available.
    """
    user_id = current_user["id"]
    profile = await get_learner_profile(user_id)
    is_completed = bool(profile and profile.get("onboarding_completed", False))

    if profile:
        res = dict(profile)
        res["onboarding_completed"] = is_completed
        res["profile"] = profile
        return res

    return {
        "onboarding_completed": is_completed,
        "profile": None,
    }


@router.post("")
@router.post("/")
@router.post("/submit")
async def submit_onboarding(data: OnboardingRequest, current_user: dict = Depends(get_current_user)):
    """
    Submit initial personalization learner profile.
    """
    user_id = current_user["id"]
    saved_profile = await save_learner_profile(user_id, data)
    return {
        "message": "Learner profile saved successfully.",
        "profile": saved_profile,
        "onboarding_completed": True,
        **saved_profile,
    }
