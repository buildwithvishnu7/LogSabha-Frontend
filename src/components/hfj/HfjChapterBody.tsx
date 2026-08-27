"use client";

import { motion } from "motion/react";
import { hfjChapters, type HfjBlock } from "@/data/hfj-chapters";

/* The record itself, chapter by chapter.
 *
 * The body copy is the published text, unedited. Only the chapter headers —
 * year, title, era — are display metadata added on top, because the source's own
 * headings repeat and shift level partway through.
 *
 * Every chapter carries its slug as an id so the 3D timeline can jump to it, and
 * scroll-margin-top (set globally) keeps that jump clear of the fixed header. */

const TONE: Record<string, string> = {
  cream: "bg-[#fffdf9]",
  white: "bg-white",
  paper: "bg-[#f6f9fd]",
};

function Block({ b }: { b: HfjBlock }) {
  switch (b.t) {
    case "h":
      return (
        <h3
          className={
            b.level <= 2
              ? "mt-10 text-[clamp(19px,2vw,26px)] font-extrabold leading-snug tracking-tight text-[#0a1e3f]"
              : "mt-8 text-[clamp(16px,1.6vw,20px)] font-bold leading-snug text-[#12306b]"
          }
        >
          {b.text}
        </h3>
      );
    case "p":
      return <p className="mt-4 text-[15px] leading-[1.75] text-[#22406e]">{b.text}</p>;
    case "em":
      return (
        <p className="mt-4 text-[15px] italic leading-[1.75] text-[#22406e]">{b.text}</p>
      );
    case "quote":
      return (
        <blockquote className="mt-6 border-l-2 border-[#ff9933] pl-5 text-[15px] leading-[1.75] text-[#12306b]">
          {b.text}
        </blockquote>
      );
    case "li":
      return (
        <li className="ml-5 mt-2 list-disc text-[15px] leading-[1.7] text-[#22406e]">{b.text}</li>
      );
    case "note":
      return (
        <p className="mt-4 border-l-2 border-[#dce4ef] pl-4 text-[13px] leading-relaxed text-[#5a7091]">
          {b.text}
        </p>
      );
    case "img":
      return (
        <figure className="mt-8" style={{ maxWidth: b.w || undefined }}>
          <img
            src={b.src}
            alt={b.alt}
            width={b.w || undefined}
            height={b.h || undefined}
            loading="lazy"
            decoding="async"
            // width/height are the intrinsic dimensions, so the browser reserves
            // the box before the file lands — this page has 36 photographs and
            // would otherwise reflow the whole way down as they arrive.
            className="h-auto w-full rounded-xl border border-[#e6eaf2]"
          />
        </figure>
      );
    default:
      return null;
  }
}

export function HfjChapterBody() {
  return (
    <>
      {hfjChapters.map((c, ci) => (
        <section
          key={c.id}
          id={c.slug}
          className={`${TONE[c.tone] ?? "bg-white"} border-b border-[#eef2f7] py-14 sm:py-20`}
        >
          <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6">
            <motion.header
              className="max-w-[72ch]"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.4 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="flex items-baseline gap-3">
                <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#e87d12]">
                  Chapter {ci + 1} of {hfjChapters.length}
                </span>
                <span className="h-px flex-1 bg-[#e6eaf2]" />
              </div>
              <h2 className="mt-3 text-[clamp(24px,3.2vw,44px)] font-extrabold leading-[1.1] tracking-tight text-[#0a1e3f]">
                <span className="text-[#e87d12]">{c.year}</span>
                {" — "}
                {c.title}
              </h2>
              <p className="mt-2 text-[13px] leading-relaxed text-[#5a7091]">{c.era}</p>
            </motion.header>

            <div className="mt-2 max-w-[72ch]">
              {c.blocks.map((b, i) => (
                <Block key={i} b={b} />
              ))}
            </div>
          </div>
        </section>
      ))}
    </>
  );
}
