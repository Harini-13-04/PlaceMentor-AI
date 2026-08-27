// PlaceMentor AI — Quizee Repository
// CS Fundamentals, DBMS, OS, Computer Networks, OOP, SQL, HR/Interview & 5-Min Quizzes

export interface QuizQuestion {
  id: string;
  category: "CS Fundamentals" | "DBMS" | "Operating Systems" | "Computer Networks" | "OOP" | "SQL" | "HR & Interview" | "General Placement";
  topic: string;
  difficulty: "Easy" | "Medium" | "Hard";
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  codeSnippet?: string;
}

export const QUIZ_CATEGORIES = [
  "CS Fundamentals",
  "DBMS",
  "Operating Systems",
  "Computer Networks",
  "OOP",
  "SQL",
  "HR & Interview",
  "General Placement",
] as const;

export type QuizCategory = typeof QUIZ_CATEGORIES[number];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  // ---------------- DBMS ----------------
  {
    id: "db-1",
    category: "DBMS",
    topic: "ACID Properties",
    difficulty: "Easy",
    question: "Which ACID property guarantees that all operations in a database transaction complete successfully, or none do?",
    options: ["Atomicity", "Consistency", "Isolation", "Durability"],
    correctIndex: 0,
    explanation: "Atomicity ensures 'all-or-nothing' execution. If any single part of the transaction fails, the entire transaction is rolled back.",
  },
  {
    id: "db-2",
    category: "DBMS",
    topic: "Indexing & B-Trees",
    difficulty: "Medium",
    question: "Why are B+ Trees predominantly preferred over B-Trees for database disk indexes?",
    options: [
      "B+ Trees store all actual record pointers/keys at the leaf level, enabling efficient range scans and higher internal node fan-out.",
      "B+ Trees have fewer levels than standard binary search trees.",
      "B+ Trees consume significantly less disk memory.",
      "B+ Trees eliminate the need for write-ahead logging.",
    ],
    correctIndex: 0,
    explanation: "In B+ Trees, internal nodes only store navigation keys (increasing fan-out per disk page), and all leaf nodes are linked sequentially in a doubly linked list, making range queries extremely fast.",
  },
  {
    id: "db-3",
    category: "DBMS",
    topic: "Normalization",
    difficulty: "Hard",
    question: "A relational table is in Boyce-Codd Normal Form (BCNF) if and only if for every non-trivial functional dependency X -> Y:",
    options: [
      "X is a Superkey",
      "Y is a Prime Attribute",
      "X is a Candidate Key and Y is non-prime",
      "There are no multi-valued dependencies",
    ],
    correctIndex: 0,
    explanation: "BCNF is a stricter version of 3NF. In BCNF, for every functional dependency X -> Y, X must strictly be a Superkey.",
  },

  // ---------------- Operating Systems ----------------
  {
    id: "os-1",
    category: "Operating Systems",
    topic: "Process vs Thread",
    difficulty: "Easy",
    question: "What is the primary architectural difference between a Process and a Thread?",
    options: [
      "Threads within the same process share code, data, and OS resources, while processes have independent address spaces.",
      "Processes are managed by the hardware, whereas threads are strictly software.",
      "Threads have their own dedicated page tables.",
      "A process cannot spawn more than two threads.",
    ],
    correctIndex: 0,
    explanation: "Threads of a process share the same virtual memory address space (heap, global variables, open file descriptors), but each thread maintains its own independent program counter, registers, and stack.",
  },
  {
    id: "os-2",
    category: "Operating Systems",
    topic: "Deadlocks & Coffman Conditions",
    difficulty: "Medium",
    question: "Which of the following is NOT one of the four mandatory Coffman conditions required for a Deadlock to occur?",
    options: [
      "Mutual Exclusion",
      "Hold and Wait",
      "Preemption by Priority Scheduler",
      "Circular Wait",
    ],
    correctIndex: 2,
    explanation: "The 4 Coffman conditions are: 1. Mutual Exclusion, 2. Hold and Wait, 3. No Preemption (resources cannot be forcibly reclaimed), and 4. Circular Wait. 'Preemption' actually prevents deadlocks.",
  },
  {
    id: "os-3",
    category: "Operating Systems",
    topic: "Virtual Memory & Paging",
    difficulty: "Hard",
    question: "What phenomenon occurs when an OS spends more time swapping virtual memory pages in and out of disk than executing user instructions?",
    options: ["Thrashing", "Belady's Anomaly", "Starvation", "Segmentation Fault"],
    correctIndex: 0,
    explanation: "Thrashing occurs when the working set of active processes exceeds physical RAM capacity, causing continuous page faults and disk I/O bottlenecks.",
  },

  // ---------------- Computer Networks ----------------
  {
    id: "cn-1",
    category: "Computer Networks",
    topic: "TCP Handshake",
    difficulty: "Easy",
    question: "In the standard TCP 3-Way Handshake, what packets are exchanged between Client (C) and Server (S)?",
    options: [
      "C -> SYN, S -> SYN-ACK, C -> ACK",
      "C -> ACK, S -> SYN, C -> FIN",
      "C -> SYN, S -> ACK, C -> DATA",
      "C -> CONNECT, S -> ACCEPT, C -> READY",
    ],
    correctIndex: 0,
    explanation: "TCP initiates reliable connections with SYN (Synchronize sequence number) -> SYN-ACK (Server acknowledges and responds with own SYN) -> ACK (Client acknowledges).",
  },
  {
    id: "cn-2",
    category: "Computer Networks",
    topic: "OSI Model & Protocols",
    difficulty: "Medium",
    question: "At which layer of the OSI reference model does the Domain Name System (DNS) protocol operate?",
    options: ["Application Layer (Layer 7)", "Transport Layer (Layer 4)", "Network Layer (Layer 3)", "Session Layer (Layer 5)"],
    correctIndex: 0,
    explanation: "DNS operates at Layer 7 (Application Layer), primarily using UDP port 53 for rapid name-to-IP resolution.",
  },

  // ---------------- Object Oriented Programming (OOP) ----------------
  {
    id: "oop-1",
    category: "OOP",
    topic: "Polymorphism",
    difficulty: "Easy",
    question: "What is the primary difference between Method Overloading and Method Overriding?",
    options: [
      "Overloading is compile-time polymorphism within the same class; Overriding is runtime polymorphism across parent-child inheritance.",
      "Overloading requires abstract classes; Overriding works on interfaces only.",
      "Overloading alters the access modifier; Overriding alters the class name.",
      "There is no difference in modern Java/C++.",
    ],
    correctIndex: 0,
    explanation: "Method Overloading uses identical function names with distinct parameter signatures resolved at compile time. Method Overriding provides a specific subclass implementation of a base class method resolved dynamically at runtime (virtual dispatch).",
  },
  {
    id: "oop-2",
    category: "OOP",
    topic: "SOLID Principles",
    difficulty: "Medium",
    question: "The Liskov Substitution Principle (LSP) in SOLID design states that:",
    options: [
      "Subtypes must be substitutable for their base types without altering program correctness.",
      "Classes should be open for extension but closed for modification.",
      "Clients should not be forced to depend on interfaces they do not use.",
      "High-level modules should depend on abstractions, not concrete implementations.",
    ],
    correctIndex: 0,
    explanation: "LSP guarantees that objects of a superclass should be replaceable with objects of its subclasses without breaking application logic or introducing unexpected exceptions.",
  },

  // ---------------- SQL ----------------
  {
    id: "sql-1",
    category: "SQL",
    topic: "Joins & Filtering",
    difficulty: "Medium",
    question: "What is the result of a LEFT OUTER JOIN between Table A (10 rows) and Table B (5 matching rows)?",
    options: [
      "At least 10 rows (all rows of Table A with matched Table B data or NULL where unmatched).",
      "Exactly 5 rows.",
      "15 rows.",
      "50 rows (Cartesian product).",
    ],
    correctIndex: 0,
    explanation: "LEFT OUTER JOIN preserves every row from the left table (Table A) and populates columns from the right table with matching values or NULLs.",
  },

  // ---------------- HR & Behavioral ----------------
  {
    id: "hr-1",
    category: "HR & Interview",
    topic: "Behavioral STAR Method",
    difficulty: "Easy",
    question: "In the STAR framework for answering behavioral interview questions, what do the four letters represent?",
    options: [
      "Situation, Task, Action, Result",
      "Strategy, Timeline, Analysis, Review",
      "Scenario, Target, Attempt, Resolution",
      "Summary, Task, Achievement, Recommendation",
    ],
    correctIndex: 0,
    explanation: "STAR stands for Situation (Context), Task (Challenge/Objective), Action (Your specific steps), and Result (Measurable outcome/impact achieved).",
  },
];
