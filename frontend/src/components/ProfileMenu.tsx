import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import {
  User,
  BarChart3,
  Settings,
  LogOut,
  ChevronDown,
} from "lucide-react";


import { getMediaUrl } from "@/pages/Profile";

export default function ProfileMenu() {
  const [open, setOpen] = useState(false);
  const [avatarError, setAvatarError] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    setAvatarError(false);
  }, [user?.avatar]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate("/login");
  };

  const resolvedAvatar = user?.avatar ? getMediaUrl(user.avatar) : "";

  return (
    <div className="relative font-sans" ref={menuRef}>
      {/* Profile Trigger Button */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2.5 rounded-xl px-2.5 py-1.5 border border-border bg-card hover:bg-secondary transition-colors cursor-pointer"
      >
        {resolvedAvatar && !avatarError ? (
          <img
            src={resolvedAvatar}
            alt="Profile"
            onError={() => setAvatarError(true)}
            className="w-7 h-7 rounded-full border border-purple-500/40 object-cover"
          />
        ) : (
          <div className="w-7 h-7 rounded-full border border-purple-500/40 bg-purple-500/10 flex items-center justify-center font-bold text-xs text-purple-600 dark:text-purple-400">
            {(user?.name || user?.full_name || "U")[0].toUpperCase()}
          </div>
        )}

        <div className="hidden sm:block text-left">
          <p className="text-xs font-bold text-foreground leading-tight">{user?.name || user?.full_name || "Student"}</p>
          <p className="text-[10px] text-muted-foreground">{user?.department || "General Track"}</p>
        </div>

        <ChevronDown
          className={`w-3.5 h-3.5 text-muted-foreground transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {open && (
        <div className="absolute right-0 mt-2 w-60 rounded-2xl border border-border bg-card shadow-2xl overflow-hidden z-50 animate-fade-in">
          {/* Header */}
          <div className="p-3.5 border-b border-border bg-secondary/40 flex items-center gap-3">
            {resolvedAvatar && !avatarError ? (
              <img
                src={resolvedAvatar}
                alt="Profile"
                onError={() => setAvatarError(true)}
                className="w-9 h-9 rounded-full border border-purple-500/40 object-cover"
              />
            ) : (
              <div className="w-9 h-9 rounded-full border border-purple-500/40 bg-purple-500/10 flex items-center justify-center font-bold text-sm text-purple-600 dark:text-purple-400 shrink-0">
                {(user?.name || user?.full_name || "U")[0].toUpperCase()}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-foreground truncate">{user?.name || user?.full_name || "Candidate"}</p>
              <p className="text-[10px] text-muted-foreground truncate font-mono">{user?.email || ""}</p>
            </div>
          </div>

          {/* Menu Items */}
          <div className="p-1.5 space-y-0.5 text-xs">
            <button
              onClick={() => {
                navigate("/profile");
                setOpen(false);
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-foreground hover:bg-secondary hover:text-purple-300 transition-colors text-left"
            >
              <User className="w-3.5 h-3.5 text-muted-foreground" />
              <span>Candidate Profile</span>
            </button>

            <button
              onClick={() => {
                navigate("/placement-readiness");
                setOpen(false);
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-foreground hover:bg-secondary hover:text-purple-300 transition-colors text-left"
            >
              <BarChart3 className="w-3.5 h-3.5 text-muted-foreground" />
              <span>Placement Readiness</span>
            </button>

            <button
              onClick={() => {
                navigate("/settings");
                setOpen(false);
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-foreground hover:bg-secondary hover:text-purple-300 transition-colors text-left"
            >
              <Settings className="w-3.5 h-3.5 text-muted-foreground" />
              <span>Settings</span>
            </button>

            <div className="my-1 border-t border-border" />

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-rose-400 hover:bg-rose-500/10 transition-colors text-left font-semibold"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}