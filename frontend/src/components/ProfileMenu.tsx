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

  return (
    <div className="relative font-sans" ref={menuRef}>
      {/* Profile Trigger Button */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 border border-border bg-card hover:bg-secondary transition-colors"
      >
        <img
          src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"}
          alt="Profile"
          className="w-6 h-6 rounded-full border border-border object-cover"
        />

        <div className="hidden sm:block text-left">
          <p className="text-xs font-semibold text-foreground leading-tight">{user?.name || "Student"}</p>
        </div>

        <ChevronDown
          className={`w-3.5 h-3.5 text-muted-foreground transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {open && (
        <div className="absolute right-0 mt-2 w-56 rounded-xl border border-border bg-card shadow-lg overflow-hidden z-50 animate-fade-in">
          {/* Header */}
          <div className="p-3 border-b border-border bg-secondary/30 flex items-center gap-2.5">
            <img
              src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"}
              alt="Profile"
              className="w-8 h-8 rounded-full border border-border object-cover"
            />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-foreground truncate">{user?.name || "Student"}</p>
              <p className="text-[11px] text-muted-foreground truncate">{user?.email || "student@srmist.edu.in"}</p>
            </div>
          </div>

          {/* Menu Items */}
          <div className="p-1.5 space-y-0.5 text-xs">
            <button
              onClick={() => {
                navigate("/profile");
                setOpen(false);
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-foreground hover:bg-secondary transition-colors text-left"
            >
              <User className="w-3.5 h-3.5 text-muted-foreground" />
              <span>Candidate Profile</span>
            </button>

            <button
              onClick={() => {
                navigate("/placement-readiness");
                setOpen(false);
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-foreground hover:bg-secondary transition-colors text-left"
            >
              <BarChart3 className="w-3.5 h-3.5 text-muted-foreground" />
              <span>Placement Readiness</span>
            </button>

            <button
              onClick={() => {
                navigate("/settings");
                setOpen(false);
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-foreground hover:bg-secondary transition-colors text-left"
            >
              <Settings className="w-3.5 h-3.5 text-muted-foreground" />
              <span>Settings</span>
            </button>

            <div className="my-1 border-t border-border" />

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 transition-colors text-left font-medium"
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