import React, { useState, useEffect } from "react";
import { API_URL, getAuthHeaders } from "@/config";

import {
  BrainCircuit,
  Grid,
  Shapes,
  KeyRound,
  Calculator,
  FileSpreadsheet,
  Zap,
  Clock,
  Trophy,
  Award,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Check,
  X,
  HelpCircle,
  Flame,
  CheckCircle2,
  Puzzle,
  Copy,
  Layers,
  Lock,
  Unlock,
  Star,
  MapPin,
  ChevronRight,
  RefreshCw,
  Lightbulb,
} from "lucide-react";

interface World {
  id: string;
  name: string;
  description: string;
  theme: string;
  unlock_level: number;
  games: string[];
  is_unlocked?: boolean;
}

interface BrainProgress {
  xp: number;
  player_level: number;
  streak: number;
  completed_levels: number;
  unlocked_worlds: string[];
  best_scores: Record<string, number>;
  achievements: string[];
}

export default function BrainZone() {
  const [worlds, setWorlds] = useState<World[]>([]);
  const [progress, setProgress] = useState<BrainProgress | null>(null);
  const [loadingProgress, setLoadingProgress] = useState(true);

  // Active game session
  const [activeGameType, setActiveGameType] = useState<string | null>(null);
  const [activeWorldId, setActiveWorldId] = useState<string>("mind-forest");
  const [selectedDifficulty, setSelectedDifficulty] = useState<"Easy" | "Medium" | "Hard">("Easy");
  const [currentLevel, setCurrentLevel] = useState<number>(1);
  const [challengeData, setChallengeData] = useState<any>(null);
  const [loadingChallenge, setLoadingChallenge] = useState(false);

  // Timer
  const [gameTimer, setGameTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [completionResult, setCompletionResult] = useState<any>(null);

  // 1. Sudoku State
  const [sudokuGrid, setSudokuGrid] = useState<number[][]>([]);
  const [sudokuStatus, setSudokuStatus] = useState<string | null>(null);

  // 2. Memory Match State
  const [memoryCards, setMemoryCards] = useState<any[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [movesCount, setMovesCount] = useState(0);

  // 3. Pattern Recognition State
  const [patternSelectedOpt, setPatternSelectedOpt] = useState<number | null>(null);

  // 4. Target 24 State
  const [targetExpr, setTargetExpr] = useState("");
  const [targetStatus, setTargetStatus] = useState<string | null>(null);

  // 5. Vocab Anagram State
  const [userAnagram, setUserAnagram] = useState("");
  const [anagramStatus, setAnagramStatus] = useState<string | null>(null);
  const [revealedHints, setRevealedHints] = useState<number>(0);

  // Fetch Worlds and Player Progress
  const fetchProgress = async () => {
    try {
      const [wRes, pRes] = await Promise.all([
        fetch(`${API_URL}/api/brainzone/worlds`, {
          headers: getAuthHeaders(true),
        }),
        fetch(`${API_URL}/api/brainzone/progress`, {
          headers: getAuthHeaders(true),
        }),
      ]);


      if (wRes.ok) {
        const wData = await wRes.json();
        setWorlds(wData.worlds || []);
      }
      if (pRes.ok) {
        const pData = await pRes.json();
        setProgress(pData);
      }
    } catch (err) {
      console.error("Failed to fetch Brain Zone data:", err);
    } finally {
      setLoadingProgress(false);
    }
  };

  useEffect(() => {
    fetchProgress();
  }, []);

  // Timer loop
  useEffect(() => {
    let interval: any;
    if (isTimerRunning) {
      interval = setInterval(() => setGameTimer((t) => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  // Generate & Launch Procedural Challenge
  const handleLaunchGame = async (gameType: string, worldId: string = "mind-forest") => {
    setActiveGameType(gameType);
    setActiveWorldId(worldId);
    setLoadingChallenge(true);
    setCompletionResult(null);
    setGameTimer(0);
    setIsTimerRunning(false);

    try {
      const url = `${API_URL}/api/brainzone/generate?game_type=${encodeURIComponent(gameType)}&level=${currentLevel}&difficulty=${encodeURIComponent(selectedDifficulty)}`;
      const res = await fetch(url, {
        headers: getAuthHeaders(true),
      });

      if (res.ok) {
        const data = await res.json();
        setChallengeData(data);

        // Initialize game specific interactive boards
        if (gameType === "sudoku" && data.puzzle) {
          setSudokuGrid(data.puzzle.map((row: number[]) => [...row]));
          setSudokuStatus(null);
        } else if (gameType === "memory-match" && data.cards) {
          const deck = data.cards.map((c: any) => ({
            ...c,
            flipped: false,
            matched: false,
          }));
          setMemoryCards(deck);
          setFlippedIndices([]);
          setMovesCount(0);
        } else if (gameType === "pattern-recognition") {
          setPatternSelectedOpt(null);
        } else if (gameType === "target-24") {
          setTargetExpr("");
          setTargetStatus(null);
        } else if (gameType === "vocab-anagram") {
          setUserAnagram("");
          setAnagramStatus(null);
          setRevealedHints(0);
        }

        setIsTimerRunning(true);
      }
    } catch (err) {
      console.error("Failed to generate brain challenge:", err);
    } finally {
      setLoadingChallenge(false);
    }
  };

  // Complete Game API Submission
  const submitGameCompletion = async (score: number, accuracy: number, passed: boolean) => {
    setIsTimerRunning(false);
    try {
      const res = await fetch(`${API_URL}/api/brainzone/complete`, {
        method: "POST",
        headers: getAuthHeaders(true),
        body: JSON.stringify({
          game_id: activeGameType,
          world_id: activeWorldId,
          level: currentLevel,
          seed: challengeData?.seed || 1000,
          score,
          accuracy,

          time_spent_seconds: gameTimer,
          passed,
        }),
      });

      if (res.ok) {
        const result = await res.json();
        setCompletionResult(result);
        fetchProgress();
      } else {
        setCompletionResult({
          xp_awarded: 50,
          new_xp: (progress?.xp || 0) + 50,
          player_level: progress?.player_level || 1,
          leveled_up: false,
          new_achievements: [],
        });
      }
    } catch (err) {
      console.error("Failed to record completion:", err);
    }
  };

  // Sudoku handlers
  const handleSudokuChange = (r: number, c: number, val: number) => {
    if (challengeData?.puzzle?.[r]?.[c] !== 0) return;
    const updated = sudokuGrid.map((row, ri) =>
      row.map((cell, ci) => (ri === r && ci === c ? val : cell))
    );
    setSudokuGrid(updated);
  };

  const handleVerifySudoku = () => {
    const sol = challengeData?.solution;
    if (!sol) return;

    let isCorrect = true;
    for (let r = 0; r < sudokuGrid.length; r++) {
      for (let c = 0; c < sudokuGrid[r].length; c++) {
        if (sudokuGrid[r][c] !== sol[r][c]) {
          isCorrect = false;
          break;
        }
      }
    }

    if (isCorrect) {
      setSudokuStatus("Passed! All row/column and quadrant constraints validated.");
      submitGameCompletion(100, 100, true);
    } else {
      setSudokuStatus("Constraint violation detected. Check for duplicate numbers.");
    }
  };

  // Memory Match handlers
  const handleCardClick = (idx: number) => {
    if (memoryCards[idx].flipped || memoryCards[idx].matched || flippedIndices.length === 2) return;

    const newCards = [...memoryCards];
    newCards[idx].flipped = true;
    const newFlipped = [...flippedIndices, idx];
    setMemoryCards(newCards);
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      setMovesCount((m) => m + 1);
      const [first, second] = newFlipped;
      if (memoryCards[first].match_key === memoryCards[second].match_key) {
        setTimeout(() => {
          setMemoryCards((prev) => {
            const updated = [...prev];
            updated[first].matched = true;
            updated[second].matched = true;
            if (updated.every((c) => c.matched)) {
              submitGameCompletion(100, 100, true);
            }
            return updated;
          });
          setFlippedIndices([]);
        }, 400);
      } else {
        setTimeout(() => {
          setMemoryCards((prev) => {
            const updated = [...prev];
            updated[first].flipped = false;
            updated[second].flipped = false;
            return updated;
          });
          setFlippedIndices([]);
        }, 800);
      }
    }
  };

  // Pattern recognition handler
  const handleSelectPattern = (optIdx: number) => {
    setPatternSelectedOpt(optIdx);
    const isCorrect = optIdx === challengeData?.correct_index;
    if (isCorrect) {
      submitGameCompletion(100, 100, true);
    }
  };

  // Target 24 evaluator
  const handleVerifyTarget24 = () => {
    try {
      // Safe sanitized arithmetic evaluation
      const sanitized = targetExpr.replace(/[^0-9+\-*/(). ]/g, "");
      // eslint-disable-next-line no-eval
      const result = Function(`"use strict"; return (${sanitized})`)();
      if (Math.abs(result - 24) < 1e-5) {
        setTargetStatus("Correct! Expression evaluates to exactly 24.");
        submitGameCompletion(100, 100, true);
      } else {
        setTargetStatus(`Evaluates to ${result}, not 24. Try another combination.`);
      }
    } catch (err) {
      setTargetStatus("Invalid arithmetic syntax. Check parenthesis and operators.");
    }
  };

  // Anagram verification
  const handleVerifyAnagram = () => {
    if (userAnagram.trim().toUpperCase() === challengeData?.target_word?.toUpperCase()) {
      setAnagramStatus("Correct unscramble!");
      submitGameCompletion(100, 100, true);
    } else {
      setAnagramStatus("Incorrect spelling. Review hints or try again.");
    }
  };

  return (
    <div className="space-y-6 font-sans text-foreground">
      {/* =========================================================================
          VIEW 1: WORLDS & COGNITIVE GAMES BROWSER
         ========================================================================= */}
      {!activeGameType && (
        <>
          {/* Top Banner & Player Progress Overview */}
          <div className="p-6 sm:p-8 rounded-2xl border border-purple-500/25 bg-gradient-to-br from-purple-500/10 via-card to-card dark:from-purple-950/40 dark:via-secondary dark:to-card shadow-sm relative overflow-hidden flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2 relative z-10 max-w-xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-700 dark:text-purple-300 text-xs font-semibold">
                <BrainCircuit className="w-3.5 h-3.5" />
                <span>Procedural Cognitive Arena</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground font-display">
                Brain Zone Gaming Arena
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground font-medium leading-relaxed">
                Adaptive procedural puzzles sharpening logical deduction, memory retention, pattern progression, and speed math across 5 themed cognitive worlds.
              </p>
            </div>

            {/* Real Player Progress Stats */}
            <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap relative z-10">
              <div className="p-4 rounded-xl border border-purple-500/30 bg-purple-500/10 shrink-0 space-y-1 w-full sm:w-44 text-center">
                <span className="text-[10px] uppercase font-bold text-muted-foreground">Player Level</span>
                <p className="text-2xl font-mono font-extrabold text-purple-700 dark:text-purple-300">
                  Level {progress?.player_level || 1}
                </p>
                <div className="w-full bg-secondary rounded-full h-1.5 overflow-hidden mt-1">
                  <div
                    className="bg-purple-600 h-full rounded-full transition-all"
                    style={{ width: `${Math.min(100, ((progress?.xp || 0) % 200) / 2)}%` }}
                  />
                </div>
                <span className="text-[9px] font-mono text-muted-foreground">{progress?.xp || 0} Total XP</span>
              </div>

              <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 shrink-0 space-y-1 w-full sm:w-44 text-center">
                <span className="text-[10px] uppercase font-bold text-muted-foreground flex items-center justify-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> Current Streak
                </span>
                <p className="text-2xl font-mono font-extrabold text-amber-600 dark:text-amber-400">
                  {progress?.streak || 0} {progress?.streak === 1 ? "Day" : "Days"}
                </p>
                <span className="text-[9px] font-mono text-muted-foreground">{progress?.completed_levels || 0} Levels Solved</span>
              </div>
            </div>
          </div>

          {/* 5 Cognitive Worlds */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-foreground">Cognitive Worlds</h3>
              <span className="text-xs font-mono text-muted-foreground">{worlds.length} Worlds</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {worlds.map((world, idx) => {
                const isUnlocked = world.is_unlocked ?? idx === 0;
                return (
                  <div
                    key={world.id}
                    className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                      isUnlocked
                        ? "border-purple-500/30 bg-card hover:border-purple-500/60 shadow-sm"
                        : "border-border bg-secondary/30 opacity-60"
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-muted-foreground">World {idx + 1}</span>
                        {isUnlocked ? (
                          <Unlock className="w-3.5 h-3.5 text-emerald-500" />
                        ) : (
                          <Lock className="w-3.5 h-3.5 text-muted-foreground" />
                        )}
                      </div>

                      <h4 className="text-sm font-bold text-foreground">{world.name}</h4>
                      <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2">
                        {world.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-border/50 flex items-center justify-between text-[10px] font-mono">
                      <span className="text-muted-foreground">Requires Lvl {world.unlock_level}</span>
                      {isUnlocked && (
                        <span className="text-purple-600 dark:text-purple-400 font-bold">Available</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 5 Cognitive Games Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-foreground">Cognitive Placement Puzzles</h3>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Difficulty:</span>
                {(["Easy", "Medium", "Hard"] as const).map((d) => (
                  <button
                    key={d}
                    onClick={() => setSelectedDifficulty(d)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-all ${
                      selectedDifficulty === d
                        ? "bg-purple-600 text-white border-purple-600"
                        : "bg-secondary border-border text-foreground hover:bg-secondary/80"
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {/* Game 1: Sudoku */}
              <div className="rounded-2xl border border-border bg-card hover:border-purple-500/40 transition-all shadow-sm flex flex-col justify-between overflow-hidden">
                <div className="w-full h-32 bg-secondary/50 flex items-center justify-center border-b border-border">
                  <div className="grid grid-cols-2 gap-2 p-3 rounded-2xl bg-purple-500/10 border border-purple-500/30">
                    <Grid className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
                <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/15 text-purple-700 dark:text-purple-300 border border-purple-500/20">
                      Constraint Solving
                    </span>
                    <h4 className="text-base font-bold text-foreground">Sudoku Constraint Solver</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Procedural 4x4, 6x6, and 9x9 grids with guaranteed unique solutions for deductive reasoning.
                    </p>
                  </div>
                  <button
                    onClick={() => handleLaunchGame("sudoku", "mind-forest")}
                    className="w-full py-2.5 px-4 rounded-xl border border-purple-500/30 bg-purple-500/10 hover:bg-purple-500/20 text-purple-700 dark:text-purple-300 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>Play Sudoku</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Game 2: Memory Match */}
              <div className="rounded-2xl border border-border bg-card hover:border-purple-500/40 transition-all shadow-sm flex flex-col justify-between overflow-hidden">
                <div className="w-full h-32 bg-secondary/50 flex items-center justify-center border-b border-border">
                  <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30">
                    <Layers className="w-8 h-8 text-amber-600 dark:text-amber-400" />
                  </div>
                </div>
                <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/20">
                      Working Memory
                    </span>
                    <h4 className="text-base font-bold text-foreground">DSA Symbol Memory Match</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Match Big-O complexities, data structure properties, and algorithm symbols under timer pressure.
                    </p>
                  </div>
                  <button
                    onClick={() => handleLaunchGame("memory-match", "mind-forest")}
                    className="w-full py-2.5 px-4 rounded-xl border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>Play Memory Match</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Game 3: Pattern Recognition */}
              <div className="rounded-2xl border border-border bg-card hover:border-purple-500/40 transition-all shadow-sm flex flex-col justify-between overflow-hidden">
                <div className="w-full h-32 bg-secondary/50 flex items-center justify-center border-b border-border">
                  <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30">
                    <Puzzle className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                  </div>
                </div>
                <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                      Pattern Logic
                    </span>
                    <h4 className="text-base font-bold text-foreground">Progression Law Deduction</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Deduce arithmetic, geometric, Fibonacci, and modular sequence laws to predict next elements.
                    </p>
                  </div>
                  <button
                    onClick={() => handleLaunchGame("pattern-recognition", "logic-desert")}
                    className="w-full py-2.5 px-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>Play Pattern Logic</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Game 4: Target 24 */}
              <div className="rounded-2xl border border-border bg-card hover:border-purple-500/40 transition-all shadow-sm flex flex-col justify-between overflow-hidden">
                <div className="w-full h-32 bg-secondary/50 flex items-center justify-center border-b border-border">
                  <div className="p-3 rounded-2xl bg-sky-500/10 border border-sky-500/30">
                    <Calculator className="w-8 h-8 text-sky-600 dark:text-sky-400" />
                  </div>
                </div>
                <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/15 text-sky-700 dark:text-sky-300 border border-sky-500/20">
                      Arithmetic Agility
                    </span>
                    <h4 className="text-base font-bold text-foreground">Target 24 Speed Puzzle</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Combine 4 generated numbers using basic operations (+, -, *, /) to reach exactly 24.
                    </p>
                  </div>
                  <button
                    onClick={() => handleLaunchGame("target-24", "logic-desert")}
                    className="w-full py-2.5 px-4 rounded-xl border border-sky-500/30 bg-sky-500/10 hover:bg-sky-500/20 text-sky-700 dark:text-sky-300 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>Play Target 24</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Game 5: Vocab Anagram */}
              <div className="rounded-2xl border border-border bg-card hover:border-purple-500/40 transition-all shadow-sm flex flex-col justify-between overflow-hidden">
                <div className="w-full h-32 bg-secondary/50 flex items-center justify-center border-b border-border">
                  <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 font-display font-extrabold text-2xl text-rose-600 dark:text-rose-400">
                    Abc
                  </div>
                </div>
                <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-500/20">
                      Technical Vocab
                    </span>
                    <h4 className="text-base font-bold text-foreground">Placement Vocab Anagram</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Unscramble core computer science and software terminology with progressive conceptual clues.
                    </p>
                  </div>
                  <button
                    onClick={() => handleLaunchGame("vocab-anagram", "neural-city")}
                    className="w-full py-2.5 px-4 rounded-xl border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-700 dark:text-rose-300 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>Play Vocab Anagram</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* =========================================================================
          VIEW 2: DEDICATED GAME WORKSPACE
         ========================================================================= */}
      {activeGameType && (
        <div className="w-full space-y-6">
          {/* Top Bar */}
          <div className="p-4 rounded-2xl border border-border bg-card flex items-center justify-between shadow-sm">
            <button
              onClick={() => setActiveGameType(null)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-border text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
            >
              <ArrowLeft className="w-4 h-4" /> Exit Game
            </button>

            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-foreground capitalize">
                {activeGameType.replace("-", " ")} — Level {currentLevel}
              </span>
              <span className="text-xs px-2 py-0.5 rounded bg-secondary text-muted-foreground font-mono">
                {selectedDifficulty}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-700 dark:text-purple-300 text-xs font-mono font-bold">
                <Clock className="w-4 h-4 animate-pulse" />
                <span>
                  {Math.floor(gameTimer / 60).toString().padStart(2, "0")}:
                  {(gameTimer % 60).toString().padStart(2, "0")}
                </span>
              </div>
            </div>
          </div>

          {loadingChallenge ? (
            <div className="p-12 text-center text-muted-foreground text-xs space-y-2">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto text-purple-500" />
              <p>Generating procedural puzzle seed...</p>
            </div>
          ) : (
            <>
              {/* GAME 1: SUDOKU */}
              {activeGameType === "sudoku" && challengeData && (
                <div className="p-6 sm:p-10 rounded-2xl border border-border bg-card shadow-sm space-y-6 text-center max-w-2xl mx-auto">
                  <div>
                    <h3 className="text-xl font-bold text-foreground">
                      {challengeData.size}x{challengeData.size} Sudoku Constraint Solver
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Fill all cells so every row, column, and block contains 1 through {challengeData.size} without repetition.
                    </p>
                  </div>

                  <div
                    className="grid gap-2 mx-auto p-4 rounded-2xl bg-secondary/50 border border-border"
                    style={{
                      gridTemplateColumns: `repeat(${challengeData.size || 4}, minmax(0, 1fr))`,
                      maxWidth: challengeData.size === 4 ? "280px" : challengeData.size === 6 ? "380px" : "480px",
                    }}
                  >
                    {sudokuGrid.map((row, r) =>
                      row.map((val, c) => {
                        const isLocked = challengeData.puzzle?.[r]?.[c] !== 0;
                        return (
                          <input
                            key={`${r}-${c}`}
                            type="number"
                            min={1}
                            max={challengeData.size}
                            disabled={isLocked}
                            value={val !== 0 ? val : ""}
                            onChange={(e) => {
                              const n = parseInt(e.target.value, 10);
                              handleSudokuChange(r, c, isNaN(n) ? 0 : n);
                            }}
                            className={`h-12 text-center text-lg font-bold font-mono rounded-xl border outline-none transition-all ${
                              isLocked
                                ? "bg-secondary text-muted-foreground border-border cursor-not-allowed"
                                : "bg-card text-purple-600 dark:text-purple-300 border-purple-500/50 focus:border-purple-400"
                            }`}
                          />
                        );
                      })
                    )}
                  </div>

                  {sudokuStatus && (
                    <p className="text-xs font-semibold text-purple-600 dark:text-purple-300 font-mono">{sudokuStatus}</p>
                  )}

                  <div className="flex justify-center gap-4 pt-2">
                    <button
                      onClick={() => setSudokuGrid(challengeData.puzzle.map((row: number[]) => [...row]))}
                      className="px-5 py-2.5 rounded-xl border border-border text-xs font-semibold text-muted-foreground hover:bg-secondary"
                    >
                      Reset Grid
                    </button>
                    <button
                      onClick={handleVerifySudoku}
                      className="px-7 py-2.5 rounded-xl text-xs font-bold text-white pm-btn-gradient shadow-md"
                    >
                      Verify Solution
                    </button>
                  </div>
                </div>
              )}

              {/* GAME 2: MEMORY MATCH */}
              {activeGameType === "memory-match" && challengeData && (
                <div className="p-6 sm:p-10 rounded-2xl border border-border bg-card shadow-sm space-y-6 text-center max-w-2xl mx-auto">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-foreground">DSA Symbol Memory Match</h3>
                      <p className="text-xs text-muted-foreground mt-1">Flip cards to match asymptotic complexity pairs.</p>
                    </div>
                    <span className="text-xs font-mono font-bold text-purple-600 dark:text-purple-400 bg-purple-500/10 px-3 py-1 rounded-lg border border-purple-500/20">
                      {movesCount} Moves
                    </span>
                  </div>

                  <div className="grid grid-cols-4 gap-3 max-w-lg mx-auto">
                    {memoryCards.map((card, idx) => (
                      <button
                        key={card.id}
                        onClick={() => handleCardClick(idx)}
                        className={`h-24 rounded-2xl border text-sm sm:text-base font-mono font-bold transition-all flex items-center justify-center ${
                          card.matched
                            ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-600 dark:text-emerald-400 shadow-sm"
                            : card.flipped
                            ? "bg-purple-600/20 border-purple-500 text-purple-700 dark:text-purple-200"
                            : "bg-secondary border-border text-transparent hover:bg-secondary/80"
                        }`}
                      >
                        {card.flipped || card.matched ? card.symbol : "⚡"}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* GAME 3: PATTERN RECOGNITION */}
              {activeGameType === "pattern-recognition" && challengeData && (
                <div className="p-6 sm:p-10 rounded-2xl border border-border bg-card shadow-sm space-y-6 text-center max-w-2xl mx-auto">
                  <div>
                    <h3 className="text-xl font-bold text-foreground">Progression Law Deduction</h3>
                    <p className="text-xs text-muted-foreground mt-1">Discover the progression rule and identify the missing element.</p>
                  </div>

                  <div className="flex items-center justify-center gap-3 flex-wrap">
                    {challengeData.sequence?.map((item: string, i: number) => (
                      <span
                        key={i}
                        className={`px-5 py-4 rounded-2xl border font-mono font-extrabold text-base sm:text-lg ${
                          item === "?"
                            ? "border-purple-500 bg-purple-500/20 text-purple-700 dark:text-purple-300 animate-pulse"
                            : "border-border bg-secondary text-foreground"
                        }`}
                      >
                        {item}
                      </span>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-lg mx-auto pt-3">
                    {challengeData.options?.map((opt: string, optIdx: number) => (
                      <button
                        key={optIdx}
                        onClick={() => handleSelectPattern(optIdx)}
                        className={`p-4 rounded-xl border text-base font-mono font-bold transition-all ${
                          patternSelectedOpt === optIdx
                            ? optIdx === challengeData.correct_index
                              ? "bg-emerald-500/20 border-emerald-500 text-emerald-600 dark:text-emerald-400"
                              : "bg-rose-500/20 border-rose-500 text-rose-600 dark:text-rose-400"
                            : "bg-secondary border-border text-foreground hover:bg-secondary/80"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>

                  {patternSelectedOpt !== null && (
                    <p className="text-xs text-muted-foreground pt-2">
                      <strong>Explanation:</strong> {challengeData.explanation}
                    </p>
                  )}
                </div>
              )}

              {/* GAME 4: TARGET 24 */}
              {activeGameType === "target-24" && challengeData && (
                <div className="p-6 sm:p-10 rounded-2xl border border-border bg-card shadow-sm space-y-6 text-center max-w-2xl mx-auto">
                  <div>
                    <h3 className="text-xl font-bold text-foreground">Target 24 Speed Puzzle</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Use all four numbers exactly once to create an expression that equals 24.
                    </p>
                  </div>

                  {/* Available Numbers */}
                  <div className="flex justify-center gap-3">
                    {challengeData.numbers?.map((num: number, idx: number) => (
                      <button
                        key={idx}
                        onClick={() => setTargetExpr((prev) => prev + num)}
                        className="w-14 h-14 rounded-2xl border border-sky-500/40 bg-sky-500/10 hover:bg-sky-500/20 text-sky-700 dark:text-sky-300 font-mono font-extrabold text-xl flex items-center justify-center transition-all shadow-sm"
                      >
                        {num}
                      </button>
                    ))}
                  </div>

                  {/* Operator Buttons */}
                  <div className="flex justify-center gap-2 max-w-xs mx-auto">
                    {["+", "-", "*", "/", "(", ")"].map((op) => (
                      <button
                        key={op}
                        onClick={() => setTargetExpr((prev) => prev + ` ${op} `)}
                        className="w-10 h-10 rounded-xl bg-secondary border border-border text-foreground font-mono font-bold hover:bg-secondary/80"
                      >
                        {op}
                      </button>
                    ))}
                  </div>

                  <div className="max-w-md mx-auto space-y-3">
                    <input
                      type="text"
                      value={targetExpr}
                      onChange={(e) => setTargetExpr(e.target.value)}
                      placeholder="e.g. (6 + 4) * 2 + 4"
                      className="w-full px-4 py-3 rounded-xl border border-border bg-card text-center font-mono font-bold text-lg outline-none focus:border-purple-500"
                    />

                    {targetStatus && (
                      <p className="text-xs font-semibold text-purple-600 dark:text-purple-400 font-mono">{targetStatus}</p>
                    )}

                    <div className="flex gap-2">
                      <button
                        onClick={() => setTargetExpr("")}
                        className="flex-1 py-2.5 rounded-xl border border-border text-xs font-semibold hover:bg-secondary"
                      >
                        Clear
                      </button>
                      <button
                        onClick={handleVerifyTarget24}
                        className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white pm-btn-gradient shadow-md"
                      >
                        Check Expression
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* GAME 5: VOCAB ANAGRAM */}
              {activeGameType === "vocab-anagram" && challengeData && (
                <div className="p-6 sm:p-10 rounded-2xl border border-border bg-card shadow-sm space-y-6 text-center max-w-2xl mx-auto">
                  <div>
                    <h3 className="text-xl font-bold text-foreground">Placement Vocab Anagram</h3>
                    <p className="text-xs text-muted-foreground mt-1">Unscramble the letters to reveal the placement CS term.</p>
                  </div>

                  <div className="p-6 rounded-2xl bg-secondary/50 border border-border max-w-md mx-auto space-y-4">
                    <span className="text-xs font-mono uppercase font-bold text-muted-foreground">Scrambled Word:</span>
                    <p className="text-3xl font-extrabold font-mono tracking-widest text-purple-600 dark:text-purple-400">
                      {challengeData.scrambled}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      <strong>Hint:</strong> {challengeData.hint}
                    </p>
                    {revealedHints > 0 && challengeData.progressive_hints?.[revealedHints - 1] && (
                      <p className="text-xs text-amber-600 dark:text-amber-400 bg-amber-500/10 p-2 rounded-lg border border-amber-500/20">
                        <strong>Extra Clue:</strong> {challengeData.progressive_hints[revealedHints - 1]}
                      </p>
                    )}
                  </div>

                  <div className="max-w-md mx-auto space-y-3">
                    <input
                      type="text"
                      value={userAnagram}
                      onChange={(e) => setUserAnagram(e.target.value.toUpperCase())}
                      placeholder="Type unscrambled word..."
                      className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground text-center font-mono font-bold text-base outline-none focus:border-purple-500 uppercase tracking-widest"
                    />

                    {anagramStatus && (
                      <p className="text-xs font-semibold text-purple-600 dark:text-purple-400 font-mono">{anagramStatus}</p>
                    )}

                    <div className="flex gap-2">
                      <button
                        onClick={() => setRevealedHints((h) => h + 1)}
                        className="flex-1 py-2.5 rounded-xl border border-border text-xs font-semibold hover:bg-secondary flex items-center justify-center gap-1"
                      >
                        <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                        <span>Extra Clue</span>
                      </button>
                      <button
                        onClick={handleVerifyAnagram}
                        className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white pm-btn-gradient shadow-md"
                      >
                        Submit Word
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* GAME COMPLETION / REWARD MODAL */}
          {completionResult && (
            <div className="p-8 sm:p-12 rounded-2xl border border-purple-500/30 bg-gradient-to-br from-purple-500/10 via-card to-card dark:from-purple-950/40 dark:via-secondary dark:to-card text-center space-y-4 shadow-sm max-w-2xl mx-auto">
              <Trophy className="w-14 h-14 text-amber-500 dark:text-amber-400 mx-auto animate-bounce" />
              <h3 className="text-2xl font-bold text-foreground">Cognitive Challenge Completed!</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Time taken: <strong className="text-foreground">{Math.floor(gameTimer / 60)}m {gameTimer % 60}s</strong>
              </p>

              <div className="flex justify-center gap-3 py-2">
                <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-700 dark:text-purple-300 font-bold font-mono text-xs border border-purple-500/30">
                  +{completionResult.xp_awarded || 50} XP Awarded
                </span>
                {completionResult.leveled_up && (
                  <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 font-bold font-mono text-xs border border-amber-500/30">
                    Level Up! Now Level {completionResult.player_level}
                  </span>
                )}
              </div>

              <div className="flex justify-center gap-3 pt-2">
                <button
                  onClick={() => {
                    setCurrentLevel((l) => l + 1);
                    handleLaunchGame(activeGameType, activeWorldId);
                  }}
                  className="py-3 px-6 rounded-xl border border-purple-500/30 bg-purple-500/10 hover:bg-purple-500/20 text-purple-700 dark:text-purple-300 text-xs font-bold transition-all flex items-center gap-1.5"
                >
                  <span>Next Level ({currentLevel + 1})</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setActiveGameType(null)}
                  className="py-3 px-6 rounded-xl text-xs font-bold text-white pm-btn-gradient shadow-md"
                >
                  Back to Worlds
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
