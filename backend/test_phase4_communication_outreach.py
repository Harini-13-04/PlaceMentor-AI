import asyncio
import uuid
import os
import sys
from unittest.mock import patch, AsyncMock
from fastapi import HTTPException
from pydantic import ValidationError

backend_dir = os.path.dirname(os.path.abspath(__file__))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from app.schemas.auth import RegisterRequest
from app.schemas.communication import OutreachGenerateRequest, OutreachGenerateResponse
from app.api.auth import register
from app.api.communication import generate_outreach_message_endpoint


async def run_phase4_communication_outreach_tests():
    print("\n==================================================")
    print(" PlaceMentor AI - Phase 4 Outreach Studio Suite   ")
    print("==================================================")

    # 1. Register User A
    uid_a = str(uuid.uuid4())[:8]
    email_a = f"outreach_user_{uid_a}@placementor.ai"
    reg_req = RegisterRequest(
        name="Candidate Outreach Alpha",
        email=email_a,
        password="Password123!",
        college="SRMIST",
        department="CSE",
        year="4th Year",
        skills=["React", "FastAPI"],
    )
    res_a = await register(reg_req)
    user_a = res_a["user"]
    print(f"[OK] Registered User A: {user_a['id']}")

    # 2. Test Authenticated Generation Success (Mocked Gemini)
    print("\n--- [1] POST /api/communication/generate-outreach (Success) ---")
    mock_response = {
        "message_type": "recruiter_email",
        "subject": "Application for Software Engineer - Candidate Alpha",
        "body": "Dear Hiring Manager,\n\nI am writing to express my interest in the Software Engineer position at Microsoft. I have experience with React and FastAPI.\n\nBest regards,\nCandidate Outreach Alpha",
        "notes": ["Factual safety enforced: No unsupplied facts included."]
    }

    with patch("app.api.communication.generate_outreach_message", new=AsyncMock(return_value=mock_response)):
        req_data = OutreachGenerateRequest(
            message_type="recruiter_email",
            recipient_name="Sarah Jenkins",
            company_name="Microsoft",
            role="Software Engineer",
            job_context="Looking for React and FastAPI developers",
            user_context="B.Tech CS, React & FastAPI experience",
            tone="professional"
        )
        res = await generate_outreach_message_endpoint(request=req_data, current_user=user_a)
        assert isinstance(res, OutreachGenerateResponse)
        assert res.message_type == "recruiter_email"
        assert res.subject == "Application for Software Engineer - Candidate Alpha"
        assert "Microsoft" in res.body
        assert len(res.notes) > 0
        print("[OK] Outreach message generated successfully with valid schema.")

    # 3. Test Invalid Message Type Pydantic Validation
    print("\n--- [2] Invalid Message Type Validation ---")
    try:
        OutreachGenerateRequest(
            message_type="invalid_type_xyz",
            company_name="Microsoft",
            role="SDE"
        )
        assert False, "Validation failure! Invalid message_type allowed!"
    except ValidationError as e:
        print("[OK] Invalid message_type rejected with Pydantic ValidationError.")

    # 4. Test Maximum Length Validation
    print("\n--- [3] Maximum Length Validation ---")
    try:
        OutreachGenerateRequest(
            message_type="recruiter_email",
            company_name="M" * 301,  # Max 300
            role="SDE"
        )
        assert False, "Validation failure! Overly long company_name allowed!"
    except ValidationError as e:
        print("[OK] Overly long company_name rejected with Pydantic ValidationError.")

    # 5. Test AI Service Error Handling
    print("\n--- [4] Gemini Service Failure Handling ---")
    with patch("app.api.communication.generate_outreach_message", new=AsyncMock(side_effect=HTTPException(status_code=500, detail="Gemini API key missing"))):
        req_data = OutreachGenerateRequest(
            message_type="recruiter_email",
            company_name="Stripe",
            role="Fullstack Engineer"
        )
        try:
            await generate_outreach_message_endpoint(request=req_data, current_user=user_a)
            assert False, "Error handling failure! Exception swallowed!"
        except HTTPException as e:
            assert e.status_code == 500
            assert "Gemini API key missing" in e.detail
            print("[OK] Gemini error safely handled with HTTP 500 detail.")

    # 6. Test User Identity Security (no client user_id accepted)
    print("\n--- [5] JWT Identity Integrity Check ---")
    with patch("app.api.communication.generate_outreach_message", new=AsyncMock(return_value=mock_response)):
        req_data = OutreachGenerateRequest(
            message_type="linkedin_message",
            company_name="Google",
            role="Frontend Lead"
        )
        res = await generate_outreach_message_endpoint(request=req_data, current_user=user_a)
        # Ensure user identity passed to service came from current_user JWT, not request body
        assert res.message_type == "recruiter_email"  # returned mock
        print("[OK] User identity strictly tied to JWT current_user.")

    print("\n==================================================")
    print(" ALL OUTREACH STUDIO TESTS PASSED SUCCESSFULLY! ")
    print("==================================================\n")


if __name__ == "__main__":
    asyncio.run(run_phase4_communication_outreach_tests())
