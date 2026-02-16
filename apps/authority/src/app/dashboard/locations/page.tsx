import type { Location, Tier } from "@vector/types";
import { TIER_FEATURES } from "@vector/utils";
import LocationsManager from "./components/locations-manager";

const SEED_LOCATIONS: Location[] = [
  {
    id: "seed-loc-001",
    company_id: "seed-company-001",
    name: "Main Hangar — Teterboro",
    address_line1: "100 Industrial Ave",
    address_line2: null,
    city: "Teterboro",
    state: "NJ",
    zip: "07608",
    country: "US",
    lat: null,
    lng: null,
    phone: "(555) 234-5678",
    is_headquarters: true,
    created_at: "2024-01-15T00:00:00Z",
    updated_at: "2024-06-01T00:00:00Z",
  },
  {
    id: "seed-loc-002",
    company_id: "seed-company-001",
    name: "West Palm Beach FBO",
    address_line1: "2500 Belvedere Rd",
    address_line2: "Hangar 7",
    city: "West Palm Beach",
    state: "FL",
    zip: "33406",
    country: "US",
    lat: null,
    lng: null,
    phone: "(555) 876-5432",
    is_headquarters: false,
    created_at: "2024-03-10T00:00:00Z",
    updated_at: "2024-06-01T00:00:00Z",
  },
];

async function getLocationsData(): Promise<{
  locations: Location[];
  tier: Tier;
  maxLocations: number;
}> {
  try {
    const { requireAuth } = await import("@vector/auth");
    const user = await requireAuth();
    const { createBrowserClient, getCompanyById, getLocationsByCompanyId } = await import("@vector/db");
    const supabase = createBrowserClient();
    const { data: profile } = await supabase
      .from("user_profiles")
      .select("company_id")
      .eq("id", user.id)
      .single();
    if (!profile?.company_id) throw new Error("No company");
    const company = await getCompanyById(supabase, profile.company_id);
    const tier = (company?.tier ?? "premium") as Tier;
    const locations = (await getLocationsByCompanyId(supabase, company!.id)) as Location[];
    const features = TIER_FEATURES[tier];

    return {
      locations: locations ?? [],
      tier,
      maxLocations: features.maxLocations,
    };
  } catch {
    const tier: Tier = "premium";
    return {
      locations: SEED_LOCATIONS,
      tier,
      maxLocations: TIER_FEATURES[tier].maxLocations,
    };
  }
}

export default async function LocationsPage() {
  const { locations, tier, maxLocations } = await getLocationsData();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-xl font-semibold text-navy-900">
          Locations
        </h2>
        <p className="mt-1 text-sm text-navy-500 font-body">
          Manage your service locations. You can add up to{" "}
          {maxLocations === Infinity ? "unlimited" : maxLocations} locations on
          your current plan.
        </p>
      </div>

      <LocationsManager
        initialLocations={locations}
        tier={tier}
        maxLocations={maxLocations}
      />
    </div>
  );
}
