import { Card } from "@/components/ui/card";
import {
  Target,
  Flame,
  Sparkles,
  Activity,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function Home() {
  return (
    <div className="space-y-8">

      {/* ── Hero ── */}
      <section className="space-y-4 pt-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-2 backdrop-blur-md">
          <Sparkles className="w-4 h-4" />
          <span>Today's Founder Insight</span>
        </div>

        <h1 className="text-5xl md:text-6xl font-display font-bold text-white tracking-tight leading-tight">
          ✨ Welcome Back,
          <br />
          <span className="text-gradient">Harini</span>
        </h1>

        <p className="text-xl text-muted-foreground max-w-2xl mt-4">
          Your future self is waiting. Let's build it today.
        </p>
      </section>

      {/* ── Daily Quote ── */}
      <Card className="glass-card float-card p-6 border-primary/20 hover:border-primary/40 transition-all duration-300 shadow-[0_0_45px_rgba(139,92,246,0.35)]">
        <div className="flex items-center gap-3 mb-4">
          <Sparkles className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-white">
            🚀 Today's Founder Insight
          </h3>
        </div>

        <p className="text-lg text-white leading-relaxed">
          "Your future is created by what you do today, not tomorrow."
        </p>

        <p className="text-sm text-muted-foreground mt-4">
          — Daily Inspiration
        </p>
      </Card>

      {/* ── Quick Stats ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">

        {/* Today's Goal / Growth Journey */}
        <Card className="glass-card p-6 border-white/5 hover:border-primary/30 transition-colors group">
          <div className="flex items-start justify-between mb-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                📈 Growth Journey
              </p>
              <div className="flex items-baseline gap-1">
                <p className="text-4xl font-display font-bold text-white">
                  84%
                </p>
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-success/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Target className="w-6 h-6 text-success" />
            </div>
          </div>
          <Progress value={84} className="h-2 bg-white/5 [&>div]:bg-success" />
          <p className="text-xs text-muted-foreground mt-4">
            You're progressing consistently towards your career goals.
          </p>
        </Card>

        {/* Streak */}
        <Card className="glass-card p-6 border-white/5 hover:border-orange-500/30 transition-colors group shadow-[0_0_30px_rgba(249,115,22,0.25)]">
          <div className="flex items-start justify-between mb-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                Current Streak
              </p>
              <div className="flex items-baseline gap-1">
                <p className="text-4xl font-display font-bold text-white">12</p>
                <span className="text-lg text-muted-foreground">Days</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Flame className="w-6 h-6 text-orange-500" />
            </div>
          </div>
          <div className="flex gap-2 mt-5">
            {[1, 1, 1, 1, 0, 0, 0].map((active, i) => (
              <div
                key={i}
                className={`h-2 flex-1 rounded-full transition-colors ${active ? "bg-orange-500" : "bg-white/10"}`}
              />
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            Consistency creates confidence.
          </p>
        </Card>

        {/* Achievement Rank */}
        <Card className="glass-card float-card-slow p-6 border-white/5 hover:border-primary/30 transition-colors group lg:col-span-1 md:col-span-2 shadow-[0_0_40px_rgba(34,211,238,0.25)]">
          <div className="flex items-start justify-between mb-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                🏆 Achievement Rank
              </p>
              <p className="text-4xl font-display font-bold text-gradient">
                Code Warrior
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Activity className="w-6 h-6 text-primary" />
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-4 leading-relaxed">
            Top 15% among active learners. Keep growing and unlock new
            achievements.
          </p>
        </Card>

      </div>

    </div>
  );
}