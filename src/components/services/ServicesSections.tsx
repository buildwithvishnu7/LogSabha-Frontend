"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { ArrowDown, ArrowRight } from "lucide-react";
import { SlotNumber } from "@/components/motion/SlotNumber";
import { Typewriter } from "@/components/motion/Typewriter";
import { servicesData, type ServiceBlock } from "@/data/services";

/* Palette follows the reference, which is the same family as the homepage:
   navy #14213D · deep navy #0A1E3F · rule navy #1B3A6B
   body #41506D · muted #4A5670 · saffron #E67300 / #A85200 · panel #F2F5FA
   Shapes are SHARP (3px), matching the rest of the site. */

const EASE = [0.16, 1, 0.3, 1] as const;

/* ═══════════════ 1. hero ═══════════════ */

export function ServicesHero() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: false, amount: 0.2 });
  const { hero } = servicesData;

  return (
    <section
      ref={ref}
      className="relative overflow-hidden pt-28 sm:pt-32"
      style={{ backgroundImage: "linear-gradient(#FFFFFF, #F2F5FA)" }}
    >
      <div className="relative z-10 mx-auto max-w-5xl px-4 pb-14 text-center sm:px-6 sm:pb-16">
        <h1
          className="text-[2.5rem] font-extrabold leading-[1.22] tracking-[1px] sm:text-[3.75rem] lg:text-[4.5rem] text-[#14213D]"
          aria-label={hero.title}
        >
          {/* Latin caps, so per-letter is safe here — no combining marks to split. */}
          {hero.title.split("").map((ch, i) => (
            <motion.span
              key={i}
              aria-hidden
              className="inline-block"
              initial={{ opacity: 0, y: 40, filter: "blur(6px)" }}
              animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
              transition={{ duration: 0.7, delay: 0.1 + i * 0.05, ease: EASE }}
            >
              {ch}
            </motion.span>
          ))}
        </h1>

        <motion.p
          className="mx-auto mt-6 max-w-3xl text-[15px] leading-loose text-[#41506D] sm:text-base"
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.5 }}
        >
          {hero.subtitle}
        </motion.p>

        <motion.div
          className="mt-8 flex flex-wrap items-center justify-center gap-3"
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.65 }}
        >
          <motion.a
            href={hero.ctaPrimary.href}
            className="group relative inline-flex items-center gap-2 overflow-hidden bg-[#E67300] px-6 py-3 text-[13px] font-bold tracking-[1.5px] text-white"
            style={{ borderRadius: 3 }}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
          >
            <motion.span
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "linear-gradient(115deg, transparent 38%, rgba(255,255,255,0.35) 50%, transparent 62%)",
                backgroundSize: "220% 100%",
              }}
              animate={inView ? { backgroundPosition: ["-120% 0%", "220% 0%"] } : undefined}
              transition={{ duration: 2.6, repeat: Infinity, repeatDelay: 1.6, ease: "easeInOut" }}
            />
            {hero.ctaPrimary.label}
            <motion.span animate={{ y: [0, 3, 0] }} transition={{ duration: 1.6, repeat: Infinity }}>
              <ArrowDown className="h-4 w-4" />
            </motion.span>
          </motion.a>
          <motion.a
            href={hero.ctaSecondary.href}
            className="inline-flex items-center gap-2 border border-[#14213D]/25 px-6 py-3 text-[13px] font-bold tracking-[1.5px] text-[#14213D]"
            style={{ borderRadius: 3 }}
            whileHover={{ y: -2, backgroundColor: "rgba(20,33,61,0.05)" }}
            whileTap={{ scale: 0.97 }}
          >
            {hero.ctaSecondary.label}
            <ArrowRight className="h-4 w-4" />
          </motion.a>
        </motion.div>
      </div>

      {/* Crowd band. The asset is 2561x218 — a natural full-width strip, which is
          exactly how the reference uses it. Never capped to a box: cropping an
          11:1 banner into a card would throw away the whole composition. */}
      <motion.div
        className="relative z-0 w-full"
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.9, delay: 0.4, ease: EASE }}
      >
        <img
          src="/images/pa/hero-crowd-clean.png"
          alt="Campaign crowd"
          className="block h-auto w-full select-none"
          style={{
            WebkitMaskImage: "linear-gradient(180deg, transparent 0, #000 22%)",
            maskImage: "linear-gradient(180deg, transparent 0, #000 22%)",
          }}
        />
      </motion.div>
    </section>
  );
}

/* ═══════════════ 2. intro ═══════════════ */

function Kicker({ children }: { children: React.ReactNode }) {
  return (
    <motion.span
      className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-[#A85200]"
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.6 }}
      transition={{ duration: 0.55 }}
    >
      <span className="h-px w-7 bg-[#E67300]" />
      {children}
    </motion.span>
  );
}

export function ServicesIntro() {
  const { intro } = servicesData;
  return (
    <section id="services" className="bg-[#F2F5FA] pt-16 sm:pt-20">
      <div className="mx-auto max-w-5xl px-4 text-center sm:px-6">
        <Kicker>{intro.kicker}</Kicker>
        <motion.h2
          className="mt-3 text-3xl font-bold leading-[1.25] text-[#14213D] sm:text-[2.6rem]"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.5 }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <Typewriter text={intro.title} />
        </motion.h2>
        <motion.p
          className="mx-auto mt-5 max-w-3xl text-[15px] leading-loose text-[#41506D]"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.4 }}
          transition={{ duration: 0.7, delay: 0.15 }}
        >
          {intro.body}
        </motion.p>
      </div>
    </section>
  );
}

/* ═══════════════ 3. service blocks ═══════════════ */

function ServiceRow({ block, index }: { block: ServiceBlock; index: number }) {
  return (
    <section
      id={block.id}
      className={`scroll-mt-24 py-14 sm:py-20 ${index % 2 === 1 ? "bg-white" : "bg-[#F2F5FA]"}`}
    >
      <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)] lg:gap-14">
        {/* Left rail. Sticky on desktop only — the reference pins it at top:168px
            so the number and photo stay with you while the item list scrolls. */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="flex items-center gap-4">
            <span className="text-4xl font-extrabold leading-none text-[#E67300]/25 sm:text-5xl">
              <SlotNumber value={block.number} />
            </span>
            <span className="h-px flex-1 bg-[#14213D]/12" />
          </div>

          <motion.h2
            className="mt-4 text-2xl font-bold leading-[1.25] text-[#14213D] sm:text-[2rem]"
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.5 }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <Typewriter text={block.title} />
          </motion.h2>

          <motion.p
            className="mt-3 text-[15px] font-medium leading-relaxed text-[#A85200]"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: false, amount: 0.5 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            {block.lead}
          </motion.p>

          <motion.figure
            className="group relative mt-6 overflow-hidden"
            style={{ borderRadius: 3 }}
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.25 }}
            transition={{ duration: 0.8, ease: EASE }}
          >
            <img
              src={block.image}
              alt={block.imageAlt}
              loading="lazy"
              // h-auto + natural aspect: no object-cover, no forced ratio, so an
              // image is never blown up past its own pixels (the RSS lesson).
              className="block h-auto w-full transition-transform duration-[1.2s] group-hover:scale-[1.04]"
            />
            <motion.span
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "linear-gradient(115deg, transparent 40%, rgba(255,255,255,0.26) 50%, transparent 60%)",
                backgroundSize: "220% 100%",
              }}
              animate={{ backgroundPosition: ["-120% 0%", "220% 0%"] }}
              transition={{ duration: 3.8, repeat: Infinity, repeatDelay: 3, ease: "easeInOut" }}
            />
          </motion.figure>
        </div>

        {/* Item list */}
        <ul className="space-y-3">
          {block.items.map((item, i) => (
            <motion.li
              key={item.title}
              className="group relative border-l-[3px] border-[#E67300]/35 bg-white px-5 py-4 shadow-[0_1px_0_rgba(20,33,61,0.06)] transition-colors hover:border-[#E67300]"
              style={{ borderRadius: 3 }}
              initial={{ opacity: 0, x: 26 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, amount: 0.35 }}
              transition={{ duration: 0.55, delay: Math.min(i, 5) * 0.07, ease: EASE }}
              whileHover={{ x: 4 }}
            >
              <h3 className="text-base font-bold leading-snug text-[#1B3A6B]">{item.title}</h3>
              <p className="mt-2 text-sm leading-loose text-[#4A5670]">{item.body}</p>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function ServiceBlocks() {
  return (
    <>
      {servicesData.blocks.map((b, i) => (
        <ServiceRow key={b.id} block={b} index={i} />
      ))}
    </>
  );
}

/* ═══════════════ 4. closing CTA ═══════════════ */

export function ServicesCta() {
  const { cta } = servicesData;
  return (
    <section className="relative overflow-hidden bg-[#0A1E3F] py-14 sm:py-20">
      <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
        <motion.span
          className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#FFD9AE]"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.6 }}
          transition={{ duration: 0.55 }}
        >
          {cta.kicker}
        </motion.span>
        <motion.h2
          className="mt-3 text-2xl font-bold leading-[1.3] text-white sm:text-[2.1rem]"
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.5 }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <Typewriter text={cta.title} />
        </motion.h2>
        <motion.p
          className="mx-auto mt-4 max-w-2xl text-[15px] leading-loose text-white/70"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false, amount: 0.5 }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          {cta.body}
        </motion.p>
        <motion.a
          href={cta.button.href}
          className="mt-7 inline-flex items-center gap-2 bg-[#E67300] px-7 py-3.5 text-[13px] font-bold tracking-[1.5px] text-white"
          style={{ borderRadius: 3 }}
          initial={{ opacity: 0, scale: 0.94 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: false, amount: 0.6 }}
          transition={{ type: "spring", stiffness: 240, damping: 18, delay: 0.2 }}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.97 }}
        >
          {cta.button.label}
          <ArrowRight className="h-4 w-4" />
        </motion.a>
      </div>
    </section>
  );
}
