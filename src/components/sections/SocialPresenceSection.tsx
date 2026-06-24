import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useInView } from "motion/react";
import {
  SectionInViewProvider,
  useInViewSection,
  useSectionInView,
} from "@/components/motion/InViewSection";
import {
  Heart,
  MessageCircle,
  Share2,
  Eye,
  Play,
  ExternalLink,
} from "lucide-react";
import {
  ScrollReveal,
  ScrollRevealLine,
} from "@/components/motion/ScrollReveal";

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
  { key: "facebook", label: "Facebook", color: "text-[#1877F2]", bgGradient: "from-[#1877F2] to-[#0d65d9]", iconBg: "bg-[#1877F2]" },
  { key: "youtube", label: "YouTube", color: "text-red-600", bgGradient: "from-red-600 to-red-700", iconBg: "bg-red-600" },
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
  link?: string;
}

const SOCIAL_POSTS: SocialPost[] = [
  // ── Twitter (3 posts) ──
  {
    id: "tw-1",
    platform: "twitter",
    handle: "@TLogsabha",
    timeAgo: "2w ago",
    image: "/images/social/twitter-post.jpg",
    caption: "दाऊद के पैसों पर पलने वाले भांड बॉलीवुड और OTT प्लेटफॉर्म्स का सनातन के खिलाफ डरावना 'सांस्कृतिक जिहाद' #Bollywood #SanatanDharma",
    likes: "12.5K",
    comments: "2.3K",
    shares: "4.1K",
    link: "https://x.com/TLogsabha/status/2058258784301306066",
  },
  {
    id: "tw-2",
    platform: "twitter",
    handle: "@TLogsabha",
    timeAgo: "1d ago",
    image: "/images/social/twitter-post.jpg",
    caption: "State election results are in! Our prediction model achieved 96% accuracy across all constituencies. Full analysis thread below.",
    likes: "15.1K",
    comments: "4.6K",
    shares: "7.2K",
    link: "https://x.com/TLogsabha",
  },
  {
    id: "tw-3",
    platform: "twitter",
    handle: "@TLogsabha",
    timeAgo: "2d ago",
    image: "/images/social/twitter-post.jpg",
    caption: "Exit polls vs actual results — a deep dive into what the data got right and where the models diverged. Thread below.",
    likes: "8.9K",
    comments: "1.8K",
    shares: "3.5K",
    link: "https://x.com/TLogsabha",
  },
  // ── Instagram (3 posts) ──
  {
    id: "ig-1",
    platform: "instagram",
    handle: "@logsabha",
    timeAgo: "1w ago",
    image: "/images/social/instagram-post.jpg",
    caption: "Celebrating 75 years of Indian democracy! Swipe to see the journey of our parliamentary system.",
    likes: "28.7K",
    comments: "1.5K",
    shares: "892",
    link: "https://www.instagram.com/p/DYsSIkIGOeN/",
  },
  {
    id: "ig-2",
    platform: "instagram",
    handle: "@logsabha",
    timeAgo: "1d ago",
    image: "/images/social/instagram-post.jpg",
    caption: "Behind the scenes at LogSabha HQ — our analysts breaking down real-time constituency data during election night.",
    likes: "22.3K",
    comments: "2.1K",
    shares: "1.3K",
    link: "https://www.instagram.com/logsabha/",
  },
  {
    id: "ig-3",
    platform: "instagram",
    handle: "@logsabha",
    timeAgo: "3d ago",
    image: "/images/social/instagram-post.jpg",
    caption: "Infographic: How India votes — a visual breakdown of voter demographics across 543 constituencies.",
    likes: "31.5K",
    comments: "3.4K",
    shares: "2.7K",
    link: "https://www.instagram.com/logsabha/",
  },
  // ── YouTube (3 posts) ──
  {
    id: "yt-1",
    platform: "youtube",
    handle: "@logsabha",
    timeAgo: "1w ago",
    image: "/images/social/youtube-post.jpg",
    caption: "Live Coverage: Parliament Session 2026 | Key Debates & Discussions",
    likes: "45.2K",
    comments: "8.9K",
    shares: "15.3K",
    views: "1.2M",
    link: "https://youtu.be/iACoQ3s_g5M",
  },
  {
    id: "yt-2",
    platform: "youtube",
    handle: "@logsabha",
    timeAgo: "2d ago",
    image: "/images/social/youtube-post.jpg",
    caption: "Election Analysis 2026: State-by-State Breakdown | LogSabha Special Report",
    likes: "32.1K",
    comments: "5.4K",
    shares: "9.8K",
    views: "890K",
    link: "https://www.youtube.com/@logsabha",
  },
  {
    id: "yt-3",
    platform: "youtube",
    handle: "@logsabha",
    timeAgo: "5d ago",
    image: "/images/social/youtube-post.jpg",
    caption: "How Data Analytics is Revolutionizing Indian Elections — Documentary",
    likes: "56.7K",
    comments: "11.2K",
    shares: "21.4K",
    views: "2.5M",
    link: "https://www.youtube.com/@logsabha",
  },
  // ── Facebook (3 posts) ──
  {
    id: "fb-1",
    platform: "facebook",
    handle: "LogSabha",
    timeAgo: "3d ago",
    image: "/images/social/twitter-post.jpg",
    caption: "संसद के मानसून सत्र में उठे प्रमुख मुद्दे — किसान बिल से लेकर रक्षा बजट तक, पूरी बहस का विश्लेषण पढ़ें LogSabha पर।",
    likes: "18.4K",
    comments: "3.2K",
    shares: "5.6K",
    link: "https://www.facebook.com/logsabha",
  },
  {
    id: "fb-2",
    platform: "facebook",
    handle: "LogSabha",
    timeAgo: "1w ago",
    image: "/images/social/twitter-post.jpg",
    caption: "India's democratic journey — from the first general election in 1951 to the world's largest digital voting system. A visual timeline.",
    likes: "24.1K",
    comments: "4.7K",
    shares: "8.3K",
    link: "https://www.facebook.com/logsabha",
  },
  {
    id: "fb-3",
    platform: "facebook",
    handle: "LogSabha",
    timeAgo: "5d ago",
    image: "/images/social/twitter-post.jpg",
    caption: "क्या आप जानते हैं? भारत की संसद में अब तक के सबसे लंबे भाषण का रिकॉर्ड किसके नाम है? जानिए LogSabha के इस खास लेख में।",
    likes: "14.8K",
    comments: "2.9K",
    shares: "4.2K",
    link: "https://www.facebook.com/logsabha",
  },
];

const POSTS_PER_FILTER = 3;

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
  const isInView = useInView(ref, { once: false, amount: 0.5 });
  const [triggered, setTriggered] = useState(false);

  useEffect(() => {
    setTriggered(isInView);
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
  const slideX = index % 2 === 0 ? -60 : 60;
  const isTwitter = post.platform === "twitter";
  const inView = useSectionInView();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: slideX, y: 30, scale: 0.9, rotateY: index % 2 === 0 ? -8 : 8 }}
      animate={{ opacity: 1, x: 0, y: 0, scale: 1, rotateY: 0 }}
      exit={{ opacity: 0, x: -slideX, y: -20, scale: 0.9 }}
      transition={{ duration: 0.6, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
      className="group h-full w-full"
    >
      <motion.div
        className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:border-amber-200 hover:shadow-xl"
        whileHover={{ y: -6 }}
        transition={{ duration: 0.3 }}
      >
        {/* Shimmer sweep on hover */}
        <motion.div
          className="pointer-events-none absolute inset-0 z-20 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background:
              "linear-gradient(105deg, transparent 40%, rgba(245,158,11,0.06) 50%, transparent 60%)",
            backgroundSize: "200% 100%",
          }}
          animate={inView ? { backgroundPosition: ["-100% 0%", "200% 0%"] } : undefined}
          transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 1.5, ease: "easeInOut" }}
        />
        {/* Card Header */}
        <div className="flex items-center justify-between px-4 pt-4 pb-3">
          <div className="flex items-center gap-3">
            <div className={`flex h-10 w-10 items-center justify-center rounded-full ${platform.iconBg} text-white shadow-md`}>
              <PlatformIcon platform={post.platform} size={18} />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">
                {post.platform === "twitter" ? "X" : post.platform.charAt(0).toUpperCase() + post.platform.slice(1)}
              </p>
              <p className="text-xs text-gray-400">{post.handle}</p>
            </div>
          </div>
          <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-[10px] font-medium text-gray-500">
            {post.timeAgo}
          </span>
        </div>

        {/* Twitter/X: text-first layout */}
        {isTwitter ? (
          <>
            {/* Post text as primary content — grows to fill card height */}
            <div className="flex flex-1 flex-col px-4 pb-3">
              <p className="flex-1 text-[15px] leading-relaxed text-gray-900">
                {post.caption}
              </p>
              {post.link && (
                <a
                  href={post.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-1 text-xs text-sky-500 hover:underline"
                >
                  <ExternalLink className="h-3 w-3" />
                  {post.link.replace(/^https?:\/\//, "").slice(0, 40)}...
                </a>
              )}
            </div>
            {/* Image below text */}
            {post.image && (
              <div className="relative mx-3 mb-3 overflow-hidden rounded-xl">
                <div className="aspect-[16/10] bg-gradient-to-br from-gray-100 to-gray-200">
                  <img
                    src={post.image}
                    alt=""
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => { e.currentTarget.style.display = "none"; }}
                  />
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            {/* Image with overlay effects (Instagram / YouTube) — stretches to fill */}
            <div className="relative mx-3 aspect-[16/10] overflow-hidden rounded-xl lg:aspect-auto lg:flex-1">
              <img
                src={post.image}
                alt={post.caption}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                onError={(e) => { e.currentTarget.style.display = "none"; }}
              />

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
              {post.link && (
                <a
                  href={post.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute right-3 bottom-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-gray-700 shadow-lg opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100 hover:bg-white"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}
            </div>

            {/* Caption */}
            <div className="px-4 pt-3 pb-1">
              <p className="line-clamp-2 text-sm leading-relaxed text-gray-700">
                {post.caption}
              </p>
            </div>
          </>
        )}

        {/* Engagement Stats */}
        <div className="mt-auto flex items-center justify-between border-t border-gray-50 px-4 py-3">
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

export function StatsBar() {
  return (
    <ScrollReveal delay={0.3}>
      <div className="mx-auto mt-6 grid max-w-4xl grid-cols-2 gap-4 sm:grid-cols-4">
        {AGGREGATE_STATS.map((stat, i) => (
          <motion.div
            key={stat.label}
            className="relative overflow-hidden rounded-2xl border border-amber-200/60 bg-gradient-to-b from-white to-amber-50/30 px-4 py-5 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
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

  const filteredPosts = (() => {
    if (activeFilter !== "all") {
      return SOCIAL_POSTS.filter((p) => p.platform === activeFilter).slice(0, POSTS_PER_FILTER);
    }
    const platformKeys = PLATFORMS.filter((p) => p.key !== "all").map((p) => p.key);
    const mixed: SocialPost[] = [];
    let round = 0;
    while (mixed.length < POSTS_PER_FILTER) {
      for (const key of platformKeys) {
        if (mixed.length >= POSTS_PER_FILTER) break;
        const post = SOCIAL_POSTS.filter((p) => p.platform === key)[round];
        if (post) mixed.push(post);
      }
      round++;
      if (round > 10) break;
    }
    return mixed;
  })();

  const { ref: sectionRef, inView } = useInViewSection();

  return (
    <SectionInViewProvider value={inView}>
    <section ref={sectionRef} className="relative overflow-hidden bg-gradient-to-b from-amber-50/60 via-orange-50/30 to-white py-4 sm:py-6 lg:py-8">
      {/* Background dot pattern */}
      <div className="absolute inset-0 opacity-[0.035]">
        <div
          className="h-full w-full"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, rgb(245,158,11) 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* Diagonal line pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div
          className="h-full w-full"
          style={{
            backgroundImage:
              "repeating-linear-gradient(135deg, transparent, transparent 40px, rgba(245,158,11,0.4) 40px, rgba(245,158,11,0.4) 41px)",
          }}
        />
      </div>

      {/* Static gradient orbs — no animation for scroll performance */}
      <div className="pointer-events-none absolute -top-32 -right-32 h-80 w-80 rounded-full bg-amber-300/15 blur-[80px]" />
      <div className="pointer-events-none absolute -bottom-32 -left-32 h-72 w-72 rounded-full bg-orange-300/12 blur-[80px]" />
      <div className="pointer-events-none absolute top-1/3 left-1/2 h-60 w-60 -translate-x-1/2 rounded-full bg-amber-200/10 blur-[100px]" />

      {/* Floating particles */}
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={`sp-particle-${i}`}
          className="pointer-events-none absolute rounded-full"
          style={{
            width: 3 + (i % 3) * 2,
            height: 3 + (i % 3) * 2,
            left: `${8 + i * 9}%`,
            top: `${12 + (i % 5) * 18}%`,
            background: i % 2 === 0 ? "rgba(245,158,11,0.25)" : "rgba(249,115,22,0.2)",
          }}
          animate={
            inView
              ? {
                  y: [0, -18 - (i % 3) * 8, 0],
                  x: [0, i % 2 === 0 ? 12 : -12, 0],
                  opacity: [0.15, 0.45, 0.15],
                }
              : undefined
          }
          transition={{
            duration: 5 + i * 0.6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.5,
          }}
        />
      ))}

      <div className="relative mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 xl:px-12">
        {/* ── Section Header ── */}
        <div className="flex flex-col items-center text-center">
          <ScrollReveal delay={0.15}>
            <h2 className="text-2xl font-extrabold text-gray-900 sm:text-3xl lg:text-4xl">
              Our{" "}
              <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
                Social Presence
              </span>
            </h2>
          </ScrollReveal>

          <ScrollRevealLine
            delay={0.3}
            className="mx-auto mt-2 h-[3px] w-12 rounded-full bg-amber-500"
          />

          {/* <ScrollReveal delay={0.4}>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-gray-500">
              Stay connected with the latest political updates, analysis, and community discussions across our social channels.
            </p>
          </ScrollReveal> */}
        </div>

        {/* ── Aggregate Stats ── */}
        {/* <StatsBar /> */}

        {/* ── Platform Filter ── */}
        <ScrollReveal delay={0.5}>
          <div className="mt-4">
            <PlatformFilter active={activeFilter} onChange={setActiveFilter} />
          </div>
        </ScrollReveal>

        {/* ── Posts Grid ── */}
        <div className="mt-4">
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
        {/* <ScrollReveal delay={0.2}>
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
        </ScrollReveal> */}
      </div>
    </section>
    </SectionInViewProvider>
  );
}
