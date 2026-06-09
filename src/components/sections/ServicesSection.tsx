import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useInView } from "motion/react";
import lottieWeb from "lottie-web";
import { useCountUp } from "@/hooks/useCountUp";
import {
  ScrollReveal,
  ScrollRevealText,
} from "@/components/motion/ScrollReveal";
import ArrowNarrowRightIcon from "@/components/ui/arrow-narrow-right-icon";
import type { ServicesData, ServiceItem } from "@/types";

// ─── Lottie icon for service tabs ───
const svcLottieCache: Record<string, object> = {};

function SvcLottieIcon({ src, size = 22 }: { src: string; size?: number }) {
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const load = (data: object) => {
      el.innerHTML = "";
      lottieWeb.loadAnimation({ container: el, renderer: "svg", loop: true, autoplay: true, animationData: data });
    };
    if (svcLottieCache[src]) { load(svcLottieCache[src]); return; }
    let cancelled = false;
    fetch(src).then(r => r.json()).then(json => { svcLottieCache[src] = json; if (!cancelled) load(json); }).catch(() => {});
    return () => { cancelled = true; el.innerHTML = ""; };
  }, [src]);
  return <div ref={containerRef} style={{ width: size, height: size, display: "inline-flex" }} />;
}

const iconMap: Record<string, React.ReactNode> = {
  target: <SvcLottieIcon src="/lottie/target.json" size={32} />,
  "bar-chart": <SvcLottieIcon src="/lottie/analysis.json" size={32} />,
  users: <SvcLottieIcon src="/lottie/community.json" size={32} />,
  tv: <SvcLottieIcon src="/lottie/tv.json" size={32} />,
  search: <SvcLottieIcon src="/lottie/search.json" size={32} />,
  monitor: <SvcLottieIcon src="/lottie/watcher.json" size={32} />,
};

// ─── Animated Counter ───

function AnimatedStat({
  value,
  suffix,
  label,
}: {
  value: number;
  suffix: string;
  label: string;
}) {
  const { count, ref } = useCountUp(value, 3500);

  return (
    <div>
      <span ref={ref} className="text-2xl font-extrabold text-gray-900 sm:text-3xl lg:text-4xl">
        {count.toLocaleString()}
      </span>
      <span className="text-2xl font-extrabold text-amber-500 sm:text-3xl lg:text-4xl">
        {suffix}
      </span>
      <p className="mt-1 text-[10px] font-semibold tracking-widest text-gray-400 uppercase sm:text-xs">
        {label}
      </p>
    </div>
  );
}

// ─── Service Tab Button ───

function ServiceTab({
  service,
  isActive,
  onClick,
  index,
}: {
  service: ServiceItem;
  isActive: boolean;
  onClick: () => void;
  index: number;
}) {
  return (
    <ScrollReveal delay={0.1 + index * 0.06} direction="left">
      <motion.button
        onClick={onClick}
        className="relative flex w-full items-center gap-3 whitespace-nowrap rounded-xl px-3 py-2 text-left sm:gap-4 sm:px-5 sm:py-3"
        whileHover={{ x: isActive ? 0 : 4 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.2 }}
      >
        {isActive && (
          <motion.div
            layoutId="service-tab-indicator"
            className="absolute inset-0 rounded-xl border border-amber-500/30 bg-amber-500/10"
            transition={{ type: "spring", stiffness: 350, damping: 30 }}
          />
        )}
        <div
          className="relative flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl transition-colors duration-500 sm:h-11 sm:w-11"
          style={{
            backgroundColor: isActive ? "rgb(245 158 11)" : "rgb(243 244 246)",
            color: isActive ? "white" : "rgb(107 114 128)",
          }}
        >
          {iconMap[service.icon] ?? <SvcLottieIcon src="/lottie/target.json" size={32} />}
        </div>
        <span
          className="relative text-sm font-semibold transition-colors duration-500 sm:text-base"
          style={{ color: isActive ? "rgb(17 24 39)" : "rgb(75 85 99)" }}
        >
          {service.title}
        </span>
      </motion.button>
    </ScrollReveal>
  );
}

// ─── Service Content Panel ───

function ServiceContent({ service }: { service: ServiceItem }) {
  return (
    <motion.div
      key={service.id}
      initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      exit={{ opacity: 0, y: -20, filter: "blur(4px)" }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="flex h-full flex-col justify-center"
    >
      {/* Description */}
      <p className="text-base leading-relaxed text-gray-600 sm:text-lg">
        {service.description}
      </p>

      {/* Stats with counting animation */}
      <div className="mt-4 flex gap-8 sm:mt-5 sm:gap-10 md:gap-14">
        {service.stats.map((stat) => (
          <AnimatedStat
            key={stat.label}
            value={stat.value}
            suffix={stat.suffix}
            label={stat.label}
          />
        ))}
      </div>

      {/* Bullet points — slide in from left with stagger */}
      <ul className="mt-5 space-y-2.5 overflow-hidden">
        {service.bulletPoints.map((point, i) => (
          <motion.li
            key={point}
            initial={{ opacity: 0, x: -40, filter: "blur(4px)" }}
            animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            transition={{
              delay: 0.4 + i * 0.15,
              duration: 0.6,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="flex items-center gap-3 text-base text-gray-700"
          >
            <motion.span
              className="h-2 w-2 flex-shrink-0 rounded-full bg-amber-500"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                delay: 0.55 + i * 0.15,
                duration: 0.35,
                type: "spring",
                stiffness: 400,
                damping: 15,
              }}
            />
            {point}
          </motion.li>
        ))}
      </ul>

      {/* Learn more link */}
      <motion.a
        href={service.learnMoreLink}
        className="mt-5 inline-flex items-center gap-2 text-base font-semibold text-amber-600 hover:text-amber-700"
        whileHover={{ x: 4 }}
        transition={{ duration: 0.2 }}
      >
        Learn more
        <ArrowNarrowRightIcon size={16} />
      </motion.a>
    </motion.div>
  );
}

// ─── Main Section ───

export function ServicesSection({ data }: { data: ServicesData }) {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });
  const [triggered, setTriggered] = useState(false);

  useEffect(() => {
    if (isInView) setTriggered(true);
  }, [isInView]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const activeService = data.services[activeIndex];

  const startAutoPlay = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % data.services.length);
    }, 4000);
  }, [data.services.length]);

  const handleTabClick = useCallback(
    (index: number) => {
      setActiveIndex(index);
      startAutoPlay();
    },
    [startAutoPlay],
  );

  useEffect(() => {
    if (triggered && !isHovering) startAutoPlay();
    else if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [triggered, isHovering, startAutoPlay]);

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-white py-8 sm:py-10 lg:py-12">
      {/* ── Circuit board pattern background (Hero Patterns) ── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50/80 via-white to-orange-50/60" />

        {/* Circuit board pattern from heropatterns.com */}
        <div className="absolute inset-0 bg-svc-circuit-board" />

        {/* Floating gradient orbs */}
        {triggered && (
          <>
            <motion.div
              className="absolute top-[15%] left-[10%] h-48 w-48 rounded-full bg-amber-200/20 blur-3xl"
              animate={{ x: [0, 30, 0], y: [0, -20, 0], opacity: [0.15, 0.3, 0.15] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute right-[8%] bottom-[20%] h-56 w-56 rounded-full bg-orange-200/15 blur-3xl"
              animate={{ x: [0, -25, 0], y: [0, 15, 0], opacity: [0.1, 0.25, 0.1] }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            />
          </>
        )}

        {/* Edge fades */}
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white to-transparent" />
      </div>

      <div className="relative mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 xl:px-12">
        {/* ── Title + Subtitle (mobile: above everything) ── */}
        <div className="lg:hidden">
          <ScrollRevealText
            text={data.title}
            highlight={data.titleHighlight}
            className="text-2xl font-extrabold text-gray-900 sm:text-3xl"
            highlightClassName="bg-gradient-to-r from-amber-500 to-amber-600 bg-clip-text text-transparent"
            delay={0}
          />
          <ScrollReveal delay={0.3}>
            <p className="mt-2 text-sm leading-relaxed text-gray-500 sm:text-base">
              {data.subtitle}
            </p>
          </ScrollReveal>
        </div>

        {/* ── Mobile layout: vertical tabs with inline content ── */}
        <div
          className="mt-5 flex flex-col gap-1 lg:hidden"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {data.services.map((service, i) => (
            <div key={service.id}>
              <ServiceTab
                service={service}
                isActive={i === activeIndex}
                onClick={() => handleTabClick(i)}
                index={i}
              />

              {/* Expanded content — shows below the active tab */}
              <AnimatePresence mode="wait">
                {i === activeIndex && (
                  <motion.div
                    key={`content-${service.id}`}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5">
                      {/* Image */}
                      <div className="relative h-[200px] overflow-hidden rounded-xl bg-gray-100 sm:h-[260px]">
                        <img
                          src={activeService.image}
                          alt={activeService.title}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                      </div>

                      {/* Description */}
                      <p className="mt-3 text-sm leading-relaxed text-gray-600 sm:text-base">
                        {activeService.description}
                      </p>

                      {/* Stats */}
                      <div className="mt-3 flex gap-6 sm:gap-10">
                        {activeService.stats.map((stat) => (
                          <AnimatedStat
                            key={stat.label}
                            value={stat.value}
                            suffix={stat.suffix}
                            label={stat.label}
                          />
                        ))}
                      </div>

                      {/* Bullet points */}
                      <ul className="mt-4 space-y-2">
                        {activeService.bulletPoints.map((point, j) => (
                          <motion.li
                            key={point}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 + j * 0.1, duration: 0.4 }}
                            className="flex items-center gap-2.5 text-sm text-gray-700"
                          >
                            <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-amber-500" />
                            {point}
                          </motion.li>
                        ))}
                      </ul>

                      {/* Learn more */}
                      <motion.a
                        href={activeService.learnMoreLink}
                        className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-amber-600 hover:text-amber-700"
                        whileHover={{ x: 4 }}
                      >
                        Learn more
                        <ArrowNarrowRightIcon size={14} />
                      </motion.a>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        {/* ── Desktop layout: 3-column grid (unchanged) ── */}
        <div
          className="hidden gap-8 lg:grid lg:grid-cols-[280px_1fr_1fr] lg:items-stretch xl:grid-cols-[320px_1fr_1fr] xl:gap-10"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {/* Left: Header + Service tabs */}
          <div className="flex flex-col">
            <ScrollRevealText
              text={data.title}
              highlight={data.titleHighlight}
              className="text-3xl font-extrabold text-gray-900 sm:text-4xl lg:text-5xl"
              highlightClassName="bg-gradient-to-r from-amber-500 to-amber-600 bg-clip-text text-transparent"
              delay={0}
            />
            <ScrollReveal delay={0.3}>
              <p className="mt-3 max-w-xl text-sm text-gray-500 sm:text-base">
                {data.subtitle}
              </p>
            </ScrollReveal>
            <div className="mt-6 flex flex-col gap-1">
              {data.services.map((service, i) => (
                <ServiceTab
                  key={service.id}
                  service={service}
                  isActive={i === activeIndex}
                  onClick={() => handleTabClick(i)}
                  index={i}
                />
              ))}
            </div>
          </div>

          {/* Center: Image */}
          <ScrollReveal delay={0.2} className="relative flex h-full items-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeService.id}
                initial={{ opacity: 0, scale: 0.96, filter: "blur(6px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 0.96, filter: "blur(6px)" }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="relative w-full overflow-hidden rounded-2xl bg-gray-100 lg:aspect-[3/4] lg:max-h-[480px]"
              >
                <img
                  src={activeService.image}
                  alt={activeService.title}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    const target = e.currentTarget;
                    target.style.display = "none";
                    const parent = target.parentElement;
                    if (parent) {
                      parent.classList.add(
                        "flex",
                        "items-center",
                        "justify-center",
                      );
                      const div = document.createElement("div");
                      div.className =
                        "text-center text-gray-400 text-sm px-4";
                      div.textContent = activeService.title;
                      parent.appendChild(div);
                    }
                  }}
                />
                {/* Image overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </motion.div>
            </AnimatePresence>
          </ScrollReveal>

          {/* Right: Content panel — fill grid cell height */}
          <ScrollReveal delay={0.3} direction="right" className="flex h-full flex-col justify-center">
            <AnimatePresence mode="wait">
              <ServiceContent service={activeService} />
            </AnimatePresence>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
