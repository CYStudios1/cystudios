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

  // Bounce physics — decrease height, increase speed dramatically
  const bounceHeights = [120, 75, 45, 25, 14]; // pixels above word
  const fallDurations = [0.4, 0.18, 0.13, 0.09, 0.06];
  const riseDurations = [0.22, 0.15, 0.11, 0.08, 0.05];
  const squashX = [1.4, 1.25, 1.15, 1.1, 1.05];
  const squashY = [0.6, 0.75, 0.85, 0.9, 0.95];
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
      async function landOnWord(i: number) {
        if (i <= 1) {
          setVisibleWords(prev => [...prev, i]);
          if (i === 1) {
            await delay(80);
            setVisibleWords(prev => [...prev, 2, 3, 4]);
          }
        } else {
          setPushedWord(i);
        }

        // SQUASH
        await ballControls.start({
          scaleX: squashX[i],
          scaleY: squashY[i],
          transition: { duration: 0.04, ease: 'easeOut' },
        });

        // Spring back
        await ballControls.start({
          scaleX: 1,
          scaleY: 1,
          transition: { duration: 0.04, ease: 'easeOut' },
        });

        if (i >= 2) {
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
      await landOnWord(0);

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

        await landOnWord(i + 1);
      }

      // Extra bounce on "intention" — small bounce in place
      const intentionI = words.length - 1;
      const intentionX = positions[intentionI].x;
      const intentionY = positions[intentionI].y;
      const smallBounceHeight = 20; // much smaller second bounce

      // Rise up slightly
      await ballControls.start({
        top: intentionY - smallBounceHeight,
        scaleX: 0.95,
        scaleY: 1.05,
        transition: {
          duration: 0.08,
          ease: [0, 0.55, 0.45, 1],
        },
      });

      // Fall back down
      await ballControls.start({
        top: intentionY,
        scaleX: 1,
        scaleY: 1,
        transition: {
          duration: 0.07,
          ease: [0.55, 0, 1, 0.45],
        },
      });

      // Second push-down on "intention"
      setPushedWord(intentionI);
      await ballControls.start({
        scaleX: 1.08,
        scaleY: 0.92,
        transition: { duration: 0.03, ease: 'easeOut' },
      });
      await ballControls.start({
        scaleX: 1,
        scaleY: 1,
        transition: { duration: 0.03, ease: 'easeOut' },
      });
      setPushedWord(null);

      // Arc to period position
      const lastI = intentionI;
      const fromX = intentionX;
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
