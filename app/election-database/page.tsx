"use client";

// Election Database — the 18th Lok Sabha rendered seat by seat, over a
// searchable constituency record. Static-data-first: everything comes from
// src/data/lok-sabha-2024.ts and src/data/constituencies.ts, no API dependency.
import { motion } from "motion/react";
import { ArrowDown, Search } from "lucide-react";
import { ChamberSection } from "@/components/election-database/ChamberSection";
import { ConstituencyTable } from "@/components/election-database/ConstituencyTable";
import { SlotNumber } from "@/components/motion/SlotNumber";
import { lsNational, lsAlliance } from "@/data/lok-sabha-2024";
import { constituencyCoverage } from "@/data/constituencies";
import { Footer } from "@/components/Footer";

const EASE = [0.16, 1, 0.3, 1] as const;

const KPIS = [
  { v: String(lsNational.seats), l: "Seats in the House" },
  { v: String(lsNational.majority), l: "Majority mark" },
  { v: `${lsNational.turnout}%`, l: "Voter turnout" },
  { v: String(lsNational.phases), l: "Polling phases" },
  { v: String(lsNational.womenMPs), l: "Women MPs elected" },
];

export default function ElectionDatabasePage() {
  return (
    <>
      <section className="relative overflow-hidden bg-[#f6f9fd] pb-12 pt-[calc(var(--header-h)+40px)]">
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <span className="absolute -right-[10%] -top-[30%] h-[70vh] w-[70vh] rounded-full bg-[radial-gradient(circle,rgba(255,153,51,0.20),transparent_62%)] blur-3xl" />
          <span className="absolute -left-[12%] bottom-[-30%] h-[60vh] w-[60vh] rounded-full bg-[radial-gradient(circle,rgba(27,110,194,0.16),transparent_62%)] blur-3xl" />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-[1440px] px-4 sm:px-6">
          <motion.span
            className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#e87d12]"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Election database
          </motion.span>

          <motion.h1
            className="mt-3 max-w-[18ch] text-[clamp(34px,6vw,76px)] font-extrabold leading-[0.98] tracking-tight text-[#0a1e3f]"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05, ease: EASE }}
          >
            The House, <span className="shimmer-word">seat by seat</span>
          </motion.h1>

          <motion.p
            className="mt-5 max-w-[62ch] text-[15px] leading-relaxed text-[#5a7091]"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            All {lsNational.seats} members of the {lsNational.house}, rendered one bench at a time and
            coloured by the party holding them — over a constituency record you can search by seat,
            member, state or party.
          </motion.p>

          <motion.div
            className="mt-7 flex flex-wrap items-center gap-3"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
          >
            <a
              href="#chamber"
              className="btn-breathing inline-flex items-center gap-2 rounded-full bg-[#ff9933] px-6 py-3 text-[13px] font-bold text-white transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e87d12] focus-visible:ring-offset-2"
            >
              See the chamber
              <ArrowDown className="h-4 w-4" />
            </a>
            <a
              href="#database"
              className="inline-flex items-center gap-2 rounded-full border border-[#dce4ef] bg-white px-6 py-3 text-[13px] font-bold text-[#0a1e3f] transition-colors hover:border-[#ff9933] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e87d12]"
            >
              <Search className="h-4 w-4" />
              Search the record
            </a>
          </motion.div>

          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {KPIS.map((k, i) => (
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

          {/* Said in the hero, not only beside the table — a reader who never
              scrolls that far still learns the record is partial. */}
          <p className="mt-4 text-[12px] text-[#5a7091]">
            Alliance split: {lsAlliance.NDA.seats} NDA · {lsAlliance.INDIA.seats} INDIA ·{" "}
            {lsAlliance.OTH.seats} others. The constituency record below covers{" "}
            {constituencyCoverage.loaded} of {constituencyCoverage.houseSize} seats so far.
          </p>
        </div>
      </section>

      <div className="tri" />

      <ChamberSection />
      <ConstituencyTable />
      <Footer />
    </>
  );
}
