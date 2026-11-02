import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Home } from './pages/Home';
import { Browse } from './pages/Browse';
import { LatestReleases } from './pages/LatestReleases';
import { Check } from './pages/Check';
import { Saved } from './pages/Saved';
import { Settings } from './pages/Settings';
import { GameDetails } from './pages/GameDetails';
import { NotFound } from './pages/NotFound';
import { validateCatalog } from './lib/validation';

export function App() {
  useEffect(() => {
    // Validate catalog data on startup
    const validation = validateCatalog();
    if (!validation.isValid) {
      console.warn('Game Finder catalog validation warnings:', validation.errors);
    }
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/latest" element={<LatestReleases />} />
          <Route path="/check" element={<Check />} />
          <Route path="/saved" element={<Saved />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/games/:slug" element={<GameDetails />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
