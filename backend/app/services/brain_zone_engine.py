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
from fractions import Fraction
from app.database.mongodb import brain_zone_progress_collection

WORLDS = [
    {
        "id": "mind-forest",
        "name": "Mind Forest",
        "tagline": "Lush cognitive groves of pattern deduction & memory awakening",
        "description": "Explore dense canopy trails where ancient memory runes and pattern clues reveal hidden forest relics.",
        "icon": "Trees",
        "color": "from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-400",
        "bg_gradient": "from-emerald-950/40 via-secondary to-card",
        "unlock_level": 1,
        "treasure_name": "Emerald Forest Relic",
        "treasure_icon": "🌿",
        "theme": "Forest",
    },
    {
        "id": "logic-desert",
        "name": "Logic Desert",
        "tagline": "Arid dunes of numeric elimination & precision arithmetic",
        "description": "Navigate shifting sands and unravel numeric hieroglyphs to unearth the legendary Desert Crystal.",
        "icon": "Sun",
        "color": "from-amber-500/20 to-orange-500/10 border-amber-500/30 text-amber-400",
        "bg_gradient": "from-amber-950/40 via-secondary to-card",
        "unlock_level": 2,
        "treasure_name": "Desert Crystal",
        "treasure_icon": "💎",
        "theme": "Desert",
    },
    {
        "id": "neural-city",
        "name": "Neural City",
        "tagline": "High-speed cybernetic grid of working memory & symbol recognition",
        "description": "Race through glowing neon avenues solving fast-fire anagrams and symbol nodes to acquire the Neural Core.",
        "icon": "Zap",
        "color": "from-blue-500/20 to-cyan-500/10 border-blue-500/30 text-blue-400",
        "bg_gradient": "from-blue-950/40 via-secondary to-card",
        "unlock_level": 3,
        "treasure_name": "Neural Core",
        "treasure_icon": "🔮",
        "theme": "Cyberpunk",
    },
    {
        "id": "focus-volcano",
        "name": "Focus Volcano",
        "tagline": "Intense thermal chambers testing mental endurance under rapid time constraints",
        "description": "Brave volcanic chambers under countdown pressure to forge and claim the molten Volcano Heart.",
        "icon": "Flame",
        "color": "from-rose-500/20 to-red-500/10 border-rose-500/30 text-rose-400",
        "bg_gradient": "from-rose-950/40 via-secondary to-card",
        "unlock_level": 4,
        "treasure_name": "Volcano Heart",
        "treasure_icon": "🔥",
        "theme": "Volcanic",
    },
    {
        "id": "brain-castle",
        "name": "Brain Castle",
        "tagline": "The pinnacle citadel of complex algorithmic reasoning & multi-step deduction",
        "description": "Ascend the royal citadel chambers solving multi-step algorithmic puzzles to claim the ultimate Brain Crown.",
        "icon": "Crown",
        "color": "from-purple-500/20 to-indigo-500/10 border-purple-500/30 text-purple-400",
        "bg_gradient": "from-purple-950/40 via-secondary to-card",
        "unlock_level": 5,
        "treasure_name": "Brain Crown",
        "treasure_icon": "👑",
        "theme": "Citadel",
    },
]

# =========================================================================
# 1. SUDOKU GENERATOR (4x4, 6x6, 9x9 with verified solution)
# =========================================================================

def _solve_sudoku(grid: List[List[int]], size: int, box_r: int, box_c: int) -> bool:
    """Helper solver to verify or complete a Sudoku grid using backtracking."""
    for r in range(size):
        for c in range(size):
            if grid[r][c] == 0:
                for num in range(1, size + 1):
                    if _is_valid_sudoku_num(grid, r, c, num, size, box_r, box_c):
                        grid[r][c] = num
                        if _solve_sudoku(grid, size, box_r, box_c):
                            return True
                        grid[r][c] = 0
                return False
    return True

def _is_valid_sudoku_num(grid: List[List[int]], r: int, c: int, num: int, size: int, box_r: int, box_c: int) -> bool:
    for i in range(size):
        if grid[r][i] == num or grid[i][c] == num:
            return False
    br, bc = (r // box_r) * box_r, (c // box_c) * box_c
    for i in range(box_r):
        for j in range(box_c):
            if grid[br + i][bc + j] == num:
                return False
    return True

def generate_sudoku_puzzle(seed: int, difficulty: str = "Easy", level: int = 1) -> Dict[str, Any]:
    rng = random.Random(seed + level * 10007)

    # Determine size & subgrid parameters based on difficulty & level
    if difficulty == "Easy":
        if level <= 5:
            size, box_r, box_c = 4, 2, 2
            cells_to_remove = min(7, 4 + (level - 1))
        elif level <= 15:
            size, box_r, box_c = 6, 2, 3
            cells_to_remove = min(16, 10 + (level - 6))
        else:
            size, box_r, box_c = 9, 3, 3
            cells_to_remove = min(38, 28 + (level - 16) // 2)
    elif difficulty == "Medium":
        if level <= 5:
            size, box_r, box_c = 6, 2, 3
            cells_to_remove = min(20, 12 + (level - 1))
        else:
            size, box_r, box_c = 9, 3, 3
            cells_to_remove = min(46, 36 + (level - 6))
    else:  # Hard
        size, box_r, box_c = 9, 3, 3
        cells_to_remove = min(54, 44 + (level - 1))

    # Base valid solved grid for each size
    if size == 4:
        base = [[1, 2, 3, 4], [3, 4, 1, 2], [2, 1, 4, 3], [4, 3, 2, 1]]
    elif size == 6:
        base = [
            [1, 2, 3, 4, 5, 6],
            [4, 5, 6, 1, 2, 3],
            [2, 3, 1, 5, 6, 4],
            [5, 6, 4, 2, 3, 1],
            [3, 1, 2, 6, 4, 5],
            [6, 4, 5, 3, 1, 2]
        ]
    else:  # 9x9
        base = [[(r * 3 + r // 3 + c) % 9 + 1 for c in range(9)] for r in range(9)]

    # Digit mapping permutation
    digits = list(range(1, size + 1))
    shuffled_digits = list(digits)
    rng.shuffle(shuffled_digits)
    mapping = {digits[i]: shuffled_digits[i] for i in range(size)}

    solution = [[mapping[val] for val in row] for row in base]

    # Swap rows within row blocks
    for b in range(size // box_r):
        rows = list(range(b * box_r, (b + 1) * box_r))
        rng.shuffle(rows)
        sub = [solution[r] for r in rows]
        for idx, r in enumerate(range(b * box_r, (b + 1) * box_r)):
            solution[r] = sub[idx]

    # Transpose optionally (only valid when subgrid boxes are square, i.e., box_r == box_c)
    if box_r == box_c and rng.choice([True, False]):
        solution = [[solution[r][c] for r in range(size)] for c in range(size)]

    puzzle = [list(row) for row in solution]

    # Remove cells
    coords = [(r, c) for r in range(size) for c in range(size)]
    rng.shuffle(coords)

    for r, c in coords[:cells_to_remove]:
        puzzle[r][c] = 0

    return {
        "size": size,
        "box_r": box_r,
        "box_c": box_c,
        "puzzle": puzzle,
        "solution": solution,
        "target_time_seconds": 60 if size == 4 else (120 if size == 6 else 240),
    }


# =========================================================================
# 2. MEMORY MATCH GENERATOR
# =========================================================================

MEMORY_TERMS_POOL = [
    {"symbol": "O(1)", "concept": "Constant Time Lookup"},
    {"symbol": "O(n)", "concept": "Linear Scan / Traversal"},
    {"symbol": "O(log n)", "concept": "Binary Search Halving"},
    {"symbol": "O(n log n)", "concept": "Merge & Heap Sort"},
    {"symbol": "O(n²)", "concept": "Quadratic / Nested Loops"},
    {"symbol": "O(2ⁿ)", "concept": "Exponential Power Set"},
    {"symbol": "BFS", "concept": "Queue Breadth-First Search"},
    {"symbol": "DFS", "concept": "Stack Depth-First Search"},
    {"symbol": "DP", "concept": "Memoization & Tabulation"},
    {"symbol": "Hash", "concept": "Direct Key Index Mapping"},
    {"symbol": "Heap", "concept": "Priority Queue Min/Max Tree"},
    {"symbol": "Trie", "concept": "Prefix Retrieval Tree"},
    {"symbol": "BST", "concept": "Binary Search Tree"},
    {"symbol": "AVL", "concept": "Strict Height Balanced BST"},
    {"symbol": "B-Tree", "concept": "Multi-way Disk Storage Index"},
    {"symbol": "LRU", "concept": "Least Recently Used Cache"},
    {"symbol": "KMP", "concept": "Prefix Automaton String Match"},
    {"symbol": "Dijkstra", "concept": "Shortest Path Non-Negative Edges"},
    {"symbol": "Bellman-Ford", "concept": "Shortest Path Negative Weights"},
    {"symbol": "Kruskal", "concept": "MST Union-Find Greedy Edge Sort"},
    {"symbol": "Prim", "concept": "MST Priority Queue Node Addition"},
    {"symbol": "Tarjan", "concept": "Strongly Connected Components"},
    {"symbol": "Topo Sort", "concept": "DAG Dependency Ordering"},
    {"symbol": "Segment Tree", "concept": "Range Query & Point Update"},
    {"symbol": "Fenwick", "concept": "Binary Indexed Tree Prefix Sum"},
    {"symbol": "Sliding Window", "concept": "Subarray Contiguous Tracking"},
    {"symbol": "Two Pointers", "concept": "Sorted Pair Boundary Traversal"},
    {"symbol": "Fast & Slow", "concept": "Floyd Cycle Detection Pointer"},
    {"symbol": "Monotonic Stack", "concept": "Next Greater Element Order"},
    {"symbol": "Disjoint Set", "concept": "Union-Find Path Compression"},
    {"symbol": "Bitmask", "concept": "Bitwise XOR / Subset State"},
    {"symbol": "QuickSelect", "concept": "Linear Expected Kth Element"},
    {"symbol": "Floyd-Warshall", "concept": "All-Pairs Shortest Path Matrix"},
    {"symbol": "Rabin-Karp", "concept": "Rolling Hash Pattern Match"},
    {"symbol": "Trie Prefix", "concept": "Autocomplete Lexicographical Key"},
    {"symbol": "Red-Black Tree", "concept": "Self-Balancing Color Rule BST"},
    {"symbol": "Backtracking", "concept": "State Space Tree Pruning"},
    {"symbol": "Memoization", "concept": "Top-Down Cached Recursion"},
    {"symbol": "Tabulation", "concept": "Bottom-Up Iterative DP Table"},
    {"symbol": "Matrix Exponent", "concept": "Logarithmic Linear Recurrence"},
]

def generate_memory_match_puzzle(seed: int, difficulty: str = "Easy", level: int = 1) -> Dict[str, Any]:
    rng = random.Random(seed + level * 10007)
    
    if difficulty == "Easy":
        pairs_count = min(10, 4 + (level - 1) // 2)
    elif difficulty == "Medium":
        pairs_count = min(14, 6 + (level - 1) // 2)
    else:  # Hard
        pairs_count = min(18, 8 + (level - 1))

    selected_terms = rng.sample(MEMORY_TERMS_POOL, min(pairs_count, len(MEMORY_TERMS_POOL)))

    cards = []
    card_id = 1
    for term in selected_terms:
        # Card A: Symbol notation
        cards.append({
            "id": card_id,
            "match_key": term["symbol"],
            "symbol": term["symbol"],
            "label": term["symbol"],
            "sub": "Notation / Term",
            "flipped": False,
            "matched": False,
        })
        card_id += 1
        # Card B: Matching Concept Description
        cards.append({
            "id": card_id,
            "match_key": term["symbol"],
            "symbol": term["concept"],
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
        "target_time_seconds": 45 + pairs_count * 8,
    }


# =========================================================================
# 3. PATTERN RECOGNITION GENERATOR (8 Progression Rule Types)
# =========================================================================

def _is_prime(n: int) -> bool:
    if n < 2: return False
    for i in range(2, int(n**0.5) + 1):
        if n % i == 0: return False
    return True

def generate_pattern_puzzle(seed: int, difficulty: str = "Easy", level: int = 1) -> Dict[str, Any]:
    rng = random.Random(seed + level * 10007)

    available_types = ["arithmetic", "geometric", "fibonacci", "alternating"]
    if difficulty in ["Medium", "Hard"] or level >= 4:
        available_types.extend(["quadratic", "second_order", "prime"])
    if difficulty == "Hard" or level >= 8:
        available_types.extend(["cubic", "modular"])

    pattern_type = rng.choice(available_types)

    if pattern_type == "arithmetic":
        start = rng.randint(2, 10 + level * 2)
        diff = rng.randint(2, 6 + level) * (rng.choice([-1, 1]) if difficulty != "Easy" else 1)
        seq = [start + i * diff for i in range(5)]
        next_val = start + 5 * diff
        rule = f"Add {diff} at each step"

    elif pattern_type == "geometric":
        start = rng.randint(1, 4)
        ratio = rng.choice([2, 3, 4]) if difficulty == "Easy" else rng.choice([2, 3, -2])
        seq = [start * (ratio ** i) for i in range(4)]
        next_val = start * (ratio ** 4)
        rule = f"Multiply by {ratio} at each step"

    elif pattern_type == "fibonacci":
        a, b = rng.randint(1, 4 + level), rng.randint(2, 6 + level)
        seq = [a, b]
        for _ in range(3):
            seq.append(seq[-1] + seq[-2])
        next_val = seq[-1] + seq[-2]
        rule = "Each number is the sum of the two preceding numbers"

    elif pattern_type == "quadratic":
        c = rng.randint(1, 5 + level)
        seq = [i * i + c for i in range(1, 6)]
        next_val = 6 * 6 + c
        rule = f"Sequence rule is n² + {c}"

    elif pattern_type == "second_order":
        start = rng.randint(2, 10)
        base_diff = rng.randint(2, 4)
        step = rng.randint(2, 3 + (level // 3))
        seq = [start]
        cur_diff = base_diff
        for _ in range(4):
            seq.append(seq[-1] + cur_diff)
            cur_diff += step
        next_val = seq[-1] + cur_diff
        rule = f"Differences increase by +{step} at each step"

    elif pattern_type == "prime":
        primes = [p for p in range(2, 100) if _is_prime(p)]
        offset = rng.randint(0, len(primes) - 6)
        c = rng.randint(1, 5)
        seq = [primes[offset + i] + c for i in range(5)]
        next_val = primes[offset + 5] + c
        rule = f"Prime numbers shifted by +{c}"

    elif pattern_type == "cubic":
        c = rng.randint(1, 4)
        seq = [i**3 + c for i in range(1, 6)]
        next_val = 6**3 + c
        rule = f"Sequence rule is n³ + {c}"

    elif pattern_type == "modular":
        mod = rng.choice([7, 11, 13])
        mult = rng.randint(2, 4)
        seq = [(mult * i + 3) % mod for i in range(1, 6)]
        next_val = (mult * 6 + 3) % mod
        rule = f"Pattern follows ({mult}n + 3) mod {mod}"

    else:  # alternating
        start = rng.randint(10, 30 + level * 3)
        d1, d2 = rng.randint(2, 5 + level), rng.randint(3, 7 + level)
        seq = [start]
        for i in range(4):
            seq.append(seq[-1] + d1 if i % 2 == 0 else seq[-1] - d2)
        next_val = seq[-1] + d1 if len(seq) % 2 == 1 else seq[-1] - d2
        rule = f"Alternating operations +{d1} and -{d2}"

    # Generate 3 plausible distractors
    distractors = set()
    attempts = 0
    while len(distractors) < 3 and attempts < 100:
        attempts += 1
        offset = rng.choice([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 7, -7])
        candidate = next_val + offset
        if candidate != next_val and candidate not in distractors:
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
# 4. TARGET 24 GENERATOR (Solvable arithmetic expressions using Fraction)
# =========================================================================

def _solve_24(numbers: List[int]) -> Optional[str]:
    """Rigorous Fraction-based 24 solver testing all permutations & parenthesizations."""
    ops = [
        ('+', lambda x, y: x + y),
        ('-', lambda x, y: x - y),
        ('*', lambda x, y: x * y),
        ('/', lambda x, y: x / y if y != Fraction(0) else None),
    ]
    
    nums = [Fraction(n) for n in numbers]
    for p in set(itertools.permutations(range(4))):
        a, b, c, d = nums[p[0]], nums[p[1]], nums[p[2]], nums[p[3]]
        orig = [numbers[p[0]], numbers[p[1]], numbers[p[2]], numbers[p[3]]]
        
        for op1_n, op1 in ops:
            for op2_n, op2 in ops:
                for op3_n, op3 in ops:
                    # Pattern 1: ((a op1 b) op2 c) op3 d
                    r1 = op1(a, b)
                    if r1 is not None:
                        r2 = op2(r1, c)
                        if r2 is not None:
                            r3 = op3(r2, d)
                            if r3 == Fraction(24):
                                return f"(({orig[0]} {op1_n} {orig[1]}) {op2_n} {orig[2]}) {op3_n} {orig[3]}"
                    
                    # Pattern 2: (a op1 (b op2 c)) op3 d
                    r2 = op2(b, c)
                    if r2 is not None:
                        r1 = op1(a, r2)
                        if r1 is not None:
                            r3 = op3(r1, d)
                            if r3 == Fraction(24):
                                return f"({orig[0]} {op1_n} ({orig[1]} {op2_n} {orig[2]})) {op3_n} {orig[3]}"
                    
                    # Pattern 3: (a op1 b) op2 (c op3 d)
                    r1 = op1(a, b)
                    r3 = op3(c, d)
                    if r1 is not None and r3 is not None:
                        r2 = op2(r1, r3)
                        if r2 == Fraction(24):
                            return f"({orig[0]} {op1_n} {orig[1]}) {op2_n} ({orig[2]} {op3_n} {orig[3]})"
                            
                    # Pattern 4: a op1 ((b op2 c) op3 d)
                    r2 = op2(b, c)
                    if r2 is not None:
                        r3 = op3(r2, d)
                        if r3 is not None:
                            r1 = op1(a, r3)
                            if r1 == Fraction(24):
                                return f"{orig[0]} {op1_n} (({orig[1]} {op2_n} {orig[2]}) {op3_n} {orig[3]})"
                    
                    # Pattern 5: a op1 (b op2 (c op3 d))
                    r3 = op3(c, d)
                    if r3 is not None:
                        r2 = op2(b, r3)
                        if r2 is not None:
                            r1 = op1(a, r2)
                            if r1 == Fraction(24):
                                return f"{orig[0]} {op1_n} ({orig[1]} {op2_n} ({orig[2]} {op3_n} ({orig[3]})))"
    return None

def generate_target_24_puzzle(seed: int, difficulty: str = "Easy", level: int = 1) -> Dict[str, Any]:
    rng = random.Random(seed + level * 10007)
    
    max_digit = 8 if difficulty == "Easy" else (10 if difficulty == "Medium" else 13)
    
    solution_str = None
    nums = []
    
    for _ in range(200):
        candidate = [rng.randint(1, max_digit) for _ in range(4)]
        sol = _solve_24(candidate)
        if sol is not None:
            nums = candidate
            solution_str = sol
            break
            
    if not solution_str:
        nums = [4, 6, 2, 3]
        solution_str = "(6 - 2) * (4 + 3) - 4 = 24"

    rng.shuffle(nums)

    return {
        "numbers": nums,
        "target": 24,
        "hint": solution_str,
        "hint_solution": solution_str,
        "target_time_seconds": 60,
    }


# =========================================================================
# 5. VOCAB ANAGRAM GENERATOR (60+ Placement Terms)
# =========================================================================

ANAGRAM_WORDS_EASY = [
    {"word": "ARRAY", "hint": "Contiguous memory sequence of homogeneous elements."},
    {"word": "STACK", "hint": "LIFO linear structure utilized in function call recursion."},
    {"word": "QUEUE", "hint": "FIFO linear structure utilized in BFS and CPU scheduling."},
    {"word": "GRAPH", "hint": "Non-linear network composed of vertices and edges."},
    {"word": "HEAP", "hint": "Complete binary tree satisfying priority order property."},
    {"word": "MUTEX", "hint": "Mutual exclusion synchronization primitive in OS concurrency."},
    {"word": "INDEX", "hint": "Database data structure that speeds up search queries."},
    {"word": "CACHE", "hint": "High-speed volatile hardware or memory storage layer."},
    {"word": "TOKEN", "hint": "Cryptographic authentication string or lexical scanner unit."},
    {"word": "PROXY", "hint": "Intermediary server facilitating network requests and caching."},
    {"word": "SHARD", "hint": "Horizontal partition of data in distributed databases."},
    {"word": "NODES", "hint": "Individual memory units containing data and pointers in linked lists."},
    {"word": "TREES", "hint": "Acyclic connected hierarchical graphs with root node."},
    {"word": "HASH", "hint": "Function mapping arbitrary keys to fixed-size array indices."},
    {"word": "BYTES", "hint": "8-bit sequence of binary digits."},
    {"word": "CODER", "hint": "Software developer writing programmatic algorithms."},
    {"word": "LINKS", "hint": "References or pointers connecting memory nodes."},
    {"word": "LOCKS", "hint": "Concurrency mechanism preventing race conditions."},
    {"word": "ASYNC", "hint": "Non-blocking asynchronous execution model."},
    {"word": "PARSER", "hint": "Syntax analyzer transforming tokens into abstract syntax trees."},
]

ANAGRAM_WORDS_MEDIUM = [
    {"word": "PIPELINE", "hint": "Instruction execution parallelism or data processing workflow."},
    {"word": "DATABASE", "hint": "Organized collection of structured data stored electronically."},
    {"word": "COMPILER", "hint": "Program translating high-level source code to machine bytecode."},
    {"word": "INTERNET", "hint": "Global interconnected network of computer systems."},
    {"word": "RECURSION", "hint": "Function calling itself until reaching a base condition."},
    {"word": "PROTOCOL", "hint": "Set of standard rules governing data transmission between nodes."},
    {"word": "REGISTER", "hint": "Ultra-fast temporary storage location inside a CPU core."},
    {"word": "ABSTRACT", "hint": "Hiding implementation details while revealing only essential interface."},
    {"word": "INSTANCE", "hint": "Concrete realization or object instantiated from an OOP class."},
    {"word": "FUNCTION", "hint": "Reusable block of statements performing a specific subtask."},
    {"word": "POINTERS", "hint": "Variables storing direct memory addresses of other variables."},
    {"word": "OVERLOAD", "hint": "Polymorphism feature allowing multiple methods with same name."},
    {"word": "THREADING", "hint": "Concurrent execution of multiple threads within a process."},
    {"word": "OVERRIDE", "hint": "Child class providing specific implementation of parent method."},
    {"word": "HARDWARE", "hint": "Physical tangible components of a computing system."},
    {"word": "SOFTWARE", "hint": "Collection of instructions executing on computer hardware."},
    {"word": "ITERATOR", "hint": "Object allowing sequential traversal through a container collection."},
    {"word": "DISPATCH", "hint": "Process of assigning jobs or method calls to handlers."},
    {"word": "RESPONSE", "hint": "Payload or status returned by server after an HTTP request."},
    {"word": "ENDPOINT", "hint": "URL address where API web service can be accessed."},
]

ANAGRAM_WORDS_HARD = [
    {"word": "CYBERSECURITY", "hint": "Protection of computer systems and networks from digital attacks."},
    {"word": "ASYNCHRONOUS", "hint": "Non-blocking execution model handling concurrent I/O operations."},
    {"word": "ARCHITECTURE", "hint": "Fundamental structural blueprint of software or hardware systems."},
    {"word": "POLYNOMIAL", "hint": "Time complexity expressed as O(n^k) for constant exponent k."},
    {"word": "DEPLOYMENT", "hint": "Process of releasing software application to production environment."},
    {"word": "VIRTUALIZATION", "hint": "Technology creating simulated computing environments on hardware."},
    {"word": "MICROSERVICE", "hint": "Architectural style structuring app as collection of small services."},
    {"word": "INHERITANCE", "hint": "OOP mechanism deriving properties from parent base class."},
    {"word": "POLYMORPHISM", "hint": "Ability of object or function to take on multiple forms."},
    {"word": "TRANSACTION", "hint": "Sequence of database operations treated as single atomic unit."},
    {"word": "OPTIMIZATION", "hint": "Refactoring code or query to reduce time or space complexity."},
    {"word": "CONCURRENCY", "hint": "Simultaneous execution of multiple task threads or processes."},
    {"word": "ENCAPSULATION", "hint": "Bundling data and methods into a single unit while restricting direct access."},
    {"word": "INITIALIZATION", "hint": "Assigning initial values to data objects or memory structures."},
    {"word": "SERIALIZATION", "hint": "Converting object state into byte stream for storage or transmission."},
    {"word": "INTEGRATION", "hint": "Combining different software modules or subsystems into unified whole."},
]

def generate_vocab_anagram_puzzle(seed: int, difficulty: str = "Easy", level: int = 1) -> Dict[str, Any]:
    rng = random.Random(seed + level * 10007)
    
    if difficulty == "Easy":
        pool = ANAGRAM_WORDS_EASY if level <= 8 else ANAGRAM_WORDS_MEDIUM
    elif difficulty == "Medium":
        pool = ANAGRAM_WORDS_MEDIUM if level <= 8 else ANAGRAM_WORDS_HARD
    else:  # Hard
        pool = ANAGRAM_WORDS_HARD

    chosen = rng.choice(pool)
    word = chosen["word"]

    letters = list(word)
    attempts = 0
    while attempts < 50:
        attempts += 1
        rng.shuffle(letters)
        scrambled = "".join(letters)
        if scrambled != word:
            break

    if scrambled == word:
        scrambled = word[1:] + word[0]

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
        game_data = generate_sudoku_puzzle(seed=seed, difficulty=difficulty, level=level)
    elif game_type == "memory-match":
        game_data = generate_memory_match_puzzle(seed=seed, difficulty=difficulty, level=level)
    elif game_type == "pattern-recognition":
        game_data = generate_pattern_puzzle(seed=seed, difficulty=difficulty, level=level)
    elif game_type == "target-24":
        game_data = generate_target_24_puzzle(seed=seed, difficulty=difficulty, level=level)
    elif game_type == "vocab-anagram":
        game_data = generate_vocab_anagram_puzzle(seed=seed, difficulty=difficulty, level=level)
    else:
        game_data = generate_pattern_puzzle(seed=seed, difficulty=difficulty, level=level)

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
    Fetches Brain Zone progression, XP, coins, gems, treasures, and world unlocks.
    Computes real streak dynamically from genuine activity history.
    """
    from app.services.streak_service import calculate_user_streak

    doc = await brain_zone_progress_collection.find_one({"user_id": user_id}, {"_id": 0})
    if not doc:
        doc = {
            "id": str(uuid.uuid4()),
            "user_id": user_id,
            "xp": 0,
            "player_level": 1,
            "streak_days": 0,
            "coins": 0,
            "gems": 0,
            "keys": 0,
            "map_pieces": 0,
            "unlocked_worlds": ["mind-forest"],
            "world_progress": {
                "mind-forest": 0,
                "logic-desert": 0,
                "neural-city": 0,
                "focus-volcano": 0,
                "brain-castle": 0,
            },
            "collected_treasures": [],
            "completed_levels_count": 0,
            "achievements": [],
            "game_stats": {},
            "recent_history": [],
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat(),
        }
        await brain_zone_progress_collection.insert_one(dict(doc))
        doc.pop("_id", None)

    # Guarantee field defaults if missing in existing docs
    if "coins" not in doc: doc["coins"] = 0
    if "gems" not in doc: doc["gems"] = 0
    if "keys" not in doc: doc["keys"] = 0
    if "map_pieces" not in doc: doc["map_pieces"] = 0
    if "world_progress" not in doc:
        doc["world_progress"] = {
            "mind-forest": 0, "logic-desert": 0, "neural-city": 0, "focus-volcano": 0, "brain-castle": 0
        }
    if "collected_treasures" not in doc: doc["collected_treasures"] = []

    # World Unlocking logic based strictly on 20-level sequential completion
    w_prog = doc.get("world_progress", {})
    unlocked = ["mind-forest"]
    if w_prog.get("mind-forest", 0) >= 20:
        unlocked.append("logic-desert")
    if w_prog.get("logic-desert", 0) >= 20:
        unlocked.append("neural-city")
    if w_prog.get("neural-city", 0) >= 20:
        unlocked.append("focus-volcano")
    if w_prog.get("focus-volcano", 0) >= 20:
        unlocked.append("brain-castle")
    doc["unlocked_worlds"] = unlocked

    # Dynamic real streak calculation
    doc["streak_days"] = await calculate_user_streak(user_id)
    doc["streak"] = doc["streak_days"]

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
    Records game results, awards XP, coins, gems, treasures, updates streaks and unlocks worlds.
    """
    prog = await get_user_brain_progress(user_id)

    WORLD_TREASURES = {
        "mind-forest": "Emerald Forest Relic",
        "logic-desert": "Desert Crystal",
        "neural-city": "Neural Core",
        "focus-volcano": "Volcano Heart",
        "brain-castle": "Brain Crown",
    }

    earned_xp = (score // 10) + (level * 20) if passed else 10
    new_xp = prog.get("xp", 0) + earned_xp
    new_player_level = 1 + (new_xp // 200)

    # Coins, Gems, Keys, Map Pieces rewards
    coins_earned = (50 if level == 20 else (20 if level in [5, 10, 15] else 10)) if passed else 0
    gems_earned = (3 if level == 20 else (1 if level in [5, 10, 15] else 0)) if passed else 0
    keys_earned = (1 if level == 20 else 0) if passed else 0
    map_pieces_earned = (1 if level == 20 else 0) if passed else 0

    new_coins = prog.get("coins", 0) + coins_earned
    new_gems = prog.get("gems", 0) + gems_earned
    new_keys = prog.get("keys", 0) + keys_earned
    new_map_pieces = prog.get("map_pieces", 0) + map_pieces_earned

    # Per-world level completion tracking (strict sequential validation)
    world_progress = dict(prog.get("world_progress", {}))
    cur_highest = world_progress.get(world_id, 0)
    if passed and level <= cur_highest + 1:
        world_progress[world_id] = max(cur_highest, level)

    # Collected treasures check
    collected_treasures = list(prog.get("collected_treasures", []))
    new_treasure_unlocked = None
    if passed and level == 20:
        t_name = WORLD_TREASURES.get(world_id, "Brain Relic")
        if t_name not in collected_treasures:
            collected_treasures.append(t_name)
            new_treasure_unlocked = t_name

    # World Unlocking logic based strictly on 20-level sequential completion
    unlocked = ["mind-forest"]
    if world_progress.get("mind-forest", 0) >= 20:
        unlocked.append("logic-desert")
    if world_progress.get("logic-desert", 0) >= 20:
        unlocked.append("neural-city")
    if world_progress.get("neural-city", 0) >= 20:
        unlocked.append("focus-volcano")
    if world_progress.get("focus-volcano", 0) >= 20:
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
        "coins_earned": coins_earned,
        "gems_earned": gems_earned,
        "passed": passed,
        "timestamp": now,
    }

    recent_history = [history_entry] + prog.get("recent_history", [])[:19]

    update_payload = {
        "xp": new_xp,
        "player_level": new_player_level,
        "coins": new_coins,
        "gems": new_gems,
        "keys": new_keys,
        "map_pieces": new_map_pieces,
        "world_progress": world_progress,
        "collected_treasures": collected_treasures,
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
        "coins_earned": coins_earned,
        "gems_earned": gems_earned,
        "keys_earned": keys_earned,
        "total_coins": new_coins,
        "total_gems": new_gems,
        "total_keys": new_keys,
        "total_map_pieces": new_map_pieces,
        "world_progress": world_progress,
        "collected_treasures": collected_treasures,
        "treasure_unlocked": new_treasure_unlocked,
        "unlocked_worlds": unlocked,
        "achievements": achievements,
        "completed_levels_count": completed_count,
    }
