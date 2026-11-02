import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Flame, ArrowRight } from 'lucide-react';
import { Game } from '../../types/game';
import { gameProvider } from '../../services/game-provider';
import { GameCard, GameCardSkeleton } from '../game/GameCard';
import { usePCSpecs } from '../../hooks/usePCSpecs';
import { checkCompatibility } from '../../lib/compatibility';

export const TrendingGamesSection: React.FC = () => {
  const [trending, setTrending] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const { specs } = usePCSpecs();

  useEffect(() => {
    let isMounted = true;
    gameProvider.getTrendingGames().then((games) => {
      if (isMounted) {
        setTrending(games.slice(0, 6));
        setLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="py-16 sm:py-20 border-b border-[#243247]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-mono mb-2">
              <Flame className="w-3.5 h-3.5" />
              <span>Community Highlights</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Trending PC Games
            </h2>
            <p className="mt-1 text-sm text-[#94A3B8]">
              Highly rated and popular PC titles discovered across the gaming ecosystem.
            </p>
          </div>

          <Link
            to="/browse?sort=popularity"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#10B981] hover:text-[#34D399] transition-colors whitespace-nowrap self-start sm:self-auto"
          >
            <span>Explore All Trending</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => <GameCardSkeleton key={i} />)
          ) : trending.length > 0 ? (
            trending.map((game) => {
              const verdict =
                specs && game.requirementsAvailable
                  ? checkCompatibility(specs, game).verdict
                  : undefined;
              return <GameCard key={game.id} game={game} compatibilityVerdict={verdict} />;
            })
          ) : (
            <div className="col-span-full py-8 text-center text-xs text-[#94A3B8]">
              Trending titles updating...
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
