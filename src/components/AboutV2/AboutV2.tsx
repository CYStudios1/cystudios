import { motion } from 'framer-motion';
import { SectionLabel } from '../shared/SectionLabel';
import { useTranslation } from '../shared/useTranslation';
import s from './AboutV2.module.css';

const fadeIn = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 1, ease: [0.16, 1, 0.3, 1] as const },
};

export function AboutV2() {
  const { t } = useTranslation();

  return (
    <motion.div
      id="about-v2"
      className={s.about}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
    >
      <div className={s.inner}>
        <div className={s.left}>
          <SectionLabel>{t('Who We Are')}</SectionLabel>
          <h2 className={s.headline}>
            {t('Two designers who got tired of the agency grind.')}
          </h2>
          <p className={s.body}>
            {t(
              "We started CY Studios because we saw the same story play out — talented brands stuck in a queue of 40+ clients, getting templated work and distracted attention. We believe every brand deserves a team that's fully locked in."
            )}
          </p>
        </div>

        <div className={s.right}>
          <motion.div className={s.founder} {...fadeIn} viewport={{ once: true }}>
            <div className={s.photo}>
              <img src="/photo-colin.jpg" alt="Colin" className={s.photoImg} />
            </div>
            <div className={s.info}>
              <div className={s.name}>Colin</div>
              <div className={s.role}>{t('Development & Growth')}</div>
              <div className={s.bio}>
                {t("Turns vision into performance. Builds brands that don't just look good — they grow.")}
              </div>
            </div>
          </motion.div>

          <motion.div className={s.founder} {...fadeIn} viewport={{ once: true }} transition={{ ...fadeIn.transition, delay: 0.15 }}>
            <div className={s.photo}>
              <img src="/photo-david.jpg" alt="David" className={s.photoImg} />
            </div>
            <div className={s.info}>
              <div className={s.name}>David</div>
              <div className={s.role}>{t('Design & Strategy')}</div>
              <div className={s.bio}>
                {t('Obsessed with craft. Believes every pixel tells a story — makes sure yours tells the right one.')}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
