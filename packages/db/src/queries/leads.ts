import type { SupabaseClient } from "@supabase/supabase-js";
import type { Lead } from "@vector/types";

export async function getLeadsByCompanyId(
  client: SupabaseClient,
  companyId: string,
): Promise<Lead[]> {
  const { data, error } = await client
    .from("directory_leads")
    .select("*")
    .eq("company_id", companyId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}
