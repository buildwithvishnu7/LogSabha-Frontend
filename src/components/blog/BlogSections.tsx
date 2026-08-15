"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { motion, useInView } from "motion/react";
import { ArrowDown, ArrowRight } from "lucide-react";
import { Typewriter } from "@/components/motion/Typewriter";
import { blogPosts, blogKinds, type BlogKind, type BlogPost } from "@/data/blog";

/* Reference palette: navy hero #0A1E3F, heading #1B3A6B, body #1F2A44,
   muted #54617C, saffron #E67300 / #A85200, archive panel #F5F7FB. */

const EASE = [0.16, 1, 0.3, 1] as const;

export type Lang = "hi" | "en";

/* The reference publishes long-form pieces in Hindi and short items in both,
   so the toggle falls back FIELD BY FIELD rather than hiding a whole post. */
export function pick(post: BlogPost, lang: Lang) {
  return {
    title: lang === "hi" ? post.hi || post.en : post.en || post.hi,
    note: lang === "hi" ? post.noteHi || post.noteEn : post.noteEn || post.noteHi,
    topic: lang === "hi" ? post.topicHi || post.topic : post.topic || post.topicHi,
    kicker: lang === "hi" ? post.kickerHi || post.kicker : post.kicker || post.kickerHi,
    caption: lang === "hi" ? post.capHi || post.cap : post.cap || post.capHi,
    body: lang === "hi" ? post.bodyHi || post.bodyEn : post.bodyEn || post.bodyHi,
  };
}

export function LangToggle({ lang, onChange }: { lang: Lang; onChange: (l: Lang) => void }) {
  return (
    <div
      className="inline-flex items-center gap-1 border border-white/25 p-1"
      style={{ borderRadius: 3 }}
      role="group"
      aria-label="Article language"
    >
      {([
        { id: "hi" as Lang, label: "हिन्दी" },
        { id: "en" as Lang, label: "ENGLISH" },
      ]).map((o) => (
        <button
          key={o.id}
          onClick={() => onChange(o.id)}
          aria-pressed={lang === o.id}
          className={`relative px-3 py-1 text-[12px] font-bold tracking-wide transition-colors ${
            lang === o.id ? "text-[#0A1E3F]" : "text-white/70 hover:text-white"
          }`}
          style={{ borderRadius: 3 }}
        >
          {lang === o.id && (
            <motion.span
              layoutId="blog-lang-pill"
              className="absolute inset-0 -z-10 bg-[#FFD9AE]"
              style={{ borderRadius: 3 }}
              transition={{ type: "spring", stiffness: 420, damping: 34 }}
            />
          )}
          {o.label}
        </button>
      ))}
    </div>
  );
}

/* ═══════════════ hero ═══════════════ */

function BlogHero({ lang, setLang }: { lang: Lang; setLang: (l: Lang) => void }) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: false, amount: 0.2 });
  const title = "EDITORIAL INSIGHTS";

  return (
    <section ref={ref} className="relative overflow-hidden bg-[#0A1E3F] pt-28 pb-14 sm:pt-32 sm:pb-16">
      <div className="relative z-10 mx-auto max-w-5xl px-4 text-center sm:px-6">
        <h1
          className="text-[2.5rem] font-extrabold leading-[1.22] tracking-[1px] sm:text-[3.75rem] lg:text-[4.5rem] text-white"
          aria-label={title}
        >
          {title.split("").map((ch, i) => (
            <motion.span
              key={i}
              aria-hidden
              className="inline-block"
              initial={{ opacity: 0, y: 36, filter: "blur(6px)" }}
              animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
              transition={{ duration: 0.7, delay: 0.08 + i * 0.035, ease: EASE }}
            >
              {ch === " " ? " " : ch}
            </motion.span>
          ))}
        </h1>

        <motion.p
          className="mx-auto mt-5 max-w-2xl text-[15px] leading-loose text-[#C9D6EA] sm:text-base"
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.55 }}
        >
          Reporting, memory and record — every week, without varnish
        </motion.p>

        <motion.div
          className="mt-7 flex items-center justify-center gap-4"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.7 }}
        >
          <LangToggle lang={lang} onChange={setLang} />
          <a
            href="#latest"
            className="inline-flex h-9 w-9 items-center justify-center border border-white/30 text-white"
            style={{ borderRadius: 3 }}
            aria-label="Scroll to the latest story"
          >
            <motion.span animate={{ y: [0, 4, 0] }} transition={{ duration: 1.7, repeat: Infinity }}>
              <ArrowDown className="h-4 w-4" />
            </motion.span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}

/* ═══════════════ lead story ═══════════════ */

function LeadStory({ post, lang }: { post: BlogPost; lang: Lang }) {
  const c = pick(post, lang);
  return (
    <section id="latest" className="scroll-mt-24 bg-white py-14 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <motion.span
          className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-[#A85200]"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.6 }}
          transition={{ duration: 0.55 }}
        >
          <span className="h-px w-7 bg-[#E67300]" />
          LEAD STORY
        </motion.span>

        <motion.h2
          className="mt-3 text-3xl font-bold leading-[1.2] text-[#1B3A6B] sm:text-[2.6rem]"
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.5 }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <Typewriter text="Latest From The Desk" />
        </motion.h2>

        <Link href={`/blog/${post.slug}`} className="group mt-8 block">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-12">
            {post.img && (
              <motion.figure
                className="relative overflow-hidden"
                style={{ borderRadius: 3, maxWidth: post.imgW }}
                initial={{ opacity: 0, y: 26 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.25 }}
                transition={{ duration: 0.8, ease: EASE }}
              >
                <img
                  src={post.img}
                  alt={post.alt || c.title}
                  width={post.imgW}
                  height={post.imgH}
                  className="block h-auto w-full transition-transform duration-[1.2s] group-hover:scale-[1.04]"
                />
              </motion.figure>
            )}

            <motion.div
              className="self-center"
              initial={{ opacity: 0, x: 26 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
            >
              <span className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.18em] text-[#A85200]">
                {c.topic}
                <span className="h-1 w-1 rounded-full bg-[#E67300]" />
                <span className="text-[#54617C]">{post.date}</span>
              </span>
              <h3 className="mt-3 text-xl font-bold leading-[1.5] text-[#1B3A6B] transition-colors group-hover:text-[#E67300] sm:text-2xl">
                {c.title}
              </h3>
              {c.note && (
                <p className="mt-3 text-[15px] leading-loose text-[#1F2A44]">{c.note}</p>
              )}
              <span className="mt-5 inline-flex items-center gap-2 text-[13px] font-bold tracking-[1px] text-[#E67300]">
                READ THE FULL REPORT
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </motion.div>
          </div>
        </Link>
      </div>
    </section>
  );
}

/* ═══════════════ archive ═══════════════ */

function ArchiveCard({ post, lang, i }: { post: BlogPost; lang: Lang; i: number }) {
  const c = pick(post, lang);
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: Math.min(i, 6) * 0.05, ease: EASE }}
      className="group flex h-full flex-col border border-[#14213D]/10 bg-white p-5 transition-shadow hover:shadow-[0_16px_36px_-22px_rgba(20,33,61,0.5)]"
      style={{ borderRadius: 3 }}
    >
      <Link href={`/blog/${post.slug}`} className="flex h-full flex-col">
        {post.img && (
          <span className="mb-4 block overflow-hidden" style={{ borderRadius: 3 }}>
            <img
              src={post.img}
              alt={post.alt || c.title}
              loading="lazy"
              width={post.imgW}
              height={post.imgH}
              className="block h-40 w-full object-cover transition-transform duration-[1.2s] group-hover:scale-[1.05]"
            />
          </span>
        )}
        <span className="flex items-center gap-2 text-[10px] font-bold tracking-[0.18em] text-[#A85200]">
          {c.topic}
          <span className="h-1 w-1 rounded-full bg-[#E67300]" />
          <span className="font-semibold text-[#54617C]">{post.date}</span>
        </span>
        <h3 className="mt-2.5 text-[15px] font-bold leading-[1.55] text-[#1B3A6B] transition-colors group-hover:text-[#E67300]">
          {c.title}
        </h3>
        {c.note && (
          <p className="mt-2 line-clamp-3 text-[13px] leading-relaxed text-[#54617C]">{c.note}</p>
        )}
        <span className="mt-auto pt-4 text-[12px] font-bold tracking-[1px] text-[#E67300]">
          READ →
        </span>
      </Link>
    </motion.article>
  );
}

function Archive({ posts, lang }: { posts: BlogPost[]; lang: Lang }) {
  const [kind, setKind] = useState<BlogKind | "all">("all");
  const shown = useMemo(() => (kind === "all" ? posts : posts.filter((p) => p.kind === kind)), [posts, kind]);

  return (
    <section id="archive" className="scroll-mt-24 bg-[#F5F7FB] py-14 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <motion.h2
            className="text-2xl font-bold leading-[1.2] text-[#1B3A6B] sm:text-[2.2rem]"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.5 }}
            transition={{ duration: 0.65, ease: EASE }}
          >
            <Typewriter text={lang === "hi" ? "संग्रह" : "The Archive"} />
          </motion.h2>

          <div className="flex flex-wrap gap-2">
            {blogKinds.map((k) => {
              const count = k.id === "all" ? posts.length : posts.filter((p) => p.kind === k.id).length;
              return (
                <button
                  key={k.id}
                  onClick={() => setKind(k.id)}
                  aria-pressed={kind === k.id}
                  className={`relative px-3.5 py-1.5 text-[12px] font-bold transition-colors ${
                    kind === k.id ? "text-white" : "text-[#1B3A6B] hover:text-[#E67300]"
                  }`}
                  style={{ borderRadius: 3 }}
                >
                  {kind === k.id && (
                    <motion.span
                      layoutId="blog-kind-pill"
                      className="absolute inset-0 -z-10 bg-[#1B3A6B]"
                      style={{ borderRadius: 3 }}
                      transition={{ type: "spring", stiffness: 420, damping: 34 }}
                    />
                  )}
                  {lang === "hi" ? k.labelHi : k.label}
                  <span className="ml-1.5 opacity-60">{count}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* No AnimatePresence here on purpose. An exit animation keeps the
            filtered-out cards mounted until it finishes — and if animations are
            throttled (background tab, reduced power) the grid can keep showing
            posts the reader just filtered away. Removal is immediate; the
            `layout` prop still animates the survivors into their new positions,
            and each card fades in on mount. */}
        <motion.div layout className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((p, i) => (
            <ArchiveCard key={p.slug} post={p} lang={lang} i={i} />
          ))}
        </motion.div>

        {shown.length === 0 && (
          <p className="mt-10 text-center text-[15px] text-[#54617C]">Nothing filed under this yet.</p>
        )}
      </div>
    </section>
  );
}

/* ═══════════════ page ═══════════════ */

export function BlogIndex() {
  const [lang, setLang] = useState<Lang>("hi");
  const [lead, ...rest] = blogPosts;

  return (
    <>
      <BlogHero lang={lang} setLang={setLang} />
      <LeadStory post={lead} lang={lang} />
      <Archive posts={rest} lang={lang} />
    </>
  );
}
