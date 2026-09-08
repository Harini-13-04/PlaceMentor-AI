import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { HeroDoodleIllustration } from "@/components/doodles/DoodleIllustrations";
import {
  ArrowRight,
  FileText,
  TrendingUp,
  MessageSquare,
  Briefcase,
  Sun,
  Moon,
  Menu,
  X,
  UserCheck,
  Code2,
  Brain,
  CheckCircle2,
  Sparkles,
  Shield,
  Target,
  Zap,
  Award,
  BarChart3,
  Users,
  Compass,
  Check,
} from "lucide-react";

type LandingTab = "home" | "features" | "how-it-works" | "about";

export default function Landing() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<LandingTab>("home");

  // Sync active tab with URL hash if provided
  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash === "features" || hash === "how-it-works" || hash === "about") {
      setActiveTab(hash as LandingTab);
    } else if (!hash) {
      setActiveTab("home");
    }
  }, [location]);

  const handleTabChange = (tab: LandingTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    if (tab === "home") {
      window.history.replaceState(null, "", "/");
    } else {
      window.history.replaceState(null, "", `#${tab}`);
    }
  };

  const handleFeatureClick = (route: string) => {
    if (isAuthenticated) {
      navigate(route);
    } else {
      navigate("/login", { state: { from: { pathname: route } } });
    }
  };

  const quickFeatureCards = [
    {
      title: "Resume Builder",
      desc: "Create ATS-friendly resumes with AI suggestions.",
      icon: FileText,
      iconBg: "bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-300",
      route: "/resume",
    },
    {
      title: "AI Improve",
      desc: "Enhance your skills with personalized recommendations.",
      icon: TrendingUp,
      iconBg: "bg-pink-100 dark:bg-pink-950/60 text-pink-600 dark:text-pink-300",
      route: "/home",
    },
    {
      title: "Communication",
      desc: "Practice speaking, GD and outreach with AI feedback.",
      icon: MessageSquare,
      iconBg: "bg-sky-100 dark:bg-sky-950/60 text-sky-600 dark:text-sky-300",
      route: "/communication",
    },
    {
      title: "Job Matching",
      desc: "Find internships and job opportunities that fit you.",
      icon: Briefcase,
      iconBg: "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-300",
      route: "/placement-readiness",
    },
  ];

  const fullFeaturesList = [
    {
      title: "Coding Arena & Live Judge",
      desc: "Solve real DSA challenges with automated execution, real visible & hidden test cases, multi-language support (Python, Java, C++, JS), and genuine execution stats.",
      icon: Code2,
      badge: "Judge Engine",
      badgeColor: "text-purple-400 bg-purple-500/10 border-purple-500/20",
      route: "/practice",
      highlights: ["Hidden test suite verification", "Zero mock execution", "Python, Java, C++, JavaScript"],
    },
    {
      title: "ATS-Optimized Resume Studio",
      desc: "Craft high-scoring, ATS-compliant technical resumes. Leverage AI-powered bullet point refinement, keyword matching, and one-click PDF compilation.",
      icon: FileText,
      badge: "Resume AI",
      badgeColor: "text-pink-400 bg-pink-500/10 border-pink-500/20",
      route: "/resume",
      highlights: ["ATS keyword optimization", "Custom professional templates", "Direct PDF export"],
    },
    {
      title: "AI Communication & GD Coach",
      desc: "Master HR behavioral questions, technical interviews, and group discussion scenarios with interactive speech feedback and conversational AI coaching.",
      icon: MessageSquare,
      badge: "Interactive AI",
      badgeColor: "text-sky-400 bg-sky-500/10 border-sky-500/20",
      route: "/communication",
      highlights: ["GD simulation trainer", "Fluency & clarity analysis", "HR & behavioral tracks"],
    },
    {
      title: "Brain Zone & Skill Assessment",
      desc: "Diagnostic competency matrix evaluating core CS, programming, algorithms, and logical aptitude to identify and eliminate placement skill gaps.",
      icon: Brain,
      badge: "Skill Matrix",
      badgeColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
      route: "/brainzone",
      highlights: ["Dynamic difficulty scaling", "Core CS & Aptitude tests", "Continuous level progression"],
    },
    {
      title: "Placement Readiness Scorecard",
      desc: "Comprehensive multi-dimensional readiness index derived from your genuine submissions, quizzes, and interview performance metrics.",
      icon: Target,
      badge: "Readiness Index",
      badgeColor: "text-amber-400 bg-amber-500/10 border-amber-500/20",
      route: "/placement-readiness",
      highlights: ["Tier-1 company qualification bar", "Historical accuracy tracking", "Actionable improvement areas"],
    },
    {
      title: "Smart Placement Recommendations",
      desc: "Targeted company roadmaps, curated topic sequences, and weekly milestone tracking built to prepare you for top product & service companies.",
      icon: Compass,
      badge: "Roadmap Engine",
      badgeColor: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
      route: "/recommendations",
      highlights: ["Role-targeted prep paths", "Weekly milestones & goals", "Company-specific question sets"],
    },
  ];

  const howItWorksSteps = [
    {
      step: "01",
      title: "Diagnostic Baseline",
      desc: "Create your authenticated profile and complete initial assessment challenges to establish your baseline across Coding, Aptitude, and Core CS.",
      icon: Zap,
    },
    {
      step: "02",
      title: "AI-Guided Daily Practice",
      desc: "Tackle curated coding problems with real test judges, practice group discussions with the AI coach, and level up your XP daily.",
      icon: Code2,
    },
    {
      step: "03",
      title: "ATS-Ready Resume Polish",
      desc: "Build an industry-standard resume tailored to your target job roles with AI bullet suggestions and keyword alignment.",
      icon: FileText,
    },
    {
      step: "04",
      title: "Screening & Placement Success",
      desc: "Track your Placement Readiness Index, achieve Tier-1 qualification status, and approach campus & off-campus drives with confidence.",
      icon: Award,
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-purple-500/20 selection:text-purple-300 flex flex-col justify-between">
      {/* Navbar */}
      <header className="w-full border-b border-border/60 bg-background/95 backdrop-blur-md sticky top-0 z-40 transition-colors shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => handleTabChange("home")}
            className="flex items-center gap-2.5 group cursor-pointer text-left"
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-2xl bg-gradient-to-tr from-purple-600 via-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold shadow-md shadow-purple-500/20 group-hover:scale-105 transition-transform">
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current">
                <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
              </svg>
            </div>
            <span className="font-extrabold text-base sm:text-lg tracking-tight text-foreground font-display">
              PlaceMentor<span className="text-purple-600 dark:text-purple-400">-AI</span>
            </span>
          </button>

          {/* Nav Links Tabs */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-xs sm:text-sm font-semibold">
            <button
              onClick={() => handleTabChange("home")}
              className={`relative py-1.5 transition-colors cursor-pointer ${
                activeTab === "home"
                  ? "text-foreground font-bold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Home
              {activeTab === "home" && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600 dark:bg-purple-400 rounded-full" />
              )}
            </button>

            <button
              onClick={() => handleTabChange("features")}
              className={`relative py-1.5 transition-colors cursor-pointer ${
                activeTab === "features"
                  ? "text-foreground font-bold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Features
              {activeTab === "features" && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600 dark:bg-purple-400 rounded-full" />
              )}
            </button>

            <button
              onClick={() => handleTabChange("how-it-works")}
              className={`relative py-1.5 transition-colors cursor-pointer ${
                activeTab === "how-it-works"
                  ? "text-foreground font-bold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              How It Works
              {activeTab === "how-it-works" && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600 dark:bg-purple-400 rounded-full" />
              )}
            </button>

            <button
              onClick={() => handleTabChange("about")}
              className={`relative py-1.5 transition-colors cursor-pointer ${
                activeTab === "about"
                  ? "text-foreground font-bold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              About
              {activeTab === "about" && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600 dark:bg-purple-400 rounded-full" />
              )}
            </button>
          </nav>

          {/* Right Header Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={toggleTheme}
              aria-label="Toggle dark/light theme"
              className="p-2 rounded-xl border border-border bg-card hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors shadow-sm cursor-pointer"
            >
              {theme === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>

            {isAuthenticated ? (
              <Link
                to="/home"
                className="px-4 py-2 rounded-xl text-xs font-bold text-white pm-btn-gradient flex items-center gap-2 shadow-sm"
              >
                <UserCheck className="w-4 h-4" />
                <span>Dashboard</span>
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-xl border border-border bg-card hover:bg-secondary text-xs font-bold text-foreground transition-all shadow-sm"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white pm-btn-gradient flex items-center gap-1.5 shadow-sm"
                >
                  <span>Sign Up</span>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Drawer Trigger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="p-1.5 rounded-lg border border-border bg-card text-muted-foreground"
            >
              {theme === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-lg border border-border bg-card text-foreground cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-border bg-card p-3 space-y-2 animate-in slide-in-from-top-2 absolute top-14 left-0 right-0 z-50 shadow-xl">
            <nav className="flex flex-col gap-1 text-xs font-semibold">
              <button
                onClick={() => handleTabChange("home")}
                className={`p-2 text-left rounded-lg transition-colors cursor-pointer ${
                  activeTab === "home" ? "bg-purple-500/10 text-purple-600 dark:text-purple-400 font-bold" : "hover:bg-secondary text-foreground"
                }`}
              >
                Home
              </button>
              <button
                onClick={() => handleTabChange("features")}
                className={`p-2 text-left rounded-lg transition-colors cursor-pointer ${
                  activeTab === "features" ? "bg-purple-500/10 text-purple-600 dark:text-purple-400 font-bold" : "hover:bg-secondary text-foreground"
                }`}
              >
                Features
              </button>
              <button
                onClick={() => handleTabChange("how-it-works")}
                className={`p-2 text-left rounded-lg transition-colors cursor-pointer ${
                  activeTab === "how-it-works" ? "bg-purple-500/10 text-purple-600 dark:text-purple-400 font-bold" : "hover:bg-secondary text-foreground"
                }`}
              >
                How It Works
              </button>
              <button
                onClick={() => handleTabChange("about")}
                className={`p-2 text-left rounded-lg transition-colors cursor-pointer ${
                  activeTab === "about" ? "bg-purple-500/10 text-purple-600 dark:text-purple-400 font-bold" : "hover:bg-secondary text-foreground"
                }`}
              >
                About
              </button>
            </nav>
            <div className="pt-2 border-t border-border flex flex-col gap-2">
              {isAuthenticated ? (
                <Link to="/home" className="w-full py-2 text-center text-xs font-bold text-white pm-btn-gradient rounded-xl">
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link to="/login" className="w-full py-1.5 text-center text-xs font-bold border border-border rounded-xl">
                    Login
                  </Link>
                  <Link to="/register" className="w-full py-1.5 text-center text-xs font-bold text-white pm-btn-gradient rounded-xl">
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main Dynamic Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 flex flex-col justify-center">
        {/* =========================================================================
            TAB 1: HOME (HERO + QUICK CARDS)
           ========================================================================= */}
        {activeTab === "home" && (
          <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
            {/* Two-Column Hero Row */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center py-2 sm:py-4">
              {/* Left Column Text & Buttons */}
              <div className="lg:col-span-6 space-y-4 text-left">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 text-[10px] sm:text-[11px] font-extrabold uppercase tracking-widest font-mono">
                  <Sparkles className="w-3 h-3" /> YOUR CAREER COMPANION
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold tracking-tight text-foreground leading-[1.1] font-display">
                  Prepare Today. <br />
                  Get Placed <br />
                  <span className="text-purple-600 dark:text-purple-400">Tomorrow.</span>
                </h1>

                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-lg font-medium">
                  An all-in-one AI platform to help you build job-ready skills, create standout resumes, practice interviews, and get placed with confidence.
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <Link
                    to={isAuthenticated ? "/home" : "/register"}
                    className="px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold text-white pm-btn-gradient flex items-center gap-2 shadow-lg shadow-purple-500/25 hover:scale-[1.02] transition-transform"
                  >
                    <span>{isAuthenticated ? "Go to Dashboard" : "Get Started Free"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => handleTabChange("features")}
                    className="px-4 py-3 rounded-2xl text-xs sm:text-sm font-semibold border border-border bg-card hover:bg-secondary text-foreground transition-colors cursor-pointer"
                  >
                    Explore Features
                  </button>
                </div>
              </div>

              {/* Right Column: Hand-Drawn Doodle Illustration */}
              <div className="lg:col-span-6 flex items-center justify-center">
                <HeroDoodleIllustration className="w-full max-w-xs sm:max-w-sm lg:max-w-md max-h-[260px] sm:max-h-[300px] lg:max-h-[340px]" />
              </div>
            </div>

            {/* Feature Cards Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 pt-2">
              {quickFeatureCards.map((fc) => (
                <div
                  key={fc.title}
                  onClick={() => handleFeatureClick(fc.route)}
                  className="p-3.5 sm:p-4 rounded-2xl border border-border/70 bg-card hover:border-purple-500/40 hover:shadow-md transition-all cursor-pointer space-y-2 group"
                >
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${fc.iconBg}`}>
                    <fc.icon className="w-4 h-4" />
                  </div>
                  <h3 className="text-xs sm:text-sm font-bold text-foreground group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors font-display">
                    {fc.title}
                  </h3>
                  <p className="text-[11px] text-muted-foreground leading-snug font-medium line-clamp-2">
                    {fc.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 2: FEATURES (DETAILED SHOWCASE MATRIX)
           ========================================================================= */}
        {activeTab === "features" && (
          <div className="space-y-6 py-2 animate-in fade-in zoom-in-95 duration-200">
            <div className="text-center space-y-2 max-w-2xl mx-auto">
              <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-widest text-purple-600 dark:text-purple-400 font-mono">
                PLATFORM CAPABILITIES
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground font-display">
                Everything You Need for Campus & Off-Campus Hiring
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Engineered from the ground up with real execution, persistent diagnostics, and intelligent feedback.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 pt-2">
              {fullFeaturesList.map((f) => (
                <div
                  key={f.title}
                  className="p-5 rounded-2xl border border-border bg-card hover:border-purple-500/40 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                        <f.icon className="w-5 h-5" />
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${f.badgeColor}`}>
                        {f.badge}
                      </span>
                    </div>

                    <h3 className="text-sm sm:text-base font-bold text-foreground font-display">
                      {f.title}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {f.desc}
                    </p>

                    <div className="space-y-1.5 pt-1">
                      {f.highlights.map((h) => (
                        <div key={h} className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => handleFeatureClick(f.route)}
                    className="w-full py-2.5 px-3 rounded-xl border border-border bg-secondary/60 hover:bg-purple-600 hover:text-white hover:border-purple-600 text-xs font-semibold text-foreground transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <span>Launch Module</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 3: HOW IT WORKS (STEP-BY-STEP WORKFLOW)
           ========================================================================= */}
        {activeTab === "how-it-works" && (
          <div className="space-y-8 py-4 animate-in fade-in zoom-in-95 duration-200 max-w-4xl mx-auto">
            <div className="text-center space-y-2">
              <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-widest text-purple-600 dark:text-purple-400 font-mono">
                THE PREPARATION PIPELINE
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground font-display">
                How PlaceMentor AI Accelerates Your Career
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground max-w-lg mx-auto">
                A structured four-step methodology turning academic knowledge into job-ready placement competence.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {howItWorksSteps.map((step) => (
                <div
                  key={step.step}
                  className="p-5 sm:p-6 rounded-2xl border border-border bg-card space-y-3 relative overflow-hidden shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-extrabold font-mono text-purple-600/30 dark:text-purple-400/20">
                      {step.step}
                    </span>
                    <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                      <step.icon className="w-4 h-4" />
                    </div>
                  </div>
                  <h3 className="text-base font-bold text-foreground font-display">
                    {step.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-900/30 via-indigo-900/20 to-card border border-purple-500/30 text-center space-y-3">
              <h3 className="text-base sm:text-lg font-bold text-foreground">
                Ready to begin your placement journey?
              </h3>
              <p className="text-xs text-muted-foreground max-w-md mx-auto">
                Join students already leveling up their technical skills, ATS resumes, and communication with AI.
              </p>
              <Link
                to={isAuthenticated ? "/home" : "/register"}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-md"
              >
                <span>{isAuthenticated ? "Open Dashboard" : "Start Practicing for Free"}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 4: ABOUT (MISSION & INTEGRITY VALUES)
           ========================================================================= */}
        {activeTab === "about" && (
          <div className="space-y-8 py-4 animate-in fade-in zoom-in-95 duration-200 max-w-4xl mx-auto">
            <div className="text-center space-y-2">
              <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-widest text-purple-600 dark:text-purple-400 font-mono">
                ABOUT PLACEMENTOR AI
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground font-display">
                Intelligent OS for Future Engineers
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto">
                PlaceMentor AI bridges the gap between college curricula and high-bar tech industry hiring standards.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div className="p-5 rounded-2xl border border-border bg-card space-y-2">
                <Code2 className="w-6 h-6 text-purple-400 mx-auto" />
                <h4 className="text-sm font-bold text-foreground font-display">Authentic Code Judge</h4>
                <p className="text-xs text-muted-foreground">
                  Genuine test runner with hidden tests, syntax checks, and memory profiling.
                </p>
              </div>

              <div className="p-5 rounded-2xl border border-border bg-card space-y-2">
                <Shield className="w-6 h-6 text-indigo-400 mx-auto" />
                <h4 className="text-sm font-bold text-foreground font-display">Real DB Persistence</h4>
                <p className="text-xs text-muted-foreground">
                  Zero mock data. Submissions, streak, solved questions, and profiles permanently stored in MongoDB.
                </p>
              </div>

              <div className="p-5 rounded-2xl border border-border bg-card space-y-2">
                <BarChart3 className="w-6 h-6 text-emerald-400 mx-auto" />
                <h4 className="text-sm font-bold text-foreground font-display">Readiness Analytics</h4>
                <p className="text-xs text-muted-foreground">
                  Real-time screening metrics providing transparent feedback on interview readiness.
                </p>
              </div>
            </div>

            <div className="p-6 rounded-2xl border border-border bg-card space-y-3">
              <h3 className="text-base font-bold text-foreground">Our Core Mission</h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Campus recruitment is evolving rapidly. Top employers demand hands-on algorithmic problem solving, clear system communication, and polished project storytelling. PlaceMentor AI provides every student with an individualized preparation copilot that evaluates performance honestly and tracks progress with precision.
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Compact Footer */}
      <footer className="border-t border-border/60 bg-card/60 py-2.5 text-[11px] text-muted-foreground shrink-0 mt-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-1.5">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-xs text-foreground font-display">PlaceMentor AI</span>
            <span>— Intelligent Placement Preparation OS</span>
          </div>
          <div className="flex items-center gap-4 text-muted-foreground">
            <button onClick={() => handleTabChange("home")} className="hover:text-foreground cursor-pointer">Home</button>
            <button onClick={() => handleTabChange("features")} className="hover:text-foreground cursor-pointer">Features</button>
            <button onClick={() => handleTabChange("how-it-works")} className="hover:text-foreground cursor-pointer">How It Works</button>
            <button onClick={() => handleTabChange("about")} className="hover:text-foreground cursor-pointer">About</button>
          </div>
          <p>© 2026 PlaceMentor AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
