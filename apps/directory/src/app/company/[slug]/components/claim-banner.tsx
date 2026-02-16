import Link from "next/link";

interface ClaimBannerProps {
  companySlug: string;
}

export function ClaimBanner({ companySlug }: ClaimBannerProps) {
  return (
    <div className="border-b border-forest-100 bg-forest-50">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <svg
              className="h-5 w-5 flex-shrink-0 text-forest-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
              />
            </svg>
            <div>
              <p className="text-sm font-semibold text-forest-800">
                Is this your business?
              </p>
              <p className="text-sm text-forest-600">
                Claim this listing to manage your profile, respond to leads, and
                boost your visibility.
              </p>
            </div>
          </div>
          <Link
            href={`/claim/${companySlug}`}
            className="inline-flex items-center gap-1.5 rounded-lg bg-forest-800 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-forest-700"
          >
            Claim This Listing
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
              />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
