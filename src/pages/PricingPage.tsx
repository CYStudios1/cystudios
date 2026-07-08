import { useEffect } from 'react';
import { Nav } from '../components/Nav/Nav';
import { Pricing } from '../components/Pricing/Pricing';
import { Footer } from '../components/Footer/Footer';

export default function PricingPage() {
  useEffect(() => {
    // Force scroll to top — both native and Lenis
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    // Also try after a frame in case Lenis overrides
    requestAnimationFrame(() => {
      window.scrollTo(0, 0);
    });
  }, []);

  return (
    <>
      <div
        className="page-wrapper"
        style={{ position: 'relative', overflowX: 'clip' as const, background: 'var(--bg)' }}
      >
        <Nav introComplete={true} />
      </div>
      <Pricing />
      <Footer />
    </>
  );
}
