import React, { useEffect } from 'react';
import { HeroSection } from '../components/home/HeroSection';
import { TrendingGamesSection } from '../components/home/TrendingGamesSection';
import { LatestReleasesPreviewSection } from '../components/home/LatestReleasesPreviewSection';
import { HowItWorksSection } from '../components/home/HowItWorksSection';
import { FeaturedGamesSection } from '../components/home/FeaturedGamesSection';
import { LowEndSection } from '../components/home/LowEndSection';
import { WhyGameFinderSection } from '../components/home/WhyGameFinderSection';
import { CTASection } from '../components/home/CTASection';

export const Home: React.FC = () => {
  useEffect(() => {
    document.title = 'Game Finder — Find Games Your PC Can Run';
  }, []);

  return (
    <div className="flex flex-col">
      <HeroSection />
      <TrendingGamesSection />
      <LatestReleasesPreviewSection />
      <HowItWorksSection />
      <FeaturedGamesSection />
      <LowEndSection />
      <WhyGameFinderSection />
      <CTASection />
    </div>
  );
};
