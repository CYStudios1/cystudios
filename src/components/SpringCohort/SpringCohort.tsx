import styles from './SpringCohort.module.css';
import { SectionLabel } from '../shared/SectionLabel';
import { useTranslation } from '../shared/useTranslation';

const projects = [
  { bg: styles.bg1, img: '/desktop-2.png', num: '01', name: 'Burg\u0026Shaw', vertLabel: 'Burg\u0026Shaw', desc: 'Premium barbershop rebrand & website \u2014 a full identity overhaul that matches their craft.' },
  { bg: styles.bg2, img: '/desktop-3.png', num: '02', name: 'Nakwon Catering', vertLabel: 'Nakwon Catering', desc: 'Korean catering service \u2014 site & branding that honors tradition while feeling fresh.' },
  { bg: styles.bg3, img: '/desktop-1.png', num: '03', name: 'PJ Beauty Supply', vertLabel: 'PJ Beauty Supply', desc: 'Beauty supply e-commerce & digital presence \u2014 bringing a local favorite online.' },
];

export function SpringCohort() {
  const { t } = useTranslation();
  return (
    <>
      <div id="cohorts" className={styles.headerOuter}>
        <div className={styles.header}>
          <SectionLabel>{t('Spring Cohort')}</SectionLabel>
          <h2 className={styles.headline}>{t('Work that speaks for itself.')}</h2>
        </div>
      </div>
      <div className={styles.cohortWrap}>
        <div className={styles.accordion}>
          {projects.map(p => (
            <div key={p.num} className={styles.accItem}>
              <div className={`${styles.accBg} ${p.bg}`} />
              <div className={styles.accScreen}>
                <img src={p.img} alt={p.name} />
              </div>
              <div className={styles.accLabelVert}>{p.vertLabel}</div>
              <div className={styles.accInfo}>
                <div className={styles.accNum}>{p.num}</div>
                <div className={styles.accName}>{p.name}</div>
                <div className={styles.accDesc}>{t(p.desc)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
