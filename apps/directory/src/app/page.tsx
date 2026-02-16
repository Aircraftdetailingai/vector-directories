import type { Company } from "@vector/types";
import { Header } from "./components/header";
import { Hero } from "./components/hero";
import { BrowseByState } from "./components/browse-by-state";
import { FeaturedDetailers } from "./components/featured-detailers";
import { RecentAdditions } from "./components/recent-additions";
import { Footer } from "./components/footer";

/* ──────────────────────────────────────────────────────────────────────────
   Data fetching

   These functions attempt to read from @vector/db via Supabase. When no
   database is configured (local dev without env vars), they return static
   seed data so the page still renders.
   ────────────────────────────────────────────────────────────────────────── */

const SEED_FEATURED: Company[] = [
  {
    id: "00000000-0000-0000-0000-000000000001",
    name: "SkyShine Aviation Detailing",
    slug: "skyshine-aviation-detailing",
    description: "Premium aircraft detailing for private jets, turboprops, and helicopters. Serving the greater Dallas-Fort Worth area since 2012.",
    website: "https://example.com",
    phone: "2145550100",
    email: "info@example.com",
    logo_url: null,
    trust_score: 94,
    is_claimed: true,
    claimed_by: null,
    tier: "premium",
    created_at: "2024-10-15T00:00:00Z",
    updated_at: "2024-10-15T00:00:00Z",
  },
  {
    id: "00000000-0000-0000-0000-000000000002",
    name: "AeroBright Finishers",
    slug: "aerobright-finishers",
    description: "Specializing in ceramic coating and paint correction for all aircraft types. FAA-compliant products only.",
    website: "https://example.com",
    phone: "3055550101",
    email: "info@example.com",
    logo_url: null,
    trust_score: 88,
    is_claimed: true,
    claimed_by: null,
    tier: "premium",
    created_at: "2024-11-02T00:00:00Z",
    updated_at: "2024-11-02T00:00:00Z",
  },
  {
    id: "00000000-0000-0000-0000-000000000003",
    name: "ClearCoat Aero",
    slug: "clearcoat-aero",
    description: "Full-service aircraft detailing, interior restoration, and brightwork polishing. Mobile service available.",
    website: "https://example.com",
    phone: "4805550102",
    email: "info@example.com",
    logo_url: null,
    trust_score: 81,
    is_claimed: false,
    claimed_by: null,
    tier: "enhanced",
    created_at: "2024-12-01T00:00:00Z",
    updated_at: "2024-12-01T00:00:00Z",
  },
];

const SEED_RECENT: Company[] = [
  {
    id: "00000000-0000-0000-0000-000000000004",
    name: "WingWash Pro",
    slug: "wingwash-pro",
    description: "Airport-based detailing with fast turnaround.",
    website: null,
    phone: null,
    email: null,
    logo_url: null,
    trust_score: 72,
    is_claimed: false,
    claimed_by: null,
    tier: "basic",
    created_at: "2025-01-20T00:00:00Z",
    updated_at: "2025-01-20T00:00:00Z",
  },
  {
    id: "00000000-0000-0000-0000-000000000005",
    name: "JetGlow Services",
    slug: "jetglow-services",
    description: "Luxury interior and exterior detailing for corporate fleets.",
    website: null,
    phone: null,
    email: null,
    logo_url: null,
    trust_score: 65,
    is_claimed: true,
    claimed_by: null,
    tier: "enhanced",
    created_at: "2025-01-18T00:00:00Z",
    updated_at: "2025-01-18T00:00:00Z",
  },
  {
    id: "00000000-0000-0000-0000-000000000006",
    name: "Tarmac Touch Detailing",
    slug: "tarmac-touch-detailing",
    description: "Mobile detailing service covering the Southeast.",
    website: null,
    phone: null,
    email: null,
    logo_url: null,
    trust_score: null,
    is_claimed: false,
    claimed_by: null,
    tier: "basic",
    created_at: "2025-01-15T00:00:00Z",
    updated_at: "2025-01-15T00:00:00Z",
  },
  {
    id: "00000000-0000-0000-0000-000000000007",
    name: "PropWash Aviation Care",
    slug: "propwash-aviation-care",
    description: "Eco-friendly waterless wash and detail for GA aircraft.",
    website: null,
    phone: null,
    email: null,
    logo_url: null,
    trust_score: 58,
    is_claimed: false,
    claimed_by: null,
    tier: "basic",
    created_at: "2025-01-10T00:00:00Z",
    updated_at: "2025-01-10T00:00:00Z",
  },
  {
    id: "00000000-0000-0000-0000-000000000008",
    name: "Altitude Shine Co.",
    slug: "altitude-shine-co",
    description: "Colorado's premier aircraft appearance specialists.",
    website: null,
    phone: null,
    email: null,
    logo_url: null,
    trust_score: 45,
    is_claimed: false,
    claimed_by: null,
    tier: "basic",
    created_at: "2025-01-05T00:00:00Z",
    updated_at: "2025-01-05T00:00:00Z",
  },
];

async function getFeaturedCompanies(): Promise<Company[]> {
  try {
    const { searchCompanies, createBrowserClient } = await import("@vector/db");
    const client = createBrowserClient();
    const result = await searchCompanies(client, {
      sort_by: "trust_score",
      sort_order: "desc",
      per_page: 6,
      page: 1,
    });
    return result.companies;
  } catch {
    return SEED_FEATURED;
  }
}

async function getRecentCompanies(): Promise<Company[]> {
  try {
    const { searchCompanies, createBrowserClient } = await import("@vector/db");
    const client = createBrowserClient();
    const result = await searchCompanies(client, {
      sort_by: "created_at",
      sort_order: "desc",
      per_page: 5,
      page: 1,
    });
    return result.companies;
  } catch {
    return SEED_RECENT;
  }
}

async function getStats() {
  try {
    const { listCompanies, createBrowserClient } = await import("@vector/db");
    const client = createBrowserClient();
    const { count } = await listCompanies(client, { perPage: 1 });
    return { totalCompanies: count, totalStates: 50, totalAirports: 520 };
  } catch {
    return { totalCompanies: 2847, totalStates: 50, totalAirports: 520 };
  }
}

export default async function HomePage() {
  const [featured, recent, stats] = await Promise.all([
    getFeaturedCompanies(),
    getRecentCompanies(),
    getStats(),
  ]);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Hero
          totalCompanies={stats.totalCompanies}
          totalStates={stats.totalStates}
          totalAirports={stats.totalAirports}
        />
        <BrowseByState />
        <FeaturedDetailers companies={featured} />
        <RecentAdditions companies={recent} />
      </main>
      <Footer />
    </div>
  );
}
