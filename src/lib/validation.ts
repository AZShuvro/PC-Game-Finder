import { Game } from '../types/game';
import { GAME_CATALOG } from '../data/games/catalog';

export interface CatalogValidationError {
  gameId?: string;
  gameTitle?: string;
  field: string;
  message: string;
}

export function validateCatalog(catalog: Game[] = GAME_CATALOG): {
  isValid: boolean;
  errors: CatalogValidationError[];
} {
  const errors: CatalogValidationError[] = [];
  const seenIds = new Set<string>();
  const seenSlugs = new Set<string>();

  for (const game of catalog) {
    // Unique ID
    if (!game.id || typeof game.id !== 'string') {
      errors.push({ field: 'id', message: `Missing or invalid ID on game: "${game.title || 'Untitled'}"` });
    } else if (seenIds.has(game.id)) {
      errors.push({ gameId: game.id, field: 'id', message: `Duplicate game ID found: "${game.id}"` });
    } else {
      seenIds.add(game.id);
    }

    // Unique Slug
    if (!game.slug || typeof game.slug !== 'string') {
      errors.push({ gameId: game.id, field: 'slug', message: `Missing slug on game "${game.title}"` });
    } else if (seenSlugs.has(game.slug)) {
      errors.push({ gameId: game.id, field: 'slug', message: `Duplicate game slug found: "${game.slug}"` });
    } else {
      seenSlugs.add(game.slug);
    }

    // Required title
    if (!game.title || game.title.trim() === '') {
      errors.push({ gameId: game.id, field: 'title', message: `Game ${game.id} is missing a required title` });
    }

    // Release year
    if (!game.releaseYear || game.releaseYear < 1970 || game.releaseYear > 2030) {
      errors.push({
        gameId: game.id,
        gameTitle: game.title,
        field: 'releaseYear',
        message: `Invalid release year: ${game.releaseYear}`,
      });
    }

    // Storage and RAM validation
    if (!game.estimatedSizeGB || game.estimatedSizeGB <= 0) {
      errors.push({
        gameId: game.id,
        gameTitle: game.title,
        field: 'estimatedSizeGB',
        message: `Estimated size must be positive, got ${game.estimatedSizeGB}`,
      });
    }

    if (!game.minimumRequirements || game.minimumRequirements.ramGB <= 0) {
      errors.push({
        gameId: game.id,
        gameTitle: game.title,
        field: 'minimumRequirements.ramGB',
        message: 'Minimum RAM must be specified and positive',
      });
    }

    if (!game.recommendedRequirements || game.recommendedRequirements.ramGB <= 0) {
      errors.push({
        gameId: game.id,
        gameTitle: game.title,
        field: 'recommendedRequirements.ramGB',
        message: 'Recommended RAM must be specified and positive',
      });
    }

    // Genres & Types
    if (!Array.isArray(game.genres) || game.genres.length === 0) {
      errors.push({
        gameId: game.id,
        gameTitle: game.title,
        field: 'genres',
        message: 'Game must have at least one genre',
      });
    }

    if (!Array.isArray(game.gameType) || game.gameType.length === 0) {
      errors.push({
        gameId: game.id,
        gameTitle: game.title,
        field: 'gameType',
        message: 'Game must have at least one game type',
      });
    }

    if (!Array.isArray(game.supportedOperatingSystems) || game.supportedOperatingSystems.length === 0) {
      errors.push({
        gameId: game.id,
        gameTitle: game.title,
        field: 'supportedOperatingSystems',
        message: 'Game must list at least one supported OS',
      });
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
