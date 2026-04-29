import { useState, useCallback } from 'react';
import { LanguageProvider } from './context/LanguageContext';
import { SmoothScroll } from './components/shared/SmoothScroll';
import { Vignette } from './components/shared/Vignette';
import { LoadingScreen } from './components/LoadingScreen/LoadingScreen';
import { Nav } from './components/Nav/Nav';
import { ArcBackground } from './components/Hero/ArcBackground';
import { Hero } from './components/Hero/Hero';
import { LogoTicker } from './components/LogoTicker/LogoTicker';
import { About } from './components/About/About';
import { SpringCohort } from './components/SpringCohort/SpringCohort';
import { SummerCohort } from './components/SummerCohort/SummerCohort';
import { Pricing } from './components/Pricing/Pricing';
import { FAQ } from './components/FAQ/FAQ';
import { Footer } from './components/Footer/Footer';

function App() {
  const [loading, setLoading] = useState(true);
  const handleLoadingComplete = useCallback(() => setLoading(false), []);

  return (
    <LanguageProvider>
      <SmoothScroll />
      <Vignette />
      {loading && <LoadingScreen onComplete={handleLoadingComplete} />}
      <div className="page-wrapper" style={{ position: 'relative', overflowX: 'clip' as const, background: 'var(--bg)' }}>
        <ArcBackground />
        <Nav />
        <Hero />
        <LogoTicker />
        <About />
      </div>
      <SpringCohort />
      <SummerCohort />
      <Pricing />
      <FAQ />
      <Footer />
    </LanguageProvider>
  );
}

export default App;
