from fastapi import APIRouter, HTTPException, Depends, Header, status

from app.schemas.auth import (
    RegisterRequest,
    LoginRequest,
    GoogleAuthRequest,
    GitHubAuthRequest,
    TokenResponse,
    UserResponse,
    ChangePasswordRequest,
)

from app.services.auth_service import (
    create_user,
    authenticate_user,
    authenticate_or_create_google_user,
    authenticate_or_create_github_user,
    change_user_password,
)
from app.core.security import create_access_token, decode_access_token
from app.database.mongodb import users_collection
from app.middlewares.auth_middleware import get_current_user
from typing import Optional, Dict, Any

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def register(request: RegisterRequest):
    display_name = request.name or request.full_name or ""

    user = await create_user(
        name=display_name,
        full_name=display_name,
        email=request.email,
        password=request.password,
        college=request.college or "",
        department=request.department or "",
        year=request.year or "",
        skills=request.skills or [],
        gender=request.gender or "",
    )

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )

    token = create_access_token({"sub": user.id, "email": user.email, "name": user.full_name})
    
    user_dict = {
        "id": user.id,
        "name": user.name or user.full_name,
        "full_name": user.full_name or user.name,
        "email": user.email,
        "college": user.college,
        "department": user.department,
        "year": user.year,
        "skills": user.skills or [],
        "avatar": user.avatar or "",
        "bio": user.bio or "",
        "phone": user.phone or "",
        "github": user.github or "",
        "linkedin": user.linkedin or "",
        "gender": user.gender or "",
    }

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": user_dict,
    }


@router.post("/login", response_model=TokenResponse)
async def login(request: LoginRequest):
    user = await authenticate_user(request.email, request.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    display_name = user.get("name") or user.get("full_name") or "Student"
    token = create_access_token({
        "sub": user.get("id"),
        "email": user.get("email"),
        "name": display_name,
    })

    user_dict = {
        "id": user.get("id", ""),
        "name": display_name,
        "full_name": user.get("full_name") or display_name,
        "email": user.get("email", ""),
        "college": user.get("college", ""),
        "department": user.get("department", ""),
        "year": user.get("year", ""),
        "skills": user.get("skills", []) or [],
        "avatar": user.get("avatar", ""),
        "bio": user.get("bio", ""),
        "phone": user.get("phone", ""),
        "github": user.get("github", ""),
        "linkedin": user.get("linkedin", ""),
        "gender": user.get("gender", ""),
    }

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": user_dict,
    }


@router.post("/google", response_model=TokenResponse)
async def google_auth(request: GoogleAuthRequest):
    user = await authenticate_or_create_google_user(request.credential)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid Google credential or failed to authenticate with Google",
        )

    display_name = user.get("name") or user.get("full_name") or "Student"
    token = create_access_token({
        "sub": user.get("id"),
        "email": user.get("email"),
        "name": display_name,
    })

    user_dict = {
        "id": user.get("id", ""),
        "name": display_name,
        "full_name": user.get("full_name") or display_name,
        "email": user.get("email", ""),
        "college": user.get("college", ""),
        "department": user.get("department", ""),
        "year": user.get("year", ""),
        "skills": user.get("skills", []) or [],
        "avatar": user.get("avatar", ""),
        "bio": user.get("bio", ""),
        "phone": user.get("phone", ""),
        "github": user.get("github", ""),
        "linkedin": user.get("linkedin", ""),
        "gender": user.get("gender", ""),
    }

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": user_dict,
    }


@router.post("/github", response_model=TokenResponse)
async def github_auth(request: GitHubAuthRequest):
    user = await authenticate_or_create_github_user(request.code)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid GitHub authorization code or GitHub authentication failed",
        )

    display_name = user.get("name") or user.get("full_name") or "Developer"
    token = create_access_token({
        "sub": user.get("id"),
        "email": user.get("email"),
        "name": display_name,
    })

    user_dict = {
        "id": user.get("id", ""),
        "name": display_name,
        "full_name": user.get("full_name") or display_name,
        "email": user.get("email", ""),
        "college": user.get("college", ""),
        "department": user.get("department", ""),
        "year": user.get("year", ""),
        "skills": user.get("skills", []) or [],
        "avatar": user.get("avatar", ""),
        "bio": user.get("bio", ""),
        "phone": user.get("phone", ""),
        "github": user.get("github", ""),
        "linkedin": user.get("linkedin", ""),
        "gender": user.get("gender", ""),
    }

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": user_dict,
    }


@router.get("/me", response_model=UserResponse)
async def get_me(current_user: dict = Depends(get_current_user)):
    display_name = current_user.get("name") or current_user.get("full_name") or "Student"
    return {
        "id": current_user.get("id", ""),
        "name": display_name,
        "full_name": current_user.get("full_name") or display_name,
        "email": current_user.get("email", ""),
        "college": current_user.get("college", ""),
        "department": current_user.get("department", ""),
        "year": current_user.get("year", ""),
        "skills": current_user.get("skills", []) or [],
        "avatar": current_user.get("avatar", ""),
        "bio": current_user.get("bio", ""),
        "phone": current_user.get("phone", ""),
        "github": current_user.get("github", ""),
        "linkedin": current_user.get("linkedin", ""),
        "gender": current_user.get("gender", ""),
    }


@router.post("/change-password")
async def change_password(
    request: ChangePasswordRequest,
    current_user: dict = Depends(get_current_user),
):
    success = await change_user_password(
        current_user["id"],
        request.current_password,
        request.new_password,
    )
    if not success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password is incorrect",
        )
    return {"message": "Password updated successfully"}


@router.post("/logout")
async def logout():
    return {"message": "Logged out successfully"}