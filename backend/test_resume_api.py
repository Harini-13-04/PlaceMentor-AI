import asyncio
import uuid
from app.schemas.auth import RegisterRequest
from app.schemas.resume import ResumeCreateRequest, ResumeUpdateRequest
from app.services.auth_service import create_user
from app.core.jwt_handler import create_access_token
from app.api.auth import register
from app.api.resumes import (
    create_new_resume,
    list_resumes,
    get_dashboard,
    get_resume,
    update_existing_resume,
    delete_existing_resume,
    duplicate_existing_resume,
)
from fastapi import HTTPException


async def run_resume_test_suite():
    print("\n==================================================")
    print(" PlaceMentor AI - Phase 1 Resume API Test Suite ")
    print("==================================================")

    # 1. Create Test User A
    user_a_id = f"user_a_{uuid.uuid4().hex[:6]}"
    email_a = f"{user_a_id}@placementor.ai"
    reg_req_a = RegisterRequest(
        name="Candidate Alpha",
        email=email_a,
        password="Password123!",
        college="SRMIST",
        department="CSE",
        year="4th Year",
        skills=["React", "FastAPI"],
    )
    reg_res_a = await register(reg_req_a)
    user_a = reg_res_a["user"]
    print(f"[OK] Registered User A: {user_a['id']} ({user_a['email']})")

    # 2. Create Test User B (for isolation testing)
    user_b_id = f"user_b_{uuid.uuid4().hex[:6]}"
    email_b = f"{user_b_id}@placementor.ai"
    reg_req_b = RegisterRequest(
        name="Candidate Beta",
        email=email_b,
        password="Password123!",
        college="IIT",
        department="ECE",
        year="3rd Year",
        skills=["Python"],
    )
    reg_res_b = await register(reg_req_b)
    user_b = reg_res_b["user"]
    print(f"[OK] Registered User B: {user_b['id']} ({user_b['email']})")

    # 3. Create Resume for User A
    print("\n--- [1] POST /api/resumes (Create Resume) ---")
    create_req = ResumeCreateRequest(
        name="SDE_2026_Resume",
        target_role="Full Stack Software Engineer",
        experience_level="Fresher",
        template="modern",
    )
    resume_a = await create_new_resume(create_req, current_user=user_a)
    assert resume_a.id is not None, "Failed to generate resume ID"
    assert resume_a.user_id == user_a["id"], "User ID mismatch"
    assert resume_a.name == "SDE_2026_Resume"
    print(f"[OK] Created Resume: ID={resume_a.id}, Name={resume_a.name}")

    # 4. List Resumes for User A
    print("\n--- [2] GET /api/resumes (List User Resumes) ---")
    list_a = await list_resumes(current_user=user_a)
    assert len(list_a) == 1, f"Expected 1 resume, got {len(list_a)}"
    assert list_a[0].id == resume_a.id
    print(f"[OK] Listed {len(list_a)} resume for User A")

    # 5. Dashboard Endpoint
    print("\n--- [3] GET /api/resumes/dashboard ---")
    dash_a = await get_dashboard(current_user=user_a)
    assert dash_a.total_resumes == 1
    assert dash_a.resumes[0].id == resume_a.id
    print(f"[OK] Dashboard stats: Total={dash_a.total_resumes}, AvgComp={dash_a.average_completion}%")

    # 6. Fetch Single Resume
    print("\n--- [4] GET /api/resumes/{resume_id} ---")
    fetched = await get_resume(resume_a.id, current_user=user_a)
    assert fetched.id == resume_a.id
    assert fetched.target_role == "Full Stack Software Engineer"
    print(f"[OK] Fetched Resume details: ID={fetched.id}")

    # 7. Update Resume (Autosave simulation)
    print("\n--- [5] PUT /api/resumes/{resume_id} (Update / Autosave) ---")
    update_req = ResumeUpdateRequest(
        summary="Experienced Full Stack Engineer with FastAPI & React expertise.",
        personal_info={
            "full_name": "Candidate Alpha",
            "email": email_a,
            "phone": "+91 99999 88888",
            "location": "Chennai",
            "linkedin": "linkedin.com/in/alpha",
            "github": "github.com/alpha",
            "portfolio": "alpha.dev",
        },
    )
    updated_a = await update_existing_resume(resume_a.id, update_req, current_user=user_a)
    assert updated_a.summary == update_req.summary
    assert updated_a.personal_info.full_name == "Candidate Alpha"
    assert updated_a.completion_percentage > 0
    assert updated_a.version == 2
    print(f"[OK] Updated Resume: Summary set, Completion={updated_a.completion_percentage}%, Version={updated_a.version}")

    # 8. Duplicate Resume
    print("\n--- [6] POST /api/resumes/{resume_id}/duplicate ---")
    duplicated = await duplicate_existing_resume(resume_a.id, current_user=user_a)
    assert duplicated.id != resume_a.id
    assert duplicated.name == "SDE_2026_Resume (Copy)"
    assert duplicated.user_id == user_a["id"]
    print(f"[OK] Duplicated Resume: ID={duplicated.id}, Name={duplicated.name}")

    # 9. Modify Duplicate & verify original unchanged
    print("\n--- [7] Edit Duplicate Independently ---")
    dup_update = ResumeUpdateRequest(name="Edited_Duplicate_Resume")
    edited_dup = await update_existing_resume(duplicated.id, dup_update, current_user=user_a)
    assert edited_dup.name == "Edited_Duplicate_Resume"

    original_again = await get_resume(resume_a.id, current_user=user_a)
    assert original_again.name == "SDE_2026_Resume"
    print("[OK] Verified duplicate edits do not affect original resume")

    # 10. User Security & Ownership Isolation
    print("\n--- [8] Security Test: User B attempting to access User A's Resume ---")
    try:
        await get_resume(resume_a.id, current_user=user_b)
        assert False, "Security vulnerability! User B was able to read User A's resume!"
    except HTTPException as e:
        assert e.status_code == 404
        print("[OK] Security Check Passed: User B access to User A's resume rejected with 404")

    # 11. Delete Duplicate
    print("\n--- [9] DELETE /api/resumes/{resume_id} ---")
    await delete_existing_resume(duplicated.id, current_user=user_a)
    list_after_delete = await list_resumes(current_user=user_a)
    assert len(list_after_delete) == 1
    print(f"[OK] Deleted duplicate resume. Remaining count: {len(list_after_delete)}")

    print("\n==================================================")
    print(" All Phase 1 Resume API Persistence Tests Passed! ")
    print("==================================================\n")


if __name__ == "__main__":
    asyncio.run(run_resume_test_suite())
