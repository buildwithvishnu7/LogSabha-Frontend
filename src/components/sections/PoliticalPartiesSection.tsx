import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence, useInView } from "motion/react";
import { Users, MapPin, Award, Landmark, Vote, TrendingUp, Map, ChartNoAxesCombined, ChevronLeft, ChevronRight } from "lucide-react";
import lottieWeb from "lottie-web";

// ─── Inline Lottie icon for badge ───
function BadgeLottieIcon({ src, size = 18, color = "#f59e0b" }: { src: string; size?: number; color?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const colorRef = useRef(color);
  colorRef.current = color;
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let cancelled = false;
    fetch(src).then(r => r.json()).then(json => {
      if (cancelled) return;
      el.innerHTML = "";
      const anim = lottieWeb.loadAnimation({ container: el, renderer: "svg", loop: true, autoplay: true, animationData: json });
      const recolor = () => {
        const c = colorRef.current;
        el.querySelectorAll("path,circle,rect,line,ellipse,polyline,polygon").forEach(p => {
          const s = p.getAttribute("stroke"); if (s && s !== "none" && s !== "transparent") p.setAttribute("stroke", c);
          const f = p.getAttribute("fill"); if (f && f !== "none" && f !== "transparent") p.setAttribute("fill", c);
          const sw = parseFloat(p.getAttribute("stroke-width") || "0"); if (sw > 0 && sw < 22) p.setAttribute("stroke-width", "22");
        });
      };
      anim.addEventListener("DOMLoaded", recolor);
      anim.addEventListener("enterFrame", recolor);
    }).catch(() => {});
    return () => { cancelled = true; el.innerHTML = ""; };
  }, [src]);
  return <div ref={ref} style={{ width: size, height: size, display: "inline-flex" }} />;
}
import { AnimatedLucideIcon } from "@/components/AnimatedLucideIcon";
import { LoopingIcon } from "@/components/LoopingIcon";
import UsersIcon from "@/components/ui/users-icon";
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
    lokSabhaSeats: 240,
    statesRuled: 21,
    president: "Nitin Nabin",
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
      "India's oldest political party with a secular vision, focusing on social welfare, inclusive growth, and democratic values. Leads INDIA bloc and UDF coalition in Kerala.",
    lokSabhaSeats: 99,
    statesRuled: 3,
    president: "Mallikarjun Kharge",
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
      "Uttar Pradesh-based party championing social justice, secularism, and the upliftment of backward classes. Main opposition in Uttar Pradesh.",
    lokSabhaSeats: 37,
    statesRuled: 0,
    president: "Akhilesh Yadav",
  },
  {
    id: "tmc",
    shortName: "TMC",
    fullName: "All India Trinamool Congress",
    established: 1998,
    logo: "/logo/BSP.svg",
    backgroundImage: "/images/Image (Trinamool Congress).png",
    themeColor: "#22C55E",
    themeColorRgb: "34, 197, 94",
    description:
      "West Bengal's dominant party advocating for federalism, social welfare, and regional autonomy. Lost West Bengal to BJP in 2026 elections.",
    lokSabhaSeats: 29,
    statesRuled: 0,
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
      "Tamil Nadu's leading Dravidian party championing social justice, rationalism, and linguistic pride. Lost Tamil Nadu to TVK in 2026; was ruling state since 2021.",
    lokSabhaSeats: 22,
    statesRuled: 0,
    president: "M.K. Stalin",
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
      "Andhra Pradesh's regional party championing Telugu pride, development, and good governance. Founder; also Andhra Pradesh CM. Part of NDA coalition government.",
    lokSabhaSeats: 16,
    statesRuled: 1,
    president: "N. Chandrababu Naidu",
  },
  {
    id: "jdu",
    shortName: "JD(U)",
    fullName: "Janata Dal (United)",
    established: 2003,
    logo: "/logo/BSP.svg",
    backgroundImage: "/images/Image (Samajwadi Party).png",
    themeColor: "#43A047",
    themeColorRgb: "67, 160, 71",
    description:
      "Bihar CM; longtime JD(U) president. Bihar-centric party focused on social justice and development. Part of NDA coalition with BJP.",
    lokSabhaSeats: 12,
    statesRuled: 1,
    president: "Nitish Kumar",
  },
  {
    id: "ss-ubt",
    shortName: "SS(UBT)",
    fullName: "Shiv Sena (UBT)",
    established: 1966,
    logo: "/logo/BSP.svg",
    backgroundImage: "/images/Image (Bharatiya Janata Party).png",
    themeColor: "#FF6F00",
    themeColorRgb: "255, 111, 0",
    description:
      "Leads Uddhav faction since 2022 split. Part of MVA opposition in Maharashtra.",
    lokSabhaSeats: 9,
    statesRuled: 0,
    president: "Uddhav Thackeray",
  },
  {
    id: "cpim",
    shortName: "CPI(M)",
    fullName: "Communist Party of India (Marxist)",
    established: 1964,
    logo: "/logo/BSP.svg",
    backgroundImage: "/images/Image (Indian National Congress).png",
    themeColor: "#B71C1C",
    themeColorRgb: "183, 28, 28",
    description:
      "General Secretary since 2024. Led Kerala's LDF govt until 2026; lost to Congress-UDF.",
    lokSabhaSeats: 4,
    statesRuled: 0,
    president: "M.A. Baby",
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
      "Founder & national convener. Anti-corruption party focusing on education, healthcare, and governance transparency. Rules Punjab; lost Delhi to BJP in 2025.",
    lokSabhaSeats: 3,
    statesRuled: 1,
    president: "Arvind Kejriwal",
  },
  {
    id: "jmm",
    shortName: "JMM",
    fullName: "Jharkhand Mukti Morcha",
    established: 1972,
    logo: "/logo/BSP.svg",
    backgroundImage: "/images/Image (Trinamool Congress).png",
    themeColor: "#2E7D32",
    themeColorRgb: "46, 125, 50",
    description:
      "Also Jharkhand CM. Leads INDIA bloc coalition in Jharkhand.",
    lokSabhaSeats: 3,
    statesRuled: 1,
    president: "Hemant Soren",
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
      "Founder; national president. A party dedicated to the empowerment of Dalits, Adivasis, OBCs, and religious minorities. No state government currently.",
    lokSabhaSeats: 0,
    statesRuled: 0,
    president: "Mayawati",
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

const platformAnimationMap: Record<string, import("@/lib/icon-animations").IconAnimation> = {
  parties: "breathe",
  seats: "bounce",
  states: "float",
  accuracy: "pulse",
};

function AnimatedIcon({ icon }: { icon: string }) {
  const Icon = platformIconMap[icon] ?? Landmark;
  return <AnimatedLucideIcon icon={Icon} size={24} animation={platformAnimationMap[icon] ?? "breathe"} />;
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
      viewport={{ once: true, amount: 0.3 }}
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

// ─── Slot Machine Digit Drum ───

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
        animate={active ? { y: `${-total * DIGIT_H}em` } : { y: 0 }}
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

function RollingNumber({
  value,
  isActive,
  color,
}: {
  value: number;
  isActive: boolean;
  color: string;
}) {
  const chars = String(value).split("");

  return (
    <div
      className="flex text-2xl font-extrabold leading-none sm:text-3xl"
      style={{ color }}
    >
      {chars.map((ch, i) =>
        /\d/.test(ch) ? (
          <SlotDigit
            key={`${i}-${ch}`}
            target={parseInt(ch)}
            delay={0.3 + i * 0.08}
            active={isActive}
          />
        ) : (
          <span key={`${i}-${ch}`} className="inline-block w-[0.25em] text-center">
            {ch}
          </span>
        ),
      )}
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
          background: `linear-gradient(to bottom, rgba(0, 0, 0, 0.55) 0%, rgba(0, 0, 0, 0.65) 100%)`,
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          border: `1.5px solid rgba(255, 255, 255, 0.15)`,
          boxShadow: `0 0 24px rgba(${party.themeColorRgb}, 0.15), inset 0 1px 0 rgba(255,255,255,0.08)`,
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
              <h3 className="text-base font-bold leading-tight text-white drop-shadow-md sm:text-xl md:text-2xl">{party.fullName}</h3>
            </div>
          </div>

          <p className="line-clamp-3 text-xs leading-relaxed text-white/90 drop-shadow-sm sm:line-clamp-none sm:text-sm md:text-base">{party.description}</p>

          {/* Stats — rolling numbers */}
          <div className="flex gap-2 sm:gap-3">
            <div className="rounded-lg px-3 py-2 sm:px-5 sm:py-2.5" style={{ backgroundColor: `rgba(${party.themeColorRgb}, 0.2)`, border: `1px solid rgba(${party.themeColorRgb}, 0.4)` }}>
              <RollingNumber value={party.lokSabhaSeats} isActive={isExpanded} color={party.themeColor} />
              <p className="text-[9px] font-semibold tracking-wider text-white/70 uppercase sm:text-[10px]">Lok Sabha Seats</p>
            </div>
            <div className="rounded-lg px-3 py-2 sm:px-5 sm:py-2.5" style={{ backgroundColor: `rgba(${party.themeColorRgb}, 0.2)`, border: `1px solid rgba(${party.themeColorRgb}, 0.4)` }}>
              <RollingNumber value={party.statesRuled} isActive={isExpanded} color={party.themeColor} />
              <p className="text-[9px] font-semibold tracking-wider text-white/70 uppercase sm:text-[10px]">States Ruled</p>
            </div>
          </div>

          {/* President */}
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 sm:h-10 sm:w-10">
              <BadgeLottieIcon src="/lottie/president.json" size={28} color="rgba(255,255,255,0.7)" />
            </div>
            <div>
              <p className="text-[9px] font-medium tracking-wider text-white/60 uppercase sm:text-[10px]">President</p>
              <p className="text-xs font-semibold text-white drop-shadow-sm sm:text-sm">{party.president}</p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Main Section ───

export function PoliticalPartiesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });
  const [triggered, setTriggered] = useState(false);

  useEffect(() => {
    if (isInView) setTriggered(true);
  }, [isInView]);

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
    if (triggered && !isUserHovering) {
      startAutoPlay();
    } else if (autoTimerRef.current) {
      clearInterval(autoTimerRef.current);
      autoTimerRef.current = null;
    }
    return () => {
      if (autoTimerRef.current) clearInterval(autoTimerRef.current);
    };
  }, [triggered, isUserHovering, startAutoPlay]);

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
    <section ref={sectionRef} className="relative overflow-hidden bg-white py-8 sm:py-10 lg:py-12">
      {/* Top blend from previous dark section */}
      <div className="absolute top-0 left-0 right-0 z-[2] h-24 bg-gradient-to-b from-[#0c0c1d] via-[#0c0c1d]/30 to-transparent" />
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
              <BadgeLottieIcon src="/lottie/museum.json" size={20} />
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
            className="mx-auto mt-8 rounded-2xl p-2 sm:p-3 lg:mt-16"
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
        {/* <div className="mt-10 grid grid-cols-2 gap-3 sm:mt-12 sm:gap-4 md:gap-5 lg:mt-16 lg:grid-cols-4">
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
        </div> */}
      </div>
    </section>
  );
}
