import type { Company } from "@vector/types";
import Header from "./components/header";
import Footer from "./components/footer";
import HomeContent from "./components/home-content";

/* ──────────────────────────────────────────────────────────────────────────
   Seed Data — 10 aircraft detailing companies ranked by Authority Score.
   Used when @vector/db is unavailable (local dev without env vars).
   ────────────────────────────────────────────────────────────────────────── */

const SEED_COMPANIES: Company[] = [
  {
    id: "00000000-0000-0000-0000-000000000101",
    name: "Prestige Aviation Detail",
    slug: "prestige-aviation-detail",
    description:
      "The gold standard in aircraft detailing. Prestige serves Fortune 500 fleets and heads of state with white-glove exterior polishing, ceramic nano-coatings, and bespoke interior restoration at Teterboro and Palm Beach International.",
    trust_score: 95,
    tier: "featured",
    is_claimed: true,
    claimed_by: null,
    website: "https://example.com",
    phone: "2015550100",
    email: "info@prestigeaviation.com",
    logo_url: null,
    created_at: "2024-06-01T00:00:00Z",
    updated_at: "2025-01-15T00:00:00Z",
  },
  {
    id: "00000000-0000-0000-0000-000000000102",
    name: "SkyShine Aviation Detailing",
    slug: "skyshine-aviation-detailing",
    description:
      "Premium aircraft detailing for private jets, turboprops, and helicopters. Serving the greater Dallas-Fort Worth area since 2012 with FAA-compliant products and meticulous paint correction.",
    trust_score: 91,
    tier: "premium",
    is_claimed: true,
    claimed_by: null,
    website: "https://example.com",
    phone: "2145550101",
    email: "info@skyshine.com",
    logo_url: null,
    created_at: "2024-07-10T00:00:00Z",
    updated_at: "2025-01-10T00:00:00Z",
  },
  {
    id: "00000000-0000-0000-0000-000000000103",
    name: "AeroBright Finishers",
    slug: "aerobright-finishers",
    description:
      "Specializing in ceramic coating and paint correction for all aircraft types. AeroBright's FAA-compliant products and clean-room interior work set the bar in South Florida.",
    trust_score: 88,
    tier: "premium",
    is_claimed: true,
    claimed_by: null,
    website: "https://example.com",
    phone: "3055550102",
    email: "info@aerobright.com",
    logo_url: null,
    created_at: "2024-08-05T00:00:00Z",
    updated_at: "2025-01-08T00:00:00Z",
  },
  {
    id: "00000000-0000-0000-0000-000000000104",
    name: "Pacific Wings Detail Co.",
    slug: "pacific-wings-detail-co",
    description:
      "Full-service aircraft cleaning and detailing at Van Nuys and LAX. Known for celebrity and studio fleet accounts with a commitment to eco-friendly waterless wash technology.",
    trust_score: 85,
    tier: "premium",
    is_claimed: true,
    claimed_by: null,
    website: "https://example.com",
    phone: "3105550103",
    email: "info@pacificwings.com",
    logo_url: null,
    created_at: "2024-09-12T00:00:00Z",
    updated_at: "2025-01-05T00:00:00Z",
  },
  {
    id: "00000000-0000-0000-0000-000000000105",
    name: "ClearCoat Aero",
    slug: "clearcoat-aero",
    description:
      "Full-service aircraft detailing, interior restoration, and brightwork polishing. ClearCoat offers mobile service across the Phoenix metro and Scottsdale airport corridor.",
    trust_score: 82,
    tier: "enhanced",
    is_claimed: true,
    claimed_by: null,
    website: "https://example.com",
    phone: "4805550104",
    email: "info@clearcoataero.com",
    logo_url: null,
    created_at: "2024-10-01T00:00:00Z",
    updated_at: "2025-01-02T00:00:00Z",
  },
  {
    id: "00000000-0000-0000-0000-000000000106",
    name: "Lone Star Aircraft Services",
    slug: "lone-star-aircraft-services",
    description:
      "Houston-based aircraft detailing specialists covering all major Texas FBOs. Expert paint protection, interior leather care, and corporate fleet maintenance programs.",
    trust_score: 78,
    tier: "enhanced",
    is_claimed: false,
    claimed_by: null,
    website: "https://example.com",
    phone: "7135550105",
    email: "info@lonestaircraft.com",
    logo_url: null,
    created_at: "2024-10-20T00:00:00Z",
    updated_at: "2024-12-28T00:00:00Z",
  },
  {
    id: "00000000-0000-0000-0000-000000000107",
    name: "Empire State Aviation Detail",
    slug: "empire-state-aviation-detail",
    description:
      "Serving the greater New York City area with expert aircraft detailing from Westchester County Airport to Republic Airport. Specializing in heavy jets and VVIP interiors.",
    trust_score: 74,
    tier: "enhanced",
    is_claimed: true,
    claimed_by: null,
    website: null,
    phone: "9145550106",
    email: "info@empirestateaviation.com",
    logo_url: null,
    created_at: "2024-11-05T00:00:00Z",
    updated_at: "2024-12-20T00:00:00Z",
  },
  {
    id: "00000000-0000-0000-0000-000000000108",
    name: "Mile High Detailing",
    slug: "mile-high-detailing",
    description:
      "Colorado's premier aircraft appearance specialists. High-altitude UV protection, ceramic coatings, and comprehensive interior detailing at Centennial and Rocky Mountain airports.",
    trust_score: 70,
    tier: "basic",
    is_claimed: false,
    claimed_by: null,
    website: null,
    phone: "3035550107",
    email: null,
    logo_url: null,
    created_at: "2024-11-20T00:00:00Z",
    updated_at: "2024-12-15T00:00:00Z",
  },
  {
    id: "00000000-0000-0000-0000-000000000109",
    name: "JetGlow Services",
    slug: "jetglow-services",
    description:
      "Luxury interior and exterior detailing for corporate fleets based out of Atlanta's DeKalb-Peachtree Airport. Specializing in Gulfstream and Bombardier platforms.",
    trust_score: 65,
    tier: "basic",
    is_claimed: true,
    claimed_by: null,
    website: null,
    phone: null,
    email: null,
    logo_url: null,
    created_at: "2024-12-01T00:00:00Z",
    updated_at: "2024-12-10T00:00:00Z",
  },
  {
    id: "00000000-0000-0000-0000-000000000110",
    name: "PropWash Aviation Care",
    slug: "propwash-aviation-care",
    description:
      "Eco-friendly waterless wash and detail for general aviation aircraft. Serving community airports across the Pacific Northwest with mobile detailing units.",
    trust_score: 58,
    tier: "basic",
    is_claimed: false,
    claimed_by: null,
    website: null,
    phone: null,
    email: null,
    logo_url: null,
    created_at: "2024-12-10T00:00:00Z",
    updated_at: "2024-12-10T00:00:00Z",
  },
];

/* ──────────────────────────────────────────────────────────────────────────
   Data Fetching
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
      per_page: 20,
      page: 1,
    });
    if (result.companies.length > 0) {
      return result.companies;
    }
    return SEED_COMPANIES;
  } catch {
    return SEED_COMPANIES;
  }
}

/* ──────────────────────────────────────────────────────────────────────────
   Page Component
   ────────────────────────────────────────────────────────────────────────── */

export default async function HomePage() {
  const companies = await getCompanies();

  return (
    <div className="flex min-h-screen flex-col font-body">
      <Header />
      <main className="flex-1">
        <HomeContent companies={companies} />
      </main>
      <Footer />
    </div>
  );
}
