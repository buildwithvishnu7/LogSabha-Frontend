"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { motion, useInView } from "motion/react";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp } from "lucide-react";
import { SlotNumber } from "@/components/motion/SlotNumber";
import { museumData, MUSEUM } from "@/data/rss-museum";
import { rssEras, rssYears, type RssYear } from "@/data/rss-timeline";

/* Aged-paper museum system from the reference — intentionally NOT the /rss
   saffron-and-navy, because this is the same century shown a different way.
   paper #F2E9DB · mat #FDF8EE · ink #3B2F26 · seal #7C1D1D · gold #B8892F */

const EASE = [0.16, 1, 0.3, 1] as const;

/* ═══════════════ hero ═══════════════ */

function MuseumHero() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: false, amount: 0.2 });
  const { hero } = museumData;

  return (
    <section
      ref={ref}
      id="top"
      className="relative overflow-hidden pt-28 pb-16 sm:pt-32 sm:pb-20"
      style={{ background: MUSEUM.paper }}
    >
      <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6">
        {/* three tilted frames, drifting like pictures hung slightly loose */}
        <div className="mb-9 flex items-end justify-center gap-5 sm:gap-8">
          {hero.previews.map((p, i) => (
            <motion.figure
              key={p.year}
              className="relative"
              style={{
                background: MUSEUM.mat,
                padding: "9px 9px 26px",
                boxShadow: "0 12px 26px rgba(88,60,28,0.22)",
              }}
              initial={{ opacity: 0, y: 26, rotate: 0 }}
              animate={
                inView
                  ? { opacity: 1, y: [0, -5, 0], rotate: p.rotate }
                  : { opacity: 0, y: 26, rotate: 0 }
              }
              transition={{
                opacity: { duration: 0.7, delay: 0.1 + i * 0.14 },
                rotate: { duration: 0.7, delay: 0.1 + i * 0.14, ease: EASE },
                y: { duration: p.drift, delay: p.delay, repeat: Infinity, ease: "easeInOut" },
              }}
            >
              <img
                src={p.image}
                alt=""
                aria-hidden
                width={132}
                height={96}
                className="block h-[74px] w-[104px] object-cover sm:h-24 sm:w-[132px]"
                style={{ filter: "sepia(.32) contrast(1.03)" }}
              />
              <figcaption
                className="absolute inset-x-0 bottom-1.5 text-center text-[11px] font-bold tracking-[0.14em]"
                style={{ color: MUSEUM.muted }}
              >
                {p.year}
              </figcaption>
            </motion.figure>
          ))}
        </div>

        <motion.span
          className="text-[11px] font-bold uppercase tracking-[0.26em]"
          style={{ color: MUSEUM.gold }}
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.45 }}
        >
          {hero.kicker}
        </motion.span>

        {/* Devanagari display type: generous leading so matras clear the box */}
        <motion.p
          className="mt-4 text-xl leading-[1.5] sm:text-2xl"
          style={{ color: MUSEUM.muted }}
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.55 }}
        >
          {hero.titleTop}
        </motion.p>

        <h1
          className="text-[3.25rem] font-extrabold leading-[1.35] sm:text-[5rem] lg:text-[6.5rem]"
          style={{ color: MUSEUM.ink }}
          aria-label={`${hero.titleTop} ${hero.titleMain}`}
        >
          <motion.span
            aria-hidden
            className="inline-block"
            initial={{ opacity: 0, y: 34, filter: "blur(8px)" }}
            animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
            transition={{ duration: 0.9, delay: 0.62, ease: EASE }}
          >
            {hero.titleMain}
          </motion.span>
        </h1>

        <motion.p
          className="mx-auto mt-5 max-w-2xl text-[15px] leading-loose sm:text-base"
          style={{ color: MUSEUM.muted }}
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.8 }}
        >
          {hero.subtitle}
        </motion.p>

        <motion.div
          className="mt-8 flex flex-wrap items-center justify-center gap-4"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.95 }}
        >
          <a
            href="#gallery"
            className="inline-flex h-10 w-10 items-center justify-center border"
            style={{ borderColor: MUSEUM.rule, color: MUSEUM.ink, borderRadius: 3 }}
            aria-label="दीर्घा तक जाएँ"
          >
            <motion.span animate={{ y: [0, 4, 0] }} transition={{ duration: 1.7, repeat: Infinity }}>
              <ArrowDown className="h-4 w-4" />
            </motion.span>
          </a>
          <Link
            href={hero.timelineLink.href}
            className="text-[13px] font-bold underline-offset-4 transition-colors hover:underline"
            style={{ color: MUSEUM.seal }}
          >
            {hero.timelineLink.label} →
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

/* ═══════════════ gallery ═══════════════ */

function Frame({ entry, i }: { entry: RssYear; i: number }) {
  // Alternate the hang angle so the wall reads as hand-placed, not a grid.
  const tilt = i % 2 === 0 ? -1.1 : 1.3;

  return (
    <motion.figure
      className="group relative"
      style={{
        background: MUSEUM.mat,
        padding: "12px 12px 34px",
        boxShadow: "0 14px 30px rgba(88,60,28,0.2)",
      }}
      initial={{ opacity: 0, y: 26, rotate: 0 }}
      whileInView={{ opacity: 1, y: 0, rotate: tilt }}
      viewport={{ once: false, amount: 0.25 }}
      transition={{ duration: 0.7, delay: Math.min(i, 5) * 0.08, ease: EASE }}
      whileHover={{ rotate: 0, y: -6, boxShadow: "0 22px 44px rgba(88,60,28,0.28)" }}
    >
      <span className="block overflow-hidden">
        <img
          src={entry.image}
          alt={entry.alt || entry.title}
          loading="lazy"
          className="block aspect-[4/3] w-full object-cover transition-transform duration-[1.3s] group-hover:scale-[1.04]"
          style={{ filter: "sepia(.22) contrast(1.04)" }}
        />
      </span>

      <span
        className="pointer-events-none absolute left-3 top-3 px-2 py-0.5 text-[11px] font-extrabold tracking-wider"
        style={{ background: MUSEUM.seal, color: "#FDF6EA" }}
      >
        {entry.year}
      </span>

      <figcaption className="px-1 pt-3">
        <h3
          className="text-[15px] font-bold leading-[1.5] sm:text-base"
          style={{ color: MUSEUM.ink }}
        >
          {entry.title}
        </h3>
        {entry.body && (
          <p className="mt-2 text-[13px] leading-loose" style={{ color: MUSEUM.muted }}>
            {entry.body}
          </p>
        )}
        {entry.caption && (
          <p
            className="mt-2 border-t pt-2 text-[12px] italic leading-relaxed"
            style={{ borderColor: MUSEUM.rule, color: MUSEUM.faint }}
          >
            {entry.caption}
          </p>
        )}
      </figcaption>
    </motion.figure>
  );
}

function Gallery() {
  const [eraIndex, setEraIndex] = useState(0);
  const era = rssEras[eraIndex];
  const { gallery } = museumData;

  // Only the selected era is mounted — a hundred framed photographs at once
  // would be a very heavy wall.
  const entries = useMemo(
    () => rssYears.filter((y) => y.year <= era.start && y.year >= era.end),
    [era],
  );

  const go = (d: number) => {
    const next = Math.min(Math.max(eraIndex + d, 0), rssEras.length - 1);
    setEraIndex(next);
    document.getElementById("gallery")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section
      id="gallery"
      className="scroll-mt-20 py-14 sm:py-20"
      style={{ background: MUSEUM.paper }}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* era ribbon */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2
              className="text-2xl font-extrabold leading-[1.35] tabular-nums sm:text-[2rem]"
              style={{ color: MUSEUM.ink }}
            >
              {era.label}
            </h2>
            <p className="mt-1 text-[13px]" style={{ color: MUSEUM.faint }}>
              <SlotNumber value={entries.length} digitWidth="0.55em" /> {gallery.countSuffix} ·{" "}
              {eraIndex + 1}/{rssEras.length}
            </p>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {rssEras.map((e, i) => (
              <button
                key={e.label}
                onClick={() => setEraIndex(i)}
                aria-pressed={i === eraIndex}
                className="relative px-2.5 py-1 text-[11px] font-bold tabular-nums transition-colors"
                style={{ color: i === eraIndex ? "#FDF6EA" : MUSEUM.muted, borderRadius: 2 }}
              >
                {i === eraIndex && (
                  <motion.span
                    layoutId="museum-era-pill"
                    className="absolute inset-0 -z-10"
                    style={{ background: MUSEUM.seal, borderRadius: 2 }}
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  />
                )}
                {e.start}
              </button>
            ))}
          </div>
        </div>

        <span className="mt-5 block h-px w-full" style={{ background: MUSEUM.rule }} />

        {/* the wall — no AnimatePresence, so switching eras never leaves the
            previous era's frames hanging while an exit animation resolves */}
        <div className="mt-9 grid gap-8 sm:gap-10 lg:grid-cols-2 lg:gap-x-[86px]">
          {entries.map((entry, i) => (
            <Frame key={entry.year} entry={entry} i={i} />
          ))}
        </div>

        {/* era pager */}
        <div className="mt-12 flex flex-wrap items-center justify-between gap-4">
          <button
            onClick={() => go(-1)}
            disabled={eraIndex === 0}
            className="inline-flex items-center gap-2 text-[13px] font-bold transition-colors disabled:opacity-35"
            style={{ color: MUSEUM.seal }}
          >
            <ArrowLeft className="h-4 w-4" /> {gallery.prev}
          </button>

          <a
            href="#top"
            className="inline-flex items-center gap-2 text-[13px] font-bold"
            style={{ color: MUSEUM.muted }}
          >
            <ArrowUp className="h-4 w-4" /> {gallery.top}
          </a>

          <button
            onClick={() => go(1)}
            disabled={eraIndex === rssEras.length - 1}
            className="inline-flex items-center gap-2 text-[13px] font-bold transition-colors disabled:opacity-35"
            style={{ color: MUSEUM.seal }}
          >
            {gallery.next} <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}

export function MuseumPage() {
  return (
    <>
      <MuseumHero />
      <Gallery />
    </>
  );
}
