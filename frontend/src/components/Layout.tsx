import ProfileMenu from "./ProfileMenu";
import StreakIndicator from "./StreakIndicator";
import { NavLink, useNavigate } from "react-router-dom";
import { Home, Code2, MessageSquare, Sparkles, Bell, FileText, Sun, Moon } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const navItems = [
    { name: "Home", path: "/home", icon: Home },
    { name: "Practice", path: "/practice", icon: Code2 },
    { name: "Resume", path: "/resume", icon: FileText },
    { name: "Communication", path: "/communication", icon: MessageSquare },
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
    <div className="flex h-screen bg-background text-foreground overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-60 border-r border-border bg-card flex flex-col z-20 relative flex-shrink-0">
        {/* Brand */}
        <div className="h-14 px-5 flex items-center gap-2.5 border-b border-border">
          <div className="w-7 h-7 rounded-lg bg-teal-600 flex items-center justify-center text-white">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="font-sans font-bold text-base tracking-tight text-foreground">
            PlaceMentor
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? "bg-teal-500/15 text-teal-700 dark:text-teal-400 font-semibold"
                    : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                }`
              }
            >
              <item.icon className="w-4 h-4 flex-shrink-0" />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>

        {/* Sidebar User Block */}
        <div className="p-3 border-t border-border">
          <div
            onClick={() => navigate("/profile")}
            className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-secondary/60 cursor-pointer transition-colors"
          >
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={displayName}
                className="w-8 h-8 rounded-full border border-border object-cover flex-shrink-0"
              />
            ) : (
              <div className="w-8 h-8 rounded-full border border-border bg-teal-700 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                {userInitials}
              </div>
            )}
            <div className="truncate">
              <p className="text-xs font-semibold text-foreground truncate">{displayName}</p>
              <p className="text-[11px] text-muted-foreground truncate">
                {user?.department || user?.college || "Candidate"}
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main View Area */}
      <main className="flex-1 flex flex-col relative overflow-hidden bg-background">
        {/* Top Header Bar */}
        <header className="h-14 border-b border-border bg-card px-6 flex items-center justify-end gap-3 flex-shrink-0">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
            className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-secondary"
          >
            {theme === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>

          {/* Notification */}
          <button className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-secondary">
            <Bell className="w-4 h-4" />
          </button>

          <StreakIndicator
            streak={{
              currentStreak: 12,
              weekActivity: [true, true, true, true, false, false, false],
              milestone: 15,
              bestStreak: 21,
              lastActiveDate: "2026-06-29",
            }}
          />

          {/* Profile Menu */}
          <ProfileMenu />
        </header>

        {/* Page Content Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 relative scroll-smooth">
          <div className="max-w-6xl mx-auto pb-12">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}