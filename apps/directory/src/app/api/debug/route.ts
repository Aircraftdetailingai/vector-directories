import { NextResponse } from "next/server";

export async function GET() {
  const results: Record<string, unknown> = {};

  // Check env vars
  results.env = {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL
      ? "SET"
      : "MISSING",
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      ? "SET"
      : "MISSING",
  };

  // Try importing @vector/db
  try {
    const mod = await import("@vector/db");
    results.dbImport = "OK";
    results.dbExports = Object.keys(mod);
  } catch (e: unknown) {
    results.dbImport = "FAILED";
    results.dbImportError =
      e instanceof Error ? e.message : String(e);
  }

  // Try creating client
  try {
    const { createBrowserClient } = await import("@vector/db");
    const client = createBrowserClient();
    results.clientCreate = "OK";

    // Try a simple query
    const { data, error } = await client
      .from("directory_companies")
      .select("id")
      .limit(1);

    if (error) {
      results.query = "ERROR";
      results.queryError = error.message;
    } else {
      results.query = "OK";
      results.queryCount = data?.length ?? 0;
    }
  } catch (e: unknown) {
    results.clientCreate = "FAILED";
    results.clientError =
      e instanceof Error ? e.message : String(e);
  }

  // Try the full searchCompanies flow
  try {
    const { searchCompanies, createBrowserClient } = await import(
      "@vector/db"
    );
    const client = createBrowserClient();
    const result = await searchCompanies(client, {
      state: "TX",
      sort_by: "trust_score",
      sort_order: "desc",
      page: 1,
      per_page: 5,
    });
    results.searchCompanies = "OK";
    results.searchTotal = result.total;
  } catch (e: unknown) {
    results.searchCompanies = "FAILED";
    results.searchError =
      e instanceof Error ? e.message : String(e);
  }

  return NextResponse.json(results, { status: 200 });
}
