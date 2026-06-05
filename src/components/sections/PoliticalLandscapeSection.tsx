import { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import lottie from "lottie-web";
import { BackgroundVideo } from "@/components/video/BackgroundVideo";
import { IndiaMap, StateTooltip } from "@/components/IndiaMap";
import type { HoverInfo } from "@/components/IndiaMap";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { useCountUp } from "@/hooks/useCountUp";
import type { PoliticalLandscapeData } from "@/types";

// ─── Lottie stat icon (dark theme — amber colored) ───

const lottieStatCache: Record<string, object> = {};

function StatLottieIcon({ src, size = 22 }: { src: string; size?: number }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const load = (data: object) => {
      el.innerHTML = "";
      const anim = lottie.loadAnimation({
        container: el,
        renderer: "svg",
        loop: true,
        autoplay: true,
        animationData: data,
      });

      const recolor = () => {
        const shapes = el.querySelectorAll("path, circle, rect, line, ellipse, polyline, polygon");
        shapes.forEach((p) => {
          const stroke = p.getAttribute("stroke");
          if (stroke && stroke !== "none" && stroke !== "transparent") p.setAttribute("stroke", "#f59e0b");
          const fill = p.getAttribute("fill");
          if (fill && fill !== "none" && fill !== "transparent") p.setAttribute("fill", "#f59e0b");
          const sw = parseFloat(p.getAttribute("stroke-width") || "0");
          if (sw > 0 && sw < 22) p.setAttribute("stroke-width", "22");
        });
      };

      anim.addEventListener("DOMLoaded", recolor);
      anim.addEventListener("enterFrame", recolor);
    };

    if (lottieStatCache[src]) { load(lottieStatCache[src]); return; }

    let cancelled = false;
    fetch(src)
      .then((r) => r.json())
      .then((json) => { lottieStatCache[src] = json; if (!cancelled) load(json); })
      .catch(() => {});

    return () => { cancelled = true; el.innerHTML = ""; };
  }, [src]);

  return <div ref={containerRef} style={{ width: size, height: size, display: "inline-flex" }} />;
}

const iconMap: Record<string, React.ReactNode> = {
  users: <StatLottieIcon src="/lottie/teamwork.json" />,
  "map-pin": <StatLottieIcon src="/lottie/location.json" />,
  "bar-chart": <StatLottieIcon src="/lottie/analytics.json" />,
  "trending-up": <StatLottieIcon src="/lottie/growth.json" />,
};

// ─── Stat Card: bouncy whole card, count-up numbers, expandable on hover ───

function FloatingStatCard({
  icon,
  numericValue,
  suffix,
  label,
  detail,
  bounceDelay,
  className,
  expanded,
  onUserHover,
}: {
  icon: string;
  numericValue: number;
  suffix: string;
  label: string;
  detail?: string;
  bounceDelay: number;
  className?: string;
  expanded?: boolean;
  onUserHover?: (hovering: boolean) => void;
}) {
  const isExpanded = expanded ?? false;
  const { count, ref, replay } = useCountUp(numericValue, 3000);

  // Replay count when auto-expanded
  const prevExpanded = useRef(false);
  useEffect(() => {
    if (isExpanded && !prevExpanded.current) replay();
    prevExpanded.current = isExpanded;
  }, [isExpanded, replay]);

  return (
    <motion.div
      animate={{ y: [0, -5, 0, 4, 0] }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
        delay: bounceDelay,
      }}
      className={className}
    >
      <motion.div
        onMouseEnter={() => { onUserHover?.(true); replay(); }}
        onMouseLeave={() => onUserHover?.(false)}
        animate={{
          scale: isExpanded ? 1.05 : 1,
          borderColor: isExpanded
            ? "rgba(245, 158, 11, 0.4)"
            : "rgba(255, 255, 255, 0.1)",
        }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="cursor-default rounded-xl border bg-[#1a1a2e]/80 shadow-lg backdrop-blur-md"
        style={{
          boxShadow: isExpanded
            ? "0 0 20px rgba(245, 158, 11, 0.15)"
            : "none",
        }}
      >
        <div className="flex items-center gap-3 px-4 py-3">
          <motion.div
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/20 text-amber-500"
            animate={{ rotate: isExpanded ? [0, -10, 10, 0] : 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            {iconMap[icon] ?? <StatLottieIcon src="/lottie/analytics.json" />}
          </motion.div>
          <div>
            <p className="text-lg font-bold text-amber-400 sm:text-xl">
              <span ref={ref}>{count.toLocaleString()}</span>
              <span>{suffix}</span>
            </p>
            <p className="text-[10px] text-white/60 sm:text-xs">{label}</p>
          </div>
        </div>

        {/* Expandable detail */}
        <AnimatePresence>
          {isExpanded && detail && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <div className="border-t border-white/5 px-4 py-2">
                <p className="text-[10px] text-white/40">{detail}</p>
                <div className="mt-1.5 flex gap-0.5">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <motion.div
                      key={i}
                      className="h-2 w-2 rounded-[2px]"
                      style={{
                        backgroundColor:
                          i < 8
                            ? "rgba(245,158,11,0.7)"
                            : "rgba(245,158,11,0.25)",
                      }}
                      initial={{ scale: 0.5 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: i * 0.03, duration: 0.15 }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

// ─── Alliance Card ───

function AllianceCard({
  title,
  seats,
  color,
  bounceDelay,
  className,
  expanded,
  onUserHover,
}: {
  title: string;
  seats: number;
  color: string;
  bounceDelay: number;
  className?: string;
  expanded?: boolean;
  onUserHover?: (hovering: boolean) => void;
}) {
  const isExpanded = expanded ?? false;
  const { count, ref, replay } = useCountUp(seats, 3000);

  const prevExpanded = useRef(false);
  useEffect(() => {
    if (isExpanded && !prevExpanded.current) replay();
    prevExpanded.current = isExpanded;
  }, [isExpanded, replay]);

  return (
    <motion.div
      animate={{ y: [0, -4, 0, 3, 0] }}
      transition={{
        duration: 4.5,
        repeat: Infinity,
        ease: "easeInOut",
        delay: bounceDelay,
      }}
      className={className}
    >
      <motion.div
        onMouseEnter={() => { onUserHover?.(true); replay(); }}
        onMouseLeave={() => onUserHover?.(false)}
        animate={{
          scale: isExpanded ? 1.08 : 1,
          borderColor: isExpanded
            ? "rgba(245, 158, 11, 0.4)"
            : "rgba(255, 255, 255, 0.1)",
        }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="rounded-xl border bg-[#1a1a2e]/80 px-4 py-3 shadow-lg backdrop-blur-md"
        style={{
          boxShadow: isExpanded
            ? "0 0 20px rgba(245, 158, 11, 0.15)"
            : "none",
        }}
      >
        <p className="text-[10px] font-medium tracking-wider text-white/50 uppercase">
          {title}
        </p>
        <p className={`text-2xl font-bold ${color}`}>
          <span ref={ref}>{count.toLocaleString()}</span>
        </p>
        <p className="text-[10px] text-white/40">seats won</p>
      </motion.div>
    </motion.div>
  );
}

function parseNumeric(val: string): { num: number; suffix: string } {
  const cleaned = val.replace(/,/g, "");
  const match = cleaned.match(/^([\d.]+)(.*)$/);
  if (match) return { num: parseFloat(match[1]), suffix: match[2] };
  return { num: 0, suffix: val };
}

// ─── Main Section ───

export function PoliticalLandscapeSection({
  data,
}: {
  data: PoliticalLandscapeData;
}) {
  const [hoverInfo, setHoverInfo] = useState<HoverInfo | null>(null);
  const [isUserHovering, setIsUserHovering] = useState(false);
  const [autoIndex, setAutoIndex] = useState(0);

  // Auto-cycle cards (6 total: 4 stat cards + 2 alliance cards)
  const TOTAL_CARDS = 6;
  const [autoCardIndex, setAutoCardIndex] = useState(0);
  const [hoveredCardIndex, setHoveredCardIndex] = useState<number | null>(null);

  useEffect(() => {
    if (hoveredCardIndex !== null) return;
    const interval = setInterval(() => {
      setAutoCardIndex((prev) => (prev + 1) % TOTAL_CARDS);
    }, 3000);
    return () => clearInterval(interval);
  }, [hoveredCardIndex]);

  // Auto-cycle through states when user is NOT hovering
  useEffect(() => {
    if (isUserHovering || data.states.length === 0) return;

    const interval = setInterval(() => {
      setAutoIndex((prev) => (prev + 1) % data.states.length);
    }, 2500);

    return () => clearInterval(interval);
  }, [isUserHovering, data.states.length]);

  // Build autoHoverInfo from auto-cycling state
  const autoState = data.states[autoIndex];
  const activeInfo = isUserHovering ? hoverInfo : autoState ? {
    state: autoState,
    // Approximate positions for auto-cycle (will be overridden by real centroid on hover)
    x: 40 + (autoIndex % 5) * 8,
    y: 25 + (autoIndex % 4) * 10,
  } : null;
  const activeStateId = activeInfo?.state.name ?? null;

  const handleStateHover = (info: HoverInfo | null) => {
    if (info) {
      setIsUserHovering(true);
      setHoverInfo(info);
    } else {
      setIsUserHovering(false);
      setHoverInfo(null);
    }
  };

  const totalNda = useMemo(
    () => data.states.reduce((sum, s) => sum + s.ndaSeats, 0),
    [data.states],
  );
  const totalIndia = useMemo(
    () => data.states.reduce((sum, s) => sum + s.indiaSeats, 0),
    [data.states],
  );

  const stats = data.overallStats.map((s) => {
    const parsed = parseNumeric(s.value);
    return { ...s, numericValue: parsed.num, parsedSuffix: parsed.suffix };
  });

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-[#0c0c1d]">
      <div className="absolute top-0 left-0 right-0 z-[2] h-40 bg-gradient-to-b from-black/80 via-black/40 to-transparent" />
      <div className="absolute top-0 left-0 right-0 z-[2] h-20 bg-gradient-to-b from-[#0c0c1d] to-transparent" />

      <BackgroundVideo src={data.backgroundVideo} poster={data.backgroundPoster} />
      <div className="absolute inset-0 z-[1] bg-black/60" />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-[1440px] flex-col justify-center px-4 py-16 sm:px-6 sm:py-20 lg:flex-row lg:items-center lg:gap-10 lg:px-8 xl:gap-12 xl:px-12">
        {/* Left — text */}
        <div className="flex-1 lg:max-w-[480px]">
          {/* Badge with pulsing dot */}
          <ScrollReveal delay={0} direction="left">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5">
              <span className="badge-dot-pulse h-2 w-2 rounded-full bg-amber-500" />
              <span className="text-xs font-medium text-amber-400 sm:text-sm">{data.badge}</span>
            </div>
          </ScrollReveal>

          {/* Heading — word-by-word with shimmer + bounce */}
          <motion.h2
            className="text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl"
            initial="hidden"
            whileInView="visible"
            viewport={{ margin: "-80px", amount: 0.3 }}
            variants={{
              hidden: {},
              visible: {
                transition: { staggerChildren: 0.12, delayChildren: 0.2 },
              },
            }}
          >
            {data.title.split(" ").map((word, i) => (
              <motion.span
                key={i}
                className="section-heading-shimmer mr-2 inline-block lg:mr-3"
                variants={{
                  hidden: { opacity: 0, y: 40, rotateX: 45 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    rotateX: 0,
                    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
                  },
                }}
                style={{
                  animationDelay: `${i * 0.5}s`,
                }}
              >
                {word}
              </motion.span>
            ))}
            <br />
            {/* Highlight word with bouncing letters */}
            <motion.span
              className="inline-block"
              variants={{
                hidden: { opacity: 0, y: 40, scale: 0.9 },
                visible: {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
                },
              }}
            >
              {data.titleHighlight.split("").map((char, ci) => (
                <motion.span
                  key={ci}
                  className="section-highlight-shimmer inline-block"
                  style={{
                    animation: char !== " "
                      ? `letter-bounce 2.5s ease-in-out ${ci * 0.08}s infinite`
                      : undefined,
                    width: char === " " ? "0.3em" : undefined,
                  }}
                >
                  {char}
                </motion.span>
              ))}
            </motion.span>
          </motion.h2>

          {/* Subtitle with shimmer */}
          <ScrollReveal delay={0.5}>
            <p className="section-subtitle-shimmer mt-4 text-sm leading-relaxed sm:text-base lg:text-lg">
              {data.subtitle}
            </p>
          </ScrollReveal>
        </div>

        {/* Right — Map + Cards */}
        <div className="relative mt-10 flex-1 sm:mt-12 lg:mt-0">
          {/* Map container — responsive sizing */}
          <div className="relative mx-auto aspect-square w-full max-w-[280px] sm:max-w-[380px] md:max-w-[420px] lg:max-w-[520px]">
            {/* Map — z-10 so states are hoverable */}
            <div className="relative z-10 h-full w-full">
              <IndiaMap
                states={data.states}
                onStateHover={handleStateHover}
                hoveredStateId={activeStateId}
              />
            </div>

            {/* Dotted connector lines — hidden on mobile */}
            <svg className="pointer-events-none absolute inset-0 z-[5] hidden h-full w-full overflow-visible sm:block">
              <defs>
                <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="rgba(245,158,11,0.6)" />
                  <stop offset="100%" stopColor="rgba(245,158,11,0.1)" />
                </linearGradient>
              </defs>
              <motion.line x1="8%" y1="10%" x2="35%" y2="22%" stroke="url(#lineGrad)" strokeWidth="1" strokeDasharray="4 4" initial={{ pathLength: 0, opacity: 0 }} whileInView={{ pathLength: 1, opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.6, duration: 0.8 }} />
              <motion.line x1="88%" y1="8%" x2="62%" y2="20%" stroke="url(#lineGrad)" strokeWidth="1" strokeDasharray="4 4" initial={{ pathLength: 0, opacity: 0 }} whileInView={{ pathLength: 1, opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.7, duration: 0.8 }} />
              <motion.line x1="5%" y1="62%" x2="30%" y2="52%" stroke="url(#lineGrad)" strokeWidth="1" strokeDasharray="4 4" initial={{ pathLength: 0, opacity: 0 }} whileInView={{ pathLength: 1, opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.8, duration: 0.8 }} />
              <motion.line x1="18%" y1="92%" x2="38%" y2="75%" stroke="url(#lineGrad)" strokeWidth="1" strokeDasharray="4 4" initial={{ pathLength: 0, opacity: 0 }} whileInView={{ pathLength: 1, opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.9, duration: 0.8 }} />
              <motion.line x1="88%" y1="85%" x2="62%" y2="70%" stroke="url(#lineGrad)" strokeWidth="1" strokeDasharray="4 4" initial={{ pathLength: 0, opacity: 0 }} whileInView={{ pathLength: 1, opacity: 1 }} viewport={{ once: true }} transition={{ delay: 1.0, duration: 0.8 }} />
            </svg>

            {/* Floating stat cards — hidden on mobile, shown sm+ */}
            <div className="absolute inset-0 z-20 hidden overflow-visible sm:block" style={{ pointerEvents: "none" }}>
              <div style={{ pointerEvents: "auto" }}>
                <FloatingStatCard
                  icon="users"
                  numericValue={stats[0]?.numericValue ?? 543}
                  suffix={stats[0]?.parsedSuffix ?? "+"}
                  label={stats[0]?.label ?? "Lok Sabha Seats"}
                  detail="Total parliamentary constituencies"
                  bounceDelay={0}
                  className="absolute -left-6 -top-8"
                  expanded={hoveredCardIndex !== null ? hoveredCardIndex === 0 : autoCardIndex === 0}
                  onUserHover={(h) => setHoveredCardIndex(h ? 0 : null)}
                />
              </div>

              <div style={{ pointerEvents: "auto" }}>
                <div className="absolute -right-8 -top-2">
                  <FloatingStatCard
                    icon="map-pin"
                    numericValue={stats[1]?.numericValue ?? 28}
                    suffix=""
                    label={stats[1]?.label ?? "States Covered"}
                    detail="Complete state-level analysis"
                    bounceDelay={0.8}
                    expanded={hoveredCardIndex !== null ? hoveredCardIndex === 1 : autoCardIndex === 1}
                    onUserHover={(h) => setHoveredCardIndex(h ? 1 : null)}
                  />
                  <div className="mt-2">
                    <AllianceCard
                      title="NDA Alliance"
                      seats={totalNda}
                      color="text-green-400"
                      bounceDelay={1.2}
                      expanded={hoveredCardIndex !== null ? hoveredCardIndex === 2 : autoCardIndex === 2}
                      onUserHover={(h) => setHoveredCardIndex(h ? 2 : null)}
                    />
                  </div>
                </div>
              </div>

              <div style={{ pointerEvents: "auto" }}>
                <AllianceCard
                  title="India Alliance"
                  seats={totalIndia}
                  color="text-blue-400"
                  className="absolute -left-8 bottom-[25%]"
                  bounceDelay={1.6}
                  expanded={hoveredCardIndex !== null ? hoveredCardIndex === 3 : autoCardIndex === 3}
                  onUserHover={(h) => setHoveredCardIndex(h ? 3 : null)}
                />
              </div>

              <div style={{ pointerEvents: "auto" }}>
                <FloatingStatCard
                  icon="bar-chart"
                  numericValue={stats[2]?.numericValue ?? 1000}
                  suffix={stats[2]?.parsedSuffix ?? "+"}
                  label={stats[2]?.label ?? "Campaigns"}
                  detail="Successfully managed campaigns"
                  bounceDelay={2}
                  className="absolute bottom-0 left-[5%]"
                  expanded={hoveredCardIndex !== null ? hoveredCardIndex === 4 : autoCardIndex === 4}
                  onUserHover={(h) => setHoveredCardIndex(h ? 4 : null)}
                />
              </div>

              <div style={{ pointerEvents: "auto" }}>
                <FloatingStatCard
                  icon="trending-up"
                  numericValue={stats[3]?.numericValue ?? 95}
                  suffix={stats[3]?.parsedSuffix ?? "%"}
                  label={stats[3]?.label ?? "Accuracy"}
                  detail="Prediction accuracy rate"
                  bounceDelay={2.4}
                  className="absolute -right-8 bottom-4"
                  expanded={hoveredCardIndex !== null ? hoveredCardIndex === 5 : autoCardIndex === 5}
                  onUserHover={(h) => setHoveredCardIndex(h ? 5 : null)}
                />
              </div>
            </div>

            {/* State tooltip — auto-cycle or user hover */}
            <AnimatePresence mode="wait">
              {activeInfo && (
                <motion.div
                  key={activeInfo.state.name}
                  className="pointer-events-none absolute z-30"
                  style={{
                    left: `${Math.min(Math.max(activeInfo.x, 5), 45)}%`,
                    top: `${Math.min(Math.max(activeInfo.y - 5, 5), 50)}%`,
                  }}
                >
                  <StateTooltip state={activeInfo.state} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile stat grid — shown only on small screens */}
          <div className="mt-6 grid grid-cols-2 gap-3 sm:hidden">
            <FloatingStatCard
              icon="users"
              numericValue={stats[0]?.numericValue ?? 543}
              suffix={stats[0]?.parsedSuffix ?? "+"}
              label={stats[0]?.label ?? "Lok Sabha Seats"}
              bounceDelay={0}
              expanded={false}
              onUserHover={() => {}}
            />
            <FloatingStatCard
              icon="map-pin"
              numericValue={stats[1]?.numericValue ?? 28}
              suffix=""
              label={stats[1]?.label ?? "States Covered"}
              bounceDelay={0.2}
              expanded={false}
              onUserHover={() => {}}
            />
            <AllianceCard
              title="NDA Alliance"
              seats={totalNda}
              color="text-green-400"
              bounceDelay={0.4}
              expanded={false}
              onUserHover={() => {}}
            />
            <AllianceCard
              title="India Alliance"
              seats={totalIndia}
              color="text-blue-400"
              bounceDelay={0.6}
              expanded={false}
              onUserHover={() => {}}
            />
            <FloatingStatCard
              icon="bar-chart"
              numericValue={stats[2]?.numericValue ?? 1000}
              suffix={stats[2]?.parsedSuffix ?? "+"}
              label={stats[2]?.label ?? "Campaigns"}
              bounceDelay={0.8}
              expanded={false}
              onUserHover={() => {}}
            />
            <FloatingStatCard
              icon="trending-up"
              numericValue={stats[3]?.numericValue ?? 95}
              suffix={stats[3]?.parsedSuffix ?? "%"}
              label={stats[3]?.label ?? "Accuracy"}
              bounceDelay={1}
              expanded={false}
              onUserHover={() => {}}
            />
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-[2] h-40 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 z-[2] h-20 bg-gradient-to-t from-[#0c0c1d] to-transparent" />
      <div className="absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.4)_100%)]" />
    </section>
  );
}
