import React, { useState, useEffect } from 'react';
import { Terminal, Activity, RefreshCw, Play, Pause, Server, Wifi, CheckCircle2, ShieldCheck, Database } from 'lucide-react';
import { sampleTerminalLogs } from '../data/portfolioData';
import { useLanguage } from '../context/LanguageContext';
import { TerminalLog } from '../types';

export const LiveNodeMonitor: React.FC = () => {
  const [logs, setLogs] = useState<TerminalLog[]>(sampleTerminalLogs);
  const [isStreaming, setIsStreaming] = useState<boolean>(true);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [pingLatency, setPingLatency] = useState<number>(28);
  const [isPinging, setIsPinging] = useState<boolean>(false);
  const { t } = useLanguage();

  // Simulated live block heights
  const [seiBlockHeight, setSeiBlockHeight] = useState<number>(24912410);
  const [aptosLedgerVersion, setAptosLedgerVersion] = useState<number>(182940120);
  const [subqueryHeight, setSubqueryHeight] = useState<number>(51209300);

  // Interval for ticking block heights and periodic log entries
  useEffect(() => {
    if (!isStreaming) return;

    const interval = setInterval(() => {
      // Increment block heights
      setSeiBlockHeight(prev => prev + 1);
      setAptosLedgerVersion(prev => prev + Math.floor(Math.random() * 12) + 4);
      setSubqueryHeight(prev => prev + 1);

      // Add a simulated log
      const nodes = [
        { node: 'sei-validator-01', type: 'success' as const, msg: `Signed block #${seiBlockHeight + 1} with 0 missed signatures.` },
        { node: 'aptos-fullnode-01', type: 'info' as const, msg: `Committed state checkpoint for chunk ${(aptosLedgerVersion / 1000).toFixed(0)}k.` },
        { node: 'subquery-indexer', type: 'info' as const, msg: `GraphQL cache refreshed. Indexed block #${subqueryHeight + 1}. Latency 22ms.` }
      ];

      const randomNode = nodes[Math.floor(Math.random() * nodes.length)];
      const now = new Date();
      const timestamp = now.toTimeString().split(' ')[0];

      const newLog: TerminalLog = {
        id: Math.random().toString(),
        timestamp,
        node: randomNode.node,
        type: randomNode.type,
        message: randomNode.msg
      };

      setLogs(prev => [newLog, ...prev.slice(0, 19)]);
    }, 3500);

    return () => clearInterval(interval);
  }, [isStreaming, seiBlockHeight, aptosLedgerVersion, subqueryHeight]);

  const handleTestPing = () => {
    setIsPinging(true);
    setTimeout(() => {
      setPingLatency(Math.floor(Math.random() * 15) + 20);
      setIsPinging(false);
    }, 600);
  };

  const filteredLogs = selectedFilter === 'all' 
    ? logs 
    : logs.filter(l => l.node.includes(selectedFilter));

  return (
    <section id="monitor" className="py-16 bg-[#F7FAFC]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#EBF8FF] text-[#2B6CB0] text-xs font-semibold uppercase tracking-wider mb-2">
              <Activity className="w-3.5 h-3.5" />
              {t.telemetry.badge}
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-heading text-[#1A202C]">
              {t.telemetry.heading}
            </h2>
            <p className="mt-2 text-sm sm:text-base text-[#718096]">
              {t.telemetry.subheading}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleTestPing}
              disabled={isPinging}
              className="btn-secondary text-xs cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isPinging ? 'animate-spin text-[#2B6CB0]' : ''}`} />
              <span>Ping RPC: {pingLatency}ms</span>
            </button>
            <button
              onClick={() => setIsStreaming(!isStreaming)}
              className={`text-xs px-3 py-2 rounded-lg font-medium transition-colors flex items-center gap-1.5 cursor-pointer border ${
                isStreaming
                  ? 'bg-[#F0FFF4] text-[#38A169] border-[#C6F6D5]'
                  : 'bg-[#FFF5F5] text-[#E53E3E] border-[#FED7D7]'
              }`}
            >
              {isStreaming ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isStreaming ? t.telemetry.liveStreamActive : t.telemetry.paused}</span>
            </button>
          </div>
        </div>

        {/* 3 Node Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          
          {/* Sei Network Status */}
          <div className="custom-card p-5 border border-[#E2E8F0]">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#2B6CB0]"></span>
                <h3 className="text-sm font-bold font-heading text-[#1A202C]">Sei Network Validator</h3>
              </div>
              <span className="text-[11px] px-2 py-0.5 bg-[#F0FFF4] text-[#38A169] font-semibold rounded border border-[#C6F6D5]">
                Active
              </span>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-[#EDF2F7]">
                <span className="text-[#718096]">Block Height:</span>
                <span className="font-mono font-semibold text-[#1A202C]">#{seiBlockHeight.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#EDF2F7]">
                <span className="text-[#718096]">Missed Ratio:</span>
                <span className="font-semibold text-[#38A169]">0.00%</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-[#718096]">Active Peers:</span>
                <span className="font-semibold text-[#1A202C]">48 Connected</span>
              </div>
            </div>
          </div>

          {/* Aptos Status */}
          <div className="custom-card p-5 border border-[#E2E8F0]">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#38A169]"></span>
                <h3 className="text-sm font-bold font-heading text-[#1A202C]">Aptos FullNode</h3>
              </div>
              <span className="text-[11px] px-2 py-0.5 bg-[#F0FFF4] text-[#38A169] font-semibold rounded border border-[#C6F6D5]">
                Active
              </span>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-[#EDF2F7]">
                <span className="text-[#718096]">Ledger Version:</span>
                <span className="font-mono font-semibold text-[#1A202C]">v{aptosLedgerVersion.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#EDF2F7]">
                <span className="text-[#718096]">Parallel Engine:</span>
                <span className="font-semibold text-[#2B6CB0]">Block-STM Active</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-[#718096]">REST/gRPC SLA:</span>
                <span className="font-semibold text-[#38A169]">100% Up</span>
              </div>
            </div>
          </div>

          {/* SubQuery Status */}
          <div className="custom-card p-5 border border-[#E2E8F0]">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#DD6B20]"></span>
                <h3 className="text-sm font-bold font-heading text-[#1A202C]">SubQuery Indexer</h3>
              </div>
              <span className="text-[11px] px-2 py-0.5 bg-[#F0FFF4] text-[#38A169] font-semibold rounded border border-[#C6F6D5]">
                Active
              </span>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-[#EDF2F7]">
                <span className="text-[#718096]">Target Height:</span>
                <span className="font-mono font-semibold text-[#1A202C]">#{subqueryHeight.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#EDF2F7]">
                <span className="text-[#718096]">Avg Query Latency:</span>
                <span className="font-semibold text-[#2B6CB0]">&lt; 25ms</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-[#718096]">Postgres & Cache:</span>
                <span className="font-semibold text-[#38A169]">Healthy</span>
              </div>
            </div>
          </div>

        </div>

        {/* Live Terminal Output Box */}
        <div className="custom-card overflow-hidden border border-[#E2E8F0] shadow-sm">
          {/* Terminal Top Bar */}
          <div className="bg-[#1A202C] px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#2D3748]">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#E53E3E] inline-block"></span>
                <span className="w-3 h-3 rounded-full bg-[#DD6B20] inline-block"></span>
                <span className="w-3 h-3 rounded-full bg-[#38A169] inline-block"></span>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#E2E8F0] font-mono">
                <Terminal className="w-3.5 h-3.5 text-[#63B3ED]" />
                <span>urayfazli@validator-cluster:~# journalctl -u node-ops -f</span>
              </div>
            </div>

            {/* Filter Buttons */}
            <div className="flex items-center gap-1.5 text-xs">
              <button
                onClick={() => setSelectedFilter('all')}
                className={`px-2 py-1 rounded text-[11px] font-medium cursor-pointer transition-colors ${
                  selectedFilter === 'all'
                    ? 'bg-[#2B6CB0] text-white'
                    : 'bg-[#2D3748] text-[#CBD5E0] hover:bg-[#4A5568]'
                }`}
              >
                {t.telemetry.filterAll}
              </button>
              <button
                onClick={() => setSelectedFilter('sei')}
                className={`px-2 py-1 rounded text-[11px] font-medium cursor-pointer transition-colors ${
                  selectedFilter === 'sei'
                    ? 'bg-[#2B6CB0] text-white'
                    : 'bg-[#2D3748] text-[#CBD5E0] hover:bg-[#4A5568]'
                }`}
              >
                Sei
              </button>
              <button
                onClick={() => setSelectedFilter('aptos')}
                className={`px-2 py-1 rounded text-[11px] font-medium cursor-pointer transition-colors ${
                  selectedFilter === 'aptos'
                    ? 'bg-[#2B6CB0] text-white'
                    : 'bg-[#2D3748] text-[#CBD5E0] hover:bg-[#4A5568]'
                }`}
              >
                Aptos
              </button>
              <button
                onClick={() => setSelectedFilter('subquery')}
                className={`px-2 py-1 rounded text-[11px] font-medium cursor-pointer transition-colors ${
                  selectedFilter === 'subquery'
                    ? 'bg-[#2B6CB0] text-white'
                    : 'bg-[#2D3748] text-[#CBD5E0] hover:bg-[#4A5568]'
                }`}
              >
                SubQuery
              </button>
            </div>
          </div>

          {/* Terminal Body */}
          <div className="bg-[#1A202C] p-4 text-[#F7FAFC] font-mono text-xs max-h-72 overflow-y-auto space-y-2">
            {filteredLogs.map((log) => (
              <div key={log.id} className="flex items-start gap-2.5 leading-relaxed hover:bg-[#2D3748]/50 p-1 rounded">
                <span className="text-[#718096] shrink-0">[{log.timestamp}]</span>
                <span className={`px-1.5 py-0.2 rounded text-[10px] uppercase font-bold shrink-0 ${
                  log.node.includes('sei') ? 'bg-[#2B6CB0]/40 text-[#63B3ED]' :
                  log.node.includes('aptos') ? 'bg-[#38A169]/40 text-[#68D391]' :
                  'bg-[#DD6B20]/40 text-[#FBD38D]'
                }`}>
                  {log.node}
                </span>
                <span className={`${
                  log.type === 'success' ? 'text-[#68D391]' :
                  log.type === 'warning' ? 'text-[#FBD38D]' :
                  'text-[#E2E8F0]'
                }`}>
                  {log.message}
                </span>
              </div>
            ))}
          </div>

          {/* Terminal Footer Info */}
          <div className="bg-[#2D3748] px-4 py-2 text-[11px] text-[#CBD5E0] flex items-center justify-between border-t border-[#4A5568]">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#68D391]" />
              <span>TLS Endpoints Encrypted • Zero Slashing Incidents</span>
            </span>
            <span className="font-mono text-[#A0AEC0]">Uptime: 99.98% SLA</span>
          </div>

        </div>

      </div>
    </section>
  );
};

