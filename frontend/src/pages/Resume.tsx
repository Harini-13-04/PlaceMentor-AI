const Resume = () => {
  return (
    <div className="min-h-screen px-6 py-12">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section — untouched */}
        <div className="text-center space-y-6">
          <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm text-primary">
            ✨ AI Powered Resume Analysis
          </div>

          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-white">
            Resume Upload
          </h1>

          <p className="max-w-3xl mx-auto text-lg text-muted-foreground leading-relaxed">
            Upload your resume and unlock AI-powered resume analysis,
            ATS score, skill insights, personalized recommendations,
            and career guidance tailored for your dream job.
          </p>

          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white backdrop-blur-md">
              🤖 AI Analysis
            </div>

            <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white backdrop-blur-md">
              📄 PDF / DOCX
            </div>

            <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white backdrop-blur-md">
              🔒 Secure & Private
            </div>
          </div>
        </div>

        {/* ── Resume Upload Card ── */}
        <div className="mt-16 flex justify-center">
          <div
            className="
              group relative w-full max-w-2xl
              rounded-3xl border border-dashed border-white/20
              bg-white/5 backdrop-blur-xl
              p-12 md:p-16
              flex flex-col items-center gap-6 text-center
              cursor-pointer select-none
              transition-all duration-300 ease-out
              hover:border-purple-500/60
              hover:bg-white/[0.08]
              hover:shadow-[0_0_48px_-8px_rgba(139,92,246,0.35)]
            "
          >
            {/* Ambient glow blob — decorative, non-interactive */}
            <div
              className="
                pointer-events-none absolute inset-0 rounded-3xl
                opacity-0 group-hover:opacity-100
                transition-opacity duration-500
                bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.08)_0%,transparent_70%)]
              "
            />

            {/* Upload icon */}
            <div
              className="
                relative flex h-20 w-20 items-center justify-center
                rounded-2xl border border-white/10
                bg-gradient-to-br from-purple-600/20 to-blue-600/20
                shadow-[0_0_24px_-4px_rgba(139,92,246,0.4)]
                transition-transform duration-300 group-hover:scale-105
              "
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-9 w-9 text-purple-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                />
              </svg>
            </div>

            {/* Primary label */}
            <div className="space-y-2">
              <p className="text-xl font-semibold text-white tracking-tight">
                Drag &amp; Drop your Resume here
              </p>
              <p className="text-sm text-muted-foreground">
                or click to browse files
              </p>
            </div>

            {/* Browse button */}
            <button
              type="button"
              className="
                relative z-10
                rounded-xl
                bg-gradient-to-r from-purple-600 to-blue-600
                px-8 py-3
                text-sm font-semibold text-white
                shadow-[0_0_20px_-4px_rgba(139,92,246,0.6)]
                transition-all duration-200
                hover:from-purple-500 hover:to-blue-500
                hover:shadow-[0_0_28px_-4px_rgba(139,92,246,0.8)]
                hover:scale-[1.03]
                active:scale-[0.98]
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent
              "
            >
              Browse Files
            </button>

            {/* Meta info */}
            <div className="flex flex-col items-center gap-1">
              <p className="text-xs text-muted-foreground/80">
                Supports&nbsp;
                <span className="text-white/60 font-medium">PDF, DOC, DOCX</span>
              </p>
              <p className="text-xs text-muted-foreground/60">
                Maximum file size:&nbsp;
                <span className="text-white/50 font-medium">5 MB</span>
              </p>
            </div>
          </div>
        </div>
        {/* ── End Resume Upload Card ── */}

        {/* ── Resume Preview Card ── */}
        <div className="mt-8 flex justify-center">
          <div
            className="
              w-full max-w-2xl
              rounded-3xl border border-white/10
              bg-white/5 backdrop-blur-xl
              p-8 md:p-10
              flex flex-col gap-6
            "
          >
            {/* File info row */}
            <div className="flex items-center gap-4">
              {/* File type icon */}
              <div
                className="
                  flex-shrink-0
                  flex h-14 w-14 items-center justify-center
                  rounded-2xl border border-white/10
                  bg-gradient-to-br from-red-500/20 to-orange-500/20
                  shadow-[0_0_20px_-4px_rgba(239,68,68,0.3)]
                "
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-7 w-7 text-red-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                  />
                </svg>
              </div>

              {/* File name + size */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">
                  Aakash_Resume_2025.pdf
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  2.4 MB &nbsp;·&nbsp; PDF Document
                </p>
              </div>

              {/* Upload success badge */}
              <div
                className="
                  flex-shrink-0
                  inline-flex items-center gap-1.5
                  rounded-full border border-emerald-500/30
                  bg-emerald-500/10 px-3 py-1
                  text-xs font-medium text-emerald-400
                "
              >
                {/* Check icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3.5 w-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                Uploaded
              </div>
            </div>

            {/* Action buttons row */}
            <div className="flex flex-wrap gap-3">
              {/* Replace Resume */}
              <button
                type="button"
                className="
                  flex items-center gap-2
                  rounded-xl border border-white/10
                  bg-white/5 px-5 py-2.5
                  text-sm font-medium text-white/80
                  transition-all duration-200
                  hover:bg-white/10 hover:text-white hover:border-white/20
                  active:scale-[0.98]
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500
                "
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.75}
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
                  />
                </svg>
                Replace Resume
              </button>

              {/* Remove */}
              <button
                type="button"
                className="
                  flex items-center gap-2
                  rounded-xl border border-red-500/20
                  bg-red-500/5 px-5 py-2.5
                  text-sm font-medium text-red-400/80
                  transition-all duration-200
                  hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/40
                  active:scale-[0.98]
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500
                "
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.75}
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                  />
                </svg>
                Remove
              </button>
            </div>

            {/* Divider */}
            <div className="border-t border-white/[0.08]" />

            {/* Ready for AI Analysis */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-5">
              {/* Left: icon + text */}
              <div className="flex items-start gap-3 flex-1">
                <div
                  className="
                    flex-shrink-0 mt-0.5
                    flex h-9 w-9 items-center justify-center
                    rounded-xl border border-purple-500/20
                    bg-gradient-to-br from-purple-600/20 to-blue-600/20
                  "
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4.5 w-4.5 h-[18px] w-[18px] text-purple-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.75}
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">
                    Ready for AI Analysis
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                    Your resume is queued. Run a full ATS scan, skill gap report, and career recommendations.
                  </p>
                </div>
              </div>

              {/* Analyze Resume CTA */}
              <button
                type="button"
                className="
                  flex-shrink-0 self-start sm:self-center
                  flex items-center gap-2
                  rounded-xl
                  bg-gradient-to-r from-purple-600 to-blue-600
                  px-6 py-3
                  text-sm font-semibold text-white
                  shadow-[0_0_20px_-4px_rgba(139,92,246,0.6)]
                  transition-all duration-200
                  hover:from-purple-500 hover:to-blue-500
                  hover:shadow-[0_0_28px_-4px_rgba(139,92,246,0.8)]
                  hover:scale-[1.03]
                  active:scale-[0.98]
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent
                "
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
                </svg>
                Analyze Resume
              </button>
            </div>
          </div>
        </div>
        {/* ── End Resume Preview Card ── */}

        {/* ── AI Resume Analysis Dashboard ── */}
        <div className="mt-16 space-y-6">

          {/* Section header */}
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600/30 to-blue-600/30 border border-purple-500/20">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">AI Resume Analysis Dashboard</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Powered by PlaceMentor AI · Last analyzed just now</p>
            </div>
            <div className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Analysis Complete
            </div>
          </div>

          {/* ── Row 1: ATS Score (large) + Strengths + Improvements ── */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* 1A — ATS Score Card */}
            <div className="group relative rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 flex flex-col items-center gap-5 overflow-hidden transition-all duration-300 hover:border-purple-500/30 hover:shadow-[0_0_40px_-8px_rgba(139,92,246,0.3)]">
              <div className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(ellipse_at_top,rgba(139,92,246,0.07)_0%,transparent_70%)]" />

              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">ATS Score</p>

              {/* Circular progress via SVG */}
              <div className="relative flex items-center justify-center">
                <svg width="148" height="148" viewBox="0 0 148 148" className="-rotate-90" aria-hidden="true">
                  {/* Track */}
                  <circle cx="74" cy="74" r="62" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
                  {/* Progress — 88% of circumference (2π×62 ≈ 389.6) → 342.9 dash, 46.7 gap */}
                  <circle
                    cx="74" cy="74" r="62"
                    fill="none"
                    stroke="url(#atsGrad)"
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray="342.9 46.7"
                  />
                  <defs>
                    <linearGradient id="atsGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#a855f7" />
                      <stop offset="100%" stopColor="#3b82f6" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-4xl font-bold text-white tracking-tight">88</span>
                  <span className="text-sm text-muted-foreground font-medium">/ 100</span>
                </div>
              </div>

              {/* Rating label */}
              <div className="inline-flex items-center gap-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1.5 text-xs font-semibold text-purple-300">
                🏆 Excellent Match
              </div>

              {/* Mini stat row */}
              <div className="w-full grid grid-cols-3 gap-2 pt-1">
                {[
                  { label: "Keywords", val: "92%" },
                  { label: "Format",   val: "85%" },
                  { label: "Clarity",  val: "90%" },
                ].map(({ label, val }) => (
                  <div key={label} className="flex flex-col items-center gap-1 rounded-xl border border-white/[0.07] bg-white/[0.04] py-2.5 px-1">
                    <span className="text-sm font-bold text-white">{val}</span>
                    <span className="text-[10px] text-muted-foreground">{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 1B — Resume Strengths */}
            <div className="group relative rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-7 flex flex-col gap-5 overflow-hidden transition-all duration-300 hover:border-emerald-500/30 hover:shadow-[0_0_40px_-8px_rgba(16,185,129,0.2)]">
              <div className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.05)_0%,transparent_70%)]" />

              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Resume Strengths</p>
                  <p className="text-[11px] text-muted-foreground">4 strong areas detected</p>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                {[
                  { label: "Strong Projects",   score: 95, color: "from-emerald-500 to-teal-500" },
                  { label: "Good Formatting",   score: 88, color: "from-emerald-500 to-teal-500" },
                  { label: "Clear Education",   score: 91, color: "from-emerald-500 to-teal-500" },
                  { label: "Technical Skills",  score: 86, color: "from-emerald-500 to-teal-500" },
                ].map(({ label, score, color }) => (
                  <div key={label} className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-white/80">{label}</span>
                      <span className="text-xs font-bold text-emerald-400">{score}%</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-white/[0.07]">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${color}`}
                        style={{ width: `${score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 1C — Improvement Areas */}
            <div className="group relative rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-7 flex flex-col gap-5 overflow-hidden transition-all duration-300 hover:border-amber-500/30 hover:shadow-[0_0_40px_-8px_rgba(245,158,11,0.2)]">
              <div className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(ellipse_at_top,rgba(245,158,11,0.05)_0%,transparent_70%)]" />

              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/20">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Improvement Areas</p>
                  <p className="text-[11px] text-muted-foreground">4 areas to optimize</p>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                {[
                  { label: "Add measurable achievements", priority: "High",   score: 42 },
                  { label: "Improve keywords",             priority: "Medium", score: 60 },
                  { label: "Add certifications",           priority: "Medium", score: 55 },
                  { label: "Optimize summary",             priority: "Low",    score: 70 },
                ].map(({ label, priority, score }) => (
                  <div key={label} className="flex items-center gap-3">
                    <div className="flex-1 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-white/80 leading-snug">{label}</span>
                        <span className={`text-[10px] font-semibold rounded-full px-2 py-0.5 border ${
                          priority === "High"
                            ? "text-red-400 bg-red-500/10 border-red-500/20"
                            : priority === "Medium"
                            ? "text-amber-400 bg-amber-500/10 border-amber-500/20"
                            : "text-sky-400 bg-sky-500/10 border-sky-500/20"
                        }`}>{priority}</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-white/[0.07]">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500"
                          style={{ width: `${score}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Row 2: AI Recommendations (full width) ── */}
          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-7 md:p-8 space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600/20 to-blue-600/20 border border-purple-500/20">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-bold text-white">AI Recommendations</p>
                  <p className="text-[11px] text-muted-foreground">Personalized suggestions to improve your resume score</p>
                </div>
              </div>
              <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-purple-500/20 bg-purple-500/10 px-3 py-1 text-[11px] font-medium text-purple-300">
                4 suggestions
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  icon: "📊",
                  title: "Quantify Your Impact",
                  desc: "Add numbers and metrics to project descriptions. e.g. \"Improved API response time by 40%\" ranks significantly higher in ATS scans.",
                  tag: "High Impact",
                  tagColor: "text-purple-300 bg-purple-500/10 border-purple-500/20",
                  glow: "hover:border-purple-500/30 hover:shadow-[0_0_24px_-6px_rgba(139,92,246,0.3)]",
                },
                {
                  icon: "🔑",
                  title: "Add Role-Specific Keywords",
                  desc: "Include terms like \"microservices\", \"CI/CD\", and \"system design\" to better match Software Engineer job descriptions.",
                  tag: "ATS Boost",
                  tagColor: "text-blue-300 bg-blue-500/10 border-blue-500/20",
                  glow: "hover:border-blue-500/30 hover:shadow-[0_0_24px_-6px_rgba(59,130,246,0.3)]",
                },
                {
                  icon: "🏅",
                  title: "Add Certifications Section",
                  desc: "AWS, GCP, or relevant certifications increase recruiter trust by 35%. Even in-progress certifications are worth listing.",
                  tag: "Credibility",
                  tagColor: "text-emerald-300 bg-emerald-500/10 border-emerald-500/20",
                  glow: "hover:border-emerald-500/30 hover:shadow-[0_0_24px_-6px_rgba(16,185,129,0.25)]",
                },
                {
                  icon: "✍️",
                  title: "Rewrite Your Summary",
                  desc: "Your current summary is too generic. Lead with your specialization and years of experience to grab recruiter attention in 6 seconds.",
                  tag: "First Impression",
                  tagColor: "text-amber-300 bg-amber-500/10 border-amber-500/20",
                  glow: "hover:border-amber-500/30 hover:shadow-[0_0_24px_-6px_rgba(245,158,11,0.25)]",
                },
              ].map(({ icon, title, desc, tag, tagColor, glow }) => (
                <div
                  key={title}
                  className={`group relative rounded-2xl border border-white/[0.08] bg-white/[0.04] p-5 flex flex-col gap-3 transition-all duration-300 ${glow}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="text-xl" aria-hidden="true">{icon}</span>
                      <p className="text-sm font-semibold text-white leading-snug">{title}</p>
                    </div>
                    <span className={`flex-shrink-0 text-[10px] font-semibold rounded-full px-2.5 py-1 border ${tagColor}`}>
                      {tag}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Row 3: Skill Match + Resume Rating ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Skill Match Card */}
            <div className="group relative rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-7 flex flex-col gap-5 overflow-hidden transition-all duration-300 hover:border-blue-500/30 hover:shadow-[0_0_40px_-8px_rgba(59,130,246,0.2)]">
              <div className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(ellipse_at_top_left,rgba(59,130,246,0.06)_0%,transparent_70%)]" />

              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-500/10 border border-blue-500/20">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Skill Match</p>
                  <p className="text-[11px] text-muted-foreground">Skills detected from your resume</p>
                </div>
                <div className="ml-auto text-xs font-bold text-blue-400">14 matched</div>
              </div>

              <div className="flex flex-wrap gap-2">
                {[
                  { name: "React",         glow: "rgba(96,165,250,0.4)"  },
                  { name: "TypeScript",    glow: "rgba(139,92,246,0.4)"  },
                  { name: "Node.js",       glow: "rgba(52,211,153,0.4)"  },
                  { name: "Python",        glow: "rgba(250,204,21,0.35)" },
                  { name: "REST APIs",     glow: "rgba(96,165,250,0.4)"  },
                  { name: "PostgreSQL",    glow: "rgba(139,92,246,0.35)" },
                  { name: "Docker",        glow: "rgba(96,165,250,0.35)" },
                  { name: "Git",           glow: "rgba(251,146,60,0.35)" },
                  { name: "Tailwind CSS",  glow: "rgba(20,184,166,0.35)" },
                  { name: "AWS",           glow: "rgba(251,146,60,0.35)" },
                  { name: "GraphQL",       glow: "rgba(236,72,153,0.35)" },
                  { name: "Jest",          glow: "rgba(52,211,153,0.35)" },
                  { name: "Redis",         glow: "rgba(239,68,68,0.35)"  },
                  { name: "Figma",         glow: "rgba(139,92,246,0.35)" },
                ].map(({ name, glow }) => (
                  <span
                    key={name}
                    className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-xs font-medium text-white/80 transition-all duration-200 hover:bg-white/10 hover:text-white hover:border-white/20"
                    style={{ boxShadow: `0 0 10px -2px ${glow}` }}
                  >
                    {name}
                  </span>
                ))}
              </div>
            </div>

            {/* Resume Rating Card */}
            <div className="group relative rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-7 flex flex-col gap-5 overflow-hidden transition-all duration-300 hover:border-purple-500/30 hover:shadow-[0_0_40px_-8px_rgba(139,92,246,0.2)]">
              <div className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(ellipse_at_top_right,rgba(139,92,246,0.06)_0%,transparent_70%)]" />

              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600/20 to-blue-600/20 border border-purple-500/20">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Resume Rating</p>
                  <p className="text-[11px] text-muted-foreground">Category breakdown</p>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                {[
                  { category: "Content Quality",    rating: 4.4, max: 5, color: "from-purple-500 to-blue-500" },
                  { category: "ATS Compatibility",  rating: 4.6, max: 5, color: "from-purple-500 to-blue-500" },
                  { category: "Visual Design",      rating: 4.2, max: 5, color: "from-purple-500 to-blue-500" },
                  { category: "Keyword Density",    rating: 3.8, max: 5, color: "from-amber-500 to-orange-500" },
                  { category: "Impact Language",    rating: 3.5, max: 5, color: "from-amber-500 to-orange-500" },
                ].map(({ category, rating, max, color }) => (
                  <div key={category} className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-white/80">{category}</span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-white">{rating}</span>
                        <span className="text-[10px] text-muted-foreground">/ {max}</span>
                      </div>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-white/[0.07]">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${color}`}
                        style={{ width: `${(rating / max) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Overall rating */}
              <div className="mt-auto flex items-center justify-between rounded-2xl border border-white/[0.08] bg-white/[0.04] px-5 py-3.5">
                <span className="text-xs font-semibold text-white/70">Overall Resume Score</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">4.3</span>
                  <span className="text-xs text-muted-foreground">/ 5.0</span>
                </div>
              </div>
            </div>
          </div>

        </div>
        {/* ── End AI Resume Analysis Dashboard ── */}

      </div>
    </div>
  );
};

export default Resume;