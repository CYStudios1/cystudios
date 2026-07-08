import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useAnimationControls } from 'framer-motion';
import styles from './LoadingScreen.module.css';

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function LoadingScreen({ onTextPositioned, onComplete }: { onTextPositioned: () => void; onComplete: () => void }) {
  const ballControls = useAnimationControls();
  const logoControls = useAnimationControls();
  const [visibleWords, setVisibleWords] = useState<number[]>([]);
  const [pushedWord, setPushedWord] = useState<number | null>(null);
  // Individual word controls for words 0 and 1 (multi-step animations)
  const word0Controls = useAnimationControls();
  const word1Controls = useAnimationControls();
  const [phase, setPhase] = useState<'logo' | 'bounce' | 'rearrange' | 'falling' | 'done'>('logo');
  const [logoHidden, setLogoHidden] = useState(false);
  const blurRef = useRef<SVGFEGaussianBlurElement>(null);
  const [periodVisible, setPeriodVisible] = useState(false);
  const periodRef = useRef<HTMLSpanElement>(null);

  const headlineRef = useRef<HTMLHeadingElement>(null);
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const logoRef = useRef<HTMLDivElement>(null);

  const words = ['Your', 'brand,', 'built', 'with', 'intention'];

  // AE bouncing ball physics:
  // - Each bounce is ~65% height of previous (energy loss)
  // - Ball spends MORE time in air, minimal time on ground
  // - Fall uses strong ease-in (gravity accelerating)
  // - Rise uses strong ease-out (decelerating against gravity)
  // - Stretch while falling fast, squash ONLY at contact, stretch on takeoff, round at peak

  // Heights: each ~65% of previous
  const bounceHeights = [140, 91, 59, 38, 25, 16];
  // Arc durations get shorter (less height = less airtime)
  // But NOT too aggressive — proportional to sqrt of height (physics)
  const arcDurations = [0.38, 0.32, 0.26, 0.22, 0.18, 0.14];
  // Squash intensity at contact — strong first, subtle last
  const squashX = [1.35, 1.22, 1.14, 1.08, 1.04, 1.02];
  const squashY = [0.65, 0.78, 0.86, 0.92, 0.96, 0.98];
  // Time on ground: minimal — gets shorter each bounce
  const groundTime = [0.035, 0.03, 0.025, 0.02, 0.015, 0.1]; // last one settles longer
  const ballSize = 7;

  const setWordRef = useCallback((el: HTMLSpanElement | null, i: number) => {
    wordRefs.current[i] = el;
  }, []);

  useEffect(() => {
    async function animate() {
      const headline = headlineRef.current;
      if (!headline) return;

      // Kick off font loading immediately
      const fontsReady = document.fonts.ready;

      // Wait two frames for initial paint
      await new Promise<void>(r => requestAnimationFrame(() => requestAnimationFrame(() => r())));

      // === PHASE 1: LOGO INTRO ===
      // Logo fades in centered on screen
      await logoControls.start({
        opacity: 1,
        scale: 1,
        transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
      });

      // Hold for a beat
      await delay(600);

      // === PHASE 2: LOGO MORPHS INTO BALL ===
      // Measure where the ball needs to end up (above first word)
      const headlineRectRough = headline.getBoundingClientRect();
      const roughWordRect = wordRefs.current[0]?.getBoundingClientRect();
      const roughStartX = roughWordRect
        ? roughWordRect.left - headlineRectRough.left + roughWordRect.width / 2
        : headlineRectRough.width * 0.15;
      const roughGroundY = roughWordRect
        ? roughWordRect.top - headlineRectRough.top + roughWordRect.height * 0.15 - ballSize
        : headlineRectRough.height * 0.12 - ballSize;

      // Logo element position (centered on screen)
      const logoEl = logoRef.current;
      const logoRect = logoEl?.getBoundingClientRect();
      const overlayRect = logoEl?.parentElement?.getBoundingClientRect();

      // Calculate where the ball drop starts relative to the headline
      // We need the ball's absolute screen position for the logo to travel to
      const ballDropScreenX = headlineRectRough.left + roughStartX;
      const ballDropScreenY = headlineRectRough.top + roughGroundY - 280;

      // Shrink logo toward ball start position
      // Move logo to where the ball will appear, shrink to ball size, round into circle
      if (logoRect && overlayRect) {
        const logoCenterX = logoRect.left + logoRect.width / 2;
        const logoCenterY = logoRect.top + logoRect.height / 2;
        const dx = ballDropScreenX - logoCenterX;
        const dy = ballDropScreenY - logoCenterY;
        const targetScale = ballSize / logoRect.width;

        await logoControls.start({
          x: dx,
          y: dy,
          scale: targetScale,
          borderRadius: '50%',
          transition: {
            duration: 0.65,
            ease: [0.4, 0, 0.2, 1],
          },
        });
      }

      // Logo is now a tiny circle at the ball's start position — remove it completely
      setLogoHidden(true);

      // Switch to bounce phase
      setPhase('bounce');

      // The ball is now a direct child of the overlay, so positions need
      // to be in screen coordinates (overlay is position:fixed inset:0).
      // Store headline offset to translate headline-relative → screen coords.
      const hOff = { x: headlineRectRough.left, y: headlineRectRough.top };

      // Ball appears at starting position
      await ballControls.set({
        left: hOff.x + roughStartX,
        top: hOff.y + roughGroundY - 280,
        opacity: 1,
        scaleX: 1,
        scaleY: 1,
      });

      // === INITIAL DROP ===
      const dropPromise = (async () => {
        await ballControls.start({
          top: hOff.y + roughGroundY - 40,
          scaleX: 0.85,
          scaleY: 1.2,
          transition: { duration: 0.45, ease: [0.4, 0, 1, 0.4] },
        });
        await ballControls.start({
          top: hOff.y + roughGroundY,
          scaleX: 0.9,
          scaleY: 1.15,
          transition: { duration: 0.06, ease: [0.4, 0, 1, 0] },
        });
      })();

      // Wait for both drop AND fonts to complete
      await Promise.all([dropPromise, fontsReady]);

      // === EXACT MEASUREMENT — Raleway is now definitely loaded ===
      // Re-measure headline offset (may have shifted after font swap)
      const headlineRect2 = headline.getBoundingClientRect();
      hOff.x = headlineRect2.left;
      hOff.y = headlineRect2.top;

      const positions = wordRefs.current.map(ref => {
        if (!ref) return { x: 0, y: 0, width: 0 };
        const rect = ref.getBoundingClientRect();
        const textTopOffset = rect.height * 0.15;
        return {
          x: hOff.x + rect.left - headlineRect2.left + rect.width / 2,
          y: hOff.y + rect.top - headlineRect2.top + textTopOffset - ballSize,
          width: rect.width,
        };
      });

      const groundY = positions[0].y; // all words on same line = same Y (now screen-relative)

      const wordControls = [word0Controls, word1Controls];

      // === LANDING HELPER ===
      async function land(wordI: number, bounceI: number, revealWord: boolean) {
        // Words 0 and 1: multi-step reveal — slide up, overshoot, get pushed down by ball, spring back
        if (revealWord && wordI <= 1) {
          const wc = wordControls[wordI];

          // 1. Slide up fast (word appears — overshoots past resting position)
          wc.start({
            y: [110, -10], // % — from hidden to noticeably above resting
            transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] },
          });
          // Don't await — let it play while ball squashes

          setVisibleWords(prev => [...prev, wordI]);
        } else if (revealWord && wordI > 1) {
          setPushedWord(wordI);
        } else {
          setPushedWord(wordI);
        }

        // SQUASH — ball flattens at contact (very fast)
        await ballControls.start({
          scaleX: squashX[bounceI],
          scaleY: squashY[bounceI],
          transition: { duration: groundTime[bounceI], ease: 'easeOut' },
        });

        // Words 0 and 1: ball impact pushes word down, then it springs back
        if (revealWord && wordI <= 1) {
          const wc = wordControls[wordI];
          // 2. Push down from ball impact
          await wc.start({
            y: 8, // % — pushed noticeably below resting
            transition: { duration: 0.06, ease: [0.4, 0, 1, 0.4] },
          });
          // 3. Spring back up, overshoot down slightly, settle
          wc.start({
            y: [8, -1, 3, 0], // down → up → small overshoot down → rest
            transition: {
              duration: 0.5,
              ease: [0.16, 1, 0.3, 1],
              times: [0, 0.35, 0.7, 1],
            },
          });
        }

        // UN-SQUASH — ball returns to round (spring)
        await ballControls.start({
          scaleX: 1,
          scaleY: 1,
          transition: { duration: groundTime[bounceI] * 0.8, ease: 'easeIn' },
        });

        // After word 1, reveal words 2-4
        if (revealWord && wordI === 1) {
          await delay(40);
          setVisibleWords(prev => [...prev, 2, 3, 4]);
        }

        if (wordI >= 2) setPushedWord(null);
      }

      // === ARC HELPER — single animation, no concurrent conflicts ===
      async function arc(fromX: number, toX: number, height: number, duration: number, endY?: number) {
        // Use multiple keyframe stops to approximate the arc curve
        // More stops = smoother arc
        const toY = endY ?? groundY;
        const stops = 8;
        const leftKeys: number[] = [];
        const topKeys: number[] = [];
        const timeKeys: number[] = [];
        const scaleXKeys: number[] = [];
        const scaleYKeys: number[] = [];

        for (let s = 0; s <= stops; s++) {
          const t = s / stops; // 0 to 1
          timeKeys.push(t);
          // X: linear interpolation
          leftKeys.push(fromX + (toX - fromX) * t);
          // Y: parabolic — base linearly interpolates from groundY to toY,
          // arc rises above that base so the ball can land at a different height
          const parabola = 1 - Math.pow(2 * t - 1, 2);
          const baseY = groundY + (toY - groundY) * t;
          topKeys.push(baseY - height * parabola);
          // Stretch: round at peak (t=0.5), slightly stretched near ground
          const distFromPeak = Math.abs(t - 0.45);
          const stretch = distFromPeak > 0.3 ? 0.92 : 1;
          scaleXKeys.push(stretch);
          scaleYKeys.push(stretch < 1 ? 1 + (1 - stretch) : 1);
        }

        await ballControls.start({
          left: leftKeys,
          top: topKeys,
          scaleX: scaleXKeys,
          scaleY: scaleYKeys,
          transition: {
            duration,
            ease: 'linear', // we baked the easing into the keyframe positions
            times: timeKeys,
          },
        });
      }

      // Helper: reduce gooey blur (text sharpens with each bounce)
      // 6 total landings: blur goes 4 → 3.5 → 3.0 → 2.0 → 1.0 → 0.5 → 0
      // Smoother steps with smaller decrements
      const blurSteps = [3.5, 3.0, 2.0, 1.0, 0.5, 0];
      let bounceCount = 0;

      function animateBlur(from: number, to: number, duration: number) {
        const start = performance.now();
        function tick(now: number) {
          const t = Math.min((now - start) / duration, 1);
          const val = from + (to - from) * t;
          if (blurRef.current) {
            blurRef.current.setAttribute('stdDeviation', String(val));
          }
          if (t < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
      }

      function reduceBlur() {
        if (blurRef.current && bounceCount < blurSteps.length) {
          const currentBlur = bounceCount === 0 ? 4 : blurSteps[bounceCount - 1];
          const targetBlur = blurSteps[bounceCount];
          animateBlur(currentBlur, targetBlur, 200); // smooth 200ms transition
          bounceCount++;
        }
      }

      // === FIRST LANDING ===
      await land(0, 0, true);
      reduceBlur();

      // === BOUNCE TO EACH WORD ===
      for (let i = 0; i < words.length - 1; i++) {
        const fromX = positions[i].x;
        const toX = positions[i + 1].x;
        await arc(fromX, toX, bounceHeights[i], arcDurations[i]);
        await land(i + 1, i + 1, true);
        reduceBlur();
      }

      // === SECOND BOUNCE: ball travels to the period position ===
      const intentionI = words.length - 1;

      // Measure the hidden period element — opacity:0 but still has a valid rect
      // Positions are already screen-relative so use screen coords directly
      const periodEl = periodRef.current;
      const periodElRect = periodEl?.getBoundingClientRect();
      const periodCenterX = periodElRect
        ? periodElRect.left + periodElRect.width / 2
        : positions[intentionI].x + 30;
      // The period "." dot sits near the baseline, roughly 70% down the line box
      const periodCenterY = periodElRect
        ? periodElRect.top + periodElRect.height * 0.70 - ballSize / 2
        : groundY;

      // Arc ends naturally at the period's Y position
      await arc(positions[intentionI].x, periodCenterX, bounceHeights[5], arcDurations[5], periodCenterY);

      // === BALL BECOMES THE PERIOD — physical stamp, not a fade ===
      // Color darkens DURING the squash — feels like a physical transformation
      setPushedWord(intentionI);
      await ballControls.start({
        scaleX: squashX[5],
        scaleY: squashY[5],
        backgroundColor: '#1A1008',
        transition: { duration: groundTime[5], ease: 'easeOut' },
      });
      await ballControls.start({
        scaleX: 1,
        scaleY: 1,
        transition: { duration: groundTime[5] * 0.8, ease: 'easeIn' },
      });
      setPushedWord(null);

      // Ball is now an ink-colored circle sitting exactly on the period position.
      // Period text appears instantly (ball is covering it, same color) —
      // then ball vanishes instantly. The swap is invisible.
      setPeriodVisible(true);
      await new Promise<void>(r => requestAnimationFrame(() => requestAnimationFrame(() => r())));
      ballControls.set({ opacity: 0 });

      // Wait a moment
      await delay(300);

      // === ANIMATE WORDS TO HERO HEADLINE POSITIONS ===

      // Measure hero headline word positions
      // Hero text is in its own layer (not inside the orbit container),
      // so getBoundingClientRect returns correct positions even before panels animate.
      const heroWordEls = document.querySelectorAll('[data-hero-word]');
      const heroWordPositions = Array.from(heroWordEls).map(el => {
        const rect = el.getBoundingClientRect();
        return { x: rect.left, y: rect.top };
      });

      // Measure current loading screen word positions
      const wordElements = wordRefs.current;
      const currentPositions = wordElements.map(el => {
        if (!el) return { x: 0, y: 0 };
        const rect = el.getBoundingClientRect();
        return { x: rect.left, y: rect.top };
      });

      // Calculate font scale ratio (loading vs hero)
      const loadingFontSize = parseFloat(getComputedStyle(headlineRef.current!).fontSize);
      const heroH1 = heroWordEls[0]?.closest('h1');
      const heroFSize = heroH1 ? parseFloat(getComputedStyle(heroH1).fontSize) : loadingFontSize;
      const scaleRatio = heroFSize / loadingFontSize;

      // Remove gooey filter so transforms render cleanly
      if (blurRef.current) {
        blurRef.current.setAttribute('stdDeviation', '0');
      }

      // Animate each word from current position to hero position
      wordElements.forEach((el, i) => {
        if (!el || !heroWordPositions[i]) return;
        const dx = heroWordPositions[i].x - currentPositions[i].x;
        const dy = heroWordPositions[i].y - currentPositions[i].y;
        const stagger = i * 0.04;
        el.style.transformOrigin = 'left top';
        el.style.transition = `transform 0.9s cubic-bezier(0.16, 1, 0.3, 1) ${stagger}s`;
        el.style.transform = `translate(${dx}px, ${dy}px) scale(${scaleRatio})`;
      });

      // Wait for animation to complete
      await delay(1100);

      // Text is now at hero position — tell App to make hero headline visible
      // (hero headline appears behind loading overlay at exact same position)
      onTextPositioned();

      // Give hero headline a frame to render
      await delay(50);

      // Background fades out, revealing hero headline underneath
      setPhase('falling');
      await delay(600);

      // Done — unmount loading screen, hero is already visible
      setPhase('done');
      onComplete();
    }

    animate();
  }, [ballControls, onTextPositioned, onComplete]);

  const isFalling = phase === 'falling';

  const overlayClasses = [
    styles.overlay,
    isFalling ? styles.overlayFading : '',
  ].filter(Boolean).join(' ');

  const headlineClasses = [
    styles.headline,
    isFalling ? styles.headlineFalling : '',
  ].filter(Boolean).join(' ');

  const isLogoPhase = phase === 'logo';

  return (
    <>
      {phase !== 'done' && (
        <div
          className={overlayClasses}
        >
          {/* One Logo — morphs into the bouncing ball */}
          {!logoHidden && (
            <motion.div
              ref={logoRef}
              animate={logoControls}
              initial={{ opacity: 0, scale: 0.8 }}
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                marginTop: -30,
                marginLeft: -30,
                width: 60,
                height: 60,
                zIndex: 10,
                overflow: 'hidden',
                pointerEvents: 'none',
              }}
            >
              <img
                src="/one-logo.png"
                alt=""
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            </motion.div>
          )}

          {/* SVG gooey filter for ball-into-text merge */}
          <svg style={{ position: 'absolute', width: 0, height: 0 }}>
            <defs>
              <filter id="gooey-loading">
                <feGaussianBlur ref={blurRef} in="SourceGraphic" stdDeviation="4" result="blur" />
                <feColorMatrix
                  in="blur"
                  mode="matrix"
                  values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 25 -12"
                  result="gooey"
                />
                <feComposite in="SourceGraphic" in2="gooey" operator="atop" />
              </filter>
            </defs>
          </svg>
          <div className={styles.gooeyContainer} style={{ opacity: isLogoPhase ? 0 : 1 }}>
          <h1 ref={headlineRef} className={headlineClasses}>
            {words.map((word, i) => (
              <span
                key={i}
                ref={(el) => setWordRef(el, i)}
                className={styles.wordClip}
                style={{ marginRight: '0.25em' }}
              >
                {i <= 1 ? (
                  /* Words 0-1: controlled by individual animationControls */
                  <motion.span
                    className={styles.wordInner}
                    initial={{ y: '110%' }}
                    animate={i === 0 ? word0Controls : word1Controls}
                    style={{ y: '110%' }}
                  >
                    {word}
                  </motion.span>
                ) : (
                  /* Words 2-4: state-driven reveal + push */
                  <motion.span
                    className={styles.wordInner}
                    initial={{ y: '110%' }}
                    animate={{
                      y: visibleWords.includes(i)
                        ? (pushedWord === i ? '4%' : '0%')
                        : '110%',
                    }}
                    transition={{
                      duration: pushedWord === i ? 0.12 : 0.5,
                      ease: pushedWord === i ? [0.34, 1.56, 0.64, 1] : [0.16, 1, 0.3, 1],
                    }}
                  >
                    {word}
                    {i === 4 && (
                      <span
                        ref={periodRef}
                        style={{ opacity: periodVisible ? 1 : 0 }}
                      >.</span>
                    )}
                  </motion.span>
                )}
              </span>
            ))}

          </h1>
          </div>
          {/* Ball rendered outside gooey filter so it's always visible.
              Positioned relative to the headline via the same ref measurements. */}
          <motion.div
            className={styles.ball}
            animate={ballControls}
            initial={{ opacity: 0 }}
            style={{
              position: 'absolute',
              opacity: isFalling ? 0 : undefined,
              transition: 'opacity 0.3s ease',
            }}
          />
        </div>
      )}
    </>
  );
}
