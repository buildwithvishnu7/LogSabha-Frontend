import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "../src/styles/globals.css";
import { Providers } from "./providers";
import { SiteChrome } from "./site-chrome";

// Poppins is the typeface named in the client brief. next/font/google is part of
// Next itself — no new package — and it self-hosts the files at build time, so
// there is no request to Google at runtime and no swap-in layout shift.
// The variable feeds --font-sans in globals.css, which every component already
// resolves through, so nothing else has to change.
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "LogSabha",
  description:
    "LogSabha — India's political intelligence and analytics platform. Political research, election insights and civic engagement.",
  icons: { icon: "/favicon.ico" },
};

// Server layout: static shell + metadata. Everything interactive lives in
// client components (Providers/SiteChrome) — but note client components are
// still server-rendered to HTML, so the page content stays crawlable.
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={poppins.variable}>
      <body>
        <Providers>
          <SiteChrome />
          {children}
        </Providers>
      </body>
    </html>
  );
}
