import React, { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/context/AuthContext";
import { API_URL, getAuthHeaders } from "@/config";
import {
  Target,
  CheckCircle2,
  Circle,
  Code2,
  FileText,
  MessageSquare,
  Sparkles,
  Calendar,
  Flame,
  Plus,
  Trash2,
} from "lucide-react";

interface Goal {
  id: string;
  title: string;
  category: "DSA & Coding" | "Resume" | "Communication" | "Mock Prep";
  current: number;
  target: number;
  unit: string;
  completed: boolean;
  xpReward: number;
}

const WEEK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function WeeklyGoals() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [problemStats, setProblemStats] = useState<any>(null);
  const [assessmentHistory, setAssessmentHistory] = useState<any[]>([]);
  const [brainProgress, setBrainProgress] = useState<any>(null);
  const [customGoals, setCustomGoals] = useState<Goal[]>([]);

  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState<Goal["category"]>("DSA & Coding");
  const [newTarget, setNewTarget] = useState("5");

  // Load custom goals for current user
  useEffect(() => {
    if (user?.id) {
      const saved = localStorage.getItem(`pm_goals_${user.id}`);
      if (saved) {
        try {
          setCustomGoals(JSON.parse(saved));
        } catch {
          setCustomGoals([]);
        }
      }
    }
  }, [user?.id]);

  // Fetch real performance data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const headers = getAuthHeaders(true);
        const [pRes, aRes, bRes] = await Promise.all([
          fetch(`${API_URL}/api/problems/stats`, { headers }),
          fetch(`${API_URL}/api/assessments/history`, { headers }),
          fetch(`${API_URL}/api/brainzone/progress`, { headers }),
        ]);

        if (pRes.ok) setProblemStats(await pRes.json());
        if (aRes.ok) {
          const aData = await aRes.json();
          setAssessmentHistory(aData.attempts || []);
        }
        if (bRes.ok) setBrainProgress(await bRes.json());
      } catch (err) {
        console.error("Failed to fetch goals data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  // Calculate real metrics
  const solvedCount = problemStats?.solved_count || 0;
  const aptCount = assessmentHistory.filter((a) => a.assessment_type === "aptitude").length;
  const quizCount = assessmentHistory.filter((a) => a.assessment_type === "quiz").length;
  const bzCount = brainProgress?.completed_levels_count || 0;

  // Real system goals backed by MongoDB evidence
  const systemGoals: Goal[] = [
    {
      id: "sys-coding",
      title: "Solve Algorithmic DSA Problems",
      category: "DSA & Coding",
      current: solvedCount,
      target: 10,
      unit: "problems",
      completed: solvedCount >= 10,
      xpReward: 200,
    },
    {
      id: "sys-aptitude",
      title: "Complete Quantitative Aptitude Practice",
      category: "Mock Prep",
      current: aptCount,
      target: 5,
      unit: "tests",
      completed: aptCount >= 5,
      xpReward: 150,
    },
    {
      id: "sys-quiz",
      title: "Pass Core Computer Science Quizzes",
      category: "Mock Prep",
      current: quizCount,
      target: 5,
      unit: "quizzes",
      completed: quizCount >= 5,
      xpReward: 150,
    },
    {
      id: "sys-brain",
      title: "Complete Brain Zone Cognitive Puzzles",
      category: "DSA & Coding",
      current: bzCount,
      target: 5,
      unit: "levels",
      completed: bzCount >= 5,
      xpReward: 100,
    },
  ];

  const allGoals = [...systemGoals, ...customGoals];

  // Calculate real week activity indicators (Monday to Sunday)
  const now = new Date();
  const dayOfWeek = (now.getDay() + 6) % 7; // 0 = Mon, 6 = Sun
  const monday = new Date(now);
  monday.setDate(now.getDate() - dayOfWeek);
  monday.setHours(0, 0, 0, 0);

  const activeDatesThisWeek = new Set<number>();
  // Check assessment dates
  assessmentHistory.forEach((att) => {
    if (att.timestamp) {
      const d = new Date(att.timestamp);
      if (d >= monday) {
        const dIdx = (d.getDay() + 6) % 7;
        activeDatesThisWeek.add(dIdx);
      }
    }
  });
  // Check brain zone history
  if (brainProgress?.recent_history) {
    brainProgress.recent_history.forEach((h: any) => {
      if (h.timestamp) {
        const d = new Date(h.timestamp);
        if (d >= monday) {
          const dIdx = (d.getDay() + 6) % 7;
          activeDatesThisWeek.add(dIdx);
        }
      }
    });
  }

  const weekStatus = WEEK_DAYS.map((_, idx) => activeDatesThisWeek.has(idx));

  const toggleCustomGoal = (id: string) => {
    const updated = customGoals.map((g) =>
      g.id === id ? { ...g, completed: !g.completed, current: !g.completed ? g.target : 0 } : g
    );
    setCustomGoals(updated);
    if (user?.id) {
      localStorage.setItem(`pm_goals_${user.id}`, JSON.stringify(updated));
    }
  };

  const addGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const goal: Goal = {
      id: `custom-${Date.now()}`,
      title: newTitle.trim(),
      category: newCategory,
      current: 0,
      target: parseInt(newTarget) || 5,
      unit: "tasks",
      completed: false,
      xpReward: 150,
    };
    const updated = [...customGoals, goal];
    setCustomGoals(updated);
    if (user?.id) {
      localStorage.setItem(`pm_goals_${user.id}`, JSON.stringify(updated));
    }
    setNewTitle("");
  };

  const deleteGoal = (id: string) => {
    const updated = customGoals.filter((g) => g.id !== id);
    setCustomGoals(updated);
    if (user?.id) {
      localStorage.setItem(`pm_goals_${user.id}`, JSON.stringify(updated));
    }
  };

  const completedCount = allGoals.filter((g) => g.completed).length;
  const progressPercent = Math.round((completedCount / Math.max(1, allGoals.length)) * 100) || 0;

  return (
    <div className="space-y-6 font-sans text-foreground">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-1">
          Weekly Placement Goals
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Set structured weekly targets to maintain placement readiness momentum.
        </p>
      </div>

      {/* Week Progress Summary */}
      <div className="p-6 sm:p-8 rounded-2xl border border-border bg-card shadow-sm">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-teal-500/30 bg-teal-500/10 text-teal-600 dark:text-teal-400 text-xs font-semibold">
              <Calendar className="w-3.5 h-3.5" /> Sprint Week &middot; {new Date().toLocaleDateString(undefined, { month: "short", year: "numeric" })}
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-foreground">
              {completedCount} of {allGoals.length} Weekly Goals Cleared
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-lg leading-relaxed">
              Track real goals derived from your verified problem solving and assessment activity.
            </p>
          </div>

          <div className="w-48 space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-muted-foreground">Weekly Completion</span>
              <span className="text-teal-600 dark:text-teal-400 font-mono">{progressPercent}%</span>
            </div>
            <Progress value={progressPercent} className="h-2 bg-secondary [&>div]:bg-teal-600 rounded-full" />
          </div>
        </div>

        {/* Daily Streak Tracker */}
        <div className="pt-6 border-t border-border mt-6">
          <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2.5">
            Daily Goal Activity (This Week)
          </p>
          <div className="grid grid-cols-7 gap-2">
            {WEEK_DAYS.map((day, i) => (
              <div
                key={day}
                className={`p-2.5 rounded-lg border text-center space-y-1 ${
                  weekStatus[i]
                    ? "border-teal-500/30 bg-teal-500/10 text-teal-600 dark:text-teal-400"
                    : "border-border bg-secondary/50 text-muted-foreground"
                }`}
              >
                <p className="text-[10px] font-bold uppercase">{day}</p>
                <div className="flex justify-center">
                  {weekStatus[i] ? (
                    <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                  ) : (
                    <Circle className="w-4 h-4 text-muted-foreground" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Goals Checklist & Add Form Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Goals Checklist */}
        <div className="lg:col-span-8 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-foreground">Target Checklist</h2>
            <span className="text-xs text-muted-foreground">{allGoals.length} total goals</span>
          </div>

          <div className="space-y-2.5">
            {allGoals.map((g) => (
              <div
                key={g.id}
                className={`p-4 rounded-xl border bg-card transition-all flex items-center justify-between gap-4 ${
                  g.completed
                    ? "border-emerald-500/30 bg-emerald-500/5 opacity-80"
                    : "border-border hover:border-teal-500/40"
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <button
                    onClick={() => !g.id.startsWith("sys-") && toggleCustomGoal(g.id)}
                    className="text-teal-600 dark:text-teal-400 hover:scale-110 transition-transform shrink-0"
                  >
                    {g.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    ) : (
                      <Circle className="w-5 h-5 text-muted-foreground" />
                    )}
                  </button>

                  <div className="space-y-0.5">
                    <p
                      className={`text-xs font-bold text-foreground ${
                        g.completed ? "line-through text-muted-foreground" : ""
                      }`}
                    >
                      {g.title}
                    </p>
                    <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                      <span className="px-1.5 py-0.2 rounded bg-secondary border border-border text-foreground font-medium">
                        {g.category}
                      </span>
                      <span>&bull;</span>
                      <span className="font-mono">
                        {g.current} / {g.target} {g.unit}
                      </span>
                      <span>&bull;</span>
                      <span className="font-mono text-teal-600 dark:text-teal-400">+{g.xpReward} XP</span>
                    </div>
                  </div>
                </div>

                {!g.id.startsWith("sys-") && (
                  <button
                    onClick={() => deleteGoal(g.id)}
                    className="text-muted-foreground hover:text-rose-500 transition-colors p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right: Add New Goal */}
        <div className="lg:col-span-4">
          <div className="p-5 rounded-xl border border-border bg-card shadow-sm space-y-4">
            <h2 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-teal-600 dark:text-teal-400" /> Add Custom Goal
            </h2>

            <form onSubmit={addGoal} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-foreground">Goal Description</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Solve 5 Tree problems..."
                  className="w-full px-3 py-2 rounded-lg border border-border bg-secondary/50 text-foreground"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-foreground">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as Goal["category"])}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-secondary/50 text-foreground"
                >
                  <option value="DSA & Coding">DSA & Coding</option>
                  <option value="Resume">Resume</option>
                  <option value="Communication">Communication</option>
                  <option value="Mock Prep">Mock Prep</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-foreground">Target Count</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={newTarget}
                  onChange={(e) => setNewTarget(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-secondary/50 text-foreground font-mono"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 mt-2 shadow-sm"
              >
                <Plus className="w-4 h-4" /> Add Goal to Sprint
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}