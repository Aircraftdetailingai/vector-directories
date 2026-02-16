import type { Metadata } from "next";
import Link from "next/link";
import type { Company, Location, Listing } from "@vector/types";
import Header from "../../components/header";
import Footer from "../../components/footer";
import CompanyHero from "./components/company-hero";
import ServiceTags from "./components/service-tags";
import CommunityReview from "./components/community-review";
import CompanyContact from "./components/company-contact";
import LeadForm from "./components/lead-form";

/* ── Seed fallback data ─────────────────────────────────────────────────── */

const seedCompany: Company = {
  id: "seed-company-001",
  name: "SkyShine Aviation Detailing",
  slug: "skyshine-aviation-detailing",
  description:
    "SkyShine Aviation Detailing is a premium aircraft care provider trusted by owners and operators across South Florida. We combine meticulous craftsmanship with aviation-grade products to deliver stunning results every time.",
  trust_score: 92,
  tier: "premium",
  is_claimed: true,
  website: "https://skyshinedetailing.com",
  phone: "3055551234",
  email: "hello@skyshinedetailing.com",
  logo_url: null,
  claimed_by: "user-seed-001",
  created_at: "2024-01-15T00:00:00Z",
  updated_at: "2024-06-01T00:00:00Z",
};

const seedLocations: Location[] = [
  {
    id: "seed-loc-001",
    company_id: "seed-company-001",
    name: "Miami Main Hangar",
    address_line1: "2400 NW 62nd St",
    address_line2: null,
    city: "Miami",
    state: "FL",
    zip: "33147",
    country: "US",
    lat: 25.8243,
    lng: -80.2706,
    phone: "3055551234",
    is_headquarters: true,
    created_at: "2024-01-15T00:00:00Z",
    updated_at: "2024-06-01T00:00:00Z",
  },
];

const seedListings: Listing[] = [
  { id: "seed-l-1", company_id: "seed-company-001", title: "Ceramic Coating", slug: "ceramic-coating", description: "Long-lasting ceramic paint protection for aircraft.", category: "ceramic-coating", status: "active", featured: false, location_id: null, created_at: "2024-01-15T00:00:00Z", updated_at: "2024-06-01T00:00:00Z" },
  { id: "seed-l-2", company_id: "seed-company-001", title: "Interior Detail", slug: "interior-detail", description: "Complete cabin interior deep cleaning.", category: "interior-detailing", status: "active", featured: false, location_id: null, created_at: "2024-01-15T00:00:00Z", updated_at: "2024-06-01T00:00:00Z" },
  { id: "seed-l-3", company_id: "seed-company-001", title: "Paint Correction", slug: "paint-correction", description: "Remove oxidation and restore original paint finish.", category: "paint-correction", status: "active", featured: false, location_id: null, created_at: "2024-01-15T00:00:00Z", updated_at: "2024-06-01T00:00:00Z" },
  { id: "seed-l-4", company_id: "seed-company-001", title: "Brightwork", slug: "brightwork", description: "Mirror finish polishing for all metal surfaces.", category: "brightwork-polish", status: "active", featured: false, location_id: null, created_at: "2024-01-15T00:00:00Z", updated_at: "2024-06-01T00:00:00Z" },
  { id: "seed-l-5", company_id: "seed-company-001", title: "Exterior Wash", slug: "exterior-wash", description: "Thorough hand wash using aviation-safe products.", category: "exterior-wash", status: "active", featured: false, location_id: null, created_at: "2024-01-15T00:00:00Z", updated_at: "2024-06-01T00:00:00Z" },
];

/* ── Metadata ────────────────────────────────────────────────────────────── */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  let company: Company | null = null;
  try {
    const { createServerClient, getCompanyBySlug } = await import("@vector/db");
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    const supabase = createServerClient(cookieStore);
    company = await getCompanyBySlug(supabase, slug);
  } catch {
    // fall through to seed
  }

  const name = company?.name ?? seedCompany.name;
  const description =
    company?.description ?? seedCompany.description ?? "";

  return {
    title: `${name} | Aviation Detailing Hub`,
    description: description.slice(0, 160),
    openGraph: {
      title: `${name} | Aviation Detailing Hub`,
      description: description.slice(0, 160),
    },
  };
}

/* ── Page ─────────────────────────────────────────────────────────────────── */

export default async function CompanyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let company: Company = seedCompany;
  let locations: Location[] = seedLocations;
  let listings: Listing[] = seedListings;

  try {
    const { createServerClient, getCompanyBySlug, getLocationsByCompanyId, getListingsByCompanyId } =
      await import("@vector/db");
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    const supabase = createServerClient(cookieStore);

    const fetched = await getCompanyBySlug(supabase, slug);
    if (fetched) {
      company = fetched;
      const [locs, lists] = await Promise.all([
        getLocationsByCompanyId(supabase, fetched.id),
        getListingsByCompanyId(supabase, fetched.id),
      ]);
      locations = locs;
      listings = lists;
    }
  } catch {
    // use seed fallback
  }

  const headquarter = locations.find((l) => l.is_headquarters) ?? locations[0];

  return (
    <div className="min-h-screen bg-cream-50">
      <Header />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm font-body text-gray-500" aria-label="Breadcrumb">
          <ol className="flex items-center gap-1.5 flex-wrap">
            <li>
              <Link href="/" className="hover:text-teal-600 transition-colors">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href="/services" className="hover:text-teal-600 transition-colors">
                Services
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-teal-700 font-medium">{company.name}</li>
          </ol>
        </nav>

        {/* Hero */}
        <CompanyHero company={company} isClaimed={company.is_claimed} />

        {/* Two-column layout */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column — 2/3 */}
          <div className="lg:col-span-2 space-y-8">
            <ServiceTags listings={listings} />
            <CommunityReview company={company} />
          </div>

          {/* Right column — 1/3 */}
          <div className="space-y-8">
            <CompanyContact
              company={company}
              location={headquarter ?? null}
            />
            <LeadForm companyId={company.id} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
