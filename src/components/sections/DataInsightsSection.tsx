import { useRef, useEffect, useState, useMemo } from "react";
import {
  motion,
  useInView,
  useMotionValue,
  useTransform,
  animate,
} from "motion/react";
import { ScrollReveal } from "@/components/motion/ScrollReveal";

// ─── Continuous Looping Typewriter ───

const DATA_TYPEWRITER_PHRASES = [
  "Interactive 3D-styled data visualizations providing deep insights into India's electoral landscape.",
  "Explore seat share, state-wise breakdowns, and historical trends through dynamic charts.",
  "Real-time analytics powering a deeper understanding of Indian democracy's evolving numbers.",
  "From voter turnout to coalition patterns — data tells the story of India's elections.",
];

function LoopingTypewriter({ className }: { className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const isInView = useInView(ref, { once: false, amount: 0.5 });
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [displayedCount, setDisplayedCount] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const currentPhrase = DATA_TYPEWRITER_PHRASES[phraseIndex];
  const chars = useMemo(() => [...currentPhrase], [currentPhrase]);

  useEffect(() => {
    if (!isInView) return;

    if (!isDeleting && displayedCount >= chars.length) {
      const timeout = setTimeout(() => setIsDeleting(true), 2200);
      return () => clearTimeout(timeout);
    }

    if (isDeleting && displayedCount === 0) {
      setIsDeleting(false);
      setPhraseIndex((i) => (i + 1) % DATA_TYPEWRITER_PHRASES.length);
      return;
    }

    const speed = isDeleting ? 20 : 35;
    const timeout = setTimeout(() => {
      setDisplayedCount((c) => c + (isDeleting ? -1 : 1));
    }, speed);
    return () => clearTimeout(timeout);
  }, [isInView, displayedCount, chars.length, isDeleting]);

  return (
    <p ref={ref} className={className}>
      <span>{chars.slice(0, displayedCount).join("")}</span>
      {isInView && (
        <motion.span
          className="inline-block h-[1em] w-[2px] translate-y-[2px] bg-amber-500"
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
        />
      )}
    </p>
  );
}

// ─── Data ───

const PARTY_SEATS = [
  { party: "BJP", seats: 240, color: "#f97316" },
  { party: "INC", seats: 90, color: "#22c55e" },
  { party: "SP", seats: 37, color: "#ef4444" },
  { party: "TMC", seats: 29, color: "#06b6d4" },
  { party: "DMK", seats: 22, color: "#ec4899" },
  { party: "Others", seats: 125, color: "#6b7280" },
];
const TOTAL_SEATS = 543;

const STATE_BAR_DATA = [
  { state: "UP", bjp: 33, inc: 6, others: 41 },
  { state: "MH", bjp: 9, inc: 13, others: 26 },
  { state: "WB", bjp: 12, inc: 1, others: 29 },
  { state: "Bihar", bjp: 12, inc: 3, others: 25 },
  { state: "TN", bjp: 0, inc: 0, others: 39 },
  { state: "KA", bjp: 17, inc: 9, others: 2 },
];

const HISTORICAL_DATA = [
  { year: 2004, bjp: 138, inc: 145 },
  { year: 2009, bjp: 116, inc: 206 },
  { year: 2014, bjp: 282, inc: 44 },
  { year: 2019, bjp: 303, inc: 52 },
  { year: 2024, bjp: 240, inc: 90 },
];

const BOTTOM_STATS = [
  {
    value: 543,
    decimals: 0,
    suffix: "",
    label: "Total Constituencies",
    change: "+0%",
    positive: true,
    color: "#f97316",
  },
  {
    value: 96.8,
    decimals: 1,
    suffix: "Cr",
    label: "Registered Voters",
    change: "+3.2%",
    positive: true,
    color: "#3b82f6",
  },
  {
    value: 65.8,
    decimals: 1,
    suffix: "%",
    label: "Voter Turnout 2024",
    change: "-1.6%",
    positive: false,
    color: "#22c55e",
  },
  {
    value: 47.1,
    decimals: 1,
    suffix: "Cr",
    label: "Women Voters",
    change: "+4.8%",
    positive: true,
    color: "#ec4899",
  },
];

// ─── Chart layout constants ───

const BAR = {
  W: 360,
  H: 240,
  ml: 35,
  mr: 10,
  mt: 10,
  mb: 40,
  yMax: 50,
  barW: 11,
  barGap: 3,
};
const BAR_CW = BAR.W - BAR.ml - BAR.mr;
const BAR_CH = BAR.H - BAR.mt - BAR.mb;

const LINE = { W: 360, H: 240, ml: 40, mr: 20, mt: 15, mb: 30, yMax: 330 };
const LINE_CW = LINE.W - LINE.ml - LINE.mr;
const LINE_CH = LINE.H - LINE.mt - LINE.mb;

// ─── AnimatedNumber (for donut center) ───

function AnimatedNumber({
  value,
  decimals = 0,
  delay = 0,
  className = "",
}: {
  value: number;
  decimals?: number;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: false, amount: 0.5 });
  const motionVal = useMotionValue(0);
  const display = useTransform(motionVal, (v) =>
    decimals > 0 ? v.toFixed(decimals) : String(Math.round(v))
  );
  const [text, setText] = useState(
    decimals > 0 ? (0).toFixed(decimals) : "0"
  );

  useEffect(() => {
    if (isInView) {
      const c = animate(motionVal, value, {
        duration: 2.5,
        delay,
        ease: [0.16, 1, 0.3, 1],
      });
      return c.stop;
    } else {
      motionVal.set(0);
      setText(decimals > 0 ? (0).toFixed(decimals) : "0");
    }
  }, [isInView, value, delay, motionVal, decimals]);

  useEffect(() => display.on("change", setText), [display]);

  return (
    <span ref={ref} className={className}>
      {text}
    </span>
  );
}

// ─── Slot Machine Number ───

const SLOT_CYCLES = 2;
const DIGIT_H = 1.15;

function SlotDigit({
  target,
  delay,
  active,
}: {
  target: number;
  delay: number;
  active: boolean;
}) {
  const total = SLOT_CYCLES * 10 + target;
  const digits: number[] = [];
  for (let i = 0; i <= total; i++) digits.push(i % 10);

  return (
    <span
      className="relative inline-block overflow-hidden align-bottom"
      style={{
        height: `${DIGIT_H}em`,
        width: "0.65em",
        fontVariantNumeric: "tabular-nums",
      }}
    >
      <motion.span
        className="block will-change-transform"
        initial={{ y: 0 }}
        animate={
          active
            ? { y: `${-total * DIGIT_H}em` }
            : { y: 0 }
        }
        transition={{
          duration: 1.3 + total * 0.012,
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

function SlotMachineNumber({
  value,
  decimals = 0,
  suffix = "",
  color,
  baseDelay = 0,
}: {
  value: number;
  decimals?: number;
  suffix?: string;
  color: string;
  baseDelay?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: false, amount: 0.5 });
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (isInView) {
      // Reset then re-activate so the slot spins from the top every visit
      setActive(false);
      requestAnimationFrame(() => setActive(true));
    } else {
      setActive(false);
    }
  }, [isInView]);

  const formatted =
    decimals > 0 ? value.toFixed(decimals) : String(Math.round(value));
  const chars = formatted.split("");

  return (
    <span
      ref={ref}
      className="inline-flex items-baseline text-2xl font-extrabold sm:text-3xl"
      style={{ color }}
    >
      {chars.map((ch, i) =>
        /\d/.test(ch) ? (
          <SlotDigit
            key={`${i}-${ch}`}
            target={parseInt(ch)}
            delay={baseDelay + i * 0.08}
            active={active}
          />
        ) : (
          <span key={`${i}-${ch}`} className="inline-block w-[0.25em] text-center">
            {ch}
          </span>
        )
      )}
      {suffix && <span className="ml-0.5">{suffix}</span>}
    </span>
  );
}

// ─── Donut Chart (SVG, dark theme) ───

function DonutChart({
  triggered,
  hoveredParty,
  onHoverParty,
}: {
  triggered: boolean;
  hoveredParty: string | null;
  onHoverParty: (p: string | null) => void;
}) {
  const R = 80;
  const C = 2 * Math.PI * R;
  let acc = 0;
  const segs = PARTY_SEATS.map((p) => {
    const frac = p.seats / TOTAL_SEATS;
    const len = frac * C;
    const off = acc;
    acc += len;
    return { ...p, len, off, frac };
  });

  const active = hoveredParty
    ? PARTY_SEATS.find((p) => p.party === hoveredParty)
    : null;

  return (
    <div className="relative mx-auto h-48 w-48 sm:h-52 sm:w-52">
      <svg
        viewBox="0 0 200 200"
        className="h-full w-full -rotate-90"
        onMouseLeave={() => onHoverParty(null)}
      >
        <circle
          cx="100"
          cy="100"
          r={R}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="28"
        />
        {segs.map((s, i) => {
          const hov = hoveredParty === s.party;
          const dim = hoveredParty !== null && !hov;
          return (
            <motion.circle
              key={s.party}
              cx="100"
              cy="100"
              r={R}
              fill="none"
              stroke={s.color}
              strokeLinecap="butt"
              strokeDasharray={`${s.len} ${C - s.len}`}
              initial={{ strokeDashoffset: C }}
              animate={
                triggered
                  ? {
                      strokeDashoffset: [
                        C,
                        C - s.off - s.len,
                        C - s.off - s.len,
                        C,
                        C,
                      ],
                    }
                  : { strokeDashoffset: C }
              }
              transition={
                triggered
                  ? {
                      strokeDashoffset: {
                        duration: 8,
                        times: [0, 0.22, 0.6, 0.82, 1],
                        repeat: Infinity,
                        delay: i * 0.2,
                        ease: "easeInOut",
                      },
                    }
                  : { duration: 0.3 }
              }
              style={{
                strokeWidth: hov ? 38 : 28,
                opacity: dim ? 0.3 : 1,
                transformOrigin: "100px 100px",
                cursor: "pointer",
                filter: hov
                  ? `drop-shadow(0 0 12px ${s.color}) drop-shadow(0 0 4px ${s.color})`
                  : "none",
                transition:
                  "stroke-width 0.25s ease, opacity 0.3s ease, filter 0.25s ease",
              }}
              onMouseEnter={() => onHoverParty(s.party)}
            />
          );
        })}
        {/* Continuous rotating highlight arc */}
        {triggered && !hoveredParty && (
          <motion.circle
            cx="100"
            cy="100"
            r={R}
            fill="none"
            stroke="rgba(0,0,0,0.06)"
            strokeWidth="28"
            strokeDasharray={`${C * 0.08} ${C * 0.92}`}
            animate={{ strokeDashoffset: [0, -C] }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "linear",
              delay: 2.5,
            }}
            style={{ transformOrigin: "100px 100px", pointerEvents: "none" }}
          />
        )}
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className="text-3xl font-extrabold sm:text-4xl"
          style={{ color: active ? active.color : "#1f2937" }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={
            triggered ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }
          }
          transition={{ duration: 0.8, delay: 1 }}
          key={hoveredParty ?? "total"}
        >
          {active ? (
            active.seats
          ) : (
            <AnimatedNumber
              value={triggered ? TOTAL_SEATS : 0}
              delay={0.3}
            />
          )}
        </motion.span>
        <motion.span
          className="text-[10px] font-semibold tracking-widest uppercase"
          style={{ color: active ? active.color : "#64748b" }}
          initial={{ opacity: 0, y: 8 }}
          animate={triggered ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
          transition={{ duration: 0.6, delay: 1.3 }}
          key={`lbl-${hoveredParty ?? "total"}`}
        >
          {active ? active.party : "Total Seats"}
        </motion.span>
      </div>

      {/* Continuous outer glow ring */}
      {triggered && (
        <motion.div
          className="pointer-events-none absolute inset-[-6px] rounded-full border-2"
          animate={{
            scale: [1, 1.04, 1],
            opacity: [0.2, 0.5, 0.2],
            borderColor: [
              "rgba(245,158,11,0.1)",
              "rgba(245,158,11,0.35)",
              "rgba(245,158,11,0.1)",
            ],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3,
          }}
        />
      )}
    </div>
  );
}

// ─── Seat Share Card (Donut + Legend) ───

function SeatShareCard({ triggered }: { triggered: boolean }) {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <motion.div
      className="flex h-full flex-col rounded-2xl border border-gray-200 bg-white shadow-sm p-5 sm:p-6"
      animate={
        triggered
          ? {
              borderColor: [
                "#e5e7eb",
                "rgba(245,158,11,0.25)",
                "#e5e7eb",
              ],
            }
          : {}
      }
      transition={{
        duration: 5,
        delay: 3,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      onMouseLeave={() => setHovered(null)}
    >
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-bold text-gray-900 sm:text-base">
          Lok Sabha Seat Share
        </h3>
        <span className="rounded-full bg-emerald-500/90 px-2.5 py-0.5 text-[10px] font-bold text-white shadow-lg shadow-emerald-500/20">
          543 Seats
        </span>
      </div>

      <DonutChart
        triggered={triggered}
        hoveredParty={hovered}
        onHoverParty={setHovered}
      />

      <div className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 border-t border-gray-200 pt-3">
        {PARTY_SEATS.map((p, i) => {
          const isH = hovered === p.party;
          const dim = hovered !== null && !isH;
          return (
            <motion.div
              key={p.party}
              className="flex cursor-pointer items-center gap-1.5"
              initial={{ opacity: 0 }}
              animate={
                triggered ? { opacity: dim ? 0.35 : 1 } : { opacity: 0 }
              }
              transition={{ opacity: { duration: 0.3 } }}
              onMouseEnter={() => setHovered(p.party)}
            >
              <motion.span
                className="inline-block h-2 w-2 rounded-full"
                style={{ backgroundColor: p.color }}
                initial={{ scale: 0 }}
                animate={
                  triggered ? { scale: isH ? 1.5 : 1 } : { scale: 0 }
                }
                transition={{
                  duration: 0.4,
                  delay: triggered ? 1.2 + i * 0.1 : 0,
                  type: "spring",
                  stiffness: 400,
                  damping: 15,
                }}
              />
              <span
                className="text-[10px] font-medium sm:text-xs"
                style={{ color: isH ? p.color : "#6b7280" }}
              >
                {p.party}: {p.seats}
              </span>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

// ─── Grouped Bar Chart (SVG) — continuous build + hover ───

function GroupedBarChart({ triggered }: { triggered: boolean }) {
  const [hoveredBar, setHoveredBar] = useState<{
    si: number;
    pi: number;
  } | null>(null);

  const groupW = BAR_CW / STATE_BAR_DATA.length;
  const clusterW = BAR.barW * 3 + BAR.barGap * 2;
  const pad = (groupW - clusterW) / 2;
  const gridVals = [0, 10, 20, 30, 40];

  const toY = (v: number) => BAR.mt + BAR_CH - (v / BAR.yMax) * BAR_CH;
  const bottom = BAR.mt + BAR_CH;

  const parties = [
    { key: "bjp" as const, color: "#f97316" },
    { key: "inc" as const, color: "#06b6d4" },
    { key: "others" as const, color: "#6b7280" },
  ];

  return (
    <svg
      viewBox={`0 0 ${BAR.W} ${BAR.H}`}
      className="h-full w-full"
      preserveAspectRatio="xMidYMid meet"
      onMouseLeave={() => setHoveredBar(null)}
    >
      {/* Grid lines */}
      {gridVals.map((v) => (
        <g key={v}>
          <line
            x1={BAR.ml}
            y1={toY(v)}
            x2={BAR.W - BAR.mr}
            y2={toY(v)}
            stroke="#e5e7eb"
            strokeWidth={v === 0 ? 1 : 0.5}
            strokeDasharray={v === 0 ? "none" : "4 3"}
          />
          <text
            x={BAR.ml - 5}
            y={toY(v) + 3}
            textAnchor="end"
            fill="#9ca3af"
            fontSize="9"
          >
            {v}
          </text>
        </g>
      ))}

      {/* Bars per state — continuous build loop with hover highlight + lift */}
      {STATE_BAR_DATA.map((st, si) => {
        const gx = BAR.ml + si * groupW;
        return (
          <g key={st.state}>
            {parties.map((p, pi) => {
              const val = st[p.key];
              if (val === 0) return null;
              const h = (val / BAR.yMax) * BAR_CH;
              const x = gx + pad + pi * (BAR.barW + BAR.barGap);
              const isHov =
                hoveredBar?.si === si && hoveredBar?.pi === pi;
              const isDimmed = hoveredBar !== null && !isHov;

              return (
                <motion.g
                  key={p.key}
                  onMouseEnter={() => setHoveredBar({ si, pi })}
                  animate={{ y: isHov ? -6 : 0 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  style={{ cursor: "pointer" }}
                >
                  {/* Main bar — continuous grow/hold/shrink loop */}
                  <motion.rect
                    x={x}
                    width={BAR.barW}
                    rx={2}
                    fill={p.color}
                    animate={
                      triggered
                        ? {
                            y: [
                              bottom,
                              bottom - h,
                              bottom - h,
                              bottom,
                              bottom,
                            ],
                            height: [0, h, h, 0, 0],
                          }
                        : { y: bottom, height: 0 }
                    }
                    transition={
                      triggered
                        ? {
                            duration: 7,
                            times: [0, 0.2, 0.65, 0.85, 1],
                            repeat: Infinity,
                            delay: si * 0.15 + pi * 0.06,
                            ease: "easeInOut",
                          }
                        : { duration: 0.3 }
                    }
                    style={{
                      filter: isHov
                        ? `brightness(1.4) drop-shadow(0 0 8px ${p.color})`
                        : "none",
                      opacity: isDimmed ? 0.3 : 1,
                      transition:
                        "filter 0.25s ease, opacity 0.3s ease",
                    }}
                  />
                </motion.g>
              );
            })}
            {/* State label */}
            <text
              x={gx + groupW / 2}
              y={bottom + 16}
              textAnchor="middle"
              fill="#6b7280"
              fontSize="10"
              fontWeight="500"
            >
              {st.state}
            </text>
          </g>
        );
      })}

      {/* Legend */}
      {parties.map((p, i) => {
        const lx = BAR.ml + 10 + i * 75;
        const ly = BAR.H - 5;
        return (
          <g key={p.key}>
            <circle cx={lx} cy={ly} r={4} fill={p.color} />
            <text x={lx + 8} y={ly + 3} fill="#6b7280" fontSize="9">
              {p.key === "bjp" ? "BJP" : p.key === "inc" ? "INC" : "Others"}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function StateDistributionCard({ triggered }: { triggered: boolean }) {
  return (
    <motion.div
      className="flex h-full flex-col rounded-2xl border border-gray-200 bg-white shadow-sm p-5 sm:p-6"
      animate={
        triggered
          ? {
              borderColor: [
                "#e5e7eb",
                "rgba(245,158,11,0.25)",
                "#e5e7eb",
              ],
            }
          : {}
      }
      transition={{
        duration: 5,
        delay: 4,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-sm font-bold text-gray-900 sm:text-base">
          State-wise Seat Distribution
        </h3>
        <span className="rounded-full bg-orange-500/90 px-2.5 py-0.5 text-[10px] font-bold text-white shadow-lg shadow-orange-500/20">
          2024
        </span>
      </div>
      <div className="flex-1">
        <GroupedBarChart triggered={triggered} />
      </div>
    </motion.div>
  );
}

// ─── Line Chart (SVG) with traveling dot + pulse rings ───

function HistoricalLineChart({ triggered }: { triggered: boolean }) {
  const pts = HISTORICAL_DATA.length;
  const xStep = LINE_CW / (pts - 1);
  const toX = (i: number) => LINE.ml + i * xStep;
  const toY = (v: number) => LINE.mt + LINE_CH - (v / LINE.yMax) * LINE_CH;
  const bottom = LINE.mt + LINE_CH;
  const gridVals = [100, 200, 300];

  const bjpPath = HISTORICAL_DATA.map(
    (d, i) => `${i === 0 ? "M" : "L"} ${toX(i)},${toY(d.bjp)}`
  ).join(" ");
  const incPath = HISTORICAL_DATA.map(
    (d, i) => `${i === 0 ? "M" : "L"} ${toX(i)},${toY(d.inc)}`
  ).join(" ");

  const bjpXs = HISTORICAL_DATA.map((_, i) => toX(i));
  const bjpYs = HISTORICAL_DATA.map((d) => toY(d.bjp));
  const incXs = HISTORICAL_DATA.map((_, i) => toX(i));
  const incYs = HISTORICAL_DATA.map((d) => toY(d.inc));

  return (
    <svg
      viewBox={`0 0 ${LINE.W} ${LINE.H}`}
      className="h-full w-full"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <filter id="glowBjp" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="glowInc" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Horizontal grid */}
      {gridVals.map((v) => (
        <g key={v}>
          <line
            x1={LINE.ml}
            y1={toY(v)}
            x2={LINE.W - LINE.mr}
            y2={toY(v)}
            stroke="#e5e7eb"
            strokeWidth={0.5}
            strokeDasharray="4 3"
          />
          <text
            x={LINE.ml - 6}
            y={toY(v) + 3}
            textAnchor="end"
            fill="#9ca3af"
            fontSize="9"
          >
            {v}
          </text>
        </g>
      ))}
      {/* Base line */}
      <line
        x1={LINE.ml}
        y1={bottom}
        x2={LINE.W - LINE.mr}
        y2={bottom}
        stroke="#e5e7eb"
        strokeWidth={1}
      />

      {/* Vertical grid + year labels */}
      {HISTORICAL_DATA.map((d, i) => (
        <g key={d.year}>
          <line
            x1={toX(i)}
            y1={LINE.mt}
            x2={toX(i)}
            y2={bottom}
            stroke="#e5e7eb"
            strokeWidth={0.3}
            strokeDasharray="3 4"
          />
          <text
            x={toX(i)}
            y={bottom + 16}
            textAnchor="middle"
            fill="#6b7280"
            fontSize="10"
            fontWeight="500"
          >
            {d.year}
          </text>
        </g>
      ))}

      {/* BJP line — draws once on scroll */}
      <motion.path
        d={bjpPath}
        fill="none"
        stroke="#f97316"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={
          triggered
            ? { pathLength: 1, opacity: 1 }
            : { pathLength: 0, opacity: 0 }
        }
        transition={
          triggered
            ? { duration: 1.5, delay: 0.3, ease: "easeInOut" }
            : { duration: 0.3 }
        }
      />
      {/* INC line — draws once on scroll */}
      <motion.path
        d={incPath}
        fill="none"
        stroke="#06b6d4"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={
          triggered
            ? { pathLength: 1, opacity: 1 }
            : { pathLength: 0, opacity: 0 }
        }
        transition={
          triggered
            ? { duration: 1.5, delay: 0.5, ease: "easeInOut" }
            : { duration: 0.3 }
        }
      />

      {/* Data point dots — continuous appear/disappear with the lines */}
      {HISTORICAL_DATA.map((d, i) => (
        <g key={d.year}>
          <motion.circle
            cx={toX(i)}
            cy={toY(d.bjp)}
            r={4}
            fill="#f97316"
            stroke="#ffffff"
            strokeWidth={2}
            initial={{ scale: 0, opacity: 0 }}
            animate={
              triggered
                ? { scale: 1, opacity: 1 }
                : { scale: 0, opacity: 0 }
            }
            transition={
              triggered
                ? { duration: 0.4, delay: 0.3 + i * 0.15, ease: "easeOut" }
                : { duration: 0.3 }
            }
            style={{ transformOrigin: `${toX(i)}px ${toY(d.bjp)}px` }}
          />
          <motion.circle
            cx={toX(i)}
            cy={toY(d.inc)}
            r={4}
            fill="#06b6d4"
            stroke="#ffffff"
            strokeWidth={2}
            initial={{ scale: 0, opacity: 0 }}
            animate={
              triggered
                ? { scale: 1, opacity: 1 }
                : { scale: 0, opacity: 0 }
            }
            transition={
              triggered
                ? { duration: 0.4, delay: 0.5 + i * 0.15, ease: "easeOut" }
                : { duration: 0.3 }
            }
            style={{ transformOrigin: `${toX(i)}px ${toY(d.inc)}px` }}
          />

          {/* Pulse ring on each BJP dot */}
          {triggered && (
            <motion.circle
              cx={toX(i)}
              cy={toY(d.bjp)}
              fill="none"
              stroke="#f97316"
              strokeWidth={1.5}
              initial={{ r: 4, opacity: 0 }}
              animate={{ r: [4, 12], opacity: [0.5, 0] }}
              transition={{
                duration: 1.8,
                delay: 3 + i * 0.6,
                repeat: Infinity,
                repeatDelay: 2.5,
                ease: "easeOut",
              }}
            />
          )}
          {/* Pulse ring on each INC dot */}
          {triggered && (
            <motion.circle
              cx={toX(i)}
              cy={toY(d.inc)}
              fill="none"
              stroke="#06b6d4"
              strokeWidth={1.5}
              initial={{ r: 4, opacity: 0 }}
              animate={{ r: [4, 12], opacity: [0.5, 0] }}
              transition={{
                duration: 1.8,
                delay: 3.3 + i * 0.6,
                repeat: Infinity,
                repeatDelay: 2.5,
                ease: "easeOut",
              }}
            />
          )}
        </g>
      ))}

      {/* Traveling glow dot along BJP line */}
      {triggered && (
        <motion.circle
          r={5}
          fill="#f97316"
          opacity={0.7}
          filter="url(#glowBjp)"
          animate={{ cx: bjpXs, cy: bjpYs }}
          transition={{
            duration: 3.5,
            delay: 4,
            repeat: Infinity,
            repeatDelay: 2,
            ease: "easeInOut",
          }}
        />
      )}
      {/* Traveling glow dot along INC line */}
      {triggered && (
        <motion.circle
          r={5}
          fill="#06b6d4"
          opacity={0.7}
          filter="url(#glowInc)"
          animate={{ cx: incXs, cy: incYs }}
          transition={{
            duration: 3.5,
            delay: 4.5,
            repeat: Infinity,
            repeatDelay: 2,
            ease: "easeInOut",
          }}
        />
      )}

      {/* Legend */}
      {[
        { label: "BJP", color: "#f97316", x: LINE.ml + 10 },
        { label: "INC", color: "#06b6d4", x: LINE.ml + 70 },
      ].map((item) => (
        <g key={item.label}>
          <circle cx={item.x} cy={LINE.H - 5} r={4} fill={item.color} />
          <text x={item.x + 8} y={LINE.H - 2} fill="#6b7280" fontSize="9">
            {item.label}
          </text>
        </g>
      ))}
    </svg>
  );
}

function HistoricalTrendsCard({ triggered }: { triggered: boolean }) {
  return (
    <motion.div
      className="flex h-full flex-col rounded-2xl border border-gray-200 bg-white shadow-sm p-5 sm:p-6"
      animate={
        triggered
          ? {
              borderColor: [
                "#e5e7eb",
                "rgba(245,158,11,0.25)",
                "#e5e7eb",
              ],
            }
          : {}
      }
      transition={{
        duration: 5,
        delay: 6,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-sm font-bold text-gray-900 sm:text-base">
          Historical Seat Trends
        </h3>
        <span className="rounded-full bg-rose-500/90 px-2.5 py-0.5 text-[10px] font-bold text-white shadow-lg shadow-rose-500/20">
          20 Years
        </span>
      </div>
      <div className="flex-1">
        <HistoricalLineChart triggered={triggered} />
      </div>
    </motion.div>
  );
}

// ─── Bottom Stats (colorful slot machine numbers) ───

function StatCard({
  stat,
  index,
}: {
  stat: (typeof BOTTOM_STATS)[0];
  index: number;
}) {
  return (
    <ScrollReveal delay={0.15 + index * 0.1}>
      <motion.div
        className="flex flex-col items-center rounded-2xl border border-gray-200 bg-white shadow-sm px-4 py-5 text-center"
        whileHover={{
          borderColor: stat.color + "50",
          boxShadow: `0 0 20px ${stat.color}15`,
          transition: { duration: 0.3 },
        }}
      >
        <SlotMachineNumber
          value={stat.value}
          decimals={stat.decimals}
          suffix={stat.suffix}
          color={stat.color}
          baseDelay={0.3 + index * 0.12}
        />
        <span className="mt-1.5 text-xs font-medium text-gray-500 sm:text-sm">
          {stat.label}
        </span>
        <span
          className={`mt-1 text-[11px] font-semibold ${stat.positive ? "text-emerald-600" : "text-rose-600"}`}
        >
          {stat.change}
        </span>
      </motion.div>
    </ScrollReveal>
  );
}

// ─── Main Section ───

export function DataInsightsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.2 });
  const triggered = isInView;

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-gray-50 py-8 sm:py-10 lg:py-12"
    >
      {/* Graph background image */}
      <div className="pointer-events-none absolute inset-0">
        <img
          src="/images/graph-bg.jpg"
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover opacity-20"
        />
      </div>

      {/* Subtle radial glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/4 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-400/[0.06] blur-[120px]" />
        <div className="absolute bottom-0 left-1/4 h-[400px] w-[400px] rounded-full bg-blue-400/[0.04] blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 xl:px-12">
        {/* ── Header ── */}
        <div className="flex flex-col items-center text-center">
          <ScrollReveal>
            <h2 className="overflow-visible bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500 bg-clip-text pb-2 text-2xl leading-tight font-extrabold text-transparent sm:text-3xl lg:text-4xl">
              Data Insights &amp; Analytics
            </h2>
          </ScrollReveal>
          <LoopingTypewriter className="mt-2 max-w-xl text-xs text-gray-500 sm:text-sm lg:text-base" />
          <ScrollReveal delay={0.25}>
            <div className="mt-5 h-[3px] w-12 rounded-full bg-blue-500" />
          </ScrollReveal>
        </div>

        {/* ── Charts Grid ── */}
        <div className="mt-6 grid gap-5 sm:mt-8 lg:mt-10 lg:grid-cols-3">
          <ScrollReveal delay={0.1} className="h-full">
            <StateDistributionCard triggered={triggered} />
          </ScrollReveal>
          <ScrollReveal delay={0.2} className="h-full">
            <SeatShareCard triggered={triggered} />
          </ScrollReveal>
          <ScrollReveal delay={0.3} className="h-full">
            <HistoricalTrendsCard triggered={triggered} />
          </ScrollReveal>
        </div>

        {/* ── Bottom Stats ── */}
        <div className="mt-6 grid grid-cols-2 gap-4 sm:mt-8 md:grid-cols-4">
          {BOTTOM_STATS.map((stat, i) => (
            <StatCard key={stat.label} stat={stat} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
