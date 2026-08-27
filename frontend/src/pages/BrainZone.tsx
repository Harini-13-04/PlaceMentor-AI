import React, { useState, useEffect } from "react";
import { BRAIN_GAMES, PATTERN_ITEMS, BrainGameInfo, PatternItem } from "@/data/brainZoneData";
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
} from "lucide-react";

export default function BrainZone() {
  const [activeGameId, setActiveGameId] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<"Easy" | "Medium" | "Hard">("Easy");

  // Timer & Game metrics
  const [gameTimer, setGameTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [gameScore, setGameScore] = useState({ score: 0, accuracy: 0, skill: "Logic" });

  // 1. Sudoku Interactive State (4x4 Mini Sudoku for speed and clarity)
  const INITIAL_SUDOKU_4X4 = [
    [1, 0, 3, 0],
    [0, 4, 0, 2],
    [2, 0, 4, 0],
    [0, 3, 0, 1],
  ];
  const SUDOKU_SOLUTION_4X4 = [
    [1, 2, 3, 4],
    [3, 4, 1, 2],
    [2, 1, 4, 3],
    [4, 3, 2, 1],
  ];
  const [sudokuGrid, setSudokuGrid] = useState<number[][]>(INITIAL_SUDOKU_4X4);
  const [sudokuStatus, setSudokuStatus] = useState<string | null>(null);

  // 2. Memory Match State
  const MEMORY_SYMBOLS = ["O(1)", "O(n)", "O(log n)", "O(n²)", "BFS", "DFS"];
  const [cards, setCards] = useState<{ id: number; symbol: string; flipped: boolean; matched: boolean }[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [movesCount, setMovesCount] = useState(0);

  // 3. Pattern Recognition State
  const [patternIdx, setPatternIdx] = useState(0);
  const [patternSelectedOpt, setPatternSelectedOpt] = useState<number | null>(null);

  // 4. Target 24 Speed Puzzle State
  const [targetNumbers, setTargetNumbers] = useState([6, 4, 3, 2]);
  const [userMathExpr, setUserMathExpr] = useState("");
  const [mathStatus, setMathStatus] = useState<string | null>(null);

  // 5. Vocab Anagram State
  const ANAGRAM_LIST = [
    { scrambled: "YMRAR", answer: "ARRAY", hint: "Contiguous linear data structure in memory." },
    { scrambled: "CKATS", answer: "STACK", hint: "LIFO data structure used in function call trees." },
    { scrambled: "QUEEU", answer: "QUEUE", hint: "FIFO data structure used in CPU scheduling." },
  ];
  const [anagramIdx, setAnagramIdx] = useState(0);
  const [userAnagramInput, setUserAnagramInput] = useState("");
  const [anagramStatus, setAnagramStatus] = useState<string | null>(null);

  // Timer loop
  useEffect(() => {
    let interval: any;
    if (isTimerRunning) {
      interval = setInterval(() => setGameTimer((t) => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  // Start selected game in FULL-PAGE mode
  const handleLaunchGame = (game: BrainGameInfo) => {
    setActiveGameId(game.id);
    setGameTimer(0);
    setIsTimerRunning(true);
    setGameCompleted(false);

    if (game.id === "sudoku") {
      setSudokuGrid(INITIAL_SUDOKU_4X4.map((row) => [...row]));
      setSudokuStatus(null);
    } else if (game.id === "memory-match") {
      const deck = [...MEMORY_SYMBOLS, ...MEMORY_SYMBOLS]
        .sort(() => Math.random() - 0.5)
        .map((sym, idx) => ({ id: idx, symbol: sym, flipped: false, matched: false }));
      setCards(deck);
      setFlippedIndices([]);
      setMovesCount(0);
    } else if (game.id === "pattern-recognition") {
      setPatternIdx(0);
      setPatternSelectedOpt(null);
    } else if (game.id === "number-puzzle") {
      setTargetNumbers([6, 4, 3, 2]);
      setUserMathExpr("");
      setMathStatus(null);
    } else if (game.id === "word-puzzle") {
      setAnagramIdx(0);
      setUserAnagramInput("");
      setAnagramStatus(null);
    }
  };

  // Sudoku cell change
  const handleSudokuCellChange = (r: number, c: number, val: number) => {
    if (INITIAL_SUDOKU_4X4[r][c] !== 0) return;
    const updated = sudokuGrid.map((row, ri) =>
      row.map((cell, ci) => (ri === r && ci === c ? val : cell))
    );
    setSudokuGrid(updated);
  };

  // Validate Sudoku
  const checkSudoku = () => {
    let isCorrect = true;
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (sudokuGrid[r][c] !== SUDOKU_SOLUTION_4X4[r][c]) {
          isCorrect = false;
        }
      }
    }
    if (isCorrect) {
      setIsTimerRunning(false);
      setSudokuStatus("Passed! All row/column constraints valid.");
      setGameScore({ score: 100, accuracy: 100, skill: "Deductive Logic" });
      setGameCompleted(true);
    } else {
      setSudokuStatus("Incorrect constraint detected. Check numbers 1-4.");
    }
  };

  // Memory card click
  const handleCardClick = (idx: number) => {
    if (cards[idx].flipped || cards[idx].matched || flippedIndices.length === 2) return;

    const newCards = [...cards];
    newCards[idx].flipped = true;
    const newFlipped = [...flippedIndices, idx];
    setCards(newCards);
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      setMovesCount((m) => m + 1);
      const [first, second] = newFlipped;
      if (cards[first].symbol === cards[second].symbol) {
        setTimeout(() => {
          setCards((prev) => {
            const updated = [...prev];
            updated[first].matched = true;
            updated[second].matched = true;
            if (updated.every((c) => c.matched)) {
              setIsTimerRunning(false);
              setGameScore({ score: 100, accuracy: 100, skill: "Working Memory" });
              setGameCompleted(true);
            }
            return updated;
          });
          setFlippedIndices([]);
        }, 400);
      } else {
        setTimeout(() => {
          setCards((prev) => {
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

  // Pattern check
  const handleSelectPattern = (optIdx: number) => {
    setPatternSelectedOpt(optIdx);
    const item = PATTERN_ITEMS[patternIdx];
    if (optIdx === item.correctIndex) {
      setIsTimerRunning(false);
      setGameScore({ score: 100, accuracy: 100, skill: "Pattern Recognition" });
      setGameCompleted(true);
    }
  };

  // Anagram check
  const handleVerifyAnagram = () => {
    const current = ANAGRAM_LIST[anagramIdx];
    if (userAnagramInput.trim().toUpperCase() === current.answer) {
      if (anagramIdx < ANAGRAM_LIST.length - 1) {
        setAnagramIdx((i) => i + 1);
        setUserAnagramInput("");
        setAnagramStatus("Correct! Next word loaded.");
      } else {
        setIsTimerRunning(false);
        setGameScore({ score: 100, accuracy: 100, skill: "Verbal Agility" });
        setGameCompleted(true);
      }
    } else {
      setAnagramStatus("Incorrect anagram unscramble. Try again.");
    }
  };

  const activeGame = BRAIN_GAMES.find((g) => g.id === activeGameId);

  // Render top visual area for each game card matching Reference Image 1
  const renderGameVisual = (gameId: string) => {
    switch (gameId) {
      case "sudoku":
        return (
          <div className="w-full h-36 rounded-t-2xl bg-secondary/60 flex items-center justify-center border-b border-border">
            {/* 3x3 Dots Grid Icon in glowing purple */}
            <div className="grid grid-cols-3 gap-1.5 p-3 rounded-2xl bg-purple-500/10 border border-purple-500/30">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="w-2.5 h-2.5 rounded-full bg-purple-500" />
              ))}
            </div>
          </div>
        );
      case "memory-match":
        return (
          <div className="w-full h-36 rounded-t-2xl bg-secondary/60 flex items-center justify-center border-b border-border">
            {/* Overlapping Cards in glowing orange */}
            <div className="w-16 h-16 rounded-2xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-500 shadow-sm">
              <Layers className="w-8 h-8 rotate-12" />
            </div>
          </div>
        );
      case "pattern-recognition":
        return (
          <div className="w-full h-36 rounded-t-2xl bg-secondary/60 flex items-center justify-center border-b border-border">
            {/* Puzzle Piece in glowing emerald/green */}
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-500 shadow-sm">
              <Puzzle className="w-8 h-8" />
            </div>
          </div>
        );
      case "logical-reasoning":
        return (
          <div className="w-full h-36 rounded-t-2xl bg-secondary/60 flex items-center justify-center border-b border-border">
            {/* Brain in glowing pink/magenta */}
            <div className="w-16 h-16 rounded-2xl bg-pink-500/10 border border-pink-500/30 flex items-center justify-center text-pink-500 shadow-sm">
              <BrainCircuit className="w-8 h-8" />
            </div>
          </div>
        );
      case "number-puzzle":
        return (
          <div className="w-full h-36 rounded-t-2xl bg-secondary/60 flex items-center justify-center border-b border-border">
            {/* Calculator in glowing amber */}
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 shadow-sm">
              <Calculator className="w-8 h-8" />
            </div>
          </div>
        );
      case "word-puzzle":
        return (
          <div className="w-full h-36 rounded-t-2xl bg-secondary/60 flex items-center justify-center border-b border-border">
            {/* Abc text glyph in glowing indigo/purple */}
            <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-600 dark:text-purple-400 font-extrabold text-2xl font-display shadow-sm">
              Abc
            </div>
          </div>
        );
      default:
        return (
          <div className="w-full h-36 rounded-t-2xl bg-secondary/60 flex items-center justify-center border-b border-border">
            <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-500 shadow-sm">
              <Zap className="w-8 h-8" />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6 font-sans text-foreground">
      {/* =========================================================================
          VIEW 1: BROWSE GAMES (Matching Reference Image 1 Layout)
         ========================================================================= */}
      {!activeGameId && (
        <>
          {/* Top Hero Banner */}
          <div className="p-6 sm:p-8 rounded-2xl border border-purple-500/25 bg-gradient-to-br from-purple-500/10 via-card to-card dark:from-purple-950/40 dark:via-secondary dark:to-card shadow-sm relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 relative z-10">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-700 dark:text-purple-300 text-xs font-semibold">
                <BrainCircuit className="w-3.5 h-3.5" />
                <span>Placement Cognitive Arena</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground font-display">
                Brain Zone Cognitive Training
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground font-medium max-w-xl leading-relaxed">
                Professional brain workouts targeting working memory, logic deduction, mental arithmetic, and pattern recognition for placement screening.
              </p>
            </div>

            {/* Daily Brain Challenge Widget */}
            <div className="p-4 rounded-xl border border-purple-500/30 bg-purple-500/10 shrink-0 space-y-2.5 max-w-xs relative z-10">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-purple-700 dark:text-purple-300 flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-amber-500 fill-amber-500" /> Daily Brain Challenge
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-500/20 text-purple-700 dark:text-purple-300 font-bold">
                  Today
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground">
                4x4 Sudoku Constraint elimination challenge to sharpen recursive problem deduction.
              </p>
              <button
                onClick={() => handleLaunchGame(BRAIN_GAMES[0])}
                className="w-full py-2 px-3 rounded-lg text-white text-xs font-bold shadow-md flex items-center justify-center gap-1.5 transition-all pm-btn-gradient"
              >
                <span>Play Daily Challenge</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* 3-Column Games Grid matching Reference Image 1 */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-foreground">Cognitive Placement Games</h3>
              <span className="text-xs font-mono text-muted-foreground">{BRAIN_GAMES.length} Brain Exercises</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {BRAIN_GAMES.map((game) => (
                <div
                  key={game.id}
                  className="rounded-2xl border border-border bg-card hover:border-purple-500/40 transition-all shadow-sm flex flex-col justify-between overflow-hidden group"
                >
                  {/* Visual Header matching Reference Image 1 */}
                  {renderGameVisual(game.id)}

                  {/* Card Body */}
                  <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                    <div className="space-y-2">
                      {/* Category Pill Tag on left */}
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                        {game.skillTested}
                      </span>

                      {/* Game Title */}
                      <h4 className="text-base font-bold text-foreground tracking-tight">
                        {game.name}
                      </h4>

                      {/* Description */}
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {game.description}
                      </p>
                    </div>

                    {/* Launch Game Action Button */}
                    <button
                      onClick={() => handleLaunchGame(game)}
                      className="w-full py-2.5 px-4 rounded-xl border border-border bg-secondary/80 hover:bg-purple-600 hover:text-white hover:border-purple-500 text-foreground text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <span>Launch game</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* =========================================================================
          VIEW 2: DEDICATED FULL-PAGE GAME WORKSPACE (NO POPUP MODAL!)
         ========================================================================= */}
      {activeGameId && activeGame && (
        <div className="w-full space-y-6">
          {/* Top Full-Width Header Bar */}
          <div className="p-4 rounded-2xl border border-border bg-card flex items-center justify-between shadow-sm">
            <button
              onClick={() => setActiveGameId(null)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-border text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
            >
              <ArrowLeft className="w-4 h-4" /> Exit Game
            </button>

            <div className="flex items-center gap-4">
              <span className="text-sm font-bold text-foreground">{activeGame.name}</span>

              <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-mono font-bold">
                <Clock className="w-4 h-4 animate-pulse" />
                <span>
                  {Math.floor(gameTimer / 60).toString().padStart(2, "0")}:
                  {(gameTimer % 60).toString().padStart(2, "0")}
                </span>
              </div>
            </div>
          </div>

          {/* GAME 1: FULL-PAGE SUDOKU */}
          {activeGameId === "sudoku" && (
            <div className="p-6 sm:p-10 rounded-2xl border border-border bg-card shadow-sm space-y-6 text-center max-w-2xl mx-auto">
              <div>
                <h3 className="text-xl font-bold text-foreground">4x4 Sudoku Constraint Solver</h3>
                <p className="text-xs text-muted-foreground mt-1">Each row, column, and 2x2 quadrant must contain digits 1 through 4 exactly once.</p>
              </div>

              {/* 4x4 Grid */}
              <div className="grid grid-cols-4 gap-3 w-72 mx-auto p-4 rounded-2xl bg-secondary/50 border border-border">
                {sudokuGrid.map((row, r) =>
                  row.map((val, c) => {
                    const isLocked = INITIAL_SUDOKU_4X4[r][c] !== 0;
                    return (
                      <input
                        key={`${r}-${c}`}
                        type="number"
                        min={1}
                        max={4}
                        disabled={isLocked}
                        value={val !== 0 ? val : ""}
                        onChange={(e) => {
                          const n = parseInt(e.target.value, 10);
                          handleSudokuCellChange(r, c, isNaN(n) ? 0 : n);
                        }}
                        className={`w-14 h-14 text-center text-xl font-bold font-mono rounded-xl border outline-none transition-all ${
                          isLocked
                            ? "bg-secondary text-muted-foreground border-border cursor-not-allowed"
                            : "bg-card text-purple-600 dark:text-purple-300 border-purple-500/50 focus:border-purple-400"
                        }`}
                      />
                    );
                  })
                )}
              </div>

              {/* Number Keypad Helpers */}
              <div className="flex justify-center gap-2 pt-2">
                {[1, 2, 3, 4].map((num) => (
                  <span
                    key={num}
                    className="w-8 h-8 rounded-lg bg-secondary border border-border text-xs font-mono font-bold text-muted-foreground flex items-center justify-center"
                  >
                    {num}
                  </span>
                ))}
              </div>

              {sudokuStatus && (
                <p className="text-xs font-semibold text-purple-600 dark:text-purple-300 font-mono">{sudokuStatus}</p>
              )}

              <div className="flex justify-center gap-4 pt-2">
                <button
                  onClick={() => setSudokuGrid(INITIAL_SUDOKU_4X4.map((row) => [...row]))}
                  className="px-5 py-2.5 rounded-xl border border-border text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-secondary"
                >
                  Reset Grid
                </button>
                <button
                  onClick={checkSudoku}
                  className="px-7 py-2.5 rounded-xl text-xs font-bold text-white pm-btn-gradient shadow-md"
                >
                  Verify Solution
                </button>
              </div>
            </div>
          )}

          {/* GAME 2: FULL-PAGE MEMORY MATCH */}
          {activeGameId === "memory-match" && (
            <div className="p-6 sm:p-10 rounded-2xl border border-border bg-card shadow-sm space-y-6 text-center max-w-2xl mx-auto">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-foreground">Algorithm Symbol Memory Match</h3>
                  <p className="text-xs text-muted-foreground mt-1">Flip cards to match asymptotic complexity pairs.</p>
                </div>
                <span className="text-xs font-mono font-bold text-purple-600 dark:text-purple-400 bg-purple-500/10 px-3 py-1 rounded-lg border border-purple-500/20">
                  {movesCount} Moves
                </span>
              </div>

              <div className="grid grid-cols-4 gap-3 max-w-lg mx-auto">
                {cards.map((card, idx) => (
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

          {/* GAME 3: FULL-PAGE PATTERN RECOGNITION */}
          {activeGameId === "pattern-recognition" && (
            <div className="p-6 sm:p-10 rounded-2xl border border-border bg-card shadow-sm space-y-6 text-center max-w-2xl mx-auto">
              <div>
                <h3 className="text-xl font-bold text-foreground">Progression Law Deduction</h3>
                <p className="text-xs text-muted-foreground mt-1">Discover the progression rule and identify the missing element.</p>
              </div>

              {/* Sequence Display */}
              <div className="flex items-center justify-center gap-3 flex-wrap">
                {PATTERN_ITEMS[patternIdx].sequence.map((item, i) => (
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

              {/* Options Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-lg mx-auto pt-3">
                {PATTERN_ITEMS[patternIdx].options.map((opt, optIdx) => (
                  <button
                    key={optIdx}
                    onClick={() => handleSelectPattern(optIdx)}
                    className={`p-4 rounded-xl border text-base font-mono font-bold transition-all ${
                      patternSelectedOpt === optIdx
                        ? optIdx === PATTERN_ITEMS[patternIdx].correctIndex
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
                  <strong>Explanation:</strong> {PATTERN_ITEMS[patternIdx].explanation}
                </p>
              )}
            </div>
          )}

          {/* GAME 4: FULL-PAGE ANAGRAM PUZZLE */}
          {activeGameId === "word-puzzle" && (
            <div className="p-6 sm:p-10 rounded-2xl border border-border bg-card shadow-sm space-y-6 text-center max-w-2xl mx-auto">
              <div>
                <h3 className="text-xl font-bold text-foreground">Placement Vocab Anagram</h3>
                <p className="text-xs text-muted-foreground mt-1">Unscramble the letters to reveal high-yield computer science terms.</p>
              </div>

              <div className="p-6 rounded-2xl bg-secondary/50 border border-border max-w-md mx-auto space-y-4">
                <span className="text-xs font-mono uppercase font-bold text-muted-foreground">Scrambled Word:</span>
                <p className="text-3xl font-extrabold font-mono tracking-widest text-purple-600 dark:text-purple-400">
                  {ANAGRAM_LIST[anagramIdx].scrambled}
                </p>
                <p className="text-xs text-muted-foreground">
                  <strong>Hint:</strong> {ANAGRAM_LIST[anagramIdx].hint}
                </p>
              </div>

              <div className="max-w-md mx-auto space-y-3">
                <input
                  type="text"
                  value={userAnagramInput}
                  onChange={(e) => setUserAnagramInput(e.target.value.toUpperCase())}
                  placeholder="Type your unscrambled answer..."
                  className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground text-center font-mono font-bold text-base outline-none focus:border-purple-500 uppercase tracking-widest"
                />

                {anagramStatus && (
                  <p className="text-xs font-semibold text-purple-600 dark:text-purple-400 font-mono">{anagramStatus}</p>
                )}

                <button
                  onClick={handleVerifyAnagram}
                  className="w-full py-3 rounded-xl text-xs font-bold text-white pm-btn-gradient shadow-md"
                >
                  Submit Word
                </button>
              </div>
            </div>
          )}

          {/* GAME COMPLETION / DIAGNOSTIC REPORT (FULL PAGE VIEW) */}
          {gameCompleted && (
            <div className="p-8 sm:p-12 rounded-2xl border border-purple-500/30 bg-gradient-to-br from-purple-500/10 via-card to-card dark:from-purple-950/40 dark:via-secondary dark:to-card text-center space-y-4 shadow-sm max-w-2xl mx-auto">
              <Trophy className="w-14 h-14 text-amber-500 dark:text-amber-400 mx-auto animate-bounce" />
              <h3 className="text-2xl font-bold text-foreground">Cognitive Challenge Completed!</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Time taken: <strong className="text-foreground">{Math.floor(gameTimer / 60)}m {gameTimer % 60}s</strong> &bull; Skill Tested: <strong className="text-purple-600 dark:text-purple-400">{gameScore.skill}</strong>
              </p>
              <button
                onClick={() => setActiveGameId(null)}
                className="py-3 px-8 rounded-xl text-xs font-bold text-white pm-btn-gradient shadow-md inline-block"
              >
                Back to Brain Zone
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
