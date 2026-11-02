import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Laptop } from 'lucide-react';
import { gamesRepository } from '../../lib/games';
import { GameCard } from '../game/GameCard';
import { usePCSpecs } from '../../hooks/usePCSpecs';
import { checkCompatibility } from '../../lib/compatibility';

export const LowEndSection: React.FC = () => {
  const { specs } = usePCSpecs();
  // Filter games that are low-end friendly (e.g. min RAM <= 2GB, very modest requirements)
  const lowEndGames = gamesRepository
    .getLowEndFriendly()
    .filter((g) => g.minimumRequirements.ramGB <= 2)
    .slice(0, 4);

  return (
    <section className="py-16 sm:py-20 border-b border-[#243247] bg-[#0E1625]/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20 text-xs font-mono mb-2">
              <Laptop className="w-3.5 h-3.5" />
              <span>Optimized for Older Laptops & Integrated GPUs</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Great Games for Low-End PCs
            </h2>
            <p className="mt-1 text-sm text-[#94A3B8]">
              Titles that require 2 GB RAM or less and run smoothly on modest Intel HD Graphics or basic processors.
            </p>
          </div>

          <Link
            to="/browse?lowEnd=true"
            className="inline-flex items-center gap-2 text-xs font-semibold text-sky-400 hover:text-sky-300 transition-colors whitespace-nowrap self-start sm:self-auto"
          >
            <span>Explore All Low-End Friendly</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {lowEndGames.map((game) => {
            const verdict = specs ? checkCompatibility(specs, game).verdict : undefined;
            return <GameCard key={game.id} game={game} compatibilityVerdict={verdict} />;
          })}
        </div>
      </div>
    </section>
  );
};
