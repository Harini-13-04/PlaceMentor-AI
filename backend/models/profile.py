from typing import List

from pydantic import BaseModel, ConfigDict, Field


class Profile(BaseModel):
    model_config = ConfigDict(extra="ignore")

    id: str = "default-profile"
    user_id: str = "default-user"

    name: str = "Harini Muthuvel"
    bio: str = "Final-year CS student passionate about building products that matter. Love solving complex problems, one commit at a time."
    phone: str = "+91 98765 43210"
    email: str = "harini.muthuvel@srmist.edu.in"
    college: str = "SRM Institute of Science and Technology, Chennai"
    dreamRole: str = "Software Development Engineer @ a product-first company"
    skills: List[str] = Field(default_factory=lambda: [
        "React",
        "Node.js",
        "Python",
        "ML",
        "SQL",
        "TypeScript",
        "DSA",
        "System Design",
    ])
    github: str = "github.com/harini-m"
    linkedin: str = "linkedin.com/in/harini-m"
    resumeScore: int = 78
    level: int = 12
    xp: int = 4500
    xpToNext: int = 5000
    avatarUrl: str = ""
    bannerColor: str = "#1e1b4b"


class ProfileUpdate(BaseModel):
    name: str
    bio: str
    phone: str
    email: str
    college: str
    dreamRole: str
    skills: List[str]
    github: str
    linkedin: str
    resumeScore: int
    level: int
    xp: int
    xpToNext: int
    avatarUrl: str = ""
    bannerColor: str = "#1e1b4b"