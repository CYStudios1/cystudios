import { motion } from 'framer-motion';
import styles from './Footer.module.css';
import { GooeyButton } from '../shared/GooeyButton';
import { useTranslation } from '../shared/useTranslation';
import Threads from '../Hero/Threads';
import { CYLogo } from '../Nav/CYLogo';

const colContainer = {
  initial: {},
  whileInView: {},
  transition: { staggerChildren: 0.1 },
};

const colItem = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 1, ease: [0.16, 1, 0.3, 1] },
};

export function Footer() {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
    >
    <footer className={styles.footer}>
      {/* CTA Banner */}
      <div className={styles.ctaBanner}>
        <div className={styles.threadsLayer}>
          <Threads
            color={[0.55, 0.65, 0.80]}
            amplitude={0.8}
            distance={1.2}
            enableMouseInteraction={true}
          />
        </div>
        <div className={styles.ctaInner}>
          <div className={styles.ctaText}>{t('Ready to build something intentional?')}</div>
          <div className={styles.ctaSub}>{t('Book a free consultation. No pressure, just a conversation about your brand.')}</div>
          <GooeyButton href="https://calendly.com/design-cy-studios/30min">{t('Book a Consultation')}</GooeyButton>
        </div>
      </div>

      {/* Four Columns */}
      <motion.div
        className={styles.cols}
        variants={colContainer}
        initial="initial"
        whileInView="whileInView"
        viewport={{ once: true, margin: '-80px' }}
      >
        <motion.div variants={colItem}>
          <div className={styles.logo}><CYLogo /> {t('CY Studios')}</div>
          <div className={styles.brandText}>{t('A boutique creative agency building brands with intention. One cohort at a time.')}</div>
        </motion.div>
        <motion.div variants={colItem}>
          <div className={styles.colTitle}>{t('Navigate')}</div>
          <div className={styles.colLinks}>
            <a href="#services" className={styles.colLink}>{t('Services')}</a>
            <a href="#about" className={styles.colLink}>{t('About')}</a>
            <a href="#cohorts" className={styles.colLink}>{t('Cohorts')}</a>
            <a href="#pricing" className={styles.colLink}>{t('Pricing')}</a>
            <a href="#faq" className={styles.colLink}>{t('FAQ')}</a>
          </div>
        </motion.div>
        <motion.div variants={colItem}>
          <div className={styles.colTitle}>{t('Services')}</div>
          <div className={styles.colLinks}>
            <a href="#" className={styles.colLink}>{t('Website Design')}</a>
            <a href="#" className={styles.colLink}>{t('Social Media')}</a>
            <a href="#" className={styles.colLink}>{t('SEO')}</a>
            <a href="#" className={styles.colLink}>{t('GenAI Marketing')}</a>
          </div>
        </motion.div>
        <motion.div variants={colItem}>
          <div className={styles.colTitle}>{t('Contact')}</div>
          <div className={styles.colLinks}>
            <a href="mailto:design@cy-studios.com" className={styles.colLink}>design@cy-studios.com</a>
            <a href="#" className={styles.colLink}>{t('Instagram')}</a>
            <a href="#" className={styles.colLink}>{t('LinkedIn')}</a>
            <a href="#" className={styles.colLink}>{t('Twitter / X')}</a>
          </div>
        </motion.div>
      </motion.div>

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
