import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { BackgroundVideo } from "@/components/video/BackgroundVideo";

const heroStats = [
  { label: "Civil Secretariat", value: "₹540", unit: "Crore" },
  { label: "17 Projects", value: "₹1,200", unit: "Crore" },
  { label: "EMR School", value: "₹16", unit: "Crore" },
  { label: "Infrastructure", value: "₹2,400", unit: "Crore" },
];

const sideBadges = [
  {
    id: "hfj",
    label: "Hindu for Justice",
    image: "/logo/HFJ-logo-final-new.gif",
    href: "/hindu-for-justice",
    expandedHeight: 250,
  },
  {
    id: "rss",
    label: "RSS",
    image: "/logo/rss.gif",
    href: "#",
    expandedHeight: 160,
  },
];

function SideBadge({
  badge,
  index,
}: {
  badge: (typeof sideBadges)[number];
  index: number;
}) {
  const [hovered, setHovered] = useState(false);

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
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative block"
    >
      <motion.div
        className="overflow-hidden border-y border-r border-amber-500/30 bg-[#1a1a2e]/90 shadow-xl backdrop-blur-sm"
        animate={{
          height: hovered ? badge.expandedHeight : 70,
          borderTopRightRadius: hovered ? 15 : 35,
          borderBottomRightRadius: hovered ? 15 : 35,
        }}
        transition={{ duration: 0.45, ease: [0.25, 1, 0.5, 1] }}
        style={{
          width: 70,
          borderTopLeftRadius: 0,
          borderBottomLeftRadius: 0,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Text label — always in DOM, animated via opacity/height */}
        <motion.div
          className="flex flex-col items-center overflow-hidden"
          animate={{
            flexGrow: hovered ? 1 : 0,
            opacity: hovered ? 1 : 0,
            paddingTop: hovered ? 16 : 0,
          }}
          transition={{ duration: 0.45, ease: [0.25, 1, 0.5, 1] }}
        >
          <div className="flex flex-1 items-center">
            <span
              className="whitespace-nowrap text-xs font-bold tracking-wider text-white uppercase"
              style={{
                writingMode: "vertical-rl",
                transform: "rotate(180deg)",
              }}
            >
              {badge.label}
            </span>
          </div>
          <div className="mb-2 h-[1px] w-10 bg-amber-500/50" />
        </motion.div>

        {/* Logo — always visible at bottom */}
        <div className="flex h-[70px] w-[70px] flex-shrink-0 items-center justify-center p-2">
          <img
            src={badge.image}
            alt={badge.label}
            className="h-[50px] w-[50px] rounded-full object-contain"
          />
        </div>
      </motion.div>
    </motion.a>
  );
}

export function StickyBadges() {
  return (
    <div className="fixed left-0 top-1/2 z-40 flex -translate-y-1/2 flex-col gap-4">
      {sideBadges.map((badge, i) => (
        <SideBadge key={badge.id} badge={badge} index={i} />
      ))}
    </div>
  );
}

function RotatingStats() {
  const [currentStat, setCurrentStat] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStat((prev) => (prev + 1) % heroStats.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute right-6 top-[35%] z-10 -translate-y-1/2 text-right sm:right-10 md:right-16 lg:right-20">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStat}
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -30, scale: 0.95 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Label */}
          <motion.p
            className="text-sm font-bold tracking-widest text-white uppercase sm:text-base md:text-lg"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
          >
            {heroStats[currentStat].label}
          </motion.p>

          {/* Value */}
          <motion.div
            className="mt-1 flex items-baseline justify-end gap-2 sm:mt-2"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25, duration: 0.5 }}
          >
            <span className="text-3xl font-extrabold text-amber-500 sm:text-4xl md:text-5xl lg:text-6xl">
              {heroStats[currentStat].value}
            </span>
            <span className="text-lg font-bold text-amber-400 sm:text-xl md:text-2xl lg:text-3xl">
              {heroStats[currentStat].unit}
            </span>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Dot indicators */}
      <div className="mt-4 flex justify-end gap-1.5 sm:mt-6">
        {heroStats.map((_, i) => (
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

export function HeroSection() {
  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Background Video */}
      <BackgroundVideo
        src="/videos/hero-bg.mp4"
        poster="/videos/hero-poster.jpg"
      />

      {/* Outer chevron/arrow — saffron overlay */}
      <div
        className="absolute inset-0 z-[1]"
        style={{
          clipPath: "polygon(0 0, 35% 0, 62% 50%, 35% 100%, 0 100%)",
          backgroundColor: "rgba(194, 120, 40, 0.4)",
        }}
      />

      {/* Inner chevron — lighter, creates depth */}
      <div
        className="absolute inset-0 z-[1]"
        style={{
          clipPath: "polygon(0 0, 42% 0, 68% 50%, 42% 100%, 0 100%)",
          backgroundColor: "rgba(220, 160, 80, 0.15)",
        }}
      />

      {/* Subtle dark overlay for text readability */}
      <div className="absolute inset-0 z-[1] bg-black/10" />

      {/* Rotating stats — right side */}
      <RotatingStats />

      {/* Content — bottom left */}
      <div
        className="relative z-10 mx-auto flex h-full max-w-[1440px] flex-col justify-end px-4 pb-16 sm:px-6 sm:pb-20 md:pb-24 lg:px-8 xl:px-12"
        style={{ perspective: "1000px" }}
      >
        {/* Animated heading — 3D flip per word */}
        <div>
          <motion.h1
            className="text-3xl font-extrabold leading-tight sm:text-4xl md:text-5xl lg:text-6xl"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.15, delayChildren: 0.3 } },
            }}
          >
            {["Welcome", "to"].map((word, i) => (
              <motion.span
                key={i}
                className="mr-3 inline-block text-white lg:mr-4"
                style={{ transformStyle: "preserve-3d" }}
                variants={{
                  hidden: {
                    y: 80,
                    rotateX: 90,
                    opacity: 0,
                  },
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
              className="inline-block bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(245,158,11,0.3)]"
              style={{ transformStyle: "preserve-3d" }}
              variants={{
                hidden: {
                  y: 80,
                  rotateX: 90,
                  scale: 0.8,
                  opacity: 0,
                },
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
              Logsabha
            </motion.span>
          </motion.h1>
        </div>

        {/* Subtitle with 3D slide + line animation */}
        <motion.div
          className="mt-3 flex items-center gap-3 sm:mt-4"
          style={{ transformStyle: "preserve-3d" }}
          initial={{ opacity: 0, rotateY: -30, x: -40 }}
          animate={{ opacity: 1, rotateY: 0, x: 0 }}
          transition={{ delay: 0.9, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div
            className="h-[2px] bg-amber-500"
            initial={{ width: 0 }}
            animate={{ width: 40 }}
            transition={{ delay: 1.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          />
          <motion.p
            className="text-sm font-medium tracking-wide text-white/90 sm:text-base md:text-lg"
            initial={{ opacity: 0, z: -50 }}
            animate={{ opacity: 1, z: 0 }}
            transition={{ delay: 1.2, duration: 0.6 }}
          >
            Political Research &amp; Analysis Wing of Bharat
          </motion.p>
        </motion.div>

        {/* Center watermark logo */}
        <motion.img
          src="/logo/Logfinalsabha.gif"
          alt=""
          aria-hidden="true"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.25, scale: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="absolute bottom-14 left-1/2 h-16 w-auto -translate-x-1/2 sm:bottom-16 sm:h-20 md:h-24 lg:h-28"
        />
      </div>
    </section>
  );
}
