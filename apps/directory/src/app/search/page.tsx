import type { Metadata } from "next";
import type { Company, SearchResult } from "@vector/types";
import { Header } from "../components/header";
import { Footer } from "../components/footer";
import { US_STATES } from "@/lib/us-states";
import { CompanyListingCard } from "../[state]/components/company-listing-card";
import { SearchShell } from "./components/search-shell";

/* ──────────────────────────────────────────────────────────────────────────
   Seed data — used when Supabase is not configured (local dev)
   ────────────────────────────────────────────────────────────────────────── */

const SEED_COMPANIES: (Company & { city?: string; services?: string[] })[] = [
  {
    id: "00000000-0000-0000-0000-000000000501",
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
    id: "00000000-0000-0000-0000-000000000502",
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
    city: "Orlando",
    services: ["Paint Correction", "Ceramic Coating"],
  },
  {
    id: "00000000-0000-0000-0000-000000000503",
    name: "ClearCoat Aero",
    slug: "clearcoat-aero",
    description:
      "Full-service aircraft detailing, interior restoration, and brightwork polishing.",
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
    services: ["Interior Detailing", "Brightwork"],
  },
  {
    id: "00000000-0000-0000-0000-000000000504",
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
    services: ["Exterior Wash"],
  },
  {
    id: "00000000-0000-0000-0000-000000000505",
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

interface SearchOptions {
  query?: string;
  state?: string;
  city?: string;
  category?: string;
  tier?: string;
  verified?: boolean;
  sortBy?: string;
  page?: number;
}

async function searchForCompanies(
  options: SearchOptions,
): Promise<SearchResult> {
  try {
    const { searchCompanies, createBrowserClient } = await import(
      "@vector/db"
    );
    const client = createBrowserClient();

    let sort_by: "relevance" | "trust_score" | "name" | "created_at" =
      "relevance";
    let sort_order: "asc" | "desc" = "desc";

    if (options.sortBy === "trust_score") {
      sort_by = "trust_score";
      sort_order = "desc";
    } else if (options.sortBy === "name") {
      sort_by = "name";
      sort_order = "asc";
    } else if (options.sortBy === "newest") {
      sort_by = "created_at";
      sort_order = "desc";
    }

    return await searchCompanies(client, {
      query: options.query || undefined,
      state: options.state || undefined,
      city: options.city || undefined,
      category: options.category || undefined,
      tier: (options.tier as "basic" | "enhanced" | "premium" | "featured" | "bundle_all") ||
        undefined,
      is_claimed: options.verified ? true : undefined,
      sort_by,
      sort_order,
      page: options.page ?? 1,
      per_page: 20,
    });
  } catch {
    // Client-side filtering of seed data
    let filtered = [...SEED_COMPANIES];

    if (options.query) {
      const q = options.query.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.description?.toLowerCase().includes(q),
      );
    }
    if (options.state) {
      // Seed companies don't have state on Company type, skip
    }
    if (options.city) {
      const city = options.city.toLowerCase();
      filtered = filtered.filter((c) =>
        c.city?.toLowerCase().includes(city),
      );
    }
    if (options.category) {
      filtered = filtered.filter((c) =>
        c.services?.includes(options.category!),
      );
    }
    if (options.tier) {
      filtered = filtered.filter((c) => c.tier === options.tier);
    }
    if (options.verified) {
      filtered = filtered.filter((c) => c.is_claimed);
    }

    return {
      companies: filtered,
      total: filtered.length,
      page: 1,
      per_page: 20,
      total_pages: 1,
    };
  }
}

/* ──────────────────────────────────────────────────────────────────────────
   Metadata
   ────────────────────────────────────────────────────────────────────────── */

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
    state?: string;
    city?: string;
    service?: string;
    tier?: string;
    verified?: string;
    sort?: string;
    page?: string;
  }>;
}

export async function generateMetadata({
  searchParams,
}: SearchPageProps): Promise<Metadata> {
  const resolved = await searchParams;
  const query = resolved.q?.trim();

  const title = query
    ? `"${query}" - Search | Aircraft Detailing Directory`
    : "Search Aircraft Detailing Companies | Aircraft Detailing Directory";

  return {
    title,
    description:
      "Search for aircraft detailing companies by name, location, services, and more. Compare trust scores and find verified detailers.",
    openGraph: { title, type: "website" },
  };
}

/* ──────────────────────────────────────────────────────────────────────────
   Page component
   ────────────────────────────────────────────────────────────────────────── */

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const resolved = await searchParams;

  const query = resolved.q?.trim() ?? "";
  const state = resolved.state ?? "";
  const city = resolved.city ?? "";
  const service = resolved.service ?? "";
  const tier = resolved.tier ?? "";
  const verified = resolved.verified === "1";
  const sort = resolved.sort ?? "relevance";
  const page = Math.max(1, parseInt(resolved.page ?? "1", 10) || 1);

  const result = await searchForCompanies({
    query: query || undefined,
    state: state || undefined,
    city: city || undefined,
    category: service || undefined,
    tier: tier || undefined,
    verified: verified || undefined,
    sortBy: sort,
    page,
  });

  const stateList = US_STATES.map((s) => ({ code: s.code, name: s.name }));

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
                  Search
                </span>
              </li>
            </ol>
          </div>
        </nav>

        {/* Hero */}
        <section className="bg-forest-800 py-10 sm:py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="font-heading text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Search Aircraft Detailing Companies
            </h1>
            <p className="mt-3 text-lg text-forest-200">
              Find the perfect detailer by name, location, or service
            </p>
          </div>
        </section>

        {/* Content area */}
        <section className="py-10 sm:py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SearchShell
              states={stateList}
              currentQuery={query}
              currentState={state}
              currentCity={city}
              currentService={service}
              currentTier={tier}
              currentVerified={verified}
              currentSort={sort}
              currentPage={page}
              totalPages={result.total_pages}
              totalCompanies={result.total}
            >
              {result.companies.map((company) => (
                <CompanyListingCard key={company.id} company={company} />
              ))}
            </SearchShell>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
