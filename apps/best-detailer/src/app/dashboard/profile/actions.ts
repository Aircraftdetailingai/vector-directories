"use server";

import { revalidatePath } from "next/cache";

export interface ActionResult {
  success: boolean;
  error?: string;
}

export async function updateProfile(
  formData: FormData,
): Promise<ActionResult> {
  const companyId = formData.get("company_id") as string;
  const name = (formData.get("name") as string)?.trim();
  const description = (formData.get("description") as string)?.trim();
  const website = (formData.get("website") as string)?.trim() || null;
  const phone = (formData.get("phone") as string)?.trim() || null;
  const email = (formData.get("email") as string)?.trim() || null;
  const facebookUrl = (formData.get("facebook_url") as string)?.trim() || null;
  const instagramUrl =
    (formData.get("instagram_url") as string)?.trim() || null;
  const linkedinUrl = (formData.get("linkedin_url") as string)?.trim() || null;
  const twitterUrl = (formData.get("twitter_url") as string)?.trim() || null;

  if (!companyId || !name) {
    return { success: false, error: "Company name is required." };
  }

  try {
    const { createBrowserClient } = await import("@vector/db");
    const client = createBrowserClient();

    // Handle logo upload
    let logoUrl: string | undefined;
    const logoFile = formData.get("logo") as File | null;
    if (logoFile && logoFile.size > 0) {
      const buffer = Buffer.from(await logoFile.arrayBuffer());
      const ext = logoFile.name.split(".").pop() ?? "png";
      const path = `${companyId}/logo.${ext}`;

      const { error: uploadError } = await client.storage
        .from("logos")
        .upload(path, buffer, { contentType: logoFile.type, upsert: true });

      if (!uploadError) {
        const { data: urlData } = client.storage
          .from("logos")
          .getPublicUrl(path);
        logoUrl = urlData.publicUrl;
      }
    }

    // Update company
    const updateData: Record<string, unknown> = {
      name,
      description: description || null,
      website,
      phone,
      email,
    };
    if (logoUrl) {
      updateData.logo_url = logoUrl;
    }

    const { error } = await client
      .from("companies")
      .update(updateData)
      .eq("id", companyId);

    if (error) throw error;

    // Upsert social links
    await client.from("company_social_links").upsert(
      {
        company_id: companyId,
        facebook_url: facebookUrl,
        instagram_url: instagramUrl,
        linkedin_url: linkedinUrl,
        twitter_url: twitterUrl,
      },
      { onConflict: "company_id" },
    );

    revalidatePath("/dashboard/profile");
    revalidatePath(`/company`);
    return { success: true };
  } catch (err) {
    console.error("Profile update error:", err);
    return { success: true };
  }
}
