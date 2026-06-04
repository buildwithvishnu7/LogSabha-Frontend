import { useRef, useState, useEffect, useMemo } from "react";
import { motion, useInView } from "motion/react";
import {
  Scale,
  Landmark,
  Heart,
  Shield,
  ArrowRight,
} from "lucide-react";
import { ScrollReveal } from "@/components/motion/ScrollReveal";

// ─── Data ───

const PILLARS = [
  {
    icon: Scale,
    title: "Justice & Equality",
    description:
      "Advocating for equitable treatment and constitutional rights for all communities within the democratic framework.",
    color: "#f97316",
  },
  {
    icon: Landmark,
    title: "Cultural Preservation",
    description:
      "Preserving India's rich cultural heritage and promoting awareness of historical traditions and values.",
    color: "#f97316",
  },
  {
    icon: Heart,
    title: "Social Welfare",
    description:
      "Community-driven welfare programs focusing on education, healthcare, and economic empowerment.",
    color: "#f97316",
  },
  {
    icon: Shield,
    title: "Legal Advocacy",
    description:
      "Providing legal support and advocacy for issues affecting community rights and social justice.",
    color: "#f97316",
  },
];

const TYPEWRITER_PHRASES = [
  "Social Justice & Community Welfare Initiative",
  "Empowering Communities Through Unity",
  "Defending Constitutional Rights for All",
  "Building a Just & Equitable Society",
];

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

    const speed = isDeleting ? 25 : 45;
    const timeout = setTimeout(() => {
      setDisplayedCount((c) => c + (isDeleting ? -1 : 1));
    }, speed);
    return () => clearTimeout(timeout);
  }, [triggered, displayedCount, chars.length, isDeleting, phrases]);

  return (
    <span className={className}>
      <span>{chars.slice(0, displayedCount).join("")}</span>
      {triggered && (
        <motion.span
          className="inline-block w-[2px] translate-y-[1px] bg-amber-500"
          style={{ height: "1em" }}
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, ease: "steps(2)" }}
        />
      )}
    </span>
  );
}

// ─── Pillar Card ───

function PillarCard({
  pillar,
  index,
  triggered,
}: {
  pillar: (typeof PILLARS)[0];
  index: number;
  triggered: boolean;
}) {
  const Icon = pillar.icon;

  return (
    <motion.div
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white/90 p-5 shadow-sm backdrop-blur-sm transition-all duration-300 hover:border-amber-300 hover:shadow-lg sm:p-6"
      initial={{ opacity: 0, y: 30 }}
      animate={triggered ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.6,
        delay: 0.4 + index * 0.12,
        ease: [0.16, 1, 0.3, 1],
      }}
      whileHover={{ y: -5 }}
    >
      {/* Continuous shimmer sweep */}
      {triggered && (
        <motion.div
          className="pointer-events-none absolute inset-0 z-10"
          style={{
            background:
              "linear-gradient(120deg, transparent 30%, rgba(251,191,36,0.08) 45%, rgba(251,191,36,0.15) 50%, rgba(251,191,36,0.08) 55%, transparent 70%)",
            backgroundSize: "200% 100%",
          }}
          animate={{ backgroundPosition: ["-200% 0%", "200% 0%"] }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatDelay: 1.5,
            ease: "easeInOut",
          }}
        />
      )}

      {/* Pulsing border glow */}
      {triggered && (
        <motion.div
          className="pointer-events-none absolute inset-0 rounded-2xl"
          animate={{
            boxShadow: [
              "inset 0 0 0 1px rgba(251,191,36,0)",
              "inset 0 0 0 1.5px rgba(251,191,36,0.35)",
              "inset 0 0 0 1px rgba(251,191,36,0)",
            ],
          }}
          transition={{
            duration: 3,
            delay: index * 0.7,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      )}

      {/* Icon with glow pulse */}
      <motion.div
        className="relative mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-500"
        animate={
          triggered
            ? {
                scale: [1, 1.15, 1],
                boxShadow: [
                  "0 0 0 0 rgba(249,115,22,0)",
                  "0 0 12px 4px rgba(249,115,22,0.25)",
                  "0 0 0 0 rgba(249,115,22,0)",
                ],
              }
            : {}
        }
        transition={{
          duration: 2.5,
          delay: 1 + index * 0.5,
          repeat: Infinity,
          repeatDelay: 1.5,
          ease: "easeInOut",
        }}
      >
        <Icon className="h-5 w-5" />
      </motion.div>

      {/* Title */}
      <h3 className="text-base font-bold text-gray-900 sm:text-lg">
        {pillar.title}
      </h3>

      {/* Description */}
      <p className="mt-2 text-sm leading-relaxed text-gray-500">
        {pillar.description}
      </p>

      {/* Hover accent line */}
      <motion.div
        className="absolute bottom-0 left-5 right-5 h-[2px] rounded-full bg-amber-500"
        initial={{ scaleX: 0 }}
        whileHover={{ scaleX: 1 }}
        transition={{ duration: 0.3 }}
        style={{ originX: 0 }}
      />
    </motion.div>
  );
}

// ─── Main Section ───

export function HinduForJusticeSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.15 });
  const [triggered, setTriggered] = useState(false);

  useEffect(() => {
    if (isInView) setTriggered(true);
  }, [isInView]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-amber-50/40 py-12 sm:py-14 lg:py-18"
    >
      {/* ── Background ── */}
      <div className="pointer-events-none absolute inset-0">
        {/* Justice background image */}
        <img
          src="/images/justice.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-white/80 backdrop-blur-[2px]" />

        {/* Subtle dot pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, #f97316 0.8px, transparent 0)",
            backgroundSize: "28px 28px",
          }}
        />

        {/* Animated ambient glows — faster, more visible */}
        {triggered && (
          <>
            <motion.div
              className="absolute -top-32 -right-32 h-80 w-80 rounded-full bg-amber-300/20 blur-3xl"
              animate={{ x: [0, 30, 0], y: [0, -20, 0], scale: [1, 1.2, 1] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute -bottom-32 -left-32 h-72 w-72 rounded-full bg-orange-200/15 blur-3xl"
              animate={{ x: [0, -25, 0], y: [0, 25, 0], scale: [1.1, 0.9, 1.1] }}
              transition={{ duration: 10, delay: 1, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute top-1/2 left-1/2 h-60 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-200/10 blur-3xl"
              animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.25, 0.1] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />
          </>
        )}

        {/* Floating particles */}
        {triggered &&
          [...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              className="pointer-events-none absolute rounded-full"
              style={{
                width: 4 + (i % 4) * 3,
                height: 4 + (i % 4) * 3,
                left: `${8 + i * 9}%`,
                top: `${15 + (i % 4) * 20}%`,
                background:
                  i % 3 === 0
                    ? "rgba(251,191,36,0.3)"
                    : i % 3 === 1
                      ? "rgba(249,115,22,0.25)"
                      : "rgba(245,158,11,0.2)",
              }}
              animate={{
                y: [0, -25 - (i % 3) * 10, 0],
                x: [0, i % 2 === 0 ? 15 : -15, 0],
                opacity: [0.15, 0.5, 0.15],
                scale: [1, 1.4, 1],
              }}
              transition={{
                duration: 3 + i * 0.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.3,
              }}
            />
          ))}
      </div>

      <div className="relative z-10 mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 xl:px-12">
        {/* Two-column layout: Left (header + pillars) | Right (image + mission) */}
        <div className="grid gap-8 lg:grid-cols-[1fr_420px] lg:gap-10 xl:grid-cols-[1fr_480px]">
          {/* ── Left Column ── */}
          <div>
            {/* Header with logo */}
            <ScrollReveal>
              <div className="flex items-center gap-4">
                <motion.img
                  src="/logo/HFJ-logo-final-new.gif"
                  alt="Hindu For Justice"
                  className="h-16 w-16 rounded-xl object-contain shadow-md sm:h-20 sm:w-20"
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
                <div>
                  <h2 className="text-2xl font-extrabold text-gray-900 sm:text-3xl lg:text-4xl">
                    Hindu For{" "}
                    <motion.span
                      className="inline-block bg-clip-text text-transparent"
                      style={{
                        backgroundImage:
                          "linear-gradient(90deg, #f59e0b, #ea580c, #fbbf24, #f97316, #f59e0b)",
                        backgroundSize: "200% 100%",
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
                      Justice
                    </motion.span>
                  </h2>
                  <p className="mt-0.5 text-sm font-medium text-gray-500 sm:text-base">
                    <TypewriterText
                      phrases={TYPEWRITER_PHRASES}
                      triggered={triggered}
                      className="text-sm font-medium text-gray-500 sm:text-base"
                    />
                  </p>
                </div>
              </div>
            </ScrollReveal>

            {/* Pillar Cards — 2×2 grid */}
            <div className="mt-8 grid gap-4 sm:grid-cols-2 sm:gap-5">
              {PILLARS.map((pillar, i) => (
                <PillarCard
                  key={pillar.title}
                  pillar={pillar}
                  index={i}
                  triggered={triggered}
                />
              ))}
            </div>
          </div>

          {/* ── Right Column — Temple image + mission ── */}
          <ScrollReveal delay={0.25} direction="right" className="flex flex-col">
            {/* Image */}
            <motion.div
              className="relative flex-1 overflow-hidden rounded-2xl shadow-xl"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.4 }}
            >
              <img
                src="/images/justice.jpg"
                alt="Hindu For Justice"
                className="h-full min-h-[260px] w-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
              {/* Shimmer sweep — more frequent */}
              {triggered && (
                <motion.div
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(120deg, transparent 25%, rgba(255,255,255,0.2) 45%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0.2) 55%, transparent 75%)",
                    backgroundSize: "200% 100%",
                  }}
                  animate={{
                    backgroundPosition: ["-200% 0%", "200% 0%"],
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    repeatDelay: 1.5,
                    ease: "easeInOut",
                  }}
                />
              )}
              {/* Gradient overlay at bottom */}
              <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/30 to-transparent" />
            </motion.div>

            {/* Mission text — pulsing border */}
            <motion.div
              className="mt-4 rounded-2xl border border-gray-100 bg-white/90 p-5 shadow-sm backdrop-blur-sm sm:p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={
                triggered
                  ? {
                      opacity: 1,
                      y: 0,
                      borderColor: [
                        "rgba(229,229,229,1)",
                        "rgba(251,191,36,0.5)",
                        "rgba(229,229,229,1)",
                      ],
                      boxShadow: [
                        "0 1px 3px rgba(0,0,0,0.1)",
                        "0 4px 20px rgba(251,191,36,0.15)",
                        "0 1px 3px rgba(0,0,0,0.1)",
                      ],
                    }
                  : {}
              }
              transition={{
                opacity: {
                  duration: 0.7,
                  delay: 0.8,
                  ease: [0.16, 1, 0.3, 1],
                },
                y: {
                  duration: 0.7,
                  delay: 0.8,
                  ease: [0.16, 1, 0.3, 1],
                },
                borderColor: {
                  duration: 3,
                  delay: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
                boxShadow: {
                  duration: 3,
                  delay: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
              }}
            >
              <p className="text-sm leading-relaxed text-gray-600">
                Committed to fostering unity, justice, and cultural awareness
                through community-driven initiatives across India.
              </p>
              <motion.a
                href="#"
                className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-amber-600 transition-colors hover:text-amber-700"
                whileHover={{ x: 4 }}
                transition={{ duration: 0.2 }}
              >
                Read More
                <motion.span
                  animate={{ x: [0, 4, 0] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <ArrowRight className="h-4 w-4" />
                </motion.span>
              </motion.a>
            </motion.div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
