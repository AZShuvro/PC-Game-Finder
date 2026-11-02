import { useState, useEffect, useCallback } from 'react';
import { storageService } from '../lib/storage';

export function useSavedGames() {
  const [savedIds, setSavedIds] = useState<string[]>(() => storageService.getSavedGameIds());

  const refresh = useCallback(() => {
    setSavedIds(storageService.getSavedGameIds());
  }, []);

  useEffect(() => {
    refresh();
    const handleUpdate = () => refresh();
    window.addEventListener('game-finder:saved-games-updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('game-finder:saved-games-updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, [refresh]);

  const toggleSave = useCallback((id: string) => {
    const current = storageService.getSavedGameIds();
    if (current.includes(id)) {
      const next = storageService.removeSavedGameId(id);
      setSavedIds(next);
      return false;
    } else {
      const next = storageService.saveGameId(id);
      setSavedIds(next);
      return true;
    }
  }, []);

  const isSaved = useCallback(
    (id: string) => {
      return savedIds.includes(id);
    },
    [savedIds]
  );

  const clearSaved = useCallback(() => {
    storageService.clearSavedGames();
    setSavedIds([]);
  }, []);

  return {
    savedIds,
    count: savedIds.length,
    isSaved,
    toggleSave,
    clearSaved,
  };
}
