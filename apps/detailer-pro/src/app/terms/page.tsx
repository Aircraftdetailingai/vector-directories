import type { Metadata } from "next";
import Header from "../components/header";
import Footer from "../components/footer";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service | Aircraft Detailer Pro",
  description:
    "Read the Terms of Service for Aircraft Detailer Pro.",
};

export default function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-gray-50">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
          <h1 className="font-heading text-3xl font-bold text-slate-900">
            Terms of Service
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Effective date: February 20, 2026
          </p>

          <div className="mt-10 space-y-10 text-gray-700 leading-relaxed">
            <section>
              <h2 className="text-xl font-semibold text-slate-900">
                Acceptance of Terms
              </h2>
              <p className="mt-3">
                By accessing or using Aircraft Detailer Pro
                (aircraftdetailerpro.com), you agree to be bound by these Terms
                of Service. If you do not agree with any part of these terms,
                you may not use the platform.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900">
                Description of Service
              </h2>
              <p className="mt-3">
                Aircraft Detailer Pro is an online directory platform that
                connects aircraft owners with professional detailing service
                providers. We provide listing pages, search functionality, and
                related tools to facilitate discovery and communication between
                users and businesses.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900">
                User Accounts
              </h2>
              <p className="mt-3">
                You may be required to create an account to access certain
                features. You are responsible for maintaining the confidentiality
                of your credentials and for all activity that occurs under your
                account. You agree to provide accurate and complete information
                during registration and to update it as necessary.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900">
                Listing Accuracy
              </h2>
              <p className="mt-3">
                Business owners who claim or create listings are responsible for
                the accuracy of the information provided. Aircraft Detailer Pro
                does not verify the qualifications, certifications, or quality of
                listed service providers. Users are encouraged to conduct their
                own due diligence before engaging any service provider found on
                the platform.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900">
                Prohibited Conduct
              </h2>
              <p className="mt-3">You agree not to:</p>
              <ul className="mt-3 list-disc space-y-2 pl-6">
                <li>
                  Use the platform for any unlawful purpose or in violation of
                  any applicable laws.
                </li>
                <li>
                  Post false, misleading, or fraudulent business information.
                </li>
                <li>
                  Attempt to gain unauthorized access to other user accounts or
                  platform systems.
                </li>
                <li>
                  Scrape, harvest, or collect data from the platform without
                  written consent.
                </li>
                <li>
                  Upload malicious code, viruses, or any content designed to
                  disrupt the platform.
                </li>
                <li>
                  Harass, abuse, or threaten other users of the platform.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900">
                Intellectual Property
              </h2>
              <p className="mt-3">
                All content, design, graphics, logos, and software on Aircraft
                Detailer Pro are the property of Aircraft Detailer Pro or its
                licensors and are protected by intellectual property laws. You
                may not reproduce, distribute, or create derivative works from
                any content on the platform without prior written permission.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900">
                Limitation of Liability
              </h2>
              <p className="mt-3">
                Aircraft Detailer Pro is provided on an &ldquo;as is&rdquo; and
                &ldquo;as available&rdquo; basis. To the fullest extent
                permitted by law, we disclaim all warranties, express or
                implied. We shall not be liable for any indirect, incidental,
                special, consequential, or punitive damages arising from your
                use of the platform, including but not limited to loss of
                profits, data, or business opportunities.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900">
                Termination
              </h2>
              <p className="mt-3">
                We reserve the right to suspend or terminate your account and
                access to the platform at our sole discretion, without notice,
                for conduct that we determine violates these Terms of Service or
                is harmful to other users, us, or third parties.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900">
                Governing Law
              </h2>
              <p className="mt-3">
                These Terms of Service shall be governed by and construed in
                accordance with the laws of the State of Delaware, without
                regard to its conflict of law principles. Any disputes arising
                under these terms shall be subject to the exclusive jurisdiction
                of the courts located in Delaware.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900">
                Changes to These Terms
              </h2>
              <p className="mt-3">
                We may update these Terms of Service from time to time. When we
                do, we will revise the effective date at the top of this page.
                Your continued use of Aircraft Detailer Pro after changes are
                posted constitutes your acceptance of the revised terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900">Contact</h2>
              <p className="mt-3">
                If you have questions about these Terms of Service, please visit
                our{" "}
                <Link
                  href="/contact"
                  className="text-electric-500 underline hover:text-electric-600"
                >
                  contact page
                </Link>
                .
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
