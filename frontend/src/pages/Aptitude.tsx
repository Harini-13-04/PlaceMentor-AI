import React, { useState, useEffect } from "react";
import {
  APTITUDE_CATEGORIES,
  APTITUDE_TOPICS,
  APTITUDE_QUESTIONS,
  AptitudeCategory,
  AptitudeQuestion,
} from "@/data/aptitudeData";
import {
  Calculator,
  Brain,
  BarChart3,
  BookOpen,
  Clock,
  Sparkles,
  Zap,
  CheckCircle2,
  XCircle,
  Trophy,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Target,
  Flame,
  Award,
  ChevronRight,
  HelpCircle,
  Lightbulb,
  Percent,
  TrendingUp,
  Car,
  Shuffle,
  Dices,
  Coins,
  Scale,
  GitBranch,
  Users2,
  Binary,
  Compass,
  Calendar,
  PieChart,
  Table2,
  FileSpreadsheet,
  FileText,
  SpellCheck,
  AlignLeft,
  Quote,
} from "lucide-react";

export default function Aptitude() {
  // Navigation / Mode state
  const [activeCategory, setActiveCategory] = useState<AptitudeCategory>("Quantitative Aptitude");
  const [selectedTopic, setSelectedTopic] = useState<string>("Time & Work");
  const [selectedDifficulty, setSelectedDifficulty] = useState<"Easy" | "Medium" | "Hard">("Easy");

  // Mode: "browse" | "practice" | "placement-test" | "result"
  const [viewMode, setViewMode] = useState<"browse" | "practice" | "placement-test" | "result">("browse");

  // Practice session state
  const [activeQuestionList, setActiveQuestionList] = useState<AptitudeQuestion[]>([]);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Results state
  const [sessionReport, setSessionReport] = useState<{
    score: number;
    total: number;
    accuracy: number;
    timeSpent: string;
    strengths: string[];
    weakAreas: string[];
  } | null>(null);

  // Timer effect during active practice
  useEffect(() => {
    let interval: any;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setElapsedSeconds((s) => s + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  // Start Topic Practice in FULL PAGE mode
  const handleStartPractice = (category: AptitudeCategory, topic: string, diff: "Easy" | "Medium" | "Hard") => {
    setSelectedTopic(topic);
    setSelectedDifficulty(diff);
    const filtered = APTITUDE_QUESTIONS.filter(
      (q) => q.category === category && (q.topic === topic || topic === "All")
    );
    const questions = filtered.length > 0 ? filtered : APTITUDE_QUESTIONS.slice(0, 4);

    setActiveQuestionList(questions);
    setCurrentQuestionIdx(0);
    setUserAnswers({});
    setElapsedSeconds(0);
    setIsTimerRunning(true);
    setViewMode("practice");
  };

  // Start Mixed Placement Test (5 mixed questions from all categories) in FULL PAGE mode
  const handleStartPlacementTest = () => {
    const mixed = [
      APTITUDE_QUESTIONS.find((q) => q.category === "Quantitative Aptitude") || APTITUDE_QUESTIONS[0],
      APTITUDE_QUESTIONS.find((q) => q.category === "Logical Reasoning") || APTITUDE_QUESTIONS[5],
      APTITUDE_QUESTIONS.find((q) => q.category === "Data Interpretation") || APTITUDE_QUESTIONS[9],
      APTITUDE_QUESTIONS.find((q) => q.category === "Verbal Ability") || APTITUDE_QUESTIONS[12],
      APTITUDE_QUESTIONS[1],
    ];

    setActiveQuestionList(mixed);
    setCurrentQuestionIdx(0);
    setUserAnswers({});
    setElapsedSeconds(0);
    setIsTimerRunning(true);
    setViewMode("placement-test");
  };

  const handleSelectOption = (optIdx: number) => {
    setUserAnswers((prev) => ({
      ...prev,
      [currentQuestionIdx]: optIdx,
    }));
  };

  const handleSubmitSession = () => {
    setIsTimerRunning(false);

    let correctCount = 0;
    const strengths: string[] = [];
    const weakAreas: string[] = [];

    activeQuestionList.forEach((q, idx) => {
      if (userAnswers[idx] === q.correctIndex) {
        correctCount++;
        if (!strengths.includes(q.topic)) strengths.push(q.topic);
      } else {
        if (!weakAreas.includes(q.topic)) weakAreas.push(q.topic);
      }
    });

    const mins = Math.floor(elapsedSeconds / 60).toString().padStart(2, "0");
    const secs = (elapsedSeconds % 60).toString().padStart(2, "0");

    setSessionReport({
      score: correctCount,
      total: activeQuestionList.length,
      accuracy: Math.round((correctCount / activeQuestionList.length) * 100),
      timeSpent: `${mins}:${secs}`,
      strengths: strengths.length > 0 ? strengths : ["Fundamental Quantitative Concepts"],
      weakAreas: weakAreas.length > 0 ? weakAreas : ["None detected! Exemplary speed and accuracy."],
    });

    setViewMode("result");
  };

  const categoryIcons: Record<AptitudeCategory, any> = {
    "Quantitative Aptitude": Calculator,
    "Logical Reasoning": Brain,
    "Data Interpretation": BarChart3,
    "Verbal Ability": BookOpen,
  };

  // Helper to render distinct aesthetic visual header for each topic card matching Reference Image 2
  const renderTopicVisual = (topic: string) => {
    switch (topic) {
      case "Time & Work":
        return (
          <div className="w-full h-32 rounded-t-2xl bg-secondary/60 flex items-center justify-center border-b border-border">
            <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-600 dark:text-purple-400 shadow-sm">
              <Clock className="w-7 h-7" />
            </div>
          </div>
        );
      case "Percentages":
        return (
          <div className="w-full h-32 rounded-t-2xl bg-secondary/60 flex items-center justify-center border-b border-border">
            <div className="w-14 h-14 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-600 dark:text-teal-400 shadow-sm">
              <Percent className="w-7 h-7" />
            </div>
          </div>
        );
      case "Profit & Loss":
        return (
          <div className="w-full h-32 rounded-t-2xl bg-secondary/60 flex items-center justify-center border-b border-border">
            <div className="w-14 h-14 rounded-2xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-600 dark:text-orange-400 shadow-sm">
              <TrendingUp className="w-7 h-7" />
            </div>
          </div>
        );
      case "Speed, Time & Distance":
        return (
          <div className="w-full h-32 rounded-t-2xl bg-secondary/60 flex items-center justify-center border-b border-border">
            <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-600 dark:text-rose-400 shadow-sm">
              <Car className="w-7 h-7" />
            </div>
          </div>
        );
      case "Permutations & Combinations":
        return (
          <div className="w-full h-32 rounded-t-2xl bg-secondary/60 flex items-center justify-center border-b border-border">
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-sm">
              <Shuffle className="w-7 h-7" />
            </div>
          </div>
        );
      case "Probability":
        return (
          <div className="w-full h-32 rounded-t-2xl bg-secondary/60 flex items-center justify-center border-b border-border">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-sm">
              <Dices className="w-7 h-7" />
            </div>
          </div>
        );
      case "Simple & Compound Interest":
        return (
          <div className="w-full h-32 rounded-t-2xl bg-secondary/60 flex items-center justify-center border-b border-border">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-400 shadow-sm">
              <Coins className="w-7 h-7" />
            </div>
          </div>
        );
      case "Ratios & Proportions":
        return (
          <div className="w-full h-32 rounded-t-2xl bg-secondary/60 flex items-center justify-center border-b border-border">
            <div className="w-14 h-14 rounded-2xl bg-pink-500/10 border border-pink-500/30 flex items-center justify-center text-pink-600 dark:text-pink-400 shadow-sm">
              <Scale className="w-7 h-7" />
            </div>
          </div>
        );
      case "Blood Relations":
        return (
          <div className="w-full h-32 rounded-t-2xl bg-secondary/60 flex items-center justify-center border-b border-border">
            <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-600 dark:text-rose-400 shadow-sm">
              <GitBranch className="w-7 h-7" />
            </div>
          </div>
        );
      case "Seating Arrangement":
        return (
          <div className="w-full h-32 rounded-t-2xl bg-secondary/60 flex items-center justify-center border-b border-border">
            <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-600 dark:text-purple-400 shadow-sm">
              <Users2 className="w-7 h-7" />
            </div>
          </div>
        );
      case "Number Series":
      case "Coding-Decoding":
        return (
          <div className="w-full h-32 rounded-t-2xl bg-secondary/60 flex items-center justify-center border-b border-border">
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-600 dark:text-cyan-400 shadow-sm">
              <Binary className="w-7 h-7" />
            </div>
          </div>
        );
      case "Pie Charts Distribution":
        return (
          <div className="w-full h-32 rounded-t-2xl bg-secondary/60 flex items-center justify-center border-b border-border">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-sm">
              <PieChart className="w-7 h-7" />
            </div>
          </div>
        );
      case "Bar Charts & Growth":
      case "Table Analysis":
        return (
          <div className="w-full h-32 rounded-t-2xl bg-secondary/60 flex items-center justify-center border-b border-border">
            <div className="w-14 h-14 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-600 dark:text-teal-400 shadow-sm">
              <Table2 className="w-7 h-7" />
            </div>
          </div>
        );
      default:
        return (
          <div className="w-full h-32 rounded-t-2xl bg-secondary/60 flex items-center justify-center border-b border-border">
            <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-600 dark:text-purple-400 shadow-sm">
              <Calculator className="w-7 h-7" />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6 font-sans text-foreground">
      {/* =========================================================================
          VIEW 1: BROWSE CURRICULUM & CATEGORIES (3-Column Reference Image Layout)
         ========================================================================= */}
      {viewMode === "browse" && (
        <>
          {/* Header & Mixed Placement Test Hero */}
          <div className="p-6 sm:p-8 rounded-2xl border border-purple-500/25 bg-gradient-to-br from-purple-500/10 via-card to-card dark:from-purple-950/40 dark:via-secondary dark:to-card shadow-sm relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 relative z-10">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-700 dark:text-purple-300 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Placement Aptitude Engine</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground font-display">
                Aptitude & Reasoning Master
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground font-medium max-w-xl leading-relaxed">
                Quantitative Aptitude, Logical Reasoning, DI, and Verbal screening questions with instant step-by-step formula shortcuts.
              </p>
            </div>

            {/* Placement Test CTA Banner */}
            <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 shrink-0 space-y-2.5 max-w-xs relative z-10">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-700 dark:text-amber-300 flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-amber-500 fill-amber-500" /> Mixed Placement Mock
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/20 text-amber-700 dark:text-amber-300 font-bold">
                  20 Mins
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground">
                All 4 aptitude sections combined to simulate Tier-1 placement screening tests.
              </p>
              <button
                onClick={handleStartPlacementTest}
                className="w-full py-2 px-3 rounded-lg bg-gradient-to-r from-amber-500 to-purple-600 hover:opacity-95 text-white text-xs font-bold shadow-md flex items-center justify-center gap-1.5 transition-all"
              >
                <span>Start Placement Mock</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none select-none">
            {APTITUDE_CATEGORIES.map((cat) => {
              const Icon = categoryIcons[cat];
              const isSelected = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => {
                    setActiveCategory(cat);
                    setSelectedTopic(APTITUDE_TOPICS[cat][0]);
                  }}
                  className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                    isSelected
                      ? "bg-purple-600 text-white shadow-sm shadow-purple-600/30 border border-purple-500"
                      : "border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{cat}</span>
                </button>
              );
            })}
          </div>

          {/* 3-Column Topic Cards Grid matching Reference Image 2 */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-foreground">
                {activeCategory} Topics
              </h3>
              <span className="text-xs font-mono text-muted-foreground">
                {APTITUDE_TOPICS[activeCategory].length} Core Topics
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {APTITUDE_TOPICS[activeCategory].map((topic) => {
                const qCount = APTITUDE_QUESTIONS.filter((q) => q.topic === topic).length || 4;
                return (
                  <div
                    key={topic}
                    className="rounded-2xl border border-border bg-card hover:border-purple-500/40 transition-all shadow-sm flex flex-col justify-between overflow-hidden group"
                  >
                    {/* Visual Area at Top matching Reference Image */}
                    {renderTopicVisual(topic)}

                    {/* Card Content Area */}
                    <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                      <div className="space-y-1.5">
                        {/* Badges Row: [X questions] in blue pill and Tier-1 on right */}
                        <div className="flex items-center justify-between">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                            {qCount} {qCount === 1 ? "question" : "questions"}
                          </span>
                          <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                            Tier-1
                          </span>
                        </div>

                        {/* Topic Title */}
                        <h4 className="text-base font-bold text-foreground pt-1 tracking-tight">
                          {topic}
                        </h4>

                        {/* Subtitle */}
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          Master fundamental formulas and shortcuts.
                        </p>
                      </div>

                      {/* Difficulty Select Buttons Row */}
                      <div className="pt-3 border-t border-border flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          {(["Easy", "Medium", "Hard"] as const).map((diff) => (
                            <button
                              key={diff}
                              onClick={() => handleStartPractice(activeCategory, topic, diff)}
                              className="px-3 py-1 rounded-lg text-xs font-semibold border border-border bg-secondary hover:bg-purple-600 hover:text-white hover:border-purple-500 text-muted-foreground transition-all"
                            >
                              {diff}
                            </button>
                          ))}
                        </div>

                        <button
                          onClick={() => handleStartPractice(activeCategory, topic, "Easy")}
                          className="p-1.5 rounded-lg text-purple-600 dark:text-purple-400 hover:bg-purple-500/10 transition-colors"
                          title="Start Topic"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* =========================================================================
          VIEW 2: DEDICATED FULL-PAGE TEST WORKSPACE (NO POPUP MODAL!)
         ========================================================================= */}
      {(viewMode === "practice" || viewMode === "placement-test") && (
        <div className="w-full space-y-6">
          {/* Top Full-Width Navigation Bar */}
          <div className="p-4 rounded-2xl border border-border bg-card flex items-center justify-between shadow-sm">
            <button
              onClick={() => setViewMode("browse")}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-border text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
            >
              <ArrowLeft className="w-4 h-4" /> Exit Test
            </button>

            <div className="flex items-center gap-4">
              <span className="text-xs font-mono font-bold text-muted-foreground">
                Question <strong className="text-foreground text-sm">{currentQuestionIdx + 1}</strong> of {activeQuestionList.length}
              </span>

              <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-mono font-bold">
                <Clock className="w-4 h-4 animate-pulse" />
                <span>
                  {Math.floor(elapsedSeconds / 60).toString().padStart(2, "0")}:
                  {(elapsedSeconds % 60).toString().padStart(2, "0")}
                </span>
              </div>
            </div>
          </div>

          {/* Full-Page Question Experience Card */}
          <div className="p-6 sm:p-8 rounded-2xl border border-border bg-card shadow-sm space-y-6">
            {/* Header info */}
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-md bg-purple-500/15 text-purple-700 dark:text-purple-300 font-bold border border-purple-500/30">
                  {activeQuestionList[currentQuestionIdx]?.topic || "Aptitude"}
                </span>
                <span className="text-muted-foreground">&bull;</span>
                <span className="text-muted-foreground font-medium">{activeQuestionList[currentQuestionIdx]?.category}</span>
              </div>

              <span className="px-2.5 py-1 rounded text-xs font-bold bg-secondary border border-border text-foreground font-mono">
                {activeQuestionList[currentQuestionIdx]?.difficulty}
              </span>
            </div>

            {/* Question Text */}
            <h3 className="text-lg sm:text-xl font-bold text-foreground leading-relaxed">
              {activeQuestionList[currentQuestionIdx]?.question}
            </h3>

            {/* Options Rows */}
            <div className="space-y-3">
              {activeQuestionList[currentQuestionIdx]?.options.map((opt, optIdx) => {
                const isSelected = userAnswers[currentQuestionIdx] === optIdx;
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

            {/* Bottom Navigation & Submit Bar */}
            <div className="flex items-center justify-between pt-6 border-t border-border">
              <button
                disabled={currentQuestionIdx === 0}
                onClick={() => setCurrentQuestionIdx((i) => i - 1)}
                className="px-5 py-2.5 rounded-xl border border-border text-xs font-semibold text-muted-foreground hover:text-foreground disabled:opacity-30"
              >
                Previous Question
              </button>

              {currentQuestionIdx < activeQuestionList.length - 1 ? (
                <button
                  onClick={() => setCurrentQuestionIdx((i) => i + 1)}
                  className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-sm"
                >
                  Next Question
                </button>
              ) : (
                <button
                  onClick={handleSubmitSession}
                  className="px-7 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:opacity-95 text-white text-xs font-bold shadow-md transition-all"
                >
                  Submit Test & Review
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW 3: POST-SUBMISSION FULL-PAGE DIAGNOSTIC REPORT (NO POPUP MODAL!)
         ========================================================================= */}
      {viewMode === "result" && sessionReport && (
        <div className="w-full space-y-6">
          {/* Header Summary Card */}
          <div className="p-6 sm:p-8 rounded-2xl border border-purple-500/25 bg-gradient-to-br from-purple-500/10 via-card to-card dark:from-purple-950/40 dark:via-secondary dark:to-card text-center space-y-3 shadow-sm">
            <Trophy className="w-12 h-12 text-amber-500 dark:text-amber-400 mx-auto animate-bounce" />
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground">
              Performance Diagnostic Complete
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              You answered <span className="font-bold text-foreground">{sessionReport.score} of {sessionReport.total}</span> questions correctly in {sessionReport.timeSpent}.
            </p>

            <div className="grid grid-cols-3 gap-3 pt-3 max-w-lg mx-auto">
              <div className="p-3.5 rounded-xl bg-card border border-border">
                <p className="text-[11px] text-muted-foreground font-semibold">Score</p>
                <p className="text-xl font-mono font-bold text-purple-600 dark:text-purple-400">{sessionReport.score}/{sessionReport.total}</p>
              </div>
              <div className="p-3.5 rounded-xl bg-card border border-border">
                <p className="text-[11px] text-muted-foreground font-semibold">Accuracy</p>
                <p className="text-xl font-mono font-bold text-teal-600 dark:text-teal-400">{sessionReport.accuracy}%</p>
              </div>
              <div className="p-3.5 rounded-xl bg-card border border-border">
                <p className="text-[11px] text-muted-foreground font-semibold">Time Spent</p>
                <p className="text-xl font-mono font-bold text-amber-600 dark:text-amber-400">{sessionReport.timeSpent}</p>
              </div>
            </div>
          </div>

          {/* Question Breakdown with Formulas & Pro Shortcuts */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-foreground">Detailed Question Review & Speed Shortcuts</h3>

            {activeQuestionList.map((q, idx) => {
              const isCorrect = userAnswers[idx] === q.correctIndex;
              const userOpt = userAnswers[idx] !== undefined ? q.options[userAnswers[idx]] : "Not Answered";

              return (
                <div
                  key={idx}
                  className={`p-5 rounded-2xl border space-y-3 shadow-sm ${
                    isCorrect
                      ? "border-emerald-500/30 bg-emerald-500/5"
                      : "border-rose-500/30 bg-rose-500/5"
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-foreground font-mono">Q{idx + 1}. {q.topic}</span>
                    <span
                      className={`px-2.5 py-0.5 rounded font-bold ${
                        isCorrect ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400" : "bg-rose-500/15 text-rose-600 dark:text-rose-400"
                      }`}
                    >
                      {isCorrect ? "✓ Correct" : "✗ Incorrect"}
                    </span>
                  </div>

                  <p className="text-sm sm:text-base font-semibold text-foreground">{q.question}</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs font-mono">
                    <div className="p-2.5 rounded-lg bg-card border border-border">
                      <span className="text-muted-foreground">Your Answer: </span>
                      <span className={isCorrect ? "text-emerald-600 dark:text-emerald-400 font-bold" : "text-rose-600 dark:text-rose-400 font-bold"}>
                        {userOpt}
                      </span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-card border border-border">
                      <span className="text-muted-foreground">Correct Answer: </span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold">{q.options[q.correctIndex]}</span>
                    </div>
                  </div>

                  {/* Step-by-Step Math Explanation */}
                  <div className="p-3.5 rounded-xl bg-secondary/50 border border-border space-y-1 text-xs">
                    <p className="font-bold text-foreground flex items-center gap-1">
                      <HelpCircle className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" /> Explanation
                    </p>
                    <p className="text-muted-foreground leading-relaxed">{q.explanation}</p>
                  </div>

                  {/* PRO SHORTCUT / SPEED TRICK */}
                  {q.shortcutTrick && (
                    <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-1 text-xs">
                      <p className="font-bold text-amber-700 dark:text-amber-300 flex items-center gap-1.5">
                        <Lightbulb className="w-3.5 h-3.5 text-amber-500" /> Shortcut / Speed Trick
                      </p>
                      <p className="text-amber-900 dark:text-amber-200/90 font-mono text-[11px]">{q.shortcutTrick}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4">
            <button
              onClick={() => setViewMode("browse")}
              className="px-6 py-2.5 rounded-xl border border-border bg-card hover:bg-secondary text-xs font-semibold text-foreground transition-all"
            >
              Browse Other Topics
            </button>

            <button
              onClick={handleStartPlacementTest}
              className="px-7 py-2.5 rounded-xl text-xs font-bold text-white pm-btn-gradient shadow-md"
            >
              Try Another Mixed Test
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
