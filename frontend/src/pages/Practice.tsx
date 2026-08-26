import React, { useState, useMemo } from "react";
import {
  Search,
  CheckCircle2,
  CircleDot,
  Flame,
  Building2,
  Filter,
  Sun,
  Moon,
  Code2,
  Layers,
  ChevronRight,
  RotateCcw,
} from "lucide-react";
import {
  PROBLEMS,
  Problem,
  Difficulty,
  Category,
  ProblemStatus,
  COMPANIES_LIST,
} from "@/data/problems";
import { PracticeWorkspace } from "@/components/practice/PracticeWorkspace";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";

type CategoryFilter = "All" | "DSA" | "SQL" | "Core CS" | "Frequently Asked" | "Weak Areas";

const TOPIC_LIST = [
  "All",
  "Arrays",
  "Strings",
  "Hashing",
  "Two Pointers",
  "Sliding Window",
  "Stack",
  "Queue",
  "Linked List",
  "Binary Search",
  "Trees",
  "Graphs",
  "Dynamic Programming",
  "Greedy",
  "Backtracking",
  "Math",
  "SQL",
  "DBMS",
  "Operating Systems",
  "Computer Networks",
  "OOP",
];

export default function Practice() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  // Active Workspace Problem
  const [selectedProblemId, setSelectedProblemId] = useState<string | null>(null);

  // User Problem Status & Mastery Store
  const [problemStates, setProblemStates] = useState<
    Record<string, { status: ProblemStatus; mastery: number }>
  >(() => {
    return {
      "pm-arr-001": { status: "Solved", mastery: 85 },
      "pm-arr-002": { status: "Solved", mastery: 90 },
      "pm-arr-003": { status: "Solved", mastery: 75 },
      "pm-arr-004": { status: "Attempted", mastery: 45 },
      "pm-arr-005": { status: "Solved", mastery: 80 },
      "pm-dsa-011": { status: "Solved", mastery: 95 },
      "pm-dsa-016": { status: "Attempted", mastery: 50 },
      "pm-dsa-021": { status: "Solved", mastery: 80 },
      "pm-dsa-029": { status: "Attempted", mastery: 40 },
    };
  });

  // Filter States
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("All");
  const [selectedTopic, setSelectedTopic] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("All");
  const [selectedCompany, setSelectedCompany] = useState<string>("All");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");

  // Dynamically compute counts for each topic from the actual dataset
  const topicCounts = useMemo(() => {
    const counts: Record<string, number> = { All: PROBLEMS.length };
    for (const p of PROBLEMS) {
      for (const t of p.topics) {
        counts[t] = (counts[t] || 0) + 1;
      }
      if (p.category === "SQL") {
        counts["SQL"] = (counts["SQL"] || 0) + 1;
      }
      if (p.category === "Core CS") {
        counts["Core CS"] = (counts["Core CS"] || 0) + 1;
      }
    }
    return counts;
  }, []);

  // Selected Problem
  const selectedProblem = useMemo(() => {
    return PROBLEMS.find((p) => p.id === selectedProblemId) || null;
  }, [selectedProblemId]);

  // Update Problem Status & Mastery
  const handleProblemStatusChange = (newStatus: "Attempted" | "Solved", newMastery: number) => {
    if (!selectedProblemId) return;
    setProblemStates((prev) => ({
      ...prev,
      [selectedProblemId]: {
        status: newStatus,
        mastery: newMastery,
      },
    }));
  };

  // Filtered Problems List
  const filteredProblems = useMemo(() => {
    return PROBLEMS.filter((p) => {
      // 1. Category Pill Filter
      if (categoryFilter === "DSA" && p.category !== "DSA") return false;
      if (categoryFilter === "SQL" && p.category !== "SQL") return false;
      if (categoryFilter === "Core CS" && p.category !== "Core CS") return false;
      if (categoryFilter === "Frequently Asked" && !p.frequentlyAsked) return false;
      if (categoryFilter === "Weak Areas") {
        const state = problemStates[p.id];
        if (!state || state.status !== "Attempted") return false;
      }

      // 2. Horizontal Topic Bar Filter
      if (selectedTopic !== "All") {
        const matchesTopic = p.topics.some(
          (t) => t.toLowerCase() === selectedTopic.toLowerCase()
        );
        const matchesCategory =
          (selectedTopic === "SQL" && p.category === "SQL") ||
          (selectedTopic === "DBMS" && p.topics.includes("DBMS")) ||
          (selectedTopic === "Operating Systems" && p.topics.includes("Operating Systems")) ||
          (selectedTopic === "Computer Networks" && p.topics.includes("Computer Networks")) ||
          (selectedTopic === "OOP" && p.topics.includes("OOP"));

        if (!matchesTopic && !matchesCategory) return false;
      }

      // 3. Search Query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = p.title.toLowerCase().includes(query);
        const matchesTopic = p.topics.some((t) => t.toLowerCase().includes(query));
        const matchesCompany = p.companies?.some((c) => c.toLowerCase().includes(query));
        if (!matchesTitle && !matchesTopic && !matchesCompany) return false;
      }

      // 4. Difficulty
      if (selectedDifficulty !== "All" && p.difficulty !== selectedDifficulty) return false;

      // 5. Company
      if (selectedCompany !== "All" && (!p.companies || !p.companies.includes(selectedCompany)))
        return false;

      // 6. Status
      if (selectedStatus !== "All") {
        const currentStatus = problemStates[p.id]?.status || "Not Started";
        if (currentStatus !== selectedStatus) return false;
      }

      return true;
    });
  }, [
    categoryFilter,
    selectedTopic,
    searchQuery,
    selectedDifficulty,
    selectedCompany,
    selectedStatus,
    problemStates,
  ]);

  // If a problem is clicked, open the 100vw x 100vh Full-Screen IDE workspace
  if (selectedProblem) {
    const currentStatus = problemStates[selectedProblem.id]?.status || "Not Started";
    const currentMastery =
      problemStates[selectedProblem.id]?.mastery || selectedProblem.defaultMastery || 0;

    return (
      <PracticeWorkspace
        problem={selectedProblem}
        onBack={() => setSelectedProblemId(null)}
        userStatus={currentStatus}
        masteryPercentage={currentMastery}
        onStatusChange={handleProblemStatusChange}
      />
    );
  }

  return (
    <div className="space-y-4 text-foreground font-sans max-w-6xl mx-auto pb-12 animate-fade-in">
      {/* ── 1. Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-3 border-b border-border">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-sans">
            Practice
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Practice questions companies actually ask.
          </p>
        </div>

        {/* Search & Theme Toggle */}
        <div className="flex items-center gap-2.5">
          <div className="relative w-72">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search questions, topics, companies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-md bg-card border border-border text-foreground placeholder:text-muted-foreground outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all font-sans"
            />
          </div>

          <button
            onClick={toggleTheme}
            title={theme === "dark" ? "Light Mode" : "Dark Mode"}
            className="p-1.5 rounded-md border border-border bg-card hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
          >
            {theme === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>
        </div>
      </div>

      {/* ── 2. Category Filter Pills ── */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 select-none">
        {(
          [
            { id: "All", label: "All Topics" },
            { id: "DSA", label: "Algorithms & DSA" },
            { id: "SQL", label: "Database & SQL" },
            { id: "Core CS", label: "Core CS" },
            { id: "Frequently Asked", label: "Frequently Asked" },
            { id: "Weak Areas", label: "Weak Areas" },
          ] as { id: CategoryFilter; label: string }[]
        ).map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setCategoryFilter(tab.id);
              setSelectedTopic("All");
            }}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-all ${
              categoryFilter === tab.id
                ? "bg-teal-600 text-white shadow-sm"
                : "text-muted-foreground hover:text-foreground bg-card hover:bg-secondary border border-border"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── 3. Horizontal Topic Navigation with Dynamic Question Counts ── */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none select-none">
        {TOPIC_LIST.map((topic) => {
          const count = topicCounts[topic] || 0;
          const isSelected = selectedTopic === topic;
          return (
            <button
              key={topic}
              onClick={() => setSelectedTopic(topic)}
              className={`px-2.5 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                isSelected
                  ? "bg-teal-500/15 text-teal-600 dark:text-teal-400 border border-teal-500/40 font-semibold"
                  : "bg-card text-muted-foreground hover:text-foreground hover:bg-secondary border border-border"
              }`}
            >
              <span>{topic}</span>
              <span
                className={`text-[11px] font-mono px-1.5 py-0.2 rounded ${
                  isSelected
                    ? "bg-teal-500/20 text-teal-700 dark:text-teal-300 font-bold"
                    : "bg-secondary text-muted-foreground"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── 4. Compact Multi-Filter Toolbar ── */}
      <div className="p-2.5 rounded-lg bg-card border border-border flex flex-wrap items-center gap-3 text-xs">
        {/* Difficulty */}
        <div className="flex items-center gap-1.5">
          <span className="text-muted-foreground font-medium">Difficulty:</span>
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="bg-secondary text-foreground border border-border rounded-md px-2 py-1 outline-none font-medium cursor-pointer"
          >
            <option value="All">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>

        {/* Company Filter */}
        <div className="flex items-center gap-1.5">
          <span className="text-muted-foreground font-medium">Company:</span>
          <select
            value={selectedCompany}
            onChange={(e) => setSelectedCompany(e.target.value)}
            className="bg-secondary text-foreground border border-border rounded-md px-2 py-1 outline-none font-medium cursor-pointer"
          >
            <option value="All">All Companies</option>
            {COMPANIES_LIST.map((comp) => (
              <option key={comp} value={comp}>
                {comp}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1.5">
          <span className="text-muted-foreground font-medium">Status:</span>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-secondary text-foreground border border-border rounded-md px-2 py-1 outline-none font-medium cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="Solved">Solved</option>
            <option value="Attempted">Attempted</option>
            <option value="Not Started">Todo</option>
          </select>
        </div>

        {/* Results Counter */}
        <span className="text-xs text-muted-foreground font-mono ml-auto">
          Showing {filteredProblems.length} questions
        </span>

        {/* Clear Filters */}
        {(selectedDifficulty !== "All" ||
          selectedCompany !== "All" ||
          selectedStatus !== "All" ||
          selectedTopic !== "All" ||
          categoryFilter !== "All" ||
          searchQuery.trim() !== "") && (
          <button
            onClick={() => {
              setSelectedDifficulty("All");
              setSelectedCompany("All");
              setSelectedStatus("All");
              setSelectedTopic("All");
              setCategoryFilter("All");
              setSearchQuery("");
            }}
            className="text-xs text-teal-600 dark:text-teal-400 hover:underline font-medium"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* ── 5. Dense Professional Problem Table ── */}
      <div className="rounded-lg border border-border bg-card overflow-hidden shadow-sm">
        {/* Table Header Row */}
        <div className="grid grid-cols-12 px-4 py-2 border-b border-border bg-secondary/50 text-[11px] font-bold text-muted-foreground uppercase tracking-wider select-none">
          <div className="col-span-1 text-center">Status</div>
          <div className="col-span-6 sm:col-span-5">Title & Topics</div>
          <div className="col-span-2 text-center sm:text-left">Difficulty</div>
          <div className="hidden sm:block sm:col-span-3">Companies</div>
          <div className="col-span-3 sm:col-span-1 text-right">Mastery</div>
        </div>

        {/* Dense Problem Rows */}
        <div className="divide-y divide-border/60">
          {filteredProblems.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground space-y-2">
              <Code2 className="w-8 h-8 mx-auto text-muted-foreground/60" />
              <p className="text-sm font-semibold text-foreground">No matching problems found</p>
              <p className="text-xs">Try selecting another topic or clearing filters.</p>
            </div>
          ) : (
            filteredProblems.map((prob, idx) => {
              const state = problemStates[prob.id] || {
                status: "Not Started",
                mastery: prob.defaultMastery || 0,
              };
              const isSolved = state.status === "Solved";
              const isAttempted = state.status === "Attempted";

              const diffColor =
                prob.difficulty === "Easy"
                  ? "text-emerald-600 dark:text-emerald-400"
                  : prob.difficulty === "Medium"
                  ? "text-amber-600 dark:text-amber-400"
                  : "text-rose-600 dark:text-rose-400";

              return (
                <div
                  key={prob.id}
                  onClick={() => setSelectedProblemId(prob.id)}
                  className={`grid grid-cols-12 px-4 py-2.5 items-center hover:bg-secondary/60 cursor-pointer transition-colors text-sm group ${
                    idx % 2 === 0 ? "bg-transparent" : "bg-secondary/20"
                  }`}
                >
                  {/* Status Indicator */}
                  <div className="col-span-1 flex justify-center">
                    {isSolved ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    ) : isAttempted ? (
                      <CircleDot className="w-4 h-4 text-amber-500" />
                    ) : (
                      <span className="w-1.5 h-1.5 rounded-full bg-border" />
                    )}
                  </div>

                  {/* Title & Topic Badges */}
                  <div className="col-span-6 sm:col-span-5 pr-2">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-foreground group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors text-sm">
                        {idx + 1}. {prob.title}
                      </span>
                      {prob.frequentlyAsked && (
                        <Flame className="w-3.5 h-3.5 text-teal-500 fill-teal-500/20 flex-shrink-0" />
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5 truncate">
                      {prob.topics.join(" · ")}
                    </div>
                  </div>

                  {/* Difficulty */}
                  <div className="col-span-2 text-center sm:text-left">
                    <span className={`text-xs font-bold ${diffColor}`}>
                      {prob.difficulty}
                    </span>
                  </div>

                  {/* Companies */}
                  <div className="hidden sm:block sm:col-span-3 text-xs text-muted-foreground truncate">
                    {prob.companies && prob.companies.length > 0 ? (
                      prob.companies.join(" · ")
                    ) : (
                      <span className="text-muted-foreground/40">—</span>
                    )}
                  </div>

                  {/* Mastery % */}
                  <div className="col-span-3 sm:col-span-1 text-right">
                    <span className="text-xs font-mono font-bold text-foreground">
                      {state.mastery}%
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}