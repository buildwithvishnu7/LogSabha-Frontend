"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";

// Typewriter reveal for headings. Runs a continuous type → hold → erase → retype
// loop while the heading is in view, and stops (and resets) once it scrolls out
// so idle sections aren't burning timers.
//
// Two things this deliberately does NOT do, both because of Devanagari:
//
// 1. It never slices the string. "राष्ट्रीय" is 9 code points but 4 characters
//    a reader sees — slicing mid-cluster renders orphan matras (्, ी) that look
//    like corruption. Intl.Segmenter groups code points into grapheme clusters,
//    i.e. what a human counts as one character.
//
// 2. It never grows the text box. All graphemes are laid out from frame one and
//    only their opacity flips, so the heading occupies its final size the whole
//    time. A width-growing typewriter re-centers a `text-center` heading on
//    every keystroke (visible wobble) and shoves the content below it around.
//    The caret is absolutely positioned INSIDE the current grapheme, so it
//    travels with the text — including across line wraps — at zero layout cost.

function toGraphemes(text: string): string[] {
  if (typeof Intl !== "undefined" && "Segmenter" in Intl) {
    const seg = new Intl.Segmenter(undefined, { granularity: "grapheme" });
    return Array.from(seg.segment(text), (s) => s.segment);
  }
  return Array.from(text); // code-point fallback for old browsers
}

type Phase = "typing" | "holding" | "deleting" | "restarting";

export function Typewriter({
  text,
  className = "",
  /** ms per character while typing */
  speed = 34,
  /** ms per character while erasing — erasing reads fast, typing reads slow */
  deleteSpeed = 18,
  /** ms the finished heading stays fully readable before erasing */
  holdMs = 2200,
  /** ms of empty line before it starts typing again */
  restartMs = 500,
  /** ms to wait after the heading enters view before the first pass */
  startDelay = 250,
  /** false = type once and stop */
  loop = true,
  caret = true,
}: {
  text: string;
  className?: string;
  speed?: number;
  deleteSpeed?: number;
  holdMs?: number;
  restartMs?: number;
  startDelay?: number;
  loop?: boolean;
  caret?: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: false, amount: 0.5 });
  const reduced = useReducedMotion();

  const graphemes = useMemo(() => toGraphemes(text), [text]);
  const [count, setCount] = useState(0);
  const [settled, setSettled] = useState(false); // only used when loop = false

  useEffect(() => {
    // Reduced motion: no typing, just the finished heading.
    if (reduced) {
      setCount(graphemes.length);
      setSettled(true);
      return;
    }
    if (!inView) {
      setCount(0);
      setSettled(false);
      return;
    }

    const n = graphemes.length;
    let i = 0;
    let phase: Phase = "typing";
    let timer: ReturnType<typeof setTimeout>;

    const step = () => {
      switch (phase) {
        case "typing":
          i += 1;
          setCount(i);
          if (i < n) {
            // Slight deterministic variance so the rhythm reads as typed, not
            // metered. Deterministic (not Math.random) to keep SSR/client in step.
            timer = setTimeout(step, speed + (i % 5) * 6);
          } else if (loop) {
            phase = "holding";
            timer = setTimeout(step, holdMs);
          } else {
            setSettled(true);
          }
          return;

        case "holding":
          phase = "deleting";
          timer = setTimeout(step, deleteSpeed);
          return;

        case "deleting":
          i -= 1;
          setCount(i);
          if (i > 0) {
            timer = setTimeout(step, deleteSpeed);
          } else {
            phase = "restarting";
            timer = setTimeout(step, restartMs);
          }
          return;

        case "restarting":
          phase = "typing";
          step();
          return;
      }
    };

    setCount(0);
    setSettled(false);
    timer = setTimeout(step, startDelay);
    return () => clearTimeout(timer);
  }, [
    inView,
    reduced,
    graphemes.length,
    speed,
    deleteSpeed,
    holdMs,
    restartMs,
    startDelay,
    loop,
  ]);

  // Caret anchor. `count` indexes into graphemes (spaces included), but spaces
  // render as bare text nodes, so walk back to the nearest span-backed grapheme —
  // otherwise the caret blinks out for a tick every time it crosses a space.
  const caretIndex = useMemo(() => {
    let k = Math.max(0, count - 1);
    while (k > 0 && graphemes[k] === " ") k -= 1;
    return k;
  }, [count, graphemes]);

  // Looping headings keep the caret; a one-shot heading drops it once settled.
  const showCaret = caret && !reduced && inView && !(!loop && settled);
  const caretAtStart = count === 0;

  return (
    // aria-label carries the real string; the per-grapheme spans are hidden so
    // screen readers say the heading instead of spelling it out — and so the
    // erase phase never reaches assistive tech as text disappearing.
    <span ref={ref} className={className} aria-label={text}>
      {graphemes.map((g, i) =>
        // Spaces stay bare text nodes: they're invisible anyway, and keeping
        // them outside spans preserves normal line-break opportunities.
        g === " " ? (
          " "
        ) : (
          <span
            key={i}
            aria-hidden
            className="relative"
            style={{
              opacity: i < count ? 1 : 0,
              transition: "opacity 90ms linear",
            }}
          >
            {g}
            {showCaret && i === caretIndex && (
              <motion.span
                className={`pointer-events-none absolute top-[0.14em] bottom-[0.14em] w-[0.055em] rounded-[1px] bg-current ${
                  caretAtStart ? "-left-[0.05em]" : "-right-[0.05em]"
                }`}
                animate={{ opacity: [1, 1, 0, 0] }}
                transition={{ duration: 0.9, times: [0, 0.5, 0.5, 1], repeat: Infinity }}
              />
            )}
          </span>
        ),
      )}
    </span>
  );
}
