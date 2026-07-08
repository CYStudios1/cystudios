import { useEffect, useState, useRef, useCallback } from 'react';
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { SmoothScroll } from './components/shared/SmoothScroll';
import { Vignette } from './components/shared/Vignette';
import Home from './pages/Home';
import PricingPage from './pages/PricingPage';
import './page-transition.css';

// Context-free navigation with gooey transition
let triggerTransition: ((to: string) => void) | null = null;

export function navigateWithTransition(to: string) {
  if (triggerTransition) triggerTransition(to);
}

function PageTransition() {
  const location = useLocation();
  const navigate = useNavigate();
  const [phase, setPhase] = useState<'idle' | 'cover' | 'reveal'>('idle');
  const pendingPath = useRef<string | null>(null);
  const isFirstRender = useRef(true);

  // Skip transition on first render (loading screen handles that)
  useEffect(() => {
    isFirstRender.current = false;
  }, []);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [location.pathname]);

  const startTransition = useCallback((to: string) => {
    if (to === location.pathname || phase !== 'idle') return;
    pendingPath.current = to;
    setPhase('cover');
  }, [location.pathname, phase]);

  // Register the global trigger
  useEffect(() => {
    triggerTransition = startTransition;
    return () => { triggerTransition = null; };
  }, [startTransition]);

  // When cover animation ends, swap the page
  const handleCoverEnd = useCallback(() => {
    if (phase === 'cover' && pendingPath.current) {
      navigate(pendingPath.current);
      pendingPath.current = null;
      // Small delay for the page to render before revealing
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setPhase('reveal');
        });
      });
    }
  }, [phase, navigate]);

  // When reveal animation ends, go back to idle
  const handleRevealEnd = useCallback(() => {
    if (phase === 'reveal') {
      setPhase('idle');
    }
  }, [phase]);

  if (phase === 'idle') return null;

  return (
    <div
      className={`page-transition-overlay ${phase === 'cover' ? 'covering' : 'revealing'}`}
      onAnimationEnd={phase === 'cover' ? handleCoverEnd : handleRevealEnd}
    >
      {/* SVG gooey filter for liquid edges */}
      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <defs>
          <filter id="gooey-transition">
            <feGaussianBlur in="SourceGraphic" stdDeviation="20" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 30 -12"
              result="gooey"
            />
          </filter>
        </defs>
      </svg>
      <div className="page-transition-blobs">
        <div className="page-transition-blob blob-1" />
        <div className="page-transition-blob blob-2" />
        <div className="page-transition-blob blob-3" />
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <PageTransition />
      <LanguageProvider>
        <SmoothScroll />
        <Vignette />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pricing" element={<PricingPage />} />
        </Routes>
      </LanguageProvider>
    </BrowserRouter>
  );
}

export default App;
