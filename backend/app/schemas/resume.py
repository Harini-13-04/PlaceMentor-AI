from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional, Dict, Any
from datetime import datetime, timezone
import uuid


# ============================================================================
# SUB-SECTION MODELS
# ============================================================================

class PersonalInfo(BaseModel):
    full_name: str = ""
    email: str = ""
    phone: str = ""
    location: str = ""
    linkedin: str = ""
    github: str = ""
    portfolio: str = ""


class EducationItem(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    institution: str = ""
    degree: str = ""
    field_of_study: str = ""
    start_date: str = ""
    end_date: str = ""
    current: bool = False
    gpa: str = ""
    description: str = ""


class ExperienceItem(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    company: str = ""
    role: str = ""
    location: str = ""
    start_date: str = ""
    end_date: str = ""
    current: bool = False
    description: str = ""
    bullets: List[str] = Field(default_factory=list)


class SkillCategory(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    category: str = "Technical Skills"  # Technical Skills, Soft Skills, Tools & Frameworks, etc.
    skills: List[str] = Field(default_factory=list)


class ProjectItem(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str = ""
    description: str = ""
    technologies: List[str] = Field(default_factory=list)
    github_url: str = ""
    live_url: str = ""
    bullets: List[str] = Field(default_factory=list)


class CertificationItem(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str = ""
    issuer: str = ""
    date: str = ""
    url: str = ""
    credential_id: str = ""


class AchievementItem(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str = ""
    organization: str = ""
    result: str = ""
    date: str = ""
    description: str = ""


class LanguageItem(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str = ""
    proficiency: str = "Fluent"  # Native, Fluent, Professional, Intermediate, Elementary


class LinkItem(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    label: str = ""
    url: str = ""


class CustomSectionItem(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str = "Additional Information"
    content: str = ""
    bullets: List[str] = Field(default_factory=list)


# ============================================================================
# MAIN RESUME MODEL
# ============================================================================

class ResumeData(BaseModel):
    model_config = ConfigDict(extra="ignore")

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    name: str = "Untitled Resume"
    target_role: str = "Full Stack Developer"
    experience_level: str = "Fresher"  # Fresher, Entry Level, Mid Level, Senior
    template: str = "modern"  # modern, professional, minimal, fresher, technical
    personal_info: PersonalInfo = Field(default_factory=PersonalInfo)
    summary: str = ""
    education: List[EducationItem] = Field(default_factory=list)
    experience: List[ExperienceItem] = Field(default_factory=list)
    skills: List[SkillCategory] = Field(default_factory=list)
    projects: List[ProjectItem] = Field(default_factory=list)
    certifications: List[CertificationItem] = Field(default_factory=list)
    achievements: List[AchievementItem] = Field(default_factory=list)
    languages: List[LanguageItem] = Field(default_factory=list)
    links: List[LinkItem] = Field(default_factory=list)
    custom_sections: List[CustomSectionItem] = Field(default_factory=list)
    completion_percentage: int = 0
    version: int = 1
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    updated_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


# ============================================================================
# REQUEST & RESPONSE MODELS
# ============================================================================

class ResumeCreateRequest(BaseModel):
    name: str
    target_role: str
    experience_level: str = "Fresher"
    template: str = "modern"


class ResumeUpdateRequest(BaseModel):
    name: Optional[str] = None
    target_role: Optional[str] = None
    experience_level: Optional[str] = None
    template: Optional[str] = None
    personal_info: Optional[PersonalInfo] = None
    summary: Optional[str] = None
    education: Optional[List[EducationItem]] = None
    experience: Optional[List[ExperienceItem]] = None
    skills: Optional[List[SkillCategory]] = None
    projects: Optional[List[ProjectItem]] = None
    certifications: Optional[List[CertificationItem]] = None
    achievements: Optional[List[AchievementItem]] = None
    languages: Optional[List[LanguageItem]] = None
    links: Optional[List[LinkItem]] = None
    custom_sections: Optional[List[CustomSectionItem]] = None


class ResumeSummary(BaseModel):
    id: str
    user_id: str
    name: str
    target_role: str
    experience_level: str
    template: str
    completion_percentage: int
    version: int
    updated_at: str
    created_at: str


class ResumeDashboardResponse(BaseModel):
    total_resumes: int
    average_completion: int
    average_ats_score: Optional[int] = None  # None/Unavailable in Phase 1
    average_defensibility: Optional[int] = None  # None/Unavailable in Phase 1
    resumes: List[ResumeSummary]


# ============================================================================
# AI IMPROVE MODELS (PHASE 2A)
# ============================================================================

class ResumeImproveRequest(BaseModel):
    section: str = Field(..., description="Target section: summary, experience_bullet, project_description, achievement, skills, general")
    original_text: str = Field(..., description="Original text to be improved")
    improvement_goal: Optional[str] = Field("action_verbs", description="Improvement focus: action_verbs, conciseness, clarity, executive_impact")


class ResumeImproveResponse(BaseModel):
    original_text: str
    improved_text: str
    explanation: str
    detected_changes: List[str] = Field(default_factory=list)
    warnings: List[str] = Field(default_factory=list)


# ============================================================================
# ATS ANALYSIS MODELS (PHASE 2B)
# ============================================================================

class ATSCategoryScores(BaseModel):
    keyword_optimization: int = Field(..., ge=0, le=20)
    section_completeness: int = Field(..., ge=0, le=20)
    skills_alignment: int = Field(..., ge=0, le=20)
    experience_quality: int = Field(..., ge=0, le=20)
    formatting: int = Field(..., ge=0, le=20)


class ATSIssueItem(BaseModel):
    id: str
    title: str
    description: str
    severity: str = "medium"  # high, medium, low
    section: str = "general"


class ATSRecommendationItem(BaseModel):
    id: str
    title: str
    description: str
    severity: str = "medium"  # high, medium, low
    section: str = "summary"  # summary, experience, projects, skills, education, personal_info
    action: str = "Refine content in Resume Builder"


class ATSAnalysisResponse(BaseModel):
    resume_id: str
    overall_score: int = Field(..., ge=0, le=100)
    categories: ATSCategoryScores
    strengths: List[str] = Field(default_factory=list)
    issues: List[ATSIssueItem] = Field(default_factory=list)
    recommendations: List[ATSRecommendationItem] = Field(default_factory=list)

# ============================================================================
# JOB MATCH MODELS (PHASE 2C)
# ============================================================================

class JobMatchRequest(BaseModel):
    job_description: str = Field(..., description="Job description text to evaluate against resume")


class JobMatchCategories(BaseModel):
    skills_match: int = Field(..., ge=0, le=35)
    keyword_match: int = Field(..., ge=0, le=25)
    experience_alignment: int = Field(..., ge=0, le=20)
    project_domain_alignment: int = Field(..., ge=0, le=10)
    education_certification_alignment: int = Field(..., ge=0, le=10)


class JobMatchRecommendation(BaseModel):
    id: str
    title: str
    description: str
    severity: str = "medium"  # high, medium, low
    section: str = "general"  # summary, skills, experience, projects, education, personal_info, general
    action: str = "Fix in Resume"


class JobMatchResponse(BaseModel):
    resume_id: str
    overall_match_score: int = Field(..., ge=0, le=100)
    categories: JobMatchCategories
    matched_skills: List[str] = Field(default_factory=list)
    missing_skills: List[str] = Field(default_factory=list)
    matched_keywords: List[str] = Field(default_factory=list)
    missing_keywords: List[str] = Field(default_factory=list)
    strengths: List[str] = Field(default_factory=list)
    gaps: List[str] = Field(default_factory=list)
    recommendations: List[JobMatchRecommendation] = Field(default_factory=list)
    analyzed_at: str = ""


# ============================================================================
# DEFEND YOUR RESUME MODELS (PHASE 3)
# ============================================================================

class DefendClaimItem(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    section: str = "experience"  # summary, experience, projects, skills, achievements
    claim_text: str
    risk_level: str = "medium"  # high, medium, low
    risk_reason: str = ""


class DefendInitResponse(BaseModel):
    session_id: str
    resume_id: str
    total_claims: int
    claims: List[DefendClaimItem] = Field(default_factory=list)
    first_claim_id: Optional[str] = None
    first_question: Optional[str] = None


class DefendAnswerRequest(BaseModel):
    session_id: str
    claim_id: str
    user_answer: str = Field(..., description="User's verbal/text answer to the interview question")
    is_followup: bool = False


class DefendClaimEvaluation(BaseModel):
    claim_id: str
    claim_text: str
    user_answer: str
    rating: str = "needs_prep"  # strong, needs_prep, defenseless
    score: int = Field(..., ge=0, le=100)
    feedback: str = ""
    strengths: List[str] = Field(default_factory=list)
    gaps: List[str] = Field(default_factory=list)


class DefendFinalReport(BaseModel):
    resume_id: str
    overall_defensibility_score: int = Field(..., ge=0, le=100)
    strong_claims: List[str] = Field(default_factory=list)
    claims_needing_prep: List[str] = Field(default_factory=list)
    defenseless_claims: List[str] = Field(default_factory=list)
    suggested_prep_topics: List[str] = Field(default_factory=list)
    analyzed_at: str = ""


class DefendAnswerResponse(BaseModel):
    session_id: str
    claim_evaluation: DefendClaimEvaluation
    needs_followup: bool = False
    followup_question: Optional[str] = None
    next_claim_id: Optional[str] = None
    next_question: Optional[str] = None
    is_complete: bool = False
    final_report: Optional[DefendFinalReport] = None


