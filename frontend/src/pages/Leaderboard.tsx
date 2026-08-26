import React, { useState } from "react";
import { Trophy, TrendingUp, TrendingDown, Star, Award, Medal, Users } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

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

const PLAYERS: Player[] = [
  { rank: 1, init: "AJ", name: "Arjun Joshi", level: 15, xp: 6820, delta: "+580", prog: 92 },
  { rank: 2, init: "RK", name: "Ravi Kumar", level: 14, xp: 5210, delta: "+410", prog: 78 },
  { rank: 3, init: "PS", name: "Priya Sharma", level: 13, xp: 4980, delta: "+390", prog: 74 },
  { rank: 4, init: "DM", name: "Deepa Menon", level: 13, xp: 4760, delta: "+310", prog: 70 },
  { rank: 5, init: "SR", name: "Sneha Rao", level: 12, xp: 4640, delta: "+280", prog: 66 },
  { rank: 6, init: "KV", name: "Karthik V.", level: 12, xp: 4590, delta: "+215", prog: 64 },
  { rank: 7, init: "H", name: "Harini", level: 12, xp: 4500, delta: "+320", prog: 62, isMe: true },
  { rank: 8, init: "AN", name: "Aditi Nair", level: 11, xp: 4310, delta: "+190", prog: 58 },
  { rank: 9, init: "VB", name: "Vikram B.", level: 11, xp: 4100, delta: "-40", prog: 54, neg: true },
  { rank: 10, init: "MK", name: "Meera K.", level: 10, xp: 3870, delta: "+120", prog: 48 },
];

const TABS: Tab[] = ["This Week", "This Month", "All Time"];

export default function Leaderboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("This Week");

  const top3 = [PLAYERS[1], PLAYERS[0], PLAYERS[2]]; // 2nd, 1st, 3rd

  return (
    <div className="space-y-6 font-sans text-foreground max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-border">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-teal-600 dark:text-teal-400 mb-1">
            <Trophy className="w-4 h-4" />
            <span>Campus Leaderboard</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Student Rankings
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Rankings based on problems solved, mock interview consistency, and daily streaks.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex gap-1 bg-secondary border border-border rounded-lg p-1 self-start sm:self-auto">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                activeTab === tab
                  ? "bg-teal-600 text-white shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Top 3 Podium Cards */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4 items-end pt-2">
        {/* 2nd Place */}
        <div className="p-4 rounded-xl border border-border bg-card shadow-sm text-center space-y-2 flex flex-col items-center">
          <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center justify-center">
            2
          </div>
          <div className="w-12 h-12 rounded-full border border-border bg-secondary text-foreground flex items-center justify-center font-bold text-sm">
            {top3[0].init}
          </div>
          <div className="truncate w-full">
            <p className="text-xs font-bold text-foreground truncate">{top3[0].name}</p>
            <p className="text-[11px] font-mono text-muted-foreground">{top3[0].xp} XP</p>
          </div>
        </div>

        {/* 1st Place */}
        <div className="p-5 rounded-xl border-2 border-teal-500/40 bg-card shadow-sm text-center space-y-2 flex flex-col items-center relative -translate-y-2">
          <div className="w-7 h-7 rounded-full bg-amber-500 text-white text-xs font-bold flex items-center justify-center shadow-sm">
            1
          </div>
          <div className="w-14 h-14 rounded-full border-2 border-teal-500 bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold text-base">
            {top3[1].init}
          </div>
          <div className="truncate w-full">
            <p className="text-sm font-bold text-foreground truncate">{top3[1].name}</p>
            <p className="text-xs font-mono font-bold text-teal-600 dark:text-teal-400">{top3[1].xp} XP</p>
          </div>
        </div>

        {/* 3rd Place */}
        <div className="p-4 rounded-xl border border-border bg-card shadow-sm text-center space-y-2 flex flex-col items-center">
          <div className="w-6 h-6 rounded-full bg-amber-700/20 text-amber-600 dark:text-amber-400 text-xs font-bold flex items-center justify-center">
            3
          </div>
          <div className="w-12 h-12 rounded-full border border-border bg-secondary text-foreground flex items-center justify-center font-bold text-sm">
            {top3[2].init}
          </div>
          <div className="truncate w-full">
            <p className="text-xs font-bold text-foreground truncate">{top3[2].name}</p>
            <p className="text-[11px] font-mono text-muted-foreground">{top3[2].xp} XP</p>
          </div>
        </div>
      </div>

      {/* Rankings List Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
        <div className="grid grid-cols-12 px-5 py-3 border-b border-border bg-secondary/40 text-[11px] font-bold text-muted-foreground uppercase tracking-wider select-none">
          <div className="col-span-2 sm:col-span-1 text-center">Rank</div>
          <div className="col-span-6 sm:col-span-6">Student</div>
          <div className="hidden sm:block sm:col-span-2 text-center">Consistency</div>
          <div className="col-span-4 sm:col-span-3 text-right">Points / XP</div>
        </div>

        <div className="divide-y divide-border/60">
          {PLAYERS.map((player) => (
            <div
              key={player.rank}
              className={`grid grid-cols-12 px-5 py-3.5 items-center transition-colors text-xs ${
                player.isMe
                  ? "bg-teal-500/10 border-l-4 border-l-teal-500"
                  : "hover:bg-secondary/40"
              }`}
            >
              {/* Rank */}
              <div className="col-span-2 sm:col-span-1 text-center font-bold font-mono text-foreground">
                #{player.rank}
              </div>

              {/* Student */}
              <div className="col-span-6 sm:col-span-6 flex items-center gap-3 truncate">
                <div className="w-8 h-8 rounded-full bg-secondary border border-border flex items-center justify-center font-bold text-xs flex-shrink-0">
                  {player.init}
                </div>
                <div className="truncate">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-foreground truncate">{player.name}</span>
                    {player.isMe && (
                      <span className="px-1.5 py-0.2 rounded bg-teal-500/20 text-teal-700 dark:text-teal-300 text-[10px] font-bold">
                        YOU
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-muted-foreground">Level {player.level}</span>
                </div>
              </div>

              {/* Consistency Bar */}
              <div className="hidden sm:block sm:col-span-2 px-2">
                <div className="w-full bg-secondary rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-teal-600 dark:bg-teal-500 h-1.5 rounded-full"
                    style={{ width: `${player.prog}%` }}
                  />
                </div>
              </div>

              {/* Points */}
              <div className="col-span-4 sm:col-span-3 text-right">
                <span className="font-mono font-bold text-foreground text-sm">{player.xp}</span>
                <span className="text-muted-foreground text-[11px] ml-1">XP</span>
                <div className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                  {player.delta} this week
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}