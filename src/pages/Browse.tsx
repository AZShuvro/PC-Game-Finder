import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Search,
  Filter,
  X,
  RotateCcw,
  AlertCircle,
  ArrowUpDown,
  Sparkles,
  ChevronDown,
  Check,
  ChevronLeft,
  ChevronRight,
  Database,
} from 'lucide-react';
import { Game } from '../types/game';
import { CompatibilityVerdict } from '../types/compatibility';
import { GameCard, GameCardSkeleton } from '../components/game/GameCard';
import { usePCSpecs } from '../hooks/usePCSpecs';
import { checkCompatibility } from '../lib/compatibility';
import { gamesRepository } from '../lib/games';
import { gameProvider } from '../services/game-provider';
import { GameGenre, GameType } from '../types/game';
import {
  FilterState,
  INITIAL_FILTERS,
  SizeFilterOption,
  YearFilterOption,
  SortOption,
} from '../lib/browse-filters';

export const Browse: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { specs, isConfigured } = usePCSpecs();

  const initialLowEnd = searchParams.get('lowEnd') === 'true';
  const initialQuery = searchParams.get('q') || '';
  const initialGenre = searchParams.get('genre') as GameGenre | null;

  const [filters, setFilters] = useState<FilterState>(() => ({
    ...INITIAL_FILTERS,
    searchQuery: initialQuery,
    onlyLowEndFriendly: initialLowEnd,
    genres: initialGenre ? [initialGenre] : [],
  }));

  const [catalogSourceFilter, setCatalogSourceFilter] = useState<'all' | 'curated' | 'rawg'>('all');
  const [games, setGames] = useState<Game[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [isLiveApi, setIsLiveApi] = useState<boolean>(false);
  const [apiStatusMessage, setApiStatusMessage] = useState<string | undefined>();
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState<boolean>(false);

  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    document.title = 'Browse PC Games | Game Finder';
  }, []);

  const allGenres = useMemo(() => gamesRepository.getAllGenres(), []);
  const allGameTypes = useMemo(() => gamesRepository.getAllGameTypes(), []);
  const allTags = useMemo(() => gamesRepository.getAllTags(), []);

  // Fetch games with debounce for search
  useEffect(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setLoading(true);

    const timeout = setTimeout(
      async () => {
        try {
          const orderingMap: Record<SortOption, string> = {
            recommended: '-added',
            'name-asc': 'name',
            'name-desc': '-name',
            'year-desc': '-released',
            'year-asc': 'released',
            'size-asc': '-added',
            'size-desc': '-added',
          };

          const response = await gameProvider.getGames(
            {
              search: filters.searchQuery.trim() || undefined,
              genres: filters.genres.length > 0 ? filters.genres[0].toLowerCase() : undefined,
              ordering: orderingMap[filters.sortBy] || '-added',
              page,
              pageSize: 18,
            },
            controller.signal
          );

          setGames(response.games);
          setTotalCount(response.totalCount);
          setTotalPages(response.totalPages);
          setIsLiveApi(response.isLive);
          setApiStatusMessage(response.statusMessage);
        } catch (err: any) {
          if (err.name !== 'AbortError') {
            console.warn('Browse fetch error, falling back to local catalog', err);
          }
        } finally {
          setLoading(false);
        }
      },
      filters.searchQuery ? 300 : 0
    );

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [filters.searchQuery, filters.genres, filters.sortBy, page]);

  // Client-side additional filtering (Compatibility, low-end, size, era, source)
  const filteredGames = useMemo(() => {
    return games.filter((game) => {
      // Source filter
      if (catalogSourceFilter === 'curated' && game.source !== 'curated') return false;
      if (catalogSourceFilter === 'rawg' && game.source !== 'rawg') return false;

      // Low end filter
      if (filters.onlyLowEndFriendly && !game.isLowEndFriendly) return false;

      // Game type filter
      if (filters.gameTypes.length > 0) {
        const hasType = filters.gameTypes.some((t) => game.gameType.includes(t));
        if (!hasType) return false;
      }

      // Size filter
      if (filters.size !== 'all') {
        const size = game.estimatedSizeGB;
        if (filters.size === 'under-1gb' && size >= 1.0) return false;
        if (filters.size === 'under-3gb' && size >= 3.0) return false;
        if (filters.size === 'under-5gb' && size >= 5.0) return false;
        if (filters.size === '5gb-plus' && size < 5.0) return false;
      }

      // Year filter
      if (filters.year !== 'all') {
        const yr = game.releaseYear;
        if (filters.year === '90s' && (yr < 1990 || yr > 1999)) return false;
        if (filters.year === '2000s' && (yr < 2000 || yr > 2009)) return false;
        if (filters.year === '2010s' && (yr < 2010 || yr > 2019)) return false;
        if (filters.year === 'modern' && yr < 2020) return false;
      }

      // Tag filter
      if (filters.selectedTag && !game.tags.includes(filters.selectedTag)) {
        return false;
      }

      // Compatibility filter
      if (filters.compatibility !== 'all' && specs) {
        if (!game.requirementsAvailable) return false;
        const res = checkCompatibility(specs, game);
        if (res.verdict !== filters.compatibility) return false;
      }

      return true;
    });
  }, [games, catalogSourceFilter, filters, specs]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.searchQuery.trim()) count++;
    if (filters.genres.length > 0) count += filters.genres.length;
    if (filters.gameTypes.length > 0) count += filters.gameTypes.length;
    if (filters.compatibility !== 'all') count++;
    if (filters.size !== 'all') count++;
    if (filters.year !== 'all') count++;
    if (filters.selectedTag) count++;
    if (filters.onlyLowEndFriendly) count++;
    if (catalogSourceFilter !== 'all') count++;
    return count;
  }, [filters, catalogSourceFilter]);

  const resetFilters = () => {
    setFilters({ ...INITIAL_FILTERS });
    setCatalogSourceFilter('all');
    setPage(1);
    setSearchParams({});
  };

  const toggleGenre = (genre: GameGenre) => {
    setFilters((prev) => {
      const exists = prev.genres.includes(genre);
      return {
        ...prev,
        genres: exists ? prev.genres.filter((g) => g !== genre) : [...prev.genres, genre],
      };
    });
    setPage(1);
  };

  const toggleGameType = (type: GameType) => {
    setFilters((prev) => {
      const exists = prev.gameTypes.includes(type);
      return {
        ...prev,
        gameTypes: exists ? prev.gameTypes.filter((t) => t !== type) : [...prev.gameTypes, type],
      };
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#243247]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono uppercase tracking-wider text-[#10B981] font-semibold">
              Dynamic Discovery
            </span>
            {isLiveApi ? (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                RAWG API Connected
              </span>
            ) : (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/30">
                Curated Catalog Mode
              </span>
            )}
          </div>
          <h1 className="text-3xl font-extrabold text-white">Explore Games</h1>
          <p className="mt-1 text-sm text-[#94A3B8]">
            Discover PC titles, check real hardware requirements, and view authentic game artwork.
          </p>
        </div>

        {/* Global specs notice or link */}
        <div className="text-xs">
          {isConfigured && specs ? (
            <div className="inline-flex items-center gap-2 p-2 rounded-lg bg-[#111D2D] border border-emerald-500/30 text-[#94A3B8]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(16,185,129,0.8)]" />
              <span>
                Matching with: <strong className="text-white">{specs.ramGB}GB RAM · {specs.cpu.split(' ')[0]}</strong>
              </span>
              <Link to="/check" className="text-emerald-400 hover:underline ml-1">
                Edit
              </Link>
            </div>
          ) : (
            <Link
              to="/check"
              className="inline-flex items-center gap-1.5 text-xs text-amber-300 hover:text-amber-200 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-lg"
            >
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Configure PC specs to unlock compatibility ratings</span>
            </Link>
          )}
        </div>
      </div>

      {/* Search and Top Controls Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Search input with multi-term & acronym support */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
          <input
            type="text"
            placeholder="Search by title, acronym (e.g. 'gta', 'hl2'), developer..."
            value={filters.searchQuery}
            onChange={(e) => {
              setFilters((prev) => ({ ...prev, searchQuery: e.target.value }));
              setPage(1);
            }}
            className="w-full bg-[#111D2D] border border-[#243247] focus:border-[#10B981] rounded-lg pl-10 pr-10 py-2.5 text-sm text-white placeholder-[#94A3B8]/60 focus:outline-hidden transition-colors"
          />
          {filters.searchQuery && (
            <button
              onClick={() => {
                setFilters((prev) => ({ ...prev, searchQuery: '' }));
                setPage(1);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#94A3B8] hover:text-white"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Sorting Dropdown & Mobile Filter Toggle */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center">
            <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#94A3B8] pointer-events-none" />
            <select
              value={filters.sortBy}
              onChange={(e) => {
                setFilters((prev) => ({ ...prev, sortBy: e.target.value as SortOption }));
                setPage(1);
              }}
              aria-label="Sort games"
              className="bg-[#111D2D] border border-[#243247] focus:border-[#10B981] rounded-lg pl-9 pr-8 py-2 text-xs font-medium text-white focus:outline-hidden appearance-none cursor-pointer"
            >
              <option value="recommended">Sort: Popularity / Rating</option>
              <option value="year-desc">Release Year (Newest)</option>
              <option value="year-asc">Release Year (Oldest)</option>
              <option value="name-asc">Name (A–Z)</option>
              <option value="name-desc">Name (Z–A)</option>
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#94A3B8] pointer-events-none" />
          </div>

          <button
            type="button"
            onClick={() => setIsFilterDrawerOpen(!isFilterDrawerOpen)}
            className={`lg:hidden inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg border transition-colors ${
              activeFilterCount > 0
                ? 'bg-[#10B981]/10 border-[#10B981]/30 text-[#10B981]'
                : 'bg-[#111D2D] border-[#243247] text-[#94A3B8] hover:text-white'
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Filters ({activeFilterCount})</span>
          </button>
        </div>
      </div>

      {/* Main Content Area: Sidebar Filters + Game Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Filter Panel */}
        <div
          className={`space-y-6 bg-[#111D2D] border border-[#243247] rounded-xl p-5 ${
            isFilterDrawerOpen ? 'block' : 'hidden lg:block'
          }`}
        >
          <div className="flex items-center justify-between pb-3 border-b border-[#243247]">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-white font-semibold">
              <Filter className="w-3.5 h-3.5 text-[#10B981]" />
              <span>Filters</span>
              {activeFilterCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-[#10B981]/20 text-[#10B981] text-[11px]">
                  {activeFilterCount}
                </span>
              )}
            </div>

            {activeFilterCount > 0 && (
              <button
                type="button"
                onClick={resetFilters}
                className="text-xs text-[#94A3B8] hover:text-white flex items-center gap-1 transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>

          {/* 1. Catalog Source Filter */}
          <div>
            <label className="block text-xs font-mono uppercase text-[#94A3B8] mb-2 font-medium">
              Catalog Source
            </label>
            <div className="grid grid-cols-3 gap-1 p-1 bg-[#080D18] rounded-lg border border-[#243247]">
              {(['all', 'curated', 'rawg'] as const).map((src) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => setCatalogSourceFilter(src)}
                  className={`py-1.5 text-xs font-medium rounded-md capitalize transition-all ${
                    catalogSourceFilter === src
                      ? 'bg-[#172438] text-white shadow-xs font-semibold'
                      : 'text-[#94A3B8] hover:text-white'
                  }`}
                >
                  {src}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Low-End Friendly Switch */}
          <div className="p-3 rounded-lg bg-[#080D18] border border-[#243247]">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="flex items-center gap-2 text-xs font-medium text-white">
                <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                <span>Low-End Friendly Only</span>
              </span>
              <input
                type="checkbox"
                checked={filters.onlyLowEndFriendly}
                onChange={(e) => setFilters((prev) => ({ ...prev, onlyLowEndFriendly: e.target.checked }))}
                className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-500 bg-[#111D2D] border-[#243247]"
              />
            </label>
            <p className="text-[11px] text-[#94A3B8] mt-1">
              Limits catalog to games requiring $\le 4$ GB RAM and basic graphics.
            </p>
          </div>

          {/* 3. Hardware Compatibility Filter */}
          <div>
            <label className="block text-xs font-mono uppercase text-[#94A3B8] mb-2 font-medium">
              PC Compatibility
            </label>

            {!isConfigured ? (
              <div className="p-3 rounded-lg bg-[#080D18] border border-[#243247] text-xs text-[#94A3B8] space-y-1.5">
                <p>Compatibility filter is disabled because no PC specs are saved.</p>
                <Link to="/check" className="text-emerald-400 hover:underline block font-medium">
                  → Enter your PC specs
                </Link>
              </div>
            ) : (
              <div className="space-y-1.5">
                {[
                  { value: 'all', label: 'All Games' },
                  { value: 'can-run', label: 'Can Run', color: 'text-emerald-400' },
                  { value: 'maybe', label: 'Maybe', color: 'text-amber-400' },
                  { value: 'not-recommended', label: 'Not Recommended', color: 'text-rose-400' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() =>
                      setFilters((prev) => ({
                        ...prev,
                        compatibility: opt.value as 'all' | CompatibilityVerdict,
                      }))
                    }
                    className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      filters.compatibility === opt.value
                        ? 'bg-[#172438] text-white border border-white/10'
                        : 'text-[#94A3B8] hover:text-white hover:bg-[#080D18]'
                    }`}
                  >
                    <span className={opt.color || ''}>{opt.label}</span>
                    {filters.compatibility === opt.value && <Check className="w-3.5 h-3.5 text-white" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 4. Genres Filter */}
          <div>
            <label className="block text-xs font-mono uppercase text-[#94A3B8] mb-2 font-medium">
              Genres
            </label>
            <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto pr-1">
              {allGenres.map((g) => {
                const isSelected = filters.genres.includes(g);
                return (
                  <button
                    key={g}
                    type="button"
                    onClick={() => toggleGenre(g)}
                    className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                      isSelected
                        ? 'bg-[#10B981] text-black font-semibold'
                        : 'bg-[#080D18] text-[#94A3B8] hover:text-white border border-[#243247]'
                    }`}
                  >
                    {g}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 5. Game Types Filter */}
          <div>
            <label className="block text-xs font-mono uppercase text-[#94A3B8] mb-2 font-medium">
              Game Mode
            </label>
            <div className="flex flex-wrap gap-1.5">
              {allGameTypes.map((t) => {
                const isSelected = filters.gameTypes.includes(t);
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => toggleGameType(t)}
                    className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                      isSelected
                        ? 'bg-[#10B981] text-black font-semibold'
                        : 'bg-[#080D18] text-[#94A3B8] hover:text-white border border-[#243247]'
                    }`}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 6. Release Year Filter */}
          <div>
            <label className="block text-xs font-mono uppercase text-[#94A3B8] mb-2 font-medium">
              Release Era
            </label>
            <select
              value={filters.year}
              onChange={(e) => setFilters((prev) => ({ ...prev, year: e.target.value as YearFilterOption }))}
              aria-label="Filter by release era"
              className="w-full bg-[#080D18] border border-[#243247] focus:border-[#10B981] rounded-lg px-3 py-2 text-xs text-white focus:outline-hidden"
            >
              <option value="all">All Release Years</option>
              <option value="90s">1990s Golden Era</option>
              <option value="2000s">2000s Classics</option>
              <option value="2010s">2010s Indie Renaissance</option>
              <option value="modern">2020 and Newer</option>
            </select>
          </div>
        </div>

        {/* Game Results Column */}
        <div className="lg:col-span-3 space-y-6">
          {/* Active Filter Chips Strip */}
          {activeFilterCount > 0 && (
            <div className="flex items-center gap-2 flex-wrap text-xs text-[#94A3B8]">
              <span className="font-mono text-[11px] uppercase">Active filters:</span>

              {filters.searchQuery && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#111D2D] border border-[#243247] text-white">
                  <span>Search: &ldquo;{filters.searchQuery}&rdquo;</span>
                  <button
                    onClick={() => setFilters((prev) => ({ ...prev, searchQuery: '' }))}
                    aria-label="Remove search filter"
                    className="hover:text-rose-400"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {catalogSourceFilter !== 'all' && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-500/10 border border-blue-500/30 text-blue-300">
                  <span>Source: {catalogSourceFilter.toUpperCase()}</span>
                  <button
                    onClick={() => setCatalogSourceFilter('all')}
                    aria-label="Remove source filter"
                    className="hover:text-rose-400"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {filters.genres.map((g) => (
                <span
                  key={g}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#111D2D] border border-[#243247] text-white"
                >
                  <span>{g}</span>
                  <button
                    onClick={() => toggleGenre(g)}
                    aria-label={`Remove genre ${g}`}
                    className="hover:text-rose-400"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}

              <button
                type="button"
                onClick={resetFilters}
                className="text-xs text-rose-400 hover:underline ml-2"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Result Count and Status */}
          <div className="flex items-center justify-between text-xs text-[#94A3B8]">
            <span className="font-mono">
              Showing <strong className="text-white">{filteredGames.length}</strong> of{' '}
              <strong className="text-white">{totalCount}</strong> games (Page {page} of {totalPages})
            </span>
            {apiStatusMessage && (
              <span className="text-[11px] text-[#94A3B8]/80 hidden sm:inline">
                {apiStatusMessage}
              </span>
            )}
          </div>

          {/* Game Grid / Skeletons / Empty State */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <GameCardSkeleton key={i} />
              ))}
            </div>
          ) : filteredGames.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredGames.map((game) => {
                  const verdict =
                    specs && game.requirementsAvailable
                      ? checkCompatibility(specs, game).verdict
                      : undefined;
                  return <GameCard key={game.id} game={game} compatibilityVerdict={verdict} />;
                })}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-3 pt-6 border-t border-[#243247]">
                  <button
                    type="button"
                    disabled={page <= 1}
                    onClick={() => {
                      setPage((p) => Math.max(1, p - 1));
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-[#111D2D] hover:bg-[#172438] disabled:opacity-40 disabled:pointer-events-none text-white border border-[#243247] transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Previous</span>
                  </button>

                  <span className="text-xs font-mono text-[#94A3B8]">
                    Page <strong className="text-white">{page}</strong> of {totalPages}
                  </span>

                  <button
                    type="button"
                    disabled={page >= totalPages}
                    onClick={() => {
                      setPage((p) => Math.min(totalPages, p + 1));
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-[#111D2D] hover:bg-[#172438] disabled:opacity-40 disabled:pointer-events-none text-white border border-[#243247] transition-colors"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="p-12 text-center bg-[#111D2D] border border-[#243247] rounded-xl space-y-4">
              <div className="w-12 h-12 mx-auto rounded-full bg-[#080D18] flex items-center justify-center text-[#94A3B8]">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">No matching games found</h3>
              <p className="text-xs text-[#94A3B8] max-w-sm mx-auto leading-relaxed">
                We couldn&apos;t find any games matching your current search terms or filter constraints.
              </p>
              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-[#10B981] text-black hover:bg-[#34D399] transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset All Filters</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
