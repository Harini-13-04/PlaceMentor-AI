from datetime import datetime, timezone
from typing import Optional, List, Dict, Any
from app.database.mongodb import users_collection
from app.models.user import User
from app.core.security import hash_password, verify_password


async def create_user(
    full_name: str = "",
    email: str = "",
    password: str = "",
    college: str = "",
    department: str = "",
    year: str = "",
    skills: Optional[List[str]] = None,
    name: Optional[str] = None,
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


async def get_user_by_id(user_id: str) -> Optional[Dict[str, Any]]:
    return await users_collection.find_one({"id": user_id}, {"password": 0, "_id": 0})


async def update_user_profile(user_id: str, update_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    clean_data = {k: v for k, v in update_data.items() if v is not None}
    if "name" in clean_data and not clean_data.get("full_name"):
        clean_data["full_name"] = clean_data["name"]
    elif "full_name" in clean_data and not clean_data.get("name"):
        clean_data["name"] = clean_data["full_name"]

    clean_data["updated_at"] = datetime.now(timezone.utc)

    result = await users_collection.find_one_and_update(
        {"$or": [{"id": user_id}, {"email": user_id}]},
        {"$set": clean_data},
        return_document=True,
    )
    if result and "_id" in result:
        del result["_id"]
    if result and "password" in result:
        del result["password"]
    return result


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