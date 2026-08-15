"use client";

// Political Analysis — long-form read on the 2024 Lok Sabha election.
// Content auto-extracted from the designer reference into
// src/data/political-analysis.ts. Static-data-first, no API dependency.
import { PaHero, PaBody } from "@/components/pa/PaSections";
import { Footer } from "@/components/Footer";

export default function PoliticalAnalysisPage() {
  return (
    <>
      <PaHero />
      <PaBody />
      <Footer />
    </>
  );
}
