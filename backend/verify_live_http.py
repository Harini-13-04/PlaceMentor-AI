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

    uid_a = str(uuid.uuid4())[:8]
    email_a = f"live_user_a_{uid_a}@placementor.ai"
    test_password = "SecretPassword123!"

    # 1. Register User A
    print("\n[1] Register User A over live HTTP...")
    status, res_a = make_request("/auth/register", method="POST", data={
        "name": "Harini Live Candidate",
        "email": email_a,
        "password": test_password,
        "college": "SRMIST",
        "department": "Computer Science",
        "year": "4th Year",
        "skills": ["React", "FastAPI"]
    })
    assert status == 201, f"Failed register User A: {res_a}"
    token_a = res_a["access_token"]
    user_a = res_a["user"]
    print(f"[OK] User A created: {user_a['id']}")

    auth_a = {"Authorization": f"Bearer {token_a}"}

    # 2. Register User B (for isolation testing)
    uid_b = str(uuid.uuid4())[:8]
    email_b = f"live_user_b_{uid_b}@placementor.ai"
    status, res_b = make_request("/auth/register", method="POST", data={
        "name": "Candidate Beta",
        "email": email_b,
        "password": test_password,
        "college": "IIT Delhi",
        "department": "ECE",
        "year": "3rd Year",
        "skills": ["Python"]
    })
    assert status == 201
    token_b = res_b["access_token"]
    auth_b = {"Authorization": f"Bearer {token_b}"}
    print(f"[OK] User B created: {res_b['user']['id']}")

    # 3. Create Resume for User A
    print("\n[2] Create Resume via POST /api/resumes...")
    status, res = make_request("/resumes", method="POST", data={
        "name": "SDE_2026_FullStack",
        "target_role": "Senior Full Stack Engineer",
        "experience_level": "Mid Level",
        "template": "modern"
    }, headers=auth_a)
    assert status == 201, f"Failed create resume: {res}"
    resume_id = res["id"]
    print(f"[OK] Resume created: ID={resume_id}, Name={res['name']}")

    # 4. List Resumes for User A
    print("\n[3] List Resumes via GET /api/resumes...")
    status, res = make_request("/resumes", method="GET", headers=auth_a)
    assert status == 200
    assert len(res) == 1
    assert res[0]["id"] == resume_id
    print(f"[OK] User A resume count: {len(res)}")

    # 5. Fetch Dashboard Data
    print("\n[4] Get Dashboard via GET /api/resumes/dashboard...")
    status, res = make_request("/resumes/dashboard", method="GET", headers=auth_a)
    assert status == 200
    assert res["total_resumes"] == 1
    print(f"[OK] Dashboard stats: Total={res['total_resumes']}, AvgComp={res['average_completion']}%")

    # 6. Fetch Single Resume
    print("\n[5] Fetch Resume via GET /api/resumes/{id}...")
    status, res = make_request(f"/resumes/{resume_id}", method="GET", headers=auth_a)
    assert status == 200
    assert res["id"] == resume_id
    assert res["target_role"] == "Senior Full Stack Engineer"
    print(f"[OK] Fetched resume details successfully")

    # 7. Update Resume (Autosave endpoint)
    print("\n[6] Update Resume via PUT /api/resumes/{id}...")
    status, res = make_request(f"/resumes/{resume_id}", method="PUT", data={
        "summary": "Senior Full Stack Engineer with 3+ years experience in React, Node.js, FastAPI, and MongoDB.",
        "personal_info": {
            "full_name": "Harini Muthuvel",
            "email": email_a,
            "phone": "+91 98765 43210",
            "location": "Chennai, TN",
            "github": "github.com/harini-m",
            "linkedin": "linkedin.com/in/harini-m",
            "portfolio": "harinimuthuvel.dev"
        }
    }, headers=auth_a)
    assert status == 200
    assert res["summary"] == "Senior Full Stack Engineer with 3+ years experience in React, Node.js, FastAPI, and MongoDB."
    assert res["personal_info"]["full_name"] == "Harini Muthuvel"
    assert res["completion_percentage"] > 0
    assert res["version"] == 2
    print(f"[OK] Resume updated: Completion={res['completion_percentage']}%, Version={res['version']}")

    # 8. Duplicate Resume
    print("\n[7] Duplicate Resume via POST /api/resumes/{id}/duplicate...")
    status, dup_res = make_request(f"/resumes/{resume_id}/duplicate", method="POST", headers=auth_a)
    assert status == 201
    dup_id = dup_res["id"]
    assert dup_id != resume_id
    assert dup_res["name"] == "SDE_2026_FullStack (Copy)"
    print(f"[OK] Duplicated resume: ID={dup_id}")

    # 9. Modify Duplicate independently
    print("\n[8] Modify Duplicate Resume...")
    status, _ = make_request(f"/resumes/{dup_id}", method="PUT", data={"name": "SDE_2026_Frontend"}, headers=auth_a)
    assert status == 200

    # Verify Original is unchanged
    status, orig_res = make_request(f"/resumes/{resume_id}", method="GET", headers=auth_a)
    assert status == 200
    assert orig_res["name"] == "SDE_2026_FullStack"
    print("[OK] Original resume unchanged after duplicate modification")

    # 10. Security Test over live HTTP
    print("\n[9] Security Isolation Test: User B accessing User A's resume...")
    status, sec_res = make_request(f"/resumes/{resume_id}", method="GET", headers=auth_b)
    assert status == 404
    print("[OK] Security isolation verified: User B received 404")

    # 11. Delete Duplicate
    print("\n[10] Delete Resume via DELETE /api/resumes/{id}...")
    status, _ = make_request(f"/resumes/{dup_id}", method="DELETE", headers=auth_a)
    assert status == 204
    print("[OK] Duplicate deleted successfully")

    # Verify count after delete
    status, res = make_request("/resumes", method="GET", headers=auth_a)
    assert status == 200
    assert len(res) == 1
    print("[OK] Dashboard count after delete verified: 1 resume remaining")

    print("\n====================================================")
    print(" ALL LIVE NETWORK HTTP INTEGRATION TESTS PASSED 100%! ")
    print("====================================================\n")

if __name__ == "__main__":
    run_live_http_tests()
