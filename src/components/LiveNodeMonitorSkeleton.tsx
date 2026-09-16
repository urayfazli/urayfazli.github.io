import React from 'react';
import { Terminal, ShieldCheck } from 'lucide-react';

export const NodeCardSkeleton: React.FC = () => {
  return (
    <div className="custom-card p-5 border border-[#E2E8F0] bg-[#FFFFFF] animate-pulse">
      {/* Card Header Skeleton */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#CBD5E0]" />
          <div className="h-4 w-36 bg-[#E2E8F0] rounded" />
        </div>
        <div className="h-4 w-14 bg-[#EDF2F7] rounded-full" />
      </div>

      {/* Metrics Rows Skeleton */}
      <div className="space-y-3 pt-1">
        <div className="flex justify-between items-center py-1 border-b border-[#EDF2F7]">
          <div className="h-3 w-20 bg-[#E2E8F0] rounded" />
          <div className="h-3.5 w-24 bg-[#CBD5E0] rounded font-mono" />
        </div>
        <div className="flex justify-between items-center py-1 border-b border-[#EDF2F7]">
          <div className="h-3 w-24 bg-[#E2E8F0] rounded" />
          <div className="h-3.5 w-16 bg-[#CBD5E0] rounded" />
        </div>
        <div className="flex justify-between items-center py-1">
          <div className="h-3 w-22 bg-[#E2E8F0] rounded" />
          <div className="h-3.5 w-28 bg-[#CBD5E0] rounded" />
        </div>
      </div>
    </div>
  );
};

export const TerminalSkeleton: React.FC = () => {
  return (
    <div className="custom-card overflow-hidden border border-[#E2E8F0] shadow-sm bg-[#1A202C] animate-pulse">
      {/* Top Bar Skeleton */}
      <div className="bg-[#1A202C] px-3.5 sm:px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-[#2D3748]">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="w-2.5 h-2.5 rounded-full bg-[#4A5568] inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#4A5568] inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#4A5568] inline-block" />
          </div>
          <div className="flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-[#4A5568] shrink-0" />
            <div className="h-3 w-48 sm:w-64 bg-[#2D3748] rounded" />
          </div>
        </div>

        {/* Filter Placeholders */}
        <div className="flex items-center gap-1.5">
          <div className="h-6 w-12 bg-[#2D3748] rounded" />
          <div className="h-6 w-12 bg-[#2D3748] rounded" />
          <div className="h-6 w-14 bg-[#2D3748] rounded" />
          <div className="h-6 w-16 bg-[#2D3748] rounded" />
        </div>
      </div>

      {/* Terminal Log Lines Skeleton */}
      <div className="p-4 space-y-3 max-h-72">
        <div className="flex items-center gap-2.5">
          <div className="h-3.5 w-16 bg-[#2D3748] rounded shrink-0" />
          <div className="h-3.5 w-24 bg-[#2D3748] rounded shrink-0" />
          <div className="h-3.5 w-3/4 bg-[#2D3748] rounded" />
        </div>
        <div className="flex items-center gap-2.5">
          <div className="h-3.5 w-16 bg-[#2D3748] rounded shrink-0" />
          <div className="h-3.5 w-28 bg-[#2D3748] rounded shrink-0" />
          <div className="h-3.5 w-1/2 bg-[#2D3748] rounded" />
        </div>
        <div className="flex items-center gap-2.5">
          <div className="h-3.5 w-16 bg-[#2D3748] rounded shrink-0" />
          <div className="h-3.5 w-24 bg-[#2D3748] rounded shrink-0" />
          <div className="h-3.5 w-5/6 bg-[#2D3748] rounded" />
        </div>
        <div className="flex items-center gap-2.5">
          <div className="h-3.5 w-16 bg-[#2D3748] rounded shrink-0" />
          <div className="h-3.5 w-20 bg-[#2D3748] rounded shrink-0" />
          <div className="h-3.5 w-2/3 bg-[#2D3748] rounded" />
        </div>
        <div className="flex items-center gap-2.5">
          <div className="h-3.5 w-16 bg-[#2D3748] rounded shrink-0" />
          <div className="h-3.5 w-28 bg-[#2D3748] rounded shrink-0" />
          <div className="h-3.5 w-4/5 bg-[#2D3748] rounded" />
        </div>
      </div>

      {/* Terminal Footer Info Skeleton */}
      <div className="bg-[#2D3748] px-3.5 sm:px-4 py-2.5 flex items-center justify-between border-t border-[#4A5568]">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-[#4A5568] shrink-0" />
          <div className="h-3 w-40 bg-[#4A5568] rounded" />
        </div>
        <div className="h-3 w-28 bg-[#4A5568] rounded" />
      </div>
    </div>
  );
};
