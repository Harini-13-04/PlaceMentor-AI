import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import {
  Target,
  Clock,
  CheckCircle2,
  ChevronRight,
  Flame,
  Crown,
  Sparkles,
  Trophy,
  Award,
  ArrowLeft,
  ArrowRight,
  Check,
  AlertCircle,
  HelpCircle,
  BarChart3,
  Zap,
} from "lucide-react";

export interface DailyChallengePanelProps {
  onStartCustomChallenge?: () => void;
  className?: string;
  variant?: "full" | "card" | "kpi";
}

const SAMPLE_CHALLENGE_QUESTIONS = [

  {
    id: "dc-1",
    category: "Data Interpretation",
    difficulty: "Medium",
    question:
      "If a company's revenue increased by 30% and expenses decreased by 10%, what happened to the profit margin if original revenue was ₹100 and expenses were ₹60?",
    options: [
      "Increased from 40% to 58.4%",
      "Increased from 40% to 55%",
      "Decreased by 5%",
      "Remained unchanged",
    ],
    correctIndex: 0,
    explanation:
      "Original profit = 100 - 60 = 40 (40%). New revenue = 130, new expenses = 54. New profit = 130 - 54 = 76. Profit margin = 76 / 130 = 58.46%.",
  },
  {
    id: "dc-2",
    category: "Data Interpretation",
    difficulty: "Easy",
    question:
      "In a pie chart with total expenditure ₹2,40,000, Marketing occupies 54°. How much is spent on Marketing?",
    options: ["₹28,000", "₹36,000", "₹42,000", "₹48,000"],
    correctIndex: 1,
    explanation:
      "Fraction = 54° / 360° = 3/20 = 15%. Expenditure = 15% of 2,40,000 = ₹36,000.",
  },
  {
    id: "dc-3",
    category: "Logical Reasoning",
    difficulty: "Medium",
    question:
      "Find the odd one out in the number series: 3, 5, 9, 11, 15, 17, 21, 24",
    options: ["15", "17", "21", "24"],
    correctIndex: 3,
    explanation:
      "Alternating differences are +2, +4, +2, +4, +2, +4... 21 + 4 should be 25, not 24.",
  },
  {
    id: "dc-4",
    category: "Core CS",
    difficulty: "Easy",
    question:
      "Which data structure provides O(1) average lookup and insertion time?",
    options: ["Hash Table", "Binary Search Tree", "Linked List", "Array List"],
    correctIndex: 0,
    explanation:
      "Hash Tables compute bucket indices in O(1) average time via hash functions.",
  },
  {
    id: "dc-5",
    category: "DBMS",
    difficulty: "Easy",
    question:
      "What is the primary objective of a database foreign key constraint?",
    options: [
      "Referential Integrity",
      "Faster Disk Writes",
      "Table Compression",
      "Automatic Index Deletion",
    ],
    correctIndex: 0,
    explanation:
      "Foreign keys enforce Referential Integrity between related parent and child tables.",
  },
];

export default function DailyChallengePanel({
  className = "",
  variant = "full",
}: DailyChallengePanelProps) {
  // Full-page workspace state (replaces small floating modal)
  const [isFullPageMode, setIsFullPageMode] = useState(false);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(300); // 5 mins
  const [timerActive, setTimerActive] = useState(false);

  // Performance state
  const [userScore, setUserScore] = useState({
    solved: 4,
    total: 5,
    accuracy: 80,
    time: "03:42",
  });

  const [streakDays, setStreakDays] = useState([
    { day: "Mon", completed: true },
    { day: "Tue", completed: true },
    { day: "Wed", completed: true },
    { day: "Thu", completed: true },
    { day: "Fri", completed: true },
    { day: "Sat", completed: true, isToday: true },
    { day: "Sun", completed: false },
  ]);

  // Countdown timer loop
  useEffect(() => {
    let interval: NodeJS.Timeout | number;
    if (timerActive && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((t) => (t > 0 ? t - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive, timerSeconds]);


  // Start Full-Page Challenge Workspace
  const handleStartChallenge = () => {
    setIsFullPageMode(true);
    setCurrentQuestionIdx(0);
    setSelectedAnswers({});
    setIsSubmitted(false);
    setTimerSeconds(300);
    setTimerActive(true);
  };

  const handleSelectOption = (optIdx: number) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestionIdx]: optIdx,
    }));
  };

  const handleSubmitChallenge = () => {
    setTimerActive(false);
    setIsSubmitted(true);

    let correct = 0;
    SAMPLE_CHALLENGE_QUESTIONS.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctIndex) {
        correct++;
      }
    });

    const accuracy = Math.round((correct / SAMPLE_CHALLENGE_QUESTIONS.length) * 100);
    const elapsed = 300 - timerSeconds;
    const mins = Math.floor(elapsed / 60).toString().padStart(2, "0");
    const secs = (elapsed % 60).toString().padStart(2, "0");

    setUserScore({
      solved: correct,
      total: SAMPLE_CHALLENGE_QUESTIONS.length,
      accuracy,
      time: `${mins}:${secs}`,
    });

    setStreakDays((prev) =>
      prev.map((d) => (d.isToday ? { ...d, completed: true } : d))
    );
  };

  // =========================================================================
  // FULL-PAGE DEDICATED CHALLENGE WORKSPACE (Rendered cleanly via Portal)
  // =========================================================================
  const fullPageWorkspace = isFullPageMode ? (
    <div className="fixed inset-0 z-50 bg-background text-foreground flex flex-col p-4 sm:p-8 overflow-y-auto font-sans">
      <div className="w-full max-w-4xl mx-auto space-y-6 flex-1 flex flex-col justify-between">
        {/* Top Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-border shrink-0">
          <button
            onClick={() => setIsFullPageMode(false)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-border text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
          >
            <ArrowLeft className="w-4 h-4" /> Exit Challenge
          </button>

          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-purple-600/15 border border-purple-500/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <Target className="w-4 h-4" />
            </span>
            <span className="text-sm font-bold text-foreground">Today's Daily Challenge</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-xs font-mono font-bold text-muted-foreground">
              Question <strong className="text-foreground">{currentQuestionIdx + 1}</strong> of {SAMPLE_CHALLENGE_QUESTIONS.length}
            </span>

            <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-mono font-bold">
              <Clock className="w-4 h-4 animate-pulse" />
              <span>
                {Math.floor(timerSeconds / 60).toString().padStart(2, "0")}:
                {(timerSeconds % 60).toString().padStart(2, "0")}
              </span>
            </div>
          </div>
        </div>

        {/* Main Question Card */}
        {!isSubmitted ? (
          <div className="p-6 sm:p-8 rounded-2xl border border-border bg-card shadow-sm space-y-6 flex-1 flex flex-col justify-between my-2">
            <div className="space-y-6">
              <div className="flex items-center justify-between text-xs">
                <span className="px-3 py-1 rounded-md bg-purple-500/15 text-purple-700 dark:text-purple-300 font-bold border border-purple-500/30">
                  {SAMPLE_CHALLENGE_QUESTIONS[currentQuestionIdx].category}
                </span>
                <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-secondary border border-border text-foreground font-mono">
                  {SAMPLE_CHALLENGE_QUESTIONS[currentQuestionIdx].difficulty}
                </span>
              </div>

              <h3 className="text-lg sm:text-xl font-bold text-foreground leading-relaxed">
                {SAMPLE_CHALLENGE_QUESTIONS[currentQuestionIdx].question}
              </h3>

              {/* Options List */}
              <div className="space-y-3">
                {SAMPLE_CHALLENGE_QUESTIONS[currentQuestionIdx].options.map((opt, optIdx) => {
                  const isSelected = selectedAnswers[currentQuestionIdx] === optIdx;
                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleSelectOption(optIdx)}
                      className={`w-full p-4 rounded-xl border text-left text-sm font-medium transition-all flex items-center justify-between ${
                        isSelected
                          ? "bg-purple-600/15 border-purple-500 text-purple-900 dark:text-purple-200 shadow-sm font-semibold"
                          : "bg-secondary/40 border-border text-foreground hover:bg-secondary"
                      }`}
                    >
                      <span>{opt}</span>
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                          isSelected ? "border-purple-500 bg-purple-600 text-white" : "border-muted-foreground/40"
                        }`}
                      >
                        {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bottom Nav */}
            <div className="flex items-center justify-between pt-6 border-t border-border">
              <button
                disabled={currentQuestionIdx === 0}
                onClick={() => setCurrentQuestionIdx((i) => i - 1)}
                className="px-5 py-2.5 rounded-xl border border-border text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-secondary disabled:opacity-30 transition-all"
              >
                Previous Question
              </button>

              {currentQuestionIdx < SAMPLE_CHALLENGE_QUESTIONS.length - 1 ? (
                <button
                  onClick={() => setCurrentQuestionIdx((i) => i + 1)}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold text-white pm-btn-gradient flex items-center gap-1.5 shadow-md"
                >
                  <span>Next Question</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  onClick={handleSubmitChallenge}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 flex items-center gap-1.5 shadow-md transition-all"
                >
                  <Check className="w-4 h-4" />
                  <span>Submit Challenge</span>
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Results Breakdown */
          <div className="p-6 sm:p-8 rounded-2xl border border-border bg-card shadow-sm space-y-6 flex-1 flex flex-col justify-between my-2">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto text-2xl">
                🏆
              </div>
              <h3 className="text-2xl font-bold text-foreground">Daily Challenge Completed!</h3>
              <p className="text-sm text-muted-foreground">Great job! Your daily progress and streak have been recorded.</p>

              {/* Stat Pills */}
              <div className="grid grid-cols-3 gap-3 max-w-md mx-auto pt-4">
                <div className="p-3 rounded-xl bg-secondary border border-border">
                  <p className="text-[10px] text-muted-foreground font-semibold uppercase">Score</p>
                  <p className="text-lg font-bold font-mono text-purple-600 dark:text-purple-400">
                    {userScore.solved} / {userScore.total}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-secondary border border-border">
                  <p className="text-[10px] text-muted-foreground font-semibold uppercase">Accuracy</p>
                  <p className="text-lg font-bold font-mono text-teal-600 dark:text-teal-400">
                    {userScore.accuracy}%
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-secondary border border-border">
                  <p className="text-[10px] text-muted-foreground font-semibold uppercase">Time</p>
                  <p className="text-lg font-bold font-mono text-amber-600 dark:text-amber-400">
                    {userScore.time}
                  </p>
                </div>
              </div>
            </div>

            {/* Answer Key / Explanation */}
            <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Detailed Explanations</h4>
              {SAMPLE_CHALLENGE_QUESTIONS.map((q, idx) => {
                const userAns = selectedAnswers[idx];
                const isCorrect = userAns === q.correctIndex;
                return (
                  <div key={q.id} className="p-4 rounded-xl border border-border bg-secondary/40 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-foreground">Q{idx + 1}. {q.category}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${isCorrect ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400" : "bg-rose-500/20 text-rose-600 dark:text-rose-400"}`}>
                        {isCorrect ? "Correct" : "Incorrect"}
                      </span>
                    </div>
                    <p className="text-muted-foreground">{q.question}</p>
                    <p className="text-purple-700 dark:text-purple-300 text-[11px]"><strong className="text-foreground">Answer:</strong> {q.options[q.correctIndex]}</p>
                    <p className="text-[11px] text-muted-foreground bg-secondary/60 p-2 rounded-lg">{q.explanation}</p>
                  </div>
                );
              })}
            </div>

            {/* Close Button */}
            <div className="pt-4 border-t border-border flex justify-end">
              <button
                onClick={() => setIsFullPageMode(false)}
                className="px-6 py-2.5 rounded-xl text-xs font-bold text-white pm-btn-gradient shadow-md"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  ) : null;

  // 1. VARIANT: "card" (Used in the Top 3-Card Header Row: Level Up | Placement Roadmap | Daily Challenge)
  if (variant === "card") {
    return (
      <>
        {typeof document !== "undefined" && isFullPageMode && createPortal(fullPageWorkspace, document.body)}
        <div className={`p-6 rounded-2xl border border-border bg-card shadow-sm flex flex-col justify-between space-y-4 hover:border-purple-500/30 transition-all ${className}`}>
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-500 text-xs">
                🎯
              </span>
              <div>
                <h3 className="text-xs font-bold text-foreground">Daily Challenge</h3>
                <p className="text-[10px] text-muted-foreground font-mono">5 Questions &bull; 5 Minutes</p>
              </div>
            </div>
            <Link
              to="/placement-readiness"
              className="text-[11px] font-semibold text-purple-600 dark:text-purple-400 hover:underline transition-colors"
            >
              View All
            </Link>
          </div>

          {/* Body Box */}
          <div className="p-3.5 rounded-xl border border-purple-500/25 bg-gradient-to-br from-purple-500/10 via-card to-card dark:from-purple-950/40 dark:via-secondary dark:to-card space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-foreground">Data Interpretation</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30">
                Medium
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground leading-snug">
              Your DI accuracy dropped by 12% this week.
            </p>
          </div>

          {/* Start CTA Button */}
          <button
            onClick={handleStartChallenge}
            className="w-full py-2.5 px-3 rounded-xl text-xs font-bold text-white shadow-md flex items-center justify-center gap-1.5 transition-all bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 hover:opacity-95 active:scale-[0.99]"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Start Challenge</span>
          </button>
        </div>
      </>
    );
  }

  // 2. VARIANT: "kpi" (Used as the 5th card in the KPI row: Accuracy | Questions Solved | Streak | Readiness | Your Performance)
  if (variant === "kpi") {
    return (
      <>
        {typeof document !== "undefined" && isFullPageMode && createPortal(fullPageWorkspace, document.body)}
        <div className={`p-4 sm:p-5 rounded-2xl border border-border bg-card shadow-sm space-y-1.5 hover:border-teal-500/30 transition-all flex flex-col justify-between ${className}`}>
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-muted-foreground">Your Performance</p>
            <span className="w-2 h-2 rounded-full bg-teal-500" />
          </div>

          <div className="flex items-center gap-3 py-0.5">
            <div className="relative w-10 h-10 flex items-center justify-center shrink-0">
              <svg className="w-10 h-10 -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-border"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-teal-500 dark:text-teal-400"
                  strokeDasharray={`${userScore.accuracy}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <span className="absolute text-[10px] font-mono font-bold text-foreground">
                {userScore.solved}/{userScore.total}
              </span>
            </div>

            <div>
              <p className="text-base sm:text-lg font-extrabold text-teal-600 dark:text-teal-400 font-mono tracking-tight leading-none">
                {userScore.accuracy}%
              </p>
              <p className="text-[10px] text-muted-foreground font-mono mt-0.5">
                Time: {userScore.time}
              </p>
            </div>
          </div>

          <p className="text-[11px] text-muted-foreground">
            Daily Accuracy
          </p>
        </div>
      </>
    );
  }

  // 3. VARIANT: "full" (Default Side Panel view if used as standalone widget)
  return (
    <>
      {typeof document !== "undefined" && isFullPageMode && createPortal(fullPageWorkspace, document.body)}

      <aside className={`w-full shrink-0 space-y-5 font-sans select-none ${className}`}>
        {/* Main Daily Challenge Card */}
        <div className="rounded-2xl border border-border bg-card p-5 space-y-4 shadow-sm relative overflow-hidden transition-all hover:border-purple-500/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-500 text-xs">
                🎯
              </span>
              <h3 className="text-sm font-bold text-foreground tracking-tight">Daily Challenge</h3>
            </div>
            <Link
              to="/placement-readiness"
              className="text-[11px] font-semibold text-purple-600 dark:text-purple-400 hover:underline transition-colors"
            >
              View All
            </Link>
          </div>

          <div className="p-4 rounded-xl border border-purple-500/25 bg-gradient-to-br from-purple-500/10 via-card to-card dark:from-purple-950/40 dark:via-secondary dark:to-card space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-600/15 border border-purple-500/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
                  <Target className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-foreground">Data Interpretation</p>
                  <p className="text-[10px] text-muted-foreground font-mono">5 Questions &bull; 5 Minutes</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30">
                Medium
              </span>
            </div>

            <div className="pt-1 text-[11px] text-muted-foreground leading-snug">
              <p className="font-semibold text-purple-700 dark:text-purple-300 text-[10px] uppercase tracking-wider">
                Recommended for you
              </p>
              <p className="text-muted-foreground mt-0.5">
                Your DI accuracy dropped by 12% this week.
              </p>
            </div>

            <button
              onClick={handleStartChallenge}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white shadow-md flex items-center justify-center gap-1.5 transition-all bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 hover:opacity-95 active:scale-[0.99]"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Start Challenge</span>
            </button>
          </div>
        </div>

        {/* Your Performance & Streak Card */}
        <div className="rounded-2xl border border-border bg-card p-5 space-y-4 shadow-sm relative overflow-hidden transition-all hover:border-purple-500/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-600 dark:text-teal-400 text-xs">
                <BarChart3 className="w-3.5 h-3.5" />
              </span>
              <h3 className="text-sm font-bold text-foreground tracking-tight">Your Performance</h3>
            </div>
            <span className="text-[11px] font-mono font-bold text-teal-600 dark:text-teal-400">
              {userScore.accuracy}% Avg
            </span>
          </div>

          <div className="p-3.5 rounded-xl border border-border bg-secondary/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative w-11 h-11 flex items-center justify-center shrink-0">
                <svg className="w-11 h-11 -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-border"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-teal-500 dark:text-teal-400"
                    strokeDasharray={`${userScore.accuracy}, 100`}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <span className="absolute text-[10px] font-mono font-bold text-foreground">
                  {userScore.solved}/{userScore.total}
                </span>
              </div>

              <div>
                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                  Recent Accuracy
                </p>
                <div className="flex items-center gap-3 text-xs font-mono mt-0.5">
                  <span>Score: <strong className="text-teal-600 dark:text-teal-400">{userScore.accuracy}%</strong></span>
                  <span>Time: <strong className="text-foreground">{userScore.time}</strong></span>
                </div>
              </div>
            </div>

            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </div>

          {/* 7 Day Challenge Streak */}
          <div className="space-y-2 pt-1 border-t border-border">
            <div className="flex items-center justify-between text-xs pt-1">
              <span className="font-bold text-foreground flex items-center gap-1.5">
                <span>7-Day Streak</span>
                <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              </span>
              <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                6/7 Active
              </span>
            </div>

            <div className="grid grid-cols-7 gap-1.5 text-center">
              {streakDays.map((s) => (
                <div key={s.day} className="space-y-1">
                  <span className="text-[10px] text-muted-foreground font-medium">{s.day}</span>
                  <div
                    className={`w-7 h-7 mx-auto rounded-full flex items-center justify-center text-xs transition-all ${
                      s.completed
                        ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/40"
                        : s.isToday
                        ? "bg-amber-500/20 text-amber-600 dark:text-amber-400 border-2 border-amber-500 animate-pulse font-bold"
                        : "bg-secondary text-muted-foreground border border-border"
                    }`}
                  >
                    {s.completed ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    ) : s.isToday ? (
                      "•"
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Weekly Milestone / Reward Card */}
          <div className="p-3 rounded-xl border border-amber-500/20 bg-amber-500/5 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Crown className="w-4 h-4 text-amber-500 dark:text-amber-400 shrink-0" />
              <div>
                <p className="font-bold text-foreground text-xs">Weekly Milestone</p>
                <div className="flex items-center gap-1 mt-1">
                  {["W1", "W2", "W3", "W4", "W5"].map((w, idx) => (
                    <span
                      key={w}
                      className={`px-1.5 py-0.2 text-[9px] font-mono rounded ${
                        idx === 3
                          ? "bg-amber-500 text-black font-bold"
                          : idx < 3
                          ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-semibold"
                          : "bg-secondary text-muted-foreground"
                      }`}
                    >
                      {w}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <span className="text-[10px] text-muted-foreground font-mono">1 day left</span>
          </div>
        </div>
      </aside>
    </>
  );
}
