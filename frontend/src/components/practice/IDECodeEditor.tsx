import React, { useState, useRef, useEffect, useMemo } from "react";
import CodeMirror, { ReactCodeMirrorRef } from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";
import { javascript } from "@codemirror/lang-javascript";
import { java } from "@codemirror/lang-java";
import { cpp } from "@codemirror/lang-cpp";
import { sql } from "@codemirror/lang-sql";
import { autocompletion, closeBrackets, closeBracketsKeymap, completionKeymap } from "@codemirror/autocomplete";
import { defaultKeymap, historyKeymap, history, indentWithTab } from "@codemirror/commands";
import { bracketMatching, foldGutter, foldKeymap, indentOnInput, HighlightStyle, syntaxHighlighting, indentUnit } from "@codemirror/language";
import { lineNumbers, highlightActiveLineGutter, highlightActiveLine, keymap, EditorView, drawSelection, dropCursor } from "@codemirror/view";
import { EditorState } from "@codemirror/state";
import { tags as t } from "@lezer/highlight";

import { Problem } from "@/data/problems";
import {
  CheckCircle2,
  XCircle,
  Clock,
  HardDrive,
  ChevronUp,
  ChevronDown,
  ShieldCheck,
  AlertTriangle,
  Copy,
  Check,
  Maximize2,
  Minimize2,
  Terminal,
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

const ALL_LANGUAGE_OPTIONS: { id: SupportedLanguage; label: string; tag: string }[] = [
  { id: "python3", label: "Python 3", tag: "PY" },
  { id: "python", label: "Python", tag: "PY" },
  { id: "java", label: "Java", tag: "JAVA" },
  { id: "java17", label: "Java 17", tag: "JAVA" },
  { id: "cpp", label: "C++", tag: "C++" },
  { id: "c", label: "C", tag: "C" },
  { id: "javascript", label: "JavaScript", tag: "JS" },
  { id: "sql", label: "SQL", tag: "SQL" },
  { id: "numpy", label: "NumPy", tag: "NUMPY" },
];

export interface ExecutionResult {
  status: "Accepted" | "Wrong Answer" | "Runtime Error" | "Compilation Error" | "Time Limit Exceeded" | "Need Solution" | "Execution Error";
  isSubmit?: boolean;
  message?: string;
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
    reason?: string;
    isHidden?: boolean;
  }[];
  consoleOutput?: string;
}

interface IDECodeEditorProps {
  problem: Problem;
  selectedLanguage: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
  code: string;
  onCodeChange: (code: string) => void;
  isRunning: boolean;
  isSubmitting: boolean;
  onRun: (code: string) => void;
  onSubmit: (code: string) => void;
  executionResult: ExecutionResult | null;
  activeConsoleTab: "testcase" | "result";
  setActiveConsoleTab: (tab: "testcase" | "result") => void;
  isFullScreen?: boolean;
  onToggleFullScreen?: () => void;
}

/**
 * PlaceMentor AI CodeMirror Dark Theme
 * Rich charcoal/navy surface, crisp contrast, custom active line and gutter.
 */
const placeMentorDarkTheme = EditorView.theme(
  {
    "&": {
      color: "#E2E8F0",
      backgroundColor: "#141923",
      fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', Consolas, Menlo, Monaco, monospace",
      fontSize: "13.5px",
      height: "100%",
    },
    ".cm-scroller": {
      overflow: "auto",
      fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', Consolas, Menlo, Monaco, monospace",
      lineHeight: "1.65",
    },
    ".cm-content": {
      caretColor: "#A78BFA",
      padding: "14px 0",
    },
    "&.cm-focused .cm-cursor": {
      borderLeftColor: "#A78BFA",
      borderLeftWidth: "2px",
    },
    "&.cm-focused .cm-selectionBackground, ::selection": {
      backgroundColor: "#312E81 !important",
    },
    ".cm-selectionMatch": {
      backgroundColor: "rgba(139, 92, 246, 0.25)",
    },
    ".cm-gutters": {
      backgroundColor: "#10141D",
      color: "#64748B",
      borderRight: "1px solid #1E2638",
      paddingRight: "12px",
      paddingLeft: "8px",
      userSelect: "none",
    },
    ".cm-activeLine": {
      backgroundColor: "#1B2232",
    },
    ".cm-activeLineGutter": {
      backgroundColor: "#1B2232",
      color: "#CBD5E1",
      fontWeight: "bold",
    },
    ".cm-matchingBracket": {
      backgroundColor: "rgba(139, 92, 246, 0.25)",
      outline: "1px solid #8B5CF6",
    },
    ".cm-foldGutter": {
      paddingLeft: "4px",
      color: "#64748B",
    },
    ".cm-foldGutter .cm-gutterElement": {
      cursor: "pointer",
      transition: "color 0.15s ease",
    },
    ".cm-foldGutter .cm-gutterElement:hover": {
      color: "#E2E8F0",
    },
    ".cm-tooltip": {
      backgroundColor: "#182030",
      border: "1px solid #28354D",
      color: "#E2E8F0",
      borderRadius: "8px",
      boxShadow: "0 8px 24px rgba(0,0,0,0.6)",
    },
    ".cm-tooltip-autocomplete": {
      "& > ul": {
        fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
        fontSize: "12px",
        maxHeight: "220px",
      },
      "& > ul > li": {
        padding: "5px 10px",
        borderRadius: "4px",
      },
      "& > ul > li[aria-selected]": {
        backgroundColor: "#7C3AED",
        color: "#ffffff",
      },
    },
  },
  { dark: true }
);

/**
 * Syntax Highlighting Token Palette for PlaceMentor IDE
 */
const placeMentorDarkHighlightStyle = HighlightStyle.define([
  { tag: t.keyword, color: "#C084FC", fontWeight: "bold" },
  { tag: [t.name, t.deleted, t.character, t.propertyName, t.macroName], color: "#93C5FD" },
  { tag: [t.function(t.variableName), t.labelName], color: "#60A5FA" },
  { tag: [t.color, t.constant(t.name), t.standard(t.name)], color: "#34D399" },
  { tag: [t.definition(t.name), t.separator], color: "#E2E8F0" },
  { tag: [t.typeName, t.className, t.changed, t.annotation, t.modifier, t.self, t.namespace], color: "#818CF8" },
  { tag: [t.number], color: "#FBBF24" },
  { tag: [t.operator, t.operatorKeyword, t.url, t.escape, t.regexp, t.link, t.special(t.string)], color: "#94A3B8" },
  { tag: [t.meta, t.comment], color: "#64748B", fontStyle: "italic" },
  { tag: t.strong, fontWeight: "bold" },
  { tag: t.emphasis, fontStyle: "italic" },
  { tag: t.strikethrough, textDecoration: "line-through" },
  { tag: t.link, color: "#818CF8", textDecoration: "underline" },
  { tag: t.heading, fontWeight: "bold", color: "#60A5FA" },
  { tag: [t.atom, t.bool, t.special(t.variableName)], color: "#F472B6" },
  { tag: [t.processingInstruction, t.string, t.inserted], color: "#34D399" },
  { tag: t.invalid, color: "#F87171" },
]);

/**
 * Computes exact position offset in text for the editable solution line
 */
function findEditablePosition(text: string): number {
  if (!text) return 0;
  const lines = text.split("\n");
  let offset = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (
      line.includes("Write your solution") ||
      line.includes("Write your vectorized") ||
      line.includes("Write your SQL query") ||
      line.includes("TODO")
    ) {
      if (i + 1 < lines.length) {
        const nextLine = lines[i + 1];
        const nextLineStart = offset + line.length + 1;
        const indentMatch = line.match(/^(\s*)/);
        const indentLen = indentMatch ? indentMatch[1].length : 4;
        return nextLineStart + Math.min(nextLine.length, indentLen);
      }
      return offset + line.length;
    }
    offset += line.length + 1;
  }

  return text.length;
}

export default function IDECodeEditor({
  problem,
  selectedLanguage,
  onLanguageChange,
  code,
  onCodeChange,
  isRunning,
  isSubmitting,
  onRun,
  onSubmit,
  executionResult,
  activeConsoleTab,
  setActiveConsoleTab,
  isFullScreen = false,
  onToggleFullScreen,
}: IDECodeEditorProps) {
  const [activeTestCaseIdx, setActiveTestCaseIdx] = useState(0);
  const [consoleHeight, setConsoleHeight] = useState(250);
  const [consoleCollapsed, setConsoleCollapsed] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const cmRef = useRef<ReactCodeMirrorRef>(null);
  const isDraggingRef = useRef(false);
  const lastPositionedKey = useRef<string>("");

  // Keep latest callbacks/values in refs so extensions array remains referentially stable during typing
  const codeRef = useRef(code);
  codeRef.current = code;
  const onRunRef = useRef(onRun);
  onRunRef.current = onRun;
  const onSubmitRef = useRef(onSubmit);
  onSubmitRef.current = onSubmit;

  const positionKey = `${problem.id}_${selectedLanguage}`;

  // Filter available languages based on problem type
  const isSqlProblem = problem.category === "Database & SQL" || problem.topic?.toLowerCase().includes("sql");
  const languageOptions = useMemo(() => {
    if (isSqlProblem) {
      return [
        { id: "sql" as SupportedLanguage, label: "SQL", tag: "SQL" },
        { id: "python3" as SupportedLanguage, label: "Python 3", tag: "PY" },
        { id: "javascript" as SupportedLanguage, label: "JavaScript", tag: "JS" },
      ];
    }
    return ALL_LANGUAGE_OPTIONS;
  }, [isSqlProblem]);

  // Position cursor dynamically when problem loads or language switches
  useEffect(() => {
    if (lastPositionedKey.current === positionKey) return;
    lastPositionedKey.current = positionKey;

    const timer = setTimeout(() => {
      const view = cmRef.current?.view;
      if (view) {
        const text = view.state.doc.toString();
        const pos = findEditablePosition(text);
        view.dispatch({
          selection: { anchor: pos, head: pos },
          scrollIntoView: true,
        });
        view.focus();
      }
    }, 60);

    return () => clearTimeout(timer);
  }, [positionKey]);

  // Language Extension Resolver with active language parser
  const languageExtension = useMemo(() => {
    switch (selectedLanguage) {
      case "python3":
      case "python":
      case "numpy":
        return python();
      case "javascript":
        return javascript();
      case "java":
      case "java17":
        return java();
      case "c":
      case "cpp":
        return cpp();
      case "sql":
        return sql();
      default:
        return python();
    }
  }, [selectedLanguage]);

  // Indentation Rule per language (2 spaces for JS/SQL, 4 spaces for Python/Java/C++)
  const isTwoSpaceLang = selectedLanguage === "javascript" || selectedLanguage === "sql";

  // CodeMirror Extensions Bundle - Referentially stable across keystrokes
  const extensions = useMemo(() => {
    return [
      languageExtension,
      indentUnit.of(isTwoSpaceLang ? "  " : "    "),
      EditorState.tabSize.of(isTwoSpaceLang ? 2 : 4),
      placeMentorDarkTheme,
      syntaxHighlighting(placeMentorDarkHighlightStyle),
      lineNumbers(),
      highlightActiveLineGutter(),
      highlightActiveLine(),
      drawSelection(),
      dropCursor(),
      history(),
      foldGutter(),
      indentOnInput(),
      bracketMatching(),
      closeBrackets(),
      autocompletion({
        activateOnTyping: true,
        maxRenderedOptions: 12,
        defaultKeymap: true,
      }),
      keymap.of([
        {
          key: "Mod-Enter",
          run: () => {
            onRunRef.current(codeRef.current);
            return true;
          },
        },
        {
          key: "Mod-Shift-Enter",
          run: () => {
            onSubmitRef.current(codeRef.current);
            return true;
          },
        },
        ...closeBracketsKeymap,
        ...defaultKeymap,
        ...historyKeymap,
        ...foldKeymap,
        ...completionKeymap,
        indentWithTab,
      ]),
      EditorView.lineWrapping,
    ];
  }, [languageExtension, isTwoSpaceLang]);

  const handleCopyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1500);
  };

  // Drag Resizer logic for Console Panel
  const handleMouseDown = (e: React.MouseEvent) => {
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

  const currentTestCase = problem.testCases?.[activeTestCaseIdx] || {
    input: "nums = [2,7,11,15], target = 9",
    expectedOutput: "[0,1]",
  };

  // Parse structured input fields
  const parsedInputs = useMemo(() => {
    const inputStr = currentTestCase.input || "";
    const parts = inputStr.split(/,\s*(?=[a-zA-Z_][a-zA-Z0-9_]*\s*=)/);
    if (parts.length > 1 || inputStr.includes("=")) {
      return parts.map((part) => {
        const eqIdx = part.indexOf("=");
        if (eqIdx >= 0) {
          return {
            name: part.substring(0, eqIdx).trim() + " =",
            value: part.substring(eqIdx + 1).trim(),
          };
        }
        return { name: "input =", value: part.trim() };
      });
    }
    return [{ name: "input =", value: inputStr }];
  }, [currentTestCase.input]);

  return (
    <div className="h-full w-full flex flex-col bg-[#141923] text-foreground overflow-hidden">
      {/* =========================================================================
          1. CODE EDITOR TOP HEADER (Language selector on left, ONLY Fullscreen on right)
         ========================================================================= */}
      <div className="h-11 px-3.5 border-b border-[#1E2638] bg-[#10141D] flex items-center justify-between shrink-0 select-none z-10">
        {/* Left: Enhanced Language Selector */}
        <div className="flex items-center gap-2">
          <div className="relative inline-block">
            <select
              value={selectedLanguage}
              onChange={(e) => onLanguageChange(e.target.value as SupportedLanguage)}
              aria-label="Programming Language"
              className="appearance-none pl-3 pr-8 py-1.5 text-xs font-semibold rounded-lg border border-[#28354D] bg-[#141923] text-[#E2E8F0] hover:border-[#8B5CF6]/60 focus:outline-none focus:border-[#8B5CF6] transition-colors cursor-pointer shadow-sm"
            >
              {languageOptions.map((lang) => (
                <option key={lang.id} value={lang.id} className="bg-[#141923] text-[#E2E8F0] py-1">
                  {lang.label}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-[#94A3B8] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Right: ONLY Fullscreen Icon Button (Zero clutter/extra buttons) */}
        <div className="flex items-center">
          {onToggleFullScreen && (
            <button
              type="button"
              onClick={onToggleFullScreen}
              title={isFullScreen ? "Exit Fullscreen" : "Fullscreen Workspace"}
              className="p-1.5 rounded-lg text-[#94A3B8] hover:text-white hover:bg-[#1E2638] border border-transparent hover:border-[#28354D] transition-all"
            >
              {isFullScreen ? (
                <Minimize2 className="w-4 h-4 text-[#A78BFA]" />
              ) : (
                <Maximize2 className="w-4 h-4" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* =========================================================================
          2. MAIN CODE EDITING CANVAS
         ========================================================================= */}
      <div className="flex-1 min-h-0 relative overflow-hidden bg-[#141923]">
        <CodeMirror
          ref={cmRef}
          value={code}
          height="100%"
          theme="dark"
          extensions={extensions}
          onChange={onCodeChange}
          basicSetup={false}
          className="h-full text-[13.5px] font-mono select-text"
        />
      </div>

      {/* =========================================================================
          3. BOTTOM TESTCASE & TEST RESULT CONSOLE
         ========================================================================= */}
      <div
        className="shrink-0 flex flex-col border-t border-[#1E2638] bg-[#0E131F] z-10 transition-all"
        style={{ height: consoleCollapsed ? "40px" : `${consoleHeight}px` }}
      >
        {/* Drag Resizer Bar */}
        <div
          onMouseDown={handleMouseDown}
          className="h-1.5 w-full cursor-ns-resize bg-transparent hover:bg-[#8B5CF6]/50 transition-colors shrink-0"
          title="Drag to resize console"
        />

        {/* Console Header */}
        <div className="h-10 px-4 border-b border-[#1E2638] bg-[#10141D] flex items-center justify-between shrink-0 select-none">
          <div className="flex items-center gap-5">
            <button
              type="button"
              onClick={() => {
                setActiveConsoleTab("testcase");
                setConsoleCollapsed(false);
              }}
              className={`pb-2 pt-1 text-xs font-bold transition-all relative ${
                activeConsoleTab === "testcase" && !consoleCollapsed
                  ? "text-white after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#8B5CF6]"
                  : "text-[#94A3B8] hover:text-white"
              }`}
            >
              Testcases
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveConsoleTab("result");
                setConsoleCollapsed(false);
              }}
              className={`pb-2 pt-1 text-xs font-bold transition-all relative flex items-center gap-1.5 ${
                activeConsoleTab === "result" && !consoleCollapsed
                  ? "text-white after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#8B5CF6]"
                  : "text-[#94A3B8] hover:text-white"
              }`}
            >
              <span>Test Result</span>
              {executionResult && (
                <span
                  className={`w-2 h-2 rounded-full ${
                    executionResult.status === "Accepted" ? "bg-emerald-400" : "bg-rose-400"
                  }`}
                />
              )}
            </button>
          </div>

          {/* Console Collapse / Expand Toggle */}
          <button
            type="button"
            onClick={() => setConsoleCollapsed((prev) => !prev)}
            className="p-1 text-[#94A3B8] hover:text-white rounded transition-colors"
            title={consoleCollapsed ? "Expand Console" : "Collapse Console"}
          >
            {consoleCollapsed ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {/* Console Content Area */}
        {!consoleCollapsed && (
          <div className="flex-1 overflow-y-auto p-4 space-y-4 font-mono text-xs bg-[#0E131F]">
            {/* Tab 1: Testcases */}
            {activeConsoleTab === "testcase" && (
              <div className="space-y-4">
                {/* Case Selection Pills */}
                <div className="flex items-center gap-2 flex-wrap">
                  {(problem.testCases || []).map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveTestCaseIdx(idx)}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        activeTestCaseIdx === idx
                          ? "bg-[#8B5CF6] text-white shadow-sm"
                          : "bg-[#161D2B] text-[#94A3B8] hover:text-white border border-[#1E2638]"
                      }`}
                    >
                      Case {idx + 1}
                    </button>
                  ))}
                </div>

                {/* Structured Input Cards */}
                <div className="space-y-3">
                  <span className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider font-sans">
                    Input Parameters
                  </span>

                  {parsedInputs.map((inputItem, i) => (
                    <div key={i} className="rounded-xl border border-[#1E2638] bg-[#141923] p-3 space-y-1.5">
                      <div className="flex items-center justify-between text-[11px] text-[#94A3B8]">
                        <span className="font-sans">{inputItem.name}</span>
                        <button
                          type="button"
                          onClick={() => handleCopyText(inputItem.value, `input_${i}`)}
                          className="text-[#94A3B8] hover:text-white transition-colors"
                          title="Copy input value"
                        >
                          {copiedKey === `input_${i}` ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                      <div className="text-[#E2E8F0] font-mono text-xs select-text">{inputItem.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 2: Test Result */}
            {activeConsoleTab === "result" && (
              <div>
                {!executionResult ? (
                  <div className="py-8 flex flex-col items-center justify-center text-center text-[#94A3B8] space-y-2 font-sans select-none">
                    <div className="w-10 h-10 rounded-xl bg-[#161D2B] border border-[#1E2638] flex items-center justify-center text-[#64748B]">
                      <Terminal className="w-5 h-5" />
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-xs font-medium text-[#E2E8F0]">Run your code to see results here</p>
                      <p className="text-[11px] text-[#64748B]">Click 'Run' for sample testcases or 'Submit' for final evaluation</p>
                    </div>
                  </div>
                ) : executionResult.status === "Need Solution" ? (
                  <div className="p-4 rounded-xl border border-[#8B5CF6]/30 bg-[#8B5CF6]/10 text-[#C4B5FD] space-y-1 font-sans">
                    <p className="text-xs font-bold flex items-center gap-1.5 text-white">
                      <ShieldCheck className="w-4 h-4 text-[#A78BFA] shrink-0" />
                      <span>{executionResult.message || "Write your solution before running the test cases."}</span>
                    </p>
                    <p className="text-[11px] text-[#94A3B8]">
                      Implement your solution in the editor above, then click Run or Submit.
                    </p>
                  </div>
                ) : executionResult.status === "Compilation Error" ? (
                  <div className="p-4 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-400 space-y-2">
                    <p className="text-xs font-bold flex items-center gap-1.5 font-sans text-rose-300">
                      <XCircle className="w-4 h-4 shrink-0 text-rose-400" />
                      <span>Compilation / Syntax Error</span>
                    </p>
                    <pre className="p-2.5 rounded-lg bg-[#141923] border border-rose-500/20 text-rose-300 font-mono text-[11px] whitespace-pre-wrap overflow-x-auto select-text">
                      {executionResult.message || executionResult.consoleOutput || "Syntax error detected in solution."}
                    </pre>
                  </div>
                ) : executionResult.status === "Runtime Error" ? (
                  <div className="p-4 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-400 space-y-2">
                    <p className="text-xs font-bold flex items-center gap-1.5 font-sans text-rose-300">
                      <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
                      <span>Runtime Error</span>
                    </p>
                    <pre className="p-2.5 rounded-lg bg-[#141923] border border-rose-500/20 text-rose-300 font-mono text-[11px] whitespace-pre-wrap overflow-x-auto select-text">
                      {executionResult.message || executionResult.consoleOutput || "Runtime exception occurred."}
                    </pre>
                  </div>
                ) : (
                  <div className="space-y-3 font-sans">
                    {/* Header Result Summary */}
                    <div className="flex items-center justify-between flex-wrap gap-2.5 pb-2.5 border-b border-[#1E2638]">
                      <div className="flex items-center gap-2.5">
                        {executionResult.status === "Accepted" ? (
                          <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-sm">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Accepted</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-rose-400 font-bold text-sm">
                            <XCircle className="w-4 h-4" />
                            <span>{executionResult.status}</span>
                          </div>
                        )}
                        <span className="text-xs text-[#94A3B8]">
                          ({executionResult.passedCount}/{executionResult.totalCount} test cases passed)
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-xs font-mono text-[#94A3B8]">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-[#A78BFA]" />
                          <span>{executionResult.runtime} ms</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <HardDrive className="w-3.5 h-3.5 text-[#A78BFA]" />
                          <span>{executionResult.memory} MB</span>
                        </div>
                      </div>
                    </div>

                    {/* Detailed Testcase Results */}
                    <div className="space-y-2.5">
                      {executionResult.testCaseResults?.map((res, i) => (
                        <div
                          key={i}
                          className={`p-3 rounded-xl border space-y-2 ${
                            res.passed
                              ? "border-emerald-500/30 bg-emerald-500/5"
                              : "border-rose-500/30 bg-rose-500/5"
                          }`}
                        >
                          <div className="flex items-center justify-between text-xs font-bold">
                            <span className="text-[#E2E8F0]">
                              {res.isHidden ? `Hidden Benchmark Case ${i + 1}` : `Case ${i + 1}`}
                            </span>
                            <span className={res.passed ? "text-emerald-400" : "text-rose-400"}>
                              {res.passed ? "✓ Passed" : "✕ Wrong Answer"}
                            </span>
                          </div>

                          {!res.isHidden && (
                            <div className="space-y-2 text-[11px] font-mono select-text">
                              <div>
                                <span className="text-[10px] text-[#94A3B8] uppercase font-bold tracking-wider font-sans">
                                  Input:
                                </span>
                                <pre className="p-2 rounded-lg bg-[#141923] border border-[#1E2638] text-[#E2E8F0] overflow-x-auto whitespace-pre-wrap">
                                  {res.input}
                                </pre>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                <div>
                                  <span className="text-[10px] text-[#94A3B8] uppercase font-bold tracking-wider font-sans">
                                    Expected Output:
                                  </span>
                                  <pre className="p-2 rounded-lg bg-[#141923] border border-[#1E2638] text-emerald-400 overflow-x-auto font-bold whitespace-pre-wrap">
                                    {res.expected}
                                  </pre>
                                </div>
                                <div>
                                  <span className="text-[10px] text-[#94A3B8] uppercase font-bold tracking-wider font-sans">
                                    Your Output:
                                  </span>
                                  <pre
                                    className={`p-2 rounded-lg bg-[#141923] border border-[#1E2638] overflow-x-auto whitespace-pre-wrap ${
                                      res.passed ? "text-emerald-400" : "text-rose-400 font-bold"
                                    }`}
                                  >
                                    {res.actual}
                                  </pre>
                                </div>
                              </div>

                              {!res.passed && res.reason && (
                                <div>
                                  <span className="text-[10px] text-[#94A3B8] uppercase font-bold tracking-wider font-sans">
                                    Reason:
                                  </span>
                                  <p className="text-rose-400 font-medium text-[11px] pt-0.5 font-sans">
                                    {res.reason}
                                  </p>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
