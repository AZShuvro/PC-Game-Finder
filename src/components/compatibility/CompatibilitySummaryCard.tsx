import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle, HelpCircle, HardDrive, Cpu, Monitor, MemoryStick, Layers } from 'lucide-react';
import { CompatibilityResult, ComponentEvaluation } from '../../types/compatibility';
import { CompatibilityBadge } from '../ui/Badge';

interface CompatibilitySummaryCardProps {
  result: CompatibilityResult;
  gameTitle: string;
}

export const CompatibilitySummaryCard: React.FC<CompatibilitySummaryCardProps> = ({
  result,
  gameTitle,
}) => {
  const getStatusIcon = (status: ComponentEvaluation['status']) => {
    switch (status) {
      case 'pass':
        return <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />;
      case 'borderline':
        return <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />;
      case 'fail':
        return <XCircle className="w-4 h-4 text-rose-400 shrink-0" />;
      case 'unknown':
      default:
        return <HelpCircle className="w-4 h-4 text-sky-400 shrink-0" />;
    }
  };

  const getStatusBorder = (status: ComponentEvaluation['status']) => {
    switch (status) {
      case 'pass':
        return 'border-emerald-500/30 bg-emerald-500/5';
      case 'borderline':
        return 'border-amber-500/30 bg-amber-500/5';
      case 'fail':
        return 'border-rose-500/30 bg-rose-500/5';
      case 'unknown':
      default:
        return 'border-sky-500/30 bg-sky-500/5';
    }
  };

  const componentsList = [
    { key: 'ram', label: 'Memory (RAM)', icon: MemoryStick, eval: result.components.ram },
    { key: 'cpu', label: 'Processor (CPU)', icon: Cpu, eval: result.components.cpu },
    { key: 'gpu', label: 'Graphics (GPU)', icon: Monitor, eval: result.components.gpu },
    { key: 'storage', label: 'Storage Space', icon: HardDrive, eval: result.components.storage },
    { key: 'os', label: 'Operating System', icon: Layers, eval: result.components.os },
  ];

  return (
    <div className="bg-[#111D2D] border border-[#243247] rounded-xl p-6 shadow-md space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#243247]">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-[#94A3B8]">
            Hardware Compatibility Verdict
          </span>
          <h3 className="text-xl font-bold text-white mt-1">
            Can your PC run {gameTitle}?
          </h3>
          <p className="mt-1 text-sm text-[#94A3B8] leading-relaxed max-w-2xl">
            {result.summary}
          </p>
        </div>
        <div className="shrink-0 self-start sm:self-center">
          <CompatibilityBadge verdict={result.verdict} size="lg" />
        </div>
      </div>

      {/* Component Breakdown Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {componentsList.map((item) => {
          const Icon = item.icon;
          const evaluation = item.eval;

          return (
            <div
              key={item.key}
              className={`p-4 rounded-lg border ${getStatusBorder(
                evaluation.status
              )} flex flex-col justify-between transition-colors`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-200">
                    <Icon className="w-4 h-4 text-[#94A3B8]" />
                    <span>{item.label}</span>
                  </div>
                  {getStatusIcon(evaluation.status)}
                </div>

                <div className="my-2">
                  <span className="text-[11px] font-mono uppercase text-[#94A3B8] block">Your System</span>
                  <p className="text-sm font-semibold text-white truncate" title={String(evaluation.userValue)}>
                    {evaluation.userValue}
                  </p>
                </div>

                <p className="text-xs text-[#94A3B8] leading-relaxed mt-2">
                  {evaluation.explanation}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#243247]/60 flex items-center justify-between text-[11px] text-[#94A3B8]">
                <span>Min: <strong className="text-slate-300 font-normal">{evaluation.minimumRequired}</strong></span>
                {evaluation.component === 'ram' && (
                  <span>Rec: <strong className="text-slate-300 font-normal">{evaluation.recommendedRequired}</strong></span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Honest Disclaimer */}
      <div className="p-3.5 rounded-lg bg-[#080D18]/70 border border-[#243247] text-xs text-[#94A3B8] flex items-center justify-between flex-wrap gap-2">
        <span>{result.disclaimer}</span>
        <span className="font-mono text-[11px] text-[#10B981]">
          Evaluation Engine v1.0
        </span>
      </div>
    </div>
  );
};
