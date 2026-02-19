import type { SupabaseClient } from "@supabase/supabase-js";
import type { CompanyPhoto } from "@vector/types";

export async function getPhotosByCompanyId(
  client: SupabaseClient,
  companyId: string,
): Promise<CompanyPhoto[]> {
  const { data, error } = await client
    .from("company_media")
    .select("*")
    .eq("company_id", companyId)
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function addPhoto(
  client: SupabaseClient,
  photo: {
    company_id: string;
    url: string;
    alt_text?: string;
    sort_order?: number;
  },
): Promise<CompanyPhoto> {
  const { data, error } = await client
    .from("company_media")
    .insert(photo)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deletePhoto(
  client: SupabaseClient,
  photoId: string,
): Promise<void> {
  const { error } = await client
    .from("company_media")
    .delete()
    .eq("id", photoId);

  if (error) throw error;
}
