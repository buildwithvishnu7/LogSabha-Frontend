"use client";

import { useRef } from "react";
import { motion, useInView, useScroll, useSpring } from "motion/react";
import { Typewriter } from "@/components/motion/Typewriter";
import { hfjHero } from "@/data/hfj-hero";

/* Reference palette: radial navy hero (#1F2937 → #111827 → #061428),
   navy #0A0A0A / #0A0A0A, body #6B7280, muted #9CA3AF,
   saffron #FF9933 / #E87D12, cream-on-dark #FFC27A. Sharp 3px shapes. */

const EASE = [0.16, 1, 0.3, 1] as const;

/* Only the progress bar and the hero live here now. The section/flow renderer
   and its theme map went with HfjBody when the page moved to the chapter data
   in hfj-chapters.ts — they read types that no longer exist. */

export function HfjProgress() {
  const { scrollYProgress } = useScroll();
  const x = useSpring(scrollYProgress, { stiffness: 140, damping: 28, restDelta: 0.001 });
  return (
    <motion.div
      aria-hidden
      className="fixed inset-x-0 top-0 z-50 h-[3px] origin-left bg-[#FF9933]"
      style={{ scaleX: x }}
    />
  );
}

/* ═══════════════ hero ═══════════════ */

export function HfjHero() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: false, amount: 0.2 });

  return (
    <section
      ref={ref}
      className="relative overflow-hidden pt-28 pb-14 sm:pt-32 sm:pb-16"
      style={{
        backgroundImage:
          "radial-gradient(120% 90% at 78% 10%, #1F2937 0%, #111827 42%, #061428 100%)",
      }}
    >
      {/* Archival scroll, held to its own pixels and floated behind the type. */}
      <motion.img
        src={hfjHero.image}
        alt=""
        aria-hidden
        className="pointer-events-none absolute right-[-4%] top-6 hidden w-[min(38vw,460px)] select-none opacity-[0.16] lg:block"
        initial={{ opacity: 0, scale: 1.06, rotate: -3 }}
        animate={inView ? { opacity: 0.16, scale: 1, rotate: 0 } : {}}
        transition={{ duration: 1.4, ease: EASE }}
      />

      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6">
        <motion.span
          className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-wide text-[#FFC27A]"
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55 }}
        >
          <span className="h-px w-7 bg-[#FF9933]" />
          A HISTORICAL ACCOUNT
        </motion.span>

        <h1
          className="mt-4 max-w-4xl text-2xl font-extrabold leading-[1.25] text-white sm:text-3xl lg:text-4xl"
          aria-label={hfjHero.title}
        >
          {hfjHero.title.split(" ").map((w, i) => (
            <motion.span
              key={i}
              aria-hidden
              className="mr-[0.28em] inline-block last:mr-0"
              initial={{ opacity: 0, y: 34, filter: "blur(7px)" }}
              animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
              transition={{ duration: 0.75, delay: 0.1 + i * 0.07, ease: EASE }}
            >
              {w}
            </motion.span>
          ))}
        </h1>

        <motion.p
          className="mt-5 max-w-2xl text-sm leading-relaxed text-[#9CA3AF] sm:text-base"
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.7 }}
        >
          {hfjHero.subtitle}
        </motion.p>

        <div className="mt-8 flex flex-wrap gap-3">
          {hfjHero.chips.map((c, i) => (
            <motion.div
              key={c.era}
              className="border-l-[3px] border-[#F97316] bg-white/[0.06] px-4 py-3 backdrop-blur-sm"
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.85 + i * 0.12, ease: EASE }}
            >
              <span className="block text-[11px] font-bold tracking-[0.16em] text-[#FFC27A]">
                {c.era}
              </span>
              <span className="mt-1 block text-sm text-white/85">{c.text}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════ flow renderer ═══════════════ */
