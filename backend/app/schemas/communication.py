from pydantic import BaseModel, Field
from typing import List, Optional


class STARFeedback(BaseModel):
    situation: Optional[str] = Field(None, description="Context & situation framing")
    task: Optional[str] = Field(None, description="Task or challenge objective")
    action: Optional[str] = Field(None, description="Specific actions and technical choices taken")
    result: Optional[str] = Field(None, description="Quantitative impact and outcome achieved")


class SpeechAnalysisResponse(BaseModel):
    id: Optional[str] = Field(None, description="Persisted session identifier")
    transcript: str = Field("", description="Verbatim transcript of spoken audio response")
    fluency: int = Field(80, ge=0, le=100, description="Fluency score (0-100)")
    pace: int = Field(130, description="Pacing in Words Per Minute (WPM)")
    clarity: int = Field(80, ge=0, le=100, description="Clarity score (0-100)")
    filler_words: List[str] = Field(default_factory=list, description="Detected hesitation filler words")
    overall_score: int = Field(80, ge=0, le=100, description="Overall communication score (0-100)")
    strengths: List[str] = Field(default_factory=list, description="Factual communication strengths")
    suggestions: List[str] = Field(default_factory=list, description="Actionable recommendations")
    star_feedback: Optional[STARFeedback] = Field(None, description="STAR behavioral breakdown if applicable")
    created_at: Optional[str] = Field(None, description="Timestamp of completed session")


class CommunicationSessionItem(BaseModel):
    id: str
    user_id: str
    type: str = "speaking_practice"
    prompt_title: str = ""
    prompt_category: str = ""
    transcript: str = ""
    duration_seconds: int = 0
    fluency: int = 80
    pace: int = 130
    clarity: int = 80
    filler_words: List[str] = Field(default_factory=list)
    overall_score: int = 80
    strengths: List[str] = Field(default_factory=list)
    suggestions: List[str] = Field(default_factory=list)
    star_feedback: Optional[STARFeedback] = None
    created_at: str


class CommunicationHistoryResponse(BaseModel):
    sessions: List[CommunicationSessionItem] = Field(default_factory=list)
    total: int = 0
    limit: int = 20
    skip: int = 0


from typing import List, Optional, Literal

class OutreachGenerateRequest(BaseModel):
    message_type: Literal["recruiter_email", "linkedin_message", "interview_followup", "networking_message"] = Field(
        ..., description="Message type: recruiter_email, linkedin_message, interview_followup, networking_message"
    )
    recipient_name: Optional[str] = Field("", max_length=200, description="Recipient name or title")
    company_name: Optional[str] = Field("", max_length=300, description="Target company or organization name")
    role: Optional[str] = Field("", max_length=300, description="Job title or role title")
    job_context: Optional[str] = Field("", max_length=10000, description="Job requirements or role details")
    user_context: Optional[str] = Field("", max_length=10000, description="Candidate skills, experience, or relevant project details")
    tone: Optional[str] = Field("professional", max_length=50, description="Message tone: professional, enthusiastic, concise")


class OutreachGenerateResponse(BaseModel):
    message_type: str
    subject: Optional[str] = Field(None, description="Email subject line if applicable")
    body: str = Field(..., description="Generated professional outreach message body")
    notes: List[str] = Field(default_factory=list, description="Usage recommendations or safety notes")


class GDParticipant(BaseModel):
    user_id: str
    display_name: str
    is_host: bool = False
    is_connected: bool = True
    joined_at: str
    is_speaking: bool = False
    team: Optional[str] = None
    total_speaking_seconds: float = 0.0
    turn_count: int = 0
    last_turn_at: Optional[str] = None


class GDRoomCreateRequest(BaseModel):
    topic: str = Field(..., max_length=500, description="Discussion topic or title")
    max_participants: Optional[int] = Field(6, ge=2, le=10, description="Maximum number of allowed participants")
    duration_minutes: Optional[int] = Field(5, ge=1, le=60, description="Discussion duration in minutes")


class GDRoomJoinRequest(BaseModel):
    room_id: str = Field(..., description="Target room code/ID")


class GDActivityLog(BaseModel):
    id: str
    type: str = "room_event"
    message: str
    user_id: Optional[str] = None
    display_name: Optional[str] = None
    timestamp: str


class GDRoomResponse(BaseModel):
    room_id: str
    room_code: Optional[str] = None
    topic: str
    status: Literal["waiting", "active", "evaluating", "ended"] = "waiting"
    host_user_id: str
    max_participants: int = 6
    min_participants: int = 2
    created_at: str
    updated_at: Optional[str] = None
    started_at: Optional[str] = None
    ended_at: Optional[str] = None
    duration_seconds: int = 300
    discussion_ends_at: Optional[str] = None
    participants: List[GDParticipant] = Field(default_factory=list)
    teams: dict[str, List[str]] = Field(default_factory=dict)
    current_speaker_id: Optional[str] = None
    current_speaker_name: Optional[str] = None
    next_speaker_id: Optional[str] = None
    is_host: bool = False
    activity_logs: List[GDActivityLog] = Field(default_factory=list)
    evaluation_summary: Optional[dict] = None
    winning_team: Optional[str] = None


class GDDimensionDetail(BaseModel):
    score: Optional[int] = Field(None, description="Score 0-100 if evidence available, otherwise null")
    reason: str = Field(..., description="Defensible rationale or limitation message")


class GDParticipantEvalItem(BaseModel):
    user_id: str
    display_name: str
    team: str
    overall_score: Optional[int] = None
    speaking_seconds: float = 0.0
    turn_count: int = 0
    fluency: Optional[int] = None
    clarity: Optional[int] = None
    pace: Optional[int] = None
    topic_relevance: Optional[int] = None
    reasoning: Optional[int] = None
    communication: Optional[int] = None
    transcript: str = ""
    strengths: List[str] = Field(default_factory=list)
    improvements: List[str] = Field(default_factory=list)


class GDTeamEvalItem(BaseModel):
    team_name: str
    members: List[str] = Field(default_factory=list)
    team_score: int = 0
    avg_communication_score: int = 0
    argument_quality: int = 0
    collaboration_score: int = 0
    total_speaking_seconds: float = 0.0
    total_turns: int = 0
    strengths: List[str] = Field(default_factory=list)
    weaknesses: List[str] = Field(default_factory=list)


class GDEvaluationResponse(BaseModel):
    id: str
    room_id: str
    user_id: str
    topic: str
    overall_score: Optional[int] = Field(None, description="Overall performance score (0-100)")
    dimensions: dict[str, GDDimensionDetail] = Field(default_factory=dict)
    strengths: List[str] = Field(default_factory=list)
    suggestions: List[str] = Field(default_factory=list)
    data_limitations: List[str] = Field(default_factory=list)
    winning_team: Optional[str] = None
    winning_rationale: Optional[str] = None
    team_evaluations: dict[str, GDTeamEvalItem] = Field(default_factory=dict)
    participant_evaluations: List[GDParticipantEvalItem] = Field(default_factory=list)
    created_at: str



