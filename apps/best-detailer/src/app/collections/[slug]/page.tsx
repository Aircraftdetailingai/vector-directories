import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getCollectionBySlug } from "@/lib/collections";
import Header from "../../components/header";
import Footer from "../../components/footer";
import TrustScore from "@/components/trust-score";
import EditorsBadge from "@/components/editors-badge";

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
    id: "seed-col-1",
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
    id: "seed-col-2",
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
    id: "seed-col-3",
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
    id: "seed-col-4",
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
    id: "seed-col-5",
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

/* ── Data Fetching ─────────────────────────────────────────────────────── */

async function fetchCollectionCompanies() {
  try {
    const { createBrowserClient, searchCompanies } = await import(
      "@vector/db"
    );
    const supabase = createBrowserClient();

    const result = await searchCompanies(supabase, {
      page: 1,
      per_page: 20,
      sort_by: "trust_score",
      sort_order: "desc",
    });

    return result.companies as unknown as Company[];
  } catch {
    return SEED_COMPANIES;
  }
}

/* ── Metadata ──────────────────────────────────────────────────────────── */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const collection = getCollectionBySlug(slug);

  if (!collection) {
    return { title: "Collection Not Found | Best Aircraft Detailer" };
  }

  return {
    title: `${collection.name} | Best Aircraft Detailer`,
    description: collection.description,
    openGraph: {
      title: `${collection.name} — Best Aircraft Detailer`,
      description: collection.description,
    },
  };
}

/* ── Page ───────────────────────────────────────────────────────────────── */

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const collection = getCollectionBySlug(slug);

  if (!collection) {
    notFound();
  }

  const companies = await fetchCollectionCompanies();

  return (
    <div className="min-h-screen flex flex-col bg-ivory-50">
      <Header />

      {/* ── Hero ──────────────────────────────────────────── */}
      <section className="bg-noir-900">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 text-center">
          <p className="text-gold-500 text-xs uppercase tracking-[0.2em] font-body mb-4">
            Curated Collection
          </p>
          <h1 className="font-heading text-3xl md:text-5xl text-ivory-50 font-light tracking-wide">
            {collection.name}
          </h1>
          <div className="mt-6 mx-auto h-px w-24 bg-gold-500" />
          <p className="mt-6 text-ivory-400 font-body max-w-2xl mx-auto leading-relaxed">
            {collection.description}
          </p>
        </div>
      </section>

      {/* ── Company Grid ──────────────────────────────────── */}
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {companies.map((company) => (
              <article
                key={company.id}
                className="luxury-card bg-white border border-ivory-200 rounded-sm p-6 flex flex-col"
              >
                {/* Editor's Choice Badge */}
                {company.tier === "featured" && (
                  <div className="mb-4">
                    <EditorsBadge size="sm" />
                  </div>
                )}

                {/* Company Name */}
                <h2 className="font-heading text-xl text-noir-900 font-medium mb-3">
                  {company.name}
                </h2>

                {/* Trust Score */}
                <div className="mb-4">
                  <TrustScore score={company.trust_score} size="sm" />
                </div>

                {/* Tier Badge */}
                <p className="text-gold-600 text-xs uppercase tracking-widest font-body mb-3">
                  {company.tier}
                </p>

                {/* Description */}
                {company.description && (
                  <p className="font-body text-sm text-noir-600 leading-relaxed mb-6 flex-1">
                    {company.description}
                  </p>
                )}

                {/* View Profile Link */}
                <Link
                  href={`/company/${company.slug}`}
                  className="mt-auto inline-flex items-center justify-center bg-noir-900 hover:bg-noir-800 text-white py-2.5 text-xs tracking-widest uppercase font-body transition-colors rounded-sm"
                >
                  View Profile
                </Link>
              </article>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
