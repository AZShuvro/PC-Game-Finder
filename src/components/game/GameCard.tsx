import React from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, HardDrive } from 'lucide-react';
import { Game } from '../../types/game';
import { CompatibilityVerdict } from '../../types/compatibility';
import { CompatibilityBadge, LowEndBadge } from '../ui/Badge';
import { CoverImage } from './CoverImage';
import { useSavedGames } from '../../hooks/useSavedGames';

interface GameCardProps {
  game: Game;
  compatibilityVerdict?: CompatibilityVerdict;
}

export const GameCard: React.FC<GameCardProps> = ({ game, compatibilityVerdict }) => {
  const { isSaved, toggleSave } = useSavedGames();
  const saved = isSaved(game.id);

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleSave(game.id);
  };

  return (
    <div className="group relative flex flex-col bg-[#111D2D] hover:bg-[#172438] border border-[#243247] hover:border-[#10B981]/50 rounded-xl overflow-hidden transition-all duration-200 shadow-sm hover:shadow-lg focus-within:ring-2 focus-within:ring-[#10B981]">
      <Link
        to={`/games/${game.slug}`}
        className="flex flex-col flex-1 focus:outline-hidden"
        aria-label={`View details for ${game.title}`}
      >
        {/* Cover visual */}
        <div className="relative">
          <CoverImage game={game} aspect="card" />

          {/* Top badges overlay */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-20">
            <div>
              {compatibilityVerdict ? (
                <CompatibilityBadge verdict={compatibilityVerdict} size="sm" />
              ) : game.isLowEndFriendly ? (
                <LowEndBadge size="sm" />
              ) : null}
            </div>

            {/* Bookmark Button */}
            <button
              type="button"
              onClick={handleBookmarkClick}
              aria-label={saved ? `Remove ${game.title} from wishlist` : `Save ${game.title} to wishlist`}
              title={saved ? 'Remove from wishlist' : 'Save to wishlist'}
              className={`pointer-events-auto p-2 rounded-lg backdrop-blur-md transition-colors ${
                saved
                  ? 'bg-[#10B981] text-black shadow-md'
                  : 'bg-[#080D18]/80 text-[#94A3B8] hover:text-white hover:bg-[#080D18]'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        {/* Card Body */}
        <div className="flex flex-col flex-1 p-4 justify-between">
          <div>
            {/* Metadata row */}
            <div className="flex items-center gap-1.5 text-xs text-[#94A3B8] mb-1.5 flex-wrap">
              <span>{game.releaseYear}</span>
              <span aria-hidden="true">·</span>
              <span>{game.genres.slice(0, 2).join(', ')}</span>
              <span aria-hidden="true">·</span>
              <span>{game.gameType[0]}</span>
            </div>

            {/* Title */}
            <h3 className="font-semibold text-base text-white group-hover:text-[#10B981] transition-colors line-clamp-1">
              {game.title}
            </h3>

            {/* Short Description */}
            <p className="mt-1.5 text-xs text-[#94A3B8] line-clamp-2 leading-relaxed">
              {game.shortDescription}
            </p>
          </div>

          {/* Footer details */}
          <div className="flex items-center justify-between pt-3 mt-4 border-t border-[#243247] text-xs text-[#94A3B8]">
            <span className="truncate max-w-[130px]" title={`Developer: ${game.developer}`}>
              {game.developer}
            </span>
            <div className="flex items-center gap-1 font-mono tabular-nums text-slate-300">
              <HardDrive className="w-3.5 h-3.5 text-[#94A3B8]" />
              <span>{game.estimatedSizeGB} GB</span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};
