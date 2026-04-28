# CY Studios Website — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the CY Studios single-page marketing website from a complete HTML prototype, using React + TypeScript with CSS Modules and Framer Motion.

**Architecture:** One component per section (Nav, Hero, LogoTicker, About, SpringCohort, SummerCohort, Pricing, FAQ, Footer), each with its own CSS Module. Global tokens in `index.css`. A `LanguageContext` provides EN/KR translation. All content is static (no CMS). Images served from `/public`.

**Tech Stack:** Vite, React 19, TypeScript, CSS Modules, Framer Motion 12

**Reference:** `full-site-complete.html` in project root is the pixel-perfect HTML prototype. All CSS values, animations, and translations are extracted from this file.

---

## File Structure

```
src/
├── main.tsx                    # Entry point (existing)
├── App.tsx                     # Composes all sections
├── index.css                   # Global tokens, fonts, resets, smooth scroll
├── context/
│   └── LanguageContext.tsx      # EN/KR toggle state + translations
├── data/
│   └── translations.ts         # Translation map object
├── components/
│   ├── Nav/
│   │   ├── Nav.tsx
│   │   └── Nav.module.css
│   ├── Hero/
│   │   ├── Hero.tsx
│   │   ├── Hero.module.css
│   │   ├── ArcBackground.tsx   # SVG arcs + pulsing dots
│   │   ├── DeviceMockup.tsx    # Laptop + iPhone with image crossfade
│   │   └── DeviceMockup.module.css
│   ├── LogoTicker/
│   │   ├── LogoTicker.tsx
│   │   └── LogoTicker.module.css
│   ├── About/
│   │   ├── About.tsx
│   │   └── About.module.css
│   ├── SpringCohort/
│   │   ├── SpringCohort.tsx
│   │   └── SpringCohort.module.css
│   ├── SummerCohort/
│   │   ├── SummerCohort.tsx
│   │   └── SummerCohort.module.css
│   ├── Pricing/
│   │   ├── Pricing.tsx
│   │   └── Pricing.module.css
│   ├── FAQ/
│   │   ├── FAQ.tsx
│   │   └── FAQ.module.css
│   ├── Footer/
│   │   ├── Footer.tsx
│   │   └── Footer.module.css
│   └── shared/
│       ├── Button.tsx          # Reusable button (primary, outline, sm)
│       ├── Button.module.css
│       ├── SectionLabel.tsx    # Reusable red uppercase label
│       └── useTranslation.ts  # Hook to read from LanguageContext
public/
├── desktop-1.png              # David Yang screenshot (existing)
├── desktop-2.png              # Burg & Shaw screenshot (existing)
├── desktop-3.png              # Colorbridge screenshot (existing)
├── mobile-1.png               # David Yang mobile (existing)
├── mobile-2.png               # Burg & Shaw mobile (existing)
├── mobile-3.png               # Colorbridge mobile (existing)
├── logo-nakwon.png            # Nak Won Catering logo (existing)
├── logo-burgshaw.png          # Burg & Shaw logo (existing)
└── logo-colorbridge.png       # Colorbridge logo (existing)
```

---

### Task 1: Global Design System — Tokens, Fonts, Resets

**Files:**
- Modify: `src/index.css` (replace Vite defaults)
- Modify: `index.html` (add Google Fonts link)
- Delete: `src/App.css` (Vite default, not needed)

- [ ] **Step 1: Replace `index.html` head with font imports**

```html
<!-- In <head>, replace existing content after <meta> tags -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Raleway:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900&family=Inter:wght@900&display=swap" rel="stylesheet">
<title>CY Studios</title>
```

- [ ] **Step 2: Replace `src/index.css` with global tokens**

```css
/* ── Reset ── */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }
body {
  font-family: 'Raleway', sans-serif;
  -webkit-font-smoothing: antialiased;
  background: var(--bg);
  color: var(--ink);
}
a { text-decoration: none; color: inherit; }
button { cursor: pointer; }
img { display: block; max-width: 100%; }

/* ── Color tokens ── */
:root {
  --bg: #F2E4D8;
  --surface: #EDD9C8;
  --ink: #1A1008;
  --ink-muted: #5A4E44;
  --accent: #B83228;
  --accent-warm: #D44A28;
  --border: rgba(26,16,8,0.08);
  --border-card: rgba(26,16,8,0.06);
  --ticker-bg: rgba(26,16,8,0.04);
}

/* ── Font: Inter for pricing ── */
.font-inter { font-family: 'Inter', sans-serif; }
```

- [ ] **Step 3: Delete `src/App.css`**

```bash
rm src/App.css
```

- [ ] **Step 4: Verify dev server runs clean**

Run: `npm run dev`
Expected: Vite starts, no CSS errors, blank terracotta page at localhost:5173

- [ ] **Step 5: Commit**

```bash
git add index.html src/index.css
git rm src/App.css
git commit -m "feat: global design system tokens, fonts, resets"
```

---

### Task 2: Shared Components — Button, SectionLabel, useTranslation

**Files:**
- Create: `src/components/shared/Button.tsx`
- Create: `src/components/shared/Button.module.css`
- Create: `src/components/shared/SectionLabel.tsx`
- Create: `src/data/translations.ts`
- Create: `src/context/LanguageContext.tsx`
- Create: `src/components/shared/useTranslation.ts`

- [ ] **Step 1: Create Button component**

```tsx
// src/components/shared/Button.tsx
import styles from './Button.module.css';

type ButtonVariant = 'primary' | 'outline';
type ButtonSize = 'default' | 'sm';

interface ButtonProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  onClick?: () => void;
  className?: string;
  dataEn?: string;
  dataKr?: string;
}

export function Button({ children, variant = 'primary', size = 'default', onClick, className = '', dataEn, dataKr }: ButtonProps) {
  const cls = [
    styles.btn,
    variant === 'outline' ? styles.outline : '',
    size === 'sm' ? styles.sm : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <button className={cls} onClick={onClick} data-en={dataEn} data-kr={dataKr}>
      {children}
    </button>
  );
}
```

- [ ] **Step 2: Create Button CSS Module**

```css
/* src/components/shared/Button.module.css */
.btn {
  font-family: 'Raleway', sans-serif;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 14px 30px;
  border-radius: 6px;
  display: inline-block;
  border: none;
  color: #fff;
  background: linear-gradient(110deg, #b83228 0%, #d44a28 55%, #b83228 100%);
  background-size: 200% 100%;
  background-position: 100% 0;
  box-shadow: 0 4px 14px rgba(184,50,40,0.32), 0 1px 3px rgba(184,50,40,0.18);
  transition:
    background-position 0.6s cubic-bezier(0.25, 0.1, 0.25, 1),
    box-shadow 0.4s cubic-bezier(0.25, 0.1, 0.25, 1),
    transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.btn:hover {
  background-position: 0% 0;
  transform: translateY(-2px);
  box-shadow: 0 8px 22px rgba(184,50,40,0.42), 0 3px 6px rgba(184,50,40,0.22);
}

.btn:active {
  transform: translateY(0);
  box-shadow: 0 4px 12px rgba(184,50,40,0.3);
  transition:
    background-position 0.6s cubic-bezier(0.25, 0.1, 0.25, 1),
    box-shadow 0.15s ease,
    transform 0.15s ease;
}

.sm {
  font-size: 11px;
  padding: 9px 22px;
  border-radius: 5px;
}

.outline {
  background: transparent;
  color: var(--ink);
  border: 1.5px solid rgba(26,16,8,0.2);
  box-shadow: none;
}

.outline:hover {
  border-color: var(--accent);
  color: var(--accent);
  background: rgba(184,50,40,0.05);
  box-shadow: none;
  transform: translateY(-2px);
}
```

- [ ] **Step 3: Create SectionLabel component**

```tsx
// src/components/shared/SectionLabel.tsx
interface SectionLabelProps {
  children: React.ReactNode;
  className?: string;
}

export function SectionLabel({ children, className = '' }: SectionLabelProps) {
  return (
    <div className={className} style={{
      fontSize: '10px',
      fontWeight: 700,
      letterSpacing: '0.2em',
      textTransform: 'uppercase' as const,
      color: 'var(--accent)',
      marginBottom: '20px',
    }}>
      {children}
    </div>
  );
}
```

- [ ] **Step 4: Create translations data**

```ts
// src/data/translations.ts
export const translations: Record<string, string> = {
  // Nav
  'Services': '서비스',
  'About': '소개',
  'Cohorts': '코호트',
  'Pricing': '요금',
  'FAQ': '자주 묻는 질문',
  'Book a Consultation': '상담 예약하기',

  // Hero
  'Now Booking — Summer Cohort': '여름 코호트 — 모집 중',
  'Your brand, built with intention.': '당신의 브랜드, 의도를 담아 만듭니다.',
  'CY Studios is a boutique creative agency taking clients in cohorts — so every brand gets the attention it deserves.': 'CY Studios는 소수의 클라이언트만 받는 부티크 크리에이티브 에이전시입니다 — 모든 브랜드가 마땅히 받아야 할 관심을 드리기 위해.',
  'Book a Consultation →': '상담 예약하기 →',

  // About
  'Who We Are': '우리에 대해',
  'Two designers who got tired of the agency grind.': '에이전시의 매너리즘에서 벗어난 두 디자이너.',
  'We started CY Studios because we saw the same story play out — talented brands stuck in a queue of 40+ clients, getting templated work and distracted attention. We believe every brand deserves a team that\'s fully locked in.': 'CY Studios를 시작한 이유는 간단합니다 — 재능 있는 브랜드들이 40명이 넘는 대기열에 묻혀 템플릿 같은 결과물을 받는 걸 봤기 때문입니다. 모든 브랜드는 온전히 집중하는 팀을 만날 자격이 있습니다.',
  'Design & Strategy': '디자인 & 전략',
  'Obsessed with craft. Believes every pixel tells a story — makes sure yours tells the right one.': '디테일에 집착합니다. 모든 픽셀이 이야기를 전한다고 믿으며 — 당신의 이야기가 제대로 전달되도록 합니다.',
  'Development & Growth': '개발 & 성장',
  'Turns vision into performance. Builds brands that don\'t just look good — they grow.': '비전을 성과로 바꿉니다. 보기만 좋은 게 아니라 — 실제로 성장하는 브랜드를 만듭니다.',

  // Spring Cohort
  'Spring Cohort': '봄 코호트',
  'Work that speaks for itself.': '결과물이 증명합니다.',
  'Premium barbershop rebrand & website — a full identity overhaul that matches their craft.': '프리미엄 바버샵의 리브랜딩 & 웹사이트 — 그들의 장인 정신에 걸맞은 완전한 아이덴티티 재구성.',
  'Korean catering service — site & branding that honors tradition while feeling fresh.': '한식 케이터링 서비스 — 전통을 존중하면서도 신선한 느낌의 사이트 & 브랜딩.',
  'Beauty supply e-commerce & digital presence — bringing a local favorite online.': '뷰티 서플라이 이커머스 & 디지털 프레즌스 — 동네 인기 매장을 온라인으로.',

  // Summer Cohort
  'Summer Cohort — Now Booking': '여름 코호트 — 모집 중',
  'Three spots. Three brands. Fully locked in.': '세 자리. 세 브랜드. 온전한 집중.',
  'We take on three clients per cohort so every project gets our full attention. Summer spots are open — here\'s who we\'re looking for.': '코호트당 세 팀만 받습니다. 모든 프로젝트에 온전히 집중하기 위해서입니다. 여름 자리가 열렸습니다.',
  'Open': '모집 중',
  'Looking for a brand ready to invest in a website that actually converts.': '실제로 전환을 만들어내는 웹사이트에 투자할 준비가 된 브랜드를 찾습니다.',
  'Looking for a business that needs a complete digital presence — site, social, SEO.': '웹사이트, 소셜 미디어, SEO까지 — 완전한 디지털 프레즌스가 필요한 비즈니스를 찾습니다.',
  'Looking for a founder who wants to build something intentional from the ground up.': '처음부터 의도를 담아 무언가를 만들고 싶은 창업자를 찾습니다.',

  // Pricing
  'Invest in your brand.': '브랜드에 투자하세요.',
  'Every package includes direct access to our team. No middlemen, no runaround.': '모든 패키지에는 저희 팀과의 직접 소통이 포함됩니다. 중간 과정 없이, 바로.',
  'What\'s included': '포함 내역',
  'Standard': '스탠다드',
  'Growth': '그로스',
  'Scale': '스케일',
  '/project': '/프로젝트',
  'Get Started': '시작하기',
  'Get Started →': '시작하기 →',
  'Custom website design': '맞춤형 웹사이트 디자인',
  'Mobile responsive': '모바일 반응형',
  'Pages included': '포함 페이지 수',
  'Unlimited': '무제한',
  'Rounds of revisions': '수정 횟수',
  'Brand identity package': '브랜드 아이덴티티 패키지',
  'Social media templates': '소셜 미디어 템플릿',
  'SEO optimization': 'SEO 최적화',
  'Basic': '기본',
  'Advanced': '심화',
  'Analytics setup': '애널리틱스 설정',
  'E-commerce integration': '이커머스 연동',
  'Content strategy': '콘텐츠 전략',
  'GenAI marketing setup': 'GenAI 마케팅 설정',
  'Post-launch support': '런칭 후 지원',
  '30 days': '30일',
  '60 days': '60일',
  '90 days': '90일',

  // FAQ
  'Questions we get asked a lot.': '자주 받는 질문들.',
  'Still have questions?': '더 궁금한 점이 있으신가요?',
  'What does the cohort model mean for my project?': '코호트 모델이 제 프로젝트에 어떤 의미인가요?',
  'It means we only take on three clients at a time. Your project gets our full creative energy — no context-switching, no waiting in a queue.': '한 번에 세 팀만 받는다는 뜻입니다. 당신의 프로젝트에 저희의 모든 창의적 에너지가 집중됩니다 — 다른 일에 신경 쓰거나, 대기할 필요 없이.',
  'How long does a typical project take?': '일반적으로 프로젝트 기간이 얼마나 걸리나요?',
  'Most projects run 4–8 weeks depending on scope. Standard packages are typically 4–5 weeks, Growth runs 6–7 weeks, and Scale projects can take up to 8 weeks.': '대부분의 프로젝트는 범위에 따라 4~8주가 소요됩니다. 스탠다드는 보통 4~5주, 그로스는 6~7주, 스케일은 최대 8주까지 걸릴 수 있습니다.',
  'Do you work with clients outside your area?': '지역 외 클라이언트와도 작업하시나요?',
  'Absolutely. Everything we do is remote-friendly. We\'ve worked with brands across the country.': '물론입니다. 모든 작업은 원격으로 진행 가능합니다. 전국의 브랜드들과 함께해 왔습니다.',
  'What if I need changes after launch?': '런칭 후에 수정이 필요하면 어떻게 하나요?',
  'Every package includes post-launch support (30–90 days depending on your plan). After that, we offer maintenance retainers.': '모든 패키지에는 런칭 후 지원이 포함됩니다 (플랜에 따라 30~90일). 이후에는 유지보수 리테이너를 제공합니다.',
  'Can I upgrade my package after we start?': '시작한 후에 패키지를 업그레이드할 수 있나요?',
  'Yes — we can adjust scope and pricing mid-project. We\'re flexible.': '네 — 프로젝트 중간에 범위와 요금을 조정할 수 있습니다. 유연하게 대응합니다.',
  'What do I need to have ready before we start?': '시작 전에 무엇을 준비해야 하나요?',
  'Just a clear idea of what your brand does and who it serves. We handle the rest — content strategy, copy direction, design, and development.': '브랜드가 무엇을 하고 누구를 위한 것인지 명확한 아이디어만 있으면 됩니다. 나머지는 저희가 — 콘텐츠 전략, 카피 방향, 디자인, 개발까지 모두 담당합니다.',

  // Footer
  'Ready to build something intentional?': '의도를 담은 무언가를 만들 준비가 되셨나요?',
  'Book a free consultation — no pressure, just a conversation about your brand.': '부담 없이 상담을 예약하세요 — 브랜드에 대한 대화부터 시작합니다.',
  'A boutique creative agency building brands with intention — one cohort at a time.': '의도를 담아 브랜드를 만드는 부티크 크리에이티브 에이전시 — 한 코호트씩.',
  'Navigate': '메뉴',
  'Contact': '연락처',
  'Website Design': '웹사이트 디자인',
  'Social Media': '소셜 미디어',
  'GenAI Marketing': 'GenAI 마케팅',
};
```

- [ ] **Step 5: Create LanguageContext**

```tsx
// src/context/LanguageContext.tsx
import { createContext, useState, type ReactNode } from 'react';

interface LanguageContextType {
  isKorean: boolean;
  toggleLang: () => void;
}

export const LanguageContext = createContext<LanguageContextType>({
  isKorean: false,
  toggleLang: () => {},
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [isKorean, setIsKorean] = useState(false);
  const toggleLang = () => setIsKorean(prev => !prev);

  return (
    <LanguageContext.Provider value={{ isKorean, toggleLang }}>
      {children}
    </LanguageContext.Provider>
  );
}
```

- [ ] **Step 6: Create useTranslation hook**

```ts
// src/components/shared/useTranslation.ts
import { useContext } from 'react';
import { LanguageContext } from '../../context/LanguageContext';
import { translations } from '../../data/translations';

export function useTranslation() {
  const { isKorean, toggleLang } = useContext(LanguageContext);

  function t(english: string): string {
    if (!isKorean) return english;
    return translations[english] ?? english;
  }

  return { t, isKorean, toggleLang };
}
```

- [ ] **Step 7: Verify all files created, dev server still runs**

Run: `npm run dev`
Expected: No errors

- [ ] **Step 8: Commit**

```bash
git add src/components/shared/ src/data/ src/context/
git commit -m "feat: shared components (Button, SectionLabel), language context, translations"
```

---

### Task 3: Navigation

**Files:**
- Create: `src/components/Nav/Nav.tsx`
- Create: `src/components/Nav/Nav.module.css`
- Modify: `src/App.tsx`

- [ ] **Step 1: Create Nav CSS Module**

Port all `.nav`, `.nav-logo`, `.nav-right`, `.nav-links a`, `.lang-toggle` styles from `full-site-complete.html` lines 68–82. Every CSS value is in the prototype.

- [ ] **Step 2: Create Nav component**

The Nav renders: logo left, nav-right group (links + lang toggle + CTA button). Links are anchor `<a>` tags with `href="#services"`, `#about`, `#cohorts`, `#pricing`, `#faq`. The language toggle calls `toggleLang()` from `useTranslation()`. The CTA button uses `data-en` / `data-kr` attributes.

- [ ] **Step 3: Wire into App.tsx**

Replace the Vite starter content in `App.tsx`. Wrap everything in `<LanguageProvider>`. Render `<Nav />` inside a page-wrapper div. Verify the nav appears at localhost:5173.

- [ ] **Step 4: Commit**

```bash
git add src/components/Nav/ src/App.tsx
git commit -m "feat: navigation with anchor links, language toggle"
```

---

### Task 4: Hero Section — Arc Background + Text

**Files:**
- Create: `src/components/Hero/Hero.tsx`
- Create: `src/components/Hero/Hero.module.css`
- Create: `src/components/Hero/ArcBackground.tsx`

- [ ] **Step 1: Create ArcBackground component**

This renders the SVG arcs, crosshair, and pulsing dots. It's a pure presentational component. The SVG has 7 dark rings (r=80 to r=490) and 1 red ring (r=575). CSS animations (`ringWave`, `ringRedWave`, `planeBreath`, `crossFade`, `mpulse`) are defined in `Hero.module.css`. The bg-layer has a mask gradient for fade-out: `-webkit-mask-image: linear-gradient(to bottom, black 0%, black 35%, transparent 65%)`.

- [ ] **Step 2: Create Hero CSS Module**

Port all hero styles from prototype. Key: `.hero-section` is `min-height: 100vh`, transparent bg. `.hero-body` is `grid: 1fr 1fr`. All animation keyframes (`planeBreath`, `ringWave`, `ringRedWave`, `crossFade`, `mpulse`, `pdot`) go here.

- [ ] **Step 3: Create Hero component (text side only)**

Renders the left column: pill badge with pulsing dot, headline, subtext, CTA button. Uses `useTranslation()` for all text. Right column placeholder for now.

- [ ] **Step 4: Add Hero to App.tsx inside page-wrapper**

The page-wrapper div gets `position: relative; overflow-x: clip; background: var(--bg)`. ArcBackground is a child of page-wrapper (not hero-section) so it spans hero + ticker + about.

- [ ] **Step 5: Verify hero text + arcs render at localhost:5173**

- [ ] **Step 6: Commit**

```bash
git add src/components/Hero/
git commit -m "feat: hero section with arc background, text content"
```

---

### Task 5: Hero Section — Device Mockups (Laptop + iPhone)

**Files:**
- Create: `src/components/Hero/DeviceMockup.tsx`
- Create: `src/components/Hero/DeviceMockup.module.css`
- Modify: `src/components/Hero/Hero.tsx`

- [ ] **Step 1: Create DeviceMockup CSS Module**

Port all device styles from prototype. Key styles:
- `.deviceWrapper`: `position: relative; perspective: 1200px`
- `.laptop3d`: `width: clamp(400px, 38vw, 600px)`, `rotateY(-20deg) rotateX(5deg)`, `shadowPulse` animation
- `.iphone`: `width: clamp(80px, 7.5vw, 120px)`, absolute positioned `right: -30px; bottom: -8px`
- All hyperrealistic laptop lid/bezel/screen/camera CSS
- All iPhone frame/bezel/screen/notch/glare CSS
- Image crossfade: `.screenSlides img` with `opacity: 0` default, `.active` = `opacity: 1`, transition 1.2s
- `@keyframes shadowPulse` for the pulsing warm red drop shadow

- [ ] **Step 2: Create DeviceMockup component**

Renders the device-wrapper containing laptop-3d and iPhone. The laptop screen contains 3 `<img>` tags (`/desktop-1.png`, `/desktop-2.png`, `/desktop-3.png`) with crossfade. The iPhone screen contains 3 `<img>` tags (`/mobile-1.png`, `/mobile-2.png`, `/mobile-3.png`). Use `useEffect` + `setInterval(4000)` to cycle `activeIndex` state, which controls which image has the `active` class. Both devices rotate in sync (same `activeIndex`).

- [ ] **Step 3: Add DeviceMockup to Hero right column**

- [ ] **Step 4: Verify devices render with image crossfade at localhost:5173**

- [ ] **Step 5: Commit**

```bash
git add src/components/Hero/DeviceMockup.tsx src/components/Hero/DeviceMockup.module.css src/components/Hero/Hero.tsx
git commit -m "feat: hyperrealistic laptop + iPhone mockups with image crossfade"
```

---

### Task 6: Logo Ticker

**Files:**
- Create: `src/components/LogoTicker/LogoTicker.tsx`
- Create: `src/components/LogoTicker/LogoTicker.module.css`
- Modify: `src/App.tsx`

- [ ] **Step 1: Create LogoTicker CSS Module**

Port ticker styles. Key: background `rgba(26,16,8,0.04)`, borders top+bottom `rgba(26,16,8,0.1)`, 140px fade edge masks (to `#EEE0D2`), `logoScroll` animation 28s linear infinite. Logo images: `height: 50px`, `filter: brightness(0) opacity(0.7)`, hover `brightness(0) opacity(0.9)`.

- [ ] **Step 2: Create LogoTicker component**

Renders 4 sets of 3 logos (`logo-nakwon.png`, `logo-burgshaw.png`, `logo-colorbridge.png`) = 12 items in the track for seamless loop. Each logo is an `<img>` tag inside a `.logoItem` div. Gap: 100px.

- [ ] **Step 3: Add to App.tsx inside page-wrapper (after hero, before about)**

- [ ] **Step 4: Verify ticker scrolls at localhost:5173**

- [ ] **Step 5: Commit**

```bash
git add src/components/LogoTicker/
git commit -m "feat: logo ticker with real client logos"
```

---

### Task 7: About Section

**Files:**
- Create: `src/components/About/About.tsx`
- Create: `src/components/About/About.module.css`
- Modify: `src/App.tsx`

- [ ] **Step 1: Create About CSS Module**

Centered editorial layout. Max-width 1100px. Founder photos: 120x120px circle gradient placeholders with red ring accent (`::after` pseudo). Vertical divider between founders. `border-bottom: 1px solid var(--border)`.

- [ ] **Step 2: Create About component**

Renders: SectionLabel "Who We Are", headline, body text, two founders side by side with divider. All text uses `useTranslation()`. Add `id="about"` on container for anchor nav.

- [ ] **Step 3: Add to App.tsx inside page-wrapper (after LogoTicker)**

- [ ] **Step 4: Verify at localhost:5173**

- [ ] **Step 5: Commit**

```bash
git add src/components/About/
git commit -m "feat: about section with founders"
```

---

### Task 8: Spring Cohort Accordion

**Files:**
- Create: `src/components/SpringCohort/SpringCohort.tsx`
- Create: `src/components/SpringCohort/SpringCohort.module.css`
- Modify: `src/App.tsx`

- [ ] **Step 1: Create SpringCohort CSS Module**

Port accordion styles. Key: `.accordion` flex container, 480px height, 12px gap. `.accItem` transitions `flex 0.6s cubic-bezier(0.25,0.1,0.25,1)`. Hover: hovered `flex: 3`, others `flex: 0.6`. Vertical labels hidden by default, show on non-hovered when accordion is hovered. Info overlay hidden on non-hovered. Card backgrounds: black/charcoal gradients. Screenshot images: `object-fit: cover; object-position: top left`. Header outer wrapper for terracotta bg full-width, inner max-width 1228px for text alignment. `border-bottom: 1px solid var(--border)`.

- [ ] **Step 2: Create SpringCohort component**

Renders header (cohort-header-outer > cohort-header with label + headline), then accordion with 3 cards. Each card has: bg gradient, screenshot img (`/desktop-2.png`, `/desktop-3.png`, `/desktop-1.png`), vertical label, info overlay (number, name, description). Uses `useTranslation()`. Add `id="cohorts"` on outer container.

- [ ] **Step 3: Add to App.tsx (outside page-wrapper, after the closing wrapper div)**

- [ ] **Step 4: Verify accordion hover behavior at localhost:5173**

- [ ] **Step 5: Commit**

```bash
git add src/components/SpringCohort/
git commit -m "feat: spring cohort portfolio accordion"
```

---

### Task 9: Summer Cohort

**Files:**
- Create: `src/components/SummerCohort/SummerCohort.tsx`
- Create: `src/components/SummerCohort/SummerCohort.module.css`
- Modify: `src/App.tsx`

- [ ] **Step 1: Create SummerCohort CSS Module**

Port summer cohort styles. Key: 3-column grid, dashed border cards (`2px dashed rgba(26,16,8,0.12)`), hover border turns red + translateY(-4px). Ghost numbers 48px weight 900. Pulsing dot animation (reuse `pdot` from Hero or define locally).

- [ ] **Step 2: Create SummerCohort component**

Renders: left-aligned header (label, headline, subtext), 3 slot cards with ghost numbers and "Open" status with pulsing dots, CTA button. Uses `useTranslation()`.

- [ ] **Step 3: Add to App.tsx**

- [ ] **Step 4: Verify at localhost:5173**

- [ ] **Step 5: Commit**

```bash
git add src/components/SummerCohort/
git commit -m "feat: summer cohort open slots section"
```

---

### Task 10: Pricing Table

**Files:**
- Create: `src/components/Pricing/Pricing.tsx`
- Create: `src/components/Pricing/Pricing.module.css`
- Modify: `src/App.tsx`

- [ ] **Step 1: Create Pricing CSS Module**

Port comparison table styles. Key: `border-top: 1px solid var(--border)`. Table with `border-collapse: separate; border-spacing: 0`. Growth column highlighted `rgba(184,50,40,0.03)`. Price numbers use `.fontInter` class for Inter 900 font. Checkmarks `✓` in red. Dashes `—` muted.

- [ ] **Step 2: Create Pricing component**

Renders: left-aligned header, full HTML `<table>` with thead (tier names + prices), tbody (12 feature rows), tfoot (CTA buttons). Growth column gets featured class. Price amounts use `className="font-inter"` (global class from index.css). Uses `useTranslation()`. Add `id="pricing"`.

- [ ] **Step 3: Add to App.tsx**

- [ ] **Step 4: Verify at localhost:5173**

- [ ] **Step 5: Commit**

```bash
git add src/components/Pricing/
git commit -m "feat: pricing comparison table"
```

---

### Task 11: FAQ Accordion

**Files:**
- Create: `src/components/FAQ/FAQ.tsx`
- Create: `src/components/FAQ/FAQ.module.css`
- Modify: `src/App.tsx`

- [ ] **Step 1: Create FAQ CSS Module**

Port two-column split styles. Key: grid `340px 1fr`, gap 64px. Left column `position: sticky; top: 80px`. Toggle button: 32px circle, 1.5px border, rotates 45deg when open. Answer: `max-height: 0; overflow: hidden`, transition 0.4s cubic-bezier.

- [ ] **Step 2: Create FAQ component**

Renders: left column (sticky label, headline, CTA link), right column (6 accordion items). Use `useState<number | null>(0)` for open item index (first open by default). Clicking toggles open/close. Toggle icon is "+" that rotates to "×". Uses `useTranslation()`. Add `id="faq"`.

- [ ] **Step 3: Add to App.tsx**

- [ ] **Step 4: Verify accordion open/close at localhost:5173**

- [ ] **Step 5: Commit**

```bash
git add src/components/FAQ/
git commit -m "feat: FAQ two-column accordion"
```

---

### Task 12: Footer

**Files:**
- Create: `src/components/Footer/Footer.tsx`
- Create: `src/components/Footer/Footer.module.css`
- Modify: `src/App.tsx`

- [ ] **Step 1: Create Footer CSS Module**

Port footer styles. Key: CTA banner (flex, space-between, max-width 1100px). Four columns grid `1.5fr 1fr 1fr 1fr`, gap 48px, max-width 1100px, no side padding. Bottom bar: border-top, flex space-between. Social icons: 32px circles. `border-top: 1px solid var(--border)` on footer container.

- [ ] **Step 2: Create Footer component**

Renders: CTA banner (headline + subtext + button), four columns (Brand, Navigate, Services, Contact), bottom bar (copyright + social icons). Navigate links are anchor `<a>` tags matching nav. Contact includes `mailto:design@cy-studios.com`. Uses `useTranslation()`.

- [ ] **Step 3: Add to App.tsx**

- [ ] **Step 4: Verify at localhost:5173**

- [ ] **Step 5: Commit**

```bash
git add src/components/Footer/
git commit -m "feat: footer with CTA banner, columns, social icons"
```

---

### Task 13: Framer Motion — Scroll Animations

**Files:**
- Modify: `src/components/About/About.tsx`
- Modify: `src/components/SpringCohort/SpringCohort.tsx`
- Modify: `src/components/SummerCohort/SummerCohort.tsx`
- Modify: `src/components/Pricing/Pricing.tsx`
- Modify: `src/components/FAQ/FAQ.tsx`
- Modify: `src/components/Footer/Footer.tsx`

- [ ] **Step 1: Add fadeInUp scroll animation to each section**

Wrap each section's main container with `motion.div` using:

```tsx
import { motion } from 'framer-motion';

const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-100px' },
  transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] },
};

// In render:
<motion.div {...fadeInUp}>
  {/* section content */}
</motion.div>
```

Apply to: About, SpringCohort, SummerCohort, Pricing, FAQ, Footer.

- [ ] **Step 2: Verify scroll animations at localhost:5173**

Scroll down — each section should fade in and slide up as it enters the viewport.

- [ ] **Step 3: Commit**

```bash
git add src/components/
git commit -m "feat: Framer Motion fadeInUp scroll animations"
```

---

### Task 14: Final Polish — Visual QA Against Prototype

**Files:**
- Possibly any component or CSS module

- [ ] **Step 1: Open prototype and built site side by side**

Open `full-site-complete.html` directly in a browser tab, and `localhost:5173` in another.

- [ ] **Step 2: Compare section by section**

Walk through each section and verify:
- Colors match
- Spacing/padding match
- Font sizes/weights match
- Hover interactions work
- Language toggle switches all text
- Image crossfade runs on hero devices
- Logo ticker scrolls seamlessly
- Accordion expand/collapse works
- FAQ open/close works
- Section borders present at correct locations
- Smooth scroll from nav links works

- [ ] **Step 3: Fix any discrepancies found**

- [ ] **Step 4: Run production build**

```bash
npm run build
```

Expected: Build succeeds with no errors

- [ ] **Step 5: Preview production build**

```bash
npm run preview
```

Expected: Site renders identically to dev at localhost:4173

- [ ] **Step 6: Commit**

```bash
git add .
git commit -m "chore: visual QA polish pass"
```

---

## Implementation Notes

- **CSS values:** Every CSS value in this plan comes from `full-site-complete.html`. When porting styles, open that file and copy values exactly. Don't guess colors, spacing, or animation values.
- **Translations:** The complete translation map is in Task 2. The `useTranslation()` hook provides a `t()` function that returns Korean when toggled, English otherwise.
- **Images:** All 9 images are already in `/public/`. Reference them with paths like `/desktop-1.png` (Vite serves `public/` at root).
- **No testing framework:** This project has no test setup. The "test" for each task is visual verification in the browser against the prototype.
- **Page-wrapper scope:** The `page-wrapper` div in App.tsx wraps Nav, Hero, LogoTicker, and About. This is because the arc background (bg-layer) needs to span all four. SpringCohort and everything below sit outside page-wrapper.
