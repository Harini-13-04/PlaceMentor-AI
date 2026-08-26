import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, User } from "@/context/AuthContext";
import {
  User as UserIcon,
  Mail,
  Phone,
  GraduationCap,
  BookOpen,
  Calendar,
  Github,
  Linkedin,
  Globe,
  Edit3,
  Camera,
  Trash2,
  Lock,
  LogOut,
  Check,
  X,
  Plus,
  AlertCircle,
  KeyRound,
  ExternalLink,
  ShieldCheck,
  Building2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const SKILL_COLORS = [
  "bg-violet-500/15 text-violet-300 border-violet-500/30",
  "bg-indigo-500/15 text-indigo-300 border-indigo-500/30",
  "bg-cyan-500/15 text-cyan-300 border-cyan-500/30",
  "bg-teal-500/15 text-teal-300 border-teal-500/30",
  "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  "bg-amber-500/15 text-amber-300 border-amber-500/30",
  "bg-fuchsia-500/15 text-fuchsia-300 border-fuchsia-500/30",
];

export default function Profile() {
  const { user, updateProfile, uploadAvatar, removeAvatar, changePassword, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Modals state
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  // Edit draft state
  const [draft, setDraft] = useState<Partial<User>>({});
  const [newSkill, setNewSkill] = useState("");
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  // Change password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!user) {
    return null;
  }

  const displayName = user.name || user.full_name || "User";
  const userInitials = displayName
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "U";

  // Open Edit Modal
  const openEditModal = () => {
    setDraft({
      name: user.name || user.full_name || "",
      college: user.college || "",
      department: user.department || "",
      year: user.year || "",
      bio: user.bio || "",
      phone: user.phone || "",
      github: user.github || "",
      linkedin: user.linkedin || "",
      skills: [...(user.skills || [])],
    });
    setEditError(null);
    setIsEditOpen(true);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditError(null);

    if (!draft.name?.trim()) {
      setEditError("Name cannot be empty.");
      return;
    }

    try {
      setIsSavingProfile(true);
      await updateProfile(draft);
      setIsEditOpen(false);
      toast({
        title: "Profile Updated",
        description: "Your professional profile has been successfully saved.",
      });
    } catch (err: any) {
      setEditError(err.message || "Failed to update profile.");
    } finally {
      setIsSavingProfile(false);
    }
  };

  // Avatar Upload / Remove
  const handleAvatarFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file",
        description: "Please select an image file (PNG, JPG, WEBP).",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsUploadingAvatar(true);
      await uploadAvatar(file);
      toast({
        title: "Avatar Updated",
        description: "Your profile picture has been updated.",
      });
    } catch (err: any) {
      toast({
        title: "Upload Failed",
        description: err.message || "Could not upload image.",
        variant: "destructive",
      });
    } finally {
      setIsUploadingAvatar(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemoveAvatar = async () => {
    try {
      setIsUploadingAvatar(true);
      await removeAvatar();
      toast({
        title: "Avatar Removed",
        description: "Profile picture reset to default.",
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Could not remove avatar.",
        variant: "destructive",
      });
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  // Skills in draft
  const handleAddSkill = () => {
    const trimmed = newSkill.trim();
    const currentSkills = draft.skills || [];
    if (trimmed && !currentSkills.includes(trimmed)) {
      setDraft({ ...draft, skills: [...currentSkills, trimmed] });
    }
    setNewSkill("");
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setDraft({
      ...draft,
      skills: (draft.skills || []).filter((s) => s !== skillToRemove),
    });
  };

  // Password Change
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);

    if (!currentPassword) {
      setPasswordError("Please enter your current password.");
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }

    try {
      setIsChangingPassword(true);
      await changePassword(currentPassword, newPassword);
      setIsPasswordOpen(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      toast({
        title: "Password Changed",
        description: "Your account password has been updated securely.",
      });
    } catch (err: any) {
      setPasswordError(err.message || "Failed to change password.");
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl mx-auto pb-16">
      {/* ── Profile Header & Banner ── */}
      <div className="relative rounded-3xl bg-[#121124]/90 border border-white/10 overflow-hidden shadow-2xl backdrop-blur-xl">
        {/* Banner Graphic */}
        <div className="h-44 w-full bg-gradient-to-r from-violet-900/60 via-indigo-900/50 to-purple-900/60 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(124,58,237,0.3),transparent_70%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:24px_24px]" />
        </div>

        {/* User Info Bar */}
        <div className="px-6 sm:px-8 pb-8 pt-0 relative">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 -mt-16 sm:-mt-14 mb-4">
            {/* Avatar & Identifiers */}
            <div className="flex items-end gap-5">
              {/* Avatar Container */}
              <div className="relative group">
                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl border-4 border-[#121124] bg-gradient-to-br from-violet-600 to-indigo-700 flex items-center justify-center text-3xl font-bold text-white shadow-2xl overflow-hidden ring-1 ring-white/20">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={displayName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>{userInitials}</span>
                  )}

                  {isUploadingAvatar && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                </div>

                {/* Avatar Actions Overlay */}
                <div className="absolute bottom-1 right-1 flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    title="Change Photo"
                    className="p-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-600/40 border border-white/20 transition-all active:scale-95"
                  >
                    <Camera className="w-4 h-4" />
                  </button>

                  {user.avatar && (
                    <button
                      type="button"
                      onClick={handleRemoveAvatar}
                      title="Remove Photo"
                      className="p-2 rounded-xl bg-red-600/80 hover:bg-red-500 text-white shadow-lg border border-white/20 transition-all active:scale-95"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarFileChange}
                  className="hidden"
                />
              </div>

              {/* Name & Academic Chips */}
              <div className="pb-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-bold text-white font-display tracking-tight">
                    {displayName}
                  </h1>
                  {user.year && (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-violet-500/20 text-violet-300 border border-violet-500/30">
                      {user.year}
                    </span>
                  )}
                </div>

                <p className="text-sm text-slate-400 mt-1 flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-500" />
                  {user.email}
                </p>

                {(user.college || user.department) && (
                  <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5 font-medium">
                    <GraduationCap className="w-3.5 h-3.5 text-violet-400" />
                    {[user.department, user.college].filter(Boolean).join(" • ")}
                  </p>
                )}
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-2.5 flex-wrap w-full sm:w-auto mt-2 sm:mt-0">
              <button
                onClick={openEditModal}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold shadow-lg shadow-violet-600/20 transition-all active:scale-95"
              >
                <Edit3 className="w-3.5 h-3.5" />
                Edit Profile
              </button>

              <button
                onClick={() => {
                  setPasswordError(null);
                  setCurrentPassword("");
                  setNewPassword("");
                  setConfirmPassword("");
                  setIsPasswordOpen(true);
                }}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 text-xs font-semibold transition-all active:scale-95"
              >
                <KeyRound className="w-3.5 h-3.5 text-violet-400" />
                Change Password
              </button>

              <button
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-semibold transition-all active:scale-95"
                title="Logout"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Content Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* About / Bio */}
          <div className="bg-[#121124]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-7 shadow-xl">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
              <UserIcon className="w-4 h-4 text-violet-400" />
              About Me
            </h2>
            {user.bio ? (
              <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-line">
                {user.bio}
              </p>
            ) : (
              <p className="text-sm text-slate-500 italic">
                No bio added yet. Click "Edit Profile" to share your summary, career goals, or background.
              </p>
            )}
          </div>

          {/* Academic & University Details */}
          <div className="bg-[#121124]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-7 shadow-xl">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-5 flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-violet-400" />
              Academic Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Building2 className="w-4 h-4 text-violet-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">College / University</p>
                  <p className="text-sm font-medium text-slate-200 mt-0.5">
                    {user.college || "Not specified"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <BookOpen className="w-4 h-4 text-violet-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Department / Discipline</p>
                  <p className="text-sm font-medium text-slate-200 mt-0.5">
                    {user.department || "Not specified"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Calendar className="w-4 h-4 text-violet-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Academic Year</p>
                  <p className="text-sm font-medium text-slate-200 mt-0.5">
                    {user.year || "Not specified"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <ShieldCheck className="w-4 h-4 text-violet-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Account Status</p>
                  <p className="text-sm font-medium text-emerald-400 mt-0.5 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    Verified Student Account
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Technical Skills */}
          <div className="bg-[#121124]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-7 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-violet-400" />
                Skills & Technologies
              </h2>
              <button
                onClick={openEditModal}
                className="text-xs text-violet-400 hover:text-violet-300 transition-colors font-medium"
              >
                + Manage Skills
              </button>
            </div>

            {user.skills && user.skills.length > 0 ? (
              <div className="flex flex-wrap gap-2.5">
                {user.skills.map((skill, index) => (
                  <span
                    key={skill}
                    className={`text-xs px-3.5 py-1.5 rounded-xl border font-medium transition-all ${
                      SKILL_COLORS[index % SKILL_COLORS.length]
                    }`}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500 italic">
                No skills added yet. Add your core languages, frameworks, and domains to improve placement recommendations.
              </p>
            )}
          </div>
        </div>

        {/* Right Column (1 Col) */}
        <div className="space-y-6">
          {/* Contact & Verification */}
          <div className="bg-[#121124]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-7 shadow-xl space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
              <Mail className="w-4 h-4 text-violet-400" />
              Contact Information
            </h2>

            <div>
              <p className="text-xs text-slate-500 font-medium">Email</p>
              <p className="text-sm text-slate-200 font-medium mt-0.5 break-all">{user.email}</p>
            </div>

            <div>
              <p className="text-xs text-slate-500 font-medium">Phone</p>
              <p className="text-sm text-slate-200 font-medium mt-0.5">
                {user.phone || "Not provided"}
              </p>
            </div>
          </div>

          {/* Professional Links */}
          <div className="bg-[#121124]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-7 shadow-xl space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
              <Globe className="w-4 h-4 text-violet-400" />
              Professional Links
            </h2>

            {/* GitHub */}
            {user.github ? (
              <a
                href={user.github.startsWith("http") ? user.github : `https://${user.github}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-all group"
              >
                <div className="flex items-center gap-2.5 truncate">
                  <Github className="w-4 h-4 text-slate-400 group-hover:text-white" />
                  <span className="text-xs font-medium truncate">{user.github}</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-slate-500 flex-shrink-0 ml-2" />
              </a>
            ) : (
              <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-xs text-slate-500 flex items-center gap-2">
                <Github className="w-4 h-4 text-slate-600" />
                <span>GitHub profile not linked</span>
              </div>
            )}

            {/* LinkedIn */}
            {user.linkedin ? (
              <a
                href={user.linkedin.startsWith("http") ? user.linkedin : `https://${user.linkedin}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-all group"
              >
                <div className="flex items-center gap-2.5 truncate">
                  <Linkedin className="w-4 h-4 text-blue-400" />
                  <span className="text-xs font-medium truncate">{user.linkedin}</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-slate-500 flex-shrink-0 ml-2" />
              </a>
            ) : (
              <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-xs text-slate-500 flex items-center gap-2">
                <Linkedin className="w-4 h-4 text-slate-600" />
                <span>LinkedIn profile not linked</span>
              </div>
            )}
          </div>

          {/* Account Security & Actions */}
          <div className="bg-[#121124]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-7 shadow-xl space-y-3">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-2">
              <Lock className="w-4 h-4 text-violet-400" />
              Account Settings
            </h2>

            <button
              onClick={() => {
                setPasswordError(null);
                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");
                setIsPasswordOpen(true);
              }}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 text-xs font-medium border border-white/10 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <KeyRound className="w-4 h-4 text-violet-400" />
                <span>Change Password</span>
              </div>
              <span className="text-[10px] text-slate-500 font-semibold uppercase">Update</span>
            </button>

            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-300 text-xs font-medium border border-red-500/20 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <LogOut className="w-4 h-4 text-red-400" />
                <span>Logout from Session</span>
              </div>
              <span className="text-[10px] text-red-400 font-semibold uppercase">Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── EDIT PROFILE MODAL ── */}
      {isEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
          <div className="w-full max-w-2xl bg-[#131127] border border-white/15 rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10 sticky top-0 bg-[#131127] z-10">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-violet-600/20 text-violet-400 flex items-center justify-center">
                  <Edit3 className="w-4 h-4" />
                </div>
                <h2 className="font-bold text-white text-lg">Edit Professional Profile</h2>
              </div>
              <button
                type="button"
                onClick={() => setIsEditOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSaveProfile} className="p-6 space-y-5">
              {editError && (
                <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{editError}</span>
                </div>
              )}

              {/* Full Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Full Name <span className="text-violet-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={draft.name || ""}
                    onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={draft.phone || ""}
                    onChange={(e) => setDraft({ ...draft, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors"
                  />
                </div>
              </div>

              {/* College & Department */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    College / University
                  </label>
                  <input
                    type="text"
                    value={draft.college || ""}
                    onChange={(e) => setDraft({ ...draft, college: e.target.value })}
                    placeholder="e.g. SRM Institute of Science and Technology"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Department / Major
                  </label>
                  <input
                    type="text"
                    value={draft.department || ""}
                    onChange={(e) => setDraft({ ...draft, department: e.target.value })}
                    placeholder="e.g. Computer Science & Engineering"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors"
                  />
                </div>
              </div>

              {/* Academic Year */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Academic Year
                </label>
                <select
                  value={draft.year || ""}
                  onChange={(e) => setDraft({ ...draft, year: e.target.value })}
                  className="w-full bg-[#1c1a32] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500 transition-colors"
                >
                  <option value="">Select Year</option>
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year / Final Year">4th Year / Final Year</option>
                  <option value="Postgraduate">Postgraduate</option>
                </select>
              </div>

              {/* Bio */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Professional Bio / Career Summary
                </label>
                <textarea
                  value={draft.bio || ""}
                  onChange={(e) => setDraft({ ...draft, bio: e.target.value })}
                  rows={3}
                  placeholder="Passionate engineer interested in..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors resize-none"
                />
              </div>

              {/* Skills */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Skills & Technologies
                </label>
                <div className="flex flex-wrap gap-2 mb-2.5">
                  {(draft.skills || []).map((sk) => (
                    <span
                      key={sk}
                      className="inline-flex items-center gap-1.5 text-xs bg-violet-500/20 text-violet-300 border border-violet-500/30 rounded-full px-3 py-1"
                    >
                      {sk}
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(sk)}
                        className="hover:text-red-400 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddSkill();
                      }
                    }}
                    placeholder="Add a new skill (Press Enter)"
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={handleAddSkill}
                    className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 hover:text-white transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* GitHub & LinkedIn */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    GitHub Profile
                  </label>
                  <input
                    type="text"
                    value={draft.github || ""}
                    onChange={(e) => setDraft({ ...draft, github: e.target.value })}
                    placeholder="github.com/username"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    LinkedIn Profile
                  </label>
                  <input
                    type="text"
                    value={draft.linkedin || ""}
                    onChange={(e) => setDraft({ ...draft, linkedin: e.target.value })}
                    placeholder="linkedin.com/in/username"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors"
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsEditOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-white/10 text-slate-300 hover:text-white text-xs font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingProfile}
                  className="flex-1 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold shadow-lg shadow-violet-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {isSavingProfile ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── CHANGE PASSWORD MODAL ── */}
      {isPasswordOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
          <div className="w-full max-w-md bg-[#131127] border border-white/15 rounded-3xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-violet-600/20 text-violet-400 flex items-center justify-center">
                  <KeyRound className="w-4 h-4" />
                </div>
                <h2 className="font-bold text-white text-lg">Change Password</h2>
              </div>
              <button
                type="button"
                onClick={() => setIsPasswordOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleChangePassword} className="p-6 space-y-4">
              {passwordError && (
                <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{passwordError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Current Password
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors"
                />
              </div>

              <div className="flex gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsPasswordOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-white/10 text-slate-300 hover:text-white text-xs font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isChangingPassword}
                  className="flex-1 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold shadow-lg shadow-violet-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {isChangingPassword ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      Update Password
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}