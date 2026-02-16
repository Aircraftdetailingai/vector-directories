import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(_request: NextRequest) {
  // Refresh Supabase auth session cookie on dashboard routes.
  try {
    const { createBrowserClient } = await import("@vector/db");
    const client = createBrowserClient();
    await client.auth.getUser();
  } catch {
    // Auth refresh failed -- page-level requireAuth() will handle redirect
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
