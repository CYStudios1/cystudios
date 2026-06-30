import styles from './GooeyButton.module.css';
import { useTranslation } from './useTranslation';

interface GooeyButtonProps {
  children: React.ReactNode;
  className?: string;
  href?: string;
}

export function GooeyButton({ children, className = '', href }: GooeyButtonProps) {
  const { t } = useTranslation();
  return (
    <div className={styles.gooeyWrap}>
      {href ? (
        <a href={href} target="_blank" rel="noopener noreferrer" className={`${styles.btn} ${className}`}>
          {children}
        </a>
      ) : (
        <button className={`${styles.btn} ${className}`}>
          {children}
        </button>
      )}
      <div className={styles.gooeyPill}>
        <span>{t("It's Free")}</span>
      </div>
    </div>
  );
}
