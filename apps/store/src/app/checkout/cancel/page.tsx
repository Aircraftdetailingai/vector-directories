import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/app/components/header";
import { Footer } from "@/app/components/footer";

export const metadata: Metadata = {
  title: "Checkout Cancelled | Aircraft Detailing 101",
  description: "Your checkout was cancelled. Your cart items are still saved.",
};

export default function CheckoutCancelPage() {
  return (
    <div className="flex min-h-screen flex-col font-sans">
      <Header />
      <main className="flex-1">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-center px-4 py-24 sm:px-6 lg:px-8">
          {/* Cancel / X Icon */}
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-orange-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={40}
              height={40}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              className="text-orange-500"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          </div>

          <h1 className="mt-6 text-3xl font-bold text-[#0F172A]">
            Checkout Cancelled
          </h1>
          <p className="mt-3 text-lg text-gray-600">
            Your order was not completed. Your cart items are still saved.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/cart"
              className="inline-flex items-center justify-center rounded-lg bg-orange-500 px-8 py-3 font-semibold text-white transition-colors hover:bg-orange-600"
            >
              Return to Cart
            </Link>
            <Link
              href="/shop"
              className="inline-flex items-center justify-center text-sm font-medium text-[#2563EB] hover:underline"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
