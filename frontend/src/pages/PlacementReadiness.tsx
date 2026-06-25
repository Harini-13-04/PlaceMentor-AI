import React, { useState } from "react";
import { Target } from "lucide-react";

export default function PlacementReadiness() {
  const [readinessPercentage] = useState(78);

  const skillsData = [
    { name: "Data Structures & Algorithms", percentage: 88, color: "#3B82F6" },
    { name: "System Design", percentage: 62, color: "#F59E0B" },
    { name: "OOP & Design Patterns", percentage: 91, color: "#10B981" },
    { name: "Databases & SQL", percentage: 75, color: "#3B82F6" },
    { name: "Operating Systems", percentage: 58, color: "#F97316" },
    { name: "Networking", percentage: 42, color: "#EF4444" },
    { name: "HR Round", percentage: 83, color: "#A855F7" },
  ];

  const readinessAreas = [
    { label: "DSA, OOP, HR", color: "bg-green-400" },
    { label: "System Design, OS", color: "bg-yellow-400" },
    { label: "Networking", color: "bg-red-400" },
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
          stroke="rgba(100,116,139,0.3)"
          strokeWidth="8"
        />

        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="#3B82F6"
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />

        <text
          x="60"
          y="65"
          textAnchor="middle"
          fontSize="26"
          fontWeight="bold"
          fill="#3B82F6"
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-6">

      {/* Header */}

      <div className="flex justify-between items-start mb-8">

        <div>

          <p className="text-blue-400 text-sm mb-1">
            📌 PLACEMENT READINESS
          </p>

          <h1 className="text-4xl font-bold mb-2">
            Harini's Career Dashboard
          </h1>

          <p className="text-gray-400">
            Last Updated Today • Level 12 • 4500 XP
          </p>

        </div>

        <div className="bg-gray-800 rounded-full px-6 py-3">

          <p className="text-green-400 text-3xl font-bold">
            {readinessPercentage}%
          </p>

          <p className="text-gray-400 text-sm">
            Overall Readiness
          </p>

        </div>

      </div>

      {/* Top Grid */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Skills */}

        <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">

          <div className="flex justify-between items-center mb-6">

            <h2 className="flex items-center gap-2 text-lg font-bold">

              <Target className="w-5 h-5" />

              Skills Breakdown

            </h2>

            <span className="bg-blue-600 px-3 py-1 rounded text-xs">
              {skillsData.length} Skills
            </span>

          </div>

          <div className="space-y-5">

            {skillsData.map((skill) => (

              <div key={skill.name}>

                <div className="flex justify-between mb-2">

                  <span>{skill.name}</span>

                  <span
                    style={{ color: skill.color }}
                    className="font-semibold"
                  >
                    {skill.percentage}%
                  </span>

                </div>

                <div className="w-full bg-gray-700 rounded-full h-2">

                  <div
                    className="h-2 rounded-full"
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

        {/* Readiness */}

        <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 flex flex-col items-center">

          <h2 className="text-lg font-bold mb-8 w-full">
            Readiness Score
          </h2>

          <CircularProgress percentage={readinessPercentage} />

          <p className="mt-4 text-gray-400">
            Ready for Placements
          </p>

          <div className="w-full mt-8 space-y-3">

            {readinessAreas.map((item) => (

              <div
                key={item.label}
                className="flex items-center gap-3"
              >

                <div
                  className={`w-2 h-2 rounded-full ${item.color}`}
                />

                <span className="text-gray-400">
                  {item.label}
                </span>

              </div>

            ))}

          </div>

        </div>

      </div>      {/* Bottom Grid */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">

        {/* Company Readiness */}

        <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">

          <h2 className="text-lg font-bold mb-6">
            🏢 Company Readiness
          </h2>

          {[
            { company: "Google", score: 72, color: "bg-blue-500" },
            { company: "Amazon", score: 81, color: "bg-yellow-500" },
            { company: "Microsoft", score: 76, color: "bg-cyan-500" },
            { company: "Zoho", score: 94, color: "bg-green-500" },
            { company: "TCS", score: 99, color: "bg-purple-500" },
            { company: "Infosys", score: 100, color: "bg-emerald-500" },
          ].map((item) => (

            <div key={item.company} className="mb-5">

              <div className="flex justify-between mb-2">

                <span className="text-gray-300">
                  {item.company}
                </span>

                <span className="font-semibold">
                  {item.score}%
                </span>

              </div>

              <div className="w-full bg-gray-700 rounded-full h-2">

                <div
                  className={`${item.color} h-2 rounded-full transition-all duration-500`}
                  style={{ width: `${item.score}%` }}
                />

              </div>

            </div>

          ))}

        </div>

        {/* AI Suggestions */}

        <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">

          <h2 className="text-lg font-bold mb-6">
            🤖 AI Suggestions
          </h2>

          {[
            {
              title: "Practice Dynamic Programming",
              description: "Complete 5 medium DP problems this week.",
            },
            {
              title: "Revise Networking",
              description: "Spend 2 hours on OSI & TCP/IP.",
            },
            {
              title: "Take Mock Interview",
              description: "Finish one technical mock interview.",
            },
            {
              title: "Improve Resume",
              description: "Increase ATS score above 85%.",
            },
          ].map((item) => (

            <div
              key={item.title}
              className="mb-4 rounded-lg border border-gray-700 bg-gray-700/30 p-4 hover:border-blue-500 transition-all"
            >

              <h3 className="font-semibold text-white mb-2">
                {item.title}
              </h3>

              <p className="text-sm text-gray-400">
                {item.description}
              </p>

            </div>

          ))}

        </div>

      </div>

    </div>
  );
}