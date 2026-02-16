import type { CompanyWithDistance } from "@/lib/geo";
import Header from "./components/header";
import Footer from "./components/footer";
import HomeShell from "./components/home-shell";

const SEED_COMPANIES: CompanyWithDistance[] = [
  {
    id: "seed-1",
    name: "SkyShine Aviation Detailing",
    slug: "skyshine-aviation-detailing",
    description: "Premium aircraft detailing serving the Miami metro and South Florida area.",
    trust_score: 92,
    tier: "premium",
    is_claimed: true,
    lat: 25.7959,
    lng: -80.29,
    city: "Miami",
    state: "FL",
  },
  {
    id: "seed-2",
    name: "Pacific Wings Detail Co.",
    slug: "pacific-wings-detail-co",
    description: "Full-service aircraft cleaning and detailing at LAX and surrounding airports.",
    trust_score: 85,
    tier: "enhanced",
    is_claimed: true,
    lat: 33.9425,
    lng: -118.408,
    city: "Los Angeles",
    state: "CA",
  },
  {
    id: "seed-3",
    name: "Lone Star Aircraft Services",
    slug: "lone-star-aircraft-services",
    description: "Aircraft detailing, interior refurbishment, and paint correction in the DFW area.",
    trust_score: 78,
    tier: "featured",
    is_claimed: false,
    lat: 32.8998,
    lng: -97.04,
    city: "Dallas",
    state: "TX",
  },
  {
    id: "seed-4",
    name: "Empire State Aviation Detail",
    slug: "empire-state-aviation-detail",
    description: "Serving the greater New York City area with expert aircraft detailing.",
    trust_score: 88,
    tier: "premium",
    is_claimed: true,
    lat: 40.6895,
    lng: -74.1745,
    city: "New York",
    state: "NY",
  },
  {
    id: "seed-5",
    name: "Mile High Detailing",
    slug: "mile-high-detailing",
    description: "Aircraft detailing specialists at Denver International and Centennial airports.",
    trust_score: 71,
    tier: "basic",
    is_claimed: false,
    lat: 39.8561,
    lng: -104.6737,
    city: "Denver",
    state: "CO",
  },
];

async function getCompaniesWithLocations(): Promise<CompanyWithDistance[]> {
  try {
    const { createBrowserClient, listCompanies, getLocationsByCompanyId } =
      await import("@vector/db");

    const client = createBrowserClient();

    const { data: companies } = await listCompanies(client, {
      page: 1,
      perPage: 100,
    });

    const results: CompanyWithDistance[] = [];

    for (const company of companies) {
      const locations = await getLocationsByCompanyId(client, company.id);
      const locWithCoords = locations.find(
        (l) => l.lat !== null && l.lng !== null,
      );

      if (locWithCoords && locWithCoords.lat !== null && locWithCoords.lng !== null) {
        results.push({
          id: company.id,
          name: company.name,
          slug: company.slug,
          description: company.description,
          trust_score: company.trust_score,
          tier: company.tier,
          is_claimed: company.is_claimed,
          lat: locWithCoords.lat,
          lng: locWithCoords.lng,
          city: locWithCoords.city,
          state: locWithCoords.state,
        });
      }
    }

    if (results.length === 0) {
      return SEED_COMPANIES;
    }

    return results;
  } catch {
    return SEED_COMPANIES;
  }
}

export default async function HomePage() {
  const companies = await getCompaniesWithLocations();

  return (
    <>
      <Header />
      <HomeShell companies={companies} />
      <Footer />
    </>
  );
}
