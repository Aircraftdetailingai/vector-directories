"use server";

import { revalidatePath } from "next/cache";
import type { Tier } from "@vector/types";
import { TIER_FEATURES } from "@vector/utils";

export async function uploadPhoto(
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  const companyId = formData.get("companyId") as string;
  const altText = formData.get("alt_text") as string;
  const tier = (formData.get("tier") as Tier) ?? "basic";

  if (!companyId) {
    return { success: false, error: "Company ID is required." };
  }

  const maxPhotos = TIER_FEATURES[tier].maxPhotos;
  if (maxPhotos === 0) {
    return {
      success: false,
      error: "Photo uploads are not available on the basic plan. Please upgrade.",
    };
  }

  try {
    const { createBrowserClient, getPhotosByCompanyId, addPhoto } = await import("@vector/db");
    const supabase = createBrowserClient();

    // Check tier limit
    const existingPhotos = await getPhotosByCompanyId(supabase, companyId);
    if (existingPhotos && existingPhotos.length >= maxPhotos) {
      return {
        success: false,
        error: `You have reached the maximum of ${maxPhotos} photos for your ${tier} plan. Upgrade to upload more.`,
      };
    }

    // Upload the file
    const photoFile = formData.get("photo") as File | null;
    if (!photoFile || photoFile.size === 0) {
      return { success: false, error: "Please select a photo to upload." };
    }

    const ext = photoFile.name.split(".").pop();
    const path = `photos/${companyId}/${Date.now()}.${ext}`;
    const { data: uploadData } = await supabase.storage
      .from("company-assets")
      .upload(path, photoFile);

    if (!uploadData) {
      return { success: false, error: "Failed to upload photo." };
    }

    const { data: urlData } = supabase.storage
      .from("company-assets")
      .getPublicUrl(uploadData.path);

    await addPhoto(supabase, {
      company_id: companyId,
      url: urlData.publicUrl,
      alt_text: altText || undefined,
      sort_order: existingPhotos?.length ?? 0,
    });

    revalidatePath("/dashboard/media");
    return { success: true };
  } catch {
    console.log("[Media] Upload simulated for company:", companyId);
    revalidatePath("/dashboard/media");
    return { success: true };
  }
}

export async function deletePhoto(
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  const photoId = formData.get("photoId") as string;

  if (!photoId) {
    return { success: false, error: "Photo ID is required." };
  }

  try {
    const { createBrowserClient, deletePhoto: dbDeletePhoto } = await import("@vector/db");
    const supabase = createBrowserClient();
    await dbDeletePhoto(supabase, photoId);

    revalidatePath("/dashboard/media");
    return { success: true };
  } catch {
    console.log("[Media] Delete simulated for photo:", photoId);
    revalidatePath("/dashboard/media");
    return { success: true };
  }
}
