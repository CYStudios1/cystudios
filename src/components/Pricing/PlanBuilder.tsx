// TODO: add KR translations
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SectionLabel } from '../shared/SectionLabel';
import styles from './PlanBuilder.module.css';

/* ── Types ── */
type Scope = 'website' | 'social' | 'both';
type BuildTier = 'launch' | 'growth' | 'signature';
type CareTier = 'care' | 'carePlus';
type SocialTier = 'lite' | 'pro';

interface AddonDef {
  id: string;
  name: string;
  price: number | 'rush';
  scope: 'web' | 'social';
}

/* ── Data ── */
const BUILDS: Record<BuildTier, { name: string; price: number; desc: string; popular?: boolean; features: string[]; lead?: string }> = {
  launch: {
    name: 'Launch',
    price: 1500,
    desc: 'Up to 5 pages, custom, mobile-optimized.',
    features: [
      'Bilingual EN/KR available',
      'Google Business Profile + Yelp setup',
      '2 revision rounds',
      '2-week delivery',
      'Owner training session',
    ],
  },
  growth: {
    name: 'Growth',
    price: 2200,
    desc: 'Everything in Launch, plus ordering.',
    popular: true,
    lead: 'Everything in Launch, plus:',
    features: [
      'Up to 8 pages',
      'Online ordering (Toast, Square, ChowNow)',
      'Professional email setup',
      '3 revision rounds',
    ],
  },
  signature: {
    name: 'Signature',
    price: 3000,
    desc: 'Fully bilingual, full-service.',
    lead: 'Everything in Growth, plus:',
    features: [
      'Bilingual copywriting (up to 3 pages)',
      'Full ordering + delivery app sync',
      'Naver listing setup (if needed)',
      '4 revision rounds',
      '30-day post-launch support',
    ],
  },
};

const CARES: Record<CareTier, { name: string; price: number; desc: string; features: string[]; lead?: string; annual: string }> = {
  care: {
    name: 'Care',
    price: 99,
    desc: 'The essentials, handled.',
    features: [
      'Hosting, domain & security monitoring',
      'Up to 3 revision requests/mo',
      'Email support (48-hour response)',
    ],
    annual: '990/yr',
  },
  carePlus: {
    name: 'Care+',
    price: 179,
    desc: 'Hands-on, profile managed.',
    lead: 'Everything in Care, plus:',
    features: [
      'Up to 8 revision requests/mo',
      'Google Business Profile management',
      'Monthly performance snapshot',
      'Priority support (24-hour response)',
    ],
    annual: '1,790/yr',
  },
};

const SOCIALS: Record<SocialTier, { name: string; price: number; desc?: string; features: string[]; lead?: string }> = {
  lite: {
    name: 'Social Lite',
    price: 700,
    features: [
      '~8 short-form videos/mo',
      '4 motion/carousel graphics',
      'Captions EN & KR',
      'Posting + basic engagement',
      'Monthly snapshot',
    ],
  },
  pro: {
    name: 'Social Pro',
    price: 1300,
    lead: 'Everything in Lite, plus:',
    features: [
      '~12 short-form videos + 8 graphics/mo',
      'Trend response & daily engagement',
      'Monthly strategy call',
    ],
  },
};

const ADDONS: AddonDef[] = [
  { id: 'naver', name: 'Naver Listing Setup', price: 200, scope: 'web' },
  { id: 'email', name: 'Professional Email, additional', price: 25, scope: 'web' },
  { id: 'gworkspace', name: 'Google Workspace Setup', price: 75, scope: 'web' },
  { id: 'page', name: 'Additional Page', price: 150, scope: 'web' },
  { id: 'revision', name: 'Extra Revision Request', price: 75, scope: 'web' },
  { id: 'rush', name: 'Rush Delivery', price: 'rush', scope: 'web' },
  { id: 'onsite', name: 'On-Site Recording', price: 250, scope: 'social' },
];

const SOCIAL_SETUP = 500;

/* ── Helpers ── */
function fmt(n: number): string {
  return n.toLocaleString('en-US');
}

function ExpandToggle({ open, onClick }: { open: boolean; onClick: () => void }) {
  return (
    <button className={styles.toggleBtn} onClick={(e) => { e.stopPropagation(); onClick(); }} type="button">
      {open ? 'Hide details' : "See what's included"}
      <span className={`${styles.toggleArrow} ${open ? styles.toggleArrowOpen : ''}`}>▼</span>
    </button>
  );
}

function FeatureListContent({ features, lead }: { features: string[]; lead?: string }) {
  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
      style={{ overflow: 'hidden' }}
    >
      {lead && <p className={styles.featureLead}>{lead}</p>}
      <ul className={styles.featureList}>
        {features.map((f) => (
          <li key={f}>{f}</li>
        ))}
      </ul>
    </motion.div>
  );
}

/* ── Main Component ── */
export function PlanBuilder() {
  /* State */
  const [scope, setScope] = useState<Scope>('both');
  const [build, setBuild] = useState<BuildTier>('growth');
  const [care, setCare] = useState<CareTier>('care');
  const [social, setSocial] = useState<SocialTier>('lite');
  const [addons, setAddons] = useState<Set<string>>(new Set());
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [revisionOpen, setRevisionOpen] = useState(false);

  const hasWeb = scope === 'website' || scope === 'both';
  const hasSocial = scope === 'social' || scope === 'both';
  const isBundled = scope === 'both';

  /* Scope change handler */
  function handleScope(s: Scope) {
    setScope(s);
    // Reset defaults
    if (s === 'website' || s === 'both') {
      setBuild('growth');
      setCare('care');
    }
    if (s === 'social' || s === 'both') {
      setSocial('lite');
    }
    // Filter out irrelevant add-ons
    setAddons((prev) => {
      const next = new Set<string>();
      prev.forEach((id) => {
        const def = ADDONS.find((a) => a.id === id);
        if (!def) return;
        if (def.scope === 'web' && (s === 'website' || s === 'both')) next.add(id);
        if (def.scope === 'social' && (s === 'social' || s === 'both')) next.add(id);
      });
      return next;
    });
  }

  function toggleAddon(id: string) {
    setAddons((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleExpand(key: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  /* ── Totals ── */
  const buildPrice = hasWeb ? BUILDS[build].price : 0;
  const carePrice = hasWeb ? CARES[care].price : 0;
  const socialSetup = hasSocial && !isBundled ? SOCIAL_SETUP : 0;
  const socialMonthly = hasSocial ? SOCIALS[social].price : 0;

  let addonTotal = 0;
  addons.forEach((id) => {
    const def = ADDONS.find((a) => a.id === id);
    if (!def) return;
    if (def.price === 'rush') addonTotal += Math.round(buildPrice * 0.25);
    else addonTotal += def.price;
  });

  const oneTime = buildPrice + socialSetup + addonTotal;
  const monthly = carePrice + socialMonthly;
  const firstMonthCareCredit = isBundled ? carePrice : 0;
  const deposit = hasWeb ? Math.round(oneTime * 0.5) : oneTime;
  const dueAtStart = deposit + (monthly - firstMonthCareCredit);

  const missingCare = hasWeb && !care;
  const canProceed = !missingCare;

  /* CTA label */
  let ctaLabel = 'Get started \u2192';
  if (isBundled) ctaLabel = 'Start my bundle \u2192';
  else if (scope === 'social') ctaLabel = 'Start social \u2192';

  /* Active addons filtered by scope */
  const visibleAddons = ADDONS.filter((a) => {
    if (a.scope === 'web') return hasWeb;
    if (a.scope === 'social') return hasSocial;
    return false;
  });

  return (
    <motion.section
      id="pricing"
      className={styles.section}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
    >
      <div className={styles.inner}>
        {/* Header */}
        <div className={styles.header}>
          <SectionLabel>Pricing</SectionLabel>
          <h2 className={styles.headline}>Build your plan.</h2>
          <p className={styles.sub}>Pick what you need — we'll handle the rest. No hidden fees, no contracts.</p>
        </div>

        <div className={styles.layout}>
          {/* ── LEFT: Configurator ── */}
          <div className={styles.configurator}>

            {/* Scope Chooser */}
            <div className={styles.sectionLabel}>I'm here for&hellip;</div>
            <div className={styles.scopeGrid}>
              {([
                { key: 'website' as Scope, title: 'A website', sub: 'Build + required Care' },
                { key: 'social' as Scope, title: 'Social only', sub: 'No website needed' },
                { key: 'both' as Scope, title: 'Both — best value', sub: 'Bundle discount applies' },
              ]).map((s) => (
                <div
                  key={s.key}
                  className={`${styles.scopeCard} ${scope === s.key ? styles.scopeCardSelected : ''}`}
                  onClick={() => handleScope(s.key)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && handleScope(s.key)}
                >
                  <div className={styles.scopeCardTitle}>{s.title}</div>
                  <div className={styles.scopeCardSub}>{s.sub}</div>
                </div>
              ))}
            </div>

            {/* ── Website Module ── */}
            <AnimatePresence>
              {hasWeb && (
                <motion.div
                  key="web-module"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{ overflow: 'hidden' }}
                >
                  <div className={styles.moduleBlock}>
                    <div className={styles.moduleHeader}>
                      <span className={styles.moduleTitle}>Website</span>
                      <span className={styles.chip}>Care required</span>
                    </div>

                    {/* Pick a build */}
                    <div className={styles.groupLabel}>Pick a build</div>
                    <div className={`${styles.cardGrid} ${styles.cardGrid3}`}>
                      {(Object.entries(BUILDS) as [BuildTier, typeof BUILDS[BuildTier]][]).map(([key, b]) => (
                        <div
                          key={key}
                          className={`${styles.card} ${build === key ? styles.cardSelected : ''}`}
                          onClick={() => setBuild(key)}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => e.key === 'Enter' && setBuild(key)}
                        >
                          {b.popular && <div className={styles.popularBadge}>Popular</div>}
                          <div className={styles.cardHeader}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                              <div className={`${styles.indicator} ${build === key ? styles.indicatorActive : ''}`}>
                                {build === key && <div className={styles.indicatorDot} />}
                              </div>
                              <span className={styles.cardName}>{b.name}</span>
                            </div>
                            <span className={`${styles.cardPrice} font-inter`}>{fmt(b.price)}</span>
                          </div>
                          <div className={styles.cardDesc}>{b.desc}</div>
                          <ExpandToggle open={expanded.has(`build-${key}`)} onClick={() => toggleExpand(`build-${key}`)} />
                          <AnimatePresence>
                            {expanded.has(`build-${key}`) && (
                              <FeatureListContent features={b.features} lead={b.lead} />
                            )}
                          </AnimatePresence>
                        </div>
                      ))}
                    </div>

                    {/* Pick a Care plan */}
                    <div className={styles.groupLabel}>
                      Pick a Care plan
                      <span className={styles.requiredLabel}>Required</span>
                    </div>
                    <div className={`${styles.cardGrid} ${styles.cardGrid2}`}>
                      {(Object.entries(CARES) as [CareTier, typeof CARES[CareTier]][]).map(([key, c]) => (
                        <div
                          key={key}
                          className={`${styles.card} ${care === key ? styles.cardSelected : ''}`}
                          onClick={() => setCare(key)}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => e.key === 'Enter' && setCare(key)}
                        >
                          <div className={styles.cardHeader}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                              <div className={`${styles.indicator} ${care === key ? styles.indicatorActive : ''}`}>
                                {care === key && <div className={styles.indicatorDot} />}
                              </div>
                              <span className={styles.cardName}>{c.name}</span>
                            </div>
                            <div>
                              <span className={`${styles.cardPrice} font-inter`}>{fmt(c.price)}</span>
                              <span className={styles.cardPricePeriod}>/mo</span>
                            </div>
                          </div>
                          <div className={styles.cardDesc}>{c.desc}</div>
                          <ExpandToggle open={expanded.has(`care-${key}`)} onClick={() => toggleExpand(`care-${key}`)} />
                          <AnimatePresence>
                            {expanded.has(`care-${key}`) && (
                              <FeatureListContent features={c.features} lead={c.lead} />
                            )}
                          </AnimatePresence>
                        </div>
                      ))}
                    </div>

                    {/* Revision info note */}
                    <div className={styles.infoNote}>
                      <button className={styles.infoNoteBtn} onClick={() => setRevisionOpen(!revisionOpen)} type="button">
                        What's a revision request?
                        <span className={`${styles.toggleArrow} ${revisionOpen ? styles.toggleArrowOpen : ''}`}>▼</span>
                      </button>
                      <AnimatePresence>
                        {revisionOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            style={{ overflow: 'hidden' }}
                          >
                            <p className={styles.infoNoteText}>
                              A single set of small changes — updating hours, swapping a few photos, adding a menu item or price.
                              Larger work (a new page, redesign, or new features) is quoted separately. Extra requests are 75 each.
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Social Module ── */}
            <AnimatePresence>
              {hasSocial && (
                <motion.div
                  key="social-module"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{ overflow: 'hidden' }}
                >
                  <div className={styles.moduleBlock}>
                    <div className={styles.moduleHeader}>
                      <span className={styles.moduleTitle}>Social Media</span>
                    </div>
                    <p className={styles.cardDesc} style={{ marginBottom: 16 }}>
                      We handle filming, editing, and posting. Just show up and do what you do.
                    </p>

                    {/* Setup line */}
                    <div className={styles.setupLine}>
                      <span className={styles.setupLineLabel}>Social Setup</span>
                      <div className={`${styles.setupLinePrice} font-inter`}>
                        {isBundled ? (
                          <>
                            <span className={styles.strikethrough}>{fmt(SOCIAL_SETUP)}</span>
                            <span className={styles.waived}>0 — Waived with bundle</span>
                          </>
                        ) : (
                          <>{fmt(SOCIAL_SETUP)} <span className={styles.cardPricePeriod}>one-time</span></>
                        )}
                      </div>
                    </div>

                    {/* Pick a monthly plan */}
                    <div className={styles.groupLabel}>Pick a monthly plan</div>
                    <div className={`${styles.cardGrid} ${styles.cardGrid2}`}>
                      {(Object.entries(SOCIALS) as [SocialTier, typeof SOCIALS[SocialTier]][]).map(([key, s]) => (
                        <div
                          key={key}
                          className={`${styles.card} ${social === key ? styles.cardSelected : ''}`}
                          onClick={() => setSocial(key)}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => e.key === 'Enter' && setSocial(key)}
                        >
                          <div className={styles.cardHeader}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                              <div className={`${styles.indicator} ${social === key ? styles.indicatorActive : ''}`}>
                                {social === key && <div className={styles.indicatorDot} />}
                              </div>
                              <span className={styles.cardName}>{s.name}</span>
                            </div>
                            <div>
                              <span className={`${styles.cardPrice} font-inter`}>{fmt(s.price)}</span>
                              <span className={styles.cardPricePeriod}>/mo</span>
                            </div>
                          </div>
                          <ExpandToggle open={expanded.has(`social-${key}`)} onClick={() => toggleExpand(`social-${key}`)} />
                          <AnimatePresence>
                            {expanded.has(`social-${key}`) && (
                              <FeatureListContent features={s.features} lead={s.lead} />
                            )}
                          </AnimatePresence>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Add-ons ── */}
            {visibleAddons.length > 0 && (
              <div className={styles.moduleBlock}>
                <div className={styles.moduleHeader}>
                  <span className={styles.moduleTitle}>Add-ons</span>
                </div>
                <div className={styles.addonGrid}>
                  {visibleAddons.map((a) => {
                    const checked = addons.has(a.id);
                    const displayPrice = a.price === 'rush'
                      ? `+${fmt(Math.round(buildPrice * 0.25))} (25% of build)`
                      : fmt(a.price);
                    return (
                      <div
                        key={a.id}
                        className={`${styles.addonCard} ${checked ? styles.addonCardSelected : ''}`}
                        onClick={() => toggleAddon(a.id)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => e.key === 'Enter' && toggleAddon(a.id)}
                      >
                        <div className={`${styles.indicator} ${styles.indicatorCheck} ${checked ? styles.indicatorActive : ''}`}>
                          {checked && <span className={styles.indicatorTick}>✓</span>}
                        </div>
                        <div className={styles.addonInfo}>
                          <div className={styles.addonName}>{a.name}</div>
                          <div className={`${styles.addonPrice} font-inter`}>{displayPrice}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* ── RIGHT: Summary ── */}
          <div className={styles.summary}>
            <div className={styles.summaryCard}>
              <div className={styles.summaryTitle}>Your plan</div>

              <ul className={styles.summaryItems}>
                {hasWeb && (
                  <>
                    <li className={styles.summaryItem}>
                      <div>
                        <div className={styles.summaryItemName}>{BUILDS[build].name} Build</div>
                        <div className={styles.summaryItemSub}>one-time</div>
                      </div>
                      <span className={`${styles.summaryItemPrice} font-inter`}>{fmt(BUILDS[build].price)}</span>
                    </li>
                    <li className={styles.summaryItem}>
                      <div>
                        <div className={styles.summaryItemName}>{CARES[care].name}</div>
                        <div className={styles.summaryItemSub}>monthly{isBundled ? ' — 1st mo free' : ''}</div>
                      </div>
                      <span className={`${styles.summaryItemPrice} font-inter`}>{fmt(CARES[care].price)}/mo</span>
                    </li>
                  </>
                )}
                {hasSocial && (
                  <>
                    {!isBundled && (
                      <li className={styles.summaryItem}>
                        <div>
                          <div className={styles.summaryItemName}>Social Setup</div>
                          <div className={styles.summaryItemSub}>one-time</div>
                        </div>
                        <span className={`${styles.summaryItemPrice} font-inter`}>{fmt(SOCIAL_SETUP)}</span>
                      </li>
                    )}
                    {isBundled && (
                      <li className={styles.summaryItem}>
                        <div>
                          <div className={styles.summaryItemName}>Social Setup</div>
                          <div className={styles.summaryItemSub}>one-time</div>
                        </div>
                        <span className={styles.summaryItemWaived}>Waived</span>
                      </li>
                    )}
                    <li className={styles.summaryItem}>
                      <div>
                        <div className={styles.summaryItemName}>{SOCIALS[social].name}</div>
                        <div className={styles.summaryItemSub}>monthly</div>
                      </div>
                      <span className={`${styles.summaryItemPrice} font-inter`}>{fmt(SOCIALS[social].price)}/mo</span>
                    </li>
                  </>
                )}
                {/* Add-ons */}
                {Array.from(addons).map((id) => {
                  const def = ADDONS.find((a) => a.id === id);
                  if (!def) return null;
                  const p = def.price === 'rush' ? Math.round(buildPrice * 0.25) : def.price;
                  return (
                    <li key={id} className={styles.summaryItem}>
                      <div>
                        <div className={styles.summaryItemName}>{def.name}</div>
                        <div className={styles.summaryItemSub}>one-time</div>
                      </div>
                      <span className={`${styles.summaryItemPrice} font-inter`}>{fmt(p)}</span>
                    </li>
                  );
                })}
              </ul>

              {/* Bundle callout */}
              {isBundled && (
                <div className={styles.bundleCallout}>
                  <div className={styles.bundleCalloutText}>
                    Bundle savings: 500 setup waived + first month Care free ({fmt(carePrice)} value)
                  </div>
                </div>
              )}

              <div className={styles.summaryDivider} />

              {/* Totals */}
              <div className={styles.summaryTotals}>
                {oneTime > 0 && (
                  <div className={styles.summaryTotalRow}>
                    <span className={styles.summaryTotalLabel}>One-time build</span>
                    <span className={`${styles.summaryTotalValue} font-inter`}>{fmt(oneTime)}</span>
                  </div>
                )}
                {monthly > 0 && (
                  <div className={styles.summaryTotalRow}>
                    <span className={styles.summaryTotalLabel}>Then monthly</span>
                    <span className={`${styles.summaryTotalValue} font-inter`}>{fmt(monthly)}</span>
                  </div>
                )}
                <div className={styles.summaryDueRow}>
                  <div>
                    <div className={styles.summaryDueLabel}>
                      {hasWeb ? 'Due at start (50% deposit)' : 'Due at start'}
                    </div>
                    {isBundled && (
                      <div className={styles.summaryDueSub}>
                        First month Care free applied
                      </div>
                    )}
                  </div>
                  <span className={`${styles.summaryDueValue} font-inter`}>{fmt(dueAtStart)}</span>
                </div>
              </div>

              {/* CTA */}
              {canProceed ? (
                <a
                  href="https://calendly.com/design-cy-studios/30min"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.ctaBtn}
                >
                  {ctaLabel}
                </a>
              ) : (
                <div className={`${styles.ctaBtn} ${styles.ctaBtnDisabled}`}>{ctaLabel}</div>
              )}

              {hasWeb && (
                <p className={styles.footnote}>
                  Pay Care annually and get 2 months free — Care 990/yr &middot; Care+ 1,790/yr
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
