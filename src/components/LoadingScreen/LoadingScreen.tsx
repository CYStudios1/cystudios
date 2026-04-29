import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './LoadingScreen.module.css';

export function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<'bounce' | 'transition' | 'done'>('bounce');

  useEffect(() => {
    const transitionTimer = setTimeout(() => setPhase('transition'), 3500);
    const doneTimer = setTimeout(() => {
      setPhase('done');
      onComplete();
    }, 5000);

    return () => {
      clearTimeout(transitionTimer);
      clearTimeout(doneTimer);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {phase !== 'done' && (
        <motion.div
          className={styles.overlay}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.h1
            className={styles.headline}
            animate={phase === 'transition' ? {
              x: '-30vw',
              y: '-25vh',
              scale: 0.85,
              opacity: 0,
            } : {}}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          >
            Your brand, built with intention
            <div className={styles.ball} />
          </motion.h1>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
