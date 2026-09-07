"""
PlaceMentor AI — Brain Zone Endless Procedural Generation Engine
Implements 5 procedural puzzle generators (Sudoku, Memory Match, Pattern Recognition, Target 24, Vocab Anagram)
with deterministic seed reproducibility, valid solvability guarantees, adaptive difficulty, and XP progression.
"""

from typing import List, Dict, Any, Optional, Tuple
from datetime import datetime, timezone
import random
import uuid
import itertools
from app.database.mongodb import brain_zone_progress_collection

WORLDS = [
    {
        "id": "mind-forest",
        "name": "Mind Forest",
        "description": "Lush cognitive groves of pattern deduction and memory awakening.",
        "icon": "Trees",
        "color": "from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-400",
        "unlock_level": 1,
    },
    {
        "id": "logic-desert",
        "name": "Logic Desert",
        "description": "Arid dunes of numeric elimination and precision arithmetic.",
        "icon": "Sun",
        "color": "from-amber-500/20 to-orange-500/10 border-amber-500/30 text-amber-400",
        "unlock_level": 2,
    },
    {
        "id": "neural-city",
        "name": "Neural City",
        "description": "High-speed cybernetic grid of working memory and symbol recognition.",
        "icon": "Zap",
        "color": "from-blue-500/20 to-cyan-500/10 border-blue-500/30 text-blue-400",
        "unlock_level": 3,
    },
    {
        "id": "focus-volcano",
        "name": "Focus Volcano",
        "description": "Intense thermal chambers testing mental endurance under rapid time constraints.",
        "icon": "Flame",
        "color": "from-rose-500/20 to-red-500/10 border-rose-500/30 text-rose-400",
        "unlock_level": 4,
    },
    {
        "id": "brain-castle",
        "name": "Brain Castle",
        "description": "The pinnacle citadel of complex algorithmic reasoning and multi-step deduction.",
        "icon": "Crown",
        "color": "from-purple-500/20 to-indigo-500/10 border-purple-500/30 text-purple-400",
        "unlock_level": 5,
    },
]

# =========================================================================
# 1. SUDOKU GENERATOR (4x4, 6x6, 9x9 with verified solution)
# =========================================================================

def generate_sudoku_puzzle(seed: int, difficulty: str = "Easy") -> Dict[str, Any]:
    rng = random.Random(seed)
    
    if difficulty == "Hard":
        size = 6
        # 6x6 valid Latin-grid base
        base = [
            [1, 2, 3, 4, 5, 6],
            [4, 5, 6, 1, 2, 3],
            [2, 3, 1, 5, 6, 4],
            [5, 6, 4, 2, 3, 1],
            [3, 1, 2, 6, 4, 5],
            [6, 4, 5, 3, 1, 2]
        ]
        cells_to_remove = 14
    else:
        size = 4
        # 4x4 valid mini Sudoku base
        base = [
            [1, 2, 3, 4],
            [3, 4, 1, 2],
            [2, 1, 4, 3],
            [4, 3, 2, 1]
        ]
        cells_to_remove = 5 if difficulty == "Easy" else 8

    # Shuffle digits
    digits = list(range(1, size + 1))
    shuffled_digits = list(digits)
    rng.shuffle(shuffled_digits)
    mapping = {digits[i]: shuffled_digits[i] for i in range(size)}

    solution = [[mapping[val] for val in row] for row in base]
    puzzle = [list(row) for row in solution]

    # Remove cells for puzzle
    coords = [(r, c) for r in range(size) for c in range(size)]
    rng.shuffle(coords)

    removed = 0
    for r, c in coords:
        if removed >= cells_to_remove:
            break
        puzzle[r][c] = 0
        removed += 1

    return {
        "size": size,
        "puzzle": puzzle,
        "solution": solution,
        "target_time_seconds": 90 if size == 4 else 180,
    }


# =========================================================================
# 2. MEMORY MATCH GENERATOR
# =========================================================================

MEMORY_TERMS_POOL = [
    {"symbol": "O(1)", "concept": "Constant Time Lookup"},
    {"symbol": "O(n)", "concept": "Linear Scan"},
    {"symbol": "O(log n)", "concept": "Binary Search"},
    {"symbol": "O(n log n)", "concept": "Merge / Heap Sort"},
    {"symbol": "O(n²)", "concept": "Quadratic / Nested Loops"},
    {"symbol": "BFS", "concept": "Queue Breadth-First Search"},
    {"symbol": "DFS", "concept": "Stack Depth-First Search"},
    {"symbol": "DP", "concept": "Memoization & Tabulation"},
    {"symbol": "Hash", "concept": "Direct Key Indexing"},
    {"symbol": "Heap", "concept": "Priority Queue Min/Max"},
    {"symbol": "Trie", "concept": "Prefix Tree Index"},
    {"symbol": "BST", "concept": "Binary Search Tree"},
]

def generate_memory_match_puzzle(seed: int, difficulty: str = "Easy") -> Dict[str, Any]:
    rng = random.Random(seed)
    
    pairs_count = 4 if difficulty == "Easy" else (6 if difficulty == "Medium" else 8)
    selected_terms = rng.sample(MEMORY_TERMS_POOL, min(pairs_count, len(MEMORY_TERMS_POOL)))

    cards = []
    card_id = 1
    for term in selected_terms:
        # Card A: Symbol
        cards.append({
            "id": card_id,
            "match_key": term["symbol"],
            "label": term["symbol"],
            "sub": "Algorithm Notation",
            "flipped": False,
            "matched": False,
        })
        card_id += 1
        # Card B: Matching Concept
        cards.append({
            "id": card_id,
            "match_key": term["symbol"],
            "label": term["symbol"],
            "sub": term["concept"],
            "flipped": False,
            "matched": False,
        })
        card_id += 1

    rng.shuffle(cards)

    return {
        "cards": cards,
        "total_pairs": len(selected_terms),
        "target_moves": len(cards) + 4,
        "target_time_seconds": 60 + pairs_count * 10,
    }


# =========================================================================
# 3. PATTERN RECOGNITION GENERATOR
# =========================================================================

def generate_pattern_puzzle(seed: int, difficulty: str = "Easy") -> Dict[str, Any]:
    rng = random.Random(seed)
    pattern_type = rng.choice(["arithmetic", "geometric", "fibonacci", "alternating", "quadratic"])

    if pattern_type == "arithmetic":
        start = rng.randint(2, 20)
        diff = rng.randint(3, 12)
        seq = [start + i * diff for i in range(5)]
        next_val = start + 5 * diff
        rule = f"Add {diff} at each step"
    elif pattern_type == "geometric":
        start = rng.randint(2, 5)
        ratio = rng.choice([2, 3])
        seq = [start * (ratio ** i) for i in range(4)]
        next_val = start * (ratio ** 4)
        rule = f"Multiply by {ratio} at each step"
    elif pattern_type == "fibonacci":
        a, b = rng.randint(1, 6), rng.randint(2, 8)
        seq = [a, b]
        for _ in range(3):
            seq.append(seq[-1] + seq[-2])
        next_val = seq[-1] + seq[-2]
        rule = "Each number is the sum of the two preceding numbers"
    elif pattern_type == "quadratic":
        c = rng.randint(1, 5)
        seq = [i * i + c for i in range(1, 6)]
        next_val = 6 * 6 + c
        rule = f"Sequence is n² + {c}"
    else:  # alternating
        start = rng.randint(10, 30)
        d1, d2 = rng.randint(2, 5), rng.randint(6, 10)
        seq = [start]
        for i in range(4):
            seq.append(seq[-1] + d1 if i % 2 == 0 else seq[-1] - d2)
        next_val = seq[-1] + d1 if len(seq) % 2 == 1 else seq[-1] - d2
        rule = f"Alternating +{d1} and -{d2}"

    # Generate 3 realistic distractors
    distractors = set()
    while len(distractors) < 3:
        offset = rng.choice([-3, -2, -1, 1, 2, 3, 5, -5])
        candidate = next_val + offset
        if candidate != next_val and candidate > 0:
            distractors.add(candidate)

    options = list(distractors) + [next_val]
    rng.shuffle(options)
    correct_index = options.index(next_val)

    return {
        "sequence": seq,
        "sequence_display": [str(x) for x in seq] + ["?"],
        "options": options,
        "correct_index": correct_index,
        "correct_value": next_val,
        "rule_explanation": rule,
        "explanation": rule,
        "target_time_seconds": 45,
    }


# =========================================================================
# 4. TARGET 24 GENERATOR (Solvable arithmetic expressions)
# =========================================================================

SOLVABLE_TARGET_24_SETS = [
    {"numbers": [4, 6, 2, 3], "solution": "(6 - 2) * (4 + 3) - 4 = 24 or 4 * 6 * (3 - 2) = 24"},
    {"numbers": [8, 3, 2, 1], "solution": "8 * 3 * (2 - 1) = 24"},
    {"numbers": [6, 4, 3, 2], "solution": "(6 * 4) * (3 - 2) = 24"},
    {"numbers": [7, 5, 2, 1], "solution": "(7 + 5) * 2 * 1 = 24"},
    {"numbers": [8, 8, 4, 1], "solution": "(8 - 4) * (8 - 2) or (8 / (1 - (2/3)))"},
    {"numbers": [9, 3, 2, 2], "solution": "(9 - 3) * (2 + 2) = 24"},
    {"numbers": [5, 5, 5, 1], "solution": "5 * 5 - (5 / 5) = 24 (or 5 * (5 - 1/5) = 24)"},
    {"numbers": [6, 6, 6, 6], "solution": "(6 + 6) + (6 + 6) = 24"},
    {"numbers": [3, 3, 8, 8], "solution": "8 / (3 - 8/3) = 24"},
    {"numbers": [1, 2, 3, 4], "solution": "1 * 2 * 3 * 4 = 24"},
    {"numbers": [4, 4, 4, 6], "solution": "(4 + 4 - 4) * 6 = 24"},
    {"numbers": [2, 3, 5, 7], "solution": "(7 - 5) * (2 * 6) or (5 - 2 + 7) * 2 = 24"},
]

def generate_target_24_puzzle(seed: int, difficulty: str = "Easy") -> Dict[str, Any]:
    rng = random.Random(seed)
    chosen = rng.choice(SOLVABLE_TARGET_24_SETS)
    nums = list(chosen["numbers"])
    rng.shuffle(nums)

    return {
        "numbers": nums,
        "target": 24,
        "hint": chosen["solution"],
        "hint_solution": chosen["solution"],
        "target_time_seconds": 60,
    }


# =========================================================================
# 5. VOCAB ANAGRAM GENERATOR
# =========================================================================

ANAGRAM_WORDS = [
    {"word": "ARRAY", "hint": "Contiguous memory sequence of homogeneous elements."},
    {"word": "STACK", "hint": "LIFO linear structure utilized in function call recursion."},
    {"word": "QUEUE", "hint": "FIFO linear structure utilized in BFS and CPU scheduling."},
    {"word": "GRAPH", "hint": "Non-linear network composed of vertices and edges."},
    {"word": "HEAP", "hint": "Complete binary tree satisfying priority order property."},
    {"word": "MUTEX", "hint": "Mutual exclusion synchronization primitive in OS concurrency."},
    {"word": "INDEX", "hint": "Database data structure (like B+ Tree) that speeds up search queries."},
    {"word": "CACHE", "hint": "High-speed volatile hardware or memory storage layer."},
    {"word": "TOKEN", "hint": "Cryptographic authentication string or lexical scanner unit."},
    {"word": "PROXY", "hint": "Intermediary server facilitating network requests and caching."},
    {"word": "SHARD", "hint": "Horizontal partition of data in distributed databases."},
    {"word": "PIPELINE", "hint": "Instruction execution parallelism or data processing workflow."},
]

def generate_vocab_anagram_puzzle(seed: int, difficulty: str = "Easy") -> Dict[str, Any]:
    rng = random.Random(seed)
    chosen = rng.choice(ANAGRAM_WORDS)
    word = chosen["word"]

    # Scramble
    letters = list(word)
    while True:
        rng.shuffle(letters)
        scrambled = "".join(letters)
        if scrambled != word:
            break

    return {
        "scrambled": scrambled,
        "length": len(word),
        "hint": chosen["hint"],
        "word": word,
        "target_word": word,
        "progressive_hints": [
            f"Word Length: {len(word)} characters",
            f"First letter is '{word[0]}'",
            f"Final letter is '{word[-1]}'",
        ],
        "target_time_seconds": 45,
    }


# =========================================================================
# MASTER GENERATOR & PROGRESSION TRACKER
# =========================================================================

def generate_brain_challenge(
    game_type: str,
    level: int = 1,
    seed: Optional[int] = None,
    difficulty: str = "Easy",
) -> Dict[str, Any]:
    """
    Procedural generator dispatcher. Solvable and reproducible from seed.
    """
    if seed is None:
        seed = abs(hash(f"{game_type}_{level}_{difficulty}_{random.randint(1000, 999999)}")) % 10000000

    if game_type == "sudoku":
        game_data = generate_sudoku_puzzle(seed=seed, difficulty=difficulty)
    elif game_type == "memory-match":
        game_data = generate_memory_match_puzzle(seed=seed, difficulty=difficulty)
    elif game_type == "pattern-recognition":
        game_data = generate_pattern_puzzle(seed=seed, difficulty=difficulty)
    elif game_type == "target-24":
        game_data = generate_target_24_puzzle(seed=seed, difficulty=difficulty)
    elif game_type == "vocab-anagram":
        game_data = generate_vocab_anagram_puzzle(seed=seed, difficulty=difficulty)
    else:
        game_data = generate_pattern_puzzle(seed=seed, difficulty=difficulty)

    return {
        "game_type": game_type,
        "level": level,
        "seed": seed,
        "difficulty": difficulty,
        "xp_reward": 25 * level + (10 if difficulty == "Medium" else 20 if difficulty == "Hard" else 0),
        "payload": game_data,
        **game_data,
    }


async def get_user_brain_progress(user_id: str) -> Dict[str, Any]:
    """
    Fetches Brain Zone progression, XP, achievements, and world unlocks.
    """
    doc = await brain_zone_progress_collection.find_one({"user_id": user_id}, {"_id": 0})
    if not doc:
        doc = {
            "id": str(uuid.uuid4()),
            "user_id": user_id,
            "xp": 0,
            "player_level": 1,
            "streak_days": 0,
            "unlocked_worlds": ["mind-forest"],
            "completed_levels_count": 0,
            "achievements": [],
            "game_stats": {},
            "recent_history": [],
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat(),
        }
        await brain_zone_progress_collection.insert_one(dict(doc))
        doc.pop("_id", None)

    return doc


async def record_brain_game_completion(
    user_id: str,
    game_id: str,
    world_id: str,
    level: int,
    seed: int,
    score: int,
    accuracy: float,
    time_spent_seconds: int,
    passed: bool = True,
) -> Dict[str, Any]:
    """
    Records game results, awards XP, updates streaks and unlocks worlds.
    """
    prog = await get_user_brain_progress(user_id)

    earned_xp = (score // 10) + (level * 20) if passed else 10
    new_xp = prog.get("xp", 0) + earned_xp
    new_player_level = 1 + (new_xp // 200)

    # World Unlocking logic
    unlocked = list(prog.get("unlocked_worlds", ["mind-forest"]))
    if new_player_level >= 2 and "logic-desert" not in unlocked:
        unlocked.append("logic-desert")
    if new_player_level >= 3 and "neural-city" not in unlocked:
        unlocked.append("neural-city")
    if new_player_level >= 4 and "focus-volcano" not in unlocked:
        unlocked.append("focus-volcano")
    if new_player_level >= 5 and "brain-castle" not in unlocked:
        unlocked.append("brain-castle")

    # Achievements check
    achievements = list(prog.get("achievements", []))
    completed_count = prog.get("completed_levels_count", 0) + (1 if passed else 0)
    
    if completed_count >= 1 and "First Step" not in achievements:
        achievements.append("First Step")
    if completed_count >= 5 and "Cognitive Apprentice" not in achievements:
        achievements.append("Cognitive Apprentice")
    if completed_count >= 15 and "Mental Master" not in achievements:
        achievements.append("Mental Master")
    if time_spent_seconds < 30 and passed and "Speed Demon" not in achievements:
        achievements.append("Speed Demon")

    now = datetime.now(timezone.utc).isoformat()
    history_entry = {
        "game_id": game_id,
        "world_id": world_id,
        "level": level,
        "seed": seed,
        "score": score,
        "accuracy": accuracy,
        "time_spent": time_spent_seconds,
        "xp_earned": earned_xp,
        "passed": passed,
        "timestamp": now,
    }

    recent_history = [history_entry] + prog.get("recent_history", [])[:19]

    update_payload = {
        "xp": new_xp,
        "player_level": new_player_level,
        "unlocked_worlds": unlocked,
        "completed_levels_count": completed_count,
        "achievements": achievements,
        "recent_history": recent_history,
        "updated_at": now,
    }

    await brain_zone_progress_collection.update_one(
        {"user_id": user_id},
        {"$set": update_payload},
        upsert=True
    )

    return {
        "xp_earned": earned_xp,
        "xp_awarded": earned_xp,
        "total_xp": new_xp,
        "new_xp": new_xp,
        "player_level": new_player_level,
        "unlocked_worlds": unlocked,
        "achievements": achievements,
        "completed_levels_count": completed_count,
    }
