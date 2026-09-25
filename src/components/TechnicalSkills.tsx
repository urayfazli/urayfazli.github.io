import React, { useState } from 'react';

export interface SkillItem {
  name: string;
  category: 'core' | 'devops' | 'security' | 'monitoring';
  icon?: string;
  desc: string;
}

export const SKILLS_LIST: SkillItem[] = [
  {
    name: 'Linux Administration',
    category: 'core',
    icon: '🐧',
    desc: 'Systemd service management, kernel tuning, bare-metal server optimization, and storage RAID.',
  },
  {
    name: 'Docker',
    category: 'devops',
    icon: '🐳',
    desc: 'Multi-stage container builds, automated daemon recovery, docker-compose orchestration.',
  },
  {
    name: 'Kubernetes',
    category: 'devops',
    icon: '☸️',
    desc: 'StatefulSets for validator nodes, persistent volume claims, automated pod rescheduling.',
  },
  {
    name: 'Blockchain Node Security',
    category: 'security',
    icon: '🛡️',
    desc: 'Hardware Security Modules (HSM), key management isolation, zero-port RPC exposure, DDoS mitigations.',
  },
  {
    name: 'Prometheus & Grafana',
    category: 'monitoring',
    icon: '📊',
    desc: 'Custom exporters, real-time peer & block height telemetry, instant pager/Telegram alerting.',
  },
  {
    name: 'Slashing Protection',
    category: 'security',
    icon: '⚡',
    desc: 'Double-sign prevention policies, sentry node architecture, secure failover hooks.',
  },
  {
    name: 'State Sync & Snapshots',
    category: 'core',
    icon: '🔄',
    desc: 'Fast bootstrap mechanisms, automated snapshot pruning, rockDB/levelDB compaction.',
  },
  {
    name: 'Bash & Shell Scripting',
    category: 'devops',
    icon: '💻',
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
      {/* Header with Title and Filter Segmented Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-1.5">
          <span className="text-[#9d613c] text-xs">✦</span>
          <h3 className="font-fredoka text-sm sm:text-base font-medium tracking-wide text-[#fbeee0]">
            Technical Skills
          </h3>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1 bg-[#0d131c] p-1 rounded-full border border-white/5 text-[11px] max-w-full overflow-x-auto shrink-0">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-2.5 py-1 sm:py-0.5 rounded-full font-medium transition-all duration-200 cursor-pointer whitespace-nowrap ${
                activeCategory === cat.id
                  ? 'bg-[#9d613c] text-white shadow-xs'
                  : 'text-[#d8c8b8] hover:text-[#fbeee0]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Visually Appealing Pill-Style Tag Cloud */}
      <div className="flex flex-wrap gap-2 items-center" role="list">
        {filteredSkills.map((skill) => {
          const isHighlighted =
            skill.name === 'Linux Administration' ||
            skill.name === 'Docker' ||
            skill.name === 'Kubernetes' ||
            skill.name === 'Blockchain Node Security';

          const isFocusedOrHovered = hoveredSkill?.name === skill.name;

          return (
            <button
              key={skill.name}
              type="button"
              role="listitem"
              onMouseEnter={() => setHoveredSkill(skill)}
              onMouseLeave={() => setHoveredSkill(null)}
              onFocus={() => setHoveredSkill(skill)}
              onBlur={() => setHoveredSkill(null)}
              className={`group relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9d613c] ${
                isHighlighted
                  ? 'bg-[#182333] border border-[#9d613c]/60 text-[#fbeee0] hover:bg-[#9d613c]/20 hover:border-[#9d613c] shadow-xs hover:scale-105'
                  : 'bg-[#101722] border border-[#222f42] text-[#d6c4b2] hover:border-[#9d613c]/50 hover:text-white hover:scale-102'
              } ${isFocusedOrHovered ? 'ring-1 ring-[#9d613c]' : ''}`}
            >
              {/* Subtle category dot or icon */}
              {skill.icon ? (
                <span className="text-xs opacity-90 group-hover:scale-110 transition-transform">
                  {skill.icon}
                </span>
              ) : (
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isHighlighted ? 'bg-[#9d613c]' : 'bg-[#5b6f8a]'
                  }`}
                />
              )}

              <span>{skill.name}</span>

              {/* Special badge indicator for core competencies */}
              {isHighlighted && (
                <span className="w-1 h-1 rounded-full bg-[#9d613c]" />
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
          <p className="text-[11px] text-[#b8a796] font-mono flex items-center gap-1.5">
            <span>💡</span>
            <span>Hover or focus on any skill tag to view operational scope</span>
          </p>
        )}
      </div>
    </div>
  );
};
