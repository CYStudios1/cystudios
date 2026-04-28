import { useState } from 'react';
import { motion } from 'framer-motion';
import styles from './FAQ.module.css';
import { SectionLabel } from '../shared/SectionLabel';
import { useTranslation } from '../shared/useTranslation';

const faqData = [
  {
    q: 'What does the cohort model mean for my project?',
    a: 'It means we only take on three clients at a time. Your project gets our full creative energy — no context-switching, no waiting in a queue.',
  },
  {
    q: 'How long does a typical project take?',
    a: 'Most projects run 4–8 weeks depending on scope. Standard packages are typically 4–5 weeks, Growth runs 6–7 weeks, and Scale projects can take up to 8 weeks.',
  },
  {
    q: 'Do you work with clients outside your area?',
    a: "Absolutely. Everything we do is remote-friendly. We've worked with brands across the country.",
  },
  {
    q: 'What if I need changes after launch?',
    a: 'Every package includes post-launch support (30–90 days depending on your plan). After that, we offer maintenance retainers.',
  },
  {
    q: 'Can I upgrade my package after we start?',
    a: "Yes — we can adjust scope and pricing mid-project. We're flexible.",
  },
  {
    q: 'What do I need to have ready before we start?',
    a: 'Just a clear idea of what your brand does and who it serves. We handle the rest — content strategy, copy direction, design, and development.',
  },
];

export function FAQ() {
  const { t } = useTranslation();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (i: number) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  return (
    <motion.div
      id="faq"
      className={styles.faq}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <div className={styles.inner}>
        <div className={styles.left}>
          <SectionLabel>{t('FAQ')}</SectionLabel>
          <h2 className={styles.headline}>
            {t('Questions we')}<br />
            {t('get asked a lot.')}
          </h2>
          <div className={styles.cta}>
            <div className={styles.ctaText}>{t('Still have questions?')}</div>
            <a href="#" className={styles.ctaLink}>{t('Book a Consultation →')}</a>
          </div>
        </div>

        <div className={styles.items}>
          {faqData.map((item, i) => (
            <div
              key={i}
              className={`${styles.item} ${openIndex === i ? styles.itemOpen : ''}`}
            >
              <div className={styles.question} onClick={() => toggle(i)}>
                <div className={styles.qText}>{t(item.q)}</div>
                <div className={styles.toggle}>+</div>
              </div>
              <div className={styles.answer}>
                <div className={styles.aText}>{t(item.a)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
