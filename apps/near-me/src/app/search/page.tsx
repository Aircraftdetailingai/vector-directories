import type { Metadata } from "next";
import type { Company } from "@vector/types";
import Header from "../components/header";
import Footer from "../components/footer";
import { US_STATES } from "@/lib/us-states";
import { SearchShell } from "./components/search-shell";

/* ──────────────────────────────────────────────────────────────────────────
   Seed data — used when Supabase is not configured
   ────────────────────────────────────────────────────────────────────────── */

const SEED_COMPANIES: Company[] = [
  {
    id: "00000000-0000-0000-0000-000000000001",
    name: "SkyShine Aviation Detailing",
    slug: "skyshine-aviation-detailing",
    description:
      "Premium aircraft detailing serving the greater Miami area since 2012. Specializing in private jets, turboprops, and helicopters.",
    website: "https://example.com",
    phone: "3055550100",
    email: "info@skyshine-aviation.example.com",
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
    name: "AeroGlow Detailing",
    slug: "aeroglow-detailing",
    description:
      "Full-service aircraft detailing with ceramic coating specialization serving South Florida airports.",
    website: null,
    phone: "3055550200",
    email: "contact@aeroglow.example.com",
    logo_url: null,
    trust_score: 87,
    is_claimed: true,
    claimed_by: null,
    tier: "enhanced",
    created_at: "2024-11-01T00:00:00Z",
    updated_at: "2024-11-01T00:00:00Z",
  },
  {
    id: "00000000-0000-0000-0000-000000000003",
    name: "JetClean Pro",
    slug: "jetclean-pro",
    description:
      "Quick turnaround aircraft washing and interior detailing services in the Dallas-Fort Worth area.",
    website: null,
    phone: "2145550100",
    email: "hello@jetcleanpro.example.com",
    logo_url: null,
    trust_score: 72,
    is_claimed: false,
    claimed_by: null,
    tier: "basic",
    created_at: "2024-12-01T00:00:00Z",
    updated_at: "2024-12-01T00:00:00Z",
  },
  {
    id: "00000000-0000-0000-0000-000000000004",
    name: "WingWash Aviation Services",
    slug: "wingwash-aviation-services",
    description:
      "Comprehensive aircraft exterior and interior detailing. Paint correction and ceramic coating experts in Phoenix.",
    website: "https://example.com",
    phone: "4805550100",
    email: "info@wingwash.example.com",
    logo_url: null,
    trust_score: 81,
    is_claimed: true,
    claimed_by: null,
    tier: "enhanced",
    created_at: "2025-01-10T00:00:00Z",
    updated_at: "2025-01-10T00:00:00Z",
  },
  {
    id: "00000000-0000-0000-0000-000000000005",
    name: "Pacific Aero Shine",
    slug: "pacific-aero-shine",
    description:
      "West coast aircraft detailing and brightwork polishing serving Los Angeles area airports.",
    website: null,
    phone: "3105550100",
    email: "team@pacificaeroshine.example.com",
    logo_url: null,
    trust_score: 68,
    is_claimed: false,
    claimed_by: null,
    tier: "basic",
    created_at: "2025-02-01T00:00:00Z",
    updated_at: "2025-02-01T00:00:00Z",
  },
];

/* ──────────────────────────────────────────────────────────────────────────
   Data fetching
   ────────────────────────────────────────────────────────────────────────── */

interface SearchPageParams {
  q?: string;
  state?: string;
  city?: string;
  service?: string;
  sort?: string;
  page?: string;
}

async function fetchSearchResults(searchParams: SearchPageParams) {
  const {
    q,
    state,
    city,
    sort = "relevance",
    page = "1",
  } = searchParams;

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const sortBy = (["relevance", "trust_score", "name", "created_at"].includes(sort)
    ? sort
    : "relevance") as "relevance" | "trust_score" | "name" | "created_at";
  const sortOrder = sortBy === "name" ? "asc" as const : "desc" as const;

  try {
    const { searchCompanies, createBrowserClient } = await import("@vector/db");
    const client = createBrowserClient();

    const result = await searchCompanies(client, {
      query: q || undefined,
      state: state || undefined,
      city: city || undefined,
      page: pageNum,
      per_page: 12,
      sort_by: sortBy,
      sort_order: sortOrder,
    });

    return {
      companies: result.companies,
      total: result.total,
      page: result.page,
      totalPages: result.total_pages,
    };
  } catch {
    // Seed data fallback with basic filtering
    let filtered = [...SEED_COMPANIES];

    if (q) {
      const lower = q.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.name.toLowerCase().includes(lower) ||
          (c.description?.toLowerCase().includes(lower) ?? false),
      );
    }

    if (sortBy === "trust_score") {
      filtered.sort((a, b) => (b.trust_score ?? 0) - (a.trust_score ?? 0));
    } else if (sortBy === "name") {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "created_at") {
      filtered.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      );
    }

    return {
      companies: filtered,
      total: filtered.length,
      page: 1,
      totalPages: 1,
    };
  }
}

/* ──────────────────────────────────────────────────────────────────────────
   Metadata
   ────────────────────────────────────────────────────────────────────────── */

export const metadata: Metadata = {
  title: "Search Detailers | Aircraft Detailing Near Me",
  description:
    "Search for aircraft detailing services across the United States. Filter by state, city, and service type.",
};

/* ──────────────────────────────────────────────────────────────────────────
   Page component
   ────────────────────────────────────────────────────────────────────────── */

interface SearchPageProps {
  searchParams: Promise<SearchPageParams>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const sp = await searchParams;
  const { companies, total, page, totalPages } = await fetchSearchResults(sp);

  const states = US_STATES.map((s) => ({ code: s.code, name: s.name }));

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-sky-600 text-white">
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
            <h1 className="font-heading text-3xl font-bold sm:text-4xl">
              Search Detailers
            </h1>
            <p className="mt-2 text-lg text-sky-100">
              Find the right aircraft detailing professional for your needs.
            </p>
          </div>
        </section>

        {/* Search shell */}
        <section className="bg-gray-50 py-8 sm:py-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SearchShell
              companies={companies}
              states={states}
              total={total}
              page={page}
              totalPages={totalPages}
              initialQuery={sp.q ?? ""}
              initialState={sp.state ?? ""}
              initialCity={sp.city ?? ""}
              initialService={sp.service ?? ""}
              initialSort={sp.sort ?? "relevance"}
            />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
