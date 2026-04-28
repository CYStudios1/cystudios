import { motion } from 'framer-motion';
import styles from './Hero.module.css';
import { Button } from '../shared/Button';
import { useTranslation } from '../shared/useTranslation';
import { DeviceMockup } from './DeviceMockup';

const heroContainer = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { staggerChildren: 0.15, delayChildren: 0.3 },
};

const heroChild = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] },
};

export function Hero() {
  const { t, isKorean } = useTranslation();

  return (
    <section className={styles.heroSection}>
      <div className={styles.heroBody}>
        <motion.div
          className={styles.heroContent}
          variants={heroContainer}
          initial="initial"
          animate="animate"
        >
          <motion.div variants={heroChild} className={styles.heroPill}>
            <span className={styles.pillDot} />
            {t('Now Booking — Summer Cohort')}
          </motion.div>
          <motion.h1
            variants={heroChild}
            className={styles.heroHeadline}
            dangerouslySetInnerHTML={{
              __html: isKorean
                ? t('heroHeadlineHtml')
                : 'Your brand,<br>built with<br>intention.',
            }}
          />
          <motion.p variants={heroChild} className={styles.heroSub}>
            {t('CY Studios is a boutique creative agency taking clients in cohorts — so every brand gets the attention it deserves.')}
          </motion.p>
          <motion.div variants={heroChild}>
            <Button dataEn="Book a Consultation →" dataKr="상담 예약하기 →">
              {t('Book a Consultation →')}
            </Button>
          </motion.div>
        </motion.div>
        <motion.div
          className={styles.deviceSide}
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1], delay: 0.5 }}
        >
          <DeviceMockup />
        </motion.div>
      </div>
    </section>
  );
}
