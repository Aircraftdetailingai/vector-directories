import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { Company, SearchResult } from "@vector/types";
import { Header } from "../../components/header";
import { Footer } from "../../components/footer";
import {
  getStateBySlug,
  US_STATES,
  cityNameToSlug,
  citySlugToDisplay,
} from "@/lib/us-states";
import { getAirportsForCity } from "@/lib/city-airports";
import { CompanyListingCard } from "../components/company-listing-card";
import { CityBreadcrumb } from "./components/city-breadcrumb";
import { NearbyAirports } from "./components/nearby-airports";
import { CityListingShell } from "./components/city-listing-shell";

/* ──────────────────────────────────────────────────────────────────────────
   Seed data — used when Supabase is not configured (local dev)
   ────────────────────────────────────────────────────────────────────────── */

const SEED_COMPANIES: (Company & { city?: string; services?: string[] })[] = [
  {
    id: "00000000-0000-0000-0000-000000000201",
    name: "SkyShine Aviation Detailing",
    slug: "skyshine-aviation-detailing",
    description:
      "Premium aircraft detailing for private jets, turboprops, and helicopters.",
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
    services: ["Exterior Wash", "Ceramic Coating"],
  },
  {
    id: "00000000-0000-0000-0000-000000000202",
    name: "AeroBright Finishers",
    slug: "aerobright-finishers",
    description:
      "Specializing in ceramic coating and paint correction for all aircraft types.",
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
    services: ["Paint Correction", "Ceramic Coating"],
  },
  {
    id: "00000000-0000-0000-0000-000000000203",
    name: "JetGlow Services",
    slug: "jetglow-services",
    description:
      "Luxury interior and exterior detailing for corporate fleets.",
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
    services: ["Interior Detailing", "Exterior Wash"],
  },
];

/** Seed city/state pairs used when DB is unavailable */
const SEED_STATIC_PARAMS = [
  { state: "florida", city: "miami" },
  { state: "florida", city: "orlando" },
  { state: "florida", city: "tampa" },
  { state: "florida", city: "jacksonville" },
  { state: "california", city: "los-angeles" },
  { state: "california", city: "san-francisco" },
  { state: "california", city: "san-diego" },
  { state: "california", city: "san-jose" },
  { state: "california", city: "sacramento" },
  { state: "texas", city: "dallas" },
  { state: "texas", city: "houston" },
  { state: "texas", city: "austin" },
  { state: "texas", city: "san-antonio" },
  { state: "new-york", city: "new-york" },
  { state: "arizona", city: "phoenix" },
  { state: "arizona", city: "scottsdale" },
  { state: "arizona", city: "tucson" },
  { state: "illinois", city: "chicago" },
  { state: "georgia", city: "atlanta" },
  { state: "colorado", city: "denver" },
  { state: "nevada", city: "las-vegas" },
  { state: "washington", city: "seattle" },
  { state: "massachusetts", city: "boston" },
  { state: "pennsylvania", city: "philadelphia" },
  { state: "north-carolina", city: "charlotte" },
  { state: "ohio", city: "columbus" },
  { state: "michigan", city: "detroit" },
  { state: "tennessee", city: "nashville" },
  { state: "oregon", city: "portland" },
  { state: "missouri", city: "st-louis" },
  { state: "new-jersey", city: "teterboro" },
  { state: "connecticut", city: "hartford" },
];

/* ──────────────────────────────────────────────────────────────────────────
   Data fetching
   ────────────────────────────────────────────────────────────────────────── */

async function getCompaniesForCity(
  stateCode: string,
  cityName: string,
  options: { sortBy?: string; page?: number },
): Promise<SearchResult> {
  try {
    const { searchCompanies, createBrowserClient } = await import(
      "@vector/db"
    );
    const client = createBrowserClient();

    let sort_by: "trust_score" | "name" | "created_at" = "trust_score";
    let sort_order: "asc" | "desc" = "desc";

    if (options.sortBy === "name") {
      sort_by = "name";
      sort_order = "asc";
    } else if (options.sortBy === "newest") {
      sort_by = "created_at";
      sort_order = "desc";
    }

    return await searchCompanies(client, {
      state: stateCode,
      city: cityName,
      sort_by,
      sort_order,
      page: options.page ?? 1,
      per_page: 20,
    });
  } catch {
    return {
      companies: SEED_COMPANIES,
      total: SEED_COMPANIES.length,
      page: 1,
      per_page: 20,
      total_pages: 1,
    };
  }
}

/* ──────────────────────────────────────────────────────────────────────────
   Static params & metadata
   ────────────────────────────────────────────────────────────────────────── */

export async function generateStaticParams() {
  try {
    const { getCitiesForState, createBrowserClient } = await import(
      "@vector/db"
    );
    const client = createBrowserClient();

    const pairs: { state: string; city: string }[] = [];

    for (const s of US_STATES) {
      const cities = await getCitiesForState(client, s.code);
      for (const cityName of cities) {
        pairs.push({ state: s.slug, city: cityNameToSlug(cityName) });
      }
    }

    return pairs.length > 0 ? pairs : SEED_STATIC_PARAMS;
  } catch {
    return SEED_STATIC_PARAMS;
  }
}

interface CityPageProps {
  params: Promise<{ state: string; city: string }>;
  searchParams: Promise<{
    sort?: string;
    page?: string;
  }>;
}

export async function generateMetadata({
  params,
}: CityPageProps): Promise<Metadata> {
  const { state, city } = await params;
  const stateInfo = getStateBySlug(state);
  if (!stateInfo) return {};

  const cityName = citySlugToDisplay(city);

  return {
    title: `Aircraft Detailing in ${cityName}, ${stateInfo.code} | Find Local Aircraft Detailers`,
    description: `Find trusted aircraft detailing services in ${cityName}, ${stateInfo.code}. Browse verified companies, compare trust scores, and connect with local detailers.`,
    openGraph: {
      title: `Aircraft Detailing in ${cityName}, ${stateInfo.code} | Find Local Aircraft Detailers`,
      description: `Find trusted aircraft detailing services in ${cityName}, ${stateInfo.code}.`,
      type: "website",
    },
  };
}

/* ──────────────────────────────────────────────────────────────────────────
   Page component
   ────────────────────────────────────────────────────────────────────────── */

export default async function CityPage({
  params,
  searchParams,
}: CityPageProps) {
  const { state, city } = await params;
  const stateInfo = getStateBySlug(state);
  if (!stateInfo) notFound();

  const cityName = citySlugToDisplay(city);

  const resolvedSearchParams = await searchParams;
  const sort = resolvedSearchParams.sort ?? "trust_score";
  const page = Math.max(
    1,
    parseInt(resolvedSearchParams.page ?? "1", 10) || 1,
  );

  const result = await getCompaniesForCity(stateInfo.code, cityName, {
    sortBy: sort,
    page,
  });

  // If DB returns 0 results and this isn't a known seed city, 404
  if (result.total === 0 && result.companies.length === 0) {
    const isKnownSeed = SEED_STATIC_PARAMS.some(
      (p) => p.state === state && p.city === city,
    );
    if (!isKnownSeed) notFound();
  }

  const airports = getAirportsForCity(stateInfo.code, cityName);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <CityBreadcrumb
          stateName={stateInfo.name}
          stateSlug={stateInfo.slug}
          cityName={cityName}
        />

        {/* Page header */}
        <section className="bg-forest-800 py-10 sm:py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="font-heading text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Aircraft Detailing Services in {cityName}, {stateInfo.code}
            </h1>
            <p className="mt-3 text-lg text-forest-200">
              {result.total}{" "}
              {result.total === 1 ? "company" : "companies"} found
            </p>
          </div>
        </section>

        {/* Nearby airports */}
        <NearbyAirports airports={airports} cityName={cityName} />

        {/* Company listings */}
        <section className="py-10 sm:py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <CityListingShell
              currentSort={sort}
              currentPage={page}
              totalPages={result.total_pages}
              totalCompanies={result.total}
            >
              {result.companies.map((company) => (
                <CompanyListingCard key={company.id} company={company} />
              ))}
            </CityListingShell>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
