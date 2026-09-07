import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { API_URL, getAuthHeaders, getAuthToken } from "@/config";
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  GraduationCap,
  Code2,
  Brain,
  Target,
  Clock,
  Layers,
  FileText,
  Briefcase,
  Cpu,
  Sun,
  Moon,
  AlertCircle,
} from "lucide-react";

export default function Onboarding() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);
  const [validationError, setValidationError] = useState<string | null>(null);

  // 12 Dimensions of Learner Profile
  const [academicYear, setAcademicYear] = useState<string>("3rd Year");
  const [careerGoal, setCareerGoal] = useState<string>("Software Developer");
  const [targetCompanyType, setTargetCompanyType] = useState<string>("Product / Tier-1");
  const [programmingLevel, setProgrammingLevel] = useState<string>("Beginner");
  const [dsaLevel, setDsaLevel] = useState<string>("Beginner");
  const [aptitudeLevel, setAptitudeLevel] = useState<string>("Beginner");
  const [coreCsLevel, setCoreCsLevel] = useState<string>("Not started");
  const [preferredLanguages, setPreferredLanguages] = useState<string[]>(["Python", "Java"]);
  const [projectsCount, setProjectsCount] = useState<string>("1 Project");
  const [hasResume, setHasResume] = useState<string>("I don't have one yet");
  const [previousPrep, setPreviousPrep] = useState<string>("None");
  const [availableHours, setAvailableHours] = useState<number>(10);

  // Check if onboarding is already completed on mount
  useEffect(() => {
    let isMounted = true;
    const checkOnboardingStatus = async () => {
      try {
        const token = getAuthToken();
        if (!token) {
          if (isMounted) setCheckingStatus(false);
          return;
        }

        const res = await fetch(`${API_URL}/api/onboarding/status`, {
          headers: getAuthHeaders(true),
        });

        if (res.ok) {
          const data = await res.json();
          if (data.onboarding_completed && isMounted) {
            // Already completed onboarding, proceed to Home
            navigate("/home", { replace: true });
            return;
          }
        }
      } catch (err) {
        console.error("Error checking onboarding status:", err);
      } finally {
        if (isMounted) setCheckingStatus(false);
      }
    };

    checkOnboardingStatus();
    return () => {
      isMounted = false;
    };
  }, [navigate]);

  const toggleLanguage = (lang: string) => {
    setValidationError(null);
    if (preferredLanguages.includes(lang)) {
      if (preferredLanguages.length > 1) {
        setPreferredLanguages(preferredLanguages.filter((l) => l !== lang));
      } else {
        setValidationError("Please select at least one preferred programming language.");
      }
    } else {
      setPreferredLanguages([...preferredLanguages, lang]);
    }
  };

  const validateCurrentStep = (): boolean => {
    setValidationError(null);
    if (step === 1) {
      if (!academicYear || !careerGoal || !targetCompanyType) {
        setValidationError("Please select your academic year, target role, and company preference.");
        return false;
      }
    } else if (step === 2) {
      if (!programmingLevel || !dsaLevel || !aptitudeLevel || !coreCsLevel) {
        setValidationError("Please select your baseline level for all skill dimensions.");
        return false;
      }
      if (preferredLanguages.length === 0) {
        setValidationError("Please select at least one programming language.");
        return false;
      }
    } else if (step === 3) {
      if (!projectsCount || !hasResume || !previousPrep) {
        setValidationError("Please complete all experience and schedule questions.");
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (!validateCurrentStep()) return;
    if (step < 3) {
      setStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleBack = () => {
    setValidationError(null);
    if (step > 1) {
      setStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSaveProfile = async () => {
    if (!validateCurrentStep()) return;
    setLoading(true);
    setValidationError(null);

    const payload = {
      academic_year: academicYear,
      career_goal: careerGoal,
      target_company_type: targetCompanyType,
      programming_level: programmingLevel,
      dsa_level: dsaLevel,
      aptitude_level: aptitudeLevel,
      core_cs_level: coreCsLevel,
      preferred_languages: preferredLanguages,
      projects_count: projectsCount,
      has_resume: hasResume,
      previous_prep: previousPrep,
      available_hours_per_week: availableHours,
    };

    try {
      const res = await fetch(`${API_URL}/api/onboarding/submit`, {
        method: "POST",
        headers: getAuthHeaders(true),
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        // Update user state in context
        updateUser({
          role: `${careerGoal} Aspirant`,
        });
        navigate("/home", { replace: true });
      } else {
        const errData = await res.json().catch(() => ({}));
        setValidationError(errData.detail || "Failed to save profile. Please try again.");
      }
    } catch (err) {
      console.error("Failed to save onboarding profile:", err);
      setValidationError("Network error while connecting to server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (checkingStatus) {
    return (
      <div className="min-h-screen w-full bg-background flex flex-col items-center justify-center p-4">
        <div className="w-10 h-10 rounded-full border-3 border-purple-500 border-t-transparent animate-spin mb-4" />
        <p className="text-sm font-medium text-muted-foreground animate-pulse">Initializing PlaceMentor...</p>
      </div>
    );
  }

  const progressPercentage = Math.round((step / 3) * 100);

  return (
    <div className="min-h-screen w-full bg-background text-foreground flex flex-col font-sans selection:bg-purple-500/20 selection:text-purple-300">
      {/* 1. DEDICATED FULL-SCREEN ONBOARDING HEADER */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border/70">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between">
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-teal-400 flex items-center justify-center text-white font-bold text-base shadow-lg shadow-purple-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base sm:text-lg tracking-tight bg-gradient-to-r from-purple-400 via-indigo-300 to-teal-300 bg-clip-text text-transparent">
                  PlaceMentor AI
                </span>
                <span className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  Placement Setup
                </span>
              </div>
              <p className="hidden sm:block text-[11px] text-muted-foreground">Personalize Your Placement Journey</p>
            </div>
          </div>

          {/* Right Status & Controls */}
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="flex items-center gap-2 bg-secondary/60 px-3 py-1.5 rounded-xl border border-border">
              <span className="text-xs font-bold text-foreground">Step {step} of 3</span>
              <span className="text-xs font-mono font-extrabold text-purple-600 dark:text-purple-400 bg-purple-500/10 px-1.5 py-0.5 rounded-md">
                {progressPercentage}%
              </span>
            </div>

            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl border border-border bg-card hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
              title="Toggle Theme"
            >
              {theme === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-500" />}
            </button>
          </div>
        </div>

        {/* Full-width Smooth Horizontal Progress Bar */}
        <div className="w-full bg-secondary/40 h-1.5 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-600 via-indigo-500 to-teal-400 transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </header>

      {/* 2. GENEROUS FULL-SCREEN MAIN SURVEY CONTENT */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-8 py-8 sm:py-12 flex flex-col justify-between">
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
          {/* STEP 1: CAREER DIRECTION */}
          {step === 1 && (
            <div className="space-y-8">
              {/* Section Header */}
              <div className="space-y-2 border-b border-border/50 pb-6">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 text-xs font-bold tracking-wide uppercase">
                  <GraduationCap className="w-3.5 h-3.5" /> Step 1: Academic Status & Career Direction
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                  Where are you in your college journey?
                </h1>
                <p className="text-sm text-muted-foreground max-w-2xl">
                  Your academic status helps us tailor the timeline urgency and recruitment roadmaps for 2026-27 placement season.
                </p>
              </div>

              {/* 1. Academic Year */}
              <div className="space-y-3">
                <label className="text-sm font-bold text-foreground flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-purple-500" />
                  Current Academic Year
                  <span className="text-xs text-muted-foreground font-normal">(Sets roadmap urgency)</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                  {["1st Year", "2nd Year", "3rd Year", "Final Year", "Graduate"].map((yr) => {
                    const isSelected = academicYear === yr;
                    return (
                      <button
                        key={yr}
                        type="button"
                        onClick={() => {
                          setAcademicYear(yr);
                          setValidationError(null);
                        }}
                        className={`p-4 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between gap-2 relative overflow-hidden ${
                          isSelected
                            ? "border-purple-500 bg-purple-500/15 text-foreground shadow-md shadow-purple-500/10 ring-2 ring-purple-500/30"
                            : "border-border bg-card hover:bg-secondary/70 hover:border-border/80 text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs uppercase tracking-wider font-bold text-purple-600 dark:text-purple-400">
                            {yr.includes("Year") ? yr.split(" ")[0] : "Alum"}
                          </span>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-purple-500" />}
                        </div>
                        <span className="text-sm font-bold text-foreground">{yr}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Target Career Role */}
              <div className="space-y-3 pt-2">
                <label className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Target className="w-4 h-4 text-indigo-500" />
                  Target Career Role
                  <span className="text-xs text-muted-foreground font-normal">(Customizes DSA & tech focus)</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {[
                    { title: "Software Developer", desc: "Core algorithms, data structures, and backend systems" },
                    { title: "Full Stack Developer", desc: "End-to-end web apps, APIs, frontend & databases" },
                    { title: "Data Analyst", desc: "SQL, data wrangling, analytics, and business metrics" },
                    { title: "AI/ML Engineer", desc: "Machine learning, Python, math, and model deployment" },
                    { title: "Cloud Engineer", desc: "AWS/GCP, infrastructure, DevOps, and networking" },
                    { title: "Cybersecurity", desc: "Application security, network defense, and protocols" },
                    { title: "QA/Testing", desc: "Test automation, quality engineering, and CI/CD" },
                    { title: "DevOps / SRE", desc: "Kubernetes, CI/CD pipelines, and high availability" },
                    { title: "Other", desc: "General technical role or exploratory path" },
                  ].map((role) => {
                    const isSelected = careerGoal === role.title;
                    return (
                      <button
                        key={role.title}
                        type="button"
                        onClick={() => {
                          setCareerGoal(role.title);
                          setValidationError(null);
                        }}
                        className={`p-4 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between gap-1.5 ${
                          isSelected
                            ? "border-indigo-500 bg-indigo-500/15 text-foreground shadow-md shadow-indigo-500/10 ring-2 ring-indigo-500/30"
                            : "border-border bg-card hover:bg-secondary/70 text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-foreground">{role.title}</span>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-indigo-500" />}
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">{role.desc}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. Target Company Type */}
              <div className="space-y-3 pt-2">
                <label className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-emerald-500" />
                  Target Company Type
                  <span className="text-xs text-muted-foreground font-normal">(Shapes mock interview blueprints)</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                  {[
                    { id: "Product / Tier-1", label: "Product / Tier-1", sub: "FAANG, Microsoft, Tier-1 MNCs" },
                    { id: "Service / IT", label: "Service / IT", sub: "TCS, Infosys, Wipro, Accenture" },
                    { id: "High-Growth Startup", label: "High-Growth Startup", sub: "Fast-paced tech scaleups" },
                    { id: "Any", label: "Any Opportunity", sub: "Open to all verified campus recruiters" },
                    { id: "Not sure", label: "Not Sure Yet", sub: "Explore opportunities as you learn" },
                  ].map((comp) => {
                    const isSelected = targetCompanyType === comp.id;
                    return (
                      <button
                        key={comp.id}
                        type="button"
                        onClick={() => {
                          setTargetCompanyType(comp.id);
                          setValidationError(null);
                        }}
                        className={`p-4 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between gap-1.5 ${
                          isSelected
                            ? "border-emerald-500 bg-emerald-500/15 text-foreground shadow-md shadow-emerald-500/10 ring-2 ring-emerald-500/30"
                            : "border-border bg-card hover:bg-secondary/70 text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-foreground">{comp.label}</span>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                        </div>
                        <p className="text-[11px] text-muted-foreground">{comp.sub}</p>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: CURRENT KNOWLEDGE BASELINE (INDEPENDENT SKILLS) */}
          {step === 2 && (
            <div className="space-y-8">
              {/* Section Header */}
              <div className="space-y-2 border-b border-border/50 pb-6">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold tracking-wide uppercase">
                  <Brain className="w-3.5 h-3.5" /> Step 2: Current Knowledge Baseline
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                  Rate your starting technical comfort level
                </h1>
                <p className="text-sm text-muted-foreground max-w-2xl">
                  Each skill is evaluated <strong className="text-foreground">independently</strong>. A 1st-year student can be Advanced, and a Final-year student can be a Beginner. Diagnostic assessments will refine your exact index.
                </p>
              </div>

              {/* 4. General Programming Level */}
              <div className="space-y-3">
                <label className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-purple-500" />
                  General Programming Experience
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
                  {["Never coded", "Beginner", "Basic", "Intermediate", "Advanced", "Not sure"].map((lvl) => {
                    const isSelected = programmingLevel === lvl;
                    return (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => {
                          setProgrammingLevel(lvl);
                          setValidationError(null);
                        }}
                        className={`p-3.5 rounded-2xl border text-center transition-all duration-200 ${
                          isSelected
                            ? "border-purple-500 bg-purple-500/15 text-purple-700 dark:text-purple-300 font-bold ring-2 ring-purple-500/30"
                            : "border-border bg-card hover:bg-secondary/70 text-muted-foreground hover:text-foreground font-medium"
                        }`}
                      >
                        <span className="text-xs">{lvl}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 5. Data Structures & Algorithms */}
              <div className="space-y-3 pt-2">
                <label className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Brain className="w-4 h-4 text-amber-500" />
                  Data Structures & Algorithms (DSA)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
                  {["Never learned", "Beginner", "Basic", "Intermediate", "Advanced", "Not sure"].map((lvl) => {
                    const isSelected = dsaLevel === lvl;
                    return (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => {
                          setDsaLevel(lvl);
                          setValidationError(null);
                        }}
                        className={`p-3.5 rounded-2xl border text-center transition-all duration-200 ${
                          isSelected
                            ? "border-amber-500 bg-amber-500/15 text-amber-700 dark:text-amber-400 font-bold ring-2 ring-amber-500/30"
                            : "border-border bg-card hover:bg-secondary/70 text-muted-foreground hover:text-foreground font-medium"
                        }`}
                      >
                        <span className="text-xs">{lvl}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 6. Quantitative & Logical Aptitude */}
              <div className="space-y-3 pt-2">
                <label className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Layers className="w-4 h-4 text-teal-500" />
                  Quantitative & Logical Aptitude
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
                  {["Not started", "Beginner", "Basic", "Intermediate", "Advanced", "Not sure"].map((lvl) => {
                    const isSelected = aptitudeLevel === lvl;
                    return (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => {
                          setAptitudeLevel(lvl);
                          setValidationError(null);
                        }}
                        className={`p-3.5 rounded-2xl border text-center transition-all duration-200 ${
                          isSelected
                            ? "border-teal-500 bg-teal-500/15 text-teal-700 dark:text-teal-400 font-bold ring-2 ring-teal-500/30"
                            : "border-border bg-card hover:bg-secondary/70 text-muted-foreground hover:text-foreground font-medium"
                        }`}
                      >
                        <span className="text-xs">{lvl}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 7. Core CS Fundamentals */}
              <div className="space-y-3 pt-2">
                <label className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-blue-500" />
                  Core CS Fundamentals (OS, DBMS, Networks, OOP)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
                  {["Not started", "Beginner", "Basic", "Intermediate", "Advanced", "Not sure"].map((lvl) => {
                    const isSelected = coreCsLevel === lvl;
                    return (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => {
                          setCoreCsLevel(lvl);
                          setValidationError(null);
                        }}
                        className={`p-3.5 rounded-2xl border text-center transition-all duration-200 ${
                          isSelected
                            ? "border-blue-500 bg-blue-500/15 text-blue-700 dark:text-blue-400 font-bold ring-2 ring-blue-500/30"
                            : "border-border bg-card hover:bg-secondary/70 text-muted-foreground hover:text-foreground font-medium"
                        }`}
                      >
                        <span className="text-xs">{lvl}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 8. Preferred Programming Languages (Multi-select) */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-foreground">
                    Preferred Programming Languages
                    <span className="text-xs text-muted-foreground font-normal"> (Select all that apply)</span>
                  </label>
                  <span className="text-xs font-semibold text-purple-600 dark:text-purple-400">
                    {preferredLanguages.length} selected
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2.5">
                  {["Python", "Java", "C++", "C", "JavaScript", "SQL", "TypeScript", "Go"].map((lang) => {
                    const isSelected = preferredLanguages.includes(lang);
                    return (
                      <button
                        key={lang}
                        type="button"
                        onClick={() => toggleLanguage(lang)}
                        className={`p-3 rounded-2xl border text-center transition-all duration-200 flex items-center justify-center gap-1.5 ${
                          isSelected
                            ? "border-purple-500 bg-purple-500/15 text-purple-700 dark:text-purple-300 font-bold ring-2 ring-purple-500/30"
                            : "border-border bg-card hover:bg-secondary/70 text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <span className="text-xs">{isSelected ? "✓ " : "+ "}</span>
                        <span className="text-xs font-semibold">{lang}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: EXPERIENCE, PORTFOLIO & SCHEDULE */}
          {step === 3 && (
            <div className="space-y-8">
              {/* Section Header */}
              <div className="space-y-2 border-b border-border/50 pb-6">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-teal-500/10 border border-teal-500/20 text-teal-600 dark:text-teal-400 text-xs font-bold tracking-wide uppercase">
                  <Clock className="w-3.5 h-3.5" /> Step 3: Projects, Resume & Schedule
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                  Finalize your practice & preparation pace
                </h1>
                <p className="text-sm text-muted-foreground max-w-2xl">
                  Helps us compute your realistic weekly milestones and set up your dynamic daily challenges.
                </p>
              </div>

              {/* 9. Projects */}
              <div className="space-y-3">
                <label className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-purple-500" /> Completed Engineering Projects
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { id: "None", label: "No Projects Yet", sub: "Starting from scratch" },
                    { id: "Learning", label: "In Progress", sub: "Currently building first app" },
                    { id: "1 Project", label: "1 Completed Project", sub: "Ready for resume" },
                    { id: "2+ Projects", label: "2+ Projects", sub: "Portfolio ready" },
                  ].map((p) => {
                    const isSelected = projectsCount === p.id;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => {
                          setProjectsCount(p.id);
                          setValidationError(null);
                        }}
                        className={`p-4 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between gap-1.5 ${
                          isSelected
                            ? "border-purple-500 bg-purple-500/15 text-foreground shadow-md shadow-purple-500/10 ring-2 ring-purple-500/30"
                            : "border-border bg-card hover:bg-secondary/70 text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-foreground">{p.label}</span>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-purple-500" />}
                        </div>
                        <p className="text-xs text-muted-foreground">{p.sub}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 10. Resume Status */}
              <div className="space-y-3 pt-2">
                <label className="text-sm font-bold text-foreground flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-500" /> Resume Status
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { id: "I have a resume", label: "I have a resume ready", sub: "You can upload it to the ATS analyzer later" },
                    { id: "I don't have one yet", label: "I don't have a resume yet", sub: "PlaceMentor will guide you through ATS templates" },
                  ].map((r) => {
                    const isSelected = hasResume === r.id;
                    return (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => {
                          setHasResume(r.id);
                          setValidationError(null);
                        }}
                        className={`p-4 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between gap-1.5 ${
                          isSelected
                            ? "border-indigo-500 bg-indigo-500/15 text-foreground shadow-md shadow-indigo-500/10 ring-2 ring-indigo-500/30"
                            : "border-border bg-card hover:bg-secondary/70 text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-foreground">{r.label}</span>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-indigo-500" />}
                        </div>
                        <p className="text-xs text-muted-foreground">{r.sub}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 11. Previous Prep */}
              <div className="space-y-3 pt-2">
                <label className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Target className="w-4 h-4 text-amber-500" /> Previous Placement Preparation
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: "None", label: "First Time Prep", sub: "Zero previous coaching or practice" },
                    { id: "Some", label: "Casual Practice", sub: "Solved a few problems or aptitude tests" },
                    { id: "Regular", label: "Active Preparation", sub: "Consistent coding / mock interviews" },
                  ].map((prep) => {
                    const isSelected = previousPrep === prep.id;
                    return (
                      <button
                        key={prep.id}
                        type="button"
                        onClick={() => {
                          setPreviousPrep(prep.id);
                          setValidationError(null);
                        }}
                        className={`p-4 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between gap-1.5 ${
                          isSelected
                            ? "border-amber-500 bg-amber-500/15 text-foreground shadow-md shadow-amber-500/10 ring-2 ring-amber-500/30"
                            : "border-border bg-card hover:bg-secondary/70 text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-foreground">{prep.label}</span>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-amber-500" />}
                        </div>
                        <p className="text-xs text-muted-foreground">{prep.sub}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 12. Available Hours / Week Slider */}
              <div className="space-y-4 pt-2 p-6 rounded-3xl border border-border/80 bg-card/50">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <label className="text-sm font-bold text-foreground flex items-center gap-2">
                      <Clock className="w-4 h-4 text-teal-500" /> Available Study Time per Week
                    </label>
                    <p className="text-xs text-muted-foreground">Adjust according to your college semester load</p>
                  </div>
                  <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 px-3 py-1.5 rounded-xl self-start sm:self-auto">
                    <span className="text-xs font-medium text-muted-foreground">Commitment:</span>
                    <span className="text-sm font-mono font-extrabold text-purple-600 dark:text-purple-400">
                      {availableHours} hrs / week
                    </span>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <input
                    type="range"
                    min="2"
                    max="40"
                    step="2"
                    value={availableHours}
                    onChange={(e) => setAvailableHours(parseInt(e.target.value))}
                    className="w-full h-2.5 bg-secondary rounded-lg appearance-none cursor-pointer accent-purple-600"
                  />
                  <div className="flex justify-between text-[11px] text-muted-foreground pt-1">
                    <span>2 hrs (Casual)</span>
                    <span className="font-semibold text-purple-500">10 hrs (Recommended)</span>
                    <span>20 hrs (Dedicated)</span>
                    <span>40 hrs (Intensive)</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Validation Warning Alert */}
          {validationError && (
            <div className="p-4 rounded-2xl bg-destructive/10 border border-destructive/30 text-destructive text-sm flex items-center gap-3 animate-in fade-in">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{validationError}</span>
            </div>
          )}
        </div>

        {/* 3. STICKY / ANCHORED BOTTOM NAVIGATION BAR */}
        <div className="pt-10 border-t border-border/70 mt-12 flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-4">
          <div className="text-xs text-muted-foreground">
            🔒 Your responses are saved securely to your private learner profile.
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto">
            {step > 1 && (
              <button
                type="button"
                onClick={handleBack}
                className="px-5 py-2.5 rounded-xl border border-border text-xs sm:text-sm font-bold hover:bg-secondary text-foreground transition-all flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
            )}

            {step < 3 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs sm:text-sm font-bold shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30 transition-all flex items-center gap-2 cursor-pointer"
              >
                Continue <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                disabled={loading}
                onClick={handleSaveProfile}
                className="px-8 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-teal-500 hover:opacity-90 text-white text-xs sm:text-sm font-extrabold shadow-lg shadow-purple-500/25 hover:shadow-purple-500/35 transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Establishing Profile...</span>
                  </>
                ) : (
                  <>
                    <span>Launch PlaceMentor</span>
                    <CheckCircle2 className="w-4 h-4" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
