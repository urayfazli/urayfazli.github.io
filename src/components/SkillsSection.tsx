import React from 'react';
import { Server, Cpu, ShieldCheck, Check, Terminal, Layers, Network, Lock } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const SkillsSection: React.FC = () => {
  const { t } = useLanguage();

  const getIcon = (name: string) => {
    switch (name) {
      case 'Server':
        return <Server className="w-5 h-5 text-[#2B6CB0]" />;
      case 'Cpu':
        return <Cpu className="w-5 h-5 text-[#2B6CB0]" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-5 h-5 text-[#2B6CB0]" />;
      default:
        return <Layers className="w-5 h-5 text-[#2B6CB0]" />;
    }
  };

  return (
    <section id="keahlian" className="py-16 bg-[#FFFFFF] border-b border-[#E2E8F0]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#EDF2F7] text-[#2B6CB0] text-xs font-semibold uppercase tracking-wider mb-2">
            {t.skills.badge}
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-heading text-[#1A202C]">
            {t.skills.heading}
          </h2>
          <p className="mt-3 text-base sm:text-lg text-[#718096]">
            {t.skills.subheading}
          </p>
        </div>

        {/* Skill Category Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {t.skills.categories.map((category, idx) => (
            <div key={idx} className="custom-card p-6 border border-[#E2E8F0] flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#EDF2F7]">
                  <div className="w-10 h-10 rounded-lg bg-[#EBF8FF] flex items-center justify-center">
                    {getIcon(category.iconName)}
                  </div>
                  <h3 className="text-lg font-bold font-heading text-[#1A202C]">
                    {category.title}
                  </h3>
                </div>

                <div className="space-y-4">
                  {category.skills.map((skill, sIdx) => (
                    <div key={sIdx} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-[#1A202C]">{skill.name}</span>
                        <span className="text-xs px-2 py-0.5 bg-[#EDF2F7] text-[#2B6CB0] font-semibold rounded">
                          {skill.level}
                        </span>
                      </div>
                      <p className="text-xs text-[#718096] leading-relaxed">
                        {skill.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[#EDF2F7] flex items-center justify-between text-xs text-[#718096]">
                <span>{t.skills.bestPractice}</span>
                <span className="text-[#38A169] font-medium flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> {t.skills.verified}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Highlight Banner on Reliability */}
        <div className="mt-12 p-6 bg-[#F7FAFC] rounded-lg border border-[#E2E8F0] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-[#2B6CB0] text-white flex items-center justify-center shrink-0">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-bold font-heading text-[#1A202C]">
                {t.skills.securityBannerTitle}
              </h4>
              <p className="text-xs sm:text-sm text-[#718096] mt-0.5">
                {t.skills.securityBannerDesc}
              </p>
            </div>
          </div>
          <div className="shrink-0">
            <a
              href={`mailto:fazliuray@gmail.com?subject=Inquiry%20Node%20Operations%20-%20Uray%20Fazli%20Alman`}
              className="btn-primary text-xs whitespace-nowrap"
            >
              {t.skills.discussBtn}
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};

