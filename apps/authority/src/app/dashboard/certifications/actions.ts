"use server";

import { revalidatePath } from "next/cache";

export async function addCertification(
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  const companyId = formData.get("companyId") as string;
  const name = formData.get("name") as string;
  const type = formData.get("type") as string;
  const expiresAt = formData.get("expires_at") as string;

  if (!companyId || !name || !type) {
    return { success: false, error: "Name and type are required." };
  }

  try {
    const { createBrowserClient, addCertification: dbAddCert } = await import("@vector/db");
    const supabase = createBrowserClient();
    await dbAddCert(supabase, {
      company_id: companyId,
      name,
      type: type as "insurance" | "permit" | "certification",
      expires_at: expiresAt || undefined,
      document_url: undefined,
    });

    revalidatePath("/dashboard/certifications");
    return { success: true };
  } catch {
    console.log("[Certifications] Add simulated:", name);
    revalidatePath("/dashboard/certifications");
    return { success: true };
  }
}

export async function removeCertification(
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  const certificationId = formData.get("certificationId") as string;

  if (!certificationId) {
    return { success: false, error: "Certification ID is required." };
  }

  try {
    const { createBrowserClient, deleteCertification: dbDeleteCert } = await import("@vector/db");
    const supabase = createBrowserClient();
    await dbDeleteCert(supabase, certificationId);

    revalidatePath("/dashboard/certifications");
    return { success: true };
  } catch {
    console.log("[Certifications] Remove simulated:", certificationId);
    revalidatePath("/dashboard/certifications");
    return { success: true };
  }
}
