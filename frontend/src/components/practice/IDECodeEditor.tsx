import React, { useState, useRef } from "react";
import Editor from "@monaco-editor/react";
import { useTheme } from "@/context/ThemeContext";
import { Problem } from "@/data/problems";
import {
  CheckCircle2,
  XCircle,
  Clock,
  HardDrive,
  ChevronUp,
  ChevronDown,
  RotateCcw,
  ShieldCheck,
} from "lucide-react";

export type SupportedLanguage =
  | "python3"
  | "python"
  | "java"
  | "java17"
  | "sql"
  | "numpy"
  | "c"
  | "cpp"
  | "javascript";

export const LANGUAGE_OPTIONS: { id: SupportedLanguage; label: string; monacoLang: string }[] = [
  { id: "python3", label: "Python 3", monacoLang: "python" },
  { id: "python", label: "Python", monacoLang: "python" },
  { id: "java", label: "Java", monacoLang: "java" },
  { id: "java17", label: "Java 17", monacoLang: "java" },
  { id: "cpp", label: "C++", monacoLang: "cpp" },
  { id: "c", label: "C", monacoLang: "c" },
  { id: "javascript", label: "JavaScript", monacoLang: "javascript" },
  { id: "sql", label: "SQL", monacoLang: "sql" },
  { id: "numpy", label: "NumPy", monacoLang: "python" },
];

interface ExecutionResult {
  status: "Accepted" | "Wrong Answer" | "Runtime Error" | "Compilation Error" | "Time Limit Exceeded";
  isSubmit?: boolean;
  runtime: number; // ms
  memory: number; // MB
  passedCount: number;
  totalCount: number;
  visiblePassed?: number;
  visibleTotal?: number;
  hiddenPassed?: number;
  hiddenTotal?: number;
  testCaseResults: {
    input: string;
    expected: string;
    actual: string;
    passed: boolean;
    isHidden?: boolean;
  }[];
  consoleOutput?: string;
}

interface IDECodeEditorProps {
  problem: Problem;
  selectedLanguage: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
  isRunning: boolean;
  isSubmitting: boolean;
  onRun: (code: string) => void;
  onSubmit: (code: string) => void;
  executionResult: ExecutionResult | null;
  activeConsoleTab: "testcase" | "result" | "console";
  setActiveConsoleTab: (tab: "testcase" | "result" | "console") => void;
}

export default function IDECodeEditor({
  problem,
  selectedLanguage,
  onLanguageChange,
  isRunning,
  isSubmitting,
  onRun,
  onSubmit,
  executionResult,
  activeConsoleTab,
  setActiveConsoleTab,
}: IDECodeEditorProps) {
  const { theme } = useTheme();

  // Multi-language code state cache
  const [codeCache, setCodeCache] = useState<Record<string, string>>({});
  const [activeTestCaseIdx, setActiveTestCaseIdx] = useState(0);
  const [consoleHeight, setConsoleHeight] = useState(240);
  const [consoleCollapsed, setConsoleCollapsed] = useState(false);
  const isDraggingRef = useRef(false);

  const cacheKey = `${problem.id}_${selectedLanguage}`;
  const currentCode = codeCache[cacheKey] ?? (problem.starterCodes as any)[selectedLanguage] ?? "";

  const handleEditorChange = (value: string | undefined) => {
    setCodeCache((prev) => ({
      ...prev,
      [cacheKey]: value || "",
    }));
  };

  const handleResetCode = () => {
    const defaultStarter = (problem.starterCodes as any)[selectedLanguage] || "";
    setCodeCache((prev) => ({
      ...prev,
      [cacheKey]: defaultStarter,
    }));
  };

  // Vertical resize handlers for Bottom Test Console
  const startVerticalResize = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    const startY = e.clientY;
    const startHeight = consoleHeight;

    const onMouseMove = (moveEvent: MouseEvent) => {
      if (!isDraggingRef.current) return;
      const deltaY = startY - moveEvent.clientY;
      const newHeight = Math.max(140, Math.min(500, startHeight + deltaY));
      setConsoleHeight(newHeight);
      setConsoleCollapsed(false);
    };

    const onMouseUp = () => {
      isDraggingRef.current = false;
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  const monacoLang =
    LANGUAGE_OPTIONS.find((l) => l.id === selectedLanguage)?.monacoLang || "python";

  return (
    <div className="h-full flex flex-col bg-card overflow-hidden font-sans border-r border-border">
      {/* Editor Sub-Header / Language Selector Bar */}
      <div className="h-10 px-3 border-b border-border bg-secondary/40 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <select
            value={selectedLanguage}
            onChange={(e) => onLanguageChange(e.target.value as SupportedLanguage)}
            className="px-2.5 py-1 rounded-md border border-border bg-card text-foreground text-xs font-semibold focus:outline-none focus:border-teal-500 cursor-pointer"
          >
            {LANGUAGE_OPTIONS.map((lang) => (
              <option key={lang.id} value={lang.id}>
                {lang.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleResetCode}
            title="Reset code to starter template"
            className="p-1.5 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Monaco Code Editor Container */}
      <div className="flex-1 min-h-0 relative">
        <Editor
          height="100%"
          language={monacoLang}
          value={currentCode}
          theme={theme === "dark" ? "vs-dark" : "vs"}
          onChange={handleEditorChange}
          options={{
            fontSize: 14.5,
            lineHeight: 22,
            fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
            tabSize: 4,
            insertSpaces: true,
            renderLineHighlight: "all",
            bracketPairColorization: { enabled: true },
            guides: { indentation: true, bracketPairs: true },
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            smoothScrolling: true,
            padding: { top: 12, bottom: 12 },
            automaticLayout: true,
          }}
        />
      </div>

      {/* Vertical Drag Handle for Console */}
      <div
        onMouseDown={startVerticalResize}
        className="h-1.5 bg-border hover:bg-teal-500/60 cursor-row-resize transition-colors shrink-0 flex items-center justify-center group"
      >
        <div className="w-12 h-0.5 rounded-full bg-muted-foreground/40 group-hover:bg-teal-400" />
      </div>

      {/* Bottom Test & Console Drawer (Typography: 14-15px) */}
      <div
        style={{ height: consoleCollapsed ? "36px" : `${consoleHeight}px` }}
        className="border-t border-border bg-card flex flex-col shrink-0 transition-all duration-150 relative overflow-hidden"
      >
        {/* Drawer Tabs Header */}
        <div className="h-9 px-3 border-b border-border bg-secondary/30 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                setActiveConsoleTab("testcase");
                setConsoleCollapsed(false);
              }}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                activeConsoleTab === "testcase"
                  ? "bg-card text-foreground border border-border shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Testcase
            </button>
            <button
              onClick={() => {
                setActiveConsoleTab("result");
                setConsoleCollapsed(false);
              }}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 ${
                activeConsoleTab === "result"
                  ? "bg-card text-foreground border border-border shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Test Result
              {executionResult && (
                <span
                  className={`w-2 h-2 rounded-full ${
                    executionResult.status === "Accepted" ? "bg-emerald-500" : "bg-rose-500"
                  }`}
                />
              )}
            </button>
            <button
              onClick={() => {
                setActiveConsoleTab("console");
                setConsoleCollapsed(false);
              }}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                activeConsoleTab === "console"
                  ? "bg-card text-foreground border border-border shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Console
            </button>
          </div>

          <button
            onClick={() => setConsoleCollapsed(!consoleCollapsed)}
            className="p-1 text-muted-foreground hover:text-foreground rounded transition-colors"
          >
            {consoleCollapsed ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {/* Drawer Body Content */}
        {!consoleCollapsed && (
          <div className="flex-1 overflow-y-auto p-4 text-[14px] sm:text-[15px] font-mono leading-relaxed">
            {/* Tab: Testcase */}
            {activeConsoleTab === "testcase" && (
              <div className="space-y-3.5">
                <div className="flex items-center gap-2">
                  {problem.testCases.map((tc, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveTestCaseIdx(idx)}
                      className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors ${
                        activeTestCaseIdx === idx
                          ? "bg-teal-500/15 text-teal-600 dark:text-teal-400 border border-teal-500/30 font-bold"
                          : "bg-secondary text-muted-foreground hover:text-foreground border border-border"
                      }`}
                    >
                      Case {idx + 1}
                    </button>
                  ))}
                </div>

                <div className="space-y-1.5">
                  <p className="text-xs font-bold text-muted-foreground font-sans uppercase tracking-wider">Input</p>
                  <pre className="p-3 rounded-lg border border-border bg-secondary/40 text-foreground overflow-x-auto text-[14px]">
                    {problem.testCases[activeTestCaseIdx]?.input}
                  </pre>
                </div>

                <div className="space-y-1.5">
                  <p className="text-xs font-bold text-muted-foreground font-sans uppercase tracking-wider">Expected Output</p>
                  <pre className="p-3 rounded-lg border border-border bg-secondary/40 text-foreground overflow-x-auto text-[14px]">
                    {problem.testCases[activeTestCaseIdx]?.expectedOutput}
                  </pre>
                </div>
              </div>
            )}

            {/* Tab: Test Result */}
            {activeConsoleTab === "result" && (
              <div>
                {!executionResult ? (
                  <div className="py-8 text-center text-muted-foreground font-sans">
                    <p className="text-sm">Click "Run" or "Submit" to evaluate code against test cases.</p>
                  </div>
                ) : (
                  <div className="space-y-3.5 font-sans">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2.5">
                        {executionResult.status === "Accepted" ? (
                          <span className="px-3 py-1 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-sm font-bold flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4" /> Accepted
                          </span>
                        ) : (
                          <span className="px-3 py-1 rounded-md bg-rose-500/15 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-sm font-bold flex items-center gap-1.5">
                            <XCircle className="w-4 h-4" /> {executionResult.status}
                          </span>
                        )}

                        <span className="text-xs text-muted-foreground font-mono">
                          {executionResult.passedCount} / {executionResult.totalCount} testcases passed
                        </span>
                      </div>

                      <div className="flex items-center gap-3.5 text-xs text-muted-foreground font-mono">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-teal-500" /> Runtime: {executionResult.runtime} ms
                        </span>
                        <span className="flex items-center gap-1">
                          <HardDrive className="w-3.5 h-3.5 text-blue-500" /> Memory: {executionResult.memory} MB
                        </span>
                      </div>
                    </div>

                    {/* Hidden test summary if submitted */}
                    {executionResult.isSubmit && (
                      <div className="p-3 rounded-lg border border-teal-500/20 bg-teal-500/5 flex items-center justify-between text-xs font-mono">
                        <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400 font-semibold">
                          <ShieldCheck className="w-4 h-4" />
                          <span>Hidden Test Suite Evaluation</span>
                        </div>
                        <span className="text-muted-foreground">
                          {executionResult.hiddenPassed} / {executionResult.hiddenTotal} hidden cases passed
                        </span>
                      </div>
                    )}

                    {/* Visible Test Case Cards (14-15px content) */}
                    <div className="space-y-2.5 pt-1">
                      {executionResult.testCaseResults.map((tc, idx) => (
                        <div
                          key={idx}
                          className={`p-3.5 rounded-xl border text-[14px] font-mono space-y-1.5 ${
                            tc.passed ? "border-border bg-secondary/30" : "border-rose-500/30 bg-rose-500/5"
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <span className="font-semibold text-foreground font-sans text-xs">Case {idx + 1}</span>
                            <span className={`text-xs font-bold ${tc.passed ? "text-emerald-500" : "text-rose-500"}`}>
                              {tc.passed ? "Passed" : "Wrong Answer"}
                            </span>
                          </div>
                          <div>
                            <span className="text-muted-foreground text-xs uppercase font-sans">Input: </span>
                            <span className="text-foreground">{tc.input}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground text-xs uppercase font-sans">Output: </span>
                            <span className={tc.passed ? "text-teal-600 dark:text-teal-400 font-bold" : "text-rose-500 font-bold"}>
                              {tc.actual}
                            </span>
                          </div>
                          <div>
                            <span className="text-muted-foreground text-xs uppercase font-sans">Expected: </span>
                            <span className="text-foreground">{tc.expected}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tab: Console */}
            {activeConsoleTab === "console" && (
              <div className="space-y-2 font-mono">
                <p className="text-xs font-bold text-muted-foreground font-sans uppercase tracking-wider">Standard Output</p>
                <pre className="p-3 rounded-lg border border-border bg-secondary/40 text-foreground overflow-x-auto leading-relaxed text-[14px]">
                  {executionResult?.consoleOutput || "No stdout logged during execution."}
                </pre>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
