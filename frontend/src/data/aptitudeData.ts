// PlaceMentor AI — Aptitude Question Repository & Curriculum
// Categories: Quantitative Aptitude, Logical Reasoning, Data Interpretation, Verbal Ability

export interface AptitudeQuestion {
  id: string;
  category: "Quantitative Aptitude" | "Logical Reasoning" | "Data Interpretation" | "Verbal Ability";
  topic: string;
  difficulty: "Easy" | "Medium" | "Hard";
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  shortcutTrick?: string;
  formula?: string;
  companies?: string[];
}

export const APTITUDE_CATEGORIES = [
  "Quantitative Aptitude",
  "Logical Reasoning",
  "Data Interpretation",
  "Verbal Ability",
] as const;

export type AptitudeCategory = typeof APTITUDE_CATEGORIES[number];

export const APTITUDE_TOPICS: Record<AptitudeCategory, string[]> = {
  "Quantitative Aptitude": [
    "Time & Work",
    "Percentages",
    "Profit & Loss",
    "Speed, Time & Distance",
    "Permutations & Combinations",
    "Probability",
    "Simple & Compound Interest",
    "Ratios & Proportions",
  ],
  "Logical Reasoning": [
    "Blood Relations",
    "Seating Arrangement",
    "Coding-Decoding",
    "Syllogisms",
    "Direction Sense",
    "Number Series",
    "Clocks & Calendars",
  ],
  "Data Interpretation": [
    "Bar Charts & Growth",
    "Pie Charts Distribution",
    "Table Analysis",
    "Line Graphs Trend",
    "Caselet DI",
  ],
  "Verbal Ability": [
    "Reading Comprehension",
    "Sentence Correction & Grammar",
    "Para Jumbles",
    "Synonyms & Antonyms",
    "Idioms & Phrases",
  ],
};

export const APTITUDE_QUESTIONS: AptitudeQuestion[] = [
  // ---------------- Quantitative Aptitude ----------------
  {
    id: "qa-1",
    category: "Quantitative Aptitude",
    topic: "Time & Work",
    difficulty: "Easy",
    question: "A can complete a piece of work in 12 days, and B can complete the same work in 24 days. Working together, in how many days will they finish the work?",
    options: ["6 days", "8 days", "9 days", "10 days"],
    correctIndex: 1,
    explanation: "A's 1-day work = 1/12. B's 1-day work = 1/24. Combined 1-day work = (1/12) + (1/24) = 3/24 = 1/8. Therefore, total time taken together = 8 days.",
    shortcutTrick: "Formula for two people: (A × B) / (A + B) = (12 × 24) / (12 + 24) = 288 / 36 = 8 days.",
    formula: "Total Days = (A × B) / (A + B)",
    companies: ["TCS", "Infosys", "Cognizant", "Accenture"],
  },
  {
    id: "qa-2",
    category: "Quantitative Aptitude",
    topic: "Percentages",
    difficulty: "Medium",
    question: "If the price of petrol increases by 25%, by what percentage must a driver reduce petrol consumption so that the total expenditure remains constant?",
    options: ["15%", "20%", "22.5%", "25%"],
    correctIndex: 1,
    explanation: "Let original price = 100, consumption = 100, expenditure = 10,000. New price = 125. Required consumption = 10000 / 125 = 80. Reduction = 100 - 80 = 20%.",
    shortcutTrick: "If price increases by r%, reduction = [r / (100 + r)] × 100% = [25 / 125] × 100% = (1/5) × 100% = 20%.",
    formula: "Reduction % = [r / (100 + r)] × 100%",
    companies: ["Amazon", "Wipro", "Deloitte"],
  },
  {
    id: "qa-3",
    category: "Quantitative Aptitude",
    topic: "Profit & Loss",
    difficulty: "Easy",
    question: "A merchant sells an article for ₹840 making a profit of 20%. What was the cost price of the article?",
    options: ["₹680", "₹700", "₹720", "₹750"],
    correctIndex: 1,
    explanation: "SP = CP × (1 + Profit%). 840 = CP × 1.2. CP = 840 / 1.2 = ₹700.",
    shortcutTrick: "20% profit = 1/5 fraction. Multiplier is 6/5. CP = SP × (5/6) = 840 × 5 / 6 = 140 × 5 = 700.",
    formula: "CP = SP / (1 + P%)",
    companies: ["Capgemini", "LTI", "TCS Digital"],
  },
  {
    id: "qa-4",
    category: "Quantitative Aptitude",
    topic: "Speed, Time & Distance",
    difficulty: "Medium",
    question: "A train 180 meters long running at 54 km/h passes a standing platform in 20 seconds. What is the length of the platform?",
    options: ["100 m", "120 m", "150 m", "200 m"],
    correctIndex: 1,
    explanation: "Convert speed: 54 km/h = 54 × (5/18) = 15 m/s. Total distance in 20s = 15 × 20 = 300 meters. Length of platform = Total distance - Train length = 300 - 180 = 120 meters.",
    shortcutTrick: "Speed in m/s = km/h × (5/18). Total Distance = Speed × Time = Train Length + Platform Length.",
    formula: "Speed (m/s) = Speed (km/h) × 5/18",
    companies: ["Infosys", "Goldman Sachs", "Cisco"],
  },
  {
    id: "qa-5",
    category: "Quantitative Aptitude",
    topic: "Probability",
    difficulty: "Hard",
    question: "Two cards are drawn at random from a standard 52-card deck without replacement. What is the probability that both are Aces?",
    options: ["1/221", "1/169", "1/26", "4/663"],
    correctIndex: 0,
    explanation: "Number of Aces = 4. P(1st Ace) = 4/52 = 1/13. P(2nd Ace) = 3/51 = 1/17. Joint probability = (1/13) × (1/17) = 1/221.",
    shortcutTrick: "(4/52) × (3/51) = (1/13) × (1/17) = 1/221.",
    formula: "P(A ∩ B) = P(A) × P(B|A)",
    companies: ["Google", "Morgan Stanley", "Tower Research"],
  },

  // ---------------- Logical Reasoning ----------------
  {
    id: "lr-1",
    category: "Logical Reasoning",
    topic: "Blood Relations",
    difficulty: "Easy",
    question: "Pointing to a photograph of a boy, Suresh said, 'He is the only son of my mother's only daughter.' How is Suresh related to that boy?",
    options: ["Father", "Uncle", "Brother", "Maternal Uncle"],
    correctIndex: 3,
    explanation: "Suresh's mother's only daughter is Suresh's sister. The boy is the son of Suresh's sister. Hence, Suresh is the boy's Maternal Uncle.",
    shortcutTrick: "Break from the end: 'Mother's only daughter' = Sister. 'Son of sister' = Nephew. Thus Suresh = Maternal Uncle.",
    companies: ["TCS", "Accenture", "Mindtree"],
  },
  {
    id: "lr-2",
    category: "Logical Reasoning",
    topic: "Coding-Decoding",
    difficulty: "Medium",
    question: "In a certain code language, 'LEARN' is coded as 'OHDUQ'. How is 'BUILD' coded in that language?",
    options: ["EXLOG", "EXLHD", "EZLOD", "EXLOD"],
    correctIndex: 0,
    explanation: "Each letter is shifted forward by +3 positions: L(+3)->O, E(+3)->H, A(+3)->D, R(+3)->U, N(+3)->Q. Applying to BUILD: B(+3)->E, U(+3)->X, I(+3)->L, L(+3)->O, D(+3)->G => 'EXLOG'.",
    shortcutTrick: "Alphabet position shift pattern: +3 to all characters.",
    companies: ["Infosys", "Wipro", "HCL"],
  },
  {
    id: "lr-3",
    category: "Logical Reasoning",
    topic: "Syllogisms",
    difficulty: "Medium",
    question: "Statements: All cats are animals. Some animals are pets. Conclusions: I. Some cats are pets. II. Some pets are animals.",
    options: ["Only I follows", "Only II follows", "Both I and II follow", "Neither follows"],
    correctIndex: 1,
    explanation: "From 'Some animals are pets', the converse 'Some pets are animals' is always valid (Conclusion II). However, there is no direct link connecting cats to pets, so Conclusion I does not necessarily follow.",
    shortcutTrick: "Universal Affirmative (A) + Particular Affirmative (I) gives no direct definite conclusion between outer terms without middle term overlap.",
    companies: ["TCS NQT", "Cognizant", "Hexaware"],
  },
  {
    id: "lr-4",
    category: "Logical Reasoning",
    topic: "Direction Sense",
    difficulty: "Easy",
    question: "An engineer walks 10m North, turns Right and walks 15m, then turns Right and walks 10m, and finally turns Left and walks 5m. In which direction and at what distance is he from the starting point?",
    options: ["East, 20m", "West, 20m", "East, 15m", "North, 25m"],
    correctIndex: 0,
    explanation: "North 10m (+10 Y) and South 10m (-10 Y) cancel out. Moving East 15m (+15 X) and further East 5m (+5 X) results in +20m East from starting point.",
    shortcutTrick: "Sum vector displacements: Y = +10 - 10 = 0. X = +15 + 5 = 20 East.",
    companies: ["Accenture", "LTI", "Tech Mahindra"],
  },

  // ---------------- Data Interpretation ----------------
  {
    id: "di-1",
    category: "Data Interpretation",
    topic: "Bar Charts & Growth",
    difficulty: "Medium",
    question: "Company revenue grew from ₹40 Cr in 2023 to ₹58 Cr in 2024. What was the percentage year-over-year revenue growth?",
    options: ["35%", "40%", "45%", "48%"],
    correctIndex: 2,
    explanation: "Growth = ((58 - 40) / 40) × 100% = (18 / 40) × 100% = 45%.",
    shortcutTrick: "18/40 = 9/20 = 45%.",
    formula: "YoY Growth % = [(Final - Initial) / Initial] × 100%",
    companies: ["Amazon", "Deloitte", "KPMG", "EY"],
  },
  {
    id: "di-2",
    category: "Data Interpretation",
    topic: "Pie Charts Distribution",
    difficulty: "Medium",
    question: "In an expenditure pie chart of total ₹1,20,000, R&D represents a central sector angle of 72°. How much budget is allocated to R&D?",
    options: ["₹18,000", "₹24,000", "₹28,000", "₹32,000"],
    correctIndex: 1,
    explanation: "Fraction of circle = 72° / 360° = 1/5 = 20%. Budget = 20% of 1,20,000 = ₹24,000.",
    shortcutTrick: "72° is always exactly (1/5) or 20% of any circular budget.",
    formula: "Value = (Angle / 360°) × Total",
    companies: ["Morgan Stanley", "Barclays", "MuSigma"],
  },
  {
    id: "di-3",
    category: "Data Interpretation",
    topic: "Table Analysis",
    difficulty: "Hard",
    question: "In a company of 500 employees, 60% are Male. 40% of Males and 70% of Females passed the technical screening. How many total employees passed?",
    options: ["240", "260", "280", "300"],
    correctIndex: 1,
    explanation: "Males = 60% of 500 = 300. Females = 200. Passed Males = 40% of 300 = 120. Passed Females = 70% of 200 = 140. Total Passed = 120 + 140 = 260.",
    shortcutTrick: "Males passed: 0.40 × 300 = 120. Females passed: 0.70 × 200 = 140. Sum = 260.",
    companies: ["Goldman Sachs", "JP Morgan", "ZS Associates"],
  },

  // ---------------- Verbal Ability ----------------
  {
    id: "va-1",
    category: "Verbal Ability",
    topic: "Sentence Correction & Grammar",
    difficulty: "Easy",
    question: "Identify the grammatically correct sentence:",
    options: [
      "Neither the manager nor the engineers was available for comments.",
      "Neither the manager nor the engineers were available for comments.",
      "Neither the manager or the engineers was available for comments.",
      "Neither the manager nor the engineers are been available.",
    ],
    correctIndex: 1,
    explanation: "In 'Neither... nor' constructions, the verb agrees in number with the subject closest to it. Since 'engineers' is plural, the plural verb 'were' is grammatically correct.",
    shortcutTrick: "Rule of Proximity: Verb matches the nearest subject in 'either/or' & 'neither/nor'.",
    companies: ["TCS", "Infosys", "Deloitte"],
  },
  {
    id: "va-2",
    category: "Verbal Ability",
    topic: "Synonyms & Antonyms",
    difficulty: "Medium",
    question: "Select the word most similar in meaning to PRAGMATIC:",
    options: ["Theoretical", "Idealistic", "Practical", "Careless"],
    correctIndex: 2,
    explanation: "'Pragmatic' means dealing with things sensibly and realistically based on practical rather than theoretical considerations. Synonym is 'Practical'.",
    shortcutTrick: "Pragmatic relates to 'practice/practical action'.",
    companies: ["Accenture", "Amazon", "Capgemini"],
  },
  {
    id: "va-3",
    category: "Verbal Ability",
    topic: "Para Jumbles",
    difficulty: "Hard",
    question: "Arrange the sentences into a logical paragraph:\n1. Artificial intelligence models require vast amounts of curated data.\n2. Without high-quality data, algorithms perpetuate existing societal biases.\n3. Therefore, ethical data curation is paramount in machine learning pipelines.\n4. Modern neural architectures have achieved superhuman benchmark scores.",
    options: ["4-1-2-3", "1-4-2-3", "4-3-1-2", "2-1-4-3"],
    correctIndex: 0,
    explanation: "Sentence 4 introduces the modern achievement. Sentence 1 highlights the dependency on data. Sentence 2 details the risk of poor data. Sentence 3 provides the concluding synthesis ('Therefore...'). Hence 4-1-2-3 is logically sound.",
    shortcutTrick: "Look for general opening statement (4) and concluding marker word 'Therefore' (3).",
    companies: ["TCS Digital", "Google", "Microsoft"],
  },
];
