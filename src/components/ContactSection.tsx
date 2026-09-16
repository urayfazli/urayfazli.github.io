import React, { useState } from 'react';
import { Github, Twitter, Mail, Copy, Check, Send, MessageSquare, ExternalLink, MapPin, CheckCircle2 } from 'lucide-react';
import { personalInfo } from '../data/portfolioData';
import { useLanguage } from '../context/LanguageContext';
import profileAvatarImg from '../assets/images/uray_fazli_portrait.png';

export const ContactSection: React.FC = () => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    networkOrProject: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const { t } = useLanguage();

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => {
      setCopiedKey(null);
    }, 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name || !formState.email || !formState.message) return;

    // Simulate sending email / compose mailto fallback
    const mailtoUrl = `mailto:${personalInfo.socials.email}?subject=Node%20Operator%20Inquiry%20from%20${encodeURIComponent(formState.name)}&body=Project:%20${encodeURIComponent(formState.networkOrProject)}%0AEmail:%20${encodeURIComponent(formState.email)}%0A%0A${encodeURIComponent(formState.message)}`;
    
    setIsSubmitted(true);
    setTimeout(() => {
      window.location.href = mailtoUrl;
    }, 800);
  };

  return (
    <section id="kontak" className="py-16 bg-[#F7FAFC]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#EDF2F7] text-[#2B6CB0] text-xs font-semibold uppercase tracking-wider mb-2">
            {t.contact.badge}
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-heading text-[#1A202C]">
            {t.contact.heading}
          </h2>
          <p className="mt-3 text-base sm:text-lg text-[#718096]">
            {t.contact.subheading}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left: Contact Info & Social Media Cards */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Identity Card with Profile Photo */}
            <div className="custom-card p-4 border border-[#E2E8F0] flex items-center gap-3.5 bg-white">
              <div className="w-14 h-14 rounded-lg overflow-hidden border border-[#CBD5E0] shrink-0 shadow-2xs">
                <img
                  src={profileAvatarImg || "/assets/uray_fazli_portrait.png"}
                  alt={`Foto Profil ${personalInfo.name}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (target.src !== "/assets/uray_fazli_portrait.png") {
                      target.src = "/assets/uray_fazli_portrait.png";
                    }
                  }}
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <h4 className="text-base font-bold font-heading text-[#1A202C] truncate">
                    {personalInfo.name}
                  </h4>
                  <span className="w-2 h-2 rounded-full bg-[#38A169] shrink-0" title="Active"></span>
                </div>
                <p className="text-xs text-[#2B6CB0] font-medium truncate">
                  {t.profileCard.roleTitle}
                </p>
                <p className="text-[11px] text-[#718096] truncate mt-0.5">
                  Sei • Aptos • SubQuery
                </p>
              </div>
            </div>
            
            {/* GitHub Card */}
            <div className="custom-card p-5 border border-[#E2E8F0] hover:border-[#2B6CB0] transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#1A202C] text-white flex items-center justify-center">
                    <Github className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-[#718096] font-medium">GitHub</div>
                    <div className="text-sm font-bold text-[#1A202C]">{personalInfo.socials.github.username}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopy(personalInfo.socials.github.username, 'github')}
                    className="p-2 text-[#718096] hover:text-[#1A202C] hover:bg-[#EDF2F7] rounded-lg transition-colors cursor-pointer"
                    title={t.profileCard.copyEmail}
                  >
                    {copiedKey === 'github' ? <Check className="w-4 h-4 text-[#38A169]" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <a
                    href={personalInfo.socials.github.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-[#2B6CB0] hover:bg-[#EBF8FF] rounded-lg transition-colors"
                    title="Buka GitHub"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>

            {/* X (Twitter) Card */}
            <div className="custom-card p-5 border border-[#E2E8F0] hover:border-[#2B6CB0] transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#2B6CB0] text-white flex items-center justify-center">
                    <Twitter className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-[#718096] font-medium">X (Twitter)</div>
                    <div className="text-sm font-bold text-[#1A202C]">{personalInfo.socials.x.username}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopy(personalInfo.socials.x.username, 'x')}
                    className="p-2 text-[#718096] hover:text-[#1A202C] hover:bg-[#EDF2F7] rounded-lg transition-colors cursor-pointer"
                    title={t.profileCard.copyEmail}
                  >
                    {copiedKey === 'x' ? <Check className="w-4 h-4 text-[#38A169]" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <a
                    href={personalInfo.socials.x.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-[#2B6CB0] hover:bg-[#EBF8FF] rounded-lg transition-colors"
                    title="Buka X.com"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>

            {/* Email Card */}
            <div className="custom-card p-5 border border-[#E2E8F0] hover:border-[#2B6CB0] transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#38A169] text-white flex items-center justify-center">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-[#718096] font-medium">{t.contact.emailLabel}</div>
                    <div className="text-sm font-bold text-[#1A202C]">{personalInfo.socials.email}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopy(personalInfo.socials.email, 'email')}
                    className="p-2 text-[#718096] hover:text-[#1A202C] hover:bg-[#EDF2F7] rounded-lg transition-colors cursor-pointer"
                    title={t.profileCard.copyEmail}
                  >
                    {copiedKey === 'email' ? <Check className="w-4 h-4 text-[#38A169]" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <a
                    href={`mailto:${personalInfo.socials.email}`}
                    className="p-2 text-[#2B6CB0] hover:bg-[#EBF8FF] rounded-lg transition-colors"
                    title={t.contact.sendEmailAction}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>

            {/* Status note */}
            <div className="p-4 bg-white rounded-lg border border-[#E2E8F0] text-xs text-[#718096] flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[#38A169] animate-pulse shrink-0"></span>
              <span>{t.contact.availabilityNotice}</span>
            </div>

          </div>

          {/* Right: Interactive Message Form */}
          <div className="lg:col-span-7">
            <div className="custom-card p-6 sm:p-8 border border-[#E2E8F0]">
              <div className="flex items-center gap-2 mb-6">
                <MessageSquare className="w-5 h-5 text-[#2B6CB0]" />
                <h3 className="text-lg font-bold font-heading text-[#1A202C]">
                  {t.contact.formTitle}
                </h3>
              </div>

              {isSubmitted ? (
                <div className="p-6 bg-[#F0FFF4] border border-[#C6F6D5] rounded-lg text-center space-y-2">
                  <CheckCircle2 className="w-10 h-10 text-[#38A169] mx-auto" />
                  <h4 className="text-base font-bold text-[#1A202C]">{t.contact.successTitle}</h4>
                  <p className="text-xs text-[#718096]">
                    {t.contact.successDesc}
                  </p>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="mt-3 text-xs text-[#2B6CB0] font-semibold underline cursor-pointer"
                  >
                    {t.contact.sendAnotherBtn}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-sm">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#1A202C] mb-1.5">
                        {t.contact.formNameLabel}
                      </label>
                      <input
                        type="text"
                        required
                        placeholder={t.contact.formNamePlaceholder}
                        value={formState.name}
                        onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-white border border-[#E2E8F0] rounded-lg text-[#1A202C] placeholder-[#A0AEC0] focus:outline-none focus:border-[#2B6CB0] transition-colors text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#1A202C] mb-1.5">
                        {t.contact.formEmailLabel}
                      </label>
                      <input
                        type="email"
                        required
                        placeholder={t.contact.formEmailPlaceholder}
                        value={formState.email}
                        onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-white border border-[#E2E8F0] rounded-lg text-[#1A202C] placeholder-[#A0AEC0] focus:outline-none focus:border-[#2B6CB0] transition-colors text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1A202C] mb-1.5">
                      {t.contact.formTopicLabel}
                    </label>
                    <input
                      type="text"
                      placeholder={t.contact.formTopicPlaceholder}
                      value={formState.networkOrProject}
                      onChange={(e) => setFormState({ ...formState, networkOrProject: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-[#E2E8F0] rounded-lg text-[#1A202C] placeholder-[#A0AEC0] focus:outline-none focus:border-[#2B6CB0] transition-colors text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1A202C] mb-1.5">
                      {t.contact.formMessageLabel}
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder={t.contact.formMessagePlaceholder}
                      value={formState.message}
                      onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-[#E2E8F0] rounded-lg text-[#1A202C] placeholder-[#A0AEC0] focus:outline-none focus:border-[#2B6CB0] transition-colors text-sm resize-none"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="btn-primary w-full py-2.5 text-sm cursor-pointer shadow-xs"
                  >
                    <Send className="w-4 h-4" />
                    <span>{t.contact.submitBtn}</span>
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

