export interface RAWGPlatformRequirement {
  minimum?: string;
  recommended?: string;
}

export interface RAWGPlatform {
  platform: {
    id: number;
    name: string;
    slug: string;
  };
  released_at?: string;
  requirements?: RAWGPlatformRequirement;
  requirements_en?: RAWGPlatformRequirement;
  requirements_ru?: RAWGPlatformRequirement;
}

export interface RAWGGenre {
  id: number;
  name: string;
  slug: string;
}

export interface RAWGTag {
  id: number;
  name: string;
  slug: string;
  language?: string;
}

export interface RAWGDeveloper {
  id: number;
  name: string;
  slug: string;
}

export interface RAWGPublisher {
  id: number;
  name: string;
  slug: string;
}

export interface RAWGScreenshot {
  id: number;
  image: string;
}

export interface RAWGGame {
  id: number;
  slug: string;
  name: string;
  name_original?: string;
  description?: string;
  description_raw?: string;
  metacritic?: number;
  released?: string;
  tba?: boolean;
  updated?: string;
  background_image?: string;
  background_image_additional?: string;
  website?: string;
  rating?: number;
  rating_top?: number;
  ratings_count?: number;
  reviews_text_count?: number;
  added?: number;
  playtime?: number;
  platforms?: RAWGPlatform[];
  genres?: RAWGGenre[];
  tags?: RAWGTag[];
  developers?: RAWGDeveloper[];
  publishers?: RAWGPublisher[];
  short_screenshots?: RAWGScreenshot[];
}

export interface RAWGListResponse {
  count: number;
  next?: string | null;
  previous?: string | null;
  results: RAWGGame[];
}

export interface GameListResponse {
  games: import('./game').Game[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  source: 'rawg' | 'curated-fallback';
  isLive: boolean;
  statusMessage?: string;
  lastSyncTime?: string;
}
