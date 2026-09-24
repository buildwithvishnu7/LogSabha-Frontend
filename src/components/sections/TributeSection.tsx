"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Play } from "lucide-react";
import { loadLottieInView } from "@/lib/lottie";
import { ScrollReveal, ScrollRevealLine } from "@/components/motion/ScrollReveal";
import { HOME_CARD, HOME_PLAY } from "@/styles/tokens";
import { tributeData, type TributeFigure } from "@/data/tribute";

/* "हमारे श्रद्धेय" — the homepage tribute the client asked for (add-on #3).
 *
 * Layout follows the client's wireframe: one large player on the left, a
 * column of four on the right, View All at the end. The right column always
 * shows the four figures that are NOT playing, so a click swaps them in; View
 * All opens the full set of eight below as tiles.
 *
 * Components are the homepage's own — HOME_CARD, HOME_PLAY, the shared
 * reveal / stagger, the amber CTA with the Lottie arrow — so it sits beside
 * the Kurukshetra section as one page.
 *
 * Videos are the client's clips and none exist yet: the player shows the
 * portrait with a "coming soon" tag until a file lands at `figure.video`.
 * A 404 is detected on mount as well as via onError, because the browser
 * starts (and fails) the load before React attaches handlers.
 */

// ─── Inline Lottie icon (same helper the other sections carry) ───
function TributeLottieIcon({ src, size = 18, color = "#ffffff" }: { src: string; size?: number; color?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const colorRef = useRef(color);
  colorRef.current = color;
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let cancelled = false;
    fetch(src).then(r => r.json()).then(json => {
      if (cancelled) return;
      el.innerHTML = "";
      const anim = loadLottieInView({ container: el, animationData: json });
      const recolor = () => {
        const c = colorRef.current;
        el.querySelectorAll("path,circle,rect,line,ellipse,polyline,polygon").forEach(p => {
          const s = p.getAttribute("stroke"); if (s && s !== "none" && s !== "transparent") p.setAttribute("stroke", c);
          const f = p.getAttribute("fill"); if (f && f !== "none" && f !== "transparent") p.setAttribute("fill", c);
        });
      };
      anim.addEventListener("DOMLoaded", recolor);
      anim.addEventListener("enterFrame", recolor);
    }).catch(() => {});
    return () => { cancelled = true; el.innerHTML = ""; };
  }, [src]);
  return <div ref={ref} style={{ width: size, height: size, display: "inline-flex" }} />;
}

// ─── Portrait (or the saffron tile when no image exists yet) ───
function Portrait({ figure, className = "", compact = false }: { figure: TributeFigure; className?: string; compact?: boolean }) {
  if (figure.poster) {
    return (
      <img
        src={figure.poster}
        alt={figure.name}
        loading="lazy"
        className={`h-full w-full object-cover object-top ${className}`}
      />
    );
  }
  // `compact` is the 96px row thumbnail — the name has to fit two short
  // lines there, not run off the tile
  return (
    <div className={`flex h-full w-full items-center justify-center bg-gradient-to-br from-amber-500 via-orange-500 to-amber-700 ${className}`}>
      <span
        className={
          compact
            ? "line-clamp-2 px-1 text-center text-[10px] font-bold leading-tight text-white drop-shadow"
            : "px-3 text-center text-lg font-extrabold leading-tight text-white drop-shadow sm:text-2xl"
        }
      >
        {figure.nameHi}
      </span>
    </div>
  );
}

// ─── The player ───
function Player({ figure, missing, onMissing }: { figure: TributeFigure; missing: boolean; onMissing: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  // a load that already failed during HTML parsing is only visible here
  useEffect(() => {
    setPlaying(false);
    const v = videoRef.current;
    if (v?.error) onMissing();
  }, [figure.slug, onMissing]);

  const play = () => {
    const v = videoRef.current;
    if (!v) return;
    v.play().then(() => setPlaying(true)).catch(() => {});
  };

  return (
    <div className={`relative aspect-video w-full overflow-hidden bg-gray-900 ${HOME_CARD}`}>
      <AnimatePresence mode="wait">
        <motion.div
          key={figure.slug}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.03 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* portrait underneath; the video paints over it once it can */}
          <Portrait figure={figure} />
          {!missing && (
            <video
              ref={videoRef}
              src={figure.video}
              poster={figure.poster}
              playsInline
              preload="metadata"
              controls={playing}
              onError={onMissing}
              onPause={() => setPlaying(false)}
              onPlay={() => setPlaying(true)}
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${playing ? "opacity-100" : "opacity-0"}`}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* bottom band: who this is */}
      {!playing && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/75 via-black/35 to-transparent px-5 pb-4 pt-14 sm:px-6">
          <p className="text-lg font-extrabold text-white sm:text-2xl">{figure.nameHi}</p>
          <p className="text-xs text-white/80 sm:text-sm">
            {figure.name} · {figure.line}
          </p>
        </div>
      )}

      {/* play, or the honest tag when there is nothing to play yet */}
      {!playing && (
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          {missing ? (
            <span className="rounded-full border border-white/30 bg-black/45 px-3 py-1.5 text-xs font-semibold tracking-wide text-white/90 backdrop-blur-sm">
              {tributeData.comingSoonLabel}
            </span>
          ) : (
            <motion.button
              type="button"
              aria-label={`Play — ${figure.name}`}
              onClick={play}
              className={`${HOME_PLAY} cursor-pointer`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Play className="ml-1 h-6 w-6 fill-current" />
            </motion.button>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Right-column row ───
function FigureRow({ figure, index, onPick }: { figure: TributeFigure; index: number; onPick: () => void }) {
  return (
    <motion.button
      type="button"
      onClick={onPick}
      // lg: flex-1 + min-h-0 lets the four rows share the player's height
      // exactly — growing on a wide screen, shrinking on a narrow one —
      // instead of the column setting its own height and leaving a gap
      className={`group flex w-full items-center gap-3 overflow-hidden p-2 text-left lg:min-h-0 lg:flex-1 ${HOME_CARD} hover:border-amber-300`}
      initial={{ opacity: 0, x: 24 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: false, amount: 0.4 }}
      transition={{ duration: 0.5, delay: 0.15 + index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ x: -4 }}
    >
      <span className="relative aspect-video w-24 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100 sm:w-28 xl:w-32">
        <Portrait figure={figure} compact className="transition-transform duration-500 group-hover:scale-105" />
        <span className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/25">
          <Play className="h-4 w-4 fill-current text-white opacity-0 drop-shadow transition-opacity group-hover:opacity-100" />
        </span>
      </span>
      <span className="min-w-0">
        <span className="block truncate text-sm font-bold text-gray-900 transition-colors group-hover:text-amber-600">
          {figure.nameHi}
        </span>
        <span className="block truncate text-xs text-gray-500">{figure.line}</span>
      </span>
    </motion.button>
  );
}

// ─── Tile in the expanded grid ───
function FigureTile({ figure, index, active, onPick }: { figure: TributeFigure; index: number; active: boolean; onPick: () => void }) {
  return (
    <motion.button
      type="button"
      onClick={onPick}
      aria-pressed={active}
      className={`group flex flex-col overflow-hidden text-left ${HOME_CARD} ${active ? "border-amber-400 ring-2 ring-amber-300/60" : ""}`}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12 }}
      transition={{ duration: 0.45, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -4 }}
    >
      <span className="relative aspect-video w-full overflow-hidden bg-gray-100">
        <Portrait figure={figure} className="transition-transform duration-500 group-hover:scale-105" />
      </span>
      <span className="p-3">
        <span className="block text-sm font-bold text-gray-900 transition-colors group-hover:text-amber-600">{figure.nameHi}</span>
        <span className="mt-0.5 block text-xs text-gray-500">{figure.name}</span>
      </span>
    </motion.button>
  );
}

// ─── Main Section ───
export function TributeSection() {
  const { figures } = tributeData;
  const [active, setActive] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [missing, setMissing] = useState<Record<string, boolean>>({});

  const current = figures[active];
  // the four after the current one, wrapping — never the one already playing
  const sideList = Array.from({ length: Math.min(4, figures.length - 1) }, (_, i) => figures[(active + 1 + i) % figures.length]);

  const markMissing = (slug: string) => () => setMissing((m) => (m[slug] ? m : { ...m, [slug]: true }));
  const pick = (figure: TributeFigure) => {
    const i = figures.findIndex((f) => f.slug === figure.slug);
    if (i >= 0) setActive(i);
  };

  return (
    <section className="relative overflow-hidden bg-white py-8 sm:py-10 lg:py-12">
      {/* Dot pattern background — same as the Community section */}
      <div className="absolute inset-0 opacity-[0.025]">
        <div
          className="h-full w-full"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, rgb(0,0,0) 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 xl:px-12">
        {/* Header */}
        <div className="text-center">
          <ScrollReveal>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-600">{tributeData.kicker}</p>
          </ScrollReveal>
          <ScrollReveal delay={0.05}>
            <h2 className="mt-2 text-2xl font-extrabold text-gray-900 sm:text-3xl lg:text-4xl">
              {tributeData.title}
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <p className="mx-auto mt-2 max-w-2xl text-sm text-gray-500 sm:text-base">{tributeData.subtitle}</p>
          </ScrollReveal>
          <ScrollRevealLine delay={0.2} className="mx-auto mt-3 h-[3px] w-12 rounded-full bg-amber-500" />
        </div>

        {/* Player + side column — the wireframe. The column is exactly the
            player's height: the grid row is set by the 16:9 player, the
            column fills it, the four rows share the space equally and the
            View More button closes the column flush with the player's
            bottom edge. */}
        <div className="mt-6 grid gap-5 sm:mt-8 lg:grid-cols-[1fr_340px] lg:items-stretch lg:gap-6 xl:grid-cols-[1fr_380px]">
          <ScrollReveal className="min-w-0">
            <Player figure={current} missing={!!missing[current.slug]} onMissing={markMissing(current.slug)} />
          </ScrollReveal>

          <div className="flex flex-col gap-3 lg:h-full lg:min-h-0">
            {sideList.map((f, i) => (
              <FigureRow key={f.slug} figure={f} index={i} onPick={() => pick(f)} />
            ))}

            <motion.button
              type="button"
              aria-expanded={expanded}
              onClick={() => setExpanded((e) => !e)}
              className="mt-1 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-amber-500/20 transition-shadow hover:shadow-lg hover:shadow-amber-500/30"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.5 }}
              transition={{ duration: 0.5, delay: 0.55 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {expanded ? tributeData.viewLessLabel : tributeData.viewAllLabel}
              <motion.span animate={{ rotate: expanded ? 90 : 0 }} transition={{ duration: 0.25 }} className="inline-flex">
                <TributeLottieIcon src="/lottie/fast-forward.json" size={22} color="#ffffff" />
              </motion.span>
            </motion.button>
          </div>
        </div>

        {/* View All → the full set, in place */}
        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              key="all"
              className="mt-6 grid grid-cols-2 gap-4 sm:mt-8 md:grid-cols-4"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              {figures.map((f, i) => (
                <FigureTile key={f.slug} figure={f} index={i} active={i === active} onPick={() => pick(f)} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
