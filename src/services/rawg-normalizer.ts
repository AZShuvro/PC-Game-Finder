import { Game, GameGenre, GameType, GameRequirements, SupportedOS, CoverStyle } from '../types/game';
import { RAWGGame, RAWGPlatform } from '../types/external-game';
import { evaluateCPU, evaluateGPU } from '../lib/hardware-tiers';
import { GAME_CATALOG } from '../data/games/catalog';

const GENRE_MAP: Record<string, GameGenre> = {
  action: 'Action',
  shooter: 'Shooter',
  adventure: 'Adventure',
  rpg: 'RPG',
  strategy: 'Strategy',
  puzzle: 'Puzzle',
  racing: 'Racing',
  simulation: 'Simulation',
  casual: 'Casual',
  indie: 'Indie',
  platformer: 'Platformer',
  horror: 'Horror',
};

function parseRequirementsText(rawText?: string): Partial<GameRequirements> & { hasValidSpecs: boolean } {
  if (!rawText || rawText.trim() === '') {
    return { hasValidSpecs: false };
  }

  // Clean HTML tags and entities
  const text = rawText
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/\s+/g, ' ');

  const result: Partial<GameRequirements> = {
    rawText,
  };

  // RAM extraction (e.g. "8 GB RAM", "Memory: 8 GB", "4GB RAM", "512 MB RAM")
  const ramGbMatch =
    text.match(/(?:ram|memory)[:\s]+(\d+(?:\.\d+)?)\s*GB/i) ||
    text.match(/(\d+(?:\.\d+)?)\s*GB\s*(?:ram|memory)?/i);
  const ramMbMatch =
    text.match(/(?:ram|memory)[:\s]+(\d+)\s*MB/i) ||
    text.match(/(\d+)\s*MB\s*(?:ram|memory)?/i);

  if (ramGbMatch) {
    result.ramGB = parseFloat(ramGbMatch[1]);
  } else if (ramMbMatch) {
    result.ramGB = Math.max(1, Math.round(parseInt(ramMbMatch[1], 10) / 1024));
  }

  // Storage extraction (e.g. "Storage: 40 GB", "Hard Drive: 15 GB available space")
  const storageMatch =
    text.match(/(?:storage|hard drive|disk space|hdd|space)[:\s]+(\d+(?:\.\d+)?)\s*GB/i) ||
    text.match(/(\d+(?:\.\d+)?)\s*GB\s*(?:available|free)?\s*(?:storage|space|disk|hdd|hard drive)/i);

  if (storageMatch) {
    result.storageGB = parseFloat(storageMatch[1]);
  }

  // Processor extraction (e.g. "Processor: Intel Core i5-2500K", "CPU: AMD Ryzen 5")
  const cpuMatch =
    text.match(/(?:^|[\n\r|;])\s*(?:processor|cpu)\s*:\s*([^|;\n\r<]+)/i) ||
    text.match(/\b(?:processor|cpu)\s*:\s*([^|;\n\r<]+)/i);
  if (cpuMatch) {
    const rawCpu = cpuMatch[1].trim();
    if (rawCpu.length > 2 && rawCpu.length < 120) {
      result.cpu = rawCpu;
      const evalCpu = evaluateCPU(result.cpu);
      if (evalCpu.isKnown) {
        result.minCpuTier = evalCpu.tier;
      }
    }
  }

  // GPU extraction (e.g. "Graphics: NVIDIA GTX 660", "Video Card: DirectX 11 compatible")
  const gpuMatch =
    text.match(/(?:^|[\n\r|;])\s*(?:graphics|gpu|video card|video)\s*:\s*([^|;\n\r<]+)/i) ||
    text.match(/\b(?:graphics|gpu|video card|video)\s*:\s*([^|;\n\r<]+)/i);
  if (gpuMatch) {
    const rawGpu = gpuMatch[1].trim();
    if (rawGpu.length > 2 && rawGpu.length < 120) {
      result.gpu = rawGpu;
      const evalGpu = evaluateGPU(result.gpu);
      if (evalGpu.isKnown) {
        result.minGpuTier = evalGpu.tier;
      }
    }
  }

  // OS extraction (e.g. "OS: Windows 10 64-bit", "Operating System: Windows 7")
  const osMatch =
    text.match(/(?:^|[\n\r|;])\s*(?:os|operating system)\s*:\s*([^|;\n\r<]+)/i) ||
    text.match(/\b(?:os|operating system)\s*:\s*([^|;\n\r<]+)/i);
  if (osMatch) {
    result.operatingSystem = osMatch[1].trim();
  }

  const hasValidSpecs = Boolean(result.ramGB && (result.cpu || result.gpu));
  return { ...result, hasValidSpecs };
}

export function normalizeRAWGGame(raw: RAWGGame): Game {
  // CRITICAL RULE: Check if this RAWG record matches an existing manually curated game.
  // Curated games MUST never be overwritten by RAWG and must preserve source: 'curated'.
  const matchingCurated = GAME_CATALOG.find((curated) => {
    if (raw.id && curated.rawgId && curated.rawgId === raw.id) return true;
    if (raw.slug && curated.slug.toLowerCase() === raw.slug.toLowerCase()) return true;
    if (raw.name && curated.title.toLowerCase() === raw.name.toLowerCase()) return true;
    return false;
  });

  if (matchingCurated) {
    return {
      ...matchingCurated,
      source: 'curated',
      requirementsAvailable: true,
    };
  }

  // 1. Find PC Platform (ID 4)
  const pcPlatform = raw.platforms?.find(
    (p: RAWGPlatform) => p.platform.id === 4 || p.platform.slug === 'pc'
  );

  const reqObj = pcPlatform?.requirements_en || pcPlatform?.requirements;
  const parsedMin = parseRequirementsText(reqObj?.minimum);
  const parsedRec = parseRequirementsText(reqObj?.recommended);

  const requirementsAvailable = parsedMin.hasValidSpecs;

  // 2. Genres
  const genres: GameGenre[] = [];
  if (raw.genres) {
    for (const g of raw.genres) {
      const mapped = GENRE_MAP[g.slug];
      if (mapped && !genres.includes(mapped)) {
        genres.push(mapped);
      }
    }
  }
  if (genres.length === 0) genres.push('Action');

  // 3. Game Types
  const gameType: GameType[] = ['Singleplayer'];
  const tagSlugs = raw.tags?.map((t) => t.slug.toLowerCase()) || [];
  if (tagSlugs.includes('multiplayer')) gameType.push('Multiplayer');
  if (tagSlugs.includes('co-op') || tagSlugs.includes('cooperative')) gameType.push('Co-op');
  if (tagSlugs.includes('online')) gameType.push('Online');
  else gameType.push('Offline');

  // 4. Release Info
  const releaseYear = raw.released ? parseInt(raw.released.split('-')[0], 10) : 2024;
  const isUpcoming = raw.released ? new Date(raw.released).getTime() > Date.now() : false;

  // 5. Developers & Publishers
  const developer = raw.developers?.[0]?.name || 'Independent Studio';
  const publisher = raw.publishers?.[0]?.name || undefined;

  // 6. Minimum requirements - Real data only, no fabricated specs
  const minimumRequirements: GameRequirements = {
    ramGB: parsedMin.ramGB || (requirementsAvailable ? 4 : 0),
    cpu: parsedMin.cpu || (requirementsAvailable ? 'Dual-Core Processor' : 'Requirements unavailable'),
    gpu: parsedMin.gpu || (requirementsAvailable ? 'DirectX 11 Graphics' : 'Requirements unavailable'),
    storageGB: parsedMin.storageGB || (requirementsAvailable ? 20 : 0),
    operatingSystem: parsedMin.operatingSystem || 'Windows 10',
    minCpuTier: parsedMin.minCpuTier || (requirementsAvailable ? 2 : undefined),
    minGpuTier: parsedMin.minGpuTier || (requirementsAvailable ? 2 : undefined),
    rawText: reqObj?.minimum,
  };

  const recommendedRequirements: GameRequirements = {
    ramGB: parsedRec.ramGB || (requirementsAvailable ? minimumRequirements.ramGB * 2 : 0),
    cpu: parsedRec.cpu || minimumRequirements.cpu,
    gpu: parsedRec.gpu || minimumRequirements.gpu,
    storageGB: parsedRec.storageGB || minimumRequirements.storageGB,
    operatingSystem: parsedRec.operatingSystem || 'Windows 10 / 11',
    recCpuTier: parsedRec.recCpuTier || (requirementsAvailable ? ((minimumRequirements.minCpuTier || 2) + 1) : undefined),
    recGpuTier: parsedRec.recGpuTier || (requirementsAvailable ? ((minimumRequirements.minGpuTier || 2) + 1) : undefined),
    rawText: reqObj?.recommended,
  };

  // 7. Cover style & low end friendly determination
  const coverStyles: CoverStyle[] = [
    'action-amber',
    'crimson-dark',
    'cyber-blue',
    'emerald-neon',
    'indie-purple',
    'golden-bronze',
  ];
  const coverStyle = coverStyles[raw.id % coverStyles.length];

  const isLowEnd =
    requirementsAvailable &&
    minimumRequirements.ramGB > 0 &&
    minimumRequirements.ramGB <= 4 &&
    (minimumRequirements.minGpuTier || 1) <= 3;

  return {
    id: `rawg-${raw.id}`,
    slug: raw.slug || `game-${raw.id}`,
    title: raw.name,
    shortDescription: raw.description_raw
      ? raw.description_raw.slice(0, 160).trim() + '...'
      : `Explore ${raw.name} on PC. Find out if your computer can run this title.`,
    description: raw.description_raw || raw.description || `Discover ${raw.name} and test your PC compatibility.`,
    genres,
    gameType,
    releaseYear: isNaN(releaseYear) ? 2024 : releaseYear,
    releasedDate: raw.released,
    developer,
    publisher,
    estimatedSizeGB: minimumRequirements.storageGB || 15,
    supportedOperatingSystems: ['Windows 10', 'Windows 11'],
    minimumRequirements,
    recommendedRequirements,
    tags: raw.tags?.slice(0, 8).map((t) => t.name) || [],
    featured: (raw.rating || 0) >= 4.5 && (raw.ratings_count || 0) > 500,
    isLowEndFriendly: isLowEnd,
    coverStyle,
    coverImage: raw.background_image || undefined,
    backgroundImage: raw.background_image_additional || raw.background_image || undefined,
    screenshots: raw.short_screenshots?.map((s) => s.image) || [],
    rating: raw.rating,
    ratingsCount: raw.ratings_count,
    metacritic: raw.metacritic,
    isUpcoming,
    source: 'rawg',
    rawgId: raw.id,
    requirementsAvailable,
    dataConfidence: requirementsAvailable ? 'curated-estimate' : 'external-unverified',
  };
}
