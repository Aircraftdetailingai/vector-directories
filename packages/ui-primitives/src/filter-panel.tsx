"use client";

import React from "react";

export interface FilterOption {
  label: string;
  value: string;
}

export interface FilterGroup {
  name: string;
  key: string;
  options: FilterOption[];
}

export interface FilterPanelProps {
  groups: FilterGroup[];
  values: Record<string, string>;
  onChange: (key: string, value: string) => void;
  onReset: () => void;
  className?: string;
}

export function FilterPanel({
  groups,
  values,
  onChange,
  onReset,
  className,
}: FilterPanelProps) {
  return (
    <div role="group" aria-label="Filters" className={className}>
      {groups.map((group) => (
        <fieldset key={group.key}>
          <legend>{group.name}</legend>
          <select
            value={values[group.key] ?? ""}
            onChange={(e) => onChange(group.key, e.target.value)}
            aria-label={group.name}
          >
            <option value="">All</option>
            {group.options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </fieldset>
      ))}
      <button type="button" onClick={onReset}>
        Reset Filters
      </button>
    </div>
  );
}
