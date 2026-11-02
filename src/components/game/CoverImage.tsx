import React from 'react';
import { Game } from '../../types/game';
import { Gamepad2, Shield, Crosshair, Zap, Compass, Sparkles, Terminal } from 'lucide-react';

interface CoverImageProps {
  game: Game;
  aspect?: 'card' | 'hero' | 'thumb';
  className?: string;
}

export const CoverImage: React.FC<CoverImageProps> = ({ game, aspect = 'card', className = '' }) => {
  const heightClasses = {
    card: 'h-48 sm:h-52',
    hero: 'h-64 sm:h-80 md:h-96',
    thumb: 'h-24 w-24 shrink-0',
  }[aspect];

  // Distinctive palettes based on coverStyle
  const themeStyles = {
    'action-amber': {
      bg: 'from-amber-950/80 via-[#111D2D] to-[#080D18]',
      accent: 'text-amber-400',
      border: 'border-amber-500/20',
      glow: 'bg-amber-500/10',
      icon: Crosshair,
    },
    'crimson-dark': {
      bg: 'from-rose-950/80 via-[#111D2D] to-[#080D18]',
      accent: 'text-rose-400',
      border: 'border-rose-500/20',
      glow: 'bg-rose-500/10',
      icon: Shield,
    },
    'cyber-blue': {
      bg: 'from-blue-950/80 via-[#111D2D] to-[#080D18]',
      accent: 'text-sky-400',
      border: 'border-sky-500/20',
      glow: 'bg-sky-500/10',
      icon: Zap,
    },
    'emerald-neon': {
      bg: 'from-emerald-950/80 via-[#111D2D] to-[#080D18]',
      accent: 'text-emerald-400',
      border: 'border-emerald-500/20',
      glow: 'bg-emerald-500/10',
      icon: Sparkles,
    },
    'vintage-sepia': {
      bg: 'from-stone-900 via-[#111D2D] to-[#080D18]',
      accent: 'text-stone-300',
      border: 'border-stone-500/20',
      glow: 'bg-stone-500/10',
      icon: Compass,
    },
    'indie-purple': {
      bg: 'from-purple-950/80 via-[#111D2D] to-[#080D18]',
      accent: 'text-purple-400',
      border: 'border-purple-500/20',
      glow: 'bg-purple-500/10',
      icon: Gamepad2,
    },
    'minimal-slate': {
      bg: 'from-slate-900 via-[#111D2D] to-[#080D18]',
      accent: 'text-slate-300',
      border: 'border-slate-500/20',
      glow: 'bg-slate-500/10',
      icon: Terminal,
    },
    'golden-bronze': {
      bg: 'from-yellow-950/80 via-[#111D2D] to-[#080D18]',
      accent: 'text-yellow-400',
      border: 'border-yellow-500/20',
      glow: 'bg-yellow-500/10',
      icon: Shield,
    },
  }[game.coverStyle || 'cyber-blue'];

  const Icon = themeStyles.icon;

  return (
    <div
      className={`relative w-full overflow-hidden bg-gradient-to-br ${themeStyles.bg} border-b ${themeStyles.border} flex flex-col justify-between p-4 select-none ${heightClasses} ${className}`}
    >
      {/* Decorative subtle background pattern */}
      <div
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)`,
          backgroundSize: '24px 24px',
        }}
      />

      {/* Ambient background glow circle */}
      <div
        className={`absolute -right-8 -bottom-8 w-40 h-40 rounded-full blur-2xl pointer-events-none ${themeStyles.glow}`}
      />

      {/* Top row */}
      <div className="relative z-10 flex items-center justify-between text-xs">
        <span className="font-mono text-xs tracking-wider text-[#94A3B8] uppercase">
          {game.releaseYear}
        </span>
        <span className={`font-mono text-[11px] font-semibold px-2 py-0.5 rounded bg-[#080D18]/70 border border-white/5 ${themeStyles.accent}`}>
          {game.genres[0]}
        </span>
      </div>

      {/* Center icon watermark & Title */}
      <div className="relative z-10 my-auto text-center flex flex-col items-center justify-center">
        <div className={`p-3 rounded-xl bg-[#080D18]/50 border border-white/10 mb-2 ${themeStyles.accent}`}>
          <Icon className={aspect === 'hero' ? 'w-10 h-10' : 'w-7 h-7'} />
        </div>
        <h4 className={`font-bold tracking-tight text-white line-clamp-2 ${aspect === 'hero' ? 'text-2xl md:text-3xl max-w-xl' : 'text-base sm:text-lg'}`}>
          {game.title}
        </h4>
        <span className="text-xs text-[#94A3B8] mt-1 font-medium">
          {game.developer}
        </span>
      </div>

      {/* Bottom metadata strip */}
      <div className="relative z-10 flex items-center justify-between text-[11px] text-[#94A3B8] border-t border-white/5 pt-2">
        <span>{game.gameType[0]}</span>
        <span className="font-mono tabular-nums">{game.estimatedSizeGB} GB</span>
      </div>
    </div>
  );
};
