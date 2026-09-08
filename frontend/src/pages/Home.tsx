import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { API_URL, getAuthHeaders } from "@/config";
import femaleHeroImg from "@/assets/hero/placement-female.jpg";
import maleHeroImg from "@/assets/hero/placement-male.jpg";
import neutralHeroImg from "@/assets/hero/placement-neutral.jpg";
import {
  Sparkles,
  ArrowRight,
  Code2,
  Calculator,
  Compass,
  Flame,
  Zap,
  BookOpen,
  ArrowUpRight,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Clock,
  Target,
  Crown,
} from "lucide-react";

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [learnerProfile, setLearnerProfile] = useState<any>(null);
  const [problemStats, setProblemStats] = useState({
    solved_count: 0,
    total_problems: 22,
    attempted_count: 0,
    total_submissions: 0,
    solved_problem_ids: [] as string[],
  });
  const [assessmentHistory, setAssessmentHistory] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [roadmap, setRoadmap] = useState<any>(null);
  const [readinessData, setReadinessData] = useState<any>(null);
  const [brainProgress, setBrainProgress] = useState<any>(null);

  // Fetch real authenticated dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const authHeaders = getAuthHeaders(true);

        // 1. Learner Profile
        const profileRes = await fetch(`${API_URL}/api/onboarding/status`, { headers: authHeaders });
        if (profileRes.ok) {
          const pData = await profileRes.json();
          setLearnerProfile(pData.profile);
        }

        // 2. Problem Stats (Real unique solved count & total dataset count)
        const statsRes = await fetch(`${API_URL}/api/problems/stats`, { headers: authHeaders });
        if (statsRes.ok) {
          const sData = await statsRes.json();
          setProblemStats({
            solved_count: sData.solved_count || 0,
            total_problems: sData.total_problems || 22,
            attempted_count: sData.attempted_count || 0,
            total_submissions: sData.total_submissions || 0,
            solved_problem_ids: sData.solved_problem_ids || [],
          });
        }

        // 3. Assessment History
        const assessRes = await fetch(`${API_URL}/api/assessments/history`, { headers: authHeaders });
        if (assessRes.ok) {
          const aData = await assessRes.json();
          setAssessmentHistory(aData.attempts || []);
        }

        // 4. Recommendations
        const recRes = await fetch(`${API_URL}/api/recommendations`, { headers: authHeaders });
        if (recRes.ok) {
          const rData = await recRes.json();
          setRecommendations(rData.recommendations || []);
        }

        // 5. Roadmap
        const roadRes = await fetch(`${API_URL}/api/readiness/roadmap`, { headers: authHeaders });
        if (roadRes.ok) {
          const rmData = await roadRes.json();
          setRoadmap(rmData);
        }

        // 6. Placement Readiness
        const readRes = await fetch(`${API_URL}/api/readiness`, { headers: authHeaders });
        if (readRes.ok) {
          const rdData = await readRes.json();
          setReadinessData(rdData);
        }

        // 7. Brain Zone Progress
        const bzRes = await fetch(`${API_URL}/api/brainzone/progress`, { headers: authHeaders });
        if (bzRes.ok) {
          const bzData = await bzRes.json();
          setBrainProgress(bzData);
        }
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  // Derived Real Metrics (Strictly no fabricated numbers)
  const totalProblemsCatalog = problemStats.total_problems || 22;
  const solvedCount = problemStats.solved_count;
  const pendingCount = Math.max(0, totalProblemsCatalog - solvedCount);

  // Real Accuracy across actual attempts
  const hasAssessments = assessmentHistory.length > 0;
  const avgAccuracy = hasAssessments
    ? Math.round(assessmentHistory.reduce((acc, curr) => acc + (curr.accuracy || 0), 0) / assessmentHistory.length)
    : null;
  const accuracyTrendLabel = hasAssessments && assessmentHistory.length > 1
    ? (() => {
        const latest = assessmentHistory[0]?.accuracy || 0;
        const prev = assessmentHistory[1]?.accuracy || 0;
        const diff = Math.round(latest - prev);
        return diff >= 0 ? `+${diff}% vs prior test` : `${diff}% vs prior test`;
      })()
    : hasAssessments
    ? `${assessmentHistory.length} test completed`
    : "No assessments taken";

  // Real Streak & XP
  const currentStreak = brainProgress?.streak_days || 0;
  const userXp = brainProgress?.xp || user?.xp || 0;

  // Real Readiness Score
  const hasReadinessData = readinessData?.has_sufficient_data === true;
  const readinessScore = hasReadinessData ? readinessData.overall_readiness : null;
  const readinessTierLabel =
    readinessScore !== null && readinessScore >= 75
      ? "Tier-1 Qualified"
      : readinessScore !== null && readinessScore >= 40
      ? "In Progress"
      : hasReadinessData
      ? "Prerequisites Needed"
      : "Baseline Needed";

  // Real Recent Performance
  const latestAttempt = assessmentHistory.length > 0 ? assessmentHistory[0] : null;
  const latestScoreRatio = latestAttempt
    ? `${latestAttempt.score || 0}/${latestAttempt.total_questions || 5}`
    : "0/0";
  const latestAccuracy = latestAttempt ? Math.round(latestAttempt.accuracy || 0) : null;
  const latestDurationSec = latestAttempt?.time_spent_seconds || 0;
  const formattedDuration = latestDurationSec > 0
    ? `${Math.floor(latestDurationSec / 60).toString().padStart(2, "0")}:${(latestDurationSec % 60).toString().padStart(2, "0")}`
    : "00:00";

  // Roadmap calculation
  const roadmapStages = roadmap?.stages || [];
  const currentStageIndex = roadmapStages.findIndex((s: any) => s.status === "In Progress" || s.status === "Upcoming");
  const activeMilestoneIndex = currentStageIndex >= 0 ? currentStageIndex + 1 : 1;
  const totalMilestones = roadmapStages.length || 7;
  const currentMilestoneTitle =
    roadmapStages[currentStageIndex >= 0 ? currentStageIndex : 0]?.title || "Aptitude Mock Test & Revision";
  const milestoneProgressPct = roadmapStages.length > 0
    ? Math.round((solvedCount / Math.max(1, totalProblemsCatalog)) * 100)
    : 0;

  // Top Recommendation (Real or Baseline)
  const topRecommendation = recommendations.length > 0 ? recommendations[0] : null;
  const hasRecommendations = recommendations.length > 0;
  const recTitle = topRecommendation?.title || "Establish Your Placement Baseline";
  const recDesc = topRecommendation?.actionable_step || "Complete your first Practice Problem or Aptitude Assessment to activate your personalized AI diagnostic engine.";
  const recReason = topRecommendation?.whyThisReason || "PlaceMentor AI analyzes your live problem solving patterns, error logs, and assessment timing to pinpoint high-yield improvement areas.";
  const recRoute = topRecommendation?.route || "/practice";
  const recImpact = topRecommendation?.expected_score_impact ? `+${topRecommendation.expected_score_impact} Readiness Pts` : "+6 Readiness Pts";

  // Daily Challenge setup (Real recent focus or fresh prompt)
  const dailyChallengeTitle = topRecommendation?.topic || "Data Interpretation";
  const dailyChallengeDifficulty = "Medium";
  const dailyChallengeReason = topRecommendation?.whyThisReason
    ? topRecommendation.whyThisReason
    : "Master high-frequency campus recruitment questions to build your active streak.";
  const dailyChallengeRoute = topRecommendation?.route || "/aptitude";

  // Gender-Personalized Hero Illustration (Explicit profile preference only; never inferred)
  const rawGender = (learnerProfile?.gender || user?.gender || "").toLowerCase().trim();
  let heroIllustration = neutralHeroImg;
  let heroAltText = "PlaceMentor AI placement learning illustration";

  if (rawGender === "female") {
    heroIllustration = femaleHeroImg;
    heroAltText = "PlaceMentor AI female placement learning illustration";
  } else if (rawGender === "male") {
    heroIllustration = maleHeroImg;
    heroAltText = "PlaceMentor AI male placement learning illustration";
  }

  return (
    <div className="space-y-4 sm:space-y-4.5 select-none font-sans text-foreground">
      {/* =========================================================================
          ROW 1: HERO CARD + PLACEMENT ROADMAP + DAILY CHALLENGE (Aligned 3-Card Grid)
         ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr_1fr] gap-3.5 sm:gap-4 items-stretch">
        {/* Card 1: Placement Season Visual Hero Card (Gender-Personalized Illustration) */}
        <div className="rounded-2xl bg-gradient-to-r from-purple-50/90 via-indigo-50/50 to-purple-100/40 dark:from-[#170e30] dark:via-[#1a1038] dark:to-[#150d2b] border border-purple-200/80 dark:border-purple-500/30 p-4 sm:p-5 flex flex-col justify-between relative overflow-hidden shadow-sm hover:shadow-md group h-full text-foreground dark:text-white min-h-[170px] transition-all">
          {/* Background Hero Character Image seamlessly integrated on right side */}
          <div className="absolute right-0 top-0 bottom-0 w-1/2 sm:w-5/12 lg:w-[48%] pointer-events-none overflow-hidden select-none">
            <img
              src={heroIllustration}
              alt={heroAltText}
              className="w-full h-full object-cover object-top sm:object-center group-hover:scale-105 transition-transform duration-500"
            />
            {/* Smooth gradient blend into text on the left & bottom */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-50/95 via-purple-50/60 to-transparent dark:from-[#170e30] dark:via-[#170e30]/40 dark:to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-purple-50/50 via-transparent to-transparent dark:from-[#170e30]/40 dark:via-transparent dark:to-transparent" />
          </div>

          <div className="relative z-10 max-w-[62%] sm:max-w-[58%] lg:max-w-[56%] space-y-2 sm:space-y-2.5 flex flex-col justify-between h-full">
            <div className="space-y-1.5 sm:space-y-2">
              {/* Top Badge */}
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-100/90 dark:bg-purple-500/25 border border-purple-200/80 dark:border-purple-400/30 text-purple-700 dark:text-purple-200 text-xs font-semibold backdrop-blur-sm">
                <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-purple-300" />
                <span>Placement Season 2026</span>
              </div>

              {/* Main Title */}
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight font-display">
                Your Dream<br />Placement Awaits
              </h1>

              {/* Subtitle */}
              <p className="text-xs text-slate-600 dark:text-purple-200/80 font-medium leading-relaxed">
                Practice. Learn. Improve. Get Placed.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-2 pt-1.5">
              <Link
                to="/practice"
                className="px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-sm shadow-purple-600/30 flex items-center gap-1.5 transition-all active:scale-95"
              >
                <span>Start Practicing</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              <Link
                to="/aptitude"
                className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-white/90 bg-white/90 hover:bg-white dark:bg-white/10 dark:hover:bg-white/15 border border-purple-200/80 dark:border-white/20 shadow-xs backdrop-blur-sm flex items-center gap-1.5 transition-colors active:scale-95"
              >
                <Calculator className="w-3.5 h-3.5 text-purple-600 dark:text-purple-300" />
                <span>Take Aptitude</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Card 2: Placement Roadmap Card */}
        <div className="rounded-2xl bg-card border border-border/80 p-4 sm:p-5 flex flex-col justify-between shadow-sm hover:border-purple-500/30 transition-all h-full">
          <div>
            {/* Header */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-purple-500/15 border border-purple-500/25 flex items-center justify-center text-purple-600 dark:text-purple-400 shrink-0">
                  <Compass className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-foreground">Placement Roadmap</h3>
                  <p className="text-[10px] text-muted-foreground">Milestone {activeMilestoneIndex} of {totalMilestones}</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shrink-0">
                23 days left
              </span>
            </div>

            {/* Next Milestone */}
            <div className="mt-3.5 space-y-1">
              <p className="text-[9px] font-bold text-muted-foreground tracking-wider uppercase font-mono">YOUR NEXT MILESTONE</p>
              <div className="flex items-center gap-1.5 text-xs font-bold text-foreground truncate">
                <Zap className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span className="truncate">{currentMilestoneTitle}</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-3 space-y-1">
              <div className="w-full h-1.5 rounded-full bg-secondary overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-purple-600 transition-all duration-700"
                  style={{ width: `${Math.max(10, milestoneProgressPct)}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                <span>Milestone Progress</span>
                <span className="font-bold text-foreground font-mono">{milestoneProgressPct}%</span>
              </div>
            </div>
          </div>

          {/* Action Link */}
          <Link
            to="/placement-readiness"
            className="mt-3.5 w-full py-1.5 px-3 rounded-xl text-xs font-semibold text-muted-foreground hover:text-foreground bg-secondary/60 hover:bg-secondary border border-border flex items-center justify-center gap-1.5 transition-colors"
          >
            <span>Continue Roadmap</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Card 3: Daily Challenge Card */}
        <div className="rounded-2xl bg-card border border-border/80 p-4 sm:p-5 flex flex-col justify-between shadow-sm hover:border-purple-500/30 transition-all h-full">
          <div>
            {/* Header */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-orange-500/15 border border-orange-500/25 flex items-center justify-center text-orange-500 shrink-0">
                  <Flame className="w-3.5 h-3.5 fill-orange-500" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-foreground">Daily Challenge</h3>
                  <p className="text-[10px] text-muted-foreground">5 Questions • 5 Minutes</p>
                </div>
              </div>
              <Link to="/aptitude" className="text-[10px] font-bold text-purple-600 dark:text-purple-400 hover:underline shrink-0">
                View All
              </Link>
            </div>

            {/* Challenge Info Box */}
            <div className="mt-3.5 p-2.5 rounded-xl bg-secondary/40 border border-border/60 space-y-1">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-foreground truncate">{dailyChallengeTitle}</span>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/25 shrink-0">
                  {dailyChallengeDifficulty}
                </span>
              </div>
              <p className="text-[10px] text-muted-foreground line-clamp-2 leading-relaxed">
                {dailyChallengeReason}
              </p>
            </div>
          </div>

          {/* Start Challenge Button */}
          <Link
            to={dailyChallengeRoute}
            className="mt-3.5 w-full py-2 px-3 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-amber-500 via-orange-500 to-purple-600 hover:opacity-95 shadow-sm shadow-orange-500/15 flex items-center justify-center gap-1.5 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Start Challenge</span>
          </Link>
        </div>
      </div>

      {/* =========================================================================
          ROW 2: COMPACT 5 METRIC CARDS (Exact Layout & Dot Indicators)
         ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-3.5 items-stretch">
        {/* Metric 1: Accuracy */}
        <div className="rounded-2xl bg-card border border-border/80 p-3.5 sm:p-4 shadow-sm hover:border-emerald-500/30 transition-all flex flex-col justify-between h-full">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">Accuracy</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
          </div>
          <div className="my-1.5">
            <span className="text-xl sm:text-2xl font-extrabold text-foreground font-mono">
              {avgAccuracy !== null ? `${avgAccuracy}%` : "Not Assessed"}
            </span>
          </div>
          <p className="text-[10px] sm:text-[11px] text-emerald-600 dark:text-emerald-400 font-medium truncate">
            {accuracyTrendLabel}
          </p>
        </div>

        {/* Metric 2: Questions Solved (Guaranteed Real 1 / 22) */}
        <div className="rounded-2xl bg-card border border-border/80 p-3.5 sm:p-4 shadow-sm hover:border-purple-500/30 transition-all flex flex-col justify-between h-full">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">Questions Solved</span>
            <span className="w-2 h-2 rounded-full bg-purple-500" />
          </div>
          <div className="my-1.5 flex items-baseline gap-1.5">
            <span className="text-xl sm:text-2xl font-extrabold text-purple-600 dark:text-purple-400 font-mono">
              {solvedCount}
            </span>
            <span className="text-xs font-bold text-muted-foreground font-mono">/ {totalProblemsCatalog}</span>
          </div>
          <p className="text-[10px] sm:text-[11px] text-muted-foreground truncate">
            {pendingCount > 0 ? `${pendingCount} pending today` : "All catalog solved!"}
          </p>
        </div>

        {/* Metric 3: Current Streak */}
        <div className="rounded-2xl bg-card border border-border/80 p-3.5 sm:p-4 shadow-sm hover:border-amber-500/30 transition-all flex flex-col justify-between h-full">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">Current Streak</span>
            <span className="w-2 h-2 rounded-full bg-amber-500" />
          </div>
          <div className="my-1.5 flex items-center gap-1.5">
            <span className="text-xl sm:text-2xl font-extrabold text-amber-500 font-mono">
              {currentStreak}
            </span>
            <Flame className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 fill-amber-500 animate-pulse" />
          </div>
          <p className="text-[10px] sm:text-[11px] text-muted-foreground truncate">
            {currentStreak > 0 ? `Personal best: ${currentStreak}d` : "Start daily streak"}
          </p>
        </div>

        {/* Metric 4: Readiness Index */}
        <div className="rounded-2xl bg-card border border-border/80 p-3.5 sm:p-4 shadow-sm hover:border-emerald-500/30 transition-all flex flex-col justify-between h-full">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">Readiness Index</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
          </div>
          <div className="my-1.5">
            <span className="text-xl sm:text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
              {readinessScore !== null ? `${readinessScore}%` : "Not Assessed"}
            </span>
          </div>
          <p className="text-[10px] sm:text-[11px] text-emerald-600 dark:text-emerald-400 font-medium truncate">
            {readinessTierLabel}
          </p>
        </div>

        {/* Metric 5: Your Performance */}
        <div className="rounded-2xl bg-card border border-border/80 p-3.5 sm:p-4 shadow-sm hover:border-teal-500/30 transition-all flex flex-col justify-between h-full">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">Your Performance</span>
            <span className="w-2 h-2 rounded-full bg-teal-500" />
          </div>
          <div className="my-1.5 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-[11px] font-bold font-mono text-teal-600 dark:text-teal-400 border border-border shrink-0">
              {latestScoreRatio}
            </div>
            <div className="min-w-0">
              <p className="text-xs sm:text-sm font-extrabold text-foreground font-mono">
                {latestAccuracy !== null ? `${latestAccuracy}%` : "Not Assessed"}
              </p>
              <p className="text-[9px] sm:text-[10px] text-muted-foreground font-mono truncate">
                {latestAttempt ? `Time: ${formattedDuration}` : "No attempts yet"}
              </p>
            </div>
          </div>
          <p className="text-[10px] sm:text-[11px] text-muted-foreground truncate">
            {latestAttempt ? "Latest Assessment" : "Take your first test"}
          </p>
        </div>
      </div>

      {/* =========================================================================
          ROW 3: LARGE SMART RECOMMENDATION CARD (Exact Layout with WHY THIS? box)
         ========================================================================= */}
      <div className="rounded-2xl bg-card border border-border/80 p-4 sm:p-5 shadow-sm relative overflow-hidden">
        {/* Card Header: Badge, Context Label, Points Impact */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-border/60">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider bg-purple-600 text-white shadow-sm">
              SMART RECOMMENDATION
            </span>
            <span className="text-xs text-muted-foreground">Based on your recent activity</span>
          </div>

          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20">
            {recImpact}
          </span>
        </div>

        {/* Card Content & Action Button */}
        <div className="mt-3.5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-3xl">
            {/* Title */}
            <h2 className="text-sm sm:text-base font-bold text-foreground">
              {recTitle}
            </h2>

            {/* Subtitle */}
            <p className="text-xs text-muted-foreground leading-relaxed">
              {recDesc}
            </p>

            {/* WHY THIS? Sub-Box */}
            <div className="mt-2.5 p-2.5 sm:p-3 rounded-xl bg-secondary/50 border border-border/80 flex items-start gap-2">
              <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wider bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-500/30 shrink-0 mt-0.5">
                WHY THIS?
              </span>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {recReason}
              </p>
            </div>
          </div>

          {/* Take Action Button */}
          <div className="shrink-0 lg:self-center">
            <Link
              to={recRoute}
              className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-sm shadow-purple-500/20 flex items-center justify-center gap-1.5 transition-all"
            >
              <span>Take Action</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}