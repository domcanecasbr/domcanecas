---
name: dom-canecas-conversion-design
description: Design, revise, or review Dom Canecas marketing pages and product imagery. Use for domcanecas.com.br page design, conversion improvements, product-first layouts, visual identity, galleries, trust content, WhatsApp CTAs, and responsive QA. Preserve the existing static HTML/CSS/JavaScript architecture, SEO, analytics, accessibility, and consent behavior.
---

# Dom Canecas Conversion Design

Make the product tangible before explaining the service. A visitor should see a credible personalized mug, understand the ordering path, and find the WhatsApp action in the first viewport.

## Visual direction

- Keep a clean, premium base, but do not enforce absolute monochrome.
- Use warm cream and terracotta as restrained supporting colors; black remains the primary ink and CTA color.
- Let real customer photography lead. When it is unavailable, use clearly representative, photorealistic product imagery without invented logos, customer names, testimonials, or claims.
- Prefer visible ceramic texture, print detail, packaging, and contextual use over abstract decoration.
- Use rounded containers and fine borders selectively. Avoid making every section look like the same card grid.

## Conversion hierarchy

1. Show the product and primary promise above the fold.
2. Keep one dominant WhatsApp CTA and one lower-emphasis exploration action.
3. Separate the three intents: gifts, companies, and events.
4. Explain approval, production, and delivery near the decision point.
5. Add social proof only from verified material. Never fabricate ratings, client counts, customer quotes, or partner logos.

## Implementation invariants

- Preserve static HTML, CSS, and vanilla JavaScript unless the user explicitly asks for a migration.
- Preserve canonical metadata, structured data, GTM events, WhatsApp tracking parameters, Consent Mode, privacy controls, keyboard navigation, and reduced-motion behavior.
- Optimize raster assets and always set useful `alt`, intrinsic width, intrinsic height, and responsive sizing.
- Keep body text at least 16px, touch targets at least 44px, visible focus styles, sufficient contrast, and no horizontal overflow at 320px.
- Do not cover primary content with the cookie banner on small screens; reserve space while it is visible and keep the message concise.

For exact tokens, image rules, and the review checklist, read [references/brand-and-qa.md](references/brand-and-qa.md).
