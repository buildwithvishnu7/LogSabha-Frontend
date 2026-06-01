import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Users, MapPin, BarChart3, TrendingUp } from "lucide-react";
import { BackgroundVideo } from "@/components/video/BackgroundVideo";
import { IndiaMap, StateTooltip } from "@/components/IndiaMap";
import { ScrollReveal, ScrollRevealText } from "@/components/motion/ScrollReveal";
import type { PoliticalLandscapeData, StateData } from "@/types";

const iconMap: Record<string, React.ReactNode> = {
  users: <Users className="h-5 w-5" />,
  "map-pin": <MapPin className="h-5 w-5" />,
  "bar-chart": <BarChart3 className="h-5 w-5" />,
  "trending-up": <TrendingUp className="h-5 w-5" />,
};

// ─── Floating Stat Card ───

function FloatingStatCard({
  icon,
  value,
  label,
  delay,
  className,
}: {
  icon: string;
  value: string;
  label: string;
  delay: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`flex items-center gap-3 rounded-xl border border-white/10 bg-[#1a1a2e]/80 px-4 py-3 shadow-lg backdrop-blur-md ${className ?? ""}`}
    >
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/20 text-amber-500">
        {iconMap[icon] ?? <BarChart3 className="h-5 w-5" />}
      </div>
      <div>
        <p className="text-lg font-bold text-amber-400 sm:text-xl">{value}</p>
        <p className="text-[10px] text-white/60 sm:text-xs">{label}</p>
      </div>
    </motion.div>
  );
}

// ─── Alliance Card ───

function AllianceCard({
  title,
  seats,
  delay,
  color,
  className,
}: {
  title: string;
  seats: number;
  delay: number;
  color: string;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={`rounded-xl border border-white/10 bg-[#1a1a2e]/80 px-4 py-3 shadow-lg backdrop-blur-md ${className ?? ""}`}
    >
      <p className="text-[10px] font-medium tracking-wider text-white/50 uppercase">
        {title}
      </p>
      <p className={`text-2xl font-bold ${color}`}>{seats}</p>
      <p className="text-[10px] text-white/40">seats won</p>
    </motion.div>
  );
}

// ─── Main Section ───

export function PoliticalLandscapeSection({
  data,
}: {
  data: PoliticalLandscapeData;
}) {
  const [hoveredState, setHoveredState] = useState<StateData | null>(null);

  const totalNda = useMemo(
    () => data.states.reduce((sum, s) => sum + s.ndaSeats, 0),
    [data.states],
  );
  const totalIndia = useMemo(
    () => data.states.reduce((sum, s) => sum + s.indiaSeats, 0),
    [data.states],
  );

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-[#0c0c1d]">
      {/* Top shadow — smooth blend from hero section above */}
      <div className="absolute top-0 left-0 right-0 z-[2] h-40 bg-gradient-to-b from-black/80 via-black/40 to-transparent" />
      <div className="absolute top-0 left-0 right-0 z-[2] h-20 bg-gradient-to-b from-[#0c0c1d] to-transparent" />

      {/* Background — flag video */}
      <BackgroundVideo
        src={data.backgroundVideo}
        poster={data.backgroundPoster}
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 z-[1] bg-black/60" />

      {/* Content */}
      <div className="relative z-10 mx-auto flex min-h-screen max-w-[1440px] flex-col justify-center px-4 py-20 sm:px-6 md:flex-row md:items-center md:gap-8 lg:gap-12 lg:px-8 xl:px-12">
        {/* Left side — text */}
        <div className="flex-1 md:max-w-[480px]">
          {/* Badge */}
          <ScrollReveal delay={0} direction="left">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5">
              <span className="h-2 w-2 rounded-full bg-amber-500" />
              <span className="text-xs font-medium text-amber-400 sm:text-sm">
                {data.badge}
              </span>
            </div>
          </ScrollReveal>

          {/* Heading — word-by-word reveal */}
          <ScrollRevealText
            text={data.title}
            highlight={data.titleHighlight}
            delay={0.2}
            className="text-3xl font-extrabold leading-tight text-white sm:text-4xl lg:text-5xl"
          />

          {/* Subtitle */}
          <ScrollReveal delay={0.5}>
            <p className="mt-4 text-sm leading-relaxed text-white/60 sm:text-base lg:text-lg">
              {data.subtitle}
            </p>
          </ScrollReveal>

        </div>

        {/* Right side — India map + floating cards + dotted lines */}
        <div className="relative mt-12 flex-1 md:mt-0">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="india-map-wrapper relative mx-auto h-[320px] w-[320px] sm:h-[380px] sm:w-[380px] md:h-[420px] md:w-[420px] lg:h-[520px] lg:w-[520px]"
          >
            {/* Map */}
            <IndiaMap
              states={data.states}
              onStateHover={(state) => setHoveredState(state)}
              hoveredState={hoveredState}
            />

            {/* SVG dotted connector lines — pointer-events-none */}
            <svg className="pointer-events-none absolute inset-0 z-10 h-full w-full overflow-visible">
              <defs>
                <motion.linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="rgba(245,158,11,0.6)" />
                  <stop offset="100%" stopColor="rgba(245,158,11,0.1)" />
                </motion.linearGradient>
              </defs>
              {/* Top-left card → map center-top */}
              <motion.line
                x1="8%" y1="12%" x2="38%" y2="25%"
                stroke="url(#lineGrad)" strokeWidth="1" strokeDasharray="4 4"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6, duration: 0.8 }}
              />
              {/* Top-right card → map top-right */}
              <motion.line
                x1="92%" y1="12%" x2="65%" y2="22%"
                stroke="url(#lineGrad)" strokeWidth="1" strokeDasharray="4 4"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.7, duration: 0.8 }}
              />
              {/* Left card → map center-left */}
              <motion.line
                x1="5%" y1="60%" x2="32%" y2="50%"
                stroke="url(#lineGrad)" strokeWidth="1" strokeDasharray="4 4"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.8, duration: 0.8 }}
              />
              {/* Bottom-left card → map bottom */}
              <motion.line
                x1="22%" y1="92%" x2="42%" y2="75%"
                stroke="url(#lineGrad)" strokeWidth="1" strokeDasharray="4 4"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.9, duration: 0.8 }}
              />
              {/* Bottom-right card → map bottom-right */}
              <motion.line
                x1="88%" y1="88%" x2="60%" y2="72%"
                stroke="url(#lineGrad)" strokeWidth="1" strokeDasharray="4 4"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 1.0, duration: 0.8 }}
              />
              {/* Center card → map center */}
              <motion.line
                x1="50%" y1="42%" x2="50%" y2="35%"
                stroke="url(#lineGrad)" strokeWidth="1" strokeDasharray="4 4"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.65, duration: 0.8 }}
              />
            </svg>

            {/* Always-visible floating stat cards — pointer-events-none */}
            <div className="pointer-events-none absolute inset-0 z-20 overflow-visible">
              {/* Top-left: Lok Sabha Seats */}
              <FloatingStatCard
                icon="users"
                value={data.overallStats[0]?.value ?? "543+"}
                label={data.overallStats[0]?.label ?? "Lok Sabha Seats"}
                delay={0.5}
                className="absolute -left-6 -top-4 sm:-left-8 sm:-top-6"
              />

              {/* Top-right: NDA Alliance */}
              <AllianceCard
                title="NDA Alliance"
                seats={totalNda}
                delay={0.6}
                color="text-green-400"
                className="absolute -right-6 top-2 sm:-right-10"
              />

              {/* Center: States Covered */}
              <FloatingStatCard
                icon="map-pin"
                value={data.overallStats[1]?.value ?? "28"}
                label={data.overallStats[1]?.label ?? "States Covered"}
                delay={0.65}
                className="absolute left-[32%] top-[38%]"
              />

              {/* Left: India Alliance */}
              <AllianceCard
                title="India Alliance"
                seats={totalIndia}
                delay={0.7}
                color="text-blue-400"
                className="absolute -left-6 bottom-[28%] sm:-left-10"
              />

              {/* Bottom-left: Campaigns */}
              <FloatingStatCard
                icon="bar-chart"
                value={data.overallStats[2]?.value ?? "1,000+"}
                label={data.overallStats[2]?.label ?? "Campaigns"}
                delay={0.8}
                className="absolute bottom-2 left-[10%] sm:bottom-0"
              />

              {/* Bottom-right: Accuracy */}
              <FloatingStatCard
                icon="trending-up"
                value={data.overallStats[3]?.value ?? "95%"}
                label={data.overallStats[3]?.label ?? "Accuracy"}
                delay={0.9}
                className="absolute -right-6 bottom-6 sm:-right-10 sm:bottom-4"
              />
            </div>

            {/* State tooltip — only on hover */}
            <AnimatePresence>
              {hoveredState && (
                <div className="pointer-events-none absolute left-1/2 top-[30%] z-30 -translate-x-1/2 -translate-y-1/2">
                  <StateTooltip state={hoveredState} />
                </div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      {/* Bottom shadow — deep fade into next section */}
      <div className="absolute bottom-0 left-0 right-0 z-[2] h-40 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 z-[2] h-20 bg-gradient-to-t from-[#0c0c1d] to-transparent" />

      {/* Edge vignette for depth */}
      <div className="absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.4)_100%)]" />
    </section>
  );
}
