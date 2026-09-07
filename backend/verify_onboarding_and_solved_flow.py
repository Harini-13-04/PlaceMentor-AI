import asyncio
import uuid
import httpx
import os
import sys

# Ensure backend root is on sys.path
backend_root = os.path.dirname(os.path.abspath(__file__))
if backend_root not in sys.path:
    sys.path.insert(0, backend_root)

from server import app
from app.database.mongodb import (
    user_problems_collection,
    coding_submissions_collection,
    learner_profiles_collection,
    users_collection,
)

async def test_full_onboarding_and_solved_flow():
    print("=" * 70)
    print("STARTING E2E VERIFICATION: ONBOARDING + PRACTICE SUBMISSIONS + STATS")
    print("=" * 70)

    transport = httpx.ASGITransport(app=app)
    async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
        # STEP 1: Register Fresh Student
        test_email = f"student_flow_{uuid.uuid4().hex[:8]}@placementor.ai"
        password = "Password123!"
        print(f"\n[1/10] Registering fresh student: {test_email}...")
        
        reg_res = await client.post("/api/auth/register", json={
            "full_name": "Full Flow Student",
            "email": test_email,
            "password": password,
        })
        assert reg_res.status_code == 201, f"Registration failed: {reg_res.text}"
        reg_data = reg_res.json()
        token = reg_data["access_token"]
        user_id = reg_data["user"]["id"]
        auth_headers = {"Authorization": f"Bearer {token}"}
        print(f"  -> Registered successfully (User ID: {user_id}). Token acquired.")

        # STEP 2: Check Initial Onboarding Status (Must be false)
        print("\n[2/10] Checking initial onboarding status...")
        status_res = await client.get("/api/onboarding/status", headers=auth_headers)
        assert status_res.status_code == 200
        status_data = status_res.json()
        assert status_data.get("onboarding_completed") is False, "New user must not be onboarding_completed!"
        print("  -> Initial onboarding status verified: onboarding_completed = False (Survey required).")

        # STEP 3: Submit 12-dimension Full-Screen Onboarding Profile
        print("\n[3/10] Submitting 12-dimension full-screen survey profile to /api/onboarding/submit...")
        onboard_payload = {
            "academic_year": "3rd Year",
            "career_goal": "Software Developer",
            "target_company_type": "Product / Tier-1",
            "programming_level": "Intermediate",
            "dsa_level": "Advanced",  # Note: 3rd year + Advanced DSA independently chosen
            "aptitude_level": "Beginner",
            "core_cs_level": "Basic",
            "preferred_languages": ["Python", "Java", "C++"],
            "projects_count": "2+ Projects",
            "has_resume": "I have a resume",
            "previous_prep": "Regular",
            "available_hours_per_week": 14,
        }
        submit_res = await client.post("/api/onboarding/submit", json=onboard_payload, headers=auth_headers)
        assert submit_res.status_code == 200, f"Onboarding submit failed: {submit_res.text}"
        print("  -> Profile successfully saved via authenticated endpoint.")

        # STEP 4: Verify MongoDB Persistence of Learner Profile & Onboarding Completion
        print("\n[4/10] Verifying onboarding status and MongoDB persistence...")
        after_status_res = await client.get("/api/onboarding/status", headers=auth_headers)
        assert after_status_res.status_code == 200
        after_data = after_status_res.json()
        assert after_data.get("onboarding_completed") is True, "Onboarding must be completed now!"
        
        # Verify in DB collection
        db_profile = await learner_profiles_collection.find_one({"user_id": user_id})
        assert db_profile is not None, "Learner profile document must exist in MongoDB!"
        assert db_profile["academic_year"] == "3rd Year"
        assert db_profile["dsa_level"] == "Advanced"
        assert db_profile["onboarding_completed"] is True
        print("  -> Verified in MongoDB learner_profiles collection: onboarding_completed = True.")

        # STEP 5: Verify Problem Stats on Fresh User (Solved Count = 0)
        print("\n[5/10] Checking initial problem stats for fresh user...")
        stats_res = await client.get("/api/problems/stats", headers=auth_headers)
        assert stats_res.status_code == 200
        stats_data = stats_res.json()
        assert stats_data["solved_count"] == 0, f"Expected 0 solved, got {stats_data['solved_count']}"
        assert stats_data["total_problems"] == 22, f"Expected 22 total problems, got {stats_data['total_problems']}"
        print(f"  -> Problem stats verified: Solved = {stats_data['solved_count']} / {stats_data['total_problems']}.")

        # STEP 6: Execute RUN (Visible Tests Only) on Two Sum
        print("\n[6/10] Executing Two Sum in RUN mode (isSubmit = False)...")
        two_sum_code = """
class Solution:
    def twoSum(self, nums: list[int], target: int) -> list[int]:
        seen = {}
        for i, num in enumerate(nums):
            comp = target - num
            if comp in seen:
                return [seen[comp], i]
            seen[num] = i
        return []
"""
        run_res = await client.post("/api/execute", json={
            "code": two_sum_code,
            "language": "python",
            "problemId": "two-sum",
            "isSubmit": False,
        }, headers=auth_headers)
        assert run_res.status_code == 200
        run_data = run_res.json()
        assert run_data["status"] == "Accepted"
        assert run_data["isSubmit"] is False
        
        # Verify RUN does NOT persist submission or change solved count
        sub_count_after_run = await coding_submissions_collection.count_documents({"user_id": user_id})
        assert sub_count_after_run == 0, f"RUN must not persist submission! Found {sub_count_after_run}"
        stats_after_run = (await client.get("/api/problems/stats", headers=auth_headers)).json()
        assert stats_after_run["solved_count"] == 0, "RUN must not increase solved count!"
        print("  -> Verified: RUN passed visible tests without persisting submission or increasing solved count.")

        # STEP 7: Execute SUBMIT on Two Sum (Visible + Hidden Tests)
        print("\n[7/10] Executing Two Sum in SUBMIT mode (isSubmit = True)...")
        submit_exec_res = await client.post("/api/execute", json={
            "code": two_sum_code,
            "language": "python",
            "problemId": "two-sum",
            "isSubmit": True,
        }, headers=auth_headers)
        assert submit_exec_res.status_code == 200
        submit_exec_data = submit_exec_res.json()
        assert submit_exec_data["status"] == "Accepted"
        assert submit_exec_data["passedCount"] == 8
        assert submit_exec_data["totalCount"] == 8
        print("  -> Passed all 8/8 visible + hidden test cases! Status: Accepted.")

        # STEP 8: Verify Practice Submissions Tab History & MongoDB
        print("\n[8/10] Verifying Practice Submissions history endpoint...")
        sub_hist_res = await client.get("/api/problems/two-sum/submissions", headers=auth_headers)
        assert sub_hist_res.status_code == 200
        sub_hist = sub_hist_res.json()["submissions"]
        assert len(sub_hist) == 1, f"Expected 1 submission in history, got {len(sub_hist)}"
        assert sub_hist[0]["status"] == "Accepted"
        assert sub_hist[0]["problem_id"] == "two-sum"
        assert sub_hist[0]["user_id"] == user_id
        print(f"  -> Submissions history verified: 1 real submission found (ID: {sub_hist[0]['submission_id']}, Status: {sub_hist[0]['status']}).")

        # STEP 9: Verify Solved Count Updated (0 -> 1)
        print("\n[9/10] Verifying Solved Count update on stats endpoint...")
        stats_after_sub = (await client.get("/api/problems/stats", headers=auth_headers)).json()
        assert stats_after_sub["solved_count"] == 1, f"Expected 1 solved, got {stats_after_sub['solved_count']}"
        assert "two-sum" in stats_after_sub["solved_problem_ids"]
        print(f"  -> Solved Count verified: {stats_after_sub['solved_count']} / {stats_after_sub['total_problems']}.")

        # STEP 10: Submit Second Problem (Contains Duplicate - First WA, Then Accepted)
        print("\n[10/10] Submitting Contains Duplicate (WA first, then Accepted)...")
        # 10a. Wrong Answer submission
        wa_code = "class Solution:\n    def containsDuplicate(self, nums: list[int]) -> bool:\n        return False\n"
        wa_res = await client.post("/api/execute", json={
            "code": wa_code,
            "language": "python",
            "problemId": "contains-duplicate",
            "isSubmit": True,
        }, headers=auth_headers)
        assert wa_res.status_code == 200
        assert wa_res.json()["status"] == "Wrong Answer"
        
        # Solved count must STILL be 1
        stats_after_wa = (await client.get("/api/problems/stats", headers=auth_headers)).json()
        assert stats_after_wa["solved_count"] == 1, f"WA must not increment solved count! Got {stats_after_wa['solved_count']}"

        # 10b. Correct Accepted submission
        correct_cd_code = """
class Solution:
    def containsDuplicate(self, nums: list[int]) -> bool:
        return len(nums) != len(set(nums))
"""
        ac_res = await client.post("/api/execute", json={
            "code": correct_cd_code,
            "language": "python",
            "problemId": "contains-duplicate",
            "isSubmit": True,
        }, headers=auth_headers)
        assert ac_res.status_code == 200
        assert ac_res.json()["status"] == "Accepted"

        # Solved count must now be 2
        final_stats = (await client.get("/api/problems/stats", headers=auth_headers)).json()
        assert final_stats["solved_count"] == 2, f"Expected 2 solved, got {final_stats['solved_count']}"
        assert "contains-duplicate" in final_stats["solved_problem_ids"]
        assert "two-sum" in final_stats["solved_problem_ids"]
        print(f"  -> Final Solved Count verified: {final_stats['solved_count']} / {final_stats['total_problems']} (Unique solved: {final_stats['solved_problem_ids']}).")

        # Verify MongoDB user_problems collection has exactly 2 Solved documents for this user
        db_solved = await user_problems_collection.find({"user_id": user_id, "status": "Solved"}).to_list(100)
        assert len(db_solved) == 2, f"Expected 2 solved docs in MongoDB, found {len(db_solved)}"
        print("  -> Verified directly in MongoDB user_problems: exactly 2 Solved records exist for this user ID.")

    print("\n" + "=" * 70)
    print("ALL 10 E2E ONBOARDING & SUBMISSION/SOLVED FLOW STEPS PASSED PERFECTLY!")
    print("=" * 70)

if __name__ == "__main__":
    asyncio.run(test_full_onboarding_and_solved_flow())
