"use client";

// Services — six disciplines, built from the designer reference (Services.dc.html).
// Static-data-first: content lives in src/data/services.ts, no API dependency.
import {
  ServicesHero,
  ServicesIntro,
  ServiceBlocks,
  ServicesCta,
} from "@/components/services/ServicesSections";
import { Footer } from "@/components/Footer";

export default function ServicesPage() {
  return (
    <>
      <ServicesHero />
      <ServicesIntro />
      <ServiceBlocks />
      <ServicesCta />
      <Footer />
    </>
  );
}
