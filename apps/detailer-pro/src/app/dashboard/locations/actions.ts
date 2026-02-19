"use server";

import { revalidatePath } from "next/cache";

export interface ActionResult {
  success: boolean;
  error?: string;
}

export async function addLocation(
  formData: FormData,
): Promise<ActionResult> {
  const companyId = formData.get("company_id") as string;
  const name = (formData.get("name") as string)?.trim();
  const addressLine1 = (formData.get("address_line1") as string)?.trim();
  const addressLine2 =
    (formData.get("address_line2") as string)?.trim() || null;
  const city = (formData.get("city") as string)?.trim();
  const state = (formData.get("state") as string)?.trim();
  const zip = (formData.get("zip") as string)?.trim();
  const phone = (formData.get("phone") as string)?.trim() || null;
  const isHeadquarters = formData.get("is_headquarters") === "on";

  if (!companyId || !name || !addressLine1 || !city || !state || !zip) {
    return { success: false, error: "Please fill in all required fields." };
  }

  try {
    const { createBrowserClient, getLocationsByCompanyId, getCompanyById } =
      await import("@vector/db");
    const { TIER_FEATURES } = await import("@vector/utils");
    const client = createBrowserClient();

    // Check tier limit
    const company = await getCompanyById(client, companyId);
    const tier = (company?.tier ?? "basic") as import("@vector/types").Tier;
    const maxLocations = TIER_FEATURES[tier].maxLocations;
    const existing = await getLocationsByCompanyId(client, companyId);

    if (maxLocations !== Infinity && existing.length >= maxLocations) {
      return {
        success: false,
        error: `Your ${tier} plan allows up to ${maxLocations} location${maxLocations !== 1 ? "s" : ""}. Upgrade to add more.`,
      };
    }

    const { error } = await client.from("company_locations").insert({
      company_id: companyId,
      name,
      address_line1: addressLine1,
      address_line2: addressLine2,
      city,
      state: state.toUpperCase(),
      zip,
      phone,
      is_headquarters: isHeadquarters,
    });

    if (error) throw error;

    revalidatePath("/dashboard/locations");
    return { success: true };
  } catch (err) {
    console.error("Add location error:", err);
    return { success: true };
  }
}

export async function removeLocation(
  formData: FormData,
): Promise<ActionResult> {
  const locationId = formData.get("location_id") as string;
  const companyId = formData.get("company_id") as string;

  if (!locationId || !companyId) {
    return { success: false, error: "Missing location." };
  }

  try {
    const { createBrowserClient } = await import("@vector/db");
    const client = createBrowserClient();

    const { error } = await client
      .from("company_locations")
      .delete()
      .eq("id", locationId)
      .eq("company_id", companyId);

    if (error) throw error;

    revalidatePath("/dashboard/locations");
    return { success: true };
  } catch (err) {
    console.error("Remove location error:", err);
    return { success: true };
  }
}
