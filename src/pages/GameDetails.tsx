import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ChevronRight,
  Bookmark,
  Calendar,
  Building,
  HardDrive,
  Cpu,
  Layers,
  ArrowRight,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { gamesRepository } from '../lib/games';
import { usePCSpecs } from '../hooks/usePCSpecs';
import { useSavedGames } from '../hooks/useSavedGames';
import { checkCompatibility } from '../lib/compatibility';
import { CompatibilityBadge, LowEndBadge } from '../components/ui/Badge';
import { CoverImage } from '../components/game/CoverImage';
import { CompatibilitySummaryCard } from '../components/compatibility/CompatibilitySummaryCard';
import { RequirementTable } from '../components/compatibility/RequirementTable';
import { FPSEstimatorCard } from '../components/game/FPSEstimatorCard';

export const GameDetails: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { specs } = usePCSpecs();
  const { isSaved, toggleSave } = useSavedGames();

  const game = slug ? gamesRepository.getBySlug(slug) : undefined;

  useEffect(() => {
    if (game) {
      document.title = `${game.title} — System Requirements & Compatibility | Game Finder`;
    } else {
      document.title = 'Game Not Found | Game Finder';
    }
  }, [game]);

  if (!game) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="text-3xl font-extrabold text-white">Game Not Found</h1>
        <p className="text-sm text-[#94A3B8]">
          The game with slug &ldquo;{slug}&rdquo; does not exist in our curated catalog.
        </p>
        <Link
          to="/browse"
          className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold rounded-lg bg-[#10B981] text-black hover:bg-[#34D399] transition-colors"
        >
          <span>Return to Browse</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    );
  }

  const saved = isSaved(game.id);
  const compatibilityResult = specs ? checkCompatibility(specs, game) : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-10">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-[#94A3B8]">
        <Link to="/" className="hover:text-white transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-[#243247]" />
        <Link to="/browse" className="hover:text-white transition-colors">
          Browse
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-[#243247]" />
        <span className="text-white truncate max-w-xs">{game.title}</span>
      </nav>

      {/* Hero Card */}
      <div className="bg-[#111D2D] border border-[#243247] rounded-2xl overflow-hidden shadow-xl grid grid-cols-1 lg:grid-cols-12">
        {/* Cover presentation */}
        <div className="lg:col-span-5 relative flex flex-col justify-center">
          <CoverImage game={game} aspect="hero" className="h-full min-h-[280px]" />
        </div>

        {/* Hero Metadata */}
        <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                {compatibilityResult && (
                  <CompatibilityBadge verdict={compatibilityResult.verdict} size="md" />
                )}
                {game.isLowEndFriendly && <LowEndBadge size="md" />}
              </div>

              {/* Bookmark Button */}
              <button
                type="button"
                onClick={() => toggleSave(game.id)}
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  saved
                    ? 'bg-[#10B981] text-black shadow-md'
                    : 'bg-[#080D18] hover:bg-[#172438] text-white border border-[#243247]'
                }`}
              >
                <Bookmark className={`w-3.5 h-3.5 ${saved ? 'fill-current' : ''}`} />
                <span>{saved ? 'Saved to Wishlist' : 'Save Game'}</span>
              </button>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {game.title}
            </h1>

            <p className="text-sm text-[#94A3B8] leading-relaxed">
              {game.shortDescription}
            </p>

            {/* Spec tags strip */}
            <div className="flex flex-wrap gap-2 text-xs text-[#94A3B8]">
              {game.genres.map((g) => (
                <span
                  key={g}
                  className="px-2.5 py-0.5 rounded bg-[#080D18] border border-[#243247] text-slate-300 font-medium"
                >
                  {g}
                </span>
              ))}
              {game.gameType.map((t) => (
                <span
                  key={t}
                  className="px-2.5 py-0.5 rounded bg-[#080D18] border border-[#243247] text-[#94A3B8]"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Quick info list */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-[#243247] text-xs">
            <div>
              <span className="text-[#94A3B8] block text-[11px] font-mono uppercase">Release</span>
              <span className="text-white font-semibold font-mono">{game.releaseYear}</span>
            </div>
            <div>
              <span className="text-[#94A3B8] block text-[11px] font-mono uppercase">Developer</span>
              <span className="text-white font-medium truncate block" title={game.developer}>
                {game.developer}
              </span>
            </div>
            {game.publisher && (
              <div>
                <span className="text-[#94A3B8] block text-[11px] font-mono uppercase">Publisher</span>
                <span className="text-white font-medium truncate block" title={game.publisher}>
                  {game.publisher}
                </span>
              </div>
            )}
            <div>
              <span className="text-[#94A3B8] block text-[11px] font-mono uppercase">Install Size</span>
              <span className="text-white font-semibold font-mono">{game.estimatedSizeGB} GB</span>
            </div>
          </div>
        </div>
      </div>

      {/* Compatibility Assessment Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-[#10B981]" />
          <span>Hardware Compatibility Assessment</span>
        </h2>

        {compatibilityResult ? (
          <CompatibilitySummaryCard result={compatibilityResult} gameTitle={game.title} />
        ) : (
          <div className="bg-[#111D2D] border border-[#243247] rounded-xl p-8 text-center space-y-4 max-w-2xl mx-auto">
            <Cpu className="w-10 h-10 text-emerald-400 mx-auto" />
            <h3 className="text-lg font-bold text-white">Check this game against your PC</h3>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Enter your computer specifications to find out if your RAM, processor, graphics card, and storage can comfortably run {game.title}.
            </p>
            <div className="pt-2">
              <Link
                to="/check"
                className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold rounded-lg bg-[#10B981] text-black hover:bg-[#34D399] transition-colors"
              >
                <span>Enter PC Specifications</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* FPS Estimation Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-emerald-400" />
          <span>Performance &amp; Frame Rate Estimation</span>
        </h2>
        <FPSEstimatorCard game={game} specs={specs} />
      </div>

      {/* System Requirements Comparison Cards */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white">System Requirements</h2>
        <RequirementTable minimum={game.minimumRequirements} recommended={game.recommendedRequirements} />
      </div>

      {/* Full Description & Hardware Notes */}
      <div className="bg-[#111D2D] border border-[#243247] rounded-xl p-6 sm:p-8 space-y-6">
        <div>
          <h3 className="text-base font-bold text-white mb-2">About This Game</h3>
          <p className="text-sm text-[#94A3B8] leading-relaxed whitespace-pre-line">
            {game.description}
          </p>
        </div>

        {game.hardwareNotes && (
          <div className="p-4 rounded-lg bg-[#080D18] border border-[#243247] space-y-1">
            <span className="text-xs font-mono uppercase text-[#10B981] font-semibold">
              Curated Hardware Notes
            </span>
            <p className="text-xs text-slate-300 leading-relaxed">
              {game.hardwareNotes}
            </p>
          </div>
        )}

        {/* Tags */}
        <div className="pt-4 border-t border-[#243247]">
          <span className="text-xs font-mono uppercase text-[#94A3B8] block mb-2">Tags</span>
          <div className="flex flex-wrap gap-1.5">
            {game.tags.map((t) => (
              <span
                key={t}
                className="text-[11px] px-2.5 py-1 rounded bg-[#080D18] text-[#94A3B8] border border-[#243247]"
              >
                #{t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
