from pydantic import BaseModel, Field, ConfigDict, field_validator
from typing import Optional, List, Union
from datetime import datetime, timezone
import uuid


class LearnerProfile(BaseModel):
    model_config = ConfigDict(extra="ignore")

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    academic_year: str = "3rd Year"  # "1st Year", "2nd Year", "3rd Year", "Final Year", "Graduate"
    career_goal: str = "Software Developer"
    target_company_type: str = "Product"  # "Product", "Service", "Startup", "Any", "Not sure"
    programming_level: str = "Beginner"  # "Never coded", "Beginner", "Basic", "Intermediate", "Advanced", "Not sure"
    dsa_level: str = "Beginner"  # "Never learned", "Beginner", "Basic", "Intermediate", "Advanced", "Not sure"
    aptitude_level: str = "Beginner"  # "Not started", "Beginner", "Basic", "Intermediate", "Advanced", "Not sure"
    core_cs_level: str = "Not started"  # "Not started", "Beginner", "Basic", "Intermediate", "Advanced", "Not sure"
    preferred_languages: List[str] = Field(default_factory=lambda: ["Python", "Java"])
    projects_count: str = "None"  # "None", "Learning", "1", "2+"
    has_resume: Union[str, bool] = "I don't have one yet"  # "I have a resume", "I don't have one yet", True, False
    previous_prep: str = "None"  # "None", "Some", "Regular"
    available_hours_per_week: Union[int, str] = 10
    gender: Optional[str] = "prefer_not_to_say"  # "female", "male", "other", "prefer_not_to_say"
    onboarding_completed: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class OnboardingRequest(BaseModel):
    academic_year: str = "3rd Year"
    career_goal: str = "Software Developer"
    target_company_type: str = "Product"
    programming_level: str = "Beginner"
    dsa_level: str = "Beginner"
    aptitude_level: str = "Beginner"
    core_cs_level: str = "Not started"
    preferred_languages: List[str] = Field(default_factory=list)
    projects_count: str = "None"
    has_resume: Union[str, bool] = "I don't have one yet"
    previous_prep: str = "None"
    available_hours_per_week: Union[int, str] = 10
    gender: Optional[str] = None

