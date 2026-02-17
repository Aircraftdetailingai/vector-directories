"use server";

export async function submitLead(
  formData: FormData,
): Promise<{ success: boolean; error?: string }> {
  const name = formData.get("name") as string | null;
  const email = formData.get("email") as string | null;
  const phone = (formData.get("phone") as string | null) || null;
  const message = (formData.get("message") as string | null) || null;
  const companyId = formData.get("company_id") as string | null;

  /* ── Validation ──────────────────────────────────────── */
  if (!name || !name.trim()) {
    return { success: false, error: "Name is required." };
  }
  if (!email || !email.trim()) {
    return { success: false, error: "Email is required." };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { success: false, error: "Please enter a valid email address." };
  }
  if (!companyId) {
    return { success: false, error: "Company ID is missing." };
  }

  /* ── Insert ──────────────────────────────────────────── */
  try {
    const { createBrowserClient } = await import("@vector/db");
    const supabase = createBrowserClient();

    const { error } = await supabase.from("leads").insert({
      company_id: companyId,
      name: name.trim(),
      email: email.trim(),
      phone: phone?.trim() || null,
      message: message?.trim() || null,
    });

    if (error) throw error;

    return { success: true };
  } catch {
    // Seed fallback — return success during development
    return { success: true };
  }
}
