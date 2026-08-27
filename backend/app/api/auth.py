from fastapi import APIRouter, HTTPException, Depends, Header
from app.schemas.auth import RegisterRequest, LoginRequest, TokenResponse
from app.services.auth_service import create_user, authenticate_user
from app.core.security import create_access_token, decode_access_token
from app.database.mongodb import users_collection
from typing import Optional

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register")
async def register(request: RegisterRequest):
    user = await create_user(
        request.full_name,
        request.email,
        request.password,
    )

    if user is None:
        raise HTTPException(
            status_code=400,
            detail="Email already registered",
        )

    token = create_access_token({"sub": user.id, "email": user.email, "name": user.full_name})
    return {
        "message": "User registered successfully",
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "name": user.full_name,
            "email": user.email,
        }
    }


@router.post("/login", response_model=TokenResponse)
async def login(request: LoginRequest):
    user = await authenticate_user(request.email, request.password)
    if not user:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password",
        )

    token = create_access_token({
        "sub": user.get("id"),
        "email": user.get("email"),
        "name": user.get("full_name") or user.get("name", "Student")
    })

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user.get("id"),
            "name": user.get("full_name") or user.get("name", "Student"),
            "email": user.get("email"),
        }
    }


@router.get("/me")
async def get_current_user(authorization: Optional[str] = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid token")

    token = authorization.split(" ")[1]
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Expired or invalid token")

    user_id = payload.get("sub")
    user = await users_collection.find_one({"id": user_id}, {"password": 0, "_id": 0})
    if not user:
        return {
            "id": user_id,
            "name": payload.get("name", "Student"),
            "email": payload.get("email", ""),
        }

    return user