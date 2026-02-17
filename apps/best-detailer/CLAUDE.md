# Best Aircraft Detailer — apps/best-detailer/

## Identity
- **Site**: bestaircraftdetailer.com
- **Purpose**: Premium luxury curator — editorial selection of the finest aircraft detailers
- **Differentiator**: Editor's Choice awards, curated collections, luxury photography-forward profiles

## Design System
- **Primary**: Black #0A0A0A (Tailwind `noir-900`)
- **Accent**: Champagne Gold #D4AF37 (Tailwind `gold-500`)
- **Background**: Off-white #FAFAF9 (Tailwind `ivory-50`)
- **Cards**: White `bg-white` with `border-ivory-200`
- **Heading font**: Cormorant Garamond (CSS var `--font-cormorant`) — elegant serif
- **Body font**: Raleway (CSS var `--font-raleway`) — refined sans-serif

## Architecture
- Next.js 14 App Router
- Reuses all `@vector/*` packages (db, types, auth, utils, email, billing)
- Luxury editorial homepage with hero, Editor's Choice, curated collections
- Browse by awards and curated collections
- Photography-forward company profiles with before/after showcases
- Full claim flow and dashboard in black and gold

## Key Patterns
- Server components for data fetching with try/catch seed data fallback
- Client components for interactivity (`"use client"`)
- `bg-ivory-50` body background
- `bg-white` cards with `border-ivory-200`
- `bg-noir-900` for dark sections, headers, footers
- `gold-500` for accents, badges, Editor's Choice stars, CTAs on dark bg
- `text-noir-900` for headings on light bg, `text-gold-500` on dark bg
- `text-ivory-400` for body text on dark bg
- Buttons on dark: `bg-gold-500 hover:bg-gold-600 text-noir-900 font-semibold`
- Buttons on light: `bg-noir-900 hover:bg-noir-800 text-white`
- Editor's Choice badge: gold star + `bg-gold-50 text-gold-700 border-gold-200`
- Rounded corners: `rounded-none` or `rounded-sm` (sharp luxury feel, NOT rounded-xl)
- Lots of whitespace and elegant spacing

## This site must look NOTHING like the other six sites
- No forest green, no sky blue, no navy/gold, no teal/coral, no charcoal/electric blue, no orange/cream
- No wizard flows, no map-first, no leaderboards, no community hub
- No rounded-xl corners — use sharp/minimal rounding
- Luxury editorial magazine aesthetic
- Gold accents are champagne/muted, not bright yellow
- Heavy use of black backgrounds with gold typography
- Photography and visual excellence front and center
