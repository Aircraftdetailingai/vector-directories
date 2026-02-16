import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Company } from "@vector/types";
import Header from "../../components/header";
import Footer from "../../components/footer";
import ProBadge from "@/components/pro-badge";
import { getSpecializationBySlug } from "@/lib/specializations";

/* ──────────────────────────────────────────────────────────────────────────
   Seed data
   ────────────────────────────────────────────────────────────────────────── */

const SEED_COMPANIES: Company[] = [
  {
    id: "00000000-0000-0000-0000-000000000001",
    name: "AeroShine Detailing Group",
    slug: "aeroshine-detailing-group",
    description: "Premier aircraft detailing operation serving South Florida.",
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
    description: "High-end ceramic coatings and paint correction for business jets.",
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
    description: "Full-service aircraft detailing with rapid turnaround in the DFW area.",
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
    description: "West coast aircraft detailing and brightwork polishing.",
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
    description: "Budget-friendly aircraft wash and interior cleaning services.",
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

async function getCompaniesBySpecialization(
  specName: string,
): Promise<Company[]> {
  try {
    const { searchCompanies, createBrowserClient } = await import("@vector/db");
    const client = createBrowserClient();

    const result = await searchCompanies(client, {
      query: specName,
      sort_by: "trust_score",
      sort_order: "desc",
      page: 1,
      per_page: 50,
    });

    return result.companies;
  } catch {
    return SEED_COMPANIES;
  }
}

/* ──────────────────────────────────────────────────────────────────────────
   Metadata
   ────────────────────────────────────────────────────────────────────────── */

interface SpecPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: SpecPageProps): Promise<Metadata> {
  const { slug } = await params;
  const spec = getSpecializationBySlug(slug);
  if (!spec) return {};

  return {
    title: `${spec.name} Detailing Pros | Aircraft Detailer Pro`,
    description: spec.description,
    openGraph: {
      title: `${spec.name} Detailing Pros | Aircraft Detailer Pro`,
      description: spec.description,
      type: "website",
    },
  };
}

/* ──────────────────────────────────────────────────────────────────────────
   Page component
   ────────────────────────────────────────────────────────────────────────── */

const tierConfig: Record<string, { label: string; color: string }> = {
  featured: { label: "Featured", color: "bg-electric-500 text-white" },
  premium: {
    label: "Premium",
    color: "bg-electric-400/20 text-electric-400 border border-electric-400/30",
  },
  enhanced: {
    label: "Enhanced",
    color: "bg-slate-400/20 text-slate-400 border border-slate-400/30",
  },
  basic: {
    label: "Basic",
    color: "bg-slate-600/20 text-slate-500 border border-slate-600/30",
  },
  bundle_all: { label: "All Access", color: "bg-electric-500 text-white" },
};

export default async function SpecializationPage({ params }: SpecPageProps) {
  const { slug } = await params;
  const spec = getSpecializationBySlug(slug);
  if (!spec) notFound();

  const companies = await getCompaniesBySpecialization(spec!.name);

  return (
    <div className="flex min-h-screen flex-col bg-slate-950">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="border-b border-slate-800 bg-slate-900">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
            <div className="flex items-center gap-3">
              <span className="inline-block font-mono text-lg font-bold text-electric-500">
                {spec!.icon}
              </span>
              <h1 className="font-heading text-3xl font-bold text-white sm:text-4xl">
                {spec!.name}
              </h1>
            </div>
            <p className="mt-3 max-w-2xl text-lg text-slate-400">
              {spec!.description}
            </p>
          </div>
        </section>

        {/* Rankings table */}
        <section className="py-8 sm:py-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="font-heading text-xl font-semibold text-white">
              Top Professionals
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              Ranked by trust score
            </p>

            {companies.length > 0 ? (
              <div className="mt-6 space-y-2">
                {companies.map((company, idx) => {
                  const tier =
                    tierConfig[company.tier] ?? tierConfig.basic;
                  return (
                    <Link
                      key={company.id}
                      href={`/company/${company.slug}`}
                      className="group flex items-center gap-4 bg-slate-800 rounded-lg border border-slate-700 px-4 py-3 transition-colors hover:border-electric-500/50"
                    >
                      <span className="w-8 shrink-0 text-center font-mono text-sm font-bold text-slate-500">
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      <ProBadge score={company.trust_score} size="sm" />
                      <div className="min-w-0 flex-1">
                        <h3 className="truncate font-heading text-sm font-semibold text-white group-hover:text-electric-400 transition-colors">
                          {company.name}
                        </h3>
                        {company.description && (
                          <p className="mt-0.5 truncate text-xs text-slate-500">
                            {company.description}
                          </p>
                        )}
                      </div>
                      <span
                        className={`shrink-0 rounded-lg px-2 py-0.5 text-xs font-semibold ${tier.color}`}
                      >
                        {tier.label}
                      </span>
                      <svg
                        className="h-4 w-4 shrink-0 text-slate-600 group-hover:text-electric-400 transition-colors"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M8.25 4.5l7.5 7.5-7.5 7.5"
                        />
                      </svg>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="mt-6 rounded-lg border border-slate-700 bg-slate-800 px-8 py-16 text-center">
                <p className="font-heading text-lg font-semibold text-white">
                  No professionals listed yet
                </p>
                <p className="mt-2 text-sm text-slate-400">
                  Be the first to claim your profile in this specialization.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
