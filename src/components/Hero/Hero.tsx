import styles from './Hero.module.css';
import { Button } from '../shared/Button';
import { useTranslation } from '../shared/useTranslation';

export function Hero() {
  const { t, isKorean } = useTranslation();

  return (
    <section className={styles.heroSection}>
      <div className={styles.heroBody}>
        <div className={styles.heroContent}>
          <div className={styles.heroPill}>
            <span className={styles.pillDot} />
            {t('Now Booking — Summer Cohort')}
          </div>
          <h1
            className={styles.heroHeadline}
            dangerouslySetInnerHTML={{
              __html: isKorean
                ? t('heroHeadlineHtml')
                : 'Your brand,<br>built with<br>intention.',
            }}
          />
          <p className={styles.heroSub}>
            {t('CY Studios is a boutique creative agency taking clients in cohorts — so every brand gets the attention it deserves.')}
          </p>
          <Button dataEn="Book a Consultation →" dataKr="상담 예약하기 →">
            {t('Book a Consultation →')}
          </Button>
        </div>
        <div className={styles.deviceSide}>
          {/* Device mockups — Task 5 */}
        </div>
      </div>
    </section>
  );
}
