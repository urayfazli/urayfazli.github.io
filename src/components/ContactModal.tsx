import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SOCIAL_DATA } from '../data/portfolioData';
import { GitHubIcon, XIcon, CrownDoodle, DoodleTape } from './Doodles';
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
  const onCloseRef = useRef(onClose);
  const submitTimerRef = useRef<number | null>(null);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) {
      if (submitTimerRef.current !== null) {
        window.clearTimeout(submitTimerRef.current);
        submitTimerRef.current = null;
      }
      setIsSubmitted(false);
      return;
    }

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
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);

    if (submitTimerRef.current !== null) {
      window.clearTimeout(submitTimerRef.current);
    }
    submitTimerRef.current = window.setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: '', email: '', message: '' });
      onCloseRef.current();
      submitTimerRef.current = null;
    }, 2800);
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(SOCIAL_DATA.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const mailtoHref = `mailto:${SOCIAL_DATA.email}?subject=${encodeURIComponent(
    `[Validator / Node Collaboration] from ${formData.name || 'Web3 Partner'}`
  )}&body=${encodeURIComponent(
    `Name: ${formData.name}\nContact / Handle: ${formData.email}\n\n${formData.message}`
  )}`;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="contact-modal-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-md overflow-y-auto"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ type: 'spring', stiffness: 380, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
            className="doodle-card relative w-full max-w-lg p-6 sm:p-8 text-[#fbeee0] my-auto max-h-[90vh] overflow-y-auto"
          >
            {/* Top Sketchbook Tape */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 rotate-[-1.5deg] pointer-events-none z-20">
              <DoodleTape className="w-24 h-5" />
            </div>

            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 sm:top-5 sm:right-5 w-9 h-9 rounded-full bg-[#0e1520] hover:bg-[#9d613c] border border-[#fbeee0]/40 hover:border-[#fbeee0] text-[#d8c7b6] hover:text-white flex items-center justify-center transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e59b63] z-20"
              aria-label="Close"
            >
              ✕
            </button>

            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-1.5 pr-10">
                <h3
                  id="contact-modal-title"
                  className="font-fredoka text-2xl sm:text-3xl font-medium text-[#fbeee0]"
                >
                  {lang === 'id' ? 'Hubungi Saya' : 'Get In Touch'}
                </h3>
                <CrownDoodle className="w-5 h-5 text-[#e59b63] rotate-12 shrink-0" />
              </div>
              <p className="text-sm text-[#d6c4b2] mb-5">
                {lang === 'id'
                  ? 'Hubungi saya untuk pertanyaan validator, kolaborasi testnet, atau diskusi infrastruktur.'
                  : 'Reach out for validator inquiries, testnet collaborations, or infrastructure discussions.'}
              </p>

              {isSubmitted ? (
                <div className="py-8 px-4 text-center space-y-3 rounded-2xl bg-[#0e1520] border-2 border-dashed border-emerald-400/50">
                  <div className="w-12 h-12 mx-auto rounded-full bg-emerald-500/20 border border-emerald-400/50 text-emerald-400 flex items-center justify-center text-xl font-bold">
                    ✓
                  </div>
                  <h4 className="font-fredoka text-xl text-[#fbeee0]">
                    {lang === 'id' ? 'Pesan Siap & Terkirim!' : 'Message Ready & Sent!'}
                  </h4>
                  <p className="text-sm text-[#d6c4b2]">
                    {lang === 'id'
                      ? 'Terima kasih telah menghubungi! Uray Fazli akan segera membalas pesan Anda.'
                      : 'Thank you for reaching out! Uray Fazli will get back to you shortly.'}
                  </p>
                  <div className="pt-2 flex flex-wrap items-center justify-center gap-2.5">
                    <a
                      href={mailtoHref}
                      className="px-4 py-2 rounded-xl bg-[#9d613c] hover:bg-[#b06f44] text-white text-xs font-mono border border-[#fbeee0]/60 transition-colors"
                    >
                      {lang === 'id' ? 'Buka Aplikasi Email ✉' : 'Open Email App ✉'}
                    </a>
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-[#fbeee0] text-xs font-mono transition-colors cursor-pointer"
                    >
                      {lang === 'id' ? 'Tutup' : 'Close'}
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-mono uppercase text-[#e59b63] mb-1.5">
                      {lang === 'id' ? 'Nama Anda' : 'Your Name'}
                    </label>
                    <input
                      required
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Satoshi Nakamoto"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#0e1520] border-[1.5px] border-[#fbeee0]/40 focus:border-[#e59b63] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e59b63] text-[#fbeee0] text-base sm:text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-[#e59b63] mb-1.5">
                      {lang === 'id' ? 'Email / Handle Anda' : 'Your Email / Handle'}
                    </label>
                    <input
                      required
                      type="text"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="name@company.com or @telegram"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#0e1520] border-[1.5px] border-[#fbeee0]/40 focus:border-[#e59b63] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e59b63] text-[#fbeee0] text-base sm:text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-[#e59b63] mb-1.5">
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
                      className="w-full px-4 py-2.5 rounded-xl bg-[#0e1520] border-[1.5px] border-[#fbeee0]/40 focus:border-[#e59b63] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e59b63] text-[#fbeee0] text-base sm:text-sm resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="doodle-subcard w-full py-3 px-4 !bg-[#9d613c] hover:!bg-[#b06f44] text-white font-fredoka font-medium text-base transition-all duration-200 cursor-pointer active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white text-center"
                  >
                    {lang === 'id' ? 'Kirim Pesan Langsung ✎' : 'Send Direct Message ✎'}
                  </button>
                </form>
              )}

              {/* Direct Email & Social Badges */}
              <div className="mt-6 pt-4 border-t-2 border-dashed border-[#fbeee0]/20 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#d6c4b2]">
                  <span>{lang === 'id' ? 'Email Langsung:' : 'Direct Email:'}</span>
                  <div className="flex items-center gap-2">
                    <a
                      href={`mailto:${SOCIAL_DATA.email}`}
                      className="font-mono text-[#fbeee0] hover:text-[#e59b63] transition-colors"
                    >
                      {SOCIAL_DATA.email}
                    </a>
                    <button
                      type="button"
                      onClick={handleCopyEmail}
                      className="px-2 py-0.5 rounded-md bg-[#0e1520] border border-dashed border-[#fbeee0]/40 text-[#e59b63] hover:text-white cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e59b63]"
                    >
                      {copiedEmail
                        ? lang === 'id'
                          ? 'Tersalin ✓'
                          : 'Copied ✓'
                        : lang === 'id'
                        ? 'Salin'
                        : 'Copy'}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-4 pt-1">
                  <a
                    href={SOCIAL_DATA.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs text-[#d8c7b6] hover:text-[#e59b63] transition-colors"
                  >
                    <GitHubIcon className="w-4 h-4" />
                    <span>{SOCIAL_DATA.github}</span>
                  </a>
                  <span className="text-white/20">·</span>
                  <a
                    href={SOCIAL_DATA.twitterUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs text-[#d8c7b6] hover:text-[#e59b63] transition-colors"
                  >
                    <XIcon className="w-3.5 h-3.5" />
                    <span>{SOCIAL_DATA.twitter}</span>
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
