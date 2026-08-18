import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const themeScript = `try{if(localStorage.getItem("aqw-theme")==="light")document.documentElement.dataset.theme="light"}catch(e){}`;
import { AuthProvider } from "@/lib/auth-context";
import { SettingsProvider } from "@/lib/settings-context";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "AquaNetIO - DOST-ASTI Water Quality Monitoring",
  description:
    "Real-time aquaculture water quality monitoring and ammonia toxicity prediction system by DOST-ASTI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="h-full flex flex-col">
        <AuthProvider>
          <SettingsProvider>{children}</SettingsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
