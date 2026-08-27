import { useState } from "react";
import { Progress } from "@/components/ui/progress";
import {
  BarChart3,
  CheckCircle2,
  AlertTriangle,
  Code2,
  FileText,
  MessageSquare,
  Sparkles,
  TrendingUp,
  Target,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function PlacementReadiness() {
  const [readinessPercentage] = useState(78);

  const competencyBreakdown = [
    {
      category: "Data Structures & Algorithms",
      score: 88,
      status: "Tier-1 Ready",
      color: "text-emerald-600 dark:text-emerald-400",
      progressClass: "[&>div]:bg-emerald-500",
      details: "Solid mastery in Arrays, Two Pointers, Binary Search, and Trees.",
    },
    {
      category: "Core Computer Science",
      score: 72,
      status: "Moderate",
      color: "text-blue-600 dark:text-blue-400",
      progressClass: "[&>div]:bg-blue-500",
      details: "Strong in DBMS and SQL; Computer Networks fundamentals need review.",
    },
    {
      category: "ATS Resume & Experience Quality",
      score: 84,
      status: "Strong",
      color: "text-purple-600 dark:text-purple-400",
      progressClass: "[&>div]:bg-purple-500",
      details: "Clear quantified impact and recognized tech stack keywords.",
    },
    {
      category: "Interview Communication & HR",
      score: 80,
      status: "Ready",
      color: "text-teal-600 dark:text-teal-400",
      progressClass: "[&>div]:bg-teal-600",
      details: "Good confidence and vocal cadence; practice concluding behavioral responses.",
    },
  ];

  const focusRecommendations = [
    {
      title: "Computer Networks & Protocols",
      action: "Review TCP/IP handshake, DNS resolution, and HTTP/HTTPS differences.",
      module: "/practice",
      type: "Core CS",
    },
    {
      title: "Dynamic Programming Patterns",
      action: "Solve 5 high-yield 0/1 Knapsack and LCS questions.",
      module: "/practice",
      type: "Algorithms",
    },
    {
      title: "Behavioral STAR Stories",
      action: "Record a 60-second response on handling project conflict.",
      module: "/communication",
      type: "Voice",
    },
  ];

  return (
    <div className="space-y-6 font-sans text-foreground">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-1">
          Placement Readiness Diagnostic
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Comprehensive competency benchmarking across algorithmic problem-solving, core CS, resume quality, and voice communication.
        </p>
      </div>

      {/* Main Score Hero Card */}
      <div className="p-6 sm:p-8 rounded-2xl border border-border bg-card shadow-sm">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-teal-500/30 bg-teal-500/10 text-teal-600 dark:text-teal-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" /> Placement Benchmark 2026
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-foreground">
              Candidate Placement Index: <span className="text-teal-600 dark:text-teal-400 font-mono">{readinessPercentage}%</span>
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-lg leading-relaxed">
              Based on your completed assessments, problem submissions, and resume scan, you meet the screening threshold for 85% of campus recruitment drives.
            </p>
          </div>

          <div className="w-32 h-32 rounded-full border-4 border-teal-500/20 flex flex-col items-center justify-center bg-teal-500/10 shrink-0">
            <span className="text-3xl font-bold text-teal-600 dark:text-teal-400 font-mono">{readinessPercentage}%</span>
            <span className="text-[10px] text-muted-foreground uppercase tracking-wide font-semibold">Readiness</span>
          </div>
        </div>
      </div>

      {/* Category Breakdown Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {competencyBreakdown.map((item) => (
          <div key={item.category} className="p-5 rounded-xl border border-border bg-card shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-foreground">{item.category}</span>
              <span className={`text-xs font-semibold ${item.color}`}>{item.status} ({item.score}%)</span>
            </div>
            <Progress value={item.score} className={`h-1.5 bg-secondary rounded-full ${item.progressClass}`} />
            <p className="text-xs text-muted-foreground leading-relaxed">{item.details}</p>
          </div>
        ))}
      </div>

      {/* Actionable Next Steps to Reach 90%+ */}
      <div className="p-6 rounded-2xl border border-border bg-card shadow-sm space-y-4">
        <div>
          <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
            <Target className="w-4 h-4 text-teal-600 dark:text-teal-400" /> Action Items to Reach 90%+ Readiness
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">Focusing on these 3 items will close your primary placement skill gaps.</p>
        </div>

        <div className="space-y-3">
          {focusRecommendations.map((rec, i) => (
            <div key={i} className="p-3.5 rounded-lg border border-border bg-secondary/30 flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-foreground">{rec.title}</span>
                  <span className="px-2 py-0.2 rounded bg-secondary border border-border text-[10px] text-muted-foreground font-medium">{rec.type}</span>
                </div>
                <p className="text-xs text-muted-foreground">{rec.action}</p>
              </div>

              <Link
                to={rec.module}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold transition-colors shrink-0"
              >
                Practice <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}