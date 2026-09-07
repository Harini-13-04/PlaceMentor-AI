import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { API_URL, getAuthHeaders } from "@/config";

import {
  Bot,
  X,
  Send,
  Sparkles,
  HelpCircle,
  Lightbulb,
  Code2,
  AlertCircle,
  CheckCircle2,
  BookOpen,
  ChevronRight,
  Maximize2,
  Minimize2,
  RefreshCw,
  Layers,
} from "lucide-react";

interface Message {
  id: string;
  sender: "user" | "mentor";
  text: string;
  sources?: {
    id: string;
    title: string;
    category: string;
    relevance_score: number;
    snippet: string;
  }[];
  suggestedFollowups?: string[];
  timestamp: string;
}

export default function GlobalAIMentor() {
  const { user } = useAuth();
  const location = useLocation();

  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputQuery, setInputQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome-1",
      sender: "mentor",
      text: "Hello! I am your **PlaceMentor AI** coach. Ask me anything about coding algorithms, Big-O complexity, TCS/Amazon interview blueprints, core CS concepts, or speed aptitude shortcuts.",
      suggestedFollowups: [
        "How do I solve Two Pointers problems?",
        "Explain Amazon SDE interview rounds",
        "What are the 4 Coffman conditions for Deadlock?",
      ],
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  // Context detection based on active route
  const getRouteContext = () => {
    const path = location.pathname;
    if (path.startsWith("/practice")) {
      return { module: "Practice IDE", contextTag: "Coding & Algorithms Workspace" };
    }
    if (path.startsWith("/aptitude")) {
      return { module: "Aptitude Lab", contextTag: "Quantitative & Logical Aptitude" };
    }
    if (path.startsWith("/quizee") || path.startsWith("/quiz")) {
      return { module: "CS Quizee", contextTag: "Core CS Fundamentals (OS/DBMS/Networks)" };
    }
    if (path.startsWith("/brain-zone")) {
      return { module: "Brain Zone", contextTag: "Cognitive Training & Deductive Logic" };
    }
    if (path.startsWith("/placement-readiness")) {
      return { module: "Placement Readiness", contextTag: "Competency Benchmarks & Roadmap" };
    }
    if (path.startsWith("/recommendations")) {
      return { module: "Smart Recommendations", contextTag: "Personalized Daily Action Items" };
    }
    return { module: "Dashboard", contextTag: "Placement Preparation Hub" };
  };

  const activeContext = getRouteContext();

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputQuery).trim();
    if (!query || isLoading) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      sender: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery("");
    setIsLoading(true);

    try {
      const historyPayload = messages.slice(-4).map((m) => ({
        sender: m.sender,
        text: m.text,
      }));

      const res = await fetch(`${API_URL}/api/mentor/ask`, {
        method: "POST",
        headers: getAuthHeaders(true),
        body: JSON.stringify({

          question: query,
          context: {
            problemTitle: activeContext.module,
            problemTopic: activeContext.contextTag,
            currentRoute: location.pathname,
          },
          history: historyPayload,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const mentorMsg: Message = {
          id: `m-${Date.now()}`,
          sender: "mentor",
          text: data.answer || "I am analyzing your placement query.",
          sources: data.sources || [],
          suggestedFollowups: data.suggested_followups || [],
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        setMessages((prev) => [...prev, mentorMsg]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: `err-${Date.now()}`,
            sender: "mentor",
            text: "I am having trouble connecting to the knowledge base. Please try again in a moment.",
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ]);
      }
    } catch (err) {
      console.error("AI Mentor request failed:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: "mentor",
          text: "Unable to connect to PlaceMentor AI. Please check your network connection.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickActions = [
    { label: "Give Hint", query: `Can you give me a gentle architectural hint for ${activeContext.contextTag}?` },
    { label: "Explain Concept", query: `Explain the core concept and time complexity of ${activeContext.contextTag}` },
    { label: "Common Mistakes", query: `What are the most frequent interview mistakes on ${activeContext.contextTag}?` },
  ];

  return (
    <>
      {/* 1. Global Floating AI Action Button (Bottom-Right) */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          aria-label="Open AI Mentor"
          title="Open PlaceMentor AI Assistant"
          className="fixed bottom-6 right-6 z-40 p-3.5 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-xl hover:shadow-purple-500/25 transition-all transform hover:-translate-y-1 active:translate-y-0 flex items-center gap-2 group border border-white/20"
        >
          <div className="relative">
            <Bot className="w-5 h-5 text-white" />
            <span className="w-2 h-2 rounded-full bg-emerald-400 absolute -top-0.5 -right-0.5 ring-2 ring-purple-600 animate-pulse" />
          </div>
          <span className="text-xs font-bold font-display pr-1 hidden sm:inline">AI Mentor</span>
        </button>
      )}

      {/* 2. Docked Assistant Panel (Slide-in) */}
      {isOpen && (
        <div
          className={`fixed z-50 transition-all duration-300 shadow-2xl flex flex-col bg-card border border-border overflow-hidden ${
            isExpanded
              ? "inset-4 sm:inset-10 rounded-3xl"
              : "bottom-4 right-4 sm:bottom-6 sm:right-6 w-[calc(100vw-2rem)] sm:w-[420px] h-[600px] max-h-[85vh] rounded-3xl"
          }`}
        >
          {/* Header */}
          <div className="px-4 py-3.5 border-b border-border bg-secondary/40 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-white font-bold text-xs shadow-sm shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs font-bold text-foreground truncate">PlaceMentor AI</h3>
                  <span className="px-1.5 py-0.2 text-[9px] font-mono font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded border border-purple-500/20">
                    RAG Grounded
                  </span>
                </div>
                <p className="text-[10px] text-muted-foreground truncate">{activeContext.module} • {activeContext.contextTag}</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                title={isExpanded ? "Collapse" : "Expand"}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              >
                {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Close AI Mentor"
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Action Chips Bar */}
          <div className="px-3 py-2 border-b border-border bg-background/50 flex gap-1.5 overflow-x-auto shrink-0 scrollbar-none">
            {quickActions.map((qa, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSendMessage(qa.query)}
                className="px-2.5 py-1 rounded-lg border border-border bg-secondary/50 hover:bg-secondary text-[11px] font-semibold text-muted-foreground hover:text-foreground whitespace-nowrap transition-colors flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3 text-purple-500" />
                {qa.label}
              </button>
            ))}
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-background/30 text-xs">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2.5 ${m.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {m.sender === "mentor" && (
                  <div className="w-6 h-6 rounded-lg bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0 mt-0.5">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 space-y-2 ${
                    m.sender === "user"
                      ? "bg-purple-600 text-white shadow-sm font-medium"
                      : "bg-card border border-border text-foreground shadow-sm"
                  }`}
                >
                  <div className="whitespace-pre-wrap leading-relaxed">
                    {m.text}
                  </div>

                  {/* Grounding Source Citations */}
                  {m.sources && m.sources.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-border/60 space-y-1">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                        Grounded Sources
                      </p>
                      <div className="space-y-1">
                        {m.sources.map((s, idx) => (
                          <div
                            key={idx}
                            className="p-1.5 rounded-lg bg-secondary/60 border border-border text-[10px] text-muted-foreground"
                          >
                            <span className="font-bold text-foreground">[{idx + 1}] {s.title}</span>
                            <p className="line-clamp-2 mt-0.5">{s.snippet}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Suggested Followups */}
                  {m.suggestedFollowups && m.suggestedFollowups.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-border/40 flex flex-wrap gap-1.5">
                      {m.suggestedFollowups.map((sug, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleSendMessage(sug)}
                          className="px-2 py-1 rounded-md bg-secondary/80 hover:bg-secondary text-[10px] text-foreground font-semibold transition-colors flex items-center gap-1 text-left"
                        >
                          <ChevronRight className="w-2.5 h-2.5 text-purple-500" />
                          {sug}
                        </button>
                      ))}
                    </div>
                  )}

                  <div className={`text-[9px] ${m.sender === "user" ? "text-purple-200" : "text-muted-foreground"} text-right`}>
                    {m.timestamp}
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-2.5 justify-start animate-pulse">
                <div className="w-6 h-6 rounded-lg bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <div className="p-3 rounded-2xl bg-card border border-border text-xs text-muted-foreground flex items-center gap-2">
                  <RefreshCw className="w-3 h-3 animate-spin text-purple-500" />
                  Retrieving grounded knowledge...
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Box Footer */}
          <div className="p-3 border-t border-border bg-card shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder="Ask about algorithms, company bars, core CS..."
                className="flex-1 bg-secondary/60 border border-border rounded-xl px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground outline-none focus:border-purple-500 transition-colors"
              />
              <button
                type="submit"
                disabled={!inputQuery.trim() || isLoading}
                aria-label="Send message"
                className="p-2 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white transition-colors shadow-sm shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
