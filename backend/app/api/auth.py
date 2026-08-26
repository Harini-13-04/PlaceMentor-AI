from fastapi import APIRouter, HTTPException, Depends, status
from app.schemas.auth import (
    RegisterRequest,
    LoginRequest,
    TokenResponse,
    UserResponse,
    ChangePasswordRequest,
)
from app.services.auth_service import (
    create_user,
    authenticate_user,
    change_user_password,
)
from app.core.jwt_handler import create_access_token
from app.middlewares.auth_middleware import get_current_user

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def register(request: RegisterRequest):
    name = request.name or request.full_name or ""
    if not name.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Name is required",
        )

    if not request.password or len(request.password) < 6:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must be at least 6 characters",
        )

    user = await create_user(
        name=name,
        email=request.email,
        password=request.password,
        college=request.college or "",
        department=request.department or "",
        year=request.year or "",
        skills=request.skills or [],
    )

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )

    user_dict = user.model_dump()
    user_dict.pop("password", None)
    # Normalize name and full_name
    display_name = user_dict.get("name") or user_dict.get("full_name") or ""
    user_dict["name"] = display_name
    user_dict["full_name"] = display_name

    access_token = create_access_token(data={"sub": user.id, "email": user.email})

    return {
        "access_token": access_token,
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
            headers={"WWW-Authenticate": "Bearer"},
        )

    user.pop("password", None)
    display_name = user.get("name") or user.get("full_name") or ""
    user["name"] = display_name
    user["full_name"] = display_name

    access_token = create_access_token(data={"sub": user["id"], "email": user["email"]})

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user,
    }



@router.post("/logout")
async def logout():
    return {"message": "Logged out successfully"}


@router.get("/me", response_model=UserResponse)
async def get_me(current_user: dict = Depends(get_current_user)):
    display_name = current_user.get("name") or current_user.get("full_name") or ""
    current_user["name"] = display_name
    current_user["full_name"] = display_name
    return current_user


@router.post("/change-password")
async def change_password(
    request: ChangePasswordRequest,
    current_user: dict = Depends(get_current_user),
):
    if not request.new_password or len(request.new_password) < 6:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="New password must be at least 6 characters long",
        )

    success = await change_user_password(
        user_id=current_user["id"],
        current_password=request.current_password,
        new_password=request.new_password,
    )

    if not success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect current password",
        )

    return {"message": "Password updated successfully"}