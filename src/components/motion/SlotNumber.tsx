"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "motion/react";

// Slot-machine number reel. Spins through 0-9 a couple of times, then lands on
// the target digit — and RE-RUNS every time the element scrolls back into view
// (viewport `once: false`), so numbers never sit there statically.

const SLOT_CYCLES = 2;
const DIGIT_H = 1.15; // em — height of one digit cell

function SlotDigit({
  target,
  delay,
  active,
  width,
}: {
  target: number;
  delay: number;
  active: boolean;
  width: string;
}) {
  const total = SLOT_CYCLES * 10 + target;
  const digits: number[] = [];
  for (let i = 0; i <= total; i++) digits.push(i % 10);

  return (
    <span
      className="relative inline-block overflow-hidden align-bottom"
      style={{ height: `${DIGIT_H}em`, width, fontVariantNumeric: "tabular-nums" }}
    >
      <motion.span
        className="block will-change-transform"
        initial={{ y: 0 }}
        animate={active ? { y: `${-total * DIGIT_H}em` } : { y: 0 }}
        transition={{
          duration: 1.25 + total * 0.012,
          delay,
          ease: [0.16, 1, 0.3, 1],
        }}
      >
        {digits.map((d, i) => (
          <span
            key={i}
            className="block text-center"
            style={{ height: `${DIGIT_H}em`, lineHeight: `${DIGIT_H}em` }}
          >
            {d}
          </span>
        ))}
      </motion.span>
    </span>
  );
}

export function SlotNumber({
  value,
  className = "",
  digitWidth = "0.62em",
  stagger = 0.08,
  startDelay = 0,
}: {
  /** Any display value — digits animate, everything else (%, +, K, M) rides along. */
  value: string | number;
  className?: string;
  digitWidth?: string;
  stagger?: number;
  startDelay?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: false, amount: 0.5 });
  const [active, setActive] = useState(false);

  // Reset then replay on every entry so the reel spins again on scroll-back.
  useEffect(() => {
    if (!inView) {
      setActive(false);
      return;
    }
    setActive(false);
    const id = requestAnimationFrame(() => setActive(true));
    return () => cancelAnimationFrame(id);
  }, [inView]);

  const chars = String(value).split("");

  return (
    <span ref={ref} className={`inline-flex items-baseline ${className}`}>
      {chars.map((ch, i) =>
        /\d/.test(ch) ? (
          <SlotDigit
            key={i}
            target={parseInt(ch, 10)}
            delay={startDelay + i * stagger}
            active={active}
            width={digitWidth}
          />
        ) : (
          <motion.span
            key={i}
            className="inline-block"
            initial={{ opacity: 0, y: 6 }}
            animate={active ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
            transition={{ delay: startDelay + i * stagger + 0.15, duration: 0.4 }}
          >
            {ch === " " ? " " : ch}
          </motion.span>
        ),
      )}
    </span>
  );
}
