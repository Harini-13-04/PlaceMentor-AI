from fastapi import APIRouter, HTTPException, Depends
from app.middlewares.auth_middleware import get_current_user
from app.services.auth_service import get_user_by_id, update_user_profile
from models.profile import Profile, ProfileUpdate

router = APIRouter(prefix="/profile", tags=["Profile"])


@router.get("", response_model=Profile)
async def get_profile(current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]
    user_doc = await get_user_by_id(user_id) or current_user

    return Profile(
        user_id=user_id,
        name=user_doc.get("name") or user_doc.get("full_name") or "Student",
        bio=user_doc.get("bio", "") or "",
        phone=user_doc.get("phone", "") or "",
        email=user_doc.get("email", "") or "",
        college=user_doc.get("college", "") or "",
        dreamRole=user_doc.get("target_role", "") or "",
        skills=user_doc.get("skills", []) or [],
        github=user_doc.get("github", "") or "",
        linkedin=user_doc.get("linkedin", "") or "",
        resumeScore=0,
        level=1,
        xp=0,
        xpToNext=1000,
        avatarUrl=user_doc.get("avatar", "") or "",
        bannerColor="#1e1b4b",
    )


@router.put("", response_model=Profile)
async def update_profile(input: ProfileUpdate, current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]
    update_data = input.model_dump(exclude_unset=True)

    if "dreamRole" in update_data:
        update_data["target_role"] = update_data.pop("dreamRole")
    if "avatarUrl" in update_data:
        update_data["avatar"] = update_data.pop("avatarUrl")

    updated_user = await update_user_profile(user_id, update_data) or current_user

    return Profile(
        user_id=user_id,
        name=updated_user.get("name") or updated_user.get("full_name") or "Student",
        bio=updated_user.get("bio", "") or "",
        phone=updated_user.get("phone", "") or "",
        email=updated_user.get("email", "") or "",
        college=updated_user.get("college", "") or "",
        dreamRole=updated_user.get("target_role", "") or "",
        skills=updated_user.get("skills", []) or [],
        github=updated_user.get("github", "") or "",
        linkedin=updated_user.get("linkedin", "") or "",
        resumeScore=0,
        level=1,
        xp=0,
        xpToNext=1000,
        avatarUrl=updated_user.get("avatar", "") or "",
        bannerColor="#1e1b4b",
    )