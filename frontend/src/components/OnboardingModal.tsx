import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { API_URL, getAuthHeaders } from "@/config";

import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  GraduationCap,
  Code2,
  Brain,
  Target,
  Clock,
  Layers,
  FileText,
  Briefcase,
  X,
} from "lucide-react";

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export default function OnboardingModal({ isOpen, onClose, onComplete }: OnboardingModalProps) {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // 12 Dimensions of Learner Profile
  const [academicYear, setAcademicYear] = useState("3rd Year");
  const [careerGoal, setCareerGoal] = useState("Software Developer");
  const [targetCompanyType, setTargetCompanyType] = useState("Product");
  const [programmingLevel, setProgrammingLevel] = useState("Beginner");
  const [dsaLevel, setDsaLevel] = useState("Beginner");
  const [aptitudeLevel, setAptitudeLevel] = useState("Beginner");
  const [coreCsLevel, setCoreCsLevel] = useState("Not started");
  const [preferredLanguages, setPreferredLanguages] = useState<string[]>(["Python", "Java"]);
  const [projectsCount, setProjectsCount] = useState("Learning");
  const [hasResume, setHasResume] = useState("I don't have one yet");
  const [previousPrep, setPreviousPrep] = useState("None");
  const [availableHours, setAvailableHours] = useState(10);

  const toggleLanguage = (lang: string) => {
    if (preferredLanguages.includes(lang)) {
      if (preferredLanguages.length > 1) {
        setPreferredLanguages(preferredLanguages.filter((l) => l !== lang));
      }
    } else {
      setPreferredLanguages([...preferredLanguages, lang]);
    }
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/onboarding/submit`, {
        method: "POST",
        headers: getAuthHeaders(true),
        body: JSON.stringify({

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
        }),
      });

      if (res.ok) {
        onComplete();
      }
    } catch (err) {
      console.error("Failed to save onboarding profile:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-card border border-border rounded-3xl shadow-2xl overflow-hidden my-8">
        {/* Header with Progress Bar */}
        <div className="px-6 py-5 border-b border-border bg-secondary/30 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-foreground">Welcome to PlaceMentor AI</h2>
              <p className="text-[11px] text-muted-foreground">Step {step} of 3 — Personalize Your Placement Journey</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-mono font-bold text-purple-600 dark:text-purple-400">{Math.round((step / 3) * 100)}%</span>
          </div>
        </div>

        {/* Progress Line */}
        <div className="w-full bg-secondary h-1">
          <div
            className="bg-gradient-to-r from-purple-600 to-indigo-500 h-1 transition-all duration-300"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        {/* Step Content */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* STEP 1: Academic & Career Goals */}
          {step === 1 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="space-y-1">
                <h3 className="text-base font-bold text-foreground">Academic Status & Career Direction</h3>
                <p className="text-xs text-muted-foreground">
                  Academic year sets timeline urgency; your starting skill is evaluated independently.
                </p>
              </div>

              {/* 1. Academic Year */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-purple-500" /> Current Academic Year
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {["1st Year", "2nd Year", "3rd Year", "Final Year", "Graduate"].map((yr) => (
                    <button
                      key={yr}
                      type="button"
                      onClick={() => setAcademicYear(yr)}
                      className={`p-2.5 rounded-xl border text-xs font-semibold transition-all text-left ${
                        academicYear === yr
                          ? "border-purple-500 bg-purple-500/15 text-purple-700 dark:text-purple-300 shadow-sm"
                          : "border-border bg-card hover:bg-secondary/60 text-muted-foreground"
                      }`}
                    >
                      {yr}
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Career Goal */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-indigo-500" /> Target Career Role
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    "Software Developer",
                    "Full Stack Developer",
                    "Data Analyst",
                    "AI/ML Engineer",
                    "Cloud Engineer",
                    "Cybersecurity",
                    "QA/Testing",
                    "Other",
                  ].map((role) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => setCareerGoal(role)}
                      className={`p-2.5 rounded-xl border text-xs font-semibold transition-all text-left ${
                        careerGoal === role
                          ? "border-indigo-500 bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 shadow-sm"
                          : "border-border bg-card hover:bg-secondary/60 text-muted-foreground"
                      }`}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Target Company Type */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-emerald-500" /> Target Company Type
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {["Product (Tier-1)", "Service / IT", "High-Growth Startup", "Any", "Not sure"].map((comp) => (
                    <button
                      key={comp}
                      type="button"
                      onClick={() => setTargetCompanyType(comp)}
                      className={`p-2.5 rounded-xl border text-xs font-semibold transition-all text-left ${
                        targetCompanyType === comp
                          ? "border-emerald-500 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 shadow-sm"
                          : "border-border bg-card hover:bg-secondary/60 text-muted-foreground"
                      }`}
                    >
                      {comp}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Skill Baseline Self-Assessment */}
          {step === 2 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="space-y-1">
                <h3 className="text-base font-bold text-foreground">Current Knowledge Baseline</h3>
                <p className="text-xs text-muted-foreground">
                  Select your current comfort level. If you are unsure, pick "Not sure" — diagnostics will establish your exact skill.
                </p>
              </div>

              {/* 4. Programming Level */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <Code2 className="w-3.5 h-3.5 text-purple-500" /> General Programming Experience
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {["Never coded", "Beginner", "Basic", "Intermediate", "Advanced", "Not sure"].map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setProgrammingLevel(lvl)}
                      className={`p-2 rounded-xl border text-xs font-semibold transition-all text-left ${
                        programmingLevel === lvl
                          ? "border-purple-500 bg-purple-500/15 text-purple-700 dark:text-purple-300"
                          : "border-border bg-card hover:bg-secondary/60 text-muted-foreground"
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              {/* 5. DSA Level */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <Brain className="w-3.5 h-3.5 text-amber-500" /> Data Structures & Algorithms (DSA)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {["Never learned", "Beginner", "Basic", "Intermediate", "Advanced", "Not sure"].map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setDsaLevel(lvl)}
                      className={`p-2 rounded-xl border text-xs font-semibold transition-all text-left ${
                        dsaLevel === lvl
                          ? "border-amber-500 bg-amber-500/15 text-amber-700 dark:text-amber-400"
                          : "border-border bg-card hover:bg-secondary/60 text-muted-foreground"
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              {/* 6. Aptitude Level */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-teal-500" /> Quantitative & Logical Aptitude
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {["Not started", "Beginner", "Basic", "Intermediate", "Advanced", "Not sure"].map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setAptitudeLevel(lvl)}
                      className={`p-2 rounded-xl border text-xs font-semibold transition-all text-left ${
                        aptitudeLevel === lvl
                          ? "border-teal-500 bg-teal-500/15 text-teal-700 dark:text-teal-400"
                          : "border-border bg-card hover:bg-secondary/60 text-muted-foreground"
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              {/* 7. Core CS Level */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <Brain className="w-3.5 h-3.5 text-blue-500" /> Core CS (OS, DBMS, Networks, OOP)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {["Not started", "Beginner", "Basic", "Intermediate", "Advanced", "Not sure"].map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setCoreCsLevel(lvl)}
                      className={`p-2 rounded-xl border text-xs font-semibold transition-all text-left ${
                        coreCsLevel === lvl
                          ? "border-blue-500 bg-blue-500/15 text-blue-700 dark:text-blue-400"
                          : "border-border bg-card hover:bg-secondary/60 text-muted-foreground"
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              {/* 8. Preferred Languages */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-foreground">Preferred Programming Languages (Select all that apply)</label>
                <div className="flex flex-wrap gap-2">
                  {["Python", "Java", "C++", "C", "JavaScript", "SQL"].map((lang) => {
                    const isSelected = preferredLanguages.includes(lang);
                    return (
                      <button
                        key={lang}
                        type="button"
                        onClick={() => toggleLanguage(lang)}
                        className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                          isSelected
                            ? "border-purple-500 bg-purple-500/15 text-purple-700 dark:text-purple-300"
                            : "border-border bg-card hover:bg-secondary text-muted-foreground"
                        }`}
                      >
                        {isSelected ? "✓ " : "+ "}
                        {lang}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Experience, Preparation & Time Commitment */}
          {step === 3 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="space-y-1">
                <h3 className="text-base font-bold text-foreground">Projects & Preparation Schedule</h3>
                <p className="text-xs text-muted-foreground">
                  Helps calculate your roadmap milestones and personalized recommendations pace.
                </p>
              </div>

              {/* 9. Projects */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-foreground">Completed Engineering Projects</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {["None", "Learning", "1 Project", "2+ Projects"].map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setProjectsCount(p)}
                      className={`p-2.5 rounded-xl border text-xs font-semibold transition-all text-left ${
                        projectsCount === p
                          ? "border-purple-500 bg-purple-500/15 text-purple-700 dark:text-purple-300"
                          : "border-border bg-card hover:bg-secondary/60 text-muted-foreground"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* 10. Resume Status */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-purple-500" /> Resume Status
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {["I have a resume", "I don't have one yet"].map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setHasResume(r)}
                      className={`p-2.5 rounded-xl border text-xs font-semibold transition-all text-left ${
                        hasResume === r
                          ? "border-purple-500 bg-purple-500/15 text-purple-700 dark:text-purple-300"
                          : "border-border bg-card hover:bg-secondary/60 text-muted-foreground"
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {/* 11. Previous Prep */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-foreground">Previous Placement Preparation</label>
                <div className="grid grid-cols-3 gap-2">
                  {["None", "Some", "Regular"].map((prep) => (
                    <button
                      key={prep}
                      type="button"
                      onClick={() => setPreviousPrep(prep)}
                      className={`p-2.5 rounded-xl border text-xs font-semibold transition-all text-left ${
                        previousPrep === prep
                          ? "border-indigo-500 bg-indigo-500/15 text-indigo-700 dark:text-indigo-300"
                          : "border-border bg-card hover:bg-secondary/60 text-muted-foreground"
                      }`}
                    >
                      {prep}
                    </button>
                  ))}
                </div>
              </div>

              {/* 12. Available Hours / Week */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-500" /> Available Hours per Week
                  </label>
                  <span className="text-xs font-mono font-bold text-purple-600 dark:text-purple-400">{availableHours} hrs/week</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="40"
                  step="2"
                  value={availableHours}
                  onChange={(e) => setAvailableHours(parseInt(e.target.value))}
                  className="w-full accent-purple-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-muted-foreground">
                  <span>2 hrs (Casual)</span>
                  <span>10 hrs (Recommended)</span>
                  <span>40 hrs (Intensive)</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation Controls */}
        <div className="px-6 py-4 border-t border-border bg-secondary/20 flex items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 rounded-xl border border-border text-xs font-semibold hover:bg-secondary text-foreground transition-colors"
            >
              Back
            </button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-1.5"
            >
              Continue <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              disabled={loading}
              onClick={handleSaveProfile}
              className="px-6 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-1.5 disabled:opacity-50"
            >
              {loading ? "Establishing Profile..." : "Launch PlaceMentor"} <CheckCircle2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
