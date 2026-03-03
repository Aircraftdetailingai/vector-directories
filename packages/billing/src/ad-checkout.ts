import { stripe } from "./client";

export interface AdPlacement {
  placement_type: string;
  name: string;
  price_cents: number;
}

export async function createAdCheckoutSession(options: {
  placement: AdPlacement;
  adId: string;
  siteKey: string;
  customerEmail?: string;
  successUrl: string;
  cancelUrl: string;
}) {
  return stripe.checkout.sessions.create({
    mode: "subscription",
    customer_email: options.customerEmail,
    line_items: [
      {
        price_data: {
          currency: "usd",
          unit_amount: options.placement.price_cents,
          recurring: { interval: "month" },
          product_data: {
            name: `${options.placement.name} Ad — ${options.siteKey}`,
            description: `Monthly ${options.placement.name} advertising placement`,
          },
        },
        quantity: 1,
      },
    ],
    success_url: options.successUrl,
    cancel_url: options.cancelUrl,
    metadata: {
      ad_id: options.adId,
      site_key: options.siteKey,
      placement_type: options.placement.placement_type,
      type: "ad_subscription",
    },
  });
}
