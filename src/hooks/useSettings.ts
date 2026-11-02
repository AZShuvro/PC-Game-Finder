import { useState, useEffect, useCallback } from 'react';
import { storageService, AppSettings } from '../lib/storage';

export function useSettings() {
  const [settings, setSettingsState] = useState<AppSettings>(() => storageService.getSettings());

  const refresh = useCallback(() => {
    setSettingsState(storageService.getSettings());
  }, []);

  useEffect(() => {
    refresh();
    const handleUpdate = () => refresh();
    window.addEventListener('game-finder:settings-updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('game-finder:settings-updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, [refresh]);

  const updateSettings = useCallback((newSettings: Partial<AppSettings>) => {
    const updated = storageService.setSettings(newSettings);
    setSettingsState(updated);
  }, []);

  const resetAll = useCallback(() => {
    storageService.resetAllData();
  }, []);

  return {
    settings,
    updateSettings,
    resetAll,
  };
}
