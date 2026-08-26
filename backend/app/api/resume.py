from datetime import datetime, timezone
import re
from typing import Any, Dict, Optional

from fastapi import APIRouter, Depends
from pydantic import BaseModel, Field

from app.database.mongodb import db
from app.middlewares.auth_middleware import get_current_user


router = APIRouter(prefix="/resume", tags=["Resume"])


class ResumePayload(BaseModel):
    file_name: str = ""
    extracted_text: str = Field(min_length=1)


class ResumeResponse(BaseModel):
    user_id: str
    file_name: str
    extracted_text: str
    analysis: Dict[str, Any]
    updated_at: datetime


def analyze_resume(text: str) -> Dict[str, Any]:
    normalized = text.lower()
    sections = [
        section for section in ["education", "skills", "projects", "experience", "achievement", "certif"]
        if section in normalized
    ]
    suggestions = []

    def add_suggestion(suggestion: str):
        if suggestion not in suggestions:
            suggestions.append(suggestion)

    if "skills" not in sections:
        add_suggestion("Add a dedicated technical skills section matching your target role.")
    if "projects" not in sections:
        add_suggestion("Add one or two projects with the technology used and your individual contribution.")
    if "experience" not in sections and "intern" not in normalized:
        add_suggestion("Include internship, freelance, or practical experience with clear responsibilities.")
    if "education" not in sections:
        add_suggestion("Add your education details, graduation year, and relevant coursework.")
    if "github" not in normalized and "portfolio" not in normalized:
        add_suggestion("Add a GitHub or portfolio link so recruiters can verify your technical work.")

    metric_matches = re.findall(r"\b\d+(?:\.\d+)?\s*%|\b\d+\s*(?:x|users?|projects?|months?|years?)\b", normalized)
    if not metric_matches:
        add_suggestion("Quantify your impact with metrics such as performance gains, users, scale, or completion time.")
    word_count = len(text.split())
    if len(text) < 900:
        add_suggestion("Add specific tools, outcomes, and context so each resume entry is easier to evaluate.")
    if len(text) > 2200:
        add_suggestion("Reduce dense paragraphs and keep each bullet focused on one outcome.")

    action_matches = re.findall(r"\b(built|developed|designed|implemented|optimized|led|created|automated|managed|improved)\b", normalized)
    if not action_matches:
        add_suggestion("Start bullets with strong action verbs that make your contribution immediately clear.")
    while len(suggestions) < 3:
        add_suggestion("Tailor the wording of this resume to the job description and repeat the role's most relevant keywords.")

    technical_keywords = set(re.findall(
        r"\b(python|java|javascript|typescript|react|node|sql|mongodb|aws|docker|git|api|machine learning|data structures|algorithms)\b",
        normalized,
    ))
    score = min(
        96,
        max(
            45,
            38 + len(sections) * 5 + min(10, word_count // 180) + min(12, len(metric_matches) * 4)
            + (4 if "github" in normalized or "portfolio" in normalized else 0)
            + min(8, len(action_matches) * 2) + min(8, len(technical_keywords)),
        ),
    )
    return {
        "score": score,
        "sections": sections,
        "strengths": [
            "Technical skills are clearly listed." if "skills" in sections else "Add a dedicated technical skills section.",
            "Projects demonstrate hands-on experience." if "projects" in sections else "Add project details with your contribution.",
            "Achievements make your profile more credible." if "achievement" in sections else "Add measurable achievements or outcomes.",
        ],
        "improvements": suggestions[:3],
    }


@router.get("", response_model=Optional[ResumeResponse])
async def get_resume(current_user: dict = Depends(get_current_user)):
    return await db.resumes.find_one(
        {"user_id": current_user["id"]},
        {"_id": 0},
    )


@router.put("", response_model=ResumeResponse)
async def save_resume(
    payload: ResumePayload,
    current_user: dict = Depends(get_current_user),
):
    resume = {
        "user_id": current_user["id"],
        **payload.model_dump(),
        "analysis": analyze_resume(payload.extracted_text),
        "updated_at": datetime.now(timezone.utc),
    }
    await db.resumes.update_one(
        {"user_id": current_user["id"]},
        {"$set": resume},
        upsert=True,
    )
    return resume