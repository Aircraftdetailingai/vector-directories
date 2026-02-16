import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Company, Location, Listing } from "@vector/types";
import Header from "../../components/header";
import Footer from "../../components/footer";
import { CompanyHero } from "./components/company-hero";
import { CompanyDetails } from "./components/company-details";
import { CompanyContact } from "./components/company-contact";
import { CompanyMap } from "./components/company-map";
import { LeadForm } from "./components/lead-form";

/* ──────────────────────────────────────────────────────────────────────────
   Seed data — used when Supabase is not configured (local dev)
   ────────────────────────────────────────────────────────────────────────── */

const SEED_COMPANY: Company = {
  id: "00000000-0000-0000-0000-000000000001",
  name: "SkyShine Aviation Detailing",
  slug: "skyshine-aviation-detailing",
  description:
    "SkyShine Aviation Detailing is a premium aircraft detailing company serving the greater Miami area since 2012. We specialize in private jets, turboprops, and helicopters, offering comprehensive exterior wash, ceramic coating, paint correction, and interior restoration services. Our team uses only FAA-compliant products and follows strict quality protocols.",
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
};

const SEED_LOCATIONS: Location[] = [
  {
    id: "00000000-0000-0000-0000-000000000011",
    company_id: "00000000-0000-0000-0000-000000000001",
    name: "Main Hangar",
    address_line1: "1200 NW 42nd Ave",
    address_line2: "Hangar 7",
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
    location_id: "00000000-0000-0000-0000-000000000011",
    title: "Exterior Wash & Detail",
    slug: "exterior-wash-detail",
    description:
      "Complete exterior wash including degreasing, brightwork, and hand dry.",
    category: "Exterior Wash",
    status: "active",
    featured: true,
    created_at: "2024-10-15T00:00:00Z",
    updated_at: "2024-10-15T00:00:00Z",
  },
  {
    id: "00000000-0000-0000-0000-000000000022",
    company_id: "00000000-0000-0000-0000-000000000001",
    location_id: "00000000-0000-0000-0000-000000000011",
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
    location_id: "00000000-0000-0000-0000-000000000011",
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
  {
    id: "00000000-0000-0000-0000-000000000025",
    company_id: "00000000-0000-0000-0000-000000000001",
    location_id: null,
    title: "Brightwork Polishing",
    slug: "brightwork-polishing",
    description: "Chrome and metal brightwork restoration and polishing.",
    category: "Brightwork",
    status: "active",
    featured: false,
    created_at: "2025-01-05T00:00:00Z",
    updated_at: "2025-01-05T00:00:00Z",
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
    title: `${company.name} | Aircraft Detailing Near Me`,
    description:
      company.description ??
      `Find information about ${company.name} on Aircraft Detailing Near Me.`,
    openGraph: {
      title: `${company.name} | Aircraft Detailing Near Me`,
      description:
        company.description ??
        `Find information about ${company.name} on Aircraft Detailing Near Me.`,
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
                <span
                  className="font-medium text-gray-900"
                  aria-current="page"
                >
                  {company.name}
                </span>
              </li>
            </ol>
          </div>
        </nav>

        {/* Hero */}
        <CompanyHero company={company} city={city} state={state} />

        {/* Two-column layout */}
        <section className="bg-gray-50 py-10 sm:py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="lg:grid lg:grid-cols-3 lg:gap-8">
              {/* Left column (2/3) */}
              <div className="space-y-6 lg:col-span-2">
                <CompanyDetails company={company} listings={listings} />
              </div>

              {/* Right column (1/3) */}
              <div className="mt-8 space-y-6 lg:mt-0">
                <CompanyContact company={company} location={hqLocation} />
                <CompanyMap
                  location={hqLocation}
                  companyName={company.name}
                />
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
