"use client";

import { useRef } from "react";
import { motion, useInView, useScroll, useSpring } from "motion/react";
import { Typewriter } from "@/components/motion/Typewriter";
import { hfjHero, hfjSections, type HfjNode, type HfjSection, type HfjTheme } from "@/data/hindu-for-justice";

/* Reference palette: radial navy hero (#23477F → #123060 → #0A1E3F),
   navy #14213D / #1B3A6B, body #1F2A44, muted #54617C,
   saffron #E67300 / #A85200, cream-on-dark #FFD9AE. Sharp 3px shapes. */

const EASE = [0.16, 1, 0.3, 1] as const;

const T: Record<HfjTheme, { wrap: string; head: string; body: string; rule: string; card: string }> = {
  hero: { wrap: "", head: "", body: "", rule: "", card: "" },
  light: { wrap: "bg-white", head: "text-[#1B3A6B]", body: "text-[#1F2A44]", rule: "bg-[#E67300]", card: "bg-[#F4F6FA]" },
  panel: {
    wrap: "bg-[linear-gradient(#FFFFFF,#F2F5FA)]",
    head: "text-[#1B3A6B]", body: "text-[#1F2A44]", rule: "bg-[#E67300]", card: "bg-white",
  },
  dark: {
    wrap: "bg-[linear-gradient(#0D2038,#0A1B33)] border-y-[3px] border-[#E67300]",
    head: "text-white", body: "text-[#C9D6EA]", rule: "bg-[#FF8A00]", card: "bg-white/[0.05]",
  },
  saffron: {
    wrap: "bg-[linear-gradient(#FFE0B8,#FFD199)] border-y-[3px] border-[#E67300]",
    head: "text-[#0D2547]", body: "text-[#1F2A44]", rule: "bg-[#8A3B12]", card: "bg-white/65",
  },
  soft: {
    wrap: "bg-[linear-gradient(#E4EAF4,#FFD3A0)]",
    head: "text-[#0D2547]", body: "text-[#1F2A44]", rule: "bg-[#8A3B12]", card: "bg-white/65",
  },
  closing: {
    wrap: "bg-[radial-gradient(100%_80%_at_50%_0%,#FAF6EF,#F1F4F9)]",
    head: "text-[#1B3A6B]", body: "text-[#1F2A44]", rule: "bg-[#E67300]", card: "bg-white",
  },
};

/* ═══════════════ reading progress ═══════════════ */

export function HfjProgress() {
  const { scrollYProgress } = useScroll();
  const x = useSpring(scrollYProgress, { stiffness: 140, damping: 28, restDelta: 0.001 });
  return (
    <motion.div
      aria-hidden
      className="fixed inset-x-0 top-0 z-50 h-[3px] origin-left bg-[#E67300]"
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
          "radial-gradient(120% 90% at 78% 10%, #23477F 0%, #123060 42%, #0A1E3F 100%)",
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
          className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.24em] text-[#FFD9AE]"
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55 }}
        >
          <span className="h-px w-7 bg-[#E67300]" />
          A HISTORICAL ACCOUNT
        </motion.span>

        <h1
          className="mt-4 max-w-4xl text-[2rem] font-extrabold leading-[1.25] sm:text-[2.75rem] lg:text-[3.5rem] text-white"
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
          className="mt-5 max-w-2xl text-[15px] leading-loose text-[#C9D6EA] sm:text-base"
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
              className="border-l-[3px] border-[#FF8A00] bg-white/[0.06] px-4 py-3 backdrop-blur-sm"
              style={{ borderRadius: 3 }}
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.85 + i * 0.12, ease: EASE }}
            >
              <span className="block text-[11px] font-bold tracking-[0.16em] text-[#FFC98A]">
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
        className="group my-8 overflow-hidden"
        // maxWidth = the file's own width: four of these photographs are
        // narrower than the 768px reading column and would otherwise be blown
        // up (hero-scroll 1.45x, punjab-riot 1.18x, cavalry 1.16x, ghaznavid-map 1.15x).
        style={{ borderRadius: 3, maxWidth: node.w }}
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
            className={`mt-2 text-[12px] italic ${theme === "dark" ? "text-[#9FB2CC]" : "text-[#54617C]"}`}
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
        className={`${big ? "mt-10 text-2xl sm:text-[2.1rem]" : "mt-8 text-lg sm:text-xl"} font-bold leading-[1.3] ${t.head} first:mt-0`}
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
        className={`my-6 border-l-[3px] px-5 py-4 text-[15px] italic leading-loose ${t.card} ${t.body}`}
        style={{ borderRadius: 3, borderLeftColor: theme === "dark" ? "#FF8A00" : "#E67300" }}
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
        className={`ml-5 list-disc py-1 text-[15px] leading-loose ${t.body}`}
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
      className={`mt-4 text-[15px] leading-loose ${t.body} ${
        isLeadPara
          ? `first-letter:mr-2 first-letter:float-left first-letter:text-[3.2rem] first-letter:font-extrabold first-letter:leading-[0.85] ${
              theme === "dark" ? "first-letter:text-[#FF8A00]" : "first-letter:text-[#E67300]"
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
