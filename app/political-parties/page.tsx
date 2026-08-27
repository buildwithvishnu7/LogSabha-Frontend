"use client";

// Political Parties — every party of the 18th Lok Sabha on a 3D alliance orbit,
// over a searchable directory. Static-data-first: profiles come from
// src/data/parties.ts, seat counts are derived from src/data/lok-sabha-2024.ts
// so the two can never disagree.
import { useState } from "react";
import { motion } from "motion/react";
import { ArrowDown, Search } from "lucide-react";
import { OrbitSection } from "@/components/political-parties/OrbitSection";
import { PartyDirectory } from "@/components/political-parties/PartyDirectory";
import { SlotNumber } from "@/components/motion/SlotNumber";
import { lsAlliance } from "@/data/lok-sabha-2024";
import { parties } from "@/data/parties";
import { partySeats } from "@/components/three/PartyOrbit";
import { Footer } from "@/components/Footer";

const EASE = [0.16, 1, 0.3, 1] as const;

export default function PoliticalPartiesPage() {
  const [openKey, setOpenKey] = useState<string | null>(null);

  const seatCount = Object.keys(partySeats()).length;
  const kpis = [
    { v: String(seatCount), l: "Parties with seats" },
    { v: String(parties.length), l: "Written profiles" },
    { v: String(lsAlliance.NDA.seats), l: "NDA seats" },
    { v: String(lsAlliance.INDIA.seats), l: "INDIA Bloc seats" },
    { v: String(lsAlliance.OTH.seats), l: "Unaligned seats" },
  ];

  return (
    <>
      <section className="relative overflow-hidden bg-[#f6f9fd] pb-12 pt-[calc(var(--header-h)+40px)]">
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <span className="absolute -right-[10%] -top-[28%] h-[68vh] w-[68vh] rounded-full bg-[radial-gradient(circle,rgba(255,153,51,0.20),transparent_62%)] blur-3xl" />
          <span className="absolute -left-[12%] bottom-[-28%] h-[58vh] w-[58vh] rounded-full bg-[radial-gradient(circle,rgba(27,110,194,0.16),transparent_62%)] blur-3xl" />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-[1440px] px-4 sm:px-6">
          <motion.span
            className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#e87d12]"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Political parties
          </motion.span>

          <motion.h1
            className="mt-3 max-w-[16ch] text-[clamp(34px,6vw,76px)] font-extrabold leading-[0.98] tracking-tight text-[#0a1e3f]"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05, ease: EASE }}
          >
            Three blocs, <span className="shimmer-word">one House</span>
          </motion.h1>

          <motion.p
            className="mt-5 max-w-[64ch] text-[15px] leading-relaxed text-[#5a7091]"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            Every party that won a seat in 2024, placed on the ring of its alliance and sized by the
            seats it holds — over profiles covering formation, ideology, leadership and the
            milestones that shaped each one.
          </motion.p>

          <motion.div
            className="mt-7 flex flex-wrap items-center gap-3"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
          >
            <a
              href="#orbit"
              className="btn-breathing inline-flex items-center gap-2 rounded-full bg-[#ff9933] px-6 py-3 text-[13px] font-bold text-white transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e87d12] focus-visible:ring-offset-2"
            >
              See the orbit
              <ArrowDown className="h-4 w-4" />
            </a>
            <a
              href="#directory"
              className="inline-flex items-center gap-2 rounded-full border border-[#dce4ef] bg-white px-6 py-3 text-[13px] font-bold text-[#0a1e3f] transition-colors hover:border-[#ff9933] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e87d12]"
            >
              <Search className="h-4 w-4" />
              Browse the directory
            </a>
          </motion.div>

          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {kpis.map((k, i) => (
              <motion.div
                key={k.l}
                className="rounded-xl border border-[#dce4ef] bg-white p-4"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.3 + i * 0.07, ease: EASE }}
              >
                <div className="text-[26px] font-extrabold leading-none text-[#0a1e3f]">
                  <SlotNumber value={k.v} />
                </div>
                <div className="mt-1.5 text-[10px] font-semibold uppercase tracking-wide text-[#5a7091]">
                  {k.l}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Said up front: the profile set is smaller than the seat-winning set. */}
          <p className="mt-4 text-[12px] text-[#5a7091]">
            {seatCount} parties won seats; {parties.length} carry a written profile so far. Seat
            counts are derived from the declared result rather than stored, so they always match the
            House.
          </p>
        </div>
      </section>

      <div className="tri" />

      <OrbitSection onPickParty={setOpenKey} />
      <PartyDirectory openKey={openKey} />
      <Footer />
    </>
  );
}
