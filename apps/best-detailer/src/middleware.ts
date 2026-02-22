import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SITE_KEY = "best-detailer";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Auth session refresh for protected routes
  if (pathname.startsWith("/dashboard")) {
    try {
      const { createBrowserClient } = await import("@vector/db");
      const client = createBrowserClient();
      await client.auth.getUser();
    } catch {
      // Auth refresh failed
    }
  }

  // Page view tracking for actual page routes
  if (
    !pathname.startsWith("/api") &&
    !pathname.startsWith("/_next") &&
    !pathname.includes(".")
  ) {
    try {
      const { createBrowserClient } = await import("@vector/db");
      const client = createBrowserClient();
      const today = new Date().toISOString().split("T")[0];
      await client.rpc("increment_page_view", {
        p_site_key: SITE_KEY,
        p_date: today,
      });
    } catch {
      // Page view tracking failed silently
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon\\.ico|.*\\\\..*).*)" ],
};
