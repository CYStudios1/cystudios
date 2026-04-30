import { useState, useCallback, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
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
  const wrapperRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ['start start', '30% start'],
  });
  const arcsY = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const tickerY = useTransform(scrollYProgress, [0, 1], [0, -60]);

  return (
    <LanguageProvider>
      <SmoothScroll />
      <Vignette />
      {loading && <LoadingScreen onComplete={handleLoadingComplete} />}
      <div ref={wrapperRef} className="page-wrapper" style={{ position: 'relative', overflowX: 'clip' as const, background: 'var(--bg)' }}>
        <motion.div style={{ y: arcsY }}>
          <ArcBackground />
        </motion.div>
        <Nav />
        <Hero />
        <motion.div style={{ y: tickerY }}>
          <LogoTicker />
        </motion.div>
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
