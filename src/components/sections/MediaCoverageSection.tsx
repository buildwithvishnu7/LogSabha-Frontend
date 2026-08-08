import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence, useInView } from "motion/react";
import {
  ScrollReveal,
  ScrollRevealLine,
} from "@/components/motion/ScrollReveal";
import {
  SectionInViewProvider,
  useInViewSection,
  useSectionInView,
} from "@/components/motion/InViewSection";
import { useMediaCoverage } from "@/hooks/useMediaCoverage";

// ─── News Channel Logos (scrolling ticker) ───

const NEWS_LOGOS = [
  { name: "News18", src: "/images/news-channels/news18.svg" },
  { name: "Times Now", src: "/images/Timesnow.jpg" },
  { name: "NavBharat", src: "/images/news-channels/navbharat.svg" },
  { name: "TV9", src: "/images/news-channels/tv9.svg" },
  { name: "News18 Hindi", src: "/images/news-channels/news18-hindi.svg" },
  { name: "Republic", src: "/images/news-channels/republic.svg" },
];

// ─── Media Item Data ───

interface MediaItem {
  id: string;
  title: string;
  type: "video" | "image";
  videoSrc?: string;
  imageSrc?: string;
  poster?: string;
}

const MEDIA_ITEMS: MediaItem[] = [
  {
    id: "media-1",
    title: "Nation's Pride - The Great Hindu Revival",
    type: "image",
    imageSrc: "/images/RAM-INDIA-TODAY.jpg",
  },
  {
    id: "media-2",
    title: "NDA Sweeps - Political Analysis",
    type: "video",
    videoSrc: "/videos/speech1.mp4",
    poster: "/images/editorial/parliament.jpg",
  },
  {
    id: "media-3",
    title: "Jai Shri Ram - Cultural Renaissance",
    type: "video",
    videoSrc: "/videos/ramji.mp4",
  },
  {
    id: "media-4",
    title: "The Saffron Grip - Rising Bharat",
    type: "video",
    videoSrc: "/videos/saffron-grip.mp4",
  },
];

// Used until the API responds, or if it's unreachable.
const FALLBACK_MEDIA = {
  title: "Media Coverage",
  subtitle: "Featured across India's leading news networks",
  newsLogos: NEWS_LOGOS,
  mediaItems: MEDIA_ITEMS,
};

// ─── Logo Ticker ───

function LogoTicker({ logos }: { logos: { name: string; src: string }[] }) {
  const doubled = [...logos, ...logos, ...logos];
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "200px 0px 200px 0px" });

  // Scroll noticeably faster on mobile (the small viewport makes 18s feel slow).
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return (
    <div ref={ref} className="relative mt-5 overflow-hidden py-3">
      {/* Fade edges */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-white to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-white to-transparent" />

      <motion.div
        className="flex items-center gap-12"
        animate={inView ? { x: ["0%", "-33.33%"] } : undefined}
        transition={{
          x: {
            duration: isMobile ? 10 : 18,
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

// ─── Image Lightbox ───

function ImageLightbox({ src, alt, onClose }: { src: string; alt: string; onClose: () => void }) {
  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClose}
    >
      <motion.img
        src={src}
        alt={alt}
        className="max-h-[85vh] max-w-[90vw] rounded-2xl object-contain shadow-2xl"
        initial={{ scale: 0.7, opacity: 0, y: 40 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.7, opacity: 0, y: 40 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
      />
      <motion.button
        className="absolute top-6 right-6 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
        onClick={onClose}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.5 }}
        transition={{ delay: 0.2 }}
      >
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </motion.button>
    </motion.div>
  );
}

// ─── Media Image Card ───

function MediaImageCard({
  item,
  index,
  onImageClick,
}: {
  item: MediaItem;
  index: number;
  onImageClick: (src: string, alt: string) => void;
}) {
  const inView = useSectionInView();
  return (
    <motion.div
      className="group relative cursor-pointer overflow-hidden rounded-2xl bg-gray-900 shadow-lg"
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: false, amount: 0.3 }}
      transition={{
        duration: 0.7,
        delay: index * 0.12,
        ease: [0.16, 1, 0.3, 1],
      }}
      whileHover={{ y: -6, scale: 1.02 }}
      onClick={() => onImageClick(item.imageSrc!, item.title)}
    >
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
        animate={inView ? ({ "--angle": ["0deg", "360deg"] } as Record<string, string[]>) : undefined}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
      />

      <div className="relative aspect-[9/16] max-h-[420px] overflow-hidden sm:aspect-[3/4]">
        <img
          src={item.imageSrc}
          alt={item.title}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* Expand icon */}
        <div className="pointer-events-none absolute inset-0 z-[2] flex items-center justify-center">
          <motion.div
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100"
          >
            <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
            </svg>
          </motion.div>
        </div>

        {/* Shimmer sweep overlay */}
        <motion.div
          className="pointer-events-none absolute inset-0 z-10"
          style={{
            background:
              "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.15) 50%, transparent 60%)",
            backgroundSize: "200% 100%",
          }}
          animate={inView ? { backgroundPosition: ["-100% 0%", "200% 0%"] } : undefined}
          transition={{
            duration: 3,
            delay: 2 + index * 0.5,
            repeat: Infinity,
            repeatDelay: 4,
            ease: "easeInOut",
          }}
        />

        <div className="absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-black/30 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/70 to-transparent" />

        <motion.div
          className="absolute inset-x-0 bottom-0 z-10 p-3"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ delay: 0.7 + index * 0.15, duration: 0.5 }}
        >
          <p className="line-clamp-1 text-xs font-semibold leading-tight text-white/90 sm:text-sm">
            {item.title}
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}

// ─── Auto-Play Video Card ───

function MediaVideoCard({
  item,
  index,
}: {
  item: MediaItem;
  index: number;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const inView = useSectionInView();

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
        animate={inView ? ({ "--angle": ["0deg", "360deg"] } as Record<string, string[]>) : undefined}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
      />

      <div className="relative aspect-[9/16] max-h-[420px] overflow-hidden sm:aspect-[3/4]">
        <video
          ref={videoRef}
          muted
          loop
          playsInline
          preload="auto"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        >
          <source src={item.videoSrc} type="video/mp4" />
        </video>

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

        <motion.div
          className="pointer-events-none absolute inset-0 z-10"
          style={{
            background:
              "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.15) 50%, transparent 60%)",
            backgroundSize: "200% 100%",
          }}
          animate={inView ? { backgroundPosition: ["-100% 0%", "200% 0%"] } : undefined}
          transition={{
            duration: 3,
            delay: 2 + index * 0.5,
            repeat: Infinity,
            repeatDelay: 4,
            ease: "easeInOut",
          }}
        />

        <div className="absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-black/30 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/70 to-transparent" />

        <motion.div
          className="absolute inset-x-0 bottom-0 z-10 p-3"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ delay: 0.7 + index * 0.15, duration: 0.5 }}
        >
          <p className="line-clamp-1 text-xs font-semibold leading-tight text-white/90 sm:text-sm">
            {item.title}
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}

// ─── Animated Monument Border ───

export function MonumentBorder() {
  const tileCount = 12;
  const halfWidth = (tileCount / 2) * 283;
  return (
    <div className="relative mt-6 overflow-hidden">
      <div
        className="flex items-end will-change-transform"
        style={{
          animation: `monument-scroll ${30}s linear infinite`,
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
      </div>
      <style>{`
        @keyframes monument-scroll {
          from { transform: translate3d(0, 0, 0); }
          to { transform: translate3d(-${halfWidth}px, 0, 0); }
        }
      `}</style>
    </div>
  );
}

// ─── Main Section ───

export function MediaCoverageSection() {
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null);
  const { ref: sectionRef, inView } = useInViewSection();
  const { data } = useMediaCoverage();
  const media = data ?? FALLBACK_MEDIA;

  return (
    <SectionInViewProvider value={inView}>
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-white pt-8 pb-0 sm:pt-10 lg:pt-12"
    >
      {/* ── Grid Background Image ── */}
      <div className="pointer-events-none absolute inset-0">
        <img
          src="/images/media-bg-2.jpg"
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover opacity-30"
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
                animate={inView ? { backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] } : undefined}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                style={{ backgroundSize: "200% 200%" }}
              >
                {media.title}
              </motion.span>
            </h2>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <p className="mt-1.5 text-xs text-gray-500 sm:text-sm lg:text-base">
              {media.subtitle}
            </p>
          </ScrollReveal>
        </div>

        <ScrollRevealLine
          delay={0.2}
          className="mx-auto mt-3 h-[3px] w-12 rounded-full bg-amber-500"
        />

        {/* ── Logo Ticker ── */}
        <ScrollReveal delay={0.15}>
          <LogoTicker logos={media.newsLogos} />
        </ScrollReveal>

        {/* ── Media Grid ── */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:gap-5">
          {media.mediaItems.map((item: MediaItem, i: number) =>
            item.type === "image" ? (
              <MediaImageCard
                key={i}
                item={item}
                index={i}
                onImageClick={(src, alt) => setLightbox({ src, alt })}
              />
            ) : (
              <MediaVideoCard
                key={i}
                item={item}
                index={i}
              />
            )
          )}
        </div>
      </div>

      {/* Lightbox overlay */}
      <AnimatePresence>
        {lightbox && (
          <ImageLightbox
            src={lightbox.src}
            alt={lightbox.alt}
            onClose={() => setLightbox(null)}
          />
        )}
      </AnimatePresence>
    </section>
    </SectionInViewProvider>
  );
}
