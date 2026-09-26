import React from 'react';

// Hand-drawn 4-point doodle sparkle star
export const DoodleStar: React.FC<{ className?: string }> = ({ className = 'w-5 h-5 text-[#fbeee0]' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M12 2C12.5 7 14 10.5 19 11.5C14 12.5 12.5 16 12 22C11.5 16 10 12.5 5 11.5C10 10.5 11.5 7 12 2Z" />
  </svg>
);

// Hand-drawn cute crown doodle (as seen on the speech bubble and bottom cards)
export const CrownDoodle: React.FC<{ className?: string }> = ({ className = 'w-6 h-5 text-[#fbeee0]' }) => (
  <svg
    viewBox="0 0 32 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M4 18L7 6L16 14L25 6L28 18H4Z" />
    <circle cx="7" cy="4" r="1.5" fill="currentColor" />
    <circle cx="16" cy="11" r="1.5" fill="currentColor" />
    <circle cx="25" cy="4" r="1.5" fill="currentColor" />
  </svg>
);

// Hand-drawn rays/spark doodle (e.g. next to "Hi, I'm" and "About Me")
export const DoodleRays: React.FC<{ className?: string }> = ({ className = 'w-5 h-5 text-[#fbeee0]' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M6 5L14 3" />
    <path d="M8 12L17 11" />
    <path d="M7 19L15 20" />
  </svg>
);

// Hand-drawn wavy underline doodle (seen under About Me)
export const WavyUnderline: React.FC<{ className?: string }> = ({ className = 'w-24 h-4 text-[#fbeee0]' }) => (
  <svg
    viewBox="0 0 100 20"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M5 12C15 6 25 18 35 12C45 6 55 18 65 12C75 6 85 18 95 12" />
  </svg>
);

// Hand-drawn playful speech bubble container for "Node Operator"
export const SpeechBubble: React.FC<{
  text: string;
  className?: string;
}> = ({ text, className = '' }) => (
  <div className={`relative inline-block ${className}`}>
    {/* Crown on top */}
    <div className="absolute -top-3.5 left-2.5 rotate-[-12deg] z-10">
      <CrownDoodle className="w-4 h-3.5 text-[#fbeee0]" />
    </div>

    {/* Speech Bubble Pill */}
    <div className="relative px-3.5 py-1.5 rounded-[16px] border-2 border-[#fbeee0] bg-[#141b26] text-center shadow-md transform rotate-[-3deg] hover:rotate-0 transition-transform duration-300">
      <span className="font-fredoka text-sm sm:text-base font-medium tracking-wide text-[#fbeee0] whitespace-nowrap block">
        {text}
      </span>

      {/* Bubble Tail Centered */}
      <svg
        className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-4 h-3 text-[#fbeee0]"
        viewBox="0 0 20 16"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M4 0L10 15L16 0H4Z" />
      </svg>
    </div>
  </div>
);

// Crisp Network Logos matching the uploaded design
export const AptosLogo: React.FC<{ className?: string }> = ({ className = 'w-9 h-9' }) => (
  <div className={`relative flex items-center justify-center rounded-xl bg-white/10 ${className}`}>
    <svg viewBox="0 0 40 40" fill="currentColor" className="w-6 h-6 text-white" aria-label="Aptos">
      <circle cx="20" cy="20" r="18" fill="#18212e" />
      {/* Aptos modern layered line pattern */}
      <path d="M10 22C10 22 15 20 20 20C25 20 30 22 30 22" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M12 16C12 16 16 14 20 14C24 14 28 16 28 16" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M14 28C14 28 17 26 20 26C23 26 26 28 26 28" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  </div>
);

export const SeiLogo: React.FC<{ className?: string }> = ({ className = 'w-9 h-9' }) => (
  <div className={`relative flex items-center justify-center rounded-xl bg-[#c93f4c]/15 ${className}`}>
    <svg viewBox="0 0 40 40" fill="none" className="w-6 h-6" aria-label="Sei">
      <circle cx="20" cy="20" r="18" fill="#1e1820" />
      {/* Sei iconic wave symbol */}
      <path
        d="M11 16C13 14 17 14 19 16C21 18 25 18 27 16"
        stroke="#ea5363"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M13 21C15 19 19 19 21 21C23 23 27 23 29 21"
        stroke="#ea5363"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M15 26C17 24 20 24 22 26C24 28 27 28 28 27"
        stroke="#ea5363"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  </div>
);

export const SubQueryLogo: React.FC<{ className?: string }> = ({ className = 'w-9 h-9' }) => (
  <div className={`relative flex items-center justify-center rounded-xl bg-[#8c52ff]/15 ${className}`}>
    <svg viewBox="0 0 40 40" fill="none" className="w-6 h-6" aria-label="SubQuery">
      <circle cx="20" cy="20" r="18" fill="#1b182b" />
      {/* SubQuery vibrant SQ loop */}
      <path
        d="M14 25C12 23 11 20 12 17C13 13 17 11 21 11C25 11 28 14 28 18C28 22 25 24 21 24H18"
        stroke="url(#sq-grad)"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M26 15C28 17 29 20 28 23C27 27 23 29 19 29C15 29 12 26 12 22C12 18 15 16 19 16H22"
        stroke="url(#sq-grad)"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <defs>
        <linearGradient id="sq-grad" x1="10" y1="10" x2="30" y2="30" gradientUnits="userSpaceOnUse">
          <stop stopColor="#673ab7" />
          <stop offset="0.6" stopColor="#9c27b0" />
          <stop offset="1" stopColor="#e91e63" />
        </linearGradient>
      </defs>
    </svg>
  </div>
);

// GitHub Icon
export const GitHubIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-label="GitHub">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 2C6.477 2 2 6.484 2 12.017C2 16.446 4.87 20.198 8.84 21.524C9.34 21.616 9.52 21.306 9.52 21.042C9.52 20.806 9.51 20.021 9.51 19.186C6.73 19.789 6.14 17.844 6.14 17.844C5.68 16.678 5.03 16.368 5.03 16.368C4.12 15.748 5.1 15.762 5.1 15.762C6.1 15.834 6.63 16.793 6.63 16.793C7.52 18.324 8.97 17.882 9.54 17.625C9.63 16.979 9.89 16.538 10.17 16.29C7.95 16.037 5.62 15.176 5.62 11.341C5.62 10.247 6.01 9.352 6.65 8.653C6.55 8.399 6.2 7.38 6.75 6.009C6.75 6.009 7.59 5.739 9.5 7.034C10.3 6.811 11.15 6.7 12 6.696C12.85 6.7 13.7 6.811 14.5 7.034C16.41 5.739 17.25 6.009 17.25 6.009C17.8 7.38 17.45 8.399 17.35 8.653C17.99 9.352 18.38 10.247 18.38 11.341C18.38 15.187 16.04 16.034 13.82 16.282C14.18 16.593 14.5 17.206 14.5 18.146C14.5 19.493 14.49 20.579 14.49 20.91C14.49 21.177 14.67 21.491 15.18 21.391C19.14 20.06 22 16.31 22 11.884C22 6.484 17.523 2 12 2Z"
    />
  </svg>
);

// X (formerly Twitter) Icon
export const XIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-label="X">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

// Handcrafted Technical Skills Section Header Icon (Non-AI-slop, matches cozy anime tech theme)
export const TechTerminalDoodle: React.FC<{ className?: string }> = ({
  className = 'w-4 h-4 text-[#9d613c]',
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    {/* Retro Terminal Frame with soft rounded corners */}
    <rect x="2.5" y="3.5" width="19" height="17" rx="3.5" stroke="#9d613c" />
    {/* Hand-drawn terminal titlebar line */}
    <line x1="2.5" y1="8" x2="21.5" y2="8" stroke="#9d613c" strokeWidth="1.6" opacity="0.6" />
    {/* Terminal prompt symbol > */}
    <path d="M6.5 11.5L9.5 14L6.5 16.5" stroke="#fbeee0" strokeWidth="2" />
    {/* Terminal cursor _ */}
    <line x1="11.5" y1="16.5" x2="16" y2="16.5" stroke="#fbeee0" strokeWidth="2" />
  </svg>
);

// Hand-drawn micro-icons for individual skills (replaces generic emojis)
export const LinuxTerminalIcon: React.FC<{ className?: string }> = ({ className = 'w-3.5 h-3.5' }) => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <rect x="2" y="3" width="16" height="14" rx="2.5" stroke="#9d613c" strokeWidth="1.8" />
    <path d="M5.5 8L8 10L5.5 12" stroke="#fbeee0" />
    <line x1="10" y1="12" x2="14" y2="12" stroke="#fbeee0" />
  </svg>
);

export const DockerContainerIcon: React.FC<{ className?: string }> = ({ className = 'w-3.5 h-3.5' }) => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <path d="M10 2L17 6V14L10 18L3 14V6L10 2Z" stroke="#9d613c" />
    <path d="M10 2V18" stroke="#9d613c" strokeDasharray="2 2" />
    <path d="M3 6L10 10L17 6" stroke="#9d613c" />
    <rect x="7" y="11" width="2.5" height="2.5" fill="#fbeee0" />
    <rect x="11" y="11" width="2.5" height="2.5" fill="#fbeee0" />
  </svg>
);

export const K8sClusterIcon: React.FC<{ className?: string }> = ({ className = 'w-3.5 h-3.5' }) => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <circle cx="10" cy="10" r="3" stroke="#fbeee0" fill="#9d613c" />
    <circle cx="10" cy="3" r="1.5" fill="#fbeee0" />
    <circle cx="16" cy="6.5" r="1.5" fill="#fbeee0" />
    <circle cx="16" cy="13.5" r="1.5" fill="#fbeee0" />
    <circle cx="10" cy="17" r="1.5" fill="#fbeee0" />
    <circle cx="4" cy="13.5" r="1.5" fill="#fbeee0" />
    <circle cx="4" cy="6.5" r="1.5" fill="#fbeee0" />
    <line x1="10" y1="7" x2="10" y2="4.5" stroke="#9d613c" />
    <line x1="12.5" y1="8.5" x2="14.8" y2="7.3" stroke="#9d613c" />
    <line x1="12.5" y1="11.5" x2="14.8" y2="12.7" stroke="#9d613c" />
    <line x1="10" y1="13" x2="10" y2="15.5" stroke="#9d613c" />
    <line x1="7.5" y1="11.5" x2="5.2" y2="12.7" stroke="#9d613c" />
    <line x1="7.5" y1="8.5" x2="5.2" y2="7.3" stroke="#9d613c" />
  </svg>
);

export const NodeSecurityIcon: React.FC<{ className?: string }> = ({ className = 'w-3.5 h-3.5' }) => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <path d="M10 2.5L16.5 5.5V10.5C16.5 14.5 13.5 17 10 18C6.5 17 3.5 14.5 3.5 10.5V5.5L10 2.5Z" stroke="#9d613c" fill="#141c28" />
    <circle cx="10" cy="9.5" r="1.5" fill="#fbeee0" />
    <path d="M10 11V13.5" stroke="#fbeee0" strokeWidth="1.8" />
  </svg>
);

export const TelemetryWaveIcon: React.FC<{ className?: string }> = ({ className = 'w-3.5 h-3.5' }) => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <path d="M2.5 11.5L6 11.5L8 5.5L12 15L14 9.5L15.5 11.5L17.5 11.5" stroke="#9d613c" />
    <circle cx="8" cy="5.5" r="1.2" fill="#fbeee0" />
    <circle cx="12" cy="15" r="1.2" fill="#fbeee0" />
  </svg>
);

export const SlashingGuardIcon: React.FC<{ className?: string }> = ({ className = 'w-3.5 h-3.5' }) => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <path d="M11 2L4.5 10.5H10L9 18L15.5 9.5H10L11 2Z" stroke="#9d613c" fill="#9d613c" fillOpacity="0.2" />
  </svg>
);

export const StateSyncIcon: React.FC<{ className?: string }> = ({ className = 'w-3.5 h-3.5' }) => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <path d="M4 10A6 6 0 0 1 14.5 5.8L16 4" stroke="#9d613c" />
    <path d="M16 4V7.5H12.5" stroke="#fbeee0" />
    <path d="M16 10A6 6 0 0 1 5.5 14.2L4 16" stroke="#9d613c" />
    <path d="M4 16V12.5H7.5" stroke="#fbeee0" />
  </svg>
);

export const BashScriptIcon: React.FC<{ className?: string }> = ({ className = 'w-3.5 h-3.5' }) => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <path d="M4 6.5L8.5 10L4 13.5" stroke="#9d613c" />
    <line x1="10.5" y1="13.5" x2="16" y2="13.5" stroke="#fbeee0" />
  </svg>
);

// Hand-drawn sketchbook masking / washi tape strip for card top edge
export const DoodleTape: React.FC<{ className?: string }> = ({
  className = 'w-24 h-6',
}) => (
  <svg
    viewBox="0 0 110 26"
    fill="none"
    className={className}
    aria-hidden="true"
  >
    <path
      d="M6 4L3 9L7 14L4 19L8 23L103 21L107 16L103 11L106 6L101 2L6 4Z"
      fill="#9d613c"
      fillOpacity="0.35"
      stroke="#fbeee0"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <line x1="20" y1="6" x2="16" y2="19" stroke="#fbeee0" strokeOpacity="0.35" strokeWidth="1.4" strokeLinecap="round" />
    <line x1="32" y1="6" x2="28" y2="19" stroke="#fbeee0" strokeOpacity="0.35" strokeWidth="1.4" strokeLinecap="round" />
    <line x1="78" y1="5" x2="74" y2="18" stroke="#fbeee0" strokeOpacity="0.35" strokeWidth="1.4" strokeLinecap="round" />
    <line x1="90" y1="5" x2="86" y2="18" stroke="#fbeee0" strokeOpacity="0.35" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

// Hand-drawn corner hatch shading lines for doodle cards
export const DoodleCornerHatch: React.FC<{ className?: string }> = ({
  className = 'w-7 h-7 text-[#9d613c]/60',
}) => (
  <svg
    viewBox="0 0 28 28"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M4 14L14 4" />
    <path d="M4 21L21 4" />
    <path d="M10 24L24 10" />
  </svg>
);

// Hand-drawn notebook binder / pin spiral accent
export const DoodleSpiral: React.FC<{ className?: string }> = ({
  className = 'w-14 h-5 text-[#fbeee0]',
}) => (
  <svg
    viewBox="0 0 64 20"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M8 16C6 10 8 3 12 3C16 3 16 14 13 16" />
    <path d="M24 16C22 10 24 3 28 3C32 3 32 14 29 16" />
    <path d="M40 16C38 10 40 3 44 3C48 3 48 14 45 16" />
    <path d="M56 16C54 10 56 3 60 3" />
  </svg>
);

/**
 * Bespoke Anti-AI-Slop Sketchbook Origami Paper Plane Doodle
 * Hand-drafted dimensional origami dart glider with layered parchment cream wings (#FBEEE0 & #F3DFC8),
 * recessed center fold valley (#B89F86 & #9D613C), terracotta-amber wingtip technical markings (#E59B63),
 * dark ink drafting outlines (#0B1018), and looping dashed slipstream wind contrails.
 * Pointing right (+X) in a 76x52 local coordinate space (airframe center at 46, 26) so it banks
 * naturally along any 360-degree looping trajectory without nested-SVG viewport inflation.
 */
export const SketchbookPaperPlaneDoodle: React.FC<{ className?: string }> = ({
  className = '',
}) => (
  <g className={className} aria-hidden="true">
    {/* Hand-Drawn Slipstream Wind Contrails Behind Wingtips & Tail */}
    <path
      d="M4 16C10 15 16 17 22 17"
      stroke="#FBEEE0"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeDasharray="2.5 4"
      opacity="0.65"
    />
    <path
      d="M2 26C9 26 16 26 23 26"
      stroke="#E59B63"
      strokeWidth="2.1"
      strokeLinecap="round"
      strokeDasharray="3.5 4.5"
      opacity="0.9"
    />
    <path
      d="M4 36C10 37 16 35 22 35"
      stroke="#FBEEE0"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeDasharray="2.5 4"
      opacity="0.65"
    />

    {/* Origami Airframe Group */}
    <g>
      {/* Upper Swept Origami Wing (Warm Parchment Cream) */}
      <path
        d="M72 26L22 7L31 22.5L72 26Z"
        fill="#FBEEE0"
        stroke="#0B1018"
        strokeWidth="2.3"
        strokeLinejoin="round"
      />

      {/* Lower Swept Origami Wing (Tinted Sketchbook Cream) */}
      <path
        d="M72 26L31 29.5L22 45L72 26Z"
        fill="#F3DFC8"
        stroke="#0B1018"
        strokeWidth="2.3"
        strokeLinejoin="round"
      />

      {/* Upper Inner Fold Crease Facet */}
      <path
        d="M72 26L31 22.5L26 26L72 26Z"
        fill="#C7B299"
        stroke="#0B1018"
        strokeWidth="1.9"
        strokeLinejoin="round"
      />

      {/* Lower Inner Fold Crease Facet (Terracotta Shadow Valley) */}
      <path
        d="M72 26L26 26L31 29.5L72 26Z"
        fill="#9D613C"
        stroke="#0B1018"
        strokeWidth="1.9"
        strokeLinejoin="round"
      />

      {/* Central Origami Spine Line */}
      <line
        x1="25"
        y1="26"
        x2="72"
        y2="26"
        stroke="#0B1018"
        strokeWidth="2.1"
        strokeLinecap="round"
      />

      {/* Hand-Drafted Wingtip Terracotta Trim Stripes & Registration Dots */}
      <path
        d="M27 11.5L35 14.5"
        stroke="#9D613C"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        d="M27 40.5L35 37.5"
        stroke="#E59B63"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <circle cx="41" cy="17" r="1.5" fill="#9D613C" />
      <circle cx="41" cy="35" r="1.5" fill="#9D613C" />
    </g>
  </g>
);

/**
 * Bespoke Anti-AI-Slop Sketchbook Validator Orbit Rocket Doodle
 * Hand-drafted technical spacecraft (#FBEEE0 riveted fuselage, #9D613C terracotta delta fins,
 * #E59B63 nosecone & plasma plume, #22C55E live validator avionics porthole, #0B1018 ink lines).
 * Pointing right (+X) in a 68x44 local coordinate space (fuselage center at 39, 22).
 */
export const SketchbookOrbitRocketDoodle: React.FC<{ className?: string }> = ({
  className = '',
}) => (
  <g className={className} aria-hidden="true">
    {/* Exhaust Smoke Rings & Plasma Sparks */}
    <circle cx="8" cy="19" r="2.2" fill="#E59B63" opacity="0.75" />
    <circle cx="11" cy="25" r="1.6" fill="#FBEEE0" opacity="0.7" />

    {/* Outer Thruster Plasma Plume */}
    <path
      d="M22 15.5L4 22L22 28.5V15.5Z"
      fill="#E59B63"
      stroke="#0B1018"
      strokeWidth="1.7"
      strokeLinejoin="round"
    />

    {/* Inner White-Hot Core Plume */}
    <path d="M22 18L11 22L22 26V18Z" fill="#FBEEE0" />

    {/* Swept Delta Stabilizer Fins (Terracotta Copper) */}
    <path
      d="M32 13L23 5L19.5 6.8L23.5 14.8H32V13Z"
      fill="#9D613C"
      stroke="#0B1018"
      strokeWidth="2.1"
      strokeLinejoin="round"
    />
    <path
      d="M32 31L23 39L19.5 37.2L23.5 29.2H32V31Z"
      fill="#9D613C"
      stroke="#0B1018"
      strokeWidth="2.1"
      strokeLinejoin="round"
    />

    {/* Stepped Engine Nozzle Bell */}
    <path
      d="M25.5 15V29L21 30.5V13.5L25.5 15Z"
      fill="#9D613C"
      stroke="#0B1018"
      strokeWidth="2.1"
      strokeLinejoin="round"
    />

    {/* Main Fuselage Body (Warm Sketchbook Cream) */}
    <path
      d="M63 22C55.5 14.8 45.5 12.5 33 12.5H25.5V31.5H33C45.5 31.5 55.5 29.2 63 22Z"
      fill="#FBEEE0"
      stroke="#0B1018"
      strokeWidth="2.3"
      strokeLinejoin="round"
    />

    {/* Terracotta-Amber Nosecone & Rivet Seam */}
    <path
      d="M63 22C58.2 17.5 52.8 15 48 13.8V30.2C52.8 29 58.2 26.5 63 22Z"
      fill="#E59B63"
    />
    <line x1="48" y1="13.5" x2="48" y2="30.5" stroke="#0B1018" strokeWidth="2" />

    {/* Center Dorsal Stabilizer Spine */}
    <line
      x1="24"
      y1="22"
      x2="33"
      y2="22"
      stroke="#0B1018"
      strokeWidth="2.2"
      strokeLinecap="round"
    />

    {/* Hull Rivet Dots */}
    <circle cx="44" cy="17" r="1.3" fill="#9D613C" />
    <circle cx="44" cy="27" r="1.3" fill="#9D613C" />

    {/* Validator Telemetry Avionics Porthole (Live Emerald LED) */}
    <circle cx="38.5" cy="22" r="5.4" fill="#0B1018" />
    <circle cx="38.5" cy="22" r="3.5" fill="#22C55E" />
    <circle cx="37.5" cy="21" r="1.4" fill="#DCFCE7" />
  </g>
);




