"use client";

// RSS (Rashtriya Swayamsevak Sangh) — 100 years. Static-data-first
// (content bundled in src/data/rss.ts + rss-timeline.ts).
import {
  RssHero,
  FoundationSection,
  FounderSection,
  FoundingSection,
  TimelineIntroSection,
  TimelineSection,
} from "@/components/rss/RssSections";
import { Footer } from "@/components/Footer";

export default function RssPage() {
  return (
    <>
      <RssHero />
      <FoundationSection />
      <FounderSection />
      <FoundingSection />
      <TimelineIntroSection />
      <TimelineSection />
      <Footer />
    </>
  );
}
