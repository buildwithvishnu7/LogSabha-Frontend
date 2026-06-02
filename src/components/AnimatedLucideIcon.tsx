import { useRef, useEffect, type ComponentType } from "react";
import type { LucideProps } from "lucide-react";
import { cn } from "@/lib/utils";

interface AnimatedLucideIconProps {
  icon: ComponentType<LucideProps>;
  size?: number;
  className?: string;
}

export function AnimatedLucideIcon({
  icon: Icon,
  size = 20,
  className,
}: AnimatedLucideIconProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const shapes = el.querySelectorAll(
      "path, circle, line, polyline, polygon, rect",
    );
    shapes.forEach((shape, i) => {
      shape.setAttribute("pathLength", "1");
      const s = (shape as SVGElement).style;
      s.strokeDasharray = "1";
      s.strokeDashoffset = "1";
      s.animation = `iconDraw 2s ease-in-out ${i * 0.15}s infinite alternate`;
    });
  }, []);

  return (
    <span ref={ref} className={cn("inline-flex", className)}>
      <Icon size={size} />
    </span>
  );
}
