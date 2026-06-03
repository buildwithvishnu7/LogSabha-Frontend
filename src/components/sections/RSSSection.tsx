import { useRef, useEffect, useState, useMemo, type ComponentType } from "react";
import { motion, useInView } from "motion/react";
import { Users, BookOpen, Heart, ArrowRight, Play, Pause } from "lucide-react";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { LoopingIcon } from "@/components/LoopingIcon";
import UsersIcon from "@/components/ui/users-icon";
import BookIcon from "@/components/ui/book-icon";
import HeartIcon from "@/components/ui/heart-icon";
import type { AnimatedIconHandle, AnimatedIconProps } from "@/components/ui/types";

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
        animate={{ x: [0, `-${100 / items.length * TICKER_ITEMS.length}%`] }}
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

// ─── Pillar Card ───

const PILLARS = [
  {
    icon: Users,
    animatedIcon: UsersIcon,
    label: "स्वयंसेवक",
    color: "#f97316",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
    loopInterval: 4000,
  },
  {
    icon: BookOpen,
    animatedIcon: BookIcon,
    label: "विचारधारा",
    color: "#22c55e",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    loopInterval: 4500,
  },
  {
    icon: Heart,
    animatedIcon: HeartIcon,
    label: "सेवा भाव",
    color: "#8b5cf6",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    loopInterval: 3000,
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
      className={`flex flex-col items-center gap-2 rounded-xl border ${pillar.borderColor} ${pillar.bgColor} px-5 py-4`}
      initial={{ opacity: 0, y: 20 }}
      animate={triggered ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{
        duration: 0.6,
        delay: 0.8 + index * 0.15,
        ease: [0.16, 1, 0.3, 1],
      }}
      whileHover={{ y: -3, scale: 1.03 }}
    >
      <motion.div
        className="flex h-11 w-11 items-center justify-center rounded-full"
        style={{ backgroundColor: `${pillar.color}15` }}
        animate={
          triggered
            ? { scale: [1, 1.1, 1] }
            : {}
        }
        transition={{
          duration: 3,
          delay: 3 + index * 1.5,
          repeat: Infinity,
          repeatDelay: 3,
          ease: "easeInOut",
        }}
      >
        <LoopingIcon
          icon={pillar.animatedIcon}
          size={20}
          color={pillar.color}
          interval={pillar.loopInterval}
          delay={300 + index * 500}
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

// ─── Typewriter Text ───

function TypewriterText({
  text,
  triggered,
  className,
}: {
  text: string;
  triggered: boolean;
  className?: string;
}) {
  const [displayedCount, setDisplayedCount] = useState(0);
  const chars = useMemo(() => [...text], [text]);

  useEffect(() => {
    if (!triggered) {
      setDisplayedCount(0);
      return;
    }

    if (displayedCount >= chars.length) return;

    const timeout = setTimeout(() => {
      setDisplayedCount((c) => c + 1);
    }, 60);

    return () => clearTimeout(timeout);
  }, [triggered, displayedCount, chars.length]);

  return (
    <h3 className={className}>
      <span>{chars.slice(0, displayedCount).join("")}</span>
      {triggered && displayedCount < chars.length && (
        <motion.span
          className="inline-block w-[2px] translate-y-[1px] bg-gray-800"
          style={{ height: "1em" }}
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, ease: "steps(2)" }}
        />
      )}
      {triggered && displayedCount >= chars.length && (
        <motion.span
          className="inline-block w-[2px] translate-y-[1px] bg-gray-800"
          style={{ height: "1em" }}
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.8, repeat: 3, ease: "steps(2)" }}
        />
      )}
    </h3>
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
        {/* Floating ambient particles */}
        {triggered && (
          <>
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="pointer-events-none absolute rounded-full bg-orange-400/15"
                style={{
                  width: 6 + i * 4,
                  height: 6 + i * 4,
                  left: `${12 + i * 15}%`,
                  top: `${20 + (i % 3) * 25}%`,
                }}
                animate={{
                  y: [0, -20 - i * 5, 0],
                  x: [0, (i % 2 === 0 ? 10 : -10), 0],
                  opacity: [0.2, 0.5, 0.2],
                }}
                transition={{
                  duration: 4 + i * 0.8,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.6,
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

        {/* Ambient glow behind card */}
        {triggered && (
          <motion.div
            className="pointer-events-none absolute top-1/2 left-1/2 h-[300px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-300/10 blur-3xl"
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        )}

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-10">
          {/* Single white card holding both info + video */}
          <ScrollReveal>
            <motion.div
              className="overflow-hidden rounded-2xl bg-white shadow-2xl shadow-orange-900/10 ring-1 ring-gray-100/80"
              animate={triggered ? { y: [0, -4, 0] } : undefined}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <div className="relative grid lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_420px]">
                {/* Left: Info — determines card height */}
                <div className="relative z-10 p-6 sm:p-8 lg:min-h-[560px] lg:p-10">
                  {/* Logo + Title */}
                  <div className="flex items-center gap-3">
                    <motion.img
                      src="/logo/rss.gif"
                      alt="RSS"
                      className="h-11 w-11 object-contain sm:h-13 sm:w-13"
                      animate={
                        triggered
                          ? { rotate: [0, 3, -3, 0] }
                          : {}
                      }
                      transition={{
                        duration: 4,
                        delay: 3,
                        repeat: Infinity,
                        repeatDelay: 4,
                        ease: "easeInOut",
                      }}
                    />
                    <h2
                      className="text-2xl font-semibold sm:text-3xl lg:text-[44px] lg:leading-[55px]"
                      style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        letterSpacing: "-0.44px",
                        background: "linear-gradient(90deg, #111827 40%, #f97316 50%, #111827 60%)",
                        backgroundSize: "200% 100%",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        animation: "rss-title-shimmer 4s ease-in-out infinite",
                      }}
                    >
                      राष्ट्रीय स्वयंसेवक संघ
                    </h2>
                  </div>

                  {/* Tagline */}
                  <motion.p
                    className="mt-2.5 text-sm font-semibold sm:text-base"
                    style={{
                      background: "linear-gradient(90deg, #ea580c, #f97316, #fb923c, #f97316, #ea580c)",
                      backgroundSize: "200% 100%",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                    animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  >
                    वह शुरुआत जिसने भारत को नई दिशा दी
                  </motion.p>

                  {/* Subheading — Typewriter */}
                  <TypewriterText
                    text="RSS की नींव, विचार और संगठन"
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
                  <div className="mt-5 flex flex-wrap gap-3">
                    {PILLARS.map((pillar, i) => (
                      <PillarCard
                        key={pillar.label}
                        pillar={pillar}
                        index={i}
                        triggered={triggered}
                      />
                    ))}
                  </div>

                  {/* CTA */}
                  <motion.a
                    href="#"
                    className="mt-6 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-orange-600"
                    animate={triggered ? {
                      boxShadow: [
                        "0 10px 15px -3px rgba(249,115,22,0.25)",
                        "0 10px 25px -3px rgba(249,115,22,0.45)",
                        "0 10px 15px -3px rgba(249,115,22,0.25)",
                      ],
                    } : undefined}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    और जानें
                    <ArrowRight className="h-4 w-4" />
                  </motion.a>
                </div>

                {/* Right: Video with dark orange background — fills height set by left column */}
                <div className="relative bg-gradient-to-br from-orange-700 via-orange-800 to-orange-900 p-1.5 lg:absolute lg:inset-y-0 lg:right-0 lg:w-[380px] lg:p-2 xl:w-[420px]">
                  <VideoPlayer triggered={triggered} />
                </div>
              </div>
            </motion.div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
