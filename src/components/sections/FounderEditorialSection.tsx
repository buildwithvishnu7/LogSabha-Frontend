import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "motion/react";
import Link from "next/link";
import { Calendar } from "lucide-react";
import { loadLottieInView } from "@/lib/lottie";
import { ScrollReveal, ScrollRevealLine } from "@/components/motion/ScrollReveal";
import { HOME_CARD } from "@/styles/tokens";
import { useFounderEditorial } from "@/hooks/useFounderEditorial";

/* "सत्ता, सियासत और कुरुक्षेत्र" — the founder's analysis series.
 *
 * Content and mood come from the same section on logsabha.com: the Kurukshetra
 * painting behind it, the saffron title with the crossed swords, the navy
 * strap-line, the three latest posts. The COMPONENTS are the homepage's own —
 * HOME_CARD, the shared reveal/stagger, the hover lift, the Lottie arrow in
 * the card footer and the amber CTA every other section uses — so this block
 * reads as part of the page rather than a page pasted into it.
 *
 * The CMS record (useFounderEditorial) can override every field, including
 * `backgroundImage`: that is where the client's AI Krishna / Kurukshetra scene
 * lands when they supply it. Until then the live site's painting is used.
 */

// ─── Inline Lottie Icon (same helper the other sections carry) ───
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
  /** e.g. "12:56 pm" — shown after the date, as on the live site */
  time?: string;
  link?: string;
}

// Used until the API responds, or if it's unreachable. Titles, dates and
// thumbnails are the three posts the live site showed on 24 Sept 2026.
const FALLBACK_FOUNDER = {
  title: "सत्ता, सियासत और कुरुक्षेत्र | संदीप (शिवा), संस्थापक – लोगसभा",
  subtitle: "कौन चला चाल, कौन हुआ शिकार— सत्ता और विपक्ष के हर दांव की पड़ताल",
  backgroundImage: "/images/kurukshetra/bg-satta-politics.png",
  ctaLabel: "Read More",
  ctaLink: "/blog",
  articles: [
    {
      title:
        "बीजेपी अजेय नहीं विपक्ष ही अनाड़ी है, Episode 7: अल्पसंख्यक हमेशा पीड़ित और बहुसंख्यक हिन्दू हमेशा दंगाई, कांग्रेस द्वारा 2011 में पेश किया गया वो ‘हिंसा रोकथाम बिल’ जो बना उनकी भारी रणनीतिक चूक, और डाल गया BJP की झोली में पूरा हिन्दू वोट",
      image: "/images/kurukshetra/ep7.jpeg",
      date: "September 21, 2026",
      time: "12:56 pm",
      link: "/blog",
    },
    {
      title:
        "चाणक्य-नीति भी बन जाती घाव, जब सत्ता चल देती गलत दांव Episode 1: ‘सोशल इंजीनियरिंग’ की आड़ में अपनों के ही भरोसे का खात्मा, SC/ST Act को संजीवनी देकर कैसे बीजेपी ने खुद ही तोड़ दी अखंड हिन्दू समाज की एकता",
      image: "/images/kurukshetra/chanakya-ep1.jpeg",
      date: "September 18, 2026",
      time: "11:43 am",
      link: "/blog",
    },
    {
      title:
        "बीजेपी अजेय नहीं विपक्ष ही अनाड़ी है, Episode 6: भगवान राम का अस्तित्व नकारने की गलती और विकास के नाम पर राम सेतु तोड़ने की जिद, कांग्रेस के आत्मघाती फैसले जिन्होंने बहुसंख्यक समाज को बीजेपी के हवाले करके सौंप दी सत्ता की चाबी",
      image: "/images/kurukshetra/ep6.jpeg",
      date: "September 14, 2026",
      time: "2:17 pm",
      link: "/blog",
    },
  ] as EditorialArticle[],
};

type FounderData = typeof FALLBACK_FOUNDER & {
  /** older CMS records may still carry these; they are simply not used now */
  backgroundVideo?: string;
  backgroundPoster?: string;
};

// ─── Article Card — the homepage card, same as Community / Editorial ───

function ArticleCard({ article, index }: { article: EditorialArticle; index: number }) {
  const body = (
    <>
      {/* 16:9 thumbnail, zooms on hover like every other card image here */}
      <div className="relative aspect-video overflow-hidden bg-amber-50">
        <img
          src={article.image}
          alt={article.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-4 text-sm font-bold leading-snug text-gray-900 transition-colors group-hover:text-amber-600 sm:text-[15px]">
          {article.title}
        </h3>

        {/* Footer — date on the left, the arrow on the right, as on the
            Editorial and Community cards */}
        <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-3">
          <span className="flex items-center gap-1.5 text-xs text-gray-400">
            <Calendar className="h-3.5 w-3.5 text-amber-500" />
            {article.date}
            {article.time && <span className="text-gray-300">· {article.time}</span>}
          </span>
          <motion.span
            className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500/10 text-amber-500 transition-colors group-hover:bg-amber-500 group-hover:text-white"
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
          >
            <FounderLottieIcon src="/lottie/fast-forward.json" size={18} color="#e87d12" />
          </motion.span>
        </div>
      </div>
    </>
  );

  const className = `group flex h-full w-full flex-col overflow-hidden ${HOME_CARD}`;

  return (
    <motion.div
      className="h-full"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.3 }}
      transition={{ duration: 0.6, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -6 }}
    >
      {article.link ? (
        <Link href={article.link} className={className}>{body}</Link>
      ) : (
        <div className={className}>{body}</div>
      )}
    </motion.div>
  );
}

// ─── Main Section ───

export function FounderEditorialSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.15 });
  const [triggered, setTriggered] = useState(false);
  const { data } = useFounderEditorial();
  const founder: FounderData = { ...FALLBACK_FOUNDER, ...(data ?? {}) };

  useEffect(() => {
    setTriggered(isInView);
  }, [isInView]);
  void triggered;

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-[#f4ecdc] py-8 sm:py-10 lg:py-12"
    >
      {/* ── Kurukshetra painting ── */}
      <div className="pointer-events-none absolute inset-0">
        <img
          src={founder.backgroundImage}
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover object-center"
        />
        {/* Pale veil so the cards and the navy strap-line stay readable over
            the painting; white fades top and bottom blend into the neighbours */}
        <div className="absolute inset-0 bg-[#fbf7ef]/60" />
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/80 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white/80 to-transparent" />
      </div>

      {/* ── Content ── */}
      <div className="relative z-10 mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 xl:px-12">
        {/* Header — same scale and rhythm as every other section heading */}
        <div className="text-center">
          <ScrollReveal>
            <h2 className="text-2xl font-extrabold leading-[1.3] text-[#e87d12] sm:text-3xl lg:text-4xl">
              <span aria-hidden="true" className="mr-2">⚔️</span>
              {founder.title}
            </h2>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <p className="mx-auto mt-2 max-w-3xl text-sm font-semibold leading-relaxed text-[#0a1e3f] sm:text-base">
              {founder.subtitle}
            </p>
          </ScrollReveal>

          <ScrollRevealLine
            delay={0.2}
            className="mx-auto mt-3 h-[3px] w-12 rounded-full bg-amber-500"
          />
        </div>

        {/* Cards */}
        <div className="mx-auto mt-6 grid max-w-6xl gap-5 sm:mt-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {founder.articles.map((article: EditorialArticle, i: number) => (
            <ArticleCard key={article.id ?? i} article={article} index={i} />
          ))}
        </div>

        {/* CTA — the amber button the Editorial section uses */}
        <ScrollReveal delay={0.4}>
          <div className="mt-6 flex justify-center sm:mt-8">
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Link
                href={founder.ctaLink}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-amber-500/20 transition-shadow hover:shadow-lg hover:shadow-amber-500/30"
              >
                {founder.ctaLabel}
                <FounderLottieIcon src="/lottie/fast-forward.json" size={22} color="#ffffff" />
              </Link>
            </motion.div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
