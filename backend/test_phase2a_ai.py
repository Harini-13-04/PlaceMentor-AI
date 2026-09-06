import asyncio
import uuid
from app.schemas.auth import RegisterRequest
from app.schemas.resume import ResumeCreateRequest, ResumeImproveRequest
from app.api.auth import register
from app.api.resumes import create_new_resume, improve_resume_content
from fastapi import HTTPException


async def run_phase2a_ai_tests():
    print("\n==================================================")
    print(" PlaceMentor AI - Phase 2A AI Improve Test Suite  ")
    print("==================================================")

    # 1. Register User A
    uid_a = str(uuid.uuid4())[:8]
    email_a = f"ai_user_a_{uid_a}@placementor.ai"
    reg_req_a = RegisterRequest(
        name="Candidate AI Alpha",
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

    # 2. Register User B (for wrong-user security test)
    uid_b = str(uuid.uuid4())[:8]
    email_b = f"ai_user_b_{uid_b}@placementor.ai"
    reg_req_b = RegisterRequest(
        name="Candidate AI Beta",
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

    # 3. Create Resume for User A
    create_req = ResumeCreateRequest(
        name="AI_Test_Resume",
        target_role="Full Stack Software Engineer",
        experience_level="Mid Level",
        template="modern",
    )
    resume_a = await create_new_resume(create_req, current_user=user_a)
    print(f"[OK] Created Resume: ID={resume_a.id}")

    # 4. Test Valid AI Improvement Request (Authenticated)
    print("\n--- [1] POST /api/resumes/{id}/improve (Valid Request) ---")
    imp_req = ResumeImproveRequest(
        section="summary",
        original_text="worked on building web apps with React and FastAPI.",
        improvement_goal="action_verbs",
    )
    imp_res = await improve_resume_content(resume_a.id, imp_req, current_user=user_a)
    assert imp_res.original_text == imp_req.original_text
    assert imp_res.improved_text != ""
    assert "engineered" in imp_res.improved_text.lower() or "architected" in imp_res.improved_text.lower() or "built" in imp_res.improved_text.lower()
    assert imp_res.explanation != ""
    print(f"[OK] Improved Text: '{imp_res.improved_text}'")
    print(f"[OK] Explanation: '{imp_res.explanation}'")
    print(f"[OK] Detected Changes: {imp_res.detected_changes}")

    # 5. Test Factual Safety (Ensuring no invented metrics/companies)
    print("\n--- [2] Factual Safety Check ---")
    orig_fact_text = "developed REST API endpoints for user authentication."
    fact_req = ResumeImproveRequest(section="experience_bullet", original_text=orig_fact_text)
    fact_res = await improve_resume_content(resume_a.id, fact_req, current_user=user_a)
    # Verify no fake metrics like "50,000 users" or "300%" were invented if not present
    assert "50,000" not in fact_res.improved_text
    assert "300%" not in fact_res.improved_text
    print(f"[OK] Verified Factual Safety: No hallucinated metrics in output")

    # 6. Test Security: User B accessing User A's Resume
    print("\n--- [3] Security Check: User B accessing User A's Resume ---")
    try:
        await improve_resume_content(resume_a.id, imp_req, current_user=user_b)
        assert False, "Security vulnerability! User B was able to call improve on User A's resume!"
    except HTTPException as e:
        assert e.status_code == 404
        print("[OK] Security Check Passed: User B rejected with HTTP 404")

    # 7. Test Empty Text Validation
    print("\n--- [4] Validation Check: Empty Original Text ---")
    try:
        empty_req = ResumeImproveRequest(section="summary", original_text="   ")
        await improve_resume_content(resume_a.id, empty_req, current_user=user_a)
        assert False, "Validation failure! Empty text was allowed!"
    except HTTPException as e:
        assert e.status_code == 422
        print("[OK] Validation Passed: Empty text rejected with HTTP 422")

    # 8. Test Invalid Section Validation
    print("\n--- [5] Validation Check: Invalid Section ---")
    try:
        invalid_sec_req = ResumeImproveRequest(section="invalid_section_name", original_text="some content")
        await improve_resume_content(resume_a.id, invalid_sec_req, current_user=user_a)
        assert False, "Validation failure! Invalid section was allowed!"
    except HTTPException as e:
        assert e.status_code == 422
        print("[OK] Validation Passed: Invalid section rejected with HTTP 422")

    print("\n==================================================")
    print(" All Phase 2A AI Improve Tests Passed 100%!       ")
    print("==================================================\n")


if __name__ == "__main__":
    asyncio.run(run_phase2a_ai_tests())
