import React, { useState, useRef, useEffect, useMemo } from "react";
import CodeMirror, { ReactCodeMirrorRef } from "@uiw/react-codemirror";
import { autocompletion, closeBrackets, closeBracketsKeymap, completionKeymap } from "@codemirror/autocomplete";
import { defaultKeymap, historyKeymap, history, indentWithTab } from "@codemirror/commands";
import { bracketMatching, foldGutter, foldKeymap, indentOnInput, HighlightStyle, syntaxHighlighting, indentUnit } from "@codemirror/language";
import { lineNumbers, highlightActiveLineGutter, highlightActiveLine, keymap, EditorView, drawSelection, dropCursor } from "@codemirror/view";
import { EditorState } from "@codemirror/state";
import { tags as t } from "@lezer/highlight";

import { Problem } from "@/data/problems";
import { useTheme } from "@/context/ThemeContext";
import {
  SupportedLanguage,
  getLanguageOptionsForProblem,
  getLanguageExtension,
  getIndentUnit,
} from "@/config/languages";
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
  Loader2,
  Lock,
  Sun,
  Moon,
} from "lucide-react";

export type { SupportedLanguage };

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
  isConsoleCollapsed?: boolean;
  setIsConsoleCollapsed?: (collapsed: boolean | ((prev: boolean) => boolean)) => void;
  isFullScreen?: boolean;
  onToggleFullScreen?: () => void;
}

/**
 * PlaceMentor AI CodeMirror Dark Theme
 */
const placeMentorDarkTheme = EditorView.theme(
  {
    "&": {
      color: "#E2E8F0",
      backgroundColor: "#141923",
      fontFamily: "'JetBrains Mono', 'Cascadia Code', 'Fira Code', Consolas, 'Courier New', monospace",
      fontSize: "14px",
      height: "100%",
    },
    ".cm-scroller": {
      overflow: "auto",
      fontFamily: "'JetBrains Mono', 'Cascadia Code', 'Fira Code', Consolas, 'Courier New', monospace",
      lineHeight: "1.55",
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
        fontFamily: "'JetBrains Mono', 'Cascadia Code', Consolas, monospace",
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
 * PlaceMentor AI CodeMirror Light Theme
 */
const placeMentorLightTheme = EditorView.theme(
  {
    "&": {
      color: "#1E293B",
      backgroundColor: "#F8FAFC",
      fontFamily: "'JetBrains Mono', 'Cascadia Code', 'Fira Code', Consolas, 'Courier New', monospace",
      fontSize: "14px",
      height: "100%",
    },
    ".cm-scroller": {
      overflow: "auto",
      fontFamily: "'JetBrains Mono', 'Cascadia Code', 'Fira Code', Consolas, 'Courier New', monospace",
      lineHeight: "1.55",
    },
    ".cm-content": {
      caretColor: "#7C3AED",
      padding: "14px 0",
    },
    "&.cm-focused .cm-cursor": {
      borderLeftColor: "#7C3AED",
      borderLeftWidth: "2px",
    },
    "&.cm-focused .cm-selectionBackground, ::selection": {
      backgroundColor: "#DDD6FE !important",
    },
    ".cm-gutters": {
      backgroundColor: "#F1F5F9",
      color: "#64748B",
      borderRight: "1px solid #CBD5E1",
      paddingRight: "12px",
      paddingLeft: "8px",
      userSelect: "none",
    },
    ".cm-activeLine": {
      backgroundColor: "#EDE9FE40",
    },
    ".cm-activeLineGutter": {
      backgroundColor: "#E2E8F0",
      color: "#334155",
      fontWeight: "bold",
    },
  },
  { dark: false }
);

/**
 * Syntax Highlighting Token Palette for PlaceMentor IDE (Dark)
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
 * Syntax Highlighting Token Palette for PlaceMentor IDE (Light)
 */
const placeMentorLightHighlightStyle = HighlightStyle.define([
  { tag: t.keyword, color: "#7C3AED", fontWeight: "bold" },
  { tag: [t.name, t.deleted, t.character, t.propertyName, t.macroName], color: "#1E40AF" },
  { tag: [t.function(t.variableName), t.labelName], color: "#2563EB" },
  { tag: [t.color, t.constant(t.name), t.standard(t.name)], color: "#059669" },
  { tag: [t.definition(t.name), t.separator], color: "#1E293B" },
  { tag: [t.typeName, t.className, t.changed, t.annotation, t.modifier, t.self, t.namespace], color: "#4F46E5" },
  { tag: [t.number], color: "#D97706" },
  { tag: [t.operator, t.operatorKeyword, t.url, t.escape, t.regexp, t.link, t.special(t.string)], color: "#475569" },
  { tag: [t.meta, t.comment], color: "#64748B", fontStyle: "italic" },
  { tag: t.strong, fontWeight: "bold" },
  { tag: t.emphasis, fontStyle: "italic" },
  { tag: [t.atom, t.bool, t.special(t.variableName)], color: "#DB2777" },
  { tag: [t.processingInstruction, t.string, t.inserted], color: "#059669" },
  { tag: t.invalid, color: "#DC2626" },
]);

/**
 * Computes exact position offset in text for the editable solution line inside function body
 */
function findEditablePosition(text: string): number {
  if (!text) return 0;
  const lines = text.split("\n");
  let offset = 0;

  // 1. Look for explicit comment markers
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
        const nextLineOffset = offset + line.length + 1;
        return nextLineOffset + nextLine.length;
      }
      return offset + line.length;
    }
    offset += line.length + 1;
  }

  // 2. Look for empty indented line inside a class / function body
  offset = 0;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (i > 0 && line.trim() === "" && line.length > 0) {
      const prevLine = lines[i - 1].trim();
      if (
        prevLine.includes("def ") ||
        prevLine.includes("{") ||
        prevLine.includes("function") ||
        prevLine.endsWith(":")
      ) {
        return offset + line.length;
      }
    }
    offset += line.length + 1;
  }

  return Math.min(text.length, 50);
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
  isConsoleCollapsed = false,
  setIsConsoleCollapsed,
  isFullScreen = false,
  onToggleFullScreen,
}: IDECodeEditorProps) {
  const { theme, toggleTheme } = useTheme();
  const [activeTestCaseIdx, setActiveTestCaseIdx] = useState(0);
  const [consoleHeight, setConsoleHeight] = useState(250);
  const [localCollapsed, setLocalCollapsed] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const isCollapsed = isConsoleCollapsed !== undefined ? isConsoleCollapsed : localCollapsed;
  const setConsoleCollapsed = (val: boolean | ((prev: boolean) => boolean)) => {
    if (setIsConsoleCollapsed) {
      setIsConsoleCollapsed(val);
    } else {
      setLocalCollapsed(val);
    }
  };

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

  // Filter available languages based on problem type using canonical single source of truth
  const isSqlProblem = problem.category === "Database & SQL" || problem.topic?.toLowerCase().includes("sql");
  const languageOptions = useMemo(() => {
    return getLanguageOptionsForProblem(isSqlProblem);
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

  // Indentation Rule per language (2 spaces for JS/TS/SQL, 4 spaces for Python/Java/C++/C/C#)
  const indentSpaces = getIndentUnit(selectedLanguage);

  // CodeMirror Extensions Bundle - Referentially stable across keystrokes
  const extensions = useMemo(() => {
    const isDark = theme !== "light";
    return [
      getLanguageExtension(selectedLanguage),
      indentUnit.of(" ".repeat(indentSpaces)),
      EditorState.tabSize.of(indentSpaces),
      isDark ? placeMentorDarkTheme : placeMentorLightTheme,
      syntaxHighlighting(isDark ? placeMentorDarkHighlightStyle : placeMentorLightHighlightStyle),
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
  }, [selectedLanguage, indentSpaces, theme]);

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

  const isLight = theme === "light";

  return (
    <div className={`h-full w-full flex flex-col ${isLight ? "bg-[#F8FAFC] text-slate-800" : "bg-[#141923] text-foreground"} overflow-hidden`}>
      {/* =========================================================================
          1. CODE EDITOR TOP HEADER (Language selector + Lock Auto on left, Theme & Fullscreen on right)
         ========================================================================= */}
      <div className={`h-11 px-3.5 border-b ${isLight ? "border-slate-200 bg-[#F1F5F9]" : "border-[#1E2638] bg-[#10141D]"} flex items-center justify-between shrink-0 select-none z-10`}>
        {/* Left: Language Selector + Lock Auto Indentation */}
        <div className="flex items-center gap-2">
          <div className="relative inline-block">
            <select
              value={selectedLanguage}
              onChange={(e) => onLanguageChange(e.target.value as SupportedLanguage)}
              aria-label="Programming Language"
              className={`appearance-none pl-3 pr-8 py-1.5 text-xs font-semibold rounded-lg border ${
                isLight
                  ? "border-slate-300 bg-white text-slate-800 hover:border-purple-500"
                  : "border-[#28354D] bg-[#141923] text-[#E2E8F0] hover:border-[#8B5CF6]/60"
              } focus:outline-none focus:border-[#8B5CF6] transition-colors cursor-pointer shadow-sm`}
            >
              {languageOptions.map((lang) => (
                <option key={lang.id} value={lang.id} className={isLight ? "bg-white text-slate-800 py-1" : "bg-[#141923] text-[#E2E8F0] py-1"}>
                  {lang.label}
                </option>
              ))}
            </select>
            <ChevronDown className={`w-3.5 h-3.5 ${isLight ? "text-slate-500" : "text-[#94A3B8]"} absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none`} />
          </div>

          {/* Lock Auto Indentation Indicator */}
          <div
            className={`flex items-center gap-1.5 px-2 py-1 rounded-md border ${
              isLight ? "bg-white border-slate-300 text-slate-600" : "bg-[#141923] border-[#28354D] text-[#94A3B8]"
            } select-none`}
            title="Automatic language-aware indentation and formatting enabled"
          >
            <Lock className={`w-3 h-3 ${isLight ? "text-slate-500" : "text-[#94A3B8]"}`} />
            <span className={`text-[11px] font-medium ${isLight ? "text-slate-700" : "text-[#CBD5E1]"}`}>Auto</span>
          </div>
        </div>

        {/* Right: Theme Toggle & Fullscreen Button */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={toggleTheme}
            title={isLight ? "Switch to Dark Mode" : "Switch to Light Mode"}
            className={`p-1.5 rounded-lg border border-transparent transition-all ${
              isLight
                ? "text-slate-600 hover:text-slate-900 hover:bg-slate-200 hover:border-slate-300"
                : "text-[#94A3B8] hover:text-white hover:bg-[#1E2638] hover:border-[#28354D]"
            }`}
            aria-label="Toggle theme"
          >
            {isLight ? (
              <Moon className="w-4 h-4 text-indigo-600" />
            ) : (
              <Sun className="w-4 h-4 text-amber-400" />
            )}
          </button>

          {onToggleFullScreen && (
            <button
              type="button"
              onClick={onToggleFullScreen}
              title={isFullScreen ? "Exit Fullscreen" : "Fullscreen Workspace"}
              className={`p-1.5 rounded-lg border border-transparent transition-all ${
                isLight
                  ? "text-slate-600 hover:text-slate-900 hover:bg-slate-200 hover:border-slate-300"
                  : "text-[#94A3B8] hover:text-white hover:bg-[#1E2638] hover:border-[#28354D]"
              }`}
            >
              {isFullScreen ? (
                <Minimize2 className="w-4 h-4 text-[#8B5CF6]" />
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
      <div className={`flex-1 min-h-0 relative overflow-hidden ${isLight ? "bg-[#F8FAFC]" : "bg-[#141923]"}`}>
        <CodeMirror
          ref={cmRef}
          value={code}
          height="100%"
          theme={isLight ? "light" : "dark"}
          extensions={extensions}
          onChange={onCodeChange}
          basicSetup={false}
          className="h-full text-[14px] font-mono select-text"
        />
      </div>

      {/* =========================================================================
          3. BOTTOM TESTCASE & TEST RESULT CONSOLE
         ========================================================================= */}
      <div
        className={`shrink-0 flex flex-col border-t ${isLight ? "border-slate-200 bg-white" : "border-[#1E2638] bg-[#0E131F]"} z-10 transition-all`}
        style={{ height: isCollapsed ? "40px" : `${consoleHeight}px` }}
      >
        {/* Drag Resizer Bar */}
        <div
          onMouseDown={handleMouseDown}
          className="h-1.5 w-full cursor-ns-resize bg-transparent hover:bg-[#8B5CF6]/50 transition-colors shrink-0"
          title="Drag to resize console"
        />

        {/* Console Header */}
        <div className={`h-10 px-4 border-b ${isLight ? "border-slate-200 bg-[#F1F5F9]" : "border-[#1E2638] bg-[#10141D]"} flex items-center justify-between shrink-0 select-none`}>
          <div className="flex items-center gap-5">
            <button
              type="button"
              onClick={() => {
                setActiveConsoleTab("testcase");
                setConsoleCollapsed(false);
              }}
              className={`pb-2 pt-1 text-xs font-bold transition-all relative ${
                activeConsoleTab === "testcase" && !isCollapsed
                  ? isLight
                    ? "text-slate-900 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#7C3AED]"
                    : "text-white after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#8B5CF6]"
                  : isLight
                  ? "text-slate-500 hover:text-slate-900"
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
                activeConsoleTab === "result" && !isCollapsed
                  ? isLight
                    ? "text-slate-900 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#7C3AED]"
                    : "text-white after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#8B5CF6]"
                  : isLight
                  ? "text-slate-500 hover:text-slate-900"
                  : "text-[#94A3B8] hover:text-white"
              }`}
            >
              <span>Test Result</span>
              {isRunning || isSubmitting ? (
                <Loader2 className="w-3 h-3 animate-spin text-[#8B5CF6]" />
              ) : executionResult ? (
                <span
                  className={`w-2 h-2 rounded-full ${
                    executionResult.status === "Accepted" ? "bg-emerald-500" : "bg-rose-500"
                  }`}
                />
              ) : null}
            </button>
          </div>

          {/* Console Collapse / Expand Toggle */}
          <button
            type="button"
            onClick={() => setConsoleCollapsed((prev) => !prev)}
            className={`p-1 rounded transition-colors ${isLight ? "text-slate-500 hover:text-slate-900" : "text-[#94A3B8] hover:text-white"}`}
            title={isCollapsed ? "Expand Console" : "Collapse Console"}
          >
            {isCollapsed ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {/* Console Content Area */}
        {!isCollapsed && (
          <div className={`flex-1 overflow-y-auto p-4 space-y-4 font-mono text-xs ${isLight ? "bg-white" : "bg-[#0E131F]"}`}>
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
                          ? isLight
                            ? "bg-[#7C3AED] text-white shadow-sm"
                            : "bg-[#8B5CF6] text-white shadow-sm"
                          : isLight
                          ? "bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200"
                          : "bg-[#161D2B] text-[#94A3B8] hover:text-white border border-[#1E2638]"
                      }`}
                    >
                      Case {idx + 1}
                    </button>
                  ))}
                </div>

                {/* Structured Input Cards */}
                <div className="space-y-3">
                  <span className={`text-[11px] font-bold uppercase tracking-wider font-sans ${isLight ? "text-slate-500" : "text-[#94A3B8]"}`}>
                    Input Parameters
                  </span>

                  {parsedInputs.map((inputItem, i) => (
                    <div key={i} className={`rounded-xl border ${isLight ? "border-slate-200 bg-slate-50" : "border-[#1E2638] bg-[#141923]"} p-3 space-y-1.5`}>
                      <div className={`flex items-center justify-between text-[11px] ${isLight ? "text-slate-500" : "text-[#94A3B8]"}`}>
                        <span className="font-sans">{inputItem.name}</span>
                        <button
                          type="button"
                          onClick={() => handleCopyText(inputItem.value, `input_${i}`)}
                          className={`${isLight ? "text-slate-500 hover:text-slate-900" : "text-[#94A3B8] hover:text-white"} transition-colors`}
                          title="Copy input value"
                        >
                          {copiedKey === `input_${i}` ? (
                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                      <div className={`${isLight ? "text-slate-800" : "text-[#E2E8F0]"} font-mono text-xs select-text`}>{inputItem.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 2: Test Result */}
            {activeConsoleTab === "result" && (
              <div>
                {isRunning ? (
                  <div className="py-8 flex flex-col items-center justify-center text-center space-y-3 font-sans select-none">
                    <div className="w-10 h-10 rounded-xl bg-[#8B5CF6]/15 border border-[#8B5CF6]/30 flex items-center justify-center text-[#8B5CF6]">
                      <Loader2 className="w-5 h-5 animate-spin text-[#8B5CF6]" />
                    </div>
                    <div className="space-y-1">
                      <p className={`text-xs font-bold flex items-center justify-center gap-2 ${isLight ? "text-slate-900" : "text-white"}`}>
                        <span>Running test cases...</span>
                      </p>
                      <p className={`text-[11px] ${isLight ? "text-slate-500" : "text-[#94A3B8]"}`}>Executing solution against sample test cases</p>
                    </div>
                  </div>
                ) : isSubmitting ? (
                  <div className="py-8 flex flex-col items-center justify-center text-center space-y-3 font-sans select-none">
                    <div className="w-10 h-10 rounded-xl bg-[#8B5CF6]/15 border border-[#8B5CF6]/30 flex items-center justify-center text-[#8B5CF6]">
                      <Loader2 className="w-5 h-5 animate-spin text-[#8B5CF6]" />
                    </div>
                    <div className="space-y-1">
                      <p className={`text-xs font-bold flex items-center justify-center gap-2 ${isLight ? "text-slate-900" : "text-white"}`}>
                        <span>Submitting solution...</span>
                      </p>
                      <p className={`text-[11px] ${isLight ? "text-slate-500" : "text-[#94A3B8]"}`}>Validating code against all test cases and benchmarks</p>
                    </div>
                  </div>
                ) : !executionResult ? (
                  <div className={`py-8 flex flex-col items-center justify-center text-center ${isLight ? "text-slate-500" : "text-[#94A3B8]"} space-y-2 font-sans select-none`}>
                    <div className={`w-10 h-10 rounded-xl ${isLight ? "bg-slate-100 border-slate-200 text-slate-500" : "bg-[#161D2B] border-[#1E2638] text-[#64748B]"} flex items-center justify-center`}>
                      <Terminal className="w-5 h-5" />
                    </div>
                    <div className="space-y-0.5">
                      <p className={`text-xs font-medium ${isLight ? "text-slate-700" : "text-[#E2E8F0]"}`}>Run your code to see results here</p>
                      <p className={`text-[11px] ${isLight ? "text-slate-400" : "text-[#64748B]"}`}>Click 'Run' for sample testcases or 'Submit' for final evaluation</p>
                    </div>
                  </div>
                ) : executionResult.status === "Need Solution" ? (
                  <div className={`p-4 rounded-xl border ${isLight ? "border-purple-200 bg-purple-50 text-purple-900" : "border-[#8B5CF6]/30 bg-[#8B5CF6]/10 text-[#C4B5FD]"} space-y-1 font-sans`}>
                    <p className={`text-xs font-bold flex items-center gap-1.5 ${isLight ? "text-purple-950" : "text-white"}`}>
                      <ShieldCheck className={`w-4 h-4 ${isLight ? "text-purple-600" : "text-[#A78BFA]"} shrink-0`} />
                      <span>{executionResult.message || "Write your solution before running the test cases."}</span>
                    </p>
                    <p className={`text-[11px] ${isLight ? "text-purple-700" : "text-[#94A3B8]"}`}>
                      Implement your solution in the editor above, then click Run or Submit.
                    </p>
                  </div>
                ) : executionResult.status === "Compilation Error" ? (
                  <div className="p-4 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-500 space-y-2">
                    <p className="text-xs font-bold flex items-center gap-1.5 font-sans text-rose-600 dark:text-rose-300">
                      <XCircle className="w-4 h-4 shrink-0 text-rose-500" />
                      <span>Compilation / Syntax Error</span>
                    </p>
                    <pre className={`p-2.5 rounded-lg ${isLight ? "bg-white border-rose-200 text-rose-700" : "bg-[#141923] border-rose-500/20 text-rose-300"} font-mono text-[11px] whitespace-pre-wrap overflow-x-auto select-text`}>
                      {executionResult.message || executionResult.consoleOutput || "Syntax error detected in solution."}
                    </pre>
                  </div>
                ) : executionResult.status === "Runtime Error" ? (
                  <div className="p-4 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-500 space-y-2">
                    <p className="text-xs font-bold flex items-center gap-1.5 font-sans text-rose-600 dark:text-rose-300">
                      <AlertTriangle className="w-4 h-4 shrink-0 text-rose-500" />
                      <span>Runtime Error</span>
                    </p>
                    <pre className={`p-2.5 rounded-lg ${isLight ? "bg-white border-rose-200 text-rose-700" : "bg-[#141923] border-rose-500/20 text-rose-300"} font-mono text-[11px] whitespace-pre-wrap overflow-x-auto select-text`}>
                      {executionResult.message || executionResult.consoleOutput || "Runtime exception occurred."}
                    </pre>
                  </div>
                ) : (
                  <div className="space-y-3 font-sans">
                    {/* Header Result Summary */}
                    <div className={`flex items-center justify-between flex-wrap gap-2.5 pb-2.5 border-b ${isLight ? "border-slate-200" : "border-[#1E2638]"}`}>
                      <div className="flex items-center gap-2.5">
                        {executionResult.status === "Accepted" ? (
                          <div className="flex items-center gap-1.5 text-emerald-500 font-bold text-sm">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Accepted</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-rose-500 font-bold text-sm">
                            <XCircle className="w-4 h-4" />
                            <span>{executionResult.status}</span>
                          </div>
                        )}
                        <span className={`text-xs ${isLight ? "text-slate-500" : "text-[#94A3B8]"}`}>
                          ({executionResult.passedCount}/{executionResult.totalCount} test cases passed)
                        </span>
                      </div>

                      <div className={`flex items-center gap-3 text-xs font-mono ${isLight ? "text-slate-500" : "text-[#94A3B8]"}`}>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-[#8B5CF6]" />
                          <span>{executionResult.runtime} ms</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <HardDrive className="w-3.5 h-3.5 text-[#8B5CF6]" />
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
                              ? isLight ? "border-emerald-200 bg-emerald-50/60" : "border-emerald-500/30 bg-emerald-500/5"
                              : isLight ? "border-rose-200 bg-rose-50/60" : "border-rose-500/30 bg-rose-500/5"
                          }`}
                        >
                          <div className="flex items-center justify-between text-xs font-bold">
                            <span className={isLight ? "text-slate-800" : "text-[#E2E8F0]"}>
                              {res.isHidden ? `Hidden Benchmark Case ${i + 1}` : `Case ${i + 1}`}
                            </span>
                            <span className={res.passed ? "text-emerald-500" : "text-rose-500"}>
                              {res.passed ? "✓ Passed" : "✕ Wrong Answer"}
                            </span>
                          </div>

                          {!res.isHidden && (
                            <div className="space-y-2 text-[11px] font-mono select-text">
                              <div>
                                <span className={`text-[10px] uppercase font-bold tracking-wider font-sans ${isLight ? "text-slate-500" : "text-[#94A3B8]"}`}>
                                  Input:
                                </span>
                                <pre className={`p-2 rounded-lg ${isLight ? "bg-white border-slate-200 text-slate-800" : "bg-[#141923] border-[#1E2638] text-[#E2E8F0]"} overflow-x-auto whitespace-pre-wrap`}>
                                  {res.input}
                                </pre>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                <div>
                                  <span className={`text-[10px] uppercase font-bold tracking-wider font-sans ${isLight ? "text-slate-500" : "text-[#94A3B8]"}`}>
                                    Expected Output:
                                  </span>
                                  <pre className={`p-2 rounded-lg ${isLight ? "bg-white border-slate-200 text-emerald-600 font-bold" : "bg-[#141923] border-[#1E2638] text-emerald-400 font-bold"} overflow-x-auto whitespace-pre-wrap`}>
                                    {res.expected}
                                  </pre>
                                </div>
                                <div>
                                  <span className={`text-[10px] uppercase font-bold tracking-wider font-sans ${isLight ? "text-slate-500" : "text-[#94A3B8]"}`}>
                                    Your Output:
                                  </span>
                                  <pre
                                    className={`p-2 rounded-lg overflow-x-auto whitespace-pre-wrap font-bold ${
                                      isLight
                                        ? `bg-white border-slate-200 ${res.passed ? "text-emerald-600" : "text-rose-600"}`
                                        : `bg-[#141923] border-[#1E2638] ${res.passed ? "text-emerald-400" : "text-rose-400"}`
                                    }`}
                                  >
                                    {res.actual}
                                  </pre>
                                </div>
                              </div>

                              {!res.passed && res.reason && (
                                <div>
                                  <span className={`text-[10px] uppercase font-bold tracking-wider font-sans ${isLight ? "text-slate-500" : "text-[#94A3B8]"}`}>
                                    Reason:
                                  </span>
                                  <p className="text-rose-500 font-medium text-[11px] pt-0.5 font-sans">
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
