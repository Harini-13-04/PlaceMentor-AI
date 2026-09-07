"""
PlaceMentor AI — Onboarding & Learner Profile Service
Collects initial learner profile without fabricating fake baseline scores.
Supports beginners through advanced learners across all academic years.
"""

from typing import Optional, Dict, Any
from datetime import datetime, timezone
import uuid
from app.database.mongodb import learner_profiles_collection, users_collection
from app.models.learner import OnboardingRequest, LearnerProfile


async def get_learner_profile(user_id: str) -> Optional[Dict[str, Any]]:
    """
    Fetches the learner profile for a given user.
    """
    profile = await learner_profiles_collection.find_one({"user_id": user_id}, {"_id": 0})
    return profile


async def save_learner_profile(user_id: str, data: OnboardingRequest) -> Dict[str, Any]:
    """
    Saves or updates learner profile in MongoDB and marks onboarding_completed on user.
    """
    now = datetime.now(timezone.utc).isoformat()
    profile_dict = data.model_dump()
    profile_dict["user_id"] = user_id
    profile_dict["onboarding_completed"] = True
    profile_dict["updated_at"] = now

    existing = await learner_profiles_collection.find_one({"user_id": user_id})
    if existing:
        await learner_profiles_collection.update_one(
            {"user_id": user_id},
            {"$set": profile_dict}
        )
    else:
        profile_dict["id"] = str(uuid.uuid4())
        profile_dict["created_at"] = now
        await learner_profiles_collection.insert_one(profile_dict)

    # Update users collection flag and academic year / skills / gender
    user_update: Dict[str, Any] = {
        "onboarding_completed": True,
        "year": data.academic_year,
        "skills": data.preferred_languages,
        "updated_at": now,
    }
    if data.gender:
        user_update["gender"] = data.gender

    await users_collection.update_one(
        {"id": user_id},
        {"$set": user_update}
    )

    saved = await learner_profiles_collection.find_one({"user_id": user_id}, {"_id": 0})
    return saved or profile_dict
