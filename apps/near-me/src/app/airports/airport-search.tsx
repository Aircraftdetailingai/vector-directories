"use client";

import { useState } from "react";

export function AirportSearch() {
  const [query, setQuery] = useState("");

  // Filter airport cards by hiding non-matching ones via CSS
  // This is a lightweight client-side filter that works with server-rendered content
  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
        <svg
          className="h-5 w-5 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
          />
        </svg>
      </div>
      <input
        type="search"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          // Use DOM filtering for simplicity — hide non-matching airport cards
          const cards = document.querySelectorAll<HTMLElement>("[data-airport-card]");
          const q = e.target.value.toLowerCase();
          cards.forEach((card) => {
            const text = card.textContent?.toLowerCase() ?? "";
            card.style.display = text.includes(q) ? "" : "none";
          });
        }}
        placeholder="Search airports by name, code, or city..."
        className="block w-full rounded-xl border border-gray-300 bg-white py-3 pl-11 pr-4 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
      />
    </div>
  );
}
