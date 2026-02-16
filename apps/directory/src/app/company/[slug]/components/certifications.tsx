interface CertificationsProps {
  certifications: string[];
  insuranceRange: string | null;
}

export function Certifications({
  certifications,
  insuranceRange,
}: CertificationsProps) {
  if (certifications.length === 0 && !insuranceRange) return null;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <h2 className="font-heading text-sm font-semibold uppercase tracking-wider text-forest-800">
        Certifications &amp; Insurance
      </h2>

      {certifications.length > 0 && (
        <ul className="mt-4 space-y-2.5">
          {certifications.map((cert) => (
            <li key={cert} className="flex items-center gap-2.5">
              <svg
                className="h-5 w-5 flex-shrink-0 text-forest-600"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-sm text-gray-700">{cert}</span>
            </li>
          ))}
        </ul>
      )}

      {insuranceRange && (
        <div className="mt-4 flex items-center gap-2.5 rounded-lg border border-forest-100 bg-forest-50 px-4 py-3">
          <svg
            className="h-5 w-5 flex-shrink-0 text-forest-700"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
          <div>
            <span className="text-sm font-semibold text-forest-800">
              {insuranceRange}
            </span>
            <span className="ml-1 text-sm text-forest-600">
              Liability Coverage
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
