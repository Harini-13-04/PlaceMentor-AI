from typing import List, Optional
from pydantic import BaseModel, ConfigDict, Field
import uuid


class Profile(BaseModel):
    model_config = ConfigDict(extra="ignore")

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    name: str
    bio: str = ""
    phone: str = ""
    email: str = ""
    college: str = ""
    dreamRole: str = ""
    skills: List[str] = Field(default_factory=list)
    github: str = ""
    linkedin: str = ""
    resumeScore: int = 0
    level: int = 1
    xp: int = 0
    xpToNext: int = 1000
    avatarUrl: str = ""
    bannerColor: str = "#1e1b4b"


class ProfileUpdate(BaseModel):
    name: Optional[str] = None
    bio: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    college: Optional[str] = None
    dreamRole: Optional[str] = None
    skills: Optional[List[str]] = None
    github: Optional[str] = None
    linkedin: Optional[str] = None
    resumeScore: Optional[int] = None
    level: Optional[int] = None
    xp: Optional[int] = None
    xpToNext: Optional[int] = None
    avatarUrl: Optional[str] = None
    bannerColor: Optional[str] = None