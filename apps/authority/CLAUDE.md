# Aircraft Detailing Authority — apps/authority/

## Identity
- **Site**: aircraftdetailingauthority.com
- **Purpose**: Editorial industry-expert ranking and review site
- **Differentiator**: Authority Score leaderboard, expert analysis, magazine feel

## Design System
- **Primary**: Navy #1E3A5F (Tailwind `navy-900`)
- **Accent**: Gold #D4A843 (Tailwind `gold-500`)
- **Background**: White
- **Dark surfaces**: Navy-900/950 (header, footer, hero sections)
- **Heading font**: Playfair Display (CSS var `--font-playfair`) — serif, editorial
- **Body font**: Source Sans 3 (CSS var `--font-source-sans`) — clean sans-serif

## Architecture
- Next.js 14 App Router
- Reuses all `@vector/*` packages (db, types, auth, utils, email, billing)
- Authority Score = branded trust_score with factor breakdown
- Browse by region (not state, not map)
- Editorial/magazine layout patterns

## Key Patterns
- Server components for data fetching with try/catch seed data fallback
- Client components for interactivity (`"use client"`)
- URL-based search state (useSearchParams)
- `navy-*` color palette for primary/dark elements
- `gold-*` color palette for accents, badges, highlights
- All buttons/CTAs use `bg-navy-900 hover:bg-navy-800` or `bg-gold-500 hover:bg-gold-600`
- Authority Score badges use `gold-*` variants
- Serif headings (Playfair Display) give editorial/magazine feel

## This site must look NOTHING like apps/directory/ or apps/near-me/
- No forest green anywhere
- No sky blue anywhere
- No sans-serif headings — use Playfair Display (serif)
- No map-first layout
- Editorial/magazine aesthetic with navy + gold
- Authority Score leaderboard instead of distance or alphabetical
