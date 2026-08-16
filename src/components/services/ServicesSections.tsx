"use client";

import { useRef, useState } from "react";
import {
  motion,
  useInView,
  useScroll,
  useTransform,
  useMotionValueEvent,
  useReducedMotion,
  AnimatePresence,
} from "motion/react";
import { ArrowDown, ArrowRight } from "lucide-react";
import { SlotNumber } from "@/components/motion/SlotNumber";
import { servicesData, type ServiceBlock } from "@/data/services";

/* Homepage tokens: ink #0A0A0A · body #6B7280 · muted panel #F5F5F5
   brand amber #F59E0B · brand dark #D97706 · dark ground #0B1120
   Soft shapes — rounded-full on pills, rounded-xl on surfaces. */

const EASE = [0.16, 1, 0.3, 1] as const;
const BLOCKS = servicesData.blocks;

/* ═══════════════════════════════════════════════════════════════════
   1. HERO — editorial, asymmetric, not a centred stack
   ═══════════════════════════════════════════════════════════════════ */

export function ServicesHero() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: false, amount: 0.2 });
  const { hero } = servicesData;

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={ref} className="relative min-h-[92svh] overflow-hidden bg-[#0B1120]">
      {/* Photograph as atmosphere, not subject: heavily tinted and parallaxed, so
          it carries depth without competing with the type. Replaces the old
          2561x218 crowd sliver, which could only ever show a slice of a crowd. */}
      <motion.div className="absolute inset-0" style={{ y: bgY }}>
        <img
          src="/images/editorial-bg.jpg"
          alt=""
          aria-hidden
          className="h-[118%] w-full object-cover object-center"
        />
        <span className="absolute inset-0 bg-[#0B1120]/82" />
        <span className="absolute inset-0 bg-[radial-gradient(120%_90%_at_20%_0%,rgba(245,158,11,0.22),transparent_60%)]" />
      </motion.div>

      <motion.div
        className="relative z-10 mx-auto flex min-h-[92svh] max-w-[1440px] flex-col justify-center px-4 pt-28 pb-16 sm:px-6"
        style={{ opacity: fade }}
      >
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,380px)] lg:items-end lg:gap-16">
          <div>
            <motion.span
              className="inline-flex items-center gap-3 text-[10px] font-bold uppercase tracking-wide text-[#FBBF24]"
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55 }}
            >
              <span className="h-px w-10 bg-[#F59E0B]" />
              The LogSabha Practice
            </motion.span>

            {/* Masked line reveal — the line rises out of its own clip box.
                Reads as typesetting rather than as letters flying in. */}
            <h1
              className="mt-5 text-[13vw] font-extrabold leading-[0.92] tracking-tight text-white sm:text-[9vw] lg:text-[7.2rem]"
              aria-label={hero.title}
            >
              {["SIX", "DISCIPLINES"].map((line, i) => (
                <span key={line} aria-hidden className="block overflow-hidden">
                  <motion.span
                    className="block"
                    initial={{ y: "110%" }}
                    animate={inView ? { y: "0%" } : {}}
                    transition={{ duration: 0.9, delay: 0.15 + i * 0.12, ease: EASE }}
                  >
                    {line}
                    {i === 1 && <span className="text-[#F59E0B]">.</span>}
                  </motion.span>
                </span>
              ))}
            </h1>

            <motion.p
              className="mt-7 max-w-xl text-sm leading-relaxed text-[#9CA3AF] sm:text-base"
              initial={{ opacity: 0, y: 18 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.55 }}
            >
              {hero.subtitle}
            </motion.p>

            <motion.div
              className="mt-9 flex flex-wrap items-center gap-3"
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              <a
                href="#services"
                className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-[#F59E0B] px-7 py-3.5 text-[13px] font-bold tracking-wide text-white shadow-[0_0_28px_rgba(245,158,11,0.45)] transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F59E0B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B1120]"
              >
                {hero.ctaPrimary.label}
                <ArrowDown className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
              </a>
              <a
                href={hero.ctaSecondary.href}
                className="inline-flex items-center gap-2 rounded-full border border-white/25 px-7 py-3.5 text-[13px] font-bold tracking-wide text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F59E0B]"
              >
                {hero.ctaSecondary.label}
                <ArrowRight className="h-4 w-4" />
              </a>
            </motion.div>
          </div>

          {/* The six disciplines listed in the hero — the page's contents page,
              so a visitor knows the shape of what follows before scrolling. */}
          <motion.ol
            className="hidden border-t border-white/10 lg:block"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            {BLOCKS.map((b, i) => (
              <motion.li
                key={b.id}
                initial={{ opacity: 0, x: 20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.85 + i * 0.08, ease: EASE }}
              >
                <a
                  href={`#${b.id}`}
                  className="group flex items-baseline gap-4 border-b border-white/10 py-3 transition-colors hover:bg-white/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F59E0B]"
                >
                  <span className="w-8 shrink-0 text-[11px] font-bold tabular-nums text-[#F59E0B]">
                    {b.number}
                  </span>
                  <span className="flex-1 text-[13px] font-semibold leading-snug text-white/70 transition-colors group-hover:text-white">
                    {b.title.split(" ").slice(0, 4).join(" ")}
                  </span>
                  <ArrowRight className="h-3.5 w-3.5 shrink-0 text-white/30 transition-all group-hover:translate-x-1 group-hover:text-[#F59E0B]" />
                </a>
              </motion.li>
            ))}
          </motion.ol>
        </div>
      </motion.div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   2. INTRO — one statement, held large
   ═══════════════════════════════════════════════════════════════════ */

export function ServicesIntro() {
  const { intro } = servicesData;
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const x = useTransform(scrollYProgress, [0, 1], ["6%", "-6%"]);

  return (
    <section className="overflow-hidden bg-white py-20 sm:py-28">
      <div ref={ref} className="mx-auto max-w-[1440px] px-4 sm:px-6">
        <motion.p
          className="max-w-4xl text-2xl font-bold leading-[1.3] tracking-tight text-[#0A0A0A] sm:text-4xl"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.5 }}
          transition={{ duration: 0.8, ease: EASE }}
        >
          {intro.body}
        </motion.p>

        {/* Drifting rule of discipline names — ambient, ties the section to the
            sequence below without adding another heading. */}
        <motion.div
          className="mt-14 flex w-max gap-10 whitespace-nowrap text-[11px] font-bold uppercase tracking-wide text-[#9CA3AF]"
          style={{ x }}
        >
          {[...BLOCKS, ...BLOCKS].map((b, i) => (
            <span key={i} className="flex items-center gap-10">
              {b.title.split(" ").slice(0, 3).join(" ")}
              <span className="h-1 w-1 rounded-full bg-[#F59E0B]" />
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   3. THE SEQUENCE — six disciplines as one pinned scroll, not six blocks
   ═══════════════════════════════════════════════════════════════════ */

function Stage({ block, index }: { block: ServiceBlock; index: number }) {
  return (
    <div className="grid h-full gap-8 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)] lg:gap-16">
      {/* left: number, title, photograph */}
      <div className="flex flex-col justify-center">
        <div className="flex items-center gap-4">
          <span className="text-5xl font-extrabold leading-none text-[#F59E0B] sm:text-6xl">
            <SlotNumber value={block.number} />
          </span>
          <span className="h-px flex-1 bg-[#0A0A0A]/10" />
          <span className="text-[11px] font-bold tabular-nums text-[#9CA3AF]">
            {index + 1} / {BLOCKS.length}
          </span>
        </div>

        <h2 className="mt-5 text-xl font-bold leading-[1.25] tracking-tight text-[#0A0A0A] sm:text-2xl">
          {block.title}
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-[#D97706]">{block.lead}</p>

        <figure className="mt-7 hidden overflow-hidden rounded-xl sm:block">
          <img
            src={block.image}
            alt={block.imageAlt}
            loading="lazy"
            className="mx-auto block h-auto w-full max-w-[420px] object-cover"
          />
        </figure>
      </div>

      {/* right: the items */}
      <ul className="flex flex-col justify-center gap-2.5 overflow-y-auto">
        {block.items.map((item, i) => (
          <motion.li
            key={item.title}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.06 + Math.min(i, 5) * 0.06, ease: EASE }}
            className="group rounded-xl border border-[#E5E7EB] bg-white px-5 py-3.5 shadow-lg transition-shadow hover:shadow-xl"
          >
            <h3 className="text-[15px] font-bold leading-snug text-[#0A0A0A]">{item.title}</h3>
            <p className="mt-1.5 line-clamp-2 text-[13px] leading-relaxed text-[#6B7280] group-hover:line-clamp-none">
              {item.body}
            </p>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}

/** The six disciplines rendered as one pinned sequence: the stage holds still
 *  while the page scrolls, and the discipline advances under it. Six identical
 *  stacked blocks read as a list; this reads as a single piece. */
function PinnedSequence() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const i = Math.min(BLOCKS.length - 1, Math.max(0, Math.floor(v * BLOCKS.length)));
    setActive((prev) => (prev === i ? prev : i));
  });

  const railScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div ref={ref} style={{ height: `${BLOCKS.length * 100}vh` }} className="relative">
      <div className="sticky top-0 flex h-svh flex-col overflow-hidden bg-[#F5F5F5] pt-20 pb-8">
        {/* progress rail across the top of the stage */}
        <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6">
          <div className="h-px w-full bg-[#0A0A0A]/10">
            <motion.div className="h-px origin-left bg-[#F59E0B]" style={{ scaleX: railScale }} />
          </div>
          {/* Clickable, not just an indicator. Scroll drives this normally, but
              a pinned sequence that only responds to scroll strands the reader
              if that ever misbehaves — six screens of nothing. The rail is the
              guaranteed way through, and it doubles as keyboard navigation. */}
          <ol className="mt-3 flex gap-1 overflow-x-auto pb-1">
            {BLOCKS.map((b, i) => (
              <li key={b.id}>
                <button
                  onClick={() => {
                    setActive(i);
                    const el = ref.current;
                    if (el) {
                      window.scrollTo({
                        top: el.offsetTop + (i + 0.5) * window.innerHeight,
                        behavior: "smooth",
                      });
                    }
                  }}
                  aria-current={i === active ? "true" : undefined}
                  aria-label={`${b.number} — ${b.title}`}
                  className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wide transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F59E0B] ${
                    i === active
                      ? "bg-[#0A0A0A] text-white"
                      : "text-[#9CA3AF] hover:bg-[#0A0A0A]/5 hover:text-[#0A0A0A]"
                  }`}
                >
                  {b.number}
                </button>
              </li>
            ))}
          </ol>
        </div>

        <div className="mx-auto w-full max-w-[1440px] flex-1 px-4 py-6 sm:px-6">
          <AnimatePresence initial={false}>
            <motion.div
              key={active}
              className="h-full"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: EASE }}
            >
              <Stage block={BLOCKS[active]} index={active} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

/** Plain stacked fallback — used when the visitor prefers reduced motion, and
 *  it is also what the markup degrades to without JS. Every discipline keeps
 *  its own anchor id so the hero's contents list still works. */
function StackedBlocks() {
  return (
    <>
      {BLOCKS.map((block, index) => (
        <section
          key={block.id}
          id={block.id}
          className={`scroll-mt-24 py-14 sm:py-20 ${index % 2 === 1 ? "bg-white" : "bg-[#F5F5F5]"}`}
        >
          <div className="mx-auto max-w-[1440px] px-4 sm:px-6">
            <Stage block={block} index={index} />
          </div>
        </section>
      ))}
    </>
  );
}

export function ServiceBlocks() {
  const reduced = useReducedMotion();
  return (
    <div id="services" className="scroll-mt-0">
      {reduced ? <StackedBlocks /> : <PinnedSequence />}
      {/* Anchor targets for the hero contents list, kept out of the pinned flow. */}
      {!reduced && (
        <div aria-hidden className="pointer-events-none">
          {BLOCKS.map((b) => (
            <span key={b.id} id={b.id} className="block h-0" />
          ))}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   4. CLOSING CTA
   ═══════════════════════════════════════════════════════════════════ */

export function ServicesCta() {
  const { cta } = servicesData;
  return (
    <section className="relative overflow-hidden bg-[#0B1120] py-24 sm:py-32">
      <span className="absolute inset-0 bg-[radial-gradient(90%_70%_at_50%_100%,rgba(245,158,11,0.2),transparent_65%)]" />
      <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6">
        <motion.span
          className="text-[10px] font-bold uppercase tracking-wide text-[#FBBF24]"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.6 }}
          transition={{ duration: 0.55 }}
        >
          {cta.kicker}
        </motion.span>

        <h2 className="mt-4 text-3xl font-extrabold leading-[1.15] tracking-tight text-white sm:text-5xl">
          {cta.title.split(" ").map((w, i) => (
            <span key={i} className="inline-block overflow-hidden">
              <motion.span
                className="mr-[0.25em] inline-block"
                initial={{ y: "110%" }}
                whileInView={{ y: "0%" }}
                viewport={{ once: false, amount: 0.5 }}
                transition={{ duration: 0.7, delay: i * 0.05, ease: EASE }}
              >
                {w}
              </motion.span>
            </span>
          ))}
        </h2>

        <motion.p
          className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-[#9CA3AF]"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false, amount: 0.5 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {cta.body}
        </motion.p>

        <motion.a
          href={cta.button.href}
          className="group mt-9 inline-flex items-center gap-2 rounded-full bg-[#F59E0B] px-8 py-4 text-[13px] font-bold tracking-wide text-white shadow-[0_0_30px_rgba(245,158,11,0.5)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F59E0B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B1120]"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: false, amount: 0.6 }}
          transition={{ type: "spring", stiffness: 240, damping: 18, delay: 0.25 }}
          whileHover={{ y: -3 }}
          whileTap={{ scale: 0.97 }}
        >
          {cta.button.label}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </motion.a>
      </div>
    </section>
  );
}
