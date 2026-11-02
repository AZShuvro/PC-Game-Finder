import React, { useState } from 'react';
import { Game } from '../../types/game';
import { Gamepad2, Shield, Crosshair, Zap, Compass, Sparkles, Terminal } from 'lucide-react';

interface CoverImageProps {
  game: Game;
  aspect?: 'card' | 'hero' | 'thumb' | 'wide';
  className?: string;
  priority?: boolean;
}

export const CoverImage: React.FC<CoverImageProps> = ({
  game,
  aspect = 'card',
  className = '',
  priority = false,
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const heightClasses = {
    card: 'h-48 sm:h-52',
    hero: 'h-64 sm:h-80 md:h-96',
    thumb: 'h-24 w-24 shrink-0',
    wide: 'h-40 sm:h-44',
  }[aspect];

  // Pick artwork URL: prefer coverImage, fallback to backgroundImage
  const artworkUrl = !imageError ? game.coverImage || game.backgroundImage : undefined;

  // Distinctive palettes based on coverStyle for procedural fallback
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
      className={`relative w-full overflow-hidden bg-[#0E1625] border-b border-[#243247]/60 select-none ${heightClasses} ${className}`}
    >
      {/* 1. Real Artwork Display */}
      {artworkUrl && !imageError ? (
        <>
          {/* Skeleton Placeholder while loading */}
          {!imageLoaded && (
            <div className="absolute inset-0 bg-[#111D2D] animate-pulse flex items-center justify-center">
              <Icon className="w-8 h-8 text-[#243247]" />
            </div>
          )}

          <img
            src={artworkUrl}
            alt={game.title}
            loading={priority ? 'eager' : 'lazy'}
            referrerPolicy="no-referrer"
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
            className={`w-full h-full object-cover transition-all duration-300 group-hover:scale-105 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />

          {/* Measured Scrim for contrast overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#111D2D] via-black/20 to-transparent pointer-events-none" />
        </>
      ) : (
        /* 2. Designed Fallback Cover (Zero Broken Image Guarantee) */
        <div
          className={`w-full h-full bg-gradient-to-br ${themeStyles.bg} flex flex-col justify-between p-4`}
        >
          {/* Decorative pattern */}
          <div
            className="absolute inset-0 opacity-15 pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)`,
              backgroundSize: '24px 24px',
            }}
          />

          <div className="relative z-10 flex items-center justify-between text-xs">
            <span className="font-mono text-xs text-[#94A3B8]">{game.releaseYear}</span>
            <span
              className={`font-mono text-[11px] font-semibold px-2 py-0.5 rounded bg-[#080D18]/70 border border-white/5 ${themeStyles.accent}`}
            >
              {game.genres[0]}
            </span>
          </div>

          <div className="relative z-10 my-auto text-center flex flex-col items-center justify-center">
            <div className={`p-3 rounded-xl bg-[#080D18]/50 border border-white/10 mb-2 ${themeStyles.accent}`}>
              <Icon className={aspect === 'hero' ? 'w-10 h-10' : 'w-7 h-7'} />
            </div>
            <h4
              className={`font-bold tracking-tight text-white line-clamp-2 ${
                aspect === 'hero' ? 'text-2xl md:text-3xl max-w-xl' : 'text-base sm:text-lg'
              }`}
            >
              {game.title}
            </h4>
            <span className="text-xs text-[#94A3B8] mt-1 font-medium">{game.developer}</span>
          </div>

          <div className="relative z-10 flex items-center justify-between text-[11px] text-[#94A3B8] border-t border-white/5 pt-2">
            <span>{game.gameType[0]}</span>
            <span className="font-mono tabular-nums">{game.estimatedSizeGB} GB</span>
          </div>
        </div>
      )}
    </div>
  );
};
