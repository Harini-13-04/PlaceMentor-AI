import { useState } from "react";
import {
  Lock,
  Play,
  Crown,
  Zap,
  Coins,
  X,
  ChevronLeft,
  Sparkles,
  Award,
  Clock,
  Flame,
  CheckCircle2,
} from "lucide-react";

/* ── Kingdom + mission definitions ────────────────────────── */
const KINGDOMS = [
  {
    id: "dsa",
    emoji: "🏰",
    name: "DSA Kingdom",
    mission: "Conquer Arrays & Recursion",
    from: "from-purple-600",
    to: "to-violet-600",
    glow: "rgba(139,92,246,0.5)",
    missions: ["Arrays Explorer", "Strings Warrior", "Stack Defender", "Queue Runner", "Trees Guardian", "Graph Adventurer", "Arrays Conqueror"],
  },
  {
    id: "sql",
    emoji: "🏙",
    name: "SQL City",
    mission: "Master Joins & Queries",
    from: "from-blue-600",
    to: "to-cyan-600",
    glow: "rgba(59,130,246,0.5)",
    missions: ["SQL Basics", "SELECT Commander", "WHERE Hunter", "JOIN Architect", "Aggregation Master", "Window Wizard", "Database Champion"],
  },
  {
    id: "java",
    emoji: "🌋",
    name: "Java Valley",
    mission: "Forge OOP Mastery",
    from: "from-orange-600",
    to: "to-red-600",
    glow: "rgba(249,115,22,0.5)",
    missions: ["Java Basics", "OOP Explorer", "Collections Master", "Exception Guardian", "Multithreading Warrior", "Spring Starter", "Java Champion"],
  },
  {
    id: "web",
    emoji: "🌐",
    name: "WebVerse",
    mission: "Build the Modern Web",
    from: "from-teal-600",
    to: "to-emerald-600",
    glow: "rgba(20,184,166,0.5)",
    missions: ["HTML Voyager", "CSS Stylist", "JS Pathfinder", "React Builder", "API Connector", "Performance Tuner", "Web Champion"],
  },
  {
    id: "apt",
    emoji: "🧠",
    name: "Aptitude Peak",
    mission: "Sharpen Logic & Speed",
    from: "from-amber-500",
    to: "to-yellow-600",
    glow: "rgba(245,158,11,0.5)",
    missions: ["Number Climber", "Logic Scout", "Puzzle Hunter", "Probability Ranger", "Time & Work Master", "Data Interpreter", "Aptitude Champion"],
  },
  {
    id: "hr",
    emoji: "🎤",
    name: "HR Realm",
    mission: "Speak with Confidence",
    from: "from-pink-600",
    to: "to-rose-600",
    glow: "rgba(236,72,153,0.5)",
    missions: ["Intro Builder", "Strength Storyteller", "Behavioral Speaker", "Salary Negotiator", "Mock Interviewer", "Body Language Pro", "HR Champion"],
  },
];

const MISSIONS_PER_KINGDOM = 7; // 6 missions + 1 boss

function missionMeta(n: number) {
  const isBoss = n === MISSIONS_PER_KINGDOM;
  const difficulty = n <= 2 ? "Easy" : n <= 4 ? "Medium" : "Hard";
  return {
    isBoss,
    difficulty: isBoss ? "Boss" : difficulty,
    time: isBoss ? "30 min" : `${10 + n * 3} min`,
    xp: isBoss ? 500 : 60 + n * 20,
    coins: isBoss ? 100 : 10 + n * 5,
  };
}

export default function Practice() {
  const [progress, setProgress] = useState<Record<string, number>>(
    Object.fromEntries(KINGDOMS.map((k) => [k.id, 0]))
  );
  const [activeKingdom, setActiveKingdom] = useState<string | null>(null);
  const [streak, setStreak] = useState(4);
  const [celebration, setCelebration] = useState<{ kingdomId: string; level: number } | null>(null);

  function playMission(kingdomId: string, level: number) {
    setCelebration({ kingdomId, level });
  }

  function closeCelebration() {
    if (!celebration) return;
    setProgress((p) => ({
      ...p,
      [celebration.kingdomId]: Math.max(p[celebration.kingdomId], celebration.level),
    }));
    setStreak((s) => s + 1);
    setCelebration(null);
  }

  const kingdom = KINGDOMS.find((k) => k.id === activeKingdom) ?? null;

  /* ─────────────────────────────────────────────────────────
     Kingdom details — mission path
     ───────────────────────────────────────────────────────── */
  if (kingdom) {
    const cleared = progress[kingdom.id];
    return (
      <div className="space-y-8">
        <div className="flex items-center gap-4 w-[90%] mx-auto">
          <button
            onClick={() => setActiveKingdom(null)}
            className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:bg-white/10 hover:text-white transition-colors shrink-0"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${kingdom.from} ${kingdom.to} flex items-center justify-center text-2xl shrink-0 shadow-lg`}>
            {kingdom.emoji}
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold text-white tracking-tight">{kingdom.name}</h1>
            <p className="text-sm text-muted-foreground">{kingdom.mission}</p>
          </div>
        </div>

        <div className="flex flex-col gap-5 w-[90%] mx-auto">
          {Array.from({ length: MISSIONS_PER_KINGDOM }, (_, i) => i + 1).map((n) => {
            const { isBoss, difficulty, time, xp, coins } = missionMeta(n);
            const name = kingdom.missions[n - 1];
            const unlocked = n <= cleared + 1;
            const done = n <= cleared;

            return (
              <div
                key={n}
                className={`relative rounded-3xl border flex items-center justify-between gap-6 transition-all duration-300 overflow-hidden ${
                  isBoss ? "p-8 md:p-10 min-h-[170px]" : "p-6 md:p-8 min-h-[140px]"
                } ${
                  unlocked
                    ? isBoss
                      ? "border-amber-400/50 bg-white/5 backdrop-blur-xl shadow-[0_0_50px_-12px_rgba(245,158,11,0.45)]"
                      : "border-white/10 bg-white/5 backdrop-blur-xl hover:border-white/20"
                    : "border-white/5 bg-white/[0.03] backdrop-blur-md opacity-60"
                }`}
              >
                {isBoss && (
                  <div
                    className="pointer-events-none absolute inset-0 opacity-70"
                    style={{ background: "radial-gradient(70% 70% at 100% 0%, rgba(245,158,11,0.18), transparent 70%)" }}
                  />
                )}

                <div className="relative flex items-center gap-5 md:gap-6 min-w-0">
                  <div
                    className={`flex items-center justify-center shrink-0 rounded-2xl ${
                      isBoss ? "w-16 h-16 md:w-20 md:h-20" : "w-14 h-14"
                    } ${
                      done
                        ? `bg-gradient-to-br ${kingdom.from} ${kingdom.to} text-white`
                        : unlocked
                        ? isBoss
                          ? "bg-gradient-to-br from-amber-500 to-yellow-600 text-white"
                          : "bg-white/10 text-white"
                        : "bg-white/5 text-muted-foreground"
                    }`}
                  >
                    {done ? (
                      <CheckCircle2 className={isBoss ? "w-8 h-8" : "w-6 h-6"} />
                    ) : unlocked ? (
                      isBoss ? <Crown className="w-7 h-7 md:w-9 md:h-9" /> : <span className="text-base font-bold">{n}</span>
                    ) : (
                      <Lock className="w-4 h-4" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h3 className={`font-semibold truncate ${isBoss ? "text-xl md:text-2xl" : "text-base"} ${unlocked ? "text-white" : "text-white/60"}`}>
                        {isBoss ? `👑 ${name}` : name}
                      </h3>
                      {isBoss && (
                        <span className="text-[10px] font-semibold px-2.5 py-1 rounded-md border text-amber-300 border-amber-400/40 bg-amber-400/15 shrink-0">
                          BOSS
                        </span>
                      )}
                      {done && (
                        <span className="text-[10px] font-semibold px-2.5 py-1 rounded-md border text-success border-success/30 bg-success/10 shrink-0">
                          ✅ Completed
                        </span>
                      )}
                    </div>

                    <p className={`mt-1.5 text-xs ${unlocked ? "text-muted-foreground" : "text-muted-foreground/70"} max-w-md truncate`}>
                      {unlocked ? `${difficulty} mission · ${kingdom.name}` : "Complete previous mission to unlock"}
                    </p>

                    <div className="flex items-center gap-2 mt-3 flex-wrap">
                      <span className={`text-[11px] font-medium px-2 py-0.5 rounded-md border ${
                        difficulty === "Easy" ? "text-success border-success/20 bg-success/10" :
                        difficulty === "Medium" ? "text-orange-400 border-orange-400/20 bg-orange-400/10" :
                        difficulty === "Boss" ? "text-amber-300 border-amber-400/30 bg-amber-400/10" :
                        "text-red-400 border-red-400/20 bg-red-400/10"
                      }`}>
                        {difficulty}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground bg-white/5 px-2.5 py-0.5 rounded-md">
                        <Clock className="w-3 h-3" /> {time}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground bg-white/5 px-2.5 py-0.5 rounded-md">
                        <Zap className="w-3 h-3 text-purple-300" /> {xp} XP
                      </span>
                      <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground bg-white/5 px-2.5 py-0.5 rounded-md">
                        <Coins className="w-3 h-3 text-amber-300" /> {coins} Coins
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  disabled={!unlocked}
                  onClick={() => playMission(kingdom.id, n)}
                  className={`relative flex items-center justify-center shrink-0 rounded-2xl transition-all duration-200 ${
                    isBoss ? "w-16 h-16 md:w-20 md:h-20" : "w-12 h-12"
                  } ${
                    unlocked
                      ? isBoss
                        ? "bg-gradient-to-br from-amber-500 to-yellow-600 text-white shadow-[0_0_30px_-6px_rgba(245,158,11,0.7)] hover:scale-105"
                        : `bg-gradient-to-br ${kingdom.from} ${kingdom.to} text-white shadow-md hover:scale-105`
                      : "bg-white/5 text-muted-foreground cursor-not-allowed"
                  }`}
                >
                  {unlocked ? <Play className={isBoss ? "w-7 h-7 ml-0.5" : "w-5 h-5 ml-0.5"} /> : <Lock className="w-5 h-5" />}
                </button>
              </div>
            );
          })}
        </div>

        {celebration && celebration.kingdomId === kingdom.id && (
          <CelebrationModal
            name={kingdom.missions[celebration.level - 1]}
            meta={missionMeta(celebration.level)}
            streak={streak + 1}
            hasNext={celebration.level < MISSIONS_PER_KINGDOM}
            nextName={celebration.level < MISSIONS_PER_KINGDOM ? kingdom.missions[celebration.level] : undefined}
            onContinue={closeCelebration}
          />
        )}
      </div>
    );
  }

  /* ─────────────────────────────────────────────────────────
     Map view — all kingdoms always accessible
     ───────────────────────────────────────────────────────── */
  const totalCleared = KINGDOMS.reduce((sum, k) => sum + progress[k.id], 0);
  const totalMissions = KINGDOMS.length * MISSIONS_PER_KINGDOM;

  return (
    <div className="space-y-12">
      <div className="text-center space-y-3">
        <h1 className="text-4xl md:text-5xl font-display font-bold text-white tracking-tight">Interview Arena</h1>
        <p className="text-lg text-muted-foreground">Complete missions. Unlock kingdoms. Master placements.</p>
      </div>

      <div className="relative w-[88%] max-w-7xl mx-auto">
        {/* glowing connecting path */}
        <div className="absolute left-1/2 top-0 bottom-0 w-[3px] -translate-x-1/2 bg-white/5 rounded-full overflow-hidden">
          <div
            className="w-full rounded-full bg-gradient-to-b from-purple-500 via-blue-500 to-purple-500 transition-all duration-700"
            style={{
              height: `${Math.max((totalCleared / totalMissions) * 100, 6)}%`,
              boxShadow: "0 0 16px 2px rgba(139,92,246,0.6)",
            }}
          />
        </div>

        <div className="relative flex flex-col gap-8">
          {KINGDOMS.map((k) => {
            const cleared = progress[k.id];
            const pct = Math.round((cleared / MISSIONS_PER_KINGDOM) * 100);

            return (
              <div key={k.id} className="relative flex items-center gap-5">
                <div
                  className="absolute left-1/2 -translate-x-1/2 -top-2 w-4 h-4 rounded-full border-2 bg-purple-400 border-purple-300 z-10"
                  style={{ boxShadow: "0 0 14px 3px rgba(139,92,246,0.7)" }}
                />

                <div className="relative w-full rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl p-8 md:p-10 overflow-hidden transition-all duration-500 hover:border-white/20">
                  <div
                    className="pointer-events-none absolute inset-0 opacity-50"
                    style={{ background: `radial-gradient(55% 55% at 15% 0%, ${k.glow}, transparent 70%)` }}
                  />

                  <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-6 min-w-0 flex-1">
                      <div className={`w-20 h-20 rounded-2xl flex items-center justify-center text-4xl shrink-0 shadow-lg bg-gradient-to-br ${k.from} ${k.to}`}>
                        {k.emoji}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="text-xl font-semibold text-white truncate">{k.name}</h3>
                        <p className="text-sm text-muted-foreground mb-4 truncate">{k.mission}</p>

                        <div className="h-1.5 w-full max-w-md rounded-full bg-white/[0.07] mb-4">
                          <div
                            className={`h-full rounded-full bg-gradient-to-r ${k.from} ${k.to} transition-all duration-500`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground bg-white/5 px-2.5 py-1 rounded-md">
                            <Zap className="w-3.5 h-3.5 text-purple-300" /> {missionMeta(1).xp} XP
                          </span>
                          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground bg-white/5 px-2.5 py-1 rounded-md">
                            <Coins className="w-3.5 h-3.5 text-amber-300" /> {missionMeta(1).coins} Coins
                          </span>
                          <span className="text-xs text-muted-foreground bg-white/5 px-2.5 py-1 rounded-md">
                            ✅ {cleared}/{MISSIONS_PER_KINGDOM} Cleared
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex md:flex-col items-center md:items-end justify-end gap-3 shrink-0 md:pl-6">
                      <button
                        onClick={() => setActiveKingdom(k.id)}
                        className={`shrink-0 rounded-xl bg-gradient-to-r ${k.from} ${k.to} px-7 py-3.5 text-sm font-semibold text-white shadow-md hover:scale-[1.03] active:scale-[0.98] transition-all duration-200`}
                      >
                        Enter Kingdom
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ── Mission complete celebration ─────────────────────────── */
function CelebrationModal({
  name,
  meta,
  streak,
  hasNext,
  nextName,
  onContinue,
}: {
  name: string;
  meta: ReturnType<typeof missionMeta>;
  streak: number;
  hasNext: boolean;
  nextName?: string;
  onContinue: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-sm px-6">
      <div className="relative w-full max-w-sm rounded-3xl border border-white/10 bg-[#0b0d14]/95 backdrop-blur-2xl p-8 text-center overflow-hidden shadow-[0_25px_100px_rgba(0,0,0,0.75)]">
        <div
          className="pointer-events-none absolute -inset-10 opacity-70 blur-3xl"
          style={{
            background:
              "radial-gradient(50% 50% at 25% 10%, rgba(168,85,247,0.45), transparent 70%), radial-gradient(50% 50% at 85% 90%, rgba(245,158,11,0.3), transparent 70%)",
          }}
        />
        <button
          onClick={onContinue}
          className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="relative flex flex-col items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-amber-400 flex items-center justify-center shadow-lg animate-pulse">
            {meta.isBoss ? <Crown className="w-8 h-8 text-white" /> : <Sparkles className="w-8 h-8 text-white" />}
          </div>

          <div>
            <p className="text-xl font-bold text-white mb-1">✨ Mission Complete</p>
            <p className="text-xs text-muted-foreground">{name}</p>
          </div>

          {meta.isBoss && (
            <div className="w-full flex items-center justify-center gap-2 rounded-2xl border border-amber-400/20 bg-amber-400/10 px-4 py-3">
              <Award className="w-4 h-4 text-amber-300" />
              <span className="text-xs font-semibold text-amber-300">🏅 Badge Unlocked</span>
            </div>
          )}

          <div className="w-full grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] py-3.5">
              <p className="text-lg font-bold text-purple-300">+{meta.xp} XP</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">Earned</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] py-3.5">
              <p className="text-lg font-bold text-amber-300">+{meta.coins} Coins</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">Earned</p>
            </div>
          </div>

          <div className="w-full flex items-center justify-between rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 py-3">
            <span className="inline-flex items-center gap-1.5 text-xs text-orange-300 font-medium">
              <Flame className="w-3.5 h-3.5" /> Streak maintained
            </span>
            <span className="text-xs font-bold text-white">{streak} days</span>
          </div>

          {hasNext && <p className="text-xs text-muted-foreground">🔓 {nextName} unlocked</p>}

          <button
            onClick={onContinue}
            className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-[0_0_24px_-6px_rgba(139,92,246,0.6)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}