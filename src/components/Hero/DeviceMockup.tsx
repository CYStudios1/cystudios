import { useState, useEffect } from 'react';
import styles from './DeviceMockup.module.css';

const desktopImages = ['/desktop-1.png', '/desktop-2.png', '/desktop-3.png'];
const mobileImages = ['/mobile-1.png', '/mobile-2.png', '/mobile-3.png'];

export function DeviceMockup() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % desktopImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.deviceWrapper}>
      {/* Laptop */}
      <div className={styles.laptop3d}>
        <div className={styles.screenGlow} />
        <div className={styles.laptopLid}>
          <div className={styles.laptopBezel}>
            <div className={styles.laptopScreen}>
              <div className={styles.screenSlides}>
                {desktopImages.map((src, i) => (
                  <img
                    key={src}
                    src={src}
                    alt=""
                    className={i === activeIndex ? styles.activeSlide : undefined}
                  />
                ))}
              </div>
              <div className={styles.screenGlare} />
            </div>
            <div className={styles.cameraDot} />
          </div>
        </div>
        {/* Base hidden via CSS */}
        <div className={styles.laptopBase} />
        <div className={styles.laptopFoot} />
      </div>

      {/* iPhone */}
      <div className={styles.iphone}>
        <div className={styles.iphoneFrame}>
          <div className={styles.iphoneBezel}>
            <div className={styles.iphoneScreen}>
              <div className={styles.iphoneNotch} />
              <div className={styles.phoneSlides}>
                {mobileImages.map((src, i) => (
                  <img
                    key={src}
                    src={src}
                    alt=""
                    className={i === activeIndex ? styles.activeSlide : undefined}
                  />
                ))}
              </div>
              <div className={styles.iphoneHome} />
              <div className={styles.iphoneGlare} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
