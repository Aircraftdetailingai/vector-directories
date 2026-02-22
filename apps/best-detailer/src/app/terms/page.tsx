import type { Metadata } from "next";
import Header from "../components/header";
import Footer from "../components/footer";

export const metadata: Metadata = {
  title: "Terms of Service | Best Aircraft Detailer",
  description:
    "Read the terms and conditions for using Best Aircraft Detailer.",
};

export default function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-gray-50">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
          <h1 className="font-heading text-3xl font-bold text-noir-900">
            Terms of Service
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Last updated: February 20, 2026
          </p>

          <div className="mt-8 space-y-8 text-gray-700 leading-relaxed">
            <section>
              <h2 className="font-heading text-xl font-semibold text-noir-900">
                1. Acceptance of Terms
              </h2>
              <p className="mt-3">
                By accessing or using Best Aircraft Detailer
                (bestaircraftdetailer.com), you agree to be bound by these Terms
                of Service. If you do not agree to these terms, please do not
                use our website.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold text-noir-900">
                2. Description of Service
              </h2>
              <p className="mt-3">
                Best Aircraft Detailer is a curated directory and editorial
                platform that showcases top aircraft detailing professionals.
                We provide business listings, curated collections,
                Editor&apos;s Choice awards, and tools for detailing
                professionals to manage their online presence.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold text-noir-900">
                3. User Accounts
              </h2>
              <p className="mt-3">
                Some features of our service require you to create an account.
                You are responsible for maintaining the confidentiality of your
                account credentials and for all activities that occur under your
                account. You agree to notify us immediately of any unauthorized
                use.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold text-noir-900">
                4. Business Listings
              </h2>
              <p className="mt-3">
                Detailing professionals who claim or create listings represent
                and warrant that all information provided is accurate and
                current. We reserve the right to remove or modify any listing
                that violates these terms or contains inaccurate information.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold text-noir-900">
                5. Intellectual Property
              </h2>
              <p className="mt-3">
                All content on this website, including but not limited to text,
                graphics, logos, images, and software, is the property of Best
                Aircraft Detailer or its content suppliers and is protected by
                intellectual property laws. You may not reproduce, distribute,
                or create derivative works without our prior written consent.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold text-noir-900">
                6. User Content
              </h2>
              <p className="mt-3">
                By submitting content to our platform (including business
                information, images, and reviews), you grant us a
                non-exclusive, worldwide, royalty-free license to use, display,
                and distribute that content in connection with our services. You
                retain ownership of your content.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold text-noir-900">
                7. Prohibited Conduct
              </h2>
              <p className="mt-3">You agree not to:</p>
              <ul className="mt-3 list-disc space-y-2 pl-6">
                <li>
                  Use the service for any unlawful purpose or in violation of
                  any applicable laws.
                </li>
                <li>
                  Submit false, misleading, or inaccurate information.
                </li>
                <li>
                  Interfere with or disrupt the service or servers connected to
                  the service.
                </li>
                <li>
                  Attempt to gain unauthorized access to any portion of the
                  service.
                </li>
                <li>
                  Scrape, harvest, or collect information from the service
                  without our consent.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold text-noir-900">
                8. Disclaimer of Warranties
              </h2>
              <p className="mt-3">
                The service is provided &quot;as is&quot; and &quot;as
                available&quot; without warranties of any kind, either express
                or implied. We do not warrant that the service will be
                uninterrupted, error-free, or free of viruses or other harmful
                components.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold text-noir-900">
                9. Limitation of Liability
              </h2>
              <p className="mt-3">
                To the fullest extent permitted by law, Best Aircraft Detailer
                shall not be liable for any indirect, incidental, special,
                consequential, or punitive damages arising out of or relating
                to your use of the service.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold text-noir-900">
                10. Termination
              </h2>
              <p className="mt-3">
                We reserve the right to terminate or suspend your access to the
                service at any time, without prior notice or liability, for any
                reason, including if you breach these Terms of Service.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold text-noir-900">
                11. Changes to Terms
              </h2>
              <p className="mt-3">
                We may revise these Terms of Service at any time. Changes will
                be effective when posted on this page with an updated date.
                Your continued use of the service after any changes constitutes
                acceptance of the new terms.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold text-noir-900">
                12. Governing Law
              </h2>
              <p className="mt-3">
                These Terms of Service shall be governed by and construed in
                accordance with the laws of the United States, without regard
                to conflict of law principles.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold text-noir-900">
                13. Contact Us
              </h2>
              <p className="mt-3">
                If you have any questions about these Terms of Service, please
                visit our{" "}
                <a href="/contact" className="text-gold-500 underline hover:text-gold-600">
                  contact page
                </a>
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
