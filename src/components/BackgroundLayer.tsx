import React from 'react';
import { ASSET_IMAGES } from '../assets/images';

export const BackgroundLayer: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none" aria-hidden="true">
      {/* 1. Base Dark Solid Foundation */}
      <div className="absolute inset-0 bg-[#0c1017]" />

      {/* 2. Responsive Background Artwork (loads & decodes only 1 image per device viewport to save GPU VRAM) */}
      <picture className="absolute inset-0 w-full h-full">
        <source media="(min-width: 768px)" srcSet={ASSET_IMAGES.bgDesktop} />
        <img
          src={ASSET_IMAGES.bgMobile}
          alt=""
          decoding="async"
          className="w-full h-full object-cover object-top md:object-center opacity-65 md:opacity-70"
        />
      </picture>

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
