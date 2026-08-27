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
   navy #0A0A0A · heading navy #0A0A0A · deep #061428 / #061428
   body #6B7280 · muted #9CA3AF · saffron #FF9933 / #E87D12 / #F97316
   cream-on-dark #FFC27A · panel #F5F5F5. Sharp 3px shapes throughout. */

const EASE = [0.16, 1, 0.3, 1] as const;

const THEME: Record<PaTheme, { wrap: string; heading: string; body: string; kicker: string }> = {
  light: { wrap: "bg-white", heading: "text-[#0A0A0A]", body: "text-[#6B7280]", kicker: "text-[#E87D12]" },
  panel: {
    wrap: "bg-[linear-gradient(#FFFFFF,#F5F5F5)]",
    heading: "text-[#0A0A0A]",
    body: "text-[#6B7280]",
    kicker: "text-[#E87D12]",
  },
  dark: {
    wrap: "bg-[#061428] border-y-[3px] border-[#FF9933]",
    heading: "text-white",
    body: "text-[#9CA3AF]",
    kicker: "text-[#FFC27A]",
  },
  saffron: {
    wrap: "bg-[linear-gradient(#FFF4E6,#FDE68A)] border-t-[3px] border-[#FF9933]",
    heading: "text-[#0A0A0A]",
    body: "text-[#6B7280]",
    kicker: "text-[#E87D12]",
  },
};

function Kicker({ children, tone }: { children: React.ReactNode; tone: string }) {
  if (!children) return null;
  return (
    <motion.span
      className={`inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-wide ${tone}`}
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
      style={{ backgroundImage: "linear-gradient(#FFFFFF,#F5F5F5)" }}
    >
      <div className="relative z-10 mx-auto max-w-5xl px-4 pb-12 text-center sm:px-6 sm:pb-14">
        <h1
          className="text-3xl font-extrabold leading-[1.2] tracking-tight text-[#0A0A0A] sm:text-4xl"
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
          className="mx-auto mt-6 max-w-3xl text-sm leading-relaxed text-[#6B7280] sm:text-base"
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.5 }}
        >
          The 2024 Lok Sabha election, read end to end — the contest, the parties, the issues that
          moved votes, and the arithmetic that decided the result.
        </motion.p>

        <motion.a
          href="#results"
          className="group relative mt-8 inline-flex items-center gap-2 overflow-hidden rounded-full bg-[#FF9933] px-6 py-3 text-[13px] font-bold tracking-wide text-white shadow-[0_0_20px_rgba(255,153,51,0.5)]"
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
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6">
        <div className="max-w-3xl">
          <Kicker tone={t.kicker}>{section.kicker}</Kicker>
          <motion.h2
            className={`mt-3 text-2xl font-bold leading-[1.25] sm:text-3xl ${t.heading}`}
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.5 }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <Typewriter text={section.title} />
          </motion.h2>
        </div>

        <div
          className={`mt-8 grid gap-10 ${img ? "md:grid-cols-[minmax(0,1fr)_minmax(0,360px)] md:gap-8 lg:gap-14" : ""}`}
        >
          <div>
            {section.paragraphs.map((p, i) => (
              <motion.p
                key={i}
                className={`text-sm leading-relaxed ${t.body} ${i ? "mt-4" : ""}`}
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
                    className={`rounded-xl px-5 py-4 ${
                      section.theme === "dark"
                        ? "bg-white/[0.06] ring-1 ring-white/10"
                        : "border border-[#E5E7EB] bg-white shadow-lg"
                    }`}
                    initial={{ opacity: 0, x: 22 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: false, amount: 0.35 }}
                    transition={{ duration: 0.55, delay: Math.min(i, 5) * 0.07, ease: EASE }}
                    whileHover={{ x: 4 }}
                  >
                    <h3
                      className={`text-base font-bold leading-snug ${
                        section.theme === "dark" ? "text-white" : "text-[#0A0A0A]"
                      }`}
                    >
                      {b.title}
                    </h3>
                    {b.body && (
                      <p className={`mt-2 text-sm leading-loose ${section.theme === "dark" ? "text-[#9CA3AF]" : "text-[#9CA3AF]"}`}>
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
              className="group relative self-start overflow-hidden md:sticky md:top-24"
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
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6">
        <Kicker tone="text-[#E87D12]">{section.kicker || "WHO CONTESTED"}</Kicker>
        <motion.h2
          className="mt-3 text-2xl font-bold leading-[1.25] text-[#0A0A0A] sm:text-3xl"
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.5 }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <Typewriter text={section.title} />
        </motion.h2>
        <p className="mt-2 text-sm text-[#9CA3AF]">Select a party to read the analysis.</p>

        <div className="mt-8 grid gap-8 md:grid-cols-[minmax(0,320px)_minmax(0,1fr)] md:gap-8 lg:gap-12">
          {/* party list */}
          <div className="space-y-2.5">
            {parties.map((party, i) => (
              <motion.button
                key={party.short}
                onClick={() => setActive(i)}
                aria-pressed={i === active}
                className={`relative flex w-full items-center gap-3.5 border px-4 py-3.5 text-left transition-colors ${
                  i === active ? "border-transparent bg-white" : "border-[#0A0A0A]/10 bg-white/55 hover:bg-white"
                }`}
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
                    style={{ borderLeft: `3px solid ${party.accent}` }}
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  />
                )}
                <span
                  className="grid h-10 w-10 shrink-0 place-items-center text-[13px] font-extrabold"
                  style={{ color: party.accent, background: `${party.accent}1A` }}
                >
                  {party.short.replace(/.*\(([^)]+)\).*/, "$1").slice(0, 4)}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-[15px] font-bold text-[#0A0A0A]">{party.short}</span>
                  <span className="block text-[11px] font-semibold tracking-wider text-[#9CA3AF]">
                    {party.role}
                  </span>
                </span>
              </motion.button>
            ))}
          </div>

          {/* panel */}
          <div className="relative min-h-[320px] rounded-xl border border-[#E5E7EB] bg-white p-6 shadow-lg sm:p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.4, ease: EASE }}
              >
                <span
                  className="text-[10px] font-bold uppercase tracking-wide"
                  style={{ color: p.accent }}
                >
                  {p.role}
                </span>
                <h3 className="mt-2 text-xl font-extrabold leading-snug text-[#0A0A0A] sm:text-2xl">
                  {p.short}
                </h3>
                <span className="mt-3 block h-[3px] w-14" style={{ background: p.accent }} />
                <p className="mt-4 text-sm leading-relaxed text-[#6B7280]">{p.text}</p>
                {p.leaders?.length > 0 && (
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {p.leaders.map((l) => (
                      <li
                        key={l}
                        className="border border-[#0A0A0A]/12 bg-[#F5F5F5] px-3 py-1.5 text-[12px] font-semibold text-[#0A0A0A]"
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
    <section className="border-t-[3px] border-[#FF9933] bg-[linear-gradient(#FFF4E6,#FDE68A)] py-14 sm:py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <motion.h2
          className="text-2xl font-bold leading-[1.25] text-[#0A0A0A] sm:text-3xl"
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
                i === active ? "text-white" : "text-[#E87D12] hover:text-[#0A0A0A]"
              } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF9933] focus-visible:ring-offset-2`}
            >
              {i === active && (
                <motion.span
                  layoutId="pa-issue-active"
                  className="absolute inset-0 -z-10 bg-[#0A0A0A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF9933] focus-visible:ring-offset-2"
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                />
              )}
              {it.label}
            </button>
          ))}
        </div>

        <div className="relative mt-6 min-h-[150px] rounded-xl bg-white/70 p-6 backdrop-blur-sm sm:p-7">
          <AnimatePresence mode="wait">
            <motion.p
              key={active}
              className="text-sm leading-relaxed text-[#6B7280]"
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
    <section className="relative overflow-hidden border-y-[3px] border-[#FF9933] bg-[#061428] py-14 sm:py-20">
      {/* Oversized ghost number — the reference's signature device for this block. */}
      <span
        aria-hidden
        className="pointer-events-none absolute right-4 top-6 select-none text-[8rem] font-extrabold leading-none text-[#F97316]/[0.13] sm:text-[10rem]"
      >
        {f.n}
      </span>

      <div className="relative mx-auto max-w-[1440px] px-4 sm:px-6">
        <Kicker tone="text-[#FFC27A]">{section.kicker || "WHAT MOVED THE VERDICT"}</Kicker>
        <motion.h2
          className="mt-3 text-2xl font-bold leading-[1.25] text-white sm:text-3xl"
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.5 }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <Typewriter text={section.title} />
        </motion.h2>

        <div className="mt-8 grid gap-8 md:grid-cols-[minmax(0,280px)_minmax(0,1fr)] md:gap-8 lg:gap-12">
          {/* index rail */}
          <ul className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0">
            {paFactors.map((x, n) => (
              <li key={x.n} className="shrink-0 lg:shrink">
                <button
                  onClick={() => setI(n)}
                  aria-pressed={n === i}
                  className={`relative flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors ${
                    n === i ? "text-white" : "text-[#9CA3AF] hover:text-white"
                  } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF9933] focus-visible:ring-offset-2`}
                >
                  {n === i && (
                    <motion.span
                      layoutId="pa-factor-active"
                      className="absolute inset-0 -z-10 bg-white/[0.07] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF9933] focus-visible:ring-offset-2"
                      style={{ borderLeft: "3px solid #F97316" }}
                      transition={{ type: "spring", stiffness: 420, damping: 34 }}
                    />
                  )}
                  <span className="text-[12px] font-extrabold text-[#FFC27A]">{x.n}</span>
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
                <span className="text-5xl font-extrabold leading-none text-[#F97316]/70">
                  <SlotNumber value={f.n} />
                </span>
                <h3 className="mt-3 text-xl font-bold leading-snug text-white sm:text-2xl">{f.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-[#9CA3AF]">{f.lead}</p>
                {f.points?.length > 0 && (
                  <ul className="mt-5 space-y-2.5">
                    {f.points.map((pt, n) => (
                      <motion.li
                        key={n}
                        className="flex gap-3 border-l-[3px] border-[#F97316]/45 bg-white/[0.045] px-4 py-3 text-sm leading-loose text-[#9CA3AF]"
                        initial={{ opacity: 0, x: 18 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.08 + n * 0.06 }}
                      >
                        <span className="mt-[3px] text-[11px] font-extrabold text-[#FFC27A]">
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
                className="inline-flex items-center gap-2 text-[13px] font-bold text-[#FFC27A] transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF9933] focus-visible:ring-offset-2"
              >
                <ArrowLeft className="h-4 w-4" /> PREVIOUS
              </button>
              <span className="text-[13px] text-[#8FA3C0]">
                {String(i + 1).padStart(2, "0")} / {String(paFactors.length).padStart(2, "0")}
              </span>
              <button
                onClick={() => go(1)}
                className="inline-flex items-center gap-2 text-[13px] font-bold text-[#FFC27A] transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF9933] focus-visible:ring-offset-2"
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

const BLOC: Record<string, string> = { nda: "#FF9933", india: "#E87D12", other: "#9CA3AF" };

export function PaResults() {
  const r = paResults;
  const max = Math.max(...r.seatChart.rows.map((x) => x.seats));

  return (
    <section id="overall-results" className="scroll-mt-24 bg-white py-14 sm:py-20">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6">
        <Kicker tone="text-[#E87D12]">{r.kicker}</Kicker>
        <motion.h2
          className="mt-3 text-2xl font-bold leading-[1.25] text-[#0A0A0A] sm:text-3xl"
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
              className="rounded-xl border border-[#E5E7EB] bg-[#F5F5F5] px-5 py-5 shadow-lg"
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.5 }}
              transition={{ duration: 0.55, delay: i * 0.09, ease: EASE }}
            >
              <span className="block text-4xl font-extrabold leading-none text-[#0A0A0A] sm:text-[2.75rem]">
                <SlotNumber value={s.value} />
              </span>
              <span className="mt-2 block text-[11px] font-bold tracking-[0.14em] text-[#E87D12]">
                {s.label}
              </span>
            </motion.div>
          ))}
        </div>

        <motion.p
          className="mt-7 max-w-3xl text-sm leading-relaxed text-[#6B7280]"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.4 }}
          transition={{ duration: 0.6 }}
        >
          <span className="mr-2 text-[11px] font-bold tracking-[0.18em] text-[#0A0A0A]">
            {r.leadKicker}
          </span>
          {r.lead}
        </motion.p>

        <div className="mt-10 grid gap-10 md:grid-cols-[minmax(0,300px)_minmax(0,1fr)] md:gap-8 lg:gap-14">
          {/* turnout */}
          <motion.div
            className="self-start rounded-xl border border-[#E5E7EB] bg-[#F5F5F5] p-6 shadow-lg"
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.4 }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <h3 className="text-xl font-bold text-[#E87D12]">{r.turnout.title}</h3>
            <span className="mt-2 block text-5xl font-extrabold leading-none text-[#0A0A0A]">
              <SlotNumber value={`${r.turnout.value}${r.turnout.suffix}`} />
            </span>
            <span className="mt-1.5 block text-[11px] font-bold tracking-[0.16em] text-[#E87D12]">
              {r.turnout.label}
            </span>
            <p className="mt-4 text-sm leading-loose text-[#6B7280]">{r.turnout.body}</p>
          </motion.div>

          {/* seat chart */}
          <div>
            <span className="text-[11px] font-bold tracking-[0.2em] text-[#0A0A0A]">
              {r.seatChart.kicker}
            </span>
            <h3 className="mt-1.5 text-2xl font-bold text-[#0A0A0A]">{r.seatChart.title}</h3>
            <p className="mt-1.5 text-sm text-[#9CA3AF]">{r.seatChart.note}</p>

            <ul className="mt-5 space-y-2.5">
              {r.seatChart.rows.map((row, i) => (
                <li key={row.party} className="flex items-center gap-3">
                  <span className="w-20 shrink-0 text-[13px] font-semibold text-[#6B7280]">
                    {row.party}
                  </span>
                  <span className="relative h-6 flex-1 overflow-hidden bg-[#F5F5F5]">
                    <motion.span
                      className="absolute inset-y-0 left-0"
                      style={{ background: BLOC[row.bloc] ?? BLOC.other, borderRadius: 6 }}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${(row.seats / max) * 100}%` }}
                      viewport={{ once: false, amount: 0.6 }}
                      transition={{ duration: 0.9, delay: i * 0.05, ease: EASE }}
                    />
                  </span>
                  <span className="w-10 shrink-0 text-right text-[13px] font-extrabold text-[#0A0A0A]">
                    <SlotNumber value={row.seats} digitWidth="0.56em" />
                  </span>
                </li>
              ))}
            </ul>

            <p className="mt-4 text-[12px] font-bold tracking-[0.14em] text-[#E87D12]">
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
