import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Sparkles } from 'lucide-react';
import { CompatibilityVerdict } from '../../types/compatibility';

interface CompatibilityBadgeProps {
  verdict: CompatibilityVerdict;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const CompatibilityBadge: React.FC<CompatibilityBadgeProps> = ({
  verdict,
  size = 'md',
  showIcon = true,
}) => {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-semibold',
    lg: 'text-sm px-3.5 py-1.5 gap-2 font-bold',
  }[size];

  if (verdict === 'can-run') {
    return (
      <span
        className={`inline-flex items-center rounded-md bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 tracking-tight whitespace-nowrap shrink-0 ${sizeClasses}`}
        title="Meets minimum PC requirements"
      >
        {showIcon && <CheckCircle2 className={size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5'} />}
        <span>CAN RUN</span>
      </span>
    );
  }

  if (verdict === 'maybe') {
    return (
      <span
        className={`inline-flex items-center rounded-md bg-amber-500/15 text-amber-300 border border-amber-500/30 tracking-tight whitespace-nowrap shrink-0 ${sizeClasses}`}
        title="Borderline requirements or unrecognized hardware"
      >
        {showIcon && <AlertTriangle className={size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5'} />}
        <span>MAYBE</span>
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center rounded-md bg-rose-500/15 text-rose-400 border border-rose-500/30 tracking-tight whitespace-nowrap shrink-0 ${sizeClasses}`}
      title="Does not meet minimum requirements"
    >
      {showIcon && <XCircle className={size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5'} />}
      <span>NOT RECOMMENDED</span>
    </span>
  );
};

export const LowEndBadge: React.FC<{ size?: 'sm' | 'md' }> = ({ size = 'sm' }) => {
  return (
    <span
      className={`inline-flex items-center rounded-md bg-sky-500/15 text-sky-300 border border-sky-500/30 tracking-tight whitespace-nowrap shrink-0 ${
        size === 'sm' ? 'text-[11px] px-2 py-0.5 gap-1' : 'text-xs px-2.5 py-1 gap-1.5 font-medium'
      }`}
      title="Highly optimized for older PCs and integrated graphics"
    >
      <Sparkles className="w-3 h-3 text-sky-400" />
      <span>Low-End Friendly</span>
    </span>
  );
};
