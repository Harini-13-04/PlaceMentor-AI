from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any


class MentorContext(BaseModel):
    problemTitle: Optional[str] = None
    problemTopic: Optional[str] = None
    language: Optional[str] = None
    code: Optional[str] = None
    executionStatus: Optional[str] = None
    errorMessage: Optional[str] = None
    category: Optional[str] = None


class ChatHistoryItem(BaseModel):
    sender: str  # "user" | "mentor"
    text: str


class MentorAskRequest(BaseModel):
    question: str
    context: Optional[MentorContext] = None
    history: Optional[List[ChatHistoryItem]] = None


class MentorSourceItem(BaseModel):
    id: str
    title: str
    category: str
    relevance_score: float
    snippet: str


class MentorAskResponse(BaseModel):
    answer: str
    sources: List[MentorSourceItem] = []
    suggested_followups: List[str] = []
    model_used: str
    status: str = "success"


class MentorTopicItem(BaseModel):
    id: str
    name: str
    category: str
    icon: str
    description: str
    starter_prompts: List[str]


class MentorTopicsResponse(BaseModel):
    topics: List[MentorTopicItem]
    total_knowledge_chunks: int
