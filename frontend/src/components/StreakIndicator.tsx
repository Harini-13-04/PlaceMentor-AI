import { useState, useRef, useEffect } from "react";
import { Flame } from "lucide-react";

type Streak = {
  currentStreak: number;
  weekActivity: boolean[];
  milestone: number;
  bestStreak: number;
  lastActiveDate: string;
};

const DAY_LABELS = ["M", "T", "W", "T", "F", "S", "S"];

function StreakIndicator({ streak }: { streak: Streak }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const daysToMilestone = streak.milestone - streak.currentStreak;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative font-sans" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={`Current streak: ${streak.currentStreak} days`}
        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-card border border-border hover:bg-secondary transition-colors"
      >
        <Flame className="w-4 h-4 text-amber-500 fill-amber-500/20" />
        <span className="text-xs font-semibold text-foreground font-mono">
          {streak.currentStreak}
        </span>
      </button>

      {/* Popover */}
      {open && (
        <div className="absolute right-0 mt-2 w-72 rounded-xl border border-border bg-card shadow-lg p-4 z-50 animate-fade-in text-foreground">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
              <Flame className="w-5 h-5 text-amber-500 fill-amber-500/20" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Placement Practice Streak</p>
              <div className="flex items-baseline gap-1">
                <p className="text-xl font-bold text-foreground font-mono">
                  {streak.currentStreak}
                </p>
                <span className="text-xs text-muted-foreground">days</span>
              </div>
            </div>
          </div>

          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">
            Weekly Activity
          </p>
          <div className="flex justify-between gap-1 mb-3">
            {streak.weekActivity.map((active, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <div
                  className={`w-7 h-7 rounded-md flex items-center justify-center text-xs transition-colors border ${
                    active
                      ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30"
                      : "bg-secondary text-muted-foreground border-border"
                  }`}
                >
                  <Flame className="w-3.5 h-3.5" />
                </div>
                <span className="text-[10px] text-muted-foreground">
                  {DAY_LABELS[i]}
                </span>
              </div>
            ))}
          </div>

          <div className="space-y-1 pt-2.5 border-t border-border text-xs">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Best streak</span>
              <span className="font-semibold text-foreground font-mono">
                {streak.bestStreak} days
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground">
              {daysToMilestone > 0
                ? `${daysToMilestone} more day${daysToMilestone === 1 ? "" : "s"} to your ${streak.milestone}-day milestone.`
                : `You've reached the ${streak.milestone}-day milestone!`}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default StreakIndicator;