import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Tv, Monitor } from "lucide-react";
import { useCountUp } from "@/hooks/useCountUp";
import {
  ScrollReveal,
  ScrollRevealText,
} from "@/components/motion/ScrollReveal";
import { AnimatedLucideIcon } from "@/components/AnimatedLucideIcon";
import { LoopingIcon } from "@/components/LoopingIcon";
import TargetIcon from "@/components/ui/target-icon";
import ChartBarIcon from "@/components/ui/chart-bar-icon";
import UsersIcon from "@/components/ui/users-icon";
import MagnifierIcon from "@/components/ui/magnifier-icon";
import ArrowNarrowRightIcon from "@/components/ui/arrow-narrow-right-icon";
import type { ServicesData, ServiceItem } from "@/types";

const iconMap: Record<string, React.ReactNode> = {
  target: <LoopingIcon icon={TargetIcon} size={20} interval={4000} />,
  "bar-chart": <LoopingIcon icon={ChartBarIcon} size={20} interval={3500} delay={500} />,
  users: <LoopingIcon icon={UsersIcon} size={20} interval={4500} delay={300} />,
  tv: <AnimatedLucideIcon icon={Tv} size={20} animation="flicker" />,
  search: <LoopingIcon icon={MagnifierIcon} size={20} interval={3000} delay={800} />,
  monitor: <AnimatedLucideIcon icon={Monitor} size={20} animation="scan" />,
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
        className="relative flex w-full items-center gap-3 whitespace-nowrap rounded-xl px-4 py-2.5 text-left sm:gap-4 sm:px-5 sm:py-3"
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
          className="relative flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl transition-colors duration-500"
          style={{
            backgroundColor: isActive ? "rgb(245 158 11)" : "rgb(243 244 246)",
            color: isActive ? "white" : "rgb(107 114 128)",
          }}
        >
          {iconMap[service.icon] ?? <LoopingIcon icon={TargetIcon} size={20} interval={4000} />}
        </div>
        <span
          className="relative text-base font-semibold transition-colors duration-500"
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

      {/* Bullet points */}
      <ul className="mt-5 space-y-2.5">
        {service.bulletPoints.map((point, i) => (
          <motion.li
            key={point}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + i * 0.1, duration: 0.4 }}
            className="flex items-center gap-3 text-base text-gray-700"
          >
            <span className="h-2 w-2 flex-shrink-0 rounded-full bg-amber-500" />
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
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const activeService = data.services[activeIndex];

  const startAutoPlay = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % data.services.length);
    }, 2000);
  }, [data.services.length]);

  const handleTabClick = useCallback(
    (index: number) => {
      setActiveIndex(index);
      startAutoPlay();
    },
    [startAutoPlay],
  );

  useEffect(() => {
    if (!isHovering) startAutoPlay();
    else if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isHovering, startAutoPlay]);

  return (
    <section className="relative overflow-hidden bg-white py-12 sm:py-14 lg:py-18">
      {/* ── Video background ── */}
      <div className="pointer-events-none absolute inset-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src="/videos/Ashoka-bg.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-white/70" />
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-white to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white to-transparent" />
      </div>

      <div className="relative mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 xl:px-12">
        {/* Main content grid — title lives inside left column so image spans full height */}
        <div
          className="grid gap-6 sm:gap-8 lg:grid-cols-[280px_1.2fr_1fr] lg:items-stretch lg:gap-8 xl:grid-cols-[320px_1.2fr_1fr] xl:gap-10"
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
            <div className="scrollbar-hide -mx-4 mt-5 flex flex-row gap-2 overflow-x-auto px-4 pb-2 sm:-mx-0 sm:mt-6 sm:px-0 lg:flex-1 lg:flex-col lg:justify-between lg:gap-0 lg:overflow-visible lg:pb-0">
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
          <ScrollReveal delay={0.2} className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeService.id}
                initial={{ opacity: 0, scale: 0.96, filter: "blur(6px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 0.96, filter: "blur(6px)" }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="relative h-[280px] overflow-hidden rounded-2xl bg-gray-100 sm:h-[360px] lg:h-full"
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
