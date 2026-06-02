import { motion } from "motion/react";

interface IconProps {
  className?: string;
  size?: number;
}

const loop = (delay: number) => ({
  animate: {
    pathLength: [0, 1] as number[],
    opacity: [0.15, 1] as number[],
  },
  transition: {
    duration: 2,
    repeat: Infinity,
    repeatType: "reverse" as const,
    ease: "easeInOut",
    delay,
  },
});

export function AnimatedSearchIcon({ size = 18, className }: IconProps) {
  const circle = loop(0);
  const handle = loop(0.4);

  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <motion.circle
        cx="11"
        cy="11"
        r="8"
        animate={circle.animate}
        transition={circle.transition}
      />
      <motion.line
        x1="16.65"
        y1="16.65"
        x2="21"
        y2="21"
        animate={handle.animate}
        transition={handle.transition}
      />
    </motion.svg>
  );
}

export function AnimatedUserIcon({ size = 18, className }: IconProps) {
  const head = loop(0);
  const body = loop(0.5);

  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <motion.circle
        cx="12"
        cy="7"
        r="4"
        animate={head.animate}
        transition={head.transition}
      />
      <motion.path
        d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"
        animate={body.animate}
        transition={body.transition}
      />
    </motion.svg>
  );
}

export function AnimatedGlobeIcon({ size = 16, className }: IconProps) {
  const outer = loop(0);
  const equator = loop(0.3);
  const meridian = loop(0.6);

  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <motion.circle
        cx="12"
        cy="12"
        r="10"
        animate={outer.animate}
        transition={outer.transition}
      />
      <motion.line
        x1="2"
        y1="12"
        x2="22"
        y2="12"
        animate={equator.animate}
        transition={equator.transition}
      />
      <motion.path
        d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"
        animate={meridian.animate}
        transition={meridian.transition}
      />
    </motion.svg>
  );
}
