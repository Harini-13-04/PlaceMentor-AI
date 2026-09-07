from typing import Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.core.security import decode_access_token
from app.database.mongodb import users_collection

security = HTTPBearer(auto_error=False)


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
) -> dict:
    default_demo_user = {
        "id": "u-demo-101",
        "full_name": "Harini Muthuvel",
        "name": "Harini Muthuvel",
        "email": "harini.muthuvel@srmist.edu.in",
        "is_active": True,
    }

    if not credentials or not credentials.credentials:
        return default_demo_user

    token = credentials.credentials

    # Demo mode fallback
    if token in ["demo-token", "demo-jwt-token"] or token.startswith("demo"):
        return default_demo_user

    payload = decode_access_token(token)

    if not payload or "sub" not in payload:
        # Fallback to demo user if token is expired or invalid
        return default_demo_user

    user_identifier = payload["sub"]

    try:
        user = await users_collection.find_one(
            {"$or": [{"id": user_identifier}, {"email": user_identifier}]},
            {"_id": 0}
        )
    except Exception:
        user = None

    if not user:
        if user_identifier.startswith("u-demo") or "demo" in user_identifier or user_identifier == "harini.muthuvel@srmist.edu.in":
            return default_demo_user
        # Return fallback user if not found in local DB during dev
        return default_demo_user

    if not user.get("is_active", True):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is deactivated",
        )

    return user


async def get_optional_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
) -> Optional[dict]:
    if not credentials or not credentials.credentials:
        return None
    try:
        return await get_current_user(credentials)
    except Exception:
        return None
