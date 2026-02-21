
# 🎨 DESIGN SYSTEM DOCUMENT

## Product: Midnight Typewriter

AI-Assisted Editorial Publishing Platform

---

# 1. Design Philosophy

Midnight Typewriter is not a dashboard.
It is a digital literary space.

Design must feel:

* Intentional
* Atmospheric
* Typographic
* Editorial
* Confident

We reject:

* Generic SaaS layouts
* Overused fonts
* Safe neutral palettes
* Over-rounded components
* “AI startup” visuals

Every decision must feel deliberate.

---

# 2. Core Visual Identity

## 2.1 Experience Archetype

Midnight Typewriter should evoke:

* A quiet midnight writing session
* Ink on paper
* Literary magazine spreads
* Vintage print editorial layouts
* Subtle IDE theme contrast

This is not playful.
This is contemplative and powerful.

---

# 3. Typography System (Primary Identity Driver)

Typography carries 60% of the visual identity.

---

## 3.1 Font Hierarchy

### Display (Headlines)

* High-personality serif
* Large scale (5xl–8xl)
* Tight letter-spacing
* Strong vertical rhythm

Used for:

* Hero titles
* Post titles
* Section headers

---

### Body Text

* Classic serif
* Comfortable line height (1.6–1.8)
* 16–18px base

Used for:

* Post content
* Descriptions
* Metadata

---

### Monospace

* Used exclusively for:

  * AI generator interface
  * Technical tags
  * Metadata emphasis

---

## 3.2 Typographic Scale

Use a modular scale:

| Role  | Size    |
| ----- | ------- |
| Hero  | 72–96px |
| H1    | 48–64px |
| H2    | 36–42px |
| H3    | 24–28px |
| Body  | 16–18px |
| Small | 14px    |

Generous whitespace between sections is mandatory.

---

# 4. Color System

Color must be decisive. No timid palettes.

---

## 4.1 Theme 1 — Obsidian Ink (Dark)

Dominant Base:

* Deep charcoal

Primary Accent:

* Electric saffron

Secondary Accent:

* Muted teal

Text:

* Warm ivory

Accent usage must not exceed 10–15% of screen area.

---

## 4.2 Theme 2 — Paper & Ink (Light)

Base:

* Warm off-white paper tone

Primary Accent:

* Ink black

Secondary Accent:

* Deep muted red

This theme must feel editorial, not corporate.

---

## 4.3 Color Rules

* No hardcoded hex values inside components
* All colors referenced via CSS variables
* Hover states use accent intensification
* No gradients unless layered for atmospheric depth

---

# 5. Background System

Backgrounds create mood.

Never use flat default grays.

---

## 5.1 Layered Background Strategy

* Base color
* Subtle radial gradient
* Extremely low-opacity accent glow
* Optional grain texture (future enhancement)

This creates depth without clutter.

---

# 6. Layout Philosophy

Avoid:

* Symmetrical SaaS grids
* Centered “marketing page” layout
* Card-heavy interfaces
* Heavy shadows

Use:

* Asymmetry
* Strong vertical stacking
* Large margins
* Hard edges and borders
* Typography-driven sections

Whitespace is structural, not decorative.

---

# 7. Component Design Guidelines

---

## 7.1 Buttons

Style:

* Border-based emphasis
* No heavy shadows
* Accent color on hover
* Letter-spacing increase on hover

Interaction:

* 300–500ms transitions
* Smooth, not snappy

---

## 7.2 Post Cards

Avoid:

* Rounded-2xl
* Drop shadows
* Glassmorphism

Use:

* Sharp corners
* Border emphasis
* Large title-first layout

Content hierarchy:
Title
Description
Metadata

---

## 7.3 Forms

Inputs:

* Underlined style preferred
* Transparent background
* Focus state uses accent color
* Minimalistic labels

AI generator should feel distinct:

* Monospace
* Slight glow accent
* Terminal-like atmosphere

---

# 8. Motion System

Motion is deliberate, not decorative.

---

## 8.1 Page Load Choreography

On page load:

1. Headline fades in (0ms)
2. Subtext (200ms delay)
3. Buttons (400ms delay)
4. Secondary elements (600ms delay)

Use transform + opacity only.
Avoid layout-shifting animations.

---

## 8.2 Interaction Motion

Hover:

* Border color shift
* Slight letter-spacing expansion
* Minimal translateY

Focus:

* Clear visible focus ring
* Accessible color contrast

---

## 8.3 AI Activation Moment

When AI generation starts:

* Subtle accent pulse
* Thin animated top border
* Loading text with animated ellipsis

Must feel intentional, not flashy.

---

# 9. Theming Architecture

Themes must:

* Be switchable dynamically
* Modify CSS variables only
* Never require component rewrites

Implementation approach:

* Root class toggle
* Variable override
* Centralized theme context

No inline overrides allowed.

---

# 10. Accessibility Standards

* WCAG AA contrast minimum
* Focus-visible states required
* Keyboard navigation support
* Avoid color-only information cues

Design elegance must not compromise usability.

---

# 11. What Is Strictly Forbidden

* Inter, Roboto, system defaults
* Purple gradient hero sections
* SaaS-style rounded card grids
* Overused glassmorphism
* Random micro-animations
* Stock UI kit aesthetic

If it looks like a startup template, it fails.

---

# 12. Emotional Experience Goals

Users should feel:

* Focused
* Thoughtful
* Calm
* In control
* Inspired

The platform must feel like a writing instrument — not a social network.

---

# 13. Future Visual Extensions

* Subtle paper texture overlays
* Dynamic typography scaling
* Seasonal theme variations
* Print-friendly export view
* Reading mode toggle

---

# 14. Design System Governance

To prevent drift:

* All colors via variables
* All typography via defined classes
* No one-off design decisions
* Component library must be documented
* Design audits before major releases

---

# Final Principle

Midnight Typewriter must feel:

Crafted > Generated
Editorial > Startup
Atmospheric > Flat
Deliberate > Decorative

