import React, { useState, useCallback, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  FileText,
  UploadCloud,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Trash2,
  BarChart3,
  Wand2,
  FileSearch,
  FolderOpen,
  X,
  ChevronDown,
  ChevronUp,
  Briefcase,
  Copy,
  Download,
  RefreshCw,
  Check,
  Target,
  Award,
  Zap,
  Lock,
  Layers,
  History as HistoryIcon,
  LayoutDashboard,
  HelpCircle,
  Sliders,
  Send,
  ExternalLink,
  Eye,
  Maximize2,
  Minimize2,
  TrendingUp,
  RotateCcw,
  BookOpen,
  Code2,
  Database,
  Cpu,
  Star,
  Flame,
  AlertTriangle,
  GraduationCap,
  Link as LinkIcon,
  CheckSquare,
  Square,
  Edit3,
  Printer,
  FileCheck2,
  ThumbsUp,
  Plus,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import {
  getResumes,
  getResumeDashboard,
  getResume,
  createResume,
  importResume,
  updateResume,
  deleteResume,
  duplicateResume,
  improveResume,
  analyzeATS,
  matchJobDescription,
  initDefendSession,
  submitDefendAnswer,
  ResumeData,
  ResumeSummary,
  PersonalInfo,
  EducationItem,
  ExperienceItem,
  SkillCategory,
  ProjectItem,
  ResumeImproveResponse,
  ATSAnalysisResponse,
  JobMatchResponse,
  DefendInitResponse,
  DefendAnswerResponse,
  DefendFinalReport,
  DefendClaimEvaluation,
  DefendClaimItem,
} from "@/api/resumeApi";

// ============================================================================
// DATA INTERFACES
// ============================================================================
interface UploadedFileInfo {
  name: string;
  size: number;
  uploadedAt: string;
}

interface AIImproveSession {
  section: string;
  originalText: string;
  improvedText: string;
  explanation: string;
  detectedChanges: string[];
  warnings: string[];
  isLoading: boolean;
}

export default function Resume() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Active full-screen overlay view: null = main dashboard hub, "analysis" = full screen ATS analysis, "improve" = full screen AI studio
  const [activeView, setActiveView] = useState<"analysis" | "improve" | null>(null);

  // Secondary Modals for Defend & Customize
  const [activeModal, setActiveModal] = useState<"defend" | "customize" | null>(null);

  // Modal for Create Resume
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createForm, setCreateForm] = useState({
    name: "",
    target_role: "",
    experience_level: "Fresher",
    template: "modern",
  });
  const [importedResumeContent, setImportedResumeContent] = useState<Partial<ResumeData> | null>(null);
  const importFileInputRef = useRef<HTMLInputElement>(null);

  // Modal for Add Resume (Import Existing Resume)
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const [isDraggingImport, setIsDraggingImport] = useState(false);
  const importModalInputRef = useRef<HTMLInputElement>(null);


  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        if (file.name.endsWith(".json")) {
          const parsed = JSON.parse(text);
          setCreateForm({
            name: parsed.name || file.name.replace(".json", ""),
            target_role: parsed.target_role || "Software Engineer",
            experience_level: parsed.experience_level || "Entry Level",
            template: parsed.template || "modern",
          });
          setImportedResumeContent(parsed);
          toast.success(`Loaded resume content from "${file.name}"`);
        } else {
          const nameFromFile = file.name.replace(/\.[^/.]+$/, "");
          setCreateForm({
            name: nameFromFile,
            target_role: "Software Engineer",
            experience_level: "Entry Level",
            template: "modern",
          });
          setImportedResumeContent({
            summary: text,
          });
          toast.success(`Loaded text content from "${file.name}"`);
        }
      } catch (err) {
        toast.error("Failed to parse resume file. Ensure it is valid JSON or plain text.");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  // Delete Confirmation Modal
  const [deleteTarget, setDeleteTarget] = useState<ResumeSummary | null>(null);

  // Active Loaded Resume State for Editing
  const [activeResume, setActiveResume] = useState<ResumeData | null>(null);
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "unsaved" | "error">("saved");

  // AI Improve Session State
  const [aiSession, setAiSession] = useState<AIImproveSession | null>(null);

  // Job Description Matching State (Phase 2C)
  const [jobDescriptionInput, setJobDescriptionInput] = useState("");
  const [jobMatchResult, setJobMatchResult] = useState<JobMatchResponse | null>(null);
  const [isJobMatching, setIsJobMatching] = useState(false);

  const handleRunJobMatch = async () => {
    const targetId = activeResume?.id || resumesList?.[0]?.id;
    if (!targetId) {
      toast.error("Please create or select a resume first.");
      return;
    }
    if (!jobDescriptionInput || !jobDescriptionInput.trim()) {
      toast.error("Job description is required.");
      return;
    }
    if (jobDescriptionInput.length > 20000) {
      toast.error("Job description exceeds 20,000 characters limit.");
      return;
    }

    setIsJobMatching(true);
    try {
      const result = await matchJobDescription(targetId, jobDescriptionInput.trim());
      setJobMatchResult(result);
      toast.success("Job Description Match completed!");
    } catch (err: any) {
      toast.error(err?.message || "Failed to analyze Job Description Match.");
    } finally {
      setIsJobMatching(false);
    }
  };

  // Defend Your Resume State (Phase 3)
  const [defendSession, setDefendSession] = useState<DefendInitResponse | null>(null);
  const [currentDefendQuestion, setCurrentDefendQuestion] = useState<string>("");
  const [currentDefendClaimId, setCurrentDefendClaimId] = useState<string>("");
  const [defendUserAnswer, setDefendUserAnswer] = useState("");
  const [isDefendSubmitting, setIsDefendSubmitting] = useState(false);
  const [isDefendInitLoading, setIsDefendInitLoading] = useState(false);
  const [isFollowupMode, setIsFollowupMode] = useState(false);
  const [lastClaimEvaluation, setLastClaimEvaluation] = useState<DefendClaimEvaluation | null>(null);
  const [defendFinalReport, setDefendFinalReport] = useState<DefendFinalReport | null>(null);

  const handleInitDefendSession = async (resumeIdOverride?: string) => {
    const targetId = resumeIdOverride || activeResume?.id || resumesList?.[0]?.id;
    if (!targetId) {
      toast.error("Please create or select a resume first.");
      return;
    }

    setIsDefendInitLoading(true);
    setDefendFinalReport(null);
    setLastClaimEvaluation(null);
    setIsFollowupMode(false);
    setDefendUserAnswer("");

    try {
      const res = await initDefendSession(targetId);
      setDefendSession(res);
      setCurrentDefendQuestion(res.first_question || "Explain your experience with this resume claim.");
      setCurrentDefendClaimId(res.first_claim_id || "");
      toast.success(`Defense session initialized! Identified ${res.total_claims} key claims.`);
    } catch (err: any) {
      toast.error(err?.message || "Failed to initialize defense session.");
    } finally {
      setIsDefendInitLoading(false);
    }
  };

  const handleSubmitDefendAnswer = async () => {
    if (!defendSession) return;
    if (!defendUserAnswer || !defendUserAnswer.trim()) {
      toast.error("Please provide your answer before submitting.");
      return;
    }

    const targetId = activeResume?.id || defendSession.resume_id;
    setIsDefendSubmitting(true);

    try {
      const res = await submitDefendAnswer(targetId, {
        session_id: defendSession.session_id,
        claim_id: currentDefendClaimId,
        user_answer: defendUserAnswer.trim(),
        is_followup: isFollowupMode,
      });

      setLastClaimEvaluation(res.claim_evaluation);

      if (res.needs_followup && res.followup_question) {
        setIsFollowupMode(true);
        setCurrentDefendQuestion(res.followup_question);
        setDefendUserAnswer("");
        toast.info("Follow-up probe: Please provide specific implementation details.");
      } else if (res.is_complete && res.final_report) {
        setDefendFinalReport(res.final_report);
        toast.success(`Defense Session Complete! Score: ${res.final_report.overall_defensibility_score}/100`);
      } else if (res.next_question && res.next_claim_id) {
        setIsFollowupMode(false);
        setCurrentDefendQuestion(res.next_question);
        setCurrentDefendClaimId(res.next_claim_id);
        setDefendUserAnswer("");
        toast.success("Answer recorded! Moving to next claim question.");
      }
    } catch (err: any) {
      toast.error(err?.message || "Failed to evaluate answer.");
    } finally {
      setIsDefendSubmitting(false);
    }
  };

  // React Query - Fetch user's resumes
  const {
    data: resumesList,
    isLoading: isResumesLoading,
    isError: isResumesError,
    error: resumesError,
    refetch: refetchResumes,
  } = useQuery({
    queryKey: ["resumes"],
    queryFn: getResumes,
  });

  // React Query - Fetch Dashboard summary stats
  const { data: dashboardStats } = useQuery({
    queryKey: ["resumeDashboard"],
    queryFn: getResumeDashboard,
  });

  // React Query - Fetch Real Backend ATS Analysis (Phase 2B)
  const {
    data: atsAnalysisData,
    isLoading: isAtsLoading,
    isError: isAtsError,
    refetch: refetchAtsAnalysis,
  } = useQuery({
    queryKey: ["atsAnalysis", activeResume?.id],
    queryFn: () => (activeResume?.id ? analyzeATS(activeResume.id) : Promise.reject("No resume active")),
    enabled: !!activeResume?.id && activeView === "analysis",
  });

  // Default uploaded file state
  const [fileInfo, setFileInfo] = useState<UploadedFileInfo | null>({
    name: "Harini_M_Resume.pdf",
    size: 245 * 1024,
    uploadedAt: "Uploaded just now",
  });

  const [isDragging, setIsDragging] = useState(false);

  // Lock body scroll when full-screen overlay or modal is active
  useEffect(() => {
    if (activeView || activeModal || isCreateModalOpen || isImportModalOpen || deleteTarget) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [activeView, activeModal, isCreateModalOpen, isImportModalOpen, deleteTarget]);

  // Debounced Autosave Effect
  const autosaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  const saveActiveResume = useCallback(
    async (dataToSave: ResumeData) => {
      if (!dataToSave || !dataToSave.id) return;
      setSaveStatus("saving");
      try {
        await updateResume(dataToSave.id, {
          name: dataToSave.name,
          target_role: dataToSave.target_role,
          experience_level: dataToSave.experience_level,
          template: dataToSave.template,
          personal_info: dataToSave.personal_info,
          summary: dataToSave.summary,
          education: dataToSave.education,
          experience: dataToSave.experience,
          skills: dataToSave.skills,
          projects: dataToSave.projects,
          certifications: dataToSave.certifications,
          achievements: dataToSave.achievements,
          languages: dataToSave.languages,
          links: dataToSave.links,
          custom_sections: dataToSave.custom_sections,
        });
        setSaveStatus("saved");
        queryClient.invalidateQueries({ queryKey: ["resumes"] });
        queryClient.invalidateQueries({ queryKey: ["resumeDashboard"] });
        queryClient.invalidateQueries({ queryKey: ["atsAnalysis", dataToSave.id] });
      } catch (error) {
        console.error("Autosave failed:", error);
        setSaveStatus("error");
      }
    },
    [queryClient]
  );

  const triggerAutosave = (updatedResume: ResumeData) => {
    setActiveResume(updatedResume);
    setSaveStatus("unsaved");
    if (autosaveTimerRef.current) {
      clearTimeout(autosaveTimerRef.current);
    }
    autosaveTimerRef.current = setTimeout(() => {
      saveActiveResume(updatedResume);
    }, 800);
  };

  // Create Resume Mutation
  const createMutation = useMutation({
    mutationFn: createResume,
    onSuccess: async (newResume) => {
      toast.success("Resume created successfully!");
      setIsCreateModalOpen(false);
      setCreateForm({ name: "", target_role: "", experience_level: "Fresher", template: "modern" });
      queryClient.invalidateQueries({ queryKey: ["resumes"] });
      queryClient.invalidateQueries({ queryKey: ["resumeDashboard"] });

      let finalResume = newResume;
      if (importedResumeContent) {
        try {
          const merged: ResumeData = {
            ...newResume,
            ...importedResumeContent,
            id: newResume.id,
            user_id: newResume.user_id,
            name: newResume.name || importedResumeContent.name || "My Resume",
            target_role: newResume.target_role || importedResumeContent.target_role || "Software Engineer",
          };
          await updateResume(newResume.id, merged);
          finalResume = merged;
          toast.success("Imported resume content saved successfully!");
        } catch (err) {
          console.error("Failed to persist imported resume data:", err);
        } finally {
          setImportedResumeContent(null);
        }
      }

      setActiveResume(finalResume);
      setActiveView("improve");
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to create resume.");
    },
  });

  // Import Resume Mutation (Add Existing Resume)
  const importResumeMutation = useMutation({
    mutationFn: (file: File) => importResume(file),
    onSuccess: (newResume) => {
      toast.success("Resume imported successfully.");
      setIsImportModalOpen(false);
      setImportFile(null);
      setImportError(null);
      queryClient.invalidateQueries({ queryKey: ["resumes"] });
      queryClient.invalidateQueries({ queryKey: ["resumeDashboard"] });
      setActiveResume(newResume);
      setActiveView("improve");
    },
    onError: (err: any) => {
      const errMsg = err?.message || "Failed to import resume. Please try again.";
      setImportError(errMsg);
      toast.error(errMsg);
    },
  });

  // Duplicate Resume Mutation
  const duplicateMutation = useMutation({
    mutationFn: duplicateResume,
    onSuccess: (duplicated) => {
      toast.success(`Created duplicate: "${duplicated.name}"`);
      queryClient.invalidateQueries({ queryKey: ["resumes"] });
      queryClient.invalidateQueries({ queryKey: ["resumeDashboard"] });
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to duplicate resume.");
    },
  });

  // Delete Resume Mutation
  const deleteMutation = useMutation({
    mutationFn: deleteResume,
    onSuccess: () => {
      toast.success("Resume deleted successfully");
      if (activeResume && deleteTarget && activeResume.id === deleteTarget.id) {
        setActiveResume(null);
        setActiveView(null);
      }
      setDeleteTarget(null);
      queryClient.invalidateQueries({ queryKey: ["resumes"] });
      queryClient.invalidateQueries({ queryKey: ["resumeDashboard"] });
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to delete resume.");
    },
  });

  // AI Improve Handler (Phase 2A)
  const handleRequestImprovement = async (section: string, originalText: string, goal = "action_verbs") => {
    if (!activeResume) {
      toast.error("Please select or create a resume first.");
      return;
    }
    if (!originalText || !originalText.trim()) {
      toast.error("Text content cannot be empty for AI improvement.");
      return;
    }

    setAiSession({
      section,
      originalText,
      improvedText: "",
      explanation: "",
      detectedChanges: [],
      warnings: [],
      isLoading: true,
    });

    try {
      const res = await improveResume(activeResume.id, {
        section,
        original_text: originalText,
        improvement_goal: goal,
      });

      setAiSession({
        section,
        originalText: res.original_text,
        improvedText: res.improved_text,
        explanation: res.explanation,
        detectedChanges: res.detected_changes || [],
        warnings: res.warnings || [],
        isLoading: false,
      });
      toast.success("AI improvement generated!");
    } catch (err: any) {
      toast.error(err?.message || "Failed to improve content.");
      setAiSession(null);
    }
  };

  const handleAcceptAIImprovement = () => {
    if (!aiSession || !activeResume) return;

    if (aiSession.section === "summary") {
      const updated = {
        ...activeResume,
        summary: aiSession.improvedText,
      };
      triggerAutosave(updated);
    } else if (aiSession.section === "skills" || aiSession.section === "technical_skills") {
      const lines = aiSession.improvedText.split("\n").filter((l) => l.trim());
      let updatedSkills: SkillCategory[] = [];
      lines.forEach((line, idx) => {
        if (line.includes(":")) {
          const [cat, sks] = line.split(":");
          const skillList = sks.split(",").map((s) => s.trim()).filter(Boolean);
          if (cat.trim() && skillList.length > 0) {
            updatedSkills.push({
              id: `skill-${idx}-${Date.now()}`,
              category: cat.trim(),
              skills: skillList,
            });
          }
        }
      });

      if (updatedSkills.length === 0) {
        updatedSkills = [
          {
            id: `skill-${Date.now()}`,
            category: "Technical Skills",
            skills: aiSession.improvedText.split(",").map((s) => s.trim()).filter(Boolean),
          },
        ];
      }

      const updated = {
        ...activeResume,
        skills: updatedSkills,
      };
      triggerAutosave(updated);
    }
    toast.success("AI improvement accepted & autosaved!");
    setAiSession(null);
  };

  const handleRejectAIImprovement = () => {
    setAiSession(null);
    toast.info("Preserved original content.");
  };

  const handleTryAgainAIImprovement = () => {
    if (!aiSession) return;
    handleRequestImprovement(aiSession.section, aiSession.originalText);
  };

  // Navigating recommendation action to Builder section
  const handleFixInResume = (sectionName: string) => {
    setActiveModal(null);
    setActiveView("improve");
    toast.info(`Navigated to ${sectionName} section in Resume Builder`);
  };

  // Editable Resume State & Personal Info Fallbacks
  const personalInfo: PersonalInfo = activeResume?.personal_info || {
    full_name: user?.name || "Student Name",
    email: user?.email || "student@placementor.ai",
    phone: "+91 98765 43210",
    location: "Chennai, India",
    linkedin: "linkedin.com/in/student",
    github: "github.com/student",
    portfolio: "studentportfolio.dev",
  };

  // Skills Tag Lists
  const skillCategories = {
    languages: activeResume?.skills?.find((s) => s.category.toLowerCase().includes("language"))?.skills || [
      "Python",
      "TypeScript",
      "JavaScript (ES6+)",
      "Java",
      "SQL",
      "C++",
    ],
    frameworks: activeResume?.skills?.find((s) => s.category.toLowerCase().includes("framework"))?.skills || [
      "React 19",
      "Next.js",
      "FastAPI",
      "Node.js",
      "Express",
      "TailwindCSS",
    ],
    databases: activeResume?.skills?.find((s) => s.category.toLowerCase().includes("database"))?.skills || [
      "MongoDB Atlas",
      "Redis",
      "PostgreSQL",
    ],
    toolsAndCloud: activeResume?.skills?.find((s) => s.category.toLowerCase().includes("tool"))?.skills || [
      "Docker",
      "AWS ECS/S3",
      "Git/GitHub",
      "Vitest",
      "CI/CD Pipelines",
    ],
  };

  const handleFileSelection = useCallback((f: File | undefined) => {
    if (!f) return;
    const allowedExtensions = /\.(pdf|doc|docx)$/i;
    if (!f.name.match(allowedExtensions)) {
      toast.error("Please upload a PDF, DOC, or DOCX file.");
      return;
    }
    if (f.size > 5 * 1024 * 1024) {
      toast.error("File size exceeds 5MB limit.");
      return;
    }
    setFileInfo({
      name: f.name,
      size: f.size,
      uploadedAt: "Uploaded just now",
    });
    toast.success("File attached successfully!");
  }, []);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelection(e.target.files?.[0]);
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelection(e.dataTransfer.files?.[0]);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const removeFile = () => setFileInfo(null);

  const openResumeEditor = async (id: string) => {
    try {
      const fullData = await getResume(id);
      setActiveResume(fullData);
      setActiveView("improve");
    } catch (err: any) {
      toast.error("Failed to load resume details.");
    }
  };

  const openAtsAnalysis = async (id?: string) => {
    const targetId = id || activeResume?.id || resumesList?.[0]?.id;
    if (!targetId) {
      setIsCreateModalOpen(true);
      return;
    }
    try {
      const fullData = await getResume(targetId);
      setActiveResume(fullData);
      setActiveView("analysis");
    } catch (err: any) {
      toast.error("Failed to load resume for ATS analysis.");
    }
  };

  const updatePersonalInfoField = (field: keyof PersonalInfo, value: string) => {
    if (!activeResume) return;
    const updated = {
      ...activeResume,
      personal_info: {
        ...activeResume.personal_info,
        [field]: value,
      },
    };
    triggerAutosave(updated);
  };

  const updateSummaryField = (value: string) => {
    if (!activeResume) return;
    const updated = {
      ...activeResume,
      summary: value,
    };
    triggerAutosave(updated);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!createForm.name.trim()) {
      toast.error("Resume name is required");
      return;
    }
    if (!createForm.target_role.trim()) {
      toast.error("Target role is required");
      return;
    }
    createMutation.mutate(createForm);
  };

  // High Fidelity PDF Generation
  const handleDownloadUpdatedPDF = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      toast.error("Please allow popups to download the PDF.");
      return;
    }

    const currentName = activeResume?.personal_info?.full_name || personalInfo.full_name;
    const currentTitle = activeResume?.target_role || personalInfo.location;
    const currentEmail = activeResume?.personal_info?.email || personalInfo.email;
    const currentPhone = activeResume?.personal_info?.phone || personalInfo.phone;
    const currentSummary = activeResume?.summary || "";

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${currentName} - Resume</title>
        <style>
          @page { size: A4; margin: 20mm; }
          body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #1e293b; line-height: 1.5; font-size: 11pt; margin: 0; }
          .header { text-align: center; border-bottom: 2px solid #0f172a; padding-bottom: 12px; margin-bottom: 16px; }
          .name { font-size: 22pt; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; color: #0f172a; margin: 0; }
          .title { font-size: 11pt; font-weight: 600; color: #0d9488; margin-top: 4px; }
          .contact { font-size: 9pt; color: #64748b; margin-top: 6px; }
          h2 { font-size: 12pt; text-transform: uppercase; color: #0f172a; border-bottom: 1px solid #cbd5e1; padding-bottom: 4px; margin-top: 18px; margin-bottom: 8px; letter-spacing: 0.5px; }
          p { margin: 0 0 8px 0; font-size: 10pt; }
          .skills-block { font-size: 9.5pt; margin-bottom: 4px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="name">${currentName}</div>
          <div class="title">${currentTitle}</div>
          <div class="contact">${currentEmail} | ${currentPhone} | ${personalInfo.location}</div>
        </div>

        <h2>Professional Summary</h2>
        <p>${currentSummary}</p>

        <h2>Technical Skills</h2>
        <div class="skills-block"><strong>Languages:</strong> ${skillCategories.languages.join(", ")}</div>
        <div class="skills-block"><strong>Frameworks:</strong> ${skillCategories.frameworks.join(", ")}</div>
        <div class="skills-block"><strong>Databases:</strong> ${skillCategories.databases.join(", ")}</div>
      </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    setTimeout(() => {
      printWindow.focus();
      printWindow.print();
    }, 500);
  };

  // 4 Action Cards on Dashboard Hub
  const cards = [
    {
      id: "analysis" as const,
      title: "View ATS Analysis",
      description: "Get a transparent 100-point ATS analysis of your saved resume with actionable recommendations.",
      button: "View Analysis →",
      accent: "purple",
      icon: BarChart3,
      badge: "Real Backend ATS",
    },
    {
      id: "improve" as const,
      title: "Improve with AI",
      description: "Get real AI suggestions with strict Factual Safety to optimize content and impact.",
      button: "Improve with AI →",
      accent: "teal",
      icon: Wand2,
      badge: "AI Powered",
    },
    {
      id: "defend" as const,
      title: "Defend Your Resume",
      description: "Test whether you can genuinely explain and justify your technical resume claims.",
      button: "Defend Resume →",
      accent: "blue",
      icon: ShieldCheck,
      badge: "Interactive Q&A",
    },
    {
      id: "customize" as const,
      title: "Customize for Job",
      description: "Tailor your resume for a specific job description and increase your match score.",
      button: "Customize Resume →",
      accent: "pink",
      icon: FileSearch,
      badge: "Job Match",
    },
  ];

  const accentStyles: Record<
    string,
    {
      cardBg: string;
      cardBorder: string;
      iconBg: string;
      iconText: string;
      iconGlow: string;
      border: string;
      badgeBg: string;
      buttonBg: string;
      buttonHover: string;
      buttonShadow: string;
    }
  > = {
    purple: {
      cardBg: "from-purple-900/20 via-purple-950/10 to-transparent",
      cardBorder: "border-purple-500/20",
      iconBg: "bg-purple-500/15",
      iconText: "text-purple-400",
      iconGlow: "shadow-[0_0_20px_rgba(168,85,247,0.2)]",
      border: "border-purple-500/30",
      badgeBg: "bg-purple-500/15 text-purple-300 border-purple-500/30",
      buttonBg: "bg-purple-600",
      buttonHover: "hover:bg-purple-500",
      buttonShadow: "shadow-[0_0_20px_rgba(168,85,247,0.3)]",
    },
    teal: {
      cardBg: "from-teal-900/20 via-teal-950/10 to-transparent",
      cardBorder: "border-teal-500/20",
      iconBg: "bg-teal-500/15",
      iconText: "text-teal-400",
      iconGlow: "shadow-[0_0_20px_rgba(20,184,166,0.2)]",
      border: "border-teal-500/30",
      badgeBg: "bg-teal-500/15 text-teal-300 border-teal-500/30",
      buttonBg: "bg-teal-600",
      buttonHover: "hover:bg-teal-500",
      buttonShadow: "shadow-[0_0_20px_rgba(20,184,166,0.3)]",
    },
    blue: {
      cardBg: "from-blue-900/20 via-blue-950/10 to-transparent",
      cardBorder: "border-blue-500/20",
      iconBg: "bg-blue-500/15",
      iconText: "text-blue-400",
      iconGlow: "shadow-[0_0_20px_rgba(59,130,246,0.2)]",
      border: "border-blue-500/30",
      badgeBg: "bg-blue-500/15 text-blue-300 border-blue-500/30",
      buttonBg: "bg-blue-600",
      buttonHover: "hover:bg-blue-500",
      buttonShadow: "shadow-[0_0_20px_rgba(59,130,246,0.3)]",
    },
    pink: {
      cardBg: "from-pink-900/20 via-pink-950/10 to-transparent",
      cardBorder: "border-pink-500/20",
      iconBg: "bg-pink-500/15",
      iconText: "text-pink-400",
      iconGlow: "shadow-[0_0_20px_rgba(236,72,153,0.2)]",
      border: "border-pink-500/30",
      badgeBg: "bg-pink-500/15 text-pink-300 border-pink-500/30",
      buttonBg: "bg-pink-600",
      buttonHover: "hover:bg-pink-500",
      buttonShadow: "shadow-[0_0_20px_rgba(236,72,153,0.3)]",
    },
  };

  return (
    <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto pb-12">
      {/* Top Banner Header */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-900/40 via-indigo-900/20 to-card border border-purple-500/20 p-6 sm:p-8">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>PlaceMentor AI Resume Intelligence</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-foreground tracking-tight">
              Resume Command Center
            </h1>
            <p className="text-sm text-muted-foreground max-w-2xl">
              Create, customize, autosave, and optimize high-impact resumes with real 100-point backend ATS analysis.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => {
                setImportFile(null);
                setImportError(null);
                setIsImportModalOpen(true);
              }}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-purple-500/20 flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
              aria-label="Add Resume"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Add Resume</span>
            </button>
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(true)}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-sm shadow-lg shadow-indigo-500/20 flex items-center gap-2 transition-all hover:scale-105 active:scale-95 border border-indigo-400/20 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              aria-label="Create New Resume"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Resume</span>
            </button>
          </div>
        </div>
      </section>

      {/* PERSISTED RESUMES DASHBOARD GRID */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2">
              <FileText className="w-5 h-5 text-purple-400" />
              Your Saved Resumes
            </h2>
            {dashboardStats && (
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
                {dashboardStats.total_resumes} Resumes • Avg Completion: {dashboardStats.average_completion}%
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={() => {
              setImportFile(null);
              setImportError(null);
              setIsImportModalOpen(true);
            }}
            className="self-start sm:self-auto px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-purple-500/20 flex items-center gap-2 transition-all hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            aria-label="Add Resume"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Resume</span>
          </button>
        </div>

        {isResumesLoading ? (
          <div className="flex items-center justify-center p-12 border border-border rounded-2xl bg-card">
            <Loader2 className="w-6 h-6 text-purple-400 animate-spin mr-2" />
            <span className="text-sm text-muted-foreground font-medium">Loading saved resumes...</span>
          </div>
        ) : isResumesError ? (
          <div className="p-6 border border-purple-500/20 bg-purple-500/10 rounded-2xl text-center space-y-3">
            <Lock className="w-8 h-8 text-purple-400 mx-auto" />
            <p className="text-sm text-purple-200 font-semibold">
              {!user || (resumesError as any)?.message?.includes("401") || (resumesError as any)?.message?.includes("Authentication")
                ? "Please log in to access your saved resumes."
                : "Unable to fetch resumes from database."}
            </p>
            <div className="flex justify-center gap-3">
              {!user || (resumesError as any)?.message?.includes("401") || (resumesError as any)?.message?.includes("Authentication") ? (
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold transition-all shadow-md"
                >
                  Go to Login
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => refetchResumes()}
                  className="px-4 py-1.5 rounded-xl bg-purple-500/20 text-purple-200 text-xs font-bold hover:bg-purple-500/30"
                >
                  Retry Connection
                </button>
              )}
            </div>
          </div>
        ) : !resumesList || resumesList.length === 0 ? (
          <div className="p-8 border border-dashed border-purple-500/30 bg-purple-500/5 rounded-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mx-auto">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">No resumes yet</h3>
              <p className="text-xs text-muted-foreground mt-1">
                You haven&apos;t created any persisted resumes yet. Create your first resume to start building!
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setImportFile(null);
                setImportError(null);
                setIsImportModalOpen(true);
              }}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-purple-500/20 inline-flex items-center gap-2 transition-all hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              aria-label="Add Resume"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add Resume</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {resumesList.map((res) => (
              <div
                key={res.id}
                className="group relative flex flex-col justify-between rounded-2xl border border-border bg-card p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:border-purple-500/30 space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-base font-bold text-foreground group-hover:text-purple-400 transition-colors line-clamp-1">
                        {res.name}
                      </h3>
                      <p className="text-xs text-muted-foreground font-medium mt-0.5">{res.target_role}</p>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20 uppercase shrink-0">
                      {res.template}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-muted-foreground">
                      <span>Completion</span>
                      <span className="text-purple-400 font-bold">{res.completion_percentage}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-secondary overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full transition-all duration-500"
                        style={{ width: `${res.completion_percentage}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-1 border-t border-border/50">
                    <span>Level: {res.experience_level}</span>
                    <span>Updated {new Date(res.updated_at).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 pt-2">
                  <button
                    onClick={() => openResumeEditor(res.id)}
                    className="flex-1 py-2 px-3 rounded-xl bg-purple-600/90 hover:bg-purple-600 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Builder</span>
                  </button>

                  <button
                    onClick={() => openAtsAnalysis(res.id)}
                    className="p-2 rounded-xl bg-purple-500/15 hover:bg-purple-500/25 text-purple-300 border border-purple-500/30 transition-colors"
                    title="View ATS Analysis"
                  >
                    <BarChart3 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => duplicateMutation.mutate(res.id)}
                    disabled={duplicateMutation.isPending}
                    className="p-2 rounded-xl bg-secondary/80 hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                    title="Duplicate Resume"
                  >
                    <Copy className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setDeleteTarget(res)}
                    className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                    title="Delete Resume"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Action Cards */}
      <section className="space-y-4">
        <h2 className="text-lg sm:text-xl font-bold text-foreground">What would you like to do next?</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {cards.map((card) => {
            const Icon = card.icon;
            const style = accentStyles[card.accent];

            const handleCardClick = () => {
              if (card.id === "analysis") {
                openAtsAnalysis();
              } else if (card.id === "improve") {
                if (resumesList && resumesList.length > 0) {
                  openResumeEditor(resumesList[0].id);
                } else {
                  setIsCreateModalOpen(true);
                }
              } else if (card.id === "defend") {
                setActiveModal("defend");
                handleInitDefendSession();
              } else {
                setActiveModal(card.id as any);
              }
            };

            return (
              <div
                key={card.id}
                onClick={handleCardClick}
                className="group relative flex flex-col rounded-2xl border border-border bg-card p-5 sm:p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg cursor-pointer select-none"
              >
                <div className="flex flex-col flex-1 space-y-4">
                  <div className="flex items-center justify-between">
                    <div
                      className={cn(
                        "w-11 h-11 rounded-xl flex items-center justify-center border transition-transform duration-200 group-hover:scale-110",
                        style.iconBg,
                        style.iconText,
                        style.iconGlow,
                        style.border
                      )}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full border", style.badgeBg)}>
                      {card.badge}
                    </span>
                  </div>

                  <div className="space-y-1.5 flex-1">
                    <h3 className="text-sm font-bold text-foreground leading-snug">{card.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{card.description}</p>
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCardClick();
                      }}
                      className={cn(
                        "w-full py-2.5 rounded-xl text-xs font-bold text-white transition-all duration-200 flex items-center justify-center gap-1.5",
                        style.buttonBg,
                        style.buttonHover,
                        style.buttonShadow
                      )}
                    >
                      <span>{card.button}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* CREATE RESUME MODAL */}
      {isCreateModalOpen &&
        createPortal(
          <div className="fixed inset-0 z-[10000] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-card border border-border rounded-3xl max-w-md w-full p-6 space-y-6 shadow-2xl animate-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-purple-400" />
                  <h2 className="text-lg font-bold text-foreground">Create New Resume</h2>
                </div>
                <button onClick={() => setIsCreateModalOpen(false)} className="p-1 rounded-lg hover:bg-secondary text-muted-foreground">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground">Resume Identifier Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. FullStack_Developer_2026"
                    value={createForm.name}
                    onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                    className="w-full p-3 rounded-xl bg-secondary/50 border border-border text-sm text-foreground focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground">Target Role *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Software Engineer / React Developer"
                    value={createForm.target_role}
                    onChange={(e) => setCreateForm({ ...createForm, target_role: e.target.value })}
                    className="w-full p-3 rounded-xl bg-secondary/50 border border-border text-sm text-foreground focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground">Experience Level</label>
                    <select
                      value={createForm.experience_level}
                      onChange={(e) => setCreateForm({ ...createForm, experience_level: e.target.value })}
                      className="w-full p-3 rounded-xl bg-secondary/50 border border-border text-xs text-foreground focus:outline-none focus:border-purple-500"
                    >
                      <option value="Fresher">Fresher</option>
                      <option value="Entry Level">Entry Level</option>
                      <option value="Mid Level">Mid Level</option>
                      <option value="Senior">Senior</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground">Layout Template</label>
                    <select
                      value={createForm.template}
                      onChange={(e) => setCreateForm({ ...createForm, template: e.target.value })}
                      className="w-full p-3 rounded-xl bg-secondary/50 border border-border text-xs text-foreground focus:outline-none focus:border-purple-500"
                    >
                      <option value="modern">Modern</option>
                      <option value="professional">Professional</option>
                      <option value="minimal">Minimal</option>
                      <option value="technical">Technical</option>
                    </select>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl border border-dashed border-purple-500/30 bg-purple-500/5 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
                      <UploadCloud className="w-4 h-4 text-purple-400" />
                      Import Existing File (Optional)
                    </span>
                    <button
                      type="button"
                      onClick={() => importFileInputRef.current?.click()}
                      className="px-3 py-1 rounded-xl bg-purple-600/80 hover:bg-purple-600 text-white text-xs font-bold transition-all"
                    >
                      Choose File
                    </button>
                  </div>
                  <input
                    ref={importFileInputRef}
                    type="file"
                    accept=".json,.txt"
                    onChange={handleImportFile}
                    className="hidden"
                  />
                  {importedResumeContent ? (
                    <p className="text-[11px] text-green-400 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Resume file loaded & ready to save upon creation!
                    </p>
                  ) : (
                    <p className="text-[11px] text-muted-foreground">
                      Upload a .json or .txt resume document to auto-fill your content.
                    </p>
                  )}
                </div>

                <div className="pt-4 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-muted-foreground hover:bg-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={createMutation.isPending}
                    className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-2 shadow-md disabled:opacity-50"
                  >
                    {createMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                    <span>Create Resume</span>
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body
        )}

      {/* ADD RESUME IMPORT MODAL */}
      {isImportModalOpen &&
        createPortal(
          <div className="fixed inset-0 z-[10000] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-card border border-border rounded-3xl max-w-lg w-full p-6 space-y-6 shadow-2xl animate-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div className="flex items-center gap-2">
                  <UploadCloud className="w-5 h-5 text-purple-400" />
                  <h2 className="text-lg font-bold text-foreground">Add Resume</h2>
                </div>
                <button
                  onClick={() => {
                    setIsImportModalOpen(false);
                    setImportFile(null);
                    setImportError(null);
                  }}
                  className="p-1 rounded-lg hover:bg-secondary text-muted-foreground"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed">
                Import your existing resume file (PDF, DOCX, TXT, or JSON). Content will be extracted and saved directly to your account under &quot;Your Saved Resumes&quot;.
              </p>

              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDraggingImport(true);
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  setIsDraggingImport(false);
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDraggingImport(false);
                  const file = e.dataTransfer.files?.[0];
                  if (file) {
                    const ext = file.name.split(".").pop()?.toLowerCase();
                    if (!ext || !["pdf", "docx", "txt", "json"].includes(ext)) {
                      setImportError(`Unsupported file format '.${ext}'. Supported formats are: PDF, DOCX, TXT, JSON.`);
                      setImportFile(null);
                      return;
                    }
                    setImportFile(file);
                    setImportError(null);
                  }
                }}
                onClick={() => importModalInputRef.current?.click()}
                className={cn(
                  "p-6 rounded-2xl border-2 border-dashed transition-all cursor-pointer text-center space-y-3",
                  isDraggingImport
                    ? "border-purple-500 bg-purple-500/10"
                    : importFile
                    ? "border-green-500/50 bg-green-500/5"
                    : "border-border hover:border-purple-500/50 bg-secondary/30"
                )}
              >
                <input
                  ref={importModalInputRef}
                  type="file"
                  accept=".pdf,.docx,.txt,.json"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const ext = file.name.split(".").pop()?.toLowerCase();
                      if (!ext || !["pdf", "docx", "txt", "json"].includes(ext)) {
                        setImportError(`Unsupported file format '.${ext}'. Supported formats are: PDF, DOCX, TXT, JSON.`);
                        setImportFile(null);
                        return;
                      }
                      setImportFile(file);
                      setImportError(null);
                    }
                    e.target.value = "";
                  }}
                  className="hidden"
                />

                {importFile ? (
                  <div className="space-y-2">
                    <div className="w-12 h-12 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 flex items-center justify-center mx-auto">
                      <FileCheck2 className="w-6 h-6" />
                    </div>
                    <h4 className="text-sm font-bold text-foreground">{importFile.name}</h4>
                    <p className="text-xs text-muted-foreground">
                      {(importFile.size / 1024).toFixed(1)} KB • Ready to import & save
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="w-12 h-12 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mx-auto">
                      <UploadCloud className="w-6 h-6" />
                    </div>
                    <h4 className="text-sm font-bold text-foreground">Click or Drag & Drop Resume File</h4>
                    <p className="text-xs text-muted-foreground">
                      Supported formats: PDF, DOCX, TXT, JSON (Max 5MB)
                    </p>
                  </div>
                )}
              </div>

              {importError && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{importError}</span>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-2 border-t border-border">
                <button
                  type="button"
                  onClick={() => {
                    setIsImportModalOpen(false);
                    setImportFile(null);
                    setImportError(null);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-muted-foreground hover:bg-secondary"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={!importFile || importResumeMutation.isPending}
                  onClick={() => {
                    if (importFile) {
                      importResumeMutation.mutate(importFile);
                    }
                  }}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center gap-2 shadow-md disabled:opacity-50 transition-all"
                >
                  {importResumeMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Extracting & Saving...</span>
                    </>
                  ) : (
                    <>
                      <UploadCloud className="w-4 h-4" />
                      <span>Import & Save Resume</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteTarget &&
        createPortal(
          <div className="fixed inset-0 z-[10000] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-card border border-border rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl text-center">
              <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center mx-auto">
                <AlertTriangle className="w-6 h-6" />
              </div>

              <div>
                <h3 className="text-base font-bold text-foreground">Delete Resume?</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Are you sure you want to delete &quot;{deleteTarget.name}&quot;? This action cannot be undone.
                </p>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => setDeleteTarget(null)}
                  className="flex-1 py-2 rounded-xl text-xs font-bold border border-border text-muted-foreground hover:bg-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={() => deleteMutation.mutate(deleteTarget.id)}
                  disabled={deleteMutation.isPending}
                  className="flex-1 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md disabled:opacity-50"
                >
                  {deleteMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* JOB DESCRIPTION MATCHING MODAL (PHASE 2C) */}
      {activeModal === "customize" &&
        createPortal(
          <div className="fixed inset-0 z-[10000] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <div className="bg-[#0B0E24] border border-pink-500/30 rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95">
              {/* Header */}
              <div className="p-6 border-b border-pink-500/20 bg-[#0F1332] flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-pink-500/20 border border-pink-500/30 text-pink-400 flex items-center justify-center">
                    <FileSearch className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
                      Job Description Matching
                    </h2>
                    <p className="text-xs text-slate-300">
                      Evaluate target resume compatibility against a target job description deterministically.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setActiveModal(null)}
                  className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-100">
                {/* Resume Selector & Input Form */}
                <div className="p-5 rounded-2xl bg-[#111638] border border-pink-500/20 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-pink-300 uppercase tracking-wider">Target Resume:</span>
                      <select
                        value={activeResume?.id || resumesList?.[0]?.id || ""}
                        onChange={(e) => openResumeEditor(e.target.value)}
                        className="p-2 rounded-lg bg-[#080A1A] border border-slate-700 text-xs text-white focus:border-pink-400"
                      >
                        {resumesList?.map((r) => (
                          <option key={r.id} value={r.id}>
                            {r.name} ({r.target_role})
                          </option>
                        ))}
                      </select>
                    </div>

                    <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-pink-500/10 text-pink-300 border border-pink-500/20">
                      Deterministic Engine (0–100 Score)
                    </span>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-200 flex items-center justify-between">
                      <span>Target Job Description Text *</span>
                      <span className="text-[10px] text-slate-400">Max 20,000 chars</span>
                    </label>
                    <textarea
                      rows={5}
                      value={jobDescriptionInput}
                      onChange={(e) => setJobDescriptionInput(e.target.value)}
                      placeholder="Paste target job description requirements here...\n\ne.g., We are looking for a Senior Frontend Developer with React, TypeScript, Node.js, and REST API experience..."
                      className="w-full p-3.5 rounded-xl bg-[#080B1E] border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-pink-400 leading-relaxed"
                    />
                  </div>

                  <div className="flex justify-end pt-1">
                    <button
                      onClick={handleRunJobMatch}
                      disabled={isJobMatching}
                      className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-pink-500/20 disabled:opacity-50 transition-all"
                    >
                      {isJobMatching ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Matching Skills & Keywords...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          <span>Analyze Job Match</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* MATCH RESULTS DASHBOARD */}
                {jobMatchResult && (
                  <div className="space-y-6 animate-in fade-in pt-2">
                    {/* Score Hero Banner */}
                    <div className="p-6 rounded-2xl bg-gradient-to-r from-pink-950/40 via-purple-950/20 to-[#0A0D22] border border-pink-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-xl">
                      <div className="flex items-center gap-5">
                        <div className="w-24 h-24 rounded-full bg-[#121636] border-4 border-pink-500/40 flex flex-col items-center justify-center text-center shrink-0 shadow-[0_0_25px_rgba(236,72,153,0.3)]">
                          <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-purple-300 to-emerald-400">
                            {jobMatchResult.overall_match_score}
                          </span>
                          <span className="text-[9px] font-bold text-slate-400 uppercase">/ 100 MATCH</span>
                        </div>

                        <div className="space-y-1">
                          <span className="text-xs font-bold px-3 py-1 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/30 inline-block">
                            {jobMatchResult.overall_match_score >= 80
                              ? "Strong Role Alignment (Top 10%)"
                              : jobMatchResult.overall_match_score >= 60
                              ? "Moderate Match (Requires Optimization)"
                              : "Needs Alignment"}
                          </span>
                          <h3 className="text-xl font-bold text-white">
                            Overall Match Score: {jobMatchResult.overall_match_score}%
                          </h3>
                          <p className="text-xs text-slate-300 max-w-md">
                            Evaluated across Skills (35), Keywords (25), Experience (20), Projects (10), and Education/Certs (10).
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* 5 CATEGORY SCORES */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold text-pink-300 uppercase tracking-wider">
                        Category Alignment Breakdown
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                        <div className="p-3.5 rounded-xl bg-[#111535] border border-pink-500/20 space-y-1.5">
                          <div className="flex justify-between text-xs font-bold text-pink-300">
                            <span>Skills Match</span>
                            <span className="text-white">{jobMatchResult.categories.skills_match}/35</span>
                          </div>
                          <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                            <div className="h-full bg-pink-500 rounded-full" style={{ width: `${(jobMatchResult.categories.skills_match / 35) * 100}%` }} />
                          </div>
                        </div>

                        <div className="p-3.5 rounded-xl bg-[#111535] border border-purple-500/20 space-y-1.5">
                          <div className="flex justify-between text-xs font-bold text-purple-300">
                            <span>Keyword Match</span>
                            <span className="text-white">{jobMatchResult.categories.keyword_match}/25</span>
                          </div>
                          <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                            <div className="h-full bg-purple-500 rounded-full" style={{ width: `${(jobMatchResult.categories.keyword_match / 25) * 100}%` }} />
                          </div>
                        </div>

                        <div className="p-3.5 rounded-xl bg-[#111535] border border-blue-500/20 space-y-1.5">
                          <div className="flex justify-between text-xs font-bold text-blue-300">
                            <span>Experience</span>
                            <span className="text-white">{jobMatchResult.categories.experience_alignment}/20</span>
                          </div>
                          <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                            <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(jobMatchResult.categories.experience_alignment / 20) * 100}%` }} />
                          </div>
                        </div>

                        <div className="p-3.5 rounded-xl bg-[#111535] border border-teal-500/20 space-y-1.5">
                          <div className="flex justify-between text-xs font-bold text-teal-300">
                            <span>Projects</span>
                            <span className="text-white">{jobMatchResult.categories.project_domain_alignment}/10</span>
                          </div>
                          <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                            <div className="h-full bg-teal-500 rounded-full" style={{ width: `${(jobMatchResult.categories.project_domain_alignment / 10) * 100}%` }} />
                          </div>
                        </div>

                        <div className="p-3.5 rounded-xl bg-[#111535] border border-emerald-500/20 space-y-1.5">
                          <div className="flex justify-between text-xs font-bold text-emerald-300">
                            <span>Education/Cert</span>
                            <span className="text-white">{jobMatchResult.categories.education_certification_alignment}/10</span>
                          </div>
                          <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(jobMatchResult.categories.education_certification_alignment / 10) * 100}%` }} />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* MATCHED VS MISSING SKILLS */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-2.5">
                        <h4 className="font-extrabold text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          Matched Technical Skills ({jobMatchResult.matched_skills.length})
                        </h4>
                        {jobMatchResult.matched_skills.length > 0 ? (
                          <div className="flex flex-wrap gap-1.5">
                            {jobMatchResult.matched_skills.map((sk, idx) => (
                              <span key={idx} className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-200 border border-emerald-500/40 text-[11px] font-bold">
                                ✓ {sk}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <p className="text-slate-400 italic">No direct technical skill matches identified in resume.</p>
                        )}
                      </div>

                      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2.5">
                        <div className="space-y-1">
                          <h4 className="font-extrabold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                            <AlertTriangle className="w-4 h-4 text-amber-400" />
                            Potential Skill Gaps ({jobMatchResult.missing_skills.length})
                          </h4>
                          <p className="text-[10px] text-amber-200/80 italic">
                            Potential skill gap — only address this if you genuinely have this experience.
                          </p>
                        </div>
                        {jobMatchResult.missing_skills.length > 0 ? (
                          <div className="flex flex-wrap gap-1.5">
                            {jobMatchResult.missing_skills.map((sk, idx) => (
                              <span key={idx} className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-200 border border-amber-500/40 text-[11px] font-medium">
                                ? {sk}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <p className="text-emerald-300 font-medium">No major missing technical skills detected!</p>
                        )}
                      </div>
                    </div>

                    {/* KEYWORDS BREAKDOWN */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div className="p-4 rounded-2xl bg-[#111634] border border-slate-700/80 space-y-2">
                        <span className="font-bold text-slate-300">Matched Context Keywords ({jobMatchResult.matched_keywords.length})</span>
                        <div className="flex flex-wrap gap-1.5">
                          {jobMatchResult.matched_keywords.map((kw, idx) => (
                            <span key={idx} className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] border border-slate-700">
                              {kw}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="p-4 rounded-2xl bg-[#111634] border border-slate-700/80 space-y-2">
                        <span className="font-bold text-slate-300">Missing Context Keywords ({jobMatchResult.missing_keywords.length})</span>
                        <p className="text-[10px] text-slate-400 italic">
                          Potential keyword to consider — only add it if you genuinely have this skill/experience.
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {jobMatchResult.missing_keywords.map((kw, idx) => (
                            <span key={idx} className="px-2 py-0.5 rounded bg-slate-800/60 text-slate-400 text-[10px] border border-slate-800">
                              {kw}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* RECOMMENDATIONS WITH FIX IN RESUME */}
                    {jobMatchResult.recommendations.length > 0 && (
                      <div className="space-y-3 pt-2">
                        <h4 className="text-xs font-bold text-pink-300 uppercase tracking-wider flex items-center gap-1.5">
                          <Wand2 className="w-4 h-4 text-pink-400" />
                          Targeted Alignment Recommendations
                        </h4>

                        <div className="space-y-3">
                          {jobMatchResult.recommendations.map((rec) => (
                            <div
                              key={rec.id}
                              className="p-4 rounded-2xl bg-[#111638] border border-pink-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
                            >
                              <div className="space-y-1 flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/30 uppercase">
                                    {rec.severity} priority
                                  </span>
                                  <h5 className="font-bold text-white">{rec.title}</h5>
                                </div>
                                <p className="text-slate-300 leading-relaxed">{rec.description}</p>
                              </div>

                              <button
                                onClick={() => handleFixInResume(rec.section)}
                                className="px-4 py-2 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold text-xs shrink-0 flex items-center justify-center gap-1.5 shadow-md"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                                <span>Fix in Resume</span>
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* INTERACTIVE DEFEND YOUR RESUME STUDIO (PHASE 3) */}
      {activeModal === "defend" &&
        createPortal(
          <div className="fixed inset-0 z-[10000] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <div className="bg-[#0A0D26] border border-blue-500/30 rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95">
              {/* Header */}
              <div className="p-6 border-b border-blue-500/20 bg-[#0F1436] flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/30 text-blue-400 flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
                      Defend Your Resume Studio
                    </h2>
                    <p className="text-xs text-slate-300">
                      Test whether you can genuinely explain, justify, and defend your technical claims.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setActiveModal(null)}
                  className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-100">
                {/* STATE 1: INITIAL SUMMARY & START SESSION */}
                {!defendSession && !isDefendInitLoading && (
                  <div className="p-6 rounded-2xl bg-[#101438] border border-blue-500/20 space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                      <div className="space-y-1">
                        <span className="text-xs font-bold text-blue-300 uppercase tracking-wider">Target Resume:</span>
                        <div className="flex items-center gap-2 mt-1">
                          <select
                            value={activeResume?.id || resumesList?.[0]?.id || ""}
                            onChange={(e) => {
                              openResumeEditor(e.target.value);
                              handleInitDefendSession(e.target.value);
                            }}
                            className="p-2.5 rounded-xl bg-[#07091B] border border-slate-700 text-xs text-white focus:border-blue-400"
                          >
                            {resumesList?.map((r) => (
                              <option key={r.id} value={r.id}>
                                {r.name} ({r.target_role})
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <span className="text-[10px] font-mono px-3 py-1 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/20">
                        Zero Hallucinated Claims • Fair Evaluation
                      </span>
                    </div>

                    <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/30 space-y-2 text-xs">
                      <h4 className="font-extrabold text-blue-300 flex items-center gap-2">
                        <Lock className="w-4 h-4 text-blue-400" />
                        Defensibility Core Principles
                      </h4>
                      <p className="text-slate-300 leading-relaxed">
                        Defend ≠ memorize your resume. The engine probes technical understanding, specificity, decision rationale, and ownership. Answers are evaluated for technical substance—<strong>different wording is never penalized</strong>.
                      </p>
                    </div>

                    <div className="flex justify-center pt-2">
                      <button
                        onClick={() => handleInitDefendSession()}
                        className="px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-blue-500/20 transition-all hover:scale-105"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        <span>Start Interactive Defense Session →</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* LOADING STATE */}
                {isDefendInitLoading && (
                  <div className="p-12 flex flex-col items-center justify-center space-y-4 text-center">
                    <Loader2 className="w-10 h-10 text-blue-400 animate-spin" />
                    <p className="text-sm font-semibold text-blue-300">
                      Analyzing resume claims & building technical interview probes...
                    </p>
                  </div>
                )}

                {/* STATE 2: ACTIVE INTERVIEW Q&A SESSION */}
                {defendSession && !defendFinalReport && (
                  <div className="space-y-6 animate-in fade-in">
                    {/* Session Progress Header */}
                    <div className="p-4 rounded-2xl bg-[#101438] border border-blue-500/20 flex flex-wrap items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-blue-300">Active Question</span>
                        <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-200 border border-blue-500/30 text-[10px] font-mono">
                          Claim {defendSession.claims.findIndex(c => c.id === currentDefendClaimId) + 1} of {defendSession.total_claims}
                        </span>
                        {isFollowupMode && (
                          <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold">
                            ⚠️ Follow-up Probe
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => handleInitDefendSession()}
                        className="text-[10px] text-slate-400 hover:text-white underline flex items-center gap-1"
                      >
                        <RotateCcw className="w-3 h-3" /> Reset Session
                      </button>
                    </div>

                    {/* INTERVIEW QUESTION PROBE CARD */}
                    <div className="p-6 rounded-2xl bg-gradient-to-br from-[#121742] via-[#0E1236] to-[#0A0D26] border border-blue-500/30 space-y-4 shadow-xl">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-400 flex items-center gap-1.5">
                          <HelpCircle className="w-4 h-4 text-blue-400" />
                          Interviewer Probe Question
                        </span>
                      </div>

                      <h3 className="text-base sm:text-lg font-bold text-white leading-relaxed">
                        &quot;{currentDefendQuestion}&quot;
                      </h3>

                      {/* USER ANSWER INPUT BOX */}
                      <div className="space-y-2 pt-2">
                        <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                          <span>Your Explanation / Defense *</span>
                          <span className="text-[10px] text-slate-400">Explain implementation, choices & tools</span>
                        </label>
                        <textarea
                          rows={4}
                          value={defendUserAnswer}
                          onChange={(e) => setDefendUserAnswer(e.target.value)}
                          placeholder="Explain your technical design, tools used, performance trade-offs, or personal role...\n\ne.g., I implemented React memoization and lazy loading components, combined with REST API payload caching to handle peak user loads efficiently..."
                          className="w-full p-3.5 rounded-xl bg-[#07091B] border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-400 leading-relaxed"
                        />
                      </div>

                      <div className="flex items-center justify-end pt-1">
                        <button
                          onClick={handleSubmitDefendAnswer}
                          disabled={isDefendSubmitting}
                          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-blue-500/20 disabled:opacity-50 transition-all"
                        >
                          {isDefendSubmitting ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              <span>Evaluating Technical Defense...</span>
                            </>
                          ) : (
                            <>
                              <Send className="w-4 h-4" />
                              <span>{isFollowupMode ? "Submit Follow-up Defense" : "Submit Answer & Proceed"}</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* LAST CLAIM EVALUATION FEEDBACK BANNER */}
                    {lastClaimEvaluation && (
                      <div className="p-4 rounded-2xl bg-[#0D1130] border border-blue-500/20 space-y-3 text-xs animate-in fade-in">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                          <span className="font-bold text-blue-300 flex items-center gap-1.5">
                            <Sparkles className="w-4 h-4 text-emerald-400" />
                            Previous Response Feedback
                          </span>
                          <span
                            className={cn(
                              "text-[10px] font-bold px-2.5 py-0.5 rounded-full border uppercase",
                              lastClaimEvaluation.rating === "strong"
                                ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                                : lastClaimEvaluation.rating === "needs_prep"
                                ? "bg-amber-500/20 text-amber-300 border-amber-500/30"
                                : "bg-red-500/20 text-red-300 border-red-500/30"
                            )}
                          >
                            {lastClaimEvaluation.rating} ({lastClaimEvaluation.score}/100)
                          </span>
                        </div>

                        <p className="text-slate-300">{lastClaimEvaluation.feedback}</p>

                        {lastClaimEvaluation.strengths.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {lastClaimEvaluation.strengths.map((st, idx) => (
                              <span key={idx} className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-200 text-[10px]">
                                ✓ {st}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* STATE 3: FINAL DEFENSIBILITY SCORECARD (0-100) */}
                {defendFinalReport && (
                  <div className="space-y-6 animate-in fade-in pt-2">
                    {/* Score Hero Banner */}
                    <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-950/40 via-indigo-950/20 to-[#0A0D26] border border-blue-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-xl">
                      <div className="flex items-center gap-5">
                        <div className="w-24 h-24 rounded-full bg-[#121636] border-4 border-blue-500/40 flex flex-col items-center justify-center text-center shrink-0 shadow-[0_0_25px_rgba(59,130,246,0.35)]">
                          <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-teal-300 to-emerald-400">
                            {defendFinalReport.overall_defensibility_score}
                          </span>
                          <span className="text-[9px] font-bold text-slate-400 uppercase">/ 100 DEFENSE</span>
                        </div>

                        <div className="space-y-1">
                          <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 inline-block">
                            {defendFinalReport.overall_defensibility_score >= 80
                              ? "Interview Solid (Top 10% Defensibility)"
                              : defendFinalReport.overall_defensibility_score >= 60
                              ? "Moderate Preparation Needed"
                              : "Needs Technical Preparation"}
                          </span>
                          <h3 className="text-xl font-bold text-white">
                            Defensibility Score: {defendFinalReport.overall_defensibility_score} / 100
                          </h3>
                          <p className="text-xs text-slate-300 max-w-md">
                            Evaluated across Understanding, Specificity, Technical Correctness, and Ownership.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* STRONG CLAIMS VS CLAIMS NEEDING PREP */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      {/* Strong Claims */}
                      <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-2.5">
                        <h4 className="font-extrabold text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          ✅ Strong Claims Defended ({defendFinalReport.strong_claims.length})
                        </h4>
                        {defendFinalReport.strong_claims.length > 0 ? (
                          <ul className="space-y-1.5">
                            {defendFinalReport.strong_claims.map((cl, idx) => (
                              <li key={idx} className="p-2 rounded-lg bg-emerald-500/20 text-emerald-200 border border-emerald-500/30 text-[11px]">
                                {cl}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-slate-400 italic">No claims categorized as fully defended yet.</p>
                        )}
                      </div>

                      {/* Claims Needing Prep */}
                      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2.5">
                        <h4 className="font-extrabold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                          <AlertTriangle className="w-4 h-4 text-amber-400" />
                          ⚠️ Claims Needing Preparation ({defendFinalReport.claims_needing_prep.length})
                        </h4>
                        {defendFinalReport.claims_needing_prep.length > 0 ? (
                          <ul className="space-y-1.5">
                            {defendFinalReport.claims_needing_prep.map((cl, idx) => (
                              <li key={idx} className="p-2 rounded-lg bg-amber-500/20 text-amber-200 border border-amber-500/30 text-[11px]">
                                {cl}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-emerald-300 font-medium">All analyzed claims defended solidly!</p>
                        )}
                      </div>
                    </div>

                    {/* DEFENCELESS CLAIMS IF ANY */}
                    {defendFinalReport.defenseless_claims.length > 0 && (
                      <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 space-y-2 text-xs">
                        <h4 className="font-extrabold text-red-300 uppercase tracking-wider flex items-center gap-1.5">
                          <X className="w-4 h-4 text-red-400" />
                          ❌ Defenseless Claims ({defendFinalReport.defenseless_claims.length})
                        </h4>
                        <ul className="space-y-1.5">
                          {defendFinalReport.defenseless_claims.map((cl, idx) => (
                            <li key={idx} className="p-2 rounded-lg bg-red-500/20 text-red-200 border border-red-500/30 text-[11px]">
                              {cl}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* SUGGESTED PREPARATION TOPICS */}
                    {defendFinalReport.suggested_prep_topics.length > 0 && (
                      <div className="p-5 rounded-2xl bg-[#111638] border border-blue-500/30 space-y-3 text-xs">
                        <h4 className="font-extrabold text-blue-300 uppercase tracking-wider flex items-center gap-1.5">
                          <BookOpen className="w-4 h-4 text-blue-400" />
                          💡 Suggested Technical Preparation Topics
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {defendFinalReport.suggested_prep_topics.map((tp, idx) => (
                            <div key={idx} className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-200 flex items-center gap-2">
                              <Sparkles className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                              <span>{tp}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* ACTION BUTTONS */}
                    <div className="flex items-center justify-end gap-3 pt-3">
                      <button
                        onClick={() => handleInitDefendSession()}
                        className="px-5 py-2.5 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/40 text-xs font-bold transition-all flex items-center gap-1.5"
                      >
                        <RotateCcw className="w-4 h-4" />
                        <span>Practice Session Again</span>
                      </button>

                      <button
                        onClick={() => setActiveModal(null)}
                        className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md transition-all"
                      >
                        Return to Command Center
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* FULL-SCREEN OVERLAY: REAL BACKEND ATS RESUME ANALYSIS (PHASE 2B) */}
      {activeView === "analysis" &&
        createPortal(
          <div className="fixed inset-0 top-0 left-0 right-0 bottom-0 z-[9999] bg-[#070814] text-slate-100 flex flex-col h-screen w-screen overflow-y-auto">
            <header className="sticky top-0 z-50 h-16 px-4 sm:px-8 border-b border-purple-900/40 bg-[#0B0D1E] flex items-center justify-between gap-4 shrink-0 shadow-lg">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setActiveView(null)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-bold transition-all"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Resume Hub</span>
                </button>
                <span className="text-xs font-bold text-white">{activeResume?.name || "Active Resume"}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-mono font-bold border border-purple-500/30">
                  REAL BACKEND ATS ANALYSIS
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => setActiveView("improve")}
                  className="px-4 py-1.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 shadow-md flex items-center gap-1.5 transition-all"
                >
                  <Wand2 className="w-3.5 h-3.5" />
                  <span>Improve with AI Studio →</span>
                </button>
                <button onClick={() => setActiveView(null)} className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </header>

            <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
              {isAtsLoading ? (
                <div className="flex flex-col items-center justify-center p-16 space-y-4 text-center">
                  <Loader2 className="w-10 h-10 text-purple-400 animate-spin" />
                  <p className="text-sm font-semibold text-purple-300">
                    Calculating ATS Compatibility Score & Category Breakdown from MongoDB...
                  </p>
                </div>
              ) : isAtsError || !atsAnalysisData ? (
                <div className="p-8 border border-red-500/20 bg-red-500/10 rounded-3xl text-center space-y-4">
                  <AlertTriangle className="w-10 h-10 text-red-400 mx-auto" />
                  <h3 className="text-base font-bold text-red-300">ATS Analysis Request Failed</h3>
                  <p className="text-xs text-slate-300 max-w-md mx-auto">
                    Unable to compute ATS analysis. Make sure a saved resume is active and retry.
                  </p>
                  <button
                    onClick={() => refetchAtsAnalysis()}
                    className="px-4 py-2 rounded-xl bg-red-500/20 text-red-200 text-xs font-bold hover:bg-red-500/30"
                  >
                    Retry Analysis
                  </button>
                </div>
              ) : (
                <>
                  {/* Score Hero */}
                  <div className="p-6 sm:p-8 rounded-3xl border border-purple-500/30 bg-gradient-to-br from-[#121532] via-[#0E1026] to-[#0A0B1A] shadow-2xl relative overflow-hidden">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                        <div className="relative w-28 h-28 rounded-full bg-[#15193B] border-4 border-purple-500/40 flex flex-col items-center justify-center text-center shrink-0 shadow-[0_0_35px_rgba(168,85,247,0.35)]">
                          <span className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-teal-300 to-emerald-400">
                            {atsAnalysisData.overall_score}
                          </span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">/ 100 ATS</span>
                        </div>

                        <div className="space-y-1.5">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                              {atsAnalysisData.overall_score >= 80
                                ? "Tier-1 Candidate Ready (Top 10%)"
                                : atsAnalysisData.overall_score >= 60
                                ? "Good Match (Requires Minor Fixes)"
                                : "Needs Optimization"}
                            </span>
                            <span className="text-xs text-slate-400">
                              Target: <strong>{activeResume?.target_role || "Software Engineer"}</strong>
                            </span>
                          </div>
                          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
                            ATS Score: {atsAnalysisData.overall_score} / 100
                          </h1>
                          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                            Calculated deterministically across 5 core categories based on your actual saved resume content.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 5 CATEGORY BREAKDOWN CARDS */}
                  <div className="space-y-4">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-purple-400" />
                      Transparent Category Breakdown (20 Pts Each)
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                      <div className="p-4 rounded-2xl bg-[#0D1026] border border-purple-500/20 space-y-2">
                        <div className="flex justify-between items-center text-xs font-bold text-purple-300">
                          <span>Keywords</span>
                          <span className="text-white font-mono">{atsAnalysisData.categories.keyword_optimization} / 20</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                          <div className="h-full bg-purple-500 rounded-full" style={{ width: `${(atsAnalysisData.categories.keyword_optimization / 20) * 100}%` }} />
                        </div>
                      </div>

                      <div className="p-4 rounded-2xl bg-[#0D1026] border border-teal-500/20 space-y-2">
                        <div className="flex justify-between items-center text-xs font-bold text-teal-300">
                          <span>Completeness</span>
                          <span className="text-white font-mono">{atsAnalysisData.categories.section_completeness} / 20</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                          <div className="h-full bg-teal-500 rounded-full" style={{ width: `${(atsAnalysisData.categories.section_completeness / 20) * 100}%` }} />
                        </div>
                      </div>

                      <div className="p-4 rounded-2xl bg-[#0D1026] border border-emerald-500/20 space-y-2">
                        <div className="flex justify-between items-center text-xs font-bold text-emerald-300">
                          <span>Skills Align</span>
                          <span className="text-white font-mono">{atsAnalysisData.categories.skills_alignment} / 20</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                          <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(atsAnalysisData.categories.skills_alignment / 20) * 100}%` }} />
                        </div>
                      </div>

                      <div className="p-4 rounded-2xl bg-[#0D1026] border border-blue-500/20 space-y-2">
                        <div className="flex justify-between items-center text-xs font-bold text-blue-300">
                          <span>Exp Quality</span>
                          <span className="text-white font-mono">{atsAnalysisData.categories.experience_quality} / 20</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                          <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(atsAnalysisData.categories.experience_quality / 20) * 100}%` }} />
                        </div>
                      </div>

                      <div className="p-4 rounded-2xl bg-[#0D1026] border border-pink-500/20 space-y-2">
                        <div className="flex justify-between items-center text-xs font-bold text-pink-300">
                          <span>Formatting</span>
                          <span className="text-white font-mono">{atsAnalysisData.categories.formatting} / 20</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                          <div className="h-full bg-pink-500 rounded-full" style={{ width: `${(atsAnalysisData.categories.formatting / 20) * 100}%` }} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* STRENGTHS */}
                  {atsAnalysisData.strengths.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="text-sm font-bold text-emerald-400 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" />
                        Positive Resume Strengths Detected
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                        {atsAnalysisData.strengths.map((str, idx) => (
                          <div key={idx} className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-200 flex items-center gap-2">
                            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                            <span>{str}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* ACTIONABLE RECOMMENDATIONS WITH FIX IN RESUME BUTTON */}
                  {atsAnalysisData.recommendations.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="text-sm font-bold text-teal-300 flex items-center gap-2">
                        <Wand2 className="w-4 h-4 text-teal-400" />
                        Actionable Recommendations
                      </h3>
                      <div className="space-y-3">
                        {atsAnalysisData.recommendations.map((rec) => (
                          <div
                            key={rec.id}
                            className="p-4 rounded-2xl bg-[#0D1026] border border-teal-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
                          >
                            <div className="space-y-1 min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <span
                                  className={cn(
                                    "text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase",
                                    rec.severity === "high"
                                      ? "bg-red-500/20 text-red-300 border-red-500/30"
                                      : rec.severity === "medium"
                                      ? "bg-amber-500/20 text-amber-300 border-amber-500/30"
                                      : "bg-blue-500/20 text-blue-300 border-blue-500/30"
                                  )}
                                >
                                  {rec.severity} priority
                                </span>
                                <h4 className="font-bold text-white">{rec.title}</h4>
                              </div>
                              <p className="text-slate-300 leading-relaxed">{rec.description}</p>
                            </div>

                            <button
                              onClick={() => handleFixInResume(rec.section)}
                              className="px-4 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-white font-bold text-xs shrink-0 flex items-center justify-center gap-1.5 shadow-md"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>Fix in Resume</span>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>,
          document.body
        )}

      {/* FULL-SCREEN OVERLAY: AI BUILDER & AI IMPROVE STUDIO (PHASE 2A) */}
      {activeView === "improve" &&
        createPortal(
          <div className="fixed inset-0 top-0 left-0 right-0 bottom-0 z-[9999] bg-[#050714] text-slate-100 flex flex-col h-screen w-screen overflow-hidden">
            <header className="sticky top-0 z-50 h-16 px-4 sm:px-8 border-b border-teal-900/40 bg-[#0A0D21] flex items-center justify-between gap-4 shrink-0 shadow-lg">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setActiveView(null)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-bold transition-all"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Resume Hub</span>
                </button>

                <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-teal-500/20">
                  <span className="text-xs font-bold text-white">{activeResume?.name || "Active Builder"}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 font-mono font-bold border border-teal-500/30">
                    RESUME BUILDER
                  </span>
                </div>
              </div>

              {/* Save Status Indicator */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-xs font-semibold">
                  {saveStatus === "saving" ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                      <span className="text-amber-300">Autosaving...</span>
                    </>
                  ) : saveStatus === "unsaved" ? (
                    <>
                      <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                      <span className="text-amber-300">Unsaved changes</span>
                    </>
                  ) : saveStatus === "error" ? (
                    <>
                      <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                      <span className="text-red-300">Unable to save</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-300">All changes saved</span>
                    </>
                  )}
                </div>

                <button
                  onClick={handleDownloadUpdatedPDF}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-md flex items-center gap-1.5 transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export PDF</span>
                </button>

                <button onClick={() => setActiveView(null)} className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </header>

            {/* Studio Workspace Split */}
            <div className="flex-1 flex flex-col lg:flex-row min-h-0 overflow-hidden">
              {/* Left Resume Editable Form & AI Improve Panel (55%) */}
              <section className="flex-1 overflow-y-auto p-4 sm:p-8 bg-[#070916] space-y-6">
                <div className="max-w-4xl mx-auto rounded-3xl border border-teal-500/25 bg-[#0D1024] p-6 sm:p-10 shadow-2xl space-y-8 font-sans">
                  {/* Title & Target Role Bar */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-[#111630] border border-teal-500/20">
                    <div>
                      <label className="text-[10px] font-bold text-teal-300 uppercase">Resume Name</label>
                      <input
                        type="text"
                        value={activeResume?.name || ""}
                        onChange={(e) => activeResume && triggerAutosave({ ...activeResume, name: e.target.value })}
                        className="w-full bg-[#080B1B] border border-slate-700 focus:border-teal-400 rounded-lg p-2 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-teal-300 uppercase">Target Role</label>
                      <input
                        type="text"
                        value={activeResume?.target_role || ""}
                        onChange={(e) => activeResume && triggerAutosave({ ...activeResume, target_role: e.target.value })}
                        className="w-full bg-[#080B1B] border border-slate-700 focus:border-teal-400 rounded-lg p-2 text-xs text-white"
                      />
                    </div>
                  </div>

                  {/* Header Personal Info */}
                  <div className="border-b border-slate-700/60 pb-6 space-y-3">
                    <h3 className="text-xs font-extrabold uppercase tracking-widest text-teal-300 flex items-center gap-2">
                      <FileText className="w-3.5 h-3.5 text-teal-400" /> Personal Information
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="text-[10px] text-slate-400">Full Name</label>
                        <input
                          type="text"
                          value={personalInfo.full_name}
                          onChange={(e) => updatePersonalInfoField("full_name", e.target.value)}
                          className="w-full p-2.5 rounded-lg bg-[#080B1B] border border-slate-700 text-xs text-white focus:border-teal-400"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-400">Email Address</label>
                        <input
                          type="email"
                          value={personalInfo.email}
                          onChange={(e) => updatePersonalInfoField("email", e.target.value)}
                          className="w-full p-2.5 rounded-lg bg-[#080B1B] border border-slate-700 text-xs text-white focus:border-teal-400"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-400">Phone</label>
                        <input
                          type="text"
                          value={personalInfo.phone}
                          onChange={(e) => updatePersonalInfoField("phone", e.target.value)}
                          className="w-full p-2.5 rounded-lg bg-[#080B1B] border border-slate-700 text-xs text-white focus:border-teal-400"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-400">Location</label>
                        <input
                          type="text"
                          value={personalInfo.location}
                          onChange={(e) => updatePersonalInfoField("location", e.target.value)}
                          className="w-full p-2.5 rounded-lg bg-[#080B1B] border border-slate-700 text-xs text-white focus:border-teal-400"
                        />
                      </div>
                    </div>
                  </div>

                  {/* AI Improve Section Selector Bar */}
                  <div className="p-4 rounded-2xl bg-[#111630] border border-teal-500/20 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-teal-300 uppercase tracking-wider flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-teal-400" /> Improve with AI Section Selector
                      </span>
                      <span className="text-[10px] text-slate-400">Select a section to optimize with AI</span>
                    </div>
                    <div className="flex flex-wrap gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => handleRequestImprovement("summary", activeResume?.summary || "")}
                        disabled={aiSession?.isLoading}
                        className={cn(
                          "px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border",
                          aiSession?.section === "summary"
                            ? "bg-teal-500/30 text-teal-200 border-teal-400"
                            : "bg-[#080B1B] text-slate-300 border-slate-700 hover:border-teal-500/40"
                        )}
                      >
                        <BookOpen className="w-3.5 h-3.5 text-teal-400" />
                        <span>Professional Summary</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          const skillsText = activeResume?.skills && activeResume.skills.length > 0
                            ? activeResume.skills.map((s) => `${s.category}: ${s.skills.join(", ")}`).join("\n")
                            : "Languages: Python, TypeScript\nFrameworks: React, FastAPI";
                          handleRequestImprovement("skills", skillsText);
                        }}
                        disabled={aiSession?.isLoading}
                        className={cn(
                          "px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border",
                          aiSession?.section === "skills" || aiSession?.section === "technical_skills"
                            ? "bg-teal-500/30 text-teal-200 border-teal-400"
                            : "bg-[#080B1B] text-slate-300 border-slate-700 hover:border-teal-500/40"
                        )}
                      >
                        <Cpu className="w-3.5 h-3.5 text-teal-400" />
                        <span>Technical Skills</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          const expText = activeResume?.experience?.map((e) => `${e.role} at ${e.company}: ${e.description}`).join("\n") || "";
                          handleRequestImprovement("experience_bullet", expText || "Software Engineer at Tech Corp: Built scalable services.");
                        }}
                        disabled={aiSession?.isLoading}
                        className={cn(
                          "px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border",
                          aiSession?.section === "experience_bullet"
                            ? "bg-teal-500/30 text-teal-200 border-teal-400"
                            : "bg-[#080B1B] text-slate-300 border-slate-700 hover:border-teal-500/40"
                        )}
                      >
                        <Briefcase className="w-[#3.5px] h-3.5 text-teal-400" />
                        <span>Work Experience</span>
                      </button>
                    </div>
                  </div>

                  {/* Summary Section with Real AI Improve Integration */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-extrabold uppercase tracking-widest text-teal-300 flex items-center gap-2">
                        <BookOpen className="w-3.5 h-3.5 text-teal-400" />
                        Professional Summary
                      </h3>

                      <button
                        type="button"
                        onClick={() => handleRequestImprovement("summary", activeResume?.summary || "")}
                        disabled={aiSession?.isLoading}
                        className="px-3 py-1 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md disabled:opacity-50"
                      >
                        {aiSession?.isLoading && aiSession.section === "summary" ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Wand2 className="w-3.5 h-3.5" />
                        )}
                        <span>Improve Summary with AI</span>
                      </button>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#111630] border border-teal-500/20 space-y-3 text-xs">
                      <textarea
                        value={activeResume?.summary || ""}
                        onChange={(e) => updateSummaryField(e.target.value)}
                        placeholder="Write your professional summary here..."
                        rows={3}
                        className="w-full p-3 rounded-xl bg-[#0B0E22] border border-teal-500/30 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-400 transition-colors leading-relaxed"
                      />
                    </div>

                    {/* AI COMPARISON BOARD */}
                    {aiSession && aiSession.section === "summary" && (
                      <div className="p-5 rounded-2xl bg-[#0B0E24] border-2 border-teal-500/40 space-y-4 animate-in fade-in">
                        {aiSession.isLoading ? (
                          <div className="flex items-center justify-center p-6 gap-3">
                            <Loader2 className="w-5 h-5 text-teal-400 animate-spin" />
                            <span className="text-xs font-semibold text-teal-300">
                              Analyzing phrasing & generating factual-safe optimization...
                            </span>
                          </div>
                        ) : (
                          <>
                            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                              <span className="text-xs font-bold text-teal-300 flex items-center gap-1.5">
                                <Sparkles className="w-4 h-4 text-emerald-400" />
                                AI Improvement Suggestion (Factual Safety Verified)
                              </span>
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                                Real Backend AI Response
                              </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                              <div className="p-3 rounded-xl bg-[#070918] border border-slate-700/80 space-y-1.5">
                                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                                  BEFORE (Original)
                                </span>
                                <p className="text-slate-300 leading-relaxed">{aiSession.originalText}</p>
                              </div>

                              <div className="p-3 rounded-xl bg-teal-500/10 border border-teal-500/40 space-y-1.5">
                                <span className="text-[10px] font-extrabold uppercase tracking-wider text-teal-300 flex items-center gap-1">
                                  AFTER (AI Improved)
                                </span>
                                <p className="text-teal-100 font-medium leading-relaxed">{aiSession.improvedText}</p>
                              </div>
                            </div>

                            <div className="space-y-2 text-[11px] pt-1">
                              <p className="text-slate-300">
                                <strong className="text-teal-300">Explanation:</strong> {aiSession.explanation}
                              </p>
                              {aiSession.detectedChanges.length > 0 && (
                                <div className="flex flex-wrap items-center gap-1.5">
                                  <span className="text-slate-400 text-[10px] font-bold">Detected Improvements:</span>
                                  {aiSession.detectedChanges.map((change, idx) => (
                                    <span key={idx} className="px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-200 border border-teal-500/30 text-[10px]">
                                      ✓ {change}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>

                            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-800">
                              <button
                                onClick={handleRejectAIImprovement}
                                className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all flex items-center gap-1"
                              >
                                <X className="w-3.5 h-3.5" />
                                <span>Reject</span>
                              </button>

                              <button
                                onClick={handleTryAgainAIImprovement}
                                className="px-3.5 py-1.5 rounded-xl bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 border border-teal-500/40 text-xs font-bold transition-all flex items-center gap-1"
                              >
                                <RefreshCw className="w-3.5 h-3.5" />
                                <span>Try Again</span>
                              </button>

                              <button
                                onClick={handleAcceptAIImprovement}
                                className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md transition-all flex items-center gap-1"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>Accept Improvement</span>
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Technical Skills Section Editor */}
                  <div className="space-y-3 pt-4 border-t border-slate-700/60">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-extrabold uppercase tracking-widest text-teal-300 flex items-center gap-2">
                        <Cpu className="w-3.5 h-3.5 text-teal-400" />
                        TECHNICAL SKILLS ({activeResume?.skills?.length || 0})
                      </h3>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            const skillsText = activeResume?.skills && activeResume.skills.length > 0
                              ? activeResume.skills.map((s) => `${s.category}: ${s.skills.join(", ")}`).join("\n")
                              : "Languages: Python, TypeScript, Java\nFrameworks: React, FastAPI, Node.js\nDatabases: MongoDB, PostgreSQL";
                            handleRequestImprovement("skills", skillsText);
                          }}
                          disabled={aiSession?.isLoading}
                          className="px-3 py-1 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md disabled:opacity-50"
                        >
                          {aiSession?.isLoading && (aiSession.section === "skills" || aiSession.section === "technical_skills") ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Wand2 className="w-3.5 h-3.5" />
                          )}
                          <span>Improve Skills with AI</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            if (!activeResume) return;
                            const currentSkills = activeResume.skills || [];
                            const newCategory: SkillCategory = {
                              id: `skill-${Date.now()}`,
                              category: "Languages",
                              skills: ["Python", "JavaScript"],
                            };
                            triggerAutosave({ ...activeResume, skills: [...currentSkills, newCategory] });
                          }}
                          className="px-3 py-1 rounded-xl bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 text-xs font-bold border border-teal-500/30 flex items-center gap-1"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add Category</span>
                        </button>
                      </div>
                    </div>

                    {activeResume?.skills && activeResume.skills.length > 0 ? (
                      <div className="space-y-3 text-xs">
                        {activeResume.skills.map((skillCat, idx) => (
                          <div key={skillCat.id || idx} className="p-4 rounded-2xl bg-[#111630] border border-teal-500/20 space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="font-bold text-white text-xs">{skillCat.category || "Category"}</span>
                              <button
                                type="button"
                                onClick={() => {
                                  if (!activeResume) return;
                                  const updated = activeResume.skills.filter((_, i) => i !== idx);
                                  triggerAutosave({ ...activeResume, skills: updated });
                                }}
                                className="text-red-400 hover:text-red-300 p-1"
                                title="Delete Skill Category"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                              <input
                                type="text"
                                value={skillCat.category}
                                onChange={(e) => {
                                  if (!activeResume) return;
                                  const updatedSkills = [...activeResume.skills];
                                  updatedSkills[idx] = { ...skillCat, category: e.target.value };
                                  triggerAutosave({ ...activeResume, skills: updatedSkills });
                                }}
                                placeholder="Category (e.g. Languages)"
                                className="p-2 rounded-lg bg-[#080B1B] border border-slate-700 text-xs text-white"
                              />
                              <input
                                type="text"
                                value={skillCat.skills.join(", ")}
                                onChange={(e) => {
                                  if (!activeResume) return;
                                  const updatedSkills = [...activeResume.skills];
                                  const skillList = e.target.value.split(",").map((s) => s.trim());
                                  updatedSkills[idx] = { ...skillCat, skills: skillList };
                                  triggerAutosave({ ...activeResume, skills: updatedSkills });
                                }}
                                placeholder="Comma-separated skills (e.g. Python, TypeScript)"
                                className="sm:col-span-2 p-2 rounded-lg bg-[#080B1B] border border-slate-700 text-xs text-white"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-slate-400 text-xs italic p-3 bg-[#111630] rounded-xl">
                        No technical skill categories added yet. Click "+ Add Category" to add skills.
                      </p>
                    )}

                    {/* AI COMPARISON BOARD FOR TECHNICAL SKILLS */}
                    {aiSession && (aiSession.section === "skills" || aiSession.section === "technical_skills") && (
                      <div className="p-5 rounded-2xl bg-[#0B0E24] border-2 border-teal-500/40 space-y-4 animate-in fade-in">
                        {aiSession.isLoading ? (
                          <div className="flex items-center justify-center p-6 gap-3">
                            <Loader2 className="w-5 h-5 text-teal-400 animate-spin" />
                            <span className="text-xs font-semibold text-teal-300">
                              Analyzing skills organization & generating factual-safe optimization...
                            </span>
                          </div>
                        ) : (
                          <>
                            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                              <span className="text-xs font-bold text-teal-300 flex items-center gap-1.5">
                                <Sparkles className="w-4 h-4 text-emerald-400" />
                                AI Improvement Suggestion (Factual Safety Verified)
                              </span>
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                                Real Backend AI Response
                              </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                              <div className="p-3 rounded-xl bg-[#070918] border border-slate-700/80 space-y-1.5">
                                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                                  BEFORE (Original)
                                </span>
                                <p className="text-slate-300 leading-relaxed whitespace-pre-line">{aiSession.originalText}</p>
                              </div>

                              <div className="p-3 rounded-xl bg-teal-500/10 border border-teal-500/40 space-y-1.5">
                                <span className="text-[10px] font-extrabold uppercase tracking-wider text-teal-300 flex items-center gap-1">
                                  AFTER (AI Improved)
                                </span>
                                <p className="text-teal-100 font-medium leading-relaxed whitespace-pre-line">{aiSession.improvedText}</p>
                              </div>
                            </div>

                            <div className="space-y-2 text-[11px] pt-1">
                              <p className="text-slate-300">
                                <strong className="text-teal-300">Explanation:</strong> {aiSession.explanation}
                              </p>
                              {aiSession.detectedChanges.length > 0 && (
                                <div className="flex flex-wrap items-center gap-1.5">
                                  <span className="text-slate-400 text-[10px] font-bold">Detected Improvements:</span>
                                  {aiSession.detectedChanges.map((change, idx) => (
                                    <span key={idx} className="px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-200 border border-teal-500/30 text-[10px]">
                                      ✓ {change}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>

                            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-800">
                              <button
                                onClick={handleRejectAIImprovement}
                                className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all flex items-center gap-1"
                              >
                                <X className="w-3.5 h-3.5" />
                                <span>Reject</span>
                              </button>

                              <button
                                onClick={handleTryAgainAIImprovement}
                                className="px-3.5 py-1.5 rounded-xl bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 border border-teal-500/40 text-xs font-bold transition-all flex items-center gap-1"
                              >
                                <RefreshCw className="w-3.5 h-3.5" />
                                <span>Try Again</span>
                              </button>

                              <button
                                onClick={handleAcceptAIImprovement}
                                className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md transition-all flex items-center gap-1"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>Accept Improvement</span>
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Work Experience Section Editor */}
                  <div className="space-y-3 pt-4 border-t border-slate-700/60">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-extrabold uppercase tracking-widest text-teal-300 flex items-center gap-2">
                        <Briefcase className="w-3.5 h-3.5 text-teal-400" />
                        Work Experience ({activeResume?.experience?.length || 0})
                      </h3>
                      <button
                        type="button"
                        onClick={() => {
                          if (!activeResume) return;
                          const newExp = [
                            ...(activeResume.experience || []),
                            {
                              id: `exp-${Date.now()}`,
                              company: "Company Name",
                              role: "Software Engineer",
                              location: "",
                              start_date: "2023",
                              end_date: "Present",
                              current: true,
                              description: "Key responsibilities and achievements",
                              bullets: [],
                            },
                          ];
                          triggerAutosave({ ...activeResume, experience: newExp });
                        }}
                        className="px-3 py-1 rounded-xl bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 text-xs font-bold border border-teal-500/30 flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Experience</span>
                      </button>
                    </div>

                    {activeResume?.experience && activeResume.experience.length > 0 ? (
                      <div className="space-y-3 text-xs">
                        {activeResume.experience.map((exp, idx) => (
                          <div key={exp.id || idx} className="p-4 rounded-2xl bg-[#111630] border border-teal-500/20 space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="font-bold text-white text-xs">{exp.role || "Role"} {exp.company && `@ ${exp.company}`}</span>
                              <button
                                type="button"
                                onClick={() => {
                                  if (!activeResume) return;
                                  const updated = activeResume.experience.filter((_, i) => i !== idx);
                                  triggerAutosave({ ...activeResume, experience: updated });
                                }}
                                className="text-red-400 hover:text-red-300 p-1"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              <input
                                type="text"
                                value={exp.role}
                                onChange={(e) => {
                                  if (!activeResume) return;
                                  const updatedExp = [...activeResume.experience];
                                  updatedExp[idx] = { ...exp, role: e.target.value };
                                  triggerAutosave({ ...activeResume, experience: updatedExp });
                                }}
                                placeholder="Job Role"
                                className="p-2 rounded-lg bg-[#080B1B] border border-slate-700 text-xs text-white"
                              />
                              <input
                                type="text"
                                value={exp.company}
                                onChange={(e) => {
                                  if (!activeResume) return;
                                  const updatedExp = [...activeResume.experience];
                                  updatedExp[idx] = { ...exp, company: e.target.value };
                                  triggerAutosave({ ...activeResume, experience: updatedExp });
                                }}
                                placeholder="Company Name"
                                className="p-2 rounded-lg bg-[#080B1B] border border-slate-700 text-xs text-white"
                              />
                            </div>
                            <textarea
                              rows={2}
                              value={exp.description}
                              onChange={(e) => {
                                if (!activeResume) return;
                                const updatedExp = [...activeResume.experience];
                                updatedExp[idx] = { ...exp, description: e.target.value };
                                triggerAutosave({ ...activeResume, experience: updatedExp });
                              }}
                              placeholder="Description / Responsibilities"
                              className="w-full p-2 rounded-lg bg-[#080B1B] border border-slate-700 text-xs text-white"
                            />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-slate-400 text-xs italic p-3 bg-[#111630] rounded-xl">No work experience entries added.</p>
                    )}
                  </div>

                  {/* Projects Section Editor */}
                  <div className="space-y-3 pt-4 border-t border-slate-700/60">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-extrabold uppercase tracking-widest text-teal-300 flex items-center gap-2">
                        <Code2 className="w-3.5 h-3.5 text-teal-400" />
                        Projects ({activeResume?.projects?.length || 0})
                      </h3>
                      <button
                        type="button"
                        onClick={() => {
                          if (!activeResume) return;
                          const newProj = [
                            ...(activeResume.projects || []),
                            {
                              id: `proj-${Date.now()}`,
                              name: "New Project",
                              description: "Project description and features",
                              technologies: ["React", "Node.js"],
                              github_url: "",
                              live_url: "",
                              bullets: [],
                            },
                          ];
                          triggerAutosave({ ...activeResume, projects: newProj });
                        }}
                        className="px-3 py-1 rounded-xl bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 text-xs font-bold border border-teal-500/30 flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Project</span>
                      </button>
                    </div>

                    {activeResume?.projects && activeResume.projects.length > 0 ? (
                      <div className="space-y-3 text-xs">
                        {activeResume.projects.map((proj, idx) => (
                          <div key={proj.id || idx} className="p-4 rounded-2xl bg-[#111630] border border-teal-500/20 space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="font-bold text-white text-xs">{proj.name || "Project"}</span>
                              <button
                                type="button"
                                onClick={() => {
                                  if (!activeResume) return;
                                  const updated = activeResume.projects.filter((_, i) => i !== idx);
                                  triggerAutosave({ ...activeResume, projects: updated });
                                }}
                                className="text-red-400 hover:text-red-300 p-1"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <input
                              type="text"
                              value={proj.name}
                              onChange={(e) => {
                                if (!activeResume) return;
                                const updatedProj = [...activeResume.projects];
                                updatedProj[idx] = { ...proj, name: e.target.value };
                                triggerAutosave({ ...activeResume, projects: updatedProj });
                              }}
                              placeholder="Project Name"
                              className="w-full p-2 rounded-lg bg-[#080B1B] border border-slate-700 text-xs text-white"
                            />
                            <textarea
                              rows={2}
                              value={proj.description}
                              onChange={(e) => {
                                if (!activeResume) return;
                                const updatedProj = [...activeResume.projects];
                                updatedProj[idx] = { ...proj, description: e.target.value };
                                triggerAutosave({ ...activeResume, projects: updatedProj });
                              }}
                              placeholder="Project details & overview"
                              className="w-full p-2 rounded-lg bg-[#080B1B] border border-slate-700 text-xs text-white"
                            />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-slate-400 text-xs italic p-3 bg-[#111630] rounded-xl">No projects added.</p>
                    )}
                  </div>

                  {/* Education Section Editor */}
                  <div className="space-y-3 pt-4 border-t border-slate-700/60">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-extrabold uppercase tracking-widest text-teal-300 flex items-center gap-2">
                        <GraduationCap className="w-3.5 h-3.5 text-teal-400" />
                        Education ({activeResume?.education?.length || 0})
                      </h3>
                      <button
                        type="button"
                        onClick={() => {
                          if (!activeResume) return;
                          const newEdu = [
                            ...(activeResume.education || []),
                            {
                              id: `edu-${Date.now()}`,
                              institution: "University Name",
                              degree: "Bachelor of Technology",
                              field_of_study: "Computer Science",
                              start_date: "2021",
                              end_date: "2025",
                              current: false,
                              gpa: "8.5 CGPA",
                              description: "",
                            },
                          ];
                          triggerAutosave({ ...activeResume, education: newEdu });
                        }}
                        className="px-3 py-1 rounded-xl bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 text-xs font-bold border border-teal-500/30 flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Education</span>
                      </button>
                    </div>

                    {activeResume?.education && activeResume.education.length > 0 ? (
                      <div className="space-y-3 text-xs">
                        {activeResume.education.map((edu, idx) => (
                          <div key={edu.id || idx} className="p-4 rounded-2xl bg-[#111630] border border-teal-500/20 space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="font-bold text-white text-xs">{edu.institution || "Institution"}</span>
                              <button
                                type="button"
                                onClick={() => {
                                  if (!activeResume) return;
                                  const updated = activeResume.education.filter((_, i) => i !== idx);
                                  triggerAutosave({ ...activeResume, education: updated });
                                }}
                                className="text-red-400 hover:text-red-300 p-1"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              <input
                                type="text"
                                value={edu.institution}
                                onChange={(e) => {
                                  if (!activeResume) return;
                                  const updatedEdu = [...activeResume.education];
                                  updatedEdu[idx] = { ...edu, institution: e.target.value };
                                  triggerAutosave({ ...activeResume, education: updatedEdu });
                                }}
                                placeholder="Institution Name"
                                className="p-2 rounded-lg bg-[#080B1B] border border-slate-700 text-xs text-white"
                              />
                              <input
                                type="text"
                                value={edu.degree}
                                onChange={(e) => {
                                  if (!activeResume) return;
                                  const updatedEdu = [...activeResume.education];
                                  updatedEdu[idx] = { ...edu, degree: e.target.value };
                                  triggerAutosave({ ...activeResume, education: updatedEdu });
                                }}
                                placeholder="Degree"
                                className="p-2 rounded-lg bg-[#080B1B] border border-slate-700 text-xs text-white"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-slate-400 text-xs italic p-3 bg-[#111630] rounded-xl">No education entries added.</p>
                    )}
                  </div>

                  {/* Certifications Section Editor */}
                  <div className="space-y-3 pt-4 border-t border-slate-700/60">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-extrabold uppercase tracking-widest text-teal-300 flex items-center gap-2">
                        <Award className="w-3.5 h-3.5 text-teal-400" />
                        Certifications ({activeResume?.certifications?.length || 0})
                      </h3>
                      <button
                        type="button"
                        onClick={() => {
                          if (!activeResume) return;
                          const newCerts = [
                            ...(activeResume.certifications || []),
                            {
                              id: `cert-${Date.now()}`,
                              name: "AWS Certified Solutions Architect",
                              issuer: "Amazon Web Services",
                              date: "2024",
                              credential_id: "",
                              url: "",
                            },
                          ];
                          triggerAutosave({ ...activeResume, certifications: newCerts });
                        }}
                        className="px-3 py-1 rounded-xl bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 text-xs font-bold border border-teal-500/30 flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Certification</span>
                      </button>
                    </div>

                    {activeResume?.certifications && activeResume.certifications.length > 0 ? (
                      <div className="space-y-3 text-xs">
                        {activeResume.certifications.map((cert, idx) => (
                          <div key={cert.id || idx} className="p-4 rounded-2xl bg-[#111630] border border-teal-500/20 space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="font-bold text-white text-xs">{cert.name || "Certification"}</span>
                              <button
                                type="button"
                                onClick={() => {
                                  if (!activeResume) return;
                                  const updated = activeResume.certifications.filter((_, i) => i !== idx);
                                  triggerAutosave({ ...activeResume, certifications: updated });
                                }}
                                className="text-red-400 hover:text-red-300 p-1"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              <input
                                type="text"
                                value={cert.name}
                                onChange={(e) => {
                                  if (!activeResume) return;
                                  const updated = [...activeResume.certifications];
                                  updated[idx] = { ...cert, name: e.target.value };
                                  triggerAutosave({ ...activeResume, certifications: updated });
                                }}
                                placeholder="Certification Name"
                                className="p-2 rounded-lg bg-[#080B1B] border border-slate-700 text-xs text-white"
                              />
                              <input
                                type="text"
                                value={cert.issuer}
                                onChange={(e) => {
                                  if (!activeResume) return;
                                  const updated = [...activeResume.certifications];
                                  updated[idx] = { ...cert, issuer: e.target.value };
                                  triggerAutosave({ ...activeResume, certifications: updated });
                                }}
                                placeholder="Issuing Organization"
                                className="p-2 rounded-lg bg-[#080B1B] border border-slate-700 text-xs text-white"
                              />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                              <input
                                type="text"
                                value={cert.date}
                                onChange={(e) => {
                                  if (!activeResume) return;
                                  const updated = [...activeResume.certifications];
                                  updated[idx] = { ...cert, date: e.target.value };
                                  triggerAutosave({ ...activeResume, certifications: updated });
                                }}
                                placeholder="Issue Date / Year"
                                className="p-2 rounded-lg bg-[#080B1B] border border-slate-700 text-xs text-white"
                              />
                              <input
                                type="text"
                                value={cert.credential_id || ""}
                                onChange={(e) => {
                                  if (!activeResume) return;
                                  const updated = [...activeResume.certifications];
                                  updated[idx] = { ...cert, credential_id: e.target.value };
                                  triggerAutosave({ ...activeResume, certifications: updated });
                                }}
                                placeholder="Credential ID (Optional)"
                                className="p-2 rounded-lg bg-[#080B1B] border border-slate-700 text-xs text-white"
                              />
                              <input
                                type="text"
                                value={cert.url}
                                onChange={(e) => {
                                  if (!activeResume) return;
                                  const updated = [...activeResume.certifications];
                                  updated[idx] = { ...cert, url: e.target.value };
                                  triggerAutosave({ ...activeResume, certifications: updated });
                                }}
                                placeholder="Credential URL (Optional)"
                                className="p-2 rounded-lg bg-[#080B1B] border border-slate-700 text-xs text-white"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-slate-400 text-xs italic p-3 bg-[#111630] rounded-xl">No certifications added.</p>
                    )}
                  </div>

                  {/* Competitions / Achievements Section Editor */}
                  <div className="space-y-3 pt-4 border-t border-slate-700/60">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-extrabold uppercase tracking-widest text-teal-300 flex items-center gap-2">
                        <Flame className="w-3.5 h-3.5 text-teal-400" />
                        Competitions / Achievements ({activeResume?.achievements?.length || 0})
                      </h3>
                      <button
                        type="button"
                        onClick={() => {
                          if (!activeResume) return;
                          const newAch = [
                            ...(activeResume.achievements || []),
                            {
                              id: `ach-${Date.now()}`,
                              title: "National Hackathon 2024",
                              organization: "IEEE / Major League Hacking",
                              result: "1st Place Winner",
                              date: "2024",
                              description: "Built an AI-powered smart application under 24 hours.",
                            },
                          ];
                          triggerAutosave({ ...activeResume, achievements: newAch });
                        }}
                        className="px-3 py-1 rounded-xl bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 text-xs font-bold border border-teal-500/30 flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Competition</span>
                      </button>
                    </div>

                    {activeResume?.achievements && activeResume.achievements.length > 0 ? (
                      <div className="space-y-3 text-xs">
                        {activeResume.achievements.map((ach, idx) => (
                          <div key={ach.id || idx} className="p-4 rounded-2xl bg-[#111630] border border-teal-500/20 space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="font-bold text-white text-xs">{ach.title || "Competition / Event"}</span>
                              <button
                                type="button"
                                onClick={() => {
                                  if (!activeResume) return;
                                  const updated = activeResume.achievements.filter((_, i) => i !== idx);
                                  triggerAutosave({ ...activeResume, achievements: updated });
                                }}
                                className="text-red-400 hover:text-red-300 p-1"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                              <input
                                type="text"
                                value={ach.title}
                                onChange={(e) => {
                                  if (!activeResume) return;
                                  const updated = [...activeResume.achievements];
                                  updated[idx] = { ...ach, title: e.target.value };
                                  triggerAutosave({ ...activeResume, achievements: updated });
                                }}
                                placeholder="Competition / Event Name"
                                className="p-2 rounded-lg bg-[#080B1B] border border-slate-700 text-xs text-white"
                              />
                              <input
                                type="text"
                                value={ach.organization || ""}
                                onChange={(e) => {
                                  if (!activeResume) return;
                                  const updated = [...activeResume.achievements];
                                  updated[idx] = { ...ach, organization: e.target.value };
                                  triggerAutosave({ ...activeResume, achievements: updated });
                                }}
                                placeholder="Organization / Host"
                                className="p-2 rounded-lg bg-[#080B1B] border border-slate-700 text-xs text-white"
                              />
                              <input
                                type="text"
                                value={ach.result || ""}
                                onChange={(e) => {
                                  if (!activeResume) return;
                                  const updated = [...activeResume.achievements];
                                  updated[idx] = { ...ach, result: e.target.value };
                                  triggerAutosave({ ...activeResume, achievements: updated });
                                }}
                                placeholder="Result / Position (e.g. Winner)"
                                className="p-2 rounded-lg bg-[#080B1B] border border-slate-700 text-xs text-white"
                              />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                              <input
                                type="text"
                                value={ach.date}
                                onChange={(e) => {
                                  if (!activeResume) return;
                                  const updated = [...activeResume.achievements];
                                  updated[idx] = { ...ach, date: e.target.value };
                                  triggerAutosave({ ...activeResume, achievements: updated });
                                }}
                                placeholder="Year / Date"
                                className="p-2 rounded-lg bg-[#080B1B] border border-slate-700 text-xs text-white"
                              />
                              <textarea
                                rows={2}
                                value={ach.description}
                                onChange={(e) => {
                                  if (!activeResume) return;
                                  const updated = [...activeResume.achievements];
                                  updated[idx] = { ...ach, description: e.target.value };
                                  triggerAutosave({ ...activeResume, achievements: updated });
                                }}
                                placeholder="Description / Details"
                                className="sm:col-span-2 p-2 rounded-lg bg-[#080B1B] border border-slate-700 text-xs text-white"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-slate-400 text-xs italic p-3 bg-[#111630] rounded-xl">No competitions or achievements added.</p>
                    )}
                  </div>
                </div>
              </section>

              {/* Right Live Preview Canvas (45%) */}
              <section className="hidden lg:flex flex-col w-[45%] border-l border-teal-900/40 bg-[#090B1E] p-6 overflow-y-auto">
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <span className="text-xs font-bold text-teal-300 flex items-center gap-2">
                    <Eye className="w-4 h-4" /> Live Document Preview
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-500/10 text-teal-400 border border-teal-500/20 uppercase">
                    {activeResume?.template || "Modern"} Template
                  </span>
                </div>

                <div className="mt-6 p-8 rounded-2xl bg-white text-slate-900 shadow-2xl font-sans text-[11px] space-y-4 leading-relaxed">
                  <div className="border-b border-slate-900 pb-3 text-center">
                    <h1 className="text-xl font-bold uppercase tracking-wide">{personalInfo.full_name || "YOUR NAME"}</h1>
                    <p className="text-xs font-semibold text-teal-700 mt-0.5">{activeResume?.target_role || "TARGET ROLE"}</p>
                    <p className="text-[10px] text-slate-600 mt-1 flex flex-wrap justify-center gap-2">
                      {personalInfo.email && <span>{personalInfo.email}</span>}
                      {personalInfo.phone && <span>• {personalInfo.phone}</span>}
                      {personalInfo.location && <span>• {personalInfo.location}</span>}
                      {personalInfo.linkedin && <span>• {personalInfo.linkedin}</span>}
                      {personalInfo.github && <span>• {personalInfo.github}</span>}
                    </p>
                  </div>

                  {activeResume?.summary && (
                    <div>
                      <h2 className="text-xs font-bold uppercase border-b border-slate-300 pb-1 mb-1.5 text-teal-800">Professional Summary</h2>
                      <p className="text-slate-700 whitespace-pre-line leading-relaxed">{activeResume.summary}</p>
                    </div>
                  )}

                  {/* Skills Section */}
                  {((activeResume?.skills && activeResume.skills.length > 0) || skillCategories.languages.length > 0) && (
                    <div>
                      <h2 className="text-xs font-bold uppercase border-b border-slate-300 pb-1 mb-1.5 text-teal-800">Technical Skills</h2>
                      {activeResume?.skills && activeResume.skills.length > 0 ? (
                        activeResume.skills.map((sc) => (
                          <p key={sc.id || sc.category} className="text-slate-700 mb-1">
                            <strong className="text-slate-900">{sc.category}:</strong> {sc.skills.join(", ")}
                          </p>
                        ))
                      ) : (
                        <>
                          <p className="text-slate-700 mb-1"><strong>Languages:</strong> {skillCategories.languages.join(", ")}</p>
                          <p className="text-slate-700"><strong>Frameworks & Tools:</strong> {skillCategories.frameworks.join(", ")}</p>
                        </>
                      )}
                    </div>
                  )}

                  {/* Experience Section */}
                  {activeResume?.experience && activeResume.experience.length > 0 && (
                    <div>
                      <h2 className="text-xs font-bold uppercase border-b border-slate-300 pb-1 mb-2 text-teal-800">Work Experience</h2>
                      <div className="space-y-3">
                        {activeResume.experience.map((exp, idx) => (
                          <div key={exp.id || idx} className="space-y-1">
                            <div className="flex justify-between items-baseline">
                              <span className="font-bold text-slate-900">{exp.role} {exp.company && `| ${exp.company}`}</span>
                              {(exp.start_date || exp.end_date) && (
                                <span className="text-[10px] text-slate-500 italic">
                                  {exp.start_date} {exp.end_date ? `- ${exp.end_date}` : exp.current ? "- Present" : ""}
                                </span>
                              )}
                            </div>
                            {exp.description && <p className="text-slate-700 whitespace-pre-line">{exp.description}</p>}
                            {exp.bullets && exp.bullets.length > 0 && (
                              <ul className="list-disc list-inside text-slate-700 pl-2 space-y-0.5">
                                {exp.bullets.map((b, bIdx) => (
                                  <li key={bIdx}>{b}</li>
                                ))}
                              </ul>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Projects Section */}
                  {activeResume?.projects && activeResume.projects.length > 0 && (
                    <div>
                      <h2 className="text-xs font-bold uppercase border-b border-slate-300 pb-1 mb-2 text-teal-800">Projects</h2>
                      <div className="space-y-3">
                        {activeResume.projects.map((proj, idx) => (
                          <div key={proj.id || idx} className="space-y-1">
                            <div className="flex justify-between items-baseline">
                              <span className="font-bold text-slate-900">{proj.name}</span>
                              {proj.technologies && proj.technologies.length > 0 && (
                                <span className="text-[10px] text-teal-700 italic">[{proj.technologies.join(", ")}]</span>
                              )}
                            </div>
                            {proj.description && <p className="text-slate-700 whitespace-pre-line">{proj.description}</p>}
                            {proj.bullets && proj.bullets.length > 0 && (
                              <ul className="list-disc list-inside text-slate-700 pl-2 space-y-0.5">
                                {proj.bullets.map((b, bIdx) => (
                                  <li key={bIdx}>{b}</li>
                                ))}
                              </ul>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Education Section */}
                  {activeResume?.education && activeResume.education.length > 0 && (
                    <div>
                      <h2 className="text-xs font-bold uppercase border-b border-slate-300 pb-1 mb-2 text-teal-800">Education</h2>
                      <div className="space-y-2">
                        {activeResume.education.map((edu, idx) => (
                          <div key={edu.id || idx} className="space-y-0.5">
                            <div className="flex justify-between items-baseline">
                              <span className="font-bold text-slate-900">{edu.institution}</span>
                              {(edu.start_date || edu.end_date) && (
                                <span className="text-[10px] text-slate-500 italic">
                                  {edu.start_date} {edu.end_date ? `- ${edu.end_date}` : ""}
                                </span>
                              )}
                            </div>
                            {(edu.degree || edu.field_of_study) && (
                              <p className="text-slate-700 italic">{edu.degree} {edu.field_of_study && `in ${edu.field_of_study}`}</p>
                            )}
                            {edu.description && <p className="text-slate-600 text-[10px]">{edu.description}</p>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Certifications Section */}
                  {activeResume?.certifications && activeResume.certifications.length > 0 && (
                    <div>
                      <h2 className="text-xs font-bold uppercase border-b border-slate-300 pb-1 mb-1.5 text-teal-800">Certifications</h2>
                      <ul className="list-disc list-inside text-slate-700 space-y-1">
                        {activeResume.certifications.map((cert, idx) => (
                          <li key={cert.id || idx}>
                            <strong className="text-slate-900">{cert.name}</strong> {cert.issuer && `— ${cert.issuer}`} {cert.date && `(${cert.date})`}{cert.credential_id && ` • ID: ${cert.credential_id}`}{cert.url && ` • ${cert.url}`}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Competitions / Achievements Section */}
                  {activeResume?.achievements && activeResume.achievements.length > 0 && (
                    <div>
                      <h2 className="text-xs font-bold uppercase border-b border-slate-300 pb-1 mb-1.5 text-teal-800">Competitions / Achievements</h2>
                      <ul className="list-disc list-inside text-slate-700 space-y-1.5">
                        {activeResume.achievements.map((ach, idx) => (
                          <li key={ach.id || idx}>
                            <strong className="text-slate-900">{ach.title}</strong>
                            {ach.organization && ` — ${ach.organization}`}
                            {ach.result && ` (${ach.result})`}
                            {ach.date && ` [${ach.date}]`}
                            {ach.description && <p className="text-slate-600 pl-4 mt-0.5">{ach.description}</p>}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Languages Section */}
                  {activeResume?.languages && activeResume.languages.length > 0 && (
                    <div>
                      <h2 className="text-xs font-bold uppercase border-b border-slate-300 pb-1 mb-1.5 text-teal-800">Languages</h2>
                      <p className="text-slate-700">
                        {activeResume.languages.map((l) => `${l.name} (${l.proficiency})`).join(" • ")}
                      </p>
                    </div>
                  )}

                  {/* Custom Sections */}
                  {activeResume?.custom_sections && activeResume.custom_sections.length > 0 && (
                    <div>
                      {activeResume.custom_sections.map((cs, idx) => (
                        <div key={cs.id || idx} className="mb-3">
                          <h2 className="text-xs font-bold uppercase border-b border-slate-300 pb-1 mb-1.5 text-teal-800">{cs.title}</h2>
                          {cs.content && <p className="text-slate-700 whitespace-pre-line">{cs.content}</p>}
                          {cs.bullets && cs.bullets.length > 0 && (
                            <ul className="list-disc list-inside text-slate-700 pl-2 space-y-0.5 mt-1">
                              {cs.bullets.map((b, bIdx) => (
                                <li key={bIdx}>{b}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </section>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
