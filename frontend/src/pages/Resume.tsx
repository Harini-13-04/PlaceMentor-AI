import React, { useState, useEffect } from "react";
import {
  FileText,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  FileCheck,
  Check,
  Zap,
  Trash2,
  Download,
  HelpCircle,
  Code2,
  Users,
  Lightbulb,
  MessageSquare,
} from "lucide-react";

const LOADING_STEPS = [
  "Parsing Document Structure...",
  "Extracting Technical Skills & Frameworks...",
  "Benchmarking Against ATS Screening Rules...",
  "Calculating Recruiter Impact & Action Verbs...",
  "Generating Tailored Interview Questions...",
];

export default function Resume() {
  const [file, setFile] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [hasAnalyzed, setHasAnalyzed] = useState(true);

  // Active Tab: "ats-report" | "interview-questions"
  const [activeTab, setActiveTab] = useState<"ats-report" | "interview-questions">("ats-report");

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      startAnalysis();
    }
  };

  const startAnalysis = () => {
    setAnalyzing(true);
    setStepIndex(0);
  };

  useEffect(() => {
    if (!analyzing) return;
    const interval = setInterval(() => {
      setStepIndex((i) => {
        if (i < LOADING_STEPS.length - 1) {
          return i + 1;
        }
        clearInterval(interval);
        setTimeout(() => {
          setAnalyzing(false);
          setHasAnalyzed(true);
        }, 600);
        return i;
      });
    }, 600);

    return () => clearInterval(interval);
  }, [analyzing]);

  const resumeMetrics = {
    overallScore: 86,
    atsScore: 88,
    impactScore: 82,
    brevityScore: 85,
    fileName: file?.name || "Harini_Muthuvel_SDE_Resume.pdf",
    fileSize: "142 KB",
    lastScanned: "Today, 11:30 AM",
  };

  const keyStrengths = [
    "Strong technical keyword coverage for Python, TypeScript, React, and PostgreSQL",
    "Quantified metrics present in 3 out of 4 project descriptions (e.g., 'Reduced latency by 35%')",
    "Clean single-column ATS-friendly typographic hierarchy without nested tables",
  ];

  const improvements = [
    {
      section: "Experience / Projects",
      issue: "Replace passive verbs ('was involved in', 'helped with') with strong action verbs ('Architected', 'Implemented', 'Optimized').",
      impact: "+4 ATS points",
    },
    {
      section: "Skills Section",
      issue: "Group skills into clear subcategories (Languages, Frameworks, Databases, Tools) for faster recruiter parsing.",
      impact: "+3 ATS points",
    },
    {
      section: "Education",
      issue: "Include relevant coursework (DSA, DBMS, OS, Computer Networks) matching SDE job descriptions.",
      impact: "+2 ATS points",
    },
  ];

  const detectedSkills = [
    "Python", "JavaScript", "TypeScript", "React", "Node.js", "Express",
    "PostgreSQL", "MongoDB", "Redis", "Docker", "AWS", "Git", "REST APIs",
    "Data Structures", "Algorithms", "System Design",
  ];

  // Tailored Interview Questions generated from resume projects & skills
  const RESUME_INTERVIEW_QUESTIONS = [
    {
      category: "Project Deep Dive",
      question: "In your PlaceMentor AI project, how did you architect the state synchronization between the IDE code editor and the testcase evaluation engine?",
      whyInterviewerAsks: "Tests practical distributed system design, latency trade-offs, and how you handle concurrent execution.",
      suggestedStructure: "1. High-level architecture overview -> 2. Communication protocol (WebSockets/REST) -> 3. Isolation & safety -> 4. Concrete performance metrics.",
      proTip: "Mention edge cases like timeout handling for infinite user loops.",
    },
    {
      category: "Technical Stack & Database",
      question: "You listed PostgreSQL and Redis. Explain a scenario in your projects where Redis caching prevented database bottlenecking.",
      whyInterviewerAsks: "Evaluates whether you understand caching patterns (Cache-Aside, Write-Through) or just listed keywords.",
      suggestedStructure: "1. Problem: High read frequency on leaderboard/stats -> 2. Redis TTL configuration -> 3. Cache invalidation strategy -> 4. Measurable latency drop.",
      proTip: "Mention how you handled cache stampedes or TTL expiration.",
    },
    {
      category: "Behavioral & STAR Scenario",
      question: "Describe a situation from your resume experience where project requirements shifted close to the deadline.",
      whyInterviewerAsks: "Assesses adaptability, prioritization, and professional composure under timeline compression.",
      suggestedStructure: "S: Critical deadline constraint -> T: Scope change requirement -> A: Prioritized MVP features and communicated transparently -> R: Delivered on time with 0 regression bugs.",
      proTip: "Emphasize communication with stakeholders and quantitative impact.",
    },
  ];

  return (
    <div className="space-y-6 font-sans text-foreground">
      {/* Top Hero Banner */}
      <div className="p-6 sm:p-8 rounded-2xl border border-purple-500/25 bg-gradient-to-br from-purple-500/10 via-card to-card dark:from-purple-950/40 dark:via-secondary dark:to-card shadow-sm relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-700 dark:text-purple-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>ATS Diagnostic & Interview Prep</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground font-display">
            Resume Intelligence Studio
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground font-medium max-w-xl leading-relaxed">
            ATS keyword benchmarking, recruiter impact scoring, and automatic interview question generation tailored directly to your projects.
          </p>
        </div>

        {/* Action Toggle Pills */}
        <div className="flex items-center gap-2 p-1.5 rounded-xl border border-border bg-secondary/80 shrink-0 select-none">
          <button
            onClick={() => setActiveTab("ats-report")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === "ats-report"
                ? "bg-purple-600 text-white shadow-md"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>ATS Analysis</span>
          </button>

          <button
            onClick={() => setActiveTab("interview-questions")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === "interview-questions"
                ? "bg-purple-600 text-white shadow-md"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>Interview Questions</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          TAB 1: ATS RESUME ANALYSIS REPORT
         ========================================================================= */}
      {activeTab === "ats-report" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Upload Box & Metric Cards (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            {/* Upload Area */}
            <div className="p-6 rounded-2xl border-2 border-dashed border-purple-500/30 bg-card hover:bg-secondary/40 transition-all text-center space-y-3 relative group shadow-sm">
              <input
                type="file"
                accept=".pdf,.docx,.txt"
                onChange={handleFileSelect}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="w-12 h-12 rounded-2xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-600 dark:text-purple-400 mx-auto group-hover:scale-105 transition-transform">
                <UploadCloud className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-foreground">Upload New SDE Resume</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">PDF or DOCX (Max 10MB)</p>
              </div>
            </div>

            {/* Overall Score Card */}
            <div className="p-5 rounded-2xl border border-border bg-card shadow-sm space-y-3 text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Overall ATS Benchmark</span>
              <div className="text-4xl font-extrabold font-mono text-purple-600 dark:text-purple-400">
                {resumeMetrics.overallScore} <span className="text-xs font-normal text-muted-foreground">/ 100</span>
              </div>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">Tier-1 Screening Qualified</p>

              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border/60">
                <div className="p-2 rounded-lg bg-secondary/50">
                  <p className="text-[9px] text-muted-foreground font-semibold">ATS Fit</p>
                  <p className="text-xs font-bold font-mono text-foreground">{resumeMetrics.atsScore}%</p>
                </div>
                <div className="p-2 rounded-lg bg-secondary/50">
                  <p className="text-[9px] text-muted-foreground font-semibold">Impact</p>
                  <p className="text-xs font-bold font-mono text-foreground">{resumeMetrics.impactScore}%</p>
                </div>
                <div className="p-2 rounded-lg bg-secondary/50">
                  <p className="text-[9px] text-muted-foreground font-semibold">Brevity</p>
                  <p className="text-xs font-bold font-mono text-foreground">{resumeMetrics.brevityScore}%</p>
                </div>
              </div>
            </div>

            {/* Extracted Skills List */}
            <div className="p-5 rounded-2xl border border-border bg-card shadow-sm space-y-3">
              <h4 className="text-xs font-bold text-foreground">Detected Technical Keywords</h4>
              <div className="flex flex-wrap gap-1.5">
                {detectedSkills.map((skill) => (
                  <span
                    key={skill}
                    className="px-2 py-0.5 rounded-md text-[10px] font-mono font-medium bg-secondary border border-border text-purple-700 dark:text-purple-300"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Key Strengths & Section Recommendations (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            {/* Strengths Card */}
            <div className="p-5 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 space-y-3 shadow-sm">
              <h3 className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Strong Signals Detected
              </h3>
              <ul className="space-y-2 text-xs">
                {keyStrengths.map((str, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-muted-foreground">
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold mt-0.5">✓</span>
                    <span className="text-foreground leading-relaxed">{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Critical Improvements */}
            <div className="p-5 rounded-2xl border border-border bg-card space-y-4 shadow-sm">
              <h3 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-500" /> Actionable Recommendations
              </h3>

              <div className="space-y-3">
                {improvements.map((imp, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl border border-border bg-secondary/30 space-y-1.5 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-purple-600 dark:text-purple-400 font-mono text-[11px]">
                        {imp.section}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                        {imp.impact}
                      </span>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">{imp.issue}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Action Bar */}
            <div className="p-4 rounded-xl border border-purple-500/30 bg-purple-500/5 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-foreground">Want interview practice based on these skills?</p>
                <p className="text-[11px] text-muted-foreground">Generate tailored questions from your projects and stack.</p>
              </div>

              <button
                onClick={() => setActiveTab("interview-questions")}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white pm-btn-gradient shadow-md flex items-center gap-1"
              >
                <span>View Questions</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: GENERATE INTERVIEW QUESTIONS FROM RESUME
         ========================================================================= */}
      {activeTab === "interview-questions" && (
        <div className="max-w-4xl mx-auto space-y-5">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div>
              <h3 className="text-sm font-bold text-foreground">
                Tailored Questions Generated From Your Resume
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Derived directly from your uploaded projects, frameworks, and database stack.
              </p>
            </div>

            <button
              onClick={() => setActiveTab("ats-report")}
              className="px-3 py-1.5 rounded-lg border border-border text-xs font-semibold text-muted-foreground hover:text-foreground"
            >
              Back to ATS Score
            </button>
          </div>

          <div className="space-y-4">
            {RESUME_INTERVIEW_QUESTIONS.map((q, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl border border-border bg-card hover:border-purple-500/40 transition-all space-y-3.5 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-purple-500/15 text-purple-700 dark:text-purple-300 border border-purple-500/30">
                    {q.category}
                  </span>
                  <span className="text-[10px] text-muted-foreground font-mono">Q{idx + 1} of 3</span>
                </div>

                <h4 className="text-sm sm:text-base font-bold text-foreground leading-relaxed">
                  "{q.question}"
                </h4>

                {/* Why Interviewer Asks */}
                <div className="p-3 rounded-xl bg-secondary/40 border border-border space-y-1 text-xs">
                  <p className="font-bold text-foreground flex items-center gap-1.5">
                    <HelpCircle className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" /> Why recruiters ask this:
                  </p>
                  <p className="text-muted-foreground leading-relaxed">{q.whyInterviewerAsks}</p>
                </div>

                {/* Suggested Answer Structure */}
                <div className="p-3 rounded-xl bg-secondary/40 border border-border space-y-1 text-xs">
                  <p className="font-bold text-foreground flex items-center gap-1.5">
                    <Code2 className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" /> Ideal Answer Architecture:
                  </p>
                  <p className="text-muted-foreground font-mono text-[11px] leading-relaxed">{q.suggestedStructure}</p>
                </div>

                {/* Pro Tip */}
                <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-amber-500 shrink-0" />
                  <span className="text-amber-900 dark:text-amber-200 text-[11px]">
                    <strong>Pro Tip:</strong> {q.proTip}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}