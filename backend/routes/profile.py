from fastapi import APIRouter, HTTPException

from database import db
from models.profile import Profile, ProfileUpdate

router = APIRouter(prefix="/profile", tags=["Profile"])

DEFAULT_USER_ID = "default-user"


@router.get("", response_model=Profile)
async def get_profile():
    profile = await db.profiles.find_one(
        {"user_id": DEFAULT_USER_ID},
        {"_id": 0}
    )

    if profile:
        return profile

    default_profile = Profile(
        user_id=DEFAULT_USER_ID,
        name="New Student",
        bio="",
        phone="",
        email="",
        college="",
        dreamRole="",
        skills=[],
        github="",
        linkedin="",
        resumeScore=0,
        level=1,
        xp=0,
        xpToNext=1000,
        avatarUrl="",
        bannerColor="#1e1b4b",
    )

    await db.profiles.insert_one(default_profile.model_dump())
    return default_profile


@router.put("", response_model=Profile)
async def update_profile(input: ProfileUpdate):
    existing = await db.profiles.find_one(
        {"user_id": DEFAULT_USER_ID},
        {"_id": 0}
    )

    if not existing:
        raise HTTPException(status_code=404, detail="Profile not found")

    update_data = input.model_dump(exclude_unset=True)

    await db.profiles.update_one(
        {"user_id": DEFAULT_USER_ID},
        {"$set": update_data}
    )

    updated_profile = await db.profiles.find_one(
        {"user_id": DEFAULT_USER_ID},
        {"_id": 0}
    )

    return updated_profile