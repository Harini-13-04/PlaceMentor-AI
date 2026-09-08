from pydantic import BaseModel, EmailStr, ConfigDict, Field
from typing import Optional, List


class RegisterRequest(BaseModel):
    model_config = ConfigDict(extra="ignore")

    name: Optional[str] = None
    full_name: Optional[str] = None
    fullName: Optional[str] = None
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


class GoogleAuthRequest(BaseModel):
    credential: str


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
    preferred_languages: List[str] = Field(default_factory=list)
    avatar: str = ""
    banner_image: str = ""
    bio: str = ""
    phone: str = ""
    location: str = ""
    website: str = ""
    github: str = ""
    linkedin: str = ""
    gender: str = ""
    dob: str = ""
    target_role: str = ""
    target_company: str = ""
    programming_level: str = ""
    dsa_level: str = ""
    aptitude_level: str = ""
    core_cs_level: str = ""


class TokenResponse(BaseModel):
    access_token: str
    token: Optional[str] = None
    token_type: str = "bearer"
    user: UserResponse


class UserUpdateRequest(BaseModel):
    name: Optional[str] = None
    full_name: Optional[str] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    college: Optional[str] = None
    department: Optional[str] = None
    year: Optional[str] = None
    academic_year: Optional[str] = None
    skills: Optional[List[str]] = None
    preferred_languages: Optional[List[str]] = None
    languages: Optional[List[str]] = None
    avatar: Optional[str] = None
    banner_image: Optional[str] = None
    bio: Optional[str] = None
    phone: Optional[str] = None
    location: Optional[str] = None
    website: Optional[str] = None
    portfolio: Optional[str] = None
    github: Optional[str] = None
    linkedin: Optional[str] = None
    gender: Optional[str] = None
    dob: Optional[str] = None
    date_of_birth: Optional[str] = None
    target_role: Optional[str] = None
    career_goal: Optional[str] = None
    dream_role: Optional[str] = None
    target_company: Optional[str] = None
    company_type: Optional[str] = None
    programming_level: Optional[str] = None
    dsa_level: Optional[str] = None
    aptitude_level: Optional[str] = None
    core_cs_level: Optional[str] = None


class ChangePasswordRequest(BaseModel):
    model_config = ConfigDict(extra="ignore")
    current_password: Optional[str] = None
    old_password: Optional[str] = None
    new_password: str


class AvatarUpdateRequest(BaseModel):
    avatar_url: Optional[str] = None


class BannerUpdateRequest(BaseModel):
    banner_url: Optional[str] = None