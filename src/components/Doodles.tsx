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
    <div className="absolute -top-4 left-3 rotate-[-12deg] z-10">
      <CrownDoodle className="w-5 h-4 text-[#fbeee0]" />
    </div>

    {/* Speech Bubble Pill */}
    <div className="relative px-5 py-2.5 rounded-[22px] border-[2.5px] border-[#fbeee0] bg-[#141b26]/90 backdrop-blur-sm text-center shadow-lg transform rotate-[-4deg] hover:rotate-0 transition-transform duration-300">
      <span className="font-fredoka text-lg md:text-xl font-medium tracking-wide text-[#fbeee0] whitespace-nowrap block">
        {text}
      </span>

      {/* Bubble Tail */}
      <svg
        className="absolute -bottom-3.5 right-6 w-5 h-4 text-[#fbeee0]"
        viewBox="0 0 20 16"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M2 0C6 6 12 12 18 16C15 11 15 5 16 0H2Z" />
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
