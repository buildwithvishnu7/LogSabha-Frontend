import { useRef, useEffect, useState, useMemo } from "react";
import { motion, useInView } from "motion/react";
import {
  TrendingUp,
} from "lucide-react";
import lottieWeb from "lottie-web";
import {
  ScrollReveal,
  ScrollRevealLine,
} from "@/components/motion/ScrollReveal";

// ─── Inline Lottie Icon ───
function LottieIcon({ src, size = 18, color = "#ffffff" }: { src: string; size?: number; color?: string }) {
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
      const anim = lottieWeb.loadAnimation({ container: el, renderer: "svg", loop: true, autoplay: true, animationData: json });
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

interface Article {
  id: string;
  title: string;
  excerpt?: string;
  image: string;
  category: string;
  categoryColor: string;
  date: string;
  readTime: string;
  trending?: boolean;
}

const FEATURED_ARTICLE: Article = {
  id: "featured-1",
  title: "The Evolution of Coalition Politics in Modern India",
  excerpt:
    "An in-depth analysis of how coalition governments have shaped India's political landscape and the emerging trends in regional party alliances that are redefining democratic dynamics.",
  image: "/images/editorial/featured.jpg",
  category: "Featured Analysis",
  categoryColor: "bg-amber-500",
  date: "April 20, 2026",
  readTime: "8 min read",
};

const SIDEBAR_ARTICLES: Article[] = [
  {
    id: "side-1",
    title: "Regional Politics: The Rise of State-Level Movements",
    image: "/images/editorial/regional.jpg",
    category: "Analysis",
    categoryColor: "bg-amber-500",
    date: "April 18, 2026",
    readTime: "5 min",
    trending: true,
  },
  {
    id: "side-2",
    title: "Digital Campaigning: How Social Media Changed Elections",
    image: "/images/editorial/digital.jpg",
    category: "Technology",
    categoryColor: "bg-emerald-500",
    date: "April 15, 2026",
    readTime: "6 min",
  },
  {
    id: "side-3",
    title: "Voter Demographics: Understanding Gen Z Engagement",
    image: "/images/editorial/demographics.jpg",
    category: "Research",
    categoryColor: "bg-purple-500",
    date: "April 12, 2026",
    readTime: "7 min",
    trending: true,
  },
  {
    id: "side-4",
    title: "Parliamentary Procedures: A Deep Dive into Legislative Process",
    image: "/images/editorial/parliament.jpg",
    category: "Education",
    categoryColor: "bg-sky-500",
    date: "April 10, 2026",
    readTime: "9 min",
  },
  {
    id: "side-5",
    title: "Economic Policy Impact: Budget Analysis Across States",
    image: "/images/editorial/economy.jpg",
    category: "Economy",
    categoryColor: "bg-rose-500",
    date: "April 8, 2026",
    readTime: "6 min",
    trending: true,
  },
  {
    id: "side-6",
    title: "Women in Politics: Breaking Barriers in Indian Democracy",
    image: "/images/editorial/women.jpg",
    category: "Society",
    categoryColor: "bg-pink-500",
    date: "April 5, 2026",
    readTime: "5 min",
  },
  {
    id: "side-7",
    title: "Rural Governance: Panchayati Raj and Grassroots Democracy",
    image: "/images/editorial/rural.jpg",
    category: "Governance",
    categoryColor: "bg-teal-500",
    date: "April 3, 2026",
    readTime: "8 min",
    trending: true,
  },
];

// ─── Continuous Looping Typewriter ───

const TYPEWRITER_PHRASES = [
  "In-depth analysis, research, and commentary on India's political landscape from our editorial team.",
  "Exploring the forces shaping India's democracy through expert perspectives and data-driven insights.",
  "Bridging policy, politics, and public discourse with thoughtful editorial coverage.",
  "Your window into the evolving story of Indian governance and democratic progress.",
];

function LoopingTypewriter({ className }: { className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const isInView = useInView(ref, { once: false, amount: 0.5 });
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [displayedCount, setDisplayedCount] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const currentPhrase = TYPEWRITER_PHRASES[phraseIndex];
  const chars = useMemo(() => [...currentPhrase], [currentPhrase]);

  useEffect(() => {
    if (!isInView) return;

    if (!isDeleting && displayedCount >= chars.length) {
      const timeout = setTimeout(() => setIsDeleting(true), 2200);
      return () => clearTimeout(timeout);
    }

    if (isDeleting && displayedCount === 0) {
      setIsDeleting(false);
      setPhraseIndex((i) => (i + 1) % TYPEWRITER_PHRASES.length);
      return;
    }

    const speed = isDeleting ? 20 : 35;
    const timeout = setTimeout(() => {
      setDisplayedCount((c) => c + (isDeleting ? -1 : 1));
    }, speed);
    return () => clearTimeout(timeout);
  }, [isInView, displayedCount, chars.length, isDeleting]);

  return (
    <p ref={ref} className={className}>
      <span>{chars.slice(0, displayedCount).join("")}</span>
      {isInView && (
        <motion.span
          className="inline-block h-[1em] w-[2px] translate-y-[2px] bg-amber-500"
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
        />
      )}
    </p>
  );
}

// ─── Floating Particles ───

const PARTICLES = Array.from({ length: 8 }, (_, i) => ({
  id: i,
  size: 3 + (i % 3) * 2,
  left: `${10 + i * 11}%`,
  top: `${15 + (i % 4) * 20}%`,
  duration: 6 + (i % 3) * 2,
  delay: i * 0.8,
}));

function FloatingParticles() {
  return (
    <>
      {PARTICLES.map((p) => (
        <motion.div
          key={p.id}
          className="pointer-events-none absolute rounded-full bg-amber-400/20"
          style={{
            width: p.size,
            height: p.size,
            left: p.left,
            top: p.top,
          }}
          animate={{
            y: [0, -20, 0],
            x: [0, 10, 0],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </>
  );
}

// ─── Trending Badge ───

function TrendingBadge() {
  return (
    <motion.span
      className="relative inline-flex items-center gap-1 overflow-hidden rounded-full bg-gradient-to-r from-red-500 to-orange-500 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white shadow-md shadow-red-500/20"
      animate={{ scale: [1, 1.06, 1] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
    >
      {/* Shimmer sweep */}
      <motion.span
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.35) 50%, transparent 70%)",
          backgroundSize: "200% 100%",
        }}
        animate={{ backgroundPosition: ["-100% 0%", "200% 0%"] }}
        transition={{ duration: 2, repeat: Infinity, repeatDelay: 2, ease: "easeInOut" }}
      />
      {/* Glow ring */}
      <motion.span
        className="pointer-events-none absolute inset-[-2px] rounded-full border border-red-400/60"
        animate={{ scale: [1, 1.15, 1], opacity: [0.6, 0, 0.6] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.span
        animate={{ rotate: [0, -15, 15, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1.5, ease: "easeInOut" }}
      >
        <TrendingUp className="h-3 w-3" />
      </motion.span>
      Trending
    </motion.span>
  );
}

// ─── Featured Card (Left) ───

const textReveal = {
  hidden: { opacity: 0, y: 20, filter: "blur(4px)" },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { delay: 0.3 + i * 0.12, duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

function FeaturedCard({ article }: { article: Article }) {
  return (
      <motion.div
        className="group relative flex h-[480px] flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-shadow duration-300 hover:shadow-xl lg:h-[580px]"
        whileHover={{ y: -4 }}
        transition={{ duration: 0.3 }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.2 }}
      >
        {/* Image */}
        <div className="relative flex-1 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-100 via-orange-50 to-amber-50">
            <img
              src={article.image}
              alt={article.title}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          </div>

          {/* Shimmer sweep overlay */}
          <motion.div
            className="pointer-events-none absolute inset-0 z-10"
            style={{
              background:
                "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.18) 50%, transparent 60%)",
              backgroundSize: "200% 100%",
            }}
            animate={{ backgroundPosition: ["-100% 0%", "200% 0%"] }}
            transition={{
              duration: 3,
              delay: 2,
              repeat: Infinity,
              repeatDelay: 5,
              ease: "easeInOut",
            }}
          />

          {/* Category badge */}
          <motion.span
            className={`absolute top-4 left-4 z-20 overflow-hidden rounded-lg ${article.categoryColor} px-3 py-1.5 text-xs font-bold text-white shadow-lg`}
            custom={0}
            variants={textReveal}
          >
            {/* Shimmer sweep */}
            <motion.span
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.3) 50%, transparent 70%)",
                backgroundSize: "200% 100%",
              }}
              animate={{ backgroundPosition: ["-100% 0%", "200% 0%"] }}
              transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 3, ease: "easeInOut" }}
            />
            {/* Glow pulse */}
            <motion.span
              className="pointer-events-none absolute inset-[-2px] rounded-lg border border-white/40"
              animate={{ scale: [1, 1.08, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            />
            {article.category}
          </motion.span>

          {/* Dark gradient at bottom */}
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/50 to-transparent" />

          {/* Date & read time overlay */}
          {/* <motion.div
            className="absolute inset-x-0 bottom-0 flex items-center gap-4 px-5 pb-4"
            custom={1}
            variants={textReveal}
          >
            <span className="flex items-center gap-1.5 text-xs font-medium text-white/90">
              <motion.span
                className="inline-flex"
                whileHover={{ rotate: [0, -10, 10, 0], scale: 1.2 }}
                transition={{ duration: 0.4 }}
              >
                <Calendar className="h-3.5 w-3.5" />
              </motion.span>
              {article.date}
            </span>
            <span className="flex items-center gap-1.5 text-xs font-medium text-white/90">
              <motion.span
                className="inline-flex"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              >
                <Clock className="h-3.5 w-3.5" />
              </motion.span>
              {article.readTime}
            </span>
          </motion.div> */}
        </div>

        {/* Content */}
        <div className="flex flex-col p-5 lg:p-6">
          <motion.h3
            className="text-xl font-extrabold leading-snug text-gray-900 transition-colors group-hover:text-amber-600 lg:text-2xl"
            custom={2}
            variants={textReveal}
          >
            {article.title}
          </motion.h3>
          <motion.p
            className="mt-3 text-sm leading-relaxed text-gray-500"
            custom={3}
            variants={textReveal}
          >
            {article.excerpt}
          </motion.p>

          {/* Read More */}
          <motion.a
            href="#"
            className="relative mt-5 inline-flex w-fit items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-amber-500/20 transition-shadow hover:shadow-lg hover:shadow-amber-500/30"
            custom={4}
            variants={textReveal}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
          >
            <motion.span
              className="pointer-events-none absolute inset-[-3px] rounded-xl border-2 border-amber-500/70"
              style={{ boxShadow: "0 0 8px rgba(245,158,11,0.25)" }}
              animate={{ scale: [1, 1.06, 1], opacity: [0.8, 0, 0.8] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.span
              className="pointer-events-none absolute inset-[-1px] rounded-xl border-2 border-amber-500/50"
              animate={{ scale: [1, 1.03, 1], opacity: [1, 0.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
            />
            Read More
            <LottieIcon src="/lottie/fast-forward.json" size={22} color="#ffffff" />
          </motion.a>
        </div>
      </motion.div>
  );
}

// ─── Sidebar Article Card ───

function SidebarCard({
  article,
  index,
}: {
  article: Article;
  index: number;
}) {
  return (
    <motion.div
      className="group relative flex cursor-pointer gap-4 overflow-hidden rounded-xl border border-gray-100 bg-white p-3 shadow-sm transition-all duration-300 hover:border-amber-200 hover:shadow-md"
      whileHover={{ x: -4, scale: 1.01 }}
      transition={{ duration: 0.25 }}
    >
      {/* Shimmer sweep on hover */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "linear-gradient(105deg, transparent 40%, rgba(245,158,11,0.08) 50%, transparent 60%)",
          backgroundSize: "200% 100%",
        }}
        animate={{ backgroundPosition: ["-100% 0%", "200% 0%"] }}
        transition={{ duration: 2, repeat: Infinity, repeatDelay: 1, ease: "easeInOut" }}
      />
      {/* Thumbnail */}
      <div className="relative flex-shrink-0 overflow-hidden rounded-lg">
        <div className="h-24 w-24 bg-gradient-to-br from-amber-100 via-orange-50 to-amber-50 sm:h-28 sm:w-28">
          <img
            src={article.image}
            alt={article.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        </div>

        {/* Trending badge */}
        {article.trending && (
          <div className="absolute -top-0.5 -left-0.5">
            <TrendingBadge />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex min-w-0 flex-1 flex-col justify-center">
        {/* Category */}
        <motion.span
          className={`relative w-fit overflow-hidden rounded-md ${article.categoryColor}/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider`}
          whileHover={{ scale: 1.08 }}
          transition={{ type: "spring", stiffness: 400, damping: 15 }}
        >
          {/* Shimmer sweep on badge */}
          <motion.span
            className="pointer-events-none absolute inset-0 rounded-md"
            style={{
              background:
                "linear-gradient(105deg, transparent 30%, rgba(245,158,11,0.15) 50%, transparent 70%)",
              backgroundSize: "200% 100%",
            }}
            animate={{ backgroundPosition: ["-100% 0%", "200% 0%"] }}
            transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 4, ease: "easeInOut", delay: index * 0.3 }}
          />
          <span className={`relative ${article.categoryColor} bg-clip-text text-transparent`} style={{ WebkitBackgroundClip: "text" }}>
            {article.category}
          </span>
        </motion.span>

        {/* Title */}
        <h4 className="mt-1.5 line-clamp-2 text-sm font-bold leading-snug text-gray-900 transition-colors group-hover:text-amber-600">
          {article.title}
        </h4>

        {/* Meta */}
        {/* <div className="mt-2 flex items-center gap-3 text-[11px] text-gray-400">
          <span className="flex items-center gap-1">
            <motion.span
              className="inline-flex"
              whileHover={{ rotate: [0, -10, 10, 0], scale: 1.2 }}
              transition={{ duration: 0.4 }}
            >
              <Calendar className="h-3 w-3 transition-colors group-hover:text-amber-500" />
            </motion.span>
            {article.date}
          </span>
          <span className="flex items-center gap-1">
            <motion.span
              className="inline-flex"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            >
              <Clock className="h-3 w-3 transition-colors group-hover:text-amber-500" />
            </motion.span>
            {article.readTime}
          </span>
        </div> */}
      </div>
    </motion.div>
  );
}

// ─── Auto-Scrolling Sidebar ───

function ScrollingSidebar({ articles }: { articles: Article[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isPausedRef = useRef(false);
  const resumeTimerRef = useRef<number>(0);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const id = setInterval(() => {
      if (!isPausedRef.current && el) {
        el.scrollTop += 0.8;
        const half = el.scrollHeight / 2;
        if (el.scrollTop >= half) {
          el.scrollTop -= half;
        }
      }
    }, 30);

    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();

      isPausedRef.current = true;
      el.scrollTop += e.deltaY;

      const half = el.scrollHeight / 2;
      if (el.scrollTop >= half) el.scrollTop -= half;
      if (el.scrollTop < 0) el.scrollTop += half;

      window.clearTimeout(resumeTimerRef.current);
      resumeTimerRef.current = window.setTimeout(() => {
        isPausedRef.current = false;
      }, 3000);
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const onTouchStart = () => {
      isPausedRef.current = true;
      window.clearTimeout(resumeTimerRef.current);
    };
    const onTouchEnd = () => {
      resumeTimerRef.current = window.setTimeout(() => {
        isPausedRef.current = false;
      }, 3000);
    };

    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchend", onTouchEnd);
    };
  }, []);

  const doubled = [...articles, ...articles];

  return (
    <div className="relative h-full">
      {/* Top fade */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-6 rounded-t-2xl bg-gradient-to-b from-white to-transparent" />
      {/* Bottom fade */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-12 rounded-b-2xl bg-gradient-to-t from-white to-transparent" />

      <div
        ref={scrollRef}
        className="scrollbar-hide h-full overflow-y-auto"
        style={{ overscrollBehavior: "contain" }}
      >
        <div className="flex flex-col gap-3 py-3">
          {doubled.map((article, i) => (
            <SidebarCard
              key={`${article.id}-${i}`}
              article={article}
              index={i % articles.length}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Main Section ───

export function EditorialInsightsSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-amber-50/20 to-white py-4 sm:py-6 lg:py-8">
      {/* Grid background image */}
      <div className="pointer-events-none absolute inset-0">
        <img
          src="/images/editorial-bg.jpg"
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover opacity-10"
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

      {/* Floating ambient orbs */}
      <motion.div
        className="pointer-events-none absolute top-16 left-[8%] h-52 w-52 rounded-full bg-amber-400/[0.05] blur-[80px]"
        animate={{ x: [0, 25, 0], y: [0, -18, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="pointer-events-none absolute right-[8%] bottom-24 h-44 w-44 rounded-full bg-orange-400/[0.05] blur-[80px]"
        animate={{ x: [0, -20, 0], y: [0, 15, 0] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 2.5 }}
      />
      <motion.div
        className="pointer-events-none absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-300/[0.03] blur-[100px]"
        animate={{ scale: [1, 1.15, 1], opacity: [0.03, 0.06, 0.03] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />

      {/* Floating particles */}
      <FloatingParticles />

      <div className="relative mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 xl:px-12">
        {/* ── Header ── */}
        <div className="flex flex-col items-center text-center">
          <ScrollReveal delay={0.15}>
            <h2 className="overflow-visible pb-1 text-2xl font-extrabold leading-tight text-gray-900 sm:text-3xl lg:text-4xl">
              <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 bg-clip-text text-transparent">
                Editorial Insights
              </span>
            </h2>
          </ScrollReveal>

          <ScrollRevealLine
            delay={0.3}
            className="mx-auto mt-2 h-[3px] w-12 rounded-full bg-amber-500"
          />

          <LoopingTypewriter className="mt-2 max-w-xl text-xs leading-relaxed text-gray-500 sm:text-sm lg:text-base" />
        </div>

        {/* ── Content Grid ── */}
        <motion.div
          className="mt-5 grid gap-5 lg:mt-6 lg:grid-cols-[1fr_420px] xl:grid-cols-[1fr_460px]"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.15, delayChildren: 0.1 },
            },
          }}
        >
          {/* Left: Featured Article */}
          <motion.div
            variants={{
              hidden: { opacity: 0, x: -40 },
              visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
            }}
          >
            <FeaturedCard article={FEATURED_ARTICLE} />
          </motion.div>

          {/* Right: Scrollable Sidebar */}
          <motion.div
            variants={{
              hidden: { opacity: 0, x: 40 },
              visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
            }}
          >
            <div className="h-[480px] overflow-hidden rounded-2xl border border-gray-100 bg-white p-2 shadow-sm lg:h-[580px]">
              <ScrollingSidebar articles={SIDEBAR_ARTICLES} />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
