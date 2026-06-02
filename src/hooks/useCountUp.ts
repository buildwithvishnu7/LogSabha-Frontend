import { useState, useEffect, useRef, useCallback } from "react";

export function useCountUp(end: number, duration: number = 3500) {
  const [count, setCount] = useState(0);
  const [trigger, setTrigger] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  // Observe viewport visibility — re-triggers on scroll in/out
  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          setTrigger((t) => t + 1);
        } else {
          setIsVisible(false);
          setCount(0);
        }
      },
      { threshold: 0.3 },
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  // Animate count on trigger (scroll into view OR manual replay)
  useEffect(() => {
    if (!isVisible && trigger === 0) return;
    if (trigger === 0) return;

    setCount(0);
    let startTime: number | null = null;
    let animationFrame: number;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(step);
      } else {
        setCount(end);
      }
    };

    animationFrame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrame);
  }, [trigger, end, duration]);

  // Manual replay — call this on hover
  const replay = useCallback(() => {
    setTrigger((t) => t + 1);
  }, []);

  return { count, ref, replay };
}
