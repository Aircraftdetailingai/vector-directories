"use client";

import { useCallback, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { StoreBrand, StoreCategory, StoreProduct } from "@/lib/types";
import { createProduct, updateProduct } from "../../actions";

interface ProductFormProps {
  brands: StoreBrand[];
  categories: StoreCategory[];
  supplierId: string;
  product?: StoreProduct;
}

interface VariantRow {
  name: string;
  sku: string;
  price: string;
  stock: string;
}

interface ImageRow {
  url: string;
  alt: string;
  isPrimary: boolean;
}

export function ProductForm({
  brands,
  categories,
  supplierId,
  product,
}: ProductFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const isEdit = !!product;

  const [name, setName] = useState(product?.name ?? "");
  const [slug, setSlug] = useState(product?.slug ?? "");
  const [shortDescription, setShortDescription] = useState(
    product?.short_description ?? "",
  );
  const [description, setDescription] = useState(product?.description ?? "");
  const [basePrice, setBasePrice] = useState(
    product?.base_price?.toString() ?? "",
  );
  const [compareAtPrice, setCompareAtPrice] = useState(
    product?.compare_at_price?.toString() ?? "",
  );
  const [brandId, setBrandId] = useState(product?.brand_id ?? "");
  const [categoryId, setCategoryId] = useState(product?.category_id ?? "");
  const [sku, setSku] = useState(product?.sku ?? "");
  const [tags, setTags] = useState(product?.tags?.join(", ") ?? "");
  const [weightOz, setWeightOz] = useState(
    product?.weight_oz?.toString() ?? "",
  );
  const [length, setLength] = useState(
    product?.dimensions_json?.length?.toString() ?? "",
  );
  const [width, setWidth] = useState(
    product?.dimensions_json?.width?.toString() ?? "",
  );
  const [height, setHeight] = useState(
    product?.dimensions_json?.height?.toString() ?? "",
  );

  const [variants, setVariants] = useState<VariantRow[]>(
    product?.variants?.map((v) => ({
      name: v.name,
      sku: v.sku ?? "",
      price: v.price.toString(),
      stock: v.stock_quantity.toString(),
    })) ?? [{ name: "", sku: "", price: "", stock: "0" }],
  );

  const [images, setImages] = useState<ImageRow[]>(
    product?.images?.map((img) => ({
      url: img.url,
      alt: img.alt_text ?? "",
      isPrimary: img.is_primary,
    })) ?? [{ url: "", alt: "", isPrimary: true }],
  );

  const generateSlug = useCallback((value: string) => {
    return value
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  }, []);

  function handleNameChange(value: string) {
    setName(value);
    if (!isEdit) {
      setSlug(generateSlug(value));
    }
  }

  function addVariant() {
    setVariants((prev) => [...prev, { name: "", sku: "", price: "", stock: "0" }]);
  }

  function removeVariant(index: number) {
    setVariants((prev) => prev.filter((_, i) => i !== index));
  }

  function updateVariant(
    index: number,
    field: keyof VariantRow,
    value: string,
  ) {
    setVariants((prev) =>
      prev.map((v, i) => (i === index ? { ...v, [field]: value } : v)),
    );
  }

  function addImage() {
    setImages((prev) => [...prev, { url: "", alt: "", isPrimary: false }]);
  }

  function removeImage(index: number) {
    setImages((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      if (updated.length > 0 && !updated.some((img) => img.isPrimary)) {
        updated[0].isPrimary = true;
      }
      return updated;
    });
  }

  function updateImage(index: number, field: keyof ImageRow, value: string | boolean) {
    setImages((prev) =>
      prev.map((img, i) => {
        if (field === "isPrimary" && value === true) {
          return { ...img, isPrimary: i === index };
        }
        return i === index ? { ...img, [field]: value } : img;
      }),
    );
  }

  function handleSubmit(submitStatus: string) {
    setError(null);

    const formData = new FormData();
    if (isEdit && product) {
      formData.set("product_id", product.id);
    }
    formData.set("supplier_id", supplierId);
    formData.set("name", name);
    formData.set("slug", slug);
    formData.set("short_description", shortDescription);
    formData.set("description", description);
    formData.set("base_price", basePrice);
    if (compareAtPrice) formData.set("compare_at_price", compareAtPrice);
    formData.set("brand_id", brandId);
    formData.set("category_id", categoryId);
    if (sku) formData.set("sku", sku);
    formData.set("tags", tags);
    if (weightOz) formData.set("weight_oz", weightOz);
    if (length) formData.set("length", length);
    if (width) formData.set("width", width);
    if (height) formData.set("height", height);
    formData.set("status", submitStatus);

    // Variants
    const validVariants = variants.filter((v) => v.name && v.price);
    formData.set("variant_count", validVariants.length.toString());
    validVariants.forEach((v, i) => {
      formData.set(`variant_name_${i}`, v.name);
      formData.set(`variant_sku_${i}`, v.sku);
      formData.set(`variant_price_${i}`, v.price);
      formData.set(`variant_stock_${i}`, v.stock);
    });

    // Images
    const validImages = images.filter((img) => img.url);
    formData.set("image_count", validImages.length.toString());
    validImages.forEach((img, i) => {
      formData.set(`image_url_${i}`, img.url);
      formData.set(`image_alt_${i}`, img.alt);
      formData.set(`image_primary_${i}`, img.isPrimary.toString());
    });

    startTransition(async () => {
      try {
        const action = isEdit ? updateProduct : createProduct;
        await action(formData);
        router.push("/supplier/products");
      } catch {
        setError("Something went wrong.");
      }
    });
  }

  const inputClasses =
    "block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-[#0F172A] shadow-sm placeholder:text-gray-400 focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20";
  const labelClasses = "mb-1 block text-sm font-medium text-[#0F172A]";

  return (
    <div className="mx-auto max-w-3xl">
      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="space-y-8">
        {/* Basic Info */}
        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-[#0F172A]">
            Basic Info
          </h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className={labelClasses}>
                Product Name *
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Premium Metal Polish"
                className={inputClasses}
                required
              />
            </div>
            <div>
              <label htmlFor="slug" className={labelClasses}>
                Slug
              </label>
              <input
                id="slug"
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className={inputClasses}
                placeholder="auto-generated-from-name"
              />
              <p className="mt-1 text-xs text-gray-400">
                URL-friendly identifier. Auto-generated from the product name.
              </p>
            </div>
            <div>
              <label htmlFor="short_description" className={labelClasses}>
                Short Description
              </label>
              <textarea
                id="short_description"
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                rows={2}
                className={inputClasses}
                placeholder="Brief product summary..."
              />
            </div>
            <div>
              <label htmlFor="description" className={labelClasses}>
                Full Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                className={inputClasses}
                placeholder="Detailed product description..."
              />
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-[#0F172A]">
            Pricing
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="base_price" className={labelClasses}>
                Base Price ($) *
              </label>
              <input
                id="base_price"
                type="number"
                step="0.01"
                min="0"
                value={basePrice}
                onChange={(e) => setBasePrice(e.target.value)}
                className={inputClasses}
                placeholder="0.00"
                required
              />
            </div>
            <div>
              <label htmlFor="compare_at_price" className={labelClasses}>
                Compare At Price ($)
              </label>
              <input
                id="compare_at_price"
                type="number"
                step="0.01"
                min="0"
                value={compareAtPrice}
                onChange={(e) => setCompareAtPrice(e.target.value)}
                className={inputClasses}
                placeholder="0.00"
              />
              <p className="mt-1 text-xs text-gray-400">
                Original price for showing discounts.
              </p>
            </div>
          </div>
        </section>

        {/* Organization */}
        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-[#0F172A]">
            Organization
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="brand_id" className={labelClasses}>
                Brand
              </label>
              <select
                id="brand_id"
                value={brandId}
                onChange={(e) => setBrandId(e.target.value)}
                className={inputClasses}
              >
                <option value="">Select a brand</option>
                {brands.map((brand) => (
                  <option key={brand.id} value={brand.id}>
                    {brand.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="category_id" className={labelClasses}>
                Category
              </label>
              <select
                id="category_id"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className={inputClasses}
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="sku" className={labelClasses}>
                SKU
              </label>
              <input
                id="sku"
                type="text"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                className={inputClasses}
                placeholder="e.g. PRD-001"
              />
            </div>
            <div>
              <label htmlFor="tags" className={labelClasses}>
                Tags
              </label>
              <input
                id="tags"
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className={inputClasses}
                placeholder="polish, metal, aluminum"
              />
              <p className="mt-1 text-xs text-gray-400">
                Comma-separated tags.
              </p>
            </div>
          </div>
        </section>

        {/* Weight & Dimensions */}
        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-[#0F172A]">
            Weight & Dimensions
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div>
              <label htmlFor="weight_oz" className={labelClasses}>
                Weight (oz)
              </label>
              <input
                id="weight_oz"
                type="number"
                step="0.1"
                min="0"
                value={weightOz}
                onChange={(e) => setWeightOz(e.target.value)}
                className={inputClasses}
                placeholder="0"
              />
            </div>
            <div>
              <label htmlFor="length" className={labelClasses}>
                Length (in)
              </label>
              <input
                id="length"
                type="number"
                step="0.1"
                min="0"
                value={length}
                onChange={(e) => setLength(e.target.value)}
                className={inputClasses}
                placeholder="0"
              />
            </div>
            <div>
              <label htmlFor="width" className={labelClasses}>
                Width (in)
              </label>
              <input
                id="width"
                type="number"
                step="0.1"
                min="0"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
                className={inputClasses}
                placeholder="0"
              />
            </div>
            <div>
              <label htmlFor="height" className={labelClasses}>
                Height (in)
              </label>
              <input
                id="height"
                type="number"
                step="0.1"
                min="0"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className={inputClasses}
                placeholder="0"
              />
            </div>
          </div>
        </section>

        {/* Variants */}
        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[#0F172A]">Variants</h2>
            <button
              type="button"
              onClick={addVariant}
              className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-[#0F172A] transition hover:bg-gray-50"
            >
              <svg
                className="h-3.5 w-3.5"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
              Add Variant
            </button>
          </div>
          <div className="space-y-3">
            {variants.map((variant, i) => (
              <div
                key={i}
                className="grid grid-cols-[1fr_0.8fr_0.6fr_0.5fr_auto] items-end gap-3 rounded-lg border border-gray-100 bg-gray-50 p-3"
              >
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-500">
                    Name
                  </label>
                  <input
                    type="text"
                    value={variant.name}
                    onChange={(e) => updateVariant(i, "name", e.target.value)}
                    className={inputClasses}
                    placeholder="e.g. 32 oz"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-500">
                    SKU
                  </label>
                  <input
                    type="text"
                    value={variant.sku}
                    onChange={(e) => updateVariant(i, "sku", e.target.value)}
                    className={inputClasses}
                    placeholder="SKU"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-500">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={variant.price}
                    onChange={(e) => updateVariant(i, "price", e.target.value)}
                    className={inputClasses}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-500">
                    Stock
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={variant.stock}
                    onChange={(e) => updateVariant(i, "stock", e.target.value)}
                    className={inputClasses}
                    placeholder="0"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeVariant(i)}
                  className="mb-0.5 rounded-lg p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-500"
                  title="Remove variant"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Images */}
        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[#0F172A]">Images</h2>
            <button
              type="button"
              onClick={addImage}
              className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-[#0F172A] transition hover:bg-gray-50"
            >
              <svg
                className="h-3.5 w-3.5"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
              Add Image
            </button>
          </div>
          <div className="space-y-3">
            {images.map((image, i) => (
              <div
                key={i}
                className="grid grid-cols-[1fr_1fr_auto_auto] items-end gap-3 rounded-lg border border-gray-100 bg-gray-50 p-3"
              >
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-500">
                    Image URL
                  </label>
                  <input
                    type="url"
                    value={image.url}
                    onChange={(e) => updateImage(i, "url", e.target.value)}
                    className={inputClasses}
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-500">
                    Alt Text
                  </label>
                  <input
                    type="text"
                    value={image.alt}
                    onChange={(e) => updateImage(i, "alt", e.target.value)}
                    className={inputClasses}
                    placeholder="Image description"
                  />
                </div>
                <label className="mb-0.5 flex items-center gap-2 text-xs text-gray-500">
                  <input
                    type="checkbox"
                    checked={image.isPrimary}
                    onChange={() => updateImage(i, "isPrimary", true)}
                    className="rounded border-gray-300 text-[#2563EB] focus:ring-[#2563EB]"
                  />
                  Primary
                </label>
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="mb-0.5 rounded-lg p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-500"
                  title="Remove image"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-gray-400">
            Enter image URLs directly. File upload via Supabase Storage is
            coming soon.
          </p>
        </section>

        {/* Submit */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            disabled={isPending}
            onClick={() => handleSubmit("draft")}
            className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-[#0F172A] transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending ? "Saving..." : "Save as Draft"}
          </button>
          <button
            type="button"
            disabled={isPending}
            onClick={() => handleSubmit("draft")}
            className="inline-flex items-center rounded-lg bg-[#F97316] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending ? "Submitting..." : "Submit for Review"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/supplier/products")}
            className="text-sm font-medium text-gray-500 transition hover:text-gray-700"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
