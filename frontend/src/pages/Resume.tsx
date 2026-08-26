import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Sparkles,
  UploadCloud,
  RefreshCw,
  Trash2,
  FileText,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

const LOADING_STEPS = [
  "Parsing Document Structure...",
  "Extracting Technical Skills...",
  "Benchmarking Project Impact...",
  "Generating Career Readiness Score...",
];

export default function Resume() {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    if (!analyzing) return;
    setStepIndex(0);
    const stepTimer = setInterval(() => {
      setStepIndex((i) => Math.min(i + 1, LOADING_STEPS.length - 1));
    }, 600);
    const doneTimer = setTimeout(() => {
      navigate("/resume-analysis");
    }, 2600);
    return () => {
      clearInterval(stepTimer);
      clearTimeout(doneTimer);
    };
  }, [analyzing, navigate]);

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) setFile(f);
  }

  if (analyzing) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 font-sans text-foreground">
        <div className="w-full max-w-md rounded-xl border border-border bg-card p-8 text-center space-y-6 shadow-sm">
          <div className="w-14 h-14 mx-auto rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-600 dark:text-teal-400">
            <Sparkles className="w-7 h-7 animate-pulse" />
          </div>

          <div className="space-y-1.5">
            <h3 className="text-lg font-bold text-foreground">Analyzing Resume</h3>
            <p className="text-sm text-muted-foreground">{LOADING_STEPS[stepIndex]}</p>
          </div>

          {/* Stepper Progress Bar */}
          <div className="flex gap-1.5 justify-center">
            {LOADING_STEPS.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i <= stepIndex ? "w-8 bg-teal-600 dark:bg-teal-500" : "w-4 bg-secondary"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-8 space-y-6 font-sans text-foreground">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-teal-500/25 bg-teal-500/10 px-3 py-1 text-xs font-semibold text-teal-700 dark:text-teal-300">
          <Sparkles className="w-3.5 h-3.5" /> Placement ATS Scanner
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Resume Analysis</h1>
        <p className="text-sm text-muted-foreground max-w-lg mx-auto leading-relaxed">
          Upload your resume in PDF or DOCX format for an instant breakdown of keywords, skills gap, and role fit score.
        </p>
      </div>

      {/* Upload Box */}
      <div className="rounded-xl border border-border bg-card p-6 md:p-8 space-y-6 shadow-sm">
        {!file ? (
          <label className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-teal-500/50 hover:bg-secondary/30 transition-all text-center space-y-3">
            <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center text-muted-foreground">
              <UploadCloud className="w-6 h-6 text-teal-600 dark:text-teal-400" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-foreground">Click to upload or drag & drop</p>
              <p className="text-xs text-muted-foreground">PDF, DOC, DOCX up to 10MB</p>
            </div>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileSelect}
              className="hidden"
            />
          </label>
        ) : (
          <div className="p-4 rounded-lg bg-secondary/50 border border-border flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 truncate">
              <FileText className="w-6 h-6 text-teal-600 dark:text-teal-400 flex-shrink-0" />
              <div className="truncate text-left">
                <p className="text-sm font-semibold text-foreground truncate">{file.name}</p>
                <p className="text-xs text-muted-foreground">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
              </div>
            </div>

            <button
              onClick={() => setFile(null)}
              className="p-2 text-muted-foreground hover:text-rose-500 rounded-lg hover:bg-secondary transition-colors"
              title="Remove file"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Security / Privacy notice */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2">
          <ShieldCheck className="w-4 h-4 text-teal-600 dark:text-teal-400 flex-shrink-0" />
          <span>Your document is encrypted and analyzed solely for placement readiness evaluation.</span>
        </div>

        {/* Action CTA */}
        <button
          onClick={() => file && setAnalyzing(true)}
          disabled={!file}
          className="w-full py-3 rounded-lg bg-teal-600 hover:bg-teal-700 disabled:opacity-40 disabled:pointer-events-none text-white text-sm font-semibold shadow-sm transition-all flex items-center justify-center gap-2"
        >
          <span>Run Resume Scan</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}