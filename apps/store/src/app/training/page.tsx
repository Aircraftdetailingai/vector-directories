import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/app/components/header";
import { Footer } from "@/app/components/footer";

export const metadata: Metadata = {
  title: "Training | Aircraft Detailing 101",
  description:
    "Master the art of aircraft detailing with professional training courses. Learn polishing, ceramic coating, and how to build your detailing business.",
};

const courses = [
  {
    title: "Aircraft Detailing Fundamentals",
    description:
      "Learn the basics of aircraft washing, polishing, and protection. This comprehensive course covers everything from surface identification to proper product selection.",
    href: "#",
  },
  {
    title: "Advanced Metal Polishing Techniques",
    description:
      "Master bare metal polishing for show-quality results. Deep dive into compound grades, buffing techniques, and achieving mirror-like finishes on aluminum and chrome.",
    href: "#",
  },
  {
    title: "Ceramic Coating Application",
    description:
      "Professional coating application for aircraft. Learn surface preparation, application methods, curing processes, and maintenance protocols for long-lasting protection.",
    href: "#",
  },
  {
    title: "Building Your Detailing Business",
    description:
      "Start and grow an aircraft detailing company. Covers business planning, pricing strategies, marketing, insurance, and scaling your operation at FBOs and airports.",
    href: "#",
  },
];

export default function TrainingPage() {
  return (
    <div className="flex min-h-screen flex-col font-sans">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-[#2563EB] px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl text-center">
            <h1 className="text-4xl font-bold text-white sm:text-5xl">
              Aircraft Detailing Training
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-blue-100">
              Master the art of aircraft detailing with professional-grade
              courses taught by industry experts. Learn at your own pace on
              our Thinkific platform.
            </p>
          </div>
        </section>

        {/* Courses Section */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {courses.map((course) => (
              <div
                key={course.title}
                className="flex flex-col rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <h3 className="text-xl font-bold text-[#0F172A]">
                  {course.title}
                </h3>
                <p className="mt-3 flex-1 text-gray-600">
                  {course.description}
                </p>
                <Link
                  href={course.href}
                  className="mt-6 inline-flex items-center gap-2 self-start rounded-lg bg-[#2563EB] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
                >
                  View on Thinkific
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={16}
                    height={16}
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
                </Link>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
