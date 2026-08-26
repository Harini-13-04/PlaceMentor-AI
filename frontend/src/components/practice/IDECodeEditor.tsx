import React, { useState, useEffect, useRef } from "react";
import Editor, { OnMount } from "@monaco-editor/react";
import {
  RotateCcw,
  Copy,
  Check,
  Terminal,
  Clock,
  Cpu,
  CheckCircle2,
  XCircle,
  ChevronDown,
  ChevronUp,
  Code2,
} from "lucide-react";
import { Problem } from "@/data/problems";
import { useTheme } from "@/context/ThemeContext";

export type SupportedLanguage = "python" | "javascript" | "java" | "cpp" | "sql";

export interface TestCaseResult {
  testCaseId: string;
  input: string;
  expected: string;
  actual: string;
  passed: boolean;
  runtimeMs: number;
}

export interface RunResult {
  passed: boolean;
  runtime: number; // ms
  memory: number; // MB
  testCaseResults: TestCaseResult[];
  consoleOutput?: string;
  failedCaseIndex?: number;
  submitted?: boolean;
}

interface IDECodeEditorProps {
  problem: Problem;
  language: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
  code: string;
  setCode: (code: string) => void;
  lastResult: RunResult | null;
  isRunning: boolean;
  isSubmitting: boolean;
  onRun: () => void;
  onSubmit: () => void;
  onReset: () => void;
}

export const IDECodeEditor: React.FC<IDECodeEditorProps> = ({
  problem,
  language,
  onLanguageChange,
  code,
  setCode,
  lastResult,
  isRunning,
  isSubmitting,
  onRun,
  onSubmit,
  onReset,
}) => {
  const { theme } = useTheme();
  const [activeConsoleTab, setActiveConsoleTab] = useState<"testcases" | "result" | "console">("testcases");
  const [selectedTestCaseIdx, setSelectedTestCaseIdx] = useState<number>(0);
  const [consoleExpanded, setConsoleExpanded] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);
  const [cursorPos, setCursorPos] = useState<{ line: number; col: number }>({ line: 1, col: 1 });

  const editorRef = useRef<any>(null);

  // Switch console tab to "result" automatically when execution finishes
  useEffect(() => {
    if (lastResult) {
      setActiveConsoleTab("result");
      setConsoleExpanded(true);
    }
  }, [lastResult]);

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;

    // Track cursor position
    editor.onDidChangeCursorPosition((e) => {
      setCursorPos({ line: e.position.lineNumber, col: e.position.column });
    });

    // Custom Keybindings (Ctrl+Enter to Run)
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      if (!isRunning && !isSubmitting) {
        onRun();
      }
    });

    // Indentation settings
    editor.getModel()?.updateOptions({
      tabSize: 4,
      insertSpaces: true,
    });
  };

  const getMonacoLanguage = (lang: SupportedLanguage): string => {
    switch (lang) {
      case "python":
        return "python";
      case "javascript":
        return "javascript";
      case "java":
        return "java";
      case "cpp":
        return "cpp";
      case "sql":
        return "sql";
      default:
        return "python";
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex flex-col h-full bg-background text-foreground font-sans text-sm overflow-hidden border-r border-border select-text">
      {/* ── 1. Editor Header Toolbar (38px) ── */}
      <div className="h-9 px-3.5 bg-card border-b border-border flex items-center justify-between flex-shrink-0 select-none">
        <div className="flex items-center gap-3">
          {/* Language Selector */}
          <select
            value={language}
            onChange={(e) => onLanguageChange(e.target.value as SupportedLanguage)}
            className="bg-secondary text-foreground border border-border rounded px-2.5 py-1 text-xs font-semibold outline-none focus:border-teal-500 cursor-pointer"
          >
            <option value="python">Python 3</option>
            <option value="javascript">JavaScript (Node.js)</option>
            <option value="java">Java 17 (OpenJDK)</option>
            <option value="cpp">C++ 20 (GCC)</option>
            {problem.category === "SQL" && <option value="sql">SQL (PostgreSQL)</option>}
          </select>

          <span className="text-[11px] font-mono text-muted-foreground hidden sm:inline">
            Spaces: 4
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={copyCode}
            title="Copy code"
            className="p-1.5 text-muted-foreground hover:text-foreground rounded hover:bg-secondary transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-teal-500" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={onReset}
            title="Reset code to starter template"
            className="p-1.5 text-muted-foreground hover:text-foreground rounded hover:bg-secondary transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ── 2. Monaco Editor Workspace Canvas ── */}
      <div className="flex-1 relative overflow-hidden bg-background">
        <Editor
          height="100%"
          language={getMonacoLanguage(language)}
          value={code}
          theme={theme === "dark" ? "vs-dark" : "vs"}
          onChange={(value) => setCode(value || "")}
          onMount={handleEditorDidMount}
          options={{
            fontSize: 14,
            fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
            fontLigatures: true,
            lineHeight: 22,
            tabSize: 4,
            insertSpaces: true,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            renderLineHighlight: "all",
            renderWhitespace: "selection",
            bracketPairColorization: { enabled: true },
            autoClosingBrackets: "always",
            autoClosingQuotes: "always",
            formatOnType: true,
            padding: { top: 10, bottom: 10 },
            cursorBlinking: "smooth",
            cursorSmoothCaretAnimation: "on",
            overviewRulerBorder: false,
            hideCursorInOverviewRuler: true,
            scrollbar: {
              vertical: "visible",
              horizontal: "visible",
              verticalScrollbarSize: 8,
              horizontalScrollbarSize: 8,
            },
          }}
        />
      </div>

      {/* ── 3. Editor Status Bar (24px) ── */}
      <div className="h-6 px-3 bg-card border-t border-border flex items-center justify-between text-[11px] font-mono text-muted-foreground select-none flex-shrink-0">
        <div className="flex items-center gap-3">
          <span>Ln {cursorPos.line}, Col {cursorPos.col}</span>
          <span>Tab Size: 4</span>
        </div>
        <div className="flex items-center gap-3">
          <span>UTF-8</span>
          <span className="capitalize">{language}</span>
        </div>
      </div>

      {/* ── 4. Testcase & Console Bottom Drawer ── */}
      <div
        className={`border-t border-border bg-card flex flex-col flex-shrink-0 transition-all duration-200 ${
          consoleExpanded ? "h-60" : "h-9"
        }`}
      >
        {/* Console Header Bar */}
        <div className="h-9 px-3 border-b border-border flex items-center justify-between flex-shrink-0 font-sans">
          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                setActiveConsoleTab("testcases");
                setConsoleExpanded(true);
              }}
              className={`px-2.5 py-1 text-xs font-semibold rounded transition-colors flex items-center gap-1.5 ${
                activeConsoleTab === "testcases" && consoleExpanded
                  ? "bg-secondary text-teal-600 dark:text-teal-400 border border-border"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span>Testcase</span>
            </button>

            <button
              onClick={() => {
                setActiveConsoleTab("result");
                setConsoleExpanded(true);
              }}
              className={`px-2.5 py-1 text-xs font-semibold rounded transition-colors flex items-center gap-1.5 ${
                activeConsoleTab === "result" && consoleExpanded
                  ? "bg-secondary text-teal-600 dark:text-teal-400 border border-border"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span>Test Result</span>
              {lastResult && (
                <span
                  className={`w-2 h-2 rounded-full ${
                    lastResult.passed ? "bg-emerald-500" : "bg-rose-500"
                  }`}
                />
              )}
            </button>

            <button
              onClick={() => {
                setActiveConsoleTab("console");
                setConsoleExpanded(true);
              }}
              className={`px-2.5 py-1 text-xs font-semibold rounded transition-colors flex items-center gap-1.5 ${
                activeConsoleTab === "console" && consoleExpanded
                  ? "bg-secondary text-teal-600 dark:text-teal-400 border border-border"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Console</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {lastResult && consoleExpanded && (
              <div className="flex items-center gap-3 text-[11px] font-mono text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-muted-foreground" />
                  {lastResult.runtime} ms
                </span>
                <span className="flex items-center gap-1">
                  <Cpu className="w-3 h-3 text-muted-foreground" />
                  {lastResult.memory} MB
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-xs font-bold font-sans ${
                    lastResult.passed
                      ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                      : "bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30"
                  }`}
                >
                  {lastResult.submitted
                    ? lastResult.passed
                      ? "Accepted"
                      : "Wrong Answer"
                    : lastResult.passed
                    ? "Passed"
                    : "Failed"}
                </span>
              </div>
            )}

            <button
              onClick={() => setConsoleExpanded(!consoleExpanded)}
              className="p-1 text-muted-foreground hover:text-foreground rounded hover:bg-secondary transition-colors"
            >
              {consoleExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Console Content */}
        {consoleExpanded && (
          <div className="flex-1 overflow-y-auto p-3.5 font-mono text-[13px] bg-background">
            {activeConsoleTab === "testcases" && (
              <div className="space-y-3 font-sans">
                {/* Case Pills */}
                <div className="flex items-center gap-1.5">
                  {problem.testCases.map((tc, idx) => {
                    const tcRes = lastResult?.testCaseResults[idx];
                    return (
                      <button
                        key={tc.id}
                        onClick={() => setSelectedTestCaseIdx(idx)}
                        className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                          selectedTestCaseIdx === idx
                            ? "bg-secondary text-foreground border border-border"
                            : "text-muted-foreground hover:text-foreground border border-transparent"
                        }`}
                      >
                        {tcRes && (
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              tcRes.passed ? "bg-emerald-500" : "bg-rose-500"
                            }`}
                          />
                        )}
                        Case {idx + 1}
                      </button>
                    );
                  })}
                </div>

                {/* Selected Case Parameters */}
                {problem.testCases[selectedTestCaseIdx] && (
                  <div className="space-y-2 font-mono text-xs">
                    <div>
                      <div className="text-[11px] font-sans text-muted-foreground mb-1 font-semibold">Input:</div>
                      <div className="p-2 rounded bg-card border border-border text-foreground">
                        {problem.testCases[selectedTestCaseIdx].input}
                      </div>
                    </div>

                    <div>
                      <div className="text-[11px] font-sans text-muted-foreground mb-1 font-semibold">Expected Output:</div>
                      <div className="p-2 rounded bg-card border border-border text-foreground">
                        {problem.testCases[selectedTestCaseIdx].expectedOutput}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeConsoleTab === "result" && (
              <div className="space-y-3 font-sans">
                {lastResult ? (
                  <div>
                    <div className="flex items-center gap-2 mb-2.5">
                      <span
                        className={`text-sm font-bold flex items-center gap-1.5 ${
                          lastResult.passed ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
                        }`}
                      >
                        {lastResult.passed ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <XCircle className="w-4 h-4 text-rose-500" />
                        )}
                        {lastResult.submitted
                          ? lastResult.passed
                            ? "Accepted"
                            : "Wrong Answer"
                          : lastResult.passed
                          ? "Test Cases Passed"
                          : "Test Case Failed"}
                      </span>
                      <span className="text-xs font-mono text-muted-foreground">
                        ({lastResult.runtime} ms · {lastResult.memory} MB)
                      </span>
                    </div>

                    {lastResult.testCaseResults[selectedTestCaseIdx] && (
                      <div className="space-y-2 font-mono text-xs">
                        <div>
                          <div className="text-[11px] font-sans text-muted-foreground mb-1 font-semibold">Input:</div>
                          <div className="p-2 rounded bg-card border border-border text-foreground">
                            {lastResult.testCaseResults[selectedTestCaseIdx].input}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <div className="text-[11px] font-sans text-muted-foreground mb-1 font-semibold">Expected Output:</div>
                            <div className="p-2 rounded bg-card border border-border text-foreground">
                              {lastResult.testCaseResults[selectedTestCaseIdx].expected}
                            </div>
                          </div>

                          <div>
                            <div className="text-[11px] font-sans text-muted-foreground mb-1 font-semibold">Your Output:</div>
                            <div
                              className={`p-2 rounded border ${
                                lastResult.testCaseResults[selectedTestCaseIdx].passed
                                  ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-700 dark:text-emerald-300"
                                  : "bg-rose-500/10 border-rose-500/40 text-rose-700 dark:text-rose-300"
                              }`}
                            >
                              {lastResult.testCaseResults[selectedTestCaseIdx].actual}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-muted-foreground text-xs py-4 text-center">
                    Click "Run" or "Submit" to view execution results.
                  </div>
                )}
              </div>
            )}

            {activeConsoleTab === "console" && (
              <div>
                <pre className="text-foreground whitespace-pre-wrap font-mono text-xs">
                  {lastResult?.consoleOutput ||
                    "> Ready. Output from execution and test evaluation will appear here."}
                </pre>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
