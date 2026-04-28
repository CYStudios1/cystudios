import { motion } from 'framer-motion';
import styles from './Footer.module.css';
import { Button } from '../shared/Button';
import { useTranslation } from '../shared/useTranslation';

export function Footer() {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
    >
    <footer className={styles.footer}>
      {/* CTA Banner */}
      <div className={styles.ctaBanner}>
        <div className={styles.ctaInner}>
          <div>
            <div className={styles.ctaText}>{t('Ready to build something intentional?')}</div>
            <div className={styles.ctaSub}>{t('Book a free consultation — no pressure, just a conversation about your brand.')}</div>
          </div>
          <Button>{t('Book a Consultation →')}</Button>
        </div>
      </div>

      {/* Four Columns */}
      <div className={styles.cols}>
        <div>
          <div className={styles.logo}>{t('CY Studios')}</div>
          <div className={styles.brandText}>{t('A boutique creative agency building brands with intention — one cohort at a time.')}</div>
        </div>
        <div>
          <div className={styles.colTitle}>{t('Navigate')}</div>
          <div className={styles.colLinks}>
            <a href="#services" className={styles.colLink}>{t('Services')}</a>
            <a href="#about" className={styles.colLink}>{t('About')}</a>
            <a href="#cohorts" className={styles.colLink}>{t('Cohorts')}</a>
            <a href="#pricing" className={styles.colLink}>{t('Pricing')}</a>
            <a href="#faq" className={styles.colLink}>{t('FAQ')}</a>
          </div>
        </div>
        <div>
          <div className={styles.colTitle}>{t('Services')}</div>
          <div className={styles.colLinks}>
            <a href="#" className={styles.colLink}>{t('Website Design')}</a>
            <a href="#" className={styles.colLink}>{t('Social Media')}</a>
            <a href="#" className={styles.colLink}>{t('SEO')}</a>
            <a href="#" className={styles.colLink}>{t('GenAI Marketing')}</a>
          </div>
        </div>
        <div>
          <div className={styles.colTitle}>{t('Contact')}</div>
          <div className={styles.colLinks}>
            <a href="mailto:design@cy-studios.com" className={styles.colLink}>design@cy-studios.com</a>
            <a href="#" className={styles.colLink}>{t('Instagram')}</a>
            <a href="#" className={styles.colLink}>{t('LinkedIn')}</a>
            <a href="#" className={styles.colLink}>{t('Twitter / X')}</a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className={styles.bottom}>
        <div className={styles.copy}>{t('© 2026 CY Studios. All rights reserved.')}</div>
        <div className={styles.socials}>
          <a href="#" className={styles.social} aria-label="Instagram">IG</a>
          <a href="#" className={styles.social} aria-label="LinkedIn">LI</a>
          <a href="#" className={styles.social} aria-label="Twitter / X">X</a>
        </div>
      </div>
    </footer>
    </motion.div>
  );
}
