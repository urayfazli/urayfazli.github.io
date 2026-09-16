import React, { useState } from 'react';
import { Server, Github, Twitter, Menu, X, CheckCircle2 } from 'lucide-react';
import { personalInfo } from '../data/portfolioData';
import { useLanguage } from '../context/LanguageContext';
import { LanguageToggle } from './LanguageToggle';

interface NavbarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeSection, setActiveSection }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t } = useLanguage();

  const navLinks = [
    { id: 'tentang', label: t.nav.about },
    { id: 'pengalaman', label: t.nav.nodeExperience },
    { id: 'monitor', label: t.nav.liveTelemetry },
    { id: 'keahlian', label: t.nav.skills },
    { id: 'kontak', label: t.nav.contact },
  ];

  const handleScrollTo = (id: string) => {
    setActiveSection(id);
    setIsMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-[#FFFFFF] border-b border-[#E2E8F0] shadow-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#2B6CB0] flex items-center justify-center text-white shadow-xs">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <a 
                href="#tentang" 
                onClick={(e) => { e.preventDefault(); handleScrollTo('tentang'); }}
                className="text-lg font-bold font-heading text-[#1A202C] hover:text-[#2B6CB0] transition-colors"
              >
                {personalInfo.name}
              </a>
              <div className="flex items-center gap-1.5 text-xs text-[#718096]">
                <span className="inline-block w-2 h-2 rounded-full bg-[#38A169] animate-pulse"></span>
                <span>{t.nav.roleBadge}</span>
              </div>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleScrollTo(link.id)}
                className={`text-sm font-medium transition-colors cursor-pointer py-1 ${
                  activeSection === link.id
                    ? 'text-[#2B6CB0] font-semibold border-b-2 border-[#2B6CB0]'
                    : 'text-[#718096] hover:text-[#1A202C]'
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Actions: Language Toggle + Social Icons + Contact CTA */}
          <div className="hidden md:flex items-center gap-3">
            {/* Language Selector */}
            <LanguageToggle />

            <div className="h-4 w-px bg-[#E2E8F0] mx-0.5"></div>

            <a
              href={personalInfo.socials.github.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub Profile"
              className="p-2 text-[#718096] hover:text-[#1A202C] hover:bg-[#F7FAFC] rounded-lg transition-colors"
              title={`GitHub: ${personalInfo.socials.github.username}`}
            >
              <Github className="w-5 h-5" />
            </a>
            <a
              href={personalInfo.socials.x.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X (Twitter) Profile"
              className="p-2 text-[#718096] hover:text-[#1A202C] hover:bg-[#F7FAFC] rounded-lg transition-colors"
              title={`X: ${personalInfo.socials.x.username}`}
            >
              <Twitter className="w-5 h-5" />
            </a>
            <button
              onClick={() => handleScrollTo('kontak')}
              className="btn-primary text-sm cursor-pointer"
            >
              {t.nav.contact}
            </button>
          </div>

          {/* Mobile menu button and language */}
          <div className="md:hidden flex items-center gap-2">
            <LanguageToggle variant="dropdown" />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-[#718096] hover:text-[#1A202C] rounded-lg focus:outline-none"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#FFFFFF] border-b border-[#E2E8F0] px-4 pt-2 pb-4 space-y-2">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleScrollTo(link.id)}
              className="w-full text-left py-2 px-3 rounded-lg text-sm font-medium text-[#1A202C] hover:bg-[#F7FAFC] hover:text-[#2B6CB0]"
            >
              {link.label}
            </button>
          ))}
          <div className="pt-3 border-t border-[#E2E8F0] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <a
                href={personalInfo.socials.github.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-[#718096] hover:text-[#1A202C]"
              >
                <Github className="w-4 h-4" />
                <span>GitHub</span>
              </a>
              <a
                href={personalInfo.socials.x.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-[#718096] hover:text-[#1A202C]"
              >
                <Twitter className="w-4 h-4" />
                <span>X.com</span>
              </a>
            </div>
            <button
              onClick={() => handleScrollTo('kontak')}
              className="btn-primary text-xs py-1.5 px-3"
            >
              {t.nav.contact}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

