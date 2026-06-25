import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import {
  Trophy,
  Star,
  Zap,
  Crown,
  Lock,
  CheckCircle2,
  Code2,
  FileText,
  MessageSquare,
  Mic,
  Flame,
  GraduationCap,
  Sparkles,
  Award,
  Download,
  Eye,
  Calendar,
  UserPlus,
  Rocket,
  ChevronRight,
  Gem,
  ShieldCheck,
  Building2,
  TrendingUp,
} from "lucide-react";

/* ============================================================================
   Achievements.tsx
   Premium Gamified Achievements page — PlaceMentor AI
   Single-file React + TypeScript + TailwindCSS component.

   Celebrates the user's learning journey: badge collection (grouped by
   category, with rarity and lock state), milestones, XP history,
   certificates, and overall achievement progress. Built on the same
   glassmorphism + dark theme used across PlaceMentor AI, extended here
   with a gold accent for prestige / legendary moments per this page's
   brief (purple + gold).
============================================================================ */

/* ============================================================================
   1. TYPES
============================================================================ */

type AccentColor = "purple" | "cyan" | "emerald" | "orange" | "gold" | "rose";
type Rarity = "Common" | "Rare" | "Epic" | "Legendary";

type CategoryId =
  | "coding"
  | "resume"
  | "communication"
  | "mockInterview"
  | "consistency"
  | "placement";

interface CategoryMeta {
  id: CategoryId;
  label: string;
  icon: React.ElementType;
  accent: AccentColor;
}

interface AchievementData {
  id: string;
  categoryId: CategoryId;
  title: string;
  description: string;
  icon: React.ElementType;
  rarity: Rarity;
  xpReward: number;
  progress: number;
  target: number;
  unlocked: boolean;
  unlockedDate?: string;
}

interface MilestoneData {
  id: string;
  title: string;
  description: string;
  date: string;
  icon: React.ElementType;
  accent: AccentColor;
}

interface XPActivity {
  id: string;
  label: string;
  amount: number;
  when: string;
  icon: React.ElementType;
  accent: AccentColor;
}

interface CertificateData {
  id: string;
  title: string;
  issuedDate: string;
  icon: React.ElementType;
  accent: AccentColor;
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
   2. THEME HELPERS
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
    solid: string;
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
    solid: "#a855f7",
  },
  cyan: {
    text: "text-cyan-300",
    bg: "bg-cyan-500/15",
    border: "border-cyan-400/30",
    ring: "ring-cyan-400/40",
    gradient: "from-cyan-400 to-sky-500",
    glow: "shadow-[0_0_30px_-5px_rgba(34,211,238,0.55)]",
    bar: "bg-gradient-to-r from-cyan-400 to-sky-400",
    solid: "#22d3ee",
  },
  emerald: {
    text: "text-emerald-300",
    bg: "bg-emerald-500/15",
    border: "border-emerald-400/30",
    ring: "ring-emerald-400/40",
    gradient: "from-emerald-400 to-teal-500",
    glow: "shadow-[0_0_30px_-5px_rgba(52,211,153,0.55)]",
    bar: "bg-gradient-to-r from-emerald-400 to-teal-400",
    solid: "#34d399",
  },
  orange: {
    text: "text-orange-300",
    bg: "bg-orange-500/15",
    border: "border-orange-400/30",
    ring: "ring-orange-400/40",
    gradient: "from-orange-400 to-amber-500",
    glow: "shadow-[0_0_30px_-5px_rgba(251,146,60,0.55)]",
    bar: "bg-gradient-to-r from-orange-400 to-amber-400",
    solid: "#fb923c",
  },
  gold: {
    text: "text-amber-300",
    bg: "bg-amber-400/15",
    border: "border-amber-300/30",
    ring: "ring-amber-300/40",
    gradient: "from-amber-300 to-yellow-500",
    glow: "shadow-[0_0_34px_-5px_rgba(252,211,77,0.6)]",
    bar: "bg-gradient-to-r from-amber-300 to-yellow-400",
    solid: "#fcd34d",
  },
  rose: {
    text: "text-rose-300",
    bg: "bg-rose-500/15",
    border: "border-rose-400/30",
    ring: "ring-rose-400/40",
    gradient: "from-rose-400 to-pink-500",
    glow: "shadow-[0_0_30px_-5px_rgba(251,113,133,0.55)]",
    bar: "bg-gradient-to-r from-rose-400 to-pink-400",
    solid: "#fb7185",
  },
};

const RARITY_STYLES: Record<
  Rarity,
  { label: string; text: string; bg: string; border: string; glow: string }
> = {
  Common: {
    label: "Common",
    text: "text-slate-300",
    bg: "bg-slate-500/15",
    border: "border-slate-400/30",
    glow: "shadow-[0_0_18px_-6px_rgba(148,163,184,0.5)]",
  },
  Rare: {
    label: "Rare",
    text: "text-cyan-300",
    bg: "bg-cyan-500/15",
    border: "border-cyan-400/30",
    glow: "shadow-[0_0_22px_-6px_rgba(34,211,238,0.55)]",
  },
  Epic: {
    label: "Epic",
    text: "text-purple-300",
    bg: "bg-purple-500/15",
    border: "border-purple-400/30",
    glow: "shadow-[0_0_26px_-6px_rgba(168,85,247,0.6)]",
  },
  Legendary: {
    label: "Legendary",
    text: "text-amber-300",
    bg: "bg-amber-400/15",
    border: "border-amber-300/30",
    glow: "shadow-[0_0_32px_-6px_rgba(252,211,77,0.7)]",
  },
};

function clampPct(value: number, max: number): number {
  if (max <= 0) return 0;
  return Math.max(0, Math.min(100, Math.round((value / max) * 100)));
}

/* ============================================================================
   3. DUMMY DATA
============================================================================ */

const CATEGORY_META: CategoryMeta[] = [
  { id: "coding", label: "Coding", icon: Code2, accent: "purple" },
  { id: "resume", label: "Resume", icon: FileText, accent: "cyan" },
  { id: "communication", label: "Communication", icon: MessageSquare, accent: "emerald" },
  { id: "mockInterview", label: "Mock Interview", icon: Mic, accent: "orange" },
  { id: "consistency", label: "Consistency", icon: Flame, accent: "gold" },
  { id: "placement", label: "Placement", icon: Building2, accent: "rose" },
];

function getCategoryMeta(id: CategoryId): CategoryMeta {
  return CATEGORY_META.find((c) => c.id === id) as CategoryMeta;
}

// NOTE: in production, this collection is fetched from the achievements
// service keyed by user id. Shape is kept stable so the API response can
// be dropped in directly without touching the components below.
const ACHIEVEMENTS_DATA: AchievementData[] = [
  // Coding
  { id: "code-1", categoryId: "coding", title: "First Problem Solved", description: "Solve your first coding problem.", icon: Code2, rarity: "Common", xpReward: 30, progress: 1, target: 1, unlocked: true, unlockedDate: "Jan 15, 2026" },
  { id: "code-2", categoryId: "coding", title: "10 Problems Solved", description: "Solve 10 coding problems in total.", icon: Code2, rarity: "Rare", xpReward: 80, progress: 10, target: 10, unlocked: true, unlockedDate: "Feb 3, 2026" },
  { id: "code-3", categoryId: "coding", title: "50 Problems Solved", description: "Solve 50 coding problems in total.", icon: Code2, rarity: "Epic", xpReward: 220, progress: 38, target: 50, unlocked: false },
  { id: "code-4", categoryId: "coding", title: "100 Problems Solved", description: "Solve 100 coding problems in total.", icon: Code2, rarity: "Legendary", xpReward: 500, progress: 38, target: 100, unlocked: false },

  // Resume
  { id: "resume-1", categoryId: "resume", title: "Resume Uploaded", description: "Upload your resume for the first time.", icon: FileText, rarity: "Common", xpReward: 20, progress: 1, target: 1, unlocked: true, unlockedDate: "Jan 12, 2026" },
  { id: "resume-2", categoryId: "resume", title: "ATS Score Above 80", description: "Reach an ATS score of 80 or higher.", icon: FileText, rarity: "Rare", xpReward: 100, progress: 80, target: 80, unlocked: true, unlockedDate: "Apr 18, 2026" },
  { id: "resume-3", categoryId: "resume", title: "ATS Score Above 90", description: "Reach an ATS score of 90 or higher.", icon: FileText, rarity: "Epic", xpReward: 200, progress: 80, target: 90, unlocked: false },

  // Communication
  { id: "comm-1", categoryId: "communication", title: "First Self Introduction", description: "Complete your first self-introduction practice.", icon: MessageSquare, rarity: "Common", xpReward: 20, progress: 1, target: 1, unlocked: true, unlockedDate: "Jan 20, 2026" },
  { id: "comm-2", categoryId: "communication", title: "10 Speaking Sessions", description: "Complete 10 communication practice sessions.", icon: MessageSquare, rarity: "Rare", xpReward: 90, progress: 10, target: 10, unlocked: true, unlockedDate: "May 2, 2026" },
  { id: "comm-3", categoryId: "communication", title: "Communication Expert", description: "Complete 25 communication practice sessions.", icon: MessageSquare, rarity: "Epic", xpReward: 220, progress: 16, target: 25, unlocked: false },

  // Mock Interview
  { id: "mock-1", categoryId: "mockInterview", title: "First Mock Interview", description: "Complete your first AI mock interview.", icon: Mic, rarity: "Common", xpReward: 30, progress: 1, target: 1, unlocked: true, unlockedDate: "Feb 8, 2026" },
  { id: "mock-2", categoryId: "mockInterview", title: "10 Mock Interviews", description: "Complete 10 mock interviews.", icon: Mic, rarity: "Rare", xpReward: 150, progress: 4, target: 10, unlocked: false },
  { id: "mock-3", categoryId: "mockInterview", title: "Interview Master", description: "Complete 25 mock interviews.", icon: Mic, rarity: "Legendary", xpReward: 450, progress: 4, target: 25, unlocked: false },

  // Consistency
  { id: "streak-1", categoryId: "consistency", title: "7 Day Streak", description: "Maintain a 7-day activity streak.", icon: Flame, rarity: "Common", xpReward: 50, progress: 7, target: 7, unlocked: true, unlockedDate: "Jun 20, 2026" },
  { id: "streak-2", categoryId: "consistency", title: "30 Day Streak", description: "Maintain a 30-day activity streak.", icon: Flame, rarity: "Rare", xpReward: 180, progress: 7, target: 30, unlocked: false },
  { id: "streak-3", categoryId: "consistency", title: "100 Day Streak", description: "Maintain a 100-day activity streak.", icon: Flame, rarity: "Legendary", xpReward: 600, progress: 7, target: 100, unlocked: false },

  // Placement
  { id: "place-1", categoryId: "placement", title: "Placement Ready", description: "Reach an overall placement readiness score of 90.", icon: ShieldCheck, rarity: "Epic", xpReward: 250, progress: 74, target: 90, unlocked: false },
  { id: "place-2", categoryId: "placement", title: "Company Ready", description: "Hit the readiness bar for a shortlisted company.", icon: Building2, rarity: "Legendary", xpReward: 400, progress: 0, target: 1, unlocked: false },
  { id: "place-3", categoryId: "placement", title: "Dream Company Ready", description: "Hit the readiness bar for your dream company.", icon: Crown, rarity: "Legendary", xpReward: 600, progress: 0, target: 1, unlocked: false },
];

const MILESTONES_DATA: MilestoneData[] = [
  { id: "m1", title: "Account Created", description: "Joined PlaceMentor AI and started the journey.", date: "Jan 10, 2026", icon: UserPlus, accent: "purple" },
  { id: "m2", title: "First Resume Upload", description: "Uploaded a resume for AI analysis.", date: "Jan 12, 2026", icon: FileText, accent: "cyan" },
  { id: "m3", title: "First Coding Challenge", description: "Solved the first coding problem.", date: "Jan 15, 2026", icon: Code2, accent: "purple" },
  { id: "m4", title: "First Mock Interview", description: "Completed the first AI mock interview.", date: "Feb 8, 2026", icon: Mic, accent: "orange" },
  { id: "m5", title: "First Badge", description: "Unlocked the very first achievement badge.", date: "Jan 12, 2026", icon: Award, accent: "gold" },
  { id: "m6", title: "Latest Achievement", description: "Hit a 7-day activity streak.", date: "Jun 20, 2026", icon: Flame, accent: "gold" },
];

const XP_ACTIVITIES: XPActivity[] = [
  { id: "x1", label: "Completed Mock Interview", amount: 180, when: "Today, 9:40 AM", icon: Mic, accent: "orange" },
  { id: "x2", label: "Solved 2 coding problems", amount: 60, when: "Today, 8:15 AM", icon: Code2, accent: "purple" },
  { id: "x3", label: "Communication practice session", amount: 40, when: "Yesterday", icon: MessageSquare, accent: "emerald" },
  { id: "x4", label: "Resume re-scan, ATS improved", amount: 35, when: "2 days ago", icon: FileText, accent: "cyan" },
  { id: "x5", label: "7-day streak bonus", amount: 50, when: "3 days ago", icon: Flame, accent: "gold" },
];

const CERTIFICATES_DATA: CertificateData[] = [
  { id: "cert-1", title: "DSA Foundations", issuedDate: "Mar 2, 2026", icon: Code2, accent: "purple" },
  { id: "cert-2", title: "Resume Mastery", issuedDate: "Apr 18, 2026", icon: FileText, accent: "cyan" },
  { id: "cert-3", title: "Communication Pro", issuedDate: "May 2, 2026", icon: MessageSquare, accent: "emerald" },
  { id: "cert-4", title: "Interview Readiness", issuedDate: "May 28, 2026", icon: GraduationCap, accent: "gold" },
];

/* ============================================================================
   4. LOCAL STYLE SHEET
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
      @keyframes pm-unlock-pop {
        0% { transform: scale(1); }
        35% { transform: scale(1.12) rotate(-3deg); }
        60% { transform: scale(0.97) rotate(2deg); }
        100% { transform: scale(1) rotate(0deg); }
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
      .pm-unlock-pop { animation: pm-unlock-pop 0.5s ease-out; }
      .pm-badge-flip { perspective: 1000px; }
      .pm-badge-flip-inner { transition: transform 0.6s; transform-style: preserve-3d; }
      .pm-badge-flip:hover .pm-badge-flip-inner { transform: rotateY(180deg); }
      .pm-backface-hidden { backface-visibility: hidden; }
      .pm-rotate-y-180 { transform: rotateY(180deg); }
    `}</style>
  );
}

/* ============================================================================
   5. PRIMITIVE / SHARED COMPONENTS
============================================================================ */

function GlassPanel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
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
  const a = ACCENT[accent];

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={a.solid} stopOpacity={0.55} />
            <stop offset="100%" stopColor={a.solid} />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={strokeWidth} />
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
      setDisplay(Math.round(from + (to - from) * eased));
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

function RarityTag({ rarity }: { rarity: Rarity }) {
  const r = RARITY_STYLES[rarity];
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full border ${r.border} ${r.bg} ${r.text}`}>
      <Gem className="h-2.5 w-2.5" /> {r.label}
    </span>
  );
}

function StatTile({
  icon: Icon,
  label,
  value,
  accent,
  suffix = "",
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  accent: AccentColor;
  suffix?: string;
}) {
  const a = ACCENT[accent];
  return (
    <div className={`rounded-2xl border ${a.border} ${a.bg} p-4 transition-transform duration-300 hover:-translate-y-0.5`}>
      <Icon className={`h-4 w-4 ${a.text}`} />
      <p className="mt-2 text-xl font-bold text-white">
        <AnimatedCounter value={value} />
        {suffix}
      </p>
      <p className="mt-1 text-[11px] uppercase tracking-wide text-slate-400">{label}</p>
    </div>
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
          <span className="flex items-center gap-1 rounded-full border border-amber-300/40 bg-amber-400/20 px-3 py-1 text-sm font-bold text-amber-200 shadow-lg shadow-amber-400/20 backdrop-blur">
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
============================================================================ */

interface HeroProps {
  totalAchievements: number;
  unlockedCount: number;
  totalXP: number;
  level: number;
  completionPct: number;
}

function AchievementsHero({ totalAchievements, unlockedCount, totalXP, level, completionPct }: HeroProps) {
  return (
    <GlassPanel className="overflow-hidden p-7 sm:p-10">
      <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-purple-600/20 blur-3xl" />
      <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-amber-400/10 blur-3xl" />

      <div className="relative flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
          <ProgressRing percentage={completionPct} size={150} strokeWidth={13} accent="gold" label={`${completionPct}%`} sublabel="Unlocked" />

          <div>
            <p className="text-xs uppercase tracking-widest text-amber-300/80 font-medium">Achievements</p>
            <h1 className="mt-1.5 text-2xl sm:text-3xl font-bold text-white pm-shimmer-text">
              Your learning journey, celebrated
            </h1>
            <p className="mt-2.5 max-w-md text-sm text-slate-400">
              You've unlocked <span className="text-white font-semibold">{unlockedCount}</span> of{" "}
              <span className="text-white font-semibold">{totalAchievements}</span> achievements across every
              skill area.
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 rounded-2xl border border-purple-400/30 bg-purple-500/10 px-4 py-2.5">
                <Crown className="h-4 w-4 text-purple-300" />
                <div className="leading-tight">
                  <p className="text-sm font-bold text-white">Level {level}</p>
                  <p className="text-[10px] text-purple-300/80 uppercase tracking-wide">Current level</p>
                </div>
              </div>
              <div className="flex items-center gap-2 rounded-2xl border border-amber-300/30 bg-amber-400/10 px-4 py-2.5">
                <Zap className="h-4 w-4 text-amber-300" />
                <div className="leading-tight">
                  <p className="text-sm font-bold text-white">
                    <AnimatedCounter value={totalXP} /> XP
                  </p>
                  <p className="text-[10px] text-amber-300/80 uppercase tracking-wide">Total XP earned</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full max-w-sm lg:w-72">
          <GlassPanel className="border-amber-300/20 bg-amber-400/[0.06] p-5">
            <div className="flex items-center gap-2 text-amber-300">
              <Trophy className="h-4 w-4" />
              <p className="text-xs font-semibold uppercase tracking-wide">Achievement progress</p>
            </div>
            <p className="mt-2.5 text-sm font-medium text-white leading-snug">
              {totalAchievements - unlockedCount} achievements left to a fully unlocked collection.
            </p>
            <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
              <span>
                {unlockedCount} / {totalAchievements} unlocked
              </span>
              <span className="text-amber-300 font-semibold">{completionPct}%</span>
            </div>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-300 to-yellow-400 transition-[width] duration-1000 ease-out"
                style={{ width: `${completionPct}%` }}
              />
            </div>
          </GlassPanel>
        </div>
      </div>
    </GlassPanel>
  );
}

/* ============================================================================
   8. PROGRESS SUMMARY STRIP
============================================================================ */

function ProgressSummary({
  badgesEarned,
  badgesRemaining,
  achievementPct,
  levelProgressPct,
  level,
}: {
  badgesEarned: number;
  badgesRemaining: number;
  achievementPct: number;
  levelProgressPct: number;
  level: number;
}) {
  return (
    <GlassPanel className="p-6 sm:p-7">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatTile icon={Award} label="Badges earned" value={badgesEarned} accent="purple" />
        <StatTile icon={Lock} label="Badges remaining" value={badgesRemaining} accent="cyan" />
        <StatTile icon={Trophy} label="Achievement %" value={achievementPct} accent="gold" suffix="%" />
        <div className="rounded-2xl border border-emerald-400/30 bg-emerald-500/15 p-4">
          <TrendingUp className="h-4 w-4 text-emerald-300" />
          <p className="mt-2 text-xl font-bold text-white">Lv. {level}</p>
          <p className="mt-1 text-[11px] uppercase tracking-wide text-slate-400">Level progress</p>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
            <div className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-400 transition-[width] duration-700" style={{ width: `${levelProgressPct}%` }} />
          </div>
        </div>
      </div>
    </GlassPanel>
  );
}

/* ============================================================================
   9. BADGE COLLECTION (achievement categories + rarity + lock state)
============================================================================ */

function BadgeTile({
  achievement,
  onClaim,
}: {
  achievement: AchievementData;
  onClaim: (achievement: AchievementData, el: HTMLElement) => void;
}) {
  const meta = getCategoryMeta(achievement.categoryId);
  const Icon = achievement.icon;
  const rarity = RARITY_STYLES[achievement.rarity];
  const pct = clampPct(achievement.progress, achievement.target);
  const claimable = !achievement.unlocked && achievement.progress >= achievement.target;
  const [justUnlocked, setJustUnlocked] = useState(false);

  return (
    <div className="pm-badge-flip h-48">
      <div className={`pm-badge-flip-inner relative h-full w-full ${justUnlocked ? "pm-unlock-pop" : ""}`}>
        {/* front */}
        <div
          className={`pm-backface-hidden absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-2xl border p-4 text-center transition-all ${
            achievement.unlocked ? `${rarity.border} ${rarity.bg} ${rarity.glow}` : "border-white/10 bg-white/[0.03]"
          }`}
        >
          <div className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${achievement.unlocked ? rarity.border : "border-white/10"} ${achievement.unlocked ? rarity.bg : "bg-white/5"}`}>
            {achievement.unlocked ? <Icon className={`h-6 w-6 ${rarity.text}`} /> : <Lock className="h-5 w-5 text-slate-500" />}
          </div>
          <p className="text-sm font-semibold text-white leading-tight">{achievement.title}</p>
          <RarityTag rarity={achievement.rarity} />
          {!achievement.unlocked && (
            <p className="text-[11px] text-slate-400">
              {achievement.progress}/{achievement.target}
            </p>
          )}
        </div>

        {/* back */}
        <div
          className={`pm-backface-hidden pm-rotate-y-180 absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-2xl border p-4 text-center ${
            achievement.unlocked ? `${rarity.border} ${rarity.bg}` : "border-white/10 bg-white/[0.05]"
          }`}
        >
          <Icon className={`h-4 w-4 ${meta.accent ? ACCENT[meta.accent].text : "text-slate-300"}`} />
          <p className="text-xs leading-snug text-slate-200">{achievement.description}</p>
          {achievement.unlocked ? (
            <p className="text-[10px] text-slate-400">Unlocked {achievement.unlockedDate}</p>
          ) : (
            <div className="mt-1 w-full">
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                <div className={`h-full rounded-full bg-gradient-to-r ${rarity.text.replace("text-", "from-")} to-white/40`} style={{ width: `${pct}%` }} />
              </div>
              <p className="mt-1 text-[10px] text-slate-400">{pct}% complete</p>
              {claimable && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setJustUnlocked(true);
                    onClaim(achievement, e.currentTarget);
                    setTimeout(() => setJustUnlocked(false), 550);
                  }}
                  className="mt-2 flex w-full items-center justify-center gap-1 rounded-lg border border-amber-300/40 bg-amber-400/15 px-2 py-1.5 text-[11px] font-semibold text-amber-200 hover:bg-amber-400/25"
                >
                  <Sparkles className="h-3 w-3" /> Claim badge
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function BadgeCollection({
  achievements,
  onClaim,
}: {
  achievements: AchievementData[];
  onClaim: (achievement: AchievementData, el: HTMLElement) => void;
}) {
  const [activeCategory, setActiveCategory] = useState<CategoryId | "all">("all");

  const filtered = useMemo(
    () => (activeCategory === "all" ? achievements : achievements.filter((a) => a.categoryId === activeCategory)),
    [achievements, activeCategory]
  );

  return (
    <GlassPanel className="p-7 sm:p-8">
      <SectionHeading
        icon={Award}
        title="Badge Collection"
        subtitle="Achievements grouped by category — hover a badge to see its progress"
        accent="purple"
      />

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setActiveCategory("all")}
          className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors ${
            activeCategory === "all"
              ? "border-purple-400/40 bg-purple-500/20 text-purple-200"
              : "border-white/10 bg-white/[0.03] text-slate-400 hover:text-slate-200"
          }`}
        >
          All
        </button>
        {CATEGORY_META.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;
          const a = ACCENT[cat.accent];
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                isActive ? `${a.border} ${a.bg} ${a.text}` : "border-white/10 bg-white/[0.03] text-slate-400 hover:text-slate-200"
              }`}
            >
              <Icon className="h-3.5 w-3.5" /> {cat.label}
            </button>
          );
        })}
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {filtered.map((achievement) => (
          <BadgeTile key={achievement.id} achievement={achievement} onClaim={onClaim} />
        ))}
      </div>
    </GlassPanel>
  );
}

/* ============================================================================
   10. MILESTONES TIMELINE
============================================================================ */

function MilestonesTimeline({ milestones }: { milestones: MilestoneData[] }) {
  return (
    <GlassPanel className="p-7 sm:p-8">
      <SectionHeading icon={Calendar} title="Milestones" subtitle="Key moments in your placement journey" accent="cyan" />
      <div className="relative pl-2">
        <div className="absolute left-[23px] top-2 bottom-2 w-px bg-gradient-to-b from-purple-400/40 via-cyan-400/30 to-transparent" />
        <div className="space-y-6">
          {milestones.map((m) => {
            const a = ACCENT[m.accent];
            const Icon = m.icon;
            return (
              <div key={m.id} className="relative flex items-start gap-4">
                <div className={`relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border ${a.border} ${a.bg}`}>
                  <Icon className={`h-4.5 w-4.5 ${a.text}`} />
                </div>
                <div className="flex-1 pt-1">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <p className="text-sm font-semibold text-white">{m.title}</p>
                    <span className="text-[11px] text-slate-500">{m.date}</span>
                  </div>
                  <p className="mt-0.5 text-xs text-slate-400">{m.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </GlassPanel>
  );
}

/* ============================================================================
   11. XP HISTORY
============================================================================ */

function XPHistory({
  today,
  week,
  month,
  lifetime,
  activities,
}: {
  today: number;
  week: number;
  month: number;
  lifetime: number;
  activities: XPActivity[];
}) {
  return (
    <GlassPanel className="p-7 sm:p-8">
      <SectionHeading icon={Zap} title="XP History" subtitle="Where your experience has come from" accent="orange" />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatTile icon={Zap} label="Today" value={today} accent="orange" />
        <StatTile icon={Zap} label="This week" value={week} accent="purple" />
        <StatTile icon={Zap} label="This month" value={month} accent="cyan" />
        <StatTile icon={Gem} label="Lifetime XP" value={lifetime} accent="gold" />
      </div>

      <div className="mt-6 space-y-2.5">
        {activities.map((act) => {
          const a = ACCENT[act.accent];
          const Icon = act.icon;
          return (
            <div key={act.id} className="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/[0.02] p-3.5 transition-colors hover:bg-white/[0.05]">
              <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${a.border} ${a.bg}`}>
                <Icon className={`h-4 w-4 ${a.text}`} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-white">{act.label}</p>
                <p className="text-xs text-slate-500">{act.when}</p>
              </div>
              <span className="shrink-0 text-sm font-semibold text-amber-300">+{act.amount} XP</span>
            </div>
          );
        })}
      </div>
    </GlassPanel>
  );
}

/* ============================================================================
   12. RECENT ACHIEVEMENTS HIGHLIGHTS
============================================================================ */

function RecentAchievements({
  latestBadge,
  latestCertificate,
  latestMilestone,
  latestXP,
}: {
  latestBadge: AchievementData;
  latestCertificate: CertificateData;
  latestMilestone: MilestoneData;
  latestXP: XPActivity;
}) {
  const items: { label: string; title: string; sub: string; icon: React.ElementType; accent: AccentColor }[] = [
    { label: "Latest badge", title: latestBadge.title, sub: latestBadge.unlockedDate ?? "In progress", icon: Award, accent: "purple" },
    { label: "Latest certificate", title: latestCertificate.title, sub: latestCertificate.issuedDate, icon: GraduationCap, accent: "gold" },
    { label: "Latest milestone", title: latestMilestone.title, sub: latestMilestone.date, icon: Rocket, accent: "cyan" },
    { label: "Recent XP reward", title: latestXP.label, sub: `+${latestXP.amount} XP · ${latestXP.when}`, icon: Zap, accent: "orange" },
  ];

  return (
    <GlassPanel className="p-7 sm:p-8">
      <SectionHeading icon={Sparkles} title="Recent Achievements" subtitle="What you've earned most recently" accent="emerald" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => {
          const a = ACCENT[item.accent];
          const Icon = item.icon;
          return (
            <div key={item.label} className={`group rounded-2xl border ${a.border} bg-white/[0.03] p-4 transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/[0.06] ${a.glow}`}>
              <div className={`flex h-9 w-9 items-center justify-center rounded-xl border ${a.border} ${a.bg}`}>
                <Icon className={`h-4 w-4 ${a.text}`} />
              </div>
              <p className="mt-3 text-[11px] uppercase tracking-wide text-slate-400">{item.label}</p>
              <p className="mt-1 text-sm font-semibold text-white leading-snug">{item.title}</p>
              <p className="mt-1 text-xs text-slate-500">{item.sub}</p>
            </div>
          );
        })}
      </div>
    </GlassPanel>
  );
}

/* ============================================================================
   13. CERTIFICATE COLLECTION
============================================================================ */

function CertificateCard({ certificate }: { certificate: CertificateData }) {
  const a = ACCENT[certificate.accent];
  const Icon = certificate.icon;

  // TODO(backend): wire to the certificates service —
  // GET /certificates/:id/view and GET /certificates/:id/download
  const handleView = useCallback(() => {
    console.log(`View certificate: ${certificate.id}`);
  }, [certificate.id]);

  const handleDownload = useCallback(() => {
    console.log(`Download certificate: ${certificate.id}`);
  }, [certificate.id]);

  return (
    <div className={`group relative overflow-hidden rounded-3xl border ${a.border} bg-white/[0.04] p-6 transition-all duration-300 hover:-translate-y-1 hover:bg-white/[0.06] ${a.glow}`}>
      <div className={`pointer-events-none absolute -top-10 -right-10 h-32 w-32 rounded-full bg-gradient-to-br ${a.gradient} opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-20`} />
      <div className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${a.border} ${a.bg}`}>
        <Icon className={`h-6 w-6 ${a.text}`} />
      </div>
      <p className="mt-4 text-base font-semibold text-white">{certificate.title}</p>
      <p className="mt-1 text-xs text-slate-400">Completed {certificate.issuedDate}</p>
      <div className="mt-5 flex gap-2">
        <button
          type="button"
          onClick={handleView}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-white/10"
        >
          <Eye className="h-3.5 w-3.5" /> View
        </button>
        <button
          type="button"
          onClick={handleDownload}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl border ${a.border} ${a.bg} px-3 py-2 text-xs font-semibold ${a.text} transition-colors hover:bg-white/10`}
        >
          <Download className="h-3.5 w-3.5" /> Download
        </button>
      </div>
    </div>
  );
}

function CertificateCollection({ certificates }: { certificates: CertificateData[] }) {
  return (
    <GlassPanel className="p-7 sm:p-8">
      <SectionHeading icon={GraduationCap} title="Certificate Collection" subtitle="Earned certificates ready to share" accent="gold" />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {certificates.map((cert) => (
          <CertificateCard key={cert.id} certificate={cert} />
        ))}
      </div>
    </GlassPanel>
  );
}

/* ============================================================================
   14. MAIN COMPONENT — Achievements
============================================================================ */

export default function Achievements() {
  const [achievements, setAchievements] = useState<AchievementData[]>(ACHIEVEMENTS_DATA);
  const [popups, setPopups] = useState<XPPopup[]>([]);
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);
  const popupId = useRef(0);
  const confettiId = useRef(0);

  const unlocked = useMemo(() => achievements.filter((a) => a.unlocked), [achievements]);
  const unlockedCount = unlocked.length;
  const totalAchievements = achievements.length;
  const completionPct = clampPct(unlockedCount, totalAchievements);

  const totalXP = useMemo(() => unlocked.reduce((sum, a) => sum + a.xpReward, 0), [unlocked]);
  const level = Math.floor(totalXP / 250) + 1;
  const levelProgressPct = clampPct(totalXP % 250, 250);

  // XP history numbers are independent dummy figures (today/week/month feed
  // from the activity log; lifetime mirrors the achievement-earned total so
  // the hero and history stay consistent with one source of truth).
  const todayXP = 240;
  const weekXP = 870;
  const monthXP = 2150;

  const latestBadge = useMemo(() => {
    const sorted = [...unlocked].filter((a) => a.unlockedDate);
    return sorted[sorted.length - 1] ?? unlocked[0];
  }, [unlocked]);

  const latestCertificate = CERTIFICATES_DATA[CERTIFICATES_DATA.length - 1];
  const latestMilestone = MILESTONES_DATA[MILESTONES_DATA.length - 1];
  const latestXPActivity = XP_ACTIVITIES[0];

  const spawnConfetti = useCallback(() => {
    const colors = ["#fcd34d", "#a855f7", "#22d3ee", "#34d399", "#fb7185"];
    const pieces: ConfettiPiece[] = Array.from({ length: 30 }, () => {
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

  const handleClaim = useCallback(
    (achievement: AchievementData, el: HTMLElement) => {
      const rect = el.getBoundingClientRect();
      const id = ++popupId.current;
      const popup: XPPopup = {
        id,
        amount: achievement.xpReward,
        x: rect.left + rect.width / 2,
        y: rect.top,
      };
      setPopups((prev) => [...prev, popup]);
      setTimeout(() => {
        setPopups((prev) => prev.filter((p) => p.id !== id));
      }, 1450);

      spawnConfetti();

      // TODO(backend): POST /achievements/:id/claim — persist the unlock
      // and award XP server-side; this local update is optimistic UI only.
      setAchievements((prev) =>
        prev.map((a) =>
          a.id === achievement.id
            ? { ...a, unlocked: true, unlockedDate: "Today" }
            : a
        )
      );
    },
    [spawnConfetti]
  );

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-10 text-slate-100 sm:px-6 lg:px-10">
      <LocalStyles />
      <XPPopupLayer popups={popups} />
      <ConfettiLayer pieces={confetti} />

      <div className="mx-auto max-w-7xl space-y-8">
        <AchievementsHero
          totalAchievements={totalAchievements}
          unlockedCount={unlockedCount}
          totalXP={totalXP}
          level={level}
          completionPct={completionPct}
        />

        <ProgressSummary
          badgesEarned={unlockedCount}
          badgesRemaining={totalAchievements - unlockedCount}
          achievementPct={completionPct}
          levelProgressPct={levelProgressPct}
          level={level}
        />

        <BadgeCollection achievements={achievements} onClaim={handleClaim} />

        <div className="grid gap-8 lg:grid-cols-2">
          <MilestonesTimeline milestones={MILESTONES_DATA} />
          <XPHistory today={todayXP} week={weekXP} month={monthXP} lifetime={totalXP} activities={XP_ACTIVITIES} />
        </div>

        <RecentAchievements
          latestBadge={latestBadge}
          latestCertificate={latestCertificate}
          latestMilestone={latestMilestone}
          latestXP={latestXPActivity}
        />

        <CertificateCollection certificates={CERTIFICATES_DATA} />
      </div>
    </div>
  );
}