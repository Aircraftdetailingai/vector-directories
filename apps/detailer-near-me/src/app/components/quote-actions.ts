"use server";

interface QuoteResult {
  success: boolean;
  error?: string;
  sentCount?: number;
}

export async function requestQuotes(formData: FormData): Promise<QuoteResult> {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const phone = (formData.get("phone") as string) || null;
  const message = (formData.get("message") as string) || null;
  const selectedCompanyIds = JSON.parse(
    (formData.get("selectedCompanyIds") as string) || "[]"
  ) as string[];
  const selectedServices = JSON.parse(
    (formData.get("selectedServices") as string) || "[]"
  ) as string[];
  const airportCode = formData.get("airportCode") as string;

  try {
    // In real mode: iterate over company IDs and send emails via @vector/email
    // const { createBrowserClient } = await import("@vector/db");
    // const supabase = createBrowserClient();
    // for (const companyId of selectedCompanyIds) { ... }

    // Validate required fields
    if (!name || !email || selectedCompanyIds.length === 0) {
      return {
        success: false,
        error: "Name, email, and at least one detailer are required.",
      };
    }

    // Simulate sending quote requests
    // In production this would use @vector/email to send emails to each company
    const sentCount = selectedCompanyIds.length;

    // Log the request for debugging (server-side only)
    console.log("Quote request received:", {
      name,
      email,
      phone,
      message,
      airportCode,
      selectedCompanyIds,
      selectedServices,
      sentCount,
    });

    return { success: true, sentCount };
  } catch {
    // Seed fallback — always return success in dev
    return {
      success: true,
      sentCount: selectedCompanyIds.length,
    };
  }
}
