import { motion } from 'framer-motion';
import { SectionLabel } from '../shared/SectionLabel';
import { useTranslation } from '../shared/useTranslation';
import DomeGallery from './DomeGallery';
import s from './Gallery.module.css';

export function Gallery() {
  const { t } = useTranslation();

  return (
    <motion.section
      id="work"
      className={s.gallery}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
    >
      <div className={s.header}>
        <SectionLabel>{t('Our Work')}</SectionLabel>
        <h2 className={s.headline}>{t('Built with intention.')}</h2>
        <p className={s.subtext}>
          {t('A look at the brands we\'ve brought to life.')}
        </p>
      </div>
      <div className={s.domeWrap}>
        <DomeGallery
          overlayBlurColor="#FAFAFA"
          grayscale={false}
          fit={0.28}
          minRadius={220}
          segments={14}
          dragDampening={1}
          maxVerticalRotationDeg={15}
          imageBorderRadius="12px"
          openedImageBorderRadius="16px"
        />
      </div>
    </motion.section>
  );
}
