"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "motion/react";
import { hfjChapters } from "@/data/hfj-chapters";

const EraTimeline = dynamic(() => import("@/components/three/EraTimeline"), {
  ssr: false,
  loading: () => <TimelineFallback />,
});

function TimelineFallback() {
  return (
    <div className="absolute inset-0 grid place-items-center">
      <div className="flex items-center gap-2">
        {[0.35, 0.55, 0.8, 1, 0.8, 0.55, 0.35].map((s, i) => (
          <span
            key={i}
            className="rounded-sm bg-[#ff9933]/25"
            style={{ width: 14 * s, height: 44 * s }}
          />
        ))}
      </div>
    </div>
  );
}

export function EraTimelineSection() {
  const ref = useRef<HTMLElement>(null);
  const [near, setNear] = useState(false);
  const [index, setIndex] = useState(0);
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

  // Keep the marker strip in step with the corridor, so the two never disagree
  // about where the reader is.
  useEffect(() => {
    const el = strip.current?.children[index] as HTMLElement | undefined;
    el?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [index]);

  const open = (i: number) => {
    document.getElementById(hfjChapters[i].slug)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const current = hfjChapters[index];

  return (
    <section
      ref={ref}
      id="timeline"
      // .oneview, not .oneview-lg: every 3D section in the reference is full
      // height at every width. The lg-only variant is for the analytics
      // explorer alone, which pairs its canvas with a 36-row table.
      className="oneview relative overflow-hidden border-y border-[#dce4ef] bg-[#f6f9fd]"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <span className="absolute left-1/2 top-1/2 h-[80vh] w-[80vh] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,153,51,0.13),transparent_64%)] blur-2xl" />
      </div>

      <div className="ov-head relative z-10 mx-auto w-full max-w-[1440px] px-4 pt-10 text-center sm:px-6 lg:pt-[calc(var(--header-h)+18px)]">
        <motion.span
          className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#e87d12]"
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.6 }}
          transition={{ duration: 0.5 }}
        >
          The era timeline
        </motion.span>
        <motion.h2
          className="mt-2 text-[clamp(20px,2.4vw,34px)] font-extrabold tracking-tight text-[#0a1e3f]"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.6 }}
          transition={{ duration: 0.6, delay: 0.05 }}
        >
          {hfjChapters.length} chapters, eighth century to the present
        </motion.h2>
        <p className="mx-auto mt-2 max-w-[66ch] text-[clamp(12px,1vw,14px)] leading-relaxed text-[#5a7091]">
          Travel the corridor to move through the record. Each marker opens that chapter in full,
          reproduced as published.
        </p>
      </div>

      <div className="ov-stage relative z-10">
        {near ? <EraTimeline index={index} onIndexChange={setIndex} onSelect={open} /> : <TimelineFallback />}

        <div
          role="status"
          aria-live="polite"
          className="pointer-events-none absolute inset-x-0 bottom-1 flex justify-center px-4"
        >
          <span className="max-w-[70ch] rounded-full border border-[#dce4ef] bg-white/92 px-4 py-1.5 text-center text-[11px] backdrop-blur">
            <b className="font-extrabold text-[#e87d12]">{current.year}</b>
            <span className="ml-2 font-semibold text-[#0a1e3f]">{current.title}</span>
            <span className="ml-2 hidden text-[#5a7091] sm:inline">{current.era}</span>
          </span>
        </div>
      </div>

      <div className="ov-foot relative z-10 pb-6">
        <p className="mb-2.5 text-center text-[11px] text-[#5a7091]">
          Drag to travel · click a marker to open the chapter · arrow keys and Enter also work
        </p>
        {/* The strip is the accessible parallel to the corridor: every chapter is
            a real button here, whether or not WebGL ever starts. */}
        <div
          ref={strip}
          className="flex gap-2 overflow-x-auto px-4 pb-2 sm:px-6"
          role="tablist"
          aria-label="Chapters"
        >
          {hfjChapters.map((c, i) => (
            <button
              key={c.id}
              type="button"
              role="tab"
              aria-selected={index === i}
              onClick={() => (index === i ? open(i) : setIndex(i))}
              className={
                "shrink-0 rounded-lg border px-3 py-2 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e87d12] " +
                (index === i
                  ? "border-transparent bg-[#0a1e3f] text-white"
                  : "border-[#dce4ef] bg-white hover:border-[#ff9933]")
              }
            >
              <span
                className={
                  "block text-[10px] font-bold " + (index === i ? "text-[#ffc27a]" : "text-[#e87d12]")
                }
              >
                {c.year}
              </span>
              <span
                className={
                  "block max-w-[150px] truncate text-[11px] font-semibold " +
                  (index === i ? "text-white" : "text-[#0a1e3f]")
                }
              >
                {c.title}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
