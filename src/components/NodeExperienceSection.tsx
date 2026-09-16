import React, { useState } from 'react';
import { Server, CheckCircle2, Cpu, HardDrive, Wifi, ExternalLink, Zap, ShieldAlert, Activity, Database, Check } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { NodeExperience } from '../types';

export const NodeExperienceSection: React.FC = () => {
  const [selectedNodeId, setSelectedNodeId] = useState<string>('sei-network');
  const { t } = useLanguage();

  const currentNodes = t.experience.nodes;
  const selectedNode = currentNodes.find(n => n.id === selectedNodeId) || currentNodes[0];

  return (
    <section id="pengalaman" className="py-16 bg-[#FFFFFF] border-y border-[#E2E8F0]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#EDF2F7] text-[#2B6CB0] text-xs font-semibold uppercase tracking-wider mb-2">
            {t.experience.badge}
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-heading text-[#1A202C]">
            {t.experience.heading}
          </h2>
          <p className="mt-3 text-base sm:text-lg text-[#718096]">
            {t.experience.subheading}
          </p>
        </div>

        {/* Network Selector Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {currentNodes.map((node) => {
            const isSelected = node.id === selectedNodeId;
            return (
              <button
                key={node.id}
                onClick={() => setSelectedNodeId(node.id)}
                className={`p-4 text-left rounded-lg transition-all cursor-pointer border ${
                  isSelected
                    ? 'border-[#2B6CB0] bg-[#F7FAFC] shadow-sm ring-1 ring-[#2B6CB0]'
                    : 'border-[#E2E8F0] bg-[#FFFFFF] hover:border-[#CBD5E0] hover:bg-[#F7FAFC]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold px-2 py-0.5 rounded text-white" style={{ backgroundColor: node.badgeColor }}>
                    {node.logoText}
                  </span>
                  <span className="text-xs font-medium text-[#38A169] flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#38A169]"></span>
                    {node.status}
                  </span>
                </div>
                <h3 className="text-base font-bold font-heading text-[#1A202C]">{node.name}</h3>
                <p className="text-xs text-[#718096] truncate mt-0.5">{node.role}</p>
              </button>
            );
          })}
        </div>

        {/* Detailed Node View */}
        <div className="custom-card p-6 sm:p-8 border border-[#E2E8F0]">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-[#E2E8F0]">
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="text-xs font-bold px-2.5 py-1 rounded text-white" style={{ backgroundColor: selectedNode.badgeColor }}>
                  {selectedNode.logoText}
                </span>
                <h3 className="text-xl sm:text-2xl font-bold font-heading text-[#1A202C]">
                  {selectedNode.name}
                </h3>
                <span className="text-xs px-2.5 py-1 bg-[#EDF2F7] text-[#1A202C] font-semibold rounded-md">
                  {selectedNode.networkType}
                </span>
              </div>
              <p className="text-sm font-medium text-[#718096] mt-1.5">
                {selectedNode.role} • <span className="text-[#2B6CB0]">{selectedNode.period}</span>
              </p>
            </div>

            {selectedNode.link && (
              <a
                href={selectedNode.link}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary text-xs self-start lg:self-center"
              >
                <span>{t.experience.visitNetworkBtn}</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#718096]" />
              </a>
            )}
          </div>

          <div className="py-6">
            <p className="text-base text-[#1A202C] leading-relaxed">
              {selectedNode.description}
            </p>
          </div>

          {/* Performance Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {selectedNode.metrics.map((metric, idx) => (
              <div key={idx} className="p-4 bg-[#F7FAFC] rounded-lg border border-[#EDF2F7]">
                <div className="text-xs font-medium text-[#718096]">{metric.label}</div>
                <div className="text-2xl font-extrabold font-heading text-[#2B6CB0] mt-1">
                  {metric.value}
                </div>
                <div className="text-xs text-[#718096] mt-0.5">{metric.sublabel}</div>
              </div>
            ))}
          </div>

          {/* Grid: Key Responsibilities & Hardware Specs */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4 border-t border-[#E2E8F0]">
            
            {/* Responsibilities */}
            <div className="lg:col-span-7 space-y-4">
              <h4 className="text-sm font-bold font-heading uppercase text-[#1A202C] tracking-wide flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#2B6CB0]" />
                {t.experience.responsibilitiesTitle}
              </h4>
              <ul className="space-y-3">
                {selectedNode.keyResponsibilities.map((resp, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-[#1A202C]">
                    <div className="w-5 h-5 rounded-full bg-[#EBF8FF] text-[#2B6CB0] flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                    <span className="leading-relaxed">{resp}</span>
                  </li>
                ))}
              </ul>

              {/* Tech Stack for this node */}
              <div className="pt-4">
                <div className="text-xs font-semibold text-[#718096] uppercase mb-2">
                  {t.experience.techStackTitle}:
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedNode.techStack.map((tech, i) => (
                    <span
                      key={i}
                      className="text-xs font-medium px-2.5 py-1 bg-[#EDF2F7] text-[#1A202C] rounded-md border border-[#E2E8F0]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Hardware & Server Specifications */}
            <div className="lg:col-span-5">
              <div className="p-5 bg-[#F7FAFC] rounded-lg border border-[#E2E8F0] space-y-4">
                <h4 className="text-sm font-bold font-heading uppercase text-[#1A202C] tracking-wide flex items-center gap-2">
                  <Server className="w-4 h-4 text-[#2B6CB0]" />
                  {t.experience.hardwareSpecsTitle}
                </h4>
                
                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-[#EDF2F7]">
                    <span className="flex items-center gap-2 text-[#718096]">
                      <Cpu className="w-4 h-4 text-[#2B6CB0]" />
                      <span>Processor</span>
                    </span>
                    <span className="font-semibold text-[#1A202C]">{selectedNode.specs.cpu}</span>
                  </div>

                  <div className="flex items-center justify-between pb-2 border-b border-[#EDF2F7]">
                    <span className="flex items-center gap-2 text-[#718096]">
                      <Zap className="w-4 h-4 text-[#2B6CB0]" />
                      <span>Memory (RAM)</span>
                    </span>
                    <span className="font-semibold text-[#1A202C]">{selectedNode.specs.ram}</span>
                  </div>

                  <div className="flex items-center justify-between pb-2 border-b border-[#EDF2F7]">
                    <span className="flex items-center gap-2 text-[#718096]">
                      <HardDrive className="w-4 h-4 text-[#2B6CB0]" />
                      <span>NVMe Storage</span>
                    </span>
                    <span className="font-semibold text-[#1A202C]">{selectedNode.specs.storage}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-[#718096]">
                      <Wifi className="w-4 h-4 text-[#2B6CB0]" />
                      <span>Throughput Port</span>
                    </span>
                    <span className="font-semibold text-[#1A202C]">{selectedNode.specs.network}</span>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-white rounded border border-[#E2E8F0] text-[11px] text-[#718096] flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-[#38A169] shrink-0" />
                  <span>SNA Sentry Node Architecture & DDoS shielded</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Comprehensive Grid of All 3 Networks */}
        <div className="mt-12 pt-8 border-t border-[#E2E8F0]">
          <h3 className="text-lg font-bold font-heading text-[#1A202C] mb-6">
            {t.experience.heading}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {currentNodes.map((node) => (
              <div 
                key={node.id}
                onClick={() => setSelectedNodeId(node.id)}
                className="custom-card p-5 border border-[#E2E8F0] hover:border-[#2B6CB0] transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="font-bold text-sm text-white px-2 py-0.5 rounded" style={{ backgroundColor: node.badgeColor }}>
                    {node.logoText}
                  </span>
                  <span className="text-xs text-[#718096]">{node.period}</span>
                </div>
                <h4 className="font-bold font-heading text-base text-[#1A202C]">{node.name}</h4>
                <p className="text-xs text-[#718096] mt-1 line-clamp-2">{node.tagline}</p>
                <div className="mt-4 pt-3 border-t border-[#EDF2F7] flex items-center justify-between text-xs">
                  <span className="text-[#718096]">Status:</span>
                  <span className="font-semibold text-[#38A169] flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {node.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

