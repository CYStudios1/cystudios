import { createContext, useState, type ReactNode } from 'react';

interface LanguageContextType {
  isKorean: boolean;
  toggleLang: () => void;
}

export const LanguageContext = createContext<LanguageContextType>({
  isKorean: false,
  toggleLang: () => {},
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [isKorean, setIsKorean] = useState(false);
  const toggleLang = () => setIsKorean(prev => !prev);

  return (
    <LanguageContext.Provider value={{ isKorean, toggleLang }}>
      {children}
    </LanguageContext.Provider>
  );
}
