import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Company } from "@vector/types";
import Header from "../../components/header";
import Footer from "../../components/footer";
import { getAirportByCode } from "@/lib/city-airports";
import { getStateByCode } from "@/lib/us-states";
import TrustBar from "@/components/trust-bar";

/* ──────────────────────────────────────────────────────────────────────────
   Seed companies — used when Supabase is not configured
   ────────────────────────────────────────────────────────────────────────── */

const SEED_COMPANIES: Company[] = [
  {
    id: "00000000-0000-0000-0000-000000000001",
    name: "SunCoast Aviation Detail",
    slug: "suncoast-aviation-detail",
    description:
      "Premium aircraft detailing serving the greater Miami area since 2012.",
    website: "https://example.com",
    phone: "3055550100",
    email: "info@suncoast-aviation.example.com",
    logo_url: null,
    trust_score: 91,
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
  {
    id: "00000000-0000-0000-0000-000000000004",
    name: "WingWash Aviation Services",
    slug: "wingwash-aviation-services",
    description:
      "Comprehensive aircraft exterior and interior detailing with paint correction.",
    website: "https://example.com",
    phone: "3055550400",
    email: "info@wingwash.example.com",
    logo_url: null,
    trust_score: 65,
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
      "Brightwork polishing and full detail packages for general aviation.",
    website: null,
    phone: "3055550500",
    email: "team@pacificaeroshine.example.com",
    logo_url: null,
    trust_score: 54,
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
    title: `Aircraft Detailers Near ${airport.name} (${airport.code}) | Detailer Near Me`,
    description: `Find and compare aircraft detailing services near ${airport.name} (${airport.code}). Request quotes from verified detailers.`,
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

  const companies = await getCompaniesForAirport(airport!.cities);

  return (
    <div className="flex min-h-screen flex-col bg-cream-50">
      <Header />
      <main className="flex-1">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="border-b border-brand-100 bg-cream-50"
        >
          <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
            <ol className="flex items-center gap-2 text-sm">
              <li>
                <Link
                  href="/"
                  className="text-gray-500 transition-colors hover:text-brand-500"
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
                  className="text-gray-500 transition-colors hover:text-brand-500"
                >
                  Airports
                </Link>
              </li>
              <li aria-hidden="true" className="text-gray-300">
                /
              </li>
              <li>
                <span
                  className="font-medium text-brown-500"
                  aria-current="page"
                >
                  {airport!.name}
                </span>
              </li>
            </ol>
          </div>
        </nav>

        {/* Hero */}
        <section className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
          <div className="rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 px-6 py-10 text-white sm:px-10 sm:py-14">
            <div className="flex items-center gap-4">
              <span className="inline-flex items-center rounded-xl bg-white/20 px-4 py-2 text-2xl font-bold">
                {airport!.code}
              </span>
              <div>
                <h1 className="font-heading text-2xl font-bold text-white sm:text-3xl">
                  {airport!.name}
                </h1>
                <p className="mt-1 text-white/80">
                  {airport!.cities
                    .map((c) => {
                      const stateInfo = getStateByCode(c.state);
                      return `${c.city}, ${stateInfo?.name ?? c.state}`;
                    })
                    .join(" / ")}
                </p>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-6">
              <Link
                href="/"
                className="inline-flex items-center rounded-xl bg-white px-6 py-3 text-sm font-semibold text-brand-500 shadow-sm transition-colors hover:bg-brand-50"
              >
                <svg
                  className="mr-2 h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                  />
                </svg>
                Request Quotes from Multiple Detailers
              </Link>
            </div>
          </div>
        </section>

        {/* Company list */}
        <section className="py-10 sm:py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="font-heading text-xl font-semibold text-brown-500">
              {companies.length > 0
                ? `${companies.length} Detailer${companies.length !== 1 ? "s" : ""} Near ${airport!.name}`
                : `No Detailers Found Near ${airport!.name}`}
            </h2>

            {companies.length === 0 && (
              <p className="mt-4 text-gray-600">
                We don&apos;t have any detailers listed near this airport yet.
                Check back soon or{" "}
                <Link href="/search" className="text-brand-500 underline">
                  search all detailers
                </Link>
                .
              </p>
            )}

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {companies.map((company) => (
                <div
                  key={company.id}
                  className="group rounded-xl border border-brand-100 bg-white p-5 transition-all hover:border-brand-300 hover:shadow-md"
                >
                  <div className="flex items-start justify-between">
                    <Link
                      href={`/company/${company.slug}`}
                      className="min-w-0 flex-1"
                    >
                      <h3 className="font-heading text-base font-semibold text-brown-500 group-hover:text-brand-500">
                        {company.name}
                      </h3>
                    </Link>
                    {company.is_claimed && (
                      <span className="ml-2 inline-flex shrink-0 items-center gap-1 text-xs text-brand-500">
                        <svg
                          className="h-3.5 w-3.5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          aria-hidden="true"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.403 12.652a3 3 0 000-5.304 3 3 0 00-3.75-3.751 3 3 0 00-5.305 0 3 3 0 00-3.751 3.75 3 3 0 000 5.305 3 3 0 003.75 3.751 3 3 0 005.305 0 3 3 0 003.751-3.75zm-2.546-4.46a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Verified
                      </span>
                    )}
                  </div>

                  {company.description && (
                    <p className="mt-2 line-clamp-2 text-sm text-gray-600">
                      {company.description}
                    </p>
                  )}

                  <div className="mt-3">
                    <TrustBar score={company.trust_score} size="sm" />
                  </div>

                  <div className="mt-4 flex items-center gap-3">
                    <Link
                      href={`/company/${company.slug}`}
                      className="text-sm font-medium text-brand-500 transition-colors hover:text-brand-600"
                    >
                      View Profile
                    </Link>
                    <Link
                      href="/"
                      className="inline-flex items-center rounded-xl bg-brand-500 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-brand-600"
                    >
                      Get Quote
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
