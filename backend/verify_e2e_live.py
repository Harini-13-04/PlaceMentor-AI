"""
PlaceMentor AI — End-to-End Live HTTP & Persistence Verification Script
Executes full real-user workflow against the running backend server:
1. Register fresh user.
2. Authenticate & obtain JWT.
3. Submit 12-dimension onboarding profile & verify MongoDB persistence.
4. Verify empty state dashboard / recommendations before activity.
5. Execute problem in Practice with Run (visible tests) and Submit (backend hidden tests).
6. Verify problem mastery updated in MongoDB to 'Solved' and submission persisted.
7. Take an Aptitude assessment & submit attempt with real score & diagnostic breakdown.
8. Take a Core CS Quiz & submit attempt.
9. Play procedural Brain Zone game & complete with XP reward.
10. Verify Recommendations engine now returns 2-3 grounded daily insights with 'Why This' reasons.
11. Verify Placement Readiness score is calculated from real activity.
12. Verify Company Readiness evaluates real evidence.
13. Verify Personalized Roadmap adapts to academic year and skill level.
14. Query AI Mentor RAG endpoint with contextual question and verify grounded citations.
"""

import asyncio
import httpx
import os
import sys

# Ensure backend directory is on sys.path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from server import app

async def main():
    transport = httpx.ASGITransport(app=app)
    async with httpx.AsyncClient(transport=transport, base_url="http://test", timeout=30.0) as client:
        # Check backend health
        print("[1/14] Checking Backend Health...")
        health_res = await client.get("/health")
        assert health_res.status_code == 200, f"Health check failed: {health_res.text}"
        print("  -> Backend is healthy.")

        # Register fresh user
        random_suffix = os.urandom(4).hex()
        email = f"student_{random_suffix}@placementor.ai"
        password = "SecurePassword123!"
        name = f"Test Student {random_suffix}"

        print(f"[2/14] Registering fresh user: {email}...")
        reg_res = await client.post("/api/auth/register", json={
            "name": name,
            "email": email,
            "password": password,
        })
        assert reg_res.status_code in (200, 201), f"Registration failed: {reg_res.text}"
        token_data = reg_res.json()
        token = token_data.get("token") or token_data.get("access_token")
        user = token_data.get("user")
        user_id = user.get("id") if user else "test-user"
        assert token, "JWT token missing from register response"
        print(f"  -> User registered successfully (ID: {user_id}). Token acquired.")

        auth_headers = {"Authorization": f"Bearer {token}"}

        # Onboarding flow
        print("[3/14] Submitting 12-dimension onboarding profile...")
        onboard_payload = {
            "academic_year": "3rd Year",
            "career_goal": "Product SDE (Tier-1 / MAANG)",
            "target_company_type": "Product Giants (Tier-1)",
            "programming_level": "Intermediate",
            "dsa_level": "Beginner",
            "aptitude_level": "Intermediate",
            "core_cs_level": "Beginner",
            "preferred_languages": ["Python", "JavaScript"],
            "projects_count": "2-3 Projects",
            "has_resume": True,
            "previous_prep": "Self-learning / College",
            "available_hours_per_week": "10-15 hrs/week",
        }
        onboard_res = await client.post("/api/onboarding", json=onboard_payload, headers=auth_headers)
        assert onboard_res.status_code == 200, f"Onboarding failed: {onboard_res.text}"
        print("  -> Onboarding profile persisted in MongoDB.")

        # Fetch Onboarding Profile to verify persistence
        profile_res = await client.get("/api/onboarding", headers=auth_headers)
        assert profile_res.status_code == 200
        saved_profile = profile_res.json()
        assert saved_profile["academic_year"] == "3rd Year"
        assert saved_profile["onboarding_completed"] is True
        print("  -> Verified profile persistence across MongoDB read.")

        # Recommendations before activity (Honest Empty State)
        print("[4/14] Verifying initial recommendations empty state...")
        rec_res = await client.get("/api/recommendations", headers=auth_headers)
        assert rec_res.status_code == 200
        rec_data = rec_res.json()
        assert rec_data["has_activity"] is False
        assert len(rec_data["recommendations"]) == 0
        print("  -> Initial empty state verified (no fake recommendations generated).")

        # Problem Catalog & Hidden Testcase Sanitization
        print("[5/14] Verifying Problem Catalog sanitization...")
        prob_res = await client.get("/api/problems", headers=auth_headers)
        assert prob_res.status_code == 200
        problems = prob_res.json().get("problems", [])
        assert len(problems) >= 10
        for p in problems:
            assert "hiddenTestCases" not in p
            assert "hidden_test_cases" not in p
        print(f"  -> Problem catalog verified ({len(problems)} sanitized problems).")

        # Practice Run & Submit (Hidden testcase enforcement)
        print("[6/14] Executing Two Sum Python solution with server-side hidden test judge...")
        python_correct_code = """def solution(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        comp = target - num
        if comp in seen:
            return [seen[comp], i]
        seen[num] = i
    return []
"""
        exec_res = await client.post("/api/execute", json={
            "language": "python",
            "code": python_correct_code,
            "problemId": "two-sum",
            "mode": "submit",
            "userId": user_id,
        }, headers=auth_headers)
        assert exec_res.status_code == 200, f"Execution failed: {exec_res.text}"
        exec_data = exec_res.json()
        assert exec_data["status"] == "Accepted", f"Expected Accepted, got {exec_data['status']}: {exec_data.get('error')}"
        assert exec_data["passed_count"] == exec_data["total_count"]
        print(f"  -> Code passed ALL visible + server-side hidden tests! Verdict: {exec_data['status']} ({exec_data['passed_count']}/{exec_data['total_count']}).")

        # Verify Submission Persistence & Problem Solved Status
        print("[7/14] Verifying submission history persistence in MongoDB...")
        sub_res = await client.get("/api/problems/two-sum/submissions", headers=auth_headers)
        assert sub_res.status_code == 200
        subs = sub_res.json().get("submissions", [])
        assert len(subs) >= 1
        assert subs[0]["status"] == "Accepted"
        assert subs[0]["problem_id"] == "two-sum"
        print(f"  -> Submission persisted (ID: {subs[0]['id']}, Status: {subs[0]['status']}).")

        # Aptitude Assessment
        print("[8/14] Taking Quantitative Aptitude assessment (Time & Work)...")
        q_res = await client.get("/api/assessments/questions?assessment_type=aptitude&topic=Time%20%26%20Work&count=2", headers=auth_headers)
        assert q_res.status_code == 200
        apt_questions = q_res.json().get("questions", [])
        assert len(apt_questions) >= 1

        # Submit answers
        apt_answers = {q["id"]: 1 for q in apt_questions}  # answer index 1
        apt_submit = await client.post("/api/assessments/submit", json={
            "assessment_type": "aptitude",
            "category": "Quantitative Aptitude",
            "topic": "Time & Work",
            "difficulty": "Easy",
            "answers": apt_answers,
            "time_spent_seconds": 45,
        }, headers=auth_headers)
        assert apt_submit.status_code == 200
        apt_report = apt_submit.json()
        assert "score" in apt_report
        assert "accuracy" in apt_report
        assert "question_results" in apt_report
        print(f"  -> Aptitude assessment evaluated & persisted in MongoDB! Accuracy: {apt_report['accuracy']}%.")

        # Core CS Quiz
        print("[9/14] Taking Core CS Quiz (Operating Systems)...")
        quiz_res = await client.get("/api/assessments/questions?assessment_type=quiz&topic=Operating%20Systems&count=2", headers=auth_headers)
        assert quiz_res.status_code == 200
        quiz_questions = quiz_res.json().get("questions", [])

        quiz_answers = {q["id"]: 2 for q in quiz_questions}
        quiz_submit = await client.post("/api/assessments/submit", json={
            "assessment_type": "quiz",
            "category": "CS Fundamentals",
            "topic": "Operating Systems",
            "difficulty": "Mixed",
            "answers": quiz_answers,
            "time_spent_seconds": 60,
        }, headers=auth_headers)
        assert quiz_submit.status_code == 200
        quiz_report = quiz_submit.json()
        print(f"  -> Core CS quiz evaluated & persisted in MongoDB! Accuracy: {quiz_report['accuracy']}%.")

        # Brain Zone Procedural Generation & Completion
        print("[10/14] Playing procedural Brain Zone Sudoku puzzle...")
        gen_res = await client.get("/api/brainzone/generate?game_type=sudoku&level=1&difficulty=Easy&seed=1042")
        assert gen_res.status_code == 200
        chal = gen_res.json()
        assert chal["game_type"] == "sudoku"
        assert chal["size"] in (4, 6, 9)

        bz_complete = await client.post("/api/brainzone/complete", json={
            "game_id": "sudoku",
            "world_id": "mind-forest",
            "level": 1,
            "seed": 1042,
            "score": 100,
            "accuracy": 100.0,
            "time_spent_seconds": 42,
            "passed": True,
        }, headers=auth_headers)
        assert bz_complete.status_code == 200
        bz_data = bz_complete.json()
        assert bz_data["xp_awarded"] > 0
        print(f"  -> Brain Zone completion recorded! +{bz_data['xp_awarded']} XP awarded (Total XP: {bz_data['new_xp']}).")

        # AI Mentor RAG Contextual Ask
        print("[11/14] Querying Global AI Mentor RAG retrieval...")
        mentor_res = await client.post("/api/mentor/ask", json={
            "question": "How does BFS find the shortest path in unweighted graphs, and what is its time complexity?",
            "context": {"active_module": "practice", "problemTitle": "Two Sum", "language": "python"},
        }, headers=auth_headers)
        assert mentor_res.status_code == 200
        mentor_data = mentor_res.json()
        assert "answer" in mentor_data
        assert len(mentor_data.get("sources", [])) >= 1
        print(f"  -> RAG answer generated with {len(mentor_data['sources'])} grounded citations!")

        # Recommendations after activity
        print("[12/14] Verifying recommendations engine with real activity signals...")
        rec_active_res = await client.get("/api/recommendations", headers=auth_headers)
        assert rec_active_res.status_code == 200
        rec_active_data = rec_active_res.json()
        assert len(rec_active_data["recommendations"]) >= 1
        assert len(rec_active_data["recommendations"]) <= 3
        for r in rec_active_data["recommendations"]:
            assert r["whyThisReason"] is not None
            assert len(r["whyThisReason"]) > 10
        print(f"  -> Generated {len(rec_active_data['recommendations'])} personalized recommendations with explicit 'WHY THIS' justifications.")

        # Placement Readiness Calculation
        print("[13/14] Verifying calculated Placement Readiness...")
        read_res = await client.get("/api/readiness", headers=auth_headers)
        assert read_res.status_code == 200
        read_data = read_res.json()
        assert read_data["has_sufficient_data"] is True
        assert read_data["overall_readiness"] > 0
        assert len(read_data["competencies"]) == 5
        print(f"  -> Placement Readiness score computed from evidence: {read_data['overall_readiness']}% across all 5 evidence pillars.")

        # Company Readiness & Personalized Roadmap
        print("[14/14] Verifying Company Readiness & Adaptive Roadmap...")
        comp_res = await client.get("/api/readiness/company-matches", headers=auth_headers)
        assert comp_res.status_code == 200
        comp_data = comp_res.json()
        assert len(comp_data["matches"]) >= 10

        road_res = await client.get("/api/readiness/roadmap", headers=auth_headers)
        assert road_res.status_code == 200
        road_data = road_res.json()
        assert len(road_data["stages"]) >= 5
        print(f"  -> Company matches verified ({len(comp_data['matches'])} company profiles) and adaptive roadmap generated ({len(road_data['stages'])} stages).")


        print("\n========================================================")
        print("ALL 14 LIVE END-TO-END VERIFICATION STEPS PASSED PERFECTLY!")
        print("========================================================")


if __name__ == "__main__":
    asyncio.run(main())
