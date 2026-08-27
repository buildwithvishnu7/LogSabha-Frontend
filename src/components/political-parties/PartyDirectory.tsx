"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { parties, type Party } from "@/data/parties";
import { lsParty } from "@/data/lok-sabha-2024";
import { partySeats } from "@/components/three/PartyOrbit";

/* The party directory.
 *
 * Seats are joined in from the election result rather than stored on the party
 * record, which is why a party can appear here with no seat count: 23 parties
 * have a written profile, 42 won seats. Both facts are shown plainly instead of
 * quietly dropping the rows that do not line up. */

const ALLIANCE_LABEL: Record<string, string> = {
  NDA: "NDA",
  INDIA: "INDIA Bloc",
  OTH: "Unaligned",
};

export function PartyDirectory({ openKey }: { openKey: string | null }) {
  const [q, setQ] = useState("");
  const [alliance, setAlliance] = useState("All");
  const [expanded, setExpanded] = useState<string | null>(null);
  const scrollTo = useRef<HTMLDivElement>(null);

  const seats = useMemo(() => partySeats(), []);

  // Profiles first, ordered by seats held; a profile with no seats still shows.
  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return parties
      .map((p) => ({
        ...p,
        seats: seats[p.k] ?? 0,
        alliance: (lsParty[p.k]?.al ?? "OTH") as string,
        colour: lsParty[p.k]?.c ?? "#8fa3bf",
      }))
      .filter((p) => alliance === "All" || p.alliance === alliance)
      .filter(
        (p) =>
          !needle ||
          p.full.toLowerCase().includes(needle) ||
          p.k.toLowerCase().includes(needle) ||
          p.lead.toLowerCase().includes(needle) ||
          p.ideology.some((i) => i.toLowerCase().includes(needle)),
      )
      .sort((a, b) => b.seats - a.seats);
  }, [q, alliance, seats]);

  /** The clicked party when it has no written profile — seats and alliance are
   *  still derivable, so there is something honest to show. */
  const unprofiled = useMemo(() => {
    if (!openKey || parties.some((p) => p.k === openKey)) return null;
    return {
      key: openKey,
      name: lsParty[openKey]?.name ?? openKey,
      colour: lsParty[openKey]?.c ?? "#8fa3bf",
      alliance: (lsParty[openKey]?.al ?? "OTH") as string,
      seats: seats[openKey] ?? 0,
    };
  }, [openKey, seats]);

  // A click in the orbit opens that party's card and brings it into view.
  useEffect(() => {
    if (!openKey) return;
    setExpanded(openKey);
    setQ("");
    setAlliance("All");
    const t = setTimeout(() => {
      // An unprofiled party has no card, so scroll to the notice instead —
      // scrolling to nothing is what made the click feel broken.
      const target =
        document.getElementById(`party-${openKey}`) ?? document.getElementById("directory");
      target?.scrollIntoView({ behavior: "smooth", block: target?.id === "directory" ? "start" : "center" });
    }, 60);
    return () => clearTimeout(t);
  }, [openKey]);

  const profiled = parties.length;
  const withSeats = Object.keys(seats).length;

  return (
    <section id="directory" className="bg-white py-14 sm:py-20" ref={scrollTo}>
      <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6">
        <div className="max-w-[70ch]">
          <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#e87d12]">
            The directory
          </span>
          <h2 className="mt-2 text-[clamp(22px,2.6vw,36px)] font-extrabold tracking-tight text-[#0a1e3f]">
            Who they are, and where they came from
          </h2>
          <p className="mt-3 text-[14px] leading-relaxed text-[#5a7091]">
            {profiled} parties carry a written profile — formation, ideology, leadership and the
            milestones that shaped them. {withSeats} parties won seats in 2024; the rest of that list
            is in the orbit above and the House itself.
          </p>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <label className="min-w-[220px] flex-1">
            <span className="sr-only">Search parties</span>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search a party, leader or ideology…"
              className="w-full rounded-full border border-[#dce4ef] bg-white px-4 py-2.5 text-[13px] text-[#0a1e3f] outline-none transition-colors placeholder:text-[#94a3b8] focus:border-[#ff9933]"
            />
          </label>
          <div className="flex flex-wrap gap-1.5">
            {["All", "NDA", "INDIA", "OTH"].map((a) => (
              <button
                key={a}
                type="button"
                onClick={() => setAlliance(a)}
                aria-pressed={alliance === a}
                className={
                  "rounded-full border px-3 py-1.5 text-[11px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e87d12] " +
                  (alliance === a
                    ? "border-transparent bg-[#0a1e3f] text-white"
                    : "border-[#dce4ef] bg-white text-[#5a7091] hover:border-[#ff9933]")
                }
              >
                {a === "All" ? "All" : ALLIANCE_LABEL[a]}
              </button>
            ))}
          </div>
        </div>

        <p className="mt-3 text-[12px] text-[#5a7091]" role="status" aria-live="polite">
          {rows.length} {rows.length === 1 ? "party" : "parties"} shown
        </p>

        {/* Clicking a party in the orbit that has no written profile used to do
            nothing at all — 19 of the 42 seat-winning parties are in that state,
            so a silent no-op was the most likely outcome of a click. Say what is
            known about it and that the profile is what is missing. */}
        {unprofiled && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 rounded-xl border border-[#ffe4c4] bg-[#fff8f0] p-4"
            role="status"
            aria-live="polite"
          >
            <span className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full" style={{ background: unprofiled.colour }} />
              <b className="text-[13px] font-extrabold text-[#0a1e3f]">{unprofiled.key}</b>
              <span className="text-[13px] text-[#22406e]">{unprofiled.name}</span>
            </span>
            <span className="text-[12px] text-[#5a7091]">
              {unprofiled.seats} {unprofiled.seats === 1 ? "seat" : "seats"} ·{" "}
              {ALLIANCE_LABEL[unprofiled.alliance] ?? unprofiled.alliance}
            </span>
            <span className="text-[12px] text-[#c96608]">
              No written profile yet — its seat count is live, its history is not loaded.
            </span>
          </motion.div>
        )}

        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map((p) => (
            <PartyCard
              key={p.k}
              p={p}
              open={expanded === p.k}
              onToggle={() => setExpanded((c) => (c === p.k ? null : p.k))}
            />
          ))}
        </div>

        {rows.length === 0 && (
          <p className="mt-8 text-center text-[13px] text-[#5a7091]">
            No profiled party matches that. It may still hold seats — the orbit above carries all{" "}
            {withSeats}.
          </p>
        )}
      </div>
    </section>
  );
}

function PartyCard({
  p,
  open,
  onToggle,
}: {
  p: Party & { seats: number; alliance: string; colour: string };
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <motion.div
      id={`party-${p.k}`}
      layout
      className={
        "overflow-hidden rounded-xl border bg-white transition-colors " +
        (open ? "border-[#ff9933]" : "border-[#dce4ef]")
      }
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="w-full p-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e87d12]"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: p.colour }} />
              <span className="text-[13px] font-extrabold text-[#0a1e3f]">{p.k}</span>
              <span className="rounded-full bg-[#f6f9fd] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-[#5a7091]">
                {p.type === "n" ? "National" : "State"}
              </span>
            </div>
            <p className="mt-1 truncate text-[12px] text-[#22406e]">{p.full}</p>
          </div>
          <div className="shrink-0 text-right">
            <div className="text-lg font-extrabold leading-none text-[#0a1e3f]">{p.seats}</div>
            <div className="mt-0.5 text-[9px] font-semibold uppercase tracking-wide text-[#5a7091]">
              {p.seats === 1 ? "seat" : "seats"}
            </div>
          </div>
        </div>

        <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-[#5a7091]">
          <span>Founded {p.founded}</span>
          <span>·</span>
          <span>{ALLIANCE_LABEL[p.alliance] ?? p.alliance}</span>
          <span>·</span>
          <span>Symbol: {p.symbol}</span>
        </div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="border-t border-[#f1f5f9] p-4 pt-3">
              <p className="text-[12.5px] leading-relaxed text-[#22406e]">{p.desc}</p>

              <dl className="mt-3 space-y-1.5 text-[11.5px]">
                <div className="flex gap-2">
                  <dt className="w-20 shrink-0 text-[#5a7091]">Leader</dt>
                  <dd className="font-semibold text-[#0a1e3f]">{p.lead}</dd>
                </div>
                <div className="flex gap-2">
                  <dt className="w-20 shrink-0 text-[#5a7091]">Base</dt>
                  <dd className="text-[#22406e]">{p.base}</dd>
                </div>
              </dl>

              <div className="mt-3 flex flex-wrap gap-1.5">
                {p.ideology.map((i) => (
                  <span
                    key={i}
                    className="rounded-full bg-[#fff4e6] px-2.5 py-1 text-[10px] font-semibold text-[#c96608]"
                  >
                    {i}
                  </span>
                ))}
              </div>

              {p.hist?.length > 0 && (
                <>
                  <h4 className="mt-4 text-[9px] font-bold uppercase tracking-[0.16em] text-[#5a7091]">
                    Milestones
                  </h4>
                  <ol className="mt-2 space-y-2">
                    {p.hist.map(([year, what]) => (
                      <li key={`${year}-${what}`} className="flex gap-3">
                        <span className="w-10 shrink-0 text-[11px] font-bold tabular-nums text-[#e87d12]">
                          {year}
                        </span>
                        <span className="border-l border-[#e6eaf2] pl-3 text-[11.5px] leading-relaxed text-[#22406e]">
                          {what}
                        </span>
                      </li>
                    ))}
                  </ol>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
