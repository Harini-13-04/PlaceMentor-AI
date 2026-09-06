import React, { useState, useRef, useEffect } from "react";
import { Problem, PROBLEMS_DATASET, getStarterCode } from "@/data/problems";
import { useTheme } from "@/context/ThemeContext";
import IDECodeEditor, { SupportedLanguage, ExecutionResult } from "./IDECodeEditor";
import AIMentorSidebar from "./AIMentorSidebar";
import { executeCodeSubmissionAsync, isStarterOrEmpty } from "@/utils/codeExecutor";
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Bookmark,
  BookmarkCheck,
  Sparkles,
  Loader2,
  Send,
  X,
  Bot,
  CheckCircle2,
  AlertCircle,
  ThumbsUp,
  MessageSquare,
} from "lucide-react";

interface PracticeWorkspaceProps {
  problem: Problem;
  onBackToList: () => void;
  onSelectProblem?: (problemId: string) => void;
  onProblemSolved?: (problemId: string) => void;
}

export function PracticeWorkspace({
  problem,
  onBackToList,
  onSelectProblem,
  onProblemSolved,
}: PracticeWorkspaceProps) {
  const { theme } = useTheme();

  // Full Screen / Focus Mode state (collapses left problem description)
  const [isFullScreen, setIsFullScreen] = useState(false);

  // AI Mentor Sidebar Open / Closed state (defaults to closed, toggleable)
  const [isAiBotOpen, setIsAiBotOpen] = useState(false);

  // Left Panel Width (px)
  const [leftPanelWidth, setLeftPanelWidth] = useState(440);

  // Right AI Mentor Sidebar Width (px)
  const [rightPanelWidth, setRightPanelWidth] = useState(360);

  // Active tab in Left Panel: "description" | "hints" | "solutions" | "submissions"
  const [activeLeftTab, setActiveLeftTab] = useState<"description" | "hints" | "solutions" | "submissions">("description");

  // Bookmarking state
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Likes counter
  const [likeCount, setLikeCount] = useState(4320);
  const [hasLiked, setHasLiked] = useState(false);

  // Per (problem, language) drafts cache
  const [savedDrafts, setSavedDrafts] = useState<Record<string, string>>({});

  // Language state: Default to SQL for SQL problems, otherwise Python 3
  const isSqlProblem = problem.category === "Database & SQL" || problem.topic?.toLowerCase().includes("sql");
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>(
    isSqlProblem ? "sql" : "python3"
  );

  // Current code in editor
  const [currentCode, setCurrentCode] = useState<string>(() =>
    getStarterCode(problem, isSqlProblem ? "sql" : "python3")
  );

  // Execution & Submission state
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null);
  const [activeConsoleTab, setActiveConsoleTab] = useState<"testcase" | "result">("testcase");

  // Submissions list
  const [submissionsList, setSubmissionsList] = useState([
    {
      id: 1,
      status: "Accepted",
      language: isSqlProblem ? "SQL" : "Python 3",
      runtime: "38 ms",
      memory: "15.9 MB",
      date: "Just now",
      notes: "Beats 89.4% in runtime",
    },
  ]);

  // Handle language switch with isolated per-(problem, language) drafts
  const handleLanguageChange = (newLang: SupportedLanguage) => {
    if (newLang === selectedLanguage) return;

    const currentKey = `${problem.id}_${selectedLanguage}`;
    const nextKey = `${problem.id}_${newLang}`;

    // 1. Save current code in drafts
    setSavedDrafts((prev) => ({
      ...prev,
      [currentKey]: currentCode,
    }));

    // 2. Fetch draft for new language or default starter
    const nextCode = savedDrafts[nextKey] || getStarterCode(problem, newLang);

    // 3. Update state
    setSelectedLanguage(newLang);
    setCurrentCode(nextCode);
    setExecutionResult(null);
    setActiveConsoleTab("testcase");
  };

  // Reset execution result & sync starter code whenever problem changes
  useEffect(() => {
    const isSql = problem.category === "Database & SQL" || problem.topic?.toLowerCase().includes("sql");
    const lang: SupportedLanguage = isSql ? "sql" : "python3";
    const key = `${problem.id}_${lang}`;
    const initialCode = savedDrafts[key] || getStarterCode(problem, lang);

    setSelectedLanguage(lang);
    setCurrentCode(initialCode);
    setExecutionResult(null);
    setActiveConsoleTab("testcase");
  }, [problem.id]);

  // Left Panel Drag Resizer
  const isDraggingLeft = useRef(false);
  const startLeftResize = (e: React.MouseEvent) => {
    isDraggingLeft.current = true;
    const startX = e.clientX;
    const startWidth = leftPanelWidth;

    const onMouseMove = (moveEvent: MouseEvent) => {
      if (!isDraggingLeft.current) return;
      const deltaX = moveEvent.clientX - startX;
      const newWidth = Math.max(300, Math.min(window.innerWidth * 0.55, startWidth + deltaX));
      setLeftPanelWidth(newWidth);
    };

    const onMouseUp = () => {
      isDraggingLeft.current = false;
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  // Right Panel Drag Resizer for AI Mentor
  const isDraggingRight = useRef(false);
  const startRightResize = (e: React.MouseEvent) => {
    isDraggingRight.current = true;
    const startX = e.clientX;
    const startWidth = rightPanelWidth;

    const onMouseMove = (moveEvent: MouseEvent) => {
      if (!isDraggingRight.current) return;
      const deltaX = startX - moveEvent.clientX;
      const newWidth = Math.max(280, Math.min(window.innerWidth * 0.45, startWidth + deltaX));
      setRightPanelWidth(newWidth);
    };

    const onMouseUp = () => {
      isDraggingRight.current = false;
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  // Run test cases
  const handleRun = async () => {
    const code = currentCode;

    if (isStarterOrEmpty(code, problem, selectedLanguage)) {
      setExecutionResult({
        status: "Need Solution",
        message: "Write your solution before running the test cases.",
        runtime: 0,
        memory: 0,
        passedCount: 0,
        totalCount: (problem.testCases || []).length,
        testCaseResults: [],
        consoleOutput: "Write your solution before running the test cases.",
      });
      setActiveConsoleTab("result");
      return;
    }

    setIsRunning(true);
    setActiveConsoleTab("result");

    try {
      const result = await executeCodeSubmissionAsync({
        code,
        problem,
        language: selectedLanguage,
        isSubmit: false,
      });
      setExecutionResult(result);
    } catch {
      setExecutionResult({
        status: "Execution Error",
        message: "Execution Error: Unable to execute the solution. Please check the backend service.",
        runtime: 0,
        memory: 0,
        passedCount: 0,
        totalCount: (problem.testCases || []).length,
        testCaseResults: [],
        consoleOutput: "Execution Error: Unable to execute the solution. Please check the backend service.",
      });
    } finally {
      setIsRunning(false);
    }
  };

  // Submit test cases
  const handleSubmit = async () => {
    const code = currentCode;

    if (isStarterOrEmpty(code, problem, selectedLanguage)) {
      const totalTests = (problem.testCases || []).length + (problem.hiddenTestCases || []).length;
      setExecutionResult({
        status: "Need Solution",
        message: "Write your solution before submitting.",
        runtime: 0,
        memory: 0,
        passedCount: 0,
        totalCount: totalTests,
        testCaseResults: [],
        consoleOutput: "Write your solution before submitting.",
      });
      setActiveConsoleTab("result");
      return;
    }

    setIsSubmitting(true);
    setActiveConsoleTab("result");

    try {
      const result = await executeCodeSubmissionAsync({
        code,
        problem,
        language: selectedLanguage,
        isSubmit: true,
      });
      setExecutionResult(result);

      if (result.status === "Accepted") {
        setSubmissionsList((prev) => [
          {
            id: prev.length + 1,
            status: "Accepted",
            language: selectedLanguage === "python3" ? "Python 3" : selectedLanguage,
            runtime: `${result.runtime} ms`,
            memory: `${result.memory} MB`,
            date: "Just now",
            notes: "Beats 92.4% in runtime",
          },
          ...prev,
        ]);

        if (onProblemSolved) {
          onProblemSolved(problem.id);
        }
      }
    } catch {
      setExecutionResult({
        status: "Execution Error",
        message: "Execution Error: Unable to execute the solution. Please check the backend service.",
        runtime: 0,
        memory: 0,
        passedCount: 0,
        totalCount: (problem.testCases || []).length + (problem.hiddenTestCases || []).length,
        testCaseResults: [],
        consoleOutput: "Execution Error: Unable to execute the solution. Please check the backend service.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Difficulty badge styling
  const difficultyBadge =
    problem.difficulty === "Easy"
      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
      : problem.difficulty === "Medium"
      ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
      : "bg-rose-500/10 text-rose-400 border-rose-500/20";

  return (
    <div className="fixed inset-0 z-50 w-screen h-screen bg-[#0B0F17] text-[#E2E8F0] flex flex-col overflow-hidden font-sans select-none">
      {/* =========================================================================
          1. TOP NAVIGATION HEADER (Clean, Professional, Focused)
         ========================================================================= */}
      <header className="h-12 border-b border-[#1E2638] bg-[#0E131F] px-4 flex items-center justify-between shrink-0 z-20">
        {/* Left: Problem Navigation & Title */}
        <div className="flex items-center gap-2.5 min-w-0">
          <button
            type="button"
            onClick={onBackToList}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold text-[#94A3B8] hover:text-white hover:bg-[#161D2B] transition-colors"
            title="Back to Problem List"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Problems</span>
          </button>

          <div className="h-4 w-px bg-[#1E2638] hidden sm:block" />

          {/* Prev / Next Problem Navigation */}
          {(() => {
            const currentIndex = PROBLEMS_DATASET.findIndex((p) => p.id === problem.id);
            const prevProblem = currentIndex > 0 ? PROBLEMS_DATASET[currentIndex - 1] : null;
            const nextProblem = currentIndex >= 0 && currentIndex < PROBLEMS_DATASET.length - 1 ? PROBLEMS_DATASET[currentIndex + 1] : null;

            return (
              <div className="flex items-center gap-0.5">
                <button
                  type="button"
                  disabled={!prevProblem}
                  onClick={() => prevProblem && onSelectProblem?.(prevProblem.id)}
                  className="p-1 rounded-lg text-[#94A3B8] hover:text-white hover:bg-[#161D2B] transition-colors disabled:opacity-30 disabled:pointer-events-none"
                  title={prevProblem ? `Previous Problem: ${prevProblem.title}` : "First problem"}
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  disabled={!nextProblem}
                  onClick={() => nextProblem && onSelectProblem?.(nextProblem.id)}
                  className="p-1 rounded-lg text-[#94A3B8] hover:text-white hover:bg-[#161D2B] transition-colors disabled:opacity-30 disabled:pointer-events-none"
                  title={nextProblem ? `Next Problem: ${nextProblem.title}` : "Last problem"}
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            );
          })()}

          <div className="flex items-center gap-2 min-w-0 truncate">
            <span className="font-bold text-sm text-white truncate">{problem.title}</span>
            <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border shrink-0 ${difficultyBadge}`}>
              {problem.difficulty}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsBookmarked((prev) => !prev)}
            className="text-[#94A3B8] hover:text-[#A78BFA] transition-colors p-1 shrink-0"
            title={isBookmarked ? "Remove Bookmark" : "Bookmark Problem"}
          >
            {isBookmarked ? (
              <BookmarkCheck className="w-4 h-4 text-[#A78BFA]" />
            ) : (
              <Bookmark className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Right: Run, Submit, AI Bot & Close Actions */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Run Button */}
          <button
            type="button"
            onClick={handleRun}
            disabled={isRunning || isSubmitting}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-[#28354D] bg-[#161D2B] hover:bg-[#1E2638] text-xs font-bold text-[#E2E8F0] transition-all shadow-sm disabled:opacity-50"
            title="Run Code (Ctrl + Enter)"
          >
            {isRunning ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-[#A78BFA]" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-current text-[#A78BFA]" />
            )}
            <span>Run</span>
          </button>

          {/* Submit Button */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isRunning || isSubmitting}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-white text-xs font-bold transition-all shadow-md pm-btn-gradient disabled:opacity-50"
            title="Submit Solution (Ctrl + Shift + Enter)"
          >
            {isSubmitting ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
            ) : (
              <Send className="w-3.5 h-3.5 text-white" />
            )}
            <span>Submit</span>
          </button>

          <div className="h-4 w-px bg-[#1E2638] mx-0.5" />

          {/* AI Bot Toggle Button */}
          <button
            type="button"
            onClick={() => setIsAiBotOpen((prev) => !prev)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
              isAiBotOpen
                ? "bg-[#8B5CF6]/15 border-[#8B5CF6]/50 text-[#C4B5FD] shadow-sm shadow-[#8B5CF6]/20"
                : "bg-[#141923] border-[#28354D] text-[#E2E8F0] hover:bg-[#1E2638] hover:border-[#8B5CF6]/40"
            }`}
            title="Toggle AI Mentor"
          >
            <Bot className={`w-3.5 h-3.5 ${isAiBotOpen ? "text-[#A78BFA]" : "text-[#94A3B8]"}`} />
            <span>AI Bot</span>
            {isAiBotOpen && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
          </button>

          {/* Exit Workspace (✕) Button */}
          <button
            type="button"
            onClick={onBackToList}
            className="p-1.5 rounded-lg text-[#94A3B8] hover:text-white hover:bg-[#161D2B] transition-colors"
            title="Exit Problem Workspace"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* =========================================================================
          2. MAIN WORKSPACE CONTENT AREA (Problem | Editor | AI Bot)
         ========================================================================= */}
      <div className="flex-1 flex min-h-0 overflow-hidden bg-[#0B0F17]">
        {/* =========================================================================
            A. LEFT PANEL: Problem Description (Collapsed in Fullscreen Mode)
           ========================================================================= */}
        {!isFullScreen && (
          <aside
            aria-label="Problem Description"
            style={{ width: `${leftPanelWidth}px` }}
            className="h-full border-r border-[#1E2638] bg-[#0E131F] flex flex-col min-w-[300px] shrink-0 overflow-hidden select-text"
          >
            {/* Left Panel Tabs: Description | Hints | Solutions | Submissions */}
            <div className="h-11 px-4 border-b border-[#1E2638] bg-[#10141D] flex items-center gap-5 shrink-0 select-none text-xs font-semibold">
              <button
                type="button"
                onClick={() => setActiveLeftTab("description")}
                className={`py-3 transition-colors relative ${
                  activeLeftTab === "description"
                    ? "text-white after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#8B5CF6]"
                    : "text-[#94A3B8] hover:text-white"
                }`}
              >
                Description
              </button>

              <button
                type="button"
                onClick={() => setActiveLeftTab("hints")}
                className={`py-3 transition-colors relative ${
                  activeLeftTab === "hints"
                    ? "text-white after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#8B5CF6]"
                    : "text-[#94A3B8] hover:text-white"
                }`}
              >
                Hints
              </button>

              <button
                type="button"
                onClick={() => setActiveLeftTab("solutions")}
                className={`py-3 transition-colors relative ${
                  activeLeftTab === "solutions"
                    ? "text-white after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#8B5CF6]"
                    : "text-[#94A3B8] hover:text-white"
                }`}
              >
                Solutions
              </button>

              <button
                type="button"
                onClick={() => setActiveLeftTab("submissions")}
                className={`py-3 transition-colors relative ${
                  activeLeftTab === "submissions"
                    ? "text-white after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#8B5CF6]"
                    : "text-[#94A3B8] hover:text-white"
                }`}
              >
                Submissions
              </button>
            </div>

            {/* Left Panel Body Content */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              {activeLeftTab === "description" && (
                <div className="space-y-5 text-xs sm:text-[13px] leading-relaxed text-[#CBD5E1]">
                  {/* Title & Difficulty */}
                  <div className="space-y-1">
                    <h1 className="text-lg font-bold text-white tracking-tight">{problem.title}</h1>
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold border ${difficultyBadge}`}>
                        {problem.difficulty}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-md bg-[#161D2B] border border-[#1E2638] text-[11px] font-medium text-[#CBD5E1]">
                        {problem.topic}
                      </span>
                      {(problem.companies || []).slice(0, 3).map((c, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-md bg-[#141923] text-[#94A3B8] border border-[#1E2638] text-[11px]"
                        >
                          {c}
                        </span>
                      ))}
                      {(problem.companies || []).length > 3 && (
                        <span className="px-1.5 py-0.5 rounded-md bg-[#141923] text-[#64748B] border border-[#1E2638] text-[10px]">
                          +{problem.companies.length - 3}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Problem Description text */}
                  <div className="whitespace-pre-wrap font-sans text-[#CBD5E1] leading-relaxed">
                    {problem.description}
                  </div>

                  {/* Examples Section */}
                  <div className="space-y-3 font-mono">
                    {(problem.examples || []).map((ex, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl border border-[#1E2638] bg-[#141923] space-y-1.5 text-xs"
                      >
                        <div className="font-bold font-sans text-[11px] uppercase tracking-wider text-[#A78BFA]">
                          Example {idx + 1}
                        </div>
                        <div>
                          <span className="text-[#94A3B8]">Input: </span>
                          <span className="text-white">{ex.input}</span>
                        </div>
                        <div>
                          <span className="text-[#94A3B8]">Output: </span>
                          <span className="text-emerald-400 font-bold">{ex.output}</span>
                        </div>
                        {ex.explanation && (
                          <div className="text-[11px] text-[#94A3B8] font-sans pt-1">
                            <span>Explanation: {ex.explanation}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Constraints Section */}
                  <div className="space-y-2 font-mono text-xs">
                    <span className="font-bold text-white uppercase tracking-wider text-[11px] font-sans">
                      Constraints:
                    </span>
                    <ul className="list-disc list-inside space-y-1 text-[#94A3B8]">
                      {(problem.constraints || []).map((con, idx) => (
                        <li key={idx}>
                          <span className="text-[#CBD5E1]">{con}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Bottom Stats */}
                  <div className="pt-4 border-t border-[#1E2638] flex items-center justify-between text-xs text-[#94A3B8] select-none font-sans">
                    <div className="flex items-center gap-4">
                      <button
                        type="button"
                        onClick={() => {
                          setHasLiked(!hasLiked);
                          setLikeCount((prev) => (hasLiked ? prev - 1 : prev + 1));
                        }}
                        className={`flex items-center gap-1.5 transition-colors ${
                          hasLiked ? "text-[#A78BFA]" : "hover:text-white"
                        }`}
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                        <span>{(likeCount / 1000).toFixed(1)}K</span>
                      </button>

                      <div className="flex items-center gap-1.5 hover:text-white cursor-pointer">
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>112 Discussions</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-[11px] text-emerald-400">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span>{problem.acceptanceRate || "64.8%"} Acceptance</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Hints Tab */}
              {activeLeftTab === "hints" && (
                <div className="space-y-3 text-xs">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">Progressive Hints</span>
                  {(problem.hints || []).map((h, i) => (
                    <div key={i} className="p-3.5 rounded-xl border border-[#1E2638] bg-[#141923] space-y-1">
                      <span className="font-bold text-[#A78BFA]">Hint {i + 1}</span>
                      <p className="text-[#CBD5E1] leading-relaxed">{h}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Solutions Tab */}
              {activeLeftTab === "solutions" && (
                <div className="space-y-3 text-xs">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">Optimal Approach</span>
                  <div className="p-4 rounded-xl border border-[#1E2638] bg-[#141923] space-y-2 text-[#CBD5E1]">
                    {(problem.optimalApproach || []).map((step, i) => (
                      <p key={i}>
                        <strong className="text-white">{i + 1}. </strong>
                        {step}
                      </p>
                    ))}
                  </div>
                </div>
              )}

              {/* Submissions Tab */}
              {activeLeftTab === "submissions" && (
                <div className="space-y-3 text-xs">
                  <div className="rounded-xl border border-[#1E2638] bg-[#141923] overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#10141D] text-[#94A3B8] text-[10px] uppercase font-bold border-b border-[#1E2638]">
                        <tr>
                          <th className="py-2.5 px-3">Status</th>
                          <th className="py-2.5 px-3">Runtime</th>
                          <th className="py-2.5 px-3">Memory</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#1E2638] font-mono">
                        {submissionsList.map((s) => (
                          <tr key={s.id} className="hover:bg-[#161D2B]">
                            <td className="py-2.5 px-3 font-bold text-emerald-400">{s.status}</td>
                            <td className="py-2.5 px-3 text-[#CBD5E1]">{s.runtime}</td>
                            <td className="py-2.5 px-3 text-[#CBD5E1]">{s.memory}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </aside>
        )}

        {/* Resizable Divider Handle (Left to Center) */}
        {!isFullScreen && (
          <div
            onMouseDown={startLeftResize}
            className="w-1.5 bg-[#1E2638] hover:bg-[#8B5CF6]/60 cursor-col-resize transition-colors shrink-0 flex items-center justify-center group z-10"
            title="Drag to resize panel"
          >
            <div className="h-8 w-0.5 rounded-full bg-[#64748B] group-hover:bg-[#A78BFA]" />
          </div>
        )}

        {/* =========================================================================
            B. CENTER PANEL: Code Editor & Testcase Workspace
           ========================================================================= */}
        <main aria-label="Code Workspace" className="flex-1 min-w-[360px] h-full flex flex-col overflow-hidden bg-[#141923]">
          <IDECodeEditor
            problem={problem}
            selectedLanguage={selectedLanguage}
            onLanguageChange={handleLanguageChange}
            code={currentCode}
            onCodeChange={(c) => setCurrentCode(c)}
            isRunning={isRunning}
            isSubmitting={isSubmitting}
            onRun={handleRun}
            onSubmit={handleSubmit}
            executionResult={executionResult}
            activeConsoleTab={activeConsoleTab}
            setActiveConsoleTab={setActiveConsoleTab}
            isFullScreen={isFullScreen}
            onToggleFullScreen={() => setIsFullScreen((prev) => !prev)}
          />
        </main>

        {/* =========================================================================
            C. RIGHT PANEL: AI Mentor Sidebar (Conditional with NO Reserved Space when Closed)
           ========================================================================= */}
        {isAiBotOpen && (
          <>
            {/* Resizable Divider Handle (Center to Right) */}
            <div
              onMouseDown={startRightResize}
              className="w-1.5 bg-[#1E2638] hover:bg-[#8B5CF6]/60 cursor-col-resize transition-colors shrink-0 flex items-center justify-center group z-10"
              title="Drag to resize AI Mentor"
            >
              <div className="h-8 w-0.5 rounded-full bg-[#64748B] group-hover:bg-[#A78BFA]" />
            </div>

            <div
              style={{ width: `${rightPanelWidth}px` }}
              className="h-full bg-[#0E131F] flex flex-col min-w-[280px] shrink-0 overflow-hidden"
            >
              <AIMentorSidebar
                problem={problem}
                selectedLanguage={selectedLanguage}
                currentCode={currentCode}
                executionResult={executionResult}
                onSelectProblem={onSelectProblem}
                onClose={() => setIsAiBotOpen(false)}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default PracticeWorkspace;
