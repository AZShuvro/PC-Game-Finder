import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Compass, Home, HelpCircle } from 'lucide-react';

export const NotFound: React.FC = () => {
  useEffect(() => {
    document.title = 'Page Not Found | Game Finder';
  }, []);

  return (
    <div className="max-w-xl mx-auto px-4 py-24 text-center space-y-6">
      <div className="w-16 h-16 mx-auto rounded-2xl bg-[#111D2D] border border-[#243247] flex items-center justify-center text-[#10B981]">
        <HelpCircle className="w-8 h-8" />
      </div>

      <div className="space-y-2">
        <span className="text-xs font-mono uppercase text-[#10B981] font-semibold">
          Error 404
        </span>
        <h1 className="text-3xl font-extrabold text-white">Page Not Found</h1>
        <p className="text-sm text-[#94A3B8] leading-relaxed">
          The requested page does not exist or may have been moved.
        </p>
      </div>

      <div className="flex items-center justify-center gap-3 pt-2">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold rounded-lg bg-[#10B981] text-black hover:bg-[#34D399] transition-colors"
        >
          <Home className="w-4 h-4" />
          <span>Return Home</span>
        </Link>
        <Link
          to="/browse"
          className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold rounded-lg bg-[#111D2D] hover:bg-[#172438] text-white border border-[#243247] transition-colors"
        >
          <Compass className="w-4 h-4 text-[#94A3B8]" />
          <span>Browse Catalog</span>
        </Link>
      </div>
    </div>
  );
};
