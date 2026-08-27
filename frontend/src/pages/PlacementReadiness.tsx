import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  BarChart3,
  CheckCircle2,
  AlertTriangle,
  Code2,
  Calculator,
  MessageSquare,
  FileText,
  Sparkles,
  TrendingUp,
  Target,
  ArrowRight,
  Compass,
  Check,
  Zap,
  Award,
  Trophy,
  ChevronRight,
  ShieldCheck,
  Clock,
} from "lucide-react";

export default function PlacementReadiness() {
  const [readinessPercentage] = useState(78);

  const competencyBreakdown = [
    {
      category: "Coding & DSA Mastery",
      score: 88,
      status: "Tier-1 Ready",
      color: "text-purple-600 dark:text-purple-400",
      progressClass: "bg-purple-600 dark:bg-purple-500",
      details: "Solid mastery in Arrays, Two Pointers, Binary Search, and Tree traversals.",
      icon: Code2,
      route: "/practice",
    },
    {
      category: "Quantitative & Logical Aptitude",
      score: 74,
      status: "In Progress",
      color: "text-amber-600 dark:text-amber-400",
      progressClass: "bg-amber-500",
      details: "Strong in Time & Work; Data Interpretation and Probability need focused revision.",
      icon: Calculator,
      route: "/aptitude",
    },
    {
      category: "Spoken & GD Communication",
      score: 80,
      status: "Ready",
      color: "text-teal-600 dark:text-teal-400",
      progressClass: "bg-teal-500",
      details: "Good pacing and vocabulary; practice concluding structured STAR responses.",
      icon: MessageSquare,
      route: "/communication",
    },
    {
      category: "ATS Resume & Experience Quality",
      score: 84,
      status: "Strong",
      color: "text-emerald-600 dark:text-emerald-400",
      progressClass: "bg-emerald-500",
      details: "Clear quantified impact and high-frequency tech stack coverage.",
      icon: FileText,
      route: "/resume",
    },
    {
      category: "Core CS & Mock Interview Readiness",
      score: 72,
      status: "Focus Needed",
      color: "text-rose-600 dark:text-rose-400",
      progressClass: "bg-rose-500",
      details: "Revise Operating System page replacement & DBMS ACID transaction isolation levels.",
      icon: Target,
      route: "/quizee",
    },
  ];

  // 7-Stage Placement Roadmap Journey
  const ROADMAP_STAGES = [
    {
      stage: 1,
      title: "Foundation",
      subtitle: "CS Basics, Math & Core Logic",
      status: "completed",
      progress: 100,
      skills: ["Discrete Math", "OOP Basics", "Time Complexity O(n)"],
      recommendedAction: "Completed — Solid fundamental grounding verified.",
    },
    {
      stage: 2,
      title: "Coding Mastery",
      subtitle: "Data Structures & High-Yield Algorithms",
      status: "completed",
      progress: 100,
      skills: ["Arrays & Hash Maps", "Binary Trees", "Two Pointers", "Binary Search"],
      recommendedAction: "Completed — 40 core LeetCode pattern questions verified.",
    },
    {
      stage: 3,
      title: "Aptitude & DI",
      subtitle: "Quant, Logical Reasoning & Speed Formulas",
      status: "current",
      progress: 65,
      skills: ["Time & Work", "Percentages", "Data Interpretation", "Blood Relations"],
      recommendedAction: "Take 2 more DI mock tests to unlock Stage 4 Communication milestone.",
    },
    {
      stage: 4,
      title: "Communication & GD",
      subtitle: "Spoken Fluency, STAR Answers & Group Discussion",
      status: "upcoming",
      progress: 30,
      skills: ["Elevator Pitch", "STAR Method", "GD Room Etiquette", "Filler Word Control"],
      recommendedAction: "Complete 1 live Peer Group Discussion session.",
    },
    {
      stage: 5,
      title: "Resume & Portfolio",
      subtitle: "ATS Optimization & Project Architecture",
      status: "upcoming",
      progress: 0,
      skills: ["ATS Score > 85", "Quantified Bullet Points", "Tech Keyword Alignment"],
      recommendedAction: "Benchmark resume against target Tier-1 SDE job description.",
    },
    {
      stage: 6,
      title: "Interview Preparation",
      subtitle: "System Design, HR & Technical Deep Dives",
      status: "upcoming",
      progress: 0,
      skills: ["System Architecture", "Behavioral Alignment", "Live Whiteboard Simulation"],
      recommendedAction: "Simulate full mock interview drive with resume-tailored questions.",
    },
    {
      stage: 7,
      title: "Placement Ready",
      subtitle: "Tier-1 Campus Recruitment Drives",
      status: "final",
      progress: 0,
      skills: ["Amazon", "Google", "Microsoft", "TCS Digital", "Infosys DSE"],
      recommendedAction: "Final benchmark certification and company-specific mock tests.",
    },
  ];

  return (
    <div className="space-y-8 font-sans text-foreground">
      {/* =========================================================================
          1. OVERALL READINESS SCORE HERO CARD
         ========================================================================= */}
      <div className="p-6 sm:p-8 rounded-2xl border border-purple-500/25 bg-gradient-to-br from-purple-500/10 via-card to-card dark:from-purple-950/40 dark:via-secondary dark:to-card shadow-sm relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-700 dark:text-purple-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Tier-1 Campus Placement Benchmark</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground font-display">
            Candidate Placement Readiness: <span className="text-purple-600 dark:text-purple-400 font-mono">{readinessPercentage}%</span>
          </h1>

          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Based on your problem solving accuracy, aptitude scores, resume ATS rating, and speaking fluency, you qualify for screening thresholds in 85% of campus drives.
          </p>
        </div>

        {/* Circular Progress Gauge */}
        <div className="relative w-28 h-28 flex items-center justify-center shrink-0 mx-auto md:mx-0">
          <svg className="w-28 h-28 -rotate-90" viewBox="0 0 36 36">
            <path
              className="text-border"
              strokeWidth="3"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className="text-purple-600 dark:text-purple-500"
              strokeDasharray={`${readinessPercentage}, 100`}
              strokeWidth="3.5"
              strokeLinecap="round"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <div className="absolute text-center leading-none">
            <span className="text-xl font-bold font-mono text-foreground">{readinessPercentage}%</span>
            <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">Ready</p>
          </div>
        </div>
      </div>

      {/* =========================================================================
          2. 5-PILLAR COMPETENCY BREAKDOWN
         ========================================================================= */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-foreground">5-Pillar Competency Diagnostic</h3>
          <span className="text-xs text-muted-foreground font-mono">Weighted Algorithm</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {competencyBreakdown.map((comp) => (
            <Link
              key={comp.category}
              to={comp.route}
              className="p-4 rounded-xl border border-border bg-card hover:bg-secondary/60 transition-all space-y-3 shadow-sm block group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-secondary border border-border flex items-center justify-center text-purple-600 dark:text-purple-400">
                    <comp.icon className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-foreground group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                    {comp.category}
                  </span>
                </div>
                <span className={`text-xs font-mono font-bold ${comp.color}`}>{comp.score}%</span>
              </div>

              {/* Progress Bar */}
              <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${comp.progressClass}`} style={{ width: `${comp.score}%` }} />
              </div>

              <p className="text-[11px] text-muted-foreground leading-relaxed">{comp.details}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* =========================================================================
          3. 7-STAGE PLACEMENT ROADMAP JOURNEY (Interactive Timeline)
         ========================================================================= */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <Compass className="w-4 h-4 text-purple-600 dark:text-purple-400" /> 7-Stage Placement Roadmap Journey
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Structured step-by-step career path from CS fundamentals to final Tier-1 placement offer.
            </p>
          </div>
          <span className="px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-700 dark:text-purple-300 text-xs font-bold font-mono">
            Stage 3 of 7 Active
          </span>
        </div>

        <div className="space-y-3.5">
          {ROADMAP_STAGES.map((s) => {
            const isCompleted = s.status === "completed";
            const isCurrent = s.status === "current";

            return (
              <div
                key={s.stage}
                className={`p-5 rounded-2xl border transition-all space-y-3 shadow-sm ${
                  isCurrent
                    ? "border-purple-500 bg-purple-500/5 ring-1 ring-purple-500/30"
                    : isCompleted
                    ? "border-emerald-500/30 bg-card"
                    : "border-border bg-card opacity-80"
                }`}
              >
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold font-mono ${
                        isCompleted
                          ? "bg-emerald-500 text-white"
                          : isCurrent
                          ? "bg-purple-600 text-white animate-pulse"
                          : "bg-secondary text-muted-foreground border border-border"
                      }`}
                    >
                      {isCompleted ? <Check className="w-4 h-4" /> : s.stage}
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                        {s.title}
                        {isCurrent && (
                          <span className="px-2 py-0.2 rounded text-[10px] font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                            Current Focus
                          </span>
                        )}
                      </h4>
                      <p className="text-[11px] text-muted-foreground">{s.subtitle}</p>
                    </div>
                  </div>

                  <span className="text-xs font-mono font-bold text-muted-foreground">{s.progress}% Complete</span>
                </div>

                {/* Progress Bar */}
                <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      isCompleted ? "bg-emerald-500" : isCurrent ? "bg-purple-600" : "bg-muted"
                    }`}
                    style={{ width: `${s.progress}%` }}
                  />
                </div>

                {/* Skills Chips */}
                <div className="flex items-center gap-1.5 flex-wrap pt-1">
                  {s.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-secondary border border-border text-foreground"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                {/* Recommended Action Box */}
                <div className="p-2.5 rounded-xl bg-secondary/40 border border-border text-xs flex items-center justify-between">
                  <span className="text-muted-foreground">{s.recommendedAction}</span>
                  {isCurrent && (
                    <Link
                      to="/aptitude"
                      className="px-3 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-[11px] font-bold shrink-0 ml-2"
                    >
                      Action Now
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}