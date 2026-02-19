import type { SupabaseClient } from "@supabase/supabase-js";
import type { Listing } from "@vector/types";

export async function getListingById(
  client: SupabaseClient,
  id: string,
): Promise<Listing | null> {
  const { data, error } = await client
    .from("directory_listings")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}

export async function getListingBySlug(
  client: SupabaseClient,
  slug: string,
): Promise<Listing | null> {
  const { data, error } = await client
    .from("directory_listings")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) throw error;
  return data;
}

export async function getListingsByCompanyId(
  client: SupabaseClient,
  companyId: string,
): Promise<Listing[]> {
  const { data, error } = await client
    .from("directory_listings")
    .select("*")
    .eq("company_id", companyId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}
