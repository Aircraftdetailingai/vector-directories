import type { Company } from "@vector/types";
import { getAllAirports } from "@/lib/city-airports";
import Header from "./components/header";
import Footer from "./components/footer";
import WizardFlow from "./components/wizard-flow";

const SEED_COMPANIES: Company[] = [
  {
    id: "a1b2c3d4-0001-4000-8000-000000000001",
    name: "SkyShine Aviation Detailing",
    slug: "skyshine-aviation-detailing",
    description:
      "Full-service aircraft detailing with FAA-compliant ceramic coatings and interior restoration. Serving private and commercial fleets since 2012.",
    website: "https://skyshine.example.com",
    phone: "(305) 555-0101",
    email: "info@skyshine.example.com",
    logo_url: null,
    trust_score: 96,
    is_claimed: true,
    claimed_by: null,
    tier: "featured",
    created_at: "2024-01-10T12:00:00Z",
    updated_at: "2024-06-15T12:00:00Z",
  },
  {
    id: "a1b2c3d4-0002-4000-8000-000000000002",
    name: "AeroGloss Detailers",
    slug: "aerogloss-detailers",
    description:
      "Precision paint correction and brightwork polish for turboprops, jets, and helicopters. Mobile service across the tri-state area.",
    website: "https://aerogloss.example.com",
    phone: "(212) 555-0202",
    email: "book@aerogloss.example.com",
    logo_url: null,
    trust_score: 91,
    is_claimed: true,
    claimed_by: null,
    tier: "premium",
    created_at: "2024-02-05T12:00:00Z",
    updated_at: "2024-07-20T12:00:00Z",
  },
  {
    id: "a1b2c3d4-0003-4000-8000-000000000003",
    name: "JetFresh Pro",
    slug: "jetfresh-pro",
    description:
      "Interior deep-cleaning specialists — leather conditioning, carpet extraction, odor elimination, and antimicrobial treatments.",
    website: "https://jetfreshpro.example.com",
    phone: "(954) 555-0303",
    email: "quotes@jetfreshpro.example.com",
    logo_url: null,
    trust_score: 87,
    is_claimed: true,
    claimed_by: null,
    tier: "premium",
    created_at: "2024-03-12T12:00:00Z",
    updated_at: "2024-08-01T12:00:00Z",
  },
  {
    id: "a1b2c3d4-0004-4000-8000-000000000004",
    name: "WingWash Co.",
    slug: "wingwash-co",
    description:
      "Eco-friendly aircraft washing using waterless and low-runoff methods. Certified by NBAA for on-ramp detailing.",
    website: "https://wingwash.example.com",
    phone: "(480) 555-0404",
    email: "hello@wingwash.example.com",
    logo_url: null,
    trust_score: 82,
    is_claimed: true,
    claimed_by: null,
    tier: "enhanced",
    created_at: "2024-04-18T12:00:00Z",
    updated_at: "2024-09-10T12:00:00Z",
  },
  {
    id: "a1b2c3d4-0005-4000-8000-000000000005",
    name: "TarmacShine Detailing",
    slug: "tarmacshine-detailing",
    description:
      "Complete exterior and engine detailing for light sport aircraft through large-cabin business jets.",
    website: null,
    phone: "(713) 555-0505",
    email: "service@tarmacshine.example.com",
    logo_url: null,
    trust_score: 75,
    is_claimed: false,
    claimed_by: null,
    tier: "enhanced",
    created_at: "2024-05-22T12:00:00Z",
    updated_at: "2024-10-05T12:00:00Z",
  },
  {
    id: "a1b2c3d4-0006-4000-8000-000000000006",
    name: "Altitude Detail Works",
    slug: "altitude-detail-works",
    description:
      "Hangar-based and mobile detailing serving Colorado Front Range airports. Ceramic coatings and window treatments.",
    website: "https://altitudedetail.example.com",
    phone: "(303) 555-0606",
    email: "team@altitudedetail.example.com",
    logo_url: null,
    trust_score: 68,
    is_claimed: true,
    claimed_by: null,
    tier: "basic",
    created_at: "2024-06-30T12:00:00Z",
    updated_at: "2024-11-12T12:00:00Z",
  },
  {
    id: "a1b2c3d4-0007-4000-8000-000000000007",
    name: "PropWash Aviation Services",
    slug: "propwash-aviation-services",
    description:
      "Affordable exterior wash and interior wipe-down packages for flight schools and owner-operators.",
    website: null,
    phone: "(404) 555-0707",
    email: "propwash@example.com",
    logo_url: null,
    trust_score: 55,
    is_claimed: false,
    claimed_by: null,
    tier: "basic",
    created_at: "2024-07-14T12:00:00Z",
    updated_at: "2024-12-01T12:00:00Z",
  },
  {
    id: "a1b2c3d4-0008-4000-8000-000000000008",
    name: "ClearCoat Aero",
    slug: "clearcoat-aero",
    description:
      "Premium ceramic coating and paint protection film installation. Authorized Gtechniq and XPEL installer for aviation.",
    website: "https://clearcoataero.example.com",
    phone: "(702) 555-0808",
    email: "info@clearcoataero.example.com",
    logo_url: null,
    trust_score: 43,
    is_claimed: false,
    claimed_by: null,
    tier: "basic",
    created_at: "2024-08-28T12:00:00Z",
    updated_at: "2025-01-15T12:00:00Z",
  },
];

async function getCompanies(): Promise<Company[]> {
  try {
    const { createBrowserClient } = await import("@vector/db");
    const supabase = createBrowserClient();
    const { searchCompanies } = await import("@vector/db");
    const result = await searchCompanies(supabase, {
      sort_by: "trust_score",
      sort_order: "desc",
      per_page: 20,
      page: 1,
    });
    return result.companies;
  } catch {
    return SEED_COMPANIES;
  }
}

export default async function HomePage() {
  const [companies, airports] = await Promise.all([
    getCompanies(),
    Promise.resolve(getAllAirports()),
  ]);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 bg-cream-50">
        {/* Hero area */}
        <div className="bg-white border-b border-brand-100">
          <div className="mx-auto max-w-4xl px-4 pb-2 pt-10 text-center sm:px-6 lg:px-8">
            <h1 className="font-heading text-3xl font-bold text-brown-500 sm:text-4xl">
              Find an Aircraft Detailer Near You
            </h1>
            <p className="mx-auto mt-3 max-w-2xl text-lg text-gray-500">
              Pick your airport, choose your services, and request quotes from
              trusted detailers &mdash; all in under a minute.
            </p>
          </div>
        </div>

        <WizardFlow companies={companies} airports={airports} />
      </main>

      <Footer />
    </div>
  );
}
