"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "motion/react";
import { helixNodes, type HelixNode } from "@/components/three/MandateHelix";
import { milestones, milestoneYears, campaignSource } from "@/data/campaigns";

const MandateHelix = dynamic(() => import("@/components/three/MandateHelix"), {
  ssr: false,
  loading: () => <HelixFallback />,
});

function HelixFallback() {
  return (
    <div className="absolute inset-0 grid place-items-center">
      <div className="flex flex-col-reverse items-center gap-2">
        {[1, 2, 3, 4, 3, 2, 1].map((n, i) => (
          <span key={i} className="flex gap-1.5">
            {Array.from({ length: n }, (_, k) => (
              <span key={k} className="h-2 w-2 rounded-full bg-[#ff9933]/30" />
            ))}
          </span>
        ))}
      </div>
    </div>
  );
}

export function HelixSection() {
  const ref = useRef<HTMLElement>(null);
  const [near, setNear] = useState(false);
  const [hovered, setHovered] = useState<HelixNode | null>(null);
  const [picked, setPicked] = useState<HelixNode | null>(null);

  const nodes = useMemo(() => helixNodes(), []);
  const perYear = useMemo(() => {
    const m: Record<number, number> = {};
    milestones.forEach((c) => (m[c.y] = (m[c.y] ?? 0) + 1));
    return m;
  }, []);

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

  const shown = hovered ?? picked;
  const busiest = milestoneYears.reduce((a, y) => (perYear[y] > perYear[a] ? y : a), milestoneYears[0]);

  return (
    <section
      ref={ref}
      id="helix"
      // .oneview, not .oneview-lg: the lg-only variant exists for sections that pair
      // a canvas with a long table (the analytics explorer), which cannot honestly
      // fit a phone. This one is a canvas and a row of year chips — it fits, and
      // capping it at lg was costing the helix a third of its height.
      className="oneview relative overflow-hidden bg-[#061428] text-white"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <span className="absolute left-1/2 top-1/2 h-[85vh] w-[85vh] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,153,51,0.15),transparent_62%)] blur-2xl" />
        <span className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_50%,transparent_45%,rgba(6,20,40,0.85)_100%)]" />
      </div>

      <div className="ov-head relative z-10 mx-auto w-full max-w-[1440px] px-4 pt-10 text-center sm:px-6 lg:pt-[calc(var(--header-h)+18px)]">
        <motion.span
          className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#ffc27a]"
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.6 }}
          transition={{ duration: 0.5 }}
        >
          The mandate helix
        </motion.span>
        <motion.h2
          className="mt-2 text-[clamp(20px,2.4vw,34px)] font-extrabold tracking-tight"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.6 }}
          transition={{ duration: 0.6, delay: 0.05 }}
        >
          {milestones.length} campaigns, {milestoneYears.length} years, one climb
        </motion.h2>
        {/* One line, not three. The "time does not orbit, so this is a spiral"
            reasoning belongs where the reference kept it — in the code comment
            on MandateHelix — not on the page. It explains a design decision to a
            reader who did not ask, and it cost the stage two lines of height. */}
        <p className="mx-auto mt-2 max-w-[68ch] text-[clamp(12px,1vw,14px)] leading-relaxed text-white/65">
          Each disc is a campaign and each ring a year, so a busy year reads as a thick band —{" "}
          {busiest} carries {perYear[busiest]}.
        </p>
      </div>

      <div className="ov-stage relative z-10">
        {near ? (
          <MandateHelix
            highlight={shown?.i ?? null}
            onHoverNode={setHovered}
            onSelectNode={(n) => setPicked((cur) => (cur?.i === n.i ? null : n))}
          />
        ) : (
          <HelixFallback />
        )}

        <div
          role="status"
          aria-live="polite"
          className="pointer-events-none absolute inset-x-0 bottom-1 flex justify-center px-4"
        >
          {shown && (
            <span className="max-w-[74ch] rounded-full border border-white/15 bg-[#061428]/88 px-4 py-1.5 text-center text-[11px] backdrop-blur">
              <b className="font-extrabold text-[#ff9933]">{shown.y}</b>
              <span className="ml-2 font-semibold text-white">{shown.state}</span>
              <span className="ml-2 hidden text-white/60 sm:inline">{shown.text.slice(0, 72)}</span>
            </span>
          )}
        </div>
      </div>

      <div className="ov-foot relative z-10 pb-6">
        <p className="mb-2.5 text-center text-[11px] text-white/45">
          Drag sideways to turn · drag up and down to travel the years · arrow keys also work
        </p>
        {/* A single compact row, not a wall of per-campaign buttons. The reference
            keeps this foot to one line because the accessible parallel is the
            page's own record, which follows immediately below — repeating every
            campaign here only stole 130px from the helix. */}
        <div className="flex justify-center gap-1.5 overflow-x-auto px-4 pb-1 sm:px-6" role="list">
          {milestoneYears
            .slice()
            .reverse()
            .map((y) => {
              const first = nodes.find((n) => n.y === y);
              return (
                <button
                  key={y}
                  type="button"
                  role="listitem"
                  onMouseEnter={() => first && setHovered(first)}
                  onMouseLeave={() => setHovered(null)}
                  onFocus={() => first && setHovered(first)}
                  onBlur={() => setHovered(null)}
                  onClick={() => first && setPicked((cur) => (cur?.y === y ? null : first))}
                  className={
                    "shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-semibold tabular-nums transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff9933] " +
                    (shown?.y === y
                      ? "border-transparent bg-[#ff9933] text-white"
                      : "border-white/12 text-white/60 hover:border-white/35 hover:text-white")
                  }
                >
                  {y}
                  <span className="ml-1.5 text-[9px] opacity-60">{perYear[y]}</span>
                </button>
              );
            })}
        </div>
        <p className="mt-2 px-4 text-center text-[10.5px] text-white/35 sm:px-6">
          The same record is written out below, year by year. · Source: {campaignSource}
        </p>
      </div>
    </section>
  );
}
