import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useEffect } from 'react';
import styles from './Hero.module.css';
import { useTranslation } from '../shared/useTranslation';

const fadeEase: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function Hero() {
  const { t, isKorean } = useTranslation();
  const sphereRef = useRef<HTMLDivElement>(null);
  const text3dRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);

  /* ── Parallax scroll — 3 layers at different speeds ── */
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const arcsY = useTransform(scrollYProgress, [0, 1], [0, 200]);     // arcs: slowest (lag behind)
  const panelsY = useTransform(scrollYProgress, [0, 1], [0, 100]);   // panels: medium
  const subY = useTransform(scrollYProgress, [0, 1], [0, 50]);       // sub+CTA: slight lag

  /* ── Draggable orbit rotation ── */
  useEffect(() => {
    const sphere = sphereRef.current;
    const text3d = text3dRef.current;
    if (!sphere || !text3d) return;

    let isDragging = false;
    let startX = 0;
    let currentRotation = 0;
    let autoRotation = 0;
    let lastTime = performance.now();
    const speed = 360 / 24; // degrees per second

    function updateRotation(totalDeg: number) {
      sphere!.style.transform = `rotateY(${totalDeg}deg)`;
      text3d!.style.transform = `translateZ(0px) rotateY(${-totalDeg}deg)`;
    }

    function autoRotate(time: number) {
      if (!isDragging) {
        const delta = (time - lastTime) / 1000;
        autoRotation += speed * delta;
        updateRotation(autoRotation + currentRotation);
      }
      lastTime = time;
      requestAnimationFrame(autoRotate);
    }
    const animId = requestAnimationFrame(autoRotate);

    const handleMouseDown = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest(`.${styles.gooeyWrap}`)) return;
      isDragging = true;
      startX = e.clientX;
      document.body.style.cursor = 'grabbing';
      e.preventDefault();
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - startX;
      currentRotation = deltaX * 0.5;
      updateRotation(autoRotation + currentRotation);
    };

    const handleMouseUp = () => {
      if (!isDragging) return;
      isDragging = false;
      autoRotation += currentRotation;
      currentRotation = 0;
      document.body.style.cursor = '';
      lastTime = performance.now();
    };

    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      cancelAnimationFrame(animId);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  const slices = Array.from({ length: 8 }, (_, i) => i);

  return (
    <section ref={heroRef} className={styles.heroSection}>
      {/* SVG gooey filter */}
      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <defs>
          <filter id="gooey">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 15 -7"
              result="gooey"
            />
            <feComposite in="SourceGraphic" in2="gooey" operator="atop" />
          </filter>
        </defs>
      </svg>

      {/* Orbit container with 3D cylinder panels — parallax layer */}
      <motion.div className={styles.orbitContainer} style={{ y: panelsY }}>
        <div ref={sphereRef} className={styles.orbitSphere}>
          {/* 4 screens, each with 8 slices */}
          {[0, 1, 2, 3].map((screen) => (
            <div key={screen} className={styles.orbitScreen}>
              {slices.map((slice) => (
                <div key={slice} className={styles.screenSlice} />
              ))}
            </div>
          ))}

          {/* Text at center of cylinder -- counter-rotates to stay static */}
          <div ref={text3dRef} className={styles.hero3dText}>
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: fadeEase, delay: 0.6 }}
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
                transition={{ duration: 1.2, ease: fadeEase, delay: 0.85 }}
                dangerouslySetInnerHTML={{ __html: t('heroHeadlineHtml') }}
              />
            ) : (
              <motion.h1
                className={styles.heroHeadline}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, ease: fadeEase, delay: 0.85 }}
              >
                Your brand,<br />
                built with<br />
                intention.
              </motion.h1>
            )}
          </div>
        </div>
      </motion.div>

      {/* Subheader + CTA outside the cylinder — slight parallax */}
      <motion.div className={styles.heroSubOuter} style={{ y: subY }}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: fadeEase, delay: 1.1 }}
        >
          <div className={styles.gooeyWrap}>
            <button className={styles.heroCta}>
              {t('Book a Consultation')}
            </button>
            <div className={styles.gooeyPill}>
              <span>{t("It's Free")}</span>
            </div>
          </div>
        </motion.div>
        <motion.p
          className={styles.heroSub}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: fadeEase, delay: 1.1 }}
        >
          {t('CY Studios is a boutique creative agency taking clients in cohorts — so every brand gets the attention it deserves.')}
        </motion.p>
      </motion.div>
    </section>
  );
}
