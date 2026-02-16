import type { Metadata } from "next";
import Header from "../components/header";
import Footer from "../components/footer";
import SearchShell from "./components/search-shell";

/* ── Types ─────────────────────────────────────────────────────────────── */

interface Company {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  trust_score: number | null;
  tier: string;
  is_claimed: boolean;
  website: string | null;
  phone: string | null;
  email: string | null;
  logo_url: string | null;
  claimed_by: string | null;
  created_at: string;
  updated_at: string;
}

/* ── Seed Data ─────────────────────────────────────────────────────────── */

const SEED_COMPANIES: Company[] = [
  {
    id: "seed-s-1",
    name: "SkyShine Aviation Detailing",
    slug: "skyshine-aviation-detailing",
    description:
      "Premier aircraft care provider specializing in comprehensive detailing services for private, corporate, and charter aircraft.",
    trust_score: 94,
    tier: "premium",
    is_claimed: true,
    website: null,
    phone: null,
    email: null,
    logo_url: null,
    claimed_by: null,
    created_at: "2024-01-15T00:00:00Z",
    updated_at: "2024-12-01T00:00:00Z",
  },
  {
    id: "seed-s-2",
    name: "Aspen AeroLux Detailing",
    slug: "aspen-aerolux-detailing",
    description:
      "Ultra-premium detailing for elite clientele at Aspen-Pitkin Airport.",
    trust_score: 97,
    tier: "featured",
    is_claimed: true,
    website: null,
    phone: null,
    email: null,
    logo_url: null,
    claimed_by: null,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-12-01T00:00:00Z",
  },
  {
    id: "seed-s-3",
    name: "Van Nuys Prestige Detail",
    slug: "van-nuys-prestige-detail",
    description:
      "Hollywood's go-to aircraft detailing at Van Nuys Airport.",
    trust_score: 95,
    tier: "featured",
    is_claimed: true,
    website: null,
    phone: null,
    email: null,
    logo_url: null,
    claimed_by: null,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-12-01T00:00:00Z",
  },
  {
    id: "seed-s-4",
    name: "Lone Star Aviation Detail",
    slug: "lone-star-aviation-detail",
    description:
      "Dallas-Fort Worth's top-rated aircraft detailing provider.",
    trust_score: 93,
    tier: "premium",
    is_claimed: true,
    website: null,
    phone: null,
    email: null,
    logo_url: null,
    claimed_by: null,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-12-01T00:00:00Z",
  },
  {
    id: "seed-s-5",
    name: "Midway Aviation Detail",
    slug: "midway-aviation-detail",
    description:
      "Chicago's premier aircraft detailing service for corporate and private fleets.",
    trust_score: 92,
    tier: "premium",
    is_claimed: true,
    website: null,
    phone: null,
    email: null,
    logo_url: null,
    claimed_by: null,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-12-01T00:00:00Z",
  },
];

/* ── Sort Mapping ──────────────────────────────────────────────────────── */

function mapSortToDb(sort: string): {
  sort_by: "trust_score" | "name" | "created_at" | "relevance";
  sort_order: "asc" | "desc";
} {
  switch (sort) {
    case "name":
      return { sort_by: "name", sort_order: "asc" };
    case "newest":
      return { sort_by: "created_at", sort_order: "desc" };
    case "authority_score":
    default:
      return { sort_by: "trust_score", sort_order: "desc" };
  }
}

/* ── Data Fetching ─────────────────────────────────────────────────────── */

async function fetchSearchResults(searchParams: {
  q?: string;
  region?: string;
  state?: string;
  sort?: string;
  page?: string;
}) {
  const query = searchParams.q ?? "";
  const state = searchParams.state ?? "";
  const sort = searchParams.sort ?? "authority_score";
  const page = parseInt(searchParams.page ?? "1", 10) || 1;
  const perPage = 20;

  const { sort_by, sort_order } = mapSortToDb(sort);

  try {
    const { createServerClient, searchCompanies } = await import("@vector/db");
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    const supabase = createServerClient(cookieStore);

    const result = await searchCompanies(supabase, {
      query: query || undefined,
      state: state || undefined,
      sort_by,
      sort_order,
      page,
      per_page: perPage,
    });

    return {
      companies: result.companies as unknown as Company[],
      total: result.total,
      page: result.page,
      perPage: result.per_page,
      totalPages: result.total_pages,
    };
  } catch {
    // Seed fallback
    let filtered = [...SEED_COMPANIES];

    if (query) {
      const q = query.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.description?.toLowerCase().includes(q),
      );
    }

    // Sort seed data
    if (sort === "name") {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === "newest") {
      filtered.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      );
    } else {
      filtered.sort((a, b) => (b.trust_score ?? 0) - (a.trust_score ?? 0));
    }

    return {
      companies: filtered,
      total: filtered.length,
      page: 1,
      perPage,
      totalPages: 1,
    };
  }
}

/* ── Metadata ──────────────────────────────────────────────────────────── */

export const metadata: Metadata = {
  title: "Search Rankings | Aircraft Detailing Authority",
  description:
    "Search and filter aircraft detailing companies by Authority Score, region, state, and more. Find the best-rated providers in the industry.",
};

/* ── Page ───────────────────────────────────────────────────────────────── */

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    region?: string;
    state?: string;
    sort?: string;
    page?: string;
  }>;
}) {
  const resolvedParams = await searchParams;
  const results = await fetchSearchResults(resolvedParams);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1">
        <SearchShell
          companies={results.companies}
          total={results.total}
          page={results.page}
          perPage={results.perPage}
          totalPages={results.totalPages}
          initialQuery={resolvedParams.q ?? ""}
          initialRegion={resolvedParams.region ?? ""}
          initialState={resolvedParams.state ?? ""}
          initialSort={resolvedParams.sort ?? "authority_score"}
        />
      </main>

      <Footer />
    </div>
  );
}
