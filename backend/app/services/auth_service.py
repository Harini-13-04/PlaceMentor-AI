from datetime import datetime, timezone
from typing import Optional, List, Dict, Any
import logging
try:
    from google.oauth2 import id_token
    from google.auth.transport import requests as google_requests
except ImportError:
    id_token = None
    google_requests = None
from app.database.mongodb import users_collection, learner_profiles_collection
from app.models.user import User
from app.core.security import hash_password, verify_password
try:
    from app.core.config import GOOGLE_CLIENT_ID
except ImportError:
    GOOGLE_CLIENT_ID = None

logger = logging.getLogger(__name__)


async def create_user(
    full_name: str = "",
    email: str = "",
    password: str = "",
    college: str = "",
    department: str = "",
    year: str = "",
    skills: Optional[List[str]] = None,
    name: Optional[str] = None,
    gender: Optional[str] = "",
):
    existing_user = await users_collection.find_one({"email": email.lower().strip()})

    if existing_user:
        return None

    display_name = (name or full_name or "").strip()
    user = User(
        name=display_name,
        full_name=display_name,
        email=email.lower().strip(),
        password=hash_password(password),
        college=college.strip() if college else "",
        department=department.strip() if department else "",
        year=year.strip() if year else "",
        skills=skills or [],
        gender=gender.strip() if gender else "",
        avatar="",
        bio="",
        phone="",
        github="",
        linkedin="",
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc),
    )

    doc = user.model_dump()
    await users_collection.insert_one(doc)
    return user


async def authenticate_user(email: str, password: str):
    user_dict = await users_collection.find_one({"email": email.lower().strip()})
    if not user_dict:
        return None
    if not verify_password(password, user_dict.get("password", "")):
        return None
    return user_dict


async def authenticate_or_create_google_user(credential: str) -> Optional[Dict[str, Any]]:
    try:
        id_info = id_token.verify_oauth2_token(
            credential,
            google_requests.Request(),
            GOOGLE_CLIENT_ID
        )
    except Exception as e:
        logger.error(f"Failed to verify Google OAuth token: {e}")
        return None

    email = id_info.get("email")
    if not email:
        logger.error("No email in Google OAuth token payload")
        return None

    email = email.lower().strip()
    name = (id_info.get("name") or "").strip() or email.split("@")[0]
    picture = id_info.get("picture", "")

    user_dict = await users_collection.find_one({"email": email})
    if user_dict:
        if picture and not user_dict.get("avatar"):
            await users_collection.update_one(
                {"email": email},
                {"$set": {"avatar": picture, "updated_at": datetime.now(timezone.utc)}}
            )
            user_dict["avatar"] = picture
        return user_dict

    user = User(
        name=name,
        full_name=name,
        email=email,
        password=hash_password(f"google_oauth_{id_info.get('sub', '')}"),
        college="",
        department="",
        year="",
        skills=[],
        gender="",
        avatar=picture,
        bio="",
        phone="",
        github="",
        linkedin="",
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc),
    )

    doc = user.model_dump()
    await users_collection.insert_one(doc)
    return doc


async def get_user_by_id(user_id: str) -> Optional[Dict[str, Any]]:
    return await users_collection.find_one({"id": user_id}, {"password": 0, "_id": 0})


async def update_user_profile(user_id: str, update_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    clean_data = {k: v for k, v in update_data.items() if v is not None}

    # Normalize aliases to canonical field names
    if "first_name" in clean_data or "last_name" in clean_data:
        fn = str(clean_data.pop("first_name", "") or "").strip()
        ln = str(clean_data.pop("last_name", "") or "").strip()
        if fn or ln:
            combined = f"{fn} {ln}".strip()
            clean_data["full_name"] = combined
            clean_data["name"] = combined

    if "name" in clean_data and not clean_data.get("full_name"):
        clean_data["full_name"] = clean_data["name"]
    elif "full_name" in clean_data and not clean_data.get("name"):
        clean_data["name"] = clean_data["full_name"]

    if "academic_year" in clean_data:
        if "year" not in clean_data:
            clean_data["year"] = clean_data.pop("academic_year")
        else:
            clean_data.pop("academic_year", None)

    if "date_of_birth" in clean_data:
        if "dob" not in clean_data:
            clean_data["dob"] = clean_data.pop("date_of_birth")
        else:
            clean_data.pop("date_of_birth", None)

    if "career_goal" in clean_data:
        if "target_role" not in clean_data:
            clean_data["target_role"] = clean_data.pop("career_goal")
        else:
            clean_data.pop("career_goal", None)

    if "dream_role" in clean_data:
        if "target_role" not in clean_data:
            clean_data["target_role"] = clean_data.pop("dream_role")
        else:
            clean_data.pop("dream_role", None)

    if "company_type" in clean_data:
        if "target_company" not in clean_data:
            clean_data["target_company"] = clean_data.pop("company_type")
        else:
            clean_data.pop("company_type", None)

    if "languages" in clean_data:
        if "preferred_languages" not in clean_data:
            clean_data["preferred_languages"] = clean_data.pop("languages")
        else:
            clean_data.pop("languages", None)

    if "portfolio" in clean_data:
        if "website" not in clean_data:
            clean_data["website"] = clean_data.pop("portfolio")
        else:
            clean_data.pop("portfolio", None)

    clean_data["updated_at"] = datetime.now(timezone.utc)

    result = await users_collection.find_one_and_update(
        {"$or": [{"id": user_id}, {"email": user_id}]},
        {"$set": clean_data},
        return_document=True,
    )

    # Merge/patch learner_profiles strictly without erasing existing dimensions
    learner_patch = {}
    if "gender" in clean_data:
        learner_patch["gender"] = clean_data["gender"]
    if "target_role" in clean_data:
        learner_patch["career_goal"] = clean_data["target_role"]
    if "target_company" in clean_data:
        learner_patch["target_company_type"] = clean_data["target_company"]
    if "year" in clean_data:
        learner_patch["academic_year"] = clean_data["year"]
    if "preferred_languages" in clean_data:
        learner_patch["preferred_languages"] = clean_data["preferred_languages"]
    if "programming_level" in clean_data:
        learner_patch["programming_level"] = clean_data["programming_level"]
    if "dsa_level" in clean_data:
        learner_patch["dsa_level"] = clean_data["dsa_level"]
    if "aptitude_level" in clean_data:
        learner_patch["aptitude_level"] = clean_data["aptitude_level"]
    if "core_cs_level" in clean_data:
        learner_patch["core_cs_level"] = clean_data["core_cs_level"]

    if learner_patch:
        await learner_profiles_collection.update_one(
            {"user_id": user_id},
            {"$set": learner_patch}
        )

    if result and "_id" in result:
        del result["_id"]
    if result and "password" in result:
        del result["password"]
    return result


async def update_user_banner(user_id: str, banner_url: str) -> Optional[Dict[str, Any]]:
    return await update_user_profile(user_id, {"banner_image": banner_url})


async def remove_user_banner(user_id: str) -> Optional[Dict[str, Any]]:
    return await update_user_profile(user_id, {"banner_image": ""})


async def update_user_avatar(user_id: str, avatar_url: str) -> Optional[Dict[str, Any]]:
    return await update_user_profile(user_id, {"avatar": avatar_url})


async def remove_user_avatar(user_id: str) -> Optional[Dict[str, Any]]:
    return await update_user_profile(user_id, {"avatar": ""})


async def change_user_password(user_id: str, current_password: str, new_password: str) -> bool:
    user = await users_collection.find_one({"$or": [{"id": user_id}, {"email": user_id}]})
    if not user:
        return False
    if not verify_password(current_password, user.get("password", "")):
        return False

    new_hash = hash_password(new_password)
    await users_collection.update_one(
        {"$or": [{"id": user_id}, {"email": user_id}]},
        {"$set": {"password": new_hash, "updated_at": datetime.now(timezone.utc)}}
    )
    return True
