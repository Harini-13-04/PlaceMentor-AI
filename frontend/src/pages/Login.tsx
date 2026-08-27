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
  FileText,
  MessageSquare,
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
    <div className="min-h-screen w-full bg-background text-foreground flex flex-col justify-between font-sans selection:bg-teal-500/20 selection:text-teal-400">
      {/* Top Bar with Brand and Theme Toggle */}
      <header className="w-full px-6 py-4 flex items-center justify-between border-b border-border bg-card/60 backdrop-blur-md sticky top-0 z-20">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-white shadow-sm">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="font-bold text-lg tracking-tight text-foreground">
            PlaceMentor <span className="text-teal-600 dark:text-teal-400">AI</span>
          </span>
        </div>

        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="p-2 rounded-lg border border-border bg-card hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
        >
          {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </header>

      {/* Main Two-Column Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-8 md:p-12">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Branding Showcase & Value Proposition */}
          <div className="lg:col-span-7 space-y-6 lg:pr-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-teal-500/30 bg-teal-500/10 text-teal-600 dark:text-teal-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" /> Intelligent Placement Acceleration
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground leading-[1.15]">
              Master Technical Rounds & Land Your Dream Offer.
            </h1>

            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-xl">
              PlaceMentor AI unifies company-specific coding practice, contextual prep guidance, ATS resume optimization, and mock communication diagnostics into one cohesive platform.
            </p>

            {/* Feature Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              <div className="p-3.5 rounded-xl border border-border bg-card shadow-sm space-y-1.5">
                <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400">
                  <Code2 className="w-4 h-4" />
                  <span className="text-xs font-bold text-foreground">140+ Problem Library</span>
                </div>
                <p className="text-xs text-muted-foreground">LeetCode-style IDE workspace with multi-language starter templates & tests.</p>
              </div>

              <div className="p-3.5 rounded-xl border border-border bg-card shadow-sm space-y-1.5">
                <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400">
                  <FileText className="w-4 h-4" />
                  <span className="text-xs font-bold text-foreground">ATS Resume Studio</span>
                </div>
                <p className="text-xs text-muted-foreground">Instant keyword scoring, gap analysis, and recruiter-ready formatting.</p>
              </div>

              <div className="p-3.5 rounded-xl border border-border bg-card shadow-sm space-y-1.5">
                <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400">
                  <MessageSquare className="w-4 h-4" />
                  <span className="text-xs font-bold text-foreground">Voice Communication</span>
                </div>
                <p className="text-xs text-muted-foreground">Speech cadence, filler detection, and structured STAR method practice.</p>
              </div>

              <div className="p-3.5 rounded-xl border border-border bg-card shadow-sm space-y-1.5">
                <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400">
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="text-xs font-bold text-foreground">Readiness Analytics</span>
                </div>
                <p className="text-xs text-muted-foreground">Live competency tracking mapped to top tech hiring bars.</p>
              </div>
            </div>
          </div>

          {/* Right Column: Sign In Card */}
          <div className="lg:col-span-5">
            <div className="p-6 sm:p-8 rounded-2xl border border-border bg-card shadow-md space-y-5">
              <div className="space-y-1">
                <h2 className="text-xl font-bold tracking-tight text-foreground">Welcome Back</h2>
                <p className="text-xs text-muted-foreground">Enter your credentials to access your preparation workspace.</p>
              </div>

              {errorMsg && (
                <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
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
                    className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-secondary/50 text-foreground text-xs placeholder:text-muted-foreground focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-muted-foreground" /> Password
                    </label>
                    <span className="text-[11px] text-teal-600 dark:text-teal-400 hover:underline cursor-pointer">
                      Forgot Password?
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-secondary/50 text-foreground text-xs placeholder:text-muted-foreground focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 pr-10 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-0.5"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-muted-foreground hover:text-foreground">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded border-border text-teal-600 focus:ring-teal-500 w-3.5 h-3.5"
                    />
                    <span>Remember me for 30 days</span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 px-4 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs transition-all duration-150 flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Signing In...
                    </>
                  ) : (
                    <>
                      Sign In <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <div className="pt-2 text-center">
                  <button
                    type="button"
                    onClick={handleDemoFill}
                    className="text-[11px] text-muted-foreground hover:text-teal-600 dark:hover:text-teal-400 transition-colors underline"
                  >
                    Quick fill demo student account
                  </button>
                </div>
              </form>

              <div className="pt-4 border-t border-border text-center text-xs text-muted-foreground">
                Don't have an account?{" "}
                <Link to="/register" className="font-semibold text-teal-600 dark:text-teal-400 hover:underline">
                  Create Account
                </Link>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="w-full px-6 py-4 text-center border-t border-border text-[11px] text-muted-foreground">
        &copy; {new Date().getFullYear()} PlaceMentor AI &middot; Placement Readiness & Career Acceleration Platform
      </footer>
    </div>
  );
}
