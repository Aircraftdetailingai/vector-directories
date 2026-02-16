import type { SupabaseClient } from "@supabase/supabase-js";
import type { CompanyCertification } from "@vector/types";

export async function getCertificationsByCompanyId(
  client: SupabaseClient,
  companyId: string,
): Promise<CompanyCertification[]> {
  const { data, error } = await client
    .from("company_certifications")
    .select("*")
    .eq("company_id", companyId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function addCertification(
  client: SupabaseClient,
  cert: {
    company_id: string;
    name: string;
    document_url?: string;
    type: "insurance" | "permit" | "certification";
    expires_at?: string;
  },
): Promise<CompanyCertification> {
  const { data, error } = await client
    .from("company_certifications")
    .insert(cert)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteCertification(
  client: SupabaseClient,
  certId: string,
): Promise<void> {
  const { error } = await client
    .from("company_certifications")
    .delete()
    .eq("id", certId);

  if (error) throw error;
}
