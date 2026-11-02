import React from 'react';
import { Link } from 'react-router-dom';
import { Cpu, ShieldCheck, Database, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-[#243247] bg-[#0E1625] text-[#94A3B8] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand info */}
          <div className="md:col-span-2 space-y-3">
            <Link
              to="/"
              className="flex items-center gap-2 text-white font-extrabold font-mono tracking-wider text-base"
            >
              <div className="w-6 h-6 rounded-md bg-[#10B981]/15 text-[#10B981] flex items-center justify-center">
                <Cpu className="w-3.5 h-3.5" />
              </div>
              <span>GAME FINDER</span>
            </Link>
            <p className="text-sm text-[#94A3B8] max-w-md leading-relaxed">
              Transparent gaming compatibility and dynamic hardware discovery. Find PC games that your computer can actually run, from retro classics to modern releases.
            </p>
            {/* RAWG Attribution */}
            <div className="pt-2 flex items-center gap-2 text-xs text-[#94A3B8]">
              <Database className="w-3.5 h-3.5 text-sky-400 shrink-0" />
              <span>
                Game metadata &amp; artwork powered by{' '}
                <a
                  href="https://rawg.io"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sky-400 hover:text-sky-300 underline inline-flex items-center gap-1 font-medium"
                >
                  RAWG Video Games Database
                  <ExternalLink className="w-3 h-3" />
                </a>
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-white font-semibold mb-3">
              Navigation
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/browse" className="hover:text-white transition-colors">
                  Browse Catalog
                </Link>
              </li>
              <li>
                <Link to="/latest" className="hover:text-white transition-colors">
                  Latest Releases
                </Link>
              </li>
              <li>
                <Link to="/check" className="hover:text-white transition-colors">
                  Check PC Specs
                </Link>
              </li>
              <li>
                <Link to="/saved" className="hover:text-white transition-colors">
                  Saved Wishlist
                </Link>
              </li>
              <li>
                <Link to="/settings" className="hover:text-white transition-colors">
                  Local Settings
                </Link>
              </li>
            </ul>
          </div>

          {/* Low-End PC Philosophy */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-white font-semibold mb-3">
              Low-End PC Focus
            </h4>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Meeting minimum requirements means <strong className="text-emerald-400">Can Run</strong>. We never dismiss playable games simply because they lack modern ultra-setting headroom.
            </p>
          </div>
        </div>

        {/* Disclaimer & Copyright */}
        <div className="pt-6 border-t border-[#243247] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs text-[#94A3B8]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#10B981] shrink-0" />
            <p>
              Compatibility assessments and FPS estimates are calculated from curated and provider requirement benchmarks. Actual performance may vary with drivers, thermal conditions, and background tasks.
            </p>
          </div>
          <span className="whitespace-nowrap font-mono">
            &copy; {new Date().getFullYear()} Game Finder.
          </span>
        </div>
      </div>
    </footer>
  );
};
