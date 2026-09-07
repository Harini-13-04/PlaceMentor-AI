from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List, Dict, Any
from datetime import datetime, timezone
import uuid


class BrainZoneGameResult(BaseModel):
    game_id: str  # "sudoku", "memory-match", "pattern-recognition", "target-24", "vocab-anagram"
    world_id: str  # "mind-forest", "logic-desert", "neural-city", "focus-volcano", "brain-castle"
    level: int
    seed: int
    difficulty: str
    score: int
    accuracy: float
    time_spent_seconds: int
    moves_or_mistakes: int = 0
    passed: bool = True


class BrainZoneProgress(BaseModel):
    model_config = ConfigDict(extra="ignore")

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    xp: int = 0
    player_level: int = 1
    streak_days: int = 0
    last_played_at: Optional[datetime] = None
    unlocked_worlds: List[str] = Field(default_factory=lambda: ["mind-forest"])
    completed_levels_count: int = 0
    achievements: List[str] = Field(default_factory=list)
    game_stats: Dict[str, Dict[str, Any]] = Field(default_factory=dict)
    recent_history: List[Dict[str, Any]] = Field(default_factory=list)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
