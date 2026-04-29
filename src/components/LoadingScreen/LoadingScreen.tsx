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
  const landingTop = '-0.15em'; // ball lands touching top of letters
  const startHeight = '-4em'; // drops from high above

  // Bounce heights decrease with each bounce (losing energy)
  const bounceHeights = ['-2em', '-1.4em', '-1em', '-0.7em', '-0.45em'];
  // Fall durations get shorter (ball moves faster)
  const fallDurations = [0.4, 0.22, 0.18, 0.15, 0.12];
  // Rise durations also get shorter
  const riseDurations = [0.25, 0.2, 0.16, 0.13, 0.1];
  // Squash intensity decreases
  const squashX = [1.4, 1.25, 1.15, 1.1, 1.05];
  const squashY = [0.6, 0.75, 0.85, 0.9, 0.95];

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

        // SQUASH on landing (fast — less time on ground)
        await ballControls.start({
          scaleX: squashX[i],
          scaleY: squashY[i],
          transition: { duration: 0.04, ease: 'easeOut' },
        });

        // SPRING back to normal (quick)
        await ballControls.start({
          scaleX: 1,
          scaleY: 1,
          transition: { duration: 0.04, ease: 'easeOut' },
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
              <span key={i} className={styles.wordClip} style={{ marginRight: '0.25em' }}>
                <motion.span
                  className={styles.wordInner}
                  initial={{ y: '110%' }}
                  animate={{ y: visibleWords.includes(i) ? '0%' : '110%' }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  {word}
                </motion.span>
              </span>
            ))}

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
