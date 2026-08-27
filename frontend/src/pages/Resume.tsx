import { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";
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
} from "lucide-react";

const LOADING_STEPS = [
  "Parsing Document Structure...",
  "Extracting Technical Skills & Frameworks...",
  "Benchmarking Against ATS Filtering Rules...",
  "Calculating Recruiter Impact & Action Verbs...",
  "Generating Section-by-Section Recommendations...",
];

export default function Resume() {
  const [file, setFile] = useState<File | null>(null);
  const [fileInputKey, setFileInputKey] = useState(0);
  const [resumeText, setResumeText] = useState("");
  const [extracting, setExtracting] = useState(false);
  const [extractionError, setExtractionError] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [resumeAnalyzed, setResumeAnalyzed] = useState(false);
  const [resumeAnalysis, setResumeAnalysis] = useState<ReturnType<typeof analyzeResume> | null>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [hasAnalyzed, setHasAnalyzed] = useState(true); // default view shows sample report

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
    }, 700);

    return () => clearInterval(interval);
  }, [analyzing]);

  const resumeMetrics = {
    overallScore: 84,
    atsScore: 88,
    impactScore: 79,
    brevityScore: 85,
    fileName: file?.name || "Harini_Muthuvel_SDE_Resume.pdf",
    fileSize: "142 KB",
    lastScanned: "Today, 11:30 AM",
  };

  const keyStrengths = [
    "Strong technical keyword coverage for Python, React, and SQL",
    "Quantified metrics present in 3 out of 4 project descriptions",
    "Clean single-column ATS-friendly typographic hierarchy",
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
    "MongoDB", "PostgreSQL", "REST APIs", "Git", "Docker", "Algorithms & DSA"
  ];

  return (
    <div className="space-y-6 font-sans text-foreground">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-1">ATS Resume Studio</h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Upload and optimize your resume against actual tech industry ATS algorithms and recruiter screening patterns.
        </p>
      </div>

      {/* Analysis In-Progress State */}
      {analyzing ? (
        <div className="p-12 rounded-2xl border border-border bg-card shadow-sm text-center max-w-lg mx-auto space-y-6">
          <div className="w-16 h-16 rounded-full bg-teal-500/10 border border-teal-500/30 flex items-center justify-center mx-auto animate-pulse">
            <RefreshCw className="w-8 h-8 text-teal-600 dark:text-teal-400 animate-spin" />
          </div>

          <div className="space-y-2">
            <h2 className="text-lg font-bold text-foreground">Analyzing Your Resume</h2>
            <p className="text-xs text-muted-foreground font-mono">{LOADING_STEPS[stepIndex]}</p>
          </div>

          <Progress value={((stepIndex + 1) / LOADING_STEPS.length) * 100} className="h-2 bg-secondary [&>div]:bg-teal-600 rounded-full" />
        </div>
      ) : (
        <>
          {/* Upload Dropzone */}
          <div className="p-8 rounded-2xl border-2 border-dashed border-border bg-card hover:border-teal-500/50 hover:bg-secondary/20 transition-all text-center relative overflow-hidden">
            <input
              type="file"
              accept=".pdf,.docx"
              onChange={handleFileSelect}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="max-w-md mx-auto space-y-3 pointer-events-none">
              <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center mx-auto text-teal-600 dark:text-teal-400">
                <UploadCloud className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">Click to upload or drag & drop resume</p>
                <p className="text-xs text-muted-foreground mt-0.5">Supports PDF or DOCX format (Max 10 MB)</p>
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary border border-border text-[11px] font-semibold text-foreground">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" /> Private & Secure ATS Scan
              </span>
            </div>
          </div>

          {/* Diagnostic Report (if analyzed) */}
          {hasAnalyzed && (
            <div className="space-y-6">
              {/* Score KPIs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl border border-border bg-card shadow-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-muted-foreground">Overall Resume Score</span>
                    <Sparkles className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-foreground font-mono">{resumeMetrics.overallScore}</span>
                    <span className="text-xs text-muted-foreground">/ 100</span>
                  </div>
                  <Progress value={resumeMetrics.overallScore} className="h-1.5 bg-secondary [&>div]:bg-teal-600 rounded-full" />
                </div>

                <div className="p-4 rounded-xl border border-border bg-card shadow-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-muted-foreground">ATS Compatibility</span>
                    <FileCheck className="w-4 h-4 text-emerald-500" />
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-foreground font-mono">{resumeMetrics.atsScore}%</span>
                    <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">High Match</span>
                  </div>
                  <Progress value={resumeMetrics.atsScore} className="h-1.5 bg-secondary [&>div]:bg-emerald-500 rounded-full" />
                </div>

                <div className="p-4 rounded-xl border border-border bg-card shadow-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-muted-foreground">Quantified Impact</span>
                    <Zap className="w-4 h-4 text-blue-500" />
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-foreground font-mono">{resumeMetrics.impactScore}%</span>
                    <span className="text-xs text-muted-foreground">Metrics present</span>
                  </div>
                  <Progress value={resumeMetrics.impactScore} className="h-1.5 bg-secondary [&>div]:bg-blue-500 rounded-full" />
                </div>

                <div className="p-4 rounded-xl border border-border bg-card shadow-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-muted-foreground">Brevity & Formatting</span>
                    <FileText className="w-4 h-4 text-purple-500" />
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-foreground font-mono">{resumeMetrics.brevityScore}%</span>
                    <span className="text-xs text-muted-foreground">1 Page format</span>
                  </div>
                  <Progress value={resumeMetrics.brevityScore} className="h-1.5 bg-secondary [&>div]:bg-purple-500 rounded-full" />
                </div>
              </div>

              {/* Actionable Recommendations & Skills Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left: Recommended Fixes */}
                <div className="lg:col-span-8 space-y-4">
                  <div className="p-5 rounded-xl border border-border bg-card space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-500" /> High-Priority Improvements
                      </h3>
                      <span className="text-xs text-muted-foreground">{improvements.length} items to address</span>
                    </div>

                    <div className="space-y-3">
                      {improvements.map((item, i) => (
                        <div key={i} className="p-3.5 rounded-lg border border-border bg-secondary/30 space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-foreground">{item.section}</span>
                            <span className="text-[11px] font-semibold text-teal-600 dark:text-teal-400 bg-teal-500/10 border border-teal-500/20 px-2 py-0.5 rounded">
                              {item.impact}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground leading-relaxed">{item.issue}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Strengths */}
                  <div className="p-5 rounded-xl border border-border bg-card space-y-3">
                    <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Key Strengths
                    </h3>
                    <ul className="space-y-2">
                      {keyStrengths.map((str, i) => (
                        <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                          <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{str}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Right: Detected Keywords & Metadata */}
                <div className="lg:col-span-4 space-y-4">
                  <div className="p-5 rounded-xl border border-border bg-card space-y-3.5">
                    <div>
                      <h3 className="text-xs font-bold text-foreground">Scanned Document</h3>
                      <p className="text-[11px] text-muted-foreground font-mono mt-0.5">{resumeMetrics.fileName}</p>
                    </div>

                    <div className="text-xs space-y-1.5 pt-2 border-t border-border">
                      <div className="flex justify-between text-muted-foreground">
                        <span>File size</span>
                        <span className="font-mono text-foreground">{resumeMetrics.fileSize}</span>
                      </div>
                      <div className="flex justify-between text-muted-foreground">
                        <span>Last scanned</span>
                        <span className="text-foreground">{resumeMetrics.lastScanned}</span>
                      </div>
                    </div>

                    <button
                      onClick={startAnalysis}
                      className="w-full py-2 px-3 rounded-lg border border-border bg-secondary hover:bg-secondary/80 text-xs font-semibold text-foreground transition-colors flex items-center justify-center gap-2 mt-2"
                    >
                      <RefreshCw className="w-3.5 h-3.5" /> Re-scan Resume
                    </button>
                  </div>

                  <div className="p-5 rounded-xl border border-border bg-card space-y-3">
                    <h3 className="text-xs font-bold text-foreground">Detected Technical Keywords</h3>
                    <div className="flex flex-wrap gap-1.5">
                      {detectedSkills.map((sk) => (
                        <span
                          key={sk}
                          className="px-2 py-0.5 rounded-md bg-secondary border border-border text-[11px] font-medium text-foreground"
                        >
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}