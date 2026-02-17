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
    id: "seed-sr-1",
    name: "Prestige Aviation Detail",
    slug: "prestige-aviation-detail",
    description:
      "The gold standard in luxury aircraft care across the Southeast.",
    trust_score: 94,
    tier: "featured",
    is_claimed: true,
    website: null,
    phone: null,
    email: null,
    logo_url: null,
    claimed_by: null,
    created_at: "2024-01-10T00:00:00Z",
    updated_at: "2024-12-15T00:00:00Z",
  },
  {
    id: "seed-sr-2",
    name: "Van Nuys Elite Detail",
    slug: "van-nuys-elite-detail",
    description:
      "Hollywood's premier aircraft detailing studio at Van Nuys Airport.",
    trust_score: 96,
    tier: "featured",
    is_claimed: true,
    website: null,
    phone: null,
    email: null,
    logo_url: null,
    claimed_by: null,
    created_at: "2024-01-05T00:00:00Z",
    updated_at: "2024-12-01T00:00:00Z",
  },
  {
    id: "seed-sr-3",
    name: "Tarmac Gloss Aviation",
    slug: "tarmac-gloss-aviation",
    description:
      "Meticulous exterior and interior detailing for discerning jet owners.",
    trust_score: 91,
    tier: "premium",
    is_claimed: true,
    website: null,
    phone: null,
    email: null,
    logo_url: null,
    claimed_by: null,
    created_at: "2024-02-01T00:00:00Z",
    updated_at: "2024-11-20T00:00:00Z",
  },
  {
    id: "seed-sr-4",
    name: "Lone Star Aero Polish",
    slug: "lone-star-aero-polish",
    description:
      "Dallas-Fort Worth's trusted name in aircraft surface restoration.",
    trust_score: 88,
    tier: "enhanced",
    is_claimed: true,
    website: null,
    phone: null,
    email: null,
    logo_url: null,
    claimed_by: null,
    created_at: "2024-03-01T00:00:00Z",
    updated_at: "2024-10-15T00:00:00Z",
  },
  {
    id: "seed-sr-5",
    name: "Skyward Shine Co.",
    slug: "skyward-shine-co",
    description:
      "Full-service detailing for corporate fleets and private aircraft.",
    trust_score: 90,
    tier: "premium",
    is_claimed: false,
    website: null,
    phone: null,
    email: null,
    logo_url: null,
    claimed_by: null,
    created_at: "2024-04-01T00:00:00Z",
    updated_at: "2024-11-01T00:00:00Z",
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
    case "trust_score":
    default:
      return { sort_by: "trust_score", sort_order: "desc" };
  }
}

/* ── Data Fetching ─────────────────────────────────────────────────────── */

async function fetchSearchResults(searchParams: {
  q?: string;
  state?: string;
  collection?: string;
  sort?: string;
  page?: string;
}) {
  const query = searchParams.q ?? "";
  const state = searchParams.state ?? "";
  const sort = searchParams.sort ?? "trust_score";
  const page = parseInt(searchParams.page ?? "1", 10) || 1;
  const perPage = 20;

  const { sort_by, sort_order } = mapSortToDb(sort);

  try {
    const { createBrowserClient, searchCompanies } = await import(
      "@vector/db"
    );
    const supabase = createBrowserClient();

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
  title: "Search Our Directory | Best Aircraft Detailer",
  description:
    "Search and browse the finest aircraft detailing professionals. Filter by state, collection, and trust score.",
};

/* ── Page ───────────────────────────────────────────────────────────────── */

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    state?: string;
    collection?: string;
    sort?: string;
    page?: string;
  }>;
}) {
  const resolvedParams = await searchParams;
  const results = await fetchSearchResults(resolvedParams);

  return (
    <div className="min-h-screen flex flex-col bg-ivory-50">
      <Header />

      <main className="flex-1">
        <SearchShell
          companies={results.companies}
          total={results.total}
          page={results.page}
          perPage={results.perPage}
          totalPages={results.totalPages}
          initialQuery={resolvedParams.q ?? ""}
          initialState={resolvedParams.state ?? ""}
          initialCollection={resolvedParams.collection ?? ""}
          initialSort={resolvedParams.sort ?? "trust_score"}
        />
      </main>

      <Footer />
    </div>
  );
}
