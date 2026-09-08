"""
PlaceMentor AI — Real Evidence-Based Activity & Streak Service
Calculates daily activity streaks dynamically from actual database records in UTC.
Opening pages or idling does NOT increase streak.
"""

from typing import Set, Any, Optional, List, Dict
from datetime import datetime, timezone, timedelta, date
from app.database.mongodb import (
    coding_submissions_collection,
    assessment_attempts_collection,
    communication_sessions_collection,
    brain_zone_progress_collection,
)


def _extract_date(val: Any) -> Optional[date]:
    if isinstance(val, datetime):
        return val.date()
    if isinstance(val, str):
        try:
            return datetime.fromisoformat(val.replace("Z", "+00:00")).date()
        except Exception:
            try:
                return datetime.strptime(val[:10], "%Y-%m-%d").date()
            except Exception:
                return None
    return None


async def get_user_active_dates(user_id: str) -> Set[date]:
    """
    Collects all unique calendar dates (UTC) on which the user completed a qualifying action:
    - Submitted a coding problem (Run or Submit)
    - Completed an aptitude or CS quiz assessment
    - Recorded a communication session
    - Completed a Brain Zone procedural level
    """
    from typing import Any, Optional
    active_dates: Set[date] = set()

    # 1. Coding Submissions
    subs = await coding_submissions_collection.find(
        {"user_id": user_id},
        {"timestamp": 1, "_id": 0}
    ).to_list(1000)
    for s in subs:
        d = _extract_date(s.get("timestamp"))
        if d:
            active_dates.add(d)

    # 2. Assessment Attempts
    attempts = await assessment_attempts_collection.find(
        {"user_id": user_id},
        {"timestamp": 1, "_id": 0}
    ).to_list(1000)
    for a in attempts:
        d = _extract_date(a.get("timestamp"))
        if d:
            active_dates.add(d)

    # 3. Communication Sessions
    sessions = await communication_sessions_collection.find(
        {"user_id": user_id},
        {"created_at": 1, "timestamp": 1, "_id": 0}
    ).to_list(500)
    for cs in sessions:
        d = _extract_date(cs.get("created_at") or cs.get("timestamp"))
        if d:
            active_dates.add(d)

    # 4. Brain Zone Progress History
    bz = await brain_zone_progress_collection.find_one(
        {"user_id": user_id},
        {"recent_history": 1, "_id": 0}
    )
    if bz and "recent_history" in bz:
        for entry in bz["recent_history"]:
            d = _extract_date(entry.get("timestamp"))
            if d:
                active_dates.add(d)

    return active_dates


async def calculate_user_streak(user_id: str) -> int:
    """
    Calculates consecutive active days leading up to today (or yesterday).
    Returns 0 if no qualifying activity in the last 48 hours or fresh account.
    """
    active_dates = await get_user_active_dates(user_id)
    if not active_dates:
        return 0

    today = datetime.now(timezone.utc).date()
    yesterday = today - timedelta(days=1)

    # Streak is active if user did something today or yesterday
    if today in active_dates:
        current_day = today
    elif yesterday in active_dates:
        current_day = yesterday
    else:
        # Streak broken (last activity was >= 2 days ago)
        return 0

    streak = 0
    while current_day in active_dates:
        streak += 1
        current_day -= timedelta(days=1)

    return streak
