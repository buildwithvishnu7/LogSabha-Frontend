"use client";

import { useRef } from "react";
import { motion, useInView, useScroll, useSpring } from "motion/react";
import { Typewriter } from "@/components/motion/Typewriter";
import { hfjHero, hfjSections, type HfjNode, type HfjSection, type HfjTheme } from "@/data/hindu-for-justice";

/* Reference palette: radial navy hero (#1F2937 → #111827 → #0B1120),
   navy #0A0A0A / #0A0A0A, body #6B7280, muted #9CA3AF,
   saffron #F59E0B / #D97706, cream-on-dark #FBBF24. Sharp 3px shapes. */

const EASE = [0.16, 1, 0.3, 1] as const;

const T: Record<HfjTheme, { wrap: string; head: string; body: string; rule: string; card: string }> = {
  hero: { wrap: "", head: "", body: "", rule: "", card: "" },
  light: { wrap: "bg-white", head: "text-[#0A0A0A]", body: "text-[#6B7280]", rule: "bg-[#F59E0B]", card: "bg-[#F5F5F5]" },
  panel: {
    wrap: "bg-[linear-gradient(#FFFFFF,#F5F5F5)]",
    head: "text-[#0A0A0A]", body: "text-[#6B7280]", rule: "bg-[#F59E0B]", card: "bg-white",
  },
  dark: {
    wrap: "bg-[linear-gradient(#0B1120,#0B1120)] border-y-[3px] border-[#F59E0B]",
    head: "text-white", body: "text-[#9CA3AF]", rule: "bg-[#F97316]", card: "bg-white/[0.05]",
  },
  saffron: {
    wrap: "bg-[linear-gradient(#FEF3C7,#FDE68A)] border-y-[3px] border-[#F59E0B]",
    head: "text-[#0A0A0A]", body: "text-[#6B7280]", rule: "bg-[#D97706]", card: "bg-white/65",
  },
  soft: {
    wrap: "bg-[linear-gradient(#F5F5F5,#FDE68A)]",
    head: "text-[#0A0A0A]", body: "text-[#6B7280]", rule: "bg-[#D97706]", card: "bg-white/65",
  },
  closing: {
    wrap: "bg-[radial-gradient(100%_80%_at_50%_0%,#FFFFFF,#F5F5F5)]",
    head: "text-[#0A0A0A]", body: "text-[#6B7280]", rule: "bg-[#F59E0B]", card: "bg-white",
  },
};

/* ═══════════════ reading progress ═══════════════ */

export function HfjProgress() {
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

export function HfjHero() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: false, amount: 0.2 });

  return (
    <section
      ref={ref}
      className="relative overflow-hidden pt-28 pb-14 sm:pt-32 sm:pb-16"
      style={{
        backgroundImage:
          "radial-gradient(120% 90% at 78% 10%, #1F2937 0%, #111827 42%, #0B1120 100%)",
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
          className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-wide text-[#FBBF24]"
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55 }}
        >
          <span className="h-px w-7 bg-[#F59E0B]" />
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
              <span className="block text-[11px] font-bold tracking-[0.16em] text-[#FBBF24]">
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

function FlowNode({
  node,
  theme,
  isLeadHeading,
  isLeadPara,
  index,
}: {
  node: HfjNode;
  theme: HfjTheme;
  isLeadHeading: boolean;
  isLeadPara: boolean;
  index: number;
}) {
  const t = T[theme];
  const delay = Math.min(index, 6) * 0.05;

  if (node.t === "img") {
    return (
      <motion.figure
        className="group my-8 overflow-hidden rounded-xl"
        // maxWidth = the file's own width: four of these photographs are
        // narrower than the 768px reading column and would otherwise be blown
        // up (hero-scroll 1.45x, punjab-riot 1.18x, cavalry 1.16x, ghaznavid-map 1.15x).
        style={{ maxWidth: node.w }}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.2 }}
        transition={{ duration: 0.85, ease: EASE }}
      >
        <img
          src={node.src}
          alt={node.alt}
          loading="lazy"
          // Intrinsic size on the element reserves the box before the file
          // arrives, so lazy loading never shifts the article mid-read.
          width={node.w}
          height={node.h}
          className="block h-auto w-full transition-transform duration-[1.4s] group-hover:scale-[1.03]"
        />
        {node.alt && (
          <figcaption
            className={`mt-2 text-[12px] italic ${theme === "dark" ? "text-[#9CA3AF]" : "text-[#9CA3AF]"}`}
          >
            {node.alt}
          </figcaption>
        )}
      </motion.figure>
    );
  }

  if (node.t === "h") {
    const big = node.level <= 2;
    return (
      <motion.h2
        className={`${big ? "mt-10 text-xl sm:text-2xl" : "mt-8 text-base sm:text-lg"} font-bold leading-[1.3] ${t.head} first:mt-0`}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.5 }}
        transition={{ duration: 0.65, ease: EASE }}
      >
        {/* Typewriter only on the section's opening heading — this document has
            81 headings, and typing every one would fight the reading. */}
        {isLeadHeading ? <Typewriter text={node.text} /> : node.text}
        {big && (
          <motion.span
            className={`mt-3 block h-[3px] w-14 origin-left ${t.rule}`}
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: false, amount: 0.6 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          />
        )}
      </motion.h2>
    );
  }

  if (node.t === "note") {
    return (
      <motion.blockquote
        className={`my-6 rounded-xl px-5 py-4 text-sm italic leading-relaxed shadow-lg ${t.card} ${t.body}`}
        style={{ borderLeftColor: theme === "dark" ? "#F97316" : "#F59E0B" }}
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
        className={`ml-5 list-disc py-1 text-sm leading-relaxed ${t.body}`}
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
      className={`mt-4 text-sm leading-relaxed ${t.body} ${
        isLeadPara
          ? `first-letter:mr-2 first-letter:float-left first-letter:text-[3.2rem] first-letter:font-extrabold first-letter:leading-[0.85] ${
              theme === "dark" ? "first-letter:text-[#F97316]" : "first-letter:text-[#F59E0B]"
            }`
          : ""
      }`}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.25 }}
      transition={{ duration: 0.6, delay, ease: EASE }}
    >
      {node.text}
    </motion.p>
  );
}

function HfjSectionBlock({ section }: { section: HfjSection }) {
  const t = T[section.theme];
  const firstHeading = section.flow.findIndex((n) => n.t === "h");
  const firstPara = section.flow.findIndex((n) => n.t === "p");

  return (
    <section id={section.id} className={`scroll-mt-24 py-14 sm:py-20 ${t.wrap}`}>
      {/* Measured reading column — long-form prose needs a capped line length. */}
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        {section.flow.map((n, i) => (
          <FlowNode
            key={i}
            node={n}
            theme={section.theme}
            isLeadHeading={i === firstHeading}
            isLeadPara={i === firstPara}
            index={i}
          />
        ))}
      </div>
    </section>
  );
}

export function HfjBody() {
  // Section 0 is the hero, rendered separately.
  return (
    <>
      {hfjSections.slice(1).map((s) => (
        <HfjSectionBlock key={s.id} section={s} />
      ))}
    </>
  );
}
