import type { SupabaseClient } from "@supabase/supabase-js";
import type { StoreProduct } from "../types";

interface ProductFilters {
  brandSlug?: string;
  categorySlug?: string;
  minPrice?: number;
  maxPrice?: number;
  query?: string;
  featured?: boolean;
  page?: number;
  perPage?: number;
  sortBy?: "featured" | "price_asc" | "price_desc" | "newest" | "name";
}

interface ProductResult {
  products: StoreProduct[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

export async function getProducts(
  client: SupabaseClient,
  filters: ProductFilters = {},
): Promise<ProductResult> {
  const {
    brandSlug,
    categorySlug,
    minPrice,
    maxPrice,
    query,
    featured,
    page = 1,
    perPage = 12,
    sortBy = "featured",
  } = filters;

  const from = (page - 1) * perPage;
  const to = from + perPage - 1;

  let q = client
    .from("store_products")
    .select("*, brand:store_brands(*), category:store_categories(*), images:store_product_images(*), variants:store_product_variants(*)", { count: "exact" })
    .eq("status", "active");

  if (query) {
    q = q.or(`name.ilike.%${query}%,description.ilike.%${query}%`);
  }
  if (brandSlug) {
    q = q.eq("brand.slug", brandSlug);
  }
  if (categorySlug) {
    q = q.eq("category.slug", categorySlug);
  }
  if (minPrice !== undefined) {
    q = q.gte("base_price", minPrice);
  }
  if (maxPrice !== undefined) {
    q = q.lte("base_price", maxPrice);
  }
  if (featured) {
    q = q.eq("is_featured", true);
  }

  switch (sortBy) {
    case "price_asc":
      q = q.order("base_price", { ascending: true });
      break;
    case "price_desc":
      q = q.order("base_price", { ascending: false });
      break;
    case "newest":
      q = q.order("created_at", { ascending: false });
      break;
    case "name":
      q = q.order("name", { ascending: true });
      break;
    default:
      q = q.order("is_featured", { ascending: false }).order("created_at", { ascending: false });
  }

  q = q.range(from, to);

  const { data, error, count } = await q;
  if (error) throw error;

  const total = count ?? 0;
  return {
    products: (data ?? []) as StoreProduct[],
    total,
    page,
    perPage,
    totalPages: Math.ceil(total / perPage),
  };
}

export async function getProductBySlug(
  client: SupabaseClient,
  slug: string,
): Promise<StoreProduct | null> {
  const { data, error } = await client
    .from("store_products")
    .select("*, brand:store_brands(*), category:store_categories(*), images:store_product_images(*), variants:store_product_variants(*)")
    .eq("slug", slug)
    .single();

  if (error) return null;
  return data as StoreProduct;
}

export async function getFeaturedProducts(
  client: SupabaseClient,
  limit = 8,
): Promise<StoreProduct[]> {
  const { data, error } = await client
    .from("store_products")
    .select("*, brand:store_brands(*), category:store_categories(*), images:store_product_images(*)")
    .eq("status", "active")
    .eq("is_featured", true)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data ?? []) as StoreProduct[];
}

export async function getProductsByBrand(
  client: SupabaseClient,
  brandId: string,
  page = 1,
  perPage = 12,
): Promise<ProductResult> {
  const from = (page - 1) * perPage;
  const to = from + perPage - 1;

  const { data, error, count } = await client
    .from("store_products")
    .select("*, brand:store_brands(*), category:store_categories(*), images:store_product_images(*), variants:store_product_variants(*)", { count: "exact" })
    .eq("status", "active")
    .eq("brand_id", brandId)
    .order("is_featured", { ascending: false })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) throw error;
  const total = count ?? 0;
  return { products: (data ?? []) as StoreProduct[], total, page, perPage, totalPages: Math.ceil(total / perPage) };
}

export async function getProductsByCategory(
  client: SupabaseClient,
  categoryId: string,
  page = 1,
  perPage = 12,
): Promise<ProductResult> {
  const from = (page - 1) * perPage;
  const to = from + perPage - 1;

  const { data, error, count } = await client
    .from("store_products")
    .select("*, brand:store_brands(*), category:store_categories(*), images:store_product_images(*), variants:store_product_variants(*)", { count: "exact" })
    .eq("status", "active")
    .eq("category_id", categoryId)
    .order("is_featured", { ascending: false })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) throw error;
  const total = count ?? 0;
  return { products: (data ?? []) as StoreProduct[], total, page, perPage, totalPages: Math.ceil(total / perPage) };
}

export async function getRelatedProducts(
  client: SupabaseClient,
  productId: string,
  categoryId: string | null,
  limit = 4,
): Promise<StoreProduct[]> {
  let q = client
    .from("store_products")
    .select("*, brand:store_brands(*), images:store_product_images(*)")
    .eq("status", "active")
    .neq("id", productId)
    .limit(limit);

  if (categoryId) {
    q = q.eq("category_id", categoryId);
  }

  const { data, error } = await q.order("is_featured", { ascending: false });
  if (error) throw error;
  return (data ?? []) as StoreProduct[];
}
