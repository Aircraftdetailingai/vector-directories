import Link from "next/link";
import { SERVICE_CATEGORIES } from "@/lib/categories";

const knownSlugs = new Set(SERVICE_CATEGORIES.map((c) => c.slug));

interface ListingItem {
  id: string;
  title: string;
  category: string;
}

export default function ServiceTags({ listings }: { listings: ListingItem[] }) {
  if (listings.length === 0) return null;

  return (
    <section>
      <h2 className="font-heading font-bold text-xl text-gray-800 mb-4">
        Services Offered
      </h2>
      <div className="flex flex-wrap gap-2">
        {listings.map((listing) => {
          const isKnown = knownSlugs.has(listing.category);

          if (isKnown) {
            return (
              <Link
                key={listing.id}
                href={`/services/${listing.category}`}
                className="inline-flex items-center rounded-full bg-teal-50 text-teal-700 px-3 py-1 text-sm font-medium hover:bg-teal-100 transition-colors"
              >
                {listing.title}
              </Link>
            );
          }

          return (
            <span
              key={listing.id}
              className="inline-flex items-center rounded-full bg-teal-50 text-teal-700 px-3 py-1 text-sm font-medium"
            >
              {listing.title}
            </span>
          );
        })}
      </div>
    </section>
  );
}
