import type Stripe from "stripe";
import type { Tier } from "@vector/types";
import { stripe } from "./client";
import { getTierFromPriceId } from "./tiers";

export interface WebhookResult {
  event:
    | "checkout.session.completed"
    | "customer.subscription.updated"
    | "customer.subscription.deleted";
  companyId: string | null;
  tier: Tier;
  customerId: string | null;
}

export async function handleWebhookEvent(
  body: string | Buffer,
  signature: string,
): Promise<WebhookResult | null> {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
  const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const companyId = session.metadata?.company_id ?? null;
      const tier = (session.metadata?.tier as Tier) ?? "basic";
      const customerId =
        typeof session.customer === "string"
          ? session.customer
          : (session.customer as Stripe.Customer | null)?.id ?? null;

      return {
        event: "checkout.session.completed",
        companyId,
        tier,
        customerId,
      };
    }

    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId =
        typeof subscription.customer === "string"
          ? subscription.customer
          : (subscription.customer as Stripe.Customer | null)?.id ?? null;

      const priceId = subscription.items.data[0]?.price?.id;
      const tier = priceId ? getTierFromPriceId(priceId) ?? "basic" : "basic";

      return {
        event: "customer.subscription.updated",
        companyId: null,
        tier,
        customerId,
      };
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId =
        typeof subscription.customer === "string"
          ? subscription.customer
          : (subscription.customer as Stripe.Customer | null)?.id ?? null;

      return {
        event: "customer.subscription.deleted",
        companyId: null,
        tier: "basic",
        customerId,
      };
    }

    default:
      return null;
  }
}
