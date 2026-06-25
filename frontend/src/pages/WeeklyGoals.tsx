import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Flame,
  Target,
  Code2,
  FileText,
  MessageSquare,
  Mic,
  Brain,
  Users,
  CheckCircle2,
  Circle,
  Clock,
  Zap,
  ChevronRight,
  Calendar,
  Sparkles,
  Crown,
  Rocket,
  Quote,
  Medal,
  Timer,
} from "lucide-react";

/* ============================================================================
   WeeklyGoals.tsx
   Premium Gamified Weekly Goals Dashboard — PlaceMentor AI
   Single-file React + TypeScript + TailwindCSS component.

   Cleanup pass: trimmed to the six sections that are unique to this page
   (Hero, Today's Goals, Habit Tracker, Weekly Challenge, AI Coach, Daily
   Motivation). Removed everything that duplicated stats already shown
   elsewhere (leaderboard, badges, analytics, reminders, extra XP/streak
   cards) so the page stays compact, spacious, and free of filler.
============================================================================ */

/* ============================================================================
   1. TYPES
============================================================================ */

type HabitCategory =
  | "coding"
  | "resume"
  | "communication"
  | "mockInterview"
  | "aptitude"
  | "behavioral";

type HabitStatus = "completed" | "missed" | "pending" | "future";

type DayKey = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";

interface DayRecord {
  day: DayKey;
  dateLabel: string;
  isToday: boolean;
  isFuture: boolean;
  habits: Record<HabitCategory, HabitStatus>;
}

type Difficulty = "Easy" | "Medium" | "Hard";
type Priority = "Low" | "Medium" | "High";
type AccentColor = "purple" | "cyan" | "emerald" | "orange";

interface GoalCardData {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  current: number;
  target: number;
  unit: string;
  rewardXP: number;
  difficulty: Difficulty;
  timeRequired: string;
  priority: Priority;
  accent: AccentColor;
}

interface RecommendationData {
  id: string;
  title: string;
  detail: string;
  icon: React.ElementType;
  accent: AccentColor;
  tag: string;
}

interface XPPopup {
  id: number;
  amount: number;
  x: number;
  y: number;
}

interface ConfettiPiece {
  id: number;
  left: number;
  delay: number;
  duration: number;
  color: string;
  rotate: number;
}

/* ============================================================================
   2. DUMMY DATA
============================================================================ */

const HABIT_META: Record<
  HabitCategory,
  { label: string; icon: React.ElementType; accent: AccentColor }
> = {
  coding: { label: "Coding", icon: Code2, accent: "purple" },
  resume: { label: "Resume", icon: FileText, accent: "cyan" },
  communication: { label: "Communication", icon: MessageSquare, accent: "emerald" },
  mockInterview: { label: "Mock Interview", icon: Mic, accent: "orange" },
  aptitude: { label: "Aptitude", icon: Brain, accent: "purple" },
  behavioral: { label: "Behavioral", icon: Users, accent: "cyan" },
};

const HABIT_ORDER: HabitCategory[] = [
  "coding",
  "resume",
  "communication",
  "mockInterview",
  "aptitude",
  "behavioral",
];

function buildWeek(): DayRecord[] {
  const days: { key: DayKey; date: string }[] = [
    { key: "Mon", date: "Jun 22" },
    { key: "Tue", date: "Jun 23" },
    { key: "Wed", date: "Jun 24" },
    { key: "Thu", date: "Jun 25" },
    { key: "Fri", date: "Jun 26" },
    { key: "Sat", date: "Jun 27" },
    { key: "Sun", date: "Jun 28" },
  ];

  // Index 4 (Fri) is "today" for this dummy data set.
  const todayIndex = 4;

  const patterns: Record<HabitCategory, HabitStatus[]> = {
    coding: ["completed", "completed", "completed", "missed", "pending", "future", "future"],
    resume: ["completed", "missed", "completed", "completed", "pending", "future", "future"],
    communication: ["completed", "completed", "missed", "completed", "pending", "future", "future"],
    mockInterview: ["missed", "completed", "missed", "missed", "pending", "future", "future"],
    aptitude: ["completed", "completed", "completed", "completed", "pending", "future", "future"],
    behavioral: ["completed", "missed", "completed", "missed", "pending", "future", "future"],
  };

  return days.map((d, i) => {
    const habits = {} as Record<HabitCategory, HabitStatus>;
    HABIT_ORDER.forEach((h) => {
      habits[h] = patterns[h][i];
    });
    return {
      day: d.key,
      dateLabel: d.date,
      isToday: i === todayIndex,
      isFuture: i > todayIndex,
      habits,
    };
  });
}

const WEEK_DATA: DayRecord[] = buildWeek();

const GOALS_DATA: GoalCardData[] = [
  {
    id: "leetcode",
    title: "LeetCode Challenge",
    description: "Sharpen your DSA skills with daily problem solving.",
    icon: Code2,
    current: 6,
    target: 10,
    unit: "problems",
    rewardXP: 200,
    difficulty: "Medium",
    timeRequired: "2 hrs",
    priority: "High",
    accent: "purple",
  },
  {
    id: "resume",
    title: "Resume Optimization",
    description: "Improve your ATS score and recruiter readability.",
    icon: FileText,
    current: 80,
    target: 100,
    unit: "%",
    rewardXP: 150,
    difficulty: "Easy",
    timeRequired: "45 min",
    priority: "Medium",
    accent: "cyan",
  },
  {
    id: "mock",
    title: "Mock Interview",
    description: "Simulate real interview conditions with AI feedback.",
    icon: Mic,
    current: 1,
    target: 2,
    unit: "sessions",
    rewardXP: 180,
    difficulty: "Hard",
    timeRequired: "1.5 hrs",
    priority: "High",
    accent: "orange",
  },
  {
    id: "communication",
    title: "Communication Practice",
    description: "Build fluency and confidence in spoken English.",
    icon: MessageSquare,
    current: 5,
    target: 7,
    unit: "sessions",
    rewardXP: 120,
    difficulty: "Easy",
    timeRequired: "30 min",
    priority: "Medium",
    accent: "emerald",
  },
  {
    id: "behavioral",
    title: "Behavioral Questions",
    description: "Master the STAR method for behavioral rounds.",
    icon: Users,
    current: 8,
    target: 10,
    unit: "questions",
    rewardXP: 100,
    difficulty: "Medium",
    timeRequired: "1 hr",
    priority: "Low",
    accent: "purple",
  },
];

const RECOMMENDATIONS_DATA: RecommendationData[] = [
  {
    id: "a1",
    title: "Practice Dynamic Programming",
    detail: "Recent submissions show gaps in DP patterns. 5 curated problems suggested.",
    icon: Code2,
    accent: "purple",
    tag: "Skill Gap",
  },
  {
    id: "a2",
    title: "ATS Score Can Improve",
    detail: "Adding measurable impact to your project bullets could raise your score by ~12%.",
    icon: FileText,
    accent: "cyan",
    tag: "Resume",
  },
  {
    id: "a3",
    title: "Communication Score Rising",
    detail: "Up 18% this month. Keep practicing daily to lock in fluency gains.",
    icon: MessageSquare,
    accent: "emerald",
    tag: "Progress",
  },
  {
    id: "a4",
    title: "Focus on System Design",
    detail: "Your backend fundamentals are strong. System design is the next placement-ready skill.",
    icon: Brain,
    accent: "orange",
    tag: "Next Step",
  },
];

const MOTIVATION_QUOTES: string[] = [
  "Small improvements every day create successful placements.",
  "Discipline beats motivation when motivation runs out.",
  "Every problem you solve today is an interview you win tomorrow.",
  "Consistency is the quiet force behind every offer letter.",
  "Your future recruiter is impressed by the version of you that shows up daily.",
  "Progress isn't always loud. Sometimes it's just one more solved problem.",
];

/* ============================================================================
   3. THEME HELPERS
============================================================================ */

const ACCENT: Record<
  AccentColor,
  {
    text: string;
    bg: string;
    border: string;
    ring: string;
    gradient: string;
    glow: string;
    bar: string;
  }
> = {
  purple: {
    text: "text-purple-300",
    bg: "bg-purple-500/15",
    border: "border-purple-400/30",
    ring: "ring-purple-400/40",
    gradient: "from-purple-500 to-fuchsia-500",
    glow: "shadow-[0_0_30px_-5px_rgba(168,85,247,0.55)]",
    bar: "bg-gradient-to-r from-purple-500 to-fuchsia-400",
  },
  cyan: {
    text: "text-cyan-300",
    bg: "bg-cyan-500/15",
    border: "border-cyan-400/30",
    ring: "ring-cyan-400/40",
    gradient: "from-cyan-400 to-sky-500",
    glow: "shadow-[0_0_30px_-5px_rgba(34,211,238,0.55)]",
    bar: "bg-gradient-to-r from-cyan-400 to-sky-400",
  },
  emerald: {
    text: "text-emerald-300",
    bg: "bg-emerald-500/15",
    border: "border-emerald-400/30",
    ring: "ring-emerald-400/40",
    gradient: "from-emerald-400 to-teal-500",
    glow: "shadow-[0_0_30px_-5px_rgba(52,211,153,0.55)]",
    bar: "bg-gradient-to-r from-emerald-400 to-teal-400",
  },
  orange: {
    text: "text-orange-300",
    bg: "bg-orange-500/15",
    border: "border-orange-400/30",
    ring: "ring-orange-400/40",
    gradient: "from-orange-400 to-amber-500",
    glow: "shadow-[0_0_30px_-5px_rgba(251,146,60,0.55)]",
    bar: "bg-gradient-to-r from-orange-400 to-amber-400",
  },
};

function clampPct(value: number, max: number): number {
  if (max <= 0) return 0;
  return Math.max(0, Math.min(100, Math.round((value / max) * 100)));
}

/* ============================================================================
   4. LOCAL STYLE SHEET
   A few custom keyframes Tailwind's default config doesn't ship with.
============================================================================ */

function LocalStyles() {
  return (
    <style>{`
      @keyframes pm-float-up {
        0% { transform: translate(-50%, 0) scale(0.8); opacity: 0; }
        15% { opacity: 1; transform: translate(-50%, -10px) scale(1.05); }
        80% { opacity: 1; }
        100% { transform: translate(-50%, -90px) scale(1); opacity: 0; }
      }
      @keyframes pm-confetti-fall {
        0% { transform: translateY(-20px) rotate(0deg); opacity: 1; }
        100% { transform: translateY(220px) rotate(540deg); opacity: 0; }
      }
      @keyframes pm-shimmer {
        0% { background-position: -200% 0; }
        100% { background-position: 200% 0; }
      }
      @keyframes pm-flame-flicker {
        0%, 100% { transform: scale(1) rotate(-2deg); }
        50% { transform: scale(1.08) rotate(2deg); }
      }
      .pm-xp-popup { animation: pm-float-up 1.4s ease-out forwards; }
      .pm-confetti-piece { animation: pm-confetti-fall ease-in forwards; }
      .pm-shimmer-text {
        background-image: linear-gradient(90deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,1) 50%, rgba(255,255,255,0.4) 100%);
        background-size: 200% auto;
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
        animation: pm-shimmer 3.5s linear infinite;
      }
      .pm-flame { animation: pm-flame-flicker 1.6s ease-in-out infinite; transform-origin: bottom center; }
    `}</style>
  );
}

/* ============================================================================
   5. PRIMITIVE / SHARED COMPONENTS
============================================================================ */

function GlassPanel({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={
        "relative rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl shadow-lg shadow-black/20 " +
        className
      }
    >
      {children}
    </div>
  );
}

function SectionHeading({
  icon: Icon,
  title,
  subtitle,
  accent = "purple",
  action,
}: {
  icon: React.ElementType;
  title: string;
  subtitle?: string;
  accent?: AccentColor;
  action?: React.ReactNode;
}) {
  const a = ACCENT[accent];
  return (
    <div className="flex items-start justify-between gap-4 mb-6">
      <div className="flex items-center gap-3">
        <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${a.bg} ${a.border} border`}>
          <Icon className={`h-5 w-5 ${a.text}`} />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-white tracking-tight">{title}</h2>
          {subtitle && <p className="text-sm text-slate-400 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {action}
    </div>
  );
}

interface ProgressRingProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  accent?: AccentColor;
  label?: string;
  sublabel?: string;
  animate?: boolean;
}

function ProgressRing({
  percentage,
  size = 140,
  strokeWidth = 12,
  accent = "purple",
  label,
  sublabel,
  animate = true,
}: ProgressRingProps) {
  const [displayPct, setDisplayPct] = useState(animate ? 0 : percentage);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const gradientId = useRef(`pm-ring-grad-${accent}-${Math.round(Math.random() * 100000)}`).current;

  useEffect(() => {
    if (!animate) {
      setDisplayPct(percentage);
      return;
    }
    const timeout = setTimeout(() => setDisplayPct(percentage), 80);
    return () => clearTimeout(timeout);
  }, [percentage, animate]);

  const offset = circumference - (displayPct / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" className={`[stop-color:theme(colors.${accent}.400)]`} />
            <stop offset="100%" className={`[stop-color:theme(colors.${accent}.600)]`} />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-[stroke-dashoffset] duration-[1200ms] ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {label && <span className="text-2xl font-bold text-white tabular-nums">{label}</span>}
        {sublabel && <span className="text-[11px] uppercase tracking-wide text-slate-400 mt-1">{sublabel}</span>}
      </div>
    </div>
  );
}

function AnimatedCounter({ value, duration = 900 }: { value: number; duration?: number }) {
  const [display, setDisplay] = useState(0);
  const frameRef = useRef<number | null>(null);
  const fromRef = useRef(0);

  useEffect(() => {
    const start = performance.now();
    const from = fromRef.current;
    const to = value;

    function tick(now: number) {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      const next = Math.round(from + (to - from) * eased);
      setDisplay(next);
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(tick);
      } else {
        fromRef.current = to;
      }
    }

    frameRef.current = requestAnimationFrame(tick);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return <span className="tabular-nums">{display.toLocaleString()}</span>;
}

function DifficultyTag({ difficulty }: { difficulty: Difficulty }) {
  const styles: Record<Difficulty, string> = {
    Easy: "text-emerald-300 bg-emerald-500/15 border-emerald-400/30",
    Medium: "text-orange-300 bg-orange-500/15 border-orange-400/30",
    Hard: "text-rose-300 bg-rose-500/15 border-rose-400/30",
  };
  return (
    <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${styles[difficulty]}`}>
      {difficulty}
    </span>
  );
}

function PriorityTag({ priority }: { priority: Priority }) {
  const styles: Record<Priority, string> = {
    Low: "text-slate-300 bg-slate-500/15 border-slate-400/30",
    Medium: "text-cyan-300 bg-cyan-500/15 border-cyan-400/30",
    High: "text-fuchsia-300 bg-fuchsia-500/15 border-fuchsia-400/30",
  };
  return (
    <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${styles[priority]}`}>
      {priority} priority
    </span>
  );
}

/* ============================================================================
   6. XP POPUP + CONFETTI OVERLAYS
============================================================================ */

function XPPopupLayer({ popups }: { popups: XPPopup[] }) {
  return (
    <div className="pointer-events-none fixed inset-0 z-[60]">
      {popups.map((p) => (
        <div key={p.id} className="pm-xp-popup absolute -translate-x-1/2 select-none" style={{ left: p.x, top: p.y }}>
          <span className="flex items-center gap-1 rounded-full border border-orange-400/40 bg-orange-500/20 px-3 py-1 text-sm font-bold text-orange-200 shadow-lg shadow-orange-500/20 backdrop-blur">
            <Zap className="h-3.5 w-3.5" /> +{p.amount} XP
          </span>
        </div>
      ))}
    </div>
  );
}

function ConfettiLayer({ pieces }: { pieces: ConfettiPiece[] }) {
  if (pieces.length === 0) return null;
  return (
    <div className="pointer-events-none fixed inset-0 z-[55] overflow-hidden">
      {pieces.map((c) => (
        <span
          key={c.id}
          className="pm-confetti-piece absolute top-0 block h-2 w-2 rounded-sm"
          style={{
            left: `${c.left}%`,
            backgroundColor: c.color,
            animationDuration: `${c.duration}ms`,
            animationDelay: `${c.delay}ms`,
            transform: `rotate(${c.rotate}deg)`,
          }}
        />
      ))}
    </div>
  );
}

/* ============================================================================
   7. HERO SECTION
   Weekly progress ring, weekly XP, current level, current streak, mission.
============================================================================ */

interface WeeklyHeroProps {
  weeklyXP: number;
  weeklyXPTarget: number;
  level: number;
  remainingXP: number;
  currentStreak: number;
  mission: string;
}

function WeeklyHero({ weeklyXP, weeklyXPTarget, level, remainingXP, currentStreak, mission }: WeeklyHeroProps) {
  const pct = clampPct(weeklyXP, weeklyXPTarget);

  return (
    <GlassPanel className="overflow-hidden p-7 sm:p-10">
      <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-purple-600/20 blur-3xl" />
      <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-cyan-500/15 blur-3xl" />

      <div className="relative flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
          <div className="relative">
            <ProgressRing percentage={pct} size={150} strokeWidth={13} accent="purple" label={`${pct}%`} sublabel="This week" />
            <div className="absolute -bottom-1 -right-1 flex items-center gap-1 rounded-full border border-purple-400/40 bg-slate-900/90 px-2.5 py-1 shadow-lg">
              <Crown className="h-3.5 w-3.5 text-purple-300" />
              <span className="text-xs font-semibold text-white">Lv. {level}</span>
            </div>
          </div>

          <div>
            <p className="text-xs uppercase tracking-widest text-purple-300/80 font-medium">Weekly Goals</p>
            <h1 className="mt-1.5 text-2xl sm:text-3xl font-bold text-white pm-shimmer-text">
              Keep the momentum going
            </h1>
            <p className="mt-2.5 max-w-md text-sm text-slate-400">
              You're <span className="text-white font-semibold">{remainingXP} XP</span> away from Level{" "}
              {level + 1}. Stay consistent to keep your streak alive.
            </p>

            <div className="mt-5 flex items-center gap-2 rounded-2xl border border-orange-400/30 bg-orange-500/10 px-4 py-2.5">
              <Flame className="pm-flame h-5 w-5 text-orange-400" />
              <div className="leading-tight">
                <p className="text-sm font-bold text-white">{currentStreak}-day streak</p>
                <p className="text-[10px] text-orange-300/80 uppercase tracking-wide">Keep it going</p>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full max-w-sm lg:w-80">
          <GlassPanel className="border-purple-400/20 bg-purple-500/[0.06] p-5">
            <div className="flex items-center gap-2 text-purple-300">
              <Rocket className="h-4 w-4" />
              <p className="text-xs font-semibold uppercase tracking-wide">Current mission</p>
            </div>
            <p className="mt-2.5 text-sm font-medium text-white leading-snug">{mission}</p>
            <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
              <span>
                <AnimatedCounter value={weeklyXP} /> / {weeklyXPTarget} XP
              </span>
              <span className="text-purple-300 font-semibold">{pct}%</span>
            </div>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-purple-500 to-fuchsia-400 transition-[width] duration-1000 ease-out"
                style={{ width: `${pct}%` }}
              />
            </div>
          </GlassPanel>
        </div>
      </div>
    </GlassPanel>
  );
}

/* ============================================================================
   8. DAILY HABIT TRACKER (GitHub contribution style)
============================================================================ */

function statusStyle(status: HabitStatus, accent: AccentColor) {
  const a = ACCENT[accent];
  if (status === "completed") return `${a.bar} border-transparent`;
  if (status === "missed") return "bg-rose-500/20 border border-rose-500/30";
  if (status === "pending") return "bg-white/5 border border-dashed border-white/20";
  return "bg-white/[0.03] border border-white/5";
}

function HabitTracker({ week }: { week: DayRecord[] }) {
  const [hovered, setHovered] = useState<string | null>(null);

  const perfectWeek = week
    .filter((d) => !d.isFuture)
    .every((d) => HABIT_ORDER.every((h) => d.habits[h] !== "missed"));

  return (
    <GlassPanel className="p-7 sm:p-8">
      <SectionHeading
        icon={Calendar}
        title="Habit Tracker"
        subtitle="Your weekly contribution grid across every skill area"
        accent="cyan"
        action={
          perfectWeek ? (
            <span className="flex items-center gap-1.5 rounded-full border border-emerald-400/40 bg-emerald-500/15 px-3 py-1.5 text-xs font-semibold text-emerald-300">
              <Sparkles className="h-3.5 w-3.5" /> Perfect Week
            </span>
          ) : null
        }
      />

      <div className="overflow-x-auto">
        <div className="min-w-[640px]">
          <div className="grid grid-cols-[120px_repeat(7,1fr)] gap-2.5">
            <div />
            {week.map((d) => (
              <div key={d.day} className={`text-center text-xs font-medium pb-1 ${d.isToday ? "text-cyan-300" : "text-slate-400"}`}>
                <p>{d.day}</p>
                <p className="text-[10px] text-slate-500">{d.dateLabel}</p>
              </div>
            ))}

            {HABIT_ORDER.map((habit) => {
              const meta = HABIT_META[habit];
              const Icon = meta.icon;
              return (
                <React.Fragment key={habit}>
                  <div className="flex items-center gap-2 py-1.5 text-xs font-medium text-slate-300">
                    <Icon className={`h-3.5 w-3.5 ${ACCENT[meta.accent].text}`} />
                    {meta.label}
                  </div>
                  {week.map((d) => {
                    const status = d.habits[habit];
                    const cellId = `${habit}-${d.day}`;
                    return (
                      <div key={cellId} className="flex items-center justify-center py-1">
                        <button
                          type="button"
                          onMouseEnter={() => setHovered(cellId)}
                          onMouseLeave={() => setHovered(null)}
                          className={`group relative h-7 w-7 rounded-md transition-all duration-200 hover:scale-125 hover:z-10 ${statusStyle(
                            status,
                            meta.accent
                          )} ${d.isToday ? "ring-2 ring-offset-2 ring-offset-slate-900 " + ACCENT[meta.accent].ring : ""}`}
                        >
                          {status === "completed" && (
                            <span className={`absolute inset-0 rounded-md opacity-0 group-hover:opacity-60 blur-md transition-opacity ${ACCENT[meta.accent].bar}`} />
                          )}
                          {hovered === cellId && (
                            <span className="absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg border border-white/10 bg-slate-900 px-2 py-1 text-[10px] font-medium text-white shadow-xl z-20">
                              {meta.label} · {d.day} · {status}
                            </span>
                          )}
                        </button>
                      </div>
                    );
                  })}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-slate-400">
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-sm bg-gradient-to-r from-purple-500 to-fuchsia-400" /> Completed
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-sm bg-rose-500/30 border border-rose-500/40" /> Missed
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-sm border border-dashed border-white/30" /> Pending
        </span>
      </div>
    </GlassPanel>
  );
}

/* ============================================================================
   9. GOAL CARDS — Today's Weekly Goals
============================================================================ */

function GoalCard({
  goal,
  onComplete,
}: {
  goal: GoalCardData;
  onComplete: (goal: GoalCardData, el: HTMLElement) => void;
}) {
  const Icon = goal.icon;
  const a = ACCENT[goal.accent];
  const pct = clampPct(goal.current, goal.target);
  const isComplete = goal.current >= goal.target;

  return (
    <div
      className={`group relative overflow-hidden rounded-3xl border ${a.border} bg-white/[0.04] p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:bg-white/[0.06] ${a.glow}`}
    >
      <div className={`pointer-events-none absolute -top-10 -right-10 h-32 w-32 rounded-full bg-gradient-to-br ${a.gradient} opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-20`} />

      <div className="flex items-start justify-between">
        <div className={`flex h-11 w-11 items-center justify-center rounded-2xl border ${a.border} ${a.bg}`}>
          <Icon className={`h-5 w-5 ${a.text}`} />
        </div>
        <span className={`flex items-center gap-1 rounded-full border ${a.border} ${a.bg} px-2.5 py-1 text-xs font-semibold ${a.text}`}>
          <Zap className="h-3 w-3" /> +{goal.rewardXP} XP
        </span>
      </div>

      <h3 className="mt-5 text-base font-semibold text-white">{goal.title}</h3>
      <p className="mt-1.5 text-sm text-slate-400 leading-snug">{goal.description}</p>

      <div className="mt-5 flex items-center justify-between text-sm">
        <span className="font-semibold text-white">
          {goal.current} / {goal.target} {goal.unit}
        </span>
        <span className={`font-semibold ${a.text}`}>{pct}%</span>
      </div>

      <div className="mt-2.5 h-2.5 w-full overflow-hidden rounded-full bg-white/10">
        <div className={`h-full rounded-full ${a.bar} transition-[width] duration-700 ease-out`} style={{ width: `${pct}%` }} />
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <DifficultyTag difficulty={goal.difficulty} />
        <PriorityTag priority={goal.priority} />
        <span className="flex items-center gap-1 text-[11px] font-medium text-slate-400">
          <Clock className="h-3 w-3" /> {goal.timeRequired}
        </span>
      </div>

      <button
        type="button"
        disabled={isComplete}
        onClick={(e) => onComplete(goal, e.currentTarget)}
        className={`mt-5 flex w-full items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${
          isComplete
            ? "border-emerald-400/30 bg-emerald-500/15 text-emerald-300 cursor-default"
            : `border-white/10 bg-white/5 text-white hover:bg-gradient-to-r hover:${a.gradient} hover:text-white hover:border-transparent`
        }`}
      >
        {isComplete ? (
          <>
            <CheckCircle2 className="h-4 w-4" /> Completed
          </>
        ) : (
          <>
            <Circle className="h-4 w-4" /> Log progress
          </>
        )}
      </button>
    </div>
  );
}

/* ============================================================================
   10. WEEKLY CHALLENGE
============================================================================ */

function WeeklyChallenge() {
  const [timeLeft, setTimeLeft] = useState(() => {
    const now = new Date();
    const end = new Date();
    end.setDate(now.getDate() + ((7 - now.getDay()) % 7 || 7));
    end.setHours(23, 59, 59, 0);
    return Math.max(0, end.getTime() - now.getTime());
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((t) => Math.max(0, t - 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((timeLeft / (1000 * 60)) % 60);

  const tasks = [
    { label: "10 Coding Problems", done: 6, total: 10 },
    { label: "2 Mock Interviews", done: 1, total: 2 },
    { label: "Resume Optimization", done: 4, total: 5 },
    { label: "Communication Practice", done: 5, total: 7 },
  ];

  const totalDone = tasks.reduce((s, t) => s + t.done, 0);
  const totalTarget = tasks.reduce((s, t) => s + t.total, 0);
  const overallPct = clampPct(totalDone, totalTarget);

  return (
    <GlassPanel className="relative overflow-hidden border-orange-400/30 bg-gradient-to-br from-orange-500/10 via-purple-500/5 to-transparent p-7 sm:p-8 shadow-[0_0_40px_-10px_rgba(251,146,60,0.4)]">
      <div className="absolute -top-16 -right-16 h-56 w-56 rounded-full bg-orange-500/20 blur-3xl" />
      <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <Flame className="pm-flame h-5 w-5 text-orange-400" />
            <p className="text-sm font-bold uppercase tracking-wide text-orange-300">Weekly Challenge</p>
          </div>
          <h3 className="mt-2.5 text-xl font-bold text-white">Finish strong this week</h3>

          <div className="mt-5 space-y-3">
            {tasks.map((t) => {
              const tPct = clampPct(t.done, t.total);
              const tDone = t.done >= t.total;
              return (
                <div key={t.label} className="flex items-center gap-3">
                  {tDone ? (
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                  ) : (
                    <Circle className="h-4 w-4 shrink-0 text-slate-500" />
                  )}
                  <span className={`w-44 shrink-0 text-sm ${tDone ? "text-slate-400 line-through" : "text-slate-200"}`}>
                    {t.label}
                  </span>
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-orange-400 to-amber-400 transition-[width] duration-700"
                      style={{ width: `${tPct}%` }}
                    />
                  </div>
                  <span className="w-10 shrink-0 text-right text-xs text-slate-400">
                    {t.done}/{t.total}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span className="flex items-center gap-1.5 rounded-full border border-orange-400/30 bg-orange-500/15 px-3 py-1.5 text-xs font-semibold text-orange-300">
              <Zap className="h-3.5 w-3.5" /> 500 XP reward
            </span>
            <span className="flex items-center gap-1.5 rounded-full border border-purple-400/30 bg-purple-500/15 px-3 py-1.5 text-xs font-semibold text-purple-300">
              <Medal className="h-3.5 w-3.5" /> Exclusive badge
            </span>
          </div>
        </div>

        <div className="flex flex-col items-center gap-4">
          <ProgressRing percentage={overallPct} size={120} strokeWidth={10} accent="orange" label={`${overallPct}%`} sublabel="Complete" />
          <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-2">
            <Timer className="h-4 w-4 text-orange-300" />
            <span className="text-sm font-semibold text-white tabular-nums">
              {days}d {hours}h {minutes}m left
            </span>
          </div>
        </div>
      </div>
    </GlassPanel>
  );
}

/* ============================================================================
   11. AI COACH SUGGESTIONS
============================================================================ */

function AIRecommendations() {
  return (
    <GlassPanel className="h-full p-7 sm:p-8">
      <SectionHeading icon={Brain} title="AI Coach Suggestions" subtitle="Placement-focused recommendations" accent="purple" />
      <div className="grid gap-3 sm:grid-cols-2">
        {RECOMMENDATIONS_DATA.map((rec) => {
          const a = ACCENT[rec.accent];
          const Icon = rec.icon;
          return (
            <div
              key={rec.id}
              className={`group flex items-start gap-3 rounded-2xl border ${a.border} bg-white/[0.03] p-4 transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/[0.06] ${a.glow}`}
            >
              <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${a.border} ${a.bg}`}>
                <Icon className={`h-4 w-4 ${a.text}`} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-white">{rec.title}</p>
                  <span className={`rounded-full border ${a.border} ${a.bg} px-1.5 py-0.5 text-[10px] font-medium ${a.text}`}>
                    {rec.tag}
                  </span>
                </div>
                <p className="mt-1 text-xs leading-relaxed text-slate-400">{rec.detail}</p>
              </div>
              <ChevronRight className="ml-auto h-4 w-4 shrink-0 text-slate-500 transition-transform group-hover:translate-x-0.5" />
            </div>
          );
        })}
      </div>
    </GlassPanel>
  );
}

/* ============================================================================
   12. DAILY MOTIVATION
============================================================================ */

function MotivationCard() {
  const [quote, setQuote] = useState(MOTIVATION_QUOTES[0]);

  useEffect(() => {
    setQuote(MOTIVATION_QUOTES[Math.floor(Math.random() * MOTIVATION_QUOTES.length)]);
  }, []);

  const refresh = useCallback(() => {
    setQuote((prev) => {
      let next = prev;
      while (next === prev) {
        next = MOTIVATION_QUOTES[Math.floor(Math.random() * MOTIVATION_QUOTES.length)];
      }
      return next;
    });
  }, []);

  return (
    <GlassPanel className="relative h-full overflow-hidden border-emerald-400/20 bg-emerald-500/[0.06] p-7 sm:p-8">
      <Quote className="absolute -bottom-4 -right-2 h-24 w-24 text-emerald-400/10" />
      <div className="relative flex h-full flex-col">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-emerald-400/30 bg-emerald-500/15">
            <Sparkles className="h-4.5 w-4.5 text-emerald-300" />
          </div>
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-300/80">Daily Motivation</p>
        </div>
        <p className="mt-5 flex-1 text-lg font-medium leading-relaxed text-white">&ldquo;{quote}&rdquo;</p>
        <button
          onClick={refresh}
          className="mt-5 inline-flex w-fit items-center gap-1.5 rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-2 text-xs font-semibold text-emerald-300 transition-colors hover:bg-emerald-500/20"
        >
          <Sparkles className="h-3.5 w-3.5" /> New quote
        </button>
      </div>
    </GlassPanel>
  );
}

/* ============================================================================
   13. MAIN COMPONENT — WeeklyGoals
============================================================================ */

export default function WeeklyGoals() {
  const [goals, setGoals] = useState<GoalCardData[]>(GOALS_DATA);
  const [popups, setPopups] = useState<XPPopup[]>([]);
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);
  const [weeklyXP, setWeeklyXP] = useState(2150);
  const popupId = useRef(0);
  const confettiId = useRef(0);

  const weeklyXPTarget = 3000;
  const level = 14;
  const remainingXP = Math.max(0, weeklyXPTarget - weeklyXP);
  const currentStreak = 7;

  const spawnConfetti = useCallback(() => {
    const colors = ["#a855f7", "#22d3ee", "#34d399", "#fb923c", "#f472b6"];
    const pieces: ConfettiPiece[] = Array.from({ length: 26 }, () => {
      confettiId.current += 1;
      return {
        id: confettiId.current,
        left: Math.random() * 100,
        delay: Math.random() * 200,
        duration: 900 + Math.random() * 700,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotate: Math.random() * 360,
      };
    });
    setConfetti((prev) => [...prev, ...pieces]);
    const pieceIds = new Set(pieces.map((p) => p.id));
    setTimeout(() => {
      setConfetti((prev) => prev.filter((p) => !pieceIds.has(p.id)));
    }, 2200);
  }, []);

  const handleGoalComplete = useCallback(
    (goal: GoalCardData, el: HTMLElement) => {
      const rect = el.getBoundingClientRect();
      const id = ++popupId.current;
      const popup: XPPopup = {
        id,
        amount: goal.rewardXP,
        x: rect.left + rect.width / 2,
        y: rect.top,
      };
      setPopups((prev) => [...prev, popup]);
      setTimeout(() => {
        setPopups((prev) => prev.filter((p) => p.id !== id));
      }, 1450);

      setGoals((prev) =>
        prev.map((g) => {
          if (g.id !== goal.id) return g;
          const increment = Math.max(1, Math.round((g.target - g.current) / 2) || 1);
          const nextCurrent = Math.min(g.target, g.current + increment);
          if (nextCurrent >= g.target && g.current < g.target) {
            spawnConfetti();
          }
          return { ...g, current: nextCurrent };
        })
      );

      setWeeklyXP((v) => v + goal.rewardXP);
    },
    [spawnConfetti]
  );

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-10 text-slate-100 sm:px-6 lg:px-10">
      <LocalStyles />
      <XPPopupLayer popups={popups} />
      <ConfettiLayer pieces={confetti} />

      <div className="mx-auto max-w-7xl space-y-8">
        {/* Hero */}
        <WeeklyHero
          weeklyXP={weeklyXP}
          weeklyXPTarget={weeklyXPTarget}
          level={level}
          remainingXP={remainingXP}
          currentStreak={currentStreak}
          mission="Complete 2 mock interviews and finish your resume optimization to unlock next week's bonus mission."
        />

        {/* Today's Weekly Goals */}
        <GlassPanel className="p-7 sm:p-8">
          <SectionHeading icon={Target} title="Today's Weekly Goals" subtitle="Stay on top of every mission" accent="purple" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {goals.map((g) => (
              <GoalCard key={g.id} goal={g} onComplete={handleGoalComplete} />
            ))}
          </div>
        </GlassPanel>

        {/* Habit tracker */}
        <HabitTracker week={WEEK_DATA} />

        {/* Weekly challenge */}
        <WeeklyChallenge />

        {/* AI Coach + Daily Motivation, side by side to keep the page compact */}
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <AIRecommendations />
          </div>
          <MotivationCard />
        </div>
      </div>
    </div>
  );
}