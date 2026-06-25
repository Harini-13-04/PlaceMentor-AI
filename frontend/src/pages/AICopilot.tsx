import { FileText, Building2, BrainCircuit, Map, ArrowRight, Send, Sparkles, Target, Calendar, Zap } from "lucide-react";

// ── Dummy data ─────────────────────────────────────────────────────────────

const aiMessages = [
  {
    role: "ai",
    text: "Hi Aakash! 👋 I'm your AI Career Coach. I've analyzed your profile and resume — you're on a great track for Software Engineer roles. What would you like to work on today?",
    time: "9:41 AM",
  },
  {
    role: "user",
    text: "Can you help me prepare for a Google SWE interview?",
    time: "9:42 AM",
  },
  {
    role: "ai",
    text: "Absolutely! Based on recent Google interview patterns, focus on:\n\n• **System Design** — Distributed systems, scalability trade-offs\n• **DSA** — Graphs, Dynamic Programming, Trees\n• **Behavioral** — Use STAR format with measurable impact\n\nYour resume shows strong React & Node.js skills — great foundation. Want a mock interview or a 4-week prep roadmap?",
    time: "9:42 AM",
  },
];

const quickActions = [
  {
    title: "Resume Review",
    desc: "Get instant ATS score and keyword improvements.",
    icon: FileText,
    color: "text-blue-400",
    bg: "from-blue-600/20 to-cyan-600/20",
    border: "hover:border-blue-500/40",
    glow: "hover:shadow-[0_0_32px_-8px_rgba(59,130,246,0.35)]",
  },
  {
    title: "Interview Prep",
    desc: "Company-specific questions and mock sessions.",
    icon: Building2,
    color: "text-purple-400",
    bg: "from-purple-600/20 to-blue-600/20",
    border: "hover:border-purple-500/40",
    glow: "hover:shadow-[0_0_32px_-8px_rgba(139,92,246,0.35)]",
  },
  {
    title: "Career Roadmap",
    desc: "A dynamic path tailored to your target role.",
    icon: Map,
    color: "text-emerald-400",
    bg: "from-emerald-600/20 to-teal-600/20",
    border: "hover:border-emerald-500/40",
    glow: "hover:shadow-[0_0_32px_-8px_rgba(16,185,129,0.3)]",
  },
  {
    title: "Skill Gap Analysis",
    desc: "See exactly what skills you're missing for the role.",
    icon: BrainCircuit,
    color: "text-amber-400",
    bg: "from-amber-600/20 to-orange-600/20",
    border: "hover:border-amber-500/40",
    glow: "hover:shadow-[0_0_32px_-8px_rgba(245,158,11,0.3)]",
  },
];

const insights = [
  {
    icon: Sparkles,
    iconColor: "text-purple-400",
    iconBg: "from-purple-600/20 to-blue-600/20 border-purple-500/20",
    label: "Personalized Pick",
    title: "System Design is your #1 gap",
    desc: "You have strong coding skills but limited system design exposure. Adding 2 hrs/week could push readiness from 72% → 91%.",
  },
  {
    icon: Target,
    iconColor: "text-blue-400",
    iconBg: "from-blue-600/20 to-cyan-600/20 border-blue-500/20",
    label: "Next Milestone",
    title: "Complete 3 mock interviews",
    desc: "You've done 1 of 3 this week. Mock sessions are the fastest way to build confidence before real interviews.",
  },
  {
    icon: Calendar,
    iconColor: "text-emerald-400",
    iconBg: "from-emerald-600/20 to-teal-600/20 border-emerald-500/20",
    label: "Weekly Focus",
    title: "Dynamic Programming week",
    desc: "Solve 5 DP problems this week. Start with Climbing Stairs, Coin Change, and House Robber to build intuition.",
  },
  {
    icon: Zap,
    iconColor: "text-amber-400",
    iconBg: "from-amber-600/20 to-orange-600/20 border-amber-500/20",
    label: "Keep Going",
    title: "You're in the top 18% of users",
    desc: "Your 12-day streak puts you ahead of most. Consistency compounds — keep showing up and the offers will follow.",
  },
];

// ── Component ───────────────────────────────────────────────────────────────

export default function AICopilot() {
  return (
    <div className="min-h-screen px-6 py-12">
      <div className="max-w-6xl mx-auto space-y-16">

        {/* ── Hero Section ── */}
        <div className="text-center space-y-6">
          <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm text-primary">
            🤖 AI Career Coach · Always On
          </div>

          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-white">
            AI Copilot
          </h1>

          <p className="max-w-2xl mx-auto text-lg text-muted-foreground leading-relaxed">
            Your personal AI career strategist. Get hyper-personalized interview prep,
            resume feedback, and a roadmap built around your dream role.
          </p>

          <div className="flex flex-wrap justify-center gap-3 pt-2">
            {[
              { emoji: "⚡", label: "Instant Feedback" },
              { emoji: "🎯", label: "Role-Specific Prep" },
              { emoji: "📈", label: "Progress Tracking" },
            ].map(({ emoji, label }) => (
              <div
                key={label}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white backdrop-blur-md"
              >
                {emoji} {label}
              </div>
            ))}
          </div>
        </div>

        {/* ── AI Chat Interface ── */}
        <div className="flex justify-center">
          <div className="w-full max-w-2xl rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden">

            {/* Chat header */}
            <div className="flex items-center gap-3 px-6 py-4 border-b border-white/[0.08] bg-white/[0.03]">
              <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 shadow-[0_0_16px_-2px_rgba(139,92,246,0.6)]">
                <BrainCircuit className="h-4 w-4 text-white" />
                {/* Online dot */}
                <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 border-2 border-[#0f0f14]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">PlaceMentor AI</p>
                <p className="text-[11px] text-emerald-400 font-medium">Online · Ready to help</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex flex-col gap-5 px-6 py-6 min-h-[320px]">
              {aiMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                >
                  {/* Avatar */}
                  {msg.role === "ai" ? (
                    <div className="flex-shrink-0 flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600/40 to-blue-600/40 border border-purple-500/20 mt-0.5">
                      <BrainCircuit className="h-3.5 w-3.5 text-purple-300" />
                    </div>
                  ) : (
                    <div className="flex-shrink-0 flex h-8 w-8 items-center justify-center rounded-xl bg-white/10 border border-white/10 text-xs font-bold text-white mt-0.5">
                      A
                    </div>
                  )}

                  {/* Bubble */}
                  <div className={`max-w-[78%] flex flex-col gap-1 ${msg.role === "user" ? "items-end" : "items-start"}`}>
                    <div
                      className={`rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-line ${
                        msg.role === "ai"
                          ? "bg-white/[0.07] border border-white/[0.08] text-white/90 rounded-tl-sm"
                          : "bg-gradient-to-br from-purple-600 to-blue-600 text-white rounded-tr-sm shadow-[0_0_20px_-4px_rgba(139,92,246,0.5)]"
                      }`}
                      dangerouslySetInnerHTML={{
                        __html: msg.text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>"),
                      }}
                    />
                    <span className="text-[10px] text-muted-foreground px-1">{msg.time}</span>
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              <div className="flex gap-3">
                <div className="flex-shrink-0 flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600/40 to-blue-600/40 border border-purple-500/20">
                  <BrainCircuit className="h-3.5 w-3.5 text-purple-300" />
                </div>
                <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-sm bg-white/[0.07] border border-white/[0.08] px-4 py-3">
                  {[0, 150, 300].map((delay) => (
                    <span
                      key={delay}
                      className="h-1.5 w-1.5 rounded-full bg-purple-400 animate-bounce"
                      style={{ animationDelay: `${delay}ms`, animationDuration: "1s" }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Input box */}
            <div className="px-5 pb-5">
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 focus-within:border-purple-500/50 focus-within:shadow-[0_0_20px_-6px_rgba(139,92,246,0.4)] transition-all duration-200">
                <input
                  type="text"
                  placeholder="Ask your AI coach anything..."
                  className="flex-1 bg-transparent text-sm text-white placeholder:text-muted-foreground/60 outline-none"
                />
                <button
                  type="button"
                  aria-label="Send message"
                  className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 shadow-[0_0_14px_-2px_rgba(139,92,246,0.6)] transition-all duration-200 hover:scale-105 hover:shadow-[0_0_20px_-2px_rgba(139,92,246,0.8)] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
                >
                  <Send className="h-3.5 w-3.5 text-white" />
                </button>
              </div>
              <p className="mt-2 text-center text-[11px] text-muted-foreground/50">
                PlaceMentor AI may make mistakes. Verify important career decisions.
              </p>
            </div>
          </div>
        </div>

        {/* ── Quick Action Cards ── */}
        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600/30 to-blue-600/30 border border-purple-500/20">
              <Zap className="h-4 w-4 text-purple-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">Quick Actions</h2>
              <p className="text-xs text-muted-foreground">Jump straight into a focused session</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map(({ title, desc, icon: Icon, color, bg, border, glow }) => (
              <button
                key={title}
                type="button"
                className={`group relative text-left rounded-2xl border border-white/[0.08] bg-white/5 backdrop-blur-xl p-5 flex flex-col gap-4 transition-all duration-300 ${border} ${glow} hover:bg-white/[0.08] hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500`}
              >
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-gradient-to-br ${bg} transition-transform duration-300 group-hover:scale-105`}>
                  <Icon className={`h-5 w-5 ${color}`} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-white mb-1">{title}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
                </div>
                <div className={`flex items-center gap-1 text-xs font-semibold ${color} opacity-0 group-hover:opacity-100 transition-opacity duration-200`}>
                  Start session
                  <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform duration-200" />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* ── AI Insights Panel ── */}
        <div className="space-y-5 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600/30 to-blue-600/30 border border-purple-500/20">
              <Sparkles className="h-4 w-4 text-purple-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">AI Insights</h2>
              <p className="text-xs text-muted-foreground">Personalized for Aakash · Updated today</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {insights.map(({ icon: Icon, iconColor, iconBg, label, title, desc }) => (
              <div
                key={title}
                className="group rounded-2xl border border-white/[0.08] bg-white/5 backdrop-blur-xl p-6 flex gap-4 transition-all duration-300 hover:border-white/[0.15] hover:bg-white/[0.08] hover:-translate-y-0.5"
              >
                <div className={`flex-shrink-0 flex h-10 w-10 items-center justify-center rounded-xl border bg-gradient-to-br ${iconBg} mt-0.5`}>
                  <Icon className={`h-4 w-4 ${iconColor}`} />
                </div>
                <div className="flex flex-col gap-1">
                  <span className={`text-[11px] font-semibold uppercase tracking-widest ${iconColor} opacity-80`}>
                    {label}
                  </span>
                  <p className="text-sm font-semibold text-white leading-snug">{title}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}