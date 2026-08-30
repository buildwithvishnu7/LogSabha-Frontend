"use client";

// Live Political Coverage — the live session on a curved broadcast wall, over a
// speech library. Static-data-first: src/data/speeches.ts carries the same five
// clips the approved home page carries, and all five files are in public/videos.
import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { ArrowDown, Search } from "lucide-react";
import { WallSection } from "@/components/live-coverage/WallSection";
import { speeches, speechesPending, speechesNote } from "@/data/speeches";
import { Footer } from "@/components/Footer";

const EASE = [0.16, 1, 0.3, 1] as const;

export default function LiveCoveragePage() {
  const [q, setQ] = useState("");
  const [house, setHouse] = useState("All");
  const [leader, setLeader] = useState("All");

  const houses = useMemo(() => ["All", ...new Set(speeches.map((s) => s.house))], []);
  const leaders = useMemo(() => ["All", ...new Set(speeches.map((s) => s.leader))], []);

  const rows = useMemo(() => {
    const n = q.trim().toLowerCase();
    return speeches
      .filter((s) => house === "All" || s.house === house)
      .filter((s) => leader === "All" || s.leader === leader)
      .filter(
        (s) =>
          !n ||
          s.title.toLowerCase().includes(n) ||
          s.leader.toLowerCase().includes(n) ||
          s.topic.toLowerCase().includes(n) ||
          s.session.toLowerCase().includes(n),
      );
  }, [q, house, leader]);

  return (
    <>
      <section className="relative overflow-hidden bg-[#f6f9fd] pb-12 pt-[calc(var(--header-h)+40px)]">
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <span className="absolute -right-[10%] -top-[28%] h-[68vh] w-[68vh] rounded-full bg-[radial-gradient(circle,rgba(27,110,194,0.20),transparent_62%)] blur-3xl" />
          <span className="absolute -left-[12%] bottom-[-28%] h-[58vh] w-[58vh] rounded-full bg-[radial-gradient(circle,rgba(255,153,51,0.18),transparent_62%)] blur-3xl" />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-[1440px] px-4 sm:px-6">
          <motion.span
            className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#e87d12]"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#e11d48] opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#e11d48]" />
            </span>
            Live political coverage
          </motion.span>

          <motion.h1
            className="mt-3 max-w-[16ch] text-[clamp(34px,6vw,76px)] font-extrabold leading-[0.98] tracking-tight text-[#0a1e3f]"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05, ease: EASE }}
          >
            The House, <span className="shimmer-word">as it speaks</span>
          </motion.h1>

          <motion.p
            className="mt-5 max-w-[62ch] text-[15px] leading-relaxed text-[#5a7091]"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            The current session on a curved broadcast wall you drag and play, over a speech library
            you can filter by leader, House and session.
          </motion.p>

          <motion.div
            className="mt-7 flex flex-wrap items-center gap-3"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
          >
            <a
              href="#wall"
              className="btn-breathing inline-flex items-center gap-2 rounded-full bg-[#ff9933] px-6 py-3 text-[13px] font-bold text-white transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e87d12] focus-visible:ring-offset-2"
            >
              Open the wall
              <ArrowDown className="h-4 w-4" />
            </a>
            <a
              href="#library"
              className="inline-flex items-center gap-2 rounded-full border border-[#dce4ef] bg-white px-6 py-3 text-[13px] font-bold text-[#0a1e3f] transition-colors hover:border-[#ff9933] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e87d12]"
            >
              <Search className="h-4 w-4" />
              Search the library
            </a>
          </motion.div>

          {/* Said in the hero: the archive is five clips, not the full record. */}
          <p className="mt-8 max-w-[70ch] rounded-xl border border-[#ffe4c4] bg-[#fff8f0] p-3.5 text-[12.5px] leading-relaxed text-[#5a7091]">
            {speechesNote}
          </p>
        </div>
      </section>

      <div className="tri" />

      <WallSection />

      <section id="library" className="bg-white py-14 sm:py-20">
        <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6">
          <div className="max-w-[70ch]">
            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#e87d12]">
              The library
            </span>
            <h2 className="mt-2 text-[clamp(22px,2.6vw,36px)] font-extrabold tracking-tight text-[#0a1e3f]">
              Every clip, by leader and House
            </h2>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <label className="min-w-[220px] flex-1">
              <span className="sr-only">Search speeches</span>
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search a speech, leader, topic or session…"
                className="w-full rounded-full border border-[#dce4ef] bg-white px-4 py-2.5 text-[13px] text-[#0a1e3f] outline-none transition-colors placeholder:text-[#94a3b8] focus:border-[#ff9933]"
              />
            </label>
            <Select label="House" value={house} onChange={setHouse} options={houses} />
            <Select label="Leader" value={leader} onChange={setLeader} options={leaders} />
          </div>

          <p className="mt-3 text-[12px] text-[#5a7091]" role="status" aria-live="polite">
            {/* "1 of 5 clip shown" — the plural has to follow the total, not the
                filtered count, or the sentence breaks whenever one row matches. */}
            Showing {rows.length} of {speeches.length} clips
          </p>

          <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {rows.map((s) => (
              <li key={s.id} className="rounded-xl border border-[#dce4ef] bg-white p-4">
                <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-wide">
                  {s.live ? (
                    <span className="text-[#e11d48]">● Live</span>
                  ) : (
                    <span className="text-[#e87d12]">{s.house}</span>
                  )}
                  <span className="text-[#94a3b8]">·</span>
                  <span className="text-[#5a7091]">{s.topic}</span>
                </div>
                <h3 className="mt-1.5 text-[13.5px] font-bold leading-snug text-[#0a1e3f]">
                  {s.title}
                </h3>
                <p className="mt-1.5 text-[11.5px] text-[#5a7091]">
                  {s.leader} · {s.role} · {s.party}
                </p>
                <p className="mt-0.5 text-[11px] text-[#94a3b8]">
                  {s.session}
                  {s.year ? ` · ${s.year}` : ""}
                </p>
                <video
                  src={s.src}
                  controls
                  preload="none"
                  playsInline
                  className="mt-3 aspect-video w-full rounded-lg bg-black"
                />
              </li>
            ))}
          </ul>

          {rows.length === 0 && (
            <p className="mt-8 text-center text-[13px] text-[#5a7091]">
              Nothing in the loaded five matches that.
            </p>
          )}

          <div className="mt-8 max-w-[74ch]">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#5a7091]">
              Not loaded here
            </h3>
            <ul className="mt-2 space-y-1">
              {speechesPending.map((p) => (
                <li
                  key={p}
                  className="border-l-2 border-[#ff9933] pl-3 text-[12.5px] leading-relaxed text-[#5a7091]"
                >
                  {p}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <label className="flex items-center gap-2">
      <span className="text-[10px] font-bold uppercase tracking-wide text-[#5a7091]">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-full border border-[#dce4ef] bg-white px-3 py-2 text-[12px] text-[#0a1e3f] outline-none transition-colors focus:border-[#ff9933]"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}
