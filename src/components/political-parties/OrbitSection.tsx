"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { motion, useReducedMotion } from "motion/react";
import { orbitNodes, RINGS, type Alliance, type OrbitNode } from "@/components/three/PartyOrbit";

const PartyOrbit = dynamic(() => import("@/components/three/PartyOrbit"), {
  ssr: false,
  loading: () => <OrbitFallback />,
});

function OrbitFallback() {
  return (
    <div className="absolute inset-0 grid place-items-center">
      <div className="relative h-44 w-44">
        {[44, 68, 88].map((r, i) => (
          <span
            key={r}
            className="absolute rounded-full border"
            style={{
              inset: `${(88 - r) / 2}%`,
              borderColor: [RINGS.NDA.colour, RINGS.INDIA.colour, RINGS.OTH.colour][i],
              opacity: 0.28,
            }}
          />
        ))}
        <span className="absolute inset-[44%] rounded-full bg-[#ff9933]/60" />
      </div>
    </div>
  );
}

export function OrbitSection({
  onPickParty,
}: {
  onPickParty: (key: string) => void;
}) {
  const ref = useRef<HTMLElement>(null);
  const [near, setNear] = useState(false);
  const [hovered, setHovered] = useState<OrbitNode | null>(null);
  const [highlight, setHighlight] = useState<string | null>(null);
  const reduced = useReducedMotion() ?? false;

  const nodes = useMemo(() => orbitNodes(), []);
  const totals = useMemo(() => {
    const t: Record<Alliance, { parties: number; seats: number }> = {
      NDA: { parties: 0, seats: 0 },
      INDIA: { parties: 0, seats: 0 },
      OTH: { parties: 0, seats: 0 },
    };
    nodes.forEach((n) => {
      t[n.alliance].parties += 1;
      t[n.alliance].seats += n.seats;
    });
    return t;
  }, [nodes]);

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

  const shown = hovered ?? nodes.find((n) => n.key === highlight) ?? null;

  return (
    <section
      ref={ref}
      id="orbit"
      // .oneview, not .oneview-lg: every 3D section in the reference is full
      // height at every width. The lg-only variant is for the analytics
      // explorer alone, which pairs its canvas with a 36-row table.
      className="oneview relative overflow-hidden border-y border-[#dce4ef] bg-[#f6f9fd]"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <span className="absolute left-1/2 top-1/2 h-[80vh] w-[80vh] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,153,51,0.14),transparent_62%)] blur-2xl" />
      </div>

      <div className="ov-head relative z-10 mx-auto w-full max-w-[1440px] px-4 pt-10 text-center sm:px-6 lg:pt-[calc(var(--header-h)+18px)]">
        <motion.span
          className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#e87d12]"
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.6 }}
          transition={{ duration: 0.5 }}
        >
          The alliance orbit
        </motion.span>
        <motion.h2
          className="mt-2 text-[clamp(20px,2.4vw,34px)] font-extrabold tracking-tight text-[#0a1e3f]"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.6 }}
          transition={{ duration: 0.6, delay: 0.05 }}
        >
          {nodes.length} parties, three rings
        </motion.h2>
        <p className="mx-auto mt-2 max-w-[66ch] text-[clamp(12px,1vw,14px)] leading-relaxed text-[#5a7091]">
          Every party that won a seat sits on the ring of its alliance, and each sphere is sized by
          the seats it holds. Seat counts are derived from the declared result, so the picture cannot
          drift out of step with the House.
        </p>
      </div>

      <div className="ov-stage relative z-10">
        {near ? (
          <PartyOrbit
            highlight={highlight}
            onHoverParty={setHovered}
            onSelectParty={(n) => {
              setHighlight((cur) => (cur === n.key ? null : n.key));
              onPickParty(n.key);
            }}
            reducedMotion={reduced}
          />
        ) : (
          <OrbitFallback />
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
                {shown.seats} {shown.seats === 1 ? "seat" : "seats"} · {RINGS[shown.alliance].label}
              </span>
            </span>
          )}
        </div>
      </div>

      <div className="ov-foot relative z-10 mx-auto w-full max-w-[1440px] px-4 pb-6 sm:px-6">
        <p className="mb-2.5 text-center text-[11px] text-[#5a7091]">
          Drag to turn · click a party to open it below · arrow keys also work
        </p>
        <ul className="flex flex-wrap items-center justify-center gap-2">
          {(Object.keys(RINGS) as Alliance[]).map((a) => (
            <li
              key={a}
              className="flex items-center gap-2 rounded-full border border-[#dce4ef] bg-white px-3.5 py-2 text-[11px]"
            >
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: RINGS[a].colour }} />
              <span className="font-semibold text-[#0a1e3f]">{RINGS[a].label}</span>
              <span className="text-[#5a7091]">
                <b className="font-bold text-[#0a1e3f]">{totals[a].parties}</b> parties ·{" "}
                <b className="font-bold text-[#0a1e3f]">{totals[a].seats}</b> seats
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
