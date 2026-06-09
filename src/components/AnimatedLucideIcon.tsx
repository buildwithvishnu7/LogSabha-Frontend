import { type ComponentType } from "react";
import { motion } from "motion/react";
import type { LucideProps } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  type IconAnimation,
  iconAnimations,
} from "@/lib/icon-animations";

interface AnimatedLucideIconProps {
  icon: ComponentType<LucideProps>;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
  animation?: IconAnimation;
}

export function AnimatedLucideIcon({
  icon: Icon,
  size = 20,
  className,
  style,
  animation = "breathe",
}: AnimatedLucideIconProps) {
  const config = iconAnimations[animation];

  if (animation === "static") {
    return (
      <span className={cn("inline-flex", className)} style={style}>
        <Icon size={size} />
      </span>
    );
  }

  return (
    <motion.span
      className={cn("inline-flex", className)}
      style={style}
      animate={config.animate}
      transition={config.transition as any}
    >
      <Icon size={size} />
    </motion.span>
  );
}
