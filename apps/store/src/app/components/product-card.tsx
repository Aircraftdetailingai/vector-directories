"use client";

import Image from "next/image";
import Link from "next/link";
import type { StoreProduct } from "@/lib/types";
import { useCartStore } from "@/lib/cart-store";

interface ProductCardProps {
  product: StoreProduct;
  onAddToCart?: () => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);

  const primaryImage =
    product.images?.find((img) => img.is_primary) ?? product.images?.[0];

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addItem({
      productId: product.id,
      variantId: null,
      name: product.name,
      variantName: null,
      price: product.base_price,
      quantity: 1,
      image: primaryImage?.url ?? null,
    });

    onAddToCart?.();
  };

  return (
    <Link
      href={`/shop/product/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-md"
    >
      {/* Image */}
      <div className="relative aspect-square w-full overflow-hidden bg-gray-100">
        {primaryImage ? (
          <Image
            src={primaryImage.url}
            alt={primaryImage.alt_text ?? product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={48}
              height={48}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1}
              className="text-gray-300"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Details */}
      <div className="flex flex-1 flex-col p-4">
        {/* Brand */}
        {product.brand && (
          <span className="text-xs font-medium text-blue-600">
            {product.brand.name}
          </span>
        )}

        {/* Name */}
        <h3 className="mt-1 line-clamp-2 text-sm font-semibold text-navy-900">
          {product.name}
        </h3>

        {/* Price */}
        <div className="mt-2 flex items-center gap-2">
          <span className="font-bold text-navy-900">
            ${product.base_price.toFixed(2)}
          </span>
          {product.compare_at_price && (
            <span className="text-sm text-gray-400 line-through">
              ${product.compare_at_price.toFixed(2)}
            </span>
          )}
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Add to Cart */}
        <button
          type="button"
          onClick={handleAddToCart}
          className="mt-4 w-full rounded-lg bg-orange-500 py-2 text-sm font-medium text-white transition-colors hover:bg-orange-600"
        >
          Add to Cart
        </button>
      </div>
    </Link>
  );
}
