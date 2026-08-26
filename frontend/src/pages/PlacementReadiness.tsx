import React, { useState } from "react";
import { Target, Building2, Sparkles, CheckCircle2, TrendingUp } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function PlacementReadiness() {
  const { user } = useAuth();
  const studentName = user?.name || user?.full_name || "Student";
  const [readinessPercentage] = useState(78);

  const skillsData = [
    { name: "Data Structures & Algorithms", percentage: 88, color: "#14B8A6" },
    { name: "System Design", percentage: 62, color: "#F59E0B" },
    { name: "OOP & Design Patterns", percentage: 91, color: "#10B981" },
    { name: "Databases & SQL", percentage: 75, color: "#3B82F6" },
    { name: "Operating Systems", percentage: 58, color: "#F59E0B" },
    { name: "Networking", percentage: 42, color: "#EF4444" },
    { name: "HR & Behavioral Round", percentage: 83, color: "#14B8A6" },
  ];

  const readinessAreas = [
    { label: "DSA, OOP, HR (High Readiness)", color: "bg-emerald-500" },
    { label: "System Design, Databases (Moderate)", color: "bg-amber-500" },
    { label: "Networking, OS (Focus Area)", color: "bg-rose-500" },
  ];

  const CircularProgress = ({ percentage }: { percentage: number }) => {
    const radius = 45;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    return (
      <svg width="120" height="120" style={{ transform: "rotate(-90deg)" }}>
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="currentColor"
          className="text-secondary"
          strokeWidth="8"
        />

        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="#14B8A6"
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />

        <text
          x="60"
          y="65"
          textAnchor="middle"
          fontSize="24"
          fontWeight="bold"
          fill="currentColor"
          className="text-foreground font-sans"
          style={{
            transform: "rotate(90deg)",
            transformOrigin: "60px 65px",
          }}
        >
          {percentage}%
        </text>
      </svg>
    );
  };

  return (
    <div className="space-y-6 font-sans text-foreground">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-border">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-teal-600 dark:text-teal-400 mb-1">
            <Target className="w-4 h-4" />
            <span>Placement Readiness Index</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            {studentName}'s Career Dashboard
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Real-time competency assessment across core computer science and interview domains.
          </p>
        </div>

        <div className="px-5 py-2.5 rounded-xl border border-border bg-card shadow-sm flex items-center gap-3 self-start sm:self-auto">
          <div>
            <div className="text-[11px] font-semibold text-muted-foreground uppercase">Readiness Score</div>
            <div className="text-2xl font-bold text-teal-600 dark:text-teal-400 font-mono">{readinessPercentage}%</div>
          </div>
        </div>
      </div>

      {/* Top Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Skills Breakdown */}
        <div className="p-6 rounded-xl border border-border bg-card shadow-sm space-y-5">
          <div className="flex justify-between items-center pb-2 border-b border-border">
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-teal-500" />
              <span>Technical Skills Breakdown</span>
            </h2>
            <span className="text-xs font-medium px-2 py-0.5 rounded bg-secondary text-muted-foreground">
              {skillsData.length} Evaluated Domains
            </span>
          </div>

          <div className="space-y-4">
            {skillsData.map((skill) => (
              <div key={skill.name} className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-foreground">{skill.name}</span>
                  <span className="font-bold font-mono text-foreground">{skill.percentage}%</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-1.5 overflow-hidden">
                  <div
                    className="h-1.5 rounded-full transition-all duration-300"
                    style={{
                      width: `${skill.percentage}%`,
                      backgroundColor: skill.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Circular Readiness Gauge */}
        <div className="p-6 rounded-xl border border-border bg-card shadow-sm flex flex-col items-center justify-between">
          <div className="w-full flex justify-between items-center pb-2 border-b border-border">
            <h2 className="text-base font-bold text-foreground">Interview Readiness Score</h2>
            <span className="text-xs font-semibold text-teal-600 dark:text-teal-400">Target: Top Tier</span>
          </div>

          <div className="py-6 flex flex-col items-center">
            <CircularProgress percentage={readinessPercentage} />
            <p className="mt-3 text-xs text-muted-foreground font-medium">Ready for on-campus & off-campus drives</p>
          </div>

          <div className="w-full space-y-2 pt-4 border-t border-border text-xs">
            {readinessAreas.map((item) => (
              <div key={item.label} className="flex items-center gap-2.5">
                <div className={`w-2 h-2 rounded-full ${item.color} flex-shrink-0`} />
                <span className="text-muted-foreground font-medium">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Company Readiness */}
        <div className="p-6 rounded-xl border border-border bg-card shadow-sm space-y-5">
          <h2 className="text-base font-bold text-foreground flex items-center gap-2 pb-2 border-b border-border">
            <Building2 className="w-4 h-4 text-teal-500" />
            <span>Target Company Benchmarks</span>
          </h2>

          <div className="space-y-3.5">
            {[
              { company: "Amazon", score: 81, color: "bg-teal-500" },
              { company: "Microsoft", score: 76, color: "bg-teal-600" },
              { company: "Google", score: 72, color: "bg-amber-500" },
              { company: "TCS (Digital / Prime)", score: 99, color: "bg-emerald-500" },
              { company: "Infosys (Specialist Programmer)", score: 95, color: "bg-emerald-500" },
              { company: "Cognizant", score: 92, color: "bg-emerald-500" },
            ].map((item) => (
              <div key={item.company} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-foreground">{item.company}</span>
                  <span className="font-bold font-mono text-foreground">{item.score}%</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`${item.color} h-1.5 rounded-full transition-all duration-300`}
                    style={{ width: `${item.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Recommendations */}
        <div className="p-6 rounded-xl border border-border bg-card shadow-sm space-y-4">
          <h2 className="text-base font-bold text-foreground flex items-center gap-2 pb-2 border-b border-border">
            <Sparkles className="w-4 h-4 text-teal-500" />
            <span>Placement Action Items</span>
          </h2>

          <div className="space-y-3">
            {[
              {
                title: "Practice Dynamic Programming & Trees",
                description: "Solve 5 medium DP and Binary Tree problems to reach 85%+ on product company benchmarks.",
              },
              {
                title: "Revise Computer Networks (OSI & TCP/IP)",
                description: "Review transport layer protocols and socket programming concepts.",
              },
              {
                title: "Conduct Mock Technical Interview",
                description: "Practice explaining time and space complexity clearly under 20-minute timed scenarios.",
              },
              {
                title: "Boost Resume ATS Score",
                description: "Add quantifiable impact metrics to your top 2 backend/frontend projects.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="p-3.5 rounded-lg border border-border bg-secondary/30 hover:bg-secondary/60 transition-colors space-y-1"
              >
                <h3 className="text-xs font-bold text-foreground">{item.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}