import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const redirectTo = searchParams.get("redirect") ?? "/";
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  if (code) {
    try {
      const { createBrowserClient } = await import("@vector/db");
      const supabase = createBrowserClient();
      await supabase.auth.exchangeCodeForSession(code);
    } catch (err) {
      console.error("Auth callback error:", err);
    }
  }

  return NextResponse.redirect(new URL(redirectTo, baseUrl));
}
