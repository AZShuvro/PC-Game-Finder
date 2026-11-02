import React, { useState, useEffect } from 'react';
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
  ExternalLink,
  ShieldAlert,
  Image as ImageIcon,
} from 'lucide-react';
import { Game } from '../types/game';
import { gameProvider } from '../services/game-provider';
import { usePCSpecs } from '../hooks/usePCSpecs';
import { useSavedGames } from '../hooks/useSavedGames';
import { checkCompatibility } from '../lib/compatibility';
import { CompatibilityBadge, LowEndBadge, SourceBadge, MetacriticBadge, RatingBadge } from '../components/ui/Badge';
import { CoverImage } from '../components/game/CoverImage';
import { CompatibilitySummaryCard } from '../components/compatibility/CompatibilitySummaryCard';
import { RequirementTable } from '../components/compatibility/RequirementTable';
import { FPSEstimatorCard } from '../components/game/FPSEstimatorCard';

export const GameDetails: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { specs } = usePCSpecs();
  const { isSaved, toggleSave } = useSavedGames();

  const [game, setGame] = useState<Game | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [activeScreenshot, setActiveScreenshot] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    gameProvider.getGameBySlugOrId(slug).then((res) => {
      setGame(res);
      setLoading(false);
      if (res) {
        document.title = `${res.title} — System Requirements & Compatibility | Game Finder`;
        if (res.screenshots && res.screenshots.length > 0) {
          setActiveScreenshot(res.screenshots[0]);
        }
      } else {
        document.title = 'Game Not Found | Game Finder';
      }
    });
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-pulse space-y-6">
        <div className="h-6 w-1/4 bg-[#111D2D] rounded" />
        <div className="h-80 bg-[#111D2D] rounded-2xl" />
        <div className="h-48 bg-[#111D2D] rounded-xl" />
      </div>
    );
  }

  if (!game) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="text-3xl font-extrabold text-white">Game Not Found</h1>
        <p className="text-sm text-[#94A3B8]">
          The game with slug &ldquo;{slug}&rdquo; could not be retrieved from the catalog or live database.
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
  const compatibilityResult =
    specs && game.requirementsAvailable ? checkCompatibility(specs, game) : null;

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

      {/* Hero Card with Real Artwork Backdrop */}
      <div className="relative bg-[#111D2D] border border-[#243247] rounded-2xl overflow-hidden shadow-2xl grid grid-cols-1 lg:grid-cols-12">
        {/* Background Backdrop Glow */}
        {game.backgroundImage && (
          <div
            className="absolute inset-0 opacity-15 bg-cover bg-center pointer-events-none mix-blend-overlay"
            style={{ backgroundImage: `url('${game.backgroundImage}')` }}
          />
        )}

        {/* Cover presentation */}
        <div className="lg:col-span-5 relative flex flex-col justify-center">
          <CoverImage game={game} aspect="hero" priority className="h-full min-h-[300px]" />
        </div>

        {/* Hero Metadata */}
        <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6 relative z-10">
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-2 flex-wrap">
                <CompatibilityBadge
                  verdict={compatibilityResult ? compatibilityResult.verdict : undefined}
                  requirementsAvailable={game.requirementsAvailable}
                  size="md"
                />
                {game.isLowEndFriendly && <LowEndBadge size="md" />}
                <SourceBadge source={game.source} />
                {game.metacritic && <MetacriticBadge score={game.metacritic} />}
                {game.rating && <RatingBadge rating={game.rating} />}
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

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
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
              <span className="text-[#94A3B8] block text-[11px] font-mono uppercase">Release Date</span>
              <span className="text-white font-semibold font-mono">
                {game.releasedDate || game.releaseYear}
              </span>
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

      {/* Screenshot Gallery if available */}
      {game.screenshots && game.screenshots.length > 0 && (
        <div className="bg-[#111D2D] border border-[#243247] rounded-xl p-6 space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-[#10B981]" />
            <span>Gameplay Screenshots</span>
          </h2>

          {activeScreenshot && (
            <div className="relative rounded-lg overflow-hidden h-72 sm:h-96 bg-black border border-[#243247]">
              <img
                src={activeScreenshot}
                alt={`${game.title} screenshot`}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
            {game.screenshots.slice(0, 6).map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveScreenshot(img)}
                className={`relative h-20 rounded-lg overflow-hidden border transition-all ${
                  activeScreenshot === img ? 'border-[#10B981] ring-2 ring-[#10B981]' : 'border-[#243247] opacity-70 hover:opacity-100'
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Compatibility Assessment Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-[#10B981]" />
          <span>Hardware Compatibility Assessment</span>
        </h2>

        {game.requirementsAvailable ? (
          compatibilityResult ? (
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
          )
        ) : (
          /* Honest Unverified Requirements State */
          <div className="bg-[#111D2D] border border-amber-500/20 rounded-xl p-6 space-y-3">
            <div className="flex items-center gap-2.5 text-amber-300 font-semibold text-sm">
              <ShieldAlert className="w-5 h-5 text-amber-400" />
              <span>System Requirements Unverified</span>
            </div>
            <p className="text-xs text-[#94A3B8] leading-relaxed max-w-2xl">
              Official PC minimum specifications for this title are currently uncataloged in the external database. To maintain strict integrity, Game Finder does not fabricate estimated requirements or generate speculative compatibility verdicts.
            </p>
          </div>
        )}
      </div>

      {/* FPS Estimation Section (when requirements available) */}
      {game.requirementsAvailable && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            <span>Performance &amp; Frame Rate Estimation</span>
          </h2>
          <FPSEstimatorCard game={game} specs={specs} />
        </div>
      )}

      {/* System Requirements Comparison Cards */}
      {game.requirementsAvailable && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white">System Requirements</h2>
          <RequirementTable
            minimum={game.minimumRequirements}
            recommended={game.recommendedRequirements}
          />
        </div>
      )}

      {/* Full Description & Attribution */}
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
            <p className="text-xs text-slate-300 leading-relaxed">{game.hardwareNotes}</p>
          </div>
        )}

        {/* Tags */}
        {game.tags && game.tags.length > 0 && (
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
        )}

        {/* RAWG Provider Attribution */}
        {game.source === 'rawg' && (
          <div className="pt-4 border-t border-[#243247] text-xs text-[#94A3B8] flex items-center justify-between flex-wrap gap-2">
            <span>
              Metadata and artwork sourced via{' '}
              <a
                href="https://rawg.io"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sky-400 hover:underline inline-flex items-center gap-1 font-medium"
              >
                RAWG Video Games Database
                <ExternalLink className="w-3 h-3" />
              </a>
            </span>
            <span className="font-mono text-[11px] text-[#94A3B8]/60">
              Provider ID: {game.rawgId}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
