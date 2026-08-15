"use client";

import { useRef, useState, useMemo } from "react";
import {
  motion,
  AnimatePresence,
  useInView,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { ChevronDown, ChevronLeft, ChevronRight, ArrowDown } from "lucide-react";
import { SlotNumber } from "@/components/motion/SlotNumber";
import { Typewriter } from "@/components/motion/Typewriter";
import { rssData } from "@/data/rss";
import { rssEras, rssYears, type RssYear } from "@/data/rss-timeline";

/* ═══════════════════════════════════════════════════════════
   Reference palette (from the designer's RSS 100 Years page)
   navy #14213D · saffron #FF7D0A→#FFCF85 · cream #FFF9F1/#FDF3E6
   dark brown #3A2413 · cream-on-dark #FFC98A · deep brown #8A3B12
   Shapes are SHARP (3px), not pill-rounded.
   ═══════════════════════════════════════════════════════════ */

/** Ashoka-chakra style wheel used as a slow-spinning watermark. */
function Chakra({
  className = "",
  stroke = "#14356b",
  duration = 140,
}: {
  className?: string;
  stroke?: string;
  duration?: number;
}) {
  // Coordinates are rounded to fixed strings: raw trig floats can differ in
  // their last bits between server and browser, which triggers a React
  // hydration mismatch and silently breaks effects in this subtree.
  const spokes = Array.from({ length: 24 }, (_, i) => {
    const a = (i * 15 * Math.PI) / 180;
    const r = (n: number) => n.toFixed(2);
    return {
      x1: r(150 + 26 * Math.cos(a)),
      y1: r(150 + 26 * Math.sin(a)),
      x2: r(150 + 148 * Math.cos(a)),
      y2: r(150 + 148 * Math.sin(a)),
    };
  });
  return (
    <motion.svg
      viewBox="0 0 300 300"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      stroke={stroke}
      strokeWidth={3}
      aria-hidden="true"
      className={`pointer-events-none absolute ${className}`}
      animate={{ rotate: 360 }}
      transition={{ duration, repeat: Infinity, ease: "linear" }}
    >
      <circle cx="150" cy="150" r="148" strokeWidth={4} />
      <circle cx="150" cy="150" r="26" strokeWidth={4} />
      {spokes.map((s, i) => (
        <line key={i} {...s} />
      ))}
    </motion.svg>
  );
}

/** Section eyebrow — small caps label above a heading. */
function Kicker({
  children,
  tone = "navy",
}: {
  children: React.ReactNode;
  tone?: "navy" | "cream" | "saffron";
}) {
  const tones = {
    navy: "text-[#8A3B12] before:bg-[#FF7D0A] after:bg-[#FF7D0A]/30",
    cream: "text-[#FFC98A] before:bg-[#FFC98A] after:bg-[#FFC98A]/30",
    saffron: "text-white/90 before:bg-white after:bg-white/40",
  };
  return (
    <motion.span
      className={`inline-flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-[0.28em] ${tones[tone]} before:block before:h-px before:w-7 after:block after:h-px after:w-7`}
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.6 }}
      transition={{ duration: 0.55 }}
    >
      {children}
    </motion.span>
  );
}

/* ═══════════════ 1. HERO — saffron gradient ═══════════════ */

function HeroStat({
  value,
  suffix,
  label,
  delay,
}: {
  value: number;
  suffix: string;
  label: string;
  delay: number;
}) {
  return (
    <motion.div
      className="flex flex-col items-center border-l border-white/25 px-5 first:border-l-0 sm:px-7"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <span className="text-2xl font-extrabold leading-none text-white drop-shadow-sm sm:text-3xl">
        <SlotNumber value={`${value}${suffix}`} />
      </span>
      <span className="mt-1.5 text-[10px] font-semibold tracking-wider text-white/80 sm:text-[11px]">
        {label}
      </span>
    </motion.div>
  );
}

// Year ticker pinned to the bottom of the hero (reference: 42s linear marquee).
// The list is rendered TWICE and the track slides exactly -50% of its own width,
// so the second copy lands pixel-for-pixel where the first started — that's what
// makes the loop seamless instead of snapping back.
function YearTicker({ years }: { years: (string | number)[] }) {
  // SIX copies, not two. The track slides -50% of itself, so each half must be
  // at least as wide as the viewport — otherwise the slide runs past the end of
  // the duplicated content and a blank gap appears before the loop restarts.
  // Nine years measure ~1143px per copy; three copies per half (~3429px) covers
  // everything up to an ultrawide desktop.
  const COPIES = 6;
  const items = Array.from({ length: COPIES }, () => years).flat();
  return (
    <div className="absolute inset-x-0 bottom-0 z-20 overflow-hidden border-y border-[#FFECCD]/40 bg-[#6E2600]/35 backdrop-blur-[4px]">
      <motion.div
        className="flex w-max py-3"
        animate={{ x: ["0%", "-50%"] }}
        // Duration scales with the copy count so the on-screen speed stays at
        // the reference's ~27px/s regardless of how many copies we render.
        transition={{ duration: 42 * (COPIES / 2), ease: "linear", repeat: Infinity }}
      >
        {items.map((y, i) => (
          <a
            key={i}
            href="#timeline"
            // aria-hidden on the duplicate half: it's a visual loop artifact,
            // screen readers shouldn't hear every year twice.
            aria-hidden={i >= years.length}
            tabIndex={i >= years.length ? -1 : undefined}
            className="flex items-center gap-[26px] px-[26px] text-[14px] font-bold tracking-[2.6px] text-[#FFF3DF] transition-colors hover:text-white"
          >
            {y}
            <span aria-hidden className="h-[5px] w-[5px] shrink-0 rounded-full bg-white/55" />
          </a>
        ))}
      </motion.div>
    </div>
  );
}

export function RssHero() {
  const { hero } = rssData;
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: false, amount: 0.2 });
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "16%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative flex h-[100svh] min-h-[640px] items-center justify-center overflow-hidden pt-32 pb-16 sm:pt-36 lg:pt-40"
      style={{
        backgroundImage:
          "linear-gradient(#FF7D0A 0%, #FF9526 34%, #FFB658 68%, #FFCF85 100%)",
      }}
    >
      {/* archival photo, blended into the saffron */}
      <motion.div className="absolute inset-0" style={{ y: imgY }}>
        <img
          src={hero.image}
          alt=""
          aria-hidden="true"
          className="h-full w-full scale-105 object-cover opacity-[0.22] mix-blend-multiply"
        />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-b from-[#B4530A]/35 via-transparent to-[#FFCF85]/45" />

      {/* chakra watermarks */}
      <Chakra
        className="-right-24 -top-24 h-[420px] w-[420px] opacity-[0.09]"
        stroke="#7A3305"
      />
      <Chakra
        className="-bottom-32 -left-28 h-[340px] w-[340px] opacity-[0.07]"
        stroke="#7A3305"
        duration={180}
      />

      {/* rising embers */}
      {inView &&
        [...Array(7)].map((_, i) => (
          <motion.span
            key={i}
            className="pointer-events-none absolute rounded-full bg-white/45"
            style={{
              width: 2 + (i % 3),
              height: 2 + (i % 3),
              left: `${10 + i * 12}%`,
              bottom: "12%",
            }}
            animate={{ y: [0, -(120 + i * 25)], opacity: [0, 0.6, 0] }}
            transition={{ duration: 6 + i, repeat: Infinity, ease: "easeOut", delay: i * 0.7 }}
          />
        ))}

      <motion.div
        className="relative z-10 mx-auto max-w-4xl px-4 text-center"
        style={{ opacity: contentOpacity }}
      >
        {/* kicker */}
        <motion.span
          className="inline-flex items-center gap-2.5 border border-white/40 bg-white/10 px-4 py-1.5 text-[11px] font-bold tracking-[0.28em] text-white backdrop-blur-sm"
          style={{ borderRadius: 3 }}
          initial={{ opacity: 0, y: 14 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          {hero.kicker}
        </motion.span>

        {/* title — word by word */}
        {/* Devanagari needs generous line-height + vertical padding: matras sit
            above/below the base line and get clipped by bg-clip-text otherwise. */}
        <h1 className="mt-5 text-[2.5rem] font-extrabold leading-[1.5] sm:text-6xl lg:text-[4.5rem]">
          {hero.title.split(" ").map((w, i) => (
            <motion.span
              key={i}
              className="mr-3 inline-block bg-gradient-to-b from-white to-[#FFE9C7] bg-clip-text text-transparent drop-shadow-[0_2px_14px_rgba(120,50,5,0.35)] last:mr-0"
              initial={{ opacity: 0, y: 46, filter: "blur(8px)" }}
              animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
              transition={{ duration: 0.85, delay: 0.15 + i * 0.13, ease: [0.16, 1, 0.3, 1] }}
            >
              {w}
            </motion.span>
          ))}
        </h1>

        <motion.p
          className="mt-3 text-sm font-medium tracking-wide text-white/90 sm:text-base lg:text-lg"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          {hero.subtitle}
        </motion.p>

        {/* CTAs */}
        <motion.div
          className="mt-6 flex flex-wrap items-center justify-center gap-3"
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.7, duration: 0.6 }}
        >
          <motion.a
            href={hero.ctaPrimary.href}
            className="group relative inline-flex items-center gap-2 overflow-hidden bg-white px-6 py-3 text-[15px] font-bold text-[#8A3B12] shadow-lg shadow-[#7A3305]/20"
            style={{ borderRadius: 3 }}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
          >
            <motion.span
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "linear-gradient(115deg, transparent 38%, rgba(255,125,10,0.16) 50%, transparent 62%)",
                backgroundSize: "220% 100%",
              }}
              animate={inView ? { backgroundPosition: ["-120% 0%", "220% 0%"] } : undefined}
              transition={{ duration: 2.6, repeat: Infinity, repeatDelay: 1.4, ease: "easeInOut" }}
            />
            {hero.ctaPrimary.label}
            <motion.span animate={{ y: [0, 3, 0] }} transition={{ duration: 1.6, repeat: Infinity }}>
              <ArrowDown className="h-4 w-4" />
            </motion.span>
          </motion.a>
          <motion.a
            href={hero.ctaSecondary.href}
            className="inline-flex items-center border border-white/60 px-6 py-3 text-[15px] font-semibold text-white backdrop-blur-sm"
            style={{ borderRadius: 3 }}
            whileHover={{ y: -2, backgroundColor: "rgba(255,255,255,0.14)" }}
            whileTap={{ scale: 0.97 }}
          >
            {hero.ctaSecondary.label}
          </motion.a>
        </motion.div>

        {/* stats */}
        <div className="mt-7 flex flex-wrap items-center justify-center">
          {hero.stats.map((s, i) => (
            <HeroStat key={s.label} {...s} delay={0.85 + i * 0.1} />
          ))}
        </div>

      </motion.div>

      {/* The years now live in the ticker bar below, so the static rail is gone. */}
      <YearTicker years={hero.yearRail} />

      <motion.div
        className="absolute bottom-[62px] left-1/2 flex -translate-x-1/2 flex-col items-center gap-1 text-white/80"
        animate={{ y: [0, 7, 0], opacity: [0.55, 1, 0.55] }}
        transition={{ duration: 1.9, repeat: Infinity, ease: "easeInOut" }}
      >
        <span className="text-[10px] font-semibold tracking-widest">{hero.scrollHint}</span>
        <ChevronDown className="h-4 w-4" />
      </motion.div>
    </section>
  );
}

/* ═══════════════ 2. आधार — white ═══════════════ */

export function FoundationSection() {
  const { foundation } = rssData;

  return (
    <section className="relative overflow-hidden bg-white py-14 sm:py-20">
      <Chakra className="-right-32 top-10 h-[380px] w-[380px] opacity-[0.045]" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center">
          <Kicker>{foundation.kicker}</Kicker>
          <motion.h2
            className="mt-3 text-3xl font-bold leading-[1.35] text-[#14213D] sm:text-[2.5rem]"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.5 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <Typewriter text={foundation.title} />
          </motion.h2>
          <motion.p
            className="mt-2 text-sm font-semibold text-[#8A3B12] sm:text-base"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: false, amount: 0.5 }}
            transition={{ delay: 0.15, duration: 0.6 }}
          >
            {foundation.subtitle}
          </motion.p>
          <motion.p
            className="mx-auto mt-5 max-w-3xl text-[15px] leading-loose text-[#3D4A66]"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.4 }}
            transition={{ delay: 0.2, duration: 0.7 }}
          >
            {foundation.intro}
          </motion.p>
        </div>

        {/* Archival image, capped at the asset's own width (source is 483px).
            It was sitting in a max-w-3xl (768px) box — a 1.59x upscale, which
            was both soft AND ~240px of dead section height. The dark mount is
            the reference's treatment for this one: a white border would vanish
            against a white section. */}
        <motion.figure
          className="group relative mx-auto mt-7 w-full max-w-[400px] p-3.5 pb-0"
          style={{
            borderRadius: 3,
            background: "linear-gradient(180deg,#1a2438,#101827)",
            boxShadow: "0 24px 56px rgba(10,30,63,0.32)",
          }}
          initial={{ opacity: 0, y: 34 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.25 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="relative overflow-hidden" style={{ borderRadius: 3 }}>
            <img
              src={foundation.image}
              alt={foundation.imageAlt}
              className="block h-auto w-full transition-transform duration-[1.2s] group-hover:scale-[1.04]"
            />
            <motion.span
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "linear-gradient(115deg, transparent 40%, rgba(255,255,255,0.28) 50%, transparent 60%)",
                backgroundSize: "220% 100%",
              }}
              animate={{ backgroundPosition: ["-120% 0%", "220% 0%"] }}
              transition={{ duration: 3.6, repeat: Infinity, repeatDelay: 2.6, ease: "easeInOut" }}
            />
            <figcaption className="absolute bottom-0 left-0 bg-[#14213D]/85 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#FFC98A] backdrop-blur-sm">
              {foundation.imageCaption}
            </figcaption>
          </div>
        </motion.figure>

        {/* three pillars */}
        <div className="mt-7 grid gap-5 md:grid-cols-3">
          {foundation.pillars.map((p, i) => (
            <motion.div
              key={p.title}
              className="group relative border-t-[3px] border-[#FF7D0A] bg-[#FFFBF6] p-5 transition-shadow hover:shadow-lg sm:p-6"
              style={{ borderRadius: 3 }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.35 }}
              transition={{ duration: 0.6, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -6 }}
            >
              <span className="pointer-events-none absolute right-3 top-2 select-none text-6xl font-extrabold leading-none text-[#FF7D0A]/[0.09]">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="relative text-xl font-bold leading-[1.45] text-[#14213D]">{p.title}</h3>
              <p className="relative mt-2.5 text-sm leading-relaxed text-[#3D4A66]">{p.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════ 3. संस्थापक — cream ═══════════════ */

export function FounderSection() {
  const { founder } = rssData;
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: false, amount: 0.2 });

  return (
    <section
      id="founder"
      ref={ref}
      className="relative overflow-hidden py-14 sm:py-20"
      style={{ backgroundImage: "linear-gradient(#FFF9F1, #FDF3E6)" }}
    >
      <Chakra className="-left-40 top-1/4 h-[460px] w-[460px] opacity-[0.05]" duration={170} />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center">
          <motion.p
            className="mx-auto max-w-2xl text-sm font-semibold text-[#8A3B12] sm:text-base"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.5 }}
            transition={{ duration: 0.65 }}
          >
            {founder.kicker}
          </motion.p>
        </div>

        {/* Reference puts the text left and the portrait right (560px / 572px,
            48px gutter). Ours had them flipped. Ordered rather than reordered in
            markup so the DOM keeps portrait-then-text for mobile stacking. */}
        <div className="mt-10 grid items-center gap-10 lg:grid-cols-2 lg:gap-12">
          {/* portrait */}
          <motion.div
            className="relative mx-auto max-w-sm lg:order-2"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* ghost year behind portrait */}
            <span className="pointer-events-none absolute -left-6 -top-10 select-none text-[7rem] font-extrabold leading-none text-[#FF7D0A]/[0.12]">
              {founder.birth.year}
            </span>
            <motion.figure
              className="group relative overflow-hidden border-[6px] border-white bg-white shadow-[0_20px_45px_-16px_rgba(120,60,10,0.4)]"
              style={{ borderRadius: 3 }}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.4 }}
            >
              <img src={founder.portrait} alt={founder.name} className="h-auto w-full object-cover" />
              <motion.span
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "linear-gradient(115deg, transparent 40%, rgba(255,255,255,0.3) 50%, transparent 60%)",
                  backgroundSize: "220% 100%",
                }}
                animate={inView ? { backgroundPosition: ["-120% 0%", "220% 0%"] } : undefined}
                transition={{ duration: 4, repeat: Infinity, repeatDelay: 2.6, ease: "easeInOut" }}
              />
            </motion.figure>
            {/* birth badge */}
            <motion.div
              className="absolute -bottom-5 right-2 bg-[#14213D] px-4 py-2.5 text-center shadow-xl"
              style={{ borderRadius: 3 }}
              initial={{ opacity: 0, scale: 0.85 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: false, amount: 0.6 }}
              transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.25 }}
            >
              <p className="text-[9px] font-semibold tracking-widest text-white/60">
                {founder.birth.prefix}
              </p>
              <p className="text-xl font-extrabold leading-none text-[#FFC98A]">
                {founder.birth.year}
              </p>
              <p className="mt-0.5 text-[10px] font-medium text-white/70">{founder.birth.place}</p>
            </motion.div>
          </motion.div>

          {/* text */}
          <div className="lg:order-1">
            <motion.p
              className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#8A3B12]"
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.5 }}
              transition={{ duration: 0.55 }}
            >
              {founder.label}
            </motion.p>
            <motion.h2
              className="mt-2 text-3xl font-bold leading-[1.35] text-[#14213D] sm:text-[2.4rem]"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.5 }}
              transition={{ duration: 0.7, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            >
              <Typewriter text={founder.name} />
            </motion.h2>
            <motion.span
              className="mt-3 block h-[3px] w-16 origin-left bg-[#FF7D0A]"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: false, amount: 0.6 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            />

            <div className="mt-5 space-y-3.5">
              {founder.paragraphs.map((p, i) => (
                <motion.p
                  key={i}
                  className="text-[15px] leading-loose text-[#3D4A66]"
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, amount: 0.3 }}
                  transition={{ duration: 0.6, delay: 0.1 + i * 0.08 }}
                >
                  {p}
                </motion.p>
              ))}
            </div>
          </div>
        </div>

        {/* closing full-width note */}
        <motion.div
          className="relative mt-10 border-l-[3px] border-[#FF7D0A] bg-white/70 p-5 backdrop-blur-sm sm:p-6"
          style={{ borderRadius: 3 }}
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.7 }}
        >
          <p className="text-[15px] leading-loose text-[#3D4A66]">{founder.closing}</p>
        </motion.div>
      </div>
    </section>
  );
}

/* ═══════════════ 4. विजयादशमी 1925 — dark ═══════════════ */

export function FoundingSection() {
  const { founding } = rssData;
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: false, amount: 0.2 });

  return (
    <section
      ref={ref}
      className="relative overflow-hidden py-14 sm:py-20"
      style={{
        backgroundImage:
          "radial-gradient(120% 100% at 75% 20%, #3A2413 0%, #23150A 55%, #150C05 100%)",
      }}
    >
      <div className="absolute inset-0">
        <img
          src={founding.image}
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover opacity-[0.14] mix-blend-luminosity"
        />
      </div>
      <Chakra
        className="-left-24 -top-20 h-[360px] w-[360px] opacity-[0.07]"
        stroke="#FFC98A"
        duration={160}
      />
      {inView &&
        [...Array(6)].map((_, i) => (
          <motion.span
            key={i}
            className="pointer-events-none absolute rounded-full bg-[#FF9526]/60"
            style={{ width: 2 + (i % 3), height: 2 + (i % 3), left: `${12 + i * 14}%`, bottom: "6%" }}
            animate={{ y: [0, -(130 + i * 22)], opacity: [0, 0.75, 0] }}
            transition={{ duration: 6.5 + i, repeat: Infinity, ease: "easeOut", delay: i * 0.9 }}
          />
        ))}

      <div className="relative mx-auto max-w-5xl px-4 text-center sm:px-6">
        <Kicker tone="cream">{founding.badge}</Kicker>
        <motion.h2
          className="mx-auto mt-4 max-w-3xl text-2xl font-bold leading-[1.4] text-[#FFC98A] sm:text-[2.5rem]"
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.5 }}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
        >
          <Typewriter text={founding.title} />
        </motion.h2>
        <motion.p
          className="mx-auto mt-5 max-w-3xl text-[15px] leading-loose text-[#E0CFB4]/80"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false, amount: 0.4 }}
          transition={{ delay: 0.15, duration: 0.7 }}
        >
          {founding.intro}
        </motion.p>
        <motion.p
          className="mx-auto mt-4 max-w-2xl text-sm font-semibold text-[#FFB658]"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false, amount: 0.4 }}
          transition={{ delay: 0.25, duration: 0.7 }}
        >
          {founding.subhead}
        </motion.p>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {founding.cards.map((c, i) => (
            <motion.div
              key={c.title}
              className="group relative h-full border-t-[3px] border-[#FF9526] bg-white/[0.06] p-5 text-left backdrop-blur-sm transition-colors hover:bg-white/[0.1]"
              style={{ borderRadius: 3 }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.6, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -6 }}
            >
              <motion.span
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "linear-gradient(115deg, transparent 38%, rgba(255,201,138,0.1) 50%, transparent 62%)",
                  backgroundSize: "220% 100%",
                }}
                animate={{ backgroundPosition: ["-120% 0%", "220% 0%"] }}
                transition={{ duration: 3.2, repeat: Infinity, repeatDelay: 1.8 + i * 0.4, ease: "easeInOut" }}
              />
              <span className="pointer-events-none absolute right-3 top-2 select-none text-6xl font-extrabold leading-none text-[#FFC98A]/[0.1]">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="relative text-lg font-bold leading-[1.45] text-white">{c.title}</h3>
              <p className="relative mt-2.5 text-sm leading-relaxed text-[#E0CFB4]/70">{c.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════ 5. 100 वर्ष + नेतृत्व — white ═══════════════ */

function BandStat({ value, label, i }: { value: string; label: string; i: number }) {
  return (
    <motion.div
      className="flex flex-col items-center border-l border-[#14213D]/10 px-5 first:border-l-0 sm:px-8"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.5 }}
      transition={{ duration: 0.55, delay: i * 0.1 }}
    >
      <span className="text-2xl font-extrabold leading-none text-[#FF7D0A] sm:text-4xl">
        <SlotNumber value={value} />
      </span>
      <span className="mt-1.5 text-[10px] font-semibold tracking-wider text-[#3D4A66] sm:text-xs">
        {label}
      </span>
    </motion.div>
  );
}

export function TimelineIntroSection() {
  const { timelineIntro, leadership } = rssData;

  return (
    <section className="relative overflow-hidden bg-white py-14 sm:py-20">
      <Chakra className="-right-36 bottom-10 h-[420px] w-[420px] opacity-[0.04]" duration={150} />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        {/* stats band */}
        <div className="flex flex-wrap items-center justify-center border-y border-[#14213D]/10 py-6">
          {timelineIntro.statsBand.map((s, i) => (
            <BandStat key={s.label} value={s.value} label={s.label} i={i} />
          ))}
        </div>

        <div className="mt-12 grid items-start gap-10 lg:grid-cols-2 lg:gap-14">
          <div>
            <motion.h2
              className="text-2xl font-bold leading-[1.4] text-[#14213D] sm:text-[2.6rem]"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.5 }}
              transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            >
              <Typewriter text={timelineIntro.title} />
            </motion.h2>
            <motion.span
              className="mt-3 block h-[3px] w-16 origin-left bg-[#FF7D0A]"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: false, amount: 0.6 }}
              transition={{ duration: 0.6, delay: 0.18 }}
            />
            <div className="mt-5 space-y-3.5">
              {timelineIntro.paragraphs.map((p, i) => (
                <motion.p
                  key={i}
                  className="text-[15px] leading-loose text-[#3D4A66]"
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, amount: 0.3 }}
                  transition={{ duration: 0.6, delay: 0.1 + i * 0.08 }}
                >
                  {p}
                </motion.p>
              ))}
            </div>
            <motion.p
              className="mt-5 border-l-[3px] border-[#FF7D0A] bg-[#FFF9F1] py-3.5 pl-4 pr-3 text-[15px] font-semibold leading-relaxed text-[#8A3B12]"
              style={{ borderRadius: 3 }}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, amount: 0.4 }}
              transition={{ duration: 0.65 }}
            >
              {timelineIntro.highlight}
            </motion.p>
          </div>

          <div>
            {/* Capped at the asset's own width (444px) — it was rendering at
                524px, a 1.18x upscale. White border + drop shadow is the
                reference's photo-print treatment, which our images were missing. */}
            <motion.figure
              className="group relative mx-auto w-full max-w-[444px] overflow-hidden border-[8px] border-white shadow-[0_22px_52px_rgba(10,30,63,0.22)]"
              style={{ borderRadius: 3 }}
              initial={{ opacity: 0, x: 34 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, amount: 0.25 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <img
                src={timelineIntro.image}
                alt={timelineIntro.imageAlt}
                className="h-auto w-full object-cover transition-transform duration-[1.2s] group-hover:scale-[1.04]"
              />
              <motion.span
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "linear-gradient(115deg, transparent 40%, rgba(255,255,255,0.26) 50%, transparent 60%)",
                  backgroundSize: "220% 100%",
                }}
                animate={{ backgroundPosition: ["-120% 0%", "220% 0%"] }}
                transition={{ duration: 3.8, repeat: Infinity, repeatDelay: 2.4, ease: "easeInOut" }}
              />
            </motion.figure>
            <motion.p
              className="mt-4 text-xs leading-relaxed text-[#3D4A66]/80"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: false, amount: 0.4 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              {timelineIntro.note}
            </motion.p>
          </div>
        </div>

        {/* leadership block */}
        <motion.div
          className="mt-14 overflow-hidden border border-[#14213D]/10 bg-[#FFFBF6]"
          style={{ borderRadius: 3 }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="grid gap-0 md:grid-cols-[1.15fr_1fr]">
            <div className="p-6 sm:p-8">
              <Kicker>{leadership.kicker}</Kicker>
              <div className="mt-4 flex items-baseline gap-3">
                <span className="text-4xl font-extrabold leading-none text-[#FF7D0A]">
                  {leadership.year}
                </span>
                <h3 className="text-lg font-bold leading-[1.45] text-[#14213D] sm:text-xl">
                  {leadership.title}
                </h3>
              </div>
              <p className="mt-3.5 text-sm leading-loose text-[#3D4A66]">{leadership.body}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {leadership.chips.map((c, i) => (
                  <motion.span
                    key={c}
                    className="border border-[#FF7D0A]/30 bg-white px-3 py-1.5 text-xs font-semibold text-[#8A3B12]"
                    style={{ borderRadius: 3 }}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, amount: 0.6 }}
                    transition={{ duration: 0.45, delay: 0.1 + i * 0.09 }}
                    whileHover={{ y: -2, borderColor: "rgba(255,125,10,0.8)" }}
                  >
                    {c}
                  </motion.span>
                ))}
              </div>
            </div>
            <figure
              className="group relative mx-auto w-full max-w-[488px] overflow-hidden border-[7px] border-white shadow-[0_18px_44px_rgba(80,40,10,0.2)]"
              style={{ borderRadius: 3 }}
            >
              <img
                src={leadership.image}
                alt={leadership.imageAlt}
                className="h-full min-h-[240px] w-full object-cover transition-transform duration-[1.2s] group-hover:scale-105"
              />
              <div className="absolute inset-x-0 bottom-0 flex flex-wrap gap-x-5 gap-y-1 bg-gradient-to-t from-[#14213D]/90 to-transparent px-4 pb-3 pt-10">
                {leadership.people.map((p) => (
                  <span key={p.name} className="text-[11px] font-semibold text-white/90">
                    <span className="text-[#FFC98A]">{p.role}</span> — {p.name}
                  </span>
                ))}
              </div>
            </figure>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ═══════════════ 6. समयरेखा — cream ═══════════════ */

// The reference keeps every timeline entry in the SAME arrangement — text left
// (right-aligned against the spine), image right. We were alternating on
// index % 2, which is what made the column read as ragged rather than as a
// timeline. Alternation removed; `index` now only staggers the entrance.
function YearEntry({ entry, index }: { entry: RssYear; index: number }) {
  const stagger = Math.min(index, 3) * 0.06;
  return (
    <div className="relative grid gap-5 lg:grid-cols-2 lg:gap-14">
      {/* node */}
      <div className="absolute left-4 top-2 z-10 -translate-x-1/2 lg:left-1/2">
        <motion.span
          className="relative block h-3.5 w-3.5 rotate-45 border-2 border-[#FF7D0A] bg-white"
          initial={{ scale: 0, rotate: 0 }}
          whileInView={{ scale: 1, rotate: 45 }}
          viewport={{ once: false, amount: 0.6 }}
          transition={{ type: "spring", stiffness: 320, damping: 18 }}
        >
          <motion.span
            className="pointer-events-none absolute inset-[-6px] border border-[#FF7D0A]/40"
            animate={{ scale: [1, 1.6, 1], opacity: [0.7, 0, 0.7] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.span>
      </div>

      {/* image */}
      <motion.div
        className="pl-12 lg:order-2 lg:pl-4"
        initial={{ opacity: 0, x: 36, scale: 0.96 }}
        whileInView={{ opacity: 1, x: 0, scale: 1 }}
        viewport={{ once: false, amount: 0.25 }}
        transition={{ duration: 0.7, delay: stagger, ease: [0.16, 1, 0.3, 1] }}
      >
        {entry.image ? (
          <motion.figure
            className="group relative overflow-hidden border-[6px] border-white shadow-[0_16px_34px_-14px_rgba(120,60,10,0.4)]"
            style={{ borderRadius: 3 }}
            whileHover={{ y: -5 }}
            transition={{ duration: 0.4 }}
          >
            <img
              src={entry.image}
              alt={entry.alt || entry.title}
              loading="lazy"
              className="h-auto w-full object-cover transition-transform duration-[1.2s] group-hover:scale-[1.05]"
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
            <figcaption className="absolute left-0 top-0 bg-[#14213D]/85 px-2.5 py-1 text-[11px] font-extrabold tracking-wider text-[#FFC98A] backdrop-blur-sm">
              {entry.year}
            </figcaption>
          </motion.figure>
        ) : (
          <div
            className="flex h-40 items-center justify-center border-[6px] border-white bg-[#FFF3E6] text-5xl font-extrabold text-[#FF7D0A]/25"
            style={{ borderRadius: 3 }}
          >
            {entry.year}
          </div>
        )}
      </motion.div>

      {/* text */}
      <motion.div
        className="pl-12 lg:order-1 lg:pl-0 lg:pr-4 lg:text-right"
        initial={{ opacity: 0, x: -36 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: false, amount: 0.25 }}
        transition={{ duration: 0.7, delay: 0.1 + stagger, ease: [0.16, 1, 0.3, 1] }}
      >
        <span className="block text-4xl font-extrabold leading-none text-[#FF7D0A] sm:text-5xl">
          <SlotNumber value={entry.year} />
        </span>
        <h3 className="mt-2 text-base font-bold leading-[1.5] text-[#14213D] sm:text-lg">
          {entry.title}
        </h3>
        {entry.lead && (
          <p className="mt-2 text-sm font-semibold leading-relaxed text-[#8A3B12]">{entry.lead}</p>
        )}
        <p className="mt-2.5 text-sm leading-loose text-[#3D4A66]">{entry.body}</p>
        {entry.caption && (
          <p
            className="mt-3 border-l-[3px] border-[#FF7D0A] bg-white/80 py-2.5 pl-3.5 pr-3 text-xs leading-relaxed text-[#8A3B12] sm:text-sm lg:border-l-0 lg:border-r-[3px] lg:pl-3 lg:pr-3.5"
            style={{ borderRadius: 3 }}
          >
            {entry.caption}
          </p>
        )}
      </motion.div>
    </div>
  );
}

export function TimelineSection() {
  const { timeline } = rssData;
  const [eraIndex, setEraIndex] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ["start 0.8", "end 0.65"],
  });
  const lineScale = useSpring(scrollYProgress, { stiffness: 90, damping: 26 });

  const era = rssEras[eraIndex];
  // Only the selected era renders — keeps 100 image-heavy entries off the DOM.
  const entries = useMemo(
    () => rssYears.filter((y) => y.year <= era.start && y.year >= era.end),
    [era],
  );

  const go = (dir: -1 | 1) => {
    setEraIndex((i) => Math.min(rssEras.length - 1, Math.max(0, i + dir)));
    listRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section
      id="timeline"
      className="relative overflow-hidden py-14 sm:py-20"
      style={{ backgroundImage: "linear-gradient(#FDF8F0, #FBF3E7)" }}
    >
      <Chakra className="-left-32 top-24 h-[400px] w-[400px] opacity-[0.05]" duration={165} />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center">
          <Kicker>{timeline.kicker}</Kicker>
          <motion.h2
            className="mt-3 text-3xl font-bold leading-[1.35] text-[#14213D] sm:text-[2.6rem]"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.5 }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          >
            <Typewriter text={timeline.title} />
          </motion.h2>
        </div>

        {/* era ribbon */}
        <div className="sticky top-16 z-30 -mx-4 mt-8 bg-[#FDF8F0]/90 px-4 py-3 backdrop-blur-md sm:top-20 sm:-mx-6 sm:px-6">
          <div className="flex items-center gap-2">
            <motion.button
              onClick={() => go(-1)}
              disabled={eraIndex === 0}
              className="flex h-9 w-9 flex-shrink-0 items-center justify-center border border-[#FF7D0A]/35 bg-white text-[#8A3B12] disabled:opacity-30"
              style={{ borderRadius: 3 }}
              whileHover={{ scale: eraIndex === 0 ? 1 : 1.08 }}
              whileTap={{ scale: 0.92 }}
              aria-label="पिछला कालखंड"
            >
              <ChevronLeft className="h-4 w-4" />
            </motion.button>

            <div className="scrollbar-hide flex flex-1 gap-2 overflow-x-auto">
              {rssEras.map((e, i) => {
                const active = i === eraIndex;
                return (
                  <motion.button
                    key={e.label}
                    onClick={() => setEraIndex(i)}
                    className={`relative flex-shrink-0 px-3.5 py-1.5 text-xs font-bold transition-colors sm:text-sm ${
                      active
                        ? "text-white"
                        : "border border-[#14213D]/12 bg-white text-[#3D4A66] hover:border-[#FF7D0A]/60 hover:text-[#8A3B12]"
                    }`}
                    style={{ borderRadius: 3 }}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                  >
                    {active && (
                      <motion.span
                        layoutId="rss-era-pill"
                        className="absolute inset-0 bg-[#FF7D0A] shadow-md shadow-[#FF7D0A]/30"
                        style={{ borderRadius: 3 }}
                        transition={{ type: "spring", stiffness: 400, damping: 32 }}
                      />
                    )}
                    <span className="relative z-10">{e.label}</span>
                  </motion.button>
                );
              })}
            </div>

            <motion.button
              onClick={() => go(1)}
              disabled={eraIndex === rssEras.length - 1}
              className="flex h-9 w-9 flex-shrink-0 items-center justify-center border border-[#FF7D0A]/35 bg-white text-[#8A3B12] disabled:opacity-30"
              style={{ borderRadius: 3 }}
              whileHover={{ scale: eraIndex === rssEras.length - 1 ? 1 : 1.08 }}
              whileTap={{ scale: 0.92 }}
              aria-label="अगला कालखंड"
            >
              <ChevronRight className="h-4 w-4" />
            </motion.button>
          </div>

          {/* active era + stop count */}
          <div className="mt-2 flex items-center gap-3">
            <span className="text-xs font-extrabold text-[#14213D]">{era.label}</span>
            <span className="text-[11px] font-semibold text-[#3D4A66]/70">
              {entries.length} {timeline.stopsLabel}
            </span>
            <div className="ml-auto h-[3px] w-32 overflow-hidden bg-[#FF7D0A]/15 sm:w-48">
              <motion.div
                className="h-full bg-[#FF7D0A]"
                animate={{ width: `${((eraIndex + 1) / rssEras.length) * 100}%` }}
                transition={{ type: "spring", stiffness: 180, damping: 28 }}
              />
            </div>
          </div>
        </div>

        {/* entries */}
        <div ref={listRef} className="relative mt-10 sm:mt-14">
          <div className="absolute bottom-0 left-4 top-0 w-px -translate-x-1/2 bg-[#FF7D0A]/20 lg:left-1/2" />
          <motion.div
            className="absolute left-4 top-0 w-[2px] origin-top -translate-x-1/2 bg-[#FF7D0A] shadow-[0_0_10px_rgba(255,125,10,0.5)] lg:left-1/2"
            style={{ scaleY: lineScale, height: "100%" }}
          />

          <AnimatePresence mode="wait">
            <motion.div
              key={era.label}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-12 sm:space-y-16"
            >
              {entries.map((e, i) => (
                <YearEntry key={e.year} entry={e} index={i} />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* footer nav */}
        <div className="mt-12 flex items-center justify-center gap-3">
          <motion.button
            onClick={() => go(-1)}
            disabled={eraIndex === 0}
            className="inline-flex items-center gap-1.5 border border-[#FF7D0A]/35 bg-white px-5 py-2.5 text-sm font-bold text-[#8A3B12] disabled:opacity-30"
            style={{ borderRadius: 3 }}
            whileHover={{ y: eraIndex === 0 ? 0 : -2 }}
            whileTap={{ scale: 0.97 }}
          >
            <ChevronLeft className="h-4 w-4" /> नया कालखंड
          </motion.button>
          <span className="text-xs font-bold text-[#3D4A66]/60">
            {eraIndex + 1} / {rssEras.length}
          </span>
          <motion.button
            onClick={() => go(1)}
            disabled={eraIndex === rssEras.length - 1}
            className="inline-flex items-center gap-1.5 bg-[#FF7D0A] px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-[#FF7D0A]/25 disabled:opacity-40"
            style={{ borderRadius: 3 }}
            whileHover={{ y: eraIndex === rssEras.length - 1 ? 0 : -2 }}
            whileTap={{ scale: 0.97 }}
          >
            पुराना कालखंड <ChevronRight className="h-4 w-4" />
          </motion.button>
        </div>
      </div>
    </section>
  );
}
