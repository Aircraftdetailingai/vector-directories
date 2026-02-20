"use server";

import { revalidatePath } from "next/cache";

export async function approveProduct(
  formData: FormData,
): Promise<{ success: boolean; error?: string }> {
  try {
    const productId = formData.get("product_id") as string;
    if (!productId) {
      return { success: false, error: "Product ID is required." };
    }

    const { createBrowserClient } = await import("@vector/db");
    const client = createBrowserClient();

    const { error } = await client
      .from("store_products")
      .update({ status: "active", updated_at: new Date().toISOString() })
      .eq("id", productId);

    if (error) {
      console.error("Approve product error:", error);
      return { success: false, error: "Failed to approve product." };
    }

    revalidatePath("/admin/products");
    revalidatePath(`/admin/products/${productId}`);
    revalidatePath("/supplier/products");
    return { success: true };
  } catch (err) {
    console.error("approveProduct error:", err);
    return { success: false, error: "An unexpected error occurred." };
  }
}

export async function rejectProduct(
  formData: FormData,
): Promise<{ success: boolean; error?: string }> {
  try {
    const productId = formData.get("product_id") as string;
    if (!productId) {
      return { success: false, error: "Product ID is required." };
    }

    const { createBrowserClient } = await import("@vector/db");
    const client = createBrowserClient();

    const { error } = await client
      .from("store_products")
      .update({ status: "archived", updated_at: new Date().toISOString() })
      .eq("id", productId);

    if (error) {
      console.error("Reject product error:", error);
      return { success: false, error: "Failed to reject product." };
    }

    revalidatePath("/admin/products");
    revalidatePath(`/admin/products/${productId}`);
    revalidatePath("/supplier/products");
    return { success: true };
  } catch (err) {
    console.error("rejectProduct error:", err);
    return { success: false, error: "An unexpected error occurred." };
  }
}
