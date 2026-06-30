from fastapi import APIRouter

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

    default_profile = Profile()
    await db.profiles.insert_one(default_profile.model_dump())
    return default_profile


@router.put("", response_model=Profile)
async def update_profile(input: ProfileUpdate):
    existing = await db.profiles.find_one(
        {"user_id": DEFAULT_USER_ID},
        {"_id": 0}
    )

    profile_id = existing.get("id", "default-profile") if existing else "default-profile"

    profile = Profile(
        **input.model_dump(),
        id=profile_id,
        user_id=DEFAULT_USER_ID,
    )

    await db.profiles.update_one(
        {"user_id": DEFAULT_USER_ID},
        {"$set": profile.model_dump()},
        upsert=True,
    )

    return profile