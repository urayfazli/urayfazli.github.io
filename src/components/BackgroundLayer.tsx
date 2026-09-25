import React from 'react';
import { ASSET_IMAGES } from '../assets/images';

export const BackgroundLayer: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none" aria-hidden="true">
      {/* 1. Base Dark Solid Foundation */}
      <div className="absolute inset-0 bg-[#0c1017]" />

      {/* 2. Desktop & Tablet Background Artwork Image (Visible on >= 768px screens) */}
      <img
        src={ASSET_IMAGES.bgDesktop}
        alt=""
        className="hidden md:block absolute inset-0 w-full h-full object-cover object-center opacity-70"
        loading="eager"
      />

      {/* 3. Mobile Vertical Background Artwork Image (Visible on < 768px screens) */}
      <img
        src={ASSET_IMAGES.bgMobile}
        alt=""
        className="block md:hidden absolute inset-0 w-full h-full object-cover object-top opacity-65"
        loading="eager"
      />

      {/* 4. Fine Matrix Grid Texture */}
      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage: `radial-gradient(rgba(251, 238, 224, 0.6) 1px, transparent 1px)`,
          backgroundSize: '28px 28px',
        }}
      />

      {/* 5. Ambient Vignette Gradient so Text & Bento Cards have maximum contrast and legibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0c1017]/60 via-transparent to-[#0c1017]/85" />
    </div>
  );
};
