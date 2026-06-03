import { useRef, useEffect, useState } from "react";
import { motion, useInView, useMotionValue, useTransform, animate } from "motion/react";
import { PieChart, MapPin, TrendingUp } from "lucide-react";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { AnimatedLucideIcon } from "@/components/AnimatedLucideIcon";

// ─── Data ───

const PARTY_SEATS = [
  { party: "BJP", seats: 303, color: "#f97316" },
  { party: "INC", seats: 52, color: "#22c55e" },
  { party: "DMK", seats: 24, color: "#ef4444" },
  { party: "TMC", seats: 23, color: "#06b6d4" },
  { party: "Others", seats: 141, color: "#6b7280" },
];

const TOTAL_SEATS = 543;

const STATE_DISTRIBUTION = [
  { state: "Uttar Pradesh", seats: 80, color: "#f97316", dotColor: "#f97316" },
  { state: "Maharashtra", seats: 48, color: "#f97316", dotColor: "#f97316" },
  { state: "West Bengal", seats: 42, color: "#06b6d4", dotColor: "#06b6d4" },
  { state: "Bihar", seats: 40, color: "#f97316", dotColor: "#f97316" },
  { state: "Tamil Nadu", seats: 39, color: "#ef4444", dotColor: "#ef4444" },
  { state: "Madhya Pradesh", seats: 29, color: "#f97316", dotColor: "#f97316" },
];

const HISTORICAL_DATA = [
  { year: 2009, bjp: 116, inc: 206, others: 221 },
  { year: 2014, bjp: 282, inc: 44, others: 217 },
  { year: 2019, bjp: 303, inc: 52, others: 188 },
];

// ─── Animated Counter ───

function AnimatedNumber({
  value,
  delay = 0,
  className = "",
}: {
  value: number;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { margin: "-40px" });
  const motionVal = useMotionValue(0);
  const rounded = useTransform(motionVal, (v) => Math.round(v));
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (isInView) {
      const controls = animate(motionVal, value, {
        duration: 2.5,
        delay,
        ease: [0.16, 1, 0.3, 1],
      });
      return controls.stop;
    } else {
      motionVal.set(0);
      setDisplay(0);
    }
  }, [isInView, value, delay, motionVal]);

  useEffect(() => {
    return rounded.on("change", (v) => setDisplay(v));
  }, [rounded]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}

// ─── Animated Donut Chart (SVG) ───

function DonutChart({
  triggered,
  hoveredParty,
  onHoverParty,
}: {
  triggered: boolean;
  hoveredParty: string | null;
  onHoverParty: (party: string | null) => void;
}) {
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  let accumulated = 0;

  const segments = PARTY_SEATS.map((p) => {
    const fraction = p.seats / TOTAL_SEATS;
    const length = fraction * circumference;
    const offset = accumulated;
    accumulated += length;
    return { ...p, length, offset, fraction };
  });

  const activeParty = hoveredParty
    ? PARTY_SEATS.find((p) => p.party === hoveredParty)
    : null;

  return (
    <div className="relative mx-auto h-52 w-52 sm:h-56 sm:w-56">
      <svg
        viewBox="0 0 200 200"
        className="h-full w-full -rotate-90"
        onMouseLeave={() => onHoverParty(null)}
      >
        {/* Background ring */}
        <circle
          cx="100"
          cy="100"
          r={radius}
          fill="none"
          stroke="#f3f4f6"
          strokeWidth="28"
        />
        {segments.map((seg, i) => {
          const isHovered = hoveredParty === seg.party;
          const isDimmed = hoveredParty !== null && !isHovered;

          return (
            <motion.circle
              key={seg.party}
              cx="100"
              cy="100"
              r={radius}
              fill="none"
              stroke={seg.color}
              strokeLinecap="butt"
              strokeDasharray={`${seg.length} ${circumference - seg.length}`}
              initial={{ strokeDashoffset: circumference, strokeWidth: 28 }}
              animate={
                triggered
                  ? {
                      strokeDashoffset:
                        circumference - seg.offset - seg.length,
                      strokeWidth: isHovered ? 34 : 28,
                      opacity: isDimmed ? 0.35 : 1,
                    }
                  : { strokeDashoffset: circumference }
              }
              transition={{
                strokeDashoffset: {
                  duration: 1.8,
                  delay: 0.3 + i * 0.2,
                  ease: [0.16, 1, 0.3, 1],
                },
                strokeWidth: { duration: 0.3, ease: "easeOut" },
                opacity: { duration: 0.3, ease: "easeOut" },
              }}
              style={{
                transformOrigin: "100px 100px",
                cursor: "pointer",
                filter: isHovered
                  ? `drop-shadow(0 0 6px ${seg.color})`
                  : "none",
              }}
              onMouseEnter={() => onHoverParty(seg.party)}
            />
          );
        })}

        {/* Ambient: rotating highlight arc */}
        {triggered && !hoveredParty && (
          <motion.circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.3)"
            strokeWidth="28"
            strokeDasharray={`${circumference * 0.08} ${circumference * 0.92}`}
            animate={{ strokeDashoffset: [0, -circumference] }}
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

      {/* Center text — shows hovered party info or total */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className="text-3xl font-extrabold sm:text-4xl"
          style={{ color: activeParty ? activeParty.color : "#111827" }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={
            triggered
              ? { opacity: 1, scale: hoveredParty ? [1] : [1, 1.04, 1] }
              : { opacity: 0, scale: 0.5 }
          }
          transition={
            triggered
              ? {
                  opacity: { duration: 0.8, delay: 1 },
                  scale: hoveredParty
                    ? { duration: 0.3 }
                    : {
                        duration: 3,
                        delay: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                      },
                }
              : { duration: 0.8, delay: 1, ease: [0.16, 1, 0.3, 1] }
          }
          key={hoveredParty ?? "total"}
        >
          {activeParty ? (
            activeParty.seats
          ) : (
            <AnimatedNumber
              value={triggered ? TOTAL_SEATS : 0}
              delay={0.3}
            />
          )}
        </motion.span>
        <motion.span
          className="text-[10px] font-semibold tracking-widest uppercase"
          style={{ color: activeParty ? activeParty.color : "#9ca3af" }}
          initial={{ opacity: 0, y: 8 }}
          animate={
            triggered
              ? {
                  opacity: hoveredParty ? 1 : [0.5, 1, 0.5],
                  y: 0,
                }
              : { opacity: 0, y: 8 }
          }
          transition={
            triggered
              ? {
                  y: { duration: 0.6, delay: 1.3 },
                  opacity: hoveredParty
                    ? { duration: 0.3 }
                    : {
                        duration: 4,
                        delay: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                      },
                }
              : { duration: 0.6, delay: 1.3 }
          }
          key={`label-${hoveredParty ?? "total"}`}
        >
          {activeParty ? activeParty.party : "Total Seats"}
        </motion.span>
      </div>

      {/* Ambient: outer glow ring */}
      {triggered && (
        <motion.div
          className="pointer-events-none absolute inset-[-8px] rounded-full border-2"
          animate={{
            scale: hoveredParty ? [1, 1.03, 1] : [1, 1.06, 1],
            opacity: [0.3, 0.6, 0.3],
            borderColor: hoveredParty
              ? [
                  `${activeParty?.color ?? "#f59e0b"}30`,
                  `${activeParty?.color ?? "#f59e0b"}70`,
                  `${activeParty?.color ?? "#f59e0b"}30`,
                ]
              : [
                  "rgba(245,158,11,0.15)",
                  "rgba(245,158,11,0.4)",
                  "rgba(245,158,11,0.15)",
                ],
          }}
          transition={{
            duration: hoveredParty ? 2 : 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: hoveredParty ? 0 : 2.5,
          }}
        />
      )}
    </div>
  );
}

// ─── Animated Horizontal Bar ───

function AnimatedBar({
  value,
  max,
  color,
  delay,
  triggered,
  index,
}: {
  value: number;
  max: number;
  color: string;
  delay: number;
  triggered: boolean;
  index: number;
}) {
  const pct = (value / max) * 100;

  return (
    <div className="relative h-3 flex-1 overflow-hidden rounded-full bg-gray-100">
      <motion.div
        className="absolute inset-y-0 left-0 rounded-full"
        style={{ backgroundColor: color }}
        initial={{ width: "0%" }}
        animate={triggered ? { width: `${pct}%` } : { width: "0%" }}
        transition={{
          duration: 1.6,
          delay,
          ease: [0.16, 1, 0.3, 1],
        }}
      />
      {/* Continuous shimmer sweep on bar */}
      {triggered && (
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{
            width: `${pct}%`,
            background:
              "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.45) 50%, transparent 100%)",
            backgroundSize: "200% 100%",
          }}
          animate={{
            backgroundPosition: ["-100% 0%", "200% 0%"],
          }}
          transition={{
            duration: 2.5,
            delay: 3 + index * 0.6,
            repeat: Infinity,
            repeatDelay: 3 + index * 0.4,
            ease: "easeInOut",
          }}
        />
      )}
    </div>
  );
}

// ─── State Distribution Card ───

function StateDistributionCard({ triggered }: { triggered: boolean }) {
  const maxSeats = Math.max(...STATE_DISTRIBUTION.map((s) => s.seats));
  const topStatesTotal = STATE_DISTRIBUTION.reduce((a, s) => a + s.seats, 0);

  return (
    <motion.div
      className="flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6"
      animate={
        triggered
          ? {
              borderColor: [
                "rgba(229,231,235,1)",
                "rgba(245,158,11,0.3)",
                "rgba(229,231,235,1)",
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
      {/* Header */}
      <div className="mb-5 flex items-center gap-2">
        <motion.div
          animate={
            triggered
              ? { y: [0, -2, 0], scale: [1, 1.15, 1] }
              : {}
          }
          transition={{
            duration: 3,
            delay: 3,
            repeat: Infinity,
            repeatDelay: 2,
            ease: "easeInOut",
          }}
        >
          <AnimatedLucideIcon icon={MapPin} size={18} className="text-amber-500" />
        </motion.div>
        <h3 className="text-sm font-bold text-gray-900 sm:text-base">
          State-wise Seat Distribution
        </h3>
      </div>

      {/* Bars */}
      <div className="flex flex-1 flex-col justify-evenly">
        {STATE_DISTRIBUTION.map((state, i) => (
          <div key={state.state} className="flex items-center gap-3">
            <div className="flex w-28 items-center gap-1.5 sm:w-32">
              {/* Ambient pulsing dot */}
              <motion.span
                className="h-2 w-2 flex-shrink-0 rounded-full"
                style={{ backgroundColor: state.dotColor }}
                initial={{ scale: 0 }}
                animate={
                  triggered
                    ? {
                        scale: [1, 1.4, 1],
                        boxShadow: [
                          `0 0 0px ${state.dotColor}00`,
                          `0 0 6px ${state.dotColor}80`,
                          `0 0 0px ${state.dotColor}00`,
                        ],
                      }
                    : { scale: 0 }
                }
                transition={
                  triggered
                    ? {
                        scale: {
                          duration: 2.5,
                          delay: 4 + i * 0.8,
                          repeat: Infinity,
                          repeatDelay: 3,
                          ease: "easeInOut",
                        },
                        boxShadow: {
                          duration: 2.5,
                          delay: 4 + i * 0.8,
                          repeat: Infinity,
                          repeatDelay: 3,
                          ease: "easeInOut",
                        },
                      }
                    : {
                        duration: 0.4,
                        delay: 0.4 + i * 0.12,
                        ease: [0.16, 1, 0.3, 1],
                      }
                }
              />
              <motion.span
                className="truncate text-xs font-medium text-gray-700 sm:text-sm"
                initial={{ opacity: 0, x: -10 }}
                animate={
                  triggered ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }
                }
                transition={{
                  duration: 0.5,
                  delay: 0.3 + i * 0.12,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                {state.state}
              </motion.span>
            </div>

            <AnimatedBar
              value={state.seats}
              max={maxSeats}
              color={state.color}
              delay={0.5 + i * 0.15}
              triggered={triggered}
              index={i}
            />

            <motion.span
              className="w-8 text-right text-sm font-bold text-gray-900"
              initial={{ opacity: 0 }}
              animate={triggered ? { opacity: 1 } : { opacity: 0 }}
              transition={{
                duration: 0.4,
                delay: 0.8 + i * 0.15,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <AnimatedNumber
                value={triggered ? state.seats : 0}
                delay={0.5 + i * 0.15}
              />
            </motion.span>
          </div>
        ))}
      </div>

      {/* Footer */}
      <motion.div
        className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3"
        initial={{ opacity: 0 }}
        animate={triggered ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.6, delay: 1.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <span className="text-xs text-gray-400">Top 6 States</span>
        <span className="text-sm font-bold text-gray-900">
          <AnimatedNumber value={triggered ? topStatesTotal : 0} delay={1.5} />{" "}
          seats
        </span>
      </motion.div>
    </motion.div>
  );
}

// ─── Historical Stacked Bar ───

function HistoricalBar({
  data,
  index,
  triggered,
}: {
  data: (typeof HISTORICAL_DATA)[0];
  index: number;
  triggered: boolean;
}) {
  const total = TOTAL_SEATS;
  const bjpPct = (data.bjp / total) * 100;
  const incPct = (data.inc / total) * 100;
  const othersPct = (data.others / total) * 100;

  const baseDelay = 0.6 + index * 0.3;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <motion.span
          className="text-sm font-bold text-gray-900"
          initial={{ opacity: 0, x: -15 }}
          animate={triggered ? { opacity: 1, x: 0 } : { opacity: 0, x: -15 }}
          transition={{
            duration: 0.5,
            delay: baseDelay,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          {data.year}
        </motion.span>
        <motion.span
          className="text-[10px] text-gray-400"
          initial={{ opacity: 0 }}
          animate={triggered ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.4, delay: baseDelay + 0.3 }}
        >
          Total: {total}
        </motion.span>
      </div>

      <div className="relative flex h-7 w-full overflow-hidden rounded-lg bg-gray-100 sm:h-8">
        {/* BJP */}
        <motion.div
          className="flex items-center justify-center"
          style={{ backgroundColor: "#f97316" }}
          initial={{ width: "0%" }}
          animate={triggered ? { width: `${bjpPct}%` } : { width: "0%" }}
          transition={{
            duration: 1.4,
            delay: baseDelay + 0.1,
            ease: [0.16, 1, 0.3, 1],
          }}
        />
        {/* INC */}
        <motion.div
          className="flex items-center justify-center"
          style={{ backgroundColor: "#22c55e" }}
          initial={{ width: "0%" }}
          animate={triggered ? { width: `${incPct}%` } : { width: "0%" }}
          transition={{
            duration: 1.2,
            delay: baseDelay + 0.3,
            ease: [0.16, 1, 0.3, 1],
          }}
        />
        {/* Others */}
        <motion.div
          className="flex items-center justify-center"
          style={{ backgroundColor: "#6b7280" }}
          initial={{ width: "0%" }}
          animate={triggered ? { width: `${othersPct}%` } : { width: "0%" }}
          transition={{
            duration: 1.0,
            delay: baseDelay + 0.5,
            ease: [0.16, 1, 0.3, 1],
          }}
        />

        {/* Continuous shimmer sweep across stacked bar */}
        {triggered && (
          <motion.div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)",
              backgroundSize: "40% 100%",
            }}
            animate={{ backgroundPosition: ["-40% 0%", "140% 0%"] }}
            transition={{
              duration: 2.5,
              delay: 4 + index * 1.2,
              repeat: Infinity,
              repeatDelay: 4 + index * 0.5,
              ease: "easeInOut",
            }}
          />
        )}
      </div>
    </div>
  );
}

function HistoricalTrendsCard({ triggered }: { triggered: boolean }) {
  return (
    <motion.div
      className="flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6"
      animate={
        triggered
          ? {
              borderColor: [
                "rgba(229,231,235,1)",
                "rgba(245,158,11,0.3)",
                "rgba(229,231,235,1)",
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
      {/* Header */}
      <div className="mb-5 flex items-center gap-2">
        <motion.div
          animate={
            triggered
              ? { y: [0, -3, 0], rotate: [0, 10, -10, 0] }
              : {}
          }
          transition={{
            duration: 2,
            delay: 0.5,
            repeat: Infinity,
            repeatDelay: 3,
            ease: "easeInOut",
          }}
        >
          <AnimatedLucideIcon
            icon={TrendingUp}
            size={18}
            className="text-amber-500"
          />
        </motion.div>
        <h3 className="text-sm font-bold text-gray-900 sm:text-base">
          Historical Seat Trends
        </h3>
      </div>

      {/* Stacked bars */}
      <div className="flex flex-1 flex-col justify-evenly">
        {HISTORICAL_DATA.map((data, i) => (
          <HistoricalBar
            key={data.year}
            data={data}
            index={i}
            triggered={triggered}
          />
        ))}
      </div>

      {/* Legend with pulsing dots */}
      <motion.div
        className="mt-4 flex items-center justify-center gap-5 border-t border-gray-100 pt-3"
        initial={{ opacity: 0, y: 10 }}
        animate={triggered ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
        transition={{ duration: 0.6, delay: 2.2, ease: [0.16, 1, 0.3, 1] }}
      >
        {[
          { label: "BJP", color: "#f97316" },
          { label: "INC", color: "#22c55e" },
          { label: "Others", color: "#6b7280" },
        ].map((item, i) => (
          <div key={item.label} className="flex items-center gap-1.5">
            <motion.span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: item.color }}
              animate={
                triggered
                  ? {
                      scale: [1, 1.3, 1],
                      boxShadow: [
                        `0 0 0px ${item.color}00`,
                        `0 0 5px ${item.color}60`,
                        `0 0 0px ${item.color}00`,
                      ],
                    }
                  : {}
              }
              transition={{
                duration: 2,
                delay: 5 + i * 1.5,
                repeat: Infinity,
                repeatDelay: 4,
                ease: "easeInOut",
              }}
            />
            <span className="text-[10px] font-medium text-gray-500">
              {item.label}
            </span>
          </div>
        ))}
      </motion.div>
    </motion.div>
  );
}

// ─── Lok Sabha Seat Share Card ───

function SeatShareCard({ triggered }: { triggered: boolean }) {
  const [hoveredParty, setHoveredParty] = useState<string | null>(null);

  return (
    <motion.div
      className="flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6"
      animate={
        triggered
          ? {
              borderColor: [
                "rgba(229,231,235,1)",
                "rgba(245,158,11,0.3)",
                "rgba(229,231,235,1)",
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
      onMouseLeave={() => setHoveredParty(null)}
    >
      {/* Header */}
      <div className="mb-4 flex items-center gap-2">
        <motion.div
          animate={
            triggered
              ? { rotate: [0, 15, -15, 0], scale: [1, 1.1, 1] }
              : {}
          }
          transition={{
            duration: 3,
            delay: 3,
            repeat: Infinity,
            repeatDelay: 4,
            ease: "easeInOut",
          }}
        >
          <AnimatedLucideIcon
            icon={PieChart}
            size={18}
            className="text-amber-500"
          />
        </motion.div>
        <h3 className="text-sm font-bold text-gray-900 sm:text-base">
          Lok Sabha Seat Share
        </h3>
      </div>

      {/* Donut */}
      <DonutChart
        triggered={triggered}
        hoveredParty={hoveredParty}
        onHoverParty={setHoveredParty}
      />

      {/* Party legend — interactive */}
      <div className="mt-5 space-y-2.5">
        {PARTY_SEATS.map((p, i) => {
          const isHovered = hoveredParty === p.party;
          const isDimmed = hoveredParty !== null && !isHovered;

          return (
            <motion.div
              key={p.party}
              className="flex cursor-pointer items-center justify-between rounded-lg px-2 py-1 transition-colors"
              style={{
                backgroundColor: isHovered ? `${p.color}10` : "transparent",
              }}
              initial={{ opacity: 0, x: -20 }}
              animate={
                triggered
                  ? { opacity: isDimmed ? 0.4 : 1, x: 0 }
                  : { opacity: 0, x: -20 }
              }
              transition={{
                opacity: { duration: 0.3 },
                x: {
                  duration: 0.5,
                  delay: 1.2 + i * 0.12,
                  ease: [0.16, 1, 0.3, 1],
                },
              }}
              onMouseEnter={() => setHoveredParty(p.party)}
            >
              <div className="flex items-center gap-2">
                <motion.span
                  className="h-3 w-3 rounded-full"
                  style={{
                    backgroundColor: p.color,
                    boxShadow: isHovered
                      ? `0 0 8px ${p.color}90`
                      : "none",
                  }}
                  initial={{ scale: 0 }}
                  animate={
                    triggered
                      ? {
                          scale: isHovered
                            ? 1.4
                            : hoveredParty
                              ? 1
                              : [1, 1.35, 1],
                        }
                      : { scale: 0 }
                  }
                  transition={
                    triggered
                      ? isHovered || hoveredParty
                        ? { duration: 0.25, ease: "easeOut" }
                        : {
                            scale: {
                              duration: 2.5,
                              delay: 4 + i * 1,
                              repeat: Infinity,
                              repeatDelay: 4,
                              ease: "easeInOut",
                            },
                          }
                      : {
                          duration: 0.4,
                          delay: 1.3 + i * 0.12,
                          type: "spring",
                          stiffness: 400,
                          damping: 15,
                        }
                  }
                />
                <span
                  className="text-xs font-medium sm:text-sm"
                  style={{
                    color: isHovered ? p.color : "#374151",
                    fontWeight: isHovered ? 700 : 500,
                  }}
                >
                  {p.party}
                </span>
              </div>
              <span
                className="text-sm font-bold sm:text-base"
                style={{ color: isHovered ? p.color : "#f59e0b" }}
              >
                <AnimatedNumber
                  value={triggered ? p.seats : 0}
                  delay={1 + i * 0.15}
                />
              </span>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

// ─── Floating Data Symbols ───

const DATA_SYMBOLS = [
  { id: 0, text: "543", x: "8%", y: "15%", size: "text-lg" },
  { id: 1, text: "%", x: "85%", y: "20%", size: "text-2xl" },
  { id: 2, text: "80", x: "15%", y: "75%", size: "text-sm" },
  { id: 3, text: "#", x: "90%", y: "70%", size: "text-xl" },
  { id: 4, text: "303", x: "5%", y: "45%", size: "text-base" },
  { id: 5, text: "+", x: "92%", y: "45%", size: "text-2xl" },
  { id: 6, text: "28", x: "50%", y: "8%", size: "text-sm" },
  { id: 7, text: "52", x: "48%", y: "90%", size: "text-sm" },
];

function FloatingDataSymbols() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {DATA_SYMBOLS.map((s) => (
        <motion.span
          key={s.id}
          className={`absolute font-bold text-amber-500/[0.06] ${s.size}`}
          style={{ left: s.x, top: s.y }}
          animate={{
            y: [0, -20, 0, 15, 0],
            x: [0, 10, -8, 5, 0],
            opacity: [0.04, 0.1, 0.05, 0.08, 0.04],
            rotate: [0, 5, -3, 2, 0],
          }}
          transition={{
            duration: 10 + s.id * 1.5,
            delay: s.id * 1.2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {s.text}
        </motion.span>
      ))}
    </div>
  );
}

// ─── Floating Particles ───

const PARTICLES = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  size: 2 + (i % 4),
  x: `${(i * 17) % 100}%`,
  y: `${(i * 23) % 100}%`,
  duration: 8 + (i % 5) * 2,
  delay: i * 0.4,
}));

function FloatingParticles() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {PARTICLES.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-amber-500/20"
          style={{
            width: p.size,
            height: p.size,
            left: p.x,
            top: p.y,
          }}
          animate={{
            y: [0, -30, 0, 20, 0],
            x: [0, 15, -10, 5, 0],
            opacity: [0.15, 0.4, 0.2, 0.35, 0.15],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

// ─── Main Section ───

export function DataInsightsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { margin: "-100px", amount: 0.15 });
  const [triggered, setTriggered] = useState(false);

  useEffect(() => {
    if (isInView) setTriggered(true);
    else setTriggered(false);
  }, [isInView]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-white py-20 sm:py-24 lg:py-32"
    >
      {/* ── Video background ── */}
      <div className="pointer-events-none absolute inset-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src="/videos/Stock-bg.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-white/80" />
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-white to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white to-transparent" />
      </div>

      {/* Floating particles + data symbols */}
      <FloatingParticles />
      <FloatingDataSymbols />

      <div className="relative mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 xl:px-12">
        {/* ── Section Header ── */}
        <div className="flex flex-col items-center text-center">
          <ScrollReveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-1.5 text-[11px] font-semibold tracking-wider text-amber-600 uppercase">
              <AnimatedLucideIcon icon={TrendingUp} size={14} />
              Electoral Analytics
            </span>
          </ScrollReveal>

          <ScrollReveal delay={0.15}>
            <h2 className="community-title-shimmer mt-5 py-1 text-3xl font-extrabold sm:text-4xl lg:text-5xl">
              Data Insights & Analytics
            </h2>
          </ScrollReveal>

          <ScrollReveal delay={0.3}>
            <p className="mt-3 max-w-lg text-sm text-gray-500 sm:text-base">
              Comprehensive electoral data visualization and trends
            </p>
          </ScrollReveal>
        </div>

        {/* ── Cards Grid ── */}
        <div className="mt-10 grid gap-6 sm:mt-12 lg:mt-16 lg:grid-cols-3">
          {/* Card 1: Lok Sabha Seat Share */}
          <ScrollReveal delay={0.1} className="h-full">
            <SeatShareCard triggered={triggered} />
          </ScrollReveal>

          {/* Card 2: State-wise Distribution */}
          <ScrollReveal delay={0.2} className="h-full">
            <StateDistributionCard triggered={triggered} />
          </ScrollReveal>

          {/* Card 3: Historical Trends */}
          <ScrollReveal delay={0.3} className="h-full">
            <HistoricalTrendsCard triggered={triggered} />
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
