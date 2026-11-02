import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Compass } from 'lucide-react';
import { gamesRepository } from '../../lib/games';
import { GameCard } from '../game/GameCard';
import { usePCSpecs } from '../../hooks/usePCSpecs';
import { checkCompatibility } from '../../lib/compatibility';

export const FeaturedGamesSection: React.FC = () => {
  const { specs } = usePCSpecs();
  const featuredGames = gamesRepository.getFeatured().slice(0, 6);

  return (
    <section className="py-16 sm:py-20 border-b border-[#243247]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-[#10B981] font-semibold">
              Curated Selection
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">
              Featured PC Games
            </h2>
            <p className="mt-1 text-sm text-[#94A3B8]">
              Proven classics and celebrated indie gems that deliver rich gameplay.
            </p>
          </div>

          <Link
            to="/browse"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#10B981] hover:text-[#34D399] transition-colors whitespace-nowrap self-start sm:self-auto"
          >
            <span>View All {gamesRepository.getAll().length} Games</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredGames.map((game) => {
            const verdict =
              specs && game.requirementsAvailable
                ? checkCompatibility(specs, game).verdict
                : undefined;
            return <GameCard key={game.id} game={game} compatibilityVerdict={verdict} />;
          })}
        </div>
      </div>
    </section>
  );
};
