import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API_URL, getAuthHeaders } from "@/config";

import {
  APTITUDE_CATEGORIES,
  APTITUDE_CONCEPTS,
  AptitudeCategory,
  ConceptInfo,
  getConceptLearningContent,
  ConceptLearningContent,
  ChartData,
  APTITUDE_QUESTIONS,
} from "@/data/aptitudeData";

import { getConceptLesson, ConceptLesson } from "@/data/aptitudeLessonsData";

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
  Search,
  AlertTriangle,
  PieChart as PieChartIcon,
  Table as TableIcon,
  LineChart as LineChartIcon,
  Compass,
} from "lucide-react";

// Helper for URL slug generation
function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

// Find concept across all categories by ID, name, or slug
function findConcept(queryId: string): { concept: ConceptInfo; category: AptitudeCategory } | null {
  if (!queryId) return null;
  const qLower = queryId.toLowerCase().trim();
  const qSlug = slugify(queryId);

  for (const category of APTITUDE_CATEGORIES) {
    const concepts = APTITUDE_CONCEPTS[category] || [];
    for (const concept of concepts) {
      if (
        concept.id.toLowerCase() === qLower ||
        concept.name.toLowerCase() === qLower ||
        slugify(concept.name) === qSlug
      ) {
        return { concept, category };
      }
    }
  }

  // Handle common alias fallbacks
  if (qSlug.includes("percent")) {
    const cat = "Quantitative Aptitude";
    const c = APTITUDE_CONCEPTS[cat]?.find(x => x.name.includes("Percentage"));
    if (c) return { concept: c, category: cat };
  }
  if (qSlug.includes("time") && qSlug.includes("work")) {
    const cat = "Quantitative Aptitude";
    const c = APTITUDE_CONCEPTS[cat]?.find(x => x.name.includes("Time"));
    if (c) return { concept: c, category: cat };
  }
  if (qSlug.includes("syllogism")) {
    const cat = "Logical Reasoning";
    const c = APTITUDE_CONCEPTS[cat]?.find(x => x.name.includes("Syllogism"));
    if (c) return { concept: c, category: cat };
  }
  if (qSlug.includes("series")) {
    const cat = "Logical Reasoning";
    const c = APTITUDE_CONCEPTS[cat]?.find(x => x.name.includes("Series"));
    if (c) return { concept: c, category: cat };
  }
  if (qSlug.includes("bar")) {
    const cat = "Data Interpretation";
    const c = APTITUDE_CONCEPTS[cat]?.find(x => x.name.includes("Bar"));
    if (c) return { concept: c, category: cat };
  }
  if (qSlug.includes("table")) {
    const cat = "Data Interpretation";
    const c = APTITUDE_CONCEPTS[cat]?.find(x => x.name.includes("Table"));
    if (c) return { concept: c, category: cat };
  }
  if (qSlug.includes("reading") || qSlug.includes("comprehension")) {
    const cat = "Verbal Ability";
    const c = APTITUDE_CONCEPTS[cat]?.find(x => x.name.includes("Reading"));
    if (c) return { concept: c, category: cat };
  }
  if (qSlug.includes("error") || qSlug.includes("detection")) {
    const cat = "Verbal Ability";
    const c = APTITUDE_CONCEPTS[cat]?.find(x => x.name.includes("Error"));
    if (c) return { concept: c, category: cat };
  }

  return null;
}

// =========================================================================
// DATA INTERPRETATION CHART RENDERER
// =========================================================================

function DIChartViewer({ chart }: { chart: ChartData }) {
  if (!chart) return null;

  return (
    <div className="p-4 sm:p-5 rounded-2xl border border-purple-500/30 bg-purple-500/5 space-y-4 my-3">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold text-foreground flex items-center gap-2">
          {chart.type === "bar" && <BarChart3 className="w-4 h-4 text-purple-500" />}
          {chart.type === "pie" && <PieChartIcon className="w-4 h-4 text-purple-500" />}
          {chart.type === "line" && <LineChartIcon className="w-4 h-4 text-purple-500" />}
          {chart.type === "table" && <TableIcon className="w-4 h-4 text-purple-500" />}
          <span>{chart.title}</span>
        </h4>
        <span className="px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-600 dark:text-purple-400 text-[10px] font-mono font-bold uppercase">
          {chart.type} Dataset
        </span>
      </div>

      {/* BAR CHART */}
      {chart.type === "bar" && (
        <div className="space-y-2.5 pt-1">
          {chart.labels?.map((label, idx) => {
            const val = chart.series?.[0]?.data?.[idx] || 0;
            const maxVal = Math.max(...(chart.series?.[0]?.data || [100]));
            const pct = Math.round((val / maxVal) * 100);
            return (
              <div key={idx} className="space-y-1 text-xs">
                <div className="flex justify-between font-mono text-[11px]">
                  <span className="text-foreground font-semibold">{label}</span>
                  <span className="text-purple-600 dark:text-purple-400 font-bold">{val}</span>
                </div>
                <div className="w-full h-3 bg-secondary rounded-full overflow-hidden flex">
                  <div
                    className="h-full bg-gradient-to-r from-purple-600 to-indigo-500 rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* PIE CHART */}
      {chart.type === "pie" && (
        <div className="grid grid-cols-2 gap-2 pt-1">
          {chart.labels?.map((label, idx) => {
            const val = chart.series?.[0]?.data?.[idx] || 0;
            const colors = [
              "bg-purple-500/20 border-purple-500/40 text-purple-700 dark:text-purple-300",
              "bg-indigo-500/20 border-indigo-500/40 text-indigo-700 dark:text-indigo-300",
              "bg-amber-500/20 border-amber-500/40 text-amber-700 dark:text-amber-300",
              "bg-emerald-500/20 border-emerald-500/40 text-emerald-700 dark:text-emerald-300",
            ];
            return (
              <div
                key={idx}
                className={`p-2.5 rounded-xl border text-xs font-mono flex items-center justify-between ${colors[idx % colors.length]}`}
              >
                <span className="font-semibold">{label}</span>
                <span className="font-extrabold">{val}° / %</span>
              </div>
            );
          })}
        </div>
      )}

      {/* LINE GRAPH */}
      {chart.type === "line" && (
        <div className="pt-2">
          <div className="flex items-end justify-between h-32 pt-4 px-2 border-b border-l border-border">
            {chart.labels?.map((label, idx) => {
              const val = chart.series?.[0]?.data?.[idx] || 0;
              const maxVal = Math.max(...(chart.series?.[0]?.data || [100]));
              const heightPct = Math.max(15, Math.round((val / maxVal) * 100));
              return (
                <div key={idx} className="flex flex-col items-center gap-1 flex-1">
                  <span className="text-[10px] font-mono text-purple-600 dark:text-purple-400 font-bold">{val}k</span>
                  <div
                    className="w-3 bg-purple-600 rounded-t-sm transition-all duration-300 shadow-sm"
                    style={{ height: `${heightPct}%` }}
                  />
                  <span className="text-[10px] text-muted-foreground font-mono mt-1">{label}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TABLE */}
      {chart.type === "table" && (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-border bg-secondary/60">
                {chart.tableHeaders?.map((th, i) => (
                  <th key={i} className="p-2 font-bold text-foreground">
                    {th}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {chart.tableRows?.map((row, rIdx) => (
                <tr key={rIdx} className="border-b border-border/50 hover:bg-secondary/30">
                  {row.map((cell, cIdx) => (
                    <td key={cIdx} className="p-2 font-mono text-muted-foreground">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// =========================================================================
// MAIN APTITUDE MODULE COMPONENT
// =========================================================================

export default function Aptitude() {
  const { conceptId } = useParams<{ conceptId?: string }>();
  const navigate = useNavigate();

  const [activeCategory, setActiveCategory] = useState<AptitudeCategory>("Quantitative Aptitude");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // View modes: "browse" | "learn" | "practice" | "result" | "review" | "not-found"
  const [viewMode, setViewMode] = useState<"browse" | "learn" | "practice" | "result" | "review" | "not-found">("browse");

  // Learning Mode State
  const [learningConcept, setLearningConcept] = useState<ConceptInfo | null>(null);
  const [learningContent, setLearningContent] = useState<ConceptLesson | null>(null);
  const [quickCheckAnswer, setQuickCheckAnswer] = useState<number | null>(null);

  // User Persistence State
  const [learnedConcepts, setLearnedConcepts] = useState<Set<string>>(new Set());
  const [userTopicStats, setUserTopicStats] = useState<
    Record<string, { attempted: number; correct: number; last_accuracy?: number; learned?: boolean }>
  >({});
  const [loadingProgress, setLoadingProgress] = useState(false);

  // Practice Configuration Modal State
  const [configTopic, setConfigTopic] = useState<string | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string>("Percentages");
  const [selectedDifficulty, setSelectedDifficulty] = useState<"Easy" | "Medium" | "Hard" | "Mixed">("Easy");
  const [questionCount, setQuestionCount] = useState<number>(5);
  const [timerEnabled, setTimerEnabled] = useState<boolean>(true);

  // Active Practice session state
  const [activeQuestions, setActiveQuestions] = useState<any[]>([]);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Result & Review state
  const [sessionReport, setSessionReport] = useState<any>(null);

  // Route URL Parameter Sync
  useEffect(() => {
    if (conceptId) {
      const resolved = findConcept(conceptId);
      if (resolved) {
        setActiveCategory(resolved.category);
        setLearningConcept(resolved.concept);
        const lesson = getConceptLesson(resolved.concept.name, resolved.category);
        setLearningContent(lesson);
        setQuickCheckAnswer(null);
        setViewMode("learn");
      } else {
        setLearningConcept(null);
        setLearningContent(null);
        setViewMode("not-found");
      }
    } else {
      // If returning to base /aptitude, reset learn view to browse
      if (viewMode === "learn" || viewMode === "not-found") {
        setViewMode("browse");
        setLearningConcept(null);
        setLearningContent(null);
      }
    }
  }, [conceptId]);

  // Fetch real authenticated user progress from backend
  const fetchUserProgress = useCallback(async () => {
    setLoadingProgress(true);
    try {
      const res = await fetch(`${API_URL}/api/assessments/progress`, {
        headers: getAuthHeaders(true),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.learned_concepts) {
          setLearnedConcepts(new Set(data.learned_concepts));
        }
        if (data.topics) {
          setUserTopicStats(data.topics);
        }
      }
    } catch (err) {
      console.error("Failed to load user progress:", err);
    } finally {
      setLoadingProgress(false);
    }
  }, []);

  useEffect(() => {
    fetchUserProgress();
  }, [fetchUserProgress]);

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

  // Keyboard navigation during practice mode
  useEffect(() => {
    if (viewMode !== "practice" || !activeQuestions.length) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const currentQ = activeQuestions[currentQuestionIdx];
      if (!currentQ) return;

      if (["1", "a", "A"].includes(e.key)) {
        setUserAnswers((prev) => ({ ...prev, [currentQ.id]: 0 }));
      } else if (["2", "b", "B"].includes(e.key)) {
        setUserAnswers((prev) => ({ ...prev, [currentQ.id]: 1 }));
      } else if (["3", "c", "C"].includes(e.key)) {
        setUserAnswers((prev) => ({ ...prev, [currentQ.id]: 2 }));
      } else if (["4", "d", "D"].includes(e.key)) {
        setUserAnswers((prev) => ({ ...prev, [currentQ.id]: 3 }));
      } else if (e.key === "ArrowRight") {
        if (currentQuestionIdx < activeQuestions.length - 1) {
          setCurrentQuestionIdx((i) => i + 1);
        }
      } else if (e.key === "ArrowLeft") {
        if (currentQuestionIdx > 0) {
          setCurrentQuestionIdx((i) => i - 1);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [viewMode, activeQuestions, currentQuestionIdx]);

  // Launch Dedicated Concept Learning View
  const handleOpenLearnConcept = (concept: ConceptInfo) => {
    setLearningConcept(concept);
    const lesson = getConceptLesson(concept.name, activeCategory);
    setLearningContent(lesson);
    setQuickCheckAnswer(null);
    setViewMode("learn");
    const slug = slugify(concept.name);
    navigate(`/aptitude/concept/${slug}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Navigate Back to Aptitude Main View
  const handleBackToAptitude = () => {
    navigate("/aptitude");
    setViewMode("browse");
    setLearningConcept(null);
    setLearningContent(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Mark Concept as Learned & persist to backend
  const handleMarkConceptLearned = async () => {
    if (!learningConcept) return;
    const conceptName = learningConcept.name;

    try {
      await fetch(`${API_URL}/api/assessments/learn`, {
        method: "POST",
        headers: getAuthHeaders(true),
        body: JSON.stringify({
          concept: conceptName,
          category: activeCategory,
        }),
      });

      setLearnedConcepts((prev) => new Set([...prev, conceptName]));
      setUserTopicStats((prev) => ({
        ...prev,
        [conceptName]: { ...prev[conceptName], learned: true, attempted: prev[conceptName]?.attempted || 0, correct: prev[conceptName]?.correct || 0 },
      }));
    } catch (err) {
      console.error("Failed to mark concept learned:", err);
    }

    // Direct transition to practice!
    handleStartSession(conceptName, activeCategory, learningConcept.difficulty, 5);
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
        let fetchedQs = data.questions || [];

        // Fallback to local dataset if API returns empty
        if (!fetchedQs.length) {
          fetchedQs = APTITUDE_QUESTIONS.filter(
            (q) => q.category === category || q.topic === topic
          ).slice(0, count);
        }

        if (!fetchedQs.length) {
          fetchedQs = APTITUDE_QUESTIONS.slice(0, count);
        }

        setActiveQuestions(fetchedQs);
        setIsTimerRunning(true);
        setViewMode("practice");
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } catch (err) {
      console.error("Failed to fetch assessment questions:", err);
      // Fallback
      const fallback = APTITUDE_QUESTIONS.filter((q) => q.category === category).slice(0, count);
      setActiveQuestions(fallback.length ? fallback : APTITUDE_QUESTIONS.slice(0, count));
      setIsTimerRunning(true);
      setViewMode("practice");
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
        window.scrollTo({ top: 0, behavior: "smooth" });
        fetchUserProgress();
      }
    } catch (err) {
      console.error("Failed to submit assessment:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Concept statistics for current category
  const currentCategoryConcepts = APTITUDE_CONCEPTS[activeCategory] || [];
  const learnedInCurrentCat = currentCategoryConcepts.filter((c) => learnedConcepts.has(c.name)).length;
  const categoryProgressPct = Math.round((learnedInCurrentCat / (currentCategoryConcepts.length || 1)) * 100);

  const currentQ = activeQuestions[currentQuestionIdx];

  // Search filter
  const filteredConcepts = currentCategoryConcepts.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 font-sans text-foreground">
      {/* =========================================================================
          VIEW 1: BROWSE TOPICS & CATEGORIES (CONCEPT MAP & PROGRESS HEADER)
         ========================================================================= */}
      {viewMode === "browse" && (
        <div className="space-y-6">
          {/* Header & Category Stats Banner */}
          <div className="p-6 sm:p-8 rounded-3xl border border-border bg-card shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative overflow-hidden">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-600 dark:text-purple-400 text-xs font-bold font-mono">
                <Calculator className="w-3.5 h-3.5" /> Placement Preparation Mastery Hub
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight font-display">
                {activeCategory}
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Structured concept learning, speed formula shortcuts, data interpretation charts, and timed practice rounds for corporate recruitment exams.
              </p>

              {/* Progress Bar */}
              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between text-xs font-bold font-mono">
                  <span className="text-muted-foreground">Category Progress</span>
                  <span className="text-purple-600 dark:text-purple-400">
                    {learnedInCurrentCat} / {currentCategoryConcepts.length} Concepts Learned ({categoryProgressPct}%)
                  </span>
                </div>
                <div className="w-full h-2.5 bg-secondary rounded-full overflow-hidden flex">
                  <div
                    className="h-full bg-gradient-to-r from-purple-600 to-indigo-500 rounded-full transition-all duration-500"
                    style={{ width: `${categoryProgressPct}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Category Mock Exam Card */}
            <div className="p-5 rounded-2xl border border-purple-500/30 bg-purple-500/10 space-y-3 text-center shrink-0 min-w-[240px]">
              <div className="w-10 h-10 rounded-2xl bg-purple-600 text-white flex items-center justify-center mx-auto shadow-md">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-foreground">{activeCategory} Mock</p>
                <p className="text-[11px] text-muted-foreground">10 mixed diagnostic questions</p>
              </div>
              <button
                onClick={() => handleStartSession("Mock", activeCategory, "Mixed", 10)}
                className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5"
              >
                Start Category Mock <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Category Filter Tabs & Search Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
              {APTITUDE_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    setActiveCategory(cat);
                    setSearchQuery("");
                  }}
                  className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
                    activeCategory === cat
                      ? "bg-purple-600 text-white shadow-md shadow-purple-500/20"
                      : "bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  {cat === "Quantitative Aptitude" && <Calculator className="w-3.5 h-3.5" />}
                  {cat === "Logical Reasoning" && <Brain className="w-3.5 h-3.5" />}
                  {cat === "Data Interpretation" && <BarChart3 className="w-3.5 h-3.5" />}
                  {cat === "Verbal Ability" && <BookOpen className="w-3.5 h-3.5" />}
                  {cat}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative min-w-[220px]">
              <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search concepts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-2xl border border-border bg-card text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          {/* Concepts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredConcepts.map((concept) => {
              const isLearned = learnedConcepts.has(concept.name);
              const stats = userTopicStats[concept.name];
              const isAttempted = stats && stats.attempted > 0;
              const accuracy = stats?.last_accuracy ?? 0;

              return (
                <div
                  key={concept.id}
                  className={`p-5 rounded-3xl border bg-card hover:border-purple-500/40 transition-all duration-200 shadow-sm flex flex-col justify-between space-y-4 group ${
                    isLearned ? "border-emerald-500/30" : "border-border"
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono border ${
                            concept.difficulty === "Easy"
                              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
                              : concept.difficulty === "Medium"
                              ? "bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400"
                              : "bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400"
                          }`}
                        >
                          {concept.difficulty}
                        </span>
                        <span className="text-[10px] font-mono text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {concept.estimatedTime}
                        </span>
                      </div>

                      {isLearned ? (
                        <span className="px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold font-mono flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Learned
                        </span>
                      ) : isAttempted ? (
                        <span className="px-2 py-0.5 rounded-md bg-purple-500/15 text-purple-600 dark:text-purple-400 text-[10px] font-bold font-mono">
                          {accuracy}% Acc
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-md bg-secondary text-muted-foreground text-[10px] font-mono">
                          Not Started
                        </span>
                      )}
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-foreground group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                        {concept.name}
                      </h3>
                      <p className="text-xs text-muted-foreground line-clamp-2 mt-1 leading-relaxed">
                        {concept.description}
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-border/60 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenLearnConcept(concept)}
                      className={`flex-1 py-2.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                        isLearned
                          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/20"
                          : "border-border hover:bg-secondary text-foreground"
                      }`}
                    >
                      <BookOpen className="w-3.5 h-3.5 text-purple-500" />
                      {isLearned ? "Review Concept" : "Learn Concept"}
                    </button>

                    <button
                      type="button"
                      onClick={() => setConfigTopic(concept.name)}
                      className="flex-1 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5"
                    >
                      Practice <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW 2: DEDICATED CONCEPT LEARNING VIEW (12-PART STRUCTURE)
         ========================================================================= */}
      {viewMode === "learn" && learningConcept && learningContent && (
        <div className="max-w-4xl mx-auto space-y-8 pb-12">
          {/* Top Bar Navigation */}
          <div className="p-4 rounded-2xl border border-border bg-card shadow-sm flex items-center justify-between">
            <button
              onClick={handleBackToAptitude}
              className="px-3.5 py-2 rounded-xl border border-border hover:bg-secondary text-xs font-semibold text-foreground transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Aptitude
            </button>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-600 dark:text-purple-400 text-xs font-mono font-bold">
                {activeCategory}
              </span>
              <span className="px-3 py-1 rounded-lg bg-secondary text-foreground text-xs font-mono font-bold flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-purple-500" /> {learningConcept.estimatedTime}
              </span>
            </div>
          </div>

          {/* 1. CONCEPT TITLE (Hero Banner) */}
          <div className="p-6 sm:p-8 rounded-3xl border border-purple-500/30 bg-gradient-to-br from-purple-500/10 via-card to-indigo-500/10 shadow-sm space-y-4 relative overflow-hidden">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-purple-500/30 bg-purple-500/15 text-purple-600 dark:text-purple-400 text-xs font-bold font-mono">
                <BookOpen className="w-3.5 h-3.5" /> Placement Masterclass
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold font-mono border ${
                learningContent.difficulty === "Easy"
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
                  : learningContent.difficulty === "Medium"
                  ? "bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400"
                  : "bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400"
              }`}>
                {learningContent.difficulty}
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight font-display">
              {learningContent.title}
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-3xl">
              {learningContent.description}
            </p>
          </div>

          {/* 2. WHAT IS THIS CONCEPT? */}
          <div className="p-6 sm:p-8 rounded-3xl border border-border bg-card shadow-sm space-y-4">
            <div className="flex items-center gap-2.5 border-b border-border/60 pb-3">
              <div className="w-8 h-8 rounded-xl bg-purple-500/15 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold text-xs font-mono">
                1
              </div>
              <h2 className="text-base sm:text-lg font-bold text-foreground">
                What is this Concept?
              </h2>
            </div>

            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
              {learningContent.whatIsThis.intro}
            </p>

            {(learningContent.whatIsThis.exampleText || learningContent.whatIsThis.exampleMath) && (
              <div className="p-4 sm:p-5 rounded-2xl border border-purple-500/30 bg-purple-500/5 space-y-2">
                <p className="text-xs font-bold text-purple-700 dark:text-purple-300 flex items-center gap-1.5 font-mono">
                  <Sparkles className="w-3.5 h-3.5 text-purple-500" /> Basic Introductory Example
                </p>
                {learningContent.whatIsThis.exampleText && (
                  <p className="text-xs text-foreground font-medium">
                    {learningContent.whatIsThis.exampleText}
                  </p>
                )}
                {learningContent.whatIsThis.exampleMath && (
                  <pre className="p-3 rounded-xl bg-card border border-border font-mono text-xs text-purple-600 dark:text-purple-300 font-bold whitespace-pre-wrap">
                    {learningContent.whatIsThis.exampleMath}
                  </pre>
                )}
              </div>
            )}
          </div>

          {/* 3. WHY IS IT IMPORTANT FOR PLACEMENTS? */}
          <div className="p-6 sm:p-8 rounded-3xl border border-border bg-card shadow-sm space-y-4">
            <div className="flex items-center gap-2.5 border-b border-border/60 pb-3">
              <div className="w-8 h-8 rounded-xl bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs font-mono">
                2
              </div>
              <h2 className="text-base sm:text-lg font-bold text-foreground">
                Why is it Important for Placements?
              </h2>
            </div>

            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              {learningContent.whyItMatters.context}
            </p>

            {learningContent.whyItMatters.bullets && learningContent.whyItMatters.bullets.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                {learningContent.whyItMatters.bullets.map((b, idx) => (
                  <div key={idx} className="p-3 rounded-xl border border-border bg-secondary/30 flex items-start gap-2.5 text-xs text-foreground font-medium">
                    <Target className="w-4 h-4 text-purple-500 shrink-0 mt-0.5" />
                    <span>{b}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 4. CORE CONCEPT EXPLANATION */}
          <div className="p-6 sm:p-8 rounded-3xl border border-border bg-card shadow-sm space-y-5">
            <div className="flex items-center gap-2.5 border-b border-border/60 pb-3">
              <div className="w-8 h-8 rounded-xl bg-purple-500/15 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold text-xs font-mono">
                3
              </div>
              <h2 className="text-base sm:text-lg font-bold text-foreground">
                Core Concept Explanation
              </h2>
            </div>

            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
              {learningContent.coreExplanation.overview}
            </p>

            {learningContent.coreExplanation.subtopics && (
              <div className="space-y-4 pt-2">
                {learningContent.coreExplanation.subtopics.map((sub, idx) => (
                  <div key={idx} className="p-5 rounded-2xl border border-border bg-secondary/20 space-y-3">
                    <h3 className="text-xs sm:text-sm font-bold text-foreground flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-purple-500" />
                      {sub.title}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line">
                      {sub.content}
                    </p>
                    {sub.bulletPoints && sub.bulletPoints.length > 0 && (
                      <ul className="space-y-1.5 pt-1">
                        {sub.bulletPoints.map((bp, bIdx) => (
                          <li key={bIdx} className="text-xs text-foreground flex items-start gap-2">
                            <span className="text-purple-500 font-bold">•</span>
                            <span>{bp}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 5. IMPORTANT FORMULAS / RULES */}
          {learningContent.formulasOrRules && learningContent.formulasOrRules.items.length > 0 && (
            <div className="p-6 sm:p-8 rounded-3xl border border-border bg-card shadow-sm space-y-5">
              <div className="flex items-center gap-2.5 border-b border-border/60 pb-3">
                <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-xs font-mono">
                  4
                </div>
                <h2 className="text-base sm:text-lg font-bold text-foreground">
                  {learningContent.formulasOrRules.isMathematical ? "Important Formulas" : "Key Rules & Principles"}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {learningContent.formulasOrRules.items.map((item, idx) => (
                  <div key={idx} className="p-4 sm:p-5 rounded-2xl border border-amber-500/30 bg-amber-500/5 space-y-2.5 flex flex-col justify-between">
                    <div className="space-y-2">
                      <span className="text-xs font-bold text-amber-700 dark:text-amber-300 font-mono flex items-center gap-1.5">
                        <Calculator className="w-3.5 h-3.5 text-amber-500" /> {item.name}
                      </span>
                      <div className="p-3 rounded-xl bg-card border border-border font-mono text-xs font-bold text-foreground overflow-x-auto">
                        {item.formula}
                      </div>
                    </div>
                    {item.description && (
                      <p className="text-[11px] text-muted-foreground leading-relaxed">
                        {item.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 6. STEP-BY-STEP METHOD */}
          {learningContent.stepByStepMethod && learningContent.stepByStepMethod.steps.length > 0 && (
            <div className="p-6 sm:p-8 rounded-3xl border border-border bg-card shadow-sm space-y-5">
              <div className="flex items-center gap-2.5 border-b border-border/60 pb-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xs font-mono">
                  5
                </div>
                <h2 className="text-base sm:text-lg font-bold text-foreground">
                  Step-by-Step Solving Method
                </h2>
              </div>

              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {learningContent.stepByStepMethod.overview}
              </p>

              <div className="space-y-3 pt-1">
                {learningContent.stepByStepMethod.steps.map((step) => (
                  <div key={step.stepNumber} className="p-4 sm:p-5 rounded-2xl border border-border bg-secondary/30 space-y-2">
                    <div className="flex items-center gap-2.5">
                      <span className="px-2.5 py-0.5 rounded-lg bg-emerald-600 text-white font-mono text-xs font-bold">
                        Step {step.stepNumber}
                      </span>
                      <h3 className="text-xs sm:text-sm font-bold text-foreground">
                        {step.title}
                      </h3>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed pl-1">
                      {step.description}
                    </p>
                    {step.proTip && (
                      <div className="mt-2 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-700 dark:text-emerald-300 font-medium flex items-center gap-1.5">
                        <Lightbulb className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span><strong>Pro Tip:</strong> {step.proTip}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 7. SOLVED EXAMPLES */}
          {learningContent.solvedExamples && learningContent.solvedExamples.length > 0 && (
            <div className="p-6 sm:p-8 rounded-3xl border border-border bg-card shadow-sm space-y-5">
              <div className="flex items-center justify-between border-b border-border/60 pb-3 flex-wrap gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-purple-500/15 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold text-xs font-mono">
                    6
                  </div>
                  <h2 className="text-base sm:text-lg font-bold text-foreground">
                    Solved Placement Examples
                  </h2>
                </div>
                <span className="text-xs font-mono font-bold text-purple-600 dark:text-purple-400 px-2.5 py-1 rounded-lg bg-purple-500/10">
                  {learningContent.solvedExamples.length} Worked Solutions
                </span>
              </div>

              <div className="space-y-6">
                {learningContent.solvedExamples.map((ex) => (
                  <div key={ex.id} className="p-5 sm:p-6 rounded-2xl border border-border bg-secondary/20 space-y-4">
                    {/* Example Header */}
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <span className="text-xs font-extrabold text-foreground uppercase tracking-wide font-mono flex items-center gap-1.5">
                        <FileText className="w-4 h-4 text-purple-500" /> Example {ex.id}: {ex.title}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono border ${
                        ex.level === "Basic"
                          ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
                          : ex.level === "Medium"
                          ? "bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400"
                          : "bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400"
                      }`}>
                        {ex.level} Level
                      </span>
                    </div>

                    {/* Question Box */}
                    <div className="p-4 rounded-xl bg-card border border-border space-y-1">
                      <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 uppercase font-mono">
                        Question
                      </span>
                      <p className="text-xs sm:text-sm font-semibold text-foreground leading-relaxed whitespace-pre-wrap">
                        {ex.question}
                      </p>
                    </div>

                    {/* Step-by-Step Breakdown */}
                    <div className="space-y-2">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase font-mono">
                        Step-by-Step Solution
                      </span>
                      {ex.steps.map((st, sIdx) => (
                        <div key={sIdx} className="p-3 rounded-xl bg-card/60 border border-border/80 text-xs space-y-1">
                          <p className="font-bold text-purple-700 dark:text-purple-300 font-mono">
                            {st.stepTitle}
                          </p>
                          <p className="text-muted-foreground leading-relaxed">
                            {st.content}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Final Answer */}
                    <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-1">
                      <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase font-mono flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Final Answer
                      </span>
                      <p className="text-xs font-bold text-emerald-900 dark:text-emerald-200">
                        {ex.finalAnswer}
                      </p>
                    </div>

                    {/* Why Correct Explanation */}
                    <div className="p-3 rounded-xl bg-card border border-border text-xs text-muted-foreground leading-relaxed">
                      <strong className="text-foreground">Why this is correct: </strong>
                      {ex.whyCorrect}
                    </div>

                    {/* Shortcut Trick if available */}
                    {ex.shortcutTrick && (
                      <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-800 dark:text-amber-300 font-medium flex items-center gap-2">
                        <Zap className="w-4 h-4 text-amber-500 shrink-0" />
                        <span><strong>Speed Shortcut:</strong> {ex.shortcutTrick}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 8. SHORTCUTS / TRICKS */}
          {learningContent.shortcuts && learningContent.shortcuts.tricks.length > 0 && (
            <div className="p-6 sm:p-8 rounded-3xl border border-amber-500/30 bg-amber-500/5 shadow-sm space-y-5">
              <div className="flex items-center gap-2.5 border-b border-amber-500/25 pb-3">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-700 dark:text-amber-400 flex items-center justify-center font-bold text-xs font-mono">
                  7
                </div>
                <h2 className="text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-500" />
                  {learningContent.shortcuts.title || "Shortcuts & Speed Tricks"}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {learningContent.shortcuts.tricks.map((trick, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-card border border-amber-500/30 text-xs text-muted-foreground leading-relaxed flex items-start gap-2.5">
                    <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <span>{trick}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 9. COMMON MISTAKES */}
          {learningContent.commonMistakes && learningContent.commonMistakes.length > 0 && (
            <div className="p-6 sm:p-8 rounded-3xl border border-rose-500/30 bg-rose-500/5 shadow-sm space-y-5">
              <div className="flex items-center gap-2.5 border-b border-rose-500/25 pb-3">
                <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-700 dark:text-rose-400 flex items-center justify-center font-bold text-xs font-mono">
                  8
                </div>
                <h2 className="text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-500" /> Common Mistakes & Traps
                </h2>
              </div>

              <div className="space-y-3">
                {learningContent.commonMistakes.map((m, idx) => (
                  <div key={idx} className="p-4 sm:p-5 rounded-2xl bg-card border border-rose-500/25 space-y-2">
                    <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs font-medium text-rose-800 dark:text-rose-300 flex items-start gap-2">
                      <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                      <span><strong>Mistake:</strong> {m.mistake}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs font-medium text-emerald-800 dark:text-emerald-300 flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span><strong>Correct Approach:</strong> {m.correctApproach}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 10. PLACEMENT TIP */}
          {learningContent.placementTip && (
            <div className="p-6 sm:p-8 rounded-3xl border border-indigo-500/30 bg-gradient-to-br from-indigo-500/10 via-card to-purple-500/10 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase font-mono">
                <Award className="w-4 h-4" /> Recruiter Placement Tip
              </div>
              <p className="text-xs sm:text-sm font-semibold text-foreground leading-relaxed">
                "{learningContent.placementTip}"
              </p>
            </div>
          )}

          {/* 11. QUICK CHECK */}
          {learningContent.quickCheck && (
            <div className="p-6 sm:p-8 rounded-3xl border border-purple-500/30 bg-purple-500/5 shadow-sm space-y-5">
              <div className="flex items-center gap-2.5 border-b border-purple-500/25 pb-3">
                <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold text-xs font-mono">
                  10
                </div>
                <h2 className="text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-purple-500" /> Quick Concept Check
                </h2>
              </div>

              <p className="text-xs sm:text-sm font-bold text-foreground">
                {learningContent.quickCheck.question}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {learningContent.quickCheck.options.map((opt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setQuickCheckAnswer(idx)}
                    className={`p-3.5 rounded-xl border text-xs font-medium text-left transition-all flex items-center justify-between ${
                      quickCheckAnswer === idx
                        ? idx === learningContent.quickCheck.correctIndex
                          ? "border-emerald-500 bg-emerald-500/20 text-emerald-900 dark:text-emerald-200 font-bold"
                          : "border-rose-500 bg-rose-500/20 text-rose-900 dark:text-rose-200 font-bold"
                        : "border-border bg-card hover:bg-secondary text-foreground"
                    }`}
                  >
                    <span>{opt}</span>
                    {quickCheckAnswer === idx && (
                      idx === learningContent.quickCheck.correctIndex ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <XCircle className="w-4 h-4 text-rose-500" />
                      )
                    )}
                  </button>
                ))}
              </div>

              {quickCheckAnswer !== null && (
                <div className={`p-4 rounded-xl border text-xs leading-relaxed space-y-1.5 ${
                  quickCheckAnswer === learningContent.quickCheck.correctIndex
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-900 dark:text-emerald-200"
                    : "bg-rose-500/10 border-rose-500/30 text-rose-900 dark:text-rose-200"
                }`}>
                  <p className="font-bold">
                    {quickCheckAnswer === learningContent.quickCheck.correctIndex
                      ? "Correct! ✓"
                      : "Not quite. Let me explain:"}
                  </p>
                  <p className="text-muted-foreground">{learningContent.quickCheck.explanation}</p>
                </div>
              )}
            </div>
          )}

          {/* 12. START PRACTICE (Bottom Action Bar) */}
          <div className="p-6 sm:p-8 rounded-3xl border border-border bg-card shadow-sm flex flex-col sm:flex-row items-center justify-between gap-5">
            <div className="space-y-1 text-center sm:text-left">
              <h3 className="text-sm font-extrabold text-foreground">
                Ready to practice {learningContent.title}?
              </h3>
              <p className="text-xs text-muted-foreground">
                Apply what you've learned in a timed concept practice round.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => handleStartSession(learningConcept.name, activeCategory, learningConcept.difficulty, 5)}
                className="w-full sm:w-auto px-5 py-3 rounded-2xl border border-purple-500/40 bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 dark:text-purple-400 text-xs font-bold transition-all flex items-center justify-center gap-2"
              >
                Start Practice <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleMarkConceptLearned}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-extrabold transition-all shadow-md flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" /> Mark as Learned & Start Practice
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW 2B: NOT FOUND VIEW
         ========================================================================= */}
      {viewMode === "not-found" && (
        <div className="max-w-xl mx-auto my-12 p-8 rounded-3xl border border-border bg-card shadow-sm text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/15 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-foreground">Concept Not Found</h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            We couldn't find the aptitude concept you were looking for. Please select a valid concept from the Aptitude module.
          </p>
          <button
            onClick={handleBackToAptitude}
            className="px-5 py-2.5 rounded-xl bg-purple-600 text-white text-xs font-bold hover:bg-purple-700 transition-all shadow-sm inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Aptitude
          </button>
        </div>
      )}

      {/* =========================================================================
          VIEW 3: ACTIVE PRACTICE / TEST SESSION (SINGLE-QUESTION WORKFLOW)
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
                Question {currentQuestionIdx + 1} of {activeQuestions.length}
              </span>
              <h2 className="text-base sm:text-lg font-bold text-foreground leading-relaxed whitespace-pre-wrap">
                {currentQ.question}
              </h2>
            </div>

            {/* Render DI Data Visualization if present */}
            {currentQ.chartData && <DIChartViewer chart={currentQ.chartData} />}

            {/* Options List with Keyboard Hints */}
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
          VIEW 4: ASSESSMENT RESULT & DIAGNOSTICS REPORT
         ========================================================================= */}
      {viewMode === "result" && sessionReport && (
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Result Hero Banner */}
          <div className="p-6 sm:p-8 rounded-3xl border border-border bg-card shadow-sm space-y-6 text-center">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white mx-auto flex items-center justify-center shadow-lg">
              <Trophy className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold text-purple-600 dark:text-purple-400 font-mono uppercase tracking-wider">
                Practice Session Complete
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground">
                {sessionReport.score} / {sessionReport.total}
              </h2>
              <p className="text-xs text-muted-foreground">
                Accuracy: <strong className="text-foreground">{sessionReport.accuracy}%</strong> • Time Taken:{" "}
                <strong className="text-foreground">
                  {Math.floor(sessionReport.time_spent_seconds / 60)}m {sessionReport.time_spent_seconds % 60}s
                </strong>
              </p>
            </div>

            {/* Strengths & Weaknesses Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 space-y-1">
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Demonstrated Strengths
                </span>
                <p className="text-xs text-muted-foreground">
                  {sessionReport.strong_topics?.length > 0 ? sessionReport.strong_topics.join(", ") : "Solid effort overall."}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 space-y-1">
                <span className="text-xs font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" /> Areas for Revision
                </span>
                <p className="text-xs text-muted-foreground">
                  {sessionReport.weak_topics?.length > 0 ? sessionReport.weak_topics.join(", ") : "Flawless topic accuracy!"}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setViewMode("review")}
                className="px-5 py-2.5 rounded-xl border border-purple-500/40 bg-purple-500/10 hover:bg-purple-500/20 text-purple-700 dark:text-purple-300 text-xs font-bold transition-colors flex items-center gap-1.5"
              >
                <FileText className="w-4 h-4" /> Review Explanations
              </button>

              <button
                onClick={() => handleStartSession(selectedTopic, activeCategory, selectedDifficulty, questionCount)}
                className="px-5 py-2.5 rounded-xl border border-border hover:bg-secondary text-xs font-semibold text-foreground transition-colors flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Practice Again
              </button>

              <button
                onClick={() => setViewMode("browse")}
                className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
              >
                Continue Learning <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW 5: DETAILED ANSWER REVIEW VIEW
         ========================================================================= */}
      {viewMode === "review" && sessionReport && (
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="p-4 rounded-2xl border border-border bg-card shadow-sm flex items-center justify-between">
            <button
              onClick={() => setViewMode("result")}
              className="px-3 py-1.5 rounded-xl border border-border hover:bg-secondary text-xs font-semibold text-foreground transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Summary
            </button>
            <span className="text-xs font-bold text-foreground font-mono">
              Detailed Answer & Formula Review
            </span>
          </div>

          <div className="space-y-4">
            {(sessionReport.question_results || []).map((qr: any, idx: number) => (
              <div
                key={idx}
                className={`p-6 rounded-3xl border bg-card space-y-4 shadow-sm ${
                  qr.is_correct ? "border-emerald-500/30" : "border-rose-500/30"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="font-bold text-xs sm:text-sm text-foreground leading-relaxed">
                    {idx + 1}. {qr.question}
                  </span>
                  <span
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold shrink-0 font-mono uppercase ${
                      qr.is_correct
                        ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                        : "bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30"
                    }`}
                  >
                    {qr.is_correct ? "Correct ✓" : "Incorrect ✗"}
                  </span>
                </div>

                <div className="text-xs space-y-2 bg-secondary/50 p-4 rounded-2xl border border-border/60">
                  <p className="text-muted-foreground">
                    Your Answer:{" "}
                    <strong className={qr.is_correct ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}>
                      {qr.options?.[qr.selected_option] || "Not answered"}
                    </strong>
                  </p>
                  {!qr.is_correct && (
                    <p className="text-muted-foreground">
                      Correct Answer: <strong className="text-emerald-600 dark:text-emerald-400">{qr.options?.[qr.correct_option]}</strong>
                    </p>
                  )}
                  {qr.explanation && (
                    <div className="pt-2 border-t border-border/40 space-y-1">
                      <p className="font-bold text-foreground flex items-center gap-1">
                        <Lightbulb className="w-3.5 h-3.5 text-amber-500" /> Explanation & Solution:
                      </p>
                      <p className="text-muted-foreground leading-relaxed">{qr.explanation}</p>
                    </div>
                  )}
                  {qr.formula && (
                    <div className="pt-1 text-purple-600 dark:text-purple-400 font-mono text-[11px]">
                      Formula: {qr.formula}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: PRACTICE CONFIGURATION MODAL
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
                <p className="text-xs font-bold text-foreground font-mono">Timed Mode</p>
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
              className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5"
            >
              Start Practice Session <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
