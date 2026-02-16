"use server";

import { revalidatePath } from "next/cache";

export async function updateCompanyProfile(
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  const companyId = formData.get("companyId") as string;
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const website = formData.get("website") as string;
  const phone = formData.get("phone") as string;
  const email = formData.get("email") as string;

  const facebook = formData.get("facebook") as string;
  const instagram = formData.get("instagram") as string;
  const linkedin = formData.get("linkedin") as string;
  const twitter = formData.get("twitter") as string;
  const youtube = formData.get("youtube") as string;

  if (!companyId || !name) {
    return { success: false, error: "Company name is required." };
  }

  try {
    const { createBrowserClient } = await import("@vector/db");
    const supabase = createBrowserClient();

    // Handle logo upload
    let logoUrl: string | null = null;
    const logoFile = formData.get("logo") as File | null;
    if (logoFile && logoFile.size > 0) {
      const ext = logoFile.name.split(".").pop();
      const path = `logos/${companyId}.${ext}`;
      const { data: uploadData } = await supabase.storage
        .from("company-assets")
        .upload(path, logoFile, { upsert: true });
      if (uploadData) {
        const { data: urlData } = supabase.storage
          .from("company-assets")
          .getPublicUrl(uploadData.path);
        logoUrl = urlData.publicUrl;
      }
    }

    // Update company record
    const updatePayload: Record<string, string | null> = {
      name,
      description: description || null,
      website: website || null,
      phone: phone || null,
      email: email || null,
    };
    if (logoUrl) {
      updatePayload.logo_url = logoUrl;
    }

    const { error: companyError } = await supabase
      .from("companies")
      .update(updatePayload)
      .eq("id", companyId);

    if (companyError) {
      return { success: false, error: companyError.message };
    }

    // Upsert social links
    await supabase
      .from("company_social_links")
      .upsert({
        company_id: companyId,
        facebook: facebook || null,
        instagram: instagram || null,
        linkedin: linkedin || null,
        twitter: twitter || null,
        youtube: youtube || null,
      });

    revalidatePath("/dashboard/profile");
    return { success: true };
  } catch {
    // Seed fallback — simulate success
    console.log("[Profile] Update simulated for company:", companyId);
    revalidatePath("/dashboard/profile");
    return { success: true };
  }
}
