import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GAME_CATALOG } from './src/data/games/catalog';
import { normalizeRAWGGame } from './src/services/rawg-normalizer';
import { RAWGGame, RAWGListResponse } from './src/types/external-game';
import { Game } from './src/types/game';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const isProduction = process.env.NODE_ENV === 'production';
const RAWG_API_KEY = process.env.RAWG_API_KEY || '';

// In-memory cache with 15-minute TTL to respect rate limits
const cache = new Map<string, { data: any; expiry: number }>();
const CACHE_TTL_MS = 15 * 60 * 1000;

function getCached(key: string) {
  const item = cache.get(key);
  if (!item) return null;
  if (Date.now() > item.expiry) {
    cache.delete(key);
    return null;
  }
  return item.data;
}

function setCached(key: string, data: any) {
  cache.set(key, { data, expiry: Date.now() + CACHE_TTL_MS });
}

// Format date helper for ISO YYYY-MM-DD
function formatDate(d: Date): string {
  return d.toISOString().split('T')[0];
}

// API: Server & RAWG status
app.get('/api/status', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    hasApiKey: Boolean(RAWG_API_KEY && RAWG_API_KEY !== 'MY_RAWG_API_KEY'),
    provider: 'RAWG Video Games Database API',
    cachedEntries: cache.size,
    curatedGameCount: GAME_CATALOG.length,
    timestamp: new Date().toISOString(),
  });
});

// Helper for fetching from RAWG
async function fetchFromRAWG(endpoint: string, params: Record<string, string | number> = {}): Promise<any> {
  if (!RAWG_API_KEY || RAWG_API_KEY === 'MY_RAWG_API_KEY') {
    throw new Error('RAWG_API_KEY_NOT_CONFIGURED');
  }

  const searchParams = new URLSearchParams({
    key: RAWG_API_KEY,
    platforms: '4', // Strict PC platform filter
    ...Object.fromEntries(Object.entries(params).map(([k, v]) => [k, String(v)])),
  });

  const url = `https://api.rawg.io/api/${endpoint}?${searchParams.toString()}`;
  const cacheKey = url;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'GameFinder/2.0 (Gaming PC Compatibility Explorer)',
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`RAWG API error: HTTP ${response.status}`);
    }

    const data = await response.json();
    setCached(cacheKey, data);
    return data;
  } catch (err: any) {
    clearTimeout(timeoutId);
    throw err;
  }
}

// Fallback search over local curated catalog
function filterLocalCatalog(search?: string, genre?: string, page = 1, pageSize = 20) {
  let list = [...GAME_CATALOG];

  if (search) {
    const q = search.toLowerCase().trim();
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

  if (genre && genre !== 'all') {
    list = list.filter((g) => g.genres.some((item) => item.toLowerCase() === genre.toLowerCase()));
  }

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
    statusMessage: 'Serving local curated catalog. Add RAWG_API_KEY in environment for live external catalog.',
    lastSyncTime: new Date().toISOString(),
  };
}

// API: Browse / Search Games
app.get('/api/games', async (req: Request, res: Response) => {
  const search = typeof req.query.search === 'string' ? req.query.search : undefined;
  const genre = typeof req.query.genres === 'string' ? req.query.genres : undefined;
  const ordering = typeof req.query.ordering === 'string' ? req.query.ordering : '-added';
  const page = Math.max(1, parseInt(String(req.query.page || '1'), 10));
  const pageSize = Math.min(40, Math.max(1, parseInt(String(req.query.page_size || '20'), 10)));
  const dates = typeof req.query.dates === 'string' ? req.query.dates : undefined;

  try {
    const rawgParams: Record<string, string | number> = {
      page,
      page_size: pageSize,
      ordering,
    };
    if (search) rawgParams.search = search;
    if (genre && genre !== 'all') rawgParams.genres = genre.toLowerCase();
    if (dates) rawgParams.dates = dates;

    const data: RAWGListResponse = await fetchFromRAWG('games', rawgParams);
    const normalizedGames = (data.results || []).map(normalizeRAWGGame);

    res.json({
      games: normalizedGames,
      totalCount: data.count || normalizedGames.length,
      page,
      pageSize,
      totalPages: Math.ceil((data.count || normalizedGames.length) / pageSize),
      source: 'rawg',
      isLive: true,
      lastSyncTime: new Date().toISOString(),
    });
  } catch (err: any) {
    // Graceful fallback to local catalog
    const fallback = filterLocalCatalog(search, genre, page, pageSize);
    res.json(fallback);
  }
});

// API: Trending PC Games
app.get('/api/games/trending', async (_req: Request, res: Response) => {
  try {
    const data: RAWGListResponse = await fetchFromRAWG('games', {
      page: 1,
      page_size: 12,
      ordering: '-rating',
    });
    const normalized = (data.results || []).map(normalizeRAWGGame);
    res.json({
      games: normalized,
      source: 'rawg',
      isLive: true,
    });
  } catch (err) {
    const curatedFeatured = GAME_CATALOG.filter((g) => g.featured || (g.rating || 0) >= 4.5).slice(0, 12);
    res.json({
      games: curatedFeatured,
      source: 'curated-fallback',
      isLive: false,
    });
  }
});

// API: Latest PC Releases (last 180 days)
app.get('/api/games/latest', async (_req: Request, res: Response) => {
  const now = new Date();
  const past = new Date();
  past.setDate(now.getDate() - 180);

  try {
    const data: RAWGListResponse = await fetchFromRAWG('games', {
      page: 1,
      page_size: 12,
      dates: `${formatDate(past)},${formatDate(now)}`,
      ordering: '-released',
    });
    const normalized = (data.results || []).map(normalizeRAWGGame);
    res.json({
      games: normalized,
      source: 'rawg',
      isLive: true,
    });
  } catch (err) {
    const recentCurated = [...GAME_CATALOG]
      .sort((a, b) => b.releaseYear - a.releaseYear)
      .slice(0, 12);
    res.json({
      games: recentCurated,
      source: 'curated-fallback',
      isLive: false,
    });
  }
});

// API: Upcoming PC Games (next 180 days)
app.get('/api/games/upcoming', async (_req: Request, res: Response) => {
  const now = new Date();
  const future = new Date();
  future.setDate(now.getDate() + 180);

  try {
    const data: RAWGListResponse = await fetchFromRAWG('games', {
      page: 1,
      page_size: 12,
      dates: `${formatDate(now)},${formatDate(future)}`,
      ordering: 'released',
    });
    const normalized = (data.results || []).map(normalizeRAWGGame);
    res.json({
      games: normalized,
      source: 'rawg',
      isLive: true,
    });
  } catch (err) {
    res.json({
      games: [],
      source: 'curated-fallback',
      isLive: false,
      message: 'Upcoming PC releases require active RAWG API key connection.',
    });
  }
});

// API: Game details by Slug or ID
app.get('/api/games/:slug', async (req: Request, res: Response) => {
  const slug = req.params.slug;

  // 1. Check local catalog first (preserves GTA San Andreas regression test & curated requirements)
  const localGame = GAME_CATALOG.find(
    (g) => g.slug.toLowerCase() === slug.toLowerCase() || g.id.toLowerCase() === slug.toLowerCase()
  );

  if (localGame) {
    res.json({ game: localGame, source: 'curated' });
    return;
  }

  // 2. Query RAWG if not local
  try {
    // Strip "rawg-" prefix if present
    const rawgLookup = slug.replace(/^rawg-/, '');
    const data: RAWGGame = await fetchFromRAWG(`games/${rawgLookup}`);
    const normalized = normalizeRAWGGame(data);
    res.json({ game: normalized, source: 'rawg' });
  } catch (err) {
    res.status(404).json({ error: 'Game not found', slug });
  }
});

// Boot dev server with Vite middlewares or static files in production
async function startServer() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Game Finder Server] Running at http://localhost:${PORT} (API key configured: ${Boolean(RAWG_API_KEY)})`);
  });
}

startServer();
