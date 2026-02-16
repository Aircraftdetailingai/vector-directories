import type { Metadata } from "next";
import type { Company } from "@vector/types";
import Header from "../components/header";
import Footer from "../components/footer";
import SearchShell from "./components/search-shell";

/* ── Seed fallback companies ─────────────────────────────────────────────── */

const seedCompanies: Company[] = [
  {
    id: "seed-1", name: "SkyShine Aviation Detailing", slug: "skyshine-aviation-detailing",
    description: "Premium aircraft care provider trusted by owners across South Florida.",
    trust_score: 92, tier: "premium", is_claimed: true, website: null, phone: null,
    email: null, logo_url: null, claimed_by: null,
    created_at: "2024-01-15T00:00:00Z", updated_at: "2024-06-01T00:00:00Z",
  },
  {
    id: "seed-2", name: "AeroGlow Detailing Co.", slug: "aeroglow-detailing",
    description: "Meticulous detailing for corporate jets and turboprops.",
    trust_score: 87, tier: "enhanced", is_claimed: true, website: null, phone: null,
    email: null, logo_url: null, claimed_by: null,
    created_at: "2024-02-10T00:00:00Z", updated_at: "2024-06-01T00:00:00Z",
  },
  {
    id: "seed-3", name: "WingPolish Pros", slug: "wingpolish-pros",
    description: "Specializing in brightwork and paint correction for all aircraft types.",
    trust_score: 78, tier: "premium", is_claimed: true, website: null, phone: null,
    email: null, logo_url: null, claimed_by: null,
    created_at: "2024-03-05T00:00:00Z", updated_at: "2024-06-01T00:00:00Z",
  },
  {
    id: "seed-4", name: "ClearSkies Aircraft Care", slug: "clearskies-aircraft-care",
    description: "Full-service aircraft detailing at major airports across the Southeast.",
    trust_score: 65, tier: "basic", is_claimed: false, website: null, phone: null,
    email: null, logo_url: null, claimed_by: null,
    created_at: "2024-04-20T00:00:00Z", updated_at: "2024-06-01T00:00:00Z",
  },
  {
    id: "seed-5", name: "JetFresh Detailing", slug: "jetfresh-detailing",
    description: "Eco-friendly aircraft detailing with waterless wash technology.",
    trust_score: 54, tier: "basic", is_claimed: false, website: null, phone: null,
    email: null, logo_url: null, claimed_by: null,
    created_at: "2024-05-12T00:00:00Z", updated_at: "2024-06-01T00:00:00Z",
  },
];

export const metadata: Metadata = {
  title: "Search Detailers | Aviation Detailing Hub",
  description:
    "Search our community of trusted aircraft detailing professionals by name, service, or location.",
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    category?: string;
    state?: string;
    sort?: string;
    page?: string;
  }>;
}) {
  const sp = await searchParams;
  const q = sp.q ?? "";
  const category = sp.category ?? "";
  const state = sp.state ?? "";
  const sort = sp.sort ?? "trust_score";
  const pageNum = Math.max(1, parseInt(sp.page ?? "1", 10) || 1);

  let companies: Company[] = seedCompanies;
  let total = seedCompanies.length;
  let totalPages = 1;

  try {
    const { createServerClient, searchCompanies } = await import("@vector/db");
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    const supabase = createServerClient(cookieStore);

    const sortOrder = sort === "name" ? "asc" : "desc";
    const sortBy = sort === "name" ? "name" : sort === "created_at" ? "created_at" : "trust_score";

    const result = await searchCompanies(supabase, {
      query: q || undefined,
      category: category || undefined,
      state: state || undefined,
      sort_by: sortBy,
      sort_order: sortOrder,
      page: pageNum,
      per_page: 20,
    });

    if (result.companies.length > 0 || q || category || state) {
      companies = result.companies;
      total = result.total;
      totalPages = result.total_pages;
    }
  } catch {
    // use seed fallback
  }

  return (
    <div className="min-h-screen bg-cream-50">
      <Header />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <SearchShell
          initialCompanies={companies}
          initialQuery={q}
          initialCategory={category}
          initialState={state}
          initialSort={sort}
          initialPage={pageNum}
          total={total}
          totalPages={totalPages}
        />
      </main>

      <Footer />
    </div>
  );
}
