import { useRef, useEffect, useState } from "react";
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
    videoSrc: "/videos/Stock-bg.mp4",
    poster: "/images/editorial/featured.jpg",
  },
  {
    id: "media-2",
    title: "NDA Sweeps - Political Analysis",
    videoSrc: "/videos/Stock-bg.mp4",
    poster: "/images/editorial/parliament.jpg",
  },
  {
    id: "media-3",
    title: "Shri Ram Navami Celebrations",
    videoSrc: "/videos/Stock-bg.mp4",
    poster: "/images/editorial/regional.jpg",
  },
  {
    id: "media-4",
    title: "Lok Sabha Session Coverage",
    videoSrc: "/videos/Stock-bg.mp4",
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
  sectionInView,
}: {
  video: MediaVideo;
  index: number;
  sectionInView: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!sectionInView || !videoRef.current) return;

    const timer = setTimeout(
      () => {
        videoRef.current?.play().catch(() => {});
        setIsPlaying(true);
      },
      300 + index * 200,
    );

    return () => clearTimeout(timer);
  }, [sectionInView, index]);

  return (
    <motion.div
      className="group relative overflow-hidden rounded-2xl bg-gray-900 shadow-lg"
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{
        duration: 0.7,
        delay: index * 0.12,
        ease: [0.16, 1, 0.3, 1],
      }}
      whileHover={{ y: -6, scale: 1.02 }}
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
        {/* Poster */}
        <img
          src={video.poster}
          alt={video.title}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
            isPlaying ? "opacity-0" : "opacity-100"
          }`}
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />

        {/* Video */}
        <video
          ref={videoRef}
          muted
          loop
          playsInline
          preload="metadata"
          poster={video.poster}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        >
          <source src={video.videoSrc} type="video/mp4" />
        </video>

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

        {/* Live badge with pulse */}
        <motion.div
          className="absolute top-3 left-3 z-10 flex items-center gap-1.5 rounded-md bg-red-600/90 px-2.5 py-1 backdrop-blur-sm"
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 + index * 0.15, duration: 0.4 }}
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white" />
          </span>
          <span className="text-[10px] font-bold tracking-wide text-white uppercase">
            Live
          </span>
        </motion.div>

        {/* Title overlay at bottom */}
        <motion.div
          className="absolute inset-x-0 bottom-0 z-10 p-3"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
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

function MonumentBorder() {
  return (
    <div className="relative mt-6 overflow-hidden">
      {/* Warm amber glow behind monuments */}
      <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-amber-500/10 to-transparent" />

      <motion.div
        className="flex"
        style={{ width: "200%" }}
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          x: {
            duration: 40,
            repeat: Infinity,
            ease: "linear",
          },
        }}
      >
        <img
          src="/images/monuments.png"
          alt=""
          className="h-14 w-1/2 object-cover sm:h-18 lg:h-20"
          aria-hidden="true"
        />
        <img
          src="/images/monuments.png"
          alt=""
          className="h-14 w-1/2 object-cover sm:h-18 lg:h-20"
          aria-hidden="true"
        />
      </motion.div>
    </div>
  );
}

// ─── Main Section ───

export function MediaCoverageSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
        }
      },
      { threshold: 0.2 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-white py-8 sm:py-10 lg:py-12"
    >
      {/* Subtle background dot pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div
          className="h-full w-full"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(245,158,11,0.5) 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      {/* Floating ambient orbs */}
      <motion.div
        className="pointer-events-none absolute top-10 left-[10%] h-60 w-60 rounded-full bg-amber-400/[0.06] blur-[80px]"
        animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="pointer-events-none absolute right-[10%] bottom-20 h-48 w-48 rounded-full bg-orange-400/[0.06] blur-[80px]"
        animate={{ x: [0, -25, 0], y: [0, 15, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />

      <div className="relative mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 xl:px-12">
        {/* ── Header ── */}
        <div className="text-center">
          <ScrollReveal>
            <h2 className="text-3xl font-extrabold sm:text-4xl lg:text-5xl">
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
            <p className="mt-1.5 text-sm text-gray-500 sm:text-base">
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
              sectionInView={inView}
            />
          ))}
        </div>
      </div>

      {/* ── Animated Monument Border ── */}
      <MonumentBorder />
    </section>
  );
}
