import { Card } from "@/components/ui/card";
import {
  Target,
  Flame,
  TrendingUp,
  Sparkles,
  Activity,
  Clock,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function Home() {
  return (
    <div className="space-y-8">
      {/* Hero */}
      {/* Hero */}
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
      {/* Widgets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
        <Card className="glass-card p-6 border-white/5 hover:border-primary/30 transition-colors group">
          <div className="flex items-start justify-between mb-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                {" "}
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-card p-6 border-white/5">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-display font-semibold text-xl text-white">
              AI Recommendations
            </h3>
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary" />
            </div>
          </div>
          <div className="space-y-3">
            {[
              {
                title: "Review Graph Algorithms",
                desc: "You struggled with Dijkstra in your last mock.",
                time: "45 mins",
                type: "coding",
              },
              {
                title: "Behavioral Interview Prep",
                desc: "Focus on 'Tell me about a time you failed.'",
                time: "20 mins",
                type: "comm",
              },
              {
                title: "Update Resume Highlights",
                desc: "Add your recent React project to boost ATS score.",
                time: "15 mins",
                type: "resume",
              },
            ].map((rec, i) => (
              <div
                key={i}
                className="flex gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer border border-white/5 group"
              >
                <div className="w-10 h-10 rounded-full bg-background border border-white/10 flex items-center justify-center shrink-0 group-hover:border-primary/30 transition-colors">
                  <Sparkles className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">{rec.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {rec.desc}
                  </p>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground whitespace-nowrap">
                  <Clock className="w-3.5 h-3.5" />
                  {rec.time}
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="glass-card p-6 border-white/5">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-display font-semibold text-xl text-white">
              Recent Activities
            </h3>
            <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
              <Activity className="w-4 h-4 text-accent" />
            </div>
          </div>
          <div className="space-y-6 pl-2 mt-2">
            {[
              {
                title: "Completed Mock Interview",
                detail: "Scored 8.5/10 overall",
                date: "Today, 2:30 PM",
                active: true,
              },
              {
                title: "Solved 'Two Sum'",
                detail: "Arrays • Easy",
                date: "Yesterday",
                active: false,
              },
              {
                title: "Updated Profile Skills",
                detail: "Added React, Node.js",
                date: "2 days ago",
                active: false,
              },
            ].map((act, i) => (
              <div key={i} className="flex gap-5 relative">
                {i !== 2 && (
                  <div className="absolute left-[7px] top-6 bottom-[-24px] w-[2px] bg-white/10" />
                )}
                <div
                  className={`w-4 h-4 rounded-full mt-1 shrink-0 z-10 ${act.active ? "bg-accent/20 border-2 border-accent shadow-[0_0_10px_rgba(34,211,238,0.5)]" : "bg-background border-2 border-white/20"}`}
                />
                <div className="flex-1 pb-2">
                  <p
                    className={`text-sm font-medium ${act.active ? "text-white" : "text-white/80"}`}
                  >
                    {act.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {act.detail}
                  </p>
                </div>
                <span className="text-xs text-muted-foreground mt-1 whitespace-nowrap">
                  {act.date}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
