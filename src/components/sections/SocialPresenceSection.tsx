import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useInView } from "motion/react";
import {
  Heart,
  MessageCircle,
  Share2,
  Eye,
  Play,
  ExternalLink,
  ArrowRight,
} from "lucide-react";
import {
  ScrollReveal,
  ScrollRevealLine,
} from "@/components/motion/ScrollReveal";
import { AnimatedLucideIcon } from "@/components/AnimatedLucideIcon";

// ─── Platform Config ───

interface Platform {
  key: string;
  label: string;
  color: string;
  bgGradient: string;
  iconBg: string;
}

const PLATFORMS: Platform[] = [
  { key: "all", label: "All", color: "text-white", bgGradient: "from-amber-500 to-amber-600", iconBg: "" },
  { key: "twitter", label: "Twitter", color: "text-sky-500", bgGradient: "from-sky-500 to-sky-600", iconBg: "bg-sky-500" },
  { key: "instagram", label: "Instagram", color: "text-pink-500", bgGradient: "from-pink-500 via-purple-500 to-orange-400", iconBg: "bg-gradient-to-br from-pink-500 via-purple-500 to-orange-400" },
  { key: "facebook", label: "Facebook", color: "text-blue-600", bgGradient: "from-blue-600 to-blue-700", iconBg: "bg-blue-600" },
  { key: "youtube", label: "YouTube", color: "text-red-600", bgGradient: "from-red-600 to-red-700", iconBg: "bg-red-600" },
  { key: "linkedin", label: "LinkedIn", color: "text-blue-700", bgGradient: "from-blue-700 to-blue-800", iconBg: "bg-blue-700" },
];

// ─── SVG Platform Icons ───

function PlatformIcon({ platform, size = 18 }: { platform: string; size?: number }) {
  const s = size;
  switch (platform) {
    case "twitter":
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      );
    case "instagram":
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
        </svg>
      );
    case "facebook":
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      );
    case "youtube":
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor">
          <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      );
    case "linkedin":
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      );
    default:
      return null;
  }
}

// ─── Social Post Data ───

interface SocialPost {
  id: string;
  platform: string;
  handle: string;
  timeAgo: string;
  image: string;
  caption: string;
  likes: string;
  comments: string;
  shares: string;
  views?: string;
}

const SOCIAL_POSTS: SocialPost[] = [
  {
    id: "tw-1",
    platform: "twitter",
    handle: "@logsabha",
    timeAgo: "2h ago",
    image: "/images/social/twitter-post.jpg",
    caption: "Breaking: Lok Sabha passes landmark legislation on electoral reforms. A historic step towards strengthening democratic processes.",
    likes: "12.5K",
    comments: "2.3K",
    shares: "4.1K",
  },
  {
    id: "ig-1",
    platform: "instagram",
    handle: "@logsabha",
    timeAgo: "4h ago",
    image: "/images/social/instagram-post.jpg",
    caption: "Celebrating 75 years of Indian democracy! Swipe to see the journey of our parliamentary system.",
    likes: "28.7K",
    comments: "1.5K",
    shares: "892",
  },
  {
    id: "yt-1",
    platform: "youtube",
    handle: "@logsabha",
    timeAgo: "6h ago",
    image: "/images/social/youtube-post.jpg",
    caption: "Live Coverage: Parliament Session 2026 | Key Debates & Discussions",
    likes: "45.2K",
    comments: "8.9K",
    shares: "15.3K",
    views: "1.2M",
  },
  {
    id: "fb-1",
    platform: "facebook",
    handle: "LogSabha Official",
    timeAgo: "8h ago",
    image: "/images/social/facebook-post.jpg",
    caption: "India's democratic journey continues to inspire the world. Here's a look at the key policy decisions shaping our nation's future.",
    likes: "18.3K",
    comments: "3.2K",
    shares: "6.7K",
  },
  {
    id: "li-1",
    platform: "linkedin",
    handle: "LogSabha",
    timeAgo: "12h ago",
    image: "/images/social/linkedin-post.jpg",
    caption: "New report: How data analytics is transforming political campaigning in India. Read our latest insights on the intersection of technology and democracy.",
    likes: "9.8K",
    comments: "1.1K",
    shares: "3.4K",
  },
  {
    id: "tw-2",
    platform: "twitter",
    handle: "@logsabha",
    timeAgo: "1d ago",
    image: "/images/social/twitter-post-2.jpg",
    caption: "State election results are in! Our prediction model achieved 96% accuracy across all constituencies. Full analysis thread below.",
    likes: "15.1K",
    comments: "4.6K",
    shares: "7.2K",
  },
];

// ─── Slot Counter for Stats ───

function SlotDigit({ target, delay, triggered }: { target: number; delay: number; triggered: boolean }) {
  const sequence = [...Array.from({ length: 10 }, (_, i) => i), ...Array.from({ length: 10 }, (_, i) => i), target];
  const scrollTo = -(sequence.length - 1) * 1.15;

  return (
    <span className="relative inline-block overflow-hidden" style={{ height: "1.15em", width: "0.62em" }}>
      <motion.span
        className="flex flex-col items-center tabular-nums"
        initial={false}
        animate={triggered ? { y: `${scrollTo}em` } : { y: "0em" }}
        transition={{ delay, duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
      >
        {sequence.map((d, i) => (
          <span key={i} className="flex items-center justify-center leading-none" style={{ height: "1.15em" }}>
            {d}
          </span>
        ))}
      </motion.span>
    </span>
  );
}

function AnimatedStat({ value, className = "" }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { margin: "-40px" });
  const [triggered, setTriggered] = useState(false);

  useEffect(() => {
    if (isInView) setTriggered(true);
    else setTriggered(false);
  }, [isInView]);

  const chars = value.split("");

  return (
    <span ref={ref} className={`inline-flex items-baseline ${className}`}>
      {chars.map((char, i) => {
        if (/\d/.test(char)) {
          return <SlotDigit key={i} target={parseInt(char)} delay={i * 0.08} triggered={triggered} />;
        }
        return (
          <motion.span
            key={i}
            className="inline-block"
            initial={false}
            animate={triggered ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
            transition={{ delay: i * 0.08 + 0.2, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            {char}
          </motion.span>
        );
      })}
    </span>
  );
}

// ─── Platform Filter Tabs ───

function PlatformFilter({
  active,
  onChange,
}: {
  active: string;
  onChange: (key: string) => void;
}) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      {PLATFORMS.map((p) => {
        const isActive = active === p.key;
        return (
          <motion.button
            key={p.key}
            onClick={() => onChange(p.key)}
            className={`relative flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
              isActive
                ? "text-white shadow-lg"
                : "border border-gray-200 bg-white text-gray-600 hover:border-amber-300 hover:text-amber-600"
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isActive && (
              <motion.div
                layoutId="platform-pill"
                className={`absolute inset-0 rounded-full bg-gradient-to-r ${p.bgGradient}`}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-2">
              {p.key !== "all" && (
                <span className={isActive ? "text-white" : p.color}>
                  <PlatformIcon platform={p.key} size={16} />
                </span>
              )}
              {p.label}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}

// ─── Social Card ───

function SocialCard({ post, index }: { post: SocialPost; index: number }) {
  const platform = PLATFORMS.find((p) => p.key === post.platform)!;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      className="group w-full"
    >
      <motion.div
        className="relative overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:shadow-xl"
        whileHover={{ y: -6 }}
        transition={{ duration: 0.3 }}
      >
        {/* Card Header */}
        <div className="flex items-center justify-between px-4 pt-4 pb-3">
          <div className="flex items-center gap-3">
            <div className={`flex h-10 w-10 items-center justify-center rounded-full ${platform.iconBg} text-white shadow-md`}>
              <PlatformIcon platform={post.platform} size={18} />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">
                {post.platform.charAt(0).toUpperCase() + post.platform.slice(1)}
              </p>
              <p className="text-xs text-gray-400">{post.handle}</p>
            </div>
          </div>
          <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-[10px] font-medium text-gray-500">
            {post.timeAgo}
          </span>
        </div>

        {/* Image with overlay effects */}
        <div className="relative mx-3 overflow-hidden rounded-xl">
          <div className="aspect-[16/10] bg-gradient-to-br from-gray-100 to-gray-200">
            <img
              src={post.image}
              alt={post.caption}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              onError={(e) => {
                const target = e.currentTarget;
                target.style.display = "none";
              }}
            />
          </div>

          {/* Gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          {/* YouTube play button */}
          {post.platform === "youtube" && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={false}
            >
              <motion.div
                className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 shadow-xl backdrop-blur-sm"
                whileHover={{ scale: 1.15 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Play className="ml-1 h-6 w-6 text-red-600" fill="currentColor" />
              </motion.div>
            </motion.div>
          )}

          {/* Views badge for YouTube */}
          {post.views && (
            <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-sm">
              <Eye className="h-3 w-3" />
              <AnimatedStat value={post.views} className="text-[11px] font-semibold" />
            </div>
          )}

          {/* External link on hover */}
          <motion.div
            className="absolute right-3 bottom-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-gray-700 shadow-lg opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100"
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </motion.div>
        </div>

        {/* Caption */}
        <div className="px-4 pt-3 pb-1">
          <p className="line-clamp-2 text-sm leading-relaxed text-gray-700">
            {post.caption}
          </p>
        </div>

        {/* Engagement Stats */}
        <div className="flex items-center justify-between border-t border-gray-50 px-4 py-3 mt-2">
          <EngagementButton icon={Heart} value={post.likes} hoverColor="hover:text-red-500" />
          <EngagementButton icon={MessageCircle} value={post.comments} hoverColor="hover:text-blue-500" />
          <EngagementButton icon={Share2} value={post.shares} hoverColor="hover:text-emerald-500" />
        </div>
      </motion.div>
    </motion.div>
  );
}

function EngagementButton({
  icon: Icon,
  value,
  hoverColor,
}: {
  icon: typeof Heart;
  value: string;
  hoverColor: string;
}) {
  return (
    <motion.button
      className={`flex items-center gap-1.5 text-xs text-gray-400 transition-colors ${hoverColor}`}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <Icon className="h-4 w-4" />
      <AnimatedStat value={value} className="text-xs font-medium" />
    </motion.button>
  );
}

// ─── Aggregate Stats Bar ───

const AGGREGATE_STATS = [
  { label: "Followers", value: "2.4M", icon: "followers" },
  { label: "Engagement Rate", value: "8.7%", icon: "engagement" },
  { label: "Posts This Month", value: "342", icon: "posts" },
  { label: "Video Views", value: "18M", icon: "views" },
];

function StatsBar() {
  return (
    <ScrollReveal delay={0.3}>
      <div className="mx-auto mt-10 grid max-w-4xl grid-cols-2 gap-4 sm:grid-cols-4">
        {AGGREGATE_STATS.map((stat, i) => (
          <motion.div
            key={stat.label}
            className="relative overflow-hidden rounded-2xl border border-amber-200/60 bg-gradient-to-b from-white to-amber-50/30 px-4 py-5 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ margin: "-40px" }}
            transition={{ delay: 0.4 + i * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -3, borderColor: "rgba(245, 158, 11, 0.5)" }}
          >
            <div className="text-2xl font-extrabold text-amber-500">
              <AnimatedStat value={stat.value} className="text-2xl font-extrabold" />
            </div>
            <p className="mt-1 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
              {stat.label}
            </p>
          </motion.div>
        ))}
      </div>
    </ScrollReveal>
  );
}

// ─── Main Section ───

export function SocialPresenceSection() {
  const [activeFilter, setActiveFilter] = useState("all");

  const filteredPosts =
    activeFilter === "all"
      ? SOCIAL_POSTS
      : SOCIAL_POSTS.filter((p) => p.platform === activeFilter);

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-amber-50/60 via-orange-50/30 to-white py-20 sm:py-24 lg:py-32">
      {/* Background decorations */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div
          className="h-full w-full"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, rgb(245,158,11) 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* Floating gradient orbs */}
      <motion.div
        className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-amber-200/20 blur-3xl"
        animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-orange-200/20 blur-3xl"
        animate={{ x: [0, -20, 0], y: [0, 30, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 xl:px-12">
        {/* ── Section Header ── */}
        <div className="flex flex-col items-center text-center">
          <ScrollReveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-1.5 text-[11px] font-semibold tracking-wider text-amber-600 uppercase">
              <AnimatedLucideIcon icon={Share2} size={14} />
              Social Media
            </span>
          </ScrollReveal>

          <ScrollReveal delay={0.15}>
            <h2 className="mt-5 text-3xl font-extrabold text-gray-900 sm:text-4xl lg:text-5xl">
              Our{" "}
              <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
                Social Presence
              </span>
            </h2>
          </ScrollReveal>

          <ScrollRevealLine
            delay={0.3}
            className="mx-auto mt-3 h-[3px] w-12 rounded-full bg-amber-500"
          />

          <ScrollReveal delay={0.4}>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-gray-500">
              Stay connected with the latest political updates, analysis, and community discussions across our social channels.
            </p>
          </ScrollReveal>
        </div>

        {/* ── Aggregate Stats ── */}
        <StatsBar />

        {/* ── Platform Filter ── */}
        <ScrollReveal delay={0.5}>
          <div className="mt-12">
            <PlatformFilter active={activeFilter} onChange={setActiveFilter} />
          </div>
        </ScrollReveal>

        {/* ── Posts Grid ── */}
        <div className="mt-10">
          <AnimatePresence mode="popLayout">
            <motion.div
              key={activeFilter}
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
              layout
            >
              {filteredPosts.map((post, i) => (
                <SocialCard key={post.id} post={post} index={i} />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── CTA ── */}
        <ScrollReveal delay={0.2}>
          <div className="mt-14 flex justify-center">
            <motion.a
              href="#"
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-amber-500/25 transition-shadow hover:shadow-xl hover:shadow-amber-500/30"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
            >
              <motion.span
                className="pointer-events-none absolute inset-[-3px] rounded-full border-2 border-amber-400/60"
                animate={{ scale: [1, 1.06, 1], opacity: [0.7, 0, 0.7] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              />
              Follow Us Everywhere
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </motion.a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
