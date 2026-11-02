import React from 'react';
import { Cpu, Search, CheckCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      step: '01',
      title: 'Enter Your PC Specs',
      description:
        'Input your RAM, CPU model, Graphics Card, and available storage in under 30 seconds. Saved safely in your browser.',
      icon: Cpu,
    },
    {
      step: '02',
      title: 'Discover Compatible Games',
      description:
        'Our transparent compatibility engine evaluates your hardware against genuine game requirements without artificial downrating.',
      icon: Search,
    },
    {
      step: '03',
      title: 'Find Your Next Game',
      description:
        'Explore estimated FPS ranges, filter by genre or installation size, and bookmark games to your personal wishlist.',
      icon: CheckCircle,
    },
  ];

  return (
    <section className="py-16 sm:py-20 border-b border-[#243247] bg-[#0E1625]/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-mono uppercase tracking-wider text-[#10B981] font-semibold">
            Simple Three-Step Workflow
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mt-2">
            How Game Finder Works
          </h2>
          <p className="mt-2 text-sm text-[#94A3B8]">
            No account required. No intrusive background scan software. Just fast, transparent hardware matching.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.step}
                className="relative bg-[#111D2D] border border-[#243247] rounded-xl p-6 shadow-sm flex flex-col justify-between group hover:border-[#10B981]/40 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-black font-mono text-[#94A3B8]/40 group-hover:text-[#10B981] transition-colors">
                      {s.step}
                    </span>
                    <div className="p-2.5 rounded-lg bg-[#080D18] text-[#10B981] border border-white/5">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold text-white mb-2">
                    {s.title}
                  </h3>
                  <p className="text-xs text-[#94A3B8] leading-relaxed">
                    {s.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#243247]/60">
                  <Link
                    to={s.step === '01' ? '/check' : '/browse'}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-[#10B981] hover:text-[#34D399] transition-colors"
                  >
                    <span>{s.step === '01' ? 'Configure Specs' : 'Explore Catalog'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
