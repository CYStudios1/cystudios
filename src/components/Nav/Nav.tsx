import styles from './Nav.module.css';
import { Button } from '../shared/Button';
import { useTranslation } from '../shared/useTranslation';

export function Nav() {
  const { t, isKorean, toggleLang } = useTranslation();

  return (
    <nav className={styles.nav}>
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
    </nav>
  );
}
