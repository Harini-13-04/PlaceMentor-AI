import React, { useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import ProfileMenu from "./ProfileMenu";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import {
  Home,
  Code2,
  Calculator,
  MessageSquare,
  FileText,
  BarChart3,
  BrainCircuit,
  HelpCircle,
  Search,
  Flame,
  Crown,
  Bell,
  Sun,
  Moon,
  PanelLeftClose,
  PanelLeftOpen,
  Sparkles,
  ArrowRight,
  X,
  Target,
} from "lucide-react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Navigation order specified in prompt
  const navItems = [
    { name: "Home", path: "/home", icon: Home },
    { name: "Practice", path: "/practice", icon: Code2 },
    { name: "Aptitude", path: "/aptitude", icon: Calculator },
    { name: "Communication", path: "/communication", icon: MessageSquare },
    { name: "Resume", path: "/resume", icon: FileText },
    { name: "Readiness", path: "/placement-readiness", icon: BarChart3 },
    { name: "Brain Zone", path: "/brain-zone", icon: BrainCircuit },
    { name: "Quizee", path: "/quizee", icon: HelpCircle },
  ];

  // Global search keyboard shortcut listener ("/")
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "/" && !["INPUT", "TEXTAREA"].includes((e.target as HTMLElement).tagName)) {
        e.preventDefault();
        setIsSearchOpen(true);
      } else if (e.key === "Escape") {
        setIsSearchOpen(false);
        setIsNotificationsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const searchResults = [
    { title: "Two Sum", category: "Practice • Arrays", path: "/practice" },
    { title: "Time & Work Shortcuts", category: "Aptitude • Quantitative", path: "/aptitude" },
    { title: "STAR Method Practice", category: "Communication • Behavioral", path: "/communication" },
    { title: "ATS Resume Scanner", category: "Resume • ATS Optimization", path: "/resume" },
    { title: "Placement Readiness 7-Stage Roadmap", category: "Readiness • Benchmark", path: "/placement-readiness" },
    { title: "Sudoku Grid Cognitive Training", category: "Brain Zone • Logic", path: "/brain-zone" },
    { title: "CS Fundamentals 5-Minute Quiz", category: "Quizee • Core CS", path: "/quizee" },
  ].filter((r) =>
    r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen w-screen bg-background text-foreground overflow-hidden font-sans selection:bg-purple-500/20 selection:text-purple-400">
      {/* 1. Global Leftmost Sidebar */}
      <aside
        style={{ width: isSidebarCollapsed ? "68px" : "240px" }}
        className="border-r border-border bg-card flex flex-col z-20 shrink-0 transition-all duration-200 select-none relative shadow-sm"
      >
        {/* Brand Header */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-border">
          {!isSidebarCollapsed ? (
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-white font-bold text-sm shadow-md shrink-0">
                P
              </div>
              <div className="min-w-0">
                <span className="font-extrabold text-sm tracking-tight text-foreground flex items-center gap-1 truncate font-display">
                  PlaceMentor <span className="text-purple-600 dark:text-purple-400">AI</span>
                </span>
                <p className="text-[10px] text-muted-foreground truncate leading-tight font-medium">Your Placement Partner</p>
              </div>
            </div>
          ) : (
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-white font-bold text-sm shadow-md mx-auto">
              P
            </div>
          )}

          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
          >
            {isSidebarCollapsed ? (
              <PanelLeftOpen className="w-4 h-4" />
            ) : (
              <PanelLeftClose className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Navigation Items (Exact 8 items) */}
        <nav className="flex-1 overflow-y-auto p-2.5 space-y-1 scrollbar-none">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              title={isSidebarCollapsed ? item.name : undefined}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-purple-600 text-white shadow-sm shadow-purple-600/30"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                } ${isSidebarCollapsed ? "justify-center px-0" : ""}`
              }
            >
              <item.icon className="w-4 h-4 shrink-0" />
              {!isSidebarCollapsed && <span className="truncate">{item.name}</span>}
            </NavLink>
          ))}

          {/* MY PROGRESS Circular Gauge Widget on Sidebar */}
          {!isSidebarCollapsed && (
            <div className="pt-4 px-1 pb-2">
              <div className="p-3.5 rounded-xl border border-border bg-secondary/50 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">My Progress</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-semibold border border-emerald-500/25">Tier-1</span>
                </div>

                {/* Circular Gauge */}
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
                    <svg className="w-12 h-12 -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="text-border"
                        strokeWidth="3.5"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className="text-purple-600 dark:text-purple-500"
                        strokeDasharray="78, 100"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <div className="absolute text-center leading-none">
                      <span className="text-xs font-mono font-bold text-foreground">78%</span>
                    </div>
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs font-bold text-foreground truncate">Readiness Score</p>
                    <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">Good Progress</p>
                  </div>
                </div>

                <NavLink
                  to="/placement-readiness"
                  className="w-full py-1.5 px-2.5 rounded-lg border border-border bg-card hover:bg-secondary text-[11px] font-semibold text-purple-700 dark:text-purple-300 flex items-center justify-center gap-1 transition-all"
                >
                  <span>View Full Progress</span>
                  <ArrowRight className="w-3 h-3" />
                </NavLink>
              </div>
            </div>
          )}
        </nav>

        {/* Sidebar Footer User Card */}
        <div className="p-3 border-t border-border">
          <NavLink
            to="/profile"
            title={isSidebarCollapsed ? user?.name || "Student Profile" : undefined}
            className={`flex items-center gap-3 p-2 rounded-xl hover:bg-secondary transition-colors ${
              isSidebarCollapsed ? "justify-center px-0" : ""
            }`}
          >
            <img
              src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"}
              alt="User"
              className="w-8 h-8 rounded-full border border-purple-500/40 object-cover shrink-0"
            />
            {!isSidebarCollapsed && (
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-foreground truncate">{user?.name || "Harini Muthuvel"}</p>
                <p className="text-[10px] text-muted-foreground truncate">{user?.department || "B.Tech CSE"}</p>
              </div>
            )}
          </NavLink>
        </div>
      </aside>

      {/* 2. Main Content Viewport Container */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-background">
        {/* Top Header Bar */}
        <header className="h-16 border-b border-border bg-card/90 backdrop-blur-md sticky top-0 z-10 shrink-0">
          <div className="h-full flex justify-between items-center px-4 sm:px-6 gap-4">
            {/* Global Search Bar with "/" shortcut */}
            <div className="flex-1 max-w-md relative">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="w-full pl-9 pr-8 py-2 rounded-xl border border-border bg-secondary/60 hover:bg-secondary text-left text-xs text-muted-foreground transition-all flex items-center justify-between shadow-sm cursor-text"
              >
                <div className="flex items-center gap-2">
                  <Search className="w-3.5 h-3.5 text-muted-foreground" />
                  <span>Search problems, topics, questions...</span>
                </div>
                <kbd className="px-1.5 py-0.5 text-[10px] font-mono font-bold bg-card border border-border rounded text-muted-foreground">
                  /
                </kbd>
              </button>
            </div>

            {/* Top Bar Indicators: Streak, Points, Notifications & Profile */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Daily Streak Indicator */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold font-mono">
                <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500 animate-pulse" />
                <span className="hidden sm:inline">12 Day Streak</span>
                <span className="sm:hidden">12d</span>
              </div>

              {/* Points Indicator */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-purple-500/30 bg-purple-500/10 text-purple-700 dark:text-purple-300 text-xs font-bold font-mono">
                <Crown className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
                <span className="hidden sm:inline">1820 Points</span>
                <span className="sm:hidden">1820</span>
              </div>

              {/* Notifications Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                  aria-label="Notifications"
                  className="p-2 rounded-xl border border-border bg-secondary/60 hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors relative"
                >
                  <Bell className="w-4 h-4" />
                  <span className="w-2 h-2 rounded-full bg-purple-500 absolute top-1.5 right-1.5 ring-2 ring-card" />
                </button>

                {isNotificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-border bg-card p-3 shadow-xl z-50 space-y-2">
                    <div className="flex items-center justify-between pb-2 border-b border-border">
                      <span className="text-xs font-bold text-foreground">Notifications</span>
                      <span className="text-[10px] text-purple-600 dark:text-purple-400 cursor-pointer hover:underline">Mark all read</span>
                    </div>
                    <div className="space-y-2 text-xs">
                      <div className="p-2.5 rounded-xl bg-secondary/50 space-y-0.5">
                        <p className="font-semibold text-foreground">🎯 Today's Challenge Ready</p>
                        <p className="text-[11px] text-muted-foreground">Data Interpretation challenge is waiting for your submission.</p>
                      </div>
                      <div className="p-2.5 rounded-xl bg-secondary/50 space-y-0.5">
                        <p className="font-semibold text-foreground">🔥 Streak Protected</p>
                        <p className="text-[11px] text-muted-foreground">You reached Day 12 streak! +50 bonus XP added.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Theme Toggle Button */}
              <button
                onClick={toggleTheme}
                aria-label="Toggle theme"
                title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
                className="p-2 rounded-xl border border-border bg-secondary/60 hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                {theme === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-purple-600" />}
              </button>

              {/* Profile Menu Dropdown */}
              <ProfileMenu />
            </div>
          </div>
        </header>

        {/* Page Viewport Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="w-full pb-12">
            {children}
          </div>
        </main>
      </div>

      {/* =========================================================================
          GLOBAL SEARCH MODAL
         ========================================================================= */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-20 p-4">
          <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-4 space-y-4 shadow-2xl">
            <div className="flex items-center gap-2.5 border-b border-border pb-3">
              <Search className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
              <input
                autoFocus
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search across Practice, Aptitude, Quizee, Brain Zone..."
                className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
              />
              <button
                onClick={() => setIsSearchOpen(false)}
                className="p-1 rounded-lg text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1 max-h-64 overflow-y-auto">
              {searchResults.length === 0 ? (
                <p className="text-xs text-center text-muted-foreground py-6">No matching questions or topics found.</p>
              ) : (
                searchResults.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setIsSearchOpen(false);
                      navigate(item.path);
                    }}
                    className="w-full p-2.5 rounded-xl hover:bg-secondary flex items-center justify-between text-left text-xs group transition-colors"
                  >
                    <div>
                      <p className="font-semibold text-foreground group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                        {item.title}
                      </p>
                      <p className="text-[10px] text-muted-foreground">{item.category}</p>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors" />
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}