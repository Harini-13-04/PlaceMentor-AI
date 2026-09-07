import React, { useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import ProfileMenu from "./ProfileMenu";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { API_URL, getAuthHeaders, getAuthToken } from "@/config";
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
  Menu,
} from "lucide-react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  
  // Real stats
  const [userStats, setUserStats] = useState({ streak: 0, points: 0 });
  const [readinessScore, setReadinessScore] = useState<number | null>(null);
  const [readinessStatus, setReadinessStatus] = useState<string>("In Progress");

  const location = useLocation();
  const navigate = useNavigate();

  // Navigation order matching reference
  const navItems = [
    { name: "Home", path: "/home", icon: Home },
    { name: "Practice", path: "/practice", icon: Code2 },
    { name: "Aptitude", path: "/aptitude", icon: Calculator },
    { name: "Communication", path: "/communication", icon: MessageSquare },
    { name: "Resume", path: "/resume", icon: FileText },
    { name: "Readiness", path: "/placement-readiness", icon: BarChart3 },
    { name: "BrainZone", path: "/brain-zone", icon: BrainCircuit },
    { name: "Quizee", path: "/quizee", icon: HelpCircle },
    { name: "Recommendations", path: "/recommendations", icon: Target },
  ];

  // Check onboarding status and fetch real user stats on mount
  useEffect(() => {
    const fetchStatusAndStats = async () => {
      try {
        const token = getAuthToken();
        if (!token) return;

        // 1. Check Onboarding — if not completed, navigate to full-screen /onboarding
        const onbRes = await fetch(`${API_URL}/api/onboarding/status`, {
          headers: getAuthHeaders(true),
        });
        if (onbRes.ok) {
          const onbData = await onbRes.json();
          if (!onbData.onboarding_completed && location.pathname !== "/onboarding") {
            navigate("/onboarding", { replace: true });
            return;
          }
        }

        // 2. Fetch real Brain Zone XP / stats
        const bzRes = await fetch(`${API_URL}/api/brainzone/progress`, {
          headers: getAuthHeaders(true),
        });
        if (bzRes.ok) {
          const bzData = await bzRes.json();
          setUserStats({
            streak: bzData.streak_days || 0,
            points: bzData.xp || 0,
          });
        }

        // 3. Fetch real Readiness Score
        const readRes = await fetch(`${API_URL}/api/readiness`, {
          headers: getAuthHeaders(true),
        });
        if (readRes.ok) {
          const readData = await readRes.json();
          if (readData.has_sufficient_data) {
            setReadinessScore(readData.overall_readiness);
            setReadinessStatus(
              readData.overall_readiness >= 75
                ? "Good Progress"
                : readData.overall_readiness >= 40
                ? "In Progress"
                : "Needs Practice"
            );
          }
        }
      } catch (err) {
        console.error("Error loading user layout stats:", err);
      }
    };

    fetchStatusAndStats();
  }, [user, location.pathname]);


  // Close mobile drawer on route change
  useEffect(() => {
    setIsMobileDrawerOpen(false);
  }, [location.pathname]);

  // Global search keyboard shortcut ("/")
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "/" && !["INPUT", "TEXTAREA"].includes((e.target as HTMLElement).tagName)) {
        e.preventDefault();
        setIsSearchOpen(true);
      } else if (e.key === "Escape") {
        setIsSearchOpen(false);
        setIsNotificationsOpen(false);
        setIsMobileDrawerOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const searchResults = [
    { title: "Two Sum", category: "Practice • Arrays", path: "/practice/two-sum" },
    { title: "AI Placement Mentor & RAG", category: "AI Mentor • Live Coaching", path: "/ai-mentor" },
    { title: "Personalized Recommendations", category: "Recommendations • Action Items", path: "/recommendations" },
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
      {/* 1. Desktop Leftmost Sidebar (Hidden on Mobile < md) */}
      <aside
        style={{ width: isSidebarCollapsed ? "68px" : "240px" }}
        className="hidden md:flex border-r border-border bg-card flex-col z-20 shrink-0 transition-all duration-200 select-none relative shadow-sm"
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

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || location.pathname.startsWith(`${item.path}/`);

            return (
              <NavLink
                key={item.path}
                to={item.path}
                title={isSidebarCollapsed ? item.name : undefined}
                className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all group ${
                  isActive
                    ? "bg-purple-500/15 text-purple-700 dark:text-purple-300 font-bold shadow-sm border border-purple-500/25"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                } ${isSidebarCollapsed ? "justify-center px-0" : ""}`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    isActive ? "text-purple-600 dark:text-purple-400" : "text-muted-foreground group-hover:text-foreground"
                  }`}
                />
                {!isSidebarCollapsed && <span className="truncate">{item.name}</span>}
              </NavLink>
            );
          })}
        </nav>

        {/* MY PROGRESS Widget */}
        {!isSidebarCollapsed && (
          <div className="mx-3 mb-2 p-3 rounded-2xl bg-secondary/50 border border-border/80 relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase font-mono">MY PROGRESS</span>
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded">Tier-1</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 flex items-center justify-center shrink-0">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-muted/30"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-purple-600 dark:text-purple-400 transition-all duration-1000"
                    strokeDasharray={`${readinessScore || 0}, 100`}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <span className="absolute text-[10px] font-bold text-foreground font-mono">
                  {readinessScore !== null ? `${readinessScore}%` : "0%"}
                </span>
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-foreground leading-tight">Readiness Score</p>
                <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">{readinessStatus}</p>
              </div>
            </div>
            <NavLink
              to="/placement-readiness"
              className="mt-2.5 w-full flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl text-[11px] font-semibold text-muted-foreground hover:text-foreground bg-card hover:bg-secondary border border-border transition-colors"
            >
              <span>View Full Progress</span>
              <ArrowRight className="w-3 h-3" />
            </NavLink>
          </div>
        )}

        {/* User Card at bottom */}
        <div className="p-3 border-t border-border bg-card">
          <NavLink
            to="/profile"
            title={isSidebarCollapsed ? user?.name || "Student Profile" : undefined}
            className={`flex items-center gap-3 p-2 rounded-xl hover:bg-secondary transition-colors ${
              isSidebarCollapsed ? "justify-center px-0" : ""
            }`}
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-white font-bold text-xs shrink-0">
              {user?.name ? user.name.charAt(0).toUpperCase() : "S"}
            </div>
            {!isSidebarCollapsed && (
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-foreground truncate">{user?.name || "Student"}</p>
                <p className="text-[10px] text-muted-foreground truncate">{user?.department || user?.year || "Engineering"}</p>
              </div>
            )}
          </NavLink>
        </div>
      </aside>


      {/* 2. Mobile Drawer Navigation Overlay */}
      {isMobileDrawerOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm md:hidden flex">
          <div className="w-72 bg-card border-r border-border h-full flex flex-col p-4 space-y-4 animate-in slide-in-from-left duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-white font-bold text-xs">
                  P
                </div>
                <span className="font-extrabold text-sm text-foreground">
                  PlaceMentor <span className="text-purple-500">AI</span>
                </span>
              </div>
              <button
                onClick={() => setIsMobileDrawerOpen(false)}
                className="p-1 rounded-lg text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path || location.pathname.startsWith(`${item.path}/`);

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileDrawerOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? "bg-purple-500/15 text-purple-700 dark:text-purple-300 font-bold border border-purple-500/25"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? "text-purple-500" : ""}`} />
                    <span>{item.name}</span>
                  </NavLink>
                );
              })}
            </nav>
          </div>
          <div className="flex-1" onClick={() => setIsMobileDrawerOpen(false)} />
        </div>
      )}

      {/* 3. Main Content Viewport Container */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-background">
        {/* Top Header Bar */}
        <header className="h-16 border-b border-border bg-card/90 backdrop-blur-md sticky top-0 z-10 shrink-0">
          <div className="h-full flex justify-between items-center px-4 sm:px-6 gap-3">
            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setIsMobileDrawerOpen(true)}
              className="md:hidden p-2 rounded-xl border border-border bg-secondary/60 text-muted-foreground hover:text-foreground"
              aria-label="Open Navigation Menu"
            >
              <Menu className="w-4 h-4" />
            </button>

            {/* Global Search Bar */}
            <div className="flex-1 max-w-md relative">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="w-full pl-9 pr-8 py-2 rounded-xl border border-border bg-secondary/60 hover:bg-secondary text-left text-xs text-muted-foreground transition-all flex items-center justify-between shadow-sm cursor-text"
              >
                <div className="flex items-center gap-2 truncate">
                  <Search className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                  <span className="truncate">Search problems, topics, questions...</span>
                </div>
                <kbd className="hidden sm:inline px-1.5 py-0.5 text-[10px] font-mono font-bold bg-card border border-border rounded text-muted-foreground">
                  /
                </kbd>
              </button>
            </div>

            {/* Top Bar Indicators: Real Streak, Real Points, Theme & Profile */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              {/* Daily Streak Indicator */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold font-mono">
                <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500 animate-pulse" />
                <span className="hidden sm:inline">{userStats.streak} Day Streak</span>
                <span className="sm:hidden">{userStats.streak}d</span>
              </div>

              {/* Points Indicator */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-purple-500/30 bg-purple-500/10 text-purple-700 dark:text-purple-300 text-xs font-bold font-mono">
                <Crown className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
                <span className="hidden sm:inline">{userStats.points} XP</span>
                <span className="sm:hidden">{userStats.points}</span>
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
          <div className="w-full pb-16">
            {children}
          </div>
        </main>
      </div>

      {/* Global Search Modal */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-20 p-4">
          <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-4 space-y-4 shadow-2xl animate-in zoom-in-95 duration-150">
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