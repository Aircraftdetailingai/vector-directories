"use client";

import { useState } from "react";
import Link from "next/link";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-brand-100 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 32 32"
            className="h-8 w-8 text-brand-500"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
          >
            {/* Airplane silhouette */}
            <path
              d="M16 4 L20 14 L28 16 L20 18 L16 28 L12 18 L4 16 L12 14 Z"
              fill="currentColor"
              stroke="none"
            />
            {/* Location pin ring */}
            <circle cx="16" cy="16" r="14" strokeDasharray="4 3" />
          </svg>
          <span className="font-heading text-xl font-bold text-brand-500">
            Detailer Near Me
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 md:flex">
          <Link
            href="/"
            className="font-body text-sm font-medium text-gray-600 transition-colors hover:text-brand-500"
          >
            Find Detailers
          </Link>
          <Link
            href="/airports"
            className="font-body text-sm font-medium text-gray-600 transition-colors hover:text-brand-500"
          >
            Browse Airports
          </Link>
          <Link
            href="/search"
            className="font-body text-sm font-medium text-gray-600 transition-colors hover:text-brand-500"
          >
            Search
          </Link>
          <Link
            href="/claim"
            className="rounded-xl bg-brand-500 px-4 py-2 font-body text-sm font-semibold text-white transition-colors hover:bg-brand-600"
          >
            List Your Business
          </Link>
        </nav>

        {/* Mobile hamburger */}
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-xl p-2 text-gray-600 hover:bg-brand-50 hover:text-brand-500 md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-brand-100 bg-white px-4 pb-4 pt-2 md:hidden">
          <nav className="flex flex-col gap-2">
            <Link
              href="/"
              className="rounded-xl px-3 py-2 font-body text-sm font-medium text-gray-600 hover:bg-brand-50 hover:text-brand-500"
              onClick={() => setMobileOpen(false)}
            >
              Find Detailers
            </Link>
            <Link
              href="/airports"
              className="rounded-xl px-3 py-2 font-body text-sm font-medium text-gray-600 hover:bg-brand-50 hover:text-brand-500"
              onClick={() => setMobileOpen(false)}
            >
              Browse Airports
            </Link>
            <Link
              href="/search"
              className="rounded-xl px-3 py-2 font-body text-sm font-medium text-gray-600 hover:bg-brand-50 hover:text-brand-500"
              onClick={() => setMobileOpen(false)}
            >
              Search
            </Link>
            <Link
              href="/claim"
              className="mt-1 rounded-xl bg-brand-500 px-3 py-2 text-center font-body text-sm font-semibold text-white hover:bg-brand-600"
              onClick={() => setMobileOpen(false)}
            >
              List Your Business
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
