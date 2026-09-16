import React, { useState } from 'react';
import { Github, Twitter, Mail, ShieldCheck, Server, Copy, Check, ExternalLink, MapPin, CheckCircle2, Terminal } from 'lucide-react';
import { personalInfo } from '../data/portfolioData';
import { useLanguage } from '../context/LanguageContext';
import profileAvatarImg from '../assets/images/uray_fazli_portrait.png';

interface ProfileCardProps {
  customClass?: string;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({ customClass = '' }) => {
  const [copied, setCopied] = useState(false);
  const { t } = useLanguage();

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(personalInfo.socials.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`custom-card overflow-hidden border border-[#E2E8F0] shadow-sm ${customClass}`}>
      {/* Header Banner - Clean solid primary tone with subtle badge */}
      <div className="bg-[#2B6CB0] px-6 py-4 flex items-center justify-between text-white">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-white/20 flex items-center justify-center text-white">
            <Server className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-bold tracking-wide uppercase font-heading">
            {t.profileCard.verifiedBadge}
          </span>
        </div>
        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-[#38A169] text-white text-[11px] font-semibold rounded">
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
          <span>{t.profileCard.statusOnline}</span>
        </div>
      </div>

      {/* Main Profile Info Section */}
      <div className="p-6">
        
        {/* Photo + Identity Header */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 pb-5 border-b border-[#E2E8F0]">
          {/* Profile Photo Avatar */}
          <div className="relative shrink-0">
            <div className="w-20 h-20 rounded-lg overflow-hidden border-2 border-[#2B6CB0] shadow-xs bg-[#F7FAFC]">
              <img
                src={profileAvatarImg || "/assets/uray_fazli_portrait.png"}
                alt={`Foto Profil ${personalInfo.name}`}
                className="w-full h-full object-cover"
                loading="eager"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (target.src !== "/assets/uray_fazli_portrait.png") {
                    target.src = "/assets/uray_fazli_portrait.png";
                  }
                }}
              />
            </div>
            <div 
              className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#38A169] border-2 border-white flex items-center justify-center text-white"
              title={t.profileCard.verifiedBadge}
            >
              <CheckCircle2 className="w-3 h-3" />
            </div>
          </div>

          {/* Name, Role & Location */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold font-heading text-[#1A202C] truncate">
                {personalInfo.name}
              </h3>
            </div>
            <p className="text-xs font-semibold text-[#2B6CB0] mt-0.5">
              {t.profileCard.roleTitle}
            </p>
            <div className="flex items-center gap-1 text-[11px] text-[#718096] mt-1">
              <MapPin className="w-3 h-3 text-[#718096] shrink-0" />
              <span>{t.profileCard.location} • Global Node Cluster</span>
            </div>
          </div>
        </div>

        {/* Quick Operational Stats */}
        <div className="grid grid-cols-2 gap-3 my-4">
          <div className="p-3 bg-[#F7FAFC] rounded-lg border border-[#EDF2F7]">
            <div className="text-[11px] text-[#718096] font-medium">{t.hero.stats.uptimeLabel}</div>
            <div className="text-base font-bold font-heading text-[#2B6CB0] mt-0.5">99.98% SLA</div>
            <div className="text-[10px] text-[#38A169] font-medium mt-0.5">{t.hero.stats.uptimeHelper}</div>
          </div>
          <div className="p-3 bg-[#F7FAFC] rounded-lg border border-[#EDF2F7]">
            <div className="text-[11px] text-[#718096] font-medium">{t.hero.stats.slashingLabel}</div>
            <div className="text-base font-bold font-heading text-[#38A169] mt-0.5">0 Events</div>
            <div className="text-[10px] text-[#718096] font-medium mt-0.5">{t.hero.stats.slashingHelper}</div>
          </div>
        </div>

        {/* Supported Networks Tags */}
        <div className="space-y-1.5 pb-4 border-b border-[#E2E8F0]">
          <div className="text-[11px] font-semibold uppercase text-[#718096] tracking-wider">
            {t.hero.operatingNetworksTitle}
          </div>
          <div className="flex flex-wrap gap-1.5">
            <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 bg-[#F7FAFC] border border-[#E2E8F0] rounded font-medium text-[#1A202C]">
              <span className="w-2 h-2 rounded-full bg-[#2B6CB0]"></span>
              <span>Sei Network</span>
            </span>
            <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 bg-[#F7FAFC] border border-[#E2E8F0] rounded font-medium text-[#1A202C]">
              <span className="w-2 h-2 rounded-full bg-[#38A169]"></span>
              <span>Aptos Network</span>
            </span>
            <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 bg-[#F7FAFC] border border-[#E2E8F0] rounded font-medium text-[#1A202C]">
              <span className="w-2 h-2 rounded-full bg-[#DD6B20]"></span>
              <span>SubQuery Network</span>
            </span>
          </div>
        </div>

        {/* Social & Contact Bar */}
        <div className="pt-4 flex flex-wrap sm:flex-nowrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <a
              href={personalInfo.socials.github.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 bg-[#F7FAFC] border border-[#E2E8F0] text-[#1A202C] hover:text-[#2B6CB0] hover:border-[#2B6CB0] rounded transition-colors text-xs flex items-center justify-center gap-1.5 font-medium min-h-[38px]"
              title={`GitHub: ${personalInfo.socials.github.username}`}
              aria-label={`GitHub Profile ${personalInfo.socials.github.username}`}
            >
              <Github className="w-4 h-4" />
              <span className="text-xs">GitHub</span>
            </a>
            <a
              href={personalInfo.socials.x.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 bg-[#F7FAFC] border border-[#E2E8F0] text-[#1A202C] hover:text-[#2B6CB0] hover:border-[#2B6CB0] rounded transition-colors text-xs flex items-center justify-center gap-1.5 font-medium min-h-[38px]"
              title={`X: ${personalInfo.socials.x.username}`}
              aria-label={`X Profile ${personalInfo.socials.x.username}`}
            >
              <Twitter className="w-4 h-4" />
              <span className="text-xs">X.com</span>
            </a>
          </div>

          <button
            onClick={handleCopyEmail}
            className="text-xs px-3 py-2 bg-[#F7FAFC] border border-[#E2E8F0] hover:border-[#2B6CB0] text-[#2B6CB0] font-semibold rounded transition-colors flex items-center justify-center gap-1.5 cursor-pointer min-h-[38px]"
            title={t.profileCard.copyEmail}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-[#38A169]" />
                <span className="text-[#38A169] text-xs font-semibold">{t.profileCard.copied}</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span className="text-xs">{t.profileCard.copyEmail}</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};

