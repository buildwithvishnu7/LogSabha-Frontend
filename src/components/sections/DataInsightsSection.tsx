import { useRef, useEffect, useState, useMemo } from "react";
import {
  motion,
  useInView,
  useMotionValue,
  useTransform,
  animate,
} from "motion/react";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { CountUp } from "@/components/motion/CountUp";
import { useDataInsights } from "@/hooks/useDataInsights";

// ─── Continuous Looping Typewriter ───

const DATA_TYPEWRITER_PHRASES = [
  "Interactive 3D-styled data visualizations providing deep insights into India's electoral landscape.",
  "Explore seat share, state-wise breakdowns, and historical trends through dynamic charts.",
  "Real-time analytics powering a deeper understanding of Indian democracy's evolving numbers.",
  "From voter turnout to coalition patterns — data tells the story of India's elections.",
];

function LoopingTypewriter({ className, phrases = DATA_TYPEWRITER_PHRASES }: { className?: string; phrases?: string[] }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const isInView = useInView(ref, { once: false, amount: 0.5 });
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [displayedCount, setDisplayedCount] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const currentPhrase = phrases[phraseIndex % phrases.length];
  const chars = useMemo(() => [...currentPhrase], [currentPhrase]);

  useEffect(() => {
    if (!isInView) return;

    if (!isDeleting && displayedCount >= chars.length) {
      const timeout = setTimeout(() => setIsDeleting(true), 2200);
      return () => clearTimeout(timeout);
    }

    if (isDeleting && displayedCount === 0) {
      setIsDeleting(false);
      setPhraseIndex((i) => (i + 1) % phrases.length);
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

// Kept its name and props (callers below pass value/decimals/suffix/color);
// the body is now the shared count-up instead of a digit drum, so this
// section — the client's stated benchmark — sets the counter style the
// rest of the homepage follows (UX feedback #6, #7, #16).
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
  void baseDelay; // stagger belonged to the drum; the count-up starts on view
  return (
    <span
      className="inline-flex items-baseline text-2xl font-extrabold sm:text-3xl"
      style={{ color }}
    >
      <CountUp value={value} decimals={decimals} duration={1400} />
      {suffix && <span className="ml-0.5">{suffix}</span>}
    </span>
  );
}

// ─── Donut Chart (SVG, dark theme) ───

function DonutChart({
  triggered,
  hoveredParty,
  onHoverParty,
  onPinParty,
}: {
  triggered: boolean;
  hoveredParty: string | null;
  onHoverParty: (p: string | null) => void;
  /** click/tap: pin (or release) a segment — touch has no hover */
  onPinParty?: (p: string) => void;
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
              // Draws once when the section comes into view and then holds.
              // It used to redraw itself on an 8-second loop for ever, which
              // fought the hover state and read as restless (UX #17, #20).
              initial={{ strokeDashoffset: C }}
              animate={{ strokeDashoffset: triggered ? C - s.off - s.len : C }}
              transition={{ duration: triggered ? 1.4 : 0.3, delay: triggered ? 0.2 + i * 0.12 : 0, ease: "easeOut" }}
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
              onClick={() => onPinParty?.(s.party)}
            />
          );
        })}
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

    </div>
  );
}

// ─── Seat Share Card (Donut + Legend) ───

function SeatShareCard({ triggered }: { triggered: boolean }) {
  const [hovered, setHovered] = useState<string | null>(null);
  // A click (or tap) pins a party, so the highlight works without a mouse
  // and survives moving the pointer away. Click again to release (UX #17).
  const [pinned, setPinned] = useState<string | null>(null);
  const active = pinned ?? hovered;
  const activeRow = PARTY_SEATS.find((p) => p.party === active);
  const togglePin = (party: string) => setPinned((cur) => (cur === party ? null : party));

  return (
    <div
      className="flex h-full flex-col rounded-2xl border border-gray-200 bg-white shadow-sm p-5 sm:p-6"
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
        hoveredParty={active}
        onHoverParty={setHovered}
        onPinParty={togglePin}
      />

      <div className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 border-t border-gray-200 pt-3">
        {PARTY_SEATS.map((p, i) => {
          const isH = active === p.party;
          const dim = active !== null && !isH;
          return (
            <motion.div
              key={p.party}
              role="button"
              tabIndex={0}
              aria-pressed={pinned === p.party}
              className="flex cursor-pointer items-center gap-1.5 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              initial={{ opacity: 0 }}
              animate={
                triggered ? { opacity: dim ? 0.35 : 1 } : { opacity: 0 }
              }
              transition={{ opacity: { duration: 0.3 } }}
              onMouseEnter={() => setHovered(p.party)}
              onClick={() => togglePin(p.party)}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); togglePin(p.party); } }}
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

      {/* The readout: what the highlight means, in words. Doubles as the
          hint that the chart can be touched at all. */}
      <p className="mt-2 text-center text-[11px] text-gray-500" aria-live="polite">
        {activeRow ? (
          <>
            <span className="font-semibold" style={{ color: activeRow.color }}>{activeRow.party}</span>
            {" · "}{activeRow.seats} seats{" · "}
            {Math.round((activeRow.seats / TOTAL_SEATS) * 1000) / 10}% of the House
            {pinned ? " · click again to release" : ""}
          </>
        ) : (
          "Hover or tap a segment for its share"
        )}
      </p>
    </div>
  );
}

// ─── Grouped Bar Chart (SVG) — builds once, then answers hover and tap ───

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
                  // tap toggles, for touch (UX #17)
                  onClick={() => setHoveredBar((cur) => (cur?.si === si && cur?.pi === pi ? null : { si, pi }))}
                  animate={{ y: isHov ? -6 : 0 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  style={{ cursor: "pointer" }}
                >
                  {/* Main bar — grows once on view and stays. The old
                      7-second grow/hold/shrink loop meant the chart was
                      empty a third of the time (UX #17, #20). */}
                  <motion.rect
                    x={x}
                    width={BAR.barW}
                    rx={2}
                    fill={p.color}
                    initial={{ y: bottom, height: 0 }}
                    animate={triggered ? { y: bottom - h, height: h } : { y: bottom, height: 0 }}
                    transition={{
                      duration: triggered ? 0.9 : 0.3,
                      delay: triggered ? 0.15 + si * 0.08 + pi * 0.05 : 0,
                      ease: "easeOut",
                    }}
                    style={{
                      filter: isHov
                        ? `brightness(1.4) drop-shadow(0 0 8px ${p.color})`
                        : "none",
                      opacity: isDimmed ? 0.3 : 1,
                      transition:
                        "filter 0.25s ease, opacity 0.3s ease",
                    }}
                  />
                  {/* value above the highlighted bar — the "tooltip" (UX #17) */}
                  {isHov && (
                    <text
                      x={x + BAR.barW / 2}
                      y={bottom - h - 6}
                      textAnchor="middle"
                      fontSize="10"
                      fontWeight="700"
                      fill={p.color}
                      style={{ pointerEvents: "none" }}
                    >
                      {val}
                    </text>
                  )}
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
    <div className="flex h-full flex-col rounded-2xl border border-gray-200 bg-white shadow-sm p-5 sm:p-6">
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
    </div>
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

  // which year column is being read (hover, or pinned by tap)
  const [hoveredYear, setHoveredYear] = useState<number | null>(null);

  return (
    <svg
      viewBox={`0 0 ${LINE.W} ${LINE.H}`}
      className="h-full w-full"
      preserveAspectRatio="xMidYMid meet"
      onMouseLeave={() => setHoveredYear(null)}
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
            r={hoveredYear === i ? 6.5 : 4}
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
            r={hoveredYear === i ? 6.5 : 4}
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

          {/* Year hit-area: hover or tap a column to read both values.
              Replaces the twelve pulse rings and two travelling glow dots
              that used to run here for ever (UX #17, #20). */}
          <rect
            x={toX(i) - xStep / 2}
            y={LINE.mt}
            width={xStep}
            height={LINE_CH}
            fill="transparent"
            style={{ cursor: "pointer" }}
            onMouseEnter={() => setHoveredYear(i)}
            onClick={() => setHoveredYear((cur) => (cur === i ? null : i))}
          />
          {hoveredYear === i && (
            <g style={{ pointerEvents: "none" }}>
              <line x1={toX(i)} y1={LINE.mt} x2={toX(i)} y2={bottom} stroke="#9ca3af" strokeWidth={1} />
              <rect
                x={Math.min(Math.max(toX(i) - 46, LINE.ml), LINE.W - LINE.mr - 92)}
                y={LINE.mt + 2}
                width={92}
                height={34}
                rx={6}
                fill="#111827"
                opacity={0.92}
              />
              <text
                x={Math.min(Math.max(toX(i) - 46, LINE.ml), LINE.W - LINE.mr - 92) + 46}
                y={LINE.mt + 15}
                textAnchor="middle"
                fontSize="9"
                fontWeight="700"
                fill="#ffffff"
              >
                {d.year}
              </text>
              <text
                x={Math.min(Math.max(toX(i) - 46, LINE.ml), LINE.W - LINE.mr - 92) + 46}
                y={LINE.mt + 28}
                textAnchor="middle"
                fontSize="9"
                fill="#ffffff"
              >
                <tspan fill="#fdba74">BJP {d.bjp}</tspan>
                <tspan> · </tspan>
                <tspan fill="#67e8f9">INC {d.inc}</tspan>
              </text>
            </g>
          )}
        </g>
      ))}

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
    <div className="flex h-full flex-col rounded-2xl border border-gray-200 bg-white shadow-sm p-5 sm:p-6">
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
    </div>
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
  const { data } = useDataInsights();
  const bottomStats = data?.bottomStats ?? BOTTOM_STATS;

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
              {data?.title ?? "Data Insights & Analytics"}
            </h2>
          </ScrollReveal>
          <LoopingTypewriter phrases={data?.typewriterPhrases} className="mt-2 max-w-xl text-xs text-gray-500 sm:text-sm lg:text-base" />
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
          {bottomStats.map((stat: (typeof BOTTOM_STATS)[0], i: number) => (
            <StatCard key={i} stat={stat} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
