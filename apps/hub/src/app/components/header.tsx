"use client";

import { useState } from "react";
import Link from "next/link";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-teal-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* ── Logo ─────────────────────────────────────────────────── */}
          <Link href="/" className="flex items-center gap-2.5 group">
            {/* Friendly airplane/hub icon */}
            <svg
              viewBox="0 0 36 36"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="h-9 w-9 text-teal-600 transition-transform group-hover:scale-105"
            >
              {/* Hub circle */}
              <circle
                cx="18"
                cy="18"
                r="16"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
              />
              {/* Airplane body */}
              <path
                d="M8 20l8-6 4 1 8-7 1 1-5 9-1 4-6 8z"
                fill="currentColor"
                opacity="0.9"
              />
              {/* Wing detail */}
              <path
                d="M14 17l5-2 2 1-5 3z"
                fill="white"
                opacity="0.5"
              />
              {/* Hub dots — community feel */}
              <circle cx="7" cy="12" r="1.5" fill="currentColor" opacity="0.4" />
              <circle cx="28" cy="26" r="1.5" fill="currentColor" opacity="0.4" />
              <circle cx="26" cy="10" r="1.5" fill="currentColor" opacity="0.4" />
            </svg>

            <div className="flex flex-col">
              <span className="text-teal-700 font-heading font-bold text-lg leading-tight">
                Aviation Detailing Hub
              </span>
              <span className="text-gray-400 text-xs leading-tight hidden sm:block">
                Your Community for Aircraft Care
              </span>
            </div>
          </Link>

          {/* ── Desktop Nav ──────────────────────────────────────────── */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/services"
              className="text-gray-600 hover:text-teal-600 font-body text-sm font-medium transition-colors"
            >
              Browse Services
            </Link>
            <Link
              href="/search"
              className="text-gray-600 hover:text-teal-600 font-body text-sm font-medium transition-colors"
            >
              Search
            </Link>
            <Link
              href="/community"
              className="text-gray-600 hover:text-teal-600 font-body text-sm font-medium transition-colors"
            >
              Community
            </Link>
            <Link
              href="/claim"
              className="inline-flex items-center gap-1.5 bg-coral-400 hover:bg-coral-500 text-white text-sm font-semibold px-5 py-2 rounded-full transition-colors shadow-sm"
            >
              Join the Hub
            </Link>
          </nav>

          {/* ── Mobile Hamburger ─────────────────────────────────────── */}
          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center rounded-lg p-2 text-gray-600 hover:text-teal-600 hover:bg-teal-50 transition-colors"
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

        {/* ── Mobile Menu ──────────────────────────────────────────── */}
        {mobileOpen && (
          <div className="md:hidden border-t border-teal-100 py-4 space-y-1">
            <Link
              href="/services"
              className="block px-3 py-2.5 rounded-xl text-gray-600 hover:text-teal-600 hover:bg-teal-50 font-body text-sm font-medium transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              Browse Services
            </Link>
            <Link
              href="/search"
              className="block px-3 py-2.5 rounded-xl text-gray-600 hover:text-teal-600 hover:bg-teal-50 font-body text-sm font-medium transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              Search
            </Link>
            <Link
              href="/community"
              className="block px-3 py-2.5 rounded-xl text-gray-600 hover:text-teal-600 hover:bg-teal-50 font-body text-sm font-medium transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              Community
            </Link>
            <div className="pt-2 px-3">
              <Link
                href="/claim"
                className="block text-center bg-coral-400 hover:bg-coral-500 text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-colors shadow-sm"
                onClick={() => setMobileOpen(false)}
              >
                Join the Hub
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
