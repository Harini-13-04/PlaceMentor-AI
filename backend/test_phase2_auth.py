import asyncio
import uuid
from starlette.testclient import TestClient
from server import app
from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import MONGO_URL, DB_NAME

async def cleanup(email: str):
    c = AsyncIOMotorClient(MONGO_URL)
    db = c[DB_NAME]
    await db.users.delete_one({"email": email})
    c.close()

def run_tests():
    # Setup test user credentials
    random_str = str(uuid.uuid4())[:8]
    test_email = f"testuser_{random_str}@placementor.ai"
    test_password = "password123"
    new_password = "newpassword456"

    with TestClient(app) as client:
        print("\n--- 1. Testing POST /api/auth/register ---")
        reg_payload = {
            "name": "Alex Johnson",
            "email": test_email,
            "password": test_password,
            "college": "Stanford University",
            "department": "Computer Science",
            "year": "3rd Year",
            "skills": ["React", "Python", "FastAPI"]
        }
        res = client.post("/api/auth/register", json=reg_payload)
        print(f"Register status: {res.status_code}")
        assert res.status_code == 201, f"Register failed: {res.text}"
        data = res.json()
        token = data["access_token"]
        assert token, "Token not returned"
        assert data["user"]["email"] == test_email
        assert data["user"]["name"] == "Alex Johnson"
        assert data["user"]["college"] == "Stanford University"
        assert data["user"]["department"] == "Computer Science"
        assert data["user"]["year"] == "3rd Year"
        print(" Register PASSED")

        auth_headers = {"Authorization": f"Bearer {token}"}

        print("\n--- 2. Testing GET /api/auth/me ---")
        res = client.get("/api/auth/me", headers=auth_headers)
        print(f"Me status: {res.status_code}")
        assert res.status_code == 200, f"Me failed: {res.text}"
        me_data = res.json()
        assert me_data["email"] == test_email
        assert me_data["department"] == "Computer Science"
        print(" Me PASSED")

        print("\n--- 3. Testing PATCH /api/users/me ---")
        patch_payload = {
            "bio": "Passionate about AI and fullstack systems.",
            "phone": "+1 555-0199",
            "skills": ["React", "Python", "FastAPI", "MongoDB", "TypeScript"],
            "github": "github.com/alexjohnson",
            "linkedin": "linkedin.com/in/alexjohnson"
        }
        res = client.patch("/api/users/me", json=patch_payload, headers=auth_headers)
        print(f"Patch status: {res.status_code}")
        assert res.status_code == 200, f"Patch failed: {res.text}"
        patch_data = res.json()
        assert patch_data["bio"] == patch_payload["bio"]
        assert patch_data["phone"] == patch_payload["phone"]
        assert len(patch_data["skills"]) == 5
        print(" PATCH profile PASSED")

        print("\n--- 4. Testing POST /api/users/me/avatar (upload & JSON) ---")
        avatar_payload = {"avatar_url": "https://api.dicebear.com/7.x/bottts/svg?seed=Alex"}
        res = client.post("/api/users/me/avatar", json=avatar_payload, headers=auth_headers)
        print(f"Avatar update status: {res.status_code}")
        assert res.status_code == 200, f"Avatar update failed: {res.text}"
        assert res.json()["avatar"] == avatar_payload["avatar_url"]

        # File upload test
        files = {"avatar_file": ("test_avatar.png", b"fake_png_image_binary_content", "image/png")}
        res = client.post("/api/users/me/avatar", files=files, headers=auth_headers)
        print(f"Avatar file upload status: {res.status_code}")
        assert res.status_code == 200, f"Avatar file upload failed: {res.text}"
        avatar_url = res.json()["avatar"]
        assert "/uploads/avatars/" in avatar_url
        print(" Avatar POST PASSED")

        print("\n--- 5. Testing DELETE /api/users/me/avatar ---")
        res = client.delete("/api/users/me/avatar", headers=auth_headers)
        print(f"Avatar delete status: {res.status_code}")
        assert res.status_code == 200, f"Avatar delete failed: {res.text}"
        assert res.json()["avatar"] == ""
        print(" Avatar DELETE PASSED")

        print("\n--- 6. Testing POST /api/auth/change-password ---")
        change_payload = {
            "current_password": test_password,
            "new_password": new_password
        }
        res = client.post("/api/auth/change-password", json=change_payload, headers=auth_headers)
        print(f"Change password status: {res.status_code}")
        assert res.status_code == 200, f"Change password failed: {res.text}"
        print(" Change Password PASSED")

        print("\n--- 7. Testing POST /api/auth/login with new password ---")
        # Old password should fail
        res = client.post("/api/auth/login", json={"email": test_email, "password": test_password})
        assert res.status_code == 401, "Old password should have been rejected"

        # New password should succeed
        res = client.post("/api/auth/login", json={"email": test_email, "password": new_password})
        print(f"Login status: {res.status_code}")
        assert res.status_code == 200, f"Login failed: {res.text}"
        login_data = res.json()
        assert login_data["access_token"]
        assert login_data["user"]["email"] == test_email
        print(" Login with new password PASSED")

        print("\n--- 8. Testing POST /api/auth/logout ---")
        res = client.post("/api/auth/logout", headers=auth_headers)
        print(f"Logout status: {res.status_code}")
        assert res.status_code == 200
        print(" Logout PASSED")

    # Clean up test user from DB
    asyncio.run(cleanup(test_email))
    print("\nALL 8 ENDPOINTS TESTED & PASSED SUCCESSFULLY! [SUCCESS]")

if __name__ == "__main__":

    run_tests()
