import React from 'react';
import { Link } from 'react-router-dom';
import { Cpu, Compass, CheckCircle2, ArrowRight, Sparkles, Shield, Flame } from 'lucide-react';
import { usePCSpecs } from '../../hooks/usePCSpecs';
import { CompatibilityBadge } from '../ui/Badge';

export const HeroSection: React.FC = () => {
  const { isConfigured, specs } = usePCSpecs();

  return (
    <section className="relative overflow-hidden py-16 sm:py-24 border-b border-[#243247] bg-radial-[at_50%_0%] from-[#0E1625] via-[#080D18] to-[#080D18]">
      {/* Background subtle game artwork banner preview with deep opacity overlay */}
      <div
        className="absolute inset-0 opacity-10 bg-cover bg-center pointer-events-none mix-blend-luminosity"
        style={{
          backgroundImage: `url('https://media.rawg.io/media/games/618/618c2031a07046f8617acdf11170d14c.jpg')`,
        }}
      />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headline and CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#111D2D] border border-emerald-500/30 text-emerald-400 text-xs font-mono">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Dynamic PC Gaming Compatibility &amp; Discovery</span>
            </div>

            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight"
              style={{ textWrap: 'balance' }}
            >
              Find Games Your PC Can Actually Run.
            </h1>

            <p className="text-base sm:text-lg text-[#94A3B8] max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Discover PC games, check hardware compatibility, and explore real game artwork — even on older laptops, integrated graphics, and modest hardware.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                to="/check"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-[#10B981] hover:bg-[#34D399] text-black font-bold text-sm transition-all shadow-md hover:shadow-emerald-500/20"
              >
                <Cpu className="w-4 h-4" />
                <span>{isConfigured ? 'Review My PC Specs' : 'Check My PC'}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/browse"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-[#111D2D] hover:bg-[#172438] text-white border border-[#243247] font-semibold text-sm transition-colors"
              >
                <Compass className="w-4 h-4 text-[#94A3B8]" />
                <span>Explore Catalog</span>
              </Link>

              <Link
                to="/latest"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-3.5 rounded-lg text-slate-300 hover:text-white text-xs font-medium transition-colors"
              >
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                <span>Latest Releases</span>
              </Link>
            </div>

            {/* Active profile badge if configured */}
            {isConfigured && specs && (
              <div className="pt-2 text-xs text-[#94A3B8] flex items-center justify-center lg:justify-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  Active Profile: <strong className="text-white font-medium">{specs.ramGB}GB RAM · {specs.cpu}</strong>
                </span>
              </div>
            )}
          </div>

          {/* Right Column: Illustrative Live Compatibility Preview Card with real artwork */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-md bg-[#111D2D] border border-[#243247] rounded-2xl overflow-hidden shadow-2xl">
              {/* Header Image */}
              <div className="relative h-36 overflow-hidden">
                <img
                  src="https://media.rawg.io/media/games/618/618c2031a07046f8617acdf11170d14c.jpg"
                  alt="GTA San Andreas"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111D2D] via-black/40 to-transparent" />
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-xs">
                  <span className="font-mono text-[10px] uppercase bg-black/70 px-2 py-0.5 rounded text-emerald-400 border border-emerald-500/30">
                    Live Test Preview
                  </span>
                  <CompatibilityBadge verdict="can-run" size="sm" />
                </div>
              </div>

              <div className="p-5 space-y-4">
                <div>
                  <h3 className="font-bold text-white text-base">Grand Theft Auto: San Andreas</h3>
                  <p className="text-xs text-[#94A3B8]">
                    Tested on: <span className="text-slate-200 font-mono">3 GB RAM · Intel Pentium P6200 · Intel HD Graphics</span>
                  </p>
                </div>

                {/* Component checklist */}
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-[#080D18] border border-emerald-500/20">
                    <span className="text-slate-300">Memory (3 GB vs 2 GB Min)</span>
                    <span className="text-emerald-400 font-semibold flex items-center gap-1 font-mono">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Passes Min
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-[#080D18] border border-emerald-500/20">
                    <span className="text-slate-300">Processor (Intel P6200 Dual-Core)</span>
                    <span className="text-emerald-400 font-semibold flex items-center gap-1 font-mono">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Passes Min
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-[#080D18] border border-emerald-500/20">
                    <span className="text-slate-300">Graphics (Intel HD Graphics)</span>
                    <span className="text-emerald-400 font-semibold flex items-center gap-1 font-mono">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Passes Min
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20 text-xs text-slate-300 leading-relaxed">
                  <strong className="text-emerald-400 font-medium">Clear Verdict:</strong> Passes minimum requirements. Conservative headroom logic never penalizes playable games.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
