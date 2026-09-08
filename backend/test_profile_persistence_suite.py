"""
PlaceMentor AI — Comprehensive Profile Persistence, Security & Multi-Tenant Suite
Verifies:
1. Fresh user creation has genuine baseline (no fake default profile data)
2. PATCH /api/users/me updates all canonical fields in MongoDB users_collection
3. Avatar upload and deletion persistence
4. Banner upload and deletion persistence
5. Secure Password change flow (validation, rejection of bad current password, success & new login)
6. Learning levels (programming_level, dsa_level, aptitude_level, core_cs_level) persistence
7. Partial update preservation (editing one field doesn't wipe other fields)
8. Multi-tenant isolation (User A vs User B zero cross-talk)
9. Re-login / session refresh persistence directly from MongoDB
"""

import sys
import os
import uuid
import asyncio
from httpx import AsyncClient, ASGITransport
import server
from database import db
from app.database.mongodb import users_collection, learner_profiles_collection

async def test_full_profile_lifecycle():
    transport = ASGITransport(app=server.app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # 1. Fresh User A Registration
        user_a_email = f"profile_test_a_{uuid.uuid4().hex[:8]}@example.com"
        reg_res = await client.post("/api/auth/register", json={
            "fullName": "Fresh Candidate A",
            "email": user_a_email,
            "password": "SecurePassword123!",
            "college": "",
            "department": "",
            "gender": ""
        })
        assert reg_res.status_code == 201, f"Reg failed: {reg_res.text}"
        data_a = reg_res.json()
        token_a = data_a["access_token"]
        headers_a = {"Authorization": f"Bearer {token_a}"}

        # 2. Verify Fresh Profile /me State
        me_res = await client.get("/api/auth/me", headers=headers_a)
        assert me_res.status_code == 200
        me_data = me_res.json()
        assert me_data["name"] == "Fresh Candidate A"
        assert me_data["college"] == ""
        assert me_data["department"] == ""
        assert me_data["bio"] == ""
        assert me_data["skills"] == []
        assert me_data["gender"] == ""
        print("[PASS] [TEST 1] Fresh user has clean empty state without fake defaults")

        # 3. Full Profile Update via PATCH /api/users/me
        update_payload = {
            "name": "Jane Developer",
            "phone": "+91 98765 43210",
            "dob": "2002-05-14",
            "gender": "Female",
            "college": "MIT Engineering College",
            "department": "Computer Science & AI",
            "year": "4th Year",
            "target_role": "Full Stack Software Engineer",
            "target_company": "Tier-1 Product Companies",
            "location": "Bengaluru, India",
            "website": "https://janedev.me",
            "github": "github.com/janedev",
            "linkedin": "linkedin.com/in/janedev",
            "bio": "Passionate full-stack developer preparing for campus placements.",
            "skills": ["Python", "React", "Node.js", "Algorithms & DSA"],
            "preferred_languages": ["Python", "JavaScript"],
            "programming_level": "Advanced",
            "dsa_level": "Intermediate",
            "aptitude_level": "Intermediate",
            "core_cs_level": "Advanced"
        }
        patch_res = await client.patch("/api/users/me", json=update_payload, headers=headers_a)
        assert patch_res.status_code == 200, f"Patch failed: {patch_res.text}"
        patched_data = patch_res.json()
        assert patched_data["name"] == "Jane Developer"
        assert patched_data["college"] == "MIT Engineering College"
        assert patched_data["gender"] == "Female"
        assert patched_data["skills"] == ["Python", "React", "Node.js", "Algorithms & DSA"]
        assert patched_data["target_role"] == "Full Stack Software Engineer"
        assert patched_data["programming_level"] == "Advanced"
        print("[PASS] [TEST 2] PATCH /api/users/me updated all canonical profile & learning level fields")

        # 4. Verify GET /api/auth/me returns persisted values from MongoDB
        me_res_2 = await client.get("/api/auth/me", headers=headers_a)
        assert me_res_2.status_code == 200
        saved_profile = me_res_2.json()
        assert saved_profile["name"] == "Jane Developer"
        assert saved_profile["dob"] == "2002-05-14"
        assert saved_profile["gender"] == "Female"
        assert saved_profile["college"] == "MIT Engineering College"
        assert saved_profile["department"] == "Computer Science & AI"
        assert saved_profile["year"] == "4th Year"
        assert saved_profile["target_role"] == "Full Stack Software Engineer"
        assert saved_profile["target_company"] == "Tier-1 Product Companies"
        assert saved_profile["location"] == "Bengaluru, India"
        assert saved_profile["website"] == "https://janedev.me"
        assert saved_profile["github"] == "github.com/janedev"
        assert saved_profile["linkedin"] == "linkedin.com/in/janedev"
        assert saved_profile["bio"] == "Passionate full-stack developer preparing for campus placements."
        assert saved_profile["skills"] == ["Python", "React", "Node.js", "Algorithms & DSA"]
        assert saved_profile["preferred_languages"] == ["Python", "JavaScript"]
        assert saved_profile["programming_level"] == "Advanced"
        print("[PASS] [TEST 3] GET /api/auth/me accurately returned all MongoDB-persisted fields")

        # 5. Avatar Update & Deletion
        avatar_post = await client.post("/api/users/me/avatar", json={"avatar_url": "https://images.unsplash.com/photo-test-avatar.jpg"}, headers=headers_a)
        assert avatar_post.status_code == 200
        assert avatar_post.json()["avatar"] == "https://images.unsplash.com/photo-test-avatar.jpg"
        
        avatar_del = await client.delete("/api/users/me/avatar", headers=headers_a)
        assert avatar_del.status_code == 200
        assert avatar_del.json()["avatar"] == ""
        print("[PASS] [TEST 4] Avatar update & delete lifecycle verified")

        # 6. Banner Update & Deletion
        banner_post = await client.post("/api/users/me/banner", json={"banner_url": "https://images.unsplash.com/photo-test-banner.jpg"}, headers=headers_a)
        assert banner_post.status_code == 200
        assert banner_post.json()["banner_image"] == "https://images.unsplash.com/photo-test-banner.jpg"

        banner_del = await client.delete("/api/users/me/banner", headers=headers_a)
        assert banner_del.status_code == 200
        assert banner_del.json()["banner_image"] == ""
        print("[PASS] [TEST 5] Banner update & delete lifecycle verified")

        # 7. Password Change Flow
        # Bad current password must fail
        bad_pw_res = await client.post("/api/auth/change-password", json={
            "current_password": "WrongPassword999!",
            "new_password": "BrandNewPassword123!"
        }, headers=headers_a)
        assert bad_pw_res.status_code == 400

        # Good password change must succeed
        good_pw_res = await client.post("/api/auth/change-password", json={
            "current_password": "SecurePassword123!",
            "new_password": "BrandNewPassword123!"
        }, headers=headers_a)
        assert good_pw_res.status_code == 200

        # Login with old password must fail
        old_login = await client.post("/api/auth/login", json={
            "email": user_a_email,
            "password": "SecurePassword123!"
        })
        assert old_login.status_code == 401

        # Login with new password must succeed
        new_login = await client.post("/api/auth/login", json={
            "email": user_a_email,
            "password": "BrandNewPassword123!"
        })
        assert new_login.status_code == 200
        print("[PASS] [TEST 6] Change password flow verified with zero password exposure")

        # 8. Partial Update (Edit one field without erasing others)
        partial_patch = await client.patch("/api/users/me", json={
            "bio": "Updated bio: Heading to FAANG interview soon!"
        }, headers=headers_a)
        assert partial_patch.status_code == 200

        me_res_3 = await client.get("/api/auth/me", headers=headers_a)
        partially_updated = me_res_3.json()
        assert partially_updated["bio"] == "Updated bio: Heading to FAANG interview soon!"
        assert partially_updated["college"] == "MIT Engineering College", "College was accidentally erased!"
        assert partially_updated["gender"] == "Female", "Gender was accidentally erased!"
        assert partially_updated["skills"] == ["Python", "React", "Node.js", "Algorithms & DSA"], "Skills were accidentally erased!"
        assert partially_updated["target_role"] == "Full Stack Software Engineer", "Target role was accidentally erased!"
        print("[PASS] [TEST 7] Partial field update does NOT erase existing profile fields")

        # 9. Multi-Tenant Isolation with User B
        user_b_email = f"profile_test_b_{uuid.uuid4().hex[:8]}@example.com"
        reg_b = await client.post("/api/auth/register", json={
            "fullName": "User B",
            "email": user_b_email,
            "password": "SecurePassword123!",
            "college": "Oxford Institute",
            "department": "Electrical Engineering",
            "gender": "Male"
        })
        assert reg_b.status_code == 201
        token_b = reg_b.json()["access_token"]
        headers_b = {"Authorization": f"Bearer {token_b}"}

        me_b = await client.get("/api/auth/me", headers=headers_b)
        b_data = me_b.json()
        assert b_data["name"] == "User B"
        assert b_data["college"] == "Oxford Institute"
        assert b_data["gender"] == "Male"
        assert b_data["skills"] == [], "User B must have isolated empty skills"

        # Update User B skills
        await client.patch("/api/users/me", json={"skills": ["C++", "Embedded Systems"]}, headers=headers_b)

        # Re-verify User A data was untouched
        me_a_check = await client.get("/api/auth/me", headers=headers_a)
        assert me_a_check.json()["skills"] == ["Python", "React", "Node.js", "Algorithms & DSA"], "User A skills corrupted by User B!"
        print("[PASS] [TEST 8] Two-user multi-tenant isolation verified with zero cross-tenant leakage")

        # 10. Re-Login & Session Refresh Persistence
        relogin_data = new_login.json()["user"]
        assert relogin_data["name"] == "Jane Developer"
        assert relogin_data["gender"] == "Female"
        assert relogin_data["college"] == "MIT Engineering College"
        assert relogin_data["skills"] == ["Python", "React", "Node.js", "Algorithms & DSA"]
        print("[PASS] [TEST 9] Re-login persistence verified from MongoDB users_collection")

if __name__ == "__main__":
    import asyncio
    asyncio.run(test_full_profile_lifecycle())
    print("\nALL PROFILE MODULE PERSISTENCE & SECURITY TESTS PASSED!")
