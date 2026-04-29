import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useAnimationControls } from 'framer-motion';
import styles from './LoadingScreen.module.css';

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const ballControls = useAnimationControls();
  const [visibleWords, setVisibleWords] = useState<number[]>([]);
  const [showPeriod, setShowPeriod] = useState(false);
  const [phase, setPhase] = useState<'bounce' | 'transition' | 'done'>('bounce');

  const words = ['Your', 'brand,', 'built', 'with', 'intention'];

  // Word left positions in em units
  const wordPositions = [0.3, 2.8, 5.2, 7.2, 9.5];
  const periodPos = 12.2;
  const landingTop = '1.05em'; // ball lands ON the text baseline
  const startHeight = '-5em'; // drops from very high

  // Bounce heights decrease with each bounce (losing energy)
  const bounceHeights = ['-3em', '-2.2em', '-1.5em', '-1em', '-0.6em'];
  // Fall durations get shorter (ball moves faster as it loses height)
  const fallDurations = [0.55, 0.32, 0.28, 0.24, 0.2];
  // Rise durations also get shorter
  const riseDurations = [0.35, 0.28, 0.24, 0.2, 0.16];
  // Squash intensity decreases
  const squashX = [1.5, 1.35, 1.25, 1.15, 1.1];
  const squashY = [0.5, 0.65, 0.75, 0.85, 0.9];

  useEffect(() => {
    async function animate() {
      // Ball starts high above first word, invisible
      await ballControls.set({
        left: `${wordPositions[0]}em`,
        top: startHeight,
        opacity: 0,
        scaleX: 1,
        scaleY: 1,
      });

      // Small pause before animation starts
      await delay(300);

      // Make ball visible
      await ballControls.start({
        opacity: 1,
        transition: { duration: 0.1 },
      });

      // For each word: fall down, reveal word, squash, bounce up, arc to next
      for (let i = 0; i < words.length; i++) {
        // FALL DOWN to word position (gravity — accelerating)
        await ballControls.start({
          top: landingTop,
          left: `${wordPositions[i]}em`,
          scaleX: 1,
          scaleY: 1,
          transition: {
            duration: fallDurations[i],
            ease: [0.55, 0, 1, 0.45], // gravity — accelerates downward
          },
        });

        // Reveal the word on impact
        setVisibleWords(prev => [...prev, i]);

        // SQUASH on landing (intensity decreases with each bounce)
        await ballControls.start({
          scaleX: squashX[i],
          scaleY: squashY[i],
          transition: { duration: 0.07, ease: 'easeOut' },
        });

        // SPRING back to normal shape
        await ballControls.start({
          scaleX: 0.9,
          scaleY: 1.1,
          transition: { duration: 0.06, ease: 'easeOut' },
        });

        await ballControls.start({
          scaleX: 1,
          scaleY: 1,
          transition: { duration: 0.05 },
        });

        // If not the last word, BOUNCE UP toward next word
        if (i < words.length - 1) {
          const midX = (wordPositions[i] + wordPositions[i + 1]) / 2;

          // Rise up (decelerating — losing momentum) — height decreases each time
          await ballControls.start({
            top: bounceHeights[i],
            left: `${midX}em`,
            scaleX: 0.9,
            scaleY: 1.1,
            transition: {
              duration: riseDurations[i],
              ease: [0, 0.55, 0.45, 1], // deceleration — slows at top
            },
          });
        }
      }

      // After last word: small bounce to period position (very low, fast)
      await ballControls.start({
        top: bounceHeights[4],
        left: '11em',
        scaleX: 0.95,
        scaleY: 1.05,
        transition: { duration: 0.14, ease: [0, 0.55, 0.45, 1] },
      });

      // Fall to period position
      await ballControls.start({
        top: landingTop,
        left: `${periodPos}em`,
        scaleX: 1,
        scaleY: 1,
        transition: { duration: 0.16, ease: [0.55, 0, 1, 0.45] },
      });

      // Small squash
      await ballControls.start({
        scaleX: 1.1,
        scaleY: 0.9,
        transition: { duration: 0.05 },
      });

      // Settle as period
      await ballControls.start({
        scaleX: 0.7,
        scaleY: 0.7,
        transition: { duration: 0.2, ease: 'easeOut' },
      });

      setShowPeriod(true);

      // Wait a moment, then transition
      await delay(600);
      setPhase('transition');
      await delay(1500);
      setPhase('done');
      onComplete();
    }

    animate();
  }, []);

  return (
    <AnimatePresence>
      {phase !== 'done' && (
        <motion.div
          className={styles.overlay}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1 className={styles.headline}>
            {words.map((word, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: visibleWords.includes(i) ? 1 : 0 }}
                transition={{ duration: 0.15 }}
                style={{ marginRight: '0.25em' }}
              >
                {word}
              </motion.span>
            ))}
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: showPeriod ? 0 : 0 }}
            />

            {/* Bouncing ball */}
            <motion.div
              className={styles.ball}
              animate={ballControls}
              initial={{ opacity: 0, left: '0.3em', top: '-4em' }}
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
