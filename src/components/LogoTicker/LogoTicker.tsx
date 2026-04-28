import styles from './LogoTicker.module.css';

const logos = [
  { src: '/logo-nakwon.png', alt: 'Nak Won Catering' },
  { src: '/logo-burgshaw.png', alt: 'Burg & Shaw' },
  { src: '/logo-colorbridge.png', alt: 'Colorbridge' },
];

// 4 copies for seamless scroll (translateX(-25%) loops perfectly)
const allLogos = [...logos, ...logos, ...logos, ...logos];

export function LogoTicker() {
  return (
    <div className={styles.logoSection} id="services">
      <div style={{ overflow: 'hidden', position: 'relative', zIndex: 1 }}>
        <div className={styles.logoTrack}>
          {allLogos.map((logo, i) => (
            <div key={i} className={styles.logoItem}>
              <img src={logo.src} alt={logo.alt} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
