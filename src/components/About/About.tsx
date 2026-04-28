import { motion } from 'framer-motion';
import { SectionLabel } from '../shared/SectionLabel';
import { useTranslation } from '../shared/useTranslation';
import s from './About.module.css';

export function About() {
  const { t } = useTranslation();

  return (
    <motion.div
      id="about"
      className={s.about}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <div className={s.aboutInner}>
        <SectionLabel>{t('Who We Are')}</SectionLabel>
        <h2 className={s.headline}>
          {t('Two designers who got tired of the agency grind.')}
        </h2>
        <p className={s.body}>
          {t(
            "We started CY Studios because we saw the same story play out — talented brands stuck in a queue of 40+ clients, getting templated work and distracted attention. We believe every brand deserves a team that's fully locked in."
          )}
        </p>
        <div className={s.founders}>
          <div className={s.founder}>
            <div className={s.photo} />
            <div className={s.name}>David</div>
            <div className={s.role}>{t('Design & Strategy')}</div>
            <div className={s.bio}>
              {t(
                'Obsessed with craft. Believes every pixel tells a story — makes sure yours tells the right one.'
              )}
            </div>
          </div>
          <div className={s.divider} />
          <div className={s.founder}>
            <div className={s.photo} />
            <div className={s.name}>Colin</div>
            <div className={s.role}>{t('Development & Growth')}</div>
            <div className={s.bio}>
              {t(
                "Turns vision into performance. Builds brands that don't just look good — they grow."
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
