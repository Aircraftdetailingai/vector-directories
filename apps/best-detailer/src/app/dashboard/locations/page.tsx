import type { Metadata } from "next";
import type { Location, Tier } from "@vector/types";
import { SectionCard } from "../components/section-card";
import { LocationsManager } from "./components/locations-manager";

export const metadata: Metadata = {
  title: "Locations | Best Aircraft Detailer Dashboard",
};

/* ──────────────────────────────────────────────────────────────────────────
   Data fetching
   ────────────────────────────────────────────────────────────────────────── */

async function getLocationsData(): Promise<{
  companyId: string;
  tier: Tier;
  locations: Location[];
}> {
  try {
    const { getUser } = await import("@vector/auth");
    const user = await getUser();
    if (!user) return { companyId: "", tier: "basic", locations: [] };

    const { createBrowserClient, getCompanyById, getLocationsByCompanyId } =
      await import("@vector/db");
    const client = createBrowserClient();

    const { data: profile } = await client
      .from("user_profiles")
      .select("company_id")
      .eq("id", user.id)
      .single();

    if (!profile?.company_id)
      return { companyId: "", tier: "basic", locations: [] };

    const [company, locations] = await Promise.all([
      getCompanyById(client, profile.company_id),
      getLocationsByCompanyId(client, profile.company_id),
    ]);

    return {
      companyId: profile.company_id,
      tier: (company?.tier as Tier) ?? "basic",
      locations,
    };
  } catch {
    return {
      companyId: "00000000-0000-0000-0000-000000000001",
      tier: "featured",
      locations: [
        {
          id: "00000000-0000-0000-0000-000000000011",
          company_id: "00000000-0000-0000-0000-000000000001",
          name: "Teterboro Executive Hangar",
          address_line1: "111 Industrial Ave",
          address_line2: "Hangar 4B",
          city: "Teterboro",
          state: "NJ",
          zip: "07608",
          country: "US",
          lat: null,
          lng: null,
          phone: "2015550100",
          is_headquarters: true,
          created_at: "2024-10-15T00:00:00Z",
          updated_at: "2024-10-15T00:00:00Z",
        },
        {
          id: "00000000-0000-0000-0000-000000000012",
          company_id: "00000000-0000-0000-0000-000000000001",
          name: "Palm Beach FBO",
          address_line1: "2601 Lantana Rd",
          address_line2: null,
          city: "West Palm Beach",
          state: "FL",
          zip: "33462",
          country: "US",
          lat: null,
          lng: null,
          phone: "5615550100",
          is_headquarters: false,
          created_at: "2024-11-01T00:00:00Z",
          updated_at: "2024-11-01T00:00:00Z",
        },
      ],
    };
  }
}

/* ──────────────────────────────────────────────────────────────────────────
   Page component
   ────────────────────────────────────────────────────────────────────────── */

export default async function LocationsPage() {
  const { companyId, tier, locations } = await getLocationsData();

  return (
    <SectionCard
      title="Locations"
      description="Manage the airport locations where you provide services."
    >
      <LocationsManager
        locations={locations}
        companyId={companyId}
        tier={tier}
      />
    </SectionCard>
  );
}
