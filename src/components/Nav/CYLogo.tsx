import styles from './CYLogo.module.css';

export function CYLogo() {
  return (
    <div className={styles.wrap}>
      {/* Base: 2 filled (revealed on hover) */}
      <img src="/cy-logo.png" alt="CY" className={styles.base} />
      {/* Layers: on hover, these fade OUT to reveal 2-filled underneath */}
      {/* Order: middle-right disappears first, then bottom-left, then bottom-right */}
      <img src="/cy-logo-1.png" alt="" className={`${styles.layerOut} ${styles.layerOut1}`} />
      <img src="/cy-logo-3.png" alt="" className={`${styles.layerOut} ${styles.layerOut2}`} />
      <img src="/cy-logo-2.png" alt="" className={`${styles.layerOut} ${styles.layerOut3}`} />
    </div>
  );
}
