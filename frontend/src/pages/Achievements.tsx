import React, { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/context/AuthContext";
import { API_URL, getAuthHeaders } from "@/config";
import { toast } from "sonner";
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
  BrainCircuit,
  Calculator,
  Layers,
  Check,
} from "lucide-react";

type CategoryId = "all" | "coding" | "aptitude" | "quiz" | "milestones";

interface Badge {
  id: string;
  title: string;
  category: "coding" | "aptitude" | "quiz" | "milestones";
  description: string;
  icon: any;
  unlocked: boolean;
  unlockedDate?: string;
  progress: number;
  maxProgress: number;
  xpReward: number;
}

export default function Achievements() {
  const { user } = useAuth();
  const [selectedCat, setSelectedCat] = useState<CategoryId>("all");
  const [copiedBadgeId, setCopiedBadgeId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [problemStats, setProblemStats] = useState<any>(null);
  const [assessmentHistory, setAssessmentHistory] = useState<any[]>([]);
  const [brainProgress, setBrainProgress] = useState<any>(null);
  const [readinessData, setReadinessData] = useState<any>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      setLoading(true);
      try {
        const headers = getAuthHeaders(true);
        const [pRes, aRes, bRes, rRes] = await Promise.all([
          fetch(`${API_URL}/api/problems/stats`, { headers }),
          fetch(`${API_URL}/api/assessments/history`, { headers }),
          fetch(`${API_URL}/api/brainzone/progress`, { headers }),
          fetch(`${API_URL}/api/readiness`, { headers }),
        ]);

        if (pRes.ok) setProblemStats(await pRes.json());
        if (aRes.ok) {
          const aData = await aRes.json();
          setAssessmentHistory(aData.attempts || []);
        }
        if (bRes.ok) setBrainProgress(await bRes.json());
        if (rRes.ok) setReadinessData(await rRes.json());
      } catch (err) {
        console.error("Failed to load achievements data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, [user]);

  const solvedCount = problemStats?.solved_count || 0;
  const aptAttempts = assessmentHistory.filter((a) => a.assessment_type === "aptitude");
  const quizAttempts = assessmentHistory.filter((a) => a.assessment_type === "quiz");
  const bzLevels = brainProgress?.completed_levels_count || 0;
  const currentStreak = brainProgress?.streak_days || 0;
  const readinessScore = readinessData?.has_sufficient_data ? (readinessData.overall_readiness || 0) : 0;

  const dynamicBadges: Badge[] = [
    {
      id: "b1",
      title: "First Step on the Ladder",
      category: "milestones",
      description: "Complete your very first coding problem or diagnostic assessment.",
      icon: Sparkles,
      unlocked: (solvedCount + assessmentHistory.length + bzLevels) >= 1,
      unlockedDate: "Active",
      progress: Math.min(1, solvedCount + assessmentHistory.length + bzLevels),
      maxProgress: 1,
      xpReward: 100,
    },
    {
      id: "b2",
      title: "Problem Solving Starter",
      category: "coding",
      description: "Solve 5 algorithmic DSA problems on PlaceMentor AI.",
      icon: Code2,
      unlocked: solvedCount >= 5,
      unlockedDate: "Verified",
      progress: Math.min(5, solvedCount),
      maxProgress: 5,
      xpReward: 250,
    },
    {
      id: "b3",
      title: "Algorithmic Specialist",
      category: "coding",
      description: "Solve 15 diverse algorithmic problems across Arrays, Trees, and DP.",
      icon: Code2,
      unlocked: solvedCount >= 15,
      progress: Math.min(15, solvedCount),
      maxProgress: 15,
      xpReward: 500,
    },
    {
      id: "b4",
      title: "Quantitative Speed Master",
      category: "aptitude",
      description: "Complete 5 timed quantitative or logical aptitude assessment sessions.",
      icon: Calculator,
      unlocked: aptAttempts.length >= 5,
      progress: Math.min(5, aptAttempts.length),
      maxProgress: 5,
      xpReward: 200,
    },
    {
      id: "b5",
      title: "CS Fundamentals Pioneer",
      category: "quiz",
      description: "Complete 5 Core CS timed quizzes in OS, DBMS, SQL, or Networks.",
      icon: Layers,
      unlocked: quizAttempts.length >= 5,
      progress: Math.min(5, quizAttempts.length),
      maxProgress: 5,
      xpReward: 200,
    },
    {
      id: "b6",
      title: "Cognitive Agility Trainee",
      category: "milestones",
      description: "Complete 5 procedural Brain Zone training puzzles.",
      icon: BrainCircuit,
      unlocked: bzLevels >= 5,
      progress: Math.min(5, bzLevels),
      maxProgress: 5,
      xpReward: 150,
    },
    {
      id: "b7",
      title: "7-Day Consistency Streak",
      category: "milestones",
      description: "Maintain a 7-day unbroken daily practice streak.",
      icon: Flame,
      unlocked: currentStreak >= 7,
      progress: Math.min(7, currentStreak),
      maxProgress: 7,
      xpReward: 400,
    },
    {
      id: "b8",
      title: "Tier-1 Placement Ready",
      category: "milestones",
      description: "Reach an overall placement readiness index of 75%+ across all competency pillars.",
      icon: Trophy,
      unlocked: readinessScore >= 75,
      progress: Math.min(75, readinessScore),
      maxProgress: 75,
      xpReward: 1000,
    },
  ];

  const filteredBadges = dynamicBadges.filter(
    (b) => selectedCat === "all" || b.category === selectedCat
  );

  const unlockedCount = dynamicBadges.filter((b) => b.unlocked).length;

  const handleShareBadge = (badge: Badge) => {
    const text = `🏆 I unlocked the "${badge.title}" milestone (+${badge.xpReward} XP) on PlaceMentor AI! 🚀 Practice. Learn. Get Placed.`;
    navigator.clipboard.writeText(text);
    setCopiedBadgeId(badge.id);
    toast.success(`Copied "${badge.title}" achievement to clipboard!`);
    setTimeout(() => setCopiedBadgeId(null), 2500);
  };

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
              {unlockedCount} of {dynamicBadges.length} Milestones Achieved
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-lg leading-relaxed">
              Earned badges automatically reflect on your candidate profile and placement readiness index.
            </p>
          </div>

          <div className="w-48 space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-muted-foreground">Completion</span>
              <span className="text-teal-600 dark:text-teal-400 font-mono">
                {Math.round((unlockedCount / dynamicBadges.length) * 100)}%
              </span>
            </div>
            <Progress
              value={(unlockedCount / dynamicBadges.length) * 100}
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
          { id: "aptitude", label: "Quantitative Aptitude" },
          { id: "quiz", label: "Core CS Quizzes" },
          { id: "milestones", label: "Placement Milestones" },
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
                  <button
                    type="button"
                    onClick={() => handleShareBadge(b)}
                    className="text-teal-600 dark:text-teal-400 font-semibold hover:underline flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    {copiedBadgeId === b.id ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-500" /> Copied!
                      </>
                    ) : (
                      <>
                        <Download className="w-3 h-3" /> Share Badge
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}