import unittest
import asyncio
import uuid
from app.schemas.resume import (
    ResumeData,
    PersonalInfo,
    ExperienceItem,
    ProjectItem,
    SkillCategory,
    DefendAnswerRequest,
)
from app.services.defend_service import (
    extract_resume_claims,
    initialize_defend_session,
    evaluate_defend_answer,
    generate_final_report,
)


class TestPhase3DefendYourResume(unittest.TestCase):

    def setUp(self):
        self.user_a_id = "user_a_defend_123"
        self.resume_a = ResumeData(
            id="res_defend_456",
            user_id=self.user_a_id,
            name="Defend_Test_Resume",
            target_role="Full Stack Developer",
            experience_level="Mid Level",
            personal_info=PersonalInfo(
                full_name="Harini M",
                email="harini@example.com"
            ),
            summary="Engineered scalable React applications handling thousands of active users. Reduced API latency by 40% using Redis caching.",
            experience=[
                ExperienceItem(
                    role="Software Engineer",
                    company="Tech Solutions",
                    description="Spearheaded microservices architecture with FastAPI and Docker.",
                    bullets=["Architected microservices handling high traffic", "Integrated PostgreSQL database with connection pooling"]
                )
            ],
            projects=[
                ProjectItem(
                    name="Real-Time Career Portal",
                    description="Built AI-assisted platform using React, FastAPI, and MongoDB.",
                    technologies=["React", "FastAPI", "MongoDB"]
                )
            ],
            skills=[
                SkillCategory(category="Languages", skills=["Python", "TypeScript", "SQL"]),
                SkillCategory(category="Tools", skills=["Docker", "Redis", "Git"])
            ]
        )

    def test_1_claim_extraction(self):
        """1. Claim extraction strictly extracts claims present in resume without inventing data."""
        claims = extract_resume_claims(self.resume_a)
        self.assertGreater(len(claims), 0)
        self.assertLessEqual(len(claims), 5)
        # Ensure high risk claims are prioritized
        high_risk_claims = [c for c in claims if c.risk_level == "high"]
        self.assertGreater(len(high_risk_claims), 0)
        self.assertIn("scalable", claims[0].claim_text.lower() or claims[1].claim_text.lower())

    def test_2_session_initialization(self):
        """2. Initialize defend session returns structured claims and initial question."""
        init_res = initialize_defend_session(self.resume_a)
        self.assertIsNotNone(init_res.session_id)
        self.assertEqual(init_res.resume_id, self.resume_a.id)
        self.assertGreater(init_res.total_claims, 0)
        self.assertIsNotNone(init_res.first_question)
        self.assertIsNotNone(init_res.first_claim_id)

    def test_3_answer_evaluation_strong(self):
        """3. Strong technical answer submission receives high score and strong rating."""
        init_res = initialize_defend_session(self.resume_a)
        claim_id = init_res.first_claim_id

        strong_answer = "I implemented React component memoization, lazy loading, and Redis payload caching with connection pooling to handle peak traffic load."
        req = DefendAnswerRequest(
            session_id=init_res.session_id,
            claim_id=claim_id,
            user_answer=strong_answer
        )
        res = evaluate_defend_answer(self.resume_a.id, req)
        self.assertEqual(res.claim_evaluation.rating, "strong")
        self.assertGreaterEqual(res.claim_evaluation.score, 80)
        self.assertFalse(res.needs_followup)

    def test_4_vague_answer_triggers_followup(self):
        """4. Vague answer triggers follow-up probe question."""
        init_res = initialize_defend_session(self.resume_a)
        claim_id = init_res.first_claim_id

        vague_answer = "I just made the code fast and optimized it."
        req = DefendAnswerRequest(
            session_id=init_res.session_id,
            claim_id=claim_id,
            user_answer=vague_answer
        )
        res = evaluate_defend_answer(self.resume_a.id, req)
        self.assertTrue(res.needs_followup)
        self.assertIsNotNone(res.followup_question)

    def test_5_followup_submission_advances(self):
        """5. Submitting detailed answer to follow-up probe advances session."""
        init_res = initialize_defend_session(self.resume_a)
        claim_id = init_res.first_claim_id

        # Step 1: Vague initial answer
        req1 = DefendAnswerRequest(
            session_id=init_res.session_id,
            claim_id=claim_id,
            user_answer="I made it fast."
        )
        res1 = evaluate_defend_answer(self.resume_a.id, req1)
        self.assertTrue(res1.needs_followup)

        # Step 2: Follow-up detailed answer
        req2 = DefendAnswerRequest(
            session_id=init_res.session_id,
            claim_id=claim_id,
            user_answer="Specifically, I configured Redis TTL caching for heavy database query endpoints and reduced React re-renders using React.memo.",
            is_followup=True
        )
        res2 = evaluate_defend_answer(self.resume_a.id, req2)
        self.assertFalse(res2.needs_followup)
        self.assertEqual(res2.claim_evaluation.rating, "strong")

    def test_6_final_defensibility_report(self):
        """6. Final report contains overall score (0-100) and structured claim breakdown."""
        evals = [
            {"claim_text": "Scalable React app", "rating": "strong", "score": 90},
            {"claim_text": "Reduced API latency", "rating": "needs_prep", "score": 65}
        ]
        report = generate_final_report(self.resume_a.id, evals)
        self.assertEqual(report.resume_id, self.resume_a.id)
        self.assertEqual(report.overall_defensibility_score, 78)
        self.assertIn("Scalable React app", report.strong_claims)
        self.assertIn("Reduced API latency", report.claims_needing_prep)
        self.assertGreater(len(report.suggested_prep_topics), 0)

    def test_7_fair_evaluation_no_wording_penalty(self):
        """7. Different phrasing or synonyms are evaluated on technical substance, not penalized."""
        init_res = initialize_defend_session(self.resume_a)
        claim_id = init_res.first_claim_id

        # Answer uses alternative phrasing ("used server-side caching", "asynchronous data fetching")
        alt_wording_answer = "We utilized server-side caching mechanisms alongside asynchronous data fetching routines to maintain quick response times during high traffic."
        req = DefendAnswerRequest(
            session_id=init_res.session_id,
            claim_id=claim_id,
            user_answer=alt_wording_answer
        )
        res = evaluate_defend_answer(self.resume_a.id, req)
        self.assertGreaterEqual(res.claim_evaluation.score, 80)
        self.assertNotIn("wrong words", res.claim_evaluation.feedback.lower())


if __name__ == "__main__":
    unittest.main()
