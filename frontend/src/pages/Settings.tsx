import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import {
  User,
  Sun,
  Moon,
  LogOut,
  Check,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Settings() {
  const { user, logout, updateUser } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || "Harini Muthuvel");
  const [department, setDepartment] = useState(user?.department || "Computer Science & Engineering");
  const [college, setCollege] = useState(user?.college || "SRM Institute of Science and Technology");

  const [savedSuccess, setSavedSuccess] = useState(false);


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
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground mb-1 font-display">
          Settings & Preferences
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Manage your candidate profile details, appearance theme, and placement notifications.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-semibold flex items-center gap-2">
          <Check className="w-4 h-4" /> Changes saved successfully.
        </div>
      )}

      {/* Account Profile Settings */}
      <div className="p-6 rounded-2xl border border-border bg-card shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
          <User className="w-4 h-4 text-purple-400" /> Account Profile Information
        </h2>

        <form onSubmit={handleSaveAccount} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-muted-foreground font-semibold">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full mt-1 px-3.5 py-2.5 rounded-xl border border-border bg-secondary text-foreground outline-none focus:border-purple-500 font-medium"
              />
            </div>

            <div>
              <label className="text-muted-foreground font-semibold">Email Address</label>
              <input
                type="email"
                disabled
                value={user?.email || "harini.muthuvel@srmist.edu.in"}
                className="w-full mt-1 px-3.5 py-2.5 rounded-xl border border-border bg-secondary/50 text-muted-foreground cursor-not-allowed font-mono"
              />
            </div>

            <div>
              <label className="text-muted-foreground font-semibold">Department / Degree</label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full mt-1 px-3.5 py-2.5 rounded-xl border border-border bg-secondary text-foreground outline-none focus:border-purple-500 font-medium"
              />
            </div>

            <div>
              <label className="text-muted-foreground font-semibold">University / College</label>
              <input
                type="text"
                value={college}
                onChange={(e) => setCollege(e.target.value)}
                className="w-full mt-1 px-3.5 py-2.5 rounded-xl border border-border bg-secondary text-foreground outline-none focus:border-purple-500 font-medium"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-white text-xs font-bold pm-btn-gradient shadow-md"
            >
              Save Profile Changes
            </button>
          </div>
        </form>
      </div>

      {/* Theme Appearance */}
      <div className="p-6 rounded-2xl border border-border bg-card shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
          <Sun className="w-4 h-4 text-purple-400" /> Platform Appearance
        </h2>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-foreground">Theme Mode</p>
            <p className="text-[11px] text-muted-foreground">Toggle between high-contrast dark navy mode and technical light mode.</p>
          </div>

          <button
            onClick={toggleTheme}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border bg-secondary hover:bg-secondary/80 text-xs font-semibold text-foreground transition-colors"
          >
            {theme === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-purple-400" />}
            <span>{theme === "dark" ? "Dark Navy Mode" : "Light Mode"}</span>
          </button>
        </div>
      </div>

      {/* Logout Box */}
      <div className="p-6 rounded-2xl border border-rose-500/20 bg-rose-500/5 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-xs font-bold text-foreground">Session Logout</p>
          <p className="text-[11px] text-muted-foreground">Sign out of your active PlaceMentor AI candidate session.</p>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors shadow-sm"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
}
