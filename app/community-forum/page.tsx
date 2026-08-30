"use client";

// Community Forum — a 3D topic carousel over a working forum: sign in, post,
// reply in nested threads, vote and report. State lives in localStorage, so it
// genuinely persists across reloads instead of resetting to a fixture.
//
// The content is DEMONSTRATION copy and every author is invented. The page says
// so, prominently — a forum that shows fictional posts and a 52,400-member
// counter without saying they are fictional is claiming a community it has not
// got.
import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { motion, useReducedMotion } from "motion/react";
import { ArrowDown } from "lucide-react";
import { ForumApp } from "@/components/forum/ForumApp";
import { forumCategories, forumStats, forumNote, type Category } from "@/data/forum";
import { Footer } from "@/components/Footer";

const EASE = [0.16, 1, 0.3, 1] as const;
const nf = new Intl.NumberFormat("en-IN");

const ForumCarousel = dynamic(() => import("@/components/three/ForumCarousel"), {
  ssr: false,
  loading: () => <CarouselFallback />,
});

function CarouselFallback() {
  return (
    <div className="absolute inset-0 grid place-items-center">
      <div className="flex items-center gap-2">
        {forumCategories.slice(0, 5).map((c, i) => (
          <span
            key={c.id}
            className="rounded"
            style={{
              width: 26 - Math.abs(i - 2) * 4,
              height: 36 - Math.abs(i - 2) * 5,
              background: c.c,
              opacity: 0.3,
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default function CommunityForumPage() {
  const ref = useRef<HTMLElement>(null);
  const [near, setNear] = useState(false);
  const [category, setCategory] = useState<string | null>(null);
  const [hovered, setHovered] = useState<Category | null>(null);
  const reduced = useReducedMotion() ?? false;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) return setNear(true);
    const io = new IntersectionObserver(
      (e) => e[0].isIntersecting && (setNear(true), io.disconnect()),
      { rootMargin: "700px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const pick = (c: Category) => {
    setCategory((cur) => (cur === c.id ? null : c.id));
    document.getElementById("forum")?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
  };

  const shown = hovered ?? forumCategories.find((c) => c.id === category) ?? null;

  return (
    <>
      <section className="relative overflow-hidden bg-[#061428] pb-12 pt-[calc(var(--header-h)+40px)] text-white">
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <span className="absolute -right-[8%] -top-[26%] h-[62vh] w-[62vh] rounded-full bg-[radial-gradient(circle,rgba(255,153,51,0.22),transparent_62%)] blur-3xl" />
          <span className="absolute -left-[10%] bottom-[-26%] h-[54vh] w-[54vh] rounded-full bg-[radial-gradient(circle,rgba(27,110,194,0.20),transparent_62%)] blur-3xl" />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-[1440px] px-4 sm:px-6">
          <motion.span
            className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#ffc27a]"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Community forum
          </motion.span>

          <motion.h1
            className="mt-3 max-w-[17ch] text-[clamp(34px,6vw,74px)] font-extrabold leading-[1] tracking-tight"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05, ease: EASE }}
          >
            Argue the claim, <span className="shimmer-word">not the person</span>
          </motion.h1>

          <motion.p
            className="mt-5 max-w-[62ch] text-[15px] leading-relaxed text-white/70"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            Six rooms, threaded replies, and a vote that means something. Pick a topic from the ring,
            or go straight to the feed.
          </motion.p>

          <motion.div
            className="mt-7 flex flex-wrap items-center gap-3"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
          >
            <a
              href="#forum"
              className="btn-breathing inline-flex items-center gap-2 rounded-full bg-[#ff9933] px-6 py-3 text-[13px] font-bold text-white transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffc27a]"
            >
              Go to the feed
              <ArrowDown className="h-4 w-4" />
            </a>
          </motion.div>

          {/* Stated before any of the numbers below are read. */}
          <div className="mt-8 max-w-[74ch] rounded-xl border border-[#ffc27a]/30 bg-[#ffc27a]/[0.08] p-4">
            <p className="text-[13px] font-bold text-[#ffc27a]">Demonstration content</p>
            <p className="mt-1 text-[12.5px] leading-relaxed text-white/70">
              {forumNote} The counters below are illustrative, not a real membership. What IS real:
              posting, replying, voting and reporting all work, and everything you do here persists
              in your own browser.
            </p>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {[
              ["Members", forumStats.members],
              ["Threads", forumStats.threads],
              ["Replies", forumStats.replies],
              ["Posts / day", forumStats.dailyPosts],
              ["Online now", forumStats.online],
              ["Moderators", forumStats.moderators],
            ].map(([label, n]) => (
              <div key={label as string} className="rounded-lg border border-white/12 bg-white/[0.04] p-3">
                <div className="text-[17px] font-extrabold leading-none text-white">
                  {nf.format(n as number)}
                </div>
                <div className="mt-1 text-[9px] font-semibold uppercase tracking-wide text-white/45">
                  {label as string}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        ref={ref}
        id="ring"
      // .oneview, not .oneview-lg: every 3D section in the reference is full
      // height at every width. The lg-only variant is for the analytics
      // explorer alone, which pairs its canvas with a 36-row table.
      className="oneview relative overflow-hidden bg-[#061428] text-white"
      >
        <div className="ov-head relative z-10 mx-auto w-full max-w-[1440px] px-4 pt-6 text-center sm:px-6">
          <h2 className="text-[clamp(19px,2.2vw,30px)] font-extrabold tracking-tight">
            {forumCategories.length} rooms
          </h2>
          <p className="mx-auto mt-1.5 max-w-[58ch] text-[clamp(12px,1vw,14px)] leading-relaxed text-white/60">
            Drag to spin. Click a card to filter the feed to that topic.
          </p>
        </div>

        <div className="ov-stage relative z-10">
          {near ? (
            <ForumCarousel
              selectedId={category}
              onHoverCategory={setHovered}
              onSelectCategory={pick}
              reducedMotion={reduced}
            />
          ) : (
            <CarouselFallback />
          )}

          <div
            role="status"
            aria-live="polite"
            className="pointer-events-none absolute inset-x-0 bottom-1 flex justify-center px-4"
          >
            {shown && (
              <span className="max-w-[70ch] rounded-full border border-white/15 bg-[#061428]/90 px-4 py-1.5 text-center text-[11px] backdrop-blur">
                <span className="mr-2 inline-block h-2 w-2 rounded-full align-middle" style={{ background: shown.c }} />
                <b className="font-semibold text-white">{shown.name}</b>
                <span className="ml-2 text-white/55">{shown.blurb}</span>
              </span>
            )}
          </div>
        </div>

        <div className="ov-foot relative z-10 pb-5">
          {/* Real buttons for every room, so the forum is navigable with the
              canvas absent, failed, or invisible to a screen reader. */}
          <ul className="flex flex-wrap items-center justify-center gap-1.5 px-4 sm:px-6">
            {forumCategories.map((c) => (
              <li key={c.id}>
                <button
                  type="button"
                  onClick={() => pick(c)}
                  onMouseEnter={() => setHovered(c)}
                  onMouseLeave={() => setHovered(null)}
                  onFocus={() => setHovered(c)}
                  onBlur={() => setHovered(null)}
                  aria-pressed={category === c.id}
                  className={
                    "flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff9933] " +
                    (category === c.id
                      ? "border-transparent bg-white text-[#0a1e3f]"
                      : "border-white/12 text-white/70 hover:border-white/35 hover:text-white")
                  }
                >
                  <span className="h-2 w-2 rounded-full" style={{ background: c.c }} />
                  {c.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <ForumApp category={category} onCategoryChange={setCategory} />
      <Footer />
    </>
  );
}
