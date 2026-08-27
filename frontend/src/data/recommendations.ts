// PlaceMentor AI — Smart Cross-Module Recommendation Engine
// Connects Coding, Aptitude, Communication, Resume, Brain Training, and Quizee with explicit "WHY THIS?" justifications.

export interface SmartRecommendation {
  id: string;
  module: "practice" | "aptitude" | "communication" | "resume" | "readiness" | "brain-zone" | "quizee";
  title: string;
  subtitle: string;
  route: string;
  badge: string;
  badgeColor: string; // e.g. "bg-purple-500/15 text-purple-400 border-purple-500/30"
  estimatedTime: string;
  impactScore: string;
  whyThisReason: string;
  iconName: string;
}

export const SMART_RECOMMENDATIONS: SmartRecommendation[] = [
  {
    id: "rec-1",
    module: "aptitude",
    title: "Improve Data Interpretation & Percentage Calculations",
    subtitle: "Practice 5 high-yield Bar & Pie Chart questions",
    route: "/aptitude",
    badge: "High Priority",
    badgeColor: "bg-rose-500/15 text-rose-400 border-rose-500/30",
    estimatedTime: "12 mins",
    impactScore: "+6 Readiness Pts",
    whyThisReason: "Your DI accuracy dropped by 12% on the last diagnostic attempt under timed constraints.",
    iconName: "BarChart3",
  },
  {
    id: "rec-2",
    module: "practice",
    title: "Master Dynamic Programming Subsequence Patterns",
    subtitle: "Solve Longest Increasing Subsequence & 0/1 Knapsack",
    route: "/practice",
    badge: "Tier-1 SDE Focus",
    badgeColor: "bg-purple-500/15 text-purple-400 border-purple-500/30",
    estimatedTime: "25 mins",
    impactScore: "+8 Readiness Pts",
    whyThisReason: "You have solved fewer DP questions compared to Arrays & Trees, and DP is asked in 78% of Amazon & Google rounds.",
    iconName: "Code2",
  },
  {
    id: "rec-3",
    module: "communication",
    title: "Practice Spoken STAR Story for Handling Conflict",
    subtitle: "Record a 90-second behavioral response with live feedback",
    route: "/communication",
    badge: "HR Screening",
    badgeColor: "bg-teal-500/15 text-teal-400 border-teal-500/30",
    estimatedTime: "5 mins",
    impactScore: "+4 Readiness Pts",
    whyThisReason: "Your previous speech recording showed a fast pace (165 WPM) with 4 filler words.",
    iconName: "MessageSquare",
  },
  {
    id: "rec-4",
    module: "brain-zone",
    title: "Try a Working Memory Card Match Exercise",
    subtitle: "Boost short-term recall and symbol retention",
    route: "/brain-zone",
    badge: "Cognitive Agility",
    badgeColor: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    estimatedTime: "4 mins",
    impactScore: "+3 Readiness Pts",
    whyThisReason: "Recent multi-step problem tests indicated cognitive fatigue on 3+ variable tracking.",
    iconName: "BrainCircuit",
  },
  {
    id: "rec-5",
    module: "quizee",
    title: "Take a 5-Minute DBMS Indexing & Normalization Quiz",
    subtitle: "Test B+ Trees, BCNF & SQL join performance",
    route: "/quizee",
    badge: "Core CS",
    badgeColor: "bg-blue-500/15 text-blue-400 border-blue-500/30",
    estimatedTime: "5 mins",
    impactScore: "+5 Readiness Pts",
    whyThisReason: "Technical screening rounds at TCS Digital and Cognizant heavily weigh DBMS transaction ACID properties.",
    iconName: "Database",
  },
];
