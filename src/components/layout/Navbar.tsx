import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Cpu, Menu, X, Bookmark, MonitorCheck, Sparkles } from 'lucide-react';
import { useSavedGames } from '../../hooks/useSavedGames';
import { usePCSpecs } from '../../hooks/usePCSpecs';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { count: savedCount } = useSavedGames();
  const { isConfigured, specs } = usePCSpecs();

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Browse Games', path: '/browse' },
    { label: 'Latest Releases', path: '/latest' },
    { label: 'Check My PC', path: '/check' },
    { label: 'Saved Games', path: '/saved', badge: savedCount },
    { label: 'Settings', path: '/settings' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#243247] bg-[#080D18]/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">
        {/* Zone 1: Single text element wordmark */}
        <Link
          to="/"
          className="flex items-center gap-2.5 text-lg font-bold tracking-tight text-white hover:text-[#10B981] transition-colors whitespace-nowrap shrink-0 group"
          aria-label="Game Finder Home"
        >
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-[#10B981] group-hover:bg-[#10B981] group-hover:text-black transition-all">
            <Cpu className="w-4 h-4" />
          </div>
          <span className="font-extrabold tracking-wider font-mono">GAME FINDER</span>
        </Link>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium">
          {navLinks.map((link) => {
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`relative py-1 whitespace-nowrap shrink-0 transition-colors ${
                  active ? 'text-[#10B981] font-semibold' : 'text-[#94A3B8] hover:text-[#F1F5F9]'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  {link.label}
                  {typeof link.badge === 'number' && link.badge > 0 && (
                    <span className="inline-flex items-center justify-center text-[11px] font-mono font-bold px-1.5 py-0.2 rounded-full bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30">
                      {link.badge}
                    </span>
                  )}
                </span>
                {active && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#10B981] rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="hidden sm:flex items-center gap-3 shrink-0">
          {isConfigured ? (
            <Link
              to="/check"
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-mono font-medium rounded-lg bg-[#111D2D] hover:bg-[#172438] text-emerald-400 border border-emerald-500/30 transition-all whitespace-nowrap shrink-0"
              title={`Saved Specs: ${specs?.ramGB}GB RAM, ${specs?.cpu}`}
            >
              <MonitorCheck className="w-3.5 h-3.5 text-[#10B981]" />
              <span className="truncate max-w-[120px]">
                {specs?.ramGB}GB · {specs?.cpu.split(' ')[0]}
              </span>
            </Link>
          ) : (
            <Link
              to="/check"
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-[#10B981] hover:bg-[#34D399] text-black transition-all shadow-sm whitespace-nowrap shrink-0"
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>Check My PC</span>
            </Link>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="flex lg:hidden items-center gap-2">
          {savedCount > 0 && (
            <Link to="/saved" aria-label="Wishlist" className="p-2 text-[#94A3B8] hover:text-white">
              <Bookmark className="w-5 h-5" />
            </Link>
          )}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#94A3B8] hover:text-white rounded-lg hover:bg-[#111D2D] transition-colors focus:outline-hidden"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#243247] bg-[#0E1625] px-4 pt-3 pb-6 space-y-2">
          {navLinks.map((link) => {
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? 'bg-[#172438] text-[#10B981] font-semibold'
                    : 'text-[#94A3B8] hover:bg-[#111D2D] hover:text-white'
                }`}
              >
                <span>{link.label}</span>
                {typeof link.badge === 'number' && link.badge > 0 && (
                  <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30">
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
          <div className="pt-2">
            <Link
              to="/check"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-lg bg-[#10B981] text-black font-semibold text-sm"
            >
              <Cpu className="w-4 h-4" />
              <span>{isConfigured ? 'View / Edit PC Specs' : 'Check My PC'}</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
