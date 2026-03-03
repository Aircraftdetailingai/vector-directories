import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { adId, type } = await request.json();

    if (!adId || !type || !["impression", "click"].includes(type)) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const { createBrowserClient } = await import("@vector/db");
    const client = createBrowserClient();
    const today = new Date().toISOString().split("T")[0];

    if (type === "impression") {
      await client.rpc("increment_ad_impression", { p_ad_id: adId, p_date: today });
    } else {
      await client.rpc("increment_ad_click", { p_ad_id: adId, p_date: today });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Ad tracking error:", err);
    return NextResponse.json({ error: "Tracking failed" }, { status: 500 });
  }
}
