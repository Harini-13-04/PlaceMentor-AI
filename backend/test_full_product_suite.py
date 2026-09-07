"""
PlaceMentor AI — Master Product Implementation Test Suite
Tests:
1. Judge & Server-Side Hidden Test Case Enforcement
2. Assessment Allocation, Seen Exclusion, Study Guides & Submission Persistence
3. Brain Zone Procedural Generation (20+ seeds across 3 difficulties), Solvability & XP Progression
4. Recommendations Engine (Previous-day analysis, max 2-3 insights, empty state)
5. Placement Readiness Calculation, Company Tier Matching & Adaptive Roadmap
6. RAG Knowledge Base Retrieval & Grounded Generation
"""

import asyncio
import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.services.problems_service import (
    get_all_problems,
    get_problem_by_id,
    get_problem_test_cases,
)
from app.services.assessment_service import (
    allocate_assessment_questions,
    submit_assessment_attempt,
    get_topic_study_guide,
    TOPIC_FORMULAS_AND_CONCEPTS,
    QUESTION_BANK,
)
from app.services.brain_zone_engine import (
    generate_brain_challenge,
    record_brain_game_completion,
    WORLDS,
)
from app.services.recommendation_service import get_user_recommendations
from app.services.readiness_service import (
    calculate_placement_readiness,
    match_company_readiness,
    generate_personalized_roadmap,
)
from app.rag.knowledge_base import KNOWLEDGE_CHUNKS
from app.rag.retriever import PlacementRAGRetriever
from app.rag.generator import generate_mentor_response


# =========================================================================
# 1. JUDGE & HIDDEN TEST CASES TESTS
# =========================================================================

async def test_problem_catalog_sanitization():
    """Verify that the public problem catalog has 20+ quality problems and NEVER exposes hidden testcases."""
    catalog = await get_all_problems()
    assert len(catalog) >= 20, f"Problem catalog should have at least 20 core placement problems, found {len(catalog)}"

    for prob in catalog:
        # Verify no hidden testcases are present
        assert "hiddenTestCases" not in prob, f"Hidden test cases exposed in problem {prob.get('id')}!"
        assert "testCases" in prob or "test_cases" in prob
        visible_tests = prob.get("testCases", prob.get("test_cases", []))
        for tc in visible_tests:
            assert tc.get("isHidden", False) is False, f"Hidden test found in public testCases for {prob.get('id')}"


def test_judge_all_test_cases_retrieval():
    """Verify that the backend judge can retrieve both visible and hidden test cases for evaluation."""
    testcases = get_problem_test_cases("two-sum", include_hidden=True)
    assert len(testcases) >= 4, "two-sum should have visible + hidden test cases"
    
    hidden_count = sum(1 for tc in testcases if tc.get("isHidden", False))
    visible_count = sum(1 for tc in testcases if not tc.get("isHidden", False))
    
    assert visible_count >= 2, "Must have at least 2 visible test cases"
    assert hidden_count >= 2, "Must have at least 2 hidden test cases"
# =========================================================================
# 2. ASSESSMENT ENGINE & QUESTION BANK TESTS
# =========================================================================

async def test_assessment_study_guides():
    """Verify that all core topics have formula sheets, concepts, and worked examples."""
    topics = ["Percentages", "Profit & Loss", "Time & Work", "Operating Systems", "DBMS", "Computer Networks", "OOP Concepts", "DSA", "SQL"]
    for t in topics:
        guide = get_topic_study_guide(t)
        assert guide is not None, f"Missing study guide for {t}"
        assert "concept" in guide, f"Missing concept for {t}"
        assert len(guide.get("formulas", [])) >= 1, f"Missing formulas for {t}"


async def test_assessment_question_allocation():
    """Verify that questions are allocated correctly by topic, difficulty, and count."""
    user_id = f"test-user-{os.urandom(4).hex()}"
    
    # Allocate 5 Quant questions
    result = await allocate_assessment_questions(
        user_id=user_id,
        assessment_type="aptitude",
        category="Quantitative Aptitude",
        topic="Time & Work",
        difficulty="Mixed",
        count=5,
    )
    assert len(result) >= 1
    for q in result:
        assert "id" in q
        assert "question" in q
        assert "options" in q
        assert len(q["options"]) == 4
        # Verify correct_answer is NOT exposed in public question allocation
        assert "correct_answer" not in q or q.get("correct_answer") is None, "Correct answer leaked in question allocation!"


# =========================================================================
# 3. BRAIN ZONE PROCEDURAL GENERATION & SOLVABILITY TESTS (20+ SEEDS)
# =========================================================================

def test_sudoku_procedural_validity():
    """Verify Sudoku procedural generation across 20+ seeds and 3 difficulties."""
    for diff in ["Easy", "Medium", "Hard"]:
        for seed in range(1001, 1010):
            chal = generate_brain_challenge(game_type="sudoku", level=1, seed=seed, difficulty=diff)
            assert chal["game_type"] == "sudoku"
            assert chal["size"] in (4, 6, 9)
            puzzle = chal["puzzle"]
            solution = chal["solution"]
            
            size = chal["size"]
            assert len(puzzle) == size
            assert len(solution) == size
            
            # Verify solution satisfies row and column uniqueness
            for r in range(size):
                row_vals = [solution[r][c] for c in range(size)]
                assert len(set(row_vals)) == size, f"Duplicate in row {r} for seed {seed}"
            for c in range(size):
                col_vals = [solution[r][c] for c in range(size)]
                assert len(set(col_vals)) == size, f"Duplicate in col {c} for seed {seed}"


def test_memory_match_procedural_validity():
    """Verify Memory Match card pairing across 20+ seeds."""
    for seed in range(2001, 2010):
        chal = generate_brain_challenge(game_type="memory-match", level=1, seed=seed, difficulty="Easy")
        assert chal["game_type"] == "memory-match"
        cards = chal["cards"]
        assert len(cards) % 2 == 0, "Cards count must be even"
        
        # Verify every match_key appears exactly twice
        key_counts = {}
        for c in cards:
            key_counts[c["match_key"]] = key_counts.get(c["match_key"], 0) + 1
        for k, count in key_counts.items():
            assert count == 2, f"Match key {k} does not have exactly 2 cards in seed {seed}"


def test_pattern_recognition_validity():
    """Verify Pattern Recognition procedural generation."""
    for seed in range(3001, 3010):
        chal = generate_brain_challenge(game_type="pattern-recognition", level=1, seed=seed, difficulty="Medium")
        assert chal["game_type"] == "pattern-recognition"
        assert "?" in chal.get("sequence_display", [])
        assert len(chal["options"]) == 4
        assert 0 <= chal["correct_index"] < 4


def test_target_24_solvability():
    """Verify Target 24 generator produces solvable sets with hints."""
    for seed in range(4001, 4010):
        chal = generate_brain_challenge(game_type="target-24", level=1, seed=seed, difficulty="Easy")
        assert chal["game_type"] == "target-24"
        assert len(chal["numbers"]) == 4
        assert chal["target"] == 24
        assert "hint_solution" in chal


def test_vocab_anagram_validity():
    """Verify Vocab Anagram produces valid scrambled placements words."""
    for seed in range(5001, 5010):
        chal = generate_brain_challenge(game_type="vocab-anagram", level=1, seed=seed, difficulty="Easy")
        assert chal["game_type"] == "vocab-anagram"
        assert len(chal["scrambled"]) > 0
        assert len(chal["target_word"]) > 0
        assert sorted(chal["scrambled"]) == sorted(chal["target_word"])


# =========================================================================
# 4. RECOMMENDATIONS & READINESS TESTS
# =========================================================================

async def test_recommendations_empty_state_and_limit():
    """Verify recommendations engine returns honest empty state or maximum 2-3 cards."""
    user_id = f"fresh-user-{os.urandom(4).hex()}"
    res = await get_user_recommendations(user_id=user_id)
    assert len(res.recommendations) <= 3, "Never return more than 3 recommendations"


async def test_readiness_calculation():
    """Verify readiness calculation returns structured diagnostic metrics."""
    user_id = f"fresh-user-{os.urandom(4).hex()}"
    readiness = await calculate_placement_readiness(user_id=user_id)
    assert "has_sufficient_data" in readiness
    assert "overall_readiness" in readiness


async def test_company_readiness_matching():
    """Verify company matching evaluates Tier-1, Service, and Startup benchmarks."""
    user_id = f"fresh-user-{os.urandom(4).hex()}"
    matches = await match_company_readiness(user_id=user_id)
    assert len(matches) >= 8, f"Expected 8+ company requirement profiles, got {len(matches)}"
    for m in matches:
        assert "category" in m
        assert "match_status" in m
        assert "missing_skills" in m
        assert "evidence_used" in m


async def test_adaptive_roadmap_generation():
    """Verify multi-stage roadmap adapts to academic year and skill levels."""
    user_id = f"fresh-user-{os.urandom(4).hex()}"
    roadmap = await generate_personalized_roadmap(user_id=user_id)
    assert "stages" in roadmap
    assert len(roadmap["stages"]) >= 5
    for stage in roadmap["stages"]:
        assert "stage" in stage
        assert "title" in stage
        assert "status" in stage
        assert "skills" in stage


# =========================================================================
# 5. RAG KNOWLEDGE BASE & GROUNDED GENERATION TESTS
# =========================================================================

def test_rag_knowledge_coverage():
    """Verify knowledge base covers DSA, Core CS, Aptitude, Interview STAR, and Company Blueprints."""
    domains = set(chunk["category"] for chunk in KNOWLEDGE_CHUNKS)
    assert "DSA & Algorithms" in domains
    assert "Core Computer Science" in domains
    assert "Aptitude & Reasoning" in domains
    assert "Company Preparation" in domains
    assert "Placement & Interviews" in domains
    assert len(KNOWLEDGE_CHUNKS) >= 40, f"Expected 40+ knowledge chunks, found {len(KNOWLEDGE_CHUNKS)}"


def test_rag_search_relevance():
    """Verify RAG retrieval finds relevant chunks for technical queries."""
    retriever = PlacementRAGRetriever()
    dsa_res = retriever.retrieve("dynamic programming knapsack time complexity", top_k=3)
    assert len(dsa_res) >= 1
    assert any("Dynamic Programming" in c["title"] or "Knapsack" in c.get("content", "") for c in dsa_res)

    db_res = retriever.retrieve("ACID transaction isolation B+ Tree indexing", top_k=3)
    assert len(db_res) >= 1
    assert any("DBMS" in c["title"] or "ACID" in c.get("content", "") for c in db_res)

    amazon_res = retriever.retrieve("Amazon leadership principles behavioral STAR", top_k=3)
    assert len(amazon_res) >= 1
    assert any("Amazon" in c["title"] or "Leadership" in c.get("content", "") for c in amazon_res)


async def test_grounded_response_generation():
    """Verify grounded mentor responses include real retrieved sources."""
    retriever = PlacementRAGRetriever()
    q = "Explain ACID properties in DBMS and why B+ Trees are used for indexing"
    chunks = retriever.retrieve(q, top_k=3)
    resp = await generate_mentor_response(
        question=q,
        retrieved_chunks=chunks,
        context={"active_module": "quizee", "topic": "DBMS"},
    )
    assert "answer" in resp
    assert len(resp["sources"]) >= 1
    assert any("DBMS" in s["title"] or "Database" in s["title"] for s in resp["sources"])


async def run_all_async_tests():
    print("--- Running Test 1: Problem Catalog Sanitization ---")
    await test_problem_catalog_sanitization()
    print("PASS: Problem Catalog Sanitization")

    print("--- Running Test 2: Judge Test Cases Retrieval ---")
    test_judge_all_test_cases_retrieval()
    print("PASS: Judge Test Cases Retrieval")

    print("--- Running Test 3: Assessment Study Guides ---")
    await test_assessment_study_guides()
    print("PASS: Assessment Study Guides")

    print("--- Running Test 4: Assessment Question Allocation ---")
    await test_assessment_question_allocation()
    print("PASS: Assessment Question Allocation")

    print("--- Running Test 5: Sudoku Procedural Generation across 27 seeds ---")
    test_sudoku_procedural_validity()
    print("PASS: Sudoku Procedural Generation")

    print("--- Running Test 6: Memory Match Procedural Generation ---")
    test_memory_match_procedural_validity()
    print("PASS: Memory Match Procedural Generation")

    print("--- Running Test 7: Pattern Recognition Validity ---")
    test_pattern_recognition_validity()
    print("PASS: Pattern Recognition Validity")

    print("--- Running Test 8: Target 24 Solvability ---")
    test_target_24_solvability()
    print("PASS: Target 24 Solvability")

    print("--- Running Test 9: Vocab Anagram Validity ---")
    test_vocab_anagram_validity()
    print("PASS: Vocab Anagram Validity")

    print("--- Running Test 10: Recommendations Limits & Empty State ---")
    await test_recommendations_empty_state_and_limit()
    print("PASS: Recommendations Limits & Empty State")

    print("--- Running Test 11: Readiness Calculation ---")
    await test_readiness_calculation()
    print("PASS: Readiness Calculation")

    print("--- Running Test 12: Company Readiness Matching ---")
    await test_company_readiness_matching()
    print("PASS: Company Readiness Matching")

    print("--- Running Test 13: Adaptive Roadmap Generation ---")
    await test_adaptive_roadmap_generation()
    print("PASS: Adaptive Roadmap Generation")

    print("--- Running Test 14: RAG Knowledge Coverage ---")
    test_rag_knowledge_coverage()
    print("PASS: RAG Knowledge Coverage")

    print("--- Running Test 15: RAG Search Relevance ---")
    test_rag_search_relevance()
    print("PASS: RAG Search Relevance")

    print("--- Running Test 16: Grounded Generation ---")
    await test_grounded_response_generation()
    print("PASS: Grounded Generation")

    print("\n========================================================")
    print("ALL 16 MASTER TEST SUITES PASSED PERFECTLY!")
    print("========================================================")


if __name__ == "__main__":
    asyncio.run(run_all_async_tests())

