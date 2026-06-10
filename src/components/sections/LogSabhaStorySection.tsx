import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "motion/react";
import { Users, FileText, TrendingUp } from "lucide-react";
import { ScrollReveal } from "@/components/motion/ScrollReveal";

// ─── Slot Machine Drum Digit (spins through 0-9 twice then lands) ───

const SLOT_CYCLES = 2;
const DIGIT_H = 1.15;

function SlotDigit({
  target,
  delay,
  active,
}: {
  target: number;
  delay: number;
  active: boolean;
}) {
  const total = SLOT_CYCLES * 10 + target;
  const digits: number[] = [];
  for (let i = 0; i <= total; i++) digits.push(i % 10);

  return (
    <span
      className="relative inline-block overflow-hidden align-bottom"
      style={{
        height: `${DIGIT_H}em`,
        width: "0.65em",
        fontVariantNumeric: "tabular-nums",
      }}
    >
      <motion.span
        className="block will-change-transform"
        initial={{ y: 0 }}
        animate={
          active ? { y: `${-total * DIGIT_H}em` } : { y: 0 }
        }
        transition={{
          duration: 1.3 + total * 0.012,
          delay,
          ease: [0.16, 1, 0.3, 1],
        }}
      >
        {digits.map((d, i) => (
          <span
            key={i}
            className="block text-center"
            style={{ height: `${DIGIT_H}em`, lineHeight: `${DIGIT_H}em` }}
          >
            {d}
          </span>
        ))}
      </motion.span>
    </span>
  );
}

// ─── Slot Machine Stat Card ───

function SlotMachineStat({
  endValue,
  suffix,
  label,
  icon: Icon,
  iconColor,
  triggered,
  delay,
}: {
  endValue: number;
  suffix: string;
  label: string;
  icon: typeof Users;
  iconColor: string;
  triggered: boolean;
  delay: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, amount: 0.5 });
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (isInView && triggered) {
      setActive(false);
      requestAnimationFrame(() => setActive(true));
    } else {
      setActive(false);
    }
  }, [isInView, triggered]);

  const formatted = String(Math.round(endValue));
  const chars = formatted.split("");

  return (
    <motion.div
      ref={ref}
      className="flex flex-col items-center gap-1 rounded-xl border border-white/20 bg-white/10 px-4 py-3 backdrop-blur-md sm:px-6 sm:py-3"
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={triggered ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.7, delay: delay / 1000 + 0.3, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ scale: 1.05, borderColor: "rgba(245, 158, 11, 0.5)" }}
    >
      <motion.div
        className="flex h-8 w-8 items-center justify-center rounded-full"
        style={{ backgroundColor: `${iconColor}25` }}
        animate={triggered ? { scale: [1, 1.15, 1] } : {}}
        transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 2, ease: "easeInOut" }}
      >
        <Icon className="h-4 w-4" style={{ color: iconColor }} />
      </motion.div>
      <div className="flex items-baseline text-xl font-extrabold text-amber-400 sm:text-2xl">
        {chars.map((ch, i) =>
          /\d/.test(ch) ? (
            <SlotDigit
              key={`${i}-${ch}`}
              target={parseInt(ch)}
              delay={delay / 1000 + i * 0.08}
              active={active}
            />
          ) : (
            <span key={`${i}-${ch}`} className="inline-block w-[0.25em] text-center">
              {ch}
            </span>
          )
        )}
        <span className="ml-0.5">{suffix}</span>
      </div>
      <span className="text-[10px] font-semibold tracking-wider text-white/70 uppercase sm:text-xs">
        {label}
      </span>
    </motion.div>
  );
}

// ─── Continuous Shimmer Text ───

function ShimmerText({
  children,
  className,
  speed = 4,
}: {
  children: React.ReactNode;
  className?: string;
  speed?: number;
}) {
  return (
    <motion.span
      className={className}
      style={{
        backgroundImage:
          "linear-gradient(90deg, #ffffff 0%, #ffffff 30%, #fbbf24 45%, #f59e0b 50%, #fbbf24 55%, #ffffff 70%, #ffffff 100%)",
        backgroundSize: "300% 100%",
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        WebkitTextFillColor: "transparent",
      }}
      animate={{ backgroundPosition: ["200% center", "-200% center"] }}
      transition={{ duration: speed, repeat: Infinity, ease: "easeInOut" }}
    >
      {children}
    </motion.span>
  );
}

// ─── Quote Shimmer Border ───

function QuoteBox({ triggered }: { triggered: boolean }) {
  return (
    <ScrollReveal delay={0.2}>
      <div className="relative mx-auto max-w-4xl overflow-hidden rounded-2xl border-2 border-amber-500/50 bg-black/40 px-4 py-4 backdrop-blur-md sm:px-6 sm:py-5">
        {/* Rotating border glow */}
        <motion.div
          className="pointer-events-none absolute inset-0 rounded-2xl"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(245,158,11,0.3), transparent)",
            backgroundSize: "200% 100%",
          }}
          animate={{ backgroundPosition: ["-200% 0%", "200% 0%"] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />

        {/* Quote */}
        <motion.p
          className="text-center text-xs leading-relaxed text-white/90 italic sm:text-sm lg:text-base"
          initial={{ opacity: 0 }}
          animate={triggered ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.5 }}
        >
          &ldquo;Non-violence has to be observed in thought, word and deed. The measure of our
          non-violence will be the measure of our success.&rdquo;
          <span className="mt-1 block text-amber-400 not-italic">
            — Sardar Vallabhbhai Patel
          </span>
        </motion.p>

        {/* Subheading */}
        <motion.h3
          className="mt-3 text-center text-xs font-bold text-white sm:text-sm lg:text-base"
          initial={{ opacity: 0, y: 10 }}
          animate={triggered ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.8 }}
        >
          <ShimmerText speed={5}>
            Beyond Predictions: Shaping the Future of Indian Politics
          </ShimmerText>
        </motion.h3>

        {/* Description */}
        <motion.p
          className="mx-auto mt-2 max-w-3xl text-center text-[10px] leading-relaxed text-white/75 sm:text-xs lg:text-sm"
          initial={{ opacity: 0 }}
          animate={triggered ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 1.1 }}
        >
          The LogSabha&apos;s success goes beyond simply predicting Loksabha and state election
          results. We are committed to providing comprehensive political analysis, conducting
          in-depth surveys, and developing effective campaign strategies. This comprehensive
          approach has made us a trusted partner for political parties, media houses, and
          businesses alike.
        </motion.p>
      </div>
    </ScrollReveal>
  );
}

// ─── Main Section ───

const STATS = [
  { value: 10, suffix: "M+", label: "Citizens Empowered", icon: Users, color: "#f59e0b" },
  { value: 500, suffix: "+", label: "Data Reports", icon: FileText, color: "#fb923c" },
  { value: 95, suffix: "%", label: "Accuracy Rate", icon: TrendingUp, color: "#f97316" },
];

export function LogSabhaStorySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.15 });
  const [triggered, setTriggered] = useState(false);

  useEffect(() => {
    setTriggered(isInView);
  }, [isInView]);

  return (
    <section ref={sectionRef} className="relative overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src="/images/LogSabhaStory.png"
          alt=""
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/55 to-black/80" />
      </div>

      {/* Floating ambient particles */}
      {triggered && (
        <>
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="pointer-events-none absolute rounded-full bg-amber-400/10"
              style={{
                width: 4 + i * 3,
                height: 4 + i * 3,
                left: `${8 + i * 11}%`,
                top: `${15 + (i % 4) * 20}%`,
              }}
              animate={{
                y: [0, -15 - i * 4, 0],
                x: [0, i % 2 === 0 ? 12 : -12, 0],
                opacity: [0.15, 0.4, 0.15],
              }}
              transition={{
                duration: 5 + i * 0.7,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.5,
              }}
            />
          ))}
        </>
      )}

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-10 lg:py-14">
        {/* Title */}
        <motion.h2
          className="mb-4 text-center text-2xl font-extrabold sm:text-3xl lg:text-4xl"
          initial={{ opacity: 0, y: 30 }}
          animate={triggered ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <ShimmerText className="text-2xl font-extrabold sm:text-3xl lg:text-4xl" speed={5}>
            The LogSabha Story
          </ShimmerText>
        </motion.h2>

        {/* Quote Box */}
        <QuoteBox triggered={triggered} />

        {/* Stats */}
        <div className="mt-4 flex flex-wrap justify-center gap-3 sm:gap-4 lg:gap-6">
          {STATS.map((stat, i) => (
            <SlotMachineStat
              key={stat.label}
              endValue={stat.value}
              suffix={stat.suffix}
              label={stat.label}
              icon={stat.icon}
              iconColor={stat.color}
              triggered={triggered}
              delay={i * 200}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
