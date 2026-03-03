import type Stripe from "stripe";
import { stripe } from "./client";

export interface AdWebhookResult {
  event: "ad_checkout_completed" | "ad_subscription_deleted";
  adId: string | null;
  siteKey: string | null;
  subscriptionId: string | null;
  customerId: string | null;
}

export async function handleAdWebhookEvent(
  body: string | Buffer,
  signature: string,
): Promise<AdWebhookResult | null> {
  const webhookSecret = process.env.STRIPE_AD_WEBHOOK_SECRET ?? process.env.STRIPE_WEBHOOK_SECRET!;
  const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      if (session.metadata?.type !== "ad_subscription") return null;

      const customerId =
        typeof session.customer === "string"
          ? session.customer
          : (session.customer as Stripe.Customer | null)?.id ?? null;

      return {
        event: "ad_checkout_completed",
        adId: session.metadata?.ad_id ?? null,
        siteKey: session.metadata?.site_key ?? null,
        subscriptionId:
          typeof session.subscription === "string"
            ? session.subscription
            : (session.subscription as Stripe.Subscription | null)?.id ?? null,
        customerId,
      };
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      // Check all associated sessions to find our ad metadata
      const customerId =
        typeof subscription.customer === "string"
          ? subscription.customer
          : (subscription.customer as Stripe.Customer | null)?.id ?? null;

      return {
        event: "ad_subscription_deleted",
        adId: null, // Will be looked up by subscription_id in the webhook handler
        siteKey: null,
        subscriptionId: subscription.id,
        customerId,
      };
    }

    default:
      return null;
  }
}
