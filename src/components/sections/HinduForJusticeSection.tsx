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

// ─── Continuous Typewriter ───

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
    if (displayedCount >= chars.length) {
      const restartTimeout = setTimeout(() => {
        setDisplayedCount(0);
      }, 2500);
      return () => clearTimeout(restartTimeout);
    }
    const timeout = setTimeout(() => {
      setDisplayedCount((c) => c + 1);
    }, 55);
    return () => clearTimeout(timeout);
  }, [triggered, displayedCount, chars.length]);

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
      className="group relative flex flex-col rounded-2xl border border-gray-100 bg-white/90 p-5 shadow-sm backdrop-blur-sm transition-all duration-300 hover:border-amber-300 hover:shadow-lg sm:p-6"
      initial={{ opacity: 0, y: 30 }}
      animate={triggered ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.6,
        delay: 0.4 + index * 0.12,
        ease: [0.16, 1, 0.3, 1],
      }}
      whileHover={{ y: -5 }}
    >
      {/* Icon */}
      <motion.div
        className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-500"
        animate={
          triggered
            ? { scale: [1, 1.12, 1] }
            : {}
        }
        transition={{
          duration: 3,
          delay: 2 + index * 1.2,
          repeat: Infinity,
          repeatDelay: 3,
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

        {/* Animated ambient glow */}
        {triggered && (
          <>
            <motion.div
              className="absolute -top-32 -right-32 h-80 w-80 rounded-full bg-amber-300/15 blur-3xl"
              animate={{ x: [0, 25, 0], y: [0, -15, 0] }}
              transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute -bottom-32 -left-32 h-72 w-72 rounded-full bg-orange-200/10 blur-3xl"
              animate={{ x: [0, -20, 0], y: [0, 20, 0] }}
              transition={{
                duration: 15,
                delay: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </>
        )}
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
                      ? { rotate: [0, 2, -2, 0] }
                      : {}
                  }
                  transition={{
                    duration: 5,
                    delay: 3,
                    repeat: Infinity,
                    repeatDelay: 5,
                    ease: "easeInOut",
                  }}
                />
                <div>
                  <h2 className="text-2xl font-extrabold text-gray-900 sm:text-3xl lg:text-4xl">
                    Hindu For{" "}
                    <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
                      Justice
                    </span>
                  </h2>
                  <p className="mt-0.5 text-sm font-medium text-gray-500 sm:text-base">
                    <TypewriterText
                      text="Social Justice & Community Welfare Initiative"
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
              {/* Shimmer sweep on image */}
              {triggered && (
                <motion.div
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.15) 50%, transparent 70%)",
                    backgroundSize: "200% 100%",
                  }}
                  animate={{
                    backgroundPosition: ["-200% 0%", "200% 0%"],
                  }}
                  transition={{
                    duration: 3,
                    delay: 4,
                    repeat: Infinity,
                    repeatDelay: 4,
                    ease: "easeInOut",
                  }}
                />
              )}
              {/* Gradient overlay at bottom */}
              <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/30 to-transparent" />
            </motion.div>

            {/* Mission text */}
            <motion.div
              className="mt-4 rounded-2xl border border-gray-100 bg-white/90 p-5 shadow-sm backdrop-blur-sm sm:p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={triggered ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
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
                <ArrowRight className="h-4 w-4" />
              </motion.a>
            </motion.div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
