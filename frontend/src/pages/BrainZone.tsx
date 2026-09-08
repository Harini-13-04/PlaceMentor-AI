import React, { useState, useEffect, useRef } from "react";
import { API_URL, getAuthHeaders } from "@/config";
import { toast } from "sonner";

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
  Coins,
  Gem,
  Key,
  Compass,
  Map as MapIcon,
  Crown,
  Trees,
  Sun,
  ShieldAlert,
} from "lucide-react";

interface World {
  id: string;
  name: string;
  tagline?: string;
  description: string;
  theme?: string;
  bg_gradient?: string;
  color?: string;
  unlock_level: number;
  treasure_name?: string;
  treasure_icon?: string;
  games?: string[];
  is_unlocked?: boolean;
}

interface BrainProgress {
  xp: number;
  player_level: number;
  streak?: number;
  completed_levels_count?: number;
  completed_levels?: number;
  unlocked_worlds: string[];
  coins?: number;
  gems?: number;
  keys?: number;
  map_pieces?: number;
  world_progress?: Record<string, number>;
  collected_treasures?: string[];
  best_scores?: Record<string, number>;
  achievements?: string[];
}

const WORLD_METADATA: Record<string, any> = {
  "mind-forest": {
    id: "mind-forest",
    name: "Mind Forest",
    tagline: "Lush cognitive groves of pattern deduction & memory awakening",
    description: "Explore dense canopy trails where ancient memory runes and pattern clues reveal hidden forest relics.",
    icon: Trees,
    color: "from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-400",
    bg_gradient: "from-emerald-950/40 via-secondary to-card",
    unlock_level: 1,
    treasure_name: "Emerald Forest Relic",
    treasure_icon: "🌿",
    theme: "Forest",
  },
  "logic-desert": {
    id: "logic-desert",
    name: "Logic Desert",
    tagline: "Arid dunes of numeric elimination & precision arithmetic",
    description: "Navigate shifting sands and unravel numeric hieroglyphs to unearth the legendary Desert Crystal.",
    icon: Sun,
    color: "from-amber-500/20 to-orange-500/10 border-amber-500/30 text-amber-400",
    bg_gradient: "from-amber-950/40 via-secondary to-card",
    unlock_level: 2,
    treasure_name: "Desert Crystal",
    treasure_icon: "💎",
    theme: "Desert",
  },
  "neural-city": {
    id: "neural-city",
    name: "Neural City",
    tagline: "High-speed cybernetic grid of working memory & symbol recognition",
    description: "Race through glowing neon avenues solving fast-fire anagrams and symbol nodes to acquire the Neural Core.",
    icon: Zap,
    color: "from-blue-500/20 to-cyan-500/10 border-blue-500/30 text-blue-400",
    bg_gradient: "from-blue-950/40 via-secondary to-card",
    unlock_level: 3,
    treasure_name: "Neural Core",
    treasure_icon: "🔮",
    theme: "Cyberpunk",
  },
  "focus-volcano": {
    id: "focus-volcano",
    name: "Focus Volcano",
    tagline: "Intense thermal chambers testing mental endurance under rapid time constraints",
    description: "Brave volcanic chambers under countdown pressure to forge and claim the molten Volcano Heart.",
    icon: Flame,
    color: "from-rose-500/20 to-red-500/10 border-rose-500/30 text-rose-400",
    bg_gradient: "from-rose-950/40 via-secondary to-card",
    unlock_level: 4,
    treasure_name: "Volcano Heart",
    treasure_icon: "🔥",
    theme: "Volcanic",
  },
  "brain-castle": {
    id: "brain-castle",
    name: "Brain Castle",
    tagline: "The pinnacle citadel of complex algorithmic reasoning & multi-step deduction",
    description: "Ascend the royal citadel chambers solving multi-step algorithmic puzzles to claim the ultimate Brain Crown.",
    icon: Crown,
    color: "from-purple-500/20 to-indigo-500/10 border-purple-500/30 text-purple-400",
    bg_gradient: "from-purple-950/40 via-secondary to-card",
    unlock_level: 5,
    treasure_name: "Brain Crown",
    treasure_icon: "👑",
    theme: "Citadel",
  },
};

const WORLD_ORDER = ["mind-forest", "logic-desert", "neural-city", "focus-volcano", "brain-castle"];

export function isWorldUnlocked(worldId: string, worldProgress?: Record<string, number>): boolean {
  const index = WORLD_ORDER.indexOf(worldId);
  if (index <= 0) return true; // World 1 (Mind Forest) is always unlocked

  const prevWorldId = WORLD_ORDER[index - 1];
  const prevWorldCompletedLevels = worldProgress?.[prevWorldId] || 0;
  return prevWorldCompletedLevels >= 20;
}

const GAME_TYPES = ["memory-match", "sudoku", "vocab-anagram", "pattern-recognition", "target-24"];

function getGameForLevel(worldId: string, level: number) {
  const worldOffsets: Record<string, number> = {
    "mind-forest": 0,
    "logic-desert": 1,
    "neural-city": 2,
    "focus-volcano": 3,
    "brain-castle": 4,
  };
  const offset = worldOffsets[worldId] || 0;
  const gameType = GAME_TYPES[(level - 1 + offset) % GAME_TYPES.length];

  const infoMap: Record<string, { title: string; category: string; icon: any }> = {
    "memory-match": { title: "Symbol Memory Match", category: "Working Memory", icon: Shapes },
    "sudoku": { title: "Sudoku Constraint Solver", category: "Deductive Logic", icon: Grid },
    "vocab-anagram": { title: "Placement Vocab Anagram", category: "Verbal Agility", icon: FileSpreadsheet },
    "pattern-recognition": { title: "Progression Law Deduction", category: "Inductive Reasoning", icon: KeyRound },
    "target-24": { title: "Target 24 Speed Puzzle", category: "Mental Arithmetic", icon: Calculator },
  };

  return {
    type: gameType,
    ...(infoMap[gameType] || { title: "Cognitive Puzzle", category: "Logic", icon: Puzzle }),
  };
}


function getBrainProgressStorageKey() {
  try {
    const token = localStorage.getItem("token") || "guest";
    return `placementor_brain_progress_${token.slice(-16)}`;
  } catch (e) {
    return "placementor_brain_progress_guest";
  }
}

function loadLocalProgress(): BrainProgress | null {
  try {
    const raw = localStorage.getItem(getBrainProgressStorageKey());
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

function saveLocalProgress(prog: BrainProgress) {
  try {
    localStorage.setItem(getBrainProgressStorageKey(), JSON.stringify(prog));
  } catch (e) {
    console.error("Failed to save local brain progress:", e);
  }
}

function mergeProgress(server?: BrainProgress | null, local?: BrainProgress | null): BrainProgress {
  if (!server && !local) {
    return {
      xp: 0,
      player_level: 1,
      streak: 1,
      completed_levels_count: 0,
      unlocked_worlds: ["mind-forest"],
      coins: 0,
      gems: 0,
      keys: 0,
      map_pieces: 0,
      world_progress: {
        "mind-forest": 0,
        "logic-desert": 0,
        "neural-city": 0,
        "focus-volcano": 0,
        "brain-castle": 0,
      },
      collected_treasures: [],
    };
  }
  if (!server) return local!;
  if (!local) return server;

  const mergedWorldProg: Record<string, number> = {
    ...(server.world_progress || {}),
  };

  if (local.world_progress) {
    for (const [wId, lvl] of Object.entries(local.world_progress)) {
      mergedWorldProg[wId] = Math.max(mergedWorldProg[wId] || 0, lvl || 0);
    }
  }

  const mergedTreasures = Array.from(
    new Set([...(server.collected_treasures || []), ...(local.collected_treasures || [])])
  );

  const unlockedWorlds = ["mind-forest"];
  if ((mergedWorldProg["mind-forest"] || 0) >= 20) unlockedWorlds.push("logic-desert");
  if ((mergedWorldProg["logic-desert"] || 0) >= 20) unlockedWorlds.push("neural-city");
  if ((mergedWorldProg["neural-city"] || 0) >= 20) unlockedWorlds.push("focus-volcano");
  if ((mergedWorldProg["focus-volcano"] || 0) >= 20) unlockedWorlds.push("brain-castle");

  return {
    ...server,
    xp: Math.max(server.xp || 0, local.xp || 0),
    player_level: Math.max(server.player_level || 1, local.player_level || 1),
    coins: Math.max(server.coins || 0, local.coins || 0),
    gems: Math.max(server.gems || 0, local.gems || 0),
    keys: Math.max(server.keys || 0, local.keys || 0),
    map_pieces: Math.max(server.map_pieces || 0, local.map_pieces || 0),
    world_progress: mergedWorldProg,
    collected_treasures: mergedTreasures,
    unlocked_worlds: unlockedWorlds,
    completed_levels_count: Math.max(
      server.completed_levels_count || 0,
      local.completed_levels_count || 0
    ),
  };
}

export default function BrainZone() {
  const [worlds, setWorlds] = useState<World[]>([]);
  const [progress, setProgress] = useState<BrainProgress | null>(null);
  const [loadingProgress, setLoadingProgress] = useState(true);

  // Navigation View Modes: "map" | "world-detail" | "game"
  const [viewMode, setViewMode] = useState<"map" | "world-detail" | "game">("map");
  const [selectedWorldId, setSelectedWorldId] = useState<string>("mind-forest");

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
  const [selectedSudokuCell, setSelectedSudokuCell] = useState<[number, number] | null>([0, 0]);
  const sudokuInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

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
    // Check local storage immediately for fast UI rendering
    const localProg = loadLocalProgress();
    if (localProg) {
      setProgress((prev) => mergeProgress(prev, localProg));
    }

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
        const merged = mergeProgress(pData, localProg);
        setProgress(merged);
        saveLocalProgress(merged);
      }
    } catch (err) {
      console.error("Failed to fetch Brain Zone data:", err);
      const fallback = loadLocalProgress();
      if (fallback) {
        setProgress(fallback);
      }
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

  // Open a world from Overworld Map with unlock security validation
  const handleOpenWorld = (worldId: string) => {
    if (!isWorldUnlocked(worldId, progress?.world_progress)) {
      const idx = WORLD_ORDER.indexOf(worldId);
      const prevWorldId = idx > 0 ? WORLD_ORDER[idx - 1] : "mind-forest";
      const prevWorldName = WORLD_METADATA[prevWorldId]?.name || "World 1";
      const worldName = WORLD_METADATA[worldId]?.name || "this world";
      toast.error(`Complete ${prevWorldName} to unlock ${worldName}.`);
      return;
    }
    setSelectedWorldId(worldId);
    setViewMode("world-detail");
    toast.success(`Entered ${WORLD_METADATA[worldId]?.name || "World"}! Explore the treasure trail below.`);
  };

  // Direct Access Security Guard effect
  useEffect(() => {
    if (viewMode === "world-detail" && !isWorldUnlocked(selectedWorldId, progress?.world_progress)) {
      setViewMode("map");
      const idx = WORLD_ORDER.indexOf(selectedWorldId);
      const prevWorldId = idx > 0 ? WORLD_ORDER[idx - 1] : "mind-forest";
      const prevWorldName = WORLD_METADATA[prevWorldId]?.name || "World 1";
      const worldName = WORLD_METADATA[selectedWorldId]?.name || "this world";
      toast.error(`Complete ${prevWorldName} to unlock ${worldName}.`);
    }
  }, [viewMode, selectedWorldId, progress]);

  // Generate & Launch Procedural Challenge
  const handleLaunchGame = async (gameType: string, worldId: string = "mind-forest", targetLevel?: number) => {
    // Security check: verify world is unlocked first
    if (!isWorldUnlocked(worldId, progress?.world_progress)) {
      const idx = WORLD_ORDER.indexOf(worldId);
      const prevWorldId = idx > 0 ? WORLD_ORDER[idx - 1] : "mind-forest";
      const prevWorldName = WORLD_METADATA[prevWorldId]?.name || "World 1";
      const worldName = WORLD_METADATA[worldId]?.name || "this world";
      toast.error(`Complete ${prevWorldName} to unlock ${worldName}.`);
      setViewMode("map");
      return;
    }

    const lvl = targetLevel !== undefined ? targetLevel : currentLevel;

    // Security check: verify previous level completed for level > 1
    const highestCompleted = progress?.world_progress?.[worldId] || 0;
    if (lvl > 1 && lvl > highestCompleted + 1) {
      toast.error(`Level ${lvl} is locked. Complete Level ${lvl - 1} first.`);
      return;
    }

    setCurrentLevel(lvl);
    setActiveGameType(gameType);
    setActiveWorldId(worldId);
    setSelectedWorldId(worldId);
    setViewMode("game");
    setLoadingChallenge(true);
    setCompletionResult(null);
    setGameTimer(0);
    setIsTimerRunning(false);

    try {
      const url = `${API_URL}/api/brainzone/generate?game_type=${encodeURIComponent(gameType)}&level=${lvl}&difficulty=${encodeURIComponent(selectedDifficulty)}`;
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
          setSelectedSudokuCell([0, 0]);
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

  // Launch a level node from the Treasure Trail View
  const handleLaunchLevelNode = (worldId: string, levelNum: number) => {
    if (!isWorldUnlocked(worldId, progress?.world_progress)) {
      const idx = WORLD_ORDER.indexOf(worldId);
      const prevWorldId = idx > 0 ? WORLD_ORDER[idx - 1] : "mind-forest";
      const prevWorldName = WORLD_METADATA[prevWorldId]?.name || "World 1";
      const worldName = WORLD_METADATA[worldId]?.name || "this world";
      toast.error(`Complete ${prevWorldName} to unlock ${worldName}.`);
      return;
    }

    const highestCompleted = progress?.world_progress?.[worldId] || 0;
    if (levelNum > 1 && levelNum > highestCompleted + 1) {
      toast.error(`Level ${levelNum} is locked. Complete Level ${levelNum - 1} first.`);
      return;
    }
    const gameInfo = getGameForLevel(worldId, levelNum);
    handleLaunchGame(gameInfo.type, worldId, levelNum);
  };

  // Complete Game API Submission & IMMEDIATE Persistence Event
  const submitGameCompletion = async (score: number, accuracy: number, passed: boolean) => {
    setIsTimerRunning(false);
    if (!passed) return;

    // Immediately calculate updated progression synchronously
    const curWProg = { ...(progress?.world_progress || {}) };
    const prevHighest = curWProg[activeWorldId] || 0;
    const newHighest = Math.max(prevHighest, currentLevel);
    curWProg[activeWorldId] = newHighest;

    const earnedXP = 20 * currentLevel + 10;
    const newXP = (progress?.xp || 0) + earnedXP;
    const newLevel = 1 + Math.floor(newXP / 200);
    const leveledUp = newLevel > (progress?.player_level || 1);

    const coinsEarned = currentLevel === 20 ? 50 : currentLevel % 5 === 0 ? 20 : 10;
    const gemsEarned = currentLevel === 20 ? 3 : currentLevel % 5 === 0 ? 1 : 0;
    const newCoins = (progress?.coins || 0) + coinsEarned;
    const newGems = (progress?.gems || 0) + gemsEarned;

    const collected = [...(progress?.collected_treasures || [])];
    let tUnlocked: string | null = null;
    if (currentLevel === 20) {
      const tName = WORLD_METADATA[activeWorldId]?.treasure_name || "Brain Relic";
      if (!collected.includes(tName)) {
        collected.push(tName);
        tUnlocked = tName;
      }
    }

    const unlockedWorlds = ["mind-forest"];
    if ((curWProg["mind-forest"] || 0) >= 20) unlockedWorlds.push("logic-desert");
    if ((curWProg["logic-desert"] || 0) >= 20) unlockedWorlds.push("neural-city");
    if ((curWProg["neural-city"] || 0) >= 20) unlockedWorlds.push("focus-volcano");
    if ((curWProg["focus-volcano"] || 0) >= 20) unlockedWorlds.push("brain-castle");

    const updatedProg: BrainProgress = {
      xp: newXP,
      player_level: newLevel,
      coins: newCoins,
      gems: newGems,
      keys: (progress?.keys || 0) + (currentLevel === 20 ? 1 : 0),
      map_pieces: (progress?.map_pieces || 0) + (currentLevel === 20 ? 1 : 0),
      world_progress: curWProg,
      collected_treasures: collected,
      streak: progress?.streak || 1,
      completed_levels: Math.max(progress?.completed_levels || 0, newHighest),
      completed_levels_count: Math.max(progress?.completed_levels_count || 0, newHighest),
      unlocked_worlds: unlockedWorlds,
      best_scores: progress?.best_scores || {},
      achievements: progress?.achievements || [],
    };

    // 1. SYNCHRONOUSLY UPDATE REACT STATE & LOCALSTORAGE BEFORE ANYTHING ELSE
    setProgress(updatedProg);
    saveLocalProgress(updatedProg);

    setCompletionResult({
      xp_awarded: earnedXP,
      total_xp: newXP,
      player_level: newLevel,
      leveled_up: leveledUp,
      coins_earned: coinsEarned,
      gems_earned: gemsEarned,
      total_coins: newCoins,
      total_gems: newGems,
      treasure_unlocked: tUnlocked,
      world_progress: curWProg,
      new_achievements: [],
    });

    // 2. NOW POST COMPLETION TO BACKEND API IN BACKGROUND
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
        if (result.world_progress) {
          const merged = mergeProgress(result, updatedProg);
          setProgress(merged);
          saveLocalProgress(merged);
        }
      }
    } catch (err) {
      console.error("Failed to post game completion to API:", err);
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

  const handleSudokuKeyDown = (e: React.KeyboardEvent, r: number, c: number) => {
    const size = challengeData?.size || 4;
    const isLocked = challengeData?.puzzle?.[r]?.[c] !== 0;

    let newR = r;
    let newC = c;

    if (e.key === "ArrowUp") {
      e.preventDefault();
      newR = Math.max(0, r - 1);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      newR = Math.min(size - 1, r + 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      newC = Math.max(0, c - 1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      newC = Math.min(size - 1, c + 1);
    } else if (e.key === "Backspace" || e.key === "Delete" || e.key === "0") {
      e.preventDefault();
      if (!isLocked) {
        handleSudokuChange(r, c, 0);
      }
      return;
    } else if (/^[1-9]$/.test(e.key)) {
      const digit = parseInt(e.key, 10);
      if (digit >= 1 && digit <= size) {
        e.preventDefault();
        if (!isLocked) {
          handleSudokuChange(r, c, digit);
        }
      }
      return;
    } else {
      return;
    }

    if (newR !== r || newC !== c) {
      setSelectedSudokuCell([newR, newC]);
      sudokuInputRefs.current[`${newR}-${newC}`]?.focus();
    }
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
      const sanitized = targetExpr.replace(/[^0-9+\-*/(). ]/g, "");
      const numsInExpr = (sanitized.match(/\d+/g) || []).map(Number).sort((a, b) => a - b);
      const targetNums = [...(challengeData?.numbers || [])].sort((a, b) => a - b);
      const usedAllNums = JSON.stringify(numsInExpr) === JSON.stringify(targetNums);

      if (!usedAllNums) {
        setTargetStatus(`You must use each number (${targetNums.join(", ")}) exactly once.`);
        return;
      }

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

  const activeWorldMeta = WORLD_METADATA[selectedWorldId] || WORLD_METADATA["mind-forest"];
  const playerLevel = progress?.player_level || 1;

  return (
    <div className="space-y-6 font-sans text-foreground">
      {/* =========================================================================
          TOP TREASURE HUD BANNER
         ========================================================================= */}
      <div className="p-6 sm:p-8 rounded-3xl border border-purple-500/30 bg-gradient-to-r from-purple-950/60 via-card to-card dark:from-purple-950/70 dark:via-secondary dark:to-card shadow-lg relative overflow-hidden flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2 relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full border border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-300 text-xs font-bold shadow-sm">
            <Compass className="w-4 h-4 text-amber-500 animate-spin-slow" />
            <span>Treasure Hunt Adventure Area</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground font-display flex items-center gap-2">
            <span>The Lost Brain Treasure</span>
            <Sparkles className="w-6 h-6 text-amber-400 animate-pulse" />
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground font-medium leading-relaxed">
            Take a refreshing break from learning! Explore 5 cognitive worlds, complete 20 treasure level trails, unlock ancient relics, and continue endless exploration.
          </p>
        </div>

        {/* Player Treasure HUD Pill Counters */}
        <div className="flex items-center gap-2.5 flex-wrap relative z-10">
          {/* Level Rank */}
          <div className="p-3 px-4 rounded-2xl border border-purple-500/30 bg-purple-500/10 shrink-0 space-y-1 text-center min-w-[120px]">
            <span className="text-[10px] uppercase font-bold text-muted-foreground block">Player Rank</span>
            <p className="text-lg font-mono font-extrabold text-purple-600 dark:text-purple-300">
              Lvl {playerLevel}
            </p>
            <div className="w-full bg-secondary rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-purple-600 h-full rounded-full transition-all"
                style={{ width: `${Math.min(100, ((progress?.xp || 0) % 200) / 2)}%` }}
              />
            </div>
          </div>

          {/* Coins */}
          <div className="p-3 px-3.5 rounded-2xl border border-amber-500/30 bg-amber-500/10 text-center shrink-0 min-w-[85px]">
            <span className="text-[10px] uppercase font-bold text-muted-foreground flex items-center justify-center gap-1">
              <Coins className="w-3.5 h-3.5 text-amber-500" /> Coins
            </span>
            <p className="text-lg font-mono font-extrabold text-amber-600 dark:text-amber-400">
              🪙 {progress?.coins || 0}
            </p>
          </div>

          {/* Gems */}
          <div className="p-3 px-3.5 rounded-2xl border border-cyan-500/30 bg-cyan-500/10 text-center shrink-0 min-w-[85px]">
            <span className="text-[10px] uppercase font-bold text-muted-foreground flex items-center justify-center gap-1">
              <Gem className="w-3.5 h-3.5 text-cyan-500" /> Gems
            </span>
            <p className="text-lg font-mono font-extrabold text-cyan-600 dark:text-cyan-400">
              💎 {progress?.gems || 0}
            </p>
          </div>

          {/* Keys */}
          <div className="p-3 px-3.5 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 text-center shrink-0 min-w-[85px]">
            <span className="text-[10px] uppercase font-bold text-muted-foreground flex items-center justify-center gap-1">
              <Key className="w-3.5 h-3.5 text-emerald-500" /> Keys
            </span>
            <p className="text-lg font-mono font-extrabold text-emerald-600 dark:text-emerald-400">
              🗝️ {progress?.keys || 0}
            </p>
          </div>

          {/* Treasures Collected */}
          <div className="p-3 px-3.5 rounded-2xl border border-purple-500/30 bg-purple-500/10 text-center shrink-0 min-w-[95px]">
            <span className="text-[10px] uppercase font-bold text-muted-foreground flex items-center justify-center gap-1">
              <Trophy className="w-3.5 h-3.5 text-purple-500" /> Relics
            </span>
            <p className="text-lg font-mono font-extrabold text-purple-600 dark:text-purple-300">
              🏆 {progress?.collected_treasures?.length || 0} / 5
            </p>
          </div>
        </div>
      </div>

      {/* =========================================================================
          VIEW 1: OVERWORLD TREASURE MAP (OVERVIEW)
         ========================================================================= */}
      {viewMode === "map" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                <MapIcon className="w-5 h-5 text-purple-500" />
                <span>Cognitive Treasure Map</span>
              </h2>
              <p className="text-xs text-muted-foreground">
                Select an unlocked world location to explore its 20-level treasure trail.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Difficulty:</span>
              {(["Easy", "Medium", "Hard"] as const).map((d) => (
                <button
                  key={d}
                  onClick={() => setSelectedDifficulty(d)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold border transition-all ${
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

          {/* Connected World Landmarks Map Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5">
            {Object.values(WORLD_METADATA).map((wMeta, idx) => {
              const isUnlocked = isWorldUnlocked(wMeta.id, progress?.world_progress);
              const completedLevelCount = progress?.world_progress?.[wMeta.id] || 0;
              const hasRelic = progress?.collected_treasures?.includes(wMeta.treasure_name);
              const IconComp = wMeta.icon;

              const prevWorldId = idx > 0 ? WORLD_ORDER[idx - 1] : null;
              const prevWorldName = prevWorldId ? WORLD_METADATA[prevWorldId]?.name : null;

              return (
                <div
                  key={wMeta.id}
                  onClick={() => handleOpenWorld(wMeta.id)}
                  className={`p-5 rounded-3xl border transition-all flex flex-col justify-between relative overflow-hidden group ${
                    isUnlocked
                      ? "border-purple-500/30 bg-card hover:border-purple-500/70 shadow-md hover:shadow-xl hover:-translate-y-1 cursor-pointer"
                      : "border-border bg-secondary/30 opacity-60 hover:border-rose-500/30 cursor-not-allowed"
                  }`}
                >
                  <div className="space-y-3 relative z-10">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-muted-foreground uppercase tracking-wider">
                        World {idx + 1}
                      </span>
                      {isUnlocked ? (
                        <span className="p-1.5 rounded-xl bg-emerald-500/20 text-emerald-500 border border-emerald-500/30">
                          <Unlock className="w-4 h-4" />
                        </span>
                      ) : (
                        <span className="p-1.5 rounded-xl bg-secondary text-muted-foreground border border-border">
                          <Lock className="w-4 h-4" />
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-2xl bg-gradient-to-br ${wMeta.color} border shadow-inner`}>
                        <IconComp className="w-7 h-7" />
                      </div>
                      <div>
                        <h3 className="text-base font-extrabold text-foreground group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                          {wMeta.name}
                        </h3>
                        <span className="text-[10px] font-mono text-muted-foreground block">{wMeta.theme} Theme</span>
                      </div>
                    </div>

                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                      {wMeta.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-border/50 space-y-3 relative z-10 mt-4">
                    {/* World Trail Progress */}
                    <div>
                      <div className="flex items-center justify-between text-[11px] font-mono font-semibold mb-1">
                        <span className="text-muted-foreground">Trail Progress</span>
                        <span className="text-foreground">{Math.min(20, completedLevelCount)} / 20</span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2 overflow-hidden border border-border/50">
                        <div
                          className="bg-gradient-to-r from-purple-500 to-indigo-500 h-full rounded-full transition-all"
                          style={{ width: `${Math.min(100, (completedLevelCount / 20) * 100)}%` }}
                        />
                      </div>
                    </div>

                    {/* Status & Relic Badge */}
                    <div className="flex items-center justify-between text-xs font-mono">
                      {isUnlocked ? (
                        hasRelic ? (
                          <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 font-bold border border-amber-500/30 flex items-center gap-1 text-[10px]">
                            <span>{wMeta.treasure_icon}</span>
                            <span>Relic Earned</span>
                          </span>
                        ) : (
                          <span className="text-purple-600 dark:text-purple-400 font-bold flex items-center gap-1 text-xs">
                            <span>Explore Trail</span>
                            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                          </span>
                        )
                      ) : (
                        <span className="text-rose-600 dark:text-rose-400 font-semibold text-[11px] flex items-center gap-1">
                          <Lock className="w-3 h-3 text-rose-500 shrink-0" /> Requires {prevWorldName || `World ${idx}`} completion
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW 2: WORLD ADVENTURE TRAIL VIEW (20 CORE LEVELS + ENDLESS)
         ========================================================================= */}
      {viewMode === "world-detail" && (
        <div className="space-y-6">
          {/* Top Bar Navigation */}
          <div className="p-5 rounded-3xl border border-border bg-card shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <button
              onClick={() => setViewMode("map")}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-border text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
            >
              <Compass className="w-4 h-4" />
              <span>Back to Overworld Map</span>
            </button>

            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-purple-600 dark:text-purple-400">
                {React.createElement(activeWorldMeta.icon, { className: "w-6 h-6" })}
              </div>
              <div>
                <h2 className="text-lg font-bold text-foreground">{activeWorldMeta.name} Trail</h2>
                <p className="text-xs text-muted-foreground">{activeWorldMeta.tagline}</p>
              </div>
            </div>

            {/* Relic Status Pill */}
            <div className="px-4 py-2 rounded-2xl border border-purple-500/30 bg-purple-500/10 text-xs font-mono font-bold flex items-center gap-2">
              <span className="text-base">{activeWorldMeta.treasure_icon}</span>
              <span>
                {progress?.collected_treasures?.includes(activeWorldMeta.treasure_name)
                  ? `${activeWorldMeta.treasure_name} (Acquired)`
                  : `Target: ${activeWorldMeta.treasure_name}`}
              </span>
            </div>
          </div>

          {/* World Progress Banner */}
          <div className="p-6 rounded-3xl border border-border bg-card shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-foreground">Treasure Journey Path</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Complete sequential level nodes 1–20 to unearth the {activeWorldMeta.treasure_name}. Level 21+ unlocks endless exploration.
                </p>
              </div>
              <div className="text-right">
                <span className="text-xl font-mono font-extrabold text-purple-600 dark:text-purple-300">
                  {Math.min(20, progress?.world_progress?.[selectedWorldId] || 0)} / 20
                </span>
                <span className="text-[10px] font-mono text-muted-foreground block">Core Levels Completed</span>
              </div>
            </div>

            <div className="w-full bg-secondary rounded-full h-3 overflow-hidden border border-border/50">
              <div
                className="bg-gradient-to-r from-purple-500 via-indigo-500 to-amber-500 h-full rounded-full transition-all"
                style={{
                  width: `${Math.min(100, ((progress?.world_progress?.[selectedWorldId] || 0) / 20) * 100)}%`,
                }}
              />
            </div>
          </div>

          {/* Winding 20-Level Trail Nodes Grid */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-foreground">Level Nodes</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {Array.from({ length: 20 }).map((_, i) => {
                const levelNum = i + 1;
                const highestCompleted = progress?.world_progress?.[selectedWorldId] || 0;
                const isCompleted = levelNum <= highestCompleted;
                const isUnlocked = levelNum <= highestCompleted + 1;
                const isTreasureNode = levelNum === 20;
                const isMilestone = levelNum === 5 || levelNum === 10 || levelNum === 15;
                const gameInfo = getGameForLevel(selectedWorldId, levelNum);
                const GameIcon = gameInfo.icon;

                return (
                  <button
                    key={levelNum}
                    aria-label={`Level ${levelNum}: ${gameInfo.title}, ${
                      isCompleted ? "Completed" : isUnlocked ? "Available" : "Locked"
                    }`}
                    onClick={() => {
                      if (!isUnlocked) {
                        toast.error(`Complete Level ${levelNum - 1} first to unlock Level ${levelNum}.`);
                      } else {
                        handleLaunchLevelNode(selectedWorldId, levelNum);
                      }
                    }}
                    className={`p-4 rounded-3xl border transition-all text-left flex flex-col justify-between relative group ${
                      isTreasureNode
                        ? isCompleted
                          ? "border-amber-500/50 bg-gradient-to-br from-amber-500/20 via-card to-card shadow-lg"
                          : isUnlocked
                          ? "border-amber-500/80 bg-gradient-to-br from-amber-500/20 via-purple-500/10 to-card animate-pulse shadow-md hover:scale-[1.02]"
                          : "border-border bg-secondary/30 opacity-60"
                        : isCompleted
                        ? "border-emerald-500/40 bg-emerald-500/10 hover:border-emerald-500/70 shadow-sm"
                        : isUnlocked
                        ? "border-purple-500/40 bg-card hover:border-purple-500/80 shadow-sm hover:scale-[1.02]"
                        : "border-border bg-secondary/30 opacity-50 cursor-not-allowed"
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-extrabold text-foreground">
                          {isTreasureNode ? "🏆 Level 20 Milestone" : `Level ${levelNum}`}
                        </span>

                        {isCompleted ? (
                          <span className="p-1 rounded-full bg-emerald-500 text-white">
                            <Check className="w-3.5 h-3.5" />
                          </span>
                        ) : isUnlocked ? (
                          <span className="p-1 rounded-full bg-purple-500 text-white animate-pulse">
                            <ArrowRight className="w-3.5 h-3.5" />
                          </span>
                        ) : (
                          <span className="p-1 rounded-full bg-secondary text-muted-foreground border border-border">
                            <Lock className="w-3.5 h-3.5" />
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 pt-1">
                        <div
                          className={`p-2 rounded-xl border ${
                            isCompleted
                              ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
                              : isUnlocked
                              ? "bg-purple-500/20 border-purple-500/30 text-purple-600 dark:text-purple-300"
                              : "bg-secondary border-border text-muted-foreground"
                          }`}
                        >
                          <GameIcon className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-foreground line-clamp-1">{gameInfo.title}</h4>
                          <span className="text-[10px] text-muted-foreground font-mono">{gameInfo.category}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-border/40 flex items-center justify-between text-[10px] font-mono mt-3">
                      {isTreasureNode ? (
                        <span className="text-amber-600 dark:text-amber-300 font-extrabold flex items-center gap-1">
                          <span>{activeWorldMeta.treasure_icon}</span>
                          <span>{activeWorldMeta.treasure_name}</span>
                        </span>
                      ) : isMilestone ? (
                        <span className="text-cyan-600 dark:text-cyan-400 font-bold flex items-center gap-1">
                          <Gem className="w-3 h-3" /> +1 Gem | +20 Coins
                        </span>
                      ) : (
                        <span className="text-muted-foreground flex items-center gap-1">
                          <Coins className="w-3 h-3 text-amber-500" /> +10 Coins
                        </span>
                      )}

                      {isCompleted && <span className="text-emerald-600 dark:text-emerald-400 font-bold">Solved</span>}
                    </div>
                  </button>
                );
              })}

              {/* Endless Exploration Node (Level 21+) */}
              {(() => {
                const highestCompleted = progress?.world_progress?.[selectedWorldId] || 0;
                const isEndlessUnlocked = highestCompleted >= 20;
                const nextEndlessLvl = Math.max(21, highestCompleted + 1);

                return (
                  <button
                    onClick={() => {
                      if (!isEndlessUnlocked) {
                        toast.error("Complete Core Level 20 to unlock Endless Exploration!");
                      } else {
                        handleLaunchLevelNode(selectedWorldId, nextEndlessLvl);
                      }
                    }}
                    className={`p-4 rounded-3xl border transition-all text-left flex flex-col justify-between relative group ${
                      isEndlessUnlocked
                        ? "border-cyan-500/60 bg-gradient-to-br from-cyan-500/20 via-purple-500/10 to-card shadow-lg hover:scale-[1.02]"
                        : "border-border bg-secondary/30 opacity-50 cursor-not-allowed"
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-extrabold text-cyan-600 dark:text-cyan-300 flex items-center gap-1">
                          <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Endless Level {nextEndlessLvl}
                        </span>
                        {isEndlessUnlocked ? (
                          <span className="p-1 rounded-full bg-cyan-500 text-white animate-pulse">
                            <ArrowRight className="w-3.5 h-3.5" />
                          </span>
                        ) : (
                          <Lock className="w-3.5 h-3.5 text-muted-foreground" />
                        )}
                      </div>

                      <div className="flex items-center gap-2 pt-1">
                        <div className="p-2 rounded-xl bg-cyan-500/20 border border-cyan-500/30 text-cyan-600 dark:text-cyan-300">
                          <Compass className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-foreground">Endless Exploration</h4>
                          <span className="text-[10px] text-muted-foreground font-mono">Infinite Procedural</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-border/40 flex items-center justify-between text-[10px] font-mono mt-3">
                      <span className="text-cyan-600 dark:text-cyan-300 font-bold">Infinite Challenges</span>
                      <span className="text-xs">🌌 ∞</span>
                    </div>
                  </button>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW 3: DEDICATED GAME WORKSPACE & CELEBRATION MODAL
         ========================================================================= */}
      {viewMode === "game" && activeGameType && (
        <div className="w-full space-y-6">
          {/* Top Bar Navigation */}
          <div className="p-4 rounded-2xl border border-border bg-card flex items-center justify-between shadow-sm">
            <button
              onClick={() => setViewMode("world-detail")}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-border text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
            >
              <ArrowLeft className="w-4 h-4" /> Back to World Trail
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
              {/* TREASURE HUNT CELEBRATION MODAL */}
              {completionResult && (
                <div className="p-8 sm:p-12 rounded-3xl border border-purple-500/40 bg-gradient-to-br from-purple-500/20 via-card to-card dark:from-purple-950/60 dark:via-secondary dark:to-card text-center space-y-5 shadow-xl max-w-2xl mx-auto">
                  {completionResult.treasure_unlocked || currentLevel === 20 ? (
                    <div className="space-y-3">
                      <div className="text-6xl animate-bounce">{activeWorldMeta.treasure_icon}</div>
                      <h3 className="text-2xl sm:text-3xl font-extrabold text-amber-500 dark:text-amber-400 font-display">
                        WORLD TREASURE DISCOVERED!
                      </h3>
                      <p className="text-sm text-foreground font-bold">
                        🏆 You unearthed the {activeWorldMeta.treasure_name}!
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Trophy className="w-14 h-14 text-amber-500 dark:text-amber-400 mx-auto animate-bounce" />
                      <h3 className="text-2xl font-bold text-foreground">Level {currentLevel} Cleared!</h3>
                    </div>
                  )}

                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Time taken: <strong className="text-foreground">{Math.floor(gameTimer / 60)}m {gameTimer % 60}s</strong>
                  </p>

                  {/* Treasure Rewards Breakdown */}
                  <div className="flex justify-center gap-3 flex-wrap py-2">
                    <span className="px-3.5 py-1.5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 font-bold font-mono text-xs border border-amber-500/30">
                      🪙 +{completionResult.coins_earned || 10} Coins
                    </span>
                    {(completionResult.gems_earned > 0 || currentLevel % 5 === 0) && (
                      <span className="px-3.5 py-1.5 rounded-full bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 font-bold font-mono text-xs border border-cyan-500/30">
                        💎 +{completionResult.gems_earned || 1} Gem
                      </span>
                    )}
                    <span className="px-3.5 py-1.5 rounded-full bg-purple-500/20 text-purple-700 dark:text-purple-300 font-bold font-mono text-xs border border-purple-500/30">
                      ⚡ +{completionResult.xp_awarded || 50} XP
                    </span>
                    {completionResult.leveled_up && (
                      <span className="px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-bold font-mono text-xs border border-emerald-500/30">
                        🎉 Player Level Up! Now Level {completionResult.player_level}
                      </span>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-center gap-3 pt-2">
                    <button
                      onClick={() => {
                        const nextLvl = currentLevel + 1;
                        handleLaunchLevelNode(activeWorldId, nextLvl);
                      }}
                      className="py-3 px-6 rounded-2xl border border-purple-500/40 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all flex items-center gap-2 shadow-md"
                    >
                      <span>Next Level ({currentLevel + 1})</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode("world-detail")}
                      className="py-3 px-6 rounded-2xl border border-border text-xs font-bold text-foreground hover:bg-secondary transition-all"
                    >
                      Back to World Trail
                    </button>
                  </div>
                </div>
              )}

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
                    role="grid"
                    aria-label={`${challengeData.size} by ${challengeData.size} Sudoku Grid`}
                    className="grid gap-2 mx-auto p-4 rounded-2xl bg-secondary/50 border border-border"
                    style={{
                      gridTemplateColumns: `repeat(${challengeData.size || 4}, minmax(0, 1fr))`,
                      maxWidth: challengeData.size === 4 ? "280px" : challengeData.size === 6 ? "380px" : "480px",
                    }}
                  >
                    {sudokuGrid.map((row, r) =>
                      row.map((val, c) => {
                        const isLocked = challengeData.puzzle?.[r]?.[c] !== 0;
                        const isSelected = selectedSudokuCell?.[0] === r && selectedSudokuCell?.[1] === c;
                        return (
                          <input
                            key={`${r}-${c}`}
                            ref={(el) => {
                              sudokuInputRefs.current[`${r}-${c}`] = el;
                            }}
                            type="text"
                            inputMode="numeric"
                            role="gridcell"
                            aria-label={`Sudoku row ${r + 1} column ${c + 1}${isLocked ? `, given number ${val}` : val !== 0 ? `, value ${val}` : ", empty"}`}
                            aria-selected={isSelected}
                            readOnly={isLocked}
                            value={val !== 0 ? val : ""}
                            onFocus={() => setSelectedSudokuCell([r, c])}
                            onClick={() => setSelectedSudokuCell([r, c])}
                            onKeyDown={(e) => handleSudokuKeyDown(e, r, c)}
                            onChange={(e) => {
                              if (isLocked) return;
                              const raw = e.target.value;
                              const lastChar = raw.slice(-1);
                              const n = parseInt(lastChar, 10);
                              if (!isNaN(n) && n >= 1 && n <= (challengeData?.size || 9)) {
                                handleSudokuChange(r, c, n);
                              } else if (raw === "" || n === 0) {
                                handleSudokuChange(r, c, 0);
                              }
                            }}
                            className={`h-12 text-center text-lg font-bold font-mono rounded-xl border outline-none transition-all ${
                              isSelected
                                ? "ring-2 ring-purple-500 dark:ring-purple-400 bg-purple-500/10 border-purple-500 font-extrabold"
                                : isLocked
                                ? "bg-secondary text-muted-foreground border-border cursor-default"
                                : "bg-card text-purple-600 dark:text-purple-300 border-purple-500/50 hover:border-purple-400"
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
                      onClick={() => {
                        setSudokuGrid(challengeData.puzzle.map((row: number[]) => [...row]));
                        setSelectedSudokuCell([0, 0]);
                        sudokuInputRefs.current["0-0"]?.focus();
                      }}
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

                  <div className={memoryCards.length > 16 ? "grid grid-cols-4 sm:grid-cols-6 gap-3 max-w-xl mx-auto" : "grid grid-cols-4 gap-3 max-w-lg mx-auto"}>
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
        </div>
      )}
    </div>
  );
}
