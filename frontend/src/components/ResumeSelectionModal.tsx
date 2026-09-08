import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  FileText,
  X,
  Check,
  Plus,
  UploadCloud,
  Loader2,
  Calendar,
  Briefcase,
  Sparkles,
  BarChart3,
  Wand2,
  ShieldCheck,
  FileSearch,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ResumeSummary } from "@/api/resumeApi";

export type ResumeFeatureType = "ats" | "improve" | "defend" | "customize";

interface ResumeSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (selectedResume: ResumeSummary) => void;
  feature: ResumeFeatureType;
  resumes: ResumeSummary[];
  isLoadingResumes?: boolean;
  onCreateNewResume?: () => void;
  onImportResume?: () => void;
}

const FEATURE_CONFIG: Record<
  ResumeFeatureType,
  {
    title: string;
    icon: React.ElementType;
    accentClass: string;
    borderClass: string;
    bgClass: string;
    radioClass: string;
    buttonClass: string;
  }
> = {
  ats: {
    title: "Select a Resume for ATS Analysis",
    icon: BarChart3,
    accentClass: "text-purple-400",
    borderClass: "border-purple-500/50 shadow-[0_0_20px_rgba(168,85,247,0.2)] bg-purple-500/10",
    bgClass: "bg-purple-500/20 text-purple-300 border-purple-500/30",
    radioClass: "border-purple-400 bg-purple-500 text-white",
    buttonClass: "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-purple-500/20",
  },
  improve: {
    title: "Select a Resume to Improve",
    icon: Wand2,
    accentClass: "text-teal-400",
    borderClass: "border-teal-500/50 shadow-[0_0_20px_rgba(20,184,166,0.2)] bg-teal-500/10",
    bgClass: "bg-teal-500/20 text-teal-300 border-teal-500/30",
    radioClass: "border-teal-400 bg-teal-500 text-white",
    buttonClass: "bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 shadow-teal-500/20",
  },
  defend: {
    title: "Select a Resume to Defend",
    icon: ShieldCheck,
    accentClass: "text-blue-400",
    borderClass: "border-blue-500/50 shadow-[0_0_20px_rgba(59,130,246,0.2)] bg-blue-500/10",
    bgClass: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    radioClass: "border-blue-400 bg-blue-500 text-white",
    buttonClass: "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-blue-500/20",
  },
  customize: {
    title: "Select a Resume for Job Matching",
    icon: FileSearch,
    accentClass: "text-pink-400",
    borderClass: "border-pink-500/50 shadow-[0_0_20px_rgba(236,72,153,0.2)] bg-pink-500/10",
    bgClass: "bg-pink-500/20 text-pink-300 border-pink-500/30",
    radioClass: "border-pink-400 bg-pink-500 text-white",
    buttonClass: "bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 shadow-pink-500/20",
  },
};

export const ResumeSelectionModal: React.FC<ResumeSelectionModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  feature,
  resumes,
  isLoadingResumes = false,
  onCreateNewResume,
  onImportResume,
}) => {
  const [selectedResumeId, setSelectedResumeId] = useState<string | null>(null);

  // Reset selection when modal opens or resumes list changes
  useEffect(() => {
    if (isOpen) {
      if (resumes && resumes.length > 0) {
        setSelectedResumeId(resumes[0].id);
      } else {
        setSelectedResumeId(null);
      }
    }
  }, [isOpen, resumes]);

  if (!isOpen) return null;

  const config = FEATURE_CONFIG[feature] || FEATURE_CONFIG.ats;
  const FeatureIcon = config.icon;
  const selectedResume = resumes.find((r) => r.id === selectedResumeId);

  const handleContinue = () => {
    if (selectedResume) {
      onConfirm(selectedResume);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[10000] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="bg-[#0B0E22] border border-border rounded-3xl max-w-2xl w-full p-6 space-y-6 shadow-2xl animate-in zoom-in-95 my-auto">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-border/80 pb-4">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "w-10 h-10 rounded-2xl flex items-center justify-center border bg-secondary/50",
                config.bgClass
              )}
            >
              <FeatureIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">{config.title}</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Choose the resume you want to use for this analysis.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        {isLoadingResumes ? (
          <div className="flex items-center justify-center p-12 space-y-3">
            <Loader2 className="w-6 h-6 text-purple-400 animate-spin mr-2" />
            <span className="text-xs font-semibold text-muted-foreground">Loading saved resumes...</span>
          </div>
        ) : resumes.length === 0 ? (
          /* Empty State */
          <div className="p-8 border border-dashed border-border/80 bg-secondary/20 rounded-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mx-auto">
              <FileText className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-foreground">No saved resumes yet.</h3>
              <p className="text-xs text-muted-foreground max-w-md mx-auto">
                Create or import a resume first to use this feature.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              {onImportResume && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onImportResume();
                  }}
                  className="px-4 py-2.5 rounded-xl bg-purple-600/90 hover:bg-purple-600 text-white text-xs font-bold transition-all shadow-md flex items-center gap-2"
                >
                  <UploadCloud className="w-4 h-4" />
                  <span>Add Resume</span>
                </button>
              )}
              {onCreateNewResume && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onCreateNewResume();
                  }}
                  className="px-4 py-2.5 rounded-xl bg-secondary hover:bg-secondary/80 border border-border text-foreground text-xs font-bold transition-all flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create New Resume</span>
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Resumes Selection List */
          <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
            {resumes.map((res) => {
              const isSelected = res.id === selectedResumeId;
              const formattedDate = res.updated_at
                ? `Updated ${new Date(res.updated_at).toLocaleDateString()}`
                : "Updated recently";

              return (
                <div
                  key={res.id}
                  onClick={() => setSelectedResumeId(res.id)}
                  className={cn(
                    "group relative flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer select-none space-x-4",
                    isSelected
                      ? config.borderClass
                      : "border-border/60 bg-card/60 hover:bg-card hover:border-border"
                  )}
                >
                  <div className="flex items-center gap-3.5 min-w-0 flex-1">
                    {/* Radio Button Circle */}
                    <div
                      className={cn(
                        "w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-colors",
                        isSelected
                          ? config.radioClass
                          : "border-muted-foreground/40 bg-transparent group-hover:border-foreground/60"
                      )}
                    >
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>

                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-foreground truncate">{res.name}</h4>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-secondary text-muted-foreground border border-border/40 shrink-0 uppercase">
                          {res.template || "Modern"}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                        {res.target_role && (
                          <span className="flex items-center gap-1">
                            <Briefcase className="w-3 h-3 text-purple-400" />
                            {res.target_role}
                          </span>
                        )}
                        {res.experience_level && (
                          <span>• {res.experience_level}</span>
                        )}
                        <span className="flex items-center gap-1 text-[11px] text-muted-foreground/80">
                          <Calendar className="w-3 h-3 text-muted-foreground/60" />
                          {formattedDate}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Completion badge */}
                  <div className="shrink-0 text-right space-y-1">
                    <span className="text-xs font-bold text-purple-400">
                      {res.completion_percentage}% complete
                    </span>
                    <div className="w-16 h-1.5 rounded-full bg-secondary overflow-hidden">
                      <div
                        className="h-full bg-purple-500 rounded-full"
                        style={{ width: `${res.completion_percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/80">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-xs font-bold text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
          >
            Cancel
          </button>

          {resumes.length > 0 && (
            <button
              type="button"
              disabled={!selectedResumeId}
              onClick={handleContinue}
              className={cn(
                "px-6 py-2.5 rounded-xl text-white text-xs font-bold flex items-center gap-2 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed",
                config.buttonClass
              )}
            >
              <span>Continue</span>
              <Sparkles className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};
