"""
PlaceMentor AI — Curated Comprehensive Placement Knowledge Base
Rich, structured placement preparation knowledge chunks spanning 41+ dedicated topics:
- All 24 DSA algorithmic patterns & data structures
- All Core CS subjects (OS, DBMS, Computer Networks, OOP, SQL, Software Engineering, Cloud & Security)
- Quantitative & Logical Aptitude shortcuts
- Placement Interview (STAR Framework) & ATS Resume Standards
- Major Company Hiring Blueprints (Amazon, Google, Microsoft, TCS, Infosys, Cognizant, Accenture)
"""

from typing import List, Dict, Any, Optional

KNOWLEDGE_CHUNKS: List[Dict[str, Any]] = [
    # -------------------------------------------------------------
    # DSA PATTERNS & DATA STRUCTURES (24 TOPICS)
    # -------------------------------------------------------------
    {
        "id": "dsa-arrays",
        "category": "DSA & Algorithms",
        "topic": "Arrays",
        "title": "Array Fundamentals, Dynamic Sizing & In-Place Manipulations",
        "keywords": ["array", "arrays", "indexing", "in-place", "contiguous memory", "subarray", "rotation", "cadence"],
        "content": """
Array Fundamentals & Placement Techniques:
- Contiguous block of homogeneous memory offering O(1) random access by index.
- In-place reversal: Swap elements from outside inward using two pointers (O(n) time, O(1) space).
- Dutch National Flag Algorithm: 3-way partitioning for sorting 0s, 1s, and 2s in one pass using low, mid, high pointers.
- Prefix Sums: Precomputing cumulative sums array `prefix[i] = prefix[i-1] + nums[i]` allows O(1) range sum queries `sum(l, r) = prefix[r] - prefix[l-1]`.
- Time Complexity: Access O(1), Search O(n) unindexed / O(log n) sorted, Insertion/Deletion O(n).
""",
        "cheat_sheet": "For contiguous subarray sum queries -> Use Prefix Sum. For 3-way partition -> Dutch National Flag.",
    },
    {
        "id": "dsa-strings",
        "category": "DSA & Algorithms",
        "topic": "Strings",
        "title": "String Manipulation, ASCII Frequency Tables & Pattern Matching",
        "keywords": ["string", "strings", "anagram", "palindrome", "substring", "subsequence", "kmp", "rabin karp", "ascii"],
        "content": """
String Algorithms & Interview Patterns:
- Strings are immutable in Python/Java; building strings repeatedly with concatenation causes O(n²) copy overhead. Use list join or StringBuilder.
- Frequency Array: For lowercase English letters, a fixed 26-element integer array tracks character counts in O(1) auxiliary space.
- Anagram Detection: Compare character frequency counts across both strings in O(n) time and O(1) space.
- Palindrome Verification: Use two pointers at extremities moving inward in O(n) time.
""",
        "cheat_sheet": "Use fixed size array (26 for letters, 128/256 for ASCII) instead of HashMaps for maximum performance.",
    },
    {
        "id": "dsa-hashing",
        "category": "DSA & Algorithms",
        "topic": "Hashing",
        "title": "Hash Tables, Collision Resolution & O(1) Lookups",
        "keywords": ["hash", "hashing", "hash map", "hash set", "hash table", "collision", "chaining", "open addressing", "two sum"],
        "content": """
Hashing & Hash Table Mastery:
- Maps keys to values via a hash function for average O(1) insertion, deletion, and lookup.
- Collision Resolution: Separate Chaining (linked lists / red-black trees in Java 8 HashMap) vs. Open Addressing (Linear/Quadratic Probing, Double Hashing).
- Two Sum Complement Pattern: As you iterate `nums`, check if `target - num` exists in map. If present, return stored index; else record `seen[num] = i`.
- Set Operations: Find union, intersection, and duplicate elements in linear O(n) time.
""",
        "cheat_sheet": "Trade O(n) memory for O(1) time lookups using a Hash Map complement pattern.",
    },
    {
        "id": "dsa-linked-lists",
        "category": "DSA & Algorithms",
        "topic": "Linked Lists",
        "title": "Linked Lists, In-Place Reversal & Fast-Slow Pointers (Floyd's Cycle)",
        "keywords": ["linked list", "linked lists", "singly linked", "doubly linked", "reverse linked list", "floyds cycle", "fast slow", "middle of list"],
        "content": """
Linked List Patterns:
1. Reversal Pattern (Iterative 3-pointer):
   - `prev = None, curr = head`
   - While curr: `next_node = curr.next; curr.next = prev; prev = curr; curr = next_node`
   - Return `prev`. (O(n) time, O(1) space).
2. Floyd's Cycle Detection (Tortoise and Hare):
   - `slow` steps 1 node, `fast` steps 2 nodes. If `slow == fast`, a cycle exists.
   - To find cycle start: Reset `slow = head`. Move both 1 step at a time until they collide at the entry node.
3. Middle of Linked List:
   - Move fast by 2, slow by 1. When fast reaches end, slow is at the middle.
""",
        "cheat_sheet": "Always use a dummy node when head can be deleted or modified.",
    },
    {
        "id": "dsa-stacks",
        "category": "DSA & Algorithms",
        "topic": "Stacks",
        "title": "Stack Fundamentals, Monotonic Stack & Bracket Validation",
        "keywords": ["stack", "stacks", "lifo", "valid parentheses", "monotonic stack", "next greater element", "histogram"],
        "content": """
Stack Applications in Coding Interviews:
- LIFO (Last In First Out) structure with O(1) push, pop, and peek.
- Valid Parentheses: Push opening brackets onto stack. For closing brackets, check if top matches; else invalid.
- Monotonic Stack Pattern:
  - Maintains elements in strictly increasing or decreasing order.
  - Used to find Next Greater Element, Previous Smaller Element, or Largest Rectangle in Histogram in O(n) total time.
""",
        "cheat_sheet": "Whenever looking for the 'next greater / smaller element' in an array -> Monotonic Stack.",
    },
    {
        "id": "dsa-queues",
        "category": "DSA & Algorithms",
        "topic": "Queues",
        "title": "Queue Fundamentals, Deque & Sliding Window Maximum",
        "keywords": ["queue", "queues", "fifo", "deque", "circular queue", "sliding window maximum", "bfs queue"],
        "content": """
Queue Data Structures:
- FIFO (First In First Out) structure with O(1) enqueue and dequeue.
- Monotonic Deque (Double-Ended Queue):
  - Used for Sliding Window Maximum in O(n) time.
  - Store indices in deque. Remove indices outside current window [i - k + 1, i]. Pop from back while `nums[back] <= nums[i]`. Front is always window maximum.
- Circular Queue: Implemented with array and modulo arithmetic `(tail + 1) % size`.
""",
        "cheat_sheet": "Breadth-First Search (BFS) and level-order traversals strictly rely on FIFO Queues.",
    },
    {
        "id": "dsa-trees-bst",
        "category": "DSA & Algorithms",
        "topic": "Trees & BST",
        "title": "Binary Trees, Binary Search Trees (BST) & Lowest Common Ancestor",
        "keywords": ["tree", "trees", "binary tree", "bst", "binary search tree", "lowest common ancestor", "lca", "inorder", "preorder", "postorder"],
        "content": """
Binary Trees & BST Concepts:
- Binary Tree Traversals: Inorder (Left, Root, Right), Preorder (Root, Left, Right), Postorder (Left, Right, Root), Level-Order (BFS with Queue).
- BST Invariant: For every node, `left.val < node.val < right.val`. Inorder traversal of a BST yields strictly sorted values.
- Lowest Common Ancestor (LCA) in BST:
  - If both `p.val` and `q.val` < `curr.val` -> move to `curr.left`.
  - If both `p.val` and `q.val` > `curr.val` -> move to `curr.right`.
  - Otherwise, `curr` is the split point / LCA.
""",
        "cheat_sheet": "Inorder traversal of BST gives sorted order. LCA split point occurs when p and q diverge.",
    },
    {
        "id": "dsa-graphs",
        "category": "DSA & Algorithms",
        "topic": "Graphs",
        "title": "Graph Representations, Adjacency Lists & Connectivity",
        "keywords": ["graph", "graphs", "adjacency list", "adjacency matrix", "directed", "undirected", "connected components", "bipartite", "cycle"],
        "content": """
Graph Representations & Core Properties:
- Adjacency List: `graph = collections.defaultdict(list)` — Space O(V + E). Optimal for sparse graphs.
- Adjacency Matrix: 2D array `matrix[u][v]` — Space O(V²). Fast O(1) edge lookup.
- Graph Cycle Detection:
  - Undirected: DFS tracking visited set and parent pointer (`if neighbor in visited and neighbor != parent: cycle`).
  - Directed: 3-color DFS (White = Unvisited, Gray = In Current Call Stack, Black = Fully Visited).
""",
        "cheat_sheet": "Always track visited nodes to avoid infinite recursion cycles in graph traversals.",
    },
    {
        "id": "dsa-bfs-dfs",
        "category": "DSA & Algorithms",
        "topic": "BFS & DFS",
        "title": "Breadth-First Search (BFS) vs. Depth-First Search (DFS) Patterns",
        "keywords": ["bfs", "dfs", "breadth first search", "depth first search", "number of islands", "shortest path unweighted", "grid traversal"],
        "content": """
BFS & DFS Traversal Comparison:
1. Breadth-First Search (BFS):
   - Uses a Queue (FIFO). Explores nodes level by level.
   - Guarantees shortest path in unweighted graphs or uniform grid steps.
   - Time Complexity: O(V + E), Space: O(V).
2. Depth-First Search (DFS):
   - Uses Recursion / Call Stack (LIFO). Explores as deep as possible before backtracking.
   - Ideal for connected components (e.g. Number of Islands), path existence, topological sorting.
   - Time Complexity: O(V + E), Space: O(V) stack depth.
""",
        "cheat_sheet": "Shortest path in unweighted graph -> BFS. Exhaustive path finding / components -> DFS.",
    },
    {
        "id": "dsa-dijkstra",
        "category": "DSA & Algorithms",
        "topic": "Dijkstra",
        "title": "Dijkstra's Algorithm for Shortest Paths in Weighted Graphs",
        "keywords": ["dijkstra", "shortest path", "weighted graph", "min heap", "priority queue", "relax edge", "negative weights"],
        "content": """
Dijkstra's Shortest Path Algorithm:
- Finds the shortest path from a single source node to all other nodes in a non-negative weighted graph.
- Algorithm:
  1. Initialize `dist = {node: inf}`, `dist[start] = 0`.
  2. Min-Heap stores `(current_distance, node)`.
  3. Pop node with smallest distance. If distance > dist[node], skip (stale entry).
  4. For each neighbor: if `dist[node] + weight < dist[neighbor]`, update `dist[neighbor]` and push to heap.
- Time Complexity: O((V + E) log V) with binary heap.
- Limitation: Does NOT work with negative edge weights (use Bellman-Ford).
""",
        "cheat_sheet": "Use Min-Heap (heapq in Python). Always skip popped distance if > dist[u].",
    },
    {
        "id": "dsa-topological-sort",
        "category": "DSA & Algorithms",
        "topic": "Topological Sort",
        "title": "Topological Sort & Kahn's Algorithm (DAG Scheduling)",
        "keywords": ["topological sort", "kahns algorithm", "dag", "course schedule", "in-degree", "dependency resolution"],
        "content": """
Topological Sort on Directed Acyclic Graphs (DAG):
- Linear ordering of vertices such that for every directed edge u -> v, u comes before v.
- Kahn's Algorithm (BFS-based):
  1. Calculate `in_degree` for all vertices.
  2. Enqueue all vertices with `in_degree == 0`.
  3. While queue: pop `u`, append to result. For neighbor `v`, `in_degree[v] -= 1`. If `in_degree[v] == 0`, enqueue `v`.
  4. If processed count != total vertices, the graph has a cycle!
- Time Complexity: O(V + E), Space: O(V + E).
""",
        "cheat_sheet": "Kahn's Algorithm is the go-to pattern for course prerequisite and package build dependency problems.",
    },
    {
        "id": "dsa-binary-search",
        "category": "DSA & Algorithms",
        "topic": "Binary Search",
        "title": "Binary Search on Arrays & Monotonic Value Spaces",
        "keywords": ["binary search", "search in rotated sorted array", "log n", "lower bound", "upper bound", "search space"],
        "content": """
Binary Search Standard Template & Rotated Arrays:
- Search space must be monotonic (sorted array or boolean predicate FFFTTT).
- Safe mid computation: `mid = left + (right - left) // 2`.
- In Rotated Sorted Arrays:
  1. Determine which half is sorted: if `nums[left] <= nums[mid]`, left half is sorted; else right half is sorted.
  2. Check if target lies within the boundaries of the sorted half.
  3. Narrow search window accordingly.
- Time Complexity: O(log n), Space: O(1).
""",
        "cheat_sheet": "Can apply binary search on answers (e.g. min capacity, split array largest sum) if predicate is monotonic.",
    },
    {
        "id": "dsa-two-pointers",
        "category": "DSA & Algorithms",
        "topic": "Two Pointers",
        "title": "Two Pointers Technique for Sorted Arrays & In-Place Swaps",
        "keywords": ["two pointers", "left right", "sorted array", "3sum", "container with most water", "trap rain water"],
        "content": """
Two Pointers Technique:
- Place pointers at `left = 0` and `right = len(arr) - 1`.
- Adjust pointers inward based on comparison with target (e.g. `sum < target -> left++`, `sum > target -> right--`).
- Container With Most Water: Move the pointer with the smaller height inward at each step to attempt finding a larger area.
- Trapping Rain Water: Maintain `left_max` and `right_max` boundaries, incrementing the smaller boundary.
- Time Complexity: O(n), Space: O(1).
""",
        "cheat_sheet": "When array is sorted and you need pair/triplet sums -> Two Pointers eliminates an entire O(n) dimension.",
    },
    {
        "id": "dsa-sliding-window",
        "category": "DSA & Algorithms",
        "topic": "Sliding Window",
        "title": "Sliding Window for Contiguous Substrings & Subarrays",
        "keywords": ["sliding window", "longest substring", "minimum window substring", "subarray sum", "frequency map"],
        "content": """
Sliding Window Pattern:
- Used for contiguous subarray or substring problems with constraints (e.g. max sum of size k, longest substring without repeats).
- Template:
  ```python
  def sliding_window(s):
      seen = {}
      left = max_len = 0
      for right, char in enumerate(s):
          if char in seen and seen[char] >= left:
              left = seen[char] + 1
          seen[char] = right
          max_len = max(max_len, right - left + 1)
      return max_len
  ```
- Time Complexity: O(n) because left and right each advance at most n times.
""",
        "cheat_sheet": "Expand window with right pointer; contract from left when constraint is violated.",
    },
    {
        "id": "dsa-prefix-sum",
        "category": "DSA & Algorithms",
        "topic": "Prefix Sum",
        "title": "Prefix Sums & Range Sum Query Optimization",
        "keywords": ["prefix sum", "range sum query", "subarray sum equals k", "cumulative sum", "difference array"],
        "content": """
Prefix Sum Technique:
- Compute cumulative sums: `prefix[i] = prefix[i-1] + nums[i]`.
- Range sum from index `l` to `r`: `sum(l, r) = prefix[r] - prefix[l-1]`.
- Subarray Sum Equals K:
  - Maintain running `curr_sum` and a Hash Map of `{prefix_sum: count}` initialized with `{0: 1}`.
  - At each index, `count += prefix_map.get(curr_sum - k, 0)`.
  - Allows solving in O(n) time and O(n) space instead of O(n²).
""",
        "cheat_sheet": "Subarray sum equals k uses `prefix_map[curr_sum - k]` with `{0: 1}` base case.",
    },
    {
        "id": "dsa-recursion",
        "category": "DSA & Algorithms",
        "topic": "Recursion",
        "title": "Recursion Fundamentals, Call Stack & Base Cases",
        "keywords": ["recursion", "recursive", "call stack", "base case", "divide and conquer", "fibonacci", "tower of hanoi"],
        "content": """
Recursion Principles:
- A function that solves smaller subproblems by calling itself until reaching a terminating Base Case.
- Call Stack: Each recursive invocation pushes an activation record (local variables, return address) onto the OS stack.
- Stack Overflow occurs when recursion exceeds memory limit or lacks proper base cases.
- Tail Recursion: When the recursive call is the final operation, allowing compiler optimization into iterative loops.
""",
        "cheat_sheet": "Always define the base case first. Identify the recurrence relation and trust the recursive leap of faith.",
    },
    {
        "id": "dsa-backtracking",
        "category": "DSA & Algorithms",
        "topic": "Backtracking",
        "title": "Backtracking, State Space Trees & Pruning (N-Queens, Permutations, Subsets)",
        "keywords": ["backtracking", "permutations", "subsets", "combination sum", "n queens", "sudoku solver", "pruning"],
        "content": """
Backtracking Template:
- Explores all candidate solutions in a state space tree, abandoning (pruning) branches as soon as they violate constraints.
- Universal Template:
  ```python
  def backtrack(path, start, choices):
      if is_solution(path):
          result.append(list(path))
          return
      for i in range(start, len(choices)):
          if not is_valid(choices[i]):
              continue  # Prune invalid branches
          path.append(choices[i])  # Choose
          backtrack(path, i + 1, choices)  # Explore
          path.pop()  # Un-choose (Backtrack)
  ```
""",
        "cheat_sheet": "Choose -> Explore -> Un-choose (pop). Prune early with validity checks to cut exponential runtime.",
    },
    {
        "id": "dsa-greedy",
        "category": "DSA & Algorithms",
        "topic": "Greedy",
        "title": "Greedy Algorithms & Optimal Substructure",
        "keywords": ["greedy", "activity selection", "jump game", "fractional knapsack", "gas station", "interval scheduling"],
        "content": """
Greedy Algorithm Principles:
- Builds up a solution piece by piece, always choosing the locally optimal choice hoping it leads to a global optimum.
- Requires:
  1. Greedy Choice Property: Globally optimal solution can be reached by local greedy choices.
  2. Optimal Substructure: Optimal solution to problem contains optimal solutions to subproblems.
- Classic Examples: Interval Scheduling (sort by end time), Jump Game (track max reachable index), Fractional Knapsack (sort by value/weight).
""",
        "cheat_sheet": "If sorting by start/end/ratio allows making one irrevocable best decision -> Greedy is viable.",
    },
    {
        "id": "dsa-dynamic-programming",
        "category": "DSA & Algorithms",
        "topic": "Dynamic Programming",
        "title": "Dynamic Programming Framework (Memoization & Tabulation)",
        "keywords": ["dynamic programming", "dp", "memoization", "tabulation", "optimal substructure", "overlapping subproblems", "state transition"],
        "content": """
Dynamic Programming 4-Step Framework:
1. Define State: `dp[i]` representing the optimal answer for subproblem of size i.
2. State Transition Equation: Express `dp[i]` in terms of previously solved states `dp[i-1]`, `dp[i-2]`, etc.
3. Base Cases: Initialize `dp[0]` or edge conditions.
4. Order of Computation: Bottom-up iteration or top-down recursion with memoization cache.
""",
        "cheat_sheet": "Top-down with `@functools.lru_cache` for quick drafting; Bottom-up array for optimal O(1)/O(n) auxiliary memory.",
    },
    {
        "id": "dsa-knapsack",
        "category": "DSA & Algorithms",
        "topic": "Knapsack",
        "title": "0/1 Knapsack & Unbounded Knapsack (Coin Change)",
        "keywords": ["knapsack", "0/1 knapsack", "unbounded knapsack", "coin change", "subset sum", "partition equal subset"],
        "content": """
Knapsack DP Variants:
1. 0/1 Knapsack (Items used at most once):
   - `dp[i][w] = max(dp[i-1][w], val[i-1] + dp[i-1][w - wt[i-1]])`
   - Space Optimization: 1D array iterating weight backwards `for w in range(W, wt-1, -1)`.
2. Unbounded Knapsack (Items can be reused infinitely):
   - `dp[w] = max(dp[w], val + dp[w - wt])` — iterate weight forwards `for w in range(wt, W+1)`.
   - Coin Change 1 (Min coins): `dp[a] = min(dp[a], 1 + dp[a - coin])`.
""",
        "cheat_sheet": "0/1 Knapsack: iterate 1D table backwards. Unbounded / Coin Change: iterate forwards.",
    },
    {
        "id": "dsa-lis",
        "category": "DSA & Algorithms",
        "topic": "Longest Increasing Subsequence",
        "title": "Longest Increasing Subsequence (LIS) — O(n²) DP & O(n log n) Patience Sorting",
        "keywords": ["lis", "longest increasing subsequence", "patience sorting", "bisect", "binary search dp", "russian doll"],
        "content": """
Longest Increasing Subsequence (LIS):
- Standard DP: `dp[i] = max(1, dp[j] + 1)` for all `j < i` with `nums[j] < nums[i]`. Time O(n²), Space O(n).
- Optimal O(n log n) with Patience Sorting & Binary Search:
  - Maintain array `tails` where `tails[i]` stores smallest tail of all increasing subsequences of length `i+1`.
  - For each `x` in `nums`, binary search for insertion position using `bisect_left(tails, x)`.
  - If `idx == len(tails)`: `tails.append(x)`. Else `tails[idx] = x`.
  - Length of `tails` is the length of LIS.
""",
        "cheat_sheet": "Use `bisect_left` on a `tails` array for optimal O(n log n) LIS computation.",
    },
    {
        "id": "dsa-lcs",
        "category": "DSA & Algorithms",
        "topic": "Longest Common Subsequence",
        "title": "Longest Common Subsequence (LCS) & Edit Distance",
        "keywords": ["lcs", "longest common subsequence", "edit distance", "levenshtein", "string dp"],
        "content": """
2D String Dynamic Programming:
1. Longest Common Subsequence (LCS):
   - If `s1[i-1] == s2[j-1]`: `dp[i][j] = 1 + dp[i-1][j-1]`
   - Else: `dp[i][j] = max(dp[i-1][j], dp[i][j-1])`
   - Base case: `dp[0][j] = 0, dp[i][0] = 0`. Time & Space O(m * n).
2. Edit Distance (Levenshtein Distance):
   - If `s1[i-1] == s2[j-1]`: `dp[i][j] = dp[i-1][j-1]`
   - Else: `dp[i][j] = 1 + min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1])` (Insert, Delete, Replace).
""",
        "cheat_sheet": "Matches go diagonally (`1 + dp[i-1][j-1]`). Mismatches take best of adjacent cells (`max/min`).",
    },
    {
        "id": "dsa-heaps",
        "category": "DSA & Algorithms",
        "topic": "Heaps",
        "title": "Heaps, Priority Queues & Top K Frequent Elements",
        "keywords": ["heap", "heaps", "priority queue", "heapq", "kth largest", "top k", "min heap", "max heap", "median finder"],
        "content": """
Heap / Priority Queue Patterns:
- Complete Binary Tree satisfying heap property: parent <= children (Min-Heap) or parent >= children (Max-Heap).
- Operations: Insert O(log n), Extract Min/Max O(log n), Peek O(1), Heapify O(n).
- Python's `heapq` module implements a Min-Heap by default. For Max-Heap, invert values (`-val`).
- Top K Elements: Maintain Min-Heap of size K. Push elements; whenever size > K, `heappop()`. Heap will contain K largest elements.
""",
        "cheat_sheet": "To find K largest elements -> use Min-Heap of size K. To find K smallest -> use Max-Heap of size K.",
    },
    {
        "id": "dsa-intervals",
        "category": "DSA & Algorithms",
        "topic": "Intervals",
        "title": "Intervals Manipulation, Overlap Merging & Meeting Rooms",
        "keywords": ["intervals", "merge intervals", "insert interval", "meeting rooms", "non-overlapping", "sorting intervals"],
        "content": """
Intervals Algorithm Patterns:
1. Merge Intervals:
   - Sort intervals by start time: `intervals.sort(key=lambda x: x[0])`.
   - If `merged[-1][1] >= interval[0]`, overlap exists -> `merged[-1][1] = max(merged[-1][1], interval[1])`.
   - Else append `interval` to `merged`. (Time O(n log n), Space O(n)).
2. Meeting Rooms II (Min conference rooms needed):
   - Separate start times and end times into sorted arrays. Use two pointers or Min-Heap of active end times.
""",
        "cheat_sheet": "Always sort intervals by start time first before merging or checking overlaps.",
    },

    # -------------------------------------------------------------
    # CORE COMPUTER SCIENCE SUBJECTS (7 TOPICS)
    # -------------------------------------------------------------
    {
        "id": "core-os",
        "category": "Core Computer Science",
        "topic": "Operating Systems",
        "title": "Operating Systems: Processes, Threads, CPU Scheduling, Virtual Memory & Deadlocks",
        "keywords": ["os", "operating systems", "process", "thread", "scheduling", "paging", "virtual memory", "deadlock", "mutex", "semaphore", "context switch", "bankers algorithm"],
        "content": """
Operating Systems Placement Concepts:
1. Process vs. Thread:
   - Process: Independent executing program instance with its own private address space (Text, Data, Heap, Stack).
   - Thread: Lightweight execution unit sharing code, data, and OS resources with sibling threads, but retaining its own private stack and registers.
2. CPU Scheduling: Round Robin (time quantum), FCFS, SJF (Shortest Job First), Multilevel Feedback Queue.
3. Concurrency Synchronization:
   - Mutex: Mutual exclusion binary lock with ownership.
   - Semaphore: Signaling mechanism with integer counter (`P` wait / `V` signal).
4. Deadlock 4 Coffman Conditions: Mutual Exclusion, Hold & Wait, No Preemption, Circular Wait. Handled via Banker's Algorithm or Lock Ordering.
5. Virtual Memory & Paging: Translates logical addresses to physical RAM via Page Tables and TLB (Translation Lookaside Buffer). Page fault occurs when requested page is on disk. Page replacement algorithms: LRU, FIFO, Optimal.
""",
        "cheat_sheet": "Deadlock requires all 4 Coffman conditions simultaneously. Break circular wait with ordered locking.",
    },
    {
        "id": "core-dbms",
        "category": "Core Computer Science",
        "topic": "DBMS",
        "title": "Database Management Systems: ACID Transactions, Normalization & B+ Tree Indexing",
        "keywords": ["dbms", "database", "acid", "transactions", "normalization", "1nf", "2nf", "3nf", "bcnf", "indexing", "b+ tree", "isolation levels", "concurrency control"],
        "content": """
DBMS Core Interview Fundamentals:
1. ACID Properties:
   - Atomicity: All operations in a transaction succeed, or all roll back (WAL - Write-Ahead Logging).
   - Consistency: Database moves from one valid state to another, preserving constraints.
   - Isolation: Concurrent transactions do not interfere (Read Uncommitted, Read Committed, Repeatable Read, Serializable).
   - Durability: Committed transactions persist even across power failures.
2. Normalization:
   - 1NF: Atomic values, no repeating groups.
   - 2NF: 1NF + No partial functional dependency on composite key.
   - 3NF: 2NF + No transitive functional dependency (A -> B -> C).
   - BCNF: For every functional dependency X -> Y, X must be a super key.
3. Indexing & B+ Trees: Balanced multi-way search trees with all data records stored at leaf nodes linked sequentially for O(log n) searches and efficient range scans.
""",
        "cheat_sheet": "B+ Trees store data pointers only at leaf nodes, maximizing branching factor and range query performance.",
    },
    {
        "id": "core-networks",
        "category": "Core Computer Science",
        "topic": "Computer Networks",
        "title": "Computer Networks: OSI 7 Layers, TCP/IP, 3-Way Handshake & HTTP/HTTPS",
        "keywords": ["networks", "computer networks", "tcp", "udp", "osi", "http", "https", "3-way handshake", "dns", "ssl", "tls", "routing", "ip"],
        "content": """
Computer Networks Placement Guide:
1. OSI 7 Layers: Physical -> Data Link -> Network -> Transport -> Session -> Presentation -> Application.
2. TCP vs. UDP:
   - TCP (Transmission Control Protocol): Connection-oriented, reliable, ordered, flow-controlled (sliding window), error-checked.
   - UDP (User Datagram Protocol): Connectionless, fast, lightweight, unreliable (ideal for live video, DNS, gaming).
3. TCP 3-Way Handshake:
   - Step 1: Client sends `SYN` (seq = x).
   - Step 2: Server responds `SYN-ACK` (seq = y, ack = x + 1).
   - Step 3: Client sends `ACK` (seq = x + 1, ack = y + 1). Connection established.
4. HTTP vs. HTTPS: HTTPS encrypts traffic over TLS/SSL using asymmetric key exchange (RSA/Diffie-Hellman) followed by symmetric AES session encryption on port 443.
""",
        "cheat_sheet": "TCP 3-way handshake: SYN -> SYN-ACK -> ACK. HTTPS uses TLS asymmetric handshake + symmetric payload.",
    },
    {
        "id": "core-oop",
        "category": "Core Computer Science",
        "topic": "OOP",
        "title": "Object-Oriented Programming & SOLID Design Principles",
        "keywords": ["oop", "object oriented", "inheritance", "polymorphism", "encapsulation", "abstraction", "solid", "design patterns", "singleton", "factory"],
        "content": """
Object-Oriented Programming & Design Patterns:
1. 4 Core Pillars:
   - Encapsulation: Bundling data and methods into objects with restricted direct access (getters/setters).
   - Abstraction: Hiding internal implementation details and exposing only essential interfaces.
   - Inheritance: Reusing attributes and behaviors from a base class (is-a relationship).
   - Polymorphism: Compile-time (Method Overloading) vs. Runtime (Method Overriding with dynamic dispatch).
2. SOLID Principles:
   - S: Single Responsibility (one reason to change).
   - O: Open/Closed (open for extension, closed for modification).
   - L: Liskov Substitution (subtypes must be substitutable for base types).
   - I: Interface Segregation (small, specific interfaces over fat interfaces).
   - D: Dependency Inversion (depend on abstractions, not concrete implementations).
""",
        "cheat_sheet": "Prefer composition over inheritance. Follow SOLID principles for maintainable object design.",
    },
    {
        "id": "core-sql",
        "category": "Core Computer Science",
        "topic": "SQL",
        "title": "SQL Queries: Joins, Aggregations, Group By, Subqueries & Window Functions",
        "keywords": ["sql", "join", "inner join", "left join", "group by", "having", "subquery", "window functions", "row_number", "rank", "dense_rank"],
        "content": """
SQL Interview Query Patterns:
1. JOIN Types:
   - INNER JOIN: Matches rows present in both tables.
   - LEFT JOIN: All rows from left table + matched rows from right table (null if unmatched).
   - FULL OUTER JOIN: All rows from both tables.
2. GROUP BY & HAVING:
   - `GROUP BY` aggregates rows with identical values in specified columns.
   - `WHERE` filters rows before aggregation; `HAVING` filters aggregated groups (e.g. `HAVING COUNT(*) > 1`).
3. Window Functions:
   - `ROW_NUMBER() OVER (PARTITION BY dept_id ORDER BY salary DESC)` — unique sequential integer.
   - `DENSE_RANK()` — ranks without gaps for identical values.
""",
        "cheat_sheet": "WHERE filters before aggregation; HAVING filters after aggregation. Use DENSE_RANK for Nth highest salary.",
    },
    {
        "id": "core-software-engineering",
        "category": "Core Computer Science",
        "topic": "Software Engineering",
        "title": "Software Engineering: SDLC, Agile / Scrum, CI/CD & Testing Strategies",
        "keywords": ["software engineering", "sdlc", "agile", "scrum", "ci/cd", "unit testing", "integration testing", "git", "clean code", "refactoring"],
        "content": """
Software Engineering & Development Best Practices:
1. SDLC Models: Agile/Scrum (iterative 2-week sprints, daily standups, retrospectives) vs. Waterfall (sequential phases).
2. Testing Pyramid:
   - Unit Tests: Fast, isolated verification of individual functions/classes (largest volume).
   - Integration Tests: Testing database, API, and component interactions.
   - E2E / System Tests: Full browser / end-to-end workflow validation.
3. CI/CD (Continuous Integration & Continuous Deployment): Automated build, linting, test execution, and deployment pipelines on every git push.
4. Git Version Control: Feature branching, pull requests, semantic commits, rebase vs. merge.
""",
        "cheat_sheet": "Agile emphasizes iterative delivery, customer feedback, and automated CI/CD testing pipelines.",
    },
    {
        "id": "core-cloud-security",
        "category": "Core Computer Science",
        "topic": "Cloud & Cybersecurity Basics",
        "title": "Cloud Architecture & Application Security Basics",
        "keywords": ["cloud", "security", "aws", "azure", "iaas", "paas", "saas", "cybersecurity", "jwt", "oauth", "owasp", "sql injection", "xss", "cors"],
        "content": """
Cloud Architecture & Application Security Basics:
1. Cloud Service Models:
   - IaaS (Infrastructure as a Service): AWS EC2, Azure VMs — raw virtualized hardware.
   - PaaS (Platform as a Service): Heroku, AWS Elastic Beanstalk — managed runtime.
   - SaaS (Software as a Service): Google Workspace, Salesforce — end-user apps.
2. Web Application Security (OWASP Top 10):
   - SQL Injection: Mitigated using parameterized queries / prepared statements (never string concatenation).
   - Cross-Site Scripting (XSS): Sanitizing user HTML inputs and using Content Security Policy.
   - Cross-Origin Resource Sharing (CORS): HTTP headers defining which external domains can access backend APIs.
   - Authentication: JWT (JSON Web Tokens) with signed cryptographic claims for stateless session management.
""",
        "cheat_sheet": "Never concatenate raw inputs into SQL queries; always use parameterized queries to prevent SQL Injection.",
    },

    # -------------------------------------------------------------
    # APTITUDE & PLACEMENT INTERVIEW PREPARATION (4 TOPICS)
    # -------------------------------------------------------------
    {
        "id": "aptitude-quantitative",
        "category": "Aptitude & Reasoning",
        "topic": "Quantitative Aptitude",
        "title": "Quantitative Aptitude Formulas, Shortcuts & Calculation Tricks",
        "keywords": ["aptitude", "quantitative", "percentages", "profit loss", "time work", "time speed distance", "ratios", "probability", "permutations"],
        "content": """
Quantitative Aptitude Formula Sheet & Shortcuts:
1. Percentages & Profit/Loss:
   - Successive Percentage: Net % change = `a + b + (a * b) / 100`.
   - Profit % = `(Profit / Cost Price) * 100`. Selling Price = `CP * (100 + P%) / 100`.
2. Time & Work:
   - If A does work in X days and B in Y days, together they take `(X * Y) / (X + Y)` days.
   - Efficiency is inversely proportional to time taken.
3. Time, Speed & Distance:
   - Average Speed for equal distance trips with speeds u and v = `2 * u * v / (u + v)`.
   - Convert km/h to m/s: multiply by `5/18`.
4. Probability & Combinations:
   - `nCr = n! / (r! * (n-r)!)` for selections; `nPr = n! / (n-r)!` for ordered arrangements.
""",
        "cheat_sheet": "Two workers together take (X * Y) / (X + Y) days. Average speed for equal distance = 2uv / (u + v).",
    },
    {
        "id": "aptitude-logical",
        "category": "Aptitude & Reasoning",
        "topic": "Logical Reasoning",
        "title": "Logical Reasoning, Syllogisms, Blood Relations & Data Interpretation",
        "keywords": ["logical reasoning", "syllogism", "blood relations", "coding decoding", "data interpretation", "direction sense", "seating arrangement"],
        "content": """
Logical Reasoning Strategies:
1. Syllogisms (Venn Diagram Method):
   - 'All A are B' -> Circle A is completely inside Circle B.
   - 'Some A are B' -> Circle A and B overlap.
   - 'No A are B' -> Circle A and B are disjoint.
2. Blood Relations: Use tree hierarchy (horizontal lines for siblings/spouses, vertical lines for parent-child).
3. Seating Arrangements: Always place fixed reference points first (e.g. 'A sits second to left of B'), then fill remaining constraints.
4. Data Interpretation: Read axis labels, scale units, and perform round-number estimation to eliminate incorrect options rapidly.
""",
        "cheat_sheet": "In logical seating puzzles, always lock in definite anchor positions before evaluating conditional clues.",
    },
    {
        "id": "prep-star-method",
        "category": "Placement & Interviews",
        "topic": "Interview & STAR Method",
        "title": "Behavioral Interviews & The STAR Method Framework",
        "keywords": ["star method", "behavioral", "hr interview", "leadership principles", "amazon star", "conflict resolution", "storytelling", "strengths weaknesses"],
        "content": """
Mastering the STAR Method for Behavioral & HR Rounds:
1. S - Situation: Set the context briefly (15-20 seconds). Company/project, team size, timeline, and the business problem.
2. T - Task: Define your specific responsibility and what needed to be achieved.
3. A - Action: Describe the concrete steps YOU took (60-70% of the answer). Highlight technical decisions, leadership, problem solving, and conflict management. Use 'I' instead of 'We'.
4. R - Result: Quantify your outcome with numbers! (e.g. 'Reduced latency by 35%', 'Onboarded 10,000 users', 'Delivered 2 weeks ahead of schedule').
""",
        "cheat_sheet": "Spend 60% of time on Actions you took and quantify the Result with concrete numbers/percentages.",
    },
    {
        "id": "prep-ats-resume",
        "category": "Placement & Interviews",
        "topic": "ATS Resume Standards",
        "title": "ATS-Compliant Resume Architecture, Action Verbs & Bullet Points",
        "keywords": ["resume", "ats", "applicant tracking system", "bullet points", "action verbs", "quantified impact", "resume format"],
        "content": """
Engineering ATS Resume Best Practices:
1. Layout Rules: Single column, standard fonts (Inter, Arial, Calibri), 1 page for freshers, export to clean PDF.
2. XYZ Formula for Bullet Points (Google Standard):
   - 'Accomplished [X] as measured by [Y], by doing [Z].'
   - Example: 'Optimized database search latency by 45% (Y) by implementing Redis caching and indexing on MongoDB (Z), serving 50k requests/min (X).'
3. Strong Action Verbs: Engineered, Architected, Deployed, Automated, Optimized, Spearheaded, Refactored.
4. Key Sections: Header (GitHub, LinkedIn, Portfolio), Technical Skills (Languages, Frameworks, Developer Tools), Projects (2-3 in-depth), Education, Experience/Certifications.
""",
        "cheat_sheet": "Use the Google XYZ formula: 'Accomplished [X] as measured by [Y], by doing [Z]' with quantified metrics.",
    },

    # -------------------------------------------------------------
    # COMPANY HIRING BLUEPRINTS (7 COMPANIES)
    # -------------------------------------------------------------
    {
        "id": "company-amazon",
        "category": "Company Preparation",
        "topic": "Amazon",
        "title": "Amazon Campus Hiring Blueprint & SDE-1 Interview Preparation",
        "keywords": ["amazon", "amazon sde", "aws", "leadership principles", "online assessment", "debugging round", "trees graphs dp"],
        "content": """
Amazon SDE-1 Campus Preparation Strategy:
1. Online Assessment (OA):
   - 2 Coding Questions (90 mins): Medium-Hard DSA (Trees, Graphs, Sliding Window, DP).
   - Work Style Assessment: Evaluates alignment with Amazon 16 Leadership Principles.
2. Technical Rounds:
   - Heavy focus on Trees (Binary Tree, BST, LCA), Graphs (BFS/DFS, Topological Sort), Dynamic Programming, and Heap/Priority Queue.
   - Code must be production quality with optimal asymptotic complexity and modular helper methods.
3. Leadership Principles Integration:
   - Every round allocates 15-20 minutes to behavioral questions evaluated via the STAR method.
   - Top Principles tested: Customer Obsession, Ownership, Bias for Action, Dive Deep, Deliver Results.
""",
        "cheat_sheet": "Prepare 2 STAR stories for every major Amazon Leadership Principle. Focus heavily on Trees, Graphs, and DP.",
    },
    {
        "id": "company-google",
        "category": "Company Preparation",
        "topic": "Google",
        "title": "Google SWE Campus Hiring Blueprint & Algorithmic Rigor",
        "keywords": ["google", "google swe", "kickstart", "algorithmic complexity", "graph algorithms", "dynamic programming", "googleyness"],
        "content": """
Google SWE Campus Preparation Blueprint:
1. Algorithmic Rigor:
   - High expectations on asymptotic time and space optimization, edge cases, and mathematical properties.
   - Key topics: Graph traversals (Dijkstra, Topological Sort, Disjoint Set Union), Advanced DP, Two Pointers, String Algorithms, Binary Search on Value Space.
2. Problem Solving Flow:
   - Clarify constraints and ask clarifying questions first.
   - Propose brute-force approach and explain why it is suboptimal.
   - Derive the optimal algorithm and verify complexity before writing code.
   - Walk through code with a dry-run test case manually.
3. Googleyness: Collaboration, intellectual humility, receptivity to feedback, and passion for technology.
""",
        "cheat_sheet": "Always state time/space complexity before and after coding. Walk through edge cases without being prompted.",
    },
    {
        "id": "company-microsoft",
        "category": "Company Preparation",
        "topic": "Microsoft",
        "title": "Microsoft Software Engineer Campus Preparation Blueprint",
        "keywords": ["microsoft", "microsoft sde", "codility", "binary search", "linked lists", "trees", "oop", "os concurrency"],
        "content": """
Microsoft Campus Preparation Strategy:
1. Online Assessment (Codility):
   - 3 DSA questions in 75-90 minutes focusing on string manipulation, array indexing, and greedy/pointers.
2. Technical Rounds:
   - Classic Data Structures: Linked Lists, Binary Trees, Stacks, Binary Search, and Hash Maps.
   - Core CS Depth: Strong questions on Operating Systems (Processes vs. Threads, Concurrency, Deadlocks), DBMS (ACID, Normalization, SQL), and OOP Design.
   - Clean, readable, well-commented code with robust error checking.
""",
        "cheat_sheet": "Microsoft emphasizes solid fundamentals: Linked Lists, Trees, OOP design, and Operating System concurrency.",
    },
    {
        "id": "company-tcs",
        "category": "Company Preparation",
        "topic": "TCS",
        "title": "TCS Campus Hiring Blueprint (Ninja, Digital & Prime SDE)",
        "keywords": ["tcs", "tcs nqt", "tcs digital", "tcs ninja", "tcs prime", "numerical aptitude", "reasoning", "coding"],
        "content": """
TCS Campus Hiring & NQT Preparation:
1. TCS NQT Online Test Structure:
   - Part A: Foundation Section (Numerical Ability, Reasoning Ability, Verbal Ability) — Speed and accuracy are critical.
   - Part B: Advanced Section (Advanced Quantitative, Advanced Reasoning, Advanced Coding — 2 problems).
2. Coding Round:
   - Problem 1: Basic Array / String manipulation / Number theory (e.g. palindrome, matrix rotation, prime factors).
   - Problem 2: Medium DSA (Two Pointers, Hash Maps, Sorting, DP basics).
3. Technical & MR Interview:
   - Project walkthrough, SQL Joins & Group By queries, OOP Concepts (Polymorphism, Inheritance), Basic Data Structures.
""",
        "cheat_sheet": "TCS NQT requires high speed in Quantitative Aptitude. Master standard Math formulas and Array manipulation.",
    },
    {
        "id": "company-infosys",
        "category": "Company Preparation",
        "topic": "Infosys",
        "title": "Infosys Campus Hiring Blueprint (Specialist Programmer & SE)",
        "keywords": ["infosys", "infosys sp", "infosys dse", "infytq", "hackwithinfy", "speed math", "dbms"],
        "content": """
Infosys Campus Hiring Preparation:
1. Entry Tracks:
   - System Engineer (SE): Online test covering Quantitative, Reasoning, Verbal, Pseudocode, and Puzzle Solving.
   - Specialist Programmer (SP) & Digital Specialist Engineer (DSE): HackWithInfy coding competition / InfyTQ (3 Competitive Programming questions: DP, Graphs, Greedy).
2. Key Topics for Infosys:
   - Speed Arithmetic (Time & Work, Profit & Loss, Speed Distance).
   - Java / Python fundamentals, OOP encapsulation, Exception Handling.
   - Relational Database Management (SQL queries, 1NF to 3NF Normalization).
""",
        "cheat_sheet": "For Infosys SP/DSE, master Dynamic Programming and Graph algorithms. For SE, focus on Speed Math and Pseudocode.",
    },
    {
        "id": "company-cognizant",
        "category": "Company Preparation",
        "topic": "Cognizant",
        "title": "Cognizant GenC, Elevate & Next Campus Preparation Blueprint",
        "keywords": ["cognizant", "genc", "genc elevate", "genc next", "analytical aptitude", "debugging", "sql queries"],
        "content": """
Cognizant Campus Recruitment Strategy:
1. Hiring Streams:
   - GenC: Analytical aptitude, English comprehension, and basic programming logic.
   - GenC Elevate: Advanced coding, database queries, and web/cloud concepts.
   - GenC Next: Full-stack skills, advanced algorithmic problem solving.
2. Technical Focus:
   - Quantitative & Logical Reasoning (Syllogisms, Blood Relations, Data Interpretation).
   - Programming: Loops, Strings, Array frequency counting, Sorting.
   - DBMS: SQL aggregate queries, Primary/Foreign keys, Indexing.
""",
        "cheat_sheet": "Cognizant places high weight on analytical reasoning and foundational SQL/OOP programming logic.",
    },
    {
        "id": "company-accenture",
        "category": "Company Preparation",
        "topic": "Accenture",
        "title": "Accenture Advanced ASE & ASE Campus Hiring Blueprint",
        "keywords": ["accenture", "ase", "advanced ase", "pseudocode", "critical reasoning", "cloud security", "communication test"],
        "content": """
Accenture Campus Recruitment Blueprint:
1. Assessment Rounds:
   - Stage 1: Cognitive Assessment (English, Critical Reasoning & Problem Solving, Abstract Reasoning) + Technical Assessment (Pseudocode, Common Application & MS Office, Cloud & Network Security).
   - Stage 2: Coding Assessment (2 questions in 45 mins: String manipulation, Array search, Basic Math).
   - Stage 3: Communication Assessment (Automated AI tool evaluating Pronunciation, Fluency, Vocabulary, and Active Listening).
2. Key Preparation:
   - Pseudocode debugging (bitwise operators, nested loops, condition tracing).
   - Cloud & Cybersecurity basics (IaaS/PaaS, encryption, firewalls, HTTP/HTTPS).
""",
        "cheat_sheet": "Accenture includes an exclusive Pseudocode and Cloud Security technical section alongside automated Communication testing.",
    },
]


def get_all_chunks() -> List[Dict[str, Any]]:
    """Returns all curated knowledge chunks."""
    return list(KNOWLEDGE_CHUNKS)


def get_chunk_by_id(chunk_id: str) -> Optional[Dict[str, Any]]:
    """Returns a specific knowledge chunk by ID."""
    return next((c for c in KNOWLEDGE_CHUNKS if c["id"] == chunk_id), None)


def get_unique_topics() -> List[Dict[str, Any]]:
    """Returns curated list of topic categories and starter prompts for the AI Mentor UI."""
    category_icons = {
        "Data Structures & Algorithms": "Code2",
        "Computer Science Fundamentals": "Cpu",
        "Aptitude & Soft Skills": "BrainCircuit",
        "Company Preparation": "Building2",
    }

    seen = set()
    topics = []
    for chunk in KNOWLEDGE_CHUNKS:
        topic_name = chunk.get("topic", chunk.get("title", ""))
        category = chunk.get("category", "General")
        if topic_name and topic_name not in seen:
            seen.add(topic_name)
            icon = category_icons.get(category, "BookOpen")
            starter_prompts = [
                f"Explain core concepts and patterns for {topic_name}.",
                f"What are the most common placement interview questions in {topic_name}?",
                f"Give me a step-by-step example problem solved with {topic_name}.",
            ]
            topics.append({
                "id": chunk["id"],
                "name": topic_name,
                "category": category,
                "icon": icon,
                "description": chunk["title"],
                "starter_prompts": starter_prompts,
            })
    return topics


