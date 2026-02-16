import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Company } from "@vector/types";
import Header from "../../components/header";
import Footer from "../../components/footer";
import { getAirportByCode } from "@/lib/city-airports";
import { getStateByCode } from "@/lib/us-states";
import { formatTrustScore, getTrustScoreLabel } from "@vector/utils";

/* ──────────────────────────────────────────────────────────────────────────
   Seed companies — used when Supabase is not configured
   ────────────────────────────────────────────────────────────────────────── */

const SEED_COMPANIES: Company[] = [
  {
    id: "00000000-0000-0000-0000-000000000001",
    name: "SkyShine Aviation Detailing",
    slug: "skyshine-aviation-detailing",
    description:
      "Premium aircraft detailing serving the greater Miami area since 2012.",
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
      "Full-service aircraft detailing with ceramic coating specialization.",
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
      "Quick turnaround aircraft washing and interior detailing services.",
    website: null,
    phone: "3055550300",
    email: "hello@jetcleanpro.example.com",
    logo_url: null,
    trust_score: 72,
    is_claimed: false,
    claimed_by: null,
    tier: "basic",
    created_at: "2024-12-01T00:00:00Z",
    updated_at: "2024-12-01T00:00:00Z",
  },
];

/* ──────────────────────────────────────────────────────────────────────────
   Data fetching
   ────────────────────────────────────────────────────────────────────────── */

async function getCompaniesForAirport(
  cities: { state: string; city: string }[],
): Promise<Company[]> {
  try {
    const { searchCompanies, createBrowserClient } = await import("@vector/db");
    const client = createBrowserClient();

    const results: Company[] = [];
    for (const { state, city } of cities) {
      const result = await searchCompanies(client, {
        state,
        city,
        page: 1,
        per_page: 20,
        sort_by: "trust_score",
        sort_order: "desc",
      });
      results.push(...result.companies);
    }

    // Deduplicate by ID
    const seen = new Set<string>();
    return results.filter((c) => {
      if (seen.has(c.id)) return false;
      seen.add(c.id);
      return true;
    });
  } catch {
    return SEED_COMPANIES;
  }
}

/* ──────────────────────────────────────────────────────────────────────────
   Metadata
   ────────────────────────────────────────────────────────────────────────── */

interface AirportDetailPageProps {
  params: Promise<{ code: string }>;
}

export async function generateMetadata({
  params,
}: AirportDetailPageProps): Promise<Metadata> {
  const { code } = await params;
  const airport = getAirportByCode(code);
  if (!airport) return {};

  return {
    title: `Aircraft Detailing Near ${airport.name} (${airport.code}) | Near Me`,
    description: `Find aircraft detailing services near ${airport.name} (${airport.code}). Browse verified detailers serving this airport.`,
  };
}

/* ──────────────────────────────────────────────────────────────────────────
   Page component
   ────────────────────────────────────────────────────────────────────────── */

export default async function AirportDetailPage({
  params,
}: AirportDetailPageProps) {
  const { code } = await params;
  const airport = getAirportByCode(code);
  if (!airport) notFound();

  const companies = await getCompaniesForAirport(airport.cities);

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
                <Link
                  href="/"
                  className="text-gray-500 transition-colors hover:text-sky-600"
                >
                  Home
                </Link>
              </li>
              <li aria-hidden="true" className="text-gray-300">
                /
              </li>
              <li>
                <Link
                  href="/airports"
                  className="text-gray-500 transition-colors hover:text-sky-600"
                >
                  Airports
                </Link>
              </li>
              <li aria-hidden="true" className="text-gray-300">
                /
              </li>
              <li>
                <span
                  className="font-medium text-gray-900"
                  aria-current="page"
                >
                  {airport.name}
                </span>
              </li>
            </ol>
          </div>
        </nav>

        {/* Hero */}
        <section className="bg-sky-600 text-white">
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
            <div className="flex items-center gap-4">
              <span className="inline-flex items-center rounded-lg bg-white/20 px-3 py-1.5 text-lg font-bold">
                {airport.code}
              </span>
              <div>
                <h1 className="font-heading text-2xl font-bold sm:text-3xl">
                  {airport.name}
                </h1>
                <p className="mt-1 text-sky-100">
                  {airport.cities
                    .map((c) => {
                      const stateInfo = getStateByCode(c.state);
                      return `${c.city}, ${stateInfo?.name ?? c.state}`;
                    })
                    .join(" · ")}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Company list */}
        <section className="bg-gray-50 py-10 sm:py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="font-heading text-xl font-semibold text-gray-900">
              {companies.length > 0
                ? `${companies.length} Detailer${companies.length !== 1 ? "s" : ""} Near ${airport.name}`
                : `No Detailers Found Near ${airport.name}`}
            </h2>

            {companies.length === 0 && (
              <p className="mt-4 text-gray-500">
                We don&apos;t have any detailers listed near this airport yet.
                Check back soon or{" "}
                <Link href="/search" className="text-sky-600 underline">
                  search all detailers
                </Link>
                .
              </p>
            )}

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {companies.map((company) => (
                <Link
                  key={company.id}
                  href={`/company/${company.slug}`}
                  className="group rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:border-sky-300 hover:shadow-md"
                >
                  <div className="flex items-start justify-between">
                    <h3 className="font-heading text-base font-semibold text-gray-900 group-hover:text-sky-600">
                      {company.name}
                    </h3>
                    {company.trust_score !== null && (
                      <span className="ml-2 inline-flex shrink-0 items-center rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                        {formatTrustScore(company.trust_score)}
                      </span>
                    )}
                  </div>
                  {company.trust_score !== null && (
                    <p className="mt-1 text-xs text-emerald-600">
                      {getTrustScoreLabel(company.trust_score)}
                    </p>
                  )}
                  {company.description && (
                    <p className="mt-2 line-clamp-2 text-sm text-gray-500">
                      {company.description}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
