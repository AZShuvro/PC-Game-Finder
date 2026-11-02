import { Game, GameGenre, GameType } from '../types/game';
import { PCSpecs } from '../types/pc-specs';
import { CompatibilityVerdict } from '../types/compatibility';
import { checkCompatibility } from './compatibility';

export type SizeFilterOption = 'all' | 'under-1gb' | 'under-3gb' | 'under-5gb' | '5gb-plus';
export type YearFilterOption = 'all' | '90s' | '2000s' | '2010s' | 'modern';
export type SortOption =
  | 'recommended'
  | 'name-asc'
  | 'name-desc'
  | 'year-desc'
  | 'year-asc'
  | 'size-asc'
  | 'size-desc';

export interface FilterState {
  searchQuery: string;
  genres: GameGenre[];
  gameTypes: GameType[];
  compatibility: 'all' | CompatibilityVerdict;
  size: SizeFilterOption;
  year: YearFilterOption;
  selectedTag: string | null;
  onlyLowEndFriendly: boolean;
  sortBy: SortOption;
}

export const INITIAL_FILTERS: FilterState = {
  searchQuery: '',
  genres: [],
  gameTypes: [],
  compatibility: 'all',
  size: 'all',
  year: 'all',
  selectedTag: null,
  onlyLowEndFriendly: false,
  sortBy: 'recommended',
};

export function filterAndSortGames(
  games: Game[],
  filters: FilterState,
  pcSpecs: PCSpecs | null
): { results: Game[]; compatibilityMap: Map<string, CompatibilityVerdict> } {
  const compatibilityMap = new Map<string, CompatibilityVerdict>();

  if (pcSpecs) {
    for (const game of games) {
      const result = checkCompatibility(pcSpecs, game);
      compatibilityMap.set(game.id, result.verdict);
    }
  }

  const query = filters.searchQuery.trim().toLowerCase();
  const searchTerms = query.split(/\s+/).filter(Boolean);

  const filtered = games.filter((game) => {
    // 1. Search Matching
    if (searchTerms.length > 0) {
      const indexedText = [
        game.title,
        game.shortDescription,
        game.description,
        game.developer,
        game.publisher || '',
        ...game.genres,
        ...game.gameType,
        ...game.tags,
      ]
        .join(' ')
        .toLowerCase();

      const acronyms = (game.acronyms || []).map((a) => a.toLowerCase());

      // Every search term must match either in indexed text or in an acronym
      const matchesAllTerms = searchTerms.every((term) => {
        if (indexedText.includes(term)) return true;
        if (acronyms.includes(term)) return true;
        return false;
      });

      if (!matchesAllTerms) return false;
    }

    // 2. Genre Filter (multiple allowed: must match at least one selected genre)
    if (filters.genres.length > 0) {
      const hasGenre = filters.genres.some((g) => game.genres.includes(g));
      if (!hasGenre) return false;
    }

    // 3. Game Type Filter
    if (filters.gameTypes.length > 0) {
      const hasType = filters.gameTypes.some((t) => game.gameType.includes(t));
      if (!hasType) return false;
    }

    // 4. Low-end friendly filter
    if (filters.onlyLowEndFriendly && !game.isLowEndFriendly) {
      return false;
    }

    // 5. Compatibility Filter
    if (filters.compatibility !== 'all' && pcSpecs) {
      const verdict = compatibilityMap.get(game.id);
      if (verdict !== filters.compatibility) return false;
    }

    // 6. Size Filter
    if (filters.size !== 'all') {
      const size = game.estimatedSizeGB;
      if (filters.size === 'under-1gb' && size >= 1.0) return false;
      if (filters.size === 'under-3gb' && size >= 3.0) return false;
      if (filters.size === 'under-5gb' && size >= 5.0) return false;
      if (filters.size === '5gb-plus' && size < 5.0) return false;
    }

    // 7. Year Filter
    if (filters.year !== 'all') {
      const yr = game.releaseYear;
      if (filters.year === '90s' && (yr < 1990 || yr > 1999)) return false;
      if (filters.year === '2000s' && (yr < 2000 || yr > 2009)) return false;
      if (filters.year === '2010s' && (yr < 2010 || yr > 2019)) return false;
      if (filters.year === 'modern' && yr < 2020) return false;
    }

    // 8. Tag filter
    if (filters.selectedTag && !game.tags.includes(filters.selectedTag)) {
      return false;
    }

    return true;
  });

  // Sorting
  const sorted = [...filtered].sort((a, b) => {
    switch (filters.sortBy) {
      case 'name-asc':
        return a.title.localeCompare(b.title);
      case 'name-desc':
        return b.title.localeCompare(a.title);
      case 'year-desc':
        return b.releaseYear - a.releaseYear;
      case 'year-asc':
        return a.releaseYear - b.releaseYear;
      case 'size-asc':
        return a.estimatedSizeGB - b.estimatedSizeGB;
      case 'size-desc':
        return b.estimatedSizeGB - a.estimatedSizeGB;
      case 'recommended':
      default:
        // Curated catalog order
        return 0;
    }
  });

  return { results: sorted, compatibilityMap };
}
