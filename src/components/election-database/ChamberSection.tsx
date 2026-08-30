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
      // Warm cream, not the cool panel grey the rest of the page uses: the
      // chamber is lit like a hall, and a blue-grey ground fought the saffron.
      // .oneview, not .oneview-lg — like the helix, this section is a canvas and a
      // strip of chips, so it fits a phone. The lg-only variant is for sections
      // that carry a long table beside the canvas.
      className="oneview relative overflow-hidden border-y border-[#f0e2cd] bg-[linear-gradient(180deg,#ffffff_0%,#fff8ef_46%,#ffeeda_100%)]"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <span className="absolute inset-0 bg-[radial-gradient(52%_58%_at_50%_44%,rgba(255,153,51,0.22),transparent_72%)]" />

        {/* Slow radial rays, masked to a ring so the centre stays clear for the
            benches. */}
        <span
          className="ed-rays absolute -inset-[26%] opacity-50"
          style={{
            background:
              "repeating-conic-gradient(from 0deg, rgba(255,153,51,.10) 0deg 7deg, transparent 7deg 30deg)",
            maskImage: "radial-gradient(circle,transparent 0 22%,#000 46%,transparent 78%)",
            WebkitMaskImage: "radial-gradient(circle,transparent 0 22%,#000 46%,transparent 78%)",
          }}
        />

        {/* The Ashoka Chakra — 24 spokes at 15°, ring and hub. The chamber is
            the House; the emblem behind it is the point. */}
        <span className="ed-chakra absolute left-1/2 top-[46%] h-[min(60vw,660px)] w-[min(60vw,660px)] -translate-x-1/2 -translate-y-1/2 opacity-[0.17]">
          <i className="absolute inset-0 rounded-full border-[5px] border-[#e87d12]" />
          <i className="absolute inset-[7%] rounded-full border-2 border-[#ff9933]" />
          <i
            className="absolute inset-[8%] rounded-full"
            style={{
              background:
                "repeating-conic-gradient(from 0deg, #e87d12 0deg 1.1deg, transparent 1.1deg 15deg)",
              maskImage: "radial-gradient(circle,transparent 0 8%,#000 9%)",
              WebkitMaskImage: "radial-gradient(circle,transparent 0 8%,#000 9%)",
            }}
          />
          <i className="absolute left-1/2 top-1/2 h-[11%] w-[11%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#e87d12]" />
        </span>
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
          Each block is one seat, coloured by the party holding it. Pick a party below to isolate
          its benches.
        </p>
      </div>

      <div className="ov-stage relative z-10">
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
        <ul className="flex items-center gap-1.5 overflow-x-auto pb-1">
          <li className="shrink-0">
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
            <li key={p.key} className="shrink-0">
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
            <li className="shrink-0 rounded-full border border-dashed border-[#dce4ef] px-3 py-1.5 text-[11px] font-semibold text-[#5a7091]">
              + {tail} more parties, {tailSeats} seats
            </li>
          )}
        </ul>
      </div>
    </section>
  );
}
