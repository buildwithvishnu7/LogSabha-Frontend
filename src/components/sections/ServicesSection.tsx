import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Target,
  BarChart3,
  Users,
  Tv,
  Search,
  Monitor,
  ArrowRight,
} from "lucide-react";
import { useCountUp } from "@/hooks/useCountUp";
import {
  ScrollReveal,
  ScrollRevealText,
} from "@/components/motion/ScrollReveal";
import { AnimatedLucideIcon } from "@/components/AnimatedLucideIcon";
import type { ServicesData, ServiceItem } from "@/types";

const iconMap: Record<string, React.ReactNode> = {
  target: <AnimatedLucideIcon icon={Target} size={20} />,
  "bar-chart": <AnimatedLucideIcon icon={BarChart3} size={20} />,
  users: <AnimatedLucideIcon icon={Users} size={20} />,
  tv: <AnimatedLucideIcon icon={Tv} size={20} />,
  search: <AnimatedLucideIcon icon={Search} size={20} />,
  monitor: <AnimatedLucideIcon icon={Monitor} size={20} />,
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
      <span ref={ref} className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
        {count.toLocaleString()}
      </span>
      <span className="text-3xl font-extrabold text-amber-500 sm:text-4xl">
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
        className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition-colors ${
          isActive
            ? "bg-amber-500/10 border border-amber-500/30"
            : "hover:bg-gray-100 border border-transparent"
        }`}
        whileHover={{ x: isActive ? 0 : 4 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.2 }}
      >
        <div
          className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg ${
            isActive
              ? "bg-amber-500 text-white"
              : "bg-gray-100 text-gray-500"
          }`}
        >
          {iconMap[service.icon] ?? <AnimatedLucideIcon icon={Target} size={20} />}
        </div>
        <span
          className={`text-sm font-medium ${
            isActive ? "text-gray-900" : "text-gray-600"
          }`}
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="flex h-full flex-col justify-center"
    >
      {/* Description */}
      <p className="text-sm leading-relaxed text-gray-600 sm:text-base">
        {service.description}
      </p>

      {/* Stats with counting animation */}
      <div className="mt-6 flex gap-8 sm:gap-12">
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
      <ul className="mt-6 space-y-2.5">
        {service.bulletPoints.map((point, i) => (
          <motion.li
            key={point}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + i * 0.1, duration: 0.4 }}
            className="flex items-center gap-2.5 text-sm text-gray-700"
          >
            <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-amber-500" />
            {point}
          </motion.li>
        ))}
      </ul>

      {/* Learn more link */}
      <motion.a
        href={service.learnMoreLink}
        className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-amber-600 hover:text-amber-700"
        whileHover={{ x: 4 }}
        transition={{ duration: 0.2 }}
      >
        Learn more
        <AnimatedLucideIcon icon={ArrowRight} size={16} />
      </motion.a>
    </motion.div>
  );
}

// ─── Main Section ───

export function ServicesSection({ data }: { data: ServicesData }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeService = data.services[activeIndex];

  return (
    <section className="relative overflow-hidden bg-white py-20 sm:py-24 lg:py-32">
      {/* Decorative background pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
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
        {/* Section header */}
        <ScrollRevealText
          text={data.title}
          highlight={data.titleHighlight}
          className="text-3xl font-extrabold text-gray-900 sm:text-4xl lg:text-5xl"
          highlightClassName="bg-gradient-to-r from-amber-500 to-amber-600 bg-clip-text text-transparent"
          delay={0}
        />
        <ScrollReveal delay={0.3}>
          <p className="mt-3 max-w-lg text-sm text-gray-500 sm:text-base">
            {data.subtitle}
          </p>
        </ScrollReveal>

        {/* Main content grid */}
        <div className="mt-10 grid gap-8 lg:mt-14 lg:grid-cols-[280px_1fr_1fr] lg:gap-6 xl:grid-cols-[320px_1fr_1fr] xl:gap-10">
          {/* Left: Service tabs */}
          <div className="flex flex-row gap-2 overflow-x-auto pb-2 lg:flex-col lg:gap-1 lg:overflow-visible lg:pb-0">
            {data.services.map((service, i) => (
              <ServiceTab
                key={service.id}
                service={service}
                isActive={i === activeIndex}
                onClick={() => setActiveIndex(i)}
                index={i}
              />
            ))}
          </div>

          {/* Center: Image */}
          <ScrollReveal delay={0.2} className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeService.id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.4 }}
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

          {/* Right: Content panel */}
          <ScrollReveal delay={0.3} direction="right" className="flex flex-col justify-center">
            <AnimatePresence mode="wait">
              <ServiceContent service={activeService} />
            </AnimatePresence>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
