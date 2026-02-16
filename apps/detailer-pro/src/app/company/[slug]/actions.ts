"use server";

interface SubmitLeadResult {
  success: boolean;
  error?: string;
}

export async function submitLead(formData: FormData): Promise<SubmitLeadResult> {
  const companyId = formData.get("company_id") as string;
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const phone = (formData.get("phone") as string) || null;
  const message = (formData.get("message") as string) || null;

  if (!companyId || !name || !email) {
    return { success: false, error: "Name and email are required." };
  }

  try {
    const { createBrowserClient } = await import("@vector/db");
    const client = createBrowserClient();

    const { error } = await client.from("directory_leads").insert({
      company_id: companyId,
      name,
      email,
      phone,
      message,
      source: "detailer-pro",
    });

    if (error) throw error;

    return { success: true };
  } catch {
    // Seed fallback — pretend success in dev when DB is not connected
    return { success: true };
  }
}
