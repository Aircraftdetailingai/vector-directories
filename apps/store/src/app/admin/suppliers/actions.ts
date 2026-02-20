"use server";

import { revalidatePath } from "next/cache";

export async function approveSupplier(
  formData: FormData,
): Promise<{ success: boolean; error?: string }> {
  try {
    const supplierId = formData.get("supplier_id") as string;
    if (!supplierId) {
      return { success: false, error: "Supplier ID is required." };
    }

    const { createBrowserClient } = await import("@vector/db");
    const client = createBrowserClient();

    const { error } = await client
      .from("store_suppliers")
      .update({
        is_approved: true,
        updated_at: new Date().toISOString(),
      })
      .eq("id", supplierId);

    if (error) {
      console.error("Approve supplier error:", error);
      return { success: false, error: "Failed to approve supplier." };
    }

    revalidatePath("/admin/suppliers");
    return { success: true };
  } catch (err) {
    console.error("approveSupplier error:", err);
    return { success: false, error: "An unexpected error occurred." };
  }
}

export async function disableSupplier(
  formData: FormData,
): Promise<{ success: boolean; error?: string }> {
  try {
    const supplierId = formData.get("supplier_id") as string;
    if (!supplierId) {
      return { success: false, error: "Supplier ID is required." };
    }

    const { createBrowserClient } = await import("@vector/db");
    const client = createBrowserClient();

    const { error } = await client
      .from("store_suppliers")
      .update({
        is_approved: false,
        updated_at: new Date().toISOString(),
      })
      .eq("id", supplierId);

    if (error) {
      console.error("Disable supplier error:", error);
      return { success: false, error: "Failed to disable supplier." };
    }

    revalidatePath("/admin/suppliers");
    return { success: true };
  } catch (err) {
    console.error("disableSupplier error:", err);
    return { success: false, error: "An unexpected error occurred." };
  }
}
