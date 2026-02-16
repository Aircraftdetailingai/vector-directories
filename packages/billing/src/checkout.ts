import { stripe } from "./client";
import { TIER_PRODUCTS } from "./tiers";
import type { Tier } from "@vector/types";

export async function createCheckoutSession(options: {
  tier: Exclude<Tier, "basic">;
  customerId?: string;
  companyId: string;
  successUrl: string;
  cancelUrl: string;
}) {
  const product = TIER_PRODUCTS[options.tier];

  return stripe.checkout.sessions.create({
    mode: "subscription",
    customer: options.customerId,
    line_items: [{ price: product.priceId, quantity: 1 }],
    success_url: options.successUrl,
    cancel_url: options.cancelUrl,
    metadata: {
      company_id: options.companyId,
      tier: options.tier,
    },
  });
}

export async function createBillingPortalSession(options: {
  customerId: string;
  returnUrl: string;
}) {
  return stripe.billingPortal.sessions.create({
    customer: options.customerId,
    return_url: options.returnUrl,
  });
}
