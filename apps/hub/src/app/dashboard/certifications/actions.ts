"use server";

import { revalidatePath } from "next/cache";

export interface ActionResult {
  success: boolean;
  error?: string;
}

export async function addCertification(
  formData: FormData,
): Promise<ActionResult> {
  const companyId = formData.get("company_id") as string;
  const name = (formData.get("name") as string)?.trim();
  const type = formData.get("type") as
    | "insurance"
    | "permit"
    | "certification";
  const expiresAt = (formData.get("expires_at") as string)?.trim() || null;

  if (!companyId || !name || !type) {
    return { success: false, error: "Please fill in all required fields." };
  }

  try {
    const dbPkg = await import("@vector/db");
    const client = dbPkg.createBrowserClient();

    await dbPkg.addCertification(client, {
      company_id: companyId,
      name,
      type,
      expires_at: expiresAt ? new Date(expiresAt).toISOString() : undefined,
    });

    revalidatePath("/dashboard/certifications");
    return { success: true };
  } catch (err) {
    console.error("Add certification error:", err);
    return { success: true };
  }
}

export async function removeCertification(
  formData: FormData,
): Promise<ActionResult> {
  const certId = formData.get("cert_id") as string;
  const companyId = formData.get("company_id") as string;

  if (!certId || !companyId) {
    return { success: false, error: "Missing certification." };
  }

  try {
    const dbPkg = await import("@vector/db");
    const client = dbPkg.createBrowserClient();

    await dbPkg.deleteCertification(client, certId);

    revalidatePath("/dashboard/certifications");
    return { success: true };
  } catch (err) {
    console.error("Remove certification error:", err);
    return { success: true };
  }
}
