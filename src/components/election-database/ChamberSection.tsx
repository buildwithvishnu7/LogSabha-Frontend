"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "motion/react";
import { lsAlliance, lsNational } from "@/data/lok-sabha-2024";
import { partyOrder, type PartyEntry } from "@/components/three/LokSabhaChamber";

const LokSabhaChamber = dynamic(() => import("@/components/three/LokSabhaChamber"), {
  ssr: false,
  loading: () => <ChamberFallback />,
});

function ChamberFallback() {
  return (
    <div className="absolute inset-0 grid place-items-center">
      <div className="flex items-end gap-1.5">
        {[10, 18, 26, 32, 26, 18, 10].map((h, i) => (
          <span key={i} className="w-2 rounded-t bg-[#ff9933]/30" style={{ height: h }} />
        ))}
      </div>
    </div>
  );
}

export function ChamberSection() {
  const ref = useRef<HTMLElement>(null);
  const [near, setNear] = useState(false);
  const [highlight, setHighlight] = useState<string | null>(null);
  const [hovered, setHovered] = useState<PartyEntry | null>(null);

  const order = useMemo(() => partyOrder(), []);
  // The strip lists the biggest parties by seats; the long tail of one- and
  // two-seat parties would otherwise take three rows on its own.
  const strip = useMemo(() => [...order].sort((a, b) => b.seats - a.seats).slice(0, 14), [order]);
  const tail = order.length - strip.length;
  const tailSeats = useMemo(
    () => order.reduce((a, p) => a + p.seats, 0) - strip.reduce((a, p) => a + p.seats, 0),
    [order, strip],
  );

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) return setNear(true);
    const io = new IntersectionObserver(
      (e) => e[0].isIntersecting && (setNear(true), io.disconnect()),
      { rootMargin: "700px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const shown = hovered ?? order.find((p) => p.key === highlight) ?? null;

  return (
    <section
      ref={ref}
      id="chamber"
      className="oneview-lg relative overflow-hidden border-y border-[#dce4ef] bg-[#f6f9fd]"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <span className="absolute left-1/2 top-[46%] h-[70vh] w-[70vh] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,153,51,0.13),transparent_64%)] blur-2xl" />
      </div>

      <div className="ov-head relative z-10 mx-auto w-full max-w-[1440px] px-4 pt-10 text-center sm:px-6 lg:pt-[calc(var(--header-h)+18px)]">
        <motion.span
          className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#e87d12]"
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.6 }}
          transition={{ duration: 0.5 }}
        >
          The House
        </motion.span>
        <motion.h2
          className="mt-2 text-[clamp(20px,2.4vw,34px)] font-extrabold tracking-tight text-[#0a1e3f]"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.6 }}
          transition={{ duration: 0.6, delay: 0.05 }}
        >
          All {lsNational.seats} seats, one bench at a time
        </motion.h2>
        <p className="mx-auto mt-2 max-w-[64ch] text-[clamp(12px,1vw,14px)] leading-relaxed text-[#5a7091]">
          Every member of the {lsNational.house} is a seat in this chamber, coloured by the party
          holding it. The arrangement is generated from the declared result, so the count on screen
          is the count in the House.
        </p>
      </div>

      <div className="ov-stage relative z-10 min-h-[46vh] lg:min-h-0">
        {near ? (
          <LokSabhaChamber
            highlight={highlight}
            onHoverParty={setHovered}
            onSelectParty={(p) => setHighlight((cur) => (cur === p.key ? null : p.key))}
          />
        ) : (
          <ChamberFallback />
        )}

        <div
          role="status"
          aria-live="polite"
          className="pointer-events-none absolute inset-x-0 bottom-1 flex justify-center px-4"
        >
          {shown && (
            <span className="rounded-full border border-[#dce4ef] bg-white/92 px-4 py-1.5 text-xs font-semibold shadow-sm backdrop-blur">
              <span className="mr-2 inline-block h-2 w-2 rounded-full align-middle" style={{ background: shown.colour }} />
              <span className="text-[#0a1e3f]">{shown.name}</span>
              <span className="ml-2 text-[#5a7091]">
                {shown.seats} {shown.seats === 1 ? "seat" : "seats"} · {shown.alliance}
              </span>
            </span>
          )}
        </div>
      </div>

      <div className="ov-foot relative z-10 mx-auto w-full max-w-[1440px] px-4 pb-6 sm:px-6">
        <p className="mb-2.5 text-center text-[11px] text-[#5a7091]">
          Hover a seat · click to isolate that party · drag to swing the chamber · arrow keys also work
        </p>
        <ul className="flex flex-wrap items-center justify-center gap-1.5">
          <li>
            <button
              type="button"
              onClick={() => setHighlight(null)}
              aria-pressed={highlight === null}
              className={
                "rounded-full border px-3 py-1.5 text-[11px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e87d12] " +
                (highlight === null
                  ? "border-transparent bg-[#0a1e3f] text-white"
                  : "border-[#dce4ef] bg-white text-[#5a7091] hover:border-[#ff9933]")
              }
            >
              All parties {lsNational.seats}
            </button>
          </li>
          {strip.map((p) => (
            <li key={p.key}>
              <button
                type="button"
                onClick={() => setHighlight((cur) => (cur === p.key ? null : p.key))}
                onMouseEnter={() => setHovered(p)}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => setHovered(p)}
                onBlur={() => setHovered(null)}
                aria-pressed={highlight === p.key}
                title={`${p.name} · ${p.alliance}`}
                className={
                  "flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-[11px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e87d12] " +
                  (highlight === p.key
                    ? "border-transparent bg-[#0a1e3f] text-white"
                    : "border-[#dce4ef] bg-white text-[#22406e] hover:border-[#ff9933]")
                }
              >
                <span className="h-2 w-2 rounded-full" style={{ background: p.colour }} />
                {p.key} <span className="tabular-nums">{p.seats}</span>
              </button>
            </li>
          ))}
          {tail > 0 && (
            <li className="rounded-full border border-dashed border-[#dce4ef] px-3 py-1.5 text-[11px] font-semibold text-[#5a7091]">
              + {tail} more parties, {tailSeats} seats
            </li>
          )}
        </ul>

        {/* The alliance arithmetic, always on screen — it is the one figure the
            seating diagram cannot state on its own. */}
        <div className="mx-auto mt-3 flex max-w-lg overflow-hidden rounded-full">
          {(["NDA", "INDIA", "OTH"] as const).map((k) => (
            <span
              key={k}
              className="flex h-5 items-center justify-center text-[9px] font-bold text-white"
              style={{ background: lsAlliance[k].c, width: `${(lsAlliance[k].seats / 543) * 100}%` }}
              title={`${lsAlliance[k].name} — ${lsAlliance[k].seats}`}
            >
              {lsAlliance[k].seats}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
