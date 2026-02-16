import type { Metadata } from "next";
import Link from "next/link";
import type { Company, SearchResult } from "@vector/types";
import {
  getTrustScoreColor,
  formatTrustScore,
} from "@vector/utils";
import { Header } from "../components/header";
import { Footer } from "../components/footer";

/* ──────────────────────────────────────────────────────────────────────────
   Seed data — used when Supabase is not configured (local dev)
   ────────────────────────────────────────────────────────────────────────── */

const SEED_COMPANIES: (Company & { city?: string; state_code?: string })[] = [
  {
    id: "00000000-0000-0000-0000-000000000a01",
    name: "AeroBright Finishers",
    slug: "aerobright-finishers",
    description: "Ceramic coating and paint correction for all aircraft types.",
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
    city: "Miami",
    state_code: "FL",
  },
  {
    id: "00000000-0000-0000-0000-000000000a02",
    name: "AeroShine Solutions",
    slug: "aeroshine-solutions",
    description: "Mobile aircraft detailing serving the greater Dallas area.",
    website: "https://example.com",
    phone: "2145550110",
    email: "info@example.com",
    logo_url: null,
    trust_score: 79,
    is_claimed: true,
    claimed_by: null,
    tier: "enhanced",
    created_at: "2025-01-10T00:00:00Z",
    updated_at: "2025-01-10T00:00:00Z",
    city: "Dallas",
    state_code: "TX",
  },
  {
    id: "00000000-0000-0000-0000-000000000a03",
    name: "ClearCoat Aero",
    slug: "clearcoat-aero",
    description: "Full-service aircraft detailing, interior restoration, and brightwork.",
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
    city: "Tampa",
    state_code: "FL",
  },
  {
    id: "00000000-0000-0000-0000-000000000a04",
    name: "Diamond Aviation Detail",
    slug: "diamond-aviation-detail",
    description: "Premium diamond-standard detailing for luxury jets.",
    website: "https://example.com",
    phone: "7025550103",
    email: "info@example.com",
    logo_url: null,
    trust_score: 91,
    is_claimed: true,
    claimed_by: null,
    tier: "featured",
    created_at: "2024-09-15T00:00:00Z",
    updated_at: "2024-09-15T00:00:00Z",
    city: "Las Vegas",
    state_code: "NV",
  },
  {
    id: "00000000-0000-0000-0000-000000000a05",
    name: "Eagle Detail Co",
    slug: "eagle-detail-co",
    description: "Veteran-owned aircraft detailing, serving the Pacific Northwest.",
    website: null,
    phone: "2065550104",
    email: null,
    logo_url: null,
    trust_score: 76,
    is_claimed: true,
    claimed_by: null,
    tier: "premium",
    created_at: "2024-10-20T00:00:00Z",
    updated_at: "2024-10-20T00:00:00Z",
    city: "Seattle",
    state_code: "WA",
  },
  {
    id: "00000000-0000-0000-0000-000000000a06",
    name: "FlightClean Pro",
    slug: "flightclean-pro",
    description: "Quick turnaround exterior wash and interior detailing.",
    website: "https://example.com",
    phone: "4045550105",
    email: "info@example.com",
    logo_url: null,
    trust_score: 83,
    is_claimed: true,
    claimed_by: null,
    tier: "premium",
    created_at: "2024-11-10T00:00:00Z",
    updated_at: "2024-11-10T00:00:00Z",
    city: "Atlanta",
    state_code: "GA",
  },
  {
    id: "00000000-0000-0000-0000-000000000a07",
    name: "GlossAir Services",
    slug: "glossair-services",
    description: "High-gloss finish specialists for corporate aviation.",
    website: null,
    phone: null,
    email: null,
    logo_url: null,
    trust_score: 70,
    is_claimed: false,
    claimed_by: null,
    tier: "basic",
    created_at: "2025-01-05T00:00:00Z",
    updated_at: "2025-01-05T00:00:00Z",
    city: "Denver",
    state_code: "CO",
  },
  {
    id: "00000000-0000-0000-0000-000000000a08",
    name: "HangarBright LLC",
    slug: "hangarbright-llc",
    description: "On-site hangar detailing for FBOs and private owners.",
    website: "https://example.com",
    phone: "6025550106",
    email: "info@example.com",
    logo_url: null,
    trust_score: 85,
    is_claimed: true,
    claimed_by: null,
    tier: "premium",
    created_at: "2024-10-01T00:00:00Z",
    updated_at: "2024-10-01T00:00:00Z",
    city: "Phoenix",
    state_code: "AZ",
  },
  {
    id: "00000000-0000-0000-0000-000000000a09",
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
    city: "Miami",
    state_code: "FL",
  },
  {
    id: "00000000-0000-0000-0000-000000000a10",
    name: "JetWash Aviation",
    slug: "jetwash-aviation",
    description: "Eco-friendly aircraft washing with water reclamation systems.",
    website: "https://example.com",
    phone: "3105550107",
    email: "info@example.com",
    logo_url: null,
    trust_score: 87,
    is_claimed: true,
    claimed_by: null,
    tier: "premium",
    created_at: "2024-08-15T00:00:00Z",
    updated_at: "2024-08-15T00:00:00Z",
    city: "Los Angeles",
    state_code: "CA",
  },
  {
    id: "00000000-0000-0000-0000-000000000a11",
    name: "LuxAero Detailing",
    slug: "luxaero-detailing",
    description: "White-glove detailing service for ultra-long-range jets.",
    website: "https://example.com",
    phone: "2015550108",
    email: "info@example.com",
    logo_url: null,
    trust_score: 95,
    is_claimed: true,
    claimed_by: null,
    tier: "featured",
    created_at: "2024-07-01T00:00:00Z",
    updated_at: "2024-07-01T00:00:00Z",
    city: "Teterboro",
    state_code: "NJ",
  },
  {
    id: "00000000-0000-0000-0000-000000000a12",
    name: "MetalShine Aircraft",
    slug: "metalshine-aircraft",
    description: "Brightwork polishing and metal restoration experts.",
    website: null,
    phone: "6145550109",
    email: null,
    logo_url: null,
    trust_score: 74,
    is_claimed: false,
    claimed_by: null,
    tier: "enhanced",
    created_at: "2024-12-20T00:00:00Z",
    updated_at: "2024-12-20T00:00:00Z",
    city: "Columbus",
    state_code: "OH",
  },
  {
    id: "00000000-0000-0000-0000-000000000a13",
    name: "NorthStar Aviation Detail",
    slug: "northstar-aviation-detail",
    description: "Cold-weather aircraft care and de-icing detail services.",
    website: "https://example.com",
    phone: "6175550110",
    email: "info@example.com",
    logo_url: null,
    trust_score: 82,
    is_claimed: true,
    claimed_by: null,
    tier: "premium",
    created_at: "2024-11-25T00:00:00Z",
    updated_at: "2024-11-25T00:00:00Z",
    city: "Boston",
    state_code: "MA",
  },
  {
    id: "00000000-0000-0000-0000-000000000a14",
    name: "PolishPro Aero",
    slug: "polishpro-aero",
    description: "Multi-stage paint correction and ceramic coating specialists.",
    website: "https://example.com",
    phone: "7135550111",
    email: "info@example.com",
    logo_url: null,
    trust_score: 89,
    is_claimed: true,
    claimed_by: null,
    tier: "premium",
    created_at: "2024-09-01T00:00:00Z",
    updated_at: "2024-09-01T00:00:00Z",
    city: "Houston",
    state_code: "TX",
  },
  {
    id: "00000000-0000-0000-0000-000000000a15",
    name: "PremierAir Finish",
    slug: "premierair-finish",
    description: "First-class detailing for charter and private aviation.",
    website: null,
    phone: "7045550112",
    email: null,
    logo_url: null,
    trust_score: 77,
    is_claimed: true,
    claimed_by: null,
    tier: "enhanced",
    created_at: "2025-01-02T00:00:00Z",
    updated_at: "2025-01-02T00:00:00Z",
    city: "Charlotte",
    state_code: "NC",
  },
  {
    id: "00000000-0000-0000-0000-000000000a16",
    name: "RunwayClean Co",
    slug: "runwayclean-co",
    description: "Efficient same-day exterior washing at major FBOs.",
    website: "https://example.com",
    phone: "5035550113",
    email: "info@example.com",
    logo_url: null,
    trust_score: 80,
    is_claimed: true,
    claimed_by: null,
    tier: "premium",
    created_at: "2024-10-10T00:00:00Z",
    updated_at: "2024-10-10T00:00:00Z",
    city: "Portland",
    state_code: "OR",
  },
  {
    id: "00000000-0000-0000-0000-000000000a17",
    name: "SkyShine Aviation Detailing",
    slug: "skyshine-aviation-detailing",
    description: "Premium aircraft detailing for private jets, turboprops, and helicopters.",
    website: "https://example.com",
    phone: "3055550100",
    email: "info@example.com",
    logo_url: null,
    trust_score: 94,
    is_claimed: true,
    claimed_by: null,
    tier: "premium",
    created_at: "2024-10-15T00:00:00Z",
    updated_at: "2024-10-15T00:00:00Z",
    city: "Miami",
    state_code: "FL",
  },
  {
    id: "00000000-0000-0000-0000-000000000a18",
    name: "SunCoast Aero Detail",
    slug: "suncoast-aero-detail",
    description: "Florida Gulf Coast aircraft detailing with UV protection focus.",
    website: "https://example.com",
    phone: "9415550114",
    email: "info@example.com",
    logo_url: null,
    trust_score: 86,
    is_claimed: true,
    claimed_by: null,
    tier: "premium",
    created_at: "2024-11-15T00:00:00Z",
    updated_at: "2024-11-15T00:00:00Z",
    city: "Naples",
    state_code: "FL",
  },
  {
    id: "00000000-0000-0000-0000-000000000a19",
    name: "TailWind Detailing",
    slug: "tailwind-detailing",
    description: "Comprehensive aircraft care from nose to tail.",
    website: null,
    phone: "6155550115",
    email: null,
    logo_url: null,
    trust_score: 73,
    is_claimed: false,
    claimed_by: null,
    tier: "basic",
    created_at: "2025-01-20T00:00:00Z",
    updated_at: "2025-01-20T00:00:00Z",
    city: "Nashville",
    state_code: "TN",
  },
  {
    id: "00000000-0000-0000-0000-000000000a20",
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
    city: "Jacksonville",
    state_code: "FL",
  },
];

/* ──────────────────────────────────────────────────────────────────────────
   Score + tier styling (matches company-listing-card.tsx)
   ────────────────────────────────────────────────────────────────────────── */

const SCORE_BG: Record<string, string> = {
  emerald: "bg-emerald-100 text-emerald-800",
  green: "bg-green-100 text-green-800",
  lime: "bg-lime-100 text-lime-800",
  yellow: "bg-yellow-100 text-yellow-800",
  orange: "bg-orange-100 text-orange-800",
  red: "bg-red-100 text-red-800",
  gray: "bg-gray-100 text-gray-600",
};

const TIER_STYLE: Record<string, string> = {
  featured: "bg-purple-100 text-purple-800",
  premium: "bg-forest-100 text-forest-800",
  enhanced: "bg-blue-100 text-blue-800",
  basic: "bg-gray-100 text-gray-600",
};

/* ──────────────────────────────────────────────────────────────────────────
   Data fetching
   ────────────────────────────────────────────────────────────────────────── */

type AZCompany = Company & { city?: string; state_code?: string };

async function getAllCompanies(): Promise<AZCompany[]> {
  try {
    const { searchCompanies, createBrowserClient } = await import(
      "@vector/db"
    );
    const client = createBrowserClient();

    const allCompanies: AZCompany[] = [];
    let page = 1;
    let totalPages = 1;

    do {
      const result: SearchResult = await searchCompanies(client, {
        sort_by: "name",
        sort_order: "asc",
        page,
        per_page: 100,
      });
      allCompanies.push(...result.companies);
      totalPages = result.total_pages;
      page++;
    } while (page <= totalPages);

    return allCompanies;
  } catch {
    return SEED_COMPANIES;
  }
}

/* ──────────────────────────────────────────────────────────────────────────
   Metadata
   ────────────────────────────────────────────────────────────────────────── */

export const metadata: Metadata = {
  title: "A-Z Company Index | Aircraft Detailing Directory",
  description:
    "Browse all aircraft detailing companies alphabetically. Find trusted detailers from A to Z.",
  openGraph: {
    title: "A-Z Company Index | Aircraft Detailing Directory",
    description:
      "Browse all aircraft detailing companies alphabetically. Find trusted detailers from A to Z.",
    type: "website",
  },
};

/* ──────────────────────────────────────────────────────────────────────────
   Page component
   ────────────────────────────────────────────────────────────────────────── */

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export default async function AZIndexPage() {
  const companies = await getAllCompanies();

  // Group by first letter
  const grouped = new Map<string, AZCompany[]>();
  for (const company of companies) {
    const letter = company.name.charAt(0).toUpperCase();
    if (!grouped.has(letter)) {
      grouped.set(letter, []);
    }
    grouped.get(letter)!.push(company);
  }

  const lettersWithCompanies = new Set(grouped.keys());

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="border-b border-gray-100 bg-white"
        >
          <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
            <ol className="flex items-center gap-2 text-sm">
              <li>
                <a
                  href="/"
                  className="text-gray-500 transition-colors hover:text-forest-700"
                >
                  Home
                </a>
              </li>
              <li aria-hidden="true" className="text-gray-300">
                /
              </li>
              <li>
                <span
                  className="font-medium text-forest-800"
                  aria-current="page"
                >
                  A-Z Index
                </span>
              </li>
            </ol>
          </div>
        </nav>

        {/* Hero */}
        <section className="bg-forest-800 py-10 sm:py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="font-heading text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Company A-Z Index
            </h1>
            <p className="mt-3 text-lg text-forest-200">
              {companies.length}{" "}
              {companies.length === 1 ? "company" : "companies"} listed
            </p>
          </div>
        </section>

        {/* Letter navigation */}
        <div className="sticky top-16 z-40 border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <nav
              aria-label="Alphabetical navigation"
              className="flex flex-wrap gap-1 py-3"
            >
              {LETTERS.map((letter) => {
                const hasCompanies = lettersWithCompanies.has(letter);
                return hasCompanies ? (
                  <a
                    key={letter}
                    href={`#letter-${letter}`}
                    className="flex h-9 w-9 items-center justify-center rounded-lg font-heading text-sm font-bold text-forest-800 transition-colors hover:bg-forest-100"
                  >
                    {letter}
                  </a>
                ) : (
                  <span
                    key={letter}
                    className="flex h-9 w-9 items-center justify-center rounded-lg font-heading text-sm font-bold text-gray-300"
                    aria-hidden="true"
                  >
                    {letter}
                  </span>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Company sections by letter */}
        <section className="py-10 sm:py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="space-y-10">
              {LETTERS.filter((l) => lettersWithCompanies.has(l)).map(
                (letter) => (
                  <div key={letter} id={`letter-${letter}`} className="scroll-mt-32">
                    <h2 className="font-heading text-2xl font-bold text-forest-800 border-b border-gray-200 pb-2">
                      {letter}
                    </h2>

                    {/* Table header — desktop only */}
                    <div className="mt-4 hidden text-xs font-semibold uppercase tracking-wider text-gray-400 sm:grid sm:grid-cols-[1fr_180px_100px_90px] sm:gap-4 sm:px-4">
                      <span>Company</span>
                      <span>Location</span>
                      <span>Trust Score</span>
                      <span>Tier</span>
                    </div>

                    {/* Rows */}
                    <div className="mt-2 divide-y divide-gray-100">
                      {grouped.get(letter)!.map((company) => {
                        const scoreColor = getTrustScoreColor(
                          company.trust_score,
                        );
                        const scoreClass =
                          SCORE_BG[scoreColor] ?? SCORE_BG.gray;
                        const tierClass =
                          TIER_STYLE[company.tier] ?? TIER_STYLE.basic;

                        return (
                          <div
                            key={company.id}
                            className="group flex flex-col gap-2 rounded-lg px-4 py-3 transition-colors hover:bg-gray-50 sm:grid sm:grid-cols-[1fr_180px_100px_90px] sm:items-center sm:gap-4"
                          >
                            {/* Company name */}
                            <div>
                              <Link
                                href={`/company/${company.slug}`}
                                className="font-heading text-sm font-semibold text-gray-900 transition-colors group-hover:text-forest-700"
                              >
                                {company.name}
                              </Link>
                              {company.description && (
                                <p className="mt-0.5 line-clamp-1 text-xs text-gray-400 sm:hidden">
                                  {company.description}
                                </p>
                              )}
                            </div>

                            {/* Location */}
                            <span className="text-sm text-gray-500">
                              {[company.city, company.state_code]
                                .filter(Boolean)
                                .join(", ") || "—"}
                            </span>

                            {/* Trust score */}
                            <span
                              className={`inline-flex w-fit items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${scoreClass}`}
                            >
                              {formatTrustScore(company.trust_score)}
                            </span>

                            {/* Tier */}
                            <span
                              className={`inline-flex w-fit rounded-md px-2 py-0.5 text-xs font-medium capitalize ${tierClass}`}
                            >
                              {company.tier}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ),
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
