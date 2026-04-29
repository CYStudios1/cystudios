import { motion } from 'framer-motion';
import styles from './Nav.module.css';
import { Button } from '../shared/Button';
import { useTranslation } from '../shared/useTranslation';

export function Nav() {
  const { t, isKorean, toggleLang } = useTranslation();

  return (
    <motion.nav
      className={styles.nav}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
    >
      <div className={styles.logo}>CY Studios</div>
      <div className={styles.navRight}>
        <div className={styles.navLinks}>
          <a href="#services">{t('Services')}</a>
          <a href="#about">{t('About')}</a>
          <a href="#cohorts">{t('Cohorts')}</a>
          <a href="#pricing">{t('Pricing')}</a>
          <a href="#faq">{t('FAQ')}</a>
        </div>
        <button className={styles.langToggle} onClick={toggleLang}>
          {isKorean ? 'EN' : 'KR'}
        </button>
        <Button size="sm" dataEn="Book a Consultation" dataKr="상담 예약하기">
          {t('Book a Consultation')}
        </Button>
      </div>
    </motion.nav>
  );
}
