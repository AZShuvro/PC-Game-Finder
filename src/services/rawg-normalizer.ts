import { Game, GameGenre, GameType, GameRequirements, SupportedOS, CoverStyle } from '../types/game';
import { RAWGGame, RAWGPlatform } from '../types/external-game';
import { evaluateCPU, evaluateGPU } from '../lib/hardware-tiers';

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

function parseRequirementsText(text?: string): Partial<GameRequirements> & { hasValidSpecs: boolean } {
  if (!text || text.trim() === '') {
    return { hasValidSpecs: false };
  }

  const result: Partial<GameRequirements> = {
    rawText: text,
  };

  // RAM extraction
  const ramGbMatch = text.match(/(?:ram|memory)[:\s]+(\d+(?:\.\d+)?)\s*GB/i);
  const ramMbMatch = text.match(/(?:ram|memory)[:\s]+(\d+)\s*MB/i);
  if (ramGbMatch) {
    result.ramGB = parseFloat(ramGbMatch[1]);
  } else if (ramMbMatch) {
    result.ramGB = Math.max(1, Math.round(parseInt(ramMbMatch[1], 10) / 1024));
  }

  // Storage extraction
  const storageMatch = text.match(/(?:storage|hard drive|disk space|hdd|space)[:\s]+(\d+(?:\.\d+)?)\s*GB/i);
  if (storageMatch) {
    result.storageGB = parseFloat(storageMatch[1]);
  }

  // Processor extraction
  const cpuMatch = text.match(/(?:processor|cpu)[:\s]+([^\n\r,]+)/i);
  if (cpuMatch) {
    result.cpu = cpuMatch[1].trim();
    const evalCpu = evaluateCPU(result.cpu);
    if (evalCpu.isKnown) {
      result.minCpuTier = evalCpu.tier;
    }
  }

  // GPU extraction
  const gpuMatch = text.match(/(?:graphics|gpu|video card|video)[:\s]+([^\n\r,]+)/i);
  if (gpuMatch) {
    result.gpu = gpuMatch[1].trim();
    const evalGpu = evaluateGPU(result.gpu);
    if (evalGpu.isKnown) {
      result.minGpuTier = evalGpu.tier;
    }
  }

  // OS extraction
  const osMatch = text.match(/(?:os|operating system)[:\s]+([^\n\r,]+)/i);
  if (osMatch) {
    result.operatingSystem = osMatch[1].trim();
  }

  const hasValidSpecs = Boolean(result.ramGB && (result.cpu || result.gpu));
  return { ...result, hasValidSpecs };
}

export function normalizeRAWGGame(raw: RAWGGame): Game {
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

  // 6. Minimum requirements
  const minimumRequirements: GameRequirements = {
    ramGB: parsedMin.ramGB || 4,
    cpu: parsedMin.cpu || (requirementsAvailable ? 'Dual-Core Processor' : 'Hardware requirements not cataloged'),
    gpu: parsedMin.gpu || (requirementsAvailable ? 'DirectX 11 Graphics' : 'Hardware requirements not cataloged'),
    storageGB: parsedMin.storageGB || 20,
    operatingSystem: parsedMin.operatingSystem || 'Windows 10',
    minCpuTier: parsedMin.minCpuTier || 2,
    minGpuTier: parsedMin.minGpuTier || 2,
    rawText: reqObj?.minimum,
  };

  const recommendedRequirements: GameRequirements = {
    ramGB: parsedRec.ramGB || (minimumRequirements.ramGB * 2),
    cpu: parsedRec.cpu || minimumRequirements.cpu,
    gpu: parsedRec.gpu || minimumRequirements.gpu,
    storageGB: parsedRec.storageGB || minimumRequirements.storageGB,
    operatingSystem: parsedRec.operatingSystem || 'Windows 10 / 11',
    recCpuTier: parsedRec.recCpuTier || ((minimumRequirements.minCpuTier || 2) + 1),
    recGpuTier: parsedRec.recGpuTier || ((minimumRequirements.minGpuTier || 2) + 1),
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

  const isLowEnd = requirementsAvailable && minimumRequirements.ramGB <= 4 && (minimumRequirements.minGpuTier || 1) <= 3;

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
