import React, { useEffect } from 'react';
import { NetworkInfo } from '../types';
import { AptosLogo, SeiLogo, SubQueryLogo } from './Doodles';
import { useLanguage } from '../context/LanguageContext';

interface NetworkDetailModalProps {
  network: NetworkInfo | null;
  onClose: () => void;
}

export const NetworkDetailModal: React.FC<NetworkDetailModalProps> = ({ network, onClose }) => {
  const { lang } = useLanguage();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (network) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [network, onClose]);

  if (!network) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl rounded-3xl bg-[#141d2a] border border-[#2b394e] p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[90vh] text-[#fbeee0]"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 text-[#d8c7b6] hover:text-white flex items-center justify-center transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9d613c]"
          aria-label="Close modal"
        >
          ✕
        </button>

        {/* Header with Network Icon & Title */}
        <div className="flex items-start gap-4 mb-6">
          <div className="flex-shrink-0">
            {network.logoType === 'aptos' && <AptosLogo className="w-14 h-14" />}
            {network.logoType === 'sei' && <SeiLogo className="w-14 h-14" />}
            {network.logoType === 'subquery' && <SubQueryLogo className="w-14 h-14" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase px-2.5 py-0.5 rounded-full bg-[#9d613c]/30 text-[#fbeee0] border border-[#9d613c]/50">
                {network.role}
              </span>
              <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                {network.status}
              </span>
            </div>
            <h3 className="font-fredoka text-2xl sm:text-3xl font-medium text-[#fbeee0] mt-1">
              {network.name}
            </h3>
            <p className="text-sm text-[#bba998]">{network.category}</p>
          </div>
        </div>

        {/* Description */}
        <p className="text-[#e2d5c8] text-sm sm:text-base leading-relaxed mb-6">
          {network.description}
        </p>

        {/* Hardware Specifications Grid */}
        <div className="mb-6 p-4 rounded-2xl bg-[#0f1520] border border-white/5">
          <h4 className="text-xs font-mono uppercase tracking-wider text-[#b97746] mb-3 font-semibold">
            {lang === 'id'
              ? 'Spesifikasi Node & Infrastruktur Dedicated'
              : 'Dedicated Node Specs & Infrastructure'}
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="bg-[#141c28] p-2.5 rounded-xl border border-white/5">
              <div className="text-[#a89786] font-mono text-[11px]">
                {lang === 'id' ? 'Prosesor' : 'Processor'}
              </div>
              <div className="font-medium text-[#fbeee0] mt-0.5">{network.hardware.cpu}</div>
            </div>
            <div className="bg-[#141c28] p-2.5 rounded-xl border border-white/5">
              <div className="text-[#a89786] font-mono text-[11px]">
                {lang === 'id' ? 'Memori' : 'Memory'}
              </div>
              <div className="font-medium text-[#fbeee0] mt-0.5">{network.hardware.ram}</div>
            </div>
            <div className="bg-[#141c28] p-2.5 rounded-xl border border-white/5">
              <div className="text-[#a89786] font-mono text-[11px]">
                {lang === 'id' ? 'Penyimpanan' : 'Storage'}
              </div>
              <div className="font-medium text-[#fbeee0] mt-0.5">{network.hardware.storage}</div>
            </div>
            <div className="bg-[#141c28] p-2.5 rounded-xl border border-white/5">
              <div className="text-[#a89786] font-mono text-[11px]">Bandwidth</div>
              <div className="font-medium text-[#fbeee0] mt-0.5">{network.hardware.bandwidth}</div>
            </div>
          </div>
        </div>

        {/* Key Highlights / Operator Responsibilities */}
        <div className="mb-6">
          <h4 className="text-xs font-mono uppercase tracking-wider text-[#b97746] mb-3 font-semibold">
            {lang === 'id' ? 'Sorotan Operasional' : 'Operational Highlights'}
          </h4>
          <ul className="space-y-2">
            {network.highlights.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#e2d5c8]">
                <span className="text-[#9d613c] mt-0.5 font-bold">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* DevOps & Node Runner Tools */}
        <div className="mb-8">
          <h4 className="text-xs font-mono uppercase tracking-wider text-[#b97746] mb-2.5 font-semibold">
            DevOps Stack
          </h4>
          <div className="flex flex-wrap gap-2">
            {network.tools.map((tool) => (
              <span
                key={tool}
                className="px-3 py-1 rounded-full text-xs font-mono bg-[#1b2536] text-[#fbeee0] border border-[#2d3a4f]"
              >
                {tool}
              </span>
            ))}
          </div>
        </div>

        {/* Action Links */}
        <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <a
              href={network.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-[#9d613c] hover:bg-[#b06f44] text-white text-xs sm:text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              {lang === 'id' ? 'Situs Resmi ↗' : 'Official Website ↗'}
            </a>
            {network.explorerUrl && (
              <a
                href={network.explorerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-[#fbeee0] text-xs sm:text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9d613c]"
              >
                Block Explorer ↗
              </a>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-xs text-[#bba998] hover:text-[#fbeee0] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9d613c] px-2 py-1 rounded-lg"
          >
            {lang === 'id' ? 'Tutup jendela' : 'Close window'}
          </button>
        </div>
      </div>
    </div>
  );
};
