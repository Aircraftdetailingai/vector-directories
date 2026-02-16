import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { Company, SearchResult } from "@vector/types";
import { Header } from "../../components/header";
import { Footer } from "../../components/footer";
import { getStateByCode } from "@/lib/us-states";
import {
  getAirportByCode,
  getAllAirports,
  getCitiesForAirport,
  toICAO,
} from "@/lib/city-airports";
import { CompanyListingCard } from "../../[state]/components/company-listing-card";
import { AirportBreadcrumb } from "./components/airport-breadcrumb";
import { AirportListingShell } from "./components/airport-listing-shell";

/* ──────────────────────────────────────────────────────────────────────────
   Seed data — used when Supabase is not configured (local dev)
   ────────────────────────────────────────────────────────────────────────── */

const SEED_COMPANIES: (Company & { city?: string; services?: string[] })[] = [
  {
    id: "00000000-0000-0000-0000-000000000301",
    name: "SkyShine Aviation Detailing",
    slug: "skyshine-aviation-detailing",
    description:
      "Premium aircraft detailing for private jets, turboprops, and helicopters.",
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
    services: ["Exterior Wash", "Ceramic Coating"],
  },
  {
    id: "00000000-0000-0000-0000-000000000302",
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
    city: "Miami",
    services: ["Paint Correction", "Ceramic Coating"],
  },
  {
    id: "00000000-0000-0000-0000-000000000303",
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
    city: "Miami",
    services: ["Interior Detailing", "Exterior Wash"],
  },
];

/* ──────────────────────────────────────────────────────────────────────────
   Data fetching
   ────────────────────────────────────────────────────────────────────────── */

async function getCompaniesForAirport(
  airportCode: string,
  options: { sortBy?: string; page?: number },
): Promise<SearchResult> {
  const cities = getCitiesForAirport(airportCode);
  if (cities.length === 0) {
    return { companies: [], total: 0, page: 1, per_page: 20, total_pages: 0 };
  }

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

    // Query all cities this airport serves and merge results
    const allCompanies: (Company & { city?: string; services?: string[] })[] =
      [];
    const seenIds = new Set<string>();

    for (const { state, city } of cities) {
      const result = await searchCompanies(client, {
        state,
        city,
        sort_by,
        sort_order,
        page: 1,
        per_page: 100,
      });
      for (const company of result.companies) {
        if (!seenIds.has(company.id)) {
          seenIds.add(company.id);
          allCompanies.push({ ...company, city });
        }
      }
    }

    // Sort the merged results
    allCompanies.sort((a, b) => {
      if (sort_by === "name") {
        return sort_order === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      }
      if (sort_by === "created_at") {
        return sort_order === "desc"
          ? b.created_at.localeCompare(a.created_at)
          : a.created_at.localeCompare(b.created_at);
      }
      // trust_score (desc by default)
      const scoreA = a.trust_score ?? 0;
      const scoreB = b.trust_score ?? 0;
      return sort_order === "desc" ? scoreB - scoreA : scoreA - scoreB;
    });

    // Paginate
    const perPage = 20;
    const page = options.page ?? 1;
    const start = (page - 1) * perPage;
    const paged = allCompanies.slice(start, start + perPage);

    return {
      companies: paged,
      total: allCompanies.length,
      page,
      per_page: perPage,
      total_pages: Math.ceil(allCompanies.length / perPage),
    };
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

export function generateStaticParams() {
  return getAllAirports().map((airport) => ({
    code: airport.code.toLowerCase(),
  }));
}

interface AirportPageProps {
  params: Promise<{ code: string }>;
  searchParams: Promise<{
    sort?: string;
    page?: string;
  }>;
}

export async function generateMetadata({
  params,
}: AirportPageProps): Promise<Metadata> {
  const { code } = await params;
  const airport = getAirportByCode(code);
  if (!airport) return {};

  const icao = toICAO(airport.code);
  const title = `Aircraft Detailing at ${airport.name} (${icao}) | Aircraft Detailing Directory`;
  const description = `Find trusted aircraft detailing services near ${airport.name} (${icao}). Browse verified companies, compare trust scores, and request quotes.`;

  return {
    title,
    description,
    openGraph: { title, description, type: "website" },
  };
}

/* ──────────────────────────────────────────────────────────────────────────
   Page component
   ────────────────────────────────────────────────────────────────────────── */

export default async function AirportPage({
  params,
  searchParams,
}: AirportPageProps) {
  const { code } = await params;
  const airport = getAirportByCode(code);
  if (!airport) notFound();

  const resolvedSearchParams = await searchParams;
  const sort = resolvedSearchParams.sort ?? "trust_score";
  const page = Math.max(
    1,
    parseInt(resolvedSearchParams.page ?? "1", 10) || 1,
  );

  const result = await getCompaniesForAirport(airport.code, {
    sortBy: sort,
    page,
  });

  const icao = toICAO(airport.code);

  // Build the list of cities/states served
  const citiesServed = airport.cities.map((c) => {
    const stateInfo = getStateByCode(c.state);
    return {
      city: c.city,
      stateCode: c.state,
      stateName: stateInfo?.name ?? c.state,
    };
  });

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <AirportBreadcrumb airportName={airport.name} />

        {/* Page header */}
        <section className="bg-forest-800 py-10 sm:py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="font-heading text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
                Aircraft Detailing at {airport.name}
              </h1>
              <span className="rounded-lg bg-white/15 px-3 py-1 font-heading text-sm font-bold text-white">
                {icao}
              </span>
            </div>
            <p className="mt-3 text-lg text-forest-200">
              {result.total}{" "}
              {result.total === 1 ? "company" : "companies"} serving this
              airport
            </p>
          </div>
        </section>

        {/* Cities served */}
        {citiesServed.length > 0 && (
          <section className="border-b border-gray-100 bg-white">
            <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium text-gray-500">
                  Serving:
                </span>
                {citiesServed.map((c) => (
                  <span
                    key={`${c.stateCode}:${c.city}`}
                    className="inline-flex items-center rounded-full bg-sage/40 px-3 py-1 text-sm font-medium text-forest-800"
                  >
                    {c.city}, {c.stateCode}
                  </span>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Company listings */}
        <section className="py-10 sm:py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <AirportListingShell
              currentSort={sort}
              currentPage={page}
              totalPages={result.total_pages}
              totalCompanies={result.total}
            >
              {result.companies.map((company) => (
                <CompanyListingCard key={company.id} company={company} />
              ))}
            </AirportListingShell>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
