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
  | 'Indie';

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
  dataConfidence?: 'verified-official' | 'curated-estimate';
}
