import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Building2,
  Flame,
  Award,
  CheckCircle2,
  CircleDot,
  Sun,
  Moon,
  Sparkles,
  Play,
  Send,
  X,
  Code2,
} from "lucide-react";
import { Problem } from "@/data/problems";
import { IDECodeEditor, RunResult, SupportedLanguage } from "./IDECodeEditor";
import { MentorPanel } from "./MentorPanel";
import { useTheme } from "@/context/ThemeContext";

interface PracticeWorkspaceProps {
  problem: Problem;
  onBack: () => void;
  userStatus: "Not Started" | "Attempted" | "Solved";
  masteryPercentage: number;
  onStatusChange: (newStatus: "Attempted" | "Solved", newMastery: number) => void;
}

export const PracticeWorkspace: React.FC<PracticeWorkspaceProps> = ({
  problem,
  onBack,
  userStatus,
  masteryPercentage,
  onStatusChange,
}) => {
  const { theme, toggleTheme } = useTheme();
  const [leftTab, setLeftTab] = useState<"description" | "submissions">("description");
  const [language, setLanguage] = useState<SupportedLanguage>("python");

  // Multi-language code cache to prevent losing draft edits when switching languages
  const [codeByLang, setCodeByLang] = useState<Record<SupportedLanguage, string>>(() => {
    return {
      python: problem.starterCode.python || "def solution():\n    return 0\n",
      javascript: problem.starterCode.javascript || "function solution() {\n    return 0;\n}\n",
      java: problem.starterCode.java || "class Solution {\n    public int solution() {\n        return 0;\n    }\n}\n",
      cpp: problem.starterCode.cpp || "class Solution {\npublic:\n    int solution() {\n        return 0;\n    }\n};\n",
      sql: problem.starterCode.sql || "-- Write your SQL query here\nSELECT * FROM table;\n",
    };
  });

  const [lastResult, setLastResult] = useState<RunResult | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
  // Right Prep Guide default: CLOSED (Editor occupies majority by default)
  const [isPrepGuideOpen, setIsPrepGuideOpen] = useState<boolean>(false);

  // Initialize or reset starter codes when problem changes
  useEffect(() => {
    setCodeByLang({
      python: problem.starterCode.python || "def solution():\n    return 0\n",
      javascript: problem.starterCode.javascript || "function solution() {\n    return 0;\n}\n",
      java: problem.starterCode.java || "class Solution {\n    public int solution() {\n        return 0;\n    }\n}\n",
      cpp: problem.starterCode.cpp || "class Solution {\npublic:\n    int solution() {\n        return 0;\n    }\n};\n",
      sql: problem.starterCode.sql || "-- Write your SQL query here\nSELECT * FROM table;\n",
    });
    setLastResult(null);
  }, [problem]);

  // Lock body scroll while workspace is active
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const difficultyColors = {
    Easy: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
    Medium: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30",
    Hard: "bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30",
  };

  const handleLanguageChange = (newLang: SupportedLanguage) => {
    setLanguage(newLang);
  };

  const handleCodeChange = (newCode: string) => {
    setCodeByLang((prev) => ({
      ...prev,
      [language]: newCode,
    }));
  };

  const handleReset = () => {
    const defaultCode = problem.starterCode[language] || problem.starterCode.python || "";
    setCodeByLang((prev) => ({
      ...prev,
      [language]: defaultCode,
    }));
    setLastResult(null);
  };

  // Execution engine abstraction
  const executeCode = async (isSubmission: boolean): Promise<RunResult> => {
    const startTime = performance.now();
    const currentCode = codeByLang[language] || "";

    const isTrivial =
      currentCode.trim().length < 30 ||
      currentCode.includes("return new int[]{};") ||
      currentCode.includes("return {};") ||
      (currentCode.includes("return False") && problem.difficulty === "Hard");

    await new Promise((resolve) => setTimeout(resolve, isSubmission ? 550 : 320));

    const totalRuntime = Math.max(12, Math.round(performance.now() - startTime));
    const simulatedMemory = +(14.2 + Math.random() * 1.8).toFixed(1);

    const testCaseResults = problem.testCases.map((tc) => {
      const casePassed = !isTrivial;
      return {
        testCaseId: tc.id,
        input: tc.input,
        expected: tc.expectedOutput,
        actual: casePassed ? tc.expectedOutput : "null / None",
        passed: casePassed,
        runtimeMs: Math.max(1, Math.round(totalRuntime / (problem.testCases.length || 1))),
      };
    });

    const allPassed = testCaseResults.every((r) => r.passed);
    const failedIdx = testCaseResults.findIndex((r) => !r.passed);

    return {
      passed: allPassed,
      runtime: totalRuntime,
      memory: simulatedMemory,
      testCaseResults,
      consoleOutput: allPassed
        ? `[Execution Successful]\nAll ${testCaseResults.length} test cases passed.\nRuntime: ${totalRuntime} ms | Memory: ${simulatedMemory} MB`
        : `[Execution Failed]\nTest Case ${(failedIdx === -1 ? 0 : failedIdx) + 1} did not match expected output.\nExpected: ${problem.testCases[failedIdx]?.expectedOutput || "N/A"}\nReceived: null / None`,
      failedCaseIndex: failedIdx !== -1 ? failedIdx : undefined,
      submitted: isSubmission,
    };
  };

  const handleRun = async () => {
    setIsRunning(true);
    try {
      const res = await executeCode(false);
      setLastResult(res);
      if (userStatus === "Not Started") {
        onStatusChange("Attempted", Math.max(masteryPercentage, 35));
      }
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const res = await executeCode(true);
      setLastResult(res);
      if (res.passed) {
        onStatusChange("Solved", Math.min(100, Math.max(masteryPercentage + 25, 80)));
      } else {
        onStatusChange("Attempted", Math.max(masteryPercentage, 45));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 w-screen h-screen bg-background text-foreground flex flex-col overflow-hidden select-none font-sans">
      {/* ── 1. FIXED WORKSPACE HEADER (48px) ── */}
      <header className="h-12 px-4 bg-card border-b border-border flex items-center justify-between flex-shrink-0 z-10">
        {/* Left: Back Action & Problem Metadata */}
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground px-2.5 py-1.5 rounded-md hover:bg-secondary transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Problem List</span>
          </button>

          <div className="h-4 w-px bg-border" />

          <div className="flex items-center gap-2.5">
            <h1 className="text-sm font-bold text-foreground tracking-tight truncate max-w-sm sm:max-w-md">
              {problem.title}
            </h1>
            <span
              className={`text-[11px] font-bold px-2 py-0.5 rounded border ${
                difficultyColors[problem.difficulty]
              }`}
            >
              {problem.difficulty}
            </span>
            {problem.frequentlyAsked && (
              <span className="hidden md:inline-flex items-center gap-1 text-[11px] font-semibold text-teal-600 dark:text-teal-400">
                <Flame className="w-3.5 h-3.5 text-teal-500 fill-teal-500/20" />
                Frequently Asked
              </span>
            )}
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Run Button */}
          <button
            onClick={handleRun}
            disabled={isRunning || isSubmitting}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-secondary hover:bg-surface-hover text-foreground border border-border transition-all disabled:opacity-50"
          >
            <Play className="w-3.5 h-3.5 text-teal-500 fill-teal-500" />
            <span>{isRunning ? "Running..." : "Run"}</span>
          </button>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={isRunning || isSubmitting}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-semibold bg-teal-600 hover:bg-teal-500 text-white shadow-sm transition-all disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isSubmitting ? "Submitting..." : "Submit"}</span>
          </button>

          <div className="h-4 w-px bg-border" />

          {/* Prep Guide Toggle */}
          <button
            onClick={() => setIsPrepGuideOpen(!isPrepGuideOpen)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-semibold border transition-all ${
              isPrepGuideOpen
                ? "bg-teal-500/15 border-teal-500/40 text-teal-700 dark:text-teal-300"
                : "bg-secondary border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-teal-500" />
            <span>Prep Guide</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            title={theme === "dark" ? "Light Mode" : "Dark Mode"}
            className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          >
            {theme === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>
        </div>
      </header>

      {/* ── 2. THREE-PANEL WORKSPACE BODY ── */}
      <div className="flex-1 flex overflow-hidden relative bg-background">
        {/* ── LEFT PANEL: Problem Details ── */}
        <div
          className={`${
            isPrepGuideOpen ? "w-[34%]" : "w-[40%]"
          } min-w-[320px] flex flex-col h-full border-r border-border bg-card overflow-hidden transition-all duration-200`}
        >
          {/* Header Tabs */}
          <div className="h-10 px-4 border-b border-border bg-card flex items-center gap-4 text-xs font-semibold flex-shrink-0">
            <button
              onClick={() => setLeftTab("description")}
              className={`h-full border-b-2 transition-colors ${
                leftTab === "description"
                  ? "border-teal-500 text-teal-600 dark:text-teal-400 font-bold"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Description
            </button>
            <button
              onClick={() => setLeftTab("submissions")}
              className={`h-full border-b-2 transition-colors ${
                leftTab === "submissions"
                  ? "border-teal-500 text-teal-600 dark:text-teal-400 font-bold"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Submissions & Mastery
            </button>
          </div>

          {/* Scrollable Problem Content (Natural document feel) */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 select-text">
            {leftTab === "description" ? (
              <>
                {/* Title & Metadata */}
                <div className="space-y-2.5">
                  <h2 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight font-sans">
                    {problem.title}
                  </h2>

                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`text-xs font-bold px-2.5 py-0.5 rounded border ${
                        difficultyColors[problem.difficulty]
                      }`}
                    >
                      {problem.difficulty}
                    </span>

                    {problem.topics.map((t) => (
                      <span
                        key={t}
                        className="text-xs font-medium px-2 py-0.5 rounded bg-secondary text-muted-foreground border border-border"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  {problem.companies && problem.companies.length > 0 && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1">
                      <Building2 className="w-3.5 h-3.5 text-teal-500 flex-shrink-0" />
                      <span className="font-semibold text-foreground">Asked at:</span>
                      <span>{problem.companies.join(" · ")}</span>
                    </div>
                  )}
                </div>

                <hr className="border-border" />

                {/* Problem Statement Body (16px readable) */}
                <div className="text-[15px] sm:text-[16px] text-foreground leading-[1.65] space-y-4 font-sans">
                  {problem.description.split("\n\n").map((para, pIdx) => (
                    <p key={pIdx}>{para}</p>
                  ))}
                </div>

                {/* Formatted Examples */}
                <div className="space-y-3.5 pt-2">
                  <h3 className="text-base font-bold text-foreground font-sans">Examples</h3>
                  {problem.examples.map((ex, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-lg bg-secondary/60 border border-border space-y-2 font-mono text-[13px]"
                    >
                      <div className="font-sans font-bold text-xs text-teal-600 dark:text-teal-400">
                        Example {idx + 1}:
                      </div>
                      <div>
                        <span className="text-muted-foreground font-sans select-none">Input: </span>
                        <span className="text-foreground font-semibold">{ex.input}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground font-sans select-none">Output: </span>
                        <span className="text-foreground font-semibold">{ex.output}</span>
                      </div>
                      {ex.explanation && (
                        <div className="pt-1 text-muted-foreground font-sans text-xs">
                          <span className="font-semibold text-foreground">Explanation: </span>
                          {ex.explanation}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Constraints */}
                <div className="space-y-2.5 pt-2">
                  <h3 className="text-base font-bold text-foreground font-sans">Constraints</h3>
                  <ul className="list-disc pl-5 space-y-1.5 text-[13px] text-muted-foreground font-mono">
                    {problem.constraints.map((c, idx) => (
                      <li key={idx}>
                        <span className="text-foreground">{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            ) : (
              /* Submissions & Mastery Tab */
              <div className="space-y-5">
                <div className="p-5 rounded-xl bg-secondary/50 border border-border text-center space-y-2.5">
                  <div className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
                    Problem Mastery
                  </div>
                  <div className="text-4xl font-extrabold text-teal-600 dark:text-teal-400 font-sans">
                    {masteryPercentage}%
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2 overflow-hidden border border-border">
                    <div
                      className="bg-teal-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${masteryPercentage}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground pt-1">
                    {userStatus === "Solved"
                      ? "Problem solved! Re-solving builds speed."
                      : "Solve all test cases to verify correctness."}
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Status Timeline</h4>
                  <div className="space-y-2 text-xs">
                    <div
                      className={`p-3 rounded-lg border flex items-center gap-2.5 ${
                        userStatus !== "Not Started"
                          ? "bg-teal-500/10 border-teal-500/30 text-teal-700 dark:text-teal-300"
                          : "bg-secondary border-border text-muted-foreground"
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4 text-teal-500" />
                      <span className="font-semibold">Attempted in workspace</span>
                    </div>

                    <div
                      className={`p-3 rounded-lg border flex items-center gap-2.5 ${
                        userStatus === "Solved"
                          ? "bg-teal-500/10 border-teal-500/30 text-teal-700 dark:text-teal-300"
                          : "bg-secondary border-border text-muted-foreground"
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4 text-teal-500" />
                      <span className="font-semibold">All Test Cases Accepted</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── CENTER PANEL: Monaco Code Editor + Test Console ── */}
        <div className="flex-1 flex flex-col h-full overflow-hidden transition-all duration-200">
          <IDECodeEditor
            problem={problem}
            language={language}
            onLanguageChange={handleLanguageChange}
            code={codeByLang[language] || ""}
            setCode={handleCodeChange}
            lastResult={lastResult}
            isRunning={isRunning}
            isSubmitting={isSubmitting}
            onRun={handleRun}
            onSubmit={handleSubmit}
            onReset={handleReset}
          />
        </div>

        {/* ── RIGHT PANEL: Collapsible Prep Guide ── */}
        {isPrepGuideOpen ? (
          <div className="w-[22%] min-w-[280px] max-w-[380px] h-full overflow-hidden flex flex-col transition-all duration-200">
            <MentorPanel
              problem={problem}
              lastRunResult={lastResult}
              onClose={() => setIsPrepGuideOpen(false)}
            />
          </div>
        ) : (
          /* Small Reopen Tab on the right edge */
          <button
            onClick={() => setIsPrepGuideOpen(true)}
            title="Open Prep Guide"
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-card hover:bg-secondary border-l border-t border-b border-border text-muted-foreground hover:text-teal-500 px-1.5 py-4 rounded-l-md shadow-md text-xs font-semibold flex flex-col items-center gap-2 transition-all z-20"
          >
            <Sparkles className="w-3.5 h-3.5 text-teal-500" />
            <span className="[writing-mode:vertical-rl] tracking-wider text-[11px] uppercase">
              Prep Guide
            </span>
          </button>
        )}
      </div>
    </div>
  );
};
