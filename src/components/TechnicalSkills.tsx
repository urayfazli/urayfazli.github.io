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
    <div className="mt-6 pt-5 border-t-2 border-dashed border-[#fbeee0]/20">
      {/* Header with Custom Handcrafted Terminal Doodle (No AI Slop) and Category Filters */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3.5">
        <div className="flex items-center gap-2">
          {/* Custom Bespoke Terminal Node Doodle matching the site's warm anime/tech theme */}
          <div className="w-6 h-6 rounded-lg bg-[#9d613c]/20 border-[1.8px] border-[#fbeee0]/70 flex items-center justify-center shrink-0 rotate-[-3deg]">
            <TechTerminalDoodle className="w-3.5 h-3.5 text-[#fbeee0]" />
          </div>
          <h3 className="font-fredoka text-sm sm:text-base font-medium tracking-wide text-[#fbeee0]">
            Technical Skills
          </h3>
        </div>

        {/* Category Filter Interactive Tabs */}
        <div className="flex items-center gap-1 bg-[#0b1018] p-1 rounded-xl border-[1.8px] border-[#fbeee0]/40 text-[11px] max-w-full overflow-x-auto shrink-0">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`px-2.5 py-1 sm:py-0.5 rounded-lg font-mono text-[11px] transition-all duration-200 cursor-pointer whitespace-nowrap ${
                activeCategory === cat.id
                  ? 'bg-[#9d613c] text-white border border-[#fbeee0]/80 shadow-xs font-semibold'
                  : 'text-[#d8c8b8] hover:text-[#fbeee0] hover:bg-white/5'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Handcrafted Skill Items with Doodle Tag Borders */}
      <div className="flex flex-wrap gap-2.5 items-center" role="list">
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
              className={`doodle-tag group relative inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e59b63] ${
                isHighlighted
                  ? 'bg-[#182333] text-[#fbeee0] hover:bg-[#9d613c]/25'
                  : 'bg-[#0e1520] text-[#d6c4b2] hover:text-white'
              } ${isFocusedOrHovered ? 'bg-[#9d613c]/30 border-[#fbeee0]' : ''}`}
            >
              {/* Bespoke SVG Icon */}
              <span className="shrink-0 flex items-center justify-center">
                {skill.icon}
              </span>

              <span>{skill.name}</span>

              {/* Special indicator for primary competencies */}
              {isHighlighted && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#e59b63] shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {/* Dynamic Skill Detail / Sketchbook Tooltip Note on Hover & Focus */}
      <div className="mt-4 min-h-[36px] px-3.5 py-2 rounded-xl bg-[#0b1018]/90 border-[1.8px] border-dashed border-[#fbeee0]/35 flex items-center transition-all duration-200">
        {hoveredSkill ? (
          <p className="text-[11px] sm:text-xs text-[#f0e4d6] flex items-center gap-1.5 animate-fade-in">
            <span className="text-[#e59b63] font-bold font-mono">
              {hoveredSkill.name}:
            </span>
            <span className="text-[#d8c8b8]">{hoveredSkill.desc}</span>
          </p>
        ) : (
          <p className="text-xs text-[#d6c4b2] font-hand tracking-wide flex items-center gap-2">
            <span className="text-[#e59b63] font-mono font-bold">&gt;_</span>
            <span>Hover or tap any skill badge above to read my field notes!</span>
          </p>
        )}
      </div>
    </div>
  );
};
