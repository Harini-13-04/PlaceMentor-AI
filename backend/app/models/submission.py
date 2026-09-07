from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List, Dict, Any
from datetime import datetime, timezone
import uuid


class CodingSubmission(BaseModel):
    model_config = ConfigDict(extra="ignore")

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    submission_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    problem_id: str
    language: str
    code: str
    status: str  # "Accepted", "Wrong Answer", "Runtime Error", "Compilation Error", "Time Limit Exceeded"
    runtime: int = 0
    memory: float = 0.0
    passed_count: int = 0
    total_count: int = 0
    visible_passed: int = 0
    visible_total: int = 0
    hidden_passed: int = 0
    hidden_total: int = 0
    test_case_results: List[Dict[str, Any]] = Field(default_factory=list)
    error_message: Optional[str] = None
    console_output: Optional[str] = None
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class UserProblemProgress(BaseModel):
    model_config = ConfigDict(extra="ignore")

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    problem_id: str
    status: str = "Not Started"  # "Not Started", "Attempted", "Solved"
    attempts_count: int = 0
    solved_at: Optional[datetime] = None
    best_runtime: Optional[int] = None
    bookmarked: bool = False
    last_language: Optional[str] = None
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
