import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { API_URL, getAuthHeaders } from "@/config";

import { useTheme } from "@/context/ThemeContext";
import {
  Sparkles,
  Send,
  Bot,
  User,
  BookOpen,
  Code2,
  Trophy,
  Calculator,
  Layers,
  MessageSquare,
  FileText,
  Loader2,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  HelpCircle,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Lightbulb,
} from "lucide-react";

interface SourceItem {
  id: string;
  title: string;
  category: string;
  relevance_score: number;
  snippet: string;
}

interface Message {
  id: string;
  sender: "user" | "mentor";
  text: string;
  sources?: SourceItem[];
  suggestedFollowups?: string[];
  modelUsed?: string;
  timestamp: string;
}

interface TopicItem {
  id: string;
  name: string;
  category: string;
  icon: string;
  description: string;
  starter_prompts: string[];
}

const DEFAULT_TOPICS: TopicItem[] = [
  {
    id: "dsa",
    name: "DSA & Algorithms",
    category: "Coding & Algorithms",
    icon: "Code2",
    description: "Two Pointers, Sliding Window, DP, Graphs, Binary Search, and Heaps.",
    starter_prompts: [
      "How do I solve the 0/1 Knapsack dynamic programming problem?",
      "Explain the two-pointer technique with optimal time complexity.",
      "What is Kahn's algorithm for Topological Sorting in directed graphs?",
      "How does Monotonic Stack find the Next Greater Element in O(n)?",
    ],
  },
  {
    id: "companies",
    name: "Company Blueprints",
    category: "Recruitment Guides",
    icon: "Trophy",
    description: "Amazon 16 LPs, Google algorithmic rigor, TCS Digital, and Infosys DSE.",
    starter_prompts: [
      "What are Amazon's 16 Leadership Principles and how are they evaluated?",
      "How should I structure my problem-solving approach in a Google SDE interview?",
      "What is the exam pattern and cutoff for TCS Digital and Infosys DSE?",
    ],
  },
  {
    id: "aptitude",
    name: "Aptitude & Speed Math",
    category: "Aptitude & DI",
    icon: "Calculator",
    description: "LCM Unit Method, Profit & Loss formulas, Relative Speed, and DI tricks.",
    starter_prompts: [
      "Explain the LCM Unit Method for Time & Work problems.",
      "What are the shortcut formulas for Relative Speed in train problems?",
      "How do I calculate successive discounts and percentage margins quickly?",
    ],
  },
  {
    id: "core_cs",
    name: "Core CS Fundamentals",
    category: "CS Subjects",
    icon: "Layers",
    description: "Operating Systems, DBMS ACID, Computer Networks, and SOLID OOP principles.",
    starter_prompts: [
      "What is the difference between a Process and a Thread in Operating Systems?",
      "Explain ACID properties and B+ Tree indexing in DBMS.",
      "Walk me through what happens when you type a URL in your browser.",
      "What are the SOLID principles in object-oriented software design?",
    ],
  },
  {
    id: "behavioral",
    name: "Behavioral & STAR",
    category: "HR & Interviews",
    icon: "MessageSquare",
    description: "STAR response scripts, handling conflict questions, and salary discussions.",
    starter_prompts: [
      "How do I structure a behavioral answer using the STAR method?",
      "Give me a winning STAR response for 'Tell me about a time you failed'.",
      "How should I answer 'Why should we hire you?' for a campus recruitment drive?",
    ],
  },
  {
    id: "resume",
    name: "Resume & ATS",
    category: "Career Assets",
    icon: "FileText",
    description: "XYZ impact bullet formula, ATS formatting rules, and action verb impact.",
    starter_prompts: [
      "How do I write resume bullet points using the Google XYZ formula?",
      "What are the best high-impact action verbs for software engineering resumes?",
      "How can I optimize my resume to score 90+ on applicant tracking systems?",
    ],
  },
];

export default function AIMentor() {
  const { theme } = useTheme();
  const location = useLocation();

  const [topics, setTopics] = useState<TopicItem[]>(DEFAULT_TOPICS);
  const [selectedTopicId, setSelectedTopicId] = useState<string>("all");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome-1",
      sender: "mentor",
      text: "👋 **Welcome to PlaceMentor AI!**\n\nI am your dedicated real-time placement preparation mentor, grounded directly in curated placement knowledge covering **DSA Algorithms, Company Screening Blueprints (Amazon, Google, TCS), Speed Aptitude, Core CS, and STAR Behavioral Interviews**.\n\nChoose a category below or ask any question to get started!",
      suggestedFollowups: [
        "Explain the two-pointer technique with optimal time complexity.",
        "What are Amazon's 16 Leadership Principles?",
        "Explain the LCM Unit Method for Time & Work aptitude.",
        "What is the difference between a Process and a Thread?",
      ],
      modelUsed: "PlaceMentor Grounded RAG Engine",
      timestamp: "Just now",
    },
  ]);

  const [inputQuery, setInputQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [expandedSourceMsgId, setExpandedSourceMsgId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll on new message
  useEffect(() => {
    if (typeof messagesEndRef.current?.scrollIntoView === "function") {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading]);

  // Fetch topics from backend
  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const res = await fetch(`${API_URL}/api/mentor/topics`);
        if (res.ok) {
          const data = await res.json();
          if (data.topics && data.topics.length > 0) {
            setTopics(data.topics);
          }
        }
      } catch {
        // Use default fallback topics
      }
    };
    fetchTopics();
  }, []);

  const handleSendQuery = async (queryText: string) => {
    const query = queryText.trim();
    if (!query || isLoading) return;

    setErrorMessage(null);
    setInputQuery("");

    const userMessage: Message = {
      id: `u-${Date.now()}`,
      sender: "user",
      text: query,
      timestamp: "Just now",
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Build conversation history for context
      const historyPayload = messages.slice(-4).map((m) => ({
        sender: m.sender,
        text: m.text,
      }));

      const res = await fetch(`${API_URL}/api/mentor/ask`, {
        method: "POST",
        headers: getAuthHeaders(true),
        body: JSON.stringify({
          question: query,
          history: historyPayload,
        }),
      });


      if (!res.ok) {
        throw new Error(`Server returned HTTP ${res.status}`);
      }

      const data = await res.json();

      const mentorMessage: Message = {
        id: `m-${Date.now()}`,
        sender: "mentor",
        text: data.answer || "I reviewed the placement knowledge base for your query.",
        sources: data.sources || [],
        suggestedFollowups: data.suggested_followups || [],
        modelUsed: data.model_used || "PlaceMentor Grounded RAG",
        timestamp: "Just now",
      };

      setMessages((prev) => [...prev, mentorMessage]);
    } catch (err: any) {
      setErrorMessage("Unable to connect to AI Mentor. Please check that the backend is running.");
      const fallbackMessage: Message = {
        id: `m-${Date.now()}`,
        sender: "mentor",
        text: `⚠️ **Connection Notice:** Unable to reach the PlaceMentor backend service.\n\n*Error details: ${err?.message || "Network error"}*\n\nPlease make sure the backend server is running on port 8000.`,
        timestamp: "Just now",
      };
      setMessages((prev) => [...prev, fallbackMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case "Code2":
        return <Code2 className="w-4 h-4 text-purple-600 dark:text-purple-400" />;
      case "Trophy":
        return <Trophy className="w-4 h-4 text-amber-600 dark:text-amber-400" />;
      case "Calculator":
        return <Calculator className="w-4 h-4 text-teal-600 dark:text-teal-400" />;
      case "Layers":
        return <Layers className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
      case "MessageSquare":
        return <MessageSquare className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
      case "FileText":
        return <FileText className="w-4 h-4 text-rose-600 dark:text-rose-400" />;
      default:
        return <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />;
    }
  };

  const currentTopic = topics.find((t) => t.id === selectedTopicId);

  return (
    <div className="space-y-6 font-sans text-foreground max-w-6xl mx-auto">
      {/* Header Banner */}
      <div className="p-6 sm:p-7 rounded-2xl border border-purple-500/25 bg-gradient-to-br from-purple-500/10 via-card to-card dark:from-purple-950/40 dark:via-secondary dark:to-card shadow-sm space-y-3 relative overflow-hidden">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-600 flex items-center justify-center text-white shadow-md shadow-purple-600/30">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground font-display flex items-center gap-2">
                PlaceMentor AI <span className="text-purple-600 dark:text-purple-400 text-sm font-mono px-2 py-0.5 rounded-full bg-purple-500/15 border border-purple-500/30">RAG Engine</span>
              </h1>
              <p className="text-xs text-muted-foreground">
                Grounded placement knowledge retrieval & step-by-step interview coaching
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold font-mono">
              <ShieldCheck className="w-4 h-4" /> Grounded RAG Active
            </span>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-2 scrollbar-none">
          <button
            onClick={() => setSelectedTopicId("all")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedTopicId === "all"
                ? "bg-purple-600 text-white shadow-sm"
                : "bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground border border-border"
            }`}
          >
            All Knowledge Domains
          </button>
          {topics.map((t) => (
            <button
              key={t.id}
              onClick={() => setSelectedTopicId(t.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedTopicId === t.id
                  ? "bg-purple-600 text-white shadow-sm"
                  : "bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground border border-border"
              }`}
            >
              {getCategoryIcon(t.icon)}
              <span>{t.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Two-Column Layout (Prompts Sidebar + Chat Stream) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Left Column: Domain Starter Prompts */}
        <div className="lg:col-span-1 space-y-4">
          <div className="p-4 rounded-2xl border border-border bg-card shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                <span>Suggested Questions</span>
              </h3>
              <span className="text-[10px] text-muted-foreground uppercase font-bold">1-Click</span>
            </div>

            <div className="space-y-2">
              {(currentTopic ? currentTopic.starter_prompts : topics.flatMap((t) => t.starter_prompts).slice(0, 5)).map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendQuery(prompt)}
                  disabled={isLoading}
                  className="w-full p-2.5 rounded-xl border border-border bg-secondary/50 hover:bg-secondary hover:border-purple-500/40 text-left text-xs text-foreground transition-all flex items-start justify-between group disabled:opacity-50"
                >
                  <span className="line-clamp-2 leading-relaxed">{prompt}</span>
                  <ArrowRight className="w-3 h-3 text-muted-foreground group-hover:text-purple-600 dark:group-hover:text-purple-400 shrink-0 mt-0.5 ml-1 transition-transform group-hover:translate-x-0.5" />
                </button>
              ))}
            </div>
          </div>

          {/* RAG Knowledge Architecture Box */}
          <div className="p-4 rounded-2xl border border-border bg-card shadow-sm space-y-2 text-xs">
            <div className="flex items-center gap-1.5 font-bold text-foreground">
              <BookOpen className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
              <span>Knowledge Base Specs</span>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Every response is dynamically retrieved via BM25 semantic ranking from verified placement datasets, avoiding hallucinations.
            </p>
            <div className="pt-1 flex items-center justify-between text-[11px] font-mono text-muted-foreground">
              <span>Indexed Chunks:</span>
              <span className="font-bold text-foreground">18 Modules</span>
            </div>
          </div>
        </div>

        {/* Right Column: Chat Conversation Stream & Input */}
        <div className="lg:col-span-3 flex flex-col h-[650px] rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
          {/* Chat Messages Scroll View */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
            {messages.map((msg) => {
              const isMentor = msg.sender === "mentor";
              const isSourceExpanded = expandedSourceMsgId === msg.id;

              return (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${isMentor ? "justify-start" : "justify-end"}`}
                >
                  {isMentor && (
                    <div className="w-8 h-8 rounded-xl bg-purple-600/15 border border-purple-500/30 flex items-center justify-center text-purple-600 dark:text-purple-400 shrink-0 mt-0.5 shadow-sm">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div className={`space-y-2.5 max-w-[88%] ${isMentor ? "" : "items-end flex flex-col"}`}>
                    <div
                      className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-sm ${
                        isMentor
                          ? "bg-secondary/70 border border-border text-foreground rounded-tl-sm"
                          : "bg-purple-600 text-white rounded-tr-sm"
                      }`}
                    >
                      <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">
                        {msg.text}
                      </div>

                      {/* Model & Timestamp footer */}
                      {isMentor && (
                        <div className="pt-3 mt-3 border-t border-border/50 flex items-center justify-between text-[10px] text-muted-foreground font-mono">
                          <span>Model: {msg.modelUsed || "PlaceMentor Grounded RAG"}</span>
                          <span>{msg.timestamp}</span>
                        </div>
                      )}
                    </div>

                    {/* Grounding Source Citations Badge & Expandable Drawer */}
                    {isMentor && msg.sources && msg.sources.length > 0 && (
                      <div className="rounded-xl border border-border bg-secondary/40 p-2.5 space-y-2 text-xs">
                        <button
                          onClick={() => setExpandedSourceMsgId(isSourceExpanded ? null : msg.id)}
                          className="w-full flex items-center justify-between text-left font-semibold text-purple-700 dark:text-purple-300 hover:underline"
                        >
                          <span className="flex items-center gap-1.5 text-[11px]">
                            <BookOpen className="w-3.5 h-3.5" />
                            <span>{msg.sources.length} Grounded Knowledge Sources Cited</span>
                          </span>
                          {isSourceExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        </button>

                        {isSourceExpanded && (
                          <div className="space-y-2 pt-1.5 border-t border-border/60">
                            {msg.sources.map((src, i) => (
                              <div key={i} className="p-2 rounded-lg bg-card border border-border space-y-1">
                                <div className="flex items-center justify-between">
                                  <span className="font-bold text-foreground text-[11px]">{src.title}</span>
                                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-purple-500/15 text-purple-700 dark:text-purple-300 border border-purple-500/25">
                                    {Math.round(src.relevance_score * 100)}% Match
                                  </span>
                                </div>
                                <p className="text-[10px] text-muted-foreground leading-relaxed">{src.snippet}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Suggested Next Questions */}
                    {isMentor && msg.suggestedFollowups && msg.suggestedFollowups.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {msg.suggestedFollowups.map((followup, i) => (
                          <button
                            key={i}
                            onClick={() => handleSendQuery(followup)}
                            disabled={isLoading}
                            className="px-2.5 py-1 rounded-lg border border-purple-500/30 bg-purple-500/10 hover:bg-purple-500/20 text-purple-700 dark:text-purple-300 text-[11px] font-medium transition-colors"
                          >
                            💬 {followup}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {!isMentor && (
                    <div className="w-8 h-8 rounded-xl bg-purple-600 flex items-center justify-center text-white shrink-0 mt-0.5 shadow-sm">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              );
            })}

            {isLoading && (
              <div className="flex gap-3 justify-start items-center p-3 rounded-2xl bg-secondary/50 border border-border text-xs text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin text-purple-600 dark:text-purple-400" />
                <span>Searching placement knowledge base & generating grounded response...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Bottom Chat Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendQuery(inputQuery);
            }}
            className="p-3.5 border-t border-border bg-secondary/30 shrink-0"
          >
            <div className="relative flex items-center">
              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder="Ask about DSA algorithms, Amazon LPs, Speed Math shortcuts, or Core CS..."
                className="w-full pl-4 pr-12 py-3 text-xs sm:text-sm rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground outline-none focus:border-purple-500 shadow-sm"
              />
              <button
                type="submit"
                disabled={!inputQuery.trim() || isLoading}
                className="absolute right-2 p-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white disabled:opacity-40 transition-colors shadow-sm"
                title="Send Question"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
