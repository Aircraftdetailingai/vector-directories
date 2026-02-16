import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-6 h-6 text-electric-500"
              >
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
              <span className="text-electric-500 font-heading font-bold text-lg">
                Detailer Pro
              </span>
            </Link>
            <p className="text-sm text-slate-500 leading-relaxed">
              The professional network for aircraft detailing. Verified pros,
              portfolio showcases, and business growth tools.
            </p>
          </div>

          {/* Network */}
          <div>
            <h3 className="text-white font-heading font-semibold text-sm uppercase tracking-wider mb-4">
              Network
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/search"
                  className="text-sm text-slate-500 hover:text-slate-300 transition-colors"
                >
                  Browse Pros
                </Link>
              </li>
              <li>
                <Link
                  href="/search?sort_by=trust_score"
                  className="text-sm text-slate-500 hover:text-slate-300 transition-colors"
                >
                  Top Rated
                </Link>
              </li>
              <li>
                <Link
                  href="/airports"
                  className="text-sm text-slate-500 hover:text-slate-300 transition-colors"
                >
                  Airports
                </Link>
              </li>
            </ul>
          </div>

          {/* Specializations */}
          <div>
            <h3 className="text-white font-heading font-semibold text-sm uppercase tracking-wider mb-4">
              Specializations
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/specializations/private-jets"
                  className="text-sm text-slate-500 hover:text-slate-300 transition-colors"
                >
                  Private Jets
                </Link>
              </li>
              <li>
                <Link
                  href="/specializations/helicopters"
                  className="text-sm text-slate-500 hover:text-slate-300 transition-colors"
                >
                  Helicopters
                </Link>
              </li>
              <li>
                <Link
                  href="/specializations/commercial"
                  className="text-sm text-slate-500 hover:text-slate-300 transition-colors"
                >
                  Commercial
                </Link>
              </li>
              <li>
                <Link
                  href="/specializations/turboprops"
                  className="text-sm text-slate-500 hover:text-slate-300 transition-colors"
                >
                  Turboprops
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources & Legal */}
          <div>
            <h3 className="text-white font-heading font-semibold text-sm uppercase tracking-wider mb-4">
              Resources
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/claim/example"
                  className="text-sm text-slate-500 hover:text-slate-300 transition-colors"
                >
                  Go Pro
                </Link>
              </li>
              <li>
                <Link
                  href="/claim/example"
                  className="text-sm text-slate-500 hover:text-slate-300 transition-colors"
                >
                  Pricing
                </Link>
              </li>
            </ul>
            <h3 className="text-white font-heading font-semibold text-sm uppercase tracking-wider mb-4 mt-6">
              Legal
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-slate-500 hover:text-slate-300 transition-colors"
                >
                  Privacy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-sm text-slate-500 hover:text-slate-300 transition-colors"
                >
                  Terms
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-slate-800 text-center">
          <p className="text-sm text-slate-600">
            &copy; {new Date().getFullYear()} Aircraft Detailer Pro. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
