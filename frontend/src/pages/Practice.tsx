import { useState, useMemo } from "react";
import { PROBLEMS_DATASET, Problem } from "@/data/problems";
import PracticeWorkspace from "@/components/practice/PracticeWorkspace";
import {
  Search,
  CheckCircle2,
  Circle,
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

type CategoryFilter =
  | "All"
  | "Frequently Asked"
  | "Recommended"
  | "Weak Areas"
  | "Algorithms & DSA"
  | "Database & SQL"
  | "Core CS"
  | "Companies";

const CATEGORIES: CategoryFilter[] = [
  "All",
  "Frequently Asked",
  "Recommended",
  "Weak Areas",
  "Algorithms & DSA",
  "Database & SQL",
  "Core CS",
  "Companies",
];

const COMPANIES_LIST = [
  "All Companies",
  "Amazon",
  "Google",
  "Microsoft",
  "Facebook",
  "Apple",
  "TCS",
  "Infosys",
  "Accenture",
  "Adobe",
  "Bloomberg",
];

export default function Practice() {
  const [problems, setProblems] = useState<Problem[]>(PROBLEMS_DATASET);
  const [selectedProblemId, setSelectedProblemId] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("All");
  const [selectedTopic, setSelectedTopic] = useState<string>("All Topics");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("All Difficulties");
  const [selectedCompany, setSelectedCompany] = useState<string>("All Companies");
  const [selectedStatus, setSelectedStatus] = useState<string>("All Status");

  // Dynamically calculate topic counts from the actual dataset
  const topicCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    PROBLEMS_DATASET.forEach((p) => {
      counts[p.topic] = (counts[p.topic] || 0) + 1;
    });
    return counts;
  }, []);

  const uniqueTopics = useMemo(() => {
    return Object.keys(topicCounts).sort();
  }, [topicCounts]);

  // Filtered problems list
  const filteredProblems = useMemo(() => {
    return problems.filter((p) => {
      // 1. Search filter (title, topic, or companies)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = p.title.toLowerCase().includes(q);
        const matchesTopic = p.topic.toLowerCase().includes(q);
        const matchesCompany = p.companies.some((c) => c.toLowerCase().includes(q));
        if (!matchesTitle && !matchesTopic && !matchesCompany) return false;
      }

      // 2. Category filter
      if (activeCategory === "Frequently Asked") {
        if (p.companies.length < 3) return false;
      } else if (activeCategory === "Recommended") {
        if (p.difficulty === "Hard" || p.status === "Solved") return false;
      } else if (activeCategory === "Weak Areas") {
        if (p.status !== "Attempted") return false;
      } else if (activeCategory === "Algorithms & DSA") {
        if (p.category !== "Algorithms & DSA") return false;
      } else if (activeCategory === "Database & SQL") {
        if (p.category !== "Database & SQL") return false;
      } else if (activeCategory === "Core CS") {
        if (p.category !== "Core CS") return false;
      } else if (activeCategory === "Companies") {
        if (selectedCompany === "All Companies" && p.companies.length === 0) return false;
      }

      // 3. Topic filter (horizontal buttons)
      if (selectedTopic !== "All Topics" && p.topic !== selectedTopic) {
        return false;
      }

      // 4. Difficulty filter
      if (selectedDifficulty !== "All Difficulties" && p.difficulty !== selectedDifficulty) {
        return false;
      }

      // 5. Company filter
      if (selectedCompany !== "All Companies" && !p.companies.includes(selectedCompany)) {
        return false;
      }

      // 6. Status filter
      if (selectedStatus !== "All Status" && p.status !== selectedStatus) {
        return false;
      }

      return true;
    });
  }, [
    problems,
    searchQuery,
    activeCategory,
    selectedTopic,
    selectedDifficulty,
    selectedCompany,
    selectedStatus,
  ]);

  const handleProblemSolved = (problemId: string) => {
    setProblems((prev) =>
      prev.map((p) =>
        p.id === problemId ? { ...p, status: "Solved" as const, mastery: 100 } : p
      )
    );
  };

  const selectedProblem = problems.find((p) => p.id === selectedProblemId);

  // If a problem is selected, open the 100vw x 100vh Fullscreen Workspace
  if (selectedProblem) {
    return (
      <PracticeWorkspace
        problem={selectedProblem}
        onBackToList={() => setSelectedProblemId(null)}
        onProblemSolved={handleProblemSolved}
      />
    );
  }

  return (
    <div className="space-y-5 font-sans text-foreground">
      {/* 1. Header & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Practice</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Practice the questions companies actually ask.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search problems, topics, or companies..."
            className="w-full pl-9 pr-3.5 py-2 rounded-lg border border-border bg-card text-foreground text-xs placeholder:text-muted-foreground focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all shadow-sm"
          />
        </div>
      </div>

      {/* 2. Horizontal Category Navigation Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setActiveCategory(cat);
              if (cat === "All") {
                setSelectedTopic("All Topics");
              }
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              activeCategory === cat
                ? "bg-teal-600 text-white shadow-sm"
                : "border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-secondary"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 3. Horizontal TOPIC Navigation with Dynamic Counts (NO DROPDOWN) */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedTopic("All Topics")}
            className={`px-3 py-1 rounded-md text-xs font-semibold whitespace-nowrap transition-all border ${
              selectedTopic === "All Topics"
                ? "border-teal-500 bg-teal-500/15 text-teal-600 dark:text-teal-400 font-bold"
                : "border-border bg-secondary/50 text-muted-foreground hover:text-foreground hover:bg-secondary"
            }`}
          >
            All Topics ({PROBLEMS_DATASET.length})
          </button>

          {uniqueTopics.map((topicName) => (
            <button
              key={topicName}
              onClick={() => setSelectedTopic(topicName)}
              className={`px-3 py-1 rounded-md text-xs font-medium whitespace-nowrap transition-all border flex items-center gap-1.5 ${
                selectedTopic === topicName
                  ? "border-teal-500 bg-teal-500/15 text-teal-600 dark:text-teal-400 font-bold"
                  : "border-border bg-secondary/50 text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              <span>{topicName}</span>
              <span className="text-[10px] font-mono opacity-80">{topicCounts[topicName]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 4. Compact Filter Bar */}
      <div className="flex items-center justify-between flex-wrap gap-2.5 p-3 rounded-xl border border-border bg-card shadow-sm text-xs">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Difficulty Filter */}
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-border bg-secondary/60 text-foreground text-xs font-medium focus:outline-none focus:border-teal-500 cursor-pointer"
          >
            <option value="All Difficulties">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>

          {/* Company Filter */}
          <select
            value={selectedCompany}
            onChange={(e) => setSelectedCompany(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-border bg-secondary/60 text-foreground text-xs font-medium focus:outline-none focus:border-teal-500 cursor-pointer"
          >
            {COMPANIES_LIST.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-border bg-secondary/60 text-foreground text-xs font-medium focus:outline-none focus:border-teal-500 cursor-pointer"
          >
            <option value="All Status">All Status</option>
            <option value="Solved">Solved</option>
            <option value="Attempted">Attempted</option>
            <option value="Not Started">Not Started</option>
          </select>

          {(selectedDifficulty !== "All Difficulties" ||
            selectedCompany !== "All Companies" ||
            selectedStatus !== "All Status" ||
            selectedTopic !== "All Topics" ||
            searchQuery.trim() !== "") && (
            <button
              onClick={() => {
                setSelectedDifficulty("All Difficulties");
                setSelectedCompany("All Companies");
                setSelectedStatus("All Status");
                setSelectedTopic("All Topics");
                setSearchQuery("");
                setActiveCategory("All");
              }}
              className="text-[11px] text-muted-foreground hover:text-teal-600 dark:hover:text-teal-400 flex items-center gap-1 font-medium transition-colors"
            >
              <RotateCcw className="w-3 h-3" /> Reset Filters
            </button>
          )}
        </div>

        <div className="text-xs text-muted-foreground font-mono">
          Showing <span className="font-bold text-foreground">{filteredProblems.length}</span> questions
        </div>
      </div>

      {/* 5. Dense Problem List Table */}
      <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-border bg-secondary/40 text-muted-foreground uppercase text-[11px] font-semibold tracking-wider">
                <th className="py-3 px-4 w-12 text-center">Status</th>
                <th className="py-3 px-4">Problem Title & Topics</th>
                <th className="py-3 px-4 w-28">Difficulty</th>
                <th className="py-3 px-4 hidden md:table-cell">Companies</th>
                <th className="py-3 px-4 w-24 text-right">Mastery</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredProblems.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-muted-foreground">
                    <p className="text-xs font-medium">No problems match the selected filters.</p>
                    <button
                      onClick={() => {
                        setSelectedDifficulty("All Difficulties");
                        setSelectedCompany("All Companies");
                        setSelectedStatus("All Status");
                        setSelectedTopic("All Topics");
                        setSearchQuery("");
                      }}
                      className="mt-2 text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline"
                    >
                      Clear all filters
                    </button>
                  </td>
                </tr>
              ) : (
                filteredProblems.map((p, idx) => (
                  <tr
                    key={p.id}
                    onClick={() => setSelectedProblemId(p.id)}
                    className="hover:bg-secondary/40 transition-colors cursor-pointer group"
                  >
                    {/* Status Column */}
                    <td className="py-3 px-4 text-center">
                      {p.status === "Solved" ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 mx-auto" />
                      ) : p.status === "Attempted" ? (
                        <div className="w-3.5 h-3.5 rounded-full border-2 border-amber-500 border-t-transparent animate-spin mx-auto" />
                      ) : (
                        <Circle className="w-3.5 h-3.5 text-muted-foreground/40 mx-auto" />
                      )}
                    </td>

                    {/* Title & Topic */}
                    <td className="py-3 px-4">
                      <div className="space-y-0.5">
                        <div className="font-semibold text-foreground text-xs group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors flex items-center gap-1.5">
                          <span>
                            {idx + 1}. {p.title}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                          <span className="px-1.5 py-0.2 rounded bg-secondary border border-border text-foreground font-medium">
                            {p.topic}
                          </span>
                          <span className="hidden sm:inline">&bull;</span>
                          <span className="hidden sm:inline text-muted-foreground">{p.category}</span>
                        </div>
                      </div>
                    </td>

                    {/* Difficulty */}
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold border ${
                          p.difficulty === "Easy"
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                            : p.difficulty === "Medium"
                            ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                            : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20"
                        }`}
                      >
                        {p.difficulty}
                      </span>
                    </td>

                    {/* Companies */}
                    <td className="py-3 px-4 hidden md:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {p.companies.slice(0, 3).map((comp) => (
                          <span
                            key={comp}
                            className="px-1.5 py-0.5 rounded bg-secondary border border-border text-[10px] text-muted-foreground"
                          >
                            {comp}
                          </span>
                        ))}
                        {p.companies.length > 3 && (
                          <span className="text-[10px] text-muted-foreground font-mono self-center">
                            +{p.companies.length - 3}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Mastery % */}
                    <td className="py-3 px-4 text-right font-mono text-xs">
                      <span
                        className={
                          p.mastery === 100
                            ? "text-emerald-600 dark:text-emerald-400 font-bold"
                            : p.mastery > 0
                            ? "text-amber-500 font-semibold"
                            : "text-muted-foreground"
                        }
                      >
                        {p.mastery}%
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
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