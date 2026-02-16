import { z } from "zod";

// ─── Company ────────────────────────────────────────────────────────────────

export const companySchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  slug: z.string(),
  description: z.string().nullable(),
  website: z.string().url().nullable(),
  phone: z.string().nullable(),
  email: z.string().email().nullable(),
  logo_url: z.string().url().nullable(),
  trust_score: z.number().min(0).max(100).nullable(),
  is_claimed: z.boolean(),
  claimed_by: z.string().uuid().nullable(),
  tier: z.enum(["basic", "enhanced", "premium", "featured", "bundle_all"]),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export type Company = z.infer<typeof companySchema>;

// ─── Location ───────────────────────────────────────────────────────────────

export const locationSchema = z.object({
  id: z.string().uuid(),
  company_id: z.string().uuid(),
  name: z.string(),
  address_line1: z.string(),
  address_line2: z.string().nullable(),
  city: z.string(),
  state: z.string(),
  zip: z.string(),
  country: z.string().default("US"),
  lat: z.number().nullable(),
  lng: z.number().nullable(),
  phone: z.string().nullable(),
  is_headquarters: z.boolean().default(false),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export type Location = z.infer<typeof locationSchema>;

// ─── Listing ────────────────────────────────────────────────────────────────

export const listingSchema = z.object({
  id: z.string().uuid(),
  company_id: z.string().uuid(),
  location_id: z.string().uuid().nullable(),
  title: z.string(),
  slug: z.string(),
  description: z.string().nullable(),
  category: z.string(),
  status: z.enum(["active", "inactive", "pending", "archived"]),
  featured: z.boolean().default(false),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export type Listing = z.infer<typeof listingSchema>;

// ─── Search ─────────────────────────────────────────────────────────────────

export const searchParamsSchema = z.object({
  query: z.string().optional(),
  category: z.string().optional(),
  state: z.string().optional(),
  city: z.string().optional(),
  airport_code: z.string().optional(),
  min_trust_score: z.number().min(0).max(100).optional(),
  tier: z.enum(["basic", "enhanced", "premium", "featured", "bundle_all"]).optional(),
  is_claimed: z.boolean().optional(),
  page: z.number().int().positive().default(1),
  per_page: z.number().int().positive().max(100).default(20),
  sort_by: z
    .enum(["relevance", "trust_score", "name", "created_at"])
    .default("relevance"),
  sort_order: z.enum(["asc", "desc"]).default("desc"),
});

export type SearchParams = z.infer<typeof searchParamsSchema>;

export const searchResultSchema = z.object({
  companies: z.array(companySchema),
  total: z.number(),
  page: z.number(),
  per_page: z.number(),
  total_pages: z.number(),
});

export type SearchResult = z.infer<typeof searchResultSchema>;

// ─── Tier ───────────────────────────────────────────────────────────────────

export const tierSchema = z.enum(["basic", "enhanced", "premium", "featured", "bundle_all"]);
export type Tier = z.infer<typeof tierSchema>;

// ─── User ───────────────────────────────────────────────────────────────────

export const userProfileSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  full_name: z.string().nullable(),
  avatar_url: z.string().url().nullable(),
  role: z.enum(["user", "owner", "admin"]),
  company_id: z.string().uuid().nullable(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export type UserProfile = z.infer<typeof userProfileSchema>;

// ─── Company Photo ───────────────────────────────────────────────────────────

export const companyPhotoSchema = z.object({
  id: z.string().uuid(),
  company_id: z.string().uuid(),
  url: z.string().url(),
  alt_text: z.string().nullable(),
  sort_order: z.number().int().default(0),
  created_at: z.string().datetime(),
});

export type CompanyPhoto = z.infer<typeof companyPhotoSchema>;

// ─── Company Certification ───────────────────────────────────────────────────

export const companyCertificationSchema = z.object({
  id: z.string().uuid(),
  company_id: z.string().uuid(),
  name: z.string(),
  document_url: z.string().url().nullable(),
  type: z.enum(["insurance", "permit", "certification"]),
  expires_at: z.string().datetime().nullable(),
  created_at: z.string().datetime(),
});

export type CompanyCertification = z.infer<typeof companyCertificationSchema>;

// ─── Lead ────────────────────────────────────────────────────────────────────

export const leadSchema = z.object({
  id: z.string().uuid(),
  company_id: z.string().uuid(),
  name: z.string(),
  email: z.string().email(),
  phone: z.string().nullable(),
  message: z.string().nullable(),
  created_at: z.string().datetime(),
});

export type Lead = z.infer<typeof leadSchema>;
