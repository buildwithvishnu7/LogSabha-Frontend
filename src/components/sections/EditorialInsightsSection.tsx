import { useRef, useEffect } from "react";
import { motion } from "motion/react";
import {
  Calendar,
  Clock,
  ArrowRight,
  TrendingUp,
  BookOpen,
} from "lucide-react";
import {
  ScrollReveal,
  ScrollRevealLine,
} from "@/components/motion/ScrollReveal";
import { LoopingIcon } from "@/components/LoopingIcon";
import BookIcon from "@/components/ui/book-icon";

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

// ─── Trending Badge ───

function TrendingBadge() {
  return (
    <motion.span
      className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-red-500 to-orange-500 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white shadow-md shadow-red-500/20"
      animate={{ scale: [1, 1.05, 1] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
    >
      <TrendingUp className="h-3 w-3" />
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
    transition: { delay: 0.3 + i * 0.12, duration: 0.6, ease: [0.16, 1, 0.3, 1] },
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
        viewport={{ margin: "200px", amount: 0.05 }}
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

          {/* Category badge */}
          <motion.span
            className={`absolute top-4 left-4 rounded-lg ${article.categoryColor} px-3 py-1.5 text-xs font-bold text-white shadow-lg`}
            custom={0}
            variants={textReveal}
          >
            {article.category}
          </motion.span>

          {/* Dark gradient at bottom */}
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/50 to-transparent" />

          {/* Date & read time overlay */}
          <motion.div
            className="absolute inset-x-0 bottom-0 flex items-center gap-4 px-5 pb-4"
            custom={1}
            variants={textReveal}
          >
            <span className="flex items-center gap-1.5 text-xs font-medium text-white/90">
              <Calendar className="h-3.5 w-3.5" />
              {article.date}
            </span>
            <span className="flex items-center gap-1.5 text-xs font-medium text-white/90">
              <Clock className="h-3.5 w-3.5" />
              {article.readTime}
            </span>
          </motion.div>
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
            className="mt-5 inline-flex w-fit items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-amber-500/20 transition-shadow hover:shadow-lg hover:shadow-amber-500/30"
            custom={4}
            variants={textReveal}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
          >
            Read More
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
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
      className="group flex cursor-pointer gap-4 rounded-xl border border-gray-100 bg-white p-3 shadow-sm transition-all duration-300 hover:border-amber-200 hover:shadow-md"
      whileHover={{ x: -4 }}
      transition={{ duration: 0.25 }}
    >
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
        <span
          className={`w-fit rounded-md ${article.categoryColor}/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider`}
          style={{
            color: `var(--cat-color)`,
          }}
        >
          <span className={`${article.categoryColor} bg-clip-text text-transparent`} style={{ WebkitBackgroundClip: "text" }}>
            {article.category}
          </span>
        </span>

        {/* Title */}
        <h4 className="mt-1.5 line-clamp-2 text-sm font-bold leading-snug text-gray-900 transition-colors group-hover:text-amber-600">
          {article.title}
        </h4>

        {/* Meta */}
        <div className="mt-2 flex items-center gap-3 text-[11px] text-gray-400">
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {article.date}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {article.readTime}
          </span>
        </div>
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
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-amber-50/20 to-white py-20 sm:py-24 lg:py-32">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-[0.025]">
        <div
          className="h-full w-full"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(245,158,11,0.4) 35px, rgba(245,158,11,0.4) 36px)",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 xl:px-12">
        {/* ── Header ── */}
        <div className="flex flex-col items-center text-center">
          <ScrollReveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-1.5 text-[11px] font-semibold tracking-wider text-amber-600 uppercase">
              <LoopingIcon icon={BookIcon} size={14} interval={4000} />
              Blog & Articles
            </span>
          </ScrollReveal>

          <ScrollReveal delay={0.15}>
            <h2 className="mt-5 text-3xl font-extrabold text-gray-900 sm:text-4xl lg:text-5xl">
              <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 bg-clip-text text-transparent">
                Editorial Insights
              </span>
            </h2>
          </ScrollReveal>

          <ScrollRevealLine
            delay={0.3}
            className="mx-auto mt-3 h-[3px] w-12 rounded-full bg-amber-500"
          />

          <ScrollReveal delay={0.4}>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-gray-500">
              In-depth analysis, research, and commentary on India's political
              landscape from our editorial team.
            </p>
          </ScrollReveal>
        </div>

        {/* ── Content Grid ── */}
        <motion.div
          className="mt-12 grid gap-6 lg:mt-16 lg:grid-cols-[1fr_420px] xl:grid-cols-[1fr_460px]"
          initial="hidden"
          whileInView="visible"
          viewport={{ margin: "200px", amount: 0.05 }}
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
