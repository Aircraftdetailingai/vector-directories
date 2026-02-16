import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "../../components/header";
import Footer from "../../components/footer";
import { getRegionBySlug } from "@/lib/regions";
import { getStateByCode } from "@/lib/us-states";
import {
  getAuthorityLabel,
  getAuthorityTier,
  getAuthorityBadgeClasses,
} from "@/lib/authority-score";

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

/* ── Seed Companies ────────────────────────────────────────────────────── */

function getSeedCompanies(regionSlug: string): Company[] {
  const regionSeeds: Record<string, Company[]> = {
    northeast: [
      { id: "seed-ne-1", name: "Teterboro Elite Detailing", slug: "teterboro-elite-detailing", description: "Premium aircraft detailing at Teterboro Airport serving New York's most discerning aircraft owners.", trust_score: 96, tier: "featured", is_claimed: true, website: null, phone: null, email: null, logo_url: null, claimed_by: null, created_at: "2024-01-01T00:00:00Z", updated_at: "2024-12-01T00:00:00Z" },
      { id: "seed-ne-2", name: "Boston AeroShine", slug: "boston-aeroshine", description: "Full-service aircraft care at Boston Logan and Hanscom Field.", trust_score: 91, tier: "premium", is_claimed: true, website: null, phone: null, email: null, logo_url: null, claimed_by: null, created_at: "2024-02-01T00:00:00Z", updated_at: "2024-12-01T00:00:00Z" },
      { id: "seed-ne-3", name: "JetClean Northeast", slug: "jetclean-northeast", description: "Specialized in corporate jet detailing across the tri-state area.", trust_score: 85, tier: "enhanced", is_claimed: true, website: null, phone: null, email: null, logo_url: null, claimed_by: null, created_at: "2024-03-01T00:00:00Z", updated_at: "2024-12-01T00:00:00Z" },
      { id: "seed-ne-4", name: "PennAviation Detail", slug: "pennaviation-detail", description: "Philadelphia-based aircraft detailing with FAA-compliant processes.", trust_score: 78, tier: "enhanced", is_claimed: false, website: null, phone: null, email: null, logo_url: null, claimed_by: null, created_at: "2024-04-01T00:00:00Z", updated_at: "2024-12-01T00:00:00Z" },
      { id: "seed-ne-5", name: "Atlantic Detail Co.", slug: "atlantic-detail-co", description: "Serving general aviation at airports throughout New England.", trust_score: 72, tier: "basic", is_claimed: false, website: null, phone: null, email: null, logo_url: null, claimed_by: null, created_at: "2024-05-01T00:00:00Z", updated_at: "2024-12-01T00:00:00Z" },
    ],
    southeast: [
      { id: "seed-se-1", name: "SkyShine Aviation Detailing", slug: "skyshine-aviation-detailing", description: "Premier aircraft care provider specializing in comprehensive detailing for private and corporate aircraft.", trust_score: 94, tier: "premium", is_claimed: true, website: null, phone: null, email: null, logo_url: null, claimed_by: null, created_at: "2024-01-15T00:00:00Z", updated_at: "2024-12-01T00:00:00Z" },
      { id: "seed-se-2", name: "Peachtree Aviation Shine", slug: "peachtree-aviation-shine", description: "Atlanta's top-rated aircraft detailing service at DeKalb-Peachtree.", trust_score: 89, tier: "premium", is_claimed: true, website: null, phone: null, email: null, logo_url: null, claimed_by: null, created_at: "2024-02-01T00:00:00Z", updated_at: "2024-12-01T00:00:00Z" },
      { id: "seed-se-3", name: "Gulf Coast AeroCare", slug: "gulf-coast-aerocare", description: "Specializing in salt-air protection and detailing along the Gulf Coast.", trust_score: 82, tier: "enhanced", is_claimed: true, website: null, phone: null, email: null, logo_url: null, claimed_by: null, created_at: "2024-03-01T00:00:00Z", updated_at: "2024-12-01T00:00:00Z" },
      { id: "seed-se-4", name: "Carolina AeroWash", slug: "carolina-aerowash", description: "Full-service aircraft cleaning and protection in Charlotte.", trust_score: 75, tier: "enhanced", is_claimed: false, website: null, phone: null, email: null, logo_url: null, claimed_by: null, created_at: "2024-04-01T00:00:00Z", updated_at: "2024-12-01T00:00:00Z" },
      { id: "seed-se-5", name: "Sunshine State Detailing", slug: "sunshine-state-detailing", description: "UV protection specialists serving Florida's busiest private airports.", trust_score: 68, tier: "basic", is_claimed: false, website: null, phone: null, email: null, logo_url: null, claimed_by: null, created_at: "2024-05-01T00:00:00Z", updated_at: "2024-12-01T00:00:00Z" },
    ],
    midwest: [
      { id: "seed-mw-1", name: "Midway Aviation Detail", slug: "midway-aviation-detail", description: "Chicago's premier aircraft detailing service for corporate and private fleets.", trust_score: 92, tier: "premium", is_claimed: true, website: null, phone: null, email: null, logo_url: null, claimed_by: null, created_at: "2024-01-01T00:00:00Z", updated_at: "2024-12-01T00:00:00Z" },
      { id: "seed-mw-2", name: "Great Lakes AeroShine", slug: "great-lakes-aeroshine", description: "Serving the Great Lakes region with premium aircraft care.", trust_score: 86, tier: "enhanced", is_claimed: true, website: null, phone: null, email: null, logo_url: null, claimed_by: null, created_at: "2024-02-01T00:00:00Z", updated_at: "2024-12-01T00:00:00Z" },
      { id: "seed-mw-3", name: "Twin Cities AeroCare", slug: "twin-cities-aerocare", description: "Minneapolis-based detailing with cold-weather expertise.", trust_score: 79, tier: "enhanced", is_claimed: true, website: null, phone: null, email: null, logo_url: null, claimed_by: null, created_at: "2024-03-01T00:00:00Z", updated_at: "2024-12-01T00:00:00Z" },
      { id: "seed-mw-4", name: "Heartland Jet Wash", slug: "heartland-jet-wash", description: "Reliable aircraft cleaning services across the heartland.", trust_score: 71, tier: "basic", is_claimed: false, website: null, phone: null, email: null, logo_url: null, claimed_by: null, created_at: "2024-04-01T00:00:00Z", updated_at: "2024-12-01T00:00:00Z" },
      { id: "seed-mw-5", name: "Buckeye Aviation Polish", slug: "buckeye-aviation-polish", description: "Columbus-based detailing for corporate aviation.", trust_score: 65, tier: "basic", is_claimed: false, website: null, phone: null, email: null, logo_url: null, claimed_by: null, created_at: "2024-05-01T00:00:00Z", updated_at: "2024-12-01T00:00:00Z" },
    ],
    southwest: [
      { id: "seed-sw-1", name: "Lone Star Aviation Detail", slug: "lone-star-aviation-detail", description: "Dallas-Fort Worth's top-rated aircraft detailing provider.", trust_score: 93, tier: "premium", is_claimed: true, website: null, phone: null, email: null, logo_url: null, claimed_by: null, created_at: "2024-01-01T00:00:00Z", updated_at: "2024-12-01T00:00:00Z" },
      { id: "seed-sw-2", name: "Desert Wings Detailing", slug: "desert-wings-detailing", description: "Phoenix-based specialists in UV damage prevention and desert climate care.", trust_score: 88, tier: "premium", is_claimed: true, website: null, phone: null, email: null, logo_url: null, claimed_by: null, created_at: "2024-02-01T00:00:00Z", updated_at: "2024-12-01T00:00:00Z" },
      { id: "seed-sw-3", name: "Houston AeroGloss", slug: "houston-aerogloss", description: "Comprehensive aircraft care at Houston's premier FBOs.", trust_score: 81, tier: "enhanced", is_claimed: true, website: null, phone: null, email: null, logo_url: null, claimed_by: null, created_at: "2024-03-01T00:00:00Z", updated_at: "2024-12-01T00:00:00Z" },
      { id: "seed-sw-4", name: "Red Rock Aviation Care", slug: "red-rock-aviation-care", description: "New Mexico's trusted aircraft detailing service.", trust_score: 74, tier: "enhanced", is_claimed: false, website: null, phone: null, email: null, logo_url: null, claimed_by: null, created_at: "2024-04-01T00:00:00Z", updated_at: "2024-12-01T00:00:00Z" },
      { id: "seed-sw-5", name: "Sooner Sky Detail", slug: "sooner-sky-detail", description: "Oklahoma City aircraft detailing for general aviation.", trust_score: 62, tier: "basic", is_claimed: false, website: null, phone: null, email: null, logo_url: null, claimed_by: null, created_at: "2024-05-01T00:00:00Z", updated_at: "2024-12-01T00:00:00Z" },
    ],
    "mountain-west": [
      { id: "seed-mtw-1", name: "Aspen AeroLux Detailing", slug: "aspen-aerolux-detailing", description: "Ultra-premium detailing for elite clientele at Aspen-Pitkin Airport.", trust_score: 97, tier: "featured", is_claimed: true, website: null, phone: null, email: null, logo_url: null, claimed_by: null, created_at: "2024-01-01T00:00:00Z", updated_at: "2024-12-01T00:00:00Z" },
      { id: "seed-mtw-2", name: "Rocky Mountain AeroShine", slug: "rocky-mountain-aeroshine", description: "Denver-based aircraft care with high-altitude expertise.", trust_score: 87, tier: "premium", is_claimed: true, website: null, phone: null, email: null, logo_url: null, claimed_by: null, created_at: "2024-02-01T00:00:00Z", updated_at: "2024-12-01T00:00:00Z" },
      { id: "seed-mtw-3", name: "Sun Valley Air Detail", slug: "sun-valley-air-detail", description: "Premium aircraft care serving Sun Valley and Boise.", trust_score: 80, tier: "enhanced", is_claimed: true, website: null, phone: null, email: null, logo_url: null, claimed_by: null, created_at: "2024-03-01T00:00:00Z", updated_at: "2024-12-01T00:00:00Z" },
      { id: "seed-mtw-4", name: "Silver State Aviation Care", slug: "silver-state-aviation-care", description: "Las Vegas-based aircraft detailing for the entertainment industry.", trust_score: 76, tier: "enhanced", is_claimed: false, website: null, phone: null, email: null, logo_url: null, claimed_by: null, created_at: "2024-04-01T00:00:00Z", updated_at: "2024-12-01T00:00:00Z" },
      { id: "seed-mtw-5", name: "Beehive AeroWash", slug: "beehive-aerowash", description: "Salt Lake City aircraft cleaning and protection services.", trust_score: 67, tier: "basic", is_claimed: false, website: null, phone: null, email: null, logo_url: null, claimed_by: null, created_at: "2024-05-01T00:00:00Z", updated_at: "2024-12-01T00:00:00Z" },
    ],
    pacific: [
      { id: "seed-pac-1", name: "Van Nuys Prestige Detail", slug: "van-nuys-prestige-detail", description: "Hollywood's go-to aircraft detailing at Van Nuys Airport.", trust_score: 95, tier: "featured", is_claimed: true, website: null, phone: null, email: null, logo_url: null, claimed_by: null, created_at: "2024-01-01T00:00:00Z", updated_at: "2024-12-01T00:00:00Z" },
      { id: "seed-pac-2", name: "Pacific NW AeroShine", slug: "pacific-nw-aeroshine", description: "Seattle-based premium aircraft care at Boeing Field and beyond.", trust_score: 90, tier: "premium", is_claimed: true, website: null, phone: null, email: null, logo_url: null, claimed_by: null, created_at: "2024-02-01T00:00:00Z", updated_at: "2024-12-01T00:00:00Z" },
      { id: "seed-pac-3", name: "Bay Area Aviation Detail", slug: "bay-area-aviation-detail", description: "Tech-industry precision meets aircraft care in the San Francisco Bay Area.", trust_score: 84, tier: "enhanced", is_claimed: true, website: null, phone: null, email: null, logo_url: null, claimed_by: null, created_at: "2024-03-01T00:00:00Z", updated_at: "2024-12-01T00:00:00Z" },
      { id: "seed-pac-4", name: "Aloha AeroCare", slug: "aloha-aerocare", description: "Hawaii's premier aircraft detailing, specializing in salt-air protection.", trust_score: 77, tier: "enhanced", is_claimed: false, website: null, phone: null, email: null, logo_url: null, claimed_by: null, created_at: "2024-04-01T00:00:00Z", updated_at: "2024-12-01T00:00:00Z" },
      { id: "seed-pac-5", name: "Portland Jet Wash", slug: "portland-jet-wash", description: "Eco-friendly aircraft detailing in the Pacific Northwest.", trust_score: 70, tier: "basic", is_claimed: false, website: null, phone: null, email: null, logo_url: null, claimed_by: null, created_at: "2024-05-01T00:00:00Z", updated_at: "2024-12-01T00:00:00Z" },
    ],
  };

  return regionSeeds[regionSlug] ?? regionSeeds.southeast;
}

/* ── Data Fetching ─────────────────────────────────────────────────────── */

async function getRegionCompanies(regionSlug: string): Promise<Company[]> {
  const region = getRegionBySlug(regionSlug);
  if (!region) return [];

  try {
    const { createServerClient, searchCompanies } = await import("@vector/db");
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    const supabase = createServerClient(cookieStore);

    // Search for companies in each state of the region, then merge
    const allCompanies: Company[] = [];

    for (const stateCode of region.states) {
      const result = await searchCompanies(supabase, {
        state: stateCode,
        sort_by: "trust_score",
        sort_order: "desc",
        page: 1,
        per_page: 50,
      });
      allCompanies.push(...(result.companies as unknown as Company[]));
    }

    // Deduplicate by id and sort by trust_score desc
    const seen = new Set<string>();
    const unique = allCompanies.filter((c) => {
      if (seen.has(c.id)) return false;
      seen.add(c.id);
      return true;
    });

    return unique.sort(
      (a, b) => (b.trust_score ?? 0) - (a.trust_score ?? 0),
    );
  } catch {
    return getSeedCompanies(regionSlug);
  }
}

/* ── Authority Score Mini Badge ────────────────────────────────────────── */

function ScoreBadge({ score }: { score: number | null }) {
  const s = score ?? 0;
  const tier = getAuthorityTier(score);
  const isTop = tier === "elite" || tier === "expert";

  return (
    <div
      className={`flex h-12 w-12 items-center justify-center rounded-full border-2 text-sm font-bold font-heading ${
        isTop
          ? "border-gold-400 bg-gold-50 text-gold-700"
          : "border-navy-300 bg-navy-50 text-navy-700"
      }`}
    >
      {s}
    </div>
  );
}

/* ── Metadata ──────────────────────────────────────────────────────────── */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ region: string }>;
}): Promise<Metadata> {
  const { region: regionSlug } = await params;
  const region = getRegionBySlug(regionSlug);

  if (!region) {
    return { title: "Region Not Found | Aircraft Detailing Authority" };
  }

  return {
    title: `${region.name} Aircraft Detailing Rankings | Aircraft Detailing Authority`,
    description: `Top-rated aircraft detailing companies in the ${region.name} region. Authority Score rankings, expert reviews, and contact information for ${region.states.length} states.`,
  };
}

/* ── Page ───────────────────────────────────────────────────────────────── */

export default async function RegionPage({
  params,
}: {
  params: Promise<{ region: string }>;
}) {
  const { region: regionSlug } = await params;
  const region = getRegionBySlug(regionSlug);

  if (!region) notFound();

  const companies = await getRegionCompanies(regionSlug);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      {/* ── Breadcrumb ──────────────────────────────────────── */}
      <nav className="bg-navy-50 border-b border-navy-100">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
          <ol className="flex items-center gap-2 text-sm font-body text-navy-500">
            <li>
              <Link href="/" className="hover:text-navy-800 transition-colors">
                Home
              </Link>
            </li>
            <li aria-hidden="true" className="text-navy-300">
              /
            </li>
            <li>
              <Link
                href="/regions"
                className="hover:text-navy-800 transition-colors"
              >
                Regions
              </Link>
            </li>
            <li aria-hidden="true" className="text-navy-300">
              /
            </li>
            <li className="text-navy-800 font-medium">{region.name}</li>
          </ol>
        </div>
      </nav>

      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="bg-navy-900">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 text-center">
          <p className="text-navy-300 text-sm uppercase tracking-widest mb-3 font-body">
            Regional Rankings
          </p>
          <h1 className="text-gold-400 font-heading text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            {region.name}
          </h1>
          <p className="text-navy-200 text-lg max-w-2xl mx-auto font-body leading-relaxed">
            {region.description}
          </p>
          {/* State pills */}
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {region.states.map((code) => {
              const state = getStateByCode(code);
              return (
                <span
                  key={code}
                  className="inline-flex items-center rounded-full bg-navy-800 px-3 py-1 text-xs font-medium text-navy-200"
                >
                  {state?.name ?? code}
                </span>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Company Rankings ──────────────────────────────── */}
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <h2 className="font-heading text-2xl font-bold text-navy-900 mb-1">
            Top Providers
          </h2>
          <div className="h-0.5 w-16 bg-gold-500 mb-8" />

          {companies.length === 0 ? (
            <div className="text-center py-16">
              <svg
                className="mx-auto h-12 w-12 text-gold-400 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                />
              </svg>
              <p className="text-navy-500 font-body">
                No companies found in this region yet.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {companies.map((company, index) => {
                const label = getAuthorityLabel(company.trust_score);
                const badgeClasses = getAuthorityBadgeClasses(
                  company.trust_score,
                );

                return (
                  <Link
                    key={company.id}
                    href={`/company/${company.slug}`}
                    className="group block"
                  >
                    <article className="flex items-center gap-5 rounded-xl border border-navy-100 bg-white p-5 shadow-sm hover:shadow-md hover:border-navy-200 transition-all">
                      {/* Rank number */}
                      <div className="hidden sm:flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-navy-50 text-sm font-bold text-navy-400 font-heading">
                        {index + 1}
                      </div>

                      {/* Score badge */}
                      <div className="shrink-0">
                        <ScoreBadge score={company.trust_score} />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-heading text-lg font-bold text-navy-900 group-hover:text-gold-600 transition-colors">
                            {company.name}
                          </h3>
                          <span
                            className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ring-1 ${badgeClasses}`}
                          >
                            {label}
                          </span>
                        </div>
                        {company.description && (
                          <p className="mt-1 text-sm text-navy-500 font-body line-clamp-2">
                            {company.description}
                          </p>
                        )}
                      </div>

                      {/* Arrow */}
                      <svg
                        className="h-5 w-5 shrink-0 text-navy-300 group-hover:text-gold-500 transition-colors"
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
                    </article>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
