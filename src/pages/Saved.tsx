import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, Compass, Trash2, ArrowRight } from 'lucide-react';
import { useSavedGames } from '../hooks/useSavedGames';
import { usePCSpecs } from '../hooks/usePCSpecs';
import { gamesRepository } from '../lib/games';
import { GameCard } from '../components/game/GameCard';
import { checkCompatibility } from '../lib/compatibility';
import { ConfirmationModal } from '../components/ui/Modal';

export const Saved: React.FC = () => {
  const { savedIds, count, clearSaved } = useSavedGames();
  const { specs } = usePCSpecs();
  const [showClearModal, setShowClearModal] = useState(false);

  useEffect(() => {
    document.title = 'Saved Games | Game Finder';
  }, []);

  const savedGames = useMemo(() => {
    return savedIds
      .map((id) => gamesRepository.getById(id))
      .filter((g): g is NonNullable<typeof g> => Boolean(g));
  }, [savedIds]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-[#243247]">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-[#10B981] font-semibold">
            Wishlist &amp; Bookmarks
          </span>
          <div className="flex items-center gap-3 mt-1">
            <h1 className="text-3xl font-extrabold text-white">Saved Games</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-[#111D2D] border border-[#243247] text-xs font-mono font-bold text-[#10B981]">
              {count}
            </span>
          </div>
          <p className="mt-1 text-sm text-[#94A3B8]">
            Your personal collection of games bookmarked locally in this browser.
          </p>
        </div>

        {count > 0 && (
          <button
            type="button"
            onClick={() => setShowClearModal(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition-colors self-start sm:self-auto"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Saved Games</span>
          </button>
        )}
      </div>

      {/* Grid or Empty State */}
      {savedGames.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedGames.map((game) => {
            const verdict =
              specs && game.requirementsAvailable
                ? checkCompatibility(specs, game).verdict
                : undefined;
            return <GameCard key={game.id} game={game} compatibilityVerdict={verdict} />;
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="p-16 text-center bg-[#111D2D] border border-[#243247] rounded-xl space-y-4 max-w-lg mx-auto">
          <div className="w-14 h-14 mx-auto rounded-full bg-[#080D18] flex items-center justify-center text-[#94A3B8]">
            <Bookmark className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-white">No saved games yet</h2>
          <p className="text-xs text-[#94A3B8] leading-relaxed">
            Click the bookmark icon on any game card or detail page to save games to your personal wishlist for easy reference.
          </p>
          <div className="pt-2">
            <Link
              to="/browse"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold rounded-lg bg-[#10B981] text-black hover:bg-[#34D399] transition-colors"
            >
              <Compass className="w-4 h-4" />
              <span>Browse Games</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}

      {/* Clear Confirmation Modal */}
      <ConfirmationModal
        isOpen={showClearModal}
        title="Clear Saved Games?"
        message="Are you sure you want to remove all games from your wishlist? This action cannot be undone."
        confirmLabel="Clear All"
        cancelLabel="Cancel"
        isDestructive={true}
        onConfirm={clearSaved}
        onClose={() => setShowClearModal(false)}
      />
    </div>
  );
};
