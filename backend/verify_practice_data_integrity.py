import asyncio
import uuid
import sys
import os
from httpx import AsyncClient, ASGITransport
from server import app
from app.database.mongodb import (
    user_problems_collection,
    coding_submissions_collection,
    users_collection,
)

async def test_practice_data_integrity():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        print("=" * 70)
        print("[TEST] RUNNING PRACTICE DATA INTEGRITY E2E TEST SUITE")
        print("=" * 70)

        # 1. Register Fresh User 1
        user1_email = f"fresh_tester_{uuid.uuid4().hex[:8]}@example.com"
        password = "Password123!"
        reg1 = await client.post("/api/auth/register", json={
            "email": user1_email,
            "password": password,
            "full_name": "Fresh Tester One",
        })
        assert reg1.status_code == 201, f"Failed to register User 1: {reg1.text}"
        data1 = reg1.json()
        token1 = data1["token"]
        user1_id = data1["user"]["id"]
        headers1 = {"Authorization": f"Bearer {token1}"}
        print(f"[OK] Registered Fresh User 1 ({user1_email}), id={user1_id}")

        # Initial checks:
        # A) Solved = 0, Attempted = 0, no submissions
        stats1 = (await client.get("/api/problems/stats", headers=headers1)).json()
        print(f"User 1 Initial Stats: solved={stats1['solved_count']}, attempted={stats1['attempted_count']}, total_submissions={stats1['total_submissions']}")
        assert stats1["solved_count"] == 0, "Expected 0 solved count"
        assert stats1["attempted_count"] == 0, "Expected 0 attempted count"
        assert stats1["total_submissions"] == 0, "Expected 0 submissions"

        # Check list of all problems for User 1: Every single problem must be 'Not Started'
        prob_res = await client.get("/api/problems", headers=headers1)
        assert prob_res.status_code == 200
        prob_list = prob_res.json()["problems"]
        for p in prob_list:
            assert p["status"] == "Not Started", f"Problem {p['id']} has status {p['status']}, expected 'Not Started'"
            assert p.get("attemptsCount", 0) == 0, f"Problem {p['id']} has attemptsCount != 0"
        print(f"[OK] Verified all {len(prob_list)} problems in catalog are 'Not Started' for fresh user.")
        
        # Verify specifically Invert Binary Tree, 3Sum, LRU Cache Design
        inv_tree = next(p for p in prob_list if p["id"] == "invert-binary-tree")
        threesum = next(p for p in prob_list if p["id"] == "3sum")
        lru = next(p for p in prob_list if p["id"] == "lru-cache-design")
        assert inv_tree["status"] == "Not Started"
        assert threesum["status"] == "Not Started"
        assert lru["status"] == "Not Started"
        print("[OK] Verified Invert Binary Tree, 3Sum, LRU Cache Design are all 'Not Started'.")

        # Step A & B: User opens problem and edits code (No action on backend, only GET)
        inv_detail = (await client.get("/api/problems/invert-binary-tree", headers=headers1)).json()
        assert inv_detail["status"] == "Not Started"
        print("[OK] Step A & B: Opened Invert Binary Tree -> Status remains 'Not Started'.")

        # Step C: User clicks RUN with some starter/partial code
        run_code = "class Solution:\n    def invertTree(self, root):\n        return root"
        run_res = await client.post("/api/execute", headers=headers1, json={
            "code": run_code,
            "language": "python",
            "problemId": "invert-binary-tree",
            "isSubmit": False,
            "mode": "run"
        })
        assert run_res.status_code == 200
        run_data = run_res.json()
        print(f"[OK] Step C: Clicked Run -> Status={run_data['status']}, isSubmit={run_data['isSubmit']}")
        
        # Verify MongoDB: NO submission record and problem still 'Not Started'
        sub_count = await coding_submissions_collection.count_documents({"user_id": user1_id, "problem_id": "invert-binary-tree"})
        assert sub_count == 0, f"Run created a submission record! count={sub_count}"
        user_prob_doc = await user_problems_collection.find_one({"user_id": user1_id, "problem_id": "invert-binary-tree"})
        assert user_prob_doc is None, f"Run created user_problems record: {user_prob_doc}"
        
        stats_after_run = (await client.get("/api/problems/stats", headers=headers1)).json()
        assert stats_after_run["solved_count"] == 0
        assert stats_after_run["attempted_count"] == 0
        assert stats_after_run["total_submissions"] == 0
        print("[OK] Verified Run did NOT create submission record, did NOT mark Attempted, did NOT mark Solved.")

        # Step D: Submit a WRONG solution
        wrong_code = "class Solution:\n    def invertTree(self, root):\n        return None"
        submit_wrong_res = await client.post("/api/execute", headers=headers1, json={
            "code": wrong_code,
            "language": "python",
            "problemId": "invert-binary-tree",
            "isSubmit": True,
            "mode": "submit"
        })
        assert submit_wrong_res.status_code == 200
        submit_wrong_data = submit_wrong_res.json()
        assert submit_wrong_data["status"] == "Wrong Answer"
        print("[OK] Step D: Submitted Wrong Solution -> Verdict: Wrong Answer")

        # Check MongoDB & API stats
        stats_after_wrong = (await client.get("/api/problems/stats", headers=headers1)).json()
        assert stats_after_wrong["solved_count"] == 0, f"Wrong submit increased solved_count: {stats_after_wrong}"
        assert stats_after_wrong["attempted_count"] == 1, f"Expected 1 attempted count: {stats_after_wrong}"
        assert stats_after_wrong["total_submissions"] == 1

        prob_after_wrong = (await client.get("/api/problems/invert-binary-tree", headers=headers1)).json()
        assert prob_after_wrong["status"] == "Attempted", f"Expected 'Attempted', got {prob_after_wrong['status']}"
        print("[OK] Verified Invert Binary Tree status is now 'Attempted' and Solved count remains 0.")

        # Step E: Submit a CORRECT solution
        correct_code = """class Solution:
    def invertTree(self, root):
        if not root:
            return None
        root.left, root.right = self.invertTree(root.right), self.invertTree(root.left)
        return root"""
        submit_correct_res = await client.post("/api/execute", headers=headers1, json={
            "code": correct_code,
            "language": "python",
            "problemId": "invert-binary-tree",
            "isSubmit": True,
            "mode": "submit"
        })
        assert submit_correct_res.status_code == 200
        submit_correct_data = submit_correct_res.json()
        assert submit_correct_data["status"] == "Accepted", f"Expected Accepted, got {submit_correct_data}"
        print("[OK] Step E: Submitted Correct Solution -> Verdict: Accepted (All test cases passed)")

        # Verify MongoDB & API stats after Accepted
        stats_after_correct = (await client.get("/api/problems/stats", headers=headers1)).json()
        assert stats_after_correct["solved_count"] == 1, f"Expected 1 solved count: {stats_after_correct}"
        assert stats_after_correct["total_submissions"] == 2
        assert "invert-binary-tree" in stats_after_correct["solved_problem_ids"]

        prob_after_correct = (await client.get("/api/problems/invert-binary-tree", headers=headers1)).json()
        assert prob_after_correct["status"] == "Solved", f"Expected 'Solved', got {prob_after_correct['status']}"
        print("[OK] Verified Invert Binary Tree is now 'Solved' and solved count is exactly 1.")

        # Re-submit correct solution to verify idempotent solved count (must count UNIQUE problems)
        await client.post("/api/execute", headers=headers1, json={
            "code": correct_code,
            "language": "python",
            "problemId": "invert-binary-tree",
            "isSubmit": True,
            "mode": "submit"
        })
        stats_after_re_correct = (await client.get("/api/problems/stats", headers=headers1)).json()
        assert stats_after_re_correct["solved_count"] == 1, f"Duplicate Accepted submission doubled solved count: {stats_after_re_correct}"
        assert stats_after_re_correct["total_submissions"] == 3
        print("[OK] Verified multiple Accepted submissions on same problem count as exactly 1 Solved problem.")

        # Step F: Logout & Relogin verification
        login_res = await client.post("/api/auth/login", json={
            "email": user1_email,
            "password": password,
        })
        assert login_res.status_code == 200
        new_token1 = login_res.json()["token"]
        new_headers1 = {"Authorization": f"Bearer {new_token1}"}
        stats_relogin = (await client.get("/api/problems/stats", headers=new_headers1)).json()
        assert stats_relogin["solved_count"] == 1
        assert "invert-binary-tree" in stats_relogin["solved_problem_ids"]
        print("[OK] Verified Solved status and metrics survive logout and re-login.")

        # Step G: Fresh User 2 Multi-Tenant Isolation
        user2_email = f"fresh_tester_2_{uuid.uuid4().hex[:8]}@example.com"
        reg2 = await client.post("/api/auth/register", json={
            "email": user2_email,
            "password": password,
            "full_name": "Fresh Tester Two",
        })
        assert reg2.status_code == 201
        data2 = reg2.json()
        token2 = data2["token"]
        user2_id = data2["user"]["id"]
        headers2 = {"Authorization": f"Bearer {token2}"}
        print(f"[OK] Registered Fresh User 2 ({user2_email}), id={user2_id}")

        stats2 = (await client.get("/api/problems/stats", headers=headers2)).json()
        assert stats2["solved_count"] == 0, f"User 2 leaked User 1's solved count: {stats2}"
        assert stats2["attempted_count"] == 0
        assert stats2["total_submissions"] == 0
        assert stats2["solved_problem_ids"] == []

        prob2_inv = (await client.get("/api/problems/invert-binary-tree", headers=headers2)).json()
        assert prob2_inv["status"] == "Not Started", f"User 2 saw User 1's Invert Binary Tree status: {prob2_inv['status']}"
        
        subs2_inv = (await client.get("/api/problems/invert-binary-tree/submissions", headers=headers2)).json()
        assert subs2_inv["total"] == 0, f"User 2 saw User 1's submissions: {subs2_inv}"
        print("[OK] Step G: Multi-Tenant Isolation verified: User 2 sees 0 solved, 0 attempted, and Invert Binary Tree is completely 'Not Started'.")

        # Step H: Security test - spoofing userId in request body
        spoof_res = await client.post("/api/execute", headers=headers2, json={
            "code": correct_code,
            "language": "python",
            "problemId": "two-sum",
            "isSubmit": True,
            "mode": "submit",
            "userId": user1_id  # Trying to spoof User 1
        })
        assert spoof_res.status_code == 200
        # Check that submission was credited to User 2 (authenticated user), NOT User 1
        user1_two_sum_subs = await coding_submissions_collection.count_documents({"user_id": user1_id, "problem_id": "two-sum"})
        assert user1_two_sum_subs == 0, "Spoofed userId polluted User 1's records!"
        user2_two_sum_subs = await coding_submissions_collection.count_documents({"user_id": user2_id, "problem_id": "two-sum"})
        assert user2_two_sum_subs == 1, "Submission was not attributed to authenticated User 2!"
        print("[OK] Step H: Security Verification: Spoofed userId was safely ignored, attributed strictly to authenticated JWT user.")

        print("=" * 70)
        print("[SUCCESS] ALL PRACTICE DATA INTEGRITY TESTS PASSED 100%!")
        print("=" * 70)

if __name__ == "__main__":
    asyncio.run(test_practice_data_integrity())
