"use client";

// Contact — hero + enquiry form, built from the designer reference
// (Contact Us.dc.html). Static-data-first; the form validates and confirms
// client-side until the enquiry endpoint exists.
import { ContactHero, ContactEnquiry } from "@/components/contact/ContactSections";
import { Footer } from "@/components/Footer";

export default function ContactPage() {
  return (
    <>
      <ContactHero />
      <ContactEnquiry />
      <Footer />
    </>
  );
}
