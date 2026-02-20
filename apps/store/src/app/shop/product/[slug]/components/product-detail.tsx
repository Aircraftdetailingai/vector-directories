"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { StoreProduct, StoreProductVariant } from "@/lib/types";
import { useCartStore } from "@/lib/cart-store";

interface ProductDetailProps {
  product: StoreProduct;
}

export function ProductDetail({ product }: ProductDetailProps) {
  const addItem = useCartStore((s) => s.addItem);

  const images = product.images?.sort((a, b) => a.sort_order - b.sort_order) ?? [];
  const variants = product.variants?.sort((a, b) => a.sort_order - b.sort_order) ?? [];

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<StoreProductVariant | null>(
    variants.length > 0 ? variants[0] : null,
  );
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  const currentPrice = selectedVariant ? selectedVariant.price : product.base_price;
  const comparePrice = selectedVariant
    ? selectedVariant.compare_at_price
    : product.compare_at_price;
  const stockQuantity = selectedVariant ? selectedVariant.stock_quantity : null;
  const inStock = stockQuantity === null || stockQuantity > 0;

  const savingsPercent =
    comparePrice && comparePrice > currentPrice
      ? Math.round(((comparePrice - currentPrice) / comparePrice) * 100)
      : null;

  function handleAddToCart() {
    if (!inStock) return;

    const primaryImage =
      images.find((img) => img.is_primary) ?? images[0] ?? null;

    addItem({
      productId: product.id,
      variantId: selectedVariant?.id ?? null,
      name: product.name,
      variantName: selectedVariant?.name ?? null,
      price: currentPrice,
      quantity,
      image: primaryImage?.url ?? null,
    });

    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  }

  function incrementQuantity() {
    if (stockQuantity !== null && quantity >= stockQuantity) return;
    setQuantity((q) => q + 1);
  }

  function decrementQuantity() {
    if (quantity <= 1) return;
    setQuantity((q) => q - 1);
  }

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
      {/* Left Column: Image Gallery */}
      <div>
        {/* Main Image */}
        <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-gray-100">
          {images.length > 0 ? (
            <Image
              src={images[selectedImageIndex].url}
              alt={images[selectedImageIndex].alt_text ?? product.name}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              priority
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <span className="text-6xl font-bold text-gray-300">
                {product.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>

        {/* Thumbnail Row */}
        {images.length > 1 && (
          <div className="mt-4 flex gap-3">
            {images.map((img, idx) => (
              <button
                key={img.id}
                type="button"
                onClick={() => setSelectedImageIndex(idx)}
                className={`relative h-16 w-16 overflow-hidden rounded-md border-2 transition-colors ${
                  idx === selectedImageIndex
                    ? "border-blue-600"
                    : "border-gray-200 hover:border-gray-400"
                }`}
              >
                <Image
                  src={img.url}
                  alt={img.alt_text ?? `${product.name} thumbnail ${idx + 1}`}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Right Column: Product Info */}
      <div>
        {/* Breadcrumbs */}
        <nav className="mb-4 flex items-center gap-1.5 text-sm text-gray-500">
          <Link href="/" className="hover:text-blue-600">
            Home
          </Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-blue-600">
            Shop
          </Link>
          {product.category && (
            <>
              <span>/</span>
              <Link
                href={`/shop?category=${product.category.slug}`}
                className="hover:text-blue-600"
              >
                {product.category.name}
              </Link>
            </>
          )}
          <span>/</span>
          <span className="text-gray-700">{product.name}</span>
        </nav>

        {/* Brand */}
        {product.brand && (
          <Link
            href={`/shop?brand=${product.brand.slug}`}
            className="text-sm font-medium text-blue-600 hover:underline"
          >
            {product.brand.name}
          </Link>
        )}

        {/* Product Name */}
        <h1 className="mt-1 text-3xl font-bold text-[#0F172A]">
          {product.name}
        </h1>

        {/* Price Section */}
        <div className="mt-4 flex items-center gap-3">
          <span className="text-2xl font-bold text-[#0F172A]">
            ${currentPrice.toFixed(2)}
          </span>
          {comparePrice && comparePrice > currentPrice && (
            <>
              <span className="text-lg text-gray-400 line-through">
                ${comparePrice.toFixed(2)}
              </span>
              {savingsPercent && (
                <span className="rounded-full bg-orange-100 px-2.5 py-0.5 text-sm font-semibold text-orange-600">
                  Save {savingsPercent}%
                </span>
              )}
            </>
          )}
        </div>

        {/* Short Description */}
        {product.short_description && (
          <p className="mt-4 text-gray-600">{product.short_description}</p>
        )}

        {/* Variant Selector */}
        {variants.length > 0 && (
          <div className="mt-6">
            <label className="text-sm font-semibold text-[#0F172A]">
              Options:
            </label>
            <div className="mt-2 flex flex-wrap gap-2">
              {variants.map((variant) => (
                <button
                  key={variant.id}
                  type="button"
                  onClick={() => {
                    setSelectedVariant(variant);
                    setQuantity(1);
                  }}
                  className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                    selectedVariant?.id === variant.id
                      ? "border-blue-600 bg-blue-50 text-blue-600"
                      : "border-gray-300 text-gray-700 hover:border-gray-400"
                  }`}
                >
                  {variant.name} &mdash; ${variant.price.toFixed(2)}
                </button>
              ))}
            </div>

            {/* Stock Status */}
            {selectedVariant && (
              <p className="mt-2 text-sm">
                {selectedVariant.stock_quantity > 0 ? (
                  <span className="text-green-600">
                    In Stock ({selectedVariant.stock_quantity} available)
                  </span>
                ) : (
                  <span className="text-red-600">Out of Stock</span>
                )}
              </p>
            )}
          </div>
        )}

        {/* Quantity Selector */}
        <div className="mt-6">
          <label className="text-sm font-semibold text-[#0F172A]">
            Quantity:
          </label>
          <div className="mt-2 flex items-center gap-0">
            <button
              type="button"
              onClick={decrementQuantity}
              disabled={quantity <= 1}
              className="flex h-10 w-10 items-center justify-center rounded-l-lg border border-gray-300 text-gray-600 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={16}
                height={16}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 12h14"
                />
              </svg>
            </button>
            <input
              type="number"
              min={1}
              max={stockQuantity ?? undefined}
              value={quantity}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                if (!isNaN(val) && val >= 1) {
                  if (stockQuantity !== null && val > stockQuantity) {
                    setQuantity(stockQuantity);
                  } else {
                    setQuantity(val);
                  }
                }
              }}
              className="h-10 w-16 border-y border-gray-300 text-center text-sm font-medium text-[#0F172A] outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
            <button
              type="button"
              onClick={incrementQuantity}
              disabled={stockQuantity !== null && quantity >= stockQuantity}
              className="flex h-10 w-10 items-center justify-center rounded-r-lg border border-gray-300 text-gray-600 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={16}
                height={16}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Add to Cart Button */}
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={!inStock}
          className={`mt-6 w-full rounded-lg py-3 text-lg font-semibold text-white transition-colors ${
            !inStock
              ? "cursor-not-allowed bg-gray-400"
              : addedToCart
                ? "bg-green-500"
                : "bg-orange-500 hover:bg-orange-600"
          }`}
        >
          {!inStock ? "Out of Stock" : addedToCart ? "Added!" : "Add to Cart"}
        </button>

        {/* Full Description */}
        {product.description && (
          <div className="mt-8 border-t border-gray-200 pt-6">
            <h2 className="text-lg font-semibold text-[#0F172A]">
              Description
            </h2>
            <p className="mt-3 leading-relaxed text-gray-700">
              {product.description}
            </p>
          </div>
        )}

        {/* Product Details */}
        <div className="mt-6 border-t border-gray-200 pt-6">
          <h2 className="text-lg font-semibold text-[#0F172A]">
            Product Details
          </h2>
          <dl className="mt-3 space-y-2 text-sm">
            {product.sku && (
              <div className="flex gap-2">
                <dt className="font-medium text-gray-500">SKU:</dt>
                <dd className="text-gray-700">
                  {selectedVariant?.sku ?? product.sku}
                </dd>
              </div>
            )}
            {product.weight_oz && (
              <div className="flex gap-2">
                <dt className="font-medium text-gray-500">Weight:</dt>
                <dd className="text-gray-700">{product.weight_oz} oz</dd>
              </div>
            )}
            {product.tags.length > 0 && (
              <div className="flex gap-2">
                <dt className="font-medium text-gray-500">Tags:</dt>
                <dd className="flex flex-wrap gap-1.5">
                  {product.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-600"
                    >
                      {tag}
                    </span>
                  ))}
                </dd>
              </div>
            )}
          </dl>
        </div>
      </div>
    </div>
  );
}
