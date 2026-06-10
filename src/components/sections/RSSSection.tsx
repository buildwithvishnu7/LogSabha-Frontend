import { useRef, useEffect, useState, useMemo } from "react";
import { motion, useInView } from "motion/react";
import { Users, BookOpen, Heart, Play, Pause } from "lucide-react";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import lottieWeb from "lottie-web";

// ─── Lottie icon for RSS pillars ───
const rssLottieCache: Record<string, object> = {};

function RssLottieIcon({ src, size = 22, color = "#f97316" }: { src: string; size?: number; color?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const colorRef = useRef(color);
  colorRef.current = color;
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const load = (data: object) => {
      el.innerHTML = "";
      const anim = lottieWeb.loadAnimation({ container: el, renderer: "svg", loop: true, autoplay: true, animationData: data });
      const recolor = () => {
        const c = colorRef.current;
        el.querySelectorAll("path,circle,rect,line,ellipse,polyline,polygon").forEach(p => {
          const s = p.getAttribute("stroke"); if (s && s !== "none" && s !== "transparent") p.setAttribute("stroke", c);
        });
      };
      anim.addEventListener("DOMLoaded", recolor);
      anim.addEventListener("enterFrame", recolor);
    };
    if (rssLottieCache[src]) { load(rssLottieCache[src]); return; }
    let cancelled = false;
    fetch(src).then(r => r.json()).then(json => { rssLottieCache[src] = json; if (!cancelled) load(json); }).catch(() => {});
    return () => { cancelled = true; el.innerHTML = ""; };
  }, [src]);
  return <div ref={containerRef} style={{ width: size, height: size, display: "inline-flex" }} />;
}

// ─── Ticker Data ───

const TICKER_ITEMS = [
  "NATION FIRST",
  "SERVICE IS DUTY",
  "CULTURAL NATIONALISM",
  "SWADESHI SPIRIT",
  "UNITED BHARAT",
  "YOUTH POWER",
  "SELFLESS SERVICE",
  "INTEGRAL HUMANISM",
];

// ─── Typewriter Phrases ───

const TYPEWRITER_PHRASES = [
  "RSS की नींव, विचार और संगठन",
  "एक राष्ट्र, एक संस्कृति, एक जनता",
  "स्वयंसेवा से राष्ट्र निर्माण",
  "भारत माता की सेवा ही धर्म",
];

// ─── Infinite Ticker ───

function Ticker() {
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS];

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-orange-500 via-orange-600 to-orange-500">
      {/* Edge fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-orange-500 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-orange-500 to-transparent" />

      <motion.div
        className="flex whitespace-nowrap py-3.5"
        animate={{ x: [0, `-${(100 / items.length) * TICKER_ITEMS.length}%`] }}
        transition={{
          x: {
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          },
        }}
      >
        {items.map((text, i) => (
          <div key={i} className="flex items-center">
            <span className="px-6 text-sm font-bold tracking-wide text-white uppercase sm:px-8 sm:text-base">
              {text}
            </span>
            <span className="h-4 w-px bg-white/30" />
          </div>
        ))}
      </motion.div>
    </div>
  );
}

// ─── Multi-Phrase Typewriter ───

function TypewriterText({
  phrases,
  triggered,
  className,
}: {
  phrases: string[];
  triggered: boolean;
  className?: string;
}) {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [displayedCount, setDisplayedCount] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const currentPhrase = phrases[phraseIndex];
  const chars = useMemo(() => [...currentPhrase], [currentPhrase]);

  useEffect(() => {
    if (!triggered) {
      setDisplayedCount(0);
      setIsDeleting(false);
      return;
    }

    if (!isDeleting && displayedCount >= chars.length) {
      const timeout = setTimeout(() => setIsDeleting(true), 2200);
      return () => clearTimeout(timeout);
    }

    if (isDeleting && displayedCount === 0) {
      setIsDeleting(false);
      setPhraseIndex((i) => (i + 1) % phrases.length);
      return;
    }

    const speed = isDeleting ? 25 : 55;
    const timeout = setTimeout(() => {
      setDisplayedCount((c) => c + (isDeleting ? -1 : 1));
    }, speed);
    return () => clearTimeout(timeout);
  }, [triggered, displayedCount, chars.length, isDeleting, phrases]);

  return (
    <h3 className={className}>
      <span>{chars.slice(0, displayedCount).join("")}</span>
      {triggered && (
        <motion.span
          className="inline-block w-[2px] translate-y-[1px] bg-gray-800"
          style={{ height: "1em" }}
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, repeatType: "reverse" }}
        />
      )}
    </h3>
  );
}

// ─── Pillar Card ───

const PILLARS = [
  {
    icon: Users,
    lottieSrc: "/lottie/community.json",
    label: "स्वयंसेवक",
    color: "#f97316",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
  },
  {
    icon: BookOpen,
    lottieSrc: "/lottie/open-book.json",
    label: "विचारधारा",
    color: "#22c55e",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
  },
  {
    icon: Heart,
    lottieSrc: "/lottie/heart.json",
    label: "सेवा भाव",
    color: "#8b5cf6",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
  },
];

function PillarCard({
  pillar,
  index,
  triggered,
}: {
  pillar: (typeof PILLARS)[0];
  index: number;
  triggered: boolean;
}) {
  return (
    <motion.div
      className={`relative flex flex-1 flex-col items-center gap-1.5 overflow-hidden rounded-xl border ${pillar.borderColor} ${pillar.bgColor} px-2 py-3 sm:gap-2 sm:px-5 sm:py-4`}
      initial={{ opacity: 0, y: 20 }}
      animate={triggered ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{
        duration: 0.6,
        delay: 0.8 + index * 0.15,
        ease: [0.16, 1, 0.3, 1],
      }}
      whileHover={{ y: -3, scale: 1.03 }}
    >
      {/* Shimmer sweep */}
      {triggered && (
        <motion.div
          className="pointer-events-none absolute inset-0 z-10"
          style={{
            background: `linear-gradient(120deg, transparent 30%, ${pillar.color}10 45%, ${pillar.color}20 50%, ${pillar.color}10 55%, transparent 70%)`,
            backgroundSize: "200% 100%",
          }}
          animate={{ backgroundPosition: ["-200% 0%", "200% 0%"] }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            repeatDelay: 2 + index * 0.5,
            ease: "easeInOut",
          }}
        />
      )}

      {/* Pulsing border glow */}
      {triggered && (
        <motion.div
          className="pointer-events-none absolute inset-0 rounded-xl"
          animate={{
            boxShadow: [
              `inset 0 0 0 1px ${pillar.color}00`,
              `inset 0 0 0 1.5px ${pillar.color}40`,
              `inset 0 0 0 1px ${pillar.color}00`,
            ],
          }}
          transition={{
            duration: 2.5,
            delay: index * 0.8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      )}

      <motion.div
        className="flex h-11 w-11 items-center justify-center rounded-full"
        style={{ backgroundColor: `${pillar.color}15` }}
        animate={
          triggered
            ? {
                scale: [1, 1.15, 1],
                boxShadow: [
                  `0 0 0 0 ${pillar.color}00`,
                  `0 0 10px 3px ${pillar.color}30`,
                  `0 0 0 0 ${pillar.color}00`,
                ],
              }
            : {}
        }
        transition={{
          duration: 2.5,
          delay: 1.5 + index * 0.8,
          repeat: Infinity,
          repeatDelay: 1.5,
          ease: "easeInOut",
        }}
      >
        <RssLottieIcon
          src={pillar.lottieSrc}
          size={24}
          color={pillar.color}
        />
      </motion.div>
      <span className="text-xs font-semibold text-gray-700 sm:text-sm">
        {pillar.label}
      </span>
    </motion.div>
  );
}

// ─── Video Player ───

function VideoPlayer({ triggered }: { triggered: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const onEnded = () => setIsPlaying(false);
    video.addEventListener("ended", onEnded);
    return () => video.removeEventListener("ended", onEnded);
  }, []);

  useEffect(() => {
    if (triggered && videoRef.current && !isPlaying) {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  }, [triggered]);

  return (
    <motion.div
      className="relative h-full w-full cursor-pointer overflow-hidden rounded-xl shadow-2xl shadow-orange-500/20"
      initial={{ opacity: 0, x: 40 }}
      animate={triggered ? { opacity: 1, x: 0 } : { opacity: 0, x: 40 }}
      transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
      onClick={togglePlay}
      whileHover={{ scale: 1.02 }}
    >
      <video
        ref={videoRef}
        className="h-full w-full object-cover"
        muted
        loop
        playsInline
        preload="metadata"
        poster=""
      >
        <source src="/videos/RSS-vid.mp4" type="video/mp4" />
      </video>

      {/* Play/Pause overlay */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center bg-black/20 transition-opacity"
        animate={{ opacity: isPlaying ? 0 : 1 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 shadow-lg backdrop-blur-sm"
          animate={
            !isPlaying
              ? { scale: [1, 1.08, 1] }
              : {}
          }
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {isPlaying ? (
            <Pause className="h-7 w-7 text-orange-600" />
          ) : (
            <Play className="ml-1 h-7 w-7 text-orange-600" />
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

// ─── Main Section ───

export function RSSSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });
  const [triggered, setTriggered] = useState(false);

  useEffect(() => {
    if (isInView) setTriggered(true);
  }, [isInView]);

  return (
    <section ref={sectionRef} className="relative overflow-hidden">
      {/* Ticker */}
      <Ticker />

      {/* Main Content — warm background */}
      <div className="relative bg-orange-50/60 py-8 sm:py-10 lg:py-12">
        {/* RSS background image */}
        <div className="pointer-events-none absolute inset-0">
          <img
            src="/images/rss-bg.png"
            alt=""
            aria-hidden="true"
            className="h-full w-full object-cover opacity-20"
          />
          {/* Edge vignette */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at center, transparent 40%, rgba(255,247,237,0.5) 75%, rgba(255,247,237,0.95) 100%)",
            }}
          />
        </div>
        {/* Floating ambient particles — more and larger */}
        {triggered && (
          <>
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                className="pointer-events-none absolute rounded-full"
                style={{
                  width: 6 + (i % 5) * 4,
                  height: 6 + (i % 5) * 4,
                  left: `${5 + i * 7.5}%`,
                  top: `${10 + (i % 4) * 22}%`,
                  background:
                    i % 3 === 0
                      ? "rgba(249,115,22,0.25)"
                      : i % 3 === 1
                        ? "rgba(251,191,36,0.2)"
                        : "rgba(234,88,12,0.15)",
                }}
                animate={{
                  y: [0, -25 - (i % 4) * 8, 0],
                  x: [0, i % 2 === 0 ? 12 : -12, 0],
                  opacity: [0.15, 0.5, 0.15],
                  scale: [1, 1.4, 1],
                }}
                transition={{
                  duration: 3 + i * 0.4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.3,
                }}
              />
            ))}
          </>
        )}

        {/* Subtle left accent line */}
        <motion.div
          className="absolute top-0 left-6 h-full w-1 rounded-full bg-gradient-to-b from-transparent via-orange-400/25 to-transparent sm:left-10 lg:left-16"
          initial={{ scaleY: 0 }}
          animate={triggered ? { scaleY: 1 } : { scaleY: 0 }}
          transition={{ duration: 1.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          style={{ originY: 0 }}
        />

        {/* Ambient glow behind card — breathing */}
        {triggered && (
          <motion.div
            className="pointer-events-none absolute top-1/2 left-1/2 h-[300px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-300/10 blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        )}

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-10">
          {/* Single white card holding both info + video */}
          <ScrollReveal>
            <div className="relative overflow-hidden rounded-2xl border-r-4 border-blue-800 bg-white shadow-2xl shadow-orange-900/10 ring-1 ring-gray-100/80 sm:border-r-[6px]">
              {/* Card shimmer sweep */}
              {triggered && (
                <motion.div
                  className="pointer-events-none absolute inset-0 z-20"
                  style={{
                    background:
                      "linear-gradient(120deg, transparent 30%, rgba(249,115,22,0.04) 45%, rgba(249,115,22,0.08) 50%, rgba(249,115,22,0.04) 55%, transparent 70%)",
                    backgroundSize: "200% 100%",
                  }}
                  animate={{ backgroundPosition: ["-200% 0%", "200% 0%"] }}
                  transition={{
                    duration: 3.5,
                    repeat: Infinity,
                    repeatDelay: 2,
                    ease: "easeInOut",
                  }}
                />
              )}

              <div className="relative grid lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_420px]">
                {/* Left: Info — determines card height */}
                <div className="relative z-10 p-4 sm:p-6 md:p-8 lg:min-h-[560px] lg:p-10">
                  {/* Logo + Title */}
                  <div className="flex items-center gap-3">
                    <motion.img
                      src="/logo/rss.gif"
                      alt="RSS"
                      className="h-11 w-11 object-contain sm:h-13 sm:w-13"
                      animate={
                        triggered
                          ? {
                              rotate: [0, 3, -3, 0],
                              scale: [1, 1.05, 1],
                            }
                          : {}
                      }
                      transition={{
                        duration: 4,
                        delay: 1,
                        repeat: Infinity,
                        repeatDelay: 2,
                        ease: "easeInOut",
                      }}
                    />
                    <motion.h2
                      className="text-xl font-semibold text-gray-900 sm:text-2xl md:text-3xl lg:text-[44px] lg:leading-[55px]"
                      style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        letterSpacing: "-0.44px",
                        backgroundImage:
                          "linear-gradient(90deg, #1f2937, #92400e, #f59e0b, #92400e, #1f2937)",
                        backgroundSize: "300% 100%",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }}
                      animate={{
                        backgroundPosition: [
                          "0% 50%",
                          "100% 50%",
                          "0% 50%",
                        ],
                      }}
                      transition={{
                        duration: 6,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      राष्ट्रीय स्वयंसेवक संघ
                    </motion.h2>
                  </div>

                  {/* Tagline */}
                  <motion.p
                    className="mt-2.5 text-sm font-semibold sm:text-base"
                    style={{
                      background:
                        "linear-gradient(90deg, #ea580c, #f97316, #fb923c, #f97316, #ea580c)",
                      backgroundSize: "200% 100%",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                    animate={{
                      backgroundPosition: [
                        "0% 50%",
                        "100% 50%",
                        "0% 50%",
                      ],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    वह शुरुआत जिसने भारत को नई दिशा दी
                  </motion.p>

                  {/* Subheading — Multi-phrase Typewriter */}
                  <TypewriterText
                    phrases={TYPEWRITER_PHRASES}
                    triggered={triggered}
                    className="mt-3 text-sm font-bold text-gray-800"
                  />

                  {/* Description */}
                  <p className="mt-2 text-sm leading-relaxed text-gray-500">
                    आज राष्ट्रीय स्वयंसेवक संघ भारत के सबसे बड़े स्वयंसेवी संगठनों
                    में से एक माना जाता है। इसके कार्य और प्रभाव को समझने के लिए
                    उसके मूल विचार, स्थापना की पृष्ठभूमि और संस्थापक दृष्टि को जानना
                    आवश्यक है।
                  </p>

                  {/* Pillars */}
                  <div className="mt-5 flex gap-2 sm:gap-3">
                    {PILLARS.map((pillar, i) => (
                      <PillarCard
                        key={pillar.label}
                        pillar={pillar}
                        index={i}
                        triggered={triggered}
                      />
                    ))}
                  </div>

                  {/* CTA — breathing glow + pulse ring */}
                  <motion.a
                    href="#"
                    className="relative mt-6 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-orange-600"
                    animate={
                      triggered
                        ? {
                            boxShadow: [
                              "0 10px 15px -3px rgba(249,115,22,0.25)",
                              "0 10px 30px -3px rgba(249,115,22,0.5)",
                              "0 10px 15px -3px rgba(249,115,22,0.25)",
                            ],
                          }
                        : undefined
                    }
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <motion.span
                      className="pointer-events-none absolute inset-[-3px] rounded-xl border-2 border-orange-500/70"
                      style={{ boxShadow: "0 0 8px rgba(249,115,22,0.25)" }}
                      animate={{ scale: [1, 1.06, 1], opacity: [0.8, 0, 0.8] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <motion.span
                      className="pointer-events-none absolute inset-[-1px] rounded-xl border-2 border-orange-500/50"
                      animate={{ scale: [1, 1.03, 1], opacity: [1, 0.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
                    />
                    और जानें
                    <RssLottieIcon src="/lottie/fast-forward.json" size={22} color="#ffffff" />
                  </motion.a>
                </div>

                {/* Right: Video with dark orange background */}
                <div className="relative h-[280px] bg-gradient-to-br from-orange-700 via-orange-800 to-orange-900 p-1.5 sm:h-[340px] lg:absolute lg:inset-y-0 lg:right-0 lg:h-auto lg:w-[380px] lg:p-2 xl:w-[420px]">
                  <VideoPlayer triggered={triggered} />
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
