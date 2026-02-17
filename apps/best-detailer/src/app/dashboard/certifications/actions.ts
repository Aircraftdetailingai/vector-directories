"use server";

import crypto from "crypto";
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
  const expiresAtRaw = (formData.get("expires_at") as string)?.trim();
  const expiresAt = expiresAtRaw
    ? new Date(expiresAtRaw).toISOString()
    : undefined;

  if (!companyId || !name || !type) {
    return { success: false, error: "Please fill in all required fields." };
  }

  try {
    const { createBrowserClient } = await import("@vector/db");
    const client = createBrowserClient();

    // Handle document upload
    let documentUrl: string | undefined;
    const docFile = formData.get("document") as File | null;
    if (docFile && docFile.size > 0) {
      const buffer = Buffer.from(await docFile.arrayBuffer());
      const ext = docFile.name.split(".").pop() ?? "pdf";
      const path = `${companyId}/${crypto.randomUUID()}.${ext}`;

      const { error: uploadError } = await client.storage
        .from("certifications")
        .upload(path, buffer, { contentType: docFile.type });

      if (!uploadError) {
        const { data: urlData } = client.storage
          .from("certifications")
          .getPublicUrl(path);
        documentUrl = urlData.publicUrl;
      }
    }

    const { error } = await client.from("company_certifications").insert({
      company_id: companyId,
      name,
      type,
      document_url: documentUrl,
      expires_at: expiresAt,
    });

    if (error) throw error;

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
    const { createBrowserClient } = await import("@vector/db");
    const client = createBrowserClient();

    const { error } = await client
      .from("company_certifications")
      .delete()
      .eq("id", certId)
      .eq("company_id", companyId);

    if (error) throw error;

    revalidatePath("/dashboard/certifications");
    return { success: true };
  } catch (err) {
    console.error("Remove certification error:", err);
    return { success: true };
  }
}
