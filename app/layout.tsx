import type { Metadata } from "next";
import "../src/styles/globals.css";
import { Providers } from "./providers";
import { SiteChrome } from "./site-chrome";

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
    <html lang="en">
      <body>
        <Providers>
          <SiteChrome />
          {children}
        </Providers>
      </body>
    </html>
  );
}
