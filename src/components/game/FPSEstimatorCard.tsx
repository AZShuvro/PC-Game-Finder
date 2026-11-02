import React, { useState } from 'react';
import { Gauge, Sliders, AlertCircle, Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Game } from '../../types/game';
import { PCSpecs } from '../../types/pc-specs';
import { TargetPreset, TargetResolution } from '../../types/fps';
import { estimateFPS } from '../../lib/fps-estimator';

interface FPSEstimatorCardProps {
  game: Game;
  specs: PCSpecs | null;
}

export const FPSEstimatorCard: React.FC<FPSEstimatorCardProps> = ({ game, specs }) => {
  const [resolution, setResolution] = useState<TargetResolution>('1080p');
  const [preset, setPreset] = useState<TargetPreset>('medium');

  const estimate = estimateFPS(specs, game, resolution, preset);

  const resolutionOptions: TargetResolution[] = ['720p', '900p', '1080p', '1440p'];
  const presetOptions: TargetPreset[] = ['low', 'medium', 'high'];

  return (
    <div className="bg-[#111D2D] border border-[#243247] rounded-xl p-6 shadow-md space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#243247]">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Gauge className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-base text-white">Estimated Performance Range</h3>
            <span className="text-xs text-[#94A3B8]">
              Approximate FPS simulation based on hardware tier matching
            </span>
          </div>
        </div>

        {estimate.confidence !== 'unavailable' && (
          <span className="inline-flex items-center gap-1.5 text-xs font-mono text-[#94A3B8] bg-[#080D18] px-2.5 py-1 rounded-md border border-[#243247]">
            <Sparkles className="w-3.5 h-3.5 text-[#10B981]" />
            Confidence: <strong className="text-slate-200 capitalize font-medium">{estimate.confidence}</strong>
          </span>
        )}
      </div>

      {!specs ? (
        <div className="p-6 rounded-lg bg-[#080D18]/80 border border-dashed border-[#243247] text-center space-y-3">
          <p className="text-sm text-[#94A3B8]">
            Configure your PC hardware specifications to unlock realistic FPS estimations for {game.title}.
          </p>
          <Link
            to="/check"
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-[#10B981] text-black hover:bg-[#34D399] transition-colors"
          >
            <span>Enter PC Specifications</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <>
          {/* Controls: Resolution & Preset */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Resolution Buttons */}
            <div>
              <label className="block text-xs font-mono uppercase text-[#94A3B8] mb-2">
                Target Resolution
              </label>
              <div className="grid grid-cols-4 gap-1.5 p-1 bg-[#080D18] rounded-lg border border-[#243247]">
                {resolutionOptions.map((res) => (
                  <button
                    key={res}
                    type="button"
                    onClick={() => setResolution(res)}
                    className={`py-1.5 text-xs font-mono font-medium rounded-md transition-all ${
                      resolution === res
                        ? 'bg-[#172438] text-white shadow-xs border border-white/10 font-bold'
                        : 'text-[#94A3B8] hover:text-white'
                    }`}
                  >
                    {res}
                  </button>
                ))}
              </div>
            </div>

            {/* Preset Buttons */}
            <div>
              <label className="block text-xs font-mono uppercase text-[#94A3B8] mb-2">
                Graphics Preset
              </label>
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-[#080D18] rounded-lg border border-[#243247]">
                {presetOptions.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPreset(p)}
                    className={`py-1.5 text-xs font-medium capitalize rounded-md transition-all ${
                      preset === p
                        ? 'bg-[#172438] text-white shadow-xs border border-white/10 font-bold'
                        : 'text-[#94A3B8] hover:text-white'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results display */}
          <div className="p-5 rounded-xl bg-[#080D18] border border-[#243247] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-mono text-[#94A3B8] uppercase block">
                Estimated Output Range ({resolution} · {preset})
              </span>
              <div className="text-3xl font-extrabold font-mono tracking-tight text-white mt-1">
                {estimate.range}
              </div>
              <p className="mt-2 text-xs text-[#94A3B8] max-w-lg leading-relaxed">
                {estimate.verdictNote}
              </p>
            </div>

            {estimate.bottleneck && estimate.bottleneck !== 'none' && (
              <div className="shrink-0 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs">
                <span className="font-semibold block mb-0.5">Primary Bottleneck</span>
                <span className="capitalize text-slate-200">{estimate.bottleneck.toUpperCase()} Bound</span>
              </div>
            )}
          </div>

          {/* Transparent disclaimer */}
          <div className="flex items-start gap-2.5 text-xs text-[#94A3B8] bg-[#0E1625] p-3 rounded-lg border border-[#243247]/60">
            <AlertCircle className="w-4 h-4 text-[#94A3B8] shrink-0 mt-0.5" />
            <p className="leading-relaxed">{estimate.disclaimer}</p>
          </div>
        </>
      )}
    </div>
  );
};
