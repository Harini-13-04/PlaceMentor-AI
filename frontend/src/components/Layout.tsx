import ProfileMenu from "./ProfileMenu";
import StreakIndicator from "./StreakIndicator";
import { NavLink } from "react-router-dom";
import { Home, Code2, MessageSquare, Sparkles, Bell, FileText } from "lucide-react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const navItems = [
    { name: "Home", path: "/home", icon: Home },
    { name: "Resume", path: "/resume", icon: FileText },
    { name: "AI Copilot", path: "/copilot", icon: Sparkles },
    { name: "Practice", path: "/practice", icon: Code2 },
    { name: "Communication", path: "/communication", icon: MessageSquare },
  ];

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/10 bg-card/30 backdrop-blur-3xl flex flex-col z-20 relative">
        <div className="p-6 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="font-display font-bold text-xl tracking-tight text-white">
            PlaceMentor
          </span>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1.5">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                  isActive
                    ? "bg-primary/15 text-primary font-medium"
                    : "text-muted-foreground hover:bg-white/5 hover:text-white"
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </NavLink>
          ))}
        </nav>

        {/* Sidebar User */}
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 cursor-pointer transition-colors">
            <img
              src="https://i.pravatar.cc/150?u=12"
              alt="User"
              className="w-10 h-10 rounded-full border border-white/20"
            />
            <div>
              <p className="text-sm font-medium text-white">Alex Chen</p>
              <p className="text-xs text-primary font-medium mt-0.5">
                Level 12 • 4500 XP
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative overflow-hidden bg-background">

        {/* Topbar */}
        <header className="h-16 border-b border-white/10 bg-background/80 backdrop-blur-md sticky top-0 z-10">
          <div className="h-full flex justify-end items-center px-8 gap-3">

            {/* Notification */}
            <button className="p-2 text-muted-foreground hover:text-white transition-colors rounded-full hover:bg-white/5">
              <Bell className="w-5 h-5" />
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


            {/* Profile */}
            <ProfileMenu />

          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 relative scroll-smooth">
          {/* Background */}
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[128px] -z-10 pointer-events-none mix-blend-screen"></div>
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-accent/15 rounded-full blur-[128px] -z-10 pointer-events-none mix-blend-screen"></div>

          <div className="max-w-6xl mx-auto animate-fade-in pb-12">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}