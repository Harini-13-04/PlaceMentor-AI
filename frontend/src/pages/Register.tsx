import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { RegisterDoodleIllustration } from "@/components/doodles/DoodleIllustrations";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import { GitHubSignInButton } from "@/components/auth/GitHubSignInButton";
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
  const [gender, setGender] = useState("");
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
    const res = await register(fullName, email, password, "Computer Science & Engineering", "Placement Candidate", gender);

    if (res.success) {
      navigate("/onboarding");
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

            {/* Date of Birth & Gender Preference */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="relative">
                <Calendar className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  placeholder="Date of Birth"
                  className="w-full pl-9 pr-2.5 py-1.5 sm:py-2 rounded-xl border border-slate-300 dark:border-slate-700/60 bg-slate-50 dark:bg-[#141728] text-slate-900 dark:text-white text-xs placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 font-medium"
                />
              </div>

              <div className="relative">
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full px-3 py-1.5 sm:py-2 rounded-xl border border-slate-300 dark:border-slate-700/60 bg-slate-50 dark:bg-[#141728] text-slate-900 dark:text-white text-xs focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 font-medium"
                >
                  <option value="">Gender (Optional)</option>
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                  <option value="other">Other / Prefer not to say</option>
                </select>
              </div>
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
            <GoogleSignInButton
              mode="signup"
              onSuccess={() => navigate("/onboarding", { replace: true })}
              onError={(err) => setErrorMsg(err)}
            />

            <GitHubSignInButton
              mode="signup"
              onError={(err) => setErrorMsg(err)}
            />
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
