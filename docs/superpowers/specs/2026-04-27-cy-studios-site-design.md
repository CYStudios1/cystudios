# CY Studios Website — Design Specification

## Overview

Single-page marketing website for CY Studios, a boutique creative agency that takes clients in cohorts of three. The site communicates the agency's intentional, craft-focused approach and drives visitors to book a consultation via Calendly.

**Stack:** Vite + React + TypeScript, CSS Modules, Framer Motion v12, no Tailwind.

**Reference preview:** `full-site-complete.html` in project root — a fully rendered static HTML prototype of the complete design.

---

## 1. Global Design System

### Fonts
- **Raleway** (Google Fonts): weights 200–900, used for all text
- **Inter** (Google Fonts): weight 900 only, used exclusively for pricing dollar amounts

### Type Scale
| Token | Size | Weight | Line-height | Tracking | Notes |
|---|---|---|---|---|---|
| Display | 72px | 800 | 1.02 | -1px | Hero headline (clamped: `clamp(40px, 4.5vw, 68px)`) |
| H2 | 40px | 700 | 1.12 | — | Section headlines |
| H3 | 22px | 600 | — | — | Card titles |
| Label | 10px | 700 | — | 0.2em | Section labels, uppercase |
| Body | 16px | 300 | 1.8 | — | Paragraphs |
| Small | 13px | 400 | 1.7 | — | Bios, descriptions |
| Nav | 11px | 500 | — | 0.14em | Nav links, uppercase |
| Price | 32px | 900 | 1 | — | Inter only |

### Colors
| Token | Value | Usage |
|---|---|---|
| `--bg` | `#F2E4D8` | Page background |
| `--surface` | `#EDD9C8` | Cards, elevated surfaces |
| `--ink` | `#1A1008` | Headings, primary text |
| `--ink-muted` | `#5A4E44` | Body copy, secondary text |
| `--accent` | `#B83228` | CTAs, labels, highlights |
| `--accent-warm` | `#D44A28` | Button hover gradient end |
| `--border` | `rgba(26,16,8,0.08)` | Section borders |
| `--border-card` | `rgba(26,16,8,0.06)` | Card borders |
| `--ticker-bg` | `rgba(26,16,8,0.04)` | Logo ticker tinted background |

### Spacing
- Page padding: 64px horizontal
- Section padding: 80px vertical
- Max content width: 1100px (centered)
- Card gap: 12–24px depending on section
- Card border-radius: 14px

### Buttons
Primary (`.btn`):
- Font: Raleway, 12px, weight 700, 0.1em tracking, uppercase
- Padding: 14px 30px, border-radius 6px
- Background: `linear-gradient(110deg, #b83228 0%, #d44a28 55%, #b83228 100%)`, `background-size: 200% 100%`, position `100% 0`
- Shadow: `0 4px 14px rgba(184,50,40,0.32), 0 1px 3px rgba(184,50,40,0.18)`
- Hover: position `0% 0`, `translateY(-2px)`, shadow deepens
- Active: `translateY(0)`, shadow softens, fast snap (0.15s)
- Transition: `background-position 0.6s cubic-bezier(0.25,0.1,0.25,1), box-shadow 0.4s cubic-bezier(0.25,0.1,0.25,1), transform 0.4s cubic-bezier(0.34,1.56,0.64,1)`

Small variant (`.btn-sm`): 11px, padding 9px 22px, border-radius 5px

Outline variant (`.btn-outline`): transparent bg, `1.5px solid rgba(26,16,8,0.2)`, no shadow, hover turns red border

### Section Borders
Applied at these locations using `1px solid rgba(26,16,8,0.08)`:
- Bottom of About section
- Bottom of Spring Cohort section
- Top of Pricing section
- Top of Footer

---

## 2. Navigation

**Layout:** flex, `justify-content: space-between`, 64px height, transparent background, bottom border `rgba(26,16,8,0.08)`.

- **Left:** Logo — "CY STUDIOS" (16px, weight 800, uppercase, 0.04em tracking)
- **Right:** grouped in `.nav-right` (flex, gap 36px):
  1. Nav links (flex, gap 36px): Services, About, Cohorts, Pricing, FAQ — each an `<a>` with anchor href (`#services`, `#about`, etc.)
  2. Language toggle button: "KR" / "EN", 11px weight 600, bordered pill, toggles site language
  3. CTA button: "Book a Consultation" (btn-sm)

**Behavior:**
- `html { scroll-behavior: smooth }` for anchor navigation
- Language toggle calls `toggleLang()` JS function
- Nav is positioned relative, z-index 10

---

## 3. Hero Section

**Container:** min-height 100vh, transparent background (terracotta from page-wrapper), flex column.

### Arc Background
- Lives in `.page-wrapper > .bg-layer` — shared across hero, ticker, and about sections
- `.bg-layer`: absolute positioned, 100% height of wrapper, z-index 1, pointer-events none
- Perspective: 1100px, origin 68% 35%
- **Fade mask:** `-webkit-mask-image: linear-gradient(to bottom, black 0%, black 35%, transparent 65%)`
- SVG: absolute, top -5%, right -6%, width 80%, height 80%
- **Rings:** 7 dark rings (r=80 to r=490) + 1 red ring (r=575)
  - Dark rings: stroke `#1a1008`, width 1, varying opacity (0.07→0.04)
  - Red ring: stroke `#b83228`, width 0.75, class `ring-red`
  - Wave animation: `ringWave` — scale 1→1.022, opacity pulses to 1.7× base
  - Durations: 4.5s→6.3s stepping by 0.3s, stagger -0.35s between rings
  - Red ring: 7s duration, -2.8s delay
- Crosshair: two lines at center, `crossFade` animation 9s
- Pulsing red dots: 3 marks, `mpulse` animation 4s, scattered positions
- **Plane breath:** `planeBreath` 10s — rotateX(0→5deg), translateY(0→-8px)

### Hero Body
Grid: `1fr 1fr`

**Left column (`.hero-content`):** padding 60px 48px 48px 64px
- Pill badge: inline-flex, "Now Booking — Summer Cohort", pulsing red dot, red text on `rgba(184,50,40,0.1)` bg, 1px red border, 99px radius
- Headline: "Your brand, built with intention." — `clamp(40px, 4.5vw, 68px)`, weight 800, line-height 1.02
- Subtext: 15px, weight 300, color `#5a4e44`, line-height 1.85, max-width 380px
- CTA: "Book a Consultation →" (btn-lg: 12px, padding 14px 30px)

**Right column (`.device-side`):** contains `.device-wrapper` with `perspective: 1200px`

**Laptop (screen only, no base):**
- Width: 460px, `rotateY(-20deg) rotateX(5deg)`, preserve-3d
- **Hyperrealistic warm brown aluminum:**
  - Lid: `linear-gradient(175deg, #3a3028 ... #2c2218)` — multi-stop for depth
  - Top edge highlight: 1px gradient (subtle white reflection)
  - Hinge: 3px gradient strip with inset shadow
  - Lid padding: 3px (thin frame)
- **Bezel:** `#0a0806`, padding 3px 3px 12px, inner shadow + 0.5px white border
- **Screen:** `#F2E4D8`, border-radius 3px, 16:10 aspect ratio
  - Multi-layer glare: two diagonal gradients (125deg + 220deg)
  - IPS glow: `inset box-shadow` on `::after` pseudo-element
- **Camera:** 4px dot with 1.5px + 2.5px ring shadows, lens glint `::after`
- **Base/keyboard/trackpad/feet:** hidden (`display: none`)
- **Shadow: animated warm red pulse** (`shadowPulse` 6s ease-in-out infinite):
  - Resting: `drop-shadow(20px 28px 45px rgba(184,50,40,0.2)) drop-shadow(0 10px 22px rgba(184,50,40,0.1)) drop-shadow(0 4px 10px rgba(0,0,0,0.12))`
  - Peak: `drop-shadow(20px 28px 60px rgba(184,50,40,0.32)) drop-shadow(0 10px 30px rgba(184,50,40,0.18)) drop-shadow(0 4px 10px rgba(0,0,0,0.12))`
- Screen glow: radial gradient, inset -20px, 12px radius

**iPhone (leaning against laptop):**
- Position: absolute, right -30px, bottom -8px, z-index 20
- Width: 90px (proportional to laptop)
- Transform: `rotateY(-20deg) rotateX(5deg)` (same as laptop)
- Shadow: `drop-shadow(8px 12px 20px rgba(0,0,0,0.25))`
- **Frame:** warm brown gradient, border-radius 14px, padding 1.5px (caseless look)
- **Side buttons:** 1px wide, semi-transparent (`rgba(44,34,24,0.6)`), barely visible
- **Bezel:** `#0a0806`, border-radius 13px, padding 2px 1.5px
- **Screen:** `#F2E4D8`, border-radius 10px, aspect-ratio 9/19.5
  - Dynamic Island notch: 28×8px, rounded, camera lens with glint
  - Home indicator: 32×2.5px bar at bottom
  - Screen glare: diagonal gradient (135deg)
  - Content: mobile version of CY Studios (logo, headline, body, CTA button)

---

## 4. Logo Ticker Section

**Background:** `rgba(26,16,8,0.04)` — NOT flat terracotta
**Borders:** `1px solid rgba(26,16,8,0.1)` top AND bottom
**Padding:** 48px top/bottom
**Fade edges:** 140px gradient masks fading to `#EEE0D2` (adjusted for tinted bg)

**Track:** inline-flex, gap 100px, `logoScroll` animation 28s linear infinite (`translateX(0 → -25%)`)
- 4 identical logo sets for seamless loop
- Logo opacity: 0.45, hover 0.75 (0.3s transition)
- 4 placeholder shapes: Wordmark, Icon+wordmark, Stacked, Circle mark (see PLAN.md for details)

---

## 5. About Section — "Who We Are"

**Layout:** centered editorial
**Background:** transparent (arcs visible through)
**Padding:** 80px 64px
**Border-bottom:** `1px solid rgba(26,16,8,0.08)`
**Max-width:** 1100px centered

- Label: "WHO WE ARE" — red, 10px, weight 700, 0.2em tracking, uppercase
- Headline: "Two designers who got tired of the agency grind." — 40px, weight 700
- Body: centered, max-width 560px, margin-bottom 56px — 16px, weight 300, `#5A4E44`
- **Founders:** flex row, gap 48px, centered
  - Vertical divider: 1px wide, `rgba(26,16,8,0.1)`, self-stretch, margin 20px 0
  - Each founder: max-width 280px, centered text
    - Photo: 120×120px circle, gradient placeholder, red ring accent (inset -6px, 1.5px `rgba(184,50,40,0.15)`)
    - Name: 20px, weight 700, `#1A1008`
    - Role: 11px, weight 700, 0.15em tracking, uppercase, `#B83228`
    - Bio: 14px, weight 300, `#5A4E44`, line-height 1.75
  - David: Design & Strategy
  - Colin: Development & Growth

---

## 6. Spring Cohort — Portfolio Accordion

**Purpose:** showcase Spring Cohort client work (Burg&Shaw, Nakwon Catering, PJ Beauty Supply)

**Header:** `.cohort-header-outer` (terracotta bg, full-width) > `.cohort-header` (max-width 1228px, padding 80px 64px 48px, centered — aligns text with card edges)
- Label: "SPRING COHORT"
- Headline: "Work that speaks for itself."

**Accordion:** flex, gap 12px, height 480px, max-width 1100px centered
- 3 items, each border-radius 14px, overflow hidden
- **Default state:** equal `flex: 1`, horizontal info at bottom (number + name + description hidden)
- **Hover state:** hovered item `flex: 3`, others `flex: 0.6`
- **Vertical labels:** `opacity: 0` by default. On `.accordion:hover`, non-hovered items show vertical rotated name (`opacity: 1`) and hide horizontal info (`opacity: 0`)
- Description slides up on hover: `opacity 0→1, translateY(8px→0)`, 0.4s ease with 0.15s delay
- Transition: `flex 0.6s cubic-bezier(0.25,0.1,0.25,1)`

**Card backgrounds:** dark warm gradients (3 variations)
**Mockup screen:** absolute centered, 80% width, max-width 500px, 16:10, `#F2E4D8`, border-radius 6px, opacity 0.85→1 on hover

**Info overlay:** gradient from bottom `rgba(26,16,8,0.92)→transparent`
- Number: 11px, weight 700, 0.15em tracking, uppercase, red
- Name: 22px, weight 700, `#F2E4D8`
- Description: 13px, weight 300, `rgba(242,228,216,0.7)`

**Border-bottom:** `1px solid rgba(26,16,8,0.08)`

**Clients:**
1. Burg&Shaw — "Premium barbershop rebrand & website"
2. Nakwon Catering — "Korean catering service — site & branding"
3. PJ Beauty Supply — "Beauty supply e-commerce & digital presence"

---

## 7. Summer Cohort — Open Slots

**Background:** `#F2E4D8`
**Padding:** 80px 64px
**Max-width:** 1100px centered

**Header (left-aligned):**
- Label: "SUMMER COHORT — NOW BOOKING"
- Headline: "Three spots. Three brands. Fully locked in."
- Subtext: max-width 480px

**Slots:** 3-column grid, gap 24px, margin-bottom 48px
- Each: `#EDD9C8`, border-radius 14px, padding 36px 28px, centered text
- Border: `2px dashed rgba(26,16,8,0.12)`
- Hover: border → `rgba(184,50,40,0.3)`, translateY(-4px)
- Ghost number: 48px, weight 900, `rgba(184,50,40,0.1)`
- Status: "Open" with pulsing red dot (6px, `pdot` animation 2s)
- Description: 14px, weight 300

**CTA:** left-aligned, "Book a Consultation →"

---

## 8. Pricing — Comparison Table

**Border-top:** `1px solid rgba(26,16,8,0.08)`
**Background:** `#F2E4D8`
**Padding:** 80px 64px
**Max-width:** 1100px centered

**Header (left-aligned):**
- Label: "PRICING"
- Headline: "Invest in your brand."
- Subtext: max-width 480px

**Table:** full-width, `border-collapse: separate; border-spacing: 0`
- **Columns:** What's included (280px) | Standard | Growth (highlighted) | Scale
- **Header row:** tier name (13px, uppercase), price (32px Inter 900), period (/project)
- **Growth column:** `background: rgba(184,50,40,0.03)`, tier label in red with ★
- **Body cells:** 16px 20px padding, bottom border `rgba(26,16,8,0.06)`, centered
- **First column:** left-aligned, weight 500, `#1A1008`
- **Checkmarks:** `✓` — 16px, weight 800, `#B83228`
- **Dashes:** `—` — `rgba(26,16,8,0.2)`
- **Footer row:** CTA buttons — outline for Standard/Scale, filled for Growth

**Tiers:**

| Feature | Standard $2,500 | Growth $5,000 | Scale $8,500 |
|---|---|---|---|
| Custom website design | ✓ | ✓ | ✓ |
| Mobile responsive | ✓ | ✓ | ✓ |
| Pages | 5 | 10 | Unlimited |
| Revisions | 2 | 4 | Unlimited |
| Brand identity | — | ✓ | ✓ |
| Social media templates | — | ✓ | ✓ |
| SEO | Basic | Advanced | Advanced |
| Analytics setup | — | ✓ | ✓ |
| E-commerce | — | — | ✓ |
| Content strategy | — | — | ✓ |
| GenAI marketing | — | — | ✓ |
| Post-launch support | 30 days | 60 days | 90 days |

---

## 9. FAQ — Two-Column Split

**Background:** `#F2E4D8`
**Padding:** 80px 64px
**Max-width:** 1100px centered
**Layout:** grid, `340px 1fr`, gap 64px

**Left column (sticky, top 80px):**
- Label: "FAQ"
- Headline: "Questions we get asked a lot."
- Divider: border-top `rgba(26,16,8,0.08)`, margin-top 32px, padding-top 24px
- "Still have questions?" (14px, weight 400)
- "Book a Consultation →" link (13px, weight 700, red, uppercase, 0.08em tracking)

**Right column — accordion:**
- Items separated by border-bottom `rgba(26,16,8,0.08)`
- Question row: flex, space-between, padding 24px 0, cursor pointer
- Question text: 16px, weight 600, `#1A1008`
- Toggle: 32px circle, 1.5px border `rgba(26,16,8,0.15)`, "+" (18px, weight 300)
  - Hover: border + text turn `#B83228`
  - Open: `rotate(45deg)` (becomes ×), border + text red
- Answer: `max-height: 0; overflow: hidden`, transition 0.4s cubic-bezier
  - Open: `max-height: 200px; padding: 0 0 24px 0`
- Answer text: 14px, weight 300, `#5A4E44`, line-height 1.8
- First question open by default

**Questions (placeholder — to be finalized):**
1. What does the cohort model mean for my project?
2. How long does a typical project take?
3. Do you work with clients outside your area?
4. What if I need changes after launch?
5. Can I upgrade my package after we start?
6. What do I need to have ready before we start?

---

## 10. Footer

**Background:** `#F2E4D8`
**Border-top:** `1px solid rgba(26,16,8,0.08)`

**CTA Banner:** padding 64px, border-bottom `rgba(26,16,8,0.08)`
- Inner: max-width 1100px, flex, space-between, align-center
- Left: "Ready to build something intentional?" (32px, weight 700) + subtext (15px, weight 300, `#5A4E44`)
- Right: "Book a Consultation →" button

**Four Columns:** max-width 1100px, no side padding (aligned with CTA), padding 56px 0, grid `1.5fr 1fr 1fr 1fr`, gap 48px
1. **Brand:** Logo (18px, weight 800, uppercase) + tagline (13px, weight 300)
2. **Navigate:** Services, About, Cohorts, Pricing, FAQ
3. **Services:** Website Design, Social Media, SEO, GenAI Marketing
4. **Contact:** design@cy-studios.com, Instagram, LinkedIn, Twitter/X
- Column titles: red, 10px, weight 700, 0.18em tracking, uppercase
- Links: 13px, weight 400, `#5A4E44`, hover `#1A1008`

**Bottom Bar:** max-width 1100px, padding 24px 0, border-top `rgba(26,16,8,0.08)`, flex space-between
- Left: "© 2026 CY Studios. All rights reserved." (12px, `rgba(26,16,8,0.35)`)
- Right: social icons — 32px circles, 1px border `rgba(26,16,8,0.15)`, hover red

---

## 11. Language Toggle (EN/KR)

**Implementation:** client-side JS, no page reload
- `toggleLang()` function toggles `isKorean` boolean
- Button text switches between "KR" and "EN"
- Translation object maps English strings → Korean strings
- Uses `originals` Map to store original English innerHTML for restoration
- Targets all translatable elements via CSS selectors
- Nav CTA button uses `data-en` / `data-kr` attributes (handled separately)
- Translations are **contextual**, not literal — preserve meaning and tone in Korean

---

## 12. Animations & Interactions

| Element | Type | Duration | Easing |
|---|---|---|---|
| Arc rings | Scale + opacity pulse | 4.5s–7s | ease-in-out |
| Arc plane breath | RotateX + translateY | 10s | ease-in-out |
| Pulsing dots | Opacity + scale | 4s | ease-in-out |
| Pill dot | Opacity pulse | 2s | linear |
| Laptop shadow | Drop-shadow pulse (warm red) | 6s | ease-in-out |
| Button hover | Gradient + lift + shadow | 0.4–0.6s | cubic-bezier (see Buttons) |
| Logo scroll | TranslateX | 28s | linear |
| Accordion expand | Flex change | 0.6s | cubic-bezier(0.25,0.1,0.25,1) |
| Accordion labels | Opacity | 0.3s | ease |
| Accordion desc | Opacity + translateY | 0.4s | ease, 0.15s delay |
| FAQ toggle | Rotate | 0.3s | ease |
| FAQ answer | Max-height | 0.4s | cubic-bezier(0.25,0.1,0.25,1) |
| Summer slot hover | Border-color + translateY | 0.3s | ease |
| Smooth scroll | — | — | `scroll-behavior: smooth` |

**Planned (for React build):**
- Framer Motion `fadeInUp` on scroll for all sections
- Hero parallax (0.4× scroll speed)
