import type { SupabaseClient } from "@supabase/supabase-js";
import type { StoreBrand } from "../types";

export async function getBrands(client: SupabaseClient): Promise<StoreBrand[]> {
  const { data, error } = await client
    .from("store_brands")
    .select("*")
    .order("name", { ascending: true });

  if (error) throw error;
  return (data ?? []) as StoreBrand[];
}

export async function getBrandBySlug(
  client: SupabaseClient,
  slug: string,
): Promise<StoreBrand | null> {
  const { data, error } = await client
    .from("store_brands")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) return null;
  return data as StoreBrand;
}
