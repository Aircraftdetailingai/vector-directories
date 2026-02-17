/* ── Types ─────────────────────────────────────────────────────────────── */

interface Listing {
  id: string;
  company_id: string;
  location_id: string | null;
  title: string;
  slug: string;
  description: string | null;
  category: string;
  status: string;
  featured: boolean;
  created_at: string;
  updated_at: string;
}

/* ── Component ─────────────────────────────────────────────────────────── */

export default function ServiceShowcase({
  listings,
}: {
  listings: Listing[];
}) {
  const activeListings = listings.filter((l) => l.status === "active");

  if (activeListings.length === 0) return null;

  return (
    <section>
      <h2 className="font-heading text-2xl text-noir-900 font-light tracking-wide mb-6">
        Services
      </h2>
      <div className="h-px bg-gradient-to-r from-gold-500 to-transparent mb-8" />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {activeListings.map((listing) => (
          <article
            key={listing.id}
            className="luxury-card bg-white border border-ivory-200 rounded-sm p-6"
          >
            {/* Category */}
            <p className="text-gold-600 text-xs uppercase tracking-widest font-body mb-3">
              {listing.category}
            </p>

            {/* Title */}
            <h3 className="font-heading text-lg text-noir-900 font-medium mb-2">
              {listing.title}
            </h3>

            {/* Description */}
            {listing.description && (
              <p className="font-body text-sm text-noir-600 leading-relaxed">
                {listing.description}
              </p>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
