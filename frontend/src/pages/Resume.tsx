import React, { useState, useEffect } from "react";
import * as pdfjsLib from "pdfjs-dist";
import mammoth from "mammoth/mammoth.browser";
import { createWorker } from "tesseract.js";
import { apiRequest } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url).toString();
import {
  Sparkles,
  UploadCloud,
  RefreshCw,
  Trash2,
  FileText,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Timer,
  MessageSquare,
  RotateCcw,
  SkipForward,
} from "lucide-react";

const LOADING_STEPS = [
  "Parsing Document Structure...",
  "Extracting Technical Skills...",
  "Benchmarking Project Impact...",
  "Generating Career Readiness Score...",
];

async function extractResumeText(file: File) {
  if (file.type.startsWith("image/")) {
    const worker = await createWorker("eng");
    try {
      const result = await worker.recognize(file);
      const text = result.data.text.replace(/\s+/g, " ").trim();
      if (!text) throw new Error("No readable text was found in this image.");
      return text;
    } finally {
      await worker.terminate();
    }
  }
  if (file.name.toLowerCase().endsWith(".pdf")) {
    const pdfDocument = await pdfjsLib.getDocument({ data: new Uint8Array(await file.arrayBuffer()) }).promise;
    const pages = await Promise.all(Array.from({ length: pdfDocument.numPages }, async (_, index) => {
      const page = await pdfDocument.getPage(index + 1);
      const content = await page.getTextContent();
      return content.items.map((item) => "str" in item ? item.str : "").join(" ");
    }));
    const text = pages.join("\n").replace(/\s+/g, " ").trim();
    if (text) return text;

    const worker = await createWorker("eng");
    try {
      const ocrPages = await Promise.all(Array.from({ length: pdfDocument.numPages }, async (_, index) => {
        const page = await pdfDocument.getPage(index + 1);
        const viewport = page.getViewport({ scale: 1.5 });
        const canvas = document.createElement("canvas");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        await page.render({ canvasContext: canvas.getContext("2d")!, viewport }).promise;
        const result = await worker.recognize(canvas);
        return result.data.text;
      }));
      const ocrText = ocrPages.join("\n").replace(/\s+/g, " ").trim();
      if (!ocrText) throw new Error("No readable text was found in this PDF.");
      return ocrText;
    } finally {
      await worker.terminate();
    }
  }
  if (file.name.toLowerCase().endsWith(".docx")) {
    const result = await mammoth.extractRawText({ arrayBuffer: await file.arrayBuffer() });
    const text = result.value.replace(/\s+/g, " ").trim();
    if (!text) throw new Error("This DOCX has no readable text. Please upload another resume file.");
    return text;
  }
  throw new Error("Please upload a PDF, DOCX, or image resume.");
}

function getDefenseItems(text: string) {
  const lines = text.split(/\r?\n|(?<=\.)\s+/).map((line) => line.trim()).filter((line) => line.length > 2);
  const findLine = (terms: string[], fallbackIndex: number) => {
    const match = lines.find((line) => terms.some((term) => line.toLowerCase().includes(term))) || lines[fallbackIndex] || "this resume entry";
    const segment = match.split(/[•|]/).find((part) => terms.some((term) => part.toLowerCase().includes(term))) || match;
    const compact = segment
      .replace(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi, "")
      .replace(/(?:https?:\/\/|www\.)\S+/gi, "")
      .replace(/(?:\+?\d[\d\s().-]{7,}\d)/g, "")
      .replace(/^(profile|contact|education|technical skills|achievements|projects|relevant coursework)\s*[:|-]?\s*/i, "")
      .replace(/\s+/g, " ")
      .trim();
    return { label: compact.length > 44 ? `${compact.slice(0, 44).trim()}...` : compact, evidence: compact };
  };
  return [
    { category: "Project", ...findLine(["project", "built", "developed"], 0) },
    { category: "Skill", ...findLine(["mongodb", "python", "react", "javascript", "typescript", "java", "sql", "skills"], 1) },
    { category: "Internship", ...findLine(["intern", "trainee", "experience"], 2) },
    { category: "Achievement", ...findLine(["achievement", "award", "won", "led", "increased"], 3) },
    { category: "Certification", ...findLine(["certif", "course", "credential"], 4) },
  ];
}

function createDefenseQuestions(item: { category: string; label: string; evidence: string }) {
  const evidence = item.evidence.length > 90 ? `${item.evidence.slice(0, 90).trim()}...` : item.evidence;
  const questions: Record<string, string[]> = {
    Project: [`What problem did ${item.label} solve?`, `What was your contribution to ${item.label}?`, `How would you improve ${item.label} now?`],
    Skill: [`Where did you use ${item.label} in your resume?`, `What challenge did ${item.label} help you solve?`, `How would you prove your level in ${item.label}?`],
    Internship: [`What did you deliver during ${item.label}?`, `What was the hardest part of ${item.label}?`, `What did ${item.label} teach you?`],
    Achievement: [`What actions led to ${item.label}?`, `How did you measure ${item.label}?`, `What would you do differently next time?`],
    Certification: [`Why was ${item.label} relevant to your goals?`, `What did you apply from ${item.label}?`, `How has ${item.label} improved your work?`],
  };
  return [...(questions[item.category] || [`Explain ${item.label} from your resume.`, `What did you learn from ${item.label}?`, `Would you choose ${item.label} again?`]), `Resume evidence: ${evidence}`].slice(0, 3);
}

function analyzeResume(text: string) {
  const normalized = text.toLowerCase();
  const sections = ["education", "skills", "projects", "experience", "achievement", "certif"].filter((section) => normalized.includes(section));
  const suggestions: string[] = [];
  const addSuggestion = (suggestion: string) => {
    if (!suggestions.includes(suggestion)) suggestions.push(suggestion);
  };

  if (!sections.includes("skills")) addSuggestion("Add a dedicated technical skills section matching your target role.");
  if (!sections.includes("projects")) addSuggestion("Add one or two projects with the technology used and your individual contribution.");
  if (!sections.includes("experience") && !normalized.includes("intern")) addSuggestion("Include internship, freelance, or practical experience with clear responsibilities.");
  if (!sections.includes("education")) addSuggestion("Add your education details, graduation year, and relevant coursework.");
  if (!normalized.includes("github") && !normalized.includes("portfolio")) addSuggestion("Add a GitHub or portfolio link so recruiters can verify your technical work.");
  if (!normalized.match(/\b\d+(?:\.\d+)?\s*%|\b\d+\s*(?:x|users?|projects?|months?|years?)\b/)) addSuggestion("Quantify your impact with metrics such as performance gains, users, scale, or completion time.");
  if (text.length < 900) addSuggestion("Add specific tools, outcomes, and context so each resume entry is easier to evaluate.");
  if (text.length > 2200) addSuggestion("Reduce dense paragraphs and keep each bullet focused on one outcome.");
  if (!normalized.match(/\b(built|developed|designed|implemented|optimized|led|created|automated)\b/)) addSuggestion("Start bullets with strong action verbs that make your contribution immediately clear.");

  while (suggestions.length < 3) {
    addSuggestion("Tailor the wording of this resume to the job description and repeat the role's most relevant keywords.");
  }
  const improvements = suggestions.slice(0, 3);
  const strengths = [
    sections.includes("skills") ? "Technical skills are clearly listed." : "Add a dedicated technical skills section.",
    sections.includes("projects") ? "Projects demonstrate hands-on experience." : "Add project details with your contribution.",
    sections.includes("achievement") ? "Achievements make your profile more credible." : "Add measurable achievements or outcomes.",
  ];
  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
  const metricCount = (normalized.match(/\b\d+(?:\.\d+)?\s*%|\b\d+\s*(?:x|users?|projects?|months?|years?)\b/g) || []).length;
  const actionVerbCount = (normalized.match(/\b(built|developed|designed|implemented|optimized|led|created|automated|managed|improved)\b/g) || []).length;
  const technicalKeywordCount = new Set(normalized.match(/\b(python|java|javascript|typescript|react|node|sql|mongodb|aws|docker|git|api|machine learning|data structures|algorithms)\b/g) || []).size;
  const score = Math.min(
    96,
    Math.max(
      45,
      38 + sections.length * 5 + Math.min(10, Math.floor(wordCount / 180)) + Math.min(12, metricCount * 4)
        + (normalized.includes("github") || normalized.includes("portfolio") ? 4 : 0)
        + Math.min(8, actionVerbCount * 2) + Math.min(8, technicalKeywordCount),
    ),
  );
  return { score, sections, strengths, improvements };
}

type SavedResume = {
  file_name: string;
  extracted_text: string;
  analysis: ReturnType<typeof analyzeResume>;
};

export default function Resume() {
  const { token } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [fileInputKey, setFileInputKey] = useState(0);
  const [resumeText, setResumeText] = useState("");
  const [extracting, setExtracting] = useState(false);
  const [extractionError, setExtractionError] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [resumeAnalyzed, setResumeAnalyzed] = useState(false);
  const [resumeAnalysis, setResumeAnalysis] = useState<ReturnType<typeof analyzeResume> | null>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [defending, setDefending] = useState(false);
  const [defenseItems, setDefenseItems] = useState<ReturnType<typeof getDefenseItems>>([]);
  const [defenseQuestionItems, setDefenseQuestionItems] = useState<ReturnType<typeof getDefenseItems>>([]);
  const [defenseItem, setDefenseItem] = useState({ category: "Resume", label: "your resume", evidence: "your resume" });
  const [defenseQuestions, setDefenseQuestions] = useState<string[]>([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [answers, setAnswers] = useState<string[]>([]);
  const [defenseScore, setDefenseScore] = useState<number | null>(null);
  const [improvements, setImprovements] = useState<string[]>([]);
  const [secondsLeft, setSecondsLeft] = useState(600);

  useEffect(() => {
    if (!token) return;
    apiRequest<SavedResume | null>("/api/resume")
      .then((savedResume) => {
        if (!savedResume) return;
        setResumeText(savedResume.extracted_text);
        setResumeAnalysis(savedResume.analysis);
        setResumeAnalyzed(true);
      })
      .catch(() => {
        // Resume persistence is optional; the local scanner remains usable.
      });
  }, [token]);

  useEffect(() => {
    if (!defending || secondsLeft <= 0) return;
    const timer = window.setInterval(() => setSecondsLeft((seconds) => seconds - 1), 1000);
    return () => window.clearInterval(timer);
  }, [defending, secondsLeft]);

  useEffect(() => {
    if (!analyzing) return;
    setStepIndex(0);
    const stepTimer = setInterval(() => {
      setStepIndex((i) => Math.min(i + 1, LOADING_STEPS.length - 1));
    }, 600);
    const doneTimer = setTimeout(() => {
      setAnalyzing(false);
      if (resumeText.trim()) {
        const analysis = analyzeResume(resumeText);
        setResumeAnalysis(analysis);
        setResumeAnalyzed(true);
        apiRequest<SavedResume>("/api/resume", {
          method: "PUT",
          body: JSON.stringify({
            file_name: file?.name || "resume",
            extracted_text: resumeText,
            analysis,
          }),
        }).then((savedResume) => setResumeAnalysis(savedResume.analysis)).catch(() => {
          // Keep the scan result available if the backend is temporarily offline.
        });
      } else {
        setExtractionError("Resume text could not be read. Please upload the resume again.");
      }
    }, 2600);
    return () => {
      clearInterval(stepTimer);
      clearTimeout(doneTimer);
    };
  }, [analyzing]);

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setResumeText("");
    setDefenseItems([]);
    setResumeAnalyzed(false);
    setResumeAnalysis(null);
    setDefending(false);
    setDefenseScore(null);
    setExtractionError("");
    setExtracting(true);
    try {
      setResumeText(await extractResumeText(f));
    } catch (error) {
      setFile(null);
      setExtractionError(error instanceof Error ? error.message : "Could not read this resume.");
    } finally {
      setExtracting(false);
    }
  }

  function startDefense() {
    const extractedText = resumeText.trim();
    if (!extractedText) {
      setExtractionError("Resume text could not be read. Please upload the resume again.");
      setResumeAnalyzed(false);
      setResumeAnalysis(null);
      return;
    }
    const items = defenseItems.length ? defenseItems : getDefenseItems(extractedText);
    setDefenseItems(items);
    const selectedItems = [...items].sort(() => Math.random() - 0.5).slice(0, 3);
    const questions = selectedItems.map((item, index) => createDefenseQuestions(item)[index % 3]);
    if (selectedItems.length < 3 || questions.some((question) => !question)) {
      setExtractionError("Could not create questions from this resume. Please scan it again.");
      return;
    }
    setDefenseQuestionItems(selectedItems);
    setDefenseItem(selectedItems[0]);
    setDefenseQuestions(questions);
    setQuestionIndex(0);
    setAnswer("");
    setAnswers([]);
    setDefenseScore(null);
    setImprovements([]);
    setResumeAnalyzed(false);
    setSecondsLeft(600);
    setDefending(true);
  }

  function scanAnotherResume() {
    setFile(null);
    setResumeText("");
    setDefenseItems([]);
    setResumeAnalyzed(false);
    setResumeAnalysis(null);
    setDefending(false);
    setDefenseScore(null);
    setExtractionError("");
    setFileInputKey((key) => key + 1);
  }

  function nextQuestion() {
    if (questionIndex < defenseQuestions.length - 1) {
      setAnswers((previous) => [...previous, answer]);
      setQuestionIndex((index) => index + 1);
      setDefenseItem(defenseQuestionItems[questionIndex + 1]);
      setAnswer("");
    } else {
      startDefense();
    }
  }

  const minutes = Math.floor(secondsLeft / 60).toString().padStart(2, "0");
  const seconds = (secondsLeft % 60).toString().padStart(2, "0");

  function finishDefense() {
    const completedAnswers = [...answers, answer];
    const feedback = completedAnswers.reduce<string[]>((tips, response, index) => {
      if (response.trim().length < 40) {
        return [...tips, `Question ${index + 1}: Add a specific example or detail.`];
      }
      return tips;
    }, []);
    if (!feedback.length) feedback.push("Mention measurable impact, trade-offs, and what you learned.");
    setImprovements(feedback);
    const total = completedAnswers.reduce((score, response) => {
      if (response.trim().length >= 120) return score + 100;
      if (response.trim().length >= 80) return score + 85;
      if (response.trim().length >= 40) return score + 70;
      if (response.trim().length >= 15) return score + 50;
      return score + 25;
    }, 0);
    setDefenseScore(Math.round(total / completedAnswers.length));
  }

  if (defenseScore !== null) {
    return (
      <div className="max-w-2xl mx-auto py-12 text-center font-sans text-foreground">
        <div className="rounded-xl border border-border bg-card p-8 shadow-sm space-y-5">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-teal-500/10 text-2xl font-bold text-teal-600 dark:text-teal-400">{defenseScore}</div>
          <div><p className="text-xs font-semibold uppercase tracking-wide text-teal-600 dark:text-teal-400">Defense analysis</p><h1 className="mt-2 text-2xl font-bold">Your resume defense score</h1><p className="mt-2 text-sm text-muted-foreground">Your score reflects how complete and specific your answers were across the interview.</p></div>
          <div className="h-2 rounded-full bg-secondary"><div className="h-full rounded-full bg-teal-600 transition-all" style={{ width: `${defenseScore}%` }} /></div>
          <div className="rounded-lg border border-border bg-secondary/40 p-4 text-left"><h2 className="text-sm font-bold">What to improve</h2><ul className="mt-2 space-y-1 text-sm text-muted-foreground">{improvements.map((tip) => <li key={tip}>• {tip}</li>)}</ul></div>
          <div className="flex justify-center gap-3"><button onClick={() => { setDefenseScore(null); setDefending(false); }} className="rounded-lg border border-border px-4 py-2.5 text-sm font-semibold text-muted-foreground hover:bg-secondary">Back to resume</button><button onClick={startDefense} className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-700">Retry <RotateCcw className="w-4 h-4" /></button></div>
        </div>
      </div>
    );
  }

  if (resumeAnalyzed && resumeAnalysis) {
    return (
      <div className="max-w-3xl mx-auto py-8 space-y-6 font-sans text-foreground">
        <div className="text-center"><p className="text-xs font-semibold uppercase tracking-wide text-teal-600 dark:text-teal-400">Resume scan complete</p><h1 className="mt-2 text-3xl font-bold tracking-tight">Resume & Placement Readiness</h1><p className="mt-2 text-sm text-muted-foreground">Here is how prepared your resume is for placement opportunities.</p></div>
        <div className="grid gap-4 md:grid-cols-[180px_1fr]">
          <div className="rounded-xl border border-border bg-card p-6 text-center shadow-sm"><div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border-8 border-teal-500/20 text-3xl font-bold text-teal-600 dark:text-teal-400">{resumeAnalysis.score}</div><p className="mt-3 text-sm font-semibold">Readiness score</p><p className="mt-1 text-xs text-muted-foreground">Placement fit</p></div>
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm"><h2 className="text-lg font-bold">Analysis summary</h2><p className="mt-1 text-sm text-muted-foreground">Detected {resumeAnalysis.sections.length} useful resume sections.</p><div className="mt-4 flex flex-wrap gap-2">{resumeAnalysis.sections.map((section) => <span key={section} className="rounded-full bg-teal-500/10 px-3 py-1 text-xs font-semibold capitalize text-teal-700 dark:text-teal-300">{section}</span>)}</div></div>
        </div>
        <div className="grid gap-4 md:grid-cols-2"><div className="rounded-xl border border-border bg-card p-6 shadow-sm"><h2 className="text-lg font-bold">What is working</h2><ul className="mt-3 space-y-2 text-sm text-muted-foreground">{resumeAnalysis.strengths.map((item) => <li key={item}>✓ {item}</li>)}</ul></div><div className="rounded-xl border border-amber-500/25 bg-amber-500/5 p-6"><h2 className="text-lg font-bold">What to improve</h2><ul className="mt-3 space-y-2 text-sm text-muted-foreground">{resumeAnalysis.improvements.map((item) => <li key={item}>• {item}</li>)}</ul></div></div>
        <div className="flex flex-wrap justify-center gap-3"><button onClick={scanAnotherResume} className="rounded-lg border border-border px-4 py-2.5 text-sm font-semibold text-muted-foreground hover:bg-secondary">Scan another resume</button><button onClick={startDefense} disabled={!resumeText.trim()} className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal-700 disabled:pointer-events-none disabled:opacity-40">Start Defense Mode <ArrowRight className="w-4 h-4" /></button></div>
      </div>
    );
  }

  if (defending) {
    return (
      <div className="max-w-3xl mx-auto py-8 space-y-6 font-sans text-foreground">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-teal-500/25 bg-teal-500/10 px-3 py-1 text-xs font-semibold text-teal-700 dark:text-teal-300"><ShieldCheck className="w-3.5 h-3.5" /> Interview simulation</div>
            <h1 className="mt-3 text-3xl font-bold tracking-tight">Defend Your Resume</h1>
            <p className="mt-1 text-sm text-muted-foreground">Give a clear, specific answer. Your interviewer may follow up.</p>
          </div>
          <div className={`flex items-center gap-2 rounded-lg border px-3 py-2 font-mono text-lg font-bold ${secondsLeft < 60 ? "border-rose-500/40 text-rose-500" : "border-border text-foreground"}`}><Timer className="w-5 h-5" /> {minutes}:{seconds}</div>
        </div>
        <div className="rounded-xl border border-border bg-card p-6 md:p-8 shadow-sm space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-teal-600 dark:text-teal-400"><span className="rounded-full bg-teal-500/10 px-2.5 py-1">{defenseItem.category}</span><span className="text-muted-foreground">Question {questionIndex + 1} of {defenseQuestions.length}</span></div>
            <button onClick={startDefense} className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground" title="Pick another resume item"><RotateCcw className="w-3.5 h-3.5" /> New challenge</button>
          </div>
          <div className="h-1.5 rounded-full bg-secondary"><div className="h-full rounded-full bg-teal-600 transition-all" style={{ width: `${((questionIndex + 1) / 3) * 100}%` }} /></div>
          <div className="rounded-lg border border-teal-500/20 bg-teal-500/5 p-5"><p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Interviewer</p><h2 className="text-xl font-bold leading-snug">{defenseQuestions[questionIndex] || "Tell me about this resume entry."}</h2></div>
          <div className="space-y-2"><label className="flex items-center gap-2 text-sm font-semibold"><MessageSquare className="w-4 h-4 text-teal-600" /> Your answer</label><textarea value={answer} onChange={(event) => setAnswer(event.target.value)} placeholder="Speak as if you are answering the interviewer..." className="min-h-36 w-full resize-y rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-teal-500" autoFocus /></div>
          <div className="flex flex-wrap justify-between gap-3"><button onClick={() => { const nextIndex = Math.min(questionIndex + 1, 2); setQuestionIndex(nextIndex); setDefenseItem(defenseQuestionItems[nextIndex]); setAnswer(""); }} className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-semibold text-muted-foreground hover:bg-secondary"><SkipForward className="w-4 h-4" /> Skip</button><div className="flex flex-wrap gap-2">{questionIndex === 2 && <><button onClick={finishDefense} className="rounded-lg border border-border px-4 py-2.5 text-sm font-semibold text-muted-foreground hover:bg-secondary">Finish session</button><button onClick={startDefense} className="inline-flex items-center gap-2 rounded-lg border border-teal-600 px-4 py-2.5 text-sm font-semibold text-teal-700 hover:bg-teal-500/10">Retry <RotateCcw className="w-4 h-4" /></button></>}{questionIndex < 2 && <button onClick={nextQuestion} disabled={!answer.trim() || secondsLeft === 0} className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-700 disabled:pointer-events-none disabled:opacity-40">Submit answer <ArrowRight className="w-4 h-4" /></button>}</div></div>
        </div>
      </div>
    );
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
              <p className="text-xs text-muted-foreground">PDF, DOCX, JPG, PNG up to 10MB</p>
            </div>
            <input
              key={fileInputKey}
              type="file"
              accept=".pdf,.docx,.jpg,.jpeg,.png,.webp"
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
              onClick={() => { setFile(null); setResumeText(""); setResumeAnalyzed(false); setResumeAnalysis(null); setExtractionError(""); }}
              className="p-2 text-muted-foreground hover:text-rose-500 rounded-lg hover:bg-secondary transition-colors"
              title="Remove file"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}

        {extractionError && <p className="text-sm font-medium text-rose-500">{extractionError}</p>}

        {/* Security / Privacy notice */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2">
          <ShieldCheck className="w-4 h-4 text-teal-600 dark:text-teal-400 flex-shrink-0" />
          <span>Your document is encrypted and analyzed solely for placement readiness evaluation.</span>
        </div>

        {/* Action CTA */}
        <button
          onClick={() => file && !extracting && resumeText.trim() && setAnalyzing(true)}
          disabled={!file || extracting || !resumeText.trim()}
          className="w-full py-3 rounded-lg bg-teal-600 hover:bg-teal-700 disabled:opacity-40 disabled:pointer-events-none text-white text-sm font-semibold shadow-sm transition-all flex items-center justify-center gap-2"
        >
          <span>{extracting ? "Reading resume..." : "Run Resume Scan"}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="rounded-xl border border-teal-500/25 bg-teal-500/5 p-6 md:p-8 space-y-4"><div className="flex items-start gap-4"><div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-600 text-white"><ShieldCheck className="w-5 h-5" /></div><div><h2 className="text-lg font-bold">Defend Your Resume</h2><p className="mt-1 text-sm text-muted-foreground">Upload your resume first. You have 10 minutes to answer questions generated from its projects, skills, internship, achievements, and certifications.</p></div></div>{extractionError && <p className="text-sm font-medium text-rose-500">{extractionError}</p>}<button onClick={startDefense} disabled={!resumeText || extracting} className="inline-flex items-center gap-2 rounded-lg bg-foreground px-4 py-2.5 text-sm font-semibold text-background transition hover:opacity-90 disabled:pointer-events-none disabled:opacity-40">{extracting ? "Reading resume..." : "Start defense mode"} <ArrowRight className="w-4 h-4" /></button></div>
    </div>
  );
}