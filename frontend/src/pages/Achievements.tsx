import { useState } from "react";
import { Progress } from "@/components/ui/progress";
import {
  Award,
  Trophy,
  CheckCircle2,
  Lock,
  Code2,
  FileText,
  MessageSquare,
  Sparkles,
  Flame,
  Star,
  Target,
  Download,
} from "lucide-react";

type CategoryId = "all" | "coding" | "resume" | "communication" | "milestones";

interface Badge {
  id: string;
  title: string;
  category: "coding" | "resume" | "communication" | "milestones";
  description: string;
  icon: typeof Code2;
  unlocked: boolean;
  unlockedDate?: string;
  progress: number;
  maxProgress: number;
  xpReward: number;
}

const BADGES: Badge[] = [
  {
    id: "b1",
    title: "Array & Two Pointers Master",
    category: "coding",
    description: "Solve 20 high-yield array and two pointers interview problems.",
    icon: Code2,
    unlocked: true,
    unlockedDate: "May 2026",
    progress: 20,
    maxProgress: 20,
    xpReward: 300,
  },
  {
    id: "b2",
    title: "Tree Traversals Specialist",
    category: "coding",
    description: "Solve 15 binary tree BFS and DFS recursion problems.",
    icon: Code2,
    unlocked: true,
    unlockedDate: "June 2026",
    progress: 15,
    maxProgress: 15,
    xpReward: 350,
  },
  {
    id: "b3",
    title: "Dynamic Programming Strategist",
    category: "coding",
    description: "Solve 18 DP problems covering Knapsack, LCS, and Grid paths.",
    icon: Code2,
    unlocked: false,
    progress: 10,
    maxProgress: 18,
    xpReward: 500,
  },
  {
    id: "b4",
    title: "ATS 85+ Resume Certified",
    category: "resume",
    description: "Optimize your resume to reach an 85+ ATS compatibility index.",
    icon: FileText,
    unlocked: true,
    unlockedDate: "June 2026",
    progress: 88,
    maxProgress: 85,
    xpReward: 250,
  },
  {
    id: "b5",
    title: "Voice Clarity Pioneer",
    category: "communication",
    description: "Complete 5 mock speaking modules with 80%+ voice clarity.",
    icon: MessageSquare,
    unlocked: true,
    unlockedDate: "July 2026",
    progress: 5,
    maxProgress: 5,
    xpReward: 300,
  },
  {
    id: "b6",
    title: "14-Day Consistency Streak",
    category: "milestones",
    description: "Maintain an unbroken daily coding and interview prep streak.",
    icon: Flame,
    unlocked: false,
    progress: 12,
    maxProgress: 14,
    xpReward: 400,
  },
  {
    id: "b7",
    title: "SQL & Query Optimizer",
    category: "coding",
    description: "Master multi-table JOINs, subqueries, and window functions.",
    icon: Code2,
    unlocked: true,
    unlockedDate: "August 2026",
    progress: 16,
    maxProgress: 16,
    xpReward: 350,
  },
  {
    id: "b8",
    title: "Tier-1 Placement Ready",
    category: "milestones",
    description: "Reach an overall placement readiness index of 80%+.",
    icon: Trophy,
    unlocked: false,
    progress: 78,
    maxProgress: 80,
    xpReward: 1000,
  },
];

export default function Achievements() {
  const [selectedCat, setSelectedCat] = useState<CategoryId>("all");

  const filteredBadges = BADGES.filter(
    (b) => selectedCat === "all" || b.category === selectedCat
  );

  const unlockedCount = BADGES.filter((b) => b.unlocked).length;

  return (
    <div className="space-y-6 font-sans text-foreground">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-1">
          Milestones & Verified Badges
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Track technical credentials earned across problem sets, resume milestones, and voice assessments.
        </p>
      </div>

      {/* Overview Stat Card */}
      <div className="p-6 sm:p-8 rounded-2xl border border-border bg-card shadow-sm">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-teal-500/30 bg-teal-500/10 text-teal-600 dark:text-teal-400 text-xs font-semibold">
              <Award className="w-3.5 h-3.5" /> Candidate Badge Portfolio
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-foreground">
              {unlockedCount} of {BADGES.length} Milestones Achieved
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-lg leading-relaxed">
              Earned badges automatically reflect on your candidate profile and placement readiness index.
            </p>
          </div>

          <div className="w-48 space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-muted-foreground">Completion</span>
              <span className="text-teal-600 dark:text-teal-400 font-mono">
                {Math.round((unlockedCount / BADGES.length) * 100)}%
              </span>
            </div>
            <Progress
              value={(unlockedCount / BADGES.length) * 100}
              className="h-2 bg-secondary [&>div]:bg-teal-600 rounded-full"
            />
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap gap-2">
        {[
          { id: "all", label: "All Milestones" },
          { id: "coding", label: "DSA & Coding" },
          { id: "resume", label: "Resume & ATS" },
          { id: "communication", label: "Communication" },
          { id: "milestones", label: "Consistency & Tier-1" },
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCat(cat.id as CategoryId)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              selectedCat === cat.id
                ? "border-teal-500 bg-teal-500/10 text-teal-600 dark:text-teal-400"
                : "border-border bg-card text-muted-foreground hover:text-foreground hover:bg-secondary"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBadges.map((b) => (
          <div
            key={b.id}
            className={`p-5 rounded-xl border bg-card shadow-sm space-y-4 transition-all ${
              b.unlocked
                ? "border-teal-500/40 hover:border-teal-500"
                : "border-border opacity-70"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div
                className={`w-10 h-10 rounded-lg border flex items-center justify-center shrink-0 ${
                  b.unlocked
                    ? "bg-teal-500/15 text-teal-600 dark:text-teal-400 border-teal-500/30"
                    : "bg-secondary text-muted-foreground border-border"
                }`}
              >
                <b.icon className="w-5 h-5" />
              </div>

              {b.unlocked ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  <CheckCircle2 className="w-3 h-3" /> Unlocked ({b.unlockedDate})
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-secondary text-muted-foreground border border-border">
                  <Lock className="w-3 h-3" /> In Progress
                </span>
              )}
            </div>

            <div className="space-y-1">
              <h3 className="text-xs font-bold text-foreground">{b.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{b.description}</p>
            </div>

            <div className="space-y-1.5 pt-2 border-t border-border">
              <div className="flex justify-between text-[11px]">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-mono text-foreground font-semibold">
                  {b.progress} / {b.maxProgress}
                </span>
              </div>
              <Progress
                value={(b.progress / b.maxProgress) * 100}
                className="h-1.5 bg-secondary [&>div]:bg-teal-600 rounded-full"
              />
              <div className="flex justify-between items-center pt-1 text-[11px]">
                <span className="text-muted-foreground font-mono">+{b.xpReward} XP</span>
                {b.unlocked && (
                  <span className="text-teal-600 dark:text-teal-400 font-semibold cursor-pointer hover:underline flex items-center gap-1">
                    <Download className="w-3 h-3" /> Share Badge
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}