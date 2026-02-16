import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Company, Location, Listing } from "@vector/types";
import Header from "../../components/header";
import Footer from "../../components/footer";
import CompanyHero from "./components/company-hero";
import ServiceList from "./components/service-list";
import CompanyContact from "./components/company-contact";
import LeadForm from "./components/lead-form";

/* ──────────────────────────────────────────────────────────────────────────
   Seed data — used when Supabase is not configured
   ────────────────────────────────────────────────────────────────────────── */

const SEED_COMPANY: Company = {
  id: "00000000-0000-0000-0000-000000000001",
  name: "SunCoast Aviation Detail",
  slug: "suncoast-aviation-detail",
  description:
    "SunCoast Aviation Detail is a premium aircraft detailing company based in Miami, Florida. Specializing in private jets, turboprops, and helicopters, we offer comprehensive exterior wash, ceramic coating, paint correction, and interior restoration services. Our team uses only FAA-compliant products and follows strict quality protocols to keep your aircraft looking its best.",
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
};

const SEED_LOCATIONS: Location[] = [
  {
    id: "00000000-0000-0000-0000-000000000011",
    company_id: "00000000-0000-0000-0000-000000000001",
    name: "Main Hangar",
    address_line1: "1200 NW 42nd Ave",
    address_line2: null,
    city: "Miami",
    state: "FL",
    zip: "33126",
    country: "US",
    lat: 25.79,
    lng: -80.29,
    phone: "3055550100",
    is_headquarters: true,
    created_at: "2024-10-15T00:00:00Z",
    updated_at: "2024-10-15T00:00:00Z",
  },
];

const SEED_LISTINGS: Listing[] = [
  {
    id: "00000000-0000-0000-0000-000000000021",
    company_id: "00000000-0000-0000-0000-000000000001",
    location_id: null,
    title: "Exterior Wash & Detail",
    slug: "exterior-wash-detail",
    description:
      "Complete exterior wash including degreasing, brightwork, and hand dry.",
    category: "Exterior Wash",
    status: "active",
    featured: false,
    created_at: "2024-10-15T00:00:00Z",
    updated_at: "2024-10-15T00:00:00Z",
  },
  {
    id: "00000000-0000-0000-0000-000000000022",
    company_id: "00000000-0000-0000-0000-000000000001",
    location_id: null,
    title: "Ceramic Coating Application",
    slug: "ceramic-coating-application",
    description:
      "Multi-layer ceramic coating for lasting UV and corrosion protection.",
    category: "Ceramic Coating",
    status: "active",
    featured: false,
    created_at: "2024-11-01T00:00:00Z",
    updated_at: "2024-11-01T00:00:00Z",
  },
  {
    id: "00000000-0000-0000-0000-000000000023",
    company_id: "00000000-0000-0000-0000-000000000001",
    location_id: null,
    title: "Interior Deep Clean",
    slug: "interior-deep-clean",
    description:
      "Full interior restoration including leather conditioning and carpet shampooing.",
    category: "Interior Detailing",
    status: "active",
    featured: false,
    created_at: "2024-11-15T00:00:00Z",
    updated_at: "2024-11-15T00:00:00Z",
  },
  {
    id: "00000000-0000-0000-0000-000000000024",
    company_id: "00000000-0000-0000-0000-000000000001",
    location_id: null,
    title: "Paint Correction",
    slug: "paint-correction",
    description:
      "Multi-stage paint correction to remove swirl marks, scratches, and oxidation.",
    category: "Paint Correction",
    status: "active",
    featured: false,
    created_at: "2024-12-01T00:00:00Z",
    updated_at: "2024-12-01T00:00:00Z",
  },
];

/* ──────────────────────────────────────────────────────────────────────────
   Data fetching
   ────────────────────────────────────────────────────────────────────────── */

interface CompanyData {
  company: Company;
  locations: Location[];
  listings: Listing[];
}

async function getCompanyData(slug: string): Promise<CompanyData | null> {
  try {
    const {
      getCompanyBySlug,
      getLocationsByCompanyId,
      getListingsByCompanyId,
      createBrowserClient,
    } = await import("@vector/db");
    const client = createBrowserClient();

    const company = await getCompanyBySlug(client, slug);
    if (!company) return null;

    const [locations, listings] = await Promise.all([
      getLocationsByCompanyId(client, company.id),
      getListingsByCompanyId(client, company.id),
    ]);

    return { company, locations, listings };
  } catch {
    if (slug === SEED_COMPANY.slug) {
      return {
        company: SEED_COMPANY,
        locations: SEED_LOCATIONS,
        listings: SEED_LISTINGS,
      };
    }
    return null;
  }
}

/* ──────────────────────────────────────────────────────────────────────────
   Metadata
   ────────────────────────────────────────────────────────────────────────── */

interface CompanyPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: CompanyPageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await getCompanyData(slug);
  if (!data) return {};

  const { company } = data;

  return {
    title: `${company.name} | Aircraft Detailer Near Me`,
    description:
      company.description ??
      `Find information about ${company.name} on Aircraft Detailer Near Me.`,
    openGraph: {
      title: `${company.name} | Aircraft Detailer Near Me`,
      description:
        company.description ??
        `Find information about ${company.name} on Aircraft Detailer Near Me.`,
      type: "website",
    },
  };
}

/* ──────────────────────────────────────────────────────────────────────────
   Page component
   ────────────────────────────────────────────────────────────────────────── */

export default async function CompanyPage({ params }: CompanyPageProps) {
  const { slug } = await params;
  const data = await getCompanyData(slug);
  if (!data) notFound();

  const { company, locations, listings } = data;

  const hqLocation =
    locations.find((l) => l.is_headquarters) ?? locations[0] ?? null;
  const city = hqLocation?.city ?? "";
  const state = hqLocation?.state ?? "";

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
                  href="/search"
                  className="text-gray-500 transition-colors hover:text-brand-500"
                >
                  Search
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
                  {company.name}
                </span>
              </li>
            </ol>
          </div>
        </nav>

        {/* Hero */}
        <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
          <CompanyHero company={company} city={city} state={state} />
        </div>

        {/* Two-column layout */}
        <section className="py-10 sm:py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="lg:grid lg:grid-cols-3 lg:gap-8">
              {/* Left column (2/3) */}
              <div className="space-y-6 lg:col-span-2">
                {/* About */}
                <div className="rounded-xl border border-brand-100 bg-white p-6">
                  <h2 className="font-heading text-xl font-semibold text-brown-500">
                    About
                  </h2>
                  <p className="mt-3 font-body text-base leading-relaxed text-gray-600">
                    {company.description ??
                      `${company.name} is an aircraft detailing company listed in our directory. Contact them directly for more information about their services and availability.`}
                  </p>
                </div>

                {/* Services */}
                <ServiceList listings={listings} />

                {/* Compare & Quote CTA */}
                <div className="rounded-xl border border-brand-100 bg-brand-50 p-6">
                  <h2 className="font-heading text-xl font-semibold text-brown-500">
                    Compare & Quote
                  </h2>
                  <p className="mt-2 text-sm text-gray-600">
                    Want to compare {company.name} with other detailers? Use our
                    wizard to get quotes from multiple professionals at once.
                  </p>
                  <Link
                    href="/"
                    className="mt-4 inline-flex items-center rounded-xl bg-brand-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-600"
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
                        d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5"
                      />
                    </svg>
                    Compare Detailers & Get Quotes
                  </Link>
                </div>
              </div>

              {/* Right column (1/3) */}
              <div className="mt-8 space-y-6 lg:mt-0">
                <CompanyContact company={company} location={hqLocation} />
                <LeadForm
                  companyId={company.id}
                  companyName={company.name}
                />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
