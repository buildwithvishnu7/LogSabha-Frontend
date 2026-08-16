"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useScroll, useSpring } from "motion/react";
import { ArrowDown, Quote } from "lucide-react";
import { SlotNumber } from "@/components/motion/SlotNumber";
import { Typewriter } from "@/components/motion/Typewriter";
import { HERO_SUB, SECTION_Y } from "@/styles/tokens";
import {
  aboutSections,
  aboutYears,
  type AboutNode,
  type AboutSection,
} from "@/data/about-page";

/* Reference palette: navy hero #0B1120, heading #0A0A0A, body #6B7280,
   muted #9CA3AF, saffron #F59E0B / #D97706, panel #F5F5F5. Sharp 3px shapes. */

const EASE = [0.16, 1, 0.3, 1] as const;

/* ═══════════════ reading progress ═══════════════ */

export function AboutProgress() {
  const { scrollYProgress } = useScroll();
  const x = useSpring(scrollYProgress, { stiffness: 140, damping: 28, restDelta: 0.001 });
  return (
    <motion.div
      aria-hidden
      className="fixed inset-x-0 top-0 z-50 h-[3px] origin-left bg-[#F59E0B]"
      style={{ scaleX: x }}
    />
  );
}

/* ═══════════════ hero ═══════════════ */

function Hero({ section }: { section: AboutSection }) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: false, amount: 0.2 });
  const title = "ABOUT US";
  const sub = section.flow.find((n) => n.t === "p") as { text: string } | undefined;
  const img = section.flow.find((n) => n.t === "img") as
    | { src: string; alt: string; w?: number; h?: number }
    | undefined;

  return (
    <section ref={ref} className="relative overflow-hidden bg-[#0B1120] pt-28 sm:pt-32">
      <div className="relative z-10 mx-auto max-w-5xl px-4 pb-12 text-center sm:px-6 sm:pb-14">
        <h1 className={`text-3xl font-extrabold leading-[1.22] tracking-tight text-white sm:text-4xl`} aria-label={title}>
          {title.split("").map((ch, i) => (
            <motion.span
              key={i}
              aria-hidden
              className="inline-block"
              initial={{ opacity: 0, y: 40, filter: "blur(6px)" }}
              animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
              transition={{ duration: 0.7, delay: 0.1 + i * 0.05, ease: EASE }}
            >
              {ch === " " ? " " : ch}
            </motion.span>
          ))}
        </h1>

        {sub && (
          <motion.p
            className={`mx-auto mt-6 max-w-3xl ${HERO_SUB} text-[#9CA3AF]`}
            initial={{ opacity: 0, y: 18 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.5 }}
          >
            {sub.text}
          </motion.p>
        )}

        <motion.a
          href="#journey"
          className="mt-8 inline-flex h-10 w-10 items-center justify-center border border-white/30 text-white"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.75 }}
          whileHover={{ y: -2, backgroundColor: "rgba(255,255,255,0.12)" }}
          aria-label="Scroll to our journey"
        >
          <motion.span animate={{ y: [0, 4, 0] }} transition={{ duration: 1.7, repeat: Infinity }}>
            <ArrowDown className="h-4 w-4" />
          </motion.span>
        </motion.a>
      </div>

      {img && (
        <motion.div
          className="relative z-0 w-full"
          initial={{ opacity: 0, y: 26 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.35, ease: EASE }}
        >
          <img
            src={img.src}
            alt=""
            aria-hidden
            width={img.w}
            height={img.h}
            className="block h-auto w-full select-none opacity-70"
          />
        </motion.div>
      )}
    </section>
  );
}

/* ═══════════════ pull quote ═══════════════ */

function PullQuote({ section }: { section: AboutSection }) {
  const text = (section.flow.find((n) => n.t === "p") as { text: string } | undefined)?.text;
  if (!text) return null;
  return (
    <section className={`bg-[linear-gradient(#FFFFFF,#F5F5F5)] ${SECTION_Y}`}>
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
        <motion.span
          className="inline-block text-[#F59E0B]"
          initial={{ opacity: 0, scale: 0.7, rotate: -12 }}
          whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
          viewport={{ once: false, amount: 0.6 }}
          transition={{ type: "spring", stiffness: 220, damping: 16 }}
        >
          <Quote className="h-10 w-10" />
        </motion.span>
        <motion.blockquote
          className="mt-5 text-lg font-medium leading-[1.7] text-[#0A0A0A] sm:text-xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.4 }}
          transition={{ duration: 0.8, ease: EASE }}
        >
          {text}
        </motion.blockquote>
      </div>
    </section>
  );
}

/* ═══════════════ flow renderer (shared) ═══════════════ */

function Node({
  node,
  panel,
  lead,
  i,
}: {
  node: AboutNode;
  panel: boolean;
  lead: boolean;
  i: number;
}) {
  const delay = Math.min(i, 6) * 0.05;

  if (node.t === "img") {
    return (
      <motion.figure
        className="group my-8 overflow-hidden rounded-xl"
        // capped at the file's own width so nothing is ever blown up
        style={{ maxWidth: node.w }}
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.2 }}
        transition={{ duration: 0.85, ease: EASE }}
      >
        <img
          src={node.src}
          alt={node.alt}
          loading="lazy"
          width={node.w}
          height={node.h}
          className="block h-auto w-full transition-transform duration-[1.4s] group-hover:scale-[1.03]"
        />
        {node.alt && (
          <figcaption className="mt-2 text-[12px] italic text-[#9CA3AF]">{node.alt}</figcaption>
        )}
      </motion.figure>
    );
  }

  if (node.t === "h") {
    const big = node.level <= 2;
    return (
      <motion.h3
        className={`${big ? "mt-9 text-lg sm:text-xl" : "mt-7 text-base"} font-bold leading-[1.35] text-[#0A0A0A] first:mt-0`}
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.5 }}
        transition={{ duration: 0.6, ease: EASE }}
      >
        {lead ? <Typewriter text={node.text} /> : node.text}
      </motion.h3>
    );
  }

  if (node.t === "quote") {
    return (
      <motion.blockquote
        className={`my-6 border-l-[3px] border-[#F59E0B] px-5 py-4 text-[15px] italic leading-loose text-[#6B7280] ${panel ? "bg-white" : "bg-[#F5F5F5]"}`}
        initial={{ opacity: 0, x: 18 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: false, amount: 0.4 }}
        transition={{ duration: 0.55, delay, ease: EASE }}
      >
        {node.text}
      </motion.blockquote>
    );
  }

  if (node.t === "li") {
    return (
      <motion.li
        className="ml-5 list-disc py-1 text-sm leading-relaxed text-[#6B7280]"
        initial={{ opacity: 0, x: 16 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: false, amount: 0.4 }}
        transition={{ duration: 0.5, delay, ease: EASE }}
      >
        {node.text}
      </motion.li>
    );
  }

  return (
    <motion.p
      className="mt-4 text-sm leading-relaxed text-[#6B7280]"
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.25 }}
      transition={{ duration: 0.55, delay, ease: EASE }}
    >
      {node.text}
    </motion.p>
  );
}

function FlowSection({ section }: { section: AboutSection }) {
  const panel = section.theme === "panel";
  const firstHeading = section.flow.findIndex((n) => n.t === "h");
  return (
    <section
      id={section.id}
      className={`scroll-mt-24 ${SECTION_Y} ${panel ? "bg-[#F5F5F5]" : "bg-white"}`}
    >
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        {section.flow.map((n, i) => (
          <Node key={i} node={n} panel={panel} lead={i === firstHeading} i={i} />
        ))}
      </div>
    </section>
  );
}

/* ═══════════════ year archive ═══════════════ */

function YearSection({ section }: { section: AboutSection }) {
  const panel = section.theme === "panel";
  const firstHeading = section.flow.findIndex((n) => n.t === "h");

  return (
    <section
      id={section.id}
      className={`scroll-mt-20 ${SECTION_Y} ${panel ? "bg-[#F5F5F5]" : "bg-white"}`}
    >
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        {/* The giant numeral is the reference's spine device for the archive. */}
        <div className="flex items-baseline gap-4">
          <span className="text-4xl font-extrabold leading-none text-[#F59E0B]/25 sm:text-[3.5rem]">
            <SlotNumber value={String(section.year)} digitWidth="0.6em" />
          </span>
          <motion.span
            className="h-[3px] flex-1 origin-left bg-[#0A0A0A]/10"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: false, amount: 0.6 }}
            transition={{ duration: 0.7, ease: EASE }}
          />
        </div>

        <div className="mt-6">
          {section.flow.map((n, i) => (
            <Node key={i} node={n} panel={panel} lead={i === firstHeading} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

/** Fixed rail that tracks which archive year is on screen. At ~40,000px this
 *  page is unnavigable without one — scrolling for a specific election is
 *  otherwise guesswork. */
function YearRail() {
  const [active, setActive] = useState<number | null>(null);

  useEffect(() => {
    let last = 0;

    const measure = () => {
      const mid = window.innerHeight * 0.4;
      let current: number | null = null;
      for (const y of aboutYears) {
        const el = document.getElementById(`y${y}`);
        if (!el) continue;
        const r = el.getBoundingClientRect();
        if (r.top <= mid && r.bottom > mid) { current = y; break; }
      }
      setActive(current);
    };

    // Time-throttled rather than rAF-coalesced on purpose: requestAnimationFrame
    // is suspended while the document is hidden, which would leave the rail
    // stale on a backgrounded tab. Reading twelve rects is cheap — the browser
    // already has fresh layout when a scroll event fires.
    const schedule = () => {
      const now = performance.now();
      if (now - last < 80) return;
      last = now;
      measure();
    };

    // An anchor jump (landing on /about#y2019, or clicking a rail link) scrolls
    // AFTER the event fires, so one immediate measurement reads the old
    // position. Re-measure while the jump and any late layout settle.
    const timers: ReturnType<typeof setTimeout>[] = [];
    const remeasureSoon = () => {
      timers.push(
        setTimeout(() => { last = 0; schedule(); }, 60),
        setTimeout(() => { last = 0; schedule(); }, 250),
        setTimeout(() => { last = 0; schedule(); }, 600),
      );
    };

    measure();
    remeasureSoon();

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    window.addEventListener("hashchange", remeasureSoon);
    return () => {
      timers.forEach(clearTimeout);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("hashchange", remeasureSoon);
    };
  }, []);

  return (
    <nav
      aria-label="Election years"
      className="pointer-events-none fixed left-4 top-1/2 z-40 hidden -translate-y-1/2 xl:block"
    >
      <ul className="pointer-events-auto flex flex-col gap-0.5">
        {aboutYears.map((y) => (
          <li key={y}>
            <a
              href={`#y${y}`}
              aria-current={active === y ? "true" : undefined}
              className={`relative block px-2.5 py-1 text-[12px] font-bold tabular-nums transition-colors ${
                active === y ? "text-[#F59E0B]" : "text-[#9CA3AF]/50 hover:text-[#0A0A0A]"
              } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F59E0B] focus-visible:ring-offset-2`}
            >
              {active === y && (
                <motion.span
                  layoutId="about-year-active"
                  className="absolute inset-y-0 left-0 w-[3px] bg-[#F59E0B]"
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                />
              )}
              {y}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/* ═══════════════ page ═══════════════ */

export function AboutPage() {
  const [hero, quote, ...rest] = aboutSections;

  return (
    <>
      <AboutProgress />
      <YearRail />
      <Hero section={hero} />
      <PullQuote section={quote} />
      {rest.map((s) =>
        s.year ? <YearSection key={s.id} section={s} /> : <FlowSection key={s.id} section={s} />,
      )}
    </>
  );
}
