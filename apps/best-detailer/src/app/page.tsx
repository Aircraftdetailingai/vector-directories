import type { Company } from "@vector/types";
import { COLLECTIONS } from "@/lib/collections";
import Header from "./components/header";
import Footer from "./components/footer";
import HomeContent from "./components/home-content";
import Link from "next/link";

/* ──────────────────────────────────────────────────────────────────────────
   Seed Data — 10 aircraft detailing companies for local development.
   ────────────────────────────────────────────────────────────────────────── */

const SEED_COMPANIES: Company[] = [
  {
    id: "00000000-0000-0000-0000-000000000201",
    name: "Prestige Aviation Detail",
    slug: "prestige-aviation-detail",
    description:
      "The gold standard in aircraft detailing. White-glove exterior polishing, ceramic nano-coatings, and bespoke interior restoration at Teterboro and Palm Beach International.",
    website: "https://example.com",
    phone: "2015550100",
    email: "info@prestigeaviation.com",
    logo_url: null,
    trust_score: 97,
    is_claimed: true,
    claimed_by: null,
    tier: "featured",
    created_at: "2024-06-01T00:00:00Z",
    updated_at: "2025-01-15T00:00:00Z",
  },
  {
    id: "00000000-0000-0000-0000-000000000202",
    name: "SkyShine Elite Detailing",
    slug: "skyshine-elite-detailing",
    description:
      "Premium aircraft detailing for private jets, turboprops, and helicopters. Serving the greater Dallas-Fort Worth area with FAA-compliant products and meticulous paint correction.",
    website: "https://example.com",
    phone: "2145550101",
    email: "info@skyshine.com",
    logo_url: null,
    trust_score: 94,
    is_claimed: true,
    claimed_by: null,
    tier: "featured",
    created_at: "2024-07-10T00:00:00Z",
    updated_at: "2025-01-10T00:00:00Z",
  },
  {
    id: "00000000-0000-0000-0000-000000000203",
    name: "AeroBright Finishers",
    slug: "aerobright-finishers",
    description:
      "Specializing in ceramic coating and paint correction for all aircraft types. FAA-compliant products and clean-room interior work in South Florida.",
    website: "https://example.com",
    phone: "3055550102",
    email: "info@aerobright.com",
    logo_url: null,
    trust_score: 91,
    is_claimed: true,
    claimed_by: null,
    tier: "featured",
    created_at: "2024-08-05T00:00:00Z",
    updated_at: "2025-01-08T00:00:00Z",
  },
  {
    id: "00000000-0000-0000-0000-000000000204",
    name: "Pacific Wings Detail Co.",
    slug: "pacific-wings-detail-co",
    description:
      "Full-service aircraft cleaning and detailing at Van Nuys and LAX. Known for celebrity and studio fleet accounts with eco-friendly waterless wash technology.",
    website: "https://example.com",
    phone: "3105550103",
    email: "info@pacificwings.com",
    logo_url: null,
    trust_score: 87,
    is_claimed: true,
    claimed_by: null,
    tier: "premium",
    created_at: "2024-09-12T00:00:00Z",
    updated_at: "2025-01-05T00:00:00Z",
  },
  {
    id: "00000000-0000-0000-0000-000000000205",
    name: "ClearCoat Aero",
    slug: "clearcoat-aero",
    description:
      "Full-service aircraft detailing, interior restoration, and brightwork polishing. Mobile service across Phoenix metro and Scottsdale airport corridor.",
    website: "https://example.com",
    phone: "4805550104",
    email: "info@clearcoataero.com",
    logo_url: null,
    trust_score: 82,
    is_claimed: true,
    claimed_by: null,
    tier: "enhanced",
    created_at: "2024-10-01T00:00:00Z",
    updated_at: "2025-01-02T00:00:00Z",
  },
  {
    id: "00000000-0000-0000-0000-000000000206",
    name: "Lone Star Aircraft Services",
    slug: "lone-star-aircraft-services",
    description:
      "Houston-based aircraft detailing specialists covering all major Texas FBOs. Expert paint protection, interior leather care, and corporate fleet programs.",
    website: "https://example.com",
    phone: "7135550105",
    email: "info@lonestaircraft.com",
    logo_url: null,
    trust_score: 78,
    is_claimed: false,
    claimed_by: null,
    tier: "enhanced",
    created_at: "2024-10-20T00:00:00Z",
    updated_at: "2024-12-28T00:00:00Z",
  },
  {
    id: "00000000-0000-0000-0000-000000000207",
    name: "Empire State Aviation Detail",
    slug: "empire-state-aviation-detail",
    description:
      "Serving the greater New York City area with expert aircraft detailing. Specializing in heavy jets and VVIP interiors at Westchester County Airport.",
    website: null,
    phone: "9145550106",
    email: "info@empirestateaviation.com",
    logo_url: null,
    trust_score: 74,
    is_claimed: true,
    claimed_by: null,
    tier: "enhanced",
    created_at: "2024-11-05T00:00:00Z",
    updated_at: "2024-12-20T00:00:00Z",
  },
  {
    id: "00000000-0000-0000-0000-000000000208",
    name: "Mile High Detailing",
    slug: "mile-high-detailing",
    description:
      "Colorado's premier aircraft appearance specialists. High-altitude UV protection, ceramic coatings, and comprehensive interior detailing.",
    website: null,
    phone: "3035550107",
    email: null,
    logo_url: null,
    trust_score: 70,
    is_claimed: false,
    claimed_by: null,
    tier: "basic",
    created_at: "2024-11-20T00:00:00Z",
    updated_at: "2024-12-15T00:00:00Z",
  },
  {
    id: "00000000-0000-0000-0000-000000000209",
    name: "JetGlow Services",
    slug: "jetglow-services",
    description:
      "Luxury interior and exterior detailing for corporate fleets based at Atlanta's DeKalb-Peachtree Airport. Specializing in Gulfstream and Bombardier.",
    website: null,
    phone: null,
    email: null,
    logo_url: null,
    trust_score: 65,
    is_claimed: true,
    claimed_by: null,
    tier: "basic",
    created_at: "2024-12-01T00:00:00Z",
    updated_at: "2024-12-10T00:00:00Z",
  },
  {
    id: "00000000-0000-0000-0000-000000000210",
    name: "PropWash Aviation Care",
    slug: "propwash-aviation-care",
    description:
      "Eco-friendly waterless wash and detail for general aviation aircraft. Serving community airports across the Pacific Northwest with mobile units.",
    website: null,
    phone: null,
    email: null,
    logo_url: null,
    trust_score: 58,
    is_claimed: false,
    claimed_by: null,
    tier: "basic",
    created_at: "2024-12-10T00:00:00Z",
    updated_at: "2024-12-10T00:00:00Z",
  },
];

/* ──────────────────────────────────────────────────────────────────────────
   Data Fetching
   ────────────────────────────────────────────────────────────────────────── */

async function getCompanies(): Promise<Company[]> {
  try {
    const { searchCompanies, createBrowserClient } = await import(
      "@vector/db"
    );
    const client = createBrowserClient();
    const result = await searchCompanies(client, {
      sort_by: "trust_score",
      sort_order: "desc",
      per_page: 20,
      page: 1,
    });
    if (result.companies.length > 0) {
      return result.companies;
    }
    return SEED_COMPANIES;
  } catch {
    return SEED_COMPANIES;
  }
}

/* ──────────────────────────────────────────────────────────────────────────
   Page Component
   ────────────────────────────────────────────────────────────────────────── */

export default async function HomePage() {
  const companies = await getCompanies();

  return (
    <div className="flex min-h-screen flex-col font-body">
      <Header />

      <main className="flex-1">
        {/* ── Hero ──────────────────────────────────────────── */}
        <section className="bg-noir-900 min-h-[70vh] flex items-center justify-center relative overflow-hidden">
          {/* Subtle background texture */}
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, #D4AF37 1px, transparent 0)",
            backgroundSize: "48px 48px",
          }} />

          <div className="relative mx-auto max-w-4xl px-4 py-24 sm:py-32 text-center">
            <h1 className="font-heading text-5xl md:text-7xl text-ivory-50 font-light leading-tight">
              The Definitive Guide to
              <br />
              Aircraft Detailing Excellence
            </h1>

            <div className="gold-divider mx-auto mt-8" />

            <p className="mt-8 text-ivory-300 text-lg sm:text-xl font-body max-w-2xl mx-auto leading-relaxed">
              Curated selections of the world&rsquo;s finest aircraft detailing
              professionals, chosen by our editorial team for uncompromising quality.
            </p>

            <Link
              href="#editors-choice"
              className="mt-10 inline-flex items-center bg-gold-500 hover:bg-gold-600 text-noir-900 px-8 py-3 text-sm font-semibold tracking-widest uppercase transition-colors"
            >
              Explore Our Selections
            </Link>
          </div>
        </section>

        {/* ── HomeContent (Editor's Choice, Collections, Recently Added) ── */}
        <div id="editors-choice">
          <HomeContent companies={companies} />
        </div>

        {/* ── CTA Section ──────────────────────────────────── */}
        <section className="bg-noir-900 py-20 sm:py-24 lg:py-28">
          <div className="mx-auto max-w-3xl px-4 text-center">
            <h2 className="font-heading text-4xl sm:text-5xl text-ivory-50 font-light">
              Are You Among the Best?
            </h2>
            <div className="gold-divider mx-auto mt-6" />
            <p className="mt-6 text-ivory-300 font-body max-w-xl mx-auto leading-relaxed">
              If your aircraft detailing business delivers exceptional results,
              we want to feature you. Claim your listing and join our curated
              directory of elite professionals.
            </p>
            <Link
              href="/claim"
              className="mt-10 inline-flex items-center bg-gold-500 hover:bg-gold-600 text-noir-900 px-8 py-3 text-sm font-semibold tracking-widest uppercase transition-colors"
            >
              Claim Your Listing
            </Link>
          </div>
        </section>

        {/* ── Collections Preview ──────────────────────────── */}
        <section className="bg-ivory-50 py-20 sm:py-24 lg:py-28">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="font-heading text-4xl sm:text-5xl text-noir-900 font-light">
                Curated Collections
              </h2>
              <div className="gold-divider mx-auto mt-6" />
              <p className="mt-6 text-noir-500 font-body max-w-xl mx-auto leading-relaxed">
                Browse our expertly assembled collections by specialty, region,
                and distinction.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {COLLECTIONS.map((collection) => (
                <Link
                  key={collection.id}
                  href={`/collections/${collection.slug}`}
                  className="group border border-ivory-200 bg-white p-6 transition-all duration-300 hover:border-gold-300 hover:shadow-lg"
                >
                  <h3 className="font-heading text-lg text-noir-900 group-hover:text-gold-700 transition-colors leading-snug">
                    {collection.name}
                  </h3>
                  <p className="mt-3 text-sm text-noir-500 leading-relaxed line-clamp-3">
                    {collection.description}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1 text-xs uppercase tracking-widest text-gold-500 font-body group-hover:translate-x-1 transition-transform">
                    View Collection &rarr;
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
