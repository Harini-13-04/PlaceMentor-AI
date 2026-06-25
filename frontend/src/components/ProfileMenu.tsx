import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();

  return (
    <div className="relative">
      {/* Profile Button */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-3 rounded-xl px-3 py-2 hover:bg-white/5 transition-all duration-300"
      >
        <img
          src="https://i.pravatar.cc/150?u=12"
          alt="Profile"
          className="w-10 h-10 rounded-full border border-white/20"
        />

        <div className="hidden md:block text-left">
          <p className="text-sm font-semibold text-white">Harini</p>
          <p className="text-xs text-primary">Level 12 • 4500 XP</p>
        </div>

        <ChevronDown
          className={`w-4 h-4 text-muted-foreground transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-3 w-72 rounded-2xl border border-white/10 bg-[#141414]/95 backdrop-blur-xl shadow-2xl overflow-hidden z-50">

          {/* Header */}
          <div className="flex items-center gap-3 p-4 border-b border-white/10">
            <img
              src="https://i.pravatar.cc/150?u=12"
              alt="Profile"
              className="w-12 h-12 rounded-full border border-white/20"
            />

            <div>
              <p className="font-semibold text-white">Harini</p>
              <p className="text-xs text-primary">Level 12 • 4500 XP</p>
            </div>
          </div>

          {/* Menu */}
          <div className="p-2">

            <button
              onClick={() => {
                navigate("/profile");
                setOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-all duration-200 text-white"
            >
              <User className="w-4 h-4" />
              <span>My Profile</span>
            </button>

            <button onClick={() => {navigate("/placement-readiness"); setOpen(false); }}className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-all duration-200 text-white">
              <BarChart3 className="w-4 h-4" />
              <span>Placement Readiness</span>
            </button>

            <button onClick={() => {navigate("/leaderboard");setOpen(false);}}className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-all duration-200 text-white">
              <Trophy className="w-4 h-4" />
              <span>Leaderboard</span>
            </button>

            <button onClick={() => { navigate("/weekly-goals"); setOpen(false);}}className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-all duration-200 text-white"
>
              <Target className="w-4 h-4" />
              <span>Weekly Goals</span>
            </button>

            <button onClick={() => {navigate("/achievements");setOpen(false); }}className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-all duration-200 text-white">
              <Award className="w-4 h-4" />
              <span>Achievements</span>
            </button>

            <hr className="my-2 border-white/10" />

            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-all duration-200 text-white">
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </button>

            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all duration-200">
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>

          </div>
        </div>
      )}
    </div>
  );
}