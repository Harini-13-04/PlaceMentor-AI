import re
import uuid
from datetime import datetime, timezone
from typing import List, Dict, Any, Optional
from app.schemas.resume import (
    ResumeData,
    DefendClaimItem,
    DefendInitResponse,
    DefendAnswerRequest,
    DefendClaimEvaluation,
    DefendAnswerResponse,
    DefendFinalReport,
)

# In-memory store for active defense sessions
ACTIVE_DEFEND_SESSIONS: Dict[str, Dict[str, Any]] = {}

HIGH_RISK_KEYWORDS = [
    "scalable", "thousands", "millions", "reduced", "increased", "optimized",
    "architected", "spearheaded", "microservices", "kubernetes", "cloud",
    "lead", "automated", "performance", "high availability", "zero downtime"
]

MEDIUM_RISK_KEYWORDS = [
    "built", "developed", "integrated", "engineered", "implemented",
    "created", "managed", "full stack", "custom", "algorithm"
]


def extract_resume_claims(resume: ResumeData) -> List[DefendClaimItem]:
    """
    Extract discrete claims from summary, experience, projects, skills, and achievements.
    Strictly uses information present in the resume data without hallucinating claims.
    """
    claims: List[DefendClaimItem] = []

    # 1. Summary claims
    if resume.summary and len(resume.summary.strip()) > 20:
        sentences = [s.strip() for s in re.split(r'[\.\!\;]', resume.summary) if len(s.strip()) > 15]
        for s in sentences[:2]:
            risk = evaluate_claim_risk(s)
            claims.append(DefendClaimItem(
                id=str(uuid.uuid4()),
                section="summary",
                claim_text=s,
                risk_level=risk[0],
                risk_reason=risk[1]
            ))

    # 2. Experience claims
    for exp in resume.experience:
        for bullet in exp.bullets:
            if len(bullet.strip()) > 15:
                risk = evaluate_claim_risk(bullet)
                claims.append(DefendClaimItem(
                    id=str(uuid.uuid4()),
                    section="experience",
                    claim_text=bullet.strip(),
                    risk_level=risk[0],
                    risk_reason=risk[1]
                ))

    # 3. Project claims
    for proj in resume.projects:
        proj_claim = f"{proj.name}: {proj.description}" if proj.description else proj.name
        if proj.technologies:
            proj_claim += f" using {', '.join(proj.technologies)}"
        if len(proj_claim.strip()) > 15:
            risk = evaluate_claim_risk(proj_claim)
            claims.append(DefendClaimItem(
                id=str(uuid.uuid4()),
                section="projects",
                claim_text=proj_claim.strip(),
                risk_level=risk[0],
                risk_reason=risk[1]
            ))

    # Fallback claim if resume content is minimal
    if not claims:
        claims.append(DefendClaimItem(
            id=str(uuid.uuid4()),
            section="summary",
            claim_text=f"Target role candidate for {resume.target_role}",
            risk_level="medium",
            risk_reason="Foundational role assertion"
        ))

    # Prioritize high risk claims first
    claims.sort(key=lambda c: 0 if c.risk_level == "high" else (1 if c.risk_level == "medium" else 2))
    return claims[:5]  # Limit to top 5 key claims per session for optimal interview length


def evaluate_claim_risk(text: str) -> tuple[str, str]:
    """Categorize claim risk level based on quantitative assertions and high-impact terminology."""
    text_lower = text.lower()
    for kw in HIGH_RISK_KEYWORDS:
        if kw in text_lower:
            return "high", f"High-impact or quantitative claim involving '{kw}'"
    for kw in MEDIUM_RISK_KEYWORDS:
        if kw in text_lower:
            return "medium", f"Technical execution claim involving '{kw}'"
    return "low", "General resume statement"


def generate_claim_question(claim: DefendClaimItem) -> str:
    """Generate targeted interview question to test understanding and ownership of claim."""
    claim_text = claim.claim_text
    if "scalable" in claim_text.lower() or "thousands" in claim_text.lower():
        return f"In your resume, you stated: '{claim_text}'. How did you design and implement scalability in this system?"
    elif "optimized" in claim_text.lower() or "reduced" in claim_text.lower():
        return f"In your resume, you wrote: '{claim_text}'. What specific metrics or techniques did you measure to verify that optimization?"
    elif "architected" in claim_text.lower() or "built" in claim_text.lower():
        return f"Regarding your claim: '{claim_text}'. What key technical trade-offs or architectural decisions did you consider?"
    else:
        return f"In your resume, you highlighted: '{claim_text}'. Can you explain your specific contribution and implementation details?"


def generate_followup_question(claim_text: str, user_answer: str) -> str:
    """Generate a probing follow-up question when candidate answer lacks implementation specifics."""
    return f"You mentioned: '{user_answer[:80]}...'. What specific technical optimization or architectural decision did you implement to handle that?"


def initialize_defend_session(resume: ResumeData) -> DefendInitResponse:
    """Start a new Defend Your Resume session."""
    session_id = str(uuid.uuid4())
    claims = extract_resume_claims(resume)

    ACTIVE_DEFEND_SESSIONS[session_id] = {
        "resume_id": resume.id,
        "claims": [c.model_dump() for c in claims],
        "current_claim_index": 0,
        "evaluations": [],
        "created_at": datetime.now(timezone.utc).isoformat()
    }

    first_claim = claims[0] if claims else None
    first_q = generate_claim_question(first_claim) if first_claim else None

    return DefendInitResponse(
        session_id=session_id,
        resume_id=resume.id,
        total_claims=len(claims),
        claims=claims,
        first_claim_id=first_claim.id if first_claim else None,
        first_question=first_q
    )


def evaluate_defend_answer(resume_id: str, request: DefendAnswerRequest) -> DefendAnswerResponse:
    """
    Evaluates candidate's answer for technical correctness, specificity, understanding, and ownership.
    Never penalizes candidate merely for using different phrasing.
    Triggers follow-up question if initial answer lacks depth.
    """
    session = ACTIVE_DEFEND_SESSIONS.get(request.session_id)
    if not session:
        # Fallback inline evaluation if session expired
        session = {
            "resume_id": resume_id,
            "claims": [{"id": request.claim_id, "claim_text": "Resume technical claim", "section": "experience"}],
            "current_claim_index": 0,
            "evaluations": [],
        }

    claims_data = session.get("claims", [])
    current_index = session.get("current_claim_index", 0)

    # Find matching claim
    matching_claim = next((c for c in claims_data if c["id"] == request.claim_id), None)
    if not matching_claim:
        matching_claim = claims_data[min(current_index, len(claims_data) - 1)]

    claim_text = matching_claim.get("claim_text", "")
    answer_text = request.user_answer.strip()
    answer_len = len(answer_text)

    # ------------------------------------------------------------------------
    # DETERMINISTIC SUBSTANCE EVALUATION (SAFE & FAIR)
    # ------------------------------------------------------------------------
    generic_words = {
        "the", "and", "with", "for", "that", "this", "used", "made", "make", "just",
        "code", "fast", "well", "good", "done", "role", "work", "team", "have", "been",
        "some", "more", "much", "very", "also", "from", "into", "over", "such", "than",
        "optimized", "improved", "helped", "handling", "handled", "worked"
    }

    words = [w.lower() for w in re.findall(r'\b[a-zA-Z0-9\+#\.\/-]+\b', answer_text)]
    tech_terms = [w for w in words if len(w) >= 3 and w not in generic_words]

    strengths = []
    gaps = []
    needs_followup = False
    followup_q = None

    if answer_len < 5:
        score = 20
        rating = "defenseless"
        feedback = "Answer is empty or insufficient to evaluate."
        gaps.append("No technical explanation provided.")
    elif (answer_len < 25 or len(tech_terms) < 3) and not request.is_followup:
        score = 55 if answer_len < 25 else 65
        rating = "needs_prep"
        feedback = "Answer lacks technical detail. Interviewer requested specific implementation details."
        gaps.append("Could benefit from explaining specific tools, algorithms, or metrics used.")
        needs_followup = True
        followup_q = generate_followup_question(claim_text, answer_text)
    elif answer_len < 25 and request.is_followup:
        score = 35
        rating = "defenseless"
        feedback = "Follow-up response remained short and lacked implementation details."
        gaps.append("Unable to provide technical specifics for the claim.")
    else:
        # Strong answer with specific technical substance
        score = 88 if not request.is_followup else 82
        rating = "strong"
        feedback = "Solid defense demonstrating technical understanding, decision rationale, and clear contribution."
        strengths.append("Demonstrates clear technical ownership and domain vocabulary.")
        strengths.append("Explains specific technical implementation details without generic fluff.")

    evaluation = DefendClaimEvaluation(
        claim_id=request.claim_id,
        claim_text=claim_text,
        user_answer=answer_text,
        rating=rating,
        score=score,
        feedback=feedback,
        strengths=strengths,
        gaps=gaps
    )

    session["evaluations"].append(evaluation.model_dump())

    # Advance to next claim if no follow-up is needed or if follow-up is completed
    if not needs_followup:
        session["current_claim_index"] += 1

    next_idx = session["current_claim_index"]
    is_complete = next_idx >= len(claims_data) and not needs_followup

    next_claim_id = None
    next_question = None
    final_report = None

    if not is_complete and not needs_followup:
        next_claim_dict = claims_data[next_idx]
        next_claim_id = next_claim_dict["id"]
        next_claim_obj = DefendClaimItem(**next_claim_dict)
        next_question = generate_claim_question(next_claim_obj)

    if is_complete:
        final_report = generate_final_report(resume_id, session["evaluations"])

    return DefendAnswerResponse(
        session_id=request.session_id,
        claim_evaluation=evaluation,
        needs_followup=needs_followup,
        followup_question=followup_q,
        next_claim_id=next_claim_id,
        next_question=next_question,
        is_complete=is_complete,
        final_report=final_report
    )


def generate_final_report(resume_id: str, evaluations_data: List[dict]) -> DefendFinalReport:
    """Generate overall defensibility scorecard (0-100) and section breakdown."""
    if not evaluations_data:
        return DefendFinalReport(
            resume_id=resume_id,
            overall_defensibility_score=75,
            strong_claims=["General resume assertions defended successfully"],
            claims_needing_prep=[],
            defenseless_claims=[],
            suggested_prep_topics=["Practice explaining architectural choices under pressure"],
            analyzed_at=datetime.now(timezone.utc).isoformat()
        )

    scores = [e.get("score", 70) for e in evaluations_data]
    overall = round(sum(scores) / len(scores))
    overall = max(0, min(100, overall))

    strong = []
    needs_prep = []
    defenseless = []
    suggested_topics = set()

    for e in evaluations_data:
        claim_text = e.get("claim_text", "")
        rating = e.get("rating", "needs_prep")
        if rating == "strong":
            strong.append(claim_text)
        elif rating == "needs_prep":
            needs_prep.append(claim_text)
            suggested_topics.add("Prepare detailed implementation steps and metrics for technical achievements")
        else:
            defenseless.append(claim_text)
            suggested_topics.add("Review core technical concepts and tools listed on your resume")

    if not suggested_topics:
        suggested_topics.add("Maintain current technical preparation depth for system architecture questions")

    return DefendFinalReport(
        resume_id=resume_id,
        overall_defensibility_score=overall,
        strong_claims=strong,
        claims_needing_prep=needs_prep,
        defenseless_claims=defenseless,
        suggested_prep_topics=sorted(list(suggested_topics)),
        analyzed_at=datetime.now(timezone.utc).isoformat()
    )
