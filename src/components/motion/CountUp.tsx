"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";

/* A plain count-up. It replaces the slot-machine / odometer digit drums the
 * homepage used for stats (UX feedback #6, #7): those rolled every digit
 * through 0–9 twice, which read as noise next to the calm Data Insights
 * section the client picked as the benchmark.
 *
 * Runs when it scrolls into view, or when `active` says so (a card that
 * expands on hover drives it that way). Re-runs each time, like the old drum.
 * Under reduced motion it just shows the number.
 */
export function CountUp({
  value,
  decimals = 0,
  duration = 1400,
  active,
  prefix = "",
  suffix = "",
  className = "",
}: {
  value: number;
  decimals?: number;
  duration?: number;
  /** override the in-view trigger */
  active?: boolean;
  prefix?: string;
  suffix?: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: false, amount: 0.5 });
  const reduced = useReducedMotion();
  const run = active ?? inView;
  const [n, setN] = useState(0);

  useEffect(() => {
    if (reduced) { setN(value); return; }
    if (!run) { setN(0); return; }
    let raf = 0;
    const t0 = performance.now();
    const step = (t: number) => {
      const p = Math.min((t - t0) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(value * eased);
      if (p < 1) raf = requestAnimationFrame(step);
      else setN(value);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [run, value, duration, reduced]);

  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      {prefix}
      {n.toLocaleString("en-IN", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}
      {suffix}
    </span>
  );
}
