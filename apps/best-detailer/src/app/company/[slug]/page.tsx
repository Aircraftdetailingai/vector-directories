import type { Metadata } from "next";
import Header from "../../components/header";
import Footer from "../../components/footer";
import CompanyHero from "./components/company-hero";
import ServiceShowcase from "./components/service-showcase";
import CompanyContact from "./components/company-contact";
import LeadForm from "./components/lead-form";

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

interface Location {
  id: string;
  company_id: string;
  name: string;
  address_line1: string;
  address_line2: string | null;
  city: string;
  state: string;
  zip: string;
  country: string;
  lat: number | null;
  lng: number | null;
  phone: string | null;
  is_headquarters: boolean;
  created_at: string;
  updated_at: string;
}

interface Listing {
  id: string;
  company_id: string;
  location_id: string | null;
  title: string;
  slug: string;
  description: string | null;
  category: string;
  status: string;
  featured: boolean;
  created_at: string;
  updated_at: string;
}

/* ── Seed Data ─────────────────────────────────────────────────────────── */

const SEED_COMPANY: Company = {
  id: "seed-company-001",
  name: "Prestige Aviation Detail",
  slug: "prestige-aviation-detail",
  description:
    "Prestige Aviation Detail is the gold standard in luxury aircraft care. Specializing in bespoke exterior and interior detailing for private jets, turboprops, and helicopters, our master craftsmen deliver museum-quality finishes that protect and enhance your investment. Trusted by discerning aircraft owners across the Southeast.",
  trust_score: 94,
  tier: "featured",
  is_claimed: true,
  website: "https://prestigeaviationdetail.com",
  phone: "5613209876",
  email: "concierge@prestigeaviationdetail.com",
  logo_url: null,
  claimed_by: "seed-user-001",
  created_at: "2024-01-10T00:00:00Z",
  updated_at: "2024-12-15T00:00:00Z",
};

const SEED_LOCATIONS: Location[] = [
  {
    id: "seed-loc-001",
    company_id: "seed-company-001",
    name: "Palm Beach Headquarters",
    address_line1: "3800 Southern Blvd",
    address_line2: null,
    city: "West Palm Beach",
    state: "FL",
    zip: "33406",
    country: "US",
    lat: 26.6834,
    lng: -80.0956,
    phone: "5613209876",
    is_headquarters: true,
    created_at: "2024-01-10T00:00:00Z",
    updated_at: "2024-12-15T00:00:00Z",
  },
];

const SEED_LISTINGS: Listing[] = [
  {
    id: "seed-list-001",
    company_id: "seed-company-001",
    location_id: null,
    title: "Full Exterior Detail",
    slug: "full-exterior-detail",
    description:
      "Comprehensive exterior wash, clay bar treatment, polish, and sealant for a flawless finish.",
    category: "exterior",
    status: "active",
    featured: false,
    created_at: "2024-02-01T00:00:00Z",
    updated_at: "2024-02-01T00:00:00Z",
  },
  {
    id: "seed-list-002",
    company_id: "seed-company-001",
    location_id: null,
    title: "Luxury Interior Restoration",
    slug: "luxury-interior-restoration",
    description:
      "Deep cleaning and conditioning of leather, carpet, and cockpit surfaces to showroom condition.",
    category: "interior",
    status: "active",
    featured: false,
    created_at: "2024-02-15T00:00:00Z",
    updated_at: "2024-02-15T00:00:00Z",
  },
  {
    id: "seed-list-003",
    company_id: "seed-company-001",
    location_id: null,
    title: "Ceramic Coating Application",
    slug: "ceramic-coating-application",
    description:
      "Aviation-grade ceramic coating delivering long-lasting protection and mirror-like gloss.",
    category: "protection",
    status: "active",
    featured: false,
    created_at: "2024-03-01T00:00:00Z",
    updated_at: "2024-03-01T00:00:00Z",
  },
  {
    id: "seed-list-004",
    company_id: "seed-company-001",
    location_id: null,
    title: "Paint Correction & Restoration",
    slug: "paint-correction-restoration",
    description:
      "Multi-stage paint correction to eliminate oxidation, swirl marks, and surface imperfections.",
    category: "paint",
    status: "active",
    featured: false,
    created_at: "2024-03-20T00:00:00Z",
    updated_at: "2024-03-20T00:00:00Z",
  },
];

/* ── Data Fetching ─────────────────────────────────────────────────────── */

async function getCompanyData(slug: string) {
  try {
    const { createBrowserClient, getCompanyBySlug, getLocationsByCompanyId, getListingsByCompanyId } =
      await import("@vector/db");
    const supabase = createBrowserClient();

    const company = await getCompanyBySlug(supabase, slug);
    if (!company) return null;

    const [locations, listings] = await Promise.all([
      getLocationsByCompanyId(supabase, company.id),
      getListingsByCompanyId(supabase, company.id),
    ]);

    return {
      company: company as unknown as Company,
      locations: locations as unknown as Location[],
      listings: listings as unknown as Listing[],
    };
  } catch {
    // Seed fallback
    if (slug === SEED_COMPANY.slug) {
      return {
        company: SEED_COMPANY,
        locations: SEED_LOCATIONS,
        listings: SEED_LISTINGS,
      };
    }
    return {
      company: {
        ...SEED_COMPANY,
        slug,
        name: slug
          .split("-")
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" "),
      },
      locations: SEED_LOCATIONS,
      listings: SEED_LISTINGS,
    };
  }
}

/* ── Metadata ──────────────────────────────────────────────────────────── */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = await getCompanyData(slug);
  const name = data?.company.name ?? "Company Profile";
  const desc =
    data?.company.description ??
    `Luxury profile, trust score, and services for ${name}.`;

  return {
    title: `${name} | Best Aircraft Detailer`,
    description:
      typeof desc === "string" && desc.length > 160
        ? desc.slice(0, 157) + "..."
        : desc,
    openGraph: {
      title: `${name} — Best Aircraft Detailer`,
      description: `Trust score, services, and contact for ${name}.`,
    },
  };
}

/* ── Page ───────────────────────────────────────────────────────────────── */

export default async function CompanyProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await getCompanyData(slug);

  if (!data) {
    const { notFound } = await import("next/navigation");
    return notFound();
  }

  const { company, locations, listings } = data;

  return (
    <div className="min-h-screen flex flex-col bg-ivory-50">
      <Header />

      {/* ── Hero ──────────────────────────────────────────── */}
      <CompanyHero company={company} locations={locations} />

      {/* ── Main Content ──────────────────────────────────── */}
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
            {/* ── Left Column (2/3) ────────────────────────── */}
            <div className="lg:col-span-2 space-y-12">
              {/* About */}
              {company.description && (
                <section>
                  <h2 className="font-heading text-2xl text-noir-900 font-light tracking-wide mb-6">
                    About
                  </h2>
                  <div className="h-px bg-gradient-to-r from-gold-500 to-transparent mb-6" />
                  <p className="font-body text-noir-700 leading-relaxed">
                    {company.description}
                  </p>
                </section>
              )}

              {/* Services */}
              <ServiceShowcase listings={listings} />
            </div>

            {/* ── Right Column (1/3) ───────────────────────── */}
            <div className="space-y-8">
              <CompanyContact company={company} locations={locations} />
              <LeadForm companyId={company.id} companyName={company.name} />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
