"use client";

// Hindu For Justice — long-form historical account.
// Content auto-extracted from the designer reference into
// src/data/hindu-for-justice.ts as an ordered node flow per section.
import { HfjHero, HfjBody, HfjProgress } from "@/components/hfj/HfjSections";
import { Footer } from "@/components/Footer";

export default function HinduForJusticePage() {
  return (
    <>
      <HfjProgress />
      <HfjHero />
      <HfjBody />
      <Footer />
    </>
  );
}
