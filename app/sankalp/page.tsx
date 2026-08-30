"use client";

// कलम का संकल्प — the founder's column, as a ring of plates around one pen.
//
// The page is in Hindi because the column is. The index is nine articles of a
// four-page run; the page states that rather than implying nine is all of them.
import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { motion, useReducedMotion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import {
  sankalpHero,
  sankalpArticles,
  sankalpCoverage,
  hindiDate,
  type SankalpArticle,
} from "@/data/sankalp";
import { Footer } from "@/components/Footer";

const EASE = [0.16, 1, 0.3, 1] as const;

const ResolveRing = dynamic(() => import("@/components/three/ResolveRing"), {
  ssr: false,
  loading: () => <RingFallback />,
});

function RingFallback() {
  return (
    <div className="absolute inset-0 grid place-items-center">
      <div className="relative h-40 w-40">
        <span className="absolute inset-0 rounded-full border border-[#ff9933]/25" />
        <span className="absolute left-1/2 top-1/2 h-20 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#ff9933]/50" />
      </div>
    </div>
  );
}

export default function SankalpPage() {
  const ref = useRef<HTMLElement>(null);
  const [near, setNear] = useState(false);
  const [hovered, setHovered] = useState<SankalpArticle | null>(null);
  const reduced = useReducedMotion() ?? false;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) return setNear(true);
    const io = new IntersectionObserver(
      (e) => e[0].isIntersecting && (setNear(true), io.disconnect()),
      { rootMargin: "700px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const open = (a: SankalpArticle) => window.open(a.u, "_blank", "noopener,noreferrer");

  return (
    <>
      <section className="relative overflow-hidden bg-[#061428] pb-14 pt-[calc(var(--header-h)+44px)] text-white">
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <span className="absolute -right-[8%] -top-[26%] h-[64vh] w-[64vh] rounded-full bg-[radial-gradient(circle,rgba(255,153,51,0.24),transparent_62%)] blur-3xl" />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-[1440px] px-4 sm:px-6">
          <motion.span
            className="text-[11px] font-bold tracking-[0.14em] text-[#ffc27a]"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {sankalpHero.kicker}
          </motion.span>

          <motion.h1
            className="mt-3 text-[clamp(38px,7vw,86px)] font-extrabold leading-[1.08] tracking-tight"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05, ease: EASE }}
          >
            {sankalpHero.title}
          </motion.h1>

          <motion.p
            className="mt-5 max-w-[60ch] text-[17px] leading-relaxed text-white/75"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            {sankalpHero.tagline}
          </motion.p>

          <motion.p
            className="mt-5 text-[13px] text-white/55"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.28 }}
          >
            <span className="font-semibold text-white">{sankalpHero.author}</span>
            <span className="mx-2 text-white/30">·</span>
            {sankalpHero.role}
          </motion.p>
        </div>
      </section>

      <div className="tri" />

      <section
        ref={ref}
        id="ring"
      // .oneview, not .oneview-lg: every 3D section in the reference is full
      // height at every width. The lg-only variant is for the analytics
      // explorer alone, which pairs its canvas with a 36-row table.
      className="oneview relative overflow-hidden bg-[#061428] text-white"
      >
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <span className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_46%,transparent_35%,rgba(6,20,40,0.92)_100%)]" />
        </div>

        <div className="ov-head relative z-10 mx-auto w-full max-w-[1440px] px-4 pt-10 text-center sm:px-6 lg:pt-[calc(var(--header-h)+18px)]">
          <motion.h2
            className="text-[clamp(20px,2.4vw,34px)] font-extrabold tracking-tight"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.6 }}
            transition={{ duration: 0.6 }}
          >
            एक कलम, {sankalpCoverage.articles} लेख
          </motion.h2>
          <p className="mx-auto mt-2 max-w-[56ch] text-[clamp(12px,1vw,14px)] leading-relaxed text-white/60">
            हर पन्ना उसी एक कलम से निकला है। घुमाइए, और किसी भी लेख पर क्लिक कीजिए।
          </p>
        </div>

        <div className="ov-stage relative z-10">
          {near ? (
            <ResolveRing
              litUrl={hovered?.u ?? null}
              onHoverArticle={setHovered}
              onSelectArticle={open}
              reducedMotion={reduced}
            />
          ) : (
            <RingFallback />
          )}

          <div
            role="status"
            aria-live="polite"
            className="pointer-events-none absolute inset-x-0 bottom-1 flex justify-center px-4"
          >
            {hovered && (
              <span className="max-w-[74ch] rounded-full border border-white/15 bg-[#061428]/90 px-4 py-1.5 text-center text-[12px] backdrop-blur">
                <b className="mr-2 font-extrabold text-[#ff9933]">{hovered.mono}</b>
                <span className="font-semibold text-white">{hovered.t}</span>
              </span>
            )}
          </div>
        </div>

        <div className="ov-foot relative z-10 pb-6">
          <p className="text-center text-[11px] text-white/45">
            घुमाने के लिए खींचिए · लेख खोलने के लिए क्लिक कीजिए · तीर कुंजियाँ भी काम करती हैं
          </p>
        </div>
      </section>

      <section id="lekh" className="bg-white py-14 sm:py-20">
        <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6">
          <div className="max-w-[70ch]">
            <span className="text-[11px] font-bold tracking-[0.14em] text-[#e87d12]">सूची</span>
            <h2 className="mt-2 text-[clamp(22px,2.6vw,36px)] font-extrabold tracking-tight text-[#0a1e3f]">
              सभी लेख
            </h2>
          </div>

          {/* The gap is stated, not hidden. Nine of a four-page run is a partial
              index, and a reader who is not told that will read it as complete. */}
          <div className="mt-5 rounded-xl border border-[#ffe4c4] bg-[#fff8f0] p-4">
            <p className="text-[13px] font-semibold text-[#0a1e3f]">
              यह सूची अधूरी है — {sankalpCoverage.pagesTotal} में से केवल {sankalpCoverage.pagesCaptured} पृष्ठ ही
              संग्रहीत हो सका।
            </p>
            <p className="mt-1.5 text-[12.5px] leading-relaxed text-[#5a7091]">
              नीचे दिए {sankalpCoverage.articles} लेख वही हैं जिनकी पुष्टि की जा सकी। शेष लेख मौजूद हैं, पर यहाँ से
              प्राप्त नहीं किए जा सके — और उनका अनुमान नहीं लगाया गया है।
            </p>
          </div>

          <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {sankalpArticles.map((a) => (
              <li key={a.u}>
                <a
                  href={a.u}
                  target="_blank"
                  rel="noopener noreferrer"
                  onMouseEnter={() => setHovered(a)}
                  onMouseLeave={() => setHovered(null)}
                  onFocus={() => setHovered(a)}
                  onBlur={() => setHovered(null)}
                  className="group flex h-full flex-col rounded-xl border border-[#dce4ef] bg-white p-4 transition-colors hover:border-[#ff9933] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e87d12]"
                >
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-[#fff4e6] text-[17px] font-bold text-[#c96608]">
                    {a.mono}
                  </span>
                  <h3 className="mt-3 flex-1 text-[14.5px] font-bold leading-snug text-[#0a1e3f]">
                    {a.t}
                  </h3>
                  <span className="mt-3 flex items-center justify-between text-[11.5px] text-[#5a7091]">
                    {hindiDate(a.d)}
                    <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </span>
                </a>
              </li>
            ))}
          </ul>

          <p className="mt-6 text-[11px] text-[#94a3b8]">स्रोत: {sankalpCoverage.source}</p>
        </div>
      </section>

      <Footer />
    </>
  );
}
