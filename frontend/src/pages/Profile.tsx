import { useRef, useState, ChangeEvent } from "react";
import {
  Github,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Edit3,
  Star,
  Award,
  FileText,
  ExternalLink,
  X,
  Check,
  Plus,
  Camera,
} from "lucide-react";

interface Profile {
  name: string;
  bio: string;
  phone: string;
  email: string;
  college: string;
  dreamRole: string;
  skills: string[];
  github: string;
  linkedin: string;
  resumeScore: number;
  level: number;
  xp: number;
  xpToNext: number;
  avatarUrl: string;
  bannerColor: string;
}

const INITIAL_PROFILE: Profile = {
  name: "Harini Muthuvel",
  bio: "Final-year CS student passionate about building products that matter. Love solving complex problems, one commit at a time.",
  phone: "+91 98765 43210",
  email: "harini.muthuvel@srmist.edu.in",
  college: "SRM Institute of Science and Technology, Chennai",
  dreamRole: "Software Development Engineer @ a product-first company",
  skills: ["React", "Node.js", "Python", "ML", "SQL", "TypeScript", "DSA", "System Design"],
  github: "github.com/harini-m",
  linkedin: "linkedin.com/in/harini-m",
  resumeScore: 78,
  level: 12,
  xp: 4500,
  xpToNext: 5000,
  avatarUrl: "",
  bannerColor: "#1e1b4b",
};

const SKILL_COLORS = [
  "bg-violet-500/20 text-violet-300 border-violet-500/30",
  "bg-blue-500/20 text-blue-300 border-blue-500/30",
  "bg-teal-500/20 text-teal-300 border-teal-500/30",
  "bg-pink-500/20 text-pink-300 border-pink-500/30",
  "bg-amber-500/20 text-amber-300 border-amber-500/30",
  "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
  "bg-green-500/20 text-green-300 border-green-500/30",
  "bg-red-500/20 text-red-300 border-red-500/30",
];

// Editable string keys used in the simple text-input section of the edit modal
type EditableTextField =
  | "name"
  | "phone"
  | "email"
  | "college"
  | "dreamRole"
  | "github"
  | "linkedin";

const ScoreRing = ({ score }: { score: number }) => {
  const radius = 40;
  const circ = 2 * Math.PI * radius;
  const filled = (score / 100) * circ;
  const color = score >= 80 ? "#22d3ee" : score >= 60 ? "#a78bfa" : "#f59e0b";
  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width="100" height="100" style={{ transform: "rotate(-90deg)" }}>
        <circle cx="50" cy="50" r={radius} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
        <circle
          cx="50" cy="50" r={radius} fill="none"
          stroke={color} strokeWidth="8"
          strokeDasharray={`${filled} ${circ}`}
          strokeLinecap="round"
          style={{ transition: "stroke-dasharray 1s ease" }}
        />
      </svg>
      <div className="absolute text-center">
        <div className="text-xl font-bold text-white">{score}</div>
        <div className="text-[10px] text-slate-400 leading-tight">/ 100</div>
      </div>
    </div>
  );
};

export default function Profile() {
  const [profile, setProfile] = useState<Profile>(INITIAL_PROFILE);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<Profile>(INITIAL_PROFILE);
  const [newSkill, setNewSkill] = useState("");

  // Backend-ready image state — these will eventually hold uploaded URLs
  // returned from the Spring Boot media endpoint. For now they hold local
  // object URLs created from the picked File for instant preview.
  const [avatarImage, setAvatarImage] = useState<string | null>(null);
  const [bannerImage, setBannerImage] = useState<string | null>(null);

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  const startEdit = () => {
    setDraft({ ...profile });
    setEditing(true);
  };
  const saveEdit = () => {
    setProfile({ ...draft });
    setEditing(false);
  };
  const cancelEdit = () => setEditing(false);

  const addSkill = () => {
    const s = newSkill.trim();
    if (s && !draft.skills.includes(s)) {
      setDraft({ ...draft, skills: [...draft.skills, s] });
    }
    setNewSkill("");
  };
  const removeSkill = (sk: string) => {
    setDraft({ ...draft, skills: draft.skills.filter((s) => s !== sk) });
  };

  // Generic handler for picking an image file and previewing it via an
  // object URL. No upload happens here — that's left for the backend pass.
  const handleImagePick = (
    e: ChangeEvent<HTMLInputElement>,
    setter: (url: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    const url = URL.createObjectURL(file);
    setter(url);
    // Reset the input so picking the same file again still fires onChange
    e.target.value = "";
  };

  const handleTextChange = (key: EditableTextField, value: string) => {
    setDraft({ ...draft, [key]: value });
  };

  const xpPct = Math.round((profile.xp / profile.xpToNext) * 100);

  const textFields: { label: string; key: EditableTextField; type: string }[] = [
    { label: "Full Name", key: "name", type: "text" },
    { label: "Phone", key: "phone", type: "text" },
    { label: "Email", key: "email", type: "email" },
    { label: "College", key: "college", type: "text" },
    { label: "Dream Role", key: "dreamRole", type: "text" },
    { label: "GitHub", key: "github", type: "text" },
    { label: "LinkedIn", key: "linkedin", type: "text" },
  ];

  return (
    <div className="min-h-screen bg-[#0f0e1a] text-white pb-20">

      {/* ── Banner ── */}
      <div className="relative h-52 overflow-hidden group">
        {bannerImage ? (
          <img
            src={bannerImage}
            alt="Profile banner"
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #4c1d95 70%, #1e1b4b 100%)",
            }}
          />
        )}
        <div className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: "radial-gradient(circle at 20% 50%, #7c3aed33 0%, transparent 50%), radial-gradient(circle at 80% 20%, #4f46e533 0%, transparent 50%)",
          }}
        />
        {/* grid lines */}
        <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        {/* Level badge */}
        <div className="absolute top-5 right-5 flex items-center gap-2 bg-black/30 backdrop-blur-sm border border-violet-500/30 rounded-full px-3 py-1.5">
          <Star size={14} className="text-amber-400 fill-amber-400" />
          <span className="text-xs font-semibold text-amber-300">Level {profile.level}</span>
        </div>

        {/* Edit profile button */}
        <button
          onClick={startEdit}
          className="absolute top-5 left-5 flex items-center gap-1.5 bg-black/30 backdrop-blur-sm border border-white/10 text-slate-300 hover:text-white hover:border-violet-400/50 rounded-full px-3 py-1.5 text-xs font-medium transition-all"
        >
          <Edit3 size={13} />
          Edit Profile
        </button>

        {/* Banner edit (camera) overlay — visible on hover */}
        <button
          onClick={() => bannerInputRef.current?.click()}
          aria-label="Change banner image"
          className="absolute bottom-4 right-5 flex items-center gap-1.5 bg-black/40 backdrop-blur-sm border border-white/15 text-slate-200 hover:text-white hover:border-violet-400/50 rounded-full px-3 py-1.5 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Camera size={13} />
          Change Banner
        </button>
        <input
          ref={bannerInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleImagePick(e, setBannerImage)}
        />
      </div>

      {/* ── Avatar + Name ── */}
      <div className="max-w-4xl mx-auto px-6">
        <div className="relative flex items-end gap-5 -mt-14 mb-8">
          <div className="relative group">
            <div className="w-24 h-24 rounded-2xl border-4 border-[#0f0e1a] bg-gradient-to-br from-violet-600 to-indigo-700 flex items-center justify-center text-3xl font-bold text-white shadow-lg overflow-hidden">
              {avatarImage ? (
                <img src={avatarImage} alt="Profile avatar" className="w-full h-full object-cover" />
              ) : (
                profile.name.split(" ").map((n) => n[0]).join("").slice(0, 2)
              )}
            </div>
            <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full w-4 h-4 border-2 border-[#0f0e1a]" />

            {/* Avatar edit (camera) button */}
            <button
              onClick={() => avatarInputRef.current?.click()}
              aria-label="Change profile picture"
              className="absolute -bottom-1 -left-1 bg-violet-600 hover:bg-violet-500 border-2 border-[#0f0e1a] rounded-full w-7 h-7 flex items-center justify-center text-white transition-colors"
            >
              <Camera size={12} />
            </button>
            <input
              ref={avatarInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleImagePick(e, setAvatarImage)}
            />
          </div>
          <div className="pb-1.5">
            <h1 className="text-2xl font-bold text-white tracking-tight">{profile.name}</h1>
            <p className="text-xs text-violet-400 font-medium mt-1.5 flex items-center gap-1.5">
              <Award size={12} />
              {profile.xp.toLocaleString()} XP · {xpPct}% to Level {profile.level + 1}
            </p>
          </div>
        </div>

        {/* XP bar */}
        <div className="mb-10">
          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-400"
              style={{ width: `${xpPct}%`, transition: "width 1s ease" }}
            />
          </div>
        </div>

        {/* ── Info Cards Grid ── */}
        <div className="grid grid-cols-1 gap-5 mb-5">

          {/* Bio */}
          <div className="bg-white/5 border border-white/8 rounded-2xl p-6">
            <p className="text-sm text-slate-300 leading-relaxed">{profile.bio}</p>
          </div>

          {/* Contact details */}
          <div className="bg-white/5 border border-white/8 rounded-2xl p-6">
            <p className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold mb-4">Contact</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-6">
              {[
                { icon: Phone, label: "Phone", val: profile.phone },
                { icon: Mail, label: "Email", val: profile.email },
                { icon: GraduationCap, label: "College", val: profile.college },
                { icon: Briefcase, label: "Dream Role", val: profile.dreamRole },
              ].map(({ icon: Icon, label, val }) => (
                <div key={label} className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-violet-500/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Icon size={15} className="text-violet-400" />
                  </div>
                  <div>
                    <p className="text-[11px] text-slate-500 uppercase tracking-wide font-medium">{label}</p>
                    <p className="text-sm text-slate-200 mt-1 leading-snug">{val}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Skills */}
          <div className="bg-white/5 border border-white/8 rounded-2xl p-6">
            <p className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold mb-4">Skills</p>
            <div className="flex flex-wrap gap-2.5">
              {profile.skills.map((sk, i) => (
                <span
                  key={sk}
                  className={`text-xs px-3.5 py-1.5 rounded-full border font-medium ${SKILL_COLORS[i % SKILL_COLORS.length]}`}
                >
                  {sk}
                </span>
              ))}
            </div>
          </div>

          {/* Links + Resume Score */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="bg-white/5 border border-white/8 rounded-2xl p-6 flex flex-col gap-4">
              <p className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">Links</p>
              <a
                href={`https://${profile.github}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2.5 text-sm text-slate-300 hover:text-white transition-colors group"
              >
                <Github size={16} className="text-slate-400 group-hover:text-white" />
                <span className="truncate">{profile.github.replace("github.com/", "")}</span>
                <ExternalLink size={11} className="text-slate-500 ml-auto" />
              </a>
              <a
                href={`https://${profile.linkedin}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2.5 text-sm text-slate-300 hover:text-white transition-colors group"
              >
                <Linkedin size={16} className="text-blue-400 group-hover:text-blue-300" />
                <span className="truncate">{profile.linkedin.replace("linkedin.com/in/", "")}</span>
                <ExternalLink size={11} className="text-slate-500 ml-auto" />
              </a>
              {/* Reserved slot for a future Portfolio link */}
              <div className="flex items-center gap-2.5 text-sm text-slate-500">
                <MapPin size={16} className="text-slate-600" />
                <span className="italic">Portfolio link coming soon</span>
              </div>
            </div>

            <div className="bg-white/5 border border-white/8 rounded-2xl p-6 flex flex-col items-center justify-center gap-2">
              <p className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold mb-2 flex items-center gap-1.5 self-start">
                <FileText size={11} /> Resume Score
              </p>
              <ScoreRing score={profile.resumeScore} />
              <p className="text-[11px] text-slate-400 text-center mt-2">
                {profile.resumeScore >= 80 ? "Strong resume 🎉" : profile.resumeScore >= 60 ? "Good — room to grow" : "Needs work"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Edit Modal ── */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-[#13111f] border border-white/10 rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-white/8">
              <h2 className="font-semibold text-white text-lg">Edit Profile</h2>
              <button onClick={cancelEdit} className="text-slate-400 hover:text-white transition-colors">
                <X size={18} />
              </button>
            </div>

            <div className="p-6 flex flex-col gap-5">
              {textFields.map(({ label, key, type }) => (
                <div key={key}>
                  <label className="block text-[11px] text-slate-400 uppercase tracking-wide mb-2">{label}</label>
                  <input
                    type={type}
                    value={draft[key]}
                    onChange={(e) => handleTextChange(key, e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors"
                  />
                </div>
              ))}

              <div>
                <label className="block text-[11px] text-slate-400 uppercase tracking-wide mb-2">Bio</label>
                <textarea
                  value={draft.bio}
                  onChange={(e) => setDraft({ ...draft, bio: e.target.value })}
                  rows={3}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors resize-none"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 uppercase tracking-wide mb-3">Skills</label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {draft.skills.map((sk) => (
                    <span key={sk} className="flex items-center gap-1.5 text-xs bg-violet-500/20 text-violet-300 border border-violet-500/30 rounded-full px-3 py-1.5">
                      {sk}
                      <button onClick={() => removeSkill(sk)} className="text-violet-400 hover:text-red-400 transition-colors">
                        <X size={11} />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addSkill()}
                    placeholder="Add skill…"
                    className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors"
                  />
                  <button
                    onClick={addSkill}
                    className="px-3.5 py-2.5 bg-violet-600 hover:bg-violet-500 rounded-lg text-white transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 uppercase tracking-wide mb-2">
                  Resume Score (self-assess)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range" min="0" max="100"
                    value={draft.resumeScore}
                    onChange={(e) => setDraft({ ...draft, resumeScore: Number(e.target.value) })}
                    className="flex-1 accent-violet-500"
                  />
                  <span className="text-sm font-semibold text-violet-300 w-10 text-right">{draft.resumeScore}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3 p-6 border-t border-white/8">
              <button
                onClick={cancelEdit}
                className="flex-1 py-2.5 rounded-xl border border-white/10 text-slate-300 hover:text-white text-sm font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={saveEdit}
                className="flex-1 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <Check size={15} /> Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}