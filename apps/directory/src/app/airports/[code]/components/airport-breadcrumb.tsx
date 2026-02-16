interface AirportBreadcrumbProps {
  airportName: string;
}

export function AirportBreadcrumb({ airportName }: AirportBreadcrumbProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="border-b border-gray-100 bg-white"
    >
      <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
        <ol className="flex items-center gap-2 text-sm">
          <li>
            <a
              href="/"
              className="text-gray-500 transition-colors hover:text-forest-700"
            >
              Home
            </a>
          </li>
          <li aria-hidden="true" className="text-gray-300">
            /
          </li>
          <li>
            <a
              href="/airports"
              className="text-gray-500 transition-colors hover:text-forest-700"
            >
              Airports
            </a>
          </li>
          <li aria-hidden="true" className="text-gray-300">
            /
          </li>
          <li>
            <span
              className="font-medium text-forest-800"
              aria-current="page"
            >
              {airportName}
            </span>
          </li>
        </ol>
      </div>
    </nav>
  );
}
