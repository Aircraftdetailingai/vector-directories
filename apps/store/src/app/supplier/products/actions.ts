"use server";

import { revalidatePath } from "next/cache";

export async function createProduct(
  formData: FormData,
): Promise<{ success: boolean; error?: string }> {
  try {
    const name = formData.get("name") as string;
    const slug = formData.get("slug") as string;
    const shortDescription = formData.get("short_description") as string;
    const description = formData.get("description") as string;
    const basePrice = parseFloat(formData.get("base_price") as string);
    const compareAtPrice = formData.get("compare_at_price")
      ? parseFloat(formData.get("compare_at_price") as string)
      : null;
    const brandId = (formData.get("brand_id") as string) || null;
    const categoryId = (formData.get("category_id") as string) || null;
    const sku = (formData.get("sku") as string) || null;
    const tags = (formData.get("tags") as string)
      ?.split(",")
      .map((t) => t.trim())
      .filter(Boolean) ?? [];
    const weightOz = formData.get("weight_oz")
      ? parseFloat(formData.get("weight_oz") as string)
      : null;
    const length = formData.get("length")
      ? parseFloat(formData.get("length") as string)
      : null;
    const width = formData.get("width")
      ? parseFloat(formData.get("width") as string)
      : null;
    const height = formData.get("height")
      ? parseFloat(formData.get("height") as string)
      : null;
    const supplierId = formData.get("supplier_id") as string;
    const status = (formData.get("status") as string) || "draft";

    if (!name || !slug || !supplierId) {
      return { success: false, error: "Name, slug, and supplier are required." };
    }

    if (isNaN(basePrice) || basePrice <= 0) {
      return { success: false, error: "A valid base price is required." };
    }

    const dimensionsJson =
      length || width || height
        ? { length: length ?? 0, width: width ?? 0, height: height ?? 0 }
        : null;

    const { createBrowserClient } = await import("@vector/db");
    const client = createBrowserClient();

    // Insert the product
    const { data: product, error: productError } = await client
      .from("store_products")
      .insert({
        supplier_id: supplierId,
        brand_id: brandId,
        category_id: categoryId,
        name,
        slug,
        description: description || null,
        short_description: shortDescription || null,
        base_price: basePrice,
        compare_at_price: compareAtPrice,
        sku,
        status,
        is_featured: false,
        weight_oz: weightOz,
        dimensions_json: dimensionsJson,
        tags,
      })
      .select("id")
      .single();

    if (productError) {
      console.error("Product insert error:", productError);
      return { success: false, error: "Failed to create product." };
    }

    // Insert variants
    const variantCount = parseInt(
      (formData.get("variant_count") as string) || "0",
      10,
    );
    for (let i = 0; i < variantCount; i++) {
      const variantName = formData.get(`variant_name_${i}`) as string;
      const variantSku = (formData.get(`variant_sku_${i}`) as string) || null;
      const variantPrice = parseFloat(
        formData.get(`variant_price_${i}`) as string,
      );
      const variantStock = parseInt(
        (formData.get(`variant_stock_${i}`) as string) || "0",
        10,
      );

      if (variantName && !isNaN(variantPrice)) {
        await client.from("store_product_variants").insert({
          product_id: product.id,
          name: variantName,
          sku: variantSku,
          price: variantPrice,
          compare_at_price: null,
          stock_quantity: variantStock,
          sort_order: i,
        });
      }
    }

    // Insert images
    const imageCount = parseInt(
      (formData.get("image_count") as string) || "0",
      10,
    );
    for (let i = 0; i < imageCount; i++) {
      const imageUrl = formData.get(`image_url_${i}`) as string;
      const imageAlt = (formData.get(`image_alt_${i}`) as string) || null;
      const isPrimary = formData.get(`image_primary_${i}`) === "true";

      if (imageUrl) {
        await client.from("store_product_images").insert({
          product_id: product.id,
          url: imageUrl,
          alt_text: imageAlt,
          sort_order: i,
          is_primary: isPrimary,
        });
      }
    }

    revalidatePath("/supplier/products");
    return { success: true };
  } catch (err) {
    console.error("createProduct error:", err);
    return { success: false, error: "An unexpected error occurred." };
  }
}

export async function updateProduct(
  formData: FormData,
): Promise<{ success: boolean; error?: string }> {
  try {
    const productId = formData.get("product_id") as string;
    if (!productId) {
      return { success: false, error: "Product ID is required." };
    }

    const name = formData.get("name") as string;
    const slug = formData.get("slug") as string;
    const shortDescription = formData.get("short_description") as string;
    const description = formData.get("description") as string;
    const basePrice = parseFloat(formData.get("base_price") as string);
    const compareAtPrice = formData.get("compare_at_price")
      ? parseFloat(formData.get("compare_at_price") as string)
      : null;
    const brandId = (formData.get("brand_id") as string) || null;
    const categoryId = (formData.get("category_id") as string) || null;
    const sku = (formData.get("sku") as string) || null;
    const tags = (formData.get("tags") as string)
      ?.split(",")
      .map((t) => t.trim())
      .filter(Boolean) ?? [];
    const weightOz = formData.get("weight_oz")
      ? parseFloat(formData.get("weight_oz") as string)
      : null;
    const length = formData.get("length")
      ? parseFloat(formData.get("length") as string)
      : null;
    const width = formData.get("width")
      ? parseFloat(formData.get("width") as string)
      : null;
    const height = formData.get("height")
      ? parseFloat(formData.get("height") as string)
      : null;
    const status = (formData.get("status") as string) || "draft";

    if (!name || !slug) {
      return { success: false, error: "Name and slug are required." };
    }

    if (isNaN(basePrice) || basePrice <= 0) {
      return { success: false, error: "A valid base price is required." };
    }

    const dimensionsJson =
      length || width || height
        ? { length: length ?? 0, width: width ?? 0, height: height ?? 0 }
        : null;

    const { createBrowserClient } = await import("@vector/db");
    const client = createBrowserClient();

    const { error: updateError } = await client
      .from("store_products")
      .update({
        brand_id: brandId,
        category_id: categoryId,
        name,
        slug,
        description: description || null,
        short_description: shortDescription || null,
        base_price: basePrice,
        compare_at_price: compareAtPrice,
        sku,
        status,
        weight_oz: weightOz,
        dimensions_json: dimensionsJson,
        tags,
        updated_at: new Date().toISOString(),
      })
      .eq("id", productId);

    if (updateError) {
      console.error("Product update error:", updateError);
      return { success: false, error: "Failed to update product." };
    }

    // Remove old variants and re-insert
    await client
      .from("store_product_variants")
      .delete()
      .eq("product_id", productId);

    const variantCount = parseInt(
      (formData.get("variant_count") as string) || "0",
      10,
    );
    for (let i = 0; i < variantCount; i++) {
      const variantName = formData.get(`variant_name_${i}`) as string;
      const variantSku = (formData.get(`variant_sku_${i}`) as string) || null;
      const variantPrice = parseFloat(
        formData.get(`variant_price_${i}`) as string,
      );
      const variantStock = parseInt(
        (formData.get(`variant_stock_${i}`) as string) || "0",
        10,
      );

      if (variantName && !isNaN(variantPrice)) {
        await client.from("store_product_variants").insert({
          product_id: productId,
          name: variantName,
          sku: variantSku,
          price: variantPrice,
          compare_at_price: null,
          stock_quantity: variantStock,
          sort_order: i,
        });
      }
    }

    // Remove old images and re-insert
    await client
      .from("store_product_images")
      .delete()
      .eq("product_id", productId);

    const imageCount = parseInt(
      (formData.get("image_count") as string) || "0",
      10,
    );
    for (let i = 0; i < imageCount; i++) {
      const imageUrl = formData.get(`image_url_${i}`) as string;
      const imageAlt = (formData.get(`image_alt_${i}`) as string) || null;
      const isPrimary = formData.get(`image_primary_${i}`) === "true";

      if (imageUrl) {
        await client.from("store_product_images").insert({
          product_id: productId,
          url: imageUrl,
          alt_text: imageAlt,
          sort_order: i,
          is_primary: isPrimary,
        });
      }
    }

    revalidatePath("/supplier/products");
    revalidatePath(`/supplier/products/${productId}`);
    return { success: true };
  } catch (err) {
    console.error("updateProduct error:", err);
    return { success: false, error: "An unexpected error occurred." };
  }
}

export async function archiveProduct(
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
      console.error("Archive product error:", error);
      return { success: false, error: "Failed to archive product." };
    }

    revalidatePath("/supplier/products");
    return { success: true };
  } catch (err) {
    console.error("archiveProduct error:", err);
    return { success: false, error: "An unexpected error occurred." };
  }
}
