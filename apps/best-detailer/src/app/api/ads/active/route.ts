import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SITE_KEY = "best-detailer";

export async function GET(request: NextRequest) {
  const placement = request.nextUrl.searchParams.get("placement");

  try {
    const { createBrowserClient } = await import("@vector/db");
    const client = createBrowserClient();

    let query = client
      .from("ads")
      .select("id, title, description, destination_url, image_url, company_name, placement_id")
      .eq("site_key", SITE_KEY)
      .eq("status", "active");

    const { data, error } = await query;
    if (error) throw error;

    return NextResponse.json({ ads: data ?? [] });
  } catch (err) {
    console.error("Error fetching ads:", err);
    return NextResponse.json({ ads: [] });
  }
}
