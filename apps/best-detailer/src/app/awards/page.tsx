import type { Metadata } from "next";
import Link from "next/link";
import Header from "../components/header";
import Footer from "../components/footer";
import TrustScore from "@/components/trust-score";
import EditorsBadge from "@/components/editors-badge";
import { COLLECTIONS } from "@/lib/collections";

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
    id: "seed-aw-1",
    name: "Prestige Aviation Detail",
    slug: "prestige-aviation-detail",
    description:
      "The gold standard in luxury aircraft care across the Southeast.",
    trust_score: 97,
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
    id: "seed-aw-2",
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
    id: "seed-aw-3",
    name: "Aspen AeroLux Detailing",
    slug: "aspen-aerolux-detailing",
    description:
      "Ultra-premium detailing for elite clientele at Aspen-Pitkin Airport.",
    trust_score: 95,
    tier: "featured",
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
    id: "seed-aw-4",
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
    created_at: "2024-02-15T00:00:00Z",
    updated_at: "2024-11-01T00:00:00Z",
  },
  {
    id: "seed-aw-5",
    name: "Skyward Shine Co.",
    slug: "skyward-shine-co",
    description:
      "Full-service detailing for corporate fleets and private aircraft.",
    trust_score: 90,
    tier: "premium",
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
    id: "seed-aw-6",
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
    created_at: "2024-03-15T00:00:00Z",
    updated_at: "2024-09-20T00:00:00Z",
  },
  {
    id: "seed-aw-7",
    name: "Centennial Flight Finish",
    slug: "centennial-flight-finish",
    description:
      "Denver's top choice for ceramic coating and paint correction on aircraft.",
    trust_score: 87,
    tier: "enhanced",
    is_claimed: false,
    website: null,
    phone: null,
    email: null,
    logo_url: null,
    claimed_by: null,
    created_at: "2024-04-01T00:00:00Z",
    updated_at: "2024-09-01T00:00:00Z",
  },
  {
    id: "seed-aw-8",
    name: "Pacific Aero Shine",
    slug: "pacific-aero-shine",
    description:
      "West Coast aircraft detailing with a focus on eco-friendly products.",
    trust_score: 85,
    tier: "enhanced",
    is_claimed: true,
    website: null,
    phone: null,
    email: null,
    logo_url: null,
    claimed_by: null,
    created_at: "2024-05-01T00:00:00Z",
    updated_at: "2024-08-15T00:00:00Z",
  },
];

/* ── Data Fetching ─────────────────────────────────────────────────────── */

async function fetchCompanies() {
  try {
    const { createBrowserClient, searchCompanies } = await import(
      "@vector/db"
    );
    const supabase = createBrowserClient();

    const result = await searchCompanies(supabase, {
      page: 1,
      per_page: 50,
      sort_by: "trust_score",
      sort_order: "desc",
    });

    return result.companies as unknown as Company[];
  } catch {
    return SEED_COMPANIES;
  }
}

/* ── Metadata ──────────────────────────────────────────────────────────── */

export const metadata: Metadata = {
  title: "Editor's Choice Awards | Best Aircraft Detailer",
  description:
    "Discover our Editor's Choice award winners and curated collections of the finest aircraft detailing professionals in the country.",
};

/* ── Page ───────────────────────────────────────────────────────────────── */

export default async function AwardsPage() {
  const companies = await fetchCompanies();
  const editorsChoice = companies.filter((c) => c.tier === "featured");

  return (
    <div className="min-h-screen flex flex-col bg-ivory-50">
      <Header />

      {/* ── Hero ──────────────────────────────────────────── */}
      <section className="bg-noir-900">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 text-center">
          <p className="text-gold-500 text-xs uppercase tracking-[0.2em] font-body mb-4">
            Annual Recognition
          </p>
          <h1 className="font-heading text-3xl md:text-5xl text-ivory-50 font-light tracking-wide">
            Editor&rsquo;s Choice Awards
          </h1>
          <div className="mt-6 mx-auto h-px w-24 bg-gold-500" />
          <p className="mt-6 text-ivory-400 font-body max-w-2xl mx-auto leading-relaxed">
            Our editorial team handpicks the most exceptional aircraft detailing
            professionals based on quality, reputation, and client satisfaction.
          </p>
        </div>
      </section>

      <main className="flex-1">
        {/* ── Editor's Choice Winners ────────────────────── */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-heading text-2xl md:text-3xl text-noir-900 font-light tracking-wide">
              Editor&rsquo;s Choice Winners
            </h2>
            <div className="mt-4 mx-auto h-px w-16 bg-gold-500" />
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {editorsChoice.map((company) => (
              <article
                key={company.id}
                className="luxury-card bg-white border border-ivory-200 rounded-sm p-8 flex flex-col items-center text-center"
              >
                {/* Editor's Choice Badge */}
                <div className="mb-5">
                  <EditorsBadge size="md" />
                </div>

                {/* Trust Score */}
                <div className="mb-5">
                  <TrustScore score={company.trust_score} size="md" />
                </div>

                {/* Company Name */}
                <h3 className="font-heading text-xl text-noir-900 font-medium mb-2">
                  {company.name}
                </h3>

                {/* Description */}
                {company.description && (
                  <p className="font-body text-sm text-noir-600 leading-relaxed mb-6 flex-1">
                    {company.description}
                  </p>
                )}

                {/* View Profile */}
                <Link
                  href={`/company/${company.slug}`}
                  className="mt-auto inline-flex items-center justify-center bg-noir-900 hover:bg-noir-800 text-white px-6 py-2.5 text-xs tracking-widest uppercase font-body transition-colors rounded-sm"
                >
                  View Profile
                </Link>
              </article>
            ))}
          </div>
        </section>

        {/* ── Curated Collections ─────────────────────────── */}
        <section className="bg-noir-900">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <p className="text-gold-500 text-xs uppercase tracking-[0.2em] font-body mb-4">
                Browse By Theme
              </p>
              <h2 className="font-heading text-2xl md:text-3xl text-ivory-50 font-light tracking-wide">
                Curated Collections
              </h2>
              <div className="mt-4 mx-auto h-px w-16 bg-gold-500" />
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {COLLECTIONS.map((collection) => (
                <Link
                  key={collection.id}
                  href={`/collections/${collection.slug}`}
                  className="group block border border-noir-800 hover:border-gold-500 p-6 rounded-sm transition-colors"
                >
                  <h3 className="font-heading text-lg text-ivory-50 group-hover:text-gold-500 transition-colors mb-2">
                    {collection.name}
                  </h3>
                  <p className="font-body text-sm text-ivory-500 leading-relaxed line-clamp-2">
                    {collection.description}
                  </p>
                  <span className="mt-4 inline-block text-gold-500 text-xs uppercase tracking-widest font-body">
                    Explore Collection
                  </span>
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
