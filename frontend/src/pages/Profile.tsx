import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  User as UserIcon,
  Mail,
  GraduationCap,
  Briefcase,
  Github,
  Linkedin,
  Edit3,
  Check,
  X,
  Code2,
  FileText,
  MessageSquare,
  Sparkles,
  Trophy,
  Plus,
  Compass,
} from "lucide-react";

export default function Profile() {
  const { user, updateUser } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "Harini Muthuvel",
    email: user?.email || "harini.muthuvel@srmist.edu.in",
    department: user?.department || "Computer Science & Engineering",
    college: user?.college || "SRM Institute of Science and Technology",
    targetRole: "Full Stack Software Development Engineer",
    github: "github.com/harini-m",
    linkedin: "linkedin.com/in/harini-m",
    bio: "Final-year CS student passionate about building scalable web systems, mastering DSA patterns, and preparing for product engineering roles.",
  });

  const [skills, setSkills] = useState([
    "Python", "JavaScript", "TypeScript", "React", "Node.js",
    "SQL", "MongoDB", "Algorithms & DSA", "System Design", "Git"
  ]);
  const [newSkill, setNewSkill] = useState("");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({
      name: formData.name,
      department: formData.department,
      college: formData.college,
    });
    setIsEditing(false);
  };

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  return (
    <div className="space-y-6 font-sans text-foreground">
      {/* Profile Header Banner */}
      <div className="p-6 sm:p-8 rounded-2xl border border-border bg-card shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"}
              alt={formData.name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-purple-500/40 object-cover"
            />
            <div className="space-y-1">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">{formData.name}</h1>
              <p className="text-xs text-muted-foreground">{formData.targetRole}</p>
              <div className="flex items-center gap-3 text-xs text-muted-foreground pt-0.5">
                <span className="flex items-center gap-1 font-mono text-purple-400 font-semibold">
                  <Sparkles className="w-3.5 h-3.5" /> Level {user?.level || 12}
                </span>
                <span>&bull;</span>
                <span className="font-mono text-foreground">{user?.xp || 4500} XP</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsEditing(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-border bg-secondary hover:bg-secondary/80 text-xs font-semibold text-foreground transition-colors shrink-0"
          >
            <Edit3 className="w-3.5 h-3.5" /> Edit Profile
          </button>
        </div>

        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed pt-2 border-t border-border">
          {formData.bio}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Mail className="w-4 h-4 text-purple-400 shrink-0" />
            <span className="truncate">{formData.email}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <GraduationCap className="w-4 h-4 text-purple-400 shrink-0" />
            <span className="truncate">{formData.department}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Briefcase className="w-4 h-4 text-purple-400 shrink-0" />
            <span className="truncate">{formData.college}</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <a href={`https://${formData.github}`} target="_blank" rel="noreferrer" className="hover:text-foreground flex items-center gap-1">
              <Github className="w-4 h-4" /> GitHub
            </a>
            <a href={`https://${formData.linkedin}`} target="_blank" rel="noreferrer" className="hover:text-foreground flex items-center gap-1">
              <Linkedin className="w-4 h-4" /> LinkedIn
            </a>
          </div>
        </div>
      </div>

      {/* Skills & Milestones */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Technical Skills */}
        <div className="lg:col-span-8 space-y-4">
          <div className="p-5 rounded-2xl border border-border bg-card space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-foreground">Verified Technical Skills</h2>
              <span className="text-xs font-mono text-muted-foreground">{skills.length} skills added</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-secondary border border-border text-xs font-medium text-foreground"
                >
                  {skill}
                  <button
                    onClick={() => removeSkill(skill)}
                    className="text-muted-foreground hover:text-rose-400 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addSkill()}
                placeholder="Add skill (e.g. Docker, Redis)..."
                className="flex-1 px-3.5 py-2 rounded-xl border border-border bg-secondary/50 text-foreground text-xs placeholder:text-muted-foreground focus:outline-none focus:border-purple-500"
              />
              <button
                onClick={addSkill}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center gap-1 transition-all"
              >
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Readiness Index */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-5 rounded-2xl border border-border bg-card space-y-3">
            <h3 className="text-sm font-bold text-foreground">Placement Screening Status</h3>
            <div className="p-4 rounded-xl bg-secondary/40 border border-border text-center space-y-1">
              <p className="text-[10px] text-muted-foreground uppercase font-bold">Overall Index</p>
              <p className="text-3xl font-extrabold font-mono text-purple-400">78%</p>
              <p className="text-xs text-emerald-400 font-semibold">Tier-1 Qualified</p>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-card border border-border rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-base font-bold text-foreground">Edit Candidate Profile</h3>
              <button onClick={() => setIsEditing(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="text-muted-foreground font-semibold">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full mt-1 px-3 py-2 rounded-xl border border-border bg-secondary text-foreground outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="text-muted-foreground font-semibold">Target Role</label>
                <input
                  type="text"
                  value={formData.targetRole}
                  onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })}
                  className="w-full mt-1 px-3 py-2 rounded-xl border border-border bg-secondary text-foreground outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="text-muted-foreground font-semibold">Department</label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full mt-1 px-3 py-2 rounded-xl border border-border bg-secondary text-foreground outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="text-muted-foreground font-semibold">Bio</label>
                <textarea
                  rows={3}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full mt-1 px-3 py-2 rounded-xl border border-border bg-secondary text-foreground outline-none focus:border-purple-500 resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-xl border border-border text-muted-foreground hover:text-foreground"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-white font-bold pm-btn-gradient shadow-md"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}