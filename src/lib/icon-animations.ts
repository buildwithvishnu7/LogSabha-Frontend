// ─── Contextual icon animation presets ───
// Each animation is tied to what the icon *represents*, not its shape.
// Icons are ALWAYS visible (min opacity 0.7+). Animation = subtle ambient motion.

export type IconAnimation =
  | "pulse"       // heartbeat — Heart, Like
  | "bounce"      // directional nudge — ArrowRight, ChevronUp
  | "spin"        // slow rotation — Globe, loading
  | "ring"        // wiggle/shake — Phone, Mail, Send (notification-like)
  | "breathe"     // gentle scale — Landmark, Target, generic info icons
  | "float"       // vertical drift — MapPin, Users (people/location)
  | "flicker"     // fast opacity shift — Flame, TrendingUp
  | "type"        // horizontal jitter — MessageCircle, Hash (chat/typing)
  | "scan"        // horizontal sweep — Search, Eye, Monitor
  | "wave"        // gentle rock — Share2 (social/wave)
  | "flip"        // subtle Y-axis tilt — BookOpen, Calendar, Clock
  | "slide-right" // nudge right — ArrowRight CTA
  | "static";     // no animation, always visible

export interface IconAnimationConfig {
  animate: Record<string, number[]>;
  transition: {
    duration: number;
    repeat: number;
    ease: string;
    delay?: number;
  };
}

export const iconAnimations: Record<IconAnimation, IconAnimationConfig> = {
  pulse: {
    animate: { scale: [1, 1.18, 1, 1.12, 1] },
    transition: { duration: 2.2, repeat: Infinity, ease: "easeInOut" },
  },
  bounce: {
    animate: { y: [0, -3, 0, -1.5, 0] },
    transition: { duration: 2, repeat: Infinity, ease: "easeInOut" },
  },
  spin: {
    animate: { rotate: [0, 360] },
    transition: { duration: 20, repeat: Infinity, ease: "linear" },
  },
  ring: {
    animate: { rotate: [0, -12, 12, -8, 8, -4, 0] },
    transition: { duration: 2.5, repeat: Infinity, ease: "easeInOut" },
  },
  breathe: {
    animate: { scale: [1, 1.08, 1] },
    transition: { duration: 3, repeat: Infinity, ease: "easeInOut" },
  },
  float: {
    animate: { y: [0, -3.5, 0, 1.5, 0] },
    transition: { duration: 3.5, repeat: Infinity, ease: "easeInOut" },
  },
  flicker: {
    animate: { opacity: [1, 0.65, 1, 0.8, 1], scale: [1, 1.05, 1, 1.02, 1] },
    transition: { duration: 1.8, repeat: Infinity, ease: "easeInOut" },
  },
  type: {
    animate: { x: [0, 1.5, -1, 0.5, 0] },
    transition: { duration: 2, repeat: Infinity, ease: "easeInOut" },
  },
  scan: {
    animate: { x: [0, 2.5, 0, -2.5, 0] },
    transition: { duration: 3, repeat: Infinity, ease: "easeInOut" },
  },
  wave: {
    animate: { rotate: [0, -8, 8, -5, 0] },
    transition: { duration: 2.8, repeat: Infinity, ease: "easeInOut" },
  },
  flip: {
    animate: { rotateY: [0, 12, 0, -8, 0] },
    transition: { duration: 3.5, repeat: Infinity, ease: "easeInOut" },
  },
  "slide-right": {
    animate: { x: [0, 3, 0] },
    transition: { duration: 1.8, repeat: Infinity, ease: "easeInOut" },
  },
  static: {
    animate: {},
    transition: { duration: 0, repeat: 0, ease: "linear" },
  },
};
