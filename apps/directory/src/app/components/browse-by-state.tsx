import Link from "next/link";
import { US_STATES as STATE_DATA } from "@/lib/us-states";

export interface StateEntry {
  code: string;
  name: string;
  slug: string;
  count: number;
}

const US_STATES: StateEntry[] = STATE_DATA.map((s) => ({
  ...s,
  count: 0,
}));

interface BrowseByStateProps {
  stateCounts?: Record<string, number>;
}

export function BrowseByState({ stateCounts }: BrowseByStateProps) {
  const states = US_STATES.map((s) => ({
    ...s,
    count: stateCounts?.[s.code] ?? s.count,
  }));

  return (
    <section className="bg-sage/40 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="font-heading text-3xl font-bold text-forest-800 sm:text-4xl">
            Browse by State
          </h2>
          <p className="mt-3 text-gray-600">
            Find aircraft detailing professionals in your state
          </p>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {states.map((state) => (
            <Link
              key={state.code}
              href={`/${state.slug}`}
              className="group flex items-center justify-between rounded-lg border border-forest-100 bg-white px-3 py-3 transition-all hover:border-forest-300 hover:shadow-md hover:shadow-forest-100"
            >
              <div className="min-w-0">
                <span className="block truncate text-sm font-medium text-forest-800 group-hover:text-forest-700">
                  {state.name}
                </span>
              </div>
              <span className="ml-2 flex-shrink-0 rounded-full bg-forest-100 px-2 py-0.5 text-xs font-semibold text-forest-700">
                {state.count}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
