import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "motion/react";
import { BackgroundVideo } from "@/components/video/BackgroundVideo";
import type { HeroData, HeroStat, SideBadge as SideBadgeType } from "@/types";

// ─── Side Badge ───

function SideBadge({
  badge,
  index,
}: {
  badge: SideBadgeType;
  index: number;
  alwaysExpanded?: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const size = 64;

  return (
    <motion.a
      href={badge.href}
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        duration: 0.5,
        delay: 1.2 + index * 0.15,
        ease: [0.16, 1, 0.3, 1],
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative flex items-center"
      whileHover={{ x: -4 }}
    >
      {/* Label tooltip on hover — to the left */}
      <AnimatePresence>
        {hovered && (
          <motion.span
            className="absolute right-full mr-3 whitespace-nowrap rounded-lg border border-white/10 bg-black/80 px-3.5 py-2 shadow-xl backdrop-blur-md"
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 8 }}
            transition={{ duration: 0.2 }}
          >
            <span className="badge-shimmer text-[11px] font-bold tracking-wider uppercase">
              {badge.label}
            </span>
          </motion.span>
        )}
      </AnimatePresence>

      <motion.div
        className="relative flex items-center justify-center rounded-full"
        style={{ width: size, height: size }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Pulse ring — same as chat icon */}
        <span className="absolute inset-0 rounded-full">
          <span className="absolute inset-0 animate-ping rounded-full bg-amber-400 opacity-20" />
        </span>

        {/* Orbiting glow ring */}
        <motion.span
          className="pointer-events-none absolute -inset-[2px] rounded-full"
          style={{
            background:
              "conic-gradient(from var(--angle), transparent 0%, transparent 60%, rgba(245,158,11,0.8) 80%, rgba(251,191,36,1) 85%, rgba(245,158,11,0.8) 90%, transparent 100%)",
            mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            maskComposite: "exclude",
            WebkitMaskComposite: "xor",
            padding: "2.5px",
          }}
          animate={{ "--angle": ["0deg", "360deg"] } as Record<string, string[]>}
          transition={{ duration: 3, repeat: Infinity, ease: "linear", delay: index * 0.8 }}
        />

        {/* Badge circle */}
        <div
          className="relative flex items-center justify-center rounded-full bg-gradient-to-br from-[#1a1a2e] to-[#0d0d1a] shadow-lg shadow-amber-500/20"
          style={{ width: size, height: size }}
        >
          <motion.img
            src={badge.image}
            alt={badge.label}
            className="relative z-10 rounded-full object-contain"
            style={{ width: size - 12, height: size - 12 }}
            animate={{ rotate: [0, 3, -3, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: index * 0.5 }}
          />
        </div>
      </motion.div>
    </motion.a>
  );
}

export function StickyBadges({ badges }: { badges: SideBadgeType[] }) {
  return (
    <div className="fixed right-5 bottom-[104px] z-50 flex flex-col items-center gap-3 sm:right-6">
      {badges.map((badge, i) => (
        <SideBadge
          key={badge.id}
          badge={badge}
          index={i}
        />
      ))}
    </div>
  );
}

// ─── Scroll-linked diagonal logo — merges into header logo ───

function ScrollLogo({ src, sectionRef }: { src: string; sectionRef: React.RefObject<HTMLElement | null> }) {
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Position: half-visible at bottom-center → top-left
  const x = useTransform(scrollYProgress, [0, 1], ["50vw", "5vw"]);
  const y = useTransform(scrollYProgress, [0, 1], ["100vh", "2vh"]);
  const scale = useTransform(scrollYProgress, [0, 0.8, 1], [1, 0.5, 0.25]);
  const opacity = useTransform(scrollYProgress, [0, 0.1, 0.85, 1], [1, 1, 1, 0]);

  // 3D rotations linked to scroll
  const rotateY = useTransform(scrollYProgress, [0, 0.5, 1], [0, 180, 360]);
  const rotateX = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 15, -10, 0]);

  return (
    <motion.div
      className="pointer-events-none fixed left-0 top-0 z-[45]"
      style={{
        x,
        y,
        scale,
        opacity,
        translateX: "-50%",
        translateY: "-50%",
        perspective: 800,
      }}
    >
      <motion.div
        style={{
          rotateY,
          rotateX,
          transformStyle: "preserve-3d",
        }}
        className="relative"
      >
        {/* Glow behind logo */}
        <motion.div
          className="absolute inset-0 rounded-full blur-xl"
          style={{
            background: "radial-gradient(circle, rgba(245,158,11,0.4) 0%, transparent 70%)",
            scale: useTransform(scrollYProgress, [0, 0.5, 1], [1.2, 1.5, 0.8]),
          }}
        />

        {/* Logo image */}
        <img
          src={src}
          alt=""
          aria-hidden="true"
          className="relative h-36 w-auto drop-shadow-[0_0_20px_rgba(245,158,11,0.5)] sm:h-40 md:h-48 lg:h-56"
        />
      </motion.div>
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
  const sectionRef = useRef<HTMLElement>(null);
  const [videoPlaying, setVideoPlaying] = useState(false);

  return (
    <section ref={sectionRef} className="relative h-screen w-full overflow-hidden">
      {/* Logo that moves diagonally into header on scroll */}
      <ScrollLogo src={data.watermarkLogo} sectionRef={sectionRef} />
      <BackgroundVideo src={data.videoSrc} poster={data.posterSrc} onPlaying={() => setVideoPlaying(true)} />

      {/* Top vignette — blends with header */}
      <div className="absolute top-0 left-0 right-0 z-[2] h-40 bg-gradient-to-b from-black/40 via-black/15 to-transparent" />

      {/* Bottom shadow — deep fade into next section */}
      <div className="absolute bottom-0 left-0 right-0 z-[2] h-48 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

      {/* Left/right edge vignette */}
      <div className="absolute inset-0 z-[2] bg-[radial-gradient(ellipse_at_center,transparent_50%,rgba(0,0,0,0.3)_100%)]" />

      {/* Outer chevron/arrow — placeholder until video plays */}
      <motion.div
        className="absolute inset-0 z-[1]"
        style={{
          clipPath: "polygon(0 0, 35% 0, 62% 50%, 35% 100%, 0 100%)",
          backgroundColor: "rgba(194, 120, 40, 0.4)",
        }}
        animate={{ opacity: videoPlaying ? 0 : 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />

      {/* Inner chevron — placeholder until video plays */}
      <motion.div
        className="absolute inset-0 z-[1]"
        style={{
          clipPath: "polygon(0 0, 42% 0, 68% 50%, 42% 100%, 0 100%)",
          backgroundColor: "rgba(220, 160, 80, 0.15)",
        }}
        animate={{ opacity: videoPlaying ? 0 : 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />

      <div className="absolute inset-0 z-[1] bg-black/10" />

      {/* Content */}
      <div
        className="relative z-10 mx-auto flex h-full max-w-[1440px] flex-col items-start justify-end pl-16 pr-3 pb-12 sm:pl-20 sm:pr-6 sm:pb-16 md:pb-20 lg:pr-8 lg:pb-24 xl:pr-12"
        style={{ perspective: "1000px" }}
      >
        {/* 3D heading */}
        <div className="max-w-2xl">
          <motion.h1
            className="text-2xl font-extrabold leading-tight sm:text-3xl lg:text-4xl"
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
            className="text-sm font-medium tracking-wide text-white/90 sm:text-base lg:text-lg"
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
