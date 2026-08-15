"use client";

// RSS Museum — स्मृतियों का संग्रहालय. A second view over the same hundred
// years as /rss (it reuses rssEras / rssYears), presented as a wall of framed
// photographs paged one era at a time, in its own aged-paper palette.
import { MuseumPage } from "@/components/rss/MuseumSections";
import { Footer } from "@/components/Footer";

export default function RssMuseumPage() {
  return (
    <>
      <MuseumPage />
      <Footer />
    </>
  );
}
