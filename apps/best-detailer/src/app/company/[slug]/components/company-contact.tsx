import { formatPhone, formatAddress } from "@vector/utils";

/* ── Types ─────────────────────────────────────────────────────────────── */

interface Company {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  trust_score: number | null;
  tier: string;
  is_claimed: boolean;
  website: string | null;
  phone: string | null;
  email: string | null;
  logo_url: string | null;
  claimed_by: string | null;
  created_at: string;
  updated_at: string;
}

interface Location {
  id: string;
  company_id: string;
  name: string;
  address_line1: string;
  address_line2: string | null;
  city: string;
  state: string;
  zip: string;
  country: string;
  lat: number | null;
  lng: number | null;
  phone: string | null;
  is_headquarters: boolean;
  created_at: string;
  updated_at: string;
}

/* ── Icon Components ───────────────────────────────────────────────────── */

function PhoneIcon() {
  return (
    <svg
      className="h-5 w-5 text-gold-500 shrink-0"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
      />
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg
      className="h-5 w-5 text-gold-500 shrink-0"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
      />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg
      className="h-5 w-5 text-gold-500 shrink-0"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418"
      />
    </svg>
  );
}

function MapPinIcon() {
  return (
    <svg
      className="h-5 w-5 text-gold-500 shrink-0"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
      />
    </svg>
  );
}

/* ── Component ─────────────────────────────────────────────────────────── */

export default function CompanyContact({
  company,
  locations,
}: {
  company: Company;
  locations: Location[];
}) {
  const hq = locations.find((l) => l.is_headquarters) ?? locations[0];
  const hasContactInfo =
    company.phone || company.email || company.website || hq;

  if (!hasContactInfo) return null;

  return (
    <div className="bg-noir-900 text-ivory-100 p-6 rounded-sm">
      <h3 className="font-heading text-lg text-gold-500 font-light tracking-wide mb-6">
        Contact
      </h3>
      <div className="h-px bg-noir-800 mb-6" />

      <div className="space-y-5">
        {/* Phone */}
        {company.phone && (
          <div className="flex items-center gap-3">
            <PhoneIcon />
            <div>
              <p className="text-gold-500 text-xs uppercase tracking-widest font-body mb-0.5">
                Phone
              </p>
              <a
                href={`tel:${company.phone}`}
                className="text-sm text-ivory-300 hover:text-gold-500 transition-colors font-body"
              >
                {formatPhone(company.phone)}
              </a>
            </div>
          </div>
        )}

        {/* Email */}
        {company.email && (
          <div className="flex items-center gap-3">
            <EmailIcon />
            <div>
              <p className="text-gold-500 text-xs uppercase tracking-widest font-body mb-0.5">
                Email
              </p>
              <a
                href={`mailto:${company.email}`}
                className="text-sm text-ivory-300 hover:text-gold-500 transition-colors font-body break-all"
              >
                {company.email}
              </a>
            </div>
          </div>
        )}

        {/* Website */}
        {company.website && (
          <div className="flex items-center gap-3">
            <GlobeIcon />
            <div>
              <p className="text-gold-500 text-xs uppercase tracking-widest font-body mb-0.5">
                Website
              </p>
              <a
                href={company.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-ivory-300 hover:text-gold-500 transition-colors font-body break-all"
              >
                {company.website.replace(/^https?:\/\//, "")}
              </a>
            </div>
          </div>
        )}

        {/* Address */}
        {hq && (
          <div className="flex items-start gap-3">
            <MapPinIcon />
            <div>
              <p className="text-gold-500 text-xs uppercase tracking-widest font-body mb-0.5">
                Address
              </p>
              <p className="text-sm text-ivory-300 font-body">
                {formatAddress(hq)}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Additional locations */}
      {locations.length > 1 && (
        <div className="mt-6 pt-4 border-t border-noir-800">
          <p className="text-xs text-ivory-500 font-body">
            +{locations.length - 1} additional location
            {locations.length - 1 > 1 ? "s" : ""}
          </p>
        </div>
      )}
    </div>
  );
}
