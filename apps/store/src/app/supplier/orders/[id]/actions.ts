"use server";

import { revalidatePath } from "next/cache";

export async function updateTracking(formData: FormData): Promise<void> {
  const orderId = formData.get("order_id") as string;
  const trackingNumber = formData.get("tracking_number") as string;
  const trackingUrl = (formData.get("tracking_url") as string) || null;

  if (!orderId || !trackingNumber?.trim()) return;

  try {
    const { createBrowserClient } = await import("@vector/db");
    const { updateOrderTracking } = await import("@/lib/queries/orders");
    const client = createBrowserClient();
    await updateOrderTracking(client, orderId, trackingNumber.trim(), trackingUrl);
  } catch (err) {
    console.error("updateTracking error:", err);
  }

  revalidatePath(`/supplier/orders/${orderId}`);
  revalidatePath("/supplier/orders");
}
