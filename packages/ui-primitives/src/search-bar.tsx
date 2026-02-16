"use client";

import React, { useState, useCallback } from "react";

export interface SearchBarProps {
  defaultValue?: string;
  placeholder?: string;
  onSearch: (query: string) => void;
  className?: string;
}

export function SearchBar({
  defaultValue = "",
  placeholder = "Search...",
  onSearch,
  className,
}: SearchBarProps) {
  const [value, setValue] = useState(defaultValue);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      onSearch(value);
    },
    [value, onSearch],
  );

  return (
    <form role="search" onSubmit={handleSubmit} className={className}>
      <label>
        <span className="sr-only">Search</span>
        <input
          type="search"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          aria-label={placeholder}
        />
      </label>
      <button type="submit">Search</button>
    </form>
  );
}
