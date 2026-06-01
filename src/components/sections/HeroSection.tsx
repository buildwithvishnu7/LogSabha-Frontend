import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { BackgroundVideo } from "@/components/video/BackgroundVideo";
import type { HeroData, HeroStat, SideBadge as SideBadgeType } from "@/types";

// ─── Side Badge ───

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return isMobile;
}

function SideBadge({
  badge,
  index,
  alwaysExpanded,
}: {
  badge: SideBadgeType;
  index: number;
  alwaysExpanded: boolean;
}) {
  const [hoverExpanded, setHoverExpanded] = useState(false);
  const expanded = alwaysExpanded || hoverExpanded;

  return (
    <motion.a
      href={badge.href}
      initial={{ opacity: 0, x: -100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        duration: 0.6,
        delay: 1 + index * 0.2,
        ease: [0.16, 1, 0.3, 1],
      }}
      onMouseEnter={() => setHoverExpanded(true)}
      onMouseLeave={() => setHoverExpanded(false)}
      className="relative block"
    >
      <motion.div
        className="overflow-hidden border-y border-r border-amber-500/30 bg-[#1a1a2e]/90 shadow-xl backdrop-blur-sm"
        animate={{
          height: expanded ? badge.expandedHeight : 56,
          borderTopRightRadius: expanded ? 12 : 28,
          borderBottomRightRadius: expanded ? 12 : 28,
        }}
        transition={{ duration: 0.45, ease: [0.25, 1, 0.5, 1] }}
        style={{
          width: alwaysExpanded ? 56 : 70,
          borderTopLeftRadius: 0,
          borderBottomLeftRadius: 0,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <motion.div
          className="flex flex-col items-center overflow-hidden"
          animate={{
            flexGrow: expanded ? 1 : 0,
            opacity: expanded ? 1 : 0,
            paddingTop: expanded ? 12 : 0,
          }}
          transition={{ duration: 0.45, ease: [0.25, 1, 0.5, 1] }}
        >
          <div className="flex flex-1 items-center">
            <span
              className="whitespace-nowrap text-[9px] font-bold tracking-wider text-white uppercase sm:text-[10px] md:text-xs"
              style={{
                writingMode: "vertical-rl",
                transform: "rotate(180deg)",
              }}
            >
              {badge.label}
            </span>
          </div>
          <div className="mb-1.5 h-[1px] w-7 bg-amber-500/50 sm:w-8 md:w-10" />
        </motion.div>

        <div
          className="flex flex-shrink-0 items-center justify-center p-1 sm:p-1.5 md:p-2"
          style={{ height: alwaysExpanded ? 56 : 56, width: "100%" }}
        >
          <img
            src={badge.image}
            alt={badge.label}
            className="h-[34px] w-[34px] rounded-full object-contain sm:h-[40px] sm:w-[40px] md:h-[50px] md:w-[50px]"
          />
        </div>
      </motion.div>
    </motion.a>
  );
}

export function StickyBadges({ badges }: { badges: SideBadgeType[] }) {
  const isMobile = useIsMobile();

  return (
    <div className="fixed left-0 top-1/2 z-40 flex -translate-y-1/2 flex-col gap-3 md:gap-4">
      {badges.map((badge, i) => (
        <SideBadge
          key={badge.id}
          badge={badge}
          index={i}
          alwaysExpanded={isMobile}
        />
      ))}
    </div>
  );
}

// ─── Sticky Watermark Logo ───

export function StickyWatermark({ src }: { src: string }) {
  return (
    <motion.div
      className="pointer-events-none fixed bottom-4 left-1/2 z-30 -translate-x-1/2 sm:bottom-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 0.3, y: 0 }}
      transition={{ duration: 1, delay: 1.5 }}
    >
      <img
        src={src}
        alt=""
        aria-hidden="true"
        className="h-14 w-auto sm:h-16 md:h-20 lg:h-24"
      />
    </motion.div>
  );
}

// ─── Rotating Stats ───

function RotatingStats({ stats }: { stats: HeroStat[] }) {
  const [currentStat, setCurrentStat] = useState(0);

  useEffect(() => {
    if (stats.length === 0) return;
    const interval = setInterval(() => {
      setCurrentStat((prev) => (prev + 1) % stats.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [stats.length]);

  if (stats.length === 0) return null;

  return (
    <div className="text-left">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStat}
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -30, scale: 0.95 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.p
            className="text-[10px] font-bold tracking-widest text-white uppercase sm:text-sm md:text-base lg:text-lg"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
          >
            {stats[currentStat].label}
          </motion.p>

          <motion.div
            className="mt-1 flex items-baseline gap-2 sm:mt-2"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25, duration: 0.5 }}
          >
            <span className="text-2xl font-extrabold text-amber-500 sm:text-3xl md:text-4xl lg:text-6xl">
              {stats[currentStat].value}
            </span>
            <span className="text-base font-bold text-amber-400 sm:text-lg md:text-xl lg:text-3xl">
              {stats[currentStat].unit}
            </span>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      <div className="mt-4 flex gap-1.5 sm:mt-6">
        {stats.map((_, i) => (
          <motion.div
            key={i}
            className="h-1.5 rounded-full"
            animate={{
              width: i === currentStat ? 20 : 6,
              backgroundColor:
                i === currentStat
                  ? "rgb(245, 158, 11)"
                  : "rgba(255, 255, 255, 0.4)",
            }}
            transition={{ duration: 0.3 }}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Hero Section ───

export function HeroSection({ data }: { data: HeroData }) {
  const titleWords = data.title.split(" ");

  return (
    <section className="relative h-screen w-full overflow-hidden">
      <BackgroundVideo src={data.videoSrc} poster={data.posterSrc} />

      {/* Top vignette — blends with header */}
      <div className="absolute top-0 left-0 right-0 z-[2] h-40 bg-gradient-to-b from-black/40 via-black/15 to-transparent" />

      {/* Bottom shadow — deep fade into next section */}
      <div className="absolute bottom-0 left-0 right-0 z-[2] h-48 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

      {/* Left/right edge vignette */}
      <div className="absolute inset-0 z-[2] bg-[radial-gradient(ellipse_at_center,transparent_50%,rgba(0,0,0,0.3)_100%)]" />

      {/* Outer chevron/arrow */}
      <div
        className="absolute inset-0 z-[1]"
        style={{
          clipPath: "polygon(0 0, 35% 0, 62% 50%, 35% 100%, 0 100%)",
          backgroundColor: "rgba(194, 120, 40, 0.4)",
        }}
      />

      {/* Inner chevron */}
      <div
        className="absolute inset-0 z-[1]"
        style={{
          clipPath: "polygon(0 0, 42% 0, 68% 50%, 42% 100%, 0 100%)",
          backgroundColor: "rgba(220, 160, 80, 0.15)",
        }}
      />

      <div className="absolute inset-0 z-[1] bg-black/10" />

      {/* Content */}
      <div
        className="relative z-10 mx-auto flex h-full max-w-[1440px] flex-col items-start justify-end px-3 pb-12 sm:px-6 sm:pb-16 md:pb-20 lg:px-8 lg:pb-24 xl:px-12"
        style={{ perspective: "1000px" }}
      >
        {/* 3D heading */}
        <div className="max-w-2xl">
          <motion.h1
            className="text-2xl font-extrabold leading-tight sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl"
            initial="hidden"
            whileInView="visible"
            viewport={{ margin: "-80px", amount: 0.3 }}
            variants={{
              hidden: {},
              visible: {
                transition: { staggerChildren: 0.15, delayChildren: 0.3 },
              },
            }}
          >
            {titleWords.map((word, i) => (
              <motion.span
                key={i}
                className="hero-text-shimmer mr-3 inline-block lg:mr-4"
                style={{ transformStyle: "preserve-3d" }}
                variants={{
                  hidden: { y: 80, rotateX: 90, opacity: 0 },
                  visible: {
                    y: 0,
                    rotateX: 0,
                    opacity: 1,
                    transition: {
                      duration: 0.8,
                      ease: [0.16, 1, 0.3, 1],
                    },
                  },
                }}
              >
                {word}
              </motion.span>
            ))}
            <motion.span
              className="hero-text-highlight inline-block"
              style={{ transformStyle: "preserve-3d" }}
              variants={{
                hidden: { y: 80, rotateX: 90, scale: 0.8, opacity: 0 },
                visible: {
                  y: 0,
                  rotateX: 0,
                  scale: 1,
                  opacity: 1,
                  transition: {
                    duration: 1,
                    ease: [0.16, 1, 0.3, 1],
                  },
                },
              }}
            >
              {data.titleHighlight}
            </motion.span>
          </motion.h1>
        </div>

        {/* Subtitle */}
        <motion.div
          className="mt-3 flex items-center gap-3 sm:mt-4"
          style={{ transformStyle: "preserve-3d" }}
          initial="hidden"
          whileInView="visible"
          viewport={{ margin: "-80px", amount: 0.3 }}
          variants={{
            hidden: { opacity: 0, rotateY: -30, x: -40 },
            visible: {
              opacity: 1,
              rotateY: 0,
              x: 0,
              transition: {
                delay: 0.9,
                duration: 0.8,
                ease: [0.16, 1, 0.3, 1],
              },
            },
          }}
        >
          <motion.div
            className="h-[2px] bg-amber-500"
            variants={{
              hidden: { width: 0 },
              visible: {
                width: 40,
                transition: {
                  delay: 1.1,
                  duration: 0.5,
                  ease: [0.16, 1, 0.3, 1],
                },
              },
            }}
          />
          <motion.p
            className="text-xs font-medium tracking-wide text-white/90 sm:text-sm md:text-base lg:text-lg"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { delay: 1.2, duration: 0.6 },
              },
            }}
          >
            {data.subtitle}
          </motion.p>
        </motion.div>

        {/* Rotating stats — left aligned below subtitle */}
        <div className="mt-6 max-w-2xl sm:mt-8">
          <RotatingStats stats={data.stats} />
        </div>
      </div>
    </section>
  );
}
