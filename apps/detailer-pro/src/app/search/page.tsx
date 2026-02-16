import type { Metadata } from "next";
import type { Company } from "@vector/types";
import Header from "../components/header";
import Footer from "../components/footer";
import { US_STATES } from "@/lib/us-states";
import { SPECIALIZATIONS } from "@/lib/specializations";
import SearchShell from "./components/search-shell";

/* ──────────────────────────────────────────────────────────────────────────
   Seed data — used when Supabase is not configured
   ────────────────────────────────────────────────────────────────────────── */

const SEED_COMPANIES: Company[] = [
  {
    id: "00000000-0000-0000-0000-000000000001",
    name: "AeroShine Detailing Group",
    slug: "aeroshine-detailing-group",
    description:
      "Premier aircraft detailing operation serving South Florida. Specializing in private jets, turboprops, and rotorcraft.",
    website: "https://example.com",
    phone: "3055550100",
    email: "ops@aeroshine.example.com",
    logo_url: null,
    trust_score: 94,
    is_claimed: true,
    claimed_by: "user-seed-001",
    tier: "featured",
    created_at: "2024-10-15T00:00:00Z",
    updated_at: "2024-10-15T00:00:00Z",
  },
  {
    id: "00000000-0000-0000-0000-000000000002",
    name: "JetPolish Aviation",
    slug: "jetpolish-aviation",
    description:
      "High-end ceramic coatings and paint correction for business jets in the Southeast.",
    website: null,
    phone: "3055550200",
    email: "contact@jetpolish.example.com",
    logo_url: null,
    trust_score: 88,
    is_claimed: true,
    claimed_by: null,
    tier: "premium",
    created_at: "2024-11-01T00:00:00Z",
    updated_at: "2024-11-01T00:00:00Z",
  },
  {
    id: "00000000-0000-0000-0000-000000000003",
    name: "WingMaster Detailing Co.",
    slug: "wingmaster-detailing-co",
    description:
      "Full-service aircraft detailing with rapid turnaround in the Dallas-Fort Worth area.",
    website: null,
    phone: "2145550100",
    email: "hello@wingmaster.example.com",
    logo_url: null,
    trust_score: 76,
    is_claimed: true,
    claimed_by: null,
    tier: "enhanced",
    created_at: "2024-12-01T00:00:00Z",
    updated_at: "2024-12-01T00:00:00Z",
  },
  {
    id: "00000000-0000-0000-0000-000000000004",
    name: "Pacific Aero Shine",
    slug: "pacific-aero-shine",
    description:
      "West coast aircraft detailing and brightwork polishing serving Los Angeles area airports.",
    website: "https://example.com",
    phone: "3105550100",
    email: "team@pacificaeroshine.example.com",
    logo_url: null,
    trust_score: 65,
    is_claimed: false,
    claimed_by: null,
    tier: "basic",
    created_at: "2025-01-10T00:00:00Z",
    updated_at: "2025-01-10T00:00:00Z",
  },
  {
    id: "00000000-0000-0000-0000-000000000005",
    name: "SkyBright Solutions",
    slug: "skybright-solutions",
    description:
      "Budget-friendly aircraft wash and interior cleaning services in the Phoenix metro.",
    website: null,
    phone: "4805550100",
    email: "info@skybright.example.com",
    logo_url: null,
    trust_score: 52,
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
  specialization?: string;
  state?: string;
  sort?: string;
  page?: string;
}

async function fetchSearchResults(searchParams: SearchPageParams) {
  const {
    q,
    state,
    sort = "trust_score",
    page = "1",
  } = searchParams;

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const sortBy = (
    ["relevance", "trust_score", "name", "created_at"].includes(sort)
      ? sort
      : "trust_score"
  ) as "relevance" | "trust_score" | "name" | "created_at";
  const sortOrder = sortBy === "name" ? ("asc" as const) : ("desc" as const);

  try {
    const { searchCompanies, createBrowserClient } = await import("@vector/db");
    const client = createBrowserClient();

    const result = await searchCompanies(client, {
      query: q || undefined,
      state: state || undefined,
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
  title: "Search Pros | Aircraft Detailer Pro",
  description:
    "Search the professional network of aircraft detailers. Filter by specialization, state, and trust score.",
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
  const specializations = SPECIALIZATIONS.map((s) => ({
    slug: s.slug,
    name: s.name,
  }));

  return (
    <div className="flex min-h-screen flex-col bg-slate-950">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="border-b border-slate-800 bg-slate-900">
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
            <h1 className="font-heading text-3xl font-bold text-white sm:text-4xl">
              Search Pros
            </h1>
            <p className="mt-2 text-lg text-slate-400">
              Find the right aircraft detailing professional for your fleet.
            </p>
          </div>
        </section>

        {/* Search shell */}
        <section className="py-8 sm:py-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SearchShell
              companies={companies}
              states={states}
              specializations={specializations}
              total={total}
              page={page}
              totalPages={totalPages}
              initialQuery={sp.q ?? ""}
              initialSpecialization={sp.specialization ?? ""}
              initialState={sp.state ?? ""}
              initialSort={sp.sort ?? "trust_score"}
            />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
