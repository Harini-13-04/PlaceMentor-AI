import React, { useState } from "react";
import { Sparkles, Lightbulb, Compass, Clock, HelpCircle, ChevronDown, ChevronUp, AlertCircle, CheckCircle2, ChevronRight, X } from "lucide-react";
import { Problem } from "@/data/problems";

interface PrepGuideProps {
  problem: Problem;
  lastRunResult?: {
    passed: boolean;
    runtime: number;
    failedCaseIndex?: number;
    userOutput?: string;
    expectedOutput?: string;
  } | null;
  onClose?: () => void;
}

export const MentorPanel: React.FC<PrepGuideProps> = ({ problem, lastRunResult, onClose }) => {
  const [hintLevel, setHintLevel] = useState<number>(0);
  const [showApproach, setShowApproach] = useState<boolean>(false);
  const [showComplexity, setShowComplexity] = useState<boolean>(false);
  const [showFailureAnalysis, setShowFailureAnalysis] = useState<boolean>(false);

  const handleNextHint = () => {
    if (hintLevel < problem.hints.length) {
      setHintLevel((prev) => prev + 1);
    }
  };

  const handleResetGuidance = () => {
    setHintLevel(0);
    setShowApproach(false);
    setShowComplexity(false);
    setShowFailureAnalysis(false);
  };

  return (
    <div className="flex flex-col h-full bg-card text-foreground border-l border-border overflow-hidden font-sans select-text">
      {/* Header */}
      <div className="h-10 px-3.5 border-b border-border bg-card flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-teal-500/15 text-teal-600 dark:text-teal-400 flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-bold text-foreground tracking-wide uppercase">Prep Guide</span>
        </div>

        <div className="flex items-center gap-1">
          {(hintLevel > 0 || showApproach || showComplexity || showFailureAnalysis) && (
            <button
              onClick={handleResetGuidance}
              className="text-[11px] text-muted-foreground hover:text-foreground px-2 py-0.5 rounded hover:bg-secondary transition-colors"
            >
              Reset
            </button>
          )}

          {onClose && (
            <button
              onClick={onClose}
              title="Close Prep Guide"
              className="p-1 text-muted-foreground hover:text-foreground rounded hover:bg-secondary transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main Guidance Scroll Area */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-3 text-xs">
        {/* Intro Banner */}
        <div className="p-3 rounded-lg bg-teal-500/[0.08] border border-teal-500/25 text-teal-800 dark:text-teal-200 leading-relaxed text-[11px]">
          <span className="font-semibold text-teal-700 dark:text-teal-300">Contextual Guidance:</span> Stuck? Use progressive hints to explore the optimal pattern independently before viewing the full approach.
        </div>

        {/* Test Run Diagnostic Alert if failed */}
        {lastRunResult && !lastRunResult.passed && (
          <div className="p-3 rounded-lg bg-amber-500/[0.1] border border-amber-500/30 text-amber-900 dark:text-amber-200 space-y-1.5 animate-fade-in">
            <div className="flex items-center gap-1.5 font-bold text-amber-700 dark:text-amber-300 text-xs">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>Test Failure Diagnostic</span>
            </div>
            <p className="text-[11px] text-amber-800 dark:text-amber-200/90 leading-normal">
              Test Case {(lastRunResult.failedCaseIndex ?? 0) + 1} did not match. Check edge conditions, index boundaries, or off-by-one errors.
            </p>
            <button
              onClick={() => setShowFailureAnalysis(!showFailureAnalysis)}
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 dark:text-amber-400 hover:underline pt-0.5"
            >
              {showFailureAnalysis ? "Hide diagnostic tip" : "View diagnostic tips"}
              {showFailureAnalysis ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
            {showFailureAnalysis && (
              <div className="p-2.5 rounded bg-card border border-border text-[11px] mt-1 space-y-1 text-foreground font-mono">
                <p>• Verify loop termination boundaries (e.g. `n` vs `n-1`).</p>
                <p>• Check if your state map resets between executions.</p>
                <p>• Test with empty array, duplicate elements, or negative numbers.</p>
              </div>
            )}
          </div>
        )}

        {/* Progressive Hints Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
            <span>Progressive Hints</span>
            <span className="font-mono">{hintLevel} / {problem.hints.length}</span>
          </div>

          {problem.hints.map((hint, idx) => {
            const isUnlocked = idx < hintLevel;
            return (
              <div
                key={idx}
                className={`p-2.5 rounded-lg border transition-all duration-200 ${
                  isUnlocked
                    ? "bg-secondary/70 border-border text-foreground"
                    : "bg-card border-dashed border-border/70 text-muted-foreground/60"
                }`}
              >
                <div className="flex items-center justify-between text-xs font-semibold mb-1">
                  <span className="flex items-center gap-1.5">
                    {isUnlocked ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    ) : (
                      <HelpCircle className="w-3.5 h-3.5 text-muted-foreground" />
                    )}
                    Hint {idx + 1}
                  </span>
                  {!isUnlocked && idx === hintLevel && (
                    <span className="text-[10px] text-teal-600 dark:text-teal-400 font-bold uppercase">Next</span>
                  )}
                </div>
                {isUnlocked ? (
                  <p className="text-xs text-foreground leading-relaxed mt-1">{hint}</p>
                ) : (
                  <p className="text-[11px] italic text-muted-foreground/50">Click below to unlock nudge...</p>
                )}
              </div>
            );
          })}

          {hintLevel < problem.hints.length && (
            <button
              onClick={handleNextHint}
              className="w-full py-1.5 px-3 rounded-md bg-teal-500/15 hover:bg-teal-500/25 text-teal-700 dark:text-teal-300 border border-teal-500/40 text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
            >
              <Lightbulb className="w-3.5 h-3.5 text-teal-500" />
              {hintLevel === 0 ? "Unlock Hint 1" : `Unlock Hint ${hintLevel + 1}`}
            </button>
          )}
        </div>

        {/* Optimal Approach Collapsible */}
        <div className="border border-border rounded-lg overflow-hidden bg-card">
          <button
            onClick={() => setShowApproach(!showApproach)}
            className="w-full p-2.5 flex items-center justify-between text-xs font-semibold text-foreground hover:bg-secondary transition-colors"
          >
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-teal-500" />
              <span>Optimal Approach</span>
            </div>
            {showApproach ? <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" /> : <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />}
          </button>

          {showApproach && (
            <div className="p-3 border-t border-border bg-secondary/30 space-y-2 text-xs text-foreground">
              <p className="font-bold text-teal-700 dark:text-teal-300">{problem.approach.summary}</p>
              <ol className="list-decimal pl-4 space-y-1.5 text-muted-foreground text-[12px]">
                {problem.approach.steps.map((step, sIdx) => (
                  <li key={sIdx} className="leading-relaxed">
                    <span className="text-foreground">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>

        {/* Complexity Analysis Collapsible */}
        <div className="border border-border rounded-lg overflow-hidden bg-card">
          <button
            onClick={() => setShowComplexity(!showComplexity)}
            className="w-full p-2.5 flex items-center justify-between text-xs font-semibold text-foreground hover:bg-secondary transition-colors"
          >
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-teal-500" />
              <span>Time & Space Complexity</span>
            </div>
            {showComplexity ? <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" /> : <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />}
          </button>

          {showComplexity && (
            <div className="p-3 border-t border-border bg-secondary/30 space-y-2 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2 rounded bg-card border border-border">
                  <div className="text-[10px] text-muted-foreground uppercase font-bold">Time</div>
                  <div className="font-mono text-xs font-bold text-teal-600 dark:text-teal-400">{problem.complexity.time}</div>
                </div>
                <div className="p-2 rounded bg-card border border-border">
                  <div className="text-[10px] text-muted-foreground uppercase font-bold">Space</div>
                  <div className="font-mono text-xs font-bold text-teal-600 dark:text-teal-400">{problem.complexity.space}</div>
                </div>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed pt-1">
                {problem.complexity.analysis}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
