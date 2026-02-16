import type { Tier } from "@vector/types";

export interface TierFeatureSet {
  maxListings: number;
  maxLocations: number;
  maxPhotos: number;
  analytics: boolean;
  prioritySupport: boolean;
  featuredPlacement: boolean;
  customBranding: boolean;
  apiAccess: boolean;
  photoGallery: boolean;
  leadCapture: boolean;
}

export const TIER_FEATURES: Record<Tier, TierFeatureSet> = {
  basic: {
    maxListings: 1,
    maxLocations: 1,
    maxPhotos: 0,
    analytics: false,
    prioritySupport: false,
    featuredPlacement: false,
    customBranding: false,
    apiAccess: false,
    photoGallery: false,
    leadCapture: false,
  },
  enhanced: {
    maxListings: 5,
    maxLocations: 3,
    maxPhotos: 5,
    analytics: true,
    prioritySupport: false,
    featuredPlacement: false,
    customBranding: false,
    apiAccess: false,
    photoGallery: true,
    leadCapture: false,
  },
  premium: {
    maxListings: 25,
    maxLocations: 10,
    maxPhotos: 20,
    analytics: true,
    prioritySupport: true,
    featuredPlacement: false,
    customBranding: true,
    apiAccess: false,
    photoGallery: true,
    leadCapture: true,
  },
  featured: {
    maxListings: 50,
    maxLocations: 25,
    maxPhotos: 50,
    analytics: true,
    prioritySupport: true,
    featuredPlacement: true,
    customBranding: true,
    apiAccess: false,
    photoGallery: true,
    leadCapture: true,
  },
  bundle_all: {
    maxListings: Infinity,
    maxLocations: Infinity,
    maxPhotos: Infinity,
    analytics: true,
    prioritySupport: true,
    featuredPlacement: true,
    customBranding: true,
    apiAccess: true,
    photoGallery: true,
    leadCapture: true,
  },
};

export function hasTierFeature(
  tier: Tier,
  feature: keyof TierFeatureSet,
): boolean {
  return !!TIER_FEATURES[tier][feature];
}
