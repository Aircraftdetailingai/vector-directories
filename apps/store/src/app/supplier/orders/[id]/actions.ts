"use server";

import { revalidatePath } from "next/cache";

export async function updateTracking(
  formData: FormData,
): Promise<{ success: boolean; error?: string }> {
  try {
    const orderId = formData.get("order_id") as string;
    const trackingNumber = formData.get("tracking_number") as string;
    const trackingUrl = (formData.get("tracking_url") as string) || null;

    if (!orderId) {
      return { success: false, error: "Order ID is required." };
    }

    if (!trackingNumber?.trim()) {
      return { success: false, error: "Tracking number is required." };
    }

    const { createBrowserClient } = await import("@vector/db");
    const { updateOrderTracking } = await import("@/lib/queries/orders");
    const client = createBrowserClient();

    await updateOrderTracking(client, orderId, trackingNumber.trim(), trackingUrl);

    revalidatePath(`/supplier/orders/${orderId}`);
    revalidatePath("/supplier/orders");
    return { success: true };
  } catch (err) {
    console.error("updateTracking error:", err);
    return { success: false, error: "An unexpected error occurred." };
  }
}
