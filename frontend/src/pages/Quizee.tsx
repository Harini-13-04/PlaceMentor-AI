import React, { useState, useEffect } from "react";
import { API_URL, getAuthHeaders } from "@/config";

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
  X,
  FileText,
  Target,
  Award,
  ChevronRight,
  Activity,
  Check,
} from "lucide-react";

interface QuizTopic {
  id: string;
  name: string;
  category: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

const QUIZ_TOPICS: QuizTopic[] = [
  {
    id: "Operating Systems",
    name: "Operating Systems",
    category: "Core CS",
    icon: Layers,
    description: "Processes, threads, CPU scheduling, virtual memory paging, and deadlock prevention.",
  },
  {
    id: "DBMS",
    name: "Database Systems (DBMS)",
    category: "Core CS",
    icon: Database,
    description: "ACID transactions, 1NF-3NF/BCNF normalization, indexing, and B+ Trees.",
  },
  {
    id: "Computer Networks",
    name: "Computer Networks",
    category: "Core CS",
    icon: Globe,
    description: "OSI & TCP/IP models, TCP 3-way handshake, UDP, DNS, and subnetting.",
  },
  {
    id: "OOP Concepts",
    name: "OOP & Design Principles",
    category: "Software Design",
    icon: Code2,
    description: "SOLID principles, polymorphism, encapsulation, inheritance, and design patterns.",
  },
  {
    id: "DSA",
    name: "Data Structures & Algorithms",
    category: "Algorithms",
    icon: Cpu,
    description: "Big-O complexities, balanced trees, graph algorithms, and dynamic programming.",
  },
  {
    id: "SQL",
    name: "SQL & Query Optimization",
    category: "Databases",
    icon: Database,
    description: "Joins, GROUP BY, HAVING, window functions, and indexing strategies.",
  },
  {
    id: "Software Engineering",
    name: "Software Engineering & Testing",
    category: "Engineering",
    icon: BookOpen,
    description: "Agile Scrum, Git branching workflows, CI/CD pipelines, and testing pyramids.",
  },
];

export default function Quizee() {
  const [viewMode, setViewMode] = useState<"browse" | "quiz" | "result">("browse");

  // Topic & Config state
  const [selectedTopic, setSelectedTopic] = useState<string>("Operating Systems");
  const [selectedDifficulty, setSelectedDifficulty] = useState<"Easy" | "Medium" | "Hard" | "Mixed">("Mixed");
  const [questionCount, setQuestionCount] = useState<number>(5);
  const [timerEnabled, setTimerEnabled] = useState<boolean>(true);
  const [isMixedMock, setIsMixedMock] = useState<boolean>(false);

  // Modal states
  const [configTopic, setConfigTopic] = useState<string | null>(null);
  const [studyGuideTopic, setStudyGuideTopic] = useState<string | null>(null);
  const [studyGuideData, setStudyGuideData] = useState<any>(null);
  const [loadingGuide, setLoadingGuide] = useState(false);

  // Active quiz session state
  const [activeQuestions, setActiveQuestions] = useState<any[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Result state
  const [quizReport, setQuizReport] = useState<any>(null);

  // Timer interval
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

  // Launch Quiz Session
  const handleStartSession = async (
    topic: string,
    diff: string,
    count: number,
    isMock: boolean = false
  ) => {
    setConfigTopic(null);
    setSelectedTopic(topic);
    setSelectedDifficulty(diff as any);
    setQuestionCount(count);
    setIsMixedMock(isMock);
    setUserAnswers({});
    setCurrentIdx(0);
    setElapsedSeconds(0);
    setIsSubmitting(false);

    try {
      let url = `${API_URL}/api/assessments/questions?assessment_type=quiz&difficulty=${encodeURIComponent(diff)}&count=${count}`;
      if (!isMock && topic) {
        url += `&topic=${encodeURIComponent(topic)}`;
      }

      const res = await fetch(url, {
        headers: getAuthHeaders(true),
      });

      if (res.ok) {
        const data = await res.json();
        setActiveQuestions(data.questions || []);
        setIsTimerRunning(true);
        setViewMode("quiz");
      }
    } catch (err) {
      console.error("Failed to start quiz session:", err);
    }
  };

  const handleSelectOption = (questionId: string, optIdx: number) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: optIdx,
    }));
  };

  const handleSubmitQuiz = async () => {
    setIsTimerRunning(false);
    setIsSubmitting(true);

    try {
      const res = await fetch(`${API_URL}/api/assessments/submit`, {
        method: "POST",
        headers: getAuthHeaders(true),
        body: JSON.stringify({
          assessment_type: "quiz",
          category: isMixedMock ? "Mixed CS Mock" : "CS Fundamentals",

          topic: isMixedMock ? "Mixed CS Placement Mock" : selectedTopic,
          difficulty: selectedDifficulty,
          answers: userAnswers,
          time_spent_seconds: elapsedSeconds,
        }),
      });

      if (res.ok) {
        const report = await res.json();
        setQuizReport(report);
        setViewMode("result");
      } else {
        // Fallback local calculation if offline/network error
        let correct = 0;
        const qResults = activeQuestions.map((q) => {
          const sel = userAnswers[q.id];
          const isCorrect = sel === q.correct_answer;
          if (isCorrect) correct++;
          return {
            question_id: q.id,
            question: q.question,
            options: q.options,
            user_answer: sel !== undefined ? sel : -1,
            correct_answer: q.correct_answer,
            is_correct: isCorrect,
            explanation: q.explanation || "No explanation provided.",
            formula: q.formula || "",
            topic: q.topic,
          };
        });

        const total = activeQuestions.length || 1;
        const accuracy = Math.round((correct / total) * 100);

        setQuizReport({
          score: correct,
          total: activeQuestions.length,
          accuracy,
          time_spent_seconds: elapsedSeconds,
          strengths: accuracy >= 70 ? [selectedTopic] : [],
          weaknesses: accuracy < 70 ? [selectedTopic] : [],
          question_results: qResults,
        });
        setViewMode("result");
      }
    } catch (err) {
      console.error("Failed to submit quiz:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 font-sans text-foreground">
      {/* =========================================================================
          VIEW 1: BROWSE QUIZZES & CORE CS TOPICS
         ========================================================================= */}
      {viewMode === "browse" && (
        <>
          {/* Hero Banner & Fast Modes */}
          <div className="p-6 sm:p-8 rounded-2xl border border-purple-500/25 bg-gradient-to-br from-purple-500/10 via-card to-card dark:from-purple-950/40 dark:via-secondary dark:to-card shadow-sm relative overflow-hidden flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2 relative z-10 max-w-xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-700 dark:text-purple-300 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Placement Screening MCQs</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground font-display">
                Core CS Placement Quizzes
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground font-medium leading-relaxed">
                Master Operating Systems, DBMS, Networks, OOP, SQL, and Software Engineering with timed evaluations, dynamic question rotation, and instant diagnostic breakdowns.
              </p>
            </div>

            {/* Quick Actions / Modes */}
            <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap relative z-10">
              {/* Quick 5-Min Quiz */}
              <div className="p-4 rounded-xl border border-purple-500/30 bg-purple-500/10 shrink-0 space-y-2 w-full sm:w-48">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-purple-700 dark:text-purple-300 flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 fill-purple-400" /> Quick 5-Min
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-purple-500/20 text-purple-700 dark:text-purple-300 font-bold">
                    5 Qs
                  </span>
                </div>
                <p className="text-[10px] text-muted-foreground">5 rapid-fire questions testing essential CS concepts.</p>
                <button
                  onClick={() => handleStartSession("Operating Systems", "Mixed", 5, false)}
                  className="w-full py-1.5 px-2.5 rounded-lg text-white text-[11px] font-bold shadow-sm flex items-center justify-center gap-1 pm-btn-gradient hover:opacity-95 transition-all"
                >
                  <span>Start 5-Min</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              {/* Mixed CS Placement Mock */}
              <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 shrink-0 space-y-2 w-full sm:w-52">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-700 dark:text-amber-300 flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> Mixed CS Mock
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-amber-500/20 text-amber-700 dark:text-amber-300 font-bold">
                    Comprehensive
                  </span>
                </div>
                <p className="text-[10px] text-muted-foreground">Full campus recruitment multi-subject test batch.</p>
                <button
                  onClick={() => handleStartSession("Mixed CS Placement Mock", "Mixed", 10, true)}
                  className="w-full py-1.5 px-2.5 rounded-lg bg-gradient-to-r from-amber-500 to-purple-600 hover:opacity-95 text-white text-[11px] font-bold shadow-sm flex items-center justify-center gap-1 transition-all"
                >
                  <span>Start Placement Mock</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>

          {/* Topics Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-foreground">Core CS Subjects & Domains</h3>
              <span className="text-xs font-mono text-muted-foreground">{QUIZ_TOPICS.length} Topics</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {QUIZ_TOPICS.map((topic) => {
                const Icon = topic.icon;
                return (
                  <div
                    key={topic.id}
                    className="p-5 rounded-2xl border border-border bg-card hover:border-purple-500/40 transition-all space-y-4 shadow-sm flex flex-col justify-between"
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between">
                        <div className="w-9 h-9 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
                          <Icon className="w-4.5 h-4.5" />
                        </div>
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-secondary text-muted-foreground border border-border">
                          {topic.category}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-foreground pt-1">{topic.name}</h4>
                      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                        {topic.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-border/50">
                      <button
                        onClick={() => handleOpenStudyGuide(topic.id)}
                        className="flex-1 py-2 px-2.5 rounded-xl border border-border hover:bg-secondary text-foreground text-xs font-semibold transition-all flex items-center justify-center gap-1"
                        title="Learn Concept & Cheat Sheet"
                      >
                        <FileText className="w-3.5 h-3.5 text-purple-500" />
                        <span>Concepts</span>
                      </button>

                      <button
                        onClick={() => setConfigTopic(topic.id)}
                        className="flex-1 py-2 px-2.5 rounded-xl border border-purple-500/30 bg-purple-500/10 hover:bg-purple-500/20 text-purple-700 dark:text-purple-300 text-xs font-bold transition-all flex items-center justify-center gap-1"
                      >
                        <span>Practice</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* =========================================================================
          VIEW 2: DEDICATED FULL-PAGE QUIZ WORKSPACE
         ========================================================================= */}
      {viewMode === "quiz" && activeQuestions.length > 0 && (
        <div className="w-full space-y-6">
          {/* Header Bar */}
          <div className="p-4 rounded-2xl border border-border bg-card flex items-center justify-between shadow-sm">
            <button
              onClick={() => setViewMode("browse")}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-border text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
            >
              <ArrowLeft className="w-4 h-4" /> Exit Quiz
            </button>

            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-foreground">
                {isMixedMock ? "Mixed CS Placement Mock" : selectedTopic}
              </span>
              <span className="text-xs px-2 py-0.5 rounded-md bg-secondary text-muted-foreground font-mono">
                {selectedDifficulty}
              </span>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-xs font-mono font-bold text-muted-foreground">
                Question <strong className="text-foreground text-sm">{currentIdx + 1}</strong> of {activeQuestions.length}
              </span>

              {timerEnabled && (
                <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-700 dark:text-purple-300 text-xs font-mono font-bold">
                  <Clock className="w-4 h-4 animate-pulse" />
                  <span>
                    {Math.floor(elapsedSeconds / 60).toString().padStart(2, "0")}:
                    {(elapsedSeconds % 60).toString().padStart(2, "0")}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Question Card */}
          <div className="p-6 sm:p-8 rounded-2xl border border-border bg-card shadow-sm space-y-6">
            <div className="flex items-center justify-between text-xs">
              <span className="px-3 py-1 rounded-md bg-purple-500/15 text-purple-700 dark:text-purple-300 font-bold border border-purple-500/30">
                {activeQuestions[currentIdx]?.category || "Core CS"}
              </span>
              <span className="text-muted-foreground font-mono">{activeQuestions[currentIdx]?.topic}</span>
            </div>

            <h3 className="text-lg sm:text-xl font-bold text-foreground leading-relaxed whitespace-pre-line">
              {activeQuestions[currentIdx]?.question}
            </h3>

            {/* Options List */}
            <div className="space-y-3">
              {activeQuestions[currentIdx]?.options?.map((opt: string, optIdx: number) => {
                const isSelected = userAnswers[activeQuestions[currentIdx]?.id] === optIdx;
                return (
                  <button
                    key={optIdx}
                    onClick={() => handleSelectOption(activeQuestions[currentIdx]?.id, optIdx)}
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

            {/* Bottom Navigation */}
            <div className="flex items-center justify-between pt-6 border-t border-border">
              <button
                disabled={currentIdx === 0}
                onClick={() => setCurrentIdx((i) => i - 1)}
                className="px-5 py-2.5 rounded-xl border border-border text-xs font-semibold text-muted-foreground hover:text-foreground disabled:opacity-30 transition-all"
              >
                Previous
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
                  disabled={isSubmitting}
                  onClick={handleSubmitQuiz}
                  className="px-7 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:opacity-95 text-white text-xs font-bold shadow-md transition-all flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <span>Evaluating Answers...</span>
                  ) : (
                    <>
                      <span>Submit Quiz & Review</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW 3: DEDICATED FULL-PAGE REPORT & REVIEW
         ========================================================================= */}
      {viewMode === "result" && quizReport && (
        <div className="w-full space-y-6">
          <div className="p-6 sm:p-8 rounded-2xl border border-purple-500/25 bg-gradient-to-br from-purple-500/10 via-card to-card dark:from-purple-950/40 dark:via-secondary dark:to-card text-center space-y-3 shadow-sm">
            <Trophy className="w-12 h-12 text-amber-500 dark:text-amber-400 mx-auto" />
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground">Quiz Evaluation Completed</h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              You scored <span className="font-bold text-foreground">{quizReport.score} of {quizReport.total}</span> ({quizReport.accuracy}% Accuracy).
            </p>

            <div className="grid grid-cols-3 gap-3 max-w-md mx-auto pt-2">
              <div className="p-3.5 rounded-xl bg-card border border-border">
                <p className="text-[10px] text-muted-foreground font-semibold">Correct</p>
                <p className="text-lg font-mono font-bold text-emerald-600 dark:text-emerald-400">{quizReport.score}</p>
              </div>
              <div className="p-3.5 rounded-xl bg-card border border-border">
                <p className="text-[10px] text-muted-foreground font-semibold">Accuracy</p>
                <p className="text-lg font-mono font-bold text-purple-600 dark:text-purple-400">{quizReport.accuracy}%</p>
              </div>
              <div className="p-3.5 rounded-xl bg-card border border-border">
                <p className="text-[10px] text-muted-foreground font-semibold">Time Spent</p>
                <p className="text-lg font-mono font-bold text-amber-600 dark:text-amber-400">{quizReport.time_spent_seconds}s</p>
              </div>
            </div>

            {/* Strengths & Weaknesses */}
            <div className="flex flex-wrap gap-2 justify-center pt-2">
              {quizReport.strengths?.map((s: string, idx: number) => (
                <span key={idx} className="px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 text-xs font-semibold border border-emerald-500/30">
                  Strength: {s}
                </span>
              ))}
              {quizReport.weaknesses?.map((w: string, idx: number) => (
                <span key={idx} className="px-2.5 py-1 rounded-full bg-rose-500/15 text-rose-700 dark:text-rose-300 text-xs font-semibold border border-rose-500/30">
                  Needs Review: {w}
                </span>
              ))}
            </div>
          </div>

          {/* Detailed Question Review with Explanations */}
          <div className="space-y-3">
            <h3 className="text-base font-bold text-foreground">Detailed Question Review & Explanations</h3>

            {quizReport.question_results?.map((q: any, idx: number) => {
              const isCorrect = q.is_correct;
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
                    <strong>Your Answer:</strong> {q.user_answer >= 0 && q.options ? q.options[q.user_answer] : "Unanswered"}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    <strong>Correct Answer:</strong> {q.options ? q.options[q.correct_answer] : ""}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    <strong>Explanation:</strong> {q.explanation}
                  </p>
                  {q.formula && (
                    <p className="text-[11px] font-mono text-purple-700 dark:text-purple-300 bg-purple-500/10 p-2 rounded-lg border border-purple-500/20">
                      <strong>Reference / Key Principle:</strong> {q.formula}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => handleStartSession(selectedTopic, selectedDifficulty, questionCount, isMixedMock)}
              className="flex-1 py-3 rounded-xl border border-purple-500/30 bg-purple-500/10 hover:bg-purple-500/20 text-purple-700 dark:text-purple-300 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retry Practice</span>
            </button>
            <button
              onClick={() => setViewMode("browse")}
              className="flex-1 py-3 rounded-xl text-xs font-bold text-white pm-btn-gradient shadow-md hover:opacity-95 transition-all"
            >
              Back to All Quizzes
            </button>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 1: STUDY GUIDE & CONCEPT CHEAT SHEET
         ========================================================================= */}
      {studyGuideTopic && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden max-h-[85vh] flex flex-col">
            <div className="p-4 border-b border-border flex items-center justify-between bg-secondary/30">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-500" />
                <h3 className="font-bold text-foreground text-sm sm:text-base">
                  {studyGuideTopic} — Concept Guide & Principles
                </h3>
              </div>
              <button
                onClick={() => setStudyGuideTopic(null)}
                className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-5 text-sm">
              {loadingGuide ? (
                <div className="py-12 text-center text-muted-foreground text-xs">
                  Loading concept principles and formulas...
                </div>
              ) : studyGuideData ? (
                <>
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-purple-700 dark:text-purple-400">
                      Core Concept Overview
                    </h4>
                    <p className="text-muted-foreground leading-relaxed text-xs sm:text-sm bg-secondary/30 p-3.5 rounded-xl border border-border">
                      {studyGuideData.concept}
                    </p>
                  </div>

                  {studyGuideData.formulas?.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-purple-700 dark:text-purple-400">
                        Key Formulas & Cheat Sheet
                      </h4>
                      <div className="space-y-2">
                        {studyGuideData.formulas.map((f: any, idx: number) => (
                          <div key={idx} className="p-3 rounded-xl bg-purple-500/5 border border-purple-500/20 text-xs">
                            <span className="font-bold text-foreground">{f.name}: </span>
                            <span className="font-mono text-purple-700 dark:text-purple-300 font-semibold">{f.formula}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {studyGuideData.examples?.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-purple-700 dark:text-purple-400">
                        Worked Example
                      </h4>
                      {studyGuideData.examples.map((ex: any, idx: number) => (
                        <div key={idx} className="p-3.5 rounded-xl bg-secondary/50 border border-border space-y-1.5 text-xs">
                          <p className="font-semibold text-foreground">Q: {ex.problem}</p>
                          <p className="text-muted-foreground">
                            <strong className="text-emerald-600 dark:text-emerald-400">Solution:</strong> {ex.solution}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="py-8 text-center text-muted-foreground text-xs">
                  No concept guide available yet for this topic.
                </div>
              )}
            </div>

            <div className="p-4 border-t border-border flex justify-end bg-secondary/20">
              <button
                onClick={() => setStudyGuideTopic(null)}
                className="px-5 py-2 rounded-xl text-xs font-bold text-white pm-btn-gradient"
              >
                Close Guide
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 2: PRACTICE CONFIGURATION MODAL
         ========================================================================= */}
      {configTopic && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border w-full max-w-md rounded-2xl shadow-xl overflow-hidden p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-purple-500" />
                <h3 className="font-bold text-foreground text-base">Configure Quiz: {configTopic}</h3>
              </div>
              <button
                onClick={() => setConfigTopic(null)}
                className="p-1 rounded-lg text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Difficulty Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-foreground">Difficulty Level</label>
              <div className="grid grid-cols-4 gap-2">
                {(["Easy", "Medium", "Hard", "Mixed"] as const).map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setSelectedDifficulty(d)}
                    className={`py-2 px-1 rounded-xl text-xs font-bold border transition-all text-center ${
                      selectedDifficulty === d
                        ? "bg-purple-600 text-white border-purple-600 shadow-sm"
                        : "bg-secondary/50 border-border text-foreground hover:bg-secondary"
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Question Count Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-foreground">Question Count</label>
              <div className="grid grid-cols-4 gap-2">
                {[5, 10, 15, 20].map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setQuestionCount(c)}
                    className={`py-2 px-1 rounded-xl text-xs font-bold border transition-all text-center ${
                      questionCount === c
                        ? "bg-purple-600 text-white border-purple-600 shadow-sm"
                        : "bg-secondary/50 border-border text-foreground hover:bg-secondary"
                    }`}
                  >
                    {c} Qs
                  </button>
                ))}
              </div>
            </div>

            {/* Timer Toggle */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/40 border border-border">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-purple-500" />
                <span className="text-xs font-semibold text-foreground">Enable Quiz Timer</span>
              </div>
              <input
                type="checkbox"
                checked={timerEnabled}
                onChange={(e) => setTimerEnabled(e.target.checked)}
                className="w-4 h-4 accent-purple-600 cursor-pointer"
              />
            </div>

            <div className="pt-2 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setConfigTopic(null)}
                className="flex-1 py-2.5 rounded-xl border border-border text-xs font-semibold text-muted-foreground hover:bg-secondary"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleStartSession(configTopic, selectedDifficulty, questionCount, false)}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white pm-btn-gradient shadow-md flex items-center justify-center gap-1.5"
              >
                <span>Start Quiz</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
