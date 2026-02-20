import type { SupabaseClient } from "@supabase/supabase-js";
import type { StoreSupplier, StoreProduct } from "../types";

export async function getSupplierByUserId(
  client: SupabaseClient,
  userId: string,
): Promise<StoreSupplier | null> {
  const { data, error } = await client
    .from("store_suppliers")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error) return null;
  return data as StoreSupplier;
}

export async function getSupplierProducts(
  client: SupabaseClient,
  supplierId: string,
  page = 1,
  perPage = 20,
): Promise<{ products: StoreProduct[]; total: number }> {
  const from = (page - 1) * perPage;
  const to = from + perPage - 1;

  const { data, error, count } = await client
    .from("store_products")
    .select("*, brand:store_brands(*), category:store_categories(*), images:store_product_images(*), variants:store_product_variants(*)", { count: "exact" })
    .eq("supplier_id", supplierId)
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) throw error;
  return { products: (data ?? []) as StoreProduct[], total: count ?? 0 };
}

export async function getAllSuppliers(
  client: SupabaseClient,
): Promise<StoreSupplier[]> {
  const { data, error } = await client
    .from("store_suppliers")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as StoreSupplier[];
}

export async function getPendingProducts(
  client: SupabaseClient,
): Promise<StoreProduct[]> {
  const { data, error } = await client
    .from("store_products")
    .select("*, brand:store_brands(*), category:store_categories(*), images:store_product_images(*)")
    .eq("status", "draft")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as StoreProduct[];
}
