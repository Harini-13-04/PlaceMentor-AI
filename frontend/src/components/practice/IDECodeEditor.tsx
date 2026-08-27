import React, { useState, useRef, useEffect } from "react";
import Editor, { OnMount } from "@monaco-editor/react";
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
  Check,
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

  const editorRef = useRef<any>(null);
  const isDraggingRef = useRef(false);

  const cacheKey = `${problem.id}_${selectedLanguage}`;
  const initialCode = codeCache[cacheKey] ?? (problem.starterCodes as any)[selectedLanguage] ?? "";

  // Helper to place cursor inside editable function body
  const placeCursorInBody = (editorInstance: any) => {
    if (!editorInstance) return;
    const model = editorInstance.getModel();
    if (!model) return;

    const lineCount = model.getLineCount();
    let targetLine = 1;
    let targetCol = 1;

    for (let i = 1; i <= lineCount; i++) {
      const content = model.getLineContent(i);
      if (
        content.includes("Write your") ||
        content.includes("TODO") ||
        content.includes("pass")
      ) {
        // If there's a next line, place on next line with appropriate indentation
        if (i < lineCount) {
          targetLine = i + 1;
          const nextLineContent = model.getLineContent(i + 1);
          targetCol = nextLineContent.length > 0 ? nextLineContent.length + 1 : 9;
        } else {
          targetLine = i;
          targetCol = content.length + 1;
        }
        break;
      }
    }

    if (targetLine === 1 && lineCount >= 3) {
      targetLine = 3;
      targetCol = 9;
    }

    editorInstance.setPosition({ lineNumber: targetLine, column: targetCol });
    editorInstance.revealPositionInCenterIfOutsideViewport({ lineNumber: targetLine, column: targetCol });
  };

  // When problem or language changes, update the editor model without causing keystroke re-renders
  useEffect(() => {
    if (editorRef.current) {
      const code = codeCache[cacheKey] ?? (problem.starterCodes as any)[selectedLanguage] ?? "";
      if (editorRef.current.getValue() !== code) {
        editorRef.current.setValue(code);
        setTimeout(() => placeCursorInBody(editorRef.current), 50);
      }
    }
  }, [problem.id, selectedLanguage]);

  const handleEditorDidMount: OnMount = (editor) => {
    editorRef.current = editor;
    placeCursorInBody(editor);
    editor.focus();
  };

  const handleEditorChange = (value: string | undefined) => {
    const val = value || "";
    codeCache[cacheKey] = val;
  };

  const handleResetCode = () => {
    const defaultStarter = (problem.starterCodes as any)[selectedLanguage] || "";
    setCodeCache((prev) => ({
      ...prev,
      [cacheKey]: defaultStarter,
    }));
    if (editorRef.current) {
      editorRef.current.setValue(defaultStarter);
      setTimeout(() => placeCursorInBody(editorRef.current), 50);
    }
  };

  const getCurrentCode = () => {
    return editorRef.current ? editorRef.current.getValue() : initialCode;
  };

  // Vertical resize handlers for Bottom Test Console
  const startVerticalResize = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    const startY = e.clientY;
    const startHeight = consoleHeight;

    const onMouseMove = (moveEvent: MouseEvent) => {
      if (!isDraggingRef.current) return;
      const deltaY = startY - moveEvent.clientY;
      const newHeight = Math.max(120, Math.min(window.innerHeight * 0.7, startHeight + deltaY));
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

  const currentLangObj = LANGUAGE_OPTIONS.find((l) => l.id === selectedLanguage) || LANGUAGE_OPTIONS[0];

  return (
    <div className="h-full w-full flex flex-col bg-background text-foreground select-none overflow-hidden">
      {/* 1. Editor Sub-Header: Language selector, Reset code, Quick stats */}
      <div className="h-10 px-3 border-b border-border bg-card/90 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          {/* Language Dropdown */}
          <select
            value={selectedLanguage}
            onChange={(e) => onLanguageChange(e.target.value as SupportedLanguage)}
            className="px-2.5 py-1 rounded-lg border border-border bg-secondary text-foreground text-xs font-semibold focus:outline-none focus:border-purple-500 cursor-pointer shadow-sm"
          >
            {LANGUAGE_OPTIONS.map((lang) => (
              <option key={lang.id} value={lang.id}>
                {lang.label}
              </option>
            ))}
          </select>

          <span className="text-[11px] text-muted-foreground font-mono hidden sm:inline">
            Monaco Engine &bull; Auto-formatting enabled
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleResetCode}
            title="Reset code to default template"
            className="p-1 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 text-[11px] font-medium"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* 2. Monaco Editor Viewport (Flex-1) */}
      <div className="flex-1 w-full relative min-h-[200px]">
        <Editor
          height="100%"
          width="100%"
          language={currentLangObj.monacoLang}
          defaultValue={initialCode}
          theme={theme === "dark" ? "vs-dark" : "light"}
          onMount={handleEditorDidMount}
          onChange={handleEditorChange}
          options={{
            fontSize: 14,
            fontFamily: "'JetBrains Mono', 'Fira Code', Menlo, monospace",
            lineNumbers: "on",
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 4,
            insertSpaces: true,
            cursorBlinking: "smooth",
            cursorSmoothCaretAnimation: "on",
            smoothScrolling: true,
            padding: { top: 12, bottom: 12 },
            renderLineHighlight: "all",
            wordWrap: "on",
            suggestOnTriggerCharacters: true,
          }}
        />
      </div>

      {/* 3. Bottom Testcase / Console Drawer */}
      <div
        style={{ height: consoleCollapsed ? "36px" : `${consoleHeight}px` }}
        className="border-t border-border bg-card flex flex-col shrink-0 transition-[height] duration-75 relative z-10 shadow-lg"
      >
        {/* Drag Handle Bar for vertical resizing */}
        <div
          onMouseDown={startVerticalResize}
          className="absolute -top-1.5 inset-x-0 h-3 cursor-row-resize flex items-center justify-center group z-20"
        >
          <div className="w-12 h-1 rounded-full bg-border group-hover:bg-purple-500 transition-colors" />
        </div>

        {/* Console Header Tabs */}
        <div className="h-9 px-3 border-b border-border bg-secondary/50 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                setActiveConsoleTab("testcase");
                setConsoleCollapsed(false);
              }}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                activeConsoleTab === "testcase" && !consoleCollapsed
                  ? "bg-card text-foreground shadow-sm border border-border"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Test Cases ({problem.testCases.length})
            </button>

            <button
              onClick={() => {
                setActiveConsoleTab("result");
                setConsoleCollapsed(false);
              }}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeConsoleTab === "result" && !consoleCollapsed
                  ? "bg-card text-foreground shadow-sm border border-border"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span>Test Result</span>
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
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                activeConsoleTab === "console" && !consoleCollapsed
                  ? "bg-card text-foreground shadow-sm border border-border"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Output
            </button>
          </div>

          <button
            onClick={() => setConsoleCollapsed(!consoleCollapsed)}
            className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-secondary"
            title={consoleCollapsed ? "Expand Console" : "Collapse Console"}
          >
            {consoleCollapsed ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {/* Console Body Area */}
        {!consoleCollapsed && (
          <div className="flex-1 overflow-y-auto p-3 text-xs font-mono">
            {/* Tab 1: Test Cases */}
            {activeConsoleTab === "testcase" && (
              <div className="space-y-3">
                <div className="flex items-center gap-1.5 flex-wrap">
                  {problem.testCases.map((tc, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveTestCaseIdx(idx)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                        activeTestCaseIdx === idx
                          ? "bg-purple-600 text-white shadow-sm"
                          : "bg-secondary text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      Case {idx + 1}
                    </button>
                  ))}
                </div>

                <div className="space-y-2 p-3 rounded-xl border border-border bg-secondary/30">
                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Input:</span>
                    <pre className="mt-0.5 p-2 rounded-lg bg-card border border-border text-foreground font-mono text-[11px] overflow-x-auto">
                      {problem.testCases[activeTestCaseIdx]?.input}
                    </pre>
                  </div>

                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Expected Output:</span>
                    <pre className="mt-0.5 p-2 rounded-lg bg-card border border-border text-emerald-600 dark:text-emerald-400 font-mono text-[11px] overflow-x-auto">
                      {problem.testCases[activeTestCaseIdx]?.expectedOutput}
                    </pre>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Test Result */}
            {activeConsoleTab === "result" && (
              <div>
                {!executionResult ? (
                  <div className="py-6 text-center text-muted-foreground space-y-1">
                    <p className="text-xs">Run your code or submit to evaluate test cases.</p>
                    <p className="text-[10px]">Click 'Run' for sample testcases or 'Submit' for full benchmark verification.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-border">
                      <div className="flex items-center gap-2">
                        {executionResult.status === "Accepted" ? (
                          <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Accepted</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400 font-bold text-sm">
                            <XCircle className="w-4 h-4" />
                            <span>{executionResult.status}</span>
                          </div>
                        )}
                        <span className="text-xs text-muted-foreground">
                          ({executionResult.passedCount}/{executionResult.totalCount} test cases passed)
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-xs font-mono text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-amber-500" />
                          <span>{executionResult.runtime} ms</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <HardDrive className="w-3.5 h-3.5 text-blue-500" />
                          <span>{executionResult.memory} MB</span>
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {executionResult.testCaseResults?.map((res, i) => (
                        <div
                          key={i}
                          className={`p-2.5 rounded-xl border space-y-1.5 ${
                            res.passed ? "border-emerald-500/30 bg-emerald-500/5" : "border-rose-500/30 bg-rose-500/5"
                          }`}
                        >
                          <div className="flex items-center justify-between text-[11px] font-bold">
                            <span>
                              {res.isHidden ? "Hidden Benchmark Case" : `Testcase ${i + 1}`}
                            </span>
                            <span className={res.passed ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}>
                              {res.passed ? "Passed" : "Failed"}
                            </span>
                          </div>

                          {!res.isHidden && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px]">
                              <div>
                                <span className="text-muted-foreground">Expected:</span>
                                <pre className="p-1 rounded bg-card text-emerald-600 dark:text-emerald-400 overflow-x-auto">{res.expected}</pre>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Actual:</span>
                                <pre className={`p-1 rounded bg-card overflow-x-auto ${res.passed ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400 font-bold"}`}>
                                  {res.actual}
                                </pre>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tab 3: Output */}
            {activeConsoleTab === "console" && (
              <div className="space-y-2">
                <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Standard Output:</span>
                <pre className="p-3 rounded-xl bg-secondary/50 border border-border text-foreground font-mono text-xs overflow-x-auto min-h-[60px]">
                  {executionResult?.consoleOutput || "No stdout output logged during execution."}
                </pre>
              </div>
            )}
          </div>
        )}

        {/* Footer Run / Submit Action Bar */}
        <div className="h-12 px-3 border-t border-border bg-card flex items-center justify-between shrink-0">
          <div className="text-[11px] text-muted-foreground font-mono hidden sm:inline">
            Press <kbd className="px-1.5 py-0.5 rounded border border-border bg-secondary font-bold">Ctrl</kbd> + <kbd className="px-1.5 py-0.5 rounded border border-border bg-secondary font-bold">Enter</kbd> to Run
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <button
              disabled={isRunning || isSubmitting}
              onClick={() => onRun(getCurrentCode())}
              className="px-4 py-1.5 rounded-xl border border-border bg-secondary hover:bg-secondary/80 text-foreground text-xs font-bold transition-all disabled:opacity-50"
            >
              {isRunning ? "Running..." : "Run Code"}
            </button>

            <button
              disabled={isRunning || isSubmitting}
              onClick={() => onSubmit(getCurrentCode())}
              className="px-5 py-1.5 rounded-xl text-white text-xs font-bold shadow-md transition-all pm-btn-gradient disabled:opacity-50"
            >
              {isSubmitting ? "Evaluating..." : "Submit Solution"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
