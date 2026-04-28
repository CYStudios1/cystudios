import { LanguageProvider } from './context/LanguageContext';
import { Nav } from './components/Nav/Nav';

function App() {
  return (
    <LanguageProvider>
      <div className="page-wrapper" style={{ position: 'relative', overflowX: 'clip' as const, background: 'var(--bg)' }}>
        <Nav />
      </div>
    </LanguageProvider>
  );
}

export default App;
