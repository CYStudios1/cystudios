import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { SectionLabel } from '../shared/SectionLabel';
import { useTranslation } from '../shared/useTranslation';
import s from './WorkShowcase.module.css';

const projects = [
  { src: '/project-3.jpg', alt: 'Burg & Shaw', href: 'https://burgshaw.com/' },
  { src: '/project-4.png', alt: 'Colorbridge', href: '#' },
  { src: '/project-2.jpg', alt: 'Beauty One Supply', href: 'https://beautyone.vercel.app/concepts/01-editorial-premium/index.html' },
  { src: '/project-1.jpg', alt: 'Nakwon Catering', href: 'http://localhost:3003' },
];

export function WorkShowcase() {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  // Slow horizontal scroll driven by vertical scroll
  const x = useTransform(scrollYProgress, [0, 1], [-100, -400]);

  return (
    <motion.section
      ref={sectionRef}
      id="works"
      className={s.section}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
    >
      <div className={s.header}>
        <SectionLabel>{t('Our Work')}</SectionLabel>
        <h2 className={s.headline}>{t('Built with intention.')}</h2>
        <p className={s.subtext}>
          {t("A look at the brands we've brought to life.")}
        </p>
      </div>

      <div className={s.scrollArea}>
        <motion.div className={s.track} style={{ x }}>
          {projects.map((item, i) => (
            <a key={i} className={s.card} href={item.href} target="_blank" rel="noopener noreferrer">
              <img src={item.src} alt={item.alt} className={s.cardImg} />
            </a>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}
