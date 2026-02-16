# Aircraft Detailing Near Me — apps/near-me/

## Identity
- **Site**: aircraftdetailingnearme.com
- **Purpose**: Map-first local finder for aircraft detailing services
- **Differentiator**: GPS-aware, distance-sorted, map-centric UX

## Design System
- **Primary**: Sky blue #0EA5E9 (Tailwind `sky-500` / `brand-500`)
- **Accent**: Emerald #10B981 (Tailwind `emerald-500`)
- **Background**: White
- **Dark surfaces**: Gray-900 (footer, overlays)
- **Heading font**: Inter (CSS var `--font-inter`)
- **Body font**: Roboto (CSS var `--font-roboto`)

## Architecture
- Next.js 14 App Router
- Reuses all `@vector/*` packages (db, types, auth, utils, email, billing)
- Mapbox GL JS for all map rendering (`NEXT_PUBLIC_MAPBOX_TOKEN`)
- Client-side distance calculation via Haversine formula
- GPS auto-detect via `navigator.geolocation`

## Key Patterns
- Server components for data fetching with try/catch seed data fallback
- Client components for map + interactivity (`"use client"`)
- URL-based search state (useSearchParams)
- `brand-*` color palette maps to sky-blue shades
- All buttons/CTAs use `bg-brand-500 hover:bg-brand-600`
- Trust score badges use `bg-emerald-*` variants

## This site must look NOTHING like apps/directory/
- No forest green anywhere
- No serif fonts
- Map-first layout (not list-first)
- Modern, clean, minimal aesthetic
