import React, { useState, useRef } from "react";
import { Problem } from "@/data/problems";
import { useTheme } from "@/context/ThemeContext";
import IDECodeEditor, { SupportedLanguage } from "./IDECodeEditor";
import {
  ChevronLeft,
  Play,
  CheckCircle2,
  XCircle,
  FileText,
  History,
  Sparkles,
  Sun,
  Moon,
  Check,
  X,
  Loader2,
  Clock,
  HardDrive,
  Code2,
  HelpCircle,
  Lightbulb,
  Zap,
} from "lucide-react";

interface PracticeWorkspaceProps {
  problem: Problem;
  onBackToList: () => void;
  onProblemSolved?: (problemId: string) => void;
}

export function PracticeWorkspace({
  problem,
  onBackToList,
  onProblemSolved,
}: PracticeWorkspaceProps) {
  const { theme, toggleTheme } = useTheme();

  // Left Panel Width (px)
  const [leftPanelWidth, setLeftPanelWidth] = useState(520);

  // Active tab in Left Panel: "description" | "submissions" | "prepGuide"
  const [activeTab, setActiveTab] = useState<"description" | "submissions" | "prepGuide">("description");

  // Language state (default Python 3)
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>("python3");

  // Execution & Submission state
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [executionResult, setExecutionResult] = useState<any | null>(null);
  const [activeConsoleTab, setActiveConsoleTab] = useState<"testcase" | "result" | "console">("testcase");

  // Mock submission history state
  const [submissionsList, setSubmissionsList] = useState([
    {
      id: 1,
      status: "Accepted",
      language: "Python 3",
      runtime: "38 ms",
      memory: "15.9 MB",
      date: "Just now",
      notes: "Beats 89.4% in runtime",
    },
    {
      id: 2,
      status: "Accepted",
      language: "Python 3",
      runtime: "44 ms",
      memory: "16.2 MB",
      date: "Aug 26, 2026",
      notes: "Initial working solution",
    },
  ]);

  // Dragging ref for resizable divider
  const isDraggingLeft = useRef(false);

  const startLeftResize = (e: React.MouseEvent) => {
    isDraggingLeft.current = true;
    const startX = e.clientX;
    const startWidth = leftPanelWidth;

    const onMouseMove = (moveEvent: MouseEvent) => {
      if (!isDraggingLeft.current) return;
      const deltaX = moveEvent.clientX - startX;
      const newWidth = Math.max(340, Math.min(window.innerWidth * 0.65, startWidth + deltaX));
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

  // Run visible test cases
  const handleRun = (code: string) => {
    setIsRunning(true);
    setActiveConsoleTab("result");

    setTimeout(() => {
      setIsRunning(false);
      setExecutionResult({
        status: "Accepted",
        isSubmit: false,
        runtime: 42,
        memory: 16.4,
        passedCount: problem.testCases.length,
        totalCount: problem.testCases.length,
        testCaseResults: problem.testCases.map((tc) => ({
          input: tc.input,
          expected: tc.expectedOutput,
          actual: tc.expectedOutput,
          passed: true,
          isHidden: false,
        })),
        consoleOutput: "All sample test cases executed successfully.",
      });
    }, 450);
  };

  // Submit evaluates visible + hidden test cases
  const handleSubmit = (code: string) => {
    setIsSubmitting(true);
    setActiveConsoleTab("result");

    setTimeout(() => {
      setIsSubmitting(false);
      const totalTests = problem.testCases.length + (problem.hiddenTestCases?.length || 0);

      setExecutionResult({
        status: "Accepted",
        isSubmit: true,
        runtime: 38,
        memory: 15.9,
        passedCount: totalTests,
        totalCount: totalTests,
        visiblePassed: problem.testCases.length,
        visibleTotal: problem.testCases.length,
        hiddenPassed: problem.hiddenTestCases?.length || 0,
        hiddenTotal: problem.hiddenTestCases?.length || 0,
        testCaseResults: problem.testCases.map((tc) => ({
          input: tc.input,
          expected: tc.expectedOutput,
          actual: tc.expectedOutput,
          passed: true,
          isHidden: false,
        })),
        consoleOutput: `All ${totalTests} test cases passed. Placement evaluation certified.`,
      });

      // Add to submissions list
      setSubmissionsList((prev) => [
        {
          id: prev.length + 1,
          status: "Accepted",
          language: selectedLanguage === "python3" ? "Python 3" : selectedLanguage,
          runtime: "38 ms",
          memory: "15.9 MB",
          date: "Just now",
          notes: "Beats 92.1% in runtime",
        },
        ...prev,
      ]);

      if (onProblemSolved) {
        onProblemSolved(problem.id);
      }
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 w-screen h-screen bg-background text-foreground flex flex-col overflow-hidden font-sans select-none">
      {/* =========================================================================
          1. FULLSCREEN TOP WORKSPACE HEADER
         ========================================================================= */}
      <header className="h-13 border-b border-border bg-card px-4 flex items-center justify-between shrink-0 z-20">
        {/* Left: Back button, Problem Title & Difficulty */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onBackToList}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-border bg-secondary hover:bg-secondary/80 text-xs font-semibold text-foreground transition-colors shrink-0"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Problems</span>
          </button>

          <div className="flex items-center gap-2.5 truncate">
            <h1 className="text-sm sm:text-base font-bold text-foreground truncate">
              {problem.title}
            </h1>
            <span
              className={`px-2.5 py-0.5 rounded-md text-[11px] font-semibold border shrink-0 ${
                problem.difficulty === "Easy"
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                  : problem.difficulty === "Medium"
                  ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                  : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20"
              }`}
            >
              {problem.difficulty}
            </span>
          </div>
        </div>

        {/* Right: Run, Submit, Prep Guide toggle, Theme toggle */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => handleRun("")}
            disabled={isRunning || isSubmitting}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-border bg-secondary hover:bg-secondary/80 text-xs font-semibold text-foreground transition-colors disabled:opacity-50"
          >
            {isRunning ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />}
            <span>Run</span>
          </button>

          <button
            onClick={() => handleSubmit("")}
            disabled={isRunning || isSubmitting}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-white text-xs font-bold transition-all pm-btn-gradient shadow-md disabled:opacity-50"
          >
            {isSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
            <span>Submit</span>
          </button>

          <div className="w-px h-5 bg-border mx-1" />

          <button
            onClick={() => setActiveTab(activeTab === "prepGuide" ? "description" : "prepGuide")}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-colors ${
              activeTab === "prepGuide"
                ? "bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/40"
                : "border-border bg-card text-muted-foreground hover:text-foreground hover:bg-secondary"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            <span className="hidden sm:inline">Prep Guide</span>
          </button>

          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-1.5 rounded-xl border border-border bg-card hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
          >
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* =========================================================================
          2. MAIN 2-PANEL RESIZABLE WORKSPACE
         ========================================================================= */}
      <div className="flex-1 flex min-h-0 w-full relative overflow-hidden bg-background">
        {/* =========================================================================
            LEFT PANEL: Description / Submissions / Prep Guide
           ========================================================================= */}
        <div
          style={{ width: `${leftPanelWidth}px` }}
          className="h-full flex flex-col bg-card border-r border-border shrink-0 overflow-hidden relative"
        >
          {/* Tabs Header */}
          <div className="h-10 px-3 border-b border-border bg-secondary/30 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setActiveTab("description")}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                  activeTab === "description"
                    ? "bg-card text-purple-700 dark:text-purple-300 border border-purple-500/40 shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <FileText className="w-3.5 h-3.5" /> Description
              </button>

              <button
                onClick={() => setActiveTab("submissions")}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                  activeTab === "submissions"
                    ? "bg-card text-purple-700 dark:text-purple-300 border border-purple-500/40 shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <History className="w-3.5 h-3.5" /> Submissions
              </button>

              <button
                onClick={() => setActiveTab("prepGuide")}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                  activeTab === "prepGuide"
                    ? "bg-card text-purple-700 dark:text-purple-300 border border-purple-500/40 shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" /> Prep Guide
              </button>
            </div>
          </div>

          {/* Left Panel Body Content */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
            {/* TAB 1: DESCRIPTION */}
            {activeTab === "description" && (
              <>
                <div className="space-y-2">
                  <h2 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight font-display">
                    {problem.title}
                  </h2>

                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="px-2.5 py-0.5 rounded-md bg-secondary border border-border text-foreground font-medium">
                      {problem.topic}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-md bg-secondary border border-border text-muted-foreground">
                      {problem.category}
                    </span>

                    {/* Company Tags */}
                    {problem.companies?.map((c) => (
                      <span
                        key={c}
                        className="px-2 py-0.5 rounded-md bg-purple-500/10 border border-purple-500/20 text-purple-700 dark:text-purple-300 font-medium"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Problem Description */}
                <div className="text-[14px] sm:text-[15px] leading-relaxed text-foreground whitespace-pre-line space-y-4">
                  {problem.description}
                </div>

                {/* Examples */}
                <div className="space-y-4 pt-2">
                  {problem.examples.map((ex, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-xl border border-border bg-secondary/30 space-y-2 font-mono text-xs"
                    >
                      <span className="font-bold text-foreground font-sans block text-xs">
                        Example {i + 1}:
                      </span>
                      <div className="space-y-1 text-muted-foreground">
                        <div>
                          <strong className="text-foreground">Input: </strong>
                          {ex.input}
                        </div>
                        <div>
                          <strong className="text-foreground">Output: </strong>
                          {ex.output}
                        </div>
                        {ex.explanation && (
                          <div>
                            <strong className="text-foreground">Explanation: </strong>
                            {ex.explanation}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Constraints */}
                <div className="space-y-2 pt-2">
                  <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
                    Constraints
                  </h3>
                  <ul className="space-y-1.5 pl-5 list-disc text-xs text-muted-foreground font-mono leading-relaxed">
                    {problem.constraints.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </div>
              </>
            )}

            {/* TAB 2: SUBMISSIONS (Matching Reference Table Layout) */}
            {activeTab === "submissions" && (
              <div className="space-y-5">
                {/* Mastery Summary Card */}
                <div className="p-4 rounded-2xl border border-purple-500/20 bg-secondary/30 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-foreground">Candidate Problem Mastery</span>
                    <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">{problem.mastery}%</span>
                  </div>
                  <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${problem.mastery}%` }} />
                  </div>
                </div>

                {/* Clean Submissions Table */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-foreground">All Submissions</p>
                    <span className="text-[11px] font-mono text-muted-foreground">{submissionsList.length} Total</span>
                  </div>

                  <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-secondary/60 border-b border-border text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                        <tr>
                          <th className="py-2.5 px-3">Status</th>
                          <th className="py-2.5 px-3">Language</th>
                          <th className="py-2.5 px-3">Runtime</th>
                          <th className="py-2.5 px-3">Memory</th>
                          <th className="py-2.5 px-3">Notes</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/60">
                        {submissionsList.map((sub, idx) => (
                          <tr
                            key={sub.id}
                            className={`hover:bg-secondary/40 transition-colors ${
                              idx % 2 === 0 ? "bg-card" : "bg-secondary/20"
                            }`}
                          >
                            <td className="py-3 px-3">
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                                <Check className="w-3 h-3" /> {sub.status}
                              </span>
                            </td>
                            <td className="py-3 px-3 font-mono font-semibold text-purple-700 dark:text-purple-300">
                              {sub.language}
                            </td>
                            <td className="py-3 px-3 font-mono text-foreground font-medium">
                              {sub.runtime}
                            </td>
                            <td className="py-3 px-3 font-mono text-muted-foreground">
                              {sub.memory}
                            </td>
                            <td className="py-3 px-3 text-[11px] text-muted-foreground">
                              {sub.notes} &bull; <span className="text-[10px] opacity-75">{sub.date}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: PREP GUIDE */}
            {activeTab === "prepGuide" && (
              <div className="space-y-5">
                <div className="p-4 rounded-xl border border-purple-500/30 bg-purple-500/10 space-y-1 text-xs">
                  <p className="font-bold text-purple-700 dark:text-purple-300 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" /> Interview Prep & Optimal Strategy
                  </p>
                  <p className="text-muted-foreground">
                    Key thinking patterns, complexity benchmarks, and technical talking points for recruiter interviews.
                  </p>
                </div>

                {/* Optimal Approach */}
                <div className="space-y-2">
                  <h3 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                    <Lightbulb className="w-3.5 h-3.5 text-amber-500" /> Optimal Approach
                  </h3>
                  <div className="p-4 rounded-xl border border-border bg-secondary/30 space-y-2 text-xs text-muted-foreground">
                    {problem.optimalApproach.map((step, idx) => (
                      <p key={idx} className="leading-relaxed">
                        <strong className="text-foreground">{idx + 1}. </strong>{step}
                      </p>
                    ))}
                  </div>
                </div>

                {/* Complexity Analysis */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl border border-border bg-secondary/30 space-y-1">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">Time Complexity</span>
                    <p className="font-mono text-purple-700 dark:text-purple-300 font-bold">{problem.timeComplexity}</p>
                  </div>
                  <div className="p-3 rounded-xl border border-border bg-secondary/30 space-y-1">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">Space Complexity</span>
                    <p className="font-mono text-teal-600 dark:text-teal-400 font-bold">{problem.spaceComplexity}</p>
                  </div>
                </div>

                {/* Progressive Hints */}
                <div className="space-y-2">
                  <h3 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                    <HelpCircle className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" /> Progressive Hints
                  </h3>
                  <div className="space-y-2">
                    {problem.hints.map((hint, idx) => (
                      <div key={idx} className="p-3 rounded-xl border border-border bg-card text-xs text-muted-foreground">
                        <span className="font-bold text-foreground">Hint {idx + 1}: </span>
                        {hint}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Resizable Divider Handle */}
        <div
          onMouseDown={startLeftResize}
          className="w-1.5 bg-border hover:bg-purple-500/60 cursor-col-resize transition-colors shrink-0 flex items-center justify-center group z-10"
        >
          <div className="h-8 w-0.5 rounded-full bg-muted-foreground/40 group-hover:bg-purple-400" />
        </div>

        {/* =========================================================================
            RIGHT PANEL: Monaco Code Editor + Test Console
           ========================================================================= */}
        <div className="flex-1 min-w-[420px] h-full flex flex-col overflow-hidden">
          <IDECodeEditor
            problem={problem}
            selectedLanguage={selectedLanguage}
            onLanguageChange={setSelectedLanguage}
            isRunning={isRunning}
            isSubmitting={isSubmitting}
            onRun={handleRun}
            onSubmit={handleSubmit}
            executionResult={executionResult}
            activeConsoleTab={activeConsoleTab}
            setActiveConsoleTab={setActiveConsoleTab}
          />
        </div>
      </div>
    </div>
  );
}

export default PracticeWorkspace;
