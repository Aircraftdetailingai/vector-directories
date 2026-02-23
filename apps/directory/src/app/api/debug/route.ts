import { NextResponse } from "next/server";
import { createElement } from "react";
import { renderToString } from "react-dom/server";

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

  // Test DB
  try {
    const { searchCompanies, createBrowserClient } = await import(
      "@vector/db"
    );
    const client = createBrowserClient();
    const result = await searchCompanies(client, {
      sort_by: "trust_score",
      sort_order: "desc",
      page: 1,
      per_page: 5,
    });
    results.db = "OK";
    results.dbTotal = result.total;
    results.dbCompanyCount = result.companies.length;
    if (result.companies.length > 0) {
      const c = result.companies[0];
      results.sampleCompany = {
        id: c.id,
        name: c.name,
        slug: c.slug,
        tier: c.tier,
        trust_score: c.trust_score,
        is_claimed: c.is_claimed,
        phone: c.phone,
        hasDescription: !!c.description,
        keys: Object.keys(c),
      };
    }
  } catch (e: unknown) {
    results.db = "FAILED";
    results.dbError = e instanceof Error
      ? { message: e.message, stack: e.stack?.split("\n").slice(0, 5) }
      : String(e);
  }

  // Test CompanyListingCard render
  try {
    const { CompanyListingCard } = await import(
      "../../[state]/components/company-listing-card"
    );
    const testCompany = {
      id: "test",
      name: "Test Co",
      slug: "test-co",
      description: "Test description",
      website: null,
      phone: "5551234567",
      email: null,
      logo_url: null,
      trust_score: 80,
      is_claimed: true,
      claimed_by: null,
      tier: "premium" as const,
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-01T00:00:00Z",
    };
    const html = renderToString(
      createElement(CompanyListingCard, { company: testCompany }),
    );
    results.cardRender = "OK";
    results.cardHtmlLength = html.length;
  } catch (e: unknown) {
    results.cardRender = "FAILED";
    results.cardError = e instanceof Error
      ? { message: e.message, stack: e.stack?.split("\n").slice(0, 8) }
      : String(e);
  }

  // Test Header render
  try {
    const { Header } = await import("../../components/header");
    const html = renderToString(createElement(Header));
    results.headerRender = "OK";
    results.headerHtmlLength = html.length;
  } catch (e: unknown) {
    results.headerRender = "FAILED";
    results.headerError = e instanceof Error
      ? { message: e.message, stack: e.stack?.split("\n").slice(0, 8) }
      : String(e);
  }

  // Test Footer render
  try {
    const { Footer } = await import("../../components/footer");
    const html = renderToString(createElement(Footer));
    results.footerRender = "OK";
    results.footerHtmlLength = html.length;
  } catch (e: unknown) {
    results.footerRender = "FAILED";
    results.footerError = e instanceof Error
      ? { message: e.message, stack: e.stack?.split("\n").slice(0, 8) }
      : String(e);
  }

  // Test the full page rendering flow (data fetch + JSX)
  try {
    const { searchCompanies, createBrowserClient } = await import(
      "@vector/db"
    );
    const client = createBrowserClient();
    const result = await searchCompanies(client, {
      state: "FL",
      sort_by: "trust_score",
      sort_order: "desc",
      page: 1,
      per_page: 20,
    });
    results.fullFlow = "OK";
    results.fullFlowTotal = result.total;
    results.fullFlowCompanies = result.companies.length;
  } catch (e: unknown) {
    results.fullFlow = "FAILED";
    results.fullFlowError = e instanceof Error
      ? { message: e.message, stack: e.stack?.split("\n").slice(0, 5) }
      : String(e);
  }

  return NextResponse.json(results, { status: 200 });
}
