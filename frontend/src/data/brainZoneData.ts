// PlaceMentor AI — Brain Zone Cognitive Training Repository
// Professional Brain Exercises for Placement Cognitive & Aptitude Screening

export interface BrainGameInfo {
  id: string;
  name: string;
  category: string;
  skillTested: "Memory" | "Logic" | "Pattern Recognition" | "Processing Speed" | "Problem Solving";
  iconName: string;
  tagline: string;
  estimatedMinutes: number;
  difficulties: ("Easy" | "Medium" | "Hard")[];
  description: string;
  cognitiveBenefit: string;
}

export const BRAIN_GAMES: BrainGameInfo[] = [
  {
    id: "sudoku",
    name: "Sudoku Grid",
    category: "Deductive Logic",
    skillTested: "Logic",
    iconName: "Grid",
    tagline: "Fill 4x4 or 9x9 without row/col duplicate constraints",
    estimatedMinutes: 5,
    difficulties: ["Easy", "Medium", "Hard"],
    description: "Exercise spatial reasoning and recursive elimination to place digits 1-4 or 1-9 accurately.",
    cognitiveBenefit: "Enhances step-by-step logical deduction and constraint satisfaction reasoning.",
  },
  {
    id: "memory-match",
    name: "Memory Match",
    category: "Working Memory",
    skillTested: "Memory",
    iconName: "BrainCircuit",
    tagline: "Flip and match algorithmic symbols & code terms",
    estimatedMinutes: 3,
    difficulties: ["Easy", "Medium", "Hard"],
    description: "Flip paired cards to find matches in minimal moves and time.",
    cognitiveBenefit: "Boosts working memory retention and visual pattern recall essential for multi-step reasoning.",
  },
  {
    id: "pattern-recognition",
    name: "Pattern Recognition",
    category: "Inductive Reasoning",
    skillTested: "Pattern Recognition",
    iconName: "Shapes",
    tagline: "Identify numerical and geometric progression laws",
    estimatedMinutes: 4,
    difficulties: ["Easy", "Medium", "Hard"],
    description: "Analyze non-trivial sequences (Fibonacci variants, rotational shapes, bitwise patterns) to find the missing element.",
    cognitiveBenefit: "Directly improves performance on company abstract reasoning tests (McKinsey, Capgemini, TCS).",
  },
  {
    id: "logical-reasoning",
    name: "Logical Grid Riddles",
    category: "Deduction & Truths",
    skillTested: "Problem Solving",
    iconName: "KeyRound",
    tagline: "Solve knight/knave riddles and placement seating logic",
    estimatedMinutes: 5,
    difficulties: ["Easy", "Medium", "Hard"],
    description: "Read premise clues and deduce true/false assignments without contradiction.",
    cognitiveBenefit: "Trains formal boolean logic and analytical reasoning for placement interviews.",
  },
  {
    id: "number-puzzle",
    name: "Target 24 / Math Speed",
    category: "Mental Arithmetic",
    skillTested: "Processing Speed",
    iconName: "Calculator",
    tagline: "Combine numbers using (+, -, ×, ÷) to reach target",
    estimatedMinutes: 3,
    difficulties: ["Easy", "Medium", "Hard"],
    description: "Use four provided integers and basic operators to form an arithmetic expression equal to target 24.",
    cognitiveBenefit: "Sharpens fast calculation and quantitative mental agility under tight interview countdowns.",
  },
  {
    id: "word-puzzle",
    name: "Placement Vocab Anagram",
    category: "Verbal Agility",
    skillTested: "Processing Speed",
    iconName: "FileSpreadsheet",
    tagline: "Unscramble high-frequency placement vocabulary",
    estimatedMinutes: 3,
    difficulties: ["Easy", "Medium", "Hard"],
    description: "Unscramble letters to reveal technical and professional placement terminology.",
    cognitiveBenefit: "Strengthens verbal processing speed and lexical retrieval.",
  },
  {
    id: "quick-brain-quiz",
    name: "60-Second Blitz",
    category: "Speed Cognition",
    skillTested: "Processing Speed",
    iconName: "Zap",
    tagline: "Answer rapid logic & mental arithmetic questions",
    estimatedMinutes: 1,
    difficulties: ["Easy", "Medium", "Hard"],
    description: "Solve as many fast-fire mental agility questions as possible in 60 seconds.",
    cognitiveBenefit: "Builds mental stamina and poise under rapid timed screening constraints.",
  },
];

// Sample Pattern Recognition sequences
export interface PatternItem {
  id: string;
  difficulty: "Easy" | "Medium" | "Hard";
  sequence: (string | number)[];
  options: (string | number)[];
  correctIndex: number;
  explanation: string;
}

export const PATTERN_ITEMS: PatternItem[] = [
  {
    id: "pat-1",
    difficulty: "Easy",
    sequence: [2, 4, 8, 16, "?"],
    options: [24, 30, 32, 36],
    correctIndex: 2,
    explanation: "Each number is multiplied by 2: 16 × 2 = 32 (Powers of 2: 2^n).",
  },
  {
    id: "pat-2",
    difficulty: "Medium",
    sequence: [1, 1, 2, 3, 5, 8, 13, "?"],
    options: [18, 20, 21, 24],
    correctIndex: 2,
    explanation: "Fibonacci sequence where each term is the sum of the preceding two: 8 + 13 = 21.",
  },
  {
    id: "pat-3",
    difficulty: "Medium",
    sequence: [3, 5, 9, 17, 33, "?"],
    options: [49, 57, 65, 72],
    correctIndex: 2,
    explanation: "Differences are doubling (+2, +4, +8, +16, +32): 33 + 32 = 65.",
  },
  {
    id: "pat-4",
    difficulty: "Hard",
    sequence: [2, 6, 12, 20, 30, 42, "?"],
    options: [54, 56, 58, 62],
    correctIndex: 1,
    explanation: "Formula n × (n + 1): 1×2=2, 2×3=6, 3×4=12, 4×5=20, 5×6=30, 6×7=42, next is 7×8 = 56.",
  },
];
