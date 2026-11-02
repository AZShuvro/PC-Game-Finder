import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Sparkles, Database, ShieldAlert, Star } from 'lucide-react';
import { CompatibilityVerdict } from '../../types/compatibility';
import { CatalogSource } from '../../types/game';

interface CompatibilityBadgeProps {
  verdict?: CompatibilityVerdict;
  requirementsAvailable?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const CompatibilityBadge: React.FC<CompatibilityBadgeProps> = ({
  verdict,
  requirementsAvailable = true,
  size = 'md',
  showIcon = true,
}) => {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-semibold',
    lg: 'text-sm px-3.5 py-1.5 gap-2 font-bold',
  }[size];

  if (!requirementsAvailable) {
    return (
      <span
        className={`inline-flex items-center rounded-md bg-[#172438] text-[#94A3B8] border border-[#243247] tracking-tight whitespace-nowrap shrink-0 ${sizeClasses}`}
        title="Hardware requirements not verified for this external catalog title"
      >
        {showIcon && <ShieldAlert className={size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5'} />}
        <span>UNVERIFIED</span>
      </span>
    );
  }

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

  if (verdict === 'not-recommended') {
    return (
      <span
        className={`inline-flex items-center rounded-md bg-rose-500/15 text-rose-400 border border-rose-500/30 tracking-tight whitespace-nowrap shrink-0 ${sizeClasses}`}
        title="Does not meet minimum requirements"
      >
        {showIcon && <XCircle className={size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5'} />}
        <span>NOT RECOMMENDED</span>
      </span>
    );
  }

  return null;
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

export const SourceBadge: React.FC<{ source: CatalogSource | string }> = ({ source }) => {
  if (source === 'curated') {
    return (
      <span
        className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 whitespace-nowrap shrink-0"
        title="Curated and verified with accurate benchmark specifications"
      >
        <Sparkles className="w-3 h-3" />
        <span>Game Finder Curated</span>
      </span>
    );
  }

  return (
    <span
      className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 whitespace-nowrap shrink-0"
      title="Retrieved from RAWG Video Games Database"
    >
      <Database className="w-3 h-3" />
      <span>RAWG</span>
    </span>
  );
};

export const MetacriticBadge: React.FC<{ score?: number }> = ({ score }) => {
  if (!score) return null;

  let colorClass = 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
  if (score < 75 && score >= 50) colorClass = 'bg-amber-500/15 text-amber-300 border-amber-500/30';
  else if (score < 50) colorClass = 'bg-rose-500/15 text-rose-400 border-rose-500/30';

  return (
    <span
      className={`inline-flex items-center justify-center font-mono font-bold text-[11px] px-1.5 py-0.2 rounded border ${colorClass}`}
      title={`Metacritic Score: ${score}`}
    >
      {score}
    </span>
  );
};

export const RatingBadge: React.FC<{ rating?: number }> = ({ rating }) => {
  if (!rating) return null;

  return (
    <span className="inline-flex items-center gap-1 text-xs text-amber-400 font-mono font-semibold">
      <Star className="w-3 h-3 fill-current" />
      <span>{rating.toFixed(1)}</span>
    </span>
  );
};
