"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import { speeches, type Speech } from "@/data/speeches";

const BroadcastWall = dynamic(() => import("@/components/three/BroadcastWall"), {
  ssr: false,
  loading: () => <WallFallback />,
});

function WallFallback() {
  return (
    <div className="absolute inset-0 grid place-items-center">
      <div className="flex items-center gap-2">
        {[0.6, 0.8, 1, 0.8, 0.6].map((s, i) => (
          <span
            key={i}
            className="rounded bg-white/10"
            style={{ width: 54 * s, height: 31 * s }}
          />
        ))}
      </div>
    </div>
  );
}

export function WallSection() {
  const ref = useRef<HTMLElement>(null);
  const [near, setNear] = useState(false);
  const [index, setIndex] = useState(0);
  const [hovered, setHovered] = useState<Speech | null>(null);
  const [playing, setPlaying] = useState<Speech | null>(null);

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

  // Escape closes the player, which is the only thing on this page that traps
  // attention.
  useEffect(() => {
    if (!playing) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setPlaying(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [playing]);

  const current = hovered ?? speeches[index];

  return (
    <section
      ref={ref}
      id="wall"
      // .oneview, not .oneview-lg: every 3D section in the reference is full
      // height at every width. The lg-only variant is for the analytics
      // explorer alone, which pairs its canvas with a 36-row table.
      className="oneview relative overflow-hidden bg-[#061428] text-white"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <span className="absolute left-1/2 top-1/2 h-[80vh] w-[80vh] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(27,110,194,0.20),transparent_62%)] blur-2xl" />
        <span className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_50%,transparent_45%,rgba(6,20,40,0.9)_100%)]" />
      </div>

      <div className="ov-head relative z-10 mx-auto w-full max-w-[1440px] px-4 pt-10 text-center sm:px-6 lg:pt-[calc(var(--header-h)+18px)]">
        <motion.span
          className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#ffc27a]"
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.6 }}
          transition={{ duration: 0.5 }}
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#e11d48] opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#e11d48]" />
          </span>
          The broadcast wall
        </motion.span>
        <motion.h2
          className="mt-2 text-[clamp(20px,2.4vw,34px)] font-extrabold tracking-tight"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.6 }}
          transition={{ duration: 0.6, delay: 0.05 }}
        >
          The House, on screen
        </motion.h2>
        <p className="mx-auto mt-2 max-w-[62ch] text-[clamp(12px,1vw,14px)] leading-relaxed text-white/65">
          Drag the wall to pan across the sessions. Click a screen to play it.
        </p>
      </div>

      <div className="ov-stage relative z-10">
        {near ? (
          <BroadcastWall
            items={speeches}
            index={index}
            onIndexChange={setIndex}
            selectedId={playing?.id ?? null}
            onHoverItem={setHovered}
            onSelectItem={setPlaying}
          />
        ) : (
          <WallFallback />
        )}

        <div
          role="status"
          aria-live="polite"
          className="pointer-events-none absolute inset-x-0 bottom-1 flex justify-center px-4"
        >
          <span className="max-w-[76ch] rounded-full border border-white/15 bg-[#061428]/88 px-4 py-1.5 text-center text-[11px] backdrop-blur">
            {current.live && <b className="mr-2 font-extrabold text-[#e11d48]">LIVE</b>}
            <span className="font-semibold text-white">{current.leader}</span>
            <span className="ml-2 text-white/60">
              {current.house} · {current.session}
              {current.year ? ` · ${current.year}` : ""}
            </span>
          </span>
        </div>
      </div>

      <div className="ov-foot relative z-10 pb-6">
        <p className="mb-2.5 text-center text-[11px] text-white/45">
          Drag to pan · click a screen to play · arrow keys and Enter also work
        </p>
        {/* Real buttons for every clip, so the library is usable with the canvas
            absent, failed, or invisible to a screen reader. */}
        <div className="flex gap-2 overflow-x-auto px-4 pb-2 sm:px-6" role="list">
          {speeches.map((s, i) => (
            <button
              key={s.id}
              type="button"
              role="listitem"
              onClick={() => (index === i ? setPlaying(s) : setIndex(i))}
              onMouseEnter={() => setHovered(s)}
              onMouseLeave={() => setHovered(null)}
              onFocus={() => setHovered(s)}
              onBlur={() => setHovered(null)}
              className={
                "w-[210px] shrink-0 rounded-lg border p-2.5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff9933] " +
                (index === i
                  ? "border-[#ff9933] bg-white/[0.08]"
                  : "border-white/12 bg-white/[0.03] hover:border-white/30")
              }
            >
              <span className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wide">
                {s.live ? (
                  <span className="text-[#e11d48]">● Live</span>
                ) : (
                  <span className="text-[#ffc27a]">{s.house}</span>
                )}
              </span>
              <span className="mt-1 line-clamp-2 block text-[11px] font-semibold leading-snug text-white">
                {s.title}
              </span>
              <span className="mt-1 block text-[10px] text-white/50">{s.leader}</span>
            </button>
          ))}
        </div>
      </div>

      {/* the player */}
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
            aria-label={playing.title}
          >
            <motion.div
              className="w-full max-w-4xl overflow-hidden rounded-xl border border-white/15 bg-[#061428]"
              initial={{ scale: 0.96, y: 12 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.96, y: 12 }}
              transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <video
                src={playing.src}
                controls
                autoPlay
                playsInline
                className="aspect-video w-full bg-black"
              />
              <div className="flex items-start justify-between gap-4 p-4">
                <div className="min-w-0">
                  <h3 className="text-[15px] font-bold leading-snug text-white">{playing.title}</h3>
                  <p className="mt-1 text-[12px] text-white/55">
                    {playing.leader} · {playing.role} · {playing.party} — {playing.house},{" "}
                    {playing.session}
                    {playing.year ? ` ${playing.year}` : ""}
                  </p>
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
    </section>
  );
}
