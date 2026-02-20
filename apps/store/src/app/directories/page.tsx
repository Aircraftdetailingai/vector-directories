import type { Metadata } from "next";
import { Header } from "@/app/components/header";
import { Footer } from "@/app/components/footer";

export const metadata: Metadata = {
  title: "Directories | Aircraft Detailing 101",
  description:
    "Browse our network of professional aircraft detailing directories. Find detailers near you, compare ratings, and connect with top-rated aviation detailing specialists.",
};

const directories = [
  {
    name: "Aircraft Detailing Directory",
    domain: "aircraftdetailingdirectory.com",
    description:
      "The comprehensive directory of aircraft detailing companies across the US.",
  },
  {
    name: "Aircraft Detailing Near Me",
    domain: "aircraftdetailingnearme.com",
    description:
      "Find aircraft detailers near your location with our map-based search.",
  },
  {
    name: "Aircraft Detailing Authority",
    domain: "aircraftdetailingauthority.com",
    description:
      "Expert rankings and Authority Score ratings for top detailers.",
  },
  {
    name: "Aviation Detailing Hub",
    domain: "aviationdetailinghub.com",
    description:
      "Your central hub for aviation detailing services and resources.",
  },
  {
    name: "Aircraft Detailer Pro",
    domain: "aircraftdetailerpro.com",
    description:
      "The professional network for verified aircraft detailing specialists.",
  },
  {
    name: "Aircraft Detailer Near Me",
    domain: "aircraftdetailernearme.com",
    description:
      "Quick matchmaker wizard to find and quote aircraft detailers.",
  },
  {
    name: "Best Aircraft Detailer",
    domain: "bestaircraftdetailer.com",
    description:
      "Curated selection of the finest aircraft detailers with Editor's Choice awards.",
  },
];

export default function DirectoriesPage() {
  return (
    <div className="flex min-h-screen flex-col font-sans">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-[#0F172A] px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl text-center">
            <h1 className="text-4xl font-bold text-white sm:text-5xl">
              Find Aircraft Detailers
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-300">
              Browse our network of professional aircraft detailing directories
              to find the right specialist for your aircraft.
            </p>
          </div>
        </section>

        {/* Directory Cards */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {directories.map((dir) => (
              <div
                key={dir.domain}
                className="flex flex-col rounded-lg bg-white p-6 shadow-sm ring-1 ring-gray-200 transition-shadow hover:shadow-md"
              >
                <h3 className="text-lg font-bold text-[#0F172A]">
                  {dir.name}
                </h3>
                <p className="mt-2 flex-1 text-sm text-gray-600">
                  {dir.description}
                </p>
                <a
                  href={`https://${dir.domain}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-1.5 self-start text-sm font-medium text-[#2563EB] hover:underline"
                >
                  Visit Site
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={14}
                    height={14}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                    />
                  </svg>
                </a>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
