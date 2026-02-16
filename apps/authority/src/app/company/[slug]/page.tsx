import type { Metadata } from "next";
import Link from "next/link";
import Header from "../../components/header";
import Footer from "../../components/footer";
import AuthorityHero from "./components/authority-hero";
import ScoringMatrix from "./components/scoring-matrix";
import EditorialReview from "./components/editorial-review";
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
  city: string;
  state: string;
  zip: string;
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
  title: string;
  slug: string;
  description: string | null;
  category: string;
  status: string;
  created_at: string;
  updated_at: string;
}

/* ── Seed Data ─────────────────────────────────────────────────────────── */

const SEED_COMPANY: Company = {
  id: "seed-company-001",
  name: "SkyShine Aviation Detailing",
  slug: "skyshine-aviation-detailing",
  description:
    "SkyShine Aviation Detailing is a premier aircraft care provider specializing in comprehensive detailing services for private, corporate, and charter aircraft. With meticulous attention to detail and FAA-compliant processes, SkyShine delivers unparalleled results across the Southeast.",
  trust_score: 94,
  tier: "premium",
  is_claimed: true,
  website: "https://skyshine-aviation.com",
  phone: "3055551234",
  email: "info@skyshine-aviation.com",
  logo_url: null,
  claimed_by: "seed-user-001",
  created_at: "2024-01-15T00:00:00Z",
  updated_at: "2024-12-01T00:00:00Z",
};

const SEED_LOCATIONS: Location[] = [
  {
    id: "seed-loc-001",
    company_id: "seed-company-001",
    name: "Miami Headquarters",
    address_line1: "1200 NW 42nd Ave",
    city: "Miami",
    state: "FL",
    zip: "33126",
    lat: 25.7617,
    lng: -80.1918,
    phone: "3055551234",
    is_headquarters: true,
    created_at: "2024-01-15T00:00:00Z",
    updated_at: "2024-12-01T00:00:00Z",
  },
];

const SEED_LISTINGS: Listing[] = [
  {
    id: "seed-list-001",
    company_id: "seed-company-001",
    title: "Exterior Wash",
    slug: "exterior-wash",
    description: "Full exterior wash and dry for all aircraft types.",
    category: "exterior",
    status: "active",
    created_at: "2024-02-01T00:00:00Z",
    updated_at: "2024-02-01T00:00:00Z",
  },
  {
    id: "seed-list-002",
    company_id: "seed-company-001",
    title: "Interior Detail",
    slug: "interior-detail",
    description: "Complete interior cleaning, leather conditioning, and carpet care.",
    category: "interior",
    status: "active",
    created_at: "2024-02-01T00:00:00Z",
    updated_at: "2024-02-01T00:00:00Z",
  },
  {
    id: "seed-list-003",
    company_id: "seed-company-001",
    title: "Paint Correction",
    slug: "paint-correction",
    description: "Multi-stage paint correction to restore factory finish.",
    category: "paint",
    status: "active",
    created_at: "2024-03-01T00:00:00Z",
    updated_at: "2024-03-01T00:00:00Z",
  },
  {
    id: "seed-list-004",
    company_id: "seed-company-001",
    title: "Ceramic Coating",
    slug: "ceramic-coating",
    description: "Aviation-grade ceramic coating for long-lasting protection.",
    category: "protection",
    status: "active",
    created_at: "2024-03-15T00:00:00Z",
    updated_at: "2024-03-15T00:00:00Z",
  },
  {
    id: "seed-list-005",
    company_id: "seed-company-001",
    title: "Brightwork Polish",
    slug: "brightwork-polish",
    description: "Chrome and metal brightwork polishing to mirror finish.",
    category: "specialty",
    status: "active",
    created_at: "2024-04-01T00:00:00Z",
    updated_at: "2024-04-01T00:00:00Z",
  },
];

/* ── Data Fetching ─────────────────────────────────────────────────────── */

async function getCompanyData(slug: string) {
  try {
    const { createServerClient } = await import("@vector/db");
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    const supabase = createServerClient(cookieStore);

    const { getCompanyBySlug, getLocationsByCompanyId, getListingsByCompanyId } =
      await import("@vector/db");

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
    // Return seed data for any slug during development
    return {
      company: { ...SEED_COMPANY, slug, name: slug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ") },
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
    `Authority Score, expert review, and contact information for ${name}.`;

  return {
    title: `${name} | Authority Score & Expert Review | Aircraft Detailing Authority`,
    description:
      typeof desc === "string" && desc.length > 160
        ? desc.slice(0, 157) + "..."
        : desc,
    openGraph: {
      title: `${name} — Aircraft Detailing Authority`,
      description: `Authority Score rating and expert editorial review for ${name}.`,
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

  const { company, locations, listings } = data!;

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
                href="/search"
                className="hover:text-navy-800 transition-colors"
              >
                Rankings
              </Link>
            </li>
            <li aria-hidden="true" className="text-navy-300">
              /
            </li>
            <li className="text-navy-800 font-medium truncate">
              {company.name}
            </li>
          </ol>
        </div>
      </nav>

      {/* ── Authority Hero ──────────────────────────────────── */}
      <AuthorityHero company={company} />

      {/* ── Main Content ────────────────────────────────────── */}
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
            {/* ── Left Column (2/3) ──────────────────────────── */}
            <div className="lg:col-span-2 space-y-10">
              <ScoringMatrix trustScore={company.trust_score} />
              <EditorialReview company={company} listings={listings} />
            </div>

            {/* ── Right Column (1/3) ─────────────────────────── */}
            <div className="space-y-8">
              <CompanyContact
                company={company}
                locations={locations}
              />
              <LeadForm companyId={company.id} companyName={company.name} />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
