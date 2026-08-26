import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import {
  User,
  BarChart3,
  Trophy,
  Target,
  Award,
  Settings,
  LogOut,
  ChevronDown,
} from "lucide-react";

export default function ProfileMenu() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const displayName = user?.name || user?.full_name || "Student";
  const userInitials = displayName
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "U";

  const handleLogout = async () => {
    setOpen(false);
    await logout();
    navigate("/login");
  };

  return (
    <div className="relative">
      {/* Profile Button */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-3 rounded-xl px-3 py-1.5 hover:bg-white/5 transition-all duration-300 border border-transparent hover:border-white/10"
      >
        {user?.avatar ? (
          <img
            src={user.avatar}
            alt={displayName}
            className="w-9 h-9 rounded-full border border-white/20 object-cover"
          />
        ) : (
          <div className="w-9 h-9 rounded-full border border-white/20 bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-xs font-bold text-white">
            {userInitials}
          </div>
        )}

        <div className="hidden md:block text-left max-w-[140px] truncate">
          <p className="text-sm font-semibold text-white truncate">{displayName}</p>
          <p className="text-xs text-muted-foreground truncate">{user?.department || user?.college || "Candidate"}</p>
        </div>

        <ChevronDown
          className={`w-4 h-4 text-muted-foreground transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-3 w-72 rounded-2xl border border-white/10 bg-[#121124]/95 backdrop-blur-xl shadow-2xl overflow-hidden z-50 animate-fade-in">
          {/* Header */}
          <div className="flex items-center gap-3 p-4 border-b border-white/10">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={displayName}
                className="w-11 h-11 rounded-full border border-white/20 object-cover"
              />
            ) : (
              <div className="w-11 h-11 rounded-full border border-white/20 bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-sm font-bold text-white">
                {userInitials}
              </div>
            )}

            <div className="overflow-hidden">
              <p className="font-semibold text-white text-sm truncate">{displayName}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            </div>
          </div>

          {/* Menu */}
          <div className="p-2">
            <button
              onClick={() => {
                navigate("/profile");
                setOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-white/5 transition-all duration-200 text-white text-sm"
            >
              <User className="w-4 h-4 text-violet-400" />
              <span>My Profile</span>
            </button>

            <button
              onClick={() => {
                navigate("/placement-readiness");
                setOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-white/5 transition-all duration-200 text-white text-sm"
            >
              <BarChart3 className="w-4 h-4 text-violet-400" />
              <span>Placement Readiness</span>
            </button>

            <button
              onClick={() => {
                navigate("/leaderboard");
                setOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-white/5 transition-all duration-200 text-white text-sm"
            >
              <Trophy className="w-4 h-4 text-violet-400" />
              <span>Leaderboard</span>
            </button>

            <button
              onClick={() => {
                navigate("/weekly-goals");
                setOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-white/5 transition-all duration-200 text-white text-sm"
            >
              <Target className="w-4 h-4 text-violet-400" />
              <span>Weekly Goals</span>
            </button>

            <button
              onClick={() => {
                navigate("/achievements");
                setOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-white/5 transition-all duration-200 text-white text-sm"
            >
              <Award className="w-4 h-4 text-violet-400" />
              <span>Achievements</span>
            </button>

            <hr className="my-2 border-white/10" />

            <button
              onClick={() => {
                navigate("/profile");
                setOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-white/5 transition-all duration-200 text-white text-sm"
            >
              <Settings className="w-4 h-4 text-slate-400" />
              <span>Account Settings</span>
            </button>

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-red-400 hover:bg-red-500/10 transition-all duration-200 text-sm"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}