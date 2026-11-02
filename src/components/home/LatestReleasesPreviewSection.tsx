import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight, Sparkles } from 'lucide-react';
import { Game } from '../../types/game';
import { gameProvider } from '../../services/game-provider';
import { GameCard, GameCardSkeleton } from '../game/GameCard';
import { usePCSpecs } from '../../hooks/usePCSpecs';
import { checkCompatibility } from '../../lib/compatibility';

export const LatestReleasesPreviewSection: React.FC = () => {
  const [latest, setLatest] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const { specs } = usePCSpecs();

  useEffect(() => {
    let isMounted = true;
    gameProvider.getLatestReleases().then((games) => {
      if (isMounted) {
        setLatest(games.slice(0, 4));
        setLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="py-16 sm:py-20 border-b border-[#243247] bg-[#0E1625]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20 text-xs font-mono mb-2">
              <Calendar className="w-3.5 h-3.5" />
              <span>Fresh PC Releases</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Latest PC Games
            </h2>
            <p className="mt-1 text-sm text-[#94A3B8]">
              Recently released PC games cataloged with real artwork and platform availability.
            </p>
          </div>

          <Link
            to="/latest"
            className="inline-flex items-center gap-2 text-xs font-semibold text-purple-400 hover:text-purple-300 transition-colors whitespace-nowrap self-start sm:self-auto"
          >
            <span>View All Recent &amp; Upcoming</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => <GameCardSkeleton key={i} />)
          ) : latest.length > 0 ? (
            latest.map((game) => {
              const verdict =
                specs && game.requirementsAvailable
                  ? checkCompatibility(specs, game).verdict
                  : undefined;
              return <GameCard key={game.id} game={game} compatibilityVerdict={verdict} />;
            })
          ) : null}
        </div>
      </div>
    </section>
  );
};
