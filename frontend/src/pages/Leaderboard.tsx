import { useState } from "react";
import { Trophy, TrendingUp, TrendingDown, Star, Sparkles, Filter } from "lucide-react";

type Tab = "This Week" | "This Month" | "All Time";

interface Candidate {
  rank: number;
  initials: string;
  name: string;
  department: string;
  level: number;
  xp: number;
  delta: string;
  problemsSolved: number;
  isMe?: boolean;
}

const CANDIDATES: Candidate[] = [
  { rank: 1, initials: "AJ", name: "Arjun Joshi", department: "CSE '26", level: 15, xp: 6820, delta: "+580", problemsSolved: 94 },
  { rank: 2, initials: "RK", name: "Ravi Kumar", department: "IT '26", level: 14, xp: 5210, delta: "+410", problemsSolved: 82 },
  { rank: 3, initials: "PS", name: "Priya Sharma", department: "CSE '26", level: 13, xp: 4980, delta: "+390", problemsSolved: 76 },
  { rank: 4, initials: "H", name: "Harini Muthuvel", department: "CSE '26", level: 12, xp: 4500, delta: "+320", problemsSolved: 68, isMe: true },
  { rank: 5, initials: "DM", name: "Deepa Menon", department: "ECE '26", level: 12, xp: 4460, delta: "+310", problemsSolved: 65 },
  { rank: 6, initials: "SR", name: "Sneha Rao", department: "IT '26", level: 12, xp: 4410, delta: "+280", problemsSolved: 62 },
  { rank: 7, initials: "KV", name: "Karthik V.", department: "CSE '26", level: 11, xp: 4290, delta: "+215", problemsSolved: 58 },
  { rank: 8, initials: "AN", name: "Aditi Nair", department: "CSE '26", level: 11, xp: 4110, delta: "+190", problemsSolved: 54 },
  { rank: 9, initials: "VB", name: "Vikram B.", department: "IT '26", level: 10, xp: 3950, delta: "+140", problemsSolved: 50 },
  { rank: 10, initials: "MK", name: "Meera K.", department: "ECE '26", level: 10, xp: 3870, delta: "+120", problemsSolved: 48 },
];

export default function Leaderboard() {
  const [tab, setTab] = useState<Tab>("This Week");

  return (
    <div className="space-y-6 font-sans text-foreground">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-1">
          Campus Placement Leaderboard
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Recognizing consistent problem solving, mock assessment performance, and interview milestone clearances.
        </p>
      </div>

      {/* Podium for Top 3 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* 2nd Place */}
        <div className="p-5 rounded-xl border border-border bg-card shadow-sm text-center flex flex-col justify-between order-2 sm:order-1">
          <div className="space-y-2">
            <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20">
              #2 Rank
            </span>
            <div className="w-12 h-12 rounded-full bg-secondary border border-border flex items-center justify-center font-bold text-sm mx-auto">
              {CANDIDATES[1].initials}
            </div>
            <h3 className="text-xs font-bold text-foreground">{CANDIDATES[1].name}</h3>
            <p className="text-[11px] text-muted-foreground">{CANDIDATES[1].department}</p>
          </div>
          <div className="pt-3 border-t border-border mt-3 text-xs font-mono font-semibold text-foreground">
            {CANDIDATES[1].xp} XP &middot; {CANDIDATES[1].problemsSolved} Solved
          </div>
        </div>

        {/* 1st Place */}
        <div className="p-6 rounded-xl border-2 border-teal-500/40 bg-card shadow-sm text-center flex flex-col justify-between order-1 sm:order-2 relative overflow-hidden">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-bold bg-teal-500/15 text-teal-600 dark:text-teal-400 border border-teal-500/30">
              <Trophy className="w-3 h-3 text-amber-500" /> #1 Rank
            </span>
            <div className="w-14 h-14 rounded-full bg-teal-500/10 border-2 border-teal-500/40 flex items-center justify-center font-bold text-base text-teal-600 dark:text-teal-400 mx-auto">
              {CANDIDATES[0].initials}
            </div>
            <h3 className="text-sm font-bold text-foreground">{CANDIDATES[0].name}</h3>
            <p className="text-xs text-muted-foreground">{CANDIDATES[0].department}</p>
          </div>
          <div className="pt-3 border-t border-border mt-3 text-xs font-mono font-bold text-teal-600 dark:text-teal-400">
            {CANDIDATES[0].xp} XP &middot; {CANDIDATES[0].problemsSolved} Solved
          </div>
        </div>

        {/* 3rd Place */}
        <div className="p-5 rounded-xl border border-border bg-card shadow-sm text-center flex flex-col justify-between order-3">
          <div className="space-y-2">
            <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              #3 Rank
            </span>
            <div className="w-12 h-12 rounded-full bg-secondary border border-border flex items-center justify-center font-bold text-sm mx-auto">
              {CANDIDATES[2].initials}
            </div>
            <h3 className="text-xs font-bold text-foreground">{CANDIDATES[2].name}</h3>
            <p className="text-[11px] text-muted-foreground">{CANDIDATES[2].department}</p>
          </div>
          <div className="pt-3 border-t border-border mt-3 text-xs font-mono font-semibold text-foreground">
            {CANDIDATES[2].xp} XP &middot; {CANDIDATES[2].problemsSolved} Solved
          </div>
        </div>
      </div>

      {/* Tabs & Table */}
      <div className="p-5 rounded-2xl border border-border bg-card shadow-sm space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex gap-1 p-1 bg-secondary rounded-lg border border-border">
            {(["This Week", "This Month", "All Time"] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                  tab === t
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <span className="text-xs text-muted-foreground font-mono">
            College Batch: SRM 2026 SDE Track
          </span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="py-2.5 px-3 font-semibold w-16">Rank</th>
                <th className="py-2.5 px-3 font-semibold">Candidate</th>
                <th className="py-2.5 px-3 font-semibold">Department</th>
                <th className="py-2.5 px-3 font-semibold text-right">Problems</th>
                <th className="py-2.5 px-3 font-semibold text-right">Experience</th>
                <th className="py-2.5 px-3 font-semibold text-right">Weekly Gain</th>
              </tr>
            </thead>
            <tbody>
              {CANDIDATES.map((c) => (
                <tr
                  key={c.rank}
                  className={`border-b border-border/60 transition-colors ${
                    c.isMe
                      ? "bg-teal-500/10 font-medium"
                      : "hover:bg-secondary/40"
                  }`}
                >
                  <td className="py-3 px-3 font-mono font-bold">
                    {c.rank === 1 ? "🥇 1" : c.rank === 2 ? "🥈 2" : c.rank === 3 ? "🥉 3" : `#${c.rank}`}
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-foreground">{c.name}</span>
                      {c.isMe && (
                        <span className="px-1.5 py-0.2 rounded bg-teal-500/20 text-teal-600 dark:text-teal-400 text-[10px] font-bold">
                          You
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-3 text-muted-foreground">{c.department}</td>
                  <td className="py-3 px-3 text-right font-mono text-foreground">{c.problemsSolved}</td>
                  <td className="py-3 px-3 text-right font-mono font-semibold text-foreground">{c.xp} XP</td>
                  <td className="py-3 px-3 text-right font-mono text-emerald-600 dark:text-emerald-400 font-semibold">{c.delta}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}