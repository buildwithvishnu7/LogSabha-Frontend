"use client";

// Hindu For Justice — the editorial record across fourteen chapters, with a 3D
// era timeline you travel from the 8th century to the present.
//
// The body now comes from src/data/hfj-chapters.ts, converted from the new
// reference's own extraction. The previous file (src/data/hindu-for-justice.ts)
// is left on disk untouched: it holds the same text but carries 12 duplicated
// headings and repeats the Partition chapter, and its images were 30MB of PNG
// against the reference's 5MB of JPEG.
import { HfjHero, HfjProgress } from "@/components/hfj/HfjSections";
import { EraTimelineSection } from "@/components/hfj/EraTimelineSection";
import { HfjChapterBody } from "@/components/hfj/HfjChapterBody";
import { Footer } from "@/components/Footer";

export default function HinduForJusticePage() {
  return (
    <>
      <HfjProgress />
      <HfjHero />
      <EraTimelineSection />
      <HfjChapterBody />
      <Footer />
    </>
  );
}
