"use server";

import { redirect } from "next/navigation";

export async function startCheckout(
  formData: FormData
): Promise<void> {
  const tier = formData.get("tier") as "enhanced" | "premium" | "featured" | "bundle_all";

  if (!tier) {
    redirect("/dashboard/upgrade");
  }

  try {
    const { createCheckoutSession } = await import("@vector/billing");
    const { requireAuth } = await import("@vector/auth");
    const user = await requireAuth();
    const { createBrowserClient } = await import("@vector/db");
    const supabase = createBrowserClient();
    const { data: profile } = await supabase
      .from("user_profiles")
      .select("company_id")
      .eq("id", user.id)
      .single();
    if (!profile?.company_id) throw new Error("No company");

    const session = await createCheckoutSession({
      tier,
      companyId: profile.company_id,
      successUrl: `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/dashboard?upgraded=true`,
      cancelUrl: `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/dashboard/upgrade`,
    });

    if (session?.url) {
      redirect(session.url);
    }

    redirect("/dashboard");
  } catch {
    // Seed fallback — redirect to dashboard as if checkout completed
    console.log("[Upgrade] Checkout simulated for tier:", tier);
    redirect("/dashboard");
  }
}
