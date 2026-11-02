import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Filter, X, RotateCcw, AlertCircle, ArrowUpDown, Sparkles, CheckCircle2, AlertTriangle, XCircle, ChevronDown, Check } from 'lucide-react';
import { gamesRepository } from '../lib/games';
import { GameCard } from '../components/game/GameCard';
import { usePCSpecs } from '../hooks/usePCSpecs';
import { GameGenre, GameType } from '../types/game';
import { CompatibilityVerdict } from '../types/compatibility';
import {
  FilterState,
  INITIAL_FILTERS,
  filterAndSortGames,
  SizeFilterOption,
  YearFilterOption,
  SortOption,
} from '../lib/browse-filters';

export const Browse: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { specs, isConfigured } = usePCSpecs();

  // Read initial query params if present
  const initialLowEnd = searchParams.get('lowEnd') === 'true';
  const initialQuery = searchParams.get('q') || '';
  const initialGenre = searchParams.get('genre') as GameGenre | null;

  const [filters, setFilters] = useState<FilterState>(() => ({
    ...INITIAL_FILTERS,
    searchQuery: initialQuery,
    onlyLowEndFriendly: initialLowEnd,
    genres: initialGenre ? [initialGenre] : [],
  }));

  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  useEffect(() => {
    document.title = 'Browse PC Games | Game Finder';
  }, []);

  const allGames = useMemo(() => gamesRepository.getAll(), []);
  const allGenres = useMemo(() => gamesRepository.getAllGenres(), []);
  const allGameTypes = useMemo(() => gamesRepository.getAllGameTypes(), []);
  const allTags = useMemo(() => gamesRepository.getAllTags(), []);

  // Compute filtered & sorted result
  const { results, compatibilityMap } = useMemo(() => {
    return filterAndSortGames(allGames, filters, specs);
  }, [allGames, filters, specs]);

  // Compute active filter count (excluding default sortBy)
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
    return count;
  }, [filters]);

  const resetFilters = () => {
    setFilters({ ...INITIAL_FILTERS });
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
          <span className="text-xs font-mono uppercase tracking-wider text-[#10B981] font-semibold">
            Catalog &amp; Discovery
          </span>
          <h1 className="text-3xl font-extrabold text-white mt-1">Explore Games</h1>
          <p className="mt-1 text-sm text-[#94A3B8]">
            Find games that match your hardware specifications and gameplay preferences.
          </p>
        </div>

        {/* Global specs notice or link */}
        <div className="text-xs">
          {isConfigured && specs ? (
            <div className="inline-flex items-center gap-2 p-2 rounded-lg bg-[#111D2D] border border-emerald-500/30 text-[#94A3B8]">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
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
              <span>Configure PC specs to view compatibility badges</span>
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
            placeholder="Search by title, acronym (e.g. 'gta'), genre, developer..."
            value={filters.searchQuery}
            onChange={(e) => setFilters((prev) => ({ ...prev, searchQuery: e.target.value }))}
            className="w-full bg-[#111D2D] border border-[#243247] focus:border-[#10B981] rounded-lg pl-10 pr-10 py-2.5 text-sm text-white placeholder-[#94A3B8]/60 focus:outline-hidden transition-colors"
          />
          {filters.searchQuery && (
            <button
              onClick={() => setFilters((prev) => ({ ...prev, searchQuery: '' }))}
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
              onChange={(e) => setFilters((prev) => ({ ...prev, sortBy: e.target.value as SortOption }))}
              aria-label="Sort games"
              className="bg-[#111D2D] border border-[#243247] focus:border-[#10B981] rounded-lg pl-9 pr-8 py-2 text-xs font-medium text-white focus:outline-hidden appearance-none cursor-pointer"
            >
              <option value="recommended">Sort: Recommended</option>
              <option value="name-asc">Name (A–Z)</option>
              <option value="name-desc">Name (Z–A)</option>
              <option value="year-desc">Release Year (Newest)</option>
              <option value="year-asc">Release Year (Oldest)</option>
              <option value="size-asc">Size (Smallest)</option>
              <option value="size-desc">Size (Largest)</option>
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
        {/* Desktop / Collapsible Sidebar Filter Panel */}
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

          {/* 1. Low-End Friendly Switch */}
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
              Limits catalog to games requiring $\le 2$ GB RAM and basic graphics.
            </p>
          </div>

          {/* 2. Hardware Compatibility Filter */}
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

          {/* 3. Genres Filter */}
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

          {/* 4. Game Types Filter */}
          <div>
            <label className="block text-xs font-mono uppercase text-[#94A3B8] mb-2 font-medium">
              Game Mode / Type
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

          {/* 5. Size Filter */}
          <div>
            <label className="block text-xs font-mono uppercase text-[#94A3B8] mb-2 font-medium">
              Install Size
            </label>
            <select
              value={filters.size}
              onChange={(e) => setFilters((prev) => ({ ...prev, size: e.target.value as SizeFilterOption }))}
              aria-label="Filter by install size"
              className="w-full bg-[#080D18] border border-[#243247] focus:border-[#10B981] rounded-lg px-3 py-2 text-xs text-white focus:outline-hidden"
            >
              <option value="all">Any Storage Size</option>
              <option value="under-1gb">Under 1 GB (Ultra Compact)</option>
              <option value="under-3gb">Under 3 GB</option>
              <option value="under-5gb">Under 5 GB</option>
              <option value="5gb-plus">5 GB or Larger</option>
            </select>
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

          {/* 7. Tags Filter */}
          <div>
            <label className="block text-xs font-mono uppercase text-[#94A3B8] mb-2 font-medium">
              Specific Tag
            </label>
            <select
              value={filters.selectedTag || ''}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  selectedTag: e.target.value || null,
                }))
              }
              aria-label="Filter by specific tag"
              className="w-full bg-[#080D18] border border-[#243247] focus:border-[#10B981] rounded-lg px-3 py-2 text-xs text-white focus:outline-hidden"
            >
              <option value="">Any Tag</option>
              {allTags.map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
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

              {filters.onlyLowEndFriendly && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-sky-500/10 border border-sky-500/30 text-sky-300">
                  <span>Low-End Friendly</span>
                  <button
                    onClick={() => setFilters((prev) => ({ ...prev, onlyLowEndFriendly: false }))}
                    aria-label="Remove low-end filter"
                    className="hover:text-rose-400"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {filters.compatibility !== 'all' && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#111D2D] border border-[#243247] text-white capitalize">
                  <span>Status: {filters.compatibility.replace('-', ' ')}</span>
                  <button
                    onClick={() => setFilters((prev) => ({ ...prev, compatibility: 'all' }))}
                    aria-label="Remove compatibility filter"
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

              {filters.gameTypes.map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#111D2D] border border-[#243247] text-white"
                >
                  <span>{t}</span>
                  <button
                    onClick={() => toggleGameType(t)}
                    aria-label={`Remove game type ${t}`}
                    className="hover:text-rose-400"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}

              {filters.size !== 'all' && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#111D2D] border border-[#243247] text-white capitalize">
                  <span>Size: {filters.size.replace('-', ' ')}</span>
                  <button
                    onClick={() => setFilters((prev) => ({ ...prev, size: 'all' }))}
                    aria-label="Remove size filter"
                    className="hover:text-rose-400"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {filters.year !== 'all' && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#111D2D] border border-[#243247] text-white capitalize">
                  <span>Era: {filters.year}</span>
                  <button
                    onClick={() => setFilters((prev) => ({ ...prev, year: 'all' }))}
                    aria-label="Remove era filter"
                    className="hover:text-rose-400"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {filters.selectedTag && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#111D2D] border border-[#243247] text-white">
                  <span>Tag: {filters.selectedTag}</span>
                  <button
                    onClick={() => setFilters((prev) => ({ ...prev, selectedTag: null }))}
                    aria-label="Remove tag filter"
                    className="hover:text-rose-400"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              <button
                type="button"
                onClick={resetFilters}
                className="text-xs text-rose-400 hover:underline ml-2"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Result Count */}
          <div className="flex items-center justify-between text-xs text-[#94A3B8]">
            <span className="font-mono">
              Showing <strong className="text-white">{results.length}</strong> of{' '}
              <strong className="text-white">{allGames.length}</strong> games
            </span>
          </div>

          {/* Game Grid or Empty State */}
          {results.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((game) => (
                <GameCard
                  key={game.id}
                  game={game}
                  compatibilityVerdict={compatibilityMap.get(game.id)}
                />
              ))}
            </div>
          ) : (
            /* Polished Empty State */
            <div className="p-12 text-center bg-[#111D2D] border border-[#243247] rounded-xl space-y-4">
              <div className="w-12 h-12 mx-auto rounded-full bg-[#080D18] flex items-center justify-center text-[#94A3B8]">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">No matching games found</h3>
              <p className="text-xs text-[#94A3B8] max-w-sm mx-auto leading-relaxed">
                We couldn&apos;t find any games matching your current search terms or filter constraints. Try loosening filters.
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
