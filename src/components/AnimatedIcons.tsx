import { motion } from "motion/react";

interface IconProps {
  className?: string;
  size?: number;
}

/* ─── Search — magnifier tilts and scans as if looking around ─── */
export function AnimatedSearchIcon({ size = 18, className }: IconProps) {
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
      style={{ overflow: "visible" }}
    >
      <motion.g
        style={{ transformOrigin: "19px 19px" }}
        animate={{ rotate: [0, -20, 0, 15, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <circle cx="11" cy="11" r="8" />
        <line x1="16.65" y1="16.65" x2="21" y2="21" />
      </motion.g>
      <motion.circle
        cx="11"
        cy="11"
        r="8"
        fill="none"
        strokeOpacity="0.3"
        animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0, 0.3] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "11px 11px" }}
      />
    </motion.svg>
  );
}

/* ─── User — head pulses to signify presence / active account ─── */
export function AnimatedUserIcon({ size = 18, className }: IconProps) {
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
      style={{ overflow: "visible" }}
    >
      <motion.circle
        cx="12"
        cy="7"
        r="4"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "12px 7px" }}
      />
      <motion.circle
        cx="12"
        cy="7"
        r="4"
        fill="none"
        strokeOpacity="0.3"
        animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "12px 7px" }}
      />
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    </motion.svg>
  );
}

/* ─── Globe — meridian lines shift to simulate rotation ─── */
export function AnimatedGlobeIcon({ size = 16, className }: IconProps) {
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
      style={{ overflow: "visible" }}
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <motion.path
        d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"
        animate={{ scaleX: [1, 0.3, -1, -0.3, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "12px 12px" }}
      />
    </motion.svg>
  );
}
