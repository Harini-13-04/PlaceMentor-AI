import re
from datetime import datetime, timezone
from typing import List, Dict, Any
from app.schemas.resume import (
    ResumeData,
    ATSAnalysisResponse,
    ATSCategoryScores,
    ATSIssueItem,
    ATSRecommendationItem,
)


STRONG_ACTION_VERBS = {
    "engineered", "architected", "developed", "built", "spearheaded",
    "optimized", "accelerated", "deployed", "implemented", "collaborated",
    "designed", "refactored", "orchestrated", "reduced", "increased",
    "automated", "streamlined", "scaled", "created", "integrated"
}

WEAK_PHRASES = ["worked on", "helped with", "responsible for", "made changes", "handled"]


def analyze_resume_ats(resume: ResumeData) -> ATSAnalysisResponse:
    doc = resume.model_dump()
    
    # 1. Section Completeness (0-20)
    completeness_score = 0
    p_info = doc.get("personal_info") or {}
    if p_info.get("full_name") and p_info.get("email"):
        completeness_score += 4
    if doc.get("summary"):
        completeness_score += 3
    if doc.get("education") and len(doc["education"]) > 0:
        completeness_score += 3
    
    # Context-aware: Experience OR Projects
    exp_len = len(doc.get("experience") or [])
    proj_len = len(doc.get("projects") or [])
    if exp_len > 0 or proj_len > 0:
        completeness_score += 4
    if exp_len > 0 and proj_len > 0:
        completeness_score += 2

    if doc.get("skills") and len(doc["skills"]) > 0:
        completeness_score += 2
    if (doc.get("certifications") and len(doc["certifications"]) > 0) or (doc.get("links") and len(doc["links"]) > 0):
        completeness_score += 2

    completeness_score = min(20, completeness_score)

    # 2. Keyword Optimization (0-20)
    all_text = json_to_searchable_text(doc)
    words = re.findall(r'\b[a-zA-Z0-9+#\.]+\b', all_text.lower())
    unique_words = set(words)
    
    keyword_score = 10
    if len(unique_words) > 50:
        keyword_score += 5
    if len(unique_words) > 100:
        keyword_score += 5
    keyword_score = min(20, keyword_score)

    # 3. Skills Alignment (0-20)
    skills_score = 10
    skill_cats = doc.get("skills") or []
    if len(skill_cats) >= 2:
        skills_score += 5
    total_skill_tags = sum(len(cat.get("skills", [])) for cat in skill_cats if isinstance(cat, dict))
    if total_skill_tags >= 6:
        skills_score += 5
    skills_score = min(20, skills_score)

    # 4. Experience Quality (0-20)
    exp_score = 10
    found_strong_verbs = 0
    found_weak_phrases = 0
    
    for word in words:
        if word in STRONG_ACTION_VERBS:
            found_strong_verbs += 1
            
    for weak in WEAK_PHRASES:
        if weak in all_text.lower():
            found_weak_phrases += 1

    exp_score += min(6, found_strong_verbs * 2)
    exp_score -= min(4, found_weak_phrases * 2)
    exp_score = max(5, min(20, exp_score))

    # 5. Formatting & ATS Compatibility (0-20)
    formatting_score = 12
    if p_info.get("email") and "@" in p_info.get("email", ""):
        formatting_score += 4
    if p_info.get("phone"):
        formatting_score += 4
    formatting_score = min(20, formatting_score)

    # Total Overall Score (0-100)
    overall = completeness_score + keyword_score + skills_score + exp_score + formatting_score
    overall = max(0, min(100, overall))

    # Strengths, Issues & Recommendations
    strengths = []
    issues = []
    recommendations = []

    if completeness_score >= 16:
        strengths.append("High section completeness across core resume modules")
    else:
        issues.append(ATSIssueItem(
            id="sec-001",
            title="Missing core resume sections",
            description="Completing all key sections improves overall recruiter scan rates.",
            severity="medium",
            section="summary"
        ))
        recommendations.append(ATSRecommendationItem(
            id="rec-sec-001",
            title="Complete missing sections",
            description="Add professional summary and education details to complete your profile.",
            severity="medium",
            section="summary",
            action="Fix in Resume"
        ))

    if found_strong_verbs >= 2:
        strengths.append("Strong action verbs detected in descriptions")
    else:
        issues.append(ATSIssueItem(
            id="exp-001",
            title="Weak action verb density",
            description="Use stronger action verbs like 'engineered', 'architected', or 'spearheaded'.",
            severity="medium",
            section="experience"
        ))
        recommendations.append(ATSRecommendationItem(
            id="rec-exp-001",
            title="Strengthen experience & project bullet phrasing",
            description="Replace passive phrasing with active, high-impact verbs.",
            severity="medium",
            section="experience",
            action="Fix in Resume"
        ))

    if total_skill_tags >= 6:
        strengths.append("Diverse technical skill taxonomy categorization")
    else:
        recommendations.append(ATSRecommendationItem(
            id="rec-skl-001",
            title="Consider adding relevant skills",
            description="Potential keywords to consider — only add if you genuinely have these skills.",
            severity="low",
            section="skills",
            action="Fix in Resume"
        ))

    if not p_info.get("linkedin") and not p_info.get("github"):
        issues.append(ATSIssueItem(
            id="fmt-001",
            title="Missing professional profile links",
            description="Adding LinkedIn or GitHub links increases candidate profile verification.",
            severity="low",
            section="personal_info"
        ))
        recommendations.append(ATSRecommendationItem(
            id="rec-fmt-001",
            title="Add LinkedIn / GitHub link",
            description="Include portfolio or code repository URLs in personal info.",
            severity="low",
            section="personal_info",
            action="Fix in Resume"
        ))

    categories = ATSCategoryScores(
        keyword_optimization=keyword_score,
        section_completeness=completeness_score,
        skills_alignment=skills_score,
        experience_quality=exp_score,
        formatting=formatting_score,
    )

    return ATSAnalysisResponse(
        resume_id=resume.id,
        overall_score=overall,
        categories=categories,
        strengths=strengths if len(strengths) > 0 else ["Clean overall ATS layout structure"],
        issues=issues,
        recommendations=recommendations,
        analyzed_at=datetime.now(timezone.utc).isoformat(),
    )


def json_to_searchable_text(doc: dict) -> str:
    parts = []
    if doc.get("summary"):
        parts.append(str(doc["summary"]))
    p_info = doc.get("personal_info") or {}
    for v in p_info.values():
        if v: parts.append(str(v))
    for exp in doc.get("experience") or []:
        if isinstance(exp, dict):
            parts.append(exp.get("role", ""))
            parts.append(exp.get("description", ""))
            parts.extend(exp.get("bullets", []))
    for proj in doc.get("projects") or []:
        if isinstance(proj, dict):
            parts.append(proj.get("name", ""))
            parts.append(proj.get("description", ""))
            parts.extend(proj.get("bullets", []))
    for sk in doc.get("skills") or []:
        if isinstance(sk, dict):
            parts.extend(sk.get("skills", []))
    return " ".join(parts)
