import Link from "next/link";
import type { Listing } from "@vector/types";

interface ServiceListProps {
  listings: Listing[];
}

export default function ServiceList({ listings }: ServiceListProps) {
  const activeListings = listings.filter((l) => l.status === "active");

  if (activeListings.length === 0) return null;

  return (
    <div className="rounded-xl border border-brand-100 bg-white p-6">
      <h2 className="font-heading text-xl font-semibold text-brown-500">
        Services Offered
      </h2>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {activeListings.map((listing) => (
          <div
            key={listing.id}
            className="rounded-xl border border-brand-100 bg-white p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <h3 className="font-heading text-base font-semibold text-brown-500">
                  {listing.title}
                </h3>
                <span className="mt-1 inline-block rounded-lg bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-600">
                  {listing.category}
                </span>
                {listing.description && (
                  <p className="mt-2 text-sm leading-relaxed text-gray-600">
                    {listing.description}
                  </p>
                )}
              </div>
            </div>
            <div className="mt-3">
              <Link
                href="/"
                className="inline-flex items-center rounded-xl bg-brand-500 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-brand-600"
              >
                Get a Quote
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
