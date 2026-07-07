import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { SectionLabel } from '../shared/SectionLabel';
import { useTranslation } from '../shared/useTranslation';
import s from './AboutV3.module.css';

const fadeIn = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 1, ease: [0.16, 1, 0.3, 1] as const },
};

export function AboutV3() {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  // Rings move at a different rate than the photos — subtle parallax
  const ring1Y = useTransform(scrollYProgress, [0, 1], [8, -8]);
  const ring2Y = useTransform(scrollYProgress, [0, 1], [6, -10]);

  return (
    <motion.section
      ref={sectionRef}
      id="about-v3"
      className={s.about}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
    >
      <div className={s.header}>
        <SectionLabel>{t('Who We Are')}</SectionLabel>
        <h2 className={s.headline}>
          {t('Two designers who got tired of the agency grind.')}
        </h2>
      </div>

      <div className={s.content}>
        <motion.div className={s.right} {...fadeIn} viewport={{ once: true }}>
          <div className={s.bodyLabel}>{t('Our Story')}</div>
          <p className={s.body}>
            {t(
              "We started CY Studios because we saw the same story play out. Talented brands stuck in a queue of 40+ clients, getting templated work and distracted attention. We believe every brand deserves a team that's fully locked in."
            )}
          </p>
        </motion.div>

        <motion.div className={s.left} {...fadeIn} viewport={{ once: true }} transition={{ ...fadeIn.transition, delay: 0.15 }}>
          <div className={s.photos}>
            <div className={s.photoWrap}>
              <motion.div className={s.ring} style={{ y: ring1Y }} />
              <div className={s.coin}>
                <div className={s.coinFront}>
                  <div className={s.photo}>
                    <img src="/photo-david.jpg" alt="David" className={s.photoImg} />
                  </div>
                </div>
                <div className={s.coinBack}>
                  <div className={s.quoteCard}>
                    <span className={s.quoteMark}>&ldquo;</span>
                    Be curious, not judgmental.
                    <span className={s.quoteMark}>&rdquo;</span>
                  </div>
                </div>
              </div>
            </div>
            <div className={s.photoWrap}>
              <motion.div className={s.ring} style={{ y: ring2Y }} />
              <div className={s.coin}>
                <div className={s.coinFront}>
                  <div className={s.photo}>
                    <img src="/photo-colin.jpg" alt="Colin" className={s.photoImg} />
                  </div>
                </div>
                <div className={s.coinBack}>
                  <div className={s.quoteCard}>
                    <span className={s.quoteMark}>&ldquo;</span>
                    If you don&apos;t care about what you&apos;re selling, people won&apos;t care about what they&apos;re buying.
                    <span className={s.quoteMark}>&rdquo;</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={s.names}>
            <div className={s.nameBlock}>
              <div className={s.name}>David</div>
              <div className={s.role}>{t('Design & Strategy')}</div>
            </div>
            <div className={s.nameBlock}>
              <div className={s.name}>Colin</div>
              <div className={s.role}>{t('Development & Growth')}</div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
