import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { BackgroundVideo } from "@/components/video/BackgroundVideo";

const sideBadges = [
  {
    id: "hfj",
    label: "Hindu for Justice",
    image: "/logo/HFJ-logo-final-new.gif",
    href: "/hindu-for-justice",
  },
  {
    id: "rss",
    label: "RSS",
    image: "/logo/rss.gif",
    href: "#",
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
          height: hovered ? 220 : 90,
          borderTopRightRadius: hovered ? 45 : 45,
          borderBottomRightRadius: hovered ? 45 : 45,
        }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        style={{ width: 90, borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
      >
        <div className="flex h-full w-full flex-col items-center">
          {/* Logo — always visible, large */}
          <div className="flex h-[90px] w-[90px] flex-shrink-0 items-center justify-center p-3">
            <img
              src={badge.image}
              alt={badge.label}
              className="h-16 w-16 rounded-full object-contain"
            />
          </div>

          {/* Expanded label on hover — vertical text */}
          <AnimatePresence>
            {hovered && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.15, duration: 0.25 }}
                className="flex flex-1 flex-col items-center"
              >
                <div className="h-[1px] w-12 bg-amber-500/50" />
                <div className="flex flex-1 items-center py-4">
                  <span
                    className="text-xs font-bold tracking-widest text-white uppercase"
                    style={{
                      writingMode: "vertical-rl",
                      textOrientation: "mixed",
                    }}
                  >
                    {badge.label}
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.a>
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

      {/* Diagonal saffron overlay — top-left to bottom-right */}
      <div
        className="absolute inset-0 z-[1]"
        style={{
          background:
            "linear-gradient(135deg, rgba(194, 120, 40, 0.55) 0%, rgba(194, 120, 40, 0.3) 35%, transparent 60%)",
        }}
      />

      {/* Subtle dark overlay for text readability */}
      <div className="absolute inset-0 z-[1] bg-black/15" />

      {/* Content */}
      <div className="relative z-10 mx-auto flex h-full max-w-[1440px] flex-col justify-end px-4 pb-20 sm:px-6 sm:pb-24 md:pb-28 lg:px-8 xl:px-12">
        {/* Main heading */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="text-3xl font-bold text-white sm:text-4xl md:text-5xl lg:text-6xl"
        >
          Welcome to Logsabha
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mt-3 text-sm font-medium text-white/90 sm:mt-4 sm:text-base md:text-lg lg:text-xl"
        >
          Political Research &amp; Analysis Wing of Bharat
        </motion.p>

        {/* Center watermark logo */}
        <motion.img
          src="/logo/Logfinalsabha.gif"
          alt=""
          aria-hidden="true"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.3, scale: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="absolute bottom-16 left-1/2 h-20 w-auto -translate-x-1/2 sm:bottom-20 sm:h-24 md:h-28 lg:h-32"
        />
      </div>

      {/* Side floating badges — D-shape, flush left edge */}
      <div className="absolute left-0 top-1/2 z-10 flex -translate-y-1/2 flex-col gap-4">
        {sideBadges.map((badge, i) => (
          <SideBadge key={badge.id} badge={badge} index={i} />
        ))}
      </div>
    </section>
  );
}
