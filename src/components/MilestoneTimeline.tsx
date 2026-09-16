import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Server, 
  ShieldCheck, 
  Activity, 
  Database, 
  Zap, 
  CheckCircle2, 
  Layers, 
  Check, 
  Calendar,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import { MilestoneItem } from '../types';

interface MilestoneTimelineProps {
  milestones: MilestoneItem[];
  badgeText: string;
  title: string;
  subheading: string;
  onSelectNode?: (nodeId: string) => void;
}

export const MilestoneTimeline: React.FC<MilestoneTimelineProps> = ({
  milestones,
  badgeText,
  title,
  subheading,
  onSelectNode
}) => {
  const [activeMilestoneId, setActiveMilestoneId] = useState<string | null>(null);

  // Helper to map network names to node ID for interactive jumping
  const getNodeMapping = (networkName?: string): string | null => {
    if (!networkName) return null;
    const lower = networkName.toLowerCase();
    if (lower.includes('sei')) return 'sei-network';
    if (lower.includes('aptos')) return 'aptos-network';
    if (lower.includes('subquery')) return 'subquery-network';
    return null;
  };

  const getMilestoneIcon = (milestone: MilestoneItem, index: number) => {
    if (milestone.isCurrent) return <Sparkles className="w-4 h-4 text-white" />;
    if (milestone.network?.includes('Sei')) return <Zap className="w-4 h-4 text-white" />;
    if (milestone.network?.includes('Aptos')) return <Activity className="w-4 h-4 text-white" />;
    if (milestone.network?.includes('SubQuery')) return <Database className="w-4 h-4 text-white" />;
    if (index === 0) return <Layers className="w-4 h-4 text-white" />;
    return <Server className="w-4 h-4 text-white" />;
  };

  return (
    <div className="mt-16 pt-12 border-t border-[#E2E8F0]">
      {/* Timeline Section Header */}
      <motion.div 
        className="max-w-3xl mb-12"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#EBF8FF] text-[#2B6CB0] text-xs font-semibold uppercase tracking-wider border border-[#BEE3F8] mb-3">
          <Calendar className="w-3.5 h-3.5" />
          {badgeText}
        </div>
        <h3 className="text-2xl sm:text-3xl font-extrabold font-heading text-[#1A202C] tracking-tight leading-tight">
          {title}
        </h3>
        <p className="mt-2 text-sm sm:text-base text-[#718096] leading-relaxed">
          {subheading}
        </p>
      </motion.div>

      {/* Vertical Timeline Track */}
      <div className="relative pl-7 sm:pl-10 ml-3 sm:ml-4 border-l-2 border-[#E2E8F0] space-y-8 sm:space-y-12 pb-4">
        {milestones.map((milestone, index) => {
          const associatedNodeId = getNodeMapping(milestone.network);
          const isSelected = activeMilestoneId === milestone.id;

          return (
            <motion.div
              key={milestone.id}
              id={`timeline-milestone-${milestone.id}`}
              className="relative group"
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
              onMouseEnter={() => setActiveMilestoneId(milestone.id)}
              onMouseLeave={() => setActiveMilestoneId(null)}
            >
              {/* Timeline Marker Dot & Node Icon - Centered on border line */}
              <div 
                className={`absolute -left-[17px] sm:-left-[21px] top-1.5 w-8 sm:w-10 h-8 sm:h-10 rounded-full flex items-center justify-center ring-4 ring-[#FFFFFF] shadow-xs transition-all duration-300 z-10 ${
                  milestone.isCurrent
                    ? 'bg-[#2B6CB0] ring-[#BEE3F8]'
                    : isSelected
                    ? 'bg-[#2B6CB0] scale-110 ring-[#E2E8F0]'
                    : 'bg-[#4A5568]'
                }`}
                style={{ backgroundColor: milestone.badgeColor || '#2B6CB0' }}
              >
                {getMilestoneIcon(milestone, index)}
              </div>

              {/* Milestone Card Content */}
              <motion.div
                className={`custom-card p-4 sm:p-6 sm:p-7 border transition-all duration-200 ${
                  isSelected 
                    ? 'border-[#2B6CB0] shadow-md bg-[#FFFFFF]' 
                    : 'border-[#E2E8F0] hover:border-[#CBD5E0] bg-[#FFFFFF]'
                }`}
                whileHover={{ 
                  y: -3, 
                  boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.06), 0 4px 6px -2px rgba(0, 0, 0, 0.03)" 
                }}
              >
                {/* Header Row: Period, Role, Network Tag */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 mb-3 border-b border-[#EDF2F7]">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-md flex items-center gap-1.5 ${
                      milestone.isCurrent
                        ? 'bg-[#EBF8FF] text-[#2B6CB0] border border-[#BEE3F8]'
                        : 'bg-[#F7FAFC] text-[#4A5568] border border-[#E2E8F0]'
                    }`}>
                      <Calendar className="w-3 h-3 text-[#2B6CB0] shrink-0" />
                      <span>{milestone.period}</span>
                    </span>

                    {milestone.isCurrent && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-[#C6F6D5] text-[#22543D]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#38A169] animate-pulse"></span>
                        Active Operation
                      </span>
                    )}

                    {milestone.network && (
                      <span 
                        className="text-xs font-semibold px-2 py-0.5 rounded text-white"
                        style={{ backgroundColor: milestone.badgeColor || '#2B6CB0' }}
                      >
                        {milestone.network}
                      </span>
                    )}
                  </div>

                  {associatedNodeId && onSelectNode && (
                    <button
                      onClick={() => {
                        onSelectNode(associatedNodeId);
                        const element = document.getElementById('pengalaman');
                        if (element) {
                          element.scrollIntoView({ behavior: 'smooth' });
                        }
                      }}
                      className="text-xs font-semibold text-[#2B6CB0] hover:text-[#2C5282] inline-flex items-center gap-1 transition-colors group/btn self-start sm:self-auto cursor-pointer"
                    >
                      <span>View Node Specs</span>
                      <ArrowUpRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                    </button>
                  )}
                </div>

                {/* Title & Role */}
                <div>
                  <h4 className="text-base sm:text-xl font-bold font-heading text-[#1A202C] tracking-tight leading-snug">
                    {milestone.title}
                  </h4>
                  <p className="text-xs sm:text-sm font-semibold text-[#2B6CB0] mt-1">
                    {milestone.role}
                  </p>
                </div>

                {/* Narrative Description */}
                <p className="mt-3 text-xs sm:text-sm text-[#4A5568] leading-relaxed">
                  {milestone.description}
                </p>

                {/* Key Achievements Bullet Points */}
                <div className="mt-4 pt-3 border-t border-[#EDF2F7]">
                  <div className="text-[11px] sm:text-xs font-bold text-[#718096] uppercase tracking-wider mb-2">
                    Key Technical Highlights:
                  </div>
                  <ul className="space-y-2">
                    {milestone.achievements.map((ach, achIdx) => (
                      <li key={achIdx} className="flex items-start gap-2 text-xs sm:text-sm text-[#1A202C]">
                        <div className="w-4 h-4 rounded-full bg-[#EBF8FF] text-[#2B6CB0] flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                        <span className="leading-snug">{ach}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Metrics Badges */}
                {milestone.metrics && milestone.metrics.length > 0 && (
                  <div className="mt-4 pt-3 flex flex-wrap gap-2">
                    {milestone.metrics.map((m, mIdx) => (
                      <div 
                        key={mIdx}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#F7FAFC] rounded border border-[#E2E8F0] text-xs"
                      >
                        <span className="text-[#718096] font-medium text-[11px]">{m.label}:</span>
                        <span className="font-bold text-[#1A202C] text-xs">{m.value}</span>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
