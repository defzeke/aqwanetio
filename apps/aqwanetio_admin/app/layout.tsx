import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AquaNetIO Admin — DOST-ASTI",
  description: "AquaNetIO industrial node monitoring and administration dashboard.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex">{children}</body>
    </html>
  );
}
