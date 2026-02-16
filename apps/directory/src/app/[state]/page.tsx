import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { Company, SearchResult } from "@vector/types";
import { Header } from "../components/header";
import { Footer } from "../components/footer";
import { getStateBySlug, US_STATES } from "@/lib/us-states";
import { Breadcrumb } from "./components/breadcrumb";
import { CompanyListingCard } from "./components/company-listing-card";
import { StateListingShell } from "./components/state-listing-shell";

/* ──────────────────────────────────────────────────────────────────────────
   Seed data  — used when Supabase is not configured (local dev)
   ────────────────────────────────────────────────────────────────────────── */

const SEED_COMPANIES: (Company & { city?: string; services?: string[] })[] = [
  {
    id: "00000000-0000-0000-0000-000000000101",
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
    city: "Miami",
    services: ["Exterior Wash", "Ceramic Coating"],
  },
  {
    id: "00000000-0000-0000-0000-000000000102",
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
    id: "00000000-0000-0000-0000-000000000103",
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
    id: "00000000-0000-0000-0000-000000000104",
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
    id: "00000000-0000-0000-0000-000000000105",
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

const SEED_CITIES = ["Jacksonville", "Miami", "Orlando", "Tampa"];

const SERVICE_CATEGORIES = [
  "Exterior Wash",
  "Interior Detailing",
  "Paint Correction",
  "Ceramic Coating",
  "Brightwork",
  "Full Detail",
];

/* ──────────────────────────────────────────────────────────────────────────
   Data fetching
   ────────────────────────────────────────────────────────────────────────── */

async function getCompaniesForState(
  stateCode: string,
  options: {
    city?: string;
    category?: string;
    sortBy?: string;
    page?: number;
  },
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
      city: options.city || undefined,
      category: options.category || undefined,
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

async function getCities(stateCode: string): Promise<string[]> {
  try {
    const { getCitiesForState, createBrowserClient } = await import(
      "@vector/db"
    );
    const client = createBrowserClient();
    return await getCitiesForState(client, stateCode);
  } catch {
    return SEED_CITIES;
  }
}

/* ──────────────────────────────────────────────────────────────────────────
   Static params & metadata
   ────────────────────────────────────────────────────────────────────────── */

export function generateStaticParams() {
  return US_STATES.map((s) => ({ state: s.slug }));
}

interface StatePageProps {
  params: Promise<{ state: string }>;
  searchParams: Promise<{
    city?: string;
    service?: string;
    sort?: string;
    page?: string;
  }>;
}

export async function generateMetadata({
  params,
}: StatePageProps): Promise<Metadata> {
  const { state } = await params;
  const stateInfo = getStateBySlug(state);
  if (!stateInfo) return {};

  return {
    title: `Aircraft Detailing in ${stateInfo.name} | Aircraft Detailing Directory`,
    description: `Find trusted aircraft detailing services in ${stateInfo.name}. Browse verified companies, compare trust scores, and connect with local detailers.`,
    openGraph: {
      title: `Aircraft Detailing in ${stateInfo.name} | Aircraft Detailing Directory`,
      description: `Find trusted aircraft detailing services in ${stateInfo.name}.`,
      type: "website",
    },
  };
}

/* ──────────────────────────────────────────────────────────────────────────
   Page component
   ────────────────────────────────────────────────────────────────────────── */

export default async function StatePage({
  params,
  searchParams,
}: StatePageProps) {
  const { state } = await params;
  const stateInfo = getStateBySlug(state);
  if (!stateInfo) notFound();

  const resolvedSearchParams = await searchParams;
  const city = resolvedSearchParams.city ?? "";
  const service = resolvedSearchParams.service ?? "";
  const sort = resolvedSearchParams.sort ?? "trust_score";
  const page = Math.max(1, parseInt(resolvedSearchParams.page ?? "1", 10) || 1);

  const [result, cities] = await Promise.all([
    getCompaniesForState(stateInfo.code, {
      city: city || undefined,
      category: service || undefined,
      sortBy: sort,
      page,
    }),
    getCities(stateInfo.code),
  ]);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Breadcrumb stateName={stateInfo.name} />

        {/* Page header */}
        <section className="bg-forest-800 py-10 sm:py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="font-heading text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Aircraft Detailing Services in {stateInfo.name}
            </h1>
            <p className="mt-3 text-lg text-forest-200">
              {result.total}{" "}
              {result.total === 1 ? "company" : "companies"} found
            </p>
          </div>
        </section>

        {/* Content area */}
        <section className="py-10 sm:py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <StateListingShell
              stateSlug={stateInfo.slug}
              cities={cities}
              categories={SERVICE_CATEGORIES}
              currentCity={city}
              currentService={service}
              currentSort={sort}
              currentPage={page}
              totalPages={result.total_pages}
              totalCompanies={result.total}
            >
              {result.companies.map((company) => (
                <CompanyListingCard key={company.id} company={company} />
              ))}
            </StateListingShell>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
