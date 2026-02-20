"use server";

import { revalidatePath } from "next/cache";
import type { StoreOrder } from "@/lib/types";

export async function updateOrderStatus(
  formData: FormData,
): Promise<{ success: boolean; error?: string }> {
  try {
    const orderId = formData.get("order_id") as string;
    const status = formData.get("status") as StoreOrder["status"];

    if (!orderId) {
      return { success: false, error: "Order ID is required." };
    }

    if (!status) {
      return { success: false, error: "Status is required." };
    }

    const validStatuses: StoreOrder["status"][] = [
      "pending",
      "paid",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
      "refunded",
    ];

    if (!validStatuses.includes(status)) {
      return { success: false, error: "Invalid status value." };
    }

    const { createBrowserClient } = await import("@vector/db");
    const { updateOrderStatus: updateStatus } = await import(
      "@/lib/queries/orders"
    );
    const client = createBrowserClient();

    await updateStatus(client, orderId, status);

    revalidatePath(`/admin/orders/${orderId}`);
    revalidatePath("/admin/orders");
    revalidatePath("/supplier/orders");
    return { success: true };
  } catch (err) {
    console.error("updateOrderStatus error:", err);
    return { success: false, error: "An unexpected error occurred." };
  }
}
