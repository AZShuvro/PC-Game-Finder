import { GAME_CATALOG } from '../data/games/catalog';
import { Game, GameGenre, GameType } from '../types/game';

export const gamesRepository = {
  getAll(): Game[] {
    return GAME_CATALOG;
  },

  getBySlug(slug: string): Game | undefined {
    return GAME_CATALOG.find((g) => g.slug.toLowerCase() === slug.toLowerCase());
  },

  getById(id: string): Game | undefined {
    return GAME_CATALOG.find((g) => g.id === id);
  },

  getFeatured(): Game[] {
    return GAME_CATALOG.filter((g) => g.featured);
  },

  getLowEndFriendly(): Game[] {
    return GAME_CATALOG.filter((g) => g.isLowEndFriendly);
  },

  getAllGenres(): GameGenre[] {
    const genres = new Set<GameGenre>();
    for (const g of GAME_CATALOG) {
      for (const genre of g.genres) {
        genres.add(genre);
      }
    }
    return Array.from(genres).sort();
  },

  getAllGameTypes(): GameType[] {
    const types = new Set<GameType>();
    for (const g of GAME_CATALOG) {
      for (const t of g.gameType) {
        types.add(t);
      }
    }
    return Array.from(types).sort();
  },

  getAllTags(): string[] {
    const tags = new Set<string>();
    for (const g of GAME_CATALOG) {
      for (const t of g.tags) {
        tags.add(t);
      }
    }
    return Array.from(tags).sort();
  },
};
