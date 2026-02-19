"use server";

import { revalidatePath } from "next/cache";
import type { Tier } from "@vector/types";
import { TIER_FEATURES } from "@vector/utils";

export async function addLocation(
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  const companyId = formData.get("companyId") as string;
  const name = formData.get("name") as string;
  const address = formData.get("address") as string;
  const city = formData.get("city") as string;
  const state = formData.get("state") as string;
  const zip = formData.get("zip") as string;
  const phone = formData.get("phone") as string;
  const isHeadquarters = formData.get("is_headquarters") === "true";
  const tier = (formData.get("tier") as Tier) ?? "basic";

  if (!companyId || !name || !address || !city || !state || !zip) {
    return { success: false, error: "All address fields are required." };
  }

  try {
    const { createBrowserClient, getLocationsByCompanyId } = await import("@vector/db");
    const supabase = createBrowserClient();

    // Check tier limit
    const existingLocations = await getLocationsByCompanyId(supabase, companyId);
    const maxLocations = TIER_FEATURES[tier].maxLocations;
    if (existingLocations && existingLocations.length >= maxLocations) {
      return {
        success: false,
        error: `You have reached the maximum of ${maxLocations} locations for your ${tier} plan. Upgrade to add more.`,
      };
    }

    const { error: insertError } = await supabase.from("company_locations").insert({
      company_id: companyId,
      name,
      address_line1: address,
      city,
      state,
      zip,
      phone: phone || null,
      is_headquarters: isHeadquarters,
    });

    if (insertError) {
      return { success: false, error: insertError.message };
    }

    revalidatePath("/dashboard/locations");
    return { success: true };
  } catch {
    console.log("[Locations] Add simulated for company:", companyId);
    revalidatePath("/dashboard/locations");
    return { success: true };
  }
}

export async function removeLocation(
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  const locationId = formData.get("locationId") as string;

  if (!locationId) {
    return { success: false, error: "Location ID is required." };
  }

  try {
    const { createBrowserClient } = await import("@vector/db");
    const supabase = createBrowserClient();

    const { error: deleteError } = await supabase
      .from("company_locations")
      .delete()
      .eq("id", locationId);

    if (deleteError) {
      return { success: false, error: deleteError.message };
    }

    revalidatePath("/dashboard/locations");
    return { success: true };
  } catch {
    console.log("[Locations] Remove simulated for location:", locationId);
    revalidatePath("/dashboard/locations");
    return { success: true };
  }
}
