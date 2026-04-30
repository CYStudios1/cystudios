import styles from './Hero.module.css';

export function ArcBackground() {
  return (
    <div className={styles.bgLayer}>
      <svg
        className={styles.arcsSvg}
        viewBox="0 0 600 700"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMaxYMid meet"
      >
        <circle className={styles.ring} cx="300" cy="350" r="80"  stroke="#1a1008" strokeWidth="1" style={{ '--op': 0.07,  animationDuration: '4.5s',  animationDelay: '0s' } as React.CSSProperties} />
        <circle className={styles.ring} cx="300" cy="350" r="140" stroke="#1a1008" strokeWidth="1" style={{ '--op': 0.065, animationDuration: '4.8s',  animationDelay: '-0.35s' } as React.CSSProperties} />
        <circle className={styles.ring} cx="300" cy="350" r="200" stroke="#1a1008" strokeWidth="1" style={{ '--op': 0.06,  animationDuration: '5.1s',  animationDelay: '-0.7s' } as React.CSSProperties} />
        <circle className={styles.ring} cx="300" cy="350" r="265" stroke="#1a1008" strokeWidth="1" style={{ '--op': 0.055, animationDuration: '5.4s',  animationDelay: '-1.05s' } as React.CSSProperties} />
        <circle className={styles.ring} cx="300" cy="350" r="335" stroke="#1a1008" strokeWidth="1" style={{ '--op': 0.05,  animationDuration: '5.7s',  animationDelay: '-1.4s' } as React.CSSProperties} />
        <circle className={styles.ring} cx="300" cy="350" r="410" stroke="#1a1008" strokeWidth="1" style={{ '--op': 0.045, animationDuration: '6.0s',  animationDelay: '-1.75s' } as React.CSSProperties} />
        <circle className={styles.ring} cx="300" cy="350" r="490" stroke="#1a1008" strokeWidth="1" style={{ '--op': 0.04,  animationDuration: '6.3s',  animationDelay: '-2.1s' } as React.CSSProperties} />
        <circle className={styles.ringRed} cx="300" cy="350" r="575" stroke="#b83228" strokeWidth="0.75" style={{ animationDuration: '7s', animationDelay: '-2.8s' }} />
        <line className={styles.crosshair} x1="280" y1="350" x2="320" y2="350" stroke="#b83228" strokeWidth="0.75" />
        <line className={styles.crosshair} x1="300" y1="330" x2="300" y2="372" stroke="#b83228" strokeWidth="0.75" style={{ animationDelay: '-1.5s' }} />
        <circle cx="300" cy="350" r="4" fill="#b83228" opacity="0.2" />
      </svg>
      <div className={styles.mark} style={{ width: 5, height: 5, top: '28%', left: '68%', animationDelay: '0s' }} />
      <div className={styles.mark} style={{ width: 4, height: 4, top: '62%', left: '82%', animationDelay: '1.2s' }} />
      <div className={styles.mark} style={{ width: 6, height: 6, top: '44%', left: '74%', animationDelay: '2.4s' }} />
    </div>
  );
}
