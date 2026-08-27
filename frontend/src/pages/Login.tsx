import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import {
  Sparkles,
  ArrowRight,
  Mail,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  Code2,
  Calculator,
  MessageSquare,
  FileText,
  Sun,
  Moon,
  Loader2,
  AlertCircle,
} from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const from = location.state?.from?.pathname || "/home";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!email.trim() || !password) {
      setErrorMsg("Please enter both email and password.");
      return;
    }

    const res = await login(email, password);
    if (res.success) {
      navigate(from, { replace: true });
    } else {
      setErrorMsg(res.error || "Invalid email or password.");
    }
  };

  const handleDemoFill = () => {
    setEmail("harini.muthuvel@srmist.edu.in");
    setPassword("password123");
  };

  return (
    <div className="min-h-screen w-full bg-background text-foreground flex flex-col justify-between font-sans selection:bg-purple-500/20 selection:text-purple-300">
      {/* Top Bar with Brand and Theme Toggle */}
      <header className="w-full px-6 py-4 flex items-center justify-between border-b border-border bg-card/60 backdrop-blur-md sticky top-0 z-20">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
            P
          </div>
          <span className="font-extrabold text-lg tracking-tight text-foreground font-display">
            PlaceMentor <span className="text-purple-400">AI</span>
          </span>
        </div>

        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="p-2 rounded-xl border border-border bg-card hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
        >
          {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </header>

      {/* Main Two-Column Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-8 md:p-12">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Branding Showcase */}
          <div className="lg:col-span-7 space-y-6 lg:pr-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" /> Intelligent Placement Preparation OS
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground leading-[1.15] font-display">
              Master Technical Rounds & Land Your Tier-1 Offer.
            </h1>

            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-xl">
              PlaceMentor AI unifies company-specific coding practice, aptitude tests, contextual prep guidance, ATS resume intelligence, and voice interview diagnostics.
            </p>

            {/* Feature Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              <div className="p-4 rounded-2xl border border-border bg-card shadow-sm space-y-1.5">
                <div className="flex items-center gap-2 text-purple-400">
                  <Code2 className="w-4 h-4" />
                  <span className="text-xs font-bold text-foreground">Coding & DSA Library</span>
                </div>
                <p className="text-xs text-muted-foreground">3-panel IDE workspace with multi-language starter codes and instant test validation.</p>
              </div>

              <div className="p-4 rounded-2xl border border-border bg-card shadow-sm space-y-1.5">
                <div className="flex items-center gap-2 text-amber-400">
                  <Calculator className="w-4 h-4" />
                  <span className="text-xs font-bold text-foreground">Aptitude & DI Engine</span>
                </div>
                <p className="text-xs text-muted-foreground">Quant, logic, and speed formulas with step-by-step shortcuts.</p>
              </div>

              <div className="p-4 rounded-2xl border border-border bg-card shadow-sm space-y-1.5">
                <div className="flex items-center gap-2 text-teal-400">
                  <MessageSquare className="w-4 h-4" />
                  <span className="text-xs font-bold text-foreground">Speaking & Group Discussion</span>
                </div>
                <p className="text-xs text-muted-foreground">Speech cadence, filler detection, and live private peer GD rooms.</p>
              </div>

              <div className="p-4 rounded-2xl border border-border bg-card shadow-sm space-y-1.5">
                <div className="flex items-center gap-2 text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="text-xs font-bold text-foreground">7-Stage Placement Roadmap</span>
                </div>
                <p className="text-xs text-muted-foreground">Step-by-step milestone journey connecting all 8 core preparation modules.</p>
              </div>
            </div>
          </div>

          {/* Right Column: Sign In Card */}
          <div className="lg:col-span-5">
            <div className="p-6 sm:p-8 rounded-2xl border border-border bg-card shadow-xl space-y-5">
              <div className="space-y-1">
                <h2 className="text-xl font-bold tracking-tight text-foreground font-display">Welcome Back</h2>
                <p className="text-xs text-muted-foreground">Sign in to access your personalized placement workspace.</p>
              </div>

              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-muted-foreground" /> Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@university.edu"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-secondary/50 text-foreground text-xs placeholder:text-muted-foreground focus:outline-none focus:border-purple-500 transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-muted-foreground" /> Password
                    </label>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-secondary/50 text-foreground text-xs placeholder:text-muted-foreground focus:outline-none focus:border-purple-500 pr-10 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 rounded-xl text-xs font-bold text-white pm-btn-gradient shadow-md flex items-center justify-center gap-2"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Sign In to Workspace</span>}
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>

              {/* Demo Login Quick-Fill */}
              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={handleDemoFill}
                  className="text-xs text-purple-400 hover:text-purple-300 font-semibold underline"
                >
                  Auto-fill Demo Candidate Credentials
                </button>
              </div>

              <div className="text-center pt-2 border-t border-border">
                <p className="text-xs text-muted-foreground">
                  Don't have an account?{" "}
                  <Link to="/register" className="text-purple-400 font-semibold hover:underline">
                    Register Now
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
