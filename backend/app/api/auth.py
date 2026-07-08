from fastapi import APIRouter, HTTPException

from app.schemas.auth import RegisterRequest
from app.services.auth_service import create_user

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

    return {
        "message": "User registered successfully"
    }