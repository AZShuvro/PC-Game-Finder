import { useState, useEffect, useCallback } from 'react';
import { PCSpecs } from '../types/pc-specs';
import { storageService } from '../lib/storage';

export function usePCSpecs() {
  const [specs, setSpecs] = useState<PCSpecs | null>(() => storageService.getPCSpecs());

  const refresh = useCallback(() => {
    setSpecs(storageService.getPCSpecs());
  }, []);

  useEffect(() => {
    refresh();
    const handleUpdate = () => refresh();
    window.addEventListener('game-finder:pc-specs-updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('game-finder:pc-specs-updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, [refresh]);

  const saveSpecs = useCallback((newSpecs: PCSpecs) => {
    const withTimestamp = {
      ...newSpecs,
      lastUpdated: new Date().toISOString(),
    };
    storageService.setPCSpecs(withTimestamp);
    setSpecs(withTimestamp);
  }, []);

  const clearSpecs = useCallback(() => {
    storageService.clearPCSpecs();
    setSpecs(null);
  }, []);

  return {
    specs,
    isConfigured: specs !== null && specs.ramGB > 0 && !!specs.cpu && !!specs.gpu,
    saveSpecs,
    clearSpecs,
  };
}
