import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // Suppress unused variable lint — request is required by the middleware signature
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
  matcher: ["/dashboard/:path*"],
};
