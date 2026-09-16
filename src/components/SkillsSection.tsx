import React from 'react';
import { motion } from 'motion/react';
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
    <section id="keahlian" aria-labelledby="skills-heading" className="py-16 bg-[#FFFFFF] border-b border-[#E2E8F0] overflow-hidden scroll-mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Semantic Section Header */}
        <motion.header 
          id="skills-header"
          className="max-w-3xl mb-12"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#EBF8FF] text-[#2B6CB0] text-xs font-semibold uppercase tracking-wider border border-[#BEE3F8] mb-3">
            {t.skills.badge}
          </div>
          <h2 id="skills-heading" className="text-3xl sm:text-4xl font-extrabold font-heading text-[#1A202C] tracking-tight leading-tight">
            {t.skills.heading}
          </h2>
          <p className="mt-3 text-base sm:text-lg text-[#718096] leading-relaxed">
            {t.skills.subheading}
          </p>
        </motion.header>

        {/* Skill Category Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {t.skills.categories.map((category, idx) => (
            <motion.div 
              key={idx} 
              id={`skills-category-card-${idx}`}
              className="custom-card p-6 border border-[#E2E8F0] flex flex-col justify-between hover:border-[#2B6CB0] transition-colors cursor-default"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45, delay: idx * 0.12, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ 
                y: -5, 
                scale: 1.02, 
                boxShadow: "0 12px 24px -8px rgba(43, 108, 176, 0.12), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" 
              }}
              whileTap={{ scale: 0.99 }}
            >
              <div>
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#EDF2F7]">
                  <div className="w-10 h-10 rounded-lg bg-[#EBF8FF] flex items-center justify-center shrink-0">
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
            </motion.div>
          ))}
        </div>

        {/* Highlight Banner on Reliability */}
        <motion.div 
          id="skills-security-banner"
          className="mt-12 p-6 bg-[#F7FAFC] rounded-lg border border-[#E2E8F0] hover:border-[#2B6CB0] transition-colors flex flex-col md:flex-row items-center justify-between gap-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ y: -2, scale: 1.008 }}
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-[#2B6CB0] text-white flex items-center justify-center shrink-0 shadow-xs">
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
              id="skills-discuss-btn"
              href={`mailto:fazliuray@gmail.com?subject=Inquiry%20Node%20Operations%20-%20Uray%20Fazli%20Alman`}
              className="btn-primary text-xs whitespace-nowrap shadow-xs"
            >
              {t.skills.discussBtn}
            </a>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

