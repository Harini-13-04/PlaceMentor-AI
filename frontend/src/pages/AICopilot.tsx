import { useEffect, useRef, useState, useCallback } from "react";
import { useMemo } from "react";
import {
  BrainCircuit, Send, Plus, Search, MoreHorizontal,
  Pencil, Trash2, X, Check, Pin, PanelLeftClose, PanelLeft,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

type Role = "ai" | "user";

type Message = {
  id: string;
  role: Role;
  text: string;
  time: string;
};

type Conversation = {
  id: string;
  title: string;
  emoji: string;
  lastMessage: string;
  updatedAt: Date;
  messages: Message[];
  userId: string;
  pinned?: boolean;
};

type QuickAction = {
  emoji: string;
  label: string;
  prompt: string;
};

// ─── Constants ───────────────────────────────────────────────────────────────

const USER_NAME = "Harini";
const USER_ID   = "user_harini_001";

const QUICK_ACTIONS: QuickAction[] = [
  { emoji: "📄", label: "Resume Review",  prompt: "Can you review my resume?" },
  { emoji: "💻", label: "Explain Code",   prompt: "Can you explain this code to me?" },
  { emoji: "🎤", label: "Mock Interview", prompt: "Let's do a mock interview." },
  { emoji: "🧠", label: "HR Questions",   prompt: "Ask me some common HR interview questions." },
  { emoji: "🗺️", label: "Career Roadmap",prompt: "Help me build a career roadmap." },
  { emoji: "😂", label: "Fun Chat",       prompt: "I just want to chat for a bit, ask me anything fun." },
];

const DUMMY_CONVERSATIONS: Conversation[] = [
  {
    id: "conv_001", title: "Resume Review", emoji: "📄", pinned: true,
    lastMessage: "Your resume looks great! Add more metrics.",
    updatedAt: new Date(Date.now() - 1000 * 60 * 20), userId: USER_ID,
    messages: [
      { id: "m1", role: "ai",   text: `👋 Hey ${USER_NAME}! What are we building today?`, time: "10:00 AM" },
      { id: "m2", role: "user", text: "Can you review my resume?", time: "10:01 AM" },
      { id: "m3", role: "ai",   text: "Sure! Share your resume and I'll give you detailed feedback on structure, impact, and ATS optimisation.", time: "10:01 AM" },
      { id: "m4", role: "user", text: "Here it is — I have 2 years of experience in frontend development.", time: "10:02 AM" },
      { id: "m5", role: "ai",   text: "Your resume looks great! Add more metrics to your accomplishments — e.g. 'Reduced load time by 40%' rather than 'Improved performance'.", time: "10:03 AM" },
    ],
  },
  {
    id: "conv_002", title: "Arrays Practice", emoji: "💻",
    lastMessage: "Try a sliding window approach here.",
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2), userId: USER_ID,
    messages: [
      { id: "m1", role: "ai",   text: `👋 Hey ${USER_NAME}! What are we building today?`, time: "08:00 AM" },
      { id: "m2", role: "user", text: "Can you explain this code to me?", time: "08:01 AM" },
      { id: "m3", role: "ai",   text: "Of course! Share the code and I'll walk you through it clearly.", time: "08:01 AM" },
      { id: "m4", role: "user", text: "It's a two-pointer problem on arrays.", time: "08:02 AM" },
      { id: "m5", role: "ai",   text: "Two pointers are elegant for array problems. Try a sliding window approach here — it'll bring you from O(n²) to O(n).", time: "08:03 AM" },
    ],
  },
  {
    id: "conv_003", title: "Mock Interview", emoji: "🎤",
    lastMessage: "Great answer! Work on your STAR structure.",
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24), userId: USER_ID,
    messages: [
      { id: "m1", role: "ai",   text: `👋 Hey ${USER_NAME}! What are we building today?`, time: "Yesterday" },
      { id: "m2", role: "user", text: "Let's do a mock interview.", time: "Yesterday" },
      { id: "m3", role: "ai",   text: "Let's go! Tell me about yourself and your experience with frontend development.", time: "Yesterday" },
      { id: "m4", role: "ai",   text: "Great answer! Work on your STAR structure — Situation, Task, Action, Result. It makes your stories land harder.", time: "Yesterday" },
    ],
  },
  {
    id: "conv_004", title: "Fun Chat", emoji: "😂",
    lastMessage: "Haha, fair point! What's your dream tech job?",
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 48), userId: USER_ID,
    messages: [
      { id: "m1", role: "ai",   text: `👋 Hey ${USER_NAME}! What are we building today?`, time: "2 days ago" },
      { id: "m2", role: "user", text: "I just want to chat for a bit, ask me anything fun.", time: "2 days ago" },
      { id: "m3", role: "ai",   text: "Love it! If you had to delete one programming language forever, which one would it be?", time: "2 days ago" },
      { id: "m4", role: "user", text: "PHP, no contest.", time: "2 days ago" },
      { id: "m5", role: "ai",   text: "Haha, fair point! What's your dream tech job then?", time: "2 days ago" },
    ],
  },
  {
    id: "conv_005", title: "Career Guidance", emoji: "🧠",
    lastMessage: "Focus on TypeScript and system design next.",
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 72), userId: USER_ID,
    messages: [
      { id: "m1", role: "ai",   text: `👋 Hey ${USER_NAME}! What are we building today?`, time: "3 days ago" },
      { id: "m2", role: "user", text: "Help me build a career roadmap.", time: "3 days ago" },
      { id: "m3", role: "ai",   text: "Absolutely! Where do you want to be in 2 years — senior engineer, team lead, or somewhere else?", time: "3 days ago" },
      { id: "m4", role: "user", text: "Senior frontend engineer at a product company.", time: "3 days ago" },
      { id: "m5", role: "ai",   text: "Perfect goal. Focus on TypeScript and system design next — those two skills separate mid from senior most reliably.", time: "3 days ago" },
    ],
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function makeWelcome(): Message {
  return {
    id: `msg_${Date.now()}`,
    role: "ai",
    text: `👋 Hey ${USER_NAME}! What are we building today?`,
    time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  };
}

function makeId() {
  return `id_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

type Lang = "english" | "tamil" | "thanglish";
const THANGLISH_HINTS = ["epdi","nalla","sari","vanakkam","da","pa","ji","machi","seri","romba","enna","irukku","po","vaa","thala"];

function detectLanguage(text: string): Lang {
  if (/[\u0B80-\u0BFF]/.test(text)) return "tamil";
  const lower = text.toLowerCase();
  if (THANGLISH_HINTS.some((w) => new RegExp(`\\b${w}\\b`).test(lower))) return "thanglish";
  return "english";
}

function getMentorReply(_: string, lang: Lang): string {
  return {
    english:   "Got it — let's work through this together. Tell me a bit more about where you're starting from, and we'll take it step by step.",
    tamil:     "சரி, இதை ஒன்றாக பார்க்கலாம். நீங்கள் எந்த நிலையில் இருக்கீங்க என்று சொல்லுங்க, படிப்படியா செய்வோம்.",
    thanglish: "Seri da, let's figure this out together! Konjam more details sollu, step by step poyi solve pannalam.",
  }[lang];
}

// ─── ConversationItem ─────────────────────────────────────────────────────────

function ConversationItem({
  conv, isActive, collapsed, onSelect, onRename, onDelete, onPin,
}: {
  conv: Conversation;
  isActive: boolean;
  collapsed: boolean;
  onSelect: () => void;
  onRename: (id: string, title: string) => void;
  onDelete: (id: string) => void;
  onPin:    (id: string) => void;
}) {
  const [menuOpen,   setMenuOpen]   = useState(false);
  const [renaming,   setRenaming]   = useState(false);
  const [draftTitle, setDraftTitle] = useState(conv.title);
  const renameRef = useRef<HTMLInputElement>(null);
  const menuRef   = useRef<HTMLDivElement>(null);

  useEffect(() => { if (renaming) renameRef.current?.focus(); }, [renaming]);

  useEffect(() => {
    if (!menuOpen) return;
    const fn = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, [menuOpen]);

  const commitRename = () => {
    const t = draftTitle.trim();
    if (t) onRename(conv.id, t); else setDraftTitle(conv.title);
    setRenaming(false);
  };

  // Collapsed: emoji pill with tooltip
  if (collapsed) {
    return (
      <button
        title={conv.title}
        onClick={onSelect}
        className={`w-full flex items-center justify-center h-9 rounded-xl transition-colors ${
          isActive ? "bg-white/10 text-white" : "text-gray-500 hover:bg-white/[0.06] hover:text-white"
        }`}
      >
        <span className="text-base leading-none">{conv.emoji}</span>
      </button>
    );
  }

  return (
    <div
      role="button" tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter" && !renaming) onSelect(); }}
      onClick={() => { if (!renaming) onSelect(); }}
      className={`group relative flex items-center gap-2.5 rounded-xl px-3 py-2.5 cursor-pointer select-none transition-all duration-150 ${
        isActive ? "bg-white/[0.09] text-white" : "text-gray-400 hover:bg-white/[0.05] hover:text-white"
      }`}
    >
      {conv.pinned && (
        <span className="absolute top-1.5 right-1.5 h-1 w-1 rounded-full bg-purple-500 opacity-70" />
      )}

      <span className="text-sm leading-none shrink-0">{conv.emoji}</span>

      <div className="flex-1 min-w-0">
        {renaming ? (
          <input
            ref={renameRef}
            value={draftTitle}
            onChange={(e) => setDraftTitle(e.target.value)}
            onBlur={commitRename}
            onKeyDown={(e) => {
              e.stopPropagation();
              if (e.key === "Enter")  commitRename();
              if (e.key === "Escape") { setDraftTitle(conv.title); setRenaming(false); }
            }}
            onClick={(e) => e.stopPropagation()}
            className="w-full bg-transparent outline-none text-sm text-white"
          />
        ) : (
          <>
            <p className="text-sm truncate leading-snug">{conv.title}</p>
            <p className="text-[11px] text-gray-600 truncate mt-0.5">{conv.lastMessage}</p>
          </>
        )}
      </div>

      {renaming ? (
        <button
          onClick={(e) => { e.stopPropagation(); commitRename(); }}
          className="shrink-0 flex items-center justify-center h-5 w-5 rounded hover:bg-white/10"
        >
          <Check size={12} className="text-emerald-400" />
        </button>
      ) : (
        <div
          ref={menuRef}
          className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0 relative"
          onClick={(e) => { e.stopPropagation(); setMenuOpen((v) => !v); }}
        >
          <button
            className={`flex items-center justify-center h-6 w-6 rounded-lg transition-colors ${
              menuOpen ? "bg-white/10 text-white" : "text-gray-500 hover:bg-white/10 hover:text-white"
            }`}
          >
            <MoreHorizontal size={13} />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-7 z-50 w-40 rounded-xl border border-white/10 bg-[#18181f] shadow-2xl shadow-black/60 py-1 overflow-hidden">
              <button
                onClick={(e) => { e.stopPropagation(); setRenaming(true); setMenuOpen(false); }}
                className="flex items-center gap-2.5 w-full px-3 py-2 text-[13px] text-gray-300 hover:bg-white/[0.06] hover:text-white transition-colors"
              >
                <Pencil size={12} className="text-gray-500" /> Rename
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onPin(conv.id); setMenuOpen(false); }}
                className="flex items-center gap-2.5 w-full px-3 py-2 text-[13px] text-gray-300 hover:bg-white/[0.06] hover:text-white transition-colors"
              >
                <Pin size={12} className="text-gray-500" /> {conv.pinned ? "Unpin" : "Pin"}
              </button>
              <div className="my-1 border-t border-white/[0.06]" />
              <button
                onClick={(e) => { e.stopPropagation(); onDelete(conv.id); setMenuOpen(false); }}
                className="flex items-center gap-2.5 w-full px-3 py-2 text-[13px] text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <Trash2 size={12} /> Delete
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export default function AICopilot() {
  const [sidebarOpen,    setSidebarOpen]    = useState(true);
  const [searchQuery,    setSearchQuery]    = useState("");
  const [searchOpen,     setSearchOpen]     = useState(false);
  const [conversations,  setConversations]  = useState<Conversation[]>(DUMMY_CONVERSATIONS);
  const [activeConvId,   setActiveConvId]   = useState(DUMMY_CONVERSATIONS[0].id);
  const [input,          setInput]          = useState("");
  const [isTyping,       setIsTyping]       = useState(false);

  const inputRef       = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const searchRef      = useRef<HTMLInputElement>(null);

  const activeConv = conversations.find((c) => c.id === activeConvId)!;
  const messages = useMemo(
  () => activeConv?.messages ?? [],
  [activeConv]
);

  // Auto-scroll only the messages container
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  // ── Conversation actions ──────────────────────────────────────────────────

  const selectConversation = (id: string) => {
    setActiveConvId(id);
    setSearchOpen(false);
    setSearchQuery("");
  };

  const newChat = useCallback(() => {
    const conv: Conversation = {
      id: makeId(), title: "New Chat", emoji: "💬",
      lastMessage: "", updatedAt: new Date(),
      userId: USER_ID, messages: [makeWelcome()],
    };
    setConversations((prev) => [conv, ...prev]);
    setActiveConvId(conv.id);
  }, []);

  const renameConversation = (id: string, title: string) =>
    setConversations((prev) => prev.map((c) => (c.id === id ? { ...c, title } : c)));

  const deleteConversation = (id: string) => {
    setConversations((prev) => {
      const next = prev.filter((c) => c.id !== id);
      if (id === activeConvId) {
        if (next.length > 0) {
          setActiveConvId(next[0].id);
        } else {
          const fresh: Conversation = {
            id: makeId(), title: "New Chat", emoji: "💬",
            lastMessage: "", updatedAt: new Date(),
            userId: USER_ID, messages: [makeWelcome()],
          };
          setActiveConvId(fresh.id);
          return [fresh];
        }
      }
      return next;
    });
  };

  const pinConversation = (id: string) =>
    setConversations((prev) => prev.map((c) => (c.id === id ? { ...c, pinned: !c.pinned } : c)));

  // ── Send ─────────────────────────────────────────────────────────────────

  const handleSend = (text?: string) => {
    const content = (text ?? input).trim();
    if (!content) return;

    const userMsg: Message = {
      id: makeId(), role: "user", text: content,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeConvId
          ? { ...c, messages: [...c.messages, userMsg], lastMessage: content, updatedAt: new Date() }
          : c
      )
    );
    setInput("");
    setIsTyping(true);

    const lang = detectLanguage(content);
    setTimeout(() => {
      const aiMsg: Message = {
        id: makeId(), role: "ai", text: getMentorReply(content, lang),
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setConversations((prev) =>
        prev.map((c) =>
          c.id === activeConvId
            ? { ...c, messages: [...c.messages, aiMsg], lastMessage: aiMsg.text, updatedAt: new Date() }
            : c
        )
      );
      setIsTyping(false);
    }, 700);
  };

  const handleQuickAction = (action: QuickAction) => {
    setInput(action.prompt);
    inputRef.current?.focus();
  };

  // ── Filtered list ─────────────────────────────────────────────────────────

  const filtered = searchQuery.trim()
    ? conversations.filter(
        (c) =>
          c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : conversations;

  const pinned = filtered.filter((c) => c.pinned);
  const recent = filtered.filter((c) => !c.pinned);

  // ─── Render ───────────────────────────────────────────────────────────────
  //
  // Layout contract (outermost → innermost):
  //
  //  [viewport: h-screen overflow-hidden]
  //  └─ flex row (sidebar | main)
  //      ├─ SIDEBAR  flex col, h-full, overflow-hidden
  //      │   ├─ [fixed] header: New Chat + Search toggle + Collapse btn   (shrink-0)
  //      │   ├─ [fixed] search input (conditional)                        (shrink-0)
  //      │   └─ [scroll] conversation list                                (flex-1 overflow-y-auto)
  //      │
  //      └─ MAIN     flex col, h-full, overflow-hidden, min-w-0
  //          ├─ [fixed] conversation header bar                           (shrink-0)
  //          ├─ [scroll] messages                                         (flex-1 overflow-y-auto)
  //          └─ [fixed] bottom panel: quick chips + input                 (shrink-0)

  return (
    <div
      className="flex bg-[#0f0f14]"
      style={{
        height: "100vh",
        overflow: "hidden",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >

      {/* ══════════════════════════════════════════════
          SIDEBAR — full height, never scrolls as a unit
      ══════════════════════════════════════════════ */}
      <aside
        style={{
          width: sidebarOpen ? 260 : 52,
          minWidth: sidebarOpen ? 260 : 52,
          transition: "width 0.22s cubic-bezier(0.4,0,0.2,1), min-width 0.22s cubic-bezier(0.4,0,0.2,1)",
          height: "100%",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
        className="border-r border-white/[0.05] bg-[#0c0c11]"
      >

        {/* ── Fixed: sidebar header ── */}
        <div
          style={{ flexShrink: 0 }}
          className={`flex items-center gap-1.5 px-2 border-b border-white/[0.04] ${
            sidebarOpen ? "justify-between" : "justify-center flex-col py-2"
          }`}
          // 52px tall to match the conversation header bar
          // We use min-height so it stays stable on both orientations
        >
          {sidebarOpen ? (
            // Expanded: [New Chat] [Search] [Collapse]
            <div className="flex items-center gap-1 w-full py-2">
              <button
                onClick={newChat}
                className="flex items-center gap-2 flex-1 min-w-0 rounded-xl px-2.5 py-1.5 text-sm font-medium text-white hover:bg-white/[0.06] transition-colors"
              >
                <Plus size={15} className="shrink-0 text-purple-400" />
                <span className="truncate">New Chat</span>
              </button>

              <button
                onClick={() => { setSearchOpen((v) => !v); setSearchQuery(""); }}
                title="Search"
                className={`flex items-center justify-center h-8 w-8 rounded-xl shrink-0 transition-colors ${
                  searchOpen ? "bg-white/10 text-white" : "text-gray-500 hover:bg-white/[0.06] hover:text-white"
                }`}
              >
                {searchOpen ? <X size={14} /> : <Search size={14} />}
              </button>

              <button
                onClick={() => setSidebarOpen(false)}
                title="Collapse"
                className="flex items-center justify-center h-8 w-8 rounded-xl shrink-0 text-gray-600 hover:bg-white/[0.06] hover:text-white transition-colors"
              >
                <PanelLeftClose size={14} />
              </button>
            </div>
          ) : (
            // Collapsed: stacked icon buttons
            <div className="flex flex-col items-center gap-1.5 py-2 w-full">
              <button
                onClick={newChat}
                title="New Chat"
                className="flex items-center justify-center h-8 w-8 rounded-xl text-gray-500 hover:bg-white/[0.06] hover:text-white transition-colors"
              >
                <Plus size={16} />
              </button>
              <button
                onClick={() => setSidebarOpen(true)}
                title="Expand"
                className="flex items-center justify-center h-8 w-8 rounded-xl text-gray-600 hover:bg-white/[0.06] hover:text-white transition-colors"
              >
                <PanelLeft size={14} />
              </button>
            </div>
          )}
        </div>

        {/* ── Fixed: search input (conditional) ── */}
        {sidebarOpen && searchOpen && (
          <div style={{ flexShrink: 0 }} className="px-2 py-2 border-b border-white/[0.04]">
            <div className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-2">
              <Search size={12} className="text-gray-600 shrink-0" />
              <input
                ref={searchRef}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search conversations…"
                className="flex-1 bg-transparent outline-none text-sm text-white placeholder:text-gray-600"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="text-gray-600 hover:text-white">
                  <X size={11} />
                </button>
              )}
            </div>
          </div>
        )}

        {/* ── Scrollable: conversation list ── */}
        <div
          style={{ flex: 1, overflowY: "auto", overflowX: "hidden", scrollbarWidth: "none" }}
          className="px-2 py-2"
        >
          {/* Pinned */}
          {pinned.length > 0 && (
            <div className="mb-2">
              {sidebarOpen && (
                <p className="px-2 mb-1 text-[10px] font-semibold uppercase tracking-widest text-gray-700">
                  Pinned
                </p>
              )}
              <div className="space-y-0.5">
                {pinned.map((conv) => (
                  <ConversationItem
                    key={conv.id} conv={conv}
                    isActive={conv.id === activeConvId}
                    collapsed={!sidebarOpen}
                    onSelect={() => selectConversation(conv.id)}
                    onRename={renameConversation}
                    onDelete={deleteConversation}
                    onPin={pinConversation}
                  />
                ))}
              </div>
              {sidebarOpen && recent.length > 0 && (
                <div className="mt-2 border-t border-white/[0.05]" />
              )}
            </div>
          )}

          {/* Recent */}
          {recent.length > 0 && (
            <div>
              {sidebarOpen && (
                <p className="px-2 mb-1 text-[10px] font-semibold uppercase tracking-widest text-gray-700">
                  Recent
                </p>
              )}
              <div className="space-y-0.5">
                {recent.map((conv) => (
                  <ConversationItem
                    key={conv.id} conv={conv}
                    isActive={conv.id === activeConvId}
                    collapsed={!sidebarOpen}
                    onSelect={() => selectConversation(conv.id)}
                    onRename={renameConversation}
                    onDelete={deleteConversation}
                    onPin={pinConversation}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Empty search */}
          {sidebarOpen && searchQuery && filtered.length === 0 && (
            <div className="flex flex-col items-center gap-2 py-10">
              <Search size={18} className="text-gray-700" />
              <p className="text-xs text-gray-600 text-center">No results for "{searchQuery}"</p>
            </div>
          )}
        </div>
      </aside>

      {/* ══════════════════════════════════════════════
          MAIN — full height, never scrolls as a unit
      ══════════════════════════════════════════════ */}
      <div
        style={{
          flex: 1,
          minWidth: 0,
          height: "100%",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >

        {/* ── Fixed: conversation header ── */}
        <div
          style={{ flexShrink: 0, height: 52, borderBottom: "1px solid rgba(255,255,255,0.05)" }}
          className="flex items-center justify-between px-5 bg-[#0f0f14]"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="text-sm font-semibold text-white truncate">
              {activeConv?.title ?? "Mentor Forge"}
            </span>
            <span className="flex items-center gap-1.5 text-[11px] text-emerald-400 shrink-0">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Online
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600/30 to-blue-600/30 border border-purple-500/20">
              <BrainCircuit size={13} className="text-purple-300" />
            </div>
            <span className="hidden sm:block text-xs font-medium text-white opacity-70">PlaceMentor AI</span>
          </div>
        </div>

        {/* ── Scrollable: messages only ── */}
        <div
          style={{ flex: 1, overflowY: "auto", overflowX: "hidden", scrollbarWidth: "thin", scrollbarColor: "rgba(255,255,255,0.06) transparent" }}
          className="px-5 py-5 space-y-4"
        >
          {/* Welcome state */}
          {messages.length <= 1 && (
            <div className="mb-2">
              <p className="text-xl font-bold text-white mb-1">Hey {USER_NAME} 👋</p>
              <p className="text-sm text-gray-500">What are we working on today?</p>
            </div>
          )}

          {/* Bubbles */}
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.role === "ai" && (
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600/30 to-blue-600/30 border border-purple-500/20 shrink-0 mt-0.5">
                  <BrainCircuit size={13} className="text-purple-300" />
                </div>
              )}
              <div className={`max-w-[72%] flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}>
                <div
                  className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                    msg.role === "ai"
                      ? "bg-white/[0.06] border border-white/[0.07] text-white rounded-tl-sm"
                      : "bg-gradient-to-br from-purple-600 to-blue-600 text-white rounded-tr-sm"
                  }`}
                >
                  {msg.text}
                </div>
                <span className="mt-1 text-[10px] text-gray-700">{msg.time}</span>
              </div>
            </div>
          ))}

          {/* Typing */}
          {isTyping && (
            <div className="flex gap-3 justify-start">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600/30 to-blue-600/30 border border-purple-500/20 shrink-0 mt-0.5">
                <BrainCircuit size={13} className="text-purple-300" />
              </div>
              <div className="rounded-2xl rounded-tl-sm px-4 py-3 bg-white/[0.06] border border-white/[0.07] flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-white/30 animate-bounce [animation-delay:-0.3s]" />
                <span className="h-1.5 w-1.5 rounded-full bg-white/30 animate-bounce [animation-delay:-0.15s]" />
                <span className="h-1.5 w-1.5 rounded-full bg-white/30 animate-bounce" />
              </div>
            </div>
          )}

          {/* Scroll anchor */}
          <div ref={messagesEndRef} />
        </div>

        {/* ── Fixed: quick chips + input ── */}
        <div
          style={{ flexShrink: 0 }}
          className="border-t border-white/[0.05] bg-[#0f0f14] px-5 pt-3 pb-5"
        >
          {/* Quick Action chips — always visible */}
          <div
            className="flex gap-1.5 mb-3"
            style={{ overflowX: "auto", scrollbarWidth: "none" }}
          >
            {QUICK_ACTIONS.map((action) => (
              <button
                key={action.label}
                onClick={() => handleQuickAction(action)}
                className="shrink-0 rounded-full border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.08] hover:text-white px-3 py-1.5 text-[12px] text-gray-500 transition-all duration-150 whitespace-nowrap"
              >
                {action.emoji} {action.label}
              </button>
            ))}
          </div>

          {/* Input box */}
          <div className="flex items-center gap-3 rounded-2xl border border-white/[0.09] bg-white/[0.03] px-4 py-3 focus-within:border-purple-500/30 focus-within:bg-white/[0.05] transition-all duration-200">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) handleSend(); }}
              placeholder="Ask your AI mentor anything…"
              className="flex-1 bg-transparent outline-none text-sm text-white placeholder:text-gray-600"
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim()}
              className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 hover:scale-105 active:scale-95 transition-transform shrink-0 disabled:opacity-30 disabled:scale-100 disabled:cursor-not-allowed"
            >
              <Send size={13} className="text-white" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}