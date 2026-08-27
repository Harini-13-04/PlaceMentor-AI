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
      desc: "DSA algorithms, LeetCode curated sets & IDE workspace",
      route: "/practice",
      icon: Code2,
      stat: "40 Solved",
      color: "border-purple-500/30 text-purple-600 dark:text-purple-400",
    },
    {
      title: "Aptitude Tests",
      desc: "Quant, Logical Reasoning, DI & Speed Formulas",
      route: "/aptitude",
      icon: Calculator,
      stat: "14 Topics",
      color: "border-amber-500/30 text-amber-600 dark:text-amber-400",
    },
    {
      title: "Spoken & GD",
      desc: "Speech fluency analyzer & private peer GD rooms",
      route: "/communication",
      icon: MessageSquare,
      stat: "Level 4 Active",
      color: "border-teal-500/30 text-teal-600 dark:text-teal-400",
    },
    {
      title: "Cognitive Brain Zone",
      desc: "Sudoku, memory match, pattern logic & 60s blitz",
      route: "/brain-zone",
      icon: BrainCircuit,
      stat: "7 Brain Games",
      color: "border-rose-500/30 text-rose-600 dark:text-rose-400",
    },
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-6 font-sans text-foreground">
      {/* Central Command Dashboard Area */}
      <div className="flex-1 space-y-6 min-w-0">
        {/* =========================================================================
            1. TOP HERO SECTION & PLACEMENT ROADMAP (2-Card Hero Grid)
           ========================================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Main Hero Card (7 cols) */}
          <div className="md:col-span-7 p-6 rounded-2xl border border-purple-500/25 bg-gradient-to-br from-purple-500/10 via-card to-card dark:from-purple-950/40 dark:via-secondary dark:to-card shadow-sm relative overflow-hidden flex flex-col justify-between">
            {/* Background ambient glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 dark:bg-purple-600/15 rounded-full blur-3xl -z-0 pointer-events-none" />

            <div className="space-y-2.5 relative z-10">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-700 dark:text-purple-300 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Placement Season 2026</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground font-display">
                Level up your skills.
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground font-medium max-w-md leading-relaxed">
                Crack campus recruitments with confidence. Master DSA, Aptitude, Voice Communication, and Technical Interviews.
              </p>
            </div>

            <div className="pt-6 relative z-10 flex items-center flex-wrap gap-3">
              <Link
                to="/practice"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white shadow-md transition-all pm-btn-gradient"
              >
                <span>Start Practicing</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                to="/aptitude"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-border bg-card hover:bg-secondary text-xs font-semibold text-foreground transition-all"
              >
                <Calculator className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
                <span>Take Aptitude Test</span>
              </Link>
            </div>
          </div>

          {/* Placement Roadmap Milestone Card (5 cols) */}
          <div className="md:col-span-5 p-5 rounded-2xl border border-border bg-card shadow-sm flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-600 dark:text-purple-400 text-xs">
                  <Compass className="w-3.5 h-3.5" />
                </span>
                <h3 className="text-xs font-bold text-foreground">Placement Roadmap</h3>
              </div>
              <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">23 days left</span>
            </div>

            <div className="space-y-2">
              <p className="text-[11px] text-muted-foreground uppercase font-bold tracking-wider">Your next milestone</p>
              <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                <span className="text-amber-500 dark:text-amber-400">⚡</span>
                <span>Aptitude Mock Test</span>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1 pt-1">
                <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-amber-500 to-purple-600 rounded-full" style={{ width: "40%" }} />
                </div>
                <div className="flex justify-between text-[10px] font-mono text-muted-foreground">
                  <span>Milestone Progress</span>
                  <span className="font-bold text-foreground">40%</span>
                </div>
              </div>
            </div>

            <Link
              to="/placement-readiness"
              className="w-full py-2 px-3 rounded-xl border border-purple-500/30 bg-purple-500/10 hover:bg-purple-500/20 text-purple-700 dark:text-purple-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
            >
              <span>Continue Roadmap</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* =========================================================================
            2. PERFORMANCE SUMMARY (4-Stat Grid)
           ========================================================================= */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-4 rounded-xl border border-border bg-card shadow-sm space-y-1">
            <p className="text-[11px] font-semibold text-muted-foreground">Accuracy</p>
            <p className="text-xl sm:text-2xl font-extrabold text-teal-600 dark:text-teal-400 font-mono">
              {performanceStats.accuracy}%
            </p>
            <p className="text-[10px] text-muted-foreground">+4% from last week</p>
          </div>

          <div className="p-4 rounded-xl border border-border bg-card shadow-sm space-y-1">
            <p className="text-[11px] font-semibold text-muted-foreground">Questions Solved</p>
            <p className="text-xl sm:text-2xl font-extrabold text-purple-600 dark:text-purple-400 font-mono">
              {performanceStats.problemsSolved} <span className="text-xs font-normal text-muted-foreground">/ {performanceStats.totalProblems}</span>
            </p>
            <p className="text-[10px] text-muted-foreground">3 pending today</p>
          </div>

          <div className="p-4 rounded-xl border border-border bg-card shadow-sm space-y-1">
            <p className="text-[11px] font-semibold text-muted-foreground">Current Streak</p>
            <p className="text-xl sm:text-2xl font-extrabold text-amber-600 dark:text-amber-400 font-mono flex items-center gap-1">
              <span>{performanceStats.streakDays}</span>
              <Flame className="w-4 h-4 fill-amber-500 text-amber-500" />
            </p>
            <p className="text-[10px] text-muted-foreground">Personal best: 14d</p>
          </div>

          <div className="p-4 rounded-xl border border-border bg-card shadow-sm space-y-1">
            <p className="text-[11px] font-semibold text-muted-foreground">Readiness Index</p>
            <p className="text-xl sm:text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
              {performanceStats.readinessScore}%
            </p>
            <p className="text-[10px] text-muted-foreground">Tier-1 Qualified</p>
          </div>
        </div>

        {/* =========================================================================
            3. SMART RECOMMENDATION CARD (with "WHY THIS?" Explanations)
           ========================================================================= */}
        <div className="p-5 rounded-2xl border border-purple-500/25 bg-gradient-to-r from-purple-500/5 via-card to-card dark:from-purple-900/20 dark:via-secondary/40 dark:to-card shadow-sm space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-purple-500/15 text-purple-700 dark:text-purple-300 border border-purple-500/30">
                Smart Recommendation
              </span>
              <span className="text-xs font-semibold text-muted-foreground">Based on your activity</span>
            </div>
            <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold">{activeRecommendation.impactScore}</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1 min-w-0">
              <h3 className="text-sm sm:text-base font-bold text-foreground">
                {activeRecommendation.title}
              </h3>
              <p className="text-xs text-muted-foreground">
                {activeRecommendation.subtitle}
              </p>

              {/* WHY THIS? Explicit Justification */}
              <div className="pt-2 flex items-start gap-1.5 text-xs">
                <span className="px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-700 dark:text-purple-300 font-mono text-[10px] uppercase font-bold shrink-0">
                  WHY THIS?
                </span>
                <p className="text-[11px] text-muted-foreground">{activeRecommendation.whyThisReason}</p>
              </div>
            </div>

            <Link
              to={activeRecommendation.route}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white pm-btn-gradient shrink-0 shadow-md"
            >
              <span>Take Action</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* =========================================================================
            4. QUICK LAUNCH MODULES (Practice, Aptitude, Spoken/GD, Brain Zone)
           ========================================================================= */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-foreground">Preparation Modules</h3>
            <span className="text-xs text-muted-foreground">All systems active</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {quickLaunchModules.map((mod) => (
              <Link
                key={mod.title}
                to={mod.route}
                className="p-4 rounded-xl border border-border bg-card hover:bg-secondary/60 transition-all space-y-2.5 shadow-sm group block"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-secondary border border-border flex items-center justify-center text-purple-600 dark:text-purple-400">
                      <mod.icon className="w-4 h-4" />
                    </div>
                    <h4 className="text-xs sm:text-sm font-bold text-foreground group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                      {mod.title}
                    </h4>
                  </div>
                  <span className="text-[11px] font-mono font-semibold text-muted-foreground">{mod.stat}</span>
                </div>
                <p className="text-xs text-muted-foreground">{mod.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Right-Side Daily Challenge Panel */}
      <DailyChallengePanel />
    </div>
  );
}