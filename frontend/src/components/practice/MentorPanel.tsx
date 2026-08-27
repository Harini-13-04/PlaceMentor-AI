import { useState } from "react";
import { Problem } from "@/data/problems";
import {
  Lightbulb,
  CheckCircle2,
  Clock,
  HardDrive,
  AlertCircle,
  X,
  Sparkles,
  ChevronDown,
  ChevronRight,
  RotateCcw,
} from "lucide-react";

interface MentorPanelProps {
  problem: Problem;
  onClose: () => void;
  lastRunFailed?: boolean;
  failureMessage?: string;
}

export default function MentorPanel({
  problem,
  onClose,
  lastRunFailed = false,
  failureMessage,
}: MentorPanelProps) {
  const [unlockedHints, setUnlockedHints] = useState<number>(1);
  const [approachOpen, setApproachOpen] = useState(false);
  const [complexityOpen, setComplexityOpen] = useState(false);

  const unlockNextHint = () => {
    if (unlockedHints < problem.hints.length) {
      setUnlockedHints((prev) => prev + 1);
    }
  };

  const resetHints = () => {
    setUnlockedHints(1);
  };

  return (
    <div className="h-full flex flex-col bg-card border-l border-border text-foreground font-sans select-none">
      {/* Header */}
      <div className="h-12 px-4 border-b border-border flex items-center justify-between shrink-0 bg-secondary/30">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-600 dark:text-teal-400">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-foreground">Prep Guide</h2>
            <p className="text-[10px] text-muted-foreground">Contextual interview guidance</p>
          </div>
        </div>

        <button
          onClick={onClose}
          aria-label="Close Prep Guide"
          className="p-1 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Content Body with 14-15px Typography & 22-24px Line-Height */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-[14px] sm:text-[15px] leading-relaxed">
        {/* Test Failure Diagnostic Guidance (if failed) */}
        {lastRunFailed && (
          <div className="p-3.5 rounded-xl border border-rose-500/30 bg-rose-500/10 space-y-2 animate-fade-in">
            <div className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400 text-xs font-bold uppercase tracking-wider">
              <AlertCircle className="w-4 h-4" />
              <span>Test Failure Guidance</span>
            </div>
            <p className="text-[14px] text-foreground leading-normal">
              {failureMessage || "Check edge cases like empty arrays, single-element inputs, or integer overflow limits."}
            </p>
          </div>
        )}

        {/* Progressive Hints Section */}
        <div className="p-4 rounded-xl border border-border bg-card space-y-3.5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-foreground uppercase tracking-wider">
              <Lightbulb className="w-4 h-4 text-amber-500" />
              <span>Progressive Hints</span>
            </div>
            <span className="text-xs font-mono text-muted-foreground">
              {unlockedHints} of {problem.hints.length}
            </span>
          </div>

          <div className="space-y-2.5">
            {problem.hints.slice(0, unlockedHints).map((hint, idx) => (
              <div
                key={idx}
                className="p-3 rounded-lg border border-border bg-secondary/50 space-y-1.5 animate-fade-in"
              >
                <div className="flex items-center justify-between text-xs font-semibold text-teal-600 dark:text-teal-400">
                  <span>Hint {idx + 1}</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-500" />
                </div>
                <p className="text-[14px] sm:text-[15px] text-foreground leading-relaxed">{hint}</p>
              </div>
            ))}
          </div>

          <div className="pt-1">
            {unlockedHints < problem.hints.length ? (
              <button
                onClick={unlockNextHint}
                className="w-full py-2 px-3 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Lightbulb className="w-3.5 h-3.5" /> Unlock Hint {unlockedHints + 1}
              </button>
            ) : (
              <button
                onClick={resetHints}
                className="w-full py-1.5 px-3 rounded-lg border border-border bg-secondary hover:bg-secondary/80 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset Hints
              </button>
            )}
          </div>
        </div>

        {/* Optimal Approach Section */}
        <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
          <button
            onClick={() => setApproachOpen(!approachOpen)}
            className="w-full px-4 py-3 flex items-center justify-between text-xs font-bold text-foreground hover:bg-secondary/50 transition-colors uppercase tracking-wider"
          >
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-teal-600 dark:text-teal-400" /> Optimal Approach
            </span>
            {approachOpen ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
          </button>

          {approachOpen && (
            <div className="p-4 pt-1 border-t border-border/50 space-y-2.5 text-[14px] sm:text-[15px]">
              <ol className="space-y-2 list-decimal list-inside text-muted-foreground leading-relaxed">
                {problem.optimalApproach.map((step, idx) => (
                  <li key={idx}>
                    <span className="text-foreground">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>

        {/* Time & Space Complexity */}
        <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
          <button
            onClick={() => setComplexityOpen(!complexityOpen)}
            className="w-full px-4 py-3 flex items-center justify-between text-xs font-bold text-foreground hover:bg-secondary/50 transition-colors uppercase tracking-wider"
          >
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-blue-500" /> Complexity Analysis
            </span>
            {complexityOpen ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
          </button>

          {complexityOpen && (
            <div className="p-4 pt-1 border-t border-border/50 space-y-3 text-[14px] sm:text-[15px]">
              <div className="p-3 rounded-lg border border-border bg-secondary/40 space-y-1">
                <div className="flex items-center gap-1 text-xs font-semibold text-foreground uppercase">
                  <Clock className="w-3.5 h-3.5 text-teal-500" /> Time Complexity
                </div>
                <p className="text-[14px] text-muted-foreground font-mono">{problem.timeComplexity}</p>
              </div>

              <div className="p-3 rounded-lg border border-border bg-secondary/40 space-y-1">
                <div className="flex items-center gap-1 text-xs font-semibold text-foreground uppercase">
                  <HardDrive className="w-3.5 h-3.5 text-blue-500" /> Space Complexity
                </div>
                <p className="text-[14px] text-muted-foreground font-mono">{problem.spaceComplexity}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
