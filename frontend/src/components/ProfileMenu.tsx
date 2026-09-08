import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import {
  Settings,
  LogOut,
  ChevronDown,
} from "lucide-react";

export default function ProfileMenu() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

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

  const handleOpenProfile = () => {
    setOpen(false);
    navigate("/profile");
  };

  const initialLetter = (user?.name || user?.full_name || "S")[0].toUpperCase();

  return (
    <div className="relative font-sans" ref={menuRef}>
      {/* Profile Trigger Container */}
      <div className="flex items-center rounded-xl border border-border bg-card hover:bg-secondary/60 transition-colors">
        {/* Profile Avatar & Info - Directly navigates to Profile module */}
        <button
          type="button"
          onClick={handleOpenProfile}
          title="View Profile"
          className="flex items-center gap-2.5 pl-2.5 pr-1.5 py-1.5 cursor-pointer text-left group"
        >
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt="Profile"
              className="w-7 h-7 rounded-full border border-purple-500/40 object-cover group-hover:scale-105 transition-transform"
            />
          ) : (
            <div className="w-7 h-7 rounded-full border border-purple-500/40 bg-purple-500/10 flex items-center justify-center font-bold text-xs text-purple-600 dark:text-purple-400 group-hover:scale-105 transition-transform">
              {initialLetter}
            </div>
          )}

          <div className="hidden sm:block text-left">
            <p className="text-xs font-bold text-foreground leading-tight group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
              {user?.name || user?.full_name || "Student"}
            </p>
            <p className="text-[10px] text-muted-foreground">{user?.department || "CSE"}</p>
          </div>
        </button>

        {/* Dropdown Chevron Button - Opens Settings & Sign Out options */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setOpen(!open);
          }}
          aria-label="Account menu"
          title="Account Options"
          className="p-1.5 mr-1 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        >
          <ChevronDown
            className={`w-3.5 h-3.5 transition-transform duration-200 ${
              open ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>

      {/* Dropdown Menu */}
      {open && (
        <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-border bg-card shadow-2xl overflow-hidden z-50 animate-fade-in">
          {/* Header */}
          <div
            onClick={handleOpenProfile}
            className="p-3 border-b border-border bg-secondary/40 flex items-center gap-2.5 cursor-pointer hover:bg-secondary/70 transition-colors"
            title="Open Profile"
          >
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt="Profile"
                className="w-8 h-8 rounded-full border border-purple-500/40 object-cover shrink-0"
              />
            ) : (
              <div className="w-8 h-8 rounded-full border border-purple-500/40 bg-purple-500/10 flex items-center justify-center font-bold text-sm text-purple-600 dark:text-purple-400 shrink-0">
                {initialLetter}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-foreground truncate">{user?.name || user?.full_name || "Student"}</p>
              <p className="text-[10px] text-muted-foreground truncate font-mono">{user?.email || "student@example.com"}</p>
            </div>
          </div>

          {/* Menu Items */}
          <div className="p-1.5 space-y-0.5 text-xs">
            <button
              onClick={() => {
                navigate("/settings");
                setOpen(false);
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-foreground hover:bg-secondary hover:text-purple-600 dark:hover:text-purple-300 transition-colors text-left cursor-pointer"
            >
              <Settings className="w-3.5 h-3.5 text-muted-foreground" />
              <span>Settings</span>
            </button>

            <div className="my-1 border-t border-border" />

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-rose-500 hover:bg-rose-500/10 transition-colors text-left font-semibold cursor-pointer"
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
