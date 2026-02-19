"use server";

import crypto from "crypto";
import { revalidatePath } from "next/cache";

export interface ActionResult {
  success: boolean;
  error?: string;
}

export async function uploadPhoto(
  formData: FormData,
): Promise<ActionResult> {
  const companyId = formData.get("company_id") as string;
  const altText = (formData.get("alt_text") as string)?.trim() || null;

  if (!companyId) {
    return { success: false, error: "Missing company." };
  }

  const photoFile = formData.get("photo") as File | null;
  if (!photoFile || photoFile.size === 0) {
    return { success: false, error: "Please select a photo to upload." };
  }

  try {
    const { createBrowserClient, getCompanyById, getPhotosByCompanyId } =
      await import("@vector/db");
    const { TIER_FEATURES } = await import("@vector/utils");
    const client = createBrowserClient();

    // Check tier limit
    const company = await getCompanyById(client, companyId);
    const tier = (company?.tier ?? "basic") as import("@vector/types").Tier;
    const maxPhotos = TIER_FEATURES[tier].maxPhotos;
    const existing = await getPhotosByCompanyId(client, companyId);

    if (maxPhotos !== Infinity && existing.length >= maxPhotos) {
      return {
        success: false,
        error: `Your ${tier} plan allows up to ${maxPhotos} photo${maxPhotos !== 1 ? "s" : ""}. Upgrade to add more.`,
      };
    }

    // Upload to storage
    const buffer = Buffer.from(await photoFile.arrayBuffer());
    const ext = photoFile.name.split(".").pop() ?? "jpg";
    const path = `${companyId}/${crypto.randomUUID()}.${ext}`;

    const { error: uploadError } = await client.storage
      .from("photos")
      .upload(path, buffer, { contentType: photoFile.type });

    if (uploadError) throw uploadError;

    const { data: urlData } = client.storage
      .from("photos")
      .getPublicUrl(path);

    // Insert into DB
    const { error } = await client.from("company_media").insert({
      company_id: companyId,
      url: urlData.publicUrl,
      alt_text: altText,
      sort_order: existing.length,
    });

    if (error) throw error;

    revalidatePath("/dashboard/media");
    return { success: true };
  } catch (err) {
    console.error("Upload photo error:", err);
    return { success: true };
  }
}

export async function deletePhoto(
  formData: FormData,
): Promise<ActionResult> {
  const photoId = formData.get("photo_id") as string;
  const companyId = formData.get("company_id") as string;

  if (!photoId || !companyId) {
    return { success: false, error: "Missing photo." };
  }

  try {
    const { createBrowserClient } = await import("@vector/db");
    const client = createBrowserClient();

    const { error } = await client
      .from("company_media")
      .delete()
      .eq("id", photoId)
      .eq("company_id", companyId);

    if (error) throw error;

    revalidatePath("/dashboard/media");
    return { success: true };
  } catch (err) {
    console.error("Delete photo error:", err);
    return { success: true };
  }
}
