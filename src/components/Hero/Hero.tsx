import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import styles from './Hero.module.css';
import { Button } from '../shared/Button';
import { useTranslation } from '../shared/useTranslation';
import { DeviceMockup } from './DeviceMockup';

const headlineLines = [
  'Your brand,',
  'built with',
  'intention',
];

export function Hero() {
  const { t, isKorean } = useTranslation();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 150]);

  return (
    <section ref={heroRef} className={styles.heroSection}>
      <motion.div className={styles.heroBody} style={{ y: contentY }}>
        <div className={styles.heroContent}>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.6 }}
            className={styles.heroPill}
          >
            <span className={styles.pillDot} />
            {t('Now Booking — Summer Cohort')}
          </motion.div>
          {isKorean ? (
            <motion.h1
              className={styles.heroHeadline}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.85 }}
              dangerouslySetInnerHTML={{ __html: t('heroHeadlineHtml') }}
            />
          ) : (
            <h1 className={styles.heroHeadline} style={{ position: 'relative' }}>
              {headlineLines.map((line, lineIndex) => {
                const previousChars = headlineLines.slice(0, lineIndex).reduce((sum, l) => sum + l.length, 0);
                return (
                  <span key={lineIndex} style={{ display: 'block' }}>
                    {line.split('').map((char, charIndex) => {
                      const globalIndex = previousChars + charIndex;
                      if (char === ' ') {
                        return <span key={charIndex}>&nbsp;</span>;
                      }
                      return (
                        <span key={charIndex} className={styles.headlineWord}>
                          <motion.span
                            className={styles.headlineWordInner}
                            initial={{ y: '100%' }}
                            animate={{ y: '0%' }}
                            transition={{
                              duration: 1,
                              ease: [0.16, 1, 0.3, 1],
                              delay: 0.85 + (globalIndex * 0.05),
                            }}
                          >
                            {char}
                          </motion.span>
                        </span>
                      );
                    })}
                  </span>
                );
              })}
              <div className={styles.bouncingBall} />
            </h1>
          )}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 1.1 }}
          >
            <p className={styles.heroSub}>
              {t('CY Studios is a boutique creative agency taking clients in cohorts — so every brand gets the attention it deserves.')}
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 1.35 }}
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
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 1.6 }}
        >
          <DeviceMockup />
        </motion.div>
      </motion.div>
    </section>
  );
}
