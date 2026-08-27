"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "motion/react";

/* ═══════════════════════════════════════════════════════════════════════
   DEPTH PRIMITIVES — the approved "Full 3D Political Interface" language.
   Light ground, white surfaces that float, blue + orange accents, and real
   product UI rather than abstract 3D shapes.

   Every page is built from these so depth is a system, not a per-page trick.
   ═══════════════════════════════════════════════════════════════════════ */

export const D = {
  ground: "#F7F9FC",
  surface: "#FFFFFF",
  ink: "#0F172A",
  muted: "#64748B",
  hairline: "#E6EAF2",
  blue: "#2563EB",
  blueLight: "#3B82F6",
  violet: "#7C3AED",
  orange: "#F97316",
  amber: "#FF9933",
  green: "#16A34A",
} as const;

/** Three elevation steps. Cards must sit on one of these, never a custom shadow —
 *  inconsistent shadow depth is what makes a "floating" layout look flat. */
export const LIFT = {
  1: "0 2px 8px -2px rgba(15,23,42,0.08), 0 1px 2px rgba(15,23,42,0.04)",
  2: "0 12px 28px -8px rgba(15,23,42,0.14), 0 4px 8px -4px rgba(15,23,42,0.06)",
  3: "0 28px 60px -20px rgba(30,58,138,0.22), 0 10px 20px -10px rgba(15,23,42,0.08)",
} as const;

export const EASE = [0.16, 1, 0.3, 1] as const;

/* ── background ──────────────────────────────────────────────────────── */

/** The airy ground: two soft colour fields over a fine grid, masked at the
 *  edges. This is what stops a light page reading as plain white. */
export function GlowField({
  className = "",
  tone = "blue",
}: {
  className?: string;
  tone?: "blue" | "orange" | "both";
}) {
  return (
    <div aria-hidden className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      {(tone === "blue" || tone === "both") && (
        <span className="absolute -left-[15%] -top-[20%] h-[70vh] w-[70vh] rounded-full bg-[radial-gradient(circle,rgba(37,99,235,0.14),transparent_65%)] blur-3xl" />
      )}
      {(tone === "orange" || tone === "both") && (
        <span className="absolute -right-[15%] top-[30%] h-[60vh] w-[60vh] rounded-full bg-[radial-gradient(circle,rgba(249,115,22,0.13),transparent_65%)] blur-3xl" />
      )}
      <span
        className="absolute inset-0 opacity-[0.5]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(15,23,42,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(15,23,42,0.04) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage: "radial-gradient(120% 90% at 50% 30%, #000 25%, transparent 75%)",
          WebkitMaskImage: "radial-gradient(120% 90% at 50% 30%, #000 25%, transparent 75%)",
        }}
      />
    </div>
  );
}

/* ── floating card ───────────────────────────────────────────────────── */

/** A white surface that tilts toward the pointer. The tilt is small on purpose:
 *  past a few degrees the text edges alias and it stops reading as a UI panel
 *  and starts reading as a toy. Disabled entirely under reduced motion. */
export function FloatingCard({
  children,
  className = "",
  lift = 2,
  tilt = 6,
  rotate = 0,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  lift?: 1 | 2 | 3;
  /** max degrees of pointer tilt */
  tilt?: number;
  /** static resting angle, for stacked/scattered arrangements */
  rotate?: number;
  style?: React.CSSProperties;
}) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 260, damping: 24 });
  const sy = useSpring(my, { stiffness: 260, damping: 24 });
  const rotateX = useTransform(sy, [-0.5, 0.5], [tilt, -tilt]);
  const rotateY = useTransform(sx, [-0.5, 0.5], [-tilt, tilt]);

  const onMove = (e: React.PointerEvent) => {
    if (reduced || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const reset = () => { mx.set(0); my.set(0); };

  return (
    <motion.div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={reset}
      className={`rounded-2xl border border-[#E6EAF2] bg-white ${className}`}
      style={{
        boxShadow: LIFT[lift],
        rotate,
        rotateX: reduced ? 0 : rotateX,
        rotateY: reduced ? 0 : rotateY,
        transformPerspective: 1000,
        transformStyle: "preserve-3d",
        ...style,
      }}
      whileHover={reduced ? undefined : { y: -4, boxShadow: LIFT[3] }}
      transition={{ duration: 0.3, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/* ── stat tile ───────────────────────────────────────────────────────── */

export function StatTile({
  value,
  label,
  tone = "blue",
  icon,
}: {
  value: React.ReactNode;
  label: string;
  tone?: "blue" | "orange" | "green";
  icon?: React.ReactNode;
}) {
  const c = tone === "orange" ? D.orange : tone === "green" ? D.green : D.blue;
  return (
    <div className="flex items-center gap-3">
      {icon && (
        <span
          className="grid h-9 w-9 shrink-0 place-items-center rounded-xl"
          style={{ background: `${c}14`, color: c }}
        >
          {icon}
        </span>
      )}
      <div className="min-w-0">
        <div className="text-xl font-extrabold leading-none" style={{ color: D.ink }}>
          {value}
        </div>
        <div className="mt-1 truncate text-[10px] font-semibold uppercase tracking-wide" style={{ color: D.muted }}>
          {label}
        </div>
      </div>
    </div>
  );
}

/* ── gradient headline ───────────────────────────────────────────────── */

/** The poster's blue→violet gradient word. Used for ONE word per headline —
 *  a whole gradient sentence loses the emphasis it is there to create. */
export function GradientWord({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="bg-clip-text text-transparent"
      style={{
        backgroundImage: `linear-gradient(100deg, ${D.blue}, ${D.violet})`,
        // Devanagari and descenders need room inside the painted box.
        paddingBottom: "0.08em",
      }}
    >
      {children}
    </span>
  );
}

/* ── section shell ───────────────────────────────────────────────────── */

export function Section({
  children,
  className = "",
  id,
  ground = D.ground,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
  ground?: string;
}) {
  return (
    <section id={id} className={`relative overflow-hidden py-16 sm:py-24 ${className}`} style={{ background: ground }}>
      {children}
    </section>
  );
}

export function useRevealProps(delay = 0) {
  return {
    initial: { opacity: 0, y: 22 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: false, amount: 0.35 },
    transition: { duration: 0.6, delay, ease: EASE },
  } as const;
}

