"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, useScroll, useSpring } from "motion/react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { blogPosts, type BlogPost } from "@/data/blog";
import { LangToggle, pick, type Lang } from "@/components/blog/BlogSections";

const EASE = [0.16, 1, 0.3, 1] as const;

function Progress() {
  const { scrollYProgress } = useScroll();
  const x = useSpring(scrollYProgress, { stiffness: 140, damping: 28, restDelta: 0.001 });
  return (
    <motion.div
      aria-hidden
      className="fixed inset-x-0 top-0 z-50 h-[3px] origin-left bg-[#F59E0B]"
      style={{ scaleX: x }}
    />
  );
}

export function PostView({ post }: { post: BlogPost }) {
  // Long-form pieces in this archive are written in Hindi, so that's the
  // default; the toggle still lets a reader force English where it exists.
  const [lang, setLang] = useState<Lang>(post.bodyHi?.length ? "hi" : "en");
  const c = pick(post, lang);

  const related = blogPosts
    .filter((p) => p.slug !== post.slug)
    .sort((a, b) => (a.kind === post.kind ? -1 : 0) - (b.kind === post.kind ? -1 : 0))
    .slice(0, 3);

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const shares = [
    { id: "f", label: "Share on Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}` },
    { id: "t", label: "Share on X", href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(c.title)}` },
    { id: "W", label: "Share on WhatsApp", href: `https://wa.me/?text=${encodeURIComponent(c.title + " " + shareUrl)}` },
  ];

  return (
    <>
      <Progress />

      {/* masthead */}
      <section className="bg-[#0B1120] pt-24 pb-10 sm:pt-28 sm:pb-12">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-[12px] font-bold tracking-[1px] text-[#FBBF24] transition-colors hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              {lang === "hi" ? "सभी लेख" : "ALL ARTICLES"}
            </Link>
            <LangToggle lang={lang} onChange={setLang} />
          </div>

          <motion.span
            className="mt-7 flex flex-wrap items-center gap-2 text-[10px] font-bold tracking-wide text-[#FBBF24]"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {c.topic}
            {post.date && (
              <>
                <span className="h-1 w-1 rounded-full bg-[#F59E0B]" />
                <span className="font-semibold text-[#9CA3AF]">
                  {post.date}
                  {post.time ? ` · ${post.time}` : ""}
                </span>
              </>
            )}
          </motion.span>

          <motion.h1
            className="mt-3 text-xl font-bold leading-[1.45] text-white sm:text-2xl"
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.08, ease: EASE }}
          >
            {c.title}
          </motion.h1>

          {post.author && (
            <motion.p
              className="mt-4 text-[13px] text-[#9CA3AF]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
            >
              {lang === "hi" ? "द्वारा" : "By"} <span className="font-semibold text-white">{post.author}</span>
            </motion.p>
          )}
        </div>
      </section>

      {/* article */}
      <article className="bg-white py-14 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          {post.img && (
            <motion.figure
              className="mb-8 overflow-hidden rounded-xl"
              style={{ maxWidth: post.imgW }}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: EASE }}
            >
              <img
                src={post.img}
                alt={post.alt || c.title}
                width={post.imgW}
                height={post.imgH}
                className="block h-auto w-full"
              />
              {c.caption && (
                <figcaption className="mt-2 text-[12px] italic text-[#9CA3AF]">{c.caption}</figcaption>
              )}
            </motion.figure>
          )}

          {c.note && (
            <motion.p
              className="rounded-xl border-l-[3px] border-[#F59E0B] bg-[#F5F5F5] px-5 py-4 text-base font-medium leading-relaxed text-[#6B7280]"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              {c.note}
            </motion.p>
          )}

          {c.body?.length ? (
            <div className="mt-8">
              {c.body.map((para, i) => (
                <motion.p
                  key={i}
                  className={`mt-4 text-base leading-[1.9] text-[#6B7280] ${
                    i === 0
                      ? "first-letter:mr-2 first-letter:float-left first-letter:text-[3.2rem] first-letter:font-extrabold first-letter:leading-[0.85] first-letter:text-[#F59E0B]"
                      : ""
                  }`}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, amount: 0.2 }}
                  transition={{ duration: 0.5, ease: EASE }}
                >
                  {para}
                </motion.p>
              ))}
            </div>
          ) : (
            // Most entries in this archive are filed as headline + note; the
            // reference shows a "pending" panel rather than an empty article.
            <div
              className="mt-8 rounded-xl border border-dashed border-[#E5E7EB] bg-[#F5F5F5] px-6 py-8 text-center"
            >
              <span className="text-[10px] font-bold tracking-wide text-[#D97706]">
                {lang === "hi" ? "पूरी रिपोर्ट शीघ्र" : "FULL REPORT COMING"}
              </span>
              <p className="mx-auto mt-2 max-w-lg text-sm leading-relaxed text-[#9CA3AF]">
                {lang === "hi"
                  ? "इस विषय पर विस्तृत रिपोर्ट तैयार की जा रही है। तब तक ऊपर दिया सार पढ़ें।"
                  : "A detailed report on this story is being prepared. The summary above carries the essentials for now."}
              </p>
              <Link
                href="/blog#archive"
                className="mt-5 inline-flex items-center gap-2 text-[13px] font-bold tracking-[1px] text-[#F59E0B] transition-colors hover:text-[#D97706]"
              >
                {lang === "hi" ? "अन्य लेख पढ़ें" : "BROWSE THE ARCHIVE"}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          )}

          {/* share */}
          <div className="mt-10 flex items-center gap-3 border-t border-[#0A0A0A]/10 pt-6">
            <span className="text-[10px] font-bold tracking-wide text-[#9CA3AF]">
              {lang === "hi" ? "साझा करें" : "SHARE"}
            </span>
            {shares.map((s) => (
              <a
                key={s.id}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="grid h-9 w-9 place-items-center border border-[#0A0A0A]/15 text-[14px] font-bold text-[#0A0A0A] transition-colors hover:border-[#F59E0B] hover:text-[#F59E0B]"
              >
                {s.id}
              </a>
            ))}
          </div>
        </div>
      </article>

      {/* related */}
      <section className="bg-[#F5F5F5] py-14 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex items-end justify-between gap-4">
            <h2 className="text-xl font-bold text-[#0A0A0A] sm:text-2xl">
              {lang === "hi" ? "संबंधित लेख" : "Related Reading"}
            </h2>
            <Link
              href="/blog#archive"
              className="text-[12px] font-bold tracking-[1px] text-[#F59E0B] transition-colors hover:text-[#D97706]"
            >
              {lang === "hi" ? "सभी" : "ALL"} →
            </Link>
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((r, i) => {
              const rc = pick(r, lang);
              return (
                <motion.div
                  key={r.slug}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, amount: 0.3 }}
                  transition={{ duration: 0.5, delay: i * 0.07, ease: EASE }}
                >
                  <Link
                    href={`/blog/${r.slug}`}
                    className="group block h-full rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-lg transition-shadow hover:shadow-xl"
                  >
                    <span className="flex items-center gap-2 text-[10px] font-bold tracking-[0.18em] text-[#D97706]">
                      {rc.topic}
                      <span className="h-1 w-1 rounded-full bg-[#F59E0B]" />
                      <span className="font-semibold text-[#9CA3AF]">{r.date}</span>
                    </span>
                    <h3 className="mt-2.5 text-[15px] font-bold leading-[1.55] text-[#0A0A0A] transition-colors group-hover:text-[#F59E0B]">
                      {rc.title}
                    </h3>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
