"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "motion/react";
import { spiralYears } from "@/components/three/CenturySpiral";
import { rssEras } from "@/data/rss-timeline";

const CenturySpiral = dynamic(() => import("@/components/three/CenturySpiral"), {
  ssr: false,
  loading: () => <SpiralFallback />,
});

function SpiralFallback() {
  return (
    <div className="absolute inset-0 grid place-items-center">
      <div className="flex flex-col items-center gap-1.5">
        {[0.5, 0.72, 0.9, 1, 0.9, 0.72, 0.5].map((s, i) => (
          <span
            key={i}
            className="h-2 rounded-sm bg-[#ff9933]/25"
            style={{ width: 90 * s }}
          />
        ))}
      </div>
    </div>
  );
}

export function SpiralSection({ onPickYear }: { onPickYear: (year: number) => void }) {
  const ref = useRef<HTMLElement>(null);
  const [near, setNear] = useState(false);
  const [index, setIndex] = useState(spiralYears.length - 1); // start at 2025
  const strip = useRef<HTMLDivElement>(null);

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

  const current = spiralYears[index];

  // The era strip follows the spiral, so the two never disagree about where the
  // reader is in the century.
  const eraOf = (y: number) => rssEras.findIndex((e) => y <= e.start && y >= e.end);
  const activeEra = eraOf(current.year);

  useEffect(() => {
    const el = strip.current?.children[activeEra] as HTMLElement | undefined;
    el?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [activeEra]);

  return (
    <section
      ref={ref}
      id="spiral"
      // .oneview, not .oneview-lg: every 3D section in the reference is full
      // height at every width. The lg-only variant is for the analytics
      // explorer alone, which pairs its canvas with a 36-row table.
      className="oneview relative overflow-hidden border-y border-[#F0E2CC]"
      style={{ backgroundImage: "linear-gradient(#FDF8F0, #F7EEDF)" }}
    >
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <span className="absolute left-1/2 top-1/2 h-[80vh] w-[80vh] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,153,51,0.16),transparent_64%)] blur-2xl" />
      </div>

      <div className="ov-head relative z-10 mx-auto w-full max-w-[1440px] px-4 pt-10 text-center sm:px-6 lg:pt-[calc(var(--header-h)+18px)]">
        <motion.span
          className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#C2410C]"
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.6 }}
          transition={{ duration: 0.5 }}
        >
          The century spiral
        </motion.span>
        <motion.h2
          className="mt-2 text-[clamp(20px,2.4vw,34px)] font-extrabold tracking-tight text-[#1A1206]"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.6 }}
          transition={{ duration: 0.6, delay: 0.05 }}
        >
          A hundred years, climbing
        </motion.h2>
        <p className="mx-auto mt-2 max-w-[64ch] text-[clamp(12px,1vw,14px)] leading-relaxed text-[#6B5B47]">
          1925 at the foot, 2025 at the top. Drag up and down to travel the decades, sideways to walk
          around the column.
        </p>
      </div>

      <div className="ov-stage relative z-10">
        {near ? (
          <CenturySpiral index={index} onIndexChange={setIndex} onSelect={onPickYear} />
        ) : (
          <SpiralFallback />
        )}

        <div
          role="status"
          aria-live="polite"
          className="pointer-events-none absolute inset-x-0 bottom-1 flex justify-center px-4"
        >
          <span className="max-w-[72ch] rounded-full border border-[#F0E2CC] bg-white/92 px-4 py-1.5 text-center text-[11px] backdrop-blur">
            <b className="font-extrabold text-[#C2410C]">{current.year}</b>
            <span className="ml-2 truncate font-semibold text-[#1A1206]">{current.title}</span>
          </span>
        </div>
      </div>

      <div className="ov-foot relative z-10 pb-6">
        <p className="mb-2.5 text-center text-[11px] text-[#6B5B47]">
          Drag to travel · click a year to open it · arrow keys and Enter also work
        </p>
        {/* Twenty-one era buttons rather than a hundred year buttons: the strip
            is the accessible route through the century without becoming a wall
            of numbers. */}
        <div
          ref={strip}
          className="flex gap-2 overflow-x-auto px-4 pb-2 sm:px-6"
          role="tablist"
          aria-label="Eras"
        >
          {rssEras.map((e, i) => (
            <button
              key={e.label}
              type="button"
              role="tab"
              aria-selected={activeEra === i}
              onClick={() => onPickYear(e.start)}
              className={
                "shrink-0 rounded-full border px-3.5 py-1.5 text-[11px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C2410C] " +
                (activeEra === i
                  ? "border-transparent bg-[#1A1206] text-white"
                  : "border-[#E8D8BE] bg-white/70 text-[#6B5B47] hover:border-[#ff9933]")
              }
            >
              {e.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
