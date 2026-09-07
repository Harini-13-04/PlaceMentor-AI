import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { API_URL, getAuthHeaders } from "@/config";

import {
  Sparkles,
  ArrowRight,
  Code2,
  Calculator,
  MessageSquare,
  FileText,
  BarChart3,
  BrainCircuit,
  HelpCircle,
  Clock,
  Zap,
  TrendingUp,
  Target,
  CheckCircle2,
  Layers,
  RefreshCw,
  AlertCircle,
  Lightbulb,
} from "lucide-react";

export default function Recommendations() {
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/api/recommendations`, {
          headers: getAuthHeaders(true),
        });

        if (res.ok) {
          const data = await res.json();
          setRecommendations(data.recommendations || []);
        }
      } catch (err) {
        console.error("Failed to load recommendations:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecommendations();
  }, []);

  const getModuleIcon = (iconName: string, module: string) => {
    switch (module) {
      case "practice":
        return <Code2 className="w-5 h-5 text-purple-600 dark:text-purple-400" />;
      case "aptitude":
        return <Calculator className="w-5 h-5 text-amber-600 dark:text-amber-400" />;
      case "communication":
        return <MessageSquare className="w-5 h-5 text-teal-600 dark:text-teal-400" />;
      case "resume":
        return <FileText className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />;
      case "brain-zone":
        return <BrainCircuit className="w-5 h-5 text-rose-600 dark:text-rose-400" />;
      case "quiz":
      case "quizee":
        return <HelpCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
      default:
        return <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />;
    }
  };

  return (
    <div className="space-y-6 font-sans text-foreground max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-2xl border border-purple-500/25 bg-gradient-to-br from-purple-500/10 via-card to-card dark:from-purple-950/40 dark:via-secondary dark:to-card shadow-sm space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-700 dark:text-purple-300 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Daily Performance Signals</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground font-display">
          Personalized Daily Recommendations
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
          Grounded, high-yield next steps derived directly from your previous practice submissions, aptitude accuracy, and diagnostic quizzes. Exactly 2–3 focus targets.
        </p>
      </div>

      {loading ? (
        <div className="py-20 text-center text-muted-foreground space-y-3">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto text-purple-500" />
          <p className="text-sm">Analyzing previous performance signals...</p>
        </div>
      ) : recommendations.length > 0 ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-foreground">Top Focus Targets for Today</h3>
            <span className="text-xs font-mono text-muted-foreground">{recommendations.length} Active Insights</span>
          </div>

          <div className="space-y-4">
            {recommendations.slice(0, 3).map((rec) => (
              <div
                key={rec.id}
                className="p-5 sm:p-6 rounded-2xl border border-border bg-card hover:border-purple-500/40 transition-all shadow-sm space-y-4 flex flex-col md:flex-row md:items-center justify-between gap-5"
              >
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <div className="w-9 h-9 rounded-xl bg-secondary border border-border flex items-center justify-center shrink-0">
                      {getModuleIcon(rec.iconName, rec.module)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-base font-bold text-foreground">{rec.title}</h4>
                        <span
                          className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${
                            rec.badgeColor || "bg-secondary text-muted-foreground border-border"
                          }`}
                        >
                          {rec.badge}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{rec.subtitle}</p>
                    </div>
                  </div>

                  {/* Explicit "Why This" Justification Box */}
                  {rec.whyThisReason && (
                    <div className="p-3 rounded-xl bg-purple-500/5 border border-purple-500/20 text-xs text-muted-foreground flex items-start gap-2">
                      <Lightbulb className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-purple-700 dark:text-purple-300">Why this recommendation: </strong>
                        <span>{rec.whyThisReason}</span>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-4 text-xs text-muted-foreground font-mono">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {rec.estimatedTime}
                    </span>
                    <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                      <Zap className="w-3.5 h-3.5" /> {rec.impactScore}
                    </span>
                  </div>
                </div>

                {/* Single Primary Action Button */}
                <div className="shrink-0 pt-2 md:pt-0">
                  <Link
                    to={rec.route}
                    className="w-full md:w-auto px-6 py-2.5 rounded-xl text-xs font-bold text-white pm-btn-gradient shadow-md flex items-center justify-center gap-1.5 hover:opacity-95 transition-all"
                  >
                    <span>Start Action</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Honest Empty State */
        <div className="p-8 sm:p-12 rounded-2xl border border-border bg-card text-center space-y-4 max-w-xl mx-auto shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-600 dark:text-purple-400 mx-auto">
            <Sparkles className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-bold text-foreground">No Performance Signals Yet</h3>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Complete a practice problem or assessment session to establish your baseline and unlock personalized daily insights based on real performance.
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <Link
              to="/practice"
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-white pm-btn-gradient shadow-md inline-flex items-center gap-1.5"
            >
              <span>Solve Practice Problem</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              to="/aptitude"
              className="px-5 py-2.5 rounded-xl border border-border bg-secondary hover:bg-secondary/80 text-foreground text-xs font-semibold"
            >
              Take Aptitude Test
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
