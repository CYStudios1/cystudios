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
  const baseTop = '0.9em';
  const bounceHeight = '-2.5em';
  const startHeight = '-4em';

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
          top: baseTop,
          left: `${wordPositions[i]}em`,
          scaleX: 1,
          scaleY: 1,
          transition: {
            duration: i === 0 ? 0.5 : 0.35,
            ease: [0.55, 0, 1, 0.45], // gravity — accelerates downward
          },
        });

        // Reveal the word on impact
        setVisibleWords(prev => [...prev, i]);

        // SQUASH on landing
        await ballControls.start({
          scaleX: 1.4,
          scaleY: 0.6,
          transition: { duration: 0.08, ease: 'easeOut' },
        });

        // SPRING back to normal shape
        await ballControls.start({
          scaleX: 0.85,
          scaleY: 1.15,
          transition: { duration: 0.08, ease: 'easeOut' },
        });

        await ballControls.start({
          scaleX: 1,
          scaleY: 1,
          transition: { duration: 0.06 },
        });

        // If not the last word, BOUNCE UP toward next word
        if (i < words.length - 1) {
          const midX = (wordPositions[i] + wordPositions[i + 1]) / 2;

          // Rise up (decelerating — losing momentum) and move toward next word
          await ballControls.start({
            top: bounceHeight,
            left: `${midX}em`,
            scaleX: 0.9,
            scaleY: 1.1,
            transition: {
              duration: 0.3,
              ease: [0, 0.55, 0.45, 1], // deceleration — slows at top
            },
          });

          // Small pause at the apex
          await delay(30);
        }
      }

      // After last word: bounce to period position
      // Rise up
      await ballControls.start({
        top: bounceHeight,
        left: '11em',
        scaleX: 0.9,
        scaleY: 1.1,
        transition: { duration: 0.25, ease: [0, 0.55, 0.45, 1] },
      });

      // Fall to period position
      await ballControls.start({
        top: baseTop,
        left: `${periodPos}em`,
        scaleX: 1,
        scaleY: 1,
        transition: { duration: 0.3, ease: [0.55, 0, 1, 0.45] },
      });

      // Small squash
      await ballControls.start({
        scaleX: 1.2,
        scaleY: 0.8,
        transition: { duration: 0.06 },
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
