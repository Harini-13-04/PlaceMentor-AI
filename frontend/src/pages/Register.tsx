import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import {
  Sparkles,
  ArrowRight,
  Mail,
  Lock,
  User as UserIcon,
  GraduationCap,
  Building,
  Eye,
  EyeOff,
  CheckCircle2,
  Sun,
  Moon,
  Loader2,
  AlertCircle,
} from "lucide-react";

export default function Register() {
  const navigate = useNavigate();
  const { register, isLoading } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [department, setDepartment] = useState("Computer Science & Engineering");
  const [college, setCollege] = useState("SRM Institute of Science and Technology");
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!fullName.trim() || !email.trim() || !password) {
      setErrorMsg("Please fill in all required fields.");
      return;
    }

    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    if (!agreeTerms) {
      setErrorMsg("Please agree to the terms and privacy policy.");
      return;
    }

    const res = await register(fullName, email, password, department, college);
    if (res.success) {
      navigate("/home", { replace: true });
    } else {
      setErrorMsg(res.error || "Registration failed. Please try again.");
    }
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

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-8 md:p-12">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Value Proposition & Stats */}
          <div className="lg:col-span-6 space-y-6 lg:pr-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-teal-500/30 bg-teal-500/10 text-teal-600 dark:text-teal-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" /> Start Your Placement Journey
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground leading-[1.2]">
              Join Thousands of Students Preparing for Top Product Roles.
            </h1>

            <p className="text-sm text-muted-foreground leading-relaxed">
              Create your account to unlock structured roadmap tracking, real interview question banks, instant AI resume review, and personalized contextual prep assistance.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3 p-3.5 rounded-xl border border-border bg-card">
                <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-foreground">Personalized Skill Gap Diagnostic</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Benchmark your coding, resume, and communication abilities against top tech standards.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-xl border border-border bg-card">
                <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-foreground">100% Free & Open Academic Platform</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Built for students and early-career developers with zero paywalls.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Registration Form */}
          <div className="lg:col-span-6">
            <div className="p-6 sm:p-8 rounded-2xl border border-border bg-card shadow-md space-y-4">
              <div className="space-y-1">
                <h2 className="text-xl font-bold tracking-tight text-foreground">Create Your Account</h2>
                <p className="text-xs text-muted-foreground">Fill in your academic details to get started.</p>
              </div>

              {errorMsg && (
                <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-3.5">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <UserIcon className="w-3.5 h-3.5 text-muted-foreground" /> Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Harini Muthuvel"
                    className="w-full px-3.5 py-2 rounded-lg border border-border bg-secondary/50 text-foreground text-xs placeholder:text-muted-foreground focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-muted-foreground" /> College Email
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@srmist.edu.in"
                    className="w-full px-3.5 py-2 rounded-lg border border-border bg-secondary/50 text-foreground text-xs placeholder:text-muted-foreground focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5 text-muted-foreground" /> Department
                    </label>
                    <input
                      type="text"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      placeholder="CSE / IT / ECE"
                      className="w-full px-3.5 py-2 rounded-lg border border-border bg-secondary/50 text-foreground text-xs placeholder:text-muted-foreground focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                      <Building className="w-3.5 h-3.5 text-muted-foreground" /> College
                    </label>
                    <input
                      type="text"
                      value={college}
                      onChange={(e) => setCollege(e.target.value)}
                      placeholder="University Name"
                      className="w-full px-3.5 py-2 rounded-lg border border-border bg-secondary/50 text-foreground text-xs placeholder:text-muted-foreground focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-muted-foreground" /> Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-3.5 py-2 rounded-lg border border-border bg-secondary/50 text-foreground text-xs placeholder:text-muted-foreground focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 pr-9 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-muted-foreground" /> Confirm Password
                    </label>
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3.5 py-2 rounded-lg border border-border bg-secondary/50 text-foreground text-xs placeholder:text-muted-foreground focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
                    />
                  </div>
                </div>

                <div className="flex items-start gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="rounded border-border text-teal-600 focus:ring-teal-500 w-3.5 h-3.5 mt-0.5"
                  />
                  <label htmlFor="terms" className="text-[11px] text-muted-foreground leading-tight cursor-pointer">
                    I agree to the PlaceMentor AI terms of service and academic integrity guidelines.
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 px-4 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs transition-all duration-150 flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Creating Account...
                    </>
                  ) : (
                    <>
                      Create Account <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              <div className="pt-3 border-t border-border text-center text-xs text-muted-foreground">
                Already have an account?{" "}
                <Link to="/login" className="font-semibold text-teal-600 dark:text-teal-400 hover:underline">
                  Sign In
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
