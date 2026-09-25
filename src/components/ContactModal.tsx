import React, { useState, useEffect } from 'react';
import { SOCIAL_DATA } from '../data/portfolioData';
import { GitHubIcon, XIcon, CrownDoodle } from './Doodles';
import { useLanguage } from '../context/LanguageContext';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const { lang } = useLanguage();
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: '', email: '', message: '' });
      onClose();
    }, 2400);
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(SOCIAL_DATA.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg rounded-3xl bg-[#141d2a] border border-[#2b394e] p-6 sm:p-8 shadow-2xl text-[#fbeee0]"
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 text-[#d8c7b6] hover:text-white flex items-center justify-center transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9d613c]"
          aria-label="Close"
        >
          ✕
        </button>

        <div className="flex items-center gap-2 mb-2">
          <h3 className="font-fredoka text-2xl sm:text-3xl font-medium text-[#fbeee0]">
            {lang === 'id' ? 'Hubungi Saya' : 'Get In Touch'}
          </h3>
          <CrownDoodle className="w-5 h-5 text-[#9d613c] rotate-12" />
        </div>
        <p className="text-sm text-[#bba998] mb-6">
          {lang === 'id'
            ? 'Hubungi saya untuk pertanyaan validator, kolaborasi testnet, atau diskusi infrastruktur.'
            : 'Reach out for validator inquiries, testnet collaborations, or infrastructure discussions.'}
        </p>

        {isSubmitted ? (
          <div className="py-12 text-center space-y-3">
            <div className="w-12 h-12 mx-auto rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xl font-bold">
              ✓
            </div>
            <h4 className="font-fredoka text-xl text-[#fbeee0]">
              {lang === 'id' ? 'Pesan Terkirim!' : 'Message Sent!'}
            </h4>
            <p className="text-sm text-[#bba998]">
              {lang === 'id'
                ? 'Terima kasih telah menghubungi! Uray Fazli akan segera membalas pesan Anda.'
                : 'Thank you for reaching out! Uray Fazli will get back to you shortly.'}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase text-[#d8c8b8] mb-1.5">
                {lang === 'id' ? 'Nama Anda' : 'Your Name'}
              </label>
              <input
                required
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Satoshi Nakamoto"
                className="w-full px-4 py-2.5 rounded-xl bg-[#0f1520] border border-[#232f42] focus:border-[#9d613c] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#9d613c] text-[#fbeee0] text-base sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-[#d8c8b8] mb-1.5">
                {lang === 'id' ? 'Email / Handle Anda' : 'Your Email / Handle'}
              </label>
              <input
                required
                type="text"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="name@company.com or @telegram"
                className="w-full px-4 py-2.5 rounded-xl bg-[#0f1520] border border-[#232f42] focus:border-[#9d613c] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#9d613c] text-[#fbeee0] text-base sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-[#d8c8b8] mb-1.5">
                {lang === 'id' ? 'Pesan' : 'Message'}
              </label>
              <textarea
                required
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder={
                  lang === 'id'
                    ? 'Mari membangun bersama! Tertarik untuk kolaborasi node...'
                    : "Let's build together! Looking for node collaboration..."
                }
                className="w-full px-4 py-2.5 rounded-xl bg-[#0f1520] border border-[#232f42] focus:border-[#9d613c] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#9d613c] text-[#fbeee0] text-base sm:text-sm resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#9d613c] hover:bg-[#b06f44] text-white font-medium text-sm transition-all duration-200 cursor-pointer shadow-md hover:shadow-lg active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              {lang === 'id' ? 'Kirim Pesan' : 'Send Message'}
            </button>
          </form>
        )}

        {/* Direct Email & Social Badges */}
        <div className="mt-6 pt-5 border-t border-white/10 space-y-3">
          <div className="flex items-center justify-between text-xs text-[#bba998]">
            <span>{lang === 'id' ? 'Email Langsung:' : 'Direct Email:'}</span>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[#fbeee0]">{SOCIAL_DATA.email}</span>
              <button
                type="button"
                onClick={handleCopyEmail}
                className="text-[#b97746] hover:underline cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9d613c] px-1 rounded"
              >
                {copiedEmail
                  ? lang === 'id'
                    ? 'Tersalin!'
                    : 'Copied!'
                  : lang === 'id'
                  ? 'Salin'
                  : 'Copy'}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 pt-2">
            <a
              href={SOCIAL_DATA.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-[#d8c7b6] hover:text-[#9d613c]"
            >
              <GitHubIcon className="w-4 h-4" />
              <span>{SOCIAL_DATA.github}</span>
            </a>
            <span className="text-white/20">·</span>
            <a
              href={SOCIAL_DATA.twitterUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-[#d8c7b6] hover:text-[#9d613c]"
            >
              <XIcon className="w-3.5 h-3.5" />
              <span>{SOCIAL_DATA.twitter}</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};
