export type GameGenre =
  | 'Action'
  | 'Adventure'
  | 'Racing'
  | 'Strategy'
  | 'Puzzle'
  | 'Platformer'
  | 'RPG'
  | 'Simulation'
  | 'Horror'
  | 'Casual'
  | 'Shooter'
  | 'Indie'
  | 'Sports'
  | 'Fighting'
  | 'Arcade'
  | 'Massively Multiplayer';

export type GameType =
  | 'Singleplayer'
  | 'Multiplayer'
  | 'Co-op'
  | 'Offline'
  | 'Online';

export type SupportedOS =
  | 'Windows XP'
  | 'Windows Vista'
  | 'Windows 7'
  | 'Windows 8.1'
  | 'Windows 10'
  | 'Windows 11'
  | 'Other';

export interface GameRequirements {
  ramGB: number;
  cpu: string;
  gpu: string;
  storageGB: number;
  operatingSystem: SupportedOS | string;
  // Internal tier rating for conservative matching (1 to 10 scale)
  minCpuTier?: number;
  minGpuTier?: number;
  recCpuTier?: number;
  recGpuTier?: number;
  rawText?: string;
}

export type CoverStyle =
  | 'action-amber'
  | 'crimson-dark'
  | 'emerald-neon'
  | 'cyber-blue'
  | 'vintage-sepia'
  | 'indie-purple'
  | 'minimal-slate'
  | 'golden-bronze';

export type CatalogSource = 'curated' | 'rawg';

export interface Game {
  id: string;
  slug: string;
  title: string;
  acronyms?: string[];
  shortDescription: string;
  description: string;
  genres: GameGenre[];
  gameType: GameType[];
  releaseYear: number;
  releasedDate?: string; // e.g. "2004-10-26"
  developer: string;
  publisher?: string;
  estimatedSizeGB: number;
  supportedOperatingSystems: SupportedOS[];
  minimumRequirements: GameRequirements;
  recommendedRequirements: GameRequirements;
  tags: string[];
  featured?: boolean;
  isLowEndFriendly: boolean;
  coverStyle: CoverStyle;
  hardwareNotes?: string;
  dataConfidence?: 'verified-official' | 'curated-estimate' | 'external-unverified';

  // Dynamic / Artwork additions
  coverImage?: string; // Primary card thumbnail
  backgroundImage?: string; // Detail hero / widescreen backdrop
  screenshots?: string[]; // Extra screenshot gallery
  rating?: number; // e.g. 4.7
  ratingsCount?: number;
  metacritic?: number; // Metacritic score e.g. 93
  isUpcoming?: boolean;
  source: CatalogSource;
  rawgId?: number;
  requirementsAvailable: boolean; // Flag indicating if real PC requirements were found
}
