import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Sparkles, Filter, AlertCircle, RefreshCw } from 'lucide-react';
import { Game } from '../types/game';
import { gameProvider } from '../services/game-provider';
import { GameCard, GameCardSkeleton } from '../components/game/GameCard';
import { usePCSpecs } from '../hooks/usePCSpecs';
import { checkCompatibility } from '../lib/compatibility';

export const LatestReleases: React.FC = () => {
  const [tab, setTab] = useState<'recent' | 'upcoming'>('recent');
  const [recentGames, setRecentGames] = useState<Game[]>([]);
  const [upcomingGames, setUpcomingGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { specs } = usePCSpecs();

  useEffect(() => {
    document.title = 'Latest & Upcoming PC Games | Game Finder';
  }, []);

  const loadReleases = async () => {
    setLoading(true);
    setError(null);
    try {
      const [recent, upcoming] = await Promise.all([
        gameProvider.getLatestReleases(),
        gameProvider.getUpcomingGames(),
      ]);
      setRecentGames(recent);
      setUpcomingGames(upcoming);
    } catch (err: any) {
      setError('Unable to load latest releases. Serving curated catalog.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReleases();
  }, []);

  const activeGames = tab === 'recent' ? recentGames : upcomingGames;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#243247]">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-[#10B981] font-semibold">
            Real-Time Release Radar
          </span>
          <h1 className="text-3xl font-extrabold text-white mt-1">
            Latest &amp; Upcoming PC Games
          </h1>
          <p className="mt-1 text-sm text-[#94A3B8]">
            Track recently debuted PC games and anticipated upcoming releases.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1.5 p-1 bg-[#111D2D] rounded-lg border border-[#243247] self-start md:self-auto">
          <button
            type="button"
            onClick={() => setTab('recent')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-md transition-all ${
              tab === 'recent'
                ? 'bg-[#10B981] text-black shadow-sm'
                : 'text-[#94A3B8] hover:text-white'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Recently Released ({recentGames.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setTab('upcoming')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-md transition-all ${
              tab === 'upcoming'
                ? 'bg-[#10B981] text-black shadow-sm'
                : 'text-[#94A3B8] hover:text-white'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Upcoming Releases ({upcomingGames.length})</span>
          </button>
        </div>
      </div>

      {/* Distinction Banner */}
      <div className="p-4 rounded-xl bg-[#0E1625] border border-[#243247] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-[#94A3B8]">
        <div className="flex items-center gap-2.5">
          <Sparkles className="w-4 h-4 text-[#10B981] shrink-0" />
          <span>
            {tab === 'recent'
              ? 'Showing confirmed PC releases cataloged over the past 6 months.'
              : 'Showing anticipated upcoming PC titles with announced future release dates.'}
          </span>
        </div>
        <button
          onClick={loadReleases}
          className="text-xs text-emerald-400 hover:underline inline-flex items-center gap-1 font-mono shrink-0"
        >
          <RefreshCw className="w-3 h-3" />
          <span>Refresh Feed</span>
        </button>
      </div>

      {/* Grid or Empty */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <GameCardSkeleton key={i} />
          ))}
        </div>
      ) : activeGames.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {activeGames.map((game) => {
            const verdict =
              specs && game.requirementsAvailable
                ? checkCompatibility(specs, game).verdict
                : undefined;
            return <GameCard key={game.id} game={game} compatibilityVerdict={verdict} />;
          })}
        </div>
      ) : (
        <div className="p-16 text-center bg-[#111D2D] border border-[#243247] rounded-xl space-y-3 max-w-md mx-auto">
          <Calendar className="w-10 h-10 text-[#94A3B8] mx-auto" />
          <h3 className="text-base font-bold text-white">No upcoming releases recorded</h3>
          <p className="text-xs text-[#94A3B8]">
            Upcoming PC release schedules require an active RAWG API key connection. Check back soon.
          </p>
        </div>
      )}
    </div>
  );
};
