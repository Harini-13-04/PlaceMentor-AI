import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { RegisterDoodleIllustration } from "@/components/doodles/DoodleIllustrations";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Calendar,
  ArrowRight,
  Sun,
  Moon,
  Loader2,
  AlertCircle,
  Sparkles,
} from "lucide-react";

export default function Register() {
  const navigate = useNavigate();
  const { register, isLoading } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [dob, setDob] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedTerms, setAgreedTerms] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!firstName.trim() || !email.trim() || !password) {
      setErrorMsg("Please complete all required fields.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match. Please re-enter password.");
      return;
    }

    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters long.");
      return;
    }

    if (!agreedTerms) {
      setErrorMsg("Please agree to the Terms of Service and Privacy Policy.");
      return;
    }

    const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();
    const res = await register(fullName, email, password);

    if (res.success) {
      navigate("/home", { replace: true });
    } else {
      setErrorMsg(res.error || "Registration failed. Email may already be registered.");
    }
  };

  return (
    <div className="w-screen h-screen max-h-screen overflow-hidden bg-slate-100 dark:bg-[#0b0e17] text-slate-900 dark:text-white grid grid-cols-1 lg:grid-cols-12 font-sans selection:bg-purple-500/20 selection:text-purple-300 transition-colors duration-300">
      
      {/* Left Column: Register Form */}
      <div className="lg:col-span-6 bg-white dark:bg-[#101322] border-r border-slate-200 dark:border-slate-800/80 p-4 sm:p-6 lg:p-8 xl:p-10 flex flex-col justify-between h-full overflow-hidden">
        <div className="max-w-md w-full mx-auto space-y-2.5 my-auto">
          {/* Top Brand Logo Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-purple-600/10 dark:bg-purple-600/30 border border-purple-500/30 dark:border-purple-500/40 flex items-center justify-center text-purple-600 dark:text-purple-400 shadow-md">
                <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 fill-purple-600/20 dark:fill-purple-400/30" />
              </div>
              <span className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-white font-display">
                PlaceMentor<span className="text-purple-600 dark:text-purple-400">-AI</span>
              </span>
            </div>

            {/* Mobile/Tablet Theme Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="lg:hidden flex items-center gap-1.5 px-2.5 py-1 rounded-xl border border-slate-200 dark:border-slate-700/60 bg-slate-100 dark:bg-[#141728] hover:bg-slate-200 dark:hover:bg-[#1f243f] text-slate-700 dark:text-slate-300 text-xs font-semibold transition-all shadow-sm cursor-pointer"
            >
              {theme === "dark" ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-indigo-600" />}
            </button>
          </div>

          {/* Title & Subtitle */}
          <div className="space-y-0.5">
            <div className="font-display font-semibold text-[11px] text-purple-600 dark:text-purple-400 tracking-wide transform -rotate-1 origin-left">
              Create Your Journey!
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white font-display">
              Sign up to get started
            </h1>

            <p className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-400 font-medium">
              Join PlaceMentor-AI and take the next step towards a brighter future.
            </p>
          </div>

          {errorMsg && (
            <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-2">
            {/* First Name & Last Name Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="relative">
                <User className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="First Name"
                  className="w-full pl-9 pr-2.5 py-1.5 sm:py-2 rounded-xl border border-slate-300 dark:border-slate-700/60 bg-slate-50 dark:bg-[#141728] text-slate-900 dark:text-white text-xs placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 font-medium"
                />
              </div>

              <div className="relative">
                <User className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Last Name"
                  className="w-full pl-9 pr-2.5 py-1.5 sm:py-2 rounded-xl border border-slate-300 dark:border-slate-700/60 bg-slate-50 dark:bg-[#141728] text-slate-900 dark:text-white text-xs placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 font-medium"
                />
              </div>
            </div>

            {/* Email Address */}
            <div className="relative">
              <Mail className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address"
                className="w-full pl-9 pr-2.5 py-1.5 sm:py-2 rounded-xl border border-slate-300 dark:border-slate-700/60 bg-slate-50 dark:bg-[#141728] text-slate-900 dark:text-white text-xs placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 font-medium"
              />
            </div>

            {/* Date of Birth */}
            <div className="relative">
              <Calendar className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                placeholder="Date of Birth"
                className="w-full pl-9 pr-9 py-1.5 sm:py-2 rounded-xl border border-slate-300 dark:border-slate-700/60 bg-slate-50 dark:bg-[#141728] text-slate-900 dark:text-white text-xs placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 font-medium"
              />
              <span className="absolute right-8 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 dark:text-slate-500 font-medium pointer-events-none hidden sm:inline">
                DD/MM/YYYY
              </span>
              <Calendar className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Create Password */}
            <div className="relative">
              <Lock className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create Password"
                className="w-full pl-9 pr-9 py-1.5 sm:py-2 rounded-xl border border-slate-300 dark:border-slate-700/60 bg-slate-50 dark:bg-[#141728] text-slate-900 dark:text-white text-xs placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 font-medium"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <Lock className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm Password"
                className="w-full pl-9 pr-9 py-1.5 sm:py-2 rounded-xl border border-slate-300 dark:border-slate-700/60 bg-slate-50 dark:bg-[#141728] text-slate-900 dark:text-white text-xs placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 font-medium"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Terms Agreement */}
            <div className="flex items-center gap-2 text-[11px] text-slate-600 dark:text-slate-400 font-medium pt-0.5">
              <input
                type="checkbox"
                id="terms"
                checked={agreedTerms}
                onChange={(e) => setAgreedTerms(e.target.checked)}
                className="w-3.5 h-3.5 rounded border-slate-300 dark:border-slate-700 bg-purple-600 text-purple-600 focus:ring-purple-500 cursor-pointer accent-purple-600"
              />
              <label htmlFor="terms" className="cursor-pointer select-none">
                I agree to <span className="text-purple-600 dark:text-purple-400 font-semibold hover:underline">Terms</span> and <span className="text-purple-600 dark:text-purple-400 font-semibold hover:underline">Privacy</span>.
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2 sm:py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-lg shadow-purple-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer mt-1"
            >
              {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <span>Sign Up</span>}
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* OR Divider */}
          <div className="relative py-0.5 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-800" />
            </div>
            <span className="relative px-3 bg-white dark:bg-[#101322] text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              OR
            </span>
          </div>

          {/* Social Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setErrorMsg("Google registration service connected.")}
              className="w-full py-1.5 sm:py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700/60 bg-slate-50 dark:bg-[#141728]/60 hover:bg-slate-100 dark:hover:bg-[#1a1e34] text-slate-800 dark:text-white text-xs font-medium flex items-center justify-center gap-2 transition-colors"
            >
              <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Google</span>
            </button>

            <button
              type="button"
              onClick={() => setErrorMsg("GitHub registration service connected.")}
              className="w-full py-1.5 sm:py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700/60 bg-slate-50 dark:bg-[#141728]/60 hover:bg-slate-100 dark:hover:bg-[#1a1e34] text-slate-800 dark:text-white text-xs font-medium flex items-center justify-center gap-2 transition-colors"
            >
              <svg className="w-3.5 h-3.5 shrink-0 fill-current text-slate-800 dark:text-white" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              <span>GitHub</span>
            </button>
          </div>
        </div>
      </div>

      {/* Right Column: Top-Right Theme Toggle & Illustration & Header Navigation */}
      <div className="lg:col-span-6 bg-purple-50/50 dark:bg-[#131628] border-t lg:border-t-0 lg:border-l border-slate-200 dark:border-slate-800/80 p-4 sm:p-6 lg:p-8 flex flex-col justify-between h-full relative overflow-hidden transition-colors duration-300">
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
            Already have an account?{" "}
            <Link to="/login" className="text-purple-600 dark:text-purple-400 font-semibold hover:underline transition-colors ml-1">
              Log In
            </Link>
          </p>
        </div>

        {/* Illustration Container */}
        <div className="flex-1 flex items-center justify-center my-auto py-2">
          <RegisterDoodleIllustration className="w-full max-w-sm lg:max-w-md max-h-[42vh] drop-shadow-xl" />
        </div>

        {/* Bottom subtle ambient glow */}
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-500/10 dark:bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
      </div>

    </div>
  );
}
