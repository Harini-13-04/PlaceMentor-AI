import React, { useState, useEffect } from "react";
import { API_URL, getAuthHeaders } from "@/config";

import {
  APTITUDE_CATEGORIES,
  APTITUDE_TOPICS,
  AptitudeCategory,
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
  X,
  FileText,
  Layers,
  Activity,
  Check,
} from "lucide-react";

export default function Aptitude() {
  const [activeCategory, setActiveCategory] = useState<AptitudeCategory>("Quantitative Aptitude");
  const [selectedTopic, setSelectedTopic] = useState<string>("Time & Work");
  const [selectedDifficulty, setSelectedDifficulty] = useState<"Easy" | "Medium" | "Hard" | "Mixed">("Easy");
  const [questionCount, setQuestionCount] = useState<number>(5);
  const [timerEnabled, setTimerEnabled] = useState<boolean>(true);

  // View modes: "browse" | "practice" | "result"
  const [viewMode, setViewMode] = useState<"browse" | "practice" | "result">("browse");

  // Study Guide Modal State
  const [studyGuideTopic, setStudyGuideTopic] = useState<string | null>(null);
  const [studyGuideData, setStudyGuideData] = useState<any>(null);
  const [loadingGuide, setLoadingGuide] = useState(false);

  // Practice Configuration Modal State
  const [configTopic, setConfigTopic] = useState<string | null>(null);

  // Practice session state
  const [activeQuestions, setActiveQuestions] = useState<any[]>([]);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Result state
  const [sessionReport, setSessionReport] = useState<any>(null);

  // Timer loop
  useEffect(() => {
    let interval: any;
    if (isTimerRunning && timerEnabled) {
      interval = setInterval(() => {
        setElapsedSeconds((s) => s + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerEnabled]);

  // Fetch Study Guide
  const handleOpenStudyGuide = async (topic: string) => {
    setStudyGuideTopic(topic);
    setLoadingGuide(true);
    try {
      const res = await fetch(`${API_URL}/api/assessments/guide/${encodeURIComponent(topic)}`);
      if (res.ok) {
        const data = await res.json();
        setStudyGuideData(data);
      }
    } catch (err) {
      console.error("Failed to load study guide:", err);
    } finally {
      setLoadingGuide(false);
    }
  };

  // Launch Practice Session
  const handleStartSession = async (topic: string, category: string, diff: string, count: number) => {
    setConfigTopic(null);
    setSelectedTopic(topic);
    setSelectedDifficulty(diff as any);
    setQuestionCount(count);
    setUserAnswers({});
    setCurrentQuestionIdx(0);
    setElapsedSeconds(0);
    setIsSubmitting(false);

    try {
      const url = `${API_URL}/api/assessments/questions?assessment_type=aptitude&category=${encodeURIComponent(category)}&topic=${encodeURIComponent(topic)}&difficulty=${encodeURIComponent(diff)}&count=${count}`;
      const res = await fetch(url, {
        headers: getAuthHeaders(true),
      });

      if (res.ok) {
        const data = await res.json();
        setActiveQuestions(data.questions || []);
        setIsTimerRunning(true);
        setViewMode("practice");
      }
    } catch (err) {
      console.error("Failed to fetch assessment questions:", err);
    }
  };

  // Submit Practice Session
  const handleSubmitSession = async () => {
    setIsTimerRunning(false);
    setIsSubmitting(true);

    try {
      const res = await fetch(`${API_URL}/api/assessments/submit`, {
        method: "POST",
        headers: getAuthHeaders(true),
        body: JSON.stringify({
          assessment_type: "aptitude",
          category: activeCategory,
          topic: selectedTopic,
          difficulty: selectedDifficulty,
          answers: userAnswers,
          time_spent_seconds: elapsedSeconds,
        }),
      });


      if (res.ok) {
        const report = await res.json();
        setSessionReport(report);
        setViewMode("result");
      }
    } catch (err) {
      console.error("Failed to submit assessment:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentQ = activeQuestions[currentQuestionIdx];

  return (
    <div className="space-y-6 font-sans text-foreground">
      {/* =========================================================================
          VIEW 1: BROWSE TOPICS & CATEGORIES
         ========================================================================= */}
      {viewMode === "browse" && (
        <div className="space-y-6">
          {/* Header Banner */}
          <div className="p-6 sm:p-8 rounded-3xl border border-border bg-card shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
            <div className="space-y-2 max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold font-mono">
                <Calculator className="w-3.5 h-3.5" /> Campus Aptitude Screening Engine
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight font-display">
                Quantitative & Logical Aptitude Lab
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Master high-speed numerical methods, formula shortcuts, data interpretation charts, and deductive reasoning for TCS, Amazon, and Infosys campus rounds.
              </p>
            </div>

            {/* Category Mock Launch Card */}
            <div className="p-4 rounded-2xl border border-amber-500/30 bg-amber-500/10 space-y-2 text-center shrink-0 min-w-[220px]">
              <p className="text-xs font-bold text-amber-700 dark:text-amber-300">⚡ Category Mock Exam</p>
              <p className="text-[11px] text-muted-foreground">10 mixed questions from {activeCategory}</p>
              <button
                onClick={() => handleStartSession("Mock", activeCategory, "Mixed", 10)}
                className="w-full py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all shadow-sm"
              >
                Start {activeCategory.split(" ")[0]} Mock
              </button>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {APTITUDE_CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
                  activeCategory === cat
                    ? "bg-purple-600 text-white shadow-md shadow-purple-500/20"
                    : "bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                <Calculator className="w-3.5 h-3.5" />
                {cat}
              </button>
            ))}
          </div>

          {/* Topics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {(APTITUDE_TOPICS[activeCategory] || []).map((t: any) => (
              <div
                key={t.name}
                className="p-5 rounded-3xl border border-border bg-card hover:border-purple-500/40 transition-all duration-200 shadow-sm flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="w-8 h-8 rounded-xl bg-purple-500/15 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold text-xs">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <span className="px-2 py-0.5 rounded-md bg-secondary text-[10px] font-mono text-muted-foreground">
                      {t.questionCount || 10} Questions
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-foreground group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                      {t.name}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                      {t.description || "Core concepts, formula shortcuts, and diagnostic test sets."}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-border/60 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenStudyGuide(t.name)}
                    className="flex-1 py-2 rounded-xl border border-border hover:bg-secondary text-foreground text-xs font-semibold transition-colors flex items-center justify-center gap-1"
                  >
                    <FileText className="w-3.5 h-3.5 text-purple-500" />
                    Learn Concept
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfigTopic(t.name)}
                    className="flex-1 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1"
                  >
                    Practice <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW 2: ACTIVE PRACTICE / TEST SESSION (FULL-SCREEN EXPERIENCE)
         ========================================================================= */}
      {viewMode === "practice" && currentQ && (
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Header Bar */}
          <div className="p-4 rounded-2xl border border-border bg-card shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  if (window.confirm("Exit practice session? Current progress will be discarded.")) {
                    setIsTimerRunning(false);
                    setViewMode("browse");
                  }
                }}
                className="p-1.5 rounded-lg border border-border hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                title="Exit Practice"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div>
                <span className="text-xs font-bold text-foreground">{selectedTopic}</span>
                <p className="text-[10px] text-muted-foreground">{activeCategory} • {selectedDifficulty} Difficulty</p>
              </div>
            </div>

            {/* Timer & Question Progress */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-secondary font-mono text-xs font-bold text-foreground">
                <Clock className="w-3.5 h-3.5 text-purple-500" />
                <span>
                  {Math.floor(elapsedSeconds / 60)}:{String(elapsedSeconds % 60).padStart(2, "0")}
                </span>
              </div>
              <span className="text-xs font-bold text-purple-600 dark:text-purple-400 font-mono">
                {currentQuestionIdx + 1} / {activeQuestions.length}
              </span>
            </div>
          </div>

          {/* Question Card */}
          <div className="p-6 sm:p-8 rounded-3xl border border-border bg-card shadow-sm space-y-6">
            <div className="space-y-2">
              <span className="px-2.5 py-1 rounded-lg bg-purple-500/10 border border-purple-500/25 text-purple-600 dark:text-purple-400 text-[10px] font-bold font-mono uppercase">
                Question {currentQuestionIdx + 1}
              </span>
              <h2 className="text-base sm:text-lg font-bold text-foreground leading-relaxed whitespace-pre-wrap">
                {currentQ.question}
              </h2>
            </div>

            {/* Options List */}
            <div className="space-y-3">
              {(currentQ.options || []).map((opt: string, idx: number) => {
                const isSelected = userAnswers[currentQ.id] === idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setUserAnswers({ ...userAnswers, [currentQ.id]: idx })}
                    className={`w-full p-4 rounded-2xl border text-left text-xs font-medium transition-all flex items-center justify-between group ${
                      isSelected
                        ? "border-purple-500 bg-purple-500/15 text-purple-900 dark:text-purple-200 font-bold shadow-sm"
                        : "border-border bg-card hover:bg-secondary/60 text-foreground"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs font-mono border ${
                          isSelected
                            ? "bg-purple-600 text-white border-purple-600"
                            : "border-border bg-secondary text-muted-foreground group-hover:border-purple-400"
                        }`}
                      >
                        {String.fromCharCode(65 + idx)}
                      </div>
                      <span>{opt}</span>
                    </div>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-purple-600 dark:text-purple-400" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between p-2">
            <button
              disabled={currentQuestionIdx === 0}
              onClick={() => setCurrentQuestionIdx((i) => Math.max(0, i - 1))}
              className="px-4 py-2 rounded-xl border border-border text-xs font-semibold hover:bg-secondary disabled:opacity-30 transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Previous
            </button>

            {currentQuestionIdx < activeQuestions.length - 1 ? (
              <button
                onClick={() => setCurrentQuestionIdx((i) => Math.min(activeQuestions.length - 1, i + 1))}
                className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
              >
                Next <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                disabled={isSubmitting}
                onClick={handleSubmitSession}
                className="px-6 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 disabled:opacity-50"
              >
                {isSubmitting ? "Evaluating Results..." : "Submit Test"} <CheckCircle2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW 3: ASSESSMENT RESULT & DIAGNOSTICS REPORT
         ========================================================================= */}
      {viewMode === "result" && sessionReport && (
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Result Hero Banner */}
          <div className="p-6 sm:p-8 rounded-3xl border border-border bg-card shadow-sm space-y-6 text-center">
            <div className="w-14 h-14 rounded-3xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white mx-auto flex items-center justify-center shadow-lg">
              <Trophy className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold text-purple-600 dark:text-purple-400 font-mono uppercase">
                Diagnostic Assessment Complete
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground">
                Score: {sessionReport.score} / {sessionReport.total}
              </h2>
              <p className="text-xs text-muted-foreground">
                Accuracy: <strong className="text-foreground">{sessionReport.accuracy}%</strong> • Time:{" "}
                <strong className="text-foreground">{sessionReport.time_spent_seconds} seconds</strong>
              </p>
            </div>

            {/* Strengths & Weaknesses Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 space-y-1">
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Demonstrated Strengths
                </span>
                <p className="text-xs text-muted-foreground">
                  {sessionReport.strong_topics?.length > 0 ? sessionReport.strong_topics.join(", ") : "Solid overall effort."}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 space-y-1">
                <span className="text-xs font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4" /> Areas for Revision
                </span>
                <p className="text-xs text-muted-foreground">
                  {sessionReport.weak_topics?.length > 0 ? sessionReport.weak_topics.join(", ") : "None! Flawless topic accuracy."}
                </p>
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setViewMode("browse")}
                className="px-5 py-2.5 rounded-xl border border-border hover:bg-secondary text-xs font-semibold transition-colors"
              >
                Back to Topics
              </button>
              <button
                onClick={() => handleStartSession(selectedTopic, activeCategory, selectedDifficulty, questionCount)}
                className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Retry Session
              </button>
            </div>
          </div>

          {/* Detailed Question Review List */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <Activity className="w-4 h-4 text-purple-500" /> Question-by-Question Evaluation
            </h3>

            <div className="space-y-3">
              {(sessionReport.question_results || []).map((qr: any, idx: number) => (
                <div
                  key={idx}
                  className={`p-5 rounded-2xl border bg-card space-y-3 ${
                    qr.is_correct ? "border-emerald-500/30" : "border-rose-500/30"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <span className="font-bold text-xs text-foreground">
                      {idx + 1}. {qr.question}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold shrink-0 font-mono ${
                        qr.is_correct
                          ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                          : "bg-rose-500/15 text-rose-600 dark:text-rose-400"
                      }`}
                    >
                      {qr.is_correct ? "Correct ✓" : "Incorrect ✗"}
                    </span>
                  </div>

                  <div className="text-xs space-y-1 bg-secondary/50 p-3 rounded-xl">
                    <p className="text-muted-foreground">
                      Your answer:{" "}
                      <strong className={qr.is_correct ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}>
                        {qr.options?.[qr.selected_option] || "Not answered"}
                      </strong>
                    </p>
                    {!qr.is_correct && (
                      <p className="text-muted-foreground">
                        Correct answer: <strong className="text-emerald-600 dark:text-emerald-400">{qr.options?.[qr.correct_option]}</strong>
                      </p>
                    )}
                    {qr.explanation && (
                      <p className="text-[11px] text-muted-foreground pt-1 italic">
                        Explanation: {qr.explanation}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 1: LEARN CONCEPT & FORMULA SHEET
         ========================================================================= */}
      {studyGuideTopic && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-card border border-border rounded-3xl p-6 space-y-5 shadow-2xl max-h-[85vh] overflow-y-auto animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-purple-500/15 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                  <FileText className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-foreground">{studyGuideTopic} — Concept Guide</h3>
              </div>
              <button
                onClick={() => setStudyGuideTopic(null)}
                className="p-1 rounded-lg text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {loadingGuide ? (
              <p className="text-xs text-muted-foreground py-6 text-center">Loading concept guide...</p>
            ) : (
              <div className="space-y-4 text-xs">
                <div className="p-3.5 rounded-2xl bg-secondary/50 space-y-1">
                  <h4 className="font-bold text-foreground">Core Principle</h4>
                  <p className="text-muted-foreground leading-relaxed">{studyGuideData?.concept}</p>
                </div>

                {studyGuideData?.formulas && studyGuideData.formulas.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-bold text-foreground uppercase tracking-wider text-[11px]">Key Formulas</h4>
                    <div className="space-y-2">
                      {studyGuideData.formulas.map((f: any, idx: number) => (
                        <div key={idx} className="p-2.5 rounded-xl border border-border bg-card font-mono text-[11px]">
                          <span className="font-bold text-purple-600 dark:text-purple-400">{f.name}: </span>
                          <span className="text-foreground">{f.formula}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {studyGuideData?.examples && studyGuideData.examples.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-bold text-foreground uppercase tracking-wider text-[11px]">Worked Example</h4>
                    <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/25 space-y-1">
                      <p className="font-semibold text-foreground">{studyGuideData.examples[0].problem}</p>
                      <p className="text-muted-foreground italic">{studyGuideData.examples[0].solution}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            <button
              onClick={() => {
                const t = studyGuideTopic;
                setStudyGuideTopic(null);
                setConfigTopic(t);
              }}
              className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all shadow-sm"
            >
              Practice {studyGuideTopic} Now
            </button>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 2: PRACTICE CONFIGURATION MODAL
         ========================================================================= */}
      {configTopic && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-card border border-border rounded-3xl p-6 space-y-5 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-purple-500/15 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                  <Target className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-foreground">Configure Practice: {configTopic}</h3>
              </div>
              <button
                onClick={() => setConfigTopic(null)}
                className="p-1 rounded-lg text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Difficulty Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-foreground">Difficulty Level</label>
              <div className="grid grid-cols-4 gap-2">
                {["Easy", "Medium", "Hard", "Mixed"].map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setSelectedDifficulty(d as any)}
                    className={`py-2 rounded-xl border text-xs font-bold transition-all ${
                      selectedDifficulty === d
                        ? "border-purple-500 bg-purple-500/15 text-purple-600 dark:text-purple-400"
                        : "border-border bg-secondary/50 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Question Count Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-foreground">Number of Questions</label>
              <div className="grid grid-cols-4 gap-2">
                {[5, 10, 20, 30].map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setQuestionCount(c)}
                    className={`py-2 rounded-xl border text-xs font-bold transition-all font-mono ${
                      questionCount === c
                        ? "border-purple-500 bg-purple-500/15 text-purple-600 dark:text-purple-400"
                        : "border-border bg-secondary/50 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {c} Qs
                  </button>
                ))}
              </div>
            </div>

            {/* Timer Toggle */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-secondary/50 border border-border">
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-foreground">Enable Timed Mode</p>
                <p className="text-[10px] text-muted-foreground">Tracks solving speed per question</p>
              </div>
              <input
                type="checkbox"
                checked={timerEnabled}
                onChange={(e) => setTimerEnabled(e.target.checked)}
                className="w-4 h-4 accent-purple-600 cursor-pointer"
              />
            </div>

            <button
              onClick={() => handleStartSession(configTopic, activeCategory, selectedDifficulty, questionCount)}
              className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5"
            >
              Start Diagnostic Session <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
