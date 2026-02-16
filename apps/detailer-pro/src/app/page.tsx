import type { Company } from "@vector/types";
import Header from "./components/header";
import Footer from "./components/footer";
import HomeContent from "./components/home-content";

const SEED_COMPANIES: Company[] = [
  {
    id: "seed-1",
    name: "AeroShine Pro Detailing",
    slug: "aeroshine-pro-detailing",
    description: "Elite aircraft detailing for private jets and turboprops. FAA-certified facility at Teterboro.",
    website: null,
    phone: null,
    email: null,
    logo_url: null,
    trust_score: 95,
    is_claimed: true,
    claimed_by: null,
    tier: "featured",
    created_at: "2024-01-15T00:00:00Z",
    updated_at: "2024-01-15T00:00:00Z",
  },
  {
    id: "seed-2",
    name: "Precision Aviation Detail",
    slug: "precision-aviation-detail",
    description: "Full-service aircraft detailing with ceramic coating specialists. Serving South Florida.",
    website: null,
    phone: null,
    email: null,
    logo_url: null,
    trust_score: 91,
    is_claimed: true,
    claimed_by: null,
    tier: "premium",
    created_at: "2024-02-10T00:00:00Z",
    updated_at: "2024-02-10T00:00:00Z",
  },
  {
    id: "seed-3",
    name: "SkyGuard Detailing Services",
    slug: "skyguard-detailing-services",
    description: "Helicopter and rotorcraft detailing experts. Mobile service across the Southwest.",
    website: null,
    phone: null,
    email: null,
    logo_url: null,
    trust_score: 88,
    is_claimed: true,
    claimed_by: null,
    tier: "premium",
    created_at: "2024-03-01T00:00:00Z",
    updated_at: "2024-03-01T00:00:00Z",
  },
  {
    id: "seed-4",
    name: "JetPolish Aviation",
    slug: "jetpolish-aviation",
    description: "Paint correction and brightwork polishing for corporate fleets. Based at Van Nuys.",
    website: null,
    phone: null,
    email: null,
    logo_url: null,
    trust_score: 85,
    is_claimed: true,
    claimed_by: null,
    tier: "enhanced",
    created_at: "2024-03-15T00:00:00Z",
    updated_at: "2024-03-15T00:00:00Z",
  },
  {
    id: "seed-5",
    name: "Wingshine Aircraft Care",
    slug: "wingshine-aircraft-care",
    description: "Interior and exterior detailing for piston singles and light twins. Pacific Northwest.",
    website: null,
    phone: null,
    email: null,
    logo_url: null,
    trust_score: 82,
    is_claimed: true,
    claimed_by: null,
    tier: "enhanced",
    created_at: "2024-04-01T00:00:00Z",
    updated_at: "2024-04-01T00:00:00Z",
  },
  {
    id: "seed-6",
    name: "TarmacPro Detailing",
    slug: "tarmacpro-detailing",
    description: "Commercial aircraft cleaning and detailing. Airline contracts and FBO partnerships.",
    website: null,
    phone: null,
    email: null,
    logo_url: null,
    trust_score: 78,
    is_claimed: false,
    claimed_by: null,
    tier: "basic",
    created_at: "2024-04-20T00:00:00Z",
    updated_at: "2024-04-20T00:00:00Z",
  },
  {
    id: "seed-7",
    name: "Heritage Aviation Finishers",
    slug: "heritage-aviation-finishers",
    description: "Vintage and warbird restoration detailing. Fabric, aluminum, and dope finishing experts.",
    website: null,
    phone: null,
    email: null,
    logo_url: null,
    trust_score: 74,
    is_claimed: false,
    claimed_by: null,
    tier: "basic",
    created_at: "2024-05-10T00:00:00Z",
    updated_at: "2024-05-10T00:00:00Z",
  },
  {
    id: "seed-8",
    name: "Altitude Clean Co.",
    slug: "altitude-clean-co",
    description: "High-altitude airport detailing services. Denver, Aspen, and mountain region airports.",
    website: null,
    phone: null,
    email: null,
    logo_url: null,
    trust_score: 70,
    is_claimed: true,
    claimed_by: null,
    tier: "enhanced",
    created_at: "2024-06-01T00:00:00Z",
    updated_at: "2024-06-01T00:00:00Z",
  },
  {
    id: "seed-9",
    name: "Propwash Detail Group",
    slug: "propwash-detail-group",
    description: "Turboprop and light sport aircraft detailing. Mobile service across the Midwest.",
    website: null,
    phone: null,
    email: null,
    logo_url: null,
    trust_score: 65,
    is_claimed: false,
    claimed_by: null,
    tier: "basic",
    created_at: "2024-06-20T00:00:00Z",
    updated_at: "2024-06-20T00:00:00Z",
  },
  {
    id: "seed-10",
    name: "RunwayReady Services",
    slug: "runwayready-services",
    description: "Budget-friendly aircraft wash and detail. Walk-in service at regional airports.",
    website: null,
    phone: null,
    email: null,
    logo_url: null,
    trust_score: 58,
    is_claimed: false,
    claimed_by: null,
    tier: "basic",
    created_at: "2024-07-01T00:00:00Z",
    updated_at: "2024-07-01T00:00:00Z",
  },
];

async function getTopCompanies(): Promise<Company[]> {
  try {
    const { searchCompanies, createBrowserClient } = await import("@vector/db");
    const client = createBrowserClient();

    const result = await searchCompanies(client, {
      sort_by: "trust_score",
      sort_order: "desc",
      per_page: 10,
      page: 1,
    });

    if (result.companies.length === 0) {
      return SEED_COMPANIES;
    }

    return result.companies;
  } catch {
    return SEED_COMPANIES;
  }
}

export default async function HomePage() {
  const companies = await getTopCompanies();

  return (
    <>
      <Header />
      <HomeContent companies={companies} />
      <Footer />
    </>
  );
}
