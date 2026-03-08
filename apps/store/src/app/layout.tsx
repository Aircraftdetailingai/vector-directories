import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Aircraft Detailing 101 | Professional Detailing Products & Supplies",
  description:
    "Shop professional aircraft detailing products. Polishes, ceramic coatings, towels, cleaners, tools, and complete kits from verified suppliers.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-white">{children}</body>
    </html>
  );
}
