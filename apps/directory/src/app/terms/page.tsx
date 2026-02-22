import type { Metadata } from "next";
import { Header } from "../components/header";
import { Footer } from "../components/footer";

export const metadata: Metadata = {
  title: "Terms of Service | Aircraft Detailing Directory",
  description:
    "Terms of Service for Aircraft Detailing Directory. Please read these terms carefully before using our services.",
};

export default function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-gray-50">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
          <h1 className="font-heading text-3xl font-bold text-forest-800">
            Terms of Service
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Last updated: February 20, 2026
          </p>

          <div className="mt-10 space-y-10 text-gray-700">
            <section>
              <h2 className="text-xl font-semibold text-forest-800">
                Acceptance of Terms
              </h2>
              <p className="mt-3 leading-relaxed">
                By accessing or using Aircraft Detailing Directory at
                aircraftdetailingdirectory.net, you agree to be bound by these
                Terms of Service. If you do not agree to these terms, please do
                not use our services.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-forest-800">
                Description of Service
              </h2>
              <p className="mt-3 leading-relaxed">
                Aircraft Detailing Directory is a directory listing service for
                aircraft detailing professionals. We provide a platform where
                detailing businesses can create listings and potential customers
                can discover and connect with service providers.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-forest-800">
                User Accounts
              </h2>
              <p className="mt-3 leading-relaxed">
                Some features of Aircraft Detailing Directory may require you to
                create an account. You are responsible for maintaining the
                confidentiality of your account credentials and for all
                activities that occur under your account.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-forest-800">
                Listing Content and Accuracy
              </h2>
              <p className="mt-3 leading-relaxed">
                Users who create listings are responsible for ensuring the
                accuracy and completeness of the information they provide.
                Aircraft Detailing Directory does not verify the accuracy of
                listing content and is not responsible for any errors or
                omissions in user-submitted information.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-forest-800">
                Prohibited Conduct
              </h2>
              <p className="mt-3 leading-relaxed">
                You agree not to use Aircraft Detailing Directory for any
                unlawful purpose, to submit false or misleading information, to
                interfere with the proper functioning of the service, to attempt
                unauthorized access to our systems, or to engage in any activity
                that could harm other users or our platform.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-forest-800">
                Intellectual Property
              </h2>
              <p className="mt-3 leading-relaxed">
                All content and materials available on Aircraft Detailing
                Directory, including but not limited to text, graphics, logos,
                and software, are the property of Aircraft Detailing Directory or
                its licensors and are protected by applicable intellectual
                property laws.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-forest-800">
                Limitation of Liability
              </h2>
              <p className="mt-3 leading-relaxed">
                Aircraft Detailing Directory is provided on an &quot;as is&quot;
                and &quot;as available&quot; basis. To the fullest extent
                permitted by law, we disclaim all warranties and shall not be
                liable for any indirect, incidental, special, consequential, or
                punitive damages arising from your use of our services.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-forest-800">
                Termination
              </h2>
              <p className="mt-3 leading-relaxed">
                We reserve the right to suspend or terminate your access to
                Aircraft Detailing Directory at our sole discretion, without
                notice, for conduct that we believe violates these Terms of
                Service or is harmful to other users, us, or third parties.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-forest-800">
                Governing Law
              </h2>
              <p className="mt-3 leading-relaxed">
                These Terms of Service shall be governed by and construed in
                accordance with the laws of the State of Delaware, without
                regard to its conflict of law provisions.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-forest-800">
                Changes to Terms
              </h2>
              <p className="mt-3 leading-relaxed">
                We reserve the right to modify these Terms of Service at any
                time. Changes will be effective immediately upon posting to
                aircraftdetailingdirectory.net. Your continued use of Aircraft
                Detailing Directory after any changes constitutes your acceptance
                of the revised terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-forest-800">
                Contact
              </h2>
              <p className="mt-3 leading-relaxed">
                If you have any questions about these Terms of Service, please
                visit our{" "}
                <a
                  href="/contact"
                  className="text-forest-600 underline hover:text-forest-700"
                >
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
