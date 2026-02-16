"use server";

export interface LeadResult {
  success: boolean;
  error?: string;
}

export async function submitLead(
  formData: FormData,
): Promise<LeadResult> {
  const companyId = formData.get("company_id") as string;
  const name = (formData.get("name") as string)?.trim();
  const email = (formData.get("email") as string)?.trim();
  const phone = (formData.get("phone") as string)?.trim() || null;
  const message = (formData.get("message") as string)?.trim();

  if (!companyId || !name || !email || !message) {
    return { success: false, error: "Please fill in all required fields." };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { success: false, error: "Please enter a valid email address." };
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
    });

    if (error) throw error;

    return { success: true };
  } catch {
    return {
      success: false,
      error: "Unable to submit your request right now. Please try again later.",
    };
  }
}
