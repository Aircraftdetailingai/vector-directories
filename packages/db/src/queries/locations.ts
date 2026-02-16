import type { SupabaseClient } from "@supabase/supabase-js";
import type { Location } from "@vector/types";

export async function getLocationsByCompanyId(
  client: SupabaseClient,
  companyId: string,
): Promise<Location[]> {
  const { data, error } = await client
    .from("locations")
    .select("*")
    .eq("company_id", companyId)
    .order("is_headquarters", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function getLocationById(
  client: SupabaseClient,
  id: string,
): Promise<Location | null> {
  const { data, error } = await client
    .from("locations")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}
