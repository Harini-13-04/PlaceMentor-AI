import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { API_URL, getAuthHeaders } from "@/config";
import {
  BarChart3,
  CheckCircle2,
  AlertTriangle,
  Code2,
  Calculator,
  MessageSquare,
  FileText,
  Sparkles,
  TrendingUp,
  Target,
  ArrowRight,
  Compass,
  Check,
  Zap,
  Award,
  Trophy,
  ChevronRight,
  ShieldCheck,
  Clock,
  Building2,
  Briefcase,
  Layers,
  HelpCircle,
  RefreshCw,
  AlertCircle,
} from "lucide-react";

export default function PlacementReadiness() {
  const [activeTab, setActiveTab] = useState<"readiness" | "company" | "roadmap">("readiness");

  // State
  const [readinessData, setReadinessData] = useState<any>(null);
  const [companyMatches, setCompanyMatches] = useState<any[]>([]);
  const [roadmapData, setRoadmapData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllReadiness = async () => {
      setLoading(true);
      try {
        const headers = getAuthHeaders(true);

        const [rRes, cRes, mRes] = await Promise.all([
          fetch(`${API_URL}/api/readiness`, { headers }),
          fetch(`${API_URL}/api/readiness/company-matches`, { headers }),
          fetch(`${API_URL}/api/readiness/roadmap`, { headers }),
        ]);


        if (rRes.ok) {
          const rData = await rRes.json();
          setReadinessData(rData);
        }
        if (cRes.ok) {
          const cData = await cRes.json();
          setCompanyMatches(cData.matches || []);
        }
        if (mRes.ok) {
          const mData = await mRes.json();
          setRoadmapData(mData);
        }
      } catch (err) {
        console.error("Failed to load readiness data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllReadiness();
  }, []);

  const getCompetencyIcon = (category: string = "") => {
    const c = category.toLowerCase();
    if (c.includes("coding") || c.includes("dsa")) return Code2;
    if (c.includes("aptitude") || c.includes("quantitative")) return Calculator;
    if (c.includes("cs") || c.includes("core")) return Target;
    if (c.includes("resume")) return FileText;
    if (c.includes("communication") || c.includes("behavioral")) return MessageSquare;
    return Sparkles;
  };

  const getCompetencyRoute = (category: string = "") => {
    const c = category.toLowerCase();
    if (c.includes("coding") || c.includes("dsa")) return "/practice";
    if (c.includes("aptitude") || c.includes("quantitative")) return "/aptitude";
    if (c.includes("cs") || c.includes("core")) return "/quizee";
    if (c.includes("resume")) return "/resume";
    if (c.includes("communication") || c.includes("behavioral")) return "/communication";
    return "/practice";
  };

  return (
    <div className="space-y-8 font-sans text-foreground">
      {/* Top Header & Tab Navigation */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-700 dark:text-purple-300 text-xs font-semibold mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Campus Recruitment Benchmarking</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground font-display">
              Placement Readiness & Career Roadmap
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Grounded candidate benchmarking, company tier compatibility matching, and adaptive career roadmap.
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-border pb-1 overflow-x-auto">
          <button
            onClick={() => setActiveTab("readiness")}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === "readiness"
                ? "bg-purple-600 text-white shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Placement Readiness</span>
          </button>

          <button
            onClick={() => setActiveTab("company")}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === "company"
                ? "bg-purple-600 text-white shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Company Readiness</span>
          </button>

          <button
            onClick={() => setActiveTab("roadmap")}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === "roadmap"
                ? "bg-purple-600 text-white shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Personalized Roadmap</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center text-muted-foreground space-y-3">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto text-purple-500" />
          <p className="text-sm">Calculating placement benchmarks from real performance...</p>
        </div>
      ) : (
        <>
          {/* =========================================================================
              TAB 1: PLACEMENT READINESS
             ========================================================================= */}
          {activeTab === "readiness" && (
            <div className="space-y-6">
              {readinessData?.has_sufficient_data ? (
                <>
                  {/* Overall Score Hero */}
                  <div className="p-6 sm:p-8 rounded-2xl border border-purple-500/25 bg-gradient-to-br from-purple-500/10 via-card to-card dark:from-purple-950/40 dark:via-secondary dark:to-card shadow-sm relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-2 relative z-10 max-w-xl">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-700 dark:text-purple-300 text-xs font-semibold">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Calculated Readiness Score</span>
                      </div>

                      <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground font-display">
                        Overall Readiness:{" "}
                        <span className="text-purple-600 dark:text-purple-400 font-mono">
                          {readinessData.overall_readiness}%
                        </span>
                      </h2>

                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                        Calculated from your practice problem verdicts, aptitude accuracy, core CS quizzes, and resume ATS benchmarks.
                      </p>

                      {readinessData.biggest_gap && (
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 text-xs font-medium mt-2">
                          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                          <span>Key Area for Improvement: {readinessData.biggest_gap}</span>
                        </div>
                      )}
                    </div>

                    {/* Circular Progress Gauge */}
                    <div className="relative w-28 h-28 flex items-center justify-center shrink-0 mx-auto md:mx-0">
                      <svg className="w-28 h-28 -rotate-90" viewBox="0 0 36 36">
                        <path
                          className="text-border"
                          strokeWidth="3"
                          stroke="currentColor"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <path
                          className="text-purple-600 dark:text-purple-500"
                          strokeDasharray={`${readinessData.overall_readiness}, 100`}
                          strokeWidth="3.5"
                          strokeLinecap="round"
                          stroke="currentColor"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                      </svg>
                      <div className="absolute text-center leading-none">
                        <span className="text-xl font-bold font-mono text-foreground">
                          {readinessData.overall_readiness}%
                        </span>
                        <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
                          {readinessData.overall_readiness >= 75 ? "Ready" : "Building"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 5-Pillar Competency Diagnostics */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-foreground">5-Pillar Competency Diagnostic</h3>
                      <span className="text-xs text-muted-foreground font-mono">Real Assessment Evidence</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                      {readinessData.competencies?.map((comp: any) => {
                        const Icon = getCompetencyIcon(comp.category);
                        const route = getCompetencyRoute(comp.category);
                        return (
                          <Link
                            key={comp.category}
                            to={route}
                            className="p-4 rounded-xl border border-border bg-card hover:bg-secondary/60 transition-all space-y-3 shadow-sm block group"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-secondary border border-border flex items-center justify-center text-purple-600 dark:text-purple-400">
                                  <Icon className="w-4 h-4" />
                                </div>
                                <span className="text-xs font-bold text-foreground group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                                  {comp.category}
                                </span>
                              </div>
                              <span className="text-xs font-mono font-bold text-purple-600 dark:text-purple-400">
                                {comp.score}%
                              </span>
                            </div>

                            <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full bg-purple-600 dark:bg-purple-500"
                                style={{ width: `${comp.score}%` }}
                              />
                            </div>

                            <div className="flex items-center justify-between text-[11px]">
                              <span className="text-muted-foreground">{comp.status}</span>
                              <span className="text-purple-600 dark:text-purple-400 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                                Practice <ChevronRight className="w-3 h-3" />
                              </span>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </>
              ) : (
                /* Honest Empty State */
                <div className="p-8 sm:p-12 rounded-2xl border border-border bg-card text-center space-y-4 max-w-xl mx-auto shadow-sm">
                  <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-600 dark:text-purple-400 mx-auto">
                    <BarChart3 className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">No Placement Baseline Yet</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    Complete your first coding problem, take an aptitude test, or solve a Core CS quiz to establish your genuine placement readiness score.
                  </p>
                  <div className="flex justify-center gap-3 pt-2">
                    <Link
                      to="/practice"
                      className="px-5 py-2.5 rounded-xl text-xs font-bold text-white pm-btn-gradient shadow-md inline-flex items-center gap-1.5"
                    >
                      <span>Start Practice Problem</span>
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
          )}

          {/* =========================================================================
              TAB 2: COMPANY READINESS
             ========================================================================= */}
          {activeTab === "company" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-foreground">Tier-1 & Campus Hiring Benchmarks</h3>
                  <p className="text-xs text-muted-foreground">
                    Evidence-based gap analysis against real recruitment standards for Product, Service, and Startup roles.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {companyMatches.map((match: any) => {
                  const isQualified = match.match_status === "Candidate Qualifies";
                  const isInsufficient = match.match_status === "Insufficient Evidence";
                  return (
                    <div
                      key={match.id}
                      className="p-5 rounded-2xl border border-border bg-card shadow-sm space-y-4 flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-secondary text-foreground">
                            {match.category}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                              isQualified
                                ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30"
                                : isInsufficient
                                ? "bg-secondary text-muted-foreground border-border"
                                : "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30"
                            }`}
                          >
                            {match.match_status}
                          </span>
                        </div>

                        <div>
                          <h4 className="text-sm font-bold text-foreground">
                            {match.companies?.slice(0, 3).join(", ")}
                          </h4>
                          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                            {match.description}
                          </p>
                        </div>

                        {/* Gap Analysis */}
                        {match.missing_skills?.length > 0 && (
                          <div className="space-y-1.5 pt-2">
                            <span className="text-[10px] uppercase font-bold text-muted-foreground">
                              Skills Gap / Missing Requirements:
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {match.missing_skills.map((skill: string, idx: number) => (
                                <span
                                  key={idx}
                                  className="px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-700 dark:text-rose-300 text-[10px] font-medium border border-rose-500/20"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Evidence Used */}
                        {match.evidence_used?.length > 0 && (
                          <div className="space-y-1 pt-1">
                            <span className="text-[10px] uppercase font-bold text-muted-foreground">
                              Evidence Evaluated:
                            </span>
                            <ul className="text-[11px] text-muted-foreground space-y-0.5">
                              {match.evidence_used.map((ev: string, idx: number) => (
                                <li key={idx} className="flex items-center gap-1">
                                  <Check className="w-3 h-3 text-emerald-500 shrink-0" />
                                  <span>{ev}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>

                      <div className="pt-3 border-t border-border">
                        <Link
                          to={match.id === "service-giants" ? "/aptitude" : "/practice"}
                          className="w-full py-2 px-3 rounded-xl border border-purple-500/30 bg-purple-500/10 hover:bg-purple-500/20 text-purple-700 dark:text-purple-300 text-xs font-bold transition-all flex items-center justify-center gap-1"
                        >
                          <span>Bridge Skill Gap</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB 3: PERSONALIZED ROADMAP
             ========================================================================= */}
          {activeTab === "roadmap" && (
            <div className="space-y-6">
              {/* Profile Context Card */}
              {roadmapData?.learner_profile && (
                <div className="p-4 rounded-xl border border-border bg-secondary/30 flex items-center justify-between flex-wrap gap-3 text-xs">
                  <div>
                    <span className="text-muted-foreground">Academic Year: </span>
                    <strong className="text-foreground">{roadmapData.learner_profile.academic_year}</strong>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Career Goal: </span>
                    <strong className="text-foreground">{roadmapData.learner_profile.career_goal}</strong>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Programming Level: </span>
                    <strong className="text-purple-600 dark:text-purple-400">
                      {roadmapData.learner_profile.programming_level}
                    </strong>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Target Company: </span>
                    <strong className="text-foreground">{roadmapData.learner_profile.target_company_type}</strong>
                  </div>
                </div>
              )}

              {/* Multi-Stage Adaptive Roadmap Timeline */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                    <Compass className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    Adaptive Placement Journey
                  </h3>
                  <span className="px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-700 dark:text-purple-300 text-xs font-bold font-mono">
                    {roadmapData?.stages?.length || 0} Stages Adapted to Your Profile
                  </span>
                </div>

                <div className="space-y-3">
                  {roadmapData?.stages?.map((stage: any) => {
                    const isCompleted = stage.status === "completed";
                    const isCurrent = stage.status === "current";
                    return (
                      <div
                        key={stage.stage}
                        className={`p-5 rounded-2xl border transition-all ${
                          isCurrent
                            ? "border-purple-500/50 bg-gradient-to-r from-purple-500/10 to-transparent shadow-sm"
                            : isCompleted
                            ? "border-emerald-500/30 bg-emerald-500/5"
                            : "border-border bg-card opacity-80"
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                                isCompleted
                                  ? "bg-emerald-500 text-white"
                                  : isCurrent
                                  ? "bg-purple-600 text-white shadow-sm"
                                  : "bg-secondary text-muted-foreground border border-border"
                              }`}
                            >
                              {isCompleted ? <Check className="w-5 h-5" /> : stage.stage}
                            </div>

                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="text-sm font-bold text-foreground">{stage.title}</h4>
                                <span
                                  className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                                    isCompleted
                                      ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                                      : isCurrent
                                      ? "bg-purple-500/20 text-purple-700 dark:text-purple-300"
                                      : "bg-secondary text-muted-foreground"
                                  }`}
                                >
                                  {stage.status}
                                </span>
                              </div>
                              <p className="text-xs text-muted-foreground mt-0.5">{stage.subtitle}</p>
                            </div>
                          </div>

                          <div className="text-right">
                            <span className="text-xs font-mono font-bold text-foreground">
                              {stage.progress}%
                            </span>
                            <div className="w-24 bg-secondary rounded-full h-1.5 overflow-hidden mt-1">
                              <div
                                className={`h-full rounded-full ${
                                  isCompleted ? "bg-emerald-500" : "bg-purple-600"
                                }`}
                                style={{ width: `${stage.progress}%` }}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Skills Covered */}
                        <div className="flex flex-wrap gap-1.5 pt-3 mt-3 border-t border-border/40">
                          {stage.skills?.map((skill: string, sIdx: number) => (
                            <span
                              key={sIdx}
                              className="px-2 py-0.5 rounded-md bg-secondary text-foreground text-[10px] font-medium border border-border"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>

                        {stage.recommendedAction && (
                          <p className="text-xs text-purple-700 dark:text-purple-300 pt-2 font-medium">
                            <strong>Recommended Action:</strong> {stage.recommendedAction}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}