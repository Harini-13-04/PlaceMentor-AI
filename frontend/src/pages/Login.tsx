import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { LoginDoodleIllustration } from "@/components/doodles/DoodleIllustrations";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Sun,
  Moon,
  Loader2,
  AlertCircle,
  Sparkles,
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
      setErrorMsg("Please enter both email address and password.");
      return;
    }

    const res = await login(email, password);
    if (res.success) {
      navigate(from, { replace: true });
    } else {
      setErrorMsg(res.error || "Invalid email or password.");
    }
  };

  return (
    <div className="w-screen h-screen max-h-screen overflow-hidden bg-slate-100 dark:bg-[#0b0e17] text-slate-900 dark:text-white grid grid-cols-1 lg:grid-cols-12 font-sans selection:bg-purple-500/20 selection:text-purple-300 transition-colors duration-300">
      
      {/* Left Column: Login Form */}
      <div className="lg:col-span-6 bg-white dark:bg-[#101322] border-r border-slate-200 dark:border-slate-800/80 p-5 sm:p-8 lg:p-10 xl:p-12 flex flex-col justify-between h-full overflow-hidden">
        <div className="max-w-md w-full mx-auto space-y-4 my-auto">
          {/* Top Brand Logo Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-purple-600/10 dark:bg-purple-600/30 border border-purple-500/30 dark:border-purple-500/40 flex items-center justify-center text-purple-600 dark:text-purple-400 shadow-md">
                <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400 fill-purple-600/20 dark:fill-purple-400/30" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white font-display">
                PlaceMentor<span className="text-purple-600 dark:text-purple-400">-AI</span>
              </span>
            </div>

            {/* Mobile/Tablet Theme Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700/60 bg-slate-100 dark:bg-[#141728] hover:bg-slate-200 dark:hover:bg-[#1f243f] text-slate-700 dark:text-slate-300 text-xs font-semibold transition-all shadow-sm cursor-pointer"
            >
              {theme === "dark" ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-indigo-600" />}
            </button>
          </div>

          {/* Title & Subtitle */}
          <div className="space-y-1">
            <div className="font-display font-semibold text-xs text-purple-600 dark:text-purple-400 tracking-wide transform -rotate-1 origin-left">
              Hey there,
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white font-display">
              Welcome Back!
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">
              Log in to continue your placement journey.
            </p>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Email Address */}
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-10 pr-3.5 py-2.5 sm:py-3 rounded-xl border border-slate-300 dark:border-slate-700/60 bg-slate-50 dark:bg-[#141728] text-slate-900 dark:text-white text-xs sm:text-sm placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 font-medium"
              />
            </div>

            {/* Password Input */}
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full pl-10 pr-10 py-2.5 sm:py-3 rounded-xl border border-slate-300 dark:border-slate-700/60 bg-slate-50 dark:bg-[#141728] text-slate-900 dark:text-white text-xs sm:text-sm placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 font-medium"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Show or hide password"
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Remember Me & Forgot Password Row */}
            <div className="flex items-center justify-between text-xs font-medium pt-0.5">
              <label className="flex items-center gap-2 cursor-pointer text-slate-600 dark:text-slate-400 select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 dark:border-slate-700 bg-purple-600 text-purple-600 focus:ring-purple-500 cursor-pointer accent-purple-600"
                />
                <span>Remember me</span>
              </label>
              <button
                type="button"
                onClick={() => setErrorMsg("Password reset email sent to your registered address if account exists.")}
                className="text-purple-600 dark:text-purple-400 hover:underline font-semibold"
              >
                Forgot password?
              </button>
            </div>

            {/* Log In Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-lg shadow-purple-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer mt-1"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Log In</span>}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* OR Divider */}
          <div className="relative py-0.5 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-800" />
            </div>
            <span className="relative px-3 bg-white dark:bg-[#101322] text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              OR
            </span>
          </div>

          {/* Social Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <GoogleSignInButton
              mode="signin"
              onSuccess={() => navigate(from, { replace: true })}
              onError={(err) => setErrorMsg(err)}
            />

            <button
              type="button"
              onClick={() => setErrorMsg("GitHub OAuth is in development. Please log in using your registered email and password.")}
              className="w-full py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700/60 bg-slate-50 dark:bg-[#141728]/60 hover:bg-slate-100 dark:hover:bg-[#1a1e34] text-slate-800 dark:text-white text-xs font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4 shrink-0 fill-current text-slate-800 dark:text-white" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              <span>GitHub</span>
            </button>
          </div>
        </div>
      </div>

      {/* Right Column: Top-Right Theme Toggle & Illustration & Header Navigation */}
      <div className="lg:col-span-6 bg-purple-50/50 dark:bg-[#131628] border-t lg:border-t-0 lg:border-l border-slate-200 dark:border-slate-800/80 p-5 sm:p-8 lg:p-10 xl:p-12 flex flex-col justify-between h-full relative overflow-hidden transition-colors duration-300">
        {/* Top Right Navigation & Theme Toggle */}
        <div className="w-full flex items-center justify-between lg:justify-end gap-3.5 z-10">
          {/* Desktop Theme Toggle (Positioned on top-right of screen) */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700/60 bg-slate-100/80 dark:bg-[#141728]/80 hover:bg-slate-200 dark:hover:bg-[#1f243f] text-slate-700 dark:text-slate-300 text-xs font-semibold transition-all shadow-sm cursor-pointer"
          >
            {theme === "dark" ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span>Light Mode</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-indigo-600" />
                <span>Dark Mode</span>
              </>
            )}
          </button>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">
            Don't have an account?{" "}
            <Link to="/register" className="text-purple-600 dark:text-purple-400 font-semibold hover:underline transition-colors ml-1">
              Sign Up
            </Link>
          </p>
        </div>

        {/* Illustration Container */}
        <div className="flex-1 flex items-center justify-center my-auto py-2">
          <LoginDoodleIllustration className="w-full max-w-sm lg:max-w-md max-h-[45vh] drop-shadow-xl" />
        </div>

        {/* Bottom subtle ambient glow */}
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-500/10 dark:bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
      </div>

    </div>
  );
}
