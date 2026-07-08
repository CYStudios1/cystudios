import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { LanguageProvider } from './context/LanguageContext';
import { SmoothScroll } from './components/shared/SmoothScroll';
import { Vignette } from './components/shared/Vignette';
import { LoadingScreen } from './components/LoadingScreen/LoadingScreen';
import { Nav } from './components/Nav/Nav';
import { Hero } from './components/Hero/Hero';
import { LogoTicker } from './components/LogoTicker/LogoTicker';
import { AboutV3 } from './components/AboutV3/AboutV3';
import { WorkShowcase } from './components/WorkShowcase/WorkShowcase';
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
  const tickerY = useTransform(scrollYProgress, [0, 1], [0, -60]);

  // TEMPORARY: color picker for secondary accent
  const colors = [
    { name: 'Amber', hex: '#D4A574' },
    { name: 'Terra Cotta', hex: '#C4956A' },
    { name: 'Sandy Gold', hex: '#B8945F' },
    { name: 'Sage', hex: '#5B8A72' },
    { name: 'Eucalyptus', hex: '#6B9E8A' },
    { name: 'Deep Forest', hex: '#4A7A6A' },
    { name: 'Dusty Blue', hex: '#5E7D99' },
    { name: 'Soft Steel', hex: '#7A9BB5' },
    { name: 'Navy Slate', hex: '#4E6E85' },
    { name: 'Warm Taupe', hex: '#8C7B6B' },
    { name: 'Mocha', hex: '#7A6E63' },
    { name: 'Light Taupe', hex: '#9B8E82' },
  ];

  return (
    <LanguageProvider>
      <SmoothScroll />
      <Vignette />
      {/* TEMPORARY: remove after picking a color */}
      <div style={{
        position: 'fixed', bottom: 20, right: 20, zIndex: 99999,
        background: '#fff', borderRadius: 12, padding: 16,
        boxShadow: '0 4px 24px rgba(0,0,0,0.15)', maxWidth: 220,
        fontFamily: 'Raleway, sans-serif',
      }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase' as const, color: '#5A4E44', marginBottom: 10 }}>
          Secondary Color
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 6 }}>
          {colors.map(c => (
            <button
              key={c.hex}
              title={c.name}
              onClick={() => document.documentElement.style.setProperty('--accent-secondary', c.hex)}
              style={{
                width: 28, height: 28, borderRadius: '50%', border: '2px solid #eee',
                background: c.hex, cursor: 'pointer', transition: 'transform 0.15s',
              }}
              onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.2)')}
              onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
            />
          ))}
        </div>
        <button
          onClick={() => document.documentElement.style.removeProperty('--accent-secondary')}
          style={{
            marginTop: 10, fontSize: 11, color: '#5A4E44', background: 'none',
            border: '1px solid #ddd', borderRadius: 6, padding: '4px 10px', width: '100%',
          }}
        >
          Reset
        </button>
      </div>
      {loading && <LoadingScreen onTextPositioned={handleTextPositioned} onComplete={handleLoadingComplete} />}
      <div ref={wrapperRef} className="page-wrapper" style={{ position: 'relative', overflowX: 'clip' as const, background: 'var(--bg)' }}>
        {/* ArcBackground removed */}
        <Nav introComplete={heroReady} />
        <Hero introComplete={heroReady} />
        <motion.div style={{ y: tickerY, position: 'relative' as const, zIndex: 2 }}>
          <LogoTicker />
        </motion.div>
        <AboutV3 />
      </div>
      <WorkShowcase />
      <Pricing />
      <FAQ />
      <Footer />
    </LanguageProvider>
  );
}

export default App;
