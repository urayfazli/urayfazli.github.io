import React, { useState } from 'react';
import {
  TechTerminalDoodle,
  LinuxTerminalIcon,
  DockerContainerIcon,
  K8sClusterIcon,
  NodeSecurityIcon,
  TelemetryWaveIcon,
  SlashingGuardIcon,
  StateSyncIcon,
  BashScriptIcon,
} from './Doodles';

export interface SkillItem {
  id: string;
  name: string;
  category: 'core' | 'devops' | 'security' | 'monitoring';
  icon: React.ReactNode;
  desc: string;
}

export const SKILLS_LIST: SkillItem[] = [
  {
    id: 'linux',
    name: 'Linux Administration',
    category: 'core',
    icon: <LinuxTerminalIcon className="w-3.5 h-3.5 text-[#9d613c] group-hover:text-[#fbeee0] transition-colors" />,
    desc: 'Systemd daemon lifecycle, kernel network tuning, bare-metal server optimization, and storage RAID.',
  },
  {
    id: 'docker',
    name: 'Docker',
    category: 'devops',
    icon: <DockerContainerIcon className="w-3.5 h-3.5 text-[#9d613c] group-hover:text-[#fbeee0] transition-colors" />,
    desc: 'Multi-stage container builds, automated daemon recovery, docker-compose node orchestration.',
  },
  {
    id: 'kubernetes',
    name: 'Kubernetes',
    category: 'devops',
    icon: <K8sClusterIcon className="w-3.5 h-3.5 text-[#9d613c] group-hover:text-[#fbeee0] transition-colors" />,
    desc: 'StatefulSets for validator nodes, persistent volume claims, automated pod rescheduling.',
  },
  {
    id: 'security',
    name: 'Blockchain Node Security',
    category: 'security',
    icon: <NodeSecurityIcon className="w-3.5 h-3.5 text-[#9d613c] group-hover:text-[#fbeee0] transition-colors" />,
    desc: 'Hardware Security Modules (HSM), key management isolation, zero-port RPC exposure, DDoS mitigations.',
  },
  {
    id: 'monitoring',
    name: 'Prometheus & Grafana',
    category: 'monitoring',
    icon: <TelemetryWaveIcon className="w-3.5 h-3.5 text-[#9d613c] group-hover:text-[#fbeee0] transition-colors" />,
    desc: 'Custom node exporters, real-time peer & block height telemetry, instant pager/Telegram alerting.',
  },
  {
    id: 'slashing',
    name: 'Slashing Protection',
    category: 'security',
    icon: <SlashingGuardIcon className="w-3.5 h-3.5 text-[#9d613c] group-hover:text-[#fbeee0] transition-colors" />,
    desc: 'Double-sign prevention policies, sentry node architecture, secure failover hooks.',
  },
  {
    id: 'sync',
    name: 'State Sync & Snapshots',
    category: 'core',
    icon: <StateSyncIcon className="w-3.5 h-3.5 text-[#9d613c] group-hover:text-[#fbeee0] transition-colors" />,
    desc: 'Fast bootstrap mechanisms, automated snapshot pruning, rockDB/levelDB compaction.',
  },
  {
    id: 'bash',
    name: 'Bash & Shell Scripting',
    category: 'devops',
    icon: <BashScriptIcon className="w-3.5 h-3.5 text-[#9d613c] group-hover:text-[#fbeee0] transition-colors" />,
    desc: 'Automated chain upgrades, health check daemons, zero-downtime binary replacements.',
  },
];

export const TechnicalSkills: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [hoveredSkill, setHoveredSkill] = useState<SkillItem | null>(null);

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'core', label: 'Systems' },
    { id: 'devops', label: 'DevOps' },
    { id: 'security', label: 'Security' },
    { id: 'monitoring', label: 'Monitoring' },
  ];

  const filteredSkills =
    activeCategory === 'all'
      ? SKILLS_LIST
      : SKILLS_LIST.filter((s) => s.category === activeCategory);

  return (
    <div className="mt-6 pt-5 border-t border-white/10">
      {/* Header with Custom Handcrafted Terminal Doodle (No AI Slop) and Category Filters */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          {/* Custom Bespoke Terminal Node Doodle matching the site's warm anime/tech theme */}
          <div className="w-6 h-6 rounded-lg bg-[#9d613c]/15 border border-[#9d613c]/40 flex items-center justify-center shrink-0">
            <TechTerminalDoodle className="w-3.5 h-3.5 text-[#9d613c]" />
          </div>
          <h3 className="font-fredoka text-sm sm:text-base font-medium tracking-wide text-[#fbeee0]">
            Technical Skills
          </h3>
        </div>

        {/* Category Filter Interactive Tabs */}
        <div className="flex items-center gap-1 bg-[#0d131c] p-1 rounded-lg border border-white/5 text-[11px] max-w-full overflow-x-auto shrink-0">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`px-2.5 py-1 sm:py-0.5 rounded-md font-mono text-[11px] transition-all duration-200 cursor-pointer whitespace-nowrap ${
                activeCategory === cat.id
                  ? 'bg-[#9d613c] text-white shadow-xs font-semibold'
                  : 'text-[#d8c8b8] hover:text-[#fbeee0] hover:bg-white/5'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Handcrafted Skill Items with Theme-Specific SVG Icons */}
      <div className="flex flex-wrap gap-2 items-center" role="list">
        {filteredSkills.map((skill) => {
          const isHighlighted =
            skill.id === 'linux' ||
            skill.id === 'docker' ||
            skill.id === 'kubernetes' ||
            skill.id === 'security';

          const isFocusedOrHovered = hoveredSkill?.id === skill.id;

          return (
            <button
              key={skill.id}
              type="button"
              role="listitem"
              onMouseEnter={() => setHoveredSkill(skill)}
              onMouseLeave={() => setHoveredSkill(null)}
              onFocus={() => setHoveredSkill(skill)}
              onBlur={() => setHoveredSkill(null)}
              className={`group relative inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium cursor-pointer transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9d613c] ${
                isHighlighted
                  ? 'bg-[#182333] border border-[#9d613c]/60 text-[#fbeee0] hover:bg-[#9d613c]/20 hover:border-[#9d613c] shadow-xs hover:scale-105'
                  : 'bg-[#101722] border border-[#222f42] text-[#d6c4b2] hover:border-[#9d613c]/50 hover:text-white hover:scale-102'
              } ${isFocusedOrHovered ? 'ring-1 ring-[#9d613c] border-[#9d613c]' : ''}`}
            >
              {/* Bespoke SVG Icon */}
              <span className="shrink-0 flex items-center justify-center">
                {skill.icon}
              </span>

              <span>{skill.name}</span>

              {/* Special indicator for primary competencies */}
              {isHighlighted && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#9d613c] shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {/* Dynamic Skill Detail / Tooltip Note on Hover & Focus */}
      <div className="mt-3 min-h-[34px] px-3 py-1.5 rounded-xl bg-[#0e141e] border border-white/10 flex items-center transition-all duration-200">
        {hoveredSkill ? (
          <p className="text-[11px] sm:text-xs text-[#f0e4d6] flex items-center gap-1.5 animate-fade-in">
            <span className="text-[#b97746] font-bold font-mono">
              {hoveredSkill.name}:
            </span>
            <span className="text-[#d8c8b8]">{hoveredSkill.desc}</span>
          </p>
        ) : (
          <p className="text-[11px] text-[#b8a796] font-mono flex items-center gap-2">
            <span className="text-[#9d613c] font-bold">&gt;_</span>
            <span>Hover or focus on any skill tag to view operational scope</span>
          </p>
        )}
      </div>
    </div>
  );
};
