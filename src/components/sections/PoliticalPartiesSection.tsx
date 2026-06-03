import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Users, MapPin, Award, Landmark, Vote, TrendingUp, Map, ChartNoAxesCombined, ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatedLucideIcon } from "@/components/AnimatedLucideIcon";
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
  {
    id: "ncp",
    shortName: "NCP",
    fullName: "Nationalist Congress Party",
    established: 1999,
    logo: "/logo/BSP.svg",
    backgroundImage: "/images/Image (Indian National Congress).png",
    themeColor: "#1E88E5",
    themeColorRgb: "30, 136, 229",
    description:
      "A centrist political party committed to nationalism, democracy, and social justice with a strong base in Maharashtra.",
    lokSabhaSeats: 5,
    statesRuled: 0,
    president: "Ajit Pawar",
  },
  {
    id: "jdu",
    shortName: "JDU",
    fullName: "Janata Dal (United)",
    established: 1999,
    logo: "/logo/BSP.svg",
    backgroundImage: "/images/Image (Samajwadi Party).png",
    themeColor: "#43A047",
    themeColorRgb: "67, 160, 71",
    description:
      "Bihar-centric party focused on social justice, secularism, and development under the banner of good governance.",
    lokSabhaSeats: 12,
    statesRuled: 1,
    president: "Nitish Kumar",
  },
  {
    id: "shiv-sena",
    shortName: "SHS",
    fullName: "Shiv Sena",
    established: 1966,
    logo: "/logo/BSP.svg",
    backgroundImage: "/images/Image (Bharatiya Janata Party).png",
    themeColor: "#FF6F00",
    themeColorRgb: "255, 111, 0",
    description:
      "Maharashtra-based party with a strong Marathi identity politics agenda, now split into two factions.",
    lokSabhaSeats: 7,
    statesRuled: 0,
    president: "Eknath Shinde",
  },
  {
    id: "tdp",
    shortName: "TDP",
    fullName: "Telugu Desam Party",
    established: 1982,
    logo: "/logo/BSP.svg",
    backgroundImage: "/images/Image (Trinamool Congress).png",
    themeColor: "#FFCA28",
    themeColorRgb: "255, 202, 40",
    description:
      "Andhra Pradesh's regional party championing Telugu pride, development, and good governance.",
    lokSabhaSeats: 16,
    statesRuled: 1,
    president: "N. Chandrababu Naidu",
  },
  {
    id: "ysrcp",
    shortName: "YSRCP",
    fullName: "YSR Congress Party",
    established: 2011,
    logo: "/logo/BSP.svg",
    backgroundImage: "/images/Image (Aam Aadmi Party).png",
    themeColor: "#0277BD",
    themeColorRgb: "2, 119, 189",
    description:
      "Andhra Pradesh party focused on welfare schemes, social justice, and development for all sections.",
    lokSabhaSeats: 4,
    statesRuled: 0,
    president: "Y.S. Jagan Mohan Reddy",
  },
];

const PLATFORM_STATS = [
  { icon: "parties", value: 2500, suffix: "+", label: "Registered Parties" },
  { icon: "seats", value: 543, suffix: "", label: "Lok Sabha Seats" },
  { icon: "states", value: 28, suffix: "", label: "States & UTs" },
  { icon: "accuracy", value: 95, suffix: "%", label: "Data Accuracy" },
];

const platformIconMap: Record<string, React.ComponentType<import("lucide-react").LucideProps>> = {
  parties: Landmark,
  seats: Vote,
  states: Map,
  accuracy: ChartNoAxesCombined,
};

function AnimatedIcon({ icon }: { icon: string }) {
  const Icon = platformIconMap[icon] ?? Landmark;
  return <AnimatedLucideIcon icon={Icon} size={24} />;
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
  const { count, ref } = useCountUp(value, 3500);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.25, 1, 0.5, 1] }}
      whileHover={{ y: -4, boxShadow: "0 12px 32px rgba(245, 158, 11, 0.12)" }}
      className="group flex items-center gap-3 rounded-2xl border border-amber-500/20 bg-white/90 px-3 py-3 shadow-md backdrop-blur-sm transition-colors hover:border-amber-500/40 sm:gap-4 sm:px-5 sm:py-4 md:px-6 md:py-5"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500/15 to-orange-500/10 text-amber-500 ring-1 ring-amber-500/10 sm:h-12 sm:w-12 md:h-14 md:w-14">
        <AnimatedIcon icon={icon} />
      </div>
      <div className="min-w-0">
        <p className="text-lg font-extrabold text-gray-900 sm:text-2xl md:text-3xl">
          <span ref={ref}>{count.toLocaleString()}</span>
          <span className="text-amber-500">{suffix}</span>
        </p>
        <p className="truncate text-[10px] font-semibold tracking-wider text-gray-400 uppercase sm:text-[11px] md:text-xs">
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
  collapsedWidth,
  expandedWidth,
}: {
  party: PoliticalParty;
  isExpanded: boolean;
  onHoverStart: () => void;
  onHoverEnd: () => void;
  collapsedWidth: number;
  expandedWidth: number;
}) {
  return (
    <motion.div
      onMouseEnter={onHoverStart}
      onMouseLeave={onHoverEnd}
      className="relative h-full cursor-pointer overflow-hidden rounded-2xl"
      animate={{ width: isExpanded ? expandedWidth : collapsedWidth }}
      transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
      style={{ flexShrink: 0 }}
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

      {/* ── Collapsed: logo circle ── */}
      <motion.div
        className="absolute z-30 flex items-center justify-center"
        animate={{
          top: isExpanded ? -100 : 16,
          left: "50%",
          x: "-50%",
          width: 48,
          height: 48,
          borderRadius: 24,
          opacity: isExpanded ? 0 : 1,
        }}
        transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
      >
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: "rgba(255,255,255,0.06)",
            border: "2px solid rgba(255,255,255,0.3)",
            boxShadow: "0 4px 24px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.15)",
          }}
        />
        <img
          src={party.logo}
          alt={party.shortName}
          className="relative z-10 h-8 w-8 object-contain"
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
          top: isExpanded ? "8%" : "18%",
          left: isExpanded ? 20 : 24,
          right: isExpanded ? 20 : 24,
          bottom: isExpanded ? 20 : 44,
        }}
        transition={{ duration: 0.5, delay: isExpanded ? 0.08 : 0, ease: [0.25, 1, 0.5, 1] }}
        style={{
          pointerEvents: isExpanded ? "auto" : "none",
          visibility: isExpanded ? "visible" : "hidden",
          transitionProperty: "visibility",
          transitionDelay: isExpanded ? "0s" : "0.5s",
          background: `linear-gradient(to bottom, rgba(${party.themeColorRgb}, 0.15) 0%, rgba(0, 0, 0, 0.18) 100%)`,
          backdropFilter: "blur(2px)",
          WebkitBackdropFilter: "blur(2px)",
          border: `1.5px solid rgba(255, 255, 255, 0.18)`,
          boxShadow: `0 0 24px rgba(${party.themeColorRgb}, 0.08), inset 0 1px 0 rgba(255,255,255,0.1)`,
        }}
      >
        <div className="flex h-full flex-col justify-between p-3 sm:p-4 md:p-5">
          {/* Logo inside the glass panel */}
          <div className="flex items-start gap-3 sm:gap-4">
            <motion.div
              className="flex-shrink-0 rounded-2xl bg-white/90 p-2 shadow-lg sm:p-2.5"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={isExpanded ? { scale: 1, opacity: 1 } : { scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.4, delay: isExpanded ? 0.15 : 0, ease: [0.25, 1, 0.5, 1] }}
            >
              <img
                src={party.logo}
                alt={party.shortName}
                className="h-10 w-10 object-contain sm:h-12 sm:w-12"
              />
            </motion.div>
            <div className="min-w-0 pt-0.5">
              <div className="mb-1 flex items-center gap-1.5 sm:mb-1.5 sm:gap-2">
                <span className="text-[10px] font-bold tracking-wider uppercase sm:text-xs" style={{ color: party.themeColor }}>
                  {party.shortName}
                </span>
                <span className="text-[10px] text-white/60 sm:text-xs">Est. {party.established}</span>
              </div>
              <h3 className="text-base font-bold leading-tight text-white sm:text-xl md:text-2xl">{party.fullName}</h3>
            </div>
          </div>

          <p className="line-clamp-3 text-xs leading-relaxed text-white/80 sm:line-clamp-none sm:text-sm md:text-base">{party.description}</p>

          {/* Stats — rolling numbers */}
          <div className="flex gap-2 sm:gap-3">
            <div className="rounded-lg px-3 py-2 sm:px-5 sm:py-2.5" style={{ backgroundColor: `rgba(${party.themeColorRgb}, 0.15)`, border: `1px solid rgba(${party.themeColorRgb}, 0.3)` }}>
              <RollingNumber value={party.lokSabhaSeats} isActive={isExpanded} color={party.themeColor} />
              <p className="text-[9px] font-medium text-white/50 uppercase sm:text-[10px]">Lok Sabha Seats</p>
            </div>
            <div className="rounded-lg px-3 py-2 sm:px-5 sm:py-2.5" style={{ backgroundColor: `rgba(${party.themeColorRgb}, 0.15)`, border: `1px solid rgba(${party.themeColorRgb}, 0.3)` }}>
              <RollingNumber value={party.statesRuled} isActive={isExpanded} color={party.themeColor} />
              <p className="text-[9px] font-medium text-white/50 uppercase sm:text-[10px]">States Ruled</p>
            </div>
          </div>

          {/* President */}
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 sm:h-8 sm:w-8">
              <AnimatedLucideIcon icon={Users} size={14} className="text-white/50 sm:hidden" />
              <AnimatedLucideIcon icon={Users} size={16} className="hidden text-white/50 sm:block" />
            </div>
            <div>
              <p className="text-[9px] text-white/40 uppercase sm:text-[10px]">President</p>
              <p className="text-xs font-semibold text-white sm:text-sm">{party.president}</p>
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
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [cardWidths, setCardWidths] = useState({ collapsed: 110, expanded: 440 });
  const [scrollOffset, setScrollOffset] = useState(0);

  const getMaxScroll = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return 0;
    const gap = window.innerWidth < 640 ? 8 : 12;
    const totalWidth =
      (PARTIES.length - 1) * (cardWidths.collapsed + gap) + cardWidths.expanded;
    return Math.max(0, totalWidth - el.clientWidth);
  }, [cardWidths]);

  const canScrollLeft = scrollOffset > 5;
  const canScrollRight = getMaxScroll() > 0 && scrollOffset < getMaxScroll() - 5;

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

  // Responsive card widths
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w < 640) setCardWidths({ collapsed: 56, expanded: 260 });
      else if (w < 1024) setCardWidths({ collapsed: 76, expanded: 340 });
      else setCardWidths({ collapsed: 110, expanded: 440 });
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Auto-scroll to keep the active card visible
  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    const gap = window.innerWidth < 640 ? 8 : 12;
    const cardLeftFinal = activeIndex * (cardWidths.collapsed + gap);
    const cardRightFinal = cardLeftFinal + cardWidths.expanded;
    const containerWidth = el.clientWidth;
    const maxScroll = getMaxScroll();

    setScrollOffset((prev) => {
      if (cardRightFinal > prev + containerWidth - 20) {
        const target = Math.min(cardRightFinal - containerWidth + 40, maxScroll);
        return Math.max(0, target);
      } else if (cardLeftFinal < prev + 20) {
        return Math.max(0, cardLeftFinal - 40);
      }
      return prev;
    });
  }, [activeIndex, cardWidths, getMaxScroll]);

  const handleScrollClick = (direction: "left" | "right") => {
    const maxScroll = getMaxScroll();
    setScrollOffset((prev) =>
      Math.max(0, Math.min(prev + (direction === "left" ? -300 : 300), maxScroll)),
    );
  };

  const handleHoverStart = (index: number) => {
    setIsUserHovering(true);
    setActiveIndex(index);
  };

  const handleHoverEnd = () => {
    setIsUserHovering(false);
  };

  return (
    <section className="relative overflow-hidden bg-white py-20 sm:py-24 lg:py-32">
      {/* ── Video background ── */}
      <div className="pointer-events-none absolute inset-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
          poster="/images/tri-bg.jpg"
        >
          <source src="/videos/Tri-bg.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-white/60" />
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-white to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white to-transparent" />
      </div>

      <div className="relative mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 xl:px-12">
        {/* Section Header */}
        <div className="text-center">
          <ScrollReveal>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5">
              <AnimatedLucideIcon icon={Landmark} size={16} className="text-amber-500" />
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
          <div className="relative">
            <div
              ref={scrollContainerRef}
              className="h-[380px] overflow-hidden sm:h-[440px] lg:h-[480px]"
            >
              <motion.div
                className="flex h-full gap-2 sm:gap-3"
                animate={{ x: -scrollOffset }}
                transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
              >
                {PARTIES.map((party, index) => (
                  <PartyStrip
                    key={party.id}
                    party={party}
                    isExpanded={activeIndex === index}
                    onHoverStart={() => handleHoverStart(index)}
                    onHoverEnd={handleHoverEnd}
                    collapsedWidth={cardWidths.collapsed}
                    expandedWidth={cardWidths.expanded}
                  />
                ))}
              </motion.div>
            </div>

            {/* Bouncy scroll arrows */}
            <AnimatePresence>
              {canScrollLeft && (
                <motion.button
                  key="arrow-left"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => handleScrollClick("left")}
                  className="absolute left-2 top-1/2 z-30 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-amber-200/50 bg-white/90 shadow-lg backdrop-blur-sm hover:bg-white sm:h-11 sm:w-11"
                >
                  <motion.div
                    animate={{ x: [0, -5, 0] }}
                    transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <ChevronLeft className="h-5 w-5 text-amber-600" />
                  </motion.div>
                </motion.button>
              )}
            </AnimatePresence>
            <AnimatePresence>
              {canScrollRight && (
                <motion.button
                  key="arrow-right"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => handleScrollClick("right")}
                  className="absolute right-2 top-1/2 z-30 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-amber-200/50 bg-white/90 shadow-lg backdrop-blur-sm hover:bg-white sm:h-11 sm:w-11"
                >
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <ChevronRight className="h-5 w-5 text-amber-600" />
                  </motion.div>
                </motion.button>
              )}
            </AnimatePresence>
          </div>
          </div>
        </ScrollReveal>

        {/* Bottom Stats */}
        <div className="mt-10 grid grid-cols-2 gap-3 sm:mt-12 sm:gap-4 md:gap-5 lg:mt-16 lg:grid-cols-4">
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
