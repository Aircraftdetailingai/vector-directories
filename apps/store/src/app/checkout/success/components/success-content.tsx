"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useCartStore } from "@/lib/cart-store";

interface SuccessContentProps {
  sessionId: string | null;
}

export function SuccessContent({ sessionId }: SuccessContentProps) {
  const clearCart = useCartStore((s) => s.clearCart);

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <div className="mx-auto flex max-w-7xl flex-col items-center justify-center px-4 py-24 sm:px-6 lg:px-8">
      {/* Green Checkmark Icon */}
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={40}
          height={40}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          className="text-green-600"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
          />
        </svg>
      </div>

      <h1 className="mt-6 text-3xl font-bold text-[#0F172A]">
        Order Confirmed!
      </h1>
      <p className="mt-3 text-lg text-gray-600">
        Thank you for your purchase.
      </p>
      <p className="mt-1 text-gray-500">
        You&apos;ll receive a confirmation email shortly.
      </p>

      {sessionId && (
        <p className="mt-4 text-xs text-gray-400">
          Session: {sessionId}
        </p>
      )}

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/shop"
          className="inline-flex items-center justify-center rounded-lg bg-orange-500 px-8 py-3 font-semibold text-white transition-colors hover:bg-orange-600"
        >
          Continue Shopping
        </Link>
        <Link
          href="/orders"
          className="inline-flex items-center justify-center rounded-lg border border-gray-300 px-8 py-3 font-semibold text-[#0F172A] transition-colors hover:bg-gray-50"
        >
          View Orders
        </Link>
      </div>
    </div>
  );
}
