from pydantic import BaseModel, EmailStr, Field, ConfigDict
from typing import Optional, List
from datetime import datetime, timezone
import uuid


class User(BaseModel):
    model_config = ConfigDict(extra="ignore")

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str = ""
    full_name: str = ""
    email: EmailStr
    password: str

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

    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    is_verified: bool = False
    is_active: bool = True
    profile_id: Optional[str] = None