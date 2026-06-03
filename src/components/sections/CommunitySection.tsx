import { useState, useRef, useEffect } from "react";
import { motion, useInView } from "motion/react";
import {
  Users,
  MessageCircle,
  ThumbsUp,
  Share2,
  Bookmark,
  MoreHorizontal,
  ArrowRight,
  Eye,
  Clock,
  TrendingUp,
  Flame,
  Hash,
} from "lucide-react";
import {
  ScrollReveal,
  ScrollRevealLine,
} from "@/components/motion/ScrollReveal";
import { AnimatedLucideIcon } from "@/components/AnimatedLucideIcon";

// ─── Static Data ───

interface Post {
  id: string;
  author: { name: string; handle: string; initials: string; color: string };
  tags: { label: string; variant: "dark" | "amber" | "purple" | "emerald" | "blue" }[];
  views: string;
  title: string;
  excerpt: string;
  likes: number;
  comments: number;
  timeAgo: string;
  gradient: string;
}

interface TrendingTopic {
  rank: number;
  name: string;
  discussions: string;
  change: string;
  gradient: string;
}

const TAG_STYLES: Record<string, string> = {
  dark: "bg-gray-900/70 text-white backdrop-blur-sm",
  amber: "bg-amber-500 text-white",
  purple: "bg-purple-500/80 text-white backdrop-blur-sm",
  emerald: "bg-emerald-600/80 text-white backdrop-blur-sm",
  blue: "bg-blue-500 text-white",
};

const POSTS: Post[] = [
  {
    id: "1",
    author: { name: "Rajesh Kumar", handle: "@rajesh_pol", initials: "RK", color: "bg-blue-600" },
    tags: [
      { label: "Policy Discussion", variant: "dark" },
      { label: "Trending", variant: "amber" },
    ],
    views: "12.4K",
    title: "Budget 2026: What it means for rural development",
    excerpt:
      "The new budget allocation shows a 23% increase in rural infrastructure spending. This could be a game-changer for agriculture and rural employment...",
    likes: 342,
    comments: 87,
    timeAgo: "2h ago",
    gradient: "from-red-900 via-red-800 to-orange-900",
  },
  {
    id: "2",
    author: { name: "Priya Sharma", handle: "@priya_analyst", initials: "PS", color: "bg-purple-600" },
    tags: [
      { label: "Elections", variant: "dark" },
      { label: "Trending", variant: "amber" },
    ],
    views: "8.9K",
    title: "State Election Results Analysis: 5 Key Takeaways",
    excerpt:
      "The new budget allocation shows a 23% increase in rural infrastructure spending. This could be a game-changer for agriculture and rural employment...",
    likes: 342,
    comments: 87,
    timeAgo: "2h ago",
    gradient: "from-blue-900 via-indigo-800 to-purple-900",
  },
  {
    id: "3",
    author: { name: "Vikram Singh", handle: "@vikram_voice", initials: "VS", color: "bg-amber-700" },
    tags: [{ label: "Parliament", variant: "purple" }],
    views: "6.2K",
    title: "Parliamentary debates on education reform gaining momentum",
    excerpt:
      "The new budget allocation shows a 23% increase in rural infrastructure spending. This could be a game-changer for agriculture and rural employment...",
    likes: 342,
    comments: 87,
    timeAgo: "3h ago",
    gradient: "from-amber-900 via-yellow-900 to-orange-900",
  },
  {
    id: "4",
    author: { name: "Anita Desai", handle: "@anita_pol", initials: "AD", color: "bg-emerald-600" },
    tags: [
      { label: "Economy", variant: "emerald" },
      { label: "Analysis", variant: "blue" },
    ],
    views: "5.1K",
    title: "GST reforms: Impact on small businesses across states",
    excerpt:
      "Recent GST modifications are expected to significantly reduce compliance burden for small businesses. Early data suggests a 15% increase in new registrations...",
    likes: 218,
    comments: 54,
    timeAgo: "4h ago",
    gradient: "from-emerald-900 via-teal-800 to-cyan-900",
  },
  {
    id: "5",
    author: { name: "Suresh Patel", handle: "@suresh_gov", initials: "SP", color: "bg-slate-600" },
    tags: [{ label: "Infrastructure", variant: "dark" }],
    views: "3.8K",
    title: "New highway corridor: Connecting 12 states by 2028",
    excerpt:
      "The ambitious national highway project promises to reduce travel time between major cities by 40%. Environmental clearances for the first phase are already in place...",
    likes: 156,
    comments: 43,
    timeAgo: "5h ago",
    gradient: "from-slate-800 via-gray-800 to-zinc-900",
  },
];

const TRENDING_TOPICS: TrendingTopic[] = [
  {
    rank: 1,
    name: "Budget2026",
    discussions: "45.2",
    change: "+23%",
    gradient: "from-red-900/90 via-orange-900/80 to-red-950/90",
  },
  {
    rank: 2,
    name: "StateElections",
    discussions: "38.7",
    change: "+18%",
    gradient: "from-blue-900/90 via-indigo-900/80 to-blue-950/90",
  },
  {
    rank: 3,
    name: "RuralDevelopment",
    discussions: "29.4",
    change: "+34%",
    gradient: "from-emerald-900/90 via-teal-900/80 to-emerald-950/90",
  },
];

// ─── Slot Machine Animation ───

function SlotDigit({
  target,
  delay,
  triggered,
}: {
  target: number;
  delay: number;
  triggered: boolean;
}) {
  const sequence = [
    ...Array.from({ length: 10 }, (_, i) => i),
    ...Array.from({ length: 10 }, (_, i) => i),
    target,
  ];
  const scrollTo = -(sequence.length - 1) * 1.15;

  return (
    <span
      className="relative inline-block overflow-hidden"
      style={{ height: "1.15em", width: "0.62em" }}
    >
      <motion.span
        className="flex flex-col items-center tabular-nums"
        initial={false}
        animate={triggered ? { y: `${scrollTo}em` } : { y: "0em" }}
        transition={{
          delay,
          duration: 1.6,
          ease: [0.16, 1, 0.3, 1],
        }}
      >
        {sequence.map((d, i) => (
          <span
            key={i}
            className="flex items-center justify-center leading-none"
            style={{ height: "1.15em" }}
          >
            {d}
          </span>
        ))}
      </motion.span>
    </span>
  );
}

function SlotMachineNumber({
  value,
  suffix,
  className = "",
}: {
  value: string;
  suffix?: string;
  className?: string;
}) {
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
          return (
            <SlotDigit
              key={i}
              target={parseInt(char)}
              delay={i * 0.1}
              triggered={triggered}
            />
          );
        }
        return (
          <motion.span
            key={i}
            className="inline-block"
            initial={false}
            animate={
              triggered
                ? { opacity: 1, y: 0 }
                : { opacity: 0, y: 8 }
            }
            transition={{
              delay: i * 0.1 + 0.2,
              duration: 0.4,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {char}
          </motion.span>
        );
      })}
      {suffix && (
        <motion.span
          className="inline-block"
          initial={false}
          animate={
            triggered
              ? { opacity: 1, scale: 1 }
              : { opacity: 0, scale: 0.5 }
          }
          transition={{
            delay: chars.length * 0.1 + 0.15,
            duration: 0.5,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          {suffix}
        </motion.span>
      )}
    </span>
  );
}

// ─── Typewriter Text ───

const TYPEWRITER_PHRASES = [
  "Discuss Budget 2026 and its impact...",
  "Analyze State Election results...",
  "Debate policy reforms and governance...",
  "Share insights on rural development...",
  "Explore parliamentary proceedings...",
];

function TypewriterText({
  phrases,
  className = "",
}: {
  phrases?: string[];
  className?: string;
}) {
  const itemsRef = useRef(phrases ?? TYPEWRITER_PHRASES);
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const items = itemsRef.current;
    const phrase = items[phraseIndex];
    let timeout: ReturnType<typeof setTimeout>;

    if (!isDeleting && charIndex < phrase.length) {
      timeout = setTimeout(() => setCharIndex((c) => c + 1), 70);
    } else if (!isDeleting && charIndex === phrase.length) {
      timeout = setTimeout(() => setIsDeleting(true), 2000);
    } else if (isDeleting && charIndex > 0) {
      timeout = setTimeout(() => setCharIndex((c) => c - 1), 35);
    } else {
      setIsDeleting(false);
      setPhraseIndex((p) => (p + 1) % items.length);
    }

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, phraseIndex]);

  const text = itemsRef.current[phraseIndex].slice(0, charIndex);

  return (
    <span className={className}>
      {text}
      <span className="typewriter-cursor ml-0.5 inline-block text-amber-500">
        |
      </span>
    </span>
  );
}

// ─── Post Card ───

function PostCard({ post }: { post: Post }) {
  return (
    <div className="group flex-shrink-0 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-shadow duration-300 hover:shadow-lg">
      {/* Header image area */}
      <div
        className={`relative h-48 overflow-hidden bg-gradient-to-br ${post.gradient}`}
      >
        {/* Noise texture overlay */}
        <div className="absolute inset-0 opacity-20 mix-blend-overlay"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.15) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 40%)",
          }}
        />

        {/* Tags */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          {post.tags.map((tag) => (
            <span
              key={tag.label}
              className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${TAG_STYLES[tag.variant]}`}
            >
              {tag.label}
            </span>
          ))}
        </div>

        {/* Views badge */}
        <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-black/40 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">
          <Eye className="h-3 w-3" />
          {post.views}
        </div>

        {/* Author overlay */}
        <div className="absolute inset-x-0 bottom-0 flex items-center gap-2.5 bg-gradient-to-t from-black/70 via-black/30 to-transparent px-4 pb-3 pt-10">
          <div
            className={`flex h-9 w-9 items-center justify-center rounded-full ${post.author.color} text-xs font-bold text-white ring-2 ring-white/30`}
          >
            {post.author.initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-white">
              {post.author.name}
            </p>
            <p className="text-[10px] text-white/60">{post.author.handle}</p>
          </div>
          <button className="flex-shrink-0 rounded-full p-1 text-white/50 transition-colors hover:bg-white/10 hover:text-white">
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="line-clamp-2 text-sm font-bold leading-snug text-gray-900 transition-colors group-hover:text-amber-600">
          {post.title}
        </h3>
        <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-gray-500">
          {post.excerpt}
        </p>

        {/* Footer */}
        <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3">
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-1 text-[11px] text-gray-400 transition-colors hover:text-amber-500">
              <ThumbsUp className="h-3.5 w-3.5" />
              {post.likes}
            </button>
            <button className="flex items-center gap-1 text-[11px] text-gray-400 transition-colors hover:text-amber-500">
              <MessageCircle className="h-3.5 w-3.5" />
              {post.comments}
            </button>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="flex items-center gap-1 text-[10px] text-gray-300">
              <Clock className="h-3 w-3" />
              {post.timeAgo}
            </span>
            <button className="text-gray-300 transition-colors hover:text-amber-500">
              <Share2 className="h-3.5 w-3.5" />
            </button>
            <button className="text-gray-300 transition-colors hover:text-amber-500">
              <Bookmark className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Auto-Scrolling Posts Container ───
// Uses setInterval for reliable auto-scroll. Pauses on hover for manual scroll.
// overscroll-behavior: contain prevents page from scrolling when user scrolls posts.

function ScrollingPosts({ posts }: { posts: Post[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isPausedRef = useRef(false);
  const resumeTimerRef = useRef<number>(0);

  // Auto-scroll via setInterval
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const id = setInterval(() => {
      if (!isPausedRef.current && el) {
        el.scrollTop += 1;
        const half = el.scrollHeight / 2;
        if (el.scrollTop >= half) {
          el.scrollTop -= half;
        }
      }
    }, 30);

    return () => clearInterval(id);
  }, []);

  // Explicit wheel handler (non-passive) so manual scroll always works
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();

      isPausedRef.current = true;
      el.scrollTop += e.deltaY;

      // Wrap around for infinite loop
      const half = el.scrollHeight / 2;
      if (el.scrollTop >= half) el.scrollTop -= half;
      if (el.scrollTop < 0) el.scrollTop += half;

      // Resume auto-scroll 3s after last wheel interaction
      window.clearTimeout(resumeTimerRef.current);
      resumeTimerRef.current = window.setTimeout(() => {
        isPausedRef.current = false;
      }, 3000);
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  // Touch support — pause on touch, resume after
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

  const doubled = [...posts, ...posts];

  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-4 bg-gradient-to-b from-white to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-12 bg-gradient-to-t from-white to-transparent" />
      <div
        ref={scrollRef}
        className="scrollbar-hide max-h-[850px] overflow-y-auto"
        style={{ overscrollBehavior: "contain" }}
      >
        <div className="flex flex-col gap-5 py-2">
          {doubled.map((post, i) => (
            <PostCard key={`${post.id}-${i}`} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Trending Topic Card ───

function TrendingTopicCard({
  topic,
  index,
}: {
  topic: TrendingTopic;
  index: number;
}) {
  return (
    <ScrollReveal delay={0.2 + index * 0.1} direction="right">
      <motion.div
        className={`relative cursor-pointer overflow-hidden rounded-xl bg-gradient-to-br ${topic.gradient} p-4 py-5`}
        whileHover={{ scale: 1.02, y: -2 }}
        transition={{ duration: 0.25 }}
      >
        {/* Subtle texture */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 70% 30%, rgba(255,255,255,0.2) 0%, transparent 50%)",
          }}
        />

        <div className="relative flex items-start justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 text-[10px] font-bold text-white">
              #{topic.rank}
            </span>
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Flame className="h-4 w-4 text-amber-400" />
            </motion.span>
          </div>
          <span className="flex items-center gap-0.5 rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
            <TrendingUp className="h-3 w-3" />
            {topic.change}
          </span>
        </div>

        <div className="relative mt-3">
          <p className="flex items-center gap-1 text-sm font-bold text-white">
            <Hash className="h-3.5 w-3.5 text-white/50" />
            {topic.name}
          </p>
          <p className="mt-0.5 text-[11px] text-white/50">
            <SlotMachineNumber
              value={topic.discussions}
              suffix="K"
              className="text-[11px] font-medium text-white/60"
            />{" "}
            discussions
          </p>
        </div>
      </motion.div>
    </ScrollReveal>
  );
}

// ─── Main Section ───

export function CommunitySection() {
  return (
    <section className="relative overflow-hidden bg-white py-20 sm:py-24 lg:py-32">
      {/* Dot pattern background */}
      <div className="absolute inset-0 opacity-[0.025]">
        <div
          className="h-full w-full"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgb(0,0,0) 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 xl:px-12">
        {/* ── Section Header ── */}
        <div className="flex flex-col items-center text-center">
          <ScrollReveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-1.5 text-[11px] font-semibold tracking-wider text-amber-600 uppercase">
              <AnimatedLucideIcon icon={Users} size={14} animation="float" />
              Community Forum
            </span>
          </ScrollReveal>

          <ScrollReveal delay={0.15}>
            <h2 className="community-title-shimmer mt-5 text-3xl font-extrabold sm:text-4xl lg:text-5xl">
              Join the Conversation
            </h2>
          </ScrollReveal>

          <ScrollRevealLine
            delay={0.35}
            className="mx-auto mt-3 h-[3px] w-12 rounded-full bg-amber-500"
          />

          <ScrollReveal delay={0.45}>
            <p className="mt-4 h-6 text-sm text-gray-400">
              <TypewriterText />
            </p>
          </ScrollReveal>
        </div>

        {/* ── Main Content Grid ── */}
        <div className="mt-10 grid gap-8 lg:mt-14 lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_400px]">
          {/* Left: Recent Posts */}
          <div>
            <ScrollReveal>
              <div className="mb-5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <AnimatedLucideIcon
                    icon={MessageCircle}
                    size={18}
                    className="text-gray-400"
                    animation="type"
                  />
                  <h3 className="text-lg font-bold text-gray-900">
                    Recent Posts
                  </h3>
                  <span className="flex items-center gap-1 rounded-full border border-red-200 bg-red-50 px-2 py-0.5 text-[10px] font-bold uppercase text-red-500">
                    <span className="badge-dot-pulse h-1.5 w-1.5 rounded-full bg-red-500" />
                    Live
                  </span>
                </div>
                <a
                  href="#"
                  className="moving-border flex items-center gap-1.5 rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-amber-500 transition-colors hover:text-amber-600"
                >
                  <span>View All</span>
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </ScrollReveal>

            <ScrollingPosts posts={POSTS} />
          </div>

          {/* Right: Sidebar — stretch to match posts height */}
          <div className="flex flex-col gap-6 lg:self-stretch">
            {/* Join Our Community Card */}
            <ScrollReveal delay={0.15} direction="right">
              <div className="rounded-2xl border border-gray-200 bg-gradient-to-b from-amber-50/50 to-white p-6 text-center">
                <motion.div
                  className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500 text-white shadow-lg shadow-amber-500/25"
                  animate={{ y: [0, -5, 0] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <Users className="h-6 w-6" />
                </motion.div>

                <h3 className="mt-4 text-lg font-bold text-gray-900">
                  Join Our Community
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-gray-500">
                  Connect with 50,000+ political enthusiasts. Share your voice
                  in shaping India's future.
                </p>

                {/* Stats with slot machine */}
                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-amber-200/60 bg-amber-50/50 px-3 py-3">
                    <div className="text-xl font-extrabold text-amber-500">
                      <SlotMachineNumber value="50" suffix="K+" />
                    </div>
                    <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                      Members
                    </p>
                  </div>
                  <div className="rounded-xl border border-amber-200/60 bg-amber-50/50 px-3 py-3">
                    <div className="text-xl font-extrabold text-amber-500">
                      <SlotMachineNumber value="12" suffix="K+" />
                    </div>
                    <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                      Daily Posts
                    </p>
                  </div>
                </div>

                {/* Join Now button — breathing pulse rings like search icon */}
                <motion.button
                  className="relative mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-amber-600"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <motion.span
                    className="pointer-events-none absolute inset-[-3px] rounded-xl border-2 border-amber-500/70"
                    style={{ boxShadow: "0 0 8px rgba(245,158,11,0.25)" }}
                    animate={{ scale: [1, 1.04, 1], opacity: [0.8, 0.1, 0.8] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <motion.span
                    className="pointer-events-none absolute inset-[-1px] rounded-xl border-2 border-amber-500/50"
                    animate={{ scale: [1, 1.02, 1], opacity: [1, 0.3, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
                  />
                  <AnimatedLucideIcon icon={Users} size={16} animation="float" />
                  Join Now
                </motion.button>
              </div>
            </ScrollReveal>

            {/* Trending Topics Card — grows to fill remaining height */}
            <ScrollReveal delay={0.25} direction="right" className="flex-1">
              <div className="flex h-full flex-col rounded-2xl border-2 border-amber-400/60 bg-white p-5">
                <div className="mb-4 flex items-center gap-2">
                  <Hash className="h-5 w-5 text-amber-500" />
                  <h3 className="h-6 text-base font-bold text-gray-900">
                    <TypewriterText
                      phrases={[
                        "What's India Talking About?",
                        "Trending in Politics Today",
                        "Top Discussions Right Now",
                        "India's Hottest Debates",
                      ]}
                    />
                  </h3>
                </div>

                <div className="flex flex-1 flex-col gap-3">
                  {TRENDING_TOPICS.map((topic, i) => (
                    <TrendingTopicCard
                      key={topic.name}
                      topic={topic}
                      index={i}
                    />
                  ))}
                </div>

                <button
                  className="moving-border mt-4 flex w-full items-center justify-center gap-1.5 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-amber-600 transition-colors hover:bg-amber-50"
                >
                  <span>View More</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
