import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import StreakIndicator from "@/components/StreakIndicator";
import {
  Sparkles,
  ArrowRight,
  Coins,
  Zap,
  ListChecks,
  CheckCircle2,
  Bell,
  Flame,
  User as UserIcon,
} from "lucide-react";

/**
 * ── Data layer (backend-ready) ──────────────────────────────────────────
 * Plain types + serializable mock data. Swap the constants below for real
 * fetch/query results from your Spring Boot API — shapes map 1:1 onto
 * typical JSON responses.
 *
 * Streak data lives ONCE in this file (the STREAK constant below) and is
 * used by both <Home /> and <TopNav />. This is the single source of
 * truth — don't redefine streak data anywhere else.
 */

type User = {
  id: string;
  name: string;
  avatar: string;
  level: number;
};

type Streak = {
  currentStreak: number;
  weekActivity: boolean[]; // 7 entries, Mon → Sun
  milestone: number; // next milestone (days)
  bestStreak: number;
  lastActiveDate: string; // ISO date — used to check if today's streak is maintained
};

type ContinueLearning = {
  moduleId: string;
  moduleName: string;
  moduleArea: string;
  progressPercent: number;
  route: string;
};

type TodaysFocus = {
  objective: string;
  xpReward: number;
  coinReward: number;
  completed: boolean;
};

type QuickStats = {
  problemsSolved: number;
  xpEarned: number;
  coins: number;
  currentXP: number;
  nextLevelXP: number;
};

type YesterdayRecap = {
  problemsSolved: number;
  xpEarned: number;
};

type MentorMessage = {
  message: string;
  mood: "motivate" | "reminder" | "celebrate";
};

/** ── Mock data ──────────────────────────────────────────────────────── */

const USER: User = {
  id: "u_1001",
  name: "Harini",
  avatar: "",
  level: 12,
};

const STREAK: Streak = {
  currentStreak: 12,
  weekActivity: [true, true, true, true, false, false, false],
  milestone: 15,
  bestStreak: 21,
  lastActiveDate: "2026-06-29",
};

const CONTINUE_LEARNING: ContinueLearning = {
  moduleId: "mod_arrays_roadmap",
  moduleName: "Arrays Roadmap",
  moduleArea: "DSA Practice",
  progressPercent: 62,
  route: "/learn/arrays-roadmap",
};

const TODAYS_FOCUS: TodaysFocus = {
  objective: "Solve 2 Array Problems",
  xpReward: 50,
  coinReward: 10,
  completed: false,
};

const QUICK_STATS: QuickStats = {
  problemsSolved: 128,
  xpEarned: 3420,
  coins: 540,
  currentXP: 3420,
  nextLevelXP: 4000,
};

const YESTERDAY: YesterdayRecap = {
  problemsSolved: 3,
  xpEarned: 120,
};

const NOTIFICATION_COUNT = 3;

const DAY_LABELS = ["M", "T", "W", "T", "F", "S", "S"];

/** ── Helpers ────────────────────────────────────────────────────────── */

function isStreakMaintainedToday(streak: Streak): boolean {
  const today = new Date().toISOString().slice(0, 10);
  return streak.lastActiveDate === today;
}

function getGreeting(hour: number = new Date().getHours()): string {
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
}

/**
 * Short AI-style daily briefing for the hero card. Swap for a real model
 * call later — keep the return shape (a single short string) the same.
 */
function getDailyBriefing(focus: TodaysFocus, streak: Streak): string {
  const topic = focus.objective
    .replace(/^Solve \d+ /i, "")
    .replace(/ Problems?$/i, "");
  if (streak.currentStreak > 0) {
    return `You're making steady progress. Today's focus is ${topic}. One small win today is enough to stay ahead.`;
  }
  return `Fresh start today. Today's focus is ${topic} — let's build momentum.`;
}

/**
 * Mentor message reacts to state. Swap this stub for a real AI call later —
 * keep the return shape (MentorMessage) the same.
 */
function getMentorMessage(focus: TodaysFocus, streak: Streak): MentorMessage {
  if (focus.completed) {
    return {
      message: "You've completed today's mission — that's how streaks are built.",
      mood: "celebrate",
    };
  }
  if (streak.currentStreak > 0) {
    return {
      message: `${streak.currentStreak} days strong. Keep the rhythm going — you've got this.`,
      mood: "motivate",
    };
  }
  return {
    message: `Today's focus: ${focus.objective}. Let's get started.`,
    mood: "reminder",
  };
}

const user = USER;
const streak = STREAK;
const continueLearning = CONTINUE_LEARNING;
const focus = TODAYS_FOCUS;
const stats = QUICK_STATS;
const yesterday = YESTERDAY;

/**
 * ── TopNav ───────────────────────────────────────────────────────────────
 * Global navigation bar: 🔔 Notifications → 🔥 Streak → 👤 Profile.
 *
 * This lives in the same file only because Home.tsx is currently the one
 * file in this project — mount <TopNav /> once, above your route content,
 * not inside <Home />. It reads the same STREAK constant as <Home />, so
 * the numbers can never drift apart.
 */




export default function Home() {
  const greeting = getGreeting();
  const briefing = getDailyBriefing(focus, streak);
  const mentor = getMentorMessage(focus, streak);

  return (
    <div className="space-y-6">

      {/* ── 1. Daily Brief (hero) ── */}
      <div className="relative">
        {/* ambient glow sitting behind the card — no visible border, just light */}
        <div className="absolute -inset-6 -z-10 bg-gradient-to-br from-violet-500/25 via-primary/15 to-blue-500/20 blur-3xl rounded-[2rem]" />

        <Card
          className="relative rounded-3xl border-0 p-7 md:p-9 backdrop-blur-2xl bg-white/[0.04] shadow-[0_8px_60px_rgba(139,92,246,0.22),0_0_0_1px_rgba(255,255,255,0.05)] hover:shadow-[0_8px_70px_rgba(139,92,246,0.3),0_0_0_1px_rgba(255,255,255,0.07)] hover:-translate-y-0.5 transition-all duration-500"
        >
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">🪄</span>
            <p className="text-xs font-medium text-primary uppercase tracking-wider">
              Daily Brief
            </p>
          </div>

          <p className="text-2xl md:text-3xl font-display font-semibold text-white mb-3">
            {greeting}, {user.name} 👋
          </p>

          <p className="text-base text-muted-foreground leading-relaxed max-w-2xl mb-6">
            {briefing}
          </p>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 pt-5 border-t border-white/[0.06]">
            <div className="space-y-1.5">
              <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">
                Yesterday
              </p>
              <div className="flex items-center gap-4">
                <span className="inline-flex items-center gap-1.5 text-sm text-white/90">
                  <CheckCircle2 className="w-3.5 h-3.5 text-success" />
                  {yesterday.problemsSolved} Problems Solved
                </span>
                <span className="inline-flex items-center gap-1.5 text-sm text-white/90">
                  <CheckCircle2 className="w-3.5 h-3.5 text-success" />
                  +{yesterday.xpEarned} XP Earned
                </span>
              </div>
            </div>

            <div className="hidden sm:block w-px h-8 bg-white/[0.08]" />

            <div className="space-y-1.5">
              <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">
                Today's Focus
              </p>
              <p className="text-sm text-white/90">
                🎯 {focus.objective}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* ── 2. AI Mentor Message ── */}
      <Card className="glass-card p-5 border-primary/20 hover:border-primary/40 transition-all duration-300">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <p className="text-base text-white leading-relaxed">
            {mentor.message}
          </p>
        </div>
      </Card>

      {/* ── 3. Continue Learning ── */}
      <Card className="glass-card float-card p-6 md:p-8 border-primary/30 hover:border-primary/50 transition-all duration-300 shadow-[0_0_45px_rgba(139,92,246,0.3)]">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-3 flex-1">
            <p className="text-sm font-medium text-muted-foreground">
              Continue Learning
            </p>
            <div>
              <p className="text-2xl font-display font-bold text-white">
                {continueLearning.moduleName}
              </p>
              <p className="text-sm text-muted-foreground">
                {continueLearning.moduleArea}
              </p>
            </div>
            <div className="max-w-sm space-y-1.5">
              <Progress
                value={continueLearning.progressPercent}
                className="h-2 bg-white/5 [&>div]:bg-primary"
              />
              <p className="text-xs text-muted-foreground">
                {continueLearning.progressPercent}% complete
              </p>
            </div>
          </div>

          <a
            href={continueLearning.route}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors shrink-0"
          >
            Continue
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </Card>

      {/* ── 4. Today's Focus & 5. Quick Progress ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Today's Focus */}
        <Card className="glass-card p-6 border-white/5 hover:border-success/30 transition-colors lg:col-span-1">
          <div className="flex items-start justify-between mb-4">
            <p className="text-sm font-medium text-muted-foreground">
              🎯 Today's Focus
            </p>
            <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
              <ListChecks className="w-5 h-5 text-success" />
            </div>
          </div>
          <p
            className={`text-xl font-display font-semibold ${
              focus.completed ? "text-muted-foreground line-through" : "text-white"
            }`}
          >
            {focus.objective}
          </p>
          <div className="flex gap-2 mt-4">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-success/10 text-success text-xs font-medium">
              <Zap className="w-3 h-3" /> +{focus.xpReward} XP
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-yellow-500/10 text-yellow-500 text-xs font-medium">
              <Coins className="w-3 h-3" /> +{focus.coinReward}
            </span>
          </div>
        </Card>

        {/* Quick Progress */}
        <div className="grid grid-cols-3 gap-4 lg:col-span-2">
          <Card className="glass-card p-5 border-white/5 hover:border-primary/30 transition-colors flex flex-col items-center justify-center text-center gap-2">
            <ListChecks className="w-5 h-5 text-primary" />
            <p className="text-2xl font-display font-bold text-white">
              {stats.problemsSolved}
            </p>
            <p className="text-xs text-muted-foreground">Problems Solved</p>
          </Card>

          <Card className="glass-card p-5 border-white/5 hover:border-success/30 transition-colors flex flex-col items-center justify-center text-center gap-2">
            <Zap className="w-5 h-5 text-success" />
            <p className="text-2xl font-display font-bold text-white">
              {stats.xpEarned.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground">XP Earned</p>
          </Card>

          <Card className="glass-card p-5 border-white/5 hover:border-yellow-500/30 transition-colors flex flex-col items-center justify-center text-center gap-2">
            <Coins className="w-5 h-5 text-yellow-500" />
            <p className="text-2xl font-display font-bold text-white">
              {stats.coins}
            </p>
            <p className="text-xs text-muted-foreground">Coins</p>
          </Card>
        </div>

      </div>

    </div>
  );
}