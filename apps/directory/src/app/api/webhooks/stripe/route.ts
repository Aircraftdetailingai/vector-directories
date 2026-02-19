import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 },
    );
  }

  try {
    const { handleWebhookEvent } = await import("@vector/billing");
    const result = await handleWebhookEvent(body, signature);

    if (!result) {
      return NextResponse.json({ received: true });
    }

    const { createBrowserClient } = await import("@vector/db");
    const client = createBrowserClient();

    switch (result.event) {
      /* ──────────────────────────────────────────────────────────────────
         checkout.session.completed — new subscription created
         ────────────────────────────────────────────────────────────────── */
      case "checkout.session.completed": {
        if (result.companyId) {
          // Update company tier
          await client
            .from("directory_companies")
            .update({
              tier: result.tier,
              stripe_customer_id: result.customerId,
            })
            .eq("id", result.companyId);
        }
        break;
      }

      /* ──────────────────────────────────────────────────────────────────
         customer.subscription.updated — upgrade or downgrade
         ────────────────────────────────────────────────────────────────── */
      case "customer.subscription.updated": {
        if (result.customerId) {
          await client
            .from("directory_companies")
            .update({ tier: result.tier })
            .eq("stripe_customer_id", result.customerId);
        }
        break;
      }

      /* ──────────────────────────────────────────────────────────────────
         customer.subscription.deleted — revert to basic
         ────────────────────────────────────────────────────────────────── */
      case "customer.subscription.deleted": {
        if (result.customerId) {
          await client
            .from("directory_companies")
            .update({ tier: "basic" })
            .eq("stripe_customer_id", result.customerId);
        }
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Stripe webhook error:", err);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 400 },
    );
  }
}
