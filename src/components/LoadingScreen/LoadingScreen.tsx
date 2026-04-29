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
  const [phase, setPhase] = useState<'bounce' | 'transition' | 'done'>('bounce');

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
      const periodY = positions[positions.length - 1].y;

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

      // === LANDING HELPER ===
      async function land(wordI: number, bounceI: number, revealWord: boolean) {
        // Reveal or push word
        if (revealWord) {
          if (wordI <= 1) {
            setVisibleWords(prev => [...prev, wordI]);
            if (wordI === 1) {
              await delay(60);
              setVisibleWords(prev => [...prev, 2, 3, 4]);
            }
          } else {
            setPushedWord(wordI);
          }
        } else {
          setPushedWord(wordI);
        }

        // SQUASH — ball flattens at contact (very fast)
        await ballControls.start({
          scaleX: squashX[bounceI],
          scaleY: squashY[bounceI],
          transition: { duration: groundTime[bounceI], ease: 'easeOut' },
        });

        // UN-SQUASH — ball returns to round (spring)
        await ballControls.start({
          scaleX: 1,
          scaleY: 1,
          transition: { duration: groundTime[bounceI] * 0.8, ease: 'easeIn' },
        });

        if (wordI >= 2) setPushedWord(null);
      }

      // === ARC HELPER — true parabolic arc between two points ===
      async function arc(fromX: number, toX: number, height: number, duration: number) {
        const peakY = groundY - height;

        await Promise.all([
          // X: linear (constant horizontal speed)
          ballControls.start({
            left: toX,
            transition: { duration, ease: 'linear' },
          }),
          // Y: parabolic — split into rise (ease-out) and fall (ease-in)
          // Using keyframes: ground → peak → ground
          // The ball should be ROUND at peak, STRETCHED while falling fast
          ballControls.start({
            top: [groundY, peakY, groundY],
            // Stretch going up, round at peak, stretch coming down
            scaleX: [1, 1, 0.88],
            scaleY: [1, 1, 1.15],
            transition: {
              duration,
              // Custom timing: peak at ~45% (slightly less than half — falls faster than rises)
              times: [0, 0.45, 1],
              // Y needs different easing for up vs down
              // Single bezier that approximates parabola: fast out of ground, slow at peak, fast back down
              ease: [0.1, 0.82, 0.9, 0.18],
            },
          }),
        ]);
      }

      // === FIRST LANDING ===
      await land(0, 0, true);

      // === BOUNCE TO EACH WORD ===
      for (let i = 0; i < words.length - 1; i++) {
        const fromX = positions[i].x;
        const toX = positions[i + 1].x;
        await arc(fromX, toX, bounceHeights[i], arcDurations[i]);
        await land(i + 1, i + 1, true);
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

      // === ARC TO PERIOD ===
      const periodPeakHeight = 10;
      const periodArcDuration = 0.1;

      await Promise.all([
        ballControls.start({
          left: periodX,
          transition: { duration: periodArcDuration, ease: 'linear' },
        }),
        ballControls.start({
          top: [groundY, groundY - periodPeakHeight, groundY],
          transition: {
            duration: periodArcDuration,
            ease: [0.1, 0.82, 0.9, 0.18],
            times: [0, 0.45, 1],
          },
        }),
      ]);

      // Tiny final squash
      await ballControls.start({
        scaleX: 1.05,
        scaleY: 0.95,
        transition: { duration: 0.02 },
      });

      // Settle as period
      await ballControls.start({
        scaleX: 0.7,
        scaleY: 0.7,
        transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] },
      });

      // Wait then transition out
      await delay(500);
      setPhase('transition');
      await delay(1500);
      setPhase('done');
      onComplete();
    }

    animate();
  }, [ballControls, onComplete]);

  return (
    <AnimatePresence>
      {phase !== 'done' && (
        <motion.div
          className={styles.overlay}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1 ref={headlineRef} className={styles.headline}>
            {words.map((word, i) => (
              <span
                key={i}
                ref={(el) => setWordRef(el, i)}
                className={styles.wordClip}
                style={{ marginRight: '0.25em' }}
              >
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
              </span>
            ))}

            <motion.div
              className={styles.ball}
              animate={ballControls}
              initial={{ opacity: 0 }}
            />
          </h1>

          {phase === 'transition' && (
            <motion.div
              className={styles.overlay}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              style={{ background: 'var(--bg)' }}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
