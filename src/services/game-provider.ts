import { Game } from '../types/game';
import { GameListResponse } from '../types/external-game';
import { gamesRepository } from '../lib/games';

export interface GameQueryParams {
  search?: string;
  genres?: string;
  ordering?: string;
  page?: number;
  pageSize?: number;
  dates?: string;
}

export interface APIStatusInfo {
  status: string;
  hasApiKey: boolean;
  provider: string;
  cachedEntries: number;
  curatedGameCount: number;
  timestamp: string;
}

class GameProviderService {
  private cache = new Map<string, { data: any; expiry: number }>();
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes client cache

  private getCached<T>(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) return null;
    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }
    return item.data as T;
  }

  private setCached(key: string, data: any): void {
    this.cache.set(key, { data, expiry: Date.now() + this.CACHE_TTL });
  }

  async getStatus(): Promise<APIStatusInfo> {
    try {
      const res = await fetch('/api/status');
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      // ignore
    }
    return {
      status: 'offline-mode',
      hasApiKey: false,
      provider: 'Local Curated Catalog',
      cachedEntries: 0,
      curatedGameCount: gamesRepository.getAll().length,
      timestamp: new Date().toISOString(),
    };
  }

  async getGames(params: GameQueryParams = {}, signal?: AbortSignal): Promise<GameListResponse> {
    const query = new URLSearchParams();
    if (params.search) query.set('search', params.search);
    if (params.genres && params.genres !== 'all') query.set('genres', params.genres);
    if (params.ordering) query.set('ordering', params.ordering);
    if (params.page) query.set('page', String(params.page));
    if (params.pageSize) query.set('page_size', String(params.pageSize));
    if (params.dates) query.set('dates', params.dates);

    const cacheKey = `games-${query.toString()}`;
    const cached = this.getCached<GameListResponse>(cacheKey);
    if (cached) return cached;

    try {
      const res = await fetch(`/api/games?${query.toString()}`, { signal });
      if (res.ok) {
        const data: GameListResponse = await res.json();
        this.setCached(cacheKey, data);
        return data;
      }
    } catch (err: any) {
      if (err.name === 'AbortError') {
        throw err;
      }
    }

    // Client fallback if backend is unreachable
    return this.getLocalFallback(params);
  }

  async getTrendingGames(): Promise<Game[]> {
    const cacheKey = 'trending-games';
    const cached = this.getCached<Game[]>(cacheKey);
    if (cached) return cached;

    try {
      const res = await fetch('/api/games/trending');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.games)) {
          this.setCached(cacheKey, data.games);
          return data.games;
        }
      }
    } catch (e) {
      // ignore
    }

    // Fallback: curated featured games
    const fallback = gamesRepository.getAll().filter((g) => g.featured || (g.rating || 0) >= 4.5);
    return fallback;
  }

  async getLatestReleases(): Promise<Game[]> {
    const cacheKey = 'latest-releases';
    const cached = this.getCached<Game[]>(cacheKey);
    if (cached) return cached;

    try {
      const res = await fetch('/api/games/latest');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.games)) {
          this.setCached(cacheKey, data.games);
          return data.games;
        }
      }
    } catch (e) {
      // ignore
    }

    const fallback = [...gamesRepository.getAll()].sort((a, b) => b.releaseYear - a.releaseYear).slice(0, 12);
    return fallback;
  }

  async getUpcomingGames(): Promise<Game[]> {
    const cacheKey = 'upcoming-games';
    const cached = this.getCached<Game[]>(cacheKey);
    if (cached) return cached;

    try {
      const res = await fetch('/api/games/upcoming');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.games)) {
          this.setCached(cacheKey, data.games);
          return data.games;
        }
      }
    } catch (e) {
      // ignore
    }

    return [];
  }

  async getGameBySlugOrId(slugOrId: string): Promise<Game | undefined> {
    // 1. Check local catalog immediately
    const local = gamesRepository.getBySlug(slugOrId) || gamesRepository.getById(slugOrId);
    if (local) return local;

    // 2. Query API proxy
    const cacheKey = `game-detail-${slugOrId}`;
    const cached = this.getCached<Game>(cacheKey);
    if (cached) return cached;

    try {
      const res = await fetch(`/api/games/${encodeURIComponent(slugOrId)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.game) {
          this.setCached(cacheKey, data.game);
          return data.game;
        }
      }
    } catch (e) {
      // ignore
    }

    return undefined;
  }

  private getLocalFallback(params: GameQueryParams): GameListResponse {
    let list = gamesRepository.getAll();

    if (params.search) {
      const q = params.search.toLowerCase().trim();
      list = list.filter((g) => {
        const acronyms = (g.acronyms || []).map((a) => a.toLowerCase());
        return (
          g.title.toLowerCase().includes(q) ||
          g.shortDescription.toLowerCase().includes(q) ||
          g.developer.toLowerCase().includes(q) ||
          acronyms.includes(q)
        );
      });
    }

    if (params.genres && params.genres !== 'all') {
      list = list.filter((g) => g.genres.some((item) => item.toLowerCase() === params.genres?.toLowerCase()));
    }

    const page = params.page || 1;
    const pageSize = params.pageSize || 20;
    const totalCount = list.length;
    const startIndex = (page - 1) * pageSize;
    const games = list.slice(startIndex, startIndex + pageSize);

    return {
      games,
      totalCount,
      page,
      pageSize,
      totalPages: Math.ceil(totalCount / pageSize) || 1,
      source: 'curated-fallback',
      isLive: false,
      statusMessage: 'RAWG API key not configured. Showing enriched curated catalog.',
      lastSyncTime: new Date().toISOString(),
    };
  }
}

export const gameProvider = new GameProviderService();
