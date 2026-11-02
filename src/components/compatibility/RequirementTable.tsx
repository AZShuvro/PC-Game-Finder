import React from 'react';
import { GameRequirements } from '../../types/game';
import { MemoryStick, Cpu, Monitor, HardDrive, Layers } from 'lucide-react';

interface RequirementTableProps {
  minimum: GameRequirements;
  recommended: GameRequirements;
}

export const RequirementTable: React.FC<RequirementTableProps> = ({
  minimum,
  recommended,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Minimum Requirements Card */}
      <div className="bg-[#111D2D] border border-[#243247] rounded-xl p-5 shadow-sm">
        <div className="flex items-center justify-between pb-3 border-b border-[#243247] mb-4">
          <h4 className="font-semibold text-sm font-mono uppercase tracking-wider text-white">
            Minimum Requirements
          </h4>
          <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            Playable Baseline
          </span>
        </div>

        <ul className="space-y-4 text-xs">
          <li className="flex items-start gap-3">
            <MemoryStick className="w-4 h-4 text-[#94A3B8] shrink-0 mt-0.5" />
            <div>
              <span className="text-[#94A3B8] block text-[11px] font-mono uppercase">Memory (RAM)</span>
              <span className="text-white font-medium">{minimum.ramGB} GB RAM</span>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <Cpu className="w-4 h-4 text-[#94A3B8] shrink-0 mt-0.5" />
            <div>
              <span className="text-[#94A3B8] block text-[11px] font-mono uppercase">Processor</span>
              <span className="text-white font-medium leading-relaxed">{minimum.cpu}</span>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <Monitor className="w-4 h-4 text-[#94A3B8] shrink-0 mt-0.5" />
            <div>
              <span className="text-[#94A3B8] block text-[11px] font-mono uppercase">Graphics</span>
              <span className="text-white font-medium leading-relaxed">{minimum.gpu}</span>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <HardDrive className="w-4 h-4 text-[#94A3B8] shrink-0 mt-0.5" />
            <div>
              <span className="text-[#94A3B8] block text-[11px] font-mono uppercase">Storage</span>
              <span className="text-white font-medium">{minimum.storageGB} GB available space</span>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <Layers className="w-4 h-4 text-[#94A3B8] shrink-0 mt-0.5" />
            <div>
              <span className="text-[#94A3B8] block text-[11px] font-mono uppercase">Operating System</span>
              <span className="text-white font-medium">{minimum.operatingSystem}</span>
            </div>
          </li>
        </ul>
      </div>

      {/* Recommended Requirements Card */}
      <div className="bg-[#111D2D] border border-[#243247] rounded-xl p-5 shadow-sm">
        <div className="flex items-center justify-between pb-3 border-b border-[#243247] mb-4">
          <h4 className="font-semibold text-sm font-mono uppercase tracking-wider text-white">
            Recommended Requirements
          </h4>
          <span className="text-[11px] font-mono text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">
            Optimal Target
          </span>
        </div>

        <ul className="space-y-4 text-xs">
          <li className="flex items-start gap-3">
            <MemoryStick className="w-4 h-4 text-[#94A3B8] shrink-0 mt-0.5" />
            <div>
              <span className="text-[#94A3B8] block text-[11px] font-mono uppercase">Memory (RAM)</span>
              <span className="text-white font-medium">{recommended.ramGB} GB RAM</span>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <Cpu className="w-4 h-4 text-[#94A3B8] shrink-0 mt-0.5" />
            <div>
              <span className="text-[#94A3B8] block text-[11px] font-mono uppercase">Processor</span>
              <span className="text-white font-medium leading-relaxed">{recommended.cpu}</span>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <Monitor className="w-4 h-4 text-[#94A3B8] shrink-0 mt-0.5" />
            <div>
              <span className="text-[#94A3B8] block text-[11px] font-mono uppercase">Graphics</span>
              <span className="text-white font-medium leading-relaxed">{recommended.gpu}</span>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <HardDrive className="w-4 h-4 text-[#94A3B8] shrink-0 mt-0.5" />
            <div>
              <span className="text-[#94A3B8] block text-[11px] font-mono uppercase">Storage</span>
              <span className="text-white font-medium">{recommended.storageGB} GB available space</span>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <Layers className="w-4 h-4 text-[#94A3B8] shrink-0 mt-0.5" />
            <div>
              <span className="text-[#94A3B8] block text-[11px] font-mono uppercase">Operating System</span>
              <span className="text-white font-medium">{recommended.operatingSystem}</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};
