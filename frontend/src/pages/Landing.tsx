import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
} from "lucide-react";

export default function Landing() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleFeatureClick = (route: string) => {
    if (isAuthenticated) {
      navigate(route);
    } else {
      navigate("/login", { state: { from: { pathname: route } } });
    }
  };

  const featureCards = [
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

  return (
    <div className="w-screen h-screen max-h-screen overflow-hidden bg-background text-foreground font-sans selection:bg-purple-500/20 selection:text-purple-300 flex flex-col justify-between">
      {/* Navbar */}
      <header className="w-full border-b border-border/60 bg-background/95 backdrop-blur-md sticky top-0 z-40 transition-colors shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-2xl bg-gradient-to-tr from-purple-600 via-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold shadow-md shadow-purple-500/20 group-hover:scale-105 transition-transform">
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current">
                <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
              </svg>
            </div>
            <span className="font-extrabold text-base sm:text-lg tracking-tight text-foreground font-display">
              PlaceMentor<span className="text-purple-600 dark:text-purple-400">-AI</span>
            </span>
          </Link>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-xs sm:text-sm font-semibold text-muted-foreground">
            <Link
              to="/"
              className="text-foreground relative py-1 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
            >
              Home
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600 dark:bg-purple-400 rounded-full" />
            </Link>
            <a href="#features" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
              How It Works
            </a>
            <a href="#about" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
              About
            </a>
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
                className="px-4 py-2 rounded-xl text-xs font-bold text-white pm-btn-gradient flex items-center gap-2"
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
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white pm-btn-gradient flex items-center gap-1.5"
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
              className="p-1.5 rounded-lg border border-border bg-card text-foreground"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-border bg-card p-3 space-y-2 animate-in slide-in-from-top-2 absolute top-14 left-0 right-0 z-50 shadow-xl">
            <nav className="flex flex-col gap-2 text-xs font-semibold">
              <Link to="/" onClick={() => setMobileMenuOpen(false)} className="p-1.5 text-purple-600 font-bold">Home</Link>
              <a href="#features" onClick={() => setMobileMenuOpen(false)} className="p-1.5 hover:bg-secondary rounded-lg">Features</a>
              <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} className="p-1.5 hover:bg-secondary rounded-lg">How It Works</a>
              <a href="#about" onClick={() => setMobileMenuOpen(false)} className="p-1.5 hover:bg-secondary rounded-lg">About</a>
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

      {/* Main Content (Strictly 100vh Non-Scrollable) */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 lg:py-4 flex flex-col justify-between space-y-3 overflow-hidden">
        {/* Two-Column Hero Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-8 items-center my-auto">
          {/* Left Column Text & Buttons */}
          <div className="lg:col-span-6 space-y-3 text-left">
            <p className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-widest text-purple-600 dark:text-purple-400 font-mono">
              YOUR CAREER COMPANION
            </p>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-extrabold tracking-tight text-foreground leading-[1.1] font-display">
              Prepare Today. <br />
              Get Placed <br />
              <span className="text-purple-600 dark:text-purple-400">Tomorrow.</span>
            </h1>

            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-lg font-medium">
              An all-in-one AI platform to help you build job-ready skills, create standout resumes, practice interviews, and get placed with confidence.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-0.5">
              <Link
                to={isAuthenticated ? "/home" : "/register"}
                className="px-4 py-2.5 rounded-2xl text-xs font-bold text-white pm-btn-gradient flex items-center gap-2 shadow-lg shadow-purple-500/25 hover:scale-[1.02] transition-transform"
              >
                <span>{isAuthenticated ? "Go to Dashboard" : "Get Started Free"}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Right Column: Hand-Drawn Doodle Illustration */}
          <div className="lg:col-span-6 flex items-center justify-center">
            <HeroDoodleIllustration className="w-full max-w-xs sm:max-w-sm lg:max-w-md max-h-[240px] sm:max-h-[280px] lg:max-h-[320px]" />
          </div>
        </div>

        {/* Feature Cards Row */}
        <div id="features" className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
          {featureCards.map((fc) => (
            <div
              key={fc.title}
              onClick={() => handleFeatureClick(fc.route)}
              className="p-3 rounded-2xl border border-border/70 bg-card hover:border-purple-500/40 hover:shadow-md transition-all cursor-pointer space-y-1.5 group"
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
      </main>

      {/* Compact Footer */}
      <footer className="border-t border-border/60 bg-card/60 py-2 text-[11px] text-muted-foreground shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-1">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-xs text-foreground font-display">PlaceMentor AI</span>
            <span>— Intelligent Placement Preparation OS</span>
          </div>
          <p>© 2026 PlaceMentor AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
