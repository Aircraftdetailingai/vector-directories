import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  void request;

  try {
    const { createBrowserClient } = await import("@vector/db");
    const supabase = createBrowserClient();
    await supabase.auth.getSession();
  } catch {
    // Auth package unavailable — allow through in dev
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/supplier/:path*", "/admin/:path*"],
};
