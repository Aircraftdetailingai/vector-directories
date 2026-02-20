"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/cart-store";

export function CartContent() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const totalPrice = useCartStore((s) => s.totalPrice);

  const [checkingOut, setCheckingOut] = useState(false);

  const subtotal = totalPrice();

  async function handleCheckout() {
    setCheckingOut(true);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });

      const data = await response.json();

      if (data.url) {
        router.push(data.url);
      }
    } catch {
      setCheckingOut(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-center px-4 py-24 sm:px-6 lg:px-8">
        {/* Shopping Bag Icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={64}
          height={64}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1}
          className="text-gray-300"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
          />
        </svg>
        <h2 className="mt-6 text-2xl font-bold text-[#0F172A]">
          Your cart is empty
        </h2>
        <p className="mt-2 text-gray-500">
          Looks like you haven&apos;t added any products yet.
        </p>
        <Link
          href="/shop"
          className="mt-6 inline-block rounded-lg bg-orange-500 px-8 py-3 text-lg font-semibold text-white transition-colors hover:bg-orange-600"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-[#0F172A]">Shopping Cart</h1>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={`${item.productId}-${item.variantId ?? "default"}`}
                className="flex gap-4 rounded-lg border border-gray-200 bg-white p-4"
              >
                {/* Item Image */}
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md bg-gray-100">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <span className="text-xl font-bold text-gray-300">
                        {item.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>

                {/* Item Details */}
                <div className="flex flex-1 flex-col">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-[#0F172A]">
                        {item.name}
                      </h3>
                      {item.variantName && (
                        <p className="text-sm text-gray-500">
                          {item.variantName}
                        </p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        removeItem(item.productId, item.variantId)
                      }
                      className="ml-2 p-1 text-gray-400 transition-colors hover:text-red-500"
                      aria-label={`Remove ${item.name}`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={18}
                        height={18}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18 18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>

                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-center gap-0">
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(
                            item.productId,
                            item.variantId,
                            item.quantity - 1,
                          )
                        }
                        className="flex h-8 w-8 items-center justify-center rounded-l-md border border-gray-300 text-gray-600 hover:bg-gray-100"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width={14}
                          height={14}
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
                        value={item.quantity}
                        onChange={(e) => {
                          const val = parseInt(e.target.value, 10);
                          if (!isNaN(val) && val >= 1) {
                            updateQuantity(
                              item.productId,
                              item.variantId,
                              val,
                            );
                          }
                        }}
                        className="h-8 w-12 border-y border-gray-300 text-center text-sm font-medium text-[#0F172A] outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(
                            item.productId,
                            item.variantId,
                            item.quantity + 1,
                          )
                        }
                        className="flex h-8 w-8 items-center justify-center rounded-r-md border border-gray-300 text-gray-600 hover:bg-gray-100"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width={14}
                          height={14}
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

                    <span className="font-semibold text-[#0F172A]">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div>
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="text-lg font-bold text-[#0F172A]">Order Summary</h2>

            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-gray-600">Subtotal</dt>
                <dd className="font-medium text-[#0F172A]">
                  ${subtotal.toFixed(2)}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-600">Estimated Shipping</dt>
                <dd className="text-gray-500">Calculated at checkout</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-600">Estimated Tax</dt>
                <dd className="text-gray-500">Calculated at checkout</dd>
              </div>
            </dl>

            <div className="mt-4 border-t border-gray-200 pt-4">
              <div className="flex justify-between">
                <span className="text-base font-bold text-[#0F172A]">
                  Total
                </span>
                <span className="text-lg font-bold text-[#0F172A]">
                  ${subtotal.toFixed(2)}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleCheckout}
              disabled={checkingOut}
              className="mt-6 w-full rounded-lg bg-orange-500 py-3 font-semibold text-white transition-colors hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {checkingOut ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="h-5 w-5 animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Processing...
                </span>
              ) : (
                "Proceed to Checkout"
              )}
            </button>

            <Link
              href="/shop"
              className="mt-3 block text-center text-sm font-medium text-blue-600 hover:underline"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
