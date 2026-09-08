"""
PlaceMentor AI — Assessment Engine for Aptitude & Core CS Quizzes
Provides real question allocation with seen-history exclusion, formula sheets,
topic concept explanations, timer tracking, and detailed diagnostic reporting.
"""

from typing import List, Dict, Any, Optional
from datetime import datetime, timezone
import random
import uuid
from app.database.mongodb import assessment_attempts_collection, aptitude_progress_collection


# =========================================================================
# TOPIC CONCEPTS & FORMULA CHEAT SHEETS
# =========================================================================

TOPIC_FORMULAS_AND_CONCEPTS: Dict[str, Dict[str, Any]] = {
    "Percentages": {
        "concept": "A percentage represents a fraction of 100. Percentage Change = ((Final - Initial) / Initial) * 100%. Successive percentage changes of a% and b% result in a net change of (a + b + (a * b) / 100)%.",
        "formulas": [
            {"name": "Percentage Change", "formula": "((New Value - Old Value) / Old Value) × 100%"},
            {"name": "Successive % Change", "formula": "Net Change = a + b + (ab / 100) %"},
            {"name": "Commodity Consumption", "formula": "If price rises by r%, consumption must reduce by (r / (100 + r)) × 100% to keep expenditure constant."},
            {"name": "Population Growth", "formula": "P_n = P_0 × (1 + r / 100)^n"}
        ],
        "examples": [
            {"problem": "If salary increased by 20% then decreased by 20%, what is the net change?", "solution": "Net change = 20 - 20 - (20 * 20)/100 = -4% (a 4% decrease)."}
        ]
    },
    "Profit & Loss": {
        "concept": "Profit occurs when Selling Price (SP) > Cost Price (CP). Profit% = (Profit / CP) * 100. Loss% = (Loss / CP) * 100. Marked Price (MP) with Discount (D%) gives SP = MP * (1 - D/100).",
        "formulas": [
            {"name": "Profit %", "formula": "((SP - CP) / CP) × 100%"},
            {"name": "Loss %", "formula": "((CP - SP) / CP) × 100%"},
            {"name": "SP from CP & Profit%", "formula": "SP = CP × (100 + P%) / 100"},
            {"name": "Faulty Weight / Dishonest Dealer", "formula": "Gain % = (Error / (True Value - Error)) × 100%"}
        ],
        "examples": [
            {"problem": "An article bought for $500 is sold for $625. Find Profit %.", "solution": "Profit = 625 - 500 = 125. Profit% = (125 / 500) * 100 = 25%."}
        ]
    },
    "Time & Work": {
        "concept": "If A can do a piece of work in n days, A's 1-day work = 1/n. Total Work is frequently taken as LCM(days) for rapid unit calculation. Efficiency is inversely proportional to time taken.",
        "formulas": [
            {"name": "Combined Work (A and B)", "formula": "Time = (A × B) / (A + B) days"},
            {"name": "3-Worker Combined Time", "formula": "Time = (A × B × C) / (AB + BC + CA) days"},
            {"name": "Work Equivalence (MDH)", "formula": "(M1 × D1 × H1) / W1 = (M2 × D2 × H2) / W2"},
            {"name": "Pipes & Cisterns", "formula": "Net Fill Rate = (1/Inlet) - (1/Leak)"}
        ],
        "examples": [
            {"problem": "A takes 12 days and B takes 24 days. Working together, how many days do they need?", "solution": "Time = (12 * 24) / (12 + 24) = 288 / 36 = 8 days."}
        ]
    },
    "Time Speed Distance": {
        "concept": "Distance = Speed * Time. 1 km/h = 5/18 m/s. Average Speed for equal distances = (2 * S1 * S2) / (S1 + S2). Relative speed = S1 + S2 (opposite direction) or |S1 - S2| (same direction).",
        "formulas": [
            {"name": "Unit Conversion", "formula": "Speed (m/s) = Speed (km/h) × (5 / 18)"},
            {"name": "Average Speed (Equal Dist)", "formula": "Avg Speed = (2 × v1 × v2) / (v1 + v2)"},
            {"name": "Relative Speed (Opposite)", "formula": "S_rel = S1 + S2"},
            {"name": "Relative Speed (Same Dir)", "formula": "S_rel = |S1 - S2|"},
            {"name": "Train Crossing Platform", "formula": "Time = (Length_Train + Length_Platform) / Speed_Train"}
        ],
        "examples": [
            {"problem": "A train 200m long passes a pole at 72 km/h. How long does it take?", "solution": "Speed in m/s = 72 * (5/18) = 20 m/s. Time = 200 / 20 = 10 seconds."}
        ]
    },
    "Probability": {
        "concept": "Probability P(E) = (Number of Favorable Outcomes) / (Total Number of Elementary Outcomes). For independent events A and B, P(A ∩ B) = P(A) * P(B).",
        "formulas": [
            {"name": "Basic Probability", "formula": "P(E) = n(E) / n(S)"},
            {"name": "Addition Rule", "formula": "P(A ∪ B) = P(A) + P(B) - P(A ∩ B)"},
            {"name": "Conditional Probability", "formula": "P(A | B) = P(A ∩ B) / P(B)"},
            {"name": "Independent Events", "formula": "P(A ∩ B) = P(A) × P(B)"}
        ],
        "examples": [
            {"problem": "What is the probability of rolling a sum of 7 with two standard dice?", "solution": "Favorable pairs: (1,6),(2,5),(3,4),(4,3),(5,2),(6,1) = 6 pairs. Total = 36. P = 6/36 = 1/6."}
        ]
    },
    "Operating Systems": {
        "concept": "Core OS concepts evaluate process management, concurrency, CPU scheduling algorithms, virtual memory paging, and deadlock prevention (Banker's Algorithm, Coffman conditions).",
        "formulas": [
            {"name": "Turnaround Time (TAT)", "formula": "TAT = Completion Time - Arrival Time"},
            {"name": "Waiting Time (WT)", "formula": "WT = Turnaround Time - Burst Time"},
            {"name": "Page Fault Rate", "formula": "PFR = (Number of Page Faults / Total References)"},
            {"name": "Coffman Conditions (Deadlock)", "formula": "1. Mutual Exclusion, 2. Hold & Wait, 3. No Preemption, 4. Circular Wait"}
        ],
        "examples": [
            {"problem": "A process arrives at t=0 with burst time 8ms. Another arrives at t=2 with burst 4ms (SJF preemptive).", "solution": "At t=2, remaining time of P1 is 6ms > P2's 4ms. P2 preempts P1."}
        ]
    },
    "DBMS": {
        "concept": "Database Management Systems focus on Relational Schema Design, Normalization (1NF, 2NF, 3NF, BCNF), ACID transaction properties, Indexing (B+ Trees), and SQL Query execution plans.",
        "formulas": [
            {"name": "ACID Properties", "formula": "Atomicity, Consistency, Isolation, Durability"},
            {"name": "3NF Condition", "formula": "For X -> Y, X is superkey OR Y is prime attribute."},
            {"name": "BCNF Condition", "formula": "For every functional dependency X -> Y, X must be a superkey."},
            {"name": "B+ Tree Fanout", "formula": "Max Keys = M - 1, Min Keys = ceil(M/2) - 1"}
        ],
        "examples": [
            {"problem": "Why is B+ Tree preferred over B Tree in relational databases?", "solution": "All leaf nodes are linked in a sequential linked list for rapid range scans, and internal nodes store only keys allowing higher fanout."}
        ]
    },
    "Computer Networks": {
        "concept": "Layered networking models (OSI 7 Layers, TCP/IP 4 Layers), transport layer protocols (TCP 3-way handshake, UDP), routing, DNS resolution, and HTTP/HTTPS security handshake.",
        "formulas": [
            {"name": "TCP 3-Way Handshake", "formula": "1. SYN -> 2. SYN-ACK -> 3. ACK"},
            {"name": "Bandwidth-Delay Product", "formula": "BDP = Bandwidth (bps) × Round Trip Time (RTT)"},
            {"name": "Subnet Mask Hosts", "formula": "Usable Hosts = 2^(32 - Prefix) - 2"}
        ],
        "examples": [
            {"problem": "How many usable hosts in a /28 subnet?", "solution": "32 - 28 = 4 host bits. 2^4 - 2 = 14 usable hosts."}
        ]
    },
    "OOP Concepts": {
        "concept": "Object-Oriented Programming models real-world entities through Abstraction, Encapsulation, Inheritance, and Polymorphism (Runtime Dynamic Method Dispatch vs Compile-time Overloading), obeying SOLID principles.",
        "formulas": [
            {"name": "SOLID Principles", "formula": "Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion"},
            {"name": "Polymorphism Types", "formula": "Static (Overloading/Templates) vs Dynamic (Virtual Functions/VTable dispatch)"}
        ],
        "examples": [
            {"problem": "What is the role of the VTable in C++/Java?", "solution": "A virtual method table (vtable) contains function pointers for dynamic dispatch at runtime, enabling polymorphism with pointer/reference of base type."}
        ]
    },
    "DSA": {
        "concept": "Data Structures & Algorithms evaluate computational complexity (Big O, Omega, Theta), balanced tree structures (AVL, Red-Black), graph algorithms (Dijkstra, Bellman-Ford, Tarjan), and dynamic programming memoization.",
        "formulas": [
            {"name": "Master Theorem", "formula": "T(n) = aT(n/b) + f(n); compare f(n) with n^(log_b a)"},
            {"name": "Dijkstra Time Complexity", "formula": "O((V + E) log V) with Binary Min-Heap"},
            {"name": "0/1 Knapsack Complexity", "formula": "O(N × W) pseudo-polynomial time with 1D/2D DP"}
        ],
        "examples": [
            {"problem": "How does quicksort achieve O(n log n) average time?", "solution": "By partitioning around a pivot into two subproblems of size n/2, recurrence T(n) = 2T(n/2) + O(n) resolves to O(n log n)."}
        ]
    },
    "SQL": {
        "concept": "Structured Query Language principles cover relational algebra, Cartesian joins, Index Seek vs Scan, aggregations with GROUP BY and HAVING, and advanced Windowing functions (OVER, PARTITION BY, RANK).",
        "formulas": [
            {"name": "Query Evaluation Pipeline", "formula": "FROM -> ON -> JOIN -> WHERE -> GROUP BY -> WITH CUBE/ROLLUP -> HAVING -> SELECT -> DISTINCT -> ORDER BY -> LIMIT"},
            {"name": "Window Ranking", "formula": "RANK() skips tied positions; DENSE_RANK() retains consecutive integers."}
        ],
        "examples": [
            {"problem": "How do you find the 2nd highest salary in an Employee table?", "solution": "SELECT MAX(salary) FROM Employee WHERE salary < (SELECT MAX(salary) FROM Employee);"}
        ]
    },
    "Software Engineering": {
        "concept": "Software Engineering principles cover Agile Scrum sprints, Git branching workflows (Gitflow vs Trunk-based), CI/CD automated pipelines, and the Testing Pyramid (Unit, Integration, End-to-End).",
        "formulas": [
            {"name": "Agile Scrum Artifacts", "formula": "Product Backlog, Sprint Backlog, Increment, Velocity metric"},
            {"name": "Git Rebase vs Merge", "formula": "Merge creates a merge commit preserving exact history; Rebase linearizes commits onto target base."}
        ],
        "examples": [
            {"problem": "Why is Trunk-Based Development favored in modern DevOps?", "solution": "Frequent small commits into the main branch with short-lived feature branches reduce merge conflicts and enable continuous integration."}
        ]
    }
}

# =========================================================================
# QUESTION BANK DATASET
# =========================================================================

QUESTION_BANK: List[Dict[str, Any]] = [
    # -------------------------------------------------------------
    # QUANTITATIVE APTITUDE
    # -------------------------------------------------------------
    {
        "id": "quant-pw-1",
        "category": "Quantitative Aptitude",
        "topic": "Time & Work",
        "difficulty": "Easy",
        "question": "A can complete a piece of work in 12 days, and B can complete the same work in 24 days. If they work together, in how many days will the work be completed?",
        "options": ["6 days", "8 days", "10 days", "16 days"],
        "correct_answer": 1,
        "explanation": "Work rate of A = 1/12. Work rate of B = 1/24. Combined rate = (1/12 + 1/24) = 3/24 = 1/8. Total time = 8 days.",
        "formula": "Time = (A * B) / (A + B) = (12 * 24) / 36 = 8 days."
    },
    {
        "id": "quant-pw-2",
        "category": "Quantitative Aptitude",
        "topic": "Time & Work",
        "difficulty": "Medium",
        "question": "A is twice as efficient as B. If A and B together can finish a job in 18 days, how many days will A alone take to finish the job?",
        "options": ["24 days", "27 days", "36 days", "54 days"],
        "correct_answer": 1,
        "explanation": "Let B's 1-day work be x. Then A's 1-day work is 2x. Combined 1-day work = 3x = 1/18 => x = 1/54. A's 1-day work = 2/54 = 1/27. Hence A alone takes 27 days.",
        "formula": "Total units = 18 * (2 + 1) = 54 units. Time for A = 54 / 2 = 27 days."
    },
    {
        "id": "quant-pct-1",
        "category": "Quantitative Aptitude",
        "topic": "Percentages",
        "difficulty": "Easy",
        "question": "If the price of sugar increases by 25%, by what percentage must a household reduce its consumption so that the total expenditure remains unchanged?",
        "options": ["20%", "25%", "15%", "16.67%"],
        "correct_answer": 0,
        "explanation": "Reduction % = (r / (100 + r)) * 100 = (25 / 125) * 100 = 20%.",
        "formula": "Reduction = (r / (100 + r)) * 100%"
    },
    {
        "id": "quant-pct-2",
        "category": "Quantitative Aptitude",
        "topic": "Percentages",
        "difficulty": "Medium",
        "question": "A number is increased by 20% and then decreased by 20%. The net percentage change in the number is:",
        "options": ["0% (no change)", "4% increase", "4% decrease", "2% decrease"],
        "correct_answer": 2,
        "explanation": "Net change = a + b + (ab / 100) = 20 - 20 + (20 * -20)/100 = -400/100 = -4% (a 4% decrease).",
        "formula": "Net % = a + b + (ab / 100)%"
    },
    {
        "id": "quant-pl-1",
        "category": "Quantitative Aptitude",
        "topic": "Profit & Loss",
        "difficulty": "Easy",
        "question": "A shopkeeper sells a book for $450, incurring a loss of 10%. At what price should he sell it to gain 20%?",
        "options": ["$500", "$550", "$600", "$650"],
        "correct_answer": 2,
        "explanation": "SP = CP * 0.9 => 450 = CP * 0.9 => CP = $500. For 20% profit, SP = 500 * 1.2 = $600.",
        "formula": "CP = SP / (1 - Loss%), Target SP = CP * (1 + Profit%)"
    },
    {
        "id": "quant-pl-2",
        "category": "Quantitative Aptitude",
        "topic": "Profit & Loss",
        "difficulty": "Hard",
        "question": "A dishonest dealer claims to sell goods at cost price, but uses a false weight of 900 grams for 1 kg. His overall gain percentage is:",
        "options": ["10%", "11.11%", "12.5%", "9.09%"],
        "correct_answer": 1,
        "explanation": "Gain % = (Error / (True Value - Error)) * 100 = (100 / 900) * 100 = 100/9 = 11.11%.",
        "formula": "Gain % = (Error / (True Value - Error)) * 100%"
    },
    {
        "id": "quant-tsd-1",
        "category": "Quantitative Aptitude",
        "topic": "Time Speed Distance",
        "difficulty": "Easy",
        "question": "A train travelling at 90 km/h crosses a 300-meter platform in 20 seconds. What is the length of the train?",
        "options": ["150 m", "200 m", "250 m", "300 m"],
        "correct_answer": 1,
        "explanation": "Speed in m/s = 90 * (5/18) = 25 m/s. Total distance in 20s = 25 * 20 = 500 m. Length of train = 500 - 300 = 200 m.",
        "formula": "Distance = Speed * Time = Length_Train + Length_Platform"
    },
    {
        "id": "quant-prob-1",
        "category": "Quantitative Aptitude",
        "topic": "Probability",
        "difficulty": "Easy",
        "question": "Two unbiased dice are thrown simultaneously. What is the probability of obtaining a sum equal to 8?",
        "options": ["5/36", "1/6", "7/36", "1/12"],
        "correct_answer": 0,
        "explanation": "Favorable outcomes: (2,6), (3,5), (4,4), (5,3), (6,2) = 5 outcomes. Total = 36. Probability = 5/36.",
        "formula": "P(E) = n(E) / n(S)"
    },

    # -------------------------------------------------------------
    # LOGICAL REASONING
    # -------------------------------------------------------------
    {
        "id": "log-syl-1",
        "category": "Logical Reasoning",
        "topic": "Syllogisms",
        "difficulty": "Medium",
        "question": "Statements:\n1. All cars are vehicles.\n2. Some vehicles are electric.\nConclusions:\nI. Some cars are electric.\nII. Some vehicles are cars.",
        "options": ["Only I follows", "Only II follows", "Both I and II follow", "Neither follows"],
        "correct_answer": 1,
        "explanation": "Since all cars are vehicles, some vehicles are definitely cars (Conclusion II is valid). However, electric vehicles may or may not overlap with cars (Conclusion I is not certain).",
        "formula": "Standard Syllogism Venn intersection rule."
    },
    {
        "id": "log-ser-1",
        "category": "Logical Reasoning",
        "topic": "Number Series",
        "difficulty": "Easy",
        "question": "Find the missing number in the sequence: 4, 9, 19, 39, 79, ?",
        "options": ["119", "139", "159", "169"],
        "correct_answer": 2,
        "explanation": "Pattern is (Number * 2) + 1: 4*2+1=9, 9*2+1=19, 19*2+1=39, 39*2+1=79, 79*2+1=159.",
        "formula": "T(n) = 2 * T(n-1) + 1"
    },
    {
        "id": "log-dir-1",
        "category": "Logical Reasoning",
        "topic": "Direction Sense",
        "difficulty": "Easy",
        "question": "A person walks 10 km North, turns right and walks 6 km, then turns right again and walks 10 km. How far and in which direction is he from the starting point?",
        "options": ["6 km East", "6 km West", "10 km North", "16 km East"],
        "correct_answer": 0,
        "explanation": "Walking 10 km North and then 10 km South cancels out the vertical axis. The right turn moved him 6 km East.",
        "formula": "Net coordinates: (0, 10) -> (6, 10) -> (6, 0). Distance = 6 km East."
    },

    # -------------------------------------------------------------
    # DATA INTERPRETATION
    # -------------------------------------------------------------
    {
        "id": "di-bar-1",
        "category": "Data Interpretation",
        "topic": "Bar Charts",
        "difficulty": "Easy",
        "question": "Company revenue grew from $40M in 2021 to $50M in 2022 and $65M in 2023. What was the percentage growth rate from 2021 to 2023?",
        "options": ["50%", "62.5%", "65%", "25%"],
        "correct_answer": 1,
        "explanation": "Growth = ((65 - 40) / 40) * 100 = (25 / 40) * 100 = 62.5%.",
        "formula": "Growth % = ((Final - Initial) / Initial) * 100%"
    },
    {
        "id": "di-pie-1",
        "category": "Data Interpretation",
        "topic": "Pie Charts",
        "difficulty": "Medium",
        "question": "In a company budget pie chart, R&D represents a sector angle of 72 degrees. What percentage of the total budget is allocated to R&D?",
        "options": ["15%", "20%", "25%", "18%"],
        "correct_answer": 1,
        "explanation": "Total circle has 360 degrees. Percentage = (72 / 360) * 100 = (1 / 5) * 100 = 20%.",
        "formula": "Percentage = (Angle / 360) * 100%"
    },

    # -------------------------------------------------------------
    # CORE CS & QUIZ EXPANDED
    # -------------------------------------------------------------
    # OS
    {
        "id": "cs-os-1",
        "category": "CS Fundamentals",
        "topic": "Operating Systems",
        "difficulty": "Easy",
        "question": "Which of the following conditions is NOT one of Coffman's four necessary conditions for deadlock occurrence?",
        "options": ["Mutual Exclusion", "Hold and Wait", "Preemptive Resource Allocation", "Circular Wait"],
        "correct_answer": 2,
        "explanation": "The condition is 'No Preemption', meaning resources cannot be forcibly confiscated from a process holding them.",
        "formula": "Coffman Conditions: Mutual Exclusion, Hold & Wait, No Preemption, Circular Wait."
    },
    {
        "id": "cs-os-2",
        "category": "CS Fundamentals",
        "topic": "Operating Systems",
        "difficulty": "Medium",
        "question": "What is the primary cause of Thrashing in virtual memory operating systems?",
        "options": [
            "CPU running too fast",
            "Processes spending more time swapping pages in/out than executing instructions",
            "Disk failure in secondary storage",
            "Too few processes loaded in RAM"
        ],
        "correct_answer": 1,
        "explanation": "Thrashing occurs when the total working set of all active processes exceeds available physical memory frames, resulting in continuous page faults.",
        "formula": "Thrashing: sum(Working_Set_Sizes) > Total_Physical_Frames"
    },
    {
        "id": "cs-os-3",
        "category": "CS Fundamentals",
        "topic": "Operating Systems",
        "difficulty": "Medium",
        "question": "Which CPU scheduling algorithm can suffer from the 'Convoy Effect' where short processes queue behind a long CPU-burst process?",
        "options": ["Round Robin (RR)", "Shortest Job First (SJF)", "First-Come First-Served (FCFS)", "Priority Scheduling (Preemptive)"],
        "correct_answer": 2,
        "explanation": "In non-preemptive FCFS, if a CPU-bound process with long burst time gets the CPU first, all I/O bound processes get stalled behind it.",
        "formula": "Convoy Effect occurs predominantly in non-preemptive FCFS scheduling."
    },
    {
        "id": "cs-os-4",
        "category": "CS Fundamentals",
        "topic": "Operating Systems",
        "difficulty": "Hard",
        "question": "What is the key difference between a binary semaphore and a mutex in operating systems?",
        "options": [
            "A mutex can be locked and unlocked by different threads, while a semaphore cannot.",
            "A mutex has ownership and can only be unlocked by the thread that locked it, whereas a semaphore is a signaling mechanism.",
            "Semaphores only work on single-core CPUs.",
            "There is no difference; they are exact synonyms in modern kernels."
        ],
        "correct_answer": 1,
        "explanation": "A mutex enforces ownership (only the lock owner can release it). A binary semaphore can be signaled (unlocked) by any thread or ISR to indicate resource availability.",
        "formula": "Mutex = Ownership + Mutual Exclusion; Semaphore = Signaling mechanism with integer counter."
    },

    # DBMS
    {
        "id": "cs-db-1",
        "category": "CS Fundamentals",
        "topic": "DBMS",
        "difficulty": "Easy",
        "question": "Which normal form guarantees the elimination of transitive functional dependencies?",
        "options": ["1NF", "2NF", "3NF", "BCNF"],
        "correct_answer": 2,
        "explanation": "3NF requires the relation to be in 2NF and that no non-prime attribute is transitively dependent on any candidate key.",
        "formula": "3NF: No X -> Y where X is not a superkey and Y is non-prime."
    },
    {
        "id": "cs-db-2",
        "category": "CS Fundamentals",
        "topic": "DBMS",
        "difficulty": "Medium",
        "question": "What is the primary advantage of B+ Tree indexing over B Tree indexing in relational databases?",
        "options": [
            "B+ Tree requires less memory for leaf nodes",
            "B+ Tree leaf nodes are linked sequentially, allowing high-performance range queries and scans",
            "B+ Tree has higher search complexity",
            "B+ Tree does not need balancing"
        ],
        "correct_answer": 1,
        "explanation": "In a B+ Tree, all actual records/pointers reside in leaf nodes, which are connected as a doubly linked list, enabling O(log n + k) range traversals.",
        "formula": "Range Scan in B+ Tree = Find first key in O(log n) + traverse leaf linked list."
    },
    {
        "id": "cs-db-3",
        "category": "CS Fundamentals",
        "topic": "DBMS",
        "difficulty": "Medium",
        "question": "In transaction management, which ACID property guarantees that once a transaction has committed, its changes survive system crashes or power failures?",
        "options": ["Atomicity", "Consistency", "Isolation", "Durability"],
        "correct_answer": 3,
        "explanation": "Durability guarantees that committed state changes are written to persistent non-volatile log/storage (WAL) and will survive server restarts or crashes.",
        "formula": "Durability = Write-Ahead Logging (WAL) + Non-volatile checkpointing."
    },
    {
        "id": "cs-db-4",
        "category": "CS Fundamentals",
        "topic": "DBMS",
        "difficulty": "Hard",
        "question": "What is a 'Phantom Read' anomaly in database transaction isolation levels?",
        "options": [
            "A transaction reads uncommitted data modified by another transaction.",
            "A transaction re-reads a row and finds that another transaction modified its fields.",
            "A transaction executes a range query twice and finds new rows added by another committed transaction.",
            "A transaction cannot read rows locked in shared mode."
        ],
        "correct_answer": 2,
        "explanation": "Phantom reads occur when transaction T1 executes a query filtering a range (e.g. WHERE age > 25), and transaction T2 inserts new matching rows and commits, causing T1 to get different row count on repeat.",
        "formula": "Serializable isolation level prevents Dirty Reads, Non-Repeatable Reads, and Phantom Reads."
    },

    # Computer Networks
    {
        "id": "cs-nw-1",
        "category": "CS Fundamentals",
        "topic": "Computer Networks",
        "difficulty": "Easy",
        "question": "In the TCP 3-Way Handshake connection establishment, what is the sequence of flag packets sent between client and server?",
        "options": ["ACK -> SYN -> SYN-ACK", "SYN -> SYN-ACK -> ACK", "SYN -> ACK -> DATA", "FIN -> ACK -> FIN-ACK"],
        "correct_answer": 1,
        "explanation": "1. Client sends SYN. 2. Server responds with SYN-ACK. 3. Client confirms with ACK.",
        "formula": "TCP Handshake = SYN -> SYN+ACK -> ACK"
    },
    {
        "id": "cs-nw-2",
        "category": "CS Fundamentals",
        "topic": "Computer Networks",
        "difficulty": "Medium",
        "question": "Which protocol is connectionless, does not provide packet reordering or flow control, but offers low latency suitable for VoIP and live streaming?",
        "options": ["TCP", "UDP", "SCTP", "BGP"],
        "correct_answer": 1,
        "explanation": "UDP (User Datagram Protocol) does not maintain connection state or retransmission timers, making it ideal for real-time applications where packet loss is tolerable.",
        "formula": "UDP = 8-byte header, connectionless, no ACK overhead."
    },
    {
        "id": "cs-nw-3",
        "category": "CS Fundamentals",
        "topic": "Computer Networks",
        "difficulty": "Medium",
        "question": "How many usable host IP addresses are available in an IPv4 subnet with prefix `/27`?",
        "options": ["32", "30", "62", "14"],
        "correct_answer": 1,
        "explanation": "32 - 27 = 5 host bits. Total IPs = 2^5 = 32. Usable hosts = 32 - 2 (subtract Network ID and Broadcast IP) = 30.",
        "formula": "Usable Hosts = 2^(32 - Prefix) - 2 = 2^5 - 2 = 30."
    },

    # OOP
    {
        "id": "cs-oop-1",
        "category": "CS Fundamentals",
        "topic": "OOP Concepts",
        "difficulty": "Easy",
        "question": "Which SOLID design principle states that software entities (classes, modules) should be open for extension, but closed for modification?",
        "options": ["Single Responsibility Principle", "Open/Closed Principle", "Liskov Substitution Principle", "Dependency Inversion"],
        "correct_answer": 1,
        "explanation": "The Open/Closed Principle (OCP) requires that behavior can be extended (e.g. via inheritance or polymorphism) without changing existing tested source code.",
        "formula": "SOLID: S-Single Resp, O-Open/Closed, L-Liskov, I-Interface Segregation, D-Dependency Inversion."
    },
    {
        "id": "cs-oop-2",
        "category": "CS Fundamentals",
        "topic": "OOP Concepts",
        "difficulty": "Medium",
        "question": "Which design pattern ensures that a class has only one instance and provides a global access point to it?",
        "options": ["Factory Method", "Observer", "Singleton", "Adapter"],
        "correct_answer": 2,
        "explanation": "The Singleton pattern restricts the instantiation of a class to a single object with a private constructor and a static getInstance() method.",
        "formula": "Singleton = Private Constructor + Static Instance Holder + Thread-Safe Accessor."
    },

    # DSA
    {
        "id": "cs-dsa-1",
        "category": "CS Fundamentals",
        "topic": "DSA",
        "difficulty": "Medium",
        "question": "What is the worst-case time complexity of finding the shortest path between all pairs of vertices in a weighted graph using the Floyd-Warshall algorithm?",
        "options": ["O(V + E)", "O(V² log V)", "O(V³)", "O(E log V)"],
        "correct_answer": 2,
        "explanation": "Floyd-Warshall runs 3 nested loops from 1 to V, resulting in O(V³) time complexity.",
        "formula": "dp[i][j] = min(dp[i][j], dp[i][k] + dp[k][j]) across 3 nested loops = O(V³)"
    },
    {
        "id": "cs-dsa-2",
        "category": "CS Fundamentals",
        "topic": "DSA",
        "difficulty": "Easy",
        "question": "What is the average and worst-case time complexity for searching a key in a balanced Binary Search Tree (AVL / Red-Black Tree)?",
        "options": ["O(1) average, O(n) worst", "O(log n) average, O(log n) worst", "O(n) average, O(n) worst", "O(log n) average, O(n) worst"],
        "correct_answer": 1,
        "explanation": "Because self-balancing trees maintain height h <= 1.44 log n, search, insertion, and deletion are guaranteed O(log n) in both average and worst cases.",
        "formula": "Balanced BST Height = O(log n) => Search = O(log n)."
    },
    {
        "id": "cs-dsa-3",
        "category": "CS Fundamentals",
        "topic": "DSA",
        "difficulty": "Hard",
        "question": "In dynamic programming, what is the time complexity of solving the 0/1 Knapsack problem with N items and maximum capacity W?",
        "options": ["O(2^N)", "O(N * W)", "O(N log W)", "O(W^2)"],
        "correct_answer": 1,
        "explanation": "Using a 2D table or 1D array of size W over N items, state transitions require O(1) computation per state, giving pseudo-polynomial time O(N * W).",
        "formula": "DP State: dp[i][w] = max(dp[i-1][w], val[i] + dp[i-1][w - wt[i]]) => O(N * W)."
    },

    # SQL
    {
        "id": "cs-sql-1",
        "category": "CS Fundamentals",
        "topic": "SQL",
        "difficulty": "Easy",
        "question": "Which SQL clause is used to filter records after aggregation (e.g. after a GROUP BY clause)?",
        "options": ["WHERE", "HAVING", "ORDER BY", "FILTER"],
        "correct_answer": 1,
        "explanation": "The WHERE clause filters individual rows before grouping, while the HAVING clause filters summary groups after aggregation.",
        "formula": "SQL Order: FROM -> WHERE -> GROUP BY -> HAVING -> SELECT -> ORDER BY."
    },
    {
        "id": "cs-sql-2",
        "category": "CS Fundamentals",
        "topic": "SQL",
        "difficulty": "Medium",
        "question": "What is the difference between `RANK()` and `DENSE_RANK()` window functions in SQL when two rows share the same value?",
        "options": [
            "`RANK()` leaves gaps in rank numbering after ties, while `DENSE_RANK()` does not.",
            "`DENSE_RANK()` leaves gaps in rank numbering, while `RANK()` does not.",
            "`RANK()` only works with integers.",
            "There is no difference between them."
        ],
        "correct_answer": 0,
        "explanation": "If two rows tie at rank 1, `RANK()` gives ranks (1, 1, 3), whereas `DENSE_RANK()` gives ranks (1, 1, 2) without numbering gaps.",
        "formula": "RANK: 1, 1, 3; DENSE_RANK: 1, 1, 2."
    },

    # Software Engineering
    {
        "id": "cs-se-1",
        "category": "CS Fundamentals",
        "topic": "Software Engineering",
        "difficulty": "Easy",
        "question": "In Git version control, which command combines changes from another branch into your current branch by replaying individual commits sequentially on top of the target base?",
        "options": ["git merge", "git rebase", "git checkout", "git pull --ff-only"],
        "correct_answer": 1,
        "explanation": "`git rebase` rewrites commit history by reapplying commits from the current branch one by one onto the tip of the specified base branch, creating a clean linear history.",
        "formula": "Rebase = Linear commit history replay."
    },
    {
        "id": "cs-se-2",
        "category": "CS Fundamentals",
        "topic": "Software Engineering",
        "difficulty": "Medium",
        "question": "Which type of software testing verifies that individual units (functions, methods, classes) work correctly in isolation from their external dependencies?",
        "options": ["Integration Testing", "Unit Testing", "End-to-End Testing", "Regression Testing"],
        "correct_answer": 1,
        "explanation": "Unit testing tests isolated components using mocks/stubs for databases and external APIs to ensure specific algorithms behave correctly.",
        "formula": "Test Pyramid: Unit Tests (Base, largest volume) -> Integration Tests -> E2E Tests (Apex)."
    }
]


# =========================================================================
# ASSESSMENT ENGINE SERVICE FUNCTIONS
# =========================================================================

def get_topic_study_guide(topic: str) -> Optional[Dict[str, Any]]:
    """
    Returns formula sheet, concepts, and illustrative examples for a topic.
    """
    return TOPIC_FORMULAS_AND_CONCEPTS.get(topic)


async def allocate_assessment_questions(
    user_id: str,
    assessment_type: str,  # "aptitude" or "quiz"
    category: Optional[str] = None,
    topic: Optional[str] = None,
    difficulty: Optional[str] = "Mixed",
    count: int = 5,
) -> List[Dict[str, Any]]:
    """
    Personalized question allocation engine:
    1. Filters candidate questions by category/topic/difficulty.
    2. Retrieves user's seen question history from past attempts.
    3. Prioritizes unseen questions to minimize repetition.
    4. Sanitizes output (omits correct_answer) for safe client transmission.
    """
    candidates = list(QUESTION_BANK)

    # Filter by assessment type
    if assessment_type == "quiz":
        candidates = [q for q in candidates if q.get("category") == "CS Fundamentals"]
    elif assessment_type == "aptitude":
        candidates = [q for q in candidates if q.get("category") != "CS Fundamentals"]

    # Filter by category
    if category and category not in ("All", "Mixed", "All Categories"):
        candidates = [q for q in candidates if q.get("category") == category]

    # Filter by topic
    if topic and topic not in ("All", "Mixed", "All Topics", "Mock", "Mixed CS Placement Mock", "Quantitative Mock", "Logical Mock"):
        candidates = [q for q in candidates if q.get("topic") == topic]

    # Filter by difficulty
    if difficulty and difficulty != "Mixed":
        filtered_diff = [q for q in candidates if q.get("difficulty") == difficulty]
        if len(filtered_diff) >= count:
            candidates = filtered_diff

    # Fallback to all candidates if filter was too narrow
    if not candidates:
        candidates = list(QUESTION_BANK)

    # Fetch seen question IDs for this user
    seen_ids = set()
    if user_id:
        past_attempts = await assessment_attempts_collection.find(
            {"user_id": user_id},
            {"question_results.question_id": 1, "_id": 0}
        ).to_list(50)
        for att in past_attempts:
            for qr in att.get("question_results", []):
                seen_ids.add(qr.get("question_id"))

    # Separate unseen and seen questions
    unseen = [q for q in candidates if q["id"] not in seen_ids]
    seen = [q for q in candidates if q["id"] in seen_ids]

    random.shuffle(unseen)
    random.shuffle(seen)

    selected = unseen[:count]
    if len(selected) < count:
        needed = count - len(selected)
        selected.extend(seen[:needed])

    # If still not enough, repeat with replacement
    while len(selected) < count and len(candidates) > 0:
        selected.append(random.choice(candidates))

    # Sanitize for student client: do NOT expose correct_answer or explanation before submission
    sanitized = []
    for q in selected:
        q_copy = {
            "id": q["id"],
            "category": q["category"],
            "topic": q["topic"],
            "difficulty": q["difficulty"],
            "question": q["question"],
            "options": q["options"],
            "formula": q.get("formula"),
            "marks": q.get("marks", 1),
        }
        sanitized.append(q_copy)

    return sanitized


async def submit_assessment_attempt(
    user_id: str,
    assessment_type: str,
    category: str,
    topic: str,
    difficulty: str,
    answers: Dict[str, int],  # {question_id: selected_option_index}
    time_spent_seconds: int,
) -> Dict[str, Any]:
    """
    Evaluates submitted answers, calculates score/accuracy, identifies strengths/weaknesses,
    persists the attempt to MongoDB, and returns diagnostic results.
    """
    question_lookup = {q["id"]: q for q in QUESTION_BANK}

    score = 0
    total = len(answers)
    topic_correct: Dict[str, int] = {}
    topic_total: Dict[str, int] = {}
    results_list = []

    for q_id, selected_opt in answers.items():
        q_info = question_lookup.get(q_id)
        if not q_info:
            continue

        q_topic = q_info.get("topic", "General")
        topic_total[q_topic] = topic_total.get(q_topic, 0) + 1

        is_correct = (selected_opt == q_info["correct_answer"])
        if is_correct:
            score += 1
            topic_correct[q_topic] = topic_correct.get(q_topic, 0) + 1

        results_list.append({
            "question_id": q_id,
            "question": q_info["question"],
            "options": q_info["options"],
            "selected_option": selected_opt,
            "correct_option": q_info["correct_answer"],
            "is_correct": is_correct,
            "explanation": q_info["explanation"],
            "formula": q_info.get("formula"),
            "topic": q_topic,
            "difficulty": q_info["difficulty"],
        })

    accuracy = round((score / (total or 1)) * 100, 1)

    weak_topics = []
    strong_topics = []
    for t, tot in topic_total.items():
        corr = topic_correct.get(t, 0)
        topic_acc = (corr / tot) * 100
        if topic_acc >= 75:
            strong_topics.append(t)
        else:
            weak_topics.append(t)

    attempt_doc = {
        "id": str(uuid.uuid4()),
        "attempt_id": str(uuid.uuid4()),
        "user_id": user_id,
        "assessment_type": assessment_type,
        "category": category,
        "topic": topic,
        "difficulty": difficulty,
        "score": score,
        "total": total,
        "accuracy": accuracy,
        "time_spent_seconds": time_spent_seconds,
        "question_results": results_list,
        "weak_topics": weak_topics,
        "strong_topics": strong_topics,
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }

    await assessment_attempts_collection.insert_one(attempt_doc)
    attempt_doc.pop("_id", None)

    # Persist topic attempt counts & accuracy into user aptitude progress
    try:
        await aptitude_progress_collection.update_one(
            {"user_id": user_id},
            {
                "$inc": {
                    f"topics.{topic}.attempted": total,
                    f"topics.{topic}.correct": score,
                    "total_questions_attempted": total,
                    "total_questions_correct": score,
                },
                "$set": {
                    f"topics.{topic}.last_accuracy": accuracy,
                    "last_updated": datetime.now(timezone.utc).isoformat(),
                }
            },
            upsert=True
        )
    except Exception as e:
        print(f"Error updating aptitude progress for user {user_id}: {e}")

    return attempt_doc


async def get_user_assessment_history(user_id: str, assessment_type: Optional[str] = None) -> List[Dict[str, Any]]:
    """
    Fetches real past assessment attempts for the user from MongoDB.
    """
    query: Dict[str, Any] = {"user_id": user_id}
    if assessment_type:
        query["assessment_type"] = assessment_type

    attempts = await assessment_attempts_collection.find(query, {"_id": 0}).sort("timestamp", -1).to_list(100)
    for att in attempts:
        if isinstance(att.get("timestamp"), str):
            try:
                att["timestamp"] = datetime.fromisoformat(att["timestamp"])
            except Exception:
                pass
    return attempts


async def mark_concept_learned(user_id: str, concept_name: str, category: str) -> Dict[str, Any]:
    """
    Marks a concept as learned for the authenticated user in MongoDB.
    """
    doc = await aptitude_progress_collection.find_one({"user_id": user_id})
    learned_set = set(doc.get("learned_concepts", [])) if doc else set()
    learned_set.add(concept_name)

    await aptitude_progress_collection.update_one(
        {"user_id": user_id},
        {
            "$set": {
                "learned_concepts": list(learned_set),
                f"topics.{concept_name}.learned": True,
                "last_updated": datetime.now(timezone.utc).isoformat(),
            }
        },
        upsert=True
    )
    return {"status": "success", "concept": concept_name, "learned_concepts": list(learned_set)}


async def get_user_aptitude_progress(user_id: str) -> Dict[str, Any]:
    """
    Retrieves real aptitude progress (learned concepts, topic question stats) for user.
    """
    doc = await aptitude_progress_collection.find_one({"user_id": user_id}, {"_id": 0})
    if not doc:
        return {
            "user_id": user_id,
            "learned_concepts": [],
            "topics": {},
            "total_questions_attempted": 0,
            "total_questions_correct": 0,
        }
    return doc

