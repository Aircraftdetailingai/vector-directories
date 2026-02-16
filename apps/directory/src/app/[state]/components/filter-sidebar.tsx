"use client";

interface FilterSidebarProps {
  cities: string[];
  categories: string[];
  currentCity: string;
  currentService: string;
  onCityChange: (city: string) => void;
  onServiceChange: (service: string) => void;
  onReset: () => void;
}

export function FilterSidebar({
  cities,
  categories,
  currentCity,
  currentService,
  onCityChange,
  onServiceChange,
  onReset,
}: FilterSidebarProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-forest-800">
        Filters
      </h3>

      {/* City dropdown */}
      <fieldset className="mt-5">
        <legend className="text-sm font-medium text-gray-700">City</legend>
        <select
          value={currentCity}
          onChange={(e) => onCityChange(e.target.value)}
          aria-label="Filter by city"
          className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 focus:border-forest-500 focus:outline-none focus:ring-1 focus:ring-forest-500"
        >
          <option value="">All Cities</option>
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </fieldset>

      {/* Service type checkboxes */}
      <fieldset className="mt-6">
        <legend className="text-sm font-medium text-gray-700">
          Service Type
        </legend>
        <div className="mt-2 space-y-2">
          {categories.map((cat) => (
            <label
              key={cat}
              className="flex cursor-pointer items-center gap-2 rounded-md px-1 py-1 text-sm text-gray-600 transition-colors hover:bg-gray-50"
            >
              <input
                type="checkbox"
                checked={currentService === cat}
                onChange={() =>
                  onServiceChange(currentService === cat ? "" : cat)
                }
                className="h-4 w-4 rounded border-gray-300 text-forest-700 focus:ring-forest-500"
              />
              {cat}
            </label>
          ))}
        </div>
      </fieldset>

      {/* Reset */}
      {(currentCity || currentService) && (
        <button
          type="button"
          onClick={onReset}
          className="mt-6 w-full rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
        >
          Reset Filters
        </button>
      )}
    </div>
  );
}
