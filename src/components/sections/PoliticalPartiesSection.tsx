import { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "motion/react";
import { Users, MapPin, Award, Landmark, Vote, TrendingUp, Map, ChartNoAxesCombined } from "lucide-react";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { useCountUp } from "@/hooks/useCountUp";

// ─── Party Data ───

export interface PoliticalParty {
  id: string;
  shortName: string;
  fullName: string;
  established: number;
  logo: string;
  backgroundImage: string;
  themeColor: string;
  themeColorRgb: string;
  description: string;
  lokSabhaSeats: number;
  statesRuled: number;
  president: string;
}

const PARTIES: PoliticalParty[] = [
  {
    id: "bjp",
    shortName: "BJP",
    fullName: "Bharatiya Janata Party",
    established: 1980,
    logo: "/logo/BJP.png.svg",
    backgroundImage: "/images/Image (Bharatiya Janata Party).png",
    themeColor: "#FF6B00",
    themeColorRgb: "255, 107, 0",
    description:
      "India's ruling party with a strong nationalist agenda focusing on development, Hindutva ideology, and economic reforms.",
    lokSabhaSeats: 303,
    statesRuled: 12,
    president: "J.P. Nadda",
  },
  {
    id: "inc",
    shortName: "INC",
    fullName: "Indian National Congress",
    established: 1885,
    logo: "/logo/INC.png.svg",
    backgroundImage: "/images/Image (Indian National Congress).png",
    themeColor: "#00BFFF",
    themeColorRgb: "0, 191, 255",
    description:
      "India's oldest political party with a secular vision, focusing on social welfare, inclusive growth, and democratic values.",
    lokSabhaSeats: 52,
    statesRuled: 4,
    president: "Mallikarjun Kharge",
  },
  {
    id: "aap",
    shortName: "AAP",
    fullName: "Aam Aadmi Party",
    established: 2012,
    logo: "/logo/AAP.png.svg",
    backgroundImage: "/images/Image (Aam Aadmi Party).png",
    themeColor: "#0E8C3A",
    themeColorRgb: "14, 140, 58",
    description:
      "An anti-corruption movement turned political party, focusing on education, healthcare, and governance transparency.",
    lokSabhaSeats: 10,
    statesRuled: 2,
    president: "Arvind Kejriwal",
  },
  {
    id: "sp",
    shortName: "SP",
    fullName: "Samajwadi Party",
    established: 1992,
    logo: "/logo/SP.png.svg",
    backgroundImage: "/images/Image (Samajwadi Party).png",
    themeColor: "#DC2626",
    themeColorRgb: "220, 38, 38",
    description:
      "Uttar Pradesh-based party championing social justice, secularism, and the upliftment of backward classes.",
    lokSabhaSeats: 5,
    statesRuled: 1,
    president: "Akhilesh Yadav",
  },
  {
    id: "bsp",
    shortName: "BSP",
    fullName: "Bahujan Samaj Party",
    established: 1984,
    logo: "/logo/BSP.svg",
    backgroundImage: "/images/Image (Bahujan Samaj Party).png",
    themeColor: "#2563EB",
    themeColorRgb: "37, 99, 235",
    description:
      "A party dedicated to the empowerment of Dalits, Adivasis, OBCs, and religious minorities in Indian politics.",
    lokSabhaSeats: 0,
    statesRuled: 0,
    president: "Mayawati",
  },
  {
    id: "tmc",
    shortName: "TMC",
    fullName: "Trinamool Congress",
    established: 1998,
    logo: "/logo/BSP.svg",
    backgroundImage: "/images/Image (Trinamool Congress).png",
    themeColor: "#22C55E",
    themeColorRgb: "34, 197, 94",
    description:
      "West Bengal's dominant party advocating for federalism, social welfare, and regional autonomy under strong leadership.",
    lokSabhaSeats: 29,
    statesRuled: 1,
    president: "Mamata Banerjee",
  },
  {
    id: "dmk",
    shortName: "DMK",
    fullName: "Dravida Munnetra Kazhagam",
    established: 1949,
    logo: "/logo/BSP.svg",
    backgroundImage: "/images/Image (Dravida Munnetra Kazhagam).png",
    themeColor: "#EF4444",
    themeColorRgb: "239, 68, 68",
    description:
      "Tamil Nadu's leading Dravidian party championing social justice, rationalism, and linguistic pride.",
    lokSabhaSeats: 22,
    statesRuled: 1,
    president: "M.K. Stalin",
  },
];

const PLATFORM_STATS = [
  { icon: "parties", value: 2500, suffix: "+", label: "Registered Parties" },
  { icon: "seats", value: 543, suffix: "", label: "Lok Sabha Seats" },
  { icon: "states", value: 28, suffix: "", label: "States & UTs" },
  { icon: "accuracy", value: 95, suffix: "%", label: "Data Accuracy" },
];

function AnimatedIcon({ icon }: { icon: string }) {
  const icons: Record<string, { Icon: React.ElementType; animation: object }> = {
    parties: {
      Icon: Landmark,
      animation: {
        y: [0, -3, 0],
        transition: { duration: 2, repeat: Infinity, ease: "easeInOut" },
      },
    },
    seats: {
      Icon: Vote,
      animation: {
        rotate: [0, -8, 8, -4, 0],
        transition: { duration: 2.5, repeat: Infinity, ease: "easeInOut" },
      },
    },
    states: {
      Icon: Map,
      animation: {
        scale: [1, 1.12, 1],
        transition: { duration: 2, repeat: Infinity, ease: "easeInOut" },
      },
    },
    accuracy: {
      Icon: ChartNoAxesCombined,
      animation: {
        y: [0, -4, 0],
        rotate: [0, 3, 0],
        transition: { duration: 1.8, repeat: Infinity, ease: "easeInOut" },
      },
    },
  };

  const { Icon, animation } = icons[icon] ?? { Icon: Landmark, animation: {} };

  return (
    <motion.div animate={animation}>
      <Icon className="h-6 w-6" />
    </motion.div>
  );
}

// ─── Animated Stat Counter ───

function StatCounter({
  icon,
  value,
  suffix,
  label,
  index,
}: {
  icon: string;
  value: number;
  suffix: string;
  label: string;
  index: number;
}) {
  const { count, ref } = useCountUp(value, 2000);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.25, 1, 0.5, 1] }}
      whileHover={{ y: -4, boxShadow: "0 12px 32px rgba(245, 158, 11, 0.12)" }}
      className="group flex items-center gap-4 rounded-2xl border border-amber-500/20 bg-white/90 px-5 py-4 shadow-md backdrop-blur-sm transition-colors hover:border-amber-500/40 sm:px-6 sm:py-5"
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500/15 to-orange-500/10 text-amber-500 ring-1 ring-amber-500/10 sm:h-14 sm:w-14">
        <AnimatedIcon icon={icon} />
      </div>
      <div>
        <p className="text-2xl font-extrabold text-gray-900 sm:text-3xl">
          <span ref={ref}>{count.toLocaleString()}</span>
          <span className="text-amber-500">{suffix}</span>
        </p>
        <p className="text-[11px] font-semibold tracking-wider text-gray-400 uppercase sm:text-xs">
          {label}
        </p>
      </div>
    </motion.div>
  );
}

// ─── Scroll-wheel digit roller ───

function RollingNumber({
  value,
  isActive,
  color,
}: {
  value: number;
  isActive: boolean;
  color: string;
}) {
  const digits = String(value).split("");
  return (
    <div className="flex overflow-hidden" style={{ color }}>
      {digits.map((digit, i) => (
        <motion.div
          key={`${i}-${digit}`}
          className="relative text-2xl font-extrabold leading-none sm:text-3xl"
          initial={{ y: 30, opacity: 0 }}
          animate={
            isActive
              ? { y: 0, opacity: 1 }
              : { y: 30, opacity: 0 }
          }
          transition={{
            duration: 0.6,
            delay: isActive ? 0.3 + i * 0.08 : 0,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          {digit}
        </motion.div>
      ))}
    </div>
  );
}

// ─── Single Party Strip ───

function PartyStrip({
  party,
  isExpanded,
  onHoverStart,
  onHoverEnd,
}: {
  party: PoliticalParty;
  isExpanded: boolean;
  onHoverStart: () => void;
  onHoverEnd: () => void;
}) {
  return (
    <motion.div
      onMouseEnter={onHoverStart}
      onMouseLeave={onHoverEnd}
      className="relative h-full cursor-pointer overflow-hidden rounded-2xl"
      animate={{ flex: isExpanded ? 4 : 0.7 }}
      transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
      style={{
        minWidth: 0,
      }}
    >
      {/* Background image */}
      <motion.img
        src={party.backgroundImage}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
        animate={{ scale: isExpanded ? 1 : 1.1 }}
        transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
      />

      {/* Party-colored tint overlay */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: isExpanded
            ? `linear-gradient(to bottom, rgba(${party.themeColorRgb}, 0.3) 0%, rgba(${party.themeColorRgb}, 0.5) 100%)`
            : "linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.55) 100%)",
        }}
        transition={{ duration: 0.5 }}
      />

      {/* Top accent line */}
      <motion.div
        className="absolute left-0 top-0 z-20 h-[3px]"
        animate={{ width: isExpanded ? "35%" : "0%", opacity: isExpanded ? 1 : 0 }}
        transition={{ duration: 0.5, delay: isExpanded ? 0.2 : 0 }}
        style={{ backgroundColor: party.themeColor }}
      />

      {/* ── SINGLE animated logo: glass circle ↔ white rect ── */}
      <motion.div
        className="absolute z-30 flex items-center justify-center"
        animate={{
          top: isExpanded ? "calc(10% + 24px)" : 16,
          left: isExpanded ? 38 : "50%",
          x: isExpanded ? 0 : "-50%",
          width: isExpanded ? 76 : 64,
          height: isExpanded ? 76 : 64,
          borderRadius: isExpanded ? 18 : 32,
        }}
        transition={{ duration: 0.55, ease: [0.25, 1, 0.5, 1] }}
      >
        {/* Glass circle bg — collapsed */}
        <motion.div
          className="absolute inset-0"
          animate={{
            opacity: isExpanded ? 0 : 1,
            borderRadius: isExpanded ? 16 : 36,
          }}
          transition={{ duration: 0.35 }}
          style={{
            background: "rgba(255,255,255,0.06)",
            border: "2px solid rgba(255,255,255,0.3)",
            boxShadow: "0 4px 24px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.15)",
          }}
        />
        {/* White rect bg — expanded */}
        <motion.div
          className="absolute inset-0"
          animate={{
            opacity: isExpanded ? 1 : 0,
            borderRadius: isExpanded ? 16 : 36,
          }}
          transition={{ duration: 0.35, delay: isExpanded ? 0.08 : 0 }}
          style={{
            background: "rgba(255,255,255,0.95)",
            boxShadow: "0 8px 28px rgba(0,0,0,0.2)",
          }}
        />
        {/* Logo */}
        <motion.img
          src={party.logo}
          alt={party.shortName}
          className="relative z-10 object-contain"
          animate={{ width: isExpanded ? 52 : 36, height: isExpanded ? 52 : 36 }}
          transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
        />
      </motion.div>

      {/* ── Collapsed: vertical name at bottom ── */}
      <motion.div
        animate={{ opacity: isExpanded ? 0 : 1 }}
        transition={{ duration: 0.15 }}
        className="absolute inset-x-0 bottom-0 z-10 flex items-end justify-center pb-4"
        style={{
          pointerEvents: isExpanded ? "none" : "auto",
          visibility: isExpanded ? "hidden" : "visible",
          transitionProperty: "visibility",
          transitionDelay: isExpanded ? "0s" : "0.15s",
        }}
      >
        <span
          className="text-xs font-bold tracking-[0.2em] text-white drop-shadow-lg uppercase"
          style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
        >
          {party.shortName}
        </span>
      </motion.div>

      {/* ── Expanded: transparent glass info panel ── */}
      <motion.div
        className="absolute z-10 overflow-hidden rounded-xl"
        animate={{
          opacity: isExpanded ? 1 : 0,
          y: isExpanded ? 0 : 20,
          top: isExpanded ? "10%" : "18%",
          left: isExpanded ? 24 : 24,
          right: isExpanded ? 24 : 24,
          bottom: isExpanded ? 24 : 44,
        }}
        transition={{ duration: 0.5, delay: isExpanded ? 0.08 : 0, ease: [0.25, 1, 0.5, 1] }}
        style={{
          pointerEvents: isExpanded ? "auto" : "none",
          visibility: isExpanded ? "visible" : "hidden",
          transitionProperty: "visibility",
          transitionDelay: isExpanded ? "0s" : "0.5s",
          background: "rgba(0, 0, 0, 0.35)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          border: `1.5px solid rgba(${party.themeColorRgb}, 0.4)`,
          boxShadow: `0 0 24px rgba(${party.themeColorRgb}, 0.1), inset 0 1px 0 rgba(255,255,255,0.08)`,
        }}
      >
        <div className="flex h-full flex-col justify-between p-4 sm:p-5">
          {/* Name + Badge — offset right for logo */}
          <div className="pl-[80px] pt-0.5 sm:pl-[84px]">
            <div className="mb-1.5 flex items-center gap-2">
              <span className="text-xs font-bold tracking-wider uppercase" style={{ color: party.themeColor }}>
                {party.shortName}
              </span>
              <span className="text-xs text-white/50">Est. {party.established}</span>
            </div>
            <h3 className="text-xl font-bold leading-tight text-white sm:text-2xl">{party.fullName}</h3>
          </div>

          <p className="text-sm leading-relaxed text-white/80 sm:text-base">{party.description}</p>

          {/* Stats — rolling numbers */}
          <div className="flex gap-3">
            <div className="rounded-lg px-5 py-2.5" style={{ backgroundColor: `rgba(${party.themeColorRgb}, 0.15)`, border: `1px solid rgba(${party.themeColorRgb}, 0.3)` }}>
              <RollingNumber value={party.lokSabhaSeats} isActive={isExpanded} color={party.themeColor} />
              <p className="text-[10px] font-medium text-white/50 uppercase">Lok Sabha Seats</p>
            </div>
            <div className="rounded-lg px-5 py-2.5" style={{ backgroundColor: `rgba(${party.themeColorRgb}, 0.15)`, border: `1px solid rgba(${party.themeColorRgb}, 0.3)` }}>
              <RollingNumber value={party.statesRuled} isActive={isExpanded} color={party.themeColor} />
              <p className="text-[10px] font-medium text-white/50 uppercase">States Ruled</p>
            </div>
          </div>

          {/* President */}
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10">
              <Users className="h-4 w-4 text-white/50" />
            </div>
            <div>
              <p className="text-[10px] text-white/40 uppercase">President</p>
              <p className="text-sm font-semibold text-white">{party.president}</p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Main Section ───

export function PoliticalPartiesSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isUserHovering, setIsUserHovering] = useState(false);
  const autoTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startAutoPlay = useCallback(() => {
    if (autoTimerRef.current) clearInterval(autoTimerRef.current);
    autoTimerRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % PARTIES.length);
    }, 3500);
  }, []);

  useEffect(() => {
    if (!isUserHovering) {
      startAutoPlay();
    } else if (autoTimerRef.current) {
      clearInterval(autoTimerRef.current);
      autoTimerRef.current = null;
    }
    return () => {
      if (autoTimerRef.current) clearInterval(autoTimerRef.current);
    };
  }, [isUserHovering, startAutoPlay]);

  const handleHoverStart = (index: number) => {
    setIsUserHovering(true);
    setActiveIndex(index);
  };

  const handleHoverEnd = () => {
    setIsUserHovering(false);
  };

  return (
    <section className="relative overflow-hidden bg-white py-20 sm:py-24 lg:py-32">
      {/* ── Indian flag smoky background ── */}
      <div className="pointer-events-none absolute inset-0">
        {/* SVG turbulence filter for organic smoke texture */}
        <svg className="absolute h-0 w-0">
          <defs>
            <filter id="smoke-texture">
              <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="4" seed="2" result="noise" />
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="80" xChannelSelector="R" yChannelSelector="G" />
            </filter>
            <filter id="smoke-texture-fine">
              <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="5" seed="7" result="noise" />
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="50" xChannelSelector="R" yChannelSelector="G" />
            </filter>
          </defs>
        </svg>

        {/* Base warm tint */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, rgba(255, 153, 51, 0.08) 0%, rgba(255, 245, 230, 0.05) 35%, rgba(255,255,255,0) 50%, rgba(230, 255, 230, 0.05) 65%, rgba(19, 136, 8, 0.08) 100%)",
          }}
        />

        {/* ── SAFFRON SMOKE — left side ── */}
        {/* Primary large cloud */}
        <div className="smoke-drift-slow absolute -left-[5%] -top-[10%] h-[80%] w-[50%] opacity-70"
          style={{ background: "radial-gradient(ellipse 70% 60% at 30% 40%, rgba(255, 140, 0, 0.6) 0%, rgba(255, 165, 50, 0.3) 40%, transparent 70%)", filter: "url(#smoke-texture) blur(40px)" }}
        />
        {/* Secondary warm blob */}
        <div className="smoke-drift-medium absolute left-[2%] top-[15%] h-[55%] w-[38%] opacity-60"
          style={{ background: "radial-gradient(ellipse 80% 50% at 40% 50%, rgba(255, 120, 0, 0.55) 0%, rgba(255, 180, 80, 0.2) 50%, transparent 75%)", filter: "url(#smoke-texture-fine) blur(30px)" }}
        />
        {/* Deep saffron accent */}
        <div className="smoke-drift-fast absolute -left-[3%] top-[5%] h-[45%] w-[30%] opacity-75"
          style={{ background: "radial-gradient(ellipse at 35% 45%, rgba(255, 100, 0, 0.7) 0%, rgba(255, 153, 51, 0.3) 45%, transparent 70%)", filter: "blur(25px)" }}
        />
        {/* Lower saffron wisp */}
        <div className="smoke-drift-slow absolute left-[8%] bottom-[5%] h-[50%] w-[32%] opacity-50"
          style={{ background: "radial-gradient(ellipse 60% 80% at 50% 60%, rgba(255, 160, 50, 0.45) 0%, rgba(255, 200, 120, 0.15) 50%, transparent 75%)", filter: "url(#smoke-texture) blur(35px)" }}
        />
        {/* Bright saffron highlight */}
        <div className="smoke-drift-medium absolute left-[5%] top-[30%] h-[25%] w-[20%] opacity-55"
          style={{ background: "radial-gradient(circle at center, rgba(255, 180, 50, 0.6) 0%, rgba(255, 140, 0, 0.2) 50%, transparent 70%)", filter: "blur(20px)" }}
        />
        {/* Extra saffron streak top-left */}
        <div className="smoke-drift-fast absolute -left-[8%] top-[0%] h-[35%] w-[40%] opacity-45"
          style={{ background: "radial-gradient(ellipse 90% 40% at 20% 30%, rgba(255, 130, 20, 0.5) 0%, transparent 65%)", filter: "url(#smoke-texture-fine) blur(45px)" }}
        />

        {/* ── WHITE CENTER MIST ── */}
        <div className="absolute left-[20%] top-[0%] h-full w-[60%] opacity-80"
          style={{ background: "radial-gradient(ellipse 100% 80% at 50% 50%, rgba(255, 255, 255, 0.95) 0%, rgba(255, 250, 240, 0.5) 40%, transparent 70%)" }}
        />
        <div className="smoke-drift-slow absolute left-[28%] top-[20%] h-[60%] w-[44%] opacity-60"
          style={{ background: "radial-gradient(ellipse at center, rgba(255, 252, 245, 0.7) 0%, transparent 65%)", filter: "blur(50px)" }}
        />

        {/* ── GREEN SMOKE — right side ── */}
        {/* Primary large cloud */}
        <div className="smoke-drift-slow absolute -right-[5%] -top-[5%] h-[75%] w-[45%] opacity-55"
          style={{ background: "radial-gradient(ellipse 65% 70% at 70% 45%, rgba(19, 136, 8, 0.5) 0%, rgba(50, 180, 50, 0.2) 45%, transparent 72%)", filter: "url(#smoke-texture) blur(40px)" }}
        />
        {/* Secondary green blob */}
        <div className="smoke-drift-medium absolute right-[3%] top-[20%] h-[50%] w-[35%] opacity-50"
          style={{ background: "radial-gradient(ellipse 75% 55% at 55% 50%, rgba(34, 160, 30, 0.45) 0%, rgba(80, 200, 80, 0.15) 50%, transparent 73%)", filter: "url(#smoke-texture-fine) blur(30px)" }}
        />
        {/* Deep green accent */}
        <div className="smoke-drift-fast absolute right-[0%] bottom-[10%] h-[45%] w-[30%] opacity-60"
          style={{ background: "radial-gradient(ellipse at 60% 55%, rgba(0, 120, 0, 0.55) 0%, rgba(19, 136, 8, 0.2) 45%, transparent 70%)", filter: "blur(25px)" }}
        />
        {/* Light green wisp */}
        <div className="smoke-drift-slow absolute right-[10%] bottom-[0%] h-[40%] w-[28%] opacity-40"
          style={{ background: "radial-gradient(ellipse 55% 75% at 50% 65%, rgba(50, 180, 50, 0.4) 0%, rgba(100, 220, 100, 0.1) 50%, transparent 72%)", filter: "url(#smoke-texture) blur(35px)" }}
        />
        {/* Bright green highlight */}
        <div className="smoke-drift-medium absolute right-[8%] top-[35%] h-[20%] w-[18%] opacity-45"
          style={{ background: "radial-gradient(circle at center, rgba(60, 200, 60, 0.5) 0%, rgba(19, 136, 8, 0.15) 50%, transparent 70%)", filter: "blur(18px)" }}
        />

        {/* Top/bottom fade to white for clean section transitions */}
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-white to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-white to-transparent" />
      </div>

      <div className="relative mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 xl:px-12">
        {/* Section Header */}
        <div className="text-center">
          <ScrollReveal>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5">
              <Landmark className="h-4 w-4 text-amber-500" />
              <span className="text-xs font-semibold tracking-wider text-amber-600 uppercase">
                Political Landscape
              </span>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl lg:text-5xl">
              Political Parties of{" "}
              <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
                India
              </span>
            </h2>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-gray-500 sm:text-base">
              Comprehensive analysis of India's major political parties, their
              ideologies, strategies, and electoral performance across states.
            </p>
          </ScrollReveal>

          {/* Decorative divider */}
          <ScrollReveal delay={0.3}>
            <div className="mx-auto mt-6 flex items-center justify-center gap-2">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-amber-400" />
              <div className="h-1.5 w-1.5 rounded-full bg-amber-500" />
              <div className="h-px w-24 bg-amber-400" />
              <div className="h-1.5 w-1.5 rounded-full bg-amber-500" />
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-amber-400" />
            </div>
          </ScrollReveal>
        </div>

        {/* Party Cards Accordion — inside outer glass box */}
        <ScrollReveal delay={0.4}>
          <div
            className="mx-auto mt-12 rounded-2xl p-2 sm:p-3 lg:mt-16"
            style={{
              background: "rgba(255,255,255,0.08)",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
              border: "1px solid rgba(255,255,255,0.15)",
              boxShadow: "0 4px 30px rgba(0,0,0,0.06)",
            }}
          >
          <div className="flex h-[380px] gap-2 sm:h-[440px] sm:gap-3 lg:h-[480px]">
            {PARTIES.map((party, index) => (
              <PartyStrip
                key={party.id}
                party={party}
                isExpanded={activeIndex === index}
                onHoverStart={() => handleHoverStart(index)}
                onHoverEnd={handleHoverEnd}
              />
            ))}
          </div>
          </div>
        </ScrollReveal>

        {/* Bottom Stats */}
        <div className="mt-12 grid grid-cols-2 gap-4 sm:gap-5 lg:mt-16 lg:grid-cols-4">
          {PLATFORM_STATS.map((stat, i) => (
            <StatCounter
              key={stat.label}
              icon={stat.icon}
              value={stat.value}
              suffix={stat.suffix}
              label={stat.label}
              index={i}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
