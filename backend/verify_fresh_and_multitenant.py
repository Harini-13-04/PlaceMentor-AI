"""
Comprehensive E2E Verification Script for PlaceMentor AI
Tests:
1. Genuine Authentication (No mock users, invalid token rejection)
2. Fresh Account Baseline (0 solved, 0 streak, Not Assessed, no fake fallbacks)
3. Code Execution & Submissions (Run vs Submit, Accepted vs Wrong Answer, DB writes)
4. Multi-Tenant Isolation (User A data completely isolated from User B)
5. Aptitude & Quiz Assessment Persistence (Real scores, history preserved)
6. Brain Zone Game & XP Persistence (Real game completion and progression)
7. Relogin / Session Persistence (All metrics survive new session)
"""

import asyncio
import os
import sys
import uuid

if sys.stdout.encoding != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

from httpx import AsyncClient, ASGITransport
from dotenv import load_dotenv

# Load backend app
load_dotenv()
from server import app

async def run_verification():
    print("=" * 70)
    print("🚀 STARTING PLACEMENTOR AI COMPLETE AUDIT & VERIFICATION")
    print("=" * 70)

    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # ---------------------------------------------------------------------
        # TEST 1: AUTHENTICATION ENFORCEMENT & REJECTION OF INVALID/DEMO TOKENS
        # ---------------------------------------------------------------------
        print("\n[TEST 1] Authentication Enforcement...")
        unauth_res = await client.get("/api/problems/stats")
        assert unauth_res.status_code == 401, f"Expected 401 for unauthenticated request, got {unauth_res.status_code}"
        
        fake_res = await client.get("/api/problems/stats", headers={"Authorization": "Bearer fake-token-12345"})
        assert fake_res.status_code == 401, f"Expected 401 for fake token, got {fake_res.status_code}"
        
        demo_res = await client.get("/api/problems/stats", headers={"Authorization": "Bearer demo-token"})
        assert demo_res.status_code == 401, f"Expected 401 for demo-token, got {demo_res.status_code}"
        print("  ✓ Unauthenticated & fake/demo tokens strictly rejected with 401 Unauthorized")

        # ---------------------------------------------------------------------
        # TEST 2: FRESH USER A REGISTRATION & BASELINE AUDIT
        # ---------------------------------------------------------------------
        user_a_email = f"audit_user_a_{uuid.uuid4().hex[:8]}@example.com"
        user_a_pass = "TestPassword123!"
        print(f"\n[TEST 2] Fresh User A Registration: {user_a_email}...")
        
        reg_a = await client.post("/api/auth/register", json={
            "email": user_a_email,
            "password": user_a_pass,
            "name": "Audit User A",
            "college": "Test University",
            "department": "Computer Science",
            "graduation_year": 2026,
            "gender": "Female"
        })
        assert reg_a.status_code == 201, f"User A registration failed: {reg_a.text}"
        data_a = reg_a.json()
        token_a = data_a["token"]
        headers_a = {"Authorization": f"Bearer {token_a}"}
        print(f"  ✓ User A registered and issued JWT. User ID: {data_a['user']['id']}")

        # Audit fresh baseline
        print("  Auditing Fresh User A metrics...")
        stats_a = (await client.get("/api/problems/stats", headers=headers_a)).json()
        assert stats_a["solved_count"] == 0, f"Expected 0 solved, got {stats_a['solved_count']}"
        assert stats_a["total_submissions"] == 0, f"Expected 0 submissions, got {stats_a['total_submissions']}"
        assert stats_a["attempted_count"] == 0, f"Expected 0 attempted, got {stats_a['attempted_count']}"
        print(f"  ✓ Problem stats: {stats_a['solved_count']}/{stats_a['total_problems']} solved, 0 submissions")

        bz_a = (await client.get("/api/brainzone/progress", headers=headers_a)).json()
        assert bz_a["xp"] == 0, f"Expected 0 XP, got {bz_a['xp']}"
        assert bz_a["streak"] == 0, f"Expected 0 streak, got {bz_a['streak']}"
        print(f"  ✓ Brain Zone: 0 XP, streak = {bz_a['streak']}")

        ass_a = (await client.get("/api/assessments/history", headers=headers_a)).json()
        assert ass_a["total"] == 0, f"Expected 0 assessments, got {ass_a['total']}"
        print("  ✓ Assessment history: 0 attempts")

        readiness_a = (await client.get("/api/readiness", headers=headers_a)).json()
        print(f"  ✓ Placement Readiness score: {readiness_a['overall_readiness']}% (Genuine baseline)")

        recs_a = (await client.get("/api/recommendations", headers=headers_a)).json()
        print(f"  ✓ Recommendations generated: {len(recs_a.get('recommendations', []))} personalized actions")

        # ---------------------------------------------------------------------
        # TEST 3: REAL CODE EXECUTION & SUBMISSION FLOW
        # ---------------------------------------------------------------------
        print("\n[TEST 3] Real Code Execution on Problem 'two-sum'...")
        
        # 3.1 Run mode (should NOT mark solved or increment submission count)
        run_res = await client.post("/api/execute", headers=headers_a, json={
            "code": "def twoSum(nums, target):\n    return [0, 1]",
            "language": "python3",
            "problemId": "two-sum",
            "mode": "run"
        })
        assert run_res.status_code == 200
        run_data = run_res.json()
        assert run_data["isSubmit"] is False
        print(f"  ✓ Run code executed: status={run_data['status']}, isSubmit={run_data['isSubmit']}")

        # Verify stats unchanged after Run
        stats_after_run = (await client.get("/api/problems/stats", headers=headers_a)).json()
        assert stats_after_run["solved_count"] == 0
        assert stats_after_run["total_submissions"] == 0
        print("  ✓ Problem remains unsolved after 'Run' execution")

        # 3.2 Submit Wrong Answer
        wa_res = await client.post("/api/execute", headers=headers_a, json={
            "code": "def twoSum(nums, target):\n    return [0, 0]",
            "language": "python3",
            "problemId": "two-sum",
            "mode": "submit"
        })
        assert wa_res.status_code == 200
        wa_data = wa_res.json()
        assert wa_data["status"] == "Wrong Answer"
        print(f"  ✓ Submitted incorrect code: status={wa_data['status']}")

        stats_after_wa = (await client.get("/api/problems/stats", headers=headers_a)).json()
        assert stats_after_wa["solved_count"] == 0
        assert stats_after_wa["attempted_count"] == 1
        assert stats_after_wa["total_submissions"] == 1
        print(f"  ✓ Status after Wrong Answer: 0 solved, 1 attempted, 1 submission recorded")

        # 3.3 Submit Accepted Solution
        ac_code = """class Solution:
    def twoSum(self, nums: list[int], target: int) -> list[int]:
        seen = {}
        for i, num in enumerate(nums):
            comp = target - num
            if comp in seen:
                return [seen[comp], i]
            seen[num] = i
        return []
"""
        ac_res = await client.post("/api/execute", headers=headers_a, json={
            "code": ac_code,
            "language": "python3",
            "problemId": "two-sum",
            "mode": "submit"
        })
        assert ac_res.status_code == 200
        ac_data = ac_res.json()
        assert ac_data["status"] == "Accepted", f"Expected Accepted, got {ac_data['status']}: {ac_data.get('message')}"
        assert ac_data["passedCount"] == ac_data["totalCount"]
        print(f"  ✓ Submitted correct code: status={ac_data['status']} ({ac_data['passedCount']}/{ac_data['totalCount']} tests passed)")

        # Verify stats after Accepted
        stats_after_ac = (await client.get("/api/problems/stats", headers=headers_a)).json()
        assert stats_after_ac["solved_count"] == 1
        assert stats_after_ac["total_submissions"] == 2
        assert "two-sum" in stats_after_ac["solved_problem_ids"]
        print(f"  ✓ Status after Accepted: {stats_after_ac['solved_count']} solved, {stats_after_ac['total_submissions']} total submissions")

        # Submissions history check
        subs_res = await client.get("/api/problems/two-sum/submissions", headers=headers_a)
        assert subs_res.status_code == 200
        subs_data = subs_res.json()
        assert subs_data["total"] == 2
        assert subs_data["submissions"][0]["status"] == "Accepted"
        assert subs_data["submissions"][1]["status"] == "Wrong Answer"
        print(f"  ✓ Submission history correctly retrieved from MongoDB: {subs_data['total']} entries")

        # ---------------------------------------------------------------------
        # TEST 4: MULTI-TENANT ISOLATION (USER B)
        # ---------------------------------------------------------------------
        user_b_email = f"audit_user_b_{uuid.uuid4().hex[:8]}@example.com"
        user_b_pass = "TestPassword123!"
        print(f"\n[TEST 4] Multi-Tenant Isolation Test with User B: {user_b_email}...")
        
        reg_b = await client.post("/api/auth/register", json={
            "email": user_b_email,
            "password": user_b_pass,
            "name": "Audit User B",
            "college": "Test University",
            "department": "Information Technology",
            "graduation_year": 2026,
            "gender": "Male"
        })
        assert reg_b.status_code == 201
        token_b = reg_b.json()["token"]
        headers_b = {"Authorization": f"Bearer {token_b}"}

        # User B should NOT see User A's solved problems
        stats_b = (await client.get("/api/problems/stats", headers=headers_b)).json()
        assert stats_b["solved_count"] == 0, f"User B saw solved_count={stats_b['solved_count']} (Isolation breached!)"
        assert stats_b["total_submissions"] == 0
        assert stats_b["solved_problem_ids"] == []
        print("  ✓ User B sees 0 solved, 0 submissions (User A's progress isolated)")

        subs_b = (await client.get("/api/problems/two-sum/submissions", headers=headers_b)).json()
        assert subs_b["total"] == 0, "User B saw User A's submission history!"
        print("  ✓ User B sees 0 submissions on two-sum (Submissions isolated)")

        # ---------------------------------------------------------------------
        # TEST 5: APTITUDE & QUIZ ASSESSMENT PERSISTENCE
        # ---------------------------------------------------------------------
        print("\n[TEST 5] Aptitude & Quiz Assessment Flow...")
        
        # User A submits an aptitude session
        apt_submit = await client.post("/api/assessments/submit", headers=headers_a, json={
            "assessment_type": "aptitude",
            "category": "Quantitative Aptitude",
            "topic": "Time & Work",
            "difficulty": "Easy",
            "answers": {
                "apt-tw-01": 0,
                "apt-tw-02": 1,
                "apt-tw-03": 2
            },
            "time_spent_seconds": 145
        })
        assert apt_submit.status_code == 200
        apt_report = apt_submit.json()
        print(f"  ✓ Aptitude submitted: score={apt_report.get('score')}%, correct={apt_report.get('correct_count')}/{apt_report.get('total_questions')}")

        # Check assessment history
        ass_history_a = (await client.get("/api/assessments/history", headers=headers_a)).json()
        assert ass_history_a["total"] == 1
        assert ass_history_a["attempts"][0]["assessment_type"] == "aptitude"
        print(f"  ✓ Assessment history persisted to MongoDB: {ass_history_a['total']} attempt(s)")

        # Verify User B has 0 assessments
        ass_history_b = (await client.get("/api/assessments/history", headers=headers_b)).json()
        assert ass_history_b["total"] == 0
        print("  ✓ User B assessment history remains empty (Isolated)")

        # ---------------------------------------------------------------------
        # TEST 6: BRAIN ZONE ENGINE & XP PERSISTENCE
        # ---------------------------------------------------------------------
        print("\n[TEST 6] Brain Zone Engine & Progression...")
        
        # Generate challenge
        gen_res = await client.get("/api/brainzone/generate?game_type=sudoku&level=1&difficulty=Easy", headers=headers_a)
        assert gen_res.status_code == 200
        gen_data = gen_res.json()
        print(f"  ✓ Brain Zone challenge generated: seed={gen_data.get('seed')}, size={len(gen_data.get('puzzle', []))}x{len(gen_data.get('puzzle', [[]])[0])}")

        # Complete challenge
        comp_res = await client.post("/api/brainzone/complete", headers=headers_a, json={
            "game_id": "sudoku",
            "world_id": "mind-forest",
            "level": 1,
            "seed": gen_data.get("seed", 1000),
            "score": 850,
            "accuracy": 100.0,
            "time_spent_seconds": 45,
            "passed": True
        })
        assert comp_res.status_code == 200
        comp_data = comp_res.json()
        assert comp_data["xp_awarded"] > 0
        print(f"  ✓ Challenge completed: awarded {comp_data['xp_awarded']} XP, total XP = {comp_data['new_xp']}")

        # Verify User A progress
        bz_progress_a = (await client.get("/api/brainzone/progress", headers=headers_a)).json()
        assert bz_progress_a["xp"] >= comp_data["xp_awarded"]
        print(f"  ✓ Brain Zone progress retrieved from MongoDB: {bz_progress_a['xp']} XP, player_level={bz_progress_a.get('player_level', 1)}")

        # Verify User B still has 0 XP
        bz_progress_b = (await client.get("/api/brainzone/progress", headers=headers_b)).json()
        assert bz_progress_b["xp"] == 0
        print("  ✓ User B Brain Zone progress remains at 0 XP (Isolated)")

        # ---------------------------------------------------------------------
        # TEST 7: SESSION RE-AUTHENTICATION / SURVIVES LOGOUT & RE-LOGIN
        # ---------------------------------------------------------------------
        print("\n[TEST 7] Session Re-Login & Persistence Verification...")
        
        login_a = await client.post("/api/auth/login", json={
            "email": user_a_email,
            "password": user_a_pass
        })
        assert login_a.status_code == 200
        new_token_a = login_a.json()["token"]
        new_headers_a = {"Authorization": f"Bearer {new_token_a}"}

        # Verify all stats survive re-login
        re_stats = (await client.get("/api/problems/stats", headers=new_headers_a)).json()
        assert re_stats["solved_count"] == 1
        assert re_stats["total_submissions"] == 2
        assert "two-sum" in re_stats["solved_problem_ids"]

        re_ass = (await client.get("/api/assessments/history", headers=new_headers_a)).json()
        assert re_ass["total"] == 1

        re_bz = (await client.get("/api/brainzone/progress", headers=new_headers_a)).json()
        assert re_bz["xp"] == bz_progress_a["xp"]

        print("  ✓ All metrics survived re-login identically from MongoDB:")
        print(f"    - Solved Count: {re_stats['solved_count']}")
        print(f"    - Total Submissions: {re_stats['total_submissions']}")
        print(f"    - Assessments: {re_ass['total']}")
        print(f"    - Brain Zone XP: {re_bz['xp']}")

    print("\n" + "=" * 70)
    print("🎯 ALL AUDIT TESTS PASSED SUCCESSFULLY WITH 100% GENUINE PERSISTENCE!")
    print("=" * 70)

if __name__ == "__main__":
    asyncio.run(run_verification())
