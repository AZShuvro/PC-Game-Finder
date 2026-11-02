import React from 'react';
import { Cpu, Laptop, Scale, Gauge, BookmarkCheck } from 'lucide-react';

export const WhyGameFinderSection: React.FC = () => {
  const features = [
    {
      title: 'Accurate PC Compatibility',
      description:
        'Transparent assessment logic. Meeting minimum requirements honestly returns Can Run, never penalized just for lacking high-end headroom.',
      icon: Cpu,
    },
    {
      title: 'Low-End PC Discovery',
      description:
        'Dedicated discovery for older laptops, dual-core processors, and integrated graphics chips like Intel HD Graphics.',
      icon: Laptop,
    },
    {
      title: 'Side-by-Side Comparison',
      description:
        'Direct component-by-component comparison of your RAM, CPU, GPU, and Storage against verified minimum and recommended limits.',
      icon: Scale,
    },
    {
      title: 'Conservative FPS Estimates',
      description:
        'Realistic discrete frame rate ranges across 720p, 1080p, and 1440p without fabricated decimal-precision benchmarks.',
      icon: Gauge,
    },
    {
      title: 'Persistent Local Wishlist',
      description:
        'Save games locally in your browser. No account registration or cloud sign-in required to build your personal gaming library.',
      icon: BookmarkCheck,
    },
  ];

  return (
    <section className="py-16 sm:py-20 border-b border-[#243247]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-mono uppercase tracking-wider text-[#10B981] font-semibold">
            Built for Gamers
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">
            Why Use Game Finder?
          </h2>
          <p className="mt-2 text-sm text-[#94A3B8]">
            Traditional system requirement tools often exaggerate hardware demands or install heavy telemetry software. Game Finder is lightweight, honest, and browser-native.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.title}
                className={`bg-[#111D2D] border border-[#243247] rounded-xl p-6 shadow-sm flex flex-col justify-between ${
                  idx === 4 ? 'md:col-span-2 lg:col-span-1' : ''
                }`}
              >
                <div>
                  <div className="w-10 h-10 rounded-lg bg-[#080D18] text-[#10B981] border border-white/5 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-semibold text-white mb-2">
                    {feat.title}
                  </h3>
                  <p className="text-xs text-[#94A3B8] leading-relaxed">
                    {feat.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
