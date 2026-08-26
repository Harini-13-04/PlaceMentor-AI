import React from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/context/AuthContext";
import {
  Sparkles,
  ArrowRight,
  Zap,
  ListChecks,
  CheckCircle2,
  Calendar,
  Flame,
  Target,
  Clock,
  BookOpen,
  Award,
} from "lucide-react";
import { Link } from "react-router-dom";

function getGreeting(hour: number = new Date().getHours()): string {
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
}

export default function Home() {
  const { user } = useAuth();
  const studentName = user?.name || user?.full_name || "Student";
  const greeting = getGreeting();

  const stats = {
    problemsSolved: 42,
    totalProblems: 142,
    currentStreak: 12,
    bestStreak: 18,
    todayTarget: 3,
    todayCompleted: 2,
    yesterdaySolved: 3,
  };

  return (
    <div className="space-y-6 font-sans text-foreground">
      {/* ── 1. Daily Briefing Card ── */}
      <div className="p-6 md:p-8 rounded-xl border border-border bg-card shadow-sm space-y-5">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-teal-600 dark:text-teal-400">
          <Sparkles className="w-4 h-4" />
          <span>Daily Briefing</span>
        </div>

        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground font-sans">
            {greeting}, {studentName}
          </h1>
          <p className="text-sm md:text-base text-muted-foreground mt-1 max-w-2xl leading-relaxed">
            You're making steady progress toward placement readiness. Today's focus is on <strong className="text-foreground font-semibold">Arrays & Hashing</strong> algorithms.
          </p>
        </div>

        {/* Yesterday & Today Mini Stat Strip */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 pt-4 border-t border-border text-xs">
          <div className="space-y-1">
            <span className="text-muted-foreground uppercase font-semibold text-[11px]">Yesterday's Activity</span>
            <div className="flex items-center gap-2 text-foreground font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>{stats.yesterdaySolved} Problems Solved & Verified</span>
            </div>
          </div>

          <div className="hidden sm:block w-px h-6 bg-border" />

          <div className="space-y-1">
            <span className="text-muted-foreground uppercase font-semibold text-[11px]">Today's Target</span>
            <div className="flex items-center gap-2 text-foreground font-medium">
              <Target className="w-4 h-4 text-teal-500" />
              <span>Solve 2 Array questions ({stats.todayCompleted}/{stats.todayTarget} completed)</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. Continue Practice CTA ── */}
      <div className="p-6 rounded-xl border border-border bg-card shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="space-y-2 flex-1">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <BookOpen className="w-4 h-4 text-teal-500" />
            <span>Active Module</span>
          </div>
          <h2 className="text-xl font-bold text-foreground">DSA & Technical Interview Practice</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Frequently asked questions from Amazon, Microsoft, TCS, Infosys, and Cognizant.
          </p>

          <div className="max-w-md pt-2 space-y-1.5">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Overall Progress</span>
              <span className="font-semibold text-foreground font-mono">
                {Math.round((stats.problemsSolved / stats.totalProblems) * 100)}%
              </span>
            </div>
            <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
              <div
                className="bg-teal-600 dark:bg-teal-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(stats.problemsSolved / stats.totalProblems) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <Link
          to="/practice"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold shadow-sm transition-all shrink-0"
        >
          <span>Open Practice</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* ── 3. Quick Metrics Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Metric 1 */}
        <div className="p-5 rounded-xl border border-border bg-card shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="font-semibold uppercase tracking-wider text-[11px]">Problems Solved</span>
            <ListChecks className="w-4 h-4 text-teal-500" />
          </div>
          <div className="text-2xl font-bold text-foreground font-mono">
            {stats.problemsSolved} <span className="text-xs text-muted-foreground font-sans font-normal">/ {stats.totalProblems}</span>
          </div>
          <p className="text-xs text-muted-foreground">Across Linear DSA, SQL, and Core CS</p>
        </div>

        {/* Metric 2 */}
        <div className="p-5 rounded-xl border border-border bg-card shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="font-semibold uppercase tracking-wider text-[11px]">Current Streak</span>
            <Flame className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-foreground font-mono flex items-center gap-1.5">
            {stats.currentStreak} <span className="text-xs text-muted-foreground font-sans font-normal">days</span>
          </div>
          <p className="text-xs text-muted-foreground">Best streak: {stats.bestStreak} days</p>
        </div>

        {/* Metric 3 */}
        <div className="p-5 rounded-xl border border-border bg-card shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="font-semibold uppercase tracking-wider text-[11px]">Today's Goal</span>
            <Target className="w-4 h-4 text-teal-500" />
          </div>
          <div className="text-2xl font-bold text-foreground font-mono">
            {stats.todayCompleted} <span className="text-xs text-muted-foreground font-sans font-normal">/ {stats.todayTarget} solved</span>
          </div>
          <p className="text-xs text-teal-600 dark:text-teal-400 font-medium">1 problem remaining today</p>
        </div>
      </div>
    </div>
  );
}