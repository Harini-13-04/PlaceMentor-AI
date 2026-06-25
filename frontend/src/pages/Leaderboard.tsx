import { useState } from "react";
import { Trophy, TrendingUp, TrendingDown, Star, Zap } from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────
type Tab = "This Week" | "This Month" | "All Time";

interface Player {
  rank: number;
  init: string;
  name: string;
  level: number;
  xp: number;
  delta: string;
  prog: number;
  isMe?: boolean;
  neg?: boolean;
}

// ── Dummy Data ─────────────────────────────────────────────────────
// Future: replace with useState<Player[]>([]) + useEffect API call
const PLAYERS: Player[] = [
  { rank: 1, init: "AJ", name: "Arjun Joshi",   level: 15, xp: 6820, delta: "+580", prog: 92 },
  { rank: 2, init: "RK", name: "Ravi Kumar",     level: 14, xp: 5210, delta: "+410", prog: 78 },
  { rank: 3, init: "PS", name: "Priya Sharma",   level: 13, xp: 4980, delta: "+390", prog: 74 },
  { rank: 4, init: "DM", name: "Deepa Menon",    level: 13, xp: 4760, delta: "+310", prog: 70 },
  { rank: 5, init: "SR", name: "Sneha Rao",      level: 12, xp: 4640, delta: "+280", prog: 66 },
  { rank: 6, init: "KV", name: "Karthik V.",     level: 12, xp: 4590, delta: "+215", prog: 64 },
  { rank: 7, init: "H",  name: "Harini",         level: 12, xp: 4500, delta: "+320", prog: 62, isMe: true },
  { rank: 8, init: "AN", name: "Aditi Nair",     level: 11, xp: 4310, delta: "+190", prog: 58 },
  { rank: 9, init: "VB", name: "Vikram B.",      level: 11, xp: 4100, delta: "-40",  prog: 54, neg: true },
  { rank: 10, init: "MK", name: "Meera K.",      level: 10, xp: 3870, delta: "+120", prog: 48 },
];

const TABS: Tab[] = ["This Week", "This Month", "All Time"];

// ── Medal config ───────────────────────────────────────────────────
const MEDAL = {
  1: { label: "1st", bg: "bg-amber-500/20",   border: "border-amber-400/50",   text: "text-amber-300",   badge: "bg-amber-500 text-amber-950",  glow: "shadow-[0_0_28px_rgba(251,191,36,0.30)]", barH: "h-20" },
  2: { label: "2nd", bg: "bg-slate-400/10",   border: "border-slate-400/30",   text: "text-slate-300",   badge: "bg-slate-400 text-slate-900",  glow: "shadow-[0_0_18px_rgba(148,163,184,0.20)]", barH: "h-14" },
  3: { label: "3rd", bg: "bg-orange-700/10",  border: "border-orange-400/30",  text: "text-orange-300",  badge: "bg-orange-600 text-orange-50", glow: "shadow-[0_0_18px_rgba(194,120,50,0.20)]",  barH: "h-10" },
} as const;

// ── Sub-components ─────────────────────────────────────────────────

interface AvatarProps {
  init: string;
  size?: "sm" | "md" | "lg";
  highlight?: boolean;
  glow?: string;
}
function Avatar({ init, size = "md", highlight = false, glow = "" }: AvatarProps) {
  const sizeClass = size === "lg" ? "w-16 h-16 text-xl" : size === "sm" ? "w-9 h-9 text-xs" : "w-11 h-11 text-sm";
  const ring = highlight
    ? "border-2 border-purple-400/60 bg-purple-900/40 text-purple-300"
    : "border-2 border-white/10 bg-white/5 text-slate-300";
  return (
    <div className={`rounded-full flex items-center justify-center font-semibold flex-shrink-0 ${sizeClass} ${ring} ${glow}`}>
      {init}
    </div>
  );
}

interface XPBarProps {
  prog: number;
}
function XPBar({ prog }: XPBarProps) {
  return (
    <div className="h-1.5 w-full rounded-full bg-white/[0.06] overflow-hidden">
      <div
        className="h-full rounded-full bg-gradient-to-r from-violet-500 to-purple-400 transition-all duration-700"
        style={{ width: `${prog}%` }}
      />
    </div>
  );
}

interface DeltaBadgeProps {
  delta: string;
  neg?: boolean;
}
function DeltaBadge({ delta, neg }: DeltaBadgeProps) {
  return (
    <span className={`inline-flex items-center gap-0.5 text-[11px] font-medium ${neg ? "text-red-400" : "text-emerald-400"}`}>
      {neg ? <TrendingDown size={11} /> : <TrendingUp size={11} />}
      {delta} XP
    </span>
  );
}

interface TabBarProps {
  active: Tab;
  onChange: (t: Tab) => void;
}
function TabBar({ active, onChange }: TabBarProps) {
  return (
    <div className="flex gap-1 bg-white/[0.04] border border-white/[0.08] rounded-xl p-1">
      {TABS.map((tab) => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            active === tab
              ? "bg-purple-600 text-white shadow-sm shadow-purple-900/60"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}

interface PodiumCardProps {
  player: Player;
  place: 1 | 2 | 3;
}
function PodiumCard({ player, place }: PodiumCardProps) {
  const m = MEDAL[place];
  const isFirst = place === 1;

  return (
    <div className={`flex flex-col items-center gap-2 group ${isFirst ? "order-2 sm:order-none" : ""}`}>
      {isFirst && <span className="text-2xl select-none">👑</span>}

      {/* Avatar */}
      <div className={`relative rounded-full p-[2px] ${m.bg} ${m.border} border transition-all duration-300 group-hover:scale-105 ${m.glow}`}>
        <div className={`rounded-full flex items-center justify-center font-bold ${m.text} ${isFirst ? "w-16 h-16 text-xl bg-white/[0.06]" : "w-13 h-13 text-base bg-white/[0.04]"}`}
          style={isFirst ? { width: 64, height: 64 } : { width: 52, height: 52 }}
        >
          {player.init}
        </div>
        <span className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full text-[11px] font-bold flex items-center justify-center ${m.badge}`}>
          {place}
        </span>
      </div>

      {/* Name & XP */}
      <div className="text-center">
        <p className={`text-[13px] font-semibold ${isFirst ? "text-slate-100" : "text-slate-300"}`}>
          {player.name.split(" ")[0]} {player.name.split(" ")[1]?.charAt(0)}.
        </p>
        <p className={`text-[11px] ${m.text}`}>{player.xp.toLocaleString()} XP</p>
      </div>

      {/* Podium block */}
      <div className={`w-20 ${m.barH} rounded-t-lg border ${m.border} ${m.bg} transition-all duration-300 group-hover:opacity-90`} />
    </div>
  );
}

interface MyRankCardProps {
  player: Player;
}
function MyRankCard({ player }: MyRankCardProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-purple-500/30 bg-gradient-to-br from-purple-900/30 via-violet-900/20 to-transparent p-5 shadow-lg shadow-purple-900/20 transition-all duration-300 hover:border-purple-400/50">
      {/* Decorative glow blob */}
      <div className="pointer-events-none absolute -top-6 -right-6 w-32 h-32 rounded-full bg-purple-600/20 blur-2xl" />

      <div className="flex items-center gap-4 relative z-10">
        {/* Rank badge */}
        <div className="flex flex-col items-center justify-center w-14 h-14 rounded-xl bg-purple-600/20 border border-purple-500/30 flex-shrink-0">
          <span className="text-xs text-purple-400 font-medium leading-none">Rank</span>
          <span className="text-2xl font-bold text-purple-300 leading-tight">#{player.rank}</span>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-sm font-semibold text-slate-100 truncate">{player.name}</span>
            <span className="text-[10px] font-medium bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-full px-2 py-px">you</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
            <Star size={11} className="text-purple-400" />
            Level {player.level}
          </div>
          <XPBar prog={player.prog} />
        </div>

        {/* Stats */}
        <div className="text-right flex-shrink-0">
          <div className="text-lg font-bold text-purple-300">{player.xp.toLocaleString()}</div>
          <div className="text-[10px] text-slate-500 mb-1">total XP</div>
          <DeltaBadge delta={player.delta} neg={player.neg} />
        </div>
      </div>
    </div>
  );
}

interface PlayerRowProps {
  player: Player;
}
function PlayerRow({ player }: PlayerRowProps) {
  const isTop3 = player.rank <= 3;
  const rankColor =
    player.rank === 1 ? "text-amber-400" :
    player.rank === 2 ? "text-slate-400" :
    player.rank === 3 ? "text-orange-400" :
    "text-slate-600";

  return (
    <div
      className={`flex items-center gap-3 rounded-xl px-3 py-3 mb-1 border transition-all duration-300 hover:scale-[1.01] cursor-default ${
        player.isMe
          ? "bg-purple-500/[0.08] border-purple-500/25 hover:border-purple-500/40"
          : "border-transparent bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/10"
      }`}
    >
      {/* Rank */}
      <div className={`w-7 flex-shrink-0 text-center text-sm font-bold ${rankColor}`}>
        {isTop3 ? (player.rank === 1 ? "🥇" : player.rank === 2 ? "🥈" : "🥉") : player.rank}
      </div>

      {/* Avatar */}
      <Avatar init={player.init} size="sm" highlight={!!player.isMe} />

      {/* Name + progress */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-0.5">
          <span className="text-sm font-medium text-slate-200 truncate">{player.name}</span>
          {player.isMe && (
            <span className="text-[9px] font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/25 rounded-full px-1.5 py-px leading-none flex-shrink-0">
              you
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5 mb-1.5">
          <Zap size={10} className="text-purple-400 flex-shrink-0" />
          <span className="text-[11px] text-slate-500">Level {player.level}</span>
        </div>
        <XPBar prog={player.prog} />
      </div>

      {/* XP + delta */}
      <div className="flex-shrink-0 text-right min-w-[70px]">
        <div className="text-sm font-semibold text-slate-100">{player.xp.toLocaleString()}</div>
        <div className="text-[10px] text-slate-600 mb-0.5">XP</div>
        <DeltaBadge delta={player.delta} neg={player.neg} />
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────
export default function Leaderboard() {
  const [activeTab, setActiveTab] = useState<Tab>("This Week");

  // Future-ready: swap PLAYERS with state from API
  const players = PLAYERS;

  const first  = players.find((p) => p.rank === 1)!;
  const second = players.find((p) => p.rank === 2)!;
  const third  = players.find((p) => p.rank === 3)!;
  const me     = players.find((p) => p.isMe);

  return (
    <div className="min-h-screen px-6 py-10">
      <div className="max-w-6xl mx-auto space-y-10">

        {/* ── Header ── */}
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center flex-shrink-0">
              <Trophy size={18} className="text-purple-400" />
            </div>
            <h1 className="text-2xl font-bold text-slate-100 tracking-tight">Leaderboard</h1>
          </div>
          <p className="text-sm text-slate-500 pl-12">Compete with learners and climb the rankings.</p>
        </div>

        {/* ── Tabs ── */}
        <TabBar active={activeTab} onChange={setActiveTab} />

        {/* ── Podium ── */}
        <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-8">
          <p className="text-xs uppercase tracking-widest text-slate-600 mb-8 text-center font-medium">Top Performers</p>
          <div className="flex items-end justify-center gap-4 sm:gap-8 flex-wrap sm:flex-nowrap">
            <PodiumCard player={second} place={2} />
            <PodiumCard player={first}  place={1} />
            <PodiumCard player={third}  place={3} />
          </div>
        </div>

        {/* ── Your Rank ── */}
        {me && (
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-widest text-slate-600 font-medium">Your Standing</p>
            <MyRankCard player={me} />
          </div>
        )}

        {/* ── Full Rankings ── */}
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-widest text-slate-600 font-medium">All Rankings</p>
          <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-4 space-y-0.5">
            {players.map((p) => (
              <PlayerRow key={p.rank} player={p} />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}