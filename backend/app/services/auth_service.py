from datetime import datetime, timezone
from typing import Optional, List, Dict, Any
import logging
import httpx
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from app.database.mongodb import users_collection, learner_profiles_collection
from app.models.user import User
from app.core.security import hash_password, verify_password
from app.core.config import GOOGLE_CLIENT_ID, GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET

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


async def authenticate_or_create_github_user(code: str) -> Optional[Dict[str, Any]]:
    if not GITHUB_CLIENT_ID or not GITHUB_CLIENT_SECRET or GITHUB_CLIENT_ID.startswith("Ov23liXXXX"):
        logger.error("GitHub OAuth credentials (GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET) are not configured.")
        return None

    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            token_resp = await client.post(
                "https://github.com/login/oauth/access_token",
                headers={"Accept": "application/json"},
                data={
                    "client_id": GITHUB_CLIENT_ID,
                    "client_secret": GITHUB_CLIENT_SECRET,
                    "code": code,
                },
            )
            token_data = token_resp.json()
            access_token = token_data.get("access_token")
            if not access_token:
                logger.error(f"GitHub OAuth error response: {token_data}")
                return None

            gh_headers = {
                "Authorization": f"Bearer {access_token}",
                "Accept": "application/vnd.github.v3+json",
                "User-Agent": "PlaceMentor-AI",
            }

            user_resp = await client.get("https://api.github.com/user", headers=gh_headers)
            if user_resp.status_code != 200:
                logger.error(f"Failed to fetch GitHub user profile: {user_resp.text}")
                return None
            gh_user = user_resp.json()

            email = gh_user.get("email")
            if not email:
                emails_resp = await client.get("https://api.github.com/user/emails", headers=gh_headers)
                if emails_resp.status_code == 200:
                    emails = emails_resp.json()
                    for em in emails:
                        if em.get("primary") and em.get("verified"):
                            email = em.get("email")
                            break
                    if not email and emails:
                        email = emails[0].get("email")

            github_username = gh_user.get("login", "")
            if not email:
                email = f"{github_username}@users.noreply.github.com"

            email = email.lower().strip()
            name = (gh_user.get("name") or github_username).strip()
            avatar = gh_user.get("avatar_url") or ""
            bio = gh_user.get("bio") or ""

            user_dict = await users_collection.find_one({"email": email})
            if user_dict:
                updates = {}
                if avatar and not user_dict.get("avatar"):
                    updates["avatar"] = avatar
                if github_username and not user_dict.get("github"):
                    updates["github"] = f"https://github.com/{github_username}"
                if updates:
                    updates["updated_at"] = datetime.now(timezone.utc)
                    await users_collection.update_one({"email": email}, {"$set": updates})
                    user_dict.update(updates)
                return user_dict

            user = User(
                name=name,
                full_name=name,
                email=email,
                password=hash_password(f"github_oauth_{gh_user.get('id', '')}"),
                college="",
                department="",
                year="",
                skills=[],
                gender="",
                avatar=avatar,
                bio=bio,
                phone="",
                github=f"https://github.com/{github_username}" if github_username else "",
                linkedin="",
                created_at=datetime.now(timezone.utc),
                updated_at=datetime.now(timezone.utc),
            )
            doc = user.model_dump()
            await users_collection.insert_one(doc)
            return doc
    except Exception as e:
        logger.error(f"Error in GitHub OAuth flow: {e}")
        return None


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

    if "gender" in clean_data:
        await learner_profiles_collection.update_one(
            {"user_id": user_id},
            {"$set": {"gender": clean_data["gender"]}}
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
