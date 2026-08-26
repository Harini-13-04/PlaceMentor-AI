import urllib.request
import urllib.error
import json
import uuid

BASE_URL = "http://127.0.0.1:8000/api"

def make_request(path: str, method: str = "GET", data: dict = None, headers: dict = None):
    url = f"{BASE_URL}{path}"
    headers = headers or {}
    req_data = None
    if data is not None:
        req_data = json.dumps(data).encode("utf-8")
        headers["Content-Type"] = "application/json"

    req = urllib.request.Request(url, data=req_data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req) as response:
            status = response.status
            body = response.read().decode("utf-8")
            return status, json.loads(body) if body else {}
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8")
        try:
            return e.code, json.loads(body)
        except Exception:
            return e.code, {"error": body}

def run_live_http_tests():
    print("====================================================")
    print(" Live HTTP Integration Test Suite for PlaceMentor AI ")
    print("====================================================")

    uid = str(uuid.uuid4())[:8]
    test_email = f"e2e_user_{uid}@placementor.ai"
    test_password = "SecretPassword123!"
    new_password = "NewSecretPassword456!"

    # 1. Register
    print("\n[1] Testing POST /api/auth/register over live HTTP...")
    reg_payload = {
        "name": "Live Candidate",
        "email": test_email,
        "password": test_password,
        "college": "IIT Delhi",
        "department": "Electrical & Computer Engineering",
        "year": "3rd Year",
        "skills": ["React", "FastAPI", "MongoDB"]
    }
    status, res = make_request("/auth/register", method="POST", data=reg_payload)
    print(f"Status: {status}")
    assert status == 201, f"Failed register: {res}"
    token = res["access_token"]
    user = res["user"]
    assert token and user["email"] == test_email
    assert user["college"] == "IIT Delhi"
    assert "password" not in user
    print("=> Registration PASSED")

    auth_headers = {"Authorization": f"Bearer {token}"}

    # 2. Get Me
    print("\n[2] Testing GET /api/auth/me over live HTTP...")
    status, res = make_request("/auth/me", method="GET", headers=auth_headers)
    print(f"Status: {status}")
    assert status == 200, f"Failed /me: {res}"
    assert res["email"] == test_email
    assert res["name"] == "Live Candidate"
    assert res["department"] == "Electrical & Computer Engineering"
    print("=> GET /api/auth/me PASSED")

    # 3. Patch Profile
    print("\n[3] Testing PATCH /api/users/me over live HTTP...")
    patch_payload = {
        "bio": "Building high-performance AI placement tools.",
        "phone": "+91 9123456789",
        "github": "github.com/livecandidate",
        "linkedin": "linkedin.com/in/livecandidate",
        "skills": ["React", "FastAPI", "MongoDB", "TypeScript", "Docker"]
    }
    status, res = make_request("/users/me", method="PATCH", data=patch_payload, headers=auth_headers)
    print(f"Status: {status}")
    assert status == 200, f"Failed patch: {res}"
    assert res["bio"] == patch_payload["bio"]
    assert res["phone"] == patch_payload["phone"]
    assert len(res["skills"]) == 5
    print("=> PATCH /api/users/me PASSED")

    # 4. Avatar update via JSON
    print("\n[4] Testing POST /api/users/me/avatar over live HTTP...")
    avatar_payload = {"avatar_url": "https://api.dicebear.com/7.x/identicon/svg?seed=Candidate"}
    status, res = make_request("/users/me/avatar", method="POST", data=avatar_payload, headers=auth_headers)
    print(f"Status: {status}")
    assert status == 200, f"Failed avatar POST: {res}"
    assert res["avatar"] == avatar_payload["avatar_url"]
    print("=> POST /api/users/me/avatar PASSED")

    # 5. Avatar delete
    print("\n[5] Testing DELETE /api/users/me/avatar over live HTTP...")
    status, res = make_request("/users/me/avatar", method="DELETE", headers=auth_headers)
    print(f"Status: {status}")
    assert status == 200, f"Failed avatar DELETE: {res}"
    assert res["avatar"] == ""
    print("=> DELETE /api/users/me/avatar PASSED")

    # 6. Change Password
    print("\n[6] Testing POST /api/auth/change-password over live HTTP...")
    change_payload = {
        "current_password": test_password,
        "new_password": new_password
    }
    status, res = make_request("/auth/change-password", method="POST", data=change_payload, headers=auth_headers)
    print(f"Status: {status}")
    assert status == 200, f"Failed change-password: {res}"
    print("=> POST /api/auth/change-password PASSED")

    # 7. Old password rejected
    print("\n[7] Testing Login with Old Password (must be 401)...")
    status, res = make_request("/auth/login", method="POST", data={"email": test_email, "password": test_password})
    print(f"Status: {status}")
    assert status == 401, f"Expected 401, got: {status}"
    print("=> Old password rejection PASSED")

    # 8. New password login
    print("\n[8] Testing Login with New Password (must be 200)...")
    status, res = make_request("/auth/login", method="POST", data={"email": test_email, "password": new_password})
    print(f"Status: {status}")
    assert status == 200, f"Failed login with new password: {res}"
    assert res["access_token"]
    assert res["user"]["email"] == test_email
    print("=> Login with New Password PASSED")

    # 9. Logout
    print("\n[9] Testing POST /api/auth/logout over live HTTP...")
    status, res = make_request("/auth/logout", method="POST", headers=auth_headers)
    print(f"Status: {status}")
    assert status == 200
    print("=> Logout PASSED")

    print("\n====================================================")
    print(" ALL LIVE HTTP TESTS COMPLETED AND VERIFIED 100%! ")
    print("====================================================")

if __name__ == "__main__":
    run_live_http_tests()
