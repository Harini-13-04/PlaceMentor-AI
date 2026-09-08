import React, { useState, useMemo, useRef, useEffect } from "react";
import { PROBLEMS_DATASET, TOP_COMPANIES, Problem, getProblemById } from "@/data/problems";
import PracticeWorkspace from "@/components/practice/PracticeWorkspace";
import { API_URL, getAuthHeaders } from "@/config";
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
  ChevronDown,
  Check,
  AlertTriangle,
  ArrowLeft,
} from "lucide-react";
import { Link, useSearchParams, useParams, useNavigate } from "react-router-dom";

export default function Practice() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { problemId: routeProblemId } = useParams();
  const navigate = useNavigate();
  const [problems, setProblems] = useState<Problem[]>(PROBLEMS_DATASET);

  // Fetch real problem catalog and user status from backend
  const fetchBackendProblems = async () => {
    try {
      const res = await fetch(`${API_URL}/api/problems`, {
        headers: getAuthHeaders(true),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.problems && data.problems.length > 0) {
          // Merge with local dataset to ensure starter codes & metadata are intact
          const backendMap = new Map(data.problems.map((p: any) => [p.id, p]));
          setProblems((prev) =>
            prev.map((p) => {
              const b = backendMap.get(p.id);
              return b
                ? { ...p, status: (b.status || "Not Started") as Problem["status"], attemptsCount: b.attemptsCount || 0 }
                : { ...p, status: "Not Started" as Problem["status"], attemptsCount: 0 };
            })
          );
        }
      }
    } catch (err) {
      console.warn("Using offline problem dataset:", err);
    }
  };

  useEffect(() => {
    fetchBackendProblems();
  }, []);
  
  // Read problem ID from route param or query string if available
  const urlProblemId = routeProblemId || searchParams.get("id") || searchParams.get("problem");
  const [selectedProblemId, setSelectedProblemId] = useState<string | null>(urlProblemId);

  // Sync state if URL changes externally
  useEffect(() => {
    if (urlProblemId && urlProblemId !== selectedProblemId) {
      setSelectedProblemId(urlProblemId);
    }
  }, [urlProblemId]);

  // Bookmarked problems set - initialize empty for fresh user
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTopic, setSelectedTopic] = useState<string>("All Topics");
  const [selectedCompany, setSelectedCompany] = useState<string>("All Companies");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("All Difficulties");
  const [selectedStatus, setSelectedStatus] = useState<string>("All Status");

  // Searchable Company Dropdown state
  const [isCompanyDropdownOpen, setIsCompanyDropdownOpen] = useState(false);
  const [companySearchText, setCompanySearchText] = useState("");
  const companyDropdownRef = useRef<HTMLDivElement>(null);
  const companySearchInputRef = useRef<HTMLInputElement>(null);

  // Close company dropdown on outside click or Escape key
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        companyDropdownRef.current &&
        !companyDropdownRef.current.contains(event.target as Node)
      ) {
        setIsCompanyDropdownOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsCompanyDropdownOpen(false);
      }
    };

    if (isCompanyDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
      setTimeout(() => {
        companySearchInputRef.current?.focus();
      }, 50);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isCompanyDropdownOpen]);

  // Filter company options in real-time as user types
  const filteredCompanyOptions = useMemo(() => {
    const query = companySearchText.trim().toLowerCase();
    if (!query) return TOP_COMPANIES;
    return TOP_COMPANIES.filter((c) => {
      if (c === "All Companies") return true;
      return c.toLowerCase().includes(query);
    });
  }, [companySearchText]);

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
        const pTopic = p.topic.toLowerCase();
        if (selectedTopic === "DP") {
          if (!pTopic.includes("dynamic") && !pTopic.includes("dp")) return false;
        } else if (selectedTopic === "Hash Table") {
          if (!pTopic.includes("hash") && !pTopic.includes("table")) return false;
        } else {
          if (!pTopic.includes(selectedTopic.toLowerCase())) return false;
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
        p.id === problemId
          ? { ...p, status: "Solved" as const, mastery: 100, attemptsCount: (p.attemptsCount || 0) + 1 }
          : p
      )
    );
  };

  const handleProblemAttempted = (problemId: string) => {
    setProblems((prev) =>
      prev.map((p) =>
        p.id === problemId && p.status !== "Solved"
          ? { ...p, status: "Attempted" as const, attemptsCount: (p.attemptsCount || 0) + 1 }
          : p
      )
    );
  };

  const handleSelectProblem = (id: string) => {
    setSelectedProblemId(id);
    setSearchParams({ id });
  };

  const handleBackToList = () => {
    setSelectedProblemId(null);
    setSearchParams({});
    fetchBackendProblems();
    if (routeProblemId) {
      navigate("/practice");
    }
  };

  // Robust problem resolution - Prioritize local problems state as source of truth
  const selectedProblem = useMemo(() => {
    if (!selectedProblemId) return null;
    const normalized = String(selectedProblemId).trim().toLowerCase();
    const localMatch = problems.find(
      (p) => p.id === selectedProblemId || p.id.toLowerCase() === normalized
    );
    if (localMatch) return localMatch;
    return getProblemById(selectedProblemId) || null;
  }, [selectedProblemId, problems]);

  // If problem ID is selected and found, open the Workspace
  if (selectedProblem) {
    return (
      <PracticeWorkspace
        problem={selectedProblem}
        onBackToList={handleBackToList}
        onSelectProblem={handleSelectProblem}
        onProblemSolved={handleProblemSolved}
        onProblemAttempted={handleProblemAttempted}
      />
    );
  }

  // If a problem ID was requested in URL or state but cannot be resolved, display clear, actionable error state
  if (selectedProblemId && !selectedProblem) {
    return (
      <div className="w-full min-h-[60vh] flex flex-col items-center justify-center p-6 text-center space-y-4 font-sans select-none">
        <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-600 dark:text-rose-400 shadow-sm">
          <AlertTriangle className="w-7 h-7" />
        </div>
        <div className="space-y-1.5 max-w-md">
          <h2 className="text-xl font-bold text-foreground">Problem Data Could Not Be Loaded</h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            The problem identifier <code className="px-1.5 py-0.5 rounded bg-secondary text-purple-600 dark:text-purple-400 font-mono font-bold">"{selectedProblemId}"</code> was not found in the practice repository.
          </p>
        </div>
        <button
          onClick={handleBackToList}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-xl border border-border bg-card hover:bg-secondary text-xs font-bold text-foreground transition-all shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Problem List</span>
        </button>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 font-sans text-foreground">
      {/* =========================================================================
          1. PRACTICE HEADER & QUICK STATS (Problem Discovery First)
         ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-500/15 border border-purple-500/25 flex items-center justify-center text-purple-600 dark:text-purple-400 shrink-0">
            <Code2 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">
              Coding Practice
            </h1>
            <p className="text-xs text-muted-foreground">
              Choose a problem and start coding. Solve company-tagged DSA challenges with multi-language starter templates.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="px-3.5 py-1.5 rounded-xl bg-card border border-border text-xs font-semibold flex items-center gap-2 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="text-muted-foreground">Solved:</span>
            <span className="font-bold text-purple-600 dark:text-purple-400 font-mono">
              {problems.filter((p) => p.status === "Solved").length}
            </span>
            <span className="text-muted-foreground font-mono">/ {problems.length}</span>
          </div>
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
          {/* Custom Searchable Company Dropdown */}
          <div className="relative" ref={companyDropdownRef}>
            <button
              type="button"
              onClick={() => setIsCompanyDropdownOpen((prev) => !prev)}
              className="flex items-center gap-2 pl-8 pr-3 py-2 rounded-xl border border-border bg-card text-foreground text-xs font-medium hover:bg-secondary/60 focus:outline-none focus:border-purple-500 shadow-sm transition-all relative"
            >
              <Building2 className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <span>{selectedCompany === "All Companies" ? "Company: All" : selectedCompany}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-muted-foreground transition-transform duration-200 ${isCompanyDropdownOpen ? "rotate-180" : ""}`} />
            </button>

            {isCompanyDropdownOpen && (
              <div className="absolute left-0 mt-1.5 w-64 rounded-xl border border-border bg-card shadow-xl z-30 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-100">
                {/* Search Header */}
                <div className="p-2 border-b border-border bg-secondary/30 relative">
                  <Search className="w-3.5 h-3.5 text-muted-foreground absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    ref={companySearchInputRef}
                    type="text"
                    value={companySearchText}
                    onChange={(e) => setCompanySearchText(e.target.value)}
                    placeholder="Search company..."
                    className="w-full pl-8 pr-2.5 py-1.5 rounded-lg border border-border bg-background text-foreground text-xs placeholder:text-muted-foreground focus:outline-none focus:border-purple-500 transition-all"
                  />
                </div>

                {/* Company List Options with Max-Height & Internal Scroll */}
                <div className="max-h-64 overflow-y-auto p-1 divide-y divide-border/20">
                  {filteredCompanyOptions.length === 0 ? (
                    <div className="py-4 text-center text-muted-foreground text-xs">
                      No companies found
                    </div>
                  ) : (
                    filteredCompanyOptions.map((comp) => {
                      const isSelected = selectedCompany === comp;
                      return (
                        <button
                          key={comp}
                          type="button"
                          onClick={() => {
                            setSelectedCompany(comp);
                            setIsCompanyDropdownOpen(false);
                            setCompanySearchText("");
                          }}
                          className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${
                            isSelected
                              ? "bg-purple-500/15 text-purple-700 dark:text-purple-300 font-semibold"
                              : "text-foreground hover:bg-secondary/70"
                          }`}
                        >
                          <span>{comp === "All Companies" ? "Company: All" : comp}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />}
                        </button>
                      );
                    })
                  )}
                </div>
              </div>
            )}
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
                setCompanySearchText("");
              }}
              className="p-2 rounded-xl border border-border bg-card hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
              title="Reset Filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Solved Counter indicator */}
          <span className="text-xs font-mono font-bold text-muted-foreground ml-1">
            <strong className="text-emerald-600 dark:text-emerald-400">
              {problems.filter((p) => p.status === "Solved").length}
            </strong> / {problems.length} Solved
          </span>
        </div>
      </div>

      {/* =========================================================================
          4. FULL-WIDTH PROBLEM LIST ROWS WITH STABLE CSS GRID ALIGNMENT
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
                setCompanySearchText("");
              }}
              className="text-xs font-semibold text-purple-600 dark:text-purple-400 hover:underline pt-2 inline-block"
            >
              Reset all filters
            </button>
          </div>
        ) : (
          filteredProblems.map((p, idx) => {
            const isBookmarked = bookmarkedIds.has(p.id);
            const acceptanceRate = p.acceptanceRate
              ? p.acceptanceRate.replace("%", "")
              : "51.4";

            return (
              <div
                key={p.id}
                onClick={() => handleSelectProblem(p.id)}
                className="p-4 grid grid-cols-[minmax(0,1fr)_auto] sm:grid-cols-[minmax(0,1fr)_90px_85px_28px] items-center gap-3 sm:gap-4 hover:bg-secondary/40 cursor-pointer transition-all group"
              >
                {/* Column 1: Bookmark, Status Checkmark, Title, Topic & Company Badges */}
                <div className="flex items-center gap-3.5 min-w-0">
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
                      <div
                        className="w-5 h-5 rounded-full bg-amber-500/15 border border-amber-500/40 flex items-center justify-center text-amber-600 dark:text-amber-400"
                        title="Attempted"
                      >
                        <div className="w-2 h-2 rounded-full bg-amber-500" />
                      </div>
                    ) : (
                      <Circle className="w-4 h-4 text-muted-foreground/30" />
                    )}
                  </div>

                  {/* Title, Topic, and Company Tags */}
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap min-w-0">
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

                {/* Column 2: Acceptance % (Strictly fixed right-aligned column on sm+) */}
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-mono font-bold text-foreground">{acceptanceRate}%</p>
                  <p className="text-[10px] text-muted-foreground">Acceptance</p>
                </div>

                {/* Column 3: Difficulty Badge (Strictly aligned column) */}
                <div className="flex justify-end sm:justify-center">
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
                </div>

                {/* Column 4: Lock / Unlock Icon (Strictly aligned column) */}
                <div className="hidden sm:flex justify-center">
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