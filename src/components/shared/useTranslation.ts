import { useContext } from 'react';
import { LanguageContext } from '../../context/LanguageContext';
import { translations } from '../../data/translations';

export function useTranslation() {
  const { isKorean, toggleLang } = useContext(LanguageContext);

  function t(english: string): string {
    if (!isKorean) return english;
    return translations[english] ?? english;
  }

  return { t, isKorean, toggleLang };
}
