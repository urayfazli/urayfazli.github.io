import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { NetworkInfo } from '../types';
import { AptosLogo, SeiLogo, SubQueryLogo, DoodleTape } from './Doodles';
import { useLanguage } from '../context/LanguageContext';

interface NetworkDetailModalProps {
  network: NetworkInfo | null;
  onClose: () => void;
}

export const NetworkDetailModal: React.FC<NetworkDetailModalProps> = ({ network, onClose }) => {
  const { lang } = useLanguage();
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!network) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCloseRef.current();
      }
    };

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [network]);

  return (
    <AnimatePresence>
      {network && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="network-modal-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-md overflow-y-auto"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="doodle-card relative w-full max-w-xl p-4 sm:p-6 text-[#fbeee0] my-auto max-h-[90vh] overflow-y-auto"
          >
            {/* Top Sketchbook Tape */}
            <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 rotate-[-1.5deg] pointer-events-none z-20">
              <DoodleTape className="w-20 h-4" />
            </div>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 w-8 h-8 rounded-full bg-[#0e1520] hover:bg-[#9d613c] border border-[#fbeee0]/40 hover:border-[#fbeee0] text-[#d8c7b6] hover:text-white flex items-center justify-center transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e59b63] z-20 text-xs"
              aria-label="Close modal"
            >
              ✕
            </button>

            <div className="relative z-10">
              {/* Header with Network Icon & Title */}
              <div className="flex items-start gap-3.5 mb-4 pr-9">
                <div className="shrink-0 p-2 rounded-xl bg-[#0e1520] border-[1.5px] border-[#fbeee0]/60">
                  {network.logoType === 'aptos' && <AptosLogo className="w-9 h-9 sm:w-10 sm:h-10" />}
                  {network.logoType === 'sei' && <SeiLogo className="w-9 h-9 sm:w-10 sm:h-10" />}
                  {network.logoType === 'subquery' && <SubQueryLogo className="w-9 h-9 sm:w-10 sm:h-10" />}
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-mono">
                    <span className="uppercase tracking-wider text-[#e59b63] font-semibold">
                      {network.role}
                    </span>
                    <span className="text-[#fbeee0]/25">·</span>
                    <span className="text-emerald-400 inline-flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      {network.status}
                    </span>
                  </div>
                  <h3
                    id="network-modal-title"
                    className="font-fredoka text-xl sm:text-2xl font-medium text-[#fbeee0] mt-0.5"
                  >
                    {network.name}
                  </h3>
                  <p className="text-[11px] sm:text-xs font-mono text-[#bba998]">
                    {network.category}
                  </p>
                </div>
              </div>

              {/* Description */}
              <p className="text-[#f0e4d6] text-xs sm:text-sm leading-relaxed mb-4 pl-3 border-l-2 border-dashed border-[#9d613c]/75">
                {network.description}
              </p>

              {/* Anti-AI-Slop Hairline Tabular Hardware Specifications Strip */}
              <div className="mb-4 rounded-lg bg-[#0a0f17] border border-[#fbeee0]/20 overflow-hidden">
                <div className="px-3 py-1.5 bg-[#101826] border-b border-[#fbeee0]/15 flex items-center justify-between">
                  <h4 className="text-[10px] font-mono uppercase tracking-wider text-[#e59b63] font-semibold">
                    {lang === 'id'
                      ? 'Spesifikasi Perangkat Keras & Infrastruktur'
                      : 'Dedicated Node Hardware & Infrastructure'}
                  </h4>
                  <span className="text-[10px] font-mono text-emerald-400 tabular-nums">
                    SLA 99.9%
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[#fbeee0]/15 text-[11px] font-mono">
                  <div className="p-2.5">
                    <div className="text-[#9a8978] text-[9px] uppercase tracking-wider">
                      {lang === 'id' ? 'Prosesor' : 'Processor'}
                    </div>
                    <div className="font-semibold text-[#fbeee0] tabular-nums mt-0.5">
                      {network.hardware.cpu}
                    </div>
                  </div>
                  <div className="p-2.5">
                    <div className="text-[#9a8978] text-[9px] uppercase tracking-wider">
                      {lang === 'id' ? 'Memori' : 'Memory'}
                    </div>
                    <div className="font-semibold text-[#fbeee0] tabular-nums mt-0.5">
                      {network.hardware.ram}
                    </div>
                  </div>
                  <div className="p-2.5">
                    <div className="text-[#9a8978] text-[9px] uppercase tracking-wider">
                      {lang === 'id' ? 'Penyimpanan' : 'Storage'}
                    </div>
                    <div className="font-semibold text-[#fbeee0] tabular-nums mt-0.5">
                      {network.hardware.storage}
                    </div>
                  </div>
                  <div className="p-2.5">
                    <div className="text-[#9a8978] text-[9px] uppercase tracking-wider">
                      Bandwidth
                    </div>
                    <div className="font-semibold text-[#fbeee0] tabular-nums mt-0.5">
                      {network.hardware.bandwidth}
                    </div>
                  </div>
                </div>
              </div>

              {/* Key Highlights / Operator Responsibilities */}
              <div className="mb-4">
                <h4 className="text-[10px] font-mono uppercase tracking-wider text-[#e59b63] mb-2 font-semibold">
                  {lang === 'id' ? 'Tanggung Jawab & Sorotan Operasional' : 'Operational Highlights'}
                </h4>
                <ul className="space-y-1.5">
                  {network.highlights.map((item, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2 text-xs text-[#e8dacb]"
                    >
                      <span className="text-emerald-400 font-mono mt-0.5 font-bold">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* DevOps & Node Runner Stack */}
              <div className="mb-4 pt-3 border-t border-dashed border-[#fbeee0]/20">
                <h4 className="text-[10px] font-mono uppercase tracking-wider text-[#e59b63] mb-1.5 font-semibold">
                  DevOps & Observability Stack
                </h4>
                <div className="flex flex-wrap items-center gap-y-1 text-[11px] font-mono text-[#fbeee0]">
                  {network.tools.map((tool, index) => (
                    <React.Fragment key={tool}>
                      <span className="px-2 py-0.5 rounded bg-[#0e1520] border border-[#fbeee0]/20 text-[#fbeee0]">
                        {tool}
                      </span>
                      {index < network.tools.length - 1 && (
                        <span className="mx-1 text-[#9d613c]" aria-hidden="true">
                          ·
                        </span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* Action Links */}
              <div className="pt-3 border-t border-dashed border-[#fbeee0]/20 flex flex-wrap items-center justify-between gap-2.5">
                <div className="flex flex-wrap items-center gap-2">
                  <a
                    href={network.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="doodle-subcard px-3.5 py-1.5 !bg-[#9d613c] hover:!bg-[#b06f44] text-white text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  >
                    {lang === 'id' ? 'Situs Resmi ↗' : 'Official Website ↗'}
                  </a>
                  {network.explorerUrl && (
                    <a
                      href={network.explorerUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="doodle-subcard px-3.5 py-1.5 text-[#fbeee0] hover:text-white text-xs font-mono transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e59b63]"
                    >
                      Block Explorer ↗
                    </a>
                  )}
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="text-[11px] font-mono text-[#bba998] hover:text-[#fbeee0] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9d613c] px-2.5 py-1 rounded-md border border-transparent hover:border-[#fbeee0]/25"
                >
                  {lang === 'id' ? 'Tutup [ESC]' : 'Close [ESC]'}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
