# Jewmanity — Claude Code Project Rules

## Project Overview
16-page nonprofit website for Jewmanity, a 501(c)(3) supporting mental health and healing for Jewish and Israeli communities. Built by HEK Design Studio.

## Tech Stack (Locked)
- **Framework**: Astro 5.x (NOT 6.x)
- **Styling**: Tailwind CSS 4.x (CSS-first config in `src/styles/global.css`, no `tailwind.config.js`)
- **TypeScript**: Strict mode, no `any` types, `interface Props {}` on all components
- **Animations**: GSAP + ScrollTrigger (Phase 3 — don't add yet unless prompted)
- **CMS**: Sanity (configured — see Sanity CMS section below)
- **Fonts**: Manrope + Inter, self-hosted in `public/fonts/`

## Design Reference
- **PNGs from Figma**: `design-reference/` directory contains 62 screenshots (desktop + mobile for all pages)
- **Always view the relevant design-reference PNG** before building any page
- **Do NOT use Figma MCP tools** (get_metadata, get_design_context, get_variable_defs) — all design tokens have been extracted and are documented below
- **Do NOT search for design files** elsewhere on the filesystem — they are only in `design-reference/`

## Visual QA Workflow
After building any page:
1. Run `npm run screenshot -- http://localhost:4321/[page-path] [name]`
2. View the generated screenshots in `screenshots/`
3. Compare against the corresponding PNG in `design-reference/`
4. Fix any visual discrepancies before delivering

## Design Tokens (Verified from Figma)

### Colors
```
Primary teal:       #3783A3
Primary hover:      #2D6B85
Primary light:      #E8F4F8
Page background:    #FAF8F5
Section alt bg:     #F5F2ED
Footer background:  #244755
Heading text:       #262626
Body text:          #46525F
Muted text:         #6B7280
Card border:        rgba(26, 43, 74, 0.1)
Card shadow:        0px 16px 32px rgba(12,12,13,0.1), 0px 4px 4px rgba(12,12,13,0.05)
Nav background:     rgba(250, 248, 245, 0.9)
Footer link text:   rgba(250, 248, 245, 0.7)
Footer disclaimer:  rgba(250, 248, 245, 0.6)
```

### Typography
```
Headings/Nav/Hero:  Manrope (400, 500)
Cards/Body/UI:      Inter (400, 500)

Section heading:    Manrope Medium 36px/48px, tracking +0.35px, #262626
Section subtitle:   Manrope Regular 24px/29px, tracking -0.44px, #46525F
Nav items:          Manrope Medium 16px/24px, tracking -0.31px, #262626
Card title:         Inter Medium 20px/28px, #262626
Card body:          Inter Regular 14px/24px, #46525F
Card link:          Inter Medium 14px, #3783A3
Button text:        Manrope Medium 14px/24px, tracking -0.31px
Footer legal:       Inter Regular 14px/20px, tracking -0.15px
Footer disclaimer:  Inter Regular 12px/16px
```

### Component Tokens
```
Card border-radius:     24px
Button border-radius:   100px (pill)
Nav border-radius:      1000px (pill)
Values card radius:     16px
Card content padding:   20px
Card content gap:       16px
Nav item gap:           32px
Nav padding:            12px 12px 12px 20px
Button padding:         10px 20px
Footer padding:         64px vertical
Footer icon size:       36px container, 20px icon
Footer icon gap:        24px
```

## Coding Conventions
1. **TypeScript strict** — `interface Props {}` at top of every `.astro` component, no `any` types
2. **Component structure** — Props interface → destructure with defaults → markup
3. **Reusable shared components** live in `src/components/shared/` (HeroSection, CTASection, Card, FAQAccordion, etc.)
4. **Page-specific components** live in `src/components/[section]/` (home/, about/, programs/, etc.)
5. **Tailwind utilities** — use @theme tokens defined in global.css (e.g., `text-primary`, `bg-bg-page`, `font-heading`)
6. **Semantic HTML** — `<nav>`, `<main>`, `<footer>`, `<section>`, `<article>`, proper heading hierarchy (one `<h1>` per page)
7. **Accessibility** — aria attributes, focus-visible styles, 4.5:1 contrast, sr-only labels where needed
8. **No inline styles** — Tailwind only
9. **No external image URLs** — use placeholder gradients with `<!-- Replace with actual image -->` comments
10. **All interactive behavior** in `<script>` tags with vanilla JS (no React/Vue/framework JS)
11. **Section IDs** — every `<section>` gets an `id` attribute for anchor linking
12. **Responsive** — all layouts must work at 375px, 768px, and 1280px+

## File Structure
```
src/
  components/
    Navigation.astro          # Desktop nav (built)
    MobileMenu.astro          # Mobile nav (built)
    Footer.astro              # Site footer (built)
    home/                     # Homepage components (built)
    about/                    # About section components
    programs/                 # Programs section components
    community/                # Community section components
    resources/                # Resources page components
    donate/                   # Donate page components
    shop/                     # Shop page components
    contact/                  # Contact page components
    volunteer/                # Volunteer page components
    shared/                   # Reusable components (HeroSection, CTASection, etc.)
  layouts/
    Layout.astro              # Base layout with nav + footer
  pages/                      # All 19 page routes (all created)
  styles/
    global.css                # Tailwind 4 config + @theme tokens + @font-face
  scripts/
    animations.ts             # GSAP stub (Phase 3)
  lib/
    sanity.ts                 # Sanity client + GROQ query functions
    cms.ts                    # Legacy stub (replaced by sanity.ts)
```

## Sanity CMS
- Project ID: 9pc3wgri
- Dataset: production
- Client: src/lib/sanity.ts
- Schemas: sanity/schemas/
- Every CMS fetch is wrapped in try/catch with hardcoded fallbacks
- Content fetched at build time (static), not runtime
- To run Sanity Studio locally: cd sanity && npx sanity dev

## What NOT To Do
- Do NOT install Astro 6.x
- Do NOT create a `tailwind.config.js` file
- Do NOT use Figma MCP tools
- Do NOT use external image URLs or CDN fonts
- Do NOT add GSAP animations until Phase 3A
- Do NOT remove hardcoded fallback content from CMS-wired pages
- Do NOT add Snipcart/Givebutter/Formspree until Phase 2
- Do NOT modify existing working components unless the prompt explicitly says to
