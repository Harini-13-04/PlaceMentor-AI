from datetime import datetime, timezone
from typing import Optional, List, Dict, Any
from app.database.mongodb import users_collection
from app.models.user import User
from app.core.security import hash_password, verify_password


async def create_user(
    name: str = "",
    full_name: str = "",
    email: str = "",
    password: str = "",
    college: str = "",
    department: str = "",
    year: str = "",
    skills: Optional[List[str]] = None,
):
    existing_user = await users_collection.find_one({"email": email.lower().strip()})

    if existing_user:
        return None

    display_name = name.strip() if name else (full_name.strip() if full_name else "")
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

    await users_collection.insert_one(user.model_dump())
    return user


async def authenticate_user(email: str, password: str):
    user_dict = await users_collection.find_one({"email": email.lower().strip()})
    if not user_dict:
        return None
    if not verify_password(password, user_dict.get("password", "")):
        return None
    return user_dict


async def get_user_by_id(user_id: str):
    user_dict = await users_collection.find_one(
        {"$or": [{"id": user_id}, {"email": user_id}]},
        {"password": 0, "_id": 0}
    )
    return user_dict


async def update_user_profile(user_id: str, update_data: dict):
    update_data["updated_at"] = datetime.now(timezone.utc)
    
    # Keep name and full_name in sync
    if "name" in update_data and "full_name" not in update_data:
        update_data["full_name"] = update_data["name"]
    elif "full_name" in update_data and "name" not in update_data:
        update_data["name"] = update_data["full_name"]

    result = await users_collection.update_one(
        {"$or": [{"id": user_id}, {"email": user_id}]},
        {"$set": update_data}
    )
    if result.matched_count == 0:
        return None

    updated_user = await users_collection.find_one(
        {"$or": [{"id": user_id}, {"email": user_id}]},
        {"password": 0, "_id": 0}
    )
    return updated_user


async def update_user_avatar(user_id: str, avatar_url: str):
    return await update_user_profile(user_id, {"avatar": avatar_url})


async def remove_user_avatar(user_id: str):
    return await update_user_profile(user_id, {"avatar": ""})


async def change_user_password(user_id: str, current_password: str, new_password: str):
    user = await users_collection.find_one({"$or": [{"id": user_id}, {"email": user_id}]})
    if not user:
        return False, "User not found"

    if not verify_password(current_password, user.get("password", "")):
        return False, "Invalid current password"

    new_hash = hash_password(new_password)
    await users_collection.update_one(
        {"$or": [{"id": user_id}, {"email": user_id}]},
        {"$set": {"password": new_hash, "updated_at": datetime.now(timezone.utc)}}
    )
    return True, "Password updated successfully"