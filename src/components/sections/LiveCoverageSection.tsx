import { useRef, useEffect, useState, useCallback } from "react";
import { motion, useInView } from "motion/react";
import { loadLottieInView } from "@/lib/lottie";
import {
  ScrollReveal,
  ScrollRevealLine,
} from "@/components/motion/ScrollReveal";
import { LoopingIcon } from "@/components/LoopingIcon";
import BroadcastIcon from "@/components/ui/broadcast-icon";
import { useLiveCoverage } from "@/hooks/useLiveCoverage";

// ─── Inline Lottie Icon ───
function LiveLottieIcon({ src, size = 18, color = "#f59e0b" }: { src: string; size?: number; color?: string }) {
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
      const anim = loadLottieInView({ container: el, animationData: json });
      const recolor = () => {
        const c = colorRef.current;
        el.querySelectorAll("path,circle,rect,line,ellipse,polyline,polygon").forEach(p => {
          const s = p.getAttribute("stroke"); if (s && s !== "none" && s !== "transparent") p.setAttribute("stroke", c);
          const f = p.getAttribute("fill"); if (f && f !== "none" && f !== "transparent") p.setAttribute("fill", c);
        });
      };
      anim.addEventListener("DOMLoaded", recolor);
      anim.addEventListener("enterFrame", recolor);
    }).catch(() => {});
    return () => { cancelled = true; el.innerHTML = ""; };
  }, [src]);
  return <div ref={ref} style={{ width: size, height: size, display: "inline-flex" }} />;
}

// ─── Data ───

interface SpeechVideo {
  id?: string;
  title: string;
  speaker: string;
  videoSrc: string;
}

interface MainVideo {
  tag: string;
  title: string;
  youtubeUrl: string;
}

// Used until the API responds, or if it's unreachable.
const FALLBACK_LIVE = {
  title: "Live",
  titleHighlight: "Political Coverage",
  subtitle: "Watch live sessions and recent parliamentary speeches",
  mainVideo: {
    tag: "Parliament",
    title: "PM Modi's Remarks in Lok Sabha — Parliament Session",
    youtubeUrl: "https://www.youtube.com/watch?v=kTB6g92Usmw",
  } as MainVideo,
  speeches: [
    { title: "PM Modi Makes Akhilesh Yadav Laugh — Witty Remarks Lighten Up Lok Sabha Debate", speaker: "Parliament Session July 2024", videoSrc: "/videos/modis-speech.mp4" },
    { title: "PM Modi's Fiery Address on National Unity — Motion of Thanks in Lok Sabha", speaker: "Parliament Session January 2025", videoSrc: "/videos/pm-modi-speech.mp4" },
    { title: "'Is PM Modi God?' Mallikarjun Kharge's Sharp Dig At Govt Ahead Of Parliament Speech", speaker: "Budget Session February 2025", videoSrc: "/videos/is-pm-modi-god.mp4" },
    { title: "Winter Session: Future in India — Nitin Gadkari Explains Growth, Safety & Rules in Lok Sabha", speaker: "Winter Session December 2024", videoSrc: "/videos/winter-session-v.mp4" },
  ] as SpeechVideo[],
};

// ─── Live Pulse Dot ───

function LiveDot() {
  return (
    <span className="relative flex h-2.5 w-2.5">
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
      <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
    </span>
  );
}

// ─── YouTube Embed Helper ───

function getYouTubeEmbedUrl(url: string, autoplay = true): string {
  const match = url.match(/[?&]v=([^&]+)/);
  const id = match?.[1] ?? "";
  const params = new URLSearchParams({
    autoplay: autoplay ? "1" : "0",
    mute: "1",
    loop: "1",
    playlist: id,
    controls: "1",
    modestbranding: "1",
    rel: "0",
    showinfo: "0",
    playsinline: "1",
    enablejsapi: "1",
  });
  return `https://www.youtube.com/embed/${id}?${params.toString()}`;
}

// ─── Main Video Player (YouTube iframe) ───

function MainVideoPlayer({
  isPausedByHover,
  iframeRef,
  mainVideo,
}: {
  isPausedByHover: boolean;
  iframeRef: React.RefObject<HTMLIFrameElement | null>;
  mainVideo: MainVideo;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
      },
      { threshold: 0.3 },
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  // Pause / resume YouTube via postMessage when a speech card is hovered
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe?.contentWindow) return;
    const cmd = isPausedByHover ? "pauseVideo" : "playVideo";
    iframe.contentWindow.postMessage(
      JSON.stringify({ event: "command", func: cmd, args: "" }),
      "*",
    );
  }, [isPausedByHover, iframeRef]);

  return (
    <motion.div
      ref={containerRef}
      className="group relative h-[340px] w-full overflow-hidden rounded-2xl bg-gray-900 shadow-xl shadow-black/10 sm:h-[400px] lg:h-[500px]"
      initial={{ opacity: 0, y: 30, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: false, amount: 0.2, margin: "0px 0px -50px 0px" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      {inView && (
        <iframe
          ref={iframeRef}
          src={getYouTubeEmbedUrl(mainVideo.youtubeUrl)}
          title={mainVideo.title}
          className="absolute inset-0 h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{ border: "none" }}
        />
      )}

      {/* Gradient overlays */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />

      {/* Tag */}
      <div className="pointer-events-none absolute top-4 left-4 z-10">
        <span className="rounded-md bg-amber-500/90 px-3 py-1 text-[11px] font-bold tracking-wide text-white uppercase backdrop-blur-sm">
          {mainVideo.tag}
        </span>
      </div>

      {/* LIVE NOW badge — visible on mobile only (overlaid on video) */}
      <motion.div
        className="pointer-events-none absolute top-3 right-3 z-10 flex items-center gap-1.5 rounded-full border border-red-300/50 bg-red-50/90 px-3 py-1.5 shadow-sm backdrop-blur-sm sm:hidden"
        animate={inView ? { boxShadow: ["0 0 0 0 rgba(239,68,68,0)", "0 0 0 6px rgba(239,68,68,0)"] } : undefined}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <LiveDot />
        <span className="text-[10px] font-bold tracking-wider text-red-600 uppercase">
          Live Now
        </span>
      </motion.div>

      {/* Title overlay */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 p-5 sm:p-6">
        <h3 className="text-lg font-bold text-white sm:text-xl lg:text-2xl">
          {mainVideo.title}
        </h3>
      </div>
    </motion.div>
  );
}

// ─── Hover-to-Play Speech Card (local video, resume from last point) ───

function SpeechCard({
  speech,
  index,
  onHoverStart,
  onHoverEnd,
}: {
  speech: SpeechVideo;
  index: number;
  onHoverStart: () => void;
  onHoverEnd: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
    onHoverStart();
    videoRef.current?.play().catch(() => {});
  }, [onHoverStart]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    onHoverEnd();
    videoRef.current?.pause();
  }, [onHoverEnd]);

  return (
    <motion.div
      className="group cursor-pointer"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.3, margin: "0px 0px -50px 0px" }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.16, 1, 0.3, 1],
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-gray-900">
        {/* Video — always mounted, plays/pauses on hover */}
        <video
          ref={videoRef}
          muted
          loop
          playsInline
          preload="auto"
          className="absolute inset-0 h-full w-full object-contain"
        >
          <source src={speech.videoSrc} type="video/mp4" />
        </video>

        {/* Dark overlay when paused */}
        <div
          className={`absolute inset-0 bg-black/20 transition-opacity duration-300 ${
            isHovered ? "opacity-0" : "opacity-100"
          }`}
        />

        {/* Play indicator — visible when not hovered */}
        <div
          className={`pointer-events-none absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
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
        <h4 className="line-clamp-1 text-sm font-bold leading-snug text-gray-900 transition-colors duration-200 group-hover:text-amber-600">
          {speech.title}
        </h4>
        <p className="mt-1 text-xs text-gray-500">{speech.speaker}</p>
      </div>
    </motion.div>
  );
}

// ─── Main Section ───

export function LiveCoverageSection() {
  const mainIframeRef = useRef<HTMLIFrameElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const sectionInView = useInView(sectionRef, { margin: "200px 0px 200px 0px" });
  const [speechHovered, setSpeechHovered] = useState(false);
  const { data } = useLiveCoverage();
  const live = data ?? FALLBACK_LIVE;

  const handleSpeechHoverStart = useCallback(() => setSpeechHovered(true), []);
  const handleSpeechHoverEnd = useCallback(() => setSpeechHovered(false), []);

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-gradient-to-b from-white via-amber-50/20 to-white py-3 sm:py-4 lg:py-6">
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
              <h2 className="text-2xl font-extrabold text-gray-900 sm:text-3xl lg:text-4xl">
                {live.title}{" "}
                <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 bg-clip-text text-transparent">
                  {live.titleHighlight}
                </span>
              </h2>
            </ScrollReveal>

            <ScrollReveal delay={0.15}>
              <p className="mt-1.5 text-xs leading-relaxed text-gray-500 sm:text-sm lg:text-base">
                {live.subtitle}
              </p>
            </ScrollReveal>
          </div>

          {/* LIVE NOW badge — hidden on mobile, shown in video overlay instead */}
          <ScrollReveal delay={0.2} className="hidden sm:block">
            <motion.div
              className="flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-4 py-2 shadow-sm"
              animate={sectionInView ? { boxShadow: ["0 0 0 0 rgba(239,68,68,0)", "0 0 0 8px rgba(239,68,68,0)"] } : undefined}
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
          className="mt-2 h-[3px] w-12 rounded-full bg-amber-500"
        />

        {/* ── Main Video ── */}
        <div className="mt-3 lg:mt-4">
          <MainVideoPlayer
            isPausedByHover={speechHovered}
            iframeRef={mainIframeRef}
            mainVideo={live.mainVideo}
          />
        </div>

        {/* ── From the Archives ── */}
        <div className="mt-4 lg:mt-5">
          <ScrollReveal delay={0.1}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <LoopingIcon
                  icon={BroadcastIcon}
                  size={20}
                  interval={4000}
                  className="text-amber-500"
                />
                <h3 className="text-lg font-extrabold text-gray-900 sm:text-xl">
                  From the Archives
                </h3>
              </div>
              <a
                href="#"
                className="moving-border flex items-center gap-1.5 rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-amber-500 transition-colors hover:text-amber-600"
              >
                <span>View All</span>
                <LiveLottieIcon src="/lottie/fast-forward.json" size={20} color="#f59e0b" />
              </a>
            </div>
          </ScrollReveal>

          <div className="scrollbar-hide -mx-4 mt-4 flex gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-5 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-4">
            {live.speeches.map((speech, i) => (
              <div key={i} className="w-[240px] flex-shrink-0 sm:w-auto">
                <SpeechCard
                  speech={speech}
                  index={i}
                  onHoverStart={handleSpeechHoverStart}
                  onHoverEnd={handleSpeechHoverEnd}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
