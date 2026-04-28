# CY Studios — Design Plan
_Last updated: 2026-04-27_

---

## Where We Left Off

**All sections designed and approved.** Full preview lives at `full-site-complete.html` in the project root. Ready for spec doc and implementation plan.

---

## What's Been Decided

### Architecture
- **Approach A — Modular components + CSS Modules**
- One file per section (`Hero.tsx`, `About.tsx`, `Pricing.tsx`, etc.), each with its own `.module.css`
- `index.css` holds global tokens (colors, Raleway import, base resets)
- Framer Motion animations live inside each component

### Typography
- **Raleway** — single variable family, all weights (200–800), via Google Fonts
- **Inter 900** — used only for pricing numbers (Raleway numerals feel too playful)
- Display: 72px / weight 800 / tracking -1px
- H1: 52px / weight 700
- H2: 40px / weight 700
- H3: 22px / weight 600
- Label: 10px / weight 700 / tracking 0.2em / uppercase
- Body: 16px / weight 300 / line-height 1.8
- Small: 13px / weight 400

### Color Palette
| Token | Value | Usage |
|---|---|---|
| `--bg` | `#F2E4D8` | Page background (warm terracotta) |
| `--surface` | `#EDD9C8` | Cards, elevated surfaces |
| `--ink` | `#1A1008` | Primary text, headings |
| `--ink-muted` | `#5A4E44` | Body copy, secondary text |
| `--accent` | `#B83228` | CTAs, labels, highlights |
| `--accent-warm` | `#D44A28` | Button hover gradient end color |
| `--border` | `rgba(26,16,8,0.08)` | Section borders, dividers |
| `--border-light` | `rgba(26,16,8,0.06)` | Card borders |
| `--white` | `#FFFFFF` | Inverted surfaces |

### Navigation
- Logo left, nav links + lang toggle + CTA right
- **Fully transparent** background so hero background shows through
- Bottom border: `rgba(26,16,8,0.08)`
- Nav links: anchor links to each section with smooth scroll (`scroll-behavior: smooth`)
- **Language toggle button** (KR/EN): switches entire site between English and Korean using contextual translations (not literal)
- CTA text: **"Book a Consultation"** (KR: "상담 예약하기")
- Nav links: Services, About, Cohorts, Pricing, FAQ

### Hero Section
- Layout: **split grid** — left text, right device
- Background: **concentric arcs** (SVG, radiating from right edge)
  - 7 dark rings + 1 red accent ring (r=575, outermost) + crosshair at origin
  - Small pulsing red dots scattered across the arc field
  - **Wave animation** — rings pulse outward in cascade
  - **3D plane breath** — arc SVG slowly tilts rotateX(0°→5°) + translateY(0→-8px), 10s cycle
  - Arcs extend behind the transparent nav (full viewport height)
  - **Arcs overflow visible** — continue through logo ticker and About section with fade-out gradient mask (`black 0%, black 35%, transparent 65%`)
- Left column:
  - Pill badge: "Now Booking — Summer Cohort" with pulsing red dot
  - Headline: "Your brand, built with intention."
  - Subtext: "CY Studios is a boutique creative agency taking clients in cohorts — so every brand gets the attention it deserves."
  - CTA button: "Book a Consultation →"
- Right column: **hyperrealistic device mockups**
  - **Laptop (screen only, no base/keyboard):**
    - **Responsive width:** `clamp(400px, 38vw, 600px)`
    - CSS transform: rotateY(-20deg) rotateX(5deg), perspective 1200px on device-wrapper
    - Hyperrealistic warm brown aluminum: multi-layer gradients, top edge highlight, hinge detail
    - Thin bezel (3px padding), thin lid frame (3px padding)
    - **Screen: rotating project screenshots** — 3 desktop images crossfade every 4s (David Yang, Burg & Shaw, Colorbridge), `opacity` transition 1.2s ease-in-out
    - Multi-layer screen glare (two diagonal reflections) + IPS glow effect (edge darkening)
    - Camera dot with lens glint highlight
    - Base/keyboard/trackpad/feet hidden (`display: none`)
  - **iPhone (leaning against laptop):**
    - Positioned absolute, right -30px, bottom -8px, z-index 20
    - Same 3D transform: rotateY(-20deg) rotateX(5deg)
    - **Responsive width:** `clamp(80px, 7.5vw, 120px)`
    - Warm brown frame (1.5px padding), thin bezel (2px 1.5px padding)
    - Dynamic Island notch with camera lens
    - Flat side buttons (1px, semi-transparent)
    - Screen glare, home indicator bar
    - **Screen: rotating mobile screenshots** — 3 mobile images crossfade in sync with laptop (David Yang, Burg & Shaw, Colorbridge)
  - **Drop shadow: animated warm red pulse** — 6s ease-in-out infinite
    - Resting: `drop-shadow(20px 28px 45px rgba(184,50,40,0.2))`
    - Peak: `drop-shadow(20px 28px 60px rgba(184,50,40,0.32))`
  - iPhone shadow: `drop-shadow(8px 12px 20px rgba(0,0,0,0.25))`
- **Hero ticker removed** — no scrolling text strip at bottom of hero

### CTAs / Buttons
- Primary CTA text: **"Book a Consultation"**
- Links to: **Calendly** (placeholder `#` to be swapped in)
- Button hover effect: **gradient slide + 2px lift**
  - Resting: gradient `#B83228 → #D44A28`, `background-position: 100% 0`
  - Hover: `background-position: 0% 0`, `translateY(-2px)`, shadow deepens
  - Active: drops back to `translateY(0)`, shadow softens
  - **Smooth transitions**: `background-position 0.6s cubic-bezier(0.25,0.1,0.25,1)`, `box-shadow 0.4s cubic-bezier(0.25,0.1,0.25,1)`, `transform 0.4s cubic-bezier(0.34,1.56,0.64,1)`
  - Active state: snaps back quickly (0.15s ease)

### Logo Ticker Section (Section 3)
- **Background:** `rgba(26,16,8,0.04)` (tinted, matching hero ticker style — NOT flat terracotta)
- **Borders:** `1px solid rgba(26,16,8,0.1)` top AND bottom
- **Fade edges:** 140px gradient masks (fade to `#EEE0D2` to match tinted bg)
- **Animation:** `logoScroll` — `translateX(0 → -25%)`, 28s linear infinite
- **Gap between logos:** 100px
- **Logo opacity:** `0.55` resting, `0.85` on hover
- **Real client logos:** Nak Won Catering, Burg & Shaw, Colorbridge (3 logos × 4 sets = 12 items)
- **Logo images:** `height: 50px`, `object-fit: contain`, `filter: brightness(0) opacity(0.7)`, hover: `brightness(0) opacity(0.9)` — renders all logos in uniform dark ink tone
- Logo files: `logo-nakwon.png`, `logo-burgshaw.png`, `logo-colorbridge.png`

### About Section (Section 4) — Centered Editorial
- **Layout:** centered text, founders side by side below
- **Label:** "WHO WE ARE" (red, 10px, uppercase, 0.2em tracking)
- **Headline:** "Two designers who got tired of the agency grind."
- **Body:** centered, max-width 560px, margin-bottom 56px
- **Founders:** two columns with vertical divider between
  - Photo: 120×120px circle placeholder, subtle red ring accent (`inset: -6px, 1.5px solid rgba(184,50,40,0.15)`)
  - Name: 20px / weight 700
  - Role: 11px / weight 700 / uppercase / red
  - Bio: 14px / weight 300
- **Border-bottom:** `1px solid rgba(26,16,8,0.08)`

### Spring Cohort Section (Section 5) — Accordion Showcase
- **Purpose:** show off Spring Cohort client work (Burg&Shaw, Nakwon Catering, PJ Beauty Supply)
- **Header:** left-aligned, max-width 1228px centered to align text with card edges
  - Wrapped in `.cohort-header-outer` (terracotta bg edge-to-edge) > `.cohort-header` (max-width + padding)
- **Layout:** 3 accordion cards with 12px gap, 480px height, max-width 1100px centered, 14px border-radius
- **Hover behavior:**
  - Default: equal thirds, horizontal name/number at bottom of each card
  - On hover: hovered card expands to `flex: 3`, others compress to `flex: 0.6`
  - **Vertical labels:** hidden by default. When any card is hovered, non-hovered cards show vertical rotated name and hide horizontal info
  - Description text slides up on hover with 0.15s delay
- **Transition:** `flex 0.6s cubic-bezier(0.25,0.1,0.25,1)`
- **Card backgrounds:** pure black/charcoal gradients (3 subtle variations: `#0a0a0a→#222`, `#0d0d0d→#282828`, `#111→#2e2e2e`)
- **Mockup screen:** 80% width, 16:10 aspect ratio, centered in card, `object-fit: cover`, `object-position: top left`
- **Content:** real project screenshots — `desktop-2.png` (Burg & Shaw), `desktop-3.png` (Colorbridge), `desktop-1.png` (David Yang)
- **Border-bottom:** `1px solid rgba(26,16,8,0.08)`

### Summer Cohort Section (Section 6) — Three Open Slots
- **Purpose:** show 3 open spots for Summer Cohort booking
- **Layout:** left-aligned header + 3-column grid of dashed-border cards + CTA
- **Background:** terracotta (`#F2E4D8`)
- **Header:**
  - Label: "SUMMER COHORT — NOW BOOKING"
  - Headline: "Three spots. Three brands. Fully locked in."
  - Subtext: max-width 480px
- **Slot cards:**
  - Background: `#EDD9C8`, border-radius 14px, padding 36px 28px
  - Border: `2px dashed rgba(26,16,8,0.12)`, hover → `rgba(184,50,40,0.3)` + translateY(-4px)
  - Large ghost number (48px / weight 900 / `rgba(184,50,40,0.1)`)
  - Pulsing red dot + "Open" status
  - Description text for each slot
- **CTA:** left-aligned "Book a Consultation →"

### Pricing Section (Section 7) — Comparison Table
- **Border-top:** `1px solid rgba(26,16,8,0.08)`
- **Layout:** left-aligned header + full-width comparison table
- **Header:**
  - Label: "PRICING"
  - Headline: "Invest in your brand."
  - Subtext: max-width 480px
- **Tiers:** Standard ($2,500) / Growth ($5,000) / Scale ($8,500) — all per project
- **Price font:** `Inter 900` (not Raleway — Raleway numerals too playful)
- **Growth column highlighted:** `background: rgba(184,50,40,0.03)`, tier label in red with ★
- **Features:** 12 rows including pages, revisions, brand identity, social, SEO, analytics, e-commerce, content strategy, GenAI marketing, post-launch support
- **Checkmarks:** `✓` in red (#B83228, weight 800), dashes `—` in `rgba(26,16,8,0.2)`
- **CTAs:** outline buttons for Standard/Scale, filled button for Growth

### FAQ Section (Section 8) — Two-Column Split
- **Layout:** sticky left column (340px) + accordion right column
- **Left column:**
  - Label: "FAQ"
  - Headline: "Questions we get asked a lot."
  - "Still have questions?" + "Book a Consultation →" link (sticky on scroll)
- **Accordion:**
  - 6 questions with click-to-expand
  - Toggle: circled + (32px circle, 1.5px border), rotates 45° to × on open
  - Hover: border and + turn red
  - Answer: max-height transition 0.4s cubic-bezier
  - First question open by default
- **Questions (placeholder):** cohort model, project timeline, remote work, post-launch changes, package upgrades, what to prepare

### Footer (Section 9)
- **Background:** terracotta (`#F2E4D8`)
- **Border-top:** `1px solid rgba(26,16,8,0.08)`
- **CTA Banner:** full-width strip at top
  - "Ready to build something intentional?"
  - Sub: "Book a free consultation — no pressure, just a conversation about your brand."
  - CTA button right-aligned
  - Max-width 1100px centered
  - Border-bottom: `rgba(26,16,8,0.08)`
- **Four columns** (max-width 1100px, no extra side padding — aligned with CTA):
  - Col 1 (1.5fr): Logo + tagline
  - Col 2: Navigate links (Services, About, Cohorts, Pricing, FAQ)
  - Col 3: Services links (Website Design, Social Media, SEO, GenAI Marketing)
  - Col 4: Contact (email, Instagram, LinkedIn, Twitter/X)
  - Column titles: red, 10px, uppercase, 0.18em tracking
- **Bottom bar:** copyright left, social icons (IG, LI, X) right in 32px circles

### Section Borders
- Below About section
- Below Spring Cohort accordion
- Above Pricing section
- Above Footer
- All using `1px solid rgba(26,16,8,0.08)`

### Language Toggle (EN/KR)
- Button in nav bar between links and CTA
- Style: 11px, weight 600, bordered pill, hover turns red
- Switches entire site to Korean with **contextual translations** (not literal)
- All section headers, body copy, nav links, buttons, FAQ Q&As, pricing table, footer content translated
- Korean translations stored in a JS object, toggled via `toggleLang()` function

### Motion (planned)
- Framer Motion scroll-triggered `fadeInUp` across all sections
- Hero: parallax scroll effect (background moves at 0.4× scroll speed)
- Ticker: infinite CSS animation (locked)
- Accordion: CSS flex transition (locked)
- Button hover: cubic-bezier spring (locked)
- FAQ accordion: max-height + rotate transitions (locked)

---

## Sections — Status

| # | Section | Status |
|---|---|---|
| 0 | Global design system | ✅ Locked |
| 1 | Navigation | ✅ Locked — right-aligned links, KR/EN toggle, anchor scroll |
| 2 | Hero | ✅ Locked — arcs overflow to ticker+about with fade, warm red laptop shadow, no hero ticker |
| 3 | Logo Ticker | ✅ Locked — tinted bg `rgba(26,16,8,0.04)`, top+bottom borders, fade edges adjusted |
| 4 | About | ✅ Locked — Centered Editorial (V2), border-bottom |
| 5 | Spring Cohort | ✅ Locked — Accordion cards (Option 1, gaps), hover expand, vertical labels on non-hovered |
| 6 | Summer Cohort | ✅ Locked — Three open slots, left-aligned, dashed cards with pulsing dots |
| 7 | Pricing | ✅ Locked — Comparison table (V3), Inter 900 for prices, Growth highlighted |
| 8 | FAQ | ✅ Locked — Two-column split (V2), circled + toggles from V1 |
| 9 | Footer | ✅ Locked — CTA banner + four columns, terracotta bg |

---

## Approaches That Were Explored

### About section layout
- **V1 — Split Grid** (headline left, founder cards right)
- **V2 — Centered Editorial (chosen)** — centered headline, founders side by side
- V3 — Horizontal Cards
- V4 — Staggered Overlap
- V5 — Minimal Typographic

### About section content direction
- A — The Founders (chosen — leads with David & Colin)
- B — The Philosophy (cohort model focus)
- C — The Value Proposition (services/stats)

### Spring Cohort layout
- **Option 1 — Accordion with gaps (chosen)**
- Option 2 — No gaps, color strips
- Option 3 — Full width edge to edge

### Summer Cohort layout
- **Option 1 — Three open slots on terracotta (chosen)**
- Option 2 — Dark banner with counter (split layout)
- Option 3 — Minimal CTA strip

### Summer Cohort bg color (for V2 dark option — explored but chose V1 terracotta)
- A — Dark Ink #1A1008
- B — Deep Navy #0C1420
- C — Charcoal Warm #2A2420
- D — Deep Burgundy #1E0E0C
- E — Slate Green #141E1A

### Pricing layout
- V1 — Classic three cards
- V2 — Dark horizontal rows
- **V3 — Comparison table (chosen)**

### Pricing number font
- Current Raleway 900 (rejected — too playful)
- **A — Inter 900 (chosen)** — clean, neutral, geometric
- B — DM Sans
- C — Space Grotesk
- D — Outfit
- E — Manrope

### FAQ layout
- V1 — Classic accordion (single column, centered)
- **V2 — Two-column split (chosen)** — with V1's circled + toggle
- V3 — Cards grid (all visible)

### Footer layout
- **V1 — CTA banner + four columns (chosen)** — terracotta bg
- V2 — Minimal centered
- V3 — Split (CTA left, links right)

### Laptop drop shadow color
- **A — Warm Red rgba(184,50,40,0.3) (chosen)**
- B — Cool Purple
- C — Deep Terracotta
- D — Soft Black
- E — Burnt Crimson

### Hero changes from original locked design
- Hero ticker strip: **removed**
- Logo ticker bg: changed from `#F2E4D8` to `rgba(26,16,8,0.04)` with top+bottom borders
- Arcs: overflow visible, fade gradient mask applied
- Outermost red ring (r=665): removed, r=575 ring becomes red
- Laptop: upgraded to **hyperrealistic warm brown** (multi-layer gradients, thin bezels, top highlight, hinge detail, camera lens glint, IPS glow, multi-layer glare)
- Laptop base/keyboard/trackpad: **removed** (screen only, no base)
- **iPhone added**: leaning against laptop, matching 3D angle, warm brown frame, dynamic island, flat side buttons
- Laptop shadow: changed to **animated warm red pulse** (6s cycle, resting→peak glow)
- Button hover: smoothed with cubic-bezier
- Nav links: moved from center to right, grouped with CTA

---

## Project Context
- Stack: Vite + React + TypeScript
- Framer Motion: already installed (v12)
- No Tailwind — using CSS Modules
- Project root: `/Users/davidyang/Desktop/CySTUDIOS`
- Full design preview: `full-site-complete.html` (project root)
- Brainstorm sessions: `.superpowers/brainstorm/`

## About CY Studios
- Co-founded by **David** (the user) and **Colin**
- Primary service: website design
- Additional: social media marketing, SEO, GenAI marketing
- Cohort model: Spring Cohort (3 clients, fully booked), Summer Cohort (now booking)
- Spring Cohort clients: Burg&Shaw (barbershop), Nakwon Catering (Korean catering), PJ Beauty Supply (beauty e-commerce)
- Contact: design@cy-studios.com

---

## Next Steps
1. ✅ Design all sections (done)
2. Write full design spec doc
3. Spec self-review
4. User reviews spec
5. Invoke `writing-plans` skill to create implementation plan
6. Build the site
