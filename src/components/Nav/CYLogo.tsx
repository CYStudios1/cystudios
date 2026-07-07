import styles from './CYLogo.module.css';

export function CYLogo() {
  return (
    <div className={styles.wrap}>
      <img src="/cy-logo.png" alt="CY" className={styles.base} />
      <img src="/cy-logo-1.png" alt="" className={`${styles.layer} ${styles.layer1}`} />
      <img src="/cy-logo-3.png" alt="" className={`${styles.layer} ${styles.layer2}`} />
      <img src="/cy-logo-2.png" alt="" className={`${styles.layer} ${styles.layer3}`} />
    </div>
  );
}
