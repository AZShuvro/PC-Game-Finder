import React from 'react';
import { Link } from 'react-router-dom';
import { Cpu, Compass, CheckCircle2, ArrowRight, Sparkles, HardDrive, Shield } from 'lucide-react';
import { usePCSpecs } from '../../hooks/usePCSpecs';
import { CompatibilityBadge } from '../ui/Badge';

export const HeroSection: React.FC = () => {
  const { isConfigured, specs } = usePCSpecs();

  return (
    <section className="relative overflow-hidden py-16 sm:py-24 border-b border-[#243247] bg-radial-[at_50%_0%] from-[#0E1625] via-[#080D18] to-[#080D18]">
      {/* Background geometric accents */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headline and CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#111D2D] border border-emerald-500/30 text-emerald-400 text-xs font-mono">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Low-End & Older PC Friendly Discovery</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight" style={{ textWrap: 'balance' }}>
              Find Games Your PC Can Actually Run.
            </h1>

            <p className="text-base sm:text-lg text-[#94A3B8] max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Discover PC games, check hardware compatibility, and find your next favorite game — even on older laptops, integrated graphics, and modest hardware.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                to="/check"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-[#10B981] hover:bg-[#34D399] text-black font-bold text-sm transition-all shadow-md hover:shadow-emerald-500/20"
              >
                <Cpu className="w-4 h-4" />
                <span>{isConfigured ? 'View My PC Specs' : 'Check My PC'}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/browse"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-[#111D2D] hover:bg-[#172438] text-white border border-[#243247] font-semibold text-sm transition-colors"
              >
                <Compass className="w-4 h-4 text-[#94A3B8]" />
                <span>Explore Games</span>
              </Link>
            </div>

            {/* Active profile badge if configured */}
            {isConfigured && specs && (
              <div className="pt-2 text-xs text-[#94A3B8] flex items-center justify-center lg:justify-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Active Profile: <strong className="text-white font-medium">{specs.ramGB}GB RAM · {specs.cpu}</strong></span>
              </div>
            )}
          </div>

          {/* Right Column: Illustrative Live Compatibility Preview Card */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-md bg-[#111D2D] border border-[#243247] rounded-2xl p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#243247]">
                <div className="flex items-center gap-2 text-xs font-mono text-[#94A3B8]">
                  <Shield className="w-4 h-4 text-emerald-400" />
                  <span>COMPATIBILITY PREVIEW</span>
                </div>
                <span className="text-[10px] font-mono uppercase bg-[#080D18] px-2 py-0.5 rounded text-[#94A3B8] border border-white/5">
                  Illustrative Simulation
                </span>
              </div>

              {/* Game preview header */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-white text-base">Grand Theft Auto: San Andreas</h3>
                  <CompatibilityBadge verdict="can-run" size="sm" />
                </div>
                <p className="text-xs text-[#94A3B8]">
                  Tested on: <span className="text-slate-300 font-mono">3 GB RAM · Intel Pentium P6200 · Intel HD Graphics</span>
                </p>
              </div>

              {/* Component checklist */}
              <div className="space-y-2 pt-2 text-xs">
                <div className="flex items-center justify-between p-2 rounded-lg bg-[#080D18] border border-emerald-500/20">
                  <span className="text-slate-300">Memory (3 GB vs 2 GB Min)</span>
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Passes Min
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-[#080D18] border border-emerald-500/20">
                  <span className="text-slate-300">Processor (Intel P6200 Dual-Core)</span>
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Passes Min
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-[#080D18] border border-emerald-500/20">
                  <span className="text-slate-300">Graphics (Intel HD Graphics)</span>
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Passes Min
                  </span>
                </div>
              </div>

              {/* Result explanation */}
              <div className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20 text-xs text-slate-300 leading-relaxed">
                <strong className="text-emerald-400 font-medium">Clear Verdict:</strong> Your 3 GB RAM meets the game&apos;s 2 GB minimum requirement. Meets minimum specs without forced downgrade to Maybe.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
