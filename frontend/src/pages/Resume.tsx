import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Sparkles,
  UploadCloud,
  RefreshCw,
  Trash2,
  FileText,
  Wand2,
  CheckCircle2,
  Lock,
} from "lucide-react";

/* ─────────────────────────────────────────────────────────
   Resume — upload + glowing Analyze CTA + loading sequence
   ───────────────────────────────────────────────────────── */

const LOADING_STEPS = [
  "Reading Resume...",
  "Finding Skills...",
  "Checking Projects...",
  "Preparing Career Scan...",
];

const Resume = () => {
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
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="relative w-full max-w-md rounded-3xl border border-white/10 bg-[#0b0d14]/95 backdrop-blur-2xl p-10 text-center overflow-hidden shadow-[0_25px_100px_rgba(0,0,0,0.7)]">
          <div
            className="pointer-events-none absolute -inset-10 opacity-60 blur-3xl"
            style={{
              background:
                "radial-gradient(50% 50% at 30% 20%, rgba(139,92,246,0.35), transparent 70%), radial-gradient(50% 50% at 80% 80%, rgba(59,130,246,0.3), transparent 70%)",
            }}
          />
          <div className="relative flex flex-col items-center gap-6">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600/30 to-blue-600/30 border border-white/10 animate-pulse">
              <Wand2 className="h-9 w-9 text-purple-300" />
            </div>
            <div className="space-y-1.5">
              <p className="text-lg font-semibold text-white">🪄 Mentor is analyzing...</p>
              <p className="text-sm text-muted-foreground">{LOADING_STEPS[stepIndex]}</p>
            </div>
            <div className="flex gap-1.5">
              {LOADING_STEPS.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i <= stepIndex ? "w-8 bg-gradient-to-r from-purple-500 to-blue-500" : "w-4 bg-white/10"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 py-16 flex items-center justify-center">
      <div className="w-full max-w-xl">
        <div className="text-center mb-8 space-y-3">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-purple-500/20 bg-purple-500/10 px-4 py-1.5 text-xs font-medium text-purple-300">
            <Sparkles className="h-3.5 w-3.5" /> Level Up Your Career
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white">Resume Upload</h1>
        </div>

        <div className="relative rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl p-8 md:p-10 overflow-hidden">
          <div
            className="pointer-events-none absolute -inset-10 opacity-50 blur-3xl"
            style={{
              background:
                "radial-gradient(45% 45% at 20% 10%, rgba(139,92,246,0.3), transparent 70%), radial-gradient(45% 45% at 90% 90%, rgba(59,130,246,0.25), transparent 70%)",
            }}
          />

          <div className="relative flex flex-col gap-6">
            {!file ? (
              <label className="group relative flex flex-col items-center gap-4 rounded-2xl border border-dashed border-white/20 bg-white/[0.03] p-12 text-center cursor-pointer transition-all duration-300 hover:border-purple-500/50 hover:bg-white/[0.06]">
                <input type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={handleFileSelect} />
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600/20 to-blue-600/20 border border-white/10 transition-transform duration-300 group-hover:scale-105">
                  <UploadCloud className="h-7 w-7 text-purple-300" />
                </div>
                <div className="space-y-1">
                  <p className="text-base font-semibold text-white">Upload Resume</p>
                  <p className="text-xs text-muted-foreground">PDF or DOCX, up to 5MB</p>
                </div>
              </label>
            ) : (
              <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600/20 to-blue-600/20 border border-white/10">
                  <FileText className="h-5 w-5 text-purple-300" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-white">{file.name}</p>
                  <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
                <CheckCircle2 className="h-5 w-5 text-emerald-400 flex-shrink-0" />
              </div>
            )}

            {file && (
              <div className="flex gap-3">
                <label className="flex-1 cursor-pointer rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-center text-sm font-medium text-white/80 transition-all duration-200 hover:bg-white/[0.08] hover:text-white">
                  <input type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={handleFileSelect} />
                  <span className="inline-flex items-center justify-center gap-1.5">
                    <RefreshCw className="h-3.5 w-3.5" /> Replace
                  </span>
                </label>
                <button
                  type="button"
                  onClick={() => setFile(null)}
                  className="flex-1 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-sm font-medium text-red-300 transition-all duration-200 hover:bg-red-500/20"
                >
                  <span className="inline-flex items-center justify-center gap-1.5">
                    <Trash2 className="h-3.5 w-3.5" /> Remove
                  </span>
                </button>
              </div>
            )}

            <button
              type="button"
              disabled={!file}
              onClick={() => setAnalyzing(true)}
              className="relative rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-4 text-base font-semibold text-white shadow-[0_0_30px_-6px_rgba(139,92,246,0.6)] transition-all duration-200 hover:from-purple-500 hover:to-blue-500 hover:shadow-[0_0_40px_-6px_rgba(139,92,246,0.8)] hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              ✨ Analyze Resume
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Resume;

/* ─────────────────────────────────────────────────────────
   ResumeAnalysis — the new /resume-analysis page
   Only six sections, per spec. Register the route as:
     <Route path="/resume-analysis" element={<ResumeAnalysis />} />
   ───────────────────────────────────────────────────────── */

export const ResumeAnalysis = () => {
  const unlocked = [
    { name: "Java", level: "🟢" },
    { name: "SQL", level: "🟢" },
    { name: "Spring Boot", level: "🟡" },
  ];
  const locked = ["DSA", "REST API", "OOP"];

  return (
    <div className="min-h-screen px-6 py-16 flex justify-center">
      <div className="w-full max-w-xl flex flex-col gap-6">
        {/* 1. Career Power */}
        <div className="relative rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl p-10 text-center overflow-hidden">
          <div
            className="pointer-events-none absolute -inset-10 opacity-60 blur-3xl"
            style={{
              background:
                "radial-gradient(50% 50% at 25% 15%, rgba(139,92,246,0.35), transparent 70%), radial-gradient(50% 50% at 85% 85%, rgba(59,130,246,0.3), transparent 70%)",
            }}
          />
          <div className="relative flex flex-col items-center gap-3">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Career Power</p>
            <p className="text-6xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              82%
            </p>
            <div className="inline-flex items-center rounded-full border border-purple-500/20 bg-purple-500/10 px-4 py-1.5 text-xs font-semibold text-purple-300">
              Level 8
            </div>
          </div>
        </div>

        {/* 2. AI Summary */}
        <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl p-7">
          <p className="text-sm leading-relaxed text-white/80">
            Your resume has a solid foundation. Improve DSA and project impact to increase your placement readiness.
          </p>
        </div>

        {/* 3 & 4. Skills Unlocked / Skills to Unlock */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl p-6 flex flex-col gap-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Skills Unlocked</p>
            <div className="flex flex-col gap-2.5">
              {unlocked.map((s) => (
                <div
                  key={s.name}
                  className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5"
                >
                  <span>{s.level}</span>
                  <span className="text-sm font-medium text-white">{s.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl p-6 flex flex-col gap-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Skills to Unlock</p>
            <div className="flex flex-col gap-2.5">
              {locked.map((name) => (
                <div
                  key={name}
                  className="flex items-center gap-2.5 rounded-xl border border-white/5 bg-white/[0.02] px-4 py-2.5 opacity-50"
                >
                  <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-sm font-medium text-white/60">{name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 5. Next Mission */}
        <div className="relative rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl p-7 overflow-hidden">
          <div
            className="pointer-events-none absolute -inset-10 opacity-40 blur-3xl"
            style={{ background: "radial-gradient(45% 45% at 90% 10%, rgba(139,92,246,0.3), transparent 70%)" }}
          />
          <div className="relative flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">
                Next Mission
              </p>
              <p className="text-lg font-semibold text-white">Complete Arrays</p>
            </div>
            <div className="flex flex-col items-end gap-1 flex-shrink-0">
              <span className="text-xs font-bold text-purple-300">+250 XP</span>
              <span className="text-xs font-bold text-amber-300">+40 Coins</span>
            </div>
          </div>
        </div>

        {/* 6. Mentor Insight */}
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] px-6 py-4">
          <p className="text-sm text-white/70">
            🪄 Focus on one improvement at a time. You're closer than you think.
          </p>
        </div>
      </div>
    </div>
  );
};