from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List, Dict, Any
from datetime import datetime, timezone
import uuid


class AssessmentQuestion(BaseModel):
    model_config = ConfigDict(extra="ignore")

    id: str
    category: str
    topic: str
    subtopic: Optional[str] = None
    difficulty: str  # "Easy", "Medium", "Hard"
    question: str
    options: List[str]
    correct_answer: int  # index 0-3
    explanation: str
    formula: Optional[str] = None
    marks: int = 1


class QuestionAttemptResult(BaseModel):
    question_id: str
    selected_option: Optional[int] = None
    correct_option: int
    is_correct: bool
    time_spent_seconds: int = 0
    topic: str
    difficulty: str


class AssessmentAttempt(BaseModel):
    model_config = ConfigDict(extra="ignore")

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    attempt_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    assessment_type: str  # "aptitude" or "quiz"
    category: str
    topic: str
    difficulty: str
    score: int
    total: int
    accuracy: float
    time_spent_seconds: int
    question_results: List[QuestionAttemptResult] = Field(default_factory=list)
    weak_topics: List[str] = Field(default_factory=list)
    strong_topics: List[str] = Field(default_factory=list)
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
