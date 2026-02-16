import { NextResponse } from "next/server";

export async function POST() {
  try {
    const { getUser } = await import("@vector/auth");
    const user = await getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { createBrowserClient } = await import("@vector/db");
    const client = createBrowserClient();

    // Look up the user's company to find the Stripe customer ID
    const { data: profile } = await client
      .from("user_profiles")
      .select("company_id")
      .eq("id", user.id)
      .single();

    if (!profile?.company_id) {
      return NextResponse.json(
        { error: "No company linked to account" },
        { status: 400 },
      );
    }

    const { data: company } = await client
      .from("companies")
      .select("stripe_customer_id")
      .eq("id", profile.company_id)
      .single();

    if (!company?.stripe_customer_id) {
      return NextResponse.json(
        { error: "No billing account found. Please subscribe first." },
        { status: 400 },
      );
    }

    const { createBillingPortalSession } = await import("@vector/billing");
    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

    const session = await createBillingPortalSession({
      customerId: company.stripe_customer_id,
      returnUrl: `${baseUrl}/dashboard/upgrade`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Billing portal error:", err);
    return NextResponse.json(
      { error: "Failed to create portal session" },
      { status: 500 },
    );
  }
}
