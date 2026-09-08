import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { API_URL, getAuthHeaders, getAuthToken } from "@/config";
import {
  User as UserIcon,
  Mail,
  GraduationCap,
  Briefcase,
  Github,
  Linkedin,
  Globe,
  MapPin,
  Edit3,
  Check,
  X,
  Code2,
  FileText,
  Sparkles,
  Trophy,
  Plus,
  Compass,
  Phone,
  Calendar,
  Building2,
  Layers,
  AlertCircle,
  Loader2,
  Camera,
  Image as ImageIcon,
  Key,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  Award,
  Zap,
} from "lucide-react";

/**
 * Resolves media URLs (avatars/banners) to properly point to FastAPI static uploads
 * or external URLs / base64 data URLs.
 */
export function getMediaUrl(url?: string): string {
  if (!url) return "";
  const trimmed = url.trim();
  if (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("data:") ||
    trimmed.startsWith("blob:")
  ) {
    return trimmed;
  }
  if (trimmed.startsWith("/")) {
    return API_URL ? `${API_URL}${trimmed}` : trimmed;
  }
  return API_URL ? `${API_URL}/${trimmed}` : `/${trimmed}`;
}

export default function Profile() {
  const { user, updateUser } = useAuth();

  // Modal states
  const [isEditing, setIsEditing] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);

  // Statistics & Readiness
  const [readinessData, setReadinessData] = useState<any>(null);
  const [brainProgress, setBrainProgress] = useState<any>(null);
  const [problemStats, setProblemStats] = useState<any>(null);
  const [loadingStats, setLoadingStats] = useState(true);

  // Image load error fallbacks
  const [avatarError, setAvatarError] = useState(false);
  const [bannerError, setBannerError] = useState(false);

  // Profile Save state machine
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Password state machine
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Avatar / Banner Upload state
  const [avatarUrlInput, setAvatarUrlInput] = useState("");
  const [bannerUrlInput, setBannerUrlInput] = useState("");
  const [isUploadingMedia, setIsUploadingMedia] = useState(false);
  const [mediaError, setMediaError] = useState<string | null>(null);
  const avatarFileInputRef = useRef<HTMLInputElement>(null);
  const bannerFileInputRef = useRef<HTMLInputElement>(null);

  // Form state initialized from authenticated user
  const [formData, setFormData] = useState({
    name: user?.name || user?.full_name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    dob: user?.dob || "",
    gender: user?.gender || "",
    college: user?.college || "",
    department: user?.department || "",
    year: user?.year || "",
    target_role: user?.target_role || "",
    target_company: user?.target_company || "",
    location: user?.location || "",
    website: user?.website || "",
    github: user?.github || "",
    linkedin: user?.linkedin || "",
    bio: user?.bio || "",
    programming_level: user?.programming_level || "",
    dsa_level: user?.dsa_level || "",
    aptitude_level: user?.aptitude_level || "",
    core_cs_level: user?.core_cs_level || "",
  });

  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");
  const [languages, setLanguages] = useState<string[]>([]);
  const [newLang, setNewLang] = useState("");

  // Hydrate form state whenever auth user updates
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || user.full_name || "",
        email: user.email || "",
        phone: user.phone || "",
        dob: user.dob || "",
        gender: user.gender || "",
        college: user.college || "",
        department: user.department || "",
        year: user.year || "",
        target_role: user.target_role || "",
        target_company: user.target_company || "",
        location: user.location || "",
        website: user.website || "",
        github: user.github || "",
        linkedin: user.linkedin || "",
        bio: user.bio || "",
        programming_level: user.programming_level || "",
        dsa_level: user.dsa_level || "",
        aptitude_level: user.aptitude_level || "",
        core_cs_level: user.core_cs_level || "",
      });
      setSkills(Array.isArray(user.skills) ? user.skills : []);
      setLanguages(Array.isArray(user.preferred_languages) ? user.preferred_languages : []);
      setAvatarError(false);
      setBannerError(false);
    }
  }, [user]);

  // Fetch genuine statistics for the user
  useEffect(() => {
    const fetchProfileStats = async () => {
      setLoadingStats(true);
      try {
        const headers = getAuthHeaders(true);
        const [rRes, bRes, sRes] = await Promise.all([
          fetch(`${API_URL}/api/readiness`, { headers }),
          fetch(`${API_URL}/api/brainzone/progress`, { headers }),
          fetch(`${API_URL}/api/problems/stats`, { headers }),
        ]);

        if (rRes.ok) {
          const rData = await rRes.json();
          setReadinessData(rData);
        }
        if (bRes.ok) {
          const bData = await bRes.json();
          setBrainProgress(bData);
        }
        if (sRes.ok) {
          const sData = await sRes.json();
          setProblemStats(sData);
        }
      } catch (err) {
        console.warn("Failed to load profile metrics:", err);
      } finally {
        setLoadingStats(false);
      }
    };

    fetchProfileStats();
  }, [user]);

  // Skill management
  const addSkill = () => {
    const trimmed = newSkill.trim();
    if (trimmed && !skills.includes(trimmed)) {
      const updated = [...skills, trimmed];
      setSkills(updated);
      setNewSkill("");
      if (!isEditing) {
        persistSkills(updated, languages);
      }
    }
  };

  const removeSkill = (skillToRemove: string) => {
    const updated = skills.filter((s) => s !== skillToRemove);
    setSkills(updated);
    if (!isEditing) {
      persistSkills(updated, languages);
    }
  };

  const addLanguage = () => {
    const trimmed = newLang.trim();
    if (trimmed && !languages.includes(trimmed)) {
      const updated = [...languages, trimmed];
      setLanguages(updated);
      setNewLang("");
      if (!isEditing) {
        persistSkills(skills, updated);
      }
    }
  };

  const removeLanguage = (langToRemove: string) => {
    const updated = languages.filter((l) => l !== langToRemove);
    setLanguages(updated);
    if (!isEditing) {
      persistSkills(skills, updated);
    }
  };

  const persistSkills = async (updatedSkills: string[], updatedLangs: string[]) => {
    try {
      const res = await fetch(`${API_URL}/api/users/me`, {
        method: "PATCH",
        headers: getAuthHeaders(true),
        body: JSON.stringify({
          skills: updatedSkills,
          preferred_languages: updatedLangs,
        }),
      });
      if (res.ok) {
        const savedUser = await res.json();
        updateUser({
          skills: savedUser.skills || updatedSkills,
          preferred_languages: savedUser.preferred_languages || updatedLangs,
        });
      }
    } catch (err) {
      console.warn("Failed to persist skills update:", err);
    }
  };

  // Full Profile Save handler
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    try {
      const payload = {
        name: formData.name.trim(),
        full_name: formData.name.trim(),
        phone: formData.phone.trim(),
        dob: formData.dob.trim(),
        gender: formData.gender.trim(),
        college: formData.college.trim(),
        department: formData.department.trim(),
        year: formData.year.trim(),
        target_role: formData.target_role.trim(),
        target_company: formData.target_company.trim(),
        location: formData.location.trim(),
        website: formData.website.trim(),
        github: formData.github.trim(),
        linkedin: formData.linkedin.trim(),
        bio: formData.bio.trim(),
        skills: skills,
        preferred_languages: languages,
        programming_level: formData.programming_level,
        dsa_level: formData.dsa_level,
        aptitude_level: formData.aptitude_level,
        core_cs_level: formData.core_cs_level,
      };

      const res = await fetch(`${API_URL}/api/users/me`, {
        method: "PATCH",
        headers: getAuthHeaders(true),
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.detail || "Failed to save profile changes.");
      }

      const updatedUserFromBackend = await res.json();

      updateUser({
        name: updatedUserFromBackend.name || updatedUserFromBackend.full_name || formData.name,
        full_name: updatedUserFromBackend.full_name || formData.name,
        phone: updatedUserFromBackend.phone || formData.phone,
        dob: updatedUserFromBackend.dob || formData.dob,
        gender: updatedUserFromBackend.gender || formData.gender,
        college: updatedUserFromBackend.college || formData.college,
        department: updatedUserFromBackend.department || formData.department,
        year: updatedUserFromBackend.year || formData.year,
        target_role: updatedUserFromBackend.target_role || formData.target_role,
        target_company: updatedUserFromBackend.target_company || formData.target_company,
        location: updatedUserFromBackend.location || formData.location,
        website: updatedUserFromBackend.website || formData.website,
        github: updatedUserFromBackend.github || formData.github,
        linkedin: updatedUserFromBackend.linkedin || formData.linkedin,
        bio: updatedUserFromBackend.bio || formData.bio,
        skills: updatedUserFromBackend.skills || skills,
        preferred_languages: updatedUserFromBackend.preferred_languages || languages,
        programming_level: updatedUserFromBackend.programming_level || formData.programming_level,
        dsa_level: updatedUserFromBackend.dsa_level || formData.dsa_level,
        aptitude_level: updatedUserFromBackend.aptitude_level || formData.aptitude_level,
        core_cs_level: updatedUserFromBackend.core_cs_level || formData.core_cs_level,
      });

      setSaveSuccess(true);
      setIsEditing(false);

      setTimeout(() => {
        setSaveSuccess(false);
      }, 4000);
    } catch (err: any) {
      setSaveError(err.message || "An error occurred while saving profile.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        name: user.name || user.full_name || "",
        email: user.email || "",
        phone: user.phone || "",
        dob: user.dob || "",
        gender: user.gender || "",
        college: user.college || "",
        department: user.department || "",
        year: user.year || "",
        target_role: user.target_role || "",
        target_company: user.target_company || "",
        location: user.location || "",
        website: user.website || "",
        github: user.github || "",
        linkedin: user.linkedin || "",
        bio: user.bio || "",
        programming_level: user.programming_level || "",
        dsa_level: user.dsa_level || "",
        aptitude_level: user.aptitude_level || "",
        core_cs_level: user.core_cs_level || "",
      });
      setSkills(Array.isArray(user.skills) ? user.skills : []);
      setLanguages(Array.isArray(user.preferred_languages) ? user.preferred_languages : []);
    }
    setSaveError(null);
    setIsEditing(false);
  };

  // Change Password Handler
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(false);

    if (newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }

    setIsChangingPassword(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/change-password`, {
        method: "POST",
        headers: getAuthHeaders(true),
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.detail || "Failed to update password.");
      }

      setPasswordSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => {
        setIsPasswordModalOpen(false);
        setPasswordSuccess(false);
      }, 2000);
    } catch (err: any) {
      setPasswordError(err.message || "An error occurred while changing password.");
    } finally {
      setIsChangingPassword(false);
    }
  };

  // Avatar Upload / URL Handler
  const handleAvatarFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingMedia(true);
    setMediaError(null);

    try {
      const formDataUpload = new FormData();
      formDataUpload.append("avatar_file", file);

      const token = getAuthToken();
      const res = await fetch(`${API_URL}/api/users/me/avatar`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formDataUpload,
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.detail || "Failed to upload avatar.");
      }

      const updatedUser = await res.json();
      updateUser({ avatar: updatedUser.avatar });
      setAvatarError(false);
      setIsAvatarModalOpen(false);
    } catch (err: any) {
      setMediaError(err.message || "Failed to upload avatar image.");
    } finally {
      setIsUploadingMedia(false);
    }
  };

  const handleAvatarUrlSave = async () => {
    if (!avatarUrlInput.trim()) return;
    setIsUploadingMedia(true);
    setMediaError(null);

    try {
      const res = await fetch(`${API_URL}/api/users/me/avatar`, {
        method: "POST",
        headers: getAuthHeaders(true),
        body: JSON.stringify({ avatar_url: avatarUrlInput.trim() }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.detail || "Failed to save avatar URL.");
      }

      const updatedUser = await res.json();
      updateUser({ avatar: updatedUser.avatar });
      setAvatarError(false);
      setAvatarUrlInput("");
      setIsAvatarModalOpen(false);
    } catch (err: any) {
      setMediaError(err.message || "Failed to save avatar URL.");
    } finally {
      setIsUploadingMedia(false);
    }
  };

  const handleRemoveAvatar = async () => {
    setIsUploadingMedia(true);
    setMediaError(null);
    try {
      const res = await fetch(`${API_URL}/api/users/me/avatar`, {
        method: "DELETE",
        headers: getAuthHeaders(true),
      });
      if (res.ok) {
        const updatedUser = await res.json();
        updateUser({ avatar: updatedUser.avatar || "" });
        setAvatarError(false);
        setIsAvatarModalOpen(false);
      }
    } catch (err) {
      console.warn("Failed to remove avatar:", err);
    } finally {
      setIsUploadingMedia(false);
    }
  };

  // Banner Upload / URL Handler
  const handleBannerFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingMedia(true);
    setMediaError(null);

    try {
      const formDataUpload = new FormData();
      formDataUpload.append("banner_file", file);

      const token = getAuthToken();
      const res = await fetch(`${API_URL}/api/users/me/banner`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formDataUpload,
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.detail || "Failed to upload banner.");
      }

      const updatedUser = await res.json();
      updateUser({ banner_image: updatedUser.banner_image });
      setBannerError(false);
      setIsBannerModalOpen(false);
    } catch (err: any) {
      setMediaError(err.message || "Failed to upload banner image.");
    } finally {
      setIsUploadingMedia(false);
    }
  };

  const handleBannerUrlSave = async () => {
    if (!bannerUrlInput.trim()) return;
    setIsUploadingMedia(true);
    setMediaError(null);

    try {
      const res = await fetch(`${API_URL}/api/users/me/banner`, {
        method: "POST",
        headers: getAuthHeaders(true),
        body: JSON.stringify({ banner_url: bannerUrlInput.trim() }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.detail || "Failed to save banner URL.");
      }

      const updatedUser = await res.json();
      updateUser({ banner_image: updatedUser.banner_image });
      setBannerError(false);
      setBannerUrlInput("");
      setIsBannerModalOpen(false);
    } catch (err: any) {
      setMediaError(err.message || "Failed to save banner URL.");
    } finally {
      setIsUploadingMedia(false);
    }
  };

  const handleRemoveBanner = async () => {
    setIsUploadingMedia(true);
    setMediaError(null);
    try {
      const res = await fetch(`${API_URL}/api/users/me/banner`, {
        method: "DELETE",
        headers: getAuthHeaders(true),
      });
      if (res.ok) {
        const updatedUser = await res.json();
        updateUser({ banner_image: updatedUser.banner_image || "" });
        setBannerError(false);
        setIsBannerModalOpen(false);
      }
    } catch (err) {
      console.warn("Failed to remove banner:", err);
    } finally {
      setIsUploadingMedia(false);
    }
  };

  const userLevel = brainProgress?.player_level || user?.level || 1;
  const userXp = brainProgress?.xp || user?.xp || 0;
  const hasReadiness = readinessData?.has_sufficient_data;
  const readinessScore = hasReadiness ? readinessData.overall_readiness : null;
  const solvedCount = problemStats?.solved_count || 0;
  const attemptedCount = problemStats?.attempted_count || 0;

  const displayName = formData.name || user?.name || user?.full_name || "Student Candidate";
  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "PM";

  const resolvedAvatarUrl = user?.avatar ? getMediaUrl(user.avatar) : "";
  const resolvedBannerUrl = user?.banner_image ? getMediaUrl(user.banner_image) : "";

  return (
    <div className="space-y-6 font-sans text-foreground">
      {/* Save Success Toast Banner */}
      {saveSuccess && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center gap-3 text-xs font-semibold animate-fade-in shadow-sm">
          <Check className="w-4 h-4 shrink-0 text-emerald-400" />
          <span>Profile updated and permanently saved to your account!</span>
        </div>
      )}

      {/* Save Error Banner */}
      {saveError && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center gap-3 text-xs font-semibold animate-fade-in shadow-sm">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{saveError}</span>
        </div>
      )}

      {/* =========================================================================
          PROFILE HEADER HERO WITH BANNER & AVATAR
         ========================================================================= */}
      <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
        {/* Cover / Banner Section */}
        <div
          className="relative h-36 sm:h-48 w-full bg-gradient-to-r from-purple-900/40 via-indigo-900/30 to-background border-b border-border flex items-end justify-end p-4 bg-cover bg-center transition-all duration-300"
          style={
            resolvedBannerUrl && !bannerError
              ? {
                  backgroundImage: `url("${resolvedBannerUrl}")`,
                }
              : undefined
          }
        >
          {resolvedBannerUrl && (
            <img
              src={resolvedBannerUrl}
              alt="Cover preview"
              className="hidden"
              onError={() => setBannerError(true)}
              onLoad={() => setBannerError(false)}
            />
          )}

          <button
            onClick={() => setIsBannerModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-background/80 hover:bg-background backdrop-blur-md border border-border text-foreground text-[11px] font-semibold transition-all shadow-md cursor-pointer"
          >
            <ImageIcon className="w-3.5 h-3.5 text-purple-400" />
            <span>{user?.banner_image ? "Change Cover" : "Add Cover Banner"}</span>
          </button>
        </div>

        {/* Profile Details Bar - Completely Centered Layout */}
        <div className="px-6 pb-6 sm:px-8 sm:pb-8 pt-0 space-y-5">
          {/* Avatar Centered Overlapping Banner */}
          <div className="flex justify-center">
            <div className="relative group shrink-0 -mt-14 sm:-mt-16 z-10">
              {resolvedAvatarUrl && !avatarError ? (
                <img
                  src={resolvedAvatarUrl}
                  alt={displayName}
                  onError={() => setAvatarError(true)}
                  onLoad={() => setAvatarError(false)}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl border-4 border-card object-cover shadow-xl bg-card"
                />
              ) : (
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl border-4 border-card bg-purple-500/10 flex items-center justify-center font-bold text-2xl sm:text-3xl text-purple-600 dark:text-purple-400 font-display shadow-xl">
                  {initials}
                </div>
              )}
              <button
                onClick={() => setIsAvatarModalOpen(true)}
                className="absolute inset-0 rounded-2xl bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity duration-200 cursor-pointer z-20"
                title="Update profile photo"
              >
                <Camera className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* User Identity Details - Centered */}
          <div className="flex flex-col items-center text-center space-y-2">
            <div className="flex items-center justify-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">{displayName}</h1>
              {formData.gender && (
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-secondary border border-border text-muted-foreground font-medium">
                  {formData.gender}
                </span>
              )}
            </div>

            <p className="text-xs sm:text-sm text-muted-foreground font-medium">
              {formData.target_role ? formData.target_role : "Target Role: Not set"}
              {formData.target_company ? ` • ${formData.target_company}` : ""}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 text-xs text-muted-foreground pt-1">
              <span className="flex items-center gap-1 font-mono text-purple-400 font-semibold px-2 py-0.5 rounded-lg bg-purple-500/10 border border-purple-500/20">
                <Sparkles className="w-3.5 h-3.5" /> Level {userLevel}
              </span>
              <span className="font-mono text-foreground px-2 py-0.5 rounded-lg bg-secondary border border-border">
                {userXp} XP
              </span>
              <span className="font-mono text-emerald-400 px-2 py-0.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                {solvedCount} Solved
              </span>
              <span className="font-mono text-indigo-400 px-2 py-0.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
                {attemptedCount} Attempts
              </span>
            </div>

            {/* Profile Action Buttons - Centered */}
            <div className="flex items-center justify-center gap-2.5 pt-2">
              <button
                onClick={() => setIsPasswordModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-border bg-secondary/70 hover:bg-secondary text-xs font-semibold text-foreground transition-colors shadow-sm cursor-pointer"
                title="Manage Account Password"
              >
                <Key className="w-3.5 h-3.5 text-amber-400" />
                <span>Password</span>
              </button>
              <button
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold transition-all shadow-sm cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Profile</span>
              </button>
            </div>
          </div>

          {/* Biography with Honest Empty State - Centered */}
          <div className="pt-3 border-t border-border text-center">
            {formData.bio ? (
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                {formData.bio}
              </p>
            ) : (
              <p className="text-xs text-muted-foreground/70 italic flex items-center justify-center gap-1.5">
                <span>Add a short bio to describe your placement goals and engineering interests.</span>
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-purple-400 underline hover:text-purple-300 not-italic font-medium cursor-pointer"
                >
                  Edit bio
                </button>
              </p>
            )}
          </div>

          {/* Key Identity Attributes Grid - Centered Wrap */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 pt-2 text-xs text-muted-foreground border-t border-border/50">
            <div className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-purple-400 shrink-0" />
              <span>{formData.email || "No email"}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5 text-purple-400 shrink-0" />
              <span>
                {formData.department ? formData.department : "Department: Not added"}
                {formData.year ? ` (${formData.year})` : ""}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-purple-400 shrink-0" />
              <span>{formData.college || "College: Not added"}</span>
            </div>
            <div className="flex items-center gap-3">
              {formData.github ? (
                <a
                  href={formData.github.startsWith("http") ? formData.github : `https://${formData.github}`}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-purple-400 flex items-center gap-1 transition-colors"
                >
                  <Github className="w-3.5 h-3.5 text-purple-400" /> GitHub
                </a>
              ) : (
                <span className="flex items-center gap-1 opacity-40">
                  <Github className="w-3.5 h-3.5" /> Not linked
                </span>
              )}
              {formData.linkedin ? (
                <a
                  href={formData.linkedin.startsWith("http") ? formData.linkedin : `https://${formData.linkedin}`}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-purple-400 flex items-center gap-1 transition-colors"
                >
                  <Linkedin className="w-3.5 h-3.5 text-purple-400" /> LinkedIn
                </a>
              ) : (
                <span className="flex items-center gap-1 opacity-40">
                  <Linkedin className="w-3.5 h-3.5" /> Not linked
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          SECTION 2: SKILLS, LEARNING MATRIX & SCREENING STATUS
         ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Technical Skills, Languages & Learning Levels */}
        <div className="lg:col-span-8 space-y-6">
          {/* Card 1: Verified Technical Skills */}
          <div className="p-5 rounded-2xl border border-border bg-card space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-purple-400" />
                <h2 className="text-sm font-bold text-foreground">Verified Technical Skills</h2>
              </div>
              <span className="text-xs font-mono text-muted-foreground">
                {skills.length} {skills.length === 1 ? "skill" : "skills"}
              </span>
            </div>

            {skills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-secondary border border-border text-xs font-medium text-foreground"
                  >
                    {skill}
                    <button
                      onClick={() => removeSkill(skill)}
                      className="text-muted-foreground hover:text-rose-400 transition-colors cursor-pointer"
                      title="Remove skill"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-secondary/30 border border-dashed border-border text-center text-xs text-muted-foreground space-y-1">
                <p>No skills added yet.</p>
                <p className="text-[11px] opacity-75">Add your technologies (e.g. React, Node.js, DSA, System Design, SQL) below.</p>
              </div>
            )}

            <div className="flex items-center gap-2 pt-2">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                placeholder="Add a technical skill (e.g. Docker, Redis, SQL, Spring Boot)..."
                className="flex-1 px-3.5 py-2 rounded-xl border border-border bg-secondary/50 text-foreground text-xs placeholder:text-muted-foreground focus:outline-none focus:border-purple-500"
              />
              <button
                onClick={addSkill}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center gap-1 transition-all shrink-0 shadow-sm cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add Skill
              </button>
            </div>
          </div>

          {/* Card 2: Preferred Programming Languages */}
          <div className="p-5 rounded-2xl border border-border bg-card space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-400" />
                <h2 className="text-sm font-bold text-foreground">Preferred Programming Languages</h2>
              </div>
              <span className="text-xs font-mono text-muted-foreground">
                {languages.length} {languages.length === 1 ? "language" : "languages"}
              </span>
            </div>

            {languages.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {languages.map((lang) => (
                  <span
                    key={lang}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-purple-500/10 border border-purple-500/20 text-xs font-medium text-purple-600 dark:text-purple-300"
                  >
                    {lang}
                    <button
                      onClick={() => removeLanguage(lang)}
                      className="text-muted-foreground hover:text-rose-400 transition-colors cursor-pointer"
                      title="Remove language"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-secondary/30 border border-dashed border-border text-center text-xs text-muted-foreground space-y-1">
                <p>No preferred programming languages specified.</p>
                <p className="text-[11px] opacity-75">Add languages you solve problems in (e.g. Python, Java, C++, JavaScript).</p>
              </div>
            )}

            <div className="flex items-center gap-2 pt-2">
              <input
                type="text"
                value={newLang}
                onChange={(e) => setNewLang(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addLanguage())}
                placeholder="Add a language (e.g. Python, Java, C++, TypeScript)..."
                className="flex-1 px-3.5 py-2 rounded-xl border border-border bg-secondary/50 text-foreground text-xs placeholder:text-muted-foreground focus:outline-none focus:border-purple-500"
              />
              <button
                onClick={addLanguage}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1 transition-all shrink-0 shadow-sm cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add Language
              </button>
            </div>
          </div>

          {/* Card 3: Learning Matrix Levels */}
          <div className="p-5 rounded-2xl border border-border bg-card space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-emerald-400" />
                <h2 className="text-sm font-bold text-foreground">Learning Competency Matrix</h2>
              </div>
              <button
                onClick={() => setIsEditing(true)}
                className="text-xs text-purple-400 hover:underline font-medium cursor-pointer"
              >
                Configure
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-secondary/40 border border-border space-y-1">
                <span className="text-[11px] text-muted-foreground font-medium">Programming</span>
                <p className="font-bold text-foreground capitalize">
                  {formData.programming_level || "Not Assessed"}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-secondary/40 border border-border space-y-1">
                <span className="text-[11px] text-muted-foreground font-medium">DSA / Algorithms</span>
                <p className="font-bold text-foreground capitalize">
                  {formData.dsa_level || "Not Assessed"}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-secondary/40 border border-border space-y-1">
                <span className="text-[11px] text-muted-foreground font-medium">Aptitude</span>
                <p className="font-bold text-foreground capitalize">
                  {formData.aptitude_level || "Not Assessed"}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-secondary/40 border border-border space-y-1">
                <span className="text-[11px] text-muted-foreground font-medium">Core CS</span>
                <p className="font-bold text-foreground capitalize">
                  {formData.core_cs_level || "Not Assessed"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Placement Readiness & Career Profile */}
        <div className="lg:col-span-4 space-y-6">
          {/* Placement Screening Index */}
          <div className="p-5 rounded-2xl border border-border bg-card space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-foreground">Placement Screening Status</h3>
              <Zap className="w-4 h-4 text-amber-400" />
            </div>
            <div className="p-4 rounded-xl bg-secondary/40 border border-border text-center space-y-1">
              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Overall Readiness Index</p>
              <p className="text-3xl font-extrabold font-mono text-purple-400">
                {readinessScore !== null ? `${readinessScore}%` : "0%"}
              </p>
              <p
                className={`text-xs font-semibold ${
                  hasReadiness && readinessScore !== null && readinessScore >= 75
                    ? "text-emerald-400"
                    : "text-amber-400"
                }`}
              >
                {hasReadiness
                  ? readinessScore !== null && readinessScore >= 75
                    ? "Tier-1 Qualified"
                    : "In Progress"
                  : "Baseline Needed"}
              </p>
            </div>
          </div>

          {/* Academic & Career Profile Summary */}
          <div className="p-5 rounded-2xl border border-border bg-card space-y-3 text-xs">
            <h3 className="text-sm font-bold text-foreground">Personal & Career Profile</h3>
            <div className="space-y-2.5 divide-y divide-border">
              <div className="pt-1 flex justify-between">
                <span className="text-muted-foreground">Gender:</span>
                <span className="font-semibold text-foreground capitalize">
                  {formData.gender || "Prefer not to say"}
                </span>
              </div>
              <div className="pt-2 flex justify-between">
                <span className="text-muted-foreground">Date of Birth:</span>
                <span className="font-semibold text-foreground">
                  {formData.dob || "Not specified"}
                </span>
              </div>
              <div className="pt-2 flex justify-between">
                <span className="text-muted-foreground">Academic Year:</span>
                <span className="font-semibold text-foreground">
                  {formData.year || "Not specified"}
                </span>
              </div>
              <div className="pt-2 flex justify-between">
                <span className="text-muted-foreground">Phone:</span>
                <span className="font-semibold text-foreground">
                  {formData.phone || "Not added"}
                </span>
              </div>
              <div className="pt-2 flex justify-between">
                <span className="text-muted-foreground">Location:</span>
                <span className="font-semibold text-foreground">
                  {formData.location || "Not specified"}
                </span>
              </div>
              <div className="pt-2 flex justify-between">
                <span className="text-muted-foreground">Website / Portfolio:</span>
                <span className="font-semibold text-foreground truncate max-w-[150px]">
                  {formData.website ? (
                    <a
                      href={formData.website.startsWith("http") ? formData.website : `https://${formData.website}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-purple-400 hover:underline"
                    >
                      {formData.website}
                    </a>
                  ) : (
                    "Not added"
                  )}
                </span>
              </div>
              <div className="pt-2 flex justify-between">
                <span className="text-muted-foreground">Target Role:</span>
                <span className="font-semibold text-foreground text-right truncate max-w-[150px]">
                  {formData.target_role || "Not specified"}
                </span>
              </div>
              <div className="pt-2 flex justify-between">
                <span className="text-muted-foreground">Target Company:</span>
                <span className="font-semibold text-foreground text-right truncate max-w-[150px]">
                  {formData.target_company || "Not specified"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          EDIT PROFILE MODAL
         ========================================================================= */}
      {isEditing && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-card border border-border rounded-2xl p-6 sm:p-7 space-y-5 shadow-2xl my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h3 className="text-base font-bold text-foreground">Edit Candidate Profile</h3>
                <p className="text-xs text-muted-foreground">Updates are permanently saved to your authenticated account in MongoDB.</p>
              </div>
              <button
                onClick={handleCancel}
                className="text-muted-foreground hover:text-foreground p-1 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              {/* Row 1: Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-muted-foreground font-semibold">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full mt-1 px-3.5 py-2 rounded-xl border border-border bg-secondary text-foreground outline-none focus:border-purple-500"
                    placeholder="e.g. Alex Johnson"
                  />
                </div>
                <div>
                  <label className="text-muted-foreground font-semibold">Email Address (Account ID)</label>
                  <input
                    type="email"
                    disabled
                    value={formData.email}
                    className="w-full mt-1 px-3.5 py-2 rounded-xl border border-border bg-secondary/50 text-muted-foreground outline-none cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Row 2: Gender & Date of Birth */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-muted-foreground font-semibold">Gender (Hero Personalization)</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full mt-1 px-3.5 py-2 rounded-xl border border-border bg-secondary text-foreground outline-none focus:border-purple-500"
                  >
                    <option value="">Prefer not to say (Neutral Hero)</option>
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Other">Other (Neutral Hero)</option>
                  </select>
                </div>
                <div>
                  <label className="text-muted-foreground font-semibold">Date of Birth</label>
                  <input
                    type="date"
                    value={formData.dob}
                    onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                    className="w-full mt-1 px-3.5 py-2 rounded-xl border border-border bg-secondary text-foreground outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              {/* Row 3: College, Department & Academic Year */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-muted-foreground font-semibold">College / University</label>
                  <input
                    type="text"
                    value={formData.college}
                    onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                    placeholder="e.g. National Institute of Tech"
                    className="w-full mt-1 px-3.5 py-2 rounded-xl border border-border bg-secondary text-foreground outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="text-muted-foreground font-semibold">Department / Branch</label>
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    placeholder="e.g. Computer Science"
                    className="w-full mt-1 px-3.5 py-2 rounded-xl border border-border bg-secondary text-foreground outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="text-muted-foreground font-semibold">Academic Year</label>
                  <select
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    className="w-full mt-1 px-3.5 py-2 rounded-xl border border-border bg-secondary text-foreground outline-none focus:border-purple-500"
                  >
                    <option value="">Select Year</option>
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                    <option value="Graduate">Graduate / Alumni</option>
                  </select>
                </div>
              </div>

              {/* Row 4: Phone & Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-muted-foreground font-semibold">Phone Number</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full mt-1 px-3.5 py-2 rounded-xl border border-border bg-secondary text-foreground outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="text-muted-foreground font-semibold">Location / City</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g. Bengaluru, India"
                    className="w-full mt-1 px-3.5 py-2 rounded-xl border border-border bg-secondary text-foreground outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              {/* Row 5: Target Role & Target Company */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-muted-foreground font-semibold">Target Career Role (Aim)</label>
                  <input
                    type="text"
                    value={formData.target_role}
                    onChange={(e) => setFormData({ ...formData, target_role: e.target.value })}
                    placeholder="e.g. Full Stack Developer / SDE-1"
                    className="w-full mt-1 px-3.5 py-2 rounded-xl border border-border bg-secondary text-foreground outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="text-muted-foreground font-semibold">Target Company Type</label>
                  <input
                    type="text"
                    value={formData.target_company}
                    onChange={(e) => setFormData({ ...formData, target_company: e.target.value })}
                    placeholder="e.g. Product / FAANG / Tier-1"
                    className="w-full mt-1 px-3.5 py-2 rounded-xl border border-border bg-secondary text-foreground outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              {/* Row 6: Social & Portfolio Links */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-muted-foreground font-semibold">GitHub Profile</label>
                  <input
                    type="text"
                    value={formData.github}
                    onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                    placeholder="github.com/username"
                    className="w-full mt-1 px-3.5 py-2 rounded-xl border border-border bg-secondary text-foreground outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="text-muted-foreground font-semibold">LinkedIn Profile</label>
                  <input
                    type="text"
                    value={formData.linkedin}
                    onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                    placeholder="linkedin.com/in/username"
                    className="w-full mt-1 px-3.5 py-2 rounded-xl border border-border bg-secondary text-foreground outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="text-muted-foreground font-semibold">Portfolio Website</label>
                  <input
                    type="text"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    placeholder="portfolio.dev"
                    className="w-full mt-1 px-3.5 py-2 rounded-xl border border-border bg-secondary text-foreground outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              {/* Row 7: Learning Competency Levels */}
              <div className="p-3 rounded-xl bg-secondary/30 border border-border space-y-2">
                <span className="font-semibold text-foreground block">Competency Assessment Levels</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="text-muted-foreground text-[11px]">Programming</label>
                    <select
                      value={formData.programming_level}
                      onChange={(e) => setFormData({ ...formData, programming_level: e.target.value })}
                      className="w-full mt-1 px-2.5 py-1.5 rounded-lg border border-border bg-secondary text-foreground outline-none text-xs"
                    >
                      <option value="">Not set</option>
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-muted-foreground text-[11px]">DSA</label>
                    <select
                      value={formData.dsa_level}
                      onChange={(e) => setFormData({ ...formData, dsa_level: e.target.value })}
                      className="w-full mt-1 px-2.5 py-1.5 rounded-lg border border-border bg-secondary text-foreground outline-none text-xs"
                    >
                      <option value="">Not set</option>
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-muted-foreground text-[11px]">Aptitude</label>
                    <select
                      value={formData.aptitude_level}
                      onChange={(e) => setFormData({ ...formData, aptitude_level: e.target.value })}
                      className="w-full mt-1 px-2.5 py-1.5 rounded-lg border border-border bg-secondary text-foreground outline-none text-xs"
                    >
                      <option value="">Not set</option>
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-muted-foreground text-[11px]">Core CS</label>
                    <select
                      value={formData.core_cs_level}
                      onChange={(e) => setFormData({ ...formData, core_cs_level: e.target.value })}
                      className="w-full mt-1 px-2.5 py-1.5 rounded-lg border border-border bg-secondary text-foreground outline-none text-xs"
                    >
                      <option value="">Not set</option>
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Row 8: Bio */}
              <div>
                <label className="text-muted-foreground font-semibold">Bio / Summary</label>
                <textarea
                  rows={3}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Share a brief overview of your background, career interests, and placement preparation journey."
                  className="w-full mt-1 px-3.5 py-2 rounded-xl border border-border bg-secondary text-foreground outline-none focus:border-purple-500 resize-none"
                />
              </div>

              {/* Modal Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={isSaving}
                  className="px-4 py-2 rounded-xl border border-border text-muted-foreground hover:text-foreground font-medium transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 rounded-xl text-white font-bold bg-purple-600 hover:bg-purple-500 shadow-md flex items-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>Save Profile</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          CHANGE PASSWORD MODAL
         ========================================================================= */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-md bg-card border border-border rounded-2xl p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-foreground">Change Password</h3>
              </div>
              <button
                onClick={() => setIsPasswordModalOpen(false)}
                className="text-muted-foreground hover:text-foreground p-1 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {passwordSuccess && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-2">
                <Check className="w-4 h-4" />
                <span>Password updated successfully!</span>
              </div>
            )}

            {passwordError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{passwordError}</span>
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-4 text-xs">
              <div>
                <label className="text-muted-foreground font-semibold">Current Password</label>
                <div className="relative mt-1">
                  <input
                    type={showPasswords ? "text" : "password"}
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-3.5 py-2 pr-10 rounded-xl border border-border bg-secondary text-foreground outline-none focus:border-purple-500"
                    placeholder="Enter current account password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords(!showPasswords)}
                    className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    {showPasswords ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-muted-foreground font-semibold">New Password</label>
                <input
                  type={showPasswords ? "text" : "password"}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full mt-1 px-3.5 py-2 rounded-xl border border-border bg-secondary text-foreground outline-none focus:border-purple-500"
                  placeholder="Min. 6 characters"
                />
              </div>

              <div>
                <label className="text-muted-foreground font-semibold">Confirm New Password</label>
                <input
                  type={showPasswords ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full mt-1 px-3.5 py-2 rounded-xl border border-border bg-secondary text-foreground outline-none focus:border-purple-500"
                  placeholder="Re-enter new password"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsPasswordModalOpen(false)}
                  disabled={isChangingPassword}
                  className="px-4 py-2 rounded-xl border border-border text-muted-foreground hover:text-foreground font-medium transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isChangingPassword}
                  className="px-5 py-2 rounded-xl text-white font-bold bg-purple-600 hover:bg-purple-500 shadow-md flex items-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
                >
                  {isChangingPassword ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Updating...</span>
                    </>
                  ) : (
                    <span>Update Password</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          AVATAR PHOTO UPLOAD MODAL
         ========================================================================= */}
      {isAvatarModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-md bg-card border border-border rounded-2xl p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-purple-400" />
                <h3 className="text-base font-bold text-foreground">Update Profile Photo</h3>
              </div>
              <button
                onClick={() => setIsAvatarModalOpen(false)}
                className="text-muted-foreground hover:text-foreground p-1 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {mediaError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{mediaError}</span>
              </div>
            )}

            <div className="space-y-4 text-xs">
              {/* Option 1: File Upload */}
              <div className="space-y-2">
                <label className="text-muted-foreground font-semibold">Upload Image File</label>
                <input
                  type="file"
                  ref={avatarFileInputRef}
                  accept="image/png, image/jpeg, image/webp, image/gif"
                  onChange={handleAvatarFileChange}
                  className="hidden"
                />
                <button
                  type="button"
                  disabled={isUploadingMedia}
                  onClick={() => avatarFileInputRef.current?.click()}
                  className="w-full py-3 px-4 rounded-xl border border-dashed border-purple-500/40 bg-purple-500/5 hover:bg-purple-500/10 text-purple-400 font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  <Camera className="w-4 h-4" />
                  <span>{isUploadingMedia ? "Uploading..." : "Choose Image from Device"}</span>
                </button>
              </div>

              <div className="flex items-center gap-3 text-muted-foreground text-[11px]">
                <span className="flex-1 h-px bg-border" />
                <span>OR VIA IMAGE URL</span>
                <span className="flex-1 h-px bg-border" />
              </div>

              {/* Option 2: Image URL */}
              <div className="space-y-2">
                <label className="text-muted-foreground font-semibold">Image URL</label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={avatarUrlInput}
                    onChange={(e) => setAvatarUrlInput(e.target.value)}
                    placeholder="https://example.com/avatar.jpg"
                    className="flex-1 px-3.5 py-2 rounded-xl border border-border bg-secondary text-foreground outline-none focus:border-purple-500 text-xs"
                  />
                  <button
                    type="button"
                    disabled={isUploadingMedia || !avatarUrlInput.trim()}
                    onClick={handleAvatarUrlSave}
                    className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold transition-all disabled:opacity-50 cursor-pointer"
                  >
                    Save
                  </button>
                </div>
              </div>

              {/* Remove Avatar Option */}
              {user?.avatar && (
                <div className="pt-2 border-t border-border">
                  <button
                    type="button"
                    disabled={isUploadingMedia}
                    onClick={handleRemoveAvatar}
                    className="text-xs text-rose-400 hover:underline font-medium cursor-pointer"
                  >
                    Remove Current Photo
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          BANNER PHOTO UPLOAD MODAL
         ========================================================================= */}
      {isBannerModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-md bg-card border border-border rounded-2xl p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-purple-400" />
                <h3 className="text-base font-bold text-foreground">Update Cover Banner</h3>
              </div>
              <button
                onClick={() => setIsBannerModalOpen(false)}
                className="text-muted-foreground hover:text-foreground p-1 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {mediaError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{mediaError}</span>
              </div>
            )}

            <div className="space-y-4 text-xs">
              {/* Option 1: File Upload */}
              <div className="space-y-2">
                <label className="text-muted-foreground font-semibold">Upload Banner Image</label>
                <input
                  type="file"
                  ref={bannerFileInputRef}
                  accept="image/png, image/jpeg, image/webp, image/gif"
                  onChange={handleBannerFileChange}
                  className="hidden"
                />
                <button
                  type="button"
                  disabled={isUploadingMedia}
                  onClick={() => bannerFileInputRef.current?.click()}
                  className="w-full py-3 px-4 rounded-xl border border-dashed border-purple-500/40 bg-purple-500/5 hover:bg-purple-500/10 text-purple-400 font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  <ImageIcon className="w-4 h-4" />
                  <span>{isUploadingMedia ? "Uploading..." : "Choose Banner from Device"}</span>
                </button>
              </div>

              <div className="flex items-center gap-3 text-muted-foreground text-[11px]">
                <span className="flex-1 h-px bg-border" />
                <span>OR VIA IMAGE URL</span>
                <span className="flex-1 h-px bg-border" />
              </div>

              {/* Option 2: Image URL */}
              <div className="space-y-2">
                <label className="text-muted-foreground font-semibold">Banner Image URL</label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={bannerUrlInput}
                    onChange={(e) => setBannerUrlInput(e.target.value)}
                    placeholder="https://example.com/cover.jpg"
                    className="flex-1 px-3.5 py-2 rounded-xl border border-border bg-secondary text-foreground outline-none focus:border-purple-500 text-xs"
                  />
                  <button
                    type="button"
                    disabled={isUploadingMedia || !bannerUrlInput.trim()}
                    onClick={handleBannerUrlSave}
                    className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold transition-all disabled:opacity-50 cursor-pointer"
                  >
                    Save
                  </button>
                </div>
              </div>

              {/* Remove Banner Option */}
              {user?.banner_image && (
                <div className="pt-2 border-t border-border">
                  <button
                    type="button"
                    disabled={isUploadingMedia}
                    onClick={handleRemoveBanner}
                    className="text-xs text-rose-400 hover:underline font-medium cursor-pointer"
                  >
                    Remove Cover Banner
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}