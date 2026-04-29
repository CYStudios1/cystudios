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

  // "intention" gets two bounces — first lands on left side, second on right side
  const words = ['Your', 'brand,', 'built', 'with', 'intention'];

  // Bounce physics — exponential speed decrease but gentler on last 3
  const bounceHeights = [120, 55, 35, 20, 10, 4];
  // Durations: first 2 fast, last 3 ease off more gradually
  const fallDurations = [0.4, 0.18, 0.14, 0.11, 0.08, 0.05];
  const riseDurations = [0.22, 0.12, 0.1, 0.08, 0.06, 0.04];
  // Squash decreases
  const squashX = [1.4, 1.2, 1.12, 1.08, 1.04, 1.02];
  const squashY = [0.6, 0.8, 0.88, 0.92, 0.96, 0.98];
  // Landing pause: starts at 0.04, ends at 0.1 for the final settle
  const squashDurations = [0.04, 0.035, 0.03, 0.025, 0.02, 0.1];
  const ballSize = 7; // px — must match CSS .ball width/height

  const setWordRef = useCallback((el: HTMLSpanElement | null, i: number) => {
    wordRefs.current[i] = el;
  }, []);

  useEffect(() => {
    async function animate() {
      const headline = headlineRef.current;
      if (!headline) return;

      // Wait for fonts to load and layout to settle
      await delay(100);
      await document.fonts.ready;
      await delay(200);

      const headlineRect = headline.getBoundingClientRect();

      // Measure each word's position relative to the h1
      // We want the ball's bottom edge to sit right on top of the visible text
      // The wordClip span wraps the text — we measure its inner text position
      const positions = wordRefs.current.map(ref => {
        if (!ref) return { x: 0, y: 0, width: 0 };
        const rect = ref.getBoundingClientRect();
        // The inner text starts a bit below rect.top due to line-height/overflow hidden
        // Use rect.top + small offset to hit the actual visible letter tops
        const textTopOffset = rect.height * 0.15; // skip the line-height gap at top
        return {
          x: rect.left - headlineRect.left + rect.width / 2, // center of word
          y: rect.top - headlineRect.top + textTopOffset - ballSize, // ball bottom on letter tops
          width: rect.width,
        };
      });

      // Period position: right edge of last word
      const lastWord = wordRefs.current[words.length - 1];
      const lastRect = lastWord?.getBoundingClientRect();
      const periodX = lastRect
        ? lastRect.right - headlineRect.left + 4
        : positions[positions.length - 1].x + 50;
      const periodY = positions[positions.length - 1].y;

      // Ball starts high above first word
      const startX = positions[0].x;
      const startY = positions[0].y - 250;

      await ballControls.set({
        left: startX,
        top: startY,
        opacity: 0,
        scaleX: 1,
        scaleY: 1,
      });

      // Make ball visible
      await ballControls.start({
        opacity: 1,
        transition: { duration: 0.1 },
      });

      // Helper: handle landing on a word
      // bounceIndex controls physics (can differ from word index for extra bounces)
      async function landOnWord(wordI: number, bounceI: number, revealWord = true) {
        if (revealWord) {
          if (wordI <= 1) {
            setVisibleWords(prev => [...prev, wordI]);
            if (wordI === 1) {
              await delay(80);
              setVisibleWords(prev => [...prev, 2, 3, 4]);
            }
          } else {
            setPushedWord(wordI);
          }
        } else {
          // Extra bounce — still push the word
          setPushedWord(wordI);
        }

        // SQUASH — duration decreases with each bounce
        await ballControls.start({
          scaleX: squashX[bounceI],
          scaleY: squashY[bounceI],
          transition: { duration: squashDurations[bounceI], ease: 'easeOut' },
        });

        // Spring back
        await ballControls.start({
          scaleX: 1,
          scaleY: 1,
          transition: { duration: squashDurations[bounceI], ease: 'easeOut' },
        });

        if (wordI >= 2) {
          setPushedWord(null);
        }
      }

      // First word: ball falls from above
      await ballControls.start({
        left: positions[0].x,
        top: positions[0].y,
        transition: {
          duration: fallDurations[0],
          ease: [0.55, 0, 1, 0.45],
        },
      });
      await landOnWord(0, 0);

      // Words 1-4: true parabolic arc from word to word
      // X moves linearly, Y uses gravity easing — creates a natural arc
      for (let i = 0; i < words.length - 1; i++) {
        const fromX = positions[i].x;
        const fromY = positions[i].y;
        const toX = positions[i + 1].x;
        const toY = positions[i + 1].y;
        const peakY = Math.min(fromY, toY) - bounceHeights[i];
        const arcDuration = riseDurations[i] + fallDurations[i + 1];

        // Animate as two concurrent motions:
        // 1. X: linear movement from word to word
        // 2. Y: up with deceleration, down with acceleration (gravity parabola)
        // Use Promise.all so they run simultaneously
        await Promise.all([
          // Horizontal: constant speed
          ballControls.start({
            left: toX,
            transition: {
              duration: arcDuration,
              ease: 'linear',
            },
          }),
          // Vertical: parabolic arc using keyframes with gravity easing
          ballControls.start({
            top: [fromY, peakY, toY],
            scaleX: [1, 0.9, 1],
            scaleY: [1, 1.1, 1],
            transition: {
              duration: arcDuration,
              ease: [0.33, 0, 0.67, 1], // symmetric parabola
              times: [0, 0.4, 1],
              top: {
                duration: arcDuration,
                ease: [0.33, 0, 0.67, 1],
                times: [0, 0.4, 1],
              },
            },
          }),
        ]);

        await landOnWord(i + 1, i + 1);
      }

      // "intention" gets a second bounce — arc from left side to right side of the word
      const intentionI = words.length - 1;
      const intentionRef = wordRefs.current[intentionI];
      const intentionRect = intentionRef?.getBoundingClientRect();
      const headlineRect2 = headlineRef.current!.getBoundingClientRect();

      // First bounce landed at center of "intention" (positions[intentionI].x)
      // Second bounce lands at ~75% across the word
      const intentionRightX = intentionRect
        ? intentionRect.left - headlineRect2.left + intentionRect.width * 0.75
        : positions[intentionI].x + 30;
      const intentionY = positions[intentionI].y;

      // Arc from center to right side of "intention" (bounce index 5 — very fast/small)
      const secondBounceHeight = bounceHeights[5];
      const secondArcDuration = riseDurations[5] + fallDurations[5];

      await Promise.all([
        ballControls.start({
          left: intentionRightX,
          transition: { duration: secondArcDuration, ease: 'linear' },
        }),
        ballControls.start({
          top: [intentionY, intentionY - secondBounceHeight, intentionY],
          transition: {
            duration: secondArcDuration,
            ease: [0.33, 0, 0.67, 1],
            times: [0, 0.4, 1],
          },
        }),
      ]);

      // Second landing on "intention"
      await landOnWord(intentionI, 5, false);

      // Arc to period position
      const lastI = intentionI;
      const fromX = intentionRightX;
      const fromY = intentionY;
      const periodPeakY = Math.min(fromY, periodY) - bounceHeights[4];
      const periodArcDuration = riseDurations[4] + 0.06;

      await Promise.all([
        ballControls.start({
          left: periodX,
          transition: { duration: periodArcDuration, ease: 'linear' },
        }),
        ballControls.start({
          top: [fromY, periodPeakY, periodY],
          scaleX: [1, 0.95, 1],
          scaleY: [1, 1.05, 1],
          transition: {
            duration: periodArcDuration,
            ease: [0.33, 0, 0.67, 1],
            times: [0, 0.4, 1],
          },
        }),
      ]);

      // Small squash
      await ballControls.start({
        scaleX: 1.1,
        scaleY: 0.9,
        transition: { duration: 0.04 },
      });

      // Settle as period
      await ballControls.start({
        scaleX: 0.7,
        scaleY: 0.7,
        transition: { duration: 0.2, ease: 'easeOut' },
      });

      // Wait then transition
      await delay(600);
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

            {/* Bouncing ball */}
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
