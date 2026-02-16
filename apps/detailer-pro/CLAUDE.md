# Aircraft Detailer Pro — apps/detailer-pro/

## Identity
- **Site**: aircraftdetailerpro.com
- **Purpose**: Dark mode professional network for aircraft detailing pros
- **Differentiator**: Pro Verified badges, portfolio showcases, analytics/metrics, specialization browse

## Design System
- **Background**: Dark Slate #0F172A (Tailwind `slate-950`)
- **Cards/Surfaces**: Charcoal #1F2937 (Tailwind `slate-800`)
- **Accent**: Electric Blue #3B82F6 (Tailwind `electric-500`)
- **Text primary**: White / `slate-100`
- **Text secondary**: `slate-400`
- **Borders**: `slate-700` or `slate-750`
- **Heading font**: Space Grotesk (CSS var `--font-space-grotesk`) — technical, modern
- **Body font**: DM Sans (CSS var `--font-dm-sans`) — clean, professional

## Architecture
- Next.js 14 App Router
- Reuses all `@vector/*` packages (db, types, auth, utils, email, billing)
- Browse by specialization (primary navigation)
- Dark mode ENTIRE site — no light mode
- Pro dashboard aesthetic with metrics and analytics feel

## Key Patterns
- Server components for data fetching with try/catch seed data fallback
- Client components for interactivity (`"use client"`)
- `bg-slate-950` body background (darkest)
- `bg-slate-800` for cards and surfaces
- `bg-slate-900` for slightly elevated surfaces
- `border-slate-700` for borders
- `electric-500` for accent buttons, links, active states, badges
- `electric-400` for hover states on text
- `text-white` for headings, `text-slate-300/400` for body
- Pro Verified badge: `bg-electric-500/10 text-electric-400 border border-electric-500/30`
- Buttons: `bg-electric-500 hover:bg-electric-600 text-white`
- Rounded corners: `rounded-lg` (sharp, professional — NOT rounded-2xl)

## This site must look NOTHING like the other four sites
- No forest green, no sky blue, no navy/gold, no teal/coral
- No cream/white backgrounds
- No rounded-2xl or rounded-full buttons
- No serif headings, no warm/friendly aesthetic
- Dark mode only — professional, technical, dashboard-like
- Sharp corners, monospace accents, metric displays
