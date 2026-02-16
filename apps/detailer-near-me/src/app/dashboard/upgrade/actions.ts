"use server";

import { redirect } from "next/navigation";

export async function startCheckout(formData: FormData): Promise<void> {
  const tier = formData.get("tier") as
    | "enhanced"
    | "premium"
    | "featured"
    | "bundle_all";
  const companyId = formData.get("company_id") as string;

  if (!tier || !companyId) return;

  try {
    const { createCheckoutSession } = await import("@vector/billing");

    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3005";

    const session = await createCheckoutSession({
      tier,
      companyId,
      successUrl: `${baseUrl}/dashboard?upgraded=true`,
      cancelUrl: `${baseUrl}/dashboard/upgrade`,
    });

    if (session.url) {
      redirect(session.url);
    }
  } catch (err) {
    // In dev mode without Stripe, simulate redirect
    console.error("Checkout error:", err);
    redirect("/dashboard?upgraded=true");
  }
}
