import { useRef, useState } from "react";
import { motion } from "motion/react";
import {
  ScrollReveal,
  ScrollRevealLine,
} from "@/components/motion/ScrollReveal";

// ─── News Channel Logos (scrolling ticker) ───

const NEWS_LOGOS = [
  { name: "News18", src: "/images/news-channels/news18.svg" },
  { name: "Times Now", src: "/images/Timesnow.jpg" },
  { name: "NavBharat", src: "/images/news-channels/navbharat.svg" },
  { name: "TV9", src: "/images/news-channels/tv9.svg" },
  { name: "News18 Hindi", src: "/images/news-channels/news18-hindi.svg" },
  { name: "Republic", src: "/images/news-channels/republic.svg" },
];

// ─── Video Data ───

interface MediaVideo {
  id: string;
  title: string;
  videoSrc: string;
  poster: string;
}

const MEDIA_VIDEOS: MediaVideo[] = [
  {
    id: "media-1",
    title: "Nation's Pride - The Great Hindu Revival",
    videoSrc: "/videos/speech.mp4",
    poster: "/images/editorial/featured.jpg",
  },
  {
    id: "media-2",
    title: "NDA Sweeps - Political Analysis",
    videoSrc: "/videos/speech1.mp4",
    poster: "/images/editorial/parliament.jpg",
  },
  {
    id: "media-3",
    title: "Shri Ram Navami Celebrations",
    videoSrc: "/videos/speech2.mp4",
    poster: "/images/editorial/regional.jpg",
  },
  {
    id: "media-4",
    title: "Lok Sabha Session Coverage",
    videoSrc: "/videos/speech.mp4",
    poster: "/images/editorial/economy.jpg",
  },
];

// ─── Logo Ticker ───

function LogoTicker() {
  const doubled = [...NEWS_LOGOS, ...NEWS_LOGOS, ...NEWS_LOGOS];

  return (
    <div className="relative mt-5 overflow-hidden py-3">
      {/* Fade edges */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-white to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-white to-transparent" />

      <motion.div
        className="flex items-center gap-12"
        animate={{ x: ["0%", "-33.33%"] }}
        transition={{
          x: {
            duration: 18,
            repeat: Infinity,
            ease: "linear",
          },
        }}
      >
        {doubled.map((logo, i) => (
          <motion.div
            key={`${logo.name}-${i}`}
            className="flex h-10 flex-shrink-0 items-center sm:h-12"
            whileHover={{ scale: 1.15, y: -2 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <img
              src={logo.src}
              alt={logo.name}
              className="h-full w-auto max-w-[140px] object-contain opacity-80 transition-opacity duration-300 hover:opacity-100 sm:max-w-[160px]"
              onError={(e) => {
                const parent = e.currentTarget.parentElement;
                if (parent) {
                  parent.innerHTML = `<span class="rounded-lg bg-gray-100 px-4 py-2 text-sm font-bold text-gray-700 whitespace-nowrap">${logo.name}</span>`;
                }
              }}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

// ─── Auto-Play Video Card ───

function MediaVideoCard({
  video,
  index,
}: {
  video: MediaVideo;
  index: number;
  sectionInView?: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleMouseEnter = () => {
    const vid = videoRef.current;
    if (!vid) return;
    vid.play().catch(() => {});
    setIsPlaying(true);
  };

  const handleMouseLeave = () => {
    const vid = videoRef.current;
    if (!vid) return;
    vid.pause();
    setIsPlaying(false);
  };

  return (
    <motion.div
      className="group relative overflow-hidden rounded-2xl bg-gray-900 shadow-lg"
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: false, amount: 0.3 }}
      transition={{
        duration: 0.7,
        delay: index * 0.12,
        ease: [0.16, 1, 0.3, 1],
      }}
      whileHover={{ y: -6, scale: 1.02 }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Orbiting border glow on hover */}
      <motion.span
        className="pointer-events-none absolute inset-[-2px] z-20 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "conic-gradient(from var(--angle), transparent 0%, transparent 60%, rgba(245,158,11,0.7) 80%, rgba(245,158,11,1) 85%, rgba(245,158,11,0.7) 90%, transparent 100%)",
          mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          maskComposite: "exclude",
          WebkitMaskComposite: "xor",
          padding: "2px",
        }}
        animate={{
          "--angle": ["0deg", "360deg"],
        } as Record<string, string[]>}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
      />

      <div className="relative aspect-[9/16] max-h-[420px] overflow-hidden sm:aspect-[3/4]">
        {/* Video — paused by default, plays on hover, resumes from where it stopped */}
        {/* First frame of the video acts as the thumbnail */}
        <video
          ref={videoRef}
          muted
          loop
          playsInline
          preload="auto"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        >
          <source src={video.videoSrc} type="video/mp4" />
        </video>

        {/* Play icon — visible when paused */}
        <motion.div
          className={`pointer-events-none absolute inset-0 z-[2] flex items-center justify-center transition-opacity duration-300 ${
            isPlaying ? "opacity-0" : "opacity-100"
          }`}
        >
          <motion.div
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm"
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <svg className="ml-0.5 h-3.5 w-3.5 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          </motion.div>
        </motion.div>

        {/* Shimmer sweep overlay */}
        <motion.div
          className="pointer-events-none absolute inset-0 z-10"
          style={{
            background:
              "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.15) 50%, transparent 60%)",
            backgroundSize: "200% 100%",
          }}
          animate={{ backgroundPosition: ["-100% 0%", "200% 0%"] }}
          transition={{
            duration: 3,
            delay: 2 + index * 0.5,
            repeat: Infinity,
            repeatDelay: 4,
            ease: "easeInOut",
          }}
        />

        {/* Gradient overlays */}
        <div className="absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-black/30 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/70 to-transparent" />

        {/* Title overlay at bottom */}
        <motion.div
          className="absolute inset-x-0 bottom-0 z-10 p-3"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ delay: 0.7 + index * 0.15, duration: 0.5 }}
        >
          <p className="line-clamp-2 text-xs font-semibold leading-tight text-white/90 sm:text-sm">
            {video.title}
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}

// ─── Animated Monument Border ───

export function MonumentBorder() {
  const tileCount = 12;
  return (
    <div className="relative mt-6 overflow-hidden">
      <motion.div
        className="flex items-end"
        animate={{ x: ["0px", `-${tileCount / 2 * 283}px`] }}
        transition={{
          x: {
            duration: 30,
            repeat: Infinity,
            ease: "linear",
          },
        }}
      >
        {Array.from({ length: tileCount }, (_, i) => (
          <img
            key={i}
            src="/lottie/MonumentSVGGroup.svg"
            alt=""
            aria-hidden="true"
            className="h-[100px] flex-shrink-0"
            style={{ width: 283 }}
          />
        ))}
      </motion.div>
    </div>
  );
}

// ─── Main Section ───

export function MediaCoverageSection() {
  return (
    <section
      className="relative overflow-hidden bg-white pt-8 pb-0 sm:pt-10 lg:pt-12"
    >
      {/* ── Grid Background Image ── */}
      <div className="pointer-events-none absolute inset-0">
        <img
          src="/images/grid-bg.png"
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover opacity-20"
        />
        {/* Edge vignette to fade into white */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 40%, rgba(255,255,255,0.5) 75%, rgba(255,255,255,0.95) 100%)",
          }}
        />
      </div>

      {/* Static ambient orbs — no animation for scroll performance */}
      <div className="pointer-events-none absolute top-10 left-[10%] h-60 w-60 rounded-full bg-amber-400/[0.07] blur-[80px]" />
      <div className="pointer-events-none absolute right-[10%] bottom-20 h-48 w-48 rounded-full bg-orange-400/[0.07] blur-[80px]" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 h-52 w-52 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-300/[0.05] blur-[90px]" />

      <div className="relative mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 xl:px-12">
        {/* ── Header ── */}
        <div className="text-center">
          <ScrollReveal>
            <h2 className="text-2xl font-extrabold sm:text-3xl lg:text-4xl">
              <motion.span
                className="inline-block bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 bg-clip-text text-transparent"
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                style={{ backgroundSize: "200% 200%" }}
              >
                Media Coverage
              </motion.span>
            </h2>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <p className="mt-1.5 text-xs text-gray-500 sm:text-sm lg:text-base">
              Featured across India's leading news networks
            </p>
          </ScrollReveal>
        </div>

        <ScrollRevealLine
          delay={0.2}
          className="mx-auto mt-3 h-[3px] w-12 rounded-full bg-amber-500"
        />

        {/* ── Logo Ticker ── */}
        <ScrollReveal delay={0.15}>
          <LogoTicker />
        </ScrollReveal>

        {/* ── Video Grid ── */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:gap-5">
          {MEDIA_VIDEOS.map((video, i) => (
            <MediaVideoCard
              key={video.id}
              video={video}
              index={i}
            />
          ))}
        </div>
      </div>

    </section>
  );
}
