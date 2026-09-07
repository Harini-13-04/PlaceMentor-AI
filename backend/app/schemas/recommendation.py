from pydantic import BaseModel
from typing import List, Optional


class RecommendationItem(BaseModel):
    id: str
    module: str  # "practice" | "aptitude" | "communication" | "resume" | "readiness" | "brain-zone" | "quizee"
    title: str
    subtitle: str
    route: str
    badge: str
    badgeColor: str
    estimatedTime: str
    impactScore: str
    whyThisReason: str
    iconName: str
    priority: int = 1


class RecommendationResponse(BaseModel):
    recommendations: List[RecommendationItem]
    readiness_score: int
    streak_days: int
    accuracy_percent: int
    has_activity: bool = False
