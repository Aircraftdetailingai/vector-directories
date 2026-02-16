import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Company } from "@vector/types";
import Header from "../../components/header";
import Footer from "../../components/footer";
import { getCategoryBySlug } from "@/lib/categories";

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

/* ── Helpers ──────────────────────────────────────────────────────────────── */

function getTrustLabel(score: number | null): { label: string; emoji: string; className: string } {
  if (score === null) return { label: "New", emoji: "\uD83C\uDD95", className: "bg-gray-100 text-gray-600" };
  if (score >= 90) return { label: "Community Favorite", emoji: "\uD83C\uDF1F", className: "bg-coral-100 text-coral-700" };
  if (score >= 80) return { label: "Highly Recommended", emoji: "\uD83D\uDC4F", className: "bg-teal-100 text-teal-700" };
  if (score >= 70) return { label: "Trusted Pro", emoji: "\uD83D\uDC4D", className: "bg-teal-50 text-teal-600" };
  if (score >= 60) return { label: "Growing", emoji: "\uD83C\uDF31", className: "bg-teal-50 text-teal-500" };
  return { label: "New to Hub", emoji: "\uD83C\uDD95", className: "bg-gray-100 text-gray-600" };
}

function getTierBadge(tier: string): { label: string; className: string } {
  switch (tier) {
    case "featured": return { label: "Featured", className: "bg-coral-400 text-white" };
    case "premium": return { label: "Premium", className: "bg-coral-100 text-coral-700" };
    case "enhanced": return { label: "Enhanced", className: "bg-teal-100 text-teal-700" };
    case "bundle_all": return { label: "All-Access", className: "bg-coral-400 text-white" };
    default: return { label: "Community", className: "bg-gray-100 text-gray-600" };
  }
}

/* ── Metadata ────────────────────────────────────────────────────────────── */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category: slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) {
    return { title: "Category Not Found | Aviation Detailing Hub" };
  }

  return {
    title: `${category.name} Services | Aviation Detailing Hub`,
    description: category.description.slice(0, 160),
    openGraph: {
      title: `${category.name} Services | Aviation Detailing Hub`,
      description: category.description.slice(0, 160),
    },
  };
}

/* ── Page ─────────────────────────────────────────────────────────────────── */

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category: slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  let companies: Company[] = seedCompanies;

  try {
    const { createServerClient, searchCompanies } = await import("@vector/db");
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    const supabase = createServerClient(cookieStore);

    const result = await searchCompanies(supabase, {
      query: category.name,
      sort_by: "trust_score",
      sort_order: "desc",
      page: 1,
      per_page: 50,
    });

    if (result.companies.length > 0) {
      companies = result.companies;
    }
  } catch {
    // use seed fallback
  }

  // Sort by trust score descending
  const sorted = [...companies].sort(
    (a, b) => (b.trust_score ?? 0) - (a.trust_score ?? 0),
  );

  return (
    <div className="min-h-screen bg-cream-50">
      <Header />

      {/* Hero */}
      <section className="bg-teal-600">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
          {/* Breadcrumb */}
          <nav className="mb-4 text-sm font-body text-teal-200" aria-label="Breadcrumb">
            <ol className="flex items-center gap-1.5 flex-wrap">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href="/services" className="hover:text-white transition-colors">
                  Services
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-white font-medium">{category.name}</li>
            </ol>
          </nav>

          <div className="flex items-center gap-3">
            <span className="text-4xl" aria-hidden="true">
              {category.icon}
            </span>
            <div>
              <h1 className="font-heading font-bold text-3xl sm:text-4xl text-white">
                {category.name}
              </h1>
              <p className="text-teal-100 font-body mt-1 max-w-2xl">
                {category.description}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Company list */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <p className="text-gray-500 font-body text-sm mb-6">
          Showing {sorted.length} detailer{sorted.length !== 1 ? "s" : ""} offering {category.name}
        </p>

        <div className="space-y-4">
          {sorted.map((company) => {
            const trust = getTrustLabel(company.trust_score);
            const tier = getTierBadge(company.tier);

            return (
              <div
                key={company.id}
                className="bg-white rounded-2xl border border-teal-100 p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="space-y-2 flex-1 min-w-0">
                    {/* Name */}
                    <h2 className="font-heading font-bold text-lg text-gray-800">
                      {company.name}
                    </h2>

                    {/* Badges */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${trust.className}`}>
                        {trust.emoji} {trust.label}
                      </span>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${tier.className}`}>
                        {tier.label}
                      </span>
                    </div>

                    {/* Description */}
                    {company.description && (
                      <p className="text-gray-500 font-body text-sm line-clamp-2">
                        {company.description}
                      </p>
                    )}
                  </div>

                  {/* CTA */}
                  <Link
                    href={`/company/${company.slug}`}
                    className="inline-flex items-center gap-1.5 text-teal-600 hover:text-teal-700 text-sm font-semibold whitespace-nowrap transition-colors"
                  >
                    Visit Profile
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
}
