import type { Company, Listing } from "@vector/types";

interface CompanyDetailsProps {
  company: Company;
  listings: Listing[];
}

export function CompanyDetails({ company, listings }: CompanyDetailsProps) {
  const activeListings = listings.filter((l) => l.status === "active");

  return (
    <div className="space-y-8">
      {/* Description */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="font-heading text-xl font-semibold text-gray-900">
          About
        </h2>
        <p className="mt-3 font-body text-base leading-relaxed text-gray-600">
          {company.description ??
            `${company.name} is an aircraft detailing company listed in our directory. Contact them directly for more information about their services and availability.`}
        </p>
      </div>

      {/* Services */}
      {activeListings.length > 0 && (
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="font-heading text-xl font-semibold text-gray-900">
            Services
          </h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {activeListings.map((listing) => (
              <span
                key={listing.id}
                className="inline-flex items-center rounded-full bg-sky-50 px-3 py-1 text-sm font-medium text-sky-700"
              >
                {listing.title}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
