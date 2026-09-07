from pydantic import BaseModel, EmailStr, ConfigDict, Field
from typing import Optional, List


class RegisterRequest(BaseModel):
    name: Optional[str] = None
    full_name: Optional[str] = None
    email: EmailStr
    password: str
    college: Optional[str] = ""
    department: Optional[str] = ""
    year: Optional[str] = ""
    skills: Optional[List[str]] = Field(default_factory=list)
    gender: Optional[str] = ""


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    model_config = ConfigDict(extra="ignore")

    id: str
    name: str = ""
    full_name: str = ""
    email: EmailStr
    college: str = ""
    department: str = ""
    year: str = ""
    skills: List[str] = Field(default_factory=list)
    avatar: str = ""
    bio: str = ""
    phone: str = ""
    github: str = ""
    linkedin: str = ""
    gender: str = ""


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


class UserUpdateRequest(BaseModel):
    name: Optional[str] = None
    full_name: Optional[str] = None
    college: Optional[str] = None
    department: Optional[str] = None
    year: Optional[str] = None
    skills: Optional[List[str]] = None
    avatar: Optional[str] = None
    bio: Optional[str] = None
    phone: Optional[str] = None
    github: Optional[str] = None
    linkedin: Optional[str] = None
    gender: Optional[str] = None


class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str


class AvatarUpdateRequest(BaseModel):
    avatar_url: Optional[str] = None