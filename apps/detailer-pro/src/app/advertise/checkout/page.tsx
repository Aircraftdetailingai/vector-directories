"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import Header from "../../components/header";
import Footer from "../../components/footer";
import { startAdCheckout } from "./actions";

const PLACEMENT_INFO: Record<string, { name: string; price: string; dimensions: string }> = {
  top_banner: { name: "Top Banner", price: "$199/mo", dimensions: "728 x 90" },
  sidebar: { name: "Sidebar", price: "$149/mo", dimensions: "300 x 250" },
  featured_boost: { name: "Featured Boost", price: "$99/mo", dimensions: "200 x 200" },
  category_sponsor: { name: "Category Sponsor", price: "$249/mo", dimensions: "728 x 90" },
  homepage_spotlight: { name: "Homepage Spotlight", price: "$299/mo", dimensions: "600 x 400" },
  popup: { name: "Popup", price: "$349/mo", dimensions: "500 x 400" },
};

export default function AdvertiseCheckoutPage() {
  const searchParams = useSearchParams();
  const placementType = searchParams.get("placement") ?? "top_banner";
  const placement = PLACEMENT_INFO[placementType] ?? PLACEMENT_INFO.top_banner;

  const [companyName, setCompanyName] = useState("");
  const [adTitle, setAdTitle] = useState("");
  const [destinationUrl, setDestinationUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  return (
    <div className="flex min-h-screen flex-col bg-slate-950">
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          <Link
            href="/advertise"
            className="text-sm text-electric-400 hover:text-electric-300"
          >
            &larr; Back to Placements
          </Link>

          <h1 className="mt-4 font-heading text-3xl font-bold text-white">
            Checkout: {placement.name}
          </h1>
          <p className="mt-1 text-slate-400">
            {placement.price} &middot; {placement.dimensions} pixels
          </p>

          <div className="mt-10 grid gap-10 lg:grid-cols-2">
            {/* Form */}
            <form action={startAdCheckout}>
              <input type="hidden" name="placement_type" value={placementType} />

              <div className="space-y-6">
                <div>
                  <label htmlFor="company_name" className="block text-sm font-medium text-slate-300">
                    Company Name
                  </label>
                  <input
                    id="company_name"
                    name="company_name"
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="mt-1 block w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white shadow-sm focus:border-electric-500 focus:outline-none focus:ring-1 focus:ring-electric-500"
                  />
                </div>

                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-slate-300">
                    Ad Title
                  </label>
                  <input
                    id="title"
                    name="title"
                    type="text"
                    required
                    value={adTitle}
                    onChange={(e) => setAdTitle(e.target.value)}
                    className="mt-1 block w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white shadow-sm focus:border-electric-500 focus:outline-none focus:ring-1 focus:ring-electric-500"
                  />
                </div>

                <div>
                  <label htmlFor="destination_url" className="block text-sm font-medium text-slate-300">
                    Destination URL
                  </label>
                  <input
                    id="destination_url"
                    name="destination_url"
                    type="url"
                    required
                    value={destinationUrl}
                    onChange={(e) => setDestinationUrl(e.target.value)}
                    placeholder="https://yourcompany.com"
                    className="mt-1 block w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white placeholder-slate-500 shadow-sm focus:border-electric-500 focus:outline-none focus:ring-1 focus:ring-electric-500"
                  />
                </div>

                <div>
                  <label htmlFor="image_url" className="block text-sm font-medium text-slate-300">
                    Image URL <span className="text-slate-500">(optional)</span>
                  </label>
                  <input
                    id="image_url"
                    name="image_url"
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://yourcdn.com/ad-image.png"
                    className="mt-1 block w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white placeholder-slate-500 shadow-sm focus:border-electric-500 focus:outline-none focus:ring-1 focus:ring-electric-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-lg bg-electric-500 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-electric-600"
                >
                  Continue to Payment
                </button>
              </div>
            </form>

            {/* Preview */}
            <div>
              <h2 className="font-heading text-lg font-semibold text-white">
                Ad Preview
              </h2>
              <div className="mt-4 rounded-lg border border-slate-700 bg-slate-800 p-4">
                <div className="flex aspect-[728/90] items-center justify-center rounded-lg bg-slate-900 text-sm text-slate-500">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt="Ad preview"
                      className="h-full w-full rounded-lg object-cover"
                    />
                  ) : (
                    <span>{placement.dimensions} preview</span>
                  )}
                </div>
                <p className="mt-3 text-sm font-semibold text-white">
                  {adTitle || "Your Ad Title"}
                </p>
                <p className="text-xs text-slate-400">
                  {companyName || "Your Company"} &middot;{" "}
                  {destinationUrl || "https://yourcompany.com"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
