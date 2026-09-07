import React from "react";

interface HeroIllustrationProps {
  className?: string;
}

export default function HeroIllustration({ className = "w-full h-auto max-h-[160px]" }: HeroIllustrationProps) {
  return (
    <svg
      viewBox="0 0 280 210"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      preserveAspectRatio="xMidYMid meet"
      aria-label="Placement Learning Journey"
    >
      <defs>
        {/* Glow Filters */}
        <filter id="hero-glow-purple" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <filter id="hero-glow-soft" x="-15%" y="-15%" width="130%" height="130%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <filter id="hero-card-shadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.25" floodColor="#000000" />
        </filter>

        {/* Gradients */}
        <radialGradient id="hero-bg-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.35" />
          <stop offset="60%" stopColor="#6D28D9" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#4C1D95" stopOpacity="0" />
        </radialGradient>

        <linearGradient id="hero-grad-hoodie" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#9333EA" />
          <stop offset="50%" stopColor="#7C3AED" />
          <stop offset="100%" stopColor="#5B21B6" />
        </linearGradient>

        <linearGradient id="hero-grad-hair" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3E2723" />
          <stop offset="100%" stopColor="#1F1310" />
        </linearGradient>

        <linearGradient id="hero-grad-skin" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFD1B3" />
          <stop offset="100%" stopColor="#F5B28B" />
        </linearGradient>

        <linearGradient id="hero-grad-laptop" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#334155" />
          <stop offset="100%" stopColor="#0F172A" />
        </linearGradient>

        <linearGradient id="hero-grad-screen" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1E1B4B" />
          <stop offset="100%" stopColor="#0F172A" />
        </linearGradient>

        {/* Badge Gradients */}
        <linearGradient id="badge-dsa" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="100%" stopColor="#0284C7" />
        </linearGradient>

        <linearGradient id="badge-aptitude" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FBBF24" />
          <stop offset="100%" stopColor="#EA580C" />
        </linearGradient>

        <linearGradient id="badge-projects" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#34D399" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>

        {/* Rocket Gradients */}
        <linearGradient id="hero-rocket-body" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="60%" stopColor="#E2E8F0" />
          <stop offset="100%" stopColor="#94A3B8" />
        </linearGradient>

        <linearGradient id="hero-rocket-accent" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F43F5E" />
          <stop offset="100%" stopColor="#BE123C" />
        </linearGradient>

        <linearGradient id="hero-flame" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FDE047" />
          <stop offset="60%" stopColor="#FB923C" />
          <stop offset="100%" stopColor="#EF4444" />
        </linearGradient>
      </defs>

      {/* Ambient background glow orb */}
      <circle cx="140" cy="110" r="95" fill="url(#hero-bg-glow)" />

      {/* Floating Sparkles & Tech Nodes */}
      <g opacity="0.85">
        <circle cx="35" cy="45" r="2.5" fill="#A855F7" />
        <circle cx="250" cy="50" r="2" fill="#38BDF8" />
        <circle cx="40" cy="165" r="2" fill="#34D399" />
        <circle cx="260" cy="140" r="3" fill="#FBBF24" />
        <path d="M 235 30 L 237 36 L 243 38 L 237 40 L 235 46 L 233 40 L 227 38 L 233 36 Z" fill="#FDE047" opacity="0.9" />
        <path d="M 45 100 L 46.5 104 L 50.5 105.5 L 46.5 107 L 45 111 L 43.5 107 L 39.5 105.5 L 43.5 104 Z" fill="#C084FC" opacity="0.8" />
      </g>

      {/* =========================================================================
          TOP LEFT FLOATING BADGE: DSA
         ========================================================================= */}
      <g filter="url(#hero-card-shadow)">
        <rect x="24" y="24" width="62" height="24" rx="12" fill="url(#badge-dsa)" />
        <rect x="24" y="24" width="62" height="24" rx="12" fill="none" stroke="#BAE6FD" strokeWidth="1" opacity="0.5" />
        <circle cx="36" cy="36" r="4.5" fill="#FFFFFF" opacity="0.9" />
        <text x="36" y="38.5" fontSize="6.5" fontWeight="900" fill="#0284C7" textAnchor="middle" fontFamily="monospace">&lt;&gt;</text>
        <text x="47" y="39.5" fontSize="9.5" fontWeight="800" fill="#FFFFFF" fontFamily="system-ui, sans-serif" letterSpacing="0.5">DSA</text>
      </g>

      {/* =========================================================================
          LEFT MIDDLE FLOATING BADGE: Aptitude
         ========================================================================= */}
      <g filter="url(#hero-card-shadow)">
        <rect x="14" y="76" width="76" height="24" rx="12" fill="url(#badge-aptitude)" />
        <rect x="14" y="76" width="76" height="24" rx="12" fill="none" stroke="#FEF08A" strokeWidth="1" opacity="0.5" />
        {/* Lightbulb icon */}
        <g transform="translate(25, 83) scale(0.65)">
          <path d="M7 1 C4.2 1 2 3.2 2 6 C2 7.8 3 9.4 4.5 10.3 L4.5 12 C4.5 12.6 4.9 13 5.5 13 L8.5 13 C9.1 13 9.5 12.6 9.5 12 L9.5 10.3 C11 9.4 12 7.8 12 6 C12 3.2 9.8 1 7 1 Z" fill="#FFFFFF" />
          <rect x="5" y="14" width="4" height="1.5" rx="0.75" fill="#FFFFFF" />
        </g>
        <text x="41" y="91.5" fontSize="9" fontWeight="800" fill="#FFFFFF" fontFamily="system-ui, sans-serif">Aptitude</text>
      </g>

      {/* =========================================================================
          TOP RIGHT 3D ROCKET
         ========================================================================= */}
      <g transform="translate(208, 22) rotate(22)" filter="url(#hero-card-shadow)">
        {/* Flame */}
        <path d="M 12 32 C 10 40 14 46 12 50 C 14 46 18 42 16 32 Z" fill="url(#hero-flame)" filter="url(#hero-glow-soft)" />
        <path d="M 13 32 C 12 37 15 41 14 44 C 15 41 17 38 15 32 Z" fill="#FEF08A" />
        {/* Fins */}
        <path d="M 5 24 L 2 32 L 8 30 Z" fill="url(#hero-rocket-accent)" />
        <path d="M 23 24 L 26 32 L 20 30 Z" fill="url(#hero-rocket-accent)" />
        {/* Body */}
        <path d="M 14 2 C 8 10 7 24 7 30 L 21 30 C 21 24 20 10 14 2 Z" fill="url(#hero-rocket-body)" />
        {/* Nose Cone */}
        <path d="M 14 2 C 10.5 7 9.5 13 9 16 L 19 16 C 18.5 13 17.5 7 14 2 Z" fill="url(#hero-rocket-accent)" />
        {/* Porthole */}
        <circle cx="14" cy="20" r="3.5" fill="#0284C7" stroke="#FFFFFF" strokeWidth="1" />
        <circle cx="13" cy="19" r="1" fill="#FFFFFF" opacity="0.8" />
      </g>

      {/* =========================================================================
          RIGHT MIDDLE FLOATING BADGE: Projects
         ========================================================================= */}
      <g filter="url(#hero-card-shadow)">
        <rect x="196" y="80" width="74" height="24" rx="12" fill="url(#badge-projects)" />
        <rect x="196" y="80" width="74" height="24" rx="12" fill="none" stroke="#A7F3D0" strokeWidth="1" opacity="0.5" />
        <g transform="translate(206, 86) scale(0.65)">
          <rect x="1" y="2" width="14" height="12" rx="2" fill="none" stroke="#FFFFFF" strokeWidth="1.8" />
          <path d="M 5 6 L 11 6 M 5 9 L 9 9" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
        </g>
        <text x="223" y="95.5" fontSize="9" fontWeight="800" fill="#FFFFFF" fontFamily="system-ui, sans-serif">Projects</text>
      </g>

      {/* =========================================================================
          BOTTOM RIGHT 3D CHART
         ========================================================================= */}
      <g transform="translate(204, 138)" filter="url(#hero-card-shadow)">
        <rect x="0" y="0" width="64" height="42" rx="8" fill="#1E1B4B" fillOpacity="0.85" stroke="#4C1D95" strokeWidth="1" />
        {/* Bars */}
        <rect x="8" y="24" width="8" height="12" rx="2" fill="#F43F5E" />
        <rect x="20" y="18" width="8" height="18" rx="2" fill="#FBBF24" />
        <rect x="32" y="12" width="8" height="24" rx="2" fill="#38BDF8" />
        <rect x="44" y="6" width="8" height="30" rx="2" fill="#34D399" />
        {/* Trend line */}
        <path d="M 12 22 L 24 16 L 36 10 L 48 4" fill="none" stroke="#A855F7" strokeWidth="2" strokeLinecap="round" />
        <circle cx="48" cy="4" r="2.5" fill="#A855F7" stroke="#FFFFFF" strokeWidth="1" />
      </g>

      {/* =========================================================================
          CENTER: 3D-STYLED STUDENT WITH LAPTOP (PIXAR/SAAS STYLE)
         ========================================================================= */}
      <g id="student-character">
        {/* Hair Back */}
        <ellipse cx="140" cy="74" rx="26" ry="28" fill="url(#hero-grad-hair)" />
        <circle cx="156" cy="56" r="16" fill="url(#hero-grad-hair)" /> {/* High ponytail bun */}
        <ellipse cx="158" cy="62" rx="6" ry="12" fill="#8B5CF6" transform="rotate(-15, 158, 62)" /> {/* Scrunchie */}

        {/* Hoodie / Torso */}
        <path d="M 108 190 C 108 140 120 122 140 122 C 160 122 172 140 172 190 Z" fill="url(#hero-grad-hoodie)" />
        
        {/* Hoodie Strings & Collar */}
        <path d="M 128 126 C 132 136 140 142 140 142 C 140 142 148 136 152 126" fill="none" stroke="#DDD6FE" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M 134 142 L 134 160 M 146 142 L 146 162" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
        
        {/* Arms reaching forward to laptop */}
        <path d="M 112 152 C 114 165 125 178 134 182" fill="none" stroke="url(#hero-grad-hoodie)" strokeWidth="12" strokeLinecap="round" />
        <path d="M 168 152 C 166 165 155 178 146 182" fill="none" stroke="url(#hero-grad-hoodie)" strokeWidth="12" strokeLinecap="round" />

        {/* Neck */}
        <rect x="133" y="106" width="14" height="20" rx="6" fill="url(#hero-grad-skin)" />

        {/* Head */}
        <ellipse cx="140" cy="88" rx="20" ry="22" fill="url(#hero-grad-skin)" />

        {/* Hair Front / Bangs */}
        <path d="M 122 78 C 128 66 148 64 158 74 C 152 74 142 75 136 82 C 130 88 126 86 122 78 Z" fill="url(#hero-grad-hair)" />
        <path d="M 122 84 C 120 90 121 98 123 100" fill="none" stroke="url(#hero-grad-hair)" strokeWidth="3" strokeLinecap="round" />

        {/* Glasses */}
        <rect x="126" y="82" width="11" height="9" rx="3.5" fill="none" stroke="#1E1B4B" strokeWidth="1.8" />
        <rect x="143" y="82" width="11" height="9" rx="3.5" fill="none" stroke="#1E1B4B" strokeWidth="1.8" />
        <path d="M 137 86 L 143 86" stroke="#1E1B4B" strokeWidth="1.5" />

        {/* Eyes (behind glasses) */}
        <ellipse cx="131.5" cy="86.5" rx="2" ry="2.5" fill="#1E1B4B" />
        <circle cx="132" cy="85.5" r="0.8" fill="#FFFFFF" />
        <ellipse cx="148.5" cy="86.5" rx="2" ry="2.5" fill="#1E1B4B" />
        <circle cx="149" cy="85.5" r="0.8" fill="#FFFFFF" />

        {/* Friendly Smile & Cheeks */}
        <ellipse cx="126" cy="93" rx="3" ry="1.5" fill="#F43F5E" opacity="0.3" />
        <ellipse cx="154" cy="93" rx="3" ry="1.5" fill="#F43F5E" opacity="0.3" />
        <path d="M 136 94 Q 140 98 144 94" fill="none" stroke="#9A3412" strokeWidth="1.5" strokeLinecap="round" />

        {/* =========================================================================
            LAPTOP & CODE GLOW
           ========================================================================= */}
        {/* Laptop Screen (Back/Side Angle) */}
        <g transform="translate(105, 140)" filter="url(#hero-card-shadow)">
          {/* Laptop Base */}
          <path d="M 0 46 L 70 46 L 62 54 L 8 54 Z" fill="url(#hero-grad-laptop)" stroke="#475569" strokeWidth="0.8" />
          {/* Trackpad */}
          <rect x="28" y="48" width="14" height="4" rx="1" fill="#1E293B" />

          {/* Laptop Screen Lid */}
          <rect x="10" y="4" width="50" height="38" rx="4" fill="url(#hero-grad-screen)" stroke="#475569" strokeWidth="1" />
          {/* Screen Display Content */}
          <rect x="13" y="7" width="44" height="32" rx="2.5" fill="#090D16" />

          {/* Glowing Code Symbol in IDE */}
          <g filter="url(#hero-glow-soft)">
            <text x="35" y="26" fontSize="13" fontWeight="900" fill="#A855F7" textAnchor="middle" fontFamily="monospace">&lt;/&gt;</text>
          </g>

          {/* Mini IDE code lines */}
          <rect x="17" y="11" width="14" height="2" rx="1" fill="#38BDF8" opacity="0.8" />
          <rect x="17" y="15" width="22" height="1.5" rx="0.75" fill="#E2E8F0" opacity="0.6" />
          <rect x="20" y="30" width="18" height="1.5" rx="0.75" fill="#34D399" opacity="0.7" />
          <rect x="20" y="33" width="28" height="1.5" rx="0.75" fill="#FBBF24" opacity="0.7" />

          {/* Hands Typing */}
          <ellipse cx="24" cy="46" rx="5" ry="3.5" fill="url(#hero-grad-skin)" />
          <ellipse cx="46" cy="46" rx="5" ry="3.5" fill="url(#hero-grad-skin)" />
        </g>
      </g>
    </svg>
  );
}
