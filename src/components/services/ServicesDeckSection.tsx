"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { motion, useReducedMotion } from "motion/react";
import { SERVICE_NODES } from "@/components/three/ServiceDeck";

/* The command deck section — head, 3D stage, legend, in one screen.
 *
 * three.js is a large payload, so the scene is both code-split AND deferred:
 * the chunk is only requested once the section is near the viewport. A visitor
 * who never scrolls this far never downloads it. Until then the stage shows a
 * flat fallback, which is also what a device without WebGL keeps. */

const ServiceDeck = dynamic(() => import("@/components/three/ServiceDeck"), {
  ssr: false,
  loading: () => <StageFallback />,
});

function StageFallback() {
  return (
    <div className="absolute inset-0 grid place-items-center">
      <div className="relative h-40 w-40">
        <span className="absolute inset-0 rounded-full border border-[#ff9933]/30" />
        <span className="absolute inset-6 rounded-full border border-[#ff9933]/20" />
        <span className="absolute inset-[42%] rounded-full bg-[#ff9933]/70" />
      </div>
    </div>
  );
}

export function ServicesDeckSection() {
  const ref = useRef<HTMLElement>(null);
  const [near, setNear] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const reduced = useReducedMotion() ?? false;

  // rootMargin so the chunk starts downloading a screen early and the scene is
  // already up by the time the section is actually looked at.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      setNear(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: "600px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const jumpTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
  };

  const active = SERVICE_NODES.find((n) => n.id === hovered) ?? null;

  return (
    <section ref={ref} id="deck" className="oneview relative bg-[#061428] text-white">
      {/* layered ground — a flat navy panel behind a canvas reads as a hole */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <span className="absolute left-1/2 top-1/2 h-[85vh] w-[85vh] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,153,51,0.16),transparent_62%)] blur-2xl" />
        <span
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              "linear-gradient(to right,rgba(255,255,255,0.05) 1px,transparent 1px),linear-gradient(to bottom,rgba(255,255,255,0.05) 1px,transparent 1px)",
            backgroundSize: "58px 58px",
            maskImage: "radial-gradient(120% 90% at 50% 45%,#000 20%,transparent 72%)",
            WebkitMaskImage: "radial-gradient(120% 90% at 50% 45%,#000 20%,transparent 72%)",
          }}
        />
        <span className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_50%,transparent_45%,rgba(6,20,40,0.85)_100%)]" />
      </div>

      {/* Top padding tracks the fixed header's real height rather than a fixed
          96px, which left the eyebrow tucked underneath it at lg (header 112px).
          scroll-margin-top covers anchor jumps; this covers ordinary scrolling,
          where the section can come to rest with its top at the viewport top. */}
      <div className="ov-head relative z-10 mx-auto w-full max-w-[1440px] px-4 pb-3 pt-[calc(var(--header-h)+20px)] text-center sm:px-6">
        <motion.span
          className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#ffc27a]"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.6 }}
          transition={{ duration: 0.5 }}
        >
          The command deck
        </motion.span>
        <motion.h2
          className="mt-3 text-[clamp(21px,2.5vw,36px)] font-extrabold tracking-tight"
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.6 }}
          transition={{ duration: 0.6, delay: 0.05 }}
        >
          Six units, one campaign
        </motion.h2>
        <motion.p
          className="mx-auto mt-3 max-w-[62ch] text-[clamp(12.5px,1.05vw,15px)] leading-relaxed text-white/65"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false, amount: 0.6 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {/* The "drag to turn" instruction lives in the foot, next to the
              controls it describes — repeating it here only cost the stage a
              line of height. */}
          Every service is wired back to the same core — the survey feeds the strategy, the strategy
          feeds the speech.
        </motion.p>
      </div>

      <div className="ov-stage relative z-10">
        {near ? <ServiceDeck onSelect={jumpTo} reducedMotion={reduced} /> : <StageFallback />}

        {/* Hover read-out. aria-live so the label reaches a screen reader that
            cannot see the canvas at all. */}
        <div
          role="status"
          aria-live="polite"
          className="pointer-events-none absolute inset-x-0 bottom-2 flex justify-center"
        >
          {active && (
            <span className="rounded-full border border-white/15 bg-[#061428]/85 px-4 py-1.5 text-xs font-semibold backdrop-blur">
              <span className="text-[#ff9933]">{active.number}</span>
              <span className="ml-2 text-white">{active.label}</span>
            </span>
          )}
        </div>
      </div>

      <div className="ov-foot relative z-10 mx-auto w-full max-w-[1440px] px-4 pb-7 sm:px-6">
        <p className="mb-3 text-center text-[11px] text-white/40">
          Drag to turn · click a node to open it · arrow keys also work
        </p>
        {/* The legend is the accessible, always-available route to the same six
            links — the canvas is an enhancement, never the only way through. */}
        {/* The fixed social/chat rail (right-6, ~68px wide) sits over the
            bottom-right of the viewport and was covering two legend buttons on
            a phone. Insetting the list past it costs a little width; a covered
            control costs the visitor the link entirely. The rail moves out of
            the legend's band at sm and up, so the inset is base-only. */}
        <ul className="flex flex-wrap items-center justify-center gap-x-2 gap-y-2 pr-24 sm:pr-0">
          {SERVICE_NODES.map((n) => (
            <li key={n.id}>
              <button
                type="button"
                onClick={() => jumpTo(n.id)}
                onMouseEnter={() => setHovered(n.id)}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => setHovered(n.id)}
                onBlur={() => setHovered(null)}
                className="flex items-center gap-2 rounded-full border border-white/12 px-3 py-1.5 text-[11px] font-semibold text-white/70 transition-colors hover:border-white/30 hover:bg-white/5 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff9933]"
              >
                <span className="h-2 w-2 rounded-full" style={{ background: n.colour }} />
                {n.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
