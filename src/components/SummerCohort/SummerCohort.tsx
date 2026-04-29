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

const slotContainer = {
  initial: {},
  whileInView: {},
  transition: { staggerChildren: 0.12 },
};

const slotCard = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 1, ease: [0.16, 1, 0.3, 1] },
};

export function SummerCohort() {
  const { t } = useTranslation();

  return (
    <motion.div
      className={styles.summer}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
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

        <motion.div
          className={styles.slots}
          variants={slotContainer}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true, margin: '-80px' }}
        >
          {slots.map((slot) => (
            <motion.div key={slot.num} className={styles.slot} variants={slotCard}>
              <div className={styles.slotNum}>{slot.num}</div>
              <div className={styles.slotStatus}>
                <span className={styles.dot} /> {t('Open')}
              </div>
              <div className={styles.slotText}>{t(slot.text)}</div>
            </motion.div>
          ))}
        </motion.div>

        <div className={styles.cta}>
          <Button>{t('Book a Consultation →')}</Button>
        </div>
      </div>
    </motion.div>
  );
}
