import React, { useState, useEffect } from "react";
import {
  Mic,
  MicOff,
  Star,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Lock,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Trophy,
  Award,
  Target,
  Clock,
  AlertTriangle,
  Lightbulb,
  Users,
  Copy,
  Check,
  Radio,
  Volume2,
  Share2,
  MessageSquare,
  Flame,
  Shield,
  HelpCircle,
} from "lucide-react";

export default function Communication() {
  // Active Tab: "speaking" | "gd"
  const [activeTab, setActiveTab] = useState<"speaking" | "gd">("speaking");

  // =========================================================================
  // SPEAKING PRACTICE STATE
  // =========================================================================
  const SPEAKING_PROMPTS = [
    {
      id: "sp-1",
      title: "Tell Me About Yourself (Elevator Pitch)",
      category: "Self Introduction",
      timeLimit: 90,
      difficulty: "Easy",
      tips: "Cover current degree, key projects, core tech stack, and why you are excited for this SDE role.",
    },
    {
      id: "sp-2",
      title: "STAR Story: Handling Technical Disagreements",
      category: "Behavioral STAR",
      timeLimit: 120,
      difficulty: "Medium",
      tips: "Situation -> Task -> Action (how you used data/benchmarks) -> Result (successful consensus).",
    },
    {
      id: "sp-3",
      title: "Explain How HTTPS & SSL/TLS Handshake Works",
      category: "Technical Explanation",
      timeLimit: 120,
      difficulty: "Hard",
      tips: "Clarify asymmetric encryption during key exchange followed by symmetric session encryption.",
    },
    {
      id: "sp-4",
      title: "Why Do You Want to Join Our Company?",
      category: "HR Screening",
      timeLimit: 90,
      difficulty: "Medium",
      tips: "Align company products, engineering culture, and scale with your career trajectory.",
    },
  ];

  const [selectedPrompt, setSelectedPrompt] = useState(SPEAKING_PROMPTS[0]);
  const [isRecording, setIsRecording] = useState(false);
  const [speakingTimer, setSpeakingTimer] = useState(0);
  const [hasRecorded, setHasRecorded] = useState(false);
  const [speakingFeedback, setSpeakingFeedback] = useState<{
    fluency: number;
    clarity: number;
    paceWpm: number;
    fillerWords: string[];
    vocabularyScore: number;
    strengths: string[];
    improvements: string[];
  } | null>(null);

  useEffect(() => {
    let interval: any;
    if (isRecording) {
      interval = setInterval(() => setSpeakingTimer((t) => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const handleToggleRecording = () => {
    if (!isRecording) {
      setIsRecording(true);
      setSpeakingTimer(0);
      setHasRecorded(false);
      setSpeakingFeedback(null);
    } else {
      setIsRecording(false);
      setHasRecorded(true);
      // Generate realistic feedback
      setSpeakingFeedback({
        fluency: 86,
        clarity: 90,
        paceWpm: 138,
        fillerWords: ["um (2x)", "like (1x)"],
        vocabularyScore: 84,
        strengths: [
          "Clear modular structure and articulate vocal cadence",
          "Excellent use of STAR format context framing",
          "Good pacing within the ideal 130-150 WPM target window",
        ],
        improvements: [
          "Reduce hesitation fillers ('um') in opening 15 seconds",
          "Conclude with stronger quantitative impact metrics",
        ],
      });
    }
  };

  // =========================================================================
  // GROUP DISCUSSION (GD) STATE
  // =========================================================================
  const GD_TOPICS = [
    { title: "Generative AI: Job Destroyer or Productivity Multiplier?", difficulty: "Medium", duration: "10 Mins" },
    { title: "Remote vs Hybrid vs In-Office for Fresh Graduates", difficulty: "Easy", duration: "8 Mins" },
    { title: "Ethical Implications of Autonomous Systems & Algorithms", difficulty: "Hard", duration: "12 Mins" },
    { title: "Moonlighting in Tech: Professional Freedom or Breach of Contract?", difficulty: "Medium", duration: "10 Mins" },
  ];

  const [gdStep, setGdStep] = useState<"lobby" | "live" | "feedback">("lobby");
  const [selectedGdTopic, setSelectedGdTopic] = useState(GD_TOPICS[0]);
  const [gdRoomCode, setGdRoomCode] = useState("PM-GD-8924");
  const [copiedLink, setCopiedLink] = useState(false);
  const [isHostReady, setIsHostReady] = useState(false);
  const [gdTimer, setGdTimer] = useState(120);
  const [activeSpeakerIdx, setActiveSpeakerIdx] = useState(0);

  const GD_PARTICIPANTS = [
    { name: "Harini Muthuvel (You)", role: "Host", isReady: true, speakingTime: "01:52", points: "+4 Contributions" },
    { name: "Rahul Sharma", role: "Participant", isReady: true, speakingTime: "01:45", points: "+3 Contributions" },
    { name: "Pooja Hegde", role: "Participant", isReady: true, speakingTime: "01:38", points: "+3 Contributions" },
    { name: "Aditya Varma", role: "Participant", isReady: true, speakingTime: "01:20", points: "+2 Contributions" },
  ];

  const handleCopyJoinLink = () => {
    navigator.clipboard.writeText(`https://placementor.ai/gd/join?room=${gdRoomCode}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleStartGd = () => {
    setGdStep("live");
    setGdTimer(120);
    setActiveSpeakerIdx(0);
  };

  return (
    <div className="space-y-6 font-sans text-foreground">
      {/* Top Header Banner */}
      <div className="p-6 sm:p-8 rounded-2xl border border-purple-500/25 bg-gradient-to-br from-purple-500/10 via-card to-card dark:from-purple-950/40 dark:via-secondary dark:to-card shadow-sm relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-700 dark:text-purple-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Placement Communication Studio</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground font-display">
            Spoken Fluency & Group Discussion
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground font-medium max-w-xl leading-relaxed">
            Record interview speech answers for AI pacing & filler-word feedback, or host private multi-user Group Discussion rooms with peers.
          </p>
        </div>

        {/* Action Toggle Pills */}
        <div className="flex items-center gap-2 p-1.5 rounded-xl border border-border bg-secondary/80 shrink-0 select-none">
          <button
            onClick={() => setActiveTab("speaking")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === "speaking"
                ? "bg-purple-600 text-white shadow-md"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Mic className="w-4 h-4" />
            <span>Speaking Practice</span>
          </button>

          <button
            onClick={() => setActiveTab("gd")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === "gd"
                ? "bg-purple-600 text-white shadow-md"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Group Discussion</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          TAB 1: SPEAKING PRACTICE (Prompts, Audio Recorder, AI Feedback)
         ========================================================================= */}
      {activeTab === "speaking" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Prompt Selection List (5 cols) */}
          <div className="lg:col-span-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-foreground">Interview Prompts</h3>
              <span className="text-xs text-muted-foreground font-mono">4 High-Yield</span>
            </div>

            <div className="space-y-2.5">
              {SPEAKING_PROMPTS.map((prompt) => {
                const isSelected = selectedPrompt.id === prompt.id;
                return (
                  <div
                    key={prompt.id}
                    onClick={() => {
                      setSelectedPrompt(prompt);
                      setIsRecording(false);
                      setSpeakingTimer(0);
                      setSpeakingFeedback(null);
                    }}
                    className={`p-4 rounded-xl border transition-all cursor-pointer space-y-2 ${
                      isSelected
                        ? "border-purple-500 bg-purple-500/10 shadow-sm"
                        : "border-border bg-card hover:bg-secondary/60"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-secondary border border-border text-purple-700 dark:text-purple-300">
                        {prompt.category}
                      </span>
                      <span className="text-[10px] font-mono text-muted-foreground">
                        {prompt.timeLimit}s Target
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-foreground">{prompt.title}</h4>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">{prompt.tips}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Live Speech Recorder Arena (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="p-6 rounded-2xl border border-border bg-card shadow-sm space-y-6">
              {/* Active Prompt Banner */}
              <div className="space-y-1 border-b border-border pb-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider font-mono">
                    {selectedPrompt.category}
                  </span>
                  <span className="text-xs font-mono text-amber-600 dark:text-amber-400 font-semibold">
                    Target: {selectedPrompt.timeLimit}s
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-foreground">{selectedPrompt.title}</h3>
                <p className="text-xs text-muted-foreground">{selectedPrompt.tips}</p>
              </div>

              {/* Recorder Controls & Visualizer */}
              <div className="p-8 rounded-2xl border border-purple-500/20 bg-secondary/30 text-center space-y-4">
                {/* Timer */}
                <div className="text-3xl font-extrabold font-mono text-foreground flex items-center justify-center gap-2">
                  <Clock className={`w-6 h-6 ${isRecording ? "text-rose-500 animate-pulse" : "text-purple-600 dark:text-purple-400"}`} />
                  <span>
                    {Math.floor(speakingTimer / 60).toString().padStart(2, "0")}:
                    {(speakingTimer % 60).toString().padStart(2, "0")}
                  </span>
                </div>

                {/* Animated Voice Waveform Simulator */}
                <div className="flex items-center justify-center gap-1.5 h-12">
                  {[40, 70, 90, 60, 30, 80, 100, 60, 45, 90, 75, 40].map((h, i) => (
                    <div
                      key={i}
                      style={{ height: isRecording ? `${h}%` : "15%" }}
                      className={`w-1.5 rounded-full transition-all duration-150 ${
                        isRecording ? "bg-purple-600 shadow-sm shadow-purple-500/50" : "bg-muted-foreground/30"
                      }`}
                    />
                  ))}
                </div>

                {/* Record Button */}
                <button
                  onClick={handleToggleRecording}
                  className={`py-3 px-8 rounded-full text-xs font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2 mx-auto ${
                    isRecording
                      ? "bg-rose-600 hover:bg-rose-700 animate-pulse"
                      : "bg-purple-600 hover:bg-purple-500"
                  }`}
                >
                  {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  <span>{isRecording ? "Stop & Analyze Speech" : "Start Speaking Practice"}</span>
                </button>
              </div>

              {/* Feedback Breakdown Screen (Post-Recording) */}
              {speakingFeedback && (
                <div className="p-5 rounded-2xl border border-purple-500/30 bg-purple-500/5 space-y-4 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" /> AI Speech Assessment
                    </span>
                    <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      Tier-1 Benchmark Met
                    </span>
                  </div>

                  {/* 3 Metric Summary Grid */}
                  <div className="grid grid-cols-3 gap-2.5">
                    <div className="p-3 rounded-xl bg-card border border-border text-center">
                      <p className="text-[10px] text-muted-foreground font-semibold">Fluency</p>
                      <p className="text-base font-mono font-bold text-purple-600 dark:text-purple-400">{speakingFeedback.fluency}%</p>
                    </div>
                    <div className="p-3 rounded-xl bg-card border border-border text-center">
                      <p className="text-[10px] text-muted-foreground font-semibold">Cadence / Pace</p>
                      <p className="text-base font-mono font-bold text-teal-600 dark:text-teal-400">{speakingFeedback.paceWpm} WPM</p>
                    </div>
                    <div className="p-3 rounded-xl bg-card border border-border text-center">
                      <p className="text-[10px] text-muted-foreground font-semibold">Clarity</p>
                      <p className="text-base font-mono font-bold text-emerald-600 dark:text-emerald-400">{speakingFeedback.clarity}%</p>
                    </div>
                  </div>

                  {/* Filler words and tips */}
                  <div className="space-y-2 text-xs">
                    <div>
                      <p className="font-bold text-emerald-600 dark:text-emerald-400">Key Strengths:</p>
                      <ul className="list-disc pl-5 text-muted-foreground space-y-0.5 mt-1">
                        {speakingFeedback.strengths.map((s, idx) => (
                          <li key={idx}>{s}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <p className="font-bold text-amber-600 dark:text-amber-400">Actionable Suggestions:</p>
                      <ul className="list-disc pl-5 text-muted-foreground space-y-0.5 mt-1">
                        {speakingFeedback.improvements.map((imp, idx) => (
                          <li key={idx}>{imp}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: GROUP DISCUSSION (GD) ROOM & LOBBY
         ========================================================================= */}
      {activeTab === "gd" && (
        <div className="max-w-4xl mx-auto space-y-6">
          {gdStep === "lobby" && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Left: Create / Configure Room (6 cols) */}
              <div className="md:col-span-6 p-6 rounded-2xl border border-border bg-card space-y-5 shadow-sm">
                <h3 className="text-base font-bold text-foreground">Configure Private GD Room</h3>

                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">Select Discussion Topic</label>
                    <select
                      value={selectedGdTopic.title}
                      onChange={(e) => {
                        const t = GD_TOPICS.find((top) => top.title === e.target.value);
                        if (t) setSelectedGdTopic(t);
                      }}
                      className="w-full mt-1 px-3.5 py-2.5 rounded-xl border border-border bg-secondary text-foreground text-xs font-medium outline-none focus:border-purple-500 cursor-pointer"
                    >
                      {GD_TOPICS.map((t) => (
                        <option key={t.title} value={t.title}>
                          {t.title} ({t.difficulty})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Shareable Link Box */}
                  <div className="p-3.5 rounded-xl border border-purple-500/30 bg-purple-500/10 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-purple-700 dark:text-purple-300">Invite Friends & Peers</span>
                      <span className="text-[10px] font-mono text-muted-foreground">Room: {gdRoomCode}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        readOnly
                        value={`https://placementor.ai/gd/join?room=${gdRoomCode}`}
                        className="w-full px-3 py-1.5 rounded-lg border border-border bg-card text-foreground text-xs font-mono select-all outline-none"
                      />
                      <button
                        onClick={handleCopyJoinLink}
                        className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shrink-0 flex items-center gap-1"
                      >
                        {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedLink ? "Copied" : "Copy"}</span>
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleStartGd}
                  className="w-full py-3 rounded-xl text-xs font-bold text-white pm-btn-gradient shadow-md flex items-center justify-center gap-2"
                >
                  <Users className="w-4 h-4" />
                  <span>Start Group Discussion Arena</span>
                </button>
              </div>

              {/* Right: Participant Lobby List (6 cols) */}
              <div className="md:col-span-6 p-6 rounded-2xl border border-border bg-card space-y-4 shadow-sm">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <h4 className="text-sm font-bold text-foreground">Room Lobby (4/6 Joined)</h4>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                    All Ready
                  </span>
                </div>

                <div className="space-y-2.5">
                  {GD_PARTICIPANTS.map((p, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl border border-border bg-secondary/40 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-purple-600/30 border border-purple-500/40 flex items-center justify-center text-purple-700 dark:text-purple-300 font-bold font-mono text-[11px]">
                          {p.name[0]}
                        </div>
                        <div>
                          <p className="font-bold text-foreground">{p.name}</p>
                          <p className="text-[10px] text-muted-foreground">{p.role}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-[11px]">
                        <Check className="w-3.5 h-3.5" /> Ready
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Live GD Arena Screen */}
          {gdStep === "live" && (
            <div className="p-6 sm:p-8 rounded-2xl border border-purple-500/30 bg-card space-y-6 shadow-sm">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div>
                  <span className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider font-mono">Live Group Discussion</span>
                  <h3 className="text-base sm:text-lg font-bold text-foreground">{selectedGdTopic.title}</h3>
                </div>

                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-mono font-bold">
                  <Clock className="w-4 h-4 animate-pulse" />
                  <span>Speaking Time: 01:45</span>
                </div>
              </div>

              {/* Active Speaker Banner */}
              <div className="p-5 rounded-xl border border-purple-500/40 bg-purple-500/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-sm">
                    HM
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-purple-700 dark:text-purple-300 uppercase tracking-wider">Current Speaker</span>
                    <h4 className="text-sm font-bold text-foreground">Harini Muthuvel (You)</h4>
                  </div>
                </div>

                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold text-xs flex items-center gap-1">
                  <Volume2 className="w-3.5 h-3.5 animate-bounce" /> Speaking Now
                </span>
              </div>

              {/* Discussion Prompts & Suggested Points */}
              <div className="p-4 rounded-xl border border-border bg-secondary/30 space-y-2 text-xs">
                <p className="font-bold text-foreground flex items-center gap-1.5">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-500" /> Recommended Points to Contribute:
                </p>
                <ul className="list-disc pl-5 text-muted-foreground space-y-1">
                  <li>Highlight historical technology transitions (Industrial Revolution, Cloud Computing).</li>
                  <li>Mention augmentation vs displacement in developer productivity (GitHub Copilot, IDE tools).</li>
                  <li>Address the need for higher-order system design & domain architecture skills.</li>
                </ul>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border">
                <button
                  onClick={() => setGdStep("lobby")}
                  className="px-4 py-2 rounded-xl border border-border text-xs font-semibold text-muted-foreground hover:text-foreground"
                >
                  Exit Session
                </button>

                <button
                  onClick={() => setGdStep("feedback")}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold text-white pm-btn-gradient shadow-md"
                >
                  Conclude GD & View Feedback
                </button>
              </div>
            </div>
          )}

          {/* Post-GD Individual Feedback */}
          {gdStep === "feedback" && (
            <div className="p-6 sm:p-8 rounded-2xl border border-purple-500/30 bg-card space-y-6 shadow-sm text-center">
              <Trophy className="w-10 h-10 text-amber-500 dark:text-amber-400 mx-auto animate-bounce" />
              <div>
                <h3 className="text-xl font-bold text-foreground">GD Performance Evaluation</h3>
                <p className="text-xs text-muted-foreground mt-1">Topic: {selectedGdTopic.title}</p>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-lg mx-auto">
                <div className="p-3 rounded-xl bg-secondary/50 border border-border">
                  <p className="text-[10px] text-muted-foreground font-semibold">Speaking Time</p>
                  <p className="text-base font-mono font-bold text-purple-600 dark:text-purple-400">01:52</p>
                </div>
                <div className="p-3 rounded-xl bg-secondary/50 border border-border">
                  <p className="text-[10px] text-muted-foreground font-semibold">Relevance</p>
                  <p className="text-base font-mono font-bold text-teal-600 dark:text-teal-400">92%</p>
                </div>
                <div className="p-3 rounded-xl bg-secondary/50 border border-border">
                  <p className="text-[10px] text-muted-foreground font-semibold">Confidence</p>
                  <p className="text-base font-mono font-bold text-emerald-600 dark:text-emerald-400">88%</p>
                </div>
                <div className="p-3 rounded-xl bg-secondary/50 border border-border">
                  <p className="text-[10px] text-muted-foreground font-semibold">Points Made</p>
                  <p className="text-base font-mono font-bold text-amber-600 dark:text-amber-400">4 Points</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-secondary/30 border border-border text-left space-y-2 text-xs max-w-lg mx-auto">
                <p className="font-bold text-foreground">Key Takeaways:</p>
                <p className="text-muted-foreground leading-relaxed">
                  Strong opening statement with clear historical analogies. Excellent listening etiquette with zero interruptions recorded. Saved in GD history.
                </p>
              </div>

              <button
                onClick={() => setGdStep("lobby")}
                className="py-2.5 px-6 rounded-xl text-xs font-bold text-white pm-btn-gradient shadow-md"
              >
                Return to GD Lobby
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}