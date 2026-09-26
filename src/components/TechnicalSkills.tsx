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
import { useLanguage } from '../context/LanguageContext';

export interface SkillItem {
  id: string;
  name: string;
  nameId?: string;
  category: 'core' | 'devops' | 'security' | 'monitoring';
  icon: React.ReactNode;
  desc: string;
  descId?: string;
}

export const SKILLS_LIST: SkillItem[] = [
  {
    id: 'linux',
    name: 'Linux Administration',
    nameId: 'Administrasi Linux',
    category: 'core',
    icon: <LinuxTerminalIcon className="w-3.5 h-3.5 text-[#9d613c] group-hover:text-[#fbeee0] transition-colors" />,
    desc: 'Systemd daemon lifecycle, kernel network tuning, bare-metal server optimization, and storage RAID.',
    descId: 'Manajemen daemon systemd, tuning jaringan kernel, optimasi server bare-metal, dan penyimpanan RAID.',
  },
  {
    id: 'docker',
    name: 'Docker',
    nameId: 'Docker',
    category: 'devops',
    icon: <DockerContainerIcon className="w-3.5 h-3.5 text-[#9d613c] group-hover:text-[#fbeee0] transition-colors" />,
    desc: 'Multi-stage container builds, automated daemon recovery, docker-compose node orchestration.',
    descId: 'Build container multi-tahap, pemulihan daemon otomatis, dan orkestrasi node dengan docker-compose.',
  },
  {
    id: 'kubernetes',
    name: 'Kubernetes',
    nameId: 'Kubernetes',
    category: 'devops',
    icon: <K8sClusterIcon className="w-3.5 h-3.5 text-[#9d613c] group-hover:text-[#fbeee0] transition-colors" />,
    desc: 'StatefulSets for validator nodes, persistent volume claims, automated pod rescheduling.',
    descId: 'StatefulSets untuk node validator, klaim volume persisten, dan penjadwalan ulang pod otomatis.',
  },
  {
    id: 'security',
    name: 'Blockchain Node Security',
    nameId: 'Keamanan Node Blockchain',
    category: 'security',
    icon: <NodeSecurityIcon className="w-3.5 h-3.5 text-[#9d613c] group-hover:text-[#fbeee0] transition-colors" />,
    desc: 'Hardware Security Modules (HSM), key management isolation, zero-port RPC exposure, DDoS mitigations.',
    descId: 'Hardware Security Modules (HSM), isolasi kunci kriptografi, proteksi port RPC, dan mitigasi DDoS.',
  },
  {
    id: 'monitoring',
    name: 'Prometheus & Grafana',
    nameId: 'Prometheus & Grafana',
    category: 'monitoring',
    icon: <TelemetryWaveIcon className="w-3.5 h-3.5 text-[#9d613c] group-hover:text-[#fbeee0] transition-colors" />,
    desc: 'Custom node exporters, real-time peer & block height telemetry, instant pager/Telegram alerting.',
    descId: 'Exporter node kustom, telemetri peer & tinggi blok real-time, serta peringatan instan via Telegram.',
  },
  {
    id: 'slashing',
    name: 'Slashing Protection',
    nameId: 'Proteksi Slashing',
    category: 'security',
    icon: <SlashingGuardIcon className="w-3.5 h-3.5 text-[#9d613c] group-hover:text-[#fbeee0] transition-colors" />,
    desc: 'Double-sign prevention policies, sentry node architecture, secure failover hooks.',
    descId: 'Kebijakan pencegahan double-sign, arsitektur sentry node, dan mekanisme failover aman.',
  },
  {
    id: 'sync',
    name: 'State Sync & Snapshots',
    nameId: 'State Sync & Snapshot',
    category: 'core',
    icon: <StateSyncIcon className="w-3.5 h-3.5 text-[#9d613c] group-hover:text-[#fbeee0] transition-colors" />,
    desc: 'Fast bootstrap mechanisms, automated snapshot pruning, rockDB/levelDB compaction.',
    descId: 'Mekanisme bootstrap cepat, pemangkasan snapshot otomatis, serta kompaksi database RocksDB/LevelDB.',
  },
  {
    id: 'bash',
    name: 'Bash & Shell Scripting',
    nameId: 'Skrip Bash & Shell',
    category: 'devops',
    icon: <BashScriptIcon className="w-3.5 h-3.5 text-[#9d613c] group-hover:text-[#fbeee0] transition-colors" />,
    desc: 'Automated chain upgrades, health check daemons, zero-downtime binary replacements.',
    descId: 'Otomatisasi upgrade jaringan, daemon pemeriksaan kesehatan node, dan penggantian biner tanpa downtime.',
  },
];

export const TechnicalSkills: React.FC = () => {
  const { lang } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [hoveredSkill, setHoveredSkill] = useState<SkillItem | null>(null);

  const categories = [
    { id: 'all', label: lang === 'id' ? 'Semua' : 'All' },
    { id: 'core', label: lang === 'id' ? 'Sistem' : 'Systems' },
    { id: 'devops', label: 'DevOps' },
    { id: 'security', label: lang === 'id' ? 'Keamanan' : 'Security' },
    { id: 'monitoring', label: lang === 'id' ? 'Pantauan' : 'Monitoring' },
  ];

  const filteredSkills =
    activeCategory === 'all'
      ? SKILLS_LIST
      : SKILLS_LIST.filter((s) => s.category === activeCategory);

  return (
    <div className="mt-4 pt-3.5 border-t border-dashed border-[#fbeee0]/20">
      {/* Header with Custom Handcrafted Terminal Doodle (No AI Slop) and Category Filters */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
        <div className="flex items-center gap-1.5">
          {/* Custom Bespoke Terminal Node Doodle matching the site's warm anime/tech theme */}
          <div className="w-5 h-5 rounded-md bg-[#9d613c]/20 border-[1.5px] border-[#fbeee0]/70 flex items-center justify-center shrink-0 rotate-[-3deg]">
            <TechTerminalDoodle className="w-3 h-3 text-[#fbeee0]" />
          </div>
          <h3 className="font-fredoka text-xs sm:text-sm font-medium tracking-wide text-[#fbeee0]">
            {lang === 'id' ? 'Keahlian Teknis' : 'Technical Skills'}
          </h3>
        </div>

        {/* Category Filter Interactive Tabs */}
        <div className="flex items-center gap-0.5 bg-[#0b1018] p-0.5 rounded-lg border border-[#fbeee0]/35 text-[10px] max-w-full overflow-x-auto shrink-0">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`px-2 py-0.5 rounded-md font-mono text-[10px] transition-all duration-200 cursor-pointer whitespace-nowrap ${
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
              className={`doodle-tag group relative inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e59b63] ${
                isHighlighted
                  ? 'bg-[#182333] text-[#fbeee0] hover:bg-[#9d613c]/25'
                  : 'bg-[#0e1520] text-[#d6c4b2] hover:text-white'
              } ${isFocusedOrHovered ? 'bg-[#9d613c]/30 border-[#fbeee0]' : ''}`}
            >
              {/* Bespoke SVG Icon */}
              <span className="shrink-0 flex items-center justify-center">
                {skill.icon}
              </span>

              <span>{lang === 'id' && skill.nameId ? skill.nameId : skill.name}</span>

              {/* Special indicator for primary competencies */}
              {isHighlighted && (
                <span className="w-1 h-1 rounded-full bg-[#e59b63] shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {/* Dynamic Skill Detail / Sketchbook Tooltip Note on Hover & Focus */}
      <div className="mt-3 min-h-[32px] px-3 py-1.5 rounded-lg bg-[#0b1018]/90 border border-dashed border-[#fbeee0]/30 flex items-center transition-all duration-200">
        {hoveredSkill ? (
          <p className="text-[11px] text-[#f0e4d6] flex flex-wrap items-baseline gap-1 animate-fade-in">
            <span className="text-[#e59b63] font-bold font-mono">
              {lang === 'id' && hoveredSkill.nameId ? hoveredSkill.nameId : hoveredSkill.name}:
            </span>
            <span className="text-[#d8c8b8]">
              {lang === 'id' && hoveredSkill.descId ? hoveredSkill.descId : hoveredSkill.desc}
            </span>
          </p>
        ) : (
          <p className="text-[11px] text-[#d6c4b2] font-hand tracking-wide flex items-center gap-1.5">
            <span className="text-[#e59b63] font-mono font-bold">&gt;_</span>
            <span>
              {lang === 'id'
                ? 'Arahkan kursor atau ketuk keahlian di atas untuk membaca catatan teknis saya!'
                : 'Hover or tap any skill badge above to read my field notes!'}
            </span>
          </p>
        )}
      </div>
    </div>
  );
};
