import React from 'react';

const TICKER_ITEMS = [
  { label: 'NODE ONLINE', check: true },
  { label: 'WALLET CONNECTED', check: true },
  { label: 'MEME COIN LOADED', check: true },
  { label: 'NFT MINTED', check: true },
  { label: 'SER, WE ARE STILL EARLY 🚀', check: false },
];

export const RunningTextMarquee: React.FC = () => {
  // Render multiple repetitions per half-track so wide viewports are always filled seamlessly
  const repetitions = [0, 1, 2];

  const renderTrackHalf = (halfPrefix: string, isAriaHidden = false) => (
    <div
      key={halfPrefix}
      aria-hidden={isAriaHidden ? 'true' : undefined}
      className="flex items-center shrink-0"
    >
      {repetitions.map((repIdx) => (
        <div key={`${halfPrefix}-${repIdx}`} className="flex items-center shrink-0">
          {TICKER_ITEMS.map((item, idx) => (
            <React.Fragment key={`${halfPrefix}-${repIdx}-${idx}`}>
              <span className="inline-flex items-center gap-1.5 font-mono text-xs sm:text-[13px] font-medium tracking-wider text-[#fbeee0]/90 whitespace-nowrap px-3 sm:px-4">
                <span>{item.label}</span>
                {item.check && (
                  <span className="text-emerald-400 font-bold" aria-label="checked">
                    ✓
                  </span>
                )}
              </span>
              <span
                className="text-[#9d613c] font-mono text-xs sm:text-sm select-none"
                aria-hidden="true"
              >
                •
              </span>
            </React.Fragment>
          ))}
        </div>
      ))}
    </div>
  );

  return (
    <div
      role="region"
      aria-label="NODE ONLINE ✓ • WALLET CONNECTED ✓ • MEME COIN LOADED ✓ • NFT MINTED ✓ • SER, WE ARE STILL EARLY 🚀"
      className="relative w-full overflow-hidden bg-[#0d131d]/90 border-b border-[#9d613c]/25 py-2.5 backdrop-blur-md z-20 select-none"
    >
      {/* Left & Right Smooth Gradient Fade Masks */}
      <div
        className="pointer-events-none absolute inset-y-0 left-0 w-10 sm:w-20 bg-gradient-to-r from-[#0c1017] to-transparent z-10"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 w-10 sm:w-20 bg-gradient-to-l from-[#0c1017] to-transparent z-10"
        aria-hidden="true"
      />

      {/* Seamless Infinite Marquee Track */}
      <div className="animate-marquee">
        {renderTrackHalf('track-a', false)}
        {renderTrackHalf('track-b', true)}
      </div>
    </div>
  );
};
