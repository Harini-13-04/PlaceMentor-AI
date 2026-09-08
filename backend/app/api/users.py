import os
import shutil
import time
from pathlib import Path
from typing import Optional
from fastapi import APIRouter, HTTPException, Depends, UploadFile, File, Form, status, Request
from app.schemas.auth import (
    UserResponse,
    UserUpdateRequest,
    AvatarUpdateRequest,
)
from app.services.auth_service import (
    update_user_profile,
    update_user_avatar,
    remove_user_avatar,
    update_user_banner,
    remove_user_banner,
)
from app.middlewares.auth_middleware import get_current_user

router = APIRouter(prefix="/users", tags=["Users"])

UPLOAD_DIR = Path(__file__).parent.parent.parent / "uploads" / "avatars"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

BANNER_DIR = Path(__file__).parent.parent.parent / "uploads" / "banners"
BANNER_DIR.mkdir(parents=True, exist_ok=True)


@router.patch("/me", response_model=UserResponse)
async def update_my_profile(
    request: UserUpdateRequest,
    current_user: dict = Depends(get_current_user),
):
    update_data = request.model_dump(exclude_unset=True)
    if not update_data:
        display_name = current_user.get("name") or current_user.get("full_name") or ""
        current_user["name"] = display_name
        current_user["full_name"] = display_name
        return current_user

    updated_user = await update_user_profile(current_user["id"], update_data)
    if not updated_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    display_name = updated_user.get("name") or updated_user.get("full_name") or ""
    updated_user["name"] = display_name
    updated_user["full_name"] = display_name
    return updated_user


@router.post("/me/avatar", response_model=UserResponse)
async def upload_avatar(
    request: Request,
    avatar_file: Optional[UploadFile] = File(None),
    avatar_url: Optional[str] = Form(None),
    current_user: dict = Depends(get_current_user),
):
    user_id = current_user["id"]
    saved_url = ""

    # Check if a file was uploaded
    if avatar_file and avatar_file.filename:
        # Validate content type
        content_type = avatar_file.content_type or ""
        if not (content_type.startswith("image/") or avatar_file.filename.lower().endswith((".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg"))):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="File must be an image",
            )

        # Generate a unique file name
        ext = Path(avatar_file.filename).suffix or ".jpg"
        filename = f"user_{user_id}_{int(time.time())}{ext}"
        dest_path = UPLOAD_DIR / filename

        with open(dest_path, "wb") as buffer:
            shutil.copyfileobj(avatar_file.file, buffer)

        # Build accessible URL path
        saved_url = f"/uploads/avatars/{filename}"
    elif avatar_url:
        saved_url = avatar_url.strip()
    else:
        # Check if JSON body with avatar_url was passed
        try:
            body = await request.json()
            if body and "avatar_url" in body and body["avatar_url"]:
                saved_url = body["avatar_url"].strip()
            elif body and "avatar" in body and body["avatar"]:
                saved_url = body["avatar"].strip()
        except Exception:
            pass

    if not saved_url:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Avatar file or avatar_url is required",
        )

    updated_user = await update_user_avatar(user_id, saved_url)
    if not updated_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    display_name = updated_user.get("name") or updated_user.get("full_name") or ""
    updated_user["name"] = display_name
    updated_user["full_name"] = display_name
    return updated_user


@router.delete("/me/avatar", response_model=UserResponse)
async def delete_avatar(current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]
    updated_user = await remove_user_avatar(user_id)
    if not updated_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    display_name = updated_user.get("name") or updated_user.get("full_name") or ""
    updated_user["name"] = display_name
    updated_user["full_name"] = display_name
    return updated_user


@router.post("/me/banner", response_model=UserResponse)
async def upload_banner(
    request: Request,
    banner_file: Optional[UploadFile] = File(None),
    banner_url: Optional[str] = Form(None),
    current_user: dict = Depends(get_current_user),
):
    user_id = current_user["id"]
    saved_url = ""

    if banner_file and banner_file.filename:
        content_type = banner_file.content_type or ""
        if not (content_type.startswith("image/") or banner_file.filename.lower().endswith((".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg"))):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="File must be an image",
            )

        ext = Path(banner_file.filename).suffix or ".jpg"
        filename = f"banner_{user_id}_{int(time.time())}{ext}"
        dest_path = BANNER_DIR / filename

        with open(dest_path, "wb") as buffer:
            shutil.copyfileobj(banner_file.file, buffer)

        saved_url = f"/uploads/banners/{filename}"
    elif banner_url:
        saved_url = banner_url.strip()
    else:
        try:
            body = await request.json()
            if body and "banner_url" in body and body["banner_url"]:
                saved_url = body["banner_url"].strip()
            elif body and "banner_image" in body and body["banner_image"]:
                saved_url = body["banner_image"].strip()
        except Exception:
            pass

    if not saved_url:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Banner file or banner_url is required",
        )

    updated_user = await update_user_banner(user_id, saved_url)
    if not updated_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    display_name = updated_user.get("name") or updated_user.get("full_name") or ""
    updated_user["name"] = display_name
    updated_user["full_name"] = display_name
    return updated_user


@router.delete("/me/banner", response_model=UserResponse)
async def delete_banner(current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]
    updated_user = await remove_user_banner(user_id)
    if not updated_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    display_name = updated_user.get("name") or updated_user.get("full_name") or ""
    updated_user["name"] = display_name
    updated_user["full_name"] = display_name
    return updated_user
