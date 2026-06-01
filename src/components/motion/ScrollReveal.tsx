import { motion } from "motion/react";
import type { ReactNode } from "react";

// ─── Basic scroll reveal wrapper ───

interface ScrollRevealProps {
  children: ReactNode;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
  className?: string;
}

const directionMap = {
  up: { y: 40, x: 0 },
  down: { y: -40, x: 0 },
  left: { x: 40, y: 0 },
  right: { x: -40, y: 0 },
};

export function ScrollReveal({
  children,
  delay = 0,
  direction = "up",
  className,
}: ScrollRevealProps) {
  const offset = directionMap[direction];

  return (
    <motion.div
      initial={{ opacity: 0, filter: "blur(6px)", ...offset }}
      whileInView={{ opacity: 1, filter: "blur(0px)", x: 0, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        delay,
        duration: 0.7,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Word-by-word scroll reveal for headings ───

interface ScrollRevealTextProps {
  text: string;
  highlight?: string;
  className?: string;
  highlightClassName?: string;
  delay?: number;
}

export function ScrollRevealText({
  text,
  highlight,
  className = "text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl",
  highlightClassName = "bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent",
  delay = 0,
}: ScrollRevealTextProps) {
  const words = text.split(" ");

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={{
        hidden: {},
        visible: {
          transition: { staggerChildren: 0.1, delayChildren: delay },
        },
      }}
    >
      {words.map((word, i) => (
        <motion.span
          key={i}
          className="mr-2 inline-block lg:mr-3"
          variants={{
            hidden: { opacity: 0, y: 30, filter: "blur(8px)" },
            visible: {
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
              transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
            },
          }}
        >
          {word}
        </motion.span>
      ))}
      {highlight && (
        <>
          <br />
          <motion.span
            className={`inline-block ${highlightClassName}`}
            variants={{
              hidden: { opacity: 0, y: 30, scale: 0.95, filter: "blur(8px)" },
              visible: {
                opacity: 1,
                y: 0,
                scale: 1,
                filter: "blur(0px)",
                transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
              },
            }}
          >
            {highlight}
          </motion.span>
        </>
      )}
    </motion.div>
  );
}

// ─── Animated divider line ───

export function ScrollRevealLine({
  delay = 0,
  className = "h-[2px] w-16 bg-amber-500",
}: {
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ scaleX: 0, originX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ delay, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    />
  );
}

// ─── Counter animation for numbers ───

export function ScrollRevealCounter({
  value,
  suffix = "",
  className = "text-4xl font-extrabold text-amber-500",
  delay = 0,
}: {
  value: number;
  suffix?: string;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.span
      className={className}
      initial={{ opacity: 0, scale: 0.5 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ delay, duration: 0.5, type: "spring", stiffness: 200 }}
    >
      {value.toLocaleString()}
      {suffix}
    </motion.span>
  );
}
