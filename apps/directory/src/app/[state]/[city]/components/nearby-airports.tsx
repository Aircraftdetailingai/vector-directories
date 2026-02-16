import type { Airport } from "@/lib/city-airports";

interface NearbyAirportsProps {
  airports: Airport[];
  cityName: string;
}

export function NearbyAirports({ airports, cityName }: NearbyAirportsProps) {
  if (airports.length === 0) return null;

  return (
    <section className="border-b border-gray-100 bg-sage/40 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="font-heading text-sm font-semibold uppercase tracking-wider text-forest-800">
          Nearby Airports Served
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Aircraft detailing companies in {cityName} serve these airports
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          {airports.map((airport) => (
            <div
              key={airport.code}
              className="flex items-center gap-2 rounded-lg border border-forest-100 bg-white px-4 py-2.5 shadow-sm"
            >
              <svg
                className="h-4 w-4 flex-shrink-0 text-forest-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
              <div className="min-w-0">
                <span className="font-heading text-sm font-semibold text-forest-800">
                  {airport.code}
                </span>
                <span className="ml-1.5 text-sm text-gray-500">
                  {airport.name}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
