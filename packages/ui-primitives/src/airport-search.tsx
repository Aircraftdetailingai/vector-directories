"use client";

import React, { useState, useCallback } from "react";
import * as Popover from "@radix-ui/react-popover";

export interface AirportOption {
  code: string;
  name: string;
  city: string;
  state: string;
}

export interface AirportSearchProps {
  airports: AirportOption[];
  value?: string;
  onSelect: (code: string) => void;
  placeholder?: string;
  className?: string;
}

export function AirportSearch({
  airports,
  value,
  onSelect,
  placeholder = "Search airports...",
  className,
}: AirportSearchProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const filtered = airports.filter(
    (a) =>
      a.code.toLowerCase().includes(query.toLowerCase()) ||
      a.name.toLowerCase().includes(query.toLowerCase()) ||
      a.city.toLowerCase().includes(query.toLowerCase()),
  );

  const handleSelect = useCallback(
    (code: string) => {
      onSelect(code);
      setOpen(false);
      setQuery("");
    },
    [onSelect],
  );

  const selected = airports.find((a) => a.code === value);

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button type="button" aria-label="Select airport" className={className}>
          {selected ? `${selected.code} - ${selected.name}` : placeholder}
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type to filter..."
            aria-label="Filter airports"
          />
          <ul role="listbox" aria-label="Airports">
            {filtered.map((airport) => (
              <li
                key={airport.code}
                role="option"
                aria-selected={airport.code === value}
                onClick={() => handleSelect(airport.code)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSelect(airport.code);
                }}
                tabIndex={0}
              >
                <strong>{airport.code}</strong> — {airport.name},{" "}
                {airport.city}, {airport.state}
              </li>
            ))}
            {filtered.length === 0 && (
              <li role="option" aria-disabled="true">
                No airports found
              </li>
            )}
          </ul>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
