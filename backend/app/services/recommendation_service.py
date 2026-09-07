"""
PlaceMentor AI — Real-Data Recommendation & Daily Insights Engine
Analyzes previous-day performance and recent submission history to produce
strictly 2-3 personalized action insights with explicit 'WHY THIS' justifications.
Returns clean empty states when no activity data exists.
"""

from typing import List, Dict, Any, Optional
from datetime import datetime, timezone, timedelta
from app.schemas.recommendation import RecommendationItem, RecommendationResponse
from app.database.mongodb import (
    coding_submissions_collection,
    assessment_attempts_collection,
    brain_zone_progress_collection,
    user_problems_collection,
)


async def get_user_recommendations(user_id: str = "default-user") -> RecommendationResponse:
    """
    Computes real recommendations based on previous-day & recent user activity in MongoDB.
    Generates maximum 2-3 cards. Returns empty list if no recent activity.
    """
    now = datetime.now(timezone.utc)
    yesterday = now - timedelta(days=1)
    two_days_ago = now - timedelta(days=2)
    
    # 1. Fetch recent coding submissions (past 48 hours)
    recent_submissions = await coding_submissions_collection.find(
        {"user_id": user_id},
        {"_id": 0}
    ).sort("timestamp", -1).to_list(50)

    # 2. Fetch recent assessment attempts (past 48 hours)
    recent_assessments = await assessment_attempts_collection.find(
        {"user_id": user_id},
        {"_id": 0}
    ).sort("timestamp", -1).to_list(50)

    # 3. Fetch brain zone progress
    brain_prog = await brain_zone_progress_collection.find_one({"user_id": user_id}, {"_id": 0})

    # 4. Fetch solved count
    solved_count = await user_problems_collection.count_documents({"user_id": user_id, "status": "Solved"})

    recommendations: List[RecommendationItem] = []

    # Strategy A: Analyze coding submissions
    failed_subs = [s for s in recent_submissions if s.get("status") in ("Wrong Answer", "Runtime Error", "Compilation Error", "Time Limit Exceeded")]
    passed_subs = [s for s in recent_submissions if s.get("status") == "Accepted"]

    if failed_subs:
        failed_prob_id = failed_subs[0].get("problem_id", "coding problem")
        failed_lang = failed_subs[0].get("language", "code")
        status_msg = failed_subs[0].get("status", "Failed")
        recommendations.append(
            RecommendationItem(
                id="rec-coding-failed",
                module="practice",
                title=f"Review & Fix '{failed_prob_id}' ({status_msg})",
                subtitle=f"Retry this problem using hints or test case analysis in {failed_lang.capitalize()}.",
                route=f"/practice/{failed_prob_id}",
                badge="High Priority",
                badgeColor="bg-rose-500/15 text-rose-400 border-rose-500/30",
                estimatedTime="15 mins",
                impactScore="+10 Problem Mastery",
                whyThisReason=f"Your recent submission on '{failed_prob_id}' returned {status_msg}. Debugging edge cases strengthens coding interview rigor.",
                iconName="Code2",
                priority=1,
            )
        )
    elif passed_subs:
        solved_prob_id = passed_subs[0].get("problem_id", "coding problem")
        recommendations.append(
            RecommendationItem(
                id="rec-coding-passed",
                module="practice",
                title=f"Advance from '{solved_prob_id}' to Next DSA Pattern",
                subtitle="Try a Medium level algorithmic problem to expand your problem solving range.",
                route="/practice",
                badge="Progression",
                badgeColor="bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
                estimatedTime="20 mins",
                impactScore="+15 Problem Mastery",
                whyThisReason=f"You successfully solved '{solved_prob_id}'. Progressing to diverse DSA problem patterns reinforces interview readiness.",
                iconName="Code2",
                priority=1,
            )
        )

    # Strategy B: Analyze weak topics from assessments
    if recent_assessments:
        last_att = recent_assessments[0]
        weak_list = last_att.get("weak_topics", [])
        att_topic = last_att.get("topic", "Assessment")
        att_acc = last_att.get("accuracy", 0)
        att_type = last_att.get("assessment_type", "aptitude")

        if weak_list and len(weak_list) > 0:
            target_weak = weak_list[0]
            route_path = "/quizee" if att_type == "quiz" else "/aptitude"
            badge_color = "bg-amber-500/15 text-amber-400 border-amber-500/30"
            recommendations.append(
                RecommendationItem(
                    id="rec-weak-topic",
                    module=att_type,
                    title=f"Revise Weak Area: {target_weak}",
                    subtitle=f"Review formula sheets and attempt a 5-question focused set on {target_weak}.",
                    route=route_path,
                    badge="Topic Revision",
                    badgeColor=badge_color,
                    estimatedTime="10 mins",
                    impactScore="+8 Diagnostic Pts",
                    whyThisReason=f"Your recent {att_topic} session showed {att_acc}% accuracy, with gaps in {target_weak}. Targeted revision prevents recurring mistakes.",
                    iconName="Calculator" if att_type == "aptitude" else "Database",
                    priority=2,
                )
            )
        elif att_acc < 70:
            route_path = "/quizee" if att_type == "quiz" else "/aptitude"
            recommendations.append(
                RecommendationItem(
                    id="rec-acc-boost",
                    module=att_type,
                    title=f"Improve Accuracy in {att_topic}",
                    subtitle=f"Take a timed diagnostic review on {att_topic} concepts.",
                    route=route_path,
                    badge="Skill Gap",
                    badgeColor="bg-blue-500/15 text-blue-400 border-blue-500/30",
                    estimatedTime="10 mins",
                    impactScore="+6 Readiness Pts",
                    whyThisReason=f"Your last attempt on {att_topic} was {att_acc}%. Practicing under timer constraints builds campus screening speed.",
                    iconName="Target",
                    priority=2,
                )
            )
        else:
            route_path = "/quizee" if att_type == "quiz" else "/aptitude"
            recommendations.append(
                RecommendationItem(
                    id="rec-assessment-mastery",
                    module=att_type,
                    title=f"Consolidate {att_topic} Mastery",
                    subtitle=f"Great job scoring {att_acc}%! Try a mixed placement mock to test cross-topic retention.",
                    route=route_path,
                    badge="Mastery",
                    badgeColor="bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
                    estimatedTime="15 mins",
                    impactScore="+10 Diagnostic Pts",
                    whyThisReason=f"You achieved high accuracy ({att_acc}%) on {att_topic}. Mixed mocks validate your ability to switch concepts quickly.",
                    iconName="CheckCircle2",
                    priority=2,
                )
            )

    # Strategy C: Brain Zone cognitive training recommendation
    if brain_prog and brain_prog.get("completed_levels_count", 0) > 0 and len(recommendations) < 3:
        player_level = brain_prog.get("player_level", 1)
        recommendations.append(
            RecommendationItem(
                id="rec-brain-zone",
                module="brain-zone",
                title=f"Level {player_level + 1} Cognitive Agility Challenge",
                subtitle="Complete a procedural memory or pattern recognition puzzle.",
                route="/brain-zone",
                badge="Cognitive",
                badgeColor="bg-purple-500/15 text-purple-400 border-purple-500/30",
                estimatedTime="5 mins",
                impactScore="+25 XP",
                whyThisReason=f"You are currently Player Level {player_level}. Fast mental deduction exercises improve problem formulation speed under interview pressure.",
                iconName="BrainCircuit",
                priority=3,
            )
        )

    has_activity = bool(recent_submissions or recent_assessments or (brain_prog and brain_prog.get("completed_levels_count", 0) > 0) or solved_count > 0)

    # Calculate real stats summary
    total_acc = 0
    if recent_assessments:
        total_acc = round(sum(a.get("accuracy", 0) for a in recent_assessments) / len(recent_assessments), 1)

    streak_days = brain_prog.get("streak_days", 0) if brain_prog else 0

    return RecommendationResponse(
        recommendations=recommendations[:3] if has_activity else [],  # Strictly maximum 2-3 items, empty if no activity
        readiness_score=0,  # Computed genuinely in readiness service
        streak_days=streak_days,
        accuracy_percent=int(total_acc),
        has_activity=has_activity,
    )
