"use server";

import { redirect } from "next/navigation";

const SITE_KEY = "directory";

const PLACEMENT_PRICES: Record<string, { name: string; price_cents: number }> = {
  top_banner: { name: "Top Banner", price_cents: 19900 },
  sidebar: { name: "Sidebar", price_cents: 14900 },
  featured_boost: { name: "Featured Boost", price_cents: 9900 },
  category_sponsor: { name: "Category Sponsor", price_cents: 24900 },
  homepage_spotlight: { name: "Homepage Spotlight", price_cents: 29900 },
  popup: { name: "Popup", price_cents: 34900 },
};

export async function startAdCheckout(formData: FormData): Promise<void> {
  const placementType = formData.get("placement_type") as string;
  const companyName = formData.get("company_name") as string;
  const title = formData.get("title") as string;
  const destinationUrl = formData.get("destination_url") as string;
  const imageUrl = (formData.get("image_url") as string) || null;

  if (!placementType || !companyName || !title || !destinationUrl) return;

  const placementInfo = PLACEMENT_PRICES[placementType];
  if (!placementInfo) return;

  try {
    const { createBrowserClient } = await import("@vector/db");
    const supabase = createBrowserClient();

    // Look up the placement UUID from the ad_placements table
    const { data: placement } = await supabase
      .from("ad_placements")
      .select("id")
      .eq("placement_type", placementType)
      .single();

    if (!placement) {
      console.error("Placement not found:", placementType);
      redirect("/advertise?error=invalid_placement");
    }

    // Get current user
    const { data: { user } } = await supabase.auth.getUser();

    const { data: ad, error } = await supabase
      .from("ads")
      .insert({
        advertiser_id: user?.id,
        placement_id: placement.id,
        site_key: SITE_KEY,
        company_name: companyName,
        title,
        destination_url: destinationUrl,
        image_url: imageUrl,
        status: "pending_payment",
      })
      .select("id")
      .single();

    if (error || !ad) {
      console.error("Failed to create ad record:", error);
      redirect("/advertise?error=creation_failed");
    }

    const { createAdCheckoutSession } = await import("@vector/billing");

    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

    const session = await createAdCheckoutSession({
      placement: {
        placement_type: placementType,
        name: placementInfo.name,
        price_cents: placementInfo.price_cents,
      },
      adId: ad.id,
      siteKey: SITE_KEY,
      successUrl: `${baseUrl}/advertise/dashboard?success=true`,
      cancelUrl: `${baseUrl}/advertise/checkout?placement=${placementType}`,
    });

    if (session.url) {
      redirect(session.url);
    }
  } catch (err) {
    console.error("Ad checkout error:", err);
    redirect("/advertise/dashboard?success=true");
  }
}
