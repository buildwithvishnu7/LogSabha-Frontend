import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "motion/react";
import { Calendar } from "lucide-react";
import { loadLottieInView } from "@/lib/lottie";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { useFounderEditorial } from "@/hooks/useFounderEditorial";

// ─── Inline Lottie Icon ───
function FounderLottieIcon({ src, size = 18, color = "#ffffff" }: { src: string; size?: number; color?: string }) {
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
      const anim = loadLottieInView({ container: el, animationData: json });
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

interface EditorialArticle {
  id?: string;
  title: string;
  image: string;
  date: string;
}

// Used until the API responds, or if it's unreachable.
const FALLBACK_FOUNDER = {
  title: "कलम का संकल्प, संदीप (शिवा) संस्थापक, लोगसभा",
  subtitle: "ना झुके, ना रुके - धर्म, राष्ट्र और संस्कृति के लिए समर्पित संकल्प |",
  backgroundVideo: "/videos/candle-bg.mp4",
  backgroundPoster: "/images/tri-bg.jpg",
  ctaLabel: "Read More",
  ctaLink: "#",
  articles: [
    {
      title: "निःस्वार्थ सेवा की भावना में अमर हुआ कर्तव्य: लेफ्टिनेंट शशांक तिवारी",
      image: "/images/editorial/featured.jpg",
      date: "June 12, 2026",
    },
    {
      title: "रियो से ऋषिकेश: आचार्य विश्वनाथ जोनास मसेती की सनातन धर्म यात्रा",
      image: "/images/editorial/regional.webp",
      date: "June 11, 2026",
    },
    {
      title: "उपरबेड़ा से राष्ट्रपति भवन तक: राष्ट्रपति द्रौपदी मुर्मू की प्रेरणादायक कहानी",
      image: "/images/editorial/parliament.webp",
      date: "June 11, 2026",
    },
  ] as EditorialArticle[],
};

// ─── Candle Flame (SVG) ───

export function CandleFlame({
  x,
  size,
  delay,
}: {
  x: string;
  size: number;
  delay: number;
}) {
  return (
    <motion.div
      className="pointer-events-none absolute bottom-0"
      style={{ left: x }}
    >
      {/* Glow underneath */}
      <motion.div
        className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-amber-500/20 blur-xl"
        style={{ width: size * 3, height: size * 2 }}
        animate={{
          opacity: [0.3, 0.6, 0.3],
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 2 + delay * 0.3,
          repeat: Infinity,
          ease: "easeInOut",
          delay,
        }}
      />
      {/* Candle body */}
      <div
        className="mx-auto rounded-t-sm bg-gradient-to-t from-amber-100 to-amber-50"
        style={{
          width: size * 0.35,
          height: size * 1.2,
        }}
      />
      {/* Flame */}
      <motion.div
        className="absolute left-1/2 -translate-x-1/2"
        style={{ bottom: size * 1.1 }}
        animate={{
          scaleX: [1, 0.85, 1.1, 0.9, 1],
          scaleY: [1, 1.15, 0.9, 1.1, 1],
          y: [0, -2, 1, -1.5, 0],
        }}
        transition={{
          duration: 1.5 + delay * 0.2,
          repeat: Infinity,
          ease: "easeInOut",
          delay,
        }}
      >
        {/* Outer flame */}
        <div
          className="rounded-full"
          style={{
            width: size * 0.55,
            height: size * 0.9,
            background:
              "radial-gradient(ellipse at 50% 70%, #f59e0b 0%, #f97316 40%, rgba(239,68,68,0.4) 70%, transparent 100%)",
            borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%",
          }}
        />
        {/* Inner bright core */}
        <div
          className="absolute left-1/2 -translate-x-1/2"
          style={{
            bottom: size * 0.12,
            width: size * 0.2,
            height: size * 0.35,
            background:
              "radial-gradient(ellipse, #fef3c7 0%, #fbbf24 60%, transparent 100%)",
            borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%",
          }}
        />
      </motion.div>
    </motion.div>
  );
}

// ─── Article Card ───

function ArticleCard({
  article,
  index,
  triggered,
}: {
  article: EditorialArticle;
  index: number;
  triggered: boolean;
}) {
  return (
    <motion.div
      className="group flex w-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.07] backdrop-blur-md transition-all duration-300 hover:border-amber-500/30 hover:bg-white/[0.12]"
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={triggered ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{
        duration: 0.7,
        delay: 0.6 + index * 0.15,
        ease: [0.16, 1, 0.3, 1],
      }}
      whileHover={{ y: -6 }}
    >
      {/* Image */}
      <div className="relative aspect-[16/9] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-900/40 to-orange-900/30">
          <img
            src={article.image}
            alt={article.title}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        </div>
        {/* Hover shimmer overlay */}
        <motion.div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background:
              "linear-gradient(120deg, transparent 30%, rgba(245,158,11,0.15) 50%, transparent 70%)",
            backgroundSize: "200% 100%",
          }}
          animate={triggered ? { backgroundPosition: ["-200% 0%", "200% 0%"] } : undefined}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-3 sm:p-4">
        <h3 className="line-clamp-3 text-xs font-bold leading-snug text-white/90 transition-colors group-hover:text-amber-400 sm:text-sm">
          {article.title}
        </h3>

        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="flex items-center gap-1.5 text-xs text-amber-400/70">
            <Calendar className="h-3.5 w-3.5" />
            {article.date}
          </span>
          <motion.span
            className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500/20 text-amber-400 transition-colors group-hover:bg-amber-500 group-hover:text-white"
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
          >
            <FounderLottieIcon src="/lottie/fast-forward.json" size={18} color="#fbbf24" />
          </motion.span>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main Section ───

export function FounderEditorialSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.15 });
  const [triggered, setTriggered] = useState(false);
  const { data } = useFounderEditorial();
  const founder = data ?? FALLBACK_FOUNDER;

  useEffect(() => {
    setTriggered(isInView);
  }, [isInView]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-[#0f0a04] py-8 sm:py-12 lg:py-16"
    >
      {/* ── Dark candle-lit background ── */}
      <div className="pointer-events-none absolute inset-0">
        {/* Candle background image */}
        {/* <img
          src="/images/candle.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        /> */}
       <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
          poster={founder.backgroundPoster}
        >
          <source src={founder.backgroundVideo} type="video/mp4" />
        </video>
        {/* Dark overlay to keep text readable */}
        <div className="absolute inset-0 bg-black/60" />

        {/* Base warm dark gradient on top */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a0e04]/70 via-transparent to-[#0a0602]/80" />

        {/* Vignette */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 50% 40%, transparent 30%, rgba(0,0,0,0.5) 100%)",
          }}
        />

        {/* Warm ambient light — static for scroll performance */}
        {triggered && (
          <>
            <div
              className="absolute top-1/4 left-1/2 h-[500px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-700/[0.06] blur-[120px] opacity-55"
            />
            <div
              className="absolute top-[60%] left-[25%] h-[300px] w-[300px] rounded-full bg-orange-600/[0.04] blur-[100px] opacity-40"
            />
            <div
              className="absolute top-[50%] right-[20%] h-[250px] w-[250px] rounded-full bg-amber-500/[0.03] blur-[80px] opacity-30"
            />
          </>
        )}

        {/* Floating embers / sparks */}
        {triggered &&
          [...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-amber-400"
              style={{
                width: 2 + (i % 3),
                height: 2 + (i % 3),
                left: `${10 + i * 8}%`,
                bottom: `${5 + (i % 5) * 12}%`,
              }}
              animate={{
                y: [0, -(60 + i * 20), -(120 + i * 15)],
                x: [0, (i % 2 === 0 ? 15 : -15), (i % 2 === 0 ? -5 : 5)],
                opacity: [0, 0.6, 0],
                scale: [0.5, 1, 0.3],
              }}
              transition={{
                duration: 4 + i * 0.5,
                delay: i * 0.8,
                repeat: Infinity,
                ease: "easeOut",
              }}
            />
          ))}


      </div>

      {/* ── Content ── */}
      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-10">
        {/* Title */}
        <ScrollReveal>
          <h2
            className="px-2 py-1 text-center text-xl font-extrabold leading-normal sm:text-2xl sm:leading-normal lg:text-3xl lg:leading-normal"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              letterSpacing: "-0.3px",
            }}
          >
            <motion.span
              className="inline-block py-1"
              style={{
                backgroundImage:
                  "linear-gradient(90deg, #fbbf24 0%, #fbbf24 30%, #fff 45%, #fde68a 50%, #fff 55%, #fbbf24 70%, #fbbf24 100%)",
                backgroundSize: "300% 100%",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
              animate={
                triggered
                  ? { backgroundPosition: ["200% center", "-200% center"] }
                  : undefined
              }
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              {founder.title}
            </motion.span>
          </h2>
        </ScrollReveal>

        {/* Subtitle */}
        <ScrollReveal delay={0.15}>
          <p className="mx-auto mt-2 max-w-xl text-center text-[10px] leading-relaxed text-amber-200/50 sm:text-xs lg:text-sm">
            {founder.subtitle}
          </p>
        </ScrollReveal>

        {/* Divider line */}
        <ScrollReveal delay={0.25}>
          <div className="mx-auto mt-3 h-px w-24 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />
        </ScrollReveal>

        {/* Article Cards */}
        <div className="mt-4 grid gap-3 sm:mt-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4">
          {founder.articles.map((article, i) => (
            <ArticleCard
              key={i}
              article={article}
              index={i}
              triggered={triggered}
            />
          ))}
        </div>

        {/* Read More CTA */}
        <ScrollReveal delay={0.5}>
          <div className="mt-4 flex justify-center sm:mt-5">
            <motion.a
              href={founder.ctaLink}
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full border border-amber-500/50 bg-gradient-to-r from-amber-600/20 to-orange-600/20 px-8 py-3 text-sm font-semibold text-amber-400 backdrop-blur-sm transition-all hover:border-amber-400 hover:text-white"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
            >
              {/* Pulse rings */}
              <motion.span
                className="pointer-events-none absolute inset-[-3px] rounded-full border-2 border-amber-500/60"
                style={{ boxShadow: "0 0 8px rgba(245,158,11,0.2)" }}
                animate={triggered ? { scale: [1, 1.06, 1], opacity: [0.7, 0, 0.7] } : undefined}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.span
                className="pointer-events-none absolute inset-[-1px] rounded-full border-2 border-amber-500/40"
                animate={triggered ? { scale: [1, 1.03, 1], opacity: [1, 0.2, 1] } : undefined}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
              />
              {/* Moving border glow */}
              <motion.span
                className="pointer-events-none absolute inset-0 rounded-full"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, rgba(245,158,11,0.3), transparent)",
                  backgroundSize: "200% 100%",
                }}
                animate={
                  triggered
                    ? { backgroundPosition: ["-200% 0%", "200% 0%"] }
                    : undefined
                }
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
              <span className="relative z-10 flex items-center gap-2">
                {founder.ctaLabel}
                <FounderLottieIcon src="/lottie/fast-forward.json" size={22} color="#fbbf24" />
              </span>
            </motion.a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
