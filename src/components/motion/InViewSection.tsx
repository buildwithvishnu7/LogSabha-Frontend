import { createContext, useContext, useRef } from "react";
import { useInView } from "motion/react";

/**
 * Broadcasts whether the enclosing section is currently on-screen so that
 * ambient `repeat: Infinity` Framer Motion animations can pause when scrolled
 * out of view.
 *
 * Framer's `animate` loops keep firing requestAnimationFrame even when the
 * element is off-screen. With ~95 infinite loops across the homepage that keeps
 * the main thread busy for sections the user can't see. Gating each loop's
 * `animate` value on this context stops the loop while off-screen and resumes it
 * on return — visuals are identical whenever the section is actually visible.
 *
 * Defaults to `true` so any motion element rendered outside a provider keeps
 * animating (safe fallback — never accidentally frozen on screen).
 */
const SectionInViewContext = createContext(true);

export function useSectionInView(): boolean {
  return useContext(SectionInViewContext);
}

/**
 * Sets up the IntersectionObserver (via Framer's useInView) and returns the ref
 * to attach to the section root plus the current in-view state. Pair with
 * <SectionInViewProvider> to broadcast the state to descendants.
 *
 * `margin` starts animations slightly before the section scrolls into view so
 * there's no visible "pop" as loops resume.
 */
export function useInViewSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { margin: "200px 0px 200px 0px" });
  return { ref, inView };
}

export const SectionInViewProvider = SectionInViewContext.Provider;
