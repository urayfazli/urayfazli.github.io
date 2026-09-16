import React from 'react';
import { motion } from 'motion/react';
import { Server, Github, Twitter, ArrowUp, Mail, ShieldCheck } from 'lucide-react';
import { personalInfo } from '../data/portfolioData';
import { useLanguage } from '../context/LanguageContext';

export const Footer: React.FC = () => {
  const { t } = useLanguage();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#FFFFFF] border-t border-[#E2E8F0] pt-12 pb-8 text-[#718096] text-xs overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-[#E2E8F0]"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-30px" }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <div 
                id="footer-logo-tag" 
                className="w-7 h-7 rounded bg-[#2B6CB0] flex items-center justify-center text-white"
                title="Logo Uray Fazli Alman"
                aria-label="Logo Uray Fazli Alman"
              >
                <Server className="w-4 h-4" />
              </div>
              <span id="footer-web-name-tag" className="text-base font-bold font-heading text-[#1A202C]">
                {personalInfo.name}
              </span>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-[#EBF8FF] text-[#2B6CB0] border border-[#BEE3F8]">
                NODE.OPS
              </span>
            </div>
            <p className="text-xs text-[#718096]">
              {t.footer.description}
            </p>
          </div>

          {/* Social Links & Back to Top */}
          <div className="flex items-center gap-4">
            <a
              href={personalInfo.socials.github.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-[#718096] hover:text-[#1A202C] hover:bg-[#F7FAFC] rounded-lg transition-colors flex items-center gap-1.5 font-medium"
            >
              <Github className="w-4 h-4" />
              <span>GitHub</span>
            </a>
            <a
              href={personalInfo.socials.x.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-[#718096] hover:text-[#1A202C] hover:bg-[#F7FAFC] rounded-lg transition-colors flex items-center gap-1.5 font-medium"
            >
              <Twitter className="w-4 h-4" />
              <span>X.com</span>
            </a>
            <a
              href={`mailto:${personalInfo.socials.email}`}
              className="p-2 text-[#718096] hover:text-[#1A202C] hover:bg-[#F7FAFC] rounded-lg transition-colors flex items-center gap-1.5 font-medium"
            >
              <Mail className="w-4 h-4" />
              <span>Email</span>
            </a>
            <button
              onClick={scrollToTop}
              className="p-2 text-[#718096] hover:text-[#2B6CB0] hover:bg-[#EDF2F7] rounded-lg transition-colors cursor-pointer ml-2"
              title={t.footer.backToTop}
              aria-label={t.footer.backToTop}
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>

        </motion.div>

        <motion.div 
          className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px]"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-10px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-[#38A169]" />
            <span>{t.footer.slaNote}</span>
          </div>
          <div>
            {t.footer.rightsReserved}
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

