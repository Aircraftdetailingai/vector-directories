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

  // Test DB query - no filters
  try {
    const { searchCompanies, createBrowserClient } = await import(
      "@vector/db"
    );
    const client = createBrowserClient();
    const result = await searchCompanies(client, {
      sort_by: "trust_score",
      sort_order: "desc",
      page: 1,
      per_page: 3,
    });
    results.db = "OK";
    results.dbTotal = result.total;
    if (result.companies[0]) {
      results.sample = {
        keys: Object.keys(result.companies[0]),
        name: result.companies[0].name,
        tier: result.companies[0].tier,
      };
    }
  } catch (e: unknown) {
    results.db = "FAILED";
    results.dbError = e instanceof Error
      ? { message: e.message, stack: e.stack?.split("\n").slice(0, 5) }
      : String(e);
  }

  // Test importing key modules
  const modules = [
    "@vector/types",
    "@vector/utils",
    "@vector/db",
  ];
  for (const mod of modules) {
    try {
      const m = await import(mod);
      results[`import:${mod}`] = Object.keys(m).slice(0, 10);
    } catch (e: unknown) {
      results[`import:${mod}`] = e instanceof Error ? e.message : String(e);
    }
  }

  return NextResponse.json(results, { status: 200 });
}
