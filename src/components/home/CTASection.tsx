import React from 'react';
import { Link } from 'react-router-dom';
import { Cpu, ArrowRight } from 'lucide-react';
import { usePCSpecs } from '../../hooks/usePCSpecs';

export const CTASection: React.FC = () => {
  const { isConfigured } = usePCSpecs();

  return (
    <section className="py-16 sm:py-20 bg-gradient-to-b from-[#080D18] to-[#0E1625]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Ready to Check Your Gaming PC?
        </h2>
        <p className="text-sm sm:text-base text-[#94A3B8] max-w-xl mx-auto leading-relaxed">
          Input your hardware specs once. We&apos;ll automatically score every game in our catalog against your machine.
        </p>
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/check"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-[#10B981] hover:bg-[#34D399] text-black font-bold text-sm transition-all shadow-md"
          >
            <Cpu className="w-4 h-4" />
            <span>{isConfigured ? 'Review Your PC Specs' : 'Check My PC Now'}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/browse"
            className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 rounded-lg bg-[#111D2D] hover:bg-[#172438] text-white border border-[#243247] font-semibold text-sm transition-colors"
          >
            Browse Full Catalog
          </Link>
        </div>
      </div>
    </section>
  );
};
