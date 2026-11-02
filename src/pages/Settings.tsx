import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Settings as SettingsIcon, Cpu, Bookmark, Trash2, RotateCcw, Edit3, ShieldAlert, CheckCircle2, HardDrive } from 'lucide-react';
import { usePCSpecs } from '../hooks/usePCSpecs';
import { useSavedGames } from '../hooks/useSavedGames';
import { useSettings } from '../hooks/useSettings';
import { ConfirmationModal } from '../components/ui/Modal';

export const Settings: React.FC = () => {
  const { specs, clearSpecs, isConfigured } = usePCSpecs();
  const { count: savedCount, clearSaved } = useSavedGames();
  const { resetAll } = useSettings();

  const [modalType, setModalType] = useState<'clear-specs' | 'clear-saved' | 'reset-all' | null>(null);
  const [successMessage, setSuccessMessage] = useState<string>('');

  useEffect(() => {
    document.title = 'Settings | Game Finder';
  }, []);

  const triggerSuccess = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleConfirm = () => {
    if (modalType === 'clear-specs') {
      clearSpecs();
      triggerSuccess('PC specifications cleared from local storage.');
    } else if (modalType === 'clear-saved') {
      clearSaved();
      triggerSuccess('Saved games list cleared.');
    } else if (modalType === 'reset-all') {
      resetAll();
      triggerSuccess('All local application data reset successfully.');
    }
    setModalType(null);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
      {/* Header */}
      <div className="pb-6 border-b border-[#243247]">
        <span className="text-xs font-mono uppercase tracking-wider text-[#10B981] font-semibold">
          Preferences &amp; Data
        </span>
        <h1 className="text-3xl font-extrabold text-white mt-1 flex items-center gap-2.5">
          <SettingsIcon className="w-7 h-7 text-[#10B981]" />
          <span>Application Settings</span>
        </h1>
        <p className="mt-1 text-sm text-[#94A3B8]">
          Manage your saved computer specifications, wishlist items, and local storage data.
        </p>
      </div>

      {successMessage && (
        <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Local Storage Notice */}
      <div className="p-5 rounded-xl bg-[#0E1625] border border-[#243247] space-y-2">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          <HardDrive className="w-4 h-4 text-emerald-400" />
          <span>Local Storage Architecture</span>
        </h3>
        <p className="text-xs text-[#94A3B8] leading-relaxed">
          Game Finder stores your hardware profile, bookmarks, and preferences exclusively in your browser&apos;s <code className="text-slate-200 font-mono">localStorage</code>. Data stays on your device without requiring third-party logins.
        </p>
      </div>

      {/* Database Provider & Sync Status */}
      <div className="p-5 rounded-xl bg-[#111D2D] border border-[#243247] space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-[#243247]">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-pulse" />
            <span>Catalog Database &amp; External Integration</span>
          </h3>
          <span className="text-[11px] font-mono text-[#10B981] bg-[#10B981]/10 px-2 py-0.5 rounded border border-[#10B981]/20">
            RAWG Video Games Database
          </span>
        </div>
        <p className="text-xs text-[#94A3B8] leading-relaxed">
          The catalog is dynamically enriched via server-side proxy routes to RAWG with 15-minute response caching. To connect full live search and automated new release discovery, define <code className="text-emerald-400 font-mono">RAWG_API_KEY</code> in your environment. When unset, Game Finder seamlessly serves the local 26-title benchmark catalog with real artwork.
        </p>
      </div>

      <div className="space-y-6">
        {/* Section 1: PC Specifications */}
        <div className="bg-[#111D2D] border border-[#243247] rounded-xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#243247]">
            <h3 className="text-base font-semibold text-white flex items-center gap-2">
              <Cpu className="w-4 h-4 text-[#10B981]" />
              <span>Saved PC Specifications</span>
            </h3>
            {isConfigured && (
              <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/20">
                Active Profile
              </span>
            )}
          </div>

          {isConfigured && specs ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-[#080D18] p-4 rounded-lg border border-[#243247]">
                <div>
                  <span className="text-[#94A3B8] block text-[11px] font-mono uppercase">Memory</span>
                  <span className="text-white font-bold">{specs.ramGB} GB RAM</span>
                </div>
                <div>
                  <span className="text-[#94A3B8] block text-[11px] font-mono uppercase">Processor</span>
                  <span className="text-white font-medium truncate block" title={specs.cpu}>
                    {specs.cpu}
                  </span>
                </div>
                <div>
                  <span className="text-[#94A3B8] block text-[11px] font-mono uppercase">Graphics</span>
                  <span className="text-white font-medium truncate block" title={specs.gpu}>
                    {specs.gpu}
                  </span>
                </div>
                <div>
                  <span className="text-[#94A3B8] block text-[11px] font-mono uppercase">Free Storage</span>
                  <span className="text-white font-bold">{specs.storageGB} GB</span>
                </div>
              </div>

              <div className="flex items-center justify-between flex-wrap gap-3 pt-2">
                <span className="text-xs text-[#94A3B8]">
                  Used to evaluate compatibility against all catalog games.
                </span>
                <div className="flex items-center gap-3">
                  <Link
                    to="/check"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#172438] hover:bg-[#243247] text-white text-xs font-semibold transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Specifications</span>
                  </Link>
                  <button
                    type="button"
                    onClick={() => setModalType('clear-specs')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 text-xs font-medium transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear Specs</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-6 space-y-3">
              <p className="text-xs text-[#94A3B8]">
                No PC specifications configured yet. Add your specs to check game compatibility.
              </p>
              <Link
                to="/check"
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-[#10B981] text-black hover:bg-[#34D399] transition-colors"
              >
                <span>Enter PC Specifications</span>
              </Link>
            </div>
          )}
        </div>

        {/* Section 2: Saved Wishlist */}
        <div className="bg-[#111D2D] border border-[#243247] rounded-xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#243247]">
            <h3 className="text-base font-semibold text-white flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-[#10B981]" />
              <span>Saved Games Wishlist</span>
            </h3>
            <span className="text-xs font-mono font-bold text-white bg-[#080D18] px-2 py-0.5 rounded border border-[#243247]">
              {savedCount} games
            </span>
          </div>

          <p className="text-xs text-[#94A3B8] leading-relaxed">
            Your wishlist stores games you have bookmarked for future playthroughs. You currently have{' '}
            <strong className="text-white">{savedCount}</strong> game{savedCount === 1 ? '' : 's'} saved.
          </p>

          <div className="flex items-center justify-between flex-wrap gap-3 pt-2">
            <Link
              to="/saved"
              className="text-xs font-medium text-emerald-400 hover:underline"
            >
              → View your saved games
            </Link>

            {savedCount > 0 && (
              <button
                type="button"
                onClick={() => setModalType('clear-saved')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 text-xs font-medium transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear Wishlist</span>
              </button>
            )}
          </div>
        </div>

        {/* Section 3: Danger Zone - Reset All Data */}
        <div className="bg-[#111D2D] border border-rose-500/30 rounded-xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#243247]">
            <h3 className="text-base font-semibold text-rose-400 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4" />
              <span>Reset Application Data</span>
            </h3>
          </div>

          <p className="text-xs text-[#94A3B8] leading-relaxed">
            This will permanently erase all PC specifications, saved wishlist bookmarks, and custom settings stored in this browser.
          </p>

          <div className="pt-2">
            <button
              type="button"
              onClick={() => setModalType('reset-all')}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-rose-600 hover:bg-rose-500 text-white transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset All Local Data</span>
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modals */}
      <ConfirmationModal
        isOpen={modalType === 'clear-specs'}
        title="Clear PC Specifications?"
        message="Are you sure you want to clear your saved PC specifications? You will need to re-enter them to view hardware compatibility badges."
        confirmLabel="Clear Specs"
        onConfirm={handleConfirm}
        onClose={() => setModalType(null)}
      />

      <ConfirmationModal
        isOpen={modalType === 'clear-saved'}
        title="Clear Saved Games?"
        message="Are you sure you want to remove all games from your wishlist? This action cannot be undone."
        confirmLabel="Clear Wishlist"
        onConfirm={handleConfirm}
        onClose={() => setModalType(null)}
      />

      <ConfirmationModal
        isOpen={modalType === 'reset-all'}
        title="Reset All Application Data?"
        message="This will permanently delete all your PC specifications and wishlist bookmarks from this browser. Are you sure you want to proceed?"
        confirmLabel="Reset Everything"
        onConfirm={handleConfirm}
        onClose={() => setModalType(null)}
      />
    </div>
  );
};
