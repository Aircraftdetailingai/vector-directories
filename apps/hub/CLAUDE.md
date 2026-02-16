# Aviation Detailing Hub — apps/hub/

## Identity
- **Site**: aviationdetailinghub.com
- **Purpose**: Community hub for aviation detailing services
- **Differentiator**: Warm community feel, service category browsing, detailer spotlights

## Design System
- **Primary**: Teal #0D9488 (Tailwind `teal-600`)
- **Accent**: Coral #FB7185 (Tailwind `coral-400`)
- **Background**: Cream #FFFBEB (Tailwind `cream-50`)
- **Dark surfaces**: Teal-900/950 (footer)
- **Heading font**: Nunito (CSS var `--font-nunito`) — rounded, friendly
- **Body font**: Open Sans (CSS var `--font-open-sans`) — clean, readable

## Architecture
- Next.js 14 App Router
- Reuses all `@vector/*` packages (db, types, auth, utils, email, billing)
- Browse by service category (primary navigation)
- Community-focused: spotlights, stories, warm language
- Cream background throughout for warmth

## Key Patterns
- Server components for data fetching with try/catch seed data fallback
- Client components for interactivity (`"use client"`)
- `teal-*` color palette for primary elements
- `coral-*` color palette for accents, highlights, CTAs
- `cream-50` background on body for warmth
- All buttons/CTAs use `bg-teal-600 hover:bg-teal-700` or `bg-coral-400 hover:bg-coral-500`
- Trust score badges use coral accents
- Rounded corners everywhere (rounded-2xl) for friendly feel

## This site must look NOTHING like the other three sites
- No forest green, no sky blue, no navy
- No serif headings
- No map-first or editorial/magazine layout
- Warm, friendly, community-oriented aesthetic
- Cream background (not pure white)
- Service categories as primary browse method
