import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import styles from './Nav.module.css';
import { Button } from '../shared/Button';
import { useTranslation } from '../shared/useTranslation';
import { CYLogo } from './CYLogo';
import { navigateWithTransition } from '../../App';

interface NavProps {
  introComplete?: boolean;
}

export function Nav({ introComplete = false }: NavProps) {
  const { t, isKorean, toggleLang } = useTranslation();
  const location = useLocation();

  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, hash: string) => {
    e.preventDefault();
    if (location.pathname === '/') {
      // Already on home — just scroll to the section
      const el = document.querySelector(hash);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else {
      // Navigate home, then scroll after transition
      navigateWithTransition('/');
      setTimeout(() => {
        const el = document.querySelector(hash);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 1400); // wait for transition to complete
    }
  };

  return (
    <motion.nav
      className={styles.nav}
      initial={{ opacity: 0, y: -10 }}
      animate={introComplete ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
    >
      <a href="/" className={styles.logo} onClick={(e) => { e.preventDefault(); navigateWithTransition('/'); }}>
        <CYLogo />
        CY Studios
      </a>
      <div className={styles.navLinks}>
        <a href="#about-v3" onClick={(e) => handleAnchorClick(e, '#about-v3')}>{t('About')}</a>
        <a href="#works" onClick={(e) => handleAnchorClick(e, '#works')}>{t('Works')}</a>
        <a href="/pricing" onClick={(e) => { e.preventDefault(); navigateWithTransition('/pricing'); }}>{t('Pricing')}</a>
        <a href="#faq" onClick={(e) => handleAnchorClick(e, '#faq')}>{t('FAQ')}</a>
      </div>
      <div className={styles.navRight}>
        <button className={styles.langToggle} onClick={toggleLang}>
          {isKorean ? 'EN' : 'KR'}
        </button>
        <Button size="sm" dataEn="Book a Consultation" dataKr="상담 예약하기" href="https://calendly.com/design-cy-studios/30min">
          {t('Book a Consultation')}
        </Button>
      </div>
    </motion.nav>
  );
}
