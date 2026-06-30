import { motion } from 'framer-motion';
import { SectionLabel } from '../shared/SectionLabel';
import { useTranslation } from '../shared/useTranslation';
import s from './AboutV3.module.css';

const fadeIn = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 1, ease: [0.16, 1, 0.3, 1] },
};

export function AboutV3() {
  const { t } = useTranslation();

  return (
    <motion.section
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
              "We started CY Studios because we saw the same story play out — talented brands stuck in a queue of 40+ clients, getting templated work and distracted attention. We believe every brand deserves a team that's fully locked in."
            )}
          </p>
        </motion.div>

        <motion.div className={s.left} {...fadeIn} viewport={{ once: true }} transition={{ ...fadeIn.transition, delay: 0.15 }}>
          <div className={s.photos}>
            <div className={s.photoWrap}>
              <div className={s.photo}>
                <img src="/photo-david.jpg" alt="David" className={s.photoImg} />
              </div>
            </div>
            <div className={s.photoWrap}>
              <div className={s.photo}>
                <img src="/photo-colin.jpg" alt="Colin" className={s.photoImg} />
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
