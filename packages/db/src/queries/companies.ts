import type { SupabaseClient } from "@supabase/supabase-js";
import type { Company } from "@vector/types";

export async function getCompanyById(
  client: SupabaseClient,
  id: string,
): Promise<Company | null> {
  const { data, error } = await client
    .from("directory_companies")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}

export async function getCompanyBySlug(
  client: SupabaseClient,
  slug: string,
): Promise<Company | null> {
  const { data, error } = await client
    .from("directory_companies")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) throw error;
  return data;
}

export async function listCompanies(
  client: SupabaseClient,
  options: { page?: number; perPage?: number } = {},
): Promise<{ data: Company[]; count: number }> {
  const page = options.page ?? 1;
  const perPage = options.perPage ?? 20;
  const from = (page - 1) * perPage;
  const to = from + perPage - 1;

  const { data, error, count } = await client
    .from("directory_companies")
    .select("*", { count: "exact" })
    .range(from, to)
    .order("name");

  if (error) throw error;
  return { data: data ?? [], count: count ?? 0 };
}

export async function claimCompany(
  client: SupabaseClient,
  companyId: string,
  userId: string,
): Promise<void> {
  const { error } = await client
    .from("directory_companies")
    .update({ is_claimed: true, claimed_by: userId })
    .eq("id", companyId);

  if (error) throw error;
}

export async function getCitiesForState(
  client: SupabaseClient,
  stateCode: string,
): Promise<string[]> {
  const { data, error } = await client
    .from("directory_companies")
    .select("city")
    .eq("state", stateCode)
    .not("city", "is", null)
    .order("city");

  if (error) throw error;
  const unique = [...new Set((data ?? []).map((r: { city: string }) => r.city).filter(Boolean))];
  return unique;
}
