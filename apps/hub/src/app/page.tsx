import type { Company } from "@vector/types";
import Header from "./components/header";
import Footer from "./components/footer";
import HomeContent from "./components/home-content";

/* ──────────────────────────────────────────────────────────────────────────
   Seed data — used when @vector/db is unavailable (local dev, no env vars)
   ────────────────────────────────────────────────────────────────────────── */

const SEED_COMPANIES: Company[] = [
  {
    id: "00000000-0000-0000-0000-000000000001",
    name: "SkyShine Aviation Detailing",
    slug: "skyshine-aviation-detailing",
    description:
      "Premium aircraft detailing for private jets, turboprops, and helicopters. Serving the greater Dallas-Fort Worth area since 2012 with top-tier ceramic coatings and paint correction.",
    website: "https://example.com",
    phone: "2145550100",
    email: "info@skyshine.example.com",
    logo_url: null,
    trust_score: 96,
    is_claimed: true,
    claimed_by: null,
    tier: "featured",
    created_at: "2024-08-15T00:00:00Z",
    updated_at: "2024-08-15T00:00:00Z",
  },
  {
    id: "00000000-0000-0000-0000-000000000002",
    name: "AeroBright Finishers",
    slug: "aerobright-finishers",
    description:
      "Specializing in ceramic coating and paint correction for all aircraft types. FAA-compliant products and meticulous attention to detail.",
    website: "https://example.com",
    phone: "3055550101",
    email: "info@aerobright.example.com",
    logo_url: null,
    trust_score: 92,
    is_claimed: true,
    claimed_by: null,
    tier: "premium",
    created_at: "2024-09-02T00:00:00Z",
    updated_at: "2024-09-02T00:00:00Z",
  },
  {
    id: "00000000-0000-0000-0000-000000000003",
    name: "ClearCoat Aero",
    slug: "clearcoat-aero",
    description:
      "Full-service aircraft detailing, interior restoration, and brightwork polishing. Mobile service available across the Southwest.",
    website: "https://example.com",
    phone: "4805550102",
    email: "info@clearcoat.example.com",
    logo_url: null,
    trust_score: 88,
    is_claimed: true,
    claimed_by: null,
    tier: "premium",
    created_at: "2024-10-01T00:00:00Z",
    updated_at: "2024-10-01T00:00:00Z",
  },
  {
    id: "00000000-0000-0000-0000-000000000004",
    name: "JetGlow Services",
    slug: "jetglow-services",
    description:
      "Luxury interior and exterior detailing for corporate fleets. White-glove service with a personal touch.",
    website: "https://example.com",
    phone: "7135550103",
    email: "info@jetglow.example.com",
    logo_url: null,
    trust_score: 85,
    is_claimed: true,
    claimed_by: null,
    tier: "enhanced",
    created_at: "2024-10-20T00:00:00Z",
    updated_at: "2024-10-20T00:00:00Z",
  },
  {
    id: "00000000-0000-0000-0000-000000000005",
    name: "WingWash Pro",
    slug: "wingwash-pro",
    description:
      "Airport-based detailing with fast turnaround times. Trusted by FBOs and flight schools throughout Florida.",
    website: null,
    phone: "3215550104",
    email: "info@wingwash.example.com",
    logo_url: null,
    trust_score: 81,
    is_claimed: false,
    claimed_by: null,
    tier: "enhanced",
    created_at: "2024-11-10T00:00:00Z",
    updated_at: "2024-11-10T00:00:00Z",
  },
  {
    id: "00000000-0000-0000-0000-000000000006",
    name: "Tarmac Touch Detailing",
    slug: "tarmac-touch-detailing",
    description:
      "Mobile detailing service covering the Southeast. Eco-friendly products and a passion for aviation aesthetics.",
    website: null,
    phone: "4045550105",
    email: "info@tarmactouch.example.com",
    logo_url: null,
    trust_score: 76,
    is_claimed: false,
    claimed_by: null,
    tier: "enhanced",
    created_at: "2024-12-01T00:00:00Z",
    updated_at: "2024-12-01T00:00:00Z",
  },
  {
    id: "00000000-0000-0000-0000-000000000007",
    name: "PropWash Aviation Care",
    slug: "propwash-aviation-care",
    description:
      "Eco-friendly waterless wash and detail for GA aircraft. Bringing sustainable care to general aviation.",
    website: null,
    phone: null,
    email: "info@propwash.example.com",
    logo_url: null,
    trust_score: 72,
    is_claimed: false,
    claimed_by: null,
    tier: "basic",
    created_at: "2025-01-05T00:00:00Z",
    updated_at: "2025-01-05T00:00:00Z",
  },
  {
    id: "00000000-0000-0000-0000-000000000008",
    name: "Altitude Shine Co.",
    slug: "altitude-shine-co",
    description:
      "Colorado's premier aircraft appearance specialists. Hangar-based detailing at Centennial Airport.",
    website: null,
    phone: null,
    email: "info@altitudeshine.example.com",
    logo_url: null,
    trust_score: 68,
    is_claimed: false,
    claimed_by: null,
    tier: "basic",
    created_at: "2025-01-15T00:00:00Z",
    updated_at: "2025-01-15T00:00:00Z",
  },
];

/* ──────────────────────────────────────────────────────────────────────────
   Data fetching with try/catch seed fallback
   ────────────────────────────────────────────────────────────────────────── */

async function getCompanies(): Promise<Company[]> {
  try {
    const { searchCompanies, createBrowserClient } = await import(
      "@vector/db"
    );
    const client = createBrowserClient();
    const result = await searchCompanies(client, {
      sort_by: "trust_score",
      sort_order: "desc",
      per_page: 8,
      page: 1,
    });
    return result.companies;
  } catch {
    return SEED_COMPANIES;
  }
}

/* ──────────────────────────────────────────────────────────────────────────
   Page (server component)
   ────────────────────────────────────────────────────────────────────────── */

export default async function HomePage() {
  const companies = await getCompanies();

  return (
    <div className="flex min-h-screen flex-col bg-cream-50">
      <Header />
      <main className="flex-1">
        <HomeContent companies={companies} />
      </main>
      <Footer />
    </div>
  );
}
