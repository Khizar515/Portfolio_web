---
name: Editorial Navy Minimal
colors:
  surface: '#061426'
  surface-dim: '#061426'
  surface-bright: '#2d3a4d'
  surface-container-lowest: '#020e20'
  surface-container-low: '#0e1c2e'
  surface-container: '#132033'
  surface-container-high: '#1d2b3d'
  surface-container-highest: '#283549'
  on-surface: '#d6e3fd'
  on-surface-variant: '#c0c7d2'
  inverse-surface: '#d6e3fd'
  inverse-on-surface: '#243144'
  outline: '#8a919b'
  outline-variant: '#414750'
  surface-tint: '#9bcbff'
  primary: '#9bcbff'
  on-primary: '#003256'
  primary-container: '#4c95d8'
  on-primary-container: '#002c4b'
  inverse-primary: '#00629f'
  secondary: '#96cbff'
  on-secondary: '#003353'
  secondary-container: '#006daa'
  on-secondary-container: '#d8eaff'
  tertiary: '#adcae5'
  on-tertiary: '#153349'
  tertiary-container: '#7894ae'
  on-tertiary-container: '#0c2c42'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#d0e4ff'
  primary-fixed-dim: '#9bcbff'
  on-primary-fixed: '#001d34'
  on-primary-fixed-variant: '#004a79'
  secondary-fixed: '#cee5ff'
  secondary-fixed-dim: '#96cbff'
  on-secondary-fixed: '#001d33'
  on-secondary-fixed-variant: '#004a76'
  tertiary-fixed: '#cce5ff'
  tertiary-fixed-dim: '#adcae5'
  on-tertiary-fixed: '#001e31'
  on-tertiary-fixed-variant: '#2d4960'
  background: '#061426'
  on-background: '#d6e3fd'
  surface-variant: '#283549'
typography:
  display-lg:
    fontFamily: Geist
    fontSize: 48px
    fontWeight: '600'
    lineHeight: 56px
    letterSpacing: -0.03em
  display-lg-mobile:
    fontFamily: Geist
    fontSize: 36px
    fontWeight: '600'
    lineHeight: 44px
    letterSpacing: -0.025em
  headline-xl:
    fontFamily: Geist
    fontSize: 36px
    fontWeight: '500'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-xl-mobile:
    fontFamily: Geist
    fontSize: 28px
    fontWeight: '500'
    lineHeight: 36px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '500'
    lineHeight: 32px
    letterSpacing: -0.015em
  headline-sm:
    fontFamily: Geist
    fontSize: 20px
    fontWeight: '500'
    lineHeight: 28px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
    letterSpacing: -0.005em
  body-md:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
    letterSpacing: 0em
  body-sm:
    fontFamily: Geist
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: 0em
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.04em
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '400'
    lineHeight: 14px
    letterSpacing: 0.06em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-sm: 1rem
  gutter-lg: 2rem
  margin: 2rem
  margin-mobile: 1.25rem
  margin-desktop: 3rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1.25rem
  space-xl: 2rem
  space-2xl: 3.5rem
---

## Brand & Style

The design system establishes a high-craft, cerebral aesthetic suited for a senior technologist and designer's personal portfolio paired with an editorial-grade administration console. The visual mood evokes an architectural studio catalog or a bespoke technical ledger: focused, authoritative, highly structured, and timeless.

It relies on a synthesis of **Minimalism** and **Subtle Structural Hierarchy**. The interface strictly avoids decorative excess, neon glows, vibrant gradients, or futuristic cyber-tropes. Instead, depth and premium feel emerge from deep navy tonal stepping, crisp hairline boundaries, typographic contrast, and restrained cool blue highlights. 

Key attributes:
- **Tone:** Intellectual, composed, architectural, precise.
- **Audience:** Design directors, engineering leaders, enterprise clients, and technical collaborators expecting absolute visual control and efficiency.
- **Atmosphere:** Deep navy obsidian canvases populated by luminous, legible warm-white type and whisper-thin delineation lines.

## Colors

The palette operates in dark mode by default, anchoring interfaces in dense, dark oceanic tones while ensuring high typographic contrast and reduced eye fatigue during administrative work.

### Color Tiers & Values
- **Canvas Base (`#061426`):** The foundational backdrop for the entire viewport.
- **Surface Elevation 1 (`#0B192C`):** Applied to primary cards, structural sidebars, tables, and modal backgrounds.
- **Surface Elevation 2 (`#0F2238`):** Hover states, nested rows, dropdown containers, and inactive segmented tabs.
- **Surface Elevation 3 (`#162B45`):** Active selections, pill backgrounds, and subtle highlight containers.
- **Primary Accent (`#3A86C8`):** Key interactive affordances, focal badges, and text links requiring clear prominence.
- **Secondary Accent (`#006DAA`):** Solid button fills, pressed link states, and interactive baseline states.
- **Tertiary Accent / Sky Highlight (`#B9D6F2`):** Used sparingly for status indicators, active pill tags, high-value metrics, and text selection.
- **Primary Text (`#F0F4F8`):** Off-white editorial tone used for major headings, input text, and high-emphasis body copy.
- **Secondary Text (`#8FA3BF`):** Muted cool blue-gray for labels, captions, table headers, and structural metadata.
- **Border / Hairline (`#192B40`):** Single-pixel perimeter rules.
- **Active Border / Focus (`#3A86C8`):** Subtle hairline definition for focused inputs or active cards.

## Typography

The typography couples the architectural geometric proportions of **Geist** for headlines and standard running copy with the precision of **JetBrains Mono** for administrative metadata, indexes, badges, metrics, and timestamps.

### Implementation Rules
- **Headlines:** Set in Geist with snug negative tracking (`-0.01em` to `-0.03em`) to deliver an editorial presence. Headlines must avoid overly heavy weights—capping at medium (`500`) or semibold (`600`) to preserve an uncrowded feel.
- **Body:** Built for sustained readability across long-form case studies and administrative data inspection. Line heights are calibrated between 1.5x and 1.6x.
- **Labels & Data:** All table headers, status tags, form micro-labels, code blocks, and CMS meta-keys must use JetBrains Mono, rendered in uppercase where applicable, with relaxed letter spacing (`0.04em` to `0.06em`).

## Layout & Spacing

The layout model implements a structural, strict **fixed-fluid hybrid grid** engineered to support both expansive public showcase pages and dense administrative tables.

### Layout Mechanics
- **Public Portfolio:** 12-column grid maxing out at `1280px` centered width. Employs generous vertical section rhythm (`space-2xl` and above) to give work studies breathing room.
- **Admin CMS:** Collapsible 240px sidebar paired with an edge-to-edge fluid dashboard layout constrained to a maximum width of `1600px`. Element gaps remain compact (`space-xs` to `space-md`) to ensure dense information visibility above the fold.
- **Breakpoints:**
  - `sm` (0px - 767px): 4-column layout, `margin-mobile` outer padding, components stack vertically.
  - `md` (768px - 1023px): 8-column layout, `gutter-sm` gutter width, sidebars fold into flyout drawers.
  - `lg` (1024px+): 12-column layout, persistent navigation, multi-pane administrative panels.

## Elevation & Depth

Visual hierarchy does not use diffuse, blurry, or neon-cast dropshadows. Depth is articulated exclusively through **tonal layering** and **low-contrast hairlines**.

### Principles
- **Plane Stacking:** The base document sits on `#061426`. Panels and cards lift by adopting `#0B192C`. Floating layers (modals, dropdown menus, flyout inspectors) step forward into `#0F2238`.
- **Hairline Outlines:** Every container, table cell division, and card boundary utilizes a 1px border colored with `#192B40`. This creates razor-sharp structure without adding noise.
- **Restrained Elevation Shadows:** For elements that truly float above the screen (context menus, confirmation modals), use an ambient, non-colored obsidian drop:
  - `box-shadow: 0 8px 24px -4px rgba(2, 6, 12, 0.6), 0 2px 6px -1px rgba(2, 6, 12, 0.4);`
- **Zero Glassmorphism:** Avoid frosted backdrop blurs (`backdrop-filter: blur()`). Keep surfaces opaque or subtly tinted to emphasize crisp editorial performance.

## Shapes

The interface embraces a restrained **Soft (`1`)** shape language, prioritizing crisp, architectural clarity over playful, bubbly curvature. 

- **Base Radii:** Standard inputs, buttons, and badges use `0.25rem` (4px).
- **Cards & Modals:** Primary content cards and administrative panes use `rounded-lg` (`0.5rem` / 8px).
- **Maximum Radii:** No element should exceed `0.75rem` (12px). Pill-shaped buttons (`rounded-full`) are prohibited except for miniature numerical notification pips and binary status dots.
- **Geometry:** Borders are clean, razor-sharp 1px lines without bevels, skeuomorphic beveling, or synthetic embossing.

## Components

### Buttons
- **Primary:** Solid `#006DAA` background, `#F0F4F8` text, 1px border in `#3A86C8`. Hover state lightens background to `#3A86C8`. Active state deepens to `#0353A4`.
- **Secondary / Ghost:** Transparent background with 1px hairline border in `#192B40` and `#F0F4F8` text. Hover state shifts surface to `#0F2238` and border to `#3A86C8`.
- **Sizing:** Standard CMS button height is 34px (padding: `6px 12px`, text size: `13px`), maintaining administrative compactness.

### Form Inputs & Selects
- **Base Surface:** Background `#0B192C`, text `#F0F4F8`, border 1px solid `#192B40`. Corner radius `4px`.
- **Focus State:** 1px border highlight `#3A86C8` with zero outer glow.
- **Labels:** Set in `JetBrains Mono` (`label-sm`), uppercase, colored `#8FA3BF`, resting precisely 6px above the field.

### Data Tables (CMS)
- **Header:** Sticky `#0B192C` surface, bottom border 1px solid `#192B40`. Text is `label-sm` in `#8FA3BF`.
- **Rows:** Alternating subtle row zebra striping is rejected in favor of uniform `#061426` background with 1px border bottoms (`#192B40`). Hover elevates the specific row to `#0B192C`.
- **Cell Content:** Set in `body-sm` (`13px`). Financials, dates, IDs, and statuses use `JetBrains Mono`.

### Chips & Badges
- **Status Indicators:** Built using an enclosed micro-tag format. Background `#0F2238`, 1px border `#192B40`, typography in `JetBrains Mono` (`11px`).
- **Live / Active Badge:** Uses a 6px circular dot filled with sky highlight `#B9D6F2` flanked by `#F0F4F8` label copy.

### Cards (Showcase & Admin)
- **Structure:** Solid `#0B192C` surface bounded by a continuous 1px `#192B40` border. Internal padding: `space-lg` (20px).
- **Interactive Variants:** On hover, the border transitions cleanly to `#3A86C8` without layout shifts or artificial lifts.

### Checkboxes & Radios
- **Control Box:** 16x16px container, background `#061426`, border 1px solid `#192B40`.
- **Checked State:** Surface switches to `#006DAA` with an interior crisp white `#F0F4F8` check icon. Radios use a centered 6px solid `#B9D6F2` dot.
