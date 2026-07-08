import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { LoadingScreen } from '../components/LoadingScreen/LoadingScreen';
import { Nav } from '../components/Nav/Nav';
import { Hero } from '../components/Hero/Hero';
import { LogoTicker } from '../components/LogoTicker/LogoTicker';
import { AboutV3 } from '../components/AboutV3/AboutV3';
import { WorkShowcase } from '../components/WorkShowcase/WorkShowcase';
import { WhatWeOffer } from '../components/WhatWeOffer/WhatWeOffer';
import { FAQ } from '../components/FAQ/FAQ';
import { Footer } from '../components/Footer/Footer';

// Persist across remounts — loading only happens once per session
let hasLoadedOnce = false;

export default function Home() {
  const isReturnVisit = hasLoadedOnce;
  const [loading, setLoading] = useState(!isReturnVisit);
  const [heroReady, setHeroReady] = useState(isReturnVisit);

  const handleTextPositioned = useCallback(() => {
    setHeroReady(true);
    hasLoadedOnce = true;
  }, []);

  const handleLoadingComplete = useCallback(() => {
    setLoading(false);
    hasLoadedOnce = true;
  }, []);

  const wrapperRef = useRef<HTMLDivElement>(null);

  // Keep scroll locked until hero animations complete (first load only)
  useEffect(() => {
    if (isReturnVisit) return;

    let timer: ReturnType<typeof setTimeout> | undefined;

    if (!heroReady) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.inset = '0';
      document.body.style.width = '100%';
    } else {
      timer = setTimeout(() => {
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.inset = '';
        document.body.style.width = '';
      }, 1000);
    }

    return () => {
      if (timer) clearTimeout(timer);
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.inset = '';
      document.body.style.width = '';
    };
  }, [heroReady]);

  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ['start start', '30% start'],
  });
  const tickerY = useTransform(scrollYProgress, [0, 1], [0, -60]);

  return (
    <>
      {loading && (
        <LoadingScreen
          onTextPositioned={handleTextPositioned}
          onComplete={handleLoadingComplete}
        />
      )}
      <div
        ref={wrapperRef}
        className="page-wrapper"
        style={{ position: 'relative', overflowX: 'clip' as const, background: 'var(--bg)' }}
      >
        <Nav introComplete={heroReady} />
        <Hero introComplete={heroReady} />
        <motion.div style={{ y: tickerY, position: 'relative' as const, zIndex: 2 }}>
          <LogoTicker />
        </motion.div>
        <AboutV3 />
      </div>
      <WorkShowcase />
      <WhatWeOffer />
      <FAQ />
      <Footer />
    </>
  );
}
