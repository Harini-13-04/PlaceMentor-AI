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
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={`Current streak: ${streak.currentStreak} days`}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 hover:border-orange-500/40 hover:bg-orange-500/15 transition-all duration-200"
      >
        <Flame className="w-4 h-4 text-orange-500" />
        <span className="text-sm font-semibold text-white">
          {streak.currentStreak}
        </span>
      </button>

      {/* z-[999] ensures the popover floats above every card/section/modal */}
      <div
        className={`absolute right-0 mt-2 w-72 z-[999] transition-all duration-200 origin-top-right ${
          open
            ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
            : "opacity-0 scale-95 -translate-y-1 pointer-events-none"
        }`}
      >
        <div className="rounded-2xl p-5 backdrop-blur-2xl bg-white/[0.06] shadow-[0_8px_50px_rgba(249,115,22,0.22),0_0_50px_rgba(139,92,246,0.12),0_0_0_1px_rgba(255,255,255,0.06)]">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center shrink-0">
              <Flame className="w-6 h-6 text-orange-500" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Current Streak</p>
              <div className="flex items-baseline gap-1">
                <p className="text-2xl font-display font-bold text-white">
                  {streak.currentStreak}
                </p>
                <span className="text-sm text-muted-foreground">days</span>
              </div>
            </div>
          </div>

          <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide mb-2">
            Weekly Activity
          </p>
          <div className="flex justify-between gap-1.5 mb-4">
            {streak.weekActivity.map((active, i) => (
              <div key={i} className="flex flex-col items-center gap-1.5">
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                    active
                      ? "bg-orange-500/20 text-orange-500"
                      : "bg-white/5 text-muted-foreground/40"
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

          <div className="space-y-1.5 pt-3 border-t border-white/[0.06]">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Best streak</span>
              <span className="text-xs font-medium text-white">
                {streak.bestStreak} days
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              {daysToMilestone > 0
                ? `${daysToMilestone} more day${daysToMilestone === 1 ? "" : "s"} to your ${streak.milestone}-day milestone.`
                : `You've reached the ${streak.milestone}-day milestone!`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
export default StreakIndicator;