from datetime import datetime, timezone
from typing import Optional, List, Dict, Any
from app.database.mongodb import users_collection
from app.models.user import User
from app.core.security import hash_password, verify_password


async def create_user(
    name: str,
    email: str,
    password: str,
    college: str = "",
    department: str = "",
    year: str = "",
    skills: Optional[List[str]] = None,
) -> Optional[User]:
    # Check case-insensitive existing email
    existing_user = await users_collection.find_one({"email": email.strip().lower()})
    if existing_user:
        return None

    clean_name = name.strip() if name else ""
    user = User(
        name=clean_name,
        full_name=clean_name,
        email=email.strip().lower(),
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


async def authenticate_user(email: str, password: str) -> Optional[dict]:
    user = await users_collection.find_one(
        {"email": email.strip().lower()},
        {"_id": 0}
    )
    if not user:
        return None

    if not verify_password(password, user["password"]):
        return None

    return user


async def change_user_password(
    user_id: str,
    current_password: str,
    new_password: str
) -> bool:
    user = await users_collection.find_one({"id": user_id})
    if not user:
        return False

    if not verify_password(current_password, user["password"]):
        return False

    new_hash = hash_password(new_password)
    await users_collection.update_one(
        {"id": user_id},
        {
            "$set": {
                "password": new_hash,
                "updated_at": datetime.now(timezone.utc),
            }
        }
    )
    return True


async def update_user_profile(user_id: str, update_data: Dict[str, Any]) -> Optional[dict]:
    # Synchronize name and full_name if either is passed
    if "name" in update_data and update_data["name"]:
        update_data["full_name"] = update_data["name"]
    elif "full_name" in update_data and update_data["full_name"]:
        update_data["name"] = update_data["full_name"]

    update_data["updated_at"] = datetime.now(timezone.utc)

    result = await users_collection.find_one_and_update(
        {"id": user_id},
        {"$set": update_data},
        return_document=True,
        projection={"_id": 0}
    )
    return result


async def update_user_avatar(user_id: str, avatar_url: str) -> Optional[dict]:
    result = await users_collection.find_one_and_update(
        {"id": user_id},
        {
            "$set": {
                "avatar": avatar_url,
                "updated_at": datetime.now(timezone.utc),
            }
        },
        return_document=True,
        projection={"_id": 0}
    )
    return result


async def remove_user_avatar(user_id: str) -> Optional[dict]:
    result = await users_collection.find_one_and_update(
        {"id": user_id},
        {
            "$set": {
                "avatar": "",
                "updated_at": datetime.now(timezone.utc),
            }
        },
        return_document=True,
        projection={"_id": 0}
    )
    return result


async def get_user_by_id(user_id: str) -> Optional[dict]:
    return await users_collection.find_one(
        {"id": user_id},
        {"_id": 0}
    )