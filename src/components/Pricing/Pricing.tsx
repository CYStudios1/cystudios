import styles from './Pricing.module.css';
import { SectionLabel } from '../shared/SectionLabel';
import { Button } from '../shared/Button';
import { useTranslation } from '../shared/useTranslation';

type CellValue = 'check' | 'dash' | string;

interface Row {
  feature: string;
  standard: CellValue;
  growth: CellValue;
  scale: CellValue;
}

const rows: Row[] = [
  { feature: 'Custom website design', standard: 'check', growth: 'check', scale: 'check' },
  { feature: 'Mobile responsive', standard: 'check', growth: 'check', scale: 'check' },
  { feature: 'Pages included', standard: '5', growth: '10', scale: 'Unlimited' },
  { feature: 'Rounds of revisions', standard: '2', growth: '4', scale: 'Unlimited' },
  { feature: 'Brand identity package', standard: 'dash', growth: 'check', scale: 'check' },
  { feature: 'Social media templates', standard: 'dash', growth: 'check', scale: 'check' },
  { feature: 'SEO optimization', standard: 'Basic', growth: 'Advanced', scale: 'Advanced' },
  { feature: 'Analytics setup', standard: 'dash', growth: 'check', scale: 'check' },
  { feature: 'E-commerce integration', standard: 'dash', growth: 'dash', scale: 'check' },
  { feature: 'Content strategy', standard: 'dash', growth: 'dash', scale: 'check' },
  { feature: 'GenAI marketing setup', standard: 'dash', growth: 'dash', scale: 'check' },
  { feature: 'Post-launch support', standard: '30 days', growth: '60 days', scale: '90 days' },
];

function Cell({ value, featured }: { value: CellValue; featured?: boolean }) {
  const cls = featured ? styles.featured : undefined;
  if (value === 'check') return <td className={cls}><span className={styles.yes}>✓</span></td>;
  if (value === 'dash') return <td className={cls}><span className={styles.no}>—</span></td>;
  return <td className={cls}>{value}</td>;
}

export function Pricing() {
  const { t } = useTranslation();

  return (
    <div id="pricing" className={styles.pricing}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <SectionLabel>{t('Pricing')}</SectionLabel>
          <h2 className={styles.headline}>{t('Invest in your brand.')}</h2>
          <p className={styles.sub}>{t('Every package includes direct access to our team. No middlemen, no runaround.')}</p>
        </div>

        <table className={styles.table}>
          <thead>
            <tr>
              <th><div className={styles.thLabel}>{t("What's included")}</div></th>
              <th>
                <div className={styles.thTier}>{t('Standard')}</div>
                <div className={`${styles.thPrice} font-inter`}>$2,500</div>
                <div className={styles.thPeriod}>/project</div>
              </th>
              <th className={styles.featured}>
                <div className={styles.thTierFeatured}>{t('Growth')} ★</div>
                <div className={`${styles.thPrice} font-inter`}>$5,000</div>
                <div className={styles.thPeriod}>/project</div>
              </th>
              <th>
                <div className={styles.thTier}>{t('Scale')}</div>
                <div className={`${styles.thPrice} font-inter`}>$8,500</div>
                <div className={styles.thPeriod}>/project</div>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.feature}>
                <td>{t(row.feature)}</td>
                <Cell value={row.standard} />
                <Cell value={row.growth} featured />
                <Cell value={row.scale} />
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td />
              <td><Button variant="outline" size="sm">{t('Get Started')}</Button></td>
              <td className={styles.featured}><Button size="sm">{t('Get Started →')}</Button></td>
              <td><Button variant="outline" size="sm">{t('Get Started')}</Button></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
