import { useEffect, useRef, type ComponentType } from "react";
import type { AnimatedIconHandle, AnimatedIconProps } from "@/components/ui/types";

/**
 * Wraps an ItsHover animated icon and loops its action animation
 * at a given interval. Perfect for ambient/decorative icons that
 * should continuously perform their characteristic action.
 *
 * For hover-only icons, use the ItsHover component directly.
 */
interface LoopingIconProps extends Omit<AnimatedIconProps, "ref"> {
  /** The ItsHover icon component (e.g., HeartIcon, MagnifierIcon) */
  icon: ComponentType<AnimatedIconProps & { ref?: React.Ref<AnimatedIconHandle> }>;
  /** Interval between animation loops in ms (default: 3000) */
  interval?: number;
  /** Initial delay before first loop in ms (default: 0) */
  delay?: number;
}

export function LoopingIcon({
  icon: Icon,
  interval = 3000,
  delay = 0,
  ...iconProps
}: LoopingIconProps) {
  const iconRef = useRef<AnimatedIconHandle>(null);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    let intervalId: ReturnType<typeof setInterval>;

    // Start first animation after delay
    timeoutId = setTimeout(() => {
      iconRef.current?.startAnimation();
      // Then loop at interval
      intervalId = setInterval(() => {
        iconRef.current?.startAnimation();
      }, interval);
    }, delay);

    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    };
  }, [interval, delay]);

  return <Icon ref={iconRef} {...iconProps} />;
}
