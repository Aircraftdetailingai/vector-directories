import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
  }

  try {
    const { handleAdWebhookEvent } = await import("@vector/billing");
    const result = await handleAdWebhookEvent(body, signature);

    if (!result) {
      return NextResponse.json({ received: true });
    }

    const { createBrowserClient } = await import("@vector/db");
    const client = createBrowserClient();

    switch (result.event) {
      case "ad_checkout_completed": {
        if (result.adId) {
          await client
            .from("ads")
            .update({
              status: "active",
              stripe_subscription_id: result.subscriptionId,
              stripe_customer_id: result.customerId,
              started_at: new Date().toISOString(),
            })
            .eq("id", result.adId);
        }
        break;
      }

      case "ad_subscription_deleted": {
        if (result.subscriptionId) {
          await client
            .from("ads")
            .update({
              status: "cancelled",
              cancelled_at: new Date().toISOString(),
            })
            .eq("stripe_subscription_id", result.subscriptionId);
        }
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Stripe ad webhook error:", err);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 400 });
  }
}
