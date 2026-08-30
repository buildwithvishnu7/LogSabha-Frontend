"use client";

// Media Coverage — the press drum over the channel band and the four featured
// clips. Static-data-first: src/data/media-coverage.ts was read out of the
// approved frontend's live DOM, and all ten assets are in public/.
import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { X } from "lucide-react";
import { mediaHero, channels, clips, mediaSource, type Clip } from "@/data/media-coverage";
import { Footer } from "@/components/Footer";

const EASE = [0.16, 1, 0.3, 1] as const;

const PressDrum = dynamic(() => import("@/components/three/PressDrum"), {
  ssr: false,
  loading: () => <DrumFallback />,
});

function DrumFallback() {
  return (
    <div className="absolute inset-0 grid place-items-center">
      <div className="h-32 w-56 rounded-2xl border border-white/10 bg-white/[0.03]" />
    </div>
  );
}

export default function MediaCoveragePage() {
  const ref = useRef<HTMLElement>(null);
  const [near, setNear] = useState(false);
  const [hovered, setHovered] = useState<Clip | null>(null);
  const [playing, setPlaying] = useState<Clip | null>(null);
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

  useEffect(() => {
    if (!playing) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setPlaying(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [playing]);

  return (
    <>
      <section className="relative overflow-hidden bg-[#f6f9fd] pb-12 pt-[calc(var(--header-h)+40px)]">
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <span className="absolute -right-[10%] -top-[28%] h-[66vh] w-[66vh] rounded-full bg-[radial-gradient(circle,rgba(255,153,51,0.20),transparent_62%)] blur-3xl" />
          <span className="absolute -left-[12%] bottom-[-28%] h-[56vh] w-[56vh] rounded-full bg-[radial-gradient(circle,rgba(27,110,194,0.16),transparent_62%)] blur-3xl" />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-[1440px] px-4 sm:px-6">
          <motion.span
            className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#e87d12]"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {mediaHero.kicker}
          </motion.span>

          <motion.h1
            className="mt-3 max-w-[20ch] text-[clamp(32px,5.4vw,68px)] font-extrabold leading-[1.02] tracking-tight text-[#0a1e3f]"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05, ease: EASE }}
          >
            {mediaHero.title}
          </motion.h1>

          <motion.p
            className="mt-5 max-w-[66ch] text-[15px] leading-relaxed text-[#5a7091]"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            {mediaHero.lede}
          </motion.p>

          {/* The channel band, flat and legible — the drum below carries the same
              six marks, but a logo you have to wait for the rotation to see is a
              logo the reader cannot check. */}
          <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-5">
            {channels.map((c, i) => (
              <motion.img
                key={c.name}
                src={c.file}
                alt={c.name}
                loading="lazy"
                className="h-7 w-auto opacity-70 grayscale transition hover:opacity-100 hover:grayscale-0 sm:h-8"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 0.7, y: 0 }}
                transition={{ duration: 0.5, delay: 0.28 + i * 0.06 }}
              />
            ))}
          </div>
        </div>
      </section>

      <div className="tri" />

      <section
        ref={ref}
        id="drum"
      // .oneview, not .oneview-lg: every 3D section in the reference is full
      // height at every width. The lg-only variant is for the analytics
      // explorer alone, which pairs its canvas with a 36-row table.
      className="oneview relative overflow-hidden bg-[#061428] text-white"
      >
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <span className="absolute left-1/2 top-1/2 h-[80vh] w-[80vh] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,153,51,0.15),transparent_62%)] blur-2xl" />
          <span className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_50%,transparent_45%,rgba(6,20,40,0.9)_100%)]" />
        </div>

        <div className="ov-head relative z-10 mx-auto w-full max-w-[1440px] px-4 pt-10 text-center sm:px-6 lg:pt-[calc(var(--header-h)+18px)]">
          <motion.span
            className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#ffc27a]"
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.6 }}
            transition={{ duration: 0.5 }}
          >
            The press drum
          </motion.span>
          <motion.h2
            className="mt-2 text-[clamp(20px,2.4vw,34px)] font-extrabold tracking-tight"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.6 }}
            transition={{ duration: 0.6, delay: 0.05 }}
          >
            {clips.length} clips, {channels.length} channels, one turn
          </motion.h2>
          <p className="mx-auto mt-2 max-w-[62ch] text-[clamp(12px,1vw,14px)] leading-relaxed text-white/65">
            A closed drum, so the whole set is always on it. Drag to turn, click a clip to play it.
          </p>
        </div>

        <div className="ov-stage relative z-10">
          {near ? (
            <PressDrum
              selectedId={playing?.id ?? null}
              onHoverClip={setHovered}
              onSelectClip={setPlaying}
              reducedMotion={reduced}
            />
          ) : (
            <DrumFallback />
          )}

          <div
            role="status"
            aria-live="polite"
            className="pointer-events-none absolute inset-x-0 bottom-1 flex justify-center px-4"
          >
            {hovered && (
              <span className="rounded-full border border-white/15 bg-[#061428]/88 px-4 py-1.5 text-center text-[11px] backdrop-blur">
                <b className="font-semibold text-white">{hovered.t}</b>
                <span className="ml-2 text-white/60">{hovered.sub}</span>
              </span>
            )}
          </div>
        </div>

        <div className="ov-foot relative z-10 pb-6">
          <p className="mb-2.5 text-center text-[11px] text-white/45">
            Drag to turn · click a clip to play · arrow keys also work
          </p>
          {/* Every clip is a real card here too, so the set is reachable whether
              or not the canvas ever starts. */}
          <div className="mx-auto grid max-w-[1100px] gap-3 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
            {clips.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setPlaying(c)}
                onMouseEnter={() => setHovered(c)}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => setHovered(c)}
                onBlur={() => setHovered(null)}
                className="rounded-lg border border-white/12 bg-white/[0.04] p-3 text-left transition-colors hover:border-white/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff9933]"
              >
                <span className="text-[9px] font-bold uppercase tracking-wide text-[#ffc27a]">
                  {c.kind === "video" ? "Reel" : "Still"}
                </span>
                <span className="mt-1 block text-[12.5px] font-bold leading-snug text-white">
                  {c.t}
                </span>
                <span className="mt-0.5 block text-[11px] text-white/50">{c.sub}</span>
              </button>
            ))}
          </div>
          <p className="mt-3 px-4 text-center text-[10px] text-white/30 sm:px-6">
            Source: {mediaSource}
          </p>
        </div>
      </section>

      <AnimatePresence>
        {playing && (
          <motion.div
            className="fixed inset-0 z-[60] grid place-items-center bg-black/80 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPlaying(null)}
            role="dialog"
            aria-modal="true"
            aria-label={playing.t}
          >
            <motion.div
              className="w-full max-w-3xl overflow-hidden rounded-xl border border-white/15 bg-[#061428]"
              initial={{ scale: 0.96, y: 12 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.96, y: 12 }}
              transition={{ duration: 0.24, ease: EASE }}
              onClick={(e) => e.stopPropagation()}
            >
              {playing.kind === "video" ? (
                <video src={playing.src} controls autoPlay playsInline className="w-full bg-black" />
              ) : (
                <img src={playing.src} alt={playing.t} className="max-h-[70vh] w-full object-contain bg-black" />
              )}
              <div className="flex items-start justify-between gap-4 p-4">
                <div className="min-w-0">
                  <h3 className="text-[15px] font-bold text-white">{playing.t}</h3>
                  <p className="mt-0.5 text-[12px] text-white/55">{playing.sub}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setPlaying(null)}
                  aria-label="Close player"
                  className="shrink-0 rounded-full border border-white/20 p-2 text-white/70 transition-colors hover:border-white/50 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff9933]"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </>
  );
}
