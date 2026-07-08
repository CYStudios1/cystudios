import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import styles from './Hero.module.css';
import { useTranslation } from '../shared/useTranslation';
import Threads from './Threads';

const fadeEase: [number, number, number, number] = [0.16, 1, 0.3, 1];

interface HeroProps {
  introComplete?: boolean;
}

export function Hero({ introComplete = false }: HeroProps) {
  const { t, isKorean } = useTranslation();
  const sphereRef = useRef<HTMLDivElement>(null);
  const text3dRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);

  /* ── Parallax scroll — 3 layers at different speeds ── */
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const panelsY = useTransform(scrollYProgress, [0, 1], [0, 100]);   // panels: medium

  const [panelsVisible, setPanelsVisible] = useState(false);
  const [elementsVisible, setElementsVisible] = useState(false);

  /* ── Trigger hero reveal sequence when introComplete fires ── */
  useEffect(() => {
    if (!introComplete) return;
    // Step 1: panels scale in
    const panelTimer = setTimeout(() => setPanelsVisible(true), 100);
    // Step 2: CTA, sub, pill fade in after panels settle
    const elemTimer = setTimeout(() => setElementsVisible(true), 700);
    return () => {
      clearTimeout(panelTimer);
      clearTimeout(elemTimer);
    };
  }, [introComplete]);

  /* ── Draggable orbit rotation ── */
  useEffect(() => {
    const sphere = sphereRef.current;
    const text3d = text3dRef.current;
    if (!sphere || !text3d) return;
    // Don't start rotation until panels are visible
    if (!panelsVisible) return;

    let isDragging = false;
    let startX = 0;
    let currentRotation = 0;
    let autoRotation = 0;
    let lastTime = performance.now();
    const speed = 360 / 30; // degrees per second (slower = smoother)

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
      // Only start drag if mouse is over the orbit panels
      if (!(e.target as HTMLElement).closest(`.${styles.orbitScreen}`)) return;
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

    sphere.addEventListener('mousedown', handleMouseDown as EventListener);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      cancelAnimationFrame(animId);
      sphere.removeEventListener('mousedown', handleMouseDown as EventListener);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [panelsVisible]);

  const NUM_SLICES = 16;
  const SLICE_ANGLE = 3.75;
  const RADIUS = 380;
  const CENTER_OFFSET = ((NUM_SLICES - 1) / 2) * SLICE_ANGLE;
  const panelImages = ['/project-1.jpg', '/project-2.jpg', '/project-3.jpg', '/project-4.png'];
  const baseAngles = [0, 90, 180, 270];
  // Geometric chord width — background positions step on this grid so image
  // content is continuous across slice boundaries
  const chordWidth = 2 * RADIUS * Math.sin((SLICE_ANGLE / 2) * (Math.PI / 180)); // ≈ 24.87px
  // Element is slightly wider than chord to fill any sub-pixel rendering gaps
  const totalWidth = NUM_SLICES * chordWidth; // ≈ 398px

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

      {/* Threads WebGL background — interactive lines behind the carousel */}
      <div className={styles.threadsLayer}>
        <Threads
          color={[0.55, 0.65, 0.80] as [number, number, number]}
          amplitude={0.8}
          distance={1.2}
          enableMouseInteraction={true}
        />
      </div>

      {/* Orbit container — always at scale 1 so text is measurable.
          Panels inside use CSS class to scale in; text stays at correct position. */}
      <motion.div
        data-orbit-container
        className={styles.orbitContainer}
        style={{ y: panelsY }}
      >
        <div ref={sphereRef} className={styles.orbitSphere}>
          {/* 4 panels — each slice has a front face + back face so panels stay
              visible at all angles when backface-visibility: hidden is active */}
          {baseAngles.map((baseAngle, screen) => (
            <div
              key={screen}
              className={`${styles.orbitScreen} ${panelsVisible ? styles.orbitScreenVisible : ''}`}
            >
              {Array.from({ length: NUM_SLICES }, (_, slice) => {
                const angle = baseAngle - CENTER_OFFSET + slice * SLICE_ANGLE;
                const mirrorSlice = NUM_SLICES - 1 - slice;
                return (
                  <div key={slice} style={{ display: 'contents' }}>
                    {/* Front face */}
                    <div
                      className={styles.screenSlice}
                      style={{
                        backgroundImage: `url(${panelImages[screen]})`,
                        backgroundSize: `${totalWidth}px 100%`,
                        backgroundPosition: `${-(slice * chordWidth)}px center`,
                        backgroundRepeat: 'no-repeat',
                        transform: `rotateY(${angle}deg) translateZ(${RADIUS}px)`,
                      }}
                    />
                    {/* Back face — rotated 180° so it's visible when panel faces away */}
                    <div
                      key={`b${slice}`}
                      className={styles.screenSlice}
                      style={{
                        backgroundImage: `url(${panelImages[screen]})`,
                        backgroundSize: `${totalWidth}px 100%`,
                        backgroundPosition: `${-(mirrorSlice * chordWidth)}px center`,
                        backgroundRepeat: 'no-repeat',
                        transform: `rotateY(${angle}deg) translateZ(${RADIUS}px) rotateY(180deg)`,
                      }}
                    />
                  </div>
                );
              })}
            </div>
          ))}

          {/* Text at center of cylinder — counter-rotates to stay static */}
          <div ref={text3dRef} className={styles.hero3dText}>
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={elementsVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
              transition={{ duration: 1, ease: fadeEase }}
              className={styles.heroPill}
            >
              <img src="/one-logo.png" alt="" className={styles.pillLogo} />
              it'll be ok colin
            </motion.div>

            {isKorean ? (
              <motion.h1
                className={styles.heroHeadline}
                initial={{ opacity: 1, y: 0 }}
                animate={{ opacity: 1, y: 0 }}
                dangerouslySetInnerHTML={{ __html: t('heroHeadlineHtml') }}
              />
            ) : (
              <motion.h1
                className={styles.heroHeadline}
                data-hero-headline
                initial={{ opacity: 0, y: 20 }}
                animate={elementsVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 1, ease: fadeEase }}
              >
                <span data-hero-word="0">Your </span>
                <span data-hero-word="1">brand,</span>
                <br />
                <span data-hero-word="2">built </span>
                <span data-hero-word="3">with</span>
                <br />
                <span data-hero-word="4">intention.</span>
              </motion.h1>
            )}
          </div>
        </div>
      </motion.div>

      {/* Subheader + CTA outside the cylinder */}
      <div className={styles.heroSubOuter}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={elementsVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 1, ease: fadeEase }}
        >
          <div className={styles.gooeyWrap}>
            <a href="https://calendly.com/design-cy-studios/30min" target="_blank" rel="noopener noreferrer" className={styles.heroCta}>
              {t('Book a Consultation')}
            </a>
            <div className={styles.gooeyPill}>
              <span>{t("It's Free")}</span>
            </div>
          </div>
        </motion.div>
        <motion.p
          className={styles.heroSub}
          initial={{ opacity: 0, y: 40 }}
          animate={elementsVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 1, ease: fadeEase, delay: 0.15 }}
        >
          {t('CY Studios is a boutique creative agency taking clients in with intention, so every brand gets the attention it deserves.')}
        </motion.p>
      </div>
    </section>
  );
}
