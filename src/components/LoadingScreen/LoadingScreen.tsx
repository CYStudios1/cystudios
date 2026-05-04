import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useAnimationControls } from 'framer-motion';
import styles from './LoadingScreen.module.css';

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const ballControls = useAnimationControls();
  const [visibleWords, setVisibleWords] = useState<number[]>([]);
  const [pushedWord, setPushedWord] = useState<number | null>(null);
  // Individual word controls for words 0 and 1 (multi-step animations)
  const word0Controls = useAnimationControls();
  const word1Controls = useAnimationControls();
  const [phase, setPhase] = useState<'bounce' | 'rearrange' | 'falling' | 'done'>('bounce');
  const [isMerging, setIsMerging] = useState(false);
  const [filterBlur, setFilterBlur] = useState(4); // starts gooey, decreases to 0
  const blurRef = useRef<SVGFEGaussianBlurElement>(null);

  const headlineRef = useRef<HTMLHeadingElement>(null);
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);

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

      await delay(100);
      await document.fonts.ready;
      await delay(200);

      const headlineRect = headline.getBoundingClientRect();

      const positions = wordRefs.current.map(ref => {
        if (!ref) return { x: 0, y: 0, width: 0 };
        const rect = ref.getBoundingClientRect();
        const textTopOffset = rect.height * 0.15;
        return {
          x: rect.left - headlineRect.left + rect.width / 2,
          y: rect.top - headlineRect.top + textTopOffset - ballSize,
          width: rect.width,
        };
      });

      const lastWord = wordRefs.current[words.length - 1];
      const lastRect = lastWord?.getBoundingClientRect();
      const periodX = lastRect
        ? lastRect.right - headlineRect.left + 4
        : positions[positions.length - 1].x + 50;
      const startX = positions[0].x;
      const groundY = positions[0].y; // all words on same line = same Y

      // Ball starts high above
      await ballControls.set({
        left: startX,
        top: groundY - 280,
        opacity: 0,
        scaleX: 1,
        scaleY: 1,
      });

      await ballControls.start({
        opacity: 1,
        transition: { duration: 0.1 },
      });

      // === INITIAL DROP from high above ===
      // Stretch while falling (tall and narrow)
      await ballControls.start({
        top: groundY - 40,
        scaleX: 0.85,
        scaleY: 1.2,
        transition: {
          duration: 0.45,
          ease: [0.4, 0, 1, 0.4], // strong gravity — slow start, fast end
        },
      });
      // Final fast drop to contact
      await ballControls.start({
        top: groundY,
        scaleX: 0.9,
        scaleY: 1.15,
        transition: {
          duration: 0.06,
          ease: [0.4, 0, 1, 0],
        },
      });

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
      async function arc(fromX: number, toX: number, height: number, duration: number) {
        // Use multiple keyframe stops to approximate the arc curve
        // More stops = smoother arc
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
          // Y: parabolic — y = ground - height * (1 - (2t-1)^2)
          // This gives a perfect parabola peaking at t=0.5
          const parabola = 1 - Math.pow(2 * t - 1, 2);
          topKeys.push(groundY - height * parabola);
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

      // === SECOND BOUNCE ON "intention" (horizontal movement) ===
      const intentionI = words.length - 1;
      const intentionRef = wordRefs.current[intentionI];
      const intentionRect = intentionRef?.getBoundingClientRect();
      const headlineRect2 = headlineRef.current!.getBoundingClientRect();

      const intentionRightX = intentionRect
        ? intentionRect.left - headlineRect2.left + intentionRect.width * 0.78
        : positions[intentionI].x + 30;

      await arc(positions[intentionI].x, intentionRightX, bounceHeights[5], arcDurations[5]);
      await land(intentionI, 5, false);

      // === BALL MERGES INTO TEXT (gooey absorption) ===
      // Keep blur at 0 — text stays clean Raleway, only ball gets absorbed
      setIsMerging(true);

      // Step 1: Change ball color from peachy to ink (match text color)
      await ballControls.start({
        backgroundColor: '#1A1008',
        transition: { duration: 0.25, ease: 'easeOut' },
      });

      // Step 2: Ball sinks downward into the word — shrinks and fades
      await ballControls.start({
        top: groundY + 20,
        scaleX: 0.5,
        scaleY: 0.5,
        opacity: 0.6,
        transition: { duration: 0.4, ease: [0.55, 0, 1, 0.45] },
      });

      // Step 3: Final absorption — disappears
      await ballControls.start({
        scaleX: 0.1,
        scaleY: 0.1,
        opacity: 0,
        transition: { duration: 0.25, ease: 'easeIn' },
      });

      // Wait a moment
      await delay(300);

      // === ANIMATE WORDS TO HERO HEADLINE POSITIONS ===

      // Measure hero headline word positions (hero is mounted but invisible)
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

      // Background fades out AFTER text has settled
      setPhase('falling');
      await delay(600);

      // Done — hero headline takes over at same position
      setPhase('done');
      onComplete();
    }

    animate();
  }, [ballControls, onComplete]);

  const isFalling = phase === 'falling';

  const overlayClasses = [
    styles.overlay,
    isFalling ? styles.overlayFading : '',
  ].filter(Boolean).join(' ');

  const headlineClasses = [
    styles.headline,
    isFalling ? styles.headlineFalling : '',
  ].filter(Boolean).join(' ');

  return (
    <AnimatePresence>
      {phase !== 'done' && (
        <motion.div
          className={overlayClasses}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
        >
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
          <div className={styles.gooeyContainer}>
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
                  </motion.span>
                )}
              </span>
            ))}

            <motion.div
              className={styles.ball}
              animate={ballControls}
              initial={{ opacity: 0 }}
              style={{
                opacity: isFalling ? 0 : undefined,
                transition: 'opacity 0.3s ease',
              }}
            />
          </h1>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
