"use client";

// RSS (Rashtriya Swayamsevak Sangh) — 100 years. Static-data-first
// (content bundled in src/data/rss.ts + rss-timeline.ts).
import { useState } from "react";
import {
  RssHero,
  FoundationSection,
  FounderSection,
  FoundingSection,
  TimelineIntroSection,
  TimelineSection,
} from "@/components/rss/RssSections";
import { SpiralSection } from "@/components/rss/SpiralSection";
import { Footer } from "@/components/Footer";

export default function RssPage() {
  // Picking a year in the spiral has to reach the timeline, which renders one
  // era at a time — so the year lives here, between the two.
  const [focusYear, setFocusYear] = useState<number | null>(null);

  return (
    <>
      {/* Reading progress, driven by the document's own scroll timeline — no
          listener, no rAF, and it runs off the main thread. */}
      <div
        aria-hidden
        className="sd-progress fixed inset-x-0 top-0 z-50 h-[3px] bg-[#FF7D0A]"
      />
      <RssHero />
      <FoundationSection />
      <FounderSection />
      <FoundingSection />
      <SpiralSection onPickYear={setFocusYear} />
      <TimelineIntroSection />
      <TimelineSection focusYear={focusYear} />
      <Footer />
    </>
  );
}
