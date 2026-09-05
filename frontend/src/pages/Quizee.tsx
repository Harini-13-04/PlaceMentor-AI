import React, { useState, useEffect, useCallback } from "react";

import {
  QUIZ_CATEGORIES,
  QUIZ_QUESTIONS,
  QuizCategory,
  QuizQuestion,
} from "@/data/quizData";
import {
  HelpCircle,
  Zap,
  Clock,
  CheckCircle2,
  XCircle,
  Trophy,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  BookOpen,
  Database,
  Cpu,
  Globe,
  Layers,
  Code2,
  Users,
  Flame,
  AlertTriangle,
  Lightbulb,
} from "lucide-react";

export default function Quizee() {
  const [activeCategory, setActiveCategory] = useState<QuizCategory>("CS Fundamentals");
  const [viewMode, setViewMode] = useState<"browse" | "quiz" | "result">("browse");
  const [activeQuizTitle, setActiveQuizTitle] = useState<string>("Quick 5-Min Quiz");

  // Quiz active state
  const [activeQuestions, setActiveQuestions] = useState<QuizQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [timeRemaining, setTimeRemaining] = useState(300); // 5 mins
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Result state
  const [quizResult, setQuizResult] = useState<{
    score: number;
    total: number;
    accuracy: number;
    weakTopics: string[];
    strongTopics: string[];
  } | null>(null);

  const handleSubmitQuiz = useCallback(() => {
    setIsTimerRunning(false);

    let correct = 0;
    const weak: string[] = [];
    const strong: string[] = [];

    activeQuestions.forEach((q, idx) => {
      if (userAnswers[idx] === q.correctIndex) {
        correct++;
        if (!strong.includes(q.topic)) strong.push(q.topic);
      } else {
        if (!weak.includes(q.topic)) weak.push(q.topic);
      }
    });

    const accuracy = Math.round((correct / (activeQuestions.length || 1)) * 100);

    setQuizResult({
      score: correct,
      total: activeQuestions.length,
      accuracy,
      weakTopics: weak.length > 0 ? weak : ["None! Exemplary CS fundamentals mastery."],
      strongTopics: strong.length > 0 ? strong : ["Basic CS Knowledge"],
    });

    setViewMode("result");
  }, [activeQuestions, userAnswers]);

  // Countdown timer
  useEffect(() => {
    let interval: NodeJS.Timeout | number;
    if (isTimerRunning && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((t) => {
          if (t <= 1) {
            clearInterval(interval);
            handleSubmitQuiz();
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timeRemaining, handleSubmitQuiz]);

  // Mode 1: Quick 5-Minute Quiz
  const handleStartQuickQuiz = () => {
    setActiveQuizTitle("Quick 5-Minute Quiz");
    const subset = QUIZ_QUESTIONS.slice(0, 5);
    setActiveQuestions(subset);
    setCurrentIdx(0);
    setUserAnswers({});
    setTimeRemaining(300);
    setIsTimerRunning(true);
    setViewMode("quiz");
  };

  // Mode 2: Daily Placement Quiz
  const handleStartDailyQuiz = () => {
    setActiveQuizTitle("Daily Placement Screening Quiz");
    // Pick 5 high-yield mixed CS questions
    const dailySet = [
      QUIZ_QUESTIONS[0],
      QUIZ_QUESTIONS[3],
      QUIZ_QUESTIONS[6],
      QUIZ_QUESTIONS[8],
      QUIZ_QUESTIONS[11],
    ];
    setActiveQuestions(dailySet);
    setCurrentIdx(0);
    setUserAnswers({});
    setTimeRemaining(300);
    setIsTimerRunning(true);
    setViewMode("quiz");
  };

  // Mode 3: Category Practice Quiz
  const handleStartCategoryQuiz = (cat: QuizCategory) => {
    setActiveQuizTitle(`${cat} Practice Quiz`);
    const filtered = QUIZ_QUESTIONS.filter((q) => q.category === cat);
    const subset = filtered.length > 0 ? filtered : QUIZ_QUESTIONS.slice(0, 5);
    setActiveQuestions(subset);
    setCurrentIdx(0);
    setUserAnswers({});
    setTimeRemaining(300);
    setIsTimerRunning(true);
    setViewMode("quiz");
  };

  const handleSelectOption = (optIdx: number) => {
    setUserAnswers((prev) => ({
      ...prev,
      [currentIdx]: optIdx,
    }));
  };

  const categoryIcons: Record<QuizCategory, React.ComponentType<{ className?: string }>> = {
    "CS Fundamentals": Cpu,
    "DBMS": Database,
    "Operating Systems": Layers,
    "Computer Networks": Globe,
    "OOP": Code2,
    "SQL": Database,
    "HR & Interview": Users,
    "General Placement": BookOpen,
  };


  return (
    <div className="space-y-6 font-sans text-foreground">
      {/* =========================================================================
          VIEW 1: BROWSE QUIZZES & MODES
         ========================================================================= */}
      {viewMode === "browse" && (
        <>
          {/* Header & 2-Quiz Modes Banner */}
          <div className="p-6 sm:p-8 rounded-2xl border border-purple-500/25 bg-gradient-to-br from-purple-500/10 via-card to-card dark:from-purple-950/40 dark:via-secondary dark:to-card shadow-sm relative overflow-hidden flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2 relative z-10 max-w-xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-700 dark:text-purple-300 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Placement Screening MCQs</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground font-display">
                Quizee Placement Rapid MCQs
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground font-medium leading-relaxed">
                Fast-paced placement quizzes for DBMS, Operating Systems, Computer Networks, OOP, and HR screening with instant explanations.
              </p>
            </div>

            {/* 2 Quick Modes */}
            <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap relative z-10">
              {/* Mode 1: Quick 5-Min Quiz */}
              <div className="p-4 rounded-xl border border-purple-500/30 bg-purple-500/10 shrink-0 space-y-2 w-full sm:w-48">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-purple-700 dark:text-purple-300 flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 fill-purple-400" /> Quick 5-Min
                  </span>
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-purple-500/20 text-purple-700 dark:text-purple-300 font-bold">
                    5 Qs
                  </span>
                </div>
                <p className="text-[10px] text-muted-foreground">5 rapid-fire questions testing CS core concepts.</p>
                <button
                  onClick={handleStartQuickQuiz}
                  className="w-full py-1.5 px-2.5 rounded-lg text-white text-[11px] font-bold shadow-sm flex items-center justify-center gap-1 pm-btn-gradient"
                >
                  <span>Start 5-Min</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              {/* Mode 2: Daily Placement Quiz */}
              <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 shrink-0 space-y-2 w-full sm:w-48">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-700 dark:text-amber-300 flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> Daily Quiz
                  </span>
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-amber-500/20 text-amber-700 dark:text-amber-300 font-bold">
                    Today
                  </span>
                </div>
                <p className="text-[10px] text-muted-foreground">Tier-1 campus recruitment screening batch.</p>
                <button
                  onClick={handleStartDailyQuiz}
                  className="w-full py-1.5 px-2.5 rounded-lg bg-gradient-to-r from-amber-500 to-purple-600 hover:opacity-95 text-white text-[11px] font-bold shadow-sm flex items-center justify-center gap-1"
                >
                  <span>Start Daily</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>

          {/* Categories Grid */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-foreground">Category Practice Quizzes</h3>
              <span className="text-xs font-mono text-muted-foreground">{QUIZ_CATEGORIES.length} Categories</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {QUIZ_CATEGORIES.map((cat) => {
                const Icon = categoryIcons[cat];
                const count = QUIZ_QUESTIONS.filter((q) => q.category === cat).length || 5;

                return (
                  <div
                    key={cat}
                    className="p-4 rounded-2xl border border-border bg-card hover:border-purple-500/40 transition-all space-y-3 shadow-sm flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="w-8 h-8 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-secondary text-muted-foreground border border-border">
                          {count} Questions
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-foreground pt-1">{cat}</h4>
                      <p className="text-[11px] text-muted-foreground leading-relaxed">ACID properties, B-Trees, normal forms, and design patterns.</p>
                    </div>

                    <button
                      onClick={() => handleStartCategoryQuiz(cat)}
                      className="w-full py-2 px-3 rounded-xl border border-purple-500/30 bg-purple-500/10 hover:bg-purple-500/20 text-purple-700 dark:text-purple-300 text-xs font-bold transition-all flex items-center justify-center gap-1"
                    >
                      <span>Take Quiz</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* =========================================================================
          VIEW 2: DEDICATED FULL-PAGE QUIZ WORKSPACE (NO POPUP MODAL!)
         ========================================================================= */}
      {viewMode === "quiz" && (
        <div className="w-full space-y-6">
          {/* Top Full-Width Header Bar */}
          <div className="p-4 rounded-2xl border border-border bg-card flex items-center justify-between shadow-sm">
            <button
              onClick={() => setViewMode("browse")}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-border text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
            >
              <ArrowLeft className="w-4 h-4" /> Exit Quiz
            </button>

            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-foreground">{activeQuizTitle}</span>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-xs font-mono font-bold text-muted-foreground">
                Question <strong className="text-foreground text-sm">{currentIdx + 1}</strong> of {activeQuestions.length}
              </span>

              <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-mono font-bold">
                <Clock className="w-4 h-4 animate-pulse" />
                <span>
                  {Math.floor(timeRemaining / 60).toString().padStart(2, "0")}:
                  {(timeRemaining % 60).toString().padStart(2, "0")}
                </span>
              </div>
            </div>
          </div>

          {/* Full-Page Question Experience Card */}
          <div className="p-6 sm:p-8 rounded-2xl border border-border bg-card shadow-sm space-y-6">
            <div className="flex items-center justify-between text-xs">
              <span className="px-3 py-1 rounded-md bg-purple-500/15 text-purple-700 dark:text-purple-300 font-bold border border-purple-500/30">
                {activeQuestions[currentIdx]?.category}
              </span>
              <span className="text-muted-foreground font-mono">{activeQuestions[currentIdx]?.topic}</span>
            </div>

            <h3 className="text-lg sm:text-xl font-bold text-foreground leading-relaxed">
              {activeQuestions[currentIdx]?.question}
            </h3>

            {/* Options List */}
            <div className="space-y-3">
              {activeQuestions[currentIdx]?.options.map((opt, optIdx) => {
                const isSelected = userAnswers[currentIdx] === optIdx;
                return (
                  <button
                    key={optIdx}
                    onClick={() => handleSelectOption(optIdx)}
                    className={`w-full p-4 rounded-xl border text-left text-sm font-medium transition-all flex items-center justify-between ${
                      isSelected
                        ? "bg-purple-600/15 border-purple-500 text-purple-900 dark:text-purple-200 shadow-sm"
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

            {/* Bottom Bar */}
            <div className="flex items-center justify-between pt-6 border-t border-border">
              <button
                disabled={currentIdx === 0}
                onClick={() => setCurrentIdx((i) => i - 1)}
                className="px-5 py-2.5 rounded-xl border border-border text-xs font-semibold text-muted-foreground hover:text-foreground disabled:opacity-30"
              >
                Previous Question
              </button>

              {currentIdx < activeQuestions.length - 1 ? (
                <button
                  onClick={() => setCurrentIdx((i) => i + 1)}
                  className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-sm"
                >
                  Next Question
                </button>
              ) : (
                <button
                  onClick={handleSubmitQuiz}
                  className="px-7 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:opacity-95 text-white text-xs font-bold shadow-md transition-all"
                >
                  Submit Quiz & Review
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW 3: DEDICATED FULL-PAGE REPORT & REVIEW (NO POPUP MODAL!)
         ========================================================================= */}
      {viewMode === "result" && quizResult && (
        <div className="w-full space-y-6">
          <div className="p-6 sm:p-8 rounded-2xl border border-purple-500/25 bg-gradient-to-br from-purple-500/10 via-card to-card dark:from-purple-950/40 dark:via-secondary dark:to-card text-center space-y-3 shadow-sm">
            <Trophy className="w-12 h-12 text-amber-500 dark:text-amber-400 mx-auto animate-bounce" />
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground">Quiz Evaluation Completed</h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              You scored <span className="font-bold text-foreground">{quizResult.score} of {quizResult.total}</span> ({quizResult.accuracy}% Accuracy).
            </p>

            <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto pt-2">
              <div className="p-3.5 rounded-xl bg-card border border-border">
                <p className="text-[10px] text-muted-foreground font-semibold">Correct</p>
                <p className="text-lg font-mono font-bold text-emerald-600 dark:text-emerald-400">{quizResult.score}</p>
              </div>
              <div className="p-3.5 rounded-xl bg-card border border-border">
                <p className="text-[10px] text-muted-foreground font-semibold">Accuracy</p>
                <p className="text-lg font-mono font-bold text-purple-600 dark:text-purple-400">{quizResult.accuracy}%</p>
              </div>
            </div>
          </div>

          {/* Detailed Question Review with Explanations */}
          <div className="space-y-3">
            <h3 className="text-base font-bold text-foreground">Detailed Question Review & Explanations</h3>

            {activeQuestions.map((q, idx) => {
              const isCorrect = userAnswers[idx] === q.correctIndex;
              return (
                <div
                  key={idx}
                  className={`p-4 rounded-xl border space-y-2 text-xs shadow-sm ${
                    isCorrect ? "border-emerald-500/30 bg-emerald-500/5" : "border-rose-500/30 bg-rose-500/5"
                  }`}
                >
                  <div className="flex items-center justify-between font-semibold">
                    <span className="text-foreground">Q{idx + 1}. {q.question}</span>
                    <span className={isCorrect ? "text-emerald-600 dark:text-emerald-400 font-bold" : "text-rose-600 dark:text-rose-400 font-bold"}>
                      {isCorrect ? "✓ Correct" : "✗ Incorrect"}
                    </span>
                  </div>

                  <p className="text-[11px] text-muted-foreground">
                    <strong>Correct Answer:</strong> {q.options[q.correctIndex]}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    <strong>Explanation:</strong> {q.explanation}
                  </p>
                </div>
              );
            })}
          </div>

          <button
            onClick={() => setViewMode("browse")}
            className="w-full py-3 rounded-xl text-xs font-bold text-white pm-btn-gradient shadow-md"
          >
            Back to All Quizzes
          </button>
        </div>
      )}
    </div>
  );
}
