import React, { useState, useRef, useEffect } from "react";
import { Problem, PROBLEMS_DATASET } from "@/data/problems";
import { ExecutionResult } from "./IDECodeEditor";
import { SupportedLanguage } from "@/config/languages";
import { useTheme } from "@/context/ThemeContext";
import {
  Sparkles,
  Send,
  Wand2,
  Lightbulb,
  Cpu,
  Clock,
  HardDrive,
  Loader2,
  BookOpen,
  ArrowRight,
  X,
  Bot,
  User,
  CheckCircle2,
} from "lucide-react";

interface AIMentorSidebarProps {
  problem: Problem;
  selectedLanguage: SupportedLanguage;
  currentCode: string;
  executionResult: ExecutionResult | null;
  onSelectProblem?: (problemId: string) => void;
  onClose: () => void;
}

interface ChatMessage {
  id: string;
  sender: "user" | "mentor";
  text: string;
  timestamp: string;
}

export default function AIMentorSidebar({
  problem,
  selectedLanguage,
  currentCode,
  executionResult,
  onSelectProblem,
  onClose,
}: AIMentorSidebarProps) {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const [activeTab, setActiveTab] = useState<"chat" | "studyPlan">("chat");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [hintIndex, setHintIndex] = useState(0);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll messages
  useEffect(() => {
    if (typeof messagesEndRef.current?.scrollIntoView === "function") {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isThinking]);

  // Handle preset action clicks
  const handleQuickPrompt = (actionType: "hint" | "explain" | "optimal" | "time" | "space") => {
    let userPrompt = "";
    let mentorResponse = "";

    if (actionType === "hint") {
      const hints = problem.hints || ["Try to think about which data structure allows O(1) lookups."];
      const nextIdx = hintIndex % hints.length;
      userPrompt = `Give me a hint (Hint ${nextIdx + 1})`;
      mentorResponse = `💡 **Hint ${nextIdx + 1} of ${hints.length}:**\n\n${hints[nextIdx]}`;
      setHintIndex((prev) => prev + 1);
    } else if (actionType === "explain") {
      userPrompt = "Explain the approach to solve this problem";
      mentorResponse = `🧠 **Problem Intuition & Methodology:**\n\n${problem.description.substring(0, 200)}...\n\n**Core Idea:** Break down the requirements into clear sub-problems. For **${problem.title}**, eliminate redundant computations using optimal data structures.`;
    } else if (actionType === "optimal") {
      userPrompt = "What is the optimal approach?";
      const approaches = problem.optimalApproach || ["Use an optimal hash map or two-pointer technique."];
      mentorResponse = `⚡ **Optimal Strategy:**\n\n` + approaches.map((step, i) => `${i + 1}. ${step}`).join("\n");
    } else if (actionType === "time") {
      userPrompt = "What is the time complexity?";
      mentorResponse = `⏱ **Time Complexity Benchmark:**\n\n**${problem.timeComplexity || "O(n) runtime"}**\n\nThis is optimal because each input item is processed in constant amortized time.`;
    } else if (actionType === "space") {
      userPrompt = "What is the space complexity?";
      mentorResponse = `🔄 **Space Complexity Benchmark:**\n\n**${problem.spaceComplexity || "O(n) auxiliary space"}**\n\nAllocated for state storage and auxiliary data structures.`;
    }

    const newMsgId = String(Date.now());
    setMessages((prev) => [
      ...prev,
      { id: `${newMsgId}_u`, sender: "user", text: userPrompt, timestamp: "Just now" },
    ]);

    setIsThinking(true);
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { id: `${newMsgId}_m`, sender: "mentor", text: mentorResponse, timestamp: "Just now" },
      ]);
      setIsThinking(false);
    }, 450);
  };

  // Handle user typed message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userText = inputText.trim();
    setInputText("");

    const newMsgId = String(Date.now());
    setMessages((prev) => [
      ...prev,
      { id: `${newMsgId}_u`, sender: "user", text: userText, timestamp: "Just now" },
    ]);

    setIsThinking(true);

    setTimeout(() => {
      let response = `I reviewed your code for **${problem.title}** (${selectedLanguage}). `;

      if (executionResult?.status === "Wrong Answer") {
        response += `Your last run returned **Wrong Answer**. Make sure you verify edge cases like duplicate elements or negative values, and ensure your return format strictly matches the specification.`;
      } else if (executionResult?.status === "Runtime Error" || executionResult?.status === "Compilation Error") {
        response += `I noticed a **${executionResult.status}**. Check your variable declarations, array index boundaries, and language-specific syntax.`;
      } else if (executionResult?.status === "Accepted") {
        response += `🎉 Great job passing the test cases! Think about whether you can further optimize space complexity or edge case handling.`;
      } else {
        response += `You're on the right track! Break down the problem step-by-step. Feel free to click any quick prompt above for progressive hints or complexity guidance.`;
      }

      setMessages((prev) => [
        ...prev,
        { id: `${newMsgId}_m`, sender: "mentor", text: response, timestamp: "Just now" },
      ]);
      setIsThinking(false);
    }, 550);
  };

  return (
    <aside aria-label="AI Assistant Panel" className={`h-full w-full flex flex-col ${isLight ? "bg-white text-slate-800 border-slate-200" : "bg-[#0E131F] text-[#E2E8F0] border-[#1E2638]"} overflow-hidden select-none border-l`}>
      {/* =========================================================================
          1. AI MENTOR HEADER WITH CLOSE (✕) BUTTON
         ========================================================================= */}
      <div className={`h-12 px-4 border-b ${isLight ? "border-slate-200 bg-[#F1F5F9]" : "border-[#1E2638] bg-[#10141D]"} flex items-center justify-between shrink-0`}>
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#8B5CF6]/15 border border-[#8B5CF6]/30 flex items-center justify-center text-[#8B5CF6] shadow-sm">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className={`text-xs font-bold ${isLight ? "text-slate-900" : "text-white"} tracking-wide`}>AI Mentor</h2>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="Ready" />
            </div>
            <p className={`text-[10px] ${isLight ? "text-slate-500" : "text-[#94A3B8]"}`}>PlaceMentor Intelligent Assistant</p>
          </div>
        </div>

        {/* Clearly Visible Close (✕) Button */}
        <button
          type="button"
          onClick={onClose}
          title="Close AI Mentor panel"
          aria-label="Close AI Mentor panel"
          className={`w-7 h-7 rounded-lg flex items-center justify-center border border-transparent transition-all ${
            isLight
              ? "text-slate-500 hover:text-slate-900 hover:bg-slate-200 hover:border-slate-300"
              : "text-[#94A3B8] hover:text-white hover:bg-[#1E2638] hover:border-[#28354D]"
          }`}
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className={`px-4 border-b ${isLight ? "border-slate-200 bg-white" : "border-[#1E2638] bg-[#0E131F]"} flex items-center gap-6 shrink-0 text-xs font-semibold`}>
        <button
          type="button"
          onClick={() => setActiveTab("chat")}
          className={`py-2.5 transition-colors relative ${
            activeTab === "chat"
              ? isLight
                ? "text-slate-900 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#7C3AED]"
                : "text-white after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#8B5CF6]"
              : isLight
              ? "text-slate-500 hover:text-slate-900"
              : "text-[#94A3B8] hover:text-white"
          }`}
        >
          Chat & Hints
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("studyPlan")}
          className={`py-2.5 transition-colors relative ${
            activeTab === "studyPlan"
              ? isLight
                ? "text-slate-900 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#7C3AED]"
                : "text-white after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#8B5CF6]"
              : isLight
              ? "text-slate-500 hover:text-slate-900"
              : "text-[#94A3B8] hover:text-white"
          }`}
        >
          Study Pathway
        </button>
      </div>

      {/* =========================================================================
          2. MAIN BODY
         ========================================================================= */}
      {activeTab === "chat" ? (
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
          {/* Messages & Actions Scroll Area */}
          <div className={`flex-1 overflow-y-auto p-4 space-y-4 text-xs ${isLight ? "bg-[#F8FAFC]" : "bg-[#0E131F]"}`}>
            {/* Greeting Card */}
            <div className={`p-3.5 rounded-xl border space-y-1.5 shadow-sm ${
              isLight
                ? "border-purple-200 bg-gradient-to-br from-purple-50 via-white to-white"
                : "border-purple-500/20 bg-gradient-to-br from-purple-500/10 via-[#141923] to-[#141923]"
            }`}>
              <div className={`font-bold flex items-center gap-1.5 text-xs ${isLight ? "text-purple-950" : "text-white"}`}>
                <span>Hi! I'm your AI Mentor</span>
                <span>👋</span>
              </div>
              <p className={`text-[11px] leading-relaxed ${isLight ? "text-slate-600" : "text-[#94A3B8]"}`}>
                Need guidance for <strong className={isLight ? "text-slate-900" : "text-[#E2E8F0]"}>{problem.title}</strong>? Ask questions, request hints, or review optimal approaches below.
              </p>
            </div>

            {/* Quick Prompt Buttons */}
            {messages.length === 0 && (
              <div className="space-y-2 pt-1">
                <span className={`text-[11px] font-semibold ${isLight ? "text-slate-500" : "text-[#94A3B8]"}`}>Suggested Quick Prompts:</span>

                <div className="space-y-1.5">
                  <button
                    type="button"
                    onClick={() => handleQuickPrompt("hint")}
                    className={`w-full flex items-center gap-2.5 p-2.5 rounded-xl border transition-all text-left group ${
                      isLight
                        ? "border-slate-200 bg-white hover:bg-slate-100 text-slate-800 hover:border-purple-300"
                        : "border-[#1E2638] bg-[#141923] hover:bg-[#1C2331] text-[#E2E8F0] hover:border-[#8B5CF6]/50"
                    }`}
                  >
                    <Wand2 className={`w-3.5 h-3.5 ${isLight ? "text-purple-600" : "text-[#A78BFA]"} shrink-0 group-hover:scale-110 transition-transform`} />
                    <span className="text-xs font-medium">Give me a hint</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickPrompt("explain")}
                    className={`w-full flex items-center gap-2.5 p-2.5 rounded-xl border transition-all text-left group ${
                      isLight
                        ? "border-slate-200 bg-white hover:bg-slate-100 text-slate-800 hover:border-purple-300"
                        : "border-[#1E2638] bg-[#141923] hover:bg-[#1C2331] text-[#E2E8F0] hover:border-[#8B5CF6]/50"
                    }`}
                  >
                    <Lightbulb className="w-3.5 h-3.5 text-amber-500 shrink-0 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-medium">Explain problem intuition</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickPrompt("optimal")}
                    className={`w-full flex items-center gap-2.5 p-2.5 rounded-xl border transition-all text-left group ${
                      isLight
                        ? "border-slate-200 bg-white hover:bg-slate-100 text-slate-800 hover:border-purple-300"
                        : "border-[#1E2638] bg-[#141923] hover:bg-[#1C2331] text-[#E2E8F0] hover:border-[#8B5CF6]/50"
                    }`}
                  >
                    <Cpu className="w-3.5 h-3.5 text-emerald-500 shrink-0 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-medium">Optimal approach strategy</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickPrompt("time")}
                    className={`w-full flex items-center gap-2.5 p-2.5 rounded-xl border transition-all text-left group ${
                      isLight
                        ? "border-slate-200 bg-white hover:bg-slate-100 text-slate-800 hover:border-purple-300"
                        : "border-[#1E2638] bg-[#141923] hover:bg-[#1C2331] text-[#E2E8F0] hover:border-[#8B5CF6]/50"
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5 text-blue-500 shrink-0 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-medium">Time complexity analysis</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickPrompt("space")}
                    className={`w-full flex items-center gap-2.5 p-2.5 rounded-xl border transition-all text-left group ${
                      isLight
                        ? "border-slate-200 bg-white hover:bg-slate-100 text-slate-800 hover:border-purple-300"
                        : "border-[#1E2638] bg-[#141923] hover:bg-[#1C2331] text-[#E2E8F0] hover:border-[#8B5CF6]/50"
                    }`}
                  >
                    <HardDrive className="w-3.5 h-3.5 text-pink-500 shrink-0 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-medium">Space complexity analysis</span>
                  </button>
                </div>
              </div>
            )}

            {/* Conversation History */}
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.sender === "mentor" && (
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                    isLight ? "bg-purple-100 border border-purple-300 text-purple-600" : "bg-[#8B5CF6]/20 border border-[#8B5CF6]/40 text-[#A78BFA]"
                  }`}>
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                )}

                <div
                  className={`p-3 rounded-2xl max-w-[85%] leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-sm rounded-tr-sm"
                      : isLight
                      ? "bg-white border border-slate-200 text-slate-800 shadow-sm rounded-tl-sm"
                      : "bg-[#141923] border border-[#1E2638] text-[#E2E8F0] rounded-tl-sm"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                </div>
              </div>
            ))}

            {isThinking && (
              <div className={`flex gap-2 items-center text-[11px] p-2 ${isLight ? "text-slate-500" : "text-[#94A3B8]"}`}>
                <Loader2 className={`w-3.5 h-3.5 animate-spin ${isLight ? "text-purple-600" : "text-[#A78BFA]"}`} />
                <span>AI Mentor is thinking...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Bottom Chat Input Form */}
          <form onSubmit={handleSendMessage} className={`p-3 border-t ${isLight ? "border-slate-200 bg-[#F1F5F9]" : "border-[#1E2638] bg-[#10141D]"} shrink-0`}>
            <div className="relative flex items-center">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ask AI Mentor anything..."
                className={`w-full pl-3.5 pr-10 py-2.5 text-xs rounded-xl border transition-colors focus:outline-none ${
                  isLight
                    ? "border-slate-300 bg-white text-slate-800 placeholder-slate-400 focus:border-[#7C3AED]"
                    : "border-[#28354D] bg-[#141923] text-[#E2E8F0] placeholder-[#64748B] focus:border-[#8B5CF6]"
                }`}
              />
              <button
                type="submit"
                disabled={!inputText.trim()}
                className={`absolute right-2 p-1.5 transition-colors rounded-lg disabled:opacity-40 ${
                  isLight ? "text-[#7C3AED] hover:bg-slate-200" : "text-[#8B5CF6] hover:text-[#A78BFA] hover:bg-[#1E2638]"
                }`}
                title="Send message"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* Study Pathway Tab */
        <div className={`flex-1 overflow-y-auto p-4 space-y-4 text-xs ${isLight ? "bg-[#F8FAFC]" : "bg-[#0E131F]"}`}>
          <div className={`p-3.5 rounded-xl border space-y-2 ${isLight ? "border-slate-200 bg-white text-slate-800" : "border-[#1E2638] bg-[#141923]"}`}>
            <div className={`flex items-center gap-1.5 font-bold ${isLight ? "text-slate-900" : "text-white"}`}>
              <BookOpen className={`w-3.5 h-3.5 ${isLight ? "text-purple-600" : "text-[#A78BFA]"}`} />
              <span>Recommended Study Pathway</span>
            </div>
            <p className={`text-[11px] leading-relaxed ${isLight ? "text-slate-600" : "text-[#94A3B8]"}`}>
              Master core algorithms and data structures related to <strong className={isLight ? "text-slate-900" : "text-[#E2E8F0]"}>{problem.topic}</strong>.
            </p>
          </div>

          <div className="space-y-2">
            <span className={`text-[11px] font-bold uppercase tracking-wider ${isLight ? "text-slate-500" : "text-[#94A3B8]"}`}>Suggested Next Problems</span>
            <div className="space-y-1.5">
              {["Contains Duplicate", "Valid Anagram", "Group Anagrams", "Top K Frequent Elements"].map((title, i) => {
                const targetProb = PROBLEMS_DATASET.find((p) => p.title.toLowerCase() === title.toLowerCase());
                return (
                  <div
                    key={i}
                    onClick={() => {
                      if (targetProb && onSelectProblem) {
                        onSelectProblem(targetProb.id);
                      }
                    }}
                    className={`p-2.5 rounded-xl border flex items-center justify-between transition-all cursor-pointer group ${
                      isLight
                        ? "border-slate-200 bg-white hover:border-purple-400 hover:bg-slate-50"
                        : "border-[#1E2638] bg-[#141923] hover:border-[#8B5CF6]/40"
                    }`}
                    title={targetProb ? `Open problem: ${targetProb.title}` : undefined}
                  >
                    <span className={`font-medium ${isLight ? "text-slate-800 group-hover:text-purple-900" : "text-[#E2E8F0] group-hover:text-white"}`}>{title}</span>
                    <ArrowRight className={`w-3.5 h-3.5 ${isLight ? "text-slate-400 group-hover:text-purple-600" : "text-[#64748B] group-hover:text-[#A78BFA]"} group-hover:translate-x-0.5 transition-all`} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}