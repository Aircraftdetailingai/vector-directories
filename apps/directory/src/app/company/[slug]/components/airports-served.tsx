import type { Airport } from "@/lib/city-airports";

interface AirportsServedProps {
  airports: Airport[];
}

export function AirportsServed({ airports }: AirportsServedProps) {
  if (airports.length === 0) return null;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <h2 className="font-heading text-sm font-semibold uppercase tracking-wider text-forest-800">
        Airports Served
      </h2>
      <div className="mt-4 space-y-3">
        {airports.map((airport) => (
          <div key={airport.code} className="flex items-center gap-3">
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
            <div>
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
  );
}
