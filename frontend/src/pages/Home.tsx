import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Progress } from "@/components/ui/progress";
import {
  Sparkles,
  ArrowRight,
  Code2,
  FileText,
  MessageSquare,
  Target,
  BarChart3,
  CheckCircle2,
  Clock,
  Briefcase,
  TrendingUp,
  AlertCircle,
  Building2,
  ChevronRight,
} from "lucide-react";

export default function Home() {
  const { user } = useAuth();

  const [dailyGoalCompleted, setDailyGoalCompleted] = useState(false);

  const stats = {
    problemsSolved: 42,
    totalProblems: 144,
    resumeScore: 84,
    commFluency: 88,
    readinessScore: 78,
    targetRole: "Full Stack SDE",
    targetCompanies: ["Amazon", "Microsoft", "Google", "TCS Digital"],
  };

  const recommendedTasks = [
    {
      id: "task-1",
      title: "Solve Two Pointers: 3Sum",
      category: "Data Structures & Algorithms",
      duration: "20 mins",
      difficulty: "Medium",
      link: "/practice",
      icon: Code2,
    },
    {
      id: "task-2",
      title: "Add Impact Metrics to Projects Section",
      category: "Resume Optimization",
      duration: "10 mins",
      difficulty: "Quick Fix",
      link: "/resume",
      icon: FileText,
    },
    {
      id: "task-3",
      title: "Practice STAR Story: Leadership Scenario",
      category: "Voice Communication",
      duration: "5 mins",
      difficulty: "Speaking",
      link: "/communication",
      icon: MessageSquare,
    },
  ];

  const skillGaps = [
    { skill: "Dynamic Programming", level: 65, status: "Focus Needed" },
    { skill: "System Design Concepts", level: 50, status: "Moderate Gap" },
    { skill: "Trees & Binary Search", level: 90, status: "Strong" },
    { skill: "SQL & Joins", level: 85, status: "Strong" },
  ];

  return (
    <div className="space-y-6 font-sans text-foreground">
      {/* 1. Welcome & Career Hero Section */}
      <div className="p-6 sm:p-8 rounded-2xl border border-border bg-card shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-teal-500/30 bg-teal-500/10 text-teal-600 dark:text-teal-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" /> Placement Season 2026
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Welcome back, {user?.name || "Student"}!
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-xl leading-relaxed">
              You are currently <span className="font-semibold text-foreground">{stats.readinessScore}% ready</span> for tier-1 campus placements. Your daily practice streak is active.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/practice"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold transition-all shadow-sm"
            >
              <Code2 className="w-4 h-4" /> Start Today's Practice
            </Link>
            <Link
              to="/placement-readiness"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-border bg-secondary hover:bg-secondary/80 text-foreground text-xs font-semibold transition-all"
            >
              <BarChart3 className="w-4 h-4" /> View Readiness
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Key Readiness KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-border bg-card shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Placement Readiness</span>
            <TrendingUp className="w-4 h-4 text-teal-600 dark:text-teal-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-foreground font-mono">{stats.readinessScore}%</span>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">+4% this week</span>
          </div>
          <Progress value={stats.readinessScore} className="h-1.5 bg-secondary [&>div]:bg-teal-600 rounded-full" />
        </div>

        <div className="p-4 rounded-xl border border-border bg-card shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Problems Solved</span>
            <Code2 className="w-4 h-4 text-blue-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-foreground font-mono">{stats.problemsSolved}</span>
            <span className="text-xs text-muted-foreground font-mono">/ {stats.totalProblems} high-yield</span>
          </div>
          <Progress value={(stats.problemsSolved / stats.totalProblems) * 100} className="h-1.5 bg-secondary [&>div]:bg-blue-500 rounded-full" />
        </div>

        <div className="p-4 rounded-xl border border-border bg-card shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">ATS Resume Score</span>
            <FileText className="w-4 h-4 text-purple-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-foreground font-mono">{stats.resumeScore}</span>
            <span className="text-xs text-muted-foreground">/ 100 (Strong)</span>
          </div>
          <Progress value={stats.resumeScore} className="h-1.5 bg-secondary [&>div]:bg-purple-500 rounded-full" />
        </div>

        <div className="p-4 rounded-xl border border-border bg-card shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Voice Clarity & Fluency</span>
            <MessageSquare className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-foreground font-mono">{stats.commFluency}%</span>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">Ready</span>
          </div>
          <Progress value={stats.commFluency} className="h-1.5 bg-secondary [&>div]:bg-amber-500 rounded-full" />
        </div>
      </div>

      {/* 3. Main Actionable Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Recommended Next Steps */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-foreground">Recommended Next Steps</h2>
              <p className="text-xs text-muted-foreground">Targeted tasks tailored to your hiring target: {stats.targetRole}</p>
            </div>
            <Link to="/practice" className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1">
              View Problem Library <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {recommendedTasks.map((task) => (
              <div
                key={task.id}
                className="p-4 rounded-xl border border-border bg-card hover:border-teal-500/40 hover:bg-secondary/30 transition-all flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-9 h-9 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-600 dark:text-teal-400 shrink-0">
                    <task.icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-foreground">{task.title}</h3>
                    <div className="flex items-center gap-3 text-[11px] text-muted-foreground mt-0.5">
                      <span>{task.category}</span>
                      <span>&bull;</span>
                      <span className="flex items-center gap-1 font-mono"><Clock className="w-3 h-3" /> {task.duration}</span>
                      <span>&bull;</span>
                      <span className="px-1.5 py-0.2 rounded bg-secondary border border-border text-foreground font-medium">{task.difficulty}</span>
                    </div>
                  </div>
                </div>

                <Link
                  to={task.link}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary hover:bg-secondary/80 border border-border text-xs font-semibold text-foreground transition-colors shrink-0"
                >
                  Start <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>

          {/* Target Company Focus */}
          <div className="p-4 rounded-xl border border-border bg-card space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-foreground">
              <Building2 className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <span>Target Company Hiring Patterns</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {stats.targetCompanies.map((c) => (
                <span
                  key={c}
                  className="px-2.5 py-1 rounded-lg bg-secondary border border-border text-xs font-medium text-foreground flex items-center gap-1.5"
                >
                  <Briefcase className="w-3 h-3 text-muted-foreground" /> {c}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Skill Gaps & Today's Target */}
        <div className="lg:col-span-4 space-y-4">
          {/* Today's Target Card */}
          <div className="p-4 rounded-xl border border-border bg-card space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <Target className="w-4 h-4 text-teal-600 dark:text-teal-400" /> Today's Target
              </span>
              <span className="text-[11px] text-teal-600 dark:text-teal-400 font-mono font-semibold">+50 XP</span>
            </div>

            <p className="text-xs text-muted-foreground">Solve 2 Array/String problems and complete 1 Voice scenario check.</p>

            <button
              onClick={() => setDailyGoalCompleted(!dailyGoalCompleted)}
              className={`w-full py-2 px-3 rounded-lg border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                dailyGoalCompleted
                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                  : "border-border bg-secondary hover:bg-secondary/80 text-foreground"
              }`}
            >
              <CheckCircle2 className="w-4 h-4" /> {dailyGoalCompleted ? "Target Completed!" : "Mark Target Completed"}
            </button>
          </div>

          {/* Skill Gap Diagnostic */}
          <div className="p-4 rounded-xl border border-border bg-card space-y-3.5">
            <div>
              <h3 className="text-xs font-bold text-foreground">Skill Gap Overview</h3>
              <p className="text-[11px] text-muted-foreground">Based on your practice history and submissions</p>
            </div>

            <div className="space-y-3">
              {skillGaps.map((item) => (
                <div key={item.skill} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-foreground font-medium">{item.skill}</span>
                    <span className="text-[11px] text-muted-foreground font-mono">{item.level}%</span>
                  </div>
                  <Progress
                    value={item.level}
                    className={`h-1.5 bg-secondary rounded-full ${
                      item.level < 60
                        ? "[&>div]:bg-rose-500"
                        : item.level < 80
                        ? "[&>div]:bg-amber-500"
                        : "[&>div]:bg-emerald-500"
                    }`}
                  />
                </div>
              ))}
            </div>

            <Link
              to="/placement-readiness"
              className="block text-center text-xs text-teal-600 dark:text-teal-400 font-semibold hover:underline pt-1"
            >
              Full Competency Diagnostic &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}