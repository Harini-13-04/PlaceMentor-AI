import urllib.request
import urllib.error
import json
import unittest
import uuid

BASE_URL = "http://127.0.0.1:8000"


def http_post(path: str, body: dict, token: str = None) -> tuple[int, dict]:
    url = f"{BASE_URL}{path}"
    data = json.dumps(body).encode("utf-8")
    req = urllib.request.Request(url, data=data, headers={"Content-Type": "application/json"}, method="POST")
    if token:
        req.add_header("Authorization", f"Bearer {token}")
    try:
        with urllib.request.urlopen(req) as resp:
            content = resp.read().decode("utf-8")
            return resp.status, json.loads(content) if content else {}
    except urllib.error.HTTPError as e:
        content = e.read().decode("utf-8")
        try:
            return e.code, json.loads(content) if content else {}
        except Exception:
            return e.code, {"detail": content}


def http_get(path: str, token: str = None) -> tuple[int, dict]:
    url = f"{BASE_URL}{path}"
    req = urllib.request.Request(url, method="GET")
    if token:
        req.add_header("Authorization", f"Bearer {token}")
    try:
        with urllib.request.urlopen(req) as resp:
            content = resp.read().decode("utf-8")
            return resp.status, json.loads(content) if content else {}
    except urllib.error.HTTPError as e:
        content = e.read().decode("utf-8")
        try:
            return e.code, json.loads(content) if content else {}
        except Exception:
            return e.code, {"detail": content}


def http_put(path: str, body: dict, token: str = None) -> tuple[int, dict]:
    url = f"{BASE_URL}{path}"
    data = json.dumps(body).encode("utf-8")
    req = urllib.request.Request(url, data=data, headers={"Content-Type": "application/json"}, method="PUT")
    if token:
        req.add_header("Authorization", f"Bearer {token}")
    try:
        with urllib.request.urlopen(req) as resp:
            content = resp.read().decode("utf-8")
            return resp.status, json.loads(content) if content else {}
    except urllib.error.HTTPError as e:
        content = e.read().decode("utf-8")
        try:
            return e.code, json.loads(content) if content else {}
        except Exception:
            return e.code, {"detail": content}


def http_delete(path: str, token: str = None) -> tuple[int, dict]:
    url = f"{BASE_URL}{path}"
    req = urllib.request.Request(url, method="DELETE")
    if token:
        req.add_header("Authorization", f"Bearer {token}")
    try:
        with urllib.request.urlopen(req) as resp:
            content = resp.read().decode("utf-8")
            return resp.status, json.loads(content) if content else {}
    except urllib.error.HTTPError as e:
        content = e.read().decode("utf-8")
        try:
            return e.code, json.loads(content) if content else {}
        except Exception:
            return e.code, {"detail": content}


class TestFullE2EResumeSuite(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        # 1. Register & Login User A
        cls.email_a = f"user_a_e2e_{uuid.uuid4().hex[:6]}@example.com"
        cls.password_a = "Password123!"
        status, resp = http_post("/api/auth/register", {"name": "User A E2E", "email": cls.email_a, "password": cls.password_a})
        if status != 201:
            status, resp = http_post("/api/auth/login", {"email": cls.email_a, "password": cls.password_a})
        cls.token_a = resp.get("access_token")

        # 2. Register & Login User B
        cls.email_b = f"user_b_e2e_{uuid.uuid4().hex[:6]}@example.com"
        cls.password_b = "Password123!"
        status, resp = http_post("/api/auth/register", {"name": "User B E2E", "email": cls.email_b, "password": cls.password_b})
        if status != 201:
            status, resp = http_post("/api/auth/login", {"email": cls.email_b, "password": cls.password_b})
        cls.token_b = resp.get("access_token")

        assert cls.token_a and cls.token_b, "Failed to authenticate test users"

        # Create shared test resume for User A
        status, create_res = http_post("/api/resumes", {
            "name": "FullStack_Master_Resume",
            "target_role": "Frontend Developer",
            "experience_level": "Entry Level",
            "template": "modern"
        }, cls.token_a)
        assert status == 201, f"Failed to create test resume: {create_res}"
        cls.resume_id = create_res["id"]

    def test_01_authentication_flow(self):
        """Verify JWT authentication, login/logout persistence for both users."""
        status_a, res_a = http_get("/api/resumes", self.token_a)
        self.assertEqual(status_a, 200)
        self.assertIsInstance(res_a, list)

        status_b, res_b = http_get("/api/resumes", self.token_b)
        self.assertEqual(status_b, 200)
        self.assertIsInstance(res_b, list)

    def test_02_create_and_persist_resume(self):
        """User A populates all sections, verifies MongoDB persistence."""
        resume_id = TestFullE2EResumeSuite.resume_id

        # Update full resume details
        update_payload = {
            "name": "FullStack_Master_Resume",
            "target_role": "Frontend Developer",
            "experience_level": "Entry Level",
            "template": "modern",
            "personal_info": {
                "full_name": "Harini M",
                "email": self.email_a,
                "phone": "+91 98765 43210",
                "location": "Chennai, India",
                "linkedin": "linkedin.com/in/harini",
                "github": "github.com/harini"
            },
            "summary": "Passionate Frontend Developer skilled in React, JavaScript, REST APIs, HTML5, and CSS3. Experienced in building high-performance web applications.",
            "education": [{
                "institution": "Anna University",
                "degree": "B.Tech",
                "field_of_study": "Computer Science",
                "start_date": "2021",
                "end_date": "2025",
                "current": False
            }],
            "experience": [{
                "company": "Tech Corp",
                "role": "Frontend Developer Intern",
                "start_date": "2024-01",
                "end_date": "2024-06",
                "description": "Engineered React single-page applications.",
                "bullets": ["Built responsive UI using React and JavaScript", "Optimized REST API integration and performance"]
            }],
            "skills": [
                {"category": "Languages", "skills": ["JavaScript", "Python", "HTML5", "CSS3"]},
                {"category": "Frameworks", "skills": ["React", "FastAPI", "TailwindCSS"]},
                {"category": "Tools", "skills": ["Git", "Docker", "VS Code"]}
            ],
            "projects": [{
                "name": "PlaceMentor AI Career Suite",
                "description": "Built interactive AI placement preparation platform using React and FastAPI.",
                "technologies": ["React", "FastAPI", "MongoDB"],
                "bullets": ["Integrated REST API services and responsive layouts"]
            }],
            "certifications": [{
                "name": "AWS Certified Cloud Practitioner",
                "issuer": "Amazon Web Services",
                "date": "2024"
            }]
        }

        up_status, updated_res = http_put(f"/api/resumes/{resume_id}", update_payload, self.token_a)
        self.assertEqual(up_status, 200)

        # Verify persistence via GET
        get_status, fetched_res = http_get(f"/api/resumes/{resume_id}", self.token_a)
        self.assertEqual(get_status, 200)
        self.assertEqual(fetched_res["personal_info"]["full_name"], "Harini M")
        self.assertEqual(len(fetched_res["skills"]), 3)
        self.assertEqual(len(fetched_res["projects"]), 1)

    def test_03_template_switching_persistence(self):
        """Verify template switching updates persistence without losing data."""
        resume_id = TestFullE2EResumeSuite.resume_id
        self.assertIsNotNone(resume_id)

        for template_name in ["professional", "minimal", "technical", "modern"]:
            status, res = http_put(f"/api/resumes/{resume_id}", {"template": template_name}, self.token_a)
            self.assertEqual(status, 200)
            self.assertEqual(res["template"], template_name)

    def test_04_ai_improve_service(self):
        """Verify AI Improve request returns factual-safe suggestions and persists accepted changes."""
        resume_id = TestFullE2EResumeSuite.resume_id
        status, res = http_post(f"/api/resumes/{resume_id}/improve", {
            "section": "summary",
            "original_text": "Passionate Frontend Developer skilled in React and JavaScript.",
            "improvement_goal": "action_verbs"
        }, self.token_a)
        self.assertEqual(status, 200)
        self.assertIn("original_text", res)
        self.assertIn("improved_text", res)
        self.assertIn("explanation", res)

        # Accept improvement by saving to resume
        up_status, updated_res = http_put(f"/api/resumes/{resume_id}", {"summary": res["improved_text"]}, self.token_a)
        self.assertEqual(up_status, 200)
        self.assertEqual(updated_res["summary"], res["improved_text"])

    def test_05_ats_analysis_service(self):
        """Verify 100-point ATS analysis returns category scores, strengths, issues, recommendations."""
        resume_id = TestFullE2EResumeSuite.resume_id
        status, res = http_post(f"/api/resumes/{resume_id}/ats-analysis", {}, self.token_a)
        self.assertEqual(status, 200)
        self.assertEqual(res["resume_id"], resume_id)
        self.assertTrue(0 <= res["overall_score"] <= 100)
        self.assertIn("keyword_optimization", res["categories"])
        self.assertIn("section_completeness", res["categories"])
        self.assertIn("skills_alignment", res["categories"])
        self.assertIn("experience_quality", res["categories"])
        self.assertIn("formatting", res["categories"])
        self.assertIsInstance(res["strengths"], list)
        self.assertIsInstance(res["recommendations"], list)
        if len(res["recommendations"]) > 0:
            self.assertIn("section", res["recommendations"][0])
            self.assertIn("action", res["recommendations"][0])

    def test_06_job_description_matching_service(self):
        """Verify Job Description Matching returns 0-100 score, 5 categories, matched vs missing skills."""
        resume_id = TestFullE2EResumeSuite.resume_id
        sample_jd = (
            "Frontend Developer with experience in React, TypeScript, JavaScript, REST APIs, Git and "
            "responsive web development. Experience building frontend applications and working with modern "
            "web technologies is preferred."
        )
        status, res = http_post(f"/api/resumes/{resume_id}/job-match", {"job_description": sample_jd}, self.token_a)
        self.assertEqual(status, 200)
        self.assertEqual(res["resume_id"], resume_id)
        self.assertTrue(0 <= res["overall_match_score"] <= 100)

        # 5 categories
        cats = res["categories"]
        self.assertTrue(0 <= cats["skills_match"] <= 35)
        self.assertTrue(0 <= cats["keyword_match"] <= 25)
        self.assertTrue(0 <= cats["experience_alignment"] <= 20)
        self.assertTrue(0 <= cats["project_domain_alignment"] <= 10)
        self.assertTrue(0 <= cats["education_certification_alignment"] <= 10)

        # Skill matching verification (TypeScript is missing, React/JavaScript are matched)
        self.assertIn("React", res["matched_skills"])
        self.assertIn("JavaScript", res["matched_skills"])
        self.assertIn("TypeScript", res["missing_skills"])
        self.assertNotIn("TypeScript", res["matched_skills"])

        # Safety wording in recommendations
        found_safety = False
        for rec in res["recommendations"]:
            if "potential skill gap" in rec["description"].lower() or "only address" in rec["description"].lower():
                found_safety = True
                break
        self.assertTrue(found_safety)

    def test_07_defend_your_resume_studio_service(self):
        """Verify Defend session init, Q&A loop, vague answer follow-up, and final 0-100 scorecard."""
        resume_id = TestFullE2EResumeSuite.resume_id
        # 1. Init session
        init_status, init_res = http_post(f"/api/resumes/{resume_id}/defend/init", {}, self.token_a)
        self.assertEqual(init_status, 200)
        session_id = init_res["session_id"]
        first_claim_id = init_res["first_claim_id"]
        self.assertIsNotNone(first_claim_id)

        # 2. Vague answer -> triggers follow-up
        ans1_status, ans1_res = http_post(f"/api/resumes/{resume_id}/defend/answer", {
            "session_id": session_id,
            "claim_id": first_claim_id,
            "user_answer": "I made the code fast and optimized it."
        }, self.token_a)
        self.assertEqual(ans1_status, 200)
        self.assertTrue(ans1_res["needs_followup"])
        self.assertIsNotNone(ans1_res["followup_question"])

        # 3. Detailed follow-up answer
        ans2_status, ans2_res = http_post(f"/api/resumes/{resume_id}/defend/answer", {
            "session_id": session_id,
            "claim_id": first_claim_id,
            "user_answer": "Specifically, I configured Redis TTL caching for backend API endpoints and memoized heavy React rendering components.",
            "is_followup": True
        }, self.token_a)
        self.assertEqual(ans2_status, 200)
        self.assertFalse(ans2_res["needs_followup"])

        # 4. Complete remaining claims
        curr_claim_id = ans2_res.get("next_claim_id")
        while curr_claim_id and not ans2_res.get("is_complete"):
            status, ans2_res = http_post(f"/api/resumes/{resume_id}/defend/answer", {
                "session_id": session_id,
                "claim_id": curr_claim_id,
                "user_answer": "I implemented modular architecture using Docker containers and clean separation of concerns."
            }, self.token_a)
            self.assertEqual(status, 200)
            curr_claim_id = ans2_res.get("next_claim_id")

        final_rep = ans2_res.get("final_report")
        self.assertIsNotNone(final_rep)
        self.assertTrue(0 <= final_rep["overall_defensibility_score"] <= 100)
        self.assertIsInstance(final_rep["strong_claims"], list)
        self.assertIsInstance(final_rep["suggested_prep_topics"], list)

    def test_08_security_and_ownership_isolation(self):
        """MANDATORY SECURITY TEST: Verify User B cannot access User A's resume data across all endpoints."""
        resume_id = TestFullE2EResumeSuite.resume_id
        self.assertIsNotNone(resume_id)

        # GET User A resume as User B -> 404
        status, _ = http_get(f"/api/resumes/{resume_id}", self.token_b)
        self.assertEqual(status, 404)

        # PUT User A resume as User B -> 404
        status, _ = http_put(f"/api/resumes/{resume_id}", {"name": "Hacked Resume"}, self.token_b)
        self.assertEqual(status, 404)

        # DELETE User A resume as User B -> 404
        status, _ = http_delete(f"/api/resumes/{resume_id}", self.token_b)
        self.assertEqual(status, 404)

        # Duplicate User A resume as User B -> 404
        status, _ = http_post(f"/api/resumes/{resume_id}/duplicate", {}, self.token_b)
        self.assertEqual(status, 404)

        # Improve User A resume as User B -> 404
        status, _ = http_post(f"/api/resumes/{resume_id}/improve", {"section": "summary", "original_text": "test"}, self.token_b)
        self.assertEqual(status, 404)

        # ATS Analysis on User A resume as User B -> 404
        status, _ = http_post(f"/api/resumes/{resume_id}/ats-analysis", {}, self.token_b)
        self.assertEqual(status, 404)

        # Job Match on User A resume as User B -> 404
        status, _ = http_post(f"/api/resumes/{resume_id}/job-match", {"job_description": "test requirement"}, self.token_b)
        self.assertEqual(status, 404)

        # Defend Init on User A resume as User B -> 404
        status, _ = http_post(f"/api/resumes/{resume_id}/defend/init", {}, self.token_b)
        self.assertEqual(status, 404)

        # Defend Answer on User A resume as User B -> 404
        status, _ = http_post(f"/api/resumes/{resume_id}/defend/answer", {"session_id": "dummy", "claim_id": "dummy", "user_answer": "test"}, self.token_b)
        self.assertEqual(status, 404)

    def test_09_duplicate_and_delete(self):
        """User A duplicates resume, edits duplicate, verifies original unchanged, deletes duplicate."""
        resume_id = TestFullE2EResumeSuite.resume_id
        # Duplicate
        status, dup_res = http_post(f"/api/resumes/{resume_id}/duplicate", {}, self.token_a)
        self.assertEqual(status, 201)
        dup_id = dup_res["id"]

        # Edit duplicate
        http_put(f"/api/resumes/{dup_id}", {"name": "Cloned Resume Modified"}, self.token_a)

        # Verify original unchanged
        _, orig_res = http_get(f"/api/resumes/{resume_id}", self.token_a)
        self.assertEqual(orig_res["name"], "FullStack_Master_Resume")

        # Delete duplicate
        del_status, _ = http_delete(f"/api/resumes/{dup_id}", self.token_a)
        self.assertEqual(del_status, 204)

        # Verify duplicate deleted
        get_status, _ = http_get(f"/api/resumes/{dup_id}", self.token_a)
        self.assertEqual(get_status, 404)

    def test_10_validation_and_error_states(self):
        """Verify invalid inputs return HTTP 422 or 404."""
        # Empty name -> 422
        status, _ = http_post("/api/resumes", {"name": "", "target_role": "Dev"}, self.token_a)
        self.assertEqual(status, 422)

        # Empty target role -> 422
        status, _ = http_post("/api/resumes", {"name": "Test", "target_role": ""}, self.token_a)
        self.assertEqual(status, 422)

        resume_id = TestFullE2EResumeSuite.resume_id
        # Empty JD -> 422
        status, _ = http_post(f"/api/resumes/{resume_id}/job-match", {"job_description": "   "}, self.token_a)
        self.assertEqual(status, 422)

        # Oversized JD -> 422
        status, _ = http_post(f"/api/resumes/{resume_id}/job-match", {"job_description": "a" * 25000}, self.token_a)
        self.assertEqual(status, 422)

        # Empty defend answer -> 422
        status, _ = http_post(f"/api/resumes/{resume_id}/defend/answer", {"session_id": "dummy", "claim_id": "dummy", "user_answer": ""}, self.token_a)
        self.assertEqual(status, 422)


if __name__ == "__main__":
    unittest.main()
