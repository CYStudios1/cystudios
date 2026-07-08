import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { SectionLabel } from '../shared/SectionLabel';
import { navigateWithTransition } from '../../App';
import styles from './WhatWeOffer.module.css';

const ease = [0.16, 1, 0.3, 1] as const;

const fade = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.12, ease },
  }),
};

export function WhatWeOffer() {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  // Cards float up slightly slower than the page scrolls
  const cardsY = useTransform(scrollYProgress, [0, 1], [30, -30]);

  return (
    <section ref={sectionRef} className={styles.section} id="offers">
      {/* Header */}
      <motion.div
        className={styles.header}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <SectionLabel>What We Offer</SectionLabel>
        <h2>Ways to work with us.</h2>
        <p>
          Start with a website, grow on social, or bundle both. Simple pricing,
          no hidden fees, no contracts.
        </p>
      </motion.div>

      {/* Cards */}
      <motion.div className={styles.cardsGrid} style={{ y: cardsY }}>
        {/* Card 1 — Website */}
        <motion.div
          className={styles.cardWrapper}
          custom={0}
          variants={fade}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}

        >
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <p className={styles.cardTitle}>Website</p>
            <p className={styles.cardPrice}>
              <span className={styles.cardPricePrefix}>from </span>
              <span className="font-inter">1,500</span>
            </p>
          </div>
          <p className={styles.cardDesc}>
            A custom, bilingual site your customers find first. Built to bring
            in orders, not just look good.
          </p>
          <ul className={styles.checkList}>
            <li className={styles.checkItem}>
              <span className={styles.checkMark}>&#10003;</span>
              Custom 5–8 page builds, mobile-first
            </li>
            <li className={styles.checkItem}>
              <span className={styles.checkMark}>&#10003;</span>
              Bilingual English / Korean
            </li>
            <li className={styles.checkItem}>
              <span className={styles.checkMark}>&#10003;</span>
              Online ordering ready
            </li>
          </ul>
          <hr className={styles.divider} />
          <p className={styles.cardNote}>
            Includes a Care plan to keep it live, from <span className="font-inter">99</span>/mo.
          </p>
          <a className={styles.cardLink} href="/pricing" onClick={(e) => { e.preventDefault(); navigateWithTransition('/pricing'); }}>
            See website plans &rarr;
          </a>
        </div>
        </motion.div>

        {/* Card 2 — Social */}
        <motion.div
          className={styles.cardWrapper}
          custom={1}
          variants={fade}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}

        >
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <p className={styles.cardTitle}>Social</p>
            <p className={styles.cardPrice}>
              <span className={styles.cardPricePrefix}>from </span>
              <span className="font-inter">700</span>
              <span className={styles.cardPricePrefix}>/mo</span>
            </p>
          </div>
          <p className={styles.cardDesc}>
            We turn your shop into short-form content. You film simple clips on
            your phone; we do the rest.
          </p>
          <ul className={styles.checkList}>
            <li className={styles.checkItem}>
              <span className={styles.checkMark}>&#10003;</span>
              ~8–12 short-form videos a month
            </li>
            <li className={styles.checkItem}>
              <span className={styles.checkMark}>&#10003;</span>
              Editing, graphics, captions EN &amp; KR
            </li>
            <li className={styles.checkItem}>
              <span className={styles.checkMark}>&#10003;</span>
              Posting + engagement, done for you
            </li>
          </ul>
          <hr className={styles.divider} />
          <p className={styles.cardNote}>
            One-time Social Setup (<span className="font-inter">500</span>) gets you ready.
          </p>
          <a className={styles.cardLink} href="/pricing" onClick={(e) => { e.preventDefault(); navigateWithTransition('/pricing'); }}>
            See social plans &rarr;
          </a>
        </div>
        </motion.div>

        {/* Card 3 — Bundle */}
        <motion.div
          className={styles.cardWrapper}
          custom={2}
          variants={fade}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
        <div className={styles.bundleGlow}>
          <div className={styles.bundleBeam} />
        </div>
        <div className={styles.card}>
          <span className={styles.bestValue}>BEST VALUE</span>
          <div className={styles.cardHeader}>
            <p className={styles.cardTitle}>Bundle</p>
            <p className={styles.cardPrice}>Website + Social</p>
          </div>
          <p className={styles.cardDesc}>
            The full get-found package, for less.
          </p>
          <ul className={styles.checkList}>
            <li className={styles.checkItem}>
              <span className={styles.checkMark}>&#10003;</span>
              500 Social Setup waived
            </li>
            <li className={styles.checkItem}>
              <span className={styles.checkMark}>&#10003;</span>
              First month of Care free
            </li>
          </ul>
          <hr className={styles.divider} />
          <p className={styles.cardNote}>
            Save on setup + first month Care when you bundle.
          </p>
          <a className={styles.cardLink} href="/pricing" onClick={(e) => { e.preventDefault(); navigateWithTransition('/pricing'); }}>
            Build a bundle &rarr;
          </a>
        </div>
        </motion.div>
      </motion.div>

    </section>
  );
}
