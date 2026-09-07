import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { apiRequest } from "@/lib/api";
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
  Send,
  Loader2,
  FileText,
  Mail,
  X,
} from "lucide-react";

export default function Communication() {
  const { user } = useAuth();
  const userName = user?.name || user?.full_name || "User";
  const userInitials = userName
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "U";

  // Active Tab: "speaking" | "outreach" | "gd"
  const [activeTab, setActiveTab] = useState<"speaking" | "outreach" | "gd">("speaking");

  // =========================================================================
  // SPEAKING PRACTICE STATE & REAL MICROPHONE REFS
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
  const [speakingSubView, setSpeakingSubView] = useState<"catalog" | "practice">("catalog");
  const [isRecording, setIsRecording] = useState(false);
  const [speakingTimer, setSpeakingTimer] = useState(0);
  const [hasRecorded, setHasRecorded] = useState(false);
  const [micError, setMicError] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);

  const mediaStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingStartTimeRef = useRef<number>(0);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [historySessions, setHistorySessions] = useState<any[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [selectedHistoryId, setSelectedHistoryId] = useState<string | null>(null);

  const [speakingFeedback, setSpeakingFeedback] = useState<{
    fluency: number;
    clarity: number;
    paceWpm: number;
    fillerWords: string[];
    vocabularyScore: number;
    strengths: string[];
    improvements: string[];
    transcript?: string;
    starFeedback?: {
      situation?: string;
      task?: string;
      action?: string;
      result?: string;
    };
  } | null>(null);

  const fetchHistory = async () => {
    setIsLoadingHistory(true);
    try {
      const res = await apiRequest<{ sessions: any[] }>("/api/communication/history?limit=20");
      setHistorySessions(res.sessions || []);
    } catch (err) {
      console.error("Failed to fetch communication history:", err);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  useEffect(() => {
    if (activeTab === "speaking") {
      fetchHistory();
    }
  }, [activeTab]);

  useEffect(() => {
    let interval: NodeJS.Timeout | number;
    if (isRecording) {
      interval = setInterval(() => setSpeakingTimer((t) => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  // Clean up microphone stream and audio URLs on component unmount
  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        mediaRecorderRef.current.stop();
      }
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
        mediaStreamRef.current = null;
      }
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  // =========================================================================
  // OUTREACH STUDIO STATE
  // =========================================================================
  type OutreachType = "recruiter_email" | "linkedin_message" | "interview_followup" | "networking_message";

  const [outreachType, setOutreachType] = useState<OutreachType>("recruiter_email");
  const [recipientName, setRecipientName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [role, setRole] = useState("");
  const [jobContext, setJobContext] = useState("");
  const [userContext, setUserContext] = useState("");
  const [tone, setTone] = useState<"professional" | "enthusiastic" | "concise" | "formal">("professional");

  const [isGeneratingOutreach, setIsGeneratingOutreach] = useState(false);
  const [generatedSubject, setGeneratedSubject] = useState("");
  const [generatedBody, setGeneratedBody] = useState("");
  const [generatedNotes, setGeneratedNotes] = useState<string[]>([]);
  const [outreachError, setOutreachError] = useState<string | null>(null);

  const [copiedSubject, setCopiedSubject] = useState(false);
  const [copiedBody, setCopiedBody] = useState(false);
  const [isFetchingResume, setIsFetchingResume] = useState(false);

  const handleAutofillResume = async () => {
    setIsFetchingResume(true);
    setOutreachError(null);
    try {
      const resumes = await apiRequest<any[]>("/api/resumes");
      if (resumes && resumes.length > 0) {
        const fullResume = await apiRequest<any>(`/api/resumes/${resumes[0].id}`);
        if (fullResume) {
          const skillsList = fullResume.skills
            ? fullResume.skills.map((s: any) => typeof s === "string" ? s : s.name || s.skill).filter(Boolean).join(", ")
            : "";
          const summaryText = fullResume.summary || fullResume.professional_summary || "";
          const projectList = fullResume.projects
            ? fullResume.projects.slice(0, 2).map((p: any) => p.title || p.name).filter(Boolean).join(", ")
            : "";

          let contextStr = "";
          if (summaryText) contextStr += summaryText + " ";
          if (skillsList) contextStr += `Technical Skills: ${skillsList}. `;
          if (projectList) contextStr += `Featured Projects: ${projectList}.`;

          setUserContext(contextStr.trim());
        }
      } else {
        setOutreachError("No saved resumes found. Please enter your skills context manually.");
      }
    } catch (err: any) {
      console.error("Failed to auto-fill resume context:", err);
      setOutreachError("Could not fetch resume context. Please enter manually.");
    } finally {
      setIsFetchingResume(false);
    }
  };

  const handleGenerateOutreach = async () => {
    setOutreachError(null);
    if (!companyName.trim() && !role.trim() && !jobContext.trim() && !userContext.trim()) {
      setOutreachError("Please provide at least a Company Name, Job Title, or Context to generate outreach.");
      return;
    }

    setIsGeneratingOutreach(true);
    try {
      const res = await apiRequest<{
        message_type: string;
        subject?: string | null;
        body: string;
        notes?: string[];
      }>("/api/communication/generate-outreach", {
        method: "POST",
        body: JSON.stringify({
          message_type: outreachType,
          recipient_name: recipientName.trim(),
          company_name: companyName.trim(),
          role: role.trim(),
          job_context: jobContext.trim(),
          user_context: userContext.trim(),
          tone: tone,
        }),
      });

      setGeneratedSubject(res.subject || "");
      setGeneratedBody(res.body || "");
      setGeneratedNotes(res.notes || []);
    } catch (err: any) {
      console.error("Outreach generation failed:", err);
      setOutreachError(err?.message || "Failed to generate outreach message. Please try again.");
    } finally {
      setIsGeneratingOutreach(false);
    }
  };

  const handleCopySubject = () => {
    if (!generatedSubject) return;
    navigator.clipboard.writeText(generatedSubject);
    setCopiedSubject(true);
    setTimeout(() => setCopiedSubject(false), 2000);
  };

  const handleCopyBody = () => {
    if (!generatedBody) return;
    const fullContent = generatedSubject ? `Subject: ${generatedSubject}\n\n${generatedBody}` : generatedBody;
    navigator.clipboard.writeText(fullContent);
    setCopiedBody(true);
    setTimeout(() => setCopiedBody(false), 2000);
  };

  const selectHistorySession = (session: any) => {
    const matchingPrompt = SPEAKING_PROMPTS.find((p) => p.title === session.prompt_title) || {
      id: "hist-prompt",
      title: session.prompt_title || "Speaking Practice",
      category: session.prompt_category || "General",
      timeLimit: session.duration_seconds || 90,
      difficulty: "Medium",
      tips: "Historical practice attempt.",
    };
    setSelectedPrompt(matchingPrompt);
    setSelectedHistoryId(session.id);
    setAudioUrl(null); // Historical sessions do not store raw audio blobs
    setSpeakingFeedback({
      fluency: session.fluency,
      clarity: session.clarity,
      paceWpm: session.pace,
      fillerWords: session.filler_words || [],
      vocabularyScore: session.overall_score,
      strengths: session.strengths?.length > 0 ? session.strengths : ["Structured verbal delivery."],
      improvements: session.suggestions?.length > 0 ? session.suggestions : ["Continue practicing for higher confidence."],
      transcript: session.transcript,
      starFeedback: session.star_feedback,
    });
    setSpeakingSubView("practice");
  };

  const handleStartPromptPractice = (prompt: typeof SPEAKING_PROMPTS[0]) => {
    setSelectedPrompt(prompt);
    setIsRecording(false);
    setSpeakingTimer(0);
    setSpeakingFeedback(null);
    setAudioUrl(null);
    setMicError(null);
    setSelectedHistoryId(null);
    setSpeakingSubView("practice");
  };

  const handleBackToCatalog = () => {
    if (isRecording && mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
    setMicError(null);
    setSpeakingSubView("catalog");
  };

  const audioContextRef = useRef<AudioContext | null>(null);
  const maxVolumeRef = useRef<number>(0);
  const animFrameRef = useRef<number | null>(null);

  const analyzeAudioRecording = async (blob: Blob, duration: number, mimeType: string, isSilent: boolean) => {
    if (!blob || blob.size === 0) {
      setMicError("Recording was empty. Please speak into your microphone and try again.");
      return;
    }

    setIsAnalyzing(true);
    setSpeakingFeedback(null);
    setSelectedHistoryId(null);
    setMicError(null);

    try {
      const formData = new FormData();
      const extension = mimeType.includes("mp4") ? "mp4" : mimeType.includes("wav") ? "wav" : "webm";
      formData.append("file", blob, `speech_recording.${extension}`);
      formData.append("prompt_title", selectedPrompt.title);
      formData.append("prompt_category", selectedPrompt.category);
      formData.append("target_duration", selectedPrompt.timeLimit.toString());
      formData.append("actual_duration", duration.toString());
      formData.append("is_silent", isSilent ? "true" : "false");

      const response = await apiRequest<{
        id?: string;
        transcript: string;
        fluency: number;
        pace: number;
        clarity: number;
        filler_words: string[];
        overall_score: number;
        strengths: string[];
        suggestions: string[];
        star_feedback?: {
          situation?: string;
          task?: string;
          action?: string;
          result?: string;
        };
      }>("/api/communication/analyze-speech", {
        method: "POST",
        body: formData,
      });

      const isNoSpeech = response.transcript === "[No speech detected]" || response.overall_score === 0;

      setSpeakingFeedback({
        fluency: isNoSpeech ? 0 : response.fluency,
        clarity: isNoSpeech ? 0 : response.clarity,
        paceWpm: isNoSpeech ? 0 : response.pace,
        fillerWords: isNoSpeech ? [] : (response.filler_words || []),
        vocabularyScore: isNoSpeech ? 0 : response.overall_score,
        strengths: response.strengths || [],
        improvements: response.suggestions?.length > 0 ? response.suggestions : ["No audible speech was detected. Please check your microphone input volume and speak clearly into your mic during the practice session."],
        transcript: response.transcript,
        starFeedback: isNoSpeech ? undefined : response.star_feedback,
      });

      if (response.id) {
        setSelectedHistoryId(response.id);
      }
      fetchHistory();
    } catch (err: any) {
      console.error("Speech analysis error:", err);
      let userMessage = err.message || "Unable to analyze your recording right now. Please try again.";
      if (userMessage.includes("503") || userMessage.includes("high demand") || userMessage.includes("UNAVAILABLE")) {
        userMessage = "AI Speech Analysis service is temporarily experiencing high demand from the AI provider. Please wait a moment and try again.";
      }
      setMicError(userMessage);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleToggleRecording = async () => {
    if (isAnalyzing) return;
    setMicError(null);

    if (!isRecording) {
      // 1. Browser compatibility check
      if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") {
        setMicError("Microphone recording is not supported in this browser.");
        return;
      }

      try {
        // 2. Request microphone permission upon explicit user action
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaStreamRef.current = stream;

        // Set up Web Audio API volume analyzer
        try {
          const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
          if (AudioContextClass) {
            const audioCtx = new AudioContextClass();
            audioContextRef.current = audioCtx;
            const source = audioCtx.createMediaStreamSource(stream);
            const analyser = audioCtx.createAnalyser();
            analyser.fftSize = 256;
            source.connect(analyser);

            maxVolumeRef.current = 0;
            const dataArray = new Uint8Array(analyser.frequencyBinCount);

            const checkVolume = () => {
              if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
                analyser.getByteFrequencyData(dataArray);
                let peak = 0;
                for (let i = 0; i < dataArray.length; i++) {
                  if (dataArray[i] > peak) peak = dataArray[i];
                }
                if (peak > maxVolumeRef.current) {
                  maxVolumeRef.current = peak;
                }
                animFrameRef.current = requestAnimationFrame(checkVolume);
              }
            };
            checkVolume();
          }
        } catch (audioErr) {
          console.warn("Could not initialize AudioContext volume monitor:", audioErr);
        }

        const options: MediaRecorderOptions = {};
        if (MediaRecorder.isTypeSupported("audio/webm")) {
          options.mimeType = "audio/webm";
        } else if (MediaRecorder.isTypeSupported("audio/mp4")) {
          options.mimeType = "audio/mp4";
        }

        const mediaRecorder = new MediaRecorder(stream, options);
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];

        mediaRecorder.ondataavailable = (event: BlobEvent) => {
          if (event.data && event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };

        mediaRecorder.onstop = () => {
          if (animFrameRef.current) {
            cancelAnimationFrame(animFrameRef.current);
            animFrameRef.current = null;
          }
          if (audioContextRef.current && audioContextRef.current.state !== "closed") {
            audioContextRef.current.close().catch(() => {});
            audioContextRef.current = null;
          }

          const mimeType = mediaRecorder.mimeType || "audio/webm";
          const blob = new Blob(audioChunksRef.current, { type: mimeType });
          const elapsedSecs = Math.max(1, Math.round((Date.now() - recordingStartTimeRef.current) / 1000));
          const recordedDuration = elapsedSecs;
          const isSilent = blob.size < 500 || recordedDuration <= 1;

          setAudioBlob(blob);

          setAudioUrl((prevUrl) => {
            if (prevUrl) URL.revokeObjectURL(prevUrl);
            return URL.createObjectURL(blob);
          });

          // Clean up live microphone stream tracks
          if (mediaStreamRef.current) {
            mediaStreamRef.current.getTracks().forEach((track) => track.stop());
            mediaStreamRef.current = null;
          }

          // Trigger real AI speech analysis API with recorded audio & silence flag
          analyzeAudioRecording(blob, recordedDuration, mimeType, isSilent);
        };

        recordingStartTimeRef.current = Date.now();
        mediaRecorder.start();
        setIsRecording(true);
        setSpeakingTimer(0);
        setHasRecorded(false);
        setSpeakingFeedback(null);
      } catch (err: any) {
        console.error("Microphone access error:", err);
        if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
          setMicError("Microphone access was denied. Microphone access is required for speaking practice.");
        } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
          setMicError("No microphone hardware device found on your system.");
        } else {
          setMicError("Microphone access is required for speaking practice.");
        }
      }
    } else {
      // 3. Stop recording cleanly
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        mediaRecorderRef.current.stop();
      }
      setIsRecording(false);
      setHasRecorded(true);
    }
  };

  // =========================================================================
  // GROUP DISCUSSION (GD) STATE & REAL-TIME WEBSOCKET
  // =========================================================================
  const GD_TOPICS = [
    { title: "Generative AI: Job Destroyer or Productivity Multiplier?", difficulty: "Medium", duration: "15 Mins" },
    { title: "Remote vs Hybrid vs In-Office for Fresh Graduates", difficulty: "Easy", duration: "15 Mins" },
    { title: "Ethical Implications of Autonomous Systems & Algorithms", difficulty: "Hard", duration: "15 Mins" },
    { title: "Moonlighting in Tech: Professional Freedom or Breach of Contract?", difficulty: "Medium", duration: "15 Mins" },
  ];

  type GDParticipantState = {
    user_id: string;
    display_name: string;
    is_host: boolean;
    is_connected: boolean;
    joined_at: string;
    is_speaking: boolean;
  };

  type GDRoomState = {
    room_id: string;
    topic: string;
    status: "waiting" | "active" | "ended";
    host_user_id: string;
    max_participants: number;
    created_at: string;
    started_at?: string | null;
    ended_at?: string | null;
    duration_seconds: number;
    participants: GDParticipantState[];
    is_host?: boolean;
  };

  const [gdStep, setGdStep] = useState<"lobby" | "waiting" | "live" | "feedback">("lobby");
  const [selectedGdTopic, setSelectedGdTopic] = useState(GD_TOPICS[0]);
  const [customGdTopic, setCustomGdTopic] = useState("");
  const [joinRoomInput, setJoinRoomInput] = useState("");
  const [gdRoomCode, setGdRoomCode] = useState("");
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeRoomData, setActiveRoomData] = useState<GDRoomState | null>(null);
  const [gdError, setGdError] = useState<string | null>(null);
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);
  const [isJoiningRoom, setIsJoiningRoom] = useState(false);
  const [gdTimerRemaining, setGdTimerRemaining] = useState<number>(900);

  // GD AI Evaluation State
  type GDEvalDimension = {
    score: number | null;
    reason: string;
  };

  type GDEvalData = {
    id: string;
    room_id: string;
    user_id: string;
    topic: string;
    overall_score: number | null;
    dimensions: Record<string, GDEvalDimension>;
    strengths: string[];
    suggestions: string[];
    data_limitations: string[];
    created_at: string;
  };

  const [isEvaluatingGd, setIsEvaluatingGd] = useState(false);
  const [gdEvaluationData, setGdEvaluationData] = useState<GDEvalData | null>(null);

  const handleFetchGdEvaluation = async () => {
    if (!gdRoomCode) return;
    setIsEvaluatingGd(true);
    setGdError(null);
    try {
      const evalRes = await apiRequest<GDEvalData>(`/api/communication/gd/rooms/${gdRoomCode}/evaluate`, {
        method: "POST",
      });
      setGdEvaluationData(evalRes);
    } catch (err: any) {
      console.error("GD AI Evaluation error:", err);
      setGdError(err?.message || "Failed to generate AI evaluation for this session.");
    } finally {
      setIsEvaluatingGd(false);
    }
  };

  const wsRef = useRef<WebSocket | null>(null);

  const connectGDWebSocket = (roomId: string) => {
    if (wsRef.current) {
      wsRef.current.close();
    }
    const token = localStorage.getItem("token") || "demo-token";
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsHost = window.location.hostname === "localhost" ? "127.0.0.1:8000" : window.location.host;
    const wsUrl = `${protocol}//${wsHost}/api/communication/gd/ws/${roomId}?token=${encodeURIComponent(token)}`;

    const socket = new WebSocket(wsUrl);
    wsRef.current = socket;

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "room_state" && data.room) {
          setActiveRoomData(data.room);
          if (data.room.status === "active") {
            setGdStep("live");
          } else if (data.room.status === "ended") {
            setGdStep("feedback");
          } else if (data.room.status === "waiting") {
            setGdStep("waiting");
          }
        }
      } catch (e) {
        console.error("Error parsing GD WebSocket payload:", e);
      }
    };

    socket.onerror = (err) => {
      console.error("GD WebSocket error:", err);
    };
  };

  useEffect(() => {
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, []);

  // Server-authoritative timer countdown effect
  useEffect(() => {
    let interval: NodeJS.Timeout | number;
    if (gdStep === "live" && activeRoomData?.started_at) {
      const startTime = new Date(activeRoomData.started_at).getTime();
      const totalDuration = activeRoomData.duration_seconds || 900;

      interval = setInterval(() => {
        const now = new Date().getTime();
        const elapsedSecs = Math.floor((now - startTime) / 1000);
        const remaining = Math.max(0, totalDuration - elapsedSecs);
        setGdTimerRemaining(remaining);

        if (remaining <= 0 && activeRoomData.host_user_id === user?.id) {
          handleEndGd();
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gdStep, activeRoomData, user]);

  const handleCreateGdRoom = async () => {
    setGdError(null);
    setIsCreatingRoom(true);
    const topicToUse = customGdTopic.trim() || selectedGdTopic.title;

    try {
      const room = await apiRequest<GDRoomState>("/api/communication/gd/rooms", {
        method: "POST",
        body: JSON.stringify({
          topic: topicToUse,
          max_participants: 6,
          duration_minutes: 15,
        }),
      });

      setActiveRoomData(room);
      setGdRoomCode(room.room_id);
      setGdStep("waiting");
      connectGDWebSocket(room.room_id);
    } catch (err: any) {
      console.error("Create room failed:", err);
      setGdError(err?.message || "Failed to create GD room. Please try again.");
    } finally {
      setIsCreatingRoom(false);
    }
  };

  const handleJoinGdRoom = async () => {
    const code = joinRoomInput.trim().toUpperCase();
    if (!code) {
      setGdError("Please enter a valid GD Room Code (e.g. GD-A1B2).");
      return;
    }
    setGdError(null);
    setIsJoiningRoom(true);

    try {
      const room = await apiRequest<GDRoomState>(`/api/communication/gd/rooms/${code}/join`, {
        method: "POST",
      });

      setActiveRoomData(room);
      setGdRoomCode(room.room_id);
      setGdStep(room.status === "active" ? "live" : "waiting");
      connectGDWebSocket(room.room_id);
    } catch (err: any) {
      console.error("Join room failed:", err);
      setGdError(err?.message || "Failed to join room. Verify code and room status.");
    } finally {
      setIsJoiningRoom(false);
    }
  };

  const handleStartGd = async () => {
    if (!gdRoomCode) return;
    setGdError(null);
    try {
      const room = await apiRequest<GDRoomState>(`/api/communication/gd/rooms/${gdRoomCode}/start`, {
        method: "POST",
      });
      setActiveRoomData(room);
      setGdStep("live");
    } catch (err: any) {
      console.error("Start GD failed:", err);
      setGdError(err?.message || "Only the host can start the discussion.");
    }
  };

  const handleLeaveGd = async () => {
    if (gdRoomCode) {
      try {
        await apiRequest(`/api/communication/gd/rooms/${gdRoomCode}/leave`, {
          method: "POST",
        });
      } catch (err) {
        console.error("Leave GD error:", err);
      }
    }
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setActiveRoomData(null);
    setGdStep("lobby");
  };

  const handleEndGd = async () => {
    if (!gdRoomCode) return;
    try {
      const room = await apiRequest<GDRoomState>(`/api/communication/gd/rooms/${gdRoomCode}/end`, {
        method: "POST",
      });
      setActiveRoomData(room);
    } catch (err) {
      console.error("End GD error:", err);
    }
    setGdStep("feedback");
  };

  const handleCopyJoinLink = () => {
    if (!gdRoomCode) return;
    navigator.clipboard.writeText(gdRoomCode);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
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
            onClick={() => setActiveTab("outreach")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === "outreach"
                ? "bg-purple-600 text-white shadow-md"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Send className="w-4 h-4" />
            <span>Recruiter Outreach</span>
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
          TAB 1: SPEAKING PRACTICE (Catalog Screen vs Dedicated Practice Screen)
         ========================================================================= */}
      {activeTab === "speaking" && (
        <div className="space-y-6">
          {/* ---------------------------------------------------------------------
              SUB-VIEW 1: PROMPTS CATALOG & HISTORY LIST SCREEN
             --------------------------------------------------------------------- */}
          {speakingSubView === "catalog" && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-foreground">Interview Prompts Catalog</h2>
                  <p className="text-xs text-muted-foreground">Select an interview question to open the dedicated AI speaking workspace.</p>
                </div>
                <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400">
                  4 High-Yield Prompts Available
                </span>
              </div>

              {/* 4 High-Yield Prompts 2x2 Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {SPEAKING_PROMPTS.map((prompt) => (
                  <div
                    key={prompt.id}
                    onClick={() => handleStartPromptPractice(prompt)}
                    className="p-5 rounded-2xl border border-border bg-card hover:border-purple-500/50 hover:bg-secondary/60 transition-all cursor-pointer space-y-3 flex flex-col justify-between group shadow-sm"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-700 dark:text-purple-300">
                          {prompt.category}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono text-amber-600 dark:text-amber-400 font-semibold px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                            {prompt.difficulty}
                          </span>
                          <span className="text-[10px] font-mono text-muted-foreground">
                            {prompt.timeLimit}s Target
                          </span>
                        </div>
                      </div>

                      <h3 className="text-sm sm:text-base font-extrabold text-foreground group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                        {prompt.title}
                      </h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {prompt.tips}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-border/50 flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-purple-600 dark:text-purple-400">
                        Practice Question
                      </span>
                      <div className="inline-flex items-center gap-1 text-xs font-bold text-white bg-purple-600 group-hover:bg-purple-500 px-3.5 py-1.5 rounded-lg shadow-sm transition-all">
                        <span>Start Practice</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Speaking Practice History Section */}
              <div className="pt-4 space-y-4 border-t border-border">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <Clock className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    <span>Speaking Practice History</span>
                  </h3>
                  <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded bg-secondary border border-border text-muted-foreground">
                    {historySessions.length} Past Attempts
                  </span>
                </div>

                {isLoadingHistory ? (
                  <div className="p-6 rounded-2xl border border-border bg-card text-center text-xs text-muted-foreground animate-pulse">
                    Loading saved speaking attempts...
                  </div>
                ) : historySessions.length === 0 ? (
                  <div className="p-6 rounded-2xl border border-border bg-card text-center space-y-1">
                    <p className="text-xs font-semibold text-foreground">No speaking practice history yet.</p>
                    <p className="text-[11px] text-muted-foreground">Select any interview prompt above to complete your first practice session.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {historySessions.map((session) => {
                      const dateStr = session.created_at
                        ? new Date(session.created_at).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "Recently";

                      return (
                        <div
                          key={session.id}
                          onClick={() => selectHistorySession(session)}
                          className="p-4 rounded-xl border border-border bg-card hover:bg-secondary/60 transition-all cursor-pointer space-y-2 group"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 truncate max-w-[180px]">
                              {session.prompt_title || "Speaking Practice"}
                            </span>
                            <span className="text-[10px] font-mono text-muted-foreground shrink-0">{dateStr}</span>
                          </div>

                          <div className="flex items-center justify-between text-xs">
                            <span className="text-[11px] text-muted-foreground">{session.prompt_category}</span>
                            <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                              Score: {session.overall_score}%
                            </span>
                          </div>

                          <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground pt-2 border-t border-border/50">
                            <span>Fluency: {session.fluency}%</span>
                            <span>Pace: {session.pace} WPM</span>
                            <span className="text-purple-600 dark:text-purple-400 font-bold group-hover:underline">
                              View Feedback →
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ---------------------------------------------------------------------
              SUB-VIEW 2: DEDICATED FULL-SCREEN PRACTICE WORKSPACE
             --------------------------------------------------------------------- */}
          {speakingSubView === "practice" && (
            <div className="space-y-6 animate-fade-in">
              {/* Navigation Back Bar */}
              <div className="flex items-center justify-between border-b border-border pb-4">
                <button
                  onClick={handleBackToCatalog}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-border bg-card hover:bg-secondary text-xs font-bold text-foreground transition-all shadow-sm group"
                >
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform text-purple-600 dark:text-purple-400" />
                  <span>Back to Interview Prompts</span>
                </button>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-muted-foreground">
                    Practice Workspace
                  </span>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                    {selectedPrompt.category}
                  </span>
                </div>
              </div>

              {/* Dedicated Practice Screen Layout Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Side: Prompt Guidance & Details (4 cols) */}
                <div className="lg:col-span-4 space-y-4">
                  <div className="p-6 rounded-2xl border border-purple-500/30 bg-purple-500/5 space-y-4 shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-purple-600 dark:text-purple-400 font-mono">
                        {selectedPrompt.category}
                      </span>
                      <span className="text-xs font-mono text-amber-600 dark:text-amber-400 font-semibold px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                        Target: {selectedPrompt.timeLimit}s
                      </span>
                    </div>

                    <h2 className="text-lg font-extrabold text-foreground leading-tight">
                      {selectedPrompt.title}
                    </h2>

                    <div className="p-3 rounded-xl bg-card border border-border text-xs space-y-1.5">
                      <p className="font-bold text-purple-600 dark:text-purple-400 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Recommended Structure:</span>
                      </p>
                      <p className="text-muted-foreground leading-relaxed">
                        {selectedPrompt.tips}
                      </p>
                    </div>

                    {/* Quick tips list */}
                    <div className="space-y-2 text-xs">
                      <p className="font-semibold text-foreground">Practice Guidelines:</p>
                      <ul className="list-disc pl-4 text-muted-foreground space-y-1">
                        <li>Speak at a comfortable, steady pace (120-150 WPM).</li>
                        <li>Minimize filler words such as "um", "uh", "like".</li>
                        <li>Use concrete technical examples and structured metrics.</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Right Side: Recorder Arena & AI Speech Assessment (8 cols) */}
                <div className="lg:col-span-8 space-y-6">
                  {/* Recorder Arena Card */}
                  <div className="p-6 sm:p-8 rounded-2xl border border-border bg-card shadow-sm space-y-6 text-center">
                    {/* Timer */}
                    <div className="text-4xl font-extrabold font-mono text-foreground flex items-center justify-center gap-2">
                      <Clock className={`w-7 h-7 ${isRecording ? "text-rose-500 animate-pulse" : "text-purple-600 dark:text-purple-400"}`} />
                      <span>
                        {Math.floor(speakingTimer / 60).toString().padStart(2, "0")}:
                        {(speakingTimer % 60).toString().padStart(2, "0")}
                      </span>
                    </div>

                    {/* Animated Voice Waveform Simulator */}
                    <div className="flex items-center justify-center gap-1.5 h-14">
                      {[40, 70, 90, 60, 30, 80, 100, 60, 45, 90, 75, 40, 65, 85, 50].map((h, i) => (
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
                      disabled={isAnalyzing}
                      onClick={handleToggleRecording}
                      className={`py-3.5 px-8 rounded-full text-xs sm:text-sm font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2.5 mx-auto ${
                        isAnalyzing
                          ? "bg-purple-500/50 cursor-not-allowed opacity-75"
                          : isRecording
                          ? "bg-rose-600 hover:bg-rose-700 animate-pulse"
                          : "bg-purple-600 hover:bg-purple-500"
                      }`}
                    >
                      {isAnalyzing ? (
                        <>
                          <Sparkles className="w-4 h-4 animate-spin text-white" />
                          <span>Analyzing Recording with AI...</span>
                        </>
                      ) : isRecording ? (
                        <>
                          <MicOff className="w-4 h-4" />
                          <span>Stop & Analyze Speech</span>
                        </>
                      ) : (
                        <>
                          <Mic className="w-4 h-4" />
                          <span>Start Speaking Practice</span>
                        </>
                      )}
                    </button>

                    {/* Microphone Error Alert */}
                    {micError && (
                      <div className="p-3.5 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center justify-between gap-2 max-w-lg mx-auto animate-fade-in">
                        <div className="flex items-center gap-2 text-left">
                          <AlertTriangle className="w-4 h-4 shrink-0 text-rose-500" />
                          <span>{micError}</span>
                        </div>
                        <button onClick={() => setMicError(null)} className="p-1 rounded hover:bg-rose-500/20 text-muted-foreground hover:text-foreground">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}

                    {/* Real Audio Playback Player */}
                    {audioUrl && !isRecording && (
                      <div className="p-4 rounded-xl border border-purple-500/20 bg-secondary/30 text-left max-w-lg mx-auto space-y-2 animate-fade-in">
                        <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider font-mono">
                          Recorded Audio Playback
                        </span>
                        <audio controls src={audioUrl} className="w-full h-9 rounded-lg outline-none" />
                      </div>
                    )}
                  </div>

                  {/* Loading Banner During AI Speech Analysis */}
                  {isAnalyzing && (
                    <div className="p-8 rounded-2xl border border-purple-500/30 bg-purple-500/5 text-center space-y-3 animate-pulse">
                      <Sparkles className="w-7 h-7 text-purple-600 dark:text-purple-400 mx-auto animate-spin" />
                      <p className="text-sm font-bold text-foreground">Analyzing Spoken Response with Gemini AI...</p>
                      <p className="text-xs text-muted-foreground">Evaluating speech transcription, fluency, pace (WPM), clarity, and STAR formatting.</p>
                    </div>
                  )}

                  {/* Feedback Breakdown Screen (Post-Recording) */}
                  {speakingFeedback && !isAnalyzing && (
                    <div className="p-6 rounded-2xl border border-purple-500/30 bg-purple-500/5 space-y-5 animate-fade-in">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-foreground flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" /> AI Speech Assessment
                        </span>
                        <span className="text-sm font-mono font-bold text-emerald-600 dark:text-emerald-400 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                          Overall Score: {speakingFeedback.vocabularyScore}%
                        </span>
                      </div>

                      {/* Verbatim Transcript */}
                      {speakingFeedback.transcript && (
                        <div className="p-4 rounded-xl bg-card border border-border text-left space-y-1.5">
                          <p className="text-[10px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider font-mono">
                            Spoken Transcript
                          </p>
                          <p className="text-xs sm:text-sm text-foreground italic leading-relaxed">"{speakingFeedback.transcript}"</p>
                        </div>
                      )}

                      {/* 3 Metric Summary Grid */}
                      <div className="grid grid-cols-3 gap-3">
                        <div className="p-3.5 rounded-xl bg-card border border-border text-center">
                          <p className="text-[11px] text-muted-foreground font-semibold">Fluency</p>
                          <p className="text-lg font-mono font-bold text-purple-600 dark:text-purple-400">{speakingFeedback.fluency}%</p>
                        </div>
                        <div className="p-3.5 rounded-xl bg-card border border-border text-center">
                          <p className="text-[11px] text-muted-foreground font-semibold">Cadence / Pace</p>
                          <p className="text-lg font-mono font-bold text-teal-600 dark:text-teal-400">{speakingFeedback.paceWpm} WPM</p>
                        </div>
                        <div className="p-3.5 rounded-xl bg-card border border-border text-center">
                          <p className="text-[11px] text-muted-foreground font-semibold">Clarity</p>
                          <p className="text-lg font-mono font-bold text-emerald-600 dark:text-emerald-400">{speakingFeedback.clarity}%</p>
                        </div>
                      </div>

                      {/* Filler words list */}
                      {speakingFeedback.fillerWords && speakingFeedback.fillerWords.length > 0 && (
                        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs">
                          <span className="font-bold text-amber-600 dark:text-amber-400">Detected Hesitations / Fillers: </span>
                          <span className="font-mono text-muted-foreground">{speakingFeedback.fillerWords.join(", ")}</span>
                        </div>
                      )}

                      {/* STAR Breakdown */}
                      {speakingFeedback.starFeedback && (
                        <div className="p-4 rounded-xl bg-card border border-border text-xs text-left space-y-2">
                          <p className="font-bold text-purple-600 dark:text-purple-400 font-mono text-[11px]">STAR Behavioral Breakdown:</p>
                          {speakingFeedback.starFeedback.situation && <p><span className="font-bold text-foreground">Situation:</span> <span className="text-muted-foreground">{speakingFeedback.starFeedback.situation}</span></p>}
                          {speakingFeedback.starFeedback.task && <p><span className="font-bold text-foreground">Task:</span> <span className="text-muted-foreground">{speakingFeedback.starFeedback.task}</span></p>}
                          {speakingFeedback.starFeedback.action && <p><span className="font-bold text-foreground">Action:</span> <span className="text-muted-foreground">{speakingFeedback.starFeedback.action}</span></p>}
                          {speakingFeedback.starFeedback.result && <p><span className="font-bold text-foreground">Result:</span> <span className="text-muted-foreground">{speakingFeedback.starFeedback.result}</span></p>}
                        </div>
                      )}

                      {/* Strengths & Suggestions */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                        <div className="p-3.5 rounded-xl bg-card border border-border">
                          <p className="font-bold text-emerald-600 dark:text-emerald-400 mb-1">Key Strengths:</p>
                          <ul className="list-disc pl-4 text-muted-foreground space-y-1">
                            {speakingFeedback.strengths.map((s, idx) => (
                              <li key={idx}>{s}</li>
                            ))}
                          </ul>
                        </div>

                        <div className="p-3.5 rounded-xl bg-card border border-border">
                          <p className="font-bold text-amber-600 dark:text-amber-400 mb-1">Actionable Suggestions:</p>
                          <ul className="list-disc pl-4 text-muted-foreground space-y-1">
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
        </div>
      )}

      {/* =========================================================================
          TAB 2: RECRUITER & HR OUTREACH STUDIO
         ========================================================================= */}
      {activeTab === "outreach" && (
        <div className="space-y-6 animate-fade-in">
          {/* Message Type Selector Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              {
                id: "recruiter_email",
                title: "Recruiter Cold Email",
                desc: "Formal cold outreach to recruiters or hiring managers.",
                icon: Mail,
                badge: "Email Format",
              },
              {
                id: "linkedin_message",
                title: "LinkedIn Recruiter Msg",
                desc: "Short, punchy note for LinkedIn connections or InMail.",
                icon: MessageSquare,
                badge: "Short & Direct",
              },
              {
                id: "interview_followup",
                title: "Interview Follow-Up",
                desc: "Post-interview thank you & recap of key discussion points.",
                icon: CheckCircle,
                badge: "Post-Interview",
              },
              {
                id: "networking_message",
                title: "Networking Message",
                desc: "Low-pressure request for coffee chat or informational interview.",
                icon: Users,
                badge: "Relationship",
              },
            ].map((item) => {
              const isSelected = outreachType === item.id;
              const IconComp = item.icon;
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    setOutreachType(item.id as OutreachType);
                    setOutreachError(null);
                  }}
                  className={`p-4 rounded-xl border transition-all cursor-pointer space-y-2 flex flex-col justify-between ${
                    isSelected
                      ? "border-purple-500 bg-purple-500/10 shadow-sm ring-1 ring-purple-500/50"
                      : "border-border bg-card hover:bg-secondary/60"
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className={`p-2 rounded-lg ${isSelected ? "bg-purple-600 text-white" : "bg-secondary text-purple-600 dark:text-purple-400"}`}>
                        <IconComp className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-secondary border border-border text-muted-foreground">
                        {item.badge}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-foreground mt-2">{item.title}</h4>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Form & Draft Output Workspace Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Inputs Column (6 cols) */}
            <div className="lg:col-span-6 p-5 sm:p-6 rounded-2xl border border-border bg-card space-y-4 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <h3 className="text-sm font-bold text-foreground">Message Context & Details</h3>
                </div>
                <span className="text-[10px] font-mono text-purple-600 dark:text-purple-400 font-semibold bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                  Factual Safety Enabled
                </span>
              </div>

              {/* Error banner */}
              {outreachError && (
                <div className="p-3 rounded-xl border border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-300 text-xs flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{outreachError}</span>
                </div>
              )}

              <div className="space-y-3 text-xs">
                {/* Recipient Name (Optional) */}
                <div>
                  <label className="font-semibold text-muted-foreground flex items-center justify-between mb-1">
                    <span>Recipient Name</span>
                    <span className="text-[10px] text-muted-foreground font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Sarah Jenkins or Tech Talent Team"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    maxLength={200}
                    className="w-full px-3.5 py-2 rounded-xl border border-border bg-secondary text-foreground text-xs outline-none focus:border-purple-500 transition-colors"
                  />
                </div>

                {/* Company Name & Role Title Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-muted-foreground flex items-center justify-between mb-1">
                      <span>Company Name</span>
                      <span className="text-[10px] font-mono text-purple-600 dark:text-purple-400 font-normal">*Target</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Microsoft, Google, Acme Corp"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      maxLength={300}
                      className="w-full px-3.5 py-2 rounded-xl border border-border bg-secondary text-foreground text-xs outline-none focus:border-purple-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-muted-foreground flex items-center justify-between mb-1">
                      <span>Role / Job Title</span>
                      <span className="text-[10px] font-mono text-purple-600 dark:text-purple-400 font-normal">*Target</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. SDE-1, Frontend Developer"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      maxLength={300}
                      className="w-full px-3.5 py-2 rounded-xl border border-border bg-secondary text-foreground text-xs outline-none focus:border-purple-500 transition-colors"
                    />
                  </div>
                </div>

                {/* Tone Selector */}
                <div>
                  <label className="font-semibold text-muted-foreground mb-1 block">Communication Tone</label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {(["professional", "enthusiastic", "concise", "formal"] as const).map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setTone(t)}
                        className={`py-1.5 px-2 rounded-lg text-[11px] font-semibold capitalize transition-all border ${
                          tone === t
                            ? "bg-purple-600 text-white border-purple-600 shadow-sm"
                            : "bg-secondary border-border text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Job Context / Job Description (Optional) */}
                <div>
                  <label className="font-semibold text-muted-foreground flex items-center justify-between mb-1">
                    <span>Job Description or Requirements Context</span>
                    <span className="text-[10px] text-muted-foreground font-normal">(Optional)</span>
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Looking for engineers experienced in React, Next.js, and backend REST APIs..."
                    value={jobContext}
                    onChange={(e) => setJobContext(e.target.value)}
                    maxLength={10000}
                    className="w-full px-3.5 py-2 rounded-xl border border-border bg-secondary text-foreground text-xs outline-none focus:border-purple-500 transition-colors resize-none"
                  />
                </div>

                {/* Your Skills & Experience Context (Optional / Auto-fillable) */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-semibold text-muted-foreground flex items-center gap-1.5">
                      <span>Your Skills & Relevant Achievements</span>
                      <span className="text-[10px] text-muted-foreground font-normal">(Optional)</span>
                    </label>
                    <button
                      type="button"
                      onClick={handleAutofillResume}
                      disabled={isFetchingResume}
                      className="text-[10px] font-semibold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"
                    >
                      {isFetchingResume ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <Sparkles className="w-3 h-3" />
                      )}
                      <span>Auto-fill from Resume</span>
                    </button>
                  </div>
                  <textarea
                    rows={3}
                    placeholder="e.g. B.Tech Computer Science student with experience in Python, React, PostgreSQL, and building AI applications..."
                    value={userContext}
                    onChange={(e) => setUserContext(e.target.value)}
                    maxLength={10000}
                    className="w-full px-3.5 py-2 rounded-xl border border-border bg-secondary text-foreground text-xs outline-none focus:border-purple-500 transition-colors resize-none"
                  />
                </div>
              </div>

              {/* Generate Button */}
              <button
                onClick={handleGenerateOutreach}
                disabled={isGeneratingOutreach}
                className="w-full py-3 px-4 rounded-xl text-xs font-bold text-white pm-btn-gradient shadow-md flex items-center justify-center gap-2 hover:opacity-95 transition-all disabled:opacity-50 cursor-pointer"
              >
                {isGeneratingOutreach ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Generating Factual Outreach Draft...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate Outreach Draft</span>
                  </>
                )}
              </button>
            </div>

            {/* Right: Draft Preview & Editable Workspace (6 cols) */}
            <div className="lg:col-span-6 p-5 sm:p-6 rounded-2xl border border-border bg-card space-y-4 shadow-sm flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-border">
                  <div className="flex items-center gap-2">
                    <Send className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    <h3 className="text-sm font-bold text-foreground">Generated Draft Workspace</h3>
                  </div>
                  {generatedBody && (
                    <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" /> Fully Editable
                    </span>
                  )}
                </div>

                {!generatedBody && !isGeneratingOutreach && (
                  <div className="py-16 text-center space-y-3">
                    <Mail className="w-12 h-12 text-muted-foreground/30 mx-auto" />
                    <div>
                      <h4 className="text-sm font-bold text-foreground">No Outreach Draft Generated Yet</h4>
                      <p className="text-xs text-muted-foreground mt-1 max-w-xs mx-auto leading-relaxed">
                        Select a message type on top, provide target company/role details, and click "Generate Outreach Draft".
                      </p>
                    </div>
                  </div>
                )}

                {isGeneratingOutreach && (
                  <div className="py-16 text-center space-y-4 animate-pulse">
                    <Sparkles className="w-8 h-8 text-purple-600 dark:text-purple-400 mx-auto animate-spin" />
                    <div>
                      <h4 className="text-sm font-bold text-foreground">Crafting Professional Message...</h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        Ensuring zero fabricated credentials, concise recruiter-friendly phrasing, and authentic tone.
                      </p>
                    </div>
                  </div>
                )}

                {generatedBody && !isGeneratingOutreach && (
                  <div className="space-y-4">
                    {/* Subject Line Field (If present) */}
                    {generatedSubject !== undefined && (
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider font-mono">
                            Subject Line
                          </label>
                          <button
                            type="button"
                            onClick={handleCopySubject}
                            className="text-[10px] font-semibold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"
                          >
                            {copiedSubject ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-500" />
                                <span className="text-emerald-500 font-bold">Copied Subject</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Copy Subject</span>
                              </>
                            )}
                          </button>
                        </div>
                        <input
                          type="text"
                          value={generatedSubject}
                          onChange={(e) => setGeneratedSubject(e.target.value)}
                          className="w-full px-3.5 py-2 rounded-xl border border-purple-500/30 bg-secondary text-foreground text-xs font-semibold outline-none focus:border-purple-500 transition-colors"
                        />
                      </div>
                    )}

                    {/* Message Body Textarea */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider font-mono">
                          Message Body
                        </label>
                        <button
                          type="button"
                          onClick={handleCopyBody}
                          className="text-[10px] font-semibold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"
                        >
                          {copiedBody ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-500" />
                              <span className="text-emerald-500 font-bold">Copied Full Message</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy Full Message</span>
                            </>
                          )}
                        </button>
                      </div>
                      <textarea
                        rows={10}
                        value={generatedBody}
                        onChange={(e) => setGeneratedBody(e.target.value)}
                        className="w-full p-3.5 rounded-xl border border-purple-500/30 bg-secondary text-foreground text-xs font-mono leading-relaxed outline-none focus:border-purple-500 transition-colors resize-y"
                      />
                    </div>

                    {/* Notes / Factual Safety Badge */}
                    {generatedNotes && generatedNotes.length > 0 && (
                      <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 space-y-1">
                        <span className="text-[10px] font-bold text-purple-700 dark:text-purple-300 uppercase tracking-wider font-mono">
                          AI Guidelines & Compliance
                        </span>
                        <ul className="text-[11px] text-muted-foreground list-disc pl-4 space-y-0.5">
                          {generatedNotes.map((note, i) => (
                            <li key={i}>{note}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Bottom Action Footer */}
              {generatedBody && !isGeneratingOutreach && (
                <div className="pt-3 border-t border-border flex items-center justify-between gap-3">
                  <span className="text-[11px] text-muted-foreground">
                    {generatedBody.length} characters • {generatedBody.split(/\s+/).filter(Boolean).length} words
                  </span>
                  <button
                    onClick={handleCopyBody}
                    className="py-2 px-5 rounded-xl text-xs font-bold text-white pm-btn-gradient shadow-sm flex items-center gap-1.5 hover:opacity-95 transition-all"
                  >
                    {copiedBody ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Message</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 3: GROUP DISCUSSION (GD) REAL-TIME ARENA
         ========================================================================= */}
      {activeTab === "gd" && (
        <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
          {/* Error Banner */}
          {gdError && (
            <div className="p-3.5 rounded-xl border border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-300 text-xs flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-red-500" />
                <span>{gdError}</span>
              </div>
              <button onClick={() => setGdError(null)} className="text-muted-foreground hover:text-foreground">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* LOBBY STEP: CREATE OR JOIN ROOM */}
          {gdStep === "lobby" && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Left: Create Room (6 cols) */}
              <div className="md:col-span-6 p-6 rounded-2xl border border-border bg-card space-y-5 shadow-sm">
                <div className="flex items-center justify-between pb-2 border-b border-border">
                  <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                    <Users className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    <span>Create Discussion Room</span>
                  </h3>
                  <span className="text-[10px] font-mono text-purple-600 dark:text-purple-400 font-semibold px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/20">
                    Host Session
                  </span>
                </div>

                <div className="space-y-3.5">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground mb-1 block">Select Prescribed Topic</label>
                    <select
                      value={selectedGdTopic.title}
                      onChange={(e) => {
                        const t = GD_TOPICS.find((top) => top.title === e.target.value);
                        if (t) setSelectedGdTopic(t);
                      }}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-secondary text-foreground text-xs font-medium outline-none focus:border-purple-500 transition-colors cursor-pointer"
                    >
                      {GD_TOPICS.map((t) => (
                        <option key={t.title} value={t.title}>
                          {t.title} ({t.difficulty})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-muted-foreground mb-1 flex items-center justify-between">
                      <span>Custom Topic / Prompt</span>
                      <span className="text-[10px] text-muted-foreground font-normal">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Or enter custom GD topic..."
                      value={customGdTopic}
                      onChange={(e) => setCustomGdTopic(e.target.value)}
                      maxLength={500}
                      className="w-full px-3.5 py-2 rounded-xl border border-border bg-secondary text-foreground text-xs outline-none focus:border-purple-500 transition-colors"
                    />
                  </div>

                  <button
                    onClick={handleCreateGdRoom}
                    disabled={isCreatingRoom}
                    className="w-full py-3 rounded-xl text-xs font-bold text-white pm-btn-gradient shadow-md flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                  >
                    {isCreatingRoom ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Creating Room...</span>
                      </>
                    ) : (
                      <>
                        <Users className="w-4 h-4" />
                        <span>Create & Host Room</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Right: Join Room by Code (6 cols) */}
              <div className="md:col-span-6 p-6 rounded-2xl border border-border bg-card space-y-5 shadow-sm flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-border">
                    <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                      <Radio className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                      <span>Join Existing Room</span>
                    </h3>
                    <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                      Multi-User Sync
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-semibold text-muted-foreground mb-1 block">Enter Room Code</label>
                      <input
                        type="text"
                        placeholder="e.g. GD-A7X9"
                        value={joinRoomInput}
                        onChange={(e) => setJoinRoomInput(e.target.value.toUpperCase())}
                        maxLength={10}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-secondary text-foreground text-xs font-mono font-bold uppercase tracking-wider outline-none focus:border-purple-500 transition-colors"
                      />
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      Ask your host for the 6-character room code to join an active Group Discussion lobby.
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleJoinGdRoom}
                  disabled={isJoiningRoom || !joinRoomInput.trim()}
                  className="w-full py-3 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 shadow-md flex items-center justify-center gap-2 disabled:opacity-50 transition-all cursor-pointer"
                >
                  {isJoiningRoom ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Joining Room...</span>
                    </>
                  ) : (
                    <>
                      <ArrowRight className="w-4 h-4" />
                      <span>Join Room Arena</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* WAITING ROOM STEP */}
          {gdStep === "waiting" && activeRoomData && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 animate-fade-in">
              {/* Left Room Details & Host Controls (6 cols) */}
              <div className="md:col-span-6 p-6 rounded-2xl border border-purple-500/30 bg-card space-y-5 shadow-sm">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
                    Waiting Room Lobby
                  </span>
                  <h3 className="text-lg font-bold text-foreground">{activeRoomData.topic}</h3>
                </div>

                {/* Shareable Code Box */}
                <div className="p-3.5 rounded-xl border border-purple-500/30 bg-purple-500/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-purple-700 dark:text-purple-300">Invite Participants</span>
                    <span className="text-[10px] font-mono text-muted-foreground">Code: {activeRoomData.room_id}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      readOnly
                      value={activeRoomData.room_id}
                      className="w-full px-3 py-1.5 rounded-lg border border-border bg-card text-foreground text-xs font-mono font-bold tracking-wider select-all outline-none"
                    />
                    <button
                      onClick={handleCopyJoinLink}
                      className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shrink-0 flex items-center gap-1"
                    >
                      {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedLink ? "Copied" : "Copy Code"}</span>
                    </button>
                  </div>
                </div>

                {/* Host vs Participant Status */}
                {activeRoomData.host_user_id === user?.id || activeRoomData.is_host ? (
                  <div className="space-y-3 pt-2">
                    <button
                      onClick={handleStartGd}
                      className="w-full py-3 rounded-xl text-xs font-bold text-white pm-btn-gradient shadow-md flex items-center justify-center gap-2 hover:opacity-95 transition-all cursor-pointer"
                    >
                      <Play className="w-4 h-4 fill-white" />
                      <span>Start Discussion Now</span>
                    </button>
                    <p className="text-[11px] text-center text-muted-foreground">You are the host. Click start when participants are ready.</p>
                  </div>
                ) : (
                  <div className="p-4 rounded-xl border border-purple-500/20 bg-purple-500/5 text-center space-y-2 animate-pulse">
                    <Clock className="w-5 h-5 text-purple-600 dark:text-purple-400 mx-auto" />
                    <p className="text-xs font-bold text-foreground">Waiting for host to start discussion...</p>
                    <p className="text-[11px] text-muted-foreground">Discussion will begin automatically when the host launches the room.</p>
                  </div>
                )}

                <div className="pt-2">
                  <button
                    onClick={handleLeaveGd}
                    className="w-full py-2 px-4 rounded-xl border border-border text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Leave Waiting Room
                  </button>
                </div>
              </div>

              {/* Right Participant List (6 cols) */}
              <div className="md:col-span-6 p-6 rounded-2xl border border-border bg-card space-y-4 shadow-sm">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <h4 className="text-sm font-bold text-foreground">
                    Connected Participants ({activeRoomData.participants.length}/{activeRoomData.max_participants})
                  </h4>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                    Live Syncing
                  </span>
                </div>

                <div className="space-y-2.5">
                  {activeRoomData.participants.map((p) => (
                    <div
                      key={p.user_id}
                      className="p-3 rounded-xl border border-border bg-secondary/40 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-purple-600/30 border border-purple-500/40 flex items-center justify-center text-purple-700 dark:text-purple-300 font-bold font-mono text-xs">
                          {p.display_name[0]?.toUpperCase() || "U"}
                        </div>
                        <div>
                          <p className="font-bold text-foreground flex items-center gap-1.5">
                            <span>{p.display_name}</span>
                            {p.user_id === user?.id && <span className="text-[10px] text-purple-600 dark:text-purple-400 font-normal">(You)</span>}
                          </p>
                          <span className="text-[10px] text-muted-foreground">{p.is_host ? "Room Host" : "Participant"}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-[11px]">
                        <Check className="w-3.5 h-3.5" /> {p.is_connected ? "Connected" : "Disconnected"}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* LIVE DISCUSSION ARENA STEP */}
          {gdStep === "live" && activeRoomData && (
            <div className="p-6 sm:p-8 rounded-2xl border border-purple-500/30 bg-card space-y-6 shadow-sm animate-fade-in">
              {/* Header Bar */}
              <div className="flex items-center justify-between border-b border-border pb-4 gap-4">
                <div>
                  <span className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
                    <Radio className="w-3.5 h-3.5 animate-pulse text-purple-500" /> Active Group Discussion
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-foreground">{activeRoomData.topic}</h3>
                </div>

                <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-mono font-bold shrink-0">
                  <Clock className="w-4 h-4 animate-pulse" />
                  <span>Time Remaining: {formatTimer(gdTimerRemaining)}</span>
                </div>
              </div>

              {/* Participant Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {activeRoomData.participants.map((p) => {
                  const isYou = p.user_id === user?.id;
                  return (
                    <div
                      key={p.user_id}
                      className={`p-4 rounded-xl border transition-all space-y-3 ${
                        p.is_speaking
                          ? "border-emerald-500 bg-emerald-500/10 shadow-sm ring-1 ring-emerald-500/50"
                          : isYou
                          ? "border-purple-500/40 bg-purple-500/10"
                          : "border-border bg-secondary/30"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${isYou ? "bg-purple-600 text-white" : "bg-secondary text-foreground border border-border"}`}>
                            {p.display_name[0]?.toUpperCase() || "U"}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-foreground truncate max-w-[110px]">
                              {p.display_name} {isYou && "(You)"}
                            </p>
                            <p className="text-[10px] text-muted-foreground">{p.is_host ? "Host" : "Participant"}</p>
                          </div>
                        </div>

                        {p.is_speaking ? (
                          <span className="p-1.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                            <Volume2 className="w-3.5 h-3.5 animate-bounce" />
                          </span>
                        ) : (
                          <span className={`w-2 h-2 rounded-full ${p.is_connected ? "bg-emerald-500" : "bg-muted"}`} />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Suggested Discussion Guidelines */}
              <div className="p-4 rounded-xl border border-border bg-secondary/30 space-y-2 text-xs">
                <p className="font-bold text-foreground flex items-center gap-1.5">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-500" /> Recommended Group Discussion Guidelines:
                </p>
                <ul className="list-disc pl-5 text-muted-foreground space-y-1 leading-relaxed">
                  <li>Initiate with a clear structural overview or definition of the topic.</li>
                  <li>Support claims with concrete industry examples, data points, or historical trends.</li>
                  <li>Listen actively without interrupting and acknowledge peer contributions respectfully.</li>
                </ul>
              </div>

              {/* Action Buttons Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-border gap-4">
                <button
                  onClick={handleLeaveGd}
                  className="px-4 py-2 rounded-xl border border-border text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
                >
                  Leave Session
                </button>

                {(activeRoomData.host_user_id === user?.id || activeRoomData.is_host) && (
                  <button
                    onClick={handleEndGd}
                    className="px-6 py-2.5 rounded-xl text-xs font-bold text-white pm-btn-gradient shadow-md hover:opacity-95 transition-all cursor-pointer"
                  >
                    Conclude GD Session
                  </button>
                )}
              </div>
            </div>
          )}

          {/* POST-GD FEEDBACK STEP */}
          {gdStep === "feedback" && (
            <div className="p-6 sm:p-8 rounded-2xl border border-purple-500/30 bg-card space-y-6 shadow-sm text-center animate-fade-in">
              <Trophy className="w-10 h-10 text-amber-500 dark:text-amber-400 mx-auto animate-bounce" />
              <div>
                <h3 className="text-xl font-bold text-foreground">Group Discussion Concluded</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Topic: {activeRoomData?.topic || selectedGdTopic.title}
                </p>
              </div>

              {/* Quick Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-lg mx-auto">
                <div className="p-3 rounded-xl bg-secondary/50 border border-border">
                  <p className="text-[10px] text-muted-foreground font-semibold">Total Duration</p>
                  <p className="text-base font-mono font-bold text-purple-600 dark:text-purple-400">15:00</p>
                </div>
                <div className="p-3 rounded-xl bg-secondary/50 border border-border">
                  <p className="text-[10px] text-muted-foreground font-semibold">Participants</p>
                  <p className="text-base font-mono font-bold text-teal-600 dark:text-teal-400">
                    {activeRoomData?.participants?.length || 1} Users
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-secondary/50 border border-border">
                  <p className="text-[10px] text-muted-foreground font-semibold">Sync Status</p>
                  <p className="text-base font-mono font-bold text-emerald-600 dark:text-emerald-400">Synced</p>
                </div>
                <div className="p-3 rounded-xl bg-secondary/50 border border-border">
                  <p className="text-[10px] text-muted-foreground font-semibold">Room Code</p>
                  <p className="text-base font-mono font-bold text-amber-600 dark:text-amber-400">
                    {gdRoomCode || "GD-ROOM"}
                  </p>
                </div>
              </div>

              {/* AI Evaluation Button if not fetched yet */}
              {!gdEvaluationData && (
                <div className="pt-2">
                  <button
                    onClick={handleFetchGdEvaluation}
                    disabled={isEvaluatingGd}
                    className="py-3 px-6 rounded-xl text-xs font-bold text-white pm-btn-gradient shadow-md flex items-center justify-center gap-2 mx-auto disabled:opacity-50 transition-all cursor-pointer"
                  >
                    {isEvaluatingGd ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Evaluating Participation & Signals...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>Get AI Individual Evaluation</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* AI Scorecard Display */}
              {gdEvaluationData && (
                <div className="space-y-5 text-left pt-2 border-t border-border animate-fade-in">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" /> AI Scorecard & Signals
                    </span>
                    {gdEvaluationData.overall_score !== null && (
                      <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
                        Overall Score: {gdEvaluationData.overall_score}%
                      </span>
                    )}
                  </div>

                  {/* Dimensions Breakdown Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    {Object.entries(gdEvaluationData.dimensions).map(([dimKey, dim]) => (
                      <div key={dimKey} className="p-3.5 rounded-xl border border-border bg-secondary/30 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-foreground capitalize">{dimKey.replace("_", " ")}</span>
                          <span className="font-mono font-bold text-xs">
                            {dim.score !== null ? (
                              <span className="text-purple-600 dark:text-purple-400">{dim.score}%</span>
                            ) : (
                              <span className="text-muted-foreground text-[10px]">N/A (No Speech Stream)</span>
                            )}
                          </span>
                        </div>
                        <p className="text-[11px] text-muted-foreground leading-relaxed">{dim.reason}</p>
                      </div>
                    ))}
                  </div>

                  {/* Strengths & Suggestions */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    {gdEvaluationData.strengths?.length > 0 && (
                      <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-1">
                        <p className="font-bold text-emerald-600 dark:text-emerald-400 font-mono text-[11px]">Observed Strengths:</p>
                        <ul className="list-disc pl-4 text-muted-foreground space-y-1">
                          {gdEvaluationData.strengths.map((s, idx) => (
                            <li key={idx}>{s}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {gdEvaluationData.suggestions?.length > 0 && (
                      <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-1">
                        <p className="font-bold text-amber-600 dark:text-amber-400 font-mono text-[11px]">Actionable Recommendations:</p>
                        <ul className="list-disc pl-4 text-muted-foreground space-y-1">
                          {gdEvaluationData.suggestions.map((s, idx) => (
                            <li key={idx}>{s}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Data Limitation Banner */}
                  {gdEvaluationData.data_limitations?.length > 0 && (
                    <div className="p-3 rounded-xl border border-purple-500/20 bg-purple-500/10 text-xs text-muted-foreground flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 shrink-0 text-purple-600 dark:text-purple-400 mt-0.5" />
                      <div className="space-y-0.5">
                        <p className="font-bold text-purple-700 dark:text-purple-300">Data Limitation Notice</p>
                        {gdEvaluationData.data_limitations.map((lim, idx) => (
                          <p key={idx} className="leading-relaxed">{lim}</p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <button
                onClick={() => {
                  setGdStep("lobby");
                  setActiveRoomData(null);
                  setGdEvaluationData(null);
                }}
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