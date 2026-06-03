import { useRef, useEffect, useState, useCallback } from "react";
import { motion } from "motion/react";
import { Video } from "lucide-react";
import {
  ScrollReveal,
  ScrollRevealLine,
} from "@/components/motion/ScrollReveal";
import { LoopingIcon } from "@/components/LoopingIcon";

// ─── Data ───

interface SpeechVideo {
  id: string;
  title: string;
  speaker: string;
  thumbnail: string;
  videoSrc: string;
}

const MAIN_VIDEO = {
  tag: "Parliament",
  title: "Live: Budget Session Debate 2026",
  videoSrc: "/videos/Stock-bg.mp4",
  poster: "/images/editorial/parliament.jpg",
};

const RECENT_SPEECHES: SpeechVideo[] = [
  {
    id: "speech-1",
    title: "Budget Session 2026 - Economic Policy Address",
    speaker: "Finance Minister",
    thumbnail: "/images/editorial/economy.jpg",
    videoSrc: "/videos/Stock-bg.mp4",
  },
  {
    id: "speech-2",
    title: "Parliamentary Debate on Agricultural Reforms",
    speaker: "Agriculture Minister",
    thumbnail: "/images/editorial/regional.jpg",
    videoSrc: "/videos/Stock-bg.mp4",
  },
  {
    id: "speech-3",
    title: "National Security Council Address",
    speaker: "Defence Minister",
    thumbnail: "/images/editorial/featured.jpg",
    videoSrc: "/videos/Stock-bg.mp4",
  },
  {
    id: "speech-4",
    title: "Infrastructure Development Summit Keynote",
    speaker: "Transport Minister",
    thumbnail: "/images/editorial/digital.jpg",
    videoSrc: "/videos/Stock-bg.mp4",
  },
];

// ─── Live Pulse Dot ───

function LiveDot() {
  return (
    <span className="relative flex h-2.5 w-2.5">
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
      <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
    </span>
  );
}

// ─── Main Video Player ───

function MainVideoPlayer() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    const container = containerRef.current;
    if (!video || !container) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.3 },
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  return (
    <motion.div
      ref={containerRef}
      className="group relative aspect-[16/7] max-h-[480px] w-full overflow-hidden rounded-2xl bg-gray-900 shadow-xl shadow-black/10"
      initial={{ opacity: 0, y: 30, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ margin: "-80px", amount: 0.2 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster={MAIN_VIDEO.poster}
        className="absolute inset-0 h-full w-full object-cover"
      >
        <source src={MAIN_VIDEO.videoSrc} type="video/mp4" />
      </video>

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />

      {/* Tag */}
      <div className="absolute top-4 left-4 z-10">
        <span className="rounded-md bg-amber-500/90 px-3 py-1 text-[11px] font-bold tracking-wide text-white uppercase backdrop-blur-sm">
          {MAIN_VIDEO.tag}
        </span>
      </div>

      {/* Title overlay */}
      <div className="absolute inset-x-0 bottom-0 z-10 p-5 sm:p-6">
        <h3 className="text-lg font-bold text-white sm:text-xl lg:text-2xl">
          {MAIN_VIDEO.title}
        </h3>
      </div>
    </motion.div>
  );
}

// ─── Hover-to-Play Speech Card ───

function SpeechCard({
  speech,
  index,
}: {
  speech: SpeechVideo;
  index: number;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
    const video = videoRef.current;
    if (video) {
      video.currentTime = 0;
      video.play().catch(() => {});
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    const video = videoRef.current;
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
  }, []);

  return (
    <motion.div
      className="group cursor-pointer"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ margin: "-60px", amount: 0.2 }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.16, 1, 0.3, 1],
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Thumbnail / Video */}
      <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-gray-100">
        <img
          src={speech.thumbnail}
          alt={speech.title}
          className={`absolute inset-0 h-full w-full object-cover transition-all duration-500 ${
            isHovered ? "scale-110 opacity-0" : "scale-100 opacity-100"
          }`}
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />

        <video
          ref={videoRef}
          muted
          loop
          playsInline
          preload="metadata"
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        >
          <source src={speech.videoSrc} type="video/mp4" />
        </video>

        {/* Play indicator on hover */}
        <div
          className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
            isHovered ? "opacity-0" : "opacity-100"
          }`}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black/40 backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
            <svg
              className="ml-0.5 h-4 w-4 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="mt-3 px-0.5">
        <h4 className="line-clamp-2 text-sm font-bold leading-snug text-gray-900 transition-colors duration-200 group-hover:text-amber-600">
          {speech.title}
        </h4>
        <p className="mt-1 text-xs text-gray-500">{speech.speaker}</p>
      </div>
    </motion.div>
  );
}

// ─── Main Section ───

export function LiveCoverageSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-amber-50/20 to-white py-10 sm:py-12 lg:py-16">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div
          className="h-full w-full"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(245,158,11,0.5) 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 xl:px-12">
        {/* ── Header ── */}
        <div className="flex items-start justify-between">
          <div>
            <ScrollReveal>
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl lg:text-5xl">
                Live{" "}
                <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 bg-clip-text text-transparent">
                  Political Coverage
                </span>
              </h2>
            </ScrollReveal>

            <ScrollReveal delay={0.15}>
              <p className="mt-1.5 text-sm leading-relaxed text-gray-500 sm:text-base">
                Watch live sessions and recent parliamentary speeches
              </p>
            </ScrollReveal>
          </div>

          {/* LIVE NOW badge */}
          <ScrollReveal delay={0.2}>
            <motion.div
              className="flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-4 py-2 shadow-sm"
              animate={{ boxShadow: ["0 0 0 0 rgba(239,68,68,0)", "0 0 0 8px rgba(239,68,68,0)"] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <LiveDot />
              <span className="text-xs font-bold tracking-wider text-red-600 uppercase">
                Live Now
              </span>
            </motion.div>
          </ScrollReveal>
        </div>

        <ScrollRevealLine
          delay={0.3}
          className="mt-3 h-[3px] w-12 rounded-full bg-amber-500"
        />

        {/* ── Main Video ── */}
        <div className="mt-6 lg:mt-8">
          <MainVideoPlayer />
        </div>

        {/* ── Recent Speeches ── */}
        <div className="mt-8 lg:mt-10">
          <ScrollReveal delay={0.1}>
            <div className="flex items-center gap-2.5">
              <LoopingIcon icon={Video} size={18} interval={4000} />
              <h3 className="text-lg font-extrabold text-gray-900 sm:text-xl">
                Recent Speeches
              </h3>
            </div>
          </ScrollReveal>

          <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {RECENT_SPEECHES.map((speech, i) => (
              <SpeechCard key={speech.id} speech={speech} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
