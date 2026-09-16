import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Globe, Check, ChevronDown } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { Language } from '../types';

interface LanguageToggleProps {
  variant?: 'dropdown' | 'pills';
  className?: string;
  size?: 'sm' | 'md';
}

export const LanguageToggle: React.FC<LanguageToggleProps> = ({ variant = 'dropdown', className = '' }) => {
  const { language, setLanguage, languageOptions, currentLanguageOption } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleSelectLanguage = (code: Language) => {
    setLanguage(code);
    setIsOpen(false);
  };

  if (variant === 'pills') {
    return (
      <div className={`inline-flex p-0.5 bg-[#EDF2F7] rounded-md gap-0.5 border border-[#E2E8F0] ${className}`}>
        {languageOptions.map((opt) => {
          const isSelected = opt.code === language;
          return (
            <motion.button
              key={opt.code}
              whileTap={{ scale: 0.94 }}
              onClick={() => setLanguage(opt.code)}
              className={`flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium rounded transition-colors cursor-pointer ${
                isSelected
                  ? 'bg-[#2B6CB0] text-white shadow-xs font-semibold'
                  : 'text-[#718096] hover:text-[#1A202C] hover:bg-white/60'
              }`}
              title={opt.name}
            >
              <span>{opt.flag}</span>
              <span>{opt.label}</span>
            </motion.button>
          );
        })}
      </div>
    );
  }

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      {/* Trigger Button - Compact & Sleek */}
      <motion.button
        type="button"
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#F7FAFC] hover:bg-[#EDF2F7] text-[#1A202C] border border-[#E2E8F0] hover:border-[#CBD5E0] rounded-md text-xs font-medium transition-colors cursor-pointer shadow-2xs h-8"
        aria-expanded={isOpen}
        aria-haspopup="true"
        title="Ganti Bahasa / Change Language"
      >
        <Globe className="w-3.5 h-3.5 text-[#2B6CB0]" />
        <span className="text-xs leading-none">{currentLanguageOption.flag}</span>
        <span className="font-semibold text-xs tracking-tight">{currentLanguageOption.label}</span>
        <ChevronDown className={`w-3 h-3 text-[#718096] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </motion.button>

      {/* Dropdown Menu with Smooth AnimatePresence */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -4 }}
            transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="absolute right-0 mt-1.5 w-44 rounded-lg bg-white shadow-md border border-[#E2E8F0] py-1 z-50 origin-top-right overflow-hidden"
          >
            <div className="px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-[#718096] border-b border-[#EDF2F7] mb-0.5">
              Bahasa / Language
            </div>
            {languageOptions.map((opt) => {
              const isSelected = opt.code === language;
              return (
                <button
                  key={opt.code}
                  onClick={() => handleSelectLanguage(opt.code)}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 text-xs transition-colors text-left cursor-pointer ${
                    isSelected
                      ? 'bg-[#EBF8FF] text-[#2B6CB0] font-semibold'
                      : 'text-[#1A202C] hover:bg-[#F7FAFC]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm leading-none">{opt.flag}</span>
                    <div>
                      <div className="font-medium text-xs leading-tight">{opt.nativeName}</div>
                      <div className="text-[10px] text-[#718096] leading-none">{opt.name}</div>
                    </div>
                  </div>
                  {isSelected && <Check className="w-3 h-3 text-[#2B6CB0] shrink-0" />}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
