import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Cpu, ArrowRight, ShieldCheck, CheckCircle2, HardDrive, Sparkles } from 'lucide-react';
import { usePCSpecs } from '../hooks/usePCSpecs';
import { PCSpecsForm } from '../components/pc/PCSpecsForm';
import { gamesRepository } from '../lib/games';
import { checkCompatibility } from '../lib/compatibility';
import { GameCard } from '../components/game/GameCard';

export const Check: React.FC = () => {
  const { specs, saveSpecs, clearSpecs, isConfigured } = usePCSpecs();

  useEffect(() => {
    document.title = 'Check Your PC Compatibility | Game Finder';
  }, []);

  // Pick sample games to evaluate immediately
  const previewGames = [
    gamesRepository.getBySlug('grand-theft-auto-san-andreas'),
    gamesRepository.getBySlug('portal-2'),
    gamesRepository.getBySlug('terraria'),
  ].filter((g): g is NonNullable<typeof g> => Boolean(g));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-12">
      {/* Page Header */}
      <div className="max-w-3xl mx-auto text-center space-y-3">
        <span className="text-xs font-mono uppercase tracking-wider text-[#10B981] font-semibold">
          Hardware Diagnostics
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
          Check Your PC Compatibility
        </h1>
        <p className="text-sm text-[#94A3B8] leading-relaxed">
          Enter your computer specifications once to discover which games your hardware can comfortably run. All information is preserved locally in your browser.
        </p>
      </div>

      {/* Main Specs Form Card */}
      <PCSpecsForm
        currentSpecs={specs}
        onSave={saveSpecs}
        onClear={clearSpecs}
      />

      {/* Real-time Immediate Evaluation Preview Once Saved */}
      {isConfigured && specs && (
        <div className="max-w-5xl mx-auto space-y-6 pt-6 border-t border-[#243247]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono uppercase text-[#10B981]">
                <ShieldCheck className="w-4 h-4" />
                <span>Instant Evaluation Preview</span>
              </div>
              <h2 className="text-xl font-bold text-white mt-1">
                Compatibility Results with Your Hardware
              </h2>
              <p className="text-xs text-[#94A3B8]">
                Scored for {specs.ramGB} GB RAM, {specs.cpu}, {specs.gpu}.
              </p>
            </div>

            <Link
              to="/browse?compatibility=can-run"
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-[#10B981] text-black hover:bg-[#34D399] transition-colors whitespace-nowrap self-start sm:self-auto"
            >
              <span>Browse All Games You Can Run</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {previewGames.map((game) => {
              const result = checkCompatibility(specs, game);
              return (
                <GameCard
                  key={game.id}
                  game={game}
                  compatibilityVerdict={result.verdict}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Hardware Tips for Modest Systems */}
      <div className="max-w-3xl mx-auto p-6 rounded-xl bg-[#111D2D] border border-[#243247] space-y-3">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-sky-400" />
          <span>Tips for Low-End PC Gaming</span>
        </h3>
        <ul className="text-xs text-[#94A3B8] space-y-2 leading-relaxed">
          <li>
            • <strong className="text-slate-200">Close Background Tasks:</strong> Web browsers and chat apps can consume 1–2 GB RAM. Close them before running games on systems with 2–4 GB RAM.
          </li>
          <li>
            • <strong className="text-slate-200">Scale Resolution to 720p:</strong> Lowering resolution from 1080p to 720p reduces graphical rendering load by over 50%, dramatically improving FPS on integrated GPUs.
          </li>
          <li>
            • <strong className="text-slate-200">Adjust Shadows &amp; Anti-Aliasing:</strong> Turning off volumetric shadows and heavy MSAA delivers the largest performance boost with minimal visual compromise.
          </li>
        </ul>
      </div>
    </div>
  );
};
