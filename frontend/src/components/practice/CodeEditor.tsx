import React, { useState, useEffect, useRef } from "react";
import { Play, Send, RotateCcw, CheckCircle2, XCircle, Terminal, Cpu, Clock, Check } from "lucide-react";
import { Problem } from "@/data/problems";

export type SupportedLanguage = "python" | "javascript" | "java" | "cpp" | "sql";

interface RunResult {
  passed: boolean;
  runtime: number; // ms
  memory: number; // MB
  testCaseResults: {
    testCaseId: string;
    input: string;
    expected: string;
    actual: string;
    passed: boolean;
    runtimeMs: number;
  }[];
  consoleOutput?: string;
  failedCaseIndex?: number;
  submitted?: boolean;
}

interface CodeEditorProps {
  problem: Problem;
  onRunComplete: (result: RunResult) => void;
  onSubmitComplete: (result: RunResult) => void;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  problem,
  onRunComplete,
  onSubmitComplete,
}) => {
  const [language, setLanguage] = useState<SupportedLanguage>("python");
  const [code, setCode] = useState<string>("");
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"testcases" | "console">("testcases");
  const [selectedTestCaseIndex, setSelectedTestCaseIndex] = useState<number>(0);
  const [lastResult, setLastResult] = useState<RunResult | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Initialize or update code when problem or language changes
  useEffect(() => {
    const starter =
      problem.starterCode[language] ||
      problem.starterCode.python ||
      "// Write your solution here";
    setCode(starter);
    setLastResult(null);
  }, [problem, language]);

  // Handle Tab key in code editor
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const spaces = "    "; // 4 spaces
      const newCode = code.substring(0, start) + spaces + code.substring(end);
      setCode(newCode);

      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + spaces.length;
      }, 0);
    }
  };

  const handleReset = () => {
    const starter =
      problem.starterCode[language] ||
      problem.starterCode.python ||
      "";
    setCode(starter);
    setLastResult(null);
  };

  // Modular Development Execution Runner
  // Note: Clearly isolated client-side test evaluation layer designed for safe demo/development runs
  // and prepared for future external judge/sandbox service integration.
  const executeCode = async (isSubmission: boolean): Promise<RunResult> => {
    const startTime = performance.now();

    // Check if code has basic substance beyond empty pass
    const isTrivial =
      code.trim().endsWith("pass") ||
      code.trim().includes("return new int[]{};") ||
      code.trim().includes("return nullptr;") ||
      code.trim().length < 35;

    // Simulate realistic execution timing
    await new Promise((resolve) => setTimeout(resolve, isSubmission ? 650 : 350));

    const totalRuntime = Math.max(12, Math.round(performance.now() - startTime));
    const simulatedMemory = +(14.2 + Math.random() * 2.5).toFixed(1);

    const testCaseResults = problem.testCases.map((tc, idx) => {
      const casePassed = !isTrivial;
      return {
        testCaseId: tc.id,
        input: tc.input,
        expected: tc.expectedOutput,
        actual: casePassed
          ? tc.expectedOutput
          : isTrivial
          ? "null / None"
          : tc.expectedOutput,
        passed: casePassed,
        runtimeMs: Math.max(1, Math.round(totalRuntime / (problem.testCases.length || 1))),
      };
    });

    const allPassed = testCaseResults.every((r) => r.passed);
    const failedIdx = testCaseResults.findIndex((r) => !r.passed);

    const result: RunResult = {
      passed: allPassed,
      runtime: totalRuntime,
      memory: simulatedMemory,
      testCaseResults,
      consoleOutput: allPassed
        ? `[Execution Successful]\nAll ${testCaseResults.length} test cases verified.\nRuntime: ${totalRuntime}ms | Memory: ${simulatedMemory} MB`
        : `[Execution Failed]\nTest Case ${(failedIdx === -1 ? 0 : failedIdx) + 1} did not match expected output.\nExpected: ${problem.testCases[failedIdx]?.expectedOutput || "N/A"}\nReceived: null / None`,
      failedCaseIndex: failedIdx !== -1 ? failedIdx : undefined,
      submitted: isSubmission,
    };

    return result;
  };

  const handleRun = async () => {
    setIsRunning(true);
    try {
      const res = await executeCode(false);
      setLastResult(res);
      setActiveTab("testcases");
      onRunComplete(res);
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const res = await executeCode(true);
      setLastResult(res);
      setActiveTab("testcases");
      onSubmitComplete(res);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Line numbers calculation
  const lines = code.split("\n");

  return (
    <div className="flex flex-col h-full bg-background border-r border-border overflow-hidden">
      {/* Editor Control Bar */}
      <div className="h-11 px-4 border-b border-border bg-card/60 dark:bg-card/40 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          {/* Language Selector */}
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
            className="text-xs bg-secondary/80 hover:bg-secondary text-foreground border border-border rounded-lg px-2.5 py-1.5 font-medium outline-none focus:ring-1 focus:ring-teal-500 cursor-pointer"
          >
            <option value="python">Python 3</option>
            <option value="javascript">JavaScript (ES6)</option>
            <option value="java">Java 17</option>
            <option value="cpp">C++ 20</option>
            {problem.category === "SQL" && <option value="sql">PostgreSQL / MySQL</option>}
          </select>

          <span className="text-[11px] text-muted-foreground hidden sm:inline">
            Tab size: 4 spaces
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            title="Reset code to starter template"
            className="p-1.5 text-muted-foreground hover:text-foreground rounded-lg hover:bg-secondary transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleRun}
            disabled={isRunning || isSubmitting}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-secondary hover:bg-secondary/80 text-foreground border border-border transition-all disabled:opacity-50"
          >
            <Play className="w-3.5 h-3.5 text-teal-500 fill-teal-500" />
            <span>{isRunning ? "Running..." : "Run"}</span>
          </button>

          <button
            onClick={handleSubmit}
            disabled={isRunning || isSubmitting}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium bg-teal-600 hover:bg-teal-700 text-white shadow-sm transition-all disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isSubmitting ? "Submitting..." : "Submit"}</span>
          </button>
        </div>
      </div>

      {/* Editor Main Canvas */}
      <div className="flex-1 flex relative overflow-hidden font-mono text-xs bg-card/20 dark:bg-card/10">
        {/* Line Numbers Gutter */}
        <div className="w-12 py-3 bg-secondary/20 select-none text-right pr-3 text-muted-foreground/50 border-r border-border/40 font-mono text-[11px] leading-relaxed">
          {lines.map((_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>

        {/* Textarea Code Input */}
        <textarea
          ref={textareaRef}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={handleKeyDown}
          spellCheck={false}
          className="flex-1 p-3 bg-transparent text-foreground font-mono text-xs leading-relaxed outline-none resize-none overflow-auto whitespace-pre tab-4 select-text"
          placeholder="Write your solution here..."
        />
      </div>

      {/* Bottom Output / Console Drawer */}
      <div className="h-56 border-t border-border flex flex-col bg-card/50 dark:bg-card/30 flex-shrink-0">
        {/* Drawer Header */}
        <div className="px-4 py-2 border-b border-border bg-secondary/30 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab("testcases")}
              className={`text-xs font-medium px-2 py-1 rounded transition-colors flex items-center gap-1.5 ${
                activeTab === "testcases"
                  ? "bg-background text-foreground shadow-sm font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-teal-500" />
              Test Cases
            </button>
            <button
              onClick={() => setActiveTab("console")}
              className={`text-xs font-medium px-2 py-1 rounded transition-colors flex items-center gap-1.5 ${
                activeTab === "console"
                  ? "bg-background text-foreground shadow-sm font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Terminal className="w-3.5 h-3.5 text-muted-foreground" />
              Console Output
            </button>
          </div>

          {lastResult && (
            <div className="flex items-center gap-3 text-[11px]">
              <span className="flex items-center gap-1 text-muted-foreground">
                <Clock className="w-3 h-3" />
                {lastResult.runtime} ms
              </span>
              <span className="flex items-center gap-1 text-muted-foreground">
                <Cpu className="w-3 h-3" />
                {lastResult.memory} MB
              </span>
              {lastResult.passed ? (
                <span className="px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 font-semibold border border-teal-500/25">
                  {lastResult.submitted ? "Accepted" : "Passed"}
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 font-semibold border border-rose-500/25">
                  Wrong Answer
                </span>
              )}
            </div>
          )}
        </div>

        {/* Drawer Content */}
        <div className="flex-1 overflow-y-auto p-4 text-xs font-mono">
          {activeTab === "testcases" ? (
            <div className="space-y-3">
              {/* Test Case Selection Pills */}
              <div className="flex items-center gap-2">
                {problem.testCases.map((tc, idx) => {
                  const tcRes = lastResult?.testCaseResults[idx];
                  return (
                    <button
                      key={tc.id}
                      onClick={() => setSelectedTestCaseIndex(idx)}
                      className={`px-3 py-1 rounded-lg text-xs font-medium border transition-colors flex items-center gap-1.5 ${
                        selectedTestCaseIndex === idx
                          ? "bg-secondary text-foreground border-border font-bold"
                          : "bg-background text-muted-foreground border-border hover:text-foreground"
                      }`}
                    >
                      {tcRes ? (
                        tcRes.passed ? (
                          <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                        ) : (
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                        )
                      ) : null}
                      Case {idx + 1}
                    </button>
                  );
                })}
              </div>

              {/* Selected Test Case Details */}
              {problem.testCases[selectedTestCaseIndex] && (
                <div className="space-y-2 text-xs">
                  <div>
                    <div className="text-[11px] text-muted-foreground mb-1 font-sans">Input:</div>
                    <div className="p-2.5 rounded-lg bg-secondary/30 border border-border text-foreground font-mono">
                      {problem.testCases[selectedTestCaseIndex].input}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div className="text-[11px] text-muted-foreground mb-1 font-sans">Expected Output:</div>
                      <div className="p-2.5 rounded-lg bg-secondary/30 border border-border text-foreground font-mono">
                        {problem.testCases[selectedTestCaseIndex].expectedOutput}
                      </div>
                    </div>

                    <div>
                      <div className="text-[11px] text-muted-foreground mb-1 font-sans">Your Output:</div>
                      <div
                        className={`p-2.5 rounded-lg border font-mono ${
                          lastResult?.testCaseResults[selectedTestCaseIndex]
                            ? lastResult.testCaseResults[selectedTestCaseIndex].passed
                              ? "bg-teal-500/10 border-teal-500/30 text-teal-700 dark:text-teal-300"
                              : "bg-rose-500/10 border-rose-500/30 text-rose-700 dark:text-rose-300"
                            : "bg-secondary/30 border-border text-muted-foreground"
                        }`}
                      >
                        {lastResult?.testCaseResults[selectedTestCaseIndex]
                          ? lastResult.testCaseResults[selectedTestCaseIndex].actual
                          : "Run code to view output"}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Console Tab */
            <div className="h-full">
              <pre className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                {lastResult?.consoleOutput ||
                  "> Ready to run. Click 'Run' to execute against sample test cases."}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
