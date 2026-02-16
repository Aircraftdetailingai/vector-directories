"use client";

const SORT_OPTIONS = [
  { value: "trust_score", label: "Trust Score" },
  { value: "name", label: "Name (A-Z)" },
  { value: "newest", label: "Newest First" },
] as const;

interface SortSelectProps {
  currentSort: string;
  onSortChange: (sort: string) => void;
}

export function SortSelect({ currentSort, onSortChange }: SortSelectProps) {
  return (
    <div className="flex items-center gap-2">
      <label htmlFor="sort-select" className="text-sm text-gray-500">
        Sort by:
      </label>
      <select
        id="sort-select"
        value={currentSort}
        onChange={(e) => onSortChange(e.target.value)}
        className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 focus:border-forest-500 focus:outline-none focus:ring-1 focus:ring-forest-500"
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
