import type { Tier } from "@vector/types";

export interface TierProduct {
  tier: Tier;
  name: string;
  priceId: string;
  productId: string;
  monthlyPrice: number;
}

export const TIER_PRODUCTS: Record<Exclude<Tier, "basic">, TierProduct> = {
  enhanced: {
    tier: "enhanced",
    name: "Enhanced",
    priceId: process.env.STRIPE_ENHANCED_PRICE_ID ?? "price_enhanced_placeholder",
    productId: process.env.STRIPE_ENHANCED_PRODUCT_ID ?? "prod_enhanced_placeholder",
    monthlyPrice: 49,
  },
  premium: {
    tier: "premium",
    name: "Premium",
    priceId: process.env.STRIPE_PREMIUM_PRICE_ID ?? "price_premium_placeholder",
    productId: process.env.STRIPE_PREMIUM_PRODUCT_ID ?? "prod_premium_placeholder",
    monthlyPrice: 129,
  },
  featured: {
    tier: "featured",
    name: "Featured",
    priceId: process.env.STRIPE_FEATURED_PRICE_ID ?? "price_featured_placeholder",
    productId: process.env.STRIPE_FEATURED_PRODUCT_ID ?? "prod_featured_placeholder",
    monthlyPrice: 249,
  },
  bundle_all: {
    tier: "bundle_all",
    name: "Bundle All",
    priceId: process.env.STRIPE_BUNDLE_ALL_PRICE_ID ?? "price_bundle_all_placeholder",
    productId: process.env.STRIPE_BUNDLE_ALL_PRODUCT_ID ?? "prod_bundle_all_placeholder",
    monthlyPrice: 349,
  },
};

export function getTierFromPriceId(priceId: string): Tier | null {
  for (const product of Object.values(TIER_PRODUCTS)) {
    if (product.priceId === priceId) return product.tier;
  }
  return null;
}
