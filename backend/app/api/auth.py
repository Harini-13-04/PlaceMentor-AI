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
    display_name = request.fullName or request.name or request.full_name or ""

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
        "preferred_languages": user.preferred_languages or [],
        "avatar": user.avatar or "",
        "banner_image": user.banner_image or "",
        "bio": user.bio or "",
        "phone": user.phone or "",
        "location": user.location or "",
        "website": user.website or "",
        "github": user.github or "",
        "linkedin": user.linkedin or "",
        "gender": user.gender or "",
        "dob": user.dob or "",
        "target_role": user.target_role or "",
        "target_company": user.target_company or "",
        "programming_level": user.programming_level or "",
        "dsa_level": user.dsa_level or "",
        "aptitude_level": user.aptitude_level or "",
        "core_cs_level": user.core_cs_level or "",
    }

    return {
        "access_token": token,
        "token": token,
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
        "preferred_languages": user.get("preferred_languages", []) or [],
        "avatar": user.get("avatar", ""),
        "banner_image": user.get("banner_image", ""),
        "bio": user.get("bio", ""),
        "phone": user.get("phone", ""),
        "location": user.get("location", ""),
        "website": user.get("website", ""),
        "github": user.get("github", ""),
        "linkedin": user.get("linkedin", ""),
        "gender": user.get("gender", ""),
        "dob": user.get("dob", ""),
        "target_role": user.get("target_role", ""),
        "target_company": user.get("target_company", ""),
        "programming_level": user.get("programming_level", ""),
        "dsa_level": user.get("dsa_level", ""),
        "aptitude_level": user.get("aptitude_level", ""),
        "core_cs_level": user.get("core_cs_level", ""),
    }

    return {
        "access_token": token,
        "token": token,
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
        "preferred_languages": current_user.get("preferred_languages", []) or [],
        "avatar": current_user.get("avatar", ""),
        "banner_image": current_user.get("banner_image", ""),
        "bio": current_user.get("bio", ""),
        "phone": current_user.get("phone", ""),
        "location": current_user.get("location", ""),
        "website": current_user.get("website", ""),
        "github": current_user.get("github", ""),
        "linkedin": current_user.get("linkedin", ""),
        "gender": current_user.get("gender", ""),
        "dob": current_user.get("dob", ""),
        "target_role": current_user.get("target_role", ""),
        "target_company": current_user.get("target_company", ""),
        "programming_level": current_user.get("programming_level", ""),
        "dsa_level": current_user.get("dsa_level", ""),
        "aptitude_level": current_user.get("aptitude_level", ""),
        "core_cs_level": current_user.get("core_cs_level", ""),
    }


@router.post("/change-password")
async def change_password(
    request: ChangePasswordRequest,
    current_user: dict = Depends(get_current_user),
):
    current_pw = request.current_password or request.old_password or ""
    if not current_pw:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password is required",
        )
    if not request.new_password or len(request.new_password) < 6:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="New password must be at least 6 characters",
        )
    success = await change_user_password(
        current_user["id"],
        current_pw,
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