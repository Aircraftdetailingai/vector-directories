import type { Company, Location } from "@vector/types";
import { formatPhone, formatAddress } from "@vector/utils";
import type { Tier } from "@vector/types";
import { hasTierFeature } from "@vector/utils";

interface ContactInfoProps {
  company: Company;
  location: Location | null;
}

export function ContactInfo({ company, location }: ContactInfoProps) {
  const isPremium = hasTierFeature(company.tier as Tier, "leadCapture");

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <h2 className="font-heading text-sm font-semibold uppercase tracking-wider text-forest-800">
        Contact Information
      </h2>

      <dl className="mt-4 space-y-4">
        {/* Phone */}
        {company.phone && (
          <div className="flex items-start gap-3">
            <svg
              className="mt-0.5 h-5 w-5 flex-shrink-0 text-forest-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
            <div>
              <dt className="sr-only">Phone</dt>
              {isPremium ? (
                <dd>
                  <a
                    href={`tel:${company.phone}`}
                    className="text-sm font-medium text-forest-700 underline decoration-forest-200 transition-colors hover:text-forest-600"
                  >
                    {formatPhone(company.phone)}
                  </a>
                </dd>
              ) : (
                <dd className="text-sm text-gray-700">
                  {formatPhone(company.phone)}
                </dd>
              )}
            </div>
          </div>
        )}

        {/* Website */}
        {company.website && (
          <div className="flex items-start gap-3">
            <svg
              className="mt-0.5 h-5 w-5 flex-shrink-0 text-forest-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
              />
            </svg>
            <div>
              <dt className="sr-only">Website</dt>
              <dd>
                <a
                  href={company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-forest-700 underline decoration-forest-200 transition-colors hover:text-forest-600"
                >
                  {company.website.replace(/^https?:\/\//, "")}
                </a>
              </dd>
            </div>
          </div>
        )}

        {/* Email */}
        {company.email && (
          <div className="flex items-start gap-3">
            <svg
              className="mt-0.5 h-5 w-5 flex-shrink-0 text-forest-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            <div>
              <dt className="sr-only">Email</dt>
              <dd>
                <a
                  href={`mailto:${company.email}`}
                  className="text-sm font-medium text-forest-700 underline decoration-forest-200 transition-colors hover:text-forest-600"
                >
                  {company.email}
                </a>
              </dd>
            </div>
          </div>
        )}

        {/* Address */}
        {location && (
          <div className="flex items-start gap-3">
            <svg
              className="mt-0.5 h-5 w-5 flex-shrink-0 text-forest-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <div>
              <dt className="sr-only">Address</dt>
              <dd className="text-sm text-gray-700">
                {formatAddress(location)}
              </dd>
            </div>
          </div>
        )}
      </dl>
    </div>
  );
}
