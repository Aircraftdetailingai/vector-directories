# Aircraft Detailer Near Me — apps/detailer-near-me/

## Identity
- **Site**: aircraftdetailernearme.com
- **Purpose**: Quick matchmaker wizard for finding and quoting aircraft detailers
- **Differentiator**: Step-by-step wizard flow, multi-quote requests, side-by-side comparison

## Design System
- **Primary**: Orange #F97316 (Tailwind `brand-500`)
- **Dark accent**: Warm Brown #92400E (Tailwind `brown-500`)
- **Background**: Cream #FFFBEB (Tailwind `cream-50`)
- **Cards**: White `bg-white` with `border-brand-100`
- **Heading font**: Poppins (CSS var `--font-poppins`) — modern, geometric
- **Body font**: Lato (CSS var `--font-lato`) — clean, friendly

## Architecture
- Next.js 14 App Router
- Reuses all `@vector/*` packages (db, types, auth, utils, email, billing)
- Homepage IS the wizard (4-step matchmaker flow)
- Browse by airport with quote-first approach
- Multi-quote request system (email multiple detailers at once)
- Side-by-side company comparison on profiles

## Key Patterns
- Server components for data fetching with try/catch seed data fallback
- Client components for interactivity (`"use client"`)
- `bg-cream-50` body background
- `bg-white` cards with `border-brand-100` or `border-brand-200`
- `brand-500` for primary buttons, CTAs, active states
- `brown-500` for dark text accents, headings on cream
- `text-brown-500` for headings, `text-gray-600` for body
- Buttons: `bg-brand-500 hover:bg-brand-600 text-white rounded-xl`
- Wizard steps: numbered circles with brand-500 active, brand-200 inactive
- Rounded corners: `rounded-xl` throughout (softer than sharp, less than full)

## This site must look NOTHING like the other five sites
- No forest green, no sky blue, no navy/gold, no teal/coral, no charcoal/electric blue
- No dark mode
- No editorial/magazine layout, no leaderboard, no community hub
- Wizard-first flow — the homepage IS the matchmaker
- Quote-centric — everything leads to requesting quotes
- Orange and cream warmth — approachable, action-oriented
