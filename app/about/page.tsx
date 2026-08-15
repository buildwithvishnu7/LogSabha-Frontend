"use client";

// About Us — rebuilt from the designer reference (About Us.dc.html).
// Content auto-extracted into src/data/about-page.ts as an ordered node flow:
// six intro sections, then the year-by-year election archive (2027 → 2014).
import { AboutPage } from "@/components/about/AboutPage";
import { Footer } from "@/components/Footer";

export default function About() {
  return (
    <>
      <AboutPage />
      <Footer />
    </>
  );
}
