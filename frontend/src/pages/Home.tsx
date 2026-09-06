import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import DailyChallengePanel from "@/components/DailyChallengePanel";
import { SMART_RECOMMENDATIONS } from "@/data/recommendations";
import {
  Sparkles,
  ArrowRight,
  Code2,
  Calculator,
  MessageSquare,
  FileText,
  BarChart3,
  BrainCircuit,
  HelpCircle,
  CheckCircle2,
  Flame,
  Target,
  Trophy,
  TrendingUp,
  Clock,
  Zap,
  Check,
  ChevronRight,
  Compass,
  Layers,
  Activity,
} from "lucide-react";

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [activeRecommendation] = useState(SMART_RECOMMENDATIONS[0]);

  const performanceStats = {
    accuracy: 82,
    problemsSolved: 40,
    totalProblems: 4033,
    streakDays: 12,
    readinessScore: 78,
  };

  const quickLaunchModules = [
    {
      title: "Coding Practice",
      desc: "DSA algorithms, curated LeetCode pattern sets & full in-browser Monaco IDE with test runner.",
      route: "/practice",
      icon: Code2,
      stat: "40 Solved",
      tags: ["DSA & Algorithms", "Monaco IDE", "4033 Problems"],
      badgeBg: "bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/25",
      iconBg: "bg-purple-500/15 border-purple-500/30 text-purple-600 dark:text-purple-400",
      btnText: "Practice Code",
    },
    {
      title: "Aptitude Tests",
      desc: "Quantitative Aptitude, Logical Reasoning, DI graphs & Speed Formula shortcuts for campus recruitments.",
      route: "/aptitude",
      icon: Calculator,
      stat: "14 Topics",
      tags: ["Quantitative", "Logical Reasoning", "Speed Formulas"],
      badgeBg: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/25",
      iconBg: "bg-amber-500/15 border-amber-500/30 text-amber-600 dark:text-amber-400",
      btnText: "Take Aptitude Test",
    },
    {
      title: "Spoken & GD Communication",
      desc: "Live speech fluency analyzer, STAR behavioral interview builder & peer GD mock discussion rooms.",
      route: "/communication",
      icon: MessageSquare,
      stat: "Level 4 Active",
      tags: ["Speech Analyzer", "STAR Method", "Peer GD Rooms"],
      badgeBg: "bg-teal-500/10 text-teal-700 dark:text-teal-400 border-teal-500/25",
      iconBg: "bg-teal-500/15 border-teal-500/30 text-teal-600 dark:text-teal-400",
      btnText: "Launch Speech Lab",
    },
    {
      title: "Cognitive Brain Zone",
      desc: "Sudoku elimination, working memory match, 60s math blitz & pattern deduction logic exercises.",
      route: "/brain-zone",
      icon: BrainCircuit,
      stat: "7 Brain Games",
      tags: ["Sudoku 4x4", "Memory Match", "Pattern Logic"],
      badgeBg: "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/25",
      iconBg: "bg-rose-500/15 border-rose-500/30 text-rose-600 dark:text-rose-400",
      btnText: "Play Brain Games",
    },
  ];

  return (
    <div className="space-y-6 font-sans text-foreground">
      {/* =========================================================================
          SECTION 1: TOP ROW (3 Aligned Cards: Level Up | Placement Roadmap | Daily Challenge)
         ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 items-stretch">
        {/* 1. Level Up Hero Card */}
        <div className="p-6 rounded-2xl border border-purple-500/25 bg-gradient-to-br from-purple-500/10 via-card to-card dark:from-purple-950/40 dark:via-secondary dark:to-card shadow-sm relative overflow-hidden flex flex-col justify-between space-y-4 hover:border-purple-500/40 transition-all">
          <div className="absolute top-0 right-0 w-48 h-48 bg-purple-600/10 dark:bg-purple-600/15 rounded-full blur-3xl -z-0 pointer-events-none" />

          <div className="space-y-2.5 relative z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-700 dark:text-purple-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
              <span>Placement Season 2026</span>
            </div>

            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground font-display">
              Level up your skills.
            </h1>
            <p className="text-xs text-muted-foreground font-medium leading-relaxed">
              Crack campus recruitments with confidence. Master DSA, Aptitude, Voice Communication, and Technical Interviews.
            </p>
          </div>

          <div className="relative z-10 flex items-center flex-wrap gap-2.5 pt-1">
            <Link
              to="/practice"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white shadow-md transition-all pm-btn-gradient"
            >
              <span>Start Practicing</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              to="/aptitude"
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-border bg-card hover:bg-secondary text-xs font-semibold text-foreground transition-all shadow-sm"
            >
              <Calculator className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>Take Aptitude</span>
            </Link>
          </div>
        </div>

        {/* 2. Placement Roadmap Milestone Card */}
        <div className="p-6 rounded-2xl border border-border bg-card shadow-sm flex flex-col justify-between space-y-4 hover:border-purple-500/30 transition-all">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-600 dark:text-purple-400 text-xs">
                <Compass className="w-4 h-4" />
              </span>
              <div>
                <h3 className="text-xs font-bold text-foreground">Placement Roadmap</h3>
                <p className="text-[10px] text-muted-foreground">Milestone 2 of 7</p>
              </div>
            </div>
            <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              23 days left
            </span>
          </div>

          <div className="space-y-2 py-1">
            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
              Your Next Milestone
            </p>
            <div className="flex items-center gap-2 text-xs font-bold text-foreground">
              <span className="text-amber-500 dark:text-amber-400">⚡</span>
              <span>Aptitude Mock Test & Revision</span>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1.5 pt-1">
              <div className="h-2 w-full bg-secondary rounded-full overflow-hidden border border-border/50">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 via-purple-500 to-purple-600 rounded-full"
                  style={{ width: "40%" }}
                />
              </div>
              <div className="flex justify-between text-[11px] font-mono text-muted-foreground">
                <span>Milestone Progress</span>
                <span className="font-bold text-foreground">40%</span>
              </div>
            </div>
          </div>

          <Link
            to="/placement-readiness"
            className="w-full py-2.5 px-3 rounded-xl border border-purple-500/30 bg-purple-500/10 hover:bg-purple-500/20 text-purple-700 dark:text-purple-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm"
          >
            <span>Continue Roadmap</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 3. Daily Challenge Card */}
        <DailyChallengePanel variant="card" className="h-full" />
      </div>

      {/* =========================================================================
          SECTION 2: NEXT ROW (5 KPI / Performance Cards Aligned in One Row)
          Accuracy | Questions Solved | Streak | Readiness | Your Performance
         ========================================================================= */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* 1. Accuracy */}
        <div className="p-4 sm:p-5 rounded-2xl border border-border bg-card shadow-sm space-y-1.5 hover:border-teal-500/30 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-muted-foreground">Accuracy</p>
            <span className="w-2 h-2 rounded-full bg-teal-500" />
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-extrabold text-teal-600 dark:text-teal-400 font-mono tracking-tight">
              {performanceStats.accuracy}%
            </p>
            <p className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">+4%</span>
              <span>from last week</span>
            </p>
          </div>
        </div>

        {/* 2. Questions Solved */}
        <div className="p-4 sm:p-5 rounded-2xl border border-border bg-card shadow-sm space-y-1.5 hover:border-purple-500/30 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-muted-foreground">Questions Solved</p>
            <span className="w-2 h-2 rounded-full bg-purple-500" />
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-extrabold text-purple-600 dark:text-purple-400 font-mono tracking-tight">
              {performanceStats.problemsSolved}{" "}
              <span className="text-xs font-normal text-muted-foreground">/ {performanceStats.totalProblems}</span>
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">3 pending today</p>
          </div>
        </div>

        {/* 3. Streak */}
        <div className="p-4 sm:p-5 rounded-2xl border border-border bg-card shadow-sm space-y-1.5 hover:border-amber-500/30 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-muted-foreground">Current Streak</p>
            <span className="w-2 h-2 rounded-full bg-amber-500" />
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-extrabold text-amber-600 dark:text-amber-400 font-mono flex items-center gap-1.5 tracking-tight">
              <span>{performanceStats.streakDays}</span>
              <Flame className="w-5 h-5 fill-amber-500 text-amber-500 animate-pulse" />
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">Personal best: 14d</p>
          </div>
        </div>

        {/* 4. Readiness */}
        <div className="p-4 sm:p-5 rounded-2xl border border-border bg-card shadow-sm space-y-1.5 hover:border-emerald-500/30 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-muted-foreground">Readiness Index</p>
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono tracking-tight">
              {performanceStats.readinessScore}%
            </p>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
              Tier-1 Qualified
            </p>
          </div>
        </div>

        {/* 5. Your Performance KPI Card */}
        <DailyChallengePanel variant="kpi" className="h-full" />
      </div>

      {/* =========================================================================
          SECTION 3: SMART RECOMMENDATION (One Full-Width Card)
         ========================================================================= */}
      <div className="w-full p-6 sm:p-7 rounded-2xl border border-purple-500/25 bg-gradient-to-r from-purple-500/5 via-card to-card dark:from-purple-900/20 dark:via-secondary/40 dark:to-card shadow-sm space-y-4 relative overflow-hidden">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-purple-500/15 text-purple-700 dark:text-purple-300 border border-purple-500/30">
              Smart Recommendation
            </span>
            <span className="text-xs font-semibold text-muted-foreground">
              Based on your recent activity
            </span>
          </div>
          <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            {activeRecommendation.impactScore}
          </span>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-2 min-w-0 flex-1">
            <h3 className="text-base sm:text-lg font-bold text-foreground tracking-tight">
              {activeRecommendation.title}
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              {activeRecommendation.subtitle}
            </p>

            {/* WHY THIS? Explicit Justification Box */}
            <div className="p-3.5 rounded-xl bg-purple-500/10 dark:bg-purple-950/30 border border-purple-500/20 flex items-start gap-2.5 mt-2">
              <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-700 dark:text-purple-300 font-mono text-[10px] uppercase font-bold shrink-0 mt-0.5">
                WHY THIS?
              </span>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {activeRecommendation.whyThisReason}
              </p>
            </div>
          </div>

          <Link
            to={activeRecommendation.route}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs font-bold text-white pm-btn-gradient shrink-0 shadow-md self-start lg:self-center"
          >
            <span>Take Action</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* =========================================================================
          SECTION 4: PREPARATION MODULES (2 Large Blocks Per Row)
          Coding Practice | Aptitude Tests | Spoken & GD | Cognitive Brain Zone
         ========================================================================= */}
      <div className="space-y-4 pt-1">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-foreground tracking-tight">
              Preparation Modules
            </h3>
            <p className="text-xs text-muted-foreground">
              Comprehensive training suites for campus placement readiness
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>All systems active</span>
          </div>
        </div>

        {/* 2 Large Full Blocks Per Row Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {quickLaunchModules.map((mod) => (
            <Link
              key={mod.title}
              to={mod.route}
              className="p-6 rounded-2xl border border-border bg-card hover:border-purple-500/50 hover:shadow-md transition-all flex flex-col justify-between space-y-4 group shadow-sm"
            >
              {/* Top Row: Icon + Stat Badge */}
              <div className="flex items-center justify-between">
                <div
                  className={`w-12 h-12 rounded-2xl border flex items-center justify-center shadow-sm transition-transform group-hover:scale-105 ${mod.iconBg}`}
                >
                  <mod.icon className="w-6 h-6" />
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-mono font-bold border ${mod.badgeBg}`}
                >
                  {mod.stat}
                </span>
              </div>

              {/* Middle Content: Title + Description */}
              <div className="space-y-2 flex-1">
                <h4 className="text-base sm:text-lg font-bold text-foreground group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                  {mod.title}
                </h4>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {mod.desc}
                </p>

                {/* Feature Topic Pills */}
                <div className="flex items-center flex-wrap gap-1.5 pt-2">
                  {mod.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-0.5 rounded-lg text-[10px] font-semibold bg-secondary text-foreground/80 border border-border"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom CTA Row */}
              <div className="pt-3 border-t border-border flex items-center justify-between text-xs font-bold text-purple-600 dark:text-purple-400 group-hover:text-purple-700 dark:group-hover:text-purple-300">
                <span>{mod.btnText}</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}