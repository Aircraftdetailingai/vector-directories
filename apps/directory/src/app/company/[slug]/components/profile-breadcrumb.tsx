import Link from "next/link";

interface ProfileBreadcrumbProps {
  stateName: string;
  stateSlug: string;
  cityName: string;
  citySlug: string;
  companyName: string;
}

export function ProfileBreadcrumb({
  stateName,
  stateSlug,
  cityName,
  citySlug,
  companyName,
}: ProfileBreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="border-b border-gray-100 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
        <ol className="flex flex-wrap items-center gap-2 text-sm">
          <li>
            <Link
              href="/"
              className="text-gray-500 transition-colors hover:text-forest-700"
            >
              Home
            </Link>
          </li>
          <li aria-hidden="true" className="text-gray-300">
            /
          </li>
          <li>
            <Link
              href={`/${stateSlug}`}
              className="text-gray-500 transition-colors hover:text-forest-700"
            >
              {stateName}
            </Link>
          </li>
          <li aria-hidden="true" className="text-gray-300">
            /
          </li>
          <li>
            <Link
              href={`/${stateSlug}/${citySlug}`}
              className="text-gray-500 transition-colors hover:text-forest-700"
            >
              {cityName}
            </Link>
          </li>
          <li aria-hidden="true" className="text-gray-300">
            /
          </li>
          <li>
            <span className="font-medium text-forest-800" aria-current="page">
              {companyName}
            </span>
          </li>
        </ol>
      </div>
    </nav>
  );
}
