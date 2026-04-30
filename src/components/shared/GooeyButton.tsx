import styles from './GooeyButton.module.css';
import { useTranslation } from './useTranslation';

interface GooeyButtonProps {
  children: React.ReactNode;
  className?: string;
}

export function GooeyButton({ children, className = '' }: GooeyButtonProps) {
  const { t } = useTranslation();
  return (
    <div className={styles.gooeyWrap}>
      <button className={`${styles.btn} ${className}`}>
        {children}
      </button>
      <div className={styles.gooeyPill}>
        <span>{t("It's Free")}</span>
      </div>
    </div>
  );
}
