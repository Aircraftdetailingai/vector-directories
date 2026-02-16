import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { Company, Location, Listing, Tier } from "@vector/types";
import { hasTierFeature } from "@vector/utils";
import { Header } from "../../components/header";
import { Footer } from "../../components/footer";
import { getStateByCode, cityNameToSlug } from "@/lib/us-states";
import { getAirportsForCity } from "@/lib/city-airports";
import { ProfileBreadcrumb } from "./components/profile-breadcrumb";
import { CompanyHeader } from "./components/company-header";
import { ContactInfo } from "./components/contact-info";
import { ServicesList } from "./components/services-list";
import { AirportsServed } from "./components/airports-served";
import { Certifications } from "./components/certifications";
import { PhotoGallery } from "./components/photo-gallery";
import { LeadForm } from "./components/lead-form";
import { ClaimBanner } from "./components/claim-banner";

/* ──────────────────────────────────────────────────────────────────────────
   Seed data — used when Supabase is not configured (local dev)
   ────────────────────────────────────────────────────────────────────────── */

const SEED_COMPANY: Company = {
  id: "00000000-0000-0000-0000-000000000001",
  name: "SkyShine Aviation Detailing",
  slug: "skyshine-aviation-detailing",
  description:
    "SkyShine Aviation Detailing is a premium aircraft detailing company serving the greater Miami area since 2012. We specialize in private jets, turboprops, and helicopters, offering comprehensive exterior wash, ceramic coating, paint correction, and interior restoration services. Our team uses only FAA-compliant products and follows strict quality protocols. Whether you need a quick pre-flight wash or a complete detail for your corporate fleet, SkyShine delivers showroom-quality results with fast turnaround times.",
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
    lat: null,
    lng: null,
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
    description: "Complete exterior wash including degreasing, brightwork, and hand dry.",
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
    description: "Multi-layer ceramic coating for lasting UV and corrosion protection.",
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
    description: "Full interior restoration including leather conditioning and carpet shampooing.",
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
    description: "Multi-stage paint correction to remove swirl marks, scratches, and oxidation.",
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

const SEED_CERTIFICATIONS = ["Fully Insured", "Licensed", "Certified"];
const SEED_INSURANCE_RANGE = "$1M+";
const SEED_PHOTOS = [
  "https://placehold.co/800x600/1B4332/D8F3DC?text=Exterior+Detail",
  "https://placehold.co/800x600/1B4332/D8F3DC?text=Ceramic+Coating",
  "https://placehold.co/800x600/1B4332/D8F3DC?text=Interior+Restore",
  "https://placehold.co/800x600/1B4332/D8F3DC?text=Brightwork",
  "https://placehold.co/800x600/1B4332/D8F3DC?text=Fleet+Service",
  "https://placehold.co/800x600/1B4332/D8F3DC?text=Final+Result",
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
    // Fallback to seed data if slug matches
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
    title: `${company.name} | Aircraft Detailing Directory`,
    description:
      company.description ??
      `Find information about ${company.name} on Aircraft Detailing Directory.`,
    openGraph: {
      title: `${company.name} | Aircraft Detailing Directory`,
      description:
        company.description ??
        `Find information about ${company.name} on Aircraft Detailing Directory.`,
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

  // Derive display data
  const hqLocation = locations.find((l) => l.is_headquarters) ?? locations[0] ?? null;

  const stateInfo = hqLocation ? getStateByCode(hqLocation.state) : null;
  const cityName = hqLocation?.city ?? "";
  const citySlug = cityName ? cityNameToSlug(cityName) : "";

  // Services from listing categories (unique, sorted)
  const services = [
    ...new Set(
      listings
        .filter((l) => l.status === "active")
        .map((l) => l.category)
        .filter(Boolean),
    ),
  ].sort();

  // Airports from company location
  const airports = hqLocation
    ? getAirportsForCity(hqLocation.state, hqLocation.city)
    : [];

  // Certifications & photos (seed data for now — future: from DB)
  const certifications = SEED_CERTIFICATIONS;
  const insuranceRange = SEED_INSURANCE_RANGE;
  const photos = SEED_PHOTOS;

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Breadcrumb */}
        {stateInfo ? (
          <ProfileBreadcrumb
            stateName={stateInfo.name}
            stateSlug={stateInfo.slug}
            cityName={cityName}
            citySlug={citySlug}
            companyName={company.name}
          />
        ) : (
          <nav
            aria-label="Breadcrumb"
            className="border-b border-gray-100 bg-white"
          >
            <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
              <ol className="flex items-center gap-2 text-sm">
                <li>
                  <a
                    href="/"
                    className="text-gray-500 transition-colors hover:text-forest-700"
                  >
                    Home
                  </a>
                </li>
                <li aria-hidden="true" className="text-gray-300">
                  /
                </li>
                <li>
                  <span
                    className="font-medium text-forest-800"
                    aria-current="page"
                  >
                    {company.name}
                  </span>
                </li>
              </ol>
            </div>
          </nav>
        )}

        {/* Company header */}
        <CompanyHeader company={company} />

        {/* Claim banner for unclaimed listings */}
        {!company.is_claimed && <ClaimBanner companySlug={company.slug} />}

        {/* Two-column layout */}
        <section className="bg-gray-50 py-10 sm:py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="lg:grid lg:grid-cols-3 lg:gap-8">
              {/* Left column (2/3) */}
              <div className="space-y-6 lg:col-span-2">
                <ServicesList services={services} />
                <AirportsServed airports={airports} />
                <PhotoGallery
                  photos={photos}
                  tier={company.tier as Tier}
                  companyName={company.name}
                />
              </div>

              {/* Right column (1/3) */}
              <div className="mt-8 space-y-6 lg:mt-0">
                <ContactInfo company={company} location={hqLocation} />
                <Certifications
                  certifications={certifications}
                  insuranceRange={insuranceRange}
                />
                {hasTierFeature(company.tier as Tier, "leadCapture") && (
                  <LeadForm
                    companyId={company.id}
                    companyName={company.name}
                  />
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
