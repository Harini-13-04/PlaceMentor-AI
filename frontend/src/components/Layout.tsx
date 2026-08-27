import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import ProfileMenu from "./ProfileMenu";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import {
  Home,
  Code2,
  FileText,
  MessageSquare,
  Sparkles,
  BarChart3,
  User,
  Settings,
  Sun,
  Moon,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const navItems = [
    { name: "Home", path: "/home", icon: Home },
    { name: "Practice", path: "/practice", icon: Code2 },
    { name: "Resume Studio", path: "/resume", icon: FileText },
    { name: "Communication", path: "/communication", icon: MessageSquare },
    { name: "Placement Readiness", path: "/placement-readiness", icon: BarChart3 },
    { name: "Candidate Profile", path: "/profile", icon: User },
    { name: "Settings", path: "/settings", icon: Settings },
  ];

  const displayName = user?.name || user?.full_name || "Student";
  const userInitials = displayName
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "U";

  return (
    <div className="flex h-screen w-screen bg-background text-foreground overflow-hidden font-sans selection:bg-teal-500/20 selection:text-teal-400">
      {/* 1. Global Leftmost Sidebar (Collapsible: 240px when open, 64px when collapsed) */}
      <aside
        style={{ width: isSidebarCollapsed ? "64px" : "240px" }}
        className="border-r border-border bg-card flex flex-col z-20 shrink-0 transition-all duration-200 select-none relative"
      >
        {/* Brand Header with Collapse Toggle */}
        <div className="h-14 px-3.5 flex items-center justify-between border-b border-border">
          {!isSidebarCollapsed ? (
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-teal-600 flex items-center justify-center text-white shadow-sm shrink-0">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <span className="font-bold text-sm tracking-tight text-foreground truncate">
                PlaceMentor <span className="text-teal-600 dark:text-teal-400">AI</span>
              </span>
            </div>
          ) : (
            <div className="w-7 h-7 rounded-lg bg-teal-600 flex items-center justify-center text-white shadow-sm mx-auto">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
          )}

          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            className="p-1.5 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
          >
            {isSidebarCollapsed ? (
              <PanelLeftOpen className="w-4 h-4" />
            ) : (
              <PanelLeftClose className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto p-2 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              title={isSidebarCollapsed ? item.name : undefined}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors ${
                  isActive
                    ? "bg-teal-500/15 text-teal-600 dark:text-teal-400 font-semibold"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                } ${isSidebarCollapsed ? "justify-center px-0" : ""}`
              }
            >
              <item.icon className="w-4 h-4 shrink-0" />
              {!isSidebarCollapsed && <span className="truncate">{item.name}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Sidebar Footer User Card */}
        <div className="p-2 border-t border-border">
          <NavLink
            to="/profile"
            title={isSidebarCollapsed ? user?.name || "Student Profile" : undefined}
            className={`flex items-center gap-2.5 p-2 rounded-lg hover:bg-secondary transition-colors ${
              isSidebarCollapsed ? "justify-center" : ""
            }`}
          >
            <img
              src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"}
              alt="User"
              className="w-7 h-7 rounded-full border border-border object-cover shrink-0"
            />
            {!isSidebarCollapsed && (
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-foreground truncate">{user?.name || "Student"}</p>
                <p className="text-[10px] text-muted-foreground truncate">{user?.department || "CSE"}</p>
              </div>
            )}
          </NavLink>
        </div>
      </aside>

      {/* 2. Main Content Viewport Container (flex: 1, ZERO GAPS, smoothly expands) */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-background">
        {/* Top Header Bar */}
        <header className="h-14 border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-10 shrink-0">
          <div className="h-full flex justify-between items-center px-6">
            <div className="flex items-center gap-2 text-xs">
              <span className="font-semibold text-foreground">Placement Season 2026</span>
              <span className="text-muted-foreground">&bull;</span>
              <span className="text-muted-foreground font-medium">Campus Recruitment SDE Track</span>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={toggleTheme}
                aria-label="Toggle theme"
                className="p-2 rounded-lg border border-border bg-card hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
              >
                {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>

              <ProfileMenu />
            </div>
          </div>
        </header>

        {/* Page Viewport Area */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="w-full pb-12">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}