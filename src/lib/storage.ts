import { PCSpecs } from '../types/pc-specs';

export const STORAGE_KEYS = {
  PC_SPECS: 'game-finder:pc-specs',
  SAVED_GAMES: 'game-finder:saved-games',
  SETTINGS: 'game-finder:settings',
} as const;

export interface AppSettings {
  defaultResolution: '720p' | '900p' | '1080p' | '1440p';
  defaultPreset: 'low' | 'medium' | 'high';
  showLowEndTips: boolean;
}

export const DEFAULT_SETTINGS: AppSettings = {
  defaultResolution: '1080p',
  defaultPreset: 'medium',
  showLowEndTips: true,
};

export const DEFAULT_PC_SPECS: PCSpecs = {
  ramGB: 3,
  cpu: 'Intel Pentium P6200',
  gpu: 'Intel HD Graphics',
  storageGB: 200,
  operatingSystem: 'Windows 7',
};

function isClient(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

export const storageService = {
  // PC Specs
  getPCSpecs(): PCSpecs | null {
    if (!isClient()) return DEFAULT_PC_SPECS;
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PC_SPECS);
      if (data === '__cleared__') {
        return null;
      }
      if (!data) {
        // Initialize with default reference specification so compatibility checks work immediately
        this.setPCSpecs(DEFAULT_PC_SPECS);
        return DEFAULT_PC_SPECS;
      }
      const parsed = JSON.parse(data) as PCSpecs;
      if (!parsed || typeof parsed.ramGB !== 'number' || !parsed.cpu || !parsed.gpu) {
        return DEFAULT_PC_SPECS;
      }
      return parsed;
    } catch (e) {
      console.warn('Failed to parse saved PC specs from storage', e);
      return DEFAULT_PC_SPECS;
    }
  },

  setPCSpecs(specs: PCSpecs): void {
    if (!isClient()) return;
    try {
      localStorage.setItem(STORAGE_KEYS.PC_SPECS, JSON.stringify(specs));
      window.dispatchEvent(new Event('game-finder:pc-specs-updated'));
    } catch (e) {
      console.error('Failed to save PC specs to localStorage', e);
    }
  },

  clearPCSpecs(): void {
    if (!isClient()) return;
    try {
      localStorage.setItem(STORAGE_KEYS.PC_SPECS, '__cleared__');
      window.dispatchEvent(new Event('game-finder:pc-specs-updated'));
    } catch (e) {
      console.error('Failed to clear PC specs from localStorage', e);
    }
  },

  // Saved Games (Wishlist)
  getSavedGameIds(): string[] {
    if (!isClient()) return [];
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SAVED_GAMES);
      if (!data) return [];
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) {
        return parsed.filter((id): id is string => typeof id === 'string');
      }
      return [];
    } catch (e) {
      console.warn('Failed to parse saved games from storage', e);
      return [];
    }
  },

  saveGameId(id: string): string[] {
    if (!isClient()) return [];
    try {
      const current = this.getSavedGameIds();
      if (!current.includes(id)) {
        const next = [...current, id];
        localStorage.setItem(STORAGE_KEYS.SAVED_GAMES, JSON.stringify(next));
        window.dispatchEvent(new Event('game-finder:saved-games-updated'));
        return next;
      }
      return current;
    } catch (e) {
      console.error('Failed to save game ID', e);
      return [];
    }
  },

  removeSavedGameId(id: string): string[] {
    if (!isClient()) return [];
    try {
      const current = this.getSavedGameIds();
      const next = current.filter((item) => item !== id);
      localStorage.setItem(STORAGE_KEYS.SAVED_GAMES, JSON.stringify(next));
      window.dispatchEvent(new Event('game-finder:saved-games-updated'));
      return next;
    } catch (e) {
      console.error('Failed to remove saved game ID', e);
      return [];
    }
  },

  clearSavedGames(): void {
    if (!isClient()) return;
    try {
      localStorage.removeItem(STORAGE_KEYS.SAVED_GAMES);
      window.dispatchEvent(new Event('game-finder:saved-games-updated'));
    } catch (e) {
      console.error('Failed to clear saved games', e);
    }
  },

  // Settings
  getSettings(): AppSettings {
    if (!isClient()) return DEFAULT_SETTINGS;
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (!data) return DEFAULT_SETTINGS;
      const parsed = JSON.parse(data);
      return { ...DEFAULT_SETTINGS, ...parsed };
    } catch (e) {
      return DEFAULT_SETTINGS;
    }
  },

  setSettings(settings: Partial<AppSettings>): AppSettings {
    if (!isClient()) return DEFAULT_SETTINGS;
    try {
      const current = this.getSettings();
      const updated = { ...current, ...settings };
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
      window.dispatchEvent(new Event('game-finder:settings-updated'));
      return updated;
    } catch (e) {
      return DEFAULT_SETTINGS;
    }
  },

  // Reset all application local storage
  resetAllData(): void {
    if (!isClient()) return;
    try {
      localStorage.removeItem(STORAGE_KEYS.PC_SPECS);
      localStorage.removeItem(STORAGE_KEYS.SAVED_GAMES);
      localStorage.removeItem(STORAGE_KEYS.SETTINGS);
      window.dispatchEvent(new Event('game-finder:pc-specs-updated'));
      window.dispatchEvent(new Event('game-finder:saved-games-updated'));
      window.dispatchEvent(new Event('game-finder:settings-updated'));
    } catch (e) {
      console.error('Failed to reset local storage data', e);
    }
  },
};
