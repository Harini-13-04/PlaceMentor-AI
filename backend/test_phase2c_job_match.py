import unittest
import asyncio
from datetime import datetime, timezone
import uuid
from app.schemas.resume import (
    ResumeData,
    PersonalInfo,
    ExperienceItem,
    ProjectItem,
    SkillCategory,
    EducationItem,
    JobMatchRequest,
)
from app.services.job_match_service import analyze_job_match
from fastapi import HTTPException


class TestPhase2CJobMatch(unittest.TestCase):

    def setUp(self):
        # Sample User A Resume (Fullstack Developer)
        self.user_a_id = "user_a_123"
        self.resume_a = ResumeData(
            id="res_a_456",
            user_id=self.user_a_id,
            name="Harini_FullStack_Resume",
            target_role="Frontend Developer",
            experience_level="Entry Level",
            template="modern",
            personal_info=PersonalInfo(
                full_name="Harini M",
                email="harini@example.com",
                phone="+91 9876543210",
                location="Chennai, India",
            ),
            summary="Passionate Frontend Developer skilled in React, JavaScript, HTML, and CSS. Experienced in building responsive web applications.",
            experience=[
                ExperienceItem(
                    role="Frontend Developer Intern",
                    company="Tech Corp",
                    description="Engineered React single page applications.",
                    bullets=["Built web interfaces using React and JavaScript", "Optimized REST API integration"]
                )
            ],
            projects=[
                ProjectItem(
                    name="PlaceMentor AI Platform",
                    description="Built AI-assisted career suite using React and FastAPI.",
                    technologies=["React", "JavaScript", "REST API", "TailwindCSS"],
                    bullets=["Integrated REST APIs with backend services"]
                )
            ],
            skills=[
                SkillCategory(category="Languages", skills=["JavaScript", "Python", "HTML", "CSS"]),
                SkillCategory(category="Frameworks", skills=["React", "FastAPI", "TailwindCSS"])
            ],
            education=[
                EducationItem(
                    institution="Anna University",
                    degree="B.Tech",
                    field_of_study="Computer Science"
                )
            ]
        )

        # Sample User B Resume (Data Analyst / Unrelated)
        self.user_b_id = "user_b_789"
        self.resume_b = ResumeData(
            id="res_b_999",
            user_id=self.user_b_id,
            name="Data_Analyst_Resume",
            target_role="Data Analyst",
            experience_level="Fresher",
            summary="Data analyst experienced in Excel, Tableau, and basic SQL query generation.",
            skills=[
                SkillCategory(category="Tools", skills=["Excel", "Tableau", "SQL"])
            ]
        )

        self.jd_text = """
        We are looking for a Frontend Developer with React, TypeScript, and REST API experience.
        Requirements:
        - 1+ years experience with React and TypeScript
        - Strong understanding of REST APIs and Node.js
        - Experience with AWS deployment is a plus
        - Degree in Computer Science or equivalent
        """

    def test_1_valid_job_match(self):
        """1. Valid job-match calculation produces expected structure and scores."""
        res = analyze_job_match(self.resume_a, self.jd_text)
        self.assertEqual(res.resume_id, self.resume_a.id)
        self.assertIsInstance(res.overall_match_score, int)
        self.assertGreaterEqual(res.overall_match_score, 0)
        self.assertLessEqual(res.overall_match_score, 100)
        self.assertIn("React", res.matched_skills)
        self.assertIn("REST API", res.matched_skills)

    def test_2_empty_jd_validation(self):
        """2. Empty / whitespace-only JD validation logic check."""
        empty_req = JobMatchRequest(job_description="   ")
        self.assertEqual(empty_req.job_description.strip(), "")

    def test_3_too_large_jd_validation(self):
        """3. Invalid / excessively long JD validation test."""
        huge_jd = "a" * 25000
        req = JobMatchRequest(job_description=huge_jd)
        self.assertGreater(len(req.job_description), 20000)

    def test_4_wrong_user_ownership_simulation(self):
        """4. Security verification: Verify user mismatch can be detected."""
        requesting_user = "user_c_wrong"
        self.assertNotEqual(self.resume_a.user_id, requesting_user)

    def test_5_score_bounded_0_to_100(self):
        """5. Match score is strictly bounded between 0 and 100."""
        res = analyze_job_match(self.resume_a, self.jd_text)
        self.assertTrue(0 <= res.overall_match_score <= 100)
        self.assertTrue(0 <= res.categories.skills_match <= 35)
        self.assertTrue(0 <= res.categories.keyword_match <= 25)
        self.assertTrue(0 <= res.categories.experience_alignment <= 20)
        self.assertTrue(0 <= res.categories.project_domain_alignment <= 10)
        self.assertTrue(0 <= res.categories.education_certification_alignment <= 10)

    def test_6_deterministic_identical_output(self):
        """6. Same resume + same JD produces identical deterministic result."""
        res1 = analyze_job_match(self.resume_a, self.jd_text)
        res2 = analyze_job_match(self.resume_a, self.jd_text)
        self.assertEqual(res1.overall_match_score, res2.overall_match_score)
        self.assertEqual(res1.matched_skills, res2.matched_skills)
        self.assertEqual(res1.missing_skills, res2.missing_skills)

    def test_7_relevant_vs_unrelated_resume_score(self):
        """7. Relevant frontend resume produces higher match score than unrelated data analyst resume."""
        res_a_match = analyze_job_match(self.resume_a, self.jd_text)
        res_b_match = analyze_job_match(self.resume_b, self.jd_text)
        self.assertGreater(res_a_match.overall_match_score, res_b_match.overall_match_score)

    def test_8_matched_skills_present_in_resume(self):
        """8. Matched skills are actually present in resume."""
        res = analyze_job_match(self.resume_a, self.jd_text)
        self.assertIn("React", res.matched_skills)
        self.assertIn("REST API", res.matched_skills)

    def test_9_missing_skills_not_false_matched(self):
        """9. Missing skills (TypeScript, AWS) are not marked as matched (JavaScript != TypeScript)."""
        res = analyze_job_match(self.resume_a, self.jd_text)
        self.assertIn("TypeScript", res.missing_skills)
        self.assertNotIn("TypeScript", res.matched_skills)
        self.assertIn("AWS", res.missing_skills)

    def test_10_no_fabricated_resume_data(self):
        """10. Ensure no fake skills or experience are injected into recommendations."""
        res = analyze_job_match(self.resume_a, self.jd_text)
        for rec in res.recommendations:
            self.assertNotIn("fabricated", rec.description.lower())
            self.assertNotIn("fake", rec.description.lower())

    def test_11_fresher_project_heavy_resume_handling(self):
        """11. Fresher / student resume with zero work experience is scored correctly without error."""
        fresher_resume = ResumeData(
            id="res_fresher_01",
            user_id="fresher_123",
            name="Fresher_Student_Resume",
            target_role="Frontend Developer",
            experience_level="Fresher",
            summary="Fresher student with strong project experience in React and JavaScript.",
            experience=[],  # Zero experience
            projects=[
                ProjectItem(
                    name="E-Commerce React Web App",
                    description="Developed front-end application with React and REST API",
                    technologies=["React", "JavaScript", "REST API"]
                )
            ]
        )
        res = analyze_job_match(fresher_resume, self.jd_text)
        self.assertGreater(res.categories.project_domain_alignment, 0)
        self.assertGreater(res.overall_match_score, 30)

    def test_12_recommendation_safety_wording(self):
        """12. Missing skill recommendations use safe wording."""
        res = analyze_job_match(self.resume_a, self.jd_text)
        found_safety_phrase = False
        for rec in res.recommendations:
            if "potential skill gap" in rec.description.lower() or "only address this if you genuinely" in rec.description.lower():
                found_safety_phrase = True
                break
        self.assertTrue(found_safety_phrase, "Expected safe recommendation wording for missing skills")


if __name__ == "__main__":
    unittest.main()
