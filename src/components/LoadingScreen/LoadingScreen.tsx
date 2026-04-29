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

  // Bounce physics — decrease height, increase speed
  const bounceHeights = [120, 85, 60, 40, 25]; // pixels above word
  const fallDurations = [0.4, 0.22, 0.18, 0.15, 0.12];
  const riseDurations = [0.25, 0.2, 0.16, 0.13, 0.1];
  const squashX = [1.4, 1.25, 1.15, 1.1, 1.05];
  const squashY = [0.6, 0.75, 0.85, 0.9, 0.95];

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
      const positions = wordRefs.current.map(ref => {
        if (!ref) return { x: 0, y: 0, width: 0 };
        const rect = ref.getBoundingClientRect();
        return {
          x: rect.left - headlineRect.left + rect.width / 2, // center of word
          y: rect.top - headlineRect.top - 3, // top of word, slightly above
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
      const startY = positions[0].y - 200;

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

      // Bounce across each word
      for (let i = 0; i < words.length; i++) {
        const landX = positions[i].x;
        const landY = positions[i].y;

        // FALL DOWN to word (gravity)
        await ballControls.start({
          left: landX,
          top: landY,
          scaleX: 1,
          scaleY: 1,
          transition: {
            duration: fallDurations[i],
            ease: [0.55, 0, 1, 0.45],
          },
        });

        // Words 0-1: reveal on ball impact
        // Words 2-4: already visible, get "pushed down" by ball
        if (i <= 1) {
          setVisibleWords(prev => [...prev, i]);
          // After word 1 lands, reveal words 2-4 together
          if (i === 1) {
            await delay(100);
            setVisibleWords(prev => [...prev, 2, 3, 4]);
          }
        } else {
          // Ball pushes this word down on landing
          setPushedWord(i);
          await delay(120); // let the push animation play
          setPushedWord(null);
        }

        // SQUASH on landing
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

        // BOUNCE UP toward next word (if not last)
        if (i < words.length - 1) {
          const nextX = positions[i + 1].x;
          const midX = (landX + nextX) / 2;
          const peakY = landY - bounceHeights[i];

          // Rise to peak (decelerating)
          await ballControls.start({
            left: midX,
            top: peakY,
            scaleX: 0.9,
            scaleY: 1.1,
            transition: {
              duration: riseDurations[i],
              ease: [0, 0.55, 0.45, 1],
            },
          });
        }
      }

      // Bounce to period position
      const lastLandY = positions[words.length - 1].y;
      const periodPeakY = lastLandY - bounceHeights[4];
      const midPeriodX = (positions[words.length - 1].x + periodX) / 2;

      await ballControls.start({
        left: midPeriodX,
        top: periodPeakY,
        scaleX: 0.95,
        scaleY: 1.05,
        transition: { duration: 0.1, ease: [0, 0.55, 0.45, 1] },
      });

      // Fall to period
      await ballControls.start({
        left: periodX,
        top: periodY,
        scaleX: 1,
        scaleY: 1,
        transition: { duration: 0.12, ease: [0.55, 0, 1, 0.45] },
      });

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
