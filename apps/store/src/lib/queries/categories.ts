import type { SupabaseClient } from "@supabase/supabase-js";
import type { StoreCategory } from "../types";

export async function getCategories(client: SupabaseClient): Promise<StoreCategory[]> {
  const { data, error } = await client
    .from("store_categories")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return (data ?? []) as StoreCategory[];
}

export async function getCategoryBySlug(
  client: SupabaseClient,
  slug: string,
): Promise<StoreCategory | null> {
  const { data, error } = await client
    .from("store_categories")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) return null;
  return data as StoreCategory;
}
