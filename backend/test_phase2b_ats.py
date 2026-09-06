import asyncio
import uuid
from app.schemas.auth import RegisterRequest
from app.schemas.resume import ResumeCreateRequest, ResumeUpdateRequest
from app.api.auth import register
from app.api.resumes import create_new_resume, get_ats_analysis, update_existing_resume
from fastapi import HTTPException


async def run_phase2b_ats_tests():
    print("\n==================================================")
    print(" PlaceMentor AI - Phase 2B ATS Analysis Test Suite ")
    print("==================================================")

    # 1. Register User A
    uid_a = str(uuid.uuid4())[:8]
    email_a = f"ats_user_a_{uid_a}@placementor.ai"
    reg_req_a = RegisterRequest(
        name="Candidate ATS Alpha",
        email=email_a,
        password="Password123!",
        college="SRMIST",
        department="CSE",
        year="4th Year",
        skills=["React", "FastAPI"],
    )
    res_a = await register(reg_req_a)
    user_a = res_a["user"]
    print(f"[OK] Registered User A: {user_a['id']}")

    # 2. Register User B (for security isolation test)
    uid_b = str(uuid.uuid4())[:8]
    email_b = f"ats_user_b_{uid_b}@placementor.ai"
    reg_req_b = RegisterRequest(
        name="Candidate ATS Beta",
        email=email_b,
        password="Password123!",
        college="IIT",
        department="ECE",
        year="3rd Year",
        skills=["Python"],
    )
    res_b = await register(reg_req_b)
    user_b = res_b["user"]
    print(f"[OK] Registered User B: {user_b['id']}")

    # 3. Create Resume for User A (Empty/Initial State)
    create_req = ResumeCreateRequest(
        name="Fresher_ATS_Resume",
        target_role="Frontend Developer",
        experience_level="Fresher",
        template="modern",
    )
    resume_a = await create_new_resume(create_req, current_user=user_a)
    print(f"[OK] Created Initial Resume: ID={resume_a.id}")

    # 4. Test Valid ATS Analysis on Initial Resume
    print("\n--- [1] POST /api/resumes/{id}/ats-analysis (Initial Resume) ---")
    ats_1 = await get_ats_analysis(resume_a.id, current_user=user_a)
    assert 0 <= ats_1.overall_score <= 100, f"Score out of range: {ats_1.overall_score}"
    assert ats_1.categories.keyword_optimization >= 0
    assert ats_1.categories.section_completeness >= 0
    assert ats_1.categories.skills_alignment >= 0
    assert ats_1.categories.experience_quality >= 0
    assert ats_1.categories.formatting >= 0
    print(f"[OK] Overall Score: {ats_1.overall_score}/100")
    print(f"[OK] Categories: {ats_1.categories.model_dump()}")

    # 5. Test Deterministic Scoring (Analyzing twice returns exact same score)
    print("\n--- [2] Deterministic Scoring Test ---")
    ats_2 = await get_ats_analysis(resume_a.id, current_user=user_a)
    assert ats_1.overall_score == ats_2.overall_score, "Scoring is not deterministic!"
    assert ats_1.categories == ats_2.categories
    print("[OK] Deterministic Scoring Verified: Identical scores for identical data")

    # 6. Update Resume to complete sections and improve experience quality
    print("\n--- [3] Update Resume with Full Details ---")
    update_req = ResumeUpdateRequest(
        summary="High-impact Full Stack Software Engineer with expertise in scalable React, FastAPI systems.",
        personal_info={
            "full_name": "Candidate ATS Alpha",
            "email": email_a,
            "phone": "+91 98765 43210",
            "location": "Chennai",
            "linkedin": "linkedin.com/in/atsalpha",
            "github": "github.com/atsalpha",
        },
        skills=[
            {"id": "sk1", "category": "Languages", "skills": ["Python", "TypeScript", "JavaScript", "SQL"]},
            {"id": "sk2", "category": "Frameworks", "skills": ["React 19", "FastAPI", "Node.js", "TailwindCSS"]},
        ],
        projects=[
            {
                "id": "p1",
                "name": "PlaceMentor AI Platform",
                "description": "Architected and engineered automated career preparation platform.",
                "technologies": ["React", "FastAPI", "MongoDB"],
                "bullets": ["Architected sub-50ms query indexing", "Deployed scalable microservices"],
            }
        ],
    )
    await update_existing_resume(resume_a.id, update_req, current_user=user_a)
    print("[OK] Updated Resume with summary, skills, and projects")

    # 7. Analyze Complete Resume
    print("\n--- [4] Analyze Completed Resume ---")
    ats_completed = await get_ats_analysis(resume_a.id, current_user=user_a)
    assert ats_completed.overall_score > ats_1.overall_score, "Score should improve after completing sections!"
    assert len(ats_completed.strengths) > 0
    print(f"[OK] Completed Resume ATS Score: {ats_completed.overall_score}/100 (Improved from {ats_1.overall_score})")
    print(f"[OK] Strengths: {ats_completed.strengths}")
    print(f"[OK] Recommendations Count: {len(ats_completed.recommendations)}")

    # 8. Security Isolation Test: User B trying to analyze User A's Resume
    print("\n--- [5] Security Check: User B accessing User A's Resume ---")
    try:
        await get_ats_analysis(resume_a.id, current_user=user_b)
        assert False, "Security vulnerability! User B was able to analyze User A's resume!"
    except HTTPException as e:
        assert e.status_code == 404
        print("[OK] Security Isolation Check Passed: User B rejected with HTTP 404")

    print("\n==================================================")
    print(" All Phase 2B ATS Analysis Tests Passed 100%!     ")
    print("==================================================\n")


if __name__ == "__main__":
    asyncio.run(run_phase2b_ats_tests())
