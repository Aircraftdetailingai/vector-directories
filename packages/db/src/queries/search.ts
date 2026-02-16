import type { SupabaseClient } from "@supabase/supabase-js";
import type { SearchParams, SearchResult } from "@vector/types";

export async function searchCompanies(
  client: SupabaseClient,
  params: SearchParams,
): Promise<SearchResult> {
  const {
    query,
    category,
    state,
    city,
    min_trust_score,
    tier,
    page = 1,
    per_page = 20,
    sort_by = "relevance",
    sort_order = "desc",
  } = params;

  const from = (page - 1) * per_page;
  const to = from + per_page - 1;

  let q = client.from("companies").select("*", { count: "exact" });

  if (query) {
    q = q.or(`name.ilike.%${query}%,description.ilike.%${query}%`);
  }
  if (category) {
    q = q.eq("category", category);
  }
  if (state) {
    q = q.eq("state", state);
  }
  if (city) {
    q = q.ilike("city", `%${city}%`);
  }
  if (min_trust_score !== undefined) {
    q = q.gte("trust_score", min_trust_score);
  }
  if (tier) {
    q = q.eq("tier", tier);
  }
  if (params.is_claimed !== undefined) {
    q = q.eq("is_claimed", params.is_claimed);
  }

  const orderColumn = sort_by === "relevance" ? "trust_score" : sort_by;
  q = q
    .order(orderColumn, { ascending: sort_order === "asc" })
    .range(from, to);

  const { data, error, count } = await q;

  if (error) throw error;

  const total = count ?? 0;

  return {
    companies: data ?? [],
    total,
    page,
    per_page,
    total_pages: Math.ceil(total / per_page),
  };
}
