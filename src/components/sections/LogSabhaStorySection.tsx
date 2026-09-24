import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "motion/react";
import {
  SectionInViewProvider,
  useSectionInView,
} from "@/components/motion/InViewSection";
import { Users, FileText, TrendingUp } from "lucide-react";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { CountUp } from "@/components/motion/CountUp";
import { useLogSabhaStory } from "@/hooks/useLogSabhaStory";

// ─── Stat Card ───
// The slot-machine drum that spun each digit through 0–9 twice is gone; the
// client asked for the same plain count-up here as in the hero stats
// (UX feedback #6, #7 — this section was named).

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

  return (
    <motion.div
      ref={ref}
      className="flex flex-col items-center gap-1 rounded-xl border border-white/20 bg-white/10 px-4 py-3 backdrop-blur-md sm:px-6 sm:py-3"
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={triggered ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.7, delay: delay / 1000 + 0.3, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ scale: 1.05, borderColor: "rgba(255,153,51,0.5)" }}
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
        <CountUp value={Math.round(endValue)} active={active} duration={1400} />
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
  const shimmerInView = useSectionInView();
  return (
    <motion.span
      className={className}
      style={{
        backgroundImage:
          "linear-gradient(90deg, #ffffff 0%, #ffffff 30%, #ffc27a 45%, #ff9933 50%, #ffc27a 55%, #ffffff 70%, #ffffff 100%)",
        backgroundSize: "300% 100%",
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        WebkitTextFillColor: "transparent",
      }}
      animate={shimmerInView ? { backgroundPosition: ["200% center", "-200% center"] } : undefined}
      transition={{ duration: speed, repeat: Infinity, ease: "easeInOut" }}
    >
      {children}
    </motion.span>
  );
}

// ─── Quote Shimmer Border ───

function QuoteBox({
  triggered,
  quote,
  author,
  subheading,
  description,
}: {
  triggered: boolean;
  quote: string;
  author: string;
  subheading: string;
  description: string;
}) {
  return (
    <ScrollReveal delay={0.2}>
      <div className="relative mx-auto max-w-4xl overflow-hidden rounded-2xl border-2 border-amber-500/50 bg-black/40 px-4 py-4 backdrop-blur-md sm:px-6 sm:py-5">
        {/* Rotating border glow */}
        <motion.div
          className="pointer-events-none absolute inset-0 rounded-2xl"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(255,153,51,0.3), transparent)",
            backgroundSize: "200% 100%",
          }}
          animate={triggered ? { backgroundPosition: ["-200% 0%", "200% 0%"] } : undefined}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />

        {/* Quote */}
        <motion.p
          className="text-center text-xs leading-relaxed text-white/90 italic sm:text-sm lg:text-base"
          initial={{ opacity: 0 }}
          animate={triggered ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.5 }}
        >
          &ldquo;{quote}&rdquo;
          <span className="mt-1 block text-amber-400 not-italic">— {author}</span>
        </motion.p>

        {/* Subheading */}
        <motion.h3
          className="mt-3 text-center text-xs font-bold text-white sm:text-sm lg:text-base"
          initial={{ opacity: 0, y: 10 }}
          animate={triggered ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.8 }}
        >
          <ShimmerText speed={5}>{subheading}</ShimmerText>
        </motion.h3>

        {/* Description */}
        <motion.p
          className="mx-auto mt-3 max-w-3xl text-center text-sm leading-relaxed text-white/75 sm:text-base"
          initial={{ opacity: 0 }}
          animate={triggered ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 1.1 }}
        >
          {description}
        </motion.p>
      </div>
    </ScrollReveal>
  );
}

// ─── Main Section ───

// icon NAME (from the API) → lucide component
const STAT_ICONS: Record<string, typeof Users> = {
  users: Users,
  "file-text": FileText,
  "trending-up": TrendingUp,
};
const STAT_COLORS = ["#ff9933", "#fb923c", "#f97316"];

// Used until the API responds, or if it's unreachable.
const FALLBACK_STORY = {
  title: "The LogSabha Story",
  backgroundImage: "/images/LogSabhaStory.png",
  quote:
    "Non-violence has to be observed in thought, word and deed. The measure of our non-violence will be the measure of our success.",
  quoteAuthor: "Sardar Vallabhbhai Patel",
  subheading: "Beyond Predictions: Shaping the Future of Indian Politics",
  description:
    "The LogSabha's success goes beyond simply predicting Loksabha and state election results. We are committed to providing comprehensive political analysis, conducting in-depth surveys, and developing effective campaign strategies. This comprehensive approach has made us a trusted partner for political parties, media houses, and businesses alike.",
  stats: [
    { value: 10, suffix: "M+", label: "Citizens Empowered", icon: "users" },
    { value: 500, suffix: "+", label: "Data Reports", icon: "file-text" },
    { value: 95, suffix: "%", label: "Accuracy Rate", icon: "trending-up" },
  ],
};

export function LogSabhaStorySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.15 });
  const [triggered, setTriggered] = useState(false);
  const { data } = useLogSabhaStory();
  const story = data ?? FALLBACK_STORY;

  useEffect(() => {
    setTriggered(isInView);
  }, [isInView]);

  return (
    <SectionInViewProvider value={triggered}>
    <section ref={sectionRef} className="relative overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={story.backgroundImage}
          alt=""
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/55 to-black/80" />
      </div>

      {/* (four drifting particles retired — UX #20) */}

      {/* Content — same vertical rhythm as the Data Insights benchmark (UX #15) */}
      <div className="relative z-10 mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-10 lg:py-12">
        {/* Title */}
        <motion.h2
          className="mb-4 text-center text-2xl font-extrabold sm:text-3xl lg:text-4xl"
          initial={{ opacity: 0, y: 30 }}
          animate={triggered ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <ShimmerText className="text-2xl font-extrabold sm:text-3xl lg:text-4xl" speed={5}>
            {story.title}
          </ShimmerText>
        </motion.h2>

        {/* Quote Box */}
        <QuoteBox
          triggered={triggered}
          quote={story.quote}
          author={story.quoteAuthor}
          subheading={story.subheading}
          description={story.description}
        />

        {/* Stats */}
        <div className="mt-4 flex flex-wrap justify-center gap-3 sm:gap-4 lg:gap-6">
          {story.stats.map((stat: any, i: number) => (
            <SlotMachineStat
              key={stat.label}
              endValue={Number(stat.value)}
              suffix={stat.suffix}
              label={stat.label}
              icon={STAT_ICONS[stat.icon] ?? Users}
              iconColor={STAT_COLORS[i % STAT_COLORS.length]}
              triggered={triggered}
              delay={i * 200}
            />
          ))}
        </div>
      </div>
    </section>
    </SectionInViewProvider>
  );
}
