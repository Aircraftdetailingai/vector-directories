import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  // ── Auth: require OUTREACH_API_KEY ──────────────────────────────────────
  const authHeader = request.headers.get("authorization");
  const expectedKey = process.env.OUTREACH_API_KEY;

  if (!expectedKey || authHeader !== `Bearer ${expectedKey}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { createBrowserClient } = await import("@vector/db");
    const client = createBrowserClient();

    // ── Query all unclaimed companies not yet emailed ─────────────────────
    const { data: companies, error: queryError } = await client
      .from("companies")
      .select("id, name, slug, email")
      .eq("is_claimed", false)
      .not("email", "is", null)
      .is("emailed_at", null)
      .order("created_at", { ascending: true });

    if (queryError) throw queryError;

    if (!companies || companies.length === 0) {
      return NextResponse.json({ sent: 0, failed: 0, total: 0 });
    }

    // ── Send emails ───────────────────────────────────────────────────────
    const { sendEmail, OutreachEmail } = await import("@vector/email");
    const React = await import("react");
    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

    let sent = 0;
    let failed = 0;

    for (const company of companies) {
      try {
        await sendEmail({
          to: company.email,
          subject:
            "Your aircraft detailing business is listed on Aircraft Detailing Directory",
          react: React.createElement(OutreachEmail, {
            companyName: company.name,
            claimUrl: `${baseUrl}/claim/${company.slug}`,
            siteUrl: baseUrl,
          }),
        });

        await client
          .from("companies")
          .update({ emailed_at: new Date().toISOString() })
          .eq("id", company.id);

        sent++;
      } catch (err) {
        console.error(`Failed to email ${company.email}:`, err);
        failed++;
      }
    }

    return NextResponse.json({ sent, failed, total: companies.length });
  } catch (err) {
    console.error("Outreach send error:", err);
    return NextResponse.json(
      { error: "Failed to process outreach" },
      { status: 500 },
    );
  }
}
