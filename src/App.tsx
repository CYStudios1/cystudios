import { LanguageProvider } from './context/LanguageContext';
import { Nav } from './components/Nav/Nav';
import { ArcBackground } from './components/Hero/ArcBackground';
import { Hero } from './components/Hero/Hero';
import { LogoTicker } from './components/LogoTicker/LogoTicker';
import { About } from './components/About/About';

function App() {
  return (
    <LanguageProvider>
      <div className="page-wrapper" style={{ position: 'relative', overflowX: 'clip' as const, background: 'var(--bg)' }}>
        <ArcBackground />
        <Nav />
        <Hero />
        <LogoTicker />
        <About />
      </div>
    </LanguageProvider>
  );
}

export default App;
