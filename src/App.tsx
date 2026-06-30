import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { LanguageProvider } from './context/LanguageContext';
import { SmoothScroll } from './components/shared/SmoothScroll';
import { Vignette } from './components/shared/Vignette';
import { LoadingScreen } from './components/LoadingScreen/LoadingScreen';
import { Nav } from './components/Nav/Nav';
import { ArcBackground } from './components/Hero/ArcBackground';
import { Hero } from './components/Hero/Hero';
import { LogoTicker } from './components/LogoTicker/LogoTicker';
import { AboutV3 } from './components/AboutV3/AboutV3';
import { WorkShowcase } from './components/WorkShowcase/WorkShowcase';
import { SummerCohort } from './components/SummerCohort/SummerCohort';
import { Pricing } from './components/Pricing/Pricing';
import { FAQ } from './components/FAQ/FAQ';
import { Footer } from './components/Footer/Footer';

function App() {
  const [loading, setLoading] = useState(true);
  const [heroReady, setHeroReady] = useState(false);
  // Called when loading screen text has reached hero position — make hero headline visible
  const handleTextPositioned = useCallback(() => {
    setHeroReady(true);
  }, []);
  // Called when loading screen is fully done (background faded) — unmount it
  const handleLoadingComplete = useCallback(() => {
    setLoading(false);
  }, []);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Keep scroll locked until hero animations complete
  useEffect(() => {
    if (!heroReady) {
      document.body.style.overflow = 'hidden';
    } else {
      // Unlock scroll after hero elements have animated in
      const timer = setTimeout(() => {
        document.body.style.overflow = '';
      }, 2000); // wait for loading fade + panels + CTA to finish animating
      return () => clearTimeout(timer);
    }
  }, [heroReady]);

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
      {loading && <LoadingScreen onTextPositioned={handleTextPositioned} onComplete={handleLoadingComplete} />}
      <div ref={wrapperRef} className="page-wrapper" style={{ position: 'relative', overflowX: 'clip' as const, background: 'var(--bg)' }}>
        <motion.div style={{ y: arcsY }}>
          <ArcBackground />
        </motion.div>
        <Nav introComplete={heroReady} />
        <Hero introComplete={heroReady} />
        <motion.div style={{ y: tickerY }}>
          <LogoTicker />
        </motion.div>
        <AboutV3 />
      </div>
      <WorkShowcase />
      <SummerCohort />
      <Pricing />
      <FAQ />
      <Footer />
    </LanguageProvider>
  );
}

export default App;
