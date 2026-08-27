import React, { useState, useMemo } from "react";
import { PROBLEMS_DATASET, TOP_COMPANIES, Problem } from "@/data/problems";
import PracticeWorkspace from "@/components/practice/PracticeWorkspace";
import {
  Search,
  CheckCircle2,
  Circle,
  RotateCcw,
  Bookmark,
  BookmarkCheck,
  Lock,
  Unlock,
  Sparkles,
  ArrowRight,
  Compass,
  Filter,
  Building2,
  Code2,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Practice() {
  const [problems, setProblems] = useState<Problem[]>(PROBLEMS_DATASET);
  const [selectedProblemId, setSelectedProblemId] = useState<string | null>(null);

  // Bookmarked problems set
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set(["two-sum"]));

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTopic, setSelectedTopic] = useState<string>("All Topics");
  const [selectedCompany, setSelectedCompany] = useState<string>("All Companies");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("All Difficulties");
  const [selectedStatus, setSelectedStatus] = useState<string>("All Status");

  // Prominent topic pills with counts
  const TOPIC_PILLS = [
    { name: "All Topics", count: 4033 },
    { name: "Arrays", count: 812 },
    { name: "Strings", count: 612 },
    { name: "Hash Table", count: 523 },
    { name: "DP", count: 678 },
    { name: "Greedy", count: 432 },
    { name: "Trees", count: 384 },
    { name: "Graphs", count: 295 },
    { name: "Sorting", count: 210 },
    { name: "Two Pointers", count: 180 },
    { name: "Stack", count: 154 },
    { name: "Linked List", count: 142 },
    { name: "SQL", count: 98 },
  ];

  // Filtered problems list (combining Company, Topic, Difficulty, Status, Search)
  const filteredProblems = useMemo(() => {
    return problems.filter((p) => {
      // 1. Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = p.title.toLowerCase().includes(q);
        const matchesTopic = p.topic.toLowerCase().includes(q);
        const matchesCompany = p.companies?.some((c) => c.toLowerCase().includes(q));
        if (!matchesTitle && !matchesTopic && !matchesCompany) return false;
      }

      // 2. Company filter
      if (selectedCompany !== "All Companies") {
        const hasCompany = p.companies?.some(
          (c) => c.toLowerCase() === selectedCompany.toLowerCase()
        );
        if (!hasCompany) return false;
      }

      // 3. Topic filter
      if (selectedTopic !== "All Topics") {
        if (selectedTopic === "DP" && !p.topic.toLowerCase().includes("dynamic") && !p.topic.toLowerCase().includes("dp")) return false;
        else if (selectedTopic === "Hash Table" && !p.topic.toLowerCase().includes("hash") && !p.topic.toLowerCase().includes("array")) return false;
        else if (selectedTopic !== "DP" && selectedTopic !== "Hash Table" && !p.topic.toLowerCase().includes(selectedTopic.toLowerCase())) {
          return false;
        }
      }

      // 4. Difficulty filter
      if (selectedDifficulty !== "All Difficulties" && p.difficulty !== selectedDifficulty) {
        return false;
      }

      // 5. Status filter
      if (selectedStatus !== "All Status" && p.status !== selectedStatus) {
        return false;
      }

      return true;
    });
  }, [problems, searchQuery, selectedCompany, selectedTopic, selectedDifficulty, selectedStatus]);

  const toggleBookmark = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setBookmarkedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

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
    <div className="w-full space-y-6 font-sans text-foreground">
      {/* =========================================================================
          1. TOP HERO SECTION & PLACEMENT ROADMAP (Full Width Layout)
         ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Main Hero Card */}
        <div className="lg:col-span-8 p-6 sm:p-7 rounded-2xl border border-purple-500/25 bg-gradient-to-br from-purple-500/10 via-card to-card dark:from-purple-950/40 dark:via-secondary dark:to-card shadow-sm relative overflow-hidden flex flex-col justify-between">
          <div className="space-y-2.5 relative z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-700 dark:text-purple-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Campus Coding Arena</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground font-display">
              Level up your skills.
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground font-medium max-w-lg leading-relaxed">
              Crack placements with confidence. Solve company-tagged algorithms & data structure challenges with multi-language starter templates.
            </p>
          </div>

          <div className="pt-6 relative z-10">
            <button
              onClick={() => setSelectedProblemId(problems[0]?.id || "two-sum")}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white shadow-md transition-all pm-btn-gradient"
            >
              <span>Start Practicing</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Placement Roadmap Milestone Card */}
        <div className="lg:col-span-4 p-5 rounded-2xl border border-border bg-card shadow-sm flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-600 dark:text-purple-400 text-xs">
                <Compass className="w-3.5 h-3.5" />
              </span>
              <h3 className="text-xs font-bold text-foreground">Placement Roadmap</h3>
            </div>
            <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">23 days left</span>
          </div>

          <div className="space-y-2">
            <p className="text-[11px] text-muted-foreground uppercase font-bold tracking-wider">Your next milestone</p>
            <div className="flex items-center gap-2 text-xs font-bold text-foreground">
              <span className="text-amber-500 dark:text-amber-400">⚡</span>
              <span>Aptitude Mock Test</span>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1 pt-1">
              <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-amber-500 to-purple-600 rounded-full" style={{ width: "40%" }} />
              </div>
            </div>
          </div>

          <Link
            to="/placement-readiness"
            className="w-full py-2 px-3 rounded-xl border border-purple-500/30 bg-purple-500/10 hover:bg-purple-500/20 text-purple-700 dark:text-purple-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
          >
            <span>Continue Roadmap</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* =========================================================================
          2. HORIZONTAL TOPIC PILLS
         ========================================================================= */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none select-none">
        {TOPIC_PILLS.map((topic) => {
          const isSelected = selectedTopic === topic.name;
          return (
            <button
              key={topic.name}
              onClick={() => setSelectedTopic(topic.name)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                isSelected
                  ? "bg-purple-600 text-white shadow-sm shadow-purple-600/30 border border-purple-500"
                  : "border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              <span>{topic.name}</span>
              {topic.name !== "All Topics" && (
                <span className={`text-[10px] font-mono ${isSelected ? "text-purple-100" : "text-muted-foreground opacity-80"}`}>
                  {topic.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* =========================================================================
          3. SEARCH & COMPREHENSIVE FILTER TOOLBAR (Including Company Filtering)
         ========================================================================= */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions by title, topic, or company (e.g. TCS, Two Sum)..."
            className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-border bg-card text-foreground text-xs placeholder:text-muted-foreground focus:outline-none focus:border-purple-500 transition-all shadow-sm"
          />
        </div>

        <div className="flex items-center flex-wrap gap-2">
          {/* Company Filter Dropdown */}
          <div className="relative">
            <select
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
              className="pl-8 pr-3 py-2 rounded-xl border border-border bg-card text-foreground text-xs font-medium focus:outline-none focus:border-purple-500 cursor-pointer shadow-sm"
            >
              {TOP_COMPANIES.map((c) => (
                <option key={c} value={c}>
                  {c === "All Companies" ? "Company: All" : c}
                </option>
              ))}
            </select>
            <Building2 className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Difficulty Filter Dropdown */}
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="px-3 py-2 rounded-xl border border-border bg-card text-foreground text-xs font-medium focus:outline-none focus:border-purple-500 cursor-pointer shadow-sm"
          >
            <option value="All Difficulties">Difficulty</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>

          {/* Status Filter Dropdown */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 rounded-xl border border-border bg-card text-foreground text-xs font-medium focus:outline-none focus:border-purple-500 cursor-pointer shadow-sm"
          >
            <option value="All Status">Status</option>
            <option value="Solved">Solved</option>
            <option value="Attempted">Attempted</option>
            <option value="Not Started">Todo</option>
          </select>

          {/* Filter Reset Button */}
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
              }}
              className="p-2 rounded-xl border border-border bg-card hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
              title="Reset Filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Solved Counter indicator */}
          <span className="text-xs font-mono font-bold text-muted-foreground ml-1">
            <strong className="text-emerald-600 dark:text-emerald-400">40</strong> / 4033 Solved
          </span>
        </div>
      </div>

      {/* =========================================================================
          4. FULL-WIDTH PROBLEM LIST ROWS WITH COMPANY TAGS
         ========================================================================= */}
      <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden divide-y divide-border/60">
        {filteredProblems.length === 0 ? (
          <div className="py-16 text-center text-muted-foreground space-y-2">
            <Code2 className="w-9 h-9 mx-auto text-muted-foreground/40" />
            <p className="text-xs font-bold text-foreground">No problems match your current filters.</p>
            <p className="text-[11px] text-muted-foreground">Try clearing your company or topic selection to view more problems.</p>
            <button
              onClick={() => {
                setSelectedDifficulty("All Difficulties");
                setSelectedCompany("All Companies");
                setSelectedStatus("All Status");
                setSelectedTopic("All Topics");
                setSearchQuery("");
              }}
              className="text-xs font-semibold text-purple-600 dark:text-purple-400 hover:underline pt-2 inline-block"
            >
              Reset all filters
            </button>
          </div>
        ) : (
          filteredProblems.map((p, idx) => {
            const isBookmarked = bookmarkedIds.has(p.id);
            const acceptanceRate = (54 + (idx * 3.7) % 24).toFixed(1);

            return (
              <div
                key={p.id}
                onClick={() => setSelectedProblemId(p.id)}
                className="p-4 flex items-center justify-between gap-4 hover:bg-secondary/40 cursor-pointer transition-all group"
              >
                {/* Left: Bookmark, Status Checkmark, Title, Topic & Company Badges */}
                <div className="flex items-center gap-3.5 min-w-0 flex-1">
                  <button
                    onClick={(e) => toggleBookmark(e, p.id)}
                    className="text-muted-foreground hover:text-purple-600 dark:hover:text-purple-400 transition-colors p-1 shrink-0"
                    title={isBookmarked ? "Remove Bookmark" : "Bookmark Problem"}
                  >
                    {isBookmarked ? (
                      <BookmarkCheck className="w-4 h-4 text-purple-600 dark:text-purple-400 fill-purple-500/20" />
                    ) : (
                      <Bookmark className="w-4 h-4 text-muted-foreground/60" />
                    )}
                  </button>

                  {/* Solved Status Circle / Checkmark */}
                  <div className="shrink-0">
                    {p.status === "Solved" ? (
                      <div className="w-5 h-5 rounded-full bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                    ) : p.status === "Attempted" ? (
                      <div className="w-5 h-5 rounded-full border-2 border-amber-500 border-t-transparent animate-spin" />
                    ) : (
                      <Circle className="w-4 h-4 text-muted-foreground/30" />
                    )}
                  </div>

                  {/* Title, Topic, and Company Tags */}
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-xs sm:text-sm font-bold text-foreground group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors truncate">
                        {idx + 1}. {p.title}
                      </h4>
                      <span className="text-[11px] text-muted-foreground hidden sm:inline">&bull;</span>
                      <span className="text-[11px] text-muted-foreground font-medium hidden sm:inline">
                        {p.topic}
                      </span>
                    </div>

                    {/* Company Tag Badges */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {p.companies?.slice(0, 4).map((comp) => (
                        <span
                          key={comp}
                          className="px-1.5 py-0.2 rounded text-[10px] font-medium bg-secondary border border-border text-purple-700 dark:text-purple-300"
                        >
                          {comp}
                        </span>
                      ))}
                      {(p.companies?.length || 0) > 4 && (
                        <span className="text-[10px] text-muted-foreground font-mono">
                          +{(p.companies?.length || 0) - 4} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Acceptance, Difficulty, Lock */}
                <div className="flex items-center gap-4 sm:gap-6 shrink-0">
                  {/* Acceptance % */}
                  <div className="text-right hidden sm:block">
                    <p className="text-xs font-mono font-bold text-foreground">{acceptanceRate}%</p>
                    <p className="text-[10px] text-muted-foreground">Acceptance</p>
                  </div>

                  {/* Difficulty Badge */}
                  <span
                    className={`px-2.5 py-0.5 rounded-md text-[11px] font-semibold border ${
                      p.difficulty === "Easy"
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                        : p.difficulty === "Medium"
                        ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                        : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20"
                    }`}
                  >
                    {p.difficulty}
                  </span>

                  {/* Lock / Unlock Icon */}
                  <Unlock className="w-4 h-4 text-muted-foreground/40 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors" />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}