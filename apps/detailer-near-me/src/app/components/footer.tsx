import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-brown-500">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {/* Find Detailers */}
          <div>
            <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-brand-200">
              Find Detailers
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/" className="text-sm text-brand-200 transition-colors hover:text-white">
                  Matchmaker Wizard
                </Link>
              </li>
              <li>
                <Link href="/search" className="text-sm text-brand-200 transition-colors hover:text-white">
                  Search All
                </Link>
              </li>
              <li>
                <Link href="/search?tier=featured" className="text-sm text-brand-200 transition-colors hover:text-white">
                  Featured Detailers
                </Link>
              </li>
              <li>
                <Link href="/search?sort_by=trust_score" className="text-sm text-brand-200 transition-colors hover:text-white">
                  Top Rated
                </Link>
              </li>
            </ul>
          </div>

          {/* Airports */}
          <div>
            <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-brand-200">
              Airports
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/airports" className="text-sm text-brand-200 transition-colors hover:text-white">
                  Browse All Airports
                </Link>
              </li>
              <li>
                <Link href="/airports/MIA" className="text-sm text-brand-200 transition-colors hover:text-white">
                  Miami (MIA)
                </Link>
              </li>
              <li>
                <Link href="/airports/LAX" className="text-sm text-brand-200 transition-colors hover:text-white">
                  Los Angeles (LAX)
                </Link>
              </li>
              <li>
                <Link href="/airports/TEB" className="text-sm text-brand-200 transition-colors hover:text-white">
                  Teterboro (TEB)
                </Link>
              </li>
            </ul>
          </div>

          {/* For Detailers */}
          <div>
            <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-brand-200">
              For Detailers
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/claim" className="text-sm text-brand-200 transition-colors hover:text-white">
                  List Your Business
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-sm text-brand-200 transition-colors hover:text-white">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/dashboard/leads" className="text-sm text-brand-200 transition-colors hover:text-white">
                  Manage Leads
                </Link>
              </li>
              <li>
                <Link href="/dashboard/upgrade" className="text-sm text-brand-200 transition-colors hover:text-white">
                  Upgrade Plan
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-brand-200">
              Company
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/about" className="text-sm text-brand-200 transition-colors hover:text-white">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-brand-200 transition-colors hover:text-white">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm text-brand-200 transition-colors hover:text-white">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-brand-200 transition-colors hover:text-white">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-10 border-t border-brand-200/20 pt-6 text-center">
          <p className="text-sm text-brand-300">
            &copy; {new Date().getFullYear()} Aircraft Detailer Near Me. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
