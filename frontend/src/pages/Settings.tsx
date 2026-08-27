import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import {
  Settings as SettingsIcon,
  User,
  Sun,
  Moon,
  Lock,
  Bell,
  LogOut,
  Check,
  Shield,
  Eye,
  EyeOff,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Settings() {
  const { user, logout, updateUser } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || "Harini Muthuvel");
  const [department, setDepartment] = useState(user?.department || "Computer Science & Engineering");
  const [college, setCollege] = useState(user?.college || "SRM Institute of Science and Technology");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const [emailNotifications, setEmailNotifications] = useState(true);
  const [dailyReminders, setDailyReminders] = useState(true);

  const handleSaveAccount = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({ name, department, college });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="space-y-6 font-sans text-foreground max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-1">
          Settings & Preferences
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Manage your candidate profile details, theme appearance, and security credentials.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2 animate-fade-in">
          <Check className="w-4 h-4" /> Account preferences saved successfully.
        </div>
      )}

      {/* 1. Appearance / Theme */}
      <div className="p-5 rounded-xl border border-border bg-card shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
              {theme === "dark" ? <Moon className="w-4 h-4 text-teal-500" /> : <Sun className="w-4 h-4 text-amber-500" />}
              Appearance Mode
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Select between light and dark UI themes. Both maintain high contrast and WCAG compliance.
            </p>
          </div>

          <button
            onClick={toggleTheme}
            className="px-3.5 py-1.5 rounded-lg border border-border bg-secondary hover:bg-secondary/80 text-xs font-semibold text-foreground transition-colors flex items-center gap-2 shrink-0"
          >
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            <span>Switch to {theme === "dark" ? "Light" : "Dark"} Mode</span>
          </button>
        </div>
      </div>

      {/* 2. Account Details */}
      <div className="p-5 rounded-xl border border-border bg-card shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
          <User className="w-4 h-4 text-teal-600 dark:text-teal-400" /> Candidate Information
        </h2>

        <form onSubmit={handleSaveAccount} className="space-y-3.5 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="space-y-1">
              <label className="font-semibold text-foreground">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-secondary/50 text-foreground"
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-foreground">College Email (Read-Only)</label>
              <input
                type="email"
                disabled
                value={user?.email || "student@srmist.edu.in"}
                className="w-full px-3 py-2 rounded-lg border border-border bg-secondary/30 text-muted-foreground cursor-not-allowed"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="space-y-1">
              <label className="font-semibold text-foreground">Department</label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-secondary/50 text-foreground"
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-foreground">College / University</label>
              <input
                type="text"
                value={college}
                onChange={(e) => setCollege(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-secondary/50 text-foreground"
              />
            </div>
          </div>

          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs transition-colors shadow-sm"
          >
            Save Candidate Details
          </button>
        </form>
      </div>

      {/* 3. Notifications */}
      <div className="p-5 rounded-xl border border-border bg-card shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
          <Bell className="w-4 h-4 text-teal-600 dark:text-teal-400" /> Notifications & Alerts
        </h2>

        <div className="space-y-3 text-xs">
          <label className="flex items-center justify-between p-3 rounded-lg border border-border bg-secondary/30 cursor-pointer">
            <div>
              <p className="font-semibold text-foreground">Daily Practice Reminders</p>
              <p className="text-[11px] text-muted-foreground">Receive daily problem alerts to maintain preparation streak.</p>
            </div>
            <input
              type="checkbox"
              checked={dailyReminders}
              onChange={(e) => setDailyReminders(e.target.checked)}
              className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500 border-border"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-lg border border-border bg-secondary/30 cursor-pointer">
            <div>
              <p className="font-semibold text-foreground">Placement Season Hiring Alerts</p>
              <p className="text-[11px] text-muted-foreground">Company drive notifications matching your target role.</p>
            </div>
            <input
              type="checkbox"
              checked={emailNotifications}
              onChange={(e) => setEmailNotifications(e.target.checked)}
              className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500 border-border"
            />
          </label>
        </div>
      </div>

      {/* 4. Security & Logout */}
      <div className="p-5 rounded-xl border border-border bg-card shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
          <Shield className="w-4 h-4 text-teal-600 dark:text-teal-400" /> Security & Session
        </h2>

        <div className="flex items-center justify-between pt-2 border-t border-border">
          <div>
            <p className="text-xs font-semibold text-foreground">Sign Out of Account</p>
            <p className="text-[11px] text-muted-foreground">Terminates active session and clears authentication tokens.</p>
          </div>

          <button
            onClick={handleLogout}
            className="px-3.5 py-2 rounded-lg border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
