import { motion } from 'framer-motion';
import styles from './Hero.module.css';
import { Button } from '../shared/Button';
import { useTranslation } from '../shared/useTranslation';
import { DeviceMockup } from './DeviceMockup';

export function Hero() {
  const { t, isKorean } = useTranslation();

  return (
    <section className={styles.heroSection}>
      <div className={styles.heroBody}>
        <div className={styles.heroContent}>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className={styles.heroPill}
          >
            <span className={styles.pillDot} />
            {t('Now Booking — Summer Cohort')}
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          >
            <h1
              className={styles.heroHeadline}
              dangerouslySetInnerHTML={{
                __html: isKorean
                  ? t('heroHeadlineHtml')
                  : 'Your brand,<br>built with<br>intention.',
              }}
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          >
            <p className={styles.heroSub}>
              {t('CY Studios is a boutique creative agency taking clients in cohorts — so every brand gets the attention it deserves.')}
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
          >
            <Button dataEn="Book a Consultation →" dataKr="상담 예약하기 →">
              {t('Book a Consultation →')}
            </Button>
          </motion.div>
        </div>
        <motion.div
          className={styles.deviceSide}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
        >
          <DeviceMockup />
        </motion.div>
      </div>
    </section>
  );
}
