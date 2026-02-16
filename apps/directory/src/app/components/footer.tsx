import Link from "next/link";

const FOOTER_NAV = {
  Directory: [
    { label: "Browse by State", href: "/browse/state" },
    { label: "Browse by Airport", href: "/browse/airport" },
    { label: "A-Z Index", href: "/browse/a-z" },
    { label: "Search", href: "/search" },
  ],
  "For Businesses": [
    { label: "Claim Your Listing", href: "/claim" },
    { label: "Pricing", href: "/pricing" },
    { label: "Advertise", href: "/advertise" },
  ],
  Company: [
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ],
} as const;

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-forest-800">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <svg
                className="h-7 w-7 text-forest-100"
                viewBox="0 0 32 32"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M16 2L4 8v16l12 6 12-6V8L16 2z"
                  fill="currentColor"
                  opacity="0.2"
                />
                <path
                  d="M16 10l-6 3v6l6 3 6-3v-6l-6-3z"
                  fill="currentColor"
                />
              </svg>
              <span className="font-heading text-base font-bold text-white">
                Aircraft Detailing Directory
              </span>
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-forest-200">
              The most comprehensive directory of aircraft detailing
              professionals in the United States.
            </p>
          </div>

          {/* Nav columns */}
          {Object.entries(FOOTER_NAV).map(([title, links]) => (
            <div key={title}>
              <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-forest-100">
                {title}
              </h3>
              <ul className="mt-4 space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-forest-300 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-forest-700 pt-8 text-center">
          <p className="text-sm text-forest-300">
            &copy; {new Date().getFullYear()} Aircraft Detailing Directory. All
            rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
