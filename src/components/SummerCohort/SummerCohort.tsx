import { motion } from 'framer-motion';
import styles from './SummerCohort.module.css';
import { SectionLabel } from '../shared/SectionLabel';
import { Button } from '../shared/Button';
import { useTranslation } from '../shared/useTranslation';

const slots = [
  { num: '1', text: 'Looking for a brand ready to invest in a website that actually converts.' },
  { num: '2', text: 'Looking for a business that needs a complete digital presence — site, social, SEO.' },
  { num: '3', text: 'Looking for a founder who wants to build something intentional from the ground up.' },
];

export function SummerCohort() {
  const { t } = useTranslation();

  return (
    <motion.div
      className={styles.summer}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <div className={styles.inner}>
        <div className={styles.header}>
          <SectionLabel>{t('Summer Cohort — Now Booking')}</SectionLabel>
          <h2 className={styles.headline}>
            {t('Three spots. Three brands.')}<br />
            {t('Fully locked in.')}
          </h2>
          <p className={styles.sub}>
            {t("We take on three clients per cohort so every project gets our full attention. Summer spots are open — here's who we're looking for.")}
          </p>
        </div>

        <div className={styles.slots}>
          {slots.map((slot) => (
            <div key={slot.num} className={styles.slot}>
              <div className={styles.slotNum}>{slot.num}</div>
              <div className={styles.slotStatus}>
                <span className={styles.dot} /> {t('Open')}
              </div>
              <div className={styles.slotText}>{t(slot.text)}</div>
            </div>
          ))}
        </div>

        <div className={styles.cta}>
          <Button>{t('Book a Consultation →')}</Button>
        </div>
      </div>
    </motion.div>
  );
}
