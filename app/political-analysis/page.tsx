"use client";

// Political Analysis — long-form read on the 2024 Lok Sabha election.
// Content auto-extracted from the designer reference into
// src/data/political-analysis.ts. Static-data-first, no API dependency.
import { PaHero, PaBody } from "@/components/pa/PaSections";
import { AnalyticsExplorer } from "@/components/political-analysis/AnalyticsExplorer";
import { Footer } from "@/components/Footer";

export default function PoliticalAnalysisPage() {
  return (
    <>
      {/* D4: at 390px this page is ~20,000px tall with no way to gauge position.
          Progress runs off the document's own scroll timeline — no listener,
          no rAF, and it stays on the compositor. */}
      <div
        aria-hidden
        className="sd-progress fixed inset-x-0 top-0 z-50 h-[3px] bg-[#FF9933]"
      />
      <PaHero />
      <AnalyticsExplorer />
      <PaBody />
      <Footer />
    </>
  );
}
