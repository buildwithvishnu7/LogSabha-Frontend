"use client";

import { useState } from "react";
import { motion, AnimatePresence, useInView } from "motion/react";
import { useRef } from "react";
import { ArrowDown, ArrowLeft, ArrowRight } from "lucide-react";
import { SlotNumber } from "@/components/motion/SlotNumber";
import { Typewriter } from "@/components/motion/Typewriter";
import {
  paHero,
  paSections,
  paInteractive,
  paResults,
  paFactors,
  type PaSection,
  type PaTheme,
} from "@/data/political-analysis";

/* Reference palette (Political Analysis.dc.html):
   navy #14213D · heading navy #1B3A6B · deep #0A1B33 / #0D2038
   body #1F2A44 · muted #54617C · saffron #E67300 / #A85200 / #FF8A00
   cream-on-dark #FFD9AE · panel #F2F5FA. Sharp 3px shapes throughout. */

const EASE = [0.16, 1, 0.3, 1] as const;

const THEME: Record<PaTheme, { wrap: string; heading: string; body: string; kicker: string }> = {
  light: { wrap: "bg-white", heading: "text-[#1B3A6B]", body: "text-[#1F2A44]", kicker: "text-[#A85200]" },
  panel: {
    wrap: "bg-[linear-gradient(#FFFFFF,#F2F5FA)]",
    heading: "text-[#1B3A6B]",
    body: "text-[#1F2A44]",
    kicker: "text-[#A85200]",
  },
  dark: {
    wrap: "bg-[#0A1B33] border-y-[3px] border-[#E67300]",
    heading: "text-white",
    body: "text-[#C9D6EA]",
    kicker: "text-[#FFD9AE]",
  },
  saffron: {
    wrap: "bg-[linear-gradient(#FFE0B8,#FFD199)] border-t-[3px] border-[#E67300]",
    heading: "text-[#0D2547]",
    body: "text-[#1F2A44]",
    kicker: "text-[#8A3B12]",
  },
};

function Kicker({ children, tone }: { children: React.ReactNode; tone: string }) {
  if (!children) return null;
  return (
    <motion.span
      className={`inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] ${tone}`}
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.6 }}
      transition={{ duration: 0.55 }}
    >
      <span className="h-px w-7 bg-current opacity-60" />
      {children}
    </motion.span>
  );
}

/* ═══════════════ hero ═══════════════ */

export function PaHero() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: false, amount: 0.2 });

  return (
    <section
      ref={ref}
      className="relative overflow-hidden pt-28 sm:pt-32"
      style={{ backgroundImage: "linear-gradient(#FFFFFF,#F2F5FA)" }}
    >
      <div className="relative z-10 mx-auto max-w-5xl px-4 pb-12 text-center sm:px-6 sm:pb-14">
        <h1
          className="text-[2.5rem] font-extrabold leading-[1.22] tracking-[1px] sm:text-[3.75rem] lg:text-[4.5rem] text-[#14213D]"
          aria-label={paHero.title}
        >
          {paHero.title.split(" ").map((w, i) => (
            <motion.span
              key={i}
              aria-hidden
              className="mr-4 inline-block last:mr-0"
              initial={{ opacity: 0, y: 40, filter: "blur(7px)" }}
              animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
              transition={{ duration: 0.8, delay: 0.12 + i * 0.14, ease: EASE }}
            >
              {w}
            </motion.span>
          ))}
        </h1>

        <motion.p
          className="mx-auto mt-6 max-w-3xl text-[15px] leading-loose text-[#41506D] sm:text-base"
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.5 }}
        >
          The 2024 Lok Sabha election, read end to end — the contest, the parties, the issues that
          moved votes, and the arithmetic that decided the result.
        </motion.p>

        <motion.a
          href="#results"
          className="group relative mt-8 inline-flex items-center gap-2 overflow-hidden bg-[#E67300] px-6 py-3 text-[13px] font-bold tracking-[1.5px] text-white"
          style={{ borderRadius: 3 }}
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.62 }}
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
          JUMP TO 2024 RESULTS
          <motion.span animate={{ y: [0, 3, 0] }} transition={{ duration: 1.6, repeat: Infinity }}>
            <ArrowDown className="h-4 w-4" />
          </motion.span>
        </motion.a>
      </div>

      <motion.div
        className="relative z-0 w-full"
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.9, delay: 0.4, ease: EASE }}
      >
        <img
          src={paHero.image}
          alt={paHero.imageAlt || "Campaign crowd"}
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

/* ═══════════════ generic prose section ═══════════════ */

export function PaProse({ section, id }: { section: PaSection; id?: string }) {
  const t = THEME[section.theme] ?? THEME.light;
  const img = section.images[0];

  return (
    <section id={id ?? section.id} className={`scroll-mt-24 py-14 sm:py-20 ${t.wrap}`}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-3xl">
          <Kicker tone={t.kicker}>{section.kicker}</Kicker>
          <motion.h2
            className={`mt-3 text-2xl font-bold leading-[1.25] sm:text-[2.4rem] ${t.heading}`}
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.5 }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <Typewriter text={section.title} />
          </motion.h2>
        </div>

        <div
          className={`mt-8 grid gap-10 ${img ? "lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)] lg:gap-14" : ""}`}
        >
          <div>
            {section.paragraphs.map((p, i) => (
              <motion.p
                key={i}
                className={`text-[15px] leading-loose ${t.body} ${i ? "mt-4" : ""}`}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.3 }}
                transition={{ duration: 0.6, delay: Math.min(i, 3) * 0.08 }}
              >
                {p}
              </motion.p>
            ))}

            {section.blocks.length > 0 && (
              <ul className="mt-7 space-y-3">
                {section.blocks.map((b, i) => (
                  <motion.li
                    key={b.title + i}
                    className={`border-l-[3px] px-5 py-4 ${
                      section.theme === "dark"
                        ? "border-[#FF8A00]/50 bg-white/[0.045]"
                        : "border-[#E67300]/35 bg-white shadow-[0_1px_0_rgba(20,33,61,0.06)]"
                    }`}
                    style={{ borderRadius: 3 }}
                    initial={{ opacity: 0, x: 22 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: false, amount: 0.35 }}
                    transition={{ duration: 0.55, delay: Math.min(i, 5) * 0.07, ease: EASE }}
                    whileHover={{ x: 4 }}
                  >
                    <h3
                      className={`text-base font-bold leading-snug ${
                        section.theme === "dark" ? "text-white" : "text-[#1B3A6B]"
                      }`}
                    >
                      {b.title}
                    </h3>
                    {b.body && (
                      <p className={`mt-2 text-sm leading-loose ${section.theme === "dark" ? "text-[#C9D6EA]" : "text-[#54617C]"}`}>
                        {b.body}
                      </p>
                    )}
                  </motion.li>
                ))}
              </ul>
            )}
          </div>

          {img && (
            <motion.figure
              className="group relative self-start overflow-hidden lg:sticky lg:top-24"
              style={{ borderRadius: 3 }}
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.25 }}
              transition={{ duration: 0.8, ease: EASE }}
            >
              <img
                src={img.src}
                alt={img.alt}
                loading="lazy"
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
          )}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════ party selector ═══════════════ */

export function PaParties({ section }: { section: PaSection }) {
  const parties = paInteractive.parties;
  const [active, setActive] = useState(0);
  const p = parties[active];

  return (
    <section id="parties" className="scroll-mt-24 bg-[linear-gradient(#FFFFFF,#E8EDF6)] py-14 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Kicker tone="text-[#A85200]">{section.kicker || "WHO CONTESTED"}</Kicker>
        <motion.h2
          className="mt-3 text-2xl font-bold leading-[1.25] text-[#1B3A6B] sm:text-[2.4rem]"
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.5 }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <Typewriter text={section.title} />
        </motion.h2>
        <p className="mt-2 text-sm text-[#54617C]">Select a party to read the analysis.</p>

        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,360px)_minmax(0,1fr)] lg:gap-12">
          {/* party list */}
          <div className="space-y-2.5">
            {parties.map((party, i) => (
              <motion.button
                key={party.short}
                onClick={() => setActive(i)}
                aria-pressed={i === active}
                className={`relative flex w-full items-center gap-3.5 border px-4 py-3.5 text-left transition-colors ${
                  i === active ? "border-transparent bg-white" : "border-[#14213D]/10 bg-white/55 hover:bg-white"
                }`}
                style={{ borderRadius: 3 }}
                initial={{ opacity: 0, x: -22 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false, amount: 0.4 }}
                transition={{ duration: 0.5, delay: i * 0.06, ease: EASE }}
                whileHover={{ x: 3 }}
              >
                {i === active && (
                  <motion.span
                    layoutId="pa-party-active"
                    className="absolute inset-0 -z-10 shadow-[0_10px_28px_-12px_rgba(20,33,61,0.4)]"
                    style={{ borderRadius: 3, borderLeft: `3px solid ${party.accent}` }}
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  />
                )}
                <span
                  className="grid h-10 w-10 shrink-0 place-items-center text-[13px] font-extrabold"
                  style={{ color: party.accent, background: `${party.accent}1A`, borderRadius: 3 }}
                >
                  {party.short.replace(/.*\(([^)]+)\).*/, "$1").slice(0, 4)}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-[15px] font-bold text-[#1B3A6B]">{party.short}</span>
                  <span className="block text-[11px] font-semibold tracking-wider text-[#54617C]">
                    {party.role}
                  </span>
                </span>
              </motion.button>
            ))}
          </div>

          {/* panel */}
          <div className="relative min-h-[320px] bg-white p-6 shadow-[0_16px_40px_-24px_rgba(20,33,61,0.45)] sm:p-8" style={{ borderRadius: 3 }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.4, ease: EASE }}
              >
                <span
                  className="text-[11px] font-bold uppercase tracking-[0.22em]"
                  style={{ color: p.accent }}
                >
                  {p.role}
                </span>
                <h3 className="mt-2 text-xl font-extrabold leading-snug text-[#1B3A6B] sm:text-2xl">
                  {p.short}
                </h3>
                <span className="mt-3 block h-[3px] w-14" style={{ background: p.accent }} />
                <p className="mt-4 text-[15px] leading-loose text-[#1F2A44]">{p.text}</p>
                {p.leaders?.length > 0 && (
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {p.leaders.map((l) => (
                      <li
                        key={l}
                        className="border border-[#14213D]/12 bg-[#F2F5FA] px-3 py-1.5 text-[12px] font-semibold text-[#1B3A6B]"
                        style={{ borderRadius: 3 }}
                      >
                        {l}
                      </li>
                    ))}
                  </ul>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════ issue tabs ═══════════════ */

export function PaIssues({ section }: { section: PaSection }) {
  const issues = paInteractive.issues;
  const [active, setActive] = useState(0);

  return (
    <section className="border-t-[3px] border-[#E67300] bg-[linear-gradient(#FFE0B8,#FFD199)] py-14 sm:py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <motion.h2
          className="text-2xl font-bold leading-[1.25] text-[#0D2547] sm:text-[2.4rem]"
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.5 }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <Typewriter text={section.title} />
        </motion.h2>

        <div className="mt-7 flex flex-wrap gap-2">
          {issues.map((it, i) => (
            <button
              key={it.label}
              onClick={() => setActive(i)}
              aria-pressed={i === active}
              className={`relative px-4 py-2 text-[13px] font-bold transition-colors ${
                i === active ? "text-white" : "text-[#23477F] hover:text-[#0D2547]"
              }`}
              style={{ borderRadius: 3 }}
            >
              {i === active && (
                <motion.span
                  layoutId="pa-issue-active"
                  className="absolute inset-0 -z-10 bg-[#0D2547]"
                  style={{ borderRadius: 3 }}
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                />
              )}
              {it.label}
            </button>
          ))}
        </div>

        <div className="relative mt-6 min-h-[150px] bg-white/70 p-6 backdrop-blur-sm sm:p-7" style={{ borderRadius: 3 }}>
          <AnimatePresence mode="wait">
            <motion.p
              key={active}
              className="text-[15px] leading-loose text-[#1F2A44]"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35, ease: EASE }}
            >
              {issues[active].body}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════ key factors stepper ═══════════════ */

export function PaFactors({ section }: { section: PaSection }) {
  const [i, setI] = useState(0);
  const f = paFactors[i];
  const go = (d: number) => setI((v) => (v + d + paFactors.length) % paFactors.length);

  return (
    <section className="relative overflow-hidden border-y-[3px] border-[#E67300] bg-[#0D2038] py-14 sm:py-20">
      {/* Oversized ghost number — the reference's signature device for this block. */}
      <span
        aria-hidden
        className="pointer-events-none absolute right-4 top-6 select-none text-[8rem] font-extrabold leading-none text-[#FF8A00]/[0.13] sm:text-[10rem]"
      >
        {f.n}
      </span>

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <Kicker tone="text-[#FFD9AE]">{section.kicker || "WHAT MOVED THE VERDICT"}</Kicker>
        <motion.h2
          className="mt-3 text-2xl font-bold leading-[1.25] text-white sm:text-[2.4rem]"
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.5 }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <Typewriter text={section.title} />
        </motion.h2>

        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,300px)_minmax(0,1fr)] lg:gap-12">
          {/* index rail */}
          <ul className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0">
            {paFactors.map((x, n) => (
              <li key={x.n} className="shrink-0 lg:shrink">
                <button
                  onClick={() => setI(n)}
                  aria-pressed={n === i}
                  className={`relative flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors ${
                    n === i ? "text-white" : "text-[#9FB2CC] hover:text-white"
                  }`}
                  style={{ borderRadius: 3 }}
                >
                  {n === i && (
                    <motion.span
                      layoutId="pa-factor-active"
                      className="absolute inset-0 -z-10 bg-white/[0.07]"
                      style={{ borderRadius: 3, borderLeft: "3px solid #FF8A00" }}
                      transition={{ type: "spring", stiffness: 420, damping: 34 }}
                    />
                  )}
                  <span className="text-[12px] font-extrabold text-[#FFC98A]">{x.n}</span>
                  <span className="truncate text-[13px] font-semibold">{x.title}</span>
                </button>
              </li>
            ))}
          </ul>

          {/* active factor */}
          <div className="min-h-[340px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.4, ease: EASE }}
              >
                <span className="text-5xl font-extrabold leading-none text-[#FF8A00]/70">
                  <SlotNumber value={f.n} />
                </span>
                <h3 className="mt-3 text-xl font-bold leading-snug text-white sm:text-2xl">{f.title}</h3>
                <p className="mt-3 text-[15px] leading-loose text-[#C9D6EA]">{f.lead}</p>
                {f.points?.length > 0 && (
                  <ul className="mt-5 space-y-2.5">
                    {f.points.map((pt, n) => (
                      <motion.li
                        key={n}
                        className="flex gap-3 border-l-[3px] border-[#FF8A00]/45 bg-white/[0.045] px-4 py-3 text-sm leading-loose text-[#C9D6EA]"
                        style={{ borderRadius: 3 }}
                        initial={{ opacity: 0, x: 18 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.08 + n * 0.06 }}
                      >
                        <span className="mt-[3px] text-[11px] font-extrabold text-[#FFC98A]">
                          {String(n + 1).padStart(2, "0")}
                        </span>
                        <span>{pt}</span>
                      </motion.li>
                    ))}
                  </ul>
                )}
              </motion.div>
            </AnimatePresence>

            <div className="mt-7 flex items-center gap-4">
              <button
                onClick={() => go(-1)}
                className="inline-flex items-center gap-2 text-[13px] font-bold text-[#FFC98A] transition-colors hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" /> PREVIOUS
              </button>
              <span className="text-[13px] text-[#8FA3C0]">
                {String(i + 1).padStart(2, "0")} / {String(paFactors.length).padStart(2, "0")}
              </span>
              <button
                onClick={() => go(1)}
                className="inline-flex items-center gap-2 text-[13px] font-bold text-[#FFC98A] transition-colors hover:text-white"
              >
                NEXT <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════ 2024 results ═══════════════ */

const BLOC: Record<string, string> = { nda: "#E67300", india: "#23477F", other: "#8794AC" };

export function PaResults() {
  const r = paResults;
  const max = Math.max(...r.seatChart.rows.map((x) => x.seats));

  return (
    <section id="overall-results" className="scroll-mt-24 bg-white py-14 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Kicker tone="text-[#A85200]">{r.kicker}</Kicker>
        <motion.h2
          className="mt-3 text-2xl font-bold leading-[1.25] text-[#1B3A6B] sm:text-[2.6rem]"
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.5 }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <Typewriter text={r.title} />
        </motion.h2>

        {/* headline stats */}
        <div className="mt-8 grid gap-5 sm:grid-cols-3">
          {r.stats.map((s, i) => (
            <motion.div
              key={s.label}
              className="border-l-[3px] border-[#E67300] bg-[#F2F5FA] px-5 py-5"
              style={{ borderRadius: 3 }}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.5 }}
              transition={{ duration: 0.55, delay: i * 0.09, ease: EASE }}
            >
              <span className="block text-4xl font-extrabold leading-none text-[#1B3A6B] sm:text-[2.75rem]">
                <SlotNumber value={s.value} />
              </span>
              <span className="mt-2 block text-[11px] font-bold tracking-[0.14em] text-[#23477F]">
                {s.label}
              </span>
            </motion.div>
          ))}
        </div>

        <motion.p
          className="mt-7 max-w-3xl text-[15px] leading-loose text-[#1F2A44]"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.4 }}
          transition={{ duration: 0.6 }}
        >
          <span className="mr-2 text-[11px] font-bold tracking-[0.18em] text-[#0D2547]">
            {r.leadKicker}
          </span>
          {r.lead}
        </motion.p>

        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)] lg:gap-14">
          {/* turnout */}
          <motion.div
            className="self-start border border-[#14213D]/10 bg-[#F2F5FA] p-6"
            style={{ borderRadius: 3 }}
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.4 }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <h3 className="text-xl font-bold text-[#23477F]">{r.turnout.title}</h3>
            <span className="mt-2 block text-5xl font-extrabold leading-none text-[#1B3A6B]">
              <SlotNumber value={`${r.turnout.value}${r.turnout.suffix}`} />
            </span>
            <span className="mt-1.5 block text-[11px] font-bold tracking-[0.16em] text-[#23477F]">
              {r.turnout.label}
            </span>
            <p className="mt-4 text-sm leading-loose text-[#1F2A44]">{r.turnout.body}</p>
          </motion.div>

          {/* seat chart */}
          <div>
            <span className="text-[11px] font-bold tracking-[0.2em] text-[#14213D]">
              {r.seatChart.kicker}
            </span>
            <h3 className="mt-1.5 text-2xl font-bold text-[#1B3A6B]">{r.seatChart.title}</h3>
            <p className="mt-1.5 text-sm text-[#54617C]">{r.seatChart.note}</p>

            <ul className="mt-5 space-y-2.5">
              {r.seatChart.rows.map((row, i) => (
                <li key={row.party} className="flex items-center gap-3">
                  <span className="w-20 shrink-0 text-[13px] font-semibold text-[#1F2A44]">
                    {row.party}
                  </span>
                  <span className="relative h-6 flex-1 overflow-hidden bg-[#F2F5FA]" style={{ borderRadius: 3 }}>
                    <motion.span
                      className="absolute inset-y-0 left-0"
                      style={{ background: BLOC[row.bloc] ?? BLOC.other, borderRadius: 3 }}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${(row.seats / max) * 100}%` }}
                      viewport={{ once: false, amount: 0.6 }}
                      transition={{ duration: 0.9, delay: i * 0.05, ease: EASE }}
                    />
                  </span>
                  <span className="w-10 shrink-0 text-right text-[13px] font-extrabold text-[#1B3A6B]">
                    <SlotNumber value={row.seats} digitWidth="0.56em" />
                  </span>
                </li>
              ))}
            </ul>

            <p className="mt-4 text-[12px] font-bold tracking-[0.14em] text-[#23477F]">
              MAJORITY AT {r.seatChart.majorityAt}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════ page composition ═══════════════ */

// Reference order. Three sections are interactive in the reference (party
// selector, issue tabs, factor stepper) and are swapped in by id; the rest
// render through the shared prose renderer.
const INTERACTIVE = new Set(["pa-3", "pa-5", "pa-11"]);

export function PaBody() {
  return (
    <>
      {paSections.map((s) => {
        if (s.id === "pa-3") return <PaParties key={s.id} section={s} />;
        if (s.id === "pa-5") return <PaIssues key={s.id} section={s} />;
        if (s.id === "pa-11") return <PaFactors key={s.id} section={s} />;
        if (s.id === "pa-12") return <PaResults key={s.id} />;
        if (INTERACTIVE.has(s.id)) return null;
        return <PaProse key={s.id} section={s} id={s.id === "pa-10" ? "results" : undefined} />;
      })}
    </>
  );
}
