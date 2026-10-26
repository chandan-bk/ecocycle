---
name: EcoCycle Impeccable Design System
description: Forest Patina system. Deep botanical forest green ground, vibrant verdigris patina accents, warm muted sage surfaces, and kinpaku amber highlights. Restraint in chrome, architectural structure in layout, zero AI-slop tells.

colors:
  # Brand Anchors
  forest-dark: "#0F3D2E"       # Deep forest green (core brand, high-contrast dark surfaces)
  forest-deep: "#09251C"       # Deepest botanical black/green for rich contrast
  forest-ink: "#12261D"        # Slate forest ink for headlines and primary text
  patina-green: "#2FA36B"      # Vibrant leaf/patina green (primary action & verified state)
  patina-vibrant: "#1C7C54"    # Deep emerald green for active buttons & borders
  patina-soft: "#E8F5EE"       # Soft tinted sage fill for cards & containers
  kinpaku-amber: "#F2B134"     # Warm amber gold for secondary highlights & badges

  # Neutral & Paper Surfaces
  surface-ground: "#F8FAF8"    # Warm botanical off-white page background
  surface-card: "#FFFFFF"      # Crisp elevated card surface
  surface-inset: "#EDF3EF"     # Subdued inset for inputs, code blocks, and tables
  surface-border: "#D6E5DC"    # Subtle hair-line divider border (tinted from sage)
  surface-border-strong: "#B4CFC1" # Focused or interactive element border

  # Text & Copy
  text-primary: "#12261D"      # Dominant text (≥ 7:1 contrast on light surfaces)
  text-body: "#1E2922"         # Deep charcoal earth body text
  text-secondary: "#3F584C"    # Tinted botanical secondary text (never sterile gray)
  text-muted: "#52665A"        # Muted moss text for captions and secondary labels
  text-faint: "#6B8477"        # Subdued captions & metadata
  text-inverse: "#FFFFFF"      # Pure white on dark forest grounds
  text-inverse-tint: "#D1EBE0" # Tinted mint text on dark forest grounds

  # Semantic States
  status-pending: "#D97706"    # Warm amber for pending triage
  status-scheduled: "#0284C7"  # Clean azure for scheduled logistics
  status-collected: "#16A34A"  # Forest green for verified collection
  status-hazard: "#DC2626"     # Clear vermilion red for hazardous toxins & cancellations
  map-marker: "#059669"        # Map pin highlight
  map-marker-pulse: "rgba(5, 150, 105, 0.4)"

typography:
  scale:
    "10": "0.625rem"
    "11": "0.6875rem"
    "12": "0.75rem"
    "13": "0.8125rem"
    "14": "0.875rem"
    "15": "0.9375rem"
    "16": "1rem"
    "18": "1.125rem"
    "20": "1.25rem"
    "24": "1.5rem"
    "28": "1.75rem"
    "32": "2rem"
    "36": "2.25rem"
    "40": "2.5rem"
    "48": "3rem"
    "56": "3.5rem"
    "64": "4rem"
  display:
    fontFamily: "'Albert Sans', 'Lexend', -apple-system, sans-serif"
    fontWeight: "800"
    letterSpacing: "-0.03em"
    lineHeight: "1.1"
  headline:
    fontFamily: "'Albert Sans', 'Lexend', -apple-system, sans-serif"
    fontWeight: "700"
    letterSpacing: "-0.02em"
    lineHeight: "1.2"
  title:
    fontFamily: "'Albert Sans', 'Lexend', -apple-system, sans-serif"
    fontWeight: "600"
    lineHeight: "1.3"
  body:
    fontFamily: "'Albert Sans', 'Lexend', -apple-system, sans-serif"
    fontWeight: "400"
    lineHeight: "1.65"
  mono:
    fontFamily: "'JetBrains Mono', 'Fira Code', monospace"
    fontSize: "0.85rem"

rounded:
  sm: "6px"
  md: "10px"
  lg: "16px"
  xl: "20px"
  full: "9999px"

spacing:
  section-gap: "5rem"
  card-padding: "1.75rem"
  inline-gap: "1rem"

craft-floor:
  bans:
    - No side-tab colored accent borders (border-l-4)
    - No generic pill/eyebrow chips above headings
    - No icon-in-rounded-box stacked on top of heading templates
    - No bouncing/pulsing animations on static elements
    - No hairline borders with wide fuzzy shadows on every card
    - No gray text on colored backgrounds (always tint from ground hue)
    - No cards nested inside cards
---

# Design Philosophy & Visual Language

1. **Architectural Grid & Flow**: Replace the repetitive 3-box identical card templates with asymmetric editorial structures, responsive tables, integrated flow ribbons, and clear typographic hierarchy.
2. **Material Honesty**: Use tactile, physical depth with crisp 1px borders tinted from the green spectrum (`#D6E5DC`) rather than muddy AI drop-shadows.
3. **Intentional Typographic Restraint**: Text lines are capped at comfortable reading measures (65–75ch) with `text-wrap: balance` on all section headings and `text-wrap: pretty` on long-form paragraphs.
4. **Purposeful States**: Interactive controls have immediate tactile feedback with active press scales (`active:scale-[0.98]`), clear visible focus rings (`ring-2 ring-forest-dark ring-offset-2`), and rich semantic transitions.
