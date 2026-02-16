import Link from "next/link";
import type { Company } from "@vector/types";

interface RecentAdditionsProps {
  companies: Company[];
}

export function RecentAdditions({ companies }: RecentAdditionsProps) {
  if (companies.length === 0) return null;

  return (
    <section className="border-t border-gray-100 bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="font-heading text-3xl font-bold text-forest-800 sm:text-4xl">
              Recently Added
            </h2>
            <p className="mt-3 text-gray-600">
              The newest aircraft detailing companies in our directory
            </p>
          </div>
          <Link
            href="/browse/a-z"
            className="hidden text-sm font-semibold text-forest-700 hover:text-forest-600 sm:block"
          >
            View all &rarr;
          </Link>
        </div>

        <div className="mt-10 overflow-hidden rounded-xl border border-gray-200">
          <table className="w-full">
            <thead className="bg-forest-800">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-forest-100 sm:px-6">
                  Company
                </th>
                <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-forest-100 sm:table-cell sm:px-6">
                  Trust Score
                </th>
                <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-forest-100 md:table-cell md:px-6">
                  Tier
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-forest-100 sm:px-6">
                  Added
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {companies.map((company) => {
                const date = new Date(company.created_at);
                const formatted = date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                });

                return (
                  <tr
                    key={company.id}
                    className="transition-colors hover:bg-forest-100/30"
                  >
                    <td className="px-4 py-4 sm:px-6">
                      <Link
                        href={`/company/${company.slug}`}
                        className="group flex items-center gap-3"
                      >
                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-forest-100 font-heading text-sm font-bold text-forest-700">
                          {company.name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <span className="block truncate font-heading text-sm font-semibold text-gray-900 group-hover:text-forest-700">
                            {company.name}
                          </span>
                          {company.is_claimed && (
                            <span className="text-xs text-forest-600">Verified</span>
                          )}
                        </div>
                      </Link>
                    </td>
                    <td className="hidden px-4 py-4 sm:table-cell sm:px-6">
                      <span className="text-sm font-medium text-gray-700">
                        {company.trust_score !== null
                          ? `${company.trust_score}/100`
                          : "N/A"}
                      </span>
                    </td>
                    <td className="hidden px-4 py-4 md:table-cell md:px-6">
                      <span className="inline-flex rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium capitalize text-gray-600">
                        {company.tier}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-500 sm:px-6">
                      {formatted}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/browse/a-z"
            className="text-sm font-semibold text-forest-700 hover:text-forest-600"
          >
            View all detailers &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
}
