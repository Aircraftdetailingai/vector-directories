import type { Metadata } from "next";
import { IBM_Plex_Sans, Merriweather } from "next/font/google";
import "./globals.css";

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-ibm-plex-sans",
  display: "swap",
});

const merriweather = Merriweather({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  variable: "--font-merriweather",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Aircraft Detailing Directory | Find Trusted Aircraft Detailers",
  description:
    "The most comprehensive directory of aircraft detailing professionals across the United States. Search by state, airport, or specialty.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${ibmPlexSans.variable} ${merriweather.variable}`}>
      <body className="min-h-screen bg-white">{children}</body>
    </html>
  );
}
