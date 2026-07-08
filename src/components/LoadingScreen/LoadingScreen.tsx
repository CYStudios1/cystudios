import { useState, useEffect, useRef } from 'react';
import { motion, useAnimationControls } from 'framer-motion';
import styles from './LoadingScreen.module.css';

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function LoadingScreen({ onTextPositioned, onComplete }: { onTextPositioned: () => void; onComplete: () => void }) {
  const logoControls = useAnimationControls();
  const textControls = useAnimationControls();
  const [phase, setPhase] = useState<'logo' | 'falling' | 'done'>('logo');
  const [logoStep, setLogoStep] = useState(0);
  const [showText, setShowText] = useState(false);
  const logoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function animate() {
      // Wait for initial paint
      await new Promise<void>(r => requestAnimationFrame(() => requestAnimationFrame(() => r())));

      // Wait for fonts
      await document.fonts.ready;

      // === PHASE 1: LOGO FADES IN ===
      await logoControls.start({
        opacity: 1,
        scale: 1,
        transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
      });

      await delay(500);

      // === PHASE 2: SHAPES PEEL AWAY ONE BY ONE ===
      setLogoStep(1); // bottom-right disappears
      await delay(200);
      setLogoStep(2); // bottom-left disappears
      await delay(200);
      setLogoStep(3); // middle-right disappears — now just top 2
      await delay(300);

      // === PHASE 3: SLINGSHOT ===
      // Pull toward viewer (scale up slightly, like stretching a slingshot)
      await logoControls.start({
        scale: 1.15,
        transition: { duration: 0.4, ease: [0.2, 0, 0.4, 1] },
      });

      // Small pause at the pull-back peak — tension
      await delay(100);

      // FLING — launch away from viewer (shrink to nothing rapidly)
      await logoControls.start({
        scale: 0,
        opacity: 0,
        transition: {
          duration: 0.35,
          ease: [0.6, 0, 1, 0.4],
        },
      });

      // === PHASE 4: CY STUDIOS TEXT FLINGS TOWARD VIEWER ===
      setShowText(true);

      // Wait for React to render the text element
      await new Promise<void>(r => requestAnimationFrame(() => requestAnimationFrame(() => r())));

      // Text appears at center (where logo disappeared), small
      await textControls.start({
        opacity: 1,
        scale: 1,
        transition: { duration: 0.15, ease: 'easeOut' },
      });

      // Brief hold
      await delay(300);

      // Pull back slightly (slingshot tension)
      await textControls.start({
        scale: 0.95,
        transition: { duration: 0.25, ease: [0.2, 0, 0.4, 1] },
      });

      await delay(80);

      // FLING TOWARD VIEWER — scale up massively past the screen
      await textControls.start({
        scale: 15,
        opacity: 0,
        transition: {
          duration: 0.5,
          ease: [0.6, 0, 1, 0.4],
        },
      });

      // Fade out the overlay
      setPhase('falling');
      await delay(600);

      // Remove overlay, then make hero visible
      setPhase('done');
      onTextPositioned();
      onComplete();
    }

    animate();
  }, [logoControls, onTextPositioned, onComplete]);

  const isFalling = phase === 'falling';

  return (
    <>
      {phase !== 'done' && (
        <div className={`${styles.overlay} ${isFalling ? styles.overlayFading : ''}`}>
          <motion.div
            ref={logoRef}
            animate={logoControls}
            initial={{ opacity: 0, scale: 0.8 }}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              marginTop: -42,
              marginLeft: -30,
              width: 60,
              height: 84,
              zIndex: 10,
              pointerEvents: 'none',
            }}
          >
            {/* Base: 2-filled (what remains after peeling) */}
            <img
              src="/cy-logo.png"
              alt=""
              style={{ width: '100%', height: '100%', objectFit: 'contain', position: 'absolute', inset: 0 }}
            />
            {/* Overlay layers that disappear one by one */}
            <img
              src="/cy-logo-1.png"
              alt=""
              style={{
                width: '100%', height: '100%', objectFit: 'contain',
                position: 'absolute', inset: 0,
                opacity: logoStep >= 3 ? 0 : 1,
                transition: 'opacity 0.25s ease',
              }}
            />
            <img
              src="/cy-logo-3.png"
              alt=""
              style={{
                width: '100%', height: '100%', objectFit: 'contain',
                position: 'absolute', inset: 0,
                opacity: logoStep >= 2 ? 0 : 1,
                transition: 'opacity 0.25s ease',
              }}
            />
            <img
              src="/cy-logo-2.png"
              alt=""
              style={{
                width: '100%', height: '100%', objectFit: 'contain',
                position: 'absolute', inset: 0,
                opacity: logoStep >= 1 ? 0 : 1,
                transition: 'opacity 0.25s ease',
              }}
            />
          </motion.div>

          {/* CY STUDIOS text — flings toward viewer */}
          {showText && (
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 11,
            }}>
              <motion.div
                animate={textControls}
                initial={{ opacity: 0, scale: 0.5 }}
                style={{
                  pointerEvents: 'none',
                  fontSize: 18,
                  fontWeight: 800,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  color: 'var(--ink)',
                  whiteSpace: 'nowrap',
                }}
              >
                CY STUDIOS
              </motion.div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
